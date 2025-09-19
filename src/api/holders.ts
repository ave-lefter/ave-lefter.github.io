
interface HolderInfo {
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
  chain: string,
  remark: string
  wallet_logo: WalletLogo
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
  last_txn_time?: Date
  age?: Date
  token_first_transfer_in_from: string
  token_first_transfer_in_time: Date | null
  sol_first_transfer_in_from: string
  sol_first_transfer_in_time: Date | null
  max_balance: number
  blueWhaleStats: null
  main_coin_price: number
  main_coin_symbol: string
  token_first_transfer_in_from_remark: string
  sol_first_transfer_in_from_remark: string
}
interface NewTag {
  type: string
  en: string
  cn: string
  tw: string
  es: string
  pt: string
  tr: string
  ja: string
  icon: string,
  color: string
  extra_info: null
  nick_name: string
}
interface WalletLogo { }

export function _getHoldersList(params: {
  token_id: string
  tag_type?: string
  sort_by?: string | undefined
  order?: string | undefined
  recent?: number | undefined
  self_address?: string
}): Promise<HolderInfo> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/holders', {
    method: 'get',
    query: params,
  })
}


export interface Top100range {
  date: string
  dev_balance_ratio: number
  insider_balance_ratio: number
  kol_balance_ratio: number
  smartmoney_balance_ratio: number
  sniper_balance_ratio: number
  token: string
  top10_amount: number
  top20_amount: number
  top50_amount: number
  top100_amount: number
  total_amount: number
}
export function _getTop100range(tokenId: string): Promise<Top100range[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/stats/top100range', {
    method: 'get',
    query: {
      token_id: tokenId,
    },
  })
}


export interface Top100Balance {
  address: string
  amount_cur: number
  amount_diff_3days: number
  buy_amount_cur: number
  buy_amount_diff_3days: number
  buy_tx_count_cur: number
  buy_volume_cur: number
  buy_volume_diff_3days: number
  chain: string
  cost_cur: number
  cost_diff_3days: number
  is_wallet_address_fav: number
  newTags: NewTags[]
  remark: string
  sell_amount_cur: number
  sell_amount_diff_3days: number
  sell_tx_count_cur: 4
  sell_volume_cur: number
  sell_volume_diff_3days: number
  trade_first_at: number
  trade_last_at: number
  wallet_logo: {}
  wallet_tag_extra: {}
  wallet_tag_v2: string
}
interface NewTags {
  cn: string
  color: string
  en: string
  es: string
  extra_info: null
  icon: string
  ja: string
  nick_name: string
  pt: string
  tr: string
  tw: string
  type: string
}
export function _getTop100balance(params: {
  token_id: string
  address?: string
}): Promise<Top100Balance[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/top100balance', {
    method: 'get',
    query: {
      token_id: params.token_id,
      size: 100,
      address: params.address,
    },
  })
}

// Search holders by address keyword (align with legacy implementation)
export function searchAddressHolder(params: {
  token_id: string
  self_address?: string
  keyword: string
  tag_type?: string
}): Promise<HolderStat[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/holder', {
    method: 'get',
    query: params,
  })
}
export interface AllTagsStats {
  token: string
  date: Date | undefined
  balance: number
  balance_ratio_cur: number
  balance_ratio_max: number
  vol_buy: number
  vol_sell: number
  unsettled_addresses: number
  all_addresses: number
  vol_profit: number
  vol_profit_ratio: number
}
export function _getAllTagsStats(params: {
  token_id: string
  type: string
}): Promise<AllTagsStats> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/alltags/stats', {
    method: 'get',
    query: params,
  })
}

// 获取 老鼠仓dev聪明钱 持仓列表
export interface Hold {
  total_value: number
  balance_ratio: number
  balance: number
  cumulative_purchase: number
  cumulative_sold: number
  address: string
  is_wallet_address_fav: boolean
}

export function _getAllTagsHoldList(params: {
  token_id: string
  type: string
  address?: string
}): Promise<Hold> {
  const { $api } = useNuxtApp()
  const address=localStorage.bot_evmAddress || localStorage.walletAddress
  return $api('/v1api/v3/stats/alltags/holders', {
    method: 'get',
    query:{
      address,
      ...params
    }
  })
}

// 获取 老鼠仓dev聪明钱 动态列表

export interface Activity {
  txhash: string
  instruction_index: number
  pair: string
  time: Date
  publish_at: Date
  token: string
  quote_token: string
  type: string
  block_number: number
  amm: string
  wallet_address: string
  base_token_amount: number
  quote_token_amount: number
  base_token_price_u: number
  quote_token_price_u: number
  base_token_symbol: string
  quote_token_symbol: string
}
export function _getAllTagsActivityList(params: {
  token_id: string
  type: string
  address?: string
}): Promise<Activity> {
  const { $api } = useNuxtApp()
  const address=localStorage.bot_evmAddress || localStorage.walletAddress
  return $api('/v1api/v3/stats/alltags/activities', {
    method: 'get',
    query: {
      address,
      ...params
    }
  })
}

export interface UserTxs {
  amm: string
  amount_eth: number
  amount_usd: number
  block_number: number
  chain: string
  from_address: string
  from_amount: number
  from_price_eth: number
  from_price_usd: number
  from_reserve: number
  from_symbol: string
  id: string
  network: string
  pair_address: string
  pair_liquidity_eth: string
  pair_liquidity_usd: string
  sender: string
  time: number
  timestamp: number
  to: string
  to_address: string
  to_amount: number
  to_price_eth: number
  to_price_usd: number
  to_reserve: number
  to_symbol: string
  transaction: string
  transactionAddress: string
  walletAddress: string
  wallet_address: string
}
export function _getUserTxs(params: {
  token_id: string
  user_address: string
}): Promise<UserTxs[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/pairs/userMergedTxs', {
    method: 'get',
    query: params,
  })
}

export function getHoldersTokenCountLight(token: string, chain: string): Promise<{
  create_time: number;
  token_count_data: Array<{
    time: string|number;
    holders_count: string|number;
  }>
}> {
  const {$api} = useNuxtApp()
  return $api('/v2api/holders/v1/token/count/light', {
    method: 'get',
    query: {
      token, chain
    }
  })
}

export function getHoldersTokenHoldersLight(token: string, chain: string,top_n: number|string): Promise<{
  create_time: string|number;
  token_holder_ratio: Array<{
    time: string|number;
    top100_ratio?: string|number;
    top10_ratio?: string|number;
    top_n_ratio?: string|number;
  }>
}> {
  const {$api} = useNuxtApp()
  return $api('/v2api/holders/v1/token/holders/light', {
    method: 'get',
    query: {
      token, chain, top_n
    }
  })
}

export function getHoldersTokenCountInterval(token: string, chain: string,interval: number|string): Promise<{
  time: string|number;
  holders_count: string|number;
}[]> {
  const {$api} = useNuxtApp()
  return $api('/v2api/holders/v1/token/count/interval', {
    method: 'get',
    query: {
      token, chain, interval
    }
  })
}

export function getHoldersTokenTopHoldersRatio(token: string, chain: string,interval: number|string): Promise<{
  time: string|number;
  top10_ratio: string|number;
  top50_ratio: string|number;
  top100_ratio: string|number;
}[]> {
  const {$api} = useNuxtApp()
  return $api('/v2api/holders/v1/token/top_holders/ratio', {
    method: 'get',
    query: {
      token, chain, interval
    }
  })
}
