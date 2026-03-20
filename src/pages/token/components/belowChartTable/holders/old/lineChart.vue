<template>
    <div v-loading="loading" class="chart-container">
      <div :id="chartId" :style="{ height: chartHeight || '162px', width: '100%' }" />
    </div>
  </template>

  <script setup lang="ts">
  import { formatNumber } from '@/utils/formatNumber'
  import { getAddressAndChainFromId } from '@/utils/index'
  import { filterChartColor } from '@/utils/holders'
  import { filterLanguage } from '~/pages/token/components/kLine/utils'
  import * as echarts from '@/utils/echarts'
  import type { BotChain } from '~/utils/types'

  // 提取为常量，避免每次 computed 重算时创建新数组
  const RATIO_KEYS = new Set(['insider_balance_ratio', 'sniper_balance_ratio', 'dev_balance_ratio', 'smartmoney_balance_ratio', 'kol_balance_ratio'])


  interface DataItem {
    date: string
    total_amount?: number
    top10_amount?: number
    top100_amount?: number
    [key: string]: any
  }

  interface SeriesOption {
    k: number
    color: string
    label: string
    value: string
    color1: string
  }

  const props = defineProps<{
    dataList: DataItem[],
    showSeries: boolean[],
    loading: boolean,
    chartHeight?: string
  }>()

  // 固定 id 在多实例时会冲突，用随机 id
  const chartId = `chart_holder_${Math.random().toString(36).slice(2)}`
  let myChart: echarts.ECharts | null = null

  const route = useRoute()
  const { t } = useI18n()
  const { token } = storeToRefs(useTokenStore())
  const { globalConfig } = storeToRefs(useConfigStore())
  const { mode } = storeToRefs(useGlobalStore())
  const globalStore = useGlobalStore()
  // 获取语言、工具函数
  const language = computed(() => useLocaleStore().locale)


  const option = computed<SeriesOption[]>(() => {
    let arr: SeriesOption[] = []
    const { chain } = getAddressAndChainFromId(route.params.id as string) || token?.value?.chain || ''
    const c =
    globalConfig.value?.chains_support_data_analysis_insider_sniper_V3
    const supportTags = c?.[chain as BotChain] || []

    if (supportTags) {
      arr = supportTags.map((i: any, index: number) => ({
        k: index,
        color: filterChartColor(i.type)?.color || '',
        label: i?.[filterLanguage(language.value)] || '',
        value: filterChartColor(i.type)?.data || '',
        color1: filterChartColor(i.type)?.areaStyleColor || '',
      }))
    }

    return [
      {
        k: 4,
        color: '#FFCC00',
        label: t('topN', { n: 10 }) + t('ratio'),
        value: 'top10_amount',
        color1: '#38497d'
      },
      {
        k: 2,
        color: '#FB6300',
        label: t('topN', { n: 100 }) + t('ratio'),
        value: 'top100_amount',
        color1: '#5b3f52'
      },
      ...arr
    ]
  })

  const dataX = computed(() => props.dataList.map(i => i.date))

  const series = computed(() =>
    (option.value.map((opt, k) => ({
      name: opt.label,
      type: 'line',
      z: 10 - k,
      smooth: true,
      symbol: 'none',
      itemStyle: { color: opt.color },
      lineStyle: { width: 2 },
      emphasis: { disabled: true, focus: 'series' },
      tooltip: {
        valueFormatter: (value: number) => `${formatNumber(value || 0, 2)}%`,
        textStyle: { fontSize: 10, color: '#333' }
      },
        data: props.dataList.map(j => {
          if (RATIO_KEYS.has(opt.value)) {
          return opt.value ? (j?.[opt.value] * 100 || 0) : 0
        } else {
          return j.total_amount ? j[opt.value] * 100 / j.total_amount : 0
        }
      })
    })))
  )

  function initChart() {
    const dom = document.getElementById(chartId)
    if (!dom) return

    if (!myChart) {
      myChart = echarts.init(dom)
    }

    // const isLight = mode.value === 'light'

    myChart?.setOption({
      legend: { show: false },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'var(--dialog-bg)',
        textStyle: {
          fontSize: 10,
          color: 'var(--secondary-text)',
          fontFamily: 'Outfit-Medium'
        },
        borderWidth: 0
      },
      grid: {
        left: '0',
        right: '25px',
        top: '3%',
        bottom: '0',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dataX.value,
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color:  mode.value === 'light'? '#8ca0c3' : '#566275',
          fontFamily: 'Outfit-Medium'
        }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color:  mode.value === 'light'? '#8ca0c3' : '#566275',
          fontFamily: 'Outfit-Medium',
          formatter: '{value}%'
        },
        splitLine: { show: false },
        min: 0,
        max: (val: { max: number }) => Math.ceil(val.max)
      },
      series: series.value
    })

    if (props.dataList.length > 0) {
      myChart?.hideLoading()
    }
  }

  function updateLegendSelection(val: boolean, index: number) {
    const label = option.value[index]?.label
    if (!myChart || !label) return

    myChart.dispatchAction({
      type: val ? 'legendSelect' : 'legendUnSelect',
      name: label
    })
  }
  onMounted(() => {
    nextTick(() => {
      initChart()
    })
  })
  onBeforeUnmount(() => {
    if (myChart) {
      myChart.dispose()
      myChart = null
    }
  })
  watch(() => props.dataList, () => initChart())
  watch(() => props.loading, (val) => {
    if (!myChart) return
    if (val) {
      myChart.showLoading({ maskColor: 'rgba(255,255,255,0)', text: '' })
    } else {
      myChart.hideLoading()
    }
  })
  // 合并 showLeft/showRight 为一个 watch
  watch([() => globalStore.showLeft, () => globalStore.showRight], async () => {
    await nextTick()
    myChart?.resize()
  })
  // 监听 mode.value，修复原来监听 ref 对象本身导致不触发的问题
  watch(() => mode.value, () => initChart())
  // 合并 showSeries 为一个 deep watch
  watch(() => props.showSeries, (newVal) => {
    newVal.forEach((v, idx) => updateLegendSelection(v, idx))
  }, { deep: true })
  </script>

  <style scoped lang="scss">
  .chart-container {
    margin: 0;
  }
  .chart-title {
    display: flex;
    align-items: center;
    padding: 0 10px;
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      &.color-558BED {
        background-color: #558bed;
      }
      &.color-7673F3 {
        background-color: #7673f3;
      }
    }
    .amount {
      font-size: 14px;
      color: #eaecef;
      margin-left: 8px;
    }
    .label {
      font-size: 12px;
      color: #878fbc;
      margin-left: 13px;
    }
  }
  </style>
