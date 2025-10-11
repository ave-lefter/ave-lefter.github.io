import { defineStore } from 'pinia'
import { useLocalStorage, useStorage } from '@vueuse/core'
import {
  refreshAccessToken as _refAcc,
  login,
  bot_getWalletsAllChain,
  bot_getWebConfig,
  bot_updateWebConfig,
  bot_getChainsTokenBalance,
  bot_getUserInfoByGuid,
  bot_getBundleAvailable,
  bot_getTokenBalance
} from '@/api/bot'
import { getTokensPrice  } from '@/api/token'
import { createCacheRequest } from '@/utils/cacheRequest'
import { tgLogin } from '@/utils/bot'
import { useBotSettingStore } from './botSetting'
import { deepMerge, evm_utils as utils ,getChainInfo } from '@/utils'
import { NATIVE_TOKEN } from '@/utils/constants'

type AddressItem = { chain: string; address: string; price?: number; balance?: string; decimals?: number; logo_url?: string };
const updateBalanceLoading: { [key: string]: boolean } = {}
const _refreshAccessToken = createCacheRequest(_refAcc, 3000)
export const useBotStore = defineStore('bot', () => {
  const walletStore = useWalletStore()
  const configStore = useConfigStore()
  const tokenStore = useTokenStore()
  const isSupportChains = ['eth', 'bsc', 'solana', 'base', 'xlayer'] as const
  const isSupportEvmChains = computed(() => {
    const chainConfig = configStore.chainConfig
    const isEvmChainWallet = getChainInfo(walletStore.chain)?.vm_type === 'evm'
    if(isEvmChainWallet) {
      return chainConfig?.filter((item) => item.vm_type === 'evm')?.map(item=>item.net_name)
    } else{
      return []
    }
  })
  const accessToken = useLocalStorage('bot_accessToken', '')
  const refreshToken = useLocalStorage('bot_refreshToken', '')
  const evmAddress = useLocalStorage('bot_evmAddress', '')
  const mnemonic = useStorage('bog_mnemonic', '', sessionStorage)
  const showBotMnemonicPhrase = useStorage('showBotMnemonicPhrase', false, sessionStorage)
  const botReqCount = ref(0)
  const bundleAvailableUpdate = ref(0)
  const refreshing = ref(false)
  const subscribed = ref(false)
  const bundleAvailable = ref(false)

  const connectVisible = useStorage('connectVisible', false, sessionStorage)
  const connectWalletTab = ref(0)
  const walletList = ref<Awaited<ReturnType<typeof bot_getWalletsAllChain>>>([])
  const botSwapStore = useBotSwapStore()
  const wsStore = useWSStore()
  const userInfo = computed(() => {
    return walletList.value?.find?.((i) => i.evmAddress === evmAddress.value)
  }) as ComputedRef<{
    tgUid: string
    evmAddress: string
    name: string
    addresses: Array<AddressItem>
  }>

  function refreshAccessToken(type: 'acc' | 'ref') {
    if (!refreshToken.value) {
      return Promise.reject('no refreshToken')
    }
    return _refreshAccessToken(type).then((res) => {
      if (res?.accessToken) {
        accessToken.value = res.accessToken
      }
      if (res?.refreshToken) {
        refreshToken.value = res.refreshToken
      }
    })
  }
  async function getUserInfoByGuid() {
    if (!userInfo.value?.tgUid) {
      return Promise.resolve(userInfo.value)
    }
    const res = await bot_getUserInfoByGuid(userInfo.value?.tgUid)
    useUserStore().email = res.emailAddress
    useUserStore().authInfo= {
      ...res
    }
    return res
  }

  function switchWallet(val: string) {
    if (!val) return
    const isWallet = walletList.value?.some?.(i => val === i.evmAddress)
    if (isWallet) {
      evmAddress.value = val
      console.log('switchWallet', val)
      getUserAllChainBalance()
      getBundleAvailable()
    }
  }

  function getChainsTokenBalance(data: { chain: string; tokens: any[]; walletAddress: string }[]) {
      if (!accessToken.value) {
        return Promise.resolve([])
      }
      return bot_getChainsTokenBalance(data).then(async res => {
        return res?.map((i: { balance: any; decimals: any; decimal: any; token: string; chain: any }) => {
          const balance = i.balance
          const decimals = i.decimals || i.decimal || 0
          const token = i.token === 'sol' ? 'So11111111111111111111111111111111111111112' : i.token
          return {
            ...i,
            initBalance: balance,
            balance: decimals == 0 ? balance : utils.formatUnits(balance.toString(), decimals),
            chain: i.chain,
            token
          }
        })
      })
  }
  function getUserAllChainBalance() {
       if (!accessToken.value) {
        return
      }
      const chainMainToken: { [key: string]: string } = {
        solana: 'sol',
        ton: 'TON',
      }
      if (userInfo.value?.addresses && userInfo.value.addresses.length > 0) {
        const addresses = userInfo.value?.addresses || []
        const tokens = addresses.map((i) => {
          return {
            chain: i.chain,
            tokens: [chainMainToken[i.chain] || NATIVE_TOKEN],
            walletAddress: i.address
          }
        })
        getChainsTokenBalance(tokens).then(res => {
          if (userInfo.value && Array.isArray(userInfo.value.addresses)) {
            (res || []).forEach?.((i: { balance: any; decimals: any; decimal: any }, k: number) => {
              userInfo.value!.addresses[k] = { ...userInfo.value!.addresses?.[k], balance: i?.balance || 0, decimals: i.decimals || i.decimal }
            })
          }
        })
        const chainMainToken1: { [key: string]: string } = {
          solana: 'So11111111111111111111111111111111111111112',
        }
        const adds = Array.from(new Set(addresses?.map?.(i => i?.address || '') || []))
        subBalanceChange(adds)
        const tokenIds = userInfo.value?.addresses?.map(i => ((chainMainToken1?.[i.chain] || NATIVE_TOKEN) + '-' +  i.chain))
        getTokensPrice(tokenIds).then(res => {
          if (userInfo.value && Array.isArray(userInfo.value.addresses)) {
            res?.forEach?.((i, k) => {
              userInfo.value!.addresses[k] = {...userInfo.value?.addresses?.[k], price: i?.current_price_usd || 0, logo_url: i?.logo_url || ''}
            })
          }
        })
    }
  }
  function subBalanceChange(addresses: string[]) {
    wsStore.send({
      jsonrpc: '2.0',
      method: 'unsubscribe',
      params: [
        'asset'
      ],
      id: 1
    })
    wsStore.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['asset', addresses],
      id: 1,
    })
  }
  function getBundleAvailable(): Promise<any> {
      if (bundleAvailableUpdate.value > 0) {
        return Promise.resolve(bundleAvailable.value)
      }
      return bot_getBundleAvailable().then(res => {
        bundleAvailable.value = res
        bundleAvailableUpdate.value++
        return res
      })
  }
  function getUserInfo() {
    if (accessToken.value) {
      bot_getWalletsAllChain({ chain: isSupportChains?.join(',') }).then(
        (res) => {
          walletList.value = res || []
          // if (evmAddress1) {
          //   const item = walletList.value?.find?.(
          //     (i) => i.evmAddress === evmAddress1
          //   )
          //   if (item) {
          //     evmAddress.value = evmAddress1
          //   } else {
          //     evmAddress.value = walletList.value?.[0]?.evmAddress || ''
          //   }
          //   switchWallet(item)
          // }
          const isWallet = walletList.value?.find?.(
            (i) =>
              evmAddress.value === i?.evmAddress &&
              userInfo.value?.addresses?.length === i?.addresses?.length
          )
          if (!isWallet) {
            evmAddress.value = walletList.value?.[0]?.evmAddress || ''
            // dispatch("switchWallet", res?.[0] || {})
          }
          getUserInfoByGuid()
          getUserAllChainBalance()
          getBundleAvailable()
          // 获取用户交易配置信息
          getWebConfig()
          botSwapStore.bot_getGasTip()
          // 获取用户其他信息
          bot_subscribe()
        }
      )
    }
  }
  function getWebConfig(chain: BotChain | '' = '') {
    if (accessToken.value) {
      return bot_getWebConfig(chain).then((res) => {
        let botSettings = useBotSettingStore().botSettings
        if (chain) {
          botSettings[chain] = deepMerge(botSettings[chain], res)
        } else {
          botSettings = deepMerge(botSettings, res)
        }
        return botSettings
      })
    }
  }
  let Timer: ReturnType<typeof setTimeout> | null = null
  function updateWebConfig(data: { chain?: string; webConfig?: string } = {}) {
    if (!accessToken.value) {
      return
    }

    // 添加防抖
    if (Timer) {
      clearTimeout(Timer)
      Timer = null
    }
    Timer = setTimeout(() => {
      bot_updateWebConfig(data)
    }, 1500)
  }

  function _login(data: Parameters<typeof login>[0]) {
    login(data).then((res) => {
      accessToken.value = res.accessToken
      refreshToken.value = res.refreshToken
      evmAddress.value = res.evmAddress
      getUserInfo()
    })
  }

  function logout() {
    if (subscribed.value) {
      bot_unsubscribe()
    }
    accessToken.value = ''
    refreshToken.value = ''
    evmAddress.value = ''
  }
  function getWalletAddress(chain: string) {
    if (Array.isArray(userInfo.value?.addresses)) {
      return userInfo.value.addresses.find((el) => el.chain === chain)?.address
    }
    return evmAddress.value
  }
  function changeConnectVisible(visible: boolean, tab?: number): void {
    connectVisible.value = visible
    connectWalletTab.value = tab ?? 0
  }

  function bot_subscribe() {
    if (accessToken.value && userInfo.value?.tgUid) {
      if (subscribed.value) {
        bot_unsubscribe()
      }
      const data = {
        'jsonrpc': '2.0',
        'method': 'subscribe',
        'params': [
          'tgbot',     // topic
          userInfo.value?.tgUid // tgUid
        ],
        'id': 1
      }
      const data2 = {
        'jsonrpc': '2.0',
        'method': 'subscribe',
        'params': [
          'monitor',     // topic
          userInfo.value?.tgUid, // tgUid
          'web'
        ],
        'id': 1
      }
      wsStore.send(data)
      wsStore.send(data2)
      subscribed.value = true
    }
  }

  function bot_unsubscribe() {
    if (accessToken.value && userInfo.value?.tgUid) {
      const data = {
        'jsonrpc': '2.0',
        'method': 'unsubscribe',
        'params': [
          'tgbot',     // topic
          userInfo.value?.tgUid // tgUid
        ],
        'id': 1
      }
      const data2 = {
        'jsonrpc': '2.0',
        'method': 'unsubscribe',
        'params': [
          'monitor',     // topic
        ],
        'id': 1
      }
      wsStore.send(data)
      wsStore.send(data2)
      subscribed.value = false
    }
  }


  function getTokenBalance(data:any) {
      if (!accessToken.value) {
        return Promise.resolve([])
      }
      const chain = data?.chain || tokenStore.tokenInfo?.token?.chain
      if (chain === 'solana') {
        const tokens = data.tokens?.map((res: string) => {
          if (res === 'So11111111111111111111111111111111111111112' || res === NATIVE_TOKEN) {
            return 'sol'
          } else {
            return res
          }
        })
        data.tokens = tokens
      }
      return bot_getTokenBalance(data).then(async res => {
        return res
      })
  }
  function updateBalance( data:any) {
    console.log('bot_updateBalance', data)
    if (data.event === 'asset' && (data?.transfer)) {
      const token = data?.transfer?.token
      const chain = data?.transfer?.chain
      const wrapToken = getChainInfo(chain)?.wmain_wrapper
      if (token && (token === NATIVE_TOKEN || token === 'sol' || token === wrapToken)) {
        const walletAddress = data?.client_address || ''
        const isHasWallet = userInfo.value.addresses?.some?.(i => i?.address === walletAddress)
        if (isHasWallet) {
          const key = walletAddress + '_' + chain
          if (updateBalanceLoading?.[key]) {
            return
          }
          updateBalanceLoading[key] = true
          getTokenBalance( {
            chain: chain,
            tokens: [NATIVE_TOKEN],
            walletAddress: walletAddress
          }).then(tokens => {
            const t = tokens?.[0]
            console.log('updateBalance------getTokenBalance', t)
            userInfo.value.addresses = (userInfo.value.addresses || []).map(i => {
              if (i?.chain === chain && i.address === walletAddress) {
                i.balance = t.balance || 0
              }
              return i
            })
            if (tokenStore.swap.native?.chain === chain) {
              tokenStore.swap.native.balance = t.balance || 0
            }
          }).finally(() => {
            setTimeout(() => {
              // updateBalanceLoading[walletAddress + '_' + chain] = null
              Reflect.deleteProperty(updateBalanceLoading, key)
            }, 1000)
          })
        }
      }
    }
  }
  return {
    accessToken,
    walletList,
    refreshToken,
    botReqCount,
    refreshing,
    evmAddress,
    connectVisible,
    userInfo,
    refreshAccessToken,
    logout,
    login: _login,
    tgLogin,
    getUserInfo,
    getWebConfig,
    updateWebConfig,
    isSupportChains,
    isSupportEvmChains,
    getWalletAddress,
    changeConnectVisible,
    connectWalletTab,
    bundleAvailable,
    getUserInfoByGuid,
    switchWallet,
    getChainsTokenBalance,
    getUserAllChainBalance,
    getBundleAvailable,
    updateBalance,
    bot_subscribe,
    mnemonic,
    showBotMnemonicPhrase
  }
})
