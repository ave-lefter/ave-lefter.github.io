<template>
  <el-dialog
    v-model="dialogVisible"
    class="dialog-bot-tips"
    :class="{
      'dialog-bot-video': isFunctionNoticeAndMediaType,
    }"
    :show-close="false"
    modal-class="modal-layer"
    destroy-on-close
    @close="startExperience"
  >
    <!--    初始弹窗  -->
    <div v-if="newUserNoticeVisible" style="text-align: center">
      <div class="flex-center text-24px">
        <img src="@/assets/images/avedex_mobile_logo.png" height="40" alt="" lazy >
        <span class="ml-10px font-600 color-[--d-FFF-l-333]">Ave.ai</span>
      </div>
      <div
        class="text-center text-28px font-600 color-[--d-FFF-l-333] mt-30px"
       >
        {{ $t('botTipsTitle') }}
      </div>
      <ul
        class="text-16px font-500 mt-30px lh-[40px] text-left"
        :style="{ color: isDark ? '#f5f5f5' : '#666666' }"
      >
        <li>{{ $t('botTips1') }}</li>
        <li>{{ $t('botTips2') }}</li>
        <li>{{ $t('botTips3') }}</li>
        <li>{{ $t('botTips4') }}</li>
        <li>
          {{ $t('botTips5') }}
          <span
            >Bullx <span style="color: #f6465d">❌</span>,Trojan
            <span style="color: #f6465d">❌</span>,Ave ✅</span
          >
        </li>
        <li>{{ $t('botTips6') }}</li>
      </ul>
    </div>
    <!--    新公告弹窗  -->
    <div v-else-if="!isLatestExperienced" class="color-[--d-FFF-l-333]">
      <template v-if="!isMediaType">
        <strong class="flex items-center justify-center bell text-20px">
          {{ $t('Announcement') }}
        </strong>
        <h2 class="title text-28px mb-24px">
          {{ latestNotice.title }}
        </h2>
        <div class="my-0 lh-[1.5] notice-content" v-html="latestNotice.content" />
      </template>
      <Swiper
        v-else
        class="mb-20px"
        :slides-per-view="1"
        :space-between="8"
        :pagination="{ clickable: true }"
        :modules="modules"
        @slideChange="onSlideChange"
        @swiper="onSwiper"
      >
        <SwiperSlide v-for="({ title, media, desc }, idx) in mediaArr" :key="idx">
          <video
            v-if="supportMediaType.some((el) => media.endsWith(el))"
            class="rounded-16px mb-20px loading"
            width="100%"
            :src="media"
            autoplay
            muted
            loop
          />
          <img v-else class="rounded-16px mb-20px" width="100%" :src="media" alt="" >
          <h2 v-if="title" class="title mb-8px text-center">
            {{ title }}
          </h2>
          <p v-if="desc" class="mb-20px mt-0 text-center color-#999">
            {{ desc }}
          </p>
        </SwiperSlide>
      </Swiper>
      <el-divider
        v-if="isFunctionNoticeAndMediaType"
        :style="{
          margin: '0 -16px',
          width: 'auto',
          '--el-border-color': 'var(--d-333333-l-F2F2F2)',
        }"
      />
    </div>
    <!--    底部按钮区域   -->
    <!--媒体类型公告-->
    <div v-if="isFunctionNoticeAndMediaType" class="py-20px flex items-center justify-between">
      <span v-show="swiperActiveIdx === 0" class="color-#999 text-14px flex items-center"
        ><img class="mr-4px" src="@/assets/images/rocket.svg" >Ave.ai有更新啦</span
      >
      <el-button
        v-show="swiperActiveIdx !== 0"
        :style="{ '--el-button-text-color': '#999', width: '120px' }"
        :color="isDark ? '#333' : '#F5F5F5'"
        @click="prev"
      >
        {{ $t('back') }}
      </el-button>
      <div>
        <div class="mb-5px flex items-center justify-center">
          <img src="@/assets/images/avedex_mobile_logo.png" height="21" alt="" lazy >
          <span class="ml-5px font-600 text-14px color-[--d-FFF-l-333]">Ave.ai</span>
        </div>
        <div class="text-12px color-#999">
          {{ $t('campaignTitle') }}
        </div>
      </div>
      <el-button
        :style="{ '--el-button-text-color': 'var(--d-333-l-FFF)', width: '120px' }"
        :color="isDark ? '#F5F5F5' : '#333'"
        @click="next"
      >
        {{ isLastSwiper ? $t('complete') : $t('next') }}
      </el-button>
    </div>
    <!--文本类型的公告-->
    <div v-else class="text-center">
      <el-button
        :color="isDark ? '#F5F5F5' : '#222222'"
        style="max-width: 80%; width: 340px; margin-top: 70px;color:var(--reverse-color)"
        size="large"
        @click.stop="startExperience"
      >
        {{ $t('startExperience') }}
      </el-button>
      <div v-if="!newUserNoticeVisible && !isLatestExperienced">
        <div class="mt-30px mb-10px flex items-center justify-center" style="color: var(--a-text-5-color)">
          <img src="@/assets/images/avedex_mobile_logo.png" height="21" alt="" lazy >
          <span class="ml-10px font-600 text-14px">Ave.ai</span>
        </div>
        <div class="text-12px color-#999">
          {{ $t('campaignTitle') }}
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper'
import 'swiper/swiper-bundle.min.css'

