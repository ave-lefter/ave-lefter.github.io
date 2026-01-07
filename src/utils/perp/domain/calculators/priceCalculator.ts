/**
 * 价格计算器
 *
 * 计算交易价格的纯函数，包括：
 * - 止盈/止损触发价格
 * - 平均开仓价格
 * - 价格转换和处理
 */

import BigNumber from "bignumber.js";
import type {
  TPSLFromROEInput,
  ROEFromPriceInput,
  AveragePriceEntry,
  PositionSide,
  NumericValue,
} from "./types";

/**
 * 根据目标 ROE 计算止盈止损触发价
 *
 * 给定期望的权益回报率，计算 TP/SL 订单应该触发的价格。
 * ROE 始终为正值，通过 isTakeProfit 参数区分止盈/止损。
 *
 * 金融逻辑：
 * ```
 * ROE = PnL / 保证金 × 100%
 * PnL = 价格变动 × 数量 × 方向
 * 保证金 = 开仓价 × 数量 / 杠杆
 *
 * 因此：价格变动率 = ROE / 100 / 杠杆
 * ```
 *
 * 公式：
 * ```
 * 价格变动 = 开仓价格 × ROE / 100 / 杠杆
 *
 * 多仓 (LONG):
 *   止盈: 价格上涨盈利 → 触发价 = 开仓价 + 价格变动
 *   止损: 价格下跌亏损 → 触发价 = 开仓价 - 价格变动
 *
 * 空仓 (SHORT):
 *   止盈: 价格下跌盈利 → 触发价 = 开仓价 - 价格变动
 *   止损: 价格上涨亏损 → 触发价 = 开仓价 + 价格变动
 * ```
 *
 * @example
 * // 多仓止盈，10 倍杠杆，目标 50% ROE
 * calculateTPSLTriggerPrice({
 *   entryPrice: "50000",
 *   roe: "50",          // 正值
 *   leverage: "10",
 *   positionSide: "LONG",
 *   isTakeProfit: true,
 *   pricePrecision: 2
 * })
 * // 返回: "52500"（价格上涨 5% = 50% ROE / 10x）
 *
 * @example
 * // 多仓止损，10 倍杠杆，最大亏损 25% ROE
 * calculateTPSLTriggerPrice({
 *   entryPrice: "50000",
 *   roe: "25",          // 正值，表示亏损幅度
 *   leverage: "10",
 *   positionSide: "LONG",
 *   isTakeProfit: false,
 *   pricePrecision: 2
 * })
 * // 返回: "48750"（价格下跌 2.5% = -25% ROE / 10x）
 */
export function calculateTPSLTriggerPrice(input: {
  entryPrice: NumericValue;
  roe: NumericValue;
  leverage: NumericValue;
  positionSide: PositionSide;
  isTakeProfit: boolean;
  pricePrecision: number;
}): string {
  const { entryPrice, roe, leverage, positionSide, isTakeProfit, pricePrecision } = input;

  const entry = BigNumber(entryPrice);
  const targetROE = BigNumber(roe);
  const lev = BigNumber(leverage);

  // 价格变动比例 = ROE / 100 / 杠杆
  const priceChangeRatio = targetROE.dividedBy(100).dividedBy(lev);
  const priceChange = entry.multipliedBy(priceChangeRatio);

  const isLong = positionSide === "LONG";

  // 根据仓位方向和 TP/SL 类型确定价格变动方向
  // 多仓: 止盈价格上涨(+), 止损价格下跌(-)
  // 空仓: 止盈价格下跌(-), 止损价格上涨(+)
  let triggerPrice: BigNumber;

  if (isLong) {
    triggerPrice = isTakeProfit
      ? entry.plus(priceChange)   // 多仓止盈: 价格上涨
      : entry.minus(priceChange); // 多仓止损: 价格下跌
  } else {
    triggerPrice = isTakeProfit
      ? entry.minus(priceChange)  // 空仓止盈: 价格下跌
      : entry.plus(priceChange);  // 空仓止损: 价格上涨
  }

  // 负价格无效，返回 0
  // 注意：使用 lt(0) 而非 lte(0)，保持与原始逻辑一致
  if (triggerPrice.lt(0)) {
    return "0";
  }

  return triggerPrice.toFixed(pricePrecision);
}

