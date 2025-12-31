import type { PositionTransactionEntry } from "../../types";
import { PositionTransaction } from "../entities/PositionTransaction";
import { SymbolEntity } from "../entities/Symbol";

/**
 * PositionTransaction Factory
 */
export class PositionTransactionFactory {
  /**
   * 从原始数据创建 PositionTransaction 实体列表
   */
  static createPositionTransactionsFromRaw(
    entries: PositionTransactionEntry[],
    symbols: SymbolEntity[],
  ): PositionTransaction[] {
    if (!entries || !symbols || entries.length === 0) {
      return [];
    }

    const contractMap = new Map(symbols.map((c) => [c.contractId, c]));

    return entries
      .map((entry) => {
        const symbol = contractMap.get(entry.contractId);
        if (!symbol) return null;
        return new PositionTransaction(symbol, entry);
      })
      .filter((p): p is PositionTransaction => p !== null);
  }
}
