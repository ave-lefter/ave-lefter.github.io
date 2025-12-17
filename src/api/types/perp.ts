import type { Metadata } from '@edgex-fe/typescript-sdk'
type ContractInfo = Metadata['contractList'][number]

export type PerpInfo = {
  contractId: string
  contractName: string
  priceChange: string
  priceChangePercent: string
  trades: string
  size: string
  value: string
  high: string
  low: string
  open: string
  close: string
  highTime: string
  lowTime: string
  startTime: string
  endTime: string
  lastPrice: string
  indexPrice: string
  oraclePrice: string
  openInterest: string
  fundingRate: string
  fundingTime: string
  nextFundingTime: string
  bestAskPrice?: string
  bestBidPrice?: string
  // iconUrl: string
  displayMaxLeverage: string
  fundingInterestRate?: string
  baseCoin: string
  quoteCoin: string
  baseCoinId: string
  quoteCoinId: string
  displayDigitMerge: string
  baseCoinIcon: string
  quoteCoinIcon: string
} & ContractInfo
export type CoinInfo = {
  coinId: string
  coinName: string
  stepSize: string
  showStepSize: string
  iconUrl: string
  // starkExAssetId?: string | undefined
  // starkExResolution?: string | undefined
}
export type Trade = {
  time: number
  contractId: string
  isBuyerMaker: true
  size: string
  price: string
}
