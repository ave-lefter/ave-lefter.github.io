import type { IContract, PositionEntry, PositionTermListEntry } from "../../types"
import { SymbolEntity } from "../entities/Symbol";
import { Position } from "../entities/Position";
import { PositionTerm } from "../entities/PositionTerm";

/**
 * Position Factory
 * 负责创建 Position 聚合根实例，封装创建过程中的复杂性（如数据关联、过滤）
 */
export class PositionFactory {
  /**
   * 从原始数据创建 Position 实体列表
   * 业务规则：
   * 1. 过滤掉 openSize 为 0 的无效仓位
   * 2. 关联 Contract 信息
   * 3. 忽略找不到 Contract 的仓位数据
   *
   * @param entries 原始仓位数据列表
   * @param symbols 合约配置列表
   */
  static createPositionsFromRaw(entries: PositionEntry[], symbols: SymbolEntity[]): Position[] {
    if (!entries || !symbols || entries.length === 0 || symbols.length === 0) {
      return [];
    }

    const contractMap = new Map(symbols.map((c) => [c.contractId, c]));

    return entries
      .filter((entry) => Number(entry.openSize) !== 0)
      .map((entry) => {
        const contract = contractMap.get(entry.contractId);
        if (!contract) {
          // Log warning? For now just skip.
          return null;
        }
        return new Position(contract, entry);
      })
      .filter((p): p is Position => p !== null);
  }

  /**
   * 从原始数据创建 PositionTerm 实体列表
   * 业务规则：
   * 1. 关联 Contract 信息
   * 2. 关联 Position 信息 (Current Position)
   * 3. 忽略找不到 Contract 的历史数据
   */
  static createPositionTermsFromRaw(
    entries: PositionTermListEntry[],
    positions: Position[],
    symbols: SymbolEntity[],
  ): PositionTerm[] {
    if (!entries || !symbols || entries.length === 0) {
      return [];
    }

    const symboltMap = new Map(symbols.map((c) => [c.contractId, c]));
    const positionMap = new Map((positions || []).map((p) => [p.contractId, p]));

    return entries
      .map((entry) => {
        const contract = symboltMap.get(entry.contractId);
        if (!contract) return null;

        const position = positionMap.get(entry.contractId);
        return new PositionTerm(contract, position, entry);
      })
      .filter((p): p is PositionTerm => p !== null);
  }
}
