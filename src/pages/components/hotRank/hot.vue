<script setup lang="ts">
import { useStorage } from '@vueuse/core'
import { getHotDefaultColumns } from './columnRender/hotColumusService'
import { getTreasureList } from '~/api/market'
import {
  quickContent,
  dexContent,
  securityContent,
  top10PositionsContent,
  snipersContent,
  holdersContent,
  DynamicVolAndTxs,
  DynamicMarkers,
  smarterContent,
  liquidityContent,
  priceContent,
  mCapContent,
  poolPairContent,
  insidersContentNew,
  Headline,
  DynamicPriceChange,
} from './columnRender/index'
import { set } from 'lodash-es'
import { addFavorite, removeFavorite } from '~/api/fav'

const { t } = useI18n()
const localeStore = useLocaleStore()
const globalStore = useGlobalStore()

const props = defineProps<{
  listMapFunction(i: Record<string, any>): Record<string, any>
  activeChain: string
}>()
const sortConditions = ref({
  sort: '',
  sort_dir: '',
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
  return (
    globalStore.pumpBlackList.findIndex(
      (i) =>
        (i.address == row.token && i.type == 'ca') ||
        (i.address == row.symbol && i.type == 'keyword')
    ) !== -1
  )
}
const pageInfo = ref({
  pageNO: 1,
  pageSize: 50,
  total: 0,
})
const loading = shallowRef(false)
const columns = useStorage('hotUserTableColumns', getHotDefaultColumns(t))
const renderData = computed(() => {
  const result = {
    dynamicMarkers: {
      Comp: DynamicMarkers,
      props: {
        activeInterval: globalStore.rankCommon.activeInterval,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    dynamicVolAndTxs: {
      Comp: DynamicVolAndTxs,
      props: {
        activeInterval: globalStore.rankCommon.activeInterval,
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    priceChange24hContent: {
      Comp: DynamicPriceChange,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        activeInterval: '24h',
      },
    },
    priceChange1mContent: {
      Comp: DynamicPriceChange,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        activeInterval: '1m',
      },
    },
    quickContent: {
      Comp: quickContent,
      props: {
        quickBuyValue: globalStore.rankCommon.quickBuyValue,
      },
    },
    dexContent: {
      Comp: dexContent,
      props: {
        activeCategory: 'hot',
      },
    },
    securityContent: {
      Comp: securityContent,
      props: {
        activeCategory: 'hot',
        activeChain: props.activeChain,
        childrenData:columns.value.find(el=>el.key ==='security')?.children || []
      },
    },
    insidersContent: {
      Comp: insidersContentNew,
      props: {
        activeCategory: 'hot',
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
        activeChain: props.activeChain,
      },
    },
    top10PositionsContent: {
      Comp: top10PositionsContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    snipersContent: {
      Comp: snipersContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    holdersContent: {
      Comp: holdersContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    smarterContent: {
      Comp: smarterContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    liquidityContent: {
      Comp: liquidityContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    mCapContent: {
      Comp: mCapContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
      },
    },
    priceContent: {
      Comp: priceContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
      },
    },
    poolPairContent: {
      Comp: poolPairContent,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        setFilterForm,
        pageNO: pageInfo.value.pageNO,
        pageSize: pageInfo.value.pageSize,
      },
    },
    headline: {
      Comp: Headline,
    },
  }
  if (!['1m', '24h'].includes(globalStore.rankCommon.activeInterval)) {
    result.priceChangeDynamicContent = {
      Comp: DynamicPriceChange,
      props: {
        sortConditions: sortConditions.value,
        setSortConditions,
        activeInterval: globalStore.rankCommon.activeInterval,
      },
    }
  }
  return result
})

function tableRowClick(row) {
  navigateTo(`/token/${row.target_token}-${row.chain}`)
}

onMounted(() => {
  _getTreasureList()
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
    if (shouldLoading) {
      loading.value = true
    }
    const { total: _, ...rest } = pageInfo.value
    const res = await getTreasureList({
      category: 'hot',
      ...rest,
      chain: props.activeChain !== 'AllChains' ? props.activeChain : '',
      ...sortConditions.value,
      ...filterForm.value,
      self_address: walletAddress.value,
    })
    pageInfo.value.total = res.total
    listData.value = (res.data || []).map(props.listMapFunction)
    if (shouldLoading) {
      initWs()
    }
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      _getTreasureList(false)
    }, 10000)
  } finally {
    loading.value = false
  }
}
onUnmounted(() => {
  clearTimeout(timer)
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
    const { sort, sort_dir } = sortConditions.value
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
</script>
<template>
  <el-table
    v-loading="loading"
    :height="'calc(100vh - 182px)'"
    :data="filteredListData"
    fit
    header-row-class-name="[&&]:text-12px h-40px"
    row-class-name="color-[--d-CCC-l-333] cursor-pointer"
    cell-class-name="[&&]:[--el-table-border:1px_solid_var(--d-1A1A1A-l-F2F2F2)]"
    @row-click="tableRowClick"
  >
    <template #empty>
      <AveEmpty v-if="!loading && filteredListData.length === 0" />
      <span v-else />
    </template>
    <template v-for="item in columns" :key="item.key">
      <component
        v-bind="renderData[item.render]?.props"
        :is="renderData[item.render]?.Comp"
        v-if="item.isVisible"
        @collect="collect"
      />
    </template>
  </el-table>
  <el-pagination
    v-if="pageInfo.total"
    v-model:current-page="pageInfo.pageNO"
    v-model:page-size="pageInfo.pageSize"
    class="mt-5px flex justify-center color-[--d-666-l-999]"
    layout="total, prev, pager, next"
    :total="pageInfo.total || 0"
    :small="false"
    :page-sizes="[20, 50, 100, 200, 300, 400]"
    @size-change="sizeChange"
    @current-change="() => _getTreasureList()"
  />
</template>

<style scoped lang="scss">
:deep(.cell) {
  line-height: normal;
  padding: 0 16px;
}
</style>
