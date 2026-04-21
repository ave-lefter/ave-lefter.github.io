import { getSuiMethods, getSuiTokensBalance } from '~/utils/wallet/sui'
import { ERC20ABI, SwapABI, QuoteABI, SunPump_Launchpad_ABI, SunPump_Router_ABI, Four_TokenManagerHelper_V2_ABI, Four_TokenManagerHelper_V3_ABI, ERC314ABI, Four_TokenManager_V1_ABI, Four_TokenManager_V2_ABI, WETHABI, getQuoteABI, UniChainsV4, getSwapMethod, PopMeFun_ABI } from '~/utils/wallet/utils/abi'
import { QuoteAddress } from '~/utils/wallet/utils/constants'
import BigNumber from 'bignumber.js'
import { PublicKey } from '@solana/web3.js'
import { getSolanaConnection, getSolanaTokensBalance } from '~/utils/wallet/solana'
import { MultiContract, MultiProvider, getFeeAddress, getSigner } from '~/utils/wallet/utils'
import { Contract } from 'ethers'
import { TronContract, confirmTronTx } from '~/utils/wallet/utils/tronContract'
import { getFeeIn } from '~/utils'
import { getTonTokenBalance, getTonTokenList } from '~/utils/wallet/ton'
import { getTonTokenInfo } from './ton'
import { getTokensPnl } from '../bot'

export * from './sui'

export interface GetUserBalanceResponse {
  address: string
  token: string
  chain: string
  symbol: string
  logo_url: string
  balance: number | string
  balance_usd: number
  total_profit: string
  total_profit_ratio: string
  average_purchase_price_usd: string
  current_price_usd: number
  price_change: number
  decimals: number
  risk_level: number
  risk_score: number
  last_txn_time: string
  unrealized_profit: string
  realized_profit: string
  average_net_purchase_price: string
  net_purchase_amount: string
}
export type GetUserBalanceResponseResult = { data: GetUserBalanceResponse[] ; total: number ;pageNo: number; pageSize: number }

export const getUserBalance = createCacheRequest(async function(
  {
    pageNO = 1,
    pageSize = 10,
    user_ids = [] as string[],
    sort = '',
    sort_dir = '',
    hide_risk = 1,
    hide_small = 0
  }): Promise<GetUserBalanceResponseResult> {
  sort_dir=(sort&&sort_dir)?sort_dir:''
  sort=(sort&&sort_dir)?sort:''
  const tonAddressId = user_ids.find((i: string) => i?.endsWith?.('-ton'))
  const polygonAddressId = user_ids.find((i: string) => i?.endsWith?.('-polygon'))
  const otherUserIds = user_ids?.filter((i: string) => !i?.endsWith?.('-ton') && !i?.endsWith?.('-polygon'))
  let tonTokenList: any[] = []
  let polygonTokenList: any[] = []
  let _tokens: any = {
    data: [],
    total: tonTokenList?.length || 0,
    pageNo: 1,
    pageSize
  }
  return Promise.all([(async () => {
    if (tonAddressId && pageNO === 1) {
      tonTokenList = await getTonTokenList(getAddressAndChainFromId(tonAddressId)?.address, 'all', true).catch(async () => [])
      tonTokenList = tonTokenList?.map(i => ({...i, total_profit: i.total_profit || '0', total_profit_ratio: i.total_profit_ratio || '--', average_purchase_price_usd: i.average_purchase_price_usd || '--' }))?.filter(i => {
         return new BigNumber(i?.balance_usd || 0).gte(hide_small || 0)
      })
    }
    return tonTokenList
  })(),(async () => {
    if (polygonAddressId && pageNO === 1) {
      polygonTokenList = await getUserTokenBalanceList(getAddressAndChainFromId(polygonAddressId)?.address, 'polygon', true).catch(async () => [])
      polygonTokenList = polygonTokenList?.map(i => ({...i, total_profit: i.total_profit || '0', total_profit_ratio: i.total_profit_ratio || '--', average_purchase_price_usd: i.average_purchase_price_usd || '--' }))?.filter(i => {
        return new BigNumber(i?.balance_usd || 0).gte(hide_small || 0)
      })
    }
    return polygonTokenList
  })(), (async () => {
    const { $api } = useNuxtApp()
    if (otherUserIds?.length > 0) {
      _tokens = await $api('/v2api/user_balance/v1/swap/balance', {
        method: 'post',
        body: {
          user_ids, //钱包ID
          sort,     // 排序字段，支持：balance_usd、total_profit
          sort_dir, //desc:倒序，asc:正序
          pageSize,
          pageNO,
          hide_risk,  //是否隐藏高分险。0:不隐藏高风险; 1：隐藏高分险;
          hide_small  //是否隐藏小额。 大于0时:balance_usd > hide_small; 其他：不参与过滤
        }
      })
    }
    return _tokens
  })()]).then(async (res) => {
    if (tonTokenList?.length > 0 || polygonTokenList?.length > 0) {
      return {
        ..._tokens,
        data: [...(_tokens.data || []), ...tonTokenList, ...polygonTokenList].sort((a, b) => {
          return (b[sort] - a[sort]) * (sort_dir === 'desc' ? 1 : 1)
        }),
        total: _tokens.total + tonTokenList?.length + polygonTokenList?.length
      }
    } else {
      return _tokens
    }
  })
}, 1000)


// query swap token
export function searchSwapToken(keyword: string, chain: string) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/query4swap', {
    method: 'get',
    query: {
      keyword,
      chain
    }
  })
}

// get whitelist Token List
export const getSwapTokenList = createCacheRequest(function (): Promise<Array<{
  burn_amount: number
  burn_amount_dec: string
  chain: string
  cto_flag: number
  decimals: number
  issue_platform: string
  lock_amount: number
  lock_amount_dec: string
  logo_url: string
  name: string
  opening_at: number
  other_amount: number
  other_amount_dec: string
  risk_info: string
  risk_level: number
  risk_score: number
  symbol: string
  token: string
}>> {
  const { $api } = useNuxtApp()
  const walletStore = useWalletStore()
  if (!walletStore.chain || !walletStore.address) {
    return Promise.resolve([])
  }
  return $api('/v1api/v2/aveswap/tokenlist', {
    method: 'get',
    query: {
      chain: walletStore.chain,
      wallet_address: walletStore.address
    }
  })
}, 2000)

// /v2/tokens/symbol
export function getTokensSymbol(tokenIds: string[]): Promise<Record<string, { symbol: string; decimals: number } >> {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/symbol', {
    method: 'post',
    body: {
      token_ids: tokenIds
    }
  })
}

export function getTokenSymbol(tokenId: string) {
  return getTokensSymbol([tokenId]).then(async res => {
    return {
      symbol: res?.[tokenId]?.symbol || '',
      decimals: res?.[tokenId]?.decimals || 0
    }
  })
}

export function getUserSwapTokenList(address = useWalletStore().address, chain = useWalletStore().chain): Promise<Array<{
  address: string
  chain: string
  current_price_usd: number
  decimals: number
  flag: string
  is_hidden: boolean
  is_highrisk: boolean
  logo_url: string
  max_pool_size: number
  name: string
  price_change: number
  risk_level: number
  risk_score: number
  symbol: string
  token: string
  updated_at: number
  value: number
}>> {
  // const walletStore = useWalletStore()
  // const chain = walletStore.chain
  // const address = walletStore.address
  if (!chain || !address) {
    return Promise.resolve([])
  }
  if (chain === 'sui') {
    return getSuiTokensBalance(address) as any
  }
  if (chain === 'solana') {
    return getSolanaTokensBalance(address) as any
  }
  if (chain === 'ton') {
    if (isValidAddress(address, 'ton')) {
      return getTonTokenList(address) as any
    } else {
      return Promise.resolve([])
    }
  }
  const { $api } = useNuxtApp()
  return $api('/v1api/v3/users/balance/token', {
    method: 'get',
    params: {
      address,
      chain
    }
  })
}

