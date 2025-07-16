<script setup lang="ts">
defineProps<{
  row: any
}>()

function shouldShowContent(row) {
  return (
    row.smart_money_buy_volume_24h > 0 ||
    row.smart_money_sell_volume_24h > 0 ||
    row.smart_money_buy_count_24h > 0 ||
    row.smart_money_sell_count_24h > 0
  )
}
</script>

<template>
  <div>
    <div v-if="shouldShowContent(row)" class="flex justify-end gap-2px color-[--d-666-l-999]">
      <span :class="row.smart_money_buy_count_24h > 0 ? 'color-#12B886' : ''">
        {{
          formatNumber(row.smart_money_buy_count_24h || 0, {
            decimals: 0,
            limit: 20,
          })
        }} </span
      ><span class="color-[--d-333-l-F5F5F5]">/</span>
      <span :class="row.smart_money_sell_count_24h > 0 ? 'color-#F6465D' : ''">
        {{
          formatNumber(row.smart_money_sell_count_24h || 0, {
            decimals: 0,
            limit: 20,
          })
        }}
      </span>
    </div>
    <div v-else class="color-[--d-666-l-999]">-</div>
  </div>
</template>
