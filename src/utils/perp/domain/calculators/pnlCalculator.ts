/**
 * 盈亏计算器
 *
 * 计算交易收益、亏损和回报率的纯函数。
 * 这些是所有衍生品交易所通用的标准金融计算。
 */

import BigNumber from "bignumber.js";
import type {
  UnrealizedPnLInput,
  ROEInput,
  TargetPriceInput,
  ProfitInput,
  ProfitResult,
  PositionSide,
  NumericValue,
} from "./types";

/**
 * 计算持仓的未实现盈亏
 *
 * 未实现盈亏表示如果以当前市价平仓的理论收益/亏损。
 *
 * 公式：
 * ```
 * 多仓: PnL = (标记价格 - 开仓价格) × 数量
 * 空仓: PnL = (开仓价格 - 标记价格) × 数量
 * ```
 *
 * @example
 * // 1 BTC 多仓，开仓价 $50,000，当前价 $55,000
 * calculateUnrealizedPnL({
 *   side: "LONG",
 *   entryPrice: "50000",
 *   markPrice: "55000",
 *   size: "1"
 * })
 * // 返回: 5000 (盈利)
 *
 * @example
 * // 2 ETH 空仓，开仓价 $3,000，当前价 $2,800
 * calculateUnrealizedPnL({
 *   side: "SHORT",
 *   entryPrice: "3000",
 *   markPrice: "2800",
 *   size: "2"
 * })
 * // 返回: 400 (盈利)
 */
export function calculateUnrealizedPnL(input: UnrealizedPnLInput): BigNumber {
  const { side, entryPrice, markPrice, size } = input;

  const entry = BigNumber(entryPrice);
  const mark = BigNumber(markPrice);
  const qty = BigNumber(size);

  const isLong = side === "LONG";

  if (isLong) {
    return mark.minus(entry).multipliedBy(qty);
  } else {
    return entry.minus(mark).multipliedBy(qty);
  }
}

/**
 * 计算杠杆仓位的 ROE（权益回报率）
 *
 * ROE 衡量相对于所用保证金（抵押品）的回报，
 * 体现了杠杆的放大效应。
 *
 * 公式：
 * ```
 * ROE = (PnL / 保证金) × 100%
 *
 * 其中：
 *   PnL = 未实现盈亏
 *   保证金 = 开仓价格 × 数量 / 杠杆
 * ```
 *
 * 简化公式：
 * ```
 * 多仓: ROE = ((标记价格 - 开仓价格) / 开仓价格) × 杠杆 × 100%
 * 空仓: ROE = ((开仓价格 - 标记价格) / 开仓价格) × 杠杆 × 100%
 * ```
 *
 * @example
 * // 10 倍杠杆多仓，价格上涨 5%
 * calculateROE({
 *   side: "LONG",
 *   entryPrice: "100",
 *   markPrice: "105",
 *   size: "1",
 *   leverage: "10"
 * })
 * // 返回: 50 (50% ROE = 5% 价格变动 × 10 倍杠杆)
 */
export function calculateROE(input: ROEInput): BigNumber {
  const { side, entryPrice, markPrice, size, leverage } = input;

  const pnl = calculateUnrealizedPnL({ side, entryPrice, markPrice, size });

  const entry = BigNumber(entryPrice);
  const qty = BigNumber(size);
  const lev = BigNumber(leverage);

  // 保证金 = 仓位价值 / 杠杆
  const margin = entry.multipliedBy(qty).dividedBy(lev);

  if (margin.isZero()) {
    return BigNumber(0);
  }

  // ROE 百分比
  return pnl.dividedBy(margin).multipliedBy(100);
}

/**
 * 计算包含保证金、金额和比率的完整收益指标
 *
 * 提供仓位盈利能力的完整视图，
 * 适合向交易者展示。
 *
 * 公式：
 * ```
 * 保证金 = 开仓价格 × 数量 / 杠杆
 * 收益金额 = PnL（见 calculateUnrealizedPnL）
 * 收益率 = (收益金额 / 保证金) × 100%
 * ```
 *
 * @example
 * calculateProfit({
 *   side: "LONG",
 *   entryPrice: "50000",
 *   exitPrice: "52000",
 *   size: "0.1",
 *   leverage: "10"
 * })
 * // 返回: { margin: "500", profitAmount: "200", profitRate: "40" }
 */
