<script setup lang="ts">
defineProps<{
  row: any
}>()

function formatColor(row) {
  // >30显示红色
  if (row.sniper_tx_count > 30) {
    return 'color-#EB2B4B'
  }
  // <30显示白色
  return ''
}
</script>
<template>
  <span :class="formatColor(row)">
    {{ formatNumber(row.sniper_tx_count || 0) }}
  </span>
</template>
