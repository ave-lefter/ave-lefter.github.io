export interface Wallet {
  tgUid: string
  chain: string
  address: string
  name: string
  balance: string
  source: string
  operate: string
  isChildren: boolean
  balancesInfo: Address[]
}
export interface Address {
  chain: string
  address: string
  name: string
  balance: string
  source: string
  operate: string
}

export function _getMultiWalletsAllChain(): Promise<Wallet[]> {
  const { $api } = useNuxtApp()
  return $api('/botapi/swap/getMultiWalletsBalance', {
    method: 'get',
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