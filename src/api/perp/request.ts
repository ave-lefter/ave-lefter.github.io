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
      // const url = request as string
      // if (url?.includes('botapi')) {
      //   botOnRequest({ options, request })
      // } else {
      //   onRequest({ options, request })
      // }
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
