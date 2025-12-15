/**
 * 持仓的相关计算
 */

import BigNumber from "bignumber.js";
import type { AccountInfo, IMetadata, IContract as ISymbol, RiskTier } from "../../types";
// import { RiskTier } from "../../types";
// import { ISymbol } from "@/types/symbol.types";
import { getNumberPrecision } from "../../utils";
import { Ticker } from "../entities/Ticker";
import { findRiskTier } from "./helper";

interface Contract {
  tickSize: string;
  riskTierList?: RiskTier[];
  pricePrecision?: number;
  [key: string]: any;
}

interface CollateralInfo {
  totalEquity: string;
  totalStarkExRiskValue: string;
  totalPendingWithdrawAmount: string;
  totalPendingTransferOutAmount: string;
}

/**
 * 以固定维持保证金率计算仓位清算价格工具方法
 * @param {object} param  parameter object
 * @param {object} param.contract 合约配置 like {tickSize:"0.1"}
 * @param {string} param.openSize 当前仓位的仓位数量 like "0.01"
 * @param {string} param.fixStarkExRiskRate 固定的 starkEx 风险率 (维持保证金率) like "0.01"
 * @param {string} param.oraclePrice 预言机价格 like "74234.1"
 * @param {string} param.totalEquity 总资产 Collateral.totalEquity like "234.1"
 * @param {string} param.starkExRiskValue Collateral.starkExRiskValue 当前仓位对应合约的抵押品总 starkEx 风险额 (总维持保证金) like "234.1"
 * @returns {string} result like "1231.12"
 */
export const calculatePositionLiquidatePriceInternal = ({
  contract,
  openSize,
  fixStarkExRiskRate,
  oraclePrice,
  totalEquity,
  starkExRiskValue,
}: {
  contract: Contract;
  openSize: string | BigNumber;
  fixStarkExRiskRate: string | BigNumber;
  oraclePrice: string | number;
  totalEquity: string | BigNumber;
  starkExRiskValue: string | BigNumber;
}): string => {
  const tickSize = contract.tickSize;
  let liquidatePriceInternal = "0";
  // 如果为多仓 即 Position.openSize > 0，且维持保证金率小于 1 (Position.openSize > 0 && Position.fixStarkExRiskRate < 1):
  // liquidatePriceInternal = oraclePrice - round_ceil( (Collateral.totalEquity - Collateral.starkExRiskValue) / ( Position.openSize x ( 1 - fixStarkExRiskRate) ), Contract.tickSize)
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
    // 如果合并后为空仓 (Position.openSize < 0)：
    // liquidatePriceInternal = oraclePrice - round_floor( (Collateral.totalEquity - Collateral.starkExRiskValue) / ( Position.openSize x ( 1 + fixStarkExRiskRate) ) , Contract.tickSize)
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
  // 其他情况没有清算价格，统一返回 0 即可
  return liquidatePriceInternal;
};

/**
 * 计算清算价格 (考虑分档情况)
 * @param {object} params                           参数
 * @param {object} params.contract                           合约配置
 * @param {string} params.oraclePrice                        当前仓位合约预言机价格
 * @param {string} params.positionOpenSize                   当前仓位开仓数量 (多仓为正，空仓为负)
 * @param {string} params.paramCollateralTotalEquity              当前仓位所属抵押品的总价值
 * @param {string} params.collateralStarkExRiskValue         当前仓位所属抵押品的总 starkEx 风险额 (等价于总维持保证金额，只是精度要求不同)
 * @param {string} params.collateralPendingWithdrawAmount    当前仓位所属抵押品的正在处理的提现金额之和
 * @param {string} params.collateralPendingTransferOutAmount 当前仓位所属抵押品的正在处理的转出金额之和
 * @return {string} 计算清算价格 (考虑分档情况)
 */
