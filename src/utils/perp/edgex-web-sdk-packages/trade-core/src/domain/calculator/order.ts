import BigNumber from "bignumber.js";
import { AccountInfo, IContract, IMetadata, OrderEntry, PositionEntry } from "@edgex/types";
import { getNumberPrecision } from "@edgex/utils";
import { CONST_conditionalOrderType, TYPE_orderSide } from "../constants";
import { Ticker } from "../entities/Ticker";
import { Position } from "../entities/Position";
import { getFeeRate, getMaxLeverage } from "./account";
import { getCollateralInfo } from "./collateral";
import { findRiskTier } from "./helper";
import { calculatePositionLiquidatePrice } from "./position";

/**
 * @description 计算委托单开仓冻结金额
 * max(orderOpenValue - orderOpenSize x oraclePrice, 0) + abs(orderOpenValue) x feeRate + abs(orderOpenSize) x oraclePrice x (1 / leverage)
 * @param {BigNumber} oraclePrice 预言机价格类似中心化交易所中的标记价格，用来衡量混合资产公允价值的价格，会参与用户的盈亏、总资产、是否触发清算等计算
 * @param {BigNumber} initialMarginRate 仓位初始保证金率 round_floor( 1 / maxLeverage, 保留6为小数)
 * @param {BigNumber} orderOpenSize 当前委托单的开仓数量
 * @param {BigNumber} orderOpenValue orderOpenSize x Order.price; 如果 Order.price 为0 (市价单)，则为 Order.value x orderOpenSize / orderSize
 * @param {BigNumber} feeRate  max (Order.takerFeeRate, Order.makerFeeRate) 来源于配置
 * @return {BigNumber} 开仓冻结金额
 */
export const calculateOpenOrderFrozenAmount = (
  oraclePrice: string | BigNumber | number,
  initialMarginRate: string | BigNumber,
  orderOpenSize: string | BigNumber,
  orderOpenValue: string | BigNumber,
  feeRate: string | number,
): BigNumber => {
  // 开仓损失(仅考虑亏损情况，不考虑盈利)：max(orderOpenValue - orderOpenSize x oraclePrice, 0)
  const orderLossValue = BigNumber.max(
    BigNumber(orderOpenValue).minus(BigNumber(orderOpenSize).multipliedBy(oraclePrice)),
    0,
  );
  // 开仓后增加的初始保证金：abs(orderOpenSize) x oraclePrice x initialMarginRate
  const orderInitialMarginRequirement = BigNumber(orderOpenSize)
    .abs()
    .multipliedBy(oraclePrice)
    .multipliedBy(initialMarginRate);
  // 开仓手续费
  const orderFillFee = BigNumber(orderOpenValue).abs().multipliedBy(feeRate);
  return orderLossValue.plus(orderInitialMarginRequirement).plus(orderFillFee);
};

/**
 * @description 计算委托单平仓冻结金额
 * max(orderCloseValue - orderCloseSize x oraclePrice + abs(orderCloseValue) x feeRate - abs(orderCloseSize) x oraclePrice x (1 / leverage), 0)
 * @param {BigNumber} oraclePrice 预言机价格类似中心化交易所中的标记价格，用来衡量混合资产公允价值的价格，会参与用户的盈亏，总资产，是否触发清算等计算
 * @param {BigNumber} initialMarginRate 仓位初始保证金率 round_floor( 1 / maxLeverage, 保留6为小数)
 * @param {BigNumber} orderCloseSize 当前委托单的平仓数量
 * @param {BigNumber} orderCloseValue orderCloseSize x Order.price; 如果 Order.price 为0 (市价单)，则为 Order.value x orderCloseSize / orderSize
 * @param {BigNumber} feeRate  max (Order.takerFeeRate, Order.makerFeeRate) 来源于配置
 * @return {BigNumber} 平仓冻结金额
 */
export const calculateCloseOrderFrozenAmount = (
  oraclePrice: string | BigNumber | number,
  initialMarginRate: string | BigNumber,
  orderCloseSize: string | BigNumber,
  orderCloseValue: string | BigNumber,
  feeRate: string | number,
): BigNumber => {
  // 平仓损失：orderCloseValue - orderCloseSize x oraclePrice
  const orderLossValue = BigNumber(orderCloseValue).minus(
    BigNumber(orderCloseSize).multipliedBy(oraclePrice),
  );
  // 平仓成交后的 减少的初始保证金：abs(orderCloseSize) x oraclePrice x initialMarginRate
  const orderInitialMarginRequirement = BigNumber(orderCloseSize)
    .abs()
    .multipliedBy(oraclePrice)
    .multipliedBy(initialMarginRate);
  // 手续费：abs(orderCloseValue) x orderFeeRate
  const orderFillFee = BigNumber(orderCloseValue).abs().multipliedBy(feeRate);
  return orderLossValue.minus(orderInitialMarginRequirement).plus(orderFillFee);
};

/**
 * 计算最差平仓价，即平仓成交价格不能劣于这个价格。<br/>
 * 注意：此价格没有考虑 维持保证金率降档问题，所以当有平仓降档情况时并不精确。<br/>
 * <pre>
 * 推到过程：
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
 * </pre>
 *
 * @param {BigNumber} contract                           合约配置
 * @param {BigNumber} oraclePrice                        预言机价格
 * @param {BigNumber} positionOpenSize                   当前仓位开仓数量 (多仓为正，空仓为负)
 * @param {BigNumber} collateralTotalEquity              账户当前抵押品总价值
 * @param {BigNumber} collateralStarkExRiskValue         账户当前抵押品对应所有仓位总 starkEx 风险额之和
 * @param {BigNumber} collateralPendingWithdrawAmount    当前仓位所属抵押品的正在处理的提现金额之和
 * @param {BigNumber} collateralPendingTransferOutAmount 当前仓位所属抵押品的正在处理的转出金额之和
 * @param {BigNumber} feeRate                            手续费率
 * @returns {BigNumber} worsePrice 最差平仓价
 */
