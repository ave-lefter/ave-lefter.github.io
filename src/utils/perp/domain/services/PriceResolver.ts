/**
 * PriceResolver
 *
 * Resolves prices for different order scenarios.
 * Encapsulates the logic for choosing the appropriate price
 * based on order type and context.
 */

import { OrderType } from "../value-objects/OrderEnums";
import { OrderTypeHelper } from "../utils/OrderTypeHelper";

export interface GetCalculationPriceParams {
  orderType: OrderType | string;
  isConditionalMarket: boolean;
  limitPrice: string | number;
  lastPrice: string | number;
}

export interface GetDisplayPriceParams {
  orderType: OrderType | string;
  isConditionalMarket: boolean;
  limitPrice: string | number;
  oraclePrice?: string | number;
  lastPrice: string | number;
}

export class PriceResolver {
  /**
   * Get price for order calculation
   *
   * Returns the appropriate price to use for order-related calculations
   * (order limits, input conversions, etc.)
   *
   * Rules:
   * - MARKET orders and conditional MARKET orders use lastPrice
   * - LIMIT orders use provided price, fallback to lastPrice if not available
   */
  static getCalculationPrice(params: GetCalculationPriceParams): number {
    const { orderType, isConditionalMarket, limitPrice, lastPrice } = params;

    const preferLastPrice = orderType === OrderType.MARKET || isConditionalMarket;

    if (preferLastPrice) {
      return Number(lastPrice) || 0;
    }

    return Number(limitPrice) || Number(lastPrice) || 0;
  }

  /**
   * Get price for display/UI purposes
   *
   * Similar to getCalculationPrice, but designed for UI display scenarios.
   * Supports choosing between oraclePrice and lastPrice for market orders.
   *
   * Rules:
   * - MARKET orders and conditional MARKET orders use oraclePrice (if provided), fallback to lastPrice
   * - LIMIT orders use provided price, fallback to oraclePrice/lastPrice if not available
   */
  static getDisplayPrice(params: GetDisplayPriceParams): string | number {
    const { orderType, isConditionalMarket, limitPrice, oraclePrice, lastPrice } = params;

    const preferMarketPrice = OrderTypeHelper.isMarketOrder(orderType) || isConditionalMarket;

    if (preferMarketPrice) {
      return oraclePrice || lastPrice || "";
    }

    return limitPrice || oraclePrice || lastPrice || "";
  }
}
