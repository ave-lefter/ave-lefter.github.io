<script setup lang="ts">
import { useElementSize, useStorage } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import type { ElScrollbar } from 'element-plus'
import type { IPriceV2Response } from '~/api/types/ws'

const wsStore = useWSStore()
const globalStore = useGlobalStore()
const activeTab = useStorage('topColTab',1)
const scrollbar = useTemplateRef<InstanceType<typeof ElScrollbar>>('scrollbar')
const scrollbarLeft = ref(0)
const scrollContent = useTemplateRef<HTMLElement>('scrollContent')
const {width:scrollContentWidth} = useElementSize(scrollContent)

const arrowVisible = computed(()=>{
  const aWidth = Array.from(scrollContent.value?.children || []).reduce((acc,item)=>acc+item?.clientWidth,0)
  const gapWidth = (globalStore.lastVisitTokens.length - 1) * 18
  return scrollContentWidth.value < aWidth + gapWidth
})

function closeOtherPages() {
  globalStore.lastVisitTokens.length = 0
}

function scrollX(scrollValue:number) {
  if(scrollbar.value){
    scrollbar.value.setScrollLeft(scrollbarLeft.value + scrollValue)
  }
}

function onScroll({scrollLeft}:{ scrollLeft: number }) {
  scrollbarLeft.value = scrollLeft
}

function onDelete(id:string) {
  globalStore.lastVisitTokens = globalStore.lastVisitTokens.filter(item => item.id !== id)
}

watch(
  () => wsStore.wsResult[WSEventType.PRICEV2],
  (val: IPriceV2Response) => {
    globalStore.lastVisitTokens = globalStore.lastVisitTokens.map((i) => {
      const item = val.prices.find((j) => {
        return i.id === j.token +'-'+j.chain
      })
      if (item) {
        return {
          ...i,
          price: item.uprice,
          priceChange: Number(item.price_change),
        }
      }
      return i
    })
  }
)
</script>

<template>
  <div class="h-32px mt-1px bg-[--secondary-bg] flex items-center">
    <div class="px-16px flex items-center gap-8px text-[--icon-color]">
      <Icon :key="0" v-tooltip="$t('position')" name="custom:position" class="cursor-pointer" :class="activeTab===0?'text-[--secondary-text]':''" @click="activeTab=0"/>
      <Icon :key="1" v-tooltip="$t('history')" name="custom:history-fill" class="cursor-pointer" :class="activeTab===1?'text-[--secondary-text]':''" @click="activeTab=1"/>
    </div>
    <div v-if="arrowVisible" class="w-32px h-32px flex items-center justify-center cursor-pointer text-[--secondary-text] hover:text-[--main-text]" @click="scrollX(-200)">
      <Icon name="material-symbols:arrow-back-ios-new-rounded"/>
    </div>    
    <el-scrollbar ref="scrollbar" @scroll="onScroll">
      <div ref="scrollContent" class="flex items-center gap-18px whitespace-nowrap h-32px text-12px color-[--third-text]">
        <NuxtLink v-for="item in globalStore.lastVisitTokens" :key="item.id" class="flex items-center gap-4px hover:color-[--main-text]" :to="`/token/${item.id}`">
          <TokenImg :row="{logo_url:item.logo_url,symbol:item.symbol,chain:''}" :tokenClass="'w-16px h-16px'"/>
          {{ item.symbol }}
          ${{ formatNumber(new BigNumber(item.price).times(new BigNumber(item.circulation)).toFixed(),2) }}
          <span :class="getColorClass(Number(item.priceChange))">{{item.priceChange>0?'+':''}}{{ formatNumber(Number(item.priceChange),2) }}%</span>
          <Icon name="custom:delete" class="cursor-pointer" @click.self.stop.prevent="onDelete(item.id)"/>
        </NuxtLink>
      </div>
    </el-scrollbar>
    <div v-if="arrowVisible" class="w-32px h-32px flex items-center justify-center cursor-pointer text-[--secondary-text] hover:text-[--main-text]" @click="scrollX(200)">
      <Icon name="material-symbols:arrow-forward-ios"/>
    </div>
    <div
v-if="globalStore.lastVisitTokens.length >= 1"
class="p-8px h-32px flex items-center color-[--secondary-text] hover:color-[--main-text] gap-4px whitespace-nowrap text-12px cursor-pointer"
    @click="closeOtherPages"
    >
      <Icon name="line-md:close"/>
      {{ $t('closeOtherPages') }}
    </div>
  </div>
</template>

<style scoped lang="scss"></style>