export const calculatePositionWorstClosePrice = (
  contract: any,
  oraclePrice: string | BigNumber,
  positionOpenSize: string | BigNumber,
  paramCollateralTotalEquity: string | BigNumber,
  collateralStarkExRiskValue: string | BigNumber,
  collateralPendingWithdrawAmount: string | BigNumber,
  collateralPendingTransferOutAmount: string | BigNumber,
  feeRate: string | number,
): BigNumber => {
  const collateralTotalEquity = BigNumber(paramCollateralTotalEquity)
    .minus(collateralPendingWithdrawAmount)
    .minus(collateralPendingTransferOutAmount);

  const positionOpenValue = BigNumber(positionOpenSize).multipliedBy(oraclePrice).abs();

  // calculatePositionStarkExRiskRate
  // 计算仓位根据合约风险档位计算的实际 starkEx 风险率
  const riskTier = findRiskTier(positionOpenValue.toNumber() || 0, contract.riskTierList);
  const starkExRiskRate = BigNumber(riskTier?.starkExRisk || 0).div(BigNumber(2).pow(32));

  const cmpPositionOpenSizeToZero = BigNumber(positionOpenSize).comparedTo(0)!;
  if (cmpPositionOpenSizeToZero < 0) {
    // 买入平空，所以 s[k]_close > 0
    // if (S[k]_close > 0) : P[k]_close <= ((TV x R[k] + TR) x P[k]_oracle) / (TR x (1 + feeRate))
    const closePrice1 = BigNumber(
      collateralTotalEquity
        .multipliedBy(starkExRiskRate)
        .plus(collateralStarkExRiskValue)
        .multipliedBy(oraclePrice)
        .div(BigNumber(collateralStarkExRiskValue).multipliedBy(BigNumber(1).plus(feeRate)))
        .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_FLOOR),
    );
    // if (S[k]_close > 0) : P[k]_close <= (TV - TR + S[k]_close x P[k]_oracle x (1 + R[k])) / (S[k]_close x (1 + feeRate))
    const closePrice2 = BigNumber(
      collateralTotalEquity
        .minus(collateralStarkExRiskValue)
        .plus(
          BigNumber(positionOpenSize)
            .negated()
            .multipliedBy(oraclePrice)
            .multipliedBy(BigNumber(1).plus(starkExRiskRate)),
        )
        .div(BigNumber(positionOpenSize).negated().multipliedBy(BigNumber(1).plus(feeRate)))
        .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_FLOOR),
    );
    return BigNumber.max(closePrice1, closePrice2);
  } else if (cmpPositionOpenSizeToZero > 0) {
    // 卖出平多，所以 s[k]_close < 0
    // if (s[k]_close < 0) : P[k]_close >= ((TR - TV x R[k]) x P[k]_oracle) / (TR x (1 - feeRate))
    const closePrice1 = BigNumber(
      BigNumber(collateralStarkExRiskValue)
        .minus(collateralTotalEquity.multipliedBy(starkExRiskRate))
        .multipliedBy(oraclePrice)
        .div(BigNumber(collateralStarkExRiskValue).multipliedBy(BigNumber(1).minus(feeRate)))
        .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_CEIL),
    );
    // if (s[k]_close < 0) : P[k]_close >= (TV - TR + S[k]_close x P[k]_oracle x (1 - R[k])) / (S[k]_close x (1 - feeRate))
    const closePrice2 = BigNumber(
      collateralTotalEquity
        .minus(collateralStarkExRiskValue)
        .plus(
          BigNumber(positionOpenSize)
            .negated()
            .multipliedBy(oraclePrice)
            .multipliedBy(BigNumber(1).minus(starkExRiskRate)),
        )
        .div(BigNumber(positionOpenSize).negated().multipliedBy(BigNumber(1).minus(feeRate)))
        .toFixed(getNumberPrecision(contract.tickSize), BigNumber.ROUND_CEIL),
    );
    return BigNumber.min(closePrice1, closePrice2);
  } else {
    return BigNumber(0);
  }
};

/**
 * 订单排序
1. 按  contractId 升序
2. 按照 side 排序
3. 如果 price 为 0，排在最前。如果 price 不为 0 且 side 为 buy，从大到小排序；如果 price 不为 0 且 side 为 sell，从小到大排序
4. 按照提交撮合时间降序 (type 为条件单 取 triggerTime，其他为 createdTime)
5. 按照 id 升序
本质上就一句话，按照成交可能性从大到小排列
 */
export const orderComparator = (a: any, b: any): number => {
  // [3,2,4].sort((a,b) => a-b) 升序
  // [3,2,4].sort((a,b) => b-a) 降序
  // console.log(a.id, b.id, (Number(a.price) == 0 ? 1 : -1) - (Number(b.price) == 0 ? 1 : -1));
  type Key = "SELL" | "BUY";
  return [
    Number(a.contractId) - Number(b.contractId),
    { SELL: 1, BUY: -1 }[a.side as Key] - { SELL: 1, BUY: -1 }[b.side as Key],
    (Number(a.price) == 0 ? -1 : 1) - (Number(b.price) == 0 ? -1 : 1),
    { SELL: -1, BUY: 1 }[b.side as Key] * Number(b.price) -
      { SELL: -1, BUY: 1 }[a.side as Key] * Number(a.price),
    Number(CONST_conditionalOrderType.includes(b.type) ? b.triggerTime : b.createdTime) -
      Number(CONST_conditionalOrderType.includes(a.type) ? a.triggerTime : a.createdTime),
    a.id.localeCompare(b.id),
  ].reduceRight(
    (acc, cur, i, arr) => acc + Math.pow(10, arr.length - i - 1) * (cur > 0 ? 1 : cur < 0 ? -1 : 0),
    0,
  );
};

