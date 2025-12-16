<template>
  <div class="min-w-0 flex-1 p-5">
    <div class="flex justify-between mb-6">
      <span class="trade-pnl-title text-3.5 leading-4.25 text-center text-[--main-text]">
        {{ t('profit3') }}（{{ intervalText }}）
      </span>
    </div>
    <ul class="mb-2.5 flex flex-col gap-3.5">
      <li
        v-for="{ label, key, negative } in profitList"
        :key="key"
        class="trade-pnl-stage-item flex items-center"
      >
        <span class="flex-shrink-0 text-3 font-500 text-[--main-text]">{{ label }}</span>
        <span
          class="flex-1 text-3 text-right"
          :class="{
            'text-[--up-color]': !negative,
            'text-[--down-color]': negative,
          }"
        >
          {{ txAnalysis.profit_range?.[key] }} ({{ getProfitRatio(key) }})
        </span>
      </li>
    </ul>
    <AveCharts
      ref="winProfitChart"
      :containerStyle="{
        height: '12px',
        margin: '0 -10px 24px',
      }"
      :xAxis="winProfit.xAxis"
      :yAxis="winProfit.yAxis"
      :series="winProfit.series"
    />
    <div
      class="flex justify-between items-center text-3.5 leading-4.25 text-center text-[--main-text] mb-12px"
    >
      <span>{{ t('bestToken2') }}({{ intervalText }})</span>
      <ButtonGroup
        v-model:active-value="bestTokenFilter"
        class="mt-[-5px]"
        :options="bestTokenOptions"
        @change="changeFilter"
      />
    </div>
    <div class="flex items-center justify-between">
      <div
        v-if="txAnalysis.best_token?.length <= 0"
        class="text-12px flex-1 text-center color-[--third-text]"
      >
        {{ $t('emptyNoData') }}
      </div>
      <div
        v-for="item in txAnalysis.best_token?.slice?.(0, 3)"
        :key="item.token"
        class="flex items-center gap-4px cursor-pointer"
        @click="navigateTo(`/token/${item.token}-${item.chain}`)"
      >
        <TokenImg
          chain-class="hidden"
          token-class="w-24px h-24px"
          :row="{
            token: item.token,
            chain: item.chain,
            logo_url: item.logo_url,
          }"
        />
        <div class="flex flex-col gap-4px text-12px color-[--main-text]">
          {{ item.symbol }}
          <span
            v-if="bestTokenFilter === BestTokenEnum.TOTAL_PROFIT"
            :class="getColorClass(item.total_profit)"
            >+${{ formatNumber(item.total_profit, 2) }}</span
          >
          <span v-else :class="getColorClass(item.total_profit_ratio)"
            >{{ Math.max(+formatNumber(item.total_profit_ratio, 1), 0.1) }}X</span
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getTxAnalysis } from '~/api/wallet'
import AveCharts from '@/components/charts/aveCharts.vue'

const { t } = useI18n()
const emit = defineEmits(['update:txAnalysis'])

