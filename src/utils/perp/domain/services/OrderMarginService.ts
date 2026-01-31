import BigNumber from "bignumber.js";
import type { OrderBookEntry } from "../../domain/entities/Orderbook";
import { DEFAULT_MARKET_SLIPPAGE_BUFFER } from "../constants/trade.constants";
import { calculateOpenOrderFrozenAmount as calcOpenFrozen } from "../calculators";

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
 * 下单保证金计算服务（简单估算）
 *
 * 与 OrderExecutionService.calculateOrderCost 的区别：
 * - OrderMarginService: 简单估算，假设整个订单都是开仓，适合 UI 预估显示
 * - calculateOrderCost: 精确计算，考虑现有持仓和挂单，区分开仓/平仓部分
 *
 * 使用场景：
 * - 下单面板显示预估保证金
 * - 用户输入时的实时反馈
 * - 不需要精确到考虑已有挂单的场景
 *
 * 计算公式：
 * 保证金 = 开仓亏损 + 初始保证金 + 手续费
 *
 * 其中：
 * - 开仓亏损 = Max(0, 订单开仓价值 - 订单开仓数量 × 当前预言机价格)
 * - 订单开仓价值 = 委托价格 × 委托数量
 * - 委托价格：限价取用户输入的价格，市价取订单簿加权平均价格
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

    // 使用 calculator 计算总保证金
    return calcOpenFrozen({
      oraclePrice: this.oraclePrice.toString(),
      initialMarginRate: initialMarginRate.toString(),
      size: this.size.toString(),
      value: orderOpenValue.toString(),
      feeRate: this.feeRate.toString(),
    });
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
