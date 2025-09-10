<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>
<template>
  <span>
    ${{ formatNumber(row.current_price_usd, 3) }}
  </span>
</template>
