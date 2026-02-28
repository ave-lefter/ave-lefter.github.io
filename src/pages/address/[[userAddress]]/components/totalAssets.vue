<template>
  <div>
    <div class="color-[--main-text] lh-20px mb-12px">
      {{ $t('totalAssets') }}
    </div>
    <div class="flex gap-2 items-center mb-4 text-6 leading-7.5 font-bold">
      <strong class="text-6 leading-7.5 text-[--up-color]">
        {{ uSymbol }}{{ total_balance }} {{ main_token_symbol }}
      </strong>
      <el-switch
        style="--el-color-white:transparent;"
        :model-value="globalStore.isUSDT"
        class="custom-switch"
        :inactive-value="true"
        :active-value="false"
        @update:model-value="globalStore.isUSDT = !globalStore.isUSDT"
      >
        <template #active-action>
          <ChainToken :chain="chain" :width="16" />
        </template>
        <template #inactive-action>
          <span
            class="flex w-full h-full items-center justify-center text-2.5 rounded-full text-[--main-text] bg-[--icon-color]"
            >$</span
          >
        </template>
      </el-switch>
    </div>
    <div class="flex justify-between items-center color-[--secondary-text] text-12px mb-8px">
      {{ props.intervalText }} {{ $t('winRate2') }}
      <span class="text-[--up-color] text-24px lh-30px font-bold">
        {{ formatNumber(txAnalysis.win_rate || 0, 2) }}%
      </span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('amountU') }}
      <span class="text-[--up-color] text-14px"> {{ addUnit(totalData.volume) }}</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('txns') }}
      <span class="text-14px color-[--third-text]">
        <span class="text-[--up-color]">{{ props.txAnalysis.purchase }}</span> /
        <span class="text-[--down-color]">{{ props.txAnalysis.sold }}</span>
      </span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('totalBuy2') }}
      <span class="text-[--up-color] text-14px"> {{ addUnit(totalData.purchase) }}</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('totalSell2') }}
      <span class="text-[--down-color] text-14px"> {{ addUnit(totalData.sold) }}</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('profitTokenCount') }}
      <span class="text-[--up-color] text-14px">{{ profitData.takeProfitCount }}</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('totalTokenCount') }}
      <span class="text-[--up-color] text-14px">{{ profitData.totalCount }}</span>
    </div>
  </div>
</template>

<script setup>
import { BigNumber } from 'bignumber.js'
import { getBalanceAnalysis } from '~/api/wallet'

const globalStore = useGlobalStore()
const props = defineProps({
  address: {
    type: String,
    default: '',
  },
  chain: {
    type: String,
    default: '',
  },
  intervalText: {
    type: String,
    default: '',
  },
  interval: {
    type: String,
    default: '',
  },
  txAnalysis: {
    type: Object,
    default: () => ({}),
  },
})
const balanceAnalysis = ref({
  main_token_symbol: 'BNB',
  total_balance_without_risk: '1000000',
  main_token_price: 10000,
})
const uSymbol = computed(() => {
  return globalStore.isUSDT ? '$' : ''
})

const main_token_symbol = computed(() => {
  return globalStore.isUSDT ? '' : balanceAnalysis.value.main_token_symbol
})

const main_token_price = computed(() => {
  return globalStore.isUSDT ? 1 : Number(balanceAnalysis.value.main_token_price || 0)
})

const getValue = (sourceVal) => {
  return globalStore.isUSDT ? sourceVal : sourceVal.div(props.txAnalysis.main_token_price || 0)
}

const addUnit = (value) => {
  return globalStore.isUSDT ? '$' + value : value + ' ' + props.txAnalysis.main_token_symbol
}

const totalData = computed(() => {
  const purchaseUsd = new BigNumber(props.txAnalysis.purchase_usd || 0)
  const soldUsd = new BigNumber(props.txAnalysis.sold_usd || 0)
  const resultUsd = purchaseUsd.plus(soldUsd)
  return {
    volume: formatNumber(getValue(resultUsd).toString(), 2),
    purchase: formatNumber(getValue(purchaseUsd).toString(), 2),
    sold: formatNumber(getValue(soldUsd).toString(), 2),
  }
})

const profitData = computed(() => {
  const { profit_range = {} } = props.txAnalysis
  const takeProfitCount =
    profit_range.profit_above_500_percent +
    profit_range.profit_200_500_percent +
    profit_range.profit_0_200_percent
  return {
    totalCount: profit_range?.total_count || 0,
    takeProfitCount,
  }
})

const total_balance = computed(() => {
  const formatMap = {
    solana: 2,
    bsc: 4,
    eth: 4,
    base: 4,
  }
  const { total_balance_without_risk } = balanceAnalysis.value

  return formatNumber((Number(total_balance_without_risk) || 0) / Number(main_token_price.value), {
    decimals: globalStore.isUSDT ? 4 : formatMap[props.chain],
    limit: 20,
  })
})

const getBalance = async () => {
  const params = {
    user_address: props.address,
    user_chain: props.chain,
    interval: props.interval,
  }
  const res = await getBalanceAnalysis(params)
  balanceAnalysis.value = res
}

getBalance()
</script>

<style scoped lang="scss">
</style>
