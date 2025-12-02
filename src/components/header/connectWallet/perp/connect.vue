<template>
  <div v-show="!perpStore.isConnectLogin" class="text-center text-14px w-100% absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Icon name="custom:wallet1" class="text-40px mb-16px" />
    <div>{{ $t('connectWalletAndDepositFunds') }}</div>
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

</script>

<style>

</style>
