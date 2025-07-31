import type { KolObj } from '@/api/types/kol'

export function _getKolList(params): Promise<KolObj[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v4/tokens/kol/list', {
    method: 'get',
    query: params,
  })
}

export function _getSmartList(params): Promise<KolObj[]> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v4/tokens/smart_wallet/list', {
    method: 'get',
    query: params,
  })
}
