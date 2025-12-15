import BigNumber from "bignumber.js";
import { getNumberPrecision } from "@edgex/utils";
import { calculateMaxCreateMarketOrderSize } from "../../domain/calculator";
import { TYPE_orderSide, TYPE_triggerPrice } from "../../domain/constants";
import { BusinessRuleError, SizeOutOfRangeError } from "../../domain/errors/DomainError";
import { PositionFactory } from "../../domain/services/PositionFactory";
import {
  OrderStatus,
  OrderType,
  PositionSide,
  TimeInForce,
} from "../../domain/value-objects/OrderEnums";
import { ReversePositionInput } from "../dtos/position.dto";
import { CancelOrderUseCase } from "./CancelOrderUseCase";
import { CreateOrderUseCase } from "./CreateOrderUseCase";

export class ReversePositionUseCase {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
  ) {}

  async execute(input: ReversePositionInput) {
    const {
      accountId,
      contractId,
      targetPosition,
      snapshot,
      lastPrice,
      symbolName,
      currentActiveAccount,
      tickers,
    } = input;
    const { activeOrders, symbolsList } = snapshot;

    // 1. Cancel TPSL Orders
    const tpslOrders = activeOrders.filter(
      (orderItem) =>
        orderItem.contractId === contractId &&
        orderItem.isPositionTpsl === true &&
        [OrderStatus.PENDING, OrderStatus.OPEN].includes(orderItem.status),
    );

    if (tpslOrders.length > 0) {
      await this.cancelOrderUseCase.execute({
        accountId,
        orderIds: tpslOrders.map((o) => o.id),
      });
    }

    // 2. Calculate Reverse Params
    // If LONG, reverse is SELL (Short). If SHORT, reverse is BUY (Long).
    // Position.side mapping: "LONG" -> SELL, "SHORT" -> BUY
    const isLong = targetPosition.side === PositionSide.LONG;
    const reverseSide = isLong ? TYPE_orderSide.SELL : TYPE_orderSide.BUY;

    // Size = Current Size * 2
    // Need symbol info for precision
    const symbolInfo = symbolsList.find((s) => s.contractId === contractId);
    if (!symbolInfo) throw new Error("Symbol info not found");

    const precision = getNumberPrecision(symbolInfo.sizeStep);
    const reverseSize = BigNumber(targetPosition.size)
      .multipliedBy(2)
      .toFixed(precision, BigNumber.ROUND_DOWN);

    // 3. Validation
    // Min Order Size
    const minOrderSize = symbolInfo.minOrderSize || "0";
    if (BigNumber(reverseSize).lt(minOrderSize)) {
      throw new SizeOutOfRangeError(reverseSize, minOrderSize, "Infinity");
    }

    const positionList = PositionFactory.createPositionsFromRaw(
      snapshot.positionEntries,
      symbolsList,
    );

    // Max Margin Check
    const maxOrderSize = calculateMaxCreateMarketOrderSize({
      contractId,
      metadata: snapshot.metadata,
      positionList,
      symbolsList: snapshot.symbolsList,
      account: snapshot.activeAccount,
      withdraw: snapshot.withdraws,
      transferOut: snapshot.transferOuts,
      order: snapshot.activeOrders,
      collateral: snapshot.collaterals,
      orderSide: reverseSide,
      reduceOnly: false,
      bid1: lastPrice,
      ask1: lastPrice,
      tickers,
    });

    if (BigNumber(reverseSize).gt(maxOrderSize)) {
      throw new BusinessRuleError("ORDER_MARGIN_AVAILABLE_AMOUNT_NOT_ENOUGH");
    }

    // 4. Create Order
    return this.createOrderUseCase.execute({
      metadata: snapshot.metadata,
      currentActiveAccount: currentActiveAccount,
      currentActiveChainId: undefined, // Optional
      params: {
        side: reverseSide,
        price: lastPrice,
        size: reverseSize,
        type: OrderType.MARKET,
        timeInForce: TimeInForce.IMMEDIATE_OR_CANCEL,
        reduceOnly: false,
        symbol: symbolName,
        contractId: contractId,
        isPositionTpsl: false,
        isSetOpenSl: false,
        isSetOpenTp: false,
        triggerPrice: "",
        triggerPriceType: TYPE_triggerPrice.LAST_PRICE,
        triggerPriceWithType: lastPrice,
        confirm: false,
        isReverse: true,
      },
    });
  }
}
