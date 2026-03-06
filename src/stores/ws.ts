import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import WS, { type WSOptions } from '@/utils/ws'
import { getBestApiDomain } from '@/plugins/api/getApiDomain'
import { getWSMessage } from '@/utils'
import { updatePriceFromTx } from '@/utils/txUpdate'
import type { SimpleWSTx, WSTx } from '~/pages/token/components/kLine/types'
import { WSEventType } from '~/utils/constants'

/** 模块级单例：路由/Store 重初始化时复用同一 WS，避免重复创建导致内存泄漏 */
let globalWsSingleton: WS | null = null

export const useWSStore = defineStore('ws', () => {
  // 使用 shallowRef 代替 ref，WebSocket 本身是非响应式的
  const wsInstance = shallowRef<WS | null>(null)
  const isConnected = shallowRef(false)
  const botSwapStore = useBotSwapStore()
  const globalStore = useGlobalStore()
  const botStore = useBotStore()
  // const route = useRoute()

  // const tokenStore = useTokenStore()

  const wsResult = reactive<Record<(typeof WSEventType)[keyof typeof WSEventType], any>>({
    [WSEventType.TX]: null,
    [WSEventType.LIQ]: null,
    [WSEventType.KLINE]: null,
    [WSEventType.PRICEV2]: null,
    [WSEventType.TGBOT]: null,
    [WSEventType.ASSET]: null,
    [WSEventType.SWITCH_MAIN_PAIR_V2]: null,
    [WSEventType.GOLD_SIGNAL]: null,
    [WSEventType.SIGNALSV2_PUBLIC_MONITOR]: null,
    [WSEventType.PRICE_EXTRA]: null,
    [WSEventType.SIMPLE_TX]: null,
    [WSEventType.PUBLIC_PORTRAIT]: null,
    [WSEventType.PUMP_MIGRATED]: null
  })

  // 将 createWebSocket 重命名为 init
  const init = (options?: WSOptions) => {
    if (wsInstance.value) return  // 防止重复创建 WebSocket 实例
    // 路由/Store 重初始化时复用全局单例，避免重复创建 WS 导致泄漏
    if (globalWsSingleton) {
      wsInstance.value = globalWsSingleton
      return
    }
    const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/ws`
    const newWs = new WS({ url, ...(options || {}) })
    // 防止竞态：若在 new WS() 期间其他调用已赋值，则关闭本次创建的实例避免泄漏
    if (wsInstance.value || globalWsSingleton) {
      newWs.close()
      return
    }
    globalWsSingleton = newWs
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
      const { event, data } = msg
      if (event === WSEventType.TGBOT) {
        wsResult[event] = data?.msg
      } else if (event === WSEventType.ASSET) {
        wsResult[event] = data
        botStore.updateBalance(data)
      } else if (event === WSEventType.MONITOR) {
        wsResult[event] = data?.msg
      } else if (event === WSEventType.PUMP_MIGRATED) {
        //内外盘提示
        wsResult[event] = data?.msgs[0]
      } else if (event === WSEventType.TX) {
        const tx: WSTx = data?.tx
        // 更新价格 交易数和交易额
        updatePriceFromTx(tx)
        wsResult[event] = data
      } else if (event === WSEventType.SIMPLE_TX) {
        const tx: SimpleWSTx = data?.msg
        // 更新价格 交易数和交易额
        updatePriceFromTx(tx)
        wsResult[event] = data
      } else if (event === WSEventType.PRICEV2) {
        botSwapStore.onmessageNativePrice(data)
        globalStore.onmessageFooterPrice(data)
        wsResult[event] = data
      } else if (event === WSEventType.SWITCH_MAIN_PAIR_V2) {
        // 内盘转外盘更新 pair
        wsResult[event] = data
        console.log('------------SWITCH_MAIN_PAIR_V2---------',data)
        useTokenStore().onSwitchMainPairV2(data)
      } else if (event === WSEventType.PUBLIC_PORTRAIT) {
        usePublicPortraitStore().updatePublicPortrait(data?.msg || [])
        wsResult[event] = data?.msg || []
      }  else {
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
    globalWsSingleton = null
  }

  /** 离开 token 页时释放 K 线/交易等大对象引用，便于 GC */
  const clearTokenRelatedResult = () => {
    wsResult[WSEventType.KLINE] = null
    wsResult[WSEventType.TX] = null
    wsResult[WSEventType.SIMPLE_TX] = null
  }

  return {
    getWSInstance,
    isConnected,
    init,
    send,
    close,
    clearTokenRelatedResult,
    wsResult
  }
})
