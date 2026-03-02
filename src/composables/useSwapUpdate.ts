import type { WalletTokenInfo } from '~/api/types/token'
import type { IPriceV2Response } from '~/api/types/ws'

export const useSwapUpdate = (walletTokenInfo: Ref<WalletTokenInfo | undefined | null>) => {
  const wsStore = useWSStore()
  const route = useRoute()
  const globalStore = useGlobalStore()
  const tokenStore = useTokenStore()
  watch(() => wsStore.wsResult[WSEventType.PRICEV2], (val: IPriceV2Response) => {
    val.prices.find(el => {
      const tokenId = el.token + '-' + el.chain
      if (tokenId === route.params.id && walletTokenInfo.value) {
        const balance_amount = Number((walletTokenInfo.value.balance_amount || 0))
        if (!balance_amount) return
        const newBalance = el.uprice * balance_amount
        const _unrealizedProfit = (el.uprice - Number(walletTokenInfo.value.average_purchase_price_usd || 0)) * balance_amount
        const _totalProfit = _unrealizedProfit + Number((walletTokenInfo.value.realized_profit || 0))
        const unrealized_ratio = el.uprice / Number(walletTokenInfo.value.average_purchase_price_usd || 0) - 1

        walletTokenInfo.value.balance_usd = String(newBalance)
        walletTokenInfo.value.unrealized_profit = String(_unrealizedProfit)
        walletTokenInfo.value.unrealized_ratio = String(unrealized_ratio)
        walletTokenInfo.value.total_profit = String(_totalProfit)
        walletTokenInfo.value._price = String(el.uprice || 0)
        const buyVol = globalStore.mySwapList
          .filter(el => [SwapType.BUY, SwapType.LIMIT_BUY].includes(el.swapType))
          .reduce((acc, el) => {
            return acc + (Number(el.inValue) || Number(el.outValue))
          }, 0)
        if (buyVol) {
          walletTokenInfo.value.total_profit_ratio = String(_totalProfit / buyVol)
        }
      }
    })
  })
  watch(() => tokenStore.price, (_price) => {
    const tokenId = tokenStore.token?.token + '-' + tokenStore.token?.chain
    const price = _price || 0
    if (tokenId === route.params.id && walletTokenInfo.value) {
      const balance_amount = Number((walletTokenInfo.value.balance_amount || 0))
      if (!balance_amount) return
      const newBalance = price * balance_amount
      const _unrealizedProfit = (price - Number(walletTokenInfo.value.average_purchase_price_usd || 0)) * balance_amount
      const _totalProfit = _unrealizedProfit + Number((walletTokenInfo.value.realized_profit || 0))
      const unrealized_ratio = price / Number(walletTokenInfo.value.average_purchase_price_usd || 0) - 1

      walletTokenInfo.value.balance_usd = String(newBalance)
      walletTokenInfo.value.unrealized_profit = String(_unrealizedProfit)
      walletTokenInfo.value.unrealized_ratio = String(unrealized_ratio)
      walletTokenInfo.value.total_profit = String(_totalProfit)
      walletTokenInfo.value._price = String(price)
      const buyVol = globalStore.mySwapList
        .filter(el => [SwapType.BUY, SwapType.LIMIT_BUY].includes(el.swapType))
        .reduce((acc, el) => {
          return acc + (Number(el.inValue) || Number(el.outValue))
        }, 0)
      if (buyVol) {
        walletTokenInfo.value.total_profit_ratio = String(_totalProfit / buyVol)
      }
    }
  })
}
