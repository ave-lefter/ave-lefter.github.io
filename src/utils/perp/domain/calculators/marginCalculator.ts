/**
 * 保证金计算器
 *
 * 计算交易保证金和冻结金额的纯函数。
 * 这些计算是衍生品交易的基础，决定了开仓或维持仓位所需的抵押品数量。
 */

import BigNumber from "bignumber.js";
import type {
  OrderFrozenAmountInput,
  OrderMarginInput,
  MarginBreakdown,
  OrderbookLevel,
  NumericValue,
} from "./types";

/**
 * 计算开仓订单冻结金额
 *
 * 下开仓单时，交易所会冻结抵押品以覆盖：
 * 1. 潜在亏损：如果价格立即向不利方向移动的最大损失
 * 2. 初始保证金：基于杠杆的必需抵押品
 * 3. 手续费：订单成交时收取的费用
 *
 * 公式：
 * ```
 * 冻结金额 = 潜在亏损 + 初始保证金 + 手续费
 *
 * 其中：
 *   潜在亏损 = max(订单价值 - 数量 × 预言机价格, 0)
 *   初始保证金 = |数量| × 预言机价格 × 初始保证金率
 *   手续费 = |订单价值| × 手续费率
 * ```
 *
 * @example
 * // 以 $70,000 买入 1 BTC，10 倍杠杆，预言机价格 $69,000
 * calculateOpenOrderFrozenAmount({
 *   oraclePrice: "69000",
 *   initialMarginRate: "0.1",  // 1/10 杠杆
 *   size: "1",
 *   value: "70000",
 *   feeRate: "0.0005"
 * })
 * // 返回: 1000 (亏损) + 6900 (保证金) + 35 (手续费) = 7935
 */
export function calculateOpenOrderFrozenAmount(input: OrderFrozenAmountInput): BigNumber {
  const { oraclePrice, initialMarginRate, size, value, feeRate } = input;

  // 潜在亏损：订单价值与当前市值的差额
  // 只有当订单价格劣于预言机价格时才计入亏损
  const potentialLoss = BigNumber.max(
    BigNumber(value).minus(BigNumber(size).multipliedBy(oraclePrice)),
    0
  );

  // 初始保证金：基于仓位大小和杠杆的必需抵押品
  const initialMargin = BigNumber(size)
    .abs()
    .multipliedBy(oraclePrice)
    .multipliedBy(initialMarginRate);

  // 手续费：订单价值的百分比
  const fee = BigNumber(value).abs().multipliedBy(feeRate);

  return potentialLoss.plus(initialMargin).plus(fee);
}

/**
 * 计算平仓订单冻结金额
 *
 * 下平仓单时的计算有所不同，因为：
 * - 平仓会释放初始保证金（减少冻结金额）
 * - 但仍需考虑潜在亏损和手续费
 *
 * 公式：
 * ```
 * 冻结金额 = 潜在亏损 - 释放保证金 + 手续费
 *
 * 其中：
 *   潜在亏损 = 平仓价值 - 平仓数量 × 预言机价格
 *   释放保证金 = |平仓数量| × 预言机价格 × 初始保证金率
 *   手续费 = |平仓价值| × 手续费率
 * ```
 *
 * 注意：结果可能为负，表示净释放抵押品。
 *
 * @example
 * // 以 $70,000 卖出平仓 1 BTC 多仓，预言机价格 $69,000
 * calculateCloseOrderFrozenAmount({
 *   oraclePrice: "69000",
 *   initialMarginRate: "0.1",
 *   size: "-1",      // 卖出为负
 *   value: "-70000", // 卖出为负
 *   feeRate: "0.0005"
 * })
 */
export function calculateCloseOrderFrozenAmount(input: OrderFrozenAmountInput): BigNumber {
  const { oraclePrice, initialMarginRate, size, value, feeRate } = input;

  // 以订单价格平仓相对于预言机价格的潜在亏损
  const potentialLoss = BigNumber(value).minus(BigNumber(size).multipliedBy(oraclePrice));

  // 平仓释放的保证金
  const marginRelease = BigNumber(size)
    .abs()
    .multipliedBy(oraclePrice)
    .multipliedBy(initialMarginRate);

  // 手续费
  const fee = BigNumber(value).abs().multipliedBy(feeRate);

  return potentialLoss.minus(marginRelease).plus(fee);
}

