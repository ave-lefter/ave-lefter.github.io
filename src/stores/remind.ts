import { defineStore } from 'pinia'
import { useBotStore } from './bot'
import { useWalletStore } from './wallet'
import {
  _getNotifyList,
  _getNotifyHistoryList,
  type Notify,
  type GroupedItem,
  type Item,
} from '@/api/remind'

export const useRemindStore = defineStore('Remind', () => {
  const remindList = ref<GroupedItem[]>([])
  const remindHistoryList = ref<Notify[]>([])
  const loadingRemind = shallowRef(false)
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const len = shallowRef(0)

  const currentAddress = computed(() => botStore?.evmAddress || walletStore?.address || '')

  async function getNotifyList() {
    if (!currentAddress.value) {
      return
    }
    loadingRemind.value = true
    const res = await _getNotifyList(currentAddress.value)
      .catch(() => {})
      .finally(() => {
        loadingRemind.value = false
      })
    console.log('----getNotifyList----------', res)
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
    console.log('----remindList-----', remindList)
  }

  async function getNotifyHistoryList() {
    if (!currentAddress.value) {
      return
    }
    const res = await _getNotifyHistoryList(currentAddress.value)
    remindHistoryList.value = Array.isArray(res) ? res : []
  }

  return {
    remindList,
    loadingRemind,
    len,
    getNotifyList,
    getNotifyHistoryList,
    remindHistoryList,
  }
})
