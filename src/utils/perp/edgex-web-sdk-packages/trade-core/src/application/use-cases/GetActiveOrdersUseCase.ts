import { Order } from "../../domain/entities/Order";
import { OrderFactory } from "../../domain/services/OrderFactory";
import { IContract as ISymbol } from "@edgex/types";
import { OrderEntry } from "@edgex/types";

/**
 * 查询活跃订单的查询条件
 */
export interface GetActiveOrdersInput {
  orderEntries: OrderEntry[];
  symbols: ISymbol[];
  criteria?: {
    /** 合约 ID（可选，用于过滤） */
    contractId?: string;
    /** 订单方向（可选，用于过滤） */
    side?: "BUY" | "SELL";
    /** 是否只返回条件单 */
    conditionalOnly?: boolean;
  };
}

export class GetActiveOrdersUseCase {
  execute(input: GetActiveOrdersInput): Order[] {
    const { orderEntries, symbols, criteria = {} } = input;

    // 1. 从原始数据创建 Order 聚合根
    const orders = OrderFactory.createOrdersFromRaw(orderEntries, symbols);

    // 2. 查询活跃订单
    let result = orders.filter((order) => order.isActive());

    // 按合约过滤
    if (criteria.contractId) {
      result = result.filter((order) => order.contractId === criteria.contractId);
    }

    // 按方向过滤
    if (criteria.side) {
      result = result.filter((order) => order.side === criteria.side);
    }

    // 只返回条件单
    if (criteria.conditionalOnly) {
      result = result.filter((order) => order.isConditional());
    }

    return result;
  }
}
