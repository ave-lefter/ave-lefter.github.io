import type { ITradeHistoryRaw, L2Signature, OpenTpSl, RiskTier } from "@edgex/types";
import {
  isConditionalOrder,
  isLimitOrder,
  isMarketOrder,
  OrderType,
  TimeInForce,
} from "../value-objects/OrderEnums";

/**
 * TradeHistory 实体类
 *
 * 封装交易历史的所有业务逻辑和状态
 */
export class TradeHistory {
  raw: ITradeHistoryRaw;

  constructor() {}
  /**
   * 工具函数：判断是否为市价单
   */
  isMarketOrder(): boolean {
    return isMarketOrder(this.raw.type);
  }

  isLimitOrder(): boolean {
    return isLimitOrder(this.raw.type);
  }

  /**
   * 判断是否为条件单类型
   */
  isConditionalOrder(): boolean {
    return isConditionalOrder(this.raw.type as OrderType);
  }

  /**
   * 判断是否为止损单
   */
  isStopOrder(): boolean {
    return this.type === OrderType.STOP_MARKET || this.type === OrderType.STOP_LIMIT;
  }

  /**
   * 判断是否为止盈单
   */
  isTakeProfitOrder(): boolean {
    return this.type === OrderType.TAKE_PROFIT_MARKET || this.type === OrderType.TAKE_PROFIT_LIMIT;
  }

  /**
   * 判断是否为止盈止损单
   */
  isTpslOrder(): boolean {
    return this.raw.isPositionTpsl ?? false;
  }

  /**
   * 从原始数据创建 TradeHistory 实体
   *
   * @param raw - 原始数据
   */
  static fromRaw(raw: ITradeHistoryRaw): TradeHistory {
    const instance = new TradeHistory();
    instance.raw = raw;
    return instance;
  }

  // Contract Information getters
  get contractId(): string {
    return this.raw.contractId;
  }

  get contractName(): string {
    return this.raw.contractName;
  }

  get symbol(): string {
    return this.raw.symbol;
  }

  // Price Information getters
  get lastPrice(): number {
    return this.raw.lastPrice;
  }

  get lastPriceChange(): number {
    return this.raw.lastPriceChange;
  }

  get price24hPcnt(): number {
    return this.raw.price24hPcnt;
  }

  get highPrice24h(): number {
    return this.raw.highPrice24h;
  }

  get lowPrice24h(): number {
    return this.raw.lowPrice24h;
  }

  get indexPrice(): number {
    return this.raw.indexPrice;
  }

  get oraclePrice(): number {
    return this.raw.oraclePrice;
  }

  get priceChange(): string {
    return this.raw.priceChange;
  }

  get open(): string {
    return this.raw.open;
  }

  get close(): string {
    return this.raw.close;
  }

  get bestAskPrice(): string {
    return this.raw.bestAskPrice;
  }

  get bestBidPrice(): string {
    return this.raw.bestBidPrice;
  }

  // Trading Volume & Value getters
  get turnover24h(): number {
    return this.raw.turnover24h;
  }

  get volume24h(): number {
    return this.raw.volume24h;
  }

  get trades(): number {
    return this.raw.trades;
  }

  get openInterest(): number {
    return this.raw.openInterest;
  }

  get value(): number {
    return this.raw.value;
  }

  // Time Information getters
  get highTime(): string {
    return this.raw.highTime;
  }

  get lowTime(): string {
    return this.raw.lowTime;
  }

  get startTime(): string {
    return this.raw.startTime;
  }

  get endTime(): string {
    return this.raw.endTime;
  }

  // Funding Information getters
  get funding1h(): number {
    return this.raw.funding1h;
  }

  get fundingRate(): string {
    return this.raw.fundingRate;
  }

  get fundingTime(): string {
    return this.raw.fundingTime;
  }

  get nextFundingTime(): string {
    return this.raw.nextFundingTime;
  }

  get fundingInterestRate(): string {
    return this.raw.fundingInterestRate;
  }

  get fundingImpactMarginNotional(): string {
    return this.raw.fundingImpactMarginNotional;
  }

  get fundingMaxRate(): string {
    return this.raw.fundingMaxRate;
  }

  get fundingMinRate(): string {
    return this.raw.fundingMinRate;
  }

  get fundingRateIntervalMin(): string {
    return this.raw.fundingRateIntervalMin;
  }

  // Coin Information getters
  get baseCoinId(): string {
    return this.raw.baseCoinId;
  }

  get quoteCoinId(): string {
    return this.raw.quoteCoinId;
  }

  get baseCoin(): string {
    return this.raw.baseCoin;
  }

  get baseCoinPrecision(): number {
    return this.raw.baseCoinPrecision;
  }

