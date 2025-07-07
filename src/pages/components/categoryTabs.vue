<script setup lang="ts">
import {useStorage} from '@vueuse/core'
import ColumnsToolbar from './columnsToolbar.vue'

const rankCommonConditions = useStorage('rankCommon', {
  activeInterval: '1m',
  quickVisible: true
})
const {t} = useI18n()
const intervals = computed(() => {
  return [
    {name: '1m', id: '1m'},
    {name: '5m', id: '5m'},
    {name: '15m', id: '15m'},
    {name: '1H', id: '1H'},
    {name: '4H', id: '4H'},
    {name: '24H', id: '24H'},
  ]
})
const tabs = computed(() => {
  return [
    {name: t('trending'), component: 'HotRank' as const, icon: 'custom:hot'}
  ]
})
</script>

<template>
  <div class="flex flex-1 justify-between">
    <div class="flex gap-2 text-12px">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        class="p-2 lh-16px color-#F5F5F5 bg-#333 cursor-pointer rounded-1"
      >
        <Icon :name="item.icon" class="mr-1 color-#FFA622"/>
        {{ item.name }}
      </span>
    </div>
    <div class="flex gap-12px items-center text-12px">
      <div class="p-1 rounded-1 bg-[--d-222-l-F2F2F2]">
        <button
            v-for="(item, index) in intervals" :key="index"
            class="lh-16px py-2px px-8px color-[--d-F5F5F5-l-333] border-none cursor-pointer rounded-2px"
            :class="rankCommonConditions.activeInterval === item.id?'bg-[--d-111-l-FFF]':'bg-transparent'"
            @click.stop="rankCommonConditions.activeInterval = item.id"
        >
          {{ item.name }}
        </button>
      </div>
      <div class="flex items-center">
        <el-switch v-model="rankCommonConditions.quickVisible" class="mr-2"/>
        <QuickSwapSet
          v-if="rankCommonConditions.quickVisible"
            :settingsButtonVisible="false"
            :chain="'solana'"
        />
        <ColumnsToolbar :activeCategory="'hot'" class="ml-2"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
