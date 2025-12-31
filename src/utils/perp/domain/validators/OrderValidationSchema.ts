/**
 * Order Validation Schema
 *
 * Declarative validation rules for order form.
 * All business logic is preserved from original implementations.
 *
 * Design Principles:
 * - Single source of truth for all validation rules
 * - Rules are declarative and testable
 * - Supports both realtime (form) and submit validation modes
 * - Error codes map to i18n keys for UI layer
 */

import BigNumber from "bignumber.js";
import type { PositionEntry } from "../../types";
import { TYPE_orderSide } from "../constants/trade.constants";
import { SymbolEntity } from "../entities";
import { LadderOrderDistributionMode, OrderBasis, OrderType } from "../value-objects/OrderEnums";
import { LADDER_ORDER_VALIDATION_RULES } from "./LadderOrderValidationRules";

// ============================================================================
// Types
// ============================================================================

/**
 * Validation mode determines when the rule is applied
 */
export type ValidationMode = "realtime" | "submit" | "all";

/**
 * Error severity determines how the error is displayed
 */
export type ValidationSeverity = "silent" | "form" | "toast";

/**
 * Field that the validation rule applies to
 */
export type ValidationField =
  | "triggerPrice"
  | "price"
  | "size"
  | "wallet"
  | "reduceOnly"
  | "tpsl"
  | "tpTriggerPrice"
  | "slTriggerPrice"
  | "balance"
  | "ladderOrderSize"
  | "ladderOrderMinPrice"
  | "ladderOrderMaxPrice"
  | "ladderOrderCount";

/**
 * Market data needed for validation
 */
export interface ValidationMarketData {
  lastPrice: string | number;
  indexPrice: string | number;
  oraclePrice: string | number;
  maxBuySize: string | number;
  maxSellSize: string | number;
  openSizeReduceRatio: number;
}

/**
 * Symbol info for validation (subset of IContract)
 */
export interface ValidationSymbolInfo {
  quoteCoin: string;
  baseCoin: string;
  pricePrecision: number;
  minOrderSize: string | number;
  minOrderSellPriceRatio?: string | number;
  maxOrderBuyPriceRatio?: string | number;
}

/**
 * Validation context - external data needed for validation
 */
export interface OrderFormValidationContext {
  symbolEntity: SymbolEntity;
  /** Symbol info for validation */
  symbolInfo?: ValidationSymbolInfo;
  /** User's available balance */
  balance: BigNumber;
  /** Current contract position */
  contractPosition?: PositionEntry;
  /** Order limits */
  orderLimits: {
    minOrderValue: string | number;
    minOrderSize: string | number;
    minMarginRequirement: string | number;
  };
  /** Price used for value calculation */
  calculationPrice: string | number;
  /** Whether wallet is connected */
  isWalletConnected?: boolean;
  /** Market data for submit validation */
  marketData?: ValidationMarketData;
}

/**
 * Validation parameters - form input values
 */
export interface OrderFormValidationParams {
  /** Order type */
  type: OrderType | string;
  /** Order side: "BUY" | "SELL" */
  side: string;
  /** Limit price */
  price?: string | number;
  /** Trigger price (conditional orders) */
  triggerPrice?: string | number;
  /** Order size */
  orderSize: string | number;
  /** Order basis type */
  orderBasis: OrderBasis;
  /** Order value (for Value basis) */
  orderValue: string | number;
  /** Order margin (for Margin basis) */
  orderMargin: string | number;
  /** Size ratio (0-100 for percentage orders) */
  sizeRatio: number;
  /** Max buy size */
  maxBuySize?: string | number;
  /** Max sell size */
  maxSellSize?: string | number;
  /** Size step for rounding */
  sizeStep?: string | number;
  /** Whether reduce-only mode */
  reduceOnly: boolean;

