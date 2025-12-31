/**
 * Domain Context Types
 *
 * 定义领域服务所需的上下文对象接口。
 * 上下文对象封装了服务运行所需的共享状态，避免方法签名中重复传递大量参数。
 *
 * 设计原则：
 * - 上下文是不可变的，创建后不应修改
 * - 上下文应在调用层（Hooks/Use Cases）构建，传递给 Service
 * - 方法只接收"变化的"参数，"不变的"从上下文获取
 */

import type { IMetadata } from "../../types";
import { Account } from "../entities/Account";
import { Collateral } from "../entities/Collateral";
import { Order } from "../entities/Order";
import { Position } from "../entities/Position";
import { SymbolEntity } from "../entities/Symbol";
import { Ticker } from "../entities/Ticker";
import { Withdraw } from "../entities/Withdraw";
import { TransferOut } from "../entities/TransferOut";

/**
 * 交易上下文 - 包含交易计算所需的所有共享数据
 *
 * 使用场景：
 * - AccountRiskService: 计算账户风险指标
 * - 跨合约的计算场景
 */
export interface TradingContext {
  // 账户数据
  account: Account;
  collaterals: Collateral[];
  positions: Position[];
  orders: Order[];
  withdraws: Withdraw[];
  transferOuts: TransferOut[];

  // 市场数据
  metadata: IMetadata;
  symbolsList: SymbolEntity[];
  tickers: Map<string, Ticker>;
}

/**
 * 订单执行上下文 - 针对特定合约的订单操作
 *
 * 继承 TradingContext，额外包含当前操作合约的信息。
 *
 * 使用场景：
 * - OrderExecutionService: 计算最大下单数量、下单成本、清算价格
 */
export interface OrderExecutionContext extends TradingContext {
  /** 当前操作的合约 */
  symbol: SymbolEntity;
  /** 当前合约的行情数据 */
  ticker: Ticker;
  /** 当前合约的持仓（可选，可能无持仓） */
  position?: Position;
}

/**
 * 用于清算价格计算的抵押品信息
 */
export interface CollateralInfo {
  totalEquity: string;
  starkExRiskValue: string;
  pendingWithdrawAmount: string;
  pendingTransferOutAmount: string;
}

// ============================================================================
// 原始数据上下文（用于从 UI 层传入）
// ============================================================================

import type { AccountInfo, CollateralEntry, IWithdraw, ITransferOut, OrderEntry } from "../../types";
import { OrderFactory } from "../services/OrderFactory";

/**
 * 订单计算原始上下文 - 使用原始数据类型
 *
 * 用于从 UI 层（React Hooks）传入数据，内部会转换为实体类型
 */
export interface OrderCalculationRawContext {
  contractId: string;
  metadata: IMetadata;
  account: AccountInfo | null;
  positions: Position[];
  orders: OrderEntry[];
  collaterals: CollateralEntry[];
  withdraws: IWithdraw[];
  transfers: ITransferOut[];
  symbolsList: SymbolEntity[];
  tickers: Map<string, Ticker>;
}

/**
 * 从原始上下文构建 OrderExecutionContext
 *
 * 将原始数据类型转换为领域实体，构建完整的执行上下文
 */
export function buildOrderExecutionContext(
  ctx: OrderCalculationRawContext,
): OrderExecutionContext | null {
  const symbol = ctx.symbolsList.find((s) => s.contractId === ctx.contractId);
  if (!symbol) return null;

  const accountEntity = ctx.account ? Account.fromRaw(ctx.account) : null;
  if (!accountEntity) return null;

  const ticker = ctx.tickers.get(symbol.contractName) || Ticker.fromEmpty();
  const position = ctx.positions.find((p) => p.contractId === ctx.contractId);

  return {
    symbol,
    ticker,
    position,
    account: accountEntity,
    collaterals: (ctx.collaterals || []).map((c) => Collateral.fromRaw(c)),
    positions: ctx.positions,
    orders: OrderFactory.createOrdersFromRaw(ctx.orders, ctx.symbolsList),
    withdraws: (ctx.withdraws || []).map((w) => Withdraw.fromRaw(w)),
    transferOuts: (ctx.transfers || []).map((t) => TransferOut.fromRaw(t)),
    metadata: ctx.metadata,
    symbolsList: ctx.symbolsList,
    tickers: ctx.tickers,
  };
}
