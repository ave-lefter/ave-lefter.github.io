<!--
 * @Date: 2025-07-21 10:51:10
 * @LastEditors: Lewis
 * @FilePath: /ave_web/src/pages/components/newRank/columnRender/priceContent.vue
 * @Description: In User Settings Edit
-->
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