const NOTICE_FILTER_TIME = 1744460716
const modules = [Pagination]
const supportMediaType = ['.mp4', '.mov', '.webm', '.ogg']

// const newUserNoticeVisible = useStorage('bot_tips_dialogVisible', true, localStorage)
const newUserNoticeVisible = shallowRef(false)
const lastExperienceTime = useStorage('lastExperienceTime', 0, localStorage)
const dialogVisible = ref(false)
const swiperActiveIdx = ref(0)
const swiper = ref<any>(null)
const loading = ref(false)

const globalStore = useGlobalStore()
const botStore = useBotStore()
const { latestNotice, isDark } = storeToRefs(globalStore)

const isLatestExperienced = computed(() => {
  return (
    (latestNotice.value?.time ?? 0) <= NOTICE_FILTER_TIME ||
    Number(lastExperienceTime.value) >= Number(latestNotice.value?.time)
  )
})

const isMediaType = computed(() => {
  if (!latestNotice.value?.media) return false
  try {
    return JSON.parse(latestNotice.value.media).some((el: any) => el.media)
  } catch {
    console.log(latestNotice.value.media, 'latestNotice.value.media')
    return false
  }
})

const isFunctionNoticeAndMediaType = computed(() => {
  return !newUserNoticeVisible.value && !isLatestExperienced.value && isMediaType.value
})

const mediaArr = computed(() => {
  if (!isMediaType.value) return []
  try {
    return JSON.parse(latestNotice.value.media).filter((el: any) => !!el.media)
  } catch {
    return []
  }
})

const isLastSwiper = computed(() => swiperActiveIdx.value === mediaArr.value.length - 1)

function startExperience() {
  dialogVisible.value = false
  setTimeout(() => {
    if (newUserNoticeVisible.value) {
      newUserNoticeVisible.value = false
    } else if (!isLatestExperienced.value) {
      lastExperienceTime.value = latestNotice.value?.time ?? 0
    }
  }, 200)
}

function onSlideChange(sw: any) {
  swiperActiveIdx.value = sw.activeIndex
}
function onSwiper(sw: any) {
  swiper.value = sw
}
function next() {
  if (isLastSwiper.value) {
    startExperience()
  } else {
    swiper.value?.slideNext()
  }
}
function prev() {
  swiper.value?.slidePrev()
}

watch(newUserNoticeVisible, (val) => {
  if (val) {
    loading.value = true
    botStore.getUserAllChainBalance?.()
    loading.value = false
  }
})

watch(()=>[isLatestExperienced.value],()=>{
  dialogVisible.value = !isLatestExperienced.value
})

defineExpose({
  openBotTipDialog:()=>{
    lastExperienceTime.value = 0
  }
})
</script>
<style lang="scss">
.dialog-bot-tips.el-dialog {
  --el-dialog-width: 500px;
  --el-dialog-padding-primary: 60px 40px 40px 40px;
}

.dialog-bot-video.el-dialog {
  --el-dialog-width: 640px;
  --el-dialog-padding-primary: 16px 16px 0 16px;
  border-radius: 16px;
  --swiper-pagination-bullet-horizontal-gap: 8px;
  --swiper-pagination-bullet-inactive-color: var(--d-333-l-D8D8DC);
  --swiper-pagination-bullet-inactive-opacity: 1;
  --swiper-pagination-color: var(--d-FFF-l-333);

  .swiper-pagination-bullets.swiper-pagination-horizontal {
    bottom: 0;
  }
}

.bell {
  margin-bottom: 24px;
  gap: 10px;

  &:before {
    content: '';
    width: 42px;
    height: 42px;
    border-radius: 16px;
    background: var(--d-FFF-l-F5F5F5) url(@/assets/images/bell2.svg) center center no-repeat;
  }
}

.modal-layer {
  backdrop-filter: blur(4px);
}

.loading {
  background: url(@/assets/images/loading.webp) center center no-repeat;
  background-size: 100px 100px;
}
</style>
