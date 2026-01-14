<template>
  <AveEmpty v-if="isMine && !botStore.evmAddress">
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('noWalletTip') }}</span>
    <el-button
      type="primary"
      class="text-12px w-266px h-40px"
      @click="botStore.changeConnectVisible(true)"
    >
      {{ t('connectWallet') }}
    </el-button>
  </AveEmpty>
  <div v-else-if="isMine && isEmpty" class="flex flex-col items-center pt-60px">
    <Icon name="custom:twitter-empty" class="text-61px mb-12px" />
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('twitterEmpty') }}</span>
    <el-button type="primary" class="text-12px w-266px h-40px">
      {{ t('attention') }}
    </el-button>
  </div>
</template>
<script setup name="twitterTackerList">
const { t } = useI18n()
const props = defineProps({
  activeTab: {
    type: Number,
    default: 1,
  },
})
const botStore = useBotStore()
const trackerStore = useTwitterTrackerStore()
const isEmpty = computed(() => trackerStore.list.length === 0)
const isMine = computed(() => props.activeTab === 2)
</script>
