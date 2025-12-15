import BigNumber from "bignumber.js";
import { OrderSide, PositionSide } from "../value-objects/OrderEnums";
import { toTickSizeRoundString } from "../../utils";

/**
 * Calculate Take Profit trigger price from ratio.
 */
export const calculateTpPriceFromRatio = ({
  entryPrice,
  leverage,
  side,
  ratio,
  priceStep,
}: {
  entryPrice: string | number;
  leverage: string | number;
  side: PositionSide | string;
  ratio: string | number;
  priceStep: string;
}): string | null => {
  if (!entryPrice || !leverage) return null;
  const entryPriceBN = new BigNumber(entryPrice);
  const leverageBN = new BigNumber(leverage);
  const ratioBN = new BigNumber(ratio);

  if (leverageBN.isZero()) return null;

  const ratioDecimal = ratioBN.div(100).div(leverageBN);
  const isLong = side === PositionSide.LONG || side === "LONG";

  let calculatedPrice: BigNumber;
  if (isLong) {
    // Long TP: Price goes UP
    calculatedPrice = entryPriceBN.multipliedBy(new BigNumber(1).plus(ratioDecimal));
  } else {
    // Short TP: Price goes DOWN
    calculatedPrice = entryPriceBN.multipliedBy(new BigNumber(1).minus(ratioDecimal));
  }

  if (calculatedPrice.lt(0)) return null;
  return toTickSizeRoundString(calculatedPrice.toNumber(), priceStep);
};

/**
 * Calculate Stop Loss trigger price from ratio.
 */
export const calculateSlPriceFromRatio = ({
  entryPrice,
  leverage,
  side,
  ratio,
  priceStep,
}: {
  entryPrice: string | number;
  leverage: string | number;
  side: PositionSide | string;
  ratio: string | number;
  priceStep: string;
}): string | null => {
  if (!entryPrice || !leverage) return null;
  const entryPriceBN = new BigNumber(entryPrice);
  const leverageBN = new BigNumber(leverage);
  const ratioBN = new BigNumber(ratio);

  if (leverageBN.isZero()) return null;

  const ratioDecimal = ratioBN.div(100).div(leverageBN);
  const isLong = side === PositionSide.LONG || side === "LONG";

  let calculatedPrice: BigNumber;
  if (isLong) {
    // Long SL: Price goes DOWN
    calculatedPrice = entryPriceBN.multipliedBy(new BigNumber(1).minus(ratioDecimal));
  } else {
    // Short SL: Price goes UP
    calculatedPrice = entryPriceBN.multipliedBy(new BigNumber(1).plus(ratioDecimal));
  }

  if (calculatedPrice.lt(0)) return null;
  return toTickSizeRoundString(calculatedPrice.toNumber(), priceStep);
};

/**
 * Calculate PnL Ratio from Trigger Price.
 */
export const calculateRatioFromPrice = ({
  entryPrice,
  triggerPrice,
  leverage,
  side,
  isTp // true for Take Profit, false for Stop Loss
}: {
  entryPrice: string | number;
  triggerPrice: string | number;
  leverage: string | number;
  side: PositionSide | string;
  isTp: boolean;
}): string | null => {
  if (!entryPrice || !triggerPrice || !leverage) return null;

  const entryPriceBN = new BigNumber(entryPrice);
  const triggerPriceBN = new BigNumber(triggerPrice);
  const leverageBN = new BigNumber(leverage);

  if (entryPriceBN.isZero() || leverageBN.isZero()) return null;

  const isLong = side === PositionSide.LONG || side === "LONG";
  let ratio: BigNumber;

  if (isTp) {
    // TP Ratio
    if (isLong) {
      // (Trigger - Entry) / Entry * Leverage
      ratio = triggerPriceBN.minus(entryPriceBN).div(entryPriceBN).multipliedBy(leverageBN).multipliedBy(100);
    } else {
      // (Entry - Trigger) / Entry * Leverage
      ratio = entryPriceBN.minus(triggerPriceBN).div(entryPriceBN).multipliedBy(leverageBN).multipliedBy(100);
    }
  } else {
    // SL Ratio
    if (isLong) {
      // (Entry - Trigger) / Entry * Leverage
      ratio = entryPriceBN.minus(triggerPriceBN).div(entryPriceBN).multipliedBy(leverageBN).multipliedBy(100);
    } else {
      // (Trigger - Entry) / Entry * Leverage
      ratio = triggerPriceBN.minus(entryPriceBN).div(entryPriceBN).multipliedBy(leverageBN).multipliedBy(100);
    }
  }

  return ratio.gt(0) ? ratio.toFixed(2) : null;
};

/**
 * Calculate Estimated PnL Amount from Trigger Price.
 * Amount = Direction * (TriggerPrice - EntryPrice) * Volume
 */
export const calculatePnLAmountFromPrice = ({
  entryPrice,
  triggerPrice,
  volume,
  side,
  pricePrecision,
  isTp // true for TP (expect > 0), false for SL (expect < 0)
}: {
  entryPrice: string | number;
  triggerPrice: string | number;
  volume: string | number;
  side: PositionSide | string;
  pricePrecision: number;
  isTp: boolean;
}): string | null => {
  if (!entryPrice || !triggerPrice) return null;

  const entryPriceBN = new BigNumber(entryPrice);
  const triggerPriceBN = new BigNumber(triggerPrice);
  const volumeBN = new BigNumber(volume || 0);
  const isLong = side === PositionSide.LONG || side === "LONG";
  const direction = isLong ? 1 : -1;

  // Amount = Direction * (Trigger - Entry) * Volume
  const amount = triggerPriceBN.minus(entryPriceBN).multipliedBy(direction).multipliedBy(volumeBN);

  if (isTp) {
    // TP: Expect amount > 0
    return amount.gt(0) ? amount.toFixed(pricePrecision) : null;
  } else {
    // SL: Expect amount < 0, return absolute value
    return amount.lt(0) ? amount.abs().toFixed(pricePrecision) : null;
  }
};

/**
 * Calculate Trigger Price from PnL Amount.
 * Price = Entry + (Amount / (Volume * Direction))
 */
export const calculatePriceFromPnLAmount = ({
  entryPrice,
  amount,
  volume,
  side,
  priceStep,
  isTp // true for TP (amount is positive), false for SL (amount is negative cost)
}: {
  entryPrice: string | number;
  amount: string | number;
  volume: string | number;
  side: PositionSide | string;
  priceStep: string;
  isTp: boolean;
}): string | null => {
  if (!entryPrice || !amount || !volume || Number(volume) === 0) return null;

  const entryPriceBN = new BigNumber(entryPrice);
  const amountBN = new BigNumber(amount);
  const volumeBN = new BigNumber(volume);
  const isLong = side === PositionSide.LONG || side === "LONG";
  const direction = isLong ? 1 : -1;

  // If SL, the input amount is positive (user sees absolute loss), but mathematically it's a loss.
  const actualAmount = isTp ? amountBN : amountBN.negated();

  // Price = Entry + Amount / (Volume * Direction)
  const calculatedPrice = entryPriceBN.plus(actualAmount.div(volumeBN.multipliedBy(direction)));

  if (calculatedPrice.lte(0)) return "0";

  // Use floor for price step rounding (to match original logic `toTickSizeRoundString(..., true)`)
  return toTickSizeRoundString(calculatedPrice.toNumber(), priceStep, true);
};
