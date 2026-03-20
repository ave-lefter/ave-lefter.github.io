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
import { debounce } from 'lodash-es'

type AddressItem = { chain: string; address: string; price?: number; balance?: string; decimals?: number; logo_url?: string; tokenBalances?: {
  [key: string]: {
    chain: string
    address: string
    price?: number
    balance?: string
    decimals?: number
    logo_url?: string
  }
}}
const updateBalanceLoading: { [key: string]: boolean } = {}
const _refreshAccessToken = createCacheRequest(_refAcc, 3000)
export const useBotStore = defineStore('bot', () => {
  const walletStore = useWalletStore()
  const configStore = useConfigStore()
  const tokenStore = useTokenStore()
  const isSupportChains = ['eth', 'bsc', 'solana', 'base', 'xlayer', 'polygon', 'ton'] as const
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

  const connectVisible = ref(false)
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

  watch(
    () => accessToken.value,
    (val) => {
      if (val) {
        localStorage.setItem('perp_accessToken', val)
      }
    }
  )

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
        let token = i.token === 'sol' ? 'So11111111111111111111111111111111111111112' : i.token
        token = token === 'TON' ? NATIVE_TOKEN : token
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
  async function getUserAllChainBalance(item: {address: string, chain: string} | null = null) {
    if (!accessToken.value) {
      return
    }
    for(let k = 0; k < walletList.value.length; k++) {
      let i = walletList.value[k]
      let _item: typeof item | string = item
      if (BotNativeTokens?.includes(item?.address || '')) {
        _item = item?.chain || ''
      }
      _getUserAllChainBalance(i?.addresses || [], _item)
    }
    if (!item) {
      subBalanceChange()
    }
  }

  // 防抖合并相关变量
  let debounceTimer: NodeJS.Timeout | null = null
  const pendingParams: {
    addresses: AddressItem[]
    items: Array<{ address: string; chain: string } | null>
  } = {
    addresses: [],
    items: []
  }

  async function _getUserAllChainBalance(addresses: Array<AddressItem> = [], item: {address: string, chain: string} | string | null = null): Promise<void> {
    if (!accessToken.value) {
      return
    }
    // 1. 合并参数（去重处理）
    // 合并addresses（按address+chain唯一标识去重）
    const addressKeys = new Set(
      pendingParams.addresses.map(addr => `${addr.address}-${addr.chain}`)
    );
    addresses.forEach(addr => {
      const key = `${addr.address}-${addr.chain}`
      if (!addressKeys.has(key)) {
        addressKeys.add(key)
        pendingParams.addresses.push({...addr}) // 深拷贝避免原对象引用干扰
      }
    })

    // 合并items（非null项按address+chain去重）
    if (item && typeof item === 'object') {
      const itemKey = `${item.address}-${item.chain}`;
      const isDuplicate = pendingParams.items.some(
        i => i && `${i.address}-${i.chain}` === itemKey
      );
      if (!isDuplicate) {
        pendingParams.items.push({ ...item }); // 深拷贝
      }
    }

    // 2. 防抖逻辑：0.5秒后执行合并后的参数
    if (debounceTimer) clearTimeout(debounceTimer);

    return new Promise(resolve => {
      debounceTimer = setTimeout(async () => {
        // 执行处理逻辑（使用合并后的参数）
        await processMergedParams(
          [...pendingParams.addresses],
          [...pendingParams.items],
          item
        );
        // 重置参数，准备下一次合并
        pendingParams.addresses = []
        pendingParams.items = [];
        debounceTimer = null
        resolve()
      }, 500)
    })
  }
  /**
   * 处理合并后的参数（核心业务逻辑）
   */
  async function processMergedParams(
    addresses: AddressItem[],
    items: Array<{ address: string; chain: string } | null>,
    item: {address: string, chain: string} | string | null
  ) {
    if (!accessToken.value) return;

    const chainMainToken: Record<string, string> = {
      solana: 'sol',
      ton: 'TON',
    }

    if (addresses.length === 0) return

    // 处理带item的情况（批量处理所有item）
    const validItems = items.filter(Boolean) as Array<{ address: string; chain: string }>
    if (validItems.length > 0) {
      // 按chain分组，减少同链重复请求
      const chainGroups = validItems.reduce((groups, item) => {
        const chain = item.chain
        if (!groups[chain]) groups[chain] = []
        groups[chain].push(item)
        return groups
      }, {} as Record<string, Array<{ address: string; chain: string; token?: string }>>)

      // 逐个链处理
      for (const [chain, chainItems] of Object.entries(chainGroups)) {
        // 1. 批量获取余额
        const balanceParams = addresses
          .filter(addr => addr.chain === chain)
          .map(addr => ({
            chain: addr.chain,
            tokens: chainItems.map(item => (item.address || item.token)), // 合并当前链的所有token
            walletAddress: addr.address
          }))

        if (balanceParams.length > 0) {
          // 每次调用 5 个
          for(let i = 0; i < balanceParams.length; i += 7) {
            const params = balanceParams.slice(i, i + 7)
            const balanceRes = await getChainsTokenBalance(params);
            (balanceRes || []).forEach((resItem: any) => {
              walletList.value?.forEach(wallet => {
                wallet.addresses.forEach(addr => {
                  if (addr.address === resItem.walletAddress && addr.chain === resItem.chain) {
                    if (!addr.tokenBalances) addr.tokenBalances = {}
                    addr.tokenBalances[resItem.token] = {
                      chain: resItem.chain,
                      address: resItem.token,
                      balance: resItem.balance
                    }
                  }
                })
              })
            })
          }

          // const balanceRes = await getChainsTokenBalance(balanceParams);
          // (balanceRes || []).forEach((resItem: any) => {
          //   walletList.value?.forEach(wallet => {
          //     wallet.addresses.forEach(addr => {
          //       if (addr.address === resItem.walletAddress && addr.chain === resItem.chain) {
          //         if (!addr.tokenBalances) addr.tokenBalances = {}
          //         addr.tokenBalances[resItem.token] = {
          //           chain: resItem.chain,
          //           address: resItem.token,
          //           balance: resItem.balance
          //         }
          //       }
          //     })
          //   })
          // })
        }

        // 2. 批量获取价格
        const tokenIds = chainItems.map(item => `${item.address}-${item.chain}`)
        const baseTokens = botSwapStore.botSwapBaseTokens[chain as BotChain] || []
        // 优先使用本地缓存的USD代币价格
        const cachedPrices = baseTokens.filter(t =>
          tokenIds.includes(`${t.address}-${t.chain}`) && t.symbol?.includes('USD')
        )
        // 本地无缓存则调用接口
        const priceRes = cachedPrices.length > 0
          ? cachedPrices
          : await getTokensPrice(tokenIds)

        // 更新价格信息
        priceRes.forEach((priceItem: any) => {
          const targetItem = chainItems.find(
            item => item.address === priceItem.address && item.chain === chain
          )
          if (targetItem) {
            walletList.value?.forEach(wallet => {
              wallet.addresses.forEach(addr => {
                if (addr.chain === chain) {
                  if (!addr.tokenBalances) addr.tokenBalances = {}
                  const tokenBalance = addr.tokenBalances[targetItem.address] || {}
                  addr.tokenBalances[targetItem.address] = {
                    ...tokenBalance,
                    price: priceItem.price || 0,
                    logo_url: priceItem.logo_url || ''
                  }
                }
              })
            })
          }
        })
      }
    } else {
      // 处理无item的情况（获取主代币信息）
      let balanceParams = addresses.map(addr => ({
        chain: addr.chain,
        tokens: [chainMainToken[addr.chain] || NATIVE_TOKEN],
        walletAddress: addr.address
      }))

      if (item && typeof item === 'string') {
        balanceParams = balanceParams?.filter?.(i => i.chain === item) || []
      }

      if (balanceParams?.length > 0) {
        for(let i = 0; i < balanceParams.length; i += 7) {
          const params = balanceParams.slice(i, i + 7)
          const balanceRes = await getChainsTokenBalance(params);
          (balanceRes || []).forEach((resItem: any) => {
            walletList.value?.forEach(wallet => {
              wallet.addresses.forEach(addr => {
                if (addr.address === resItem.walletAddress && addr.chain === resItem.chain) {
                  addr.balance = resItem?.balance || 0
                  addr.decimals = resItem.decimals || resItem.decimal
                }
              })
            })
          })
        }
      }
      // 获取主代币余额
      // const balanceRes = await getChainsTokenBalance(balanceParams);
      // (balanceRes || []).forEach((resItem: any) => {
      //   // const addr = addresses[index]
      //   const addresses = walletList.value.find(i => i.addresses?.some(a => a.address === resItem.walletAddress && a.chain === resItem.chain))?.addresses
      //   const addr = addresses?.find?.(a => a.address === resItem.walletAddress && a.chain === resItem.chain)
      //   walletList.value?.forEach(wallet => {
      //     wallet.addresses.forEach(addr => {
      //       if (addr.address === resItem.walletAddress && addr.chain === resItem.chain) {
      //         addr.balance = resItem?.balance || 0
      //         addr.decimals = resItem.decimals || resItem.decimal
      //       }
      //     })
      //   })
      // })

      // 获取主代币价格
      const chainMainToken1: Record<string, string> = {
        solana: 'So11111111111111111111111111111111111111112',
      }
      const tokenIds = addresses.map(addr =>
        `${chainMainToken1[addr.chain] || NATIVE_TOKEN}-${addr.chain}`
      )
      const priceRes = await getTokensPrice(tokenIds)
      priceRes?.forEach((priceItem: any, index: number) => {
        let chain = tokenIds[index].split('-')[1]
        walletList.value.forEach(i => {
          i.addresses?.forEach(a => {
            if (a.chain === chain) {
              const addr = a
              addr.price = priceItem?.current_price_usd || 0
              addr.logo_url = priceItem?.logo_url || ''
            }
          })
        })
      })
    }
  }

  const subBalanceChange = debounce(_subBalanceChange, 1000)
  function _subBalanceChange() {
    const addresses = (walletList.value || []).reduce((pre: string[], cur) => {
      return [...pre, ...(cur.addresses?.map?.(i => i?.address || '') || [])]
    }, [] as string[])
    const adds = Array.from(new Set(addresses))
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
      params: ['asset', adds],
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
      if (token && (BotNativeTokens?.includes(token || '') || token === wrapToken)) {
        const walletAddress = data?.client_address || ''
        // const isHasWallet = userInfo.value.addresses?.some?.(i => i?.address === walletAddress)
        const isHasWallet = walletList?.value?.some?.(i => i?.addresses?.some?.(j => j?.address === walletAddress))
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
            // userInfo.value.addresses = (userInfo.value.addresses || []).map(i => {
            //   if (i?.chain === chain && i.address === walletAddress) {
            //     i.balance = t.balance || 0
            //   }
            //   return i
            // })
            walletList.value = (walletList.value || []).map(i => {
              if (i?.addresses?.some?.(j => j?.chain === chain && j.address === walletAddress)) {
                i.addresses = (i.addresses || []).map(j => {
                  if (j?.chain === chain && j.address === walletAddress) {
                    j.balance = t.balance || 0
                  }
                  return j
                })
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
    showBotMnemonicPhrase,
    subBalanceChange
  }
})
