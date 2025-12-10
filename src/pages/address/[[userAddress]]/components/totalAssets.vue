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
      {{ $t('winRate2') }}
      <span class="text-[--up-color] text-24px lh-30px font-bold">76.83%</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('amountU') }}
      <span class="text-[--up-color] text-14px">443.27 SOL</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('txns') }}
      <span class="text-14px color-[--third-text]">
        <span class="text-[--up-color]">19</span> /
        <span class="text-[--down-color]">62</span>
      </span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('totalBuy2') }}
      <span class="text-[--up-color] text-14px">443.27 SOL</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('totalSell2') }}
      <span class="text-[--down-color] text-14px">443.27 SOL</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('profitTokenCount') }}
      <span class="text-[--up-color] text-14px">16</span>
    </div>
    <div
      class="flex justify-between items-center color-[--secondary-text] lh-20px text-12px mb-8px"
    >
      {{ props.intervalText }} {{ $t('totalTokenCount') }}
      <span class="text-[--up-color] text-14px">34</span>
    </div>
  </div>
</template>

<script setup>
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
</script>

<style scoped lang="scss"></style>
