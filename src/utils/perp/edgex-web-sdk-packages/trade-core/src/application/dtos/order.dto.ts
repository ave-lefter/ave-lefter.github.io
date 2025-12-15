import { AccountInfo, IContract, IMetadata } from "@edgex/types";

/**
 * 订单命令共享类型定义
 *
 * 用于避免循环依赖，统一管理命令相关的类型定义
 */

/**
 * 创建订单命令参数
 */
export interface CreateOrderCommandParams {
  /** 订单方向 */
  side: string;
  /** 订单类型 */
  type: string;
  /** 价格 */
  price: string | number;
  /** 数量 */
  size: string | number;
  /** 合约 ID */
  contractId?: string;
  /** 有效期类型 */
  timeInForce?: string;
  /** 是否只减仓 */
  reduceOnly?: boolean;
  /** 触发价格 */
  triggerPrice?: string | number;
  /** 触发价格类型 */
  triggerPriceType?: string;
  /** 最后价格 */
  lastPrice?: string | number;
  /** 链 ID */
  chainId?: string | number;
  /** 止盈参数 */
  openTp?: any;
  /** 止损参数 */
  openSl?: any;
  /** 错误处理器 */
  onErrorHandler?: (msg: string, params?: Record<string, any>, type?: string) => void;
  /** 其他参数 */
  [key: string]: any;
}

/**
 * 创建订单命令结果
 */
export interface CreateOrderCommandResult {
  /** API 响应 */
  data: any;
  /** 是否成功 */
  success: boolean;
}

/**
 * TWAP 订单结果
 */
export interface TwapOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

// ==========================================
// Use Case Inputs (Moved from ports)
// ==========================================

export interface CreateOrderInput {
  params: CreateOrderCommandParams;
  metadata: IMetadata;
  currentActiveAccount: AccountInfo;
  currentActiveChainId?: string | number;
}

export interface CreateTwapOrderInput extends CreateOrderInput {
  symbolInfo: IContract;
}

export interface CancelOrderInput {
  accountId: string;
  orderIds: string[];
}

export interface CancelAllOrdersInput {
  accountId: string;
  filterCoinIdList?: string[];
  filterContractIdList?: string[];
  filterOrderTypeList?: string[];
  filterOrderStatusList?: string[];
}
