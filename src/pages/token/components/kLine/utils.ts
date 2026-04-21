// import { getGlobalT } from '@/utils/i18nBridge'
import type { Mark, ChartingLibraryWidgetConstructor, IChartingLibraryWidget, EntityId, DrawingEventType } from '~/types/tradingview/charting_library'
import { formatNumber, formatDec } from '@/utils/formatNumber'
import type { KLineBar, SimpleWSTx, WSTx } from './types'
import { useDebounceFn, useDocumentVisibility, useEventBus, useThrottleFn, type RemovableRef } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { bot_getUserPendingTx, bot_cancelLimitOrdersByBatch, bot_getUserWalletTxInfo } from '~/api/token'
import { RESOLUTION_KEY, QUICK_KEY } from './constant'
import { _getHoldersList } from '~/api/holders'
import dayjs from 'dayjs'

export const supportSecChains = [ 'bsc', 'base', 'mixmax', 'xlayer', 'solana']

export const DEFAULT_LIST = ['1S','5S', '1', '5', '15', '30', '60', '120', '240', '1D', '1W']
export const SUPPORT_LIST = ['1S','5S', '15S', '30S', '1', '5', '15', '30', '60', '120', '240', '1D', '1W']

export function switchResolution(resolution: string) {
  const obj: Record<string, string> = {
    '1D': '1440',
    '1W': '10080'
  }
  let t = obj[resolution] || resolution
  if (t?.endsWith?.('S')) {
    t = t?.slice?.(0, -1)
  } else {
    t = String(Number(t) * 60)
  }
  return t
}


export function formatLang(lang: string) {
  return {
    en: 'en',
    'zh-cn': 'zh',
    'zh-tw': 'zh_TW',
    pt: 'pt',
    es: 'es',
    ru: 'ru',
    tr: 'tr',
    vi: 'vi',

  }?.[lang] || 'en'
}

export function filterLanguage(lang: string) {
  return ({
    'zh-cn': 'cn',
    'zh-tw': 'tw',
  }?.[lang] || 'en') as 'cn' | 'en' | 'pt' | 'tw' | 'es'
}


type TradeSide = {
  amount: number
  txns: number
  volume: number
}

type TradeData = {
  time: number
  buy?: TradeSide
  sell?: TradeSide
}

export function formatToMarks(
  data: TradeData[],
  interval: number | string
): Mark[] {
  // const t = getGlobalT()
  const result: Mark[] = []
  const bucketMap: Record<string, { time: number; side: 'buy' | 'sell'; amount: number; txns: number; volume: number }> = {}
  const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
  // First pass: Aggregate data into buckets
  const interval1 = Number(interval)
  for (const item of data) {
    const bucketTime = Math.floor(item.time / interval1) * interval1

    // Aggregating buy data
    if (item.buy) {
      const key = `${bucketTime}-buy`
      const entry = bucketMap[key] ??= { time: bucketTime, side: 'buy', amount: 0, txns: 0, volume: 0 }
      entry.amount += item.buy.amount
      entry.txns += item.buy.txns
      entry.volume += item.buy.volume
    }

    // Aggregating sell data
    if (item.sell) {
      const key = `${bucketTime}-sell`
      const entry = bucketMap[key] ??= { time: bucketTime, side: 'sell', amount: 0, txns: 0, volume: 0 }
      entry.amount += item.sell.amount
      entry.txns += item.sell.txns
      entry.volume += item.sell.volume
    }
  }

  // Second pass: Convert aggregated data into mark format
  for (const entry of Object.values(bucketMap)) {
    const isBuy = entry.side === 'buy'
    result.push({
      id: `${entry.time}-${entry.side}`,
      time: entry.time,
      // type: 'trade',
      color: { background: 'transparent', border: 'transparent' },
      imageUrl:
        isBuy
          ? `${urlPrefix}signals/marks/mark-buy-trade.png`
          : `${urlPrefix}signals/marks/mark-sell-trade.png`,
      label: isBuy ? 'B' : 'S',
      labelFontColor: '#fff',
      minSize: 20,
      hoveredBorderWidth: 0,
      // position: isBuy ? 'below' : 'above',
      borderWidth: 0,
      text: `${isBuy ? '买' : '卖'} $${formatNumber(entry.volume)} ${formatDate(entry.time, 'HH:mm')}`,
      showLabelWhenImageLoaded: false
    })
  }

  // Sorting only at the end
  return result.sort((a, b) => a.time - b.time)
}


export function initTradingViewIntervals(currentResolution: string, chain: string, isSupportSecChains: boolean): string {
  // const QUICK_KEY = 'tradingview.IntervalWidget.quicks'
  // const RESOLUTION_KEY = 'tv_resolution'
  let list: string[]
  const stored = localStorage.getItem('token_' + QUICK_KEY)
  localStorage.setItem(QUICK_KEY, stored || '[]')
  if (!stored) {
    list = isSupportSecChains ? SUPPORT_LIST : DEFAULT_LIST
    localStorage.setItem(QUICK_KEY, JSON.stringify(SUPPORT_LIST))
    localStorage.setItem('token_' + QUICK_KEY, JSON.stringify(SUPPORT_LIST))
    localStorage.setItem('tradingViewIntervalSet', 'true')
  } else {
    list = JSON.parse(stored)
    if (isSupportSecChains && ['1S', '5S', '15S', '30S'].some((i) => !list?.includes(i))) {
      list = SUPPORT_LIST
      // localStorage.setItem(QUICK_KEY, JSON.stringify(list))
    } else if (!isSupportSecChains) {
      list = DEFAULT_LIST
      // localStorage.setItem(QUICK_KEY, JSON.stringify(list))
    }
    // localStorage.setItem(QUICK_KEY, JSON.stringify(SUPPORT_LIST))
  }

  if (!list.includes(currentResolution)) {
    const fallback = '15'
    localStorage.setItem(RESOLUTION_KEY, fallback)
    return fallback
  }

  return currentResolution
}

export function updateChartBackground(): void {
  const key = 'tradingview.chartproperties'
  const stored = localStorage.getItem(key)

  if (!stored) return

  try {
    const properties = JSON.parse(stored)
    const background = useThemeStore().theme === 'light' ? '#fff' : '#0A0B0D'

    const changed =
      properties.paneProperties?.background !== background ||
      properties.paneProperties?.backgroundType !== 'solid'

    if (changed) {
      properties.paneProperties = {
        ...properties.paneProperties,
        background,
        backgroundType: 'solid',
      }
      localStorage.setItem(key, JSON.stringify(properties))
    }
  } catch (e) {
    console.warn(`[updateChartBackground] Invalid JSON in ${key}:`, e)
  }
}

