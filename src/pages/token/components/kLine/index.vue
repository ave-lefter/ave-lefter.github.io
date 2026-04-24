<template>
  <div class="relative" :style="{ height: `${isRank ? 390 : kHeight}px`,'will-change': 'height' }">
    <div id="tv_chart_container" ref="kline" :style="{ width: '100%', height: '100%' }" />
    <UnknownRisk v-show="isReady" :isRank="isRank" @refresh="refresh" />
    <DialogRemind v-model="dialogVisible_remind" />
  </div>
  <!-- <div
    v-if="!isRank"
    class="w-full cursor-row-resize bg-[--border] gap-1px hover:bg-[--third-text] flex items-center justify-center h-4px"
    @mousedown.stop.prevent="drag"
  >
    <span v-for="i in 4" :key="i" class="bg-[--icon-color] w-2px h-2px rounded-full" />
  </div> -->
  <div
    v-show="globalStore.klineSettingPop.visible"
    :style="{
      transform: `translate3d(${globalStore.klineSettingPop.position[0]}px,${globalStore.klineSettingPop.position[1] - scrollTop}px,0)`,
    }"
    class="absolute top-0 left-0 p-20px bg-[--dialog-bg] rounded-8px w-320px text-14px z-10"
    @click.stop
  >
    <div class="flex justify-between items-center mb-16px">
      {{ $t('chainToken') }}
      <el-switch v-model="markTabsVisible" class="[&&]:h-20px" />
    </div>
    <div class="flex flex-wrap gap-row-16px">
      <el-checkbox
        key="all"
        class="flex-basis-1/3 [&&]:mr-0 [&&]:[--el-checkbox-height:16px]"
        :model-value="!Object.values(markTabsChecked).some((el) => !el)"
        @change="
          (e) => {
            Object.keys(markTabsChecked).forEach((key) => {
              markTabsChecked[key] = e as boolean
            })
            onMarkChanged(e as boolean)
          }
        "
      >
        {{ t('all') }}
      </el-checkbox>
      <el-checkbox
        v-for="item in totalHolders"
        :key="item.id"
        v-model="markTabsChecked[item.id]"
        class="flex-basis-1/3 [&&]:mr-0 [&&]:[--el-checkbox-height:16px]"
        @change="onMarkChanged"
      >
        {{ item.name }}
      </el-checkbox>
    </div>
    <div class="my-24px h-1px border-t-solid border-t-[--dialog-divider]" />
    <div class="flex flex-col gap-16px">
      <div class="flex items-center gap-7px">
        {{ $t('indicatorLine') }}
        <Icon
          name="custom:reset2"
          class="cursor-pointer color-[--third-text] text-10px"
          @click="resetIndicatorLineColor"
        />
      </div>
      <div class="flex justify-between">
        <el-checkbox v-model="linesChecked.buy.checked" class="[&&]:[--el-checkbox-height:16px]">{{
          $t('buyMa')
        }}</el-checkbox>
        <el-tooltip v-model:visible="colorPickerVisible.buy" trigger="click" :teleported="false" :persistent="false">
          <div
            class="w-14px h-14px rounded-2px border-solid border-[--border] cursor-pointer"
            :style="{ background: linesChecked.buy.color }"
          />
          <template #content>
            <el-color-picker-panel v-model="linesChecked.buy.color" />
          </template>
        </el-tooltip>
      </div>
      <div class="flex justify-between">
        <el-checkbox v-model="linesChecked.sell.checked" class="[&&]:[--el-checkbox-height:16px]">{{
          $t('sellMa')
        }}</el-checkbox>
        <el-tooltip v-model:visible="colorPickerVisible.sell" trigger="click" :teleported="false" :persistent="false">
          <div
            class="w-14px h-14px rounded-2px border-solid border-[--border] cursor-pointer"
            :style="{ background: linesChecked.sell.color }"
          />
          <template #content>
            <el-color-picker-panel v-model="linesChecked.sell.color" />
          </template>
        </el-tooltip>
      </div>
      <div class="flex justify-between">
        <el-checkbox v-model="linesChecked.kol.checked" class="[&&]:[--el-checkbox-height:16px]">{{
          $t('kolPosition')
        }}</el-checkbox>
        <el-tooltip v-model:visible="colorPickerVisible.kol" trigger="click" :teleported="false" :persistent="false">
          <div
            class="w-14px h-14px rounded-2px border-solid border-[--border] cursor-pointer"
            :style="{ background: linesChecked.kol.color }"
          />
          <template #content>
            <el-color-picker-panel v-model="linesChecked.kol.color" />
          </template>
        </el-tooltip>
      </div>
    </div>
    <div class="my-24px h-1px border-t-solid border-t-[--dialog-divider]" />
    <div class="flex flex-col gap-16px">
      <div class="flex items-center gap-7px">
        {{ $t('top100') }}
        <Icon
          name="custom:reset2"
          class="cursor-pointer color-[--third-text] text-10px"
          @click="resetTop100Color"
        />
      </div>
      <div class="flex justify-between">
        <el-checkbox
          v-model="linesChecked.top100Buy.checked"
          class="[&&]:[--el-checkbox-height:16px]"
          >{{ $t('whaleBuy') }}</el-checkbox
        >
        <el-tooltip
          v-model:visible="colorPickerVisible.top100Buy"
          trigger="click"
          :teleported="false"
          :persistent="false"
        >
          <div
            class="w-14px h-14px rounded-2px border-solid border-[--border] cursor-pointer"
            :style="{ background: linesChecked.top100Buy.color }"
          />
          <template #content>
            <el-color-picker-panel v-model="linesChecked.top100Buy.color" />
          </template>
        </el-tooltip>
      </div>
      <div class="flex justify-between">
        <el-checkbox
          v-model="linesChecked.top100Sell.checked"
          class="[&&]:[--el-checkbox-height:16px]"
          >{{ $t('whaleSell') }}</el-checkbox
        >
        <el-tooltip
          v-model:visible="colorPickerVisible.top100Sell"
          trigger="click"
          :teleported="false"
          :persistent="false"
        >
          <div
            class="w-14px h-14px rounded-2px border-solid border-[--border] cursor-pointer"
            :style="{ background: linesChecked.top100Sell.color }"
          />
          <template #content>
            <el-color-picker-panel v-model="linesChecked.top100Sell.color" />
          </template>
        </el-tooltip>
      </div>
    </div>
    <div class="flex justify-between items-center mt-16px">
      {{ $t('clickChartFilter') }}
      <el-switch v-model="globalStore.isClickKlineFilter" class="[&&]:h-20px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  IChartingLibraryWidget,
  ResolutionString,
  Timezone,
  SeriesFormat,
  VisiblePlotsSet,
  LanguageCode,
  ChartingLibraryFeatureset,
  SubscribeBarsCallback,
  LibrarySymbolInfo,
} from '~/types/tradingview/charting_library'
import {
  getTimezone,
  formatDecimals,
  getSwapInfo,
  getAddressAndChainFromId,
  getWSMessage,
} from '@/utils'
import { getKlineHistoryData, getTokenKlineHistory } from '@/api/token'
import { formatNumber } from '@/utils/formatNumber'
import {
  switchResolution,
  formatLang,
  supportSecChains,
  initTradingViewIntervals,
  updateChartBackground,
  buildOrUpdateLastBarFromTx,
  waitForTradingView,
  useLimitPriceLine,
  useAvgPriceLine,
  useBotLimitLine,
  setWatermark,
  useTop100AvgPriceLine,
  useBotAvgPriceLine,
  useKOLAvgPriceLine,
  DEFAULT_LIST,
  SUPPORT_LIST
} from './utils'
import {
  useLocalStorage,
  useElementBounding,
  useWindowSize,
  useEventBus,
  useStorage,
} from '@vueuse/core'
import type { WSTx, KLineBar, SimpleWSTx } from './types'
import BigNumber from 'bignumber.js'
import { useKlineMarks } from './mark'
import { DefaultHeight, WSSimpleTxChain } from '~/utils/constants'
import { TW_STUDY } from './constant'
import UnknownRisk from './unknownRisk.vue'
import DialogRemind from './dialogRemind.vue'
import dayjs from 'dayjs'

