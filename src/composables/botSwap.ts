import { debounce } from 'lodash-es'
import { NATIVE_TOKEN, MAX_UINT_AMOUNT } from '@/utils/constants'
import { getAddressAndChainFromId, getChainInfo, isEvmChain } from '@/utils'
import { bot_getTokenBalance, bot_getApprove, bot_approve } from '@/api/bot'
import { getTokensPrice } from '@/api/token'
import { ElNotification } from 'element-plus'

const chainMainToken: Record<string, string> = {
  solana: 'sol',
  ton: 'TON'
}

export function useBotSwap(type: number = 0) {
  const route = useRoute()

  const loading = ref(false)
  const tokenStore = useTokenStore()
  const tokenInfo = computed(() => tokenStore.token)
  const botStore = useBotStore()

  const wsStore = useWSStore()

  const { t } = useI18n()

  const getParsedRoute = () => {
    const id = route.params?.id
    return typeof id === 'string'
      ? getAddressAndChainFromId(id)
      : {
        address: '',
        chain: ''
      }
  }

  const getWalletAddress = (chain: string): string | undefined => {
    return botStore.userInfo?.addresses?.find((i) => i?.chain === chain)?.address
  }

  function getTokenBalance() {
    const t = getAddressAndChainFromId((route.params?.id || '') as string)
    const chain = t?.chain || tokenStore.tokenInfo?.token?.chain || ''
    const address = t?.address || tokenStore.tokenInfo?.token?.token || ''
    const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
    if (!walletAddress) {
      tokenStore.swap.native = {
        chain: chain,
        symbol: getChainInfo(chain)?.main_name,
        address: chainMainToken[chain] || NATIVE_TOKEN,
        decimals: getChainInfo(chain)?.decimals
      }
      return
    }
    let payToken = tokenStore.swap.payToken
    let token1 = chainMainToken[chain] || NATIVE_TOKEN
    let payTokenAddress = payToken.chain !== chain ? token1 : (payToken?.address || NATIVE_TOKEN)
    bot_getTokenBalance({
      chain: chain,
      tokens: [address, token1, payTokenAddress],
      walletAddress: walletAddress
    }).then(tokens => {
      const t1 = tokens[0]
      const t2 = tokens[1]
      const t3 = tokens[2]
      tokenStore.swap.token = {...tokenStore.token, ...t1, address: (t1.token || t1.address), chain: chain}
      tokenStore.swap.native = {...t2, symbol: getChainInfo(chain)?.main_name, chain: chain, address: t2.token || t2.address, decimals: t2?.decimals || t2?.decimal}
      tokenStore.swap.payToken = {...tokenStore.swap.payToken, ...t3}
      _getTokensPrice(true)
    })
  }

  function _getTokensPrice(isUpdateBalance = false) {
    const {token, native} = tokenStore.swap
    const token1Id = token?.address + '-' + token?.chain
    const token2Id = native?.address + '-' + native?.chain
    const token3Id = tokenStore.swap.payToken?.address + '-' + tokenStore.swap.payToken?.chain
    return getTokensPrice([token1Id, token2Id, token3Id]).then(async res => {
      if (res) {
        const price1 = res?.[0]?.current_price_usd || 0
        const price2 = res?.[1]?.current_price_usd || 0
        const price3 = res?.[2]?.current_price_usd || 0
        tokenStore.swap.native.price = price2
        tokenStore.swap.token.price = price1
        tokenStore.swap.payToken.price = price3
        if (isUpdateBalance) {
          if (botStore.userInfo?.addresses?.length > 0) {
             botStore.userInfo!.addresses = (botStore.userInfo?.addresses || []).map(i => {
              if (i?.chain === tokenStore.swap.native?.chain) {
                i.price = price2
                i.balance = tokenStore.swap.native?.balance
              }
              return i
            })
          }
        }
        return res
      }
    })
  }

  const getSwapTokenBalance = debounce(() => {
    const parsed = getParsedRoute()
    const chain = parsed?.chain || tokenInfo.value?.chain
    const address = parsed?.address || tokenInfo.value?.token
    if (!address || !chain) return
    const walletAddress = getWalletAddress(chain)
    if (!walletAddress) return
    loading.value = true
    bot_getTokenBalance({
      chain: chain,
      tokens: [address],
      walletAddress: walletAddress
    }).then(tokens => {
      const t1 = tokens[0]
      tokenStore.swap.token = {...tokenStore.token, ...t1, address: (t1.token || t1.address), chain: chain}
    }).finally(() => {
      loading.value = false
    })
  }, 500, { leading: true, trailing: true })

  const getSwapNativeTokenBalance = debounce(() => {
    const parsed = getParsedRoute()
    const chain = parsed?.chain || tokenInfo.value?.chain
    const address = parsed?.address || tokenInfo.value?.token
    if (!address || !chain) return
    const walletAddress = getWalletAddress(chain)

    if (!walletAddress) return
    loading.value = true
    bot_getTokenBalance({
      chain: chain,
      tokens: [chainMainToken[chain] || NATIVE_TOKEN],
      walletAddress: walletAddress
    }).then(tokens => {
      const t2 = tokens[0]
      tokenStore.swap.native = {...t2, symbol: getChainInfo(chain)?.main_name, chain: chain, address: t2.token || t2.address, decimals: t2?.decimals || t2?.decimal}
    }).finally(() => {
      loading.value = false
    })
  }, 500, { leading: true, trailing: true })

  const getSwapPayTokenBalance = debounce(() => {
    const parsed = getParsedRoute()
    const chain = parsed?.chain || tokenInfo.value?.chain
    const address = parsed?.address || tokenInfo.value?.token
    if (!address || !chain) return
    const walletAddress = getWalletAddress(chain)

    if (!walletAddress) return
    let payToken = tokenStore.swap.payToken
    if (!payToken || !payToken?.address || payToken?.chain !== chain) return
    loading.value = true
    bot_getTokenBalance({
      chain: chain,
      tokens: [payToken?.address],
      walletAddress: walletAddress
    }).then(tokens => {
      const t3 = tokens[0]
      tokenStore.swap.payToken = {...payToken, ...t3}
    }).finally(() => {
      loading.value = false
    })
  }, 500, { leading: true, trailing: true })

  function getChain() {
    const routeParams = getAddressAndChainFromId(route.params.id as string)
    const chain = routeParams?.chain || tokenInfo.value?.chain || ''
    return chain
  }

  const loadingAllowance = ref(false)
  const allowance = ref<number | string>(0)

  async function getAllowance(token: string, chain: string = getChain()) {
    if (chain === 'solana' || token === NATIVE_TOKEN) {
      allowance.value = MAX_UINT_AMOUNT
      return MAX_UINT_AMOUNT
    }
    if (!botStore.accessToken) {
      allowance.value = '0'
      return '0'
    }
    const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
    loadingAllowance.value = true
    return bot_getApprove({
      token,
      chain,
      owner: walletAddress || ''
    }).then(async res => {
      allowance.value = res
      return res
    }).finally(() => {
      loadingAllowance.value = false
    })
  }

  const refreshTokenBalance = (isPayToken = false) => {
    if (type === 1) {
      getSwapTokenBalance()
    } else {
      if (isPayToken) {
        getSwapPayTokenBalance()
      } else {
        getSwapNativeTokenBalance()
      }
    }
  }

  function _bot_approve(data: {
    tokenAddress: string
    batchId: string
    chain: string
    creatorAddress: string[]
  }) {
    const d = {...data, tgUid: botStore?.userInfo?.tgUid}
    return bot_approve(d).then(res => {
      return {
        result: res,
        wait: () => {
          let isFinish = false
          let time = 23
          const fuc = (resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
            time = time - 3
            if (time > 0) {
              setTimeout(() => {
                if (isFinish) {
                  return
                }
                getAllowance(d.tokenAddress, d.chain).then(res => {
                  if (res === '0') {
                    fuc(resolve, reject)
                  } else {
                    resolve(res)
                  }
                })
              }, 3000)
            } else {
              reject('timeout')
            }
          }
          return new Promise((resolve, reject) => {
            const unwatch = watch(() => wsStore.wsResult?.tgbot, (subscribeResult) => {
              const batchId = subscribeResult.batchId
              if (batchId === d.batchId) {
                unwatch()
                isFinish = true
                if (subscribeResult?.txList?.[0]?.success) {
                  resolve(subscribeResult)
                } else {
                  reject(subscribeResult?.txList?.[0]?.failMessage || 'approve error')
                }
              }
            })
            fuc(resolve, reject)
          })
        }
      }
    })
  }

  function checkApproveAndApprove (data: { chain?: string, token?: string, owner?: string } = {}) {
    const chain = data?.chain
    if (!(chain && isEvmChain(chain))) {
      return Promise.resolve(MAX_UINT_AMOUNT)
    }
    return getAllowance(data.token || '', chain).then(res => {
      if (res === '0') {
        const walletAddress = data.owner || botStore?.userInfo?.evmAddress || ''
        const d = {
          batchId: Date.now().toString(),
          chain: data.chain || '',
          tokenAddress: data.token || '',
          creatorAddress: [walletAddress],
        }
        let notifyDom: null | ReturnType<typeof ElNotification> = null
        return _bot_approve(d).then(res => {
          notifyDom = ElNotification({ icon: h('div', {class: 'el-loading-spinner', style: '--el-loading-spinner-size: 24px'}, [h('svg', { viewBox: '0 0 50 50', class: 'circular' }, [h('circle', { class: 'path', style: 'stroke-width: 3', cx: '25', cy: '25', r: '20', fill: 'none' })])]), message: t('approving') + '...', duration: 0 })
          return res.wait()
        }).then(async res => {
          notifyDom?.close?.()
          ElNotification({ type: 'success', message:  t('approveSuccess') })
          return res
        }).catch(err => {
          notifyDom?.close?.()
          ElNotification({ type: 'error', message: err })
          return Promise.reject(err)
        })
      } else {
        return Promise.resolve(res)
      }
    })
  }
  return {
    loading,
    refreshTokenBalance,
    getTokenBalance,
    getTokensPrice: _getTokensPrice,
    getAllowance,
    loadingAllowance,
    allowance,
    bot_approve: _bot_approve,
    checkApproveAndApprove
  }
}
