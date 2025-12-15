import BigNumber from "bignumber.js";
import { OrderSide } from "../value-objects/OrderEnums";

export type DepthUpdateType = "snapshot" | "delta";

// Define a minimal interface for order book items to avoid circular dependency or excessive coupling
export interface OrderBookItem {
  price: string;
  size: string;
  total?: string;
  type?: DepthUpdateType;
  [key: string]: any;
}

export interface ActiveOrderInfo {
  id: string;
  size: string;
  price: string;
}

export interface OrderBookItemWithActive extends OrderBookItem {
  orderList?: ActiveOrderInfo[];
}

/**
 * Calculate the number of order book levels that will be consumed by a market order.
 *
 * @param list - The order book list (asks for buy order, bids for sell order).
 *               - For BUY order, provide ASKS (sellList).
 *               - For SELL order, provide BIDS (buyList).
 *               *** IMPORTANT ***: The list MUST be sorted in the order of execution priority.
 *               - Asks (Sell List): Lowest price first (Ascending).
 *               - Bids (Buy List): Highest price first (Descending).
 *               *** Note on Frontend lists ***:
 *               Frontend often renders Sell List (Asks) in REVERSE (High to Low) for visual stacking.
 *               If passing such list, ensure you iterate correctly or reverse it back.
 *               This function assumes standard execution order (best price first).
 *
 * @param orderSize - The size of the market order.
 * @returns The number of levels consumed.
 */
export const calculateEatingLevels = (
  list: OrderBookItem[],
  orderSize: number | string | BigNumber,
): number => {
  const targetSize = new BigNumber(orderSize);
  if (targetSize.lte(0)) return 0;

  let levels = 0;
  let accumulatedSize = new BigNumber(0);

  // Iterate through the list.
  // Assumption: List is sorted by best price first.
  for (const item of list) {
    // Skip invalid items (e.g. placeholders)
    if (!item.size || item.size === "-" || item.size === "0") continue;

    const itemSize = new BigNumber(item.size);
    accumulatedSize = accumulatedSize.plus(itemSize);
    levels++;

    if (accumulatedSize.gte(targetSize)) {
      break;
    }
  }

  return levels;
};

/**
 * Aggregate order book items based on depth degree (step).
 *
 * @param dataList - Raw order book list
 * @param type - 'buy' (bids) or 'sell' (asks)
 * @param degree - Aggregation step (e.g. 0.1, 1, 10)
 * @returns Aggregated list
 */
