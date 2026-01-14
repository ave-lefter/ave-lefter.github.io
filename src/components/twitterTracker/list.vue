<template>
  <AveEmpty>
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('noWalletTip') }}</span>
    <el-button
      type="primary"
      class="text-12px w-266px h-40px"
      @click="botStore.changeConnectVisible(true)"
    >
      {{ t('connectWallet') }}
    </el-button>
  </AveEmpty>
</template>
<script setup name="twitterTackerList">
const { t } = useI18n()
const botStore = useBotStore()
</script>
