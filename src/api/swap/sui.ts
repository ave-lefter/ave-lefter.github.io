import { getQuote, buildTx } from '@7kprotocol/sdk-ts'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'
import { Transaction } from '@mysten/sui/transactions'
import { NATIVE_TOKEN } from '@/utils/constants'
import BigNumber from 'bignumber.js'


// https://0ftrfsdb.xyz/aveswap/v1/sui/quote?fromToken=0x2::sui::SUI&toToken=0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC&amountIn=100000000
export function naviSuiQuote(params: { fromToken: string | undefined; toToken: string | undefined; amountIn?: string; tokenIn?: string; tokenOut?: string; slippage?: number }) {
  const { $api } = useNuxtApp()
  return $api('/aveswap/v1/sui/quote', {
    method: 'get',
    query: params,
  })
}

export function naviSuiBuildTx(data: {
    coinFrom: any; coinTo: any; amountIn: number; slippage: any; userAddress: any; serviceFee: {
      receiverAddress: string; fee: number // 0.5%
      coinType: string // 默认 vSui
    } | {
      receiverAddress: string; fee: number // 0.5%
      coinType: any // 默认 vSui
    }
  }) {
  // /aveswap/v1/sui/swap'
  const { $api } = useNuxtApp()
  return $api('/aveswap/v1/sui/swap', {
    method: 'post',
    body: data,
  })
}

export function getSuiQuote(data: {
  fromToken?: string
  toToken?: string
  amountIn: string
  tokenIn?: string
  tokenOut?: string
  slippage?: number
} = {
  amountIn: '0'
}) {
  const { tokenIn, tokenOut } = data
  const walletStore = useWalletStore()
  const data1 = {
    ...data,
    fromToken: tokenIn === NATIVE_TOKEN ? '0x2::sui::SUI' : tokenIn,
    toToken: tokenOut === NATIVE_TOKEN ? '0x2::sui::SUI' : tokenOut,
  }
  const amountIn = Number(data1.amountIn || 0)
  const feeTokenList = ['0x2::sui::SUI', '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN', '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN', '0xbc732bc5f1e9a9f4bdf4c0672ee538dbf56c161afe04ff1de2176efabdf41f92::suai::SUAI']
  const tokens = [data1.fromToken, data1.toToken]
  const coinType = feeTokenList.find(item => tokens.includes(item)) || tokens[0] || '0x2::sui::SUI'
  return naviSuiBuildTx({
    coinFrom: data1.fromToken,
    coinTo: data1.toToken,
    amountIn: amountIn,
    slippage: data1.slippage,
    userAddress: walletStore.address,
    serviceFee: {
      receiverAddress: '0x98a8d3440457157ca22ab3f5d571ac64549938c30f3a8fc9426c068e099c03e4',
      fee: 0.005, // 0.5%
      coinType: coinType // 默认 vSui
    },
  }).then(() => {
    return naviSuiQuote(data1)
  }).catch((err: any) => {
    console.log(err)
    return get7kSuiQuote(data1)
  })
}

export function get7kSuiQuote(data: {
  fromToken?: string
  toToken?: string
  amountIn: string
  tokenIn?: string
  tokenOut?: string
} = {
  amountIn: '0'
}) {
  const { tokenIn, tokenOut } = data
  const data1 = {
    ...data,
    tokenIn: tokenIn === NATIVE_TOKEN ? '0x2::sui::SUI' : (tokenIn || ''),
    tokenOut: tokenOut === NATIVE_TOKEN ? '0x2::sui::SUI' : (tokenOut || ''),
  }
  return getQuote({
    // tokenIn: "0x2::sui::SUI",
    // tokenOut:
    //   "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
    // amountIn: "1000000000",
    ...data1
  })
}

export async function buildSuiTx(data: { quoteResponse: any; slippage: any }, account = useWalletStore().address) {
  const quote = data.quoteResponse
  if (quote.returnAmount && quote.returnAmountWithDecimal) {
    return build7kSuiTx(data, account)
  }
  const amountIn = Number(quote.amount_in || 0)
  const feeTokenList = ['0x2::sui::SUI', '0xc060006111016b8a020ad5b33834984a437aaa7d3c74c18e09a95d48aceab08c::coin::COIN', '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN', '0xbc732bc5f1e9a9f4bdf4c0672ee538dbf56c161afe04ff1de2176efabdf41f92::suai::SUAI']
  const tokens = [quote.from_token.address, quote.to_token.address]
  const coinType = feeTokenList.find(item => tokens.includes(item)) || tokens[0] || '0x2::sui::SUI'
  return naviSuiBuildTx({
    coinFrom: quote.from_token.address,
    coinTo: quote.to_token.address,
    amountIn,
    slippage: data.slippage,
    userAddress: account,
    serviceFee: {
      receiverAddress: '0x98a8d3440457157ca22ab3f5d571ac64549938c30f3a8fc9426c068e099c03e4',
      fee: 0.005, // 0.5%
      coinType: coinType // 默认 vSui
    },
  }).then(res => {
    console.log('naviSuiBuildTx', res)
    const tx = Transaction.from(Buffer.from(res.bytes, 'base64'))
    return {
      tx: tx
    }
  })
}

export function build7kSuiTx(data: { quoteResponse: any; slippage: any }, account = useWalletStore().address) {
  return buildTx({
    // quoteResponse,
    accountAddress: account,
    // slippage: slippage || 0.01, // 1%

    commission: {
      // partner: '0xb2f0c8a5ca463041b9e006e94ad9732e80cc1dff9e0ebab747a2592b3aac02c4',
      partner: '0x98a8d3440457157ca22ab3f5d571ac64549938c30f3a8fc9426c068e099c03e4',
      commissionBps: 50, // 0 means no fee, 1bps = 0.01%, for example, 20bps = 0.2%
    },
    ...data
  })
}


export function sui_waitForTransaction(digest: any) {
  const client = new SuiClient({ url: getFullnodeUrl('mainnet') })
  console.log(digest)
  return client.waitForTransaction({
    // pollInterval: 3000,
    digest: digest,
    options: {
      showBalanceChanges: true,
    }
  })
}

 export function sui_getBalanceChanges({ txInfo, balanceChanges }: { txInfo: any; balanceChanges: any }) {
  const balanceChange: Record<string, any> = {}
  balanceChanges?.forEach((item: { owner: { AddressOwner: any }; coinType: string; amount: any }) => {
    if (item?.owner?.AddressOwner === txInfo.wallet_address) {
      const coinType = item.coinType === '0x2::sui::SUI' ? NATIVE_TOKEN : item.coinType
      if (coinType === txInfo.from_address) {
        balanceChange.from_amount = formatUnits(new BigNumber(item?.amount || 0).abs().toFixed(0), txInfo.from_decimals)
      }
      if (coinType === txInfo.to_address) {
        balanceChange.to_amount = formatUnits(new BigNumber(item?.amount || 0).abs().toFixed(0), txInfo.to_decimals)
      }
    }
  })
  return balanceChange
}
