/**
 * 订单类型相关常量
 *
 * DDD 原则：
 * - 这些常量定义了订单类型的业务分类
 * - 属于 Domain 层，描述业务概念和规则
 * - 被 Domain Services 使用
 */

import { OrderType } from "../value-objects";

/**
 * 订单类型分组
 *
 * 定义了订单类型的业务分类规则：
 * - MARKET_ORDERS: 市价单类型，立即执行
 * - LIMIT_ORDERS: 限价单类型，指定价格执行
 * - CONDITIONAL_ORDERS: 条件单类型，满足条件时执行
 */
export const ORDER_TYPE_GROUPS = {
  /** 市价单类型 */
  MARKET_ORDERS: [
    OrderType.MARKET,
    OrderType.STOP_MARKET,
    OrderType.TAKE_PROFIT_MARKET,
  ] as OrderType[],
  /** 限价单类型 */
  LIMIT_ORDERS: [OrderType.LIMIT, OrderType.STOP_LIMIT, OrderType.TAKE_PROFIT_LIMIT] as OrderType[],
  /** 条件单类型 */
  CONDITIONAL_ORDERS: [
    OrderType.STOP_MARKET,
    OrderType.STOP_LIMIT,
    OrderType.TAKE_PROFIT_MARKET,
    OrderType.TAKE_PROFIT_LIMIT,
  ] as const,
} as const;

/**
 * 订单类型分组类型
 */
export type OrderTypeGroup = keyof typeof ORDER_TYPE_GROUPS;
