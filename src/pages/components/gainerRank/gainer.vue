<script setup lang="tsx">
import { useStorage } from '@vueuse/core'
import { getGainDefaultColumns } from './columnRender/gainColumnsService'
import { getPriceChangeTopTokens, getTreasureList, type IGetTreasureConfig } from '~/api/market'
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
  Headline,
  DynamicPriceChangeHeader,
  PoolPairHeader,
  PoolPairContent,
  Top10Header,
  InsidersHeader,
  SnipersHeader,
  PriceContent,
  PriceChange,
  DexHeader,
} from '../components/index'
import { set } from 'lodash-es'
import { addFavorite, removeFavorite } from '~/api/fav'
import type { RowEventHandlerParams } from 'element-plus'
import dayjs from 'dayjs'

const { t } = useI18n()
const localeStore = useLocaleStore()
const globalStore = useGlobalStore()

const props = defineProps<{
  listMapFunction(i: Record<string, any>): Record<string, any>
  activeChain: string
  activeTab?: string
  activeSubTab?: string
  height: string
  ammList: IGetTreasureConfig['swaps']
}>()

const {rankConditions} = storeToRefs(globalStore)

function setSortConditions(params: { sort: string; sort_dir: string }) {
  rankConditions.value.gainer.sort = params
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

function setFilterForm(...args: any[]) {
  args.forEach((keyVal) => {
    set(rankConditions.value.gainer.filter, keyVal[0], keyVal[1])
  })
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

const listData = ref<any[]>([])

const tableDataCache = reactive<Record<string, { data: any[], total: number, timestamp: number }>>({})

const filteredListData = computed(() => {
  if (globalStore.pumpSetting.isBlacklist) {
    return listData.value.filter((el) => !inBlackList(el))
  }
  return listData.value
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
  pageNO: 1,
  pageSize: 50,
  total: 0,
})

const loading = shallowRef(false)
const columns = useStorage('gainUserTableColumns', getGainDefaultColumns(t))

function tableRowClick({ rowData }: RowEventHandlerParams) {
  navigateTo(`/token/${rowData.target_token}-${rowData.chain}`)
}

onMounted(() => {
  _getTreasureList()
})

// 监听组件激活状态
onActivated(() => {
  console.log('涨幅榜激活')
  isActive.value = true
  // filterForm.value = {}
  pageInfo.value.pageNO = 1

  const cacheKey = getCacheKey()
  const cachedData = tableDataCache[cacheKey]

  if (cachedData && (Date.now() - cachedData.timestamp) < 10000) {
    listData.value = cachedData.data
    pageInfo.value.total = cachedData.total

    setTimeout(() => {
      if (isActive.value) {
        _getTreasureList(false)
      }
    }, 100)
  } else {
    setTimeout(() => {
      if (isActive.value) {
        _getTreasureList()
      }
    }, 100)
  }
})

onDeactivated(() => {
  isActive.value = false
  clearTimeout(timer)
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 1,
  })
})

// 获取缓存键
function getCacheKey() {
  const chain = props.activeChain !== 'AllChains' ? props.activeChain : 'AllChains'
  return `${chain}-gainer`
}

const refreshId = ref('')

watch(
  () => [props.activeChain, localeStore.locale],
  () => {
    const cacheKey = getCacheKey()
    const cachedData = tableDataCache[cacheKey]

    if (cachedData && (Date.now() - cachedData.timestamp) < 30000) {
      listData.value = cachedData.data
      pageInfo.value.total = cachedData.total
      pageInfo.value.pageNO = 1

      setTimeout(() => {
        _getTreasureList(false)
      }, 100)
    } else {
      pageInfo.value.pageNO = 1
      _getTreasureList()
    }
  }
)

let timer: number

async function _getTreasureList(shouldLoading = true) {
  try {
    clearTimeout(timer)
    if (props.activeTab !== 'gainer') {
      return
    }

    const cacheKey = getCacheKey()
    const currentRefreshId = cacheKey

    const cachedData = tableDataCache[cacheKey]
    if (cachedData && !shouldLoading) {
      listData.value = cachedData.data
      pageInfo.value.total = cachedData.total
    }

    if (shouldLoading) {
      loading.value = true
    }

    const { total: _, ...rest } = pageInfo.value
    const finalFilter = ['created_at_max','created_at_min'].reduce((prev,cur)=>{
      if(prev[cur]){
        prev[cur] = dayjs().unix() - Number(prev[cur]) * 60
      }
      return prev
    },{...rankConditions.value.gainer.filter})

    const requestParams: any = {
      category: 'gainer',
      ...rest,
      ...rankConditions.value.gainer.sort,
      ...finalFilter,
    }

    if (currentRefreshId === refreshId.value && pageInfo.value.total > 0) {
      requestParams.refresh_total = 0
    } else {
      refreshId.value = currentRefreshId
    }

    const chainValue = props.activeChain !== 'AllChains' ? props.activeChain : ''
    if (chainValue) {
      requestParams.chain = chainValue
    }

    if (walletAddress.value) {
      requestParams.self_address = walletAddress.value
    }

    const res = await getTreasureList(requestParams)

    if (requestParams.refresh_total !== 0) {
      pageInfo.value.total = res.total
    }

    const processedData = (res.data || []).map(props.listMapFunction)
    listData.value = processedData

    // 更新缓存
    tableDataCache[cacheKey] = {
      data: processedData,
      total: res.total,
      timestamp: Date.now()
    }

    if (shouldLoading) {
      initWs()
    }
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      _getTreasureList(false)
    }, 10000)
  } catch (error) {
    console.error('获取涨幅榜数据失败:', error)
    try {
      const res = await getPriceChangeTopTokens()
      const processedData = Array.isArray(res) ? res : (res.data || [])

      // 应用链筛选
      let filteredData = processedData
      if (props.activeChain !== 'AllChains') {
        filteredData = processedData.filter(item => item.chain === props.activeChain)
      }

      listData.value = filteredData.map(props.listMapFunction)
      pageInfo.value.total = filteredData.length || 0
    } catch (fallbackError) {
      console.error('备选接口也失败:', fallbackError)
      listData.value = []
      pageInfo.value.total = 0
    }
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  clearTimeout(timer)
})