// TODO rm this method
export const sortOrder = (orderList: any[]): any[] => {
  return orderList.sort(orderComparator);
};

/**
 *
 * @param {object} contract
 * @param {BigNumber} oraclePrice
 * @param {BigNumber} initialMarginRate
 * @param {BigNumber} paramPositionOpenSize
 * @param {BigNumber} paramAvailableAmount
 * @param {Array<object>} sortedOrderList
 * @param {string} orderSide
 * @param {BigNumber} orderCloseSizeAbs
 * @param {BigNumber} orderCloseValueAbs
 * @param {BigNumber} feeRate
 * @returns {boolean} 是否可以下单
 */
export const checkCloseOrderIsValid = (
  contract: any,
  oraclePrice: string | BigNumber,
  initialMarginRate: string | BigNumber,
  paramPositionOpenSize: string | BigNumber,
  paramAvailableAmount: string | BigNumber,
  sortedOrderList: any[],
  orderSide: string,
  orderCloseSizeAbs: string | BigNumber,
  orderCloseValueAbs: string | BigNumber,
  feeRate: string | number,
): boolean => {
  let isValid = true; // 默认
  let availableAmount = BigNumber(0);
  let positionOpenSize = BigNumber(0);
  if (orderSide == TYPE_orderSide.BUY) {
    // availableAmount = 可用 - 平仓冻结金额
    availableAmount = BigNumber(paramAvailableAmount).minus(
      calculateCloseOrderFrozenAmount(
        oraclePrice,
        initialMarginRate,
        orderCloseSizeAbs,
        orderCloseValueAbs,
        feeRate,
      ),
    );
    //positionOpenSize = 开仓数量 + 最大平仓数量
    positionOpenSize = BigNumber(paramPositionOpenSize).plus(orderCloseSizeAbs);
  } else if (orderSide == TYPE_orderSide.SELL) {
    availableAmount = BigNumber(paramAvailableAmount).minus(
      calculateCloseOrderFrozenAmount(
        oraclePrice,
        initialMarginRate,
        BigNumber(orderCloseSizeAbs).negated(),
        BigNumber(orderCloseValueAbs).negated(),
        feeRate,
      ),
    );
    positionOpenSize = BigNumber(paramPositionOpenSize).minus(orderCloseSizeAbs);
  } else {
    isValid = false;
    return isValid;
  }

  sortedOrderList.forEach((order) => {
    if (!isValid) return;
    let orderLeftSize = BigNumber(0);
    // 当前委托单为非终态时
    //orderLeftSize = 订单委托数量 - 审查失败/l2拒绝的数量 - 累计成功处理的成交数量。例： 1 - 0 - 1，说明完全成交
    if (["PENDING", "OPEN", "CANCELING"].includes(order.status)) {
      orderLeftSize = BigNumber(order.size).minus(order.cumFailSize).minus(order.cumFillSize);
    } else if (["FILLED", "CANCELED"].includes(order.status)) {
      // 当前委托单为终态
      //orderLeftSize = 累计撮合数量 - 审查失败/l2拒绝的数量 - 累计成功处理的成交数量。例： 1 - 0 - 1，说明完全成交
      orderLeftSize = BigNumber(order.cumMatchSize)
        .minus(order.cumFailSize)
        .minus(order.cumFillSize);
    } else {
      orderLeftSize = BigNumber(0);
    }
    if (orderLeftSize.lte(0)) {
      return; // continue iteration
    }

    let orderLeftValue = BigNumber(0);
    if (order.price == "0") {
      // 市价单
      orderLeftValue = BigNumber(
        orderLeftSize
          .multipliedBy(BigNumber(order.marketLimitValue))
          .dividedBy(
            BigNumber(order.size).toFixed(
              getNumberPrecision(contract.stepSize),
              order.side == "BUY" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR,
            ),
          ),
      );
    } else {
      orderLeftValue = orderLeftSize.multipliedBy(BigNumber(order.price));
    }

    let orderCloseSize = BigNumber(0);
    if (order.side == "BUY" && positionOpenSize.lt(0)) {
      orderCloseSize = BigNumber.min(positionOpenSize.negated(), orderLeftSize);
    } else if (order.side == "SELL" && positionOpenSize.gt(0)) {
      orderCloseSize = BigNumber.max(positionOpenSize.negated(), orderLeftSize.negated());
    } else {
      orderCloseSize = BigNumber(0);
    }

    let orderOpenSize = BigNumber(0);
    if (order.side == "BUY") {
      orderOpenSize = orderLeftSize.minus(orderCloseSize);
    } else {
      orderOpenSize = orderLeftSize.negated().minus(orderCloseSize);
    }

    const orderCloseValue = BigNumber(
      orderCloseSize
        .multipliedBy(orderLeftValue)
        .dividedBy(orderLeftSize)
        .toFixed(
          getNumberPrecision(contract.stepSize),
          order.side == "BUY" ? BigNumber.ROUND_FLOOR : BigNumber.ROUND_CEIL,
        ),
    );
    let orderOpenValue = BigNumber(0);
    if (order.side == "BUY") {
      orderOpenValue = orderLeftValue.minus(orderCloseValue);
    } else {
      orderOpenValue = orderLeftValue.negated().minus(orderCloseValue);
    }

    availableAmount = availableAmount
      .plus(
        calculateCloseOrderFrozenAmount(
          oraclePrice,
          initialMarginRate,
          orderCloseSize,
          orderCloseValue,
          feeRate,
        ),
      )
      .plus(
        calculateOpenOrderFrozenAmount(
          oraclePrice,
          initialMarginRate,
          orderOpenSize,
          orderOpenValue,
          feeRate,
        ),
      );

    if (orderOpenSize.comparedTo(0) != 0 && availableAmount.comparedTo(0)! < 0) {
      isValid = false;
      return;
    }

    if (orderSide == TYPE_orderSide.BUY) {
      positionOpenSize = positionOpenSize.plus(orderCloseSize);
    } else {
      positionOpenSize = positionOpenSize.minus(orderCloseSize);
    }
  });

  return isValid;
};

