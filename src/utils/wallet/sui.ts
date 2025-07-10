import { getWallets, type Wallets } from '@mysten/wallet-standard'
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Features = {
  'standard:connect': {
    connect: () => Promise<{accounts: Array<{ address: string }>}>
  },
  'standard:events': {
    on: (event: 'change' | 'disconnect' | 'accountsChanged' | 'networkChanged', callback: (event: { accounts?: { address: string }[]; chains?: string[] }) => void) => void
  },
  'standard:disconnect': {
    disconnect: () => Promise<void>
  }
}
export type Wallet = MakeOptional<ReturnType<Wallets['get']>[number], 'features' | 'accounts'> & {
  url?: string
  features?: Features
  signMessage?: (msg: {
    message: Uint8Array
  }) => Promise<{
    signature: Uint8Array
  }>

}

export const DefaultSuiWallets: Wallet[] = [
  {
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iMTYiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8xNzA4XzI4Mjk3KSIvPjxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2RfMTcwOF8yODI5NykiIGZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0yMi44IDIwYy0xLjQgMC0yLjctMS40LTMuMy0yLjMtLjcuOS0yIDIuMy0zLjQgMi4zcy0yLjctMS40LTMuNC0yLjNjLS42LjktMS45IDIuMy0zLjMgMi4zLS4zIDAtLjUtLjItLjUtLjVzLjItLjUuNS0uNWMxLjEgMCAyLjYtMS45IDIuOS0yLjVsLjUtLjJjLjIgMCAuMyAwIC40LjIuNC42IDEuOCAyLjUgMi45IDIuNSAxLjEgMCAyLjUtMS45IDIuOS0yLjVsLjQtLjJjLjIgMCAuNCAwIC41LjIuNC42IDEuOCAyLjUgMi45IDIuNS4yIDAgLjUuMi41LjVzLS4yLjUtLjUuNXoiLz48cGF0aCBkPSJNMjIuOCAyMy4zYy0xLjQgMC0yLjctMS4zLTMuMy0yLjMtLjcgMS0yIDIuMy0zLjQgMi4zUzEzLjQgMjIgMTIuNyAyMWMtLjYgMS0xLjkgMi4zLTMuMyAyLjMtLjMgMC0uNS0uMy0uNS0uNSAwLS4zLjItLjYuNS0uNiAxLjEgMCAyLjYtMS44IDIuOS0yLjRsLjUtLjIuNC4yYy40LjYgMS44IDIuNCAyLjkgMi40IDEuMSAwIDIuNS0xLjggMi45LTIuNGwuNC0uMi41LjJjLjQuNiAxLjggMi40IDIuOSAyLjQuMiAwIC41LjMuNS42IDAgLjItLjIuNS0uNS41ek05LjggMTYuN2MtLjMgMC0uNS0uMi0uNS0uNEw5LjEgMTVjMC0zLjkgMy4yLTcgNy03IDMuOSAwIDcgMy4xIDcgN2wtLjEgMS4yYzAgLjMtLjMuNS0uNi41LS40LS4xLS41LS4zLS40LS43di0xYzAtMy4zLTIuNi02LTUuOS02LTMuMiAwLTUuOSAyLjctNS45IDZsLjEgMWMuMS40LS4xLjctLjQuN2gtLjF6Ii8+PC9nPjxkZWZzPjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8xNzA4XzI4Mjk3IiB4PSI0LjkiIHk9IjYiIHdpZHRoPSIyMi40MzciIGhlaWdodD0iMjMuMzE5IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz48ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+PGZlT2Zmc2V0IGR5PSIyIi8+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIvPjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPjxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwLjE3NTY5NCAwIDAgMCAwIDAuNTc0MTQyIDAgMCAwIDAgMC45MTY2NjcgMCAwIDAgMSAwIi8+PGZlQmxlbmQgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzE3MDhfMjgyOTciLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTcwOF8yODI5NyIgcmVzdWx0PSJzaGFwZSIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8xNzA4XzI4Mjk3IiB5MT0iNCIgeDI9IjI4Ljg4OSIgeTI9IjMyIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHN0b3Agc3RvcC1jb2xvcj0iIzNFQTJGOCIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzY3QzhGRiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==',
    name: 'Suiet',
    url: 'https://suiet.app',
    version: '1.0.0',
    chains: ['sui:mainnet'],
  },
  {
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJDSURBVHgB7Zq9jtpAEMfHlhEgQLiioXEkoAGECwoKxMcTRHmC5E3IoyRPkPAEkI7unJYmTgEFTYwA8a3NTKScLnCHN6c9r1e3P2llWQy7M/s1Gv1twCP0ej37dDq9x+Zut1t3t9vZjDEHIiSRSPg4ZpDL5fxkMvn1cDh8m0wmfugfO53OoFQq/crn8wxfY9EymQyrVCqMfHvScZx1p9ls3pFxXBy/bKlUipGPrVbLuQqAfsCliq3zl0H84zwtjQrOw4Mt1W63P5LvBm2d+Xz+YzqdgkqUy+WgWCy+Mc/nc282m4FqLBYL+3g8fjDxenq72WxANZbLJeA13zDX67UDioL5ybXwafMYu64Ltn3bdDweQ5R97fd7GyhBQMipx4POeEDHIu2LfDdBIGGz+hJ9CQ1ABjoA2egAZPM6AgiCAEQhsi/C4jHyPA/6/f5NG3Ks2+3CYDC4aTccDrn6ojG54MnEvG00GoVmWLIRNZ7wTCwDHYBsdACy0QHIhiuRETxlICWpMMhGZHmqS8qH6JLyGegAZKMDkI0uKf8X4SWlaZo+Pp1bRrwlJU8ZKLIvUjKh0WiQ3sRUbNVq9c5Ebew7KEo2m/1p4jJ4qAmDaqDQBzj5XyiAT4VCQezJigAU+IDU+z8vJFnGWeC+bKQV/5VZ71FV6L7PA3gg3tXrdQ+DgLhC+75Wq3no69P3MC0NFQpx2lL04Ql9gHK1bRDjsSBIvScBnDTk1WrlGIZBorIDEYJj+rhdgnQ67VmWRe0zlplXl81vcyEt0rSoYDUAAAAASUVORK5CYII=',
    name: 'OKX Wallet',
    url: 'https://www.okx.com/download',
    version: '1.0.0',
    chains: ['sui:mainnet'],
  }
]