export function getBarStartTime(txTimeMs: number, interval: number): number {
  const ONE_WEEK_SEC = 604800
  const HALF_YEAR_SEC = 15724800 // 6 个月（约 182.625 天）
  const ONE_YEAR_SEC = 31536000  // 365 天

  if (interval === ONE_WEEK_SEC) {
    // 周线：按周一 UTC 零点
    const date = new Date(txTimeMs)
    const utcMidnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const day = utcMidnight.getUTCDay()
    const diffToMonday = (day + 6) % 7
    utcMidnight.setUTCDate(utcMidnight.getUTCDate() - diffToMonday)
    return utcMidnight.getTime()
  }

  if (interval === HALF_YEAR_SEC) {
    // 半年线：对齐到每年 1 月 1 日 或 7 月 1 日
    const date = new Date(txTimeMs)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() // 0-based
    const halfYearStartMonth = month < 6 ? 0 : 6 // 0=Jan, 6=Jul
    const barStart = new Date(Date.UTC(year, halfYearStartMonth, 1, 0, 0, 0, 0))
    return barStart.getTime()
  }

  if (interval === ONE_YEAR_SEC) {
    // 年线：对齐到每年 1 月 1 日
    const date = new Date(txTimeMs)
    const year = date.getUTCFullYear()
    const barStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
    return barStart.getTime()
  }

  // 默认：整除法（用于分钟、小时、日）
  return Math.floor(txTimeMs / (interval * 1000)) * interval * 1000
}



export function buildOrUpdateLastBarFromTx(
  tx: SimpleWSTx | WSTx,
  tokenAddress: string,
  lastBar: KLineBar | null,
  intervalInSeconds: number | string
): KLineBar | null {
  const address = tokenAddress.toLowerCase()
  const txTimeMs = tx.time * 1000

  let price: number, volume: number
  if ('target' in tx) {
    if (tx.target.toLowerCase() === address) {
      price = parseFloat(tx.price_u)
      volume = parseFloat(new BigNumber(tx.price_u || 0).times(tx.target_amt || 0).toFixed())
    } else {
      return null
    }
  } else {
    if (tx.from_address.toLowerCase() === address) {
      price = parseFloat(tx.from_price_usd)
      volume = parseFloat(tx.amount_usd)
    } else if (tx.to_address.toLowerCase() === address) {
      price = parseFloat(tx.to_price_usd)
      volume = parseFloat(tx.amount_usd)
    } else {
      return null // 与该 token 无关
    }
  }

  // if (tx.from_address.toLowerCase() === address) {
  //   price = parseFloat(tx.from_price_usd)
  //   volume = parseFloat(tx.amount_usd)
  // } else if (tx.to_address.toLowerCase() === address) {
  //   price = parseFloat(tx.to_price_usd)
  //   volume = parseFloat(tx.amount_usd)
  // } else {
  //   return null // 与该 token 无关
  // }
  const interval = typeof intervalInSeconds === 'number' ? intervalInSeconds : Number(intervalInSeconds)

  const barStartTime = getBarStartTime(txTimeMs, interval) // Math.floor(txTimeMs / (interval * 1000)) * interval * 1000

  // ✅ 时间过滤：必须 >= 当前 bar 的时间段起始时间
  if (lastBar && txTimeMs < lastBar.time) return null

  if (!lastBar) {
    return {
      time: barStartTime,
      open: price,
      high: price,
      low: price,
      close: price,
      volume
    }
  }
  if (lastBar.time < barStartTime) {
    return {
      time: barStartTime,
      open: lastBar.close,
      high: Math.max(lastBar.close, price),
      low: Math.min(lastBar.close, price),
      close: price,
      volume
    }
  }

  return {
    ...lastBar,
    high: Math.max(lastBar.high, price),
    low: Math.min(lastBar.low, price),
    close: price,
    volume: lastBar.volume + volume
  }
}

export function waitForTradingView(): Promise<ChartingLibraryWidgetConstructor> {
  return new Promise((resolve) => {
    if (window?.TradingView?.widget) return resolve(window.TradingView.widget)
      const handler = () => {
        window.removeEventListener('tradingview:ready', handler)
        resolve(window.TradingView.widget)
      }
    // 监听插件派发的事件
    window.addEventListener('tradingview:ready', handler)
  })
}

export function useWidgetVisibilityRefresh(getWidget: () => IChartingLibraryWidget | null) {
  const documentVisible = useDocumentVisibility()
  const lastHiddenTime = ref<number | null>(null)
  const REFRESH_THRESHOLD = 5 * 60 * 1000 // 10 分钟

  watch(documentVisible, (val) => {
    if (val === 'hidden') {
      lastHiddenTime.value = Date.now()
    }

    if (val === 'visible') {
      const now = Date.now()
      const duration = now - (lastHiddenTime.value || 0)
      const _widget = getWidget()
      if (duration > REFRESH_THRESHOLD && _widget) {
        _widget?.resetCache?.()
        _widget?.activeChart?.().resetData?.()
      }
    }
  })
}

