import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { deepMerge } from '@/utils/index'
import { isEqual, cloneDeep } from 'lodash-es'
import { useBotStore } from './bot'
import type { BotSettingKey } from '~/utils/types'

export const useBotSettingStore = defineStore('botSetting', () => {
   const defaultSettings = {
    mev: false,
    gas: [
      {
        level: 1,
        customFee: '',
        isCustom: false,
        mev: true
      },
      {
        level: 1,
        customFee: '',
        isCustom: false,
        mev: false
      },
    ],
    slippage: '9',
    autoSell: false,
    buyValueList: ['0.1', '0.5', '1', '5'],
    sellPerList: ['25', '50', '75', '100'],
    isAutoSellConfig: false,
    //  autoSellConfig: [] as Array<{open: boolean, priceChange: number, sellRatio: number, type: 'default' | 'trailing' | 'migrated' | 'devsell', isUp?: boolean}>,
  }
  const chains = useBotStore().isSupportChains
  type Setting = typeof defaultSettings
  const settings: {
    [key in typeof chains[number]]?: {
      selected: BotSettingKey
      s1: Setting
      s2: Setting
      s3: Setting
    }
  } = {
  }
  chains.forEach(chain => {
    const s = { ...defaultSettings }
    if (chain === 'base') {
      s.buyValueList = ['0.01', '0.02', '0.5', '1']
    }
    settings[chain] = {
      selected: 's1',
      s1: s,
      s2: s,
      s3: s
    }
  })
  const botSettings = useLocalStorage('bot_settings_v3', settings, { mergeDefaults: (storageValue, defaults) => deepMerge(defaults, storageValue) })

  const autoSellConfigs = useLocalStorage('bot_autoSellConfigs', {
    autoSell: false,
    isAutoSellConfig: false,
    autoSellConfig: [
      {
        open: true,
        priceChange: 10000,
        sellRatio: 5000,
        type: 'default',
        isUp: true
      },
      {
        open: true,
        priceChange: -5000,
        sellRatio: 10000,
        type: "default",
        isUp: false
      }
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    isAutoSellConfig_devsell: false,
    autoSellConfig_devsell: null as {open: boolean, priceChange?: number, sellRatio?: number, type: 'devsell', isUp?: boolean} | null,
    isAutoSellConfig_trailing: false,
    autoSellConfig_trailing: null as {open: boolean, priceChange?: number, sellRatio?: number, type: 'trailing', isUp?: boolean} | null,
    isAutoSellConfig_migrated: false,
    autoSellConfig_migrated: null as {open: boolean, priceChange?: number, sellRatio?: number, type: 'migrated', isUp?: boolean} | null
  })

  const clipboardQuickInput = useLocalStorage<{
    [key in typeof chains[number]]?: string
  }>('bot_clipboardQuickInput', {
    base: '',
    eth: '',
    bsc: '',
    solana: ''
  })

  const autoSellConfig = computed(() => {
    const c: Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default' | 'trailing' | 'migrated' | 'devsell', isUp?: boolean}> = autoSellConfigs.value.isAutoSellConfig ? (autoSellConfigs.value.autoSellConfig?.filter?.(i => i.priceChange && i.sellRatio && i.open) || []) : []
    const c1 = autoSellConfigs.value.autoSellConfig_devsell
    if (autoSellConfigs.value.isAutoSellConfig_devsell && c1 && (c1.priceChange !== undefined) && c1.sellRatio && c1.open) {
      c.push(c1)
    }
    const c2 = autoSellConfigs.value.autoSellConfig_trailing
    if (autoSellConfigs.value.isAutoSellConfig_trailing && c2 && (c2.priceChange !== undefined) && c2.sellRatio && c2.open) {
      c.push(c2)
    }
    const c3 = autoSellConfigs.value.autoSellConfig_migrated
    if (autoSellConfigs.value.isAutoSellConfig_migrated && c3 && c3.sellRatio && c3.open) {
      c3.priceChange = 0
      c.push(c3)
    }
    return c?.map?.(i => {
      const { isUp, ...rest } = i
      return rest
    }) || []
  })

  const autoSellConfig_autoSell = computed(() => {
    return autoSellConfigs.value.autoSell && !autoSellConfig.value?.some?.(i => i.type === 'default' && i.priceChange === 10000 && i.sellRatio === 5000)
  })

  function watchBotSetting() {
    chains.forEach(i => {
      let previous = cloneDeep(botSettings.value[i])
      watch(() => botSettings.value[i], (val) => {
        if (!isEqual(val, previous)) {
          useBotStore().updateWebConfig({
            chain: i,
            webConfig: JSON.stringify(val)
          })
          previous = cloneDeep(val)
        }
      },
      { deep: true })
    })
    // watch(autoSellConfigs, (val, oldVal) => {
    //   const previous = cloneDeep(oldVal)
    //   if (isEqual(val, previous)) return
    //   useBotStore().updateWebConfig({
    //     chain: 'autoSellConfigs',
    //     webConfig: JSON.stringify(val)
    //   })
    // },
    // { deep: true })
  }

  watchBotSetting()

  return {
    botSettings,
    autoSellConfigs,
    autoSellConfig,
    autoSellConfig_autoSell,
    clipboardQuickInput
  }
})
