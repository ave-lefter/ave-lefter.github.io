<template>
  <div>
    <BestToken/>
    <Tabs v-model:activeTab="swapStore.activeTab" />
    <Swap />
  </div>
</template>

<script setup lang='ts'>
import Tabs from './tabs.vue'
import Swap from './swap.vue'
import BestToken from '../bestToken.vue'
const walletStore = useWalletStore()
const swapStore = useSwapStore()
const tokenStore = useTokenStore()
const route = useRoute()

watch([() => tokenStore.token?.token || '', () => walletStore.chain, () => walletStore.address], () => {
  swapStore.init(route.params?.id as string)
}, {immediate: true})



onMounted(() => {
  // swapStore.init()
})

</script>

<style>

</style>
