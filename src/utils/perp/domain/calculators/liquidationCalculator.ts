/**
 * 强平价计算器
 *
 * 计算仓位强平价格的纯函数。
 * 当仓位的保证金率低于维持保证金要求时，会触发强制平仓。
 */

import BigNumber from "bignumber.js";
import { getNumberPrecision } from "../../utils";
import type {
  SimpleLiquidationInput,
  TieredLiquidationInput,
  LiquidationResult,
  RiskTierInput,
  PositionSide,
  NumericValue,
  StarkExCollateralInfo,
  StarkExWorstClosePriceInput,
  StarkExLiquidationPriceInput,
} from "./types";

// 2^32 常量，用于 StarkEx 风险率转换
const STARK_EX_RISK_DIVISOR = BigNumber(2).pow(32);

/**
 * 使用固定维持保证金率计算强平价
 *
 * 当满足以下条件时触发强平：
 * ```
 * 账户权益 <= 维持保证金
 * ```
 *
 * 对于仓位，权益随价格变化：
 * ```
 * 多仓: 权益 = 抵押品 + (当前价格 - 开仓价格) × 数量
 * 空仓: 权益 = 抵押品 + (开仓价格 - 当前价格) × 数量
 * ```
 *
 * 强平条件：
 * ```
 * 权益 = 当前价格 × 数量 × 维持保证金率
 * ```
 *
 * 求解强平价：
 * ```
 * 多仓:
 *   抵押品 + (强平价 - 开仓价) × 数量 = 强平价 × 数量 × 维持保证金率
 *   强平价 = (抵押品 / 数量 - 开仓价) / (维持保证金率 - 1)
 *
 * 空仓:
 *   抵押品 + (开仓价 - 强平价) × 数量 = 强平价 × 数量 × 维持保证金率
 *   强平价 = (开仓价 + 抵押品 / 数量) / (1 + 维持保证金率)
 * ```
 *
 * @example
 * // 1 BTC 多仓，开仓价 $50,000，抵押品 $5,000，维持保证金率 1%
 * calculateSimpleLiquidationPrice({
 *   side: "LONG",
 *   entryPrice: "50000",
 *   size: "1",
 *   collateral: "5000",
 *   maintenanceMarginRate: "0.01"
 * })
 * // 返回约 $45,454
 */
export function calculateSimpleLiquidationPrice(input: SimpleLiquidationInput): BigNumber {
  const { side, entryPrice, size, collateral, maintenanceMarginRate } = input;

  const entry = BigNumber(entryPrice);
  const qty = BigNumber(size);
  const col = BigNumber(collateral);
  const mmr = BigNumber(maintenanceMarginRate);

  const isLong = side === "LONG";

  if (isLong) {
    // 强平价 = (抵押品 / 数量 - 开仓价) / (维持保证金率 - 1)
    const denominator = mmr.minus(1);

    // 防止除零或无效的维持保证金率
    if (denominator.isZero() || mmr.gte(1)) {
      return BigNumber(0);
    }

    const numerator = col.dividedBy(qty).minus(entry);
    return numerator.dividedBy(denominator);
  } else {
    // 强平价 = (开仓价 + 抵押品 / 数量) / (1 + 维持保证金率)
    const numerator = entry.plus(col.dividedBy(qty));
    const denominator = BigNumber(1).plus(mmr);
    return numerator.dividedBy(denominator);
  }
}

