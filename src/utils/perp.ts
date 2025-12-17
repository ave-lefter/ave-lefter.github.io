import BigNumber from 'bignumber.js'
import { usePerpStore } from '~/stores/perp'
import { OrderCalculationService } from './perp/OrderCalculationService'

import { Position } from '@/utils/perp/domain/entities/Position'
import { Order } from '@/utils/perp/domain/entities/Order'
import { Ticker } from '@/utils/perp/domain/entities/Ticker'
import { SymbolEntity } from '@/utils/perp/domain/entities/Symbol'
import { Account } from './perp/domain/entities/Account'
import { Collateral } from './perp/domain/entities/Collateral'
import { PositionFactory } from './perp/domain/services/PositionFactory'
import { AccountRiskService } from './perp/domain/services/AccountRiskService'
import type { IContract } from './perp/types'

export function getPrepData(contractId: string) {
  const perpStore = usePerpStore()
  const positions = perpStore.position || []
  const orders = perpStore.order || []
  const metadata = perpStore.metadata
  let symbol = perpStore.contractList.find(item => item.contractId === contractId) as any
  const tickers = new Map()
  perpStore.tickers.forEach((ticker) => {
    let symbol = perpStore.contractList.find(item => item.contractId === ticker.contractId)
    tickers.set(symbol?.contractName, new Ticker(SymbolEntity.fromRaw(symbol as any), ticker))
  })

  let _orders = orders.map(i => {
    let order = Order.fromRaw(symbol, i) as any
    // let { takerFeeRate, makerFeeRate } = getFeeRate(order.contractId)
    // let maxLeverage = getLeverageFromContractId(order.contractId)
    // order.maxLeverage = maxLeverage
    // order.takerFeeRate = takerFeeRate
    // order.makerFeeRate = makerFeeRate
    return order
  })
  return {
    positions: positions.map(i => (new Position(symbol, i))) || [],
    metadata: metadata,
    orders: _orders || [],
    account: perpStore.userInfo,
    collaterals: perpStore.collateral || [],
    withdraws: perpStore.withdraw || [],
    transfers: perpStore.transferOut || [],
    symbolsList: (metadata?.contractList || [])?.map?.(i => SymbolEntity.fromRaw(i as any)) || [],
    tickers: tickers,
    orderBook: {
      ask1: symbol?.lastPrice || '0',
      bid1: symbol?.lastPrice || '0',
    }
  }
}


export const getFeeRate = (contractId: string) => {
  const perpStore = usePerpStore()
  const account = perpStore.userInfo
  const metadata = perpStore.metadata
  const curContractIdToTradeSetting = account?.contractIdToTradeSetting?.[contractId]
  const curContractIdToMetadata = metadata?.contractList?.find?.((i) => i.contractId === contractId)
  const defaultTradeSetting = account?.defaultTradeSetting
  // Account contract configuration
  // If isSetFeeRate = true, directly return takerFeeRate & makerFeeRate
  if (curContractIdToTradeSetting?.isSetFeeRate) {
    return {
      takerFeeRate: curContractIdToTradeSetting?.takerFeeRate,
      makerFeeRate: curContractIdToTradeSetting?.makerFeeRate,
    }
  }
  // If isSetFeeDiscount = true, return
  // takerFeeRate = Contract.defaultTakerFeeRate x takerFeeDiscount
  // makerFeeRate = Contract.defaultMakerFeeRate x makerFeeDiscount
  if (curContractIdToTradeSetting?.isSetFeeDiscount) {
    return {
      takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate || '0').multipliedBy(curContractIdToTradeSetting?.takerFeeDiscount).toString(),
      makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate || '0').multipliedBy(curContractIdToTradeSetting?.makerFeeDiscount).toString(),
    }
  }

  // Account default configuration
  // If isSetFeeRate = true, directly return takerFeeRate & makerFeeRate
  if (defaultTradeSetting?.isSetFeeRate) {
    return {
      takerFeeRate: defaultTradeSetting?.takerFeeRate,
      makerFeeRate: defaultTradeSetting?.makerFeeRate,
    }
  }
  // If isSetFeeDiscount = true, return takerFeeRate = Contract.defaultTakerFeeRate x takerFeeDiscount, makerFeeRate = Contract.defaultMakerFeeRate x makerFeeDiscount
  if (defaultTradeSetting?.isSetFeeDiscount) {
    return {
      takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate || '0').multipliedBy(defaultTradeSetting?.takerFeeDiscount).toString(),
      makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate || '0').multipliedBy(defaultTradeSetting?.makerFeeDiscount).toString(),
    }
  }

  // Default configuration in contract settings
  return {
    takerFeeRate: curContractIdToMetadata?.defaultTakerFeeRate || '0',
    makerFeeRate: curContractIdToMetadata?.defaultMakerFeeRate || '0',
  }
}

