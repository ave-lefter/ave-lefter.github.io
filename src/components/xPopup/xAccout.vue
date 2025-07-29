<template>
  <div v-if="info?.username && !loading" class="color-#5E6D89">
    <el-image class="w-300px h-90px" :src="info.cover_pic" alt="" srcset=""/>
    <div class="p-16px">
      <div class="flex items-center">
        <img :src="info.display_pic" class="rd-50% mr-8px" width="48" height="48" alt="" srcset="">
        <div>
          <div class="text-16px font-500 flex items-center">
            <span class="color-#F5F5F5">{{ info.name }}</span>
            <img class="ml-4px" src="@/assets/images/xV.svg" height="20" alt="" srcset="">
          </div>
          <div class="color-#5E6D89 text-12px mt-3px">@{{ info.username }}</div>
        </div>
        <img v-if="info.is_verified" class="rd-50% ml-auto" src="@/assets/images/x.svg" height="32" alt="" srcset="">
      </div>
      <div class="color-#5E6D89 text-12px mt-15px break-words" style="line-height: 1.4;">
        {{ info.bio }}
      </div>
      <div class="flex items-center color-#5E6D89 text-12px mt-8px">
        <Icon class="mr-5px" name="ri:calendar-todo-fill" />
        <span>Joined {{ dayjs(info.date_joined).locale('en').format('MMM YYYY')  }}</span>
      </div>
      <div class="flex items-center color-#5E6D89 text-14px mt-8px">
        <span class="text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(info.following, {locale: 'en'}) }}</span>
        <span>Following</span>
        <span class="ml-16px text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(info.followers , {locale: 'en'}) }}</span>
        <span>Followers</span>
      </div>
      <a :href="info.twitter_url" target="_blank" class="mt-16px block">
        <button class=" clickable w-100% h-32px flex items-center justify-center color-#009EF7 bg-transparent text-14px font-500 b-1px b-solid b-#009EF733 rd-8px">See profile on X</button>
      </a>
    </div>
  </div>
  <div v-if="!loading && !info?.username" class="p-16px w-300px min-h-100px flex flex-col items-center justify-center">
    <div class="text-16px font-500 color-#F5F5F5">{{ $t('accountNotFound') }}</div>
    <div class="text-14px font-500 color-#999 mt-8px">{{ $t('youCanNotSeeThisAccount') }}</div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs'
import { formatNumber } from '@/utils/formatNumber'
import type { PropType } from 'vue'
import type { XType2 } from '~/api/x'
defineProps({
  info: {
    type: Object as PropType<XType2 | null>,
    default: () => (null),
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style>

</style>
