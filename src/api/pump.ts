import type { PumpConfig, PumpObj } from '@/api/types/pump'
import localforage from 'localforage'
import { cloneDeep } from 'lodash-es'
import { createCacheRequest } from '#imports'

const PUMP_CONFIG_CACHE_KEY = 'pump_config_cache'
const CACHE_DURATION = 10 * 60 * 1000 // 10 分钟
export function _getPumpList(params: any): Promise<PumpObj[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/pump/v1/all', {
    method: 'get',
    query: params,
  })
}
export async function _getPumpConfig(): Promise<PumpConfig[]> {
  const { $api } = useNuxtApp()

  try {
    // 尝试从缓存读取
    const cachedData = await localforage.getItem<{ data: PumpConfig[], timestamp: number }>(PUMP_CONFIG_CACHE_KEY)

    if (cachedData) {
      const { data, timestamp } = cachedData
      const now = Date.now()

      // 检查缓存是否有效（10 分钟内）
      if (now - timestamp < CACHE_DURATION && data?.length) {
        console.log('[PumpConfig] 使用缓存数据')
        return cloneDeep(data)
      } else {
        console.log('[PumpConfig] 缓存已过期，清除旧缓存')
        await localforage.removeItem(PUMP_CONFIG_CACHE_KEY)
      }
    }

    // 缓存不存在或已过期，从 API 获取
    console.log('[PumpConfig] 从 API 获取最新数据')
    const freshData = await createCacheRequest(() => $api('/v2api/pump/v1/config'))()

    // 保存到缓存
    await localforage.setItem(PUMP_CONFIG_CACHE_KEY, {
      data: freshData,
      timestamp: Date.now()
    })

    return freshData
  } catch (error) {
    console.error('[PumpConfig] 获取配置失败:', error)
    // 如果出错，尝试返回缓存数据（即使已过期）
    try {
      const expiredCache = await localforage.getItem<{ data: PumpConfig[], timestamp: number }>(PUMP_CONFIG_CACHE_KEY)
      if (expiredCache?.data) {
        console.warn('[PumpConfig] API 失败，使用过期缓存')
        return cloneDeep(expiredCache.data)
      }
    } catch (fallbackError) {
      console.error('[PumpConfig] 获取过期缓存也失败:', fallbackError)
    }
    throw error
  }
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

//同车代币
export interface HolderRankItem {
  amount: string
  balance_radio: string
  balance_usd: string
  chain: string
  is_wallet_address_fav: number
  remark: string
  tag_type: number
  wallet_address: string
  wallet_logo: string
}
export function _getHolderRank(params: {
  token_id: string
  self_address?: string
  tag_type?: number
}): Promise<{
  items: HolderRankItem[]
}> {
  const { token_id, self_address, tag_type } = params
  const { $api } = useNuxtApp()

  return $api('/v2api/token_info/v1/token/holders/rank', {
    method: 'get',
    query: {
      limit: 100,
      token_id,
      self_address,
      tag_type,
    },
  })
}
