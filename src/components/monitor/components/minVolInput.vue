<!--
 * @Date: 2026-04-11 03:37:38
 * @LastEditors: Lewis
 * @FilePath: /ave_web/src/components/monitor/components/minVolInput.vue
 * @Description: In User Settings Edit
-->
<template>
  <div class="input-section">
    <span class="label">{{ label }}</span>
    <el-input 
      v-model="localValue" 
      :placeholder="placeholder" 
      class="input-field"
      @input="handleInput"
      @keydown="preventNegativeSign"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '0.00'
  }
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
}>()

// 本地响应式变量
const localValue = ref(props.modelValue)

// 监听 props 变化
watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

// 处理输入，只允许数字和小数点
const handleInput = (value: string) => {
  // 移除非数字和非小数点的字符
  let cleaned = value.replace(/[^\d.]/g, '')
  
  // 确保只有一个小数点
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // 限制小数位数为5位
  if (parts.length === 2 && parts[1].length > 5) {
    cleaned = parts[0] + '.' + parts[1].substring(0, 5)
  }
  
  const newValue = cleaned === '' ? 0 : parseFloat(cleaned)
  localValue.value = newValue
  emit('update:modelValue', newValue)
}

// 阻止输入负号
const preventNegativeSign = (event: KeyboardEvent | Event) => {
  if ('key' in event && (event.key === '-' || event.key === '−')) {
    event.preventDefault()
  }
}
</script>

<style lang="scss" scoped>
.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .label {
    font-size: 12px;
    color: var(--third-text);
  }
  
  .input-field {
    :deep(.el-input__wrapper) {
      background-color: var(--input-bg);
      border: 1px solid var(--border);
      
      &:hover {
        border-color: var(--primary-color);
      }
      
      &.is-focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 1px var(--primary-color) inset;
      }
    }
    
    :deep(.el-input__inner) {
      color: var(--main-text);
      font-size: 12px;
    }
  }
}
</style>
