<template>
  <div class="flex justify-between w-full mb-12px">
    <div class="flex items-center gap-4px text-12px h-16px">
      {{ date }}
      <div class="flex items-center gap-2px p-2px bg-[--main-input-button-bg] rounded-2px">
        <Icon
          class="cursor-pointer"
          :class="isChartView ? 'color-[--main-text] bg-[-icon-color]' : 'color-[--third-text]'"
          name="custom:chart"
          @click="isChartView = !isChartView"
        />
      </div>
    </div>
    <div class="text-12px cursor-pointer" @click="dialogCalendarVis = true">
      {{ $t('totalPnl') }}:
      <span :class="getColor(summary.month_total_profit).color">
        {{ addSign(summary.month_total_profit) }}${{
          formatNumber(Math.abs(summary.month_total_profit), 1)
        }}
      </span>
    </div>
  </div>
</template>
<script setup>
import dayjs from 'dayjs'

const localeStore = useLocaleStore()
const isChartView = defineModel('isChartView')
const dialogCalendarVis = defineModel('dialogCalendarVis')
const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  getColor: {
    type: Function,
    required: true,
  },
  summary: {
    type: Object,
    required: true,
  },
})

const date = computed(() => {
  return localeStore.locale === 'zh-cn'
    ? dayjs(props.date).format('YYYY-MM')
    : dayjs(props.date).format('MMM YYYY')
})
</script>