export const getTokenDetails= createCacheRequest(async function (data1: {
  tokenAddress: string
  chain: string
  spender?: string
  walletAddress?: string
}) {
  const { tokenAddress, chain, spender } = data1
  const canSwapChain = isEvmChain(chain) || chain === 'solana' || chain === 'tron' || chain === 'sui' || chain === 'ton'
  const account = data1.walletAddress || useWalletStore().address
  if (!chain || !tokenAddress || !canSwapChain) {
    return {
      symbol: '',
      balance: 0,
      decimals: 0,
      address: '',
      chain: chain || '',
      allowance: '0'
    }
  }
  if (chain === 'sui') {
    if (tokenAddress === NATIVE_TOKEN || tokenAddress === '0x2::sui::SUI') {
      const { totalBalance } = (await getSuiMethods({
        method: 'getBalance',
        params: {
          owner: account,
          coinType: '0x2::sui::SUI'
        }
      }).catch(async() => ({ totalBalance: 0 }))) || { totalBalance: 0 }
      return {
        symbol: 'SUI',
        balance: formatUnits(totalBalance || 0, 9),
        decimals: 9,
        address: tokenAddress,
        initBalance: (totalBalance || 0).toString(),
        chain: 'sui'
      }
    } else {
      const { totalBalance } = (await getSuiMethods({
        method: 'getBalance',
        params: {
          owner: account,
          coinType: tokenAddress
        }
      }).catch(async() => ({ totalBalance: 0 }))) || { totalBalance: 0 }
      const coinMetadata = await getSuiMethods({
        method: 'getCoinMetadata',
        params: {
          coinType: tokenAddress
        }
      })
      console.log('coinMetadata', coinMetadata)
      const decimals = coinMetadata?.decimals || 0
      return {
        symbol: coinMetadata?.symbol || '',
        balance: formatUnits(totalBalance || 0, decimals),
        decimals: coinMetadata?.decimals || 0,
        address: tokenAddress,
        initBalance: (totalBalance || 0).toString(),
        chain: 'sui'
      }
    }
  }
  if (chain === 'tron') {
    if (window?.tronLink) {
      const tronWeb = getTronWeb(account)
      if (tokenAddress === NATIVE_TOKEN) {
        let balance: number | string = await tronWeb.trx.getBalance(account)
        balance = tronWeb.fromSun(balance) as string
        return {
          symbol: 'TRX',
          balance,
          decimals: 6,
          address: tokenAddress,
          chain: chain,
          allowance: MAX_UINT_AMOUNT
        }
      } else {
        // let tronWeb = window.tronWeb
        const abi = abiToJson(ERC20ABI) as unknown as Parameters<typeof tronWeb.contract>[0]
        const ERC20 = await tronWeb.contract(abi, tokenAddress)
        console.log('tron ERC20', ERC20)
        console.log('tokenAddress', tokenAddress, account)
        const balance = (await ERC20.balanceOf(account).call()).toString()
        const decimals = (await ERC20.decimals().call()).toString()
        const allowance = !spender ? new BigNumber(0) : (await ERC20.allowance(account, spender).call()).toString()
        const symbol = await ERC20.symbol().call()
        return {
          symbol,
          balance: formatUnits(balance.toString(), decimals),
          decimals,
          address: tokenAddress,
          initBalance: balance.toString(),
          chain: chain,
          allowance
        }
      }
    }
  }
  if (chain === 'solana') {
    const connection = getSolanaConnection()
    const mint = new PublicKey(tokenAddress)
    const publicKey = new PublicKey(account)
    if (tokenAddress === 'So11111111111111111111111111111111111111112' || tokenAddress === NATIVE_TOKEN) {
      let balance: number | BigNumber.Instance = await connection.getBalance(publicKey)
      balance = new BigNumber(balance)
      return {
        symbol: 'SOL',
        balance: formatUnits(balance.toString(), 9),
        decimals: 9,
        address: tokenAddress,
        initBalance: balance.toString(),
        chain: chain,
        allowance: MAX_UINT_AMOUNT
      }
    }
    const tokenDetails = await connection.getParsedTokenAccountsByOwner(publicKey, { mint })
    const tokenAmount = tokenDetails?.value[0]?.account?.data?.parsed?.info?.tokenAmount
    let balance = tokenAmount?.amount || 0
    balance = new BigNumber(balance)
    const {symbol, decimals} = (await getTokenSymbol(tokenAddress + '-' + 'solana')) || ''
    return {
      symbol: symbol,
      balance: tokenAmount?.uiAmountString || '0',
      decimals: tokenAmount?.decimals || decimals || 0,
      address: tokenAddress,
      initBalance: balance.toString(),
      chain: chain,
      allowance: MAX_UINT_AMOUNT
    }
  }
  if (chain === 'ton') {
    let tokenInfo = await getTonTokenInfo(account, tokenAddress)
    return {
      ...tokenInfo,
      allowance: MAX_UINT_AMOUNT
    }
  }
  const { _provider, chainInfo } = getProvider(chain)
  if (!_provider) {
    return {
      symbol: '',
      balance: 0,
      decimals: 0,
      address: ''
    }
  }
  if (tokenAddress === NATIVE_TOKEN) {
    let balance: bigint | number = 0
    try {
      balance = account ? (await _provider.getBalance(account)) : 0
    } catch (err) {
      console.log(err)
    }
    return {
      symbol: chainInfo.main_name,
      balance: formatUnits(balance.toString(), 18),
      decimals: 18,
      address: tokenAddress,
      initBalance: balance.toString(),
      chain: chain,
      allowance: MAX_UINT_AMOUNT
    }
  }

  const chainId = chainInfo.chain_id
  const ethcallProvider = new MultiProvider(chainId, _provider)

  const ERC20 = new MultiContract(tokenAddress, ERC20ABI)
  const symbolCall = ERC20.symbol()
  const decimalsCall = ERC20.decimals()
  let symbol = ''
  let decimals = 0
  let balance: string | number = 0
  let allowance = '0'
  let data = [symbol, decimals, balance, allowance]
  if (account && spender) {
    const balanceCall = ERC20.balanceOf(account)
    const allowanceCall = ERC20.allowance(account, spender)
    data = await ethcallProvider.all([symbolCall, decimalsCall, balanceCall, allowanceCall])
    balance = data[2]
    allowance = data[3].toString()
  } else if (account && !spender) {
    const balanceCall = ERC20.balanceOf(account)
    data = await ethcallProvider.all([symbolCall, decimalsCall, balanceCall])
    balance = data[2]
  } else {
    data = await ethcallProvider.all([symbolCall, decimalsCall])
  }
  symbol = data[0] as string
  decimals = data[1] as number

  // const ERC20 = new ethers.Contract(tokenAddress, ERC20ABI, _provider)
  // const balance = account ? (await ERC20.balanceOf(account)) : 0
  // const decimals = await ERC20.decimals()
  // const symbol = await ERC20.symbol()
  return {
    symbol: symbol,
    balance: formatUnits(balance.toString(), decimals),
    decimals: Number(decimals.toString()),
    address: tokenAddress,
    initBalance: balance.toString(),
    allowance: allowance
  }
}, 1000)

// Returns whether this contract has been authorized to access the token
export function allowance(tokenAddress: string, spender = getSwapContract(useWalletStore().chain), chain = useWalletStore().chain, account = useWalletStore().address): Promise<BigNumber> {
  if (!account || !chain) {
    return Promise.resolve(new BigNumber(0))
  }
  if (tokenAddress === NATIVE_TOKEN) {
    return Promise.resolve(new BigNumber(MAX_UINT_AMOUNT))
  }
  if (chain === 'tron') {
    if (window.tronLink) {
      const tronWeb = getTronWeb(account)
      const abi = abiToJson(ERC20ABI) as any
      const ERC20 = tronWeb.contract(abi, tokenAddress)
      if (!spender) {
        spender = getSwapContract(chain)
      }
      return ERC20.allowance(account, spender).call()
    }
  }
  if (chain === 'ton' || chain === 'solana' || chain === 'sui') {
    return Promise.resolve(new BigNumber(MAX_UINT_AMOUNT))
  }
  const { _provider } = getProvider(chain)
  const ERC20 = new Contract(tokenAddress, ERC20ABI, _provider)
  if (!spender) {
    spender = getSwapContract(chain)
  }
  return ERC20.allowance(account, spender)
}


export async function getBalance(tokenAddress: string, chain = useWalletStore().chain, account = useWalletStore().address) {
  if (!account || !chain) {
    return '0'
  }
  if (chain === 'sui') {
    const coinType = tokenAddress === NATIVE_TOKEN ? '0x2::sui::SUI' : tokenAddress
    const { totalBalance } = (await getSuiMethods({
      method: 'getBalance',
      params: {
        owner: account,
        coinType: coinType
      }
    })) || { totalBalance: 0 }
    return new BigNumber(totalBalance || 0).toFixed(0)
  }
  if (chain === 'tron') {
    if (window.tronLink) {
      const tronWeb = getTronWeb(account)
      if (tokenAddress === NATIVE_TOKEN) {
        const balance = await tronWeb.trx.getBalance(account)
        console.log('tron balance', balance)
        return new BigNumber(balance.toString()).toFixed(0)
      }
      const abi = abiToJson(ERC20ABI) as any
      const ERC20 = await tronWeb.contract(abi, tokenAddress)
      const balance = (await ERC20.balanceOf(account).call()).toString()
      console.log('erc20 balance', balance)
      return balance
    } else {
      return '0'
    }
  }
  if (chain === 'solana') {
    const mint = new PublicKey(tokenAddress)
    const publicKey = new PublicKey(account)
    const connection = getSolanaConnection()
    if (tokenAddress === 'So11111111111111111111111111111111111111112') {
      const balance = await connection.getBalance(publicKey)
      return new BigNumber(balance).toFixed(0)
    }
    const tokenDetails = await connection.getParsedTokenAccountsByOwner(publicKey, { mint })
    const balance = tokenDetails?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount || 0
    return new BigNumber(balance).toFixed(0)
  }
  if (chain === 'ton') {
    return getTokenDetails({tokenAddress, chain: 'ton'}).then(async res => res?.balance || '0')
  }
  if (!/^0x[0-9a-zA-Z]{40}$/.test(account)) {
    return '0'
  }
  const { _provider } = getProvider(chain)
  let balance: bigint | number = BigInt(0)
  if (tokenAddress === NATIVE_TOKEN) {
    balance = (await _provider?.getBalance(account)) || 0
  } else {
    const ERC20 = new Contract(tokenAddress, ERC20ABI, _provider)
    balance = await ERC20.balanceOf(account)
  }
  return new BigNumber(balance.toString()).toFixed(0)
}

export async function getBalanceAndAllowance(tokenAddress: string, spender = getSwapContract(useWalletStore().chain), chain = useWalletStore().chain, account = useWalletStore().address) {
  if (!account || !chain) {
    return {
      balance: new BigNumber(0),
      allowance: new BigNumber(0)
    }
  }
  if (chain === 'sui') {
    const coinType = tokenAddress === NATIVE_TOKEN ? '0x2::sui::SUI' : tokenAddress
    const { totalBalance } = (await getSuiMethods({
      method: 'getBalance',
      params: {
        owner: account,
        coinType: coinType
      }
    })) || { totalBalance: 0 }
    return {
      balance: new BigNumber(totalBalance),
      allowance: new BigNumber(MAX_UINT_AMOUNT)
    }
  }
  if (chain === 'tron') {
    if (window.tronLink) {
      const tronWeb = getTronWeb(account)
      if (tokenAddress === NATIVE_TOKEN) {
        const balance = await tronWeb.trx.getBalance(account)
        return {
          allowance: new BigNumber(MAX_UINT_AMOUNT),
          balance: new BigNumber(balance)
        }
      }
      const abi = abiToJson(ERC20ABI) as any
      const ERC20 = await tronWeb.contract(abi, tokenAddress)
      const allowance = !spender ? '0' : (await ERC20.allowance(account, spender).call()).toString()
      const balance = (await ERC20.balanceOf(account).call()).toString()
      // console.log(tokenAddress, spender)
      console.log('allowance', allowance)
      console.log('balance', balance)
      return {
        allowance: new BigNumber(allowance),
        balance: new BigNumber(balance)
      }
    } else {
      return {
        balance: new BigNumber(0),
        allowance: new BigNumber(0)
      }
    }
  }
  if (chain === 'solana') {
    const mint = new PublicKey(tokenAddress)
    const publicKey = new PublicKey(account)
    const connection = getSolanaConnection()
    if (tokenAddress === 'So11111111111111111111111111111111111111112') {
      const balance = await connection.getBalance(publicKey)
      return {
        allowance: new BigNumber(MAX_UINT_AMOUNT),
        balance: new BigNumber(balance)
      }
    }
    const tokenDetails = await connection.getParsedTokenAccountsByOwner(publicKey, { mint })
    const tokenAmount = tokenDetails?.value[0]?.account?.data?.parsed?.info?.tokenAmount
    let balance = tokenAmount?.amount || 0
    balance = new BigNumber(balance)
    return {
      allowance: new BigNumber(MAX_UINT_AMOUNT),
      balance: balance
    }
  }
  if (chain === 'ton') {
    if (isValidAddress(account, 'ton')) {
      let balance = await getTonTokenBalance(account, tokenAddress)
      return {
        balance: new BigNumber(balance as string),
        allowance: new BigNumber(MAX_UINT_AMOUNT)
      }
    } else {
      return {
        balance: new BigNumber(0),
        allowance: new BigNumber(MAX_UINT_AMOUNT)
      }
    }
  }
  let balance = new BigNumber(0)
  const { _provider, chainInfo } = getProvider(chain)
  if (tokenAddress === NATIVE_TOKEN) {
    balance = new BigNumber((await _provider?.getBalance?.(account)) || 0)
    return {
      balance: balance,
      allowance: new BigNumber(MAX_UINT_AMOUNT)
    }
  } else {
    const chainId = chainInfo.chain_id as number
    const ethcallProvider = new MultiProvider(chainId, _provider as any)
    // await ethcallProvider.init(_provider)

    const ERC20 = new MultiContract(tokenAddress, ERC20ABI)
    const balanceCall = ERC20.balanceOf(account)
    if (!spender) {
      spender = getSwapContract(chain)
    }
    const allowanceCall = ERC20.allowance(account, spender)
    const data = await ethcallProvider.tryAll([balanceCall, allowanceCall])
    balance = new BigNumber(data?.[0]?.toString() || 0)
    const allowance = new BigNumber(data?.[1]?.toString() || 0)
    return {
      balance: balance,
      allowance: allowance
    }
  }
}

