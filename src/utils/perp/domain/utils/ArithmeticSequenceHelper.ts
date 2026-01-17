/**
 * 等差数列计算工具类
 *
 * 用于分段订单中价格和数量的等差数列计算
 *
 * 两种公差类型：
 * 1. 价格公差：已知首项、末项、项数 → 公差 = (末项 - 首项) / (项数 - 1)
 * 2. 数量公差：已知总和、项数，且公差=首项 → 公差 = (总和 * 2) / [项数 * (项数 + 1)]
 */
export class ArithmeticSequenceHelper {
  /**
   * 计算价格公差（已知首项、末项、项数）
   *
   * 使用场景：分段订单价格分布计算
   * 公式：公差 = (末项 - 首项) / (项数 - 1)
   *
   * @param firstTerm 首项（最低价格）
   * @param lastTerm 末项（最高价格）
   * @param termCount 项数（订单个数）
   * @param pricePrecision 可选，价格精度（小数位数）。如果提供，结果会按此精度向下取整
   * @returns 公差，项数 < 2 时返回 0
   */
  static calculatePriceDifference(
    firstTerm: number,
    lastTerm: number,
    termCount: number,
    pricePrecision?: number,
  ): number {
    if (termCount < 2) {
      return 0;
    }
    const difference = (lastTerm - firstTerm) / (termCount - 1);

    // 如果提供了价格精度，向下取整
    if (pricePrecision !== undefined && pricePrecision >= 0) {
      const multiplier = Math.pow(10, pricePrecision);
      return Math.floor(difference * multiplier) / multiplier;
    }

    return difference;
  }

  /**
   * 计算数量公差（已知总和、项数，前提：公差=首项）
   *
   * 使用场景：分段订单升序/降序数量分布计算
   *
   * 推导过程：
   * - 前提条件：公差 d = 首项 a₁
   * - 等差数列：a₁, 2a₁, 3a₁, ..., na₁
   * - 总和 S = a₁(1 + 2 + ... + n) = a₁ × n(n+1)/2
   * - 因此：a₁ = 2S / [n(n+1)]
   *
   * 公式：公差 = 首项 = (总和 * 2) / [项数 * (项数 + 1)]
   *
   * @param sum 总和（订单总数量）
   * @param termCount 项数（订单个数）
   * @returns 公差（同时也是首项），项数 < 2 时返回 0
   */
  static calculateSizeDifference(sum: number, termCount: number): number {
    if (termCount < 2) {
      return 0;
    }
    return (sum * 2) / (termCount * (termCount + 1));
  }

  /**
   * 计算等差数列第N项的值
   *
   * 公式：aₙ = a₁ + (n - 1) × d
   *
   * @param firstTerm 首项
   * @param difference 公差
   * @param n 项数（从1开始）
   * @returns 第N项的值
   */
  static calculateNthTerm(firstTerm: number, difference: number, n: number): number {
    return firstTerm + (n - 1) * difference;
  }

  /**
   * 计算等差数列第N项的值（当公差=首项时的简化版本）
   *
   * 用于升序/降序数量计算
   * 公式：aₙ = n × 公差（因为公差=首项）
   *
   * @param difference 公差（同时也是首项）
   * @param n 项数（从1开始）
   * @returns 第N项的值
   */
  static calculateNthTermWhenDiffEqualsFirst(difference: number, n: number): number {
    return n * difference;
  }

  /**
   * 计算等差数列前n项和（当公差=首项时）
   *
   * 用于升序/降序最小总数量计算
   * 公式：S = 首项 × n(n+1)/2
   *
   * @param firstTerm 首项（同时也是公差）
   * @param termCount 项数
   * @returns 前n项和
   */
  static calculateSumWhenDiffEqualsFirst(firstTerm: number, termCount: number): number {
    if (termCount <= 0) {
      return 0;
    }
    return (firstTerm * termCount * (termCount + 1)) / 2;
  }
}
