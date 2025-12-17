<template>
  <div ref="scrollRef" className="pt-[24px] px-16px bg-[--main-bg] pb-0 overflow-y-auto w-full" style="max-height: calc(100vh - 92px);">
    <Statistic
      ref="statisticRef"
      :followAddress="followAddress"
      :address="userAddress"
      :chain="chain"
    />
    <StatisticsTable
      ref="statisticsTable"
      :address="userAddress"
      :followAddress="followAddress"
      :orderId="orderId"
      :chain="chain"
    />
    <TradeDialog v-model="copyTradeVisible" />
  </div>
</template>
<script setup>
import Statistic from './components/statistic.vue'
import StatisticsTable from './components/statisticsTable.vue'
import TradeDialog from '~/pages/copy-trade/components/tradeDialog.vue'
import { getChainInfo } from '@/utils'
import { useEventBus, useStorage } from '@vueuse/core'

definePageMeta({
  name: 'copy-trade-wallet'
})
const { copyObj, copyTradeVisible } = storeToRefs(useCopyTradeStore())
const scrollRef = useTemplateRef('scrollRef')
const route = useRoute()
const botStore = useBotStore()

const walletStore = useWalletStore()
const cachedChain = useStorage('cachedChain', 'solana',sessionStorage)
const chain = computed(() => {
  if (route.params.chain) {
    return route.params.chain
  }
  if (botStore?.userInfo?.evmAddress) {
    return cachedChain.value
  }
  return walletStore.chain || ''
})

const orderId = computed(() => {
  return Number(route.query.id) || copyObj.value.id
})
const followAddress = computed(() => {
  return route.query.followAddress || copyObj.value.followAddress
})
const userAddress = computed(() => {
  if (route.query.creatorAddress) {
    return route.query.creatorAddress
  }
  if (botStore?.userInfo?.evmAddress) {
    return botStore.getWalletAddress(cachedChain.value)
  }
  return walletStore.address || ''
})
const { t } = useI18n()

const router = useRouter()
const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
scrollTopEvent.on(scrollToTop)
onUnmounted(()=>{
  scrollTopEvent.off(scrollToTop)
})
function scrollToTop() {
  scrollRef.value.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function updateModelChain(val) {
  // let address = botStore.getWalletAddress(val)
  // if(!route.params.chain){
  //   cachedChain.value = val
  // } else if(!isSelfAddress.value) {
  //   address = route.params.userAddress
  // }
  // navigateTo(`/address/${address}/${val}`)
}
</script>

<style scoped lang="scss">
.m-radio-group {
  :deep()
    .el-radio-button
    .el-radio-button__original-radio:not(:disabled)
    + .el-radio-button__inner {
    border-color: var(--d-333-l-666);
  }
}
:deep(.el-scrollbar__bar.is-vertical){
  display: none;
}
</style>
