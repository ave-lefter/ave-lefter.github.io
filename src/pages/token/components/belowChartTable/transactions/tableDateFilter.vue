<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const {isDark} = storeToRefs(useThemeStore())
const props = defineProps({
  visible: Boolean,
  modelValue: {
    type: Array,
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
const disabledStart = {
  disabledDate:(date:Date)=>{
     if(filterTime.value[1]){
      return dayjs(date).isAfter(dayjs(filterTime.value[1]*1000)) 
     }
     return false
  },
  disabledHours:(role: string, comparingDate?: Dayjs)=>{
    if(comparingDate && filterTime.value[1]){
      const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
      return arr.filter(()=>{
        return comparingDate.isAfter(dayjs(filterTime.value[1]*1000))
      })
    }
    return []
  },
  disabledMinutes:(date:Date)=>{

  },
  disabledSeconds:(date:Date)=>{

  }
}
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
      <div class="mt-5px flex items-center gap-4px">
        <el-date-picker
          v-bind="disabledStart"
          v-model="filterTime[0]"
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
        to
        <el-date-picker
          v-model="filterTime[1]"
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
      <div class="flex mt-20px">
        <el-button
          class="h-30px flex-1 m-l-auto"
          :color="isDark ? '#252E3C':'#D9E8FF'"
          @click="filterTime.length=0;emit('confirm')"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button
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
