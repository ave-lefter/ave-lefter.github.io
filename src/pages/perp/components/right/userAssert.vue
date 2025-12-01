<template>
  <PerpConnect />
  <div v-if="perpStore.isConnectLogin">
    <div class="text-14px font-700 mb-15px">我的合约账户</div>
    <div class="flex items-center">
      <el-button :key="themeStore.theme" class="flex-1" type="primary" size="large" @click.stop="deposit">{{ $t('deposit') }}</el-button>
      <el-button :key="themeStore.theme" class="flex-1" color="var(--main-input-button-bg)" size="large" @click.stop="withdraw">{{ $t('withdraw') }}</el-button>
    </div>
    <ul class="mt-15px text-12px font-400 color-[--main-text]">
      <li class="flex items-center justify-between">
        <span class="color-[--third-text]">总资产</span>
        <NuxtLink class="flex items-center clickable font-500" :to="`/address/${walletStore.address}/${walletStore.chain}`">
          <span>{{ prepBalance }} USDT</span>
          <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
        </NuxtLink>
      </li>
      <li class="flex items-center justify-between mt-12px">
        <span class="color-[--third-text]">初始保证金</span>
        <span class="font-500">{{ formatNumber(initMarginRequirement, 3) }} USDT</span>
      </li>
      <li class="flex items-center justify-between mt-12px">
        <span class="color-[--third-text]">维持保证金</span>
        <span class="font-500">{{ formatNumber(maintenanceMarginRequirement, 3) }} USDT</span>
      </li>
      <li class="flex items-center justify-between mt-12px">
        <span class="color-[--third-text]">{{ $t('unrealizedPnl') }}</span>
        <span class="font-500" :class="getColor(unrealizedPnl)">{{ formatNumber(unrealizedPnl, 3) }} USDT</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import PerpConnect from '@/components/header/connectWallet/perp/connect.vue'
import BigNumber from 'bignumber.js'
import { usePerpStore } from '~/stores/perp'
const themeStore = useThemeStore()
const perpStore = usePerpStore()
const walletStore = useWalletStore()
const { prepBalance, unrealizedPnl, maintenanceMarginRequirement, initMarginRequirement, deposit, withdraw } = usePerp()
function getColor(n: number | string) {
  const _n = new BigNumber(n)
  if (_n.gte(0)) {
    return 'color-[--up-color]'
  } else {
    return 'color[--down-color]'
  }
}

</script>

<style lang="scss" scoped></style>
