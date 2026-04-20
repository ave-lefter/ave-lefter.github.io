export interface WalletLogo {
  followers?: number
  logo: string
  name: string
  url: string
  vip_logo?: string
}

export interface SearchWalletInfo {
  chain: string
  is_wallet_address_fav: number
  main_token_balance_amount: string
  main_token_symbol: string
  remark: string
  total_profit: number
  total_profit_rate: number
  total_profit_ratio: number
  total_purchase: string
  total_purchase_usd: string
  total_sold: string
  total_sold_usd: string
  total_win_ratio: string
  wallet_address: string
  wallet_logo: WalletLogo
}
export interface SearchHot {
  id: string,
  amm: string
  burn_amount: number
  chain: string
  network: string
  current_price_usd: number
  front_show_index: number
  holders: number
  hot_rank: number
  is_adv: number
  is_hot: number
  is_showasadv: number
  launchpad: string
  lock_amount: number
  logo_url: string
  mcap: number
  opening_at: number
  other_amount: number
  pool_size: number
  price_change: number
  risk_score: number
  symbol: string
  token: string
  token_index: number
  total: number
  tx_amount_24h: number
  tx_count_24h: number
  tx_volume_u_24h: number
  risk_level: number,
  badges: { tag: string, icon_url: string }[],
  t_price_change_24h?: string;
  t_price_change_1d?: string;
  m_price_change_24h?: string;
  m_price_change_1d?: string;
  support_aggr_kline?: 1|0;
}

export interface SearchInfo {
  token_list: SearchHot[]
  wallet_list: SearchWalletInfo[]
}
