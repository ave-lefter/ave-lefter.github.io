<template>
  <button
    class="order-book-btn ml-auto clickable"
    :class="{ 'active': modelValue }"
    @click.stop="handleClick"
  >
    <Icon
      name="i-codicon:layout-sidebar-left"
      :class="{ 'rotate-90': !modelValue }"
    />
    <span class="ml-5px">{{ $t('orderBook') }}</span>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function handleClick() {
  const newValue = !props.modelValue
  console.log('🔄 订单薄按钮点击:', newValue ? '打开' : '关闭')
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.order-book-btn {
  color: #3F80F799;
  background: #3F80F71A;
  display: flex;
  align-items: center;
  border: none;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;
  margin-left: 8px;
}

.order-book-btn.active {
  background: #3F80F71A;
  color: #3F80F7;
}
</style>
