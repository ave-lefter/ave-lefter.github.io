import { cloneDeep } from 'lodash-es'

export default function useAutoSellConfig() {
  const botSettingStore = useBotSettingStore()
  const autoSellConfigs = ref(cloneDeep(botSettingStore.autoSellConfigs))

 

  function initAutoSellConfig(autoSellConfig: typeof autoSellConfigs.value['autoSellConfig']) {
    let newVal:Array<{open: boolean, priceChange?: number, sellRatio?: number, type: 'default', isUp?: boolean}>=[]
    if (!autoSellConfig) {
        newVal = [{
          open: true,
          priceChange: 100,
          sellRatio: 50,
          type: 'default',
          isUp: true
        }]
      } else {
        const config = autoSellConfig
        if (Number(config?.length) > 0) {
          newVal = config?.map?.(i => {
            return {
              open: i.open,
              priceChange: Math.floor(Math.abs(i.priceChange || 0) / 100) || undefined,
              sellRatio: Math.floor((i.sellRatio || 0) / 100) || undefined,
              type: i.type,
              isUp: !i.priceChange ? (i.isUp || false) : i.priceChange > 0
            }
          }) || []
        }else{
          return autoSellConfig
        }
      }
      return newVal
  }
  function init() {
    autoSellConfigs.value = cloneDeep(botSettingStore.autoSellConfigs)
    autoSellConfigs.value.autoSellConfig=initAutoSellConfig(autoSellConfigs.value.autoSellConfig)
    autoSellConfigs.value.autoSellConfig1=initAutoSellConfig(autoSellConfigs.value.autoSellConfig1)
    autoSellConfigs.value.autoSellConfig2=initAutoSellConfig(autoSellConfigs.value.autoSellConfig2)
    autoSellConfigs.value.autoSellConfig3=initAutoSellConfig(autoSellConfigs.value.autoSellConfig3)
    autoSellConfigs.value.autoSellConfig4=initAutoSellConfig(autoSellConfigs.value.autoSellConfig4)
    autoSellConfigs.value.autoSellConfig5=initAutoSellConfig(autoSellConfigs.value.autoSellConfig5)
    autoSellConfigs.value.autoSellConfig6=initAutoSellConfig(autoSellConfigs.value.autoSellConfig6)

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

  const mapAutoSellConfig = (configs: typeof autoSellConfigs.value['autoSellConfig']) => configs?.map?.(i => ({
    open: i.open,
    priceChange: i.isUp ? Number(i?.priceChange || 0) * 100 : Number(i?.priceChange || 0) * -100,
    sellRatio: Number(i.sellRatio || 0) * 100,
    type: i.type,
    isUp: i.isUp
  })) || []
  function save() {
    const config = cloneDeep(autoSellConfigs.value)
    config.autoSellConfigName = botSettingStore.autoSellConfigs.autoSellConfigName
    config.autoSellConfig = mapAutoSellConfig(config.autoSellConfig)
    config.autoSellConfig1 = mapAutoSellConfig(config.autoSellConfig1)
    config.autoSellConfig2 = mapAutoSellConfig(config.autoSellConfig2)
    config.autoSellConfig3 = mapAutoSellConfig(config.autoSellConfig3)
    config.autoSellConfig4 = mapAutoSellConfig(config.autoSellConfig4)
    config.autoSellConfig5 = mapAutoSellConfig(config.autoSellConfig5)
    config.autoSellConfig6 = mapAutoSellConfig(config.autoSellConfig6)
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
    console.log('saveautoSellConfigs', config)
    botSettingStore.autoSellConfigs = config
  }



  return {
    autoSellConfigs,
    loadAutoSellConfigs: init,
    saveAutoSellConfigs: save
  }
}
