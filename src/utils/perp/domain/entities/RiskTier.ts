import BigNumber from "bignumber.js";
import type { IRiskTier } from "../../types"
import {
  bigNumberMultiply,
  toPrecisionString,
  toThousandString,
  toTickSizeRoundString,
} from "../../utils";

export class RiskTier {
  constructor(
    public raw: IRiskTier,
    public index: number,
    public risks: IRiskTier[],
  ) {}

  get tier() {
    return this.raw.tier;
  }

  get positionValueUpperBound() {
    return this.raw.positionValueUpperBound;
  }

  get maxLeverage() {
    return Number(this.raw.maxLeverage);
  }
  get maintenanceMarginRate() {
    return Number(this.raw.maintenanceMarginRate);
  }
  get starkExRisk() {
    return this.raw.starkExRisk;
  }

  get starkExUpperBound() {
    return this.raw.starkExUpperBound;
  }

  get initialMarginRate() {
    return 1 / this.maxLeverage;
  }

  get startValue() {
    return toThousandString(this.risks[this.index - 1]?.positionValueUpperBound || "0", 0);
  }

  get endValue() {
    return Number(this.positionValueUpperBound) >= Number.MAX_SAFE_INTEGER
      ? "∞"
      : toThousandString(this.positionValueUpperBound, 0);
  }

  isInCurrentLevel(positionSize: number, lastPrice: number) {
    const positionValue = Math.abs(bigNumberMultiply(positionSize || 0, lastPrice || 0));
    return (
      positionValue > 0 &&
      positionValue < Number(this.positionValueUpperBound) &&
      positionValue >= Number(this.risks[this.index - 1]?.positionValueUpperBound || 0)
    );
  }

  /**
   * 根据价值查找风险档位
   * 迁移自 calculator/helper.ts
   * @param inputValue 价值
   * @param riskTierList 风险档位列表
   */
  static findByValue(inputValue: string | number, riskTierList: RiskTier[]): RiskTier | null {
    if (!riskTierList) return null;
    const inputValueAbs = BigNumber(inputValue).abs();
    let previousUpperBound = BigNumber(0);

    for (const tierInfo of riskTierList) {
      const currentUpperBound = BigNumber(tierInfo.positionValueUpperBound || 0);
      if (
        previousUpperBound.lte(inputValueAbs) &&
        inputValueAbs.lt(currentUpperBound)
      ) {
        return tierInfo;
      }
      previousUpperBound = currentUpperBound;
    }
    return null;
  }
}
