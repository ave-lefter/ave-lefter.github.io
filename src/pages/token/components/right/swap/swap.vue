<template>
  <TypesTabs v-model:tab="swapStore.swapType" />
  <component :is="Comp" />
</template>

<script setup lang='ts'>
import TypesTabs from './typeTabs.vue'
import Market from './market.vue'
import { useSwapStore } from '~/stores/swap'
const swapStore = useSwapStore()
const LimitComponent = defineAsyncComponent(() => import('./limit.vue'))

const Comp = computed(() => {
  if (swapStore.swapType === 0 || swapStore.swapType === 1) {
    return LimitComponent
  } else {
    return Market
  }
})


</script>

<style>

</style>
