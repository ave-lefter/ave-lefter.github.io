import { cloneDeep } from 'lodash-es'

export default function useAutoSellConfig() {
  const botSettingStore = useBotSettingStore()
  const autoSellConfigs = ref(cloneDeep(botSettingStore.autoSellConfigs))

  function init() {
    autoSellConfigs.value = cloneDeep(botSettingStore.autoSellConfigs)
    if (!autoSellConfigs.value.autoSellConfig) {
      autoSellConfigs.value.autoSellConfig = [{
        open: true,
        priceChange: 100,
        sellRatio: 50,
        type: 'default',
        isUp: true
      }]
    } else {
      const config = autoSellConfigs.value.autoSellConfig
      if (Number(config?.length) > 0) {
        autoSellConfigs.value.autoSellConfig = config?.map?.(i => {
          return {
            open: i.open,
            priceChange: Math.floor(Math.abs(i.priceChange || 0) / 100) || undefined,
            sellRatio: Math.floor((i.sellRatio || 0) / 100) || undefined,
            type: i.type,
            isUp: !i.priceChange ? (i.isUp || false) : i.priceChange > 0
          }
        }) || []
      }
    }

    if (!autoSellConfigs.value.autoSellConfig_devsell) {
      autoSellConfigs.value.autoSellConfig_devsell = {
        open: true,
        priceChange: undefined,
        sellRatio: undefined,
        type: 'devsell',
        isUp: true
      }
    } else {
      const i = autoSellConfigs.value.autoSellConfig_devsell
      autoSellConfigs.value.autoSellConfig_devsell = {
        open: true,
        priceChange: i.priceChange === undefined ? undefined : Math.floor(Math.abs(i.priceChange || 0) / 100),
        sellRatio: Math.floor((i.sellRatio || 0) / 100) || undefined,
        type: 'devsell',
        isUp: true
      }
    }

    if (!autoSellConfigs.value.autoSellConfig_trailing) {
      autoSellConfigs.value.autoSellConfig_trailing = {
        open: true,
        priceChange: undefined,
        sellRatio: undefined,
        type: 'trailing',
        isUp: false
      }
    } else {
      const i = autoSellConfigs.value.autoSellConfig_trailing
      autoSellConfigs.value.autoSellConfig_trailing = {
        open: true,
        priceChange: Math.floor(Math.abs(i.priceChange || 0) / 100) || undefined,
        sellRatio: Math.floor((i.sellRatio || 0) / 100) || undefined,
        type: 'trailing',
        isUp: false
      }
    }

    if (!autoSellConfigs.value.autoSellConfig_migrated) {
      autoSellConfigs.value.autoSellConfig_migrated = {
        open: true,
        priceChange: 0,
        sellRatio: undefined,
        type: 'migrated',
        isUp: true
      }
    } else {
      const i = autoSellConfigs.value.autoSellConfig_migrated
      autoSellConfigs.value.autoSellConfig_migrated = {
        open: true,
        priceChange: 0,
        sellRatio: Math.floor((i.sellRatio || 0) / 100) || undefined,
        type: 'migrated',
        isUp: true
      }
    }
  }

  init()

  function save() {
    const config = cloneDeep(autoSellConfigs.value)
    config.autoSellConfig = config.autoSellConfig?.map?.(i => {
      return {
        open: i.open,
        priceChange: i.isUp ? Number(i?.priceChange || 0) * 100 : Number(i?.priceChange || 0) * -100,
        sellRatio: Number(i.sellRatio || 0) * 100,
        type: i.type,
        isUp: i.isUp
      }
    }) || []
    config.autoSellConfig_devsell = {
      open: config.autoSellConfig_devsell?.open || false,
      priceChange: config.autoSellConfig_devsell?.priceChange === undefined ? undefined : Math.floor(Math.abs(config.autoSellConfig_devsell?.priceChange || 0) * 100),
      sellRatio: Math.floor((config.autoSellConfig_devsell?.sellRatio || 0) * 100) || undefined,
      type: 'devsell'
    }
    config.autoSellConfig_trailing = {
      open: config.autoSellConfig_trailing?.open || false,
      priceChange: Math.floor(Math.abs(config.autoSellConfig_trailing?.priceChange || 0) * 100) || undefined,
      sellRatio: Math.floor((config.autoSellConfig_trailing?.sellRatio || 0) * 100) || undefined,
      type: 'trailing'
    }
    config.autoSellConfig_migrated = {
      open: config.autoSellConfig_migrated?.open || false,
      priceChange: 0,
      sellRatio: Math.floor((config.autoSellConfig_migrated?.sellRatio || 0) * 100) || undefined,
      type: 'migrated'
    }
    botSettingStore.autoSellConfigs = config
  }



  return {
    autoSellConfigs,
    loadAutoSellConfigs: init,
    saveAutoSellConfigs: save
  }
}