export async function getBalanceList(tokenArr: string[], chain = useWalletStore().chain, account = useWalletStore().address) {
  if (!account || !chain) {
    return tokenArr?.map(() => '0')
  }
  if (chain === 'tron') {
    return Promise.all(tokenArr?.map(i => {
      return getBalance(i, chain, account)
    }))
  }
  const { _provider, chainInfo } = getProvider(chain)
  const chainId = chainInfo.chain_id
  if (!_provider) {
    return tokenArr?.map(() => '0')
  }
  const ethcallProvider = new MultiProvider(chainId, _provider)

  const balanceCall = tokenArr.filter(i => i !== NATIVE_TOKEN).map(i => {
    const ERC20 = new MultiContract(i, ERC20ABI)
    return ERC20.balanceOf(account)
  })
  const balanceList = await ethcallProvider.tryAll(balanceCall)

  const nativeIndex = tokenArr.findIndex(i => i === NATIVE_TOKEN)
  if (nativeIndex >= 0) {
    let balance: bigint | number = 0
    try {
      balance = account ? (await _provider.getBalance(account)) : 0
    } catch (err) {
      console.log(err)
    }
    balanceList.splice(nativeIndex, 0, balance)
  }

  return balanceList.map(i => (i !== null && i) ? i.toString() : '0')
}

export const getUserTokenBalanceList = createCacheRequest(async function(address:string, chain:string, isGetPnL = false) {
  if (!address || !chain) {
    return []
  }
  let userBalanceTokens: any[] = []
  return getUserSwapTokenList(address, chain).then(res => {
    userBalanceTokens = res?.map?.(i => ({...i, price: i?.current_price_usd || 0}))
    if (userBalanceTokens.length > 0 && (/^0x[0-9a-zA-Z]{40}$/.test(address) || isValidAddress(address, 'tron'))) {
      return getBalanceList(userBalanceTokens.map(i => i.token || ''), chain, address).then(async res1 => {
        userBalanceTokens = userBalanceTokens?.map?.((i, k) => {
          let _value = formatUnits(res1[k], i?.decimals || 0)
          let _value_usd = new BigNumber(_value).times(i?.price || 0).toFixed()
          return {...i, value: _value, value_usd: _value_usd, balance: _value, balance_usd: _value_usd}
        })?.filter(j => !!Number(j.value))
        if (isGetPnL) {
          try {
            let _tokens = userBalanceTokens.map(i => {
              return {
                token: i.token || i.address,
                balance: i.value || '0'
              }
            })
            let nativeIndex = _tokens.findIndex(i => i.token === NATIVE_TOKEN)
            if (nativeIndex >= 0) {
              _tokens.splice(nativeIndex, 1)
            }
            let pnls = await getTokensPnl({
              tokens: _tokens,
              chain,
              walletAddress: address,
              days: 30
            })
            if (nativeIndex >= 0) {
              pnls.splice(nativeIndex, 0, {
                ...userBalanceTokens[nativeIndex],
                token: NATIVE_TOKEN,
                balance: userBalanceTokens[nativeIndex]?.value || '0',
              } as any)
            }
            pnls = pnls?.map?.((res, k) => {
              let item = userBalanceTokens[k]
              return {
                ...res,
                total_profit: res?.profit || '--',
                unrealized_profit: res?.profitUnrealized || '0',
                realized_profit: res?.profitRealized || '0',
                balance_amount: item?.balance || item?.value || '0',
                balance_usd: item?.balance_usd || '0',
                total_profit_ratio: res?.profitRatio || '--',
                unrealized_ratio: res?.unrealizedRatio || '0',
                realized_ratio: res?.realizeRatio || '0',
                total_purchase_usd: res?.totalBuyUsd || '0',
                total_sold_usd: res?.totalSellUsd || '0',
                balance_ratio: res?.balanceRatio || '0',
                average_purchase_price_usd: res?.avgBuyPrice || '--',
                average_sold_price_usd: res?.avgSellPrice || '0',
                total_purchase: res?.totalBuyAmount || '0',
                bought: res?.totalBuyAmount || '0',
                total_sold: res?.totalSellAmount || '0',
                sold: res?.totalSellAmount || '0',
              }
            })
            userBalanceTokens = userBalanceTokens?.map?.((i, k) => ({...i, ...(pnls[k] || {})}))
          } catch (err) {
            console.log(err)
          }
        }
        return userBalanceTokens
      })
    } else {
      return userBalanceTokens
    }
  })
}, 2000)

// query swap token
export function getBestRouteV2(from_token: string, to_token: string, chain: string, max_hops = 3, max_routes = 6): Promise<Array<{
  pair_path: Array<{
    pair: string
    token_in: string
    token_out: string
    reserve_in: number
    reserve_out: number
    amm: string
    amm_router: string
    protocol: string
  }>
  token_path: Array<{
    address: string
    symbol: string
    decimals: number
  }>
  feeIn: number
  fee_index?: number
  weight: number
  from_buy_tax: number
  from_sell_tax: number
  to_buy_tax: number
  to_sell_tax: number
  from_cannot_sell_all: number
  to_cannot_sell_all: number
  total_buy_tax: number
  total_sell_tax: number
  from_price: number
  to_price: number
}>> {
  const { $api } = useNuxtApp()
  return $api('/bestrouteapi/getBestRoute', {
    method: 'get',
    query: {
      from_token,
      to_token,
      chain,
      max_hops,
      max_routes,
      // protocol: 'v3'
    },
    headers: {
      'X-Auth': localStorage.getItem('ave_token') || ''
    }
  }).then(async res => {
    return res?.data || res || []
  })
}

