<template>
  <div class="bg-[--d-101114-l-F6F9FF] h-64px flex-start items-center justify-start py-7px px-12px">
    <el-popover
      v-model:visible="visible"
      popper-class="[--el-popover-bg-color:--border]"
      :width="750"
      placement="bottom-start"
      trigger="click"
      popper-style="padding: 0px"
    >
      <template #reference>
        <div
          class="flex items-center px-4px py-4px cursor-pointer rounded-4px hover:bg-[--d-1B1D21-l-E8F1FF] cursor-pointer"
        >
          <el-image class="token-icon w-32px max-h-32px" fit="cover" :src="perp?.baseCoinIcon">
            <template #error>
              <img class="token-icon w-32px max-h-32px" :src="getChainDefaultIcon()" >
            </template>
            <template #placeholder>
              <img class="token-icon w-32px max-h-32px" :src="getChainDefaultIcon()" >
            </template>
          </el-image>
          <div class="ml-8px">
            <span class="color-[--main-text] text-18px font-500 block">{{
              perp?.contractName
            }}</span>
            <span class="color-[--third-text] text-12px mt-2px">{{ $t('perpetual') }}</span>
          </div>
          <Icon
            :name="visible ? 'radix-icons:triangle-up' : 'radix-icons:triangle-down'"
            class="text-18px color-[--main-text] ml-12px"
          />
        </div>
      </template>
      <template #default>
        <Search :loading="loadingPerpMetadata" @close="visible = false"/>
      </template>
    </el-popover>

    <div class="ml-16px">
      <span
        class="text-20px font-700 block min-w-100px text-left"
        :class="Number(perp?.priceChange) > 0 ? 'color-[--up-color]' : 'color-[--down-color]'"
        >{{ formatNumber(perp?.lastPrice || 0, 10) }}</span
      >
      <!-- <span
        class="text-12px block text-left mt-2px"
        :class="Number(perp?.priceChange) > 0 ? 'color-[--up-color]' : 'color-[--down-color]'"
        >{{ formatNumber(perp?.priceChange || 0) }}&nbsp;&nbsp;{{
          formatNumber(Number(perp?.priceChangePercent) * 100 || 0)
        }}%</span
      > -->
    </div>
    <div class="w-0 border-l-[--icon-color] border-l-solid h-28px"/>
    <Swipe>
      <div class="ml-16px whitespace-nowrap item">
        <span v-tooltip="$t('indexPriceTooltip')" class="text-12px block text-left color-[--third-text] border-b-dashed border-b-1px border-[--third-text]">{{ $t('indexPrice') }}</span>
        <span class="text-12px block text-left color-[--main-text] leading-16px mt-6px">
          {{ formatNumber(perp?.indexPrice || 0, getPricePrecision(perp?.contractId || '')) }}</span
        >
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span v-tooltip="$t('oraclePriceTooltip')" class="text-12px block text-left color-[--third-text] border-b-dashed border-b-1px border-[--third-text]">{{ $t('oraclePrice') }}</span>
        <span class="text-12px block text-left color-[--main-text] mt-6px">{{formatNumber(perp?.oraclePrice || 0, getPricePrecision(perp?.contractId || ''))}}</span>
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]">{{ $t('24HChange') }}</span>
        <span
          class="text-12px block text-left mt-6px"
          :class="Number(perp?.priceChange) > 0 ? 'color-[--up-color]' : 'color-[--down-color]'"
          >{{ Number(perp?.priceChange || 0) > 0 ? '+' : '' }}{{ formatNumber(perp?.priceChange || 0) }} ({{ Number(perp?.priceChangePercent || 0) > 0 ? '+' : '' }}{{
            formatNumber(Number(perp?.priceChangePercent) * 100 || 0, 2)
          }}%)</span
        >
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]">{{ $t('24HHighPrice') }}</span>
        <span class="text-12px block text-left color-[--secondary-text] mt-6px">{{
          formatNumber(perp?.high || 0)
        }}</span>
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]">{{ $t('24HLowestPrice') }}</span>
        <span class="text-12px block text-left color-[--secondary-text] mt-6px">{{
          formatNumber(perp?.low || 0)
        }}</span>
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]"
          >{{ $t('24HVolume') }}({{ perp?.quoteCoin }})</span
        >
        <span class="text-12px block text-left color-[--secondary-text] mt-6px">{{
          formatNumber(perp?.value || 0, {
            limit: 11,
            decimals: 2
          })
        }}</span>
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]"
          >{{ $t('24HAmount') }}({{ perp?.baseCoin }})</span
        >
        <span class="text-12px block text-left color-[--secondary-text] mt-6px">{{
          formatNumber(perp?.size || 0)
        }}</span>
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]"
          >{{ $t('openInterest') }}({{ perp?.quoteCoin }})</span
        >
        <span class="text-12px block text-left color-[--main-text] mt-6px">{{
          openInterestValue
        }}</span>
      </div>

      <div class="ml-16px whitespace-nowrap item">
        <span class="text-12px block text-left color-[--third-text]">{{ $t('fundingRate') }}&nbsp;/&nbsp;{{ $t('countdown') }}</span>
        <span class="text-12px block text-left color-[--main-text] mt-6px"
          >
          <span :class="Number(perp?.fundingRate) > 0 ? 'color-[--up-color]' : 'color-[--down-color]'">
            {{ addSign(Number(perp?.fundingRate) * 100 || 0) }}{{ formatNumber(Number(perp?.fundingRate) * 100 || 0) }}%
          </span>
          <span class="text-12px color-[--third-text]">&nbsp;/&nbsp;</span>
          <TimerCount
            v-if="perp?.nextFundingTime"
            :key="`${perp?.nextFundingTime}`"
            :timestamp="Number(perp?.nextFundingTime)/1000"
            :end-time="Date.now()"
          >
            <template #default="{ formattedData: { days, hours, minutes, seconds } }">
              <span class="color-#FFA622">
                {{ hours || '00' }}:{{ minutes || '00' }}:{{ seconds  || '00'}}
              </span>
            </template>
          </TimerCount>
        </span>
      </div>
    </Swipe>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed } from 'vue'
