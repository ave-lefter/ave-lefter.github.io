import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import WS, { type WSOptions } from '@/utils/ws'
import { WSPerpEventType, WSPerpHost } from '~/utils/constants'
import { usePerpStore } from '.'

function getWSMessage(e: MessageEvent): {
  sid?: string // 会话ID
  type: 'connected' | 'subscribed' | 'unsubscribed' | 'quote-event' | 'ping' | 'pong' | 'error' // 响应类型
  channel?: string // 频道名称
  request?: string // 原始请求（可选）
  content?: any // 响应内容
  time: string // 时间戳
} | null {
  if (isJSON(e.data)) {
    const result = JSON.parse(e.data || {})
    return result
  }
  return null
}

/** 模块级单例：路由/Store 重初始化时复用同一 WS */
let globalPerpWsSingleton: WS | null = null

export const usePerpWsPubStore = defineStore('perpWsPub', () => {
  // 使用 shallowRef 代替 ref，WebSocket 本身是非响应式的
  const wsInstance = shallowRef<WS | null>(null)
  const isConnected = shallowRef(false)
  // const WSHost = 'wss://quote-testnet.edgex.exchange'
  // const WSHost = 'wss://quote.edgex.exchange'
  // const WS_URL = `wss://quote.edgex.exchange/api/v1/public/ws`


  const wsResult = reactive<Record<(typeof WSPerpEventType)[keyof typeof WSPerpEventType], any>>({
    [WSPerpEventType.TICKER_ALL_1S]: null,
    [WSPerpEventType.KLINE]: null,
    [WSPerpEventType.DEPTH]: null,
    [WSPerpEventType.TRADES]: null,
  })

  // 将 createWebSocket 重命名为 init
  const init = (options?: WSOptions) => {
    if (wsInstance.value) return  // 防止重复创建 WebSocket 实例
    if (globalPerpWsSingleton) {
      wsInstance.value = globalPerpWsSingleton
      return
    }
    const WS_URL = `${WSPerpHost}/api/v1/public/ws?timestamp=${Date.now()}`
    const newWs = new WS({ url: WS_URL, pingMsg: `{"type":"ping","time":"${Date.now()}"}`, ...(options || {}) })
    if (wsInstance.value || globalPerpWsSingleton) {
      newWs.close()
      return
    }
    globalPerpWsSingleton = newWs
    wsInstance.value = newWs

    wsInstance.value.onopen(() => {
      isConnected.value = true
    }).onclose(() => {
      isConnected.value = false
    }).onmessage((e) => {
      const msg = getWSMessage(e)
      if (!msg) {
        return
      }
      if (msg.type === 'ping') {
        send({ type: 'pong', time: msg.time })
      } else {
        if (msg.type === 'quote-event' && msg.channel?.startsWith(WSPerpEventType.KLINE)) {
          wsResult[WSPerpEventType.KLINE] = msg.content
        } else if (msg.type === 'quote-event' && msg.channel?.startsWith(WSPerpEventType.DEPTH)) {
          wsResult[WSPerpEventType.DEPTH] = msg.content
          saveDepthData(msg.content)
        } else if (msg.type === 'quote-event' && msg.channel?.startsWith(WSPerpEventType.TRADES)) {
          // console.log('----------order-----', msg)
          wsResult[WSPerpEventType.TRADES] = msg.content
        } else if (msg.type === 'quote-event' && msg.channel) {
          wsResult[msg.channel] = msg.content
        } else {
          wsResult[msg.type] = msg
        }
      }
    }, 'perpWsPub')
  }

  //   客户端请求格式
  // {
  //   "type": "subscribe | unsubscribe | ping | pong",  // 操作类型
  //   "channel": "ticker.10000001",                     // 订阅频道
  //   "time": "1693208170000"                           // 时间戳（可选）
  // }
  // 发送消息并确保初始化 WebSocket 连接
  const send = (msg: {
    type: 'subscribe' | 'unsubscribe' | 'ping' | 'pong'
    channel?: string
    time?: string
  }, options?: WSOptions) => {
    if (!wsInstance.value) {
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      const WS_URL = `${WSPerpHost}/api/v1/public/ws?timestamp=${Date.now()}`
      init(options || { url: WS_URL })  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    wsInstance.value?.send(msg)
    return wsInstance.value
  }

  function getWSInstance() {
     if (!wsInstance.value) {
      const WS_URL = `${WSPerpHost}/api/v1/public/ws?timestamp=${Date.now()}`
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      init({ url: WS_URL })  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    return wsInstance.value
  }


  const close = () => {
    isConnected.value = false
    wsInstance.value?.close()
    wsInstance.value = null
    globalPerpWsSingleton = null
  }

  function saveDepthData(val: {
    channel: string
    dataType: 'Snapshot' | 'changed'
    data: {
      asks: {price: string; size: string}[]
      bids: {price: string; size: string}[]
    }[]
  }) {
    const result = val.data?.[0]
    const perpStore = usePerpStore()
    const arr_buy = Array.isArray(result?.bids)
      ? result?.bids
      : []
    const arr_sell = Array.isArray(result?.asks)
      ? result?.asks
      : []
    if (
      (result?.bids?.length > 0 || result?.asks?.length > 0) &&
      `${WSPerpEventType.DEPTH}.${perpStore.perp?.contractId || ''}.200` == val.channel
    ) {
      const count = 200
      if (val.dataType === 'Snapshot') {
        perpStore.depthData.buyList = arr_buy?.slice?.(0, count) || []
        perpStore.depthData.sellList = arr_sell?.slice?.(0, count) || []
      } else if (val.dataType === 'changed') {
        if (arr_buy?.length > 0) {
          perpStore.depthData.buyList = [
            ...(result.bids || []),
            ...arr_buy
          ]?.slice?.(0, count) || []
        }
        if (arr_sell?.length > 0) {
          perpStore.depthData.sellList = [
            ...(result.asks || []),
            ...arr_sell
          ]?.slice?.(0, count) || []
        }
      }
    }
  }

  return {
    getWSInstance,
    isConnected,
    init,
    send,
    close,
    wsResult
  }
})
