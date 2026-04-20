<template>
  <div ref="bot-swap-container" class="bot-swap-container">
    <Holding  :isForceShow="true"  v-model:walletTokenInfo="walletTokenInfo"/>
    <BestToken/>
    <div class="tabs">
      <button v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: item.value === activeTab, [`tab-${item.value}`]: true }" type="button" @click="activeTab = item.value">
        <span>{{ item.name }}</span>
      </button>
    </div>
    <div v-if="botStore?.userInfo?.evmAddress && botStore?.isSupportChains?.includes(chain)" class="flex items-center h-40px">
      <div class="tabs-1 mr-5px">
        <button v-for="item in BotSettingsArr" :key="item.value" class="hover:bg-[--tab-active-bg]! hover:text-[--main-text1]!" :class="{'active': item.value === botSettingStore?.botSettings?.[chain]?.[activeTab]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)" @mouseenter="showPopover(item.value)"
          @mouseleave="visible = false" :ref="setBtnRef" :id="item.value"
        >{{ item.label }}</button>
        <!-- <button v-for="item in BotSettingsArr" :key="item.value" :class="{'active': item.value === botSettingStore?.botSettings?.[chain]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)">{{ item.label }}</button> -->
      </div>
      <!-- <SlippageSet :canSetAuto="true" :isAutoSell="swapType === 'market'" :chain="(tokenStore.tokenInfo?.token?.chain as BotChain)" :setting="botSettingStore?.botSettings[chain]"/> -->
      <SlippageSetMarket class="ml-5px" :isAutoSell="swapType === 'market'" :chain="(tokenStore.tokenInfo?.token?.chain as BotChain)" />
      <BatchWallet :chain="chain" :boundary="boundary"/>
    </div>
    <div class="select-box">
      <el-tabs v-model="swapType" class="select-tabs m-tabs">
        <el-tab-pane v-for="(item, index) in types" :key="index" :label="item.name" :name="item.value"/>
        <el-tab-pane disabled>
          <template #label>
            <div class="w-100% h-100%" />
          </template>
        </el-tab-pane>
        <el-tab-pane disabled>
          <template #label>
            <div class="m-op flex-end w-100% h-100%">
              <template v-if="activeTab==='buy'">
                <Icon name="ri:wallet-fill" class="color-[--third-text] text-14px ml-auto" />
                <span class="text-12px color-[--third-text] mx-3px">{{ botSwapStore.botSwapSelectedWallets?.length }}</span>
                <div class="color-[--third-text]" :class="{ 'clickable': botSwapStore.botSwapSelectedWallets?.length <= 1 }" @click.stop="handleMax(tokenStore.swap.payToken?.balance || 0, 'buy')">{{ $t('balance1') }}: <span>{{ formatNumber(totalSelectWalletBalance || 0,2) }}</span> {{ tokenStore.swap.payToken?.symbol || '' }}
                </div>
                <RefreshBalance class="color-[--third-text]" :type="0" isPayToken isBatch />
              </template>
              <template v-else-if="activeTab==='sell'">
                <Icon name="ri:wallet-fill" class="color-[--third-text] text-14px ml-auto" />
                <span class="text-12px color-[--third-text] mx-3px">{{ botSwapStore.botSwapSelectedWallets?.length }}</span>
                <span class="color-[--third-text]" :class="{ 'clickable': botSwapStore.botSwapSelectedWallets?.length <= 1 }" @click.stop="handleMax(tokenStore.swap.token?.balance || 0, 'sell')">{{ $t('balance1') }}: <span >{{ formatNumber(totalSelectWalletBalance1 || 0,2) }}</span> {{ tokenInfo?.symbol }}</span>
                <RefreshBalance class="color-[--third-text]" :type="1" isPayToken isBatch />
              </template>
              <div v-else></div>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <!-- <div v-if="botStore?.userInfo?.evmAddress && botStore?.isSupportChains?.includes(chain)" class="inline-flex items-center absolute top-50% right-0 transform -translate-y-1/2">
        <div class="tabs-1 mr-5px">
          <button v-for="item in BotSettingsArr" :key="item.value" :class="{'active': item.value === botSettingStore?.botSettings?.[chain]?.[activeTab]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)">{{ item.label }}</button>
        </div>
        <SlippageSet :canSetAuto="true" :isAutoSell="swapType === 'market'" :chain="(tokenStore.tokenInfo?.token?.chain as BotChain)" :setting="botSettingStore?.botSettings[chain]" :initSwapType="activeTab" />
      </div> -->
    </div>
    <Swap ref="swap" :activeTab="activeTab" :swapType="swapType" :tabs1="tabs1" :tabs2="tabs2" @getTokenBalance="retryGetTokenBalance"/>
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
        <li class="mb-4px flex-start">
          <Icon name="custom:slippage" class="color-[--third-text] ml-0 mr-6px cursor-pointer min-w-16px"/>
          <span class="mr-4px color-[--third-text]">{{ $t('slippage') }}</span>
          <span v-if="botSettingStore.botSettings?.[chain]?.buy?.[selected]?.slippage !== 'auto'">
            {{
              botSettingStore.botSettings?.[chain || '']?.buy?.[selected]?.slippage
            }}%</span>
          <span v-else>{{ $t('auto') }}</span>
        </li>
        <li v-if="isEvmChain(chain || '')" class="mt-4px mb-4px flex-start">
          <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="color-[--third-text] ml-0 mr-3px cursor-pointer min-w-18px"/>
          <span class="mr-5px color-[--third-text]">{{ $t('estimatedGas') }}</span>
          <span>${{ getEstimatedGas() }}</span>
        </li>
        <li v-if="chain === 'solana'" class="mt-4px mb-4px flex-start">
          <Icon name="custom:gas" class="color-[--third-text] mr-3px cursor-pointer ml-0 min-w-18px"/>
          <span class="mr-5px color-[--third-text] whitespace-nowrap block">{{ $t('priorityFee') }}</span>
          <span class="whitespace-nowrap">{{ botPriorityFee }} SOL</span>
        </li>
        <li class="mt-4px mb-4px flex-start">
          <Icon :name="`custom:half-${globalStore.mode}`" class="text-18px color-[--third-text] ml-0 mr-3px cursor-pointer min-w-18px"/>
          <span class="mr-5px color-[--third-text] whitespace-nowrap">{{ $t('autoSellHalf') }}</span>
          <span>{{  botSettingStore.autoSellConfigs?.autoSell ? $t('on') : $t('off') }}</span>
        </li>

        <li class="mt-4px flex-start">
          <Icon name="custom:mev" class="text-14px color-[--third-text] ml-0 mt--2px mr-3px cursor-pointer min-w-18px"/>
          <span class="mr-5px color-[--third-text]">{{ $t('mev') }}</span>
          <span>{{  botSettingStore.botSettings?.[chain]?.buy?.[selected]?.mev ? $t('on')  : $t('off') }}</span>
        </li>

      </ul>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import {formatBotGasTips} from '@/utils/bot'