export function useLimitPriceLine(getWidget: () => IChartingLibraryWidget | null, getIsReady: () => boolean, showMarket: Ref<boolean>) {
  let priceLimitLineId = '' as EntityId
  let isCreating = false
  const { t } = useI18n()
  let drawingEventHandler: ((id: EntityId, type: DrawingEventType) => void) | null = null
  let drawingEventWidget: IChartingLibraryWidget | null = null
  let isDrawingSubscribed = false
  const safeUnsubscribe = (widget: IChartingLibraryWidget) => {
    if (!drawingEventHandler || !isDrawingSubscribed) return
    try {
      widget?.unsubscribe?.('drawing_event', drawingEventHandler)
    } catch (err) {
      console.warn('tv unsubscribe drawing_event failed', err)
    }
    isDrawingSubscribed = false
  }
  // 创建 限价价格线
  async function createLimitPriceLine(price: number) {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (!_widget || !chart) return

    if (showMarket.value) {
      price = new BigNumber(price).times(useTokenStore().circulation || '0')?.toNumber()
    }
    if (priceLimitLineId) {
      const line = chart?.getShapeById?.(priceLimitLineId)
      if (line) {
        if (!price) {
          chart?.removeEntity?.(priceLimitLineId)
          priceLimitLineId = '' as EntityId
          return
        }
        line?.setPoints?.([{ price: price, time: 0 }])
        return
      }
    }
    if (isCreating) return
    isCreating = true
    priceLimitLineId = await chart?.createShape?.(
      { price: price, time: 0 }, // 水平线的起始位置
      {
        shape: 'horizontal_line',
        lock: false,
        disableSelection: false, // 允许选中
        disableSave: true,
        disableUndo: true,
        text: t('limitPrice'),
        overrides: {
          linecolor: '#FFBE3C',  // 线的颜色
          linewidth: 1,          // 线的粗细
          linestyle: 2        // 线的样式：0表示实线，1表示虚线 2 长虚线
        }
      }
    )
    isCreating = false
    const line = chart?.getShapeById?.(priceLimitLineId)
    if (!line) return
    line?.setProperties?.({
      textcolor: '#FFBE3C',
      showLabel: true,
      horzLabelsAlign: 'right',
      vertLabelsAlign: 'bottom',
      bold: true,
      fontSize: 12,
      // italic: true,
    })
    line?.setSelectionEnabled?.(false)
  }

  const stop = useEventBus<number>('priceLimit').on((price) => {
    const isReady = getIsReady()
    if (isReady) {
      createLimitPriceLine(price)
    }
  })

  function subscribePriceMove() {
    const _widget = getWidget()
    if (!_widget) return
    if (!drawingEventHandler) {
      drawingEventHandler = (id, type) => {
        if (id === priceLimitLineId && type === 'points_changed') {
          nextTick(() => {
            const widget = getWidget()
            const chart = widget?.activeChart?.()
            const line = chart?.getShapeById?.(id)
            if (!line) return
            const points = line.getPoints?.()
            if (!points?.length) return
            const price = points?.[0]?.price || 0
            if (!price) return
            const price1 = showMarket.value ? new BigNumber(price).div(useTokenStore().circulation || '1')?.toNumber() : price
            useEventBus<string>('priceLimit_move').emit(formatDec(Number(price1), 4))
          })
        }
      }
    }
    if (drawingEventWidget && drawingEventWidget !== _widget) {
      safeUnsubscribe(drawingEventWidget)
    }
    if (drawingEventHandler) {
      if (drawingEventWidget === _widget && isDrawingSubscribed) {
        return
      }
      _widget?.subscribe('drawing_event', drawingEventHandler)
      drawingEventWidget = _widget
      isDrawingSubscribed = true
    }
  }

  onUnmounted(() => {
    if (stop) {
      stop()
    }
    if (drawingEventWidget) {
      safeUnsubscribe(drawingEventWidget)
    }
    drawingEventWidget = null
    drawingEventHandler = null
  })

  return {
    resetLimitPriceLineId: () => {
      priceLimitLineId = '' as EntityId
    },
    subscribePriceMove
  }
}

export function useTop100AvgPriceLine(getWidget: () => IChartingLibraryWidget | null, getIsReady: () => boolean, showMarket: Ref<boolean>, linesChecked: RemovableRef<{
  buy: {
    checked: boolean
    color: string
  }
  sell: {
    checked: boolean
    color: string
  }
  top100Buy: {
    checked: boolean
    color: string
  }
  top100Sell: {
    checked: boolean
    color: string
  }
}>) {
  const avePriceCache = {
    buyAvgPrice: 0,
    sellAvgPrice: 0
  }
  const lineIdObj = {
    sell: '' as EntityId,
    buy: '' as EntityId
  }
  let isCreating = false
  const { t } = useI18n()
  // 创建 限价价格线
  async function createAvgPriceLine(price: number, isBuy: boolean) {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (!_widget || !chart) return
    if (showMarket.value) {
      price = new BigNumber(price).times(useTokenStore().circulation || '0')?.toNumber()
    }
    const property = isBuy ? 'buy' : 'sell'
    const linecolor = isBuy ? (linesChecked.value.top100Buy.color) : (linesChecked.value.top100Sell.color)
    if (lineIdObj[property]) {
      const line = chart?.getShapeById?.(lineIdObj[property])
      if (line) {
        if (!price) {
          chart?.removeEntity?.(lineIdObj[property])
          lineIdObj[property] = '' as EntityId
          return
        }
        line?.setPoints?.([{ price: price, time: 0 }])
        line?.setProperties?.({
          linecolor,
          textcolor: linecolor,
        })
        return
      }
    } else {
      if (!price) return
    }
    if (isCreating) return
    isCreating = true


    lineIdObj[property] = await chart?.createShape?.(
      { price: price, time: 0 }, // 水平线的起始位置
      {
        shape: 'horizontal_line',
        lock: true,
        disableSelection: true, // 允许选中
        disableSave: true,
        disableUndo: true,
        text: isBuy ? t('top100PurchaseAvg') : t('top100SellAvg'),
        overrides: {
          linecolor: linecolor,  // 线的颜色
          linewidth: 1,          // 线的粗细
          linestyle: 1        // 线的样式：0表示实线，1表示虚线 2 长虚线
        },
      }
    )
    isCreating = false
    chart?.getShapeById?.(lineIdObj[property])?.setProperties?.({
      textcolor: linecolor,
      showLabel: true,
      horzLabelsAlign: 'right',
      vertLabelsAlign: 'bottom',
      bold: true,
      fontSize: 12,
      // italic: true,
    })
  }

  const tokenStore = useTokenStore()
  watch(() => tokenStore.token?.token, async () => {
    if (!tokenStore.token?.token) return
    _getHoldersList({
      token_id: tokenStore.token?.token + '-' + tokenStore.token?.chain
    }).then(res => {
      avePriceCache.buyAvgPrice = res.aggregateStats?.top100PurchaseAvg
      avePriceCache.sellAvgPrice = res.aggregateStats?.top100SellAvg
      createAvgPriceLinePoll(avePriceCache.buyAvgPrice, avePriceCache.sellAvgPrice)
    }).catch((err) => {
      console.log(err)
    })
  }, { immediate: true })

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  let avgPriceToken = 0  // 表示当前有效轮询的 token
  const MAX_RETRY = 5
  const INTERVAL = 2000

  async function createAvgPriceLinePoll(buyAvgPrice: number, sellAvgPrice: number) {
    const myToken = ++avgPriceToken  // 当前调用的唯一标识
    let retry = 0

    while (retry <= MAX_RETRY) {
      // 被后续调用覆盖，直接退出
      if (myToken !== avgPriceToken) return

      const isReady = getIsReady()
      if (isReady) {
        if (linesChecked.value.top100Buy.checked) {
          await createAvgPriceLine(buyAvgPrice, true)
        }
        await sleep(100)
        if (linesChecked.value.top100Sell.checked) {
          await createAvgPriceLine(sellAvgPrice, false)
        }
        return
      }

      await sleep(INTERVAL)
      retry++
    }
  }

  watch(() => linesChecked.value.top100Buy.checked, val => {
    if (val && avePriceCache.buyAvgPrice) {
      createAvgPriceLine(avePriceCache.buyAvgPrice, true)
    } else {
      createAvgPriceLine(0, true)
    }
  })

  watch(() => linesChecked.value.top100Sell.checked, val => {
    if (val && avePriceCache.sellAvgPrice) {
      createAvgPriceLine(avePriceCache.sellAvgPrice, false)
    } else {
      createAvgPriceLine(0, false)
    }
  })

  watch(() => linesChecked.value.top100Buy.color, useDebounceFn(() => {
    if (linesChecked.value.top100Buy.checked && avePriceCache.buyAvgPrice) {
      createAvgPriceLine(avePriceCache.buyAvgPrice, true)
    }
  }, 300))

  watch(() => linesChecked.value.top100Sell.color, useDebounceFn(() => {
    if (linesChecked.value.top100Sell.checked && avePriceCache.sellAvgPrice) {
      createAvgPriceLine(avePriceCache.sellAvgPrice, false)
    }
  }, 300))

  watch(()=>showMarket.value,()=>{
      if (linesChecked.value.top100Buy.checked && avePriceCache.buyAvgPrice) {
      createAvgPriceLine(avePriceCache.buyAvgPrice, true)
    }
     if (linesChecked.value.top100Sell.checked && avePriceCache.sellAvgPrice) {
      createAvgPriceLine(avePriceCache.sellAvgPrice, false)
    }
  })

  return {
    resetAvgPriceLineId: () => {
      const _widget = getWidget()
      // const isReady = getIsReady()
      if (!_widget) return
      const chart = _widget?.activeChart?.()
      if (!chart) return
      if (lineIdObj.buy) {
        chart?.removeEntity?.(lineIdObj.buy)
      }
      if (lineIdObj.sell) {
        chart?.removeEntity?.(lineIdObj.sell)
      }
      lineIdObj.buy = '' as EntityId
      lineIdObj.sell = '' as EntityId
    }
  }
}

