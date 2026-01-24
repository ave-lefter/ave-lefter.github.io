<template>
  <div class="w-200px bg-[--main-input-button-bg]">
    <component :is="Com" :info="info" :tokenId="tokenId" :loading="loading" />
    <el-skeleton v-if="loading" :rows="5" animated style="--el-skeleton-circle-size: 32px;padding: 12px">
      <template #template>
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang='ts'>
import Content from './content.vue'
import type { _getDevInfo } from '~/api/pump'
type DevInfo = Awaited<ReturnType<typeof _getDevInfo>>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  tokenId: {
    type: String,
    default: ''
  },
  info: {
    type: Object as PropType<DevInfo | null>,
    default: () => (null),
  }
})

const Com = computed(() => {
  return Content
})

</script>

<style>

</style>
