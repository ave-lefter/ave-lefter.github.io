<template>
  <div v-if="(Number(walletTokenInfo?.balance_usd || 0) > 0 && Number(tokenStore.swap?.token?.balance || 0) > 0) || isShow" class="max-h-54px flex items-start justify-between color-[--main-text] text-center bg-[--main-list-hover] mb-12px py-10px rd-4px">
    <div class="flex-1">
      <div class="text-11px color-[--third-text]">{{ $t('bought') }}</div>
      <div class="text-12px mt-5px color-#12B886">${{ formatNumber(walletTokenInfo?.total_purchase_usd || 0, 2) }}</div>
    </div>
    <div class="flex-1">
      <div class="text-11px color-[--third-text]">{{ $t('sold') }}</div>
      <div class="text-12px mt-5px" :class="[Number(walletTokenInfo?.total_sold_usd || 0) > 0 ? 'color-#F6465D' : 'color-[--third-text]']">${{ formatNumber(walletTokenInfo?.total_sold_usd || 0, 2) }}</div>
    </div>
    <div class="flex-1">
      <div class="text-11px color-[--third-text]">{{ $t('holding') }}</div>
      <div class="text-12px  mt-5px">${{ formatNumber(walletTokenInfo?.balance_usd || 0, 2) }}</div>
    </div>
    <div class="flex-1">
      <div class="text-11px color-[--third-text] flex items-center justify-center">
        <span>{{ $t('profit2') }}</span>
        <Icon name="custom:price" class="text-11px clickable ml-5px" :class="[isShowB ? 'color-[--third-text]' : 'color-[--secondary-text]']" @click.stop="isShowB=!isShowB" />
      </div>
      <div class="text-12px mt-5px" :class="[Number(walletTokenInfo?.total_profit || 0) > 0 ? 'color-#12B886' : 'color-#F6465D']">
        <template v-if="!isShowB">
           {{ Number(walletTokenInfo?.total_profit || 0) > 0 ? '' : '-' }}${{ formatNumber(Math.abs(Number(walletTokenInfo?.total_profit) || 0), 2) }}
        </template>
         <template v-else>
           {{ formatNumber(Number(walletTokenInfo?.total_profit || 0) / Number(walletTokenInfo?.main_token_price || 1), 2) }} {{ walletTokenInfo?.main_token_symbol || '' }}
        </template>

      </div>
      <div class="text-8px" :class="[Number(walletTokenInfo?.total_profit_ratio || 0) > 0 ? 'color-#12B886' : 'color-#F6465D']">({{ formatNumber(Number(walletTokenInfo?.total_profit_ratio || 0) * 100, 2) }}%)</div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { bot_getUserWalletTxInfo } from '@/api/token'
import type { WalletTokenInfo } from '@/api/types/token'
import { formatNumber } from '@/utils/formatNumber'
import { useEventBus } from '@vueuse/core'
import { bot_getAddressAllBalances } from '@/api/bot'
const route = useRoute()
const botStore = useBotStore()
const tokenStore = useTokenStore()
const isShow = ref(false)
const userAddress = computed(() => {
  const [token, chain] = getAddressAndChainFromId(route.params?.id as string, 1)
  if (!token || !chain) {
    return ''
  }
  return botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
})

watch(userAddress, (val) => {
  isShow.value = false
  if (val) {
    avgPrice.value = 0
    getWalletTxData()
    _bot_getAddressAllBalances()
  }
})



const walletTokenInfo = ref<WalletTokenInfo | null>(null)
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
    console.log('walletTokenInfo', res)
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
  _bot_getAddressAllBalances()
})

watch(() => tokenStore.placeOrderSuccess, () => {
  isShow.value = true
  getWalletTxDataPoll()
  _bot_getAddressAllBalances()
})

// watch(() => tokenStore.pairAddress, (val) => {
//   if (val && avgPrice.value > 0) {
//     useEventBus('updateAvgPrice').emit(avgPrice.value)
//   }
// })

let time = 0
function getWalletTxDataPoll() {
  if (time > 10) {
    time = 0
    return
  }
  getWalletTxData()
  _bot_getAddressAllBalances()
  time++
  setTimeout(getWalletTxDataPoll, 5000)
}

const isShowB = ref(false)

useEventBus('klineDataReady').on(() => {
  if (avgPrice.value > 0) {
    useEventBus('updateAvgPrice').emit(avgPrice.value)
  }
})

</script>

<style>

</style>
