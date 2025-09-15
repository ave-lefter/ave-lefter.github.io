<template>
  <button
    v-if="isQuickSupported"
    v-tooltip="{
      content: {
        is: Content,
        props: {
          ref: 'popoverRef',
        }
      },
      props: {
        placement: 'bottom',
        trigger: 'click',
        'popper-class': 'new-popover',
      }
    }"
    class="autoSellSetting-btn border-none cursor-pointer mr-8px"
    :class="{
      'active': isAutoSellConfig
    }"
    >
    <span>{{ $t('autoSell') }}</span>
    <SlippageSet
      class="ml-5px"
      :chain="chain"
      :setting="botSettingStore?.botSettings[chain]"
      :showQuickAmount="false"
      showAutoSell
    >
      <template #icon>
       <Icon name="fe:edit" class="text-12px" />
    </template>
  </SlippageSet>

  </button>
</template>

<script setup lang='ts'>
import Content from './content.vue'
import SlippageSet from '~/pages/token/components/right/botSwap/slippageSet.vue'
import { useAutoSellSettingContent } from './utils'

const props = defineProps({
  chain: { type: String as PropType<BotChain>, default: '' },
})

const walletStore = useWalletStore()
const botStore = useBotStore()
const isWallet = computed(() => {
  return (walletStore.provider && walletStore.address && !botStore.evmAddress)
})

const isQuickSupported = computed(()=>{
  return props.chain && botStore.isSupportChains.includes(props.chain) && !isWallet.value
})

const { isAutoSellConfig, botSettingStore } = useAutoSellSettingContent()


onMounted(() => {
})

</script>

<style scoped lang='scss'>
.autoSellSetting-btn {
  height: 28px;
  border: none;
  background: var(--main-input-button-bg);
  padding: 3px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  font-size: 12px;
  // font-weight: 500;
  color: var(--main-text);
  // color: var(--d-999-l-666);
  border: 1px solid transparent;
  &.active {
    color: var(--main-text);
    border: 1px solid #3F80F7;
  }
}
</style>
