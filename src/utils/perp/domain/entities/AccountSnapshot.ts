import type { AccountInfo, CollateralEntry, OrderEntry, PositionEntry } from "../../types";
import type { AccountSnapshotData } from "../../types"

export class AccountSnapshot {
  constructor(private readonly payload: AccountSnapshotData) {}

  static fromData(data: AccountSnapshotData): AccountSnapshot {
    return new AccountSnapshot(data);
  }

  get accounts(): AccountInfo[] {
    return this.payload.account || [];
  }

  get collaterals(): CollateralEntry[] {
    return this.payload.collateral || [];
  }

  get positions(): PositionEntry[] {
    return this.payload.position || [];
  }

  get orders(): OrderEntry[] {
    return this.payload.order || [];
  }

  get withdraws(): any[] {
    return this.payload.withdraw || [];
  }

  get transferOuts(): any[] {
    return this.payload.transferOut || [];
  }

  toJSON(): AccountSnapshotData {
    return { ...this.payload };
  }
}
