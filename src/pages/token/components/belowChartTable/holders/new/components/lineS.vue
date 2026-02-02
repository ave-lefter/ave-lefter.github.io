<template>
  <div class="chart-container">
    <div :id="chartId" :style="{ height: '100%', width: '100%' }" />
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
    color: '#3F80F7',
    label: t('add'), // 替换为实际的翻译逻辑
    value: 'value1',
    areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgb(40, 109, 255, 0.9)' // 0% 处的颜色
            },
            {
              offset: 1,
              color:  mode.value  === 'light' ? '#fff' : 'rgb(23, 25, 28)' // 100% 处的颜色
            }
          ],
          globalCoord: false // 缺省为 false
        }
    },
  },
  // {
  //   k: 2,
  //   color: '#F6465D',
  //   label: t('remove'), // 替换为实际的翻译逻辑
  //   value: 'removeliquidity_total',
  //   areaStyle: {
  //     opacity: 0.8,
  //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  //       {
  //         offset: 0,
  //         color: '#F6465D'
  //       },
  //       {
  //         offset: 1,
  //         color: '#0A0B0D'
  //       }
  //     ])
  //   },
  // }
])

const dataX = computed(() => props.dataList.map(i => i.time))

const series = computed(() =>
  option.value.map(i => ({
    name: i.label,
    type: 'line',
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
      show: false,
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
          result += `${item.marker} ${item.seriesName}: <span style="color:${mode.value  === 'light' ? '#17191C' : '#F5F5F5'}">${formatNumber2(item.value || 0, 2)}</span><br>`// 每行内容
        })
        return result
      },
      appendToBody: true
    },
    grid: {
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      // containLabel: true,
      tooltip: {
        show: false,
        axisPointer: {
          type: 'cross'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: dataX.value,
      boundaryGap: false,
      splitLine: {
        show: false
      },
      show:false,
      axisTick: {
        show: false
      },
      axisLabel: {
        color: mode.value  === 'light' ? '#999' : '#666',
        fontFamily: 'Poppins',
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
      show:false,
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
        formatter: '{value}',
      },
      splitLine: {
        show: false
      },
      min: value => parseInt(value.min * 1),
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
watch(
  () => props.loading,
  async (val) => {
    await nextTick()
    const dom = document.getElementById(chartId.value)
    if (!dom) return

    const chart = echarts.getInstanceByDom(dom)
    if (!chart) return

    val
      ? chart.showLoading({ maskColor: 'rgba(255,255,255,0)', text: '' })
      : chart.hideLoading()
  }
)

watch(() => props.loading, val => {
  const chart = echarts.getInstanceByDom(document.getElementById(chartId.value))
  console.log('-------val---------',val)
  if (!chart) {
    return
  }
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
onBeforeUnmount(() => {
  let chart = echarts.getInstanceByDom(document.getElementById(chartId.value))
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped lang="scss">
.chart-container {
  margin: 0;
}
</style>