/**
 * 根据目标 ROE 计算止盈止损触发价（兼容旧接口）
 *
 * @deprecated 请使用 calculateTPSLTriggerPrice，它有更清晰的语义
 *
 * 注意：此函数的 direction 逻辑：
 * - BUY 订单 (平空仓): direction = +1
 * - SELL 订单 (平多仓): direction = -1
 * - 止损场景需要调用方传入负的 ROE
 */
export function calculateTPSLPriceFromROE(input: TPSLFromROEInput): string {
  const { entryPrice, roe, leverage, orderSide, pricePrecision } = input;

  const entry = BigNumber(entryPrice);
  const targetROE = BigNumber(roe);
  const lev = BigNumber(leverage);

  // 兼容原始逻辑：BUY = +1, SELL = -1
  // 调用方需要为止损传入负的 ROE
  const direction = orderSide === "BUY" ? 1 : -1;

  const priceChangeRatio = targetROE.dividedBy(100).dividedBy(lev);

  const triggerPrice = entry.multipliedBy(
    BigNumber(1).plus(priceChangeRatio.multipliedBy(direction))
  );

  if (triggerPrice.lt(0)) {
    return "0";
  }

  return triggerPrice.toFixed(pricePrecision);
}

/**
 * 根据止盈止损触发价计算 ROE
 *
 * 这是 calculateTPSLPriceFromROE 的逆运算。
 *
 * 公式：
 * ```
 * 价格变动比例 = (触发价 - 开仓价) / 开仓价
 * ROE = 价格变动比例 × 杠杆 × 100% × 方向
 *
 * 其中方向：
 *   止盈: 多仓 +1，空仓 -1
 *   止损: 多仓 -1，空仓 +1
 * ```
 *
 * @example
 * // $50,000 多仓 10 倍杠杆，$52,500 止盈代表多少 ROE？
 * calculateROEFromPrice({
 *   entryPrice: "50000",
 *   triggerPrice: "52500",
 *   leverage: "10",
 *   positionSide: "LONG",
 *   isTakeProfit: true
 * })
 * // 返回: "50"（50% ROE）
 */
export function calculateROEFromPrice(input: ROEFromPriceInput): string | null {
  const { entryPrice, triggerPrice, leverage, positionSide, isTakeProfit } = input;

  const entry = BigNumber(entryPrice);
  const trigger = BigNumber(triggerPrice);
  const lev = BigNumber(leverage);

  if (entry.isZero() || lev.isZero()) {
    return null;
  }

  const isLong = positionSide === "LONG";

  // 计算价格变动比例
  const priceChangeRatio = trigger.minus(entry).dividedBy(entry);

  // 根据仓位方向和 TP/SL 类型计算 ROE
  let roe: BigNumber;

  if (isTakeProfit) {
    // 止盈：多仓价格上涨盈利，空仓价格下跌盈利
    if (isLong) {
      roe = priceChangeRatio.multipliedBy(lev).multipliedBy(100);
    } else {
      roe = priceChangeRatio.negated().multipliedBy(lev).multipliedBy(100);
    }
  } else {
    // 止损：多仓价格下跌亏损，空仓价格上涨亏损
    if (isLong) {
      roe = priceChangeRatio.negated().multipliedBy(lev).multipliedBy(100);
    } else {
      roe = priceChangeRatio.multipliedBy(lev).multipliedBy(100);
    }
  }

  // 有效的 TP/SL 应该有正的 ROE
  return roe.gt(0) ? roe.toFixed(2) : null;
}

