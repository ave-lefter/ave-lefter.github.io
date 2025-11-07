import { perpApi as api } from './request'
import { type Metadata } from '@edgex-fe/typescript-sdk'
import { getAddress } from 'ethers'

import localforage from 'localforage'
import { usePerpStore } from '~/stores/perp'

// 获取metadata
export async function getPerpMetadata(): Promise<Metadata> {
  const cached: { data: any, timestamp: number } = (await localforage.getItem('perpMetadata')) ||  { data: null, timestamp: 0 }
  if (cached?.data && cached.timestamp > Date.now() - 10 * 60 * 1000) {
    return cached.data
  }
  return api('/api/v1/public/meta/getMetaData').then((res) => {
    localforage.setItem('perpMetadata', {
      data: res,
      timestamp: Date.now(),
    })
    return res as any
  })
}

export async function onboardSite(): Promise<{
  dataList: Array<{
    id: string
    userId: string
    ethAddress: string
    l2Key: string
    l2KeyYCoordinate: string
    clientAccountId: string
    isSystemAccount: boolean
    defaultTradeSetting: {
      isSetFeeRate: boolean
      takerFeeRate: string
      makerFeeRate: string
      isSetFeeDiscount: boolean
      takerFeeDiscount: string
      makerFeeDiscount: string
      isSetMaxLeverage: boolean
      maxLeverage: string
    }
    contractIdToTradeSetting: {}
    maxLeverageLimit: string
    createOrderPerMinuteLimit: number
    createOrderDelayMillis: number
    extraType: string
    extraDataJson: string
    status: string
    isLiquidating: boolean
    createdTime: string
    updatedTime: string
  }>
  nextPageOffsetData: string
}> {
  const walletStore = useWalletStore()
  const perpStore = usePerpStore()
  const metaConfig = perpStore.metadata?.global
  if (!walletStore.address) {
    return {
      dataList: [],
      nextPageOffsetData: ''
    }
  }
  // api/v1/public/user/onboardSite
  return api('/api/v1/public/user/privy/onboardSite', {
    method: 'post',
    body: {
      ethAddress: getAddress(walletStore.address),
      onlySignOn: metaConfig?.appOnlySignOn,
      signature: perpStore.perpKeys?.apiSignature,
      l2Key: '0x' + perpStore.l2KeyPair?.l2PublicKey,
      l2KeyYCoordinate: '0x' + perpStore.l2KeyPair?.l2PublicKeyY,
      clientAccountId: 'main'
    }
  })
}
