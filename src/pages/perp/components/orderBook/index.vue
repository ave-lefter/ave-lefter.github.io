<template>
  <div
    class="bg-[--secondary-bg] relative rounded-2px text-14px pt-12px flex flex-col overflow-hidden"
    :style="{ height: `${klineHeight || 200}px` }"
  >
    <div class="mx-12px pb-12px flex">
      <div
        ref="tabsContainer"
        class="flex-1 flex items-center gap-x-8px whitespace-nowrap overflow-x-auto scrollbar-hide"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.value"
          :style="{
            backgroundColor:
              activeTab === tab.value ? 'rgba(63, 128, 247, 0.10)' : 'var(--d-16181D-l-ECF3FF)',
          }"
          :class="[
            'shrink-0 text-12px px-8px py-4px rounded-4px border-none cursor-pointer',
            activeTab === tab.value
              ? 'color-[--primary-color]'
              : 'bg-[--d-16181D-l-ECF3FF] color-[--d-5A5E64-l-A9B0BC]',
          ]"
          @click="setActiveTab(tab.value, index)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <template v-if="activeTab === 'orderbook'">
      <div class="mx-12px pb-12px flex">
        <div
          ref="tabsContainer"
          class="flex-1 flex items-center gap-x-8px whitespace-nowrap overflow-x-auto scrollbar-hide"
        >
          <button
            v-for="(tab, index) in tabsLayout"
            :key="tab.value"
            :style="{
              backgroundColor:
                activeLayoutTab === tab.value ? 'var(--d-383F4B-l-CAD6EC)' : 'transparent',
            }"
            :class="[
              'shrink-0 px-2px py-2px rounded-1px border-none cursor-pointer text-16px leading-none h-16px w-16px flex items-center',
            ]"
            v-tooltip="tab.label"
            @click="activeLayoutTab = tab.value"
          >
            <Icon
              v-if="tab.value == 'all'"
              mode="svg"
              name="custom:perp-all"
              :style="
                activeLayoutTab === tab.value
                  ? { '--rect2': '#F6465D', '--rect3': '#12B886' }
                  : { '--rect2': '#71486d', '--rect3': '#2fa89a' }
              "
            />
            <Icon
              v-if="tab.value == 'buy'"
              mode="svg"
              name="custom:perp-buy"
              :style="
                activeLayoutTab === tab.value ? { '--rect2': '#12B886' } : { '--rect2': '#345e74' }
              "
            />
            <Icon
              v-if="tab.value == 'sell'"
              mode="svg"
              name="custom:perp-sell"
              :style="
                activeLayoutTab === tab.value ? { '--rect2': '#F6465D' } : { '--rect2': '#71486d' }
              "
            />
          </button>
        </div>
        <div class="flex-1"></div>
        <el-popover
          v-if="unitList?.length >= 0"
          popper-class="[--el-popover-bg-color:--border]"
          placement="bottom-end"
          trigger="click"
          :visible="showUnitPop"
        >
          <template #reference>
            <div
              class="flex-start items-center cursor-pointer text-12px bg-[--main-input-button-bg] px-4px py-4px"
              @click.stop="showUnitPop = !showUnitPop"
            >
              {{ unit?.coinName }}
              <Icon
                :name="!showUnitPop ? 'radix-icons:triangle-down' : 'radix-icons:triangle-up'"
                class="text-16px color-[--main-text]"
              />
            </div>
          </template>
          <template #default>
            <div class="py-4px [&&]:m--12px flex flex-col">
              <div
                v-for="(item, $index) in unitList"
                :key="$index"
                class="flex-start items-center text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-list-hover] cursor-pointer"
                @click.stop="switchUnit(item)"
              >
                <span class="ml-4px mr-4px">{{ item?.coinName }}</span>
              </div>
            </div>
          </template>
        </el-popover>
        <el-popover
          v-if="stepSizeList?.length > 0"
          popper-class="[--el-popover-bg-color:--border]"
          placement="bottom-end"
          trigger="click"
          :visible="showStepPop"
        >
          <template #reference>
            <div
              class="flex-start items-center cursor-pointer text-12px bg-[--main-input-button-bg] px-4px py-4px ml-4px"
              @click.stop="showStepPop = !showStepPop"
            >
              {{ step }}
              <Icon
                :name="!showStepPop ? 'radix-icons:triangle-down' : 'radix-icons:triangle-up'"
                class="text-16px color-[--main-text]"
              />
            </div>
          </template>
          <template #default>
            <div class="py-4px [&&]:m--12px flex flex-col">
              <div
                v-for="(item, $index) in stepSizeList"
                :key="$index"
                class="flex-start items-center text-12px py-4px px-8px color-[--main-text] hover:bg-[--dialog-list-hover] cursor-pointer"
                @click.stop="switchStep(item)"
              >
                <span class="ml-4px mr-4px">{{ item }}</span>
              </div>
            </div>
          </template>
        </el-popover>
      </div>
      <div class="px-12px">
        <div class="text-12px">
          <!-- 表格头部 -->
          <div
            class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-15px mt-8px mb-4px text-12px color-[--d-5A5E64-l-A9B0BC] mb-8px"
          >
            <div class="min-w-0 text-left">{{ $t('price') }}({{ quote?.coinName }})</div>
            <div class="text-right text-nowrap min-w-0">
              <div class="flex items-center justify-end gap-2px">
                <span>{{ $t('amount') }}({{ unit?.coinName }})</span>
              </div>
            </div>
            <div class="text-right text-nowrap min-w-0">
              <div class="flex items-center justify-end gap-2px">
                <span>{{ $t('total') }}({{ unit?.coinName }})</span>
              </div>
            </div>
          </div>
          <List
            v-if="activeLayoutTab == 'all' || activeLayoutTab == 'sell'"
            :list="sellList?.slice(0,num)"
            type="sell"
            :height="height"
            :unit="unit"
          />
          <div class="mt-16px mb-16px flex items-center">
            <span
              class="text-20px font-700 block text-left"
              :class="Number(perp?.priceChange) > 0 ? 'color-[--up-color]' : 'color-[--down-color]'"
              >{{ formatNumber(perp?.lastPrice || 0) }}</span
            >
            <Icon
              class="text-16px"
              :class="Number(perp?.priceChange) > 0 ? 'color-[--up-color]' : 'color-[--down-color]'"
              :name="`custom:${Number(perp?.priceChange) > 0 ? 'arrow-up' : 'arrow-down'}`"
            />
            <div class="flex-1"></div>
            <div class="flex-end border-b-dashed border-b-1px border-[--third-text]" v-tooltip="$t('oraclePriceTooltip')">
              <Icon class="text-14px color-[--third-text]" name="custom:perp-flag" />
              <span class="text-12px color-[--third-text] ml-4px">
                {{ formatNumber(perp?.oraclePrice || 0) }}</span
              >
            </div>
          </div>
          <List
            v-if="activeLayoutTab == 'all' || activeLayoutTab == 'buy'"
            :list="buyList?.slice(0,num)"
            type="buy"
            :height="height"
            :unit="unit"
          />
        </div>
      </div>
      <div
        class="range-container z-10 absolute bottom-0 py-16px px-10px w-100% flex items-center justify-center bg-[--main-input-button-bg] color-[#FFA622]"
      >
        <span class="text-10px color-[--up-color]">{{ $t('buy1') }}</span>
        <div class="range ml-4px mr-4px">
          <span class="left" :style="{ width: formatNumber(progress || 0, 1) + '%' }">
            {{ formatNumber(progress, 1) }}%
          </span>
          <span class="right" :style="{ width: formatNumber(100 - progress || 0, 1) + '%' }">
            {{ formatNumber(100 - progress, 1) }}%
          </span>
        </div>
        <span class="text-10px color-[--down-color]">{{ $t('sell1') }}</span>
      </div>
    </template>
     <div v-else class="mx-12px pb-12px">
      <div
        class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-15px mt-8px mb-4px text-12px color-[--d-5A5E64-l-A9B0BC]"
      >
        <div class="min-w-0 text-left">{{ $t('price') }}({{ quote?.coinName }})</div>
        <div class="text-right text-nowrap min-w-0">
          <div class="flex items-center justify-end gap-2px">
            <span>{{ $t('amount') }}({{ base?.coinName }})</span>
          </div>
        </div>
        <div class="text-right text-nowrap min-w-0">
          <div class="flex items-center justify-end gap-2px">
            <span>{{ $t('time') }}</span>
          </div>
        </div>
      </div>
      <History :list="historyList" :height="height" />
     </div>
  </div>