export const calculateOrderFillData = ({
  contract,
  positionOpenSize,
  order,
}: {
  contract: any;
  positionOpenSize: BigNumber;
  order: any;
}) => {
  let orderLeftSize = BigNumber(0);
  if (["PENDING", "OPEN", "CANCELING"].includes(order.status)) {
    orderLeftSize = BigNumber(order.size).minus(order.cumFailSize).minus(order.cumFillSize);
  } else {
    orderLeftSize = BigNumber(order.cumMatchSize).minus(order.cumFailSize).minus(order.cumFillSize);
  }

  if (orderLeftSize.lte(0)) {
    return {
      closeSize: BigNumber(0),
      closeValue: BigNumber(0),
      openSize: BigNumber(0),
      openValue: BigNumber(0),
    };
  }

  let orderLeftValue = BigNumber(0);
  if (order.price == "0") {
    // 市价单
    orderLeftValue = BigNumber(
      orderLeftSize
        .multipliedBy(BigNumber(order.marketLimitValue))
        .dividedBy(
          BigNumber(order.size).toFixed(
            getNumberPrecision(contract.stepSize),
            order.side == "BUY" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR,
          ),
        ),
    );
  } else {
    orderLeftValue = orderLeftSize.multipliedBy(BigNumber(order.price));
  }

  let orderCloseSize = BigNumber(0);
  if (order.side == "BUY" && positionOpenSize.lt(0)) {
    orderCloseSize = BigNumber.min(positionOpenSize.abs(), orderLeftSize);
  } else if (order.side == "SELL" && positionOpenSize.gt(0)) {
    orderCloseSize = BigNumber(0).minus(BigNumber.min(positionOpenSize, orderLeftSize));
  }

  let orderOpenSize = BigNumber(0);
  if (order.side == "BUY") {
    orderOpenSize = BigNumber(orderLeftSize).minus(BigNumber(orderCloseSize));
  } else {
    orderOpenSize = BigNumber(orderLeftSize).negated().minus(BigNumber(orderCloseSize));
  }

  const orderCloseValue = BigNumber(
    orderCloseSize
      .multipliedBy(orderLeftValue)
      .dividedBy(
        orderLeftSize.toFixed(
          getNumberPrecision(contract.stepSize),
          order.side == "BUY" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR,
        ),
      ),
  );

  const orderOpenValue =
    order.side == "BUY"
      ? orderLeftValue.minus(orderCloseValue)
      : orderLeftValue.negated().minus(orderCloseValue);
  return {
    closeSize: orderCloseSize,
    closeValue: orderCloseValue,
    openSize: orderOpenSize,
    openValue: orderOpenValue,
  };
};

/**
 * 计算最大可下单数量 (限价单)
 * @param {object} options parameter object
 * @param {string} options.contractId like "1000001"
 * @param {string} options.orderSide BUY/SELL
 * @param {string} options.orderPrice 订单价格
 * @param {object} options.metadata like {contractList:[]},
 * @param {object} options.account like {contractIdToTradeSetting: {},defaultTradeSetting:{}},
 * @param {Array<object>} options.position like [{contractId: "1000001"}]
 * @param {Array<object>} options.symbolsList like [{contractId: "1000001",symbol:"BTCUSDT"}]
 * @param {Array<object>} options.withdraw 提现单列表
 * @param {Array<object>} options.transferOut 转出单列表
 * @param {Array<object>} options.order 订单/委托单列表
 * @param {Array<object>} options.collateral 抵押品列表
 * @param {boolean} options.reduceOnly 是否只减仓
 * @return {BigNumber} 最大可下单数量
 */
