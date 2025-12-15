import { RiskTier } from "./metadata.type";

enum OrderType {
  /** 市价单 */
  MARKET = "MARKET",
  /** 限价单 */
  LIMIT = "LIMIT",
  /** 止损市价单 */
  STOP_MARKET = "STOP_MARKET",
  /** 止损限价单 */
  STOP_LIMIT = "STOP_LIMIT",
  /** 止盈市价单 */
  TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
  /** 止盈限价单 */
  TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
}

export interface L2Signature {
  r: string;
  s: string;
  v: string;
}

export interface OpenTpSl {
  side: string;
  price: string;
  size: string;
  clientOrderId: string;
  triggerPrice: string;
  triggerPriceType: string;
  expireTime: string;
  l2Nonce: string;
  l2Value: string;
  l2Size: string;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: L2Signature;
}

export interface ITradeHistoryRaw {
  // Contract Information
  contractId: string;
  contractName: string;
  symbol: string;

  // Price Information
  lastPrice: number;
  lastPriceChange: number;
  price24hPcnt: number;
  highPrice24h: number;
  lowPrice24h: number;
  indexPrice: number;
  oraclePrice: number;
  priceChange: string;
  open: string;
  close: string;
  bestAskPrice: string;
  bestBidPrice: string;

  // Trading Volume & Value
  turnover24h: number;
  volume24h: number;
  trades: number;
  openInterest: number;
  value: number;

  // Time Information
  highTime: string;
  lowTime: string;
  startTime: string;
  endTime: string;

  // Funding Information
  funding1h: number;
  fundingRate: string;
  fundingTime: string;
  nextFundingTime: string;
  fundingInterestRate: string;
  fundingImpactMarginNotional: string;
  fundingMaxRate: string;
  fundingMinRate: string;
  fundingRateIntervalMin: string;

  // Coin Information
  baseCoinId: string;
  quoteCoinId: string;
  baseCoin: string;
  baseCoinPrecision: number;
  baseCoinRealPrecision: number;
  baseCoinIcon: string;
  quoteCoin: string;
  quoteCoinPrecision: number;
  quoteCoinRealPrecision: number;
  quoteCoinIcon: string;
  pnlPrecision: number;

  // Order Size & Price Configuration
  tickSize: string;
  stepSize: string;
  minOrderSize: string;
  maxOrderSize: string;
  maxOrderBuyPriceRatio: string;
  minOrderSellPriceRatio: string;
  maxPositionSize: string;
  maxMarketPositionSize: string;

  // Price & Size Precision
  pricePrecision: number;
  priceStep: string;
  sizePrecision: number;
  sizeStep: string;

  // Risk Tiers
  riskTierList: RiskTier[];

  // Fee Rates
  defaultTakerFeeRate: string;
  defaultMakerFeeRate: string;
  takerFeeRate: string;
  makerFeeRate: string;
  liquidateFeeRate: string;

  // Leverage
  defaultLeverage: string;
  maxLeverage: string;
  displayMaxLeverage: string;
  displayMinLeverage: string;

  // Display Settings
  enableTrade: boolean;
  enableDisplay: boolean;
  enableOpenPosition: boolean;
  displayDigitMerge: string;
  displayNewIcon: boolean;
  displayHotIcon: boolean;

  // StarkEx Configuration
  matchServerName: string;
  starkExSyntheticAssetId: string;
  starkExResolution: string;
  starkExOraclePriceQuorum: string;
  starkExOraclePriceSignedAssetId: string[];
  starkExOraclePriceSigner: string[];

  // Order Information
  id: string;
  userId: string;
  accountId: string;
  coinId: string;
  side: string;
  price: string;
  size: string;
  clientOrderId: string;
  type: OrderType;
  timeInForce: string;
  reduceOnly: boolean;
  triggerPrice: string;
  triggerPriceType: string;
  expireTime: string;
  sourceKey: string;

  // Position TP/SL
  isPositionTpsl: boolean;
  openTpslParentOrderId: string;
  isSetOpenTp: boolean;
  openTp: OpenTpSl;
  isSetOpenSl: boolean;
  openSl: OpenTpSl;

  // Liquidation & Deleverage
  isLiquidate: boolean;
  isDeleverage: boolean;

  // Without Match
  isWithoutMatch: boolean;
  withoutMatchFillSize: string;
  withoutMatchFillValue: string;
  withoutMatchPeerAccountId: string;
  withoutMatchPeerOrderId: string;

  // Market Limit
  marketLimitPrice: string;
  marketLimitValue: string;

  // Layer 2 Information
  l2Nonce: string;
  l2Value: string;
  l2Size: string;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: L2Signature;

  // Extra Data
  extraType: string;
  extraDataJson: string;

  // Order Status
  status: string;
  matchSequenceId: string;
  triggerTime: string;
  triggerPriceTime: string;
  triggerPriceValue: string;
  cancelReason: string;

  // Cumulative Fill Information
  cumFillSize: string;
  cumFillValue: string;
  cumFillFee: string;
  maxFillPrice: string;
  minFillPrice: string;
  cumLiquidateFee: string;
  cumRealizePnl: string;

  // Cumulative Match Information
  cumMatchSize: string;
  cumMatchValue: string;
  cumMatchFee: string;

  // Cumulative Fail Information
  cumFailSize: string;
  cumFailValue: string;
  cumFailFee: string;

  // Cumulative Approved Information
  cumApprovedSize: string;
  cumApprovedValue: string;
  cumApprovedFee: string;

  // Timestamps
  createdTime: string;
  updatedTime: string;

  // Source
  from: string;
}
