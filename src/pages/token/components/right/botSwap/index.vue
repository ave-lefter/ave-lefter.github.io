<template>
  <div ref="bot-swap-container" class="bot-swap-container">
    <Holding  />
    <BestToken/>
    <div class="tabs">
      <button v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: item.value === activeTab, [`tab-${item.value}`]: true }" type="button" @click="activeTab = item.value">
        <span>{{ item.name }}</span>
      </button>
    </div>
    <div v-if="botStore?.userInfo?.evmAddress && botStore?.isSupportChains?.includes(chain)" class="flex items-center h-40px">
      <div class="tabs-1 mr-5px">
        <button v-for="item in BotSettingsArr" :key="item.value" :class="{'active': item.value === botSettingStore?.botSettings?.[chain]?.[activeTab]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)">{{ item.label }}</button>
        <!-- <button v-for="item in BotSettingsArr" :key="item.value" :class="{'active': item.value === botSettingStore?.botSettings?.[chain]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)">{{ item.label }}</button> -->
      </div>
      <SlippageSet :canSetAuto="true" :isAutoSell="swapType === 'market'" :chain="(tokenStore.tokenInfo?.token?.chain as BotChain)" :setting="botSettingStore?.botSettings[chain]"/>
      <BatchWallet :chain="chain" :boundary="boundary" />
    </div>
    <div class="select-box">
      <el-tabs v-model="swapType" class="select-tabs">
        <el-tab-pane v-for="(item, index) in types" :key="index" :label="item.name" :name="item.value"/>
      </el-tabs>
      <!-- <div v-if="botStore?.userInfo?.evmAddress && botStore?.isSupportChains?.includes(chain)" class="inline-flex items-center absolute top-50% right-0 transform -translate-y-1/2">
        <div class="tabs-1 mr-5px">
          <button v-for="item in BotSettingsArr" :key="item.value" :class="{'active': item.value === botSettingStore?.botSettings?.[chain]?.[activeTab]?.selected}" type="button" @click.stop="onSelectBotSwapSet(item.value)">{{ item.label }}</button>
        </div>
        <SlippageSet :canSetAuto="true" :isAutoSell="swapType === 'market'" :chain="(tokenStore.tokenInfo?.token?.chain as BotChain)" :setting="botSettingStore?.botSettings[chain]" :initSwapType="activeTab" />
      </div> -->
    </div>
    <Swap :activeTab="activeTab" :swapType="swapType" :tabs1="tabs1" :tabs2="tabs2" @getTokenBalance="getTokenBalance"/>
  </div>
</template>
<script setup lang="ts">
import { NATIVE_TOKEN } from '@/utils/constants'
import SlippageSet from './slippageSet.vue'
import Swap from './swap.vue'
import Bignumber from 'bignumber.js'
import { useBotSwap } from '~/composables/botSwap'
import Holding from './holding.vue'
import BatchWallet from './batchWallet.vue'
import BestToken from '../bestToken.vue'

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

const { getTokenBalance } = useBotSwap()

const chain = computed(() => {
  return (getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain) as BotChain
})


const tabs = computed<Array<{ value: 'buy' | 'sell', name: string }>>(() => {
  return [
    { value: 'buy', name: t('buy') },
    { value: 'sell', name: t('sell') },
  ]
})

const tabs1 = computed(() => {
  const botSetting = (botSettingStore?.botSettings?.[chain.value]?.buy || {}) as typeof botSettingStore.botSettings.solana
  const list = botSetting?.[botSetting.selected]?.buyValueList || ['0.01', '0.02', '0.5', '1', '0.1', '0.25', '2', '5']
  return list.map(i => {
    return {
      name: i,
      value: i
    }
  })
})

const tabs2 = computed(() => {
  const botSetting = (botSettingStore?.botSettings?.[chain.value]?.sell || {}) as typeof botSettingStore.botSettings.solana
  const list = botSetting?.[botSetting.selected]?.sellPerList || ['25', '50', '75', '100', '0', '0', '0', '0']
  return list.map(i => {
    return {
      name: i + '%',
      value: new Bignumber(i).div(100).toString()
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
          color: var(--main-text);
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
        background-color: var(--main-text);
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
        background: var(--tab-active-bg);
        color: var(--main-text);
      }
    }
  }

</style>
