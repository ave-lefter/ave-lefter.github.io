import BigNumber from "bignumber.js";
import type { OrderBookEntry } from "../../domain/entities/Orderbook"
import { DEFAULT_MARKET_SLIPPAGE_BUFFER } from "../constants/trade.constants";

// 构造函数参数接口
interface OrderMarginServiceParams {
  oraclePrice: number | string;
  /** Limit price. Optional for market orders but recommended to default to 0 if unused. */
  price?: number | string;
  size: number | string;
  leverage: number | string;
  feeRate: number | string;
  orderbook?: OrderBookEntry[];
}

// 保证金详细信息接口
interface MarginDetails {
  price: string;
  orderOpenValue: string;
  openLoss: string;
  initialMargin: string;
  fee: string;
  totalMargin: string;
}

// 计算选项接口
interface CalcOptions {
  isMarketOrder?: boolean;
}

/**
 * 下单保证金计算服务
 *
 * 保证金 = 开仓亏损 + 初始保证金 + 手续费
 *
 * 开仓亏损 = Max(0, 订单开仓价值 - 订单开仓数量 × 当前预言机价格)
 * - 订单开仓价值 = 委托价格 × 委托数量
 * - 委托价格：限价取用户输入的价格，市价取当前单边的委托价格
 *   - 市价单委托价格 = value / (size × (1 + slippageBuffer))
 *     - value = 委托单加权平均总价值 (USD)
 *     - size = 用户委托数量 (Token amount)
 */
export class OrderMarginService {
  private params: OrderMarginServiceParams;
  private oraclePrice: BigNumber;
  private price: BigNumber;
  private size: BigNumber;
  private leverage: BigNumber;
  private feeRate: BigNumber;
  private orderbook: OrderBookEntry[];

  /**
   * @param params - 参数对象
   * @param params.oraclePrice - 预言机价格
   * @param params.price - 委托价格（限价单使用）
   * @param params.size - 委托数量
   * @param params.leverage - 杠杆倍数
   * @param params.feeRate - 手续费率
   * @param params.orderbook - 订单簿数据（市价单计算委托价格时使用）
   */
  constructor(params: OrderMarginServiceParams) {
    this.params = params;
    this.oraclePrice = BigNumber(params.oraclePrice || 0);
    this.price = BigNumber(params.price || 0);
    this.size = BigNumber(params.size || 0);
    this.leverage = BigNumber(params.leverage || 1);
    this.feeRate = BigNumber(params.feeRate || 0);
    this.orderbook = params.orderbook || [];
  }

  /**
   * @description 计算委托单开仓冻结金额
   * max(orderOpenValue - orderOpenSize x oraclePrice, 0) + abs(orderOpenValue) x feeRate + abs(orderOpenSize) x oraclePrice x (1 / leverage)
   * @param {BigNumber} oraclePrice 预言机价格
   * @param {BigNumber} initialMarginRate 仓位初始保证金率
   * @param {BigNumber} orderOpenSize 当前委托单的开仓数量
   * @param {BigNumber} orderOpenValue orderOpenSize x Order.price
   * @param {BigNumber} feeRate 手续费率
   * @return {BigNumber} 开仓冻结金额
   */
  static calculateOpenOrderFrozenAmount(
    oraclePrice: string | BigNumber | number,
    initialMarginRate: string | BigNumber,
    orderOpenSize: string | BigNumber,
    orderOpenValue: string | BigNumber,
    feeRate: string | number,
  ): BigNumber {
    // 开仓损失(仅考虑亏损情况，不考虑盈利)：max(orderOpenValue - orderOpenSize x oraclePrice, 0)
    const orderLossValue = BigNumber.max(
      BigNumber(orderOpenValue).minus(BigNumber(orderOpenSize).multipliedBy(oraclePrice)),
      0,
    );
    // 开仓后增加的初始保证金：abs(orderOpenSize) x oraclePrice x initialMarginRate
    const orderInitialMarginRequirement = BigNumber(orderOpenSize)
      .abs()
      .multipliedBy(oraclePrice)
      .multipliedBy(initialMarginRate);
    // 开仓手续费
    const orderFillFee = BigNumber(orderOpenValue).abs().multipliedBy(feeRate);
    return orderLossValue.plus(orderInitialMarginRequirement).plus(orderFillFee);
  }

