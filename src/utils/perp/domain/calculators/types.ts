/**
 * Calculator 类型定义
 *
 * 纯数据结构，用于 calculator 函数的输入输出。
 * 这些类型只包含原始值和简单对象，不依赖领域实体。
 */

import type BigNumber from "bignumber.js";

// ============================================================================
// 通用类型
// ============================================================================

export type PositionSide = "LONG" | "SHORT";
export type OrderSide = "BUY" | "SELL";
export type NumericValue = string | number | BigNumber;

// ============================================================================
// 保证金计算类型
// ============================================================================

/**
 * 订单冻结金额计算输入
 */
export interface OrderFrozenAmountInput {
  /** 预言机价格（标记价格） */
  oraclePrice: NumericValue;
  /** 初始保证金率 = 1 / 杠杆 */
  initialMarginRate: NumericValue;
  /** 订单数量（多仓为正，空仓为负） */
  size: NumericValue;
  /** 订单价值 = 数量 × 价格 */
  value: NumericValue;
  /** 手续费率（如 0.0005 表示 0.05%） */
  feeRate: NumericValue;
}

/**
 * 订单保证金详细计算输入
 */
export interface OrderMarginInput {
  /** 预言机价格 */
  oraclePrice: NumericValue;
  /** 订单价格（限价或预估市价） */
  orderPrice: NumericValue;
  /** 订单数量 */
  size: NumericValue;
  /** 杠杆倍数 */
  leverage: NumericValue;
  /** 手续费率 */
  feeRate: NumericValue;
}

/**
 * 保证金明细结果
 */
export interface MarginBreakdown {
  /** 订单价值 = 价格 × 数量 */
  orderValue: string;
  /** 潜在亏损（价差损失） */
  potentialLoss: string;
  /** 初始保证金 = |数量| × 预言机价格 × (1/杠杆) */
  initialMargin: string;
  /** 手续费 = |订单价值| × 手续费率 */
  fee: string;
  /** 总保证金 = 潜在亏损 + 初始保证金 + 手续费 */
  totalMargin: string;
}

// ============================================================================
// 盈亏计算类型
// ============================================================================

/**
 * 未实现盈亏计算输入
 */
export interface UnrealizedPnLInput {
  /** 仓位方向 */
  side: PositionSide;
  /** 开仓均价 */
  entryPrice: NumericValue;
  /** 当前标记价格 */
  markPrice: NumericValue;
  /** 仓位数量（绝对值） */
  size: NumericValue;
}

/**
 * ROE（权益回报率）计算输入
 */
export interface ROEInput extends UnrealizedPnLInput {
  /** 杠杆倍数 */
  leverage: NumericValue;
}

/**
 * 目标价格计算输入
 */
export interface TargetPriceInput {
  /** 仓位方向 */
  side: PositionSide;
  /** 开仓价格 */
  entryPrice: NumericValue;
  /** 仓位数量 */
  size: NumericValue;
  /** 杠杆倍数 */
  leverage: NumericValue;
  /** 目标收益（金额或比例，取决于 profitType） */
  targetProfit: NumericValue;
  /** 收益类型 */
  profitType: "amount" | "rate";
}

/**
 * 收益计算输入
 */
export interface ProfitInput {
  /** 仓位方向 */
  side: PositionSide;
  /** 开仓价格 */
  entryPrice: NumericValue;
  /** 平仓价格 */
  exitPrice: NumericValue;
  /** 仓位数量 */
  size: NumericValue;
  /** 杠杆倍数 */
  leverage: NumericValue;
}

/**
 * 收益计算结果
 */
export interface ProfitResult {
  /** 仓位保证金 = 开仓价格 × 数量 / 杠杆 */
  margin: string;
  /** 收益金额 */
  profitAmount: string;
  /** 收益率（百分比）= 收益金额 / 保证金 × 100 */
  profitRate: string;
}

// ============================================================================
// 强平价计算类型
// ============================================================================

/**
 * 简单强平价计算输入（固定维持保证金率）
 */
export interface SimpleLiquidationInput {
  /** 仓位方向 */
  side: PositionSide;
  /** 开仓价格 */
  entryPrice: NumericValue;
  /** 仓位数量 */
  size: NumericValue;
  /** 可用抵押品余额 */
  collateral: NumericValue;
  /** 维持保证金率 */
  maintenanceMarginRate: NumericValue;
}

/**
 * 风险档位定义（用于分档强平计算）
 */
export interface RiskTierInput {
  /** 该档位的仓位价值上限 */
  positionValueUpperBound: NumericValue;
  /** 该档位的维持保证金率 */
  maintenanceMarginRate: NumericValue;
  /** StarkEx 风险值（原始整数，需除以 2^32） */
  starkExRisk?: NumericValue;
}

