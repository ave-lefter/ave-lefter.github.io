<template>
  <div ref="shareDom">
    <el-calendar
      v-show="!isChartView"
      :key="calendarMonthKey"
      :model-value="calendarDisplayDate"
      class="[&&]:[--el-calendar-cell-width:44px] [&&]:[--el-fill-color-blank:transparent]"
    >
      <template #header>
        <PnlCalendarHeader
          v-model:selectedDate="selectedDate"
          v-model:isChartView="isChartView"
          :getColor="getColor"
          :summary="summary"
          @update:isChartView="updateIsChartView"
          @share="openShareDialog"
        />
      </template>
      <template #date-cell="{ data }">
        <template v-if="data.type === 'current-month'">
          <div
            class="text-center h-full"
            :class="[getColor(getPnl(data.date)).bg, 'cursor-pointer']"
            @click="clickDay(data.date, $event)"
          >
            <span class="text-12px color-[--third-text] lh-14px">{{
              dayjs(data.date).format('DD')
            }}</span>
            <div class="text-12px lh-14px mt-2px" :class="getColor(getPnl(data.date)).color">
              {{ addSign(getPnl(data.date)) }}${{ formatNumber(Math.abs(getPnl(data.date)),{decimals:1,limit:4}) }}
            </div>
          </div>
        </template>
        <span v-else />
      </template>
    </el-calendar>
    <div v-show="isChartView" class="flex flex-col justify-between h-full">
      <PnlCalendarHeader
        v-model:selectedDate="selectedDate"
        v-model:isChartView="isChartView"
        :summary="summary"
        :getColor="getColor"
        @share="openShareDialog"
      />
      <div ref="chartContainer" class="w-414px h-231px" />
    </div>
    <PnlDialog
      v-model:visible="dialogCalendarVis"
      :getColor="getColor"
      :userAddress="userAddress"
      :userChain="userChain"
      :formatterTooltip="formatterTooltip"
    />

    <el-dialog v-model="shareDialogVisible" width="560px" append-to-body destroy-on-close>
      <template #header>
        <div class="text-14px lh-20px color-[--main-text]">{{ t('pnlCalendar') }}</div>
      </template>

      <div ref="shareCardDom" class="share-card bg-[--secondary-bg] rounded-8px p-12px">
        <div class="text-14px lh-20px color-[--main-text] mb-8px">{{ t('pnlCalendar') }}</div>
        <div class="flex items-center justify-center gap-4px text-12px color-[--main-text] mb-12px select-none">
          <Icon
            name="ri:arrow-left-s-line"
            class="text-14px color-[--main-text] cursor-pointer"
            @click="shareCardPrevMonth"
          />
          <span class="font-500">{{ shareCardMonthLabel }} UTC+0</span>
          <Icon
            name="ri:arrow-right-s-line"
            class="text-14px"
            :class="shareCardNextDisabled ? 'color-[--main-text] opacity-50 cursor-not-allowed' : 'color-[--main-text] cursor-pointer'"
            @click="shareCardNextMonth"
          />
        </div>
        <div class="text-12px mb-8px" :class="getColor(summary?.month_total_profit ?? 0).color">
          {{ addSign(summary?.month_total_profit ?? 0) }}${{
            formatNumber(Math.abs(summary?.month_total_profit ?? 0), 1)
          }}
        </div>
        <div class="flex gap-2px mb-8px">
          <div class="h-4px rounded-2px bg-[--up-color]" :style="`width:${shareCardPercent.profit}%`" />
          <div class="h-4px rounded-2px bg-[--down-color]" :style="`width:${shareCardPercent.loss}%`" />
        </div>
        <div class="flex justify-between text-12px lh-16px mb-12px color-[--main-text]">
          <div>
            <span class="color-[--up-color]">{{ summary?.win_days_count ?? 0 }} / </span>
            <span class="color-[--up-color]">${{ formatNumber(summary?.total_profit_on_win_days ?? 0, 1) }}</span>
          </div>
          <div>
            <span class="color-[--down-color]">{{ summary?.loss_days_count ?? 0 }} / </span>
            <span class="color-[--down-color]">${{ formatNumber(Math.abs(summary?.total_profit_on_loss_days ?? 0), 1) }}</span>
          </div>
        </div>
        <el-calendar
          :range="shareCardRange"
          class="share-card-calendar [&&]:[--el-calendar-cell-width:44px] [&&]:[--el-fill-color-blank:transparent]"
        >
          <template #header>
            <span />
          </template>
          <template #date-cell="{ data }">
            <template v-if="dayjs(data.date).isSame(dayjs(selectedDate), 'month')">
              <div class="text-center h-full" :class="getColor(getPnl(data.date)).bg">
                <span class="text-12px color-[--main-text] lh-14px">{{ dayjs(data.date).format('DD') }}</span>
                <div
                  class="text-12px lh-14px mt-2px"
                  :class="getPnl(data.date) === 0 ? 'color-[--main-text]' : getColor(getPnl(data.date)).color"
                >
                  {{ addSign(getPnl(data.date)) }}${{ formatNumber(Math.abs(getPnl(data.date)), { decimals: 1, limit: 4 }) }}
                </div>
              </div>
            </template>
            <span v-else />
          </template>
        </el-calendar>
        <div class="mt-12px flex items-center justify-between text-12px color-[--main-text]">
          <div class="flex gap-16px">
            <span v-if="shareCardIsCurrentMonth">{{ t('currentStreak') }}: {{ summary?.current_win_streak ?? 0 }}d</span>
            <span>{{ shareCardMonthShort }} {{ t('maxStreak') }}: {{ summary?.max_consecutive_win_days ?? 0 }}d</span>
          </div>
          <div class="flex items-center gap-4px">
            <img height="18" src="~/assets/images/avedex_mobile_logo.png" alt="Ave" class="h-18px w-auto">
            <span class="font-600 color-[--main-text] text-12px">Ave.ai</span>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-12px">
        <el-button type="primary" class="min-w-92px" @click="copySharePoster">复制图片</el-button>
      </div>
    </el-dialog>

    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRef"
      trigger="click"
      :visible="popVisible"
      virtual-triggering
      :width="'auto'"
      append-to-body
      popper-style="--el-popover-bg-color: var(--tooltip);--el-bg-color-overlay:var(--tooltip)"
    >
      <div v-html="formatterTooltip({ value: dateMapToPnl[tooltipDate] })" />
    </el-popover>
  </div>