</template>

<script setup lang="ts">
import { triggerRef } from 'vue'
import { type OrderBook } from '@/api/perp'
import { useRoute } from 'vue-router'
import { useThrottleFn } from '@vueuse/core'
import List from './list.vue'
import History from './history.vue'
import { usePerpWsPubStore } from '@/stores/perp/wsPub'
import { usePerpStore } from '@/stores/perp'
import { type Trade, type CoinInfo } from '@/api/types/perp'
const { contractId, perp, resolution, metadata, unit ,unitList, base, quote} = storeToRefs(usePerpStore())
const perpWsPubStore = usePerpWsPubStore()
import { DecimalExtensions } from "@/utils/decimalExtensions"
import BigNumber from "bignumber.js"

const props = defineProps<{
  klineHeight?: number
}>()

const { t } = useI18n()
const route = useRoute()
const buyList = ref<OrderBook[]>([])
const sellList = ref<OrderBook[]>([])
const level = shallowRef(200)

const wsBuyCache = ref<OrderBook[]>([])
const wsSellCache = ref<OrderBook[]>([])
const showUnitPop = shallowRef(false)
const step = shallowRef(0)
const showStepPop = shallowRef(false)
const historyList = ref<Trade[]>([])
const wsHistoryCache = ref<Trade[]>([])


