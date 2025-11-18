import TonWeb from 'tonweb'
import { HttpClient, Api, type JettonBalance, type Transaction, type AccountEvent } from 'tonapi-sdk-js'
import { getTokensPrice } from '@/api/token'
import { createSequentialThrottle } from '@/utils/createSequentialThrottle'
import BigNumber from 'bignumber.js'
import { TonConnectUI, THEME, type Locales } from '@tonconnect/ui'
import { getTokensPnl } from '~/api/bot'

const { JettonMinter, JettonWallet} = TonWeb.token.jetton

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'))

const TonReferAddress = 'UQC1SFzvJijL20wDMc-dvJqHQcWZE7wQcRZxM26xP4usCy68'

const httpClient = new HttpClient({
  baseUrl: 'https://tonapi.io',
  baseApiParams: {
    headers: {
        // Authorization: `Bearer ${YOUR_TOKEN}`,
        'Content-type': 'application/json'
    }
  }
})
// Initialize the API client

const client = new Api(httpClient)


export async function getTonWallets() {
  console.log('getTonWallets')
  const wallets = await TonConnectUI.getWallets()
  console.log('ton wallets', wallets)
}

let tonConnectUI: TonConnectUI | null = null
let _buttonRootId = 'ton-connect-btn'
export function getTonConnectUI(buttonRootId: string = 'ton-connect-btn') {
  if (!tonConnectUI) {
    tonConnectUI = new TonConnectUI({
      manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
      buttonRootId: buttonRootId,
      // actionsConfiguration: {
      //   modals: [],
      //   notifications: []
      // }
    })
  }
  tonConnectUI.uiOptions = {
    // language: useLocaleStore().locale,
    uiPreferences: {
      theme: useThemeStore().theme === 'dark' ? THEME.DARK : THEME.LIGHT
    }
  }
  return tonConnectUI
}


export async function connectTonWallet(buttonRootId: string = 'ton-connect-btn') {
  const _tonConnectUI = getTonConnectUI(buttonRootId)
  return _tonConnectUI.connectWallet().then(async walletAndWalletInfo => {
    console.log('walletAndWalletInfo', walletAndWalletInfo)
    if (walletAndWalletInfo?.account?.address) {
      const walletStore = useWalletStore()
      walletStore.address = toBase64Address(walletAndWalletInfo?.account?.address, false) || walletAndWalletInfo?.account?.address
      walletStore.chain = 'ton'
      walletStore.provider = _tonConnectUI
      walletStore.walletName = walletAndWalletInfo?.name || ''
      bindTonWalletEvent()
    }
    return walletAndWalletInfo
  })
  // return new Promise((resolve, reject) => {
  //   const unsubscribe = _tonConnectUI.onStatusChange(
  //     walletAndWalletInfo => {
  //       console.log('walletAndWalletInfo', walletAndWalletInfo, _tonConnectUI)
  //       if (walletAndWalletInfo?.account?.address) {
  //          const walletStore = useWalletStore()
  //           walletStore.address = walletAndWalletInfo?.account?.address
  //           walletStore.chain = 'ton'
  //           walletStore.provider = _tonConnectUI
  //           walletStore.walletName = walletAndWalletInfo?.name || ''
  //         resolve(walletAndWalletInfo)
  //         bindTonWalletEvent()
  //       }
  //       unsubscribe()
  //   }, err => {
  //     reject(err)
  //   })
  // })
}

export function initTonWallet() {
  if (!document.getElementById('ton-connect-btn')) {
    document.body.insertAdjacentHTML('beforeend', '<div id="ton-connect-btn" style="display: none;"></div>')
  }
  setTimeout(() => {
    const walletStore = useWalletStore()
    const tonConnectUI = getTonConnectUI()
    tonConnectUI?.connectionRestored.then(() => {
      if (tonConnectUI.connected && tonConnectUI?.account?.address) {
        console.log('tonConnectUI', tonConnectUI)
        walletStore.provider = tonConnectUI
        walletStore.address = toBase64Address(tonConnectUI?.account?.address, false) || tonConnectUI?.account?.address
        walletStore.chain = 'ton'
        bindTonWalletEvent()
      } else {
        resetWallet()
      }
    })

  }, 0)
}

export function bindTonWalletEvent() {
  const _tonConnectUI = getTonConnectUI(_buttonRootId)
  _tonConnectUI.onStatusChange(
    walletAndWalletInfo => {
      console.log('walletAndWalletInfo', walletAndWalletInfo)
      if (walletAndWalletInfo?.account?.address) {
        const walletStore = useWalletStore()
        walletStore.address = toBase64Address(walletAndWalletInfo?.account?.address, false)
      } else {
        resetWallet()
      }
    }
  )
}

