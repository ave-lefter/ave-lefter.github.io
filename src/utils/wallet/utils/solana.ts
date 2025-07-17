import { PublicKey, VersionedTransaction, SystemProgram, AddressLookupTableAccount, TransactionMessage, ComputeBudgetProgram } from '@solana/web3.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction } from '@solana/spl-token'
import { getSolanaConnection, configureAndSendCurrentTransaction, confirmTransaction } from '../solana'
import { getSolanaRaydiumSwapTransaction } from '@/api/swap/solana'
import BigNumber from 'bignumber.js'

export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw new Error('TokenOwnerOffCurveError')

  const [address] = PublicKey.findProgramAddressSync(
      [owner.toBuffer(), programId.toBuffer(), mint.toBuffer()],
      associatedTokenProgramId
  )
  return address
}

export async function getRaydiumReferralTokenAccountPubKey(mint1: string, mint2: string = '') {
  const walletStore = useWalletStore()
  const publicKey = new PublicKey(walletStore.address)
    // || { publicKey: new PublicKey('7i2E4PiDc6Fp5s2bMqHdKjyCrTZML5ywHUvN1qf2WABr') }
  const referral = '7kRfYgbpichh83KfYGubHrNrzNukesSzgD4xvf6CcB5D'
  const referralMintTokens = ['So11111111111111111111111111111111111111112', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E', '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R']
  const mint = [mint1, mint2].find(i => referralMintTokens.includes(i))
  if (!mint || !referralMintTokens.includes(mint)) {
    return {
      transactionInstruction: null,
      referralTokenAccount: null
    }
  }
  const mintToken = new PublicKey(mint)
  const referralPubkey = new PublicKey(referral)
  const fromPubkey = publicKey
  const associatedTokenTo = await getAssociatedTokenAddress(
    mintToken,
    referralPubkey
  )
  const connection = getSolanaConnection()
  const referralTokenAccountInfo = await connection.getAccountInfo(associatedTokenTo)
  if (!referralTokenAccountInfo) {
    return {
      transactionInstruction: createAssociatedTokenAccountInstruction(
        fromPubkey,
        associatedTokenTo,
        referralPubkey,
        mintToken
      ),
      referralTokenAccount: associatedTokenTo,
      mint
    }
  } else {
    return {
      transactionInstruction: null,
      referralTokenAccount: associatedTokenTo,
      mint
    }
  }
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
  data?: any
}) {
  const { $api } = useNuxtApp()
  return $api('/v1api/v2/aveswap/aveswap_porxy', {
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

export function getSolanaPumpSwapTx(data: any) {
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

export async function addBlxTxTips(transaction: VersionedTransaction) {
  const currentAccount = useWalletStore().address
  const fromPubkey = new PublicKey(currentAccount)
  const ix = SystemProgram.transfer({
    fromPubkey: fromPubkey,
    toPubkey: new PublicKey('HWEoBxYs7ssKuudEjzjmpfJVX7Dvi7wescFsVx2L5yoY'),
    lamports: 2000000,
  })

  const connection = getSolanaConnection()
  const addressLookupTableAccounts = await Promise.all(
  transaction.message.addressTableLookups.map(async (lookup) => {
    return new AddressLookupTableAccount({
      key: lookup.accountKey,
      state: AddressLookupTableAccount.deserialize(await connection.getAccountInfo(lookup.accountKey).then((res: any) => res?.data)),
    })
  }))
  const message = TransactionMessage.decompile(transaction.message,{addressLookupTableAccounts: addressLookupTableAccounts})
  message.instructions = [...message.instructions, ix]
  transaction.message = message.compileToV0Message(addressLookupTableAccounts)
}


export async function getSolanaMoonshotSwapQuote(params: any) {
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
  if (localStorage.solanaProtection === 'true') {
    await addBlxTxTips(transaction1)
  }
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

export async function quoteSolanaRaydiumSwapApi(params: any) {
  // || { publicKey: new PublicKey('7i2E4PiDc6Fp5s2bMqHdKjyCrTZML5ywHUvN1qf2WABr') }
  const walletStore = useWalletStore()
  const publicKey = new PublicKey(walletStore.address || '')
  const inputToken = params.inputMint === NATIVE_TOKEN || params.inputMint === 'So11111111111111111111111111111111111111112' ? {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9
  } :  {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    mint: params.inputMint,
    decimals: params.inputDecimals
  }

  const outputToken = params.outputMint === NATIVE_TOKEN || params.outputMint === 'So11111111111111111111111111111111111111112' ? {
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9
  } : {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    mint: params.outputMint,
    decimals: params.outputDecimals
  }

  const slippageBps = {
    numerator: new BigNumber(params.slippageBps || 200).toFixed(0),
    denominator: '10000'
  }

  const inputTokenAmount = {
    numerator: params.amount
  }
  const { transactionInstruction, referralTokenAccount, mint } = await getRaydiumReferralTokenAccountPubKey(params.inputMint, params.outputMint)
  const feeConfig = {
    feeBps: '30',
    feeAccount: referralTokenAccount,
    feeFromOutput: mint === params.outputMint
  }
  const swapTransaction = await getSolanaRaydiumSwapTransaction({
    inputToken,
    outputToken,
    slippageBps,
    inputTokenAmount,
    walletPublicKey: walletStore.address || publicKey.toString(),
    feeConfig
  })

  if (swapTransaction?.transactionsToSend?.length > 1) {
    // 交易包含两笔子交易操作，尚未支持
    // i18n.global.t('swapTwoTransactionsNotSupported')
    return Promise.reject('Swap too large')
  }

  const swapTransactionBuf = Buffer.from(swapTransaction?.transactionsToSend?.[0], 'base64')
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf)
  const connection = getSolanaConnection()

  // await connection.simulateTransaction(transaction)
  if (transactionInstruction) {
    const addressLookupTableAccounts = await Promise.all(
      transaction.message.addressTableLookups.map(async (lookup) => {
        return new AddressLookupTableAccount({
          key: lookup.accountKey,
          state: AddressLookupTableAccount.deserialize(await connection.getAccountInfo(lookup.accountKey).then((res: any) => res?.data)),
        })
      }))
    const message = TransactionMessage.decompile(transaction.message,{addressLookupTableAccounts: addressLookupTableAccounts})
    message.instructions.unshift(transactionInstruction)
    transaction.message = message.compileToV0Message(addressLookupTableAccounts)
  }

  return {
    routeInfo: {
      amountOut: {amount: new BigNumber(swapTransaction?.amountOut)},
      minAmountOut: {amount: new BigNumber(swapTransaction?.minAmountOut)},
    },
    transaction,
    configureAndSendCurrentTransaction: async () => (configureAndSendCurrentTransaction(
      transaction,
      null
    ).then(async hash => ({
      hash: hash,
      wait: () => confirmTransaction(hash)
    })))
  }
}

export async function quoteSolanaRaydiumSwap(params: any) {
  const { $i18n } = useNuxtApp()
  try {
    const apiResult = await quoteSolanaRaydiumSwapApi(params)
    console.log('apiResult', apiResult)
    return apiResult
  } catch(err) {
    console.log('quoteSolanaRaydiumSwapApi', err)
    // 交易包含两笔子交易操作，尚未支持
    // i18n.global.t('swapTwoTransactionsNotSupported')
    if (err === 'Swap too large') {
      return Promise.reject($i18n.t('swapTwoTransactionsNotSupported'))
    } else {
      return Promise.reject(err)
    }
  }
}

export const referralPubkey = 'FcuNNCeR4ck7QDJDqnnMTfo4Kee5thq8qNE65Aj8RA5j'

export async function getReferralTokenAccountPubKey(mint: string) {
  const [ referralTokenAccountPubKey ] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('referral_ata'),
      new PublicKey(referralPubkey).toBuffer(), // your referral account public key
      new PublicKey(mint).toBuffer(), // the token mint, output mint for ExactIn, input mint for ExactOut.
    ],
    new PublicKey('REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3') // the Referral Program
  )
  const connection = getSolanaConnection()

  const referralTokenAccount = await connection.getAccountInfo(referralTokenAccountPubKey)
  console.log({ referralTokenAccountPubKey: referralTokenAccountPubKey.toString(), referralTokenAccount })
  return { referralTokenAccountPubKey, referralTokenAccount }
}

export async function determineComputeBudget(instructions: any) {
  const estimate = 1000000
  // try {
  //   estimate = await estimatePrioritizationFee(instructions)
  // } catch (e) {
  //   console.warn('Error estimating prioritization fee', e)
  // }
  console.log('estimate', estimate, estimate * 400000 / 10 ** 15, 'SOL')

  return [
    ComputeBudgetProgram.setComputeUnitLimit({
      units: 400000,
    }),
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: estimate,
    }),
    ...instructions,
  ]
}
