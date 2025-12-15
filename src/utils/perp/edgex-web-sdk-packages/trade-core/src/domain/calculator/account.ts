import BigNumber from "bignumber.js";
import { AccountInfo, IMetadata } from "@edgex/types";

/**
 * 账号相关的计算
 */

interface FeeRateResult {
  takerFeeRate: string | undefined;
  makerFeeRate: string | undefined;
}

/**
 * taker&maker 手续费率
 * @param {object} param parameter object
 * @param {string} param.contractId like "10000001"
 * @param {object} param.account like {contractIdToTradeSetting: {},defaultTradeSetting:{}},
 * @param {object} param.metadata like {contractList:[]},
 * @returns {object} result like {takerFeeRate: "0.0005", makerFeeRate: "0.0005"}
 */
export const getFeeRate = ({
  contractId,
  account,
  metadata,
}: {
  contractId: string;
  account: AccountInfo;
  metadata?: IMetadata;
}): FeeRateResult => {
  const curContractIdToTradeSetting = account?.contractIdToTradeSetting?.[contractId];
  const curContractIdToMetadata = metadata?.contractList?.find((i) => i.contractId === contractId)!;
  const defaultTradeSetting = account?.defaultTradeSetting;
  // 账户合约配置
  // 如果 isSetFeeRate = true, 则直接返回 takerFeeRate & makerFeeRate
  if (curContractIdToTradeSetting?.isSetFeeRate) {
    return {
      takerFeeRate: curContractIdToTradeSetting?.takerFeeRate,
      makerFeeRate: curContractIdToTradeSetting?.makerFeeRate,
    };
  }
  // 如果 isSetFeeDiscount = true, 则返回
  // takerFeeRate = Contract.defaultTakerFeeRate x takerFeeDiscount
  // makerFeeRate = Contract.defaultMakerFeeRate x makerFeeDiscount
  if (curContractIdToTradeSetting?.isSetFeeDiscount) {
    return {
      takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate!)
        .multipliedBy(curContractIdToTradeSetting?.takerFeeDiscount)
        .toString(),
      makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate!)
        .multipliedBy(curContractIdToTradeSetting?.makerFeeDiscount)
        .toString(),
    };
  }

  // 账户默认配置
  // 如果 isSetFeeRate = true, 则直接返回 takerFeeRate & makerFeeRate
  if (defaultTradeSetting?.isSetFeeRate) {
    return {
      takerFeeRate: defaultTradeSetting?.takerFeeRate,
      makerFeeRate: defaultTradeSetting?.makerFeeRate,
    };
  }
  // 如果 isSetFeeDiscount = true, 则返回 takerFeeRate = Contract.defaultTakerFeeRate x takerFeeDiscount, makerFeeRate = Contract.defaultMakerFeeRate x makerFeeDiscount
  if (defaultTradeSetting?.isSetFeeDiscount) {
    return {
      takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate!)
        .multipliedBy(defaultTradeSetting?.takerFeeDiscount)
        .toString(),
      makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate!)
        .multipliedBy(defaultTradeSetting?.makerFeeDiscount)
        .toString(),
    };
  }

  // 合约配置里的默认配置
  return {
    takerFeeRate: curContractIdToMetadata?.defaultTakerFeeRate,
    makerFeeRate: curContractIdToMetadata?.defaultMakerFeeRate,
  };
};

/**
 * 最大杠杆
 * @param {object} param parameter object
 * @param {string} param.contractId like "10000001"
 * @param {object} param.account like {contractIdToTradeSetting: {},defaultTradeSetting:{}},
 * @param {object} param.metadata like {contractList:[]},
 * @returns {string} maxLeverage like "10"
 */
export const getMaxLeverage = ({
  contractId,
  account,
  metadata,
}: {
  contractId: string;
  account: AccountInfo | undefined;
  metadata?: IMetadata;
}): number => {
  const curContractIdToTradeSetting = account?.contractIdToTradeSetting?.[contractId];
  const curContractIdToMetadata = metadata?.contractList?.find((i) => i.contractId === contractId);
  const defaultTradeSetting = account?.defaultTradeSetting;

  // 账户合约配置
  // 如果 isSetMaxLeverage = true, 则直接返回 maxLeverage
  if (curContractIdToTradeSetting?.isSetMaxLeverage) {
    return Number(curContractIdToTradeSetting?.maxLeverage);
  }
  // 账户默认配置
  // 如果 isSetMaxLeverage = true, 则直接返回 maxLeverage
  if (defaultTradeSetting?.isSetMaxLeverage) {
    return Number(defaultTradeSetting?.maxLeverage);
  }
  // 合约配置里的默认配置
  // 直接返回 maxLeverage = Contract.defaultLeverage
  return Number(curContractIdToMetadata?.defaultLeverage);
};
