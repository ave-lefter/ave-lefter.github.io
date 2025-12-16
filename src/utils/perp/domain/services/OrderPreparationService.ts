/**
 * 订单准备服务
 *
 * 职责：准备创建订单所需的所有业务逻辑处理
 *
 * DDD 原则：
 * - 这是 Domain Service，包含业务逻辑但无副作用
 * - 封装订单创建前的所有准备步骤
 * - 纯函数设计，可以多次调用
 * - 返回准备结果，包括需要用户确认的信息
 *
 * 业务逻辑：
 * 1. 验证订单参数
 * 2. 转换条件单类型
 * 3. 评估 TWAP 需求
 * 4. 格式化订单大小
 */

import type { IContract } from "../../types";
import { toPrecisionString } from "../../utils";
import { SymbolEntity } from "../entities/Symbol";
import {
  type OrderValidationContext,
  type OrderValidationResult,
  OrderValidator,
} from "../validators/OrderValidator";
import { OrderType } from "../value-objects";
import { OrderTypeConverter } from "./OrderTypeConverter";
import { type TwapEvaluationContext, type TwapEvaluationResult, TwapEvaluator } from "./TwapEvaluator";

// TODO:
type CreateOrderCommandParams = any;

/**
 * 订单准备上下文
 */
export interface OrderPreparationContext {
  /** 是否已连接钱包并签名 */
  isWalletConnected: boolean;
  /** 合约信息 */
  symbolInfo: SymbolEntity;
  /** 当前价格（用于类型转换） */
  currentPrice: number;
  /** 触发价格（原始，未转换） */
  triggerPrice: number;
  /** 触发价格类型 */
  triggerPriceType?: string;
}

/**
 * 订单准备结果
 */
export interface OrderPreparationResult {
  /** 是否验证通过 */
  isValid: boolean;
  /** 验证错误信息 key（如果验证失败） */
  validationError?: string;
  /** 原始订单类型 */
  originalType: string;
  /** 转换后的订单类型 */
  convertedType: OrderType;
  /** 准备好的订单参数（已验证和转换后） */
  preparedParams: CreateOrderCommandParams;
  /** TWAP 评估结果 */
  twapEvaluation: TwapEvaluationResult;
  /** 是否需要大小调整 */
  needsSizeAdjustment: boolean;
  /** 建议的订单大小（如果需要调整） */
  suggestedSize?: number;
  /** 调整原因 */
  adjustmentReason?: "twap" | "limit";
}

/**
 * 订单准备服务
 *
 * 负责准备创建订单所需的所有业务逻辑处理
 */
