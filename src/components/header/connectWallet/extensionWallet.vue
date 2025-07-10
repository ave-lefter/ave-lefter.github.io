<template>
  <div class="text-24px inline-flex items-center">
    <el-icon :size="28" class="clickable" @click="botStore.connectWalletTab = 0">
      <ArrowLeft />
    </el-icon>
    <span class="font-600">{{ $t('connectWallet') }}</span>
  </div>
  <div class="mt-40px">
    <div class="text-14px color-[--d-666-l-999] mb-10px">{{ $t('selectNetwork') }}</div>
    <el-select
      v-model="chain"
      filterable
      placeholder="Select"
      style="width: 100%;height: 48px;"
      size="large"
      :filter-method="chainFilterMethod"
    >
      <template #prefix>
        <div class="h-32px inline-flex items-center">
          <img :key="chain" :src="`${configStore.token_logo_url}chain/${chain}.png`" class="rd-50%" width="32" lazy alt="">
        </div>
      </template>
      <el-option
        v-for="item in chains"
        :key="item.net_name"
        :label="item.name"
        :value="item.net_name"
        class="h-48px! flex items-center"
      >
        <img :src="`${configStore.token_logo_url}chain/${item.net_name}.png`" class="rd-50% mr-5px" width="32" lazy alt="">
        <span>{{ item.name || '' }}</span>
        <span class="ml-auto color-[--d-666-l-999] text-12px">{{ item.description || '' }}</span>
      </el-option>
    </el-select>
    <div class="text-14px color-[--d-666-l-999] mb-10px mt-40px">{{ $t('selectWallet') }}</div>
    <el-scrollbar height="350px">
      <ul v-if="chain && isEvmChain(chain)">
        <li v-for="item in walletStore.evmWallets" :key="item.name" class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="connectEvmWallet(item)">
          <img :src="item.icon" class="mr-10px rd-5px" width="32" lazy alt="">
          <span>{{ item.name }}</span>
          <span v-if="item?.provider" class="ml-auto color-[--d-666-l-999] text-14px">{{ $t('detected') }}</span>
        </li>
        <li class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="connectEvmWallet('AveWallet')">
          <img src="@/assets/images/logo-bg.png" class="mr-10px rd-5px" width="32" lazy alt="">
          <span>AveWallet</span>
          <span class="ml-auto color-[--d-666-l-999] text-14px">{{ $t('scan') }}</span>
        </li>
        <li class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="connectEvmWallet('Binance Wallet')">
          <img src="@/assets/images/binance.png" class="mr-10px rd-5px" width="32" lazy alt="">
          <span>Binance Wallet</span>
          <span class="ml-auto color-[--d-666-l-999] text-14px">{{ $t('scan') }}</span>
        </li>
        <li class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="connectEvmWallet('WalletConnect')">
          <Icon name="simple-icons:walletconnect" class="color-#5294F7 mr-10px text-32px" />
          <span>Wallet Connect V2</span>
          <span class="ml-auto color-[--d-666-l-999] text-14px">{{ $t('scan') }}</span>
        </li>
      </ul>
      <ul v-if="chain === 'solana'">
        <li v-for="item in walletStore.solanaWallets" :key="item.name" class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="_connectSolanaWallet(item)">
          <img :src="item.icon" class="mr-10px rd-5px" width="32" lazy alt="">
          <span>{{ item.name }}</span>
          <span v-if="item?.features" class="ml-auto color-[--d-666-l-999] text-14px">{{ $t('detected') }}</span>
        </li>
      </ul>
      <ul v-if="chain === 'tron'">
        <li v-for="item in walletStore.tronWalletAdapters" :key="item.name" class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="_connectTronWallet(item)">
          <img :src="item.icon" class="mr-10px rd-5px" width="32" lazy alt="">
          <span>{{ item.name }}</span>
          <span v-if="item?.readyState === 'Found'" class="ml-auto color-[--d-666-l-999] text-14px">{{ item?.name === 'WalletConnect' ? $t('scan') : $t('detected') }}</span>
        </li>
      </ul>
      <ul v-if="chain === 'sui'">
        <li v-for="item in walletStore.suiWallets" :key="item.name" class="flex items-center mb-10px bg-[--d-333-l-F2F2F2] h-48px rd-6px px-12px clickable" @click.stop="_connectSuiWallet(item)">
          <img :src="item.icon" class="mr-10px rd-5px" width="32" lazy alt="">
          <span>{{ item.name }}</span>
          <span v-if="item?.features" class="ml-auto color-[--d-666-l-999] text-14px">{{ $t('detected') }}</span>
        </li>
      </ul>
    </el-scrollbar>

  </div>
</template>

<script setup lang='ts'>
import { ArrowLeft } from '@element-plus/icons-vue'
import { connectSolanaWallet } from '~/utils/wallet/solana'
import { connectTronWallet } from '~/utils/wallet/tron'
import { connectSuiWallet } from '~/utils/wallet/sui'

const botStore = useBotStore()
const configStore = useConfigStore()
const walletStore = useWalletStore()
const chain = ref('bsc')
const queryChain = ref('')
const chains = computed(() => {
  return configStore.chainConfig?.filter?.(i => {
    const reg = new RegExp(queryChain.value, 'i')
    return (i.vm_type === 'evm' || i.net_name === 'tron' || i.net_name === 'solana' || i.net_name === 'sui') && (reg.test(i.name || '') || reg.test(i.net_name))
  })
})

function chainFilterMethod(query: string) {
  queryChain.value = query
}

function connectEvmWallet(item: any) {
  walletStore.connectEvmWallet(item, chain.value)?.then((res) => {
    console.log('connectEvmWallet res', res)
    if (res) {
      botStore.connectWalletTab = 0
      botStore.connectVisible = false
      _signMessageForFavorite()
    }
  })
}

function _connectSolanaWallet(item: typeof walletStore.solanaWallets[number]) {
  connectSolanaWallet(item)?.then((res) => {
    console.log('connectSolanaWallet res', res)
    if (res) {
      botStore.connectWalletTab = 0
      botStore.connectVisible = false
      _signMessageForFavorite()
    }
  })
}

function _connectTronWallet(item: typeof walletStore.tronWalletAdapters[number]) {
  connectTronWallet(item)?.then((res) => {
    console.log('connectTronWallet res', res)
    if (res) {
      botStore.connectWalletTab = 0
      botStore.connectVisible = false
      _signMessageForFavorite()
    }
  })
}

function _connectSuiWallet(item: typeof walletStore.suiWallets[number]) {
  connectSuiWallet(item)?.then((res) => {
    console.log('connectSuiWallet res', res)
    if (res) {
      botStore.connectWalletTab = 0
      botStore.connectVisible = false
      _signMessageForFavorite()
    }
  })
}

async function _signMessageForFavorite() {
  await sleep(1000)
  walletStore.signMessageForFavorite()
}


</script>

<style>

</style>
