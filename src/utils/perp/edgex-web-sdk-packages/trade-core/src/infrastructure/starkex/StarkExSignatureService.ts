/**
 * StarkEx 签名服务
 *
 * 职责：处理 StarkEx L2 订单签名
 *
 * DDD 原则：
 * - 签名是技术实现细节，属于 Infrastructure 层
 * - 封装 StarkEx 签名的复杂逻辑
 * - 提供清晰的接口给 Application 层使用
 */

import BigNumber from "bignumber.js";
import { clientIdToNonce, generateRandomClientId, SignableOrder } from "@edgex/trade-libs";
// import { OrderType } from "../../domain/constants/trade.constants";
import { IContract } from "@edgex/types";
import { OrderType } from "../../domain/value-objects";
import { STARKEX_CONFIG } from "../constants/StarkExConfig";

/**
 * 需要签名的订单信息
 */
export interface OrderToSign {
  side: string | number;
  type: string;
  price?: string | number;
  size: string | number;
  lastPrice?: string | number;
}

/**
 * StarkEx 签名结果
 */
export interface StarkExSignature {
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
 * 签名服务配置
 */
export interface SignatureServiceConfig {
  /** 合约信息 */
  symbolInfo: IContract;
  /** L2 密钥对 */
  l2Key: any; // L2Keypair from starkex-lib
  /** 账户 ID */
  accountId: string;
  /** 链 ID */
  chainId: string | number;
  /** Taker 费率 */
  takerFeeRate: string | number;
  /** Maker 费率 */
  makerFeeRate: string | number;
}

/**
 * StarkEx 签名服务
 *
 * 处理订单的 L2 签名逻辑
 */
export class StarkExSignatureService {
  /**
   * 计算市价单的 humanPrice
   *
   * L2Value = 如果是买单：盘口价 x 10 x Size，如果是卖单：contract.tickSize x Size
   */
  private static calculateHumanPrice(
    orderType: string,
    side: string | number,
    price: string | number,
    lastPrice: string | number,
    tickSize: string | number,
  ): string {
    const isMarketOrder =
      orderType === OrderType.STOP_MARKET ||
      orderType === OrderType.MARKET ||
      orderType === OrderType.TAKE_PROFIT_MARKET;

    if (isMarketOrder) {
      if (side === "BUY") {
        return BigNumber(price || lastPrice)
          .multipliedBy(STARKEX_CONFIG.MARKET_ORDER_BUY_PRICE_MULTIPLIER)
          .toString();
      } else {
        return String(tickSize);
      }
    } else {
      return String(price);
    }
  }

  /**
   * 签名订单
   *
   * @param order 需要签名的订单信息
   * @param config 签名服务配置
   * @returns StarkEx 签名结果
   */
  static async sign(order: OrderToSign, config: SignatureServiceConfig): Promise<StarkExSignature> {
    const { symbolInfo, l2Key, accountId, chainId, takerFeeRate, makerFeeRate } = config;
    const { side, type, size, price, lastPrice } = order;

    // 1. 生成客户端订单 ID
    const clientId = generateRandomClientId();

    // 2. 计算过期时间
    const expiration = Date.now() + STARKEX_CONFIG.ORDER_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
    const l1Expiration =
      expiration - STARKEX_CONFIG.L1_EXPIRATION_OFFSET_DAYS * 24 * 60 * 60 * 1000;

    // 3. 计算 humanPrice（市价单需要特殊处理）
    const humanPrice = this.calculateHumanPrice(
      type,
      side,
      price || 0,
      lastPrice || 0,
      symbolInfo.tickSize,
    );

    // 4. 计算 L2 价值
    const l2Value = BigNumber(humanPrice).multipliedBy(size).toString();

    // 5. 计算手续费限制
    const limitFee = BigNumber.max(takerFeeRate, makerFeeRate)
      .multipliedBy(l2Value)
      .toFixed(0, BigNumber.ROUND_CEIL);

    // 6. 构建待签名订单
    const orderToSign = {
      humanSize: `${Number(size)}`,
      humanPrice: humanPrice,
      limitFee,
      symbol: symbolInfo.symbol,
      expirationIsoTimestamp: expiration,
      clientId,
      positionId: accountId,
      side,
    };

    // 7. 使用 StarkEx 库进行签名
    const starkOrder = SignableOrder.fromOrder(orderToSign, chainId);
    const signature = await starkOrder.sign(l2Key);

    // 8. 返回签名结果
    return {
      clientOrderId: clientId,
      expireTime: l1Expiration.toString(),
      l2Nonce: "" + clientIdToNonce(clientId),
      l2Value,
      l2Size: size,
      l2LimitFee: limitFee,
      l2ExpireTime: expiration.toString(),
      l2Signature: signature,
    };
  }

  /**
   * 批量签名订单
   *
   * 用于 TWAP 拆单场景
   *
   * @param orders 需要签名的订单列表
   * @param config 签名服务配置
   * @returns 签名结果列表
   */
  static async signBatch(
    orders: OrderToSign[],
    config: SignatureServiceConfig,
  ): Promise<StarkExSignature[]> {
    return Promise.all(orders.map((order) => this.sign(order, config)));
  }
}
