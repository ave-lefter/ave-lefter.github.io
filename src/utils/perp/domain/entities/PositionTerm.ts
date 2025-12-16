import BigNumber from "bignumber.js";
import type { IContract as ISymbol, PositionTermListEntry } from "../../types";
import {
  bigNumberMultiply,
  toPrecisionString,
  toPrecisionStringWithType,
  toThousandString,
} from "../../utils";
import { Position } from "./Position";
import { SymbolEntity } from "./Symbol";

export class PositionTerm {
  public symbol: SymbolEntity;

  constructor(
    symbol: ISymbol | SymbolEntity,
    public position: Position | undefined,
    public raw: PositionTermListEntry,
  ) {
    if (symbol instanceof SymbolEntity) {
      this.symbol = symbol;
    } else {
      this.symbol = SymbolEntity.fromRaw(symbol);
    }
  }

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

  get termCount() {
    return this.raw.termCount;
  }

  get cumOpenSize() {
    return Number(this.raw.cumOpenSize);
  }

  get cumOpenValue() {
    return this.raw.cumOpenValue;
  }

  get cumOpenFee() {
    return this.raw.cumOpenFee;
  }

  get cumCloseSize() {
    return Number(this.raw.cumCloseSize);
  }

  get cumCloseValue() {
    return this.raw.cumCloseValue;
  }

  get cumCloseFee() {
    return this.raw.cumCloseFee;
  }

  get cumFundingFee() {
    return this.raw.cumFundingFee;
  }

  get cumLiquidateFee() {
    return this.raw.cumLiquidateFee;
  }

  get createdTime() {
    return this.raw.createdTime;
  }

  get updatedTime() {
    return this.raw.updatedTime;
  }

  get currentLeverage() {
    return this.raw.currentLeverage;
  }

  get side() {
    return Number(this.cumOpenSize) > 0 ? "BUY" : "SELL";
  }

  // 入场价格：beforeOpenValue / cumOpenSize , 按照 contract.tickSize 取整。注意取整规则，卖出平多：向上取整；买入平空：向下取整
  get entryPrice() {
    if (!this.symbol) return "0";
    return toPrecisionStringWithType(
      BigNumber(this.cumOpenValue).dividedBy(this.cumOpenSize).abs(),
      this.symbol.pricePrecision,
      "floor",
    );
  }

  // 出场价格：(PositionTerm.cumCloseValue + PositionTerm.cumLiquidateFee) / PositionTerm.cumCloseSize, 按照 contract.tickSize 取整。注意取整规则，卖出平多：向下取整；买入平空：向下取整
  get exitPrice() {
    if (!this.symbol) return "0";
    return toPrecisionStringWithType(
      BigNumber(this.cumCloseValue).plus(this.cumLiquidateFee).dividedBy(this.cumCloseSize).abs(),
      this.symbol.pricePrecision,
      "floor",
    );
  }

  // 平仓价值：abs(fillCloseValue)
  get orderCloseValue() {
    return BigNumber(Math.abs(Number(this.cumCloseValue)) || 0);
  }

  // 开仓价值：beforeOpenValue x abs(cumCloseSize) / cumOpenSize
  get orderOpenValue() {
    return BigNumber(this.cumOpenValue)
      .multipliedBy(this.cumCloseSize)
      .abs()
      .dividedBy(this.cumOpenSize)
      .abs();
  }

  // 手续费：cumOpenFee x abs(cumCloseSize) / abs(cumOpenSize) + cumCloseFee
  get orderTradingFee() {
    return BigNumber(this.cumOpenFee)
      .multipliedBy(this.cumCloseSize)
      .abs()
      .dividedBy(this.cumOpenSize)
      .plus(this.cumCloseFee);
  }

  // 资金费：cumFundingFee
  get orderFundingFee() {
    return BigNumber(this.cumFundingFee);
  }

  /*
        Long Position
        Realized P&L = Close Value - Open Value - Trading Fees + Funding Fees

        Short Position
        Realized P&L = Open Value - Close Value - Trading Fees + Funding Fees
         */
  get totalPnl() {
    return Number(this.cumCloseSize) <= 0
      ? this.orderCloseValue
          .minus(this.orderOpenValue)
          .minus(this.orderTradingFee)
          .plus(this.orderFundingFee)
      : this.orderOpenValue
          .minus(this.orderCloseValue)
          .minus(this.orderTradingFee)
          .plus(this.orderFundingFee);
  }

  get fillOpenFee() {
    return this.cumOpenFee;
  }

  get fillCloseFee() {
    return this.cumCloseFee;
  }

  get openSize() {
    return this.position?.openSize || 0;
  }

  get openValue() {
    return this.position?.openValue || 0;
  }

  // 从 symbol 获取的显示属性
  get contractName() {
    return this.symbol?.contractName || this.raw.contractId || "";
  }

  get baseCoin() {
    return this.symbol?.baseCoin || "";
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

  get leverage() {
    return this.raw.currentLeverage || this.symbol?.defaultLeverage || "1";
  }

  // === Business Logic for PnL ===

  get isFullClosed(): boolean {
    return new BigNumber(this.cumCloseSize).plus(this.cumOpenSize).eq(0);
  }

  /**
   * PnL without fees (Order PnL)
   * Formula: -cumOpenValue - cumCloseValue (if full closed)
   */
  get termPnLWithoutFees(): BigNumber {
    const base = new BigNumber(0).minus(this.cumOpenValue).minus(this.cumCloseValue);
    if (this.isFullClosed) {
      return base;
    } else {
      return base.plus(this.openValue);
    }
  }

  /**
   * Actual PnL (including fees)
   * termPnLWithoutFees + cumOpenFee + cumCloseFee + cumFundingFee
   */
  get termPnLWithFees(): BigNumber {
    return this.termPnLWithoutFees
      .plus(this.cumOpenFee)
      .plus(this.cumCloseFee)
      .plus(this.cumFundingFee);
  }

  /**
   * Calculate PnL Rate based on a specific PnL value
   * (PnL / Initial Margin of the closed portion) * 100 * Leverage
   */
  calculatePnLRate(pnl: BigNumber): BigNumber {
    if (!this.currentLeverage) return new BigNumber(0);

    const closedOpenValue = this.isFullClosed
      ? new BigNumber(this.cumOpenValue).abs()
      : new BigNumber(this.cumOpenValue).abs().minus(new BigNumber(this.openValue).abs());

    if (closedOpenValue.isZero()) return new BigNumber(0);

    return pnl
      .dividedBy(closedOpenValue)
      .multipliedBy(100)
      .multipliedBy(this.currentLeverage);
  }
}
