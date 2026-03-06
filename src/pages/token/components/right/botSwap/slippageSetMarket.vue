<template>
  <SlippageSet :key="chain" v-model:chain="activeChain" :canSetAuto="true" :showClipboardSet="showClipboardSet" :setting="botSettingStore.botSettings[activeChain]" @open="activeChain = chain">
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
  }
})
const botSettingStore = useBotSettingStore()

const activeChain = ref<BotChain>(props.chain || 'bsc')

</script>

