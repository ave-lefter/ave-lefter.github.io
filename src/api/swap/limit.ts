import { LimitABI, QuoteABI, SwapABI, getQuoteABI, UniChainsV4, getSwapMethod } from '~/utils/wallet/utils/abi'
import { getBalanceAndAllowance, getBestRouteV2, getNativeTokenPrice } from './index'
import { aveRequestProxy } from './solana'
import { TronContract } from '~/utils/wallet/utils/tronContract'
import { FeeChainsRegExp, LimitContracts, QuoteAddress } from '~/utils/wallet/utils/constants'
import { Contract, type JsonFragment } from 'ethers'
import { AddressLookupTableAccount, TransactionMessage, VersionedTransaction } from '@solana/web3.js'
import { configureAndSendCurrentTransaction, confirmTransaction, getSolanaConnection } from '~/utils/wallet/solana'
import { keccak256, AbiCoder } from 'ethers'
import { getBytes } from 'ethers/utils'
import { recordTransaction } from '../tracking'
import { determineComputeBudget } from '~/utils/wallet/utils/solana'
import BigNumber from 'bignumber.js'
export async function quoteLimitSolana(params: { from_token: string; to_token: string; amountIn?: string | number; amountOut?: string | number }) {
  const {from_token, to_token, amountIn, amountOut} = params
   // inputMint
  // outputMintxxx
  // amount
  // 可选
  // slippageBps
  // swapMode:  ExactIn/ExactOut
  // dexes
  // excludeDexes
  // onlyDirectRoutes
  // asLegacyTransaction
  // platformFeeBps
  // maxAccounts
  const solanaSwapQuote = await getSolanaSwapQuote({
    inputMint: from_token,
    outputMint: to_token,
    amount: amountIn || amountOut || '',
    slippageBps: 200,
    swapMode: amountIn ? 'ExactIn' : 'ExactOut',
  })
  return {...solanaSwapQuote, chain: 'solana'}
}

// Sends a GET request to the Jupiter API to get the best priced quote.
export function getSolanaSwapQuote(params: { inputMint: string; outputMint: string; amount: string | number; slippageBps: number; swapMode: string }) {
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

export async function quoteLimit({from_token, to_token, amountIn, amountOut}: { from_token: string; to_token: string; amountIn?: string | number; amountOut?: string | number }, wrapper?: string, chain = useWalletStore().chain, max_hops = 3, max_routes = 3) {
  const data1 = await getBalanceAndAllowance(from_token, getSwapContract(chain), chain)
  const balance = data1.balance
  const allowanceAmount = data1.allowance
  const chainInfo = getChainInfo(chain)
  const wmainWrapper = wrapper || chainInfo?.wmain_wrapper
  const mainName = chainInfo?.main_name
  const wmainName = chainInfo?.wmain_name
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
    return Promise.resolve({
      toWrapper: fromIsETH && toIsWrapper ? 1 : 2,
      wrapper: wmainWrapper,
      amount: (amountIn === '0' || !amountIn) ? amountOut : amountIn,
      routerPath: [
        {
          address: fromIsETH ? NATIVE_TOKEN : wmainWrapper,
          amount: (amountIn === '0' || !amountIn) ? amountOut : amountIn,
          decimals: 18,
          isETH: fromIsETH,
          isWrapper: fromIsWrapper,
          symbol: fromIsETH ? mainName : wmainName,
        },
        {
          address: toIsETH ? NATIVE_TOKEN : wmainWrapper,
          amount: (amountOut === '0' || !amountOut) ? amountIn : amountOut,
          decimals: 18,
          isETH: toIsETH,
          isWrapper: toIsWrapper,
          symbol: toIsETH ? mainName : wmainName,
        }
    ]})
  }
  return getBestRouteV2(fromToken, toToken, chain, max_hops, max_routes).then(async route => {
    console.log('bestRouter', route)
    if (route?.length === 0) {
      return Promise.reject({code: 'noMatchingRoute'})
    }
    const { _provider } = getProvider(chain)
    const signer = await getSigner()
    // let bestRoute = route[0]
    const swapContract = chain === 'tron' ? TronContract(SwapABI, getSwapContract(chain))  : new Contract(getSwapContract(chain), SwapABI, signer || _provider)
    const QuoteContract = chain === 'tron' ? TronContract(QuoteABI, QuoteAddress[chain]) : new Contract(QuoteAddress[chain], getQuoteABI(chain), signer || _provider)

    const gasPrice = (await getGasPrice(chain)) as number
    const nativePrice = await getNativeTokenPrice(chain)
    const data = {chain, QuoteContract, swapContract, gasPrice, nativePrice, amountIn, amountOut, balance, allowanceAmount, fromIsETH, toIsETH, mainName, from_token, to_token}
    if (route?.length === 1) {
      return quoteLimitPath(route[0], data)
    } else if (route?.length === 2) {
      return quoteLimitPath(route[0], data).catch(async (err: any) => {
        console.log(err)
        return quoteLimitPath(route[1], data)
      })
    } else if (route?.length > 2) {
      return quoteLimitPath(route[0], data).catch(async (err: any) => {
        console.log(err)
        return quoteLimitPath(route[1], data).catch(async (err: any) => {
          console.log(err)
          return quoteLimitPath(route[2], data)
        })
      })
    }
  })
}