export function useAvgPriceLine(getWidget: () => IChartingLibraryWidget | null, getIsReady: () => boolean, showMarket: Ref<boolean>) {
  let lineId = '' as EntityId
  let isCreating = false
  const { t } = useI18n()
  // 创建 限价价格线
  async function createAvgPriceLine(price: number) {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (!_widget || !chart) return
    if (showMarket.value) {
      price = new BigNumber(price).times(useTokenStore().circulation || '0')?.toNumber()
    }
    if (lineId) {
      const line = chart?.getShapeById?.(lineId)
      if (line) {
        if (!price) {
          chart?.removeEntity?.(lineId)
          lineId = '' as EntityId
          return
        }
        line?.setPoints?.([{ price: price, time: 0 }])
        return
      }
    } else {
      if (!price) return
    }
    if (isCreating) return
    isCreating = true
    lineId = await chart?.createShape?.(
      { price: price, time: 0 }, // 水平线的起始位置
      {
        shape: 'horizontal_line',
        lock: true,
        disableSelection: true, // 允许选中
        disableSave: true,
        disableUndo: true,
        text: t('averagePositionPrice'),
        overrides: {
          linecolor: '#3F80F7',  // 线的颜色
          linewidth: 1,          // 线的粗细
          linestyle: 0        // 线的样式：0表示实线，1表示虚线 2 长虚线
        },
      }
    )
    isCreating = false
    chart?.getShapeById?.(lineId)?.setProperties?.({
      textcolor: '#3F80F7',
      showLabel: true,
      horzLabelsAlign: 'right',
      vertLabelsAlign: 'bottom',
      bold: true,
      fontSize: 12,
      // italic: true,
    })
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 保存事件总线监听器停止函数
  const updateAvgPriceOff = useEventBus<number>('updateAvgPrice').on(createAvgPriceLinePoll)

  let avgPriceToken = 0  // 表示当前有效轮询的 token
  const MAX_RETRY = 5
  const INTERVAL = 2000

  async function createAvgPriceLinePoll(price: number) {
    const myToken = ++avgPriceToken  // 当前调用的唯一标识
    let retry = 0

    while (retry <= MAX_RETRY) {
      // 被后续调用覆盖，直接退出
      if (myToken !== avgPriceToken) return

      const isReady = getIsReady()
      if (isReady) {
        createAvgPriceLine(price)
        return
      }

      await sleep(INTERVAL)
      retry++
    }
  }

  onUnmounted(() => {
    // 清理事件总线监听器
    if (updateAvgPriceOff) {
      updateAvgPriceOff()
    }
  })

  return {
    resetAvgPriceLineId: () => {
      lineId = '' as EntityId
    }
  }
}

export function useBotLimitLine(getWidget: () => IChartingLibraryWidget | null, getIsReady: () => boolean, showMarket: Ref<boolean>) {
  const route = useRoute()
  const tokenStore = useTokenStore()
  const botStore = useBotStore()
  const wsStore = useWSStore()
  const token = computed(() => {
    return route.params.id as string
  })

  const chain = computed(() => {
    return getAddressAndChainFromId(token.value)?.chain || tokenStore?.token?.chain || ''
  })

  const tokenAddress = computed(() => {
    return getAddressAndChainFromId(token.value)?.address || tokenStore?.token?.token
  })

  function getSwapTypeLabel(item: GetUserPendingTxRes[number]) {
    // const swapTypeMap = {
    //   1: t('buy'),
    //   2: t('sell'),
    //   3: 'Wrap',
    //   4: 'Unwrap',
    //   5: t('limitBuy1'),
    //   6: t('limitSell1'),
    //   7: t('followBuy'),
    //   8: t('followSell'),
    //   12: t('trailingStop'),
    //   13: t('listingOnDex'),
    //   14: t('devSell'),
    //   '-1': t('trailingStop')
    // } as const
    // if (swapTypeMap[swapType]) {
    //   return swapTypeMap[swapType]
    // }
    const { swapType, PriceLimit, inValue, inPrice, inAmount, inTokenDecimals, outTokenDecimals, triggerConfig } = item

    //  base transaction type
    let actionType = ''
    let isBuy = false
    if (swapType === 1 || swapType === 5 || swapType === 7) {
      actionType = t('limitBuy1') + ' $' + formatNumber(inValue, 2)
      return actionType
    } else {
      actionType = 'SELL'
    }

    //  calculate percentage and profit/loss
    const priceLimit = Number(PriceLimit) || 0
    const inValueNum = Number(inValue) || 0
    const inPriceNum = Number(inPrice) || 0
    const inAmountNum = Number(inAmount) || 0

    //  calculate percentage based on amount vs balance
    let percentage = ''
    if (inAmountNum > 0) {
      if (!triggerConfig) {
        const decimals = Number(inTokenDecimals || 18)
        const actualAmount = BigNumber(inAmountNum).div(new BigNumber(10).pow(decimals)).toNumber()
        return t('limitSell1') + ' ' + formatNumber(actualAmount, 3)
      }
      percentage = formatNumber(BigNumber(triggerConfig?.sellRatio || 0).div(100).toFixed(), 2) + '%'
    }

    //  calculate profit/loss
    let profitLoss = ''
    let profitLossPercentage = ''

    if (priceLimit > 0 && inPriceNum > 0) {
      const profitLossAmount = priceLimit - inPriceNum
      const profitLossPercent = BigNumber(triggerConfig?.priceChange || 0).div(100).toFixed()

      //  计算实际数量用于盈亏计算
      let actualAmount = 0
      if (isBuy) {
        //  买入交易使用原始数量
        actualAmount = inAmountNum
      } else {
        //  卖出交易需要除以decimals得到实际数量
        const decimals = Number(inTokenDecimals || 18)
        actualAmount = inAmountNum / Math.pow(10, decimals)
      }

      //  总盈亏金额 = 单位盈亏 × 数量
      const totalProfitLoss = profitLossAmount * actualAmount

      if (totalProfitLoss >= 0) {
        profitLoss = `+${formatNumber(totalProfitLoss, 2)}USD`
        profitLossPercentage = `(+${formatNumber(profitLossPercent, 0)}%)`
      } else {
        profitLoss = `${formatNumber(totalProfitLoss, 2)}USD`
        profitLossPercentage = `(${formatNumber(profitLossPercent, 0)}%)`
      }
    }

    //  determine TP (take profit) or SL (stop loss)
    let profitType = ''
    if (priceLimit > 0 && inPriceNum > 0) {
      if (isBuy) {
        //  buy order: price limit > entry price is TP, < entry price is SL
        profitType = priceLimit > inPriceNum ? 'TP' : 'SL'
      } else {
        //  sell order: price limit > entry price is TP, < entry price is SL
        profitType = priceLimit > inPriceNum ? 'TP' : 'SL'
      }
    }

    //  build final label
    let label = actionType

    //  buy orders only show the basic label
    if (isBuy) {
      return actionType
    }

    //  sell orders show detailed information
    if (percentage) {
      label += ` ${percentage}`
    }
    if (profitType) {
      label += ` ${profitType}`
    }
    if (profitLoss) {
      label += ` ${profitLoss}${profitLossPercentage}`
    }

    return label
  }


  type GetUserPendingTxRes = Awaited<ReturnType<typeof bot_getUserPendingTx>>
  const limitTxs = ref<GetUserPendingTxRes>([])
  const textShapeMap: Map<EntityId, GetUserPendingTxRes[number]> = new Map()
  let drawingEventWidget: IChartingLibraryWidget | null = null
  let isDrawingSubscribed = false
  const safeUnsubscribe = (widget: IChartingLibraryWidget) => {
    if (!isDrawingSubscribed) return
    try {
      widget?.unsubscribe?.('drawing_event', handlerLimitPriceLineRemove)
    } catch (err) {
      console.warn('tv unsubscribe drawing_event failed', err)
    }
    isDrawingSubscribed = false
  }

  function getData(isFirst = true) {
    if (!chain.value || !tokenAddress.value || !botStore.accessToken) return
    bot_getUserPendingTx({
      chain: chain.value,
      token: tokenAddress.value || '',
      walletAddress: botStore.userInfo?.addresses?.find(el => el.chain === chain.value)?.address || ''
    }).then(async res => {
      const res1 = res?.filter?.(i => (i.swapType !== 13 && i.swapType !== 14)) || []
      if (res1.length === limitTxs.value.length && isFirst) {
        await sleep(2000)
        getData(false)
      }
      limitTxs.value = res1
      createLimitPriceLinePoll(res1)
    })
  }

  let priceLimitLineIds: EntityId[] = []
  let priceLimitLineIds2: EntityId[] = []
  let isCreating = false
  const { t } = useI18n()
  // 创建 限价价格线
  async function createLimitPriceLine(priceList1: GetUserPendingTxRes) {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (!_widget || !chart) return
    let priceList: (GetUserPendingTxRes[number] & { price: number })[] = priceList1?.map(i => {
      return {
        ...i,
        price: Number(i?.PriceLimit || 0)
      }
    })?.filter(i => {
      return ![12, 13, 14].includes(i.swapType)
    })
    if (showMarket.value) {
      priceList = priceList1.map(i => {
        return {
          ...i,
          price: new BigNumber(i.PriceLimit).times(useTokenStore().circulation || '0')?.toNumber()
        }
      })
    }
    if (priceLimitLineIds.length > 0) {
      priceLimitLineIds.forEach(priceLimitLineId => {
        const line = chart?.getShapeById?.(priceLimitLineId)
        if (line) {
          chart?.removeEntity?.(priceLimitLineId)
        }
      })
      priceLimitLineIds = []
    }
    if (priceLimitLineIds2.length > 0) {
      priceLimitLineIds2.forEach(priceLimitLineId => {
        const line = chart?.getShapeById?.(priceLimitLineId)
        if (line) {
          chart?.removeEntity?.(priceLimitLineId)
        }
      })
      priceLimitLineIds2 = []
      textShapeMap.clear()
    }
    if (isCreating) return
    isCreating = true
    priceList.forEach(async (item) => {
      const priceLimitLineId = await chart?.createShape?.(
        { price: item.price, time: 0 }, // 水平线的起始位置
        {
          shape: 'horizontal_line',
          lock: true,
          disableSelection: true, // 允许选中
          disableSave: true,
          disableUndo: true,
          text: getSwapTypeLabel(item),
          overrides: {
            linecolor: '#FFBE3C',  // 线的颜色
            linewidth: 1,          // 线的粗细
            linestyle: 2,     // 线的样式：0表示实线，1表示虚线 2 长虚线
            textcolor: '#FFBE3C',
            showLabel: true,
            horzLabelsAlign: 'right',
            vertLabelsAlign: 'bottom',
            bold: true,
            fontSize: 12,
          }
        }
      )
      priceLimitLineIds.push(priceLimitLineId)
      const line = chart?.getShapeById?.(priceLimitLineId)
      if (!line) return
      // line?.setProperties?.({
      //   textcolor: '#FFBE3C',
      //   showLabel: true,
      //   horzLabelsAlign: 'right',
      //   vertLabelsAlign: 'bottom',
      //   bold: true,
      //   fontSize: 12,
      //   // italic: true,
      // })

      const priceLimitLineId2 = await chart?.createShape?.(
        { price: item.price, time: Math.floor(Date.now() / 1000) }, // 水平线的起始位置
        {
          shape: 'text',
          lock: true,
          disableSelection: true, // 允许选中
          disableSave: true,
          disableUndo: true,
          text: t('cancel'),
          overrides: {
            borderColor: '#F6465D',
            color: '#F6465D',
            fontsize: 12,
            horzLabelsAlign: 'right',
            vertLabelsAlign: 'bottom',
            bold: false,
            textcolor: '#F6465D',
            borderWidth: 1,
            drawBorder: true,
            showLabel: false
          }
        }
      )
      priceLimitLineIds2.push(priceLimitLineId2)
      const line2 = chart?.getShapeById?.(priceLimitLineId2)
      if (!line2) return
      textShapeMap.set(priceLimitLineId2, item)
      // line2?.setProperties?.({
      //   textcolor: '#F6465D',
      //   showLabel: false,
      //   horzLabelsAlign: 'right',
      //   vertLabelsAlign: 'bottom',
      //   bold: false,
      //   fontsize: 12,
      //   borderWidth: 1,
      //   drawBorder: true,
      //    horzTextAlign: 'right'
      //   // italic: true,
      // })
      // console.log('line2', line2.getProperties())

    })
    isCreating = false
  }

  let latestToken = 0           // 递增的版本号
  const MAX_RETRY = 5           // 最多轮询次数
  const INTERVAL = 2_000        // 轮询间隔（毫秒）
  // 封装原子操作获取token
  const getNextToken = () => {
    latestToken += 1
    return latestToken
  }
  async function createLimitPriceLinePoll(priceList: GetUserPendingTxRes) {
    const myToken = getNextToken()      // 取到“属于我自己”的版本号
    let retry = 0
    while (retry <= MAX_RETRY) {
      // 若我已不是最新调用，放弃执行
      if (myToken !== latestToken) break

      if (getIsReady()) {
        createLimitPriceLine(priceList)
        subscribeLimitPriceLineRemove()
        retry = 0
        break
      }

      await sleep(INTERVAL)
      retry++
    }
  }

  function subscribeLimitPriceLineRemove() {
    const _widget = getWidget()
    if (!_widget) return
    if (drawingEventWidget && drawingEventWidget !== _widget) {
      safeUnsubscribe(drawingEventWidget)
    }
    if (drawingEventWidget === _widget && isDrawingSubscribed) {
      return
    }
    _widget.subscribe('drawing_event', handlerLimitPriceLineRemove)
    drawingEventWidget = _widget
    isDrawingSubscribed = true
  }

  function handlerLimitPriceLineRemove(id: EntityId, type: DrawingEventType) {
    if (type === 'click' && textShapeMap.has(id)) {
      const item = textShapeMap.get(id)
      if (item) {
        console.log('取消订单', item)
        handleCancelOrder(item)
      }
    }
  }

  function handleCancelOrder(row: GetUserPendingTxRes[number]) {
    ElMessageBox.confirm(t('botCancelOrder'), '', {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel')
    })
      .then(async () => {
        console.log(row)
        await bot_cancelLimitOrdersByBatch({
          chain: row.chain,
          batchId: row.batchId
        })
        getData()
        useEventBus<string>('updateLimitOrder').emit(row.chain)
      }).catch(() => { })
  }

  // 保存事件总线监听器停止函数
  const updateKlineLimitLineOff = useEventBus<string>('updateKlineLimitLine').on(() => {
    getData()
  })

  function getDataTimer(interval = 500) {
    if (Timer) {
      clearTimeout(Timer)
      Timer = null
    }
    Timer = setTimeout(() => {
      getData()
    }, interval)
  }

  let Timer: ReturnType<typeof setTimeout> | null = null
  watch([chain, tokenAddress, () => botStore?.evmAddress, () => tokenStore.placeOrderUpdate, () => wsStore.wsResult?.tgbot], () => {
    getDataTimer(500)
  })

  watch(() => tokenStore.placeOrderSuccess, () => {
    getDataTimer(2000)
  })



  onMounted(() => {
    getData()
  })

  // 清理所有画线和相关状态
  function resetAllLimitLines(reason = '') {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (reason) {
      // eslint-disable-next-line no-console
      console.log('[resetAllLimitLines]', reason, {
        priceLimitLineIds: [...priceLimitLineIds],
        priceLimitLineIds2: [...priceLimitLineIds2],
        chartExists: !!chart
      })
    }
    if (_widget && chart) {
      priceLimitLineIds.forEach(id => {
        chart?.removeEntity?.(id)
      })
      priceLimitLineIds2.forEach(id => {
        chart?.removeEntity?.(id)
      })
    }
    priceLimitLineIds = []
    priceLimitLineIds2 = []
    textShapeMap.clear()
    limitTxs.value = []
  }

  // 监听 accessToken 变化，退出登录时清空所有画线
  watch(() => botStore.accessToken, (val, oldVal) => {
    if (!val && oldVal) {
      resetAllLimitLines('logout')
    }
  })

  onUnmounted(() => {
    // 清理事件总线监听器
    if (updateKlineLimitLineOff) {
      updateKlineLimitLineOff()
    }
    if (drawingEventWidget) {
      safeUnsubscribe(drawingEventWidget)
      drawingEventWidget = null
    }
    // 清理定时器
    if (Timer) {
      clearTimeout(Timer)
      Timer = null
    }
    resetAllLimitLines('onUnmounted')
  })

  return {
    limitTxs,
    getData,
    resetAllLimitLines
  }
}

export function setWatermark(_widget: IChartingLibraryWidget | null) {
  const _watermark = _widget?.watermark?.()
  _watermark?.color().setValue('#BCBED219')
  _watermark?.setContentProvider(() => {
    return [{
      /**
       * Text to be displayed.
       */
      text: 'AVE.AI',
      /**
       * Font size to be used (defined in pixels).
       */
      fontSize: 60,
      /**
       * Line height (defined in pixels).
       */
      lineHeight: 1,
      /**
       * Vertical offset distance (defined in pixels).
       */
      vertOffset: 1,
    }]
  })
  _watermark?.visibility().setValue(true)
}

export function useBotAvgPriceLine(getWidget: () => IChartingLibraryWidget | null, getIsReady: () => boolean, showMarket: Ref<boolean>, linesChecked: RemovableRef<{
  buy: {
    checked: boolean
    color: string
  }
  sell: {
    checked: boolean
    color: string
  }
  top100Buy: {
    checked: boolean
    color: string
  }
  top100Sell: {
    checked: boolean
    color: string
  }
}>) {
  const avePriceCache = {
    buyAvgPrice: 0,
    sellAvgPrice: 0
  }
  const lineIdObj = {
    sell: '' as EntityId,
    buy: '' as EntityId
  }
  let isCreating = false
  const { t } = useI18n()
  // 创建 限价价格线
  async function createAvgPriceLine(price: number, isBuy: boolean) {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (!_widget || !chart) return
    if (showMarket.value) {
      price = new BigNumber(price).times(useTokenStore().circulation || '0')?.toNumber()
    }
    const property = isBuy ? 'buy' : 'sell'
    const linecolor = isBuy ? (linesChecked.value.buy.color) : (linesChecked.value.sell.color)
    if (lineIdObj[property]) {
      const line = chart?.getShapeById?.(lineIdObj[property])
      if (line) {
        if (!price) {
          chart?.removeEntity?.(lineIdObj[property])
          lineIdObj[property] = '' as EntityId
          return
        }
        line?.setPoints?.([{ price: price, time: 0 }])
        line?.setProperties?.({
          linecolor,
          textcolor: linecolor,
        })
        return
      }
    } else {
      if (!price) return
    }
    if (isCreating) return
    isCreating = true
    lineIdObj[property] = await chart?.createShape?.(
      { price: price, time: 0 }, // 水平线的起始位置
      {
        shape: 'horizontal_line',
        lock: true,
        disableSelection: true, // 允许选中
        disableSave: true,
        disableUndo: true,
        text: isBuy ? t('buyPriceWithSlash') : t('sellPriceWithSlash'),
        overrides: {
          linecolor,  // 线的颜色
          linewidth: 1,          // 线的粗细
          linestyle: 1        // 线的样式：0表示实线，1表示虚线 2 长虚线
        },
      }
    )
    isCreating = false
    chart?.getShapeById?.(lineIdObj[property])?.setProperties?.({
      textcolor: linecolor,
      showLabel: true,
      horzLabelsAlign: 'right',
      vertLabelsAlign: 'bottom',
      bold: true,
      fontSize: 12,
      // italic: true,
    })
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const tokenStore = useTokenStore()
  const botStore = useBotStore()
  const wsStore = useWSStore()
  let timer: number | null = null
  let lastUpdateTime = 0
  const maxUpdateNum = 5
  const getAvgPrice = async () => {
    const res = await bot_getUserWalletTxInfo({
      user_address: botStore.userInfo?.addresses?.find(el => el.chain === tokenStore.token?.chain)?.address || '',
      chain: tokenStore.token?.chain || '',
      user_token: tokenStore.token?.token || ''
    })
    const needUpdate = +res?.[0]?.average_purchase_price_usd !== avePriceCache.buyAvgPrice || +res?.[0]?.average_sold_price_usd !== avePriceCache.sellAvgPrice
    avePriceCache.buyAvgPrice = +res?.[0]?.average_purchase_price_usd || 0
    avePriceCache.sellAvgPrice = +res?.[0]?.average_sold_price_usd || 0
    if (needUpdate) {
      createAvgPriceLinePoll(avePriceCache.buyAvgPrice, avePriceCache.sellAvgPrice)
    }
  }
  watch(() => [tokenStore.token?.token, botStore.userInfo], async ([val]) => {
    if (!val) return
    if (![...SupportFullDataChain, 'ton', 'polygon'].includes(tokenStore.token?.chain || '')) return
    getAvgPrice()
  }, { immediate: true })

  watch(() => wsStore.wsResult[WSEventType.TGBOT], val => {
    if (!val) {
      return
    }
    if (!timer) {
      timer = window.setInterval(() => {
        if (lastUpdateTime >= maxUpdateNum) {
          if (timer) {
            clearInterval(timer)
            timer = null
          }
          lastUpdateTime = 0
          return
        }
        getAvgPrice()
        lastUpdateTime += 1
      }, 2000)
    } else {
      lastUpdateTime = 0
    }
  })

  let avgPriceToken = 0  // 表示当前有效轮询的 token
  const MAX_RETRY = 5
  const INTERVAL = 2000

  async function createAvgPriceLinePoll(buyAvgPrice: number, sellAvgPrice: number) {
    const myToken = ++avgPriceToken  // 当前调用的唯一标识
    let retry = 0

    while (retry <= MAX_RETRY) {
      // 被后续调用覆盖，直接退出
      if (myToken !== avgPriceToken) return

      const isReady = getIsReady()
      if (isReady) {
        if (linesChecked.value.buy.checked) {
          await createAvgPriceLine(buyAvgPrice, true)
        }
        await sleep(100)
        if (linesChecked.value.sell.checked) {
          await createAvgPriceLine(sellAvgPrice, false)
        }
        return
      }

      await sleep(INTERVAL)
      retry++
    }
  }

  watch(() => linesChecked.value.buy.checked, val => {
    if (val && avePriceCache.buyAvgPrice) {
      createAvgPriceLine(avePriceCache.buyAvgPrice, true)
    } else {
      createAvgPriceLine(0, true)
    }
  })

  watch(() => linesChecked.value.sell.checked, val => {
    if (val && avePriceCache.sellAvgPrice) {
      createAvgPriceLine(avePriceCache.sellAvgPrice, false)
    } else {
      createAvgPriceLine(0, false)
    }
  })

  watch(() => linesChecked.value.buy.color, useDebounceFn(() => {
    if (linesChecked.value.buy.checked && avePriceCache.buyAvgPrice) {
      createAvgPriceLine(avePriceCache.buyAvgPrice, true)
    }
  }, 300))

  watch(() => linesChecked.value.sell.color, useDebounceFn(() => {
    if (linesChecked.value.sell.checked && avePriceCache.sellAvgPrice) {
      createAvgPriceLine(avePriceCache.sellAvgPrice, false)
    }
  }, 300))

  watch(()=>showMarket.value,()=>{
    if (linesChecked.value.buy.checked && avePriceCache.buyAvgPrice) {
      createAvgPriceLine(avePriceCache.buyAvgPrice, true)
    }
    if (linesChecked.value.sell.checked && avePriceCache.sellAvgPrice) {
      createAvgPriceLine(avePriceCache.sellAvgPrice, false)
    }
  })

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  })

  return {
    resetBotAvgLineId: () => {
      const _widget = getWidget()
      // const isReady = getIsReady()
      if (!_widget) return
      const chart = _widget?.activeChart?.()
      if (!chart) return
      if (lineIdObj.buy) {
        chart?.removeEntity?.(lineIdObj.buy)
      }
      if (lineIdObj.sell) {
        chart?.removeEntity?.(lineIdObj.sell)
      }
      lineIdObj.buy = '' as EntityId
      lineIdObj.sell = '' as EntityId
    }
  }
}