export async function quoteBestRouterV2({from_token, to_token, amountIn, amountOut}: {from_token: string, to_token: string, amountIn: string, amountOut: string}, wrapper: string, chain = useWalletStore().chain, max_hops = 3, max_routes = 6) {
  const data1 = await getBalanceAndAllowance(from_token, getSwapContract(chain), chain)
  const balance = data1.balance
  const allowanceAmount = data1.allowance
  const chainInfo = getChainInfo(chain)
  const wmainWrapper = wrapper || chainInfo?.wmain_wrapper || ''
  const mainName = chainInfo?.main_name
  const wmainName = chainInfo?.wmain_name
  from_token = from_token === NATIVE_TOKEN ? (chain === 'anubis' ? '0x83fd06F0846d9D90B3016bF670Efe2E0B11cDe14' : wmainWrapper) : from_token
  to_token = to_token === NATIVE_TOKEN ? (chain === 'anubis' ? '0x83fd06F0846d9D90B3016bF670Efe2E0B11cDe14' : wmainWrapper) : to_token
  let fromToken = from_token
  let toToken = to_token
  let fromIsETH = false
  let toIsETH = false
  let fromIsWrapper = false
  let toIsWrapper = false
  if (fromToken === wmainWrapper) {
    fromIsWrapper = true
  }
  if (toToken === wmainWrapper) {
    toIsWrapper = true
  }
  if (fromToken === NATIVE_TOKEN) {
    fromToken = wmainWrapper
    fromIsETH = true
  }
  if (toToken === NATIVE_TOKEN) {
    toToken = wmainWrapper
    toIsETH = true
  }
  if ((fromIsWrapper && toIsETH) || (fromIsETH && toIsWrapper)) {
    return Promise.resolve([{
      toWrapper: fromIsETH && toIsWrapper ? 1 : 2,
      wrapper: wmainWrapper,
      amount: (amountIn === '0' || !amountIn) ? amountOut : amountIn,
      routerPath: [
        {
          address: fromIsETH ? NATIVE_TOKEN : wmainWrapper,
          amount: (amountIn === '0' || !amountIn) ? amountOut : amountIn,
          decimals: chain === 'tron' ? 6 : 18,
          isETH: fromIsETH,
          isWrapper: fromIsWrapper,
          symbol: fromIsETH ? mainName : wmainName,
        },
        {
          address: toIsETH ? NATIVE_TOKEN : wmainWrapper,
          amount: (amountOut === '0' || !amountOut) ? amountIn : amountOut,
          decimals: chain === 'tron' ? 6 : 18,
          isETH: toIsETH,
          isWrapper: toIsWrapper,
          symbol: toIsETH ? mainName : wmainName,
        }
    ]}])
  }
  return getBestRouteV2(fromToken, toToken, chain, max_hops, max_routes).then(async route => {
    console.log('bestRouter', route)
    if (route?.length === 0) {
      return Promise.reject({code: 'noMatchingRoute'})
    }
    if (!amountIn && amountOut) {
      if (route?.every(i => i?.pair_path?.some(j => j?.amm === 'viridian' || j?.amm === 'aerodrome'))) {
        return Promise.reject('Exact output is not supported')
      }
    }
    const { _provider } = getProvider(chain)
    const signer = await getSigner()
    const swapContract = chain === 'tron' ? TronContract(SwapABI, getSwapContract(chain))  : new Contract(getSwapContract(chain), SwapABI, signer || _provider)
    const QuoteContract = chain === 'tron' ? TronContract(QuoteABI, QuoteAddress[chain]) : new Contract(QuoteAddress[chain], getQuoteABI(chain), signer || _provider)

    // let swapContract = new ethers.Contract(swapContracts[chain], SwapABI, _provider)
    const walletStore = useWalletStore()

    return Promise.allSettled(route.map((bestRoute) => {
      if (!bestRoute.pair_path || bestRoute.pair_path.length === 0 || !bestRoute.token_path || bestRoute.token_path.length === 0) {
        return Promise.resolve({routerPath: [], routerPairPath: []})
      }
      const path = bestRoute.pair_path.map(i => {
        if (UniChainsV4?.includes(chain)) {
          return {
            pair: i.protocol === 'v4' ? '0x'.padEnd(42, '0') : i.pair,
            tokenIn: i.token_in,
            tokenOut: i.token_out,
            router: i.amm_router,
            poolId: i.protocol === 'v4' ? i.pair : '0x'.padEnd(66, '0')
          }
        }
        return {
          pair: i.pair,
          tokenIn: i.token_in,
          tokenOut: i.token_out,
          router: i.amm_router
        }
      })
      if (Number(amountIn)) {
        const getAmountsOutMethod = QuoteContract?.getAmountsOut?.staticCall
        return getAmountsOutMethod(path, amountIn).then(async (res: any[]) => {
          const routerPath: Array<{ address: string, amount: string, decimals: number, isETH?: boolean, isWrapper?: boolean, symbol: string}> = bestRoute.token_path.map((i, k)=> ({ ...i, amount: res[k].toString()}))
          if (fromIsETH) {
            routerPath[0].isETH = fromIsETH
            routerPath[0].symbol = mainName
          }
          if (toIsETH) {
            routerPath[routerPath.length - 1].isETH = toIsETH
            routerPath[routerPath.length - 1].symbol = mainName
          }
          let totalTax = 0
          if (allowanceAmount.gte(amountIn) && balance.gte(amountIn)) {
            const to = walletStore.address
            const feeIn = getFeeIn(bestRoute, chain)
            const feeRate = 50
            const referrer = getFeeAddress(walletStore.address)
            // const receiveRate = 0
            const aIn = new BigNumber(amountIn).toFixed(0)
            let params: any = {
              srcToken: from_token,
              dstToken: to_token,
              srcReceiver: Number(path[0].router) !== 0 ? bestRoute.pair_path[0].pair : swapContract.target,
              dstReceiver: to,
              amount: aIn,
              minReturnAmount: '1',
              feeIn: feeRate > 0 ? feeIn : '100',
              // 平台收费费率
              feeRate: feeRate,
              // 平台收费地址
              feeTo: getFeeAddress(walletStore.address),
              // 用户上级返佣比率
              receiveRate: '0',
              // 用户上级返佣地址
              referrer: referrer,
              path: path,
              routerPath: []
            }
            if (UniChainsV4?.includes(chain)) {
              params = {
                srcToken: from_token,
                dstToken: to_token,
                amount: aIn,
                minReturnAmount: '1',
                feeIndex: feeRate > 0 ? feeIn : '2',
                // 平台收费费率
                feeRate: feeRate,
                // 平台收费地址
                feeTo: getFeeAddress(walletStore.address),
                minLiquidity: '0',
                maxLiquidity: '0',
                // 用户上级返佣比率
                referRates: [0],
                // 用户上级返佣地址
                referrers: [referrer],
                paths: path,
              }
            }
            const value = from_token === NATIVE_TOKEN ? aIn : '0'
            const amountOut = res?.[routerPath.length - 1]?.toString()
            try {
              const realAmountOut = await swapContract?.[getSwapMethod(chain)]?.staticCall(params, { value })
              // console.log('realAmountOut', realAmountOut)
              totalTax = Number(((10000 - Number(new BigNumber(realAmountOut.toString()).times(10000).div(amountOut).toFixed()) - feeRate) / 100).toFixed(2)) || 0
            } catch (error) {
              console.log('callStatic swap error', params, error)
            }
          }
          return {routerPath, routerPairPath: path, ...bestRoute, totalTax: Math.max(totalTax, 0), isAmountOut: false }
        })
      } else if (Number(amountOut)) {
        const getAmountsInMethod = QuoteContract?.getAmountsIn?.staticCall
        return getAmountsInMethod(path, amountOut).then(async (res: any[]) => {
          const routerPath: Array<{ address: string, amount: string, decimals: number, isETH?: boolean, isWrapper?: boolean, symbol: string}> = bestRoute.token_path.map((i, k)=> ({ ...i, amount: res[k].toString()}))
          if (fromIsETH) {
            routerPath[0].isETH = fromIsETH
            routerPath[0].symbol = mainName
          }
          if (toIsETH) {
            routerPath[routerPath.length - 1].isETH = toIsETH
            routerPath[routerPath.length - 1].symbol = mainName
          }
          const amountIn = res?.[0]?.toString()
          let totalTax = 0
          if (allowanceAmount.gte(amountIn) && balance.gte(amountIn)) {
            const to = walletStore.address
            const feeIn = getFeeIn(bestRoute, chain)
            const feeRate = 50
            const referrer = getFeeAddress(to)
            // const receiveRate = 0
            const aIn = balance.toString()
            const params = {
              srcToken: from_token,
              dstToken: to_token,
              srcReceiver: Number(path[0].router) !== 0 ? bestRoute.pair_path[0].pair : swapContract.target,
              dstReceiver: to,
              amount: aIn,
              minReturnAmount: amountOut,
              feeIn: feeRate > 0 ? feeIn : '2',
              // 平台收费费率
              feeRate: feeRate,
              // 平台收费地址
              feeTo: getFeeAddress(to),
              // 用户上级返佣比率
              receiveRate: 0,
              // 用户上级
              referrer: referrer,
              path: path,
              routerPath: []
            }
            const value = from_token === NATIVE_TOKEN ? params.amount : '0'
            const exactOutputCallStatic = swapContract?.exactOutput?.staticCall
            try {
              const realAmountIn = await exactOutputCallStatic(params, { value })
              totalTax = Number(((10000 - Number(new BigNumber(amountIn).times(10000).div(realAmountIn.toString()).toFixed()) - feeRate) / 100).toFixed(2)) || 0
            } catch (error) {
              console.log('callStatic swap error', params, error)
            }
          }
          return {routerPath, routerPairPath: path, ...bestRoute, totalTax: Math.max(totalTax, 0), isAmountOut: true}
        })
      } else {
        return Promise.resolve({routerPath: [], routerPairPath: []})
      }
    })).then(async res => {
      return bestRoutesSort(res)
    })
  })
}

function formatRouter(route: { routerPath: any; from_price: any; to_price: any; totalTax: any; total_buy_tax: any; total_sell_tax: any }) {
  const routerPath = route.routerPath
  const fromToken = routerPath?.length > 0 ? routerPath?.[0] : null
  const toToken = routerPath?.length > 0 ? routerPath?.[routerPath.length - 1] : null
  const fromAmount = fromToken?.amount || 0
  const toAmount = toToken?.amount || 0
  const fromPrice = route.from_price
  const toPrice = route.to_price
  if (fromAmount && toAmount) {
    const fromAmountD = formatUnits(fromAmount, fromToken.decimals)
    const toAmountD = formatUnits(toAmount, toToken.decimals)
    const priceImpact = Math.abs(Number(fromAmountD) * fromPrice / (Number(toAmountD) * toPrice) - 1) * 100
    const tax = route.totalTax ? route.totalTax : (route.total_buy_tax + route.total_sell_tax)
    const amountRate = (toAmount * (100 - tax)) * 100 / fromAmount
    const pathLen = routerPath.length
    return {
      ...route,
      priceImpact,
      amountRate,
      pathLen,
      fromAmount,
      toAmount
    }
  }
  return {
    ...route,
    priceImpact: 0,
    amountRate: 0,
    pathLen: 0,
    fromAmount,
    toAmount
  }
}

function bestRoutesSort(res: any[]) {
  if (res.every(i => i?.status === 'rejected')) {
    return Promise.reject(res?.[0]?.reason)
  }
  const list = (res?.filter?.(i => i?.status === 'fulfilled') || [])?.map(i => i.value)
  if (list?.length === 0) {
    return Promise.reject({code: 'noMatchingRoute'})
  }
  const listSort = list?.map?.(i => formatRouter(i))?.sort?.((pre, next) => {
    const amountRatePre = pre.amountRate
    const pathLenPre = pre.pathLen
    const priceImpactPre = pre.priceImpact

    const { amountRate, pathLen, priceImpact } = next
    const rate = amountRate / amountRatePre
    return rate > 1.03 && priceImpact < 20 || (priceImpactPre > 40 && priceImpact < 40) || (rate >= 1 && pathLen <= pathLenPre && priceImpact < priceImpactPre * 2) || rate > 0.97 && rate < 1 && (pathLen < pathLenPre || priceImpact < priceImpactPre / 2) ? 1 : -1
  })
  return Promise.resolve(listSort || [])
}


export async function quoteSunPumpIn({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn: string; amountOut: string }, chain = useWalletStore().chain) {
  if ([from_token, to_token].includes(NATIVE_TOKEN) && from_token !== to_token && (amountIn || amountOut) && chain === 'tron') {
    const token = [from_token, to_token].find(i => i !== NATIVE_TOKEN)
    // let TokenManagerHelperV2 = new ethers.Contract('0xaa1d6f755fff2816af737630deb6ec9e0707f325', Four_TokenManagerHelper_V2_ABI, _provider)
    const SunPumpLaunchpad = TronContract(SunPump_Launchpad_ABI, 'TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw')
    const isBuy = from_token === NATIVE_TOKEN
    if (isBuy) {
      // getTokenAmountByPurchaseWithFee
      const isAmountIn = amountIn ? true : false
      const methods = isAmountIn ? 'getTokenAmountByPurchaseWithFee' : 'getExactTokenAmountForPurchaseWithFee'
      const amount = isAmountIn ? amountIn : amountOut
      return SunPumpLaunchpad[methods](token, amount || '0').then(async (res: { tokenAmount: { toString: () => any }; fee: { toString: () => any }; trxAmount: { toString: () => any } }) => {
        console.log('bug result', res)
        if (amountIn) {
          return {...res, amountOut: res?.tokenAmount.toString(), fee: res?.fee.toString()}
        } else {
          return {...res, amountIn: res?.trxAmount.toString(), fee: res?.fee.toString()}
        }
      })
    } else {
      // getExactTrxAmountForSaleWithFee
      const isAmountIn = amountIn ? true : false
      const methods = isAmountIn ? 'getTrxAmountBySaleWithFee' : 'getExactTrxAmountForSaleWithFee'
      const amount = isAmountIn ? amountIn : amountOut
      return SunPumpLaunchpad[methods](token, amount).then(async (res: { trxAmount: { toString: () => any }; fee: { toString: () => any }; tokenAmount: { toString: () => any } }) => {
        console.log('sell result', res)
        if (amountIn) {
          return {...res, amountOut: res?.trxAmount.toString(), fee: res?.fee.toString()}
        } else {
          return {...res, amountIn: res?.tokenAmount.toString(), fee: res?.fee.toString()}
        }
      }).catch((err: { message: any }) => {
        console.log('err', err.message)
        return Promise.reject(err)
      })
    }
  } else {
    return false
  }
}

