interface Platform {
  platform: string
  platform_show: string
  platform_icon: string
}
interface BaseToken {
  hash: string
  logo_url: string
  name: string
}
interface deployerPlatforms {
  logo_url: string
  name: string
  platform: string
}

export interface PumpConfig {
  chain: ChainKey
  chain_show: string
  platforms: Platform[]
  base_tokens: BaseToken[]
  deployer_platforms: deployerPlatforms[]
}

export interface PumpObj {
  deployer_platform: string
  is_cloned: any
  colluded_cluster_ratio: any
  summary_score: number | undefined
  following: number
  followers: number
  headline_en: string
  headline_cn: string
  headline_en: string
  headline_cn: string
  co_holders_count: string
  buy_tax: any
  sell_tax: any
  dev_migrated_count?: number
  dev_migrated_ratio?: number
  dev_total_count?: number
  dev_age_seconds?: any
  dev_first_transfer_in_from?: string
  dev_first_transfer_in_from_label?: any
  first_transfer_in_from_label?: string | undefined
  age_seconds?: any
  first_transfer_in_from?: any
  smart_wallet_ratio: number
  kol_ratio: number
  max_dev_ratio: number
  migrated_ratio: number
  total_count: number
  migrated_count: number
  id: string
  pair: string
  chain: string
  amm: string
  symbol: string
  logo_url: string
  token: string
  target_token: string
  token0_address: string
  token0_symbol: string
  reserve0: number
  token0_logo_url: string
  token1_address: string
  token1_symbol: string
  reserve1: number
  token1_logo_url: string
  tvl: number
  current_price_usd: number
  price_change: number
  tx_24h_count: number
  volume_u_24h: number
  dynamic_tag: string
  new_dynamic_tag: null
  tag: string
  market_cap: number
  holders: number
  risk_score: number
  risk_level: number
  appendix: string
  smart_money_buy_count_24h: number
  smart_money_sell_count_24h: number
  holders_top10_ratio: number
  dev_balance_ratio_cur: number
  insider_balance_ratio_cur: number
  sniper_balance_ratio_cur: number
  reply_count: number
  progress: number
  holders_1440: number
  total: number
  rug_rate: number
  issue_platform: string
  in_pump_interval: number
  token0_name: string
  token1_name: string
  token0_price_usd: number
  token1_price_usd: number
  created_at: number | string
  time: string
  target_opening_at: number | string
  state: string
  medias: { name: string; icon: string; url: string }[]
  name: string
  cabal_tag_count: string
  kol_tag_count: number
  smart_wallet_tag_count: string
  sniper_count: string
  twitter_type: 0 | 1 | 2 | 3
  makers_24h: number
  summary_cn?: string
  summary?: string
  buyers_24h?: number
  sellers_24h?: number
  platform: string
  is_streaming?: boolean
  platform_id: string
  pump_pair_address: string
  rTime?: number
  net_flow_vol?: number
  address_binding_ratio: string
  phishing_ratio: string
  sells_tx_24h_count: number
  buys_tx_24h_count: number
  baseToken: {
    symbol: string
    logo_url: string
    token: string
  }
  is_pump_agent: number
}

interface Pair {
  amm: string
  chain: string
  current_price_usd: number
  market_cap: number
  pair: string
  reserve0: number
  reserve1: number
  slot: number
  tag: null
  target_token: string
  token0_address: string
  token0_decimal: number
  token0_price_usd: number
  token0_symbol: string
  token0_logo_url: string
  token1_address: string
  token1_decimal: number
  token1_price_usd: number
  token1_symbol: string
  token1_logo_url: string
  total: number
  tvl: number
  progress: number
  token0_name: string
  token1_name: string
  name: string
}
export interface WSPumpObj {
  amm: string
  chain: string
  pair: Pair
  pump_pair_address: string
  state: string
  time: number
}
export type WSPump = WSPumpObj & Pair

export type ChainKey = 'solana' | 'bsc' | 'xlayer' | 'monad' | 'base'
export type CategoryKey = 'new' | 'soon' | 'graduated'

export type pumpBlack = {
  address: string,
  type: 'ca'|'dev'| 'keyword'| 'twitter'
}
export type Size ='mini'| 'small' | 'medium' | 'large'

export interface SizeObj {
  flash: string
  text: string
}
export interface pumpObjColor {
  color: string
  bg: string
}
export interface pumpData {
  platforms: string[]
  new: {
    count: number
    loading: boolean
    pumpFilter?: {}
  }
  soon: {
    count: number
    loading: boolean
    pumpFilter?: {}
  }
  graduated: {
    count: number
    loading: boolean
    pumpFilter?: {}
  }
}
