/**
 * 订单类型转换服务
 *
 * 职责：处理条件单类型的自动转换逻辑
 *
 * DDD 原则：
 * - 这是业务规则，属于 Domain Service
 * - 封装订单类型转换的复杂逻辑
 * - 无副作用，纯函数设计
 *
 * 业务规则：
 * 根据触发价与当前价的关系，自动判断是止损单还是止盈单
 *
 * - 买入：触发价 > 当前价 → TAKE_PROFIT，触发价 < 当前价 → STOP
 * - 卖出：触发价 > 当前价 → STOP，触发价 < 当前价 → TAKE_PROFIT
 */

import { OrderType } from "../value-objects";

/**
 * 订单类型转换服务
 */
export class OrderTypeConverter {
  /**
   * 转换条件单类型
   *
   * 根据触发价与当前价的关系，自动判断订单类型
   *
   * @param originalType 原始订单类型（STOP_MARKET 或 STOP_LIMIT）
   * @param side 订单方向（BUY 或 SELL）
   * @param currentPrice 当前价格
   * @param triggerPrice 触发价格
   * @returns 转换后的订单类型
   *
   * @example
   * // 买入，当前价 100，触发价 110 → 止盈单
   * OrderTypeConverter.convert('STOP_MARKET', 'BUY', 100, 110) // 'TAKE_PROFIT_MARKET'
   *
   * @example
   * // 买入，当前价 100，触发价 90 → 止损单
   * OrderTypeConverter.convert('STOP_MARKET', 'BUY', 100, 90) // 'STOP_MARKET'
   */
  static convert(
    originalType: string,
    side: string,
    currentPrice: number,
    triggerPrice: number,
  ): OrderType {
    // 只处理 STOP_MARKET 和 STOP_LIMIT 类型
    if (originalType === OrderType.STOP_MARKET) {
      return this.convertStopMarket(side, currentPrice, triggerPrice);
    }

    if (originalType === OrderType.STOP_LIMIT) {
      return this.convertStopLimit(side, currentPrice, triggerPrice);
    }

    // 其他类型不转换
    return originalType as OrderType;
  }

  /**
   * 转换 STOP_MARKET 类型
   *
   * @private
   */
  private static convertStopMarket(
    side: string,
    currentPrice: number,
    triggerPrice: number,
  ): OrderType {
    if (side === "BUY") {
      // 买入：触发价 < 当前价 → STOP，触发价 > 当前价 → TAKE_PROFIT
      return currentPrice < triggerPrice ? OrderType.STOP_MARKET : OrderType.TAKE_PROFIT_MARKET;
    } else {
      // 卖出：触发价 > 当前价 → STOP，触发价 < 当前价 → TAKE_PROFIT
      return currentPrice > triggerPrice ? OrderType.STOP_MARKET : OrderType.TAKE_PROFIT_MARKET;
    }
  }

  /**
   * 转换 STOP_LIMIT 类型
   *
   * @private
   */
  private static convertStopLimit(
    side: string,
    currentPrice: number,
    triggerPrice: number,
  ): OrderType {
    if (side === "BUY") {
      // 买入：触发价 < 当前价 → STOP，触发价 > 当前价 → TAKE_PROFIT
      return currentPrice < triggerPrice ? OrderType.STOP_LIMIT : OrderType.TAKE_PROFIT_LIMIT;
    } else {
      // 卖出：触发价 > 当前价 → STOP，触发价 < 当前价 → TAKE_PROFIT
      return currentPrice > triggerPrice ? OrderType.STOP_LIMIT : OrderType.TAKE_PROFIT_LIMIT;
    }
  }

  /**
   * 判断是否需要类型转换
   *
   * @param orderType 订单类型
   * @returns 是否是需要转换的条件单类型
   */
  static needsConversion(orderType: string): boolean {
    return orderType === OrderType.STOP_MARKET || orderType === OrderType.STOP_LIMIT;
  }
}
