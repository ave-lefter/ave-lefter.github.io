import BigNumber from 'bignumber.js'
import { usePerpStore } from '~/stores/perp'
import type { Position } from '~/stores/perp/type'

type RiskTierModel = ReturnType<typeof usePerpStore>['contractList'][0]['riskTierList'][0]

/**
 * 获取BigDecimal的小数位数
 * @param decimal BigDecimal值
 * @return 小数位数
 */
function getDecimalScale(decimal: BigNumber | number | string) {
  const str = decimal.toString()
  if (str.includes('.')) {
    return str.length - str.indexOf('.') - 1
  }
  return 0
}

// 计算价格精度
export function getPricePrecision(contractId: string) {
  const symbol = CoreCalculator.getSymbolModel(contractId)
  const tickSize = symbol?.tickSize || 0
  const tickSizeDecimal = new BigNumber(tickSize)
  if (tickSizeDecimal.gt(1)) {
    const reciprocal = new BigNumber(1).div(tickSizeDecimal)
    return -getDecimalScale(reciprocal)
  } else {
    return getDecimalScale(tickSizeDecimal)
  }
}

// 计算数量精度
export function getQuantityPrecision(contractId: string) {
  const symbol = CoreCalculator.getSymbolModel(contractId)
  const stepSize = symbol?.stepSize || 0
  const stepSizeDecimal = new BigNumber(stepSize)
  if (stepSizeDecimal.gt(1)) {
    const reciprocal = new BigNumber(1).dividedBy(stepSizeDecimal)
    return -getDecimalScale(reciprocal)
  } else {
    return getDecimalScale(stepSizeDecimal)
  }
}

// 排序
function orderSortByTime(a: OrderModel, b: OrderModel) {
  return BigNumber(b.createdTime || 0).minus(a.createdTime || 0).toNumber()
}

type OrderModel = ReturnType<typeof usePerpStore>['order'][0]
function orderSort(a: OrderModel, b: OrderModel): number {
  const sides = {
    'BUY': 1,
    'SELL': 2
  }
  let comparison = 0

  // 1. 按 contractId 升序
  const aContract = new BigNumber(a.contractId)
  const bContract = new BigNumber(b.contractId)
  if (!aContract.isNaN() && !bContract.isNaN()) {
    comparison = aContract.comparedTo(bContract) || 0
  } else {
    comparison = a.contractId.localeCompare(b.contractId)
  }
  if (comparison !== 0) return comparison

  // 2. 按 side 排序
  const aSide = sides[a.side]
  const bSide = sides[b.side]
  if (aSide != null && bSide != null) {
    comparison = aSide - bSide
    if (comparison !== 0) return comparison
  }

  // 3. 手动判断 price 是否为 0（bignumber）
  const aPriceZero = new BigNumber(a.price).isZero()
  const bPriceZero = new BigNumber(b.price).isZero()
  comparison = Number(aPriceZero) - Number(bPriceZero)
  if (comparison !== 0) return comparison

  // 4. 买卖方向价格排序
  const aPrice = new BigNumber(a.price)
  const bPrice = new BigNumber(b.price)

  if (!aPrice.isNaN() && !bPrice.isNaN()) {
    if (isBuy(a.side)) {
      comparison = bPrice.comparedTo(aPrice) || 0  // 买：价格从大到小
    } else {
      comparison = aPrice.comparedTo(bPrice) || 0  // 卖：价格从小到大
    }
  }
  if (comparison !== 0) return comparison

  // 5. 时间降序（条件单用 triggerTime，否则用 createdTime）
  const aTime = new BigNumber(
    isConditional(a.type) ? a.triggerTime : a.createdTime
  )
  const bTime = new BigNumber(
    isConditional(b.type) ? b.triggerTime : b.createdTime
  )

  if (!aTime.isNaN() && !bTime.isNaN()) {
    comparison = bTime.comparedTo(aTime) || 0
  }
  if (comparison !== 0) return comparison

  // 6. id 升序
  const aId = new BigNumber(a.id)
  const bId = new BigNumber(b.id)
  if (!aId.isNaN() && !bId.isNaN()) {
    comparison = aId.comparedTo(bId) || 0
  } else {
    comparison = a.id.localeCompare(b.id)
  }

  return comparison
}

// Helper 方法
function isBuy(side: string): boolean {
  return side === 'BUY' || side === 'buy'
}

function isConditional(type: string): boolean {
  return type === 'CONDITION' || type === 'conditional'
}

//  获取订单填充数据
//  根据订单和当前仓位计算开仓和平仓部分

function _getOrderFillData(data: {
  contractId: string
  orderModel: OrderModel
  positionOpenSize: string
}) {
  const symbol = CoreCalculator.getSymbolModel(data.contractId)
  const orderModel = data.orderModel
  const tokenStepSize = getDecimalScale(CoreCalculator.getCoinModel(symbol?.quoteCoinId || '')?.stepSize || '0')
  let orderLeftSize = new BigNumber(0)

  if (orderModel.status === 'PENDING' || orderModel.status === 'OPEN' || orderModel.status === 'CANCELING') {
    orderLeftSize = new BigNumber(orderModel.size || 0)
      .minus(orderModel.cumFailSize || 0)
      .minus(orderModel.cumFillSize || 0)
  } else {
    orderLeftSize = new BigNumber(orderModel.cumMatchSize || 0)
      .minus(orderModel.cumFailSize || 0)
      .minus(orderModel.cumFillSize || 0)

  }

  if (orderLeftSize.isZero()) {
    return {
      openSize: new BigNumber('0'),
      closeSize: new BigNumber('0'),
      openValue: new BigNumber('0'),
      closeValue: new BigNumber('0'),
    }
  }
  let orderLeftValue = new BigNumber(0)
  if (orderModel.isWithoutMatch) {
    orderLeftValue = orderLeftSize.times(new BigNumber(orderModel?.withoutMatchFillValue || 0)).div(orderModel?.withoutMatchFillSize || 0)
    if (orderModel.side === 'BUY') {
      orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_CEIL)
    } else {
      orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_FLOOR)
    }
  } else if (BigNumber(orderModel.price).isZero()) {
    orderLeftValue = orderLeftSize.times(new BigNumber(orderModel?.marketLimitValue || 0)).div(orderModel?.size || 0)
    if (orderModel.side === 'BUY') {
      orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_CEIL)
    } else {
      orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_FLOOR)
    }
  } else {
    orderLeftValue = orderLeftSize.times(orderModel.price || 0)
  }

  let orderCloseSize = new BigNumber(0)
  if (orderModel.side === 'BUY' && new BigNumber(data.positionOpenSize).lt(0)) {
    orderCloseSize = BigNumber.min(orderLeftSize, new BigNumber(data.positionOpenSize).negated())
  } else if (orderModel.side === 'SELL' && new BigNumber(data.positionOpenSize).gt(0)) {
    orderCloseSize = BigNumber.max(orderLeftSize.negated(), new BigNumber(data.positionOpenSize).negated())
  }

  let orderOpenSize = new BigNumber(0)
  if (orderModel.side === 'BUY') {
    orderOpenSize = orderLeftSize.minus(orderCloseSize)
  } else {
    orderOpenSize = orderLeftSize.negated().minus(orderCloseSize)
  }


  let orderCloseValue = orderCloseSize.times(orderLeftValue).div(orderLeftSize)
  orderCloseValue = orderCloseValue.decimalPlaces(Number(tokenStepSize || 0), BigNumber.ROUND_FLOOR)
  const orderOpenValue = orderModel.side === 'BUY' ? orderLeftValue.minus(orderCloseValue) : orderLeftValue.negated().minus(orderCloseValue)

  return {
    openSize: orderOpenSize,
    closeSize: orderCloseSize,
    openValue: orderOpenValue,
    closeValue: orderCloseValue
  }
}

export class CoreCalculator {
  static getUserInfo() {
    const perpStore = usePerpStore()
    return perpStore.userInfo
  }
  // 获取交易对模型
  static getSymbolModel(contractId: string) {
    const perpStore = usePerpStore()
    const contractList = perpStore?.contractList || []
    const contract = contractList.find(item => item.contractId === contractId)
    return contract
  }

  static getCoinModel(coinId: string) {
    const perpStore = usePerpStore()
    const metadata = perpStore.metadata
    return metadata?.coinList?.find(i => i.coinId === coinId)
  }

  /**
   * 计算仓位平均开仓价格
   * 如果是多仓(openSize > 0)，要向上取整
   * 如果是空仓(openSize < 0)，要向下取整
   */
  static getPositionAvgEntryPrice(openSize: string, openValue: string, pricePrecision: number) {
    const openSizeDecimal = new BigNumber(openSize)
    const openValueDecimal = new BigNumber(openValue)
    if (openSizeDecimal.isZero()) {
      return new BigNumber(0)
    }

    const avgEntryPrice = openValueDecimal.div(openSizeDecimal)
    if (openSizeDecimal.gt(0)) {
      // 多仓向上取整
      return avgEntryPrice.decimalPlaces(pricePrecision, BigNumber.ROUND_CEIL)
    } else {
      // 空仓向下取整
      return avgEntryPrice.decimalPlaces(pricePrecision, BigNumber.ROUND_FLOOR)
    }
  }

  /**
   * 根据某个合约的仓位价值查找到对应的风险档位
   * @param positionValue 仓位价值 (多仓为正，空仓为负)
   * @param riskTierList 风险档位列表
   * @return 风险档位
   */
  static getPositionRiskTier(positionValue: string, contractId: string) {
    const perpStore = usePerpStore()
    const riskTierList = perpStore.contractList.find(i => i.contractId === contractId)?.riskTierList || []
    const positionValueAbs = new BigNumber(positionValue).abs()
    for (const curRiskTier of riskTierList) {
      if (new BigNumber(positionValueAbs).lte(curRiskTier.positionValueUpperBound)) {
        return curRiskTier
      }
    }
    if (riskTierList.length > 0) {
      return riskTierList[riskTierList.length - 1]
    }
    return null
  }

