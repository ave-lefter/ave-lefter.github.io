import BigNumber from "bignumber.js";
import { RiskTier } from "../entities/RiskTier";
import {
  calculateUnrealizedPnL,
  calculateProfit as calcProfit,
  calculateTargetPrice as calcTargetPrice,
  calculateAveragePrice as calcAvgPrice,
  type PositionSide,
} from "../calculators";


export interface CalculateProfitParams {
  side: "long" | "short";
  leverage: string | number;
  openPrice: string | number;
  closePrice: string | number;
  quantity: string | number;
}

export interface CalculateTargetPriceParams {
  side: "long" | "short";
  leverage: string | number;
  openPrice: string | number;
  quantity: string | number;
  profit: string | number;
  profitType: "amount" | "rate";
}

export interface CalculateLiquidationPriceParams {
  side: "long" | "short";
  leverage: string | number;
  openPrice: string | number;
  quantity: string | number;
  availableBalance: string | number;
  riskTierList: RiskTier[];
  pricePrecision: number;
}

export class TradeCalculatorService {
  /**
   * 计算盈亏金额
   * 委托给 calculator 的纯函数
   */
  static calculatePnl(params: {
    side: string;
    entryPrice: string | number;
    exitPrice: string | number;
    size: string | number;
  }): BigNumber {
    const { side, entryPrice, exitPrice, size } = params;
    const isLong = side.toUpperCase() === "LONG" || side.toUpperCase() === "BUY";
    const positionSide: PositionSide = isLong ? "LONG" : "SHORT";

    return calculateUnrealizedPnL({
      side: positionSide,
      entryPrice: String(entryPrice),
      markPrice: String(exitPrice),
      size: String(size),
    });
  }

  /**
   * 计算盈亏（含保证金和收益率）
   * 委托给 calculator 的纯函数
   */
  static calculateProfit(params: CalculateProfitParams) {
    const { side, leverage, openPrice, closePrice, quantity } = params;

    if (!openPrice || !closePrice || !quantity || !leverage) {
      return {
        margin: "0",
        profitAmount: "0",
        profitRate: "0",
      };
    }

    const positionSide: PositionSide = side === "long" ? "LONG" : "SHORT";
    const result = calcProfit({
      side: positionSide,
      entryPrice: String(openPrice),
      exitPrice: String(closePrice),
      size: String(quantity),
      leverage: String(leverage),
    });

    // calcProfit 返回的已经是格式化的字符串，但为了保持接口兼容性，再次格式化
    return {
      margin: BigNumber(result.margin).toFixed(2, BigNumber.ROUND_DOWN),
      profitAmount: BigNumber(result.profitAmount).toFixed(2, BigNumber.ROUND_DOWN),
      profitRate: BigNumber(result.profitRate).toFixed(2, BigNumber.ROUND_DOWN),
    };
  }

  /**
   * 计算目标价格
   * 委托给 calculator 的纯函数
   */
  static calculateTargetPrice(params: CalculateTargetPriceParams) {
    const { side, leverage, openPrice, quantity, profit, profitType } = params;

    if (profitType === "rate") {
      if (!openPrice || !profit || !leverage) return { closePrice: "0" };
    }
    if (profitType === "amount") {
      if (!openPrice || !quantity || !profit || !leverage) return { closePrice: "0" };
    }

    const positionSide: PositionSide = side === "long" ? "LONG" : "SHORT";
    const result = calcTargetPrice({
      side: positionSide,
      entryPrice: String(openPrice),
      size: String(quantity),
      leverage: String(leverage),
      targetProfit: String(profit),
      profitType,
    });

    return {
      closePrice: result.toFixed(2, BigNumber.ROUND_DOWN),
    };
  }

  private static getMaintenanceMarginRate(positionValue: BigNumber, riskTierList: RiskTier[]) {
    if (!riskTierList || riskTierList.length === 0) {
      return BigNumber(0.01);
    }
    const riskTier = RiskTier.findByValue(positionValue.toNumber(), riskTierList);
    if (riskTier && riskTier.maintenanceMarginRate) {
      return BigNumber(riskTier.maintenanceMarginRate);
    }
    return BigNumber(0.01);
  }