  get baseCoinRealPrecision(): number {
    return this.raw.baseCoinRealPrecision;
  }

  get baseCoinIcon(): string {
    return this.raw.baseCoinIcon;
  }

  get quoteCoin(): string {
    return this.raw.quoteCoin;
  }

  get quoteCoinPrecision(): number {
    return this.raw.quoteCoinPrecision;
  }

  get quoteCoinRealPrecision(): number {
    return this.raw.quoteCoinRealPrecision;
  }

  get quoteCoinIcon(): string {
    return this.raw.quoteCoinIcon;
  }

  get pnlPrecision(): number {
    return this.raw.pnlPrecision;
  }

  // Order Size & Price Configuration getters
  get tickSize(): string {
    return this.raw.tickSize;
  }

  get stepSize(): string {
    return this.raw.stepSize;
  }

  get minOrderSize(): string {
    return this.raw.minOrderSize;
  }

  get maxOrderSize(): string {
    return this.raw.maxOrderSize;
  }

  get maxOrderBuyPriceRatio(): string {
    return this.raw.maxOrderBuyPriceRatio;
  }

  get minOrderSellPriceRatio(): string {
    return this.raw.minOrderSellPriceRatio;
  }

  get maxPositionSize(): string {
    return this.raw.maxPositionSize;
  }

  get maxMarketPositionSize(): string {
    return this.raw.maxMarketPositionSize;
  }

  // Price & Size Precision getters
  get pricePrecision(): number {
    return this.raw.pricePrecision;
  }

  get priceStep(): string {
    return this.raw.priceStep;
  }

  get sizePrecision(): number {
    return this.raw.sizePrecision;
  }

  get sizeStep(): string {
    return this.raw.sizeStep;
  }

  // Risk Tiers getter
  get riskTierList(): RiskTier[] {
    return this.raw.riskTierList;
  }

  // Fee Rates getters
  get defaultTakerFeeRate(): string {
    return this.raw.defaultTakerFeeRate;
  }

  get defaultMakerFeeRate(): string {
    return this.raw.defaultMakerFeeRate;
  }

  get takerFeeRate(): string {
    return this.raw.takerFeeRate;
  }

  get makerFeeRate(): string {
    return this.raw.makerFeeRate;
  }

  get liquidateFeeRate(): string {
    return this.raw.liquidateFeeRate;
  }

  // Leverage getters
  get defaultLeverage(): string {
    return this.raw.defaultLeverage;
  }

  get maxLeverage(): string {
    return this.raw.maxLeverage;
  }

  get displayMaxLeverage(): string {
    return this.raw.displayMaxLeverage;
  }

  get displayMinLeverage(): string {
    return this.raw.displayMinLeverage;
  }

  // Display Settings getters
  get enableTrade(): boolean {
    return this.raw.enableTrade;
  }

  get enableDisplay(): boolean {
    return this.raw.enableDisplay;
  }

  get enableOpenPosition(): boolean {
    return this.raw.enableOpenPosition;
  }

  get displayDigitMerge(): string {
    return this.raw.displayDigitMerge;
  }

  get displayNewIcon(): boolean {
    return this.raw.displayNewIcon;
  }

  get displayHotIcon(): boolean {
    return this.raw.displayHotIcon;
  }

  // StarkEx Configuration getters
  get matchServerName(): string {
    return this.raw.matchServerName;
  }

  get starkExSyntheticAssetId(): string {
    return this.raw.starkExSyntheticAssetId;
  }

  get starkExResolution(): string {
    return this.raw.starkExResolution;
  }

  get starkExOraclePriceQuorum(): string {
    return this.raw.starkExOraclePriceQuorum;
  }

  get starkExOraclePriceSignedAssetId(): string[] {
    return this.raw.starkExOraclePriceSignedAssetId;
  }

  get starkExOraclePriceSigner(): string[] {
    return this.raw.starkExOraclePriceSigner;
  }

  // Order Information getters
  get id(): string {
    return this.raw.id;
  }

  get userId(): string {
    return this.raw.userId;
  }

  get accountId(): string {
    return this.raw.accountId;
  }

  get coinId(): string {
    return this.raw.coinId;
  }

  get side(): string {
    return this.raw.side;
  }

  get price(): string {
    return this.raw.price;
  }

  get size(): string {
    return this.raw.size;
  }

  get clientOrderId(): string {
    return this.raw.clientOrderId;
  }

  get type(): OrderType {
    return this.raw.type as OrderType;
  }

  get timeInForce(): string {
    return this.raw.timeInForce;
  }

  get reduceOnly(): boolean {
    return this.raw.reduceOnly;
  }

  get triggerPrice(): string {
    return this.raw.triggerPrice;
  }

  get triggerPriceType(): string {
    return this.raw.triggerPriceType;
  }