const props = defineProps<{
  isRank?: boolean
}>()
const { t } = useI18n()
const klineDateFilter = inject<Ref<string[]>>(ProvideType.KLINE_DATE_FILTER)
const klineMarkerAddress = inject<Ref<string>>(ProvideType.KLINE_MARKER_ADDRESS, ref(''))
const klineFilterTxs = inject<Ref<any[]>>(ProvideType.KLINE_FILTER_TXS, ref([]))
const tokenStore = props.isRank ? useRankKlineStore() : useTokenStore()
const botStore = useBotStore()
const tokenDetailsStore = useTokenDetailsStore()
const globalStore = useGlobalStore()
const localeStore = useLocaleStore()
const route = useRoute()
const walletStore = useWalletStore()
const scrollTop = ref(0)
const wsStore = useWSStore()
const { showMarket, migrated } = storeToRefs(useGlobalStore())
const totalHolders = computed(() => [
  { id: 'trade', name: t('mine') },
  {
    id: '16',
    name: t('insiders'),
  },
  {
    id: '19',
    name: t('sniper2'),
  },
  {
    id: '25',
    name: t('DEV'),
  },
  {
    id: '30',
    name: t('smarter'),
  },
  {
    id: '31',
    name: 'KOL',
  },
  { id: '-100',
    name: t('myWatchlist'),
  },
  { id: '-101',
    name: t('myRemark'),
  },
])
const linesChecked = useLocalStorage('tv_markLines1', {
  buy: {
    checked: true,
    color: '#12B886',
  },
  sell: {
    checked: false,
    color: '#F6465D',
  },
  top100Buy: {
    checked: false,
    color: '#0D6EFD',
  },
  top100Sell: {
    checked: false,
    color: '#FD3E3E',
  },
  kol: {
    checked: false,
    color: '#9CA1A8',
  },
})
const colorPickerVisible = ref({} as Record<string, boolean>)
const token = computed(() => {
  return props.isRank && 'klineRow' in tokenStore
    ? tokenStore.klineRow?.id
    : (route.params.id as string)
})

const klineLineSave = useKlineLineSave(() => token.value)

const klinePair = ref('')

const isReady = ref(false)
let isReadyLine = false
let isHeaderReady = false
const dialogVisible_remind = ref(false)
// const Book = reactive({
//   title: '1111',
//   author: {
//     name:'托儿列夫'
//   },
//   year: 50
// })

// const migrated = ref( null as null | {
//   migrate_time: number
//   migrate_uprice: string
//   showMarket: boolean
//   mcap: number
// })
const chain = computed(() => {
  return getAddressAndChainFromId(token.value)?.chain || tokenStore?.token?.chain || ''
})

const tokenAddress = computed(() => {
  return getAddressAndChainFromId(token.value)?.address || tokenStore?.token?.token
})

const user = computed(() => {
  return (
    botStore.userInfo?.addresses?.find?.((i) => i.chain === chain.value)?.address ||
    botStore?.userInfo?.evmAddress ||
    walletStore?.address
  )
})

const symbol = computed(() => {
  return tokenStore?.token?.symbol || '-'
})

const pair = computed(() => {
  return tokenStore?.pairAddress
})

const amm = computed(() => {
  return tokenStore?.pair?.amm || ''
})

let loading = false

// rAF 批量合并同帧内的 onTick 调用，避免高频 WS 消息导致图表反复重绘
let _pendingBars: KLineBar[] = []
let _rafTickId: number | null = null
function scheduleOnTick(bar: KLineBar | KLineBar[], onTick: (bar: KLineBar) => void) {
  if (Array.isArray(bar)) {
    _pendingBars.push(...bar)
  } else {
    _pendingBars.push(bar)
  }
  if (_rafTickId !== null) return
  _rafTickId = requestAnimationFrame(() => {
    _rafTickId = null
    if (_pendingBars.length) {
      for (const pendingBar of _pendingBars) {
        onTick(pendingBar)
      }
      _pendingBars = []
    }
  })
}

// rAF 批量合并同帧内的 refreshMarks 调用
let _rafMarksId: number | null = null
function scheduleRefreshMarks() {
  if (_rafMarksId !== null) return
  _rafMarksId = requestAnimationFrame(() => {
    _rafMarksId = null
    _widget?.activeChart?.()?.refreshMarks?.()
  })
}

watch(
  () => token.value,
  (val) => {
    if (!val) return

    migrated.value = null
    if (_widget?.activeChart?.()) {
      _widget?.activeChart?.()?.removeAllShapes?.()
      // const chart = _widget?.activeChart?.()
      // // 移除旧指标（保留 Volume）
      // const allStudies = chart.getAllStudies()
      // allStudies.forEach(study => {
      //   if (!study.name.includes('Volume')) {
      //     chart.removeEntity(study.id)
      //   }
      // })
    }
  }
)

watch([pair, () => tokenStore.selectedToken], () => {
  switchTokenKline()
})
watch(
  () => wsStore.wsResult[WSEventType.SWITCH_MAIN_PAIR_V2],
  (val) => {

    if (isReady.value && route.name === 'token-id' && val) {
      const new_main_pair_data = val.new_main_pair_data
        if(new_main_pair_data.target_token == tokenAddress.value){
          const migrate_uprice = new_main_pair_data.target_token == new_main_pair_data.token0_address ? new_main_pair_data?.token0_price_usd : new_main_pair_data?.token1_price_usd
          if (new_main_pair_data?.blocktime) {
            migrated.value = {
              migrate_time: new_main_pair_data?.blocktime,
              migrate_uprice: migrate_uprice,
              showMarket: showMarket.value,
              mcap: new BigNumber(migrate_uprice || 0).times(tokenStore?.token?.total || 0).toNumber(),
            }
            setTimeout(() => {
              onMarkChanged(true)
            }, 500)
          }
        }
    }
  }
)
// watch(
//   () => tokenStore.selectedToken,
//   () => {
//     switchTokenKline()
//   }
// )

