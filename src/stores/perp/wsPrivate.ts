import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import WS, { type WSOptions } from '@/utils/ws'
import { usePerpStore } from './index'
import { WSPerpHost } from '@/utils/constants'
import type { Collateral, Position, Order } from './type'

function getWSMessage(e: MessageEvent): {
  sid?: string // 会话ID
  type: 'connected' | 'subscribed' | 'unsubscribed' | 'quote-event' | 'ping' | 'pong' | 'error' | 'trade-event' | 'assets-event' // 响应类型
  channel?: string // 频道名称
  request?: string // 原始请求（可选）
  content?: any // 响应内容
  time?: string // 时间戳
} | null {
  if (isJSON(e.data)) {
    const result = JSON.parse(e.data || {})
    return result
  }
  return null
}

export const usePerpWsPrivateStore = defineStore('perpWsPrivate', () => {
  // 使用 shallowRef 代替 ref，WebSocket 本身是非响应式的
  const wsInstance = shallowRef<WS | null>(null)
  const isConnected = shallowRef(false)
  // const WSHost = 'wss://quote-testnet.edgex.exchange'
  // const WS_URL = `wss://quote.edgex.exchange/api/v1/public/ws`
  // const WSHost = 'wss://quote.edgex.exchange'

  const perpStore = usePerpStore()

  const wsResult = reactive<Record<(typeof WSEventType)[keyof typeof WSEventType], any>>({

  })

  function getWSURLAndHeaders() {
    const accountId = perpStore.userInfo?.id || ''
    const timestamp = Date.now().toString()
    const wsOptions = {
      path: '/api/v1/private/ws',
      timestamp,
      accountId,
      url: `${WSPerpHost}/api/v1/private/ws?accountId=${accountId}&timestamp=${timestamp}`
    }
    const headers = perpStore.generateEdgeXAuthHeaders({
      method: 'GET',
      path: wsOptions.path,
      params: {
        accountId,
        timestamp
      }
    })

    const wssSignParam = {
      ...headers
    }
    const wssSignSignature = btoa(JSON.stringify(wssSignParam)).replace(/=/g, '')
    return {
      url: `${WSPerpHost}/api/v1/private/ws?accountId=${accountId}&timestamp=${timestamp}`,
      protocols: wssSignSignature
    }

  }

  // 将 createWebSocket 重命名为 init
  const init = (options?: WSOptions) => {
    if (wsInstance.value) return  // 防止重复创建 WebSocket 实例
    // ?timestamp=${Date.now()}
    if (!perpStore.userInfo?.id) {
      return
    }
    wsInstance.value = new WS({...getWSURLAndHeaders(), pingMsg: `{"type":"ping","time":"${Date.now()}"}`, ...(options || {})})

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
        if (msg.type === 'quote-event' && msg.channel) {
          wsResult[msg.channel] = msg.content
        } else {
          wsResult[msg.type] = msg
        }
        // 处理用户数据更新
      if (msg.type === 'trade-event' || msg.type === 'assets-event') {
        const { collateral, position, order } = msg.content?.data || {}

        // 更新资产信息
        if (msg.content?.event === 'Snapshot' && collateral as Collateral[]) {
          updateCollateralInfo(collateral)
        }

        // 更新持仓信息
        if (msg.content?.event === 'Snapshot' && position as Position) {
          updatePositionInfo(position)
        }

        // 更新订单信息
        if (msg.content?.event === 'Snapshot' && order as Order) {
          updateOrderInfo(order)
        } else if(msg.content?.event === 'ORDER_UPDATE' && order as Order) {
          const canceledOrder = order.filter((i) => i.status === 'CANCELED')
          if(canceledOrder.length > 0){
            perpStore.order = perpStore.order.filter((i) => !canceledOrder.includes(i.id))
          } else {
            perpStore.order.push(...order)
          }
        }
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
      init(options || getWSURLAndHeaders())  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    wsInstance.value?.send(msg)
    return wsInstance.value
  }

  function getWSInstance() {
    if (!wsInstance.value) {
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      init(getWSURLAndHeaders())  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    return wsInstance.value
  }


  const close = () => {
    isConnected.value = false
    wsInstance.value?.close()
    wsInstance.value = null
  }

  function updateCollateralInfo(collateral: Collateral[]) {
    perpStore.collateral = collateral
  }

  function updatePositionInfo(position: Position[]) {
    perpStore.position = position
  }

  function updateOrderInfo(order: Order[]) {
    perpStore.order = order
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
