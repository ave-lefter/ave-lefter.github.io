<template>
  <AveEmpty v-if="props.isMine && !botStore.evmAddress">
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('noWalletTip') }}</span>
    <el-button type="primary" class="text-12px w-266px h-40px" @click="botStore.changeConnectVisible(true)">
      {{ t('connectBotWallet') }}
    </el-button>
  </AveEmpty>
  <div v-else-if="props.isMine && isEmpty && !trackerStore.query.token_keyword" class="flex flex-col items-center pt-60px">
    <Icon name="custom:twitter-empty" class="text-61px mb-12px color-[--icon-color]" />
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('twitterEmpty') }}</span>
    <el-button type="primary" class="text-12px w-266px h-40px" @click="emits('startAttention')">
      {{ t('attention') }}
    </el-button>
  </div>
  <div v-else-if="isEmpty">
    <AveEmpty class="pt-40px">
      <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('emptyNoData') }}</span>
    </AveEmpty>
  </div>
  <div v-else ref="parentRef" class="affix-container overflow-y-auto scrollbar-hide" @scroll="onScroll" style="height:calc(100% - 75px)">
    <el-affix v-if="hasTop"  target=".affix-container" :offset="100">
      <div class="flex justify-center">
        <div class="flex items-center gap-0px py-6px px-4px rounded-4px bg-[--dialog-bg] text-[#37B270] text-12px clickable" @click="handleTop"><Icon name="custom:arrow-up"></Icon> {{ t('newMessage') }}</div>
      </div>
    </el-affix>
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
import { useInfiniteScroll,useThrottleFn } from '@vueuse/core'
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
const hasTop=shallowRef(false)
const virtualizer = useVirtualizer(
  computed(() => ({
    count: trackerStore.list.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 240,
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

useInfiniteScroll(parentRef, ()=>{
  emits('endReached')
}, { distance: 100 })

const onScroll = useThrottleFn((e) => {
  console.log('onScroll',e.target?.scrollTop,trackerStore.unReader)
  if(((e.target?.scrollTop||0)> 60)){
    trackerStore.isPaused=true
  }else{
    trackerStore.isPaused=false
    hasTop.value = false
  }
}, 100, true, false)

watch(() => trackerStore.unReader, (val) => {
  console.log('unReader', val,trackerStore.isPaused)
  if ((val > 0) && trackerStore.isPaused) {
    hasTop.value = true
  } else {
    hasTop.value = false
  }
})


function handleTop() {
  virtualizer.value.scrollToIndex(0)
  trackerStore.unReader=0
}
</script>
<style scoped lang="scss">
:deep(.el-scrollbar__thumb) {
  display: none;
}
</style>