/**
 * 使用分档维持保证金率计算强平价
 *
 * 很多交易所使用分档保证金率，仓位越大要求的维持保证金率越高。
 * 此函数通过迭代找到正确的档位和强平价。
 *
 * 需要迭代的原因：
 * 1. 强平价影响仓位价值
 * 2. 仓位价值决定适用哪个档位
 * 3. 档位决定计算中使用的保证金率
 *
 * 算法：
 * 1. 用当前仓位价值确定初始档位
 * 2. 使用该档位的保证金率计算强平价
 * 3. 检查计算出的仓位价值是否仍在同一档位
 * 4. 如果不在，用新档位重新计算
 * 5. 重复直到收敛或达到最大迭代次数
 *
 * @example
 * calculateTieredLiquidationPrice({
 *   side: "LONG",
 *   entryPrice: "50000",
 *   size: "10",
 *   availableBalance: "50000",
 *   leverage: "10",
 *   riskTiers: [
 *     { positionValueUpperBound: "100000", maintenanceMarginRate: "0.005" },
 *     { positionValueUpperBound: "500000", maintenanceMarginRate: "0.01" },
 *     { positionValueUpperBound: "1000000", maintenanceMarginRate: "0.02" }
 *   ],
 *   pricePrecision: 2
 * })
 */
export function calculateTieredLiquidationPrice(input: TieredLiquidationInput): LiquidationResult {
  const {
    side,
    entryPrice,
    size,
    availableBalance,
    leverage,
    riskTiers,
    pricePrecision,
  } = input;

  const entry = BigNumber(entryPrice);
  const qty = BigNumber(size);
  const balance = BigNumber(availableBalance);
  const lev = BigNumber(leverage);

  // 初始仓位价值和保证金
  const positionValue = qty.multipliedBy(entry);
  const initialMargin = positionValue.dividedBy(lev);

  // 处理边界情况
  if (riskTiers.length === 0) {
    return {
      liquidationPrice: "",
      maintenanceMarginRate: "0",
      maintenanceMargin: "0",
      initialMargin: initialMargin.toFixed(2, BigNumber.ROUND_DOWN),
    };
  }

  const isLong = side === "LONG";
  const maxIterations = 10;

  let liquidationPrice = BigNumber(0);
  let finalMMR = BigNumber(0);
  let iterations = 0;

  while (iterations < maxIterations) {
    iterations++;

    // 确定用于查找档位的仓位价值
    const currentPositionValue =
      iterations === 1 ? positionValue : liquidationPrice.multipliedBy(qty);

    // 找到适用的档位
    const mmr = getMaintenanceMarginRate(currentPositionValue, riskTiers);

    // 计算新的强平价
    let newLiqPrice: BigNumber;

    if (isLong) {
      const numerator = balance.dividedBy(qty).minus(entry);
      const denominator = mmr.minus(1);

      if (denominator.isZero() || mmr.gte(1)) {
        newLiqPrice = BigNumber(0);
      } else {
        newLiqPrice = numerator.dividedBy(denominator);
      }
    } else {
      const numerator = entry.plus(balance.dividedBy(qty));
      const denominator = BigNumber(1).plus(mmr);
      newLiqPrice = numerator.dividedBy(denominator);
    }

    // 检查是否收敛
    if (iterations > 1) {
      const priceDiff = newLiqPrice.minus(liquidationPrice).abs();
      const priceChangeRatio = liquidationPrice.gt(0)
        ? priceDiff.dividedBy(liquidationPrice)
        : BigNumber(1);

      if (priceChangeRatio.lt(0.001) || mmr.eq(finalMMR)) {
        liquidationPrice = newLiqPrice;
        finalMMR = mmr;
        break;
      }
    }

    liquidationPrice = newLiqPrice;
    finalMMR = mmr;
  }

  // 确保非负
  const finalPrice = liquidationPrice.gt(0) ? liquidationPrice : BigNumber(0);

  // 计算强平时的维持保证金
  const finalPositionValue = finalPrice.multipliedBy(qty);
  const maintenanceMargin = finalPositionValue.multipliedBy(finalMMR);

  return {
    liquidationPrice: finalPrice.toFixed(pricePrecision, BigNumber.ROUND_DOWN),
    maintenanceMarginRate: finalMMR.toFixed(6, BigNumber.ROUND_DOWN),
    maintenanceMargin: maintenanceMargin.toFixed(2, BigNumber.ROUND_DOWN),
    initialMargin: initialMargin.toFixed(2, BigNumber.ROUND_DOWN),
    iterations,
  };
}

