<template>
  <div
    class="flex bg-[--main-divider] gap-1px flex min-w-0 w-full"
    style="min-height: calc(100vh - 92px)"
  >
    <div class="flex-1 min-w-0">
      <!-- <TokenHistory v-if="globalStore.tokenHistoryVisible" class="mb-1px" /> -->
      <Top />
      <div class="flex gap-1px">
        <div class="hide-scrollbar">
          <el-scrollbar :height="scrollbarHeight">
            <Left class="w-292px flex flex-col flex-shrink-0" />
          </el-scrollbar>
        </div>
        <div class="flex-1 hide-scrollbar min-w-0 relative">
          <div
            v-show="globalStore.showLeft"
            class="absolute bg-[--main-list-hover] w-10px h-32px z-2 cursor-pointer flex items-center justify-center left--11px hover:w-30px hover:left--31px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px color-[--third-text] hover:color-[--main-text]"
            @click="globalStore.$patch({ showLeft: false })"
          >
            <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-12px" />
          </div>
          <div
            v-show="!globalStore.showLeft"
            class="absolute bg-[--main-list-hover] w-10px h-32px z-2 cursor-pointer flex items-center justify-center  left-0 hover:w-30px hover:h-36px transition-all rounded-tr-4px rounded-br-4px color-[--third-text] hover:color-[--main-text]"
            @click="globalStore.$patch({ showLeft: true })"
          >
            <Icon name="material-symbols:arrow-forward-ios" class="text-12px" />
          </div>


          <div
            v-show="!globalStore.showRight"
            class="absolute bg-[--main-list-hover] w-10px h-32px z-1 cursor-pointer flex items-center justify-center top-0px right-0 hover:w-30px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px color-[--third-text] hover:color-[--main-text]"
            @click="globalStore.$patch({ showRight: true })"
          >
            <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-12px" />
          </div>
          <el-scrollbar :height="scrollbarHeight" @scroll="centerScroll">
            <div
              :class="orderBookVisible ? 'grid gap-1px' : 'grid grid-cols-1 gap-1px'"
              :style="
                orderBookVisible ? { gridTemplateColumns: `1fr 4px ${orderBookWidth}px` } : {}
              "
            >
              <div>
                <KLine ref="klineContainer" @refresh="refresh" />
              </div>
              <!-- 订单簿拖动条 -->
              <div
                v-if="orderBookVisible"
                class="cursor-col-resize bg-[--d-222-l-F2F2F2] hover:bg-[--d-666-l-CCC] flex flex-col items-center justify-center gap-1px w-4px"
                @mousedown.stop.prevent="dragOrderBook"
              >
                <span v-for="i in 4" :key="i" class="bg-[--d-444-l-999] w-2px h-2px rounded-full" />
              </div>
              <OrderBook v-model="orderBookVisible" :kline-height="klineHeight + 3" />
            </div>
            <BelowChartTable class="min-h-300px rounded-4px bg-[--d-000-l-F6F6F6]" />
          </el-scrollbar>
        </div>
      </div>
    </div>
    <TokenRight class="w-334px flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import { useTokenStore } from '~/stores/token'
import Top from './components/top/index.vue'
import TokenRight from './components/right/index.vue'
import { Left } from './components/left'
import { BelowChartTable } from './components/belowChartTable'
import KLine from '~/pages/token/components/kLine/index.vue'
import { OrderBook } from './components/orderBook'
import { getAiSummary } from '@/api/token'

