import type { DepthEntry, IDepthOrder } from "@edgex/types";

export class DepthLevel {
  constructor(private readonly order: IDepthOrder) {}

  get price(): number {
    return Number(this.order.price);
  }

  get size(): number {
    return Number(this.order.size);
  }

  toJSON(): IDepthOrder {
    return { ...this.order };
  }
}

export class Depth {
  constructor(private readonly payload: DepthEntry) {}

  static fromEntry(entry: DepthEntry): Depth {
    return new Depth(entry);
  }

  get contractId(): string {
    return this.payload.contractId;
  }

  get contractName(): string {
    return this.payload.contractName;
  }

  get level(): number {
    return this.payload.level;
  }

  get startVersion(): string {
    return this.payload.startVersion;
  }

  get endVersion(): string {
    return this.payload.endVersion;
  }

  get depthType(): string {
    return this.payload.depthType;
  }

  get bids(): DepthLevel[] {
    return (this.payload.bids || []).map((item) => new DepthLevel(item));
  }

  get asks(): DepthLevel[] {
    return (this.payload.asks || []).map((item) => new DepthLevel(item));
  }

  toJSON(): DepthEntry {
    return { ...this.payload };
  }
}
