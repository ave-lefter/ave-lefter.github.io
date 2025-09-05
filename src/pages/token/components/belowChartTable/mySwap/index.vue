<script setup lang="ts">
import { computed, ref, nextTick, onActivated } from 'vue'
import { useBotStore } from '@/stores/bot'
import { getChainInfo } from '@/utils'
import unified from './unified.vue'
import { bot_getUserWalletTxInfo } from '@/api/token'
import { formatNumber } from '@/utils/formatNumber'
import { useSessionStorage } from '@vueuse/core'

// const props = defineProps({
//   currentActiveTab: {
//     type: String,
//     default: ''
//   }
// })

const botStore = useBotStore()
const walletStore = useWalletStore()
const { t } = useI18n()
const tokenStore = useTokenStore()
const route = useRoute()
const wsStore = useWSStore()

const unifiedRef = ref()
const _chain = getAddressAndChainFromId(route.params.id as string)?.chain
const activeTab = ref(_chain || walletStore.chain || 'solana')
const botOrderOnlyCurrentToken = useSessionStorage('mySwapBotOrderOnlyCurrentToken', true)
const walletTxData = ref<any>()
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

const balance = computed(() => {
  return walletTxData.value ? parseFloat(walletTxData.value.balance_usd || 0) : 0
})
const changePercentage = computed(() => {
  return walletTxData.value ? parseFloat((walletTxData.value.balance_ratio * 100).toString() || '0') : 0
})

const totalProfit = computed(() => {
  return walletTxData.value ? parseFloat(walletTxData.value.total_profit || 0) : 0
})
const profitPercentage = computed(() => {
  return walletTxData.value ? parseFloat((walletTxData.value.total_profit_ratio * 100).toString() || '0') : 0
})

const tokenSymbol = computed(() => {
  return walletTxData.value ? walletTxData.value.symbol : tokenStore.tokenInfo?.token?.symbol
})
const realizedProfit = computed(() => {
  return walletTxData.value ? parseFloat((walletTxData.value.realized_profit || 0).toString() || '0') : 0
})

const realizedProfitPercentage = computed(() => {
  const ratio = walletTxData.value && walletTxData.value.realized_ratio !== '--' ?
    parseFloat((walletTxData.value.realized_ratio * 100).toString() || '0') : 0
  return ratio
})

const unrealizedProfit = computed(() => {
  return walletTxData.value ? parseFloat(walletTxData.value.unrealized_profit || 0) : 0
})
const unrealizedProfitPercentage = computed(() => {
  return walletTxData.value ? parseFloat((walletTxData.value.unrealized_ratio * 100).toString() || '0') : 0
})

const buyTokenAmount = computed(() => {
  return walletTxData.value && walletTxData.value.total_purchase > 0 ? formatNumber(walletTxData.value.bought, 4) : '0'
})

const buyUsdAmount = computed(() => {
  const avgPrice = walletTxData.value ? parseFloat(walletTxData.value.average_purchase_price_usd || 0) : 0
  return avgPrice > 0 ? `$${formatNumber(avgPrice, 8)}` : '--'
})

// 卖出代币数量
const sellTokenAmount = computed(() => {
  return walletTxData.value && walletTxData.value.total_sold > 0 ?
    formatNumber(walletTxData.value.sold || 0, 4) : '0'
})

// 卖出美元金额
const sellUsdAmount = computed(() => {
  const avgPrice = walletTxData.value && walletTxData.value.average_sold_price_usd !== '--' ?
    parseFloat(walletTxData.value.average_sold_price_usd || 0) : 0
  return avgPrice > 0 ?
    `$${formatNumber(avgPrice, 8)}` :
    '--'
})

const userAddress = computed(() => {
  if (botStore?.userInfo?.evmAddress) {
    return tabs.value.find(i => i?.chain === activeTab.value)?.address
  } else {
    return walletStore.address || ''
  }
})

function setActiveTab(val: string) {
  activeTab.value = val
  nextTick(() => {
    getWalletTxData()
  })
}