function switchTokenKline() {
  isReadyLine = false
  const val = pair.value
  if (isReady.value && route.name === 'token-id') {
    lastBar = null
    lastPairPrice = 0
    resetMarkRefreshState()
    clearMarkCaches()
    // 清空待处理的 bars 和取消 rAF
    if (_rafTickId !== null) {
      cancelAnimationFrame(_rafTickId)
      _rafTickId = null
    }
    _pendingBars = []

    resetLimitPriceLineId()
    // resetAvgPriceLineId()
    resetTop100AvgPriceLineId()
    resetBotAvgLineId()
    resetKOLLine()
    const isSupportSecChains = (chain.value && supportSecChains.includes(chain.value)) || false
    resolution.value = initTradingViewIntervals(resolution.value, chain.value, isSupportSecChains)
    if (_widget && _widget?.activeChart?.()) {
      _widget?.resetCache?.()
      _widget?.activeChart?.()?.clearMarks?.()
      _widget?.setSymbol?.(
        symbol.value + '---' + token.value + val + (tokenStore.selectedToken ? '1' : '0'),
        resolution.value as ResolutionString,
        () => {
          // createHeaderButton()
          klineLineSave.loadKlineLine(_widget)
          setTimeout(() => {
            isReadyLine = true
          }, 100)
        }
      )
    } else {
      initChart()
    }
  }
}

watch(user, () => {
  if (isReady.value && route.name === 'token-id') {
    _widget?.activeChart?.()?.clearMarks?.()
    _widget?.activeChart?.()?.refreshMarks?.()
  }
})

// 当地址筛选变化时，刷新 K 线打点
watch(klineMarkerAddress, () => {
  if (isReady.value && route.name === 'token-id') {
    _widget?.activeChart?.()?.clearMarks?.()
    _widget?.activeChart?.()?.refreshMarks?.()
  }
})

// 当筛选地址的交易列表更新时，清除旧打点并刷新 K 线打点
watch(klineFilterTxs, () => {
  if (isReady.value && route.name === 'token-id' && klineMarkerAddress.value) {
    _widget?.activeChart?.()?.clearMarks?.()
    _widget?.activeChart?.()?.refreshMarks?.()
  }
})

watch(()=>localeStore.locale,()=>{
  if (isReady.value && route.name === 'token-id') {
    console.log('localeStore.locale', localeStore.locale)
    _widget?.activeChart?.()?.clearMarks?.()
    _widget?.activeChart?.()?.refreshMarks?.()
  }
})

const price = 0

// const marks = shallowRef([{ id: 'trade', name: '我的' }])

let lastBar: null | {
  close: number
  high: number
  low: number
  open: number
  time: number
  volume: number
} = null

let lastPairPrice = 0

// const LLJEFFY_#_240
const listenerGuidMap = new Map()
const resolution = useLocalStorage('tv_resolution_token', '15')
const themeStore = useThemeStore()
let _widget: null | IChartingLibraryWidget = null

// 切换主题
watch(
  () => themeStore.theme,
  (val) => {
    if (_widget) {
      _widget?.changeTheme(val).then(() => {
        setIframeCssVar()
        _widget?.applyOverrides?.({
          'scalesProperties.textColor': themeStore.isDark ? '#d5d5d5' : '#333',
          'paneProperties.backgroundType': 'solid',
          'paneProperties.background': getCssVariable('--secondary-bg'),
        })
      })
    }
  }
)

// 切换语言
watch(
  () => localeStore.locale,
  () => {
    resetChart()
  }
)

// const documentVisible = inject<Ref<boolean>>('documentVisible') as Ref<boolean>

// watch(documentVisible, (val) => {
//   if (val && _widget) {
//     _widget?.resetCache?.()
//     _widget?.activeChart?.().resetData?.()
//   }
// })
function resetChart() {
  isReadyLine = false
  isHeaderReady = false
  lastBar = null
  lastPairPrice = 0
  resetLimitPriceLineId()
  resetBotAvgLineId()
  resetKOLLine()
  resetTop100AvgPriceLineId()
  // resetAvgPriceLineId()
  _widget?.remove?.()
  initChart()
}

function saveStudy() {
  if (_widget?.activeChart?.()) {
    let studies = _widget?.activeChart?.()?.getAllStudies?.() || []
    studies = studies.filter(
      (item, index) => studies.findIndex((i) => i.name === item.name) === index
    )
    localStorage.setItem(TW_STUDY, JSON.stringify(studies.filter((i) => i.name !== 'Volume')))
  }
}

// 创建指标
function createStudy() {
  if (_widget?.activeChart?.()) {
    let studies: Array<{ name: string; id: string }> = JSON.parse(localStorage?.[TW_STUDY] || '[]')
    studies = studies.filter(
      (item, index) => studies.findIndex((i) => i.name === item.name) === index
    )
    studies.forEach((i) => {
      _widget?.activeChart?.().createStudy(i.name, false, false)
    })
    // if (localStorage['tradingview.chart.favoriteLibraryIndicators']) {
    //   let indicators: Array<string> = JSON.parse(localStorage['tradingview.chart.favoriteLibraryIndicators'])
    //   indicators = indicators.filter((item) => !studies.some?.(i => i.name === item))
    //   indicators.forEach(i => {
    //     _widget?.activeChart?.().createStudy(i, false, false)
    //   })
    // }
    // this.createPositionPriceLine()
    // this.createMigratePriceLine()
  }
}

let headerBtns: HTMLElement[] = []
function createHeaderButton() {
  if (!isHeaderReady) {
    return
  }
  headerBtns.forEach((i) => {
    _widget?.removeButton?.(i)
  })
  headerBtns = []
  createToggleButton()
  createTogglePriceWarningButton()
  createResetBtn()
  // createMarkButton(_widget, headerBtns)
  createDisplayButton(_widget, headerBtns)
}

