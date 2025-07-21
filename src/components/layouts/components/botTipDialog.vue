<template>
  <el-dialog
    v-model="dialogVisible"
    class="dialog-bot-tips"
    :class="{
      'dialog-bot-video': isFunctionNoticeAndMediaType,
    }"
    :show-close="false"
    modal-class="modal-layer"
  >
    <!--    初始弹窗  -->
    <div v-if="newUserNoticeVisible" style="text-align: center">
      <div class="flex-center" style="font-size: 24px; color: var(--a-text-5-color)">
        <img src="@/assets/images/avedex_mobile_logo.png" height="40" alt="" lazy >
        <span class="ml-10 font-600">Ave.ai</span>
      </div>
      <div
        style="
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          color: var(--a-text-5-color);
          margin-top: 30px;
        "
      >
        {{ $t('botTipsTitle') }}
      </div>
      <ul
        style="
          font-size: 16px;
          font-weight: 500;
          margin-top: 30px;
          line-height: 40px;
          text-align: left;
        "
        :style="{ color: mode === 'dark' ? '#f5f5f5' : '#666666' }"
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
    <div v-else-if="!isLatestExperienced" class="d-f5f5f5-l-222">
      <template v-if="!isMediaType">
        <strong class="flex-center bell flex-center font-20">
          {{ $t('Announcement') }}
        </strong>
        <h2 class="title font-28 mb-24">
          {{ latestNotice.title }}
        </h2>
        <div class="my-0 lh-1.5" v-html="latestNotice.content" />
      </template>
      <Swiper
        v-else
        class="mb-20"
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
            class="video mb-20 loading"
            width="100%"
            :src="media"
            autoplay
            muted
            loop
          />
          <img v-else class="video mb-20" width="100%" :src="media" alt="" >
          <h2 v-if="title" class="title mb_8 text-center">
            {{ title }}
          </h2>
          <p v-if="desc" class="mb-20 mt-0 text-center color-999">
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
    <div v-if="isFunctionNoticeAndMediaType" class="py-20 flex-between">
      <span v-show="swiperActiveIdx === 0" class="color-999 font-14 flex-start"
        ><img class="mr-4" src="@/assets/images/rocket.svg" >Ave.ai有更新啦</span
      >
      <el-button
        v-show="swiperActiveIdx !== 0"
        :style="{ '--el-color-black': '#999', width: '120px' }"
        :color="mode === 'dark' ? '#333' : '#F5F5F5'"
        @click="prev"
      >
        {{ $t('back') }}
      </el-button>
      <div>
        <div class="mb-5 flex-center" style="color: var(--a-text-5-color)">
          <img src="@/assets/images/avedex_mobile_logo.png" height="21" alt="" lazy >
          <span class="ml-5 font-600 font-14">Ave.ai</span>
        </div>
        <div class="font-12 color-999">
          {{ $t('campaignTitle') }}
        </div>
      </div>
      <el-button
        :style="{ '--el-color-black': 'var(--d-333-l-fff)', width: '120px' }"
        :color="mode === 'dark' ? '#F5F5F5' : '#333'"
        @click="next"
      >
        {{ isLastSwiper ? $t('complete') : $t('next') }}
      </el-button>
    </div>
    <!--文本类型的公告-->
    <div v-else class="text-center">
      <el-button
        :color="mode === 'dark' ? '#f5f5f5' : '#222222'"
        style="max-width: 80%; width: 340px; margin-top: 70px"
        size="large"
        @click.stop="startExperience"
      >
        {{ $t('startExperience') }}
      </el-button>
      <div v-if="!newUserNoticeVisible && !isLatestExperienced">
        <div class="mt-30 mb-10 flex-center" style="color: var(--a-text-5-color)">
          <img src="@/assets/images/avedex_mobile_logo.png" height="21" alt="" lazy >
          <span class="ml-10 font-600 font-14">Ave.ai</span>
        </div>
        <div class="font-12 color-999">
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

const newUserNoticeVisible = useStorage('bot_tips_dialogVisible', true, localStorage)
const lastExperienceTime = useStorage('lastExperienceTime', 0, localStorage)
const dialogVisible = ref(false)
const swiperActiveIdx = ref(0)
const swiper = ref<any>(null)
const loading = ref(false)

const globalStore = useGlobalStore()
const botStore = useBotStore()
const { latestNotice, mode } = storeToRefs(globalStore)

const isLatestExperienced = computed(() => {
  return (
    (latestNotice.value?.time ?? 0) <= NOTICE_FILTER_TIME ||
    String(lastExperienceTime.value) === String(latestNotice.value?.time)
  )
})

const isMediaType = computed(() => {
  if (!latestNotice.value?.media) return false
  try {
    return JSON.parse(latestNotice.value.media).some((el: any) => el.media)
  } catch {
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

watch(()=>[newUserNoticeVisible.value,isLatestExperienced.value],()=>{
  dialogVisible.value = newUserNoticeVisible.value || !isLatestExperienced.value
})
</script>
<style lang="scss" scoped>
.video {
  border-radius: 16px;
}
</style>
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
  --swiper-pagination-color: var(--d-fff-l-333);

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
    background: var(--d-fff-l-f5f5f5) url(~@/assets/images/bell2.svg) center center no-repeat;
  }
}

.d-f5f5f5-l-222 {
  color: var(--d-f5f5f5-l-222);
}

.modal-layer {
  backdrop-filter: blur(4px);
}

.loading {
  background: url('~@/assets/images/loading.webp') center center no-repeat;
  background-size: 100px 100px;
}
</style>
