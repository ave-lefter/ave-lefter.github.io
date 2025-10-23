export interface Wallet {
  id: string
  tgUid: string
  evmAddress: string
  address: string
  name: string
  balance: string | number
  mainTokenBalance: string | number
  usdcTokenBalance: string | number
  usdtTokenBalance: string | number
  source: string
  operate: string
  genSource: 1 | 0
  balancesInfo?: Address[]
}
export interface Address {
  id: string
  chain: string
  address: string
  name: string
  balance: string
  mainTokenBalance: string
  usdcTokenBalance: string
  usdtTokenBalance: string
  source: string
  operate: string
  isChildren: boolean
  balancesInfo?: Address[]
}

export function _getMultiWalletsAllChain(chain: string): Promise<Wallet[]> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getMultiWalletsBalance', {
    method: 'get',
    params: {
      chain: chain
    },
  })
}

//创建

export function _generateWallet(): Promise<{ Mnemonic: string }> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/generateWallet', {
    method: 'POST',
    body: {
      source: 'web',
    },
  })
}
// 导入

export function _importWallet(encryptedMnemonic: string): Promise<Wallet[]> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/importWallet', {
    method: 'POST',
    body: {
      source: 'web',
      encryptedMnemonic: encryptedMnemonic,
    },
  })
}

// 删除
export function _removeWallet(evmAddress: string): Promise<Wallet[]> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/removeWallet', {
    method: 'POST',
    body: {
      source: 'web',
      evmAddress: evmAddress,
    },
  })
}
//编辑备注
export function updateWhaleRemark(data: { address: string; name: string; chain: string }) {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/editWalletName', {
    method: 'POST',
    body: data,
  })
}
export interface Records {
  id: number
  status: 'import' | 'create' | 'delete'
  guid: string
  name: string
  evmAddress: string
  addressType: number
  updateTime: string
}
//bot 操作记录
export function _getWalletOperationRecord(): Promise<Records[]> {
  const { $api } = useNuxtApp()
  return $api('/botapi/user/getWalletOperationRecord', {
    method: 'get',
  })
}