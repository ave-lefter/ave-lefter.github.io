import type { KlineEntry } from "../../types";

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export class Candle {
  constructor(private readonly raw: KlineEntry) {}

  static fromEntry(entry: KlineEntry): Candle {
    return new Candle(entry);
  }

  get contractId(): string {
    return this.raw.contractId;
  }

  get contractName(): string {
    return this.raw.contractName;
  }

  get open(): number {
    return Number(this.raw.open);
  }

  get close(): number {
    return Number(this.raw.close);
  }

  get high(): number {
    return Number(this.raw.high);
  }

  get low(): number {
    return Number(this.raw.low);
  }

  get size(): number {
    return Number(this.raw.size);
  }

  get value(): number {
    return Number(this.raw.value);
  }

  get timestamp(): number {
    return Number(this.raw.klineTime);
  }

  toBar(): Bar {
    return {
      time: this.timestamp,
      open: this.open,
      high: this.high,
      low: this.low,
      close: this.close,
      volume: this.value,
    };
  }
}
