import { defineStore } from 'pinia'
import { requestEIP6963Providers, type EIP6963ProviderResponse, type EIP6963ProviderDetail } from 'web3'
import { DefaultEvmWallets, switchEthereumChain } from '~/utils/wallet/evm'
import { walletConnect } from '~/utils/wallet/wc'
import { getSolanaWallets, connectSolanaWallet, type Wallet } from '~/utils/wallet/solana'
import { getTronWalletAdapters, connectTronWallet } from '~/utils/wallet/tron'
import { getSuiWallets, connectSuiWallet } from '~/utils/wallet/sui'
import { useLocalStorage } from '@vueuse/core'
import { BrowserProvider } from 'ethers'
import { decodeUTF8 } from 'tweetnacl-util'
import bs58 from 'bs58'
import type { Wallet as SuiWallet } from '~/utils/wallet/sui'
type TronWalletAdapter = ReturnType<typeof getTronWalletAdapters>[number]

export const useWalletStore = defineStore('wallet', () => {
  const address = useLocalStorage('walletAddress', '')
  const chain = useLocalStorage('walletChain', '')
  const walletName = useLocalStorage('walletName', '')
  const walletSignature = useLocalStorage('walletSignature', {} as Record<string, string>)
  const provider = shallowRef<(EIP6963ProviderDetail<any>['provider'] | Wallet | TronWalletAdapter | SuiWallet) & {disconnect?: () => void} | null>(null)
  const evmWalletMap = shallowRef<EIP6963ProviderResponse>(new Map())
  const solanaWallets = shallowRef<Wallet[]>([])
  const tronWalletAdapters = shallowRef<TronWalletAdapter[]>([])
  const suiWallets = shallowRef<SuiWallet[]>([])


  async function getEvmWalletList() {
    evmWalletMap.value = await requestEIP6963Providers()
    for (const [, value] of evmWalletMap.value) {
      if (value.info.name === walletName.value) {
        provider.value = value.provider
        break
      }
    }
    console.log('evmWalletMap.value', evmWalletMap.value)
    return evmWalletMap.value
  }

  const evmWallets = computed(() => {
    const wallets: Array<{
      name: string
      icon: string
      url?: string
      provider?: EIP6963ProviderDetail<any>['provider']
    }> = DefaultEvmWallets?.map(i => ({...i}))
    for (const [, value] of evmWalletMap.value) {
      const index = wallets.findIndex(i => i.name === value.info.name)
      if (index >= 0) {
        wallets[index].icon = value.info.icon
        wallets[index].provider = value.provider
      }
    }
    return wallets?.sort((a, b) => {
      if (a.provider && !b.provider) {
        return -1
      }
      return 0
    })
  })

  function connectEvmWallet(item: string, chain?: string): Promise<boolean>
  function connectEvmWallet(item: typeof evmWallets.value[number], chain?: string): Promise<boolean>
  function connectEvmWallet(item: typeof evmWallets.value[number] | string, chain?: string) {
    if (typeof item === 'string') {
      return walletConnect(chain || '', item)
    }
    provider.value = item.provider || null
    if (item.url && !provider.value) {
      window.open(item.url, '_blank')
      return Promise.resolve(false)
    }
    if (item.provider !== null) {
      return (provider.value)?.request({ method: 'eth_requestAccounts' }).then((accounts) => {
        walletName.value = item.name
        switchEthereumChain(chain || '', item.provider as EIP6963ProviderDetail<any>['provider'], accounts as string[])
        return Promise.resolve(true)
      }).catch((err) => {
        console.log('connectEvmWallet err', err)
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          // reject('请连接MetaMask')
        } else {
          console.error(err)
        }
        return Promise.reject(err)
      })
    } else {
      return Promise.resolve(false)
    }
  }

  function disconnectWallet() {
    if (chain.value === 'solana') {
      (provider.value as Wallet)?.features?.['standard:disconnect']?.disconnect?.()
    }
    address.value = ''
    chain.value = ''
    walletName.value = ''
    provider.value?.disconnect?.()
    setTimeout(() => {
      provider.value = null
    }, 100)
  }

  function disconnect() {
    if (chain.value === 'tron') {
      (provider.value as TronWalletAdapter)?.disconnect?.()
    }
    address.value = ''
    chain.value = ''
    walletName.value = ''
    provider.value?.disconnect?.()
    setTimeout(() => {
      provider.value = null
    }, 100)
    // 移除 bot 钱包相关
    useBotStore().logout()
  }

  function _getSolanaWallets() {
    solanaWallets.value = getSolanaWallets()
    console.log('solanaWallets.value', solanaWallets.value)
  }

  function _getTronWalletAdapters() {
    tronWalletAdapters.value = getTronWalletAdapters()
    console.log('tronWalletAdapters', tronWalletAdapters.value)
  }

  function _getSuiWallets() {
    suiWallets.value = getSuiWallets()
    console.log('sui', suiWallets.value)
  }

  function signMessage(msg: string) {
    if (!provider.value) return
    if (chain.value === 'solana' || chain.value === 'sui') {
      const _provider = (chain.value === 'solana' ? solanaWallets.value?.find(i => i.name === walletName.value) : suiWallets.value?.find(i => i.name === walletName.value)) || provider.value
      return (_provider as Wallet)?.signMessage?.({
        message: decodeUTF8(msg),
        account: (_provider as Wallet)?.accounts?.[0]
      }).then(async res => bs58.encode(res.signature))
    } else if (chain.value === 'tron') {
      return (provider.value as TronWalletAdapter)?.signMessage?.(msg)
    } else if (isEvmChain(chain.value)) {
      return new BrowserProvider(provider.value as EIP6963ProviderDetail<any>['provider']).getSigner().then(signer => signer.signMessage(msg))
    }
  }

  function signMessageForFavorite() {
    if (!address.value || !provider.value) return Promise.resolve('')
    if (!isEvmChain(chain.value) && chain.value !== 'solana') return Promise.resolve('')
    if (walletSignature.value[address.value]) return Promise.resolve(walletSignature.value[address.value])
    const msg = `Ave.ai requests ${address.value} address signature to bind favorite list`
    return signMessage(msg)?.then((res) => {
      if (res) {
        walletSignature.value[address.value] = res
        return Promise.resolve(res)
      }
      return Promise.resolve('')
    }).catch(() => {
      return Promise.resolve('')
    })
  }

  function initWallet() {
    // evm init
    getEvmWalletList().then(() => {
      const extraName = ['WatchWallet', 'appCode']
      if (!(address.value && chain.value && isEvmChain(chain.value) && walletName.value && !extraName.includes(walletName.value))) {
        return
      }
      if (walletName.value && isEvmChain(chain.value)) {
        if (walletName.value.startsWith('wc:')) {
          // walletConnect(chain.value, walletName.value)
          connectEvmWallet(walletName.value, chain.value)
        } else {
          let wallet: typeof evmWallets.value[number] | null = null
          for (const [, value] of evmWalletMap.value) {
            if (value.info.name === walletName.value) {
              wallet = {
                name: value.info.name,
                icon: value.info.icon,
                provider: value.provider
              }
              break
            }
          }
          if (!wallet) {
            return
          }
          connectEvmWallet(wallet, chain.value)
        }
      }
    })
    // solana init
    _getSolanaWallets()
    if (address.value && chain.value === 'solana' && walletName.value) {
      const wallet = solanaWallets.value.find(i => i.name === walletName.value && i?.features)
      if (wallet) {
        connectSolanaWallet(wallet)
      }
    }
    // tron init
    _getTronWalletAdapters()
    if (address.value && chain.value === 'tron' && walletName.value) {
      const wallet = tronWalletAdapters.value.find(i => i.name === walletName.value)
      if (wallet) {
        connectTronWallet(wallet)
      }
    }
    // sui init
    _getSuiWallets()
    if (address.value && chain.value === 'sui' && walletName.value) {
      const wallet = suiWallets.value.find(i => i.name === walletName.value)
      if (wallet) {
        connectSuiWallet(wallet)
      }
    }
  }

  return {
    address,
    chain,
    provider,
    walletName,
    walletSignature,
    getEvmWalletList,
    evmWallets,
    connectEvmWallet,
    initWallet,
    disconnectWallet,
    disconnect,
    solanaWallets,
    tronWalletAdapters,
    suiWallets,
    signMessage,
    signMessageForFavorite
  }
})
