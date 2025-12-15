/**
 * 抵押品相关的计算
 */

import BigNumber from "bignumber.js";
import { AccountInfo, IMetadata, IContract as ISymbol, OrderEntry } from "@edgex/types";
import { ENUM_TRANSFER_STATUS, ENUM_WITHDRAW_STATUS } from "../constants";
import { Position } from "../entities/Position";
import { Ticker } from "../entities/Ticker";
import { getMaxLeverage } from "./account";
import {
  calculateCloseOrderFrozenAmount,
  calculateOpenOrderFrozenAmount,
  calculateOrderFillData,
  sortOrder,
} from "./order";

interface Withdraw {
  coinId: string;
  status: string;
  amount: string;
  [key: string]: any;
}

interface TransferOut {
  coinId: string;
  status: string;
  amount: string;
  [key: string]: any;
}

interface Collateral {
  coinId: string;
  amount: string;
  [key: string]: any;
}

export const getCollateralInfo = ({
  contractId,
  quoteCoinId,
  positionList,
  symbolsList,
  orderList,
  metadata,
  account,
  withdraw,
  transferOut,
  collateral,
  tickers,
}: {
  contractId?: string;
  quoteCoinId: string;
  positionList: Position[];
  symbolsList: ISymbol[];
  orderList: OrderEntry[];
  metadata: IMetadata;
  account: AccountInfo;
  withdraw: Withdraw[];
  transferOut: TransferOut[];
  collateral: Collateral[];
  tickers: Map<string, Ticker>;
}) => {
  const currentCollateral = collateral.find((c) => c.coinId === quoteCoinId);

  // (当前抵押品总初始保证金)
  let totalInitialMarginRequirement = BigNumber(0);
  // (当前抵押品整体权益)
  let totalEquity = BigNumber(currentCollateral?.amount || "0");
  // (当前抵押品总维持保证金)
  let totalStarkExRiskValue = BigNumber(0);

  positionList
    ?.filter((p) => p.coinId == quoteCoinId)
    ?.forEach((p) => {
      // Use Entity methods
      const ticker = tickers.get(p.symbol.contractName) || Ticker.fromEmpty();

      const curAccountMaxLeverage = getMaxLeverage({
        contractId: p.contractId,
        metadata,
        account,
      });

      // 1. Calculate Actual Leverage using Entity
      // Note: getMaxLeverage returns number, getActualLeverage expects number|string. Compatible.
      const actualLeverage = p.getActualLeverage(ticker.oraclePrice, curAccountMaxLeverage);

      // 2. Calculate IMR using Entity
      const imr = p.getInitialMarginRequirement(ticker.oraclePrice, actualLeverage.toNumber());

      // 3. Calculate Risk Value using Entity
      const riskValue = p.getStarkExRiskValue(ticker.oraclePrice);

      // 4. Calculate Current Value (Signed) using Entity
      const currentValue = p.getCurrentValue(ticker.oraclePrice);

      totalInitialMarginRequirement = totalInitialMarginRequirement.plus(imr);
      totalEquity = totalEquity.plus(currentValue);
      totalStarkExRiskValue = totalStarkExRiskValue.plus(riskValue);
    });

  // ... rest of the function (withdraw, transferOut, orders) ...

  // 抵押品所有处理中的提现金额
  // Collateral.totalPendingTransferOutAmount = sum ( TransferOut.amount ) 当前抵押品对应正在处理的转出单 (status=PENDING_XXX) 所有金额之和
  const totalPendingWithdrawAmount = withdraw
    .filter((w) => w.coinId == quoteCoinId && w.status == ENUM_WITHDRAW_STATUS.PENDING_CENSORING)
    .reduce((acc, cur) => {
      return acc.plus(cur.amount);
    }, BigNumber(0));

  // 抵押品所有处理中的转出金额
  //  * Collateral.totalPendingTransferOutAmount = sum ( TransferOut.amount ) 当前抵押品对应正在处理的转出单 (status=PENDING_XXX) 所有金额之和
  const totalPendingTransferOutAmount = transferOut
    .filter(
      (t) =>
        (t.coinId == quoteCoinId && t.status == ENUM_TRANSFER_STATUS.PENDING_CENSORING) ||
        t.status == ENUM_TRANSFER_STATUS.PENDING_CHECKING,
    )
    .reduce((acc, cur) => {
      return acc.plus(cur.amount);
    }, BigNumber(0));

  // 计算所有订单冻结金额
  let totalOrderFrozenAmount = BigNumber(0);

  const sortedOrder = sortOrder(orderList.filter((o) => o.status != "UNTRIGGERED"));

  let tmpContract: ISymbol | null = null;
  let tmpOrderSide = "";
  let tmpPositionOpenSize = BigNumber(0);
  let tmpOrderFrozenAmount = BigNumber(0);

  sortedOrder.forEach((tmpOrder) => {
    if (tmpOrder.contractId != tmpContract?.contractId || tmpOrder.side != tmpOrderSide) {
      tmpContract = symbolsList.find((s) => s.contractId == tmpOrder.contractId) || null;

      tmpOrderSide = tmpOrder.side;
      totalOrderFrozenAmount = totalOrderFrozenAmount.plus(BigNumber.max(tmpOrderFrozenAmount, 0));
      tmpOrderFrozenAmount = BigNumber(0);
      const contractPosition = positionList.find((p) => p.contractId == tmpOrder.contractId);
      tmpPositionOpenSize = BigNumber(contractPosition?.openSize || "0");
    }
    const tmpOrderInitialMarginRate = BigNumber(1)
      .div(tmpOrder.maxLeverage)
      .toFixed(6, BigNumber.ROUND_FLOOR);
    const tmpOrderFeeRate = Math.max(tmpOrder.takerFeeRate, tmpOrder.makerFeeRate);
    const { closeSize, closeValue, openSize, openValue } = calculateOrderFillData({
      contract: tmpContract!,
      order: tmpOrder,
      positionOpenSize: tmpPositionOpenSize,
    });

    const ticker = tickers.get(tmpContract?.contractName!) || Ticker.fromEmpty();
    tmpOrderFrozenAmount = tmpOrderFrozenAmount
      .plus(
        calculateCloseOrderFrozenAmount(
          ticker!.oraclePrice,
          tmpOrderInitialMarginRate,
          closeSize,
          closeValue,
          tmpOrderFeeRate,
        ),
      )
      .plus(
        calculateOpenOrderFrozenAmount(
          ticker!.oraclePrice,
          tmpOrderInitialMarginRate,
          openSize,
          openValue,
          tmpOrderFeeRate,
        ),
      );

    tmpPositionOpenSize = tmpPositionOpenSize.plus(closeSize).plus(openSize);
  });
  totalOrderFrozenAmount = totalOrderFrozenAmount.plus(BigNumber.max(tmpOrderFrozenAmount, 0));

  return {
    totalEquity,
    totalInitialMarginRequirement: totalInitialMarginRequirement,
    totalStarkExRiskValue: totalStarkExRiskValue,
    totalPendingWithdrawAmount,
    totalPendingTransferOutAmount,
    totalOrderFrozenAmount,
  };
};
