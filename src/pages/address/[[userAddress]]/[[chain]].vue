<script setup lang="ts">
import WalletAssets from './components/walletAssets.vue'
import PerpAssets from './components/perp/perpAssets.vue'

const walletStore = useWalletStore()
const activeName = ref('wallet')
</script>

<template>
  <el-tabs v-if="walletStore.address" v-model="activeName" class="flex-1">
    <el-tab-pane label="User" name="wallet">
      <WalletAssets />
    </el-tab-pane>
    <el-tab-pane label="Config" name="perp">
      <PerpAssets />
    </el-tab-pane>
  </el-tabs>
  <WalletAssets v-else/>
</template>