</template>

<script setup>
import BigNumber from 'bignumber.js'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
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
let chartInstance = null
const chartContainer = useTemplateRef('chartContainer')
const shareDom = useTemplateRef('shareDom')
const shareCardDom = useTemplateRef('shareCardDom')
const buttonRef = ref(null)
const popVisible = ref(false)
const tooltipDate = ref('')
const dialogCalendarVis = ref(false)
const shareDialogVisible = ref(false)

/** 主日历展示的月份，随 selectedDate 切换 */
const calendarMonthKey = computed(() => dayjs(selectedDate.value).format('YYYY-MM'))
const calendarDisplayDate = computed(() =>
  dayjs(selectedDate.value).startOf('month').toDate()
)
// Element Plus range 要求：周一开始、周日结束；否则会导致跨月日期错位
const shareCardRange = computed(() => {
  const monthStart = dayjs(selectedDate.value).startOf('month')
  const monthEnd = dayjs(selectedDate.value).endOf('month')
  const startDow = monthStart.day() // 0 Sun ... 6 Sat
  const endDow = monthEnd.day()
  const daysSinceMonday = (startDow + 6) % 7 // Monday=0 ... Sunday=6
  const daysToSunday = 6 - ((endDow + 6) % 7)
  const rangeStart = monthStart.subtract(daysSinceMonday, 'day')
  const rangeEnd = monthEnd.add(daysToSunday, 'day')
  return [rangeStart.toDate(), rangeEnd.toDate()]
})
const shareCardMonthLabel = computed(() => dayjs(selectedDate.value).format('MMM YYYY'))
const shareCardMonthShort = computed(() => dayjs(selectedDate.value).format('MMM'))
const shareCardIsCurrentMonth = computed(
  () => dayjs(selectedDate.value).format('YYYY-MM') === dayjs().format('YYYY-MM')
)
const shareCardNextDisabled = computed(() => {
  const d = selectedDate.value || dayjs().format('YYYY-MM-DD')
  return (
    dayjs(d).startOf('month').isAfter(dayjs().startOf('month')) ||
    dayjs(d).startOf('month').isSame(dayjs().startOf('month'))
  )
})

function shareCardPrevMonth() {
  const d = dayjs(selectedDate.value || dayjs().format('YYYY-MM-DD')).subtract(1, 'month')
  selectedDate.value = d.format('YYYY-MM-DD')
}

function shareCardNextMonth() {
  if (shareCardNextDisabled.value) return
  const d = dayjs(selectedDate.value).add(1, 'month')
  selectedDate.value = d.format('YYYY-MM-DD')
}
const shareCardPercent = computed(() => {
  const win = summary.value?.total_profit_on_win_days ?? 0
  const loss = Math.abs(summary.value?.total_profit_on_loss_days ?? 0)
  const total = new BigNumber(win).plus(loss)
  if (total.isZero()) {
    return { profit: 50, loss: 50 }
  }
  const profit = +formatNumber(new BigNumber(win).div(total).multipliedBy(100).toString(), 1)
  const lossPct = +formatNumber(new BigNumber(loss).div(total).multipliedBy(100).toString(), 1)
  return { profit, loss: lossPct }
})

const chartDates = computed(() => {
  const start = dayjs(selectedDate.value).startOf('month')
  const end = dayjs(selectedDate.value).endOf('month')
  const days = []
  let cur = start
  while (cur.isBefore(end) || cur.isSame(end, 'day')) {
    days.push(cur.format('YYYY-MM-DD'))
    cur = cur.add(1, 'day')
  }
  return days
})

