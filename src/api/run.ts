export interface MediaAppendix {
  website?: string
  btok?: string
  qq?: string
  telegram?: string
  twitter?: string
}

interface Rates {
  rugged?: number
  rugged_rate?: number
  total?: number
  rateList?: Array<{
    icon?: string
    rate?: number
    title?: {
      Cn: string
      En: string
      Es: string
      Pt: string
      Tw: string
    }
  }>
}
interface RugPull {
  dev: string
  rates: Rates
}
export type ResultRugPull = {
  all_tag_rate?: number
  dev?: string
  rates?: Rates
} & Rates
export function _getRugPull(token_id: string): Promise<RugPull> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/rugpullrate', {
    method: 'get',
    query: {
      token_id: token_id,
    },
  })
}
export function _getRugPullList(params: {
  token_id: string
  pageNO: number
  pageSize: number
}) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/stats/rugpulldev', {
    method: 'get',
    query: params,
  })
}

export function _getDevList(params: {
  token_id: string
  pageNO: number
  pageSize: number
  sort?: string
  sort_dir?: string
}) {
  const { $api } = useNuxtApp()
  return $api('/v2api/token_info/v1/token/dev', {
    method: 'get',
    query:{
      token_id: params.token_id,
      pageNO: params.pageNO,
      pageSize: params.pageSize,
      sort: params.sort,
      sort_dir: params.sort&&params.sort_dir
    }
  })
}


