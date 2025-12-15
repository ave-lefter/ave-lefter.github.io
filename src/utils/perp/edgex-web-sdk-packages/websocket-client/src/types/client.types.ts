export interface WebSocketClientOptions {
  url: string
  /**
   * Protocols for WebSocket constructor
   */
  protocols?: string | string[]
  /**
   * Heartbeat (ping/pong) interval in milliseconds. Default: 3000 (3s).
   * Set to 0 to disable automatic heartbeat.
   */
  heartbeatInterval?: number
  /**
   * Base reconnect interval in milliseconds for exponential backoff. Default: 1000
   */
  reconnectInterval?: number
  /**
   * Maximum reconnect attempts. Default: 0 (Infinite)
   */
  maxReconnectAttempts?: number
  /**
   * Function to generate the subscription message for a topic
   */
  generateSubscribeMessage?: (topic: string) => any
  /**
   * Function to generate the unsubscription message for a topic
   */
  generateUnsubscribeMessage?: (topic: string) => any
}

export type WebSocketEventHandler<T = any> = (data: T) => void

export interface PublicWebSocketClientOptions extends WebSocketClientOptions {
  // Add specific options for Public client if needed in the future
}