import type { IContract as ISymbol } from "../../types";
import { toPrecisionString } from "../../utils";
import type {
  PositionTransactionEntry,
} from "../../types";
import BigNumber from "bignumber.js";

export class PositionTransaction {
  constructor(
    public symbol: ISymbol,
    public raw: PositionTransactionEntry,
  ) {}

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
    return toPrecisionString(
      BigNumber(this.deltaOpenValue).minus(this.fillOpenValue).dividedBy(this.fillCloseSize),
      this.symbol.pricePrecision,
    );
  }
  // 出场价格：fillCloseValue / fillCloseSize, 按照 contract.tickSize 取整。注意取整规则，卖出平多：向下取整；买入平空：向上取整
  get exitPrice() {
    return toPrecisionString(BigNumber(this.fillPrice), this.symbol.pricePrecision);
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
}
