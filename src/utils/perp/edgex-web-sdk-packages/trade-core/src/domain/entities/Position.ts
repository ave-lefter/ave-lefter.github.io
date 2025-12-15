import BigNumber from "bignumber.js";
import type { IContract as ISymbol, PositionEntry } from "@edgex/types";
import { bigNumberMultiply, toPrecisionString, toThousandString } from "@edgex/utils";
import { findRiskTier } from "../calculator/helper";
import { OrderSide, OrderType } from "../value-objects/OrderEnums";
import { Order } from "./Order";

export class Position {
  constructor(
    public symbol: ISymbol,
    public raw: PositionEntry,
  ) {}

  get userId() {
    return this.raw.userId;
  }

  get accountId() {
    return this.raw.accountId;
  }

  get coinId() {
    return this.raw.coinId;
  }

  get contractId() {
    return this.raw.contractId;
  }

  get openSize() {
    return this.raw.openSize;
  }

  get size() {
    return Math.abs(Number(this.raw.openSize));
  }

  get sizeFormatted() {
    return toPrecisionString(this.size, this.symbol.sizePrecision);
  }

  get openValue() {
    return this.raw.openValue;
  }

  get openFee() {
    return this.raw.openFee;
  }

  get fundingFee() {
    return this.raw.fundingFee;
  }

  get longTermCount() {
    return this.raw.longTermCount;
  }

  get longTermStat() {
    return this.raw.longTermStat;
  }

  get longTermCreatedTime() {
    return this.raw.longTermCreatedTime;
  }

  get longTermUpdatedTime() {
    return this.raw.longTermUpdatedTime;
  }

  get shortTermCount() {
    return this.raw.shortTermCount;
  }

  get shortTermStat() {
    return this.raw.shortTermStat;
  }

  get shortTermCreatedTime() {
    return this.raw.shortTermCreatedTime;
  }

  get shortTermUpdatedTime() {
    return this.raw.shortTermUpdatedTime;
  }

  get longTotalStat() {
    return this.raw.longTotalStat;
  }

  get shortTotalStat() {
    return this.raw.shortTotalStat;
  }

  get createdTime() {
    return this.raw.createdTime;
  }

  get updatedTime() {
    return this.raw.updatedTime;
  }

  get id() {
    return this.raw.id;
  }

  get from() {
    return this.raw.from;
  }

  get isLong() {
    return Number(this.raw.openSize) > 0;
  }

  get side() {
    return this.isLong ? "LONG" : "SHORT";
  }

  get isVisible() {
    return this.symbol.enableDisplay;
  }

  // (仓位平均开仓价格)
  // Position.avgEntryPrice = round( Position.openValue / Position.openSize, Contract.tickSize)
  // 如果是多仓 (Position.openSize > 0)，要向上取整
  // 如果是空仓 (Position.openSize < 0)，要向下取整
  get entryPrice() {
    const avgEntryPrice = BigNumber(this.openValue)
      .div(this.openSize)
      .toFixed(
        this.symbol.pricePrecision,
        this.isLong ? BigNumber.ROUND_CEIL : BigNumber.ROUND_DOWN,
      );
    return avgEntryPrice;
  }

  get entryPriceFormatted() {
    return toThousandString(this.entryPrice, this.symbol.pricePrecision, false);
  }
  // 已平仓部分的盈亏
  get closedPositionTermPnl() {
    const isLong = Number(this.openValue) > 0;
    const positionOpenValue = this.openValue;
    let longPositionTotalStat = 0;
    let shortPositionTotalStat = 0;
    /**
     * @param positionOpenValue 当前仓位开仓价值 (多仓为正，空仓为负)
     * @param cumOpenValue  仓位累计开仓价值 (多仓为正，空仓为负)
     * @param cumCloseValue 仓位累计平仓价值 (多仓为正，空仓为负)
     */
    if (isLong) {
      longPositionTotalStat = BigNumber(0)
        .plus(this.longTotalStat.cumOpenValue)
        .minus(positionOpenValue)
        .plus(this.longTotalStat.cumCloseValue)
        .negated()
        .toNumber();
    } else {
      shortPositionTotalStat = BigNumber(0)
        .plus(this.shortTotalStat.cumOpenValue)
        .minus(positionOpenValue)
        .plus(this.shortTotalStat.cumCloseValue)
        .negated()
        .toNumber();
    }
    return BigNumber(0).plus(longPositionTotalStat).plus(shortPositionTotalStat).toNumber();
  }
  // 已结盈亏 = 资金费fundingFee + 开仓手续费fee + 已平仓部分的盈亏(closedPositionTermPnl)
  get realizedPnl() {
    return BigNumber(this.fundingFee || 0)
      .plus(this.openFee || 0)
      .plus(this.closedPositionTermPnl || 0)
      .toNumber();
  }

  get realizedPnlFormatted() {
    const value = this.realizedPnl;
    const prefix = BigNumber(value).gte(0) ? "+" : "";
    return prefix + toThousandString(value, this.symbol.pnlPrecision, false);
  }

