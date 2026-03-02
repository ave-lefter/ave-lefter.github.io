<template>
  <div class="relative" :style="{height: `${kHeight}px`}">
    <div id="tv_chart_container_p" ref="kline" :style="{ width: '100%', height: '100%' }" />
  </div>
  <div
    v-if="!isRank"
    class="w-full cursor-row-resize bg-[--border] gap-1px hover:bg-[--third-text] flex items-center justify-center h-4px"
    @mousedown.stop.prevent="drag"
  >
    <span v-for="i in 4" :key="i" class="bg-[--icon-color] w-2px h-2px rounded-full"/>
  </div>
</template>

<script setup lang='ts'>
import type { IChartingLibraryWidget, ResolutionString, Timezone, SeriesFormat, VisiblePlotsSet, LanguageCode, ChartingLibraryFeatureset, SubscribeBarsCallback, LibrarySymbolInfo } from '~/types/tradingview/charting_library'
import { getTimezone, formatDecimals, getWSPerpMessage } from '@/utils'
import { formatNumber } from '@/utils/formatNumber'
import { switchPerpResolution, formatLang, initTradingViewIntervals, updateChartBackground, waitForTradingView,  setWatermark } from './utils'
import {useLocalStorage, useElementBounding, useWindowSize, useEventBus, useStorage} from '@vueuse/core'
import type { KLineBar } from './types'
import {DefaultHeight, WSPerpEventType} from '~/utils/constants'
import { TW_STUDY } from './constant'
import dayjs from 'dayjs'
import { _getPerpKline } from '@/api/perp/index'
import { usePerpStore } from '@/stores/perp'
import { usePerpWsPubStore } from '@/stores/perp/wsPub'
const { contractId, contractName, resolution, perp } = storeToRefs(usePerpStore())
const perpWsPubStore = usePerpWsPubStore()
const props = defineProps<{
  isRank?:boolean
}>()
const klineDateFilter = inject<Ref<string[]>>(ProvideType.KLINE_DATE_FILTER)
const tokenStore = props.isRank ? useRankKlineStore() : useTokenStore()
const globalStore = useGlobalStore()
const route = useRoute()
const isReady = ref(false)
let isReadyLine = false
const isCatch = shallowRef(false)


const klineLineSave = useKlineLineSave(() => contractId.value, 'perp_tv_charts_storage')

const symbol = computed(() => {
  return contractName.value || '-'
})

let loading = false

watch(() => contractId.value, (val) => {
  if (!val) return
  isCatch.value = false
  if (_widget?.activeChart()) {
    _widget?.activeChart()?.removeAllShapes?.()
    // const chart = _widget?.activeChart?.()
    // // 移除旧指标（保留 Volume）
    // const allStudies = chart.getAllStudies()
    // allStudies.forEach(study => {
    //   if (!study.name.includes('Volume')) {
    //     chart.removeEntity(study.id)
    //   }
    // })
    _widget?.resetCache?.()
    switchTokenKline()
  }
})
function switchTokenKline() {
  isReadyLine = false
  if (isReady.value && route.name === 'perp-id') {
    if (_widget) {
      _widget?.resetCache?.()
      _widget?.activeChart?.()?.clearMarks?.()
      _widget?.setSymbol?.(symbol.value, resolution.value as ResolutionString, () => {
        isReadyLine = true
        klineLineSave.loadKlineLine(_widget)
      })
    } else {
      initChart()
    }
  }
}

const price = 0
// const wsStore = useWSStore()
const localeStore = useLocaleStore()

// const marks = shallowRef([{ id: 'trade', name: '我的' }])

// const LLJEFFY_#_240
const listenerGuidMap = new Map()

// const resolution = shallowRef(localStorage.getItem('tv_resolution') || '15')
const themeStore = useThemeStore()
let _widget: null | IChartingLibraryWidget = null


// 切换主题
watch(() => themeStore.theme, (val) => {
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
})

// 切换语言
watch(() => localeStore.locale, () => {
  resetChart()
})


// const documentVisible = inject<Ref<boolean>>('documentVisible') as Ref<boolean>

// watch(documentVisible, (val) => {
//   if (val && _widget) {
//     _widget?.resetCache?.()
//     _widget?.activeChart?.().resetData?.()
//   }
// })
function resetChart() {
  isReadyLine = false
  _widget?.remove?.()
  initChart()
}


