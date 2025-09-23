export interface LiveContent {
  ath_market_cap: string
  banner_uri: string
  chain: string
  creator: string
  description: string
  image_uri: string
  is_currently_live: boolean
  market_cap: string
  metadata_uri: string
  name: string
  num_participants: number
  platform: string
  reply_count: number
  created_timestamp: number
  symbol: string
  telegram: string
  thumbnail: string
  token: string
  total_supply: string
  twitter: string
  usd_market_cap: string
  video_uri: string
  website: string
  detail_url: string
}

// 获取 token 直播信息
export function getPumpLiveContent(tokenId: string): Promise<LiveContent> {
  const { $api } = useNuxtApp()
  return $api('/v2api/token_info/v1/live/profile', {
    method: 'get',
    query: {
      token_id: tokenId,
    },
  })
}
interface obj {
  twitter_type: number,
  website?: string
  btok?: string
  telegram?: string
  twitter?: string
}
interface media {
  icon: 'website' | 'btok' | 'telegram' | 'twitter'
  name: ''
  url: ''
}
interface medias {
  medias: media []
}

export type pumpLiveObj = LiveContent & obj & medias

export function getPumpLiveList(query?: Record<string, any>): Promise<pumpLiveObj[]> {
  const { $api } = useNuxtApp()
  return $api('/v2api/treasure/v1/live/list', {
    method: 'get',
    query,
  })
}