definePageMeta({
  name: 'token-id',
  key: (route) => {
    return route.name as string
  },
})
const route = useRoute()
const walletStore = useWalletStore()
const localeStore = useLocaleStore()
const tagStore = useTagStore()
const tokenStore = useTokenStore()
const scrollbarHeight = computed(() => {
  if (tokenStore.isShowWaring) {
    // if (globalStore.tokenHistoryVisible) {
    //   return 'calc(100vh - 230px)'
    // }
    return 'calc(100vh - 198px)'
  }
  // if (globalStore.tokenHistoryVisible) {
  //   return 'calc(100vh - 190px)'
  // }
  return 'calc(100vh - 158px)'
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



// 订单簿显示状态 - 使用本地存储保持状态
const orderBookVisible = useStorage('orderBookVisible', false)
provide('orderBookVisible', orderBookVisible)

// 点击 k 线的日期筛选
const klineDateFilter = ref<string[]>([])
provide(ProvideType.KLINE_DATE_FILTER, klineDateFilter)

// KLine 高度监听
const klineHeight = useStorage('kHeight', DefaultHeight.KLINE)
// 订单簿宽度管理
const DEFAULT_ORDERBOOK_WIDTH = 300
const MAX_ORDERBOOK_WIDTH = 400
const orderBookWidth = useStorage('orderBookWidth', DEFAULT_ORDERBOOK_WIDTH)
const aiSummary = shallowRef({ summary: '', headline: '' })

// 订单簿拖动功能（更丝滑、可控制）
let isDraggingOrderBook = false
const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})
function dragOrderBook(e: MouseEvent) {
  e.preventDefault()
  let lastX = e.clientX
  isDraggingOrderBook = true

  // 禁用图表交互，设置全局光标与禁选中，提升体验
  let chartContainer = document.getElementById('tv_chart_container')
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
    chartContainer = null
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
watch([() => route.params.id, () => localeStore.locale], () => {
  _getAiSummary()
})
//顶层提供aisummary数据，给子组件top和right使用
provide('aiSummary', aiSummary)

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

// function subBalanceChange() {
//   wsStore.send({
//     jsonrpc: '2.0',
//     method: 'unsubscribe',
//     params: [
//       'asset'
//     ],
//     id: 1
//   })
//   wsStore.send({
//     jsonrpc: '2.0',
//     method: 'subscribe',
//     params: ['asset', addresses.value],
//     id: 1,
//   })
// }

// 订阅画像
function subscribePortrait() {
  usePublicPortraitStore().reset()
  const { address, chain } = getAddressAndChainFromId(route.params.id as string)
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: [WSEventType.PUBLIC_PORTRAIT],
    id: 1,
  })
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: [WSEventType.PUBLIC_PORTRAIT, address, chain],
    id: 1,
  })
}

function _getTokenInfo() {
  const id = route.params.id as string
  tokenStore.loadingToken = true
  return getTokenInfo(id)
    .then((res) => {
      tokenStore.tokenInfo = res
      tokenStore.pairAddress = res?.pairs?.[0].pair || ''
    })
    .finally(() => {
      tokenStore.loadingToken = false
    })
}

function _getTokenInfoExtra() {
  const id = route.params.id as string
  getTokenInfoExtra(id).then((res) => {
    tokenStore.tokenInfoExtra = res
  })
}

function init(
  // isRefresh = false
) {
  tokenStore.tokenPrice = 0
  _getTokenInfo()
  // .then(() => {
  //   if (!isRefresh) {
  //     addVisit()
  //   }
  // })
  _getTokenInfoExtra()
  // wsStore.onmessageTxUpdateToken()
  tokenStore._getTotalHolders(route.params.id as string)
  tagStore.getTagArr()
  tokenStore.twitterType = 0
  tokenStore.getXType(route.params.id as string)
  useCheckStore().getContractCheckResult(route.params.id as string, walletAddress.value)
}

watch(
  () => route.params.id,
  () => {
    init()
    subscribePortrait()
  }
)

function visibilitychangeFn() {
  console.log(`页面是否隐藏: ${document.hidden}`)
  documentVisible.value = !document.hidden || document.visibilityState === 'visible'
}

onBeforeMount(() => {
  init()
  subscribePortrait()
  document.addEventListener('visibilitychange', visibilitychangeFn)
})

onUnmounted(() => {
  tokenStore?.reset?.()
  wsStore.clearTokenRelatedResult?.()
  // 确保移除可能遗留的 WS 回调与可见性监听，防止内存泄漏
  wsStore.getWSInstance()?.offMessage(['tx_update_token', 'kline', 'price'])
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
  document.removeEventListener('visibilitychange', visibilitychangeFn)
})

onBeforeRouteLeave(() => {
  wsStore.getWSInstance()?.offMessage(['tx_update_token', 'kline', 'price'])
  document.removeEventListener('visibilitychange', visibilitychangeFn)
})

function refresh() {
  init()
}

// function addVisit() {
//   if (tokenStore.tokenInfo) {
//     const { logo_url, symbol, chain, token } = tokenStore.tokenInfo.token
//     const index = globalStore.lastVisitTokens.findIndex((item) => item.id === token + '-' + chain)
//     if (index === -1) {
//       if (globalStore.lastVisitTokens.length >= 20) {
//         globalStore.lastVisitTokens.pop()
//       }
//       globalStore.lastVisitTokens.unshift({
//         id: token + '-' + chain,
//         logo_url,
//         symbol,
//         price_change: tokenStore.priceChange,
//         price_change_v2: tokenStore.priceChangeV2,
//         circulation: tokenStore.circulation.toString(),
//         price: tokenStore.price || 0,
//       })
//     }

//     usePriceV2Store().sendPriceWs()
//   }
// }

const klineContainerRef = useTemplateRef('klineContainer')
const centerScroll = ({ scrollTop }: { scrollTop: number }) => {
  klineContainerRef.value?.setScrollTop?.(scrollTop)
}
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
