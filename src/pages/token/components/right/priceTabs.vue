<template>
  <div class="tabs">
    <button
      v-for="item in tabs"
      :key="item.id"
      class="tab-button clickable-btn"
      :class="{ active: modelValue === item.id }"
      @click.stop="$emit('update:modelValue', item.id)"
    >
      <div class="name">{{ item.name }}</div>
      <div class="value" :style="{ color: getColor(item.id) }">
        {{!!tokenStore.pair ? formatNumber(tokenStore.pair?.[`price_change_${item?.id}`], 2) : '--' }}%
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'
defineProps<{
  modelValue: string
  tabs: { id: '5m' | '1h' | '4h' | '24h'; name: string }[]
}>()

const $emit = defineEmits(['update:modelValue'])
const tokenStore = useTokenStore()
const getColor = (id: string) => {
  const val = tokenStore.pair?.[`price_change_${id}` as 'price_change_5m' | 'price_change_1h' | 'price_change_4h' | 'price_change_24h']
  if(!val) return '#999'
  if (val > 0) return '#12B886'
  if (val < 0) return '#F6465D'
  return '#999'
}


</script>

<style scoped lang="scss">
  .tabs {
    display: flex;
    align-items: center;
     background: var(--main-list-hover);
    .tab-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      background: var(--main-list-hover);
      color: var(--main-text);
      flex: 1;
      min-height: 44px;
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
      .name {
        font-size: 11px;
      }
      .value {
        font-size: 12px;
        margin-top: 2px;
      }
      &.active {
        background: var(--tab-active-bg);
      }
    }
  }
</style>