// 创建 市值/价格 切换按钮
function createToggleButton() {
  const btn = _widget?.createButton()
  if (!btn) return

  const updateButtonContent = () => {
    const isShowMarket = showMarket.value
    btn.innerHTML = `
        <span style="font-size: 12px; cursor: pointer;">
          ${isShowMarket ? `${t('price')} / <span style="color:#286DFF">${t('mcap')}</span>` : `<span style="color:#286DFF">${t('price')}</span> / ${t('mcap')}`}
        </span>`
  }

  btn.onclick = () => {
    showMarket.value = !showMarket.value

    updateButtonContent()
    // resetChart()
    _widget?.resetCache?.()

    _widget?.activeChart?.()?.resetData?.()
    setTimeout(() => {
      _widget?.activeChart?.()?.executeActionById?.('chartReset')
    }, 300)

  }
  updateButtonContent()
  headerBtns.push(btn)
}
// 创建价格提醒按钮
function createTogglePriceWarningButton() {
  const btn = _widget?.createButton({ align: 'right', useTradingViewStyle: false })
  if (!btn) return

  const updateButtonContent = () => {
    btn.innerHTML =
      '<div style="display: flex;align-items: center;cursor:pointer;padding: 7px 0px 7px 0;border-radius: 6px;" onMouseOver="this.style.background=\'none\'"  onMouseLeave="this.style.background=\'none\'"><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.4 12.1429H16V13.7619H0V12.1429H1.6V6.47619C1.6 4.7586 2.27428 3.11135 3.47452 1.89683C4.67475 0.682311 6.30261 0 8 0C9.69739 0 11.3253 0.682311 12.5255 1.89683C13.7257 3.11135 14.4 4.7586 14.4 6.47619V12.1429ZM12.8 12.1429V6.47619C12.8 5.188 12.2943 3.95256 11.3941 3.04167C10.4939 2.13078 9.27304 1.61905 8 1.61905C6.72696 1.61905 5.50606 2.13078 4.60589 3.04167C3.70571 3.95256 3.2 5.188 3.2 6.47619V12.1429H12.8ZM5.6 15.381H10.4V17H5.6V15.381Z" fill="#9CA1A8"/></svg></div>'
  }

  btn.onclick = () => {
    dialogVisible_remind.value = !dialogVisible_remind.value
    // resetChart()
    _widget?.resetCache?.()
    _widget?.activeChart?.().resetData?.()
  }
  updateButtonContent()
  headerBtns.push(btn)
}

function createResetBtn() {
  const btn = _widget?.createButton({ align: 'right', useTradingViewStyle: false })
  if (!btn) return
  btn.innerHTML = `<div style="cursor:pointer"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.7704 1.94641C4.22205 0.688536 6.07919 -0.00267189 8 7.76212e-06C12.4184 7.76212e-06 16 3.5816 16 8C16 9.7088 15.464 11.2928 14.552 12.592L12 8H14.4C14.4001 6.7453 14.0314 5.51825 13.3397 4.47141C12.6481 3.42457 11.6639 2.60413 10.5097 2.1121C9.35554 1.62008 8.08217 1.47817 6.84797 1.70402C5.61376 1.92987 4.47316 2.51352 3.568 3.3824L2.7704 1.94641ZM13.2296 14.0536C11.778 15.3115 9.92081 16.0027 8 16C3.5816 16 0 12.4184 0 8C0 6.2912 0.536 4.7072 1.448 3.408L4 8H1.6C1.5999 9.2547 1.9686 10.4818 2.66027 11.5286C3.35194 12.5754 4.33605 13.3959 5.49026 13.8879C6.64446 14.3799 7.91783 14.5218 9.15203 14.296C10.3862 14.0701 11.5268 13.4865 12.432 12.6176L13.2296 14.0536Z" fill="#9CA1A8"/>
</svg>
</div>`
  btn.onclick = () => {
    kHeight.value = DefaultHeight.KLINE
    _widget?.resetCache?.()
    _widget?.activeChart?.().resetData?.()
  }
  headerBtns.push(btn)
}

const {
  getMarks,
  marksTabs,
  markTabsChecked,
  wsTxUpdateMarks,
  profilingMarksCache,
  profilingLiveCache,
  createDisplayButton,
  markTabsVisible,
  wsPublicPortraitUpdateMarks,
  scheduleMyPortraitRefresh,
  allowImmediateMyPortraitFetch,
  schedulePortraitCacheRefresh,
  clearMarkCaches,
  cancelMyPortraitRefresh,
  resetMarkRefreshState
} = useKlineMarks()

watch(marksTabs, () => {
  _createHeaderButton()
})

watch(markTabsVisible, (val) => {
  if (val) {
    _widget?.activeChart?.()?.refreshMarks?.()
  } else {
    _widget?.activeChart?.()?.clearMarks?.()
  }
})

let retryCount = 0
function _createHeaderButton() {
  if (!isReady.value) {
    if (retryCount > 3) {
      return
    }
    setTimeout(() => {
      retryCount++
      _createHeaderButton()
    }, 500)
  } else {
    retryCount = 0
    createHeaderButton()
  }
}
// 提前拦截 K线 数据 没有更多
let noData = false
let firstBarTime = 0

