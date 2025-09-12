<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const globalStore = useGlobalStore()
const activeTab = useStorage('topColTab',1)
</script>

<template>
  <div class="h-32px mt-1px bg-[--secondary-bg] flex items-center">
    <div class="px-16px flex items-center gap-8px text-[--icon-color]">
      <Icon :key="0" v-tooltip="$t('position')" name="custom:position" class="cursor-pointer" :class="activeTab===0?'text-[--secondary-text]':''" @click="activeTab=0"/>
      <Icon :key="1" v-tooltip="$t('history')" name="custom:history-fill" class="cursor-pointer" :class="activeTab===1?'text-[--secondary-text]':''" @click="activeTab=1"/>
    </div>
    <div class="w-32px h-32px flex items-center justify-center cursor-pointer text-[--secondary-text]">
      <Icon name="material-symbols:arrow-back-ios-new-rounded"/>
    </div>    
    <el-scrollbar>
      <div class="flex items-center gap-8px whitespace-nowrap h-full">
        <NuxtLink v-for="item in globalStore.lastVisitTokens" :key="item.id" class="flex items-center gap-4.5px" :to="`/token/${item.id}`">
          <TokenImg :row="{logo_url:item.logo_url,symbol:item.symbol,chain:''}" :tokenClass="'w-16px h-16px'"/>
          {{ item.symbol }}
          ${{ formatNumber(item.marketCap,2) }}
          {{addSign(Number(item.priceChange))}}{{ formatNumber(Number(item.priceChange),2) }}%
        </NuxtLink>
      </div>
    </el-scrollbar>
    <div class="w-32px h-32px flex items-center justify-center cursor-pointer text-[--secondary-text]">
      <Icon name="material-symbols:arrow-forward-ios"/>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>