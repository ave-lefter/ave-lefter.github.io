<script setup lang="tsx">
import { useStorage } from '@vueuse/core'
import { getGainDefaultColumns } from './columnRender/gainColumnsService'
import { getPriceChangeTopTokens, getTreasureList } from '~/api/market'
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
} from '../hotRank/columnRender/index'
import { set } from 'lodash-es'
import { addFavorite, removeFavorite } from '~/api/fav'
import type { RowEventHandlerParams } from 'element-plus'

const { t } = useI18n()
const localeStore = useLocaleStore()
const globalStore = useGlobalStore()

const props = defineProps<{
  listMapFunction(i: Record<string, any>): Record<string, any>
  activeChain: string
  activeTab?: string
}>()

const sortConditions = ref({
  sort: 'price_change_24h',
  sort_dir: 'desc',
})

function setSortConditions(params: { sort: string; sort_dir: string }) {
  sortConditions.value = params
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

const defaultFilter = {}
const filterForm = ref(defaultFilter)

function setFilterForm(...args: any[]) {
  args.forEach((keyVal) => {
    set(filterForm.value, keyVal[0], keyVal[1])
  })
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

const listData = ref<any[]>([])
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

const isVolUSDT = shallowRef(true)
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
  filterForm.value = {}
  pageInfo.value.pageNO = 1
  setTimeout(() => {
    if (isActive.value) {
      _getTreasureList()
    }
  }, 100)
})

onDeactivated(() => {
  console.log('涨幅榜停用')
  isActive.value = false
  clearTimeout(timer)
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 'gainer_rank_unsubscribe',
  })
})

watch(
  () => [props.activeChain, localeStore.locale],
  () => {
    pageInfo.value.pageNO = 1
    _getTreasureList()
  }
)

let timer: number

async function _getTreasureList(shouldLoading = true) {
  try {
    clearTimeout(timer)
    if (props.activeTab !== 'gainer') {
      return
    }
    if (shouldLoading) {
      loading.value = true
    }
    
    // 优先使用通用API确保分页功能正常
    const { total: _, ...rest } = pageInfo.value

    // 构建请求参数，只在有值时添加 chain 和 self_address
    const requestParams: any = {
      category: 'gainer',  // 修正为 'gainer'
      ...rest,
      ...sortConditions.value,
      ...filterForm.value,
      // refresh_total: 0,  // 添加刷新总数参数
    }

    // 只在 chain 有值时添加
    const chainValue = props.activeChain !== 'AllChains' ? props.activeChain : ''
    if (chainValue) {
      requestParams.chain = chainValue
    }

    // 只在 self_address 有值时添加
    if (walletAddress.value) {
      requestParams.self_address = walletAddress.value
    }

    const res = await getTreasureList(requestParams)
    
    pageInfo.value.total = res.total
    listData.value = (res.data || []).map(props.listMapFunction)
    
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
    // 只有在组件激活时才处理数据
    if (!isActive.value) return
    
    if (!prices) return
    
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
    
    // 应用当前排序条件
    const { sort, sort_dir } = sortConditions.value
    if (sort && sort_dir) {
      const sortVal = { asc: 1, desc: -1 }[sort_dir] || -1
      listData.value = updateList.toSorted((a, b) => {
        const aVal = a[sort] || 0
        const bVal = b[sort] || 0
        return (bVal - aVal) * sortVal
      })
    } else {
      // 默认按24小时涨幅排序
      listData.value = updateList.sort((a, b) => {
        const aChange = a.price_change_24h || 0
        const bChange = b.price_change_24h || 0
        return bChange - aChange
      })
    }
  }
)

function initWs() {
  // 先取消之前的订阅，使用唯一ID
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 'gainer_rank_unsubscribe',
  })
  
  // 重新订阅价格更新，使用唯一ID和标识符
  const params = listData.value.map((el) => `${el.pair}-${el.chain}`)
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['price_extra', params],
    id: 'gainer_rank_subscribe',
  })
}

const walletStore = useWalletStore()
const botStore = useBotStore()
const walletAddress = computed(() => {
  return botStore.evmAddress || walletStore.address
})

async function collect(index: number, row) {
  if (walletAddress.value) {
    if (walletStore.address) {
      await walletStore.signMessageForFavorite()
    }
    if (row.is_fav) {
      removeTokenFavorite(row, index)
    } else {
      addTokenFavorite(row, index)
    }
  } else {
    verifyLogin()
  }
}

function removeTokenFavorite(row, index: number) {
  loading.value = true
  removeFavorite(`${row.token}-${row.chain}`, walletAddress.value)
    .then(() => {
      ElMessage.success(t('cancelled1'))
      listData.value[index].is_fav = false
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function addTokenFavorite(row, index: number) {
  loading.value = true
  addFavorite(`${row.token}-${row.chain}`, walletAddress.value, 0)
    .then(() => {
      ElMessage.success(t('collected'))
      listData.value[index].is_fav = true
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function sizeChange() {
  pageInfo.value.pageNO = 1
  _getTreasureList()
}

const filterMap = {
  insider_balance_ratio_cur: (el: any) => el.isVisible && props.activeChain === 'bsc',
  price_change_dynamic: (el: any) =>
    el.isVisible && !['1m', '24h'].includes(globalStore.rankCommon.activeInterval),
  quick: (el: any) => el.isVisible && globalStore.rankCommon.quickVisible && !walletStore.address,
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
    dex: () => 'DEX',
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
  <div v-loading="loading" style="height: calc(100vh - 207px)">
    <AveTable
      :data="filteredListData"
      :columns="visibleColumns"
      :header-height="40"
      :row-height="80"
      fixed
      style="--el-bg-color: var(--d-111-l-FFF)"
      row-class="color-[--d-CCC-l-333] cursor-pointer [&&]:[--el-table-border:1px_solid_var(--d-1A1A1A-l-F2F2F2)]"
      :rowEventHandlers="{
        onClick: tableRowClick,
      }"
    >
      <template v-for="item in visibleColumns" :key="item.key" #[`header-${item.key}`]>
        <component
          :is="headerRenderer[item.key as keyof typeof headerRenderer]"
          v-model:isVolUSDT="isVolUSDT"
          :sortConditions="sortConditions"
          :setSortConditions="setSortConditions"
          :setFilterForm="setFilterForm"
          :activeInterval="item.activeInterval || globalStore.rankCommon.activeInterval"
        />
      </template>
      <template v-for="item in columns" :key="item.key" #[`cell-${item.key}`]="{ row, rowIndex }">
        <component
          :is="cellRenderer[item.key as keyof typeof cellRenderer]"
          class="text-14px"
          :isVolUSDT="isVolUSDT"
          :row="row"
          :rowIndex="rowIndex"
          :pageNO="pageInfo.pageNO"
          :pageSize="pageInfo.pageSize"
          :activeInterval="item.activeInterval || globalStore.rankCommon.activeInterval"
          :activeChain="activeChain"
          :childrenData="item.children || []"
          @collect="collect"
        />
      </template>
    </AveTable>
  </div>
  <el-pagination
    v-if="pageInfo.total"
    v-model:current-page="pageInfo.pageNO"
    v-model:page-size="pageInfo.pageSize"
    class="mt-5px py-20px flex justify-center color-[--d-666-l-999] [&&]:[--el-pagination-button-height:18px]"
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