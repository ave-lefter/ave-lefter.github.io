interface Platform {
  platform: string
  platform_show: string
  platform_icon: string
}
export interface PumpConfig {
  chain: string
  chain_show: string
  platforms: Platform[]
}

export interface PumpObj {
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
  created_at: number
  time: string
  target_opening_at: number | string
  state: string
  medias: { name: string; icon: string; url: string }[]
  name: string
  cabal_tag_count: string
  kol_tag_count: number
  smart_wallet_tag_count: string
  sniper_count: string
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
  token1_address: string
  token1_decimal: number
  token1_price_usd: number
  token1_symbol: string
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

export type ChainKey = 'solana' | 'bsc'
export type CategoryKey = 'new' | 'soon' | 'graduated'

export type pumpBlack = {
  address: string,
  type: 'ca'|'dev'| 'keyword'
}
export type Size = 'small' | 'medium' | 'large'

export interface SizeObj {
  flash: string
  amm: string
  text: string
}