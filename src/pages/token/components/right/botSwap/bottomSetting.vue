<template>
  <div class="mt-10px flex items-center text-11px color-[--main-text]">
    <template v-if="botSettings[chain || ''] && isCanMev">
      <span class=" color-[--third-text] mr-4px cursor-pointer">{{ $t('mev') }}</span>
      <el-switch
        v-if="chain === 'solana'"
        v-model="botSettings.solana![activeTab]![selected]!.mev"
        class="mr-auto"
        style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px;"
        size="small"
        :before-change="solanaMevBeforeChange"
      />
      <el-switch
        v-else-if="isEvmChain(chain || '')"
        v-model="botSettings[chain]![activeTab]![selected].mev"
        class="mr-auto"
        style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px"
        size="small"
      />
    </template>
    <Icon v-tooltip="$t('slippage')" name="custom:slippage" class="text-12px color-[--third-text] mr-4px cursor-pointer" />
    <span v-if="botSettings?.[chain || '']?.[activeTab]?.[selected]?.slippage !== 'auto'">{{ botSettings?.[chain || '']?.[activeTab]?.[selected]?.slippage }}%</span>
    <span v-else>{{ $t('auto') }}</span>
    <template v-if="isEvmChain(chain || '') && gasPrice">
      <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="text-12px color-[--third-text] ml-auto mr-4px cursor-pointer" />
      <span>${{ getEstimatedGas() }}</span>
    </template>
    <template v-if="chain === 'solana'">
      <Icon v-tooltip="$t('priorityFee')" name="custom:gas" class="text-12px color-[--third-text] ml-auto mr-4px cursor-pointer" />
      <span>{{ botPriorityFee }} SOL</span>
    </template>
    <template v-if="activeTab === 'buy' && swapType === 'market' && (botSettings?.[chain || ''] || botSettings?.[chain || '']?.[activeTab])">
      <span class="mr-4px ml-auto color-[--third-text]">{{ $t('autoSellHalf') }}</span>
      <el-switch
        v-model="botSettingStore.autoSellConfigs.autoSell"
        size="small"
        style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px;"
      />
    </template>
  </div>
</template>

<script setup lang='ts'>
import BigNumber from 'bignumber.js'
const props = defineProps({
  gasPrice: {
    type: Number,
    default: 0
  },
  activeTab: {
    type: String as PropType<'buy' | 'sell'>,
    default: 'buy'
  },
  swapType: {
    type: String,
    default: 'market'
  }
})
const botSettingStore = useBotSettingStore()
const { botSettings } = storeToRefs(botSettingStore)
const botSwapStore = useBotSwapStore()
const botStore = useBotStore()
const { t } = useI18n()

const route = useRoute()
const tokenStore = useTokenStore()

const tokenInfo = computed(() => tokenStore.token)

const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  return (routeParams?.chain || tokenInfo.value?.chain) as BotChain
})


function getChain() {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenInfo.value?.chain || ''
  return chain as BotChain
}

const isCanMev = computed(() => {
  const chain = getChain()
  const { gasTip1List } = formatBotGasTips(botSwapStore?.gasTip, chain)
  return gasTip1List?.length > 1
})

function solanaMevBeforeChange() {
  const selected = botSettingStore.botSettings?.solana?.[props.activeTab]?.selected || botSettingStore.botSettings?.solana?.selected || 's1'
  const botSettings = botSettingStore.botSettings?.solana?.[props.activeTab]?.[selected]
  if (!botSettings?.mev && !botStore.bundleAvailable) {
    ElMessage({ type: 'warning', message: t('mevPending') })
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
}

function getEstimatedGas() {
  const chain = getChain()
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    // let botSettings = this.botSettings?.[this.chain]?.[] || {}
    const selected = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore.botSettings?.[chain]?.selected || 's1'
    const botSettings = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.[selected]
    const mev = botSettings?.mev
    const _nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || 0
    const nativePrice = (tokenStore.swap.payToken.address === 'sol' || tokenStore.swap.token.address === NATIVE_TOKEN) ? _nativePrice : tokenStore.swap.payToken.price || 0
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    return formatNumber(new BigNumber(props.gasPrice).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}

const botPriorityFee = computed(() => {
  const chain = getChain()
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  // const selected = botSettingStore?.botSettings?.[chain]?.selected as BotSettingKey
  const selected = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore.botSettings?.[chain]?.selected || 's1'
  const botSettings = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.[selected]
  const mev = botSettings?.mev
  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})

const selected = computed(() => {
  const chain = getChain()
  if (!botStore.isSupportChains.includes(chain)) {
    return '' as BotSettingKey
  }
  return botSettingStore.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore.botSettings?.[chain]?.selected || 's1'
})

</script>

<style>

</style>
