import { createCacheRequest } from '#imports'

// Dashboard 数据统计项接口
export interface DashboardStatItem {
  buy_cnt: string;
  buy_cnt_period: string;
  buy_volume: string;
  buy_volume_period: string;
  new_pair: string;
  new_pair_period: string;
  order_cnt: string;
  order_cnt_period: string;
  sell_cnt: string;
  sell_cnt_period: string;
  sell_volume: string;
  sell_volume_period: string;
  trader_cnt: string;
  trader_cnt_period: string;
}

// Dashboard 数据返回接口
export interface DashboardDataResponse {
  [key: string]: DashboardStatItem;
}

export interface IGetTreasureConfig {
  chain_id: string;
  name: string;
  net_name: string;
  is_hot: number;
  up: number;
  down: number;
  categories: CategoryElement[];
  swaps: Swap[];
}

export interface CategoryElement {
  category: string;
  name_zh_ch: string;
  name_zh_tw: string;
  name_en: string;
  name_es: string;
  name_pt: string;
  name_tr: string;
  name_ja: string;
  is_hot: number;
  sub_category?: Omit<CategoryElement,'sub_category'>[];
  is_pump: number;
}

export interface Swap {
  chain: string;
  name: string;
  swap_url: string;
  show_name: string;
}

export const getTreasureConfig = createCacheRequest(function(): Promise<IGetTreasureConfig[]> {
  const {$api} = useNuxtApp()
  return $api('/v1api/v4/tokens/treasure/config', {
    method: 'get',
    params: {
      include_live: true
    },
  })
}, 2000)

export function getTreasureList(query: Record<string, any>) {
  const {$api} = useNuxtApp()
  return $api('/v1api/v4/tokens/treasure/list', {
    method: 'get',
    query
  })
}

export function getPriceChangeTopTokens(query?: any) {
  const {$api} = useNuxtApp()
  return $api('/v1api/v2/tokens/priceChange', {
    method: 'get',
    query
  })
}

export function getMultiContractInfo(body) {
  const {$api} = useNuxtApp()
  return $api('/v1api/v3/tokens/multi_contract_info', {
    method: 'post',
    body
  })
}
interface Datum {
  chain:      string;
  kline_data: KlineDatum[];
  token:      string;
}

export interface KlineDatum {
  c:   string;
  h:   string;
  l:   string;
  o:   string;
  t:   number;
  tag: string;
  vol: string;
}

export function klinePreviews(query:{
  category:string
  interval:number
  pair_ids:string
}):Promise<Datum[]> {
  const {$api} = useNuxtApp()
  return $api('/v2api/token_info/v1/kline/previews', {
    method: 'get',
    query
  })
}

// 同名代币
export function getDashboardData(): Promise<DashboardDataResponse> {
  const { $api } = useNuxtApp()
  return $api('/v2api/pump/v1/dashboard', {
    method: 'get',
    query: {
    }
  })
}
