import BigNumber from "bignumber.js";
import type { TradingContext } from "../contexts";
import { Order } from "../entities/Order";
import { Ticker } from "../entities/Ticker";
import { calculateOpenOrderFrozenAmount, calculateCloseOrderFrozenAmount } from "../calculators";

export interface CollateralStats {
  totalEquity: BigNumber;
  totalInitialMarginRequirement: BigNumber;
  totalStarkExRiskValue: BigNumber;
  totalPendingWithdrawAmount: BigNumber;
  totalPendingTransferOutAmount: BigNumber;
  totalOrderFrozenAmount: BigNumber;
}

/**
 * 账户风险服务
 *
 * 负责计算账户级别的风险指标：
 * - 抵押品权益
 * - 保证金要求
 * - 冻结资产
 */
export class AccountRiskService {
  private ctx: TradingContext;

  /**
   * 构造函数
   * @param ctx 交易上下文，包含账户、持仓、订单等数据
   */
  constructor(ctx: TradingContext) {
    this.ctx = ctx;
  }

  /**
   * 计算指定抵押币的统计信息
   *
   * @param quoteCoinId 抵押币 ID
   * @returns 抵押品统计信息
   */
  calculateCollateralStats(quoteCoinId: string): CollateralStats {
    const { account, positions, orders, metadata, withdraws, transferOuts, collaterals, tickers } = this.ctx;

    const currentCollateral = collaterals.find((c) => c.coinId === quoteCoinId);

    // 当前抵押品总初始保证金
    let totalInitialMarginRequirement = BigNumber(0);
    // 当前抵押品整体权益
    let totalEquity = BigNumber(currentCollateral?.amount || "0");
    // 当前抵押品总维持保证金
    let totalStarkExRiskValue = BigNumber(0);

    positions
      ?.filter((p) => p.coinId == quoteCoinId)
      ?.forEach((p) => {
        const ticker = tickers.get(p.symbol.contractName) || Ticker.fromEmpty();
        const curAccountMaxLeverage = account.getEffectiveMaxLeverage(p.contractId, metadata);

        // 1. 计算实际杠杆
        const actualLeverage = p.getActualLeverage(ticker.oraclePrice, curAccountMaxLeverage);

        // 2. 计算初始保证金要求
        const imr = p.getInitialMarginRequirement(ticker.oraclePrice, actualLeverage.toNumber());

        // 3. 计算 StarkEx 风险金额
        const riskValue = p.getStarkExRiskValue(ticker.oraclePrice);

        // 4. 计算当前价值（带符号）
        const currentValue = p.getCurrentValue(ticker.oraclePrice);

        totalInitialMarginRequirement = totalInitialMarginRequirement.plus(imr);
        totalEquity = totalEquity.plus(currentValue);
        totalStarkExRiskValue = totalStarkExRiskValue.plus(riskValue);
      });

    // 抵押品所有处理中的提现金额
    const totalPendingWithdrawAmount = withdraws
      .filter((w) => w.coinId === quoteCoinId && w.isPendingCensoring())
      .reduce((acc, cur) => acc.plus(cur.amount), BigNumber(0));

    // 抵押品所有处理中的转出金额
    const totalPendingTransferOutAmount = transferOuts
      .filter((t) => t.coinId === quoteCoinId && t.isPendingForFrozen())
      .reduce((acc, cur) => acc.plus(cur.amount), BigNumber(0));

    // 计算所有订单冻结金额
    let totalOrderFrozenAmount = BigNumber(0);

    // 过滤并排序订单（模拟撮合顺序）
    const activeOrders = orders.filter((o) => o.status != "UNTRIGGERED");
    const sortedOrders = Order.sort(activeOrders);

    let tmpContractId = "";
    let tmpOrderSide = "";
    let tmpPositionOpenSize = BigNumber(0);
    let tmpOrderFrozenAmount = BigNumber(0);

    sortedOrders.forEach((order) => {
      // 切换合约或方向时，重置累加器
      if (order.contractId != tmpContractId || order.side != tmpOrderSide) {
        tmpContractId = order.contractId;
        tmpOrderSide = order.side;
        totalOrderFrozenAmount = totalOrderFrozenAmount.plus(
          BigNumber.max(tmpOrderFrozenAmount, 0),
        );
        tmpOrderFrozenAmount = BigNumber(0);

        const contractPosition = positions.find((p) => p.contractId == order.contractId);
        tmpPositionOpenSize = BigNumber(contractPosition?.openSize || "0");
      }

      const tmpOrderInitialMarginRate = BigNumber(1)
        .div(order.maxLeverage)
        .toFixed(6, BigNumber.ROUND_FLOOR);

      const tmpOrderFeeRate = Math.max(
        Number(order.takerFeeRate || 0),
        Number(order.makerFeeRate || 0),
      );

      // 使用 Order 实体计算成交数据
      const { closeSize, closeValue, openSize, openValue } = order.getFillData(tmpPositionOpenSize);

      const ticker = tickers.get(order.symbol.contractName) || Ticker.fromEmpty();

      tmpOrderFrozenAmount = tmpOrderFrozenAmount
        .plus(
          calculateCloseOrderFrozenAmount({
            oraclePrice: ticker.oraclePrice,
            initialMarginRate: tmpOrderInitialMarginRate,
            size: closeSize,
            value: closeValue,
            feeRate: tmpOrderFeeRate,
          }),
        )
        .plus(
          calculateOpenOrderFrozenAmount({
            oraclePrice: ticker.oraclePrice,
            initialMarginRate: tmpOrderInitialMarginRate,
            size: openSize,
            value: openValue,
            feeRate: tmpOrderFeeRate,
          }),
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

  /**
   * 计算可用余额
   *
   * 可用余额 = 总权益 - 初始保证金要求 - 待提现金额 - 待转出金额 - 订单冻结金额
   *
   * @param quoteCoinId 抵押币 ID
   * @returns 可用余额（确保不为负数）
   */
  calculateAvailableBalance(quoteCoinId: string): BigNumber {
    const stats = this.calculateCollateralStats(quoteCoinId);
    return BigNumber.max(
      0,
      stats.totalEquity
        .minus(stats.totalInitialMarginRequirement)
        .minus(stats.totalPendingWithdrawAmount)
        .minus(stats.totalPendingTransferOutAmount)
        .minus(stats.totalOrderFrozenAmount),
    );
  }
}