export const getLeverageFromContractId = (contractId: string) => {
  const perpStore = usePerpStore()
  const account = perpStore.userInfo
  const metadata = perpStore.metadata
  const curContractIdToTradeSetting = account?.contractIdToTradeSetting?.[contractId]
  const curContractIdToMetadata = metadata?.contractList?.find((i) => i.contractId === contractId)
  const defaultTradeSetting = account?.defaultTradeSetting

  // Account contract configuration
  // If isSetMaxLeverage = true, directly return maxLeverage
  if (curContractIdToTradeSetting?.isSetMaxLeverage) {
    return curContractIdToTradeSetting?.maxLeverage
  }
  // Account default configuration
  // If isSetMaxLeverage = true, directly return maxLeverage
  if (defaultTradeSetting?.isSetMaxLeverage) {
    return defaultTradeSetting?.maxLeverage
  }
  // Default configuration in contract settings
  // Directly return maxLeverage = Contract.defaultLeverage
  return curContractIdToMetadata?.defaultLeverage
}


export const getMarginFromContractId = (data: {contractId: string; size: string}) => {
  const {contractId, size} = data
  const perpStore = usePerpStore()
  const contractList = perpStore?.contractList || []
  const contract = contractList.find(item => item.contractId === contractId)
  const price = contract?.oraclePrice || 0
  const value = new BigNumber(price || 0).times(new BigNumber(size || 0))
  const riskTierList = contract?.riskTierList || []
  const maintenanceMarginRequirementObj = riskTierList?.find?.(j => new BigNumber(value).lte(j?.positionValueUpperBound || 0))
  const maintenanceMarginRate = maintenanceMarginRequirementObj?.maintenanceMarginRate || 1
  return new BigNumber(maintenanceMarginRate).times(size).times(price).toFixed()
}

export function toTick(value: string | number, tick?: string | number) {
  // tick 不存在 或 tick === 0 → 直接返回原值
  if (tick === undefined || tick === null || new BigNumber(tick).isZero()) {
    return new BigNumber(value).toFixed()
  }

  const v = new BigNumber(value)
  const t = new BigNumber(tick)

  // v / t → floor → * t
  return v
    .div(t)
    .integerValue(BigNumber.ROUND_FLOOR)
    .times(t).toString()
}


export function calculateMargin(params1: {
  contractId: string
  side: string
  oraclePrice?: number
  price: number
  size: number
  isMarketOrder?: boolean
  leverage?: string
  feeRate?: string
}) {
  const symbol = CoreCalculator.getSymbolModel(params1.contractId)
  const _leverage = params1.leverage || getLeverageFromContractId(params1.contractId)
  const feeRate = getFeeRate(params1.contractId)
  const perpStore = usePerpStore()
  const orderBook = perpStore.contractId === params1.contractId ? ( params1.side === 'BUY' ? perpStore.sellList : perpStore.buyList) : undefined
  // 准备参数
  const params = {
    side: params1.side || 'BUY', // 或 "LONG"
    oraclePrice: params1.oraclePrice || symbol?.oraclePrice || '0',
    price: params1.price || undefined,
    size: params1.size || '0',
    leverage: _leverage || 0,
    feeRate: params1.feeRate || (params1.side === 'BUY' ? feeRate.takerFeeRate : feeRate?.makerFeeRate),
    isMarketOrder: params1.isMarketOrder || false,
    orderBook: orderBook
  }
  return OrderCalculationService.calculateMargin(params)
}

