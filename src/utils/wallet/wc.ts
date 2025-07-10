import { EthereumProvider } from '@walletconnect/ethereum-provider'
import WCWallet from '~/components/header/connectWallet/wcWallet.vue'

function onSubscribe(provider: Awaited<ReturnType<typeof EthereumProvider.init>>) {
  if (!provider) {
    throw new Error('provider hasn\'t been created yet')
  }

  provider.on('accountsChanged', (accounts: string[]) => {
    const walletStore = useWalletStore()
    walletStore.address = accounts[0]
  })

  provider.on('chainChanged', (chainId: string | number) => {
    const walletStore = useWalletStore()
    console.log('chainChanged', chainId, getChainInfo(String(chainId), true).net_name)
    walletStore.chain = getChainInfo(Number(chainId).toString(), true).net_name
  })

  provider.on('connect', () => {
    const walletStore = useWalletStore()
    walletStore.provider = provider
  })

  provider.on('disconnect', () => {
    const walletStore = useWalletStore()
    walletStore.provider = null
    walletStore.address = ''
    walletStore.chain = ''
  })
}

let provider: Awaited<ReturnType<typeof EthereumProvider.init>> | null = null

export async function walletConnect(chain: string, walletName = 'WalletConnect') {
  const projectId = '3f5b78ae39a9eb6fa5d9b40570489df8'
  const chainId = Number(getChainInfo(chain).chain_id)
  const namespaces = {
    eip155: {
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
      ],
      chains: [chainId],
      events: ['accountsChanged', 'chainChanged'],
      // rpcMap: {
      //   1: `https://rpc.walletconnect.com/v1/?chainId=1&projectId=${projectId}`,
      //   56: `https://rpc.walletconnect.com/v1/?chainId=56&projectId=${projectId}`,
      // },
    },
  }
  const themeStore = useThemeStore()
  if (provider) {
    provider.disconnect()
  }
  provider = await EthereumProvider.init({
    projectId: projectId, // REQUIRED your projectId
    chains: namespaces.eip155.chains, // REQUIRED chain ids
    methods: namespaces.eip155.methods, // OPTIONAL ethereum methods
    events: namespaces.eip155.events, // OPTIONAL ethereum events
    // rpcMap: namespaces.eip155.rpcMap, // OPTIONAL rpc urls for each chain
    // metadata: {
    //   name: "Ave.ai",
    //   description: "如果你是一个传说",
    //   url: "https://ave.ai/",
    //   icons: ["https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"],
    // },
    optionalChains: [chainId],
    showQrModal: walletName === 'WalletConnect' || !walletName,
    qrModalOptions: {
      themeMode: themeStore.theme,
      themeVariables: { '--wcm-z-index': '9999' },
      explorerRecommendedWalletIds: [
        '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4'
      ],
    }
  })

  const walletStore = useWalletStore()
  walletStore.provider = provider || null
  walletStore.chain = chain

  onSubscribe(provider)
  const { $dialog } = useNuxtApp()
  if (walletName && walletName !== 'WalletConnect') {
    $dialog.show({
      content: {
        is: WCWallet,
        props: {
          walletName,
          uri: ''
        }
      },
      props: {
        width: '360px',
        class: 'wallet-connect',
        title: walletName,
      }
    })
    provider.on('display_uri', (uri) => {
      console.log('display_uri', uri)
      $dialog.updateContentProps({
        uri: uri
      })
    })
  }

  let accounts = await provider.enable()
  accounts = accounts?.map((i) => i?.toLowerCase())
  walletStore.walletName = 'wc:' + (walletName || 'WalletConnect')
  walletStore.address = accounts[0]
  walletStore.chain = chain
  $dialog.hide()
  return accounts[0]
}

