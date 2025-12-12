// Import shared entities
import { DepthEntry, KlineEntry, TickerEntry, TradeEntry } from "@edgex/types";

export type MessageDataType = "changed" | "Snapshot";

export type WebSocketContent<T = any> = {
  channel: string;
  dataType: MessageDataType;
  data: T;
};

export type WebSocketMessage<T = any> = {
  type: string;
  channel: string;
  ts: any;
  content: WebSocketContent<T>;
};

export type MessagePayload<T = any> = {
  type: string;
  channel: string;
  timestamp: any;
  dataType: MessageDataType;
  data: T;
};

export type DepthMessage = WebSocketMessage<DepthEntry[]>;

export type TradesMessage = WebSocketMessage<TradeEntry[]>;

export type TickerMessage = WebSocketMessage<TickerEntry[]>;

export type KlineMessage = WebSocketMessage<KlineEntry[]>;