/**
 * 计算在给定触发价的预估盈亏金额
 *
 * 公式：
 * ```
 * 多仓: PnL = (触发价 - 开仓价) × 数量
 * 空仓: PnL = (开仓价 - 触发价) × 数量
 * ```
 *
 * 止盈预期 PnL > 0
 * 止损预期 PnL < 0（返回绝对值）
 *
 * @example
 * calculatePnLAtPrice({
 *   entryPrice: "50000",
 *   triggerPrice: "55000",
 *   size: "1",
 *   side: "LONG",
 *   isTakeProfit: true
 * })
 * // 返回: "5000"
 */
export function calculatePnLAtPrice(input: {
  entryPrice: NumericValue;
  triggerPrice: NumericValue;
  size: NumericValue;
  side: PositionSide;
  isTakeProfit: boolean;
  precision?: number;
}): string | null {
  const { entryPrice, triggerPrice, size, side, isTakeProfit, precision = 2 } = input;

  const entry = BigNumber(entryPrice);
  const trigger = BigNumber(triggerPrice);
  const qty = BigNumber(size);

  const isLong = side === "LONG";
  const direction = isLong ? 1 : -1;

  // PnL = (触发价 - 开仓价) × 数量 × 方向
  const pnl = trigger.minus(entry).multipliedBy(direction).multipliedBy(qty);

  if (isTakeProfit) {
    // 止盈预期正盈亏
    return pnl.gt(0) ? pnl.toFixed(precision) : null;
  } else {
    // 止损预期负盈亏，返回绝对值
    return pnl.lt(0) ? pnl.abs().toFixed(precision) : null;
  }
}

/**
 * 根据目标盈亏金额计算触发价
 *
 * 公式：
 * ```
 * 多仓: 触发价 = 开仓价 + (盈亏金额 / 数量)
 * 空仓: 触发价 = 开仓价 - (盈亏金额 / 数量)
 * ```
 *
 * 对于止损，输入金额为正（你愿意接受的亏损），
 * 但内部作为负盈亏处理。
 *
 * @example
 * // 1 BTC 多仓，想在盈利 $5000 时止盈，价格是多少？
 * calculatePriceFromPnL({
 *   entryPrice: "50000",
 *   pnlAmount: "5000",
 *   size: "1",
 *   side: "LONG",
 *   isTakeProfit: true
 * })
 * // 返回: "55000"
 */
export function calculatePriceFromPnL(input: {
  entryPrice: NumericValue;
  pnlAmount: NumericValue;
  size: NumericValue;
  side: PositionSide;
  isTakeProfit: boolean;
  precision?: number;
}): string {
  const { entryPrice, pnlAmount, size, side, isTakeProfit, precision = 2 } = input;

  const entry = BigNumber(entryPrice);
  const amount = BigNumber(pnlAmount);
  const qty = BigNumber(size);

  if (qty.isZero()) {
    return "0";
  }

  const isLong = side === "LONG";

  // 止损金额代表亏损（负盈亏）
  const actualPnL = isTakeProfit ? amount : amount.negated();

  // 计算价格变动
  const priceChange = actualPnL.dividedBy(qty);

  // 根据仓位方向应用价格变动
  let triggerPrice: BigNumber;
  if (isLong) {
    triggerPrice = entry.plus(priceChange);
  } else {
    triggerPrice = entry.minus(priceChange);
  }

  if (triggerPrice.lte(0)) {
    return "0";
  }

  return triggerPrice.toFixed(precision);
}

/**
 * 计算成交量加权平均价格（VWAP）
 *
 * 当仓位通过多笔交易建立时，用于计算平均开仓价格。
 *
 * 公式：
 * ```
 * 平均价格 = Σ(价格[i] × 数量[i]) / Σ(数量[i])
 * ```
 *
 * @example
 * calculateAveragePrice([
 *   { price: "50000", quantity: "1" },
 *   { price: "51000", quantity: "2" }
 * ])
 * // 返回: "50666.67"（加权平均）
 */
