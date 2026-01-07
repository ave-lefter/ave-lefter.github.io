export interface WSOptions {
  url: string
  pingTimeout?: number      // 心跳发送间隔 (ms)
  reconnectLimit?: number   // 最大重连次数
  pingMsg?: string          // 心跳发送内容
  reconnectInterval?: number // 基础重连延迟单位 (ms)
  connectTimeout?: number    // 连接握手超时时间 (ms)
  maxQueueLength?: number    // 离线消息队列最大长度
  queueTimeout?: number      // 离线消息在队列中的有效时间 (ms)
  protocols?: string
  onopen?: (event: Event) => void
  onclose?: (event: CloseEvent) => void
  onerror?: (event: Event) => void
  onmessage?: (event: MessageEvent) => void
}

type MessageListener = (e: MessageEvent) => void

export default class WS {
  private url: string
  private protocols: string | undefined
  private pingTimeout: number
  private reconnectLimit: number
  private pingMsg: string
  private reconnectInterval: number
  private connectTimeout: number
  private maxQueueLength: number
  private queueTimeout: number

  private ws: WebSocket | null = null
  private pingTimer: ReturnType<typeof setTimeout> | null = null
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private connectTimer: ReturnType<typeof setTimeout> | null = null

  private reconnectCount = 0
  private forbidReconnect = false
  private isReconnecting = false // 竞争锁：防止多个重连逻辑同时运行
  private isAlive = true         // 记录心跳是否收到响应

  private reconnectMessage: Record<string, string> = {}
  private pendingQueue: { msg: string; timestamp: number }[] = []

  private onopenHandler?: WSOptions['onopen']
  private oncloseHandler?: WSOptions['onclose']
  private onerrorHandler?: WSOptions['onerror']

  private messageListenerMap = new Map<string | number, MessageListener>()
  private nextListenerId = 1

  constructor(options: WSOptions) {
    const {
      url,
      pingTimeout = 12000,
      reconnectLimit = 10,
      pingMsg = '{"jsonrpc": "2.0", "method": "ping", "id": 1}',
      reconnectInterval = 2000,
      connectTimeout = 30000,
      maxQueueLength = 100,
      queueTimeout = 300000,
      protocols,
      onopen,
      onclose,
      onerror,
      onmessage
    } = options

    this.url = url
    this.protocols = protocols
    this.pingTimeout = pingTimeout
    this.reconnectLimit = reconnectLimit
    this.pingMsg = pingMsg
    this.reconnectInterval = reconnectInterval
    this.connectTimeout = connectTimeout
    this.maxQueueLength = maxQueueLength
    this.queueTimeout = queueTimeout

    this.onopenHandler = onopen
    this.oncloseHandler = onclose
    this.onerrorHandler = onerror
    if (onmessage) this.onmessage(onmessage)

    this.initNetworkMonitor()
    this.createWebSocket()
  }

