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
    buyValueList: ['0.01', '0.02', '0.5', '1', '0.1', '0.25', '2', '5'],
    sellPerList: ['25', '50', '75', '100', '0', '0', '0', '0'],
    isAutoSellConfig: false,
    isAutoSellConfig1: false,
    isAutoSellConfig2: false,
    isAutoSellConfig3: false,
    isAutoSellConfig4: false,
    isAutoSellConfig5: false,
    isAutoSellConfig6: false,
  }
  const chains = useBotStore().isSupportChains
  type Setting = typeof defaultSettings
  const settings: {
    [key in typeof chains[number]]?: {
      selected: BotSettingKey
      s1: Setting
      s2: Setting
      s3: Setting
      buy?: {
        selected: BotSettingKey
        s1: Setting
        s2: Setting
        s3: Setting
      }
      sell?: {
        selected: BotSettingKey
        s1: Setting
        s2: Setting
        s3: Setting
      }
    }
  } = {}
  chains.forEach(chain => {
    const s = { ...defaultSettings }
    // if (chain === 'base') {
    //   s.buyValueList = ['0.01', '0.02', '0.5', '1']
    // }
    settings[chain] = {
      selected: 's1',
      s1: s,
      s2: s,
      s3: s,
      buy: {
        selected: 's1',
        s1: s,
        s2: s,
        s3: s,
      },
      sell: {
        selected: 's1',
        s1: s,
        s2: s,
        s3: s,
      },
    }
  })
  const botSettings = useLocalStorage('bot_settings_v4', settings, { mergeDefaults: (storageValue, defaults) => deepMerge(defaults, storageValue) })
  chains.forEach(chain => {
    if (botSettings.value[chain]) {
      const settings = botSettings.value[chain]
      if (!botSettings.value[chain].buy) {
        botSettings.value[chain].buy = {
          selected: settings.selected,
          s1: settings.s1,
          s2: settings.s2,
          s3: settings.s3,
        }
      } else {
        // 兼容旧数据
        const buySettings = botSettings.value[chain].buy!;
        (['s1', 's2', 's3'] as BotSettingKey[]).forEach(sKey => {
          if (buySettings?.[sKey]?.buyValueList?.length === 4) {
            buySettings[sKey].buyValueList.push('0.1', '0.25', '2', '5')
          }
          if (buySettings?.[sKey]?.buyValueList?.length > 8) {
            buySettings[sKey].buyValueList = defaultSettings.buyValueList
          }
        })
      }
      if (!botSettings.value[chain].sell) {
        botSettings.value[chain].sell = {
          selected: settings.selected,
          s1: settings.s1,
          s2: settings.s2,
          s3: settings.s3,
        }
      } else {
        // 兼容旧数据
        const sellSettings = botSettings.value[chain].sell!;
        (['s1', 's2', 's3'] as BotSettingKey[]).forEach(sKey => {
          if (sellSettings?.[sKey]?.sellPerList?.length === 4) {
           sellSettings[sKey].sellPerList.push('', '', '', '')
          }
        })
      }
    }
  })

  const autoSellConfigs = useLocalStorage('bot_autoSellConfigs_v2', {
    autoSellConfigName:'',
    autoSell: false,
    // 自定义
    isAutoSellConfig: false,
    autoSellConfig: [
      {
        open: true,
        priceChange: 10000,
        sellRatio: 5000,
        type: 'default',
        isUp: true
      }
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    // 翻倍全出
    isAutoSellConfig1: false,
    autoSellConfig1: [
      {
        open: true,
        priceChange: 10000,
        sellRatio: 10000,
        type: 'default',
        isUp: true
      },
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    // 翻倍出本&跌半止损
    isAutoSellConfig2: false,
    autoSellConfig2: [
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
        type: 'default',
        isUp: false
      }
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    // 翻倍全出&跌半止损
    isAutoSellConfig3: false,
    autoSellConfig3: [
      {
        open: true,
        priceChange: 10000,
        sellRatio: 10000,
        type: 'default',
        isUp: true
      },
      {
        open: true,
        priceChange: -5000,
        sellRatio: 10000,
        type: 'default',
        isUp: false
      }
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    // 翻倍出本&三倍全出&跌半止损
    isAutoSellConfig4: false,
    autoSellConfig4: [
      {
        open: true,
        priceChange: 10000,
        sellRatio: 5000,
        type: 'default',
        isUp: true
      },
      {
        open: true,
        priceChange: 20000,
        sellRatio: 10000,
        type: 'default',
        isUp: true
      },
      {
        open: true,
        priceChange: -5000,
        sellRatio: 10000,
        type: 'default',
        isUp: false
      }
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    // 10倍止盈&移动止盈止损回撤40%全出
    isAutoSellConfig5: false,
    autoSellConfig5: [
      {
        open: true,
        priceChange: 90000,
        sellRatio: 10000,
        type: 'default',
        isUp: true
      },
      {
        open: true,
        priceChange: -4000,
        sellRatio: 10000,
        type: 'default',
        isUp: false
      }
    ] as Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>,
    // 40%止盈&移动止盈止损回撤60%全出
    isAutoSellConfig6: false,
    autoSellConfig6: [
      {
        open: true,
        priceChange: 4000,
        sellRatio: 10000,
        type: 'default',
        isUp: true
      },
      {
        open: true,
        priceChange: -6000,
        sellRatio: 10000,
        type: 'default',
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
  const autoSellConfigFn= (isAutoSellConfig: boolean,autoSellConfig: Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default' | 'trailing' | 'migrated' | 'devsell', isUp?: boolean}>) => {
     const c: Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default' | 'trailing' | 'migrated' | 'devsell', isUp?: boolean}> = isAutoSellConfig ? (autoSellConfig?.filter?.(i => i.priceChange && i.sellRatio && i.open) || []) : []
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
  }
  const autoSellConfig = computed(() => {
    return autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig,autoSellConfigs.value.autoSellConfig)
  })
  const autoSellConfig1 = computed(() => {
   return  autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig1,autoSellConfigs.value.autoSellConfig1)
  })
  const autoSellConfig2 = computed(() => {
    return autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig2,autoSellConfigs.value.autoSellConfig2)
  })
  const autoSellConfig3 = computed(() => {
    return autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig3,autoSellConfigs.value.autoSellConfig3)
  })
  const autoSellConfig4 = computed(() => {
    return autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig4,autoSellConfigs.value.autoSellConfig4)
  })
  const autoSellConfig5 = computed(() => {
    return autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig5,autoSellConfigs.value.autoSellConfig5)
  })
  const autoSellConfig6 = computed(() => {
    return autoSellConfigFn(autoSellConfigs.value.isAutoSellConfig6,autoSellConfigs.value.autoSellConfig6)
  })

  function getAutoSellConfigCurrent() {
    let autoSellConfigCurrent:Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default' | 'trailing' | 'migrated' | 'devsell', isUp?: boolean}> =  autoSellConfig.value
    if ((autoSellConfigs.value.autoSellConfigName === '') && autoSellConfigs.value.isAutoSellConfig) {
      autoSellConfigCurrent = autoSellConfig.value
    } else if ((autoSellConfigs.value.autoSellConfigName === '1') && autoSellConfigs.value.isAutoSellConfig1) {
      autoSellConfigCurrent = autoSellConfig1.value
    } else if ((autoSellConfigs.value.autoSellConfigName === '2') && autoSellConfigs.value.isAutoSellConfig2) {
      autoSellConfigCurrent = autoSellConfig2.value
    } else if ((autoSellConfigs.value.autoSellConfigName === '3') && autoSellConfigs.value.isAutoSellConfig3) {
      autoSellConfigCurrent = autoSellConfig3.value
    } else if ((autoSellConfigs.value.autoSellConfigName === '4') && autoSellConfigs.value.isAutoSellConfig4) {
      autoSellConfigCurrent = autoSellConfig4.value
    } else if ((autoSellConfigs.value.autoSellConfigName === '5') && autoSellConfigs.value.isAutoSellConfig5) {
      autoSellConfigCurrent = autoSellConfig5.value
    } else if ((autoSellConfigs.value.autoSellConfigName === '6') && autoSellConfigs.value.isAutoSellConfig6) {
      autoSellConfigCurrent = autoSellConfig6.value
    }
    return autoSellConfigCurrent
  }

  const selectedAutoSellConfig = computed(getAutoSellConfigCurrent)

  const autoSellConfig_autoSell = computed(() => {
    const autoSellConfigCurrent=getAutoSellConfigCurrent()
    return autoSellConfigs.value.autoSell && !autoSellConfigCurrent?.some?.(i => i.type === 'default' && i.priceChange === 10000 && i.sellRatio === 5000)
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
    autoSellConfig1,
    autoSellConfig2,
    autoSellConfig3,
    autoSellConfig4,
    autoSellConfig5,
    autoSellConfig6,
    autoSellConfig_autoSell,
    selectedAutoSellConfig,
    clipboardQuickInput
  }
})