/**
 * 计算新订单所需保证金及明细
 *
 * 提供保证金各组成部分的完整视图，
 * 适合在订单提交前向用户展示。
 *
 * 公式：
 * ```
 * 总保证金 = 潜在亏损 + 初始保证金 + 手续费
 *
 * 其中：
 *   订单价值 = 订单价格 × 数量
 *   潜在亏损 = max(订单价值 - 数量 × 预言机价格, 0)
 *   初始保证金 = |数量| × 预言机价格 × (1 / 杠杆)
 *   手续费 = |订单价值| × 手续费率
 * ```
 *
 * @example
 * calculateOrderMarginBreakdown({
 *   oraclePrice: "50000",
 *   orderPrice: "51000",
 *   size: "0.1",
 *   leverage: "20",
 *   feeRate: "0.0004"
 * })
 */
export function calculateOrderMarginBreakdown(input: OrderMarginInput): MarginBreakdown {
  const { oraclePrice, orderPrice, size, leverage, feeRate } = input;

  const sizeNum = BigNumber(size);
  const oraclePriceNum = BigNumber(oraclePrice);
  const orderPriceNum = BigNumber(orderPrice);

  // 订单价值
  const orderValue = orderPriceNum.multipliedBy(sizeNum);

  // 潜在亏损（只计入正差额）
  const potentialLoss = BigNumber.max(
    orderValue.minus(sizeNum.multipliedBy(oraclePriceNum)),
    0
  );

  // 基于杠杆的初始保证金
  const initialMarginRate = BigNumber(1).dividedBy(leverage);
  const initialMargin = sizeNum.abs().multipliedBy(oraclePriceNum).multipliedBy(initialMarginRate);

  // 手续费
  const fee = orderValue.abs().multipliedBy(feeRate);

  // 总计
  const totalMargin = potentialLoss.plus(initialMargin).plus(fee);

  return {
    orderValue: orderValue.toString(),
    potentialLoss: potentialLoss.toString(),
    initialMargin: initialMargin.toString(),
    fee: fee.toString(),
    totalMargin: totalMargin.toString(),
  };
}

/**
 * 根据杠杆计算初始保证金率
 *
 * 公式：
 * ```
 * 初始保证金率 = 1 / 杠杆
 * ```
 *
 * @example
 * calculateInitialMarginRate(10)  // 返回 0.1 (10%)
 * calculateInitialMarginRate(20)  // 返回 0.05 (5%)
 */
export function calculateInitialMarginRate(leverage: NumericValue): BigNumber {
  return BigNumber(1).dividedBy(leverage);
}

/**
 * 计算市价单的加权平均执行价格
 *
 * 市价单会跨多个订单簿档位成交。
 * 此函数根据可用流动性计算预期平均成交价。
 *
 * 公式：
 * ```
 * 平均价格 = 总价值 / 总数量
 *
 * 其中：
 *   总价值 = Σ(成交数量[i] × 价格[i])
 *   总数量 = Σ(成交数量[i])
 * ```
 *
 * 如果订单簿深度不足，剩余数量使用兜底价格。
 *
 * @example
 * calculateMarketOrderPrice({
 *   size: "10",
 *   side: "BUY",
 *   orderbook: [
 *     { price: "100", size: "5" },
 *     { price: "101", size: "10" }
 *   ],
 *   fallbackPrice: "102",
 *   slippageBuffer: 0.01
 * })
 */
export function calculateMarketOrderPrice(input: {
  size: NumericValue;
  side: "BUY" | "SELL";
  orderbook: OrderbookLevel[];
  fallbackPrice: NumericValue;
  slippageBuffer?: number;
}): BigNumber {
  const { size, side, orderbook, fallbackPrice, slippageBuffer = 0 } = input;

  if (!orderbook || orderbook.length === 0) {
    return BigNumber(fallbackPrice);
  }

  let remainingSize = BigNumber(size).abs();
  let totalValue = BigNumber(0);

  // 卖单需要从最高买价开始遍历
  // 买单从最低卖价开始遍历
  const levels = side === "SELL" ? [...orderbook].reverse() : orderbook;

  for (const level of levels) {
    if (remainingSize.lte(0)) break;

    const levelSize = BigNumber(level.size);
    const levelPrice = BigNumber(level.price);

    const fillSize = BigNumber.min(remainingSize, levelSize);
    totalValue = totalValue.plus(fillSize.multipliedBy(levelPrice));
    remainingSize = remainingSize.minus(fillSize);
  }

  // 剩余未成交部分使用兜底价格
  if (remainingSize.gt(0)) {
    totalValue = totalValue.plus(remainingSize.multipliedBy(fallbackPrice));
  }

  // 应用滑点缓冲到最终价格
  const avgPrice = totalValue.dividedBy(BigNumber(size).abs());
  const slippageMultiplier = BigNumber(1).plus(slippageBuffer);

  return avgPrice.dividedBy(slippageMultiplier);
}