function quoteLimitPath(bestRoute: { pair_path: any[]; token_path: any[]; feeIn: any; weight?: number; from_buy_tax?: number; from_sell_tax?: number; to_buy_tax?: number; to_sell_tax?: number; from_cannot_sell_all?: number; to_cannot_sell_all?: number; total_buy_tax: any; total_sell_tax: any; from_price: any; to_price: any }, {chain, QuoteContract, swapContract, gasPrice, nativePrice, amountIn, amountOut, balance, allowanceAmount, fromIsETH, toIsETH, mainName, from_token, to_token}: { chain: string; QuoteContract: { [key: string]: any; address: string; abi: JsonFragment[] } | Contract; swapContract: { [key: string]: any; address: string; abi: JsonFragment[] } | Contract; gasPrice: number; nativePrice: string | number; amountIn: any; amountOut: any; balance: any; allowanceAmount: BigNumber; fromIsETH: boolean; toIsETH: boolean; mainName: any; from_token: any; to_token: any }) {
  const gas = '0'
  let gasU = '0'
  if (!bestRoute.pair_path || bestRoute.pair_path?.length === 0 || !bestRoute.token_path || bestRoute.token_path.length === 0) {
    return Promise.resolve({routerPath: [], routerPairPath: []})
  }
  const path = bestRoute.pair_path.map((i: { protocol: string; pair: string; token_in: string; token_out: string; amm_router: string }) => {
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
  let rate = 1
  if (chain === 'arbitrum') {
    rate = 3.5
  } else if (chain === 'optimism') {
    rate = 4
  } else if (chain === 'base') {
    rate = 4
  }
  const walletStore = useWalletStore()
  if (Number(amountIn)) {
    return QuoteContract.getAmountsOut.staticCall(path, amountIn).then(async (res: any[]) => {
      let routerPath = bestRoute.token_path.map((i: any, k: number)=> ({ ...i, amount: res[k].toString()}))
      if (fromIsETH) {
        routerPath[0].isETH = fromIsETH
        routerPath[0].symbol = mainName
      }
      if (toIsETH) {
        routerPath[routerPath.length - 1].isETH = toIsETH
        routerPath[routerPath.length - 1].symbol = mainName
      }
      let totalTax: number | BigNumber = 0
      if (allowanceAmount.gte(amountIn) && balance.gte(amountIn)) {
        const to = walletStore.address
        const feeIn = String(bestRoute.feeIn ?? '2')
        const feeRate = 30
        const referrer = getFeeAddress(walletStore.address)
        let params: any = {
          srcToken: from_token,
          dstToken: to_token,
          srcReceiver: Number(path[0].router) !== 0 ? bestRoute.pair_path[0].pair : swapContract.address,
          dstReceiver: to,
          amount: amountIn,
          minReturnAmount: '1',
          feeIn: feeRate > 0 ? feeIn : '2',
          // 平台收费费率
          feeRate: feeRate,
          // 平台收费地址
          feeTo: getFeeAddress(walletStore.address),
          // 用户上级返佣比率
          receiveRate: 0,
          // 用户上级返佣地址
          referrer: referrer,
          path: path,
          routerPath: []
        }
        if (UniChainsV4?.includes(chain)) {
          params = {
            srcToken: from_token,
            dstToken: to_token,
            amount: amountIn,
            minReturnAmount: '1',
            feeIn: feeRate > 0 ? feeIn : '100',
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
        const value = from_token === NATIVE_TOKEN ? amountIn : '0'
        const amountOut = res?.[routerPath.length - 1]
        try {
          const realAmountOut = new BigNumber(await swapContract?.[getSwapMethod(chain)]?.staticCall(params, { value }))
          totalTax = Number(((10000 - realAmountOut.times(10000).div(amountOut).toNumber() - feeRate) / 100).toFixed(2)) || 0
          if (totalTax > 0) {
            routerPath[routerPath.length - 1].amount = realAmountOut.toString()
          }
          if ((bestRoute.total_sell_tax || 0) > 0) {
            rate = 2
            if (chain === 'arbitrum') {
              rate = 4
            } else if (chain === 'eth') {
              rate = 2.3
            } else if (chain === 'optimism') {
              rate = 4.5
            } else if (chain === 'base') {
              rate = 4.5
            }
          }
          // gas = await swapContract.estimateGas.swapPlus(params, { value })
          const gas = new BigNumber('360000')
          const d = routerPath[routerPath.length - 1]?.decimals
          const nativePrice1 = new BigNumber(nativePrice.toString())
          const toPrice = new BigNumber(bestRoute.to_price.toString())
          const gasAmount = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).times(rate).div(toPrice).times(10 ** (d - 18)).toFixed(0)
          gasU = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).times(rate).div(10 ** 18).toFixed()
          // console.log('gasPrice', gasPrice.toString())
          // console.log('gas', gas.toString())
          // console.log('gas $', gasU)
          // console.log('nativePrice', nativePrice)
          // console.log('toPrice', toPrice.toString())
          // console.log('realAmountOut', realAmountOut.toString())
          // console.log('gasAmount', gasAmount)
          if (gasAmount) {
            routerPath[routerPath.length - 1].amount = realAmountOut.minus(gasAmount).toString()
          }
        } catch (error) {
          console.log('callStatic swap error', error)
        }
      } else {
        totalTax = new BigNumber(bestRoute.total_buy_tax || 0).plus(bestRoute.total_sell_tax || 0) ||  new BigNumber(0)
        let gas = new BigNumber('360000')
        if ((bestRoute.total_sell_tax || 0) > 0) {
          gas = gas.times(2)
        } else if (totalTax.gt(0)) {
          gas = gas.times(1.5)
        }
        const amountOut = res?.[routerPath.length - 1]
        const toPrice = new BigNumber(bestRoute.to_price.toString())
        const d = routerPath[routerPath.length - 1]?.decimals
        const nativePrice1 = new BigNumber(nativePrice.toString())
        const gasAmount = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).div(toPrice).times(10 ** (d - 18)).toFixed(0)
        let realAmountOut = new BigNumber(amountOut.toString()).times(new BigNumber(100).minus(totalTax)).div(100)
        if (realAmountOut.gt(gasAmount)) {
          realAmountOut = realAmountOut.minus(gasAmount)
        }
        gasU = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).times(rate).div(10 ** 18).toFixed()
        // console.log('gasPrice', gasPrice.toString())
        // console.log('gas', gas.toString())
        // console.log('gas $', gasU)
        // console.log('nativePrice', nativePrice)
        // console.log('toPrice', toPrice.toString())
        // console.log('realAmountOut', realAmountOut.toString())
        // console.log('gasAmount', gasAmount)
        routerPath[routerPath.length - 1].amount = realAmountOut.toFixed(0)
        // let amountOut = res?.[routerPath.length - 1]
        // let toPrice = new BigNumber(bestRoute.to_price.toString())
        // let d = routerPath[routerPath.length - 1]?.decimals
        // let gasAmount = new BigNumber(fee).times(10 ** d).div(toPrice) || 0
        // let realAmountOut = new BigNumber(amountOut.toString()).times(new BigNumber(100).minus(totalTax)).div(100)
        // if (realAmountOut.gt(gasAmount)) {
        //   realAmountOut = realAmountOut.minus(gasAmount)
        // }
        // console.log('totalTax', totalTax.toFixed())
        // console.log('gasAmount', gasAmount.toFixed(0))
        // console.log('amountOut', amountOut.toString())
        // console.log('realAmountOut', realAmountOut.toFixed(0))
        // routerPath[routerPath.length - 1].amount = realAmountOut.toFixed(0)
      }
      routerPath = routerPath.map((i: { isETH: boolean; address: string }) => {
        return {
          ...i,
          address: i.isETH ? NATIVE_TOKEN : i.address
        }
      })
      routerPath[0].price = bestRoute.from_price
      routerPath[routerPath.length - 1].price = bestRoute.to_price
      return {routerPath, routerPairPath: path, ...bestRoute, totalTax: Math.max(Number(totalTax.toFixed()), 0), isAmountOut: false, gas: gas.toString(), gasU: gasU}
    })
  } else if (amountOut) {
    console.log('amountOut')
    return QuoteContract.getAmountsIn.staticCall(path, amountOut).then(async (res: any[]) => {
      let routerPath = bestRoute.token_path.map((i: any, k: number)=> ({ ...i, amount: res[k].toString()}))
      if (fromIsETH) {
        routerPath[0].isETH = fromIsETH
        routerPath[0].symbol = mainName
      }
      if (toIsETH) {
        routerPath[routerPath.length - 1].isETH = toIsETH
        routerPath[routerPath.length - 1].symbol = mainName
      }
      const amountIn = res?.[0]
      let totalTax: number | BigNumber = 0
      if (allowanceAmount.gte(amountIn) && balance.gte(amountIn)) {
        const to = walletStore.address
        const feeIn = String(bestRoute.feeIn ?? '2')
        const feeRate = 30
        const referrer = getFeeAddress(walletStore.address)
        const receiveRate = 0
        const params = {
          srcToken: from_token,
          dstToken: to_token,
          srcReceiver: Number(path[0].router) !== 0 ? bestRoute.pair_path[0].pair : swapContract.address,
          dstReceiver: to,
          amount: balance.toString(),
          minReturnAmount: amountOut,
          feeIn: feeRate > 0 ? feeIn : '2',
          // 平台收费费率
          feeRate: feeRate,
          // 平台收费地址
          feeTo: referrer,
          // 用户上级返佣比率
          receiveRate: FeeChainsRegExp.test(chain) ? receiveRate : 0,
          // 用户上级
          referrer: referrer,
          path: path,
          routerPath: []
        }
        const value = from_token === NATIVE_TOKEN ? params.amount : '0'
        try {
          const realAmountIn = new BigNumber(await swapContract.exactOutput.staticCall(params, { value }))
          totalTax = Number(((10000 - amountIn.times(10000).div(realAmountIn).toNumber() - feeRate) / 100).toFixed(2)) || 0
          if (totalTax > 0) {
            routerPath[0].amount = realAmountIn.toString()
          }
          if ((bestRoute.total_sell_tax || 0) > 0) {
            rate = 2
            if (chain === 'arbitrum') {
              rate = 4
            } else if (chain === 'eth') {
              rate = 2.3
            } else if (chain === 'optimism') {
              rate = 4.5
            } else if (chain === 'base') {
              rate = 5
            }
          }
          // gas = await swapContract.estimateGas.exactOutput(params, { value })
          const gas = new BigNumber('360000')
          const d = routerPath[0]?.decimals
          const nativePrice1 = new BigNumber(nativePrice.toString())
          const fromPrice = new BigNumber(bestRoute.from_price.toString())
          const gasAmount = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).times(rate).div(fromPrice).times(10 ** (d - 18)).toFixed(0)
          gasU = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).times(rate).div(10 ** 18).toFixed()
          // console.log('gasPrice', gasPrice.toString())
          // console.log('gas', gas.toString())
          // console.log('gas $', gasU)
          // console.log('nativePrice', nativePrice)
          // console.log('fromPrice', fromPrice.toString())
          // console.log('realAmountIn', realAmountIn.toString())
          // console.log('gasAmount', gasAmount)
          if (gasAmount) {
            routerPath[0].amount = realAmountIn.plus(gasAmount).toString()
          }
        } catch (error) {
          console.log('callStatic swap error', error)
        }
      } else {
        totalTax = new BigNumber(bestRoute.total_buy_tax || 0).plus(bestRoute.total_sell_tax || 0) ||  new BigNumber(0)
        // let fee = limitContractsFee[chain] ?? 1
        // if ((bestRoute.total_sell_tax || 0) > 0) {
        //   fee = fee * 2
        // } else if (totalTax.gt(0)) {
        //   fee = fee * 1.5
        // }
        let gas = new BigNumber('360000')
        if ((bestRoute.total_sell_tax || 0) > 0) {
          gas = gas.times(2)
        } else if (totalTax.gt(0)) {
          gas = gas.times(1.5)
        }
        if (chain === 'arbitrum') {
          gas = gas.times(3.5)
        }
        if (chain === 'optimism') {
          gas = gas.times(4)
        }
        if (chain === 'base') {
          gas = gas.times(4.5)
        }
        const amountIn = res?.[0]
        const d = routerPath[0]?.decimals
        const nativePrice1 = new BigNumber(nativePrice.toString())
        const fromPrice = new BigNumber(bestRoute.from_price.toString())
        const gasAmount = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).div(fromPrice).times(10 ** (d - 18)).toFixed(0)
        const realAmountIn = new BigNumber(amountIn.toString()).div(new BigNumber(100).minus(totalTax)).times(100).plus(gasAmount)
        gasU = new BigNumber(gasPrice.toString()).times(nativePrice1).times(gas.toString()).div(10 ** 18).toFixed()
        // console.log('gasPrice', gasPrice.toString())
        // console.log('gas', gas.toString())
        // console.log('gas $', gasU)
        // console.log('nativePrice', nativePrice)
        // console.log('fromPrice', fromPrice.toString())
        // console.log('realAmountIn', realAmountIn.toString())
        // console.log('gasAmount', gasAmount)
        routerPath[0].amount = realAmountIn.toFixed(0)
        // console.log('totalTax', totalTax.toFixed())
        // console.log('gasAmount', gasAmount.toFixed(0))
        // console.log('amountIn', amountIn.toString())
        // console.log('realAmountIn', realAmountIn.toFixed(0))
        // routerPath[0].amount = realAmountIn.toFixed(0)
      }
      routerPath = routerPath.map((i: { isETH: any; address: string }) => {
        return {
          ...i,
          address: i.isETH ? NATIVE_TOKEN : i.address
        }
      })
      routerPath[0].price = bestRoute.from_price
      routerPath[routerPath.length - 1].price = bestRoute.to_price
      return {routerPath, routerPairPath: path, ...bestRoute, totalTax: Math.max(Number(totalTax.toFixed()), 0), isAmountOut: true, gas: gas.toString(), gasU: gasU}
    })
  } else {
    return Promise.resolve({routerPath: [], routerPairPath: []})
  }
}

