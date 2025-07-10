<script setup lang="ts">
import FavoriteTable from './favoriteTable.vue'

const {t} = useI18n()
const props = defineProps({
  height: {
    type: Number,
    default: 370
  }
})
const botStore = useBotStore()
const walletStore = useWalletStore()
const activeTab = shallowRef<keyof typeof components>('FavoriteTable')
const tabs = computed(() => {
  return [
  {name: t('favorites'), component: 'FavoriteTable' as const},
  {name: t('positions'), component: 'PositionsTable' as const},
  // {name: t('attention1'),  component: 'MyAttentionTable' as const},
  ]
})
const components = {
  FavoriteTable,
  PositionsTable: defineAsyncComponent(() => import('./positionsTable.vue')),
  // MyAttentionTable: defineAsyncComponent(() => import('./myAttentionTable.vue'))
}
const Component = computed(() => {
  return components[activeTab.value]
})
const activeHeight = computed(() => {
  if (activeTab.value === 'PositionsTable') {
    return props.height - 4
  }
  return props.height
})
</script>

<template>
  <div
    :style="`height: ${Math.max(height,0)}px;`"
    :class="`color-[var(--d-F5F5F5-l-333)] bg-[--d-111-l-FFF] rounded-2px text-14px overflow-hidden
    `">
    <div class="pt-10px flex items-center px-12px gap-20px border-b-solid border-b-1px border-b-#FFFFFF08">
      <a
        v-for="(item) in tabs"
        :key="item.component" href="javascript:;"
        :class="`decoration-none text-12px lh-16px pb-8px text-center color-[--d-666-l-999] b-b-solid b-b-2px font-500
         ${activeTab===item.component ? 'color-[--d-F5F5F5-l-222] b-b-[--d-F5F5F5-l-333]':'b-b-transparent'}`"
        @click="activeTab=item.component"
      >
        {{ item.name }}
      </a>
    </div>
    <KeepAlive v-if="botStore.evmAddress||walletStore.address">
      <component
        :is="Component"
        :height="activeHeight"
      />
    </KeepAlive>
    <AveEmpty
      v-else
      :style="{height:`${props.height-50}px`}"
      class="overflow-hidden"
    >
      <span class="text-12px mt-10px">{{ $t('noWalletTip') }}</span>
      <el-button
        class="mt-10px"
        @click="botStore.$patch({
        connectVisible: true
      })"
      >
        {{ $t('connectWallet') }}
      </el-button>
    </AveEmpty>
  </div>
</template>

<style scoped>

</style>
