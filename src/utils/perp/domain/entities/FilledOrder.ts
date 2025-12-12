import type { IContract } from "../../types";
import type { OrderFillTransactionEntry } from "../../types";

export class FilledOrder {
  private constructor(
    public symbol: IContract,
    public raw: OrderFillTransactionEntry,
  ) {}

  static fromRaw(symbol: IContract, raw: OrderFillTransactionEntry) {
    return new FilledOrder(symbol, raw);
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

  get orderId() {
    return this.raw.orderId;
  }

  get orderSide() {
    return this.raw.orderSide;
  }

  get fillSize() {
    return this.raw.fillSize;
  }

  get fillValue() {
    return this.raw.fillValue;
  }

  get fillFee() {
    return this.raw.fillFee;
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

  get direction() {
    return this.raw.direction;
  }

  get isPositionTpsl() {
    return this.raw.isPositionTpsl;
  }

  get isLiquidate() {
    return this.raw.isLiquidate;
  }

  get isDeleverage() {
    return this.raw.isDeleverage;
  }

  get isWithoutMatch() {
    return this.raw.isWithoutMatch;
  }

  get matchSequenceId() {
    return this.raw.matchSequenceId;
  }

  get matchIndex() {
    return this.raw.matchIndex;
  }

  get matchTime() {
    return this.raw.matchTime;
  }

  get matchAccountId() {
    return this.raw.matchAccountId;
  }

  get matchOrderId() {
    return this.raw.matchOrderId;
  }

  get matchFillId() {
    return this.raw.matchFillId;
  }

  get positionTransactionId() {
    return this.raw.positionTransactionId;
  }

  get collateralTransactionId() {
    return this.raw.collateralTransactionId;
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
}