const props = defineProps({
  interval: {
    type: String,
    default: '',
  },
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
const txAnalysis = ref({})
const BestTokenEnum = {
  TOTAL_RATIO: 'total_profit_ratio',
  TOTAL_PROFIT: 'total_profit',
}
const bestTokenFilter = ref(BestTokenEnum.TOTAL_PROFIT)
const winProfit = ref({
  xAxis: {
    type: 'value',
    min: 0,
    max: 100,
    show: false,
  },
  yAxis: {
    type: 'category',
    data: [''],
    show: false,
  },
  grid: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  series: [
    {
      key: 'profit_above_500_percent',
      type: 'bar',
      stack: 'background',
      data: [],
      itemStyle: {
        color: getCssVariable('--up-color'),
      },
      barWidth: 12,
    },
    {
      key: 'profit_200_500_percent',
      type: 'bar',
      stack: 'background',
      data: [],
      itemStyle: {
        color: hexToRgba(getCssVariable('--up-color'), 0.6),
      },
      barWidth: 12,
    },
    {
      key: 'profit_0_200_percent',
      type: 'bar',
      stack: 'background',
      data: [],
      itemStyle: {
        color: hexToRgba(getCssVariable('--up-color'), 0.3),
      },
      barWidth: 12,
    },
    {
      key: 'profit_neg50_0_percent',
      type: 'bar',
      stack: 'background',
      data: [],
      itemStyle: {
        color: hexToRgba(getCssVariable('--down-color'), 0.6),
      },
      barWidth: 12,
    },
    {
      key: 'profit_neg100_neg50_percent',
      type: 'bar',
      stack: 'background',
      data: [],
      itemStyle: {
        color: getCssVariable('--down-color'),
      },
      barWidth: 12,
    },
  ],
})

const bestTokenOptions = computed(() => [
  {
    id: BestTokenEnum.TOTAL_RATIO,
    name: t('ROI'),
  },
  {
    id: BestTokenEnum.TOTAL_PROFIT,
    name: t('profit3'),
  },
])
const chainAddress = computed(() => [props.chain, props.address])
const profitList = computed(() => [
  {
    label: '＞500%',
    key: 'profit_above_500_percent',
    negative: false,
  },
  {
    label: '200% - 500%',
    key: 'profit_200_500_percent',
    negative: false,
  },
  {
    label: '0% - 200%',
    key: 'profit_0_200_percent',
    negative: false,
  },
  {
    label: '-50% - 0%',
    key: 'profit_neg50_0_percent',
    negative: true,
  },
  {
    label: '＜ -50%',
    key: 'profit_neg100_neg50_percent',
    negative: true,
  },
])

// 方法
const onGetTxAnalysis = () => {
  const { address, chain, interval } = props
  getTxAnalysis({
    user_address: address,
    user_chain: chain,
    interval,
  })
    .then((res) => {
      txAnalysis.value = res || {}
      formatWinProfit()
      emit('update:txAnalysis', res || {})
    })
    .catch((err) => {
      console.log(err)
    })
}

const formatWinProfit = () => {
  const sum = txAnalysis.value.profit_range?.total_count
  let firstNonEmptyIndex = undefined
  let lastNonEmptyIndex = undefined
  const series = winProfit.value.series.map((el, idx) => {
    const num = txAnalysis.value.profit_range?.[el.key]
    let data = 0
    if (typeof sum === 'number' && sum > 0 && typeof num === 'number') {
      data = Math.floor((num / sum) * 100)
    }
    if (data > 0) {
      lastNonEmptyIndex = idx
      if (typeof firstNonEmptyIndex === 'undefined') {
        firstNonEmptyIndex = idx
      }
    }
    return {
      ...el,
      data: [data],
      itemStyle: {
        ...el.itemStyle,
        borderRadius: [0, 0, 0, 0],
      },
    }
  })

  if (typeof firstNonEmptyIndex !== 'undefined' && typeof lastNonEmptyIndex !== 'undefined') {
    if (firstNonEmptyIndex === lastNonEmptyIndex) {
      series[firstNonEmptyIndex].itemStyle.borderRadius = [6, 6, 6, 6]
    } else {
      series[firstNonEmptyIndex].itemStyle.borderRadius = [6, 0, 0, 6]
      series[lastNonEmptyIndex].itemStyle.borderRadius = [0, 6, 6, 0]
    }
  }
  winProfit.value.series = series
}

const getProfitRatio = (key) => {
  const num = txAnalysis.value.profit_range?.[key]
  const sum = txAnalysis.value.profit_range?.total_count
  if (typeof num !== 'number' || typeof sum !== 'number' || sum === 0) {
    return '--'
  }
  return formatNumber((num * 100) / sum, 2) + '%'
}

const changeFilter = () => {}

// 监听器
watch(() => props.interval, onGetTxAnalysis)
watch(chainAddress, onGetTxAnalysis)

// 生命周期
onGetTxAnalysis()
</script>
<style scoped lang="scss">
/* Add any necessary base styles that can't be expressed with UnoCSS here */
.trade-pnl-stage-item:before {
  margin-right: 2px;
  content: '';
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--up-color);
}
.trade-pnl-stage-item:nth-child(2):before {
  opacity: 0.6;
}
.trade-pnl-stage-item:nth-child(3):before {
  opacity: 0.3;
}
.trade-pnl-stage-item:nth-child(4):before {
  opacity: 0.6;
  background-color: var(--down-color);
}
.trade-pnl-stage-item:nth-child(5):before {
  background-color: var(--down-color);
}
</style>