  /** 分段订单最低价格 */
  ladderMinPrice?: string | number;
  /** 分段订单最高价格 */
  ladderMaxPrice?: string | number;
  /** 分段订单订单个数 */
  ladderOrderCount?: string | number;
  /** 分段订单分配模式 */
  ladderOrderDistributionMode?: LadderOrderDistributionMode;
  /** 分段订单数量输入框是否失焦 */
  ladderSizeBlurred?: boolean;

  // TP/SL parameters (for submit validation)
  /** Whether TP/SL is enabled */
  tpsl?: boolean;
  /** TP/SL side */
  tpOSlSide?: string;
  /** Take profit trigger price */
  tpTriggerPrice?: string | number;
  /** Stop loss trigger price */
  slTriggerPrice?: string | number;
  /** Trigger price with type (oracle/index/last price based on triggerPriceType) */
  triggerPriceWithType?: string | number;
}

/**
 * Validation rule definition
 */
export interface ValidationRule {
  /** Unique rule identifier */
  id: string;
  /** Field this rule validates */
  field: ValidationField;
  /** When to apply this rule */
  mode: ValidationMode;
  /** Error display severity */
  severity: ValidationSeverity;
  /** i18n error key */
  errorKey: string;
  /** Condition function - returns true if validation fails */
  condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => boolean;
  /** Optional: dynamic error key based on context */
  getErrorKey?: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => string;
  /** Optional: error parameters for i18n interpolation */
  getErrorParams?: (
    ctx: OrderFormValidationContext,
    params: OrderFormValidationParams,
  ) => Record<string, any>;
}

/**
 * Validation result for a single field
 */
export interface FieldValidationError {
  ruleId: string;
  field: ValidationField;
  errorKey: string;
  errorParams?: Record<string, any>;
  severity: ValidationSeverity;
}

/**
 * Complete validation result
 */
export interface OrderFormValidationResult {
  isValid: boolean;
  errors: FieldValidationError[];
  /** Convenience accessors for form fields */
  triggerPriceError: FieldValidationError | null;
  priceError: FieldValidationError | null;
  sizeError: FieldValidationError | null;

