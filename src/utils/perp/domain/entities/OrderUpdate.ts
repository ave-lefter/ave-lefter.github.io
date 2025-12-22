import type {
  CollateralEntry,
  OrderEntry,
  OrderFillTransactionEntry,
  PositionEntry,
  PositionTermListEntry,
  PositionTransactionEntry,
  OrderUpdateData
} from "../../types";

export class OrderUpdate {
  constructor(private readonly payload: OrderUpdateData) {}

  static fromData(data: OrderUpdateData): OrderUpdate {
    return new OrderUpdate(data);
  }

  get accounts() {
    return this.payload.account || [];
  }

  get collaterals(): CollateralEntry[] {
    return this.payload.collateral || [];
  }

  get positions(): PositionEntry[] {
    return this.payload.position || [];
  }

  get positionTransactions(): PositionTransactionEntry[] {
    return this.payload.positionTransaction || [];
  }

  get orders(): OrderEntry[] {
    return this.payload.order || [];
  }

  get orderFills(): OrderFillTransactionEntry[] {
    return this.payload.orderFillTransaction || [];
  }

  get positionTerms(): PositionTermListEntry[] {
    return this.payload.positionTermList || [];
  }

  toJSON(): OrderUpdateData {
    return { ...this.payload };
  }
}