export function calculateAveragePrice(
  entries: AveragePriceEntry[],
  precision: number = 2
): string {
  if (!entries || entries.length === 0) {
    return "0";
  }

  let totalValue = BigNumber(0);
  let totalQuantity = BigNumber(0);

  for (const entry of entries) {
    const price = BigNumber(entry.price);
    const qty = BigNumber(entry.quantity);

    // 注意：不在此处检查 price.isZero()，保持与原始 TradeCalculatorService 一致
    // 原始代码只检查字符串 "0"，不检查数值 0 或 "0.00"
    totalValue = totalValue.plus(price.multipliedBy(qty));
    totalQuantity = totalQuantity.plus(qty);
  }

  if (totalQuantity.isZero()) {
    return "0";
  }

  return totalValue.dividedBy(totalQuantity).toFixed(precision, BigNumber.ROUND_DOWN);
}

/**
 * 计算买卖价差的中间价
 *
 * 当确切成交价未知时，中间价常用作参考价格。
 *
 * 公式：
 * ```
 * 中间价 = (买价 + 卖价) / 2
 * ```
 *
 * @example
 * calculateMidPrice("49990", "50010")
 * // 返回: 50000
 */
export function calculateMidPrice(
  bid: NumericValue,
  ask: NumericValue
): BigNumber {
  return BigNumber(bid).plus(ask).dividedBy(2);
}

/**
 * 检查买卖价差是否过大
 *
 * 价差过大表示流动性不足，可能有滑点风险。
 *
 * 公式：
 * ```
 * 价差百分比 = (卖价 - 买价) / 中间价 × 100%
 * 过大 = 价差百分比 > 阈值
 * ```
 *
 * @example
 * isSpreadTooWide("99", "101", 5)
 * // 返回: false（2% 价差 < 5% 阈值）
 */
export function isSpreadTooWide(
  bid: NumericValue,
  ask: NumericValue,
  thresholdPercent: number = 5
): boolean {
  const bidNum = BigNumber(bid);
  const askNum = BigNumber(ask);

  if (bidNum.isZero() || askNum.isZero()) {
    return true;
  }

  const mid = calculateMidPrice(bid, ask);
  const spread = askNum.minus(bidNum);
  const spreadPercent = spread.dividedBy(mid).multipliedBy(100);

  return spreadPercent.gt(thresholdPercent);
}

/**
 * 将价格按最小价格单位取整
 *
 * 交易所要求价格符合最小价格单位。
 * 此函数将价格取整到最近的有效价格。
 *
 * @example
 * roundToTickSize("50001.23", "0.5", "floor")
 * // 返回: "50001.0"
 */
export function roundToTickSize(
  price: NumericValue,
  tickSize: NumericValue,
  roundingMode: "floor" | "ceil" | "round" = "round"
): string {
  const priceNum = BigNumber(price);
  const tick = BigNumber(tickSize);

  if (tick.isZero()) {
    return priceNum.toString();
  }

  const divided = priceNum.dividedBy(tick);

  let rounded: BigNumber;
  switch (roundingMode) {
    case "floor":
      rounded = divided.integerValue(BigNumber.ROUND_FLOOR);
      break;
    case "ceil":
      rounded = divided.integerValue(BigNumber.ROUND_CEIL);
      break;
    default:
      rounded = divided.integerValue(BigNumber.ROUND_HALF_UP);
  }

  return rounded.multipliedBy(tick).toString();
}

/**
 * 计算市价单的价格冲击
 *
 * 价格冲击衡量由于订单大小导致的成交价格
 * 与当前市场价格的偏离程度。
 *
 * 公式：
 * ```
 * 价格冲击 = |成交价格 - 参考价格| / 参考价格 × 100%
 * ```
 *
 * @example
 * calculatePriceImpact("50500", "50000")
 * // 返回: 1（1% 价格冲击）
 */
export function calculatePriceImpact(
  executionPrice: NumericValue,
  referencePrice: NumericValue
): BigNumber {
  const exec = BigNumber(executionPrice);
  const ref = BigNumber(referencePrice);

  if (ref.isZero()) {
    return BigNumber(0);
  }

  return exec.minus(ref).abs().dividedBy(ref).multipliedBy(100);
}
