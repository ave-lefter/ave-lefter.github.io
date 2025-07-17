<template>
  <div>
    <el-scrollbar height="calc(100vh - 92px)">
      <div class="flex flex-col h-[calc(100vh-94px)] overflow-visible">
        <div class="p-15px bg-[--d-111-l-FFF]">
          <PriceTabs v-model="tabActive" :tabs="tabs" />
          <template v-for="item in tabs" :key="item.id">
            <VolumeStats v-if="tabActive === item.id" :tabActive="item.id" :tabActiveName="item.name" />
          </template>
        </div>
        <!-- <div class="flex items-center justify-around color-[--d-F5F5F5-l-333] p-15px bg-[--d-111-l-FFF] mt-4px">
        <div class="text-center">
          <div class="text-14px mb-5px">${{ formatNumber(token?.open_price || 0, 3) }}</div>
          <div class="text-12px color-[--d-666-l-999]">{{ $t('openPrice') }}</div>
        </div>
        <div class="text-center">
          <div class="text-14px mb-5px">{{ tokenStore.circulation?.gt?.(0) ? (formatNumber(((tokenStore?.tokenInfoExtra?.amount_24 || 0) / Number(tokenStore?.circulation.toFixed())) * 100 || 0, 2) + '%') : '-' }}</div>
          <div class="text-12px color-[--d-666-l-999]">{{ $t('24Exchange') }}</div>
        </div>
        <div class="text-center">
          <div class="text-14px mb-5px">-</div>
          <div class="text-12px color-[--d-666-l-999]">DEV</div>
        </div>
      </div> -->
        <div class="p-15px bg-[--d-111-l-FFF] mt-1px">
          <!-- <BotSwap /> -->
          <component :is="SwapCom" />
        </div>
        <div class="p-15px pb-5px bg-[--d-111-l-FFF] mt-1px">
          <Pairs />
        </div>
        <Overview class="px-15px pb-10px bg-[--d-111-l-FFF] mt-1px" />
        <div class=" bg-[--d-111-l-FFF] flex-1" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang='ts'>
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import PriceTabs from './priceTabs.vue'
// import VolumeStats from './volumeStats.vue'
import Pairs from './pairs.vue'
import Overview from './overview.vue'
import BotSwap from './botSwap/index.vue'
const Swap = defineAsyncComponent(() => import('./swap/index.vue'))

const walletStore = useWalletStore()

const SwapCom = computed(() => {
  if (walletStore.address) {
    return Swap
  } else {
    return BotSwap
  }
})
const VolumeStats = defineAsyncComponent(() => import('./volumeStats.vue'))
const tabs: { id: '5m' | '1h' | '4h' | '24h'; name: string }[] = [
  { id: '5m', name: '5M' },
  { id: '1h', name: '1H' },
  { id: '4h', name: '4H' },
  { id: '24h', name: '24H' },
]
const tabActive = useLocalStorage('token_tab_active', '24h') as RemovableRef<'5m' | '1h' | '4h' | '24h'>
</script>
