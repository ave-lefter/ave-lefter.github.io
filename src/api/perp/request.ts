import { usePerpStore } from '~/stores/perp'

export const PerpBaseUrl = 'https://testnet.edgex.exchange'

// API响应类型
interface EdgeXApiResponse<T = any> {
  code: number
  msg: string
  data: T
  timestamp?: number
}

function getApi() {
  return $fetch.create({
    baseURL: PerpBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options, request }) {
      const perpStore = usePerpStore()
      const url = request as string
      if (url?.includes('onboardSite')) {
        options.headers = new Headers(options.headers)
        const headers = perpStore.generateEdgeXAuthHeaders({
          method: options.method || 'GET',
          path: url,
          body: (options.body as any) || undefined,
          params: (options.query as any) || undefined
        })
        Object.keys(headers).forEach(key => {
          options.headers.set(key, headers[key])
        })
      }
    },
    onResponse({ response, request, options }) {
      // const url = request as string
      // console.log('response', response._data);
      if (response?._data?.code === 'SUCCESS') {
        (response._data as EdgeXApiResponse<any>) = response._data.data
      } else {
        throw new Error(response?._data?.msg)
      }
    },
  })
}


export const perpApi = getApi()
