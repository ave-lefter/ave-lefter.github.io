import { defineStore } from 'pinia'
import { useBotStore } from './bot'
import { useWalletStore } from './wallet'
import {
  _getNotifyList,
  _getNotifyHistoryList,
  _getNotify,
  _deleteNotifyHistory,
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
  const remindCount = shallowRef(0)

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
                  create_time: cur.create_time || '',
                  logo_url: cur.logo_url,
                  ids: [cur.id],
                  children: [cur],
                }
              } else {
                acc[cur.token].children.push(cur)
                acc[cur.token].ids.push(cur.id)
                // 更新为最新 create_time（更大的）
                const tokenData = acc?.[cur.token]
                if (tokenData?.create_time && cur.create_time > tokenData.create_time) {
                  tokenData.create_time = cur.create_time
                }
              }
              return acc
            },
            {} as Record<string, GroupedItem>
          )
        )
        remindList.value.forEach((item) => {
          item.children.sort((a, b) => Number(b.create_time) - Number(a.create_time))
        })
       console.log('-----remindList.value------', remindList.value)
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
    const res = await _getNotifyHistoryList(currentAddress.value).finally(() => {
      loadingRemindHistory.value = false
    })
    remindHistoryList.value = Array.isArray(res)
      ? res?.map((i) => ({
          ...i,
          create_time:
            i?.create_time !== '1970-01-01T00:00:00Z' && i?.create_time !== '0001-01-01T00:00:00Z'
              ? new Date(i?.create_time).getTime() / 1000
              : 0,
        }))
      : []
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
            remindCount.value++
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
  function deleteNotifyHistory() {
    if (!currentAddress.value) {
      return
    }
    _deleteNotifyHistory(currentAddress.value)
      .then((res) => {
        newRemind.value = false
        getNotifyHistoryList()
      })
      .catch(() => {})
  }
  return {
    remindList,
    loadingRemind,
    len,
    getNotifyList,
    getNotifyHistoryList,
    remindHistoryList,
    loadingRemindHistory,
    newRemind,
    remindCount,
    deleteNotifyHistory,
  }
})
