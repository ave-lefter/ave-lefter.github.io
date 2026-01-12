<template>
  <div
    v-if="bestToken"
    class="flex items-center py-11px px-8px text-12px justify-between bg-[--dialog-bg] rounded-4px mb-12px"
  >
    {{ $t('devBestToken') }}
    <div class="flex items-center color-[--third-text]">
      <TokenImg
        class="mr-4px"
        :row="{
          logo_url: bestToken.logo_url || '',
          symbol: bestToken.symbol || '',
          chain: bestToken.chain || '',
        }"
      />
      <span class="font-500 text-16px color-[--main-text]">{{ bestToken.symbol }}</span>
      (ATH MC <span class="color-[--main-text]">${{ formatNumber(all_time_high, 2) }}</span
      >)
    </div>
  </div>
</template>
<script setup>
import { getBestToken } from '~/api/token'

const route = useRoute()
const bestToken = ref(null)
const _getBestToken = async () => {
  try {
    const res = await getBestToken(route.params.id || '')
    bestToken.value = res.data
  } catch (error) {
    console.error('Error fetching best token:', error)
  }
}

_getBestToken()
</script>
