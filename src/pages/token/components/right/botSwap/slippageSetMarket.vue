<template>
  <SlippageSet :key="chain" v-model:chain="activeChain" :canSetAuto="true" :isAutoSell="isAutoSell" :showClipboardSet="showClipboardSet" :uToken="uToken" :setting="botSettingStore.botSettings[activeChain]" :showQuickAmount="showQuickAmount" :showAutoSell="showAutoSell" @open="activeChain = chain">
    <template #icon>
      <slot name="icon"/>
    </template>
  </SlippageSet>
</template>
<script setup lang="ts">
import SlippageSet from './slippageSet.vue'
import type { BotChain } from '~/utils/types'

const props = defineProps({
  chain: {
    type: String as PropType<BotChain>,
    default: ''
  },
  showClipboardSet: {
    type: Boolean,
    default: false
  },
  isAutoSell: {
    type: Boolean,
    default: true
  },
  showQuickAmount: {
    type: Boolean,
    default: true
  },
  showAutoSell: {
    type: Boolean,
    default: false
  }
})
const botSettingStore = useBotSettingStore()

const activeChain = ref<BotChain>(props.chain || 'bsc')
const tokenStore = useTokenStore()
const uToken = computed(() => {
  return tokenStore.swap.payToken?.address || ''
})

</script>

