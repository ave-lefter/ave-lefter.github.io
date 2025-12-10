<template>
  <div class="p-5 flex justify-between mr-5 flex-1 rounded-2 bg-[--secondary-bg]">
    <div>
      <div class="flex gap-2 items-center mb-5 text-6 leading-7.5 font-bold">
        <strong class="text-6 leading-7.5 text-[--main-text]">
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
      <p class="m-0 mb-2 leading-5 text-3.5 text-[--secondary-text]">
        {{ $t('totalPnL2') }}（{{ intervalText }}）
        <AveNumber :value="statistics.profit" :signVisible="globalStore.isUSDT">
          {{ formatNumber(Math.abs((statistics.profit ?? 0) / main_token_price), 2) }}
          {{ main_token_symbol }}
        </AveNumber>
        <AveNumber :value="statistics.profit_ratio" class="ml-1">
          {{ formatNumber(Math.abs((statistics?.profit_ratio ?? 0) * 100), 1) }}%
        </AveNumber>
      </p>
      <p class="m-0 mb-2 leading-5 text-3.5 text-[--secondary-text]">
        {{ $t('winRate2') }}（{{ intervalText }}）
        <AveNumber :value="statistics.win_rate">
          {{ formatNumber(Math.abs(statistics.win_rate ?? 0), 1) }}%
        </AveNumber>
      </p>
    </div>
    <div class="flex flex-col justify-between flex-shrink-0">
      <div>
        <div class="statistic-pnl mb-5 text-4 leading-8 text-right" />
        <AveEmpty v-if="pnl.dataset.source.length <= 0" style="height: 80px" :showText="false" />
        <AveCharts
          v-else
          ref="profit"
          :containerStyle="{
            height: '80px',
            minWidth: '280px',
          }"
          :xAxis="pnl.xAxis"
          :series="pnl.series"
          :dataset="pnl.dataset"
          :tooltip="pnl.tooltip"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//组件
import AveCharts from '@/components/charts/aveCharts.vue'
import dayjs from 'dayjs'
import { getBalanceAnalysis, getWalletBasicInfo } from '@/api/wallet'

import AveEmpty from '@/components/aveEmpty.vue'

import ChainToken from '@/components/chainToken.vue'
import AveNumber from '../components/Number.vue'
import { addAttention, deleteAttention } from '~/api/attention'

const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  interval: {
    type: String,
    default: '',
  },
  isSelfAddress: Boolean,
  intervalText: {
    type: String,
    default: '',
  },
})

const { t } = useI18n()

const { address, chain, interval, intervalText } = toRefs(props)
const globalStore = useGlobalStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const themeStore = useThemeStore()

const { userInfo } = storeToRefs(useBotStore())

interface Statistics {
  wallet_logo?: any
  remark?: string
  x_name?: string
  x_url?: string
  x_followers?: number
  is_wallet_address_fav?: number
  total_profit_ratio?: number
  total_profit?: number | string
  total_win_rate?: number | string
  win_rate?: number
  profit?: number
  profit_ratio?: number
  wallet_age?: number | string
  [key: string]: any
}

// Ensure all required fields from GetTokenStatisticsResponse are present with default values
// If GetTokenStatisticsResponse is exported from an API types file, import it here:

const statistics = ref<Statistics>({
  wallet_logo: {},
  x_logo: '',
  chain: '',
  newTags: [],
  balance_amount: 0,
  // Add all other required fields from GetTokenStatisticsResponse with sensible defaults
  // Example:
  // fieldName: defaultValue,
  // ...
})

const remark = ref({
  value: '',
  isEdit: false,
  loading: false,
})

const balanceAnalysis = ref<Awaited<ReturnType<typeof getBalanceAnalysis>>>({
  profit: [],
  total_balance_without_risk: undefined,
})