export const calculateMaxCreateOrderSize = ({
  contractId,
  metadata,
  positionList,
  symbolsList,
  account,
  withdraw,
  transferOut,
  orderList,
  collateral,
  orderSide,
  orderPrice,
  reduceOnly,
  tickers,
}: {
  contractId: string;
  metadata: IMetadata;
  positionList: Position[];
  symbolsList: IContract[];
  account: AccountInfo;
  withdraw: any[];
  transferOut: any[];
  orderList: OrderEntry[];
  collateral: any[];
  orderSide: string;
  orderPrice: string;
  reduceOnly: boolean;
  tickers: Map<string, Ticker>;
}): BigNumber => {
  if (!orderPrice) return BigNumber(0);
  const contract = symbolsList.find((s) => s.contractId == contractId)!;
  const ticker = tickers.get(contract.contractName) || Ticker.fromEmpty();
  const quoteCoinId = contract?.quoteCoinId;

  const collateralInfo = getCollateralInfo({
    contractId,
    quoteCoinId,
    positionList,
    symbolsList,
    metadata,
    account,
    withdraw,
    transferOut,
    collateral,
    orderList: orderList,
    tickers,
  });
  const collateralPendingWithdrawAmount = collateralInfo.totalPendingWithdrawAmount;
  const collateralPendingTransferOutAmount = collateralInfo.totalPendingTransferOutAmount;
  let collateralTotalEquity = BigNumber(collateralInfo.totalEquity);
  let collateralInitialMarginRequirement = BigNumber(collateralInfo.totalInitialMarginRequirement);
  let collateralStarkExRiskValue = BigNumber(collateralInfo.totalStarkExRiskValue);

  // 没有委托单的情况占用金额
  let availableAmount = collateralTotalEquity
    .minus(collateralPendingWithdrawAmount)
    .minus(collateralPendingTransferOutAmount)
    .minus(collateralInitialMarginRequirement);

  const { takerFeeRate, makerFeeRate } = getFeeRate({ contractId, account, metadata });
  const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));

  const curContractMaxLeverage = getMaxLeverage({ contractId, metadata, account });
  const curContractInitialMarginRate = BigNumber(1)
    .div(curContractMaxLeverage as any)
    .toFixed(6, BigNumber.ROUND_FLOOR);

  const sortedOrder = sortOrder(orderList.filter((o) => o.status != "UNTRIGGERED"));

  let tmpContract: any = null;
  let tmpOrderSide = "";
  let tmpPositionOpenSize = BigNumber(0);
  let tmpContractOrderFrozenAmount = BigNumber(0);

  sortedOrder.forEach((tmpOrder) => {
    if (tmpOrder.contractId == contractId && tmpOrder.side == orderSide) {
      return;
    }
    if (tmpOrder.contractId != tmpContract?.contractId || tmpOrder.side != tmpOrderSide) {
      availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, 0));
      tmpContractOrderFrozenAmount = BigNumber(0);
      tmpContract = symbolsList.find((s) => s.contractId == tmpOrder.contractId);
      tmpOrderSide = tmpOrder.side;
      const contractPosition = positionList.find((p) => p.contractId == tmpOrder.contractId);
      tmpPositionOpenSize = BigNumber(contractPosition?.openSize || "0");
    }
    const tmpOrderInitialMarginRate = BigNumber(1)
      .div(tmpOrder.maxLeverage)
      .toFixed(6, BigNumber.ROUND_FLOOR);
    const tmpOrderFeeRate = Math.max(tmpOrder.takerFeeRate, tmpOrder.makerFeeRate);

    const { closeSize, closeValue, openSize, openValue } = calculateOrderFillData({
      contract: tmpContract,
      order: tmpOrder,
      positionOpenSize: tmpPositionOpenSize,
    });

    const ticker = tickers.get(tmpContract.contractName) || Ticker.fromEmpty();

    tmpContractOrderFrozenAmount = tmpContractOrderFrozenAmount
      .plus(
        calculateCloseOrderFrozenAmount(
          ticker.oraclePrice,
          tmpOrderInitialMarginRate,
          closeSize,
          closeValue,
          tmpOrderFeeRate,
        ),
      )
      .plus(
        calculateOpenOrderFrozenAmount(
          ticker.oraclePrice,
          tmpOrderInitialMarginRate,
          openSize,
          openValue,
          tmpOrderFeeRate,
        ),
      );

    tmpPositionOpenSize = tmpPositionOpenSize.plus(closeSize).plus(openSize);
  });
  availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, 0));
  let positionOpenSize = BigNumber(
    positionList.find((p) => p.contractId == contractId)?.openSize || "0",
  );
  const positionWorstClosePrice = calculatePositionWorstClosePrice(
    contract,
    ticker?.oraclePrice?.toString(),
    positionOpenSize,
    collateralTotalEquity,
    collateralStarkExRiskValue,
    collateralPendingWithdrawAmount,
    collateralPendingTransferOutAmount,
    feeRate,
  );

  let greaterOrderModelSortedList: any[] = [];

  const curOrder = {
    id: "0",
    contractId,
    side: orderSide,
    price: orderPrice,
    type: "LIMIT",
    createdTime: Number.MAX_SAFE_INTEGER,
    triggerTime: Number.MAX_SAFE_INTEGER,
  };
  sortedOrder.forEach((tmpOrder) => {
    if (tmpOrder.contractId != contractId || tmpOrder.side != orderSide) {
      return;
    }

    if (orderComparator(curOrder, tmpOrder) < 0) {
      greaterOrderModelSortedList.push(tmpOrder);
      return;
    }

    const tmpOrderInitialMarginRate = BigNumber(1)
      .div(tmpOrder.maxLeverage)
      .toFixed(6, BigNumber.ROUND_FLOOR);
    const tmpOrderFeeRate = Math.max(tmpOrder.takerFeeRate, tmpOrder.makerFeeRate);

    const { closeSize, closeValue, openSize, openValue } = calculateOrderFillData({
      contract,
      order: tmpOrder,
      positionOpenSize: positionOpenSize,
    });

    availableAmount = availableAmount
      .minus(
        calculateCloseOrderFrozenAmount(
          ticker.oraclePrice,
          tmpOrderInitialMarginRate,
          closeSize,
          closeValue,
          tmpOrderFeeRate,
        ),
      )
      .minus(
        calculateOpenOrderFrozenAmount(
          ticker.oraclePrice,
          tmpOrderInitialMarginRate,
          openSize,
          openValue,
          tmpOrderFeeRate,
        ),
      );

    positionOpenSize = positionOpenSize.plus(closeSize).plus(openSize);
  });

  let maxCloseSizeAbsLimit = BigNumber(0);
  if (
    (orderSide == TYPE_orderSide.BUY && positionOpenSize.lt(0)) ||
    (orderSide == TYPE_orderSide.SELL && positionOpenSize.gt(0))
  ) {
    maxCloseSizeAbsLimit = positionOpenSize.abs();
  } else {
    maxCloseSizeAbsLimit = BigNumber(0);
  }

  if (maxCloseSizeAbsLimit.gt(0)) {
    if (
      (orderSide == TYPE_orderSide.BUY && BigNumber(orderPrice).gte(positionWorstClosePrice)) ||
      (orderSide == TYPE_orderSide.SELL && BigNumber(orderPrice).lt(positionWorstClosePrice))
    ) {
      return BigNumber(0);
    }
    // 判断 maxCloseSizeAbsLimit 是否可以下单
    if (
      !checkCloseOrderIsValid(
        contract,
        ticker.oraclePrice.toString(),
        curContractInitialMarginRate,
        positionOpenSize,
        availableAmount,
        greaterOrderModelSortedList,
        orderSide,
        maxCloseSizeAbsLimit,
        maxCloseSizeAbsLimit.multipliedBy(orderPrice),
        feeRate,
      )
    ) {
      // 如果 maxCloseSizeAbsLimit 下单失败，使用二分法找到 合适的下单数量，并返回
      let minCloseSizeAbsInclusive = BigNumber(0);
      let maxCloseSizeAbsExclusive = maxCloseSizeAbsLimit;
      while (
        maxCloseSizeAbsExclusive.minus(minCloseSizeAbsInclusive).gt(BigNumber(contract.stepSize))
      ) {
        const midCloseSizeAbs = BigNumber(
          maxCloseSizeAbsExclusive
            .plus(minCloseSizeAbsInclusive)
            .dividedBy(2)
            .toFixed(getNumberPrecision(contract.stepSize), BigNumber.ROUND_FLOOR),
        );
        if (
          checkCloseOrderIsValid(
            contract,
            ticker.oraclePrice.toString(),
            curContractInitialMarginRate,
            positionOpenSize,
            availableAmount,
            greaterOrderModelSortedList,
            orderSide,
            midCloseSizeAbs,
            midCloseSizeAbs.multipliedBy(orderPrice),
            feeRate,
          )
        ) {
          minCloseSizeAbsInclusive = midCloseSizeAbs;
        } else {
          maxCloseSizeAbsExclusive = midCloseSizeAbs;
        }
      }
      return minCloseSizeAbsInclusive;
    }
    if (orderSide == TYPE_orderSide.BUY) {
      availableAmount = availableAmount.minus(
        calculateCloseOrderFrozenAmount(
          ticker.oraclePrice,
          curContractInitialMarginRate,
          maxCloseSizeAbsLimit,
          maxCloseSizeAbsLimit.multipliedBy(orderPrice),
          feeRate,
        ),
      );
    } else if (orderSide == TYPE_orderSide.SELL) {
      availableAmount = availableAmount.minus(
        calculateCloseOrderFrozenAmount(
          ticker.oraclePrice,
          curContractInitialMarginRate,
          maxCloseSizeAbsLimit.negated(),
          maxCloseSizeAbsLimit.multipliedBy(orderPrice).negated(),
          feeRate,
        ),
      );
    }
  }
  if (reduceOnly) {
    return maxCloseSizeAbsLimit;
  }
  // 计算合适的开仓数量
  greaterOrderModelSortedList.forEach((tmpOrder) => {
    const tmpOrderInitialMarginRate = BigNumber(1)
      .div(tmpOrder.maxLeverage)
      .toFixed(6, BigNumber.ROUND_FLOOR);
    const tmpOrderFeeRate = Math.max(tmpOrder.takerFeeRate, tmpOrder.makerFeeRate);
    const { openSize, openValue } = calculateOrderFillData({
      contract,
      order: tmpOrder,
      positionOpenSize: BigNumber(0),
    });

    availableAmount = availableAmount.minus(
      calculateOpenOrderFrozenAmount(
        ticker.oraclePrice,
        tmpOrderInitialMarginRate,
        openSize,
        openValue,
        tmpOrderFeeRate,
      ),
    );
  });

  let divisor = BigNumber(0);

  if (orderSide == TYPE_orderSide.BUY) {
    // 如果是买入开多，最大开仓量 = 可用余额 / (max (orderOpenPrice - oraclePrice, 0) + oraclePrice x initialMarginRate + orderOpenPrice x feeRate)
    divisor = BigNumber.max(BigNumber(orderPrice).minus(ticker?.oraclePrice), 0)
      .plus(BigNumber(ticker.oraclePrice).multipliedBy(curContractInitialMarginRate))
      .plus(BigNumber(orderPrice).multipliedBy(feeRate));
  } else if (orderSide == TYPE_orderSide.SELL) {
    // 如果是卖出开空，最大开仓量 = 可用余额 / (max (oraclePrice - orderOpenPrice, 0) + oraclePrice x initialMarginRate + orderOpenPrice x feeRate)
    divisor = BigNumber.max(BigNumber(ticker?.oraclePrice).minus(orderPrice), 0)
      .plus(BigNumber(ticker.oraclePrice).multipliedBy(curContractInitialMarginRate))
      .plus(BigNumber(orderPrice).multipliedBy(feeRate));
  } else {
  }

  let maxOpenSizeAbs = BigNumber(0);
  if (availableAmount.lte(0)) {
    // invalid orderSide or initialMarginRate
    maxOpenSizeAbs = BigNumber(0);
  } else {
    maxOpenSizeAbs = BigNumber(
      availableAmount
        .dividedBy(divisor)
        .toFixed(getNumberPrecision(contract.stepSize), BigNumber.ROUND_FLOOR),
    );
  }
  return maxOpenSizeAbs.plus(maxCloseSizeAbsLimit);
};