const chartSource = computed(() => {
  return chartDates.value.map((date) => {
    const item = dateMapToPnl.value[date]
    return {
      date,
      profit: item?.profit ?? 0,
      total_buy_count: item?.total_buy_count ?? 0,
      total_sell_count: item?.total_sell_count ?? 0,
      buy_volume: item?.buy_volume ?? 0,
      sell_volume: item?.sell_volume ?? 0,
    }
  })
})

const getColor = (value) => {
  if (value === 0) {
    return {
      bg: 'bg-#12B88608',
      color: 'color-[--third-text]',
      cssColor: getCssVariable('--third-text'),
    }
  } else if (value < 0) {
    return {
      bg: 'bg-#F6465D1A',
      color: 'color-[--down-color]',
      cssColor: getCssVariable('--down-color'),
    }
  } else if (value > 2000) {
    return {
      bg: 'bg-#12B8864D',
      color: 'color-[--up-color]',
      cssColor: getCssVariable('--up-color'),
    }
  } else {
    return {
      bg: 'bg-#12B8861A',
      color: 'color-[--up-color]',
      cssColor: getCssVariable('--up-color'),
    }
  }
}

const _getProfitCalendar = async () => {
  const res = await getProfitCalendar({
    user_address: props.userAddress,
    user_chain: props.userChain,
    date: selectedDate.value,
  })
  dateMapToPnl.value = {}
  ;(res.days || []).forEach((item) => {
    dateMapToPnl.value[item.date] = item
  })
  summary.value = res.summary || {}

  if (isChartView.value) {
    setTimeout(() => {
      initOrUpdateChart()
    }, 20)
  }
}

const getPnl = (date) => {
  return dateMapToPnl.value[dayjs(date).format('YYYY-MM-DD')]?.profit || 0
}

const formatterTooltip = ({ value = {} }) => {
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
}

const initOrUpdateChart = () => {
  if (!chartInstance) {
    chartInstance = echarts.init(chartContainer.value)
  }
  const option = {
    grid: {
      top: '10',
      left: 0,
      right: '15',
      bottom: 0,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartDates.value,
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
          return formatNumber(value, 2)
        },
      },
      splitLine: {
        show: true,
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
        color: (params) => {
          const profit = params?.data?.profit ?? 0
          if (profit < 0) return getCssVariable('--down-color')
          if (profit > 0) return getCssVariable('--up-color')
          return getCssVariable('--third-text')
        },
      },
      encode: {
        x: 'date',
        y: 'profit',
      },
    },
    dataset: {
      source: chartSource.value,
      dimensions: ['date', 'profit'],
    },
    tooltip: {
      trigger: 'item',
      transitionDuration: 0,
      backgroundColor: getCssVariable('--tooltip'),
      borderWidth: 0,
      padding: 12,
      appendTo: 'body',
      formatter: (params) => formatterTooltip({ value: params?.data || {} }),
    },
  }
  chartInstance.setOption(option)
}

const updateIsChartView = (val) => {
  if (val) {
    setTimeout(() => {
      initOrUpdateChart()
    }, 20)
  }
}

const clickDay = (date, $event) => {
  popVisible.value = false
  if (dayjs(date).isBefore(dayjs().endOf('d'))) {
    buttonRef.value = $event.currentTarget
    popVisible.value = true
    tooltipDate.value = dayjs(date).format('YYYY-MM-DD')
  }
}

const openShareDialog = () => {
  shareDialogVisible.value = true
}

const copySharePoster = async () => {
  if (!shareCardDom.value) return
  const canvas = await html2canvas(shareCardDom.value, {
    backgroundColor: null,
    scale: 2,
    allowTaint: true,
    useCORS: true,
    scrollY: 0,
    scrollX: 0,
  })

  canvas.toBlob(async (blob) => {
    if (!blob) {
      ElMessage.error('复制失败')
      return
    }

    try {
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])
      ElMessage.success('复制成功')
    } catch (err) {
      console.error('无法复制图片: ', err)
      ElMessage.error('复制失败')
    }
  }, 'image/png')
}

watch(
  () => selectedDate.value,
  () => {
    _getProfitCalendar()
  }
)

watch(
  () => themeStore.isDark,
  () => {
    initOrUpdateChart()
  }
)


const onClickOutside = (event) => {
  if (buttonRef.value && !buttonRef.value.contains(event.target)) {
    popVisible.value = false
  }
}

onMounted(() => {
  _getProfitCalendar()
  document.addEventListener('click', onClickOutside)
})
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
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
:global(.el-calendar-table .el-calendar-day:hover) {
  cursor: default;
}

.share-card :deep(.el-calendar__header) {
  padding: 0;
  border-bottom: 0 none;
}
.share-card :deep(.el-calendar__body) {
  padding: 0;
}
.share-card :deep(.el-calendar-table tr td) {
  border: 0 none !important;
}
.share-card :deep(.el-calendar-table .el-calendar-day) {
  padding: 2px;
  --el-calendar-selected-bg-color: transparent;
}
.share-card :deep(.el-calendar-table thead th) {
  padding: 0;
  padding-bottom: 11px;
  font-size: 12px;
  line-height: 20px;
  color: var(--main-text);
}
</style>
