const solanaSwapApi= 'https://quote-api.jup.ag'

export default function requestSolana(request: RequestInfo, options = {}) {
  return $fetch.create({
    baseURL: solanaSwapApi,
    headers: {
      'Content-Type': 'application/json',
    },
  })(request, options).then((res: any) => {
    return Promise.resolve(res?.data || res || null)
  }).catch((err) => {
    return Promise.reject(err?.response?.data || 'error')
  })
}