function saveStudy() {
  if (_widget?.activeChart) {
    let studies = _widget?.activeChart?.().getAllStudies() || []
    studies = studies.filter((item, index) => studies.findIndex(i => i.name === item.name) === index)
    localStorage.setItem(TW_STUDY, JSON.stringify(studies.filter(i => i.name !== 'Volume')))
  }
}

// 提前拦截 K线 数据 没有更多
let noData = false
let firstBarTime = 0

async function initChart() {
  const symbolUp = symbol.value?.toUpperCase?.() || '-'
  // const widget = (window as any).TradingView.widget as ChartingLibraryWidgetConstructor
  // console.log('widget', window.TradingView)
  // 初始化 resolutions
  resolution.value = initTradingViewIntervals(resolution.value)
  console.log('-----resolution.value ------',resolution.value)
  const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
  const widget = await waitForTradingView()
  _widget = new widget({
    symbol: symbolUp.replace('<', '＜') || ' ',
    debug: false,
    width: '100%' as any,
    height: '100%' as any,
    interval: resolution.value as any,
    theme: themeStore.theme,
    container: 'tv_chart_container_p',
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
      'show_interval_dialog_on_key_press'
    ],
    enabled_features: [
      'request_only_visible_range_on_reset',
      'saveload_separate_drawings_storage'
    ],
    auto_save_delay: 1,
    charts_storage_url: location.host,
    charts_storage_api_version: '1.1',
    timezone: getTimezone() as Timezone,
    time_frames: [],
    loading_screen: {
      backgroundColor: themeStore.isDark ? '#0B0D12' : '#F6F9FF',
      foregroundColor: '#3F80F7'
    },
    custom_css_url: `${location.origin}/tv_custom_1.css`,
    // format: (showMarket.value ? 'volume' : 'price') as SeriesFormat,
    custom_formatters: {
      priceFormatterFactory: () => {
        return {
          format: (price) => {
            return String(formatNumber(price, {
              decimals: 4,
              limit: 6,
              locale: 'en'
            }))
          },
        }
      }
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
      onReady: callback => {
        // const chain = props.chain
        const configurationData = {
          supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '1D', '1W'] as ResolutionString[],
          supports_marks: true,
          supports_timescale_marks: true,
          supports_time: true
        }
        setIframeCssVar()

        setTimeout(() => callback(configurationData), 50)
      },
      resolveSymbol: (symbolName, onResolve, onError) => {
        try {
          const symbolUp = symbol.value?.toUpperCase?.() || '-'
          const p = Number(price || tokenStore?.price) || 0
          const symbolInfo: LibrarySymbolInfo = {
            // symbol: symbolUp,
            name: symbolUp,
            ticker: symbolUp,
            description: symbolUp || '',
            exchange: 'Ave.ai',
            timezone: getTimezone() as Timezone,
            format: 'price' as SeriesFormat,
            minmov: 1, // 最小波动
            minmove2: 0, // 格式化复杂情况下的价格 如价格增量
            pricescale: p > 0
              ? 10 ** formatDecimals(p).precision
              : 10000000000,
            volume_precision: 2, // 小数位
            fractional: false, // 分数显示价格,1 - xx'yy（例如，133'21)或 2 - xx'yy'zz （例如，133'21'5）
            session: '24x7',
            has_intraday: true, // 显示商品是否具有日内（分钟）历史数据
            intraday_multipliers: ['1', '5', '15', '30', '60', '120', '240'] as ResolutionString[],
            has_daily: true,
            //has_no_volume: false, // 布尔表示商品是否拥有成交量数据
            has_weekly_and_monthly: true,
            supported_resolutions: ['1', '5', '15', '30', '60', '120', '240', '1D', '1W'] as ResolutionString[], // 在这个商品的周期选择器中启用一个周期数组。 数组的每个项目都是字符串。
            data_status: 'streaming' as 'streaming' | 'endofday' | 'delayed_streaming',
            visible_plots_set: 'ohlcv' as VisiblePlotsSet,
            type: 'crypto',
            listed_exchange: symbol.value || ''
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
          } else {
            if (noData) {
              onResult([], { noData: true })
              return
            }
          }
          const interval = switchPerpResolution(resolution)
          console.log('-------firstBarTime--------',firstBarTime,from,to)
          const params: any = {
            priceType: 'LAST_PRICE',
            klineType: interval,
            contractId: contractId.value,
            filterBeginKlineTimeInclusive: from * 1000,
            filterEndKlineTimeExclusive: firstDataRequest ? Date.now() : Math.max(to * 1000, firstBarTime || 0)

          }
          loading = true
          _getPerpKline(params).then(res => {
            const result = res?.dataList?.reverse() || []
            const bars1 = result?.map(i => ({
              ...i,
              time: Number(i.klineTime),
              open: i.open,
              high: i.high,
              low: i.low,
              close: i.close,
              volume: Number(i.value || 0),

            })) || []
            const bars = bars1?.map?.(i => ({
              time: Number(i.klineTime),
              open: i.open,
              high: i.high,
              low: i.low,
              close: i.close,
              volume: Number(i.value || 0),
              type: i.close > i.open ? 'buy': 'sell'
            })) || []
             console.log('------res-1--------',bars)
            if (firstDataRequest) {
              noData = bars?.length < 1
            }
            if (bars1?.length > 0) {
              firstBarTime = bars1?.[0]?.time || 0
            }
            onResult(bars, {noData: !bars?.length})
            setTimeout(() => {
              isReadyLine = true
            }, 100)

          }).catch((err) => {
            isCatch.value = true
            // const key = `${WSPerpEventType.KLINE}.${contractId.value}.${interval}`
            // const bars = snapshotCache.value[key] || [];
            // console.log('--getBars--bars-------', snapshotCache.value)
            // if (bars?.length > 0) {
            //   console.log('--------44------',bars)
            //   onResult(bars, { noData: !bars?.length});
            // } else {
              if (firstDataRequest) {
                const price = perp.value?.lastPrice
                const volume = perp.value?.value
                const fakeBar = {
                  time: from * 1000,
                  open: price,
                  high: price,
                  low: price,
                  close: price,
                  volume: volume
                }
                setTimeout(() => onResult([fakeBar], { noData: false }), 100)
              } else {
                onResult([], { noData: true, nextTime: undefined })
              }
            // }
          }).finally(() => {
            loading = false
          })
        } catch (err) {
          console.log('[getBars]: Get error', err)
          onError(err?.toString?.() || 'getBars err')
        }
      },
      subscribeBars: (symbolInfo, resolution, onTick, listenerGuid, /*onResetCacheNeededCallback*/) => {
        console.log('listenerGuid', listenerGuid)
        const interval = switchPerpResolution(resolution)
        if (listenerGuidMap.has(`${contractId.value}.${interval}`)) {
          onWsKline(resolution, onTick)
          return
        }

        const ws = perpWsPubStore.send({ type: 'subscribe', channel: `${WSPerpEventType.KLINE}.${contractId.value}.${interval}`})
        onWsKline(resolution, onTick, ws)
        listenerGuidMap.set(`${contractId.value}.${interval}`, { type: 'subscribe', channel: `${WSPerpEventType.KLINE}.${contractId.value}.${interval}` })
      },
      unsubscribeBars: (listenerGuid) => {
        if (listenerGuid) {
          console.log('listenerGuidMap', listenerGuidMap)
          const arr = listenerGuid?.split('_')
          const interval = switchPerpResolution(arr[-1])
          listenerGuidMap.forEach((value, key) => {
            if (key !== `${contractId.value}.${interval}`) {
              perpWsPubStore.send({
                ...value,
                type: 'unsubscribe'
              })
            }
          })
          listenerGuidMap?.clear()
        }
      },
      searchSymbols: (userInput, exchange, symbolType, onResult) => {
        console.log(userInput, exchange, symbolType, onResult)
      }
    }
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
    _widget?.activeChart?.()?.onIntervalChanged().subscribe(null, interval => {
      if (resolution.value !== interval) {
        resolution.value = interval
        localStorage.setItem('tv_resolution', interval)
        _widget?.resetCache?.()
      }
    })

    setWatermark(_widget)
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
  let mouseDownTime = 0
  _widget.subscribe('mouse_down',()=>{
    mouseDownTime = performance.now()
  })

  _widget.subscribe('mouse_up', (e) => {
    if(performance.now() - mouseDownTime >=200){
      return
    }
    const startTime = _widget?.activeChart().getTimeScale().coordinateToTime(e.clientX-56)
    if(startTime && resolution.value){
      // 获取 tradingview 时间周期
      const dayjsParams = resolutionMap[resolution.value as keyof typeof resolutionMap] || {val:resolution.value,unit:'m'}
      const endTime = dayjs(startTime*1000).add(dayjsParams.val,dayjsParams.unit).unix()
      if(globalStore.isClickKlineFilter && klineDateFilter?.value){
        klineDateFilter.value = [String(startTime),String(endTime)]
      }
    }

  })

  subscribeStudyEvent()

}

