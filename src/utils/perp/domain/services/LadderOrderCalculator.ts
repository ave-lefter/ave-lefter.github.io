import BigNumber from "bignumber.js";
import { SymbolEntity } from "../entities/Symbol";
import { ArithmeticSequenceHelper } from "../utils/ArithmeticSequenceHelper";
import {
  LadderOrderDistributionMode,
  OrderBasis,
  OrderSide,
  orderSideToPositionSide,
} from "../value-objects/OrderEnums";
import { OrderMarginService } from "./OrderMarginService";

/**
 * 价格分布计算参数
 */
export interface CalculatePriceDistributionParams {
  minPrice: string | number;
  maxPrice: string | number;
  orderCount: number;
  symbol: SymbolEntity;
}

/**
 * 数量分布计算参数
 */
export interface CalculateSizeDistributionParams {
  totalSize: string | number;
  orderCount: number;
  distributionMode: LadderOrderDistributionMode;
  symbol: SymbolEntity;
}

/**
 * 最小下单数量要求计算参数
 */
export interface CalculateMinOrderSizeRequirementParams {
  orderCount: number;
  distributionMode: LadderOrderDistributionMode;
  orderBasis: OrderBasis;
  symbol: SymbolEntity;
  minPrice?: string | number; // 当 orderBasis 为 Value 时需要，最低价格
  maxPrice?: string | number; // 当 orderBasis 为 Value 时需要，最高价格
}

/**
 * 入场均价计算参数
 */
export interface CalculateAveragePriceParams {
  prices: string[];
  sizes: string[];
}

/**
 * 总成本计算参数
 */
export interface CalculateTotalCostParams {
  prices: string[];
  sizes: string[];
  side: OrderSide;
  oraclePrice: string | number;
  leverage: string | number;
  feeRate: string | number;
}

/**
 * 子订单比例计算参数
 */
export interface CalculateSizeRatiosParams {
  sizes: string[];
  totalSize: string | number;
}

/**
 * 分段订单计算器
 *
 * 职责：
 * 1. 计算分段订单的价格分布（等差数列）
 * 2. 计算分段订单的数量分布（平均/升序/降序/随机）
 * 3. 计算分段订单最小下单数量要求（用于验证）
 * 4. 计算入场均价
 * 5. 计算总成本
 * 6. 计算子订单比例
 */
export class LadderOrderCalculator {
  /**
   * 计算分段订单价格分布（等差数列）
   *
   * 算法：
   * - 公差 = (最高价格 - 最低价格) / (订单个数 - 1)
   * - 公差按价格精度向下取整
   * - 第1个订单价格 = 最低价格
   * - 第N个订单价格 = 最低价格 + (N - 1) * 公差，按价格精度向下取整
   * - 最后1个订单价格 = 最高价格
   *
   * @param params - 价格分布计算参数
   * @returns 价格数组，按从低到高排序
   */
  static calculatePriceDistribution(params: CalculatePriceDistributionParams): string[] {
    const { minPrice, maxPrice, orderCount, symbol } = params;

    if (orderCount < 2) {
      return [];
    }

    const minPriceNum = Number(minPrice);
    const maxPriceNum = Number(maxPrice);

    if (isNaN(minPriceNum) || isNaN(maxPriceNum) || minPriceNum >= maxPriceNum) {
      return [];
    }

    const prices: string[] = [];

    // 计算公差：使用 ArithmeticSequenceHelper 计算，并按价格精度向下取整
    const pricePrecision = symbol.pricePrecision;
    const stepRounded = ArithmeticSequenceHelper.calculatePriceDifference(
      minPriceNum,
      maxPriceNum,
      orderCount,
      pricePrecision,
    );

    // 第1个订单价格为最低价格（按价格精度向下取整）
    prices.push(symbol.formatPrice(minPriceNum, "floor"));

    // 中间订单价格：第N个订单价格 = 最低价格 + (N - 1) * 公差，按价格精度向下取整
    for (let i = 2; i < orderCount; i++) {
      const price = ArithmeticSequenceHelper.calculateNthTerm(minPriceNum, stepRounded, i);
      prices.push(symbol.formatPrice(price, "floor"));
    }

    // 最后1个订单价格为最高价格（按价格精度向下取整）
    prices.push(symbol.formatPrice(maxPriceNum, "floor"));

    return prices;
  }

