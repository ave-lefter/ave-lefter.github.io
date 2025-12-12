/**
 * Domain Layer - 领域层
 *
 * 导出所有领域模型（Value Objects, Entities, Aggregate Roots, Errors, Constants）
 */

// ============================================================================
// Value Objects
// ============================================================================

export { Leverage } from "./value-objects/Leverage";
export {
  OrderSide,
  OrderType,
  OrderStatus,
  PositionSide,
  TriggerPriceType,
  TimeInForce,
  TradeType,
  isConditionalOrder,
  isMarketOrder,
  isLimitOrder,
  isTerminalStatus,
  isCancelable,
  getOppositeSide,
  getOppositePositionSide,
  orderSideToPositionSide,
  positionSideToCloseSide,
} from "./value-objects/OrderEnums";

// ============================================================================
// Constants
// ============================================================================

export * from "./constants";

// ============================================================================
// Entities
// ============================================================================

export * from "./entities/Position";
export * from "./entities/TradeHistory";
export { Depth as DepthBook, DepthLevel } from "./entities/Depth";
export * from "./entities/Trade";
export * from "./entities/Ticker";
export * from "./entities/Candle";
export * from "./entities/AccountSnapshot";
export * from "./entities/OrderUpdate";

export * from "./entities/Order";
export * from "./entities/PositionTerm";
export * from "./entities/PositionTransaction";
export * from "./entities/FundingFee";
export * from "./entities/FilledOrder";
export * from "./entities/Orderbook";

// ============================================================================
// Domain Errors
// ============================================================================

export {
  DomainError,
  ValidationError,
  BusinessRuleError,
  EntityNotFoundError,
  InsufficientMarginError,
  PriceOutOfRangeError,
  SizeOutOfRangeError,
  LiquidationRiskError,
  InvalidOrderStatusError,
  PositionNotFoundError,
  PositionSizeExceededError,
  LeverageExceededError,
  TradingDisabledError,
  OpenPositionDisabledError,
  OrderValueCalculationError,
} from "./errors/DomainError";

export * from "./constants";
export * from "./value-objects";
export * from "./services";