  /**
   * 盈亏平衡价
   * 多仓：盈亏平衡价 = [开仓均价 - (手续费 + 平仓盈亏 + 资金费) / 持仓数量] / (1 + 手续费率)
   * 空仓：盈亏平衡价 = [开仓均价 + (手续费 + 平仓盈亏 + 资金费) / 持仓数量] / (1 - 手续费率)
   * 注意：持仓数量恒为正数，手续费、平仓盈亏、资金费均按实际情况带符号
   * 精度与成交价精度保持一致，向下取整
   */
  get breakEvenPrice() {
    const feeRate = BigNumber(this.symbol.defaultTakerFeeRate);
    const entryPrice = BigNumber(this.entryPrice);
    const size = this.size; // 持仓数量恒为正
    // realizedPnl = 已实现盈亏 + 资金费 + 手续费
    const totalAdjustment = BigNumber(this.closedPositionTermPnl);

    let breakEvenPrice: BigNumber;
    if (this.isLong) {
      // 多仓公式：[开仓均价 - (手续费 + 平仓盈亏 + 资金费) / 持仓数量] / (1 + 手续费率)
      breakEvenPrice = entryPrice.minus(totalAdjustment.div(size)).div(BigNumber(1).plus(feeRate));
    } else {
      // 空仓公式：[开仓均价 + (手续费 + 平仓盈亏 + 资金费) / 持仓数量] / (1 - 手续费率)
      breakEvenPrice = entryPrice.plus(totalAdjustment.div(size)).div(BigNumber(1).minus(feeRate));
    }

    return breakEvenPrice.toFixed(this.symbol.pricePrecision, BigNumber.ROUND_DOWN);
  }

  get breakEvenPriceFormatted() {
    return toThousandString(this.breakEvenPrice, this.symbol.pricePrecision, false);
  }

  /**
   * 计算未实现盈亏
   * 公式：Position.value - Position.openValue
   * Position.value = Position.openSize * oraclePrice
   */
  getUnrealizedPnl(oraclePrice: string | number): BigNumber {
    const price = new BigNumber(oraclePrice).abs();
    return new BigNumber(this.openSize).multipliedBy(price).minus(this.openValue);
  }

  /**
   * 计算未实现盈亏率 (ROE)
   * 公式：(未实现盈亏 / abs(开仓价值)) * 杠杆 * 100
   */
  getUnrealizedPnlRoe(oraclePrice: string | number, leverage: string | number): BigNumber {
    const pnl = this.getUnrealizedPnl(oraclePrice);
    const openValueAbs = new BigNumber(this.openValue).abs();

    if (openValueAbs.isZero()) return new BigNumber(0);

    return pnl.div(openValueAbs).multipliedBy(leverage).multipliedBy(100);
  }

  /**
   * 从给定的订单列表中查找与当前仓位关联的 TPSL 订单，并统计数量
   * @param orders 候选订单列表（通常是所有条件单）
   */
  getTpslInfo(orders: Order[]) {
    const expectedSide = this.isLong ? OrderSide.SELL : OrderSide.BUY;

    // 筛选关联的 TPSL 订单
    const relatedOrders = orders.filter(
      (o) => o.contractId === this.contractId && o.side === expectedSide && o.isTpslOrder(),
    );

    // Volume 统计保持原逻辑：只统计 Market 类型的 TPSL 订单
    const tpVolume = relatedOrders
      .filter((o) => o.type === OrderType.TAKE_PROFIT_MARKET)
      .reduce((acc, o) => acc.plus(o.size), new BigNumber(0));

    const slVolume = relatedOrders
      .filter((o) => o.type === OrderType.STOP_MARKET)
      .reduce((acc, o) => acc.plus(o.size), new BigNumber(0));

    return {
      tpslOrders: relatedOrders,
      tpVolume: tpVolume.toNumber(),
      slVolume: slVolume.toNumber(),
    };
  }

  /**
   * 计算初始保证金要求 (Initial Margin Requirement)
   * 公式: abs(Position Value) / Leverage
   * 精度: 向上取整到 quoteCoinRealPrecision
   */
  getInitialMarginRequirement(oraclePrice: string | number, leverage: string | number): BigNumber {
    const value = new BigNumber(this.size).multipliedBy(oraclePrice).abs();
    const lev = new BigNumber(leverage);
    const safeLeverage = lev.isZero() ? new BigNumber(1) : lev;
    const precision = this.symbol.quoteCoinRealPrecision ?? this.symbol.quoteCoinPrecision ?? 2;

    return value.div(safeLeverage).decimalPlaces(precision, BigNumber.ROUND_CEIL);
  }

  /**
   * 计算仓位实际有效杠杆
   * Position.actualLeverage = min (Account Max Leverage, Risk Tier Max Leverage)
   */
  getActualLeverage(oraclePrice: string | number, accountMaxLeverage: string | number): BigNumber {
    const value = new BigNumber(this.size).multipliedBy(oraclePrice).abs();
    const riskTierList = this.symbol.riskTierList;
    const currentTier = findRiskTier(value.toNumber(), riskTierList);

    // Defensive: if tier not found, fallback to accountMaxLeverage (meaning no tier limit applied, or error)
    // Ideally risk tiers cover all ranges.
    const tierMaxLeverage = currentTier?.maxLeverage || accountMaxLeverage;

    return BigNumber.min(accountMaxLeverage, tierMaxLeverage);
  }

  /**
   * 计算当前仓位价值 (带符号)
   * 多仓为正，空仓为负
   */
  getCurrentValue(oraclePrice: string | number): BigNumber {
    return new BigNumber(this.openSize).multipliedBy(oraclePrice);
  }

  /**
   * 计算 StarkEx 风险价值
   * 公式: abs(Position Value) * StarkEx Risk Rate
   */
  getStarkExRiskValue(oraclePrice: string | number): BigNumber {
    const value = new BigNumber(this.size).multipliedBy(oraclePrice).abs();
    const riskTierList = this.symbol.riskTierList;
    const currentTier = findRiskTier(value.toNumber(), riskTierList);

    const starkExRiskRate = BigNumber(currentTier?.starkExRisk || 0).div(BigNumber(2).pow(32));

    return value.multipliedBy(starkExRiskRate);
  }
}
