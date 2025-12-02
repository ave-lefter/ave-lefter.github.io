import { perpApi as api } from './request'
import type { Metadata } from '@edgex-fe/typescript-sdk'

import localforage from 'localforage'
import { getAddress } from 'ethers'
import { usePerpStore } from '~/stores/perp'
import type { Order } from '~/stores/perp/type'

// 获取metadata
export async function getPerpMetadata(): Promise<Metadata> {
  const cached: { data: any; timestamp: number } = (await localforage.getItem('perpMetadata')) || {
    data: null,
    timestamp: 0,
  }
  if (cached?.data && cached.timestamp > Date.now() - 10 * 60 * 1000) {
    return cached.data
  }
  return api('/api/v1/public/meta/getMetaData').then((res) => {
    localforage.setItem('perpMetadata', {
      data: res,
      timestamp: Date.now(),
    })
    return res as any
  })
}

export async function onboardSite(): Promise<{
  dataList: Array<{
    id: string
    userId: string
    ethAddress: string
    l2Key: string
    l2KeyYCoordinate: string
    clientAccountId: string
    isSystemAccount: boolean
    defaultTradeSetting: {
      isSetFeeRate: boolean
      takerFeeRate: string
      makerFeeRate: string
      isSetFeeDiscount: boolean
      takerFeeDiscount: string
      makerFeeDiscount: string
      isSetMaxLeverage: boolean
      maxLeverage: string
    }
    contractIdToTradeSetting: {
      [key: string]: {
        isSetFeeRate: boolean
        takerFeeRate: string
        makerFeeRate: string
        isSetFeeDiscount: boolean
        takerFeeDiscount: string
        makerFeeDiscount: string
        isSetMaxLeverage: boolean
        maxLeverage: string
      }
    }
    maxLeverageLimit: string
    createOrderPerMinuteLimit: number
    createOrderDelayMillis: number
    extraType: string
    extraDataJson: string
    status: string
    isLiquidating: boolean
    createdTime: string
    updatedTime: string
  }>
  nextPageOffsetData: string
}> {
  const walletStore = useWalletStore()
  const perpStore = usePerpStore()
  const metaConfig = perpStore.metadata?.global
  if (!walletStore.address) {
    return {
      dataList: [],
      nextPageOffsetData: '',
    }
  }
  // api/v1/public/user/onboardSite
  return api('/api/v1/public/user/privy/onboardSite', {
    method: 'post',
    body: {
      ethAddress: getAddress(walletStore.address),
      onlySignOn: metaConfig?.appOnlySignOn,
      signature: perpStore.perpKeys?.apiSignature,
      l2Key: '0x' + perpStore.l2KeyPair?.l2PublicKey,
      l2KeyYCoordinate: '0x' + perpStore.l2KeyPair?.l2PublicKeyY,
      clientAccountId: 'main',
    },
  })
}

export interface PositionTransactionPageResponse {
  id: string
  userId: string
  accountId: string
  coinId: string
  contractId: string
  type: string
  deltaOpenSize: string
  deltaOpenValue: string
  deltaOpenFee: string
  deltaFundingFee: string
  beforeOpenSize: string
  beforeOpenValue: string
  beforeOpenFee: string
  beforeFundingFee: string
  fillCloseSize: string
  fillCloseValue: string
  fillCloseFee: string
  fillOpenSize: string
  fillOpenValue: string
  fillOpenFee: string
  fillPrice: string
  liquidateFee: string
  realizePnl: string
  isLiquidate: boolean
  isDeleverage: boolean
  fundingTime: string
  fundingRate: string
  fundingIndexPrice: string
  fundingOraclePrice: string
  fundingPositionSize: string
  orderId: string
  orderFillTransactionId: string
  collateralTransactionId: string
  forceTradeId: string
  extraType: string
  extraDataJson: string
  censorStatus: string
  censorTxId: string
  censorTime: string
  censorFailCode: string
  censorFailReason: string
  l2TxId: string
  l2RejectTime: string
  l2RejectCode: string
  l2RejectReason: string
  l2ApprovedTime: string
  createdTime: string
  updatedTime: string
}
// 资产-资金费率
export async function getPositionTransactionPage(params: {
  filterTypeList: string
  size: number
  filterStartCreatedTimeInclusive?: string
  filterEndCreatedTimeExclusive?: string
  filterContractIdList?: string
}): Promise<{ dataList: PositionTransactionPageResponse[] }> {
  const perpStore = usePerpStore()
  return api('/api/v1/private/account/getPositionTransactionPage', {
    method: 'get',
    query: {
      ...params,
      accountId: perpStore.userInfo?.id,
      size: 10,
    },
  })
}

