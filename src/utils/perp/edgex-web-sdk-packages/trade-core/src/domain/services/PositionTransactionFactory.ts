import { IContract, PositionTransactionEntry } from "@edgex/types";
import { PositionTransaction } from "../entities/PositionTransaction";

/**
 * PositionTransaction Factory
 */
export class PositionTransactionFactory {
  /**
   * 从原始数据创建 PositionTransaction 实体列表
   */
  static createPositionTransactionsFromRaw(
    entries: PositionTransactionEntry[] | undefined,
    contracts: IContract[] | undefined
  ): PositionTransaction[] {
    if (!entries || !contracts || entries.length === 0) {
      return [];
    }

    const contractMap = new Map(contracts.map((c) => [c.contractId, c]));

    return entries
      .map((entry) => {
        const contract = contractMap.get(entry.contractId);
        if (!contract) return null;
        return new PositionTransaction(contract, entry);
      })
      .filter((p): p is PositionTransaction => p !== null);
  }
}
