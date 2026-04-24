// 获取推特内容类型
export function getXType(tokenId: string): Promise<{
  type: 1 | 2 | 3
}> {
  const { $api } = useNuxtApp()
  return $api('/v2api/twitter/v1/type', {
    method: 'get',
    query: {
      token_id: tokenId
    },
  })
}

export interface XType1 {
  bookmark_count: number
  content: string
  content_en: string
  content_zh: string
  display_pic: string
  followers: number
  joined_date: string
  like_count: number
  name: string
  reply_count: number
  retweet_count: number
  tweet_created: string
  twitter_url: string
  username: string
  media?: string
  replied_tweet?: XType1
}

export interface XType2 {
  bio: string
  cover_pic: string
  date_joined: string
  display_pic: string
  followers: number
  following: number
  is_verified: boolean
  name: string
  twitter_url: string
  username: string
}

export interface XType3 {
  community_name: string
  created_date: string
  creator_followers: number
  creator_following: number
  creator_is_verified: boolean
  creator_name: string
  creator_picture: string
  creator_username: string
  description: string
  member_count: number
  member_logos: string[]
  twitter_url: string
  community_banner_url: string
}

// 获取推特内容
export function getXContent<T extends 1 | 2 | 3>(tokenId: string, type: T): Promise<T extends 1 ? XType1 : T extends 2 ? XType2 : XType3> {
  const { $api } = useNuxtApp()
  return $api('/v2api/twitter/v1/profile', {
    method: 'get',
    query: {
      token_id: tokenId,
      type
    },
  })
}
