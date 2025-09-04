<template>
  <div v-if="info?.content && !loading" class="color-#5E6D89 w-300px">
    <div class="p-16px">
      <div class="flex items-center">
        <img :src="info.display_pic" class="rd-50% mr-8px" width="48" height="48" alt="" srcset="">
        <div>
          <div class="text-16px font-500 flex items-center">
            <span class="color-#F5F5F5">{{ info.name }}</span>
            <img class="ml-4px" src="@/assets/images/xV.svg" height="20" alt="" srcset="">
          </div>
          <div class="color-#5E6D89 text-12px mt-3px">
            <span>@{{ info.username }}</span>
            <!-- <a :href="`https://x.com/intent/follow?screen_name=${info.username}`" target="_blank" class="color-#009EF7 text-14px clickable ml-3px">Follow</a> -->
          </div>
        </div>
        <img class="rd-50% ml-auto" src="@/assets/images/x.svg" height="32" alt="" srcset="">
      </div>
      <div class="flex items-center color-#5E6D89 text-14px mt-8px">
        <Icon class="mr-5px" name="ri:calendar-todo-fill" />
        <span>Joined {{ dayjs(info.joined_date).locale('en').format('MMM YYYY')  }}</span>
        <span class="ml-16px text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(info.followers , {locale: 'en', limit: 10}) }}</span>
        <span>Followers</span>
      </div>
      <div class="my-8px" style="border-bottom: 1px solid #5E6D894D" />
      <div v-if="info?.content" class="break-words color-#F5F5F5 text-14px ellipsis-10" v-html="convertTextToHtml(info.content)" />
      <el-image v-if="info?.media" :src="info.media" class="mt-8px w-100%" alt="" srcset="" />
      <div class="text-12px mt-12px flex items-center">
        <span>{{ $dayjs(info.tweet_created).locale('en').fromNow(true) }} · {{ dayjs(info.tweet_created).locale('en').format('h:mm A, MMM D, YYYY') }}</span>
        <Icon class="ml-auto text-14px" name="ri:bookmark-fill" />
        <span class="ml-2px text-14px">{{ info.bookmark_count }}</span>
      </div>
      <div class="my-8px" style="border-bottom: 1px solid #5E6D894D" />
      <div class="text-14px flex items-center">
        <Icon class="text-18px color-#F45469 mr-2px" name="material-symbols:favorite" />
        <span>{{ info.like_count }}</span>
        <Icon class="text-18px color-#12B886 mr-2px ml-auto" name="ri:repeat-line" />
        <span>{{ info.retweet_count }}</span>
        <Icon class="text-18px color-#009EF7 mr-2px ml-auto" name="ri:chat-3-fill" />
        <span>{{ info.reply_count }}</span>
      </div>
      <a :href="info.twitter_url" target="_blank" class="mt-16px block">
        <button class=" clickable w-100% h-32px flex items-center justify-center color-#009EF7 bg-transparent text-14px font-500 b-1px b-solid b-#009EF733 rd-8px">Read more on X</button>
      </a>
    </div>
  </div>
  <div v-if="!loading && !info?.content" class="p-16px w-300px min-h-100px flex flex-col items-center justify-center">
    <div class="text-16px font-500 color-#F5F5F5">{{ $t('tweetNotFound') }}</div>
    <div class="text-14px font-500 color-#999 mt-8px">{{ $t('youCanNotSeeThisTweet') }}</div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs'
import $dayjs from '@/utils/day'
import { formatNumber } from '@/utils/formatNumber'
import type { XType1 } from '~/api/x'
import { convertTextToHtml } from './utils'
defineProps({
  info: {
    type: Object as PropType<XType1 | null>,
    default: () => (null),
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped lang='scss'>
.ellipsis-10 {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 10;
  -webkit-box-orient: vertical;
}

</style>
