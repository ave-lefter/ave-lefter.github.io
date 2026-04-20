<template>
  <div ref="mySwap">
    <div v-if="botStore?.userInfo?.evmAddress || walletStore.address" class="px-12px mb-10px flex justify-between items-center">
      <!-- Bot钱包显示链选择器 -->
      <div v-if="botStore?.userInfo?.evmAddress" class="flex items-center whitespace-nowrap w-[80%] overflow-x-auto scrollbar-hide">
        <a
          v-for="(item) in tabs" :key="item.chain" href="javascript:;" :class="`decoration-none shrink-0 text-12px lh-16px text-center px-12px py-4px rounded-4px
          ${activeTab === item.chain ? 'bg-[--border] color-[--main-text1]' : 'color-[--third-text]'}`"
          @click="setActiveTab(item.chain)">
          {{ getChainInfo(item.chain).name }}
        </a>
      </div>
      <!-- 链钱包显示当前链名称 -->
      <div v-else class="flex items-center">
        <span class="text-12px text-[--third-text] px-12px py-4px">
          <!-- {{ getChainInfo(walletStore.chain || activeTab).name }} -->
        </span>
      </div>

      <div class="flex items-center">
        <el-checkbox v-model="botOrderOnlyCurrentToken" :label="t('currentToken')" size="small" style="font-size: 12px;color:var(--d-666-l-333)" />
      </div>
       <SelectWallet v-if="botStore.evmAddress" ref="selectWallet" :chain="(activeTab as BotChain)" :boundary="boundary" />
    </div>

    <!-- 顶部交易统计区域 -->
    <TopPnl :chain="activeTab" :userAddress="userAddress || ''" />

    <unified v-if="botStore?.userInfo?.evmAddress || walletStore.address" ref="unifiedRef" :chain="activeTab" :currentToken="botOrderOnlyCurrentToken" :userAddress="userAddress || ''"/>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import { useBotStore } from '@/stores/bot'
import { getChainInfo } from '@/utils'
import unified from './unified.vue'
// import { bot_getUserWalletTxInfo } from '@/api/token'
// import { formatNumber } from '@/utils/formatNumber'
import { useSessionStorage } from '@vueuse/core'
import type { WalletTokenInfo } from '~/api/types/token'
// import type { IPriceV2Response } from '~/api/types/ws'
import SelectWallet from '../selectWallet.vue'
import TopPnl from './topPnl.vue'

// const props = defineProps({
//   currentActiveTab: {
//     type: String,
//     default: ''
//   }
// })
const timerArr=[null,null,null] as Array<null | ReturnType<typeof setTimeout>>
// const {  refreshTokenBalance: refreshTokenBalance0 } = useBotSwap(0, true)
// const {  refreshTokenBalance: refreshTokenBalance1 } = useBotSwap(1, true)

const botStore = useBotStore()
const walletStore = useWalletStore()
const { t } = useI18n()
// const tokenStore = useTokenStore()
const route = useRoute()
const wsStore = useWSStore()

const unifiedRef = ref()
const _chain = getAddressAndChainFromId(route.params.id as string)?.chain
const activeTab = ref(_chain || walletStore.chain || 'solana')
const botOrderOnlyCurrentToken = useSessionStorage('mySwapBotOrderOnlyCurrentToken', true)
const walletTxData = ref<WalletTokenInfo | null>()
const boundary = useTemplateRef('mySwap')
useSwapUpdate(walletTxData)
const tabs = computed(() => {
  // 获取原始地址数组
  const addresses = botStore.userInfo?.addresses || []
  // 自定义排序，确保 Solana 在第一位，BSC 在第二位
  return [...addresses].sort((a, b) => {
    if (a.chain === 'solana') return -1  // Solana 排在最前面
    if (b.chain === 'solana') return 1
    if (a.chain === 'bsc') return -1     // BSC 排在 Solana 之后
    if (b.chain === 'bsc') return 1
    return 0  // 其他链保持原来的顺序
  })
})


const selectWalletRef = useTemplateRef<typeof SelectWallet>('selectWallet')

const userAddress = computed(() => {
  if (selectWalletRef.value?.evmAddress) {
    return botStore?.walletList?.find?.(i => i.evmAddress === selectWalletRef.value?.evmAddress)?.addresses?.find?.(i => i.chain === activeTab.value)?.address || ''
  } else if (botStore?.userInfo?.evmAddress) {
    return tabs.value.find(i => i?.chain === activeTab.value)?.address
  } else {
    return walletStore.address || ''
  }
})

function setActiveTab(val: string) {
  activeTab.value = val
}

function getTxHistoryForEvm() {
  const delays = [5000, 7000, 9000]; // 定义延迟时间数组
  for (let i = 0; i < delays.length; i++) {
      timerArr[i] = setTimeout(() => {
          unifiedRef.value?.getTxHistory();
          // isBuy?refreshTokenBalance0():refreshTokenBalance1();
      }, delays[i]);
  }
}

watch(() => wsStore.wsResult[WSEventType.TGBOT], (val) => {
  console.log('wsStore.wsResult[WSEventType.TGBOT]', val)
  if(!val){
    return
  }
  const chain = getAddressAndChainFromId(String(route.params.id))?.chain
  if (tabs.value.find(i => i?.chain === chain)) {
    activeTab.value = chain
  }
  unifiedRef.value?.getTxHistory()
  setTimeout(() => {
    unifiedRef.value?.getTxHistory()
  }, 3000)
  if(val.chain && isEvmChain(val.chain)){
    getTxHistoryForEvm()
    // getTxHistoryForEvm(val.swapType===1)
  }
},{immediate:true})

watch([() => route.params.id], () => {

  const chain = getAddressAndChainFromId(String(route.params.id))?.chain
  if (tabs.value.find(i => i?.chain === chain)) {
    activeTab.value = chain
  }
  clearIntervalAll()
  refreshData()
})

function refreshData() {

  if (unifiedRef.value) {
    unifiedRef.value.getTxHistory()
  }
}

watch(userAddress, () => {

  clearIntervalAll()
})

onMounted(() => {
  const chain = getAddressAndChainFromId(String(route.params.id))?.chain
  if (tabs.value.find(i => i?.chain === chain)) {
    activeTab.value = chain
  }
})

onUnmounted(() => {
  clearIntervalAll()
})

function clearIntervalAll() {
  timerArr.forEach((timerId) => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  })
}
// onActivated(() => {
//    refreshData()
// })

</script>

<style lang="scss" scoped>
/* 顶部交易统计样式 */
.transaction-stats {
  display: flex;
  justify-content: space-between;
  margin: 5px 0 15px;
  padding: 10px 0;
  border-top: 1px solid var(--main-divider);
  border-bottom: 1px solid var(--main-divider);

  .stat-item {
    flex: 1;
    text-align: center;
    padding: 0 5px;

    .stat-label {
      font-size: 12px;
      /* color: var(--custom-text-1-color); */
      margin-bottom: 6px;
    }

    .stat-value {
      font-size: 14px;
      font-weight: 500;
      /* color: var(--custom-text-1-color); */
      margin-bottom: 2px;

      &.token-amount {
        font-size: 13px;
      }
    }

    .stat-change {
      font-size: 12px;
    }
  }
}
</style>