let isUnload = false
function subscribeStudyEvent() {
  _widget?.subscribe('study_event', (_id,  type) => {
    if ((type === 'create' || type === 'remove') && !isUnload) {
      saveStudy()
    }
  })
  window.onbeforeunload = () => {
    isUnload = true
  }
}


function onWsKline(resolution: string, onTick: SubscribeBarsCallback, ws = perpWsPubStore.getWSInstance()) {
  ws?.onmessage(e => {


    const msg = getWSPerpMessage(e)
    if (!msg) {
      return
    }
    const { channel, content: { data, dataType } = {} } = msg || {}
    const interval = switchPerpResolution(resolution)
    if(channel == `${WSPerpEventType.KLINE}.${contractId.value}.${interval}`){
      // console.log('--------msg-----------',msg)

      if (data?.length > 0 && !loading && dataType === 'Snapshot' && isCatch.value) {

        const key = `${WSPerpEventType.KLINE}.${contractId.value}.${interval}`
        const bars = data.reverse().map(i => ({
          time: Number(i.klineTime),
          open: i.open,
          high: i.high,
          low: i.low,
          close: i.close,
          volume: Number(i.value || 0),
        }))
        // snapshotCache.value[key] = bars
        // if (onResetCacheNeededCallback) {
        //   onResetCacheNeededCallback()
        // }
        bars.forEach(bar => onTick(bar))
      }

      if (data?.length > 0 && !loading && dataType === 'changed') {
        const wsData = data?.map(i => ({
          ...i,
          time: Number(i.klineTime),
          open: i.open,
          high: i.high,
          low: i.low,
          close: i.close,
          volume: Number(i.value || 0),
          type: i.close > i.open ? 'buy': 'sell'
        }))[0]
        const bar = wsData as KLineBar
        // const msInterval = switchResolution(resolution)
        // const bar = updatePerpLastBar(wsData, contractId.value, lastBar, msInterval) as KLineBar
        onTick(bar)
      }
    }
  }, 'kline')
}