// 状态管理
const tabsContainer = ref<HTMLElement | null>(null)
const activeTab = shallowRef('orderbook')
const activeLayoutTab = shallowRef('all')

// 表格视图状态
const tableView = ref({
  // isVolUSDT: true,
  isAmount: true,
})
const tabs = computed(() => {
  return [
    {
      label: t('orderBook'),
      value: 'orderbook',
    },
    {
      label: t('lastTx'),
      value: 'history',
    },
  ]
})
const tabsLayout = computed(() => {
  return [
    {
      label: t('orderBook'),
      value: 'all',
    },
    {
      label: t('buy'),
      value: 'buy',
    },
    {
      label: t('sell'),
      value: 'sell',
    },
  ]
})
const height = computed(() => {
  const h = props.klineHeight || 300
  if(activeTab.value === 'history') {
    return (h - 100)
  } else if (activeLayoutTab.value === 'all') {
    return (h - 100 - 55-60-5 ) / 2
  } else {
    return h - 200
  }
})



const stepSizeList = computed(() => {
  return perp.value?.displayDigitMerge?.split(',') || []
})
const num = computed(() => {
 return Math.floor(Number(height.value) / 24)
})
const maxBuySum = computed(() => {
  return Math.max(...buyList.value.map((i) => Number(i.sum)))
})
const maxSellSum = computed(() => {
  return Math.max(...sellList.value.map((i) => Number(i.sum)))
})
const progress = computed(() => {
  const totalBuySum = buyList.value.reduce((acc, item) => {
    return acc + Number(item.sum);
  }, 0)
  const totalSellSum: number = sellList.value.reduce((acc, item) => {
    return acc + Number(item.sum)
  }, 0)
  if (totalBuySum + totalSellSum > 0) {
    return Math.min((totalBuySum / (totalBuySum + totalSellSum)) * 100, 100)
  } else {
    return 0
  }
})

