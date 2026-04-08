import type { WalletTokenInfo } from '~/api/types/token'
import type { IPriceV2Response } from '~/api/types/ws'
import BigNumber from 'bignumber.js'

export const useSwapUpdate = (walletTokenInfo: Ref<WalletTokenInfo | undefined | null>) => {
  const wsStore = useWSStore()
  const route = useRoute()
  const globalStore = useGlobalStore()
  const tokenStore = useTokenStore()
  watch(() => wsStore.wsResult[WSEventType.PRICEV2], (val: IPriceV2Response) => {
    val.prices.find(cr => {
      const tokenId = cr.token + '-' + cr.chain
      if (!(cr && cr.uprice > 0)) {
        return
      }
      const el = walletTokenInfo.value
      const noProfit = el?.total_profit === '--' || Number(el?.total_profit) === 0
      const price = new BigNumber(cr.uprice || 0)
      const balance_usd = new BigNumber(el?.balance_amount || 0).times(cr.uprice || 0)
      if (tokenId === route.params.id && el && !noProfit) {
        const avgNetPurchasePrice = BigNumber(el.average_net_purchase_price || el.average_purchase_price_usd || 0)
        const netPurchaseAmount = Number(el.net_purchase_amount || el.balance_amount || 0)
        const balance_amount = Number((el.balance_amount || 0))
        if (!balance_amount && !netPurchaseAmount) return el
        const actualAmount = BigNumber.max(netPurchaseAmount, balance_amount)
        const unrealized_profit = price.minus(avgNetPurchasePrice).times(actualAmount)

        const realized_profit = BigNumber(el.realized_profit || 0)

        const total_profit = unrealized_profit.plus(Number((realized_profit || 0)))

        //         console.log('unrealized_profit', unrealized_profit.toFixed())
        // console.log('realized_profit', realized_profit.toFixed())
        // console.log('total_profit', total_profit.toFixed())
        const buyVol = BigNumber(netPurchaseAmount || 0).times(price).toFixed()
        let unrealized_profit_ratio = BigNumber(unrealized_profit).div(buyVol)

        let total_profit_ratio = BigNumber(Number(el.total_profit_ratio) || 0)
        if (buyVol) {
          total_profit_ratio = BigNumber(total_profit).div(buyVol)
        }
        if (!walletTokenInfo.value){
          walletTokenInfo.value = {} as WalletTokenInfo
        }

        walletTokenInfo.value.balance_usd = balance_usd.toFixed()
        walletTokenInfo.value.unrealized_profit = unrealized_profit.toFixed()
        walletTokenInfo.value.unrealized_ratio = unrealized_profit_ratio.toFixed()
        walletTokenInfo.value.total_profit = total_profit.toFixed()
        walletTokenInfo.value._price = price.toFixed()
        walletTokenInfo.value.average_net_purchase_price = avgNetPurchasePrice.toFixed()
        // walletTokenInfo.value.net_purchase_amount = String(netPurchaseAmount)

        if (buyVol) {
          walletTokenInfo.value.total_profit_ratio = total_profit.div(buyVol).toFixed()
        }
        // const buyVol = globalStore.mySwapList
        //   .filter(el => [SwapType.BUY, SwapType.LIMIT_BUY].includes(el.swapType))
        //   .reduce((acc, el) => {
        //     return acc + (Number(el.inValue) || Number(el.outValue))
        //   }, 0)
        // if (buyVol) {
        //   walletTokenInfo.value.total_profit_ratio = String(_totalProfit / buyVol)
        // } else {
        //   const total_cost = new BigNumber(Number(netPurchaseAmount) || 0).times(avgNetPurchasePrice)
        //   walletTokenInfo.value.total_profit_ratio = total_cost.gt(0)
        //   ? new BigNumber(_totalProfit || '0').div(total_cost).toFixed()
        //   : '0'
        // }
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