  /**
   * @description 计算委托单平仓冻结金额
   * max(orderCloseValue - orderCloseSize x oraclePrice + abs(orderCloseValue) x feeRate - abs(orderCloseSize) x oraclePrice x (1 / leverage), 0)
   * @param {BigNumber} oraclePrice 预言机价格
   * @param {BigNumber} initialMarginRate 仓位初始保证金率
   * @param {BigNumber} orderCloseSize 当前委托单的平仓数量
   * @param {BigNumber} orderCloseValue orderCloseSize x Order.price
   * @param {BigNumber} feeRate 手续费率
   * @return {BigNumber} 平仓冻结金额
   */
  static calculateCloseOrderFrozenAmount(
    oraclePrice: string | BigNumber | number,
    initialMarginRate: string | BigNumber,
    orderCloseSize: string | BigNumber,
    orderCloseValue: string | BigNumber,
    feeRate: string | number,
  ): BigNumber {
    // 平仓损失：orderCloseValue - orderCloseSize x oraclePrice
    const orderLossValue = BigNumber(orderCloseValue).minus(
      BigNumber(orderCloseSize).multipliedBy(oraclePrice),
    );
    // 平仓成交后的 减少的初始保证金：abs(orderCloseSize) x oraclePrice x initialMarginRate
    const orderInitialMarginRequirement = BigNumber(orderCloseSize)
      .abs()
      .multipliedBy(oraclePrice)
      .multipliedBy(initialMarginRate);
    // 手续费：abs(orderCloseValue) x orderFeeRate
    const orderFillFee = BigNumber(orderCloseValue).abs().multipliedBy(feeRate);
    return orderLossValue.minus(orderInitialMarginRequirement).plus(orderFillFee);
  }

  /**
   * 计算市价单的委托价格
   *
   * 市价单根据订单簿计算加权平均价格：
   * - 买入（BUY）：使用卖盘（ask/sellList），从最低卖价开始成交
   * - 卖出（SELL）：使用买盘（bid/buyList），从最高买价开始成交
   *
   * 如果没有订单簿数据，使用预言机价格作为估算
   *
   * 注意：
   * - side = 'BUY' 时，orderbook 应该是卖盘（sellList），已按价格从低到高排序
   * - side = 'SELL' 时，orderbook 应该是买盘（buyList），已按价格从低到高排序，需要反转
   *
   * 公式：市价单委托价格 = value / (size × (1 + slippageBuffer))
   * - value = 委托单加权平均总价值 (USD)
   * - size = 用户委托数量 (Token amount)
   * - slippageBuffer = 滑点保护系数
   *
   * @param side - 'BUY' 或 'SELL'
   * @returns 委托价格
   */
  calcMarketPrice(side: "BUY" | "SELL"): BigNumber {
    // 如果没有订单簿数据，使用预言机价格
    if (!this.orderbook || this.orderbook.length === 0) {
      return this.oraclePrice;
    }

    let remainingSize = this.size.abs();
    let totalValue = BigNumber(0);

    // 准备订单簿数据
    // buyList 和 sellList 都是按 price 从小到大排序
    // - 买入（BUY）：使用 sellList，从最低价开始，顺序遍历
    // - 卖出（SELL）：使用 buyList，从最高价开始，需要反转
    const orderbookToUse = side === "SELL" ? [...this.orderbook].reverse() : this.orderbook;

    // 遍历订单簿，计算加权平均价值
    for (const order of orderbookToUse) {
      // 支持两种格式：
      const orderSize = BigNumber(order.size || 0);
      const orderPrice = BigNumber(order.price || 0);

      if (remainingSize.lte(0)) break;

      const fillSize = BigNumber.min(remainingSize, orderSize);
      totalValue = totalValue.plus(fillSize.multipliedBy(orderPrice));
      remainingSize = remainingSize.minus(fillSize);
    }

    // 如果订单簿深度不足，剩余部分使用预言机价格
    if (remainingSize.gt(0)) {
      totalValue = totalValue.plus(remainingSize.multipliedBy(this.oraclePrice));
    }

    // 市价单委托价格 = value / (size × (1 + slippageBuffer))
    const marketPrice = totalValue.dividedBy(
      this.size.abs().multipliedBy(1 + DEFAULT_MARKET_SLIPPAGE_BUFFER),
    );
    return marketPrice;
  }

  /**
   * 计算订单开仓价值
   * 订单开仓价值 = 委托价格 × 委托数量
   *
   * @param price - 委托价格
   * @returns 开仓价值
   */
  calcOrderOpenValue(price: BigNumber): BigNumber {
    return price.multipliedBy(this.size);
  }

