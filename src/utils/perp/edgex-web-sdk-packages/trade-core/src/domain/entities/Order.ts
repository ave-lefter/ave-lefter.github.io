/**
 * Order 聚合根（充血模型）- 重新设计版本
 * Order Aggregate Root (Rich Model) - Redesigned
 *
 * DDD 原则：
 * 1. Order 是聚合根，维护订单的一致性边界
 * 2. Order 引用 Symbol 聚合根，不复制数据
 * 3. Order 封装所有订单相关的业务逻辑和规则
 *
 * 职责：
 * - 封装订单状态转换
 * - 验证订单参数和业务规则
 * - 计算订单相关数值（价值、保证金、手续费等）
 * - 判断订单状态和类型
 */

import BigNumber from "bignumber.js";
import type { IContract as ISymbol } from "@edgex/types";
import type { OrderEntry } from "@edgex/types";
import { OrderValueCalculationError } from "../errors/DomainError";
import {
  isCancelable,
  isConditionalOrder,
  isLimitOrder,
  isMarketOrder,
  isTerminalStatus,
  OrderSide,
  OrderStatus,
  OrderType,
  TimeInForce,
  TriggerPriceType,
} from "../value-objects/OrderEnums";

/**
 * Order 聚合根（充血模型）
 *
 * 封装订单的所有业务逻辑和状态转换
 */
export class Order {
  private constructor(
    public symbol: ISymbol,
    public raw: OrderEntry,
  ) {}

  static fromRaw(symbol: ISymbol, raw: OrderEntry) {
    return new Order(symbol, raw);
  }

  /**
   * 判断订单是否可以取消
   *
   * 业务规则：只有 OPEN 和 UNTRIGGERED 状态的订单可以取消
   */
  canCancel(): boolean {
    return isCancelable(this.status as OrderStatus);
  }

  /**
   * 判断是否为活跃订单
   *
   * 业务规则：PENDING, OPEN, CANCELING 状态的订单是活跃订单
   */
  isActive(): boolean {
    const activeStatuses = [OrderStatus.PENDING, OrderStatus.OPEN, OrderStatus.CANCELING];
    return activeStatuses.includes(this.status as OrderStatus);
  }

  /**
   * 判断是否为条件单（未触发）
   *
   * 业务规则：UNTRIGGERED 状态的订单是条件单
   */
  isConditional(): boolean {
    return this.status === OrderStatus.UNTRIGGERED;
  }

  /**
   * 判断是否已完成（终态）
   *
   * 业务规则：FILLED, CANCELED, FAILED 状态的订单是终态
   */
  isCompleted(): boolean {
    return isTerminalStatus(this.status as OrderStatus);
  }

  /**
   * 判断是否已成交
   */
  isFilled(): boolean {
    return this.status === OrderStatus.FILLED;
  }

  /**
   * 判断是否已取消
   */
  isCanceled(): boolean {
    return this.status === OrderStatus.CANCELED;
  }

  /**
   * 判断是否失败
   */
  isFailed(): boolean {
    return this.status === OrderStatus.FAILED || this.status === OrderStatus.INTERNAL_FAILED;
  }

  // ============================================================================
  // 业务方法：类型判断
  // ============================================================================

  /**
   * 判断是否为市价单
   */
  isMarketOrder(): boolean {
    return isMarketOrder(this.type as OrderType);
  }

  /**
   * 判断是否为限价单
   */
  isLimitOrder(): boolean {
    return isLimitOrder(this.type as OrderType);
  }

  /**
   * 判断是否为条件单类型
   */
  isConditionalOrder(): boolean {
    return isConditionalOrder(this.type as OrderType);
  }

  /**
   * 判断是否为止损单
   */
  isStopOrder(): boolean {
    return this.type === OrderType.STOP_MARKET || this.type === OrderType.STOP_LIMIT;
  }

