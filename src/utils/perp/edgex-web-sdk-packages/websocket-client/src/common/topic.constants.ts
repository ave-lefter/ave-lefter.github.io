// 定义时间间隔映射类型
interface IntervalMappingType {
  1: string
  5: string
  15: string
  30: string
  60: string
  120: string
  240: string
  360: string
  720: string
  D: string
  W: string
  M: string
}

export const intervalMapping: IntervalMappingType = {
  1: 'MINUTE_1',
  5: 'MINUTE_5',
  15: 'MINUTE_15',
  30: 'MINUTE_30',
  60: 'HOUR_1',
  120: 'HOUR_2',
  240: 'HOUR_4',
  360: 'HOUR_6',
  720: 'HOUR_12',
  D: 'DAY_1',
  W: 'WEEK_1',
  M: 'MONTH_1',
}

export const WS_TOPIC_kline = (
  contractId: string | undefined,
  interval: string | number,
  priceType: string = 'LAST_PRICE',
): string => {
  // interval ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"];
  const mappedInterval = intervalMapping[interval as keyof IntervalMappingType]
  // LAST_PRICE ->最新价格 K 线  INDEX_PRICE -> 指数价格 K 线  ORACLE_PRICE -> 预言机价格 K 线
  return contractId ? `kline.${priceType}.${contractId}.${mappedInterval}` : ''
}

export const WS_TOPIC_TICKER_ALL = (): string => {
  return `ticker.all.1s`
}

export const WS_TOPIC_TICKER = (contractId: string | undefined): string => {
  return contractId ? `ticker.${contractId}` : ''
}

export const WS_TOPIC_METADATA = (): string => {
  return 'metadata'
}

export const WS_TOPIC_depth = (contractId: string | undefined): string => {
  return contractId ? `depth.${contractId}.200` : ''
}

export const WS_TOPIC_recentTrades = (
  contractId: string | undefined,
): string => {
  return contractId ? `trades.${contractId}` : ''
}

export const WS_TOPIC_FUNDING_RATE_ALL = (): string => {
  return 'fundingRate.all'
}

export const WS_TOPIC_FUNDING_RATE = (
  contractId: string | undefined,
): string => {
  return contractId ? `fundingRate.${contractId}` : ''
}
