import { DepthEntry, KlineEntry, TickerEntry, TradeEntry } from "@edgex/types";
import { BaseWebSocketClient } from "./base-websocket-client";
import {
  WS_TOPIC_depth,
  WS_TOPIC_FUNDING_RATE,
  WS_TOPIC_FUNDING_RATE_ALL,
  WS_TOPIC_kline,
  WS_TOPIC_METADATA,
  WS_TOPIC_recentTrades,
  WS_TOPIC_TICKER,
  WS_TOPIC_TICKER_ALL,
} from "./common/topic.constants";
import { PublicWebSocketClientOptions, WebSocketContent, WebSocketMessage } from "./types";

type ContractTopicType = "ticker" | "depth" | "trade" | "candles" | "fundingRate";

export class PublicWebSocketClient extends BaseWebSocketClient {
  // Track the currently active contract ID
  private activeContractId: string | null = null;

  // Track active topics for the current contract to allow auto-unsubscription
  // Map<TopicType, TopicString>
  private activeContractTopics: Map<ContractTopicType, string> = new Map();

  constructor(options: PublicWebSocketClientOptions) {
    super(options);
  }

  /**
   * Helper to enforce single-contract subscription policy.
   * If the new contract ID differs from the active one,
   * it unsubscribes from ALL topics related to the old contract.
   */
  private switchContract(newContractId: string): void {
    if (this.activeContractId && this.activeContractId !== newContractId) {
      // Unsubscribe from all topics associated with the previous contract
      this.activeContractTopics.forEach((topic) => {
        this.unsubscribe(topic);
      });
      this.activeContractTopics.clear();
    }
    this.activeContractId = newContractId;
  }

  /**
   * Subscribe to 24h ticker updates for a specific contract.
   * Switches active contract context.
   */
  public subscribeTicker(contractId: string): void {
    this.switchContract(contractId);

    const topic = WS_TOPIC_TICKER(contractId);
    if (topic) {
      this.subscribe(topic);
      this.activeContractTopics.set("ticker", topic);
    }
  }

  public unsubscribeTicker(contractId: string): void {
    const topic = WS_TOPIC_TICKER(contractId);
    if (topic) {
      this.unsubscribe(topic);
      // Only remove from tracking if it matches (should always match if logic is correct)
      if (this.activeContractTopics.get("ticker") === topic) {
        this.activeContractTopics.delete("ticker");
      }
    }
  }

  public subscribeAllTicker(): void {
    this.subscribe(WS_TOPIC_TICKER_ALL());
  }

  public unsubscribeAllTicker(): void {
    this.unsubscribe(WS_TOPIC_TICKER_ALL());
  }

  /**
   * Subscribe to order book depth updates (fixed to level 200 per constants).
   * Switches active contract context.
   */
  public subscribeDepth(contractId: string): void {
    this.switchContract(contractId);

    const topic = WS_TOPIC_depth(contractId);
    if (topic) {
      this.subscribe(topic);
      this.activeContractTopics.set("depth", topic);
    }
  }

  public unsubscribeDepth(contractId: string): void {
    const topic = WS_TOPIC_depth(contractId);
    if (topic) {
      this.unsubscribe(topic);
      if (this.activeContractTopics.get("depth") === topic) {
        this.activeContractTopics.delete("depth");
      }
    }
  }

  /**
   * Subscribe to real-time trades.s
   * Switches active contract context.
   */
  public subscribeTrade(contractId: string): void {
    this.switchContract(contractId);

    const topic = WS_TOPIC_recentTrades(contractId);
    if (topic) {
      this.subscribe(topic);
      this.activeContractTopics.set("trade", topic);
    }
  }

  public unsubscribeTrade(contractId: string): void {
    const topic = WS_TOPIC_recentTrades(contractId);
    if (topic) {
      this.unsubscribe(topic);
      if (this.activeContractTopics.get("trade") === topic) {
        this.activeContractTopics.delete("trade");
      }
    }
  }

  /**
   * Subscribe to Kline (Candlestick) data.
   * Switches active contract context.
   */
  public subscribeCandles(
    contractId: string,
    interval: string | number,
    priceType: string = "LAST_PRICE",
  ): void {
    this.switchContract(contractId);

    const topic = WS_TOPIC_kline(contractId, interval, priceType);
    if (topic) {
      this.subscribe(topic);
      this.activeContractTopics.set("candles", topic);
    }
  }