export function createSolanaLimitOrder(data: {
    maker: string; payer: string; params: {
      makingAmount: any // 1000000 => 1 USDC if inputToken.address is USDC mint
      takingAmount: any; expiredAt: string | undefined
    }; inputMint: any; outputMint: any; computeUnitPrice: string
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

export async function signAndSendSolanaBs64Transaction(bs64Transaction: string, baseSinger = null) {
  const transaction = VersionedTransaction.deserialize(Buffer.from(bs64Transaction, 'base64'))
  const connection = getSolanaConnection()
  const addressLookupTableAccounts = await Promise.all(
    transaction.message.addressTableLookups.map(async (lookup) => {
      return new AddressLookupTableAccount({
        key: lookup.accountKey,
        state: AddressLookupTableAccount.deserialize(await connection.getAccountInfo(lookup.accountKey).then((res: any) => res.data)),
      })
    }))
  const message = TransactionMessage.decompile(transaction.message,{addressLookupTableAccounts: addressLookupTableAccounts})
  message.instructions = await determineComputeBudget(message.instructions)
  transaction.message = message.compileToV0Message(addressLookupTableAccounts)
  const hash = await configureAndSendCurrentTransaction(
    transaction,
    baseSinger
  )
  return {
    hash: hash,
    wait: () => confirmTransaction(hash)
  }
}

export async function signAndSendSolanaLimitBs64Transaction(bs64Transaction: string, baseSinger = null) {
  const transaction = VersionedTransaction.deserialize(Buffer.from(bs64Transaction, 'base64'))
  const hash = await configureAndSendCurrentTransaction(
    transaction,
    baseSinger
  )
  return {
    hash: hash,
    wait: () => confirmTransaction(hash)
  }
}

export async function createSolanaLimitOrderTx(params: { fromToken: any; fromAmount: any; toToken: any; toAmount: any; expiredAt: any }, account = useWalletStore().address) {
  const {fromToken, fromAmount, toToken, toAmount, expiredAt} = params
  // let { referralTokenAccountPubKey, referralTokenAccount } = await getReferralTokenAccountPubKey(toToken, 'AsNtXWG17G4QXxqSMp5kXUN7CziGxQnMt9MoVWiLiR3Z').catch(() => {})
  // let referralParams = referralTokenAccount ? {referralAccount: referralTokenAccountPubKey.toString(), referralName: 'AveSwap'} : {}
  // let base = Keypair.generate()
  const params1 = {
    maker: account,
    payer: account,
    params: {
      makingAmount: fromAmount, // 1000000 => 1 USDC if inputToken.address is USDC mint
      takingAmount: toAmount,
      expiredAt: expiredAt ? String(expiredAt) : undefined, // new Date().valueOf() / 1000,
    },
    inputMint: fromToken,
    outputMint: toToken,
    computeUnitPrice: 'auto',
    // base: base.publicKey.toString(),

    // referralAccount and name are both optional
    // provide both to get referral fees
    // more details in the section below
    // referralAccount: '7kRfYgbpichh83KfYGubHrNrzNukesSzgD4xvf6CcB5D',
    // referralName: "AveAi"
    // ...referralParams
  }
  console.log('params1', params1)
  return createSolanaLimitOrder(params1).then(res => {
    console.log('res', res)
    const tx = res.transaction
    return {
      result: res,
      send: () => signAndSendSolanaLimitBs64Transaction(tx)
    }
  })
}

export async function submitLimitOrder(maker: string, fromToken: string, fromAmount: string, toToken: string, minReturn: string, toAmount: string, targetToken: string, targetLimitPrice: string | number, orderType: number, triggerPrice: string | number, currentPrice: string | number, salt = Date.now(), chain = useWalletStore().chain) {
  // "function depositEth(address toToken, uint256 minReturn, uint256 salt) payable"
  const id = keccak256(AbiCoder.defaultAbiCoder().encode(['address', 'address', 'uint256', 'address', 'uint256', 'uint256'], [maker, fromToken, fromAmount, toToken, minReturn, salt]))
  const walletStore = useWalletStore()
  const _signer = await getSigner()
  if (fromToken === NATIVE_TOKEN) {
    const LimitContract = new Contract(LimitContracts[chain], LimitABI, _signer)
    return LimitContract.depositEth.estimateGas(toToken, minReturn, salt, {value: fromAmount}).then(res => LimitContract.depositEth(toToken, minReturn, salt, {value: fromAmount, gasLimit: res.toString()}).then(res => {
      return res.wait()
    }).then(res => {
      console.log('----submit Limit order----', res)
      const data = {
        id,
        fromToken,
        fromAmount,
        toToken,
        toAmount,
        minReturn,
        targetToken,
        targetLimitPrice,
        salt,
        signature: '',
        maker,
        orderType,
        triggerPrice,
        currentPrice
      }
      recordTransaction({
        chain: chain,
        destination: 'wallet rpc',
        type: 20,
        order_id: 'aveswap_' + id,
        status: 1,
        wallet: walletStore.address,
        out_token: toToken,
        out_amount:  toAmount,
        in_token: fromToken,
        in_amount: fromAmount
      })
      return addLimitOrder(data)
    }))
  }
  const idBytes = getBytes(id)

  return _signer?.signMessage(idBytes).then(res => {
    const data = {
      id,
      fromToken,
      fromAmount,
      toToken,
      toAmount,
      minReturn,
      targetToken,
      targetLimitPrice,
      salt,
      signature: res,
      maker: maker,
      orderType,
      triggerPrice,
      currentPrice
    }
    return addLimitOrder(data)
  })
}

export function addLimitOrder({id, fromToken, fromAmount, toToken, toAmount, maker, salt, signature, minReturn, targetToken, targetLimitPrice, orderType, triggerPrice, currentPrice }: {
  id: string
  fromToken: string
  fromAmount: string | number
  toToken: string
  toAmount: string | number
  maker: string
  salt: number
  signature: string
  minReturn: string | number
  targetToken: string
  targetLimitPrice: string | number
  orderType?: number
  triggerPrice?: string | number
  currentPrice?: string | number
}, chain = useWalletStore().chain) {
  orderType = orderType || 0
  triggerPrice = triggerPrice || targetLimitPrice
  currentPrice = currentPrice || 0
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/limitorder/add', {
    method: 'post',
    body: {
      order_id: id,
      chain,
      from_token: fromToken,
      from_amount: fromAmount,
      to_token: toToken,
      to_amount: toAmount,
      maker: maker,
      salt,
      signature,
      to_min_amount: minReturn,
      target_token: targetToken,
      target_limit_price: targetLimitPrice,
      // 订单类型 order_type 0 限价单， 1 止盈止损
      order_type: orderType,
      // 触发价格 trigger_price
      trigger_price: triggerPrice,
      // 当前价格
      current_price: currentPrice,
    }
  })
}


