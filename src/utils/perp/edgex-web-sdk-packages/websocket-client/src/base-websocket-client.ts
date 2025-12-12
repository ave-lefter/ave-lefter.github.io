import { EventEmitter } from './common/event-emitter'
import { WebSocketClientOptions } from './types/client.types'

const DEFAULT_OPTIONS: Partial<WebSocketClientOptions> = {
  heartbeatInterval: 3000,
  reconnectInterval: 1000,
  maxReconnectAttempts: 0, // Infinite
}

export abstract class BaseWebSocketClient extends EventEmitter {
  protected socket: WebSocket | null = null
  protected options: WebSocketClientOptions

  private isConnected = false
  private isConnecting = false
  private forcedClose = false

  private reconnectAttempts = 0
  // Use ReturnType to support both Node.js and Browser environments without 'any'
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null

  // Reference Counting for subscriptions: Topic -> Count
  private subscriptions: Map<string, number> = new Map()

  // Queue for messages to send when socket is not open
  private messageQueue: string[] = []

  constructor(options: WebSocketClientOptions) {
    super()
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  /**
   * Check if the websocket is currently connected
   */
  public get connected(): boolean {
    return this.isConnected
  }

  public connect(): void {
    if (this.isConnected || this.isConnecting) return

    if (!this.options.url) {
      console.warn('[WebSocket] URL is missing, skipping connection.')
      return
    }

    this.forcedClose = false
    this.isConnecting = true

    try {
      // Handle protocols optional parameter
      if (this.options.protocols) {
        this.socket = new WebSocket(this.options.url, this.options.protocols)
      } else {
        this.socket = new WebSocket(this.options.url)
      }

      this.socket.onopen = this.handleOpen.bind(this)
      this.socket.onclose = this.handleClose.bind(this)
      this.socket.onerror = this.handleError.bind(this)
      this.socket.onmessage = this.handleMessage.bind(this)
    } catch (error) {
      console.error('[WebSocket] Connection failed:', error)
      // Simulate a close event to trigger reconnect logic if needed
      this.handleClose({
        code: 1006,
        reason: 'Connection failed synchronously',
        wasClean: false,
      } as CloseEvent)
    }
  }

  /**
   * Gracefully close the connection.
   * This will stop reconnection attempts.
   */
  public disconnect(): void {
    this.forcedClose = true
    this.stopHeartbeat()
    this.stopReconnect()

    if (this.socket) {
      // Remove listeners to prevent firing during manual close
      this.socket.onopen = null
      this.socket.onclose = null
      this.socket.onerror = null
      this.socket.onmessage = null

      this.socket.close()
      this.socket = null
    }

    this.isConnected = false
    this.isConnecting = false
    this.emit('disconnected')
  }

  /**
   * Completely destroy the client instance.
   * Closes connection and removes all event listeners.
   */
  public destroy(): void {
    this.disconnect()
    this.subscriptions.clear()
    this.messageQueue = []
    this.removeAllListeners()
  }

  public subscribe(topic: string): void {
    const currentCount = this.subscriptions.get(topic) || 0
    this.subscriptions.set(topic, currentCount + 1)

    // Only send subscribe message if this is the first subscription
    if (currentCount === 0) {
      this.sendSubscription(topic)
    }
  }

  public unsubscribe(topic: string): void {
    const currentCount = this.subscriptions.get(topic)
    if (!currentCount) return

    if (currentCount === 1) {
      this.subscriptions.delete(topic)
      this.sendUnsubscription(topic)
    } else {
      this.subscriptions.set(topic, currentCount - 1)
    }
  }

  /**
   * Send raw data to the websocket
   * @param data The data to send
   * @param queueIfOffline Whether to queue the message if the socket is not open. Default: true.
   *                       Set to false for volatile messages like heartbeats.
   */
  protected send(data: any, queueIfOffline = true): void {
    const message = typeof data === 'string' ? data : JSON.stringify(data)

    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message)
    } else if (queueIfOffline) {
      this.messageQueue.push(message)
    }
  }

  private handleOpen(event: Event): void {
    console.info('[WebSocket] Connected to', this.options.url)
    this.isConnected = true
    this.isConnecting = false
    this.reconnectAttempts = 0
    this.emit('connected', event)

    this.processMessageQueue()
    this.resubscribeAll()
    this.startHeartbeat()
  }

  private handleClose(event: CloseEvent): void {
    if (this.isConnected) {
      console.warn(`[WebSocket] Closed: ${event.code} ${event.reason}`)
    }

    this.isConnected = false
    this.isConnecting = false
    this.stopHeartbeat()
    this.emit('disconnected', event)

    if (!this.forcedClose) {
      this.attemptReconnect()
    }
  }

  private handleError(event: Event): void {
    console.error('[WebSocket] Error:', event)
    this.emit('error', event)
    // Usually onError is followed by onClose, so we handle reconnect there
  }

  private async handleMessage(event: MessageEvent): Promise<void> {
    let data = event.data

    try {
      // Handle Blob
      if (data instanceof Blob) {
        data = await data.text()
      }

      // Handle JSON
      if (typeof data === 'string') {
        try {
          // Simple optimization: only parse if it looks like JSON object/array
          const trimmed = data.trim()
          if (
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))
          ) {
            const parsedData = JSON.parse(data)
            this.onMessage(parsedData)
          } else {
            // Treat as raw string if not JSON
            this.onMessage(data)
          }
        } catch (e) {
          console.warn('[WebSocket] Failed to parse JSON message:', data)
          // Fallback to raw string
          this.onMessage(data)
        }
      } else {
        this.onMessage(data)
      }
    } catch (error) {
      console.error('[WebSocket] Error handling message:', error)
    }
  }

  /**
   * To be implemented by subclasses or via events
   */
  protected onMessage(data: any): void {
    this.emit('message', data)
  }

  private sendSubscription(topic: string): void {
    if (this.options.generateSubscribeMessage) {
      this.send(this.options.generateSubscribeMessage(topic))
    } else {
      this.send({ type: 'subscribe', channel: topic })
    }
  }

  private sendUnsubscription(topic: string): void {
    if (this.options.generateUnsubscribeMessage) {
      this.send(this.options.generateUnsubscribeMessage(topic))
    } else {
      this.send({ type: 'unsubscribe', channel: topic })
    }
  }

  private resubscribeAll(): void {
    // Iterate over all topics that have at least one subscriber
    // On reconnect, we need to resend subscription messages for all active topics
    if (this.subscriptions.size > 0) {
      console.info(
        `[WebSocket] Resubscribing to ${this.subscriptions.size} topics...`,
      )
      for (const [topic, count] of this.subscriptions) {
        if (count > 0) {
          this.sendSubscription(topic)
        }
      }
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const msg = this.messageQueue.shift()
      if (msg) this.socket?.send(msg)
    }
  }

  private attemptReconnect(): void {
    if (
      this.options.maxReconnectAttempts &&
      this.reconnectAttempts >= this.options.maxReconnectAttempts
    ) {
      console.error('[WebSocket] Max reconnect attempts reached')
      return
    }

    // Exponential backoff with jitter: min(1s * 2^n, 30s) + jitter
    const baseInterval = this.options.reconnectInterval || 1000
    const baseDelay = Math.min(
      baseInterval * Math.pow(2, Math.min(this.reconnectAttempts, 8)),
      30000,
    )
    const jitter = Math.floor(Math.random() * 1000)
    const delay = baseDelay + jitter

    this.reconnectAttempts++
    console.info(
      `[WebSocket] Reconnecting in ${delay}ms (Attempt ${this.reconnectAttempts})...`,
    )

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  private stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat()

    if (!this.options.heartbeatInterval || this.options.heartbeatInterval <= 0)
      return

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.sendHeartbeat()
      }
    }, this.options.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Can be overridden by subclasses to customize heartbeat payload
   */
  protected sendHeartbeat(): void {
    // Default ping/pong logic
    this.send(
      {
        type: 'pong',
        time: Date.now().toString(),
      },
      false,
    ) // Do not queue heartbeats
  }
}