export const aggregateOrderBook = (
  dataList: OrderBookItem[],
  type: "buy" | "sell",
  degree: number | string,
): OrderBookItem[] => {
  if (!dataList || dataList.length === 0) return [];
  if (dataList.length === 1) return dataList;

  const step = new BigNumber(degree);
  if (step.lte(0)) return dataList;

  // Ensure list is sorted by price ascending for processing
  // Note: Original code sorted if [1] < [0]. We assume raw data might be disordered or ordered.
  // Ideally raw data from WS/API is sorted. But to be safe and match original logic:
  const sortedList = [...dataList].sort((a, b) => new BigNumber(a.price).minus(b.price).toNumber());

  const tempMap = new Map<string, OrderBookItem>();
  let cumulativeTotal = new BigNumber(0);

  // Buy: Aggregate from High Price -> Low Price (reduceRight on sorted ascending list)
  // Sell: Aggregate from Low Price -> High Price (reduce on sorted ascending list)
  const isBuy = type === "buy";
  const processList = isBuy ? sortedList.reverse() : sortedList;

  let preStepPrice: BigNumber | null = null;

  for (const item of processList) {
    const itemPrice = new BigNumber(item.price);
    const itemSize = new BigNumber(item.size);

    if (preStepPrice) {
      // Check if current item falls into the previous step bucket
      // For Buy: High -> Low. Bucket is [Step, Step + degree).
      // itemPrice >= Step. (Since we iterate high to low, itemPrice <= previous itemPrice is guaranteed)
      // For Sell: Low -> High. Bucket is (Step - degree, Step].
      // itemPrice <= Step.

      // Actually, original logic was:
      // Buy: itemPrice >= preStepPrice. (Wait, if iterating High -> Low, itemPrice is decreasing. So itemPrice <= prevItemPrice.)
      // The original logic `isInPreStep = type === "buy" ? itemPrice >= preStepPrice : itemPrice <= preStepPrice`
      // implies preStepPrice is the "Floor" for Buy bucket, or "Ceiling" for Sell bucket?

      // Let's re-read original logic carefully:
      // if (preStepPrice) {
      //   const isInPreStep = type === "buy" ? itemPrice >= preStepPrice : itemPrice <= preStepPrice;
      // }
      // else {
      //   price = Math[floor/ceil](price / degree) * degree
      //   return price
      // }

      // Example Buy: degree = 10. List: 105, 102, 98.
      // 1. 105. Floor(10.5) * 10 = 100. preStepPrice = 100.
      // 2. 102. 102 >= 100? Yes. Merge into 100.
      // 3. 98. 98 >= 100? No. New step needed.
      //    Original logic: `(preStepPrice - itemPrice) / degree` -> ceil((100 - 98)/10) = 1.
      //    currentStepPrice = 100 + (-1 * 10 * 1) = 90.
      //    90 becomes new preStepPrice.

      const isInPreStep = isBuy
        ? itemPrice.gte(preStepPrice)
        : itemPrice.lte(preStepPrice);

      if (isInPreStep) {
        // Merge
        const existingItem = tempMap.get(preStepPrice.toString());
        if (existingItem) {
          existingItem.size = new BigNumber(existingItem.size).plus(itemSize).toString();
          cumulativeTotal = cumulativeTotal.plus(itemSize);
          existingItem.total = cumulativeTotal.toString();
        }
      } else {
        // Create new step
        let currentStepPrice: BigNumber;
        
        // Calculate gap steps
        // Buy: (100 - 98) / 10 = 0.2 -> ceil -> 1 step. 100 - 10 = 90.
        // Sell: (102 - 100) / 10 = 0.2 -> ceil -> 1 step. 100 + 10 = 110.
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
      // First item, initialize step price
      // Buy: floor. Sell: ceil.
      // Example Buy 105, degree 10 -> 100.
      // Example Sell 105, degree 10 -> 110.
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
};

/**
 * Map active user orders to the aggregated order book levels.
 *
 * @param list - The aggregated order book list
 * @param activeOrders - User's active orders
 * @param type - 'BUY' or 'SELL' (matches OrderSide)
 * @param deepValue - Aggregation degree/step
 */
export const mapActiveOrdersToDepth = (
  list: OrderBookItem[],
  activeOrders: any[],
  type: "BUY" | "SELL",
  deepValue: string | number
): OrderBookItemWithActive[] => {
  if (!list || list.length === 0) return [];
  
  const step = new BigNumber(deepValue);
  const targetSide = type === "BUY" ? OrderSide.BUY : OrderSide.SELL;

  return list.map((item) => {
    const orderList: ActiveOrderInfo[] = [];
    const itemPrice = new BigNumber(item.price);

    // Calculate bucket range
    // Buy Bucket: [itemPrice, itemPrice + step)
    // Sell Bucket: (itemPrice - step, itemPrice]
    const upperPrice = type === "BUY" ? itemPrice.plus(step) : itemPrice;
    const lowerPrice = type === "BUY" ? itemPrice : itemPrice.minus(step);

    activeOrders.forEach((order) => {
      if (order.side !== targetSide || !order.price) return;

      const orderPrice = new BigNumber(order.price);

      let isMatch = false;
      if (type === "BUY") {
        // [itemPrice, upperPrice)
        // Original: orderPrice < upperPrice && orderPrice >= itemPrice
        isMatch = orderPrice.lt(upperPrice) && orderPrice.gte(itemPrice);
      } else {
        // (lowerPrice, itemPrice]
        // Original: orderPrice > lowerPrice && orderPrice <= itemPrice
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
};