import BigNumber from "bignumber.js";
import { PositionSide } from "../value-objects/OrderEnums";
import { getNumberPrecision, toTickSizeRoundString } from "../../utils";
import { SymbolEntity } from "../entities/Symbol";
import {
  calculateTPSLTriggerPrice,
  calculateROEFromPrice,
  calculateUnrealizedPnL,
  calculatePnLAtPrice,
  calculatePriceFromPnL,
  type PositionSide as CalcPositionSide,
} from "../calculators";

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
   * 根据 ROE 计算止盈触发价
   * 委托给 calculator 的纯函数
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
    if (BigNumber(leverage).isZero()) return null;

    const positionSide: CalcPositionSide =
      side === PositionSide.LONG || side === "LONG" ? "LONG" : "SHORT";

    const result = calculateTPSLTriggerPrice({
      entryPrice: String(entryPrice),
      roe: String(ratio),
      leverage: String(leverage),
      positionSide,
      isTakeProfit: true,
      pricePrecision: getNumberPrecision(priceStep),
    });

    // 返回 null 而非 "0" 以保持原有接口行为
    return result === "0" ? null : toTickSizeRoundString(Number(result), priceStep);
  }

  /**
   * 根据 ROE 计算止损触发价
   * 委托给 calculator 的纯函数
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
    if (BigNumber(leverage).isZero()) return null;

    const positionSide: CalcPositionSide =
      side === PositionSide.LONG || side === "LONG" ? "LONG" : "SHORT";

    const result = calculateTPSLTriggerPrice({
      entryPrice: String(entryPrice),
      roe: String(ratio),
      leverage: String(leverage),
      positionSide,
      isTakeProfit: false,
      pricePrecision: getNumberPrecision(priceStep),
    });

    return result === "0" ? null : toTickSizeRoundString(Number(result), priceStep);
  }

  /**
   * 根据触发价计算 ROE
   * 委托给 calculator 的纯函数
   */
  static calculateRatioFromPrice({
    entryPrice,
    triggerPrice,
    leverage,
    side,
    isTp,
  }: {
    entryPrice: string | number;
    triggerPrice: string | number;
    leverage: string | number;
    side: PositionSide | string;
    isTp: boolean;
  }): string | null {
    if (!entryPrice || !triggerPrice || !leverage) return null;

    const positionSide: CalcPositionSide =
      side === PositionSide.LONG || side === "LONG" ? "LONG" : "SHORT";

    return calculateROEFromPrice({
      entryPrice: String(entryPrice),
      triggerPrice: String(triggerPrice),
      leverage: String(leverage),
      positionSide,
      isTakeProfit: isTp,
    });
  }

  /**
   * 根据触发价计算预估盈亏金额
   * 委托给 calculator 的纯函数
   */
  static calculatePnLAmountFromPrice({
    entryPrice,
    triggerPrice,
    volume,
    side,
    pricePrecision,
    isTp,
  }: {
    entryPrice: string | number;
    triggerPrice: string | number;
    volume: string | number;
    side: PositionSide | string;
    pricePrecision: number;
    isTp: boolean;
  }): string | null {
    if (!entryPrice || !triggerPrice) return null;

    const positionSide: CalcPositionSide =
      side === PositionSide.LONG || side === "LONG" ? "LONG" : "SHORT";

    return calculatePnLAtPrice({
      entryPrice: String(entryPrice),
      triggerPrice: String(triggerPrice),
      size: String(volume || 0),
      side: positionSide,
      isTakeProfit: isTp,
      precision: pricePrecision,
    });
  }

  /**
   * 根据目标盈亏金额计算触发价
   * 委托给 calculator 的纯函数
   */
  static calculatePriceFromPnLAmount({
    entryPrice,
    amount,
    volume,
    side,
    priceStep,
    isTp,
  }: {
    entryPrice: string | number;
    amount: string | number;
    volume: string | number;
    side: PositionSide | string;
    priceStep: string;
    isTp: boolean;
  }): string | null {
    if (!entryPrice || !amount || !volume || Number(volume) === 0) return null;

    const positionSide: CalcPositionSide =
      side === PositionSide.LONG || side === "LONG" ? "LONG" : "SHORT";

    const result = calculatePriceFromPnL({
      entryPrice: String(entryPrice),
      pnlAmount: String(amount),
      size: String(volume),
      side: positionSide,
      isTakeProfit: isTp,
      precision: getNumberPrecision(priceStep),
    });

    if (result === null || BigNumber(result).lte(0)) return "0";

    // 使用 floor 取整以匹配原有行为
    return toTickSizeRoundString(Number(result), priceStep, true);
  }

  /**
   * 计算盈亏金额
   * 委托给 calculator 的纯函数
   *
   * 公式：
   * - 多仓: (平仓价 - 开仓价) × 数量
   * - 空仓: (开仓价 - 平仓价) × 数量
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
    const positionSide: CalcPositionSide =
      side === PositionSide.LONG || side === "LONG" ? "LONG" : "SHORT";

    return calculateUnrealizedPnL({
      side: positionSide,
      entryPrice: String(entryPrice),
      markPrice: String(exitPrice),
      size: String(size),
    });
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
