/**
 * 订单参数构建器
 *
 * 职责：构建创建订单所需的 API 请求参数
 *
 * DDD 原则：
 * - 参数构建是技术实现细节，属于 Infrastructure 层
 * - 封装 API 参数的复杂构建逻辑
 * - 与 Domain 模型解耦
 */

import { AccountInfo, IContract, IMetadata } from "@edgex/types";
import { getFeeRate } from "../../domain/calculator";
import { OrderType } from "../../domain/value-objects";
import {
  OrderToSign,
  SignatureServiceConfig,
  StarkExSignature,
  StarkExSignatureService,
} from "../starkex/StarkExSignatureService";
import { DEFAULT_ORDER_EXTRA_DATA_JSON, DEFAULT_ORDER_EXTRA_TYPE } from "./order-params.constants";

/**
 * 创建订单参数
 */
export interface CreateOrderParams {
  price: string | number;
  size: string | number;
  type: string;
  timeInForce?: string;
  reduceOnly?: boolean;
  isPositionTpsl: boolean;
  isSetOpenTp: boolean;
  isSetOpenSl: boolean;
  accountId: string;
  contractId?: string;
  side: string;
  triggerPrice?: string | number;
  triggerPriceType?: string;
  extraType: string;
  extraDataJson: string;
  // L2 签名参数
  clientOrderId: string;
  expireTime: string;
  l2Nonce: string;
  l2Value: string;
  l2Size: string | number;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: string;
  // TPSL
  openTp?: TpSlParams;
  openSl?: TpSlParams;
  // 其他
  [key: string]: any;
}

/**
 * 止盈止损参数
 */
export interface TpSlParams {
  side: string | number;
  triggerPrice?: string | number;
  size?: string | number;
  price?: string | number;
  triggerPriceType: string;
  // L2 签名参数
  clientOrderId: string;
  expireTime: string;
  l2Nonce: string;
  l2Value: string;
  l2Size: string | number;
  l2LimitFee: string;
  l2ExpireTime: string;
  l2Signature: string;
}

/**
 * 构建订单参数的选项
 */
export interface BuildOrderParamsOptions {
  side: string;
  price: string | number;
  size: string | number;
  type: string;
  timeInForce?: string;
  reduceOnly?: boolean;
  chainId?: string | number;
  contractId?: string;
  triggerPrice?: string | number;
  lastPrice?: string | number;
  triggerPriceType?: string;
  openSl?: any;
  openTp?: any;
  [key: string]: any;
}

/**
 * 元数据上下文
 */
export interface MetadataContext {
  contractList: IContract[];
}

/**
 * 订单参数构建器
 *
 * 负责构建创建订单所需的所有参数
 */
export class OrderParamsBuilder {
  /**
   * 构建止盈止损参数
   *
   * @param tpSlConfig 止盈止损配置
   * @param size 订单数量
   * @param signatureConfig 签名配置
   * @returns 止盈止损参数
   */
  static async buildTpSlParams(
    tpSlConfig: { side: string | number; triggerPriceType: string; [key: string]: any },
    size: string | number,
    signatureConfig: SignatureServiceConfig,
  ): Promise<TpSlParams> {
    // 止盈止损按市价执行
    const orderToSign: OrderToSign = {
      side: tpSlConfig.side,
      type: OrderType.MARKET,
      size,
      price: 0,
    };

    const signature = await StarkExSignatureService.sign(orderToSign, signatureConfig);

    return {
      ...tpSlConfig,
      ...signature,
      size,
    };
  }

  /**
   * 构建创建订单参数
   *
   * @param options 订单选项
   * @param metadata 元数据上下文
   * @param currentActiveChainId 当前激活的链 ID
   * @returns 创建订单参数
   */
  static async build(
    options: BuildOrderParamsOptions,
    metadata: IMetadata,
    currentActiveAccount: AccountInfo,
    currentActiveChainId?: string | number,
  ): Promise<CreateOrderParams> {
    const {
      side,
      price,
      size,
      type,
      timeInForce,
      reduceOnly,
      chainId = currentActiveChainId,
      contractId,
      triggerPrice,
      lastPrice,
      triggerPriceType,
      openSl,
      openTp,
      ...rest
    } = options;

    const { takerFeeRate, makerFeeRate } = getFeeRate({
      contractId: contractId!,
      account: currentActiveAccount,
      metadata,
    });

    const symbolInfo = metadata.contractList.find((s) => s.contractId == contractId);

    if (!symbolInfo) {
      throw new Error(`Contract not found: ${contractId}`);
    }

    // 构建签名配置
    const signatureConfig: SignatureServiceConfig = {
      symbolInfo,
      l2Key: currentActiveAccount?.keys?.l2Key,
      accountId: currentActiveAccount?.accountId!,
      chainId: chainId!,
      takerFeeRate: takerFeeRate!,
      makerFeeRate: makerFeeRate!,
    };

    // 签名主订单
    const orderToSign: OrderToSign = {
      side,
      type,
      size,
      price,
      lastPrice,
    };

    const signatureObj = await StarkExSignatureService.sign(orderToSign, signatureConfig);

    // 构建基础订单参数
    const createOrderParams: CreateOrderParams = {
      price:
        type == OrderType.MARKET ||
        type == OrderType.STOP_MARKET ||
        type == OrderType.TAKE_PROFIT_MARKET
          ? "0"
          : price,
      size,
      type,
      timeInForce,
      reduceOnly,
      isPositionTpsl: false,
      isSetOpenTp: !!options.openTp,
      isSetOpenSl: !!options.openSl,
      accountId: currentActiveAccount?.accountId!,
      contractId,
      side,
      triggerPrice,
      triggerPriceType,
      // L2 签名参数
      ...signatureObj,
      extraType: DEFAULT_ORDER_EXTRA_TYPE,
      extraDataJson: DEFAULT_ORDER_EXTRA_DATA_JSON,
      ...rest,
    };

    // 构建止盈参数
    if (openTp) {
      createOrderParams.openTp = await this.buildTpSlParams(openTp, size, signatureConfig);
    }

    // 构建止损参数
    if (openSl) {
      createOrderParams.openSl = await this.buildTpSlParams(openSl, size, signatureConfig);
    }

    return createOrderParams;
  }
}
