<template>
  <div class="bg-[--main-input-button-bg] w-420px">
    <component :is="Com" :tokenId="data.tokenId" :loading="data.loading" :tableList="data.tableList" :onFetch="props.onFetch" :type="type" :ratio="totalRatio"/>
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
import Kol from './kol.vue'
import type { _getHolderRank, HolderRankItem } from '~/api/pump'
import type { ShallowRef } from 'vue'
const props = defineProps<{
  data: ShallowRef<{
    tokenId: string
    loading: boolean
    tableList: HolderRankItem[],
    total_balance_ratio: number
  }>
  type: number,
   ratio: number,
  onFetch: (tokenId: string, tagType?: number) => void
}>()
const data = computed(() => props.data.value)
const totalRatio = computed(() => {
  return props.ratio || Number(data.value.total_balance_ratio)
} )
const Com = computed(() => {
  // if(props.type === 25 || props.type === 31 || props.type === 30) {
  //   return Kol
  // } else {
    return Content
  // }
})


</script>

<style>

</style>