  ladderOrderSizeError: FieldValidationError | null;
  ladderOrderMinPriceError: FieldValidationError | null;
  ladderOrderMaxPriceError: FieldValidationError | null;
  ladderOrderCountError: FieldValidationError | null;
  ladderOrderMinPriceLessThanMaxPriceError: FieldValidationError | null;
  ladderOrderSizeMinRequirementError: FieldValidationError | null;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Check if order type is conditional (STOP_MARKET, STOP_LIMIT only)
 * Note: TAKE_PROFIT types are NOT included to match original validateFormInputs logic
 */
function isConditional(type: OrderType | string): boolean {
  if (typeof type === "string") {
    return type === "STOP_MARKET" || type === "STOP_LIMIT";
  }
  return type === OrderType.STOP_MARKET || type === OrderType.STOP_LIMIT;
}

/**
 * Check if order type is limit (LIMIT, STOP_LIMIT only)
 * Note: TAKE_PROFIT_LIMIT is NOT included to match original validateFormInputs logic
 */
function isLimit(type: OrderType | string): boolean {
  if (typeof type === "string") {
    return type === "LIMIT" || type === "STOP_LIMIT";
  }
  return type === OrderType.LIMIT || type === OrderType.STOP_LIMIT;
}

/**
 * Check if should skip min size validation for reduce-only orders
 */
function shouldSkipMinSizeCheck(
  ctx: OrderFormValidationContext,
  params: OrderFormValidationParams,
): boolean {
  if (!params.reduceOnly || !ctx.contractPosition) {
    return false;
  }

  const openSize = new BigNumber(ctx.contractPosition.openSize || 0);
  const isLong = openSize.gt(0);
  const isShort = openSize.lt(0);

  // Skip if closing same direction position
  if (params.side === TYPE_orderSide.BUY && isLong) return true;
  if (params.side === TYPE_orderSide.SELL && isShort) return true;

  return false;
}

/**
 * Check if size validation should run based on balance condition
 * Original logic: if (reduceOnly || !context.balance.isLessThanOrEqualTo(0))
 * This means: validate if reduceOnly OR if balance > 0
 */
function shouldValidateSize(
  ctx: OrderFormValidationContext,
  params: OrderFormValidationParams,
): boolean {
  return params.reduceOnly || !ctx.balance.isLessThanOrEqualTo(0);
}

/**
 * Calculate size from ratio mode
 */
function calculateSizeFromRatio(maxSize: string | number, ratio: number, stepSize: string): string {
  const max = new BigNumber(maxSize);
  const step = new BigNumber(stepSize);

  if (max.isZero() || step.isZero()) return "0";

  const rawSize = max.multipliedBy(ratio).dividedBy(100);
  const steps = rawSize.dividedBy(step).integerValue(BigNumber.ROUND_DOWN);
  return steps.multipliedBy(step).toString();
}

// ============================================================================
// Validation Rules
// ============================================================================

export const ORDER_VALIDATION_RULES: ValidationRule[] = [
  // -------------------------------------------------------------------------
  // Wallet Connection (submit only)
  // -------------------------------------------------------------------------
  {
    id: "wallet_connected",
    field: "wallet",
    mode: "submit",
    severity: "form",
    errorKey: "connectWallet",
    condition: (ctx) => ctx.isWalletConnected === false,
  },

  // -------------------------------------------------------------------------
  // Insufficient Balance (submit only) - Check early to match original behavior
  // -------------------------------------------------------------------------
  {
    id: "insufficient_margin",
    field: "balance",
    mode: "submit",
    severity: "form",
    errorKey: "insufficientMargin",
    condition: (ctx, params) => !params.reduceOnly && ctx.balance.isLessThanOrEqualTo(0),
    getErrorParams: (ctx) => ({ token: ctx.symbolInfo?.quoteCoin || ctx.symbolEntity?.quoteCoin }),
  },

  // -------------------------------------------------------------------------
  // Price Rules (silent - to match original behavior)
  // -------------------------------------------------------------------------
  {
    id: "price_required",
    field: "price",
    mode: "submit",
    severity: "silent",
    errorKey: "invalidPrice",
    condition: (ctx, params) =>
      isLimit(params.type) && (!params.price || Number(params.price) === 0),
  },

  // -------------------------------------------------------------------------
  // Trigger Price Rules (silent - to match original behavior)
  // -------------------------------------------------------------------------
  {
    id: "trigger_price_required",
    field: "triggerPrice",
    mode: "submit",
    severity: "silent",
    errorKey: "invalidTriggerPrice",
    condition: (ctx, params) =>
      isConditional(params.type) && (!params.triggerPrice || Number(params.triggerPrice) === 0),
  },

  // -------------------------------------------------------------------------
  // Reduce Only Rules
  // -------------------------------------------------------------------------
  {
    id: "reduce_only_no_position",
    field: "reduceOnly",
    mode: "submit",
    severity: "toast",
    errorKey: "ORDER_IS_REDUCE_ONLY_CANNOT_OPEN_POSITION",
    condition: (ctx, params) => params.reduceOnly && !ctx.contractPosition,
  },

  // -------------------------------------------------------------------------
  // Size Rules - Direct Input Mode (sizeRatio === 0)
  // -------------------------------------------------------------------------

  // Size basis: empty check (silent - form validation shows error separately)
  {
    id: "size_required",
    field: "size",
    mode: "submit",
    severity: "silent",
    errorKey: "toastInputQty",
    condition: (ctx, params) =>
      params.sizeRatio === 0 &&
      params.orderBasis === OrderBasis.Size &&
      !params.orderSize &&
      // Skip if reduceOnly and no position (matches original early return)
      !(params.reduceOnly && !ctx.contractPosition) &&
      !shouldSkipMinSizeCheck(ctx, params) &&
      shouldValidateSize(ctx, params),
  },

  // Size basis: min size check (includes zero value like "0.0")
  {
    id: "size_min",
    field: "size",
    mode: "submit",
    severity: "form",
    errorKey: "toastInputQtyMin",
    condition: (ctx, params) =>
      params.sizeRatio === 0 &&
      params.orderBasis === OrderBasis.Size &&
      !!params.orderSize &&
      Number(params.orderSize) < Number(ctx.orderLimits.minOrderSize) &&
      // Skip if reduceOnly and no position (matches original early return)
      !(params.reduceOnly && !ctx.contractPosition) &&
      !shouldSkipMinSizeCheck(ctx, params) &&
      shouldValidateSize(ctx, params),
  },

  // Value basis: empty check (silent - form validation shows error separately)
  {
    id: "value_required",
    field: "size",
    mode: "submit",
    severity: "silent",
    errorKey: "toastInputValue",
    condition: (ctx, params) => {
      return (
        params.sizeRatio === 0 &&
        params.orderBasis === OrderBasis.Value &&
        !Number(params.orderValue) &&
        // Skip if reduceOnly and no position (matches original early return)
        !(params.reduceOnly && !ctx.contractPosition) &&
        !shouldSkipMinSizeCheck(ctx, params) &&
        shouldValidateSize(ctx, params)
      );
    },
  },

  // Value basis: min value check
  {
    id: "value_min",
    field: "size",
    mode: "submit",
    severity: "form",
    errorKey: "toastInputValueMin",
    condition: (ctx, params) =>
      params.sizeRatio === 0 &&
      params.orderBasis === OrderBasis.Value &&
      Number(params.orderValue) > 0 &&
      Number(params.orderValue) < Number(ctx.orderLimits.minOrderValue) &&
      // Skip if reduceOnly and no position (matches original early return)
      !(params.reduceOnly && !ctx.contractPosition) &&
      !shouldSkipMinSizeCheck(ctx, params) &&
      shouldValidateSize(ctx, params),
  },

  // Margin basis: empty check (silent - form validation shows error separately)
  {
    id: "margin_required",
    field: "size",
    mode: "submit",
    severity: "silent",
    errorKey: "toastInputMargin",
    condition: (ctx, params) =>
      params.sizeRatio === 0 &&
      params.orderBasis === OrderBasis.Margin &&
      !Number(params.orderMargin) &&
      // Skip if reduceOnly and no position (matches original early return)
      !(params.reduceOnly && !ctx.contractPosition) &&
      !shouldSkipMinSizeCheck(ctx, params) &&
      shouldValidateSize(ctx, params),
  },

  // Margin basis: min margin check
  {
    id: "margin_min",
    field: "size",
    mode: "submit",
    severity: "form",
    errorKey: "toastInputMarginMin",
    condition: (ctx, params) =>
      params.sizeRatio === 0 &&
      params.orderBasis === OrderBasis.Margin &&
      Number(params.orderMargin) > 0 &&
      Number(ctx.orderLimits.minMarginRequirement) > 0 &&
      Number(params.orderMargin) < Number(ctx.orderLimits.minMarginRequirement) &&
      // Skip if reduceOnly and no position (matches original early return)
      !(params.reduceOnly && !ctx.contractPosition) &&
      !shouldSkipMinSizeCheck(ctx, params) &&
      shouldValidateSize(ctx, params),
  },

  // -------------------------------------------------------------------------
  // Size Rules - Ratio Mode (sizeRatio > 0)
  // -------------------------------------------------------------------------

  // Ratio mode: calculated size min check (Size basis)
  {
    id: "ratio_size_min",
    field: "size",
    mode: "submit",
    severity: "form",
    errorKey: "toastInputQtyMin",
    condition: (ctx, params) => {
      if (params.sizeRatio <= 0 || params.orderBasis !== OrderBasis.Size) return false;
      if (!params.maxBuySize || !params.maxSellSize || !params.sizeStep) return false;
      // Skip if reduceOnly and no position (matches original early return)
      if (params.reduceOnly && !ctx.contractPosition) return false;
      if (shouldSkipMinSizeCheck(ctx, params)) return false;

      // Skip if limit order without price
      if (isLimit(params.type) && (!params.price || Number(params.price) === 0)) {
        return false;
      }

      const maxSize = params.side === TYPE_orderSide.BUY ? params.maxBuySize : params.maxSellSize;
      const calculatedSize = calculateSizeFromRatio(
        maxSize,
        params.sizeRatio,
        String(params.sizeStep),
      );

      return Number(calculatedSize) < Number(ctx.orderLimits.minOrderSize);
    },
  },

  // Ratio mode: calculated value min check (Value/Margin basis)
  {
    id: "ratio_value_min",
    field: "size",
    mode: "submit",
    severity: "form",
    errorKey: "toastInputValueMin",
    condition: (ctx, params) => {
      if (params.sizeRatio <= 0 || params.orderBasis === OrderBasis.Size) return false;
      if (!params.maxBuySize || !params.maxSellSize || !params.sizeStep) return false;
      // Skip if reduceOnly and no position (matches original early return)
      if (params.reduceOnly && !ctx.contractPosition) return false;
      if (shouldSkipMinSizeCheck(ctx, params)) return false;

      // Skip if limit order without price
      if (isLimit(params.type) && (!params.price || Number(params.price) === 0)) {
        return false;
      }

      const maxSize = params.side === TYPE_orderSide.BUY ? params.maxBuySize : params.maxSellSize;
      const calculatedSize = calculateSizeFromRatio(
        maxSize,
        params.sizeRatio,
        String(params.sizeStep),
      );
      const calcValue = new BigNumber(ctx.calculationPrice).multipliedBy(calculatedSize).toNumber();

      return calcValue < Number(ctx.orderLimits.minOrderValue);
    },
  },

  // -------------------------------------------------------------------------
  // Cross-check: Size value against min order value (Size basis only)
  // When user inputs size directly, check if size * price meets min value
  // Note: Value/Margin basis have their own min checks (value_min, margin_min)
  // -------------------------------------------------------------------------
  {
    id: "size_value_min",
    field: "size",
    mode: "submit",
    severity: "form",
    errorKey: "toastInputValueMin",
    condition: (ctx, params) => {
      // Only in Direct Input Mode (Ratio Mode would have early returned in original)
      if (params.sizeRatio > 0) return false;
      // Only for Size basis - Value/Margin basis have their own checks
      if (params.orderBasis !== OrderBasis.Size) return false;
      // Skip if reduceOnly and no position (matches original early return)
      if (params.reduceOnly && !ctx.contractPosition) return false;
      // Skip if reduceOnly and same direction position (matches original shouldSkipMinSizeCheck)
      if (shouldSkipMinSizeCheck(ctx, params)) return false;
      if (!params.orderSize || Number(params.orderSize) <= 0) return false;

      const currentValue = new BigNumber(ctx.calculationPrice)
        .multipliedBy(params.orderSize)
        .toNumber();

      return currentValue < Number(ctx.orderLimits.minOrderValue);
    },
  },

  // -------------------------------------------------------------------------
  // Size validation for non-ladder orders (submit only, silent)
  // -------------------------------------------------------------------------
  {
    id: "size_empty_silent",
    field: "size",
    mode: "submit",
    severity: "silent",
    errorKey: "invalidSize",
    condition: (ctx, params) => {
      // Skip for ladder orders (they have their own validation)

      if (params.type === OrderType.LADDER_ORDERS) return false;
      if (params.sizeRatio > 0) return false;
      return !params.orderSize || Number(params.orderSize) === 0;
    },
  },

  {
    id: "size_below_min_silent",
    field: "size",
    mode: "submit",
    severity: "silent",
    errorKey: "sizeTooSmall",
    condition: (ctx, params) => {
      // Skip for ladder orders
      if (params.type === OrderType.LADDER_ORDERS) return false;
      if (!params.orderSize || Number(params.orderSize) === 0) return false;

      const minOrderSize = Number(ctx.orderLimits.minOrderSize) || 0;
      if (minOrderSize <= 0) return false;

      // Check if should skip min size check for reduce-only
      if (shouldSkipMinSizeCheck(ctx, params)) return false;

      return Number(params.orderSize) < minOrderSize;
    },
  },

  // -------------------------------------------------------------------------
  // TP/SL Rules (submit only)
  // -------------------------------------------------------------------------
  {
    id: "tpsl_side_mismatch",
    field: "tpsl",
    mode: "submit",
    severity: "form",
    errorKey: "openPositionTpOSlTips",
    condition: (ctx, params) => {
      if (!params.tpOSlSide) return false;
      if (!params.tpTriggerPrice && !params.slTriggerPrice) return false;
      return params.tpOSlSide !== params.side;
    },
  },

  // Simple TP price validation (without tpOSlSide)
  {
    id: "tp_price_invalid_simple",
    field: "tpTriggerPrice",
    mode: "submit",
    severity: "silent",
    errorKey: "invalidTpPrice",
    condition: (ctx, params) => {
      if (!params.tpsl || !params.price || params.tpOSlSide) return false;
      if (!params.tpTriggerPrice || Number(params.tpTriggerPrice) <= 0) return false;

      const entryPrice = Number(params.price);
      const isLong = params.side === TYPE_orderSide.BUY;
      const tp = Number(params.tpTriggerPrice);

      return isLong ? tp <= entryPrice : tp >= entryPrice;
    },
  },

  // Simple SL price validation (without tpOSlSide)
  {
    id: "sl_price_invalid_simple",
    field: "slTriggerPrice",
    mode: "submit",
    severity: "silent",
    errorKey: "invalidSlPrice",
    condition: (ctx, params) => {
      if (!params.tpsl || !params.price || params.tpOSlSide) return false;
      if (!params.slTriggerPrice || Number(params.slTriggerPrice) <= 0) return false;

      const entryPrice = Number(params.price);
      const isLong = params.side === TYPE_orderSide.BUY;
      const sl = Number(params.slTriggerPrice);

      return isLong ? sl >= entryPrice : sl <= entryPrice;
    },
  },

  // Deep TP validation - condition 1 requires tpOSlSide, condition 2 does not
  // Original logic: (isLimit && tpOSlSide === BUY && tp <= compare) || (side === SELL && tp >= compare)
  {
    id: "tp_price_invalid_deep",
    field: "tpTriggerPrice",
    mode: "submit",
    severity: "form",
    errorKey: "tpPriceLessTips.tpOSl",
    condition: (ctx, params) => {
      if (!params.tpTriggerPrice || Number(params.tpTriggerPrice) <= 0) return false;

      const tp = Number(params.tpTriggerPrice);
      const isLimitType = isLimit(params.type);

      let comparePrice = 0;
      if (isLimitType) {
        comparePrice = Number(params.price);
      } else {
        comparePrice = Number(params.triggerPriceWithType || 0);
      }

      if (comparePrice <= 0) return false;

      // Original logic: (isLimit && tpOSlSide === BUY && tp <= compare) || (side === SELL && tp >= compare)
      if (isLimitType && params.tpOSlSide === TYPE_orderSide.BUY && tp <= comparePrice) {
        return true;
      }
      if (params.side === TYPE_orderSide.SELL && tp >= comparePrice) {
        return true;
      }

      return false;
    },
    getErrorKey: (ctx, params) => {
      const tp = Number(params.tpTriggerPrice);
      const comparePrice = isLimit(params.type)
        ? Number(params.price)
        : Number(params.triggerPriceWithType || 0);
      const isLess = params.side === TYPE_orderSide.BUY && tp <= comparePrice;
      return isLess ? "tpPriceLessTips.tpOSl" : "tpPriceMoreTips.tpOSl";
    },
  },

  // Deep SL validation - condition 1 requires isLimit, condition 2 does not
  // Original logic: (isLimit && side === BUY && sl >= compare) || (side === SELL && sl <= compare)
  {
    id: "sl_price_invalid_deep",
    field: "slTriggerPrice",
    mode: "submit",
    severity: "form",
    errorKey: "slPriceMoreTips.tpOSl",
    condition: (ctx, params) => {
      if (!params.slTriggerPrice || Number(params.slTriggerPrice) <= 0) return false;

      const sl = Number(params.slTriggerPrice);
      const isLimitType = isLimit(params.type);

      let comparePrice = 0;
      if (isLimitType) {
        comparePrice = Number(params.price);
      } else {
        comparePrice = Number(params.triggerPriceWithType || 0);
      }

      if (comparePrice <= 0) return false;

      // Original logic: (isLimit && side === BUY && sl >= compare) || (side === SELL && sl <= compare)
      if (isLimitType && params.side === TYPE_orderSide.BUY && sl >= comparePrice) {
        return true;
      }
      if (params.side === TYPE_orderSide.SELL && sl <= comparePrice) {
        return true;
      }

      return false;
    },
    getErrorKey: (ctx, params) => {
      const sl = Number(params.slTriggerPrice);
      const comparePrice = isLimit(params.type)
        ? Number(params.price)
        : Number(params.triggerPriceWithType || 0);
      const isMore = params.side === TYPE_orderSide.BUY && sl >= comparePrice;
      return isMore ? "slPriceMoreTips.tpOSl" : "slPriceLessTips.tpOSl";
    },
  },

  // -------------------------------------------------------------------------
  // Ladder Order Rules
  // -------------------------------------------------------------------------
  ...LADDER_ORDER_VALIDATION_RULES,
];

// ============================================================================
// Validation Engine
// ============================================================================

/**
 * Execute validation rules
 */
export function validateOrder(
  context: OrderFormValidationContext,
  params: OrderFormValidationParams,
  mode: "realtime" | "submit",
): OrderFormValidationResult {
  const errors: FieldValidationError[] = [];

  for (const rule of ORDER_VALIDATION_RULES) {
    // Check if rule applies to current mode
    if (rule.mode !== "all" && rule.mode !== mode) {
      continue;
    }

    // Execute condition
    if (rule.condition(context, params)) {
      const errorKey = rule.getErrorKey ? rule.getErrorKey(context, params) : rule.errorKey;
      const errorParams = rule.getErrorParams ? rule.getErrorParams(context, params) : undefined;

      errors.push({
        ruleId: rule.id,
        field: rule.field,
        errorKey,
        errorParams,
        severity: rule.severity,
      });
    }
  }

  // Build result with convenience accessors
  const triggerPriceError = errors.find((e) => e.field === "triggerPrice") || null;
  const priceError = errors.find((e) => e.field === "price") || null;
  const sizeError = errors.find((e) => e.field === "size") || null;
  const ladderOrderMinPriceError = errors.find((e) => e.field === "ladderOrderMinPrice") || null;
  const ladderOrderMaxPriceError = errors.find((e) => e.field === "ladderOrderMaxPrice") || null;
  const ladderOrderCountError = errors.find((e) => e.field === "ladderOrderCount") || null;
  const ladderOrderSizeError = errors.find((e) => e.field === "ladderOrderSize") || null;
  const ladderOrderMinPriceLessThanMaxPriceError =
    errors.find((e) => e.ruleId === "ladder_order_min_price_is_less_than_max_price") || null;
  const ladderOrderSizeMinRequirementError =
    errors.find((e) => e.ruleId === "ladder_order_size_min") || null;

  return {
    isValid: errors.length === 0,
    errors,
    triggerPriceError,
    priceError,
    sizeError,
    ladderOrderMinPriceError,
    ladderOrderMaxPriceError,
    ladderOrderCountError,
    ladderOrderSizeError,
    ladderOrderMinPriceLessThanMaxPriceError,
    ladderOrderSizeMinRequirementError,
  };
}