async function initChart() {
  const symbolUp = symbol.value?.toUpperCase?.() || '-'
  // const widget = (window as any).TradingView.widget as ChartingLibraryWidgetConstructor
  // console.log('widget', window.TradingView)
  const isSupportSecChains = (chain.value && supportSecChains.includes(chain.value)) || false
  // 初始化 resolutions
  resolution.value = initTradingViewIntervals(resolution.value, chain.value, isSupportSecChains)
  const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
  const widget = await waitForTradingView()
  _widget = new widget({
    symbol: symbolUp.replace('<', '＜') || ' ',
    debug: false,
    width: '100%' as any,
    height: '100%' as any,
    interval: resolution.value as any,
    theme: themeStore.theme,
    container: 'tv_chart_container',
    library_path: `${urlPrefix}charting_library-29.4.0/charting_library/`,
    locale: formatLang(localeStore.locale) as LanguageCode,
    disabled_features: [
      'header_symbol_search',
      // 'header_fullscreen_button',
      'header_screenshot',
      'header_compare',
      'volume_force_overlay',
      'header_undo_redo',
      'header_settings',
      'header_saveload',
      'timeframes_toolbar',
      'symbol_search_hot_key',
      'show_interval_dialog_on_key_press',
      'header_quick_search',
    ],
    enabled_features: [
      'request_only_visible_range_on_reset',
      'seconds_resolution' as ChartingLibraryFeatureset,
      'saveload_separate_drawings_storage'
    ],
    auto_save_delay: 1,
    charts_storage_url: location.host,
    charts_storage_api_version: '1.1',
    timezone: getTimezone() as Timezone,
    time_frames: [],
    loading_screen: {
      backgroundColor: themeStore.isDark ? '#0B0D12' : '#F6F9FF',
      foregroundColor: '#3F80F7',
    },
    custom_css_url: `${location.origin}/tv_custom_1.css`,
    // format: (showMarket.value ? 'volume' : 'price') as SeriesFormat,
    custom_formatters: {
      priceFormatterFactory: () => {
        return {
          format: (price) => {
            if (showMarket.value) {
              return formatNumber(price, {
                decimals: 2,
                locale: 'en',
              })
            }
            return String(
              formatNumber(price, {
                decimals: 4,
                limit: 6,
                locale: 'en',
              })
            )
          },
        }
      },
    },
    overrides: {
      volumePaneSize: 'small',
      'paneProperties.topMargin': '10',
      // "scalesProperties.lineColor": '#333',
      'scalesProperties.textColor': themeStore.isDark ? '#d5d5d5' : '#333',
      'paneProperties.backgroundType': 'solid',
      // --d-0B0D12-l-F6F9FF
      'paneProperties.background': themeStore.isDark ? '#0B0D12' : '#F6F9FF',
      'paneProperties.vertGridProperties.style': 2,
      // "paneProperties.vertGridProperties.color": style.grid,
      // "paneProperties.horzGridProperties.style": 2,
      // "paneProperties.horzGridProperties.color": style.grid,
      // "paneProperties.crossHairProperties.color": style.cross,
      'paneProperties.legendProperties.showLegend': false,
      'paneProperties.legendProperties.showStudyArguments': true,
      'paneProperties.legendProperties.showStudyTitles': true,
      'paneProperties.legendProperties.showStudyValues': true,
      'paneProperties.legendProperties.showSeriesTitle': true,
      'paneProperties.legendProperties.showSeriesOHLC': true,
      // "mainSeriesProperties.candleStyle.upColor": style.up,
      // "mainSeriesProperties.candleStyle.downColor": style.down,
      'mainSeriesProperties.candleStyle.drawWick': true,
      'mainSeriesProperties.candleStyle.drawBorder': true,
      // "mainSeriesProperties.candleStyle.borderColor": style.border,
      // "mainSeriesProperties.candleStyle.borderUpColor": style.up,
      // "mainSeriesProperties.candleStyle.borderDownColor": style.down,
      // "mainSeriesProperties.candleStyle.wickUpColor": style.up,
      // "mainSeriesProperties.candleStyle.wickDownColor": style.down,
      'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
      // "mainSeriesProperties.hollowCandleStyle.upColor": style.up,
      // "mainSeriesProperties.hollowCandleStyle.downColor": style.down,
      'mainSeriesProperties.hollowCandleStyle.drawWick': true,
      'mainSeriesProperties.hollowCandleStyle.drawBorder': true,
      // "mainSeriesProperties.hollowCandleStyle.borderColor": style.border,
      // "mainSeriesProperties.hollowCandleStyle.borderUpColor": style.up,
      // "mainSeriesProperties.hollowCandleStyle.borderDownColor": style.down,
      // "mainSeriesProperties.hollowCandleStyle.wickColor": style.line,
      // "mainSeriesProperties.haStyle.upColor": style.up,
      // "mainSeriesProperties.haStyle.downColor": style.down,
      'mainSeriesProperties.haStyle.drawWick': true,
      'mainSeriesProperties.haStyle.drawBorder': true,
      // "mainSeriesProperties.haStyle.borderColor": style.border,
      // "mainSeriesProperties.haStyle.borderUpColor": style.up,
      // "mainSeriesProperties.haStyle.borderDownColor": style.down,
      // "mainSeriesProperties.haStyle.wickColor": style.border,
      'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
      // "mainSeriesProperties.barStyle.upColor": style.up,
      // "mainSeriesProperties.barStyle.downColor": style.down,
      'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
      'mainSeriesProperties.barStyle.dontDrawOpen': false,
      // "mainSeriesProperties.lineStyle.color": style.border,
      'mainSeriesProperties.lineStyle.linewidth': 2,
      'mainSeriesProperties.lineStyle.priceSource': 'close',
      // "mainSeriesProperties.areaStyle.color1": style.areatop,
      // "mainSeriesProperties.areaStyle.color2": style.areadown,
      // "mainSeriesProperties.areaStyle.linecolor": style.border,
      'mainSeriesProperties.areaStyle.linewidth': 2,
      'mainSeriesProperties.areaStyle.priceSource': 'close',
      // 'linetoolhorzline.showLabel': true,
      // 'linetoolhorzline.horzLabelsAlign': 'right',
      // 'linetoolhorzline.vertLabelsAlign': 'bottom',
    },
    datafeed: {
      onReady: (callback) => {
        // const chain = props.chain
        // const isSupportSecChains = chain.value && supportSecChains.includes(chain.value)
        const configurationData = {
          // supported_resolutions: isSupportSecChains ? SUPPORT_LIST as ResolutionString[]: DEFAULT_LIST as ResolutionString[],
          supported_resolutions: SUPPORT_LIST as ResolutionString[],
          supports_marks: true,
          supports_timescale_marks: true,
          supports_time: true,
        }
        setIframeCssVar()


        setTimeout(() => callback(configurationData), 50)
      },
      resolveSymbol: (symbolName, onResolve, onError) => {
        try {
          // const { chain, symbol, price, amm } = props
          const isSupportSecChains = !!(chain.value && supportSecChains?.includes?.(chain.value))
          const symbolUp = symbol.value?.toUpperCase?.() || tokenStore?.token?.symbol || '-'
          const p = Number(price || tokenStore?.price) || 0
          const symbolInfo: LibrarySymbolInfo = {
            // symbol: symbolUp,
            name: symbolUp,
            ticker: symbolUp,
            description: symbolUp?.split?.('---')?.[0] || '',
            exchange: 'Ave.ai',
            timezone: getTimezone() as Timezone,
            format: (showMarket.value ? 'volume' : 'price') as SeriesFormat,
            minmov: 1, // 最小波动
            minmove2: 0, // 格式化复杂情况下的价格 如价格增量
            pricescale: p > 0 ? 10 ** formatDecimals(p).precision : 10000000000,
            volume_precision: 2, // 小数位
            fractional: false, // 分数显示价格,1 - xx'yy（例如，133'21)或 2 - xx'yy'zz （例如，133'21'5）
            session: '24x7',
            has_intraday: true, // 显示商品是否具有日内（分钟）历史数据
            intraday_multipliers: ['1', '5', '15', '30', '60', '120', '240'] as ResolutionString[],
            has_seconds: true,
            seconds_multipliers: ['1', '5', '15', '30'],
            has_daily: true,
            // has_no_volume: false, // 布尔表示商品是否拥有成交量数据
            has_weekly_and_monthly: true,
            supported_resolutions: isSupportSecChains ? SUPPORT_LIST as ResolutionString[]: DEFAULT_LIST as ResolutionString[], // 在这个商品的周期选择器中启用一个周期数组。 数组的每个项目都是字符串。
            data_status: 'streaming' as 'streaming' | 'endofday' | 'delayed_streaming',
            visible_plots_set: 'ohlcv' as VisiblePlotsSet,
            type: 'crypto',
            listed_exchange: getSwapInfo?.(chain.value || '', amm.value)?.show_name || '',
          }
          console.log('[resolveSymbol]: Symbol resolved', symbolInfo)
          setTimeout(() => onResolve(symbolInfo), 0)
        } catch (err) {
          onError(err?.toString?.() || 'resolveSymbol err')
        }
      },
      getBars: (symbolInfo, resolution, periodParams, onResult, onError) => {
        const { from, to, firstDataRequest } = periodParams
        // console.log('[getBars]: Method call', symbolInfo, resolution, from, to, firstDataRequest)
        try {
          if (firstDataRequest) {
            noData = false
            lastBar = null
            lastPairPrice = 0
          } else {
            if (noData) {
              onResult([], { noData: true })
              return
            }
          }
          const interval = switchResolution(resolution)
          const params: any = {
            interval: interval,
            // pair_id: pair.value + '-' + chain.value,
            token_id: token.value,
            from,
            to: firstDataRequest ? 0 : Math.max(to, firstBarTime || 0),
          }

          const isTokenKline =
            !props.isRank &&
            'tokenAllPair' in tokenStore &&
            tokenStore?.tokenAllPair &&
            tokenStore?.selectedToken ||
            (firstDataRequest && tokenStore?.selectedToken)
          if (!isTokenKline) {
            params.pair_id = pair.value + '-' + chain.value
            delete params.token_id
          }
          loading = true
          const getKlineFunc = isTokenKline ? getTokenKlineHistory : getKlineHistoryData
          const requestToken = token.value
          getKlineFunc(params)
            .then((res) => {
              // 防止旧请求覆盖新 token 的 migrated（快速切换时的竞态）
              if (token.value !== requestToken) return
              if (res?.extra_data?.migrate_time && res?.extra_data?.migrate_uprice) {
                migrated.value = {
                  migrate_time: new Date(res.extra_data.migrate_time).getTime() / 1000,
                  migrate_uprice: res.extra_data.migrate_uprice,
                  showMarket: showMarket.value,
                  mcap: new BigNumber(res.extra_data.migrate_uprice || 0).times(tokenStore?.token?.total || 0).toNumber(),
                }
              } else {
                // 新 token 无迁移数据，显式清空防止残留旧值
                migrated.value = null
              }
              const bars1 = res?.kline_data || []
              const bars =
                bars1?.map?.((i) => ({
                  time: i.time * 1000,
                  open: showMarket.value
                    ? new BigNumber(i.open || 0).times(tokenStore?.circulation || 0).toNumber()
                    : i.open,
                  high: showMarket.value
                    ? new BigNumber(i.high || 0).times(tokenStore?.circulation || 0).toNumber()
                    : i.high,
                  low: showMarket.value
                    ? new BigNumber(i.low || 0).times(tokenStore?.circulation || 0).toNumber()
                    : i.low,
                  close: showMarket.value
                    ? new BigNumber(i.close || 0).times(tokenStore?.circulation || 0).toNumber()
                    : i.close,
                  volume: i.volume,
                })) || []
              klinePair.value = res?.pair || ''
              if (firstDataRequest) {
                lastBar = bars1?.[bars1?.length - 1] || null
                lastPairPrice = Number(lastBar?.close || 0)
                if (lastBar) {
                  lastBar.time = lastBar.time * 1000
                }
                noData = bars?.length < 100
              }
              if (bars1?.length > 0) {
                firstBarTime = bars1?.[0]?.time || 0
              }
              onResult(bars, { noData: !bars?.length })

              setTimeout(() => {
                useEventBus('klineDataReady').emit()
              }, 10)
            })
            .finally(() => {
              loading = false
            })
          // if (firstDataRequest) {
          //   getKlineHistoryData(params).then(res => {
          //     console.log('getKlineHistoryData', res)
          //     const bars = res?.kline_data?.map?.(i => ({
          //       time: i.time * 1000,
          //       open: showMarket.value ? new BigNumber(i.open || 0).times(tokenStore?.circulation || 0).toNumber() : i.open,
          //       high: showMarket.value ? new BigNumber(i.high || 0).times(tokenStore?.circulation || 0).toNumber() : i.high,
          //       low: showMarket.value ? new BigNumber(i.low || 0).times(tokenStore?.circulation || 0).toNumber() : i.low,
          //       close: showMarket.value ? new BigNumber(i.close || 0).times(tokenStore?.circulation || 0).toNumber() : i.close,
          //       volume: i.volume,
          //     })) || []
          //     console.log('onResult', bars)
          //     lastBar = bars?.[bars?.length - 1] || null
          //     onResult(bars, {noData: bars?.length === 0})
          //   })
          // } else {
          //   onResult([], { noData: true })
          // }
        } catch (err) {
          console.log('[getBars]: Get error', err)
          onError(err?.toString?.() || 'getBars err')
        }
      },
      subscribeBars: (
        symbolInfo,
        resolution,
        onTick,
        listenerGuid /*onResetCacheNeededCallback*/
      ) => {
        console.log('listenerGuid', listenerGuid)
        if (listenerGuidMap.has(token.value)) {
          onWsKline(resolution, onTick)
          return
        }
        const { address, chain } = getAddressAndChainFromId(token.value)
        let params: [string, string | { tks: { ch: string; tk: string }[]; rt: string }, string?] =
          ['multi_tx', address, chain]
        if (WSSimpleTxChain.includes(chain)) {
          params = [
            'simple_tx',
            {
              tks: [
                {
                  ch: chain,
                  tk: address,
                },
              ],
              rt: 'json',
            },
          ]
        }

        const data = {
          jsonrpc: '2.0',
          method: 'subscribe',
          params: params,
          id: 1,
        }
        const ws = wsStore.send(data)
        onWsKline(resolution, onTick, ws)
        listenerGuidMap.set(token.value, data)
      },
      unsubscribeBars: (listenerGuid) => {
        if (listenerGuid) {
          const subscribeParams = listenerGuidMap.get(token.value) || {}
          if (subscribeParams?.params?.[1] === tokenAddress.value) {
            return
          }
          listenerGuidMap.forEach((i) => {
            if (i?.params?.[1] !== tokenAddress.value) {
              wsStore.send({
                ...i,
                method: 'unsubscribe',
              })
            }
          })
          listenerGuidMap?.clear()
        }
      },
      searchSymbols: (userInput, exchange, symbolType, onResult) => {
        console.log(userInput, exchange, symbolType, onResult)
      },
      getMarks: (symbolInfo, from, to, onDataCallback, resolution) => {
        console.log(
          `[getMarks] ${symbolInfo.name} from ${from} to ${to}, resolution: ${resolution}`
        )
        const interval = switchResolution(resolution)
        getMarks({
          from,
          to: to,
          interval,
          pair: pair.value,
          token: token.value,
          chain: chain.value || '',
          user: user.value,
          onDataCallback,
          migrated: migrated.value,
        })
        // getUserKlineTxTags({
        //   from,
        //   to,
        //   interval,
        //   pair: pair.value + '-' + chain.value,
        //   token_address: token.value,
        //   user_address: user.value
        // }).then(res => {
        //   console.log('getUserKlineTxTags', res)
        //   const marks = formatToMarks(res, interval)
        //   onDataCallback(marks || [])
        // })
      },
    },
  })
  updateChartBackground()

  _widget.onChartReady(() => {
    isReady.value = true
    isReadyLine = true
    if (themeStore.isDark) {
      _widget?.applyOverrides?.({ 'scalesProperties.textColor': '#d5d5d5' })
    } else {
      _widget?.applyOverrides?.({ 'scalesProperties.textColor': '#333' })
    }
    _widget
      ?.activeChart?.()
      ?.onIntervalChanged()
      .subscribe(null, (interval) => {
        if (resolution.value !== interval) {
          resolution.value = interval
          localStorage.setItem('tv_resolution', interval)
          lastBar = null
          lastPairPrice = 0
          cancelMyPortraitRefresh()
          clearMarkCaches()
          // 清空待处理的 bars 和取消 rAF
          if (_rafTickId !== null) {
            cancelAnimationFrame(_rafTickId)
            _rafTickId = null
          }
          _pendingBars = []
          _widget?.resetCache?.()
        }
      })

    setWatermark(_widget)
    subscribePriceMove()
    // 从缓存中读取数据并创建指标
    // createStudy()
    _widget?.applyOverrides?.({
      'scalesProperties.textColor': themeStore.isDark ? '#d5d5d5' : '#333',
      'paneProperties.backgroundType': 'solid',
      'paneProperties.background': getCssVariable('--secondary-bg'),
    })

    klineLineSave.loadKlineLine(_widget)
    klineLineSave.saveKlineState(_widget)
  })

  _widget?.headerReady().then(() => {
    // 创建 市值/价格 切换按钮
    isHeaderReady = true
    createHeaderButton()
  })

  // onMarkClick
  _widget?.subscribe('onMarkClick', (markId) => {
    const { token, symbol, logo_url, chain } = tokenStore.tokenInfo?.token || {}
    const { target_token, token0_address, token0_symbol, token1_symbol, pair } =
      tokenStore.pair || {}

    let user_address = user.value
    const getProfilingMarkId = (txTime: number, side: 'buy' | 'sell', type: string, walletAddress: string, txid?: string) => {
      if (txid) {
        return `${txTime}-${side}-${type}-${txid}`
      }
      if (type === '-100' || type === '-101') {
        return `${txTime}-${side}-${walletAddress}`
      }
      return `${txTime}-${side}-${type}`
    }
    const allProfilingCaches = [...profilingMarksCache, ...profilingLiveCache]
    for (const [, markArr] of allProfilingCaches) {
      const flag = markArr.some(({type,holders})=>{
        return holders.some(hol=>{
          if(hol.buy && markId === getProfilingMarkId(hol.buy.tx_time, 'buy', type, hol.wallet_address, hol.buy.txid)){
            user_address = hol.wallet_address
            return true
          }
          if(hol.sell && markId === getProfilingMarkId(hol.sell.tx_time, 'sell', type, hol.wallet_address, hol.sell.txid)){
            user_address = hol.wallet_address
            return true
          }
        })
      })
      if(flag){
        break
      }
    }

    const $patchParams = {
      drawerVisible: true,
      tokenInfo: {
        id: route.params.id as string,
        symbol,
        logo_url,
        chain,
        address: token,
      },
      pairInfo: {
        target_token,
        token0_address,
        token0_symbol,
        token1_symbol,
        pairAddress: pair,
      },
      user_address,
    }
    tokenDetailsStore.$patch($patchParams)
  })

  let mouseDownTime = 0
  _widget.subscribe('mouse_down', () => {
    mouseDownTime = performance.now()
  })

  _widget.subscribe('mouse_up', (e) => {
    if (performance.now() - mouseDownTime >= 200) {
      return
    }
    const startTime = _widget
      ?.activeChart?.()
      ?.getTimeScale?.()
      .coordinateToTime(e.clientX - 56)
    if (startTime && resolution.value) {
      // 获取 tradingview 时间周期
      const dayjsParams = resolutionMap[resolution.value as keyof typeof resolutionMap] || {
        val: resolution.value,
        unit: 'm',
      }
      const endTime = dayjs(startTime * 1000)
        .add(dayjsParams.val, dayjsParams.unit)
        .unix()
      if (globalStore.isClickKlineFilter && klineDateFilter?.value) {
        klineDateFilter.value = [String(startTime), String(endTime)]
      }
    }
  })

  subscribeStudyEvent()
}

