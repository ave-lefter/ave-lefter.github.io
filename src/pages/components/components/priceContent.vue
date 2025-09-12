<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>
<template>
  <span class="color-[--main-text]">
    ${{ formatNumber(row.current_price_usd, 3) }}
  </span>
</template>
