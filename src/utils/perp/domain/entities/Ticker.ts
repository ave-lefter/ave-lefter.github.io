import type { IContract as ISymbol, TickerEntry } from "../../types";
import { toPrecisionString } from "../../utils";
import { SymbolEntity } from "./Symbol";

export class Ticker {
  public symbol: SymbolEntity;

  constructor(
    symbol: ISymbol | SymbolEntity,
    private readonly raw: TickerEntry,
  ) {
    if (symbol instanceof SymbolEntity) {
      this.symbol = symbol;
    } else {
      this.symbol = SymbolEntity.fromRaw(symbol);
    }
  }

  static fromRaw(symbol: ISymbol | SymbolEntity, raw: TickerEntry): Ticker {
    return new Ticker(symbol, raw);
  }

  static fromEmpty(symbol?: ISymbol | SymbolEntity): Ticker {
    const emptyRaw = {
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
    } as TickerEntry;

    // 如果没有提供 symbol，创建一个空的 SymbolEntity 防止崩溃
    // 注意：实际业务中应该尽量提供 symbol
    const safeSymbol = symbol || SymbolEntity.fromRaw({} as any);
    return new Ticker(safeSymbol, emptyRaw);
  }

  // ============================================================================
  // 格式化方法 (Delegated to SymbolEntity)
  // ============================================================================

  get lastPriceFormatted(): string {
    return this.symbol.formatPriceFormatted(this.lastPrice);
  }

  get indexPriceFormatted(): string {
    return this.symbol.formatPriceFormatted(this.indexPrice);
  }

  get oraclePriceFormatted(): string {
    return this.symbol.formatPriceFormatted(this.oraclePrice);
  }

  get highFormatted(): string {
    return this.symbol.formatPriceFormatted(this.high);
  }

  get lowFormatted(): string {
    return this.symbol.formatPriceFormatted(this.low);
  }

  get bestAskFormatted(): string {
    return this.symbol.formatPriceFormatted(this.bestAskPrice);
  }

  get bestBidFormatted(): string {
    return this.symbol.formatPriceFormatted(this.bestBidPrice);
  }

  get volumeFormatted(): string {
    return this.symbol.formatSizeFormatted(this.volume24h);
  }

  get turnoverFormatted(): string {
    return this.symbol.formatQuoteValue(this.turnover24h);
  }

  get priceChangePercentFormatted(): string {
    const val = this.priceChangePercent;
    const sign = val > 0 ? "+" : "";
    return `${sign}${toPrecisionString(val * 100, 2)}%`;
  }

  // ============================================================================
  // Getters
  // ============================================================================

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

  get openInterestUsdt(): number {
    return (this.indexPrice || 0) * (this.openInterest || 0);
  }
}
