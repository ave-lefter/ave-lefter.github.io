import BigNumber from "bignumber.js";
import { PositionSide } from "../value-objects/OrderEnums";
import { getNumberPrecision, toTickSizeRoundString } from "../../utils";
import { SymbolEntity } from "../entities/Symbol";

interface CollateralInfo {
  totalEquity: string | BigNumber;
  starkExRiskValue: string | BigNumber;
  pendingWithdrawAmount: string | BigNumber;
  pendingTransferOutAmount: string | BigNumber;
}

/**
 * Service for position-related calculations (TP/SL, PnL, Liquidation, etc.)
 */
export class PositionCalculationService {
  /**
   * Calculate Take Profit trigger price from ratio.
   */
  static calculateTpPriceFromRatio({
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
  }): string | null {
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
  }

  /**
   * Calculate Stop Loss trigger price from ratio.
   */
  static calculateSlPriceFromRatio({
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
  }): string | null {
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
  }

  /**
   * Calculate PnL Ratio from Trigger Price.
   */
  static calculateRatioFromPrice({
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
  }): string | null {
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
  }

  /**
   * Calculate Estimated PnL Amount from Trigger Price.
   * Amount = Direction * (TriggerPrice - EntryPrice) * Volume
   */
  static calculatePnLAmountFromPrice({
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
  }): string | null {
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
  }

  /**
   * Calculate Trigger Price from PnL Amount.
   * Price = Entry + (Amount / (Volume * Direction))
   */
  static calculatePriceFromPnLAmount({
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
  }): string | null {
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
  }

  /**
   * Calculate PnL (Profit and Loss) Amount
   *
   * Formula:
   * - Long: (Exit Price - Entry Price) * Size
   * - Short: (Entry Price - Exit Price) * Size
   */
  static calculatePnL({
    entryPrice,
    exitPrice,
    size,
    side,
  }: {
    entryPrice: string | number | BigNumber;
    exitPrice: string | number | BigNumber;
    size: string | number | BigNumber;
    side: PositionSide | string;
  }): BigNumber {
    const entry = new BigNumber(entryPrice);
    const exit = new BigNumber(exitPrice);
    const amount = new BigNumber(size);

    const isLong = side === PositionSide.LONG || side === "LONG";

    if (isLong) {
      return exit.minus(entry).multipliedBy(amount);
    } else {
      return entry.minus(exit).multipliedBy(amount);
    }
  }

  /**
   * Calculate StarkEx Risk Rate for a position
   */
  private static calculatePositionStarkExRiskRate(
    symbol: SymbolEntity,
    openSize: string | BigNumber,
    oraclePrice: string | number
  ): BigNumber {
    const positionValue = new BigNumber(openSize).multipliedBy(oraclePrice).abs();
    const riskTier = symbol.getRiskTier(positionValue.toString());
    return BigNumber(riskTier?.starkExRisk || 0).div(BigNumber(2).pow(32));
  }

  /**
   * 以固定维持保证金率计算仓位清算价格工具方法 (Internal)
   * Calculate Liquidate Price Internal (Helper)
   */
  private static calculatePositionLiquidatePriceInternal({
    symbol,
    openSize,
    fixStarkExRiskRate,
    oraclePrice,
    totalEquity,
    starkExRiskValue,
  }: {
    symbol: SymbolEntity;
    openSize: string | BigNumber;
    fixStarkExRiskRate: string | BigNumber;
    oraclePrice: string | number;
    totalEquity: string | BigNumber;
    starkExRiskValue: string | BigNumber;
  }): string {
    const tickSize = symbol.tickSize;
    let liquidatePriceInternal = "0";
    if (BigNumber(openSize).gt(0) && BigNumber(fixStarkExRiskRate).lt(1)) {
      liquidatePriceInternal = BigNumber(oraclePrice)
        .minus(
          BigNumber(
            BigNumber(totalEquity)
              .minus(starkExRiskValue)
              .div(BigNumber(openSize).multipliedBy(BigNumber(1).minus(fixStarkExRiskRate))),
          ),
        )
        .toFixed(getNumberPrecision(tickSize), BigNumber.ROUND_CEIL);
    } else if (BigNumber(openSize).lt(0)) {
      liquidatePriceInternal = BigNumber(oraclePrice)
        .minus(
          BigNumber(
            BigNumber(totalEquity)
              .minus(starkExRiskValue)
              .div(BigNumber(openSize).multipliedBy(BigNumber(1).plus(fixStarkExRiskRate))),
          ),
        )
        .toFixed(getNumberPrecision(tickSize), BigNumber.ROUND_FLOOR);
    }
    return liquidatePriceInternal;
  }

