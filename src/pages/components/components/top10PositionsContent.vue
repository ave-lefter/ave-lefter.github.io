<script setup lang="ts">
defineProps<{
  row: any
}>()

function formatColor(row) {
  // 1. >30%显示黄色
  if (row.holders_top10_ratio >= 30) {
    return 'color-[--yellow]'
    // 0 灰色
  } else if (row.holders_top10_ratio === 0) {
    return 'color-[--third-text]'
  }
}
</script>
<template>
  <span :class="formatColor(row)">
    {{
      row.holders_top10_ratio > 0 && row.holders_top10_ratio < 0.1
        ? '<0.1'
        : formatNumber(row.holders_top10_ratio || 0, 1)
    }}%
  </span>
</template>
