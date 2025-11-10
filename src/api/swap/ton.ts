import { getTonTokenList } from '~/utils/wallet/ton'
import { getTokensPrice } from '../token'

function requestProxy(params: { url: string; method?: string; data?: any; params?: any }) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/tgbot_porxy', {
    method: 'post',
    body: {
      path: params.url,
      method : params?.method?.toUpperCase(),
      params : params?.data || params?.params
    }
  })
}

export function getTonSwap(data: {
  inputToken: string
  outputToken: string
  inputTokenAmount: string
  walletPublicKey?: string
}) {
  if (data.inputToken === NATIVE_TOKEN) {
    data.inputToken = 'TON'
  }
  if (data.outputToken === NATIVE_TOKEN) {
    data.outputToken = 'TON'
  }
  if (!data.walletPublicKey) {
    const walletStore = useWalletStore()
    data.walletPublicKey = walletStore.address
  }
  return requestProxy({
    method: 'post',
    url: `:10071/construct-swap-message`,
    data: {
      ...data
    }
  })
}

export async function getTonTokenInfo(address: string, token: string) {
  let list = await getTonTokenList(address, token)
  let tokenInfo = list.find(i => i.address === token)
  if (tokenInfo) {
    return tokenInfo
  } else {
    let prices = await getTokensPrice([token + '-' + 'ton'])
    let symbolInfo = prices?.[0] || {}
    return {
      symbol: symbolInfo?.symbol || '',
      decimals: symbolInfo?.decimal || 0,
      address: token,
      token: token,
      chain: 'ton',
      id: token + '-' + 'ton',
      price: symbolInfo?.current_price_usd || 0,
      logo_url: symbolInfo?.logo_url || '',
    }
  }
}