export function getLimitOrder(data: { chain?: string, maker?: string}, pageNO = 1, pageSize = 1000) {
  const walletStore = useWalletStore()
  const chain = data.chain || walletStore.chain || ''
  const maker = data.maker || walletStore.address || ''
  if (!chain || !maker) {
    return Promise.resolve([])
  }
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/limitorder', {
    method: 'get',
    query: {
      pageNO,
      pageSize,
      ...{
        maker: maker,
        chain: chain,
        ...data
      }
    }
  }).then(res => Promise.resolve(res?.data?.data || res?.data || res || []))
}

// "function cancelOrder(address fromToken, uint256 fromAmount, address toToken, uint256 minReturn, uint256 salt)",
export async function cancelLimitOrder({fromToken, fromAmount, toToken, minReturn, salt, id, order_id}: { fromToken: string; fromAmount: string | number; toToken: string; minReturn: string | number; salt: number | string; id: string; order_id: string }, chain = useWalletStore().chain) {
  const _signer = await getSigner()
  const LimitContract = new Contract(LimitContracts[chain], LimitABI, _signer)
  return LimitContract.cancelOrder.estimateGas(fromToken, fromAmount, toToken, minReturn, salt).then(res => {
    return LimitContract.cancelOrder(fromToken, fromAmount, toToken, minReturn, salt, { gasLimit: res.toString() }).then(res => {
      return res.wait()
    }).then(res => {
      console.log('----submit Limit order----', res)
      return cancelLimitOrderApi(id, order_id, chain)
    })
  })
}

