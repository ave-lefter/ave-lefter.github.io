<template>
  <el-dropdown ref="dropdownRef" :persistent="false" trigger="click" popper-class="w-filterType">
    <Icon
      id="custom-filter"
      name="custom:filter"
      class="text-12px cursor-pointer color-[--secondary-text]"
    />
    <template #dropdown>
      <div class="flex flex-col gap-0px min-w-200px">
        <checkbox-group v-model="localModelValue" :options="props.options" class="[&_.el-checkbox]:mr-0 [&_.el-checkbox]:text-[--third-text] [&_.el-checkbox__input.is-checked+.el-checkbox__label]:text-[--main-text]"/>
        <min-vol-input 
          v-model="localMinVol" 
          :label="$t('minAmountU') + '($)'"
          placeholder="0.00"
        />
        <div class="flex gap-8px mt-8px">
          <el-button class="flex-1 bg-[--gray-button-hover] border-1px border-[--border] text-[--main-text] hover:border-[--border]" @click="handleCancel">{{ $t('cancel') }}</el-button>
          <el-button type="primary" class="flex-1" @click="handleConfirm">{{ $t('confirm') }}</el-button>
        </div>
      </div>
    </template>
  </el-dropdown>
</template>
<script setup lang="ts">
import MinVolInput from './minVolInput.vue'

const props = defineProps({
  modelValue: {
    type: Array as () => (number | string)[],
    default: () => []
  },
  options: {
    type: Array as () => { label: string, value: number | string }[],
    default: () => []
  },
  minVol: {
    type: Number,
    default: 0.01
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: (number | string)[]): void,
  (e: 'update:minVol', val: number): void
}>()

// 本地响应式变量
const localModelValue = ref([...props.modelValue])
const localMinVol = ref(props.minVol)

// dropdown ref
const dropdownRef = ref()

// 初始化时同步 props 的值
onMounted(() => {
  localModelValue.value = [...props.modelValue]
  localMinVol.value = props.minVol
})

// 监听 props 变化
watch(() => props.modelValue, (newVal) => {
  localModelValue.value = [...newVal]
})

watch(() => props.minVol, (newVal) => {
  localMinVol.value = newVal
})

// 取消按钮
const handleCancel = () => {
  localModelValue.value = [...props.modelValue]
  localMinVol.value = props.minVol
  // 关闭下拉框
  if (dropdownRef.value) {
    dropdownRef.value.handleClose()
  }
}

// 确认按钮
const handleConfirm = () => {
  emit('update:modelValue', [...localModelValue.value])
  emit('update:minVol', localMinVol.value)
  // 关闭下拉框
  if (dropdownRef.value) {
    dropdownRef.value.handleClose()
  }
}
</script>

<style lang="scss">
.w-filterType {
  --el-font-weight-primary: 400;
  --el-checkbox-height: 34px;
  padding: 16px 12px !important;
}
</style>