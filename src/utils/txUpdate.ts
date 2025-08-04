import type { SimpleWSTx } from '~/pages/token/components/kLine/types'
import BigNumber from 'bignumber.js'
import type { Profile } from '~/api/token'

export function updatePriceFromTx(tx: SimpleWSTx) {
  const tokenStore = useTokenStore()
  if (tx.target !== tokenStore.token?.token) return
  // const isBuy = tx.direction === 'buy'
  // const price = Number(tx.price_u || 0)
  // if (tx.pair === tokenStore.pairAddress) {
  //   if (price) {
  //     tokenStore.tokenPrice = price
  //   }
  // }

  const token = tokenStore.token?.token
  tokenStore?.pairs?.forEach(pair => {
    if (pair.pair === tx.pair) {
      const isToken0 = tx.target?.toLowerCase?.() === pair.token0_address?.toLowerCase?.()
      const isToken1 = tx.target?.toLowerCase?.() === pair.token1_address?.toLowerCase?.()
      const price = Number(tx.price_u || 0)
      const currentPrice = pair.token0_address?.toLowerCase?.() === token?.toLowerCase?.() ? pair.token0_price_usd : pair.token1_price_usd
      if (isToken0) {
        pair.reserve0 = Number(tx.reserve0)
        pair.token0_price_usd = Number(tx.price_u)
      } else if (isToken1) {
        pair.reserve1 = Number(tx.reserve1)
        pair.token1_price_usd = Number(tx.price_u)
      }
      const volume = new BigNumber(tx.target_amt).times(price) || 0
      pair.volume_u = new BigNumber(pair.volume_u).plus(volume).toNumber()
      pair.volume_u_1h = new BigNumber(pair.volume_u_1h).plus(volume).toNumber()
      pair.volume_u_24h = new BigNumber(pair.volume_u_24h).plus(volume).toNumber()
      pair.volume_u_4h = new BigNumber(pair.volume_u_4h).plus(volume).toNumber()
      pair.volume_u_5m = new BigNumber(pair.volume_u_5m).plus(volume).toNumber()

      pair.buy_volume_u_1h = new BigNumber(pair.buy_volume_u_1h).plus(volume).toNumber()
      pair.buy_volume_u_24h = new BigNumber(pair.buy_volume_u_24h).plus(volume).toNumber()
      pair.buy_volume_u_4h = new BigNumber(pair.buy_volume_u_4h).plus(volume).toNumber()
      pair.buy_volume_u_5m = new BigNumber(pair.buy_volume_u_5m).plus(volume).toNumber()

      pair.buys_tx_1h_count = pair.buys_tx_1h_count + 1
      pair.buys_tx_24h_count = pair.buys_tx_24h_count + 1
      pair.buys_tx_4h_count = pair.buys_tx_4h_count + 1
      pair.buys_tx_5m_count = pair.buys_tx_5m_count + 1
      pair.tx_1h_count = pair.tx_1h_count + 1
      pair.tx_24h_count = pair.tx_24h_count + 1
      pair.tx_4h_count = pair.tx_4h_count + 1
      pair.tx_5m_count = pair.tx_5m_count + 1

      pair.price_change = calcNewChange(pair.price_change, price, currentPrice)
      pair.price_change_1h = calcNewChange(pair.price_change_1h, price, currentPrice)
      pair.price_change_24h = calcNewChange(pair.price_change_24h, price, currentPrice)
      pair.price_change_4h = calcNewChange(pair.price_change_4h, price, currentPrice)
      pair.price_change_5m = calcNewChange(pair.price_change_5m, price, currentPrice)
    }
  })

  // 更新 holders
  if (tx.direction === 'sell' && Number(tx.maker_bal) === 0) {
    // 清仓
    let holders = tokenStore.token.holders - 1
    if (holders < 0) holders = 0
    tokenStore.token.holders = holders
  } else if (tx.direction === 'buy' && new BigNumber(tx.maker_bal).eq(tx.target_amt)) {
    // 新钱包
    tokenStore.token.holders = tokenStore.token.holders + 1
  }

//   if (tx.profile) {
//     const profile: Profile = JSON.parse(tx.profile)
//     const token = tokenStore.token.token.toLowerCase()
//     if (isBuy) {
//       const tokenHold = profile.token0Address.toLowerCase() === token ? profile.token0TotalHolding : profile.token1TotalHolding
//       const buyAmount = tx.to_amount
//       if (new BigNumber(tokenHold).eq(buyAmount)) {
//         tokenStore.token.holders = tokenStore.token.holders + 1
//       }
//     } else {
//       const tokenHold = profile.token0Address.toLowerCase() === token ? profile.token0TotalHolding : profile.token1TotalHolding
//       if (new BigNumber(tokenHold).eq(0)) {
//         let holders = tokenStore.token.holders - 1
//         if (holders < 0) holders = 0
//         tokenStore.token.holders = holders
//       }
//     }
//   }
}

function calcNewChange(
  currentChangeRate: number,
  pushedPrice: number,
  currentPrice?: number
): number {
  const tokenStore = useTokenStore()
  const cp = new BigNumber(currentPrice ?? tokenStore.token?.current_price_usd ?? 0)

  if (!cp.isFinite() || !Number.isFinite(currentChangeRate) || !Number.isFinite(pushedPrice)) {
    return 0
  }
  const originalPrice = cp.div(1 + (currentChangeRate / 100))
  return new BigNumber(pushedPrice)
    .minus(originalPrice)
    .div(originalPrice)
    .times(100)
    .toNumber()
}
