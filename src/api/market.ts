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
  category: CategoryEnum;
  name_zh_ch: CategoryEnum;
  name_zh_tw: CategoryEnum;
  name_en: CategoryEnum;
  name_es: CategoryEnum;
  name_pt: CategoryEnum;
  name_tr: CategoryEnum;
  name_ja: CategoryEnum;
  is_hot: number;
  sub_category: CategoryEnum[];
  is_pump: number;
}

export interface CategoryEnum {
  BinanceAlpha: string
  Bonk: string
  Cto: string
  Four: string
  Gainer: string
  Hot: string
  Inclusion: string
  Moonshot: string
  New: string
  Novabits: string
  Pump: string
  Studio: string
  Volume: string
  Xstocks: string
}

export interface Swap {
  chain: string;
  name: string;
  swap_url: string;
  show_name: string;
}

export function getTreasureConfig(): Promise<IGetTreasureConfig[]> {
  const {$api} = useNuxtApp()
  return $api('/v1api/v4/tokens/treasure/config', {
    method: 'get',
  })
}

export function getTreasureList(query) {
  const {$api} = useNuxtApp()
  return $api('/v1api/v4/tokens/treasure/list', {
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