  /**
   * 计算开仓亏损
   * 开仓亏损 = Max(0, 订单开仓价值 - 订单开仓数量 × 当前预言机价格)
   *
   * @param orderOpenValue - 订单开仓价值
   * @returns 开仓亏损
   */
  calcOpenPositionLoss(orderOpenValue: BigNumber): BigNumber {
    const loss = orderOpenValue.minus(this.size.multipliedBy(this.oraclePrice));
    return BigNumber.max(loss, 0);
  }

  /**
   * 计算初始保证金
   * 初始保证金 = abs(订单开仓数量) × 当前预言机价格 × (1 / 杠杆)
   *
   * @returns 初始保证金
   */
  calcInitialMargin(): BigNumber {
    const initialMarginRate = BigNumber(1).dividedBy(this.leverage);
    return this.size.abs().multipliedBy(this.oraclePrice).multipliedBy(initialMarginRate);
  }

  /**
   * 计算开仓手续费
   * 手续费 = abs(订单开仓价值) × 手续费率
   *
   * @param orderOpenValue - 订单开仓价值
   * @returns 手续费
   */
  calcOpenPositionFee(orderOpenValue: BigNumber): BigNumber {
    return orderOpenValue.abs().multipliedBy(this.feeRate);
  }

  /**
   * 计算保证金
   * 保证金 = 开仓亏损 + 初始保证金 + 手续费
   *
   * 内部调用静态方法 `calculateOpenOrderFrozenAmount` 以确保逻辑一致性。
   *
   * @param side - 'LONG' 或 'SHORT'
   * @param options - 选项
   * @param options.isMarketOrder - 是否为市价单
   * @returns 所需保证金
   */
  calcMargin(side: "LONG" | "SHORT", options: CalcOptions = {}): BigNumber {
    const { isMarketOrder = false } = options;
    const isLong = side === "LONG";

    // 确定委托价格
    const price = isMarketOrder ? this.calcMarketPrice(isLong ? "BUY" : "SELL") : this.price;

    // 计算订单开仓价值
    const orderOpenValue = this.calcOrderOpenValue(price);

    // 计算初始保证金率
    const initialMarginRate = BigNumber(1).dividedBy(this.leverage);

    // 复用静态方法计算总保证金
    return OrderMarginService.calculateOpenOrderFrozenAmount(
      this.oraclePrice,
      initialMarginRate,
      this.size,
      orderOpenValue,
      this.feeRate.toString(),
    );
  }

  /**
   * 计算做多保证金
   * @deprecated 使用 calcMargin('LONG', options) 代替
   * @param options - 选项
   * @param options.isMarketOrder - 是否为市价单
   * @returns 做多所需保证金
   */
  calcLongMargin(options: CalcOptions = {}): BigNumber {
    return this.calcMargin("LONG", options);
  }

  /**
   * 计算做空保证金
   * @deprecated 使用 calcMargin('SHORT', options) 代替
   * @param options - 选项
   * @param options.isMarketOrder - 是否为市价单
   * @returns 做空所需保证金
   */
  calcShortMargin(options: CalcOptions = {}): BigNumber {
    return this.calcMargin("SHORT", options);
  }

  /**
   * 获取保证金详细信息
   *
   * @param side - 'LONG' 或 'SHORT'
   * @param options - 选项
   * @param options.isMarketOrder - 是否为市价单
   * @returns 保证金详细信息
   */
  getMarginDetails(side: "LONG" | "SHORT", options: CalcOptions = {}): MarginDetails {
    const { isMarketOrder = false } = options;
    const isLong = side === "LONG";

    // 确定委托价格
    const price = isMarketOrder ? this.calcMarketPrice(isLong ? "BUY" : "SELL") : this.price;

    // 计算订单开仓价值
    const orderOpenValue = this.calcOrderOpenValue(price);

    // 计算开仓亏损（统一公式，不区分多空）
    const openLoss = this.calcOpenPositionLoss(orderOpenValue);

    // 计算其他部分
    const initialMargin = this.calcInitialMargin();
    const fee = this.calcOpenPositionFee(orderOpenValue);
    const totalMargin = openLoss.plus(initialMargin).plus(fee);

    return {
      price: price.toString(),
      orderOpenValue: orderOpenValue.toString(),
      openLoss: openLoss.toString(),
      initialMargin: initialMargin.toString(),
      fee: fee.toString(),
      totalMargin: totalMargin.toString(),
    };
  }
}
