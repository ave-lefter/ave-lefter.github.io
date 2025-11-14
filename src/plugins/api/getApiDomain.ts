import { isJSON } from '@/utils/index'
import isBase64 from 'is-base64'
// get server time

export function getServerTime(baseURL: string): Promise<number> {
  const start = Date.now()
  return $fetch('/v1api/v2/settings/serverTime', {
    baseURL,
    method: 'get'
  }).then(() => Date.now() - start)
}

export function selectFastestDomainFast(list: string[], timeout = 5000): Promise<string | undefined> {
  let resolved = false

  return new Promise((resolve) => {
    list.forEach(baseURL => {
      getServerTime(baseURL).then(() => {
        if (!resolved) {
          resolved = true
          resolve(baseURL)
        }
      }).catch(() => {
        // 忽略失败
      })
    })

    // 防止全部失败挂起
    setTimeout(() => {
      if (!resolved) resolve(undefined)
    }, timeout)
  })
}

export async function getApiDomainAndSave() {
  const apiDomain = localStorage.getItem('apiDomain')
  if (apiDomain && isJSON(apiDomain)) {
    const { time } = JSON.parse(apiDomain)
    if (Date.now() - time < 1000 * 60 * 60) {
      return // 缓存命中，直接返回
    }
  }

  const config = useRuntimeConfig()
  const baseUrl = config?.public?.apiBase as string

  try {
    const res: { data: string } = await $fetch('/v1api/v2/helper/avedexSource/apidomainlist', {
      baseURL: baseUrl,
      method: 'get',
      timeout: 80000,
      headers: {
        'ave-platform': 'web'
      }
    })

    const encoded = res.data

    if (!isBase64(encoded)) return

    const decoded = decodeURIComponent(window.atob(encoded).replace(/\+/g, ' '))
    const list: string[] = JSON.parse(decoded)

    console.log(list)

    localStorage.setItem('apiList', JSON.stringify(list))

    const best = await selectFastestDomainFast(list)
    if (best) {
      localStorage.setItem('apiDomain', JSON.stringify({
        domain: best,
        time: Date.now()
      }))
    }
  } catch (err) {
    console.error(err)

    // 尝试 fallback 使用历史缓存的列表
    const apiList = localStorage.getItem('apiList')
    const list: string[] = apiList && isJSON(apiList) ? JSON.parse(apiList) : []

    if (list.length > 0) {
      const best = await selectFastestDomainFast(list)
      if (best) {
        localStorage.setItem('apiDomain', JSON.stringify({
          domain: best,
          time: Date.now()
        }))
      }
    }
  }
}


export function getBestApiDomain () {
  const config = useRuntimeConfig()
  const baseUrl = config?.public?.apiBase as string
  if (baseUrl === 'https://api.test.phaetd8l.com') {
    return 'https://api.test.phaetd8l.com'
  }
  const apiDomain = localStorage.getItem('apiDomain')
  if (apiDomain && isJSON(apiDomain)) {
    return JSON.parse(apiDomain)?.domain
  }
  return baseUrl
}

