import { usePerpStore } from './index'

import { Position } from '@/utils/perp/domain/entities/Position'
import { Order } from '@/utils/perp/domain/entities/Order'
import { Ticker } from '@/utils/perp/domain/entities/Ticker'

function getPrepData(contractId: string) {
  const perpStore = usePerpStore()
  const positions = perpStore.position || []
  const orders = perpStore.order || []
  let symbol = perpStore.contractList.find(item => item.contractId === contractId) as any
  const tickers = new Map()
  perpStore.tickers.forEach((ticker) => {
    let symbol = perpStore.contractList.find(item => item.contractId === ticker.contractId)
    tickers.set(symbol?.contractName, new Ticker(ticker))
  })
  return {
    positions: positions.map(i => (new Position(symbol, i))) || [],
    metadata: perpStore.metadata,
    orders: orders.map(i => (Order.fromRaw(symbol, i))) || [],
    account: perpStore.userInfo,
    collaterals: perpStore.collateral || [],
    withdraws: perpStore.withdraw || [],
    transfers: perpStore.transferOut || [],
    symbolsList: perpStore.metadata?.contractList || [],
    tickers: tickers,
  }
}

