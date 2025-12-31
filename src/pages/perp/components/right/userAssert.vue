<template>
  <PerpConnect />
  <div v-if="perpStore.isConnectLogin">
    <div class="text-14px font-700 mb-15px">{{ $t('myPerpAccount') }}</div>
    <div class="flex items-center">
      <el-button :key="themeStore.theme" class="flex-1" type="primary" size="large" @click.stop="deposit">{{ $t('deposit') }}</el-button>
      <el-button :key="themeStore.theme" class="flex-1" color="var(--main-input-button-bg)" size="large" @click.stop="withdraw">{{ $t('withdraw') }}</el-button>
    </div>
    <ul class="mt-15px text-12px font-400 color-[--main-text]">
      <li class="flex items-center mb-12px">
        <Progress :progress="marginRatio" />
        <span v-tooltip.raw="`<div style='max-width: 200px'>${$t('marginRatioTips')}</div>`" class="ml-5px underline underline-dotted cursor-pointer" :style="getStyles">{{ formatNumber(marginRatio, 2) }}%</span>
      </li>
      <li class="flex items-center justify-between">
        <span class="color-[--third-text]">{{ $t('totalAssets') }}</span>
        <NuxtLink class="flex items-center clickable font-500" :to="`/address/${walletStore.address}/${walletStore.chain}?active=perp`">
          <span>{{ formatNumber(prepBalance, 4) }} USDT</span>
          <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
        </NuxtLink>
      </li>
      <!-- <li class="flex items-center justify-between mt-12px">
        <span class="color-[--third-text]">{{ $t('initialMargin') }}</span>
        <span class="font-500">{{ formatNumber(initMarginRequirement, 4) }} USDT</span>
      </li> -->
      <li class="flex items-center justify-between mt-12px">
        <span class="color-[--third-text]">{{ $t('maintenanceMargin') }}</span>
        <span class="font-500">{{ formatNumber(maintenanceMarginRequirement, 4) }} USDT</span>
      </li>
      <li class="flex items-center justify-between mt-12px">
        <span class="color-[--third-text]">{{ $t('unrealizedPnl') }}</span>
        <span class="font-500" :class="getColor(unrealizedPnl)">{{ formatNumber(unrealizedPnl, 2) }} USDT</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import PerpConnect from '@/components/header/connectWallet/perp/connect.vue'
import BigNumber from 'bignumber.js'
import Progress from './progress.vue'
import { usePerpStore } from '~/stores/perp'
const themeStore = useThemeStore()
const perpStore = usePerpStore()
const walletStore = useWalletStore()
const { prepBalance, unrealizedPnl, maintenanceMarginRequirement, deposit, withdraw } = usePerp()
function getColor(n: number | string) {
  const _n = new BigNumber(n)
  if (_n.gte(0)) {
    return 'color-[--up-color]'
  } else {
    return 'color-[--down-color]'
  }
}

const marginRatio = computed(() => {
  return  new BigNumber(maintenanceMarginRequirement.value).div(prepBalance.value).times(100).toNumber()
})
const colorSections = {
  green: '#12B886',
  yellow: '#FFA622',
  red: '#F6465D'
}
const getStyles = computed(() => {
  if (marginRatio.value < 40) {
    return {
      color: colorSections.green
    }
  } else if (marginRatio.value <= 60) {
    return {
      color: colorSections.yellow
    }
  } else  {
    return {
      color: colorSections.red
    }
  }
})

</script>

<style lang="scss" scoped></style>
