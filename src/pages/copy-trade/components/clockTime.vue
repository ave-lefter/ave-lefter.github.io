<script setup lang="ts">
import dayjs from 'dayjs'

const { isDark } = storeToRefs(useThemeStore())
const { advancedForm } = storeToRefs(useCopyTradeStore())
const props = defineProps({
  boundary: {
    type: HTMLElement,
    default: undefined,
  },
})
const emit = defineEmits(['change'])
onMounted(() => {
  filterTime.value[0] = advancedForm.value.enableAt ? advancedForm.value.enableAt + ":00" : null
  filterTime.value[1] = advancedForm.value.disableAt ? advancedForm.value.disableAt + ":00" : null
})
const filterTime = ref<[string | null, string | null]>([null, null])
const timeToSeconds = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 3600 + m * 60
}

const disabledStartHours = () => {
  if (!filterTime.value[1]) return []
  const endSec = timeToSeconds(filterTime.value[1])
  const endHour = Math.floor(endSec / 3600)
  return Array.from({ length: 24 }, (_, h) => h).filter(h => h > endHour)
}

const disabledEndHours = () => {
  if (!filterTime.value[0]) return []
  const startSec = timeToSeconds(filterTime.value[0])
  const startHour = Math.floor(startSec / 3600)
  return Array.from({ length: 24 }, (_, h) => h).filter(h => h < startHour)
}
const reset = ()=>{
  filterTime.value = [null, null]
}
defineExpose({ reset })
</script>

<template>
  <div class="mt-5px flex items-center gap-4px text-12px">
    <el-time-picker
      v-model="filterTime[0]"
      :disabled-hours="disabledStartHours"
      class="[--el-font-size-base:12px]"
      type="datetime"
      placeholder="开始时间"
      format="HH:00"
      value-format="HH:00"
      prefix-icon="Clock"
      :teleported="false"
      @change="emit('change',filterTime)"
    />
    <span class="gap px-4px">~</span>
    <el-time-picker
      v-model="filterTime[1]"
      :disabled-hours="disabledEndHours"
      class="[--el-font-size-base:12px]"
      type="datetime"
      placeholder="截止时间"
      format="HH:00"
      value-format="HH:00"
      prefix-icon="Clock"
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
