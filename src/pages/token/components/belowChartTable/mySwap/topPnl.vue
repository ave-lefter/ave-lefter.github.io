<template>
  <!-- 顶部交易统计区域 -->
  <div class="transaction-stats">
    <div class="stat-item">
      <div class="stat-label text-[--third-text]">{{ t('balance1') }}</div>
      <div class="stat-value table-field-text text-[--secondary-text]">
        ${{ formatNumber(balance, 2) }}
      </div>
      <div class="stat-change table-field-text text-[--secondary-text]">
        {{ formatNumber(walletTxData?.balance_amount || 0, 4) }} {{ tokenSymbol }}
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label text-[--third-text]">{{ t('totalProfit') }}</div>
      <div
        class="stat-value table-field-text"
        :class="totalProfit === '--' ? 'text-[--secondary-text]' : ''"
        :style="{
          color:
            totalProfit === '--' ? undefined : Number(totalProfit) >= 0 ? '#12B886' : '#ff646d',
        }"
      >
        {{
          totalProfit === '--'
            ? totalProfit
            : (Number(totalProfit) >= 0 ? '+' : '-') +
              '$' +
              removeLeadingMinus(formatNumber(totalProfit, 2))
        }}
      </div>
      <div
        class="stat-change"
        :class="profitPercentage === '--' ? 'text-[--secondary-text]' : ''"
        :style="{
          color:
            profitPercentage === '--'
              ? undefined
              : Number(profitPercentage) >= 0
                ? '#12B886'
                : '#ff646d',
        }"
      >
        {{
          profitPercentage === '--'
            ? profitPercentage
            : (Number(profitPercentage) >= 0 ? '+' : '') + formatNumber(profitPercentage, 2) + '%'
        }}
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label text-[--third-text]">{{ t('realizedProfit') }}</div>
      <div
        class="stat-value table-field-text"
        :class="realizedProfit === '--' ? 'text-[--secondary-text]' : ''"
        :style="{
          color:
            realizedProfit === '--'
              ? undefined
              : Number(realizedProfit) >= 0
                ? '#12B886'
                : '#ff646d',
        }"
      >
        {{
          realizedProfit === '--'
            ? realizedProfit
            : (Number(realizedProfit) >= 0 ? '+' : '-') +
              '$' +
              removeLeadingMinus(formatNumber(realizedProfit, 2))
        }}
      </div>
      <div
        class="stat-change"
        :class="realizedProfitPercentage === '--' ? 'text-[--secondary-text]' : ''"
        :style="{
          color:
            realizedProfitPercentage === '--'
              ? undefined
              : Number(realizedProfitPercentage) >= 0
                ? '#12B886'
                : '#ff646d',
        }"
      >
        {{
          realizedProfitPercentage === '--'
            ? realizedProfitPercentage
            : (Number(realizedProfitPercentage) >= 0 ? '+' : '') +
              formatNumber(realizedProfitPercentage, 2) +
              '%'
        }}
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label text-[--third-text]">{{ t('unrealizedProfit') }}</div>
      <div
        class="stat-value table-field-text"
        :class="unrealizedProfit === '--' ? 'text-[--secondary-text]' : ''"
        :style="{
          color:
            unrealizedProfit === '--'
              ? undefined
              : Number(unrealizedProfit) >= 0
                ? '#12B886'
                : '#ff646d',
        }"
      >
        {{
          unrealizedProfit === '--'
            ? unrealizedProfit
            : (Number(unrealizedProfit) >= 0 ? '+' : '-') +
              '$' +
              removeLeadingMinus(formatNumber(unrealizedProfit, 2))
        }}
      </div>
      <div
        class="stat-change"
        :class="unrealizedProfitPercentage === '--' ? 'text-[--secondary-text]' : ''"
        :style="{
          color:
            unrealizedProfitPercentage === '--'
              ? undefined
              : Number(unrealizedProfitPercentage) >= 0
                ? '#12B886'
                : '#ff646d',
        }"
      >
        {{
          unrealizedProfitPercentage === '--'
            ? unrealizedProfitPercentage
            : (Number(unrealizedProfitPercentage) >= 0 ? '+' : '') +
              formatNumber(unrealizedProfitPercentage, 2) +
              '%'
        }}
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label text-[--third-text]">{{ t('buyPriceWithSlash') }}</div>
      <div
        class="stat-value table-field-text"
        :class="buyTokenAmount === '--' ? 'text-[--secondary-text]' : 'text-[--secondary-text]'"
      >
        {{ buyTokenAmount }} {{ tokenSymbol }}
      </div>
      <div
        class="stat-change table-field-text"
        :class="buyUsdAmount === '--' ? 'text-[--secondary-text]' : 'text-[--secondary-text]'"
      >
        {{ buyUsdAmount }}
      </div>
    </div>
    <div class="stat-item">
      <div class="stat-label text-[--third-text]">{{ t('sellPriceWithSlash') }}</div>
      <div
        class="stat-value table-field-text"
        :class="sellTokenAmount === '--' ? 'text-[--secondary-text]' : 'text-[--secondary-text]'"
      >
        {{ sellTokenAmount }} {{ tokenSymbol }}
      </div>
      <div
        class="stat-change table-field-text"
        :class="sellUsdAmount === '--' ? 'text-[--secondary-text]' : 'text-[--secondary-text]'"
      >
        {{ sellUsdAmount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { bot_getUserWalletTxInfo } from '~/api/token'
import type { WalletTokenInfo } from '~/api/types/token'
import BigNumber from 'bignumber.js'
import { useEventBus } from '@vueuse/core'
const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  userAddress: {
    type: String,
    default: '',
  },
})