  /**
   * 判断是否为止盈单
   */
  isTakeProfitOrder(): boolean {
    return this.type === OrderType.TAKE_PROFIT_MARKET || this.type === OrderType.TAKE_PROFIT_LIMIT;
  }

  /**
   * 判断是否为买单
   */
  isBuyOrder(): boolean {
    return this.side === OrderSide.BUY;
  }

  /**
   * 判断是否为卖单
   */
  isSellOrder(): boolean {
    return this.side === OrderSide.SELL;
  }

  /**
   * 判断是否为止盈止损单
   */
  isTpslOrder(): boolean {
    return this.raw.isPositionTpsl ?? false;
  }

  /**
   * 判断是否为强平单
   */
  isLiquidateOrder(): boolean {
    return this.raw.isLiquidate ?? false;
  }

  /**
   * 判断是否为减仓单
   */
  isDeleverageOrder(): boolean {
    return this.raw.isDeleverage ?? false;
  }

  /**
   * 判断是否为只减仓单
   */
  isReduceOnly(): boolean {
    return this.raw.reduceOnly ?? false;
  }

  /**
   * 判断是否为 Post-Only 订单
   */
  isPostOnly(): boolean {
    return this.timeInForce === TimeInForce.POST_ONLY;
  }

  // ============================================================================
  // 业务方法：计算
  // ============================================================================

  /**
   * 计算订单价值（价格 × 数量）
   *
   * @returns 订单价值 (BigNumber)
   */
  calculateValue(): BigNumber {
    if (!this.price || this.price === "0") {
      // 市价单使用市场价计算（需要外部提供当前价格）
      throw new OrderValueCalculationError(
        this.type,
        "Cannot calculate value for market order without current price",
      );
    }

    const price = new BigNumber(this.price);
    const size = new BigNumber(this.size);

    return price.multipliedBy(size);
  }

  // ============================================================================
  // 基本属性 Getters
  // ============================================================================

  /** 订单 ID */
  get id(): string {
    return this.raw.id;
  }

  /** 用户 ID */
  get userId(): string {
    return this.raw.userId;
  }

  /** 账户 ID */
  get accountId(): string {
    return this.raw.accountId;
  }

  /** 合约 ID */
  get contractId(): string {
    return this.raw.contractId;
  }

  /** 币种 ID */
  get coinId(): string | undefined {
    return this.raw.coinId;
  }

  /** 订单方向 */
  get side(): OrderSide {
    return this.raw.side as OrderSide;
  }

  /** 订单类型 */
  get type(): OrderType {
    return this.raw.type as OrderType;
  }

  /** 订单状态 */
  get status(): OrderStatus {
    return this.raw.status as OrderStatus;
  }

  /** 订单价格（限价单） */
  get price(): string | undefined {
    return this.raw.price && this.raw.price !== "0" ? this.raw.price : undefined;
  }

  /** 订单数量 */
  get size(): string {
    return this.raw.size;
  }

  /** 客户端订单 ID */
  get clientOrderId(): string | undefined {
    return this.raw.clientOrderId;
  }

  /** 有效期类型 */
  get timeInForce(): TimeInForce {
    return (this.raw.timeInForce || TimeInForce.GOOD_TIL_CANCEL) as TimeInForce;
  }

  /** 是否只减仓 */
  get reduceOnly(): boolean {
    return this.raw.reduceOnly ?? false;
  }

  /** 触发价格（条件单） */
  get triggerPrice(): string | undefined {
    return this.raw.triggerPrice;
  }

  /** 触发价格类型 */
  get triggerPriceType(): TriggerPriceType | undefined {
    return this.raw.triggerPriceType as TriggerPriceType | undefined;
  }

  /** 过期时间 */
  get expireTime(): string | undefined {
    return this.raw.expireTime;
  }

  /** 取消原因 */
  get cancelReason(): string | undefined {
    return this.raw.cancelReason;
  }

  /** 创建时间 */
  get createdTime(): Date {
    return new Date(Number(this.raw.createdTime));
  }

