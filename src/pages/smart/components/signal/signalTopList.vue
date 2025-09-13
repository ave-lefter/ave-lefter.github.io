<script setup lang="ts">
import type { ITopSignal } from '~/api/signal'
const globalStore = useGlobalStore()

defineProps<{
  dialogValues: {
    visible: boolean
    loading: boolean
    list: ITopSignal[]
  }
}>()
const scrollRef = useTemplateRef('scrollRef')
defineExpose({
  setScrollTop(scrollTop: number){
    if(scrollRef.value){
      scrollRef.value.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }
})
const flexColumns = [
  'flex-1',
  'w-64px text-right',
  'w-72px text-right',
  'w-60px text-right',
]
const emit = defineEmits(['close'])
const scrollHeight = computed(()=>{
  return globalStore.tokenHistoryVisible ? 'calc(100vh - 335px)':'calc(100vh - 302px)'
})
</script>
<template>
  <div v-show="dialogValues.visible" class="w-360px p-12px bg-[--secondary-bg]">
    <div
      class="flex justify-between items-center text-14px lh-16px pb-16px border-b-1px border-b-solid border-b-[--d-1A1A1A-l-F2F2F2] mb-9px"
    >
      {{ $t('SignalTopList') }}
      <Icon name="material-symbols:close" class="cursor-pointer" @click="emit('close')" />
    </div>
    <div class="flex items-center text-12px lh-16px color-[--d-666-l-999] mb-8px">
      <span :class="flexColumns[0]">
        {{ $t('token') }}
      </span>
      <span :class="flexColumns[1]">
        {{ $t('firstSignal2') }}
      </span>
      <span :class="flexColumns[2]">
        {{ $t('firstMarketCap2') }}
      </span>
      <span :class="flexColumns[3]">
        {{ $t('MaximumIncrease2') }}
      </span>
    </div>
    <el-scrollbar ref="scrollRef" :height="scrollHeight" class="mx--12px px-12px">
      <div
        v-for="(row, $index) in dialogValues.list"
        :key="row.token"
        class="flex items-center h-32px mb-4px"
      >
        <div class="flex items-center" :class="flexColumns[0]">
          <div class="text-center mr-13px" :style="{ width: getTextWidth($t('token')) + 'px' }">
            <img v-if="$index + 1 === 1" src="@/assets/images/111.svg" >
            <img v-else-if="$index + 1 === 2" src="@/assets/images/222.svg" >
            <img v-else-if="$index + 1 === 3" src="@/assets/images/333.svg" >
            <div v-else class="text-12px color-[--d-666-l-999]">{{ $index + 1 }}</div>
          </div>
          <div
            class="flex items-center text-12px gap-8px cursor-pointer"
            @click="navigateTo(`/token/${row.token}-${row.chain}`)"
          >
            <TokenImg
              chain-class="hidden"
              :row="{
                chain: row.chain,
                symbol: row.symbol,
                logo_url: row.logo_url,
              }"
            />
            <span class="shrink-0 truncate max-w-68px">{{ row.symbol }}</span>
          </div>
        </div>
        <div class="color-[--d-999-l-666] text-12px" :class="flexColumns[1]">
          <span v-tooltip="formatDate(row.first_signal_time, 'MM/DD HH:mm:ss')">{{
            formatDate(row.first_signal_time, 'HH:mm:ss')
          }}</span>
        </div>
        <div class="color-[--d-999-l-666] text-12px" :class="flexColumns[2]">
          ${{ formatNumber(row.first_signal_mc, 2) }}
        </div>
        <div class="color-#12B886 text-16px" :class="flexColumns[3]">
          {{ parseInt(row.max_price_change) }}x
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
