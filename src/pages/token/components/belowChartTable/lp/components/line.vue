<template>
  <div class="chart-container">
    <div :id="chartId" :style="{ height: '245px', width: '100%' }" />
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { v4 as uuidv4 } from 'uuid'
const { t } = useI18n()
// Props
const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  showSeries: {
    type: Array,
    default: () => []
  },
  loading: Boolean,
  showLeft: Boolean
})

const {mode,lang} = storeToRefs(useGlobalStore())
// 使用 Vuex

// Data
const chartId = ref(`chart-${uuidv4()}`)

// Computed
const option = computed(() => [
  {
    k: 1,
    color: '#12B886',
    label: t('add'), // 替换为实际的翻译逻辑
    value: 'addliquidity_total',
    areaStyle: {
      opacity: 0.8,
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#12B886'
        },
        {
          offset: 1,
          color: '#0A0B0D'
        }
      ])
    },
  },
  {
    k: 2,
    color: '#F6465D',
    label: t('remove'), // 替换为实际的翻译逻辑
    value: 'removeliquidity_total',
    areaStyle: {
      opacity: 0.8,
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: '#F6465D'
        },
        {
          offset: 1,
          color: '#0A0B0D'
        }
      ])
    },
  }
])

const dataX = computed(() => props.dataList.map(i => i.time))

const series = computed(() =>
  option.value.map(i => ({
    name: i.label,
    symbol: 'none',
    type: 'bar',
    barWidth:'10',
    z: 1,
    symbol: 'none',
    itemStyle: {
      color: i.color
    },
    lineStyle: {
      width: 2
    },
    emphasis: {
      disabled: true,
      focus: 'series'
    },
    areaStyle: i.areaStyle,
    data: props.dataList.map(j => j[i.value])
  }))
)

// Methods
const init = () => {
  if (!document.getElementById(chartId.value)) return

  let chart = echarts.getInstanceByDom(document.getElementById(chartId.value))
  if (!chart) {
    chart = echarts.init(document.getElementById(chartId.value),null, { renderer: 'svg' })
  }

  chart.hideLoading()
  chart.showLoading({
    maskColor: 'rgba(255, 255, 255, 0)',
    text: ''
  })

  const chartOption = {
    legend: {
      show: true,
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      icon: 'circle',
      textStyle: {
        color: '#787B86',
        fontSize: 12
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: mode.value  === 'light' ? '#F5F5F5' : '#17191C',
      textStyle: {
        fontSize: 10,
        color: '#959A9F',
        fontFamily: 'Poppins'
      },
      borderWidth: 0,
      // valueFormatter: value => '$'+formatNumber2(value || 0, 2), // 替换为实际的格式化函数
      formatter: function (params) {
        let result = params[0].name + '<br>' // 标题
        params.forEach(item => {
          result += `${item.marker} ${item.seriesName}: <span style="color:${mode.value === 'light' ? '#17191C' : '#F5F5F5'}">${formatNumber(item.value || 0, 2)}</span><br>`// 每行内容
        })
        return result
      },
      appendToBody: true
    },
    grid: {
      left: '20',
      right: '20',
      top: '20',
      bottom: '40',
      containLabel: true,
      tooltip: {
        axisPointer: {
          type: 'cross'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: dataX.value,
      boundaryGap: ['0', '20'],
      // boundaryGap: false,
      splitLine: {
        show: false
      },
      axisTick: {
        show: true
      },
      axisLabel: {
        color: mode.value  === 'light' ? '#999' : '#666',
        fontFamily: 'Poppins'
      },
      nameTextStyle: {
        fontSize: 12
      },
      axisLine: {
        lineStyle: {
          color: '#1c1c1c'
        }
      }
    },
    yAxis: {
      type: 'value',
      position: 'right',
      name: '',
      nameTextStyle: {
        fontSize: 12
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: mode.value  === 'light' ? '#999' : '#666',
        fontFamily: 'Poppins',
        formatter: '{value}'
      },
      splitLine: {
        show: false
      },
      min: value => parseInt(value.min * 0.95),
      max: value => Math.ceil(value.max)
    },
    series: series.value
  }

  chart.setOption(chartOption)

  if (props.dataList && props.dataList.length > 0) {
    chart.hideLoading()
  }
}

const handlerLegendSelect = (val, index) => {
  const chart = echarts.getInstanceByDom(document.getElementById(chartId.value))
  if (!chart) return

  chart.dispatchAction({
    type: val ? 'legendSelect' : 'legendUnSelect',
    name: option.value[index].label
  })
}
const handlerResize = () => {
  setTimeout(() => {
    const chart = echarts.getInstanceByDom(document.getElementById(chartId.value))
    if (!chart) return
    chart.resize()
  },100)
}
// Watchers
watch(() => props.loading, val => {
  const chart = echarts.getInstanceByDom(document.getElementById(chartId.value))
  if (!chart) return

  if (val) {
    chart.hideLoading()
    chart.showLoading({
      maskColor: 'rgba(255, 255, 255, 0)',
      text: ''
    })
  } else {
    chart.hideLoading()
  }
})

watch(() => props.dataList, () => {
  init()
})

watch(() => props.showSeries[0], val => {
  handlerLegendSelect(val, 0)
})

watch(() => props.showSeries[1], val => {
  handlerLegendSelect(val, 1)
})

watch(() => props.showSeries[2], val => {
  handlerLegendSelect(val, 2)
})

watch(() => props.showSeries[3], val => {
  handlerLegendSelect(val, 3)
})

watch([mode,lang], () => {
  init()
})
watch(()=>props.showLeft, (val) => {
  console.log('showLeft changed', val)
  handlerResize()
})
// Lifecycle
onMounted(() => {
  init()
})
</script>

<style scoped lang="scss">
.chart-container {
  margin: 0;
}
</style>
