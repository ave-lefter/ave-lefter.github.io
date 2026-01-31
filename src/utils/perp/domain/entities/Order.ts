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
import type { IContract as ISymbol, OpenTpSlOrder, OrderEntry } from "../../types";
import { getNumberPrecision } from "../../utils";
import {
  CONST_conditionalOrderType,
  DEFAULT_MAKER_FEE_RATE,
  DEFAULT_MAX_LEVERAGE,
  DEFAULT_TAKER_FEE_RATE,
} from "../constants";
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
import { SymbolEntity } from "./Symbol";

/**
 * Order 聚合根（充血模型）
 *
 * 封装订单的所有业务逻辑和状态转换
 */
export class Order {
  public symbol: SymbolEntity;

  constructor(
    symbol: ISymbol | SymbolEntity,
    public raw: OrderEntry,
  ) {
    if (symbol instanceof SymbolEntity) {
      this.symbol = symbol;
    } else {
      this.symbol = SymbolEntity.fromRaw(symbol);
    }
  }

  static fromRaw(symbol: ISymbol | SymbolEntity, raw: OrderEntry) {
    return new Order(symbol, raw);
  }

  /**
   * 订单排序比较器
   * 1. 按 contractId 升序
   * 2. 按照 side 排序 (BUY 在前, SELL 在后)
   * 3. 如果 price 为 0 (市价单)，排在最前。
   * 4. 如果是限价单：
   *    - BUY: 价格降序 (买一价最高在前)
   *    - SELL: 价格升序 (卖一价最低在前)
   * 5. 按照提交撮合时间降序 (type 为条件单 取 triggerTime，其他为 createdTime)
   * 6. 按照 id 升序
   * 本质上就一句话，按照成交可能性从大到小排列
   */
  static comparator(a: Order | OrderEntry, b: Order | OrderEntry): number {
    const aRaw = a instanceof Order ? a.raw : a;
    const bRaw = b instanceof Order ? b.raw : b;

    // 1. Contract ID 升序
    const contractDiff = Number(aRaw.contractId) - Number(bRaw.contractId);
    if (contractDiff !== 0) return contractDiff;

    // 2. Side 排序: BUY (0) < SELL (1)
    // 原始逻辑: { SELL: 1, BUY: -1 } -> BUY(-1) - SELL(1) = -2 (BUY first)
    // 这里保持 BUY 在前，SELL 在后
    const getSideVal = (side: string) => (side === "BUY" ? 0 : 1);
    const sideDiff = getSideVal(aRaw.side) - getSideVal(bRaw.side);
    if (sideDiff !== 0) return sideDiff;

    const aPrice = Number(aRaw.price);
    const bPrice = Number(bRaw.price);

    // 3. 市价单优先 (Price == 0)
    const aIsMarket = aPrice === 0;
    const bIsMarket = bPrice === 0;
    if (aIsMarket && !bIsMarket) return -1;
    if (!aIsMarket && bIsMarket) return 1;

    // 4. 价格排序
    // BUY: 降序 (大在前) -> b - a
    // SELL: 升序 (小在前) -> a - b
    if (aRaw.side === "BUY") {
      if (bPrice !== aPrice) return bPrice - aPrice;
    } else {
      // SELL
      if (aPrice !== bPrice) return aPrice - bPrice;
    }

    // 5. 时间排序 (降序: 新在前)
    // 条件单取 triggerTime, 普通单取 createdTime
    const getTime = (o: OrderEntry) => {
      const isConditional = CONST_conditionalOrderType.includes(o.type as OrderType);
      return Number(isConditional ? o.triggerTime : o.createdTime);
    };
    const timeDiff = getTime(bRaw) - getTime(aRaw);
    if (timeDiff !== 0) return timeDiff;

    // 6. ID 升序
    return aRaw.id.localeCompare(bRaw.id);
  }

  /**
   * 排序订单列表
   */
  static sort(orderList: Order[]): Order[] {
    return orderList.sort(Order.comparator);
  }