  /**
   * 计算强平价格 (迭代法)
   */
  static calculateLiquidationPrice(params: CalculateLiquidationPriceParams) {
    const { side, leverage, openPrice, quantity, availableBalance, riskTierList, pricePrecision } = params;

    if (!openPrice || !quantity || !availableBalance || !leverage) {
      return { liquidationPrice: "" };
    }

    const openPriceBN = BigNumber(openPrice);
    const quantityBN = BigNumber(quantity);
    const availableBalanceBN = BigNumber(availableBalance);

    // 初始保证金
    const positionValue = quantityBN.multipliedBy(openPriceBN);
    const initialMargin = positionValue.dividedBy(leverage);

    let liquidationPrice = BigNumber(0);
    let finalMaintenanceMarginRate = BigNumber(0);
    let iterations = 0;
    const maxIterations = 10;

    while (iterations < maxIterations) {
      iterations++;

      let currentPositionValue;
      if (iterations === 1) {
        currentPositionValue = positionValue;
      } else {
        currentPositionValue = liquidationPrice.multipliedBy(quantityBN);
      }

      const maintenanceMarginRate = this.getMaintenanceMarginRate(
        currentPositionValue,
        riskTierList,
      );

      let newLiquidationPrice;
      if (side === "long") {
        const numerator = availableBalanceBN.dividedBy(quantityBN).minus(openPriceBN);
        const denominator = maintenanceMarginRate.minus(1);

        if (denominator.eq(0) || maintenanceMarginRate.gte(1)) {
          newLiquidationPrice = BigNumber(0);
        } else {
          newLiquidationPrice = numerator.dividedBy(denominator);
        }
      } else {
        const numerator = openPriceBN.plus(availableBalanceBN.dividedBy(quantityBN));
        const denominator = BigNumber(1).plus(maintenanceMarginRate);
        newLiquidationPrice = numerator.dividedBy(denominator);
      }

      if (iterations > 1) {
        const priceDiff = newLiquidationPrice.minus(liquidationPrice).abs();
        const priceChangeRatio = liquidationPrice.gt(0)
          ? priceDiff.dividedBy(liquidationPrice)
          : BigNumber(1);

        if (priceChangeRatio.lt(0.001) || maintenanceMarginRate.eq(finalMaintenanceMarginRate)) {
          liquidationPrice = newLiquidationPrice;
          finalMaintenanceMarginRate = maintenanceMarginRate;
          break;
        }
      }

      liquidationPrice = newLiquidationPrice;
      finalMaintenanceMarginRate = maintenanceMarginRate;
    }

    const finalPrice = liquidationPrice.gt(0) ? liquidationPrice : BigNumber(0);
    const finalPositionValue = finalPrice.multipliedBy(quantityBN);
    const maintenanceMargin = finalPositionValue.multipliedBy(finalMaintenanceMarginRate);

    return {
      liquidationPrice: finalPrice.toFixed(pricePrecision, BigNumber.ROUND_DOWN),
      maintenanceMarginRate: finalMaintenanceMarginRate.toFixed(6, BigNumber.ROUND_DOWN),
      maintenanceMargin: maintenanceMargin.toFixed(2, BigNumber.ROUND_DOWN),
      initialMargin: initialMargin.toFixed(2, BigNumber.ROUND_DOWN),
      iterations,
    };
  }

  /**
   * 计算加权平均价格
   * 委托给 calculator 的纯函数
   */
  static calculateAveragePrice(positionSizeList: Array<{ openPrice: string; quantity: string }>) {
    if (!positionSizeList || !Array.isArray(positionSizeList) || positionSizeList.length === 0) {
      return { avgPrice: "" };
    }

    // 转换为 calculator 期望的格式，过滤无效数据
    const entries = positionSizeList
      .filter((p) => p.openPrice && p.quantity && p.openPrice !== "0" && p.quantity !== "0")
      .map((p) => ({ price: p.openPrice, quantity: p.quantity }));

    // 所有数据无效时，保持原有行为返回 "0.00"
    if (entries.length === 0) {
      return { avgPrice: "0.00" };
    }

    const avgPrice = calcAvgPrice(entries, 2);

    return { avgPrice };
  }

  static validateAvailableBalance(params: {
    availableBalance: string | number;
    leverage: string | number;
    openPrice: string | number;
    quantity: string | number;
  }): boolean {
    const { availableBalance, leverage, openPrice, quantity } = params;
    if (!availableBalance || !leverage || !openPrice || !quantity) {
      return false;
    }

    try {
      const positionValue = BigNumber(openPrice).multipliedBy(quantity);
      const requiredMargin = positionValue.dividedBy(leverage);

      return BigNumber(availableBalance).lt(requiredMargin);
    } catch (error) {
      return false;
    }
  }
}