const windowWidth = ref(window.innerWidth)
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

watch(
  () => base.value,
  (val) => {
    if (val) {
      unit.value = val ?? null
      step.value = Number(stepSizeList.value[0] ?? 0)
    } else {
      unit.value = null
    }
  }
)

watch(
  () => resolution.value,
  (val) => {
    if (val && route.name == 'perp-id') {
      activeTab.value = 'orderbook'
      buyList.value = []
      sellList.value = []
      wsBuyCache.value = []
      wsSellCache.value = []
      if (activeTab.value === 'orderbook') {
        subscribeOrderbook()
      } else {
        subscribeHistory()
      }
    }
  }
)
watch(
  () => contractId.value,
  (val) => {
    if (val) {
      activeTab.value = 'orderbook'
      buyList.value = []
      sellList.value = []
      wsBuyCache.value = []
      wsSellCache.value = []
      if (activeTab.value === 'orderbook') {
        subscribeOrderbook()
      } else {
        subscribeHistory()
      }
    }
  }
)

watch(
  () => perpWsPubStore.wsResult[WSPerpEventType.DEPTH],
  (val) => {
    // console.log('-------val----', val)
    const result = val.data?.[0]
    const arr_buy = Array.isArray(result?.bids)
      ? result?.bids?.map((i) => ({ ...i, sum: i?.size || '0' }))
      : []
    const arr_sell = Array.isArray(result?.asks)
      ? result?.asks?.map((i) => ({ ...i, sum: i?.size || '0' }))
      : []
    if (
      (result?.bids?.length > 0 || result?.asks?.length > 0) &&
      `${WSPerpEventType.DEPTH}.${contractId.value}.${level.value}` == val.channel
    ) {
      if (val.dataType === 'Snapshot') {
        buyList.value = arr_buy
        sellList.value = arr_sell
      } else if (val.dataType === 'changed') {
        if (arr_buy?.length > 0) {
          wsBuyCache.value = wsBuyCache.value?.concat(arr_buy)
        }
        if (arr_sell?.length > 0) {
          wsSellCache.value = wsSellCache.value?.concat(arr_sell)
        }
        updateViews()
      }
    }
  }
)
watch(
  () => perpWsPubStore.wsResult[WSPerpEventType.TRADES],
  (val) => {
    const result = Array.isArray(val.data)? val.data: []
    if (
      (result?.length > 0) &&
      `${WSPerpEventType.TRADES}.${contractId.value}` == val.channel
    ) {
      if (val.dataType === 'Snapshot') {
        historyList.value = result
      } else if (val.dataType === 'changed') {
        wsHistoryCache.value = [...result, ...wsHistoryCache.value]
        updateHistoryViews()
      }
    }
  }
)
const updateHistoryViews = useThrottleFn(() => {
  if (wsHistoryCache.value.length === 0) return
  if (wsHistoryCache.value?.length > 0) {
    historyList.value = [...wsHistoryCache.value, ...historyList.value]
    if (historyList.value.length > 200) {
      historyList.value = historyList.value.slice(0, 200)
    }
    wsHistoryCache.value.length = 0
    triggerRef(historyList)
  }
}, 200)
const updateViews = useThrottleFn(() => {
  if (wsBuyCache.value.length === 0 && wsSellCache.value.length === 0) return
  if (wsBuyCache.value?.length > 0) {
    const buy = buyList.value.concat(wsBuyCache.value)
    buyList.value = mergeDepthWithStep(buy, String(step.value), true)
    if (buyList.value.length > 200) {
      buyList.value = buyList.value?.slice(0, 200)
    }

    wsBuyCache.value.length = 0
    triggerRef(buyList)
  }

  if (wsSellCache.value?.length > 0) {
     const sell = sellList.value.concat(wsSellCache.value)
     sellList.value = mergeDepthWithStep(sell, String(step.value), false)
    if (sellList.value.length > 200) {
      sellList.value = sellList.value?.slice(0,200)
    }
    wsSellCache.value.length = 0
    triggerRef(sellList)
  }
}, 200)

