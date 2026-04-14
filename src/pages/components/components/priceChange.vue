<template>
  <span
    :class="`block overflow-hidden text-ellipsis whitespace-nowrap max-w-100px ${getColorClass(row[changeKey])}`"
  >
    {{ Number(row[changeKey]) > 0 ? '+' : '' }}{{ formatNumber(row[changeKey] || 0, 1) }}%
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  row: any
  activeInterval: string
}>()
const changeKey = computed(() => {
  if (props.activeInterval === '24h') {
    return `m_price_change_${props.activeInterval}`
  }
  return `price_change_${props.activeInterval}`
})
</script>