  /**
   * 计算最差平仓价，即平仓成交价格不能劣于这个价格。
   * 注意：此价格没有考虑 维持保证金率降档问题，所以当有平仓降档情况时并不精确。
   *
   * 推导过程：
   * TV = Q + sum (S[i] x P[i]_oracle)
   * TR = sum (abs(S[i]) x P[i]_oracle x R[i])
   *
   * TV：账户总价值
   * TR：账户所有仓位总 starkEx 风险金额
   * Q：抵押品余额
   * S[i]: 合约 i 的仓位开仓数量 (多仓为正，空仓为负)
   * R[i]: 合约 i 对应的 starkExRiskRate
   * P[i]_oracle: 和余额 i 的预言机价格
   *
   * 当 以价格 P[k]_close 平仓 S[k]_close 数量时 (>0 为买入，<0 为卖出)
   * afterTV = Q - S[k]_close x P[k]_close + sum (S[i] x P[i]_oracle) + S[k]_close x P[k]_oracle - abs(S[k]_close) x P[k]_close x feeRate
   * afterTV = TV - S[k]_close x P[k]_close + S[k]_close x P[k]_oracle - abs(S[k]_close) x P[k]_close x feeRate
   * afterTR = sum (abs(S[i]) x P[i]_oracle x R[i]) - abs(S[k]_close) x P[k]_oracle x R[k]
   * afterTR = TR - abs(S[k]_close) x P[k]_oracle x R[k]
   *
   * 注：S[k]_close != 0, P[k]_oracle > 0, TR > 0, feeRate >= 0 && feeRate < 1, R[k] > 0 && R[k] < 1
   *
   * 1. 要计算满足 afterTV / afterTR >= TV / TR 时的最差值
   *
   *   afterTV / afterTR  >= TV / TR
   *   =>
   *   (TV - S[k]_close x P[k]_close + S[k]_close x P[k]_oracle - abs(S[k]_close) x P[k]_close x feeRate) / (TR - abs(S[k]_close) x P[k]_oracle x R[k]) >= TV / TR
   *   =>
   *   TV x TR - S[k]_close x P[k]_close x TR + S[k]_close x P[k]_oracle x TR - abs(S[k]_close) x P[k]_close x feeRate x TR >= TV x TR - TV x abs(S[k]_close) x P[k]_oracle x R[k]
   *   =>
   *   S[k]_close x P[k]_close x TR - S[k]_close x P[k]_oracle x TR + abs(S[k]_close) x P[k]_close x feeRate x TR <= TV x abs(S[k]_close) x P[k]_oracle x R[k]
   *   =>
   *   S[k]_close x P[k]_close x TR + abs(S[k]_close) x P[k]_close x feeRate x TR <= TV x abs(S[k]_close) x P[k]_oracle x R[k] + S[k]_close x P[k]_oracle x TR
   *   =>
   *   if (S[k]_close > 0) : P[k]_close x TR x (1 + feeRate) <= TV x P[k]_oracle x R[k] + P[k]_oracle x TR
   *   if (s[k]_close < 0) : P[k]_close x TR x (1 - feeRate) >= - TV x P[k]_oracle x R[k] + P[k]_oracle x TR
   *   =>
   *   if (S[k]_close > 0) : P[k]_close <= ((TV x R[k] + TR) x P[k]_oracle) / (TR x (1 + feeRate))
   *   if (s[k]_close < 0) : P[k]_close >= ((TR - TV x R[k]) x P[k]_oracle) / (TR x (1 - feeRate))
   *
   * 2. 要计算满足 afterTV >= afterTR 时的最差值
   *
   *   afterTV >= afterTR
   *   =>
   *   TV - S[k]_close x P[k]_close + S[k]_close x P[k]_oracle - abs(S[k]_close) x P[k]_close x feeRate >= TR - abs(S[k]_close) x P[k]_oracle x R[k]
   *   =>
   *   S[k]_close x P[k]_close + abs(S[k]_close) x P[k]_close x feeRate <= TV - TR + S[k]_close x P[k]_oracle + abs(S[k]_close) x P[k]_oracle x R[k]
   *   =>
   *   if (S[k]_close > 0) : P[k]_close x S[k]_close x (1 + feeRate) <= TV - TR + S[k]_close x P[k]_oracle x (1 + R[k])
   *   if (s[k]_close < 0) : P[k]_close x S[k]_close x (1 - feeRate) <= TV - TR + S[k]_close x P[k]_oracle x (1 - R[k])
   *   =>
   *   if (S[k]_close > 0) : P[k]_close <= (TV - TR + S[k]_close x P[k]_oracle x (1 + R[k])) / (S[k]_close x (1 + feeRate))
   *   if (s[k]_close < 0) : P[k]_close >= (TV - TR + S[k]_close x P[k]_oracle x (1 - R[k])) / (S[k]_close x (1 - feeRate))
   *
   * 3. 1&2 计算出的价格取最差价格
   *
   * @param oraclePrice 预言机价格
   * @param openSize 仓位大小
   * @param symbol 合约信息
   * @param collateralInfo 抵押品账户信息
   * @param feeRate 手续费率
   */
  static calculateWorstClosePrice(
    oraclePrice: string | number | BigNumber,
    openSize: string | BigNumber,
    symbol: SymbolEntity,
    collateralInfo: CollateralInfo,
    feeRate: string | number
  ): BigNumber {
    const {
      totalEquity: paramCollateralTotalEquity,
      starkExRiskValue: collateralStarkExRiskValue,
      pendingWithdrawAmount: collateralPendingWithdrawAmount,
      pendingTransferOutAmount: collateralPendingTransferOutAmount,
    } = collateralInfo;

    const collateralTotalEquity = BigNumber(paramCollateralTotalEquity)
      .minus(collateralPendingWithdrawAmount)
      .minus(collateralPendingTransferOutAmount);

    const starkExRiskRate = this.calculatePositionStarkExRiskRate(
      symbol,
      openSize,
      BigNumber(oraclePrice).toNumber()
    );
    const positionOpenSize = BigNumber(openSize);
    const cmpPositionOpenSizeToZero = positionOpenSize.comparedTo(0)!;

    if (cmpPositionOpenSizeToZero < 0) {
      // Buy to close short, so s[k]_close > 0
      const closePrice1 = BigNumber(
        collateralTotalEquity
          .multipliedBy(starkExRiskRate)
          .plus(collateralStarkExRiskValue)
          .multipliedBy(oraclePrice)
          .div(BigNumber(collateralStarkExRiskValue).multipliedBy(BigNumber(1).plus(feeRate)))
          .toFixed(getNumberPrecision(symbol.tickSize), BigNumber.ROUND_FLOOR),
      );
      const closePrice2 = BigNumber(
        collateralTotalEquity
          .minus(collateralStarkExRiskValue)
          .plus(
            positionOpenSize
              .negated()
              .multipliedBy(oraclePrice)
              .multipliedBy(BigNumber(1).plus(starkExRiskRate)),
          )
          .div(positionOpenSize.negated().multipliedBy(BigNumber(1).plus(feeRate)))
          .toFixed(getNumberPrecision(symbol.tickSize), BigNumber.ROUND_FLOOR),
      );
      return BigNumber.max(closePrice1, closePrice2);
    } else if (cmpPositionOpenSizeToZero > 0) {
      // Sell to close long, so s[k]_close < 0
      const closePrice1 = BigNumber(
        BigNumber(collateralStarkExRiskValue)
          .minus(collateralTotalEquity.multipliedBy(starkExRiskRate))
          .multipliedBy(oraclePrice)
          .div(BigNumber(collateralStarkExRiskValue).multipliedBy(BigNumber(1).minus(feeRate)))
          .toFixed(getNumberPrecision(symbol.tickSize), BigNumber.ROUND_CEIL),
      );
      const closePrice2 = BigNumber(
        collateralTotalEquity
          .minus(collateralStarkExRiskValue)
          .plus(
            positionOpenSize
              .negated()
              .multipliedBy(oraclePrice)
              .multipliedBy(BigNumber(1).minus(starkExRiskRate)),
          )
          .div(positionOpenSize.negated().multipliedBy(BigNumber(1).minus(feeRate)))
          .toFixed(getNumberPrecision(symbol.tickSize), BigNumber.ROUND_CEIL),
      );
      return BigNumber.min(closePrice1, closePrice2);
    } else {
      return BigNumber(0);
    }
  }