export function getSuiWallets() {
  const wallets= getWallets().get().filter(i => {
    return i.chains?.includes('sui:mainnet')
  }) as  Array<Wallet>
  DefaultSuiWallets.forEach((i) => {
    const index = wallets.findIndex(j => j.name === i.name)
    if (index < 0) {
      wallets.push(i)
    }
  })
  return wallets
}

function onEvent(features: Features) {
  if ('standard:events' in features) {
    // 监听账户变化
    const walletStore = useWalletStore()
    features['standard:events'].on('change', (event) => {
      if (event.accounts) {
        walletStore.address = event.accounts?.[0]?.address
      }
    })
    // 监听网络变化
    features['standard:events'].on('disconnect', () => {
      walletStore.provider = null
      walletStore.address = ''
      walletStore.chain = ''
      walletStore.walletName = ''
    })
  }
}

export function connectSuiWallet(wallet: Wallet) {
  if (wallet.features) {
    const features = wallet.features as Features
    onEvent(features)

    const walletStore = useWalletStore()
    return features['standard:connect'].connect().then((res) => {
      console.log('connect', res)
      walletStore.address = res.accounts?.[0].address
      walletStore.chain = 'sui'
      walletStore.provider = wallet
      walletStore.walletName = wallet.name
      return Promise.resolve(res)
   })
  } else if (wallet.url) {
    window.open(wallet.url, '_blank')
  }
  return Promise.resolve(false)
}
