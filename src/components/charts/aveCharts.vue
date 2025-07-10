<template>
  <div ref="areaChart" :style="containerStyle" />
</template>

<script setup type="ts">
import * as echarts from 'echarts'
import { merge, debounce } from 'lodash-es'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  containerStyle: {
    type: Object,
    required: true,
  },
  grid: {
    type: Object,
    default: () => ({}),
  },
  dataset: Object,
  xAxis: {
    type: Object,
    default: () => ({}),
  },
  yAxis: {
    type: Object,
    default: () => ({}),
  },
  series: {
    type: [Object, Array],
    default: () => ({}),
  },
  tooltip: {
    type: Object,
    default: () => ({
      show: false,
    }),
  },
  legend: {
    type: Object,
    default: () => ({
      show: false,
    }),
  },
  graphic: Object,
})

const defaultSettings = {
  grid: {
    left: '10',
    right: '10',
    top: '3',
    bottom: '0',
    containLabel: true,
  },
  xAxis: {
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#787B86',
      show: false,
    },
    boundaryGap: false,
  },
  yAxis: {
    nameTextStyle: {
      fontSize: 12,
    },
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
  },
}

const areaChart = ref(null)
let currentChart = null
let resizeObserver = null

const mergeOption = () => {
  const { grid, xAxis, yAxis } = defaultSettings
  const newGrid = merge({}, grid, props.grid)
  const newXAxis = merge({}, xAxis, props.xAxis)
  const newYAxis = merge({}, yAxis, props.yAxis)
  return {
    grid: newGrid,
    xAxis: newXAxis,
    yAxis: newYAxis,
    series: props.series,
    tooltip: props.tooltip,
    legend: props.legend,
    dataset: props.dataset,
    graphic: props.graphic,
  }
}

const initChart = () => {
  if (!areaChart.value) return

  currentChart = echarts.getInstanceByDom(areaChart.value)
  if (!currentChart) {
    currentChart = echarts.init(areaChart.value)
  }
  const option = mergeOption()
  currentChart.setOption(option)
}

onMounted(() => {
  initChart()

  resizeObserver = new ResizeObserver(
    debounce(() => {
      if (currentChart) {
        currentChart.resize()
      }
    }, 300)
  )

  if (areaChart.value) {
    resizeObserver.observe(areaChart.value)
  }
})

onBeforeUnmount(() => {
  if (currentChart) {
    currentChart.dispose()
    currentChart = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

watch(
  () => [props.grid, props.xAxis, props.yAxis, props.series],
  () => {
    initChart()
  },
  { deep: true }
)
</script>

<style scoped lang="scss"></style>
