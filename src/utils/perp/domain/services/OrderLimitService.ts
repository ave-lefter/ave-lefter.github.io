import BigNumber from "bignumber.js";
import { toPrecisionStringWithType, bigNumberMultiply } from "../../utils";

export interface OrderLimitContext {
  price: string | number; // 当前价格 (Last Price for Market, Input Price for Limit)
  maxQty: string | number; // 最大可开数量 (基于资产计算)
  minOrderSize: string | number; // 最小下单数量 (合约配置)
  pricePrecision: number;
  sizeStep: string | number;
  maxLeverage: number;
}

export interface OrderValueLimits {
  maxOrderEqualVal: string | number;
  minOrderEqualVal: string | number;
  step: string;
  minMarginRequirement: string;
}

/**
 * 订单限制服务
 *
 * 职责：
 * 1. 计算订单的价值边界 (Max/Min Value)。
 * 2. 计算最小保证金要求。
 * 3. 集中管理与 "Limit" 相关的业务规则。
 */
export class OrderLimitService {
  static calculateLimits(context: OrderLimitContext): OrderValueLimits {
    const { price, maxQty, minOrderSize, pricePrecision, sizeStep, maxLeverage } = context;
    const priceNum = Number(price) || 0;
    const maxQtyNum = Number(maxQty) || 0;
    const minOrderSizeNum = Number(minOrderSize) || 0;

    // 1. 最大下单价值 = Max Qty * Price
    const maxEqualVal = maxQtyNum * priceNum;
    const maxOrderEqualVal = maxEqualVal > 0
      ? toPrecisionStringWithType(maxEqualVal, pricePrecision, "floor")
      : 0;

    // 2. 最小下单价值 = Min Size * Price
    const minEqualVal = minOrderSizeNum * priceNum;
    const minOrderEqualVal = minEqualVal > 0
      ? toPrecisionStringWithType(minEqualVal, pricePrecision, "ceil")
      : 0;

    // 3. 步长价值 = Size Step * Price
    const step = toPrecisionStringWithType(
      bigNumberMultiply(sizeStep, priceNum),
      pricePrecision,
      "ceil"
    );

    // 4. 最小保证金要求 = Min Value / Max Leverage
    // 用于提示用户"至少需要多少钱才能开单"
    const minEqualValNum = Number(minOrderEqualVal);
    const minMarginRequirement = (minEqualValNum && maxLeverage)
      ? toPrecisionStringWithType(minEqualValNum / maxLeverage, 2, "ceil")
      : "0";

    return {
      maxOrderEqualVal,
      minOrderEqualVal,
      step,
      minMarginRequirement,
    };
  }
}