export const calculatePositionLiquidatePrice = ({
  contract,
  oraclePrice,
  positionOpenSize,
  paramCollateralTotalEquity,
  collateralStarkExRiskValue,
  collateralPendingWithdrawAmount,
  collateralPendingTransferOutAmount,
}: {
  contract: ISymbol;
  oraclePrice: string | number;
  positionOpenSize: string | BigNumber;
  paramCollateralTotalEquity: string | BigNumber;
  collateralStarkExRiskValue: string | BigNumber;
  collateralPendingWithdrawAmount: string | BigNumber;
  collateralPendingTransferOutAmount: string | BigNumber;
}): string => {
  let collateralTotalEquity = BigNumber(paramCollateralTotalEquity)
    .minus(collateralPendingWithdrawAmount)
    .minus(collateralPendingTransferOutAmount);
  const positionValue = BigNumber(positionOpenSize).multipliedBy(oraclePrice);

  const positionStackExRiskRate = BigNumber(
    findRiskTier(positionValue.toNumber() || 0, contract.riskTierList)?.starkExRisk || 0,
  ).div(BigNumber(2).pow(32));
  const positionStarkExRiskValue = positionValue.abs().multipliedBy(positionStackExRiskRate);
  if (BigNumber(positionOpenSize).gt(0)) {
    if (contract.riskTierList?.length == 0) {
      // 没有分档，则默认维持保证金率为 1，多仓是没有清算价格的
      return BigNumber(0).toString();
    }
    // 在多仓情况下的说明：
    // 由于分档维持保证金率 是随着仓位价值的减少而减少的
    // 当仓位数量固定时，即 随着价格下跌，仓位价值 和 维持保证率也是下降的
    // 这时就可能出现一种极端情况：
    //    在价格 A 的时候触发了清算，但是随着价格继续下跌，导致维持保证金率降档，
    //    反而在价格 B(价格 B 比价格 A 小) 的情况下不再满足清算条件
    // 我们计算规则只取最大的那个清算价格

    // 合并仓位后是多仓，从高档位往低档位依次计算

    for (let i = contract.riskTierList?.length - 1; i >= 0; i--) {
      const curRiskTier = contract.riskTierList[i];
      const preRiskTier = contract.riskTierList[i - 1];
      // 分档起始仓位价值 exclusive (第一档必须从 0 开始)
      const startPositionExclusiveValue = !preRiskTier
        ? BigNumber(0)
        : preRiskTier.positionValueUpperBound;
      // 分档结束仓位价值 inclusive,
      const endPositionInclusiveValue = curRiskTier.positionValueUpperBound;
      const starkExRiskRate = BigNumber(curRiskTier.starkExRisk).div(BigNumber(2).pow(32));
      const liquidatePrice = calculatePositionLiquidatePriceInternal({
        contract,
        oraclePrice,
        openSize: positionOpenSize,
        fixStarkExRiskRate: starkExRiskRate,
        totalEquity: collateralTotalEquity,
        starkExRiskValue: BigNumber(collateralStarkExRiskValue)
          .minus(positionStarkExRiskValue)
          .plus(positionValue.abs().multipliedBy(starkExRiskRate)), // 注意要调整下，保证使用了目标的固定 starkEx 风险率
      });
      const liquidatePositionValueAbs = BigNumber(liquidatePrice)
        .multipliedBy(positionOpenSize)
        .abs();
      if (liquidatePositionValueAbs.lte(startPositionExclusiveValue)) {
        // 当前区间都不在清算范围内，继续往下一个区间计算
        continue;
      } else if (liquidatePositionValueAbs.lte(endPositionInclusiveValue)) {
        return liquidatePrice.toString();
      } else {
        // 说明整个区间都会触发清算，那就以当前区间最大的价格作为清算价格
        return BigNumber(endPositionInclusiveValue)
          .div(positionOpenSize)
          .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_FLOOR);
      }
    }

    // 遍历所有档位都没找到清算价格，那就没有清算价格
    return "0";
  } else if (BigNumber(positionOpenSize).lt(0)) {
    // 合并仓位后是空仓，从低档位往高档位依次计算
    for (let i = 0; i < contract.riskTierList?.length; i++) {
      const curRiskTier = contract.riskTierList[i];
      const preRiskTier = contract.riskTierList[i - 1];
      // 分档起始仓位价值 exclusive (第一档必须从 0 开始)
      const startPositionExclusiveValue = !preRiskTier
        ? BigNumber(0)
        : preRiskTier.positionValueUpperBound;
      // 分档结束仓位价值 inclusive,
      const endPositionInclusiveValue = curRiskTier.positionValueUpperBound;
      const starkExRiskRate = BigNumber(curRiskTier.starkExRisk).div(BigNumber(2).pow(32));
      const liquidatePrice = calculatePositionLiquidatePriceInternal({
        contract,
        oraclePrice,
        openSize: positionOpenSize,
        fixStarkExRiskRate: starkExRiskRate,
        totalEquity: collateralTotalEquity,
        starkExRiskValue: BigNumber(collateralStarkExRiskValue)
          .minus(positionStarkExRiskValue)
          .plus(positionValue.abs().multipliedBy(starkExRiskRate)), // 注意要调整下，保证使用了目标的固定 starkEx 风险率
      });
      const liquidatePositionValueAbs = BigNumber(liquidatePrice)
        .multipliedBy(positionOpenSize)
        .abs();
      if (liquidatePositionValueAbs.lte(startPositionExclusiveValue)) {
        // 说明当前区间都会触发清算
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
        // 说明 [liquidatePrice, endPositionInclusiveValue] 这个区间才会触发清算
        return liquidatePrice.toString();
      } else {
        continue;
      }
    }
    // 没有分档，则按照维持保证金率为 1 计算清算价格
    return calculatePositionLiquidatePriceInternal({
      contract,
      oraclePrice,
      openSize: positionOpenSize,
      fixStarkExRiskRate: "1",
      totalEquity: collateralTotalEquity,
      starkExRiskValue: collateralStarkExRiskValue,
    });
  }

  return "0";
};