import {isEvmChain, getRpcProvider} from '@/utils'
import { NATIVE_TOKEN } from '@/utils/constants'
// import SlippageSet from './slippageSet.vue'
import SlippageSetMarket from './slippageSetMarket.vue'
import Swap from './swap.vue'
import BigNumber from 'bignumber.js'
import { useBotSwap } from '~/composables/botSwap'
import Holding from './holding.vue'
import BatchWallet from './batchWallet.vue'
import BestToken from '../bestToken.vue'
import RefreshBalance from './refreshBalance.vue'
import type { WalletTokenInfo } from '~/api/types/token'

// 创建对子组件的引用
const swap = ref<InstanceType<typeof Swap>>()
const { t } = useI18n()
const route = useRoute()
const botSettingStore = useBotSettingStore()
const activeTab = shallowRef<'buy' | 'sell'>('buy')
const swapType = shallowRef<'limit' | 'market'>('market')
const botStore = useBotStore()
const tokenStore = useTokenStore()
const wsStore = useWSStore()
const botSwapStore = useBotSwapStore()
const boundary = useTemplateRef('bot-swap-container')


const globalStore = useGlobalStore()
const visible = ref(false)
const selected = ref<BotSettingKey>('s1')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)

const walletTokenInfo=ref<WalletTokenInfo | null>(null)