const pnl = computed(() => {
  const profit: Array<{
    time: string
    value: string
    negative?: boolean
    absValue?: number
  }> = balanceAnalysis.value.profit || []
  const xData: any[] = []
  profit.forEach((el) => {
    xData.push(el.time)
    el.negative = Number(el.value) < 0
    el.absValue = Math.abs(Number(el.value))
  })
  console.log('pnl', xData)
  return {
    xAxis: {
      data: xData,
    },
    dataset: {
      source: profit,
      dimensions: ['time', 'absValue'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        z: 0, // 层级（权重）
        lineStyle: {
          type: 'solid', // 将虚线改为实线
          width: 10, // 设置背景的宽度
          color: 'rgb(179, 179, 179,0.3)',
        },
      },
      padding: 8,
      backgroundColor: isDark.value ? 'rgba(0,0,0,.8)' : '#fff',
      borderWidth: 0,
      formatter: (params: { data: any }[]) => {
        const tooltipData =
          (params[0].data as {
            value: number
            absValue: number
            time: string
            negative?: boolean
          }) || {}
        let color,
          sign = ''
        if (tooltipData.value > 0) {
          color = getCssVariable('--up-color')
          sign = '+'
        } else if (tooltipData.value < 0) {
          color = getCssVariable('--down-color')
          sign = '-'
        }
        return `<div style="font-size: 12px;">
             <div>
                 <span style="color:${color}">${sign}${uSymbol.value}${formatNumber(
                   tooltipData?.absValue / main_token_price.value,
                   1
                 )}${main_token_symbol.value}</span>
             </div>
             <div>
                  ${dayjs(tooltipData.time).format('MM/DD')}
             </div>
         </div>`
      },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 10,
        barMinHeight: 2,
        itemStyle: {
          color: (params: { value: { value: number; negative: any } }) => {
            if (Math.abs(params.value?.value) > 0) {
              return params.value?.negative
                ? getCssVariable('--down-color')
                : getCssVariable('--up-color')
            }
            return isDark.value ? '#999' : '#E5E5E5'
          },
        },
      },
    ],
  }
})

const isDark = computed(() => {
  return themeStore.isDark
})

const selfAddress = computed(() => {
  return botStore?.evmAddress || walletStore?.address || ''
})

// const injecteIsVolUSDT = inject<Ref<boolean>>('isVolUSDT')

const total_balance = computed(() => {
  const formatMap: Record<string, number> = {
    solana: 2,
    bsc: 4,
    eth: 4,
    base: 4,
  }
  const { total_balance_without_risk } = balanceAnalysis.value

  return formatNumber((Number(total_balance_without_risk) || 0) / Number(main_token_price.value), {
    decimals: globalStore.isUSDT ? 4 : formatMap[chain.value],
    limit: 20,
  })
})

const main_token_price = computed(() => {
  return globalStore.isUSDT ? 1 : Number(balanceAnalysis.value.main_token_price || 0)
})

const uSymbol = computed(() => {
  return globalStore.isUSDT ? '$' : ''
})

const main_token_symbol = computed(() => {
  return globalStore.isUSDT ? '' : balanceAnalysis.value.main_token_symbol
})

watch(
  () => props.interval,
  (newVal: any) => {
    if (newVal) {
      onGetBalanceAnalysis()
    }
  }
)

watch(
  () => props.address,
  (newVal: any) => {
    if (newVal) {
      onGetWalletBasicInfo()
      onGetBalanceAnalysis()
    }
  }
)

onMounted(() => {
  onGetWalletBasicInfo()
  onGetBalanceAnalysis()
})

async function onGetWalletBasicInfo() {
  const params = {
    user_address: address.value,
    self_address: selfAddress.value,
    user_chain: chain.value,
  }
  const res = await getWalletBasicInfo(params)
  console.log(res, 'res=>')
  statistics.value = {
    ...statistics.value,
    ...(res || {}),
  }
  remark.value = res.remark || userInfo.value?.name
}

async function onGetBalanceAnalysis() {
  const params = {
    user_address: address.value,
    user_chain: chain.value,
    interval: interval.value,
  }
  getBalanceAnalysis(params).then((res) => {
    balanceAnalysis.value = res
  })
}

function mergeStatistics(data: any) {
  const d = {
    ...statistics.value,
    ...data,
  }
  statistics.value = d
}
defineExpose({
  mergeStatistics,
})
</script>
<style scoped>
.custom-switch {
  --el-switch-off-color: var(--main-input-button-bg);
  --el-switch-on-color: var(--icon-color);
}

::v-deep .el-switch__action {
  background-color: transparent;
}
::v-deep .max-w-42px {
  max-width: 200px !important;
}
</style>
