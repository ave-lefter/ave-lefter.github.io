<template>
  <New v-if="SupportFullDataChain.includes(chain)" :currentActiveTab="props.currentActiveTab"/>
  <Old v-else :currentActiveTab="props.currentActiveTab"/>
</template>

<script setup lang="ts">
import New from './new/index.vue'
import Old from './old/index.vue'
import { SupportFullDataChain } from '@/utils/constants'
const props = defineProps({
  currentActiveTab: {
    type: String,
    default: 'Transactions'
  }
})
const route = useRoute()
const tokenStore = useTokenStore()
const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenStore.token?.chain || ''
  return chain
})
</script>

<style scoped lang="scss"></style>
