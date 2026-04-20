import Cookies from 'js-cookie'
import BigNumber from 'bignumber.js'
import type { BotChain } from '~/utils/types'
import { createCacheRequest } from '#imports'
import { getTonWalletBalance } from '~/utils/wallet/ton'
import { getNativeToken, NATIVE_TOKEN } from '~/utils/constants'
import { getBalance, getBalanceList, getTokenDetails } from './swap'
import { evm_utils as utils } from '@/utils'

export function login(data: {
  username?: string
  firstName?: string
  tgUid: string
  loginAt?: number
  signature: string
  evmAddress?: string
}): Promise<{
  tgUsername: string
  tgFirstName: string
  evmAddress: string
  walletName: string
  accessToken: string
  refreshToken: string
  emailAddress: string
}> {
  const newData = {
    tgUsername: data?.username || '',
    tgFirstName: data?.firstName || '',
    tgUid: data?.tgUid || '',
    loginAt: Number(data?.loginAt || 0),
    signature: data?.signature || '',
    evmAddress: data?.evmAddress || ''
  }
  const { $api } = useNuxtApp()
  return $api('/botapi/user/login', {
    method: 'POST',
    body: newData,
  })
}
//  "emailType":"register",
//   "email":"xxx@xxx.com",
//   "refCode":"123321", -> 邀请码
//   "language":"cn",
//   "source": "ios" -> 客户端
export function sendEmailCode(data: {
  email: string
  language?: string
  emailType?: string
  refCode?: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/sendEmailCode', {
    method: 'POST',
    body: {
      email: data.email,
      language: data.language || 'cn',
      emailType: data.emailType || 'register',
      refCode: data.refCode
    },
    // query: {

    // }
  })
}

export function registerEmail(data: {
  email: string
  password: string
  code: string
  language?: string
  refCode?: string
}): Promise<{
  accessToken: string
  refreshToken: string
  evmAddress: string
}> {
  const { $api } = useNuxtApp()
  const locale = useLocaleStore().locale
  return $api('/botapi/user/registerEmailAccount', {
    method: 'POST',
    body: {
      source: 'web',
      language: locale?.includes?.('zh-') ? 'cn' : 'en',
      ...data
    }
  })
}


export function loginEmail(data: {
  email: string
  password: string
}): Promise<{
  accessToken: string
  refreshToken: string
  emailAddress: string
  evmAddress: string
  tgUid: string
  mnemonic?: string
}> {
  const { $api } = useNuxtApp()
  const locale = useLocaleStore().locale
  return $api('/botapi/user/emailLogin', {
    method: 'post',
    body: {
      source: 'web',
      language: locale?.includes?.('zh-') ? 'cn' : 'en',
      needMnemonic: true,
      ...data
    }
  })
}

// 人机校验
export function loginEmailV2(data: {
  email: string
  password: string
  captchaScene: string
  captchaParam: string
}): Promise<{
  accessToken: string
  refreshToken: string
  emailAddress: string
  evmAddress: string
  tgUid: string
  mnemonic?: string
}> {
  const { $api } = useNuxtApp()
  const locale = useLocaleStore().locale
  const body = {
    source: 'web',
    language: locale?.includes?.('zh-') ? 'cn' : 'en',
    needMnemonic: true,
    ...data
  }
  Reflect.deleteProperty(body, 'captchaScene')
  Reflect.deleteProperty(body, 'captchaParam')
  return $api('/botapi/user/emailLoginV2', {
    method: 'post',
    headers: {
      'X-Captcha-Scene': data.captchaScene,
      'X-Captcha-Param': data.captchaParam
    },
    body: body
  })
}

// 邮箱验证码登录
export function emailCodeLogin(data: {
  email: string
  code: string
  refCode?: string
}): Promise<{
  accessToken: string
  evmAddress: string
  refreshToken: string
  tgUid: string
  ref1Guid: string
  walletName: string,
  mnemonic?: string
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/emailCodeLogin', {
    method: 'post',
    body: {
      source: 'web',
      needMnemonic: true,
      ...data
    }
  })
}

// 校验找回密码的验证码
export function verifyRecoverCode(data: {
  email: string
  code: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/verifyRecoverCode', {
    method: 'post',
    body: data
  })
}

