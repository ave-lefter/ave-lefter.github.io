import BigNumber from "bignumber.js";
import { sortObjectArrayByKey, toPrecisionString } from "../../utils";
import type { DepthEntry, IDepthOrder } from "../../types";
import { OrderSide } from "../value-objects/OrderEnums";

export type OrderBookEntry = IDepthOrder & {
  type?: DepthUpdateType;
  total?: string;
  [key: string]: any;
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

export interface ActiveOrderInfo {
  id: string;
  size: string;
  price: string;
}

export interface OrderBookItemWithActive extends OrderBookEntry {
  orderList?: ActiveOrderInfo[];
}

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

  // === Static Methods (Migrated from calculator/orderbook.ts) ===

  /**
   * Calculate the number of order book levels that will be consumed by a market order.
   */
  static calculateEatingLevels(
    list: OrderBookEntry[],
    orderSize: number | string | BigNumber,
  ): number {
    const targetSize = new BigNumber(orderSize);
    if (targetSize.lte(0)) return 0;

    let levels = 0;
    let accumulatedSize = new BigNumber(0);

    for (const item of list) {
      if (!item.size || item.size === "-" || item.size === "0") continue;

      const itemSize = new BigNumber(item.size);
      accumulatedSize = accumulatedSize.plus(itemSize);
      levels++;

      if (accumulatedSize.gte(targetSize)) {
        break;
      }
    }

    return levels;
  }

  /**
   * Aggregate order book items based on depth degree (step).
   */
  static aggregate(
    dataList: OrderBookEntry[],
    type: "buy" | "sell",
    degree: number | string,
  ): OrderBookEntry[] {
    if (!dataList || dataList.length === 0) return [];
    if (dataList.length === 1) return dataList;

    const step = new BigNumber(degree);
    if (step.lte(0)) return dataList;

    const sortedList = [...dataList].sort((a, b) => new BigNumber(a.price).minus(b.price).toNumber());

    const tempMap = new Map<string, OrderBookEntry>();
    let cumulativeTotal = new BigNumber(0);

    const isBuy = type === "buy";
    const processList = isBuy ? sortedList.reverse() : sortedList;

    let preStepPrice: BigNumber | null = null;

    for (const item of processList) {
      const itemPrice = new BigNumber(item.price);
      const itemSize = new BigNumber(item.size);

      if (preStepPrice) {
        const isInPreStep = isBuy
          ? itemPrice.gte(preStepPrice)
          : itemPrice.lte(preStepPrice);

        if (isInPreStep) {
          const existingItem = tempMap.get(preStepPrice.toString());
          if (existingItem) {
            existingItem.size = new BigNumber(existingItem.size).plus(itemSize).toString();
            cumulativeTotal = cumulativeTotal.plus(itemSize);
            existingItem.total = cumulativeTotal.toString();
          }
        } else {
          let currentStepPrice: BigNumber;
          const diff = isBuy ? preStepPrice.minus(itemPrice) : itemPrice.minus(preStepPrice);
          const gapSteps = diff.dividedBy(step).integerValue(BigNumber.ROUND_CEIL);

          currentStepPrice = isBuy
              ? preStepPrice.minus(step.multipliedBy(gapSteps))
              : preStepPrice.plus(step.multipliedBy(gapSteps));

          cumulativeTotal = cumulativeTotal.plus(itemSize);
          tempMap.set(currentStepPrice.toString(), {
            price: currentStepPrice.toString(),
            size: itemSize.toString(),
            total: cumulativeTotal.toString(),
            type: item.type,
          });
          preStepPrice = currentStepPrice;
        }

      } else {
        const rawDiv = itemPrice.dividedBy(step);
        const roundedDiv = isBuy
          ? rawDiv.integerValue(BigNumber.ROUND_FLOOR)
          : rawDiv.integerValue(BigNumber.ROUND_CEIL);

        const price = roundedDiv.multipliedBy(step);

        cumulativeTotal = itemSize;
        tempMap.set(price.toString(), {
          price: price.toString(),
          size: itemSize.toString(),
          total: cumulativeTotal.toString(),
          type: item.type,
        });
        preStepPrice = price;
      }
    }

    return Array.from(tempMap.values());
  }

  /**
   * Map active user orders to the aggregated order book levels.
   */
  static mapActiveOrders(
    list: OrderBookEntry[],
    activeOrders: any[],
    type: "BUY" | "SELL",
    deepValue: string | number
  ): OrderBookItemWithActive[] {
    if (!list || list.length === 0) return [];

    const step = new BigNumber(deepValue);
    const targetSide = type === "BUY" ? OrderSide.BUY : OrderSide.SELL;

    return list.map((item) => {
      const orderList: ActiveOrderInfo[] = [];
      const itemPrice = new BigNumber(item.price);

      const upperPrice = type === "BUY" ? itemPrice.plus(step) : itemPrice;
      const lowerPrice = type === "BUY" ? itemPrice : itemPrice.minus(step);

      activeOrders.forEach((order) => {
        if (order.side !== targetSide || !order.price) return;

        const orderPrice = new BigNumber(order.price);

        let isMatch = false;
        if (type === "BUY") {
          isMatch = orderPrice.lt(upperPrice) && orderPrice.gte(itemPrice);
        } else {
          isMatch = orderPrice.gt(lowerPrice) && orderPrice.lte(itemPrice);
        }

        if (isMatch) {
          orderList.push({
            id: order.id,
            size: order.size,
            price: order.price,
          });
        }
      });

      return { ...item, orderList };
    });
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