export function cancelLimitOrderApi(id: string, order_id: string, chain = useWalletStore().chain) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/limitorder/cancel', {
    method: 'post',
    body: {
      id: id,
      chain: chain,
      order_id: order_id
    }
  })
}

export async function cancelSolanaLimitOrderTxV1(orderId: string, account = useWalletStore().address) {
  const params1 = {
    owner: account,
    feePayer: account,
    orders: [orderId]
  }
  return cancelSolanaLimitOrderV1(params1).then(res => {
    console.log('res', res)
    const tx = res.tx
    return signAndSendSolanaBs64Transaction(tx)
  })
}

export async function cancelSolanaLimitOrderTx(orderId: string, account = useWalletStore().address) {
  const params1 = {
    maker: account,
    orders: [orderId],
    computeUnitPrice: 'auto',
  }
  return cancelSolanaLimitOrder(params1).then(res => {
    console.log('res', res)
    const tx = res.transactions[0]
    return signAndSendSolanaLimitBs64Transaction(tx)
  })
}

export function cancelSolanaLimitOrderV1(data: { owner: string; feePayer: string; orders: string[] }) {
  const { $api } = useNuxtApp()
  return $api('https://jup.ag/api/limit/v1/cancelOrders', {
    method: 'post',
    body: data
  })
}

export function cancelSolanaLimitOrder(data: { maker: any; orders: any[]; computeUnitPrice: string }) {
  return aveRequestProxy({
    method: 'post',
    url: 'https://api.jup.ag/trigger/v1/cancelOrders',
    data: data
  })
}