let isUnload = false
function subscribeStudyEvent() {
  _widget?.subscribe('study_event', (_id, type) => {
    if ((type === 'create' || type === 'remove') && !isUnload) {
      saveStudy()
    }
  })
  window.onbeforeunload = () => {
    isUnload = true
  }
}

function onWsKline(
  resolution: string,
  onTick: SubscribeBarsCallback,
  ws = wsStore.getWSInstance()
) {
  ws?.onmessage((e) => {
    const msg = getWSMessage(e)
    if (!msg) {
      return
    }
    const { event, data } = msg
    if (event === WSEventType.SIMPLE_TX || event === WSEventType.TX) {
      const tx: SimpleWSTx | WSTx = data?.msg || data?.tx
      const interval = switchResolution(resolution)
      const t = getAddressAndChainFromId(token.value)?.address
      let target = ''
      if ('target' in tx) {
        target = tx.target
      } else {
        target = [tx.from_address, tx.to_address].find((i) => i === t) || ''
      }
      if (target === t && !loading) {
        const _pair = 'pair' in tx ? tx.pair : tx.pair_address
        const pair1 = tokenStore.selectedToken ? tokenStore.tokenInfo?.pairs?.[0]?.pair : tokenStore?.pairAddress
        const _price =
          'price_u' in tx
            ? Number(tx.price_u || 0)
            : Number(
                tx.from_address?.toLowerCase?.() === tokenStore.token?.token?.toLowerCase?.()
                  ? tx.from_price_usd
                  : tx.to_price_usd
              ) || 0
        if (_pair === pair1) {
          lastPairPrice = _price
        }
        if (tx?.tag === 'PairNoiseTx' || tx?.tag === 'TokenNoiseTx') {
          return
        }
        if (_pair !== pair1) {
          const price = _price
          if (!props.isRank && 'pairs' in tokenStore) {
            const currentPairInfo = tokenStore?.pairs?.find((i) => i.pair === pair.value)
            if (currentPairInfo && !Number(currentPairInfo?.reserve0) && !Number(currentPairInfo?.reserve1)) {
              return
            }
          }
          if (lastPairPrice && Math.abs(price - lastPairPrice) > lastPairPrice * 0.35) {
            return
          }
        }
        tokenStore.tokenPrice = _price
        const newBar1 = buildOrUpdateLastBarFromTx(tx, t, lastBar, interval)
        if (newBar1) {
          lastBar = { ...newBar1 }
          let newBar = { ...newBar1 } as KLineBar

          if (showMarket.value && newBar) {
            newBar.open = new BigNumber(newBar.open || 0)
              .times(tokenStore?.circulation || 0)
              .toNumber()
            newBar.high = new BigNumber(newBar.high || 0)
              .times(tokenStore?.circulation || 0)
              .toNumber()
            newBar.low = new BigNumber(newBar.low || 0).times(tokenStore?.circulation || 0).toNumber()
            newBar.close = new BigNumber(newBar.close || 0)
              .times(tokenStore?.circulation || 0)
              .toNumber()
          }

          if (newBar && newBar?.time) {
            scheduleOnTick(newBar, onTick)
          }
        }
      }
      wsTxUpdateMarks(
        {
          tx,
          interval: Number(interval),
          user: user.value,
        },
        _widget
      )
      scheduleMyPortraitRefresh({
        pair: pair.value,
        chain: chain.value || '',
        user: user.value,
        widget: _widget,
      })
    } else if (event === WSEventType.PUBLIC_PORTRAIT) {
      const marksTabsIds = marksTabs.value.map((v) => v.id)
      const remarksStore = useRemarksStore()
      const matchPortraitType = (item: { maker_type?: string; remark?: string; wallet_address?: string }, typeId: string) => {
        const makerTypes = String(item?.maker_type || '').split(',').filter(Boolean)
        if (typeId === '-101') {
          const chain = tokenStore?.token?.chain || ''
          return !!(item?.remark?.trim() || (item?.wallet_address && chain && remarksStore.getRemarkByAddress({ address: item.wallet_address, chain })))
        }
        if (typeId === '-100') {
          return makerTypes.includes('-100')
        }
        return makerTypes.includes(typeId)
      }
      const msgArr = (data?.msg || [])?.filter?.(el=>{
        return marksTabsIds.some(id => matchPortraitType(el, id))
      })
      if(msgArr.length === 0){
        return
      }
       const interval = switchResolution(resolution)
      wsPublicPortraitUpdateMarks(msgArr, _widget, {
        interval: Number(interval),
        user: user.value
      })
      schedulePortraitCacheRefresh(_widget)
    }
  }, 'kline')
}