// 修改邮箱密码
export function updateEmailPassword(data: {
  email: string
  newPassword: string
  code: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/updateEmailPassword', {
    method: 'post',
    body: {
      source: 'web',
      ...data
    }
  })
}

// 谷歌登录
export function googleLogin(data: {
  idToken: string
  refCode?: string
}): Promise<{
  accessToken: string
  refreshToken: string
  emailAddress: string
  evmAddress: string,
  tgUid: string
  mnemonic?: string
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/googleLogin', {
    method: 'post',
    body: {
      source: 'web',
      needMnemonic: true,
      ...data
    }
  })
}

// 更改当前的谷歌账户密码
export function resetPasswordGoogle(password: string): Promise<{
  accessToken: string
  refreshToken: string
  evmAddress: string
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/setGoogleAccountPassword', {
    method: 'POST',
    body: {
      password
    }
  })
}

// 设置 authenticator
export function setGoogleAuth(guid: string): Promise<{
  secret: string
  url: string
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/setAuth', {
    method: 'get',
    query: {
      guid
    }
  })
}

// 确认 authenticator
export function confirmAuthSetting(data: {
  tgUid: string
  authCode: string
}): Promise<boolean> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/confirmAuthSetting', {
    method: 'post',
    body: data
  })
}

// 查询是否已绑定authenticator(登录态之后，getUserInfoByGuid 用这个接口可以立即获取邮箱绑定)
export function bot_getUserInfoByGuid(guid: string): Promise<{
  guid: string
  emailAddress: string // 已绑定的email address
  authSetting: boolean //  已绑定google验证器, false -> 未绑定google验证器
  ref1Guid: string // 上游分佣绑定信息
  name: string // 钱包名
  transferStatus: boolean // 转账状态(是否在12小时冻结期)
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/getUserInfoByGuid', {
    method: 'get',
    query: {
      guid
    }
  })
}

// 绑定邮箱账号
export function bindEmailAccount(data: {
  email: string
  code: string
  password: string
  refCode?: string
}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/bindEmailAccount', {
    method: 'post',
    body: data
  })
}

// 刷新 token
export function refreshAccessToken(type: 'acc'| 'ref' ='acc'): Promise<{
  accessToken: string
  refreshToken?: string
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/refreshNewToken', {
    method: 'get',
    query: {
      type
    }
  })
}

// 获取用户钱包信息
export function getBotWallets(chain: string) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/getWallets', {
    method: 'get',
    query: {
      chain
    }
  })
}

// getWalletsAllChain
export function bot_getWalletsAllChain(params: {
  chain?: string
}={}): Promise<Array<{
  tgUid: string
  evmAddress: string
  name: string
  addresses: Array<{
    chain: string
    address: string
    price?: number
    balance?: string
    decimals?: number
    logo_url?: string
    tokenBalances?: {
      [key: string]: {
        chain: string
        address: string
        price?: number
        balance?: string
        decimals?: number
        logo_url?: string
      }
    }
  }>
}>> {
  const { $api } = useNuxtApp()

  return $api('/botapi/user/getWalletsAllChain', {
    params,
    method: 'get'
  })
}


type Setting = {
  mev: boolean
  gas: Array<{
    level: 1 | 2 | 3
    customFee: boolean
    mev: boolean
  }>
  slippage: string
  autoSell: boolean
  buyValueList: [string, string, string, string, string, string, string, string]
  sellPerList: [string, string, string, string, string, string, string, string]
}

type Chains = 'bsc' | 'base' | 'solana' | 'eth'

export function bot_getWebConfig(chain = ''): Promise<{
  [key in Chains]?: {
    selected: string
    s1: Setting
    s2: Setting
    s3: Setting
  }
}> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/getWebConfig', {
    method: 'get',
    query: {
      chain
    }
  }).then(async res => {
    if (res && typeof res === 'object') {
      const res1: {
        [key in Chains]?: {
          selected: string
          s1: Setting
          s2: Setting
          s3: Setting
        }
      } = {}
      Object.keys(res).forEach((i) => {
        const v = res?.[i]
        if (v && isJSON(v)) {
          res1[i as Chains] = JSON.parse(v)
        }
      })
      return res1
    }
    return {}
  })
}


export function bot_updateWebConfig(data: { chain?: string, webConfig?: string } = {}) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/updateWebConfig', {
    method: 'post',
    body: data
  })
}

