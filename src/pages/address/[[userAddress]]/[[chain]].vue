<script setup lang="ts">
import WalletAssets from './components/walletAssets.vue'
import PerpAssets from '@/components/perp/perpAssets.vue'
import { useEventBus, useStorage } from '@vueuse/core'

const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
const route = useRoute()
const { t } = useI18n()
const walletStore = useWalletStore()
const activeName = route.query.t ? ref('perp') : useStorage('assetsActive', 'wallet')

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

scrollTopEvent.on(() => {
  scrollToTop()
})

onUnmounted(() => {
  scrollTopEvent.off(scrollToTop)
})

onMounted(() => {
  const queryActive = (route.query.active || '') as string
  if (queryActive && ['wallet', 'perp'].includes(queryActive)) {
    activeName.value = queryActive
  }
})
</script>

<template>
  <el-tabs
    v-if="walletStore.address"
    v-model="activeName"
    class="flex-1 bg-[--main-bg] [--el-text-color-primary:--third-text] [--el-border-color-light:--main-divider] pt-14px tabs"
    style="min-height: calc(100vh - 92px)"
  >
    <el-tab-pane :label="t('chainWallet2')" name="wallet">
      <WalletAssets style="max-height: auto" />
    </el-tab-pane>
    <el-tab-pane :label="t('perp')" name="perp">
      <PerpAssets v-if="activeName === 'perp'" />
    </el-tab-pane>
  </el-tabs>
  <WalletAssets v-else />
</template>
<style lang="scss" scoped>
.tabs {
  > :deep(.el-tabs__header) {
    padding-left: 16px;
    padding-right: 16px;
  }
  :deep(.el-tabs__active-bar){
    background-color: var(--main-text);
  }
  :deep(.el-tabs__item.is-active) {
    color: var(--main-text);
  }
}
</style>