/**
 * 根据仓位价值从分档风险档位中获取维持保证金率
 *
 * 风险档位通常结构如下：
 * - 档位 1: 0 - 100,000 USD → 0.5% 维持保证金率
 * - 档位 2: 100,000 - 500,000 USD → 1% 维持保证金率
 * - 档位 3: 500,000+ USD → 2% 维持保证金率
 *
 * @param positionValue - 当前仓位价值
 * @param riskTiers - 排序后的风险档位数组
 * @returns 适用的维持保证金率
 */
export function getMaintenanceMarginRate(
  positionValue: NumericValue,
  riskTiers: RiskTierInput[]
): BigNumber {
  if (!riskTiers || riskTiers.length === 0) {
    return BigNumber(0.01); // 无档位时默认 1%
  }

  const value = BigNumber(positionValue).abs();

  for (const tier of riskTiers) {
    if (value.lte(tier.positionValueUpperBound)) {
      return BigNumber(tier.maintenanceMarginRate);
    }
  }

  // 仓位超过所有档位时返回最高档位的费率
  const lastTier = riskTiers[riskTiers.length - 1];
  return BigNumber(lastTier.maintenanceMarginRate);
}

/**
 * 计算仓位的保证金率（健康因子）
 *
 * 保证金率表示仓位距离强平的远近：
 * - 比率 > 1: 仓位安全
 * - 比率 = 1: 处于强平阈值
 * - 比率 < 1: 将被强平
 *
 * 公式：
 * ```
 * 保证金率 = 账户权益 / 维持保证金
 *
 * 其中：
 *   账户权益 = 抵押品 + 未实现盈亏
 *   维持保证金 = 仓位价值 × 维持保证金率
 * ```
 *
 * @example
 * // 200% 保证金率的仓位（安全）
 * calculateMarginRatio({
 *   collateral: "10000",
 *   unrealizedPnL: "0",
 *   positionValue: "100000",
 *   maintenanceMarginRate: "0.05"
 * })
 * // 返回: 2 (10000 / 5000)
 */
export function calculateMarginRatio(input: {
  collateral: NumericValue;
  unrealizedPnL: NumericValue;
  positionValue: NumericValue;
  maintenanceMarginRate: NumericValue;
}): BigNumber {
  const { collateral, unrealizedPnL, positionValue, maintenanceMarginRate } = input;

  const equity = BigNumber(collateral).plus(unrealizedPnL);
  const maintenanceMargin = BigNumber(positionValue)
    .abs()
    .multipliedBy(maintenanceMarginRate);

  if (maintenanceMargin.isZero()) {
    return BigNumber(Infinity);
  }

  return equity.dividedBy(maintenanceMargin);
}

/**
 * 计算距离强平的价格百分比
 *
 * 告诉交易者价格可以向不利方向移动多少
 * 百分比后才会触发强平。
 *
 * 公式：
 * ```
 * 多仓: 距离百分比 = (当前价格 - 强平价) / 当前价格 × 100%
 * 空仓: 距离百分比 = (强平价 - 当前价格) / 当前价格 × 100%
 * ```
 *
 * @example
 * calculateDistanceToLiquidation({
 *   side: "LONG",
 *   currentPrice: "50000",
 *   liquidationPrice: "45000"
 * })
 * // 返回: 10（距离强平 10%）
 */
export function calculateDistanceToLiquidation(input: {
  side: PositionSide;
  currentPrice: NumericValue;
  liquidationPrice: NumericValue;
}): BigNumber {
  const { side, currentPrice, liquidationPrice } = input;

  const current = BigNumber(currentPrice);
  const liq = BigNumber(liquidationPrice);

  if (current.isZero()) {
    return BigNumber(0);
  }

  const isLong = side === "LONG";

  if (isLong) {
    return current.minus(liq).dividedBy(current).multipliedBy(100);
  } else {
    return liq.minus(current).dividedBy(current).multipliedBy(100);
  }
}

