import type { TokenInfo, TokenInfoExtra, WalletTokenInfo } from './types/token'
import { getAddressAndChainFromId, getChainInfo } from '@/utils'
import { NATIVE_TOKEN } from '@/utils/constants'
import { createCacheRequest } from '#imports'

// const testDomain = 'https://0ftrfsdb.xyz'

// export function getTokenInfo(id: string): Promise<null | TokenInfo> {
//   const {address, chain} = getAddressAndChainFromId(id)
//   if (!address || !chain) {
//     return Promise.resolve(null)
//   }
//   let id1 = id
//   if (address === NATIVE_TOKEN) {
//     const address1 = getChainInfo(chain)?.wmain_wrapper
//     id1 = address1 + '-' + chain
//   }
//   const { $api } = useNuxtApp()
//   return $api(`/v1api/v3/tokens/${id1}`)
// }

export function getTokenInfo(id: string): Promise<null | TokenInfo> {
  const { address, chain } = getAddressAndChainFromId(id)
  if (!address || !chain) {
    return Promise.resolve(null)
  }
  let id1 = id
  if (address === NATIVE_TOKEN) {
    const address1 = getChainInfo(chain)?.wmain_wrapper
    id1 = address1 + '-' + chain
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/token_info/v1/token/detail', {
    method: 'get',
    query: {
      token_id: id1,
      cache_use: false
    }
  })
}



export function getTokenInfoExtra(id: string): Promise<null | TokenInfoExtra> {
  const { address, chain } = getAddressAndChainFromId(id)
  if (!address || !chain) {
    return Promise.resolve(null)
  }
  let id1 = id
  if (address === NATIVE_TOKEN) {
    const address1 = getChainInfo(chain)?.wmain_wrapper
    id1 = address1 + '-' + chain
  }
  const { $api } = useNuxtApp()
  return $api(`/v1api/v2/tokens/${id1}/extraDetail`)
}


// // 获取 K 线历史数据
// export function getKlineHistoryData(data: {
//   interval: string
//   pair: string
// }): Promise<{
//   kline_data: Array<{
//     close: number
//     high: number
//     low: number
//     open: number
//     tag: string
//     time: number
//     volume: number
//   }>
//   extra_data?: {
//     amount_24: number
//     exchangeTime_24: number
//     highestPrice_24: number
//     lowestPrice_24: number
//     volume_24: number
//   }
// }> {
//   const [pair, chain] = getAddressAndChainFromId(data.pair, 1)
//   if (!pair || !chain) {
//     return Promise.resolve({
//       kline_data: [],
//       extra_data: undefined
//     })
//   }
//   const { $api } = useNuxtApp()
//   return $api(`/v1api/v4/pairs/${data.pair}/kline`, {
//     method: 'get',
//     query: {
//       interval: data.interval,
//       category: 'u',
//       count: 800
//     }
//   })
// }

// 获取 K 线历史数据
export function getKlineHistoryData(data: {
  token_id?: string
  pair_id?: string
  interval: string
  from: number
  to: number
}): Promise<{
  kline_data: Array<{
    close: number
    high: number
    low: number
    open: number
    tag: string
    time: number
    volume: number
  }>
 pair: string
}> {
  const [pair, chain1] = getAddressAndChainFromId(data?.pair_id || '', 1)
  const [token, chain2] = getAddressAndChainFromId(data?.token_id || '', 1)
  if ((!pair || !chain1) && (!token || !chain2)) {
    return Promise.resolve({
      kline_data: [],
      pair: pair || ''
    })
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/token_info/v1/kline', {
    method: 'get',
    query: {
      token_id: data.token_id,
      pair_id: data.pair_id,
      interval: data.interval,
      from: data.from,
      to: data.to,
      category: 'u',
      limit_count: 300
    }
  }).then(async(res) => {
    return {
      kline_data: (res?.kline_data || []).map((i: { t: number; o: number; h: number; l: number; c: number; vol: number; tag: string }) => ({
        time: i.t,
        open: i.o,
        high: i.h,
        low: i.l,
        close: i.c,
        volume: i.vol,
        tag: i.tag
      })),
      pair: res?.pair || pair || ''
    }
  }).catch(async () => {
    return {
      kline_data: [],
      pair: pair || ''
    }
  })
}

