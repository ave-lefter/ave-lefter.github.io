<template>
  <div v-if="info?.name && !loading" class="color-#5E6D89">
    <div class="relative w-300px h-168px pump-live-bg clickable flex items-center justify-center">
      <el-image v-if="info?.thumbnail" class="w-300px h-168px" :src="info.thumbnail" alt="" srcset=""/>
      <img v-else src="~/assets/images/pump.png" width="100" height="100" alt="" srcset="">
      <a :href="info.detail_url" target="_blank" class="w-300px h-168px icon-live flex items-center justify-center absolute inset-0 bg-#000000 bg-opacity-30">
        <Icon name="ri:video-on-line" class="text-30px color-#55D592" />
      </a>
    </div>
    <div class="p-16px">
      <div class="flex items-center">
        <img :src="info.image_uri" class="rd-50% mr-8px" width="48" height="48" alt="" srcset="">
        <div class="flex-1">
          <div class="text-16px font-500 flex items-center">
            <span class="color-#F5F5F5 mr-auto">{{ info.name }}</span>
            <span v-if="info?.created_timestamp" class="color-#55D592 text-12px whitespace-nowrap">{{ dayjs(info.created_timestamp).locale('en').fromNow() }}</span>
          </div>
          <div class="color-#5E6D89 text-12px mt-3px flex items-center">
            <span v-if="info.token">{{ info.token?.slice(0, 4) }}...{{ info.token?.slice(-4)  }}</span>
            <Icon
              v-copy="info.token"
              name="bxs:copy"
              class="text-12px ml-2px cursor-pointer color-#5E6D89 ml-4px"
              @click.stop.prevent
            />
            <span class="ml-auto">Replies: {{ formatNumber(info.reply_count, {locale: 'en'}) }}</span>
          </div>
        </div>
      </div>
      <div class="color-#5E6D89 text-12px mt-15px break-words" style="line-height: 1.4;">
        {{ info.description }}
      </div>
      <a :href="info.detail_url" target="_blank" class="mt-16px block">
        <button class=" clickable w-100% h-32px flex items-center justify-center color-#55D592 bg-transparent text-14px font-500 b-1px b-solid b-#55D592 rd-8px">Open in Pumpfun</button>
      </a>
    </div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs'
import { formatNumber } from '@/utils/formatNumber'
import type { LiveContent } from '~/api/pumpLive'
defineProps({
  info: {
    type: Object as PropType<LiveContent | null>,
    default: () => (null),
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang="scss">
</style>
