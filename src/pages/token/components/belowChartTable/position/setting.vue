<template>
  <div v-if="botStore?.userInfo?.evmAddress && botStore?.isSupportChains?.includes(props.chain)"  class="tabs-1 mr-5px">
    <button v-for="item in BotSettingsArr" :key="item.value" class="hover:bg-[--tab-active-bg]! hover:text-[--main-text1]!" :class="{'active': item.value === botSettingStore?.botSettings?.[props.chain]?.[swapType]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)" @mouseenter="showPopover(item.value)"
      @mouseleave="visible = false" :ref="setBtnRef" :id="item.value"
    >{{ item.label }}</button>
    <el-popover
      v-model:visible="visible"
      popper-class="new-popover"
      :virtual-ref="currentBtnRef"
      virtual-triggering
      trigger="contextmenu"
      placement="bottom"
      popper-style="min-width: auto; width: auto;"
      :persistent="false"
    >
      <ul class="text-12px">
        <li class="mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('slippage')" name="custom:slippage" class="color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text]">{{ $t('slippage') }}</span>
          <span v-if="botSettingStore.botSettings?.[props.chain || '']?.[props.swapType]?.[selected]?.slippage !== 'auto'">
            {{
              botSettingStore.botSettings?.[props.chain || '']?.[props.swapType]?.[selected]?.slippage
            }}%</span>
          <span v-else>{{ $t('auto') }}</span>
        </li>
        <li v-if="isEvmChain(props.chain || '')" class="mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text]">{{ $t('estimatedGas') }}</span>
          ${{ getEstimatedGas() }}
        </li>
        <li v-if="chain === 'solana'" class="mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('priorityFee')" name="custom:gas" class="text-14px color-[--third-text] mr-6px cursor-pointer ml-0"/>
          <span class="mr-4px color-[--third-text] whitespace-nowrap block">{{ $t('priorityFee') }}</span>
          <span class="whitespace-nowrap">{{ botPriorityFee }} SOL</span>
        </li>
        <li class="mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('autoSellHalf')" :name="`custom:half-${globalStore.mode}`" class="text-18px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text] whitespace-nowrap">{{ $t('autoSellHalf') }}</span>
          {{  botSettingStore.autoSellConfigs?.autoSell ? $t('on') : $t('off') }}
        </li>

        <li class="mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('mev')" name="custom:mev" class="text-16px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text]">{{ $t('mev') }}</span>
          {{  botSettingStore.botSettings?.[chain]?.[props.swapType]?.[selected]?.mev ? $t('on')  : $t('off') }}
        </li>

      </ul>
    </el-popover>
  </div>
</template>

<script setup lang='ts'>
import BigNumber from 'bignumber.js'
const props = defineProps({
  chain: {
    type: String as PropType<BotChain>,
    default: ''
  },
  swapType: {
    type: String as PropType<'sell' | 'buy'>,
    default: 'sell'
   }
})
const botStore = useBotStore()
const botSettingStore = useBotSettingStore()
const botSwapStore = useBotSwapStore()
function onSelectBotSwapSet(item: string) {
  if (botSettingStore?.botSettings?.[props.chain]) {
    (botSettingStore.botSettings[props.chain]![props.swapType] as any).selected = item
  }
}

const globalStore = useGlobalStore()
const gasPrice = shallowRef(0)

const visible = ref(false)
const selected = ref<BotSettingKey>('s1')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)
const tokenStore = useTokenStore()

function setBtnRef(el: HTMLElement | null) {
  if (el && el?.id) {
    btnRefs.value[el?.id] = el
  }
}

function showPopover(item: BotSettingKey) {
  selected.value = item
  currentBtnRef.value = btnRefs.value[item] || null
  visible.value = true
  getGasPrice()
}

function getGasPrice() {
  const chain = props.chain
  if (!isEvmChain(chain)) {
    return
  }
  getRpcProvider(chain)?.getFeeData().then(res => {
    if (res) {
      gasPrice.value = new BigNumber(res.gasPrice || 0).toNumber()
    }
  })
}

function getEstimatedGas() {
  const chain = props.chain
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.[props.swapType]?.[selected.value]
    const mev = botSettings?.mev
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    return formatNumber(new BigNumber(gasPrice.value).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}

const botPriorityFee = computed(() => {
  const chain = props.chain
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const botSettings = botSettingStore.botSettings?.[chain]?.[props.swapType]?.[selected.value]
  const mev = botSettings?.mev

  const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})


</script>

<style scoped lang='scss'>
  .tabs-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--main-input-button-bg);
    padding: 2px;
    border-radius: 4px;
    font-size: 12px;
    height: 24px;
    button {
      border: none;
      color: var(--third-text);
      letter-spacing: 0;
      font-weight: 400;
      cursor: pointer;
      border-radius: 4px;
      background: transparent;
      min-width: 32px;
      height: 20px;
      text-align: center;
      &.active {
        background: var(--tab-active-bg) !important;
        color: var(--primary-color) !important;
      }
    }
  }

</style>
