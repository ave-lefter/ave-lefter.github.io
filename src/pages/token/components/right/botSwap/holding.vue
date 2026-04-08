<template>
  <div v-if="(Number(walletTokenInfo?.balance_usd || 0) > 0 && Number(tokenStore.swap?.token?.balance || 0) > 0) || isShow || isForceShow" class="max-h-54px flex items-start justify-between color-[--main-text] text-center border-[--main-list-hover] border-1px border-solid mb-12px py-10px rd-4px">
    <div class="flex-1 border-r-[--main-divider] border-r-1px border-r-solid">
      <div class="text-11px color-[--third-text]">{{ $t('bought') }}</div>
      <div class="text-12px mt-5px color-#12B886">{{ total_purchase_usd }}</div>
    </div>
    <div class="flex-1 border-r-[--main-divider] border-r-1px border-r-solid">
      <div class="text-11px color-[--third-text]">{{ $t('sold') }}</div>
      <div class="text-12px mt-5px" :class="[Number(walletTokenInfo?.total_sold_usd || 0) > 0 ? 'color-#F6465D' : 'color-[--third-text]']">{{ total_sold_usd }}</div>
    </div>
    <div class="flex-1 border-r-[--main-divider] border-r-1px border-r-solid">
      <div class="text-11px color-[--third-text]">{{ $t('holding') }}</div>
      <div class="text-12px  mt-5px">{{ balance_usd }}</div>
    </div>
    <div class="flex-1">
      <div class="text-11px color-[--third-text] flex items-center justify-center">
        <span>{{ $t('profit2') }}</span>
        <Icon name="custom:price" class="text-11px clickable ml-5px" :class="[isShowB ? 'color-[--third-text]' : 'color-[--secondary-text]']" @click.stop="isShowB=!isShowB" @mousedown.stop @mouseup.stop />
      </div>
      <div class="text-10px mt-5px" :class="getColor()">
        <template v-if="!isShowB">
           {{ getPlusSign() }}${{ formatNumber(Math.abs(Number(walletTokenInfo?.total_profit) || 0), 2) }}
        </template>
         <template v-else>
           {{ formatNumber(Number(walletTokenInfo?.total_profit || 0) / Number(walletTokenInfo?.main_token_price || 1), 2) }} {{ walletTokenInfo?.main_token_symbol || '' }}
        </template>

      </div>
      <div class="text-10px" :class="getColor()">({{ formatNumber(Number(walletTokenInfo?.total_profit_ratio || 0) * 100, 2) }}%)</div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { bot_getUserWalletTxInfo } from '@/api/token'
import type { WalletTokenInfo } from '@/api/types/token'
import { formatNumber } from '@/utils/formatNumber'
import { useEventBus } from '@vueuse/core'
import { bot_getAddressAllBalances } from '@/api/bot'
import { useSwapUpdate } from '~/composables/useSwapUpdate'

const props = defineProps({
  isForceShow: {
    type: Boolean,
    default: false
  },
  walletTokenInfo: {
    type: Object as () => WalletTokenInfo | null,
    default: null
  }
})

const emit = defineEmits(['update:walletTokenInfo'])
const route = useRoute()
const botStore = useBotStore()
const tokenStore = useTokenStore()
const isShow = ref(false)
const token = computed(() => {
  return getAddressAndChainFromId(route.params?.id as string)?.address || ''
})
const userAddress = computed(() => {
  const [token, chain] = getAddressAndChainFromId(route.params?.id as string, 1)
  if (!token || !chain) {
    return ''
  }
  return botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
})

const total_purchase_usd = computed(() => {
  return !isShowB.value?`$${formatNumber(props.walletTokenInfo?.total_purchase_usd || 0, 2)}`:`${formatNumber(Number(props.walletTokenInfo?.total_purchase_usd || 0) / Number(props.walletTokenInfo?.main_token_price || 1), 2)} ${props.walletTokenInfo?.main_token_symbol || ''}`
})

const total_sold_usd= computed(() => {
  return !isShowB.value?`$${formatNumber(props.walletTokenInfo?.total_sold_usd || 0, 2)}`:`${formatNumber(Number(props.walletTokenInfo?.total_sold_usd || 0) / Number(props.walletTokenInfo?.main_token_price || 1), 2)} ${props.walletTokenInfo?.main_token_symbol || ''}`
})

const balance_usd= computed(() => {
  return !isShowB.value?`$${formatNumber(props.walletTokenInfo?.balance_usd || 0, 2)}`:`${formatNumber(Number(props.walletTokenInfo?.balance_usd || 0) / Number(props.walletTokenInfo?.main_token_price || 1), 2)} ${props.walletTokenInfo?.main_token_symbol || ''}`
})

watch([userAddress, token], (val) => {
  isShow.value = false
  if (val) {
    avgPrice.value = 0
    getWalletTxData()
    // _bot_getAddressAllBalances()
  }
})

