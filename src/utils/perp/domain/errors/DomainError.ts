/**
 * 领域错误基类
 * Domain Error Base Class
 *
 * 所有领域错误都应该继承此类
 */

/**
 * 领域错误基类
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;

    // 保持正确的原型链
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * 验证错误
 * 当输入数据不符合业务规则时抛出
 */
export class ValidationError extends DomainError {
  constructor(message: string, public readonly field?: string, public readonly value?: unknown) {
    super(message);
  }
}

/**
 * 业务规则错误
 * 当违反业务规则时抛出
 */
export class BusinessRuleError extends DomainError {
  constructor(message: string, public readonly rule?: string) {
    super(message);
  }
}

/**
 * 实体未找到错误
 * 当查询的实体不存在时抛出
 */
export class EntityNotFoundError extends DomainError {
  constructor(public readonly entityName: string, public readonly identifier: string | number) {
    super(`${entityName} with identifier ${identifier} not found`);
  }
}

/**
 * 余额不足错误
 * 当用户余额不足时抛出
 */
export class InsufficientBalanceError extends DomainError {
  constructor(
    public readonly required: string,
    public readonly available: string,
    public readonly asset: string,
  ) {
    super(`Insufficient ${asset} balance. Required: ${required}, Available: ${available}`);
  }
}

/**
 * 保证金不足错误
 * 当用户保证金不足时抛出
 */
export class InsufficientMarginError extends DomainError {
  constructor(public readonly required: string, public readonly available: string) {
    super(`Insufficient margin. Required: ${required}, Available: ${available}`);
  }
}

/**
 * 滑点超限错误
 * 当价格滑点超过用户设置时抛出
 */
export class SlippageExceededError extends DomainError {
  constructor(
    public readonly expected: string,
    public readonly actual: string,
    public readonly slippage: string,
  ) {
    super(
      `Slippage exceeded. Expected: ${expected}, Actual: ${actual}, Max slippage: ${slippage}%`,
    );
  }
}

/**
 * 价格超限错误
 * 当订单价格超出限制时抛出
 */
export class PriceOutOfRangeError extends DomainError {
  constructor(
    public readonly price: string,
    public readonly minPrice: string,
    public readonly maxPrice: string,
  ) {
    super(`Price ${price} is out of range [${minPrice}, ${maxPrice}]`);
  }
}

/**
 * 数量超限错误
 * 当订单数量超出限制时抛出
 */
export class SizeOutOfRangeError extends DomainError {
  constructor(
    public readonly size: string,
    public readonly minSize: string,
    public readonly maxSize: string,
  ) {
    super(`Size ${size} is out of range [${minSize}, ${maxSize}]`);
  }
}

/**
 * 强平风险错误
 * 当操作会导致强平时抛出
 */
export class LiquidationRiskError extends DomainError {
  constructor(public readonly currentPrice: string, public readonly liquidationPrice: string) {
    super(
      `Liquidation risk: current price ${currentPrice} is too close to liquidation price ${liquidationPrice}`,
    );
  }
}

/**
 * 订单状态错误
 * 当订单状态不允许操作时抛出
 */
export class InvalidOrderStatusError extends DomainError {
  constructor(
    public readonly currentStatus: string,
    public readonly requiredStatus: string,
    public readonly operation: string,
  ) {
    super(`Cannot ${operation} order in ${currentStatus} status. Required: ${requiredStatus}`);
  }
}

/**
 * 持仓不存在错误
 * 当尝试操作不存在的持仓时抛出
 */
export class PositionNotFoundError extends DomainError {
  constructor(public readonly symbol: string, public readonly side: string) {
    super(`Position not found: ${symbol} ${side}`);
  }
}

/**
 * 仓位超限错误
 * 当持仓数量超过最大限制时抛出
 */
export class PositionSizeExceededError extends DomainError {
  constructor(
    public readonly currentSize: string,
    public readonly maxSize: string,
    public readonly symbol: string,
  ) {
    super(`Position size ${currentSize} exceeds maximum ${maxSize} for ${symbol}`);
  }
}

/**
 * 杠杆超限错误
 * 当杠杆倍数超过限制时抛出
 */
export class LeverageExceededError extends DomainError {
  constructor(public readonly leverage: number, public readonly maxLeverage: number) {
    super(`Leverage ${leverage}x exceeds maximum ${maxLeverage}x`);
  }
}

/**
 * 交易未启用错误
 * 当合约交易未启用时抛出
 */
export class TradingDisabledError extends DomainError {
  constructor(public readonly symbol: string) {
    super(`Trading is disabled for ${symbol}`);
  }
}

/**
 * 开仓未启用错误
 * 当合约开仓未启用时抛出
 */
export class OpenPositionDisabledError extends DomainError {
  constructor(public readonly symbol: string) {
    super(`Opening position is disabled for ${symbol}`);
  }
}

/**
 * 网络错误
 * 当网络请求失败时抛出
 */
export class NetworkError extends DomainError {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly endpoint?: string,
  ) {
    super(message);
  }
}

/**
 * 未授权错误
 * 当用户未授权操作时抛出
 */
export class UnauthorizedError extends DomainError {
  constructor(message: string = "Unauthorized operation") {
    super(message);
  }
}

/**
 * 配置错误
 * 当配置不正确时抛出
 */
export class ConfigurationError extends DomainError {
  constructor(message: string, public readonly configKey?: string) {
    super(message);
  }
}

/**
 * 订单价值计算错误
 * 当无法计算订单价值时抛出（如市价单缺少当前价格）
 */
export class OrderValueCalculationError extends DomainError {
  constructor(
    public readonly orderType: string,
    public readonly reason: string = "Cannot calculate value for market order without current price",
  ) {
    super(reason);
  }
}
