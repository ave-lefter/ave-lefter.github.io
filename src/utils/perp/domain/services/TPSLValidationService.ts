/**
 * TPSL Validation Service
 *
 * Responsibilities:
 * - Validate TP/SL trigger prices against current market prices
 * - Validate TP/SL prices against liquidation price
 * - Return structured validation errors for UI layer
 *
 * DDD Principles:
 * - Domain Service: Contains business rules for TPSL validation
 * - Pure function: No side effects
 * - Decoupled from UI: Returns error codes, not UI-specific messages
 */

import { TYPE_triggerPrice } from "../constants/trade.constants";

/**
 * TPSL Validation Context
 */
export interface TPSLValidationContext {
  /** Position side: "LONG" | "SHORT" */
  positionSide: string;
  /** Trigger price type: "INDEX_PRICE" | "LAST_PRICE" | "ORACLE_PRICE" */
  triggerPriceType: string;
  /** Current oracle price */
  oraclePrice: number;
  /** Current index price */
  indexPrice: number;
  /** Current last price */
  lastPrice: number;
  /** Liquidation price (optional) */
  liqPrice?: number;
}

/**
 * TPSL Validation Parameters
 */
export interface TPSLValidationParams {
  /** TPSL type: "tp" | "sl" */
  type: "tp" | "sl";
  /** Trigger price to validate */
  triggerPrice: number;
  /** Volume (for completeness check, but validation is done elsewhere) */
  volume: number;
}

/**
 * TPSL Validation Error
 *
 * Returns error information that UI layer can use to display messages.
 * Error codes match existing i18n keys for backward compatibility.
 */
export interface TPSLValidationError {
  /** Error type for UI display */
  type: "info" | "warning" | "error";
  /** Translation key for error title */
  titleKey: string;
  /** Translation key for error message */
  messageKey: string;
  /** Additional parameters for translation */
  params?: Record<string, any>;
}

/**
 * TPSL Validation Service
 *
 * Validates TP/SL orders based on business rules:
 * - TP price must be better than current price (Long: TP > Current, Short: TP < Current)
 * - SL price must be worse than current price (Long: SL < Current, Short: SL > Current)
 * - SL price must not be worse than liquidation price
 */
export class TPSLValidationService {
  /**
   * Validate TPSL order
   *
   * @param params Validation parameters
   * @param context Validation context with market data
   * @returns Validation error if invalid, null if valid
   */
  static validate(
    params: TPSLValidationParams,
    context: TPSLValidationContext,
  ): TPSLValidationError | null {
    const { type, triggerPrice, volume } = params;
    const { positionSide, triggerPriceType, oraclePrice, indexPrice, lastPrice, liqPrice } =
      context;

    // Skip validation if trigger price or volume is empty
    // This matches original behavior: empty values are handled by submit check
    if (!triggerPrice || !volume) {
      return null;
    }

    // Resolve current price based on trigger price type
    const currentPrice = this.resolveCurrentPrice(triggerPriceType, {
      oraclePrice,
      indexPrice,
      lastPrice,
    });

    // TP Validation
    if (type === "tp") {
      return this.validateTP(triggerPrice, currentPrice, positionSide, triggerPriceType);
    }

    // SL Validation
    if (type === "sl") {
      return this.validateSL(triggerPrice, currentPrice, positionSide, triggerPriceType, liqPrice);
    }

    return null;
  }

  /**
   * Validate TP (Take Profit) order
   *
   * Business Rule:
   * - Long position: TP must be > Current Price
   * - Short position: TP must be < Current Price
   */
  private static validateTP(
    triggerPrice: number,
    currentPrice: number,
    positionSide: string,
    triggerPriceType: string,
  ): TPSLValidationError | null {
    const isLong = positionSide === "LONG";
    const isShort = positionSide === "SHORT";

    // Long: TP must be > Current
    // Short: TP must be < Current
    if ((isLong && triggerPrice < currentPrice) || (isShort && triggerPrice > currentPrice)) {
      return {
        type: "info",
        titleKey: "toastTitleWarn",
        messageKey: isLong ? "tpPriceLessTips.tpOSl" : "tpPriceMoreTips.tpOSl",
        params: {
          priceType: this.getPriceTypeKey(triggerPriceType),
        },
      };
    }

    return null;
  }

  /**
   * Validate SL (Stop Loss) order
   *
   * Business Rules:
   * - Long position: SL must be < Current Price
   * - Short position: SL must be > Current Price
   * - SL must not be worse than liquidation price (if provided)
   */
  private static validateSL(
    triggerPrice: number,
    currentPrice: number,
    positionSide: string,
    triggerPriceType: string,
    liqPrice?: number,
  ): TPSLValidationError | null {
    const isLong = positionSide === "LONG";
    const isShort = positionSide === "SHORT";

    // Long: SL must be < Current
    // Short: SL must be > Current
    if ((isLong && triggerPrice > currentPrice) || (isShort && triggerPrice < currentPrice)) {
      return {
        type: "info",
        titleKey: "toastTitleWarn",
        messageKey: isLong ? "slPriceMoreTips.tpOSl" : "slPriceLessTips.tpOSl",
        params: {
          priceType: this.getPriceTypeKey(triggerPriceType),
        },
      };
    }

    // Liquidation Price Validation
    if (liqPrice !== undefined && liqPrice > 0) {
      // Long: SL must be >= Liq (Error if SL < Liq, meaning SL triggered after liquidation)
      // Short: SL must be <= Liq (Error if SL > Liq)
      if ((isLong && triggerPrice < liqPrice) || (isShort && triggerPrice > liqPrice)) {
        return {
          type: "info",
          titleKey: "toastTitleWarn",
          messageKey: "slPriceLessWithLiqTips.tpOSl",
        };
      }
    }

    return null;
  }

  /**
   * Resolve current price based on trigger price type
   */
  private static resolveCurrentPrice(
    triggerPriceType: string,
    prices: {
      oraclePrice: number;
      indexPrice: number;
      lastPrice: number;
    },
  ): number {
    if (triggerPriceType === TYPE_triggerPrice.ORACLE_PRICE) {
      return prices.oraclePrice;
    }
    if (triggerPriceType === TYPE_triggerPrice.INDEX_PRICE) {
      return prices.indexPrice;
    }
    return prices.lastPrice;
  }

  /**
   * Get price type key for translation
   *
   * Maps trigger price type to translation key used in UI layer.
   * This maintains backward compatibility with existing i18n keys.
   */
  private static getPriceTypeKey(triggerPriceType: string): string {
    const priceTypeMap: Record<string, string> = {
      [TYPE_triggerPrice.ORACLE_PRICE]: "oraclePrice",
      [TYPE_triggerPrice.INDEX_PRICE]: "indexPrice",
      [TYPE_triggerPrice.LAST_PRICE]: "lastPrice",
    };
    return priceTypeMap[triggerPriceType] || "lastPrice";
  }
}

