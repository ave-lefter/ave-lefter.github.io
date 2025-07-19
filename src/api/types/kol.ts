export interface KolObj {
  wallet_address: string
  tag: string
  extra_info: ExtraInfo
  tag_items: TagItem[]
  chain: string
  total_trades: number
  buy_trades: number
  sell_trades: number
  token_profit_rate: number
  total_profit: number
  total_profit_rate: number
  total_volume: number
  total_purchase: number
  total_sold: number
  profit_above_900_percent_num: number
  profit_300_500_percent_num: number
  profit_500_900_percent_num: number
  profit_300_900_percent_num: number
  profit_100_300_percent_num: number
  profit_10_100_percent_num: number
  profit_neg10_10_percent_num: number
  profit_neg50_neg10_percent_num: number
  profit_neg100_neg50_percent_num: number
  last_trade_time: string
  is_wallet_address_fav: number
  remark: string
  wallet_logo: WalletLogo
  rank_score: number
}


export enum ExtraInfo {
  Empty = '{}',
}

export interface TagItem {
  address: string
  symbol: string
  volume: number
}

export interface WalletLogo {
  name?: string
  url?: string
  logo?: string
  vip_logo?: string
}