  /**
   * 计算分段订单数量分布
   *
   * 算法（根据分布模式）：
   *
   * 1. 平均模式（EQUAL）：
   *    - 前N-1个订单：单笔数量 = 订单总数量 / 分段订单个数，按数量精度向下取整
   *    - 最后1个订单的数量 = 订单总数量 - 前面所有分段子订单数量之和
   *
   * 2. 升序/降序模式（ASCENDING/DESCENDING，等差数列）：
   *    - 已知总和（订单总数量）、项数（订单个数），且前提条件：公差 = 首项
   *    - 首项 = (订单总数量 * 2) / [订单个数 * (订单个数 + 1)]
   *    - 升序：
   *      * 第N个订单的数量 = N * 公差，计算结果按数量精度向下取整
   *      * 最后1个订单的数量 = 订单总数量 - 前面所有分段子订单数量之和
   *    - 降序：逻辑与升序一致，将订单从最后1个往前计算即可
   *
   * 3. 随机模式（RANDOM）：
   *    - 前N-1个订单：单笔数量 = (订单总数量 / 分段订单个数) * [1 + (-0.1~0.1之间的随机数)]
   *      * -0.1~0.1之间的随机数，精度为小数点后2位
   *      * 计算结果按数量精度向下取整
   *    - 最后1个订单的数量 = 订单总数量 - 前面所有分段子订单数量之和
   *
   * @param params - 数量分布计算参数
   * @returns 数量数组，与价格数组一一对应
   */
  static calculateSizeDistribution(params: CalculateSizeDistributionParams): string[] {
    const { totalSize, orderCount, distributionMode, symbol } = params;

    if (orderCount < 2) {
      return [];
    }

    const totalSizeNum = Number(totalSize);
    if (isNaN(totalSizeNum) || totalSizeNum <= 0) {
      return [];
    }

    const sizes: string[] = [];

    if (distributionMode === LadderOrderDistributionMode.EQUAL) {
      // 平均模式
      // 前N-1个订单：单笔数量 = 订单总数量 / 分段订单个数，按数量精度向下取整
      const avgSize = totalSizeNum / orderCount;
      const avgSizeRounded = symbol.formatSize(avgSize);
      const avgSizeNum = Number(avgSizeRounded);

      let sum = 0;
      for (let i = 0; i < orderCount - 1; i++) {
        sizes.push(avgSizeRounded);
        sum += avgSizeNum;
      }

      // 最后1个订单的数量 = 订单总数量 - 前面所有分段子订单数量之和
      const lastSize = totalSizeNum - sum;
      sizes.push(symbol.formatSize(lastSize));
    } else if (
      distributionMode === LadderOrderDistributionMode.ASCENDING ||
      distributionMode === LadderOrderDistributionMode.DESCENDING
    ) {
      // 升序/降序模式（等差数列）
      // 计算首项（公差）
      const firstTerm = ArithmeticSequenceHelper.calculateSizeDifference(totalSizeNum, orderCount);

      // 计算前 N-1 个订单的数量
      let sum = 0;
      const ascendingSizes: string[] = [];
      for (let i = 1; i < orderCount; i++) {
        // 第N个订单的数量 = N * 公差，按数量精度向下取整
        const size = ArithmeticSequenceHelper.calculateNthTermWhenDiffEqualsFirst(firstTerm, i);
        const sizeRounded = symbol.formatSize(size);
        ascendingSizes.push(sizeRounded);
        sum += Number(sizeRounded);
      }

      // 最后1个订单的数量 = 订单总数量 - 前面所有分段子订单数量之和
      const lastSize = totalSizeNum - sum;
      const lastSizeRounded = symbol.formatSize(lastSize);

      if (distributionMode === LadderOrderDistributionMode.ASCENDING) {
        // 升序：直接使用计算好的顺序
        sizes.push(...ascendingSizes);
        sizes.push(lastSizeRounded);
      } else {
        // 降序：逻辑与升序一致，将订单从最后1个往前计算
        sizes.push(lastSizeRounded);
        for (let i = ascendingSizes.length - 1; i >= 0; i--) {
          sizes.push(ascendingSizes[i]);
        }
      }
    } else if (distributionMode === LadderOrderDistributionMode.RANDOM) {
      // 随机模式
      // 前N-1个订单：单笔数量 = (订单总数量 / 分段订单个数) * [1 + (-0.1~0.1之间的随机数)]
      // -0.1~0.1之间的随机数，精度为小数点后2位
      let sum = 0;
      const avgSize = totalSizeNum / orderCount;

      for (let i = 0; i < orderCount - 1; i++) {
        // 生成 -0.1~0.1 之间的随机数，精度为小数点后2位
        const randomFactor = Math.round((Math.random() * 0.2 - 0.1) * 100) / 100;
        const size = avgSize * (1 + randomFactor);
        const sizeRounded = symbol.formatSize(size);
        sizes.push(sizeRounded);
        sum += Number(sizeRounded);
      }

      // 最后1个订单的数量 = 订单总数量 - 前面所有分段子订单数量之和
      const lastSize = totalSizeNum - sum;
      sizes.push(symbol.formatSize(lastSize));
    }

    return sizes;
  }

