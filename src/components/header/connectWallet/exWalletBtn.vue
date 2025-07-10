<template>
  <el-popover
    placement="bottom-end"
    :width="350"
    trigger="click"
  >
    <template #reference>
      <button class="text-12px bg-[--d-222-l-F2F2F2] rounded-4px p-8px ml-8px h-32px flex items-center clickable color-[--d-F5F5F5-l-333] border-none">
        <img height="24" class="mr-5px rd-50%" :src="`${configStore.token_logo_url}chain/${walletStore.chain}.png`" :alt="walletStore.chain" onerror="this.src='/icon-default.png'">
        <span>{{ currentAccountSplit }}</span>
      </button>
    </template>
    <div class="text-14px p-5px">
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
        @click.stop="walletStore.disconnectEvmWallet()"
      >
        {{ $t('disconnect') }}
      </el-button>
    </div>
  </el-popover>
</template>

<script setup lang='ts'>
const walletStore = useWalletStore()
const configStore = useConfigStore()
const currentAccountSplit = computed(() => {
  return walletStore.address?.replace?.(new RegExp('(.{4})(.+)(.{4})'), '$1...$3') || ''
})

</script>

<style>

</style>
