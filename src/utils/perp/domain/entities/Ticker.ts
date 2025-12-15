import type { TickerEntry } from "../../types";

export class Ticker {
  constructor(private readonly raw: TickerEntry) {}

  static fromRaw(raw: TickerEntry): Ticker {
    return new Ticker(raw);
  }

  static fromEmpty(): Ticker {
    return new Ticker({
      contractId: "",
      contractName: "",
      priceChange: "",
      priceChangePercent: "",
      trades: "",
      size: "",
      value: "",
      high: "",
      low: "",
      open: "",
      close: "",
      highTime: "",
      lowTime: "",
      startTime: "",
      endTime: "",
      lastPrice: "",
      indexPrice: "",
      oraclePrice: "",
      openInterest: "",
      fundingRate: "",
      fundingTime: "",
      nextFundingTime: "",
      bestAskPrice: "",
      bestBidPrice: "",
    } as TickerEntry);
  }

  get contractId(): string {
    return this.raw.contractId;
  }

  get contractName(): string {
    return this.raw.contractName;
  }

  get priceChange(): number {
    return Number(this.raw.priceChange);
  }

  get priceChangePercent(): number {
    return Number(this.raw.priceChangePercent);
  }

  get price24hPcnt() {
    return this.priceChangePercent;
  }

  get trades(): number {
    return Number(this.raw.trades);
  }

  get size(): number {
    return Number(this.raw.size);
  }

  get volume24h(): number {
    return this.size;
  }

  get value(): number {
    return Number(this.raw.value);
  }

  get turnover24h() {
    return this.value;
  }

  get high(): number {
    return Number(this.raw.high);
  }

  get low(): number {
    return Number(this.raw.low);
  }

  get open(): number {
    return Number(this.raw.open);
  }

  get close(): number {
    return Number(this.raw.close);
  }

  get highTime(): number {
    return Number(this.raw.highTime);
  }

  get lowTime(): number {
    return Number(this.raw.lowTime);
  }

  get startTime(): number {
    return Number(this.raw.startTime);
  }

  get endTime(): number {
    return Number(this.raw.endTime);
  }

  get lastPrice(): number {
    return Number(this.raw.lastPrice);
  }

  get indexPrice(): number {
    return Number(this.raw.indexPrice);
  }

  get oraclePrice() {
    return Number(this.raw.oraclePrice);
  }

  get fundingRate(): number {
    return Number(this.raw.fundingRate);
  }

  get fundingTime(): number {
    return Number(this.raw.fundingTime);
  }

  get nextFundingTime(): number {
    return Number(this.raw.nextFundingTime);
  }

  get openInterest(): number {
    return Number(this.raw.openInterest);
  }

  get bestAskPrice(): number {
    return Number(this.raw.bestAskPrice || 0);
  }

  get bestBidPrice(): number {
    return Number(this.raw.bestBidPrice || 0);
  }
}
