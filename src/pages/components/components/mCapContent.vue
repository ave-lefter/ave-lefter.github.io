<script setup lang="ts">
defineProps<{
  row: any
}>()
function getMarketCapColor(row) {
  if (!row?.market_cap) return 'color-[--thrid-text]'

  const marketCap = row.market_cap
  const tokenAge = getTokenAge(row?.created_at)

  // 币龄小于1天且市值大于100万，或币龄小于7天且市值大于1000万
  if ((tokenAge < 86400 && marketCap > 1000000) || (tokenAge < 604800 && marketCap > 10000000)) {
    return 'color-[--yellow]' // 黄色
  }
}

function getTokenAge(listingTime: number) {
  if (!listingTime) return Infinity
  const listingDate = new Date(listingTime)
  const now = new Date()
  return Math.floor((now.valueOf() - listingDate.valueOf()) / 1000)
}
</script>
<template>
  <div :class="getMarketCapColor(row)">${{ formatNumber(row.market_cap || 0, 1) }}</div>
</template>
