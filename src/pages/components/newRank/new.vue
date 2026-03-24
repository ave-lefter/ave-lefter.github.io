<script lang="tsx">
export default { name: 'NewRank' }
</script>
<script setup lang="tsx">
import { useStorage, useSessionStorage } from '@vueuse/core'
import { getNewDefaultColumns } from './columnRender/newColumnsService'
import { getTreasureList, type IGetTreasureConfig } from '~/api/market'
import {
  PriceContent,
  PriceHeader,
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
  MCapContent,
  MCapHeader,
  InsidersContent,
  DynamicPriceChangeHeader,
  PoolPairHeader,
  PoolPairContent,
  Top10Header,
  InsidersHeader,
  SnipersHeader,
  PriceChange,
  DevContent,
  DevHeader,
  Snipers1mHeader,
  Snipers1mContent,
  DexHeader,
} from '../components/index'
import { set } from 'lodash-es'
import type { RowEventHandlerParams } from 'element-plus'
import dayjs from 'dayjs'

const { t } = useI18n()
const globalStore = useGlobalStore()

const props = defineProps<{
  listMapFunction(i: Record<string, any>): Record<string, any>
  activeChain: string
  activeSubTab: string
  activeTab: string
  height: string
  ammList: IGetTreasureConfig['swaps']
}>()
const { rankConditions } = storeToRefs(globalStore)
function setSortConditions(params: { sort: string; sort_dir: string }) {
  rankConditions.value.new.sort = params
  pageInfo.value.pageNO = 1
  _getTreasureList()
}
function setFilterForm(...args: any[]) {
  args.forEach((keyVal) => {
    set(rankConditions.value.new.filter, keyVal[0], keyVal[1])
  })
  pageInfo.value.pageNO = 1
  _getTreasureList()
}
const listData = ref<any[]>([])
const filteredListData = computed(() => {
  // todo
  if (globalStore.pumpSetting.isBlacklist) {
    return listData.value.filter((el) => !inBlackList(el))
  }
  return listData.value
})
function inBlackList(row) {
  return (
    // todo
    globalStore.pumpBlackList.findIndex(
      (i) =>
        (i.address == row.token && i.type == 'ca') ||
        (i.address == row.symbol && i.type == 'keyword')
    ) !== -1
  )
}

const pageInfo = ref({
  pageNO: useSessionStorage('new-pageNO', 1).value,
  pageSize: 50,
  total: 0,
})
watch(
  () => pageInfo.value.pageNO,
  (val) => { useSessionStorage('new-pageNO', 1).value = val }
)
const tableRef = shallowRef()
const loading = shallowRef(false)
const storageKey = computed(() => {
  return CategoryTabsCacheKey.new
})
let columns = useStorage(storageKey.value, getNewDefaultColumns(t))
const isFirstMount = shallowRef(true)
watch(
  () => props.activeTab,
  () => {
    columns = useStorage(storageKey.value, getNewDefaultColumns(t))
    // 只在切换 tab 时重置，首次挂载不重置（保留 sessionStorage 的值用于回退恢复）
    if (!isFirstMount.value) {
      pageInfo.value.pageNO = 1
      _getTreasureList()
    }
    isFirstMount.value = false
    console.log('watch new', columns, storageKey)
  },
  {
    immediate: true,
  }
)

function tableRowClick({ rowData }: RowEventHandlerParams) {
  navigateTo(`/token/${rowData.target_token}-${rowData.chain}`)
}

watch(
  () => [props.activeChain, props.activeTab],
  () => {
    pageInfo.value.pageNO = 1
    _getTreasureList()
  }
)