export class OrderPreparationService {
  /**
   * 准备订单参数
   *
   * 执行所有业务逻辑处理：验证、转换、评估、格式化
   *
   * @param params 原始订单参数
   * @param context 准备上下文
   * @returns 准备结果
   */
  static prepare(
    params: CreateOrderCommandParams & {
      maxBuyQTY?: string | number;
      maxSellQTY?: string | number;
      showEqualValInput?: boolean;
      triggerPriceWithType?: number | string;
      isReverse?: boolean;
    },
    context: OrderPreparationContext,
  ): OrderPreparationResult {
    const { symbolInfo, isWalletConnected, currentPrice, triggerPrice } = context;
    const originalType = params.type;

    // 1. 执行验证（调用 Domain 层）
    const validationResult = OrderValidator.validate({
      isWalletConnected,
      orderType: params.type,
      side: params.side,
      price: params.price,
      size: params.size,
      triggerPrice: params.triggerPrice,
      reduceOnly: params.reduceOnly,
      maxBuyQty: params.maxBuyQTY,
      maxSellQty: params.maxSellQTY,
      showEqualValInput: params.showEqualValInput,
    });

    // 如果验证失败，返回错误
    if (!validationResult.isValid) {
      return {
        isValid: false,
        validationError: validationResult.errorKey,
        originalType,
        convertedType: originalType,
        preparedParams: params as CreateOrderCommandParams,
        twapEvaluation: {
          needsTwap: false,
          exceedsLimitOrderSize: false,
        },
        needsSizeAdjustment: false,
      };
    }

    // 2. 转换条件单类型（调用 Domain 层）
    const convertedType = OrderTypeConverter.convert(
      params.type,
      params.side,
      currentPrice,
      triggerPrice,
    );

    // 3. 准备转换后的参数
    const preparedParams: CreateOrderCommandParams = {
      ...params,
      type: convertedType,
    };

    // 4. 评估 TWAP 需求（使用原始 orderType）
    const maxMarketPositionSize = Number(symbolInfo?.maxMarketPositionSize) || 0;
    const maxOrderSize = Number(symbolInfo?.maxOrderSize) || 0;
    const orderSize = Number(params.size) || 0;

    const twapEvaluationContext: TwapEvaluationContext = {
      orderType: originalType, // 使用原始类型评估
      orderSize,
      maxMarketPositionSize,
      maxOrderSize,
      isReduceOnly: !!params.reduceOnly,
    };

    const twapEvaluation = TwapEvaluator.evaluate(twapEvaluationContext);

    // 5. 判断是否需要大小调整
    const needsSizeAdjustment = twapEvaluation.needsTwap || twapEvaluation.exceedsLimitOrderSize;

    // 6. 确定调整原因
    let adjustmentReason: "twap" | "limit" | undefined;
    if (twapEvaluation.needsTwap) {
      adjustmentReason = "twap";
    } else if (twapEvaluation.exceedsLimitOrderSize) {
      adjustmentReason = "limit";
    }

    // 7. 格式化订单大小（如果不需要调整）
    let formattedSize = params.size;
    if (!needsSizeAdjustment) {
      formattedSize = toPrecisionString(params.size, symbolInfo.sizePrecision);
    }

    return {
      isValid: true,
      originalType,
      convertedType,
      preparedParams: {
        ...preparedParams,
        size: formattedSize,
      },
      twapEvaluation,
      needsSizeAdjustment,
      suggestedSize: twapEvaluation.suggestedSize,
      adjustmentReason,
    };
  }

  /**
   * 重新计算调整后的订单准备结果
   *
   * 当用户确认大小调整后，需要重新计算 TWAP 状态（使用转换后的类型）
   *
   * @param preparationResult 原始准备结果
   * @param adjustedSize 调整后的订单大小
   * @param context 准备上下文
   * @returns 重新计算后的准备结果
   */
  static recalculateAfterSizeAdjustment(
    preparationResult: OrderPreparationResult,
    adjustedSize: string | number,
    context: OrderPreparationContext,
  ): OrderPreparationResult {
    const { symbolInfo } = context;
    const maxMarketPositionSize = Number(symbolInfo?.maxMarketPositionSize) || 0;
    const maxOrderSize = Number(symbolInfo?.maxOrderSize) || 0;
    const orderSize = Number(adjustedSize) || 0;

    // 使用转换后的类型重新评估
    const twapEvaluationContext: TwapEvaluationContext = {
      orderType: preparationResult.convertedType as OrderType,
      orderSize,
      maxMarketPositionSize,
      maxOrderSize,
      isReduceOnly: !!preparationResult.preparedParams.reduceOnly,
    };

    const twapEvaluation = TwapEvaluator.evaluate(twapEvaluationContext);

    // 格式化订单大小
    const formattedSize = toPrecisionString(adjustedSize, symbolInfo.sizePrecision);

    return {
      ...preparationResult,
      preparedParams: {
        ...preparationResult.preparedParams,
        size: formattedSize,
      },
      twapEvaluation,
      needsSizeAdjustment: false, // 已经调整过，不再需要调整
      suggestedSize: undefined,
      adjustmentReason: undefined,
    };
  }
}