// 定义移除字符串开头负号的函数
const removeLeadingMinus = (str: string) => str.startsWith('-') ? str.slice(1) : str

const getWalletTxData = async () => {
  // const supportedChains = ['solana', 'bsc']
  const chain = walletStore.address ? walletStore.chain : activeTab.value
  if (!SupportFullDataChain.includes(chain)) {
    walletTxData.value = null
    return
  }

  const token = String(route.params.id).split('-')[0]
  if (!userAddress.value || !token) return


  const params = {
    user_address: userAddress.value,
    chain: chain,
    user_token: token
  }
  const txInfo = await bot_getUserWalletTxInfo(params)
  walletTxData.value = txInfo[0]
}

let timer: null | ReturnType<typeof setInterval> = null
let lastUpdateTime = 0
const maxUpdateNum = 15

watch([() => wsStore.wsResult?.tgbot], () => {
  const chain = getAddressAndChainFromId(String(route.params.id))?.chain
  if (tabs.value.find(i => i?.chain === chain)) {
    activeTab.value = chain
  }
  getWalletTxData()
  unifiedRef.value?.getTxHistory()
  setTimeout(() => {
    unifiedRef.value?.getTxHistory()
  }, 3000)
  if (!timer) {
    timer = setInterval(() => {
      if (lastUpdateTime >= maxUpdateNum) {
        if (timer) {
          clearInterval(timer)
          timer = null
        }
        lastUpdateTime = 0
        return
      }
      getWalletTxData()
      lastUpdateTime += 1
    }, 2000)
  } else {
    lastUpdateTime = 0
  }
})

watch([() => route.params.id], () => {
  const chain = getAddressAndChainFromId(String(route.params.id))?.chain
  if (tabs.value.find(i => i?.chain === chain)) {
    activeTab.value = chain
  }
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  refreshData()
})

function refreshData() {
  getWalletTxData()

  if (unifiedRef.value) {
    unifiedRef.value.getTxHistory()
  }
}

onMounted(() => {
  const chain = getAddressAndChainFromId(String(route.params.id))?.chain
  if (tabs.value.find(i => i?.chain === chain)) {
    activeTab.value = chain
  }
  getWalletTxData()
})

onActivated(() => {
   refreshData()
})
</script>

