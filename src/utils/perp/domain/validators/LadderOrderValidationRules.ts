/**
 * Ladder Order Validation Rules
 *
 * Validation rules specific to ladder orders (分段订单).
 * These rules validate ladder order specific fields and constraints.
 */

import { LadderOrderCalculator } from "../services/LadderOrderCalculator";
import { OrderTypeHelper } from "../utils";
import { LadderOrderDistributionMode, OrderBasis, OrderType } from "../value-objects/OrderEnums";
import type {
  OrderFormValidationContext,
  OrderFormValidationParams,
  ValidationRule,
} from "./OrderValidationSchema";

// ============================================================================
// Constants
// ============================================================================

/** Minimum price must be greater than oracle price * this ratio */
const LADDER_MIN_PRICE_ORACLE_RATIO = 0.2;

/** Maximum price must be less than oracle price * this ratio */
const LADDER_MAX_PRICE_ORACLE_RATIO = 5;

// ============================================================================
// Ladder Order Validation Rules
// ============================================================================

export const LADDER_ORDER_VALIDATION_RULES: ValidationRule[] = [
  // -------------------------------------------------------------------------
  // Ladder Order Size Min Requirement
  // -------------------------------------------------------------------------
  {
    id: "ladder_order_min_price_is_required",
    field: "ladderOrderMinPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMinPrice",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderMinPrice || Number(params.ladderMinPrice) === 0) return true;
      return false;
    },
  },
  {
    id: "ladder_order_max_price_is_required",
    field: "ladderOrderMaxPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMaxPrice",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderMaxPrice || Number(params.ladderMaxPrice) === 0) return true;
      return false;
    },
  },
  {
    id: "ladder_order_count_is_required",
    field: "ladderOrderCount",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderOrderCount",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderOrderCount || Number(params.ladderOrderCount) === 0) return true;
      return false;
    },
  },
  // Min price must be greater than oracle price * LADDER_MIN_PRICE_ORACLE_RATIO
  {
    id: "ladder_order_min_price_below_oracle_limit",
    field: "ladderOrderMinPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMinPriceGreaterThanOracle",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderMinPrice || Number(params.ladderMinPrice) === 0) return false;

      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      if (oraclePrice <= 0) return false;

      const minPriceNum = Number(params.ladderMinPrice);
      const minAllowedPrice = oraclePrice * LADDER_MIN_PRICE_ORACLE_RATIO;

      return minPriceNum <= minAllowedPrice;
    },
    getErrorParams: (ctx) => {
      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      const pricePrecision = ctx.symbolInfo?.pricePrecision || ctx.symbolEntity?.pricePrecision || 2;
      return {
        minLimit: (oraclePrice * LADDER_MIN_PRICE_ORACLE_RATIO).toFixed(pricePrecision),
        unit: ctx.symbolInfo?.quoteCoin || ctx.symbolEntity?.quoteCoin,
      };
    },
  },

  // Min price must be greater than oracle price * (1 - takerLimitRatio)
  {
    id: "ladder_order_min_price_below_taker_limit",
    field: "ladderOrderMinPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMinPriceGreaterThanOracleWithTakerLimit",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderMinPrice || Number(params.ladderMinPrice) === 0) return false;

      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      if (oraclePrice <= 0) return false;

      const takerLimitRatio = Number(ctx.symbolInfo?.minOrderSellPriceRatio || 0);
      if (takerLimitRatio <= 0) return false;

      const minPriceNum = Number(params.ladderMinPrice);
      const oraclePriceWithTakerLimit = oraclePrice * (1 - takerLimitRatio);

      return minPriceNum <= oraclePriceWithTakerLimit;
    },
    getErrorParams: (ctx, params) => {
      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      const takerLimitRatio = Number(ctx.symbolInfo?.minOrderSellPriceRatio || 0);
      const pricePrecision = ctx.symbolInfo?.pricePrecision || ctx.symbolEntity?.pricePrecision || 2;
      return {
        minLimit: (oraclePrice * (1 - takerLimitRatio)).toFixed(pricePrecision),
        unit: ctx.symbolInfo?.quoteCoin || ctx.symbolEntity?.quoteCoin,
      };
    },
  },

  // Max price must be less than oracle price * (1 + takerLimitRatio)
  {
    id: "ladder_order_max_price_above_taker_limit",
    field: "ladderOrderMaxPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMaxPriceLessThanOracleWithTakerLimit",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderMaxPrice || Number(params.ladderMaxPrice) === 0) return false;

      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      if (oraclePrice <= 0) return false;

      const takerLimitRatio = Number(ctx.symbolInfo?.maxOrderBuyPriceRatio || 0);
      if (takerLimitRatio <= 0) return false;

      const maxPriceNum = Number(params.ladderMaxPrice);
      const oraclePriceWithTakerLimit = oraclePrice * (1 + takerLimitRatio);

      return maxPriceNum >= oraclePriceWithTakerLimit;
    },
    getErrorParams: (ctx, params) => {
      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      const takerLimitRatio = Number(ctx.symbolInfo?.maxOrderBuyPriceRatio || 0);
      const pricePrecision = ctx.symbolInfo?.pricePrecision || ctx.symbolEntity?.pricePrecision || 2;
      return {
        maxLimit: (oraclePrice * (1 + takerLimitRatio)).toFixed(pricePrecision),
        unit: ctx.symbolInfo?.quoteCoin || ctx.symbolEntity?.quoteCoin,
      };
    },
  },

  // Max price must be less than oracle price * LADDER_MAX_PRICE_ORACLE_RATIO
  {
    id: "ladder_order_max_price_above_oracle_limit",
    field: "ladderOrderMaxPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMaxPriceLessThanOracle",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderMaxPrice || Number(params.ladderMaxPrice) === 0) return false;

      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      if (oraclePrice <= 0) return false;

      const maxPriceNum = Number(params.ladderMaxPrice);
      const maxAllowedPrice = oraclePrice * LADDER_MAX_PRICE_ORACLE_RATIO;

      return maxPriceNum >= maxAllowedPrice;
    },
    getErrorParams: (ctx) => {
      const oraclePrice = Number(ctx.marketData?.oraclePrice || 0);
      const pricePrecision = ctx.symbolInfo?.pricePrecision || ctx.symbolEntity?.pricePrecision || 2;
      return {
        maxLimit: (oraclePrice * LADDER_MAX_PRICE_ORACLE_RATIO).toFixed(pricePrecision),
        unit: ctx.symbolInfo?.quoteCoin || ctx.symbolEntity?.quoteCoin,
      };
    },
  },

  // Min price must be less than max price
  {
    id: "ladder_order_min_price_is_less_than_max_price",
    field: "ladderOrderMinPrice",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderMinPriceLessThanMax",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      // Only validate when both prices have valid values
      if (!params.ladderMinPrice || Number(params.ladderMinPrice) <= 0) return false;
      if (!params.ladderMaxPrice || Number(params.ladderMaxPrice) <= 0) return false;

      return Number(params.ladderMinPrice) >= Number(params.ladderMaxPrice);
    },
  },
  {
    id: "ladder_order_size_is_required",
    field: "ladderOrderSize",
    mode: "submit",
    severity: "toast",
    errorKey: "toastInputLadderTotalSize",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.orderSize || Number(params.orderSize) === 0) return true;
      return false;
    },
  },
  {
    id: "ladder_order_size_min_submit",
    field: "ladderOrderSize",
    mode: "submit",
    severity: "toast",
    errorKey: "ladderOrderSizeMin",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!ctx.symbolEntity) return false;
      if (!params.ladderMinPrice || !params.ladderMaxPrice || !params.ladderOrderCount)
        return false;

      // 计算最小下单要求
      const userInput = params.orderBasis === OrderBasis.Size ? params.orderSize : params.orderValue;
      if (!userInput || Number(userInput) <= 0) return false;
      const minRequirement = LadderOrderCalculator.calculateMinOrderSizeRequirement({
        orderCount: Number(params.ladderOrderCount || 0),
        distributionMode: params.ladderOrderDistributionMode || LadderOrderDistributionMode.EQUAL,
        orderBasis: params.orderBasis,
        symbol: ctx.symbolEntity,
        minPrice: params.ladderMinPrice,
        maxPrice: params.ladderMaxPrice,
      });

      // 如果无法计算最小要求，跳过验证
      if (minRequirement === null) return false;

      // 比较用户输入与最小要求
      return Number(userInput) <= Number(minRequirement);
    },
    getErrorParams: (ctx, params) => {
      const minRequirement = LadderOrderCalculator.calculateMinOrderSizeRequirement({
        orderCount: Number(params.ladderOrderCount || 0),
        distributionMode: params.ladderOrderDistributionMode || LadderOrderDistributionMode.EQUAL,
        orderBasis: params.orderBasis,
        symbol: ctx.symbolEntity,
        minPrice: params.ladderMinPrice,
        maxPrice: params.ladderMaxPrice,
      });

      return {
        ladderMinTotalQty: minRequirement || "0",
        unit:
          params.orderBasis === OrderBasis.Size
            ? ctx.symbolEntity.baseCoin
            : ctx.symbolEntity.quoteCoin,
      };
    },
  },
  {
    id: "ladder_order_size_min",
    field: "ladderOrderSize",
    mode: "realtime",
    severity: "form",
    errorKey: "ladderOrderSizeMin",
    condition: (ctx: OrderFormValidationContext, params: OrderFormValidationParams) => {
      const isLadderOrder = OrderTypeHelper.isLadderOrders(params.type as OrderType);
      if (!isLadderOrder) return false;
      if (!params.ladderSizeBlurred) return false;
      if (!ctx.symbolEntity) return false;
      if (!params.ladderMinPrice || !params.ladderMaxPrice || !params.ladderOrderCount)
        return false;

      // 计算最小下单要求
      const userInput = params.orderBasis === OrderBasis.Size ? params.orderSize : params.orderValue;
      if (!userInput || Number(userInput) <= 0) return false;
      const minRequirement = LadderOrderCalculator.calculateMinOrderSizeRequirement({
        orderCount: Number(params.ladderOrderCount || 0),
        distributionMode: params.ladderOrderDistributionMode || LadderOrderDistributionMode.EQUAL,
        orderBasis: params.orderBasis,
        symbol: ctx.symbolEntity,
        minPrice: params.ladderMinPrice,
        maxPrice: params.ladderMaxPrice,
      });

      // 如果无法计算最小要求，跳过验证
      if (minRequirement === null) return false;

      // 比较用户输入与最小要求
      return Number(userInput) <= Number(minRequirement);
    },
    getErrorParams: (ctx, params) => {
      const minRequirement = LadderOrderCalculator.calculateMinOrderSizeRequirement({
        orderCount: Number(params.ladderOrderCount || 0),
        distributionMode: params.ladderOrderDistributionMode || LadderOrderDistributionMode.EQUAL,
        orderBasis: params.orderBasis,
        symbol: ctx.symbolEntity,
        minPrice: params.ladderMinPrice,
        maxPrice: params.ladderMaxPrice,
      });

      return {
        ladderMinTotalQty: minRequirement || "0",
        unit:
          params.orderBasis === OrderBasis.Size
            ? ctx.symbolEntity.baseCoin
            : ctx.symbolEntity.quoteCoin,
      };
    },
  },
];
