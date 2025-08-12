<template>
  <div v-if="info?.community_name && !loading" class="color-#5E6D89">
    <el-image v-if="info.community_banner_url" class="w-300px h-90px" :src="info.community_banner_url" alt="" srcset=""/>
    <div class="p-16px">
      <div class="flex items-center">
        <span class="color-#F5F5F5 text-16px font-500">{{ info.community_name }}</span>
        <img class="rd-50% ml-auto" src="@/assets/images/x.svg" height="32" alt="" srcset="">
      </div>
      <div class="flex items-center color-#5E6D89 text-12px mt-8px">
        <!-- <Icon class="mr-5px" name="ri:calendar-todo-fill" />
        <span>Created {{ dayjs(info.created_date).locale('en').format('MMM D, YYYY')  }}</span> -->
        <el-image v-for="(avatar, index) in info.member_logos?.slice(0, 5)" :key="index"  class="w-24px h-24px rd-50%" :class="{'ml--10px': index > 0}" :src="avatar" alt="" srcset=""/>
        <span class="ml-auto text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(info.member_count , {locale: 'en'}) }}</span>
        <span>Members</span>
      </div>
      <div class="my-16px" style="border-bottom: 1px solid #5E6D894D" />
      <div class="text-14px mb-8px">Created by</div>
      <div class="flex items-center">
          <img :src="info.creator_picture" class="rd-50% mr-8px" width="48" height="48" alt="" srcset="">
          <div>
            <div class="text-16px font-500 flex items-center">
              <span class="color-#F5F5F5">{{ info.creator_name }}</span>
              <img v-if="info.creator_is_verified" class="ml-4px" src="@/assets/images/xV.svg" height="20" alt="" srcset="">
            </div>
            <div class="color-#5E6D89 text-12px mt-3px">@{{ info.creator_username }}</div>
          </div>
        </div>
        <div class="color-#5E6D89 text-12px mt-15px">
          {{ info.description }}
        </div>
        <div class="flex items-center color-#5E6D89 text-12px mt-8px">
          <Icon class="mr-5px" name="ri:calendar-todo-fill" />
          <span>Joined {{ dayjs(info.created_date).locale('en').format('MMM YYYY')  }}</span>
        </div>
        <div class="flex items-center color-#5E6D89 text-14px mt-8px">
          <span class="text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(info.creator_following, {locale: 'en'}) }}</span>
          <span>Following</span>
          <span class="ml-16px text-16px font-700 mr-4px color-#F5F5F5">{{ formatNumber(info.creator_followers , {locale: 'en'}) }}</span>
          <span>Followers</span>
        </div>
        <a :href="info.twitter_url" target="_blank" class="mt-16px block">
          <button class=" clickable w-100% h-32px flex items-center justify-center color-#009EF7 bg-transparent text-14px font-500 b-1px b-solid b-#009EF733 rd-8px">View community on X</button>
        </a>
    </div>
  </div>
  <div v-if="!loading && !info?.community_name" class="p-16px w-300px min-h-100px flex flex-col items-center justify-center">
    <div class="text-16px font-500 color-#F5F5F5">{{ $t('communityNotFound') }}</div>
    <div class="text-14px font-500 color-#999 mt-8px">{{ $t('youCanNotSeeThisCommunity') }}</div>
  </div>
</template>

<script setup lang='ts'>
import dayjs from 'dayjs'
import { formatNumber } from '@/utils/formatNumber'
import type { PropType } from 'vue'
import type { XType3 } from '~/api/x'
defineProps({
  info: {
    type: Object as PropType<XType3 | null>,
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
