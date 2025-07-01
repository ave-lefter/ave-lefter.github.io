import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import WS, { type WSOptions } from '@/utils/ws'
import { getBestApiDomain } from '@/plugins/api/getApiDomain'
import { getWSMessage } from '@/utils'
import { updatePriceFromTx } from '@/utils/txUpdate'
import type { WSTx } from '~/pages/token/components/kLine/types'
import { WSEventType } from '~/utils/constants'

export const useWSStore = defineStore('ws', () => {
  // 使用 shallowRef 代替 ref，WebSocket 本身是非响应式的
  const wsInstance = shallowRef<WS | null>(null)
  const isConnected = shallowRef(false)
  const botSwapStore = useBotSwapStore()
  const globalStore = useGlobalStore()
  // const route = useRoute()

  // const tokenStore = useTokenStore()

  const wsResult = reactive<
    Record<(typeof WSEventType)[keyof typeof WSEventType], any>
  >({
    [WSEventType.TX]: null,
    [WSEventType.LIQ]: null,
    [WSEventType.KLINE]: null,
    [WSEventType.PRICEV2]: null,
    [WSEventType.TGBOT]: null,
    [WSEventType.ASSET]: null,
    [WSEventType.SWITCH_MAIN_PAIR_V2]: null,
    [WSEventType.PUMPSTATE]: null,
    [WSEventType.GOLD_SIGNAL]: null,
    [WSEventType.SIGNALSV2_PUBLIC_MONITOR]: null
  })

  // 将 createWebSocket 重命名为 init
  const init = (options?: WSOptions) => {
    if (wsInstance.value) return  // 防止重复创建 WebSocket 实例
    const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/ws`
    wsInstance.value = new WS({url, ...(options || {})})

    wsInstance.value.onopen(() => {
      isConnected.value = true
    }).onclose(() => {
      isConnected.value = false
    }).onmessage((e) => {
      const msg = getWSMessage(e)
      if (!msg) {
        return
      }
      const { event, data } = msg
      if (event === WSEventType.TGBOT) {
        wsResult[event] = data?.msg
      } else if (event === WSEventType.MONITOR) {
        wsResult[event] = data?.msg
      } else if (event === WSEventType.TX) {
        const tx: WSTx = data?.tx
        // 更新价格 交易数和交易额
        updatePriceFromTx(tx)
        wsResult[event] = data
      } else if (event === WSEventType.PRICEV2) {
        botSwapStore.onmessageNativePrice(data)
        globalStore.onmessageFooterPrice(data)
        wsResult[event] = data
      } else if (event === WSEventType.SWITCH_MAIN_PAIR_V2) {
        // 内盘转外盘更新 pair
        useTokenStore().onSwitchMainPairV2(data)
      } else if (event === WSEventType.PUMPSTATE) {
        wsResult[event] = data?.msgs
      } else {
        wsResult[event] = data
      }
    }, 'main')
  }

  // 发送消息并确保初始化 WebSocket 连接
  const send = (msg: string | Record<string, any>, options?: WSOptions) => {
    if (!wsInstance.value) {
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/ws`
      init(options || { url: url })  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    wsInstance.value?.send(msg)
    return wsInstance.value
  }

  function getWSInstance() {
     if (!wsInstance.value) {
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/ws`
      init({ url: url })  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    return wsInstance.value
  }


  const close = () => {
    isConnected.value = false
    wsInstance.value?.close()
    wsInstance.value = null
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
