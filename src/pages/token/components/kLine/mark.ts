// 创建 打点 切换按钮
import { filterLanguage } from './utils'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import type { IChartingLibraryWidget, Mark } from '~/types/tradingview/charting_library'
import { getUserKlineTxTags, getKlineProfilingTags } from '@/api/token'
import type { SimpleWSTx, WSTx } from './types'

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

export function useKlineMarks() {
  const { t } = useI18n()
  const tokenStore = useTokenStore()
  const localeStore = useLocaleStore()
  const botStore = useBotStore()

  // 创建打点数据
  const marksTabs = computed(() => {
    const arr = botStore.accessToken ? [{ id: 'trade', name: t('mine') }] : []
    return arr.concat(tokenStore.totalHolders?.filter?.(i => (i?.total_address || 0) > 0 && ['16','19','25','30','31']?.includes(i.type))?.map?.((i) => ({
      id: i.type,
      name: i?.[filterLanguage(localeStore.locale)] + (i.type !== '31' ? `(${i?.total_address})` : '')
    })))
  })

  const markTabsChecked: RemovableRef<{ [key: string]: boolean }> = useLocalStorage('tv_markTabsChecked', {
    trade: true,
    16: false,
    19: false,
    25: true,
    30: false,
    31: true
  })

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
        if (markTabsChecked.value[i.id]) {
          markTabsChecked.value[i.id] = false
          b1.style.color = 'inherit'
          _widget?.activeChart?.()?.clearMarks?.()
        } else {
          markTabsChecked.value[i.id] = true
          b1.style.color = '#3F80F7'
        }
        _widget?.activeChart?.()?.refreshMarks?.()
      }
    })
    headerBtns.push(btn)
  }

  const marksMap: Map<string, TradeData[]> = new Map()

  watch(() => tokenStore.token?.token, () => {
    marksMap.clear()
  })


  function getMarks({from, to, interval, onDataCallback, pair, chain, token, user}: {
    from: number
    to: number
    interval: string
    onDataCallback: (marks: any[]) => void;
    pair: string;
    chain: string;
    token: string;
    user: string;
  }) {
    marksTabs.value.forEach((v) => {
      const id = pair + '-' + chain + '-' + user  + '-' + interval + '-' + v.id + '-' + from + '-' + to
      if (marksMap.has(id) && markTabsChecked.value?.[v.id]) {
        const res = marksMap.get(id)
        const marks = formatToMarks(res || [], interval, v.id, v.name)
        onDataCallback(marks || [])
        return
      }
      if (v.id === 'trade' && markTabsChecked.value?.[v.id]) {
        getUserKlineTxTags({
          from,
          to,
          interval,
          pair: pair + '-' + chain,
          token_address: token,
          user_address: user
        }).then(res => {
          const marks = formatToMarks(res, interval, v.id, v.name)
          marksMap.set(id, res || [])
          onDataCallback(marks || [])
        })
      } else if (markTabsChecked.value?.[v.id]) {
        getKlineProfilingTags({
          from,
          to,
          interval,
          pair: pair + '-' + chain,
          type: v.id
        }).then(res => {
          const marks = formatToMarks(res, interval, v.id, v.name)
          marksMap.set(id, res || [])
          onDataCallback(marks || [])
        })
      }
    })
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
        showLabelWhenImageLoaded: false
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
    tx: SimpleWSTx
    interval: number
    user: string
  }, _widget: IChartingLibraryWidget | null) {
    const token = tokenStore?.token?.token
    const chain = tokenStore?.token?.chain
    const pair = tokenStore?.pairAddress
    if (!((token === tx.target) && tx.maker === user)) return
    const type = tx.direction
    const result: TradeData =  {
      time: tx.time,
    }
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
    marksMap.forEach((item, k) => {
      if (k.startsWith(pair + '-' + chain + '-' + user  + '-' + interval + '-' + 'trade')) {
        item.push(result)
      }
    })
    _widget?.activeChart?.()?.refreshMarks?.()
  }

  return {
    marksTabs,
    markTabsChecked,
    createMarkButton,
    getMarks,
    wsTxUpdateMarks
  }
}