// ============================================================================
// StarkEx 风险模型相关函数
// ============================================================================

/**
 * 根据仓位价值从风险档位获取 StarkEx 风险率
 *
 * StarkEx 风险率是一个原始整数，需要除以 2^32 转换为小数
 *
 * 注意：使用 [previous, current) 左闭右开区间，与原始 getRiskTier 逻辑一致
 */
export function getStarkExRiskRate(
  positionValue: NumericValue,
  riskTiers: RiskTierInput[]
): BigNumber {
  if (!riskTiers || riskTiers.length === 0) {
    return BigNumber(0);
  }

  const value = BigNumber(positionValue).abs();
  let previousUpperBound = BigNumber(0);

  for (const tier of riskTiers) {
    const currentUpperBound = BigNumber(tier.positionValueUpperBound || 0);

    // 使用 [previous, current) 区间，与原始 getRiskTier 一致
    if (previousUpperBound.lte(value) && value.lt(currentUpperBound)) {
      return BigNumber(tier.starkExRisk || 0).dividedBy(STARK_EX_RISK_DIVISOR);
    }

    previousUpperBound = currentUpperBound;
  }

  // 超出所有档位，返回 0（与原始行为一致：getRiskTier 返回 undefined）
  return BigNumber(0);
}

/**
 * 以固定 StarkEx 风险率计算强平价（内部辅助函数）
 */
function calculateLiquidatePriceInternal(input: {
  openSize: NumericValue;
  fixStarkExRiskRate: NumericValue;
  oraclePrice: NumericValue;
  totalEquity: NumericValue;
  starkExRiskValue: NumericValue;
  pricePrecision: number;
}): string {
  const { openSize, fixStarkExRiskRate, oraclePrice, totalEquity, starkExRiskValue, pricePrecision } = input;

  const size = BigNumber(openSize);
  const riskRate = BigNumber(fixStarkExRiskRate);
  const price = BigNumber(oraclePrice);
  const equity = BigNumber(totalEquity);
  const riskValue = BigNumber(starkExRiskValue);

  if (size.gt(0) && riskRate.lt(1)) {
    // 多仓
    return price
      .minus(
        equity.minus(riskValue).dividedBy(size.multipliedBy(BigNumber(1).minus(riskRate)))
      )
      .toFixed(pricePrecision, BigNumber.ROUND_CEIL);
  } else if (size.lt(0)) {
    // 空仓
    return price
      .minus(
        equity.minus(riskValue).dividedBy(size.multipliedBy(BigNumber(1).plus(riskRate)))
      )
      .toFixed(pricePrecision, BigNumber.ROUND_FLOOR);
  }

  return "0";
}

/**
 * 计算 StarkEx 最差平仓价
 *
 * 最差平仓价是平仓成交价格不能劣于这个价格的阈值。
 * 此价格确保平仓后账户风险不会恶化。
 *
 * 推导过程：
 * 1. 要求平仓后 afterTV / afterTR >= TV / TR（风险比不恶化）
 * 2. 要求平仓后 afterTV >= afterTR（账户权益 >= 风险价值）
 * 3. 取两个条件下的最差价格
 *
 * @param input 计算输入参数
 * @returns 最差平仓价（BigNumber）
 */