const wsStore = useWSStore()
const isActive = ref(true)

watch(
  () => wsStore.wsResult[WSEventType.PRICE_EXTRA],
  ({ prices }) => {
    if (!isActive.value || !listData.value.length) return

    if (!prices) return

    console.log('WebSocket价格更新:', prices.length, '个币种')

    const pricesMap = Array.isArray(prices)
      ? prices.reduce((pre, cur) => {
          pre[cur.pair + '-' + cur.chain] = cur
          return pre
        }, {})
      : {}

    const updateList = listData.value.map((el) => {
      const item = pricesMap[el.pair + '-' + el.chain]
      if (item) {
        // 只更新价格相关字段，保持其他数据不变
        return {
          ...el,
          current_price_usd: item.uprice,
          price_change_1m: item.price_change_1m,
          price_change_15m: item.price_change_15m,
          price_change_24h: item.price_change_24h,
          volume_24h: item.volume_24h,
          volume_1h: item.volume_1h,
          volume_15m: item.volume_15m,
          volume_1m: item.volume_1m,
          market_cap: el.current_price_usd && item.uprice
            ? ((el.market_cap || 0) / el.current_price_usd) * item.uprice
            : el.market_cap,
        }
      }
      return el
    })

    // 应用当前排序条件
    const { sort, sort_dir } = rankConditions.value.gainer.sort
    if (sort && sort_dir) {
      const sortVal = { asc: 1, desc: -1 }[sort_dir] || -1
      listData.value = updateList.toSorted((a, b) => {
        const aVal = Number(a[sort]) || 0
        const bVal = Number(b[sort]) || 0
        return (aVal - bVal) * sortVal
      })
    } else {
      // 默认按24小时涨幅排序（降序）
      listData.value = updateList.sort((a, b) => {
        const aChange = Number(a.price_change_24h) || 0
        const bChange = Number(b.price_change_24h) || 0
        return bChange - aChange
      })
    }

    // 同时更新缓存中的数据，保持一致性
    const cacheKey = getCacheKey()
    if (tableDataCache[cacheKey]) {
      tableDataCache[cacheKey].data = [...listData.value]
      // 不更新timestamp，保持缓存的时间戳作为API更新时间的标记
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
    headline: () => t('aiSummary'),
    mCap: MCapHeader,
    current_price_usd: PriceHeader,
    price_change_1m: DynamicPriceChangeHeader,
    price_change_15m: DynamicPriceChangeHeader,
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
    headline: Headline,
    mCap: MCapContent,
    current_price_usd: PriceContent,
    price_change_1m: ({ row }) => {
      return <PriceChange row={row} activeInterval="1m" />
    },
    price_change_15m: ({ row }) => {
      return <PriceChange row={row} activeInterval="15m" />
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
</script>

<template>
  <div v-loading="loading" :style="`height:${height}`">
    <AveTable
      row-key="pair_id"
      :data="filteredListData"
      :columns="visibleColumns"
      :header-height="40"
      :row-height="81"
      fixed
      style="--el-bg-color: var(--secondary-bg)"
      row-class="cursor-pointer [&&]:[--el-table-border:1px_solid_var(--main-divider)]"
      :rowEventHandlers="{
        onClick: tableRowClick,
      }"
    >
      <template v-for="item in visibleColumns" :key="item.key" #[`header-${item.key}`]>
        <component
          :is="headerRenderer[item.key as keyof typeof headerRenderer]"
          :sortConditions="rankConditions.gainer.sort"
          :setSortConditions="setSortConditions"
          :setFilterForm="setFilterForm"
          :activeInterval="item.activeInterval || globalStore.rankCommon.activeInterval"
          :ammList="item.key === 'dex' ? ammList : null"
        />
      </template>
      <template v-for="item in columns" :key="item.key" #[`cell-${item.key}`]="{ row, rowIndex }">
        <component
          :is="cellRenderer[item.key as keyof typeof cellRenderer]"
          class="text-14px"
          :row="row"
          :rowIndex="rowIndex"
          :pageNO="pageInfo.pageNO"
          :pageSize="pageInfo.pageSize"
          :activeInterval="item.activeInterval || globalStore.rankCommon.activeInterval"
          :activeChain="activeChain"
          :childrenData="item.children || []"
        />
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
  padding: 0 16px;
}
</style>
