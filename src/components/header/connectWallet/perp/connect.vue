<template>
  <div v-show="!perpStore.isConnectLogin" class="text-center text-14px w-100% absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Icon v-if="themeStore.isDark" name="custom:wallet1" class="text-40px mb-16px" />
    <Icon v-else name="custom:wallet1-light" class="text-40px mb-16px" />
    <div v-if="!walletStore.address">{{ $t('connectWalletAndDepositFunds') }}</div>
    <div v-else-if="walletStore.address && !perpStore.isLogin">{{ $t('pluginWalletConnectedTips') }}</div>
    <div class="mt-20px">
      <el-button v-if="!walletStore.address" type="primary" @click="connectAndLogin">{{ $t('connectWallet') }}</el-button>
      <el-button v-if="walletStore.address && !perpStore.isLogin" type="primary" @click="connectAndLogin">{{ $t('loginPerpAccount') }}</el-button>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'
const { connectAndLogin } = usePerp()

const walletStore = useWalletStore()
const perpStore = usePerpStore()
const themeStore = useThemeStore()

</script>

<style>

</style>
