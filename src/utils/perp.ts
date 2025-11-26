import BigNumber from 'bignumber.js'
import { usePerpStore } from '~/stores/perp'

export const getFeeRate = (contractId: string) => {
  const perpStore = usePerpStore()
  const account = perpStore.userInfo
  const metadata = perpStore.metadata
  const curContractIdToTradeSetting = account?.contractIdToTradeSetting?.[contractId]
  const curContractIdToMetadata = metadata?.contractList?.find?.((i) => i.contractId === contractId)
  const defaultTradeSetting = account?.defaultTradeSetting
  // Account contract configuration
  // If isSetFeeRate = true, directly return takerFeeRate & makerFeeRate
  if (curContractIdToTradeSetting?.isSetFeeRate) {
    return {
      takerFeeRate: curContractIdToTradeSetting?.takerFeeRate,
      makerFeeRate: curContractIdToTradeSetting?.makerFeeRate,
    }
  }
  // If isSetFeeDiscount = true, return
  // takerFeeRate = Contract.defaultTakerFeeRate x takerFeeDiscount
  // makerFeeRate = Contract.defaultMakerFeeRate x makerFeeDiscount
  if (curContractIdToTradeSetting?.isSetFeeDiscount) {
    return {
      takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate || '0').multipliedBy(curContractIdToTradeSetting?.takerFeeDiscount).toString(),
      makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate || '0').multipliedBy(curContractIdToTradeSetting?.makerFeeDiscount).toString(),
    }
  }

  // Account default configuration
  // If isSetFeeRate = true, directly return takerFeeRate & makerFeeRate
  if (defaultTradeSetting?.isSetFeeRate) {
    return {
      takerFeeRate: defaultTradeSetting?.takerFeeRate,
      makerFeeRate: defaultTradeSetting?.makerFeeRate,
    }
  }
  // If isSetFeeDiscount = true, return takerFeeRate = Contract.defaultTakerFeeRate x takerFeeDiscount, makerFeeRate = Contract.defaultMakerFeeRate x makerFeeDiscount
  if (defaultTradeSetting?.isSetFeeDiscount) {
    return {
      takerFeeRate: BigNumber(curContractIdToMetadata?.defaultTakerFeeRate || '0').multipliedBy(defaultTradeSetting?.takerFeeDiscount).toString(),
      makerFeeRate: BigNumber(curContractIdToMetadata?.defaultMakerFeeRate || '0').multipliedBy(defaultTradeSetting?.makerFeeDiscount).toString(),
    }
  }

  // Default configuration in contract settings
  return {
    takerFeeRate: curContractIdToMetadata?.defaultTakerFeeRate || '0',
    makerFeeRate: curContractIdToMetadata?.defaultMakerFeeRate || '0',
  }
}

export const getLeverageFromContractId = (contractId: string) => {
  const perpStore = usePerpStore()
  const account = perpStore.userInfo
  const metadata = perpStore.metadata
  const curContractIdToTradeSetting = account?.contractIdToTradeSetting?.[contractId]
  const curContractIdToMetadata = metadata?.contractList?.find((i) => i.contractId === contractId)
  const defaultTradeSetting = account?.defaultTradeSetting

  // Account contract configuration
  // If isSetMaxLeverage = true, directly return maxLeverage
  if (curContractIdToTradeSetting?.isSetMaxLeverage) {
    return curContractIdToTradeSetting?.maxLeverage
  }
  // Account default configuration
  // If isSetMaxLeverage = true, directly return maxLeverage
  if (defaultTradeSetting?.isSetMaxLeverage) {
    return defaultTradeSetting?.maxLeverage
  }
  // Default configuration in contract settings
  // Directly return maxLeverage = Contract.defaultLeverage
  return curContractIdToMetadata?.defaultLeverage
}


export const getMarginFromContractId = (data: {contractId: string; size: string}) => {
  const {contractId, size} = data
  const perpStore = usePerpStore()
  const contractList = perpStore?.contractList || []
  const contract = contractList.find(item => item.contractId === contractId)
  const price = contract?.oraclePrice || 0
  const value = new BigNumber(price || 0).times(new BigNumber(size || 0))
  const riskTierList = contract?.riskTierList || []
  const maintenanceMarginRequirementObj = riskTierList?.find?.(j => new BigNumber(value).lte(j?.positionValueUpperBound || 0))
  const maintenanceMarginRate = maintenanceMarginRequirementObj?.maintenanceMarginRate || 1
  return new BigNumber(maintenanceMarginRate).times(size).times(price).toFixed()
}

export function toTick(value: string | number, tick?: string | number) {
  // tick 不存在 或 tick === 0 → 直接返回原值
  if (tick === undefined || tick === null || new BigNumber(tick).isZero()) {
    return new BigNumber(value).toFixed()
  }

  const v = new BigNumber(value)
  const t = new BigNumber(tick)

  // v / t → floor → * t
  return v
    .div(t)
    .integerValue(BigNumber.ROUND_FLOOR)
    .times(t).toString()
}

// * 计算可用余额
export function calculateAvailableBalance(contractId: string) {
  const perpStore = usePerpStore()
  const contractList = perpStore?.contractList || []
  const contract = contractList.find(item => item.contractId === contractId)
  const clientAccountId = perpStore?.userInfo?.clientAccountId
  const openLever = getLeverageFromContractId(contractId)
}

// /**
//      * 计算可用余额
//      */
//     private void calculateAvailableBalance(SymbolModel symbol) {
//         try {
//             // 这里应该根据实际业务逻辑获取用户的可用余额
//             // 暂时使用示例数据
//             String quoteCoinId = symbol.quoteCoinId; // 计价币种，如USDT

//             // 从PrivateData获取账户余额信息
//             // 这里需要根据实际的数据结构来获取余额
//             // 暂时设置为示例值

//             String accountName = PrivateData.currentAccountData().clientAccountId;

//             String openLever = CoreCalculator.getOpenMaxLeverage(
//                     PrivateData.currentAccountData().id,
//                     symbol.contractId
//             );

//             CollateralModel collateralModel = PrivateData.currentAccountData().collateralManager.getCollateralModel(quoteCoinId);
//             BigDecimal availableAmount = CoreCalculator.getCollateralAvailableAmount(
//                     PrivateData.currentAccountData().id,
//                     collateralModel
//             );
//             String balance = DecimalExtensions.round(availableAmount, 2).toPlainString();

//             TickerModel tickerModel = MetaData.getInstance().ticker.getTickerModel(symbol.contractId);
//             String balanceText = "账户：" + accountName + "\n倍杠杆：" + openLever + "x" + "\n可用余额：" + balance + " " + "USD" + "\n最新价格：" + tickerModel.lastPrice + " USD" + "\n预言机价格：" + DecimalExtensions.floor(tickerModel.getOraclePriceDecimal(), symbol.pricePrecision).toPlainString() + " USD";

//             availableBalance.postValue(balanceText);
//         } catch (Exception e) {
//             availableBalance.postValue("可用余额: 0.00 USDT");
//         }
//     }

