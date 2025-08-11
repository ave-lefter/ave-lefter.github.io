
export interface AddAttention {
  holderStats: HolderStat[]
  aggregateStats: AggregateStats
}

export interface AggregateStats {
  balance: number
  balance_usd: number
  largestPosition: number
  largestPosition_usd: number
  buy: number
  sell: number
  soldAll: number
  all: number
  totalProfit: number
  totalProfitRatio: number
}

export interface HolderStat {
  holder: string
  chain: string
  remark: string
  wallet_logo: Record<string, any>
  is_wallet_address_fav: number
  new_tags: NewTag[]
  balance: number
  balance_ratio: number
  balance_usd: number
  main_coin_balance: number
  bought: number
  bought_usd: number
  total_bought: number
  total_sold: number
  avg_purchase_price: number
  sold: number
  sold_usd: number
  avg_sale_price: number
  realized_profit: number
  unrealized_profit: number
  total_profit: number
  realized_profit_ratio: number
  unrealized_profit_ratio: number
  total_profit_ratio: number
  transfer_in: number
  transfer_out: number
  max_single_purchase_usd: number
  max_single_sold_usd: number
  max_txn_usd: number
  total_transfer_in: number
  total_transfer_out: number
  total_transfer_in_usd: number
  last_txn_time: Date
  age: Date
  token_first_transfer_in_from: string
  token_first_transfer_in_time: null
  sol_first_transfer_in_from: string
  sol_first_transfer_in_time: Date
  max_balance: number
  blueWhaleStats: null
  main_coin_price: number
  main_coin_symbol: string
  token_first_transfer_in_from_remark: string
  sol_first_transfer_in_from_remark: string
}

export interface NewTag {
  type: string
  en: string
  cn: string
  tw: string
  es: string
  pt: string
  tr: string
  ja: string
  icon: string
  color: string
  extra_info: null
  nick_name: string
}

export interface AddAttentionOld {
  user_address: string
  remark: string
  current_position: number
  position_value: number
  position_price: number
  profit: number
  profit_rate: number
  bug_amount: number
  sell_amount: number
  bug_count: number
  sell_count: number
}

//支持全量数据关注列表
export async function _getAttentionList(params:any): Promise<AddAttention> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/usersv2', {
    method: 'get',
    params,
  })
}

//支持非全量数据关注列表
export async function _getAttentionListOld(params: any): Promise<AddAttentionOld[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/fav/users', {
    method: 'get',
    params,
  })
}

//获取关注数
export async function _getFollowsNum(params: any): Promise<{ all: number, soldAll: number}> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/follows/aggregatestates', {
    method: 'get',
    params,
  })
}