<template>
  <div>
    <div v-if="botStore?.userInfo?.evmAddress || walletStore.address" class="px-12px mb-10px flex justify-between">
      <!-- Bot钱包显示链选择器 -->
      <div v-if="botStore?.userInfo?.evmAddress" class="flex items-center whitespace-nowrap w-[80%] overflow-x-auto scrollbar-hide">
        <a
          v-for="(item) in tabs" :key="item.chain" href="javascript:;" :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-999-l-666] px-12px py-4px rounded-4px
          ${activeTab === item.chain ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]' : ''}`"
          @click="setActiveTab(item.chain)">
          {{ getChainInfo(item.chain).name }}
        </a>
      </div>
      <!-- 链钱包显示当前链名称 -->
      <div v-else class="flex items-center">
        <span class="text-12px text-[--d-999-l-666] px-12px py-4px">
          <!-- {{ getChainInfo(walletStore.chain || activeTab).name }} -->
        </span>
      </div>

      <div class="flex items-center gap-3">
        <el-checkbox v-model="botOrderOnlyCurrentToken" :label="t('currentToken')" size="small" style="font-size: 12px;color:var(--d-666-l-333)" />
      </div>
    </div>

    <!-- 顶部交易统计区域 -->
    <div v-if="activeTab !== 'xlayer'" class="transaction-stats">
      <div class="stat-item">
        <div class="stat-label text-[--d-666-l-999]">{{ t('balance1') }}</div>
        <div class="stat-value table-field-text text-[var(--d-999-l-959A9F)]">${{ formatNumber(balance, 2) }}</div>
        <div class="stat-change table-field-text text-[var(--d-999-l-959A9F)]">
          {{ formatNumber(walletTxData?.balance_amount || 0, 4) }} {{ tokenSymbol }}
          <span :style="{ color: changePercentage >= 0 ? '#12B886' : '#ff646d' }">
            ({{ changePercentage >= 0 ? '+' : '' }}{{ formatNumber(changePercentage, 2) }}%)
          </span>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label text-[--d-666-l-999]">{{ t('totalProfit') }}</div>
        <div class="stat-value table-field-text text-[var(--d-999-l-959A9F)]" :style="{ color: totalProfit >= 0 ? '#12B886' : '#ff646d' }">
          {{ totalProfit >= 0 ? '+' : '-' }}${{ removeLeadingMinus(formatNumber(totalProfit, 2)) }}
        </div>
        <div class="stat-change text-[var(--d-999-l-959A9F)]" :style="{ color: profitPercentage >= 0 ? '#12B886' : '#ff646d' }">
          {{ profitPercentage >= 0 ? '+' : '' }}{{ formatNumber(profitPercentage, 2) }}%
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label text-[--d-666-l-999]">{{ t('realizedProfit') }}</div>
        <div class="stat-value table-field-text text-[var(--d-999-l-959A9F)]" :style="{ color: realizedProfit >= 0 ? '#12B886' : '#ff646d' }">
          {{ realizedProfit >= 0 ? '+' : '-' }}${{ removeLeadingMinus(formatNumber(realizedProfit, 2)) }}
        </div>
        <div class="stat-change text-[var(--d-999-l-959A9F)]" :style="{ color: realizedProfitPercentage >= 0 ? '#12B886' : '#ff646d' }">
          {{ realizedProfitPercentage >= 0 ? '+' : '' }}{{ formatNumber(realizedProfitPercentage, 2) }}%
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label text-[--d-666-l-999]">{{ t('unrealizedProfit') }}</div>
        <div class="stat-value table-field-text text-[--d-999-l-959A9F]" :style="{ color: unrealizedProfit >= 0 ? '#12B886' : '#ff646d' }">
          {{ unrealizedProfit >= 0 ? '+' : '-' }}${{ removeLeadingMinus(formatNumber(unrealizedProfit, 2)) }}
        </div>
        <div class="stat-change text-[--d-999-l-959A9F]" :style="{ color: unrealizedProfitPercentage >= 0 ? '#12B886' : '#ff646d' }">
          {{ unrealizedProfitPercentage >= 0 ? '+' : '' }}{{ formatNumber(unrealizedProfitPercentage, 2) }}%
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-label text-[--d-666-l-999]">{{ t('buyPriceWithSlash') }}</div>
        <div class="stat-value table-field-text text-[--d-999-l-959A9F]">{{ buyTokenAmount }} {{
          tokenSymbol }}</div>
        <div class="stat-change table-field-text text-[--d-999-l-959A9F]">{{ buyUsdAmount }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label text-[--d-666-l-999]">{{ t('sellPriceWithSlash') }}</div>
        <div class="stat-value table-field-text text-[--d-999-l-959A9F]">{{ sellTokenAmount }} {{
          tokenSymbol }}</div>
        <div class="stat-change table-field-text text-[--d-999-l-959A9F]">{{ sellUsdAmount }}</div>
      </div>
    </div>

    <unified v-if="botStore?.userInfo?.evmAddress || walletStore.address" ref="unifiedRef" :chain="activeTab" :currentToken="botOrderOnlyCurrentToken" :userAddress="userAddress || ''" />
  </div>
</template>

<style lang="scss" scoped>
/* 顶部交易统计样式 */
.transaction-stats {
  display: flex;
  justify-content: space-between;
  margin: 5px 0 15px;
  padding: 10px 0;
  border-top: 1px solid var(--d-222-l-F2F2F2);
  border-bottom: 1px solid var(--d-222-l-F2F2F2);
  background-color: var(--custom-bg-1-color);

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
