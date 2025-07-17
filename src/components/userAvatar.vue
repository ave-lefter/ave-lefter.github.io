<template>
  <div class="icon-wallet-avatar-container">
    <el-image
      class="icon-wallet-avatar"
      :src="walletLogo"
      :style="avatarStyle"
      :width="iconSize"
    >
      <template #error>
        <img class="icon-wallet-avatar" :src="generateAvatarIcon(wallet_logo?.name || address)" :style="avatarStyle">
      </template>
    </el-image>

    <img
      v-if="wallet_logo.vip_logo"
      class="icon-vip_logo"
      :src="wallet_logo.vip_logo"
      alt=""
      :style="(chainStyle as any)"
    >
    <img
      v-else-if="chain && !wallet_logo.vip_logo"
      class="icon-chain"
      :src="`${configStore?.token_logo_url}chain/${chain}.png`"
      alt=""
      :style="(chainStyle as any)"
    >
  </div>
</template>

<script setup lang="ts">
import { generateAvatarIcon } from '@/utils'
interface WalletLogo {
  logo?: string
  name?: string
  vip_logo?: string
  url?: string
}

const props = defineProps<{
  address?: string
  chain?: string
  iconSize?: string
  iconChainSize?: string
  // eslint-disable-next-line vue/prop-name-casing
  wallet_logo?: WalletLogo
}>()

const {
  wallet_logo = {logo: '', name: '', url: ''},
  address = '',
  chain = '',
  iconSize = '16px',
  iconChainSize = ''
} = props

const configStore = useConfigStore()

const walletLogo = computed(() => {
  return wallet_logo?.logo?.replace?.(/_normal/, '_400x400') ||
    generateAvatarIcon(wallet_logo?.name || address)
})

const chainSize = computed(() => {
  if (iconChainSize) return iconChainSize
  const size = Math.min((Number((iconChainSize || iconSize)?.replace?.('px', '')) / 2.2) || 12, 20)
  return size + 'px'
})

const avatarStyle = computed(() => ({
  height: iconSize,
  width: iconSize,
  borderRadius: '50%'
}))

const chainStyle = computed(() => ({
  height: chainSize.value,
  width: chainSize.value,
  borderRadius: '50%',
  position: 'absolute',
  right: '-1px',
  bottom: '-1px',
  margin: '0'
}))
</script>

<style scoped lang="scss">
.icon-wallet-avatar-container {
  position: relative;
  display: flex;

  .icon-wallet-avatar {
    object-fit: cover;
  }

  .icon-chain,
  .icon-vip_logo {
    object-fit: cover;
  }
}
</style>
