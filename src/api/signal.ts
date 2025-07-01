export interface GetSignalV2ListResponse<T = IActionItem> {
  first_signal_time: number;
  last_signal_time: number;
  max_price_change: string;
  history_count: number;
  token: string;
  chain: string;
  day_high_price: string;
  first_signal_price: string;
  first_signal_mc: string;
  id: number;
  symbol: string;
  logo: string;
  token_tag: string;
  token_create_time: number;
  top10_ratio: string;
  dev_ratio: string;
  insider_ratio: string;
  mc: string;
  mc_cur: string;
  holders_cur: number;
  signal_time: number;
  tag: string;
  amm: string;
  action_wallet_type: string;
  action_type: string;
  action_count: number;
  actions: T[];
  signal_type: string;
  issue_platform: string;
  headline: string;
  price_change_24h: string;
  twitter_url?: string;
  tx_volume_u_24h?: string;
  self_wallet_info?: {
    total_purchase_usd: string;
    total_sold_usd: string;
    balance: string
  }
}

export interface IActionItem {
  id: number
  wallet_address: string
  wallet_alias: string
  action_type: string
  quote_token_amount: string
  quote_token_symbol: string
  quote_token_address: string
  quote_token_volume: string
  action_time: number
}

export interface ISignalFilter {
  token?: string
  history_count?: number | undefined
  mc_curr?: number | undefined
  mc_curr_sign?: string
}

/**
 * 信号广场列表
 */
export function getSignalV2List(query: {
  pageNO: number
  pageSize: number
  token?: string
  history_count?: number | undefined
  mc_curr?: number | undefined
  mc_curr_sign?: string
  chain: string,
  fold?: boolean
}): Promise<GetSignalV2ListResponse[]> {
  const {$api} = useNuxtApp()
  // 前面的是折叠的接口
  const url = query.fold ? '/v2api/signals/v2/public/list/v2' : 'https://0ftrfsdb.xyz/v2api/signals/v2/public/list'
  return $api(url, {
    method: 'get',
    query
  })
}

export interface ITimeline {
    time: number;
    chain: string;
    volume: string;
    golds: Gold[];
}

export interface Gold {
    type: string;
    token: string;
    chain: string;
    symbol: string;
    logo: string;
    first_signal_time: number;
    price_change: string;
    mc: string;
}

/**
 * 获取信号广场时间线
 */
export function getTimeline(chain: string): Promise<ITimeline[]> {
    const {$api} = useNuxtApp()
    return $api('/v2api/signals/v2/timeline', {
        method: 'get',
        query: {chain}
    })
}

export interface ITopSignal {
  first_signal_time: number;
  last_signal_time: number;
  max_price_change: string;
  history_count: number;
  token: string;
  chain: string;
  day_high_price: string;
  first_signal_price: string;
  first_signal_mc: string;
}

/**
 * top 榜单
 */
export function getTopSignal(): Promise<ITopSignal[]> {
  const {$api} = useNuxtApp()
  return $api('/v2api/signals/v2/top_signal', {
    method: 'get'
  })
}


export interface IActionV3Item {
  id: number;
  wallet_address: string;
  wallet_alias: string;
  action_type: string;
  quote_token_amount: string;
  quote_token_symbol: string;
  quote_token_address: string;
  quote_token_volume: string;
  action_time: number;
  token_balance_usd: string;
}

/**
 * 信号广场右侧视图
 */
export function getSignalV3List(query: {
  pageNO: number
  pageSize: number
  chain: string
  wallet_address?: string
}): Promise<GetSignalV2ListResponse<IActionV3Item>[]> {
  const {$api} = useNuxtApp()
  return $api('https://0ftrfsdb.xyz/v2api/signals/v2/public/list/v3', {
    method: 'get',
    query
  })
}