const walletTxData = ref<WalletTokenInfo | null>()
const walletStore = useWalletStore()
const botStore = useBotStore()
const route = useRoute()
const wsStore = useWSStore()
const { t } = useI18n()
const tokenStore = useTokenStore()

useSwapUpdate(walletTxData)

const balance = computed(() => {
  if (!walletTxData.value) return 0
  const val = walletTxData.value.balance_usd
  if (val === null || val === undefined || isNaN(Number(val))) return 0
  return val
})
const changePercentage = computed(() => {
  if (!walletTxData.value) return 0
  const val = walletTxData.value.balance_ratio
  if (val === null || val === undefined || isNaN(Number(val))) return 0
  return parseFloat((val * 100).toString()) || 0
})

const _isStableCoin = computed(() => {
  return isStableCoin((route.params.id as string) || '')
})

const totalProfit = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return 0
  const val = walletTxData.value.total_profit
  if (val === null || val === undefined || val === '--' || isNaN(Number(val))) return 0
  return parseFloat(val) || 0
})

const profitPercentage = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return 0
  const val = walletTxData.value.total_profit_ratio
  if (val === null || val === undefined || isNaN(Number(val))) return 0
  return BigNumber(val).times(100).toFixed() || 0
})

const tokenSymbol = computed(() => {
  return walletTxData.value ? walletTxData.value.symbol : tokenStore.tokenInfo?.token?.symbol
})
const realizedProfit = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return 0
  const val = walletTxData.value.realized_profit
  if (val === null || val === undefined || val === '--' || isNaN(Number(val))) return 0
  return parseFloat(val) || 0
})

const realizedProfitPercentage = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return 0
  const val = walletTxData.value.realized_ratio
  if (val === null || val === undefined || val === '--' || isNaN(Number(val))) return 0
  return BigNumber(val).times(100).toString() || 0
})

const unrealizedProfit = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return 0
  const val = walletTxData.value.unrealized_profit
  if (val === null || val === undefined || isNaN(Number(val))) return 0
  return val
})
const unrealizedProfitPercentage = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return 0
  const val = walletTxData.value.unrealized_ratio
  if (val === null || val === undefined || isNaN(Number(val))) return 0
  return Number(val) * 100 || 0
})

const buyTokenAmount = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value || !walletTxData.value.total_purchase) return '0'
  return formatNumber(walletTxData.value.bought, 4)
})

const buyUsdAmount = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return '--'
  const val = walletTxData.value.average_purchase_price_usd
  if (val === null || val === undefined || val === '--' || isNaN(Number(val))) return '--'
  const avgPrice = parseFloat(val) || 0
  return avgPrice > 0 ? `$${formatNumber(avgPrice, 4)}` : '--'
})

// 卖出代币数量
const sellTokenAmount = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value || !walletTxData.value.total_sold) return '0'
  return formatNumber(walletTxData.value.sold || 0, 4)
})

// 卖出美元金额
const sellUsdAmount = computed(() => {
  if (_isStableCoin.value) {
    return '--'
  }
  if (!walletTxData.value) return '--'
  const val = walletTxData.value.average_sold_price_usd
  if (val === null || val === undefined || val === '--' || isNaN(Number(val))) return '--'
  const avgPrice = parseFloat(val) || 0
  return avgPrice > 0 ? `$${formatNumber(avgPrice, 4)}` : '--'
})

// 定义移除字符串开头负号的函数
const removeLeadingMinus = (str: string) => (str.startsWith('-') ? str.slice(1) : str)

const getWalletTxData = async () => {
  // const supportedChains = ['solana', 'bsc']
  const chain = walletStore.address ? walletStore.chain : props.chain
  if (![...SupportFullDataChain, 'ton', 'polygon'].includes(chain)) {
    walletTxData.value = null
    return
  }

  const token = getAddressAndChainFromId((route.params.id as string) || '')?.address || ''
  if (!props.userAddress || !token) {
    walletTxData.value = null
    return
  }

  const params = {
    user_address: props.userAddress,
    chain: chain,
    user_token: token,
  }
  const txInfo = await bot_getUserWalletTxInfo(params)
  walletTxData.value = txInfo[0]
}

const swapCompletedEvent = useEventBus<SwapCompletedEventPayload>(BusEventType.SWAP_COMPLETED)
swapCompletedEvent.on(({ fromToken, toToken, chain }) => {
  console.log('Swap completed:', { fromToken, toToken, chain })
  const routerId = route.params.id as string
  const { address, chain: routerChain } = getAddressAndChainFromId(routerId)
  if (routerChain === chain && (address === fromToken || address === toToken)) {
    getWalletTxData()
    setTimeout(() => {
      getWalletTxData()
    }, 5000)
  }
})

watch(
  [() => props.userAddress, () => props.chain, () => route.params.id],
  () => {
    getWalletTxData()
  },
  { immediate: true }
)

let timer: null | ReturnType<typeof setInterval> = null
let lastUpdateTime = 0
const maxUpdateNum = 15

watch(
  () => wsStore.wsResult[WSEventType.TGBOT],
  (val) => {
    if (!val) {
      return
    }
    getWalletTxData()
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
  }
)

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
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