  /**
   * 计算清算价格 (考虑分档情况)
   * Calculate Liquidation Price
   */
  static calculateLiquidationPrice(
    oraclePrice: string | number,
    openSize: string | BigNumber,
    symbol: SymbolEntity,
    collateralInfo: CollateralInfo
  ): string {
    const {
      totalEquity: paramCollateralTotalEquity,
      starkExRiskValue: collateralStarkExRiskValue,
      pendingWithdrawAmount: collateralPendingWithdrawAmount,
      pendingTransferOutAmount: collateralPendingTransferOutAmount,
    } = collateralInfo;

    const positionOpenSize = openSize;
    const contract = symbol;

    let collateralTotalEquity = BigNumber(paramCollateralTotalEquity)
      .minus(collateralPendingWithdrawAmount)
      .minus(collateralPendingTransferOutAmount);
    const positionValue = BigNumber(positionOpenSize).multipliedBy(oraclePrice);

    const positionStackExRiskRate = BigNumber(
      contract.getRiskTier(positionValue.toString())?.starkExRisk || 0,
    ).div(BigNumber(2).pow(32));
    const positionStarkExRiskValue = positionValue.abs().multipliedBy(positionStackExRiskRate);

    if (BigNumber(positionOpenSize).gt(0)) {
      if (contract.riskTierList?.length == 0) {
        return BigNumber(0).toString();
      }

      for (let i = contract.riskTierList?.length - 1; i >= 0; i--) {
        const curRiskTier = contract.riskTierList[i];
        const preRiskTier = contract.riskTierList[i - 1];
        const startPositionExclusiveValue = !preRiskTier
          ? BigNumber(0)
          : preRiskTier.positionValueUpperBound;
        const endPositionInclusiveValue = curRiskTier.positionValueUpperBound;
        const starkExRiskRate = BigNumber(curRiskTier.starkExRisk).div(BigNumber(2).pow(32));

        const liquidatePrice = this.calculatePositionLiquidatePriceInternal({
          symbol,
          openSize: positionOpenSize,
          fixStarkExRiskRate: starkExRiskRate,
          oraclePrice,
          totalEquity: collateralTotalEquity,
          starkExRiskValue: BigNumber(collateralStarkExRiskValue)
            .minus(positionStarkExRiskValue)
            .plus(positionValue.abs().multipliedBy(starkExRiskRate)),
        });

        const liquidatePositionValueAbs = BigNumber(liquidatePrice)
          .multipliedBy(positionOpenSize)
          .abs();

        if (liquidatePositionValueAbs.lte(startPositionExclusiveValue)) {
          continue;
        } else if (liquidatePositionValueAbs.lte(endPositionInclusiveValue)) {
          return liquidatePrice.toString();
        } else {
          return BigNumber(endPositionInclusiveValue)
            .div(positionOpenSize)
            .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_FLOOR);
        }
      }
      return "0";
    } else if (BigNumber(positionOpenSize).lt(0)) {
      for (let i = 0; i < contract.riskTierList?.length; i++) {
        const curRiskTier = contract.riskTierList[i];
        const preRiskTier = contract.riskTierList[i - 1];
        const startPositionExclusiveValue = !preRiskTier
          ? BigNumber(0)
          : preRiskTier.positionValueUpperBound;
        const endPositionInclusiveValue = curRiskTier.positionValueUpperBound;
        const starkExRiskRate = BigNumber(curRiskTier.starkExRisk).div(BigNumber(2).pow(32));

        const liquidatePrice = this.calculatePositionLiquidatePriceInternal({
          symbol,
          openSize: positionOpenSize,
          fixStarkExRiskRate: starkExRiskRate,
          oraclePrice,
          totalEquity: collateralTotalEquity,
          starkExRiskValue: BigNumber(collateralStarkExRiskValue)
            .minus(positionStarkExRiskValue)
            .plus(positionValue.abs().multipliedBy(starkExRiskRate)),
        });

        const liquidatePositionValueAbs = BigNumber(liquidatePrice)
          .multipliedBy(positionOpenSize)
          .abs();

        if (liquidatePositionValueAbs.lte(startPositionExclusiveValue)) {
          let tmpPrice = BigNumber(
            BigNumber(startPositionExclusiveValue)
              .div(positionOpenSize)
              .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_CEIL),
          );
          if (tmpPrice.multipliedBy(positionOpenSize).abs().eq(liquidatePositionValueAbs)) {
            tmpPrice = tmpPrice.plus(contract.tickSize);
          }
          return tmpPrice.toString();
        } else if (liquidatePositionValueAbs.lte(endPositionInclusiveValue)) {
          return liquidatePrice.toString();
        } else {
          continue;
        }
      }
      return this.calculatePositionLiquidatePriceInternal({
        symbol,
        openSize: positionOpenSize,
        fixStarkExRiskRate: "1",
        oraclePrice,
        totalEquity: collateralTotalEquity,
        starkExRiskValue: collateralStarkExRiskValue,
      });
    }

    return "0";
  }
}
