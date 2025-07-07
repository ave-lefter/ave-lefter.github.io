<script setup lang="ts">
import ChainsSelect from './components/chainsSelect.vue'
import CategoryTabs from './components/categoryTabs.vue'
import HotRank from './components/hotRank/hotRank.vue'
import {getTreasureConfig, type IGetTreasureConfig} from '~/api/market'

const components = {
  HotRank
}
const activeTab = shallowRef<keyof typeof components>('HotRank')
const activeChain = shallowRef('-1')
const chains = shallowRef<IGetTreasureConfig[]>([])

onMounted(() => {
  _getTreasureConfig()
})

async function _getTreasureConfig() {
  const res = await getTreasureConfig()
  chains.value = res || []
}
</script>

<template>
  <div class="w-full">
    <div class="flex gap-16px py-12px px-16px">
      <ChainsSelect
        v-model:activeChain="activeChain"
        :list="chains"
      />
      <CategoryTabs
        activeInterval="1m"
        :quickInputVisible="false"
      />
    </div>
    <KeepAlive>
      <component :is="components[activeTab]"
      />
    </KeepAlive>
  </div>
</template>

<style scoped lang="scss">

</style>
