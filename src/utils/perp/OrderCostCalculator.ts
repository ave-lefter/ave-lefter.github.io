/**
 * OrderCostCalculator
 *
 * Calculates order costs, maximum sizes, liquidation prices, and margins.
 * Requires complex context (account, positions, orders) for calculations.
 */

import BigNumber from "bignumber.js";
import type {
  AccountInfo,
  CollateralEntry,
  IMetadata,
  ITransferOut,
  IWithdraw,
  OrderEntry,
} from "./types";
import { toPrecisionString } from "./utils";
import { TYPE_orderSide } from "./domain/constants";
import { buildOrderExecutionContext } from "./domain/contexts";
import { Account } from "./domain/entities/Account";
import type { OrderBookEntry } from "./domain/entities/Orderbook";
import { Position } from "./domain/entities/Position";
import { RiskTier } from "./domain/entities/RiskTier";
import { SymbolEntity } from "./domain/entities/Symbol";
import { Ticker } from "./domain/entities/Ticker";
import { OrderExecutionService } from "./domain/services/OrderExecutionService";
import { OrderMarginService } from "./domain/services/OrderMarginService";
import { OrderType } from "./domain/value-objects/OrderEnums";

// ============================================================================
// Types
// ============================================================================

export interface OrderCalculationContext {
  contractId: string;
  metadata: IMetadata;
  account: AccountInfo;
  positions: Position[];
  orders: OrderEntry[];
  collaterals: CollateralEntry[];
  withdraws: IWithdraw[];
  transfers: ITransferOut[];
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

// ============================================================================
// Calculator
// ============================================================================

export class OrderCostCalculator {
  /**
   * Get execution price based on order type
   */
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

  /**
   * Calculate max size based on risk tier limits
   */
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

  /**
   * Get max position size limit from symbol config
   */
  private static getMaxPositionSizeLimit(maxPositionSize: string | number | undefined): number {
    if (!maxPositionSize || Number(maxPositionSize) <= 0) {
      return Infinity;
    }
    return Number(maxPositionSize);
  }

  /**
   * Calculate order cost (margin requirement)
   */
  static calculateCost(ctx: OrderCalculationContext, params: CalculateCostParams): BigNumber {
    const { size, price, side, type } = params;
    const orderPrice = this.getExecutionPrice(type, side, price, ctx.orderBook);

    const execCtx = buildOrderExecutionContext(ctx);
    if (!execCtx) return BigNumber(0);

    const service = new OrderExecutionService(execCtx);
    return service.calculateOrderCost(side, orderPrice, String(size));
  }

  /**
   * Calculate maximum order size based on available margin and risk limits
   */
  static calculateMaxSize(ctx: OrderCalculationContext, params: CalculateMaxSizeParams): BigNumber {
    const { type, side, price, reduceOnly } = params;
    const symbol = ctx.symbolsList.find((s) => s.contractId === ctx.contractId)!;

    if (!symbol) return BigNumber(0);

    const currentPrice = this.getExecutionPrice(type, side, price, ctx.orderBook);

    let leverage: number;
    if (ctx.account) {
      leverage = Account.fromRaw(ctx.account).getEffectiveMaxLeverage(ctx.contractId, ctx.metadata);
    } else {
      const curContractIdToMetadata = ctx.metadata?.contractList?.find(
        (i) => i.contractId === ctx.contractId,
      );
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

    const execCtx = buildOrderExecutionContext(ctx);
    if (execCtx) {
      const service = new OrderExecutionService(execCtx);

      if ([OrderType.LIMIT, OrderType.STOP_LIMIT].includes(type as OrderType)) {
        marginBasedMax = service.calculateMaxOrderSize(side, String(price), !!reduceOnly);
      } else {
        const { ask1 = "0", bid1 = "0" } = ctx.orderBook || {};
        marginBasedMax = service.calculateMaxMarketOrderSize(side, !!reduceOnly, {
          ask1: String(ask1),
          bid1: String(bid1),
        });
      }
    }

    const finalMax = Math.max(
      Math.min(marginBasedMax.toNumber() || 0, riskLimitMax, positionLimitMax),
      0,
    );

    return BigNumber(finalMax);
  }

  /**
   * Calculate margin requirement for an order
   */
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
