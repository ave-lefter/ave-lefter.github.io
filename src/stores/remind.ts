import { defineStore } from 'pinia'
import { useBotStore } from './bot'
import { useWalletStore } from './wallet'
import {
  _getNotifyList,
  _getNotifyHistoryList,
  _getNotify,
  type Notify,
  type GroupedItem,
  type Item,
} from '@/api/remind'
import { sendNotify } from '@/utils/index'
export const useRemindStore = defineStore('Remind', () => {
  const remindList = ref<GroupedItem[]>([])
  const remindHistoryList = ref<Notify[]>([])
  const loadingRemind = shallowRef(false)
  const loadingRemindHistory = shallowRef(false)
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const len = shallowRef(0)
  const timerNotify = ref<ReturnType<typeof setInterval> | null>(null)
  let errorNotify = false
  const newRemind = shallowRef(false)

  const currentAddress = computed(() => botStore?.evmAddress || walletStore?.address || '')
  function getNotifyList() {
    if (!currentAddress.value) {
      return
    }
    loadingRemind.value = true
    _getNotifyList(currentAddress.value)
      .then((res) => {
        const result = Array.isArray(res) ? res : []
        len.value = result?.length
        remindList.value = Object.values(
          result?.reduce(
            (acc, cur) => {
              if (!acc[cur.token]) {
                acc[cur.token] = {
                  token: cur.token,
                  chain: cur.chain,
                  symbol: cur.symbol,
                  create_time: cur.create_time,
                  logo_url: cur.logo_url,
                  ids: [cur.id],
                  children: [cur],
                }
              } else {
                acc[cur.token].children.push(cur)
                acc[cur.token].ids.push(cur.id)
                // 更新为最新 create_time（更大的）
                if (cur.create_time > acc[cur.token].create_time) {
                  acc[cur.token].create_time = cur.create_time
                }
              }
              return acc
            },
            {} as Record<string, GroupedItem>
          )
        )
      })
      .catch(() => {})
      .finally(() => {
        loadingRemind.value = false
        if (remindList.value?.length > 0) {
          getNotify()
        } else {
          if (timerNotify.value) {
            clearTimeout(timerNotify.value)
          }
        }
      })
  }

  async function getNotifyHistoryList() {
    if (!currentAddress.value) {
      remindHistoryList.value = []
      return
    }
    loadingRemindHistory.value = true
    const res = await _getNotifyHistoryList(currentAddress.value)
    loadingRemindHistory.value = false
    remindHistoryList.value = Array.isArray(res) ? res : []
  }

  function getNotify() {
    if (currentAddress.value && window.Notification && Notification.permission === 'granted') {
      if (timerNotify.value) {
        clearTimeout(timerNotify.value)
      }
      _getNotify(currentAddress.value)
        .then((res) => {
          let result = res?.price_notify || []
          if (result.length > 0) {
            newRemind.value = true
            sendNotify(result)
          }
        })
        .catch((err) => {
          console.log(err)
          errorNotify = true
        })
        .finally(() => {
          if (!errorNotify) {
            timerNotify.value = setTimeout(() => {
              getNotify()
            }, 5000)
          }
        })
    }
  }
  return {
    remindList,
    loadingRemind,
    len,
    getNotifyList,
    getNotifyHistoryList,
    remindHistoryList,
    loadingRemindHistory,
    newRemind
  }
})
