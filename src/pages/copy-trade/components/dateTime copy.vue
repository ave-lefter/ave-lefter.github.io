<script setup lang="ts">
import dayjs from 'dayjs'

const { isDark } = storeToRefs(useThemeStore())
const { advancedForm } = storeToRefs(useCopyTradeStore())
const emit = defineEmits(['change'])
const props = defineProps({
  boundary: {
    type: HTMLElement,
    default: undefined,
  },
})
onMounted(() => {
  filterTime.value[0] = advancedForm.value.minTokenAge || null
  filterTime.value[1] = advancedForm.value.maxTokenAge || null
})
const filterTime = ref<[number | null, number | null]>([null, null])
const disabledStartDate = (date: Date) => {
  if (filterTime.value[1]) {
    return dayjs(date).isAfter(dayjs(filterTime.value[1] * 1000))
  }
  return false
}
const disabledEndDate = (date: Date) => {
  if (filterTime.value[0]) {
    return dayjs(date).isBefore(dayjs(filterTime.value[0] * 1000))
  }
  return false
}
const reset = ()=>{
  filterTime.value = [null, null]
}
defineExpose({ reset })
</script>

<template>
  <div class="mt-5px flex items-center gap-4px text-12px">
    <el-date-picker
      v-model="filterTime[0]"
      :disabled-date="disabledStartDate"
      class="[--el-font-size-base:12px]"
      type="datetime"
      placeholder="开始时间"
      range-separator="To"
      start-placeholder="yyyy/mm/dd hh:mm:ss"
      end-placeholder="yyyy/mm/dd hh:mm:ss"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="X"
      prefix-icon="Calendar"
      :teleported="false"
      @change="emit('change',filterTime)"
    />
    <span class="gap px-4px">~</span>
    <el-date-picker
      v-model="filterTime[1]"
      :disabled-date="disabledEndDate"
      class="[--el-font-size-base:12px]"
      type="datetime"
      range-separator="To"
      placeholder="截止时间"
      start-placeholder="yyyy/mm/dd hh:mm:ss"
      end-placeholder="yyyy/mm/dd hh:mm:ss"
      format="YYYY-MM-DD HH:mm:ss"
      value-format="X"
      prefix-icon="Calendar"
      :teleported="false"
      @change="emit('change',filterTime)"
    />
  </div>
</template>

<style lang="scss" scoped>
  :deep().el-date-editor.el-input{
    width: 214px;
    height: 48px;
  .el-input__wrapper {
      background: var(--border);
      padding: 0 12px;
      -el-input-inner-height: 48px;
      --el-input-inner-height: 48px;
    }
  }

.transaction-popover {
  .el-date-editor .el-icon {
    display: inline-flex;
  }
}
</style>