// 资产-资金记录
export async function getAllOrdersPage(params: {
  size: number
  typeList?: string
  startTime?: string
  endTime?: string
}) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/assets/getAllOrdersPage', {
    method: 'get',
    query: {
      ...params,
      accountId: perpStore.userInfo?.id,
      size: 10,
    },
  })
}

export interface ProfitResponse {
  userId: string
  totalEquity: string
  profit: string
  profitRate: string
  withdraw: string
  deposit: string
  totalWithdraw: string
  totalDeposit: string
  transaction: string
  totalTransaction: string
  maxDrawdown: string
  totalProfit: string
  accountList: AccountList[]
}

export interface AccountList {
  accountId: string
  totalEquity: string
  profit: string
  deposit: string
  withdraw: string
  collateralAssetModelList: CollateralAssetModelList[]
  positionAssetList: PositionAssetList[]
  assetOrderModelList: any[]
}

export interface CollateralAssetModelList {
  userId: string
  accountId: string
  coinId: string
  totalEquity: string
  totalPositionValueAbs: string
  initialMarginRequirement: string
  starkExRiskValue: string
  pendingWithdrawAmount: string
  pendingTransferOutAmount: string
  orderFrozenAmount: string
  availableAmount: string
}

export interface PositionAssetList {
  userId: string
  accountId: string
  coinId: string
  contractId: string
  positionValue: string
  maxLeverage: string
  initialMarginRequirement: string
  starkExRiskRate: string
  starkExRiskValue: string
  avgEntryPrice: string
  liquidatePrice: string
  bankruptPrice: string
  worstClosePrice: string
  unrealizePnl: string
  termRealizePnl: string
  totalRealizePnl: string
}
// 资产-总资产
export async function profit(): Promise<ProfitResponse> {
  const perpStore = usePerpStore()
  return api('/api/v1/private/user/day/profit', {
    method: 'get',
    query: {
      userId: perpStore.userInfo?.id,
    },
  })
}

// 资产-周积分
export async function ranking() {
  return api('https://award.edgex.exchange/api/points/ranking', {
    method: 'post',
    body: {
      needpage: 0,
      pagecount: 15,
      type: 2,
    },
  })
}
// 资产-总积分
export async function totalPoints() {
  return api('https://award.edgex.exchange/api/points/info', {
    method: 'post',
    body: {},
  })
}

// 资产-账户余额
export async function assetDetail(type: string) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/user/asset/detail', {
    method: 'get',
    query: {
      type,
      userId: perpStore.userInfo?.id,
    },
  })
}

// 领取积分
export async function boxopen() {
  return api('https://award.edgex.exchange/api/points/boxopen', {
    method: 'post',
    body: {},
  })
}

// 当前委托
export async function getActiveOrderPage(params: {
  filterStatusList: string
  filterStartCreatedTimeInclusive: string | number
  filterEndCreatedTimeExclusive: string | number
  filterContractIdList: string
}): Promise<{
  dataList: Array<Order>
  nextPageOffsetData: string
}> {
  const perpStore = usePerpStore()
  return api('/api/v1/private/order/getActiveOrderPage', {
    method: 'get',
    query: {
      accountId: perpStore.userInfo?.id,
      size: 10,
      ...params,
    },
  })
}

