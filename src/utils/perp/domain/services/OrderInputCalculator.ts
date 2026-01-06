import BigNumber from "bignumber.js";
import { toPrecisionString } from "../../utils";

/**
 * 订单输入上下文
 * 包含计算所需的外部参数
 */
export interface OrderInputContext {
  price: string | number; // 当前使用的价格（限价或市价的预估价）
  leverage: number; // 当前杠杆
  pricePrecision: number; // 价格精度
  sizePrecision: number; // 数量精度
}

/**
 * 衍生订单状态
 * 计算后的联动结果
 */
export interface DerivedOrderState {
  size: string;
  orderValue: string;
  orderMargin: string;
}

/**
 * 订单输入计算器
 *
 * 职责：
 * 1. 处理 Quantity / Value / Margin 三者之间的联动计算。
 * 2. 严格控制所有输出字段的精度。
 * 3. 确保 UI 层不包含任何数学公式和精度截断逻辑。
 */
export class OrderInputCalculator {
  /**
   * 从“数量”推导其他字段
   * 场景：用户输入数量 (OrderBasis.Size)
   */
  static deriveFromSize(size: string | number, context: OrderInputContext): DerivedOrderState {
    const { price, leverage, pricePrecision } = context;
    const sizeNum = Number(size);
    const priceNum = Number(price);

    // 1. 计算价值 (Value = Size * Price)
    // 精度：按价格精度截断 (UI显示通常跟随 quote coin 精度，这里复用 pricePrecision 或需要独立的 quotePrecision)
    const valueBN = BigNumber(sizeNum).multipliedBy(priceNum);
    const orderValue = sizeNum && priceNum
      ? toPrecisionString(valueBN, pricePrecision)
      : "";

    // 2. 计算保证金 (Margin = Value / Leverage)
    // 精度：固定保留 2 位小数 (原逻辑：toPrecisionString(..., 2))
    const orderMargin = sizeNum && priceNum && leverage
      ? toPrecisionString(valueBN.dividedBy(leverage), 2)
      : "";

    return {
      size: String(size),
      orderValue,
      orderMargin,
    };
  }

  /**
   * 从“价值”推导其他字段
   * 场景：用户输入价值 (OrderBasis.Value)
   */
  static deriveFromValue(value: string | number, context: OrderInputContext): DerivedOrderState {
    const { price, leverage, sizePrecision } = context;
    const valueNum = Number(value);
    const priceNum = Number(price);

    // 1. 计算数量 (Size = Value / Price)
    // 精度：按数量精度截断 (sizePrecision)
    const sizeVal = BigNumber(valueNum).dividedBy(priceNum);
    const size = valueNum && priceNum
      ? toPrecisionString(sizeVal, sizePrecision)
      : "";

    // 2. 计算保证金 (Margin = Value / Leverage)
    // 精度：固定保留 2 位小数
    const orderMargin = valueNum && leverage
      ? toPrecisionString(BigNumber(valueNum).dividedBy(leverage), 2)
      : "";

    // 特殊逻辑：如果价值为空，保证金也清空
    if (!valueNum) {
      return { size: "", orderValue: String(value), orderMargin: "" };
    }

    return {
      size,
      orderValue: String(value),
      orderMargin,
    };
  }

  /**
   * 从“保证金”推导其他字段
   * 场景：用户输入保证金 (OrderBasis.Margin)
   */
  static deriveFromMargin(margin: string | number, context: OrderInputContext): DerivedOrderState {
    const { leverage, pricePrecision } = context;
    const marginNum = Number(margin);

    // 1. 反推价值 (Value = Margin * Leverage)
    const valueNum = BigNumber(marginNum).multipliedBy(leverage);
    const orderValue = marginNum && leverage
      ? toPrecisionString(valueNum, pricePrecision)
      : "";

    // 2. 再从价值推导数量
    // 复用 deriveFromValue 的逻辑，但保持 margin 原值
    const derivedState = this.deriveFromValue(orderValue, context);

    return {
      ...derivedState,
      orderValue, // 确保 value 是计算后的结果
      orderMargin: String(margin), // 保持用户输入的 margin 不变
    };
  }
}
