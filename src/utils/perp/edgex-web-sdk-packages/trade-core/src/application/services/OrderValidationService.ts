import BigNumber from "bignumber.js";
import { OrderType } from "../../domain/value-objects/OrderEnums";
import { PositionEntry, IContract } from "@edgex/types";
import { TYPE_orderSide } from "../../domain/constants";

export interface OrderValidationContext {
  balance: BigNumber;
  contractPosition?: PositionEntry; // 当前合约的持仓
  symbolInfo: IContract;
}

export interface CreateOrderValidationParams {
  side: string;
  type: OrderType;
  price: string | number;
  size: string | number;
  reduceOnly: boolean;
  triggerPrice?: string | number;
  // TP/SL 校验相关
  tpsl?: boolean;
  tpOSlSide?: string;
  tpTriggerPrice?: string | number;
  slTriggerPrice?: string | number;
  triggerPriceWithType?: string | number; // 用于 TPSL 比较的基准价格 (市价单用 oracle/index/last, 限价单用 price)
}

export enum ValidationErrorType {
  Silent = "SILENT",
  Form = "FORM",
  Toast = "TOAST",
}

interface ValidationError {
  type: ValidationErrorType;
  code: string;
  params?: any;
}

export class OrderValidationService {
  static validate(
    ctx: OrderValidationContext,
    params: CreateOrderValidationParams
  ): ValidationError | null {
    const { balance, contractPosition, symbolInfo } = ctx;
    const {
      side,
      type,
      price,
      size,
      reduceOnly,
      triggerPrice,
      tpsl,
      tpOSlSide,
      tpTriggerPrice,
      slTriggerPrice,
      triggerPriceWithType,
    } = params;

    const isConditional =
      type === OrderType.STOP_MARKET || type === OrderType.STOP_LIMIT;
    const isLimit = type === OrderType.LIMIT || type === OrderType.STOP_LIMIT;

    // 1. 保证金不足 (Insuffient Margin)
    if (!reduceOnly && balance.isLessThanOrEqualTo(0)) {
      return {
        type: ValidationErrorType.Form,
        code: "insufficientMargin",
        params: { token: symbolInfo.quoteCoin },
      };
    }

    // 2. 价格验证 (Price Validation)
    if (isLimit && (!price || Number(price) === 0)) {
      return { type: ValidationErrorType.Silent, code: "invalidPrice" };
    }

    // 3. 触发价格验证 (Trigger Price Validation)
    if (isConditional && !Number(triggerPrice)) {
      return { type: ValidationErrorType.Silent, code: "invalidTriggerPrice" };
    }

    // 4. 只减仓模式下，没有仓位不能开仓 (Reduce Only without Position)
    if (reduceOnly && !contractPosition) {
      return {
        type: ValidationErrorType.Toast,
        code: "ORDER_IS_REDUCE_ONLY_CANNOT_OPEN_POSITION",
      };
    }

    // 5. 数量验证 (Size Validation)
    // 注意：这里只做最基础的 minOrderSize 验证，复杂的 OrderBasis (按价值/保证金) 转换逻辑
    // 应该在 UI 层处理完得到最终 size 后再传给 Service
    if (!size || Number(size) === 0) {
      return { type: ValidationErrorType.Silent, code: "invalidSize" };
    }

    // 最小值验证 (Min Order Size)
    const minOrderSize = Number(symbolInfo.minOrderSize) || 0;
    // 逻辑复刻：如果只减仓且同方向有持仓（加仓），不检查最小数量？
    // 原始逻辑：
    // if (reduceOnly && currentContractPosition && currentContractPosition?.side === "LONG") { ... }
    // 这里的原始逻辑注释写的是 "相当于是加仓"，但 reduceOnly + 同方向持仓 其实是矛盾的。
    // 如果我有 LONG 仓位，reduceOnly 必须是 SELL。
    // 如果我开 BUY + ReduceOnly，那是加仓吗？不，ReduceOnly 意味着只能减仓。
    // 如果我有 LONG，开 BUY + ReduceOnly，会被拒绝 (后端或匹配引擎拒绝)。
    // 原始代码逻辑：
    // if (side === BUY) {
    //    if (reduceOnly && pos.side === LONG) { // 原始注释说“相当于加仓”，不拦截 }
    // }
    // 这段逻辑看起来有点怪，但为了保持一致性，我们先保留“不拦截”的行为，或者更仔细地审视它。
    // 实际上，ReduceOnly 只能用于 *减少* 当前仓位。
    // 如果我有 LONG，BUY 是增加仓位，不能是 ReduceOnly。
    // 所以这里的 `reduceOnly && pos.side === LONG` 分支可能永远不会是合法的 ReduceOnly 操作。
    // 但既然原始代码跳过了检查，我们也先跳过，避免破坏现有行为。

    let skipMinSizeCheck = false;
    if (contractPosition) {
      const openSize = BigNumber(contractPosition.openSize);
      const isLong = openSize.gt(0);
      const isShort = openSize.lt(0);

      if (side === TYPE_orderSide.BUY && reduceOnly && isLong) {
        skipMinSizeCheck = true;
      }
      if (side === TYPE_orderSide.SELL && reduceOnly && isShort) {
        skipMinSizeCheck = true;
      }
    }

    if (!skipMinSizeCheck) {
      if (Number(size) < minOrderSize) {
        // 这里原始代码是静默返回(return)，意味着它是 Silent 错误，或者依靠 UI 的输入框红框来提示
        // 原始代码: if (isSizeBasis && Number(size) < Number(minOrderSize)) { return; }
        // 它是直接 return，没有任何 toast 或 error。
        return { type: ValidationErrorType.Silent, code: "sizeTooSmall" };
      }
    }

    // 6. TP/SL 简单校验 (Simple TPSL Check)
    if (tpsl && price && !tpOSlSide) {
      const entryPrice = Number(price);
      const isLong = side === TYPE_orderSide.BUY;

      if (tpTriggerPrice && Number(tpTriggerPrice) > 0) {
        const tpInvalid = isLong
          ? Number(tpTriggerPrice) <= entryPrice
          : Number(tpTriggerPrice) >= entryPrice;
        if (tpInvalid) return { type: ValidationErrorType.Silent, code: "invalidTpPrice" };
      }
      if (slTriggerPrice && Number(slTriggerPrice) > 0) {
        const slInvalid = isLong
          ? Number(slTriggerPrice) >= entryPrice
          : Number(slTriggerPrice) <= entryPrice;
        if (slInvalid) return { type: ValidationErrorType.Silent, code: "invalidSlPrice" };
      }
    }

    // 7. TP/SL 深度校验 (Deep TPSL Check - 主要是方向和触发价的比较)
    if (tpOSlSide && (tpTriggerPrice || slTriggerPrice) && tpOSlSide !== side) {
      return { type: ValidationErrorType.Form, code: "openPositionTpOSlTips" };
    }

    let triggerPriceToCompare = 0;
    if (isLimit) {
      triggerPriceToCompare = Number(price);
    } else {
      triggerPriceToCompare = Number(triggerPriceWithType || 0);
    }
    
    // 这里需要 triggerPriceToCompareType 用于错误消息，但 Service 只返回 code 和 type
    // UI 层根据 code (e.g. "tpPriceLessTips.tpOSl") 自行决定显示什么参数

    if (tpTriggerPrice) {
      const tp = Number(tpTriggerPrice);
      const compare = triggerPriceToCompare;
      
      // BUY side (Long): TP must be > Current Price
      // SELL side (Short): TP must be < Current Price
      
      if (
        (isLimit && tpOSlSide === TYPE_orderSide.BUY && tp <= compare) ||
        (side === TYPE_orderSide.SELL && tp >= compare)
      ) {
        const isLess = side === TYPE_orderSide.BUY && tp <= compare;
        return {
          type: ValidationErrorType.Form,
          code: isLess ? "tpPriceLessTips.tpOSl" : "tpPriceMoreTips.tpOSl",
          // params: { priceType } // UI 层处理
        };
      }
    }

    if (slTriggerPrice) {
      const sl = Number(slTriggerPrice);
      const compare = triggerPriceToCompare;

      // BUY side (Long): SL must be < Current Price
      // SELL side (Short): SL must be > Current Price

      if (
        (isLimit && side === TYPE_orderSide.BUY && sl >= compare) ||
        (side === TYPE_orderSide.SELL && sl <= compare)
      ) {
        const isMore = side === TYPE_orderSide.BUY && sl >= compare;
        return {
          type: ValidationErrorType.Form,
          code: isMore ? "slPriceMoreTips.tpOSl" : "slPriceLessTips.tpOSl",
          // params: { priceType } // UI 层处理
        };
      }
    }

    return null;
  }
}