export async function quoteSunPumpOut({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn: string; amountOut: string }, chain = useWalletStore().chain) {
  if ([from_token, to_token].includes(NATIVE_TOKEN) && from_token !== to_token && (amountIn || amountOut) && chain === 'tron') {
    // let token = [from_token, to_token].find(i => i !== NATIVE_TOKEN)
    // let TokenManagerHelperV2 = new ethers.Contract('0xaa1d6f755fff2816af737630deb6ec9e0707f325', Four_TokenManagerHelper_V2_ABI, _provider)
    const SunPumpRoute = TronContract(SunPump_Router_ABI, 'TZFs5ch1R1C4mmjwrrmZqeqbUgGpxY1yWB')
    // let isBuy = from_token === NATIVE_TOKEN
    const isAmountIn = amountIn ? true : false
    const wtrx = 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR'
    if (isAmountIn) {
      const path = [from_token === NATIVE_TOKEN ? wtrx : from_token, to_token === NATIVE_TOKEN ? wtrx : to_token]
      return SunPumpRoute.getAmountsOut(amountIn, path).then(async (res: { toString: () => string }[]) => {
        console.log('bug result', res)
        return {...res, amountOut: res?.[1].toString()}
      })
    } else {
      const path = [from_token === NATIVE_TOKEN ? wtrx : from_token, to_token === NATIVE_TOKEN ? wtrx : to_token]
      return SunPumpRoute.getAmountsIn(amountOut, path).then(async (res: { toString: () => string }[]) => {
        console.log('sell result', res)
        return {...res, amountIn: res?.[0].toString()}
      })
    }
  } else {
    return false
  }
}

export async function quoteSunPump({from_token, to_token, amountIn, amountOut, isSunPump}: { from_token: string; to_token: string; amountIn: string; amountOut: string; isSunPump: number }, chain = useWalletStore().chain) {
  if (isSunPump === 1) {
    return quoteSunPumpIn({from_token, to_token, amountIn, amountOut}, chain)
  } else if (isSunPump === 2) {
    return quoteSunPumpOut({from_token, to_token, amountIn, amountOut}, chain)
  } else {
    return Promise.reject('SunPump is not supported')
  }
}

export async function sunPumpSwap({fromToken, toToken, fromAmount, isAmountOut, isSunPump}: { fromToken: { address: string; amount: string; decimals: number; symbol: string }; toToken: { address: string; amount: string; decimals: number; symbol: string }; fromAmount: string; isAmountOut: boolean; isSunPump: number }, slippage: number | string, to = useWalletStore().address) {
  const token = [fromToken.address, toToken.address].find(i => i !== NATIVE_TOKEN)
  const isBuy = fromToken.address === NATIVE_TOKEN
  const SunPumpLaunchpad = TronContract(SunPump_Launchpad_ABI, 'TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw')
  const SunPumpRoute = TronContract(SunPump_Router_ABI, 'TZFs5ch1R1C4mmjwrrmZqeqbUgGpxY1yWB')
  const amountIn = fromToken.amount
  const amountOut = toToken.amount

  if (isSunPump === 1) {
    if (isBuy) {
      const value = amountIn
      const limitAmount = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt((Number(slippage) * 100).toString())))).div('10000').toFixed(0)
      return {
        swap: () => SunPumpLaunchpad.purchaseToken(token, limitAmount, { value }),
        swapCallStatic: () => SunPumpLaunchpad.purchaseToken.staticCall(token, limitAmount, { value }),
        gasValue: '0',
        swapInfo: {
          fromToken: fromToken,
          toToken: toToken,
          fromAmount: formatUnits(fromAmount, fromToken.decimals),
          toAmount: formatUnits(toToken.amount, toToken.decimals),
          fromTokenAmount: fromAmount,
          toTokenAmount: toToken.amount,
          isAmountOut: isAmountOut
        },
        isSunPump: isSunPump
      }
    } else {
      //   "function saleToken(address token, uint256 tokenAmount, uint256 AmountMin)",
      const limitAmount = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt((Number(slippage) * 100).toString())))).div('10000').toFixed(0)
      return {
        swap: () => SunPumpLaunchpad.saleToken(token, amountIn, limitAmount),
        swapCallStatic: () => SunPumpLaunchpad.saleToken.staticCall(token, amountIn, limitAmount),
        gasValue: '0',
        swapInfo: {
          fromToken: fromToken,
          toToken: toToken,
          fromAmount: formatUnits(fromAmount, fromToken.decimals),
          toAmount: formatUnits(toToken.amount, toToken.decimals),
          fromTokenAmount: fromAmount,
          toTokenAmount: toToken.amount,
          isAmountOut: isAmountOut
        },
        isSunPump: isSunPump
      }
    }
  } else if (isSunPump === 2) {
    // "function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)",
    // "function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)",
    // "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable",
    // swapExactTokensForETH
    // "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)",
    // "function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
    const amountIn = fromToken.amount
    const amountOut = toToken.amount
    let limitAmount = '0'
    if (isAmountOut) {
      limitAmount = new BigNumber(amountIn).times(new BigNumber('10000').plus(new BigNumber(parseInt((Number(slippage) * 100).toString())))).div('10000').toFixed(0)
    } else {
      limitAmount = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt((Number(slippage) * 100).toString())))).div('10000').toFixed(0)
    }
    let method = ''
    let params = []
    const wtrx = 'TNUC9Qb1rRpS5CbWLmNMxXBjyFoydXjWFR'
    const deadline = parseInt(((Date.now() + 3600 * 1000) / 1000).toString())
    if (isBuy) {
      if (!isAmountOut) {
        method = 'swapExactETHForTokensSupportingFeeOnTransferTokens'
        params = [limitAmount, [wtrx, toToken.address], to, deadline, { value: amountIn }]
      } else {
        method = 'swapETHForExactTokens'
        params = [amountOut, [wtrx, toToken.address], to, deadline, { value: limitAmount }]
      }
    } else {
      if (!isAmountOut) {
        method = 'swapExactTokensForETHSupportingFeeOnTransferTokens'
        params = [amountIn, limitAmount, [fromToken.address, wtrx], to, deadline]
      } else {
        method = 'swapTokensForExactETH'
        params = [amountOut, limitAmount, [fromToken.address, wtrx], to, deadline]
      }
    }

    return {
      swap: () => SunPumpRoute[method](...params),
      swapCallStatic: () => SunPumpRoute[method].staticCall(...params),
      gasValue: '0',
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: isAmountOut
      },
      isSunPump: isSunPump
    }
  } else {
    return Promise.reject('SunPump is not supported')
  }
}


export async function quoteFourMeme({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn: string; amountOut: string }, chain = useWalletStore().chain) {
  const { $i18n } = useNuxtApp()
  if ([from_token, to_token].includes(NATIVE_TOKEN) && from_token !== to_token && (amountIn || amountOut)) {
    const { _provider } = getProvider(chain)
    const token = [from_token, to_token].find(i => i !== NATIVE_TOKEN)
    const TokenManagerHelperV3 = new Contract('0xF251F83e40a78868FcfA3FA4599Dad6494E46034', Four_TokenManagerHelper_V3_ABI, _provider)
    const isBuy = from_token === NATIVE_TOKEN
    if (isBuy) {
      if (amountIn && new BigNumber(amountIn).lte('1000000000000000')) {
        return Promise.reject($i18n.t('fourMemeBuyError'))
      }
      return TokenManagerHelperV3.tryBuy(token, amountOut || '0', amountIn || '0').then(async res => {
        console.log('bug result', amountOut || '0', amountIn || '0', res)
        // let { tokenManager, quote, estimatedAmount, estimatedCost, estimatedFee, fundRequirement, fundAsParameter, amountMsgValue } = res
        // let res1 = { tokenManager, quote, estimatedAmount, estimatedCost, estimatedFee, fundRequirement, fundAsParameter, amountMsgValue }
        if (amountIn) {
          if (Number(res?.estimatedAmount) === 0) {
            return Promise.reject($i18n.t('fourMemeBuyError'))
          }
          return {...res, amountOut: res?.estimatedAmount.toString()}
        } else {
          return {...res, amountIn: res?.estimatedCost.toString()}
        }
      })
    } else {
      console.log('TokenManagerHelperV3', TokenManagerHelperV3)
      console.log('sell', token, amountIn || '0')
      return TokenManagerHelperV3.trySell(token, amountIn || '0').then(async res => {
        console.log('sell result', res)
        let {tokenManager, quote, funds, fee} = res
        let res1 = {tokenManager, quote, funds, fee}
        return {...res1, amountOut: res?.funds.toString()}
      }).catch(err => {
        console.log('err', err.message)
        if (err?.message?.includes('reverted with panic code 17')) {
          // 卖出 token 数量过少，不足以支付手续费
          return Promise.reject($i18n.t('fourMemeSellError'))
        }
        return Promise.reject(err)
      })
    }
  } else {
    return false
  }
}

