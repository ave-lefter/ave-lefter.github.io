<template>
  <div v-show="!perpStore.isConnectLogin" class="text-center text-14px w-100% absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Icon name="custom:wallet1" class="text-40px mb-16px" />
    <div>连接您的插件钱包以存入资金并开始交易。</div>
    <div class="mt-20px">
      <el-button v-if="!walletStore.address" type="primary" @click="connectAndLogin">{{ $t('connectWallet') }}</el-button>
      <el-button v-if="walletStore.address && !perpStore.isLogin" type="primary" @click="connectAndLogin">登录合约账户</el-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'
const { login } = usePerp()

const walletStore = useWalletStore()
const perpStore = usePerpStore()
const botStore = useBotStore()

function connectAndLogin() {
  if (walletStore.address) {
    if (!perpStore.isLogin) {
      login()
    }
    return
  }
  botStore.changeConnectVisible(true, 1)
  const unwatch = watch(() => walletStore.address, (res) => {
    if (res && walletStore.walletSignature?.[walletStore?.address || '']) {
      unwatch()
      if (!perpStore.isLogin) {
        login()
      }
    }
  })

  const unwatch2 = watch(() => botStore.connectVisible, (res) => {
    if (!res) {
      unwatch()
      unwatch2()
    }
  })
}
</script>

<style>

</style>
