<template>
  <button
    class="order-book-btn clickable"
    :class="{ 'active': modelValue }"
    @click.stop="handleClick"
  >
    <Icon
    v-if="modelValue"
      name="custom:order-book-top"
    />
    <Icon
      v-else
      name="custom:order-book-down"
    />
    <!-- <span class="ml-5px">{{ $t('orderBook') }}</span> -->
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
  color: var(--third-text);
  background: transparent;
  display: flex;
  align-items: center;
  border: none;
  font-size: 14px;
  padding: 0;
  /* padding: 6px 8px;
  border-radius: 4px;
  */
}

.order-book-btn.active {
  /* background: #3F80F71A; */
  color: var(--third-text);
}
</style>