const { getTokenBalance, retryGetTokenBalance } = useBotSwap()

const chain = computed(() => {
  return (getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain) as BotChain
})

const gasPrice = computed(() => {
  return gasPriceObj?.[chain.value] || 0
})

const tabs = computed<Array<{ value: 'buy' | 'sell', name: string }>>(() => {
  return [
    { value: 'buy', name: t('buy') },
    { value: 'sell', name: t('sell') },
  ]
})

const tabs1 = computed(() => {
  const payToken = tokenStore.swap.payToken
  const key = payToken?.address + '-' + chain.value
  const botSetting = (botSettingStore?.botSettings?.[chain.value]?.buy || {}) as typeof botSettingStore.botSettings.solana
  const list = botSetting?.[botSetting.selected]?.buyUList?.[key]?.slice(0, 4) || ['0.01', '0.02', '0.5', '1']
  return list.map(i => {
    return {
      name: i,
      value: i
    }
  })
})

const tabs2 = computed(() => {
  const botSetting = (botSettingStore?.botSettings?.[chain.value]?.sell || {}) as typeof botSettingStore.botSettings.solana
  const list = botSetting?.[botSetting.selected]?.sellPerList?.slice(0, 4) || ['25', '50', '75', '100']
  return list.map(i => {
    return {
      name: i + '%',
      value: new BigNumber(i).div(100).toString()
    }
  })
})

const types = computed(() => {
  // const chain = getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain
  // if (chain === 'xlayer') {
  //   return [
  //     { value: 'market', name: t('swapT') },
  //   ] as const
  // }
  return [
    { value: 'market', name: t('swapT') },
    { value: 'limit', name: t('limitT') },
  ] as const
})

const tokenInfo = computed(() => tokenStore.token)

watch(types, (val) => {
  if (val.every(i => i.value !== swapType.value)) {
    swapType.value = val[0].value
  }
})

function onSelectBotSwapSet(item: string) {
  if (botSettingStore?.botSettings?.[chain.value]) {
    (botSettingStore.botSettings[chain.value]![activeTab.value] as any).selected = item
  }
}

const walletAddress = computed(() => {
  const chain = getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain
  return botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
})

watch([walletAddress, () => route.params?.id, () => wsStore.wsResult?.tgbot], () => {
  if (!walletAddress.value) return
  getTokenBalance()
})

const chainMainToken: Record<string, string> = {
  solana: 'sol',
  ton: 'TON',
}

function initToken() {
  if (!route.params?.id) return
  const {address, chain} =  getAddressAndChainFromId(route.params?.id as string)
  tokenStore.swap.token = {address, chain}
  if (chain !== tokenStore.swap.native.chain) {
    tokenStore.swap.native = {symbol: getChainInfo(chain)?.main_name, chain: chain, address: chainMainToken[chain] || NATIVE_TOKEN, decimals: getChainInfo(chain)?.decimals }
  }
  if (chain !== tokenStore.swap.payToken?.chain) {
    tokenStore.swap.payToken = (botSwapStore?.botSwapBaseTokens?.[(chain || '') as BotChain] || [])[0]
  }
}

watch(() => route.params?.id as string, (val) => {
  if (!val) return
  initToken()
})


onMounted(() => {
  getTokenBalance()
  initToken()
  // getWalletTxData()
})

const botPriorityFee = computed(() => {
  if (!botStore.isSupportChains.includes(chain.value)) {
    return ''
  }
  const botSettings = botSettingStore.botSettings?.[chain.value]?.buy?.[selected.value]
  const mev = botSettings?.mev

  const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain.value)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})

function setBtnRef(el: HTMLElement | null) {
  if (el && el?.id) {
    btnRefs.value[el?.id] = el
  }
}

