<template>
  <div
    v-if="bestToken"
    class="flex items-center py-11px px-8px text-12px justify-between bg-[--dialog-bg] rounded-4px mb-12px"
  >
    {{ $t('devBestToken') }}
    <div class="flex items-center color-[--secondary-text] cursor-pointer" @click="tokenClick">
      <TokenImg
        class="mr-4px"
        token-class="w-16px"
        chainClass="w-8px"
        :row="{
          logo_url: bestToken.logo_url || '',
          symbol: bestToken.symbol || '',
          chain: chain || '',
        }"
      />
      <span
        v-tooltip="bestToken.symbol"
        class="font-500 color-[--main-text] mr-2px max-w-60px truncate"
        >{{ bestToken.symbol }}</span
      >
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
const tokenStore = useTokenStore()
const bestToken = ref(null)
const chain = computed(() => getAddressAndChainFromId(route.params.id || '').chain)

const tokenClick = () => {
  const { token } = bestToken.value
  navigateTo(`/token/${token}-${chain.value}`)
}

const _getBestToken = async () => {
  try {
    const res = await getBestToken(route.params.id || '')
    const result = res?.symbol ? res : res.data
    tokenStore.bestToken = result

    if (result?.token !== tokenStore.token?.token) {
      bestToken.value = result
    } else {
      bestToken.value = null
    }
  } catch (error) {
    bestToken.value = null
    console.error('Error fetching best token:', error)
  }
}

_getBestToken()

watch(
  () => tokenStore.token?.token,
  () => {
    _getBestToken()
  }
)
</script>
