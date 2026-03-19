export interface TokenInfo {
  token: Token
  pairs: Pair[]
  // volumes: Volume[]
  // liquidities: Liquidity[]
  is_audited: boolean
}

export interface Liquidity {
  time: number
  amount: number
}
export interface Pair {
  pair: string
  chain: string
  amm: string
  token0_address: string
  token0_symbol: string
  token0_decimal: number
  token1_address: string
  token1_symbol: string
  token1_decimal: number
  target_token: string
  reserve0: number
  reserve1: number
  token0_price_eth: number
  token0_price_usd: number
  token1_price_eth: number
  token1_price_usd: number
  price_change: number
  reserve_change: number
  created_at: number
  tx_count: number
  updated_at: number
  volume_u: number
  low_u: number
  high_u: number
  tx_amount: number
  first_trade_at: number
  lp_holders: number
  lp_locked_percent: number
  lp_locked_to: string
  lp_lock_platform: string
  init_reserve0: number
  init_reserve1: number
  tag: string
  dynamic_tag: string
  price_change_5m: number
  price_change_1h: number
  price_change_4h: number
  price_change_24h: number
  buy_volume_u_24h: number
  sell_volume_u_24h: number
  volume_u_24h: number
  buys_tx_24h_count: number
  sells_tx_24h_count: number
  tx_24h_count: number
  buyers_24h: number
  sellers_24h: number
  makers_24h: number
  buy_volume_u_4h: number
  sell_volume_u_4h: number
  volume_u_4h: number
  buys_tx_4h_count: number
  sells_tx_4h_count: number
  tx_4h_count: number
  buyers_4h: number
  sellers_4h: number
  makers_4h: number
  buy_volume_u_1h: number
  sell_volume_u_1h: number
  volume_u_1h: number
  buys_tx_1h_count: number
  sells_tx_1h_count: number
  tx_1h_count: number
  buyers_1h: number
  sellers_1h: number
  makers_1h: number
  buy_volume_u_5m: number
  sell_volume_u_5m: number
  volume_u_5m: number
  buys_tx_5m_count: number
  sells_tx_5m_count: number
  tx_5m_count: number
  buyers_5m: number
  sellers_5m: number
  makers_5m: number
  swap_url: string
  is_swap_supported: number
  show_name: string
  is_fake: boolean
  smart_money_buy_count_24h: number
  smart_money_sell_count_24h: number
  progress: number
  risk_score: number
}

export interface Token {
  token: string
  chain: string
  decimal: number
  name: string
  symbol: string
  total: string
  holders: number
  open_price: number
  appendix: string
  publish_at: number
  intro_cn: string
  intro_en: string
  current_price_eth: number
  current_price_usd: number
  price_change: number
  price_change_v2: number
  risk_level: number
  logo_url: string
  risk_info: string
  lock_amount: number
  burn_amount: number
  other_amount: number
  lock_amount_dec: string
  burn_amount_dec: string
  other_amount_dec: string
  risk_score: number
  opening_at: number
  tag: string
  main_pair: string
  cto_flag: number
  dev_count: number
  owner?: string
  is_audited: boolean
  dev_balance_ratio_cur: number
  launchpad: string
  is_streaming?: boolean
  main_pair_tvl:number
}

export interface Volume {
  time: number
  volume: number
}

export interface TokenInfoExtra {
  highestPrice_24: number
  lowestPrice_24: number
  amount_24: number
  volume_24: number
  exchangeTime_24: number
  pair_holders: number
  pair_lock_percent: number
  buy_tax: number
  sell_tax: number
  can_mintable: boolean
  confirmed_minted: number
  max: number
  limit: number
  insiders_balance_ratio_cur: number
  is_cloned: number
  deployer_platform: string
  is_pump_agent: number
  t_price_change_24h: number
}


export interface WalletTokenInfo {
  token: string
  chain: BotChain
  logo_url: string
  symbol: string
  risk_level: number
  risk_score: number
  main_pair_tvl: number
  is_little_pool: number
  last_txn_time: string
  total_profit: string
  total_profit_ratio: string
  unrealized_profit: string
  unrealized_ratio: string
  realized_profit: string
  realized_ratio: string
  balance_amount: string
  balance_usd: string
  balance_ratio: string
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
  bought: string
  sold: string
  _price?: string
}

