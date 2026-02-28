<template>
  <div class="flex w-full mb-12px items-center gap-12px">
    <!-- 时间：日历 icon + 左右箭头 + 月份 -->
    <div class="flex items-center gap-6px text-12px h-24px">
      <div
        class="w-24px h-24px flex items-center justify-center shrink-0 rounded-4px border border-solid border-[--d-FFFFFF14-l-00000014]"
      >
        <Icon name="ri:calendar-line" class="color-[--third-text] text-14px" />
      </div>
      <Icon
        name="ri:arrow-left-s-line"
        class="color-[--third-text] text-14px cursor-pointer shrink-0"
        @click="goPrevMonth"
      />
      <span class="min-w-72px text-center font-500 color-[--main-text]">{{ monthLabel }}</span>
      <Icon
        name="ri:arrow-right-s-line"
        class="text-14px shrink-0"
        :class="nextDisabled ? 'color-[--third-text] opacity-50 cursor-not-allowed' : 'color-[--third-text] cursor-pointer'"
        @click="goNextMonth"
      />
    </div>
    <!-- 当月盈亏（紧接在时间后面）：红/绿/白 -->
    <div class="text-12px color-[--main-text]">
      {{ $t('monthTotalPnl') }}:
      <span :class="monthPnlColorClass">
        {{ addSign(summary?.month_total_profit || 0) }}${{
          formatNumber(Math.abs(summary?.month_total_profit || 0), 1)
        }}
      </span>
    </div>
    <!-- 右侧两个 icon -->
    <div class="flex items-center gap-6px p-2px bg-[--main-input-button-bg] rounded-4px ml-auto">
        <Icon
          class="cursor-pointer text-14px p-2px rounded-3px"
          :class="isChartView ? 'color-[--main-text] bg-[--secondary-bg]' : 'color-[--third-text]'"
          name="custom:chart"
          @click="isChartView = !isChartView"
        />
        <Icon
          class="cursor-pointer text-14px color-[--third-text] p-2px"
          name="ic:outline-share"
          @click="emit('share')"
        />
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs'

const isChartView = defineModel('isChartView')
const selectedDate = defineModel('selectedDate')

const emit = defineEmits(['share'])

const props = defineProps({
  getColor: {
    type: Function,
    required: true,
  },
  summary: {
    type: Object,
    required: true,
  },
})

const monthLabel = computed(() => {
  const d = selectedDate.value || dayjs().format('YYYY-MM-DD')
  return dayjs(d).format('MMM YYYY')
})

/** 当月盈亏数字颜色：盈利绿、亏损红、零为白 */
const monthPnlColorClass = computed(() => {
  const v = props.summary?.month_total_profit ?? 0
  if (v === 0) return 'color-[--main-text]'
  return props.getColor(v).color
})

const nextDisabled = computed(() => {
  const d = selectedDate.value || dayjs().format('YYYY-MM-DD')
  return (
    dayjs(d).startOf('month').isAfter(dayjs().startOf('month')) ||
    dayjs(d).startOf('month').isSame(dayjs().startOf('month'))
  )
})

function goPrevMonth() {
  const d = dayjs(selectedDate.value || dayjs().format('YYYY-MM-DD')).subtract(1, 'month')
  selectedDate.value = d.format('YYYY-MM-DD')
}

function goNextMonth() {
  if (nextDisabled.value) return
  const d = dayjs(selectedDate.value).add(1, 'month')
  selectedDate.value = d.format('YYYY-MM-DD')
}
</script>
