import BigNumber from "bignumber.js";
import type { OrderBookEntry } from "./domain/entities/Orderbook"
import type { AccountInfo, IContract, IMetadata, OrderEntry, IRiskTier } from "./types"
import { toPrecisionString, toTickSizeRoundString } from "./utils";
import { Account } from "./domain/entities/Account";
import { TYPE_orderSide } from "./domain/constants";
import { Position } from "./domain/entities/Position";
import { Ticker } from "./domain/entities/Ticker";
import { OrderType } from "./domain/value-objects/OrderEnums";
import { OrderTypeHelper } from "./domain/utils/OrderTypeHelper";
import { OrderMarginService } from "./domain/services/OrderMarginService";
import { OrderExecutionService } from "./domain/services/OrderExecutionService";
import { RiskTier } from "./domain/entities/RiskTier";
import { SymbolEntity } from "./domain/entities/Symbol";

export interface OrderCalculationContext {
  contractId: string;
  metadata: IMetadata;
  account: AccountInfo;
  positions: Position[];
  orders: OrderEntry[];
  collaterals: any[];
  withdraws: any[];
  transfers: any[];
  symbolsList: SymbolEntity[];
  tickers: Map<string, Ticker>;
  orderBook?: { ask1: string; bid1: string };
}

export interface CalculateCostParams {
  size: string | number;
  price: string | number;
  side: string;
  type: OrderType;
}

export interface CalculateMaxSizeParams {
  type: string;
  side: string;
  price: string | number;
  reduceOnly?: boolean;
}

export interface CalculateLiqPriceParams {
  side: string;
  price: string | number;
  size: string | number;
}

export interface CalculateSizeFromRatioParams {
  maxQty: string | number;
  ratio: number;
  stepSize: string;
}

export interface CalculateTPSLPriceFromROEParams {
  entryPrice: string | number;
  roe: number;
  leverage: number;
  side: string;
  pricePrecision: number;
  tpOSlSide: string;
}

export interface CalculateMarginParams {
  side: "LONG" | "SHORT" | string;
  oraclePrice: string | number;
  price?: string | number;
  size: string | number;
  leverage: string | number;
  feeRate: string | number;
  orderBook?: OrderBookEntry[];
  isMarketOrder?: boolean;
}

export class OrderCalculationService {
  private static getExecutionPrice(
    type: string,
    side: string,
    price: string | number,
    orderBook?: { ask1: string; bid1: string },
  ): string {
    if ([OrderType.LIMIT, OrderType.STOP_LIMIT].includes(type as OrderType)) {
      return String(price);
    }
    const { ask1 = "0", bid1 = "0" } = orderBook || {};
    return String(side === TYPE_orderSide.BUY ? ask1 : bid1);
  }

  private static calculateRiskLimitMaxSize(
    leverage: number,
    riskTierList: RiskTier[] | undefined,
    price: string | number,
    sizePrecision: number,
  ): number {
    if (!riskTierList || !price || Number(price) <= 0) {
      return Infinity;
    }

    const sortedRiskTierList = [...riskTierList]
      .slice()
      .sort((a, b) => Number(a.maxLeverage) - Number(b.maxLeverage));

    const currentTier = sortedRiskTierList.find((tier) => Number(tier.maxLeverage) >= leverage);

    if (!currentTier) {
      return Infinity;
    }

    const positionValueUpperBound = currentTier.positionValueUpperBound;

    const isInfinite = positionValueUpperBound === "79228162514264337593543";
    if (isInfinite) {
      return Infinity;
    }

    const maxSize = BigNumber(positionValueUpperBound).dividedBy(price);

    return Number(toPrecisionString(maxSize, sizePrecision)) || 0;
  }

  private static getMaxPositionSizeLimit(maxPositionSize: string | number | undefined): number {
    if (!maxPositionSize || Number(maxPositionSize) <= 0) {
      return Infinity;
    }
    return Number(maxPositionSize);
  }

  static calculateCost(ctx: OrderCalculationContext, params: CalculateCostParams): BigNumber {
    const { size, price, side, type } = params;
    const orderPrice = this.getExecutionPrice(type, side, price, ctx.orderBook);

    return OrderExecutionService.calculateCreateOrderCost({
      tickers: ctx.tickers,
      contractId: ctx.contractId,
      metadata: ctx.metadata,
      positionList: ctx.positions,
      symbolsList: ctx.symbolsList,
      account: ctx.account,
      orderList: ctx.orders,
      orderSide: side,
      orderPrice,
      orderSize: String(size),
    });
  }