  /**
   * 计算订单成交数据（开仓/平仓数量划分）
   * @param positionOpenSize 当前仓位数量
   */
  getFillData(positionOpenSize: BigNumber) {
    let orderLeftSize = BigNumber(0);
    if (["PENDING", "OPEN", "CANCELING"].includes(this.status)) {
      orderLeftSize = BigNumber(this.size)
        .minus(this.raw.cumFailSize || 0)
        .minus(this.raw.cumFillSize || 0);
    } else {
      orderLeftSize = BigNumber(this.raw.cumMatchSize || 0)
        .minus(this.raw.cumFailSize || 0)
        .minus(this.raw.cumFillSize || 0);
    }

    if (orderLeftSize.lte(0)) {
      return {
        closeSize: BigNumber(0),
        closeValue: BigNumber(0),
        openSize: BigNumber(0),
        openValue: BigNumber(0),
      };
    }

    let orderLeftValue = BigNumber(0);
    if (!this.price || this.price == "0") {
      // 市价单
      orderLeftValue = BigNumber(
        orderLeftSize
          .multipliedBy(BigNumber(this.raw.marketLimitValue || 0))
          .dividedBy(
            BigNumber(this.size).toFixed(
              getNumberPrecision(this.symbol.stepSize),
              this.side == "BUY" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR,
            ),
          ),
      );
    } else {
      orderLeftValue = orderLeftSize.multipliedBy(BigNumber(this.price));
    }

    let orderCloseSize = BigNumber(0);
    if (this.side == "BUY" && positionOpenSize.lt(0)) {
      orderCloseSize = BigNumber.min(positionOpenSize.abs(), orderLeftSize);
    } else if (this.side == "SELL" && positionOpenSize.gt(0)) {
      orderCloseSize = BigNumber(0).minus(BigNumber.min(positionOpenSize, orderLeftSize));
    }

    let orderOpenSize = BigNumber(0);
    if (this.side == "BUY") {
      orderOpenSize = BigNumber(orderLeftSize).minus(BigNumber(orderCloseSize));
    } else {
      orderOpenSize = BigNumber(orderLeftSize).negated().minus(BigNumber(orderCloseSize));
    }

    const orderCloseValue = BigNumber(
      orderCloseSize
        .multipliedBy(orderLeftValue)
        .dividedBy(
          orderLeftSize.toFixed(
            getNumberPrecision(this.symbol.stepSize),
            this.side == "BUY" ? BigNumber.ROUND_CEIL : BigNumber.ROUND_FLOOR,
          ),
        ),
    );

    const orderOpenValue =
      this.side == "BUY"
        ? orderLeftValue.minus(orderCloseValue)
        : orderLeftValue.negated().minus(orderCloseValue);
    return {
      closeSize: orderCloseSize,
      closeValue: orderCloseValue,
      openSize: orderOpenSize,
      openValue: orderOpenValue,
    };
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
    if (this.raw.isPositionTpsl !== undefined && this.raw.isPositionTpsl !== null) {
      return this.raw.isPositionTpsl;
    }
    return this.isSetOpenSl || this.isSetOpenTp;
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

  /** 最大杠杆 */
  get maxLeverage(): string {
    return this.raw.maxLeverage || DEFAULT_MAX_LEVERAGE;
  }

  /** Taker 手续费率 */
  get takerFeeRate(): string {
    return this.raw.takerFeeRate || DEFAULT_TAKER_FEE_RATE;
  }

  /** Maker 手续费率 */
  get makerFeeRate(): string {
    return this.raw.makerFeeRate || DEFAULT_MAKER_FEE_RATE;
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
  get openTp(): OpenTpSlOrder | undefined {
    return this.raw.openTp;
  }

  /** 开仓止损订单 */
  get openSl(): OpenTpSlOrder | undefined {
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
    return this.symbol.formatPrice(this.price, "floor");
  }

  /**
   * 格式化数量显示
   */
  formatSize(): string {
    return this.symbol.formatSize(this.size);
  }

  /**
   * 格式化成交数量显示
   */
  formatFilledSize(): string {
    return this.symbol.formatSize(this.cumFillSize);
  }
}
