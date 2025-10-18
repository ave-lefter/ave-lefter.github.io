<script setup lang="ts">
import {getUserBalances, type IGetTokenTxsResponse} from '~/api/token'

const props = defineProps({
  makerAddress: {
    type: String,
    default: ''
  },
  isLiquidity: Boolean,
  pairLiq: {
    type: Array,
    default: () => []
  },
  tokenTxs: {
    type: Array<IGetTokenTxsResponse>,
    default: () => []
  },
  tagType: {
    type: String,
    default: ''
  },
  chain: {
    type: String,
    default: ''
  },
  isBuy: {
    type: Function,
    default: () => {
    }
  },
  getAmount: {
    type: Function,
    default: () => {
    }
  },
  getPrice: {
    type: Function,
    default: () => {
    }
  }
})
// const emit = defineEmits(['updateTokenTxs'])

const tokenStore = useTokenStore()
// const botStore = useBotStore()
const route = useRoute()
// const tokenTxs = shallowRef<IGetTokenTxsResponse[]>([])
const balanceAmount = shallowRef(0)
const tokenPrice = shallowRef(0)
const totalBuySell = computed(() => {
  let buyUSD = 0
  let sellUSD = 0
  let buyAmount = 0
  let sellAmount = 0
  props.tokenTxs.forEach(tx => {
    if (props.isBuy(tx)) {
      buyUSD += props.getAmount(tx, true, true)
      buyAmount += props.getAmount(tx)
    } else {
      sellUSD += props.getAmount(tx, true, true)
      sellAmount += props.getAmount(tx)
    }
  })
  return {
    buyUSD, sellUSD, buyAmount, sellAmount
  }
})
const tokenValue = computed(() => {
  let sellTax = (tokenStore.tokenInfoExtra?.sell_tax || 0) / 100
  sellTax = sellTax > 1 ? 1 : sellTax
  return (tokenStore.tokenPrice || tokenPrice.value || 0) * (balanceAmount.value || 0) * (1 - sellTax)
})
const profit = computed(() => {
  const {buyUSD, sellUSD} = totalBuySell.value
  return sellUSD + tokenValue.value - buyUSD
})
const profitChange = computed(() => {
  const {buyUSD} = totalBuySell.value
  if (buyUSD > 0) {
    return profit.value / buyUSD
  }
  return 0
})
const avgSellPrice = computed(() => {
  const {sellAmount, sellUSD} = totalBuySell.value
  if (sellAmount > 0) {
    return sellUSD / sellAmount
  }
  return 0
})
const avgBuyPrice = computed(() => {
  const {buyAmount, buyUSD} = totalBuySell.value
  if (buyAmount > 0) {
    return buyUSD / buyAmount
  }
  return 0
})

watch(() => props.makerAddress, () => {
  // _getTokenTxs()
  _getTokenBalance()
}, {
  immediate: true
})

// async function _getTokenTxs() {
//   const id = route.params.id as string
//   if (!id) return
//   try {
//     const {tagType} = props
//     const getTokenTxsParams = {
//       token_id: id,
//       tag_type: tagType,
//       maker: props.makerAddress
//     }
//     const res = await getTokenTxs(getTokenTxsParams)
//     tokenTxs.value = res || []
//   } catch (e) {
//     console.log('=>(userTxsFilterHead.vue:40) e', e)
//   }
// }

async function _getTokenBalance() {
  try {
    const id = route.params.id as string
    if (id) {
      const {chain} = getAddressAndChainFromId(id)
      const res = await getUserBalances(id, [props.makerAddress + '-' + chain])
      if (res && res[0]) {
        const {value, current_price_usd} = res[0]
        balanceAmount.value = value
        tokenPrice.value = current_price_usd
      }
    }

  } finally {
    //
  }
}
</script>

<template>
  <div class="px-12px lh-20px flex justify-between items-center mb-12px text-13px color-[--secondary-text]">
    <div>
      <span >{{ $t('balance1') }}:</span>
      <span class="ml-4px color-[--main-text]">{{ formatNumber(balanceAmount, 3) }}</span>
      <span class="ml-4px color-[--main-text]">${{
          formatNumber((tokenStore.tokenPrice || tokenPrice || 0) * (balanceAmount || 0), 3)
        }}</span>
    </div>
    <div>
      <span >{{ $t('profit') }}:</span>
      <span :class="`ml-4px ${getColorClass(String(profit))}`">{{ addSign(profit) }}${{
          formatNumber(Math.abs(profit), 2)
        }}</span>
      <span :class="`ml-4px ${getColorClass(String(profitChange))}`">{{ formatNumber(profitChange * 100, 1) }}%</span>
    </div>
    <div>
      <span >{{ $t('totalBuy') }}:</span>
      <span class="color-#12B886 ml-4px">${{ formatNumber(totalBuySell.buyUSD || 0, 2) }}</span>
    </div>
    <div>
      <span >{{ $t('totalSell') }}:</span>
      <span class="color-#F6465D ml-4px">${{ formatNumber(totalBuySell.sellUSD || 0, 2) }}</span>
    </div>
    <div>
      <span >{{ $t('avgBuyPrice') }}:</span>
      <span class="color-#12B886 ml-4px">${{ formatNumber(avgBuyPrice || 0, 2) }}</span>
    </div>
    <div>
      <span >{{ $t('avgSellPrice') }}:</span>
      <span class="color-#F6465D ml-4px">${{ formatNumber(avgSellPrice || 0, 2) }}</span>
    </div>
  </div>
</template>

<style scoped>

</style>
