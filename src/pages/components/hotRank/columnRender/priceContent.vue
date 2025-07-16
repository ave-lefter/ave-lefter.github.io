<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>
<template>
  <span :class="!row.current_price_usd ? 'color-[--d-666-l-999]' : ''">
    ${{ formatNumber(row.current_price_usd, 3) }}
  </span>
</template>
