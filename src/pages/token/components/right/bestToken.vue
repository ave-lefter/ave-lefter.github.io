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
          chain: chain || '',
        }"
      />
      <span v-tooltip="bestToken.symbol" class="font-500 text-16px color-[--main-text] mr-2px max-w-60px truncate">{{ bestToken.symbol }}</span>
      (ATH MC
      <span class="color-[--main-text] ml-2px mr-2px"
        >${{ formatNumber(bestToken.all_time_high, 0) }}</span
      >)
    </div>
  </div>
</template>
<script setup>
import { getBestToken } from '~/api/token'

const route = useRoute()
const bestToken = ref(null)
const chain = computed(() => getAddressAndChainFromId(route.params.id || '').chain)
const _getBestToken = async () => {
  try {
    const res = await getBestToken(route.params.id || '')
    console.log(res,'res')
    bestToken.value = res?.symbol ? res : res.data
  } catch (error) {
    console.error('Error fetching best token:', error)
  }
}

_getBestToken()

watch(()=>route.params.id,()=>{
  _getBestToken()
})
</script>