// 拖动缩放
let isMask = false
const kHeight = useStorage('kHeight', DefaultHeight.KLINE)
const wHeight = useWindowSize().height
const dom = useTemplateRef('kline')
function drag(e: MouseEvent) {
  let dy = e.clientY
  isMask = true
  // const dom = document.querySelector('#k-line-chart-container')
  if (!dom) {
    return
  }
  const { height } = useElementBounding(dom)
  kHeight.value = height.value
  document.onmousemove = (e) => {
    if (!isMask) {
      return
    }
    if (e.clientY > wHeight.value) {
      isMask = false
      return
    }
    document.getElementById('tv_chart_container')!.style.pointerEvents = 'none'
    const _kHeight =
      e.clientY < dy ? kHeight.value - (dy - e.clientY) : kHeight.value + e.clientY - dy

    if (_kHeight <= wHeight.value - 164) {
      kHeight.value = _kHeight
    }
    dy = e.clientY
  }
  document.onmouseup = () => {
    document.getElementById('tv_chart_container')!.style.pointerEvents = 'auto'
    isMask = false
    document.onmousemove = null
    document.onmouseup = null
    if (tokenStore?.centerTopHeight) {
      tokenStore.centerTopHeight = kHeight.value
    }
  }
  // e.stopPropagation()
  // e.preventDefault()
  return false
}