// export function bot_getTokenBalance(data) {
//   return request({
//     method: 'post',
//     url: `/swap/getTokenBalance`,
//     data: {
//       chain: store.getters.chain,
//       walletAddress: store.getters.botWallet,
//       // tokens: []
//       ...data
//     }
//   })
// }

export const bot_getTokenBalance = createCacheRequest(async function(data: {
  chain: string
  walletAddress: string
  tokens: string[]
}) {
  if (data.chain === 'polygon') {
    await sleep(500)
    return Promise.all(data.tokens.map(async (i: string) => {
      return {
        token: i,
        chain: data.chain,
        ...(await getTokenDetails({
          tokenAddress: i,
          chain: data.chain,
          walletAddress: data.walletAddress
        }))
      }
    }))
  }
  // Use getBalances instead of the old API
  // Convert token addresses to proper native token addresses for getBalances
  const convertedTokens = data.tokens.map(token => {
    if (token === getNativeToken(data.chain)) {
      // For Solana, getBalances expects NATIVE_TOKEN instead of 'sol'
      // For other chains, getNativeToken already returns the correct address
      return data.chain === 'solana' ? NATIVE_TOKEN : token
    }
    return token
  })

  const result = await getBalances({
    chain: data.chain,
    creatorAddress: data.walletAddress,
    tokens: convertedTokens,
    showZero: true
  })

  // Handle case where tokens is null (when balance is 0)
  const tokensWithBalance = result.tokens || []

  // Create a map of tokens with balance for quick lookup
  const tokenMap = new Map()
  tokensWithBalance.forEach(token => {
    // Map back to original token address for consistency
    let originalToken = token.token
    if (token.token === NATIVE_TOKEN && data.chain === 'solana') {
      originalToken = getNativeToken(data.chain) // This returns 'sol' for Solana
    }
    tokenMap.set(originalToken, token)
  })

  // Return all requested tokens, including those with 0 balance
  return Promise.all(data.tokens.map(async (tokenAddress: string) => {
    const tokenWithBalance = tokenMap.get(tokenAddress)

    if (tokenWithBalance) {
      // Token has balance, use the data from getBalances
      let balance = tokenWithBalance.balance
      if (data.chain === 'ton') {
        balance = await getTonWalletBalance({token: tokenAddress, wallet: data.walletAddress}).catch(async () => 0)
      }
      const decimals = tokenWithBalance.decimals || 0
      const pnl = tokenWithBalance.pnl || {} as any
      return {
        ...tokenWithBalance,
        token: tokenAddress, // Ensure we return the original token address
        initBalance: balance,
        balance: Number(decimals) === 0 ? balance : balance,
        chain: data.chain || '',
        unrealized_profit: pnl.unrealizedProfit ?? pnl.unrealized_profit ?? '0',
        realized_profit: pnl.realizedProfit ?? pnl.realized_profit ?? '0',
        average_net_purchase_price: pnl.averageNetPurchasePrice ?? pnl.average_net_purchase_price ?? '0',
        net_purchase_amount: pnl.netPurchaseAmount ?? pnl.net_purchase_amount ?? '0'
      }
    } else {
      // Token has no balance, get token details and create default response
      let balance: number | string = 0
      if (data.chain === 'ton') {
        balance = await getTonWalletBalance({token: tokenAddress, wallet: data.walletAddress}).catch(async () => 0)
      }

      // Get token details for decimals and symbol
      const tokenDetails = await getTokenDetails({
        tokenAddress: tokenAddress,
        chain: data.chain,
        walletAddress: data.walletAddress
      }).catch(async () => ({ decimals: 0, symbol: '', logoUrl: '' }))

      return {
        token: tokenAddress,
        balance: balance.toString(),
        initBalance: balance,
        decimals: tokenDetails?.decimals || 0,
        chain: data.chain || '',
        symbol: tokenDetails?.symbol || '',
        logoUrl: (tokenDetails as any)?.logoUrl || '',
        price: '0',
      }
    }
  }))
}, 500)

// 推荐GasTip(二期)
// 返回高、中、低三档，eth用wei， solana返回lamports, solana忽略mev
export function bot_getGasTip(): Promise<Array<{ chain: string, mev: boolean, high: string, average: string, low: string, gasLimit: number }>> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/gastip', {
    method: 'get'
  })
}