export function useKOLAvgPriceLine(getWidget: () => IChartingLibraryWidget | null, getIsReady: () => boolean, showMarket: Ref<boolean>, linesChecked: RemovableRef<{
  buy: {
    checked: boolean
    color: string
  }
  sell: {
    checked: boolean
    color: string
  }
  top100Buy: {
    checked: boolean
    color: string
  }
  top100Sell: {
    checked: boolean
    color: string
  }
  kol: {
    checked: boolean
    color: string
  }
}>,getStartTime: (endTime: number,scaleRatio?:number) => number) {
  let avePriceMap = {} as Record<string, { name: string, value: number, balance_ratio: number, lineId: EntityId, isCreating?: boolean }>
  let kolVisibleRangeUnsub: (() => void) | null = null

  function updateKOLLinesToVisibleRange(range?: { from: number; to: number }) {
    const chart = getWidget()?.activeChart?.()
    if (!chart) return
    const visibleRange = range ?? chart.getVisibleRange?.()
    if (!visibleRange?.from || !visibleRange?.to) return
    const spacing = getWidget()?.activeChart?.().getTimeScale?.().barSpacing?.()
    const timeFrom = getStartTime(visibleRange.to, spacing ? 240/spacing : undefined)
    if (!avePriceMap) return
    Object.values(avePriceMap).forEach(item => {
      if (!item.lineId) return
      const line = chart.getShapeById?.(item.lineId)
      if (!line) return
      const points = line.getPoints?.() ?? []
      const price = points[0]?.price
      if (price == null) return
      line.setPoints?.([{ price, time: timeFrom }])
    })
  }

  /** 缩放时更新 KOL 线位置（保持右侧比例） */
  const onKOLZoomChanged = useThrottleFn(() => {
    updateKOLLinesToVisibleRange()
  }, 1000/60)

  /** 可见范围变化时更新 KOL 线位置（拖动/缩放） */
 const onKOLLinesVisibleRangeChanged =  useThrottleFn((range: { from: number; to: number }) => {
    updateKOLLinesToVisibleRange(range)
  }, 1000/60)

  function subscribe() {
    const chart = getWidget()?.activeChart?.()
    // const timeScale = chart?.getTimeScale?.()
    if (chart?.onVisibleRangeChanged) {
      chart.onVisibleRangeChanged().subscribe(null, onKOLLinesVisibleRangeChanged)
    }
    if (chart?.getTimeScale?.().barSpacingChanged) {
      chart.getTimeScale().barSpacingChanged().subscribe(null, onKOLZoomChanged)
    }
  }

  // 创建持单价格线：用 trend_line 实现自定义宽度（右侧 30%），左侧「名称 + 持仓%」，右侧价格标签
  async function createAvgPriceLine() {
    const _widget = getWidget()
    const chart = _widget?.activeChart?.()
    if (!_widget || !chart) return
    const range = chart.getVisibleRange?.()
    if (!range?.from || !range?.to) return
    const spacing = getWidget()?.activeChart?.().getTimeScale?.().barSpacing?.()
    const timeFrom = getStartTime(range.to,spacing ? 240/spacing : undefined)
    if (!avePriceMap) return
    Object.values(avePriceMap).forEach(async item => {
      let price = item.value
      if (showMarket.value) {
        price = new BigNumber(price).times(useTokenStore().circulation || '0')?.toNumber()
      }
      if (item.lineId) {
        const line = chart?.getShapeById?.(item.lineId)
        if (line) {
          if (!price) {
            chart?.removeEntity?.(item.lineId)
            item.lineId = '' as EntityId
            return
          }
          line?.setPoints?.([{ price, time: timeFrom }])
          const leftLabel = `${item.name} ${(item.balance_ratio * 100).toFixed(2)}%`
          line?.setProperties?.({
            linecolor: linesChecked.value.kol.color,
            textcolor: linesChecked.value.kol.color,
            showLabel: true,
            showPriceLabels: true,
            horzLabelsAlign: 'left',
            vertLabelsAlign: 'middle',
            fontSize: 12,
            text: leftLabel,
          })
          return
        }
      } else if (!price) {
        return
      }

      if (item.isCreating) {
        return
      }
      item.isCreating = true

      const leftLabel = `${item.name} ${(item.balance_ratio * 100).toFixed(2)}%`
      item.lineId = await chart?.createMultipointShape?.(
        [{ price, time: timeFrom }],
        {
          shape: 'horizontal_ray',
          lock: true,
          disableSelection: true,
          disableSave: true,
          disableUndo: true,
          text: leftLabel,
          overrides: {
            linecolor: linesChecked.value.kol.color,
            linewidth: 1,
            linestyle: 1,
            extendLeft: false,
            extendRight: false,
          },
          zOrder:'top'
        }
      )
      item.isCreating = false
      chart?.getShapeById?.(item.lineId)?.setProperties?.({
        textcolor: linesChecked.value.kol.color,
        showLabel: true,
        showPriceLabels: true,
        horzLabelsAlign: 'left',
        vertLabelsAlign: 'middle',
        bold: false,
        fontSize: 12,
      })
    })
  }

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  let avgPriceToken = 0  // 表示当前有效轮询的 token
  const MAX_RETRY = 5
  const INTERVAL = 2000

  async function createAvgPriceLinePoll() {
    const myToken = ++avgPriceToken  // 当前调用的唯一标识
    let retry = 0

    while (retry <= MAX_RETRY) {
      // 被后续调用覆盖，直接退出
      if (myToken !== avgPriceToken) return

      const isReady = getIsReady()
      if (isReady) {
        if (linesChecked.value.kol.checked) {
        createAvgPriceLine()
         subscribe()
        }
        return
      }

      await sleep(INTERVAL)
      retry++
    }
  }

  const tokenStore = useTokenStore()
  watch(() => tokenStore.token?.token, async () => {
    if (!tokenStore.token?.token) return
    _getHoldersList({
      token_id: tokenStore.token?.token + '-' + tokenStore.token?.chain,
      tag_type: KOL_KEY
    }).then(res => {
      avePriceMap = res.holderStats?.filter?.(el => {
        return (el.avg_purchase_price || el.avg_sale_price) && el.balance_ratio > 0.003
      })?.reduce?.((acc, cur) => {
          acc[cur.holder] = {
            name: cur.wallet_logo.name || cur.holder.slice(0, 4) + '...' + cur.holder.slice(-4),
            value: cur.avg_purchase_price,
            balance_ratio: cur.balance_ratio ?? 0,
            lineId: '' as EntityId
          }
          return acc
        }, avePriceMap) || {}
      createAvgPriceLinePoll()
    }).catch((err) => {
      console.log(err)
    })
  }, { immediate: true })

  const resetKOLLine = () => {
    const _widget = getWidget()
    // const isReady = getIsReady()
    if (!_widget) return
    const chart = _widget?.activeChart?.()
    if (!chart) return
    if (!avePriceMap) return
    Object.values(avePriceMap).forEach(item => {
      if (item.lineId) {
        chart?.removeEntity?.(item.lineId)
        item.lineId = '' as EntityId
      }
    })
  }

  watch(() => linesChecked.value.kol.checked, val => {
    if (val) {
      createAvgPriceLine()
      kolVisibleRangeUnsub = () => {
        const c = getWidget()?.activeChart?.()
        c?.onVisibleRangeChanged?.().unsubscribe(null, onKOLLinesVisibleRangeChanged)
        c?.getTimeScale?.().barSpacingChanged?.().unsubscribe(null, onKOLZoomChanged)
        kolVisibleRangeUnsub = null
      }
    } else {
      kolVisibleRangeUnsub?.()
      resetKOLLine()
    }
  })

  watch(() => linesChecked.value.kol.color, useDebounceFn(() => {
    if (linesChecked.value.kol.checked) {
      createAvgPriceLine()
    }
  }, 300))

  watch(()=>showMarket.value,()=>{
    if (linesChecked.value.kol.checked) {
      createAvgPriceLine()
    }
  })

  return {
    resetKOLLine
  }
}
