<template>
  <SlippageSet :key="chain" :canSetAuto="true" :chain="chain" :setting="botSettings[chain as 'eth']">
    <template #icon>
      <slot name="icon"/>
    </template>
  </SlippageSet>
</template>
<script setup lang="ts">
import SlippageSet from './slippageSet.vue'

defineProps({
  chain: {
    type: String,
    default: ''
  }
})
const botSettingStore = useBotSettingStore()
const { botSettings } =  storeToRefs(botSettingStore)

</script>

