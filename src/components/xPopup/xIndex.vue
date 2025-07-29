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
import XAccout from './xAccout.vue'
import Community from './community.vue'
import Tweet from './tweet.vue'
import type { XType1, XType2, XType3 } from '~/api/x'

type T = 1 | 2 | 3
type P = T extends 1 ? XType1 : T extends 2 ? XType2 : XType3
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: Number as PropType<T>,
    default: 1
  },
  info: {
    type: Object as PropType<P | null>,
    default: () => (null),
  }
})

const Com = computed(() => {
  switch (props.type) {
    case 1:
      return Tweet
    case 2:
      return XAccout
    case 3:
      return Community
    default:
      return XAccout
  }
})
</script>

<style>

</style>
