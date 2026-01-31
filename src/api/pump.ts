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


// https://api.test.phaetd8l.com/v2api/token_info/v1/token/dev/info?token_id=0xdcda006703eaa8143b2a56ff8028e73b7be24444-bsc

export function _getDevInfo(token_id: string): Promise<{
  first_transfer_in_from_label: any
  balance_radio_cur: string
  balance_usd: string
  buy_amount: string
  buy_count: number
  buy_volume_u: string
  first_deposit_address: string
  first_deposit_amount: string
  first_deposit_at: string
  sell_amount: string
  sell_count: number
  sell_volume_u: string
  value: string
  wallet_address: string
}> {
  const { $api } = useNuxtApp()
  return $api('/v2api/token_info/v1/token/dev/info', {
    method: 'get',
    query: {
      token_id
    }
  })
}
