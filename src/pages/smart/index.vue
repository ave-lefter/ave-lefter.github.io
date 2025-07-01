<script setup lang="ts">
import SignalContainer from './components/signal/signalContainer.vue'

const configStore = useConfigStore()
const smartChains = computed(() => {
  return ['solana', 'bsc'].map(value => {
    return {
      label: getChainInfo(value)?.name,
      value
    }
  })
})
const activeChain = shallowRef('solana')
</script>

<template>
  <div class="w-full">
    <div class="p-12px flex justify-between">
      <div class="flex gap-8px">
        <span class="py-8px px-12px rounded-4px bg-[--d-333-l-F2F2F2] flex items-center justify-center">
          {{ $t('signal2') }}
        </span>
      </div>
      <div class="p-2px rounded-4px bg-[--d-333-l-F2F2F2] flex">
        <div
            v-for="({label,value}) in smartChains"
            :key="value"
            class="flex items-center justify-center gap-4px px-8px py-6px text-12px rounded-4px cursor-pointer"
            :class="`${activeChain===value?'bg-[--d-111-l-FFF]':''}`"
            @click="activeChain=value"
        >
          <img class="w-16px h-16px rounded-full" :src="`${configStore.token_logo_url}chain/${value}.png`" alt="">
          {{ label }}
        </div>
      </div>
    </div>
    <SignalContainer :activeChain="activeChain"/>
  </div>
</template>

<style scoped lang="scss">

</style>