export function calculateMaxSize(params: {
  contractId: string
  type: string
  side: string
  price: number
  reduceOnly: boolean
}) {

  const orderCalculationContext = {
    contractId: params.contractId,
    ...getPrepData(params.contractId)
  } as any

  const calculateMaxSizeParams = {
    ...params
  }

  return OrderCalculationService.calculateMaxSize(orderCalculationContext, calculateMaxSizeParams)
}

export function calculateSizeFromRatio(params: {
  maxQty: string | number
  ratio: number
  stepSize: string
}) {
  return OrderCalculationService.calculateSizeFromRatio(params)
}


export function calculateLiqPrice(params: {
  contractId: string
  side: string
  price: number
  size: number
}) {
  const ctx  = {
    contractId: params.contractId,
    ...getPrepData(params.contractId)
  } as any
  return OrderCalculationService.calculateLiqPrice(ctx, {
    side: params.side,
    price: params.price,
    size: params.size
  })
}

// 仓位强平价
export function getPositionLiqPrice(contractId: string) {
  // const ctx  = {
  //   contractId: params.contractId,
  //   ...getPrepData(params.contractId)
  // } as any
  const ctx = getPrepData(contractId)
  const perpStore = usePerpStore()
  const metadata = perpStore.metadata as any
  if (!metadata) return '0'
  const contractList = perpStore.metadata?.contractList || []
  // const { getTicker, tickers } = ctx.tickers
  const tickers = ctx.tickers || []
  const symbol = ctx.symbolsList?.find((s) => s.contractId === contractId) as typeof ctx.symbolsList[0]
  const positionRaw = perpStore.position?.find((p) => p.contractId === contractId) as typeof perpStore.position[0]
  const rawAccount = perpStore.userInfo
  const order = perpStore.order || []
  const collateralRaw = perpStore.collateral || []
  const withdrawRaw = perpStore.withdraw || []
  const transferOutRaw = perpStore.transferOut || []
  /////////////////
  const position = new Position(symbol, positionRaw)
  const symbolsList = contractList?.map((c) => SymbolEntity.fromRaw(c as IContract)) || []
  // const ticker = getTicker(position?.symbol?.contractName || "");
  const ticker = tickers?.get(position?.symbol?.contractName || "")
  // 无持仓时返回默认值
  if (!position) {
    return {
      liqPrice: 0,
      liqPriceFormatted: "-",
    };
  }
  // Convert raw data to Entities
  const account = rawAccount ? Account.fromRaw(rawAccount) : null;
  const collateralList = (collateralRaw || []).map((c) => Collateral.fromRaw(c));
  const positionList = PositionFactory.createPositionsFromRaw(perpStore.position || [], symbolsList);
  if (!account) {
    return {
      liqPrice: 0,
      liqPriceFormatted: "-",
    };
  }
  // ==================== 计算抵押物信息 ====================
  const collateralInfo = AccountRiskService.calculateCollateralStats({
    contractId: position.contractId,
    quoteCoinId: position.symbol.quoteCoinId,
    positionList: positionList,
    account: account,
    metadata,
    symbolsList,
    withdraw: withdrawRaw,
    transferOut: transferOutRaw,
    collateral: collateralList,
    orderList: order,
    tickers,
  })
  // (清算价格)
  let liqPrice = position.getLiquidationPrice(ticker?.oraclePrice, {
    totalEquity: collateralInfo?.totalEquity,
    starkExRiskValue: collateralInfo?.totalStarkExRiskValue,
    pendingWithdrawAmount: collateralInfo?.totalPendingWithdrawAmount,
    pendingTransferOutAmount: collateralInfo?.totalPendingTransferOutAmount,
  })
  return liqPrice;
}
