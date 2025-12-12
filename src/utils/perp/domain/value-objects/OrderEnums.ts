/**
 * 领域值对象：订单相关枚举
 * Domain Value Objects: Order Enums
 *
 * 定义订单相关的枚举类型
 */

/**
 * 订单方向
 */
export enum OrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

/**
 * 订单类型
 */
export enum OrderType {
  /** 市价单 */
  MARKET = "MARKET",
  /** 限价单 */
  LIMIT = "LIMIT",
  /** 止损市价单 */
  STOP_MARKET = "STOP_MARKET",
  /** 止损限价单 */
  STOP_LIMIT = "STOP_LIMIT",
  /** 止盈市价单 */
  TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
  /** 止盈限价单 */
  TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
}

/**
 * 订单状态
 */
export enum OrderStatus {
  /** 待提交 */
  PENDING = "PENDING",
  /** 条件单未触发 */
  UNTRIGGERED = "UNTRIGGERED",
  /** 已提交，部分成交或未成交 */
  OPEN = "OPEN",
  /** 取消中 */
  CANCELING = "CANCELING",
  /** 执行中 */
  EXECUTING = "EXECUTING",
  /** 完全成交 */
  FILLED = "FILLED",
  /** 已取消 */
  CANCELED = "CANCELED",
  /** 失败 */
  FAILED = "FAILED",
  INTERNAL_FAILED = "INTERNAL_FAILED",
}

/**
 * 触发价格类型
 */
export enum TriggerPriceType {
  /** 最新价 */
  LAST_PRICE = "LAST_PRICE",
  /** 预言机价格 */
  ORACLE_PRICE = "ORACLE_PRICE",
  /** 指数价格 */
  INDEX_PRICE = "INDEX_PRICE",
}

/**
 * 有效期类型
 */
export enum TimeInForce {
  /** 一直有效直到取消 */
  GOOD_TIL_CANCEL = "GOOD_TIL_CANCEL",
  /** 立即成交或取消 */
  IMMEDIATE_OR_CANCEL = "IMMEDIATE_OR_CANCEL",
  /** 全部成交或取消 */
  FILL_OR_KILL = "FILL_OR_KILL",
  POST_ONLY = "POST_ONLY",
}

/**
 * 持仓方向
 */
export enum PositionSide {
  /** 多头 */
  LONG = "LONG",
  /** 空头 */
  SHORT = "SHORT",
}

/**
 * 交易类型
 */
export enum TradeType {
  /** 开仓 */
  OPEN = "OPEN",
  /** 平仓 */
  CLOSE = "CLOSE",
  /** 强平 */
  LIQUIDATE = "LIQUIDATE",
}

/**
 * 工具函数：判断是否为条件订单
 */
export function isConditionalOrder(type: OrderType): boolean {
  return [
    OrderType.STOP_MARKET,
    OrderType.STOP_LIMIT,
    OrderType.TAKE_PROFIT_MARKET,
    OrderType.TAKE_PROFIT_LIMIT,
  ].includes(type);
}

/**
 * 工具函数：判断是否为市价单
 */
export function isMarketOrder(type: OrderType): boolean {
  return [OrderType.MARKET, OrderType.STOP_MARKET, OrderType.TAKE_PROFIT_MARKET].includes(type);
}

/**
 * 工具函数：判断是否为限价单
 */
export function isLimitOrder(type: OrderType): boolean {
  return [OrderType.LIMIT, OrderType.STOP_LIMIT, OrderType.TAKE_PROFIT_LIMIT].includes(type);
}

/**
 * 工具函数：判断订单是否为终态
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return [OrderStatus.FILLED, OrderStatus.CANCELED, OrderStatus.FAILED].includes(status);
}

/**
 * 工具函数：判断订单是否可以取消
 */
export function isCancelable(status: OrderStatus): boolean {
  return [OrderStatus.OPEN, OrderStatus.UNTRIGGERED].includes(status);
}

/**
 * 工具函数：获取相反的订单方向
 */
export function getOppositeSide(side: OrderSide): OrderSide {
  return side === OrderSide.BUY ? OrderSide.SELL : OrderSide.BUY;
}

/**
 * 工具函数：获取相反的持仓方向
 */
export function getOppositePositionSide(side: PositionSide): PositionSide {
  return side === PositionSide.LONG ? PositionSide.SHORT : PositionSide.LONG;
}

/**
 * 工具函数：订单方向转持仓方向
 */
export function orderSideToPositionSide(side: OrderSide): PositionSide {
  return side === OrderSide.BUY ? PositionSide.LONG : PositionSide.SHORT;
}

/**
 * 工具函数：持仓方向转订单方向（平仓）
 */
export function positionSideToCloseSide(side: PositionSide): OrderSide {
  return side === PositionSide.LONG ? OrderSide.SELL : OrderSide.BUY;
}
