// 创建 打点 切换按钮
import { filterLanguage } from './utils'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import type { IChartingLibraryWidget, Mark } from '~/types/tradingview/charting_library'
import { getUserKlineTxTags, getKlineProfilingTagsV2, type IGetKlineProfilingTagsV2Item,  type HolderBuy, type WalletLogo } from '@/api/token'
import type { SimpleWSTx, WSTx } from './types'
import { generateAvatarIcon1 as generateAvatarIcon } from '@/utils'

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

type HolderBuyData = HolderBuy & {wallet_address:string,wallet_logo:WalletLogo,remark?:string,txid?:string}

// 地址缩写函数
function formatAddress(address: string): string {
  if (!address || address.length <= 10) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

// 获取地址后四位（前面加*）
function getAddressLast4(address: string): string {
  if (!address || address.length < 4) return address
  return `*${address.slice(-4)}`
}

// 获取显示名称，优先显示备注，否则显示缩写地址
function getDisplayName(remark?: string, walletName?: string, address?: string, chain?: string): string {
  // 优先使用传入的remark
  if (remark && remark.trim()) {
    const trimmedRemark = remark.trim()
    // 如果有地址，在备注后面加括号显示地址后四位
    if (address) {
      const last4 = getAddressLast4(address)
      return `${trimmedRemark}(${last4})`
    }
    return trimmedRemark
  }

  // 尝试从本地存储获取备注
  if (address && chain) {
    try {
      const remarksStore = useRemarksStore()
      const localRemark = remarksStore.getRemarkByAddress({ address, chain })
      if (localRemark && localRemark.trim()) {
        const trimmedLocalRemark = localRemark.trim()
        // 在本地存储的备注后面加括号显示地址后四位
        const last4 = getAddressLast4(address)
        return `${trimmedLocalRemark}(${last4})`
      }
    } catch (error) {
      // 静默处理错误，不影响其他显示逻辑
    }
  }

  // 使用钱包名称，同时补充地址后四位，避免推送场景缺少地址识别
  if (walletName && walletName.trim()) {
    const trimmedWalletName = walletName.trim()
    if (address) {
      const last4 = getAddressLast4(address)
      return `${trimmedWalletName}(${last4})`
    }
    return trimmedWalletName
  }

  // 最后使用缩写地址
  if (address) return formatAddress(address)

  return ''
}

type TFormatTxsParams = {
  urlPrefix:string
  el: HolderBuyData
  side: 'buy' | 'sell'
  type: number | string
  name:string
  bucketTime:number
}

export function useKlineMarks() {
  const { t } = useI18n()
  const tokenStore = useTokenStore()
  const localeStore = useLocaleStore()
  const botStore = useBotStore()
  const walletStore = useWalletStore()
  const remarksStore = useRemarksStore()
  const globalStore = useGlobalStore()
  const wsStore = useWSStore()
  const klineMarkerAddress = inject<Ref<string>>(ProvideType.KLINE_MARKER_ADDRESS, ref(''))
  const klineFilterTxs = inject<Ref<any[]>>(ProvideType.KLINE_FILTER_TXS, ref([]))
  // 创建打点数据
  const marksTabs = computed(() => {
    const arr = (botStore?.evmAddress || walletStore?.address) ? [{ id: 'trade', name: t('mine') }] : []
    // 添加我的关注 tab
    if (botStore?.evmAddress || walletStore?.address) {
      arr.push({ id: '-100', name: t('myWatchlist') })
      arr.push({ id: '-101', name: t('myRemark') })
    }
    return arr.concat(tokenStore.totalHolders?.filter?.(i => (i?.total_address || 0) > 0 && ['16','19','25','30','31']?.includes(i.type))?.map?.((i) => ({
      id: i.type,
      name: i?.[filterLanguage(localeStore.locale)]
      // + (i.type !== '31' ? `(${i?.total_address})` : '')
    })))
  })

  const markTabsVisible = useLocalStorage('tv_markTabsVisible',true)
  const markTabsChecked: RemovableRef<{ [key: string]: boolean }> = useLocalStorage('tv_markTabsChecked', {
    trade: true,
    '-100': true,
    '-101': false,
    16: false,
    19: false,
    25: true,
    30: false,
    31: true
  })
  let myPortraitRefreshTimer: ReturnType<typeof setTimeout> | null = null
  let myPortraitCooldownUntil = 0
  let myPortraitBypassThrottleUntil = 0
  let myPortraitOnlyRefreshUntil = 0
  let portraitCacheOnlyRefreshUntil = 0
  let portraitCacheRefreshRetryTimer: ReturnType<typeof setTimeout> | null = null
  let rootNodeEl: HTMLElement | null = null
  const clearRootNodeHandler = () => {
    if (rootNodeEl) {
      rootNodeEl.onclick = null
      rootNodeEl = null
    }
  }

  function createDisplayButton(_widget: IChartingLibraryWidget | null,headerBtns: HTMLElement[]){
    const btn = _widget?.createButton()
    if (!btn) return
    btn.innerHTML = `<div style="cursor:pointer;display:flex;gap:8px;align-items:center">${t('display')}<svg xmlns="http://www.w3.org/2000/svg" width="9" height="6" viewBox="0 0 9 6" fill="#C8C7D8">
<path d="M0.801296 0C0.123025 0 -0.2475 0.791086 0.186718 1.31215L3.47869 5.26251C3.79852 5.64631 4.388 5.64631 4.70784 5.26251L7.99981 1.31215C8.43402 0.791085 8.0635 0 7.38523 0H0.801296Z" fill="#C8C7D8"/>
<script xmlns=""/></svg></div>`
    btn.onclick = (e) => {
      clearRootNodeHandler()
      const rect = btn.getBoundingClientRect()
      const x = rect.left - 320 + 44
      const y = rect.top + 34
      globalStore.klineSettingPop.position =
      [x,y]
      globalStore.klineSettingPop.visible = !globalStore.klineSettingPop.visible
      let rootNode = e.target as HTMLElement
      while(rootNode && !rootNode.classList.contains('chart-page')){
        rootNode = rootNode.parentElement as HTMLElement
      }
      if (!rootNode) return
      rootNodeEl = rootNode
      rootNodeEl.onclick= (rootEvent) => {
        if(rootEvent.currentTarget !== e.currentTarget){
          globalStore.klineSettingPop.visible = false
          clearRootNodeHandler()
        }
      }
    }
    headerBtns.push(btn)
    return btn.getBoundingClientRect()
  }

  // 创建 打点 切换按钮
  function createMarkButton(_widget: IChartingLibraryWidget | null, headerBtns: HTMLElement[]) {
    // const _widget = getWidget()
    const btn = _widget?.createButton()
    if (!btn) return
    marksTabs.value?.forEach(i => {
      const b1 = document.createElement('button')
      b1.style.display = 'flex'
      b1.style.alignItems = 'center'
      b1.style.cursor = 'pointer'
      b1.style.backgroundColor = 'transparent'
      b1.style.border = 'none'
      b1.style.outline = 'none'
      b1.style.fontSize = '12px'
      if (markTabsChecked.value?.[i?.id]) {
        b1.style.color = '#3F80F7'
      }
      b1.innerText = i.name
      btn.appendChild(b1)
      b1.onclick = () => {
        if (i.id === '-100' || i.id === '-101') {
          allowImmediateMyPortraitFetch()
        }
        if (markTabsChecked.value[i.id]) {
          markTabsChecked.value[i.id] = false
          b1.style.color = 'inherit'
          _widget?.activeChart?.()?.clearMarks?.()
        } else {
          markTabsChecked.value[i.id] = true
          b1.style.color = '#3F80F7'
          // 如果是我的关注标签，清除相关缓存以确保获取最新数据
          if (i.id === '-100') {
            const token = tokenStore?.token?.token
            const chain = tokenStore?.token?.chain
            const pair = tokenStore?.pairAddress
            const user = botStore?.evmAddress || walletStore?.address
            // 清除所有相关的缓存
            profilingMarksCache.forEach((value, key) => {
              if (key.startsWith(`${pair}-${chain}-${user}`) && key.includes(`-100-`)) {
                profilingMarksCache.delete(key)
              }
            })
          }
          // 如果是我的关注标签，清除相关缓存以确保获取最新数据
          if (i.id === '-101') {
            const token = tokenStore?.token?.token
            const chain = tokenStore?.token?.chain
            const pair = tokenStore?.pairAddress
            const user = botStore?.evmAddress || walletStore?.address
            // 清除所有相关的缓存
            marksMap.forEach((value, key) => {
              if (key.startsWith(`${pair}-${chain}-${user}`) && key.includes(`-101-`)) {
                marksMap.delete(key)
              }
            })
          }
        }
        _widget?.activeChart?.()?.refreshMarks?.()
      }
    })
    headerBtns.push(btn)
  }
  // “我的”
  const marksMap: Map<string, TradeData[]> = new Map()
  // 画像打点
  const profilingMarksCache: Map<string, any[]> = new Map()
  // websocket 增量画像缓存，不依赖 from/to
  const profilingLiveCache: Map<string, any[]> = new Map()
  const MAX_CACHE_SIZE = 50

  const touchCache = <T>(map: Map<string, T>, key: string): T | undefined => {
    if (!map.has(key)) return undefined
    const value = map.get(key)
    map.delete(key)
    map.set(key, value as T)
    return value
  }

  const setCache = <T>(map: Map<string, T>, key: string, value: T) => {
    if (map.has(key)) map.delete(key)
    map.set(key, value)
    if (map.size > MAX_CACHE_SIZE) {
      const oldestKey = map.keys().next().value
      if (oldestKey) map.delete(oldestKey)
    }
  }

  const clearMarkCaches = () => {
    marksMap.clear()
    profilingMarksCache.clear()
    profilingLiveCache.clear()
  }

  const cancelMyPortraitRefresh = () => {
    if (myPortraitRefreshTimer) {
      clearTimeout(myPortraitRefreshTimer)
      myPortraitRefreshTimer = null
    }
    myPortraitCooldownUntil = 0
    myPortraitBypassThrottleUntil = 0
    myPortraitOnlyRefreshUntil = 0
  }

  const cancelPortraitCacheRefresh = () => {
    portraitCacheOnlyRefreshUntil = 0
    if (portraitCacheRefreshRetryTimer) {
      clearTimeout(portraitCacheRefreshRetryTimer)
      portraitCacheRefreshRetryTimer = null
    }
  }

  const resetMarkRefreshState = () => {
    cancelMyPortraitRefresh()
    cancelPortraitCacheRefresh()
  }

  watch(() => tokenStore.token?.token, () => {
    clearMarkCaches()
    resetMarkRefreshState()
  })

  onUnmounted(() => {
    clearRootNodeHandler()
    resetMarkRefreshState()
  })
  type MigratedType = {
      migrate_time: number
      migrate_uprice: string
      showMarket: boolean
      mcap: number
  }

  const getProfilingCacheKey = ({
    pair,
    chain,
    user,
    interval,
    type,
    from,
    to
  }: {
    pair: string
    chain: string
    user: string
    interval: string
    type: string
    from: number
    to: number
  }) => `${pair}-${chain}-${user}-${interval}-${type}-${from}-${to}`

  const getProfilingLiveCacheKey = ({
    pair,
    chain,
    user,
    interval,
    type
  }: {
    pair: string
    chain: string
    user: string
    interval: string | number
    type: string
  }) => `${pair}-${chain}-${user}-${interval}-${type}`

  const findReusableCacheKey = <T>(map: Map<string, T>, prefix: string, from: number, to: number) => {
    for (const key of Array.from(map.keys()).reverse()) {
      if (!key.startsWith(prefix)) continue
      const match = key.match(/-(\d+)-(\d+)$/)
      if (!match) continue
      const cachedFrom = Number(match[1])
      const cachedTo = Number(match[2])
      if (cachedFrom <= from && cachedTo >= to) {
        return key
      }
    }
  }

  const normalizeKlineTime = (time: number | string | undefined | null) => {
    const normalized = Number(time || 0)
    if (!normalized) return 0
    return String(Math.trunc(normalized)).length > 10 ? Math.floor(normalized / 1000) : Math.floor(normalized)
  }

  const getBucketTime = (time: number | string | undefined | null, interval: number | string) => {
    const normalizedTime = normalizeKlineTime(time)
    const normalizedInterval = Number(interval) || 1
    return Math.floor(normalizedTime / normalizedInterval) * normalizedInterval
  }

  const filterTradeDataByRange = (data: TradeData[], from: number, to: number, interval: number | string) => {
    return data.filter(item => {
      const bucketTime = getBucketTime(item.time, interval)
      return bucketTime >= from && bucketTime <= to
    })
  }

  const filterProfilingDataByRange = <T extends IGetKlineProfilingTagsV2Item>(data: T[], from: number, to: number, interval: number | string) => {
    return data.filter(item => {
      const holders = item.holders || []
      if (holders.length === 0) {
        const bucketTime = getBucketTime(item.time, interval)
        return bucketTime >= from && bucketTime <= to
      }
      return holders.some(holder => {
        const buyBucketTime = getBucketTime(holder.buy?.tx_time, interval)
        const sellBucketTime = getBucketTime(holder.sell?.tx_time, interval)
        return (buyBucketTime >= from && buyBucketTime <= to) ||
          (sellBucketTime >= from && sellBucketTime <= to)
      })
    })
  }

  const loadProfilingMarksData = async ({
    from,
    to,
    interval,
    pair,
    chain,
    token,
    user,
    type,
    isTokenKline
  }: {
    from: number
    to: number
    interval: string
    pair: string
    chain: string
    token: string
    user: string
    type: string
    isTokenKline: boolean
  }) => {
    const id = getProfilingCacheKey({ pair, chain, user, interval, type, from, to })
    const cachePrefix = `${pair}-${chain}-${user}-${interval}-${type}-`
    const isMyPortraitType = type === '-100' || type === '-101'
    const selfAddress = botStore?.evmAddress || walletStore?.address || ''

    if (isMyPortraitType && !selfAddress) {
      return []
    }

    if (!isMyPortraitType && profilingMarksCache.has(id)) {
      const res = touchCache(profilingMarksCache, id) || []
      if (res.length > 0) return res as IGetKlineProfilingTagsV2Item[]
      profilingMarksCache.delete(id)
    }

    const reusableKey = isMyPortraitType
      ? undefined
      : findReusableCacheKey(profilingMarksCache, cachePrefix, from, to)
    if (reusableKey) {
      const res = touchCache(profilingMarksCache, reusableKey) || []
      const filteredRes = filterProfilingDataByRange(res as IGetKlineProfilingTagsV2Item[], from, to, interval)
      if (filteredRes.length > 0) return filteredRes
    }

    if (!isMyPortraitType) {
      const liveKey = getProfilingLiveCacheKey({ pair, chain, user, interval, type })
      if (profilingLiveCache.has(liveKey)) {
        const liveRes = touchCache(profilingLiveCache, liveKey) || []
        const filteredLiveRes = filterProfilingDataByRange(liveRes as IGetKlineProfilingTagsV2Item[], from, to, interval)
        if (filteredLiveRes.length > 0) {
          return filteredLiveRes
        }
      }
    }

    const now = Date.now()
    if (
      isMyPortraitType
      && now < myPortraitCooldownUntil
      && now >= myPortraitBypassThrottleUntil
    ) {
      return []
    }

    const data = {
      from,
      to,
      interval,
      type,
      ...(!isTokenKline && {
        pair_id: pair + '-' + chain,
      }),
      ...(isTokenKline && {
        token_id: token,
      }),
      ...(isMyPortraitType && {
        self_address: selfAddress
      }),
    }
    const res = await getKlineProfilingTagsV2(data)
    const cacheArr = Array.isArray(res)
      ? res.map(el => ({
        ...el,
        type
      }))
      : []
    const dedupedCacheArr = dedupeProfilingCacheItems(cacheArr)
    setCache(profilingMarksCache, id, dedupedCacheArr)
    if (!isMyPortraitType) {
      const liveKey = getProfilingLiveCacheKey({ pair, chain, user, interval, type })
      const existingLive = profilingLiveCache.get(liveKey) || []
      setCache(profilingLiveCache, liveKey, dedupeProfilingCacheItems([...(existingLive as any[]), ...dedupedCacheArr]))
    }
    return dedupedCacheArr as IGetKlineProfilingTagsV2Item[]
  }

  const getProfilingMarkDedupKey = (mark: { tx_time: number; user_address: string; id: string; txid?: string }) => {
    if (mark.txid) return mark.txid
    const side = mark.id.includes('-buy-') ? 'buy' : 'sell'
    return `${mark.tx_time}-${side}-${mark.user_address}`
  }

  const getProfilingCacheItemDedupKey = (item: IGetKlineProfilingTagsV2Item & { type?: string }) => {
    const holder = item.holders?.[0]
    const txid = holder?.buy?.txid || holder?.sell?.txid
    if (txid) return txid
    const side = holder?.buy ? 'buy' : holder?.sell ? 'sell' : 'unknown'
    const txTime = holder?.buy?.tx_time || holder?.sell?.tx_time || item.time
    return `${item.type || ''}-${txTime}-${side}-${holder?.wallet_address || ''}`
  }

  const dedupeProfilingCacheItems = <T extends IGetKlineProfilingTagsV2Item & { type?: string }>(items: T[]) => {
    const seen = new Set<string>()
    return items.filter((item) => {
      const key = getProfilingCacheItemDedupKey(item)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const mergeProfilingCacheData = <T extends IGetKlineProfilingTagsV2Item & { type?: string }>(...groups: T[][]) => {
    return dedupeProfilingCacheItems(groups.flat().filter(Boolean))
  }

  const dedupeProfilingMarks = (marks: (Mark & { tx_time: number; user_address: string; txid?: string })[]) => {
    const seen = new Set<string>()
    return marks.filter((mark) => {
      const key = getProfilingMarkDedupKey(mark)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const pickMarkTabName = (id: string) => marksTabs.value.find(tab => tab.id === id)?.name || ''
  const isMyPortraitTabChecked = () => !!(markTabsChecked.value?.['-100'] || markTabsChecked.value?.['-101'])

  const clearMyPortraitCaches = ({
    pair,
    chain,
    user
  }: {
    pair: string
    chain: string
    user: string
  }) => {
    profilingMarksCache.forEach((value, key) => {
      if (!key.startsWith(`${pair}-${chain}-${user}-`)) return
      if (key.includes(`-100-`) || key.includes(`-101-`)) {
        profilingMarksCache.delete(key)
      }
    })
  }

  const scheduleMyPortraitRefresh = ({
    pair,
    chain,
    user,
    widget
  }: {
    pair: string
    chain: string
    user: string
    widget: IChartingLibraryWidget | null
  }) => {
    if (!isMyPortraitTabChecked() || !pair || !chain || !user) return
    if (myPortraitRefreshTimer) return
    const now = Date.now()
    const delay = myPortraitCooldownUntil > now
      ? myPortraitCooldownUntil - now
      : (myPortraitCooldownUntil === 0 ? 2000 : 0)
    myPortraitRefreshTimer = setTimeout(() => {
      myPortraitRefreshTimer = null
      clearMyPortraitCaches({ pair, chain, user })
      const triggerAt = Date.now()
      myPortraitBypassThrottleUntil = triggerAt + 3000
      myPortraitCooldownUntil = triggerAt + 10000
      myPortraitOnlyRefreshUntil = triggerAt + 3000
      widget?.activeChart?.()?.refreshMarks?.()
    }, delay)
  }

  const allowImmediateMyPortraitFetch = () => {
    if (myPortraitRefreshTimer) {
      clearTimeout(myPortraitRefreshTimer)
      myPortraitRefreshTimer = null
    }
    myPortraitCooldownUntil = 0
    myPortraitBypassThrottleUntil = Date.now() + 3000
  }

  const schedulePortraitCacheRefresh = (widget: IChartingLibraryWidget | null) => {
    portraitCacheOnlyRefreshUntil = Date.now() + 3000
    widget?.activeChart?.()?.refreshMarks?.()
    if (portraitCacheRefreshRetryTimer) {
      clearTimeout(portraitCacheRefreshRetryTimer)
    }
    portraitCacheRefreshRetryTimer = setTimeout(() => {
      portraitCacheOnlyRefreshUntil = Date.now() + 3000
      widget?.activeChart?.()?.refreshMarks?.()
      portraitCacheRefreshRetryTimer = null
    }, 600)
  }

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

  function getMarks({from, to, interval, onDataCallback, pair, chain, token, user, migrated}: {
    from: number
    to: number
    interval: string
    onDataCallback: (marks: any[]) => void;
    pair: string;
    chain: string;
    token: string;
    user: string;
    migrated: MigratedType
  }) {

    const isTokenKline = tokenStore?.selectedToken
    // console.log('----------migrate_uprice-2----------', migrated, tokenStore?.selectedToken)
    if (migrated?.migrate_time && isTokenKline) {
      getMigrated(onDataCallback, migrated, Number(interval))
    }

    const filterAddress = klineMarkerAddress.value
    const isFilteringByAddress = !!filterAddress
    // 当按地址筛选时，直接将 filterTableList 的交易数据显示为 K 线打点，跳过画像打点避免重复（不受 markTabsVisible 控制）
    if (isFilteringByAddress && klineFilterTxs.value.length > 0) {
      const filterMarks = formatFilterTxsToMarks(klineFilterTxs.value, interval, from, to)
      if (filterMarks.length > 0) {
        onDataCallback(filterMarks)
      }
      return
    }

    if (!markTabsVisible.value) return
    const now = Date.now()
    const isMyPortraitOnlyRefresh = now < myPortraitOnlyRefreshUntil
    const isPortraitCacheOnlyRefresh = now < portraitCacheOnlyRefreshUntil
    const isMyWatchlistChecked = isFilteringByAddress || !!markTabsChecked.value?.['-100']
    const isMyRemarkChecked = isFilteringByAddress || !!markTabsChecked.value?.['-101']

    if ((isMyWatchlistChecked || isMyRemarkChecked) && !isPortraitCacheOnlyRefresh) {
      Promise.all([
        isMyWatchlistChecked
          ? loadProfilingMarksData({ from, to, interval, pair, chain, token, user, type: '-100', isTokenKline })
          : Promise.resolve([]),
        isMyRemarkChecked
          ? loadProfilingMarksData({ from, to, interval, pair, chain, token, user, type: '-101', isTokenKline })
          : Promise.resolve([]),
      ]).then(([watchlistRes, remarkRes]) => {
        const mergedMarks = dedupeProfilingMarks([
          ...formatProfilingToMarks(remarkRes || [], interval, '-101', pickMarkTabName('-101')),
          ...formatProfilingToMarks(watchlistRes || [], interval, '-100', pickMarkTabName('-100')),
        ])
        onDataCallback(mergedMarks)
      })
    }
    marksTabs.value.forEach((v) => {
      if (v.id === '-100' || v.id === '-101') return
      if (isMyPortraitOnlyRefresh) return
      // 当按地址筛选时，跳过 trade 类型（聚合数据无法按地址过滤）
      if (isFilteringByAddress && v.id === 'trade') return
      const isTabActive = isFilteringByAddress || !!markTabsChecked.value?.[v.id]
      const id = pair + '-' + chain + '-' + user + '-' + interval + '-' + v.id + '-' + from + '-' + to
      const cachePrefix = `${pair}-${chain}-${user}-${interval}-${v.id}-`
      const liveKey = getProfilingLiveCacheKey({ pair, chain, user, interval, type: String(v.id) })
      if (marksMap.has(id) && isTabActive) {
        const res = touchCache(marksMap, id)
        const marks = formatToMarks(res || [], interval, v.id, v.name)
        onDataCallback(marks || [])
        return
      }
      const reusableTradeKey = findReusableCacheKey(marksMap, cachePrefix, from, to)
      if (reusableTradeKey && isTabActive) {
        const res = touchCache(marksMap, reusableTradeKey) || []
        const filteredRes = filterTradeDataByRange(res as TradeData[], from, to, interval)
        if (filteredRes.length > 0) {
          const marks = formatToMarks(filteredRes, interval, v.id, v.name)
          onDataCallback(marks || [])
          return
        }
      }
      // 如果缓存存在但数据为空，强制重新请求
      if(profilingMarksCache.has(id) && isTabActive) {
        const res = touchCache(profilingMarksCache, id) || []
        // 如果缓存数据为空，清除缓存并重新请求
        if(res.length === 0) {
          profilingMarksCache.delete(id)
        } else {
          const liveRes = profilingLiveCache.has(liveKey) ? (touchCache(profilingLiveCache, liveKey) || []) : []
          const mergedRes = mergeProfilingCacheData(res, filterProfilingDataByRange(liveRes, from, to, interval))
          const marks = formatProfilingToMarks(mergedRes, interval, v.id, v.name)
          onDataCallback(marks)
          return
        }
      }
      const reusableProfilingKey = findReusableCacheKey(profilingMarksCache, cachePrefix, from, to)
      if(reusableProfilingKey && isTabActive && v.id !== '-100' && v.id !== '-101') {
        const res = touchCache(profilingMarksCache, reusableProfilingKey) || []
        const filteredRes = filterProfilingDataByRange(res, from, to, interval)
        const liveRes = profilingLiveCache.has(liveKey) ? (touchCache(profilingLiveCache, liveKey) || []) : []
        const mergedRes = mergeProfilingCacheData(filteredRes, filterProfilingDataByRange(liveRes, from, to, interval))
        if (mergedRes.length > 0) {
          const marks = formatProfilingToMarks(mergedRes, interval, v.id, v.name)
          onDataCallback(marks)
          return
        }
      }
      if (profilingLiveCache.has(liveKey) && isTabActive && v.id !== '-100' && v.id !== '-101') {
        const res = touchCache(profilingLiveCache, liveKey) || []
        const filteredRes = filterProfilingDataByRange(res, from, to, interval)
        if (filteredRes.length > 0) {
          const marks = formatProfilingToMarks(filteredRes, interval, v.id, v.name)
          onDataCallback(marks)
          return
        }
      }
      if (isPortraitCacheOnlyRefresh) return
      if (v.id === 'trade' && isTabActive) {
        let data = {
          from,
          to,
          interval,
          token_address: token,
          user_address: user,
          pair: pair + '-' + chain
        }
        getUserKlineTxTags(data).then((res) => {
          const marks = formatToMarks(res, interval, v.id, v.name)
          setCache(marksMap, id, res || [])
          onDataCallback(marks || [])
        })
      } else if (isTabActive) {
        let data = {
          from,
          to,
          interval,
          type: v.id,
          ...(!isTokenKline && {
            pair_id: pair + '-' + chain,
          }),
          ...(isTokenKline && {
            token_id: token,
          }),
          // 添加 self_address 参数用于我的关注
          ...((v.id === '-100' || v.id === '-101') && {
            self_address: botStore?.evmAddress || walletStore?.address
          }),
        }
        getKlineProfilingTagsV2(data).then((res) => {
          if (Array.isArray(res)) {
            const marks = formatProfilingToMarks(res || [], interval, v.id, v.name)
            const cacheArr = (res||[]).map(el=>{
              return {
                ...el,
                type:v.id
              }
            })
            setCache(profilingMarksCache, id, cacheArr)
            onDataCallback(marks || [])
          }
        })
      }
    })
  }
  function getMigrated(onDataCallback: (marks: any[]) => void, migrated: MigratedType, interval: number) {
    let result: Mark[] = []
    const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
    const tick = Math.max(1, interval)
    const markTime = Math.floor(migrated.migrate_time / tick) * tick // 按当前周期对齐到本根柱子
    result = [
      {
        id: `${migrated.migrate_time}-${migrated.migrate_uprice}-migrated`,
        time: markTime,
        color: { background: 'transparent', border: 'transparent' },
        imageUrl: `${urlPrefix}signals/marks/mark-m.png`,
        label: 'M',
        labelFontColor: '#fff',
        minSize: 20,
        hoveredBorderWidth: 0,
        // position: isBuy ? 'below' : 'above',
        borderWidth: 0,
        text: `${formatDate(migrated.migrate_time * 1000, 'YYYY-MM-DD HH:mm:ss')} ${t('migratedTo')}
          ${migrated.showMarket ? `${t('migratedMCap')}: $${formatNumber(migrated.mcap, 2)}` : `${t('migratedPrice')}: ${migrated.migrate_uprice ? '$' + formatNumber(migrated.migrate_uprice || 0) : '--'}`} `,
        showLabelWhenImageLoaded: false,
      },
    ]
    onDataCallback(result || [])
  }


  function formatProfilingToMarks(
    data: IGetKlineProfilingTagsV2Item[],
    interval: number | string,
    type: keyof typeof markTabsChecked.value,
    name: string
  ) {
    const result: (Mark & { tx_time: number,user_address:string,txid?:string })[] = []
    const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
    const interval1 = Number(interval)
    const filterAddress = klineMarkerAddress.value
    for(const item of data){
      const bucketTime = Math.floor(item.time / interval1) * interval1
      for(const holder of item.holders){
        // 当 klineMarkerAddress 有值时，只显示此地址的打点
        if(filterAddress && holder.wallet_address !== filterAddress) continue
        const {wallet_address,wallet_logo,remark} = holder
        if(holder.buy){
          result.push(formatTxsObj({
            el:{...holder.buy,wallet_address,wallet_logo,remark},
            side:'buy',
            type,
            name,
            bucketTime,
            urlPrefix
          }))
        }
        if(holder.sell){
          result.push(formatTxsObj({
            el:{...holder.sell,wallet_address,wallet_logo,remark},
            side:'sell',
            type,
            name,
            bucketTime,
            urlPrefix
          }))
        }
      }
    }
    return result
  }

  // 将 filterTableList 的交易数据转换为 K 线打点（按地址筛选时使用）
  function formatFilterTxsToMarks(
    txs: any[],
    interval: number | string,
    from: number,
    to: number
  ) {
    const result: (Mark & { tx_time: number; user_address: string; txid?: string })[] = []
    const interval1 = Number(interval)
    const chain = tokenStore?.token?.chain

    for (const tx of txs) {
      const bucketTime = Math.floor(tx.time / interval1) * interval1
      // 过滤不在当前可视时间范围内的交易
      if (bucketTime < from || bucketTime > to) continue

      let isBuyTx = false
      let side: 'buy' | 'sell' = 'sell'
      let volume = 0
      let amount = 0
      let price = 0
      let typeLabel = ''

      if ('direction' in tx && tx.direction) {
        // IGetSimpleTxsResponse 交易数据
        isBuyTx = tx.direction === 'buy'
        side = isBuyTx ? 'buy' : 'sell'
        amount = Number(tx.target_amt || 0)
        price = Number(tx.target_price_u || 0)
        volume = amount * price
      } else if ('type' in tx && tx.type) {
        // GetPairLiqResponse 流动性数据
        if (tx.type === 'addLiquidity' || tx.type === 'CreatePair') {
          side = 'buy'
          isBuyTx = true
          typeLabel = tx.type === 'CreatePair' ? t('CreatePair') : t('addLiq')
        } else {
          side = 'sell'
          isBuyTx = false
          typeLabel = tx.type === 'removeLiquidity' ? t('removeLiq') : (tx.type === 'CollectFee' ? t('CollectFee') : tx.type)
        }
        volume = (tx.amount0 || 0) * (tx.token0_price_usd || 0) + (tx.amount1 || 0) * (tx.token1_price_usd || 0)
        amount = volume
        price = amount > 0 ? volume / amount : 0
      } else {
        continue
      }

      const walletAddr = tx.wallet_address || tx.sender || ''
      const displayName = getDisplayName(tx.remark, undefined, walletAddr, chain)
      const txid = tx.txhash || tx.transaction || tx.uuid || ''
      const markId = `${tx.time}-${side}-${txid}`

      // 使用 generateAvatarIcon 生成头像图标
      const imageUrl = generateAvatarIcon(tx.remark || walletAddr || '')
      const borderColor = isBuyTx ? '#12B886' : '#F6465D'

      const swapType = typeLabel || (isBuyTx ? t('bought') : t('sold'))
      const tooltipText = typeLabel
        ? `${displayName || formatAddress(walletAddr)} ${typeLabel}
          ${t('amountU')}: $${formatNumber(volume, 2)}
          ${formatDate(tx.time, 'YYYY-MM-DD HH:mm')}`
        : `${displayName || formatAddress(walletAddr)} ${swapType}
          ${t('amountB')}: ${formatNumber(amount, 2)}
          ${t('amountU')}: $${formatNumber(volume, 2)}
          ${t('price')}: $${formatNumber(price, 4)}
          ${formatDate(tx.time, 'YYYY-MM-DD HH:mm')}`

      result.push({
        id: markId,
        time: bucketTime,
        color: { background: 'transparent', border: borderColor },
        imageUrl,
        label: isBuyTx ? 'B' : 'S',
        labelFontColor: '#fff',
        minSize: volume >= 2000 ? 30 : 25,
        hoveredBorderWidth: 2,
        borderWidth: 2,
        text: tooltipText,
        showLabelWhenImageLoaded: false,
        user_address: walletAddr,
        tx_time: tx.time,
        txid,
      })
    }

    return result
  }

  function formatTxsObj({
    el,
    side,
    type,
    urlPrefix,
    name,
    bucketTime
  }:TFormatTxsParams) {
      const isBuy = side === 'buy'
      const isKOL = type === '31'
      const isMyWatchlist = type === '-100'
      const isMyRemark = type === '-101'
      let imageUrl = isBuy
      ? `${urlPrefix}signals/marks/mark-buy-${type}.png`
      : `${urlPrefix}signals/marks/mark-sell-${type}.png`
      if(el.wallet_logo?.logo && ['.png', '.jpg', '.jpeg', '.gif', '.webp'].some((ext) => el.wallet_logo.logo.includes(ext))){
        imageUrl = el.wallet_logo.logo
      } else if((isMyWatchlist || isMyRemark) && !el.wallet_logo?.logo) {
        // 对于我的关注，如果 logo 不存在，使用 generateAvatarIcon
        imageUrl = generateAvatarIcon(el.remark || el.wallet_address || '')
      }
      let borderColor = 'transparent'
      let borderWidth = 0
      if(isKOL || isMyWatchlist || isMyRemark){
        borderWidth = 2
        if(isBuy){
          borderColor = '#12B886'
        }else {
          borderColor = '#F6465D'
        }
      }

      const markId = el.txid
        ? `${el.tx_time}-${side}-${type}-${el.txid}`
        : ((isMyWatchlist || isMyRemark)
          ? `${el.tx_time}-${side}-${el.wallet_address}`
          : `${el.tx_time}-${side}-${type}`)

      return {
        id: markId,
        time: bucketTime,
        color: { background: 'transparent', border: borderColor },
        imageUrl,
        label: isBuy ? 'B' : 'S',
        labelFontColor: '#fff',
        minSize: Number(el.volume) >= 2000 ? 30 : 25,
        hoveredBorderWidth: borderWidth,
        borderWidth: borderWidth,
        text:getTooltipTxt(name, type, el, isBuy,bucketTime),
        showLabelWhenImageLoaded: false,
        user_address:el.wallet_address,
        tx_time:el.tx_time,
        txid: el.txid
      }
  }

  function getTooltipTxt(name:string, type:number|string, el:HolderBuyData,isBuy:boolean,bucketTime:number) {
    const swapType = isBuy ? t('bought') : t('sold')
    const formatedName = name?.replace(/\(.*\)$/, '')
    // 获取当前链信息
    const chain = tokenStore?.token?.chain
    // 获取显示名称，优先显示备注，否则显示缩写地址
    const displayName = getDisplayName(el.remark, el.wallet_logo?.name, el.wallet_address, chain)

    // 处理聪明钱
    if(Number(type) === 30) {
      const swapType = isBuy ? t('netInflow') : t('netOutflow')
      const flowText = isBuy ? t('inflow') : t('outflow')
      const AvgTxt = isBuy ? t('campaignBuyAvg') : t('campaignSellAvg')
      return `${displayName || formatedName} ${swapType}
        ${flowText}: ${formatNumber(el.volume, 2)}(${formatNumber(el.txns, 0)})
        ${AvgTxt}: $${formatNumber(Number(el.volume) / (Number(el.amount) || 1), 4)}
        ${swapType}: ${formatNumber(el.volume, 2)}
        ${formatDate(el.tx_time, 'YYYY-MM-DD HH:mm')}
      `
    }
    return `${displayName || formatedName} ${swapType}
        ${t('amountB')}: ${formatNumber(el.amount, 2)}
        ${t('amountU')}: $${formatNumber(el.volume, 2)}
        ${t('price')}: $${formatNumber(Number(el.volume) / (Number(el.amount) || 1), 4)}
        ${t('Txs')}: ${formatNumber(el.txns)}
        ${formatDate(el.tx_time, 'YYYY-MM-DD HH:mm')}
        `
  }

  function formatToMarks(
    data: TradeData[],
    interval: number | string,
    type: keyof typeof markTabsChecked.value,
    name: string
  ): Mark[] {
    // const t = getGlobalT()
    const result: Mark[] = []
    const bucketMap: Record<string, { time: number; side: 'buy' | 'sell'; amount: number; txns: number; volume: number; buyAmount?: number; sellAmount?: number; buyTxns?: number; sellTxns?: number; buyVolume?: number; sellVolume?: number }> = {}
    const urlPrefix = useConfigStore().globalConfig?.token_logo_url || 'https://www.iconaves.com/'
    // First pass: Aggregate data into buckets
    const interval1 = Number(interval)
    for (const item of data) {
      const bucketTime = Math.floor(item.time / interval1) * interval1
      if (Number(type) === 30) {
        // 算出净流入(buy - sell)/净流出(sell - buy)
        const bV = item?.buy?.volume || 0
        const sV = item?.sell?.volume || 0
        const key = `${bucketTime}-${bV > sV ? 'buy' : 'sell'}`
        const entry = bucketMap[key] ??= { time: bucketTime, side: bV > sV ? 'buy' : 'sell', amount: 0, txns: 0, volume: 0, buyAmount: 0, sellAmount: 0, buyTxns: 0 }
        entry.buyAmount = item?.buy?.amount || 0
        entry.sellAmount = item?.sell?.amount || 0
        entry.amount = Math.abs(entry.buyAmount - entry.sellAmount)
        entry.buyTxns = item?.buy?.txns || 0
        entry.sellTxns = item?.sell?.txns || 0
        entry.txns = entry.buyTxns + entry.sellTxns
        entry.volume = Math.abs(bV - sV)
        entry.buyVolume = item?.buy?.volume || 0
        entry.sellVolume = item?.sell?.volume || 0
      } else {
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
    }

    // Second pass: Convert aggregated data into mark format
    for (const entry of Object.values(bucketMap)) {
      const isBuy = entry.side === 'buy'
      result.push({
        id: `${entry.time}-${entry.side}-${type}`,
        time: entry.time,
        // type: 'trade',
        color: { background: 'transparent', border: 'transparent' },
        imageUrl:
        isBuy
          ? `${urlPrefix}signals/marks/mark-buy-${type}.png`
          : `${urlPrefix}signals/marks/mark-sell-${type}.png`,
        label: isBuy ? 'B' : 'S',
        labelFontColor: '#fff',
        minSize: 20,
        hoveredBorderWidth: 0,
        // position: isBuy ? 'below' : 'above',
        borderWidth: 0,
        text: getMarkTooltipContent(entry, type, name),
        showLabelWhenImageLoaded: false,
      })
    }

    // Sorting only at the end
    return result.sort((a, b) => a.time - b.time)
  }
  function getMarkTooltipContent(entry: {
    volume: number
    time: number
    side: 'buy' | 'sell'
    amount: number
    txns: number
    buyAmount?: number
    sellAmount?: number
    buyTxns?: number
    sellTxns?: number
    buyVolume?: number
    sellVolume?: number
  }, type: keyof typeof markTabsChecked.value, name: string) {
    const isBuy = entry.side === 'buy'
    if (Number(type) === 30) {
      const swapType = isBuy ? t('netInflow') : t('netOutflow')
      const { buyVolume, sellVolume, buyTxns, sellTxns, volume } = entry
      const buyT = (buyVolume || 0) > 0 ? `
${t('inflow')}: ${formatNumber(buyVolume || 0, 2)}(${formatNumber(buyTxns || 0, 0)})
${t('campaignBuyAvg')}: $${formatNumber((buyVolume || 0) / (entry.buyAmount || 1), 2)}` : ''
      const sellT = (sellVolume || 0) > 0 ? `
${t('outflow')}: $${formatNumber(sellVolume || 0, 4)}(${formatNumber(sellTxns || 0, 0)})
${t('campaignSellAvg')}: $${formatNumber((sellVolume || 0) / (entry.sellAmount || 1), 2)}`  : ''
     return`${name?.replace(/\(.*\)$/, '')} ${swapType}${buyT}${sellT}
${isBuy ? t('netInflow') : t('netOutflow')}: ${formatNumber(volume, 2)}
${formatDate(entry.time, 'YYYY-MM-DD HH:mm')}
`
    }
    const swapType = isBuy ? t('bought') : t('sold')
    const { amount, txns, volume } = entry
    return`${name?.replace(/\(.*\)$/, '')} ${swapType}
${t('amountB')}: ${formatNumber(amount, 2)}
${t('amountU')}: $${formatNumber(volume, 2)}
${t('price')}: $${formatNumber(volume / (amount || 1), 4)}
${t('Txs')}: ${formatNumber(txns)}
${formatDate(entry.time, 'YYYY-MM-DD HH:mm')}
`
  }


  function wsTxUpdateMarks({
    tx,
    interval,
    user
  }: {
    tx: SimpleWSTx | WSTx
    interval: number
    user: string
  }, _widget: IChartingLibraryWidget | null) {
    const token = tokenStore?.token?.token
    const chain = tokenStore?.token?.chain
    const pair = tokenStore?.pairAddress
    const result: TradeData =  {
      time: tx.time,
    }
    if ('maker' in tx) {
      if (!((token === tx.target) && tx.maker === user)) return
      const type = tx.direction
      if (type === 'buy') {
        result['buy'] = {
          amount: Number(tx?.target_amt || 0),
          txns: 1,
          volume: Number(tx?.price_u || 0 ) * Number(tx?.target_amt || 0)
        }
      }
      if (type === 'sell') {
        result['sell'] = {
          amount: Number(tx?.target_amt || 0),
          txns: 1,
          volume: Number(tx?.price_u || 0 ) * Number(tx?.target_amt || 0)
        }
      }
    } else {
      if (!((token === tx.from_address || token === tx.to_address) && tx.wallet_address === user)) return
      const type =  tokenStore?.token?.token === tx.to_address ? 'buy' : 'sell'
      const result: TradeData =  {
        time: tx.time,
      }
      if (type === 'buy') {
        result['buy'] = {
          amount: Number(tx?.to_amount || 0),
          txns: 1,
          volume: Number(tx?.to_price_usd || 0 ) * Number(tx?.to_amount || 0)
        }
      }
      if (type === 'sell') {
        result['sell'] = {
          amount: Number(tx?.from_amount || 0),
          txns: 1,
          volume: Number(tx?.from_price_usd || 0 ) * Number(tx?.from_amount || 0)
        }
      }
    }
    marksMap.forEach((item, k) => {
      if (k.startsWith(pair + '-' + chain + '-' + user  + '-' + interval + '-' + 'trade')) {
        item.push(result)
      }
    })
  }

  // 定义枚举优先级 dev > kol > 聪明钱 > 狙击 > 老鼠仓
const priorityOrder = ['-101','-100','25','31','30','19','16']

  function wsPublicPortraitUpdateMarks(val:any[],_widget: IChartingLibraryWidget | null,{interval,user}:any){
    if(Array.isArray(val)){
          const chain = tokenStore?.token?.chain
          const pair = tokenStore?.pairAddress
          const addMarks:any[]=[]
          marksTabs.value.toSorted((a, b) => priorityOrder.indexOf(a.id) - priorityOrder.indexOf(b.id)).forEach(v=>{
            val.forEach(item=>{
              if(matchPortraitType(item, v.id)){
                const holderData = {
                      amount: item.amount,
                      tx_time: item.time,
                      txid: item.txid,
                      txns: 1,
                      volume: item.volume
                }
                const markData = {
                  type: v.id,
                  holders:[{
                    buy: item.direction === 'buy' ? holderData : null,
                    remark:         item.remark,
                    sell: item.direction === 'sell' ? holderData : null,
                    wallet_address: item.wallet_address,
                    wallet_logo:    item.wallet_logo || {}
                  }],
                  time:item.time
                }
                addMarks.push(markData)
              }
            })
            const liveKey = getProfilingLiveCacheKey({ pair, chain, user, interval, type: String(v.id) })
            const existingLive = profilingLiveCache.get(liveKey) || []
            if (addMarks.length > 0) {
              setCache(profilingLiveCache, liveKey, dedupeProfilingCacheItems([...(existingLive as any[]), ...addMarks]))
            }
            profilingMarksCache.forEach((item,key)=>{
              if(key.startsWith(pair + '-' + chain + '-' + user  + '-' + interval + '-' + v.id)){
                const nextItems = dedupeProfilingCacheItems([...(item || []), ...addMarks])
                item.splice(0, item.length, ...nextItems)
              }
            })
            addMarks.length = 0
        })
    }
  }

  return {
    marksTabs,
    markTabsChecked,
    createMarkButton,
    getMarks,
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
  }
}
