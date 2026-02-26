<template>
  <div class="bg-[--main-input-button-bg]" :class="type==='rank' ? 'w-382px' : 'w-200px'">
    <component :is="Com" :tokenId="data.tokenId" :loading="data.loading" :tableList="data.tableList" :onFetch="props.onFetch" :type="type" :ratio="ratio"/>
    <!-- <el-skeleton v-if="data.loading && type !=='rank'" :rows="5" animated style="--el-skeleton-circle-size: 32px;padding: 12px" >
      <template #template>
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
        <el-skeleton-item variant="p" style="width: 100%" />
      </template>
    </el-skeleton> -->
  </div>
</template>

<script setup lang='ts'>
import Content from './content.vue'
import KolSmart from './kolSmart.vue'
import type { _getHolderRank, HolderRankItem } from '~/api/pump'
import type { ShallowRef } from 'vue'
const props = defineProps<{
  data: ShallowRef<{
    tokenId: string
    loading: boolean
    tableList: HolderRankItem[]
  }>
  type: String,
   ratio: String,
  onFetch: (tokenId: string, tagType?: number) => void
}>()
const data = computed(() => props.data.value)
const Com = computed(() => {
  if(props.type === 'kol' || props.type === 'smart') {
    return KolSmart
  } else {
    return Content
  }
})


</script>

<style>

</style>
