import type { PumpConfig, PumpObj } from '@/api/types/pump'
export function _getPumpList(params): Promise<PumpObj[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/pump/v1/all', {
    method: 'get',
    query: params,
  })
}
export function _getPumpConfig(): Promise<PumpConfig[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/pump/v1/config')
}
