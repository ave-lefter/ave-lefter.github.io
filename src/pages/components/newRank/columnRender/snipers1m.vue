<script setup lang="ts">
defineProps<{
  row: any
}>()

function formatColor(row) {
  if (Number(row.rusher_tx_count || 0) < 5) {
    return 'color-[--d-666-l-999]'
  }
  // <30显示白色
  return ''
}
</script>
<template>
  <span :class="formatColor(row)">
    {{ formatNumber(row.rusher_tx_count || 0) }}
  </span>
</template>
