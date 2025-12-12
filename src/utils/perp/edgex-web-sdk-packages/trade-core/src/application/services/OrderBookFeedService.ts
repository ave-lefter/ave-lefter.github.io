import { DepthEntry } from "@edgex/types";
import { Orderbook, OrderbookSnapshot } from "../../domain/entities/Orderbook";

export class OrderBookFeedService {
  private readonly orderbook: Orderbook;
  private pendingState: OrderbookSnapshot | null = null;

  constructor(defaultPrecision = 2) {
    this.orderbook = new Orderbook(defaultPrecision);
  }

  getLastUpdateId() {
    return this.orderbook.getLastVersion();
  }

  isDeltaContinuous(startVersion: string) {
    if (!this.orderbook.hasSnapshot()) return false;
    return startVersion === this.orderbook.getLastVersion();
  }

  handleSnapshot(entry: DepthEntry | undefined, precision?: number) {
    this.orderbook.applySnapshot(entry, precision);
    this.pendingState = this.orderbook.snapshot();
  }

  handleDelta(entry: DepthEntry | undefined, precision?: number) {
    this.orderbook.applyDelta(entry, precision);
    this.pendingState = this.orderbook.snapshot();
  }

  consume() {
    if (!this.pendingState) return null;
    const next = this.pendingState;
    this.pendingState = null;
    return next;
  }

  reset() {
    this.orderbook.reset();
    this.pendingState = null;
  }
}
