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
  token: {
    type: String,
    default: '',
  },
  isDay: {
    type: Boolean,
    default: false,
  },
})

const localeStore = useLocaleStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const lineChartRef = useTemplateRef('lineChartRef')
let myChart: echarts.ECharts | null = null
const language = computed(() => localeStore.locale)
// const dataX = computed(() => props.dataList?.map?.((i) => formatDate(i[0], 'MM-DD HH:mm')))
const sortedData = computed(() => props.dataList?.toSorted?.((a, b) => a[0] - b[0]) ?? [])
const markPoint = computed(() => {
  const findNearestValue = (timestampSec: number) => {
    if (!sortedData.value?.length) return undefined
    const target = timestampSec * 1000
    // 找到时间最近的点，保证 markPoint 落在折线上
    let nearest = sortedData.value[0]
    let minDiff = Math.abs(sortedData.value[0][0] * 1000 - target)
    for (const item of sortedData.value) {
      const diff = Math.abs(item[0] * 1000 - target)
      if (diff < minDiff) {
        minDiff = diff
        nearest = item
      }
    }
    return nearest?.[1]
  }

  return props.marks
    ?.toSorted?.((a, b) => b[0] - a[0])
    ?.map?.((y: any, idx: number) => {
      const timeValue = Math.min(y[0], sortedData.value[sortedData.value.length - 1][0])
      const xAxis = timeValue * 1000
      const yAxis = findNearestValue(timeValue)
      let symbolUrl = themeStore.isDark ? buyDark : buyLight
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
        symbolSize: idx === 0 ? [40, 40] : [20, 20],
        animation: true,
        label: {
          show: false,
        },
        tooltip: {
          position: 'top',
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
          enterable: true,
          formatter: () => {
            return `
           <div class="color-[--main-text]">
            <span id="tooltipMark" class="decoration-underline decoration-dotted cursor-pointer" data-time=${y[0]} data-token=${props.token}>${y[2]}${t(props.type)}</span>${localeStore.locale === 'zh-cn' ? '' : ' '}${t('buy')} $${formatNumber(y[1], 2)}
           </div>
           <div>
             ${formatDate(y[0], 'YYYY-MM-DD HH:mm:ss')}
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
    showSymbol: false, // 不显示所有数据点
    itemStyle: {
      color: getCssVariable('--main-text'), // 折线点的颜色
    },
    lineStyle: {
      width: 1,
    },
    emphasis: {
      disabled: true,
      focus: 'series',
    },
    data: sortedData.value.map((j) => {
      return [j[0] * 1000, j[1]]
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

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null
  }
})

watch(
  () => [props.marks, props.dataList, language.value, themeStore.isDark],
  () => {
    init()
  }
)

function init() {
  if (!myChart) {
    myChart = echarts.init(lineChartRef.value)
  }
  const firstTime = sortedData.value?.[0]?.[0]
  const lastTime = sortedData.value?.[sortedData.value.length - 1]?.[0]
  const minTime = firstTime ? firstTime * 1000 : undefined
  const maxTime = lastTime ? lastTime * 1000 : undefined
  const span =
    typeof minTime === 'number' && typeof maxTime === 'number' && maxTime > minTime
      ? maxTime - minTime
      : undefined
  const formatTs = (ts: number) => (props.isDay ? formatDate(ts, 'MM-DD') : formatDate(ts, 'HH:mm'))
  // fallback：当取不到 ticks 时，仍保证最多显示 4 个（slot 去重）
  let fallbackShownSlots = new Set<number>()
  let fallbackLastSpanKey = `${minTime ?? ''}-${maxTime ?? ''}`
  // 从 ECharts 实际生成的 tick 中挑选“最接近 4 个等分目标点”的 4 个 tick 来显示
  // 目标点：min、min+1/3、min+2/3、max
  let labelTickSet = new Set<number>()
  const pickClosestTicks = (tickValues: number[], targets: number[]) => {
    const inRange = tickValues.filter(
      (v) => typeof v === 'number' && !Number.isNaN(v) && v >= targets[0] && v <= targets[3]
    )
    const used = new Set<number>()
    const candidatesBySlot: Array<Array<{ v: number; diff: number }>> = [[], [], [], []]
    const slotTarget = targets
    if (!span || span <= 0) return []

    for (const v of inRange) {
      const r = (v - targets[0]) / span // 0..1
      const clamped = Math.min(1, Math.max(0, r))
      const slot = Math.min(3, Math.max(0, Math.round(clamped * 3)))
      candidatesBySlot[slot].push({ v, diff: Math.abs(v - slotTarget[slot]) })
    }
    for (const list of candidatesBySlot) list.sort((a, b) => a.diff - b.diff)

    // 贪心：先分配最确定的 slot，避免重复 tick 导致少于 4 个标签
    const slotOrder = [0, 1, 2, 3].sort(
      (a, b) =>
        (candidatesBySlot[a][0]?.diff ?? Infinity) - (candidatesBySlot[b][0]?.diff ?? Infinity)
    )
    const picked: number[] = new Array(4).fill(undefined) as any

    for (const s of slotOrder) {
      for (const c of candidatesBySlot[s]) {
        if (!used.has(c.v)) {
          used.add(c.v)
          picked[s] = c.v
          break
        }
      }
    }

    // 若某些 slot 没选到（tick 太少），用范围内 tick 补齐
    if (picked.some((x) => typeof x !== 'number')) {
      const sorted = [...inRange].sort((a, b) => a - b)
      for (let i = 0; i < 4; i++) {
        if (typeof picked[i] === 'number') continue
        const fallback = sorted.find((v) => !used.has(v))
        if (fallback == null) break
        used.add(fallback)
        picked[i] = fallback
      }
    }

    return picked.filter((v) => typeof v === 'number') as number[]
  }

  const option = {
    animation: false,
    legend: {
      show: false,
    },
    grid: {
      left: '12', //图表距边框的距离
      right: '12',
      top: '16',
      bottom: '0',
      containLabel: true,
    },
    tooltip: {
      show: true,
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      min: minTime,
      max: maxTime,
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },

      axisLabel: {
        show: true,
        showMinLabel: true,
        showMaxLabel: true,
        // 固定四个标签，不让 ECharts 因为重叠而隐藏
        hideOverlap: false,
        alignMinLabel: 'left',
        alignMaxLabel: 'right',
        formatter: (value: string, index: number) => {
          const ts = Number(value)
          if (Number.isNaN(ts) || typeof span !== 'number' || span <= 0) return ''

          // 优先：已成功从 ECharts ticks 中挑出 4 个目标 tick
          if (labelTickSet.size) return labelTickSet.has(ts) ? formatTs(ts) : ''

          // fallback：未拿到 ticks 时，用 slot 去重保证显示 4 个
          const spanKey = `${minTime ?? ''}-${maxTime ?? ''}`
          if (index === 0 || spanKey !== fallbackLastSpanKey) {
            fallbackShownSlots = new Set<number>()
            fallbackLastSpanKey = spanKey
          }
          const r = (ts - (minTime as number)) / span // 0..1
          const clamped = Math.min(1, Math.max(0, r))
          let slot = Math.round(clamped * 3) // 0..3
          slot = Math.min(3, Math.max(0, slot))
          if (fallbackShownSlots.has(slot)) return ''
          fallbackShownSlots.add(slot)
          return formatTs(ts)
        },
      },
      axisLine: { show: false },
      nameTextStyle: {
        fontSize: 10,
      },
      // scale: true,
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
  // 先 setOption 让 ECharts 生成 ticks，再从 ticks 中挑选最接近 4 个目标点的 tick 来显示
  myChart.clear()
  myChart.setOption(option, { notMerge: true })
  if (
    typeof minTime === 'number' &&
    typeof maxTime === 'number' &&
    typeof span === 'number' &&
    span > 0
  ) {
    const targets = [minTime, minTime + span / 3, minTime + (2 * span) / 3, maxTime]
    try {
      const axisModel: any = myChart.getModel().getComponent('xAxis', 0)
      const ticks: any[] = axisModel?.axis?.scale?.getTicks?.() ?? []
      const tickValues: number[] = ticks
        .map((t) => (typeof t === 'number' ? t : t?.value))
        .filter((v) => typeof v === 'number')
      const picked = pickClosestTicks(tickValues, targets)
      // 只有在确实挑出了 4 个（或至少 2 个）时才启用 tickSet；否则继续用 fallback
      if (picked.length >= 2) labelTickSet = new Set<number>(picked)
      myChart.setOption(option, { notMerge: true })
    } catch {
      // 如果内部 API 取 ticks 失败，继续走 fallback（slot 去重）
      labelTickSet = new Set<number>()
      myChart.setOption(option, { notMerge: true })
    }
  }
  // if (series.value.markPoint.data.length > 0) {
  //   autoShowMarkTooltip()
  // }
}

// function autoShowMarkTooltip() {
//   setTimeout(() => {
//     // 显示第一个 markPoint
//     const coordSys = myChart.value.getModel().getSeriesByIndex(0).coordinateSystem
//     console.log(
//       coordSys,
//       markPoint.value[0]?.coord,
//       myChart.value.convertToPixel({ seriesIndex: 0 }, markPoint.value[0]?.coord)
//     )
//     const xy = myChart.value.convertToPixel({ seriesIndex: 0 }, markPoint.value[0]?.coord)
//     myChart.value.dispatchAction({
//       type: 'showTip',
//       seriesIndex: 0,
//       dataIndex: 0,
//       position: xy,
//       tooltip: {
//         formatter: 'content',
//       },
//     })
//   }, 100)
// }
</script>

<template>
  <div class="text-left">
    <div ref="lineChartRef" class="w-375px h-120px ml--12px" />
  </div>
</template>

<style scoped lang="scss"></style>
