export function useAutoSellSettingContent() {
  const botSettingStore = useBotSettingStore()
  const { autoSellConfigs, loadAutoSellConfigs } = useAutoSellConfig()

  watch(() => botSettingStore.autoSellConfigs, () => {
    loadAutoSellConfigs()
  })

  const autoSellConfig = computed(() => {
    const c: {
      open: boolean
      index?: number
      priceChange?: number | undefined
      sellRatio?: number | undefined
      type: 'default'
      isUp?: boolean | undefined
    }[] = autoSellConfigs.value.autoSellConfig
    let k1 = 0
    let k2 = 0
    c.forEach((i) => {
      if (i.isUp) {
        k1 = k1 + 1
        i.index = k1
      } else {
        k2 = k2 + 1
        i.index = k2
      }
    })
    return c || []
  })


  const isAutoSellConfig = computed(() => {
    return botSettingStore.autoSellConfig_autoSell || botSettingStore.autoSellConfig?.length > 0
  })

  return {
    autoSellConfig,
    isAutoSellConfig,
    botSettingStore,
    autoSellConfigs
  }
}
