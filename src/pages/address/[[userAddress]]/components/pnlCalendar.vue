<template>
  <div ref="shareDom">
    <el-calendar
      v-show="!isChartView"
      :model-value="new Date()"
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
      <template #date-cell="{ data: { date } }">
        <template v-if="dayjs(date).isSame(dayjs(selectedDate), 'month')">
          <div
            class="text-center h-full"
            :class="[getColor(getPnl(date)).bg, 'cursor-pointer']"
            @click="clickDay(date, $event)"
          >
            <span class="text-12px color-[--third-text] lh-14px">{{
              dayjs(date).format('DD')
            }}</span>
            <div class="text-12px lh-14px mt-2px" :class="getColor(getPnl(date)).color">
              {{ addSign(getPnl(date)) }}${{ formatNumber(Math.abs(getPnl(date)),{decimals:1,limit:4}) }}
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

      <div class="bg-[--secondary-bg] rounded-8px p-12px">
        <img v-if="shareImage" :src="shareImage" alt="share" class="w-full rounded-8px">
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
const buttonRef = ref(null)
const popVisible = ref(false)
const tooltipDate = ref('')
const dialogCalendarVis = ref(false)
const shareDialogVisible = ref(false)
const shareImage = ref('')

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
      cssColor: getCssVariable('color-[--up-color]'),
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
        color: (value) => {
          return getColor(value.value.profit).cssColor
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
      formatter: formatterTooltip,
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

const generateShareImage = async () => {
  if (!shareDom.value) return ''
  const canvas = await html2canvas(shareDom.value, {
    backgroundColor: null,
    scale: 2,
    allowTaint: true,
    useCORS: true,
    scrollY: 0,
    scrollX: 0,
  })
  return canvas.toDataURL('image/png')
}

const openShareDialog = async () => {
  shareDialogVisible.value = true
  shareImage.value = await generateShareImage()
}

const copySharePoster = async () => {
  if (!shareDom.value) return
  const canvas = await html2canvas(shareDom.value, {
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
</style>