/**
 * 分档强平价计算输入
 */
export interface TieredLiquidationInput {
  /** 仓位方向 */
  side: PositionSide;
  /** 开仓价格 */
  entryPrice: NumericValue;
  /** 仓位数量 */
  size: NumericValue;
  /** 可用余额 */
  availableBalance: NumericValue;
  /** 杠杆倍数 */
  leverage: NumericValue;
  /** 风险档位列表（按仓位价值排序） */
  riskTiers: RiskTierInput[];
  /** 价格精度（小数位数） */
  pricePrecision: number;
}

/**
 * 强平计算结果
 */
export interface LiquidationResult {
  /** 预估强平价 */
  liquidationPrice: string;
  /** 适用的维持保证金率 */
  maintenanceMarginRate: string;
  /** 维持保证金金额 */
  maintenanceMargin: string;
  /** 初始保证金金额 */
  initialMargin: string;
  /** 迭代次数（用于迭代计算） */
  iterations?: number;
}

/**
 * StarkEx 抵押品账户信息
 */
export interface StarkExCollateralInfo {
  /** 账户总权益 */
  totalEquity: NumericValue;
  /** 账户总 StarkEx 风险价值 */
  starkExRiskValue: NumericValue;
  /** 待处理提现金额 */
  pendingWithdrawAmount: NumericValue;
  /** 待处理转出金额 */
  pendingTransferOutAmount: NumericValue;
}

/**
 * StarkEx 最差平仓价计算输入
 */
export interface StarkExWorstClosePriceInput {
  /** 预言机价格 */
  oraclePrice: NumericValue;
  /** 仓位开仓数量（多仓为正，空仓为负） */
  openSize: NumericValue;
  /** 风险档位列表 */
  riskTiers: RiskTierInput[];
  /** 价格精度（tickSize 的小数位数） */
  pricePrecision: number;
  /** 抵押品账户信息 */
  collateralInfo: StarkExCollateralInfo;
  /** 手续费率 */
  feeRate: NumericValue;
}

/**
 * StarkEx 强平价计算输入
 */
export interface StarkExLiquidationPriceInput {
  /** 预言机价格 */
  oraclePrice: NumericValue;
  /** 仓位开仓数量（多仓为正，空仓为负） */
  openSize: NumericValue;
  /** 风险档位列表 */
  riskTiers: RiskTierInput[];
  /** 价格精度（tickSize） */
  tickSize: NumericValue;
  /** 抵押品账户信息 */
  collateralInfo: StarkExCollateralInfo;
}

// ============================================================================
// 价格计算类型
// ============================================================================

/**
 * 从 ROE 计算止盈止损触发价输入
 */
export interface TPSLFromROEInput {
  /** 开仓价格 */
  entryPrice: NumericValue;
  /** 目标 ROE 百分比（如 50 表示 50%） */
  roe: NumericValue;
  /** 仓位杠杆 */
  leverage: NumericValue;
  /** 止盈止损订单方向（BUY 平空，SELL 平多） */
  orderSide: OrderSide;
  /** 价格精度（小数位数） */
  pricePrecision: number;
}

/**
 * 从触发价计算 ROE 输入
 */
export interface ROEFromPriceInput {
  /** 开仓价格 */
  entryPrice: NumericValue;
  /** 触发价格 */
  triggerPrice: NumericValue;
  /** 仓位杠杆 */
  leverage: NumericValue;
  /** 仓位方向 */
  positionSide: PositionSide;
  /** 是否为止盈（true）或止损（false） */
  isTakeProfit: boolean;
}

/**
 * 均价计算条目
 */
export interface AveragePriceEntry {
  /** 成交价格 */
  price: NumericValue;
  /** 成交数量 */
  quantity: NumericValue;
}

/**
 * 订单簿档位（用于市价计算）
 */
export interface OrderbookLevel {
  /** 价格档位 */
  price: NumericValue;
  /** 该档位可用数量 */
  size: NumericValue;
}

/**
 * 市价订单执行价格计算输入
 */
export interface MarketPriceInput {
  /** 订单数量 */
  size: NumericValue;
  /** 订单方向 */
  side: OrderSide;
  /** 订单簿档位（按价格排序） */
  orderbook: OrderbookLevel[];
  /** 兜底价格（订单簿深度不足时使用） */
  fallbackPrice: NumericValue;
  /** 滑点缓冲（如 0.01 表示 1%） */
  slippageBuffer?: number;
}
