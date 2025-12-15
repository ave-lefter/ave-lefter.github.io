import { TradeEntry } from "@edgex/types";
import { Trade } from "../../domain/entities/Trade";

export class TradesFeedService {
  private trades: Trade[] = [];
  private dirty = false;

  constructor(private readonly maxTrades = 30) {}

  handleSnapshot(entries: TradeEntry[]) {
    try {
      if (!Array.isArray(entries)) {
        console.warn("TradesFeedService: Invalid snapshot data", entries);
        return;
      }
      this.trades = entries
        .slice(0, this.maxTrades)
        .map((entry) => {
          try {
            return Trade.fromRaw(entry);
          } catch (error) {
            console.warn("TradesFeedService: Failed to parse trade entry", entry, error);
            return null;
          }
        })
        .filter((trade): trade is Trade => trade !== null);
      this.dirty = true;
    } catch (error) {
      console.error("TradesFeedService: Error handling snapshot", error);
    }
  }

  handleDelta(entries: TradeEntry[]) {
    try {
      if (!Array.isArray(entries)) {
        console.warn("TradesFeedService: Invalid delta data", entries);
        return;
      }

      let hasValidEntries = false;
      entries.forEach((entry) => {
        try {
          const trade = Trade.fromRaw(entry);
          this.trades.unshift(trade);
          if (this.trades.length > this.maxTrades) {
            this.trades.pop();
          }
          hasValidEntries = true;
        } catch (error) {
          console.warn("TradesFeedService: Failed to parse trade entry", entry, error);
        }
      });

      if (hasValidEntries) {
        this.dirty = true;
      }
    } catch (error) {
      console.error("TradesFeedService: Error handling delta", error);
    }
  }

  consume(): Trade[] | null {
    if (!this.dirty) {
      return null;
    }
    this.dirty = false;
    return [...this.trades];
  }

  reset() {
    this.trades = [];
    this.dirty = true;
  }
}
