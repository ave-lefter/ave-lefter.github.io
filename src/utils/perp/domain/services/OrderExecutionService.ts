import BigNumber from "bignumber.js";
import type { OrderEntry, PositionEntry } from "../../types"
import { getNumberPrecision } from "../../utils";
import { calculateCloseOrderFrozenAmount, calculateOpenOrderFrozenAmount } from "../calculators";
import { TYPE_orderSide } from "../constants";
import type { OrderExecutionContext } from "../contexts"
import { Order } from "../entities/Order";
import { Position } from "../entities/Position";
import { SymbolEntity } from "../entities/Symbol";
import { Ticker } from "../entities/Ticker";
import { OrderType } from "../value-objects/OrderEnums";
import { AccountRiskService } from "./AccountRiskService";

/**
 * 订单执行服务
 *
 * 提供订单执行相关的计算功能：
 * - 最大可下单数量计算
 * - 下单成本计算
 * - 清算价格计算
 */
export class OrderExecutionService {
  private ctx: OrderExecutionContext;

  /**
   * 构造函数
   * @param ctx 订单执行上下文，包含账户、持仓、订单、市场数据等
   */
  constructor(ctx: OrderExecutionContext) {
    this.ctx = ctx;
  }

  // ============================================================================
  // 实例方法 - 推荐使用，方法签名简洁
  // ============================================================================