  public unsubscribeCandles(
    contractId: string,
    interval: string | number,
    priceType: string = "LAST_PRICE",
  ): void {
    const topic = WS_TOPIC_kline(contractId, interval, priceType);
    if (topic) {
      this.unsubscribe(topic);
      if (this.activeContractTopics.get("candles") === topic) {
        this.activeContractTopics.delete("candles");
      }
    }
  }

  public subscribeFundingRate(contractId: string): void {
    this.switchContract(contractId);

    const topic = WS_TOPIC_FUNDING_RATE(contractId);
    if (topic) {
      this.subscribe(topic);
      this.activeContractTopics.set("fundingRate", topic);
    }
  }

  public unsubscribeFundingRate(contractId: string): void {
    const topic = WS_TOPIC_FUNDING_RATE(contractId);
    if (topic) {
      this.unsubscribe(topic);
      if (this.activeContractTopics.get("fundingRate") === topic) {
        this.activeContractTopics.delete("fundingRate");
      }
    }
  }

  /**
   * Subscribe to Metadata updates
   */
  public subscribeMetadata(): void {
    this.subscribe(WS_TOPIC_METADATA());
  }

  public unsubscribeMetadata(): void {
    this.unsubscribe(WS_TOPIC_METADATA());
  }

  // =================================================================
  // Event Listener Helpers (DX improvements)
  // =================================================================

  /**
   * Listen to ticker updates. Returns a disposer function to remove the listener.
   */
  public onTickers(handler: (data: WebSocketContent<TickerEntry[]>) => void): () => void {
    this.on("ticker", handler);
    return () => this.off("ticker", handler);
  }

  /**
   * Listen to ALL ticker updates. Returns a disposer function to remove the listener.
   */
  public onAllTickers(handler: (data: WebSocketContent<TickerEntry[]>) => void): () => void {
    this.on("allTicker", handler);
    return () => this.off("allTicker", handler);
  }

  /**
   * Listen to depth updates. Returns a disposer function to remove the listener.
   */
  public onDepth(handler: (data: WebSocketContent<DepthEntry[]>) => void): () => void {
    this.on("depth", handler);
    return () => this.off("depth", handler);
  }

  /**
   * Listen to trade updates. Returns a disposer function to remove the listener.
   */
  public onTrades(handler: (data: WebSocketContent<TradeEntry[]>) => void): () => void {
    this.on("trade", handler);
    return () => this.off("trade", handler);
  }

  /**
   * Listen to kline (candle) updates. Returns a disposer function to remove the listener.
   */
  public onCandles(handler: (data: WebSocketContent<KlineEntry[]>) => void): () => void {
    this.on("kline", handler);
    return () => this.off("kline", handler);
  }

  /**
   * Listen to funding rate updates. Returns a disposer function to remove the listener.
   */
  public onFundingRate(handler: (data: WebSocketContent<any>) => void): () => void {
    this.on("fundingRate", handler);
    return () => this.off("fundingRate", handler);
  }

  /**
   * Listen to metadata updates. Returns a disposer function to remove the listener.
   */
  public onMetadata(handler: (data: WebSocketContent<any>) => void): () => void {
    this.on("metadata", handler);
    return () => this.off("metadata", handler);
  }

  /**
   * Override onMessage to parse and emit specific events
   * Supported events: 'ticker', 'depth', 'trade', 'kline', 'metadata', 'fundingRate'
   */
  protected override onMessage(data: any): void {
    super.onMessage(data);

    if (!data || typeof data !== "object") return;

    // Cast to partial structure to safely access fields
    const message = data as Partial<WebSocketMessage<unknown>>;
    const { channel, content } = message;

    if (!channel || typeof channel !== "string") return;

    // Use content directly as payload to preserve dataType and other metadata
    const payload = content;

    // Dispatch based on channel string matching

    if (channel === WS_TOPIC_TICKER_ALL()) {
      this.emit("allTicker", payload as WebSocketContent<TickerEntry[]>);
    } else if (channel.startsWith("ticker.")) {
      this.emit("ticker", payload as WebSocketContent<TickerEntry[]>);
    } else if (channel.startsWith("depth.")) {
      this.emit("depth", payload as WebSocketContent<DepthEntry[]>);
    } else if (channel.startsWith("trades.")) {
      this.emit("trade", payload as WebSocketContent<TradeEntry[]>);
    } else if (channel.startsWith("kline.")) {
      this.emit("kline", payload as WebSocketContent<KlineEntry[]>);
    } else if (channel === "metadata") {
      this.emit("metadata", payload);
    } else if (channel.startsWith("fundingRate.")) {
      this.emit("fundingRate", payload);
    }
  }
}
