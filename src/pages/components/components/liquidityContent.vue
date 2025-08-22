<script setup lang="ts">
defineProps<{
  row: any
  isVolUSDT: boolean
}>()
function getTarget(row, key: 'symbol' | 'value' | 'init') {
  const isZero = row.target_token === row.token0_address
  return {
    symbol: () => (isZero ? row.token1_symbol : row.token0_symbol),
    value: () => (isZero ? row.reserve1 : row.reserve0),
    init: () => (isZero ? row.init_reserve1 : row.init_reserve0),
  }[key]()
}
</script>

<template>
  <div v-if="isVolUSDT">
    <div class="lh-18px mb-2px" :class="row.tvl < row.init_tvl ? 'color-[--down-color]' : ''">
      ${{ formatNumber(row.tvl || 0, 1) }}
    </div>
    <div class="lh-16px color-[--third-text] text-12px">
      ${{ formatNumber(row.init_tvl || 0, 1) }}
    </div>
  </div>
  <div v-else>
    <div class="lh-18px mb-2px">
      {{ formatNumber(getTarget(row, 'value'), 1) }} {{ getTarget(row, 'symbol') }}
    </div>
    <div class="lh-16px color-[--third-text] text-12px">
      {{ formatNumber(getTarget(row, 'init'), 1) }} {{ getTarget(row, 'symbol') }}
    </div>
  </div>
</template>