  get expireTime(): string {
    return this.raw.expireTime;
  }

  get sourceKey(): string {
    return this.raw.sourceKey;
  }

  // Position TP/SL getters
  get isPositionTpsl(): boolean {
    return this.raw.isPositionTpsl;
  }

  get openTpslParentOrderId(): string {
    return this.raw.openTpslParentOrderId;
  }

  get isSetOpenTp(): boolean {
    return this.raw.isSetOpenTp;
  }

  get openTp(): OpenTpSl {
    return this.raw.openTp;
  }

  get isSetOpenSl(): boolean {
    return this.raw.isSetOpenSl;
  }

  get openSl(): OpenTpSl {
    return this.raw.openSl;
  }

  // Liquidation & Deleverage getters
  get isLiquidate(): boolean {
    return this.raw.isLiquidate;
  }

  get isDeleverage(): boolean {
    return this.raw.isDeleverage;
  }

  // Without Match getters
  get isWithoutMatch(): boolean {
    return this.raw.isWithoutMatch;
  }

  get withoutMatchFillSize(): string {
    return this.raw.withoutMatchFillSize;
  }

  get withoutMatchFillValue(): string {
    return this.raw.withoutMatchFillValue;
  }

  get withoutMatchPeerAccountId(): string {
    return this.raw.withoutMatchPeerAccountId;
  }

  get withoutMatchPeerOrderId(): string {
    return this.raw.withoutMatchPeerOrderId;
  }

  // Market Limit getters
  get marketLimitPrice(): string {
    return this.raw.marketLimitPrice;
  }

  get marketLimitValue(): string {
    return this.raw.marketLimitValue;
  }

  // Layer 2 Information getters
  get l2Nonce(): string {
    return this.raw.l2Nonce;
  }

  get l2Value(): string {
    return this.raw.l2Value;
  }

  get l2Size(): string {
    return this.raw.l2Size;
  }

  get l2LimitFee(): string {
    return this.raw.l2LimitFee;
  }

  get l2ExpireTime(): string {
    return this.raw.l2ExpireTime;
  }

  get l2Signature(): L2Signature {
    return this.raw.l2Signature;
  }

  // Extra Data getters
  get extraType(): string {
    return this.raw.extraType;
  }

  get extraDataJson(): string {
    return this.raw.extraDataJson;
  }

  // Order Status getters
  get status(): string {
    return this.raw.status;
  }

  get matchSequenceId(): string {
    return this.raw.matchSequenceId;
  }

  get triggerTime(): string {
    return this.raw.triggerTime;
  }

  get triggerPriceTime(): string {
    return this.raw.triggerPriceTime;
  }

  get triggerPriceValue(): string {
    return this.raw.triggerPriceValue;
  }

  get cancelReason(): string {
    return this.raw.cancelReason;
  }

  // Cumulative Fill Information getters
  get cumFillSize(): string {
    return this.raw.cumFillSize;
  }

  get cumFillValue(): string {
    return this.raw.cumFillValue;
  }

  get cumFillFee(): string {
    return this.raw.cumFillFee;
  }

  get maxFillPrice(): string {
    return this.raw.maxFillPrice;
  }

  get minFillPrice(): string {
    return this.raw.minFillPrice;
  }

  get cumLiquidateFee(): string {
    return this.raw.cumLiquidateFee;
  }

  get cumRealizePnl(): string {
    return this.raw.cumRealizePnl;
  }

  // Cumulative Match Information getters
  get cumMatchSize(): string {
    return this.raw.cumMatchSize;
  }

  get cumMatchValue(): string {
    return this.raw.cumMatchValue;
  }

  get cumMatchFee(): string {
    return this.raw.cumMatchFee;
  }

  // Cumulative Fail Information getters
  get cumFailSize(): string {
    return this.raw.cumFailSize;
  }

  get cumFailValue(): string {
    return this.raw.cumFailValue;
  }

  get cumFailFee(): string {
    return this.raw.cumFailFee;
  }

  // Cumulative Approved Information getters
  get cumApprovedSize(): string {
    return this.raw.cumApprovedSize;
  }

  get cumApprovedValue(): string {
    return this.raw.cumApprovedValue;
  }

  get cumApprovedFee(): string {
    return this.raw.cumApprovedFee;
  }

  // Timestamps getters
  get createdTime() {
    // return new Date(Number(this.raw.createdTime));
    return this.raw.createdTime;
  }

  get updatedTime() {
    // return new Date(Number(this.raw.updatedTime));
    return this.raw.updatedTime;
  }

  // Source getter
  get from(): string {
    return this.raw.from;
  }

  get postOnly() {
    return this.timeInForce === TimeInForce.POST_ONLY;
  }
}
