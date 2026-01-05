import BigNumber from "bignumber.js";

export class PriceService {
  /**
   * 计算中间价
   * Formula: (bid1 + ask1) / 2
   */
  static calculateMidPrice(bid1: number | string, ask1: number | string): number | null {
    if (!bid1 || !ask1 || Number(bid1) === 0 || Number(ask1) === 0) {
      return null;
    }
    return BigNumber(bid1).plus(ask1).dividedBy(2).toNumber();
  }

  /**
   * 检查价差是否过大
   * Rule: (ask1 - bid1) / bid1 > 5%
   */
  static isSpreadTooLarge(bid1: number | string, ask1: number | string, thresholdPercent = 5): boolean {
    if (!bid1 || !ask1 || Number(bid1) === 0 || Number(ask1) === 0) {
      return false;
    }
    const spread = BigNumber(ask1).minus(bid1).dividedBy(bid1).multipliedBy(100);
    return spread.isGreaterThan(thresholdPercent);
  }
}
