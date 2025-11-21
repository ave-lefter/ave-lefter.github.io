import { defineStore } from 'pinia'
import type { PerpInfo } from '@/api/types/perp'
import { getPerpMetadata as _getPerpMetadata, onboardSite, type ProfitResponse } from '@/api/perp'
import { EdgeXSDK, type ApiKeyData, type L2KeyPair } from '@edgex-fe/typescript-sdk'
import { useLocalStorage } from '@vueuse/core'
import { usePerpWsPubStore } from './wsPub'
import { usePerpWsPrivateStore } from './wsPrivate'
import type { Collateral, Order, Position } from './type'

type PerpMetadata = Awaited<ReturnType<typeof _getPerpMetadata>>
type UserInfo = Awaited<ReturnType<typeof onboardSite>>['dataList'][0]
type ContractInfo = PerpMetadata['contractList'][number]

const sdk = new EdgeXSDK({
  // clientId: 'your-client-id',
})

export const usePerpStore = defineStore('perp', () => {
  const route= useRoute()
  const metadata = shallowRef<PerpMetadata | null>(null)
  const contractList = ref<Array<PerpInfo>>([])
  const loadingPerpMetadata = shallowRef(false)
  const walletStore = useWalletStore()
  const userInfo = ref<null | UserInfo>(null)
  const accountList = shallowRef<UserInfo[]>([])
  const collateral = ref<Collateral[]>([])
  const position = ref<Position[]>([])
  const order = ref<Order[]>([])
  const _perpKeys = useLocalStorage<{[key: string]: {apiKeys: ApiKeyData; l2KeyPair: L2KeyPair; apiSignature: string; starkSignature: string }}>('perp_keys', {})
  const totalAssets = ref<ProfitResponse>({} as ProfitResponse)
  const lastPrice= shallowRef(0)
  const resolution = useLocalStorage('tv_resolution', '15')

  const apiKeys = computed(() => {
    if (!walletStore.address) {
      return null
    }
    return _perpKeys.value?.[walletStore.address]?.apiKeys || null
  })

  const l2KeyPair = computed(() => {
    if (!walletStore.address) {
      return null
    }
    return _perpKeys.value?.[walletStore.address]?.l2KeyPair || null
  })
  const perpKeys = computed(() => {
    return _perpKeys.value?.[walletStore.address] || null
  })

  const isLogin = computed(() => {
    return !!apiKeys.value && !!l2KeyPair.value
  })
  const contractName = computed(() => {
    console.log('-----------contractName--------', (route.params.name as string) || 'BTCUSD')
    return (route.params.name as string) || 'BTCUSD'
  })
  const perp = computed(() => {
    return contractList?.value?.find((item) => item.contractName === contractName.value) || null
  })
  const contractId = computed(() => {
    return perp?.value?.contractId || '10000001'
  })
  function getPerpMetadata() {
    loadingPerpMetadata.value = true
    _getPerpMetadata().then(res => {
      sdk.setMetadata(res)
      metadata.value = res
      getOnboardSite().then(() => {
        usePerpWsPrivateStore().init()
      })
      res.contractList =
        res?.contractList?.map((item) => ({
          ...item,
          iconUrl: res?.coinList?.find((coin) => coin.coinId === item.baseCoinId)?.iconUrl || '',
          baseCoinName:
            res?.coinList?.find((coin) => coin.coinId === item.baseCoinId)?.coinName || '',
          quoteCoinName:
            res?.coinList?.find((coin) => coin.coinId === item.quoteCoinId)?.coinName || '',
        })) || []
    }).finally(() => {
      loadingPerpMetadata.value = false
    })
    usePerpWsPubStore().init()
  }

  function setApiKeys(ak: ApiKeyData, address: string = walletStore.address) {
    if (!_perpKeys.value?.[address]) {
      _perpKeys.value[address] = {} as any
    }
    _perpKeys.value = {
      ..._perpKeys.value,
      [address]: {
        ..._perpKeys.value?.[address],
        apiKeys: ak
      }
    }
  }

  function setL2KeyPair(lp: L2KeyPair, address: string = walletStore.address) {
    if (!_perpKeys.value?.[address]) {
      _perpKeys.value[address] = {} as any
    }
    _perpKeys.value = {
      ..._perpKeys.value,
      [address]: {
        ..._perpKeys.value?.[address],
        l2KeyPair: lp
      }
    }
  }

  function setApiSignature(apiSignature: string, address: string = walletStore.address) {
    if (!_perpKeys.value?.[address]) {
      _perpKeys.value[address] = {} as any
    }
    _perpKeys.value = {
      ..._perpKeys.value,
      [address]: {
        ..._perpKeys.value?.[address],
        apiSignature
      }
    }
  }

  function setStarkSignature(starkSignature: string, address: string = walletStore.address) {
    if (!_perpKeys.value?.[address]) {
      _perpKeys.value[address] = {} as any
    }
    _perpKeys.value = {
      ..._perpKeys.value,
      [address]: {
        ..._perpKeys.value?.[address],
        starkSignature
      }
    }
  }

  function generateEdgeXAuthHeaders(data: {
    method: string
    path: string
    params?: { [key: string]: string },
    body?: { [key: string]: string },
    timestamp?: string
  }) {
    if (!perpKeys.value?.apiSignature || !perpKeys.value?.l2KeyPair) {
      return {}
    }
    return sdk.createAuthHeaders({
      timestamp: Date.now().toString(),
      ...data
    })
  }

  const apiSignatureLoading = ref<boolean>(false)
  async function signAndGenerateAPIKeys() {
    const walletStore = useWalletStore()
    if (!walletStore.provider) {
      return
    }
    if (apiKeys.value) {
      return apiKeys.value
    }

    const metaConfig = metadata.value?.global
    const message = `action: ${metaConfig?.appName || ''} Onboard\nonlySignOn: ${metaConfig?.appOnlySignOn}`
    apiSignatureLoading.value = true
    return walletStore.signMessage(message)?.then(async signature => {
      // 生成 API 密钥
      const apiKeys = sdk.generateApiKeyFromSignature(signature)
      setApiSignature(signature)
      sdk.setApiKeys(apiKeys)
      setApiKeys(apiKeys, walletStore.address)
      apiSignatureLoading.value = false
      return apiKeys
    }).catch((err) => {
      apiSignatureLoading.value = false
      return Promise.reject(err)
    })
  }

  const starkSignatureLoading = ref<boolean>(false)
  async function signAndGenerateL2KeyPair() {
    const walletStore = useWalletStore()
    if (!walletStore.provider) {
      return
    }
    if (l2KeyPair.value) {
      return l2KeyPair.value
    }
    const metaConfig = metadata.value?.global
    const clientAccountId = 'main'
    const message = `name: ${metaConfig?.appName}\nenvId: ${metaConfig?.appEnv}\naction: L2 Key\nonlySignOn: ${metaConfig?.appOnlySignOn}\nclientAccountId: ${clientAccountId}`
    starkSignatureLoading.value = true
    return walletStore.signMessage(message)?.then(async signature => {
      // 生成 API 密钥
      const result = sdk.generateL2KeyPairFromSignature(signature)
      setStarkSignature(signature)
      sdk.setL2KeyPair(result)
      setL2KeyPair(result, walletStore.address)
      starkSignatureLoading.value = false
      return result
    }).catch((err) => {
      starkSignatureLoading.value = false
      return Promise.reject(err)
    })
  }

  function login() {
    return signAndGenerateAPIKeys().then(async() => {
      await sleep(500)
      return signAndGenerateL2KeyPair().then(() => {
        return getOnboardSite()
      })
    })
  }

  async function getOnboardSite() {
    if (!perpKeys.value?.apiSignature || !perpKeys.value?.l2KeyPair) {
      return []
    }
    if (apiKeys.value) {
      sdk.setApiKeys(apiKeys.value)
    }
    if (l2KeyPair.value) {
      sdk.setL2KeyPair(l2KeyPair.value)
    }
    return onboardSite().then(async res => {
      if (res) {
        accountList.value = res?.dataList || []
        userInfo.value = res?.dataList?.[0] || null
        usePerpWsPrivateStore().init()
      }
      return res
    })
  }

  function resetUserInfo() {
    userInfo.value = null
    accountList.value = []
    collateral.value = []
    position.value = []
    order.value = []
    usePerpWsPrivateStore().close?.()
  }

  function getSdk() {
    return sdk
  }

  return {
    metadata,
    apiKeys,
    l2KeyPair,
    perpKeys,
    _perpKeys,
    isLogin,
    userInfo,
    collateral,
    position,
    order,
    apiSignatureLoading,
    starkSignatureLoading,
    login,
    getPerpMetadata,
    getOnboardSite,
    setApiKeys,
    setL2KeyPair,
    generateEdgeXAuthHeaders,
    signAndGenerateAPIKeys,
    signAndGenerateL2KeyPair,
    loadingPerpMetadata,
    contractList,
    perp,
    contractName,
    totalAssets,
    contractId,
    resolution,
    getSdk,
    resetUserInfo
  }
})
