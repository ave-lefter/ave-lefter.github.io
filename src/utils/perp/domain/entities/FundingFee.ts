import BigNumber from "bignumber.js";
import type { IContract as ISymbol, PositionTransactionEntry } from "../../types";
import { toPercentString, toPrecisionString, toThousandString } from "../../utils";

/**
 * 资金费用领域实体
 */
export class FundingFee {
  symbol: ISymbol;

  constructor(
    public symbols: ISymbol[],
    public raw: PositionTransactionEntry,
  ) {
    // 从 symbols 数组中查找对应的交易对信息
    const symbolMap = new Map<string, ISymbol>();
    symbols.forEach((item) => {
      symbolMap.set(item.contractId, item);
    });

    this.symbol = symbolMap.get(this.raw.contractId)!;
  }

  // ============================================================================
  // 基础属性（来自 raw）
  // ============================================================================

  get id() {
    return this.raw.id;
  }

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

  get type() {
    return this.raw.type;
  }

  get createdTime() {
    return this.raw.createdTime;
  }

  get updatedTime() {
    return this.raw.updatedTime;
  }

  // ============================================================================
  // 资金费用相关属性（来自 raw）
  // ============================================================================

  get deltaFundingFee() {
    return this.raw.deltaFundingFee;
  }

  get fundingTime() {
    return this.raw.fundingTime;
  }

  get fundingRate() {
    return this.raw.fundingRate;
  }

  get fundingIndexPrice() {
    return this.raw.fundingIndexPrice;
  }

  get fundingOraclePrice() {
    return this.raw.fundingOraclePrice;
  }

  get fundingPositionSize() {
    return this.raw.fundingPositionSize;
  }

  // ============================================================================
  // 从 symbol 获取的显示属性
  // ============================================================================

  get contractName() {
    return this.symbol?.contractName || this.raw.contractId || "";
  }

  get baseCoin() {
    return this.symbol?.baseCoin || "";
  }

  get quoteCoin() {
    return this.symbol?.quoteCoin || "";
  }

  get sizePrecision() {
    return this.symbol?.sizePrecision || 0;
  }

  get pricePrecision() {
    return this.symbol?.pricePrecision || 0;
  }

  get pnlPrecision() {
    return this.symbol?.pnlPrecision || 2;
  }

  // ============================================================================
  // 业务逻辑属性
  // ============================================================================

  /**
   * 持仓方向
   * fundingPositionSize > 0 为多头，< 0 为空头
   */
  get side() {
    return Number(this.fundingPositionSize) > 0 ? "BUY" : "SELL";
  }

  /**
   * 是否为多头持仓
   */
  get isLong() {
    return Number(this.fundingPositionSize) > 0;
  }

  /**
   * 持仓数量（绝对值）
   */
  get positionSize() {
    return Math.abs(Number(this.fundingPositionSize || 0));
  }

  /**
   * 格式化后的资金费用（带单位）
   */
  get formattedFundingFeeWithUnit() {
    return `${toThousandString(this.deltaFundingFee, 6)} ${this.quoteCoin}`;
  }

  /**
   * 格式化后的资金费率（可指定精度）
   */
  formattedFundingRate(precision: number = 6): string {
    return toPercentString(this.fundingRate, precision);
  }
}
