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
      const avgNetPurchasePrice = Number(walletTokenInfo.value.average_net_purchase_price || walletTokenInfo.value.average_purchase_price_usd || 0)
      const netPurchaseAmount = Number(walletTokenInfo.value.net_purchase_amount || walletTokenInfo.value.balance_amount || 0)
      const balance_amount = Number((walletTokenInfo.value.balance_amount || 0))
      if (!balance_amount && !netPurchaseAmount) return
      const actualAmount = Math.max(netPurchaseAmount, balance_amount)
      const newBalance = el.uprice * balance_amount
      const _unrealizedProfit = (el.uprice - avgNetPurchasePrice) * actualAmount
      const _totalProfit = _unrealizedProfit + Number((walletTokenInfo.value.realized_profit || 0))
      const unrealized_ratio = avgNetPurchasePrice === 0 ? 0 : el.uprice / avgNetPurchasePrice - 1

      walletTokenInfo.value.balance_usd = String(newBalance)
      walletTokenInfo.value.unrealized_profit = String(_unrealizedProfit)
      walletTokenInfo.value.unrealized_ratio = String(unrealized_ratio)
      walletTokenInfo.value.total_profit = String(_totalProfit)
      walletTokenInfo.value._price = String(el.uprice || 0)
      walletTokenInfo.value.average_net_purchase_price = String(avgNetPurchasePrice)
      walletTokenInfo.value.net_purchase_amount = String(netPurchaseAmount)
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
  // watch(() => tokenStore.price, (_price) => {
  //   const tokenId = tokenStore.token?.token + '-' + tokenStore.token?.chain
  //   const price = _price || 0
  //   if (tokenId === route.params.id && walletTokenInfo.value) {
  //     const avgNetPurchasePrice = Number(walletTokenInfo.value.average_net_purchase_price || walletTokenInfo.value.average_purchase_price_usd || 0)
  //     const netPurchaseAmount = Number(walletTokenInfo.value.net_purchase_amount || walletTokenInfo.value.balance_amount || 0)
  //     const balance_amount = Number((walletTokenInfo.value.balance_amount || 0))
  //     if (!balance_amount && !netPurchaseAmount) return
  //     const actualAmount = Math.max(netPurchaseAmount, balance_amount)
  //     const newBalance = price * balance_amount
  //     const _unrealizedProfit = (price - avgNetPurchasePrice) * actualAmount
  //     const _totalProfit = _unrealizedProfit + Number((walletTokenInfo.value.realized_profit || 0))
  //     const unrealized_ratio = avgNetPurchasePrice === 0 ? 0 : price / avgNetPurchasePrice - 1

  //     walletTokenInfo.value.balance_usd = String(newBalance)
  //     walletTokenInfo.value.unrealized_profit = String(_unrealizedProfit)
  //     walletTokenInfo.value.unrealized_ratio = String(unrealized_ratio)
  //     walletTokenInfo.value.total_profit = String(_totalProfit)
  //     walletTokenInfo.value._price = String(price || 0)
  //     walletTokenInfo.value.average_net_purchase_price = String(avgNetPurchasePrice)
  //     walletTokenInfo.value.net_purchase_amount = String(netPurchaseAmount)
  //     const buyVol = globalStore.mySwapList
  //       .filter(el => [SwapType.BUY, SwapType.LIMIT_BUY].includes(el.swapType))
  //       .reduce((acc, el) => {
  //         return acc + (Number(el.inValue) || Number(el.outValue))
  //       }, 0)
  //     if (buyVol) {
  //       walletTokenInfo.value.total_profit_ratio = String(_totalProfit / buyVol)
  //     }
  //   }
  // })
}