// WebSocket 相关功能
onMounted(() => {
  // onTxsLiqMessage()
  // 如果组件挂载时 orderBook 已经打开，则获取数据
  unit.value = base.value ?? null
  step.value = Number(stepSizeList.value[0] ?? 0)

  window.addEventListener('resize', updateWidth)
  if (activeTab.value === 'orderbook') {
    subscribeOrderbook()
  } else {
    subscribeHistory()
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
  // 组件卸载时取消订阅
  if (contractId.value) {
    perpWsPubStore.send({
      type: 'unsubscribe',
      channel: `${WSPerpEventType.DEPTH}.${contractId.value}.${level.value}`,
    })
    perpWsPubStore.send({
      type: 'unsubscribe',
      channel: `${WSPerpEventType.TRADES}.${contractId.value}`,
    })
    if (showStepPop.value) {
      showStepPop.value = false
    }
    if (showUnitPop.value) {
      showUnitPop.value = false
    }
  }
})
function subscribeOrderbook() {
  perpWsPubStore.send({
    type: 'unsubscribe',
    channel: `${WSPerpEventType.DEPTH}.${contractId.value}.${level.value}`,
  })
  setTimeout(() => {
    perpWsPubStore.send({
      type: 'subscribe',
      channel: `${WSPerpEventType.DEPTH}.${contractId.value}.${level.value}`,
    })
  }, 500)
}
function subscribeHistory() {
  perpWsPubStore.send({
    type: 'unsubscribe',
    channel: `${WSPerpEventType.TRADES}.${contractId.value}`,
  })
  setTimeout(() => {
    perpWsPubStore.send({
      type: 'subscribe',
      channel: `${WSPerpEventType.TRADES}.${contractId.value}`,
    })
  }, 500)
}

 function mergeDepthWithStep(
  list: OrderBook[],
  step: string,
  isDown: boolean
) {
  const map = new Map<
    string,
    {
      price: string; // 规整后的 price
      size: string;  // 最新 size
      sum: BigNumber; // 累计值
    }
  >();

  for (const item of list) {
    const mergedPrice = DecimalExtensions.digitMergeNumber(
      item.price,
      step,
      isDown
    );

    const incomingSize = new BigNumber(item.size);
    const incomingSum = new BigNumber(item.sum ?? item.size);

    // size = 0 → 删除该价位
    if (incomingSize.isZero()) {
      map.delete(mergedPrice);
      continue;
    }

    if (!map.has(mergedPrice)) {
      // 首次出现
      map.set(mergedPrice, {
        price: mergedPrice,
        size: incomingSize.toFixed(),
        sum: incomingSum
      });
    } else {
      // 已存在 → size 用最新的覆盖，sum 增量累加
      const old = map.get(mergedPrice)!;

      map.set(mergedPrice, {
        price: mergedPrice,
        size: incomingSize.toFixed(),     // ✔ 覆盖旧 size
        sum: old.sum.plus(incomingSum)    // ✔ 累加 sum
      });
    }
  }

  const result = [...map.values()].map(i => ({
    price: i.price,
    size: i.size,
    sum: i.sum.toFixed()
  }));
   if (isDown) {
   // isDown: true  买盘   价格从高到低排序
  return result.sort((a, b) => new BigNumber(b.price).comparedTo(new BigNumber(a.price)))
   } else {
   return result.sort((a, b) => new BigNumber(a.price).comparedTo(new BigNumber(b.price)))
   }
}

function setActiveTab(val: string, index: number) {
  console.log('🔄 切换订单薄标签:', val)
  resetData(val)
    if (activeTab.value === 'orderbook') {
    perpWsPubStore.send({
      type: 'unsubscribe',
      channel: `${WSPerpEventType.TRADES}.${contractId.value}`,
    })
    perpWsPubStore.send({
      type: 'subscribe',
      channel: `${WSPerpEventType.DEPTH}.${contractId.value}.${level.value}`,
    })
  } else {
    perpWsPubStore.send({
      type: 'unsubscribe',
      channel: `${WSPerpEventType.DEPTH}.${contractId.value}.${level.value}`,
    })
    perpWsPubStore.send({
      type: 'subscribe',
      channel: `${WSPerpEventType.TRADES}.${contractId.value}`,
    })
  }
}
function resetData(val: string) {
  activeTab.value = val
  wsBuyCache.value = []
  wsSellCache.value = []
}
function switchUnit(item: CoinInfo | null) {
  unit.value = item
  showUnitPop.value = false
}
function switchStep(item: string) {
  step.value = Number(item)
  showStepPop.value = false
}
</script>

<style lang="scss" scoped>
.me-btn {
  background: transparent;
  color: var(--secondary-text);
  display: flex;
  align-items: center;
  border: none;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;

  &.active {
    color: #3f80f7;
  }
}

/* 响应式表格布局 */
@media (max-width: 479px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(40px, 0.8fr) minmax(100px, 3.5fr) minmax(60px, 1.5fr) minmax(
        30px,
        0.7fr
      );
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(45px, 0.8fr) minmax(100px, 3.2fr) minmax(80px, 1.8fr) minmax(
        35px,
        0.7fr
      );
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(50px, 1fr) minmax(100px, 3fr) minmax(80px, 2fr) minmax(
        40px,
        0.8fr
      );
  }
}