  /**
   * 1. 监听浏览器网络状态：网络恢复时立即重连
   */
  private initNetworkMonitor() {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('online', this.handleOnline)
    }
  }

  private handleOnline = () => {
    console.log('[WS] 监测到网络恢复，尝试重连...')
    this.reconnectCount = 0 // 网络恢复时优先给予重连机会
    this.reconnect()
  }

  private createWebSocket(reconnectMessage?: Record<string, string>) {
    // 销毁旧实例，清理事件
    if (this.ws) {
      this.ws.onopen = this.ws.onclose = this.ws.onerror = this.ws.onmessage = null
      this.ws.close()
    }

    try {
      this.ws = new WebSocket(this.url, this.protocols)
      this.isReconnecting = false

      this.ws.onopen = (event) => {
        console.log('[WS] 连接成功')
        this.resetStatus()

        // 恢复订阅消息
        const allMsgs = Object.values(reconnectMessage ?? this.reconnectMessage)
        allMsgs.forEach(msg => this.send(msg))

        // 处理离线消息队列
        if (this.pendingQueue.length > 0) this.sendQueue()

        this.onopenHandler?.(event)
      }

      this.ws.onmessage = (event) => {
        this.isAlive = true // 收到任何消息均证明链路通畅
        this.handleMessage(event)
      }

      this.ws.onclose = (event) => {
        console.warn('[WS] 连接关闭', event.code)
        this.oncloseHandler?.(event)
        this.reconnect()
      }

      this.ws.onerror = (event) => {
        this.onerrorHandler?.(event)
      }

      this.startConnectTimeout()
    } catch (err) {
      this.reconnect()
    }
  }

  private handleMessage(event: MessageEvent) {
    this.heartBeat() // 重置心跳计时
    this.messageListenerMap.forEach((fn) => fn(event))
  }

  /**
   * 2. 指数避让重连：防止在服务端异常时所有客户端高频请求
   */
  private reconnect() {
    if (this.forbidReconnect || this.isReconnecting) return
    if (this.reconnectCount >= this.reconnectLimit) {
      console.error('[WS] 达到最大重连次数限制')
      return
    }

    this.isReconnecting = true
    this.clearAllTimer()

    // 延迟时间随次数增加：2s, 4s, 8s, 16s... 最大 30s
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectCount),
      30000
    )

    this.reconnectTimer = setTimeout(() => {
      this.reconnectCount++
      this.createWebSocket(this.reconnectMessage)
    }, delay)
  }

  private startConnectTimeout() {
    if (this.connectTimer) clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => {
      if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
        console.warn('[WS] 连接超时，主动强制关闭')
        this.ws.close()
      }
    }, this.connectTimeout)
  }

  /**
   * 3. 增强型存活检测：发送 Ping 后检查是否有响应
   */
  private heartBeat() {
    if (this.pingTimer) clearTimeout(this.pingTimer)
    this.pingTimer = setTimeout(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return

      this.isAlive = false // 先标记为假，等待 onmessage 置回 true
      this.send(this.pingMsg)

      // 5秒内如果没有收到任何回包，视为“假在线”，手动断开触发重连
      setTimeout(() => {
        if (!this.isAlive && this.ws) {
          console.warn('[WS] 心跳无响应，链路可能已断开')
          this.ws.close()
        }
      }, 5000)

      this.heartBeat()
    }, this.pingTimeout)
  }

  public send(msg: string | Record<string, any>) {
    let messageToSend: string
    if (typeof msg === 'string') {
      messageToSend = msg
    } else {
      try {
        messageToSend = JSON.stringify(msg)
      } catch (err) {
        return
      }
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.pendingQueue.length >= this.maxQueueLength) this.pendingQueue.shift()
      this.pendingQueue.push({ msg: messageToSend, timestamp: Date.now() })
      return
    }

    this.ws.send(messageToSend)

    // 自动维护订阅记录
    if (messageToSend !== this.pingMsg) {
      try {
        const parsed = JSON.parse(messageToSend)
        const { method, params } = parsed
        const key = params?.[0] || 'default'
        if (method === 'subscribe') {
          this.reconnectMessage[key] = messageToSend
        } else if (method === 'unsubscribe') {
          delete this.reconnectMessage[key]
        }
      } catch (err) { /* ignore */ }
    }
  }

  private sendQueue() {
    const queue = [...this.pendingQueue]
    this.pendingQueue = []
    queue.forEach(({ msg, timestamp }) => {
      if (Date.now() - timestamp <= this.queueTimeout) {
        this.ws?.send(msg)
      }
    })
  }

  private resetStatus() {
    this.isReconnecting = false
    this.reconnectCount = 0
    this.isAlive = true
    this.clearAllTimer()
    this.heartBeat()
  }

  private clearAllTimer() {
    if (this.pingTimer) clearTimeout(this.pingTimer)
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    if (this.connectTimer) clearTimeout(this.connectTimer)
    this.pingTimer = this.reconnectTimer = this.connectTimer = null
  }

  /**
   * 主动断开并销毁
   */
  public close() {
    this.forbidReconnect = true
    this.clearAllTimer()
    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleOnline)
    }
    this.ws?.close()
    this.ws = null
  }

  // --- 事件管理接口 ---

  public onopen(handler: (e: Event) => void) { this.onopenHandler = handler; return this }
  public onclose(handler: (e: CloseEvent) => void) { this.oncloseHandler = handler; return this }
  public onerror(handler: (e: Event) => void) { this.onerrorHandler = handler; return this }

  /**
   * 持续监听
   */
  public onmessage(handler: MessageListener, id?: string | number): string | number {
    const finalId = id ?? this.nextListenerId++
    this.messageListenerMap.set(finalId, handler)
    return finalId
  }

  /**
   * 监听单次（阅后即焚）
   */
  public onceMessage(handler: MessageListener, id?: string | number): string | number {
    const finalId = id ?? this.nextListenerId++
    const onceWrapper = (e: MessageEvent) => {
      handler(e)
      this.offMessage(finalId)
    }
    this.messageListenerMap.set(finalId, onceWrapper)
    return finalId
  }

  public offMessage(id: 'all' | string | number | Array<string | number>): this {
    if (id === 'all') this.messageListenerMap.clear()
    else if (Array.isArray(id)) id.forEach(k => this.messageListenerMap.delete(k))
    else this.messageListenerMap.delete(id)
    return this
  }
}