import Swipe from './swipe.vue'
import { usePerpWsPubStore } from '@/stores/perp/wsPub'
// import type { PerpInfo } from '@/api/types/perp'
import { usePerpStore } from '@/stores/perp'
import { WSPerpEventType } from '@/utils/constants'
import type { TickerEntry } from '~/utils/perp/types'
import BigNumber from 'bignumber.js'

const Search = defineAsyncComponent(() => import('./search.vue'))
const { metadata, loadingPerpMetadata, contractList, perp, tickers } = storeToRefs(usePerpStore())
const perpWsPubStore = usePerpWsPubStore()
const visible = shallowRef(false)

const openInterestValue = computed(() => {
  if (!perp.value?.openInterest || !perp.value?.indexPrice) {
    return 0
  }
  const value = BigNumber(perp.value.openInterest).times(perp.value.indexPrice)
  return formatNumber(value.toFixed(), {
    limit: 11,
    decimals: 2
  })
})

watch(
  () => perpWsPubStore.wsResult[WSPerpEventType.TICKER_ALL_1S],
  (val) => {
    if (!val.data) return
    if (val.dataType === 'Snapshot' && WSPerpEventType.TICKER_ALL_1S == val.channel) {
      tickers.value = val.data
      if (metadata.value && metadata.value?.contractList?.length > 0) {
        const tickerMap = new Map(val.data.map((y: any) => [y.contractId, y]))
        contractList.value =
          metadata.value?.contractList?.map((i) => {
            const item = tickerMap.get(i.contractId)
            return item ? { ...i, ...item } : i
          })
      } else {
        contractList.value = val.data
      }
    } else if (val.dataType === 'changed' && WSPerpEventType.TICKER_ALL_1S == val.channel) {
      const updates = new Map(val.data.map((item: TickerEntry) => [item.contractId, item]))

      contractList.value.forEach(item => {
        if (updates.has(item.contractId)) {
          Object.assign(item, updates.get(item.contractId))
        }
      })

      tickers.value.forEach(item => {
        if (updates.has(item.contractId)) {
          Object.assign(item, updates.get(item.contractId))
        }
      })
    }
  }
)

watch(visible, (val) => {
  if (val) {
    if ( document.getElementById('tv_chart_container')) {
      document.getElementById('tv_chart_container')!.style.pointerEvents = 'none'
    }
  } else {
    if ( document.getElementById('tv_chart_container')) {
      document.getElementById('tv_chart_container')!.style.pointerEvents = 'auto'
    }
  }
})

onMounted(() => {
  perpWsPubStore.send({
    type: 'unsubscribe',
    channel: 'ticker.all.1s',
  })
  setTimeout(() => {
    perpWsPubStore.send({
      type: 'subscribe',
      channel: 'ticker.all.1s',
    })
  }, 500)
})
</script>

<style lang="scss" scoped>

</style>