@media (min-width: 1200px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(60px, 1.2fr) minmax(120px, 3fr) minmax(100px, 2.5fr) minmax(
        45px,
        1fr
      );
  }
}

.grid {
  transition: grid-template-columns 0.3s ease;
  contain: layout style;
  will-change: grid-template-columns;
}

.relative.overflow-hidden.cursor-pointer {
  contain: layout;
  will-change: auto;
}

.text-nowrap {
  contain: layout;
}

@media (hover: none) and (max-width: 768px) {
  .relative.overflow-hidden.cursor-pointer {
    min-height: 44px;
  }

  .text-right .flex.items-center.justify-end {
    flex-wrap: wrap;
    gap: 2px;
  }
}

@media (max-width: 479px) {
  .text-12px {
    font-size: 11px;
  }

  .gap-20px {
    gap: 8px;
  }

  .py-4px {
    padding-top: 2px;
    padding-bottom: 2px;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .truncate.min-w-0 {
    max-width: 60px;
  }

  .w-12px.h-12px {
    width: 11px;
    height: 11px;
  }
}
.perp-active {
  --rect2: var(--down-color);
  --rect3: #12b886;
}

.perp-default {
  --rect2: #f6465d;
  --rect3: #12b886;
}
.range-container {
  // padding-top: 15px;
  flex: 1;
  text-align: center;
  .range {
    font-size: 12px;
    color: #eaecef;
    font-weight: 400;
    display: flex;
    flex: 1;
    .left {
      text-align: left;
      background: #12b886;
      border-radius: 2px 0 0 2px;
      height: 16px;
      line-height: 16px;
      clip-path: polygon(100% 0, calc(100% - 3px) 100%, 0 100%, 0 0);
      padding: 0 5px;
      min-width: 40px;
      max-width: calc(100% - 40px);
    }
    .right {
      background: #f6465d;
      height: 16px;
      line-height: 16px;
      border-radius: 0 2px 2px 0;
      padding: 0 5px;
      text-align: right;
      clip-path: polygon(3px 0, 0 100%, 100% 100%, 100% 0);
      min-width: 40px;
      max-width: calc(100% - 40px);
    }
  }

  .range-label {
    font-size: 11px;
    color: #3f80f7;
    font-weight: 400;
    margin-top: 10px;
  }
}
</style>
