<script setup lang="ts">
import type { ITopSignal } from '~/api/signal'
const globalStore = useGlobalStore()
const { t } = useI18n()

const remarksStore = useRemarksStore()
const props = defineProps<{
  dialogValues: {
    visible: boolean
    loading: boolean
    type: 'topList' | 'activeList'
    pageNO: number
    pageSize: number
    topList: ITopSignal[]
    activeList: {
      user_address: string
      pnl: number
      rank: number
      win_rate: string
      wallet_logo: string
    }[]
    has_more: boolean
    tag: number[]
  }
  activeChain: string
}>()
const scrollRef = useTemplateRef('scrollRef')
const tag = defineModel<number[]>('tag')
const checkBoxList = ref([
  { label: 30, text: t('smarter') },
  { label: 31, text: 'KOL' },
  { label: 39, text: t('whale') },
])
defineExpose({
  setScrollTop(scrollTop: number) {
    if (scrollRef.value) {
      scrollRef.value.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    }
  },
})
const flexColumns = ['flex-1', 'w-64px text-right', 'w-72px text-right', 'w-60px text-right']
const activeColumns = ['flex-1', 'w-80px text-right', 'flex-1 text-right']
const emit = defineEmits(['close', 'loadMore'])
const elseHeight = computed(() => {
  let substractHeight = 302
  const tokenHisHeight = 33
  const activeCheckHeight = 32
  if (globalStore.tokenHistoryVisible) {
    substractHeight += tokenHisHeight
  }
  if (props.dialogValues.type === 'activeList') {
    substractHeight += activeCheckHeight
  }
  return substractHeight
})
</script>
<template>
  <div
    v-show="dialogValues.visible && dialogValues.type === 'topList'"
    class="w-360px p-12px bg-[--secondary-bg]"
  >
    <div
      class="flex justify-between items-center text-14px lh-16px pb-16px border-b-1px border-b-solid border-b-[--main-divider] mb-9px"
    >
      {{ $t('SignalTopList') }}
      <Icon name="material-symbols:close" class="cursor-pointer" @click="emit('close')" />
    </div>
    <div class="flex items-center text-12px lh-16px color-[--third-text] mb-8px">
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
    <el-scrollbar
      ref="scrollRef"
      :height="`calc(100vh - ${elseHeight}px)`"
      class="mx--12px px-12px"
    >
      <div
        v-for="(row, $index) in dialogValues.topList"
        :key="row.token"
        class="flex items-center h-32px mb-4px"
      >
        <div class="flex items-center" :class="flexColumns[0]">
          <div class="text-center mr-13px" :style="{ width: getTextWidth($t('token')) + 'px' }">
            <img v-if="$index + 1 === 1" src="@/assets/images/111.svg" />
            <img v-else-if="$index + 1 === 2" src="@/assets/images/222.svg" />
            <img v-else-if="$index + 1 === 3" src="@/assets/images/333.svg" />
            <div v-else class="text-12px color-[--third-text]">{{ $index + 1 }}</div>
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
        <div class="color-[--third-text] text-12px" :class="flexColumns[1]">
          <span v-tooltip="formatDate(row.first_signal_time, 'MM/DD HH:mm:ss')">{{
            formatDate(row.first_signal_time, 'HH:mm:ss')
          }}</span>
        </div>
        <div class="color-[--secondary-text] text-12px" :class="flexColumns[2]">
          ${{ formatNumber(row.first_signal_mc, 2) }}
        </div>
        <div class="color-#12B886 text-16px" :class="flexColumns[3]">
          {{ parseInt(row.max_price_change) }}x
        </div>
      </div>
    </el-scrollbar>
  </div>
  <div
    v-show="dialogValues.visible && dialogValues.type === 'activeList'"
    class="w-360px p-12px bg-[--secondary-bg]"
  >
    <div
      class="flex justify-between items-center text-14px lh-16px pb-16px border-b-1px border-b-solid border-b-[--main-divider] mb-12px"
    >
      {{ $t('top24hAddress') }}
      <Icon name="material-symbols:close" class="cursor-pointer" @click="emit('close')" />
    </div>
    <ElCheckboxGroup v-model="tag" class="flex justify-center mb-16px">
      <ElCheckbox
        v-for="item in checkBoxList"
        :key="item.label"
        :label="item.label"
        :disabled="tag?.length === 1 && tag?.includes?.(item.label)"
        class="[&&]:[--el-checkbox-font-size:12px] [--el-checkbox-height:15px]"
        >{{ item.text }}</ElCheckbox
      >
    </ElCheckboxGroup>
    <div class="flex items-center text-12px lh-16px color-[--third-text] mb-8px">
      <span :class="activeColumns[0]">
        {{ $t('name') }}
      </span>
      <span :class="activeColumns[1]">
        {{ $t('7DayProfitLoss') }}
      </span>
      <span :class="activeColumns[2]">
        {{ $t('winRate2') }}
      </span>
    </div>
    <el-scrollbar
      ref="scrollRef"
      :height="`calc(100vh - ${elseHeight}px)`"
      class="mx--12px px-12px"
    >
      <div
        v-for="row in dialogValues.activeList"
        :key="row.user_address"
        class="flex items-center h-32px mb-4px"
      >
        <div
          class="flex items-center text-12px gap-8px cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
          :class="activeColumns[0]"
          @click="navigateTo(`/address/${row.user_address}/${props.activeChain}`)"
        >
          <UserAvatar
            iconSize="24px"
            :address="row.user_address"
            :chain="props.activeChain"
            :wallet_logo="{
              logo: row.wallet_logo,
            }"
          />
          <span
            v-if="
              remarksStore.getRemarkByAddress({
                address: row.user_address,
                chain: props.activeChain,
              })
            "
            v-tooltip="
              remarksStore.getRemarkByAddress({
                address: row.user_address,
                chain: props.activeChain,
              })
            "
            class="whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {{
              remarksStore.getRemarkByAddress({
                address: row.user_address,
                chain: props.activeChain,
              })
            }}
          </span>
          <template v-else>
            {{ row.user_address.slice(0, 4) }}...{{ row.user_address.slice(-4) }}
          </template>
        </div>
        <div class="text-12px" :class="[activeColumns[1], getColorClass(row.pnl)]">
          {{ addSign(row.pnl) }}${{ formatNumber(Math.abs(row.pnl), 2) }}
        </div>
        <div
          class="color-[--secondary-text] text-12px color-[--up-color]"
          :class="activeColumns[2]"
        >
          {{ formatNumber(row.win_rate * 100, 1) }}%
        </div>
      </div>
      <template v-if="!dialogValues.loading && dialogValues.activeList.length === 0">
        <AveEmpty class="mt-20px">
          <span class="text-12px color-[--third-text]">{{ $t('noActiveWallet') }}</span>
        </AveEmpty>
      </template>
      <div
        v-if="dialogValues.loading"
        class="flex py-10px justify-center text-12px text-[--third-text]"
      >
        {{ $t('loading') }}
      </div>
    </el-scrollbar>
  </div>
</template>
