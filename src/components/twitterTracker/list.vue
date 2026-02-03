<template>
  <AveEmpty v-if="props.isMine && !botStore.evmAddress">
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('noWalletTip') }}</span>
    <el-button type="primary" class="text-12px w-266px h-40px" @click="botStore.changeConnectVisible(true)">
      {{ t('connectBotWallet') }}
    </el-button>
  </AveEmpty>
  <div v-else-if="props.isMine && isEmpty" class="flex flex-col items-center pt-60px">
    <Icon name="custom:twitter-empty" class="text-61px mb-12px color-[--icon-color]" />
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
  <div v-else ref="parentRef" class="overflow-y-auto" style="height:calc(100% - 120px)" @mouseenter="emits('stop',true)" @mouseleave="emits('stop',false)" @end-reached="onScrollEnd">
    <div :style="{
      height: `${totalSize}px`,
      width: '100%',
      position: 'relative'
    }">
      <div v-for="virtualRow in virtualItems" :key="String(virtualRow.key)" :style="{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        transform: `translateY(${virtualRow.start}px)`
      }">
        <div :ref="(el) => virtualizer.measureElement(el)" :data-index="virtualRow.index"
          class="border-b-1px border-b-solid border-b-[--border]">
          <ListItem :item="getItem(virtualRow)" :index="virtualRow.index" @measureElement="virtualizer.measureElement(el)" />
          <div v-if="['2', '3', '4'].includes(getItem(virtualRow).type) && (getItem(virtualRow).retweeted_tweet || getItem(virtualRow).quoted_tweet || getItem(virtualRow).replied_tweet)"
            class="border-1px border-solid border-[--dialog-divider] rounded-8px px-12px pt-16px ml-40px mb-16px">
            <ListItem :item="getItem(virtualRow).retweeted_tweet || getItem(virtualRow).quoted_tweet || getItem(virtualRow).replied_tweet" :index="-1" @measureElement="virtualizer.measureElement(el)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="twitterTackerList">
import ListItem from './listItem.vue'
import { useVirtualizer } from '@tanstack/vue-virtual'
const parentRef = ref(null)
const { t } = useI18n()
const emits = defineEmits(['startAttention', 'endReached','stop'])
const props = defineProps({
  isMine: {
    type: Boolean
  },
})
const botStore = useBotStore()
const trackerStore = useTwitterTrackerStore()

const virtualizer = useVirtualizer(
  computed(() => ({
    count: trackerStore.list.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 200,
    overscan: 5,
    gap: 16
  }))
)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const isEmpty = computed(() => trackerStore.list.length === 0)

const getItem = (virtualRow) => {
  return trackerStore.list[virtualRow.index] || {}
}
const onScrollEnd = (direction) => {
  if (direction === 'bottom') {
    emits('endReached')
  }
}

</script>
<style scoped lang="scss">
:deep(.el-scrollbar__thumb) {
  display: none;
}
</style>
