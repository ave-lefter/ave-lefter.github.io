import {
  TronLinkAdapter,
  TokenPocketAdapter,
  WalletConnectAdapter,
  BitKeepAdapter,
  OkxWalletAdapter,
} from '@tronweb3/tronwallet-adapters'

type TronWalletAdapter = ReturnType<typeof getTronWalletAdapters>[number]

export function getTronWalletAdapters() {
  const themeStore = useThemeStore()
  const tpAdapter = new TokenPocketAdapter()
  tpAdapter.url = 'https://chromewebstore.google.com/detail/tokenpocket-web3-crypto-w/mfgccjchihfkkindfppnaooecgfneiii'
  return [
    new TronLinkAdapter(),
    new OkxWalletAdapter(),
    tpAdapter,
    new BitKeepAdapter(),
    new WalletConnectAdapter({
      network: 'Mainnet',
      options: {
        projectId: '3f5b78ae39a9eb6fa5d9b40570489df8',
        relayUrl: 'wss://relay.walletconnect.org', // 可选
      },
      web3ModalConfig: {
        themeMode: themeStore.theme,
        themeVariables: {
          '--wcm-z-index': '9999',
          '--wcm-background-color': 'var(--wcm-color-bg-1)',
        }
      }
    }),
  ]
}

function onEvent(wallet: TronWalletAdapter) {
  const walletStore = useWalletStore()
  wallet.on('disconnect', () => {
    walletStore.provider = null
    walletStore.address = ''
    walletStore.chain = ''
    walletStore.walletName = ''
  })
  wallet.on('accountsChanged', (address) => {
    if (address) {
      walletStore.address = address
    }
  })
}


export function connectTronWallet(wallet: TronWalletAdapter) {
  const walletStore = useWalletStore()
  return wallet.connect().then(() => {
    walletStore.address = wallet.address as string
    walletStore.chain = 'tron'
    walletStore.provider = wallet
    walletStore.walletName = wallet.name
    onEvent(wallet)
    return Promise.resolve(true)
  }).catch(() => {
    return Promise.resolve(false)
  })
}