// 5.3.17. 查询预授权状态
export const bot_getApprove = createCacheRequest(function(params: {
  token: string
  chain: string
  owner: string
}) {
  const { $api } = useNuxtApp()
  return  $api('/botapi/swap/getApprove', {
    method: 'get',
    query: params
  })
}, 500)

// 查询预授权状态 V2
export const bot_getApproveV2 = createCacheRequest(function(params: {
  inToken: string
  outToken: string
  chain: string
  owner: string
}) {
  const { $api } = useNuxtApp()
  return  $api('/botapi/swap/getApproveV2', {
    method: 'get',
    query: params
  })
}, 500)

export const bot_getChainsTokenBalance = createCacheRequest(async function(params: Array<{
  chain: string
  tokens: string[]
  walletAddress: string
}>) {
  const { $api } = useNuxtApp()
  const exChains = ['ton']
  const paramsChains = params?.filter((i) => !exChains.includes(i.chain)) || []

  // Check if all chains are the same and not in exChains
  const uniqueChains = [...new Set(paramsChains.map(i => i.chain))]
  const useGetBalances = paramsChains.length > 0 && uniqueChains.length === 1

  if (useGetBalances) {
    // All params are for the same chain, use getBalances
    const param = paramsChains[0]

    // Convert token addresses for getBalances
    const convertedTokens = param.tokens.map(token => {
      if (token === getNativeToken(param.chain)) {
        // For Solana, getBalances expects NATIVE_TOKEN instead of 'sol'
        // For other chains, getNativeToken already returns the correct address
        return param.chain === 'solana' ? NATIVE_TOKEN : token
      }
      return token
    })

    const result = await getBalances({
      chain: param.chain,
      creatorAddress: param.walletAddress,
      tokens: convertedTokens,
      showZero: true
    })

    // Handle case where tokens is null (when balance is 0)
    const tokensWithBalance = result.tokens || []

    // Create a map of tokens with balance for quick lookup
    const tokenMap = new Map()
    tokensWithBalance.forEach(token => {
      // Map back to original token address for consistency
      let originalToken = token.token
      if (token.token === NATIVE_TOKEN && param.chain === 'solana') {
        originalToken = getNativeToken(param.chain) // This returns 'sol' for Solana
      }
      tokenMap.set(originalToken, token)
    })

    // Convert back to original format, including tokens with 0 balance
    const res: any[] = []
    for (const tokenAddress of param.tokens) {
      const tokenWithBalance = tokenMap.get(tokenAddress)

      if (tokenWithBalance) {
        // Token has balance, use the data from getBalances but keep original format
        let balance = tokenWithBalance.balance
        if (param.chain === 'ton') {
          balance = await getTonWalletBalance({token: tokenAddress, wallet: param.walletAddress}).catch(async () => 0)
        }

        res.push({
          chain: param.chain,
          token: tokenAddress,
          walletAddress: param.walletAddress,
          balance: balance,
          decimals: tokenWithBalance.decimals,
          symbol: tokenWithBalance.symbol,
          logoUrl: tokenWithBalance.logoUrl,
          price: tokenWithBalance.price
        })
      } else {
        // Token has no balance, get token details and create default response
        let balance: number | string = 0
        if (param.chain === 'ton') {
          balance = await getTonWalletBalance({token: tokenAddress, wallet: param.walletAddress}).catch(async () => 0)
        }

        // Get token details for decimals and symbol
        const tokenDetails = await getTokenDetails({
          tokenAddress: tokenAddress,
          chain: param.chain,
          walletAddress: param.walletAddress
        }).catch(async () => ({ decimals: 0, symbol: '', logoUrl: '' }))

        return {
          token: tokenAddress,
          balance: balance.toString(),
          initBalance: balance,
          decimals: tokenDetails.decimals || 0,
          chain: param.chain || '',
          symbol: tokenDetails.symbol || '',
          logoUrl: (tokenDetails as any).logoUrl || '',
          price: '0',
        }
      }
    }

    const paramsExChains = params?.filter((i) => exChains.includes(i.chain)) || []
    if (paramsExChains?.length > 0) {
      paramsExChains.forEach((i) => {
        const k = params.findIndex((j) => j.chain === i.chain)
        res.splice(k, 0, {
          chain: i.chain,
          token: i.tokens[0],
          walletAddress: i.walletAddress,
          balance: 0,
          decimals: 0,
          symbol: '',
          logoUrl: '',
          price: '0'
        })
      })
    }

    return Promise.all((res || []).map(async (i: { chain: string; token: any; walletAddress: any; balance: any }) => {
      if (i.chain === 'ton') {
        return {
          ...i,
          decimals: 9,
          balance: await getTonWalletBalance({token: i.token, wallet: i.walletAddress}).catch(async () => 0) || i?.balance || 0
        }
      } else {
        return {...i}
      }
    }))
  } else {
    const exChains = ['ton', 'polygon']
    const paramsChains = params?.filter((i) => !exChains.includes(i.chain)) || []
    // Different chains or chains in exChains, use the old API
    const res1 = paramsChains?.length > 0 ? await $api('/botapi/swap/getChainsTokenBalance', {
      method: 'post',
      body: paramsChains
    }) : []
    const res = (res1 || []) as any[]
    const paramsExChains = params?.filter((i) => exChains.includes(i.chain)) || []
    if (paramsExChains?.length > 0) {
      paramsExChains.forEach((i) => {
        const k = params.findIndex((j) => j.chain === i.chain)
        res.splice(k, 0, {
          chain: i.chain,
          token: i.tokens[0],
          walletAddress: i.walletAddress,
          balance: 0,
          decimals: 0,
          symbol: '',
          logoUrl: '',
          price: '0'
        })
      })
    }

    return Promise.all((res || []).map(async (i: { chain: string; token: any; walletAddress: any; balance: any; decimals?: any; decimal?: any }) => {
      if (i.chain === 'ton') {
        return {
          ...i,
          // ...(await getTokenDetails({tokenAddress: i.token, chain: i.chain, walletAddress: i.walletAddress}).then(async res => ({...res, balance: res?.initBalance || 0})).catch(async () => ({balance: 0}))),
          decimals: 9,
          balance: await getTonWalletBalance({token: i.token, wallet: i.walletAddress}).catch(async () => 0) || i?.balance || 0
        }
      } else if (i.chain === 'polygon') {
        return {
          ...i,
          ...(await getTokenDetails({tokenAddress: i.token, chain: i.chain, walletAddress: i.walletAddress}).then(async res => ({...res, initBalance: res?.initBalance || 0,
            balance: res?.balance || 0
          })).catch(async () => ({balance: 0})))
        }
      } else {
        return {
          ...i,
          balance: utils.formatUnits(i.balance.toString(), i.decimals || i.decimal || 0).toString()
        }
      }
    }))
  }
}, 1000)