// 拖动缩放
let isMask = false
const kHeight = useStorage('kHeightPerp-v1',  Math.max(DefaultHeight.KLINE, 564))
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
  document.onmousemove = e => {
    if (!isMask) {
      return
    }
    if (e.clientY > wHeight.value) {
      isMask = false
      return
    }
    document.getElementById('tv_chart_container_p')!.style.pointerEvents = 'none'
    const _kHeight = e.clientY < dy
      ? kHeight.value - (dy - e.clientY)
      : kHeight.value + e.clientY - dy

    if (_kHeight <= wHeight.value - 164) {
      kHeight.value = _kHeight
    }
    dy = e.clientY
  }
  document.onmouseup = () => {
    document.getElementById('tv_chart_container_p')!.style.pointerEvents = 'auto'
    isMask = false
    document.onmousemove = null
    document.onmouseup = null
  }
  // e.stopPropagation()
  // e.preventDefault()
  return false
}



function setIframeCssVar() {
  const iframe = document.querySelector('#tv_chart_container_p iframe') as HTMLIFrameElement
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
  _widget?.remove?.()
})

onMounted(() => {
  initChart()
  useVisibilityChange(() => {
    _widget?.resetCache?.()
    _widget?.activeChart?.().resetData?.()
  })
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
    color: #BCBED2;
    opacity: 0.07;
    pointer-events: none;
    font-weight: 500;
  }
}
</style>
