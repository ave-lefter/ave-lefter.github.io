import BigNumber from "bignumber.js";
import { RiskTier } from "../entities/RiskTier";


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
  static calculatePnl(params: {
    side: string;
    entryPrice: string | number;
    exitPrice: string | number;
    size: string | number;
  }): BigNumber {
    const { side, entryPrice, exitPrice, size } = params;
    const entry = new BigNumber(entryPrice);
    const exit = new BigNumber(exitPrice);
    const qty = new BigNumber(size);

    const isLong = side.toUpperCase() === "LONG" || side.toUpperCase() === "BUY";

    if (isLong) {
      return exit.minus(entry).multipliedBy(qty);
    } else {
      return entry.minus(exit).multipliedBy(qty);
    }
  }

  /**
   * 计算盈亏
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

    const openPriceBN = BigNumber(openPrice);
    const quantityBN = BigNumber(quantity);
    const leverageBN = BigNumber(leverage);

    // 1. 保证金计算：开仓价格 * 数量 / 杠杆
    const margin = openPriceBN.multipliedBy(quantityBN).dividedBy(leverageBN);

    // 2. 收益额计算
    const profitAmount = this.calculatePnl({
      side,
      entryPrice: openPrice,
      exitPrice: closePrice,
      size: quantity,
    });

    // 3. 收益率计算
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
   * 计算目标价格
   */
  static calculateTargetPrice(params: CalculateTargetPriceParams) {
    const { side, leverage, openPrice, quantity, profit, profitType } = params;

    if (profitType === "rate") {
      if (!openPrice || !profit || !leverage) return { closePrice: "0" };
    }
    if (profitType === "amount") {
      if (!openPrice || !quantity || !profit || !leverage) return { closePrice: "0" };
    }

    const openPriceBN = BigNumber(openPrice);
    const quantityBN = BigNumber(quantity);
    const profitBN = BigNumber(profit);
    const leverageBN = BigNumber(leverage);

    let closePrice;

    if (profitType === "rate") {
      const profitRatio = profitBN.dividedBy(100);
      if (side === "long") {
        closePrice = openPriceBN.multipliedBy(
          BigNumber(1).plus(profitRatio.dividedBy(leverageBN)),
        );
      } else {
        closePrice = openPriceBN.multipliedBy(
          BigNumber(1).minus(profitRatio.dividedBy(leverageBN)),
        );
      }
    } else {
      if (side === "long") {
        closePrice = profitBN.dividedBy(quantityBN).plus(openPriceBN);
      } else {
        closePrice = openPriceBN.minus(profitBN.dividedBy(quantityBN));
      }
    }

    return {
      closePrice: closePrice.toFixed(2, BigNumber.ROUND_DOWN),
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

  static calculateAveragePrice(positionSizeList: Array<{ openPrice: string; quantity: string }>) {
    if (!positionSizeList || !Array.isArray(positionSizeList) || positionSizeList.length === 0) {
      return { avgPrice: "" };
    }

    let totalValue = BigNumber(0);
    let totalQuantity = BigNumber(0);

    positionSizeList.forEach((position) => {
      const { openPrice, quantity } = position;
      if (!openPrice || !quantity || openPrice === "0" || quantity === "0") {
        return;
      }
      const openPriceBN = BigNumber(openPrice);
      const quantityBN = BigNumber(quantity);
      const positionValue = openPriceBN.multipliedBy(quantityBN);

      totalValue = totalValue.plus(positionValue);
      totalQuantity = totalQuantity.plus(quantityBN);
    });

    const avgPrice = totalQuantity.gt(0) ? totalValue.dividedBy(totalQuantity) : BigNumber(0);

    return {
      avgPrice: avgPrice.toFixed(2, BigNumber.ROUND_DOWN),
    };
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
