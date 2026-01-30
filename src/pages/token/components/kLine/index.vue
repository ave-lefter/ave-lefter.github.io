<template>
  <div class="relative" :style="{ height: `${isRank ? 390 : kHeight}px` }">
    <div id="tv_chart_container" ref="kline" :style="{ width: '100%', height: '100%' }" />
    <UnknownRisk v-show="isReady" :isRank="isRank" @refresh="refresh" />
    <DialogRemind v-model="dialogVisible_remind" />
  </div>
  <div
    v-if="!isRank"
    class="w-full cursor-row-resize bg-[--border] gap-1px hover:bg-[--third-text] flex items-center justify-center h-4px"
    @mousedown.stop.prevent="drag"
  >
    <span v-for="i in 4" :key="i" class="bg-[--icon-color] w-2px h-2px rounded-full" />
  </div>
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
    <div v-show="markTabsVisible" class="flex flex-wrap gap-row-16px">
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
        <el-tooltip v-model:visible="colorPickerVisible.buy" trigger="click" :teleported="false">
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
        <el-tooltip v-model:visible="colorPickerVisible.sell" trigger="click" :teleported="false">
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
        <el-tooltip v-model:visible="colorPickerVisible.kol" trigger="click" :teleported="false">
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
const tokenStore = props.isRank ? useRankKlineStore() : useTokenStore()
const botStore = useBotStore()
const tokenDetailsStore = useTokenDetailsStore()
const globalStore = useGlobalStore()
const route = useRoute()
const walletStore = useWalletStore()
const scrollTop = ref(0)
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
])
const linesChecked = useLocalStorage('tv_markLines', {
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
    color: '#FFA622',
  },
})
const colorPickerVisible = ref({} as Record<string, boolean>)
const token = computed(() => {
  return props.isRank && 'klineRow' in tokenStore
    ? tokenStore.klineRow?.id
    : (route.params.id as string)
})

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

watch(
  () => token.value,
  (val) => {
    if (!val) return
    if (_widget?.activeChart?.()) {
      _widget?.activeChart?.()?.removeAllShapes?.()
    }
  }
)

watch(pair, (val) => {
  if (val === klinePair.value) return
  switchTokenKline()
})

watch(
  () => tokenStore.selectedToken,
  () => {
    switchTokenKline()
  }
)