/**
 * 计算最大可下单数量 (市价单)
 * @param {object} options parameter object
 * @param {string} options.contractId like "1000001"
 * @param {string} options.orderSide BUY/SELL
 * @param {string} options.orderPrice 订单价格
 * @param {object} options.metadata like {contractList:[]},
 * @param {object} options.account like {contractIdToTradeSetting: {},defaultTradeSetting:{}},
 * @param {Array<object>} options.position like [{contractId: "1000001"}]
 * @param {Array<object>} options.symbolsList like [{contractId: "1000001",symbol:"BTCUSDT"}]
 * @param {Array<object>} options.withdraw 提现单列表
 * @param {Array<object>} options.transferOut 转出单列表
 * @param {Array<object>} options.order 订单/委托单列表
 * @param {Array<object>} options.collateral 抵押品列表
 * @param {boolean} options.reduceOnly 是否只减仓
 * @param {string} options.bid1 卖一价
 * @param {string} options.ask 买一价
 * @return {BigNumber} 最大可下单数量
 */
export const calculateMaxCreateMarketOrderSize = ({
  contractId,
  metadata,
  positionList,
  symbolsList,
  account,
  withdraw,
  transferOut,
  order,
  collateral,
  orderSide,
  reduceOnly,
  bid1,
  ask1,
  tickers,
}: {
  contractId: string;
  metadata: IMetadata;
  positionList: Position[];
  symbolsList: IContract[];
  account: AccountInfo;
  withdraw: any[];
  transferOut: any[];
  order: any[];
  collateral: any[];
  orderSide: string;
  reduceOnly: boolean;
  bid1: string;
  ask1: string;
  tickers: Map<string, Ticker>;
}): BigNumber => {
  const orderPrice = orderSide == "BUY" ? ask1 : bid1;
  return calculateMaxCreateOrderSize({
    contractId,
    metadata,
    positionList: positionList,
    symbolsList,
    account,
    withdraw,
    transferOut,
    orderList: order,
    collateral,
    orderSide,
    orderPrice,
    reduceOnly,
    tickers,
  });
};

