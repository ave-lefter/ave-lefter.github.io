import { sortObjectArrayByKey, toPrecisionString } from "@edgex/utils";
import type { DepthEntry, IDepthOrder } from "@edgex/types";

export type OrderBookEntry = IDepthOrder & {
  type?: DepthUpdateType;
  total?: string;
};

export type OrderbookSnapshot = {
  sellList: OrderBookEntry[];
  buyList: OrderBookEntry[];
  maxTotal: number;
  recentlyPriceMap: {
    bid1: number;
    ask1: number;
  };
};

type DepthUpdateType = "snapshot" | "delta";
type Side = "buy" | "sell";

export class Orderbook {
  private readonly buyLevels = new Map<string, OrderBookEntry>();
  private readonly sellLevels = new Map<string, OrderBookEntry>();
  private lastVersion = "";
  private precision: number;

  constructor(private readonly defaultPrecision = 2) {
    this.precision = defaultPrecision;
  }

  getLastVersion() {
    return this.lastVersion;
  }

  hasSnapshot() {
    return Boolean(this.lastVersion);
  }

  reset() {
    this.buyLevels.clear();
    this.sellLevels.clear();
    this.lastVersion = "";
  }

  applySnapshot(entry?: DepthEntry, precision?: number) {
    if (!entry) return;
    this.updatePrecision(precision);
    this.reset();
    this.applySideUpdates(this.buyLevels, entry.bids ?? [], "snapshot");
    this.applySideUpdates(this.sellLevels, entry.asks ?? [], "snapshot");
    this.lastVersion = entry.endVersion;
  }

  applyDelta(entry?: DepthEntry, precision?: number) {
    if (!entry) return;
    this.updatePrecision(precision);
    this.applySideUpdates(this.buyLevels, entry.bids ?? [], "delta");
    this.applySideUpdates(this.sellLevels, entry.asks ?? [], "delta");
    this.lastVersion = entry.endVersion;
  }

  snapshot(): OrderbookSnapshot {
    const { list: sellList, total: sellTotal } = this.buildListWithTotal(
      "sell",
      Array.from(this.sellLevels.values()),
    );
    const { list: buyList, total: buyTotal } = this.buildListWithTotal(
      "buy",
      Array.from(this.buyLevels.values()),
    );

    return {
      sellList,
      buyList,
      maxTotal: Math.max(sellTotal, buyTotal),
      recentlyPriceMap: {
        bid1: buyList.length ? Number(buyList[0].price) : 0,
        ask1: sellList.length ? Number(sellList[0].price) : 0,
      },
    };
  }

  private updatePrecision(precision?: number) {
    if (typeof precision === "number" && !Number.isNaN(precision)) {
      this.precision = precision;
    } else {
      this.precision = this.defaultPrecision;
    }
  }

  private applySideUpdates(
    target: Map<string, OrderBookEntry>,
    updates: IDepthOrder[],
    type: DepthUpdateType,
  ) {
    updates.forEach(({ price, size }) => {
      target.set(price, { price, size, type });
      if (Number(size) === 0) {
        target.delete(price);
      }
    });
  }

  private buildListWithTotal(side: Side, list: OrderBookEntry[]) {
    const sorted = list.length
      ? (sortObjectArrayByKey(list, "price", "up") as OrderBookEntry[])
      : [];
    let total = 0;
    const withTotals = sorted.length
      ? sorted[side === "sell" ? "reduce" : "reduceRight"]((acc: OrderBookEntry[], entry) => {
          total = Number(entry.size) + total;
          acc.push({
            ...entry,
            total: toPrecisionString(total, this.precision),
          });
          return acc;
        }, [] as OrderBookEntry[])
      : [];

    return { list: withTotals, total };
  }
}