  /** 更新时间 */
  get updatedTime(): Date {
    return new Date(Number(this.raw.updatedTime));
  }

  /** 触发时间 */
  get triggerTime(): Date | null {
    return this.raw.triggerTime ? new Date(Number(this.raw.triggerTime)) : null;
  }

  /** 匹配序号 */
  get matchSequenceId(): string | undefined {
    return this.raw.matchSequenceId;
  }

  /** 触发价格时间 */
  get triggerPriceTime(): Date | null {
    return this.raw.triggerPriceTime ? new Date(Number(this.raw.triggerPriceTime)) : null;
  }

  /** 触发价格值 */
  get triggerPriceValue(): string | undefined {
    return this.raw.triggerPriceValue;
  }

  /** 合约名称 */
  get contractName(): string {
    return this.symbol.contractName;
  }

  /** 交易对符号 */
  get symbolName(): string {
    return this.symbol.symbol;
  }

  /** 价格精度 */
  get pricePrecision(): number {
    return this.symbol.pricePrecision;
  }

  /** 数量精度 */
  get sizePrecision(): number {
    return this.symbol.sizePrecision;
  }

  /** 价格步长 */
  get priceStep() {
    return this.symbol.priceStep;
  }

  /** 数量步长 */
  get sizeStep() {
    return this.symbol.sizeStep;
  }

  /** 基础货币 */
  get baseCoin(): string {
    return this.symbol.baseCoin;
  }

  /** 计价货币 */
  get quoteCoin(): string {
    return this.symbol.quoteCoin;
  }

  /** 最小订单数量 */
  get minOrderSize() {
    return this.symbol.minOrderSize;
  }

  /** 最大订单数量 */
  get maxOrderSize() {
    return this.symbol.maxOrderSize;
  }

  // ============================================================================
  // 成交信息 Getters
  // ============================================================================

  /** 累计成交数量 */
  get cumFillSize(): string {
    return this.raw.cumFillSize || "0";
  }

  /** 累计成交价值 */
  get cumFillValue(): string {
    return this.raw.cumFillValue || "0";
  }

  /** 累计成交手续费 */
  get cumFillFee(): string {
    return this.raw.cumFillFee || "0";
  }

  /** 最大成交价格 */
  get maxFillPrice(): string | undefined {
    return this.raw.maxFillPrice;
  }

  /** 最小成交价格 */
  get minFillPrice(): string | undefined {
    return this.raw.minFillPrice;
  }

  // ============================================================================
  // TPSL 信息 Getters
  // ============================================================================

  /** 开仓止盈订单 */
  get openTp(): any {
    return this.raw.openTp;
  }

  /** 开仓止损订单 */
  get openSl(): any {
    return this.raw.openSl;
  }

  /** 是否设置开仓止盈 */
  get isSetOpenTp(): boolean {
    return this.raw.isSetOpenTp ?? false;
  }

  /** 是否设置开仓止损 */
  get isSetOpenSl(): boolean {
    return this.raw.isSetOpenSl ?? false;
  }

  /** 开仓 TPSL 父订单 ID */
  get openTpslParentOrderId(): string | undefined {
    return this.raw.openTpslParentOrderId;
  }

  // ============================================================================
  // 格式化方法
  // ============================================================================

  /**
   * 格式化价格显示
   */
  formatPrice(): string {
    if (!this.price) return "-";
    return new BigNumber(this.price).toFixed(this.symbol.pricePrecision, BigNumber.ROUND_DOWN);
  }

  /**
   * 格式化数量显示
   */
  formatSize(): string {
    return new BigNumber(this.size).toFixed(this.symbol.sizePrecision, BigNumber.ROUND_DOWN);
  }

  /**
   * 格式化成交数量显示
   */
  formatFilledSize(): string {
    return new BigNumber(this.raw.cumFillSize || "0").toFixed(this.symbol.sizePrecision, BigNumber.ROUND_DOWN);
  }
}