/**
 * 计算下单成本
 * @param {object} options parameter object
 * @param {string} options.contractId like "1000001"
 * @param {object} options.metadata like {contractList:[]},
 * @param {Array<object>} options.position like [{contractId: "1000001"}]
 * @param {Array<object>} options.symbolsList like [{contractId: "1000001",symbol:"BTCUSDT"}]
 * @param {object} options.account like {contractIdToTradeSetting: {},defaultTradeSetting:{}},
 * @param {Array<object>} options.order 订单/委托单列表
 * @param {string} options.orderSide BUY/SELL
 * @param {string} options.orderPrice 订单价格
 * @param {string} options.orderSize 订单数量
 * @return {BigNumber} 下单成本
 */
export const calculateCreateOrderCost = ({
  contractId,
  metadata,
  positionList,
  symbolsList,
  account,
  orderList,
  orderSide,
  orderPrice,
  orderSize,
  tickers,
}: {
  contractId: string;
  metadata: IMetadata;
  positionList: Position[];
  symbolsList: IContract[];
  orderList: OrderEntry[];
  account: AccountInfo;
  orderSide: string;
  orderPrice: string;
  orderSize: string;
  tickers: Map<string, Ticker>;
}): BigNumber => {
  const contract = symbolsList.find((s) => s.contractId == contractId)!;
  const ticker = tickers.get(contract.contractName) || Ticker.fromEmpty();

  let positionOpenSize = BigNumber(
    positionList.find((p) => p.contractId == contractId)?.openSize || "0",
  );
  const curOrder = {
    id: "0",
    contractId,
    side: orderSide,
    price: orderPrice,
    type: "LIMIT",
    createdTime: Number.MAX_SAFE_INTEGER,
    triggerTime: Number.MAX_SAFE_INTEGER,
    size: orderSize,
    status: "OPEN",
    cumFailSize: "0",
    cumFillSize: "0",
  };
  const sortedOrder = sortOrder(
    orderList.filter(
      (o) => o.status != "UNTRIGGERED" && o.contractId == contractId && o.side == orderSide,
    ),
  );

  sortedOrder.forEach((tmpOrder) => {
    if (orderComparator(curOrder, tmpOrder) < 0) {
      return;
    }

    const { closeSize, openSize } = calculateOrderFillData({
      contract,
      order: tmpOrder,
      positionOpenSize: positionOpenSize,
    });

    positionOpenSize = positionOpenSize.plus(closeSize).plus(openSize);
  });
  const { openSize, closeSize } = calculateOrderFillData({
    contract,
    order: curOrder,
    positionOpenSize: positionOpenSize,
  });
  const { takerFeeRate, makerFeeRate } = getFeeRate({ contractId, account, metadata });
  const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));

  const curContractMaxLeverage = getMaxLeverage({ contractId, metadata, account });
  const curContractInitialMarginRate = BigNumber(1)
    .div(curContractMaxLeverage as any)
    .toFixed(6, BigNumber.ROUND_FLOOR);

  const frozenOpenAmount = calculateOpenOrderFrozenAmount(
    ticker.oraclePrice,
    curContractInitialMarginRate,
    openSize,
    BigNumber(openSize).multipliedBy(orderPrice),
    feeRate,
  );
  const closeCloseAmount = calculateCloseOrderFrozenAmount(
    ticker.oraclePrice,
    curContractInitialMarginRate,
    closeSize,
    BigNumber(closeSize).multipliedBy(orderPrice),
    feeRate,
  );

  return BigNumber.max(frozenOpenAmount.plus(closeCloseAmount), 0);
};

/**
 * 计算成交后的 抵押品总价值
 *
 * @param {object} params           参数
 * @param {string} params.oraclePrice           预言机价格
 * @param {string} params.collateralTotalEquity 账户当前抵押品总价值
 * @param {string} params.fillSize              成交数量 (买入为正，卖出为负)
 * @param {string} params.fillValue             成交价值 (买入为正，卖出为负)
 * @param {string} params.fillFee               成交手续费 (一般为负值)
 * @return {BigNumber} 成交后的 抵押品总价值
 */
