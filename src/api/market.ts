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
  sub_category: string[];
  is_pump: number;
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
  return $api('https://0ftrfsdb.xyz/v1api/v4/tokens/treasure/list', {
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
