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
    <div v-if="shouldShowContent(row)" class="flex justify-end gap-2px">
      <span :class="row.smart_money_buy_count_24h > 0 ? 'color-[--up-color]' : ''">
        {{
          formatNumber(row.smart_money_buy_count_24h || 0, {
            decimals: 0,
            limit: 20,
          })
        }} </span
      ><span class="color-[--third-text]">/</span>
      <span :class="row.smart_money_sell_count_24h > 0 ? 'color-[--down-color]' : ''">
        {{
          formatNumber(row.smart_money_sell_count_24h || 0, {
            decimals: 0,
            limit: 20,
          })
        }}
      </span>
    </div>
    <div v-else>-</div>
  </div>
</template>