  /**
   * 计算分段订单最小下单数量要求（用于验证）
   *
   * 根据订单个数、分布模式和订单基础单位，计算满足最小下单要求所需的总数量。
   * 用于验证用户输入的总数量是否满足最小下单要求。
   *
   * @param params - 最小下单数量要求计算参数
   * @returns 最小下单数量要求（字符串），无法计算时返回 null
   */
  static calculateMinOrderSizeRequirement(
    params: CalculateMinOrderSizeRequirementParams,
  ): string | null {
    const { orderCount, distributionMode, orderBasis, symbol, minPrice, maxPrice } = params;

    if (orderCount < 2) {
      return null;
    }

    const minOrderSize = symbol.minOrderSize;
    if (!minOrderSize) {
      return null;
    }

    const minOrderSizeNum = Number(minOrderSize);
    if (isNaN(minOrderSizeNum) || minOrderSizeNum <= 0) {
      return null;
    }

    if (orderBasis === OrderBasis.Size) {
      // 单位为币
      if (distributionMode === LadderOrderDistributionMode.EQUAL) {
        // 均分：最小下单总数量 = 该品种最小下单数量 * 分段订单个数
        return String(minOrderSizeNum * orderCount);
      } else if (
        distributionMode === LadderOrderDistributionMode.ASCENDING ||
        distributionMode === LadderOrderDistributionMode.DESCENDING
      ) {
        // 升序/降序：最小下单总数量 = sum(以该品种最小下单数量为公差计算出的分段订单数量)
        const sum = (minOrderSizeNum * orderCount * (orderCount + 1)) / 2;
        return String(sum);
      } else if (distributionMode === LadderOrderDistributionMode.RANDOM) {
        // 随机：最小下单总数量 = 该品种最小下单数量 * 分段订单个数 * 1.1
        return String(minOrderSizeNum * orderCount * 1.1);
      }
    } else if (orderBasis === OrderBasis.Value) {
      // 单位为USD
      if (!minPrice || !maxPrice) {
        return null;
      }

      const minPriceNum = Number(minPrice);
      const maxPriceNum = Number(maxPrice);
      if (isNaN(minPriceNum) || isNaN(maxPriceNum) || minPriceNum >= maxPriceNum) {
        return null;
      }

      // 计算价格数组
      const prices = this.calculatePriceDistribution({
        minPrice: minPriceNum,
        maxPrice: maxPriceNum,
        orderCount,
        symbol,
      });

      if (prices.length === 0) {
        return null;
      }

      let minTotalValue = BigNumber(0);

      if (distributionMode === LadderOrderDistributionMode.EQUAL) {
        // 均分：最小下单总数量 = sum(该品种最小下单数量 * 分段订单价格)
        for (const price of prices) {
          minTotalValue = minTotalValue.plus(BigNumber(minOrderSizeNum).multipliedBy(price));
        }
      } else if (
        distributionMode === LadderOrderDistributionMode.ASCENDING ||
        distributionMode === LadderOrderDistributionMode.DESCENDING
      ) {
        // 升序/降序：最小下单总数量 = sum(以公差为最小下单数量计算出的分段订单数量 * 分段订单价格)
        // 数量数组（公差=minOrderSize）：[1*minOrderSize, 2*minOrderSize, ..., n*minOrderSize]
        for (let i = 0; i < prices.length; i++) {
          const sizeForIndex = minOrderSizeNum * (i + 1);
          minTotalValue = minTotalValue.plus(BigNumber(sizeForIndex).multipliedBy(prices[i]));
        }
      } else if (distributionMode === LadderOrderDistributionMode.RANDOM) {
        // 随机：最小下单总数量 = sum(该品种最小下单数量 * 1.1 * 分段订单价格)
        for (const price of prices) {
          minTotalValue = minTotalValue.plus(
            BigNumber(minOrderSizeNum).multipliedBy(1.1).multipliedBy(price),
          );
        }
      }

      // 计算结果按精度向上取整
      return symbol.formatPrice(minTotalValue.toNumber(), "ceil");
    }

    return null;
  }

