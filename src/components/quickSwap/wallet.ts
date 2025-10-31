import { quoteBestRouterV2, quoteFourMeme, fourMemeSwap, swapV2, getTokenDetails } from '~/api/swap'
import { recordTransaction, updateTransaction } from '~/api/tracking'
import { getSolanaSwapQuoteTransaction, sendSolanaSwapTransaction } from '~/utils/wallet/solana'
import BigNumber from 'bignumber.js'
import { getSolanaPumpInfo } from '~/api/swap/solana'
import { SwapContracts } from '~/utils/wallet/utils/constants'
import { getTonSwap } from '~/api/swap/ton'
import { getTonTokenTransferMsg, sendTonTransaction } from '~/utils/wallet/ton'

export default function useWalletSwap() {
  const walletStore = useWalletStore()
  const { t } = useI18n()
  const loading = ref(false)
  async function walletSwap(fromAmount: string | number, row: {
    chain: string
    token: string
    amm: string
    symbol: string
  }) {
    if (!(Object.keys(SwapContracts).concat(['solana', 'sui', 'ton'])?.includes?.(row.chain))) {
      ElNotification({title: 'Error', type: 'error', message: t('noSupportChain', {chain: getChainInfo(row.chain).name})})
      return
    }
    if (row.chain !== walletStore.chain) {
      ElNotification({title: 'Error', type: 'error', message: t('chainNotSame1')})
      return
    }
    loading.value = true
    // 检查余额
    let nativeToken = await _getTokenDetails(row.chain).catch(() => ({balance: '0'}))
    if (nativeToken?.balance < fromAmount || Number(nativeToken?.balance) === 0) {
      ElNotification({title: 'Error', type: 'error', message: t('insufficientBalance')})
      loading.value = false
      return
    }
    const isAmount = true
    const chain = row.chain
    const token = row.token
    const amm = row.amm
    const isFourMeme = amm?.includes('fourmeme')
    const isFlap = amm === 'flapswap'
    if (Number(fromAmount) > 0) {
      const fromDecimals = getChainInfo(chain).decimals
      if (chain === 'solana') {
        quoteSolana(row, fromAmount)
        return
      }
      if (chain === 'ton') {
        quoteTon(row, fromAmount)
        return
      }
      // if (chain === 'bsc') {
      //   const isPumpCanSwap = !((isFourMeme || isFlap))
      //   if (!isPumpCanSwap) {
      //     return
      //   }
      // }
      loading.value = true
      const params = {
        from_token: NATIVE_TOKEN,
        to_token: token,
        amountIn: isAmount ? parseUnits(
          (new BigNumber(fromAmount || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || 0,
          fromDecimals
        )
          .toFixed(0) : '0',
        amountOut: '0'
      }

      if (isFourMeme) {
        try {
          const res = await quoteFourMeme(params, chain)
          fourMemeSwap({
            fromAmount: parseUnits(fromAmount, 18).toFixed(0),
            fromToken: {
              address: NATIVE_TOKEN,
              decimals: 18,
              symbol: 'BNB',
              amount: parseUnits(fromAmount, 18).toFixed(0)
            },
            toToken: {
              address: row.token,
              decimals: 18,
              symbol: '',
              amount: (res as any)?.amountOut || '0'
            },
            isAmountOut: false,
            quoteResult: { ...res }

          }, 10).then(async (res: any) => {
            let swapSubmitInfo = { ...res, isFourMeme: true }
            console.log('swapSubmitInfo', swapSubmitInfo)
            submitSwap(swapSubmitInfo, row.chain)
          }).catch((err: any) => {
            handleError(err)
          })
          loading.value = false
        } catch (err) {
          loading.value = false
          handleError(err)
        }
        return
      }
      let wrapper = ''
      quoteBestRouterV2(params, wrapper, chain).then(_swapPathList => {
        console.log('_swapPathList', _swapPathList)
        let swapPathList = _swapPathList
        const routeInfo = swapPathList[0]
        console.log('swapPathList', swapPathList, routeInfo)
        swapV2(routeInfo as any, 30).then(async (res) => {
          submitSwap(res, chain)
        }).catch(err => {
          handleError(err)
        })
      }).catch(err => {
        console.log('quote err', err)
        handleError(err)
      })
    }
  }


  async function quoteSolana(row: { chain: string; token: string; amm: string; }, fromAmount: string | number) {
    const chain = row.chain
    if (chain === 'solana') {
      loading.value = true
      const res = await getSolanaPumpInfo(row.token)
      let isPump = false
      // if (res?.completed === false) {
      //   isPump = true
      // } else {
      //   isPump = false
      // }

      // const isMoonshot = row.amm === 'moonshot'
      const isMoonshot = false
      const fromDecimals = 9
      const toDecimals = res?.token_decimals
      const params: Record<string, any> = {
        inputMint: 'So11111111111111111111111111111111111111112',
        inputDecimals: fromDecimals,
        inputMintSymbol: 'SOL',
        inputMintName: 'SOL',
        inputAmount: fromAmount || 0,
        outputMint: row.token,
        outputDecimals: toDecimals,
        outputMintSymbol: res.token_symbol,
        outputMintName: res.token_symbol,
        amount: parseUnits(
          (new BigNumber(fromAmount || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || 0,
          fromDecimals
        ).toFixed(0),
        // 可选
        slippageBps: new BigNumber(30).times(100).toFixed(0),
        swapMode: 'ExactIn',
        slippage: 30,
        // dexes
        // excludeDexes
        // onlyDirectRoutes
        // asLegacyTransaction
        // platformFeeBps
        // maxAccounts
        isPump: isPump,
        isMoonshot: isMoonshot
      }
      loading.value = true
      let solanaQuoteResponse: any = {}
      return getSolanaSwapQuoteTransaction(params).then((res: { routeInfo: { amountOut: { amount: number } }; transaction: any; outAmount: any; inAmount: any }) => {
        console.log('solanaQuoteResponse', res)
        let toAmount = '0'
        if (res.routeInfo && res.transaction) {
          solanaQuoteResponse = res
          console.log('amountOut', res.routeInfo?.amountOut?.amount?.toFixed() || '0')
          toAmount = res.routeInfo?.amountOut?.amount?.toFixed() || '0'
        } else {
         if (res.outAmount) {
            solanaQuoteResponse = res
            toAmount = formatUnits(res.outAmount || '0', toDecimals)
          } else {
            handleError('can not get quote')
          }
        }
        submitSolanaSwap(solanaQuoteResponse, {...params, toAmount})
        return res
      }).catch((err: { error: any }) => {
        console.log(err)
        loading.value = false
        handleError(err?.error || err)

        return Promise.resolve('')
      })
    }
  }

  async function quoteTon(row: { chain: string; token: string; amm: string; symbol: string }, fromAmount: string | number) {
    const chain = row.chain
    const token = row.token
    if (chain === 'ton') {
      const fromDecimals = 9
      const toDecimals = (await _getTokenDetails(token)).decimals || 9
      const a = (new BigNumber(fromAmount || 0)).times('0.997')
      const params = {
        inputToken: 'TON',
        outputToken: token,
        inputTokenAmount: parseUnits(
            a.toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || 0,
            fromDecimals
          ).toFixed(0),
        slippageBps: new BigNumber(30).times(100).toFixed(0),
      }
      loading.value = true
      let tonQuoteResponse: any = {}
      return getTonSwap(params).then(res => {
        console.log('tonQuoteResponse', res)
        let toAmount = '0'
        if (res.amountOut && res.payload) {
          tonQuoteResponse = res
          toAmount = formatUnits(res.amountOut || '0', toDecimals)
          submitTonSwap(tonQuoteResponse, {...params, fromAmount, toAmount, fromDecimals, toDecimals, toSymbol: row.symbol})
        } else {
          handleError('can not get quote')
        }
        return res
      }).catch(err => {
        console.log(err)
        handleError(err?.error || err)
        return Promise.resolve('')
      })
    }
}

  // 提交交易
  async function submitSwap(_swapSubmitInfo: any, chain: string) {
    try {
      loading.value = true
      const swapCallStaticResult = await _swapSubmitInfo.swapCallStatic()
      console.log('swapCallStaticResult', swapCallStaticResult.toString())
      const _swapInfo = _swapSubmitInfo.swapInfo
      const isSwap = !((_swapInfo.fromToken.isWrapper && _swapInfo.toToken.isETH) || (_swapInfo.toToken.isWrapper && _swapInfo.fromToken.isETH))
      const txInfo = {
        from_address: _swapInfo.fromToken.address,
        from_symbol: _swapInfo.fromToken.symbol,
        from_amount: Number(formatUnits(_swapInfo.fromTokenAmount || 0, _swapInfo.fromToken.decimals)),
        to_address: _swapInfo.toToken.address,
        to_symbol: _swapInfo.toToken.symbol,
        to_amount: Number(formatUnits(_swapInfo.toTokenAmount || 0, _swapInfo.toToken.decimals)),
        chain: chain,
        transaction: '',
        wallet_address: walletStore.address,
      }
      let Timer: null | ReturnType<typeof setTimeout> = null
      _swapSubmitInfo.swap().then((res: { hash: any; wait: () => any }) => {
        console.log('---confirm transaction---', res)
        Timer = setTimeout(() => {
          ElNotification({type: 'success', message: t('transactionsSubmitted')})
        }, 500)
        // 记录交易
        recordTransaction({
          chain: chain,
          destination: 'wallet rpc',
          type: 10,
          tx_hash: res.hash,
          status: 1,
          wallet: walletStore.address,
          out_token: txInfo.to_address,
          out_amount: Number(formatUnits(_swapInfo.toTokenAmount || 0, _swapInfo.toToken.decimals)),
          in_token: txInfo.from_address,
          in_amount: Number(formatUnits(_swapInfo.fromTokenAmount || 0, _swapInfo.fromToken.decimals))
        })

        loading.value = false

        return res.wait()
      }).then((res: { hash: string, to: string }) => {
        console.log('----transaction---', res)
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        ElNotification({type: 'success', message: t('tradeSuccess')})
        updateTransaction({
          chain: chain,
          tx_hash: res.hash,
          status: 100,
          to: res?.to?.toLowerCase?.() || '',
        })
        return res
      }).catch((err: any) => {
        console.log('swap err', err)
        loading.value = false
        if (isSwap) {
        }
        handleError(err, 'swap')
      })
    } catch (err) {
      console.log('swap err', err)
      loading.value = false
      handleError(err, 'swap')
    }
  }

  async function submitSolanaSwap(solanaQuoteResponse: any, _swapInfo: any) {
    try {
      loading.value = true
      const txInfo = {
        from_address: _swapInfo.inputMint,
        from_symbol: _swapInfo.inputDecimals,
        from_amount: _swapInfo.inputAmount,
        to_address: _swapInfo.outputMint,
        to_symbol: _swapInfo.outputDecimals,
        to_amount: _swapInfo.toAmount,
        chain: 'solana',
        transaction: '',
        wallet_address: walletStore.address,
      }
      let Timer: null | ReturnType<typeof setTimeout> = null
      sendSolanaSwapTransaction(solanaQuoteResponse).then((res: { hash: string | undefined; wait: () => any }) => {
        console.log('---confirm transaction---', res)
        loading.value = false
        Timer = setTimeout(() => {
          ElNotification({type: 'success', message: t('transactionsSubmitted')})
        }, 500)
        recordTransaction({
          chain: 'solana',
          destination: localStorage.solanaProtection === 'true' ? 'v1/blxrsol/sendSolTx' : '/ave_nodes/rpc/solana/sendFastSwapTx',
          type: 10,
          tx_hash: res.hash,
          status: 1,
          wallet: walletStore.address,
          out_token: txInfo.to_address,
          out_amount: _swapInfo.toAmount,
          in_token: txInfo.from_address,
          in_amount: _swapInfo.fromAmount
        })
        return res.wait()
      }).then((res: { transaction: { signatures: any[] }; blockTime: any; transactionHash: any }) => {
        console.log('----transaction---', res)
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        ElNotification({type: 'success', message: t('tradeSuccess')})
        if (res) {
          updateTransaction({
            chain: 'solana',
            tx_hash: res?.transaction?.signatures[0],
            status: 100
          })
        }
        return res
      }).catch((err: any) => {
        if ((err || err?.message) === 'Timeout') {
          ElNotification({ type: 'error', message: t('timeout_error') })
        } else if ((err || err?.message) === 'Swap fail') {
          ElNotification({ type: 'error', message: t('swapFail') })
        } else {
          handleError(err, 'solana')
        }
        loading.value = false
      })
    } catch (err) {
      loading.value = false
      handleError(err, 'solana')
    }
  }

  async function submitTonSwap(tonQuoteResponse: any, _swapInfo: any) {
    try {
      loading.value = true
      const txInfo = {
        from_address: NATIVE_TOKEN,
        from_symbol: 'TON',
        from_amount: _swapInfo?.fromAmount,
        from_decimals: _swapInfo?.fromDecimals,
        to_address: _swapInfo.outputToken,
        to_symbol: _swapInfo.toSymbol,
        to_amount: _swapInfo?.toAmount,
        to_decimals: _swapInfo?.toDecimals,
        chain: 'ton',
        transaction: '',
        wallet_address: walletStore.address,
      }
      console.log('txInfo', txInfo)
      const transaction: Array<{
        address: string
        amount: string
        payload?: string
      }> = [{
        address: tonQuoteResponse?.to,
        amount: tonQuoteResponse?.totalTransferAmount,
        payload: tonQuoteResponse?.payload
      }]
      const feeMsg = await getTonTokenTransferMsg(txInfo as any)
      if (feeMsg) {
        transaction.push(feeMsg)
      }
      let Timer: null | ReturnType<typeof setTimeout> = null
      sendTonTransaction(transaction).then(res => {
        console.log('---confirm transaction---', res)
        Timer = setTimeout(() => {
          ElNotification({type: 'success', message: t('transactionsSubmitted')})
        }, 500)
        recordTransaction({
          chain: 'ton',
          destination: 'wallet rpc',
          type: 10,
          tx_hash: res.hash,
          status: 1,
          wallet: walletStore.address,
          out_token: txInfo.to_address,
          out_amount: _swapInfo.toAmount,
          in_token: txInfo.from_address,
          in_amount: _swapInfo.fromAmount
        })
        loading.value = false
        return res.wait()
      }).then(async res => {
        console.log('----transaction---', res)
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        if (res) {
          updateTransaction({
            chain: 'ton',
            tx_hash: res?.hash,
            status: 100
          })
          ElNotification({ type: 'success', message: t('tradeSuccess') })
        }
        return res
      }).catch((err) => {
        console.warn('ton error', err)
        if ((err || err?.message) === 'Timeout') {
          ElNotification({ type: 'error', message: t('timeout_error') })
        } else if ((err || err?.message) === 'Swap fail') {
          ElNotification({ type: 'error', message: t('tradeFail') })
        } else {
          handleError(err)
        }
        loading.value = false
      })
    } catch (err) {
      loading.value = false
      handleError(err)
    }
}

  function _getTokenDetails(chain: string) {
    return getTokenDetails({
      tokenAddress: chain === 'solana' ? 'So11111111111111111111111111111111111111112' : NATIVE_TOKEN,
      chain: chain
    })
  }

  return {
    walletSwap,
    loadingWalletSwap: loading
  }
}
