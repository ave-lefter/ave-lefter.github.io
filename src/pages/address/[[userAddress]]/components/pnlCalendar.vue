<template>
  <div>
    <el-calendar v-show="!isChartView">
      <template #header>
        <PnlCalendarHeader
          v-model:dialogCalendarVis="dialogCalendarVis"
          v-model:isChartView="isChartView"
          :date="selectedDate"
          :getColor="getColor"
          :summary="summary"
          @update:isChartView="updateIsChartView"
        />
      </template>
      <template #date-cell="{ data: { date } }">
        <template v-if="dayjs(date).isSame(dayjs(selectedDate), 'month')">
          <div class="text-center h-full" :class="getColor(getPnl(date)).bg">
            <span class="text-12px color-[--third-text] lh-14px">{{
              dayjs(date).format('DD')
            }}</span>
            <div class="text-12px lh-14px mt-2px" :class="getColor(getPnl(date)).color">
              {{ addSign(getPnl(date)) }}${{ formatNumber(Math.abs(getPnl(date)), 1) }}
            </div>
          </div>
        </template>
        <span v-else />
      </template>
    </el-calendar>
    <div v-show="isChartView" class="flex flex-col justify-between h-full">
      <PnlCalendarHeader
        v-model:dialogCalendarVis="dialogCalendarVis"
        v-model:isChartView="isChartView"
        :date="selectedDate"
        :summary="summary"
        :getColor="getColor"
      />
      <div ref="chartContainer" class="w-414px h-231px" />
    </div>
    <PnlDialog
      v-model:visible="dialogCalendarVis"
      :getColor="getColor"
      :userAddress="userAddress"
      :userChain="userChain"
    />
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { getProfitCalendar } from '~/api/wallet'
import PnlCalendarHeader from './pnlCalendarHeader.vue'
import PnlDialog from './pnlDialog.vue'

const props = defineProps({
  userAddress: {
    type: String,
    required: true,
  },
  userChain: {
    type: String,
    required: true,
  },
})
const themeStore = useThemeStore()
const { t } = useI18n()
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const dateMapToPnl = ref({})
const summary = ref({})
const isChartView = ref(false)
const chartInstance = ref(null)
const chartContainer = useTemplateRef('chartContainer')
const dialogCalendarVis = ref(false)

const getColor = (value) => {
  if (value === 0) {
    return {
      bg: 'bg-#12B88608',
      color: 'color-[--third-text]',
    }
  } else if (value < 0) {
    return {
      bg: 'bg-#F6465D1A',
      color: 'color-[--down-color]',
    }
  } else if (value > 2000) {
    return {
      bg: 'bg-#FFA6221A',
      color: 'color-[--yellow]',
    }
  } else {
    return {
      bg: 'bg-#12B8861A',
      color: 'color-[--up-color]',
    }
  }
}

const _getProfitCalendar = async () => {
  const res = await getProfitCalendar({
    user_address: props.userAddress,
    user_chain: props.userChain,
    date: selectedDate.value,
  })
  ;(res.days || []).forEach((item) => {
    dateMapToPnl.value[item.date] = item
  })
  summary.value = res.summary || {}
}

const getPnl = (date) => {
  return dateMapToPnl.value[dayjs(date).format('YYYY-MM-DD')]?.profit || 0
}

const initOrUpdateChart = () => {
  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chartContainer.value)
  }
  const option = {
    grid: {
      top: '10',
      left: '25',
      right: '15',
      bottom: '20',
    },
    xAxis: {
      type: 'category',
      data: Object.keys(dateMapToPnl.value),
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
        show: true,
        color: () => getCssVariable('--third-text'),
        fontSize: 10,
        formatter: (value) => {
          return dayjs(value).format('MM-DD')
        },
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
        show: true,
        color: () => getCssVariable('--third-text'),
        fontSize: 10,
        formatter: (value) => {
          return formatNumber(value, 0)
        },
      },
      splitLine: {
        show: true,
        interval: (index, val) => {
          console.log(index, val)
        },
        lineStyle: {
          color: getCssVariable('--third-text'),
          type: 'dashed',
          width: '0.5',
        },
      },
    },
    series: {
      type: 'bar',
      barMaxWidth: 10,
      itemStyle: {
        color: (value) => {
          return getCssVariable(value.value.profit > 0 ? '--up-color' : '--down-color')
        },
      },
    },
    dataset: {
      source: Object.values(dateMapToPnl.value),
      dimensions: ['date', 'profit'],
    },
    tooltip: {
      trigger: 'item',
      transitionDuration: 0,
      backgroundColor: getCssVariable('--tooltip'),
      borderWidth: 0,
      padding: 12,
      appendTo: 'body',
      formatter: ({ value = {} }) => {
        const timeStr = dayjs(value.date).format('YYYY-MM-DD')
        const { profit, total_buy_count, total_sell_count, buy_volume, sell_volume } = value
        return `
          <div>
            <div class="text-12px color-[--main-text] mb-12px">${timeStr}</div>
            <div class="text-12px color-[--third-text] flex items-center gap-16px">
              <div class="flex flex-col items-center gap-4px">
                <span class="text-12px color-[--third-text] lh-16px">${profit > 0 ? t('dailyProfit') : t('dailyLoss')}</span>
                <span class="text-12px lh-16px ${getColorClass(profit)}">$${formatNumber(Math.abs(profit), 2)}</span>
              </div>
              <div class="flex flex-col items-center gap-4px">
                <span class="text-12px color-[--third-text] lh-16px">${t('dailyTxns')}</span>
                <span class="text-12px lh-16px">
                  <span class="color-[--up-color]">${total_buy_count}</span>/
                  <span class="color-[--down-color]">${total_sell_count}</span>
                </span>
              </div>
              <div class="flex flex-col items-center gap-4px">
                <span class="text-12px color-[--third-text] lh-16px">${t('dailyVolume')}</span>
                <span class="text-12px lh-16px">
                  <span class="color-[--up-color]">$${formatNumber(Math.abs(buy_volume), 2)}</span>/
                  <span class="color-[--down-color]">$${formatNumber(Math.abs(sell_volume), 2)}</span>
                </span>
              </div>
            </div>
          </div>
        `
      },
    },
  }
  chartInstance.value.setOption(option)
}

const updateIsChartView = (val) => {
  if (val) {
    setTimeout(() => {
      initOrUpdateChart()
    }, 20)
  }
}

watch(
  () => themeStore.isDark,
  () => {
    initOrUpdateChart()
  }
)
_getProfitCalendar()
</script>

<style scoped lang="scss">
:global(.el-calendar__header) {
  padding: 0;
  border-bottom: 0 none;
}
:global(.el-calendar__body) {
  padding: 0;
}

:global(.el-calendar-table tr td) {
  border: 0 none !important;
}

:global(.el-calendar-table .el-calendar-day) {
  height: 44px;
  padding: 2px;
  --el-calendar-selected-bg-color: transparent;
}

:global(.el-calendar-table .is-selected) {
  --el-calendar-selected-bg-color: transparent;
}

:global(.el-calendar-table thead th) {
  padding: 0;
  padding-bottom: 11px;
  font-size: 12px;
  line-height: 20px;
  color: var(--third-text);
}
</style>