  /**
   * 计算最大可下单数量
   *
   * @param side 订单方向 "BUY" | "SELL"
   * @param price 委托价格
   * @param reduceOnly 是否只减仓
   * @returns 最大可下单数量
   */
  calculateMaxOrderSize(side: string, price: string, reduceOnly = false): BigNumber {
    if (!price) return BigNumber(0);

    const { symbol, ticker, positions, orders, symbolsList, tickers } = this.ctx;
    const contractId = symbol.contractId;

    // 获取抵押品统计信息
    const collateralInfo = this.getCollateralStats();
    const collateralPendingWithdrawAmount = collateralInfo.totalPendingWithdrawAmount;
    const collateralPendingTransferOutAmount = collateralInfo.totalPendingTransferOutAmount;
    const collateralTotalEquity = BigNumber(collateralInfo.totalEquity);
    const collateralInitialMarginRequirement = BigNumber(
      collateralInfo.totalInitialMarginRequirement,
    );
    const collateralStarkExRiskValue = BigNumber(collateralInfo.totalStarkExRiskValue);

    // 计算可用金额（没有委托单的情况下）
    let availableAmount = collateralTotalEquity
      .minus(collateralPendingWithdrawAmount)
      .minus(collateralPendingTransferOutAmount)
      .minus(collateralInitialMarginRequirement);

    // 获取费率和杠杆
    const { feeRate } = this.getEffectiveFeeRate();
    const { initialMarginRate: curContractInitialMarginRate } = this.getEffectiveLeverageInfo();

    // 过滤并排序订单
    const sortedOrder = Order.sort(orders.filter((o) => o.status != "UNTRIGGERED"));

    // 处理其他合约/方向的订单冻结金额
    let tmpContract: SymbolEntity | undefined;
    let tmpOrderSide = "";
    let tmpPositionOpenSize = BigNumber(0);
    let tmpContractOrderFrozenAmount = BigNumber(0);

    sortedOrder.forEach((tmpOrder) => {
      if (tmpOrder.contractId == contractId && tmpOrder.side == side) {
        return;
      }
      if (tmpOrder.contractId != tmpContract?.contractId || tmpOrder.side != tmpOrderSide) {
        availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, 0));
        tmpContractOrderFrozenAmount = BigNumber(0);
        tmpContract = symbolsList.find((s) => s.contractId == tmpOrder.contractId);
        tmpOrderSide = tmpOrder.side;
        const contractPosition = positions.find((p) => p.contractId == tmpOrder.contractId);
        tmpPositionOpenSize = BigNumber(contractPosition?.openSize || "0");
      }

      const tmpOrderInitialMarginRate = BigNumber(1)
        .div(tmpOrder.maxLeverage)
        .toFixed(6, BigNumber.ROUND_FLOOR);
      const tmpOrderFeeRate = Math.max(
        Number(tmpOrder.takerFeeRate),
        Number(tmpOrder.makerFeeRate),
      );

      if (!tmpContract) return;

      const { closeSize, closeValue, openSize, openValue } =
        tmpOrder.getFillData(tmpPositionOpenSize);

      const tmpTicker = tickers.get(tmpContract.contractName) || Ticker.fromEmpty();

      tmpContractOrderFrozenAmount = tmpContractOrderFrozenAmount
        .plus(
          calculateCloseOrderFrozenAmount({
            oraclePrice: tmpTicker.oraclePrice,
            initialMarginRate: tmpOrderInitialMarginRate,
            size: closeSize,
            value: closeValue,
            feeRate: tmpOrderFeeRate,
          }),
        )
        .plus(
          calculateOpenOrderFrozenAmount({
            oraclePrice: tmpTicker.oraclePrice,
            initialMarginRate: tmpOrderInitialMarginRate,
            size: openSize,
            value: openValue,
            feeRate: tmpOrderFeeRate,
          }),
        );

      tmpPositionOpenSize = tmpPositionOpenSize.plus(closeSize).plus(openSize);
    });

    availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, 0));

    // 计算当前持仓
    let positionOpenSize = BigNumber(
      positions.find((p) => p.contractId == contractId)?.openSize || "0",
    );

    // 计算最坏平仓价格
    const mockPosition = new Position(symbol, {
      openSize: positionOpenSize.toString(),
    } as Partial<PositionEntry> as PositionEntry);
    const positionWorstClosePrice = mockPosition.getWorstClosePrice(
      ticker?.oraclePrice?.toString(),
      {
        totalEquity: collateralTotalEquity,
        starkExRiskValue: collateralStarkExRiskValue,
        pendingWithdrawAmount: collateralPendingWithdrawAmount,
        pendingTransferOutAmount: collateralPendingTransferOutAmount,
      },
      feeRate,
    );

    // 收集优先级更高的同方向订单
    const greaterOrderModelSortedList: OrderEntry[] = [];

    const curOrder = {
      id: "0",
      contractId,
      side,
      price,
      type: "LIMIT",
      createdTime: Number.MAX_SAFE_INTEGER,
      triggerTime: Number.MAX_SAFE_INTEGER,
    };

    sortedOrder.forEach((tmpOrder) => {
      if (tmpOrder.contractId != contractId || tmpOrder.side != side) {
        return;
      }

      if (Order.comparator(curOrder as unknown as OrderEntry, tmpOrder) < 0) {
        greaterOrderModelSortedList.push(tmpOrder.raw);
        return;
      }

      const tmpOrderInitialMarginRate = BigNumber(1)
        .div(tmpOrder.maxLeverage)
        .toFixed(6, BigNumber.ROUND_FLOOR);
      const tmpOrderFeeRate = Math.max(
        Number(tmpOrder.takerFeeRate),
        Number(tmpOrder.makerFeeRate),
      );

      const { closeSize, closeValue, openSize, openValue } = tmpOrder.getFillData(positionOpenSize);

      availableAmount = availableAmount
        .minus(
          calculateCloseOrderFrozenAmount({
            oraclePrice: ticker.oraclePrice,
            initialMarginRate: tmpOrderInitialMarginRate,
            size: closeSize,
            value: closeValue,
            feeRate: tmpOrderFeeRate,
          }),
        )
        .minus(
          calculateOpenOrderFrozenAmount({
            oraclePrice: ticker.oraclePrice,
            initialMarginRate: tmpOrderInitialMarginRate,
            size: openSize,
            value: openValue,
            feeRate: tmpOrderFeeRate,
          }),
        );

      positionOpenSize = positionOpenSize.plus(closeSize).plus(openSize);
    });

    // 计算最大平仓数量
    let maxCloseSizeAbsLimit = BigNumber(0);
    if (
      (side == TYPE_orderSide.BUY && positionOpenSize.lt(0)) ||
      (side == TYPE_orderSide.SELL && positionOpenSize.gt(0))
    ) {
      maxCloseSizeAbsLimit = positionOpenSize.abs();
    }

    if (maxCloseSizeAbsLimit.gt(0)) {
      // 检查是否可以平仓
      if (
        (side == TYPE_orderSide.BUY && BigNumber(price).gte(positionWorstClosePrice)) ||
        (side == TYPE_orderSide.SELL && BigNumber(price).lt(positionWorstClosePrice))
      ) {
        return BigNumber(0);
      }

      // 使用二分法找到合适的平仓数量
      if (
        !OrderExecutionService.checkCloseOrderIsValid(
          symbol,
          ticker.oraclePrice.toString(),
          curContractInitialMarginRate,
          positionOpenSize,
          availableAmount,
          greaterOrderModelSortedList,
          side,
          maxCloseSizeAbsLimit,
          maxCloseSizeAbsLimit.multipliedBy(price),
          feeRate,
        )
      ) {
        let minCloseSizeAbsInclusive = BigNumber(0);
        let maxCloseSizeAbsExclusive = maxCloseSizeAbsLimit;
        while (
          maxCloseSizeAbsExclusive.minus(minCloseSizeAbsInclusive).gt(BigNumber(symbol.stepSize))
        ) {
          const midCloseSizeAbs = BigNumber(
            maxCloseSizeAbsExclusive
              .plus(minCloseSizeAbsInclusive)
              .dividedBy(2)
              .toFixed(getNumberPrecision(symbol.stepSize), BigNumber.ROUND_FLOOR),
          );
          if (
            OrderExecutionService.checkCloseOrderIsValid(
              symbol,
              ticker.oraclePrice.toString(),
              curContractInitialMarginRate,
              positionOpenSize,
              availableAmount,
              greaterOrderModelSortedList,
              side,
              midCloseSizeAbs,
              midCloseSizeAbs.multipliedBy(price),
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

      // 扣除平仓冻结金额
      if (side == TYPE_orderSide.BUY) {
        availableAmount = availableAmount.minus(
          calculateCloseOrderFrozenAmount({
            oraclePrice: ticker.oraclePrice,
            initialMarginRate: curContractInitialMarginRate,
            size: maxCloseSizeAbsLimit,
            value: maxCloseSizeAbsLimit.multipliedBy(price),
            feeRate,
          }),
        );
      } else if (side == TYPE_orderSide.SELL) {
        availableAmount = availableAmount.minus(
          calculateCloseOrderFrozenAmount({
            oraclePrice: ticker.oraclePrice,
            initialMarginRate: curContractInitialMarginRate,
            size: maxCloseSizeAbsLimit.negated(),
            value: maxCloseSizeAbsLimit.multipliedBy(price).negated(),
            feeRate,
          }),
        );
      }
    }

    // 仅减仓模式直接返回
    if (reduceOnly) {
      return maxCloseSizeAbsLimit;
    }

    // 计算开仓数量：扣除优先级更高订单的冻结金额
    greaterOrderModelSortedList.forEach((tmpOrder) => {
      const tmpOrderInitialMarginRate = BigNumber(1)
        .div(tmpOrder.maxLeverage || "20")
        .toFixed(6, BigNumber.ROUND_FLOOR);
      const tmpOrderFeeRate = Math.max(
        Number(tmpOrder.takerFeeRate || "0"),
        Number(tmpOrder.makerFeeRate || "0"),
      );
      const orderEntity = Order.fromRaw(symbol, tmpOrder);
      const { openSize, openValue } = orderEntity.getFillData(BigNumber(0));

      availableAmount = availableAmount.minus(
        calculateOpenOrderFrozenAmount({
          oraclePrice: ticker.oraclePrice,
          initialMarginRate: tmpOrderInitialMarginRate,
          size: openSize,
          value: openValue,
          feeRate: tmpOrderFeeRate,
        }),
      );
    });

    // 计算最大开仓数量
    let divisor = BigNumber(0);
    if (side == TYPE_orderSide.BUY) {
      divisor = BigNumber.max(BigNumber(price).minus(ticker?.oraclePrice), 0)
        .plus(BigNumber(ticker.oraclePrice).multipliedBy(curContractInitialMarginRate))
        .plus(BigNumber(price).multipliedBy(feeRate));
    } else if (side == TYPE_orderSide.SELL) {
      divisor = BigNumber.max(BigNumber(ticker?.oraclePrice).minus(price), 0)
        .plus(BigNumber(ticker.oraclePrice).multipliedBy(curContractInitialMarginRate))
        .plus(BigNumber(price).multipliedBy(feeRate));
    }

    let maxOpenSizeAbs = BigNumber(0);
    if (availableAmount.gt(0)) {
      maxOpenSizeAbs = BigNumber(
        availableAmount
          .dividedBy(divisor)
          .toFixed(getNumberPrecision(symbol.stepSize), BigNumber.ROUND_FLOOR),
      );
    }

    return maxOpenSizeAbs.plus(maxCloseSizeAbsLimit);
  }

  /**
   * 计算最大可下单数量（市价单）
   *
   * @param side 订单方向 "BUY" | "SELL"
   * @param reduceOnly 是否只减仓
   * @param orderBook 订单簿数据 { bid1, ask1 }
   * @returns 最大可下单数量
   */
  calculateMaxMarketOrderSize(
    side: string,
    reduceOnly: boolean,
    orderBook: { bid1: string; ask1: string },
  ): BigNumber {
    // 市价单使用对手盘价格作为委托价格
    const price = side == "BUY" ? orderBook.ask1 : orderBook.bid1;
    return this.calculateMaxOrderSize(side, price, reduceOnly);
  }

  /**
   * 计算下单成本（精确冻结金额）
   *
   * 与 OrderMarginService.calcMargin 的区别：
   * - OrderMarginService: 简单估算，假设整个订单都是开仓，适合 UI 预估显示
   * - calculateOrderCost: 精确计算，考虑现有持仓和挂单，区分开仓/平仓部分
   *
   * 计算逻辑：
   * 1. 获取当前持仓数量
   * 2. 按优先级遍历同方向已有订单，模拟成交后的持仓变化
   * 3. 根据模拟后的持仓，判断新订单中多少是开仓、多少是平仓
   * 4. 分别计算开仓冻结和平仓冻结，相加得到总成本
   *
   * 示例：持有 10 BTC 多仓，卖出 15 BTC
   * - 前 10 BTC 是平仓（减少多仓），使用平仓保证金公式
   * - 后 5 BTC 是开仓（建立空仓），使用开仓保证金公式
   *
   * @param side 订单方向 "BUY" | "SELL"
   * @param price 委托价格
   * @param size 委托数量
   * @returns 所需保证金（冻结金额）
   */
  calculateOrderCost(side: string, price: string, size: string): BigNumber {
    const { symbol, ticker, positions, orders } = this.ctx;
    const contractId = symbol.contractId;

    // 计算当前合约的持仓数量
    let positionOpenSize = BigNumber(
      positions.find((p) => p.contractId == contractId)?.openSize || "0",
    );

    // 创建当前订单对象
    const curOrder = {
      id: "0",
      contractId,
      side,
      price,
      type: "LIMIT",
      createdTime: Number.MAX_SAFE_INTEGER,
      triggerTime: Number.MAX_SAFE_INTEGER,
      size,
      status: "OPEN",
      cumFailSize: "0",
      cumFillSize: "0",
    };

    // 获取同方向、同合约、已触发的订单
    const sortedOrder = Order.sort(
      orders.filter(
        (o) => o.status != "UNTRIGGERED" && o.contractId == contractId && o.side == side,
      ),
    );

    // 计算所有同方向订单成交后的持仓数量
    sortedOrder.forEach((tmpOrder) => {
      const orderEntity = Order.fromRaw(
        symbol,
        tmpOrder instanceof Order ? tmpOrder.raw : tmpOrder,
      );
      const { closeSize, openSize } = orderEntity.getFillData(positionOpenSize);
      positionOpenSize = positionOpenSize.plus(closeSize).plus(openSize);
    });

    // 计算当前订单的开仓和平仓数量
    const curOrderEntity = Order.fromRaw(symbol, curOrder as unknown as OrderEntry);
    const { openSize, closeSize } = curOrderEntity.getFillData(positionOpenSize);

    // 获取费率
    const { feeRate } = this.getEffectiveFeeRate();

    // 获取初始保证金率
    const { initialMarginRate } = this.getEffectiveLeverageInfo();

    // 计算开仓和平仓的冻结金额
    const frozenOpenAmount = calculateOpenOrderFrozenAmount({
      oraclePrice: ticker.oraclePrice,
      initialMarginRate,
      size: openSize,
      value: BigNumber(openSize).multipliedBy(price),
      feeRate,
    });
    const closeCloseAmount = calculateCloseOrderFrozenAmount({
      oraclePrice: ticker.oraclePrice,
      initialMarginRate,
      size: closeSize,
      value: BigNumber(closeSize).multipliedBy(price),
      feeRate,
    });

    return BigNumber.max(frozenOpenAmount.plus(closeCloseAmount), 0);
  }

  /**
   * 获取有效费率
   */
  private getEffectiveFeeRate(): { takerFeeRate: string; makerFeeRate: string; feeRate: number } {
    const { account, symbol, metadata } = this.ctx;
    const contractId = symbol.contractId;

    let takerFeeRate: string | undefined;
    let makerFeeRate: string | undefined;

    if (account) {
      ({ takerFeeRate, makerFeeRate } = account.getEffectiveFeeRate(contractId, metadata));
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      takerFeeRate = meta?.defaultTakerFeeRate;
      makerFeeRate = meta?.defaultMakerFeeRate;
    }

    const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));
    return { takerFeeRate: takerFeeRate || "0", makerFeeRate: makerFeeRate || "0", feeRate };
  }

  /**
   * 获取有效杠杆和初始保证金率
   */
  private getEffectiveLeverageInfo(): { maxLeverage: number; initialMarginRate: string } {
    const { account, symbol, metadata } = this.ctx;
    const contractId = symbol.contractId;

    let maxLeverage: number;
    if (account) {
      maxLeverage = account.getEffectiveMaxLeverage(contractId, metadata);
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      maxLeverage = Number(meta?.defaultLeverage);
    }

    const initialMarginRate = BigNumber(1)
      .div(maxLeverage || 20)
      .toFixed(6, BigNumber.ROUND_FLOOR);

    return { maxLeverage, initialMarginRate };
  }

  /**
   * 计算下单后的预估清算价格
   *
   * @param side 订单方向 "BUY" | "SELL"
   * @param price 委托价格
   * @param size 委托数量
   * @returns 预估清算价格
   */
  calculateLiquidationPrice(side: string, price: string, size: string): string {
    if (!price || !size) return "0";

    const { symbol, ticker, positions } = this.ctx;
    const contractId = symbol.contractId;

    // 计算抵押品统计信息
    const collateralInfo = this.getCollateralStats();

    const collateralPendingWithdrawAmount = collateralInfo.totalPendingWithdrawAmount;
    const collateralPendingTransferOutAmount = collateralInfo.totalPendingTransferOutAmount;
    const collateralTotalEquity = BigNumber(collateralInfo.totalEquity);
    const collateralStarkExRiskValue = BigNumber(collateralInfo.totalStarkExRiskValue);

    // 获取费率
    const { feeRate } = this.getEffectiveFeeRate();

    // 计算当前持仓
    const positionOpenSize = BigNumber(
      positions.find((p) => p.contractId == contractId)?.openSize || "0",
    );

    // 计算成交数据
    const fillSize = BigNumber(size).dividedBy(side == "BUY" ? 1 : -1);
    const fillValue = fillSize.multipliedBy(price);
    const fillFee = fillValue.multipliedBy(feeRate).abs().negated();

    const oraclePrice = ticker?.oraclePrice?.toString();

    // 计算成交后的抵押品总价值
    const afterCollateralTotalEquity =
      OrderExecutionService.calculateCollateralTotalEquityAfterFill({
        oraclePrice,
        collateralTotalEquity,
        fillSize,
        fillValue,
        fillFee,
      });

    // 计算成交后的 StarkEx 风险金额
    const afterCollateralStarkExRiskValue =
      OrderExecutionService.calculateCollateralStarkExRiskValueAfterFill({
        contract: symbol,
        oraclePrice,
        positionOpenSize,
        collateralStarkExRiskValue,
        fillSize,
      });

    const afterPositionSize = positionOpenSize.plus(fillSize);

    // 使用 Position Entity 计算清算价格
    const mockPosition = new Position(symbol, {
      openSize: afterPositionSize.toString(),
    } as Partial<PositionEntry> as PositionEntry);

    const afterLiquidatePrice = mockPosition.getLiquidationPrice(oraclePrice, {
      totalEquity: afterCollateralTotalEquity,
      starkExRiskValue: afterCollateralStarkExRiskValue,
      pendingWithdrawAmount: collateralPendingWithdrawAmount,
      pendingTransferOutAmount: collateralPendingTransferOutAmount,
    });

    return String(afterLiquidatePrice);
  }

  /**
   * 获取抵押品统计信息
   */
  private getCollateralStats() {
    const { account, symbol } = this.ctx;
    const quoteCoinId = symbol.quoteCoinId;

    if (account) {
      // OrderExecutionContext extends TradingContext，可直接传递
      const riskService = new AccountRiskService(this.ctx);
      return riskService.calculateCollateralStats(quoteCoinId);
    }

    return {
      totalEquity: BigNumber(0),
      totalInitialMarginRequirement: BigNumber(0),
      totalStarkExRiskValue: BigNumber(0),
      totalPendingWithdrawAmount: BigNumber(0),
      totalPendingTransferOutAmount: BigNumber(0),
      totalOrderFrozenAmount: BigNumber(0),
    };
  }

  /**
   * 检查平仓单是否有效
   */
  static checkCloseOrderIsValid(
    symbol: SymbolEntity,
    oraclePrice: string | BigNumber,
    initialMarginRate: string | BigNumber,
    paramPositionOpenSize: string | BigNumber,
    paramAvailableAmount: string | BigNumber,
    sortedOrderList: OrderEntry[],
    orderSide: string,
    orderCloseSizeAbs: string | BigNumber,
    orderCloseValueAbs: string | BigNumber,
    feeRate: string | number,
  ): boolean {
    let isValid = true; // 默认
    let availableAmount = BigNumber(0);
    let positionOpenSize = BigNumber(0);
    if (orderSide == TYPE_orderSide.BUY) {
      // availableAmount = 可用 - 平仓冻结金额
      availableAmount = BigNumber(paramAvailableAmount).minus(
        calculateCloseOrderFrozenAmount({
          oraclePrice,
          initialMarginRate,
          size: orderCloseSizeAbs,
          value: orderCloseValueAbs,
          feeRate,
        }),
      );
      //positionOpenSize = 开仓数量 + 最大平仓数量
      positionOpenSize = BigNumber(paramPositionOpenSize).plus(orderCloseSizeAbs);
    } else if (orderSide == TYPE_orderSide.SELL) {
      availableAmount = BigNumber(paramAvailableAmount).minus(
        calculateCloseOrderFrozenAmount({
          oraclePrice,
          initialMarginRate,
          size: BigNumber(orderCloseSizeAbs).negated(),
          value: BigNumber(orderCloseValueAbs).negated(),
          feeRate,
        }),
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
      if (["PENDING", "OPEN", "CANCELING"].includes(order.status)) {
        orderLeftSize = BigNumber(order.size).minus(order.cumFailSize).minus(order.cumFillSize);
      } else if (["FILLED", "CANCELED"].includes(order.status)) {
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
                getNumberPrecision(symbol.stepSize),
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
            getNumberPrecision(symbol.stepSize),
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
          calculateCloseOrderFrozenAmount({
            oraclePrice,
            initialMarginRate,
            size: orderCloseSize,
            value: orderCloseValue,
            feeRate,
          }),
        )
        .plus(
          calculateOpenOrderFrozenAmount({
            oraclePrice,
            initialMarginRate,
            size: orderOpenSize,
            value: orderOpenValue,
            feeRate,
          }),
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
  }

  /**
   * 计算成交后的 抵押品总价值
   */
  static calculateCollateralTotalEquityAfterFill({
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
  }): BigNumber {
    return BigNumber(collateralTotalEquity)
      .minus(fillValue)
      .plus(BigNumber(fillSize).multipliedBy(oraclePrice))
      .plus(fillFee);
  }

  /**
   * 计算成交后的 抵押品 starkex 总风险金额
   */
  static calculateCollateralStarkExRiskValueAfterFill({
    contract,
    oraclePrice,
    positionOpenSize,
    collateralStarkExRiskValue,
    fillSize,
  }: {
    contract: SymbolEntity;
    oraclePrice: string | BigNumber;
    positionOpenSize: string | BigNumber;
    collateralStarkExRiskValue: string | BigNumber;
    fillSize: string | BigNumber;
  }): BigNumber {
    const positionValue = BigNumber(positionOpenSize).multipliedBy(oraclePrice);
    const positionStackExRiskRate = BigNumber(
      contract.getRiskTier(positionValue.toString())?.starkExRisk || 0,
    ).div(BigNumber(2).pow(32));
    const positionStarkExRiskValue = positionValue.abs().multipliedBy(positionStackExRiskRate);

    const afterPositionOpenSize = BigNumber(positionOpenSize).plus(fillSize);
    const afterPositionValue = afterPositionOpenSize.multipliedBy(oraclePrice);
    const afterPositionStackExRiskRate = BigNumber(
      contract.getRiskTier(afterPositionValue.toString())?.starkExRisk || 0,
    ).div(BigNumber(2).pow(32));
    const afterPositionStarkExRiskValue = afterPositionValue
      .abs()
      .multipliedBy(afterPositionStackExRiskRate);

    return BigNumber(collateralStarkExRiskValue)
      .minus(positionStarkExRiskValue)
      .plus(afterPositionStarkExRiskValue);
  }
}
