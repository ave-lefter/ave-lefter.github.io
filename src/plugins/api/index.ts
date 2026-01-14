// plugins/api.ts
import { getApiDomainAndSave, getBestApiDomain } from './getApiDomain'
import { onRequest, onResponse, updateAveToken } from './base'
import { botOnRequest, botOnResponse, botOnResponseError } from './bot'

function getApi() {
  getApiDomainAndSave()
  const baseURL = getBestApiDomain()
  const api = $fetch.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options, request }) {
      const newBase = getBestApiDomain()
      if (newBase && options.baseURL !== newBase) {
        options.baseURL = newBase
      }
      const url = request as string
      if (url?.includes('botapi')) {
        botOnRequest({ options, request })
      } else {
        onRequest({ options, request })
      }
    },
    onResponse({ response, request, options }) {
      const url = request as string
      if (url?.includes('botapi')) {
        botOnResponse({ options, request, response })
      } else {
        onResponse({ options, request, response })
      }
    },
  })

  type Par = Parameters<typeof api>
  type Res = Promise<any>
  const newApi: (...arg: Par) => Res = async (request: RequestInfo, options = {}) => {
    return api(request, options).catch(async err => {
      if (err?.response?.status === 401) {
        const response = err?.response
        const isRefToken = await botOnResponseError({ options, response, request })
        if (isRefToken) {
          return api(request, options)
        }
      } else if (err?.message === 'x-auth-error' || (err?.response?.status === 403 || [10000, 10001]?.includes(err?.response?._data?.status)) && !(request as string)?.includes('loginEmailV2')) {
        // onResponseError({response: err?.response} as MyFetchContext)
        const aveToken = await updateAveToken()
        if (aveToken) {
          return api(request, options)
        }
      } else {
        return Promise.reject(err)
      }
    })
  }
  // 将新的 API 方法与原始方法合并，确保可以使用原始功能
  return newApi
}

export default defineNuxtPlugin(() => {
  const $api = getApi()
  return {
    provide: {
      api: $api, // 通过 nuxtApp.$api 使用
    },
  }
})
