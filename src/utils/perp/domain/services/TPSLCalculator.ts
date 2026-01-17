/**
 * TPSLCalculator
 *
 * Calculates Take Profit and Stop Loss prices.
 * Pure calculation logic for TP/SL related computations.
 */

import BigNumber from "bignumber.js";
import { TYPE_orderSide } from "../constants/trade.constants";

export interface CalculateTPSLPriceFromROEParams {
  entryPrice: string | number;
  roe: number;
  leverage: number;
  tpOSlSide: string;
  pricePrecision: number;
}

export class TPSLCalculator {
  /**
   * Calculate TP/SL trigger price from ROE (Return on Equity)
   *
   * Formula: triggerPrice = entryPrice + (roe / 100 * entryPrice / leverage * direction)
   *
   * @param params.entryPrice - Entry price of the position
   * @param params.roe - Target ROE percentage
   * @param params.leverage - Position leverage
   * @param params.tpOSlSide - Side of the TP/SL order (BUY or SELL)
   * @param params.pricePrecision - Decimal precision for the result
   * @returns Calculated trigger price as string
   */
  static calculatePriceFromROE(params: CalculateTPSLPriceFromROEParams): string {
    const { entryPrice, roe, leverage, tpOSlSide, pricePrecision } = params;
    const direction = tpOSlSide === TYPE_orderSide.BUY ? 1 : -1;

    return BigNumber(roe)
      .dividedBy(100)
      .multipliedBy(entryPrice)
      .dividedBy(leverage)
      .multipliedBy(direction)
      .plus(entryPrice)
      .toFixed(pricePrecision);
  }
}
