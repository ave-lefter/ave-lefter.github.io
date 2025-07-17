import requestSolana from './requestSolana'
import { NATIVE_TOKEN } from '@/utils/constants.js'
// import { confirmTransaction, configureAndSendCurrentTransaction, addBlxTxTips } from '@/utils/solanaTrustWallet'
import { VersionedTransaction } from '@solana/web3.js'
import { configureAndSendCurrentTransaction, confirmTransaction } from '~/utils/wallet/solana'

export function aveRequestProxy(params: { url: string; method?: string; data?: any; params?: any }, version = 'v2') {
  const { $api } = useNuxtApp()
  return $api(`/v1api/${version}/aveswap/request_proxy`, {
    method: 'post',
    body: {
      path: params.url,
      method : params?.method?.toUpperCase(),
      params : params?.data || params?.params
    }
  }).then(res => {
    if (res.error || res?.status === 429) {
      return Promise.reject(res)
    } else {
      return Promise.resolve(res)
    }
  })
}

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


export function aveswapApiProxy(data: {
  path: string
  method?: string
  params?: any
}) {
  const { $api } = useNuxtApp()
  return  $api('/v1api/v2/aveswap/aveswap_porxy', {
    method: 'post',
    body: data
  }).then(res => {
    if (res?.msg === 'Success') {
      return Promise.resolve(res?.data || res)
    } else {
      return Promise.reject(res?.msg || null)
    }
  })
}

// Sends a GET request to the Jupiter API to get the best priced quote.
export function getSolanaSwapQuote(params: {
  inputMint: string
  outputMint: string
  amount: number
  slippageBps?: number
  swapMode?: string
  dexes?: string
  excludeDexes?: string
  restrictIntermediateTokens?: boolean
  onlyDirectRoutes?: boolean
  asLegacyTransaction?: boolean
  platformFeeBps?: number
  maxAccounts?: number
}) {
  // inputMint
  // outputMint
  // amount
  // 可选
  // slippageBps
  // swapMode:  ExactIn/ExactOut
  // dexes
  // excludeDexes
  // restrictIntermediateTokens
  // onlyDirectRoutes
  // asLegacyTransaction
  // platformFeeBps
  // maxAccounts
  let excludeDexes = 'Lifinity V1,Lifinity V2,Phoenix,Openbook,OpenBook V2'
  if (!sessionStorage.isMoonshot && !sessionStorage.isMeteora) {
    excludeDexes += ',Meteora,Meteora DLMM'
  }
  const params1 = {...params, restrictIntermediateTokens: true, excludeDexes: excludeDexes}
  if (params1.inputMint === NATIVE_TOKEN) {
    params1.inputMint = 'So11111111111111111111111111111111111111112'
  }
  if (params1.outputMint === NATIVE_TOKEN) {
    params1.outputMint = 'So11111111111111111111111111111111111111112'
  }
  return aveRequestProxy({
    method: 'get',
    url: 'https://api.jup.ag/swap/v1/quote',
    params: params1
  }, 'v3')
}


// Returns a transaction that you can use from the quote you get from /quote
export function getSolanaSwapTransaction(data: {
  userPublicKey: string
  quoteResponse: any
  wrapAndUnwrapSol?: boolean
  useSharedAccounts?: boolean
  feeAccount?: string
  computeUnitPriceMicroLamports?: number
  prioritizationFeeLamports?: number
}) {
  // userPublicKey
  // quoteResponse
  // wrapAndUnwrapSol
  // useSharedAccounts
  // feeAccount
  // computeUnitPriceMicroLamports
  // prioritizationFeeLamports
  const tokens = [data?.quoteResponse?.inputMint, data?.quoteResponse?.outputMint]
  // let excludeToken = '21rweMLGYeMNonHW7H3xa5py17X6ZFRcHirCp9inRBQA'
  const excludeTokens = ['AzyRjMgCXuwD7vpjwgv4h4HoX1HtTvN2wL4A4kLRjtpF', '21rweMLGYeMNonHW7H3xa5py17X6ZFRcHirCp9inRBQA']
  const isToken = tokens.some(i => excludeTokens.includes(i))
  if (isToken || (tokens[0] === 'BLU6Aiq3hcRkwvXeq7V61XwDzqm2zYxYAYLVghWVYp6Q' && data?.quoteResponse?.swapMode === 'ExactOut')) {
    data.useSharedAccounts = false
  }
  return aveRequestProxy({
    method: 'post',
    url: 'https://api.jup.ag/swap/v1/swap',
    data: data
  }, 'v3')
}