// 画像描点接口 用户交易
export function getUserKlineTxTags(data: {
  interval: string
  from: number
  to: number
  pair: string
  token_address: string
  user_address?: string
}): Promise<Array<{
  sell?: {
    amount: number
    txns: number
    volume: number
  }
  buy?: {
    amount: number
    txns: number
    volume: number
  }
  time: number
}>> {
  const { $api } = useNuxtApp()
  const user_address = data?.user_address
  if (!user_address || !data?.pair) {
    return Promise.resolve([])
  }
  return $api(`/v1api/v4/pairs/${data?.pair}/kline_tx_tags`, {
    method: 'get',
    query: {
      ...data,
      user_address,
    }
  }).catch(() => {
    return Promise.resolve([])
  })
}

export function getKlineProfilingTags(data: {
  interval: string
  from: number
  to: number
  type: string
  pair: string
}): Promise<Array<{
  sell?: {
    amount: number
    txns: number
    volume: number
  }
  buy?: {
    amount: number
    txns: number
    volume: number
  }
  time: number
}>> {
  if (!data?.pair) {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api(`/v1api/v4/pairs/${data?.pair}/kline_profiling_tags`, {
    method: 'get',
    query: {
      ...data,
    }
  }).catch(() => {
    return Promise.resolve([])
  })
}

export interface GetHotTokensResponse {
  token: string;
  chain: string;
  symbol: string;
  holders: number;
  current_price_usd: number | string;
  price_change: string;
  is_adv: number;
  is_showasadv: number;
  token_index: number;
  front_show_index: number;
  logo_url: string;
  opening_at: number;
  hot_rank: number;
  tx_amount_24h: number;
  tx_count_24h: number;
  tx_volume_u_24h: number;
  risk_score: number;
  pool_size: number;
  total: number;
  lock_amount: number;
  burn_amount: number;
  other_amount: number;
  amm: string;
  mcap: number;
  is_hot: number;
  launchpad: string;
  risk_level: number
}

export function getHotTokens(): Promise<GetHotTokensResponse[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/hot', {
    method: 'get',
  })
}

interface NewTag {
  type: string;
  en: string;
  cn: string;
  tw: string;
  es: string;
  pt: string;
  tr: string;
  ja: string;
  icon: string;
  color: string;
  extra_info: null;
  nick_name: string;
}
export interface GetPairTxsResponse {
  time: number;
  id: string;
  chain: string;
  transaction: string;
  amm: any;
  amount_eth: number;
  amount_usd: number;
  from_address: string;
  from_price_eth: number;
  from_price_usd: number;
  from_symbol: string;
  from_amount: number;
  to_address: string;
  to_price_eth: number;
  to_price_usd: number;
  to_symbol: string;
  to_amount: number;
  wallet_address: string;
  wallet_tag_extra: any;
  newTags: NewTag[];
  wallet_logo: any;
  wallet_tag_v2?: string;
  profile: string;
}

