<script setup lang="ts">
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import buy from 'assets/images/mark/buy.png'
import buyDark from 'assets/images/mark/buy-dark.png'
import buyLight from 'assets/images/mark/buy-light.png'

// 注册使用组件
echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkPointComponent,
  CanvasRenderer,
])

const props = defineProps({
  dataList: {
    type: Array<any>,
    required: true,
  },
  loading: Boolean,
  marks: {
    type: Array<any>,
    default: () => [],
  },
  type: {
    type: String,
    default: '',
  },
})

const localeStore = useLocaleStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const lineChartRef = useTemplateRef('lineChartRef')
const myChart = shallowRef()
const language = computed(() => localeStore.locale)
const dataX = computed(() => props.dataList?.map?.((i) => formatDate(i[0], 'MM-DD HH:mm')))
const markPoint = computed(() => {
  return props.marks?.map?.((y: any, idx: number) => {
    const xAxis = formatDate(y[0], 'MM-DD HH:mm')
    const yAxis = props.dataList?.find?.((i) => formatDate(i[0], 'MM-DD HH:mm') === xAxis)?.[1]
    let symbolUrl = themeStore.isDark ? buyDark : buyLight
    console.log(idx, 'idx', props.marks)
    if (idx === 0) {
      symbolUrl = buy
    }
    return {
      name: t('buy'),
      value: '',
      coord: [xAxis, yAxis],
      symbolOffset: [0, 0],
      itemStyle: {
        color: 'transparent',
      },
      symbol: `image://${symbolUrl}`, // 替换为你的图标链接
      symbolSize: [12, 12],
      animation: true,
      label: {
        show: false,
      },
      tooltip: {
        backgroundColor: getCssVariable('--main-input-button-bg'),
        trigger: 'item',
        borderWidth: 1,
        borderColor: getCssVariable('--icon-color'),
        textStyle: {
          fontSize: 10,
          color: 'var(--secondary-text)',
        },
        padding: [4, 8, 4, 8],
        confine: true,
        formatter: () => {
          return `
           <div class="color-[--main-text]">
            <span class="decoration-underline decoration-dotted">${y[2]}${t(props.type)}</span>${t('buy')} $${formatNumber(y[1], 2)}
           </div>
           <div>
             ${formatDate(y[0], 'YYYY-MM-DD HH:mm')}
           </div>
          `
        },
        appendToBody: true,
      },
    }
  })
})

const series = computed(() => {
  return {
    type: 'line',
    z: 0,
    smooth: true,
    symbolSize: 1,
    itemStyle: {
      color: getCssVariable('--main-text'), // 折线点的颜色
    },
    lineStyle: {
      width: 2,
    },
    emphasis: {
      disabled: true,
      focus: 'series',
    },
    data: props.dataList.map((j) => {
      return j[1]
    }),
    // 曲线本身不显示tooltip
    tooltip: {
      show: false,
    },
    markPoint: {
      z: 1111111111111,
      data: markPoint.value,
    },
  }
})

onMounted(() => {
  init()
})

watch(
  () => [props.marks, props.dataList, language.value, themeStore.isDark],
  () => {
    init()
  }
)

function init() {
  if (!myChart.value) {
    myChart.value = echarts.init(lineChartRef.value)
  }
  const option = {
    legend: {
      show: false,
    },
    grid: {
      left: '0', //图表距边框的距离
      right: '0',
      top: '0',
      bottom: '0',
      containLabel: true,
    },
    tooltip: {
      show: true,
    },
    xAxis: {
      type: 'category',
      data: dataX.value,
      boundaryGap: ['0', '20'],
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      nameTextStyle: {
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      position: 'right',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      scale: true,
    },
    series: series.value,
  }
  myChart.value.setOption(option)
}
</script>

<template>
  <div class="m-0 text-left w-full">
    <div ref="lineChartRef" class="w-351px h-63px" />
  </div>
</template>

<style scoped lang="scss"></style>