export function calculateProfit(input: ProfitInput): ProfitResult {
  const { side, entryPrice, exitPrice, size, leverage } = input;

  const entry = BigNumber(entryPrice);
  const qty = BigNumber(size);
  const lev = BigNumber(leverage);

  // 仓位保证金
  const margin = entry.multipliedBy(qty).dividedBy(lev);

  // 收益金额
  const profitAmount = calculateUnrealizedPnL({
    side,
    entryPrice,
    markPrice: exitPrice,
    size,
  });

  // 收益率
  const profitRate = margin.gt(0)
    ? profitAmount.dividedBy(margin).multipliedBy(100)
    : BigNumber(0);

  return {
    margin: margin.toFixed(2, BigNumber.ROUND_DOWN),
    profitAmount: profitAmount.toFixed(2, BigNumber.ROUND_DOWN),
    profitRate: profitRate.toFixed(2, BigNumber.ROUND_DOWN),
  };
}

/**
 * 根据目标收益计算平仓价格
 *
 * 给定期望的收益（金额或百分比），计算平仓价格。
 *
 * 公式（按收益率）：
 * ```
 * 多仓: 目标价格 = 开仓价格 × (1 + 收益率 / 杠杆)
 * 空仓: 目标价格 = 开仓价格 × (1 - 收益率 / 杠杆)
 * ```
 *
 * 公式（按收益金额）：
 * ```
 * 多仓: 目标价格 = 开仓价格 + (收益金额 / 数量)
 * 空仓: 目标价格 = 开仓价格 - (收益金额 / 数量)
 * ```
 *
 * @example
 * // 10 倍杠杆多仓，目标 50% ROE
 * calculateTargetPrice({
 *   side: "LONG",
 *   entryPrice: "50000",
 *   size: "1",
 *   leverage: "10",
 *   targetProfit: "50",
 *   profitType: "rate"
 * })
 * // 返回: 52500（价格上涨 5% 实现 10 倍杠杆下 50% ROE）
 */
export function calculateTargetPrice(input: TargetPriceInput): BigNumber {
  const { side, entryPrice, size, leverage, targetProfit, profitType } = input;

  const entry = BigNumber(entryPrice);
  const qty = BigNumber(size);
  const lev = BigNumber(leverage);
  const profit = BigNumber(targetProfit);

  const isLong = side === "LONG";

  if (profitType === "rate") {
    // 按 ROE 百分比计算目标价
    const priceChangeRatio = profit.dividedBy(100).dividedBy(lev);

    if (isLong) {
      return entry.multipliedBy(BigNumber(1).plus(priceChangeRatio));
    } else {
      return entry.multipliedBy(BigNumber(1).minus(priceChangeRatio));
    }
  } else {
    // 按绝对收益金额计算目标价
    const priceChange = profit.dividedBy(qty);

    if (isLong) {
      return entry.plus(priceChange);
    } else {
      return entry.minus(priceChange);
    }
  }
}

/**
 * 根据开仓价和平仓价计算已实现盈亏
 *
 * 便捷函数，计算已完成交易的实际盈亏。
 *
 * 公式：
 * ```
 * 多仓: 已实现PnL = (平仓价格 - 开仓价格) × 数量
 * 空仓: 已实现PnL = (开仓价格 - 平仓价格) × 数量
 * ```
 */
export function calculateRealizedPnL(input: {
  side: PositionSide;
  entryPrice: NumericValue;
  exitPrice: NumericValue;
  size: NumericValue;
}): BigNumber {
  return calculateUnrealizedPnL({
    side: input.side,
    entryPrice: input.entryPrice,
    markPrice: input.exitPrice,
    size: input.size,
  });
}

/**
 * 计算仓位价值（名义价值）
 *
 * 仓位价值表示仓位的总市值，
 * 与使用多少保证金无关。
 *
 * 公式：
 * ```
 * 仓位价值 = 价格 × 数量
 * ```
 *
 * @example
 * calculatePositionValue("50000", "0.5")
 * // 返回: 25000
 */
export function calculatePositionValue(
  price: NumericValue,
  size: NumericValue
): BigNumber {
  return BigNumber(price).multipliedBy(size);
}

/**
 * 计算仓位所需保证金
 *
 * 保证金是开仓和维持仓位所需的抵押品。
 *
 * 公式：
 * ```
 * 保证金 = 仓位价值 / 杠杆
 *        = 价格 × 数量 / 杠杆
 * ```
 *
 * @example
 * calculateRequiredMargin("50000", "0.1", "10")
 * // 返回: 500（仓位价值 5000 / 10 倍杠杆）
 */
export function calculateRequiredMargin(
  price: NumericValue,
  size: NumericValue,
  leverage: NumericValue
): BigNumber {
  const positionValue = calculatePositionValue(price, size);
  return positionValue.dividedBy(leverage);
}
