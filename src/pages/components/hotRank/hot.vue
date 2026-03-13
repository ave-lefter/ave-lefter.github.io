<script lang="tsx">
export default { name: 'HotRank' }
</script>
<script setup lang="tsx">
import { useStorage, useSessionStorage } from '@vueuse/core'
import { getHotDefaultColumns } from './columnRender/hotColumusService'
import { getTreasureList, klinePreviews, type IGetTreasureConfig } from '~/api/market'
import {
  quickContent,
  dexContent,
  securityContent,
  top10PositionsContent,
  snipersContent,
  HoldersContent,
  HoldersHeader,
  DynamicVolAndTxs,
  DynamicVolAndTxsHeader,
  DynamicMarkers,
  DynamicMarkersHeader,
  SmarterContent,
  SmarterHeader,
  LiquidityContent,
  LiquidityHeader,
  PriceHeader,
  MCapContent,
  MCapHeader,
  InsidersContent,
  // Headline,
  DynamicPriceChangeHeader,
  PoolPairHeader,
  PoolPairContent,
  Top10Header,
  InsidersHeader,
  SnipersHeader,
  PriceContent,
  PriceChange,
  TokenPage,
  DexHeader,
  TrendChart,
  TrendChartHeader,
} from '../components/index'
import { set } from 'lodash-es'
import dayjs from 'dayjs'
import type { RowClassNameGetter, RowEventHandlerParams } from 'element-plus'

const { t } = useI18n()
const localeStore = useLocaleStore()
const globalStore = useGlobalStore()
const rankKlineStore = useRankKlineStore()
const klineChartsData = ref<any[]>([])

const props = defineProps<{
  listMapFunction(i: Record<string, any>): Record<string, any>
  activeChain: string
  activeSubTab?: string
  activeTab?: string
  height: string
  ammList: IGetTreasureConfig['swaps']
}>()
const aveTableRef = useTemplateRef('aveTableRef')
const { rankConditions } = storeToRefs(globalStore)
function setSortConditions(params: { sort: string; sort_dir: string }) {
  rankConditions.value.hot.sort = params
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

function setFilterForm(...args: any[]) {
  args.forEach((keyVal) => {
    set(rankConditions.value.hot.filter, keyVal[0], keyVal[1])
  })
  pageInfo.value.pageNO = 1
  _getTreasureList()
}
const listData = ref<any[]>([])
const filteredListData = computed(() => {
  let result = [...listData.value]
  if (globalStore.pumpSetting.isBlacklist) {
    result = result.filter((el) => !inBlackList(el))
  }
  if (rankKlineStore.klineRow.id) {
    const index = result.findIndex((el) => el.id === rankKlineStore.klineRow.id)
    if (index !== -1) {
      result.splice(index + 1, 0, {
        isKline: true,
      })
    }
  }
  return result
})
function inBlackList(row) {
  const symbol = row.token0_address === row.target_token ? row.token0_symbol : row.token1_symbol
  return (
    globalStore.pumpBlackList.findIndex(
      (i) =>
        (i.address == row.token && i.type == 'ca') || (i.address == symbol && i.type == 'keyword')
    ) !== -1
  )
}
const pageInfo = ref({
  pageNO: useSessionStorage('hot-pageNO', 1).value,
  pageSize: 50,
  total: 0,
})
watch(
  () => pageInfo.value.pageNO,
  (val) => { useSessionStorage('hot-pageNO', 1).value = val }
)
const loading = shallowRef(false)
const columns = useStorage(CategoryTabsCacheKey.hot, getHotDefaultColumns(t))

function tableRowClick({ rowData }: RowEventHandlerParams) {
  const {
    klineRow: { id },
  } = rankKlineStore
  if (rowData.isKline) {
    return
  } else if (id && rowData.id !== id) {
    toggleKline(rankKlineStore.klineRow)
    return
  }
  navigateTo(`/token/${rowData.target_token}-${rowData.chain}`)
}

// const mounted = shallowRef(false)
// onMounted(() => {
//   setTimeout(()=>{
//     mounted.value = true
//   },20)
//   _getTreasureList()
// })

onUnmounted(() => {
  clearTimeout(timer)
})

// 监听组件激活状态
onActivated(() => {
  console.log('热搜榜激活')
  isActive.value = true
  // 从 sessionStorage 读取最新页码（markets.vue 切换 tab 时已重置为1）
  pageInfo.value.pageNO = useSessionStorage('hot-pageNO', 1).value
  resetColumns(false)
  // 延迟重新获取数据，避免快速切换时的冲突
  setTimeout(() => {
    if (isActive.value) {
      _getTreasureList()
    }
  }, 100)
  window.addEventListener('beforeunload', resetKline)
  if (aveTableRef.value) {
    aveTableRef.value.scrollToLeft(0)
  }
})

function resetKline() {
  if (rankKlineStore.klineRow.id) {
    toggleKline(rankKlineStore.klineRow)
  }
  window.removeEventListener('beforeunload', resetKline)
}

onDeactivated(() => {
  console.log('热搜榜停用')
  isActive.value = false
  clearTimeout(timer)
  resetKline()
  // 停用时取消WebSocket订阅，使用唯一ID
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 1,
  })
})
// onActivated(() => {
//   if(!mounted.value){
//     return
//   }
//   clearTimeout(timer)
//   _getTreasureList(false)
// })
// onDeactivated(() => {
//   clearTimeout(timer)
// })