let timer: number
async function _getTreasureList(shouldLoading = true) {
  try {
    if (shouldLoading) {
      loading.value = true
    }
    const { total: _, ...rest } = pageInfo.value
    const finalFilter = ['created_at_max', 'created_at_min'].reduce(
      (prev, cur) => {
        if (prev[cur]) {
          prev[cur] = dayjs().unix() - Number(prev[cur]) * 60
        }
        return prev
      },
      { ...rankConditions.value.new.filter }
    )
    const res = await getTreasureList({
      category: props.activeTab,
      ...rest,
      chain: props.activeChain !== 'AllChains' ? props.activeChain : '',
      ...rankConditions.value.new.sort,
      ...finalFilter,
      self_address: walletAddress.value,
    })
    pageInfo.value.total = res.total
    listData.value = (res.data || []).map(props.listMapFunction)
    nextTick(() => tableRef.value?.scrollToTop(0))
    if (shouldLoading) {
      initWs()
    }
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      _getTreasureList(false)
    }, 5000)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  _getTreasureList()
})
onDeactivated(() => {
  clearTimeout(timer)
})
onActivated(() => {
  // 从 sessionStorage 读取最新页码（markets.vue 切换 tab 时已重置为1）
  pageInfo.value.pageNO = useSessionStorage('new-pageNO', 1).value
  clearTimeout(timer)
  timer = window.setTimeout(() => {
    _getTreasureList(false)
  }, 5000)
})

const wsStore = useWSStore()
watch(
  () => wsStore.wsResult[WSEventType.PRICE_EXTRA],
  ({ prices }) => {
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
        delete item.last_trade_at
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
    const { sort, sort_dir } = rankConditions.value.new.sort
    const sortVal = { asc: '1', desc: '-1' }[sort_dir]
    if (sortVal) {
      listData.value = updateList.toSorted((a, b) => (a[sort] - b[sort]) * sortVal)
    }
  }
)
function initWs() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['price_extra'],
    id: 1,
  })
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
  // first_half_elapsed_time: (el: any) => el.isVisible && props.activeTab === 'pump_in_almost',
  // second_half_elapsed_time: (el: any) => el.isVisible && props.activeTab === 'pump_in_almost',
  // progress:(el:any)=>el.isVisible && props.activeTab.includes('_in'),
  // headline:(el:any)=>el.isVisible && props.activeTab.includes('_out')
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
    current_price_usd: PriceHeader,
    mCap: MCapHeader,
    price_change_1m: DynamicPriceChangeHeader,
    price_change_24h: DynamicPriceChangeHeader,
    price_change_dynamic: DynamicPriceChangeHeader,
    tvl: LiquidityHeader,
    dynamicVolAndTxs: DynamicVolAndTxsHeader,
    markers_dynamic: DynamicMarkersHeader,
    holders: HoldersHeader,
    smart_money_buy_volume_24h: SmarterHeader,
    dex: DexHeader,
    security: () => t('tokenInfoSecurity'),
    holders_top10_ratio: Top10Header,
    quick: () => t('quick'),
    insider_balance_ratio_cur: InsidersHeader,
    sniper_tx_count: SnipersHeader,
    dev_balance_ratio_cur: DevHeader,
    // progress: ProgressHeader,
    // first_half_elapsed_time: HalfTimeHeader,
    // second_half_elapsed_time: FullHeader,
    rusher_tx_count: Snipers1mHeader,
    // last_trade_at: LastTradeHeader,
  }
})
const cellRenderer = computed(() => {
  return {
    poolPair: PoolPairContent,
    // headline: Headline,
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
    dev_balance_ratio_cur: DevContent,
    // progress: Progress,
    // first_half_elapsed_time: ({ row }) => {
    //   return (
    //     <span class={!row.first_half_elapsed_time ? 'color-[--d-666-l-999]' : ''}>
    //       {formatTime(row.first_half_elapsed_time || 0)}
    //     </span>
    //   )
    // },
    // second_half_elapsed_time: ({ row }) => {
    //   return (
    //     <span class={!row.second_half_elapsed_time ? 'color-[--d-666-l-999]' : ''}>
    //       {formatTime(row.second_half_elapsed_time || 0)}
    //     </span>
    //   )
    // },
    rusher_tx_count: Snipers1mContent,
    // last_trade_at: LastTradeContent,
  }
})
</script>
<template>
  <div v-loading="loading" :style="`height:${height}`">
    <AveTable
      ref="tableRef"
      row-key="pair_id"
      :loading="loading"
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
          :sortConditions="rankConditions.new.sort"
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
