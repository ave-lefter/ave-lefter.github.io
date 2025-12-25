import type { DepthEntry, IDepthOrder } from "../../types";

export class DepthOrder {
  constructor(private readonly order: IDepthOrder) {}

  get price(): number {
    return Number(this.order.price);
  }

  get size(): number {
    return Number(this.order.size);
  }
}
