/**
 * OrderSizeCalculator
 *
 * Calculates order sizes based on various inputs.
 * Pure calculation logic without external dependencies.
 */

import BigNumber from "bignumber.js";
import { toTickSizeRoundString } from "../../utils";

export interface CalculateSizeFromRatioParams {
  maxSize: string | number;
  ratio: number;
  stepSize: string;
}

export class OrderSizeCalculator {
  /**
   * Calculate order size from a percentage ratio of max size
   *
   * @param params.maxSize - Maximum available size
   * @param params.ratio - Percentage ratio (0-100)
   * @param params.stepSize - Minimum step size for rounding
   * @returns Calculated size as string, rounded to step size
   */
  static calculateSizeFromRatio(params: CalculateSizeFromRatioParams): string {
    const { maxSize, ratio, stepSize } = params;
    const rawSize = BigNumber(maxSize).multipliedBy(ratio).dividedBy(100);
    return toTickSizeRoundString(rawSize.toNumber(), stepSize, true);
  }
}