function switchTokenKline() {
  isReadyLine = false
  resetLimitPriceLineId()
  // resetAvgPriceLineId()
  resetTop100AvgPriceLineId()
  resetBotAvgLineId()
  resetKOLLine()
  const val = pair.value
  if (isReady.value && route.name === 'token-id') {
    const isSupportSecChains = (chain.value && supportSecChains.includes(chain.value)) || false
    const QUICK_KEY = 'tradingview.IntervalWidget.quicks'
    const preResolutions = localStorage.getItem(QUICK_KEY)
    resolution.value = initTradingViewIntervals(resolution.value, chain.value, isSupportSecChains)
    const nextResolutions = localStorage.getItem(QUICK_KEY)
    if (preResolutions !== nextResolutions) {
        resetChart()
    }
    if (_widget && _widget?.activeChart?.()) {
      _widget?.resetCache?.()
      _widget?.activeChart?.()?.clearMarks?.()
      _widget?.setSymbol?.(
        symbol.value + '---' + token.value + val + (tokenStore.selectedToken ? '1' : '0'),
        resolution.value as ResolutionString,
        () => {
          isReadyLine = true
          // createHeaderButton()
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

const price = 0
const wsStore = useWSStore()
const localeStore = useLocaleStore()

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

const resolution = shallowRef(localStorage.getItem('tv_resolution') || '15')
const themeStore = useThemeStore()
let _widget: null | IChartingLibraryWidget = null

const showMarket = useLocalStorage('tv_showMarket', false)

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
          ${isShowMarket ? 'Price / <span style="color:#286DFF">MCap</span>' : '<span style="color:#286DFF">Price</span> / MCap'}
        </span>`
  }

  btn.onclick = () => {
    showMarket.value = !showMarket.value

    updateButtonContent()
    // resetChart()
    _widget?.resetCache?.()
    _widget?.activeChart?.().resetData?.()
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
      '<div style="display: flex;align-items: center;cursor:pointer;padding: 7px 5px 7px 0;border-radius: 6px;" onMouseOver="this.style.background=\'none\'"  onMouseLeave="this.style.background=\'none\'"><img width="18" height="18" src="https://ave.s3.ap-east-1.amazonaws.com/im/alert.png" /></div>'
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
  btn.innerHTML = `<div style="cursor:pointer"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M15.2182 3.04349C13.7649 1.95145 11.9578 1.30436 10 1.30436C5.19744 1.30436 1.30437 5.197 1.30437 9.99998C1.30437 11.3595 1.61643 12.646 2.17263 13.7925L1.09227 14.549C0.394018 13.1844 0 11.6381 0 9.99998C0 4.47692 4.47711 0 9.99999 0C12.2907 0 14.4009 0.770215 16.0869 2.0652V0.650475C16.0869 0.29128 16.3765 0 16.7391 0C17.0996 0 17.3913 0.292122 17.3913 0.650475V3.69649C17.3913 3.87652 17.3191 4.03871 17.2015 4.15676C17.0822 4.27482 16.9195 4.34783 16.7404 4.34783H13.6944C13.3352 4.34783 13.0435 4.05826 13.0435 3.69567C13.0435 3.33563 13.3356 3.04351 13.6944 3.04351H15.2182V3.04349ZM4.78177 16.9565C6.23513 18.0486 8.04198 18.6957 9.99999 18.6957C14.8026 18.6957 18.6956 14.8021 18.6956 10C18.6956 8.89779 18.4906 7.84394 18.1169 6.87417L19.2136 6.1065C19.7202 7.30301 20 8.61839 20 10C20 15.5222 15.5227 20 10 20C7.70955 20 5.59912 19.2298 3.91308 17.9348V19.3487C3.91308 19.7087 3.62348 20 3.26089 20C2.90065 20 2.60873 19.7079 2.60873 19.3487V16.3026C2.60873 16.1235 2.68093 15.9605 2.79832 15.8432C2.91783 15.7252 3.08045 15.6521 3.25964 15.6521H6.30566C6.66508 15.6521 6.95657 15.9417 6.95657 16.3043C6.95657 16.6644 6.66444 16.9565 6.30566 16.9565H4.78177V16.9565Z" fill="#9CA1A8"/>
</svg></div>`
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
  createDisplayButton,
  markTabsVisible,
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
    ],
    enabled_features: [
      'request_only_visible_range_on_reset',
      ...(isSupportSecChains ? ['seconds_resolution' as ChartingLibraryFeatureset] : []),
    ],
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
        const isSupportSecChains = chain.value && supportSecChains.includes(chain.value)
        const configurationData = {
          supported_resolutions: (chain.value === 'mixmax' || chain.value === 'xlayer' || chain.value === 'base') ? ['1S','5S', '15S', '30S', '1', '5', '15', '30', '60', '120', '240', '1D', '1W'] :
            [
            '1S',
            '1',
            '5',
            '15',
            '30',
            '60',
            '120',
            '240',
            '1D',
            '1W',
          ] as ResolutionString[],
          supports_marks: true,
          supports_timescale_marks: true,
          supports_time: true,
        }
        if (!isSupportSecChains) {
          configurationData.supported_resolutions = [
            '1',
            '5',
            '15',
            '30',
            '60',
            '120',
            '240',
            '1D',
            '1W',
          ] as ResolutionString[]
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
            has_seconds: isSupportSecChains,
            seconds_multipliers: ['1', '5', '15', '30'],
            has_daily: true,
            // has_no_volume: false, // 布尔表示商品是否拥有成交量数据
            has_weekly_and_monthly: true,
            supported_resolutions: [
              '1S',
              '5S',
              '15S',
              '30S',
              '1',
              '5',
              '15',
              '30',
              '60',
              '120',
              '240',
              '1D',
              '1W',
            ] as ResolutionString[], // 在这个商品的周期选择器中启用一个周期数组。 数组的每个项目都是字符串。
            data_status: 'streaming' as 'streaming' | 'endofday' | 'delayed_streaming',
            visible_plots_set: 'ohlcv' as VisiblePlotsSet,
            type: 'crypto',
            listed_exchange: getSwapInfo?.(chain.value || '', amm.value)?.show_name || '',
          }
          if (!isSupportSecChains) {
            symbolInfo.supported_resolutions = [
              '1',
              '5',
              '15',
              '30',
              '60',
              '120',
              '240',
              '1D',
              '1W',
            ] as ResolutionString[]
            symbolInfo.seconds_multipliers = []
          }
          console.log('[resolveSymbol]: Symbol resolved', symbolName)
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
            SupportTokenKlineChains?.includes?.(chain.value) &&
            !props.isRank &&
            'tokenAllPair' in tokenStore &&
            tokenStore?.tokenAllPair &&
            tokenStore?.selectedToken

          console.log('[getBars] isTokenKline', isTokenKline)
          if (!isTokenKline) {
            params.pair_id = pair.value + '-' + chain.value
            delete params.token_id
          }
          loading = true
          const getKlineFunc = isTokenKline ? getTokenKlineHistory : getKlineHistoryData
          getKlineFunc(params)
            .then((res) => {
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
          _widget?.resetCache?.()
        }
      })

    setWatermark(_widget)
    subscribePriceMove()
    // 从缓存中读取数据并创建指标
    createStudy()
    _widget?.applyOverrides?.({
      'scalesProperties.textColor': themeStore.isDark ? '#d5d5d5' : '#333',
      'paneProperties.backgroundType': 'solid',
      'paneProperties.background': getCssVariable('--secondary-bg'),
    })
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
    for (const [, markArr] of profilingMarksCache) {
      const addr = markArr.find((el) => el.id === markId)?.user_address
      if (addr) {
        user_address = addr
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
        const _price =
          'price_u' in tx
            ? Number(tx.price_u || 0)
            : Number(
                tx.from_address?.toLowerCase?.() === tokenStore.token?.token?.toLowerCase?.()
                  ? tx.from_price_usd
                  : tx.to_price_usd
              ) || 0
        if (_pair === pair.value) {
          lastPairPrice = _price
        }
        if (_pair !== pair.value) {
          const price = _price
          if (!lastPairPrice && Math.abs(price - lastPairPrice) > lastPairPrice * 0.35) {
            return
          }
        }
        tokenStore.tokenPrice = _price
        const newBar1 = buildOrUpdateLastBarFromTx(tx, t, lastBar, interval)
        if (newBar1) {
          lastBar = { ...newBar1 }
        }
        const newBar = { ...newBar1 } as KLineBar
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
          onTick(newBar)
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
    tokenStore.centerTopHeight = kHeight.value
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
  (endTime) => {
    const params = resolutionMap[resolution.value as keyof typeof resolutionMap] || {
      val: resolution.value,
      unit: 'm',
    }
    return dayjs(endTime * 1000).subtract(params.val * 20, params.unit).unix()
  }
)

function setIframeCssVar() {
  const iframe = document.querySelector('#tv_chart_container iframe') as HTMLIFrameElement
  const iframeRoot = iframe?.contentWindow?.document.documentElement
  if (!iframeRoot) {
    console.error('无法获取 iframe 内部的根元素')
    return
  }
  // 给 iframe 内部设置 CSS 变量
  iframeRoot.style.setProperty('--secondary-bg', getCssVariable('--secondary-bg'))
}

onBeforeUnmount(() => {
  isUnload = true
})

const clickHandler = () => {
  globalStore.klineSettingPop.visible = false
}
onMounted(() => {
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
  _widget?.remove?.()
  _widget = null
})
const emit = defineEmits(['refresh'])
function refresh() {
  emit('refresh')
  resetChart()
}

const onMarkChanged = (val: boolean) => {
  if (!val) {
    _widget?.activeChart?.()?.clearMarks?.()
  }

  setTimeout(() => {
    _widget?.activeChart?.()?.refreshMarks?.()
  }, 20)
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
  linesChecked.value.kol.color = '#ffa622'
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
