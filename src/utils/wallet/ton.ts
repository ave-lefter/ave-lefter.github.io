import TonWeb from 'tonweb'
import { HttpClient, Api, type JettonBalance } from 'tonapi-sdk-js'
import { getTokensPrice } from '@/api/token'
import { createSequentialThrottle } from '@/utils/createSequentialThrottle'
import BigNumber from 'bignumber.js'

const { JettonMinter, JettonWallet} = TonWeb.token.jetton

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'))

const httpClient = new HttpClient({
  baseUrl: 'https://tonapi.io',
  baseApiParams: {
    headers: {
        // Authorization: `Bearer ${YOUR_TOKEN}`,
        'Content-type': 'application/json'
    }
  }
})
// Initialize the API client

const client = new Api(httpClient)


export function toBase64Address(address: string, isBounceable = true) {
  const Address = TonWeb.utils.Address
  return new Address(address).toString(true, true, isBounceable, false)
}

export function toTonAddress(address: string) {
  const Address = TonWeb.utils.Address
  return new Address(address).toString(false, false, false, false)
}

function _getTonBalance(address: string, type: 0): Promise<number>
function _getTonBalance(address: string, type: 1): Promise<JettonBalance[]>
function _getTonBalance(address: string, type: 0 | 1) {
  if (type === 0) {
    return client.accounts.getAccount(address).then(async res => res?.balance || 0)
  } else {
    return client.accounts.getAccountJettonsBalances(address).then(async res => res?.balances)
  }
}

const getTonBalance = createCacheRequest(createSequentialThrottle(_getTonBalance), 1500) as unknown as typeof _getTonBalance

export const getTonNativeBalance = (address: string) => {
  return getTonBalance(address, 0)
}

export const getTonApiBalances = (address: string) => {
  return getTonBalance(address, 1)
}

export async function getTonTokenList(address: string, _token = 'all') {
  let tokens: JettonBalance[] = []
  let tonBalance = 0
  if (_token !== 'all') {
    if (_token === NATIVE_TOKEN || _token === 'TON') {
      tonBalance = await getTonNativeBalance(address)
    } else {
      tokens = await getTonApiBalances(address)
    }
  } else {
    tonBalance = await getTonNativeBalance(address)
    tokens = await getTonApiBalances(address)
  }

  let tokenIds = tokens.map(i => toBase64Address(i?.jetton?.address) + '-' + 'ton')
  if (_token && _token !== 'all' && _token !== NATIVE_TOKEN && _token !== 'TON') {
    tokenIds = tokenIds?.filter(i => i === (_token + '-' + 'ton'))
  }
  let prices = await getTokensPrice([`${NATIVE_TOKEN}-ton`, ...tokenIds])
  let tokenList = [{master_address: NATIVE_TOKEN, balance: tonBalance, jetton: {decimals: 0, symbol: '', image: '', address: ''}}, ...tokens]?.map((i, k) => {
    let symbolInfo = prices[k]
    let tokenAddress = ('master_address' in i && i?.master_address === NATIVE_TOKEN) ? NATIVE_TOKEN : toBase64Address(i?.jetton?.address)
    let decimals = tokenAddress === NATIVE_TOKEN ? 9 : (i?.jetton?.decimals || symbolInfo?.decimal || 0)
    let balance = formatUnits(i?.balance || 0, decimals)
    return {
      symbol: tokenAddress === NATIVE_TOKEN ? 'TON' : (i?.jetton?.symbol || symbolInfo?.symbol) || '',
      decimals: decimals,
      initBalance: i.balance,
      balance: balance,
      address: tokenAddress,
      token: tokenAddress,
      chain: 'ton',
      id: tokenAddress + '-ton',
      price: symbolInfo?.current_price_usd || 0,
      current_price_usd: symbolInfo?.current_price_usd || 0,
      logo_url: symbolInfo?.logo_url || i?.jetton?.image || '',
      balance_usd: new BigNumber(balance || 0).times(symbolInfo?.current_price_usd || 0).toFixed()
    }
  })
  if (_token && _token !== 'all') {
    tokenList = tokenList?.filter?.(i => i.token === _token) || []
  }
  return tokenList
}

export async function getTonTokenBalance(address: string, token: string, type = 0) {
  let list = await getTonTokenList(address, token)
  let tokenInfo = list.find(i => i.address === token)
  if (type === 1) {
    return tokenInfo || {}
  }
  return tokenInfo?.initBalance || 0
}

export async function getTonWalletBalance({token, wallet}: {token: string; wallet: string}) {
  if (token === NATIVE_TOKEN || token === 'TON') {
    return getTonNativeBalance(wallet)
  } else {
    let tokens = await getTonApiBalances(wallet)
    return tokens?.find?.(i => toBase64Address(i?.jetton?.address) === token || token === i?.jetton?.address)?.balance || '0'
  }
}