// 交易历史
export function getPairTxs(query: {
  pair: string,
  tag_type?: string,
  maker?: string,
  time_min?: string,
  time_max?: string
}): Promise<GetPairTxsResponse[]> {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v5/pairs/${query.pair}/txs`, {
    method: 'get',
    query
  })
}

export interface IGetTokenTxsResponse {
  time: number;
  id: string;
  chain: string;
  transaction: string;
  amm: string;
  amount_eth: number;
  amount_usd: number;
  from_address: string;
  from_price_eth: number;
  from_price_usd: number;
  from_symbol: string;
  from_amount: number;
  to_address: string;
  to_price_eth: number;
  to_price_usd: number;
  to_symbol: string;
  to_amount: number;
  wallet_address: string;
  profile: string;
  wallet_tag_v2: string;
  newTags: NewTag[];
  wallet_logo: any;
  // MC计算所需字段
  total?: string | number;
  burn_amount?: number;
  lock_amount?: number;
  other_amount?: number;
}

// 新版交易历史
export function getTokenTxs(query: {
  token_id: string,
  tag_type?: string,
  maker?: string,
  time_min?: string,
  time_max?: string
}): Promise<IGetTokenTxsResponse[]> {
  const {$api} = useNuxtApp()
  return $api('/v2api/token_info/v1/token/txs', {
    method: 'get',
    query
  })
}

export interface GetPairLiqResponse {
  time: number;
  chain: string;
  transaction: string;
  amm: string;
  sender: string;
  pair_address: string;
  type: string;
  amount_eth: number;
  amount_usd: number;
  pair_liquidity_eth: number;
  pair_liquidity_usd: number;
  token0_address: string;
  token0_price_eth: number;
  token0_price_usd: number;
  token0_symbol: string;
  amount0: number;
  reserve0: number;
  token1_address: string;
  token1_price_eth: number;
  token1_price_usd: number;
  token1_symbol: string;
  amount1: number;
  reserve1: number;
  wallet_address: string;
  is_wallet_address_fav: number;
  remark: string;
  wallet_logo: any;
  newTags: NewTag[];
}

export interface Profile {
  token0TotalHolding: number;
  token1TotalHolding: number;
  token0Address: string;
  token1Address: string;
  solTotalHolding: number;
  token0HasNewAccount: boolean;
  token0HasClosedAccount: boolean;
  token0HasClearedAccount: boolean;
  token1HasNewAccount: boolean;
  token1HasClosedAccount: boolean;
  token1HasClearedAccount: boolean;
}


// 交易历史流动性
export async function getPairLiq(pair: string, address?: string): Promise<GetPairLiqResponse[]> {
  if (!pair || pair.length < 15) {
    return []
  }
  const { $api } = useNuxtApp()
  return $api(`/v1api/v4/pairs/${pair}/liq`, {
    method: 'get',
    params: {
      address
    },
  })
}

export interface GetPairLiqNewResponse {
  time: string;
  removeliquidity_total: number;
  addliquidity_total: number
}
export async function getPairLiqNew(pair:string, interval = 30):Promise<GetPairLiqNewResponse[]> {
  if (!pair) {
    return []
  }
  const { $api } = useNuxtApp()
  return $api(`/v1api/v3/pairs/${pair}/liq`, {
    method: 'get',
    params: {
      interval
    },
  }).catch(() => {
    return Promise.resolve([])
  })
}
export type LockType = {
  amount: number;
  id: number;
  lockDate: number;
  owner: string;
  token: string;
  unlockDate: number;
  vesting_end?: number;
}
export interface IHolder {
  add_total: number;
  address: string;
  lock: LockType[];
  main_token_amount: number;
  main_token_amount_usd: number;
  mark: string;
  percent: string;
  quantity: string;
  remove_total: number;
  target_token_amount: number;
  target_token_amount_usd: number;
  last_tx_time?: string
}
export interface GetLPHoldersResponse {
  main_token: string;
  main_token_symbol: string;
  target_token: string;
  target_token_symbol: string;
  holders: IHolder[] | null;
}
export function getLPHolders(tokenId: string) : Promise<GetLPHoldersResponse>{
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/lp_holders',{
    method: 'get',
    params: {
      token_id: tokenId,
    }
  })
}

export interface GetTxsUserBriefResponse {
  remark: string;
  is_wallet_address_fav: number;
  chain: string;
  symbol: string;
  newTags: any[];
  balance_amount: string;
  balance_usd: string;
  history_max_balance_amount: string;
  history_max_balance_usd: string;
  history_min_balance_amount: string;
  history_min_balance_usd: string;
  total_transfer_in_usd: string;
  total_transfer_out_usd: string;
  total_transfer_in: string;
  total_transfer_out: string;
  total_transfer_in_amount: string;
  total_transfer_out_amount: string;
  total_sold_usd: string;
  total_purchase_usd: string;
  total_sold: string;
  total_purchase: string;
  total_sold_amount: string;
  total_purchase_amount: string;
  unrealized_profit: string;
  realized_profit: string;
  total_profit: string;
  total_profit_ratio: string;
  profit: string;
  profit_ratio: string;
  win_ratio: string;
  wallet_age: string;
  token_txns: string;
  top3_blue_chip: Top3BlueChip[];
}

interface Top3BlueChip {
  token: string;
  chain: string;
  symbol: string;
  logoUrl: string;
  balance_amount: number;
  balance_usd: number;
  current_price_usd: number;
}


// 获取交易Hover地址展示
export function getTxsUserBrief(query: {
  user_address: string;
  chain: string;
  token: string;
}): Promise<GetTxsUserBriefResponse> {
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/user/brief', {
    method: 'get',
    query,
  })
}

export function getUserTxs(token_id: string, address: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/pairs/userMergedTxs', {
    method: 'get',
    params: {
      token_id: token_id,
      user_address: address,
    }
  })
}

export function getTokensPrice(tokenIds: string[]) {
  const ids = tokenIds.map(i => {
    const [token, chain] = getAddressAndChainFromId(i, 1)
    if (token && chain && token === NATIVE_TOKEN) {
      const chainInfo = getChainInfo(chain)
      return chainInfo.wmain_wrapper + '-' + chain
    }
    return i
  })
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/price4h5', {
    method: 'post',
    body: {
      token_ids: ids
    }
  }).then(async res => {
    return ids.map(i => res[i])
  })
}

export interface GetTokenDetailsLineResponse {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tag: string;
}

// 个人Token详情曲线
export function getTokenDetailLine(pair: string, params: {
  from: number;
  to: number;
  interval: number;
}): Promise<GetTokenDetailsLineResponse[]> {
  const { $api } = useNuxtApp()
  return $api(`/v1api/v4/pairs/${pair}/sub_kline`, {
    method: 'get',
    // url: `/v1api/v4/pairs/9TapsuZxQjAWWxkF6yVUTkRWophLmh6mbUXPNJ8RK5mc-solana/sub_kline_pair?interval=60&from=1730596000&to=1730796044`,
    params,
  })
}

export interface GetTokenDetailMarksResponse {
  time: number;
  has_t?: boolean;
  transfer_in: TransferIn;
}

interface TransferIn {
  volume: number;
  amount: number;
  txns: number;
}

// 个人Token详情曲线打点
export function getTokenDetailMarks(pair: string, query: {
  from: number;
  to: number;
  interval: number;
  event_type: string;
  user_address: string;
}): Promise<GetTokenDetailMarksResponse[]> {
  const { $api } = useNuxtApp()
  return $api(`/v2api/token/v1/user/${pair}/kline_event_tags`, {
    method: 'get',
    // url: `/v2api/token/v1/user/9TapsuZxQjAWWxkF6yVUTkRWophLmh6mbUXPNJ8RK5mc-solana/kline_event_tags?interval=14400&from=1730596000&to=1730796044&event_type=T_Trading&user_address=2hv3VQHCCkhFKTgH5r5gYfVARZAHhKXftDfKaobg1CMa`,
    query,
  })
}

export interface GetTokenStatisticsResponse {
  remark: string;
  is_wallet_address_fav: number;
  wallet_logo: WalletLogo;
  x_name: string;
  x_logo: string;
  x_url: string;
  chain: string;
  newTags: any[];
  balance_amount: string;
  balance_usd: string;
  history_max_balance_amount: string;
  history_max_balance_usd: string;
  history_min_balance_amount: string;
  history_min_balance_usd: string;
  total_transfer_in_usd: string;
  total_transfer_out_usd: string;
  total_transfer_in: string;
  total_transfer_out: string;
  total_sold_usd: string;
  total_purchase_usd: string;
  total_sold: string;
  total_purchase: string;
  total_sold_amount: string;
  total_purchase_amount: string;
  average_purchase_price_usd: string;
  average_sold_price_usd: string;
  total_profit: string;
  total_profit_ratio: string;
  unrealized_profit: string;
  realized_profit: string;
  profit: string;
  profit_ratio: string;
  win_ratio: string;
  wallet_age: string;
  token_txns: string;
  current_price_usd: string;
  main_token_symbol: string;
  main_token_balance_amount: string;
}

interface WalletLogo {
  name: string;
  url: string;
  logo: string;
  vip_logo: string;
  followers: number;
}

// 个人Token详情统计信息
export function getTokenStatistics(query: {
  user_address: string;
  self_address?: string;
  token: string;
  chain: string;
}): Promise<GetTokenStatisticsResponse> {
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/user/analysis', {
    method: 'get',
    query,
  })
}

export interface GetTokenDetailsListReq {
  user_address: string;
  token: string;
  chain: string;
  pageNO: number;
  pageSize: number;
  max_block_number: number;
  max_event_id: number;
  event_type?: string;
  volume_min?: number;
  volume_max?: number;
}

export interface GetTokenDetailsListResponse {
  token: string;
  chain: string;
  logo_url: string;
  symbol: string;
  risk_level: number;
  risk_score: number;
  block_time: number;
  event_type: string;
  event_type_id: number;
  volume: string;
  amount: string;
  token_price_u: string;
  tx_hash: string;
  opponent_address: string;
  is_target: boolean;
  block_number: number;
  event_id: number;
  tx_seq: string;
  date: string;
  flow_type: number;
  token1: string;
  token1_logo_url: string;
  token1_symbol: string;
  token1_amount: string;
  token1_volume: string;
  newTags: any[];
  main_token_price: string;
  main_token_symbol: string;
  total_fee: string;
  total_fee_u: string;
  total: number;
  lock_amount: number;
  burn_amount: number;
  other_amount: number;
  from_redis: boolean;
}

// 个人Token详情列表
export function getTokenDetailsList(query: GetTokenDetailsListReq): Promise<GetTokenDetailsListResponse[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/user/events', {
    method: 'get',
    query,
  })
}

export interface GetHomePumpListResponse {
  pair: string;
  chain: string;
  amm: string;
  target_token: string;
  target_name: string;
  token0_address: string;
  token0_symbol: string;
  reserve0: number;
  token0_logo_url: string;
  token1_address: string;
  token1_symbol: string;
  reserve1: number;
  token1_logo_url: string;
  current_price_usd: number;
  price_change_24h: string;
  tx_24h_count: number;
  volume_u_24h: number;
  makers_24h: number;
  created_at: Date;
  progress: number;
  market_cap: number;
  is_fav: boolean;
  issue_platform: string;
}

//pump榜单
export function homePumpList(query: {
  chain: string;
  pageNO: number;
  pageSize: number;
  category: string;
  self_address?: string;
  sort?: string;
  sort_dir?: string;
}): Promise<{ data: GetHomePumpListResponse[] }> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v4/tokens/treasure/pump/list', {
    method: 'get',
    query,
  })
}

export function getUserBalances(token_id: string, user_ids: string[]): Promise<{
  user_id: string;
  decimals: number;
  value: number;
  current_price_usd: number;
}[]> {
  const {$api} = useNuxtApp()
  return $api('/v1api/v3/users/balance/users', {
    method: 'post',
    body: {
      token_id, user_ids
    }
  })
}

export const bot_getUserWalletTxInfo = createCacheRequest(async function(query: {
  user_address: string;
  user_token: string;
  chain: string;
}): Promise<Array<WalletTokenInfo>>  {
  const { $api } = useNuxtApp()
  return $api('/v2api/walletinfo/v1/usertx', {
    method: 'get',
    query,
  })
}, 2000)

export async function bot_getUserTxHistory1(query: {
  page: number;
  pageSize: number;
  chain: string;
  walletAddress: string;
  token: string;
  timeSort: boolean;
  tradeVolumeSort: boolean;
  isSuccess: boolean;
  status: string;
  minTradeVolume?: number;
  maxTradeVolume?: number;
  isLimit?: number;
  isBuy?: number;
  tgUid: string;
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getUserTxHistory', {
    method: 'get',
    query,
  })
}

export async function bot_getUserPendingTx(query: {
  chain: string;
  token: string;
  walletAddress: string;
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getUserPendingTx', {
    method: 'get',
    query,
  })
}

export function bot_cancelLimitOrdersByBatch(params: any) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/cancelLimitOrdersByBatch', {
    method: 'post',
    body: {
      source: 'web',
      ...params
    },
  })
}

export function cancelAllLimitOrdersByGuid(params: any) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/cancelAllLimitOrdersByGuid', {
    method: 'post',
    body: {
      ...params
    },
  })
}

export async function getCampaignToken(query: any) {
  const { $api } = useNuxtApp()
  return $api('/campaign/token/v1/chart', {
    method: 'get',
    query,
  })
}


export interface IGetAllTagsResponse {
  type: string;
  en: string;
  cn: string;
  tw: string;
  es: string;
  pt: string;
  tr: string;
  ja: string;
  icon: string;
  color: string;
  extra_info: any;
  nick_name: string;
}

export function getAllTags(): Promise<IGetAllTagsResponse[]> {
  const {$api} = useNuxtApp()
  return $api('/v2api/token_info/v1/tags', {
    method: 'get',
  })
}

export interface AiSummaryResponse{
  summary:string;
  headline:string;
}

export function getAiSummary(id: string): Promise<null |AiSummaryResponse> {
  const { address, chain } = getAddressAndChainFromId(id)
  if (!address || !chain) {
    return Promise.resolve(null)
  }
  let id1 = id
  if (address === NATIVE_TOKEN) {
    const address1 = getChainInfo(chain)?.wmain_wrapper
    id1 = address1 + '-' + chain
  }
  const { $api } = useNuxtApp()
  return $api('/v2api/token/v1/summary', {
    method: 'get',
    query: {
      token_id: id1,
      cache_use: false
    }
  })
}
