import { debounce } from 'lodash-es'
import { NATIVE_TOKEN, MAX_UINT_AMOUNT } from '@/utils/constants'
import { getAddressAndChainFromId, getChainInfo, isEvmChain } from '@/utils'
import { bot_getTokenBalance, bot_getApprove, bot_approve, bot_getApproveV2, bot_approveV2 } from '@/api/bot'
import { getTokensPrice } from '@/api/token'
import { ElNotification } from 'element-plus'
import BigNumber from 'bignumber.js'

const chainMainToken: Record<string, string> = {
  solana: 'sol',
  ton: 'TON'
}

export function useBotSwap(type: number = 0, isBatch = false) {
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
    let payTokenAddress = payToken?.chain !== chain ? token1 : (payToken?.address || NATIVE_TOKEN)
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
      tokenStore.swap.payToken = {...tokenStore.swap.payToken, ...t3, address: (t3.token || t3.address)}
      _getTokensPrice(true)
      botStore?.getUserAllChainBalance(tokenStore.swap.payToken as {address: string, chain: string})
      botStore?.getUserAllChainBalance(tokenStore.swap.token as {address: string, chain: string})
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

  const getSwapTokenBalance = debounce(async() => {
    const parsed = getParsedRoute()
    const chain = parsed?.chain || tokenInfo.value?.chain
    const address = parsed?.address || tokenInfo.value?.token
    if (!address || !chain) return
    const walletAddress = getWalletAddress(chain)
    if (!walletAddress) return
    loading.value = true
    if (isBatch) {
      botStore.getUserAllChainBalance(tokenStore.swap.token as {address: string, chain: string})
      await sleep(1000)
      loading.value = false
      return
    }
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

  const getSwapNativeTokenBalance = debounce(async() => {
    const parsed = getParsedRoute()
    const chain = parsed?.chain || tokenInfo.value?.chain
    const address = parsed?.address || tokenInfo.value?.token
    if (!address || !chain) return
    const walletAddress = getWalletAddress(chain)

    if (!walletAddress) return
    loading.value = true
    if (isBatch) {
      botStore.getUserAllChainBalance(tokenStore.swap.native as {address: string, chain: string})
      await sleep(1000)
      loading.value = false
      return
    }
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

  const getSwapPayTokenBalance = debounce(async () => {
    const parsed = getParsedRoute()
    const chain = parsed?.chain || tokenInfo.value?.chain
    const address = parsed?.address || tokenInfo.value?.token
    if (!address || !chain) return
    const walletAddress = getWalletAddress(chain)

    if (!walletAddress) return
    let payToken = tokenStore.swap.payToken
    if (!payToken || !payToken?.address || payToken?.chain !== chain) return
    loading.value = true
    if (isBatch) {
      botStore.getUserAllChainBalance(tokenStore.swap.payToken as {address: string, chain: string})
      await sleep(1000)
      loading.value = false
      return
    }
    bot_getTokenBalance({
      chain: chain,
      tokens: [payToken?.address],
      walletAddress: walletAddress
    }).then(tokens => {
      const t3 = tokens[0]
      tokenStore.swap.payToken = {...payToken, ...t3, address: (t3.token || t3.address)}
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

  async function getAllowance(inToken: string, outToken: string, chain: string = getChain()) {
    if (getChainInfo(chain)?.vm_type !== 'evm' || inToken === NATIVE_TOKEN ) {
      allowance.value = MAX_UINT_AMOUNT
      return MAX_UINT_AMOUNT
    }
    if (!botStore.accessToken) {
      allowance.value = '0'
      return '0'
    }
    const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
    loadingAllowance.value = true
    return bot_getApproveV2({
      inToken,
      outToken,
      chain,
      owner: walletAddress || ''
    }).then(async res => {
      if (res === 1) {
        allowance.value = MAX_UINT_AMOUNT
      } else {
        allowance.value = res
      }
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
    inTokenAddress: string
    outTokenAddress: string
    batchId: string
    chain: string
    creatorAddress: string[]
  }) {
    const d = {...data, tgUid: botStore?.userInfo?.tgUid}
    return bot_approveV2(d).then(res => {
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
                getAllowance(d.inTokenAddress, d.outTokenAddress, d.chain).then(res => {
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

  function checkApproveAndApprove (data: { chain?: string, inToken?: string, outToken?: string, owner?: string } = {}) {
    const chain = data?.chain
    if (!(chain && isEvmChain(chain))) {
      return Promise.resolve(MAX_UINT_AMOUNT)
    }
    return getAllowance(data.inToken || '', data.outToken || '', chain).then(res => {
      if (Number(res) === 0) {
        const walletAddress = data.owner || botStore?.userInfo?.evmAddress || ''
        const d = {
          batchId: Date.now().toString(),
          chain: data.chain || '',
          inTokenAddress: data.inToken || '',
          outTokenAddress: data.outToken || '',
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

  function updateBalanceFromWs(data: {fromAmount: string; outputAmount: string; inTokenAddress: string; outTokenAddress: string; chain: string}) {
    if (!isEvmChain(data.chain)) {
      return
    }
    const isSameTokenChain = data.chain === tokenStore.swap.token.chain
    const isSamePayTokenChain = data.chain === tokenStore.swap.payToken.chain
    const isSameNativeTokenChain = data.chain === tokenStore.swap.native.chain
    if (isSameTokenChain && data.inTokenAddress === tokenStore.swap.token.address && data.fromAmount) {
      const afterBalance = BigNumber(tokenStore.swap.token.balance || 0).minus(BigNumber(data.fromAmount || 0).shiftedBy((tokenStore.swap.token.decimals || 0) * -1)).toString()
      tokenStore.swap.token.balance = afterBalance
    }
    if (isSamePayTokenChain && data.inTokenAddress === tokenStore.swap.payToken.address && data.fromAmount) {
      const afterBalance = BigNumber(tokenStore.swap.payToken.balance || 0).minus(BigNumber(data.fromAmount || 0).shiftedBy((tokenStore.swap.payToken.decimals || 0) * -1)).toString()
      tokenStore.swap.payToken.balance = afterBalance
    }
    if (isSameNativeTokenChain && data.inTokenAddress === tokenStore.swap.native.address && data.fromAmount) {
      const afterBalance = BigNumber(tokenStore.swap.native.balance || 0).minus(BigNumber(data.fromAmount || 0).shiftedBy((tokenStore.swap.native.decimals || 0) * -1)).toString()
      tokenStore.swap.native.balance = afterBalance
    }
    if (isSameTokenChain &&  data.outTokenAddress === tokenStore.swap.token.address && data.outputAmount) {
      const afterBalance = BigNumber(tokenStore.swap.token.balance || 0).plus(BigNumber(data.outputAmount || 0).shiftedBy((tokenStore.swap.token.decimals || 0) * -1)).toString()
      tokenStore.swap.token.balance = afterBalance
    }
    if (isSamePayTokenChain && data.outTokenAddress === tokenStore.swap.payToken.address && data.outputAmount) {
      const afterBalance = BigNumber(tokenStore.swap.payToken.balance || 0).plus(BigNumber(data.outputAmount || 0).shiftedBy((tokenStore.swap.payToken.decimals || 0) * -1)).toString()
      tokenStore.swap.payToken.balance = afterBalance
    }
    if (isSameNativeTokenChain && data.outTokenAddress === tokenStore.swap.native.address && data.outputAmount) {
      const afterBalance = BigNumber(tokenStore.swap.native.balance || 0).plus(BigNumber(data.outputAmount || 0).shiftedBy((tokenStore.swap.native.decimals || 0) * -1)).toString()
      tokenStore.swap.native.balance = afterBalance
    }

    botStore.walletList.forEach(item => {
      if (item.evmAddress === botStore.evmAddress) {
        item.addresses.forEach(address => {
          if (address.chain === data.chain) {
            if (data.inTokenAddress === NATIVE_TOKEN) {
              address.balance = BigNumber(address.balance || 0).minus(BigNumber(data.fromAmount || 0).shiftedBy(-18)).toString()
            } else if (address?.tokenBalances?.[data.inTokenAddress]) {
              // address.tokenBalances[data.inTokenAddress] = BigNumber(address.tokenBalances[data.inTokenAddress] || 0).minus(BigNumber(data.fromAmount || 0).shiftedBy(-18)).toString()
            }

            if (data.outTokenAddress === NATIVE_TOKEN) {
              address.balance = BigNumber(address.balance || 0).plus(BigNumber(data.outputAmount || 0).shiftedBy(-18)).toString()
            }
          }
        })
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
    checkApproveAndApprove,
    getParsedRoute,
    updateBalanceFromWs
  }
}
