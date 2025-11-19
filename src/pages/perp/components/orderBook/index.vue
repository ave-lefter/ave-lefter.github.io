<template>
  <div
    class="bg-[--d-0B0D12-l-F6F9FF] relative rounded-2px text-14px pt-12px flex flex-col overflow-hidden"
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
            class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-15px mt-8px mb-4px text-12px color-[--d-5A5E64-l-A9B0BC]"
          >
            <div class="min-w-0 text-left">价格({{ quote?.coinName }})</div>
            <div class="text-right text-nowrap min-w-0">
              <div class="flex items-center justify-end gap-2px">
                <span>数量({{ unit?.coinName }})</span>
              </div>
            </div>
            <div class="text-right text-nowrap min-w-0">
              <div class="flex items-center justify-end gap-2px">
                <span>累计({{ unit?.coinName }})</span>
              </div>
            </div>
          </div>
          <List
            v-if="activeLayoutTab == 'all' || activeLayoutTab == 'sell'"
            :list="sellList"
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
              :name="`custom:${Number(perp?.priceChange) > 0 ? 'arrow-up' : 'arrow-down'}`"
            />
            <div class="flex-1"></div>
            <Icon class="text-14px color-[--third-text]" name="custom:perp-flag" />
            <span class="text-12px color-[--third-text] ml-4px">
              {{ formatNumber(perp?.oraclePrice || 0) }}</span
            >
          </div>
          <List
            v-if="activeLayoutTab == 'all' || activeLayoutTab == 'buy'"
            :list="buyList"
            type="buy"
            :height="height"
            :unit="unit"
          />
        </div>
      </div>
      <div
        class="range-container z-10 absolute bottom-0 py-16px px-10px w-100% flex items-center justify-center bg-[--main-input-button-bg] color-[#FFA622]"
      >
        <span class="text-10px color-[--up-color]">买</span>
        <div class="range ml-4px mr-4px">
          <span class="left" :style="{ width: formatNumber(progress || 0, 1) + '%' }">
            {{ formatNumber(progress, 1) }}%
          </span>
          <span class="right" :style="{ width: formatNumber(100 - progress || 0, 1) + '%' }">
            {{ formatNumber(100 - progress, 1) }}%
          </span>
        </div>
        <span class="text-10px color-[--down-color]">卖</span>
      </div>
    </template>
     <div v-else class="mx-12px pb-12px">
      <div
        class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-15px mt-8px mb-4px text-12px color-[--d-5A5E64-l-A9B0BC]"
      >
        <div class="min-w-0 text-left">价格({{ quote?.coinName }})</div>
        <div class="text-right text-nowrap min-w-0">
          <div class="flex items-center justify-end gap-2px">
            <span>数量({{ base?.coinName }})</span>
          </div>
        </div>
        <div class="text-right text-nowrap min-w-0">
          <div class="flex items-center justify-end gap-2px">
            <span>时间</span>
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
const { contractId, perp, resolution, metadata } = storeToRefs(usePerpStore())
const perpWsPubStore = usePerpWsPubStore()

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
const unit = ref<CoinInfo | null>(null)
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
      label: '订单薄',
      value: 'orderbook',
    },
    {
      label: '最近交易',
      value: 'history',
    },
  ]
})
const tabsLayout = computed(() => {
  return [
    {
      label: '订单薄',
      value: 'all',
    },
    {
      label: '买入',
      value: 'buy',
    },
    {
      label: '卖出',
      value: 'sell',
    },
  ]
})
const height = computed(() => {
  const h = props.klineHeight || 300
  if(activeTab.value === 'history') {
    return (h - 100)
  } else if (activeLayoutTab.value === 'all') {
    return (h - 100) / 2
  } else {
    return h - 200
  }
})

const coinList = computed(() => {
  return metadata?.value?.coinList || []
})

const base = computed(() => {
  const baseCoinId = perp.value?.baseCoinId || ''
  return coinList.value?.find((i) => i.coinId == baseCoinId) ?? null
})
const quote = computed(() => {
  const quoteCoinId = perp.value?.quoteCoinId || ''
  return coinList.value?.find((i) => i.coinId == quoteCoinId) ?? null
})
const unitList = computed(() => {
  return [base.value, quote.value]?.filter(Boolean)
})