export function getSolanaRaydiumSwapTransaction(data: any) {
  const { $api } = useNuxtApp()
  return  $api('/v1api/v3/aveswap/construct-transaction-by-swap', {
    method: 'post',
    body: data
  })
}


export function createSolanaLimitOrder(data: {
  owner: string
  inAmount: number
  outAmount: number
  inputMint: string
  outputMint: string
  expiredAt: number
  base: string
  referralAccount?: string
  referralName?: string
}) {
  // owner: wallet.publicKey.toString(),
  // inAmount: 100000, // 1000000 => 1 USDC if inputToken.address is USDC mint
  // outAmount: 100000,
  // inputMint: inputMint.toString(),
  // outputMint: outputMint.toString(),
  // expiredAt: null, // new Date().valueOf() / 1000,
  // base: base.publicKey.toString(),
  // // referralAccount and name are both optional
  // // provide both to get referral fees
  // // more details in the section below
  // referralAccount: referral.publicKey.toString(),
  // referralName: "Referral Name"
  return aveRequestProxy({
    method: 'POST',
    url: 'https://api.jup.ag/trigger/v1/createOrder',
    data: data
  })
}


export const getSolanaLimitOrder = createCacheRequest(function(params: { wallet: string }): Promise<Order[]> {
  // wallet	string	No
  // inputMint	string	No
  // outputMint	string	No
  return aveRequestProxy({
    method: 'get',
    url: 'https://api.jup.ag/trigger/v1/getTriggerOrders',
    params: {
      orderStatus: 'active',
      ...params
    }
  }).then(async res => (res?.orders || []).reverse()).catch(async () => [])
}, 2000)

export const getSolanaLimitOrderHistoryV1 = createCacheRequest(function(params: { wallet: string }) {
  // wallet	string	Yes
  // cursor	number	No
  // skip	number	No
  // take	number	No
  return requestSolana('https://jup.ag/api/limit/v1/orderHistory', {
    method: 'get',
    query: params
  }).catch(async () => {
    return []
  })
}, 2000)

export function getSolanaLimitOrderHistoryV2(params: any) {
  return aveRequestProxy({
    method: 'get',
    url: 'https://api.jup.ag/trigger/v1/getTriggerOrders',
    params: {
      ...params,
      orderStatus: 'history'
    }
  }).catch(async () => {
    return {
      orders: [],
      hasMoreData: false
    }
  })
}

interface Order {
  orderKey: string
  [key: string]: any
}

interface Params {
  wallet: string
  page?: number
  [key: string]: any
}

interface HistoryResponse {
  orders: Order[]
  hasMoreData: boolean
}

export const getSolanaLimitOrderHistory = createCacheRequest(async function (params: Params): Promise<Order[]> {
  const limitPage = 3
  let page = 1
  const seen = new Set<string>()
  const result: Order[] = []

  while (page <= limitPage) {
    const res: HistoryResponse = await getSolanaLimitOrderHistoryV2({ ...params, page })
    const uniqueOrders = (res?.orders || []).filter(order => {
      if (seen.has(order.orderKey)) return false
      seen.add(order.orderKey)
      return true
    })
    result.push(...uniqueOrders)

    if (!res?.hasMoreData) break
    page++
  }

  return result
}, 2000)

// https://jup.ag/api/limit/v1/tradeHistory
export const getSolanaLimitOrderTradeHistory = createCacheRequest(function (params: { wallet: string; inputMint: string; outputMint: string }) {
  // wallet	string	No
  // inputMint	string	No
  // outputMint	string	No
  // cursor	number	No
  // skip	number	No
  // take	number	No
  const { $api } = useNuxtApp()
  return $api('https://jup.ag/api/limit/v1/tradeHistory', {
    method: 'get',
    query: params
  })
}, 2000)

