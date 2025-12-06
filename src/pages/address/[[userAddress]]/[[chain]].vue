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
</script>

<template>
  <el-tabs
    v-if="walletStore.address"
    v-model="activeName"
    class="flex-1 bg-[--main-bg] [--el-text-color-primary:--third-text] [--el-color-primary:--main-text] [--el-border-color-light:--main-divider] pt-14px tabs"
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
}
</style>
