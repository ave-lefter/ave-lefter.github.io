export interface Notify {
  address: string
  chain: string
  create_time: number
  current_price: number
  id: number
  is_deleted: number
  is_repeatable: number
  last_notify_time: number
  logo_url: string
  notified_times: number
  symbol: string
  token: string
  warning_price: number
  direction: string
}

export interface Item {
  id: number
  address: string
  token: string
  symbol: string
  chain: string
  warning_price: number
  create_time: number
  last_notify_time: number
  is_repeatable: number
  notified_times: number
  is_deleted: number
  current_price: number
  direction: string
  logo_url: string
}

export interface GroupedItem {
  token: string
  chain: string
  symbol: string
  create_time: number
  logo_url: string
  ids: number[]
  children: Item[]
}

export function _getNotifyList(address: string): Promise<Notify[]> {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/priceInfo/notify`, {
    method: 'get',
    query: {
      userAddress: address,
    },
  })
}

export function _addNotify(data, address: string) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/priceInfo/notify/add`, {
    method: 'post',
    body: {
      ...data,
    },
  })
}

export function _removeNotify(ids: number[], address: string) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/priceInfo/notify/removebatch`, {
    method: 'post',
    body: {
      user_address: address,
      config_ids: ids,
    },
  })
}

export function _getNotifyHistoryList(address: string): Promise<Notify[]> {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/priceInfo/notify/history`, {
    method: 'get',
    query: {
      user_address: address,
    },
  })
}
