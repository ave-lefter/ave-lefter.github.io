import BigNumber from "bignumber.js";
import type { AccountInfo, IMetadata, OrderEntry } from "../../types"
import { getNumberPrecision } from "../../utils";
import { TYPE_orderSide } from "../constants";
import { Position } from "../entities/Position";
import { SymbolEntity } from "../entities/Symbol";
import { Ticker } from "../entities/Ticker";
import { Order } from "../entities/Order";
import { Account } from "../entities/Account";
import { Collateral } from "../entities/Collateral";
import { AccountRiskService } from "./AccountRiskService";
import { OrderMarginService } from "./OrderMarginService";

export class OrderExecutionService {
  /**
   * 检查平仓单是否有效
   */
  static checkCloseOrderIsValid(
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
  ): boolean {
    let isValid = true; // 默认
    let availableAmount = BigNumber(0);
    let positionOpenSize = BigNumber(0);
    if (orderSide == TYPE_orderSide.BUY) {
      // availableAmount = 可用 - 平仓冻结金额
      availableAmount = BigNumber(paramAvailableAmount).minus(
        OrderMarginService.calculateCloseOrderFrozenAmount(
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
        OrderMarginService.calculateCloseOrderFrozenAmount(
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
          OrderMarginService.calculateCloseOrderFrozenAmount(
            oraclePrice,
            initialMarginRate,
            orderCloseSize,
            orderCloseValue,
            feeRate,
          ),
        )
        .plus(
          OrderMarginService.calculateOpenOrderFrozenAmount(
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
  }

  /**
   * 计算最大可下单数量 (限价单)
   */
  static calculateMaxCreateOrderSize({
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
    symbolsList: SymbolEntity[];
    account: AccountInfo;
    withdraw: any[];
    transferOut: any[];
    orderList: OrderEntry[];
    collateral: any[];
    orderSide: string;
    orderPrice: string;
    reduceOnly: boolean;
    tickers: Map<string, Ticker>;
  }): BigNumber {
    if (!orderPrice) return BigNumber(0);
    const contract = symbolsList.find((s) => s.contractId == contractId)!;
    const ticker = tickers.get(contract.contractName) || Ticker.fromEmpty();
    const quoteCoinId = contract?.quoteCoinId;

    let accountEntity: Account | undefined;
    if (account) {
      accountEntity = Account.fromRaw(account);
    }

    const collateralEntities = (collateral || []).map((c) => Collateral.fromRaw(c));

    let collateralInfo;
    if (accountEntity) {
      collateralInfo = AccountRiskService.calculateCollateralStats({
        contractId,
        quoteCoinId,
        positionList,
        symbolsList,
        metadata,
        account: accountEntity,
        withdraw,
        transferOut,
        collateral: collateralEntities,
        orderList: orderList,
        tickers,
      });
    } else {
      collateralInfo = {
        totalEquity: BigNumber(0),
        totalInitialMarginRequirement: BigNumber(0),
        totalStarkExRiskValue: BigNumber(0),
        totalPendingWithdrawAmount: BigNumber(0),
        totalPendingTransferOutAmount: BigNumber(0),
        totalOrderFrozenAmount: BigNumber(0),
      };
    }

    const collateralPendingWithdrawAmount = collateralInfo.totalPendingWithdrawAmount;
    const collateralPendingTransferOutAmount = collateralInfo.totalPendingTransferOutAmount;
    let collateralTotalEquity = BigNumber(collateralInfo.totalEquity);
    let collateralInitialMarginRequirement = BigNumber(
      collateralInfo.totalInitialMarginRequirement,
    );
    let collateralStarkExRiskValue = BigNumber(collateralInfo.totalStarkExRiskValue);

    // 没有委托单的情况占用金额
    let availableAmount = collateralTotalEquity
      .minus(collateralPendingWithdrawAmount)
      .minus(collateralPendingTransferOutAmount)
      .minus(collateralInitialMarginRequirement);

    let takerFeeRate, makerFeeRate;
    if (accountEntity) {
      ({ takerFeeRate, makerFeeRate } = accountEntity.getEffectiveFeeRate(contractId, metadata));
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      takerFeeRate = meta?.defaultTakerFeeRate;
      makerFeeRate = meta?.defaultMakerFeeRate;
    }
    const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));

    let curContractMaxLeverage;
    if (accountEntity) {
      curContractMaxLeverage = accountEntity.getEffectiveMaxLeverage(contractId, metadata);
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      curContractMaxLeverage = Number(meta?.defaultLeverage);
    }
    const curContractInitialMarginRate = BigNumber(1)
      .div(curContractMaxLeverage as any)
      .toFixed(6, BigNumber.ROUND_FLOOR);

    const sortedOrder = Order.sort(orderList.filter((o) => o.status != "UNTRIGGERED"));

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
        .div(tmpOrder instanceof Order ? tmpOrder.maxLeverage : tmpOrder.maxLeverage)
        .toFixed(6, BigNumber.ROUND_FLOOR);
      const tmpOrderFeeRate = Math.max(
        Number(tmpOrder instanceof Order ? tmpOrder.takerFeeRate : tmpOrder.takerFeeRate),
        Number(tmpOrder instanceof Order ? tmpOrder.makerFeeRate : tmpOrder.makerFeeRate),
      );

      const orderEntity = Order.fromRaw(
        tmpContract,
        tmpOrder instanceof Order ? tmpOrder.raw : tmpOrder,
      );
      const { closeSize, closeValue, openSize, openValue } = orderEntity.getFillData(
        tmpPositionOpenSize,
      );

      const ticker = tickers.get(tmpContract.contractName) || Ticker.fromEmpty();

      tmpContractOrderFrozenAmount = tmpContractOrderFrozenAmount
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
    availableAmount = availableAmount.minus(BigNumber.max(tmpContractOrderFrozenAmount, 0));
    let positionOpenSize = BigNumber(
      positionList.find((p) => p.contractId == contractId)?.openSize || "0",
    );
    // Use Position Entity to calc worst close price
    const mockPosition = new Position(contract, {
      openSize: positionOpenSize.toString(),
    } as any);
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

      if (Order.comparator(curOrder as any, tmpOrder) < 0) {
        greaterOrderModelSortedList.push(tmpOrder);
        return;
      }

      const tmpOrderInitialMarginRate = BigNumber(1)
        .div(tmpOrder instanceof Order ? tmpOrder.maxLeverage : tmpOrder.maxLeverage)
        .toFixed(6, BigNumber.ROUND_FLOOR);
      const tmpOrderFeeRate = Math.max(
        Number(tmpOrder instanceof Order ? tmpOrder.takerFeeRate : tmpOrder.takerFeeRate),
        Number(tmpOrder instanceof Order ? tmpOrder.makerFeeRate : tmpOrder.makerFeeRate),
      );

      const orderEntity = Order.fromRaw(
        contract,
        tmpOrder instanceof Order ? tmpOrder.raw : tmpOrder,
      );
      const { closeSize, closeValue, openSize, openValue } = orderEntity.getFillData(
        positionOpenSize,
      );

      availableAmount = availableAmount
        .minus(
          OrderMarginService.calculateCloseOrderFrozenAmount(
            ticker.oraclePrice,
            tmpOrderInitialMarginRate,
            closeSize,
            closeValue,
            tmpOrderFeeRate,
          ),
        )
        .minus(
          OrderMarginService.calculateOpenOrderFrozenAmount(
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
        !this.checkCloseOrderIsValid(
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
            this.checkCloseOrderIsValid(
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
          OrderMarginService.calculateCloseOrderFrozenAmount(
            ticker.oraclePrice,
            curContractInitialMarginRate,
            maxCloseSizeAbsLimit,
            maxCloseSizeAbsLimit.multipliedBy(orderPrice),
            feeRate,
          ),
        );
      } else if (orderSide == TYPE_orderSide.SELL) {
        availableAmount = availableAmount.minus(
          OrderMarginService.calculateCloseOrderFrozenAmount(
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
      const orderEntity = Order.fromRaw(contract, tmpOrder);
      const { openSize, openValue } = orderEntity.getFillData(BigNumber(0));

      availableAmount = availableAmount.minus(
        OrderMarginService.calculateOpenOrderFrozenAmount(
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
      divisor = BigNumber.max(BigNumber(orderPrice).minus(ticker?.oraclePrice), 0)
        .plus(BigNumber(ticker.oraclePrice).multipliedBy(curContractInitialMarginRate))
        .plus(BigNumber(orderPrice).multipliedBy(feeRate));
    } else if (orderSide == TYPE_orderSide.SELL) {
      divisor = BigNumber.max(BigNumber(ticker?.oraclePrice).minus(orderPrice), 0)
        .plus(BigNumber(ticker.oraclePrice).multipliedBy(curContractInitialMarginRate))
        .plus(BigNumber(orderPrice).multipliedBy(feeRate));
    } else {
    }

    let maxOpenSizeAbs = BigNumber(0);
    if (availableAmount.lte(0)) {
      maxOpenSizeAbs = BigNumber(0);
    } else {
      maxOpenSizeAbs = BigNumber(
        availableAmount
          .dividedBy(divisor)
          .toFixed(getNumberPrecision(contract.stepSize), BigNumber.ROUND_FLOOR),
      );
    }
    return maxOpenSizeAbs.plus(maxCloseSizeAbsLimit);
  }

  /**
   * 计算最大可下单数量 (市价单)
   */
  static calculateMaxCreateMarketOrderSize({
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
    symbolsList: SymbolEntity[];
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
  }): BigNumber {
    const orderPrice = orderSide == "BUY" ? ask1 : bid1;
    return this.calculateMaxCreateOrderSize({
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
  }

  /**
   * 计算下单成本
   */
  static calculateCreateOrderCost({
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
    symbolsList: SymbolEntity[];
    orderList: OrderEntry[];
    account: AccountInfo;
    orderSide: string;
    orderPrice: string;
    orderSize: string;
    tickers: Map<string, Ticker>;
  }): BigNumber {
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
    const sortedOrder = Order.sort(
      orderList.filter(
        (o) => o.status != "UNTRIGGERED" && o.contractId == contractId && o.side == orderSide,
      ),
    );

    sortedOrder.forEach((tmpOrder) => {
      const orderEntity = Order.fromRaw(
        contract,
        tmpOrder instanceof Order ? tmpOrder.raw : tmpOrder,
      );
      const { closeSize, openSize } = orderEntity.getFillData(positionOpenSize);

      positionOpenSize = positionOpenSize.plus(closeSize).plus(openSize);
    });
    const curOrderEntity = Order.fromRaw(contract, curOrder as any);
    const { openSize, closeSize } = curOrderEntity.getFillData(positionOpenSize);

    let accountEntity: Account | undefined;
    if (account) {
      accountEntity = Account.fromRaw(account);
    }

    let takerFeeRate, makerFeeRate;
    if (accountEntity) {
      ({ takerFeeRate, makerFeeRate } = accountEntity.getEffectiveFeeRate(contractId, metadata));
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      takerFeeRate = meta?.defaultTakerFeeRate;
      makerFeeRate = meta?.defaultMakerFeeRate;
    }
    const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));

    let curContractMaxLeverage;
    if (accountEntity) {
      curContractMaxLeverage = accountEntity.getEffectiveMaxLeverage(contractId, metadata);
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      curContractMaxLeverage = Number(meta?.defaultLeverage);
    }
    const curContractInitialMarginRate = BigNumber(1)
      .div(curContractMaxLeverage as any)
      .toFixed(6, BigNumber.ROUND_FLOOR);

    const frozenOpenAmount = OrderMarginService.calculateOpenOrderFrozenAmount(
      ticker.oraclePrice,
      curContractInitialMarginRate,
      openSize,
      BigNumber(openSize).multipliedBy(orderPrice),
      feeRate,
    );
    const closeCloseAmount = OrderMarginService.calculateCloseOrderFrozenAmount(
      ticker.oraclePrice,
      curContractInitialMarginRate,
      closeSize,
      BigNumber(closeSize).multipliedBy(orderPrice),
      feeRate,
    );

    return BigNumber.max(frozenOpenAmount.plus(closeCloseAmount), 0);
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
    contract: any;
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

  /**
   * 计算订单的预估强平价
   */
  static calculateCreateOrderLiquidatePrice({
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
    symbolsList: SymbolEntity[];
    account: AccountInfo;
    withdraw: any[];
    transferOut: any[];
    order: any[];
    collateral: any[];
    orderSide: string;
    orderPrice: string;
    orderSize: string;
    tickers: Map<string, Ticker>;
  }) {
    if (!orderPrice || !orderSize) return BigNumber(0);
    const symbol = symbolsList.find((s) => s.contractId == contractId)!;
    const ticker = tickers.get(symbol.contractName) || Ticker.fromEmpty();
    const quoteCoinId = symbol?.quoteCoinId;

    let accountEntity: Account | undefined;
    if (account) {
      accountEntity = Account.fromRaw(account);
    }
    const collateralEntities = (collateral || []).map((c) => Collateral.fromRaw(c));

    let collateralInfo;
    if (accountEntity) {
      collateralInfo = AccountRiskService.calculateCollateralStats({
        contractId,
        quoteCoinId,
        positionList,
        symbolsList,
        metadata,
        account: accountEntity,
        withdraw,
        transferOut,
        collateral: collateralEntities,
        orderList: order,
        tickers,
      });
    } else {
      collateralInfo = {
        totalEquity: BigNumber(0),
        totalInitialMarginRequirement: BigNumber(0),
        totalStarkExRiskValue: BigNumber(0),
        totalPendingWithdrawAmount: BigNumber(0),
        totalPendingTransferOutAmount: BigNumber(0),
        totalOrderFrozenAmount: BigNumber(0),
      };
    }

    const collateralPendingWithdrawAmount = collateralInfo.totalPendingWithdrawAmount;
    const collateralPendingTransferOutAmount = collateralInfo.totalPendingTransferOutAmount;
    const collateralTotalEquity = BigNumber(collateralInfo.totalEquity);
    const collateralStarkExRiskValue = BigNumber(collateralInfo.totalStarkExRiskValue);

    let takerFeeRate, makerFeeRate;
    if (accountEntity) {
      ({ takerFeeRate, makerFeeRate } = accountEntity.getEffectiveFeeRate(contractId, metadata));
    } else {
      const meta = metadata.contractList?.find((i) => i.contractId === contractId);
      takerFeeRate = meta?.defaultTakerFeeRate;
      makerFeeRate = meta?.defaultMakerFeeRate;
    }
    const feeRate = Math.max(Number(takerFeeRate), Number(makerFeeRate));

    let positionOpenSize = BigNumber(
      positionList.find((p) => p.contractId == contractId)?.openSize || "0",
    );

    const fillSize = BigNumber(orderSize).dividedBy(orderSide == "BUY" ? 1 : -1);
    const fillValue = fillSize.multipliedBy(orderPrice);
    const fillFee = fillValue.multipliedBy(feeRate).abs().negated();

    const oraclePrice = ticker?.oraclePrice?.toString();
    const afterCollateralTotalEquity = this.calculateCollateralTotalEquityAfterFill({
      oraclePrice,
      collateralTotalEquity,
      fillSize,
      fillValue,
      fillFee,
    });
    const afterCollateralStarkExRiskValue = this.calculateCollateralStarkExRiskValueAfterFill({
      contract: symbol,
      oraclePrice,
      positionOpenSize,
      collateralStarkExRiskValue,
      fillSize,
    });

    const afterPositionSize = positionOpenSize.plus(fillSize);

    // Use Position Entity Proxy
    const mockPosition = new Position(symbol, {
      openSize: afterPositionSize.toString(),
    } as any);

    const afterLiquidatePrice = mockPosition.getLiquidationPrice(oraclePrice, {
      totalEquity: afterCollateralTotalEquity,
      starkExRiskValue: afterCollateralStarkExRiskValue,
      pendingWithdrawAmount: collateralPendingWithdrawAmount,
      pendingTransferOutAmount: collateralPendingTransferOutAmount,
    });
    return afterLiquidatePrice;
  }
}
