import type { IContract as ISymbol } from "../../types";
import { toPrecisionString } from "../../utils";
import type {
  PositionTransactionEntry,
} from "../../types"
import BigNumber from "bignumber.js";
import { SymbolEntity } from "./Symbol";

export class PositionTransaction {
  public symbol: SymbolEntity;

  constructor(
    symbol: ISymbol | SymbolEntity,
    public raw: PositionTransactionEntry,
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

  get type() {
    return this.raw.type;
  }

  get deltaOpenSize() {
    return this.raw.deltaOpenSize;
  }

  get deltaOpenValue() {
    return this.raw.deltaOpenValue;
  }

  get deltaOpenFee() {
    return this.raw.deltaOpenFee;
  }

  get deltaFundingFee() {
    return this.raw.deltaFundingFee;
  }

  get beforeOpenSize() {
    return this.raw.beforeOpenSize;
  }

  get beforeOpenValue() {
    return this.raw.beforeOpenValue;
  }

  get beforeOpenFee() {
    return this.raw.beforeOpenFee;
  }

  get beforeFundingFee() {
    return this.raw.beforeFundingFee;
  }

  get fillCloseSize() {
    return Number(this.raw.fillCloseSize);
  }

  get fillCloseValue() {
    return this.raw.fillCloseValue;
  }

  get fillCloseFee() {
    return this.raw.fillCloseFee;
  }

  get fillOpenSize() {
    return this.raw.fillOpenSize;
  }

  get fillOpenValue() {
    return this.raw.fillOpenValue;
  }

  get fillOpenFee() {
    return this.raw.fillOpenFee;
  }

  get fillPrice() {
    return this.raw.fillPrice;
  }

  get liquidateFee() {
    return this.raw.liquidateFee;
  }

  get realizePnl() {
    return this.raw.realizePnl;
  }

  get isLiquidate() {
    return this.raw.isLiquidate;
  }

  get isDeleverage() {
    return this.raw.isDeleverage;
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

  get orderId() {
    return this.raw.orderId;
  }

  get orderFillTransactionId() {
    return this.raw.orderFillTransactionId;
  }

  get collateralTransactionId() {
    return this.raw.collateralTransactionId;
  }

  get forceTradeId() {
    return this.raw.forceTradeId;
  }

  get extraType() {
    return this.raw.extraType;
  }

  get extraDataJson() {
    return this.raw.extraDataJson;
  }

  get censorStatus() {
    return this.raw.censorStatus;
  }

  get censorTxId() {
    return this.raw.censorTxId;
  }

  get censorTime() {
    return this.raw.censorTime;
  }

  get censorFailCode() {
    return this.raw.censorFailCode;
  }

  get censorFailReason() {
    return this.raw.censorFailReason;
  }

  get l2TxId() {
    return this.raw.l2TxId;
  }

  get l2RejectTime() {
    return this.raw.l2RejectTime;
  }

  get l2RejectCode() {
    return this.raw.l2RejectCode;
  }

  get l2RejectReason() {
    return this.raw.l2RejectReason;
  }

  get l2ApprovedTime() {
    return this.raw.l2ApprovedTime;
  }

  get createdTime() {
    return this.raw.createdTime;
  }

  get updatedTime() {
    return this.raw.updatedTime;
  }

  get from() {
    return this.raw.from;
  }

  // 交易类型：fillCloseSize >0 买入/long；fillCloseSize < 0 卖出/short
  get side() {
    return Number(this.fillCloseSize) > 0 ? "BUY" : "SELL";
  }

  // 入场价格：beforeOpenValue / beforeOpenSize , 按照 contract.tickSize 取整。注意取整规则，卖出平多：向上取整；买入平空：向下取整
  get entryPrice() {
    const price = BigNumber(this.deltaOpenValue)
      .minus(this.fillOpenValue)
      .dividedBy(this.fillCloseSize);
    return this.symbol.formatPrice(price);
  }
  // 出场价格：fillCloseValue / fillCloseSize, 按照 contract.tickSize 取整。注意取整规则，卖出平多：向下取整；买入平空：向上取整
  get exitPrice() {
    return this.symbol.formatPrice(this.fillPrice);
  }

  // 平仓价值：abs(fillCloseValue)
  get orderCloseValue() {
    return BigNumber(Math.abs(Number(this.fillCloseValue)) || 0);
  }

  // 开仓价值：beforeOpenValue x abs(fillCloseSize) / beforeOpenSize
  get orderOpenValue() {
    return BigNumber(this.beforeOpenValue)
      .multipliedBy(this.fillCloseSize)
      .abs()
      .dividedBy(this.beforeOpenSize)
      .abs();
  }

  // 手续费：beforeOpenFee x abs(fillCloseSize) / abs(beforeOpenSize) + fillCloseFee
  get orderTradingFee() {
    return BigNumber(this.beforeOpenFee)
      .multipliedBy(this.fillCloseSize)
      .abs()
      .dividedBy(this.beforeOpenSize)
      .plus(this.fillCloseFee);
  }

  // 资金费：beforeFundingFee x abs(fillCloseSize) / abs(beforeOpenSize)
  get orderFundingFee() {
    return BigNumber(this.beforeFundingFee)
      .multipliedBy(this.fillCloseSize)
      .abs()
      .dividedBy(this.beforeOpenSize);
  }

  /*
    Long Position
    Realized P&L = Close Value - Open Value - Trading Fees + Funding Fees

    Short Position
    Realized P&L = Open Value - Close Value - Trading Fees + Funding Fees
  */
  get totalPnl() {
    const orderCloseValue = this.orderCloseValue;
    const orderOpenValue = this.orderOpenValue;
    const orderTradingFee = this.orderTradingFee;
    const orderFundingFee = this.orderFundingFee;

    return Number(this.fillCloseSize) <= 0
      ? orderCloseValue.minus(orderOpenValue).minus(orderTradingFee).plus(orderFundingFee)
      : orderOpenValue.minus(orderCloseValue).minus(orderTradingFee).plus(orderFundingFee);
  }

  // --- PnL Calculation Helpers (Based on delta values, consistent with useClosePNLColumns) ---

  get pnlOpenValue(): BigNumber {
    return BigNumber(this.deltaOpenValue).minus(this.fillOpenValue).abs();
  }

  get pnlCloseValue(): BigNumber {
    return BigNumber(this.fillCloseValue).plus(this.liquidateFee).abs();
  }

  get pnlFee(): BigNumber {
    return BigNumber(this.deltaOpenFee)
      .minus(this.fillOpenFee)
      .minus(this.fillCloseFee)
      .minus(this.liquidateFee);
  }

  get pnlOpenFee(): BigNumber {
    return BigNumber(this.deltaOpenFee).minus(this.fillOpenFee);
  }

  get pnlCloseFee(): BigNumber {
    return BigNumber(0).minus(this.fillCloseFee).minus(this.liquidateFee);
  }

  get pnlFundingFee(): BigNumber {
    return BigNumber(0).minus(this.deltaFundingFee);
  }

  get pnlTotal(): BigNumber {
    const openValue = this.pnlOpenValue;
    const closeValue = this.pnlCloseValue;
    const fee = this.pnlFee;
    const fundingFee = this.pnlFundingFee;

    if (Number(this.fillCloseSize) < 0) {
      // 多仓平仓 (Sell)
      return closeValue.minus(openValue).minus(fee).plus(fundingFee);
    } else {
      // 空仓平仓 (Buy)
      return openValue.minus(closeValue).minus(fee).plus(fundingFee);
    }
  }

  get pnlTotalRate(): BigNumber {
    const totalPnl = this.pnlTotal;
    // PnL Rate = (Total PnL / Close Value) * 100
    if (BigNumber(this.fillCloseValue).isZero()) return BigNumber(0);

    return totalPnl
      .dividedBy(this.fillCloseValue)
      .multipliedBy(100)
      .abs()
      .multipliedBy(totalPnl.gte(0) ? 1 : -1);
  }
}
