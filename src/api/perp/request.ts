import { usePerpStore } from '~/stores/perp'

function getBestApiDomain () {
  // const baseUrl = 'https://0ftrfsdb.xyz'
  const apiDomain = localStorage.getItem('apiDomain')
  if (apiDomain && isJSON(apiDomain)) {
    return JSON.parse(apiDomain)?.domain
  }
  return 'https://mayeas023.com'
  // return 'https://pro.edgex.exchange'
}


// export const PerpBaseUrl = 'https://testnet.edgex.exchange'
export const PerpBaseUrl = getBestApiDomain() + '/perp/edgex'

// API响应类型
interface EdgeXApiResponse<T = any> {
  code: number
  msg: string
  data: T
  timestamp?: number
}

const xAuthList = ['onboardSite','getPositionTransactionPage','getAllOrdersPage','profit','ranking','info','asset/detail','boxopen','getActiveOrderPage']
const authorizationList = ['ranking','info','boxopen']
function getApi() {
  return $fetch.create({
    baseURL: PerpBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ options, request }) {
      // const url = request as string
      // if (url?.includes('botapi')) {
      //   botOnRequest({ options, request })
      // } else {
      //   onRequest({ options, request })
      // }
      const newBase = getBestApiDomain() + '/perp/edgex'
      if (newBase && options.baseURL !== newBase) {
        options.baseURL = newBase
      }
      const perpStore = usePerpStore()
      const walletStore = useWalletStore()
      let url = request as string
      options.headers = new Headers(options.headers)
      if (walletStore.address) {
        options.headers.set('l1address', walletStore.address)
      }
      if (authorizationList.some(item=>url.includes(item))) {
        options.headers.set('Authorization', 'Bearer 0')
        url=url.replace('https://award.edgex.exchange/api','')
      }
      if (xAuthList.some(item=>url.includes(item))) {
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
      if (response?._data?.code === 'SUCCESS' || response._data?.msg?.toUpperCase?.() === 'SUCCESS') {
        (response._data as EdgeXApiResponse<any>) = response._data.data
      } else {
        throw new Error(response?._data?.msg)
      }
    },
  })
}


export const perpApi = getApi()