// 查询sol bundle是否可用
// /swap/getBundleAvailable GET
export async function bot_getBundleAvailable() {
  // const { $api } = useNuxtApp()
  // return  $api('/botapi/swap/getBundleAvailable', {
  //   method: 'get',
  //   query: {}
  // })
  return true
}
// 预授权代币
export function bot_approve(data: {
  tokenAddress: string
  batchId: string
  chain: string
  creatorAddress: string[]
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  return $api('/botapi/swap/preApprove', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      // chain: store.getters.botChain,
      // creatorAddress: [store.getters.botWallet],
      tgUid: botStore.userInfo?.tgUid,
      noCb: false,
      source: 'web',
      ...data
    }
  })
}

// 预授权代币
export function bot_approveV2(data: {
  inTokenAddress: string
  outTokenAddress: string
  batchId: string
  chain: string
  creatorAddress: string[]
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  return $api('/botapi/swap/preApproveV2', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      // chain: store.getters.botChain,
      // creatorAddress: [store.getters.botWallet],
      tgUid: botStore.userInfo?.tgUid,
      noCb: false,
      source: 'web',
      ...data
    }
  })
}

export interface IBotTxRequest {
  batchId?: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  inTokenAddress: string
  outTokenAddress: string
  swapType: 1 | 2
  isPrivate: boolean
  priorityFee: string
  autoSell?: boolean
  slippage: number
}
// 创建 Solana 市价交易
export function bot_createSolTx(params: {
  batchId?: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  inTokenAddress: string
  outTokenAddress: string
  swapType: 1 | 2
  isPrivate: boolean
  priorityFee: string
  autoSell?: boolean
  slippage: number
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  return $api('/botapi/swap/createSolTx', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      source: 'web',
      autoSell: false,
      channelRef: Cookies.get('refCode') || undefined,
      tgUid: botStore.userInfo?.tgUid,
      ...params,
    }
  })
}

