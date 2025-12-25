/**
 * TPSL Description Service
 *
 * Generates human-readable descriptions for TP/SL orders.
 * Pure functions with no side effects.
 *
 * Example output:
 * "When Last Price >= 50,000 USDC, Take Profit will be triggered,
 *  expected profit +500.00 USDC (+10.00%)"
 */

import BigNumber from "bignumber.js";
import { PositionSide } from "../value-objects/OrderEnums";

/**
 * TPSL Description Parameters
 */
export interface TPSLDescriptionParams {
  /** TP or SL mode */
  mode: "tp" | "sl";
  /** Position side: LONG or SHORT */
  side: PositionSide | string;
  /** Order type: MARKET or LIMIT */
  orderType: "MARKET" | "LIMIT" | string;
  /** Trigger price */
  triggerPrice: number;
  /** Order price (for LIMIT orders) */
  orderPrice?: number;
  /** Entry price (position entry or order entry) */
  entryPrice: number;
  /** Order/position volume */
  volume: number;
  /** Leverage for rate calculation */
  leverage: number;
  /** Trigger price type for display */
  triggerPriceType: "LAST_PRICE" | "INDEX_PRICE" | "ORACLE_PRICE" | string;
}

/**
 * TPSL Description Result
 *
 * Returns structured data for UI layer to format with i18n.
 * UI layer is responsible for:
 * - Translating templateKey
 * - Formatting prices/amounts using SymbolEntity
 * - Applying locale-specific formatting
 */
export interface TPSLDescriptionResult {
  /** Translation template key */
  templateKey: string;
  /** Template parameters */
  params: {
    /** Comparator symbol: >=, <= */
    comparator: string;
    /** Raw trigger price value */
    triggerPrice: number;
    /** Raw order price value (LIMIT only) */
    orderPrice?: number;
    /** Raw PnL amount (absolute value) */
    amount: number;
    /** PnL rate percentage (e.g., 10.00) */
    rate: string;
    /** Whether the result is profit (true) or loss (false) */
    isProfit: boolean;
  };
}

/**
 * TPSL Description Service
 *
 * Calculates PnL and generates description data for TP/SL orders.
 * Does NOT handle:
 * - Translation (returns template keys)
 * - Price/amount formatting (returns raw values)
 * - Validation (should be done before calling)
 */
export class TPSLDescriptionService {
  /**
   * Generate TPSL description data
   *
   * @param params Description parameters
   * @returns Description result or null if invalid input
   */
  static generate(params: TPSLDescriptionParams): TPSLDescriptionResult | null {
    const {
      mode,
      side,
      orderType,
      triggerPrice,
      orderPrice,
      entryPrice,
      volume,
      leverage,
    } = params;

    // Validate required inputs
    if (!triggerPrice || triggerPrice <= 0) return null;
    if (!entryPrice || entryPrice <= 0) return null;
    if (!volume || volume <= 0) return null;
    if (orderType === "LIMIT" && (!orderPrice || orderPrice <= 0)) return null;

    const isLong = side === PositionSide.LONG || side === "LONG";

    // Calculate execution price
    const execPrice = this.calculateExecutionPrice(
      triggerPrice,
      orderPrice,
      orderType,
      isLong,
    );

    // Calculate PnL
    const pnl = this.calculatePnL(entryPrice, execPrice, volume, isLong);
    const pnlRate = this.calculatePnLRate(pnl, entryPrice, volume, leverage);

    // Determine template key
    const isProfit = pnl > 0;
    const templateKey = this.selectTemplateKey(orderType, isProfit);

    // Determine comparator
    const comparator = this.getComparator(mode, isLong);

    const result: TPSLDescriptionResult = {
      templateKey,
      params: {
        comparator,
        triggerPrice,
        amount: Math.abs(pnl),
        rate: pnlRate.toFixed(2),
        isProfit,
      },
    };

    if (orderType === "LIMIT" && orderPrice) {
      result.params.orderPrice = orderPrice;
    }

    return result;
  }

  /**
   * Calculate execution price based on order type
   *
   * For LIMIT orders:
   * - Long: max(orderPrice, triggerPrice) - ensures we get filled at better price
   * - Short: min(orderPrice, triggerPrice)
   *
   * For MARKET orders:
   * - Use trigger price directly
   */
  private static calculateExecutionPrice(
    triggerPrice: number,
    orderPrice: number | undefined,
    orderType: string,
    isLong: boolean,
  ): number {
    if (orderType === "LIMIT" && orderPrice !== undefined) {
      return isLong
        ? Math.max(orderPrice, triggerPrice)
        : Math.min(orderPrice, triggerPrice);
    }
    return triggerPrice;
  }

  /**
   * Calculate PnL amount
   *
   * Formula:
   * - Long: (exitPrice - entryPrice) * volume
   * - Short: (entryPrice - exitPrice) * volume
   */
  private static calculatePnL(
    entryPrice: number,
    exitPrice: number,
    volume: number,
    isLong: boolean,
  ): number {
    const entry = new BigNumber(entryPrice);
    const exit = new BigNumber(exitPrice);
    const vol = new BigNumber(volume);

    if (isLong) {
      return exit.minus(entry).multipliedBy(vol).toNumber();
    } else {
      return entry.minus(exit).multipliedBy(vol).toNumber();
    }
  }

  /**
   * Calculate PnL rate as percentage
   *
   * Formula: (PnL / (entryPrice * volume)) * leverage * 100
   * This represents ROI based on margin
   */
  private static calculatePnLRate(
    pnl: number,
    entryPrice: number,
    volume: number,
    leverage: number,
  ): number {
    if (entryPrice <= 0 || volume <= 0 || leverage <= 0) return 0;

    const pnlBN = new BigNumber(pnl);
    const notional = new BigNumber(entryPrice).multipliedBy(volume);

    return pnlBN.div(notional).multipliedBy(leverage).multipliedBy(100).toNumber();
  }

  /**
   * Select translation template key
   */
  private static selectTemplateKey(orderType: string, isProfit: boolean): string {
    if (orderType === "LIMIT") {
      return isProfit
        ? "tposl.limitOrderDescription.profit"
        : "tposl.limitOrderDescription.loss";
    }
    return isProfit
      ? "tposl.marketOrderDescription.profit"
      : "tposl.marketOrderDescription.loss";
  }

  /**
   * Get comparator symbol for description
   *
   * TP triggers when price reaches target (favorable direction):
   * - Long TP: Price >= target
   * - Short TP: Price <= target
   *
   * SL triggers when price reaches stop (unfavorable direction):
   * - Long SL: Price <= stop
   * - Short SL: Price >= stop
   */
  private static getComparator(mode: "tp" | "sl", isLong: boolean): string {
    if (mode === "tp") {
      return isLong ? ">=" : "<=";
    }
    return isLong ? "<=" : ">=";
  }
}