function showPopover(item: BotSettingKey) {
  console.log('showPopover', item)
  selected.value = item
  currentBtnRef.value = btnRefs.value[item] || null
  visible.value = true
  getGasPrice()
}

const gasPriceObj: Record<string, number> = reactive({})

function getGasPrice() {
  if (!isEvmChain(chain.value) || gasPriceObj[chain.value]) {
    return
  }

  getRpcProvider(chain.value)?.getFeeData().then(res => {
    if (res) {
      gasPriceObj[chain.value] = new BigNumber(res.gasPrice || 0).toNumber()
    }
  })
}

function getEstimatedGas() {
  if (isEvmChain(chain.value) && botStore?.isSupportChains?.includes(chain.value)) {
    const botSettings = botSettingStore.botSettings?.[chain.value]?.buy?.[selected.value]
    const mev = botSettings?.mev
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain.value && item.token === getChainInfo(chain.value)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain.value)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain.value && i.mev === !!mev)?.gasLimit || 200000
    return formatNumber(new BigNumber(gasPrice.value).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}

const totalSelectWalletBalance= computed(() => {
  return swap.value?.totalSelectWalletBalance
})
const totalSelectWalletBalance1= computed(() => {
  return swap.value?.totalSelectWalletBalance1
})

const handleMax = (balance: string | number, type: 'buy' | 'sell') => {
  if(swap.value){
    swap.value?.handleMax(balance, type)
  }
}
</script>
<style lang="scss" scoped>
  .tabs {
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px;
    .tab-item {
      border: 1px solid transparent;
      display: flex;
      height: 32px;
      justify-content: center;
      align-items: center;
      flex: 1;
      border-radius: 4px;
      background: var(--main-input-button-bg);
      cursor: pointer;
      color: var(--third-text);
      &:first-child {
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        border-radius: 0 4px 4px 0;
      }
      &.active {
        border-color: transparent;
        &.tab-buy {
          background: rgba($color: #12B886, $alpha: 1);
          color: #FFF;
        }
        &.tab-sell {
          background: rgba($color: #F6465D, $alpha: 1);
          color: #FFF;
        }
      }
      &:disabled {
        opacity: 0.4;
      }
      .iconfont {
        font-size: 12px;
        margin-right: 3px;
        line-height: 1;
      }
      &:active {
        opacity: 0.5;
      }
    }
  }
  .select-box {
    position: relative;
  }
  .select-tabs {
    :deep() {
      --el-border-color-light: var(--d-333-l-DDD);
      .el-tabs__item {
        font-size: 12px;
        padding: 0 10px;
        --el-text-color-primary: var(--third-text);
        cursor: pointer;
        &.is-active {
          color: var(--main-text1);
        }
        &:hover:not(.is-active) {
          color: var(--third-text);
        }
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__active-bar {
        height: 2px;
        background-color: var(--main-text1);
      }
      .el-tabs__nav-wrap::after {
        height: 0.5px;
      }
    }
  }

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
.m-tabs{
  :deep() .el-tabs__header{
    // --el-border-color-light:var(--dialog-list-hover);
    // --el-color-primary:var(--main-text);
    // --el-text-color-primary:var(--third-text);
  }
  // --el-tabs-header-height:44px;
  :deep() .el-tabs__item{
    // font-weight: 400;
    &:hover{
      // color:var(--third-text);
      &.is-active{
        // color:var(--main-text);
      }
    }
    &.is-disabled{
      cursor:default;
    }
  }
  :deep() .el-tabs__header{
    margin-bottom: 0;
  }
  :deep() .el-tabs__nav-wrap::after,:deep() .el-tabs__active-bar{
    height: 1px;
  }
  :deep() .el-tabs__nav.is-top{
    width:100%;
    .el-tabs__item{
      padding: 0 12px;
      &:nth-child(2),&:nth-child(3),&:nth-child(5){
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: auto;
      }
      &:nth-child(4){
        flex:1;
        padding: 0;
      }
      &:last-child{
        padding: 0;
        justify-content: flex-end;
        color:inherit;
      }
    }
  }
}
</style>