// 创建 Ton 市价交易
export function bot_createSwapTonTx(params: {
  batchId?: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  inTokenAddress: string
  outTokenAddress: string
  swapType: 1 | 2
  slippage: number
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  return $api('/botapi/swap/createSwapTonTx', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      source: 'web',
      autoSell: false,
      channelRef: Cookies.get('refCode') || undefined,
      tgUid: botStore.userInfo?.tgUid,
      ...params,
    }
  })
}


// 创建Evm交易
export function bot_createSwapEvmTx(params: {
  batchId?: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  inTokenAddress: string
  outTokenAddress: string
  swapType: 1 | 2 | 3 | 4
  contractType: 0 | 1
  isPrivate: boolean
  gasTip: number
  autoSell?: boolean
  chain: string
  autoSellConfig?: {
    open: boolean;
    priceChange?: number | undefined;
    sellRatio?: number | undefined;
    type: 'default' | 'devsell' | 'trailing' | 'migrated'
  }[]
  slippage: number
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  // if (params.chain === 'xlayer') {
  //   params.autoSell = false
  //   params.autoSellConfig = []
  // }
  const { getCanMev } = useBotSwapStore()
  const isCanMev = getCanMev(params.chain)
  if (!isCanMev) {
    params.isPrivate = false
  }

  //  市价Wrap	3
  // 市价Unwrap	4
  const wrapAddress = getChainInfo(params.chain)?.wmain_wrapper || ''
  if (params.inTokenAddress === wrapAddress && params.outTokenAddress === NATIVE_TOKEN) {
    params.swapType = 4
  } else if (params.inTokenAddress === NATIVE_TOKEN && params.outTokenAddress === wrapAddress) {
    params.swapType = 3
  }
  return $api('/botapi/swap/createSwapEvmTxV2', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      source: 'web',
      autoSell: false,
      preApprove: true,
      tgUid: botStore.userInfo?.tgUid,
      channelRef: Cookies.get('refCode') || undefined,
      ...params,
    }
  })
}

//  创建Solana限价交易
export function bot_createSolLimitTx(params: {
  batchId?: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  tokenAddress: string
  baseTokenAddress: string
  swapType: 5 | 6
  isPrivate: boolean
  priceLimit: string
  autoGas: 0 | 1 | 2 | 3
  priorityFee: string
  autoSell?: boolean
  slippage: number
  autoSlippage?: boolean
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  return $api('/botapi/swap/createSolLimitTx', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      source: 'web',
      tgUid: botStore.userInfo?.tgUid,
      ...params,
    }
  })
}

//  创建 TON 限价交易
export function bot_createTonLimitSwap(params: {
  batchId?: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  tokenAddress: string
  baseTokenAddress: string
  swapType: 5 | 6
  isPrivate: boolean
  priceLimit: string
  slippage: number
  autoSlippage?: boolean
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  return $api('/botapi/swap/createTonLimitSwap', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      source: 'web',
      tgUid: botStore.userInfo?.tgUid,
      ...params,
    }
  })
}

