import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import WS, { type WSOptions } from '@/utils/ws'
import { getBestApiDomain } from '@/plugins/api/getApiDomain'
import { getWSMessage } from '@/utils'
import { WSEventV2Type } from '~/utils/constants'

export const useV2WSStore = defineStore('v2ws', () => {
  // 使用 shallowRef 代替 ref，WebSocket 本身是非响应式的
  const wsInstance = shallowRef<WS | null>(null)
  const isConnected = shallowRef(false)
  // const route = useRoute()

  // const tokenStore = useTokenStore()

  const wsResult = reactive<Record<(typeof WSEventV2Type)[keyof typeof WSEventV2Type], any>>({
    [WSEventV2Type.PUMPSTATE]: null,
    [WSEventV2Type.TOKEN_UPDATED]: null,
    [WSEventV2Type.PORTRAIT_STATISTICS]: null,
  })

  // 将 createWebSocket 重命名为 init
  const init = (options?: WSOptions) => {
    if (wsInstance.value) return  // 防止重复创建 WebSocket 实例
    const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/v2ws`
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
      if (event === WSEventV2Type.PORTRAIT_STATISTICS) {
        wsResult[event] = data?.updates
      } else if (event === WSEventV2Type.PUMPSTATE) {
        wsResult[event] = data?.msgs
      } else if (event === WSEventV2Type.TOKEN_UPDATED) {
        wsResult[event] = data?.msg
      } else {
        wsResult[event] = data
      }
    }, 'main')
  }

  // 发送消息并确保初始化 WebSocket 连接
  const send = (msg: string | Record<string, any>, options?: WSOptions) => {
    if (!wsInstance.value) {
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/v2ws`
      init(options || { url: url })  // 默认空 URL，或者你可以传递默认的初始化选项
    }
    wsInstance.value?.send(msg)
    return wsInstance.value
  }

  function getWSInstance() {
     if (!wsInstance.value) {
      // 如果 WebSocket 未初始化，则自动调用 init 初始化
      const url = `${(getBestApiDomain() || location.origin).replace('http', 'ws')}/v2ws`
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