const { resetLimitPriceLineId, subscribePriceMove } = useLimitPriceLine(
  () => _widget,
  () => isReadyLine,
  showMarket
)

// const { resetAvgPriceLineId } = useAvgPriceLine(
//   () => _widget,
//   () => isReadyLine,
//   showMarket
// )
const { resetAvgPriceLineId: resetTop100AvgPriceLineId } = useTop100AvgPriceLine(
  () => _widget,
  () => isReadyLine,
  showMarket,
  linesChecked
)
useBotLimitLine(
  () => _widget,
  () => isReadyLine,
  showMarket
)
const { resetBotAvgLineId } = useBotAvgPriceLine(
  () => _widget,
  () => isReadyLine,
  showMarket,
  linesChecked
)
const { resetKOLLine } = useKOLAvgPriceLine(
  () => _widget,
  () => isReadyLine,
  showMarket,
  linesChecked,
  (endTime,scaleRatio = 20) => {
    const params = resolutionMap[resolution.value as keyof typeof resolutionMap] || {
      val: resolution.value,
      unit: 'm',
    }
    return dayjs(endTime * 1000).subtract(params.val * scaleRatio, params.unit).unix()
  }
)

function setIframeCssVar() {
  requestAnimationFrame(() => {
    const iframe = document.querySelector('#tv_chart_container iframe') as HTMLIFrameElement
    const iframeRoot = iframe?.contentWindow?.document.documentElement
    if (!iframeRoot) {
      console.error('无法获取 iframe 内部的根元素')
      return
    }
    // 给 iframe 内部设置 CSS 变量
    iframeRoot.style.setProperty('--secondary-bg', getCssVariable('--secondary-bg'))
  })
}

onBeforeUnmount(() => {
  isUnload = true
})

const clickHandler = () => {
  globalStore.klineSettingPop.visible = false
}
onMounted(() => {
  resetMarkRefreshState()
  clearMarkCaches()
  initChart()
  useVisibilityChange(() => {
    _widget?.resetCache?.()
    _widget?.activeChart?.().resetData?.()
  })

  document.addEventListener('click', clickHandler)
})
onUnmounted(() => {
  document.removeEventListener('click', clickHandler)
  listenerGuidMap.forEach((i) => {
    wsStore.send({
      ...i,
      method: 'unsubscribe',
    })
  })
  listenerGuidMap?.clear()
  // 先取消挂起的 rAF，再销毁 widget，防止回调访问已销毁实例
  if (_rafTickId !== null) {
    cancelAnimationFrame(_rafTickId)
    _rafTickId = null
  }
  if (_rafMarksId !== null) {
    cancelAnimationFrame(_rafMarksId)
    _rafMarksId = null
  }
  _pendingBars = []
  _widget?.remove?.()
  _widget = null
})
const emit = defineEmits(['refresh'])
function refresh() {
  emit('refresh')
  resetChart()
}

const onMarkChanged = (val: boolean) => {
  allowImmediateMyPortraitFetch()
  if (!val) {
    _widget?.activeChart?.()?.clearMarks?.()
  }
  scheduleRefreshMarks()
}

watch(
  () => globalStore.klineSettingPop.visible,
  (val) => {
    if (!val) {
      colorPickerVisible.value = {
        buy: false,
        sell: false,
        kol: false,
        top100Buy: false,
        top100Sell: false,
      } as Record<string, boolean>
    }
  }
)

const resetTop100Color = () => {
  linesChecked.value.top100Buy.color = '#0D6EFD'
  linesChecked.value.top100Sell.color = '#FD3E3E'
}

const resetIndicatorLineColor = () => {
  linesChecked.value.buy.color = '#19d92f'
  linesChecked.value.sell.color = '#f6465d'
  linesChecked.value.kol.color = '#424ADF'
}

defineExpose({
  setScrollTop: (top: number) => {
    scrollTop.value = top
  },
})
</script>

<style scoped lang="scss">
.watermark {
  position: relative;

  &::after {
    content: 'AVE.AI';
    position: absolute;
    left: 50%;
    top: max(48%, 100px);
    transform: translate(-50%, -50%);
    font-size: 60px;
    text-align: center;
    color: #bcbed2;
    opacity: 0.07;
    pointer-events: none;
    font-weight: 500;
  }
}
</style>
