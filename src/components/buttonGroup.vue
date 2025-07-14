<template>
  <div class="button-group">
    <button
      v-for="(item, index) in options"
      :key="index"
      :class="{ active: activeValue === item.id }"
      @click.stop="click(item)"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  options: {
    type: Array as PropType<{ id: string; name: string }[]>,
    default: () => [],
  },
  activeValue: {
    type: [Number, String],
    default: '',
  },
})

const emit = defineEmits(['update:activeValue', 'change'])

const click = (item: { id: string; name: string }) => {
  emit('update:activeValue', item.id)
  emit('change', item)
}
</script>

<style scoped lang="scss">
.button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--d-222-l-F2F2F2);
  padding: 1px;
  border-radius: 4px;
  font-size: 12px;
  height: 28px;

  button {
    border: none;
    color: var(--a-text-2-color);
    letter-spacing: 0;
    font-weight: 400;
    cursor: pointer;
    border-radius: 4px;
    background: transparent;
    min-width: 36px;
    padding: 5px 10px;
    text-align: center;

    &.active {
      background: var(--d-111-l-FFF);
      color: var(--d-F5F5F5-l-333);
    }
  }
}
</style>