export async function fourMemeSwap({fromToken, toToken, fromAmount, isAmountOut, quoteResult}: {
  fromToken: { address: string; amount: string; decimals: number; symbol: string };
  toToken: { address: string; amount: string; decimals: number; symbol: string };
  fromAmount: string;
  isAmountOut: boolean;
  quoteResult: any
}, slippage: number | string) {
  const signer = await getSigner()
  const token = [fromToken.address, toToken.address].find(i => i !== NATIVE_TOKEN)
  const isBuy = fromToken.address === NATIVE_TOKEN
  const v1 = '0xEC4549caDcE5DA21Df6E6422d448034B5233bFbC'
  const v2 = '0x5c952063c7fc8610FFDB798152D69F0B9550762b'
  const TokenManagerV1 = new Contract(v1, Four_TokenManager_V1_ABI, signer)
  const TokenManagerV2 = new Contract(v2, Four_TokenManager_V2_ABI, signer)
  const amountIn = fromToken.amount
  const amountOut = toToken.amount
  let limitAmount = '0'
  if (isAmountOut) {
    limitAmount = new BigNumber(amountIn).times(new BigNumber('10000').plus(new BigNumber(parseInt(String(Number(slippage) * 100))))).div('10000').toFixed(0)
  } else {
    limitAmount = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt(String(Number(slippage) * 100))))).div('10000').toFixed(0)
  }
  const gasPriceObj = {}

  if (quoteResult?.tokenManager?.toLowerCase() === v1?.toLowerCase()) {
    if (isBuy) {
      if (!isAmountOut) {
        const value = quoteResult?.amountMsgValue || '0'
        const amountIn = quoteResult?.amountFunds || '0'
        const gas = await TokenManagerV1.purchaseTokenAMAP.estimateGas(token, amountIn, limitAmount, { value })
        const gasLimit = new BigNumber(gas.toString()).times('100').div('10').toString()
        return {
          swap: () => TokenManagerV1.purchaseTokenAMAP(token, amountIn, limitAmount, { gasLimit, value, ...gasPriceObj }),
          swapCallStatic: () => TokenManagerV1.purchaseTokenAMAP.staticCall(token, amountIn, limitAmount, { value }),
          gasValue: gasLimit.toString(),
          swapInfo: {
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: formatUnits(fromAmount, fromToken.decimals),
            toAmount: formatUnits(toToken.amount, toToken.decimals),
            fromTokenAmount: fromAmount,
            toTokenAmount: toToken.amount,
            isAmountOut: false
          },
          isFourMeme: true
        }
      } else {
        const value = quoteResult?.amountMsgValue || '0'
        const gas = await TokenManagerV1.purchaseToken.estimateGas(token, amountOut, limitAmount, { value })
        const gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed(0)
        return {
          swap: () => TokenManagerV1.purchaseToken(token, amountOut, limitAmount, { gasLimit, value, ...gasPriceObj }),
          swapCallStatic: () => TokenManagerV1.purchaseToken.staticCall(token, amountOut, limitAmount, { value }),
          gasValue: gasLimit.toString(),
          swapInfo: {
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: formatUnits(fromAmount, fromToken.decimals),
            toAmount: formatUnits(toToken.amount, toToken.decimals),
            fromTokenAmount: fromAmount,
            toTokenAmount: toToken.amount,
            isAmountOut: true
          },
          isFourMeme: true
        }
      }
    } else {
      if (!isAmountOut) {
        const gas = await TokenManagerV1.saleToken.estimateGas(token, amountIn)
        const gasLimit = new BigNumber(gas.toString()).times('100').div('10').toString()
        return {
          swap: () => TokenManagerV1.saleToken(token, amountIn, { gasLimit, ...gasPriceObj }),
          swapCallStatic: () => TokenManagerV1.saleToken.staticCall(token, amountIn),
          gasValue: gasLimit.toString(),
          swapInfo: {
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: formatUnits(fromAmount, fromToken.decimals),
            toAmount: formatUnits(toToken.amount, toToken.decimals),
            fromTokenAmount: fromAmount,
            toTokenAmount: toToken.amount,
            isAmountOut: false
          },
          isFourMeme: true
        }
      } else {
        return Promise.reject('sale token is not supported')
      }
    }
  } else if (quoteResult?.tokenManager?.toLowerCase() === v2?.toLowerCase()) {
    if (isBuy) {
      if (!isAmountOut) {
        const value = quoteResult?.amountMsgValue || '0'
        const amountIn = quoteResult?.fundAsParameter || '0'
        console.log(token, amountIn.toString(), limitAmount.toString(), { value: value.toString() })
        const gas = await TokenManagerV2['buyTokenAMAP(address,uint256,uint256)'].estimateGas(token, amountIn, limitAmount, { value })
        const gasLimit = (gas * 10n).toString()
        return {
          swap: () => TokenManagerV2['buyTokenAMAP(address,uint256,uint256)'](token, amountIn, limitAmount, { gasLimit, value, ...gasPriceObj }),
          swapCallStatic: () => TokenManagerV2['buyTokenAMAP(address,uint256,uint256)'].staticCall(token, amountIn, limitAmount, { value }),
          gasValue: gasLimit.toString(),
          swapInfo: {
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: formatUnits(fromAmount, fromToken.decimals),
            toAmount: formatUnits(toToken.amount, toToken.decimals),
            fromTokenAmount: fromAmount,
            toTokenAmount: toToken.amount,
            isAmountOut: false
          },
          isFourMeme: true
        }
      } else {
        const value = quoteResult?.amountMsgValue || '0'
        const gas = await TokenManagerV2['buyToken(address,uint256,uint256)'].estimateGas(token, amountOut, limitAmount, { value })
        const gasLimit = (gas * 10n).toString()
        return {
          swap: () => TokenManagerV2['buyToken(address,uint256,uint256)'](token, amountOut, limitAmount, { gasLimit, value, ...gasPriceObj }),
          swapCallStatic: () => TokenManagerV2['buyToken(address,uint256,uint256)'].staticCall(token, amountOut, limitAmount, { value }),
          gasValue: gasLimit.toString(),
          swapInfo: {
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: formatUnits(fromAmount, fromToken.decimals),
            toAmount: formatUnits(toToken.amount, toToken.decimals),
            fromTokenAmount: fromAmount,
            toTokenAmount: toToken.amount,
            isAmountOut: true
          },
          isFourMeme: true
        }
      }
    } else {
      if (!isAmountOut) {
        const gas = await TokenManagerV2.sellToken.estimateGas(token, amountIn)
        const gasLimit = (gas * 10n).toString()
        return {
          swap: () => TokenManagerV2.sellToken(token, amountIn, { gasLimit, ...gasPriceObj }),
          swapCallStatic: () => TokenManagerV2.sellToken.staticCall(token, amountIn),
          gasValue: gasLimit.toString(),
          swapInfo: {
            fromToken: fromToken,
            toToken: toToken,
            fromAmount: formatUnits(fromAmount, fromToken.decimals),
            toAmount: formatUnits(toToken.amount, toToken.decimals),
            fromTokenAmount: fromAmount,
            toTokenAmount: toToken.amount,
            isAmountOut: false
          },
          isFourMeme: true
        }
      } else {
        return Promise.reject('sale token is not supported')
      }
    }
  }
}


export async function quoteERC314({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn: string; amountOut: string }, chain = useWalletStore().chain) {
  if ([from_token, to_token].includes(NATIVE_TOKEN) && from_token !== to_token && (amountIn || amountOut)) {
    const { _provider } = getProvider(chain)
    const token = [from_token, to_token].find(i => i !== NATIVE_TOKEN)
    const ERC314Token = new Contract(token as string, ERC314ABI, _provider)
    const isBuy = from_token === NATIVE_TOKEN
    if (amountIn) {
      try {
        return ERC314Token.getAmountOut(amountIn, isBuy).then(async res => res.toString())
      } catch (error) {
        console.log('ERC314Token, getAmountOut error', error)
        return false
      }
    } else {
      try {
        const [reserveETH, reserveToken] = await ERC314Token.getReserves()
        if (isBuy) {
          return new BigNumber(amountOut).times(reserveETH).div(new BigNumber(reserveToken.toString()).minus(new BigNumber(amountOut.toString()))).toFixed(0)
        } else {
          return new BigNumber(amountOut).times(reserveToken).div(new BigNumber(reserveETH.toString()).minus(new BigNumber(amountOut.toString()))).toFixed(0)
        }
      } catch (error) {
        console.log('ERC314Token, getReserves error', error)
        return false
      }
    }

  } else {
    return false
  }
}

export async function ERC314Swap({fromToken, toToken, fromAmount}: { fromToken: { address: string; decimals: number, symbol: string}; toToken: { address: string; decimals: number, amount: string, symbol: string}; fromAmount: string }, to = useWalletStore().address) {
  const signer = await getSigner()
  const token = [fromToken.address, toToken.address].find(i => i !== NATIVE_TOKEN) as string
  const isBuy = fromToken.address === NATIVE_TOKEN
  const ERC314Token = new Contract(token, ERC314ABI, signer)
  const gasPriceObj = {}
  // if (chain === 'bsc') {
  //   let gasPrice = await getGasPrice()
  //   gasPriceObj = (gasPrice && gasPrice.gte('2000000000') ? { gasPrice: gasPrice.mul('120').div('100') } : { gasPrice: BigNumber.from('2000000000') })
  // }
  if (!isBuy) {
    const gas = new BigNumber((await ERC314Token.transfer.estimateGas(to, fromAmount)).toString())
    const gasLimit = gas.times('100').div('10').toString()
    return {
      swap: () => ERC314Token.transfer(token, fromAmount, { gasLimit, ...gasPriceObj }),
      swapCallStatic: () => ERC314Token.transfer.staticCall(to, fromAmount),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isERC314: true
    }
  } else {
    const gas = await signer?.estimateGas({ value: fromAmount, to: token })
    const gasLimit = new BigNumber(gas?.toString() || 0).times('100').div('10').toString()
    return {
      swap: () => signer?.sendTransaction({ value: fromAmount, to: token, gasLimit, ...gasPriceObj }),
      swapCallStatic: () => signer?.call({ value: fromAmount, to: token }),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isERC314: true
    }
  }
}