function resetWallet() {
  const walletStore = useWalletStore()
  walletStore.provider = null
  walletStore.address = ''
  walletStore.chain = ''
}

export function toBase64Address(address: string, isBounceable = true) {
  const Address = TonWeb.utils.Address
  return new Address(address).toString(true, true, isBounceable, false)
}

export function toTonAddress(address: string) {
  const Address = TonWeb.utils.Address
  return new Address(address).toString(false, false, false, false)
}

function _getTonBalance(address: string, type: 0): Promise<number>
function _getTonBalance(address: string, type: 1): Promise<JettonBalance[]>
function _getTonBalance(address: string, type: 0 | 1) {
  if (type === 0) {
    return client.accounts.getAccount(address).then(async res => res?.balance || 0)
  } else {
    return client.accounts.getAccountJettonsBalances(address).then(async res => res?.balances)
  }
}

const getTonBalance = createCacheRequest(createSequentialThrottle(_getTonBalance), 1500) as unknown as typeof _getTonBalance

export const getTonNativeBalance = (address: string) => {
  return getTonBalance(address, 0)
}

export const getTonApiBalances = (address: string) => {
  return getTonBalance(address, 1)
}

export async function getTonTokenList(address: string, _token = 'all', isGetPnL = false) {
  let tokens: JettonBalance[] = []
  let tonBalance = 0
  if (_token !== 'all') {
    if (_token === NATIVE_TOKEN || _token === 'TON') {
      tonBalance = await getTonNativeBalance(address)
    } else {
      tokens = await getTonApiBalances(address)
    }
  } else {
    tonBalance = await getTonNativeBalance(address)
    tokens = await getTonApiBalances(address)
  }

  let tokenIds = tokens.map(i => toBase64Address(i?.jetton?.address) + '-' + 'ton')
  if (_token && _token !== 'all' && _token !== NATIVE_TOKEN && _token !== 'TON') {
    tokenIds = tokenIds?.filter(i => i === (_token + '-' + 'ton'))
  }
  let prices = await getTokensPrice([`${NATIVE_TOKEN}-ton`, ...tokenIds])
  let tokenList = [{master_address: NATIVE_TOKEN, balance: tonBalance, jetton: {decimals: 0, symbol: '', image: '', address: ''}}, ...tokens]?.map((i, k) => {
    let symbolInfo = prices[k]
    let tokenAddress = ('master_address' in i && i?.master_address === NATIVE_TOKEN) ? NATIVE_TOKEN : toBase64Address(i?.jetton?.address)
    let decimals = tokenAddress === NATIVE_TOKEN ? 9 : (i?.jetton?.decimals || symbolInfo?.decimal || 0)
    let balance = formatUnits(i?.balance || 0, decimals)
    return {
      symbol: tokenAddress === NATIVE_TOKEN ? 'TON' : (i?.jetton?.symbol || symbolInfo?.symbol) || '',
      decimals: decimals,
      initBalance: i.balance,
      balance: balance,
      address: tokenAddress,
      token: tokenAddress,
      chain: 'ton',
      id: tokenAddress + '-ton',
      price: symbolInfo?.current_price_usd || 0,
      current_price_usd: symbolInfo?.current_price_usd || 0,
      logo_url: symbolInfo?.logo_url || i?.jetton?.image || '',
      balance_usd: new BigNumber(balance || 0).times(symbolInfo?.current_price_usd || 0).toFixed(),
      risk_score: 55,
      risk_level: 0,
      is_hidden: false
    }
  })
  if (_token && _token !== 'all') {
    tokenList = tokenList?.filter?.(i => i.token === _token) || []
  }
  if (isGetPnL) {
    try {
      let _tokens = tokenList.map(i => {
        return {
          token: i.token || i.address,
          balance: i.balance || '0'
        }
      })
      let nativeIndex = tokenList.findIndex(i => i.token === NATIVE_TOKEN)
      if (nativeIndex >= 0) {
        _tokens.splice(nativeIndex, 1)
      }
      let pnls = await getTokensPnl({
        tokens: _tokens,
        chain: 'ton',
        walletAddress: address,
        days: 30
      })
      if (nativeIndex >= 0) {
        pnls.splice(nativeIndex, 0, {
          ...tokenList[nativeIndex],
        } as any)
      }
      pnls = pnls?.map?.((res, k) => {
        let item = tokenList[k]
        return {
          ...res,
          total_profit: res?.profit || '--',
          unrealized_profit: res?.profitUnrealized || '0',
          realized_profit: res?.profitUnrealized || '0',
          balance_amount: item?.balance || '0',
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
      tokenList = tokenList?.map?.((i, k) => ({...i, ...(pnls[k] || {})}))
    } catch (err) {
      console.log(err)
    }
  }
  return tokenList
}

export async function getTonTokenBalance(address: string, token: string, type = 0) {
  let list = await getTonTokenList(address, token)
  let tokenInfo = list.find(i => i.address === token)
  if (type === 1) {
    return tokenInfo || {}
  }
  return tokenInfo?.initBalance || 0
}

export async function getTonWalletBalance({token, wallet}: {token: string; wallet: string}) {
  if (token === NATIVE_TOKEN || token === 'TON') {
    return getTonNativeBalance(wallet)
  } else {
    let tokens = await getTonApiBalances(wallet)
    return tokens?.find?.(i => toBase64Address(i?.jetton?.address) === token || token === i?.jetton?.address)?.balance || '0'
  }
}

export async function getTonTokenTransferMsg(swapInfo: { from_address: string; from_amount: string; from_decimals: number; to_address: string; to_amount: string; to_decimals: number }) {
  let feeMsg = null
  if (swapInfo?.from_address === NATIVE_TOKEN) {
    feeMsg = {
      address: TonReferAddress,
      amount: new BigNumber(swapInfo?.from_amount || '0').times(10 ** (swapInfo?.from_decimals || 0)).times(0.003).toFixed(0),
      // payload: null
    }
  } else if (swapInfo?.to_address === NATIVE_TOKEN) {
    feeMsg = {
      address: TonReferAddress,
      amount: new BigNumber(swapInfo?.to_amount || '0').times(10 ** (swapInfo?.to_decimals || 0)).times(0.003).toFixed(0),
      // payload: null
    }
  }
  return feeMsg
}

async function getTransactionByMessageHash(bocBase64: string) {
  let boc = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(bocBase64))
  let msgId = TonWeb.utils.bytesToHex(await boc.hash())
  return msgId
}

async function waitTonMsgTransaction(hash: string) : Promise<Transaction> {
  let Timer: string | number | NodeJS.Timeout | null | undefined = null
  let time = 0
  function getTransaction(hash: string): Promise<Transaction> {
    return new Promise((resolve, reject) => {
      if (time >= 300) {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        reject('Timeout')
        return
      }
      client.blockchain.getBlockchainTransactionByMessageHash(hash).then(res => {
        console.log(hash, res)
        if (res?.hash) {
          resolve(res)
        } else {
          if (Timer) {
            clearTimeout(Timer)
            Timer = null
          }
          reject('Swap fail')
        }
      }).catch(() => {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        Timer = setTimeout(async () => {
          time += 3
          try {
            let res = await getTransaction(hash)
            resolve(res)
          } catch (err) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            reject(err)
          }
        }, 3000)
      })
    })
  }

  await new Promise(resolve => setTimeout(resolve, 3000))
  return getTransaction(hash)
}



async function waitTonTransaction(hash: string): Promise<Transaction | AccountEvent> {
  const walletStore = useWalletStore()
  let Timer: string | number | NodeJS.Timeout | null | undefined = null
  let time = 0
  function getTransaction(hash: string): Promise<Transaction | AccountEvent> {
    return new Promise((resolve, reject) => {
      if (time >= 240) {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        reject('Timeout')
        return
      }
      try {
        client.accounts.getAccountEvent(walletStore.address, hash).then(res => {
          console.log(hash, res)
          if (res?.in_progress === false) {
            resolve(res)
          } else {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            Timer = setTimeout(async () => {
              time += 3
              try {
                let res = await getTransaction(hash)
                resolve(res)
              } catch (err) {
                if (Timer) {
                  clearTimeout(Timer)
                  Timer = null
                }
                reject(err)
              }
            }, 3000)
          }
        })
      } catch (err) {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        reject(err)
      }
    })
  }

  await new Promise(resolve => setTimeout(resolve, 3000))
  return getTransaction(hash)
}

export async function sendTonTransaction(messages: any[]) {
  const walletStore = useWalletStore()
  let from = walletStore.address || ''
  from = toTonAddress(from)
  let transaction = {
    messages,
    // network: '-239',
    from: from,
    validUntil: Date.now() + 4.5 * 60000
  }
  console.log('transaction', transaction)
  // let param = JSON.stringify(transaction)
  return (walletStore?.provider as TonConnectUI)?.sendTransaction?.(transaction).then(async res => {
    console.log('boc', res)
    // let hash = await getTonTransactions(store?.state?.currentAccount).then(async res => res?.events?.[0]?.event_id)
    let hash = await getTransactionByMessageHash(res?.boc)
    return {
      hash: hash,
      wait: () => waitTonMsgTransaction(hash).then(res => waitTonTransaction(res?.hash).then(async res => ({...res, hash})))
    }
  })
}

