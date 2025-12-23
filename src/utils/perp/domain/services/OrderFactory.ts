import type { IContract as ISymbol, OrderEntry } from "../../types"
import { Order } from "../entities/Order";
import { SymbolEntity } from "../entities/Symbol";
import { OrderSide, OrderType, PositionSide, TimeInForce, TriggerPriceType } from "../value-objects/OrderEnums";
import { Position } from "../entities/Position";
import BigNumber from "bignumber.js";
import { getNumberPrecision } from "../../utils";

export interface ClosePositionParams {
  price?: string;
  size: string;
  type: OrderType;
}

export class OrderFactory {
  /**
   * 从 OrderEntry[] 和 Symbol[] 创建 Order[] 实体列表
   */
  static createOrdersFromRaw(orderEntries: OrderEntry[], symbols: (ISymbol | SymbolEntity)[]): Order[] {
    // 创建 Symbol Map 以便快速查找
    const symbolMap = new Map<string, ISymbol | SymbolEntity>();
    symbols.forEach((symbol) => {
      symbolMap.set(symbol.contractId, symbol);
    });

    return orderEntries
      .map((entry) => {
        const symbol = symbolMap.get(entry.contractId);

        if (!symbol) {
          console.warn(`Symbol not found for contractId: ${entry.contractId}`);
          return null;
        }

        try {
          return Order.fromRaw(symbol, entry);
        } catch (error) {
          console.warn(`Failed to create Order for ${entry.id}:`, error);
          return null;
        }
      })
      .filter((order): order is Order => order !== null);
  }

  static buildClosePositionOrderParams(
    position: Position,
    params: ClosePositionParams
  ): Record<string, any> {
    const { price, size, type } = params;

    const closeSide = position.side === PositionSide.LONG ? OrderSide.SELL : OrderSide.BUY;
    const precision = getNumberPrecision(position.symbol.sizeStep);
    const orderSize = new BigNumber(size).toFixed(precision, BigNumber.ROUND_DOWN);

    const orderParams: Record<string, any> = {
      side: closeSide,
      size: orderSize,
      reduceOnly: true,
      type: type,
      symbol: position.symbol.symbol,
      contractId: position.contractId,
      // Default params for safety
      isPositionTpsl: false,
      isSetOpenSl: false,
      isSetOpenTp: false,
      triggerPrice: "",
      triggerPriceType: TriggerPriceType.LAST_PRICE,
      confirm: false,
    };

    if (type === OrderType.LIMIT) {
      if (!price) {
        throw new Error("Price is required for limit orders.");
      }
      orderParams.price = price;
      orderParams.timeInForce = TimeInForce.GOOD_TIL_CANCEL;
      orderParams.triggerPriceWithType = price;
    } else {
      // For MARKET orders, price is not needed, but other params might be.
      // The original code in useClosePositionLogic defaults to LIMIT, so we focus on that.
      // But if a market close is needed, the logic would be simpler.
      orderParams.price = "0"; // Market orders often use 0 for price
      orderParams.timeInForce = TimeInForce.IMMEDIATE_OR_CANCEL;
    }

    return orderParams;
  }
}
