import { IContract, IMetadata } from "@edgex/types";
import { AccountInfo, PositionEntry } from "@edgex/types";
import { Position } from "../../domain/entities/Position";
import { Ticker } from "../../domain/entities/Ticker";

// Define the snapshot context required for margin calculations
export interface TradingSnapshotContext {
  metadata: IMetadata;
  positionEntries: PositionEntry[]; // Raw position entries from websocket/api
  symbolsList: IContract[];
  activeAccount: AccountInfo;
  withdraws: any[];
  transferOuts: any[];
  activeOrders: any[]; // Raw order entries
  collaterals: any[];
}

export interface ReversePositionInput {
  accountId: string;
  contractId: string;
  symbolName: string; // e.g. "BTCUSDT"
  targetPosition: Position; // The position object to reverse
  lastPrice: string; // Ticker last price
  snapshot: TradingSnapshotContext;
  currentActiveAccount: any;
  tickers: Map<string, Ticker>;
}
