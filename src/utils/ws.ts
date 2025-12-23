export interface WSOptions {
  url: string
  pingTimeout?: number
  reconnectLimit?: number
  pingMsg?: string
  reconnectInterval?: number
  connectTimeout?: number
  maxQueueLength?: number
  queueTimeout?: number
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

  private reconnectMessage: Record<string, string> = {}
  private pendingQueue: { msg: string; timestamp: number }[] = []

  private onopenHandler?: WSOptions['onopen']
  private oncloseHandler?: WSOptions['onclose']
  private onerrorHandler?: WSOptions['onerror']

  private messageListenerMap = new Map<string | number, MessageListener>()
  private nextListenerId = 1

  constructor({
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
  }: WSOptions) {
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

    this.createWebSocket()
  }

  private createWebSocket(reconnectMessage?: Record<string, string>) {
    try {
      this.ws = new WebSocket(this.url, this.protocols)

      this.ws.onopen = (event) => {
        this.resetStatus()

        const allMsgs = Object.values(reconnectMessage ?? this.reconnectMessage)
        for (const msg of allMsgs) {
          this.send(msg)
        }

        if (this.pendingQueue.length > 0) {
          this.sendQueue()
        }

        this.onopenHandler?.(event)
      }

      this.ws.onmessage = (event) => this.handleMessage(event)

      this.ws.onclose = (event) => {
        this.oncloseHandler?.(event)
        this.reconnect()
      }

      this.ws.onerror = (event) => this.onerrorHandler?.(event)

      this.timeoutClose()
    } catch (err) {
      console.error('WebSocket 创建失败', err)
      throw err
    }
  }

  private handleMessage(event: MessageEvent) {
    this.heartBeat()
    this.timeoutClose()
    this.messageListenerMap.forEach((fn) => fn(event))
  }

  private sendQueue() {
    const queueToSend = [...this.pendingQueue]
    this.pendingQueue = []
    queueToSend.forEach(({ msg, timestamp }) => {
      if (Date.now() - timestamp <= this.queueTimeout) {
        this.ws?.send(msg)
      }
    })
  }

  public send(msg: string | Record<string, any>) {
    let messageToSend: string
    if (typeof msg === 'string') {
      messageToSend = msg
    } else {
      try {
        messageToSend = JSON.stringify(msg)
      } catch (err) {
        console.warn('无法序列化消息:', msg, err)
        return
      }
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      if (this.pendingQueue.length >= this.maxQueueLength) {
        this.pendingQueue.shift()
      }
      this.pendingQueue.push({ msg: messageToSend, timestamp: Date.now() })
      return
    }

    this.ws.send(messageToSend)

    if (messageToSend !== this.pingMsg) {
      try {
        const parsed = JSON.parse(messageToSend)
        const method = parsed?.method
        const event = parsed?.params?.[0]
        if (method === 'subscribe') {
          this.reconnectMessage[event] = messageToSend
        } else if (method === 'unsubscribe') {
          Reflect.deleteProperty(this.reconnectMessage, event)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  private heartBeat() {
    if (this.pingTimer) clearTimeout(this.pingTimer)
    this.pingTimer = setTimeout(() => {
      this.send(this.pingMsg)
      this.heartBeat()
    }, this.pingTimeout)
  }

  private timeoutClose() {
    if (this.connectTimer) clearTimeout(this.connectTimer)
    this.connectTimer = setTimeout(() => {
      this.ws?.close()
    }, this.connectTimeout)
  }

  private reconnect() {
    this.clearAllTimer()
    if (this.forbidReconnect) return
    if (this.reconnectCount >= this.reconnectLimit) {
      this.ws = null
      return
    }

    this.reconnectTimer = setTimeout(() => {
      this.reconnectCount++
      this.createWebSocket(this.reconnectMessage)
    }, this.reconnectInterval)
  }

  private resetStatus() {
    this.clearAllTimer()
    this.heartBeat()
    this.reconnectCount = 0
  }

  private clearAllTimer() {
    clearTimeout(this.pingTimer!)
    clearTimeout(this.reconnectTimer!)
    clearTimeout(this.connectTimer!)
    this.pingTimer = null
    this.reconnectTimer = null
    this.connectTimer = null
  }

  public close() {
    this.forbidReconnect = true
    this.clearAllTimer()
    this.ws?.close()
    this.ws = null
  }

  public onopen(handler: (e: Event) => void) {
    this.onopenHandler = handler
    return this
  }

  public onclose(handler: (e: CloseEvent) => void) {
    this.oncloseHandler = handler
    return this
  }

  public onerror(handler: (e: Event) => void) {
    this.onerrorHandler = handler
    return this
  }

  public onmessage(handler: MessageListener, id?: string | number): string | number {
    const finalId = id ?? this.nextListenerId++
    this.messageListenerMap.set(finalId, handler)
    return finalId
  }

  public onceMessage(handler: MessageListener, id?: string | number): string | number {
    const finalId = id ?? this.nextListenerId++
    const onceWrapper = (e: MessageEvent) => {
      handler(e)
      this.messageListenerMap.delete(finalId)
    }
    this.messageListenerMap.set(finalId, onceWrapper)
    return finalId
  }

  public offMessage(id: 'all' | string | number | Array<string | number>): this {
    if (id === 'all') {
      this.messageListenerMap.clear()
    } else if (Array.isArray(id)) {
      id.forEach((key) => this.messageListenerMap.delete(key))
    } else {
      this.messageListenerMap.delete(id)
    }
    return this
  }
}