const stepSizeList = computed(() => {
  return perp.value?.displayDigitMerge?.split(',') || []
})
const maxBuySum = computed(() => {
  return Math.max(...buyList.value.map((i) => Number(i.sum)))
})
const maxSellSum = computed(() => {
  return Math.max(...sellList.value.map((i) => Number(i.sum)))
})
const progress = computed(() => {
  if (maxBuySum.value + maxSellSum.value > 0) {
    return Math.min((maxBuySum.value / (maxBuySum.value + maxSellSum.value)) * 100, 100)
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
    console.log('-------val----', val)
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
          wsBuyCache.value = mergeData(arr_buy, wsBuyCache.value)
        }
        if (arr_sell?.length > 0) {
          wsSellCache.value = mergeData(arr_sell, wsSellCache.value)
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
}, 300)
const updateViews = useThrottleFn(() => {
  if (wsBuyCache.value.length === 0 && wsSellCache.value.length === 0) return
  const num = Math.floor(Number(height.value) / 24)
  if (wsBuyCache.value?.length > 0) {
    buyList.value = mergeData(wsBuyCache.value, buyList.value)
    buyList.value = mergeDepth(buyList.value, step.value, 'bids')
    if (buyList.value.length > num) {
      buyList.value = buyList.value.slice(0, num)
    }
    wsBuyCache.value.length = 0
    triggerRef(buyList)
  }

  if (wsSellCache.value?.length > 0) {
    sellList.value = mergeData(wsSellCache.value, buyList.value)
    sellList.value = mergeDepth(sellList.value, step.value, 'asks')
    if (sellList.value.length > num) {
      sellList.value = sellList.value.slice(0, num)
    }
    wsSellCache.value.length = 0
    triggerRef(sellList)
  }
}, 300)

// WebSocket 相关功能
onMounted(() => {
  // onTxsLiqMessage()
  // 如果组件挂载时 orderBook 已经打开，则获取数据
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
function mergeData(newArr: OrderBook[], wsCache: OrderBook[]) {
  const map = new Map()
  wsCache.forEach((item) => {
    map.set(item.price, { ...item })
  })
  newArr.forEach((item) => {
    if (map.has(item.price)) {
      const old = map.get(item.price)
      map.set(item.price, {
        price: item.price,
        size: item.size, // size 覆盖
        sum: (Number(old.sum) + Number(item.sum)).toString(), // sum 累加
      })
    } else {
      map.set(item.price, { ...item })
    }
  })
  const arr = Array.from(map.values())
  const result = arr?.filter((i) => Number(i.size) > 0)
  result?.sort((a, b) => Number(b.price) - Number(a.price))
  return result
}
function mergeDepth(list: OrderBook[], step: number, type: 'asks' | 'bids'): OrderBook[] {
  const map = new Map<number, number>()

  for (const item of list) {
    const p = Number(item.price)
    const s = Number(item.size)
    let mergedPrice = 0

    if (type === 'asks') {
      // 卖盘：向上合并
      mergedPrice = Math.ceil(p / step) * step
    } else {
      // 买盘：向下主，但 ≥0.5 step 进位
      const lower = Math.floor(p / step) * step
      const upper = lower + step

      if (p - lower >= step / 2) {
        mergedPrice = upper
      } else {
        mergedPrice = lower
      }
    }

    // 合并 size
    map.set(mergedPrice, (map.get(mergedPrice) || 0) + s)
  }

  // Map → 数组
  const merged = Array.from(map, ([price, size]) => ({ price, size }))

  // 排序（asks 从低到高，bids 从高到低）
  merged.sort((a, b) => (type === 'asks' ? a.price - b.price : b.price - a.price))

  // 累计 sum 并输出 string 类型
  let cum = 0

  return merged.map((item) => {
    cum += item.size
    return {
      price: String(item.price),
      size: String(item.size),
      sum: String(cum),
    }
  })
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
