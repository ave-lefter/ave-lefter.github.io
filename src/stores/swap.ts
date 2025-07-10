// 链钱包
import { defineStore } from 'pinia'
import { getSwapTokenList, getTokenDetails, getUserSwapTokenList, getBalanceList } from '~/api/swap'
import { getSwapContract } from '~/utils/wallet/utils'
import { useSessionStorage } from '@vueuse/core'
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import { getSolanaPumpInfo } from '~/api/swap/solana'
import { formatNumber } from '~/utils/formatNumber'
type SwapToken = {
  price?: number | string
  decimal?: number
  token?: string
  address: string
  symbol: string
  logo_url: string
  chain: string
  balance?: number | string
  allowance?: string
  decimals: number
}

// function stringifyWithBigInt(obj: any): string {
//   return JSON.stringify(obj, (_, value) =>
//     typeof value === 'bigint'
//       ? { __bigint__: value.toString() }
//       : value
//   )
// }

// function parseWithBigInt(str: string): any {
//   return JSON.parse(str, (_, value) =>
//     value && typeof value === 'object' && '__bigint__' in value
//       ? BigInt(value.__bigint__)
//       : value
//   )
// }

// const serializer = {
//   read: parseWithBigInt,
//   write: stringifyWithBigInt,
// }

export const useSwapStore = defineStore('swap', () => {
  const token1 = useSessionStorage<SwapToken>('swap_token1', {
    address: '',
    symbol: '',
    logo_url: '',
    chain: '',
    balance: 0,
    decimals: 0
  })
  const token2 = useSessionStorage<SwapToken>('swap_token2', {
    address: '',
    symbol: '',
    logo_url: '',
    chain: '',
    balance: 0,
    decimals: 0
  })
  // const token1 = ref<SwapToken>({
  //   address: '',
  //   symbol: '',
  //   logo_url: '',
  //   chain: '',
  //   balance: 0,
  //   decimals: 0
  // })
  // const token2 = ref<SwapToken>({
  //   address: '',
  //   symbol: '',
  //   logo_url: '',
  //   chain: '',
  //   balance: 0,
  //   decimals: 0
  // })

  const walletStore = useWalletStore()
  const tokenStore = useTokenStore()
  const activeTab = shallowRef< 0 | 1 | 'liquidity'>(0)
  const swapType = ref<0 | 1 | 2>(2)

  const fromToken = computed(() => {
    if (activeTab.value ===  0) {
      return token2.value
    }
    return token1.value
  })

  const toToken = computed(() => {
    if (activeTab.value ===  0) {
      return token1.value
    }
    return token2.value
  })

  const baseToken = ref<typeof tokenStore.tokenInfo>(tokenStore.tokenInfo)
  const baseTokenExtra = ref<typeof tokenStore.tokenInfoExtra>(tokenStore.tokenInfoExtra)

  const route = useRoute()
  const chain = computed(() => {
    return walletStore.chain || getAddressAndChainFromId(route.params.id as string).chain || ''
  })

  const userBalanceTokens = ref<(SwapToken & { value: number | string })[]>([])

  const swapTokens = computed(() => {
    const list = [...(userBalanceTokens.value?.slice?.() || [])]
    if (list?.[0]?.chain && (list?.[0]?.chain !== tokens.value?.[0]?.chain)) {
      return list
    }
    tokens.value.slice().forEach(i => {
      const item = list.find(j => (j.token + '-' + j.chain) === (i.token + '-' + i.chain))
      if (!item) {
        list.push({
          ...i, value: 0
        })
      } else {
        item.logo_url = i.logo_url
      }
    })
    if (list.length > 0) {
      return list
    }
    return tokens.value.slice()
  })

  const allowance = ref('0')

  const tokens = shallowRef<{
    token: string
    address: string
    symbol: string
    logo_url: string
    chain: string
    decimals: number
  }[]>([])

  const isERC314 = ref(false)
  const isPump = ref(false)
  const isMoonshot = ref(false)
  const isFourMeme = ref(false)
  const isFlap = ref(false)
  const isSunPump = ref(0)
  const amm = ref('')

  const limitSolanaPriceU = ref<number | string>(0)
  const limitPrice = ref<number | string>('')
  const triggerPrice = ref<number | string>('')


  function _getSwapTokenList() {
    const chain = walletStore.chain || getAddressAndChainFromId(route.params.id as string).chain || ''
    getSwapTokenList().then(res => {
      tokens.value = res?.map(i => ({...i, id: i.token + '-' + i.chain, address: i.token, decimals: i.token === NATIVE_TOKEN && chain === 'solana' ? 9 : i.decimals})) || []
      if (chain === 'solana') {
        tokens.value = tokens.value?.filter?.(i => i.token !== NATIVE_TOKEN).sort((a) => (a.token === 'So11111111111111111111111111111111111111112' ? -1 : 1))
      }
      if (chain === 'sui') {
        tokens.value = tokens.value?.filter?.(i => i.token !== NATIVE_TOKEN)?.map?.(i => {
          return {
            ...i,
            token: i.token === '0x2::sui::SUI' ? NATIVE_TOKEN : i.token,
            address: i.token === '0x2::sui::SUI' ? NATIVE_TOKEN : i.token
          }
        }).sort((a) => (a.token === NATIVE_TOKEN ? -1 : 1))
      }
      const isSameToken = token1.value.address === token2.value.address
      const isSpecialCase = (isERC314.value || isFourMeme.value || isFlap.value || isSunPump.value > 0) && token2.value.address !== NATIVE_TOKEN
      const isSolanaPumpCase = (isPump.value || isMoonshot.value) && chain === 'solana' && token2.value.address === 'So11111111111111111111111111111111111111112'
      const isSui = chain === 'sui' && (token2.value.address !== '0x2::sui::SUI' && token2.value.address !== NATIVE_TOKEN)
      if ((!token2.value.address || isSameToken || token2.value.chain !== chain || isSpecialCase || isSolanaPumpCase || isSui) && tokens.value.length > 0) {
        let index = tokens.value.findIndex(i => /USDT/.test(i.symbol))
        index = index < 0 ? tokens.value.findIndex(i => /USD/.test(i.symbol)) : index
        index = index < 0 ? 0 : index
        let token = tokens.value[index]
        if (token1.value.address === token.address) {
          token = index === 0 ? (tokens.value[1] ?? tokens.value[0]) : tokens.value[0]
        }
        if (isERC314.value || isPump.value || isMoonshot.value || isFourMeme.value || isFlap.value || isSunPump.value > 0 || isSui) {
          const token = tokens.value?.slice?.().find(i => (i.address === NATIVE_TOKEN || i.address === 'So11111111111111111111111111111111111111112' || i.address === '0x2::sui::SUI'))
          if (token) {
            token2.value = {...(token as typeof token2.value)}
          }
        } else {
          token2.value = {...token}
        }
      }
    })
  }

  function _getToken1Info() {
    const walletStore = useWalletStore()
    if (token1.value.chain !== walletStore.chain) {
      return
    }
    return getTokenDetails({
      tokenAddress: token1.value.address,
      chain: walletStore.chain,
      spender: getSwapContract(walletStore.chain)
    }).then(async (res) => {
      if (!res?.address) {
        return
      }
      token1.value = {...token1.value, ...res}
      if (activeTab.value === 1) {
        allowance.value = token1.value.allowance || '0'
      }
      userBalanceTokens.value = userBalanceTokens.value?.map?.(i => {
        if (i.token === token1.value.address) {
          i = {...i, ...res, value: res.balance}
        }
        return i
      })
      return res
    })
  }

  function _getToken2Info() {
    const walletStore = useWalletStore()
    if (token2.value.chain !== walletStore.chain) {
      return
    }
    return getTokenDetails({
      tokenAddress: token2.value.address,
      chain: walletStore.chain,
      spender: getSwapContract(walletStore.chain)
    }).then(async (res) => {
      if (!res?.address) {
        return
      }
      token2.value = {...token2.value, ...res}
      if (activeTab.value === 0) {
        allowance.value = token2.value.allowance || '0'
      }
      userBalanceTokens.value = userBalanceTokens.value?.map?.(i => {
        if (i.token === token2.value.address) {
          i = {...i, ...res, value: res.balance}
        }
        return i
      })
      return res
    })
  }

  function _getTokenDetails() {
    _getToken1Info()
    _getToken2Info()
  }

  function getUserTokenList() {
    const walletStore = useWalletStore()
    const chain = walletStore.chain
    const address = walletStore.address
    if (!address || !chain) {
      return
    }
    getUserSwapTokenList().then(res => {
      if (chain === 'solana') {
        userBalanceTokens.value = res?.map?.(i => ({...i}))
      } else {
        userBalanceTokens.value = (res?.map(i => ({...i, id: i.token + '-' + i.chain, address: i.token}))?.filter?.(i => (i.risk_score || 0) < 60 && (i.risk_level || 0) >= 0 && i.flag !== 'blacklist' && i.symbol !== '' && i.flag !== 'lp') || [])?.filter(j => !!Number(j.value))
      }
      if (userBalanceTokens.value.length > 0 && chain !== 'solana' && chain !== 'sui' && (/^0x[0-9a-zA-Z]{40}$/.test(address) || isValidAddress(address, 'tron'))) {
        getBalanceList(userBalanceTokens.value.map(i => i.token || ''), chain).then(res1 => {
          userBalanceTokens.value = userBalanceTokens.value?.map?.((i, k) => ({...i, value: formatUnits(res1[k], i?.decimals || 0)}))?.filter(j => !!Number(j.value))
        })
      }
    })
  }

  function getBaseToken(callback?: (...args: any) => void, callback2?: (...args: any) => void) {
    let token = token1.value.address
    let chain = token1.value.chain
    if (!token || !chain) {
      return
    }
    const id = token + '-' + chain
    if (token1.value.address) {
      token = token1.value.address
    }
    if (token1.value.chain) {
      chain = token1.value.chain
    }
    if (token1.value.address === tokenStore.token?.token) {
      baseToken.value = {...tokenStore.tokenInfo} as typeof baseToken.value
      token1.value = {...token1.value, address: baseToken.value?.token?.token || '', ...baseToken.value?.token}
    }
    // if (chain !== this.$store.getters.netId) {
    //   return
    // }
    if (token && chain) {
      let newId = token + '-' + chain
      const chainInfo = getChainInfo(chain)
      const wmainWrapper = chainInfo?.wmain_wrapper
      const mainName = chainInfo?.main_name
      if (token === NATIVE_TOKEN && chain && wmainWrapper) {
        newId = wmainWrapper + '-' + chain
      }
      const p1 = getTokenInfo(newId).then(async (res) => {
        const tokenInfo = res || {}
        baseToken.value = {...tokenInfo, ...(token === NATIVE_TOKEN ? { token: {...(res?.token || {}), token, symbol: mainName}} : {})} as typeof baseToken.value
        token1.value = {...token1.value, address: baseToken.value?.token?.token || '', ...baseToken.value?.token}
        if (chain === 'solana') {
          limitSolanaPriceU.value = baseToken.value?.token.current_price_usd ? formatNumber(baseToken.value.token.current_price_usd) : ''
        } else {
          limitPrice.value = baseToken.value?.token.current_price_usd ? formatNumber(baseToken.value?.token?.current_price_usd) : ''
          triggerPrice.value = baseToken.value?.token.current_price_usd ? formatNumber(baseToken.value?.token?.current_price_usd) : ''
        }
        const pairInfo = res?.pairs?.[0]
        const pair = pairInfo?.pair
        if (pair && pairInfo?.amm !== 'moonshot' && !pairInfo?.amm?.includes('fourmeme') && pairInfo?.amm !== 'flapswap' && pairInfo?.amm !== 'sunpump' && (pairInfo?.target_token === pair || new RegExp(pairInfo?.target_token, 'i').test(pair))) {
          isERC314.value = true
          if (token2.value.address !== NATIVE_TOKEN && tokens.value?.length > 0) {
            const _token2 = {...tokens.value?.slice()?.find(i => i.address === NATIVE_TOKEN)}
            token2.value = {..._token2} as typeof token2.value
            setTimeout(() => {
              if(callback) {
                callback(token2.value)
              }
            }, 1000)
          }
        } else {
          isERC314.value = false
        }
        if (pairInfo?.amm === 'moonshot') {
          isMoonshot.value = true
        } else {
          isMoonshot.value = false
        }
        if (pairInfo?.amm?.includes('fourmeme')) {
          isFourMeme.value = true
        } else {
          isFourMeme.value = false
        }
        if (pairInfo?.amm === 'flapswap') {
          isFlap.value = true
        } else {
          isFlap.value = false
        }
        const sunpumpTokens = ['TPeoxx1VhUMnAUyjwWfximDYFDQaxNQQ45', 'TXL6rJbvmjD46zeN1JssfgxvSo99qC8MRT', 'TAwAg9wtQzTMFsijnSFotJrpxhMm3AqW1d']
        if (pairInfo?.amm === 'sunpump') {
          isSunPump.value = 1
        } else if (res?.pairs?.some(i => i.amm === 'sunpump') || sunpumpTokens?.includes?.(token)) {
          isSunPump.value = 2
        } else {
          isSunPump.value = 0
        }
        amm.value = pairInfo?.amm || ''
        _getSolanaPumpInfo(callback).catch(async() => false)
        // this.quoteLimitSolana()
        return res
      })
      const p2 = getTokenInfoExtra(id).then(async (res) => {
        baseTokenExtra.value = {...res, buy_tax: Number(Number(res?.buy_tax || 0).toFixed(2)), sell_tax: Number(Number(res?.sell_tax || 0).toFixed(2))} as typeof baseTokenExtra.value
        // this.handleTaxSlippage()
        if (callback2) {
          callback2()
        }
        return res
      })
      Promise.all([p1, p2]).finally(() => {
        // this.$store.dispatch('initWs', newId)
      })
    }
  }

  function _getSolanaPumpInfo(callback?: (...args: any) => void) {
    return new Promise((resolve) => {
      const id = (route.params?.id || '') as string
      let [token, chain] = getAddressAndChainFromId(id, 1)
      if (token1.value.address) {
        token = token1.value.address
      }
      if (token1.value.chain) {
        chain = token1.value.chain
      }
      if (token && chain === 'solana') {
        getSolanaPumpInfo(token).then(res => {
          if (res?.completed === false) {
            isPump.value = true
            if (token2.value.address !== 'So11111111111111111111111111111111111111112' && tokens.value?.length > 0) {
              const _token2 = {...tokens.value?.slice()?.find(i => i.address === 'So11111111111111111111111111111111111111112')}
              token2.value = {..._token2} as typeof token2.value
              setTimeout(() => {
                // this.handleSelectToken2(_token2)
                if(callback) {
                  callback(_token2)
                }
              }, 1000)
            }
            resolve(true)
          } else {
            isPump.value = false
            resolve(false)
          }
        })
      } else {
        isPump.value = false
        resolve(false)
      }
    })
  }


  function init() {
    const [token, chain1] = getAddressAndChainFromId(route.params?.id as string, 1)
    const chain = walletStore.chain
    if (token && (token !== token1.value.address)) {
      token1.value = {
        address: token || '',
        chain: chain1 || '',
        balance: 0,
        symbol: '',
        decimals: 0,
        logo_url: '',
      }
    }
    if (chain !== token2.value.chain || !token2.value.address) {
      token2.value = {
        address: '',
        chain: chain || '',
        balance: 0,
        symbol: '',
        decimals: 0,
        logo_url: '',
      }
    }
    _getSwapTokenList()
    getUserTokenList()
    getSwapTokenList()
    getBaseToken()
    _getTokenDetails()
  }


  return {
    token1,
    token2,
    chain,
    fromToken,
    toToken,
    baseToken,
    baseTokenExtra,
    allowance,
    activeTab,
    swapType,
    isFourMeme,
    isFlap,
    isPump,
    isMoonshot,
    isERC314,
    isSunPump,
    userBalanceTokens,
    getTokenDetails: _getTokenDetails,
    getToken2Info: _getToken2Info,
    getToken1Info: _getToken1Info,
    getBaseToken,
    swapTokens,
    init,
    getUserTokenList
  }
})