export const calculateCollateralTotalEquityAfterFill = ({
  oraclePrice,
  collateralTotalEquity,
  fillSize,
  fillValue,
  fillFee,
}: {
  oraclePrice: string | BigNumber;
  collateralTotalEquity: string | BigNumber;
  fillSize: string | BigNumber;
  fillValue: string | BigNumber;
  fillFee: string | BigNumber;
}): BigNumber => {
  return BigNumber(collateralTotalEquity)
    .minus(fillValue)
    .plus(BigNumber(fillSize).multipliedBy(oraclePrice))
    .plus(fillFee);
};

/**
 * 计算成交后的 抵押品 starkex 总风险金额
 * @param {object} params                   参数
 * @param {object} params.contract                   合约配置
 * @param {string} params.oraclePrice                预言机价格
 * @param {string} params.positionOpenSize           当前仓位开仓数量 (多仓为正，空仓为负)buyWithPct
 * @param {string} params.collateralStarkExRiskValue 账户当前抵押品对应所有仓位总 starkEx 风险额之和
 * @param {string} params.fillSize                   成交数量 (买入为正，卖出为负)
 * @return {BigNumber} 抵押品 starkex 总风险金额
 */
export const calculateCollateralStarkExRiskValueAfterFill = ({
  contract,
  oraclePrice,
  positionOpenSize,
  collateralStarkExRiskValue,
  fillSize,
}: {
  contract: any;
  oraclePrice: string | BigNumber;
  positionOpenSize: string | BigNumber;
  collateralStarkExRiskValue: string | BigNumber;
  fillSize: string | BigNumber;
}): BigNumber => {
  const positionValue = BigNumber(positionOpenSize).multipliedBy(oraclePrice);
  const positionStackExRiskRate = BigNumber(
    findRiskTier(positionValue.toNumber() || 0, contract.riskTierList)?.starkExRisk || 0,
  ).div(BigNumber(2).pow(32));
  const positionStarkExRiskValue = positionValue.abs().multipliedBy(positionStackExRiskRate);

  const afterPositionOpenSize = BigNumber(positionOpenSize).plus(fillSize);
  const afterPositionValue = afterPositionOpenSize.multipliedBy(oraclePrice);
  const afterPositionStackExRiskRate = BigNumber(
    findRiskTier(afterPositionValue.toNumber() || 0, contract.riskTierList)?.starkExRisk || 0,
  ).div(BigNumber(2).pow(32));
  const afterPositionStarkExRiskValue = afterPositionValue
    .abs()
    .multipliedBy(afterPositionStackExRiskRate);

  return BigNumber(collateralStarkExRiskValue)
    .minus(positionStarkExRiskValue)
    .plus(afterPositionStarkExRiskValue);
};

/**
 * 计算订单的预估强平价
 * @param {object} params
 * @returns {BigNumber} 预估强平价
 */
export const calculateCreateOrderLiquidatePrice = ({
  contractId,
  metadata,
  positionList,
  symbolsList,
  account,
  withdraw,
  transferOut,
  order,
  collateral,
  orderSide,
  orderPrice,
  orderSize,
  tickers,
}: {
  contractId: string;
  metadata: IMetadata;
  positionList: Position[];
  symbolsList: IContract[];
  account: AccountInfo;
  withdraw: any[];
  transferOut: any[];
  order: any[];
  collateral: any[];
  orderSide: string;
  orderPrice: string;
  orderSize: string;
  tickers: Map<string, Ticker>;
}) => {
  if (!orderPrice || !orderSize) return BigNumber(0);
  const contract = symbolsList.find((s) => s.contractId == contractId)!;
  const ticker = tickers.get(contract.contractName) || Ticker.fromEmpty();
  const quoteCoinId = contract?.quoteCoinId;

  const collateralInfo = getCollateralInfo({
    contractId,
    quoteCoinId,
    positionList,
    symbolsList,
    metadata,
    account,
    withdraw,
    transferOut,
    collateral,
    orderList: order,
    tickers,
  });
  const collateralPendingWithdrawAmount = collateralInfo.totalPendingWithdrawAmount;
  const collateralPendingTransferOutAmount = collateralInfo.totalPendingTransferOutAmount;
  const collateralTotalEquity = BigNumber(collateralInfo.totalEquity);
  const collateralStarkExRiskValue = BigNumber(collateralInfo.totalStarkExRiskValue);

  const { takerFeeRate, makerFeeRate } = getFeeRate({ contractId, account, metadata });
  const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));

  let positionOpenSize = BigNumber(
    positionList.find((p) => p.contractId == contractId)?.openSize || "0",
  );

  const fillSize = BigNumber(orderSize).dividedBy(orderSide == "BUY" ? 1 : -1);
  const fillValue = fillSize.multipliedBy(orderPrice);
  const fillFee = fillValue.multipliedBy(feeRate).abs().negated();

  const oraclePrice = ticker?.oraclePrice?.toString();
  const afterCollateralTotalEquity = calculateCollateralTotalEquityAfterFill({
    oraclePrice,
    collateralTotalEquity,
    fillSize,
    fillValue,
    fillFee,
  });
  const afterCollateralStarkExRiskValue = calculateCollateralStarkExRiskValueAfterFill({
    contract,
    oraclePrice,
    positionOpenSize,
    collateralStarkExRiskValue,
    fillSize,
  });

  const afterPositionSize = positionOpenSize.plus(fillSize);

  const afterLiquidatePrice = calculatePositionLiquidatePrice({
    contract,
    oraclePrice,
    positionOpenSize: afterPositionSize,
    paramCollateralTotalEquity: afterCollateralTotalEquity,
    collateralStarkExRiskValue: afterCollateralStarkExRiskValue,
    collateralPendingWithdrawAmount,
    collateralPendingTransferOutAmount,
  });
  return afterLiquidatePrice;
};