  /**
   * 计算入场均价
   *
   * 公式：均价 = sum(订单价格 * 订单数量) / sum(订单数量)
   *
   * @param params - 入场均价计算参数
   * @returns 入场均价（字符串），无法计算时返回 null
   */
  static calculateAveragePrice(params: CalculateAveragePriceParams): string | null {
    const { prices, sizes } = params;

    if (!prices || !sizes || prices.length === 0 || sizes.length === 0) {
      return null;
    }

    if (prices.length !== sizes.length) {
      return null;
    }

    let totalValue = BigNumber(0);
    let totalSize = BigNumber(0);

    for (let i = 0; i < prices.length; i++) {
      const price = BigNumber(prices[i] || 0);
      const size = BigNumber(sizes[i] || 0);

      if (price.isNaN() || size.isNaN() || price.lte(0) || size.lte(0)) {
        continue;
      }

      totalValue = totalValue.plus(price.multipliedBy(size));
      totalSize = totalSize.plus(size);
    }

    if (totalSize.lte(0)) {
      return null;
    }

    const averagePrice = totalValue.dividedBy(totalSize);
    return averagePrice.toFixed();
  }

  /**
   * 计算分段订单总成本
   *
   * 成本 = sum(分段子订单成本)
   * 分段子订单成本(保证金)与普通限价单算法一致，包含初始保证金、开仓潜在亏损、手续费
   *
   * @param params - 总成本计算参数
   * @returns 总成本（字符串），无法计算时返回 null
   */
  static calculateTotalCost(params: CalculateTotalCostParams): string | null {
    const { prices, sizes, side, oraclePrice, leverage, feeRate } = params;

    if (!prices || !sizes || prices.length === 0 || sizes.length === 0) {
      return null;
    }

    if (prices.length !== sizes.length) {
      return null;
    }

    let totalCost = BigNumber(0);
    let hasValidOrder = false;

    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];
      const size = sizes[i];

      if (!price || !size || Number(price) <= 0 || Number(size) <= 0) {
        continue;
      }

      // 使用 OrderMarginService 计算单个子订单的成本
      const marginService = new OrderMarginService({
        oraclePrice,
        price,
        size,
        leverage,
        feeRate,
      });

      // 计算保证金（限价单）
      const margin = marginService.calcMargin(orderSideToPositionSide(side), {
        isMarketOrder: false,
      });

      totalCost = totalCost.plus(margin);
      hasValidOrder = true;
    }

    if (!hasValidOrder) {
      return null;
    }

    return totalCost.toFixed(2);
  }

  /**
   * 计算子订单比例
   *
   * 算法：
   * - 子订单比例 = 子订单数量 / 订单总数量 * 100%
   * - 计算结果保留小数点后2位，超出四舍五入
   *
   * @param params - 子订单比例计算参数
   * @returns 比例数组（百分比字符串，保留2位小数），与数量数组一一对应
   */
  static calculateSizeRatios(params: CalculateSizeRatiosParams): string[] {
    const { sizes, totalSize } = params;

    if (!sizes || sizes.length === 0) {
      return [];
    }

    const totalSizeNum = Number(totalSize);
    if (isNaN(totalSizeNum) || totalSizeNum <= 0) {
      return [];
    }

    const ratios: string[] = [];

    for (const size of sizes) {
      const sizeNum = Number(size);
      if (isNaN(sizeNum) || sizeNum < 0) {
        ratios.push("0.00");
        continue;
      }

      // 计算比例：子订单数量 / 订单总数量 * 100%
      const ratio = (sizeNum / totalSizeNum) * 100;

      // 保留小数点后2位，四舍五入
      ratios.push(ratio.toFixed(2));
    }

    return ratios;
  }
}
