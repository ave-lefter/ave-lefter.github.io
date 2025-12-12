/**
 * TWAP 评估服务
 *
 * 职责：判断订单是否需要 TWAP 拆单，是否超过限制
 *
 * DDD 原则：
 * - 这是业务规则，属于 Domain Service
 * - 封装 TWAP 判断的复杂逻辑
 * - 无副作用，纯函数设计
 *
 * 业务规则：
 * 1. 市价单超过 maxMarketPositionSize 时，需要 TWAP 拆单（仅非只减仓单）
 * 2. 限价单超过 maxOrderSize 时，需要用户确认（仅非只减仓单）
 */

import { ORDER_TYPE_GROUPS } from "../constants/OrderTypes";
import { OrderType } from "../value-objects";

/**
 * TWAP 评估上下文
 */
export interface TwapEvaluationContext {
  /** 订单类型 */
  orderType: OrderType;
  /** 订单数量 */
  orderSize: number;
  /** 最大市价仓位（超过此值需要 TWAP） */
  maxMarketPositionSize: number;
  /** 最大订单数量（超过此值需要确认） */
  maxOrderSize: number;
  /** 是否只减仓 */
  isReduceOnly: boolean;
}

/**
 * TWAP 评估结果
 */
export interface TwapEvaluationResult {
  /** 是否需要 TWAP 拆单 */
  needsTwap: boolean;
  /** 是否超过限价单限制 */
  exceedsLimitOrderSize: boolean;
  /** 建议的订单大小（如果需要调整） */
  suggestedSize?: number;
}

/**
 * TWAP 评估服务
 *
 * 判断订单是否需要 TWAP 拆单或超限确认
 */
export class TwapEvaluator {
  /**
   * 判断是否需要 TWAP 拆单
   *
   * 业务规则：
   * - 市价单超过最大市价仓位时，需要拆分成多笔订单
   * - 只减仓单不拆分
   * - maxMarketPositionSize 必须大于 0
   *
   * @param orderType 订单类型
   * @param orderSize 订单数量
   * @param maxMarketPositionSize 最大市价仓位
   * @param isReduceOnly 是否只减仓
   * @returns 是否需要 TWAP 拆单
   */
  static shouldUseTwap(
    orderType: OrderType,
    orderSize: number,
    maxMarketPositionSize: number,
    isReduceOnly: boolean,
  ): boolean {
    // 只有市价单才可能需要 TWAP
    const isMarketOrder = ORDER_TYPE_GROUPS.MARKET_ORDERS.includes(orderType);

    return (
      isMarketOrder &&
      orderSize > maxMarketPositionSize &&
      maxMarketPositionSize > 0 &&
      !isReduceOnly
    );
  }

  /**
   * 判断限价单是否超过最大数量
   *
   * 业务规则：
   * - 限价单超过最大订单数量时，需要用户确认
   * - 只减仓单不限制
   * - maxOrderSize 必须大于 0
   *
   * @param orderType 订单类型
   * @param orderSize 订单数量
   * @param maxOrderSize 最大订单数量
   * @param isReduceOnly 是否只减仓
   * @returns 是否超过限制
   */
  static exceedsLimitOrderSize(
    orderType: OrderType,
    orderSize: number,
    maxOrderSize: number,
    isReduceOnly: boolean,
  ): boolean {
    // 只有限价单才有数量限制
    const isLimitOrder = ORDER_TYPE_GROUPS.LIMIT_ORDERS.includes(orderType);

    return isLimitOrder && !isReduceOnly && orderSize > maxOrderSize && maxOrderSize > 0;
  }

  /**
   * 综合评估订单
   *
   * 同时判断 TWAP 需求和限价单限制
   *
   * @param context 评估上下文
   * @returns 评估结果
   */
  static evaluate(context: TwapEvaluationContext): TwapEvaluationResult {
    const needsTwap = this.shouldUseTwap(
      context.orderType,
      context.orderSize,
      context.maxMarketPositionSize,
      context.isReduceOnly,
    );

    const exceedsLimitOrderSize = this.exceedsLimitOrderSize(
      context.orderType,
      context.orderSize,
      context.maxOrderSize,
      context.isReduceOnly,
    );

    // 计算建议的订单大小
    let suggestedSize: number | undefined;
    if (needsTwap) {
      suggestedSize = context.maxMarketPositionSize;
    } else if (exceedsLimitOrderSize) {
      suggestedSize = context.maxOrderSize;
    }

    return {
      needsTwap,
      exceedsLimitOrderSize,
      suggestedSize,
    };
  }

  /**
   * 判断订单是否需要大小调整
   *
   * @param context 评估上下文
   * @returns 是否需要调整
   */
  static needsSizeAdjustment(context: TwapEvaluationContext): boolean {
    const result = this.evaluate(context);
    return result.needsTwap || result.exceedsLimitOrderSize;
  }
}