watch(
  () => [props.activeChain, props.activeTab, localeStore.locale],
  () => {
    pageInfo.value.pageNO = 1
    _getTreasureList()
  }
)

watch(
  () => pageInfo.value.pageNO,
  () => {
    if (aveTableRef.value) {
      setTimeout(() => {
        aveTableRef.value.scrollToTop(0)
      }, 20)
    }
  }
)

watch(
  () => [globalStore.rankCommon.activeInterval],
  () => {
    getKlinePreviews()
  }
)

function getKlinePreviews() {
  const pair_ids = listData.value.map((el) => el.pair_id).toString()
  if (!pair_ids.length) {
    return
  }
  return klinePreviews({
    category: 'u',
    interval: {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '1h': 3600,
      '4h': 3600,
      '24h': 3600,
    }[globalStore.rankCommon.activeInterval],
    pair_ids,
  }).then((res) => {
    klineChartsData.value = res || []
  })
}

let timer: number
async function _getTreasureList(shouldLoading = true) {
  try {
    clearTimeout(timer)
    if (props.activeTab !== 'hot') {
      return
    }
    if (shouldLoading) {
      loading.value = true
      if (rankKlineStore.klineRow.id) {
        toggleKline(rankKlineStore.klineRow)
      }
    }
    const { total: _, ...rest } = pageInfo.value
    const finalFilter = ['created_at_max', 'created_at_min'].reduce(
      (prev, cur) => {
        if (prev[cur]) {
          prev[cur] = dayjs().unix() - Number(prev[cur]) * 60
        }
        return prev
      },
      { ...rankConditions.value.hot.filter }
    )
    const res = await getTreasureList({
      category: 'hot',
      ...rest,
      chain: props.activeChain !== 'AllChains' ? props.activeChain : '',
      ...rankConditions.value.hot.sort,
      ...finalFilter,
      self_address: walletAddress.value,
    })
    pageInfo.value.total = res.total
    listData.value = (res.data || []).map(props.listMapFunction)
    getKlinePreviews()
    if (shouldLoading) {
      initWs()
    }
    timer = window.setTimeout(() => {
      _getTreasureList(false)
    }, 10000)
  } finally {
    loading.value = false
  }
}

const wsStore = useWSStore()
const isActive = ref(true) // 追踪组件激活状态

watch(
  () => wsStore.wsResult[WSEventType.PRICE_EXTRA],
  ({ prices }) => {
    // 只有在组件激活时才处理数据
    if (!isActive.value) return
    // k 线出现的时候不处理数据
    if (rankKlineStore.klineRow.id) {
      return
    }

    const pricesMap = Array.isArray(prices)
      ? prices.reduce((pre, cur) => {
          pre[cur.pair + '-' + cur.chain] = cur
          return pre
        }, {})
      : {}
    const updateList = listData.value.map((el) => {
      const item = pricesMap[el.pair + '-' + el.chain]
      if (item) {
        delete item.holders
        const market_cap = !el.current_price_usd
          ? 0
          : ((el.market_cap || 0) / el.current_price_usd) * (item.uprice || 0)
        return {
          ...el,
          market_cap: market_cap,
          current_price_usd: item.uprice,
          ...item,
        }
      }
      return el
    })
    const { sort, sort_dir } = rankConditions.value.hot.sort
    const sortVal = { asc: '1', desc: '-1' }[sort_dir]
    if (sortVal) {
      listData.value = updateList.toSorted((a, b) => (a[sort] - b[sort]) * sortVal)
    } else {
      listData.value = updateList
    }
  }
)
function initWs() {
  // 先取消之前的订阅，使用唯一ID
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 1,
  })

  // 重新订阅价格更新，使用唯一ID和标识符
  const params = listData.value.map((el) => `${el.pair}-${el.chain}`)
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['price_extra', params],
    id: 1,
  })
}

