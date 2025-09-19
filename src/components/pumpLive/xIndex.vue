<template>
  <div class="w-300px">
    <component :is="Com" :info="info" :loading="loading" />
    <el-skeleton v-if="loading" :rows="5" animated style="--el-skeleton-circle-size: 32px">
      <template #template>
        <el-skeleton-item variant="image" class="w-100% h-100px" />
        <div class="p-10px">
          <div class="flex items-center mb-10px">
            <el-skeleton-item variant="circle" />
            <div class="flex items-center ml-10px flex-col">
              <el-skeleton-item variant="p" class="w-50px" />
              <el-skeleton-item variant="p" class="w-60px mt-5px" />
            </div>
          </div>
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="p" style="width: 100%" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang='ts'>
import Content from './content.vue'
import type { LiveContent } from '~/api/pumpLive'
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  info: {
    type: Object as PropType<LiveContent | null>,
    default: () => (null),
  }
})

const Com = computed(() => {
  return Content
})

</script>

<style>

</style>
