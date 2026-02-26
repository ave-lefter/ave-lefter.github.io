<template>
  <div class="flex justify-between w-full mb-12px items-center">
    <div class="flex items-center gap-6px text-12px h-24px">
      <el-date-picker
        v-model="monthValue"
        type="month"
        value-format="YYYY-MM-DD"
        :clearable="false"
        :editable="false"
        popper-class="pnl-month-picker"
        class="pnl-month-input"
      />
      <Icon name="ri:arrow-down-s-line" class="color-[--third-text] text-14px" />
    </div>

    <div class="flex items-center gap-8px">
      <div class="text-12px">
        {{ $t('totalPnl') }}:
        <span :class="getColor(summary?.month_total_profit || 0).color">
          {{ addSign(summary?.month_total_profit || 0) }}${{
            formatNumber(Math.abs(summary?.month_total_profit || 0), 1)
          }}
        </span>
      </div>

      <div class="flex items-center gap-6px p-2px bg-[--main-input-button-bg] rounded-4px">
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
  </div>
</template>
<script setup>
import dayjs from 'dayjs'

const isChartView = defineModel('isChartView')
const selectedDate = defineModel('selectedDate')

const emit = defineEmits(['share'])

defineProps({
  getColor: {
    type: Function,
    required: true,
  },
  summary: {
    type: Object,
    required: true,
  },
})

const monthValue = computed({
  get() {
    return selectedDate.value || dayjs().format('YYYY-MM-DD')
  },
  set(val) {
    if (!val) return
    selectedDate.value = dayjs(val).startOf('month').format('YYYY-MM-DD')
  },
})
</script>

<style scoped lang="scss">
:deep(.pnl-month-input) {
  width: 90px;
}

:deep(.pnl-month-input .el-input__wrapper) {
  background: transparent;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
}

:deep(.pnl-month-input .el-input__inner) {
  font-size: 12px;
  font-weight: 500;
  color: var(--main-text);
  cursor: pointer;
}

:deep(.pnl-month-input .el-input__prefix),
:deep(.pnl-month-input .el-input__suffix) {
  display: none;
}
</style>
