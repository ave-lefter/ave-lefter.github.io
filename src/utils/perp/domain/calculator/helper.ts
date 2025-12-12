import type { IRiskTier, RiskTier } from "../../types";
import BigNumber from "bignumber.js";

/**
 * 辅助方法
 */

interface RiskTierWithBounds extends IRiskTier {
  start: string;
  end: string;
}

/**
 * 根据仓位价值找到对应的风险梯度
 * @param {string} inputValue
 * @param {Array<object>} riskTierList like [{positionValueUpperBound: "1000"}]
 * @returns {object} result like {positionValueUpperBound: "1000"}
 */
export const findRiskTier = (
  inputValue: string | number,
  riskTierList: RiskTier[] | undefined,
)=> {
  if (!riskTierList) return null;
  let inputValueAbs = BigNumber(inputValue).abs();
  let previousUpperBound = BigNumber(0); // Start from 0 for tier 1

  for (let tierInfo of riskTierList) {
    let currentUpperBound = BigNumber(tierInfo?.positionValueUpperBound || 0);
    if (
      BigNumber(previousUpperBound).lte(inputValueAbs) &&
      BigNumber(inputValueAbs).lt(currentUpperBound)
    ) {
      return {
        ...tierInfo,
        start: previousUpperBound.toString(),
        end: currentUpperBound.toString(),
      };
    }
    previousUpperBound = currentUpperBound; // Update the previousUpperBound for the next iteration
  }
  return null;
};
