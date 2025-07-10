import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { getGlobalConfig as _getGlobalConfig,  getChainConfig as _getChainConfig } from '@/api/config'
import chains from '@/utils/json/chains.json'
import configs from '@/utils/json/config.json'

type GlobalConfig = Awaited<ReturnType<typeof _getGlobalConfig>>
type ChainConfig = Awaited<ReturnType<typeof _getChainConfig>>

export const useConfigStore = defineStore('config', () => {
  const chainConfig = useLocalStorage('chainConfig', chains as ChainConfig)
  const globalConfig = useLocalStorage('globalConfig', configs as GlobalConfig)

  function getGlobalConfig() {
    const time = Number(localStorage.globalConfig_time || 0)
    if (time && (Date.now() - time < 3600 * 1000)) {
      return
    }
    _getGlobalConfig().then(res => {
      localStorage.globalConfig_time = Date.now()
      globalConfig.value = res
    })
  }
  function getChainConfig() {
    const time = Number(localStorage.chainConfig_time || 0)
    if (time && (Date.now() - time < 3600 * 1000)) {
      return
    }

    _getChainConfig().then(res => {
      localStorage.chainConfig_time = Date.now()
      chainConfig.value = res
    })
  }

  return {
    chainConfig,
    globalConfig,
    getGlobalConfig,
    getChainConfig,
    token_logo_url: globalConfig.value.token_logo_url || 'https://www.iconaves.com/'
  }
})
