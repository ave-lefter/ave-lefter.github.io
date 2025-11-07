<template>
  <el-popover
    v-model:visible="showExWallet"
    placement="bottom-end"
    :width="350"
    trigger="click"
  >
    <template #reference>
      <button class="text-12px bg-[--d-141721-l-E8F1FF] rounded-4px p-8px ml-8px h-32px flex items-center clickable color-[--main-text] border-none">
        <img height="24" class="mr-5px rd-50%" :src="`${configStore.token_logo_url}chain/${walletStore.chain}.png`" :alt="walletStore.chain" onerror="this.src='/icon-default.png'">
        <span>{{ currentAccountSplit }}</span>
      </button>
    </template>
    <!-- <div class="text-14px p-5px">
      <div class="color-[--d-666-l-999] flex">{{ $t('address') }}</div>
      <div class="border-solid border-1px border-[--d-333-l-F5F5F5] rounded-4px p-8px mt-15px flex items-center justify-between h-40px">
        <span>{{ currentAccountSplit }}</span>
        <Icon
          v-copy="walletStore.address"
          name="bxs:copy"
          class="text-12px ml-3px clickable color-[--d-666-l-999] ml-4px"
          @click.stop.prevent
        />
      </div>
      <el-button
        class="w-100% mt-15px border-transparent! bg-[rgb(63,128,247,0.16)]! color-#3F80F7! h-38px!"
        size="large"
        type="primary"
        @click.stop="walletStore.disconnect()"
      >
        {{ $t('disconnect') }}
      </el-button>
    </div> -->
    <!-- <div>
      <div class="flex items-center p-8px mb-12px color-[--main-text] clickable" @click.stop="$router.push(`/address/${walletStore.address}/${walletStore.chain}`);showExWallet=false">
        <img class="rd-50% mr-5px" height="32" :src="generateAvatarIcon(walletStore?.address || '')" alt="">
        <span class="text-16px mr-3px">{{ currentAccountSplit || '' }}</span>
        <Icon
          v-copy="walletStore.address"
          name="bxs:copy"
          class="text-12px clickable color-[--secondary-text]"
          @click.stop.prevent
        />
        <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px color-[--secondary-text]" />
      </div>
      <div class="tabs">
        <button>链上钱包</button>
        <button>永续合约</button>
      </div>
    </div> -->
    <ul class="tg-wallet-list_footer flex flex-col gap-10px">
      <li class="flex justify-between h-40px px-8px clickable" @click.stop="$router.push(`/address/${walletStore.address}/${walletStore.chain}`);showExWallet=false">
        <div class="color-[--main-text] flex items-center gap-8px" >
          <Icon name="custom:wallet2" class="text-16px" />
          <span class="text-14px">{{ $t('myWallet1') }}</span>
        </div>
        <div class="color-[--secondary-text] flex items-center gap-4px">
          <span class="text-12px">
            {{ currentAccountSplit || '' }}
          </span>
          <Icon
            v-copy="walletStore.address"
            name="bxs:copy"
            class="text-12px clickable color-[--secondary-text]"
            @click.stop.prevent
          />
          <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
        </div>
      </li>
      <li v-if="walletStore.chain === 'solana'" class="flex justify-between h-40px px-8px clickable" @click.stop="$router.push('/solana-rent-recovery');showExWallet=false">
        <div class="color-[--main-text] flex items-center gap-8px">
          <Icon name="custom:sack-dollar" class="text-16px" />
          <span class="text-14px">{{ $t('rentRecovery') }}</span>
        </div>
        <div class="color-[--secondary-text] flex items-center gap-4px">
          <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
        </div>
      </li>
      <li class="flex justify-between h-40px px-8px clickable" @click.stop="perpStore.login">
        <div class="color-[--main-text] flex items-center gap-8px">
          <Icon name="custom:log-out" class="text-16px" />
          <span class="text-14px">永续合约</span>
        </div>
        <div class="color-[--secondary-text] flex items-center gap-4px">
          <span class="text-12px" :class="{'color-[--up-color]': perpStore.isLogin}">
            {{ perpStore.isLogin ? '已登录' : '未登录' }}
          </span>
          <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
        </div>
      </li>
      <li class="flex justify-between h-40px px-8px clickable" @click.stop="walletStore.disconnect()">
        <div class="color-[--main-text] flex items-center gap-8px">
          <Icon name="custom:log-out" class="text-16px" />
          <span class="text-14px">{{ $t('disconnect') }}</span>
        </div>
        <div class="color-[--secondary-text] flex items-center gap-4px">
          <Icon name="material-symbols:chevron-right-rounded" class="text-16px mr--5px" />
        </div>
      </li>
    </ul>
  </el-popover>
</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'
const walletStore = useWalletStore()
const configStore = useConfigStore()
const showExWallet = ref(false)
const perpStore = usePerpStore()
const currentAccountSplit = computed(() => {
  return walletStore.address?.replace?.(new RegExp('(.{4})(.+)(.{4})'), '$1...$3') || ''
})

// const activeTab = ref(1)


</script>

<style>

</style>
