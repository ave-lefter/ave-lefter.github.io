<template>
  <SlippageSet :key="chain" :canSetAuto="true" :chain="chain" :showClipboardSet="showClipboardSet" :setting="botSettings[chain]">
    <template #icon>
      <slot name="icon"/>
    </template>
  </SlippageSet>
</template>
<script setup lang="ts">
import SlippageSet from './slippageSet.vue'
import type { BotChain } from '~/utils/types'

defineProps({
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
const { botSettings } = storeToRefs(botSettingStore)

</script>