export function calculateStarkExWorstClosePrice(input: StarkExWorstClosePriceInput): BigNumber {
  const { oraclePrice, openSize, riskTiers, pricePrecision, collateralInfo, feeRate } = input;

  const {
    totalEquity: paramTotalEquity,
    starkExRiskValue,
    pendingWithdrawAmount,
    pendingTransferOutAmount,
  } = collateralInfo;

  // 扣除待处理金额后的实际可用权益
  const totalEquity = BigNumber(paramTotalEquity)
    .minus(pendingWithdrawAmount)
    .minus(pendingTransferOutAmount);

  const positionOpenSize = BigNumber(openSize);
  const fee = BigNumber(feeRate);

  // 计算当前仓位的 StarkEx 风险率
  const positionValue = positionOpenSize.multipliedBy(oraclePrice).abs();
  const starkExRiskRate = getStarkExRiskRate(positionValue, riskTiers);

  const cmpToZero = positionOpenSize.comparedTo(0);

  if (cmpToZero === null || cmpToZero === 0) {
    return BigNumber(0);
  }

  if (cmpToZero < 0) {
    // 空仓：买入平仓，s[k]_close > 0
    // closePrice1: 满足 afterTV/afterTR >= TV/TR
    const closePrice1 = totalEquity
      .multipliedBy(starkExRiskRate)
      .plus(starkExRiskValue)
      .multipliedBy(oraclePrice)
      .dividedBy(BigNumber(starkExRiskValue).multipliedBy(BigNumber(1).plus(fee)))
      .toFixed(pricePrecision, BigNumber.ROUND_FLOOR);

    // closePrice2: 满足 afterTV >= afterTR
    const closePrice2 = totalEquity
      .minus(starkExRiskValue)
      .plus(
        positionOpenSize
          .negated()
          .multipliedBy(oraclePrice)
          .multipliedBy(BigNumber(1).plus(starkExRiskRate))
      )
      .dividedBy(positionOpenSize.negated().multipliedBy(BigNumber(1).plus(fee)))
      .toFixed(pricePrecision, BigNumber.ROUND_FLOOR);

    return BigNumber.max(closePrice1, closePrice2);
  } else {
    // 多仓：卖出平仓，s[k]_close < 0
    // closePrice1: 满足 afterTV/afterTR >= TV/TR
    const closePrice1 = BigNumber(starkExRiskValue)
      .minus(totalEquity.multipliedBy(starkExRiskRate))
      .multipliedBy(oraclePrice)
      .dividedBy(BigNumber(starkExRiskValue).multipliedBy(BigNumber(1).minus(fee)))
      .toFixed(pricePrecision, BigNumber.ROUND_CEIL);

    // closePrice2: 满足 afterTV >= afterTR
    const closePrice2 = totalEquity
      .minus(starkExRiskValue)
      .plus(
        positionOpenSize
          .negated()
          .multipliedBy(oraclePrice)
          .multipliedBy(BigNumber(1).minus(starkExRiskRate))
      )
      .dividedBy(positionOpenSize.negated().multipliedBy(BigNumber(1).minus(fee)))
      .toFixed(pricePrecision, BigNumber.ROUND_CEIL);

    return BigNumber.min(closePrice1, closePrice2);
  }
}

/**
 * 计算 StarkEx 强平价（考虑分档）
 *
 * 遍历风险档位，找到适用的档位并计算强平价。
 * 多仓从高档位向低档位遍历，空仓从低档位向高档位遍历。
 *
 * @param input 计算输入参数
 * @returns 强平价字符串
 */