const walletStore = useWalletStore()
const botStore = useBotStore()
const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})

function sizeChange() {
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

const filterMap = {
  insider_balance_ratio_cur: (el: any) => el.isVisible && props.activeChain === 'bsc',
  price_change_dynamic: (el: any) =>
    el.isVisible && !['1m', '24h'].includes(globalStore.rankCommon.activeInterval),
  quick: (el: any) => el.isVisible && globalStore.rankCommon.quickVisible,
}

const visibleColumns = computed(() => {
  return columns.value.filter((el) => {
    if (filterMap[el.key as keyof typeof filterMap]) {
      return filterMap[el.key as keyof typeof filterMap](el)
    }
    return el.isVisible
  })
})

const headerRenderer = computed(() => {
  return {
    poolPair: PoolPairHeader,
    // headline: () => t('aiSummary'),
    trendChart: TrendChartHeader,
    mCap: MCapHeader,
    current_price_usd: PriceHeader,
    price_change_1m: DynamicPriceChangeHeader,
    price_change_24h: DynamicPriceChangeHeader,
    price_change_dynamic: DynamicPriceChangeHeader,
    tvl: LiquidityHeader,
    dynamicVolAndTxs: DynamicVolAndTxsHeader,
    markers_dynamic: DynamicMarkersHeader,
    holders: HoldersHeader,
    smart_money_buy_volume_24h: SmarterHeader,
    dex: DexHeader,
    security: () => t('security'),
    holders_top10_ratio: Top10Header,
    quick: () => t('quick'),
    insider_balance_ratio_cur: InsidersHeader,
    sniper_tx_count: SnipersHeader,
  }
})
const cellRenderer = computed(() => {
  return {
    poolPair: PoolPairContent,
    // headline: Headline,
    trendChart: ({ row }) => {
      const klineData = klineChartsData.value.find(
        (el) => el.pair === row.pair && el.chain === row.chain
      )
      return <TrendChart list={klineData?.kline_data || []} />
    },
    mCap: MCapContent,
    current_price_usd: PriceContent,
    price_change_1m: ({ row }) => {
      return <PriceChange row={row} activeInterval="1m" />
    },
    price_change_24h: ({ row }) => {
      return <PriceChange row={row} activeInterval="24h" />
    },
    price_change_dynamic: ({ row }) => {
      return <PriceChange row={row} activeInterval={globalStore.rankCommon.activeInterval} />
    },
    tvl: LiquidityContent,
    dynamicVolAndTxs: DynamicVolAndTxs,
    markers_dynamic: DynamicMarkers,
    holders: HoldersContent,
    smart_money_buy_volume_24h: SmarterContent,
    dex: dexContent,
    security: securityContent,
    holders_top10_ratio: top10PositionsContent,
    quick: quickContent,
    insider_balance_ratio_cur: InsidersContent,
    sniper_tx_count: snipersContent,
  }
})
const Row = ({ cells, rowData }) => {
  if (rowData.isKline) {
    return <TokenPage />
  }
  return cells
}

function getRowClass({ rowData }: Parameters<RowClassNameGetter<any>>[0]) {
  const commonClass = `cursor-pointer [&&]:[--el-table-border:1px_solid_var(--main-divider)] ${rowData.isKline ? 'h-360px [--el-table-row-hover-bg-color:transparent] overflow-visible!' : 'h-81px'}`
  if (rankKlineStore.klineRow.id && rowData.id !== rankKlineStore.klineRow.id && !rowData.isKline) {
    return 'row-disabled ' + commonClass
  } else {
    return commonClass
  }
}

function toggleKline(row: Record<string, any>) {
  if (rankKlineStore.klineRow.id === row.id) {
    const rowIndex = filteredListData.value.findIndex((el) => el.isKline)
    rankKlineStore.klineRow = {}
    resetColumns(false)
    _getTreasureList(false)
    setTimeout(() => {
      if (rowIndex !== -1 && aveTableRef.value) {
        aveTableRef.value.scrollToTop((rowIndex - 1) * 81)
      }
    })
  } else {
    rankKlineStore.klineRow = row
    resetColumns(true)
    rankKlineStore.getData(row)
    clearTimeout(timer)
    setTimeout(() => {
      if (aveTableRef.value) {
        const rowIndex = filteredListData.value.findIndex((el) => el.isKline)
        if (rowIndex !== -1) {
          aveTableRef.value.scrollToTop((rowIndex - 1) * 81)
        }
      }
    }, 100)
  }
}

function resetColumns(needClear: boolean) {
  const quickIndex = columns.value.findIndex((el) => el.key === 'quick')
  if (columns.value[quickIndex] && columns.value[0]) {
    if (needClear) {
      columns.value[0].fixed = ''
      columns.value[quickIndex].fixed = ''
    } else {
      columns.value[0].fixed = 'left'
      columns.value[quickIndex].fixed = 'right'
      localStorage.setItem('hotUserTableColumns', JSON.stringify(columns.value))
    }
  }
}
</script>
<template>
  <div v-loading="loading" :style="`height:${height}`">
    <AveTable
      ref="aveTableRef"
      row-key="pair_id"
      :loading="loading"
      :data="filteredListData"
      :columns="visibleColumns"
      :header-height="40"
      :estimated-row-height="rankKlineStore.klineRow.id ? 400 : 81"
      fixed
      style="--el-bg-color: var(--secondary-bg)"
      :row-class="getRowClass"
      :rowEventHandlers="{
        onClick: tableRowClick,
      }"
    >
      <template v-for="item in visibleColumns" :key="item.key" #[`header-${item.key}`]>
        <component
          :is="headerRenderer[item.key as keyof typeof headerRenderer]"
          :sortConditions="rankConditions.hot.sort"
          :setSortConditions="setSortConditions"
          :setFilterForm="setFilterForm"
          :activeInterval="item.activeInterval || globalStore.rankCommon.activeInterval"
          :ammList="item.key === 'dex' ? ammList : null"
        />
      </template>
      <template
        v-for="item in visibleColumns"
        :key="item.key"
        #[`cell-${item.key}`]="{ row, rowIndex }"
      >
        <component
          :is="cellRenderer[item.key as keyof typeof cellRenderer]"
          class="text-14px"
          :enableKline="activeTab === 'hot'"
          :activeKline="rankKlineStore.klineRow.id === row.id"
          :row="row"
          :rowIndex="rowIndex"
          :pageNO="pageInfo.pageNO"
          :pageSize="pageInfo.pageSize"
          :activeInterval="item.activeInterval || globalStore.rankCommon.activeInterval"
          :activeChain="activeChain"
          :childrenData="item.children || []"
          @toggleKline="toggleKline"
        />
      </template>
      <template #row="{ style, ...rowProps }">
        <Row v-bind="rowProps" />
      </template>
    </AveTable>
  </div>
  <el-pagination
    v-if="pageInfo.total"
    v-model:current-page="pageInfo.pageNO"
    v-model:page-size="pageInfo.pageSize"
    class="mt-5px py-9px flex justify-center [&&]:[--el-pagination-button-height:18px]"
    layout="total, prev, pager, next"
    :total="pageInfo.total || 0"
    :small="false"
    :page-sizes="[20, 50, 100, 200, 300, 400]"
    @size-change="sizeChange"
    @current-change="() => _getTreasureList()"
  />
</template>

<style scoped lang="scss">
:deep(.el-table-v2__header-cell),
:deep(.el-table-v2__row-cell) {
  @apply px-16px;
}
:deep() {
  .row-disabled {
    --el-table-border: 1px solid #1a1a1a;
    &:before {
      --uno: content-[ ''] absolute top-0 left-0 w-full bottom-0 bg-black/80 z-1;
    }
  }
}
</style>
