<template>
  <div class="w-200px bg-[--main-input-button-bg]">
    <component :is="Content" :info="info" :loading="loading" />
    <el-skeleton v-if="loading" :rows="5" animated style="--el-skeleton-circle-size: 32px">
      <template #template>
        <div class="p-10px">
          <el-skeleton-item variant="p" style="width: 100%" />
          <el-skeleton-item variant="p" style="width: 100%" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang='ts'>
import Content from './content.vue'
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
</script>

<style>

</style>