const walletTokenInfo = computed({
  get() {
    return props.walletTokenInfo
  },
  set(val) {
    emit('update:walletTokenInfo', val)
  }
})
// watch(walletTokenInfo, (val) => {
//   emit('update:walletTokenInfo', val)
// })

function getPlusSign(){
  switch (true) {
    case Number(walletTokenInfo?.value?.total_profit || 0) > 0:
      return '+'
    case Number(walletTokenInfo?.value?.total_profit || 0) < 0:
      return '-'
    default:
      return ''
  }
}

function getColor(){
  switch (true) {
    case Number(walletTokenInfo?.value?.total_profit || 0) > 0:
      return 'color-#12B886'
    case Number(walletTokenInfo?.value?.total_profit || 0) < 0:
      return 'color-#F6465D'
    default:
      return 'color-[--third-text]'
  }
}
useSwapUpdate(walletTokenInfo)
async function getWalletTxData() {
  const [token, chain] = getAddressAndChainFromId(route.params?.id as string, 1)
  if (!token || !chain) {
    return
  }
  if (!botStore.isSupportChains.includes(chain as typeof botStore.isSupportChains[number])) {
    walletTokenInfo.value = null
    return
  }

  const userAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address

  if (!userAddress || !token) return

  const params = {
    user_address: userAddress,
    chain: chain,
    user_token: token
  }
  return bot_getUserWalletTxInfo(params).then(async res => {
    // console.log('walletTokenInfo', res)
    walletTokenInfo.value = res?.[0] || null
    // const avgPrice = Number(res?.[0]?.balance_amount) > 0 ? Number(res?.[0]?.average_purchase_price_usd || 0) : 0
    // useEventBus('updateAvgPrice').emit(avgPrice)
    if (Number(walletTokenInfo.value?.balance_usd || 0) > 0) {
      isShow.value = false
    }
    return res
  }).catch(async () => {
    walletTokenInfo.value = null
    return null
  })
}

const avgPrice = ref(0)

async function _bot_getAddressAllBalances() {
  const [token, chain] = getAddressAndChainFromId(route.params?.id as string, 1)
  if (!token || !chain) {
    return
  }
  if (!botStore.isSupportChains?.includes?.(chain as typeof botStore.isSupportChains[number])) {
    return
  }
  const params = {
    evmAddress: botStore.evmAddress,
    chains: chain,
    pinToken: route.params?.id as string
  }
  // if (!Number(tokenStore.swap.token?.balance || 0)) {
  //   avgPrice.value = 0
  //   useEventBus('updateAvgPrice').emit(0)
  //   return
  // }
  return bot_getAddressAllBalances(params).then(async res => {
    if (!res?.[0]?.value || res?.[0]?.value > 0 && res?.[0]?.token !== token) {
      avgPrice.value = 0
      useEventBus('updateAvgPrice').emit(0)
      return
    }
    avgPrice.value = Number(res?.[0]?.avgPrice || 0)
    if (res?.[0]?.value > 0) {
      useEventBus('updateAvgPrice').emit(avgPrice.value)
    }
    return res
  }).catch(async () => {
    return null
  })
}


watch(() => route.params.id, () => {
  isShow.value = false
  avgPrice.value = 0
  getWalletTxData()
  // _bot_getAddressAllBalances()
})

watch(() => tokenStore.placeOrderSuccess, async () => {
  isShow.value = true
  // _bot_getAddressAllBalances()
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
  await sleep(5000)
  getWalletTxDataPoll()
})

// watch(() => tokenStore.pairAddress, (val) => {
//   if (val && avgPrice.value > 0) {
//     useEventBus('updateAvgPrice').emit(avgPrice.value)
//   }
// })

let time = 0
let pollTimer: ReturnType<typeof setTimeout> | null = null
let isUnmounted = false

function getWalletTxDataPoll() {
  if (isUnmounted) return
  if (time > 10) {
    time = 0
    return
  }
  getWalletTxData()
  // _bot_getAddressAllBalances()
  time++
  pollTimer = setTimeout(getWalletTxDataPoll, 5000)
}

const isShowB = ref(false)

// 保存事件总线监听器停止函数
const klineDataReadyOff = useEventBus('klineDataReady').on(() => {
  if (avgPrice.value > 0) {
    useEventBus('updateAvgPrice').emit(avgPrice.value)
  }
})

onUnmounted(() => {
  isUnmounted = true
  if (pollTimer) {
    clearTimeout(pollTimer)
    pollTimer = null
  }
  // 清理事件总线监听器
  if (klineDataReadyOff) {
    klineDataReadyOff()
  }
})

onMounted(() => {
  getWalletTxData()
  // _bot_getAddressAllBalances()
})

</script>

<style>

</style>
