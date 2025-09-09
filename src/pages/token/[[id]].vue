<template>
  <div class="flex bg-[--d-000-l-F6F6F6] gap-1px flex min-w-0 w-full" style="min-height: calc(100vh - 92px);">
    <div class="flex-1 min-w-0">
      <Top/>
      <div class="flex gap-1px">
        <div class="hide-scrollbar">
          <el-scrollbar :height="scrollbarHeight">
            <Left class="w-292px flex flex-col flex-shrink-0"/>
          </el-scrollbar>
        </div>
        <div class="flex-1 hide-scrollbar min-w-0 relative">
          <div
            v-show="globalStore.showLeft"
            :class="`absolute bg-[--d-333-l-DDD] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left--14px hover:w-30px hover:left--34px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px`"
            @click="globalStore.$patch({showLeft:false})"
          >
            <Icon name="material-symbols:arrow-back-ios-new-rounded" :class="`color-[--d-FFF-l-222] text-12px`"/>
          </div>
          <div
            v-show="!globalStore.showLeft"
            :class="`absolute bg-[--d-333-l-DDD] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left-0 hover:w-30px hover:h-36px transition-all rounded-tr-4px rounded-br-4px`"
            @click="globalStore.$patch({showLeft:true})"
          >
            <Icon name="material-symbols:arrow-forward-ios" :class="`color-[--d-FFF-l-222] text-12px`"/>
          </div>
          <el-scrollbar :height="scrollbarHeight">
            <div
              :class="orderBookVisible ? 'grid gap-1px' : 'grid grid-cols-1 gap-1px'"
              :style="orderBookVisible ? { gridTemplateColumns: `1fr 4px ${orderBookWidth}px` } : {}"
            >
              <div>
                <KLine ref="klineContainer" @refresh="refresh"/>
              </div>
              <!-- 订单簿拖动条 -->
              <div
                v-if="orderBookVisible"
                class="cursor-col-resize bg-[--d-222-l-F2F2F2] hover:bg-[--d-666-l-CCC] flex flex-col items-center justify-center gap-1px w-4px"
                @mousedown.stop.prevent="dragOrderBook"
              >
                <span v-for="i in 4" :key="i" class="bg-[--d-444-l-999] w-2px h-2px rounded-full"/>
              </div>
              <OrderBook v-model="orderBookVisible" :kline-height="klineHeight + 3" />
            </div>
            <BelowChartTable class="min-h-300px rounded-4px bg-[--d-000-l-F6F6F6]"/>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <TokenRight class="w-334px flex-shrink-0" />
  </div>
</template>

<script setup lang='ts'>
import { useStorage } from '@vueuse/core'
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import { useTokenStore } from '~/stores/token'
import Top from './components/top/index.vue'
import TokenRight from './components/right/index.vue'
import { Left } from './components/left'
import { BelowChartTable } from './components/belowChartTable'
import KLine from '~/pages/token/components/kLine/index.vue'
import {OrderBook} from './components/orderBook'
import  { getAiSummary } from '@/api/token'

definePageMeta({
  name: 'token-id',
  key: (route) => {
    return (route.name as string)
  },
})
const route = useRoute()
const localeStore  = useLocaleStore()
const tagStore = useTagStore()
const tokenStore = useTokenStore()
const scrollbarHeight = computed(() => {
  if (tokenStore.isShowWaring) {
    return 'calc(100vh - 198px)'
  }
  return 'calc(100vh - 158px)'
})
const globalStore = useGlobalStore()
const botStore = useBotStore()
const addresses = computed(() => {
  const result = botStore.userInfo?.addresses
  if (Array.isArray(result)) {
    return Array.from(new Set(result.map(el => el.address)))
  }
  return []
})
const wsStore = useWSStore()

// 订单簿显示状态 - 使用本地存储保持状态
const orderBookVisible = useStorage('orderBookVisible', false)
provide('orderBookVisible', orderBookVisible)

// KLine 高度监听
const klineHeight = useStorage('kHeight', DefaultHeight.KLINE)
// 订单簿宽度管理
const DEFAULT_ORDERBOOK_WIDTH = 360
const MAX_ORDERBOOK_WIDTH = 500
const orderBookWidth = useStorage('orderBookWidth', DEFAULT_ORDERBOOK_WIDTH)
const aiSummary = shallowRef({summary:'', headline:''})

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
      orderBookWidth.value = Math.min(
        MAX_ORDERBOOK_WIDTH,
        Math.max(DEFAULT_ORDERBOOK_WIDTH, next)
      )
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

 function _getAiSummary() {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  getAiSummary(id)
    .then((res) => {
      aiSummary.value = res ?? { summary: '', headline: '' }
    })
    .catch((err: any) => {
      console.log(err)
    })
    .finally(() => {})
}

onMounted(() => {
  _getAiSummary()
})
watch([() => route.params.id, () => localeStore.locale],
  () => {
    _getAiSummary()
  }
)
//顶层提供aisummary数据，给子组件top和right使用
provide('aiSummary', aiSummary)

const documentVisible = shallowRef(true)
provide('documentVisible', documentVisible)

watch(() => addresses.value, () => {
  if (addresses.value?.length) {
    subBalanceChange()
  }
}, {
  immediate: true
})

function subBalanceChange() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: [
      'asset'
    ],
    id: 1
  })
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['asset', addresses.value],
    id: 1,
  })
}

function _getTokenInfo() {
  const id = route.params.id as string
  getTokenInfo(id).then(res => {
    tokenStore.tokenInfo = res
    tokenStore.pairAddress = res?.pairs?.[0].pair || ''
  })
}

function _getTokenInfoExtra() {
  const id = route.params.id as string
  getTokenInfoExtra(id).then(res => {
    tokenStore.tokenInfoExtra = res
  })
}

function init() {
  tokenStore.tokenPrice = 0
  _getTokenInfo()
  _getTokenInfoExtra()
  // wsStore.onmessageTxUpdateToken()
  tokenStore._getTotalHolders(route.params.id as string)
  tagStore.getTagArr()
  tokenStore.twitterType = 0
  tokenStore.getXType(route.params.id as string)
}

watch(() => route.params.id, () => {
  init()
})

function visibilitychangeFn() {
  console.log(`页面是否隐藏: ${document.hidden}`)
  documentVisible.value = (!document.hidden || document.visibilityState === 'visible')
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
    params: [
      'asset'
    ],
    id: 1
  })
})

onBeforeRouteLeave(() => {
  wsStore.getWSInstance()?.offMessage(['tx_update_token', 'kline', 'price'])
  document.removeEventListener('visibilitychange', visibilitychangeFn)
})

function refresh() {
  init()
}
</script>

<style scoped>
.hide-scrollbar {
  >.el-scrollbar {
    .el-scrollbar__bar {
      --at-apply: hidden;
    }
  }
}
</style>
