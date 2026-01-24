import type { MyFetchContext } from './type'
import { isJSON } from '@/utils/index'

export function botOnRequest({ options, request }: MyFetchContext){
  const botStore = useBotStore()
  const lang = localStorage.language || 'en'
  options.headers = new Headers(options.headers)
  const url = request as string
  const lang1 = (lang == 'zh-cn' || lang == 'zh-tw') ? 'cn' : 'en'
  options.headers.set('lang', lang1)
  options.headers.set('Ave-Platform', 'web')
  const ave_token = localStorage.getItem('ave_token')
  if (ave_token) {
    options.headers.set('X-Auth', ave_token)
  }
  options.headers.set('lang-zone', localStorage.getItem('language') || 'en')
  if (url?.includes('refreshNewToken') && botStore.refreshToken) {
    options.headers.set('Authorization', `Bearer ${botStore.refreshToken}`)
  } else if (!url?.includes('login') && botStore.accessToken) {
    options.headers.set('Authorization', `Bearer ${botStore.accessToken}`)
  }
}

export function botOnResponse({ response, request, options }: MyFetchContext) {
  if (!response) {
    return
  }
  let data = response._data
  if (typeof data === 'string' && /"status":-1000[0-1]/.test(data) && isJSON(data)) {
    data = JSON.parse(data)
  }
  if (response?.status === 403 || [10000, 10001]?.includes(data?.status)) {
    throw new Error('x-auth-error')
  }
  if (response.status >= 400) {
    return botOnResponseError({ response, request, options })
  }
  if (data?.status === 0) {
    const botStore = useBotStore()
    botStore.botReqCount = 0
    response._data = data?.data
  } else {
    let msg = data?.msg || 'error'
    if (isJSON(msg)) {
      msg = JSON.parse(msg)
    }
    throw new Error(msg?.msg || msg || 'error')
  }
}

export async function botOnResponseError({ response, request }: MyFetchContext) {
  if (!response) {
    return
  }
  const status = response.status
  if (status === 401) {
    const url = request as string
    const botStore = useBotStore()
    if (!botStore.refreshToken || url?.includes('refreshNewToken?type=ref')) {
      botStore.logout()
      return false
    }
    const type: 'ref' | 'acc' = url?.includes('refreshNewToken') ? 'ref' : 'acc'
    return botStore.refreshAccessToken(type).then(async () => {
      return true
    }).catch(async err => {
      console.log(err)
      if (type === 'ref') {
        botStore.logout()
      }
      return false
    })
  } else {
    return false
  }
}