export async function swapV2(routerInfo: { totalTax: number; total_sell_tax: any; total_buy_tax: any; isAmountOut: any; toWrapper: number; wrapper: any; amount: any; routerPath: any[]; feeIn: number; fee_index: number; routerPairPath: { router: any, poolId: string }[]; pair_path: any[] }, slippage: number | string, chain = useWalletStore().chain, to = useWalletStore().address) {
  let slippage1 = slippage
  if (routerInfo.totalTax > 0 || (routerInfo.total_sell_tax + routerInfo.total_buy_tax > 0)) {
    slippage1 = Math.min((Number(slippage) + 3), 49.99)
  }
  let isAmountOut = routerInfo.isAmountOut || false
  const paramsPath = routerInfo.routerPairPath || []
  isAmountOut = (UniChainsV4?.includes(chain) && paramsPath?.some(i => Number(i?.poolId || 0) !== 0)) ? false : isAmountOut
  const signer = await getSigner()
  if (routerInfo.toWrapper === 1 || routerInfo.toWrapper === 2) {
    const WETH = chain === 'tron' ? TronContract(WETHABI, routerInfo.wrapper)  : new Contract(routerInfo.wrapper, WETHABI, signer)
    const depositCallStatic =  chain === 'tron' ? TronContract(WETHABI, routerInfo.wrapper).deposit.staticCall : WETH.deposit.staticCall
    const withdrawCallStatic = chain === 'tron' ? TronContract(WETHABI, routerInfo.wrapper).withdraw.staticCall : WETH.withdraw.staticCall
    let gas = '0'
    if (chain !== 'tron') {
      if (routerInfo.toWrapper === 1) {
        gas = await WETH.deposit.estimateGas({ value: routerInfo.amount })
      } else if (routerInfo.toWrapper === 2) {
        gas = await WETH.withdraw.estimateGas(routerInfo.amount)
      }
    }
    const gasLimit = new BigNumber(gas.toString()).times('15').div('10').toFixed()
    const path = routerInfo.routerPath.map(i => i.address)
    const fromToken = routerInfo.routerPath[0]
    const toToken = routerInfo.routerPath[path.length - 1]
    return {
      swap: routerInfo.toWrapper === 1 ? WETH.deposit : WETH.withdraw,
      swapCallStatic: routerInfo.toWrapper === 1 ? depositCallStatic : withdrawCallStatic,
      params: routerInfo.toWrapper === 1 ? [{ value: routerInfo.amount, gasLimit }] : [routerInfo.amount, { gasLimit }],
      gasValue: gas.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromTokenAmount: fromToken.amount,
        toTokenAmount: toToken.amount
      },
      isAmountOut: Boolean(isAmountOut)
    }
  }
  const swapContract = chain === 'tron' ? TronContract(SwapABI, getSwapContract(chain, to))  : new Contract(getSwapContract(chain, to), SwapABI, signer)
  const path = routerInfo.routerPath.map(i => i.address)
  const fromToken = routerInfo.routerPath[0]
  const toToken = routerInfo.routerPath[path.length - 1]
  let amountIn = fromToken.amount
  const amountOut = toToken.amount
  let limitAmount = '0'
  if (isAmountOut) {
    limitAmount = new BigNumber(amountIn).times(new BigNumber('10000').plus(new BigNumber(parseInt(String(Number(slippage1) * 100))))).div('10000').toFixed(0)
  } else {
    limitAmount = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt(String(Number(slippage1) * 100))))).div('10000').toFixed(0)
  }
  amountIn = new BigNumber(amountIn).toFixed(0)
  const feeIn = String(routerInfo?.fee_index ?? routerInfo.feeIn ?? '100')
  const feeRate = 50
  // const walletStore = useWalletStore()
  const referrer = getFeeAddress(to)
  const isPair = true
  const amount = isAmountOut ? limitAmount : amountIn
  const minReturnAmount = isAmountOut ? amountOut : limitAmount
  const getPrepareParam = null
  let params: any = {
    srcToken: fromToken.isETH ? NATIVE_TOKEN : fromToken.address,
    dstToken: toToken.isETH ? NATIVE_TOKEN : toToken.address,
    srcReceiver: isPair && Number(routerInfo.routerPairPath[0].router) !== 0 ? routerInfo.pair_path[0].pair : swapContract.target,
    dstReceiver: to,
    amount: amount,
    minReturnAmount: minReturnAmount,
    feeIn: feeRate > 0 ? feeIn : '2',
    // 平台收费费率
    feeRate: feeRate,
    // 平台收费地址
    feeTo: referrer,
    // 用户上级返佣比率(以feeRate为基础的)
    receiveRate: 0,
    // 用户上级
    referrer: referrer,
    path: paramsPath,
    routerPath: []
  }
  if (UniChainsV4?.includes(chain) && !isAmountOut) {
    params = {
      srcToken: fromToken.isETH ? NATIVE_TOKEN : fromToken.address,
      dstToken: toToken.isETH ? NATIVE_TOKEN : toToken.address,
      amount: amount,
      minReturnAmount: minReturnAmount,
      feeIndex: feeRate > 0 ? feeIn : '100',
      // 平台收费费率
      feeRate: feeRate,
      // 平台收费地址
      feeTo: referrer,
      minLiquidity: '0',
      maxLiquidity: '0',
      // 用户上级返佣比率
      referRates: [0],
      // 用户上级返佣地址
      referrers: [referrer],
      paths: paramsPath,
    }
  }
  let value = '0'
  let gas = '0'
  if (isAmountOut) {
    value = fromToken.isETH ? limitAmount : '0'
    if (chain !== 'tron') {
       gas = await swapContract.exactOutput.estimateGas(params, { value })
    }
  } else {
    value = fromToken.isETH ? amountIn : '0'
    if (chain !== 'tron') {
      gas = await swapContract?.[getSwapMethod(chain)].estimateGas(params, { value })
    }
  }

  const gasLimit = new BigNumber(gas).times('2').toFixed(0)
  const swapMethod = isAmountOut ? swapContract.exactOutput : swapContract?.[getSwapMethod(chain)]
  const swapMethodCallStatic = isAmountOut ? (swapContract.exactOutput.staticCall) : (swapContract?.[getSwapMethod(chain)].staticCall)
  const swapParams = [params, { value, gasLimit }]
  return {
    swap: async () => {
      const p = [...swapParams]
      return swapMethod(...p)
    },
    swapCallStatic: async () => {
      const p = [...swapParams]
      return swapMethodCallStatic(...p)
    },
    getPrepareParam,
    params: swapParams,
    gasValue: gas.toString(),
    swapInfo: {
      fromToken: fromToken,
      toToken: toToken,
      fromTokenAmount: fromToken.amount,
      toTokenAmount: toToken.amount,
      isAmountOut: Boolean(isAmountOut)
    }
  }
}


// get tokens price info
export function getTokensPriceInfo(tokenIds: string[]) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/tokens/price4h5', {
    method: 'post',
    body: {
      token_ids: tokenIds
    }
  })
}

export function getNativeTokenPrice(chain = useWalletStore().chain): Promise<number | string> {
  if (!chain) {
    return Promise.resolve(0)
  }
  const chainInfo = getChainInfo(chain)
  const id = ((chainInfo?.wmain_wrapper || NATIVE_TOKEN) + '-' + chain)
  return getTokensPriceInfo([id]).then(async res => {
    return res?.[id]?.current_price_usd || 0
  })
}

// approve
export async function approve(tokenAddress: string, spender = getSwapContract(useWalletStore().chain), account = useWalletStore().address) {
  if (isValidAddress(tokenAddress, 'tron') && isValidAddress(spender, 'tron') && isValidAddress(account, 'tron')) {
    const tronWeb = getWalletTronWeb()
    if (tronWeb) {
      const abi = abiToJson(ERC20ABI)
      const ERC20 = tronWeb.contract(abi as any, tokenAddress)
      const balance = await ERC20.balanceOf(account).call()
      return ERC20.approve(spender, balance.toString()).send().then(async (hash: string) => {
        console.log('tron ERC20 approve', hash)
        return {
          hash: hash,
          wait: () => confirmTronTx(hash)
        }
      })
    }
  }
  const signer = await getSigner()
  const ERC20 = new Contract(tokenAddress, ERC20ABI, signer)
  const balance = await ERC20.balanceOf(account)
  const chain = useWalletStore().chain
  if (!spender) {
    spender = getSwapContract(chain)
  }
  let amount = balance
  if (tokenAddress && tokenAddress.toLowerCase() === '0xdac17f958d2ee523a2206206994597c13d831ec7' && chain === 'eth') {
    amount = MAX_UINT_AMOUNT
  }
  return ERC20.approve.estimateGas(spender, amount).then(gas => {
    return ERC20.approve(spender, amount, { gasLimit: (gas * 2n).toString() })
  }).catch(err => {
    console.log('err', err)
    err = err?.code === 'UNPREDICTABLE_GAS_LIMIT' ? err?.error || err : err
    if (err?.error?.message) {
      err.message = err?.error?.message
    }
    console.log('error next', err)
    if (!(err?.code === -32000 || err?.message === 'execution reverted')) {
      throw err
    }
    return ERC20.approve(spender, '0').then(res => res.wait()).then(async () =>{
      const gas = await ERC20.approve.estimateGas(spender, MAX_UINT_AMOUNT)
      return ERC20.approve(spender, MAX_UINT_AMOUNT, { gasLimit: (gas * 2n).toString() })
    })
  })
}


export function quoteDyorswapfunPump({from_token, to_token, amountIn, pairs, from_price, to_price}: { from_token: string; to_token: string; amountIn: string; pairs: any; from_price: any; to_price: any }, chain = useWalletStore().chain) {
  let pair = pairs[0]
  if (pair.amm === 'dyorswapfun' && (chain === 'xlayer' || chain === 'gatelayer')) {
    let from_decimals = pair.token0_decimal
    let to_decimals = pair.token1_decimal
    if (pair.token1_address === from_token || pair.token0_address === to_token) {
      from_decimals = pair.token1_decimal
      to_decimals = pair.token0_decimal
    }
    // console.log('reserve0', reserve0, 'reserve1', reserve1, amountIn)
    // let amountOut1 = _getAmountOut(amountIn, reserve0, reserve1)
    let amountOut = new BigNumber(amountIn).shiftedBy(-1 * from_decimals).times(from_price).div(to_price).shiftedBy(to_decimals).toFixed(0)
    return amountOut
  }
}


export async function dyorswapfunPumpSwap({fromToken, toToken, fromAmount}: { fromToken: any; toToken: any; fromAmount: string | number }, slippage: number | string, chain = useWalletStore().chain, to = useWalletStore().address) {
  const signer = await getSigner()
  let isBuy = fromToken.address === NATIVE_TOKEN
  let abi = [
    "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable",
    "function swapExactETHForTokensSupportingFeeOnTransferTokensV2(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) payable",
    "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)"
  ]
  if (chain === 'gatelayer') {
    abi = [
      "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable",
      "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, address team, uint256 teamRatePercent, uint256 deadline)",
      "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, address team, uint256 teamRatePercent, uint256 deadline)",
    ]
  }
  let address = '0xfd947a61e2c54413031ddb1f754dbe0e696efa09'
  if (chain === 'gatelayer') {
    address = '0xC5d6974951201FB5f20C0efB4B6BEF5cf8FF1617'
  }
  const dyorswapfunRouter = new Contract(address, abi, signer)
  let amountIn = fromToken.amount
  let amountOut = toToken.amount
  let path = [fromToken.address, toToken.address]
  if (isBuy) {
    path[0] = '0xe538905cf8410324e03a5a23c1c177a474d59b2b'
    if (chain === 'gatelayer') {
      path[0] = '0x6803b8e93b13941f6b73b82e324b80251b3de338'
    }
  } else {
    path[1] = '0xe538905cf8410324e03a5a23c1c177a474d59b2b'
    if (chain === 'gatelayer') {
      path[1] = '0x6803b8e93b13941f6b73b82e324b80251b3de338'
    }
  }
  let amountOutMin = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt((Number(slippage) * 100).toString())))).div('10000').toFixed(0)
  if (!isBuy) {
    let deadline = new BigNumber(Math.floor(Date.now() / 1000) + 60 * 20).toFixed(0)
    let params = [amountIn, amountOutMin, path, to]
    if (chain === 'gatelayer') {
      params = [amountIn, amountOutMin, path, to, '0x0000000000000000000000000000000000000000', '0']
    }

    let gas = await dyorswapfunRouter.swapExactTokensForETHSupportingFeeOnTransferTokens.estimateGas(...params, deadline)

    let gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed(0)
    return {
      swap: () => dyorswapfunRouter.swapExactTokensForETHSupportingFeeOnTransferTokens(...params, Math.floor(Date.now() / 1000) + 60 * 20, { gasLimit }),
      swapCallStatic: () => dyorswapfunRouter.swapExactTokensForETHSupportingFeeOnTransferTokens.staticCall(...params, Math.floor(Date.now() / 1000) + 60 * 20),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isDyorswapfun: true
    }
  } else {
    let deadline = new BigNumber(Math.floor(Date.now() / 1000) + 60 * 20).toFixed(0)
    console.log([amountIn, amountOutMin, path, to, deadline, { value: amountIn }])
    let gas = await dyorswapfunRouter.swapExactETHForTokensSupportingFeeOnTransferTokens.estimateGas( amountOutMin, path, to, deadline, { value: amountIn })
    let gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed(0)
    return {
      swap: () => dyorswapfunRouter.swapExactETHForTokensSupportingFeeOnTransferTokens( amountOutMin, path, to, Math.floor(Date.now() / 1000) + 60 * 20, { gasLimit, value: amountIn }),
      swapCallStatic: () => dyorswapfunRouter.swapExactETHForTokensSupportingFeeOnTransferTokens.staticCall( amountOutMin, path, to, Math.floor(Date.now() / 1000) + 60 * 20, { value: amountIn }),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isDyorswapfun: true
    }
  }
}


