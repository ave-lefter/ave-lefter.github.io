<template>
  <AveEmpty v-if="isEmpty" class="pt-40px">
    <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('emptyNoData') }}</span>
  </AveEmpty>
  <div v-else ref="parentRef" class="overflow-y-auto scrollbar-hide" style="height:calc(100% - 120px)" @mouseenter="emits('stop',true)" @mouseleave="emits('stop',false)">
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
            <div :ref="(el) => virtualizer.measureElement(el)"  :data-index="virtualRow.index" class="flex gap-12px lh-20px">
              <div v-if="!getItem(virtualRow).created_at" class="font-400 text-14px flex items-center gap-4px" >
                <Icon name="ri:calendar-check-line" class="text-14px"></Icon>
                {{ getItem(virtualRow) }}
              </div>
              <div v-else class="flex shrink-1 gap-12px w-full">
                <div class="w-8px h-full relative grow-0">
                  <div :class="`w-8px h-8px ${virtualRow.index===0?'border-[--primary-color]':'border-[--third-text]'} border-[1px] border-solid border-rd-[50%] mt-7px relative z-2 bg-[--secondary]`"></div>
                  <div v-if="typeof props.dataSource?.[virtualRow.index+1] !== 'string'" class="h-full border-l-[--dialog-divider] border-l-[1px] border-l-solid absolute left-3px z-1"></div>
                </div>
                <div class="font-400 text-14px text-[--secondary-text] grow-1 w-full">
                  <!-- <div class="font-400 text-14px lh-20px mb-8px">4分钟前</div> -->
                  <TimerCount
                      v-if="getItem(virtualRow).created_at && Number(formatTimeFromNow(getItem(virtualRow).created_at, true)) < 60"
                      :key="`${item.created_at}`"
                      :timestamp="Math.min(+getItem(virtualRow).created_at, dayjs().unix() - 1)" :end-time="60">
                      <template #default="{ seconds }">
                          <span class="text-[--secondary-text] text-12px">
                              <template v-if="seconds < 60"> {{ seconds }}s </template>
                              <template v-else>
                                  {{ formatTimeFromNow(getItem(virtualRow).created_at) }}
                              </template>
                          </span>
                      </template>
                  </TimerCount>
                  <span v-else-if="Number(formatTimeFromNow(getItem(virtualRow).created_at, true))>60 * 60 * 24"
                      class="text-[--secondary-text] text-12px">
                      {{ formatDate(getItem(virtualRow).created_at, 'YYYY-MM-DD HH:mm:ss') }}
                  </span>
                  <span v-else v-tooltip="formatDate(getItem(virtualRow).created_at, 'YYYY-MM-DD HH:mm:ss')"
                      class="text-[--secondary-text] text-12px">
                      {{ formatTimeFromNow(getItem(virtualRow).created_at) }}
                  </span>
                  <div class="font-500 text-16px lh-22px text-[--main-text] mb-8px mt-8px">{{ getItem(virtualRow)?.title }}</div>
                  <div v-if="!onlyTitle" class="text-14px lh-22px mb-8px text-[--secondary-text]">{{ getItem(virtualRow)?.full_text }}</div>
                  <div class="flex justify-between mb-12px items-center font-400 text-12px lh-14px w-full">
                    <a class="text-[--primary-color]" :href="getItem(virtualRow)?.url" target="_blank">[{{ t('ViewFullText') }}]</a>
                    <div>{{ t('source') }}: {{ getItem(virtualRow)?.source }}</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </div>
    <div ref="sentinel2" style="height: 1px;"></div>
    <div v-if="trackerStore.showFooter" class="text-center text-12px text-[--third-text] w-100% pt-12px">{{ !trackerStore.finished2 ? t('loading') : t('noMore') }}</div>
  </div>
  <!-- <div  class="activity-list">
    <ul>
      <li v-for="(item, index) in dataSource" :key="item" class="flex gap-12px">
        <div class="flex shrink-1 gap-12px">
          <div class="w-8px h-full relative grow-0">
            <div :class="`w-8px h-8px ${index===0?'border-[--primary-color]':'border-[--third-text]'} border-[1px] border-solid border-rd-[50%] mt-7px relative z-2 bg-[--secondary]`"></div>
            <div v-if="dataSource.length-1 !== index" class="h-full border-l-[--dialog-divider] border-l-[1px] border-l-solid absolute left-3px z-1"></div>
          </div>
          <div class="font-400 text-14px text-[--secondary-text] grow-1">
            <div class="font-400 text-14px lh-20px mb-8px">4分钟前</div>
            <div class="font-500 text-16px lh-22px mb-8px text-[--main-text]">{{ item.title }}</div>
            <div class="text-14px lh-22px mb-8px text-[--secondary-text]">{{ item.desc }}</div>
          </div>
        </div>
      </li>
    </ul>
  </div> -->
</template>

<script setup>
import { useVirtualizer } from '@tanstack/vue-virtual'
import { useInfiniteScroll,useIntersectionObserver } from '@vueuse/core'
const props = defineProps({
  dataSource: {
    type: Array,
    default: () => []
  },
  onlyTitle: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()
const emits = defineEmits(['endReached','stop'])
const trackerStore = useTwitterTrackerStore()
const sentinel1 = ref(null)
const sentinel2 = ref(null)
const parentRef = ref(null)
const virtualizer = useVirtualizer(
  computed(() => ({
    count: props.dataSource.length,
    getScrollElement: () => parentRef.value,
    estimateSize: () => 200,
    overscan: 5,
    gap: 0
  }))
)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const isEmpty = computed(() => props.dataSource.length === 0)

const getItem = (virtualRow) => {
  return props.dataSource[virtualRow.index] || {}
}
useIntersectionObserver(
  sentinel2,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !trackerStore.loading2 && !trackerStore.finished2) {
      trackerStore.showFooter=true
      emits('endReached')
    }
  },
  {
    root: parentRef,
    threshold: 0.1,
  }
).value
</script>

<style scoped>
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