  /**
   * 获取开仓杠杆
   */
  static getOpenMaxLeverage(contractId: string) {
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

  /**
   * 获取仓位价值对应风险档位杠杆
   */
  static getPositionMaxLeverage(contractId: string, positionValue: string) {
    const perpStore = usePerpStore()
    const openMaxLeverage = CoreCalculator.getOpenMaxLeverage(contractId) // 获取开仓杠杆
    const riskTier = CoreCalculator.getPositionRiskTier(positionValue, contractId) // 获取仓位价值对应风险档位

    if (riskTier == null) {
      return openMaxLeverage
    }
    const minLeverage = DecimalExtensions.min(new BigNumber(openMaxLeverage || 0), new BigNumber(riskTier.maxLeverage))
    return minLeverage.decimalPlaces(0, BigNumber.ROUND_FLOOR).toString()
  }

  /**
  * 将最大开仓杠杆转换为初始保证金率 (保留小数点后6位，向下取整)
  */
  static getInitialMarginRateWithMaxLeverage(maxLeverage: string) {
    const leverageDecimal = DecimalExtensions.toDecimal(maxLeverage)
    if (leverageDecimal.lt(new BigNumber(1))) {
      return '1'
    }
    return DecimalExtensions.floor(DecimalExtensions.divide(new BigNumber(1), leverageDecimal), 6)
  }

  /**
  * 计算仓位初始保证金要求
  */
  static getPositionInitialMarginRequirement(positionValue: string, initialMarginRate: string) {
    return DecimalExtensions.multiply(initialMarginRate, positionValue)
  }

  /**
  * 计算仓位根据合约风险档位计算的实际 starkEx风险率
  */
  static getPositionStarkExRiskRate(contractId: string, positionValue: string) {
    const contractRisk = CoreCalculator.getPositionRiskTier(positionValue, contractId)
    if (contractRisk !== null) {
      const divisor = new BigNumber(2).pow(32)
      return DecimalExtensions.divide(DecimalExtensions.toDecimal(contractRisk.starkExRisk), divisor)
    }
    return '0'
  }

  /**
   * 计算仓位starkEx风险额/维持保证金额
   */
  static getPositionStarkExRiskValue(positionValue: string, starkExRiskRate: string) {
    return DecimalExtensions.multiply(positionValue, starkExRiskRate)
  }

  // 清算价格。如果为0代表不存在清算价
  static _getPositionLiquidatePriceInternal(data: {
    openSize: string
    oraclePrice: string
    collateralTotalEquity: string
    collateralStarkExRiskValue: string
    fixStarkExRiskRate: string
    contractId: string
  }) {
    let symbol = CoreCalculator.getSymbolModel(data.contractId)
    let openSize = new BigNumber(data.openSize)
    let oraclePrice = new BigNumber(data.oraclePrice)
    let collateralTotalEquity = new BigNumber(data.collateralTotalEquity)
    let collateralStarkExRiskValue = new BigNumber(data.collateralStarkExRiskValue)
    let fixStarkExRiskRate = new BigNumber(data.fixStarkExRiskRate)


    if (openSize.isZero()) {
      return new BigNumber(0)
    }

    if (openSize.gt(0)) {
      // 合并后为多仓 向上取整
      if (fixStarkExRiskRate.gt(0) && fixStarkExRiskRate.lt(1)) {
        // 维持保证金率在 (0, 1) 区间
        const divisor = openSize.multipliedBy(fixStarkExRiskRate.plus(1))
        const dividend = oraclePrice.multipliedBy(divisor).minus(collateralTotalEquity.minus(collateralStarkExRiskValue))
        const pricePrecision = getPricePrecision(data.contractId)
        let result = dividend.div(divisor).decimalPlaces(pricePrecision, BigNumber.ROUND_FLOOR)
        if (result.multipliedBy(divisor).isEqualTo(dividend)) {
          // 如果计算出的数据正好相等，要减去一个精度 满足严格小于要求
          result = result.minus(DecimalExtensions.toDecimal(symbol?.tickSize || 0))
        }
        return result
      } else {
        return '0'
      }
    } else if (openSize.lt(0)) {
      // 合并后为空仓 向下取整
      if (fixStarkExRiskRate.gt(0)) {
        const divisor = openSize.times(fixStarkExRiskRate.plus(1))
        const dividend = oraclePrice.times(divisor).minus(collateralTotalEquity.minus(collateralStarkExRiskValue))
        // result = DecimalExtensions.divide(dividend, divisor).setScale(symbol.pricePrecision, RoundingMode.FLOOR)
        const pricePrecision = getPricePrecision(data.contractId)
        const result = dividend.div(divisor).decimalPlaces(pricePrecision, BigNumber.ROUND_FLOOR)
        if (result.times(divisor).isEqualTo(dividend)) {
          // 如果计算出的数据正好相等，要加上一个精度 满足严格大于要求
          return result.plus(symbol?.tickSize || 0)
        }
        return result
      } else if (fixStarkExRiskRate.gte(1)) {
        // 维持保证金率 = 1，没有清算价格
        // 维持保证金率 > 1, 即便有清算价格，也不要用这个价格。因为这个是大于等于清算价格才触发清算
        return '0'
      } else {
        return '0'
      }
    } else {
      return '0'
    }
  }
  //持仓清单价计算
  //Position.liquidatePrice (仓位实际清算价格，即考虑风险分档之后的清算价格)
  // 如果 Position.openSize > 0 (即为多仓)，按照分档从高档位 到低挡位以次开始试算
  // 注意：如果当前仓位价值高于最后一档的结束价值，则没有清算价格
  // 使用当前档位的starkExRiskRate作为 fixStarkExRiskRate 计算清算价格后， 用 liquidatePositionValue = 清算价格 x abs(仓位数量)，判断这个价值 在当前分档的情况
  // 第一种：liquidatePositionValue <= 低一档档位结束价值，说明当前清算价格在这个档位之前，这个清算价格作废，继续试算低一档
  // 第二种：liquidatePositionValue > 低一档档位开始价值 且 <= 当前档结束价值，说明当前清算价格在这个档位内，这个清算价格就是最终的清算价，结束试算
  // 第三种: liquidatePositionValue > 当前档结束价值, 说明清算价格在当前档结束。返回 当前档结束价值 / 仓位数量，作为清算价格 (注意，要向下取整)
  // 如果 Position.openSize < 0 (即为空仓)，再按照分档从低档位到高挡位以次开始试算
  // 注意：如果当前仓位价值绝对值高于最后一档的开始价值，则假定有一档，从最后一档结束价值开始，到无穷大，维持保证金率为1
  // 使用当前档位的starkExRiskRate作为 fixStarkExRiskRate 计算清算价格后， 用 liquidatePositionValue = 清算价格 x abs(仓位数量)，判断这个价值 在当前分档的情况
  // 第一种：liquidatePositionValue <= 低一档档位结束价值，说明当前清算价格在这个档位之前，返回 低一档档位结束价值 / 仓位数量，作为清算价格 (注意，要向上取整)
  // 第二种：liquidatePositionValue > 低一档档位结束价值 且 <= 当前档档位结束价值，说明当前清算价格在这个档位内，这个清算价格就是最终的清算价，结束试算
  // 第三种: liquidatePositionValue > 当前档档位结束价值，说明当前清算价格在这个档位之后，这个清算价格作废，继续试算高一档
  static getPositionLiquidatePrice(data: {
    contractId: string,
    oraclePrice: string,
    positionOpenSize: string,
    collateralTotalEquity: string,
    collateralStarkExRiskValue: string,
    collateralPendingWithdrawAmount: string,
    collateralPendingTransferOutAmount: string
  }) {
    const contract = CoreCalculator.getSymbolModel(data.contractId)
    const oraclePrice = new BigNumber(data.oraclePrice)
    const positionOpenSize = new BigNumber(data.positionOpenSize)
    let collateralTotalEquity = new BigNumber(data.collateralTotalEquity)
    const collateralStarkExRiskValue = new BigNumber(data.collateralStarkExRiskValue)
    const collateralPendingWithdrawAmount = new BigNumber(data.collateralPendingWithdrawAmount)
    const collateralPendingTransferOutAmount = new BigNumber(data.collateralPendingTransferOutAmount)
    collateralTotalEquity = collateralTotalEquity.minus(collateralPendingWithdrawAmount).minus(collateralPendingTransferOutAmount)
    const positionValue = positionOpenSize.multipliedBy(oraclePrice)

    const positionStarkExRiskValue = CoreCalculator.getPositionStarkExRiskValue(positionValue.toFixed(), CoreCalculator.getPositionStarkExRiskRate(data?.contractId || '', positionValue.toFixed()))
    const riskTierList = contract?.riskTierList || []
    if (positionOpenSize.gt(0)) {
      if (riskTierList.length === 0) {
        // 没有分档，则默认维持保证金率为1，多仓是没有清算价格的
        return '0'
      }
      // 在多仓情况下的说明：
      // 由于分档维持保证金率 是随着仓位价值的减少而减少的
      // 当仓位数量固定时，即 随着价格下跌，仓位价值 和 维持保证率也是下降的
      // 这时就可能出现一种极端情况：
      //    在价格A的时候触发了清算，但是随着价格继续下跌，导致维持保证金率降档，
      //    反而在价格B(价格B比价格A小)的情况下不再满足清算条件
      // 我们计算规则只取最大的那个清算价格

      // 合并仓位后是多仓，从高档位往低档位依次计算
      for (let i = riskTierList.length - 1; i >= 0; i--) {
        const curRiskTier = riskTierList[i]
        const preRiskTier = i > 0 ? riskTierList[i - 1] : null
        // 分档起始仓位价值 exclusive (第一档必须从0开始)
        const startPositionExclusiveValue = new BigNumber(preRiskTier?.positionValueUpperBound || '0')
        // 分档结束仓位价值 inclusive
        const endPositionInclusiveValue = new BigNumber(curRiskTier.positionValueUpperBound)
        const starkExRiskRate = new BigNumber(curRiskTier.starkExRisk).dividedBy(new BigNumber(2).pow(32))
        const liquidatePrice = CoreCalculator._getPositionLiquidatePriceInternal({
          contractId: data.contractId,
          oraclePrice: oraclePrice.toFixed(),
          collateralTotalEquity: collateralTotalEquity.toFixed(),
          collateralStarkExRiskValue: collateralStarkExRiskValue.minus(positionStarkExRiskValue).plus(positionValue.abs().times(starkExRiskRate)).toFixed(),
          fixStarkExRiskRate: starkExRiskRate.toFixed(),
          openSize: positionOpenSize.toFixed()
        })
        const liquidatePositionValueAbs = new BigNumber(liquidatePrice).multipliedBy(positionOpenSize).abs()
        if (new BigNumber(liquidatePrice).lte(0)) {
          return liquidatePrice
        } else if (liquidatePositionValueAbs.lte(startPositionExclusiveValue)) {
          // 当前区间都不在清算范围内，继续往下一个区间计算
          continue
        } else if (liquidatePositionValueAbs.lte(endPositionInclusiveValue)) {
          return liquidatePrice
        } else {
          // 说明整个区间都会触发清算，那就以当前区间最大的价格作为清算价格
          const pricePrecision = getPricePrecision(data.contractId)
          return endPositionInclusiveValue.dividedBy(positionOpenSize.abs()).decimalPlaces(pricePrecision, BigNumber.ROUND_FLOOR)
        }
      }
      // 遍历所有档位都没找到清算价格，那就没有清算价格
      return '0'
    } else if (positionOpenSize.lt(0)) {
      // console.log('positionOpenSize----', positionOpenSize.toFixed(), riskTierList)
      // 合并仓位后是空仓，从低档位往高档位依次计算
      for (let i = 0; i < riskTierList.length; i++) {
        const curRiskTier = riskTierList[i]
        const preRiskTier = i > 0 ? riskTierList[i - 1] : null
        const startPositionExclusiveValue = new BigNumber(preRiskTier?.positionValueUpperBound || '0')
        const endPositionInclusiveValue = new BigNumber(curRiskTier.positionValueUpperBound)
        const starkExRiskRate = new BigNumber(curRiskTier.starkExRisk).dividedBy(new BigNumber(2).pow(32))

        const liquidatePrice = CoreCalculator._getPositionLiquidatePriceInternal({
          contractId: data.contractId,
          oraclePrice: oraclePrice.toFixed(),
          collateralTotalEquity: collateralTotalEquity.toFixed(),
          collateralStarkExRiskValue: collateralStarkExRiskValue.minus(positionStarkExRiskValue).plus(positionValue.abs().times(starkExRiskRate)).toFixed(),
          fixStarkExRiskRate: starkExRiskRate.toFixed(),
          openSize: positionOpenSize.toFixed()
        })
        const liquidatePositionValueAbs = new BigNumber(liquidatePrice).times(positionOpenSize).abs()
        if (liquidatePositionValueAbs.lte(startPositionExclusiveValue)) {
          // 说明当前区间都会触发清算
          const tmpPrice = startPositionExclusiveValue.div(positionOpenSize).decimalPlaces(getPricePrecision(data.contractId), BigNumber.ROUND_CEIL)
          if (tmpPrice.times(positionOpenSize).abs().isEqualTo(liquidatePositionValueAbs)) {
            return tmpPrice.plus(new BigNumber(contract?.tickSize || 0))
          } else {
            return tmpPrice
          }
        } else if (liquidatePositionValueAbs.lte(endPositionInclusiveValue)) {
          return liquidatePrice
        }
      }

      // 没有分档，则按照维持保证金率为1计算清算价格
      return CoreCalculator._getPositionLiquidatePriceInternal({
        contractId: data.contractId,
        oraclePrice: oraclePrice.toFixed(),
        collateralTotalEquity: collateralTotalEquity.toFixed(),
        collateralStarkExRiskValue: collateralStarkExRiskValue.toFixed(),
        fixStarkExRiskRate: '1',
        openSize: positionOpenSize.toFixed()
      })
    }
    return '0'
  }

  /**
     * 获取最大交易手续费率
     *
     * @param contractId 合约ID
     * @return 最大交易手续费率
     */
  static getMaxTradeFeeRate(contractId: string) {
    const accountInfoModel = CoreCalculator.getUserInfo()
    const symbolModel = CoreCalculator.getSymbolModel(contractId)
    let takerFeeRate = new BigNumber(symbolModel?.defaultTakerFeeRate || 0)
    let makerFeeRate = new BigNumber(symbolModel?.defaultMakerFeeRate || 0)
    if (!accountInfoModel?.id || !symbolModel?.contractId) {
      return BigNumber.max(takerFeeRate, makerFeeRate)
    }
    const contractIdToTradeSetting = accountInfoModel?.contractIdToTradeSetting?.[contractId]
    if (contractIdToTradeSetting) {
      if (contractIdToTradeSetting?.isSetFeeRate) {
        takerFeeRate = new BigNumber(contractIdToTradeSetting?.takerFeeRate || 0)
        makerFeeRate = new BigNumber(contractIdToTradeSetting?.makerFeeRate || 0)
        return BigNumber.max(takerFeeRate, makerFeeRate)
      } else if (contractIdToTradeSetting?.isSetFeeDiscount) {
        takerFeeRate = takerFeeRate.multipliedBy(new BigNumber(contractIdToTradeSetting?.takerFeeDiscount || 0))
        makerFeeRate = makerFeeRate.multipliedBy(new BigNumber(contractIdToTradeSetting?.makerFeeDiscount || 0))
        return BigNumber.max(takerFeeRate, makerFeeRate)
      }
    }
    const defaultTradeSetting = accountInfoModel?.defaultTradeSetting
    if (defaultTradeSetting?.isSetFeeRate) {
      takerFeeRate = new BigNumber(defaultTradeSetting?.takerFeeRate || 0)
      makerFeeRate = new BigNumber(defaultTradeSetting?.makerFeeRate || 0)
      return BigNumber.max(takerFeeRate, makerFeeRate)
    }
    if (defaultTradeSetting?.isSetFeeDiscount) {
      takerFeeRate = takerFeeRate.multipliedBy(new BigNumber(defaultTradeSetting?.takerFeeDiscount || 0))
      makerFeeRate = makerFeeRate.multipliedBy(new BigNumber(defaultTradeSetting?.makerFeeDiscount || 0))
      return BigNumber.max(takerFeeRate, makerFeeRate)
    }
    return BigNumber.max(takerFeeRate, makerFeeRate)
  }

  /**
    * 开仓占用保证金
    * orderLossValue(仅考虑亏损情况，不考虑盈利) = max(orderOpenValue - orderOpenSize x oraclePrice, 0)
    * orderInitialMarginRequirement = abs(orderOpenSize) x oraclePrice x initialMarginRate
    * orderFillFee = abs(orderOpenValue) x feeRate
    * 买入开多 占用保证金 = abs(orderOpenSize) x (max (orderOpenPrice - oraclePrice, 0) + oraclePrice x initialMarginRate + orderOpenPrice x feeRate)
    * 卖出开空 占用保证金 = abs(orderOpenSize) x (max (oraclePrice - orderOpenPrice, 0) + oraclePrice x initialMarginRate + orderOpenPrice x feeRate)
    */
  static _getOpenOrderFrozenAmount(data: {
    oraclePrice: string
    initialMarginRate: string
    orderOpenSize: string
    orderOpenValue: string
    feeRate: string
  }) {
    const oraclePrice = new BigNumber(data.oraclePrice || '0')
    const initialMarginRate = new BigNumber(data.initialMarginRate || '0')
    const orderOpenSize = new BigNumber(data.orderOpenSize || '0')
    const orderOpenValue = new BigNumber(data.orderOpenValue || '0')
    const feeRate = new BigNumber(data.feeRate || '0')
    // 计算开仓损失(仅考虑亏损情况，不考虑盈利)
    const orderLossValue = BigNumber.max(orderOpenValue.minus(oraclePrice.times(orderOpenSize)), new BigNumber(0))
    // 开仓成交后的增加的初始保证金
    const orderInitialMarginRequirement = oraclePrice.times(initialMarginRate).times(orderOpenSize.abs())
    // 手续费
    const orderFillFee = orderOpenValue.abs().times(feeRate)
    return orderLossValue.plus(orderInitialMarginRequirement).plus(orderFillFee).toFixed()
  }


  /**
     * 平仓占用保证金
     * orderLossValue = orderCloseValue - orderCloseSize x oraclePrice
     * orderInitialMarginRequirement = - abs(orderCloseSize) x oraclePrice x initialMarginRate
     * orderFillFee = abs(orderCloseValue) x feeRate
     */

  static _getCloseOrderFrozenAmount(data: {
    oraclePrice: string
    initialMarginRate: string
    orderCloseSize: string
    orderCloseValue: string
    feeRate: string
  }) {
    const oraclePrice = new BigNumber(data.oraclePrice || '0')
    const initialMarginRate = new BigNumber(data.initialMarginRate || '0')
    const orderCloseSize = new BigNumber(data.orderCloseSize || '0')
    const orderCloseValue = new BigNumber(data.orderCloseValue || '0')
    const feeRate = new BigNumber(data.feeRate || '0')
    // 平仓损失
    const orderLossValue = orderCloseValue.minus(oraclePrice.times(orderCloseSize))
    // 平仓成交后的减少的初始保证金
    const orderInitialMarginRequirement = oraclePrice.times(initialMarginRate).times(orderCloseSize.abs())
    // 手续费
    const orderFillFee = orderCloseValue.abs().times(feeRate)
    // console.log('orderLossValue', orderLossValue.toFixed(), 'orderInitialMarginRequirement', orderInitialMarginRequirement.toFixed(), 'orderFillFee', orderFillFee.toFixed(), orderLossValue.minus(orderInitialMarginRequirement).plus(orderFillFee).toFixed())
    return orderLossValue.minus(orderInitialMarginRequirement).plus(orderFillFee).toFixed()
  }

  /**
   * 计算 open value 可开成本
   */
  static getCreateOrderCost(data: {
    accountId?: string
    contractId: string
    orderSide: string
    orderPrice: string
    orderSize: string
    leverage?: string
  }) {

    const orderPrice = new BigNumber(data.orderPrice)
    const orderSide = data.orderSide
    const orderSize = new BigNumber(data.orderSize)
    const contract = CoreCalculator.getSymbolModel(data.contractId)
    const perpStore = usePerpStore()
    const positionList = perpStore.position?.filter?.(item => item.contractId === data.contractId) || []
    let positionOpenSize = positionList.length > 0 ? new BigNumber(positionList[0].openSize) : new BigNumber(0)
    // 订单排序
    const curOrder = {
      id: 0,
      contractId: data.contractId,
      side: orderSide,
      price: orderPrice.toFixed(),
      type: 'LIMIT',
      createdTime: '0',
      triggerTime: '0',
      size: orderSize.toFixed(),
      status: 'OPEN',
      cumFailSize: '0',
      cumSize: '0',
      cumFee: '0',
      cumRealizedPnl: '0',
    }
    let orderList = (perpStore.order?.filter?.(item => item.contractId === data.contractId && !item.isPositionTpsl) || [])?.sort(orderSortByTime)
    orderList = orderList.filter(item => !(item.status === 'UNTRIGGERED' && item.side !== orderSide))
    for (let i = 0; i < orderList.length; i++) {
      const orderModel = orderList[i]
      if (orderSort(curOrder as any, orderModel) >= 0) {
        const fillModel = _getOrderFillData({
          contractId: data.contractId,
          orderModel,
          positionOpenSize: positionOpenSize.toFixed()
        })
        positionOpenSize = positionOpenSize.plus(fillModel?.closeSize || 0).plus(fillModel?.openSize || 0)
      }
    }


    const model = _getOrderFillData({
      contractId: data.contractId,
      orderModel: curOrder as any,
      positionOpenSize: positionOpenSize.toFixed()
    })
    const feeRate = CoreCalculator.getMaxTradeFeeRate(data.contractId)
    const oraclePrice = new BigNumber(contract?.oraclePrice || 0)

    const openAmount = CoreCalculator._getOpenOrderFrozenAmount({
      oraclePrice: oraclePrice.toFixed(),
      initialMarginRate: CoreCalculator.getInitialMarginRateWithMaxLeverage(data.leverage || CoreCalculator.getOpenMaxLeverage(data?.contractId || '0') || '0'),
      orderOpenSize: model.openSize.toFixed(),
      orderOpenValue: model.openSize.times(orderPrice).toFixed(),
      feeRate: feeRate.toFixed()
    })

    const closeAmount = CoreCalculator._getCloseOrderFrozenAmount({
      oraclePrice: oraclePrice.toFixed(),
      initialMarginRate: CoreCalculator.getInitialMarginRateWithMaxLeverage(data.leverage ||CoreCalculator.getOpenMaxLeverage(data?.contractId || '0') || '0'),
      orderCloseSize: model.closeSize.toFixed(),
      orderCloseValue: model.closeSize.times(orderPrice).toFixed(),
      feeRate: feeRate.toFixed()
    })


    return BigNumber.max(new BigNumber(openAmount).plus(new BigNumber(closeAmount)), 0).decimalPlaces(4, BigNumber.ROUND_DOWN)
  }

  /**
 * 获取抵押品待提现金额
 */
  static getCollateralPendingWithdrawAmount(coinId: string) {
    const perpStore = usePerpStore()
    const withdrawList = perpStore?.withdraw || []
    let totalAmount = new BigNumber(0)
    withdrawList.forEach(item => {
      if (item.coinId === coinId) {
        totalAmount = totalAmount.plus(new BigNumber(item.amount))
      }
    })
    return totalAmount
  }

  /**
   * 获取抵押品待转出金额
   */
  static getCollateralPendingTransferOutAmount(coinId: string) {
    const perpStore = usePerpStore()
    const transferOutList = perpStore?.transferOut || []
    let totalAmount = new BigNumber(0)
    transferOutList.forEach(item => {
      if (item.coinId === coinId && (item.status === 'PENDING_CHECKING' || item.status === 'PENDING_CENSORING')) {
        totalAmount = BigNumber.max(totalAmount.plus(new BigNumber(item.amount)), 0)
      }
    })
    return totalAmount
  }

  /**
   * 获取抵押品总权益
   */
  static getCollateralTotalEquity(coinId: string) {
    const perpStore = usePerpStore()
    const positionList = perpStore?.position || []
    const collateral = (perpStore?.collateral || [])?.find(item => item.coinId === coinId)
    let collateralTotalEquity = new BigNumber(collateral?.amount || 0)
    // 获取所有
    positionList.forEach(position => {
      let symbol = CoreCalculator.getSymbolModel(position.contractId)
      if (symbol?.quoteCoinId === coinId) {
        let ticker = perpStore.contractList.find(item => item.contractId === position.contractId)
        let oraclePrice = new BigNumber(ticker?.oraclePrice || 0)
        let positionValue = new BigNumber(position?.openSize || 0).times(oraclePrice || 0)
        collateralTotalEquity = collateralTotalEquity.plus(positionValue)
      }
    })
    return collateralTotalEquity
  }
  /**
 * 获取StarkEx风险价值
 */
  static getStarkExRiskValue(coinId: string) {
    const perpStore = usePerpStore()
    const itemAcctData = CoreCalculator.getUserInfo()
    let totalRiskValue = new BigNumber(0)
    const positionList = perpStore?.position || []
    // 遍历所有仓位计算StarkEx风险价值
    positionList.forEach(position => {
      let symbol = CoreCalculator.getSymbolModel(position.contractId)
      if (symbol?.quoteCoinId === coinId) {
        let ticker = perpStore.contractList.find(item => item.contractId === position.contractId)
        let oraclePrice = new BigNumber(ticker?.oraclePrice || 0)
        let positionValue = new BigNumber(position?.openSize || 0).times(oraclePrice || 0)
        let starkExRiskRate = CoreCalculator.getPositionStarkExRiskRate(position.contractId, positionValue.toFixed())
        totalRiskValue = totalRiskValue.plus(CoreCalculator.getPositionStarkExRiskValue(positionValue.toFixed(), starkExRiskRate))
      }
    })
    return totalRiskValue
  }

  /**
* 计算成交后的抵押品总价值
*
* @param oraclePrice           预言机价格
* @param collateralTotalEquity 账户当前抵押品总价值
* @param fillSize              成交数量 (买入为正，卖出为负)
* @param fillValue             成交价值 (买入为正，卖出为负)
* @param fillFee               成交手续费 (一般为负值)
* @return 成交后的抵押品总价值
*/
  static getCollateralTotalEquityAfterFill(data: {
    oraclePrice: string
    collateralTotalEquity: string
    fillSize: string
    fillValue: string
    fillFee: string
  }) {
    return new BigNumber(data?.collateralTotalEquity || 0).minus(data?.fillValue || 0).plus(new BigNumber(data.fillSize || '0').times(data?.oraclePrice || 0)).plus(data?.fillFee || 0)
  }

  /**
   * 计算成交后的抵押品 starkex 总风险金额
   *
   * @param contract                   合约配置
   * @param oraclePrice                预言机价格
   * @param positionOpenSize           当前仓位开仓数量 (多仓为正，空仓为负)
   * @param collateralStarkExRiskValue 账户当前抵押品对应所有仓位总 starkEx 风险额之和
   * @param fillSize                   成交数量 (买入为正，卖出为负)
   * @return 抵押品 starkex 总风险金额
   */

  static getCollateralStarkExRiskValueAfterFill(data: {
    contractId: string
    oraclePrice: string
    positionOpenSize: string
    collateralStarkExRiskValue: string
    fillSize: string
  }) {
    const contractId = data?.contractId || ''
    const fillSize = new BigNumber(data?.fillSize || 0)
    const oraclePrice = new BigNumber(data?.oraclePrice || 0)
    const positionOpenSize = new BigNumber(data?.positionOpenSize || 0)
    const positionValue = positionOpenSize.times(data?.oraclePrice || 0)
    const contractRisk = CoreCalculator.getPositionRiskTier(positionValue.toFixed(), contractId)
    const positionStackExRiskRate = contractRisk !== null ? DecimalExtensions.divide(contractRisk.starkExRisk, new BigNumber(2).pow(32)) : new BigNumber(0)
    const positionStarkExRiskValue = positionValue.abs().times(positionStackExRiskRate)
    const afterPositionOpenSize = positionOpenSize.plus(fillSize)
    const afterPositionValue = afterPositionOpenSize.times(oraclePrice)
    const afterContractRisk = CoreCalculator.getPositionRiskTier(afterPositionValue.toFixed(), contractId)
    const afterPositionStackExRiskRate = afterContractRisk !== null ? DecimalExtensions.divide(afterContractRisk.starkExRisk, new BigNumber(2).pow(32)) : new BigNumber(0)
    const afterPositionStarkExRiskValue = afterPositionValue.abs().times(afterPositionStackExRiskRate)
    return new BigNumber(data?.collateralStarkExRiskValue || 0).plus(afterPositionStarkExRiskValue).minus(positionStarkExRiskValue)
  }


  /**
     * 预估强平价
     */

  static getCreateOrderLiquidatePrice(data: {
    accountId?: string
    contractId: string
    orderSide: string
    orderPrice: string
    orderSize: string
  }) {
    const orderSize = new BigNumber(data?.orderSize || 0)
    const orderSide = data?.orderSide
    const contract = CoreCalculator.getSymbolModel(data.contractId)
    const perpStore = usePerpStore()
    const collateralPendingWithdrawAmount = CoreCalculator.getCollateralPendingWithdrawAmount(contract?.quoteCoinId || '')
    const collateralPendingTransferOutAmount = CoreCalculator.getCollateralPendingTransferOutAmount(contract?.quoteCoinId || '')
    const collateralTotalEquity = CoreCalculator.getCollateralTotalEquity(contract?.quoteCoinId || '')
    const collateralStarkExRiskValue = CoreCalculator.getStarkExRiskValue(contract?.quoteCoinId || '')
    const feeRate = CoreCalculator.getMaxTradeFeeRate(data.contractId)
    const allPositionList = perpStore.position || []
    let positionOpenSize = new BigNumber(0)
    for (let i = 0; i < allPositionList.length; i++) {
      if (allPositionList[i].contractId === data.contractId) {
        positionOpenSize = positionOpenSize.plus(new BigNumber(allPositionList?.[i]?.openSize || 0))
      }
    }

    const fillSize = orderSize.div(orderSide === 'BUY' ? 1 : -1)
    const fillValue = fillSize.times(data?.orderPrice || 0)
    const fillFee = fillValue.times(feeRate).abs().times(-1)
    const oraclePrice = new BigNumber(contract?.oraclePrice || 0)


    const afterCollateralTotalEquity = CoreCalculator.getCollateralTotalEquityAfterFill({
      oraclePrice: oraclePrice.toFixed(),
      collateralTotalEquity: collateralTotalEquity.toFixed(),
      fillSize: fillSize.toFixed(),
      fillValue: fillValue.toFixed(),
      fillFee: fillFee.toFixed()
    })

    const afterCollateralStarkExRiskValue = CoreCalculator.getCollateralStarkExRiskValueAfterFill({
      contractId: data.contractId,
      oraclePrice: oraclePrice.toFixed(),
      positionOpenSize: positionOpenSize.toFixed(),
      collateralStarkExRiskValue: collateralStarkExRiskValue.toFixed(),
      fillSize: fillSize.toFixed()
    })

    const afterPositionSize = positionOpenSize.plus(fillSize)
    // console.log(data.orderSide, 'afterPositionSize', afterPositionSize.toString())
    const afterLiquidatePrice = CoreCalculator.getPositionLiquidatePrice({
      contractId: data.contractId,
      oraclePrice: oraclePrice.toFixed(),
      positionOpenSize: afterPositionSize.toFixed(),
      collateralTotalEquity: afterCollateralTotalEquity.toFixed(),
      collateralStarkExRiskValue: afterCollateralStarkExRiskValue.toFixed(),
      collateralPendingWithdrawAmount: collateralPendingWithdrawAmount.toFixed(),
      collateralPendingTransferOutAmount: collateralPendingTransferOutAmount.toFixed()
    })

    // console.log('afterLiquidatePrice', afterLiquidatePrice.toString())

    return BigNumber.max(afterLiquidatePrice, new BigNumber(0))
  }

  /**
 * 获取初始保证金要求
 */
  static getInitialMarginRequirement(coinId: string) {
    const perpStore = usePerpStore()
    let totalRequirement = new BigNumber(0)
    const positionList = perpStore.position || []
    // 遍历所有仓位计算初始保证金要求
    for (let i = 0; i < positionList.length; i++) {
      const position = positionList[i]
      const symbol = CoreCalculator.getSymbolModel(position.contractId)
      if (symbol?.quoteCoinId === coinId) {
        const ticker = perpStore.contractList.find(item => item.contractId === position.contractId)
        const oraclePrice = new BigNumber(ticker?.oraclePrice || 0)
        const positionValue = new BigNumber(position?.openSize || 0).times(oraclePrice || 0)
        const maxLeverage = CoreCalculator.getPositionMaxLeverage(position.contractId, positionValue.toFixed())
        const initialMarginRate = CoreCalculator.getInitialMarginRateWithMaxLeverage(maxLeverage || '0')
        const requirement = CoreCalculator.getPositionInitialMarginRequirement(positionValue.toFixed(), initialMarginRate)
        totalRequirement = totalRequirement.plus(requirement)
      }
    }
    return totalRequirement
  }

  /**
   * 计算最差平仓价，即平仓成交价格不能劣于这个价格。
   * 注意：此价格没有考虑 维持保证金率降档问题，所以当有平仓降档情况时并不精确。
   */
  static _getPositionWorstClosePrice(data: {
    contractId: string
    oraclePrice: string
    positionOpenSize: string
    collateralTotalEquity: string
    collateralStarkExRiskValue: string
    collateralPendingWithdrawAmount: string
    collateralPendingTransferOutAmount: string
    feeRate: string
  }) {
    const contract = CoreCalculator.getSymbolModel(data.contractId)
    const oraclePrice = new BigNumber(data.oraclePrice)
    const collateralTotalEquity = new BigNumber(data.collateralTotalEquity).minus(data?.collateralPendingWithdrawAmount || 0).minus(data?.collateralPendingTransferOutAmount || 0)
    const positionOpenSize = new BigNumber(data.positionOpenSize)
    const collateralStarkExRiskValue = new BigNumber(data.collateralStarkExRiskValue)
    const starkExRiskRate = CoreCalculator.getPositionStarkExRiskRate(data.contractId, data.positionOpenSize)
    if (positionOpenSize.lt(0)) {
      // 买入平空，所以 s[k]_close > 0
      let decimal1L = collateralTotalEquity.times(starkExRiskRate).plus(collateralStarkExRiskValue).times(oraclePrice)
      let decimal1R = collateralStarkExRiskValue.times(new BigNumber(1).plus(new BigNumber(data.feeRate)))
      const pricePrecision = getPricePrecision(data.contractId)
      const closePrice1 = DecimalExtensions.floor(decimal1L.div(decimal1R), pricePrecision)
      // if (S[k]_close > 0) : P[k]_close <= (TV - TR + S[k]_close x P[k]_oracle x (1 + R[k])) / (S[k]_close x (1 + feeRate))
      let decimal2L = collateralTotalEquity.minus(collateralStarkExRiskValue).plus(positionOpenSize.times(oraclePrice).times(new BigNumber(-1)).times(new BigNumber(1).plus(starkExRiskRate)))
      let decimal2R = positionOpenSize.times(new BigNumber(-1)).times(new BigNumber(1).plus(new BigNumber(data.feeRate)))
      const closePrice2 = DecimalExtensions.floor(decimal2L.div(decimal2R), pricePrecision)
      return BigNumber.max(closePrice1, closePrice2)
    } else if (positionOpenSize.gt(0)) {
      // 卖出平多，所以 s[k]_close < 0
      // if (s[k]_close < 0) : P[k]_close >= ((TR - TV x R[k]) x P[k]_oracle) / (TR x (1 - feeRate))
      let decimal1L = collateralStarkExRiskValue.minus(collateralTotalEquity.times(starkExRiskRate)).times(oraclePrice)
      let decimal1R = collateralStarkExRiskValue.times(new BigNumber(1).minus(new BigNumber(data.feeRate)))
      const pricePrecision = getPricePrecision(data.contractId)
      const closePrice1 = DecimalExtensions.ceil(decimal1L.div(decimal1R), pricePrecision)
      // if (s[k]_close < 0) : P[k]_close >= (TV - TR + S[k]_close x P[k]_oracle x (1 - R[k])) / (S[k]_close x (1 - feeRate))
      let decimal2L = collateralTotalEquity.minus(collateralStarkExRiskValue).plus(positionOpenSize.times(oraclePrice).times(new BigNumber(-1)).times(new BigNumber(1).minus(starkExRiskRate)))
      let decimal2R = positionOpenSize.times(new BigNumber(-1)).times(new BigNumber(1).minus(new BigNumber(data.feeRate)))
      const closePrice2 = DecimalExtensions.ceil(decimal2L.div(decimal2R), pricePrecision)
      return BigNumber.min(closePrice1, closePrice2)
    } else {
      return new BigNumber(0)
    }
  }

  /**
   * 检查平仓订单是否有效
   */

  static checkCloseOrderIsValid(data: {
    contractId: string
    oraclePrice: string
    initialMarginRate: string
    positionOpenSize: string
    availableAmount: string
    greaterOrderModelList: OrderModel[]
    orderSide: string
    orderCloseSizeAbs: string
    orderCloseValueAbs: string
    feeRate: string
  }) {
    let orderSide = data.orderSide || ''
    let contract = CoreCalculator.getSymbolModel(data.contractId)
    let coinModel = CoreCalculator.getCoinModel(contract?.quoteCoinId || '')
    let availableAmount = new BigNumber(data?.availableAmount || '0')
    let tokenStepSize = getDecimalScale(coinModel?.stepSize || '0')
    let positionOpenSize = new BigNumber(data?.positionOpenSize || '0')
    let orderCloseSizeAbs = new BigNumber(data?.orderCloseSizeAbs || '0')
    let orderCloseValueAbs = new BigNumber(data?.orderCloseValueAbs || '0')
    let greaterOrderModelList = data?.greaterOrderModelList || []

    // 假定当前平仓成交，判断之后的委托单是否ok
    if (orderSide === 'BUY') {
      let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
        oraclePrice: data.oraclePrice,
        initialMarginRate: data.initialMarginRate,
        orderCloseSize: data.orderCloseSizeAbs,
        orderCloseValue: data.orderCloseValueAbs,
        feeRate: data.feeRate,
      })
      availableAmount = availableAmount.minus(closeOrderFrozenAmount)
      positionOpenSize = positionOpenSize.minus(orderCloseSizeAbs)
    } else if (orderSide === 'SELL') {
      let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
        oraclePrice: data.oraclePrice,
        initialMarginRate: data.initialMarginRate,
        orderCloseSize: orderCloseSizeAbs.negated().toFixed(),
        orderCloseValue: orderCloseValueAbs.negated().toFixed(),
        feeRate: data.feeRate,
      })
      availableAmount = availableAmount.minus(closeOrderFrozenAmount)
      positionOpenSize = positionOpenSize.plus(orderCloseSizeAbs)
    } else {
      return false
    }
    for (let i = 0; i < greaterOrderModelList.length; i++) {
      const orderModel = greaterOrderModelList[i]
      let orderLeftSize = new BigNumber(0)
      if (orderModel.status === 'PENDING' || orderModel.status === 'OPEN' || orderModel.status === 'CANCELING') {
        if (orderModel.isWithoutMatch) {
          orderLeftSize = new BigNumber(orderModel.withoutMatchFillSize)
            .minus(new BigNumber(orderModel.cumFailSize))
            .minus(new BigNumber(orderModel.cumFillSize))
        } else {
          orderLeftSize = new BigNumber(orderModel.size)
            .minus(new BigNumber(orderModel.cumFailSize))
            .minus(new BigNumber(orderModel.cumFillSize))
        }
      } else if (orderModel.status === 'FILLED') {
        orderLeftSize = new BigNumber(orderModel.cumMatchSize)
          .minus(new BigNumber(orderModel.cumFailSize))
          .minus(new BigNumber(orderModel.cumFillSize))
      }
      if (orderLeftSize.lte(0)) {
        continue
      }
      let orderLeftValue = new BigNumber(0)
      if (orderModel.isWithoutMatch) {
        orderLeftValue = orderLeftSize.times(new BigNumber(orderModel.withoutMatchFillValue)).div(orderModel.withoutMatchFillSize)
        if (orderModel.side === 'BUY') {
          orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_CEIL)
        } else {
          orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_FLOOR)
        }
      } else if (new BigNumber(orderModel.price).isZero()) {
        orderLeftValue = orderLeftSize.times(new BigNumber(orderModel.marketLimitValue || '0')).div(orderModel.size)
        if (orderModel.side === 'BUY') {
          orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_CEIL)
        } else {
          orderLeftValue = orderLeftValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_FLOOR)
        }
      } else {
        orderLeftValue = orderLeftSize.times(orderModel.price || 0)
      }
      let orderCloseSize = new BigNumber(0)
      if (orderModel.side === 'BUY' && positionOpenSize.lt(0)) {
        orderCloseSize = BigNumber.min(orderLeftSize, positionOpenSize.negated())
      } else if (orderModel.side === 'SELL' && positionOpenSize.gt(0)) {
        orderCloseSize = BigNumber.max(orderLeftSize.negated(), positionOpenSize.negated())
      }

      let orderOpenSize = new BigNumber(0)
      if (orderModel.side === 'BUY') {
        orderOpenSize = orderLeftSize.minus(orderCloseSize)
      } else {
        orderOpenSize = orderLeftSize.negated().minus(orderCloseSize)
      }

      let orderCloseValue = orderCloseSize.times(orderLeftValue || 0).div(orderLeftSize)
      orderCloseValue = orderCloseValue.decimalPlaces(Number(tokenStepSize), BigNumber.ROUND_FLOOR)

      let orderOpenValue = new BigNumber(0)
      if (orderModel.side === 'BUY') {
        orderOpenValue = orderLeftValue.minus(orderCloseValue)
      } else {
        orderOpenValue = orderLeftValue.negated().minus(orderCloseValue)
      }

      let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
        oraclePrice: data.oraclePrice,
        initialMarginRate: data.initialMarginRate,
        orderCloseSize: orderCloseSize.toFixed(),
        orderCloseValue: orderCloseValue.toFixed(),
        feeRate: data.feeRate,
      })

      let openOrderFrozenAmount = CoreCalculator._getOpenOrderFrozenAmount({
        oraclePrice: data.oraclePrice,
        initialMarginRate: data.initialMarginRate,
        orderOpenSize: orderOpenSize.toFixed(),
        orderOpenValue: orderOpenValue.toFixed(),
        feeRate: data.feeRate,
      })

      availableAmount = availableAmount.plus(closeOrderFrozenAmount).plus(openOrderFrozenAmount)

      if (!orderOpenSize.isZero() && availableAmount.lt(0)) {
        return false
      }

      if (orderModel.side === 'BUY') {
        positionOpenSize = positionOpenSize.plus(orderLeftSize)
      } else {
        positionOpenSize = positionOpenSize.minus(orderLeftSize)
      }
    }
    return true
  }

  /**
   * 根据杠杆获取风险档位模型
   */
  static getRiskTierModel(inputLeverage: string, riskTierList: RiskTierModel[]) {
    if (!riskTierList.length) {
      return null
    }
    const sortTierList = [...riskTierList].sort((a, b) => new BigNumber(b.positionValueUpperBound || 0).comparedTo(a.positionValueUpperBound || 0) as number)
    for (const value of sortTierList) {
      if (new BigNumber(inputLeverage).lte(value.maxLeverage)) {
        return value
      }
    }
    return sortTierList[0]
  }

  /**
   * 根据杠杆获取风险限额档位最大可开数量
   *
   * @param accountId   账户ID
   * @param symbolModel 合约模型
   * @param orderSide   订单方向（买/卖）'BUY' | 'SELL'
   * @param inputLever  输入的杠杆
   * @return 最大可开数量
   */

  static getRiskLimitTierMaxOpenQuantityWithLever(data: {
    accountId?: string
    contractId: string
    orderSide: string
    inputLever: string
  }) {
    const itemAcctData = CoreCalculator.getUserInfo()
    const symbolModel = CoreCalculator.getSymbolModel(data.contractId)
    // 获取预言机价格，并在其基础上增加0.1%的溢价
    const oraclePrice = new BigNumber(symbolModel?.oraclePrice || 0).times(1.001)

    // 如果市场价格为零，则返回零（表示无法计算）
    if (oraclePrice.isZero()) {
      return new BigNumber(0)
    }

    const riskTierList = symbolModel?.riskTierList || []
    // 根据杠杆获取风险限额档位的最大可开仓值
    const contractRisk = CoreCalculator.getRiskTierModel(data.inputLever, riskTierList)
    const riskMaxValue = new BigNumber(contractRisk?.positionValueUpperBound || 0)
    // 获取当前持仓的总数量
    const perpStore = usePerpStore()
    const positionModel = perpStore.position?.find?.(item => item.contractId === data.contractId)
    const positionSize = new BigNumber(positionModel?.openSize || '0')
    // 计算最大可开仓数量
    let leverMaxQty = new BigNumber(0)
    if (data.orderSide === 'BUY') {
      // 买单方向
      leverMaxQty = riskMaxValue.div(oraclePrice).minus(positionSize)
    } else {
      // 卖单方向
      leverMaxQty = riskMaxValue.div(oraclePrice).plus(positionSize)
    }
    // 确保最大可开仓数量不为负数
    return BigNumber.max(leverMaxQty, new BigNumber(0))
  }


  /**
     * 计算最大下单数量
     *
     * 计算原理：
     * 1. 下单平仓部分价格必须优于最差平仓价
     * 2. 下单开仓部分必须保证最大可用金额大于等于0
     *
     * 计算步骤：
     * 1. 计算当前价格可以平仓的数量上限
     * 2. 如果平仓数量上限大于0，
     *    2.1 说明必须有平仓，要保证平仓价格优于或等于最差平仓价。否则直接返回0
     *    2.2 用平仓数量上限试算是否可以下单
     *    2.3 如果平仓数量上限下单失败，用二分法找到满足条件的最大平仓数量，直接返回即可
     * 3. 计算最大可开量
     *    3.1 将平仓数量上限假定已下单，更新用可用余额
     *    3.2 根据更新后的可用余额用公式反推最大可开量
     *    3.3 返回 平仓数量上限 + 最大可开量 即为最大下单数量
     *
     * @param accountId  账户ID
     * @param symbol     合约配置
     * @param orderSide  下单买卖方向
     * @param orderPrice 下单价格（市价单根据盘口取价，限价单固定限价）
     * @param reduceOnly 是否仅平仓
     * @return 最大下单数量
     */
  static getMaxCreateOrderSize(data: {
    contractId: string
    orderSide: string
    orderPrice: string
    reduceOnly: boolean
  }) {
    const perpStore = usePerpStore()
    const symbol = CoreCalculator.getSymbolModel(data.contractId)
    const coinId = symbol?.quoteCoinId || ''
    const orderSide = data.orderSide
    const orderPrice = new BigNumber(data.orderPrice || 0)
    const reduceOnly = data.reduceOnly
    const collateralPendingWithdrawAmount = CoreCalculator.getCollateralPendingWithdrawAmount(coinId || '')
    const collateralPendingTransferOutAmount = CoreCalculator.getCollateralPendingTransferOutAmount(coinId || '')
    const acctTotalEquity = CoreCalculator.getCollateralTotalEquity(coinId || '')
    const initialMarginRequirement = CoreCalculator.getInitialMarginRequirement(coinId || '')
    const starkExRiskValue = CoreCalculator.getStarkExRiskValue(coinId || '')
    let availableAmount = acctTotalEquity.minus(collateralPendingWithdrawAmount).minus(collateralPendingTransferOutAmount).minus(initialMarginRequirement)
    // 处理其他合约的订单冻结金额
    let tmpContract: (typeof symbol) | null = null
    let tmpOrderSide = ''
    let tmpPositionOpenSize = new BigNumber(0)
    let tmpContractOrderFrozenAmount = new BigNumber(0)
    let orderList = (perpStore.order?.filter?.(item => item.contractId === data.contractId) || [])?.sort?.(orderSortByTime)

    for (let i = 0; i < orderList.length; i++) {
      let orderModel = orderList[i]
      if (orderModel.contractId === data.contractId && orderModel.side === data.orderSide) {
        continue
      }
      if (orderModel.contractId !== (tmpContract !== null ? (tmpContract as typeof symbol)?.contractId : null) || orderModel.side !== tmpOrderSide) {
        availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, new BigNumber(0)))
        tmpContract = CoreCalculator.getSymbolModel(orderModel.contractId)
        tmpOrderSide = orderModel.side
        let list = perpStore.position?.filter?.(item => item.contractId === orderModel.contractId) || []
        if (list.length > 0) {
          tmpPositionOpenSize = new BigNumber(list?.[0]?.openSize || 0)
        }
        tmpContractOrderFrozenAmount = new BigNumber(0)
      }
      const contractId = orderModel.contractId
      const _maxLeverage = CoreCalculator.getOpenMaxLeverage(orderModel.contractId)
      let orderInitialMarginRate = CoreCalculator.getInitialMarginRateWithMaxLeverage(_maxLeverage || '0')
      let orderFeeRate = CoreCalculator.getMaxTradeFeeRate(orderModel.contractId)
      let fillModel = _getOrderFillData({
        contractId,
        orderModel,
        positionOpenSize: tmpPositionOpenSize.toFixed()
      })
      let oraclePrice = tmpContract?.oraclePrice || '0'
      let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
        oraclePrice,
        initialMarginRate: orderInitialMarginRate,
        orderCloseSize: fillModel.closeSize.toFixed(),
        orderCloseValue: fillModel.closeValue.toFixed(),
        feeRate: orderFeeRate.toFixed()
      })
      let openOrderFrozenAmount = CoreCalculator._getOpenOrderFrozenAmount({
        oraclePrice,
        initialMarginRate: orderInitialMarginRate,
        orderOpenSize: fillModel.openSize.toFixed(),
        orderOpenValue: fillModel.openValue.toFixed(),
        feeRate: orderFeeRate.toFixed()
      })
      tmpContractOrderFrozenAmount = tmpContractOrderFrozenAmount.plus(closeOrderFrozenAmount).plus(openOrderFrozenAmount)
      tmpPositionOpenSize = tmpPositionOpenSize.minus(fillModel.closeSize).minus(fillModel.openSize)
    }
    availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, new BigNumber(0)))
    let oraclePrice = CoreCalculator.getSymbolModel(data.contractId)?.oraclePrice || '0'
    let feeRate = CoreCalculator.getMaxTradeFeeRate(data.contractId)
    let maxOpenLeverage = CoreCalculator.getOpenMaxLeverage(data.contractId)
    let initialMarginRate = CoreCalculator.getInitialMarginRateWithMaxLeverage(maxOpenLeverage || '0')
    let positionList = perpStore.position?.filter?.(item => item.contractId === data.contractId) || []
    let positionOpenSize = positionList.length > 0 ? new BigNumber(positionList[0]?.openSize || '0') : new BigNumber(0)
    let positionWorstClosePrice = CoreCalculator._getPositionWorstClosePrice({
      contractId: data.contractId,
      oraclePrice,
      positionOpenSize: positionOpenSize.toFixed(),
      collateralTotalEquity: acctTotalEquity.toFixed(),
      collateralStarkExRiskValue: starkExRiskValue.toFixed(),
      collateralPendingWithdrawAmount: collateralPendingWithdrawAmount.toFixed(),
      collateralPendingTransferOutAmount: collateralPendingTransferOutAmount.toFixed(),
      feeRate: feeRate.toFixed()
    })
    // 订单排序
    const curOrder = {
      id: 0,
      contractId: data.contractId,
      side: orderSide,
      price: orderPrice.toFixed(),
      type: 'LIMIT',
      createdTime: '0',
      triggerTime: '0',
      status: 'OPEN',
      cumFailSize: '0',
      cumSize: '0',
      cumFee: '0',
      cumRealizedPnl: '0',
    }
    let greaterOrderModelSortedList: OrderModel[] = []

    for (let i = 0; i < orderList.length; i++) {
      const orderModel = orderList[i]
      if (orderModel.contractId !== curOrder.contractId && orderModel.side !== data.orderSide) {
        continue
      }
      let sortNum = orderSort(curOrder as any, orderModel)
      if (sortNum < 0) {
        greaterOrderModelSortedList.push(orderModel)
        continue
      }
      if (orderModel.contractId !== data.contractId || orderModel.side !== data.orderSide) {
        let tempList = perpStore.position?.filter?.(item => item.contractId === orderModel.contractId) || []
        if (tempList.length > 0) {
          tmpPositionOpenSize = new BigNumber(tempList?.[0]?.openSize || 0)
        }
      }
      const _maxLeverage = CoreCalculator.getOpenMaxLeverage(orderModel.contractId) || '0'
      let orderInitialMarginRate = CoreCalculator.getInitialMarginRateWithMaxLeverage(_maxLeverage)
      let orderFeeRate = CoreCalculator.getMaxTradeFeeRate(orderModel.contractId)
      let fillModel = _getOrderFillData({
        contractId: orderModel.contractId,
        orderModel,
        positionOpenSize: tmpPositionOpenSize.toFixed()
      })
      let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
        oraclePrice,
        initialMarginRate: orderInitialMarginRate,
        orderCloseSize: fillModel.closeSize.toFixed(),
        orderCloseValue: fillModel.closeValue.toFixed(),
        feeRate: orderFeeRate.toFixed()
      })
      let openOrderFrozenAmount = CoreCalculator._getOpenOrderFrozenAmount({
        oraclePrice,
        initialMarginRate: orderInitialMarginRate,
        orderOpenSize: fillModel.openSize.toFixed(),
        orderOpenValue: fillModel.openValue.toFixed(),
        feeRate: orderFeeRate.toFixed()
      })
      availableAmount = availableAmount.minus(closeOrderFrozenAmount).minus(openOrderFrozenAmount)
      positionOpenSize = positionOpenSize.minus(fillModel.closeSize).minus(fillModel.openSize)
    }

    // 计算最大平仓数量限制
    let maxCloseSizeAbsLimit = new BigNumber(0)
    if (orderSide === 'BUY' && positionOpenSize.lt(0) || orderSide === 'SELL' && positionOpenSize.gt(0)) {
      maxCloseSizeAbsLimit = positionOpenSize.abs()
    }
    if (maxCloseSizeAbsLimit.gt(0)) {
      // 检查平仓价格是否优于最差平仓价
      if ((orderSide === 'BUY' && orderPrice.gt(positionWorstClosePrice)) || (orderSide === 'SELL' && orderPrice.lt(positionWorstClosePrice))) {
        return new BigNumber(0)
      }
      // 验证最大平仓数量是否可以下单
      let closeOrderIsValid = CoreCalculator.checkCloseOrderIsValid({
        contractId: data.contractId,
        oraclePrice,
        initialMarginRate,
        positionOpenSize: positionOpenSize.toFixed(),
        availableAmount: availableAmount.toFixed(),
        greaterOrderModelList: greaterOrderModelSortedList,
        orderSide,
        orderCloseSizeAbs: maxCloseSizeAbsLimit.toFixed(),
        orderCloseValueAbs: orderPrice.times(maxCloseSizeAbsLimit).toFixed(),
        feeRate: feeRate.toFixed()
      })
      if (!closeOrderIsValid) {
        // 使用二分法找到合适的下单数量
        let minCloseSizeAbsInclusive = new BigNumber(0)
        let maxCloseSizeAbsExclusive = maxCloseSizeAbsLimit
        let quantityPrecision = getQuantityPrecision(data.contractId)
        while (maxCloseSizeAbsExclusive.minus(minCloseSizeAbsInclusive).gt(symbol?.stepSize || 0)) {
          let middleCloseSizeAbs = maxCloseSizeAbsExclusive.plus(minCloseSizeAbsInclusive).div(2).decimalPlaces(quantityPrecision || 0, BigNumber.ROUND_FLOOR)
          let closeOrderIsValid2 = CoreCalculator.checkCloseOrderIsValid({
            contractId: data.contractId,
            oraclePrice,
            initialMarginRate,
            positionOpenSize: positionOpenSize.toFixed(),
            availableAmount: availableAmount.toFixed(),
            greaterOrderModelList: greaterOrderModelSortedList,
            orderSide,
            orderCloseSizeAbs: middleCloseSizeAbs.toFixed(),
            orderCloseValueAbs: orderPrice.times(middleCloseSizeAbs).toFixed(),
            feeRate: feeRate.toFixed()
          })
          if (closeOrderIsValid2) {
            minCloseSizeAbsInclusive = middleCloseSizeAbs
          } else {
            maxCloseSizeAbsExclusive = middleCloseSizeAbs
          }
        }
        return minCloseSizeAbsInclusive
      }
      // 更新可用余额（扣除平仓冻结金额）
      if (orderSide === 'BUY') {
        let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
          oraclePrice,
          initialMarginRate,
          orderCloseSize: maxCloseSizeAbsLimit.toFixed(),
          orderCloseValue: orderPrice.times(maxCloseSizeAbsLimit).toFixed(),
          feeRate: feeRate.toFixed()
        })
        availableAmount = availableAmount.minus(closeOrderFrozenAmount)
      } else if (orderSide === 'SELL') {
        let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
          oraclePrice,
          initialMarginRate,
          orderCloseSize: maxCloseSizeAbsLimit.negated().toFixed(),
          orderCloseValue: orderPrice.times(maxCloseSizeAbsLimit).negated().toFixed(),
          feeRate: feeRate.toFixed()
        })
        availableAmount = availableAmount.minus(closeOrderFrozenAmount)
      }
    }
    if (reduceOnly) {
      return maxCloseSizeAbsLimit
    }
    // 计算开仓部分的冻结金额
    for (let orderModel of greaterOrderModelSortedList) {
      let fillModel = _getOrderFillData({
        contractId: data.contractId,
        orderModel,
        positionOpenSize: positionOpenSize.toFixed()
      })
      let openOrderFrozenAmount = CoreCalculator._getOpenOrderFrozenAmount({
        oraclePrice,
        initialMarginRate,
        orderOpenSize: fillModel.openSize.toFixed(),
        orderOpenValue: fillModel.openValue.toFixed(),
        feeRate: feeRate.toFixed()
      })
      availableAmount = availableAmount.minus(openOrderFrozenAmount)
    }
    // 计算最大开仓数量
    let divisor = new BigNumber(0)
    if (orderSide === 'BUY') {
      // 买入开多：最大开仓量 = 可用余额 / (max(orderPrice - oraclePrice, 0) + oraclePrice × initialMarginRate + orderPrice × feeRate)
      divisor = BigNumber.max(orderPrice.minus(oraclePrice), new BigNumber(0))
        .plus(new BigNumber(oraclePrice).times(initialMarginRate))
        .plus(orderPrice.times(feeRate))
    } else if (orderSide === 'SELL') {
      // 卖出开空：最大开仓量 = 可用余额 / (max(oraclePrice - orderPrice, 0) + oraclePrice × initialMarginRate + orderPrice × feeRate)
      divisor = BigNumber.max(new BigNumber(oraclePrice).minus(orderPrice), new BigNumber(0))
        .plus(new BigNumber(oraclePrice).times(initialMarginRate))
        .plus(orderPrice.times(feeRate))
    } else {
      divisor = new BigNumber(0)
    }

    let maxOpenSizeAbs = new BigNumber(0)
    if (divisor.lte(new BigNumber(0))) {
      maxOpenSizeAbs = new BigNumber(0)
    } else {
      maxOpenSizeAbs = BigNumber.max(availableAmount.div(divisor).decimalPlaces(getQuantityPrecision(data.contractId), BigNumber.ROUND_FLOOR), new BigNumber(0))
    }

    // 1. 保证金最大可开
    let marginMaxQty = maxCloseSizeAbsLimit.plus(maxOpenSizeAbs)

    // 2. 计算基于风险限额档位的最大可开数量
    let inputLever = CoreCalculator.getOpenMaxLeverage(data.contractId) || '0'

    let leverMaxQty = CoreCalculator.getRiskLimitTierMaxOpenQuantityWithLever({
      contractId: data.contractId,
      orderSide,
      inputLever
    })
    // 返回两者中的最小值作为最大可开数量
    return BigNumber.min(leverMaxQty, marginMaxQty)
  }

  /**
     * 获取单项订单冻结金额
     */
    static getItemOrderFrozenAmount(data:{
      accountId?: string,
      contractId: string,
      oraclePrice: string,
      orderSide: string,
    }) {
      const orderSide = data.orderSide
      if (orderSide === 'UNKNOWN_ORDER_SIDE' || orderSide === 'UNRECOGNIZED') {
        return new BigNumber(0)
      }
      const perpStore = usePerpStore()
      const itemAcctData = CoreCalculator.getUserInfo()
      const positionList = perpStore.position || []
      let positionOpenSize = positionList.length === 0 ? new BigNumber(0) : new BigNumber(positionList[0].openSize)

      let orderFrozenAmount = new BigNumber(0)
      const sortOrders = (perpStore.order || [])?.sort?.(orderSortByTime)

      for (let orderModel of sortOrders) {
        if (orderModel.contractId === data.contractId && orderModel.side === orderSide) {
          const maxLeverage = CoreCalculator.getOpenMaxLeverage(data.contractId) || '0'
          let orderInitialMarginRate = CoreCalculator.getInitialMarginRateWithMaxLeverage(maxLeverage)
          let orderFeeRate = CoreCalculator.getMaxTradeFeeRate(data.contractId)
          let orderFillData = _getOrderFillData({
            contractId: data.contractId,
            orderModel,
            positionOpenSize: positionOpenSize.toFixed()
          })
          let closeOrderFrozenAmount = CoreCalculator._getCloseOrderFrozenAmount({
            oraclePrice: data.oraclePrice,
            initialMarginRate: orderInitialMarginRate,
            orderCloseSize: orderFillData.closeSize.toFixed(),
            orderCloseValue: orderFillData.closeValue.toFixed(),
            feeRate: orderFeeRate.toFixed()
          })

          let openOrderFrozenAmount = CoreCalculator._getOpenOrderFrozenAmount({
            oraclePrice: data.oraclePrice,
            initialMarginRate: orderInitialMarginRate,
            orderOpenSize: orderFillData.openSize.toFixed(),
            orderOpenValue: orderFillData.openValue.toFixed(),
            feeRate: orderFeeRate.toFixed()
          })
          orderFrozenAmount = orderFrozenAmount.plus(closeOrderFrozenAmount).plus(openOrderFrozenAmount)
          positionOpenSize = positionOpenSize.plus(orderFillData.closeSize).plus(orderFillData.openSize)
        }
      }
      return BigNumber.max(orderFrozenAmount, new BigNumber(0))
    }

  //可用
    // Collateral.availableAmount = max(0,
    // Collateral.totalEquity -
    // Collateral.initialMarginRequirement
    // - Collateral.pendingWithdrawAmount
    // - Collateral.pendingTransferOutAmount
    // - Collateral.orderFrozenAmount)
  static getCollateralAvailableAmount(coinId: string, position?: Position[]) {
    const perpStore = usePerpStore()
    const positionList = position || perpStore?.position || []
    const collateralModel = (perpStore?.collateral || [])?.find(item => item.coinId === coinId)
    let collateralTotalEquity = new BigNumber(collateralModel?.amount || 0)
    let collateralPendingWithdrawAmount = CoreCalculator.getCollateralPendingWithdrawAmount(coinId)
    let collateralPendingTransferOutAmount = CoreCalculator.getCollateralPendingTransferOutAmount(coinId)
    let collateralInitialMarginRequirement = new BigNumber(0)
    // 获取所有
    positionList.forEach(position => {
      let symbol = CoreCalculator.getSymbolModel(position.contractId)
      if (symbol?.quoteCoinId === coinId) {
        let oraclePrice = new BigNumber(symbol?.oraclePrice || 0)
        let positionValue = new BigNumber(position?.openSize || 0).times(oraclePrice || 0)
        let maxLeverage = CoreCalculator.getPositionMaxLeverage(position.contractId, positionValue.toFixed())
        let initialMarginRate = CoreCalculator.getInitialMarginRateWithMaxLeverage(maxLeverage || '0')
        let positionInitialMarginRequirement = CoreCalculator.getPositionInitialMarginRequirement(positionValue.toFixed(), initialMarginRate)
        collateralTotalEquity = collateralTotalEquity.plus(positionValue)
        collateralInitialMarginRequirement = collateralInitialMarginRequirement.plus(positionInitialMarginRequirement)
      }
    })
    let collateralOrderFrozenAmount = new BigNumber(0)
    let orderContractIdSet = new Set(perpStore?.order?.map?.(item => item.contractId) || [])
    orderContractIdSet.forEach(contractId => {
      let contract = CoreCalculator.getSymbolModel(contractId)
      if (contract?.quoteCoinId === coinId) {
        let oraclePrice = new BigNumber(contract?.oraclePrice || 0)
        let orderItemFrozenAmount1 = CoreCalculator.getItemOrderFrozenAmount({
          contractId,
          oraclePrice: oraclePrice.toFixed(),
          orderSide: 'BUY'
        })
        let orderItemFrozenAmount2 = CoreCalculator.getItemOrderFrozenAmount({
          contractId,
          oraclePrice: oraclePrice.toFixed(),
          orderSide: 'SELL'
        })
        collateralOrderFrozenAmount = collateralOrderFrozenAmount.plus(orderItemFrozenAmount1).plus(orderItemFrozenAmount2)
      }
    })
    const availableAmount = collateralTotalEquity.minus(collateralInitialMarginRequirement).minus(collateralPendingWithdrawAmount).minus(collateralPendingTransferOutAmount).minus(collateralOrderFrozenAmount)
    return BigNumber.max(availableAmount, new BigNumber(0))
  }

  /**
     * 计算可用余额
     */

  static calculateAvailableBalance(contractId: string) {
    // 这里应该根据实际业务逻辑获取用户的可用余额
    // 暂时使用示例数据
    let symbol = CoreCalculator.getSymbolModel(contractId)
    const quoteCoinId = symbol?.quoteCoinId || '' // 计价币种，如USDT
    // 从PrivateData获取账户余额信息
    // 这里需要根据实际的数据结构来获取余额
    return CoreCalculator.getCollateralAvailableAmount(quoteCoinId).toFixed()
  }
}
