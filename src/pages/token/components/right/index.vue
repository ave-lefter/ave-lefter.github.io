<template>
  <div>
    <el-scrollbar height="calc(100vh - 92px)">
      <div class="flex flex-col h-[calc(100vh-94px)] overflow-visible">
        <div class="p-15px bg-[--secondary-bg]">
          <PriceTabs v-model="tabActive" :tabs="tabs" />
          <template v-for="item in tabs" :key="item.id">
            <VolumeStats
              v-if="tabActive === item.id"
              :tabActive="item.id"
              :tabActiveName="item.name"
            />
          </template>
        </div>
        <!-- <div class="flex items-center justify-around color-[--main-text] p-15px bg-[--secondary-bg] mt-4px">
        <div class="text-center">
          <div class="text-14px mb-5px">${{ formatNumber(token?.open_price || 0, 3) }}</div>
          <div class="text-12px color-[--third-text]">{{ $t('openPrice') }}</div>
        </div>
        <div class="text-center">
          <div class="text-14px mb-5px">{{ tokenStore.circulation?.gt?.(0) ? (formatNumber(((tokenStore?.tokenInfoExtra?.amount_24 || 0) / Number(tokenStore?.circulation.toFixed())) * 100 || 0, 2) + '%') : '-' }}</div>
          <div class="text-12px color-[--third-text]">{{ $t('24Exchange') }}</div>
        </div>
        <div class="text-center">
          <div class="text-14px mb-5px">-</div>
          <div class="text-12px color-[--third-text]">DEV</div>
        </div>
      </div> -->
        <div class="p-15px bg-[--secondary-bg] mt-1px">
          <!-- <BotSwap /> -->
          <component :is="SwapCom" />
        </div>
        <div class="p-15px pb-5px bg-[--secondary-bg] mt-1px">
          <div
            class="flex justify-between border-b-1px border-b-solid border-b-[--main-divider] pb-8px mb-8px text-12px"
          >
            <span class="text-12px color-[--main-text]">{{ $t('totalPair') }}</span>
            {{ formatNumber(tokenStore.token?.main_pair_tvl || 0, 1) }}
          </div>
          <Pairs @openFilterModal="openFilterModal" />
        </div>
        <Overview class="px-15px pb-10px pr-0 bg-[--secondary-bg] mt-1px" />
        <div class="bg-[--secondary-bg] flex-1" />
      </div>
    </el-scrollbar>
    <el-dialog v-model="dialogVisible" :title="searchAmm" width="480">
      <Pairs :search="searchAmm" :isInModal="true" />
      <template #footer>
        <el-button
          type="primary"
          block
          class="w-full h-[48px]"
          size="large"
          @click="dialogVisible = false"
          >{{ $t('confirm') }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import PriceTabs from './priceTabs.vue'
// import VolumeStats from './volumeStats.vue'
import Pairs from './pairs.vue'
import Overview from './overview.vue'
import BotSwap from './botSwap/index.vue'
const Swap = defineAsyncComponent(() => import('./swap/index.vue'))

const dialogVisible = shallowRef(false)

const searchAmm = shallowRef('')
const walletStore = useWalletStore()
const tokenStore = useTokenStore()

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
const tabActive = useLocalStorage('token_tab_active', '24h') as RemovableRef<
  '5m' | '1h' | '4h' | '24h'
>

const openFilterModal = (search: string) => {
  console.log('openFilterModal', search)
  dialogVisible.value = true
  searchAmm.value = search
}
</script>
