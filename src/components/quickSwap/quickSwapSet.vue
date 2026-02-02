<template>
  <div class="items-center inline-flex">
    <span v-if="quickTextVisible" class="w-14px h-14px bg-[--secondary-text] rounded-full flex items-center justify-center mr-5px">
      <Icon
        class="color-[--main-bg] text-10px"
        name="mynaui:lightning-solid"
      />
    </span>
    <span v-else v-tooltip="$t('quick')" class="w-14px h-14px bg-[--secondary-text] rounded-full flex items-center justify-center mr-5px">
      <Icon
        class="color-[--main-bg] text-10px"
        name="mynaui:lightning-solid"
      />
    </span>
    <span v-if="quickTextVisible" class="mr-5px color-[--secondary-text] text-12px">{{ $t('quick') }}</span>
    <el-input
      v-model.trim="quickBuyValue1"
      style="
          /* background: var(--d-151A22-l-E8F1FF); */
          /* --el-input-bg-color: var(--d-151A22-l-E8F1FF); */
          /* --el-input-border-color: var(--d-151A22-l-E8F1FF);
          --el-input-hover-border-color: #3F80F7; */
          --el-input-text-color: var(--main-text);
          border-radius: 4px;
          width: 88px;
          height: 28px;
        "
      placeholder="0"
      clearable
      type="text"
      @input="(value) => {
            quickBuyValue1 = value.replace(/\-|[^\d.]/g, '')
      }"
      @blur="handleBlurBuyValue(quickBuyValue1)"
      @keydown.enter="e => e?.target?.blur()"
      >
      <template #prefix>
        <img
          v-if="chain"
          class="rounded-full w-14px h-14px mr-4px!"
          :src="`${configStore.token_logo_url}chain/${chain}.png`"
          alt=""
          onerror="this.src='/icon-default.png'"
          srcset=""
        >
      </template>
    </el-input>
    <div
      v-if="isQuickSupported&&settingsButtonVisible1"
      class="ml-20px flex justify-end items-center text-12px">
      <span class="color-[--secondary-text] mr-5px">{{ $t('default') }}</span>
      <div
        class="flex items-center justify-between p-1px rounded-4px text-12px h-28px bg-[--main-input-button-bg] px-2px py-2px">

        <button
          v-for="item in BotSettingsArr"
          :id="item.value"
          :key="item.value"
          :ref="setBtnRef"
          class="cursor-pointer border-none font-400 rounded-4px min-w-36px py-5px px-10px text-center"
          :class="`${item.value === botSettingStore.botSettings?.[chain]?.buy?.selected?'color-[--main-text] bg-[--tab-active-bg]':'color-[--secondary-text] bg-transparent'}`"
          type="button"
          @click.stop="botSettingStore.botSettings[chain]!.buy!.selected = item.value"
          @mouseenter="showPopover(item.value)"
          @mouseleave="visible = false"

        >
          {{ item.label }}
        </button>
      </div>
    </div>
    <SlippageSet
      v-if="isQuickSupported"
      class="ml-12px"
      :chain="chain"
      :setting="botSettingStore?.botSettings[chain]"
      :showQuickAmount="showQuickAmount"
    />
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
      <ul>
        <li class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('slippage')" name="custom:slippage" class="text-14px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text] text-14px">{{ $t('slippage') }}</span>
          <span v-if="botSettingStore.botSettings?.[chain]?.buy?.[selected]?.slippage !== 'auto'">
            {{
              botSettingStore.botSettings?.[chain || '']?.buy?.[selected]?.slippage
            }}%</span>
          <span v-else>{{ $t('auto') }}</span>
        </li>
        <li v-if="isEvmChain(chain || '')" class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="text-14px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text] text-14px">{{ $t('estimatedGas') }}</span>
          ${{ getEstimatedGas() }}
        </li>
        <li v-if="chain === 'solana'" class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('priorityFee')" name="custom:gas" class="text-14px color-[--third-text] mr-6px cursor-pointer ml-0"/>
          <span class="mr-4px color-[--third-text] text-14px whitespace-nowrap block">{{ $t('priorityFee') }}</span>
          <span class="whitespace-nowrap">{{ botPriorityFee }} SOL</span>
        </li>
        <li class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('autoSellHalf')" :name="`custom:half-${globalStore.mode}`" class="text-18px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text] text-14px whitespace-nowrap">{{ $t('autoSellHalf') }}</span>
          {{  botSettingStore.autoSellConfigs?.autoSell ? $t('on') : $t('off') }}
        </li>

        <li class="text-14px mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('mev')" name="custom:mev" class="text-16px color-[--third-text] ml-0 mr-6px cursor-pointer"/>
          <span class="mr-4px color-[--third-text] text-14px">{{ $t('mev') }}</span>
          {{  botSettingStore.botSettings?.[chain]?.buy?.[selected]?.mev ? $t('on')  : $t('off') }}
        </li>

      </ul>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import BigNumber from 'bignumber.js'
import SlippageSet from '~/pages/token/components/right/botSwap/slippageSet.vue'
import {formatBotGasTips} from '@/utils/bot'
import {isEvmChain, getRpcProvider} from '@/utils'
import type { BotChain, BotSettingKey } from '~/utils/types'

const themeStore = useThemeStore()
const botStore = useBotStore()
const configStore = useConfigStore()
const botSwapStore = useBotSwapStore()
const botSettingStore = useBotSettingStore()
const tokenStore = useTokenStore()
const walletStore = useWalletStore()
const emit = defineEmits(['update:quickBuyValue'])
const props = withDefaults(defineProps<{
  chain: BotChain
  quickBuyValue?: string
  showQuickAmount?: boolean
  settingsButtonVisible?:boolean
  quickTextVisible?:boolean
}>(), {
  quickBuyValue: '0.01',
  settingsButtonVisible:true,
  quickTextVisible:true
})
const globalStore = useGlobalStore()
const gasPrice = shallowRef(0)

const visible = ref(false)
const selected = ref<BotSettingKey>('s1')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)

const isWallet = computed(() => {
  return (walletStore.provider && walletStore.address && !botStore.evmAddress)
})
const isQuickSupported = computed(()=>{
  return props.chain && botStore.isSupportChains.includes(props.chain) && !isWallet.value
})

const settingsButtonVisible1 = computed(() => {
  return props.settingsButtonVisible && !isWallet.value
})
const botPriorityFee = computed(() => {
  const chain = props.chain
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const botSettings = botSettingStore.botSettings?.[chain]?.buy?.[selected.value]
  const mev = botSettings?.mev

  const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})


const quickBuyValue1 = computed({
  get() {
    return props.quickBuyValue
  },
  set(value) {
    emit('update:quickBuyValue', value)
  }
})
function handleBlurBuyValue(value: string) {
  const decimals = 4
  const v = value
  const v1 = new BigNumber(v || 0)?.toFixed?.().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0] || ''
  if (String(v) !== String(v1)) {
    if (v === '') {
      quickBuyValue1.value = ''
    } else if (Number(v1) === 0) {
      quickBuyValue1.value = '0'
    } else {
      quickBuyValue1.value = v1
    }
  }
}

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
    const botSettings = botSettingStore.botSettings?.[chain]?.buy?.[selected.value]
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
</script>
