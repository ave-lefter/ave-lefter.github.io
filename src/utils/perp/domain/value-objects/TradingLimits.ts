/**
 * 交易限制值对象
 *
 * 聚合所有交易限制信息（从账户状态和合约配置中获取）
 */

import BigNumber from "bignumber.js";
import type { IRiskTier } from "../../types"
import { MAX_POSITION_VALUE_SENTINEL } from "../constants";
import { Leverage } from "./Leverage";

/**
 * 交易限制
 */
export class TradingLimits {
  /** 预排序的风险档位列表（从小到大） */
  private readonly _sortedRiskTiers: IRiskTier[];

  constructor(
    /** 可用保证金 */
    public readonly availableMargin: BigNumber,
    /** 当前杠杆 */
    public readonly leverage: Leverage,
    /** 风险档位列表 */
    public readonly riskTiers: IRiskTier[],
    /** 合约最大持仓限制 */
    public readonly maxPositionSize: BigNumber | null,
    /** 合约最小下单量 */
    public readonly minOrderSize: BigNumber,
    /** 价格精度 */
    public readonly pricePrecision: number,
    /** 数量精度 */
    public readonly sizePrecision: number,
  ) {
    // 预先排序风险档位（按最大杠杆从小到大排序）
    // 这样在频繁调用 getCurrentRiskTier 时性能更好
    this._sortedRiskTiers = [...riskTiers].sort(
      (a, b) => Number(a.maxLeverage) - Number(b.maxLeverage),
    );
  }

  /**
   * 根据当前杠杆获取对应的风险档位
   */
  getCurrentRiskTier(): IRiskTier | null {
    if (!this._sortedRiskTiers || this._sortedRiskTiers.length === 0) {
      return null;
    }

    // 找到第一个最大杠杆 >= 当前杠杆的档位
    const tier = this._sortedRiskTiers.find(
      (t) => Number(t.maxLeverage) >= this.leverage.getValue(),
    );

    return tier ?? null;
  }

  /**
   * 获取风险档位对应的最大持仓价值
   */
  getMaxPositionValueByRiskTier(): BigNumber | null {
    const tier = this.getCurrentRiskTier();
    if (!tier) return null;

    const positionValueUpperBound = tier.positionValueUpperBound;

    // 检查是否为无限大（特殊值）
    const isInfinite = positionValueUpperBound === MAX_POSITION_VALUE_SENTINEL;
    if (isInfinite) return null;

    return new BigNumber(positionValueUpperBound);
  }

  /**
   * 根据风险档位计算最大可开仓数量
   */
  getMaxSizeByRiskTier(price: BigNumber): BigNumber | null {
    const maxPositionValue = this.getMaxPositionValueByRiskTier();
    if (!maxPositionValue) return null;

    if (price.isZero()) return null;

    // 最大数量 = 仓位价值上限 / 价格
    const maxSize = maxPositionValue.dividedBy(price);

    // Down round to size precision
    return new BigNumber(maxSize.toFixed(this.sizePrecision, BigNumber.ROUND_DOWN));
  }

  /**
   * 获取合约配置的最大持仓限制
   */
  getMaxPositionSizeByContract(): BigNumber | null {
    return this.maxPositionSize;
  }

  /**
   * 获取基于保证金的最大可开仓价值
   */
  getMaxPositionValueByMargin(): BigNumber {
    // 最大开仓价值 = 可用保证金 * 杠杆
    return this.availableMargin.multipliedBy(this.leverage.getValue());
  }

  /**
   * 转换为 JSON
   */
  toJSON() {
    return {
      availableMargin: this.availableMargin.toString(),
      leverage: this.leverage.getValue(),
      riskTiers: this.riskTiers,
      maxPositionSize: this.maxPositionSize?.toString() ?? null,
      minOrderSize: this.minOrderSize.toString(),
      pricePrecision: this.pricePrecision,
      sizePrecision: this.sizePrecision,
    };
  }
}
