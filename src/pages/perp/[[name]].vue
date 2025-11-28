<template>
  <div
    class="flex bg-[--main-divider] gap-1px flex min-w-0 w-full"
    style="min-height: calc(100vh - 92px- 64px)"
  >
    <div class="flex-1">
      <Top />
      <div class="flex flex-1">
        <div class="flex-1 min-w-0">
          <div class="flex gap-1px">
            <div class="flex-1 hide-scrollbar min-w-0 relative">
              <div
                v-show="globalStore.showLeft"
                class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left--11px hover:w-30px hover:left--31px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px color-[--third-text] hover:color-[--main-text]"
                @click="globalStore.$patch({ showLeft: false })"
              >
                <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-12px" />
              </div>
              <div
                v-show="!globalStore.showLeft"
                class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left-0 hover:w-30px hover:h-36px transition-all rounded-tr-4px rounded-br-4px color-[--third-text] hover:color-[--main-text]"
                @click="globalStore.$patch({ showLeft: true })"
              >
                <Icon name="material-symbols:arrow-forward-ios" class="text-12px" />
              </div>
              <el-scrollbar :height="scrollbarHeight">
                <div
                  class="grid gap-1px"
                  :style="{ gridTemplateColumns: `1fr 4px ${orderBookWidth}px` }
                  "
                >
                  <div>
                    <Kline ref="klineContainer" />
                  </div>
                  <!-- 订单簿拖动条 -->
                  <div
                    class="cursor-col-resize bg-[--d-222-l-F2F2F2] hover:bg-[--d-666-l-CCC] flex flex-col items-center justify-center gap-1px w-4px"
                    @mousedown.stop.prevent="dragOrderBook"
                  >
                    <span v-for="i in 4" :key="i" class="bg-[--d-444-l-999] w-2px h-2px rounded-full"/>
                  </div>
                  <OrderBook :kline-height="klineHeight + 3" />
                </div>

                <Bottom class="rounded-4px bg-[--d-000-l-F6F6F6]" :style="{ minHeight: height + 'px' }"/>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <TokenRight class="w-334px flex-shrink-0" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { useTokenStore } from '~/stores/token'
import Top from './components/top/index.vue'
import TokenRight from './components/right/index.vue'
import Kline from './components/kline/index.vue'
import OrderBook from './components/orderBook/index.vue'
import Bottom from './components/bottom/index.vue'
definePageMeta({
  name: 'perp-id',
  key: (route) => {
    return route.name as string
  },
})
const tokenStore = useTokenStore()
const scrollbarHeight = computed(() => {
  if (globalStore.tokenHistoryVisible) {
    return 'calc(100vh - 160px)'
  }
  return ''
})
const height = computed(() => {
  return tokenStore.commonHeight - 160
})
const globalStore = useGlobalStore()
const botStore = useBotStore()
const addresses = computed(() => {
  const result = botStore.userInfo?.addresses
  if (Array.isArray(result)) {
    return Array.from(new Set(result.map((el) => el.address)))
  }
  return []
})
const wsStore = useWSStore()

// 点击 k 线的日期筛选
const klineDateFilter = ref<string[]>([])
provide(ProvideType.KLINE_DATE_FILTER, klineDateFilter)

// KLine 高度监听
const klineHeight = useStorage('kHeight', DefaultHeight.KLINE)
// 订单簿宽度管理
const DEFAULT_ORDERBOOK_WIDTH = 300
const MAX_ORDERBOOK_WIDTH = 400
const orderBookWidth = useStorage('orderBookWidth', DEFAULT_ORDERBOOK_WIDTH)

// 订单簿拖动功能（更丝滑、可控制）
let isDraggingOrderBook = false
function dragOrderBook(e: MouseEvent) {
  e.preventDefault()
  let lastX = e.clientX
  isDraggingOrderBook = true

  // 禁用图表交互，设置全局光标与禁选中，提升体验
  const chartContainer = document.getElementById('tv_chart_container')
  chartContainer && (chartContainer.style.pointerEvents = 'none')
  const prevCursor = document.body.style.cursor
  const prevUserSelect = document.body.style.userSelect
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'

  let framePending = false
  let pendingX = lastX

  const onMove = (ev: MouseEvent) => {
    if (!isDraggingOrderBook) return
    pendingX = ev.clientX
    if (framePending) return
    framePending = true
    requestAnimationFrame(() => {
      const clientX = pendingX
      const delta = lastX - clientX // 向左拖变宽，向右拖变窄
      const next = orderBookWidth.value + delta
      orderBookWidth.value = Math.min(MAX_ORDERBOOK_WIDTH, Math.max(DEFAULT_ORDERBOOK_WIDTH, next))
      lastX = clientX
      framePending = false
    })
  }

  const onUp = () => {
    isDraggingOrderBook = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
    chartContainer && (chartContainer.style.pointerEvents = 'auto')
    document.body.style.cursor = prevCursor
    document.body.style.userSelect = prevUserSelect
  }

  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp, { once: true })
  return false
}

const documentVisible = shallowRef(true)
provide('documentVisible', documentVisible)

watch(
  () => addresses.value,
  () => {
    if (addresses.value?.length) {
      botStore.subBalanceChange()
    }
  },
  {
    immediate: true,
  }
)
function init(isRefresh = false) {
}

function visibilitychangeFn() {
  console.log(`页面是否隐藏: ${document.hidden}`)
  documentVisible.value = !document.hidden || document.visibilityState === 'visible'
}

onBeforeMount(() => {
  init()
  document.addEventListener('visibilitychange', visibilitychangeFn)
})

onUnmounted(() => {
  tokenStore?.reset?.()
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['asset'],
    id: 1,
  })
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: [WSEventType.PUBLIC_PORTRAIT],
    id: 1,
  })
})

onBeforeRouteLeave(() => {
  wsStore.getWSInstance()?.offMessage(['tx_update_token', 'kline', 'price'])
  document.removeEventListener('visibilitychange', visibilitychangeFn)
})

</script>

<style scoped>
.hide-scrollbar {
  > .el-scrollbar {
    .el-scrollbar__bar {
      --at-apply: hidden;
    }
  }
}
</style>
