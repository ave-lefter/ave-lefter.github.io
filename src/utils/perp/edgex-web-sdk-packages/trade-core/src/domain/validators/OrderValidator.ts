/**
 * 订单验证器
 *
 * 职责：封装所有订单创建前的业务验证规则
 *
 * DDD 原则：
 * - 验证逻辑属于 Domain 层，是业务规则的一部分
 * - 返回验证错误信息的 key，由上层负责国际化
 * - 无副作用，纯函数设计
 */

import { TYPE_orderSide } from "../constants/trade.constants";

/**
 * 订单验证上下文
 */
export interface OrderValidationContext {
  /** 是否已连接钱包并签名 */
  isWalletConnected: boolean;
  /** 订单类型 */
  orderType: string;
  /** 订单方向 */
  side: string;
  /** 价格 */
  price: string | number;
  /** 数量 */
  size: string | number;
  /** 触发价格（条件单） */
  triggerPrice?: string | number;
  /** 是否只减仓 */
  reduceOnly?: boolean;
  /** 最大买入数量 */
  maxBuyQty?: string | number;
  /** 最大卖出数量 */
  maxSellQty?: string | number;
  /** 是否显示等值输入 */
  showEqualValInput?: boolean;
}

/**
 * 订单验证结果
 */
export interface OrderValidationResult {
  /** 是否验证通过 */
  isValid: boolean;
  /** 错误信息 key（用于国际化） */
  errorKey?: string;
  /** 错误参数（用于国际化占位符） */
  errorParams?: Record<string, any>;
}

/**
 * 订单验证器
 *
 * 包含所有订单创建前的业务验证逻辑
 */
export class OrderValidator {
  /**
   * 验证钱包连接状态
   */
  static validateWalletConnection(isConnected: boolean): OrderValidationResult {
    if (!isConnected) {
      return {
        isValid: false,
        errorKey: "connectWallet",
      };
    }
    return { isValid: true };
  }

  /**
   * 验证条件单触发价格
   *
   * 业务规则：条件单（STOP_MARKET, STOP_LIMIT）必须填写触发价格
   */
  static validateTriggerPrice(
    orderType: string,
    triggerPrice?: string | number,
  ): OrderValidationResult {
    if (orderType.includes("STOP_") && !Number(triggerPrice)) {
      return {
        isValid: false,
        errorKey: "toastInputTriggerPrice",
      };
    }
    return { isValid: true };
  }

  /**
   * 验证只减仓订单
   *
   * 业务规则：
   * - 只减仓订单不能开设新仓位
   * - 买单（只减仓）需要有空头仓位（maxSellQty > 0），用于平空
   * - 卖单（只减仓）需要有多头仓位（maxBuyQty > 0），用于平多
   */
  static validateReduceOnly(
    reduceOnly: boolean,
    side: string,
    maxBuyQty?: string | number,
    maxSellQty?: string | number,
  ): OrderValidationResult {
    if (
      reduceOnly &&
      ((side === TYPE_orderSide.SELL && Number(maxSellQty) <= 0) ||
        (side === TYPE_orderSide.BUY && Number(maxBuyQty) <= 0))
    ) {
      return {
        isValid: false,
        errorKey: "ORDER_IS_REDUCE_ONLY_CANNOT_OPEN_POSITION",
      };
    }
    return { isValid: true };
  }

  /**
   * 验证价格
   *
   * 业务规则：
   * - 限价单必须填写价格
   * - 市价单需要有可用市场价格
   */
  static validatePrice(price: string | number, orderType: string): OrderValidationResult {
    if (!Number(price)) {
      return {
        isValid: false,
        errorKey: orderType.indexOf("MARKET") !== -1 ? "toastNoAvailablePrice" : "toastInputPrice",
      };
    }
    return { isValid: true };
  }

  /**
   * 验证数量
   *
   * 业务规则：订单数量必须大于 0
   */
  static validateSize(size: string | number, showEqualValInput?: boolean): OrderValidationResult {
    if (!Number(size)) {
      return {
        isValid: false,
        errorKey: showEqualValInput ? "toastInputValue" : "toastInputQty",
      };
    }
    return { isValid: true };
  }

  /**
   * 验证价格和数量
   *
   * 组合验证：同时验证价格和数量
   */
  static validatePriceAndSize(
    price: string | number,
    size: string | number,
    orderType: string,
    showEqualValInput?: boolean,
  ): OrderValidationResult {
    // 先验证价格
    const priceResult = this.validatePrice(price, orderType);
    if (!priceResult.isValid) {
      return priceResult;
    }

    // 再验证数量
    const sizeResult = this.validateSize(size, showEqualValInput);
    if (!sizeResult.isValid) {
      return sizeResult;
    }

    return { isValid: true };
  }

  /**
   * 执行所有订单验证
   *
   * 按顺序执行所有验证规则，遇到第一个失败就返回
   *
   * @param context 订单验证上下文
   * @returns 验证结果
   */
  static validate(context: OrderValidationContext): OrderValidationResult {
    // 1. 验证钱包连接
    const walletResult = this.validateWalletConnection(context.isWalletConnected);
    if (!walletResult.isValid) return walletResult;

    // 2. 验证触发价格（条件单）
    const triggerPriceResult = this.validateTriggerPrice(context.orderType, context.triggerPrice);
    if (!triggerPriceResult.isValid) return triggerPriceResult;

    // 3. 验证只减仓规则
    const reduceOnlyResult = this.validateReduceOnly(
      !!context.reduceOnly,
      context.side,
      context.maxBuyQty,
      context.maxSellQty,
    );
    if (!reduceOnlyResult.isValid) return reduceOnlyResult;

    // 4. 验证价格和数量
    const priceAndSizeResult = this.validatePriceAndSize(
      context.price,
      context.size,
      context.orderType,
      context.showEqualValInput,
    );
    if (!priceAndSizeResult.isValid) return priceAndSizeResult;

    // 所有验证通过
    return { isValid: true };
  }
}
