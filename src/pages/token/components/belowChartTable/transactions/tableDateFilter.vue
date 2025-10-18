<script setup lang="ts">
import dayjs from 'dayjs'

const {isDark} = storeToRefs(useThemeStore())
const props = defineProps({
  visible: Boolean,
  modelValue: {
    type: Array<string>,
    default: () => []
  },
  boundary: {
    type: HTMLElement,
    default: undefined
  }
})
const emit = defineEmits(['update:visible', 'confirm', 'reset'])
const computedVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})
const filterTime = ref([])
const disabledStartDate = (date:Date)=>{
    if(filterTime.value[1]){
    return dayjs(date).isAfter(dayjs(filterTime.value[1]*1000)) 
    }
    return false
}
const disabledEndDate = (date:Date)=>{
  if(filterTime.value[0]){
    return dayjs(date).isBefore(dayjs(filterTime.value[0]*1000))
  }
  return false
}
const disabledSave = computed(()=>{
  if(filterTime.value[1] && filterTime.value[0]){
    return filterTime.value[1] < filterTime.value[0]
  }
  return false
})
watch(()=>props.modelValue,(val:string[])=>{
  filterTime.value = val
})
</script>

<template>
  <el-popover
    v-model:visible="computedVisible"
    placement="bottom"
    :width="420"
    trigger="click"
    teleported
    popper-style="max-width: 420px;--el-text-color-primary:--third-text"
    popper-class="transaction-popover"
    :popper-options="{ modifiers: [{ name: 'preventOverflow', options: { boundary: boundary, padding: 0 } }] }"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        :class="`${modelValue.length?'color-[--secondary-text]':'color-[--third-text]'} cursor-pointer text-10px`"
      />
    </template>
    <template #default>
      <div class="text-14px font-400 color-[--main-text]">
        {{ $t('filterTime') }}
      </div>
      <div class="mt-10px flex color-[--secondary-text] text-12px">
        <span class="flex-[1.2]">{{ $t('startTime') }}</span>
        <span class="flex-1">{{ $t('endTime1') }}</span>
      </div>
      <div class="mt-5px flex items-center gap-4px text-12px">
        <el-date-picker
          v-model="filterTime[0]"
          :disabled-date="disabledStartDate"
          class="[--el-font-size-base:12px]"
          type="datetime"
          range-separator="To"
          start-placeholder="yyyy/mm/dd hh:mm:ss"
          end-placeholder="yyyy/mm/dd hh:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="X"
          prefix-icon="Calendar"
          :teleported="false"
        />
        {{ $t('to') }}
        <el-date-picker
          v-model="filterTime[1]"
          :disabled-date="disabledEndDate"
          class="[--el-font-size-base:12px]"
          type="datetime"
          range-separator="To"
          start-placeholder="yyyy/mm/dd hh:mm:ss"
          end-placeholder="yyyy/mm/dd hh:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="X"
          prefix-icon="Calendar"
          :teleported="false"
        />
      </div>
      <div v-if="disabledSave" class="text-12px text-[--down-color] mt-4px">
      {{ $t('selectCorrectTimeRange') }}
      </div>
      <div class="flex mt-20px">
        <el-button
          class="h-30px flex-1 m-l-auto"
          :color="isDark ? '#252E3C':'#D9E8FF'"
          @click="filterTime.length=0;emit('confirm')"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button
          :disabled="disabledSave"
          type="primary"
          class="h-30px flex-1 m-l-auto"
          @click="emit('confirm',filterTime.slice())"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
  </el-popover>
</template>

<style lang="scss">
.transaction-popover {
  .el-date-editor .el-icon {
    display: inline-flex;
  }
}
</style>
