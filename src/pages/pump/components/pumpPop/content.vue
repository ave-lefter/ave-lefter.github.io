<template>
  <div v-if="info?.username && !loading">
    <div class="p-16px">
      <div class="color-[--main-text]">@{{ info.username }}</div>
      <div class="flex items-center color-[--third-text]">
        <span>{{ formatNumber(info.followers, {decimals: 2, l: 4, limit: 3, locale: 'en'}) }} {{ $t('follows') }}</span>
        <el-divider direction="vertical" />
        <span>{{ $t('joined') }} {{ dayjs(info.date_joined).locale('en').format('MMM YYYY')  }}</span>
      </div>
    </div>
  </div>
  <div v-if="!loading && !info?.username"  class="p-12px w-200px  min-h-60px flex flex-col items-center justify-center">
    <div class="text-12px font-400 color-[--third-text]">{{ $t('emptyNoData') }}</div>
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
