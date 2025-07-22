<script setup lang="ts">
const {isDark} = storeToRefs(useThemeStore())
const props = defineProps({
  visible: Boolean,
  modelValue: {
    type: Array,
    default: () => []
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
</script>

<template>
  <el-popover
    v-model:visible="computedVisible"
    placement="bottom"
    :width="420"
    trigger="click"
    teleported
    popper-style="max-width: 420px;--el-text-color-primary:--d-666-l-999"
    popper-class="transaction-popover"
  >
    <template #reference>
      <Icon
        name="custom:filter"
        :class="`${modelValue.length?'color-[--d-999-l-666]':'color-[--d-666-l-999]'} cursor-pointer text-10px`"
      />
    </template>
    <template #default>
      <div class="text-14px font-400 color-[--d-F5F5F5-l-222]">
        {{ $t('filterTime') }}
      </div>
      <div class="mt-10px flex color-[--d-999-l-666] text-12px">
        <span class="flex-[1.2]">{{ $t('startTime') }}</span>
        <span class="flex-1">{{ $t('endTime1') }}</span>
      </div>
      <el-date-picker
        v-model="filterTime"
        class="mt-5px [--el-font-size-base:12px]"
        type="datetimerange"
        range-separator="To"
        start-placeholder="yyyy/mm/dd hh:mm:ss"
        end-placeholder="yyyy/mm/dd hh:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        value-format="X"
        prefix-icon="Calendar"
        :teleported="false"
        @clear="filterTime=[]"
      />
      <div class="flex mt-20px">
        <el-button
          class="h-30px flex-1 m-l-auto"
          :color="isDark ? '#333':'#F2F2F2'"
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
