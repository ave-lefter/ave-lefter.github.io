// 统计信息
export function getWhaleStatistics(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v1/info', {
    method: 'get',
    query: params,
  })
}

// 币种列表
export function getWhaleTokenList(params: {
  user_address: string
  chain: string
  pageNO: number
  pageSize: number
  sort_dir?: string
  sort?: string
  is_self?: 0 | 1
  hide_sold?: number
  hide_small?: number
  hide_risk?: number
  hide_noswap?: number
}): Promise<Array<{
  token: string
  chain: string
  logo_url: string
  symbol: string
  risk_level: number
  risk_score: number
  decimals: number
  main_pair_tvl: number
  is_little_pool: number
  last_txn_time: string
  total_profit: string
  total_profit_ratio: string
  unrealized_profit: string
  realized_profit: string
  unrealized_profit_ratio: string
  realized_profit_ratio: string
  balance_amount: string
  balance_usd: string
  total_purchase_usd: string
  average_purchase_price_usd: string
  total_sold_usd: string
  average_sold_price_usd: string
  total_transfer_in_amount: string
  total_transfer_out_amount: string
  total_purchase: string
  total_sold: string
  main_token_price: string
  main_token_symbol: string
  current_price_usd: string
  issue_platform: string
  average_net_purchase_price: string
  net_purchase_amount: string
  total_purchase_amount: string
  total_sold_amount: string
}>>{
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v1/tokens', {
    method: 'get',
    query: params,
  })
}

// 动态列表
export function getWhaleTrendList(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v1/events', {
    method: 'get',
    query: params,
  })
}

// 修改钱包备注
export function updateWhaleRemark(params) {
  const {$api} = useNuxtApp()
  return $api('/v2api/walletinfo/v1/remark', {
    method: 'post',
    body: params
  })
}

// 个人Token详情统计信息
export function getTokenStatistics(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/user/analysis', {
    method: 'get',
    query: params,
  })
}

// 个人Token详情列表
export function getTokenDetailsList(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/user/events', {
    method: 'get',
    query: params,
  })
}

// 个人Token详情曲线
export function getTokenDetailLine(pair, params) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v4/pairs/${pair}/sub_kline`, {
    method: 'get',
    query: params,
  })
}

// 个人Token详情曲线打点
export function getTokenDetailMarks(pair, params) {
  const { $api } = useNuxtApp()
  return $api(`/v2api/token/v1/user/${pair}/kline_event_tags`, {
    method: 'get',
    query: params,
  })
}

// 钱包基础信息
export interface IWalletInfo {
  x_name:                string;
  x_logo:                string;
  x_url:                 string;
  x_followers:           number;
  is_wallet_address_fav: number;
  remark:                string;
  wallet_logo:           WalletLogo;
  newTags:               any[];
  wallet_age:            string;
  last_txn_time:         Date;
  is_follow_kol:         number;
  follow_id:             number;
}

export interface WalletLogo {
  name:      string;
  url:       string;
  logo:      string;
  vip_logo:  string;
  followers: number;
}
//https://tsgrysq47oqo.sg.larksuite.com/wiki/NeenwruPiiJWQDkgnOClkMn9guf?fromScene=spaceOverview
export function getWalletBasicInfo(params): Promise<IWalletInfo> {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/info', {
    method: 'get',
    query: params,
  })
}

// 交易分析
export function getTxAnalysis(params: {
  user_address: string
  user_chain: string
  interval: string
}): Promise<{
  best_token?: Array<{
    chain: string
    logo_url: string
    symbol: string
    token: string
    total_profit: string
    total_profit_ratio: string
  }>
}>{
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/tx_analysis_v2', {
    method: 'get',
    query: params,
  })
}

// 活动分析
export function getEventsAnalysis(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/events_analysis', {
    method: 'get',
    query: params,
  })
}

// balance /pnl信息
export function getBalanceAnalysis(params: {
  user_address: string
  user_chain: string
  interval: string
}): Promise<{
  total_balance?: string
  total_balance_without_risk?: string
  total_balance_ratio?: string | number
  main_token_price?: string
  main_token_symbol?: string
  main_token_balance?: string
  profit: Array<{
    time: string
    value: string
    ratio: string | number
  }>
}> {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/balance_analysis', {
    method: 'get',
    query: params,
  })
}

// 交易分析详情
export function getEventsAnalysisDetail(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/events_analysis_detail', {
    method: 'get',
    query: params,
  })
}

// 发币记录
export function getDeployedTokens(params) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/deployed_tokens', {
    method: 'get',
    query: params,
  })
}

// 获取黑白名单
export function getTokenFilterList(params) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/balance/tokenfilterv2', {
    method: 'get',
    query: params,
  })
}

// 顶部持仓获取黑白名单
export function getTokenFilterList2(params) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/balance/tokenfilterv3', {
    method: 'post',
    body: params,
  })
}

// bindTwitter
export function bindTwitter(params: {
   user_address: string
  user_chain: string
  origin: string
  signature?: string
  authorization?: string
}) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/cache_x_callback', {
    method: 'get',
    query: params,
  })
}

// 修改钱包备注
export function setUserTokenStatus(
  { token, type }: { token: string; type: string },
  address: string,
  chain: string
) {
  const {$api} = useNuxtApp()
  return $api('/v1api/v3/users/balance/tokenfilter/add', {
    method: 'post',
    body: {
      token,
      type,
      address,
      chain,
    }
  })
}

// 获取黑白名单
export function getUserTokenList(address:string,chain:string) {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v3/users/balance/token?address=${address}&chain=${chain}`, {
    method: 'get',
  })
}

export interface IProfitCalendarResponse {
  days:    Day[];
  summary: Summary;
}

export interface Day {
  date:             Date;
  profit:           number;
  total_buy_count:  number;
  total_sell_count: number;
  buy_volume:       number;
  sell_volume:      number;
}

export interface Summary {
  month_total_profit:           number;
  month_total_buy_count:        number;
  month_total_sell_count:       number;
  month_total_buy_volume:       number;
  month_total_sell_volume:      number;
  win_days_count?:              number;
  loss_days_count?:            number;
  total_profit_on_win_days?:    number;
  total_profit_on_loss_days?:  number;
  current_win_streak?:          number;
  max_consecutive_win_days?:    number;
}
// 获取盈亏日历
export function getProfitCalendar(params:{
  user_address:string
  user_chain:string
  date:string
}):Promise<IProfitCalendarResponse> {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/calendar/pnl', {
    method: 'get',
    query: params,
  })
}

// 偏好代币分析
export function marketcap_analysis(query:{
  user_address:string
  user_chain:string
}) {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v2/marketcap_analysis', {
    method: 'get',
    query,
  })
}
