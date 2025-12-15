/**
 * StarkEx 配置常量
 *
 * DDD 原则：
 * - 这些常量是 StarkEx 系统集成的技术配置
 * - 属于 Infrastructure 层，描述技术实现细节
 * - 被 Infrastructure Services 使用
 */

/**
 * StarkEx 相关配置
 */
export const STARKEX_CONFIG = {
  /** 订单过期时间（30天） */
  ORDER_EXPIRATION_DAYS: 30,
  /** L1 过期时间偏移（比 L2 早 9 天） */
  L1_EXPIRATION_OFFSET_DAYS: 9,
  /** 市价买单的价格乘数 */
  MARKET_ORDER_BUY_PRICE_MULTIPLIER: 10,
} as const;
