<script setup lang="ts">
defineProps<{
  row: any
  activeInterval: string
}>()
</script>
<template>
  <span
    :class="`block overflow-hidden text-ellipsis whitespace-nowrap max-w-100px ${getColorClass(row[`price_change_${activeInterval}`])}`"
  >
    {{ Number(row[`price_change_${activeInterval}`]) > 0 ? '+' : '' }}{{ formatNumber(row[`price_change_${activeInterval}`] || 0, 1) }}%
  </span>
</template>
