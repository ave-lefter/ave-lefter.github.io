import BigNumber from "bignumber.js";

export function generateRandomClientId() {
  return Math.random().toString().slice(2).replace(/^0+/, "");
}

/**
 * Service for TWAP (Time-Weighted Average Price) order calculations.
 */
export class TwapCalculationService {
  /**
   * Calculate TWAP order split sizes.
   * 计算TWAP订单拆分
   *
   * @param totalQty - Total order quantity (总下单数量)
   * @param maxSize - Maximum size per split order (最大单笔数量)
   * @returns Array of split order sizes (拆分后的订单数量数组)
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
   * 生成TWAP订单组ID
   *
   * @returns TWAP Group ID
   */
  static generateTwapGroupId(): string {
    return `twap_${generateRandomClientId()}`;
  }
}
