<template>
  <AveEmpty v-if="props.isMine && !botStore.evmAddress">
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('noWalletTip') }}</span>
    <el-button
      type="primary"
      class="text-12px w-266px h-40px"
      @click="botStore.changeConnectVisible(true)"
    >
      {{ t('connectWallet') }}
    </el-button>
  </AveEmpty>
  <div v-else-if="props.isMine && isEmpty" class="flex flex-col items-center pt-60px">
    <Icon name="custom:twitter-empty" class="text-61px mb-12px" />
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('twitterEmpty') }}</span>
    <el-button type="primary" class="text-12px w-266px h-40px" @click="emits('startAttention')">
      {{ t('attention') }}
    </el-button>
  </div>
  <div v-else-if="!props.isMine && isEmpty">
    <AveEmpty class="pt-40px">
      <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('emptyNoData') }}</span>
    </AveEmpty>
  </div>
 <el-scrollbar v-else height="calc(100% - 120px)" @end-reached="onScrollEnd">
  <div class="flex flex-col gap-16px">
    <div v-for="(item, index) in trackerStore.list" :key="item.id" class="border-b-1px border-b-solid border-b-[--border]">
      <ListItem :item="item" :index="index" />
      <div v-if="['2','3','4'].includes(item.type)" class="border-1px border-solid border-[--dialog-divider] rounded-8px px-12px pt-16px ml-40px mb-16px">
        <ListItem :item="item.retweeted_tweet||item.quoted_tweet||item.replied_tweet" :index="-1"
/>
      </div>
    </div>
  </div>
 </el-scrollbar>
</template>
<script setup name="twitterTackerList">
import ListItem from './listItem.vue'
const { t } = useI18n()
const emits = defineEmits(['startAttention','endReached'])
const props = defineProps({
  isMine: {
    type: Boolean
  },
})
const botStore = useBotStore()
const trackerStore = useTwitterTrackerStore()
const isEmpty = computed(() => trackerStore.list.length === 0)

const onScrollEnd = (direction) => {
  if(direction === 'bottom'){
    emits('endReached')
  }
}

</script>
<style scoped lang="scss">
  :deep(.el-scrollbar__thumb){
    display: none;
  }
</style>
