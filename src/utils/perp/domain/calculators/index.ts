/**
 * 领域计算器
 *
 * 交易操作的纯计算函数。
 * 这些函数没有副作用，只依赖于输入参数。
 *
 * 使用示例：
 * ```ts
 * import {
 *   calculateUnrealizedPnL,
 *   calculateSimpleLiquidationPrice
 * } from "@edgex/trade-core/domain/calculators";
 *
 * const pnl = calculateUnrealizedPnL({
 *   side: "LONG",
 *   entryPrice: "50000",
 *   markPrice: "55000",
 *   size: "1"
 * });
 * ```
 */

// 类型
export * from "./types";

// 保证金计算
export {
  calculateOpenOrderFrozenAmount,
  calculateCloseOrderFrozenAmount,
  calculateOrderMarginBreakdown,
  calculateInitialMarginRate,
  calculateMarketOrderPrice,
} from "./marginCalculator";

// 盈亏计算
export {
  calculateUnrealizedPnL,
  calculateROE,
  calculateProfit,
  calculateTargetPrice,
  calculateRealizedPnL,
  calculatePositionValue,
  calculateRequiredMargin,
} from "./pnlCalculator";

// 强平价计算
export {
  calculateSimpleLiquidationPrice,
  calculateTieredLiquidationPrice,
  getMaintenanceMarginRate,
  calculateMarginRatio,
  calculateDistanceToLiquidation,
  getStarkExRiskRate,
  calculateStarkExWorstClosePrice,
  calculateStarkExLiquidationPrice,
} from "./liquidationCalculator";

// 价格计算
export {
  calculateTPSLTriggerPrice,
  calculateTPSLPriceFromROE, // @deprecated 使用 calculateTPSLTriggerPrice
  calculateROEFromPrice,
  calculatePnLAtPrice,
  calculatePriceFromPnL,
  calculateAveragePrice,
  calculateMidPrice,
  isSpreadTooWide,
  roundToTickSize,
  calculatePriceImpact,
} from "./priceCalculator";
