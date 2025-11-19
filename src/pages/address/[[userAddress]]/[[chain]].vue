<script setup lang="ts">
import WalletAssets from './components/walletAssets.vue'
import PerpAssets from '@/components/perp/perpAssets.vue'
const route = useRoute()
const { t } = useI18n()
const walletStore = useWalletStore()
const activeName = ref(route.query.t ?'perp' :'wallet')
</script>

<template>
  <el-tabs v-if="walletStore.address" v-model="activeName" class="flex-1 bg-[--main-bg] [--el-text-color-primary:--third-text] [--el-color-primary:--main-text] [--el-border-color-light:--main-divider] pt-14px" style="min-height: calc(100vh - 92px);">
    <el-tab-pane :label="t('chainWallet2')" name="wallet">
      <WalletAssets style="max-height:auto;"/>
    </el-tab-pane>
    <el-tab-pane :label="t('perp')" name="perp">
      <PerpAssets v-if="activeName==='perp'"/>
    </el-tab-pane>
  </el-tabs>
  <WalletAssets v-else/>
</template>
<style lang="scss" scoped>
:deep(.el-tabs__header){
  padding-left: 16px;
  padding-right: 16px;
}
</style>