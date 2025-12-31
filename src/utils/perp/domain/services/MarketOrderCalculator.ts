import BigNumber from "bignumber.js";
import { getNumberPrecision, toPrecisionString, toTickSizeRoundString } from "../../utils";
import { TYPE_triggerPrice } from "../constants/trade.constants";
import { OrderBasis, OrderType } from "../value-objects/OrderEnums";

/**
 * Market Order Calculator
 *
 * Provides utilities for calculating order quantities in Market Order component
 */
export class MarketOrderCalculator {
  /**
   * Calculate actual order size from order basis input
   *
   * This function converts user input (which could be in Size, Value, or Margin basis)
   * to actual order size for market order execution.
   *
   * @param orderSize - User input (could be size, value, or margin depending on orderBasis)
   * @param orderBasis - Current order basis type
   * @param lastPrice - Last price for calculation
   * @param sizePrecision - Size precision for formatting
   * @param maxLeverage - Maximum leverage
   * @returns Actual order size as string, or original orderSize if already in Size basis
   */
  static calculateActualSizeFromOrderBasis(
    orderSize: string,
    orderBasis: OrderBasis,
    lastPrice: number,
    sizePrecision: number,
    maxLeverage: number,
  ): string {
    // If already in Size basis, return as is
    if (orderBasis === OrderBasis.Size) {
      return orderSize;
    }

    const lastPriceNum = Number(lastPrice);
    if (!lastPriceNum || lastPriceNum <= 0) {
      return orderSize;
    }

    // Use OrderInputCalculator for consistency
    // Note: We need to handle the case where orderSize might be empty or invalid
    if (orderBasis === OrderBasis.Value) {
      // Match original logic: toPrecisionString(Number(orderSize) / lastPriceNum, sizePrecision)
      // OrderInputCalculator.deriveFromValue has additional validation that returns "" for empty values
      // For consistency with original behavior, we use direct calculation
      const orderSizeNum = Number(orderSize);
      if (!orderSizeNum || orderSizeNum <= 0) {
        return orderSize; // Return original value if invalid
      }
      return toPrecisionString(orderSizeNum / lastPriceNum, sizePrecision);
    }

    if (orderBasis === OrderBasis.Margin) {
      // From margin: actualSize = (margin * leverage) / price
      const leveragedValue = Number(orderSize) * Number(maxLeverage || 1);
      return toPrecisionString(leveragedValue / lastPriceNum, sizePrecision);
    }

    return orderSize;
  }

  /**
   * Calculate max value for Value/Margin basis
   *
   * @param maxSize - Maximum size
   * @param lastPrice - Last price
   * @returns Maximum value
   */
  static calculateMaxValue(maxSize: number | string, lastPrice: number): number {
    return Number(maxSize) * Number(lastPrice || 0);
  }

  /**
   * Calculate order size from rate percentage
   *
   * This function calculates the order size based on a percentage rate
   * of the maximum available size, considering the order basis.
   *
   * @param rate - Percentage rate (0-100)
   * @param orderBasis - Current order basis type
   * @param maxSize - Maximum size
   * @param lastPrice - Last price
   * @param pricePrecision - Price precision
   * @param sizePrecision - Size precision
   * @param sizeStep - Size step
   * @param maxLeverage - Maximum leverage
   * @returns Calculated order size as string
   */
  static calculateOrderSizeFromRate(
    rate: number,
    orderBasis: OrderBasis,
    maxSize: number | string,
    lastPrice: number,
    pricePrecision: number,
    sizePrecision: number,
    sizeStep: string,
    maxLeverage: number,
  ): string {
    if (orderBasis === OrderBasis.Value) {
      const maxValue = this.calculateMaxValue(maxSize, lastPrice);
      const targetValue = (rate * maxValue) / 100;
      return targetValue ? toPrecisionString(targetValue, pricePrecision) : "";
    }

    if (orderBasis === OrderBasis.Margin) {
      const maxValue = this.calculateMaxValue(maxSize, lastPrice);
      const targetValue = (rate * maxValue) / 100;
      const targetMargin = targetValue / Number(maxLeverage || 1);
      return targetMargin ? BigNumber(targetMargin).toFixed(2, BigNumber.ROUND_CEIL) : "";
    }

    // OrderBasis.Size
    const targetSize = (rate * Number(maxSize)) / 100;
    return maxSize ? toTickSizeRoundString(targetSize, sizeStep) : "";
  }

  /**
   * Build market order parameters
   *
   * @param params - Order parameters
   * @returns Market order parameters ready for submission
   */
  static buildMarketOrderParams(params: {
    side: string;
    actualSize: string;
    lastPrice: string | number;
    symbolInfo: {
      symbol?: string;
      contractId?: string;
      sizeStep?: string;
    };
  }) {
    const { side, actualSize, lastPrice, symbolInfo } = params;

    // Match original code: price and triggerPriceWithType should be the same type as lastPrice (not converted to string)
    // The original code passes lastPrice directly, so we preserve its type
    return {
      side,
      price: lastPrice, // Price is passed as last price for L2 signature, final order interface passes price as 0
      size: BigNumber(actualSize).toFixed(
        getNumberPrecision(symbolInfo.sizeStep || "0"),
        BigNumber.ROUND_DOWN,
      ),
      type: OrderType.MARKET as OrderType,
      timeInForce: "IMMEDIATE_OR_CANCEL",
      reduceOnly: false,
      symbol: symbolInfo?.symbol,
      contractId: symbolInfo?.contractId,
      isPositionTpsl: false,
      isSetOpenSl: false,
      isSetOpenTp: false,
      triggerPrice: "",
      triggerPriceType: TYPE_triggerPrice.LAST_PRICE,
      triggerPriceWithType: lastPrice,
    };
  }
}
