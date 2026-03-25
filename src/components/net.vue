<template>
  <div
    class="flex items-center gap-5px px-5px py-2px rounded-4px text-12px"
    :class="bgColor"
  >
    <!-- 状态点 -->
    <div class="w-8px h-8px rounded-full" :class="dotColor"></div>
    <span>
      {{ net.label }} {{ net.latency }}MS<span v-if="Math.abs(net.offset) > 2"><span class="color-[--secondary-text] mr-4px ml-4px line"></span>Δ{{ net.offset }}ms</span><span class="color-[--secondary-text] mr-4px ml-4px line"></span>{{ net.fps }} FPS
    </span>
  </div>
</template>

<script setup lang="ts">
import { useTradingNetwork } from '@/composables/useTradingNetwork'
const wsv2Store = useV2WSStore()

const net = useTradingNetwork(wsv2Store)
const dotColor = computed(() => {
  switch (net.level.value) {
    case 'stable':
      return 'bg-[--up-color]'
    case 'unstable':
      return 'bg-[--down-color]'
    case 'disconnected':
      return 'bg-[--secondary-text]'
  }
})
const bgColor = computed(() => {
  switch (net.level.value) {
    case 'stable':
      return 'bg-green-500/10 color-[--up-color]'
    case 'unstable':
      return 'bg-red-500/10 color-[--down-color]'
    case 'disconnected':
      return 'bg-gray-500/10 color-[--secondary-text]'
  }
})
</script>
<style lang="scss" scoped>
  .line{
    border-right: 0.5px solid var(--third-text);
    font-size: 6px;
    vertical-align: middle;
  }
</style>