  static calculateMaxSize(ctx: OrderCalculationContext, params: CalculateMaxSizeParams): BigNumber {
    const { type, side, price, reduceOnly } = params;
    const symbol = ctx.symbolsList.find((s) => s.contractId === ctx.contractId)!;
    if (!symbol) return BigNumber(0);

    const currentPrice = this.getExecutionPrice(type, side, price, ctx.orderBook);

    let leverage: number;
    if (ctx.account) {
      leverage = Account.fromRaw(ctx.account).getEffectiveMaxLeverage(ctx.contractId, ctx.metadata);
    } else {
      const curContractIdToMetadata = ctx.metadata?.contractList?.find((i) => i.contractId === ctx.contractId);
      leverage = Number(curContractIdToMetadata?.defaultLeverage);
    }

    let riskCalcPrice = currentPrice;
    if ([OrderType.MARKET, OrderType.STOP_MARKET].includes(type as OrderType)) {
      const ticker = ctx.tickers.get(symbol.contractName);
      if (ticker && Number(ticker.oraclePrice) > 0) {
        riskCalcPrice = String(ticker.oraclePrice);
      }
    }

    const riskLimitMax = this.calculateRiskLimitMaxSize(
      leverage,
      symbol.riskTierList,
      riskCalcPrice,
      symbol.sizePrecision,
    );

    const positionLimitMax = this.getMaxPositionSizeLimit(symbol.maxPositionSize);

    let marginBasedMax = BigNumber(0);

    if ([OrderType.LIMIT, OrderType.STOP_LIMIT].includes(type as OrderType)) {
      marginBasedMax = OrderExecutionService.calculateMaxCreateOrderSize({
        tickers: ctx.tickers,
        contractId: ctx.contractId,
        metadata: ctx.metadata,
        positionList: ctx.positions,
        symbolsList: ctx.symbolsList,
        account: ctx.account,
        withdraw: ctx.withdraws,
        transferOut: ctx.transfers,
        orderList: ctx.orders,
        collateral: ctx.collaterals,
        orderSide: side,
        orderPrice: String(price),
        reduceOnly: !!reduceOnly,
      });
    } else {
      const { ask1 = "0", bid1 = "0" } = ctx.orderBook || {};
      marginBasedMax = OrderExecutionService.calculateMaxCreateMarketOrderSize({
        contractId: ctx.contractId,
        metadata: ctx.metadata,
        positionList: ctx.positions,
        symbolsList: ctx.symbolsList,
        account: ctx.account,
        withdraw: ctx.withdraws,
        transferOut: ctx.transfers,
        order: ctx.orders,
        collateral: ctx.collaterals,
        orderSide: side,
        reduceOnly: !!reduceOnly,
        ask1: String(ask1),
        bid1: String(bid1),
        tickers: ctx.tickers,
      });
    }

    const finalMax = Math.max(
      Math.min(marginBasedMax.toNumber() || 0, riskLimitMax, positionLimitMax),
      0,
    );

    return BigNumber(finalMax);
  }

  static calculateLiqPrice(
    ctx: OrderCalculationContext,
    params: CalculateLiqPriceParams,
  ): BigNumber {
    const { side, price, size } = params;

    return BigNumber(
      OrderExecutionService.calculateCreateOrderLiquidatePrice({
        tickers: ctx.tickers,
        contractId: ctx.contractId,
        metadata: ctx.metadata,
        positionList: ctx.positions,
        symbolsList: ctx.symbolsList,
        account: ctx.account,
        withdraw: ctx.withdraws,
        transferOut: ctx.transfers,
        order: ctx.orders,
        collateral: ctx.collaterals,
        orderSide: side,
        orderPrice: String(price),
        orderSize: String(size),
      }),
    );
  }

  static calculateSizeFromRatio(params: CalculateSizeFromRatioParams): string {
    const { maxQty, ratio, stepSize } = params;
    const rawSize = BigNumber(maxQty).multipliedBy(ratio).dividedBy(100);
    return toTickSizeRoundString(rawSize.toNumber(), stepSize, true);
  }

  /**
   * Get price for order calculation
   *
   * Returns the appropriate price to use for order-related calculations
   * (order limits, input conversions, etc.)
   *
   * Rules:
   * - MARKET orders and conditional MARKET orders use lastPrice
   * - LIMIT orders use provided price, fallback to lastPrice if not available
   *
   * @param params Price parameters
   * @returns Price as number for calculation purposes
   */
  static getCalculationPrice(params: {
    orderType: OrderType | string;
    isConditionalMarket: boolean;
    limitPrice: string | number;
    lastPrice: string | number;
  }): number {
    const { orderType, isConditionalMarket, limitPrice, lastPrice } = params;

    const preferLastPrice = orderType === OrderType.MARKET || isConditionalMarket;

    if (preferLastPrice) {
      return Number(lastPrice) || 0;
    }

    return Number(limitPrice) || Number(lastPrice) || 0;
  }

  /**
   * Get price for display/UI purposes
   *
   * Similar to getCalculationPrice, but designed for UI display scenarios.
   * Supports choosing between oraclePrice and lastPrice for market orders.
   *
   * Rules:
   * - MARKET orders and conditional MARKET orders use oraclePrice (if provided), fallback to lastPrice
   * - LIMIT orders use provided price, fallback to oraclePrice/lastPrice if not available
   *
   * @param params Price parameters
   * @returns Price for display purposes (string | number)
   */
  static getDisplayPrice(params: {
    orderType: OrderType | string;
    isConditionalMarket: boolean;
    limitPrice: string | number;
    oraclePrice?: string | number;
    lastPrice: string | number;
  }): string | number {
    const { orderType, isConditionalMarket, limitPrice, oraclePrice, lastPrice } = params;

    const preferMarketPrice = OrderTypeHelper.isMarketOrder(orderType) || isConditionalMarket;

    if (preferMarketPrice) {
      return oraclePrice || lastPrice || "";
    }

    return limitPrice || oraclePrice || lastPrice || "";
  }

  static calculateTPSLPriceFromROE(params: CalculateTPSLPriceFromROEParams): string {
    const { entryPrice, roe, leverage, tpOSlSide, pricePrecision } = params;
    const direction = tpOSlSide === TYPE_orderSide.BUY ? 1 : -1;
    return BigNumber(roe)
      .dividedBy(100)
      .multipliedBy(entryPrice)
      .dividedBy(leverage)
      .multipliedBy(direction)
      .plus(entryPrice)
      .toFixed(pricePrecision);
  }

  static calculateMargin(params: CalculateMarginParams): BigNumber {
    const { side, isMarketOrder, ...serviceParams } = params;
    const marginSide = side === TYPE_orderSide.BUY || side === "LONG" ? "LONG" : "SHORT";

    const service = new OrderMarginService({
      ...serviceParams,
      orderbook: serviceParams.orderBook,
    });

    return service.calcMargin(marginSide, { isMarketOrder });
  }
}
