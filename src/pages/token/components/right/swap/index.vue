<template>
  <div>
    <Tabs v-model:activeTab="swapStore.activeTab" />
    <Swap />
  </div>
</template>

<script setup lang='ts'>
import Tabs from './tabs.vue'
import Swap from './swap.vue'
const walletStore = useWalletStore()
const swapStore = useSwapStore()
const tokenStore = useTokenStore()

watch([() => tokenStore.token?.token || '', () => walletStore.chain, () => walletStore.address], () => {
  if (tokenStore.token?.token) {
    swapStore.init()
  }
})



onMounted(() => {
  swapStore.init()
})

</script>

<style>

</style>
