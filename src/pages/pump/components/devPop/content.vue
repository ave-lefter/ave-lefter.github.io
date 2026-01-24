<template>
  <div v-if="!loading && info?.wallet_address" class="p-12px text-12px">
    <div class="color-[--main-text] mb-12px">DEV {{ $t('insidersOwned') }} <span class="ml-2px" :style="{color: Number(info?.balance_radio_cur) > 5? '#F6465D' : '#12B886',}">{{ formatNumber(info?.balance_radio_cur || 0, { decimals: 2}) }}%</span></div>
    <ul>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('devWallet') }}</span>
        <span class="color-[--main-text]">{{ info?.wallet_address?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3') }}</span>
      </li>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('totalBuy') }}</span>
        <div class="flex items-center justify-end color-[--up-color]"><span>${{ formatNumber(info?.buy_volume_u || 0, { decimals: 2, limit: 3}) }}</span><span class="color-[--main-text]">/</span><span>{{ formatNumber(info?.buy_count || 0, { decimals: 2, limit: 3}) }} TX</span></div>
      </li>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('totalSell') }}</span>
        <div class="flex items-center justify-end color-[--down-color]"><span>${{ formatNumber(info?.sell_volume_u || 0, { decimals: 2, limit: 3}) }}</span><span class="color-[--main-text]">/</span><span>{{ formatNumber(info?.sell_count || 0, { decimals: 2, limit: 3}) }} TX</span></div>
      </li>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('balance1') }}</span>
        <span class="color-[--main-text]">${{ formatNumber(info?.balance_usd || 0, { decimals: 2, limit: 3}) }}</span>
      </li>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('source') }}</span>
        <span class="color-[--main-text]">{{ info?.first_deposit_address?.replace(new RegExp('(.{4})(.+)(.{4}$)'), '$1...$3') }}</span>
      </li>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('transferIn1') }}</span>
        <span class="color-[--main-text]">${{ formatNumber(info?.first_deposit_amount || 0, { decimals: 2, limit: 3}) }}</span>
      </li>
      <li class="flex items-center justify-between mb-8px">
        <span class="color-[--third-text]">{{ $t('time') }}</span>
        <span class="color-[--main-text]">{{ formatDate(info?.first_deposit_at || 0) }}</span>
      </li>
    </ul>
  </div>
  <div v-if="!loading && !info?.wallet_address" class="p-12px w-200px min-h-60px flex flex-col items-center justify-center">
    <div class="text-14px font-400 color-[--third-text]">{{ $t('emptyNoData') }}</div>
  </div>
</template>

<script setup lang='ts'>
import type { _getDevInfo } from '~/api/pump'
type DevInfo = Awaited<ReturnType<typeof _getDevInfo>>
defineProps({
  info: {
    type: Object as PropType<DevInfo | null>,
    default: () => (null),
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
</style>