// 创建Evm限价交易(二期)
export function bot_createEvmLimitTx(params: {
  batchId?: string
  chain: string
  swapList: Array<{
    creatorAddress: string
    inAmount: string
  }>
  inTokenAddress: string
  outTokenAddress: string
  swapType: 5 | 6
  swapPrice: string
  contractType: 0 | 1
  isPrivate: boolean
  gasTip: number
  autoSell?: boolean
  slippage: number
  autoSlippage?: boolean
}) {
  const { $api } = useNuxtApp()
  const botStore = useBotStore()
  const { getCanMev } = useBotSwapStore()
  const isCanMev = getCanMev(params.chain)
  if (!isCanMev) {
    params.isPrivate = false
  }
  return $api('/botapi/swap/createEvmLimitTx', {
    method: 'post',
    body: {
      // batchId: Date.now().toString(),
      tgUid: botStore.userInfo?.tgUid,
      source: 'web',
      preApprove: true,
     ...params,
    }
  })
}
// 创建安全转账交易
// swap/transfer
// {
//     "batchId":"111546",
//     "chain":"solana",
//     "creatorAddress":"FSFB1mQqXc3cC57DHaKijHzcqMsnYHsueCWnLt97ePbD",
//     "tokenAddress":"7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
//     "tgUid":"6097411603",
//     "amount":"1000000000",
//     "transferTo":"3SBB1mQqXc3cC57DHaKijHzcqMsnYHsueCWnLt97ePbD",
//     "gasTip":0,
//     "memo":"1234342342",
//     "source":"web",  //枚举 web，app。不传的话默认 app
//     "emailCode":"123321", //如果不使用邮箱验证， ""即可
//     "authCode":"123321", //如果不使用Authenticator验证， ""即可
//     "autoGas": 2; // 0: 关闭, 1: 低速， 2：中速， 3：高速
// }
export function bot_createSafeTransferTx(params: {
  chain: BotChain
  creatorAddress: string
  tokenAddress: string
  tgUid: string
  amount: string
  transferTo: string
  gasTip: number
  memo: string
  source: 'web'|'app'
  emailCode?: string
  authCode?: string
  autoGas?: 0 | 1 | 2 | 3
}) {
  const { $api } = useNuxtApp()
  const { gasTip = 0, source = 'web', ...rest } = params
  return $api('/botapi/swap/transferBySafeCheck', {
    method: 'post',
    body: {
      batchId: Date.now().toString(),
      gasTip,
      source,
      ...rest,
    }
  })
}
// 转账主币GasFee
// url: /swap/getTransferGasFee GET
// 校验：双token
// 请求参数: chain -> 当前支持 eth, base, bsc
export function bot_getTransferGasFee(params: { chain: BotChain} | undefined) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getTransferGasFee', {
    method: 'get',
    query: params
  })
}

// 功能说明：查询转账交易状态
// url: /swap/getTransfer GET
// 行为：根据链，batchId，查询交易结果
// 校验：校验 access token
export function bot_getTransfer(params: { chain: BotChain,batchId: string|number} | undefined) {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getTransfer', {
    method: 'get',
    query: params
  })
}

export interface IGetMarketCompletedLimitResponse {
  id: number;
  status: string;
  createTime: Date;
  updateTime: Date;
  tgUid: string;
  batchId: string;
  chain: string;
  swapType: number;
  creatorAddress: string;
  inTokenAddress: string;
  inTokenDecimals: number;
  inTokenSymbol: string;
  inTokenName: string;
  outTokenAddress: string;
  outTokenDecimals: number;
  outTokenSymbol: string;
  outTokenName: string;
  txValue: string;
  txType: number;
  txGasTipCap: string;
  txGasLimit: number;
  txToAddress: string;
  txNonce: number;
  txExtraGas: number;
  slippage: number;
  txHash: string;
  inAmount: string;
  inPrice: string;
  outputAmount: string;
  outPrice: string;
  outPriceLimit: string;
  createPrice: string;
  triggerPrice: string;
  blockNumber: number;
  blockTime: number;
  usePrivate: boolean;
  inTokenLogoUrl: string;
  outTokenLogoUrl: string;
  inValue: string;
  outValue: string;
  tradeValueExpected: string;
  followAddress: string;
  followHash: string;
  followType: number;
  followId: number;
  errorLog: string;
  amm: string;
}

// 查询该代币的全部限价单委托(二期)
// /swap/getTokenPendingTx GET
// curl --location 'http://18.166.11.27:8081/v2/swap/getTokenPendingTx?chain=solana&token=7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr
export function getCompletedLimitTx(evmAddress: string): Promise<IGetMarketCompletedLimitResponse[]> {
  const {$api} = useNuxtApp()
  return $api('/botapi/swap/getCompletedLimitTx', {
    method: 'get',
    query: {
      evmAddress
    }
  })
}

//  /swap/getAddressAllBalances
export const bot_getAddressAllBalances = createCacheRequest(function bot_getAddressAllBalances(query: {
  evmAddress: string
  chains?: string
  pinToken?: string
  ignoreHighRisk?: boolean
}): Promise<Array<{
  avgPrice: string
  chain: string
  token: string
  value_decimal: string
  value: number
  symbol: string
  logo_url: string
  current_price_usd: string
  profit: string
  profitRate: number
}>> {
  if (!query?.evmAddress) {
    return Promise.resolve([])
  }
  const {$api} = useNuxtApp()
  return $api('/botapi/swap/getAddressAllBalancesV2', {
    method: 'get',
    query
  })
}, 1000)

