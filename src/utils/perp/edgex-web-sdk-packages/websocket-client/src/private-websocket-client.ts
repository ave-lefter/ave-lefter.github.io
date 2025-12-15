import { AccountSnapshotData, OrderUpdateData } from "@edgex/types";
import { BaseWebSocketClient } from "./base-websocket-client";
import { WebSocketClientOptions } from "./types/client.types";

export type PrivateCredential = {
  protocols: string;
  searchParams: string;
};

export type CredentialFactory = () => PrivateCredential | null;

export interface PrivateWebSocketClientOptions extends WebSocketClientOptions {
  credentialFactory: CredentialFactory;
}

export class PrivateWebSocketClient extends BaseWebSocketClient {
  private credentialFactory: CredentialFactory;
  private baseUrl: string;

  constructor(options: PrivateWebSocketClientOptions) {
    super(options);
    this.baseUrl = options.url || "";
    this.credentialFactory = options.credentialFactory;
  }

  public override connect(): void {
    try {
      const creds = this.credentialFactory();
      if (!creds) {
        console.warn("[PrivateWebSocket] Missing credentials, skipping connect");
        return;
      }
      this.options.protocols = creds.protocols;
      this.options.url = `${this.baseUrl}?${creds.searchParams}`;
    } catch (e) {
      console.error("[PrivateWebSocket] Failed to generate credentials", e);
      return;
    }

    super.connect();
  }

  /**
   * Listen to account snapshots (full state).
   */
  public onSnapshot(handler: (data: AccountSnapshotData) => void): () => void {
    this.on("snapshot", handler);
    return () => this.off("snapshot", handler);
  }

  /**
   * Listen to order/position updates (delta).
   */
  public onOrderUpdate(handler: (data: OrderUpdateData) => void): () => void {
    this.on("orderUpdate", handler);
    return () => this.off("orderUpdate", handler);
  }

  /**
   * Listen to asset updates.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onAssetUpdate(handler: (data: any) => void): () => void {
    this.on("assetUpdate", handler);
    return () => this.off("assetUpdate", handler);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected override onMessage(data: any): void {
    super.onMessage(data);

    if (!data || typeof data !== "object") return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message = data as { type?: string; content?: any };
    const { type, content } = message;

    if (type === "trade-event") {
      if (content?.event === "Snapshot") {
        this.emit("snapshot", content.data);
      } else if (content?.event === "ORDER_UPDATE") {
        this.emit("orderUpdate", content.data);
      }
    } else if (type === "assets-event") {
      this.emit("assetUpdate", content?.data || content);
    }
  }
}
