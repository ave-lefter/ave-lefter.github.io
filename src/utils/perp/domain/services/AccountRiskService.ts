import BigNumber from "bignumber.js";
import type { IMetadata, OrderEntry } from "../../types"
import { ENUM_TRANSFER_STATUS, ENUM_WITHDRAW_STATUS } from "../constants";
import { Account } from "../entities/Account";
import { Collateral } from "../entities/Collateral";
import { Order } from "../entities/Order";
import { Position } from "../entities/Position";
import { SymbolEntity } from "../entities/Symbol";
import { Ticker } from "../entities/Ticker";
import { OrderMarginService } from "./OrderMarginService";

interface IWithdraw {
  coinId: string;
  status: string;
  amount: string;
  [key: string]: any;
}

interface ITransferOut {
  coinId: string;
  status: string;
  amount: string;
  [key: string]: any;
}

export interface CalculateCollateralStatsParams {
  contractId?: string;
  quoteCoinId: string;
  positionList: Position[];
  symbolsList: SymbolEntity[];
  orderList: OrderEntry[];
  metadata: IMetadata;
  account: Account;
  withdraw: IWithdraw[];
  transferOut: ITransferOut[];
  collateral: Collateral[];
  tickers: Map<string, Ticker>;
}

export interface CollateralStats {
  totalEquity: BigNumber;
  totalInitialMarginRequirement: BigNumber;
  totalStarkExRiskValue: BigNumber;
  totalPendingWithdrawAmount: BigNumber;
  totalPendingTransferOutAmount: BigNumber;
  totalOrderFrozenAmount: BigNumber;
}

/**
 * Account Risk Service
 *
 * Domain Service responsible for calculating account-level risk metrics,
 * including collateral equity, margin requirements, and frozen assets.
 */
export class AccountRiskService {
  /**
   * Calculate comprehensive collateral statistics for a specific quote coin.
   */
  static calculateCollateralStats(params: CalculateCollateralStatsParams): CollateralStats {
    const {
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
    } = params;

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

        // Use Account Entity method
        const curAccountMaxLeverage = account.getEffectiveMaxLeverage(p.contractId, metadata);

        // 1. Calculate Actual Leverage using Entity
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

    // 抵押品所有处理中的提现金额
    const totalPendingWithdrawAmount = withdraw
      .filter((w) => w.coinId == quoteCoinId && w.status == ENUM_WITHDRAW_STATUS.PENDING_CENSORING)
      .reduce((acc, cur) => {
        return acc.plus(cur.amount);
      }, BigNumber(0));

    // 抵押品所有处理中的转出金额
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

    // 1. 过滤并排序订单 (使用 Order 实体逻辑)
    const activeOrders = orderList.filter((o) => o.status != "UNTRIGGERED");
    const sortedOrderRaw = Order.sort(activeOrders) as OrderEntry[];

    let tmpSymbol: SymbolEntity | null = null;
    let tmpOrderSide = "";
    let tmpPositionOpenSize = BigNumber(0);
    let tmpOrderFrozenAmount = BigNumber(0);

    sortedOrderRaw.forEach((orderRaw) => {
      // 切换合约或方向时，重置累加器
      if (orderRaw.contractId != tmpSymbol?.contractId || orderRaw.side != tmpOrderSide) {
        tmpSymbol = symbolsList.find((s) => s.contractId == orderRaw.contractId) || null;
        tmpOrderSide = orderRaw.side;
        totalOrderFrozenAmount = totalOrderFrozenAmount.plus(
          BigNumber.max(tmpOrderFrozenAmount, 0),
        );
        tmpOrderFrozenAmount = BigNumber(0);

        const contractPosition = positionList.find((p) => p.contractId == orderRaw.contractId);
        tmpPositionOpenSize = BigNumber(contractPosition?.openSize || "0");
      }

      if (!tmpSymbol) return;

      // 创建 Order 实体以使用其业务逻辑
      const order = Order.fromRaw(tmpSymbol, orderRaw);

      const tmpOrderInitialMarginRate = BigNumber(1)
        .div(order.maxLeverage)
        .toFixed(6, BigNumber.ROUND_FLOOR);

      const tmpOrderFeeRate = Math.max(
        Number(order.takerFeeRate || 0),
        Number(order.makerFeeRate || 0),
      );

      // 使用 Order 实体计算成交数据
      const { closeSize, closeValue, openSize, openValue } = order.getFillData(tmpPositionOpenSize);

      const ticker = tickers.get(tmpSymbol.contractName) || Ticker.fromEmpty();

      tmpOrderFrozenAmount = tmpOrderFrozenAmount
        .plus(
          OrderMarginService.calculateCloseOrderFrozenAmount(
            ticker.oraclePrice,
            tmpOrderInitialMarginRate,
            closeSize,
            closeValue,
            tmpOrderFeeRate,
          ),
        )
        .plus(
          OrderMarginService.calculateOpenOrderFrozenAmount(
            ticker.oraclePrice,
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
      totalInitialMarginRequirement,
      totalStarkExRiskValue,
      totalPendingWithdrawAmount,
      totalPendingTransferOutAmount,
      totalOrderFrozenAmount,
    };
  }
}
