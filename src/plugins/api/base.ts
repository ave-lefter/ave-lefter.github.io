import sha1 from 'crypto-js/sha1'
import isBase64 from 'is-base64'
import { createCacheRequest } from '@/utils/cacheRequest'

import type { MyFetchContext } from './type'


export function onRequest({ options, request }: MyFetchContext) {
   // 非 bot 基础请求
  options.headers = new Headers(options.headers)

  // 请求头 语言
  let language: string = localStorage.getItem('language') || 'en'
  if (language?.includes('zh')) {
    language = 'cn'
  }
  // headers.lang = language
  options.headers.set('lang', language)

  const url = request as string
  // 请求头 authorization
  if (url?.includes('/v1api/v1')) {
    const date = Date.now()
    const authorization = sha1(date + url.replace('/v1api', '') + '7vPoX2G.8LYVQfnt').toString()
    options.headers.set('Authorization', authorization + date)
  }

  if (url?.includes('/v1api/') || url.startsWith('/v2api/')) {
    const analogDeviceId = localStorage.getItem('analogDeviceId')
    if (analogDeviceId) {
      options.headers.set('ave-udid', analogDeviceId)
    }
    const currentAccount = localStorage.getItem('walletAddress')
    if (currentAccount) {
      const signature = useWalletStore().walletSignature?.[currentAccount] || ''
      if (signature) {
        options.headers.set('signature', signature)
      }
    }
    const ave_token = localStorage.ave_token
    if (ave_token) {
      options.headers.set('X-Auth', ave_token)
    }
    options.headers.set('Ave-Platform', 'web')
  }
  const needAuthUrl = ['/signals/v2/public/list/v3','/v2api/fav_users/']
  const needAuth = needAuthUrl.some(el=>url.includes(el))
  if (needAuth) {
    const accessToken = useBotStore().accessToken
    if (accessToken) {
      options.headers.set('Authorization', `Bearer ${accessToken}`)
    }
  }
}

export function onResponse({ response }: MyFetchContext) {
  // 全局响应处理
  if (!response) {
    return
  }
  const data = response._data
  if (data?.status === 0) {
    // return Promise.reject(data?.msg)
    throw new Error(data?.msg)
  }
  if (data?.data_type === 1 && typeof(data?.data) === 'string' && data?.data) {
    response._data = JSON.parse(data?.data)
    return
  }
  if ((data?.data_type === 2  || data?.data_type === 3) && data?.encode_data && typeof(data?.encode_data) === 'string' && isBase64(data?.encode_data)) {
    response._data = JSON.parse(window.decodeURIComponent(window.atob(data?.encode_data).replace(/\+/g, ' ')))
    return
  }
  if (typeof(data) === 'string' && isBase64(data)) {
    response._data = JSON.parse(window.decodeURIComponent(window.atob(data).replace(/\+/g, ' ')))
    return
  }
  if (data?.status === 1 && data?.data) {
    response._data = data?.data
    return
  }
  response._data = data
}

export const updateAveToken = createCacheRequest(() => {
  const w: Window & {
    vemachine?: {
      generateToken?: (arg: boolean) => Promise<string>
    }
  } = window
  if (!w?.vemachine?.generateToken) {
    return Promise.resolve('')
  }
  return w?.vemachine?.generateToken?.(true)
}, 3000)

export function onResponseError ({ response }: MyFetchContext) {
  const status = response?.status
  if (status === 403) {
    updateAveToken()
  }
}

