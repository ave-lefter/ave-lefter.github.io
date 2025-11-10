import { defineStore } from 'pinia'
import { getPerpMetadata as _getPerpMetadata } from '@/api/perp'
import { EdgeXSDK, type ApiKeyData, type L2KeyPair } from '@edgex-fe/typescript-sdk'
import { useLocalStorage } from '@vueuse/core'

type PerpMetadata = Awaited<ReturnType<typeof _getPerpMetadata>>

const sdk = new EdgeXSDK({
  // clientId: 'your-client-id',
})

export const usePerpStore = defineStore('perp', () => {
  const metadata = shallowRef<PerpMetadata | null>(null)
  const walletStore = useWalletStore()
  const _apiKeys = useLocalStorage<{[key: string]: ApiKeyData | null}>('perp_apiKeys', { })
  const _l2KeyPair = useLocalStorage<{[key: string]: L2KeyPair | null}>('perp_l2KeyPair', {})

  const apiKeys = computed(() => {
    if (!walletStore.address) {
      return null
    }
    return _apiKeys.value?.[walletStore.address] || null
  })

  const l2KeyPair = computed(() => {
    if (!walletStore.address) {
      return null
    }
    return _l2KeyPair.value?.[walletStore.address] || null
  })

  function getPerpMetadata() {
    _getPerpMetadata().then(res => {
      sdk.setMetadata(res)
      metadata.value = res
    })
  }

  function setApiKeys(ak: ApiKeyData, address: string = walletStore.address) {
    _apiKeys.value = {
      ..._apiKeys.value,
      [address]: ak
    }
  }

  function setL2KeyPair(lp: L2KeyPair, address: string = walletStore.address) {
    _l2KeyPair.value = {
      ..._l2KeyPair.value,
      [address]: lp
    }
  }

  function generateEdgeXAuthHeaders({
    method,
    path,
    params,
  }: {
    method: string
    path: string
    params?: { [key: string]: string }
  }) {
    return sdk.createAuthHeaders({
      method: method,
      path: path,
      timestamp: Date.now().toString(),
      params: params, // 可选的查询参数
    })
  }


  async function signAndGenerateAPIKeys() {
    let walletStore = useWalletStore()
    if (!walletStore.provider) {
      return
    }
    if (apiKeys.value) {
      return apiKeys.value
    }

    let metaConfig = metadata.value?.global
    const message = `action: ${metaConfig?.appName || ''} Onboard\nonlySignOn: ${metaConfig?.appOnlySignOn}`
    return walletStore.signMessage(message)?.then(async signature => {
      // 生成 API 密钥
      const apiKeys = sdk.generateApiKeyFromSignature(signature)
      sdk.setApiKeys(apiKeys)
      setApiKeys(apiKeys, walletStore.address)
      return apiKeys
    })
  }

  async function signAndGenerateL2KeyPair() {
    let walletStore = useWalletStore()
    if (!walletStore.provider) {
      return
    }
    if (l2KeyPair.value) {
      return l2KeyPair.value
    }
    let metaConfig = metadata.value?.global
    let clientAccountId = 'main'
    const message = `name: ${metaConfig?.appName}\nenvId: ${metaConfig?.appEnv}\naction: L2 Key\nonlySignOn: ${metaConfig?.appOnlySignOn}\nclientAccountId: ${clientAccountId}`
    return walletStore.signMessage(message)?.then(async signature => {
      // 生成 API 密钥
      const result = sdk.generateL2KeyPairFromSignature(signature)
      sdk.setL2KeyPair(result)
      setL2KeyPair(result, walletStore.address)
      return result
    })
  }



  return {
    metadata,
    apiKeys,
    l2KeyPair,
    getPerpMetadata,
    setApiKeys,
    setL2KeyPair,
    generateEdgeXAuthHeaders,
    signAndGenerateAPIKeys,
    signAndGenerateL2KeyPair
  }
})
