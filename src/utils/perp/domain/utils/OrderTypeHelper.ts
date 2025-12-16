/**
 * Order Type Helper
 *
 * Provides utility functions for order type checking and classification
 *
 * DDD Principle:
 * - Pure domain utility functions
 * - No dependencies on external libraries
 * - Stateless and side-effect free
 */

import { OrderType } from "../value-objects/OrderEnums";

/**
 * Order Type Helper
 *
 * Utility class for order type checking and classification
 */
export class OrderTypeHelper {
  /**
   * Check if order type is MARKET
   */
  static isMarket(orderType: OrderType | string): boolean {
    return orderType === OrderType.MARKET;
  }

  /**
   * Check if order type is LIMIT
   */
  static isLimit(orderType: OrderType | string): boolean {
    return orderType === OrderType.LIMIT;
  }

  /**
   * Check if order type is STOP_MARKET (conditional market)
   */
  static isConditionalMarket(orderType: OrderType | string): boolean {
    return orderType === OrderType.STOP_MARKET;
  }

  /**
   * Check if order type is STOP_LIMIT (conditional limit)
   */
  static isConditionalLimit(orderType: OrderType | string): boolean {
    return orderType === OrderType.STOP_LIMIT;
  }

  /**
   * Check if order type is conditional (STOP_MARKET or STOP_LIMIT)
   */
  static isConditional(orderType: OrderType | string): boolean {
    return (
      orderType === OrderType.STOP_MARKET || orderType === OrderType.STOP_LIMIT
    );
  }

  /**
   * Check if order type is market order (MARKET or STOP_MARKET)
   */
  static isMarketOrder(orderType: OrderType | string): boolean {
    return (
      orderType === OrderType.MARKET || orderType === OrderType.STOP_MARKET
    );
  }

  /**
   * Check if order type is limit order (LIMIT or STOP_LIMIT)
   */
  static isLimitOrder(orderType: OrderType | string): boolean {
    return (
      orderType === OrderType.LIMIT || orderType === OrderType.STOP_LIMIT
    );
  }
}