function getXFlapSwapContract() {
  const zeroAddress = '0x0000000000000000000000000000000000000000' as const
  const address = '0xb30d8c4216e1f21f27444d2ffaee3ad577808678' as const
  const abi = [
    "function quoteExactInput(tuple(address inputToken, address outputToken, uint256 inputAmount) params) returns (uint256 outputAmount)",
    "function swapExactInput(tuple(address inputToken, address outputToken, uint256 inputAmount, uint256 minOutputAmount, bytes permitData) params) payable returns (uint256 outputAmount)",
    "function getTokenV3(address token) view returns (tuple(uint8 status, uint256 reserve, uint256 circulatingSupply, uint256 price, uint8 tokenVersion, uint256 r, uint256 dexSupplyThresh, address quoteTokenAddress, bool nativeToQuoteSwapEnabled) state)"
  ] as const
  return {
    address,
    abi,
    zeroAddress
  }
}

export function quoteXFlap({from_token, to_token, amountIn}: { from_token: string; to_token: string; amountIn: string }, chain = useWalletStore().chain) {
  let { _provider } = getProvider(chain)
  // xflapswap
  const { address, abi, zeroAddress } = getXFlapSwapContract()
  const contract = new Contract(address, abi, _provider)
  return contract.quoteExactInput.staticCall({inputToken: from_token === NATIVE_TOKEN ? zeroAddress : from_token, outputToken: to_token === NATIVE_TOKEN ? zeroAddress : to_token, inputAmount: amountIn})
}

export async function xFlapSwap({fromToken, toToken, fromAmount}: { fromToken: any; toToken: any; fromAmount: string }, slippage: number | string,  chain = useWalletStore().chain) {
  let signer = await getSigner()
  // xflapswap
  let amountIn = fromToken.amount
  let amountOut = toToken.amount
  const { address, abi, zeroAddress } = getXFlapSwapContract()

  let amountOutMin = new BigNumber(amountOut).times(new BigNumber('10000').minus(new BigNumber(parseInt((Number(slippage) * 100).toString())))).div('10000').toFixed(0)
  const contract = new Contract(address, abi, signer)
  let inputToken = fromToken.address === NATIVE_TOKEN ? zeroAddress : fromToken.address
  let outputToken = toToken.address === NATIVE_TOKEN ? zeroAddress : toToken.address
  let params = {inputToken: inputToken, outputToken: outputToken, inputAmount: amountIn, minOutputAmount: amountOutMin, permitData: '0x' }

  let gas = await contract.swapExactInput.estimateGas(params, { value: inputToken === zeroAddress ? fromAmount : '0'})

  let gasLimit = new BigNumber(gas.toString()).times('10').toFixed(0)
  return {
    swap: () => contract.swapExactInput(params, { value: inputToken === zeroAddress ? fromAmount : '0', gasLimit }),
    swapCallStatic: () => contract.swapExactInput.staticCall(params, { value: inputToken === zeroAddress ? fromAmount : '0' }),
    gasValue: gasLimit.toString(),
    swapInfo: {
      fromToken: fromToken,
      toToken: toToken,
      fromAmount: formatUnits(fromAmount, fromToken.decimals),
      toAmount: formatUnits(toToken.amount, toToken.decimals),
      fromTokenAmount: fromAmount,
      toTokenAmount: toToken.amount,
      isAmountOut: false
    },
    isXflapswap: true
  }
}


export async function quoteCookPump({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn: string ; amountOut: string}, chain = useWalletStore().chain) {
  if ([from_token, to_token].includes(NATIVE_TOKEN) && from_token !== to_token && (amountIn || amountOut)) {
    let { _provider } = getProvider(chain)
    let token = [from_token, to_token].find(i => i !== NATIVE_TOKEN)
    const CookPumpABI = [
      "function buyTokens(address token, uint256 minTokens, bool isInsurance, string memo) payable",
      "function sellTokens(address token, uint256 tokenAmount, uint256 minEth)",
      "function getTokenOutputAmount(address tokenAddress, uint256 inputAmount, bool isInsurance) view returns (uint256)",
      "function getJuOutputAmount(address tokenAddress, uint256 inputAmount) view returns (uint256)"
    ]
    const CookPumpRoute = '0xaF2F76f06E27BE138Bd5310ec6553E2c93ec19F4'
    let CookPumpToken = new Contract(CookPumpRoute, CookPumpABI, _provider)
    let isBuy = from_token === NATIVE_TOKEN
    if (amountIn) {
      if (isBuy) {
        return CookPumpToken.getTokenOutputAmount(token, amountIn, false).then(async res => res.toString())
      } else {
        return CookPumpToken.getJuOutputAmount(token, amountIn).then(async res => res.toString())
      }
    }
  } else {
    return false
  }
}

export async function cookPumpSwap({fromToken, toToken, fromAmount}: { fromToken: any; toToken: any; fromAmount: string | number }, slippage: number | string, chain = useWalletStore().chain) {
  let signer = await getSigner()
  let token = [fromToken.address, toToken.address].find(i => i !== NATIVE_TOKEN)
  let isBuy = fromToken.address === NATIVE_TOKEN
  const CookPumpABI = [
    "function buyTokens(address token, uint256 minTokens, bool isInsurance, string memo) payable",
    "function sellTokens(address token, uint256 tokenAmount, uint256 minEth)",
    "function getTokenOutputAmount(address tokenAddress, uint256 inputAmount, bool isInsurance) view returns (uint256)",
    "function getJuOutputAmount(address tokenAddress, uint256 inputAmount) view returns (uint256)"
  ]
  const CookPumpRoute = '0xaF2F76f06E27BE138Bd5310ec6553E2c93ec19F4'
  let CookPumpToken = new Contract(CookPumpRoute, CookPumpABI, signer)
  let amountOut = toToken.amount
  let amountOutMin = new BigNumber(amountOut).times(new BigNumber(100).minus(slippage)).div(100).toFixed(0)
  if (isBuy) {
    let gas = await CookPumpToken.buyTokens.estimateGas(token, amountOutMin, false, '', { value: fromAmount })
    let gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed()
    return {
      swap: () => CookPumpToken.buyTokens(token, amountOutMin, false, '', { gasLimit, value: fromAmount }),
      swapCallStatic: () => CookPumpToken.buyTokens.staticCall(token, amountOutMin, false, '', { value: fromAmount }),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isCookPump: true
    }
  } else {
    let gas = await CookPumpToken.sellTokens.estimateGas(token, fromAmount, amountOutMin)
    let gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed()
    return {
      swap: () => CookPumpToken.sellTokens(token, fromAmount, amountOutMin, { gasLimit }),
      swapCallStatic: () =>  CookPumpToken.sellTokens.staticCall(token, fromAmount, amountOutMin, { gasLimit }),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isCookPump: true
    }
  }
}

export async function quotePopMeFun({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn: string ; amountOut: string}, chain = useWalletStore().chain) {
  if ([from_token, to_token].includes(NATIVE_TOKEN) && from_token !== to_token && (amountIn || amountOut)) {
    let { _provider } = getProvider(chain)
    let token = [from_token, to_token].find(i => i !== NATIVE_TOKEN)
    let popMeFunRoute = new Contract('0x198C8099E0c2CE323a5513769e294f349B015cEE', PopMeFun_ABI, _provider)
    let isBuy = from_token === NATIVE_TOKEN
    const $t = getGlobalT()
    // "function tryBuy(address _token, uint256 _amount) view returns (uint256 tokenAmountOut, uint256 refund)",
    // "function trySell(address _token, uint256 _amount) view returns (uint256 ethAmountOut)",
    if (!amountIn) {
      return false
    }
    if (isBuy) {
      // if (amountIn && BigNumber.from(amountIn).lte('1000000000000000')) {
      //   return Promise.reject(i18n.global.t('fourMemeBuyError'))
      // }
      return popMeFunRoute.tryBuy(token, amountIn || '0').then(async res => {
        console.log('bug result', amountOut || '0', amountIn || '0', res)
        if (amountIn) {
          if (Number(res?.tokenAmountOut) === 0) {
            return Promise.reject($t('fourMemeBuyError'))
          }
          return {...res, amountOut: res?.tokenAmountOut.toString()}
        }
      })
    } else {
      console.log('popMeFunRoute', popMeFunRoute)
      console.log('sell', token, amountIn || '0')
      return popMeFunRoute.trySell(token, amountIn || '0').then(async res => {
        console.log('sell result', res)
        return {...res, amountOut: res?.toString()}
      }).catch(err => {
        console.log('err', err.message)
        if (err?.message?.includes('reverted with panic code 17')) {
          // 卖出 token 数量过少，不足以支付手续费
          return Promise.reject($t('fourMemeSellError'))
        }
        return Promise.reject(err)
      })
    }
  } else {
    return false
  }
}

export async function popMeFunSwap({fromToken, toToken, fromAmount}: { fromToken: any; toToken: any; fromAmount: string | number }, slippage: number | string, chain = useWalletStore().chain) {
  let signer = await getSigner()
  let token = [fromToken.address, toToken.address].find(i => i !== NATIVE_TOKEN)
  let isBuy = fromToken.address === NATIVE_TOKEN
  let popMeFunRoute = new Contract('0x198C8099E0c2CE323a5513769e294f349B015cEE', PopMeFun_ABI, signer)
  let amountOut = toToken.amount
  let amountOutMin = new BigNumber(amountOut).times(new BigNumber(100).minus(slippage)).div(100).toFixed(0)
  if (isBuy) {
    //  "function buyToken(address _token, uint256 _amount, uint256 _minAmountOut) payable",
    let gas = await popMeFunRoute.buyToken.estimateGas(token, fromAmount, amountOutMin, { value: fromAmount })
    let gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed()
    return {
      swap: () => popMeFunRoute.buyToken(token, fromAmount, amountOutMin, { gasLimit, value: fromAmount }),
      swapCallStatic: () => popMeFunRoute.buyToken.staticCall(token, fromAmount, amountOutMin, { value: fromAmount }),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isPopMeFun: true
    }
  } else {
    // "function sellToken(address _token, uint256 _amount, uint256 _minAmountOut)",
    let gas = await popMeFunRoute.sellToken.estimateGas(token, fromAmount, amountOutMin)
    let gasLimit = new BigNumber(gas.toString()).times('100').div('10').toFixed()
    return {
      swap: () => popMeFunRoute.sellToken(token, fromAmount, amountOutMin, { gasLimit }),
      swapCallStatic: () =>  popMeFunRoute.sellToken.staticCall(token, fromAmount, amountOutMin, { gasLimit }),
      gasValue: gasLimit.toString(),
      swapInfo: {
        fromToken: fromToken,
        toToken: toToken,
        fromAmount: formatUnits(fromAmount, fromToken.decimals),
        toAmount: formatUnits(toToken.amount, toToken.decimals),
        fromTokenAmount: fromAmount,
        toTokenAmount: toToken.amount,
        isAmountOut: false
      },
      isPopMeFun: true
    }
  }
}
