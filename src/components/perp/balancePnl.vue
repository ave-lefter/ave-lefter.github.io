<script setup lang="ts">
import dayjs from 'dayjs'
import * as echarts from 'echarts'
import { assetDetail } from '~/api/perp'

const { t } = useI18n()
const themeStore = useThemeStore()
const selectButton = ref('totalEquity')
const selectType = ref('1W')
const assetDetailList = ref([])
const chartDom = useTemplateRef('chartDom')
const chartInstance = shallowRef<echarts.ECharts>()

const buttons = computed(() => {
  return [
    { label: t('accountBalance'), value: 'totalEquity' },
    { label: t('pnl'), value: 'pnl' },
  ]
})
const typeList = computed(() => {
  return [
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
  ]
})
const changeSelectButton = (value: number) => {
  selectButton.value = value
  initOrUpdateChart()
}
const changeSelectType = (value: string) => {
  selectType.value = value
  getAssetDetail()
}
const getAssetDetail = async () => {
  const res = await assetDetail(selectType.value)
  assetDetailList.value = res.assetList || []
  queueMicrotask(() => {
    initOrUpdateChart()
  })
}

const findPnlRate = (snapshotTime: string) => {
  const index = assetDetailList.value.findIndex((item) => item.snapshotTime === snapshotTime)
  const result = assetDetailList.value[index].pnlRate * 100
  return formatNumber(result, 2) + '%'
}

const initOrUpdateChart = () => {
  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartDom.value)
  }
  const xAxis = assetDetailList.value.map((item) => item.snapshotTime)
  const lineData = assetDetailList.value.map((item) => {
    return item[selectButton.value]
  })
  chartInstance.value.setOption({
    grid: {
      left: 0,
      right: 0,
      top: 20,
      bottom: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: xAxis,
        axisTick: {
          show: false, // 不显示刻度
        },
        axisLine: {
          lineStyle: {
            color: getCssVariable('--dialog-divider'),
          },
        },
        axisLabel: {
          show: true,
          color: () => getCssVariable('--third-text'),
          fontSize: 12,
          formatter: (value: number) => {
            const dayjsTime = dayjs(+value)
            return dayjsTime.format('MM-DD')
          },
        },
      },
    ],
    yAxis: {
      show: true,
      type: 'value',
      axisLabel: {
        color: getCssVariable('--third-text'),
        formatter: (value: number) => {
          return formatNumber(value, 2) + ' USDT'
        },
      },
      // grid 中坐标轴分割线
      splitLine: {
        lineStyle: {
          color: getCssVariable('--dialog-divider'),
        },
      },
    },
    series: {
      type: 'line',
      data: lineData,
      lineStyle: {
        color: getCssVariable('--up-color'),
      },
      showSymbol: false,
      smooth: true,
      itemStyle: {
        color: getCssVariable('--up-color'),
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#17191C',
      borderWidth: 0,
      axisPointer: {
        type: 'line',
        z: 0,
        animation: false,
        lineStyle: {
          type: 'dashed',
          color: getCssVariable('--up-color'),
        },
      },
      formatter: (params, ...args) => {
        return `
          <div style="color:var(--main-text);font-size:10px;line-height:16px;">
            <div style="margin-bottom:4px;">
              ${dayjs(params[0].name).format('MM-DD')}
            </div>
            <div>
              ${t(selectButton.value === 'totalEquity' ? 'totalAssets' : 'pnl')}:${params[0].value < 0 ? '-' : ''}$${formatNumber(Math.abs(params[0].value), 2)}
            </div>
            <div style="${selectButton.value === 'totalEquity' ? 'display:none' : ''}">
              ${t('RIO')}:${findPnlRate(params[0].name)}
            </div>
          </div>
        `
      },
    },
  })
}
onMounted(() => {
  getAssetDetail()
})

watch(
  () => themeStore.theme,
  () => {
    initOrUpdateChart()
  }
)
</script>

<template>
  <div class="px-16px py-24px w-480px bg-[--secondary-bg] flex-1">
    <div class="flex justify-between">
      <div class="flex items-center p-4px bg-[--main-input-button-bg]">
        <span
          v-for="el in buttons"
          :key="el.value"
          class="text-12px px-8px lh-24px color-[--third-text] cursor-pointer"
          :class="{ '[&&]:color-[--main-text] bg-[--tab-active-bg]': el.value === selectButton }"
          @click="changeSelectButton(el.value)"
          >{{ el.label }}</span
        >
      </div>
      <div class="flex items-center p-4px bg-[--main-input-button-bg]">
        <span
          v-for="el in typeList"
          :key="el.value"
          class="text-12px px-8px lh-24px color-[--third-text] cursor-pointer"
          :class="{ '[&&]:color-[--main-text] bg-[--tab-active-bg]': el.value === selectType }"
          @click="changeSelectType(el.value)"
          >{{ el.label }}</span
        >
      </div>
    </div>
    <div ref="chartDom" class="w-full h-274px" />
  </div>
</template>