// 3.10 计算pnl
// 功能说明：计算盈利
export function getTokenPnl(body: {
  chain: string
  token: string
  walletAddress: string
  balance: string
  days: number
}): Promise<{
  balance: string
  chain: string
  profit: string
  profitRealized: string
  profitUnrealized: string
  token: string
  walletAddress: string
  avgBuyPrice: string
  avgSellPrice: string
  balanceRatio: string
  realizeRatio: string
  unrealizedRatio: string
  totalSellUsd: string
  totalBuyUsd: string
  profitRatio: string
  totalBuyAmount: string
  totalSellAmount: string

}> {
  const {$api} = useNuxtApp()
  return $api('/aveswap/v1/swap/getTokenPnl', {
    method: 'post',
    body
  })
}

// 3.10 批量计算 pnl
// 功能说明：计算盈利
export function getTokensPnl(body: {
  chain: string
  tokens: Array<{
    token: string
    balance: string
  }>
  walletAddress: string
  days: number
}): Promise<Array<{
  balance: string
  chain: string
  profit: string
  profitRealized: string
  profitUnrealized: string
  token: string
  walletAddress: string
  avgBuyPrice: string
  avgSellPrice: string
  balanceRatio: string
  realizeRatio: string
  unrealizedRatio: string
  totalSellUsd: string
  totalBuyUsd: string
  profitRatio: string
  totalBuyAmount: string
  totalSellAmount: string

}>> {
  const {$api} = useNuxtApp()
  if (!body.tokens?.length) {
    return Promise.resolve([])
  }
  return $api('/aveswap/v1/swap/getTokensPnl', {
    method: 'post',
    body
  })
}

// aveswap 查询自动滑点
// 功能说明：获取token的自动滑点
export function getAutoSlippage(query: {
  chain: string
  token: string
  mev?: boolean
  isBuy?: boolean
}): Promise<number> {
  const {$api} = useNuxtApp()
  return $api('/aveswap/v1/swap/getAutoSlippage', {
    method: 'get',
    query
  })
}

export const getBalances = createCacheRequest((body: {
  chain: string
  creatorAddress: string
  tokens: string[]
  showZero?: boolean
}): Promise<{
    chain: string,
    creatorAddress: string,
    tokens: {
        token: string,
        balance: string,
        symbol: string,
        logoUrl: string,
        decimals: number,
        price: string,
        pnl: {
            buyAmount: string,
            buyValue: string,
            sellAmount: string,
            sellValue: string,
            avgBuyPrice: string,
            avgSellPrice: string,
            realizedProfit: string,
            unrealizedProfit: string,
            totalProfit: string,
            realizedProfitRatio: string,
            unrealizedProfitRatio: string,
            totalProfitRatio: string,
            averageNetPurchasePrice: string,
            netPurchaseAmount: string,
            lastUpdateTime: string
        },
        risk_level: number
        risk_score: number
    }[]
}>=> {
  if (!body.creatorAddress || !body.tokens || body.tokens.length === 0) {
    return Promise.resolve({
      chain: body.chain || '',
      creatorAddress: body.creatorAddress || '',
      tokens: []
    })
  }
  if (body.showZero === undefined) {
    body.showZero = true
  }
  const {$api} = useNuxtApp()
  return $api('/aveswap/v1/swap/getBalances', {
    method: 'post',
    body
  })
},2000)

// export function getBalances(body: {
//   chain: string
//   creatorAddress: string
//   tokens: string[]
//   showZero?: boolean
// }): Promise<{
//     chain: string,
//     creatorAddress: string,
//     tokens: {
//         token: string,
//         balance: string,
//         symbol: string,
//         logoUrl: string,
//         decimals: number,
//         price: string,
//         pnl: {
//             buyAmount: string,
//             buyValue: string,
//             sellAmount: string,
//             sellValue: string,
//             avgBuyPrice: string,
//             avgSellPrice: string,
//             realizedProfit: string,
//             unrealizedProfit: string,
//             totalProfit: string,
//             realizedProfitRatio: string,
//             unrealizedProfitRatio: string,
//             totalProfitRatio: string,
//             averageNetPurchasePrice: string,
//             netPurchaseAmount: string
//             lastUpdateTime: string
//         },
//         risk_level: number
//         risk_score: number
//     }[]
// }> {
//   const {$api} = useNuxtApp()
//   return $api('/aveswap/v1/swap/getBalances', {
//     method: 'post',
//     body
//   })
// }
