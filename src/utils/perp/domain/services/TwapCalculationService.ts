import BigNumber from "bignumber.js";
import { generateRandomClientId } from "@edgex/trade-libs";

/**
 * Service for TWAP (Time-Weighted Average Price) order calculations.
 */
export class TwapCalculationService {
  /**
   * Calculate TWAP order split sizes.
   * @param totalQty - Total order quantity
   * @param maxSize - Maximum size per split order
   * @returns Array of split order sizes
   */
  static calculateTwapSizes(totalQty: string | number, maxSize: string): string[] {
    const total = new BigNumber(totalQty);
    const max = new BigNumber(maxSize);

    // Calculate number of parts
    const parts = Math.ceil(total.dividedBy(max).toNumber());

    // Generate sizes array
    const sizes: string[] = [];
    for (let i = 0; i < parts - 1; i++) {
      sizes.push(max.toString());
    }

    // Last part size
    const lastSize = total.minus(max.multipliedBy(parts - 1));
    sizes.push(lastSize.toString());

    return sizes;
  }

  /**
   * Generate TWAP Group ID.
   * @returns TWAP Group ID
   */
  static generateTwapGroupId(): string {
    return `twap_${generateRandomClientId()}`;
  }
}