// https://jup.ag/api/limit/v1/cancelOrders
export function cancelSolanaLimitOrder(data: { owner: string; feePayer: string; orders: string[] }) {
  return aveRequestProxy({
    method: 'post',
    url: 'https://api.jup.ag/trigger/v1/cancelOrders',
    data: data
  })
}

export function cancelSolanaLimitOrderV1(data: { owner: string; feePayer: string; orders: string[] }) {
  const { $api } = useNuxtApp()
  return $api('https://jup.ag/api/limit/v1/cancelOrders', {
    method: 'post',
    body: data
  })
}

export function getSolanaPumpInfo(mint: string) {
  return requestProxy({
    method: 'post',
    url: ':10072/pump-info',
    // url: `/v1api/v3/aveswap/pump-info`,
    data: {mint}
  })
}

export function getSolanaPumpSwapTx(data: {
  mint: string
  amount: string
  denominatedInSol: boolean
  walletPublicKey: string
  action: string
  feeConfig: {
    feeAccount: string
    feeBps: string
  }
}) {
  return requestProxy({
    method: 'post',
    url: ':10072/swap',
    // url: `/v1api/v3/aveswap/pump-info`,
    data: {
      // "mint": "51jcZoN19meh33P6vVNrJJrD418DVgJG9sH9ahuqSnL8",
      // "amount": "1000000000",
      // "denominatedInSol": true,
      // "walletPublicKey": "4cziMTo7kHw1w4z33EFYJXpdaWQLn1PiSoYtcaC9ANUF",
      'tipLamports': '0',
      'priorityFeeLimitInLamports': '1000000',
      // "action": "BUY",
      // "feeConfig": {
      //   "feeAccount": "2416yFoX5ep69Ae8u4EoWN2b1jRMC8diygQDf4zqNAQG",
      //   "feeBps": "23"
      // },
      ...data
    }
  })
}

export function sendBlxSolTx(data: any) {
  // return request({
  //   method: 'post',
  //   url: `http://18.166.11.27:8090/v1/blxrsol/sendSolTx`,
  //   data: data
  // })
  // return request({
  //   method: 'post',
  //   url: `/v1api/v2/aveswap/aveswap_porxy`,
  //   data: {
  //     path: `v1/blxrsol/sendSolTx`,
  //     method : 'POST',
  //     params : data
  //   }
  // }).then(async res => res?.data || res)
  return aveswapApiProxy({
    path: 'v1/blxrsol/sendSolTx',
    method : 'POST',
    params : data
  })
}


export async function getSolanaMoonshotSwap(data: any) {
  // return request({
  //   method: 'post',
  //   url: `/v1api/v2/aveswap/aveswap_porxy`,
  //   data: {
  //     path: `v1/moonshot/swap`,
  //     method : 'POST',
  //     params : data
  //   }
  // }).then(async res => res?.data || res)
  return aveswapApiProxy({
    path: 'v1/moonshot/swap',
    method : 'POST',
    params : data
  })
}


export async function getSolanaMoonshotSwapQuote(params: { inputMint: any; outputMint: any; amount: any; slippageBps: any }) {
  console.log('getSolanaMoonshotSwapQuote', params)
  const walletStore = useWalletStore()
  const { inputMint, outputMint, amount, slippageBps } = params
  const isBuy = inputMint === 'So11111111111111111111111111111111111111112'
  const mint = isBuy ? outputMint : inputMint
  const swapTransaction = await getSolanaMoonshotSwap({
    isBuy,
    creatorAddress: walletStore.address,
    tokenAddress: mint,
    amount: amount,
    slippage: Number(slippageBps)
  })
  console.log('swapTransaction', swapTransaction)
  const swapTransactionBuf = Buffer.from(swapTransaction.tx, 'base64')
  const transaction1 = VersionedTransaction.deserialize(swapTransactionBuf)
  // if (localStorage.solanaProtection === 'true') {
  //   await addBlxTxTips(transaction1)
  // }
  return {
    transaction: swapTransaction?.tx || '',
    outAmount: swapTransaction?.amountOut,
    configureAndSendCurrentTransaction: async () => (configureAndSendCurrentTransaction(
      transaction1,
      'swap'
    ).then(async hash => ({
      hash: hash,
      wait: () => confirmTransaction(hash)
    })))
  }
}