export interface PerpKline {
  dataList: KlineInfo[]
}

export interface KlineInfo {
  klineId: string
  contractId: string
  contractName: string
  klineType: string
  klineTime: string
  priceType: string
  trades: string
  size: string
  value: string
  high: string
  low: string
  open: string
  close: string
  makerBuySize: string
  makerBuyValue: string
  time: number
  volume: string
}
// kline
export async function _getPerpKline(params: {
  contractId: string
  klineType: string
  filterBeginKlineTimeInclusive: number
  filterEndKlineTimeExclusive: number
  priceType: string
}): Promise<PerpKline> {
  return api('/api/v1/public/quote/getKline', {
    method: 'get',
    query: params,
  })
}
export interface OrderBook {
  price: string
  size: string
  sum: string
}

export async function cancelOrderById(orderIds: string[]) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/order/cancelOrderById', {
    method: 'post',
    body: {
      accountId: perpStore.userInfo?.id,
      orderIdList: orderIds,
    },
  })
}

export async function getHistoryOrderFillTransactionPage(params) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/order/getHistoryOrderFillTransactionPage', {
    method: 'get',
    query: {
      size: 10,
      accountId: perpStore.userInfo?.id,
      ...params,
    },
  })
}

export async function getHistoryOrderPage(params) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/order/getHistoryOrderPage', {
    method: 'get',
    query: {
      size: 10,
      accountId: perpStore.userInfo?.id,
      ...params,
    },
  })
}

export async function getPositionTermPage(params) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/account/getPositionTermPage', {
    method: 'get',
    query: {
      size: 10,
      accountId: perpStore.userInfo?.id,
      ...params,
    },
  })
}

export async function getAccountDeleverageLight(): Promise<{
  positionContractIdToLightNumberMap: {
    [key: string]: number
  }
}> {
  const perpStore = usePerpStore()
  return api('/api/v1/private/account/getAccountDeleverageLight', {
    method: 'get',
    query: {
      accountId: perpStore.userInfo?.id,
    },
  })
}

// export async function createOrder(params) {
//   const perpStore = usePerpStore()
//   return api('/api/v1/private/order/createOrder', {
//     method: 'post',
//     body: {
//       accountId:perpStore.userInfo?.id,
//       ...params
//     },
//   })
// }

// /api/v1/private/account/getAccountById
export async function getAccountById(): Promise<{
  id: string
  userId: string
  ethAddress: string
  l2Key: string
  l2KeyYCoordinate: string
  clientAccountId: string
  isSystemAccount: boolean
  defaultTradeSetting: {
    isSetFeeRate: boolean
    takerFeeRate: string
    makerFeeRate: string
    isSetFeeDiscount: boolean
    takerFeeDiscount: string
    makerFeeDiscount: string
    isSetMaxLeverage: boolean
    maxLeverage: string
  }
  contractIdToTradeSetting: {
    [key: string]: {
      isSetFeeRate: boolean
      takerFeeRate: string
      makerFeeRate: string
      isSetFeeDiscount: boolean
      takerFeeDiscount: string
      makerFeeDiscount: string
      isSetMaxLeverage: boolean
      maxLeverage: string
    }
  }
  maxLeverageLimit: string
  createOrderPerMinuteLimit: number
  createOrderDelayMillis: number
  extraType: string
  extraDataJson: string
  status: string
  isLiquidating: boolean
  createdTime: string
  updatedTime: string
} | null> {
  const perpStore = usePerpStore()
  if (!perpStore.userInfo?.id) {
    return null
  }
  return api('/api/v1/private/order/createOrder', {
    method: 'post',
    body: {
      accountId: perpStore.userInfo?.id,
    },
  })
}
//设置杠杆倍数
export function updateLeverageSetting(params: { contractId : string, leverage: string}) {
  const perpStore = usePerpStore()
  return api('/api/v1/private/account/updateLeverageSetting', {
    method: 'post',
    body: {
      accountId: perpStore.userInfo?.id,
      ...params,
    },
  })
}
