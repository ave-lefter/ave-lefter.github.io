<template>
  <div class="bg-[--main-input-button-bg]" :class="type===19 ? 'w-420px' : 'w-200px'">
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
import Sniper from './sniper.vue'
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
  if(props.type === 25 || props.type === 31) {
    return Kol
  } else {
    return Sniper
  }
})


</script>

<style>

</style>