export function calculateStarkExLiquidationPrice(input: StarkExLiquidationPriceInput): string {
  const { oraclePrice, openSize, riskTiers, tickSize, collateralInfo } = input;

  const {
    totalEquity: paramTotalEquity,
    starkExRiskValue: collateralStarkExRiskValue,
    pendingWithdrawAmount,
    pendingTransferOutAmount,
  } = collateralInfo;

  const positionOpenSize = BigNumber(openSize);
  const pricePrecision = getNumberPrecision(String(tickSize));

  const collateralTotalEquity = BigNumber(paramTotalEquity)
    .minus(pendingWithdrawAmount)
    .minus(pendingTransferOutAmount);

  const positionValue = positionOpenSize.multipliedBy(oraclePrice);
  const positionStarkExRiskRate = getStarkExRiskRate(positionValue.abs(), riskTiers);
  const positionStarkExRiskValue = positionValue.abs().multipliedBy(positionStarkExRiskRate);

  if (positionOpenSize.gt(0)) {
    // 多仓：从高档位向低档位遍历
    if (!riskTiers || riskTiers.length === 0) {
      return "0";
    }

    for (let i = riskTiers.length - 1; i >= 0; i--) {
      const curRiskTier = riskTiers[i];
      const preRiskTier = riskTiers[i - 1];
      const startValue = preRiskTier ? BigNumber(preRiskTier.positionValueUpperBound) : BigNumber(0);
      const endValue = BigNumber(curRiskTier.positionValueUpperBound);
      const starkExRiskRate = BigNumber(curRiskTier.starkExRisk || 0).dividedBy(STARK_EX_RISK_DIVISOR);

      const liquidatePrice = calculateLiquidatePriceInternal({
        openSize: positionOpenSize,
        fixStarkExRiskRate: starkExRiskRate,
        oraclePrice,
        totalEquity: collateralTotalEquity,
        starkExRiskValue: BigNumber(collateralStarkExRiskValue)
          .minus(positionStarkExRiskValue)
          .plus(positionValue.abs().multipliedBy(starkExRiskRate)),
        pricePrecision,
      });

      const liquidatePositionValueAbs = BigNumber(liquidatePrice).multipliedBy(positionOpenSize).abs();

      if (liquidatePositionValueAbs.lte(startValue)) {
        continue;
      } else if (liquidatePositionValueAbs.lte(endValue)) {
        return liquidatePrice;
      } else {
        return endValue
          .dividedBy(positionOpenSize)
          .toFixed(pricePrecision, BigNumber.ROUND_FLOOR);
      }
    }
    return "0";
  } else if (positionOpenSize.lt(0)) {
    // 空仓：从低档位向高档位遍历
    if (!riskTiers || riskTiers.length === 0) {
      return calculateLiquidatePriceInternal({
        openSize: positionOpenSize,
        fixStarkExRiskRate: "1",
        oraclePrice,
        totalEquity: collateralTotalEquity,
        starkExRiskValue: collateralStarkExRiskValue,
        pricePrecision,
      });
    }

    for (let i = 0; i < riskTiers.length; i++) {
      const curRiskTier = riskTiers[i];
      const preRiskTier = riskTiers[i - 1];
      const startValue = preRiskTier ? BigNumber(preRiskTier.positionValueUpperBound) : BigNumber(0);
      const endValue = BigNumber(curRiskTier.positionValueUpperBound);
      const starkExRiskRate = BigNumber(curRiskTier.starkExRisk || 0).dividedBy(STARK_EX_RISK_DIVISOR);

      const liquidatePrice = calculateLiquidatePriceInternal({
        openSize: positionOpenSize,
        fixStarkExRiskRate: starkExRiskRate,
        oraclePrice,
        totalEquity: collateralTotalEquity,
        starkExRiskValue: BigNumber(collateralStarkExRiskValue)
          .minus(positionStarkExRiskValue)
          .plus(positionValue.abs().multipliedBy(starkExRiskRate)),
        pricePrecision,
      });

      const liquidatePositionValueAbs = BigNumber(liquidatePrice).multipliedBy(positionOpenSize).abs();

      if (liquidatePositionValueAbs.lte(startValue)) {
        let tmpPrice = startValue
          .dividedBy(positionOpenSize)
          .toFixed(pricePrecision, BigNumber.ROUND_CEIL);

        if (BigNumber(tmpPrice).multipliedBy(positionOpenSize).abs().eq(liquidatePositionValueAbs)) {
          tmpPrice = BigNumber(tmpPrice).plus(tickSize).toString();
        }
        return tmpPrice;
      } else if (liquidatePositionValueAbs.lte(endValue)) {
        return liquidatePrice;
      } else {
        continue;
      }
    }

    // 超出所有档位，使用 100% 风险率
    return calculateLiquidatePriceInternal({
      openSize: positionOpenSize,
      fixStarkExRiskRate: "1",
      oraclePrice,
      totalEquity: collateralTotalEquity,
      starkExRiskValue: collateralStarkExRiskValue,
      pricePrecision,
    });
  }

  return "0";
}
