<template>
  <div class="w-full">
    <WithdrawAlert />
    <div class="flex bg-[--main-divider] gap-1px min-w-0 w-full">
      <div class="flex-1 min-w-0 relative">
        <div
          v-show="show1"
          class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left-100% hover:w-30px hover:h-36px transition-all rounded-tr-4px rounded-br-4px color-[--third-text] hover:color-[--main-text]"
          @click="show1=false"
        >
          <Icon name="material-symbols:arrow-forward-ios" class="text-12px" />
        </div>
        <div
          v-show="!show2"
          class="absolute bg-[--main-list-hover] w-10px h-32px z-11 cursor-pointer flex items-center justify-center right-0 hover:w-30px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px color-[--third-text] hover:color-[--main-text]"
          @click="show2=true"
        >
          <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-12px" />
        </div>
        <div
          v-show="!show1&&!show2"
          class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center right-0 hover:w-30px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px color-[--third-text] hover:color-[--main-text]"
          @click="show1=true"
        >
          <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-12px" />
        </div>
        <Top/>
        <div class="flex gap-1px mt-1px">
          <div class="flex-1 hide-scrollbar min-w-0 relative">
            <div
              v-show="!show1&&show2"
              class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center right-0 hover:w-30px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px color-[--third-text] hover:color-[--main-text]"
              @click="show1=true"
            >
              <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-12px" />
            </div>
            <el-scrollbar :height="scrollbarHeight">
              <div
                :class="show2 ? 'grid gap-1px' : 'grid grid-cols-1'"
                :style="{ gridTemplateColumns: show2 ? `1fr 1px ${orderBookWidth}px` :  '1fr 1px auto' }
                "
              >
                <div  class="relative">
                  <div
                    v-show="show2"
                    class="absolute bg-[--main-list-hover] w-10px h-32px z-11 cursor-pointer flex items-center justify-center top--1px left-100% hover:w-30px hover:h-36px transition-all rounded-tr-4px rounded-br-4px color-[--third-text] hover:color-[--main-text]"
                    @click="show2=false"
                  >
                    <Icon name="material-symbols:arrow-forward-ios" class="text-12px" />
                  </div>
                  <Kline ref="klineContainer"/>
                </div>
                <!-- 订单簿拖动条 -->
                <div
                  class="cursor-col-resize bg-[--d-222-l-F2F2F2] hover:bg-[--d-666-l-CCC] flex flex-col items-center justify-center gap-1px w-1px"
                  @mousedown.stop.prevent="dragOrderBook"
                >
                  <span v-for="i in 4" :key="i" class="bg-[--d-444-l-999] w-2px h-2px rounded-full"/>
                </div>
                <OrderBook v-show="show2" :kline-height="klineHeight" />
              </div>
              <Bottom class="rounded-4px bg-[--d-000-l-F6F6F6]" :style="{ minHeight: height + 'px' }"/>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <TokenRight v-show="show1 && show2" class="w-334px flex-shrink-0" />
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
import WithdrawAlert from '~/components/perp/withdrawAlert.vue'
const { isCanNormalWithdrawableAmount } = usePerp()
definePageMeta({
  name: 'perp-id',
  key: (route) => {
    return route.name as string
  },
})
const tokenStore = useTokenStore()

const show1 = useStorage('perpShow1', true, sessionStorage)
const show2 = useStorage('perpShow2', true, sessionStorage)
const scrollbarHeight = computed(() => {
  if (isCanNormalWithdrawableAmount.value) {
    return 'calc(100vh - 174px)'
  }
  return 'calc(100vh - 159px)'
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
const klineHeight = useStorage('kHeightPerp-v1', Math.max(DefaultHeight.KLINE, 564))
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
