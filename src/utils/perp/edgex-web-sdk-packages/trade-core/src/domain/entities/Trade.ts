import { formatDateTime, toPrecisionString, toThousandString } from "@edgex/utils";
import type { TradeEntry } from "@edgex/types";
import { DEFAULT_TXT } from "../constants";

export class Trade {
  constructor(private readonly raw: TradeEntry) {}

  static fromRaw(raw: TradeEntry): Trade {
    return new Trade(raw);
  }

  static fromEmpty(): Trade {
    return new Trade({} as TradeEntry);
  }

  get id(): string {
    return this.raw.ticketId;
  }

  get contractId(): string {
    return this.raw.contractId;
  }

  get contractName(): string {
    return this.raw.contractName;
  }

  get price(): number {
    return Number(this.raw.price);
  }

  get size(): number {
    return Number(this.raw.size);
  }

  get value(): number {
    return Number(this.raw.value);
  }

  get timestamp(): number {
    return Number(this.raw.time);
  }

  get timeFormatted() {
    if (!this.raw?.time) return DEFAULT_TXT;
    return formatDateTime(this.timestamp, "HH:MM:SS");
  }

  get isBuyerMaker(): boolean {
    return this.raw.isBuyerMaker;
  }

  get isBestMatch(): boolean {
    return this.raw.isBestMatch;
  }

  getFormattedPrice = (precision: number) => {
    if (!this?.price) return DEFAULT_TXT;
    return toThousandString(this.price, precision);
  };

  getFormattedSize = (sizePrecision: number) => {
    if (!this?.size) return DEFAULT_TXT;
    return toPrecisionString(this.size, sizePrecision);
  };
}
