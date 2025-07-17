<template>
  <div>
    <div class="flex justify-between border-b-1px border-b-solid border-b-[--d-222-l-F2F2F2] mb-20px">
      <div class="flex items-center pl-10px gap-24px">
        <a
          v-for="(item, index) in tabs"
          :key="index"
          :class="`text-14px pb-10px cursor-pointer flex items-center decoration-none lh-20px text-center color-[--d-666-l-999] b-b-solid b-b-3px ${activeTab === item.id ? 'color-[--d-F5F5F5-l-222] b-b-[--d-F5F5F5-l-333]' : 'b-b-transparent'}`"
          @click.stop.prevent="switchTab(item)"
        >
          {{ item.title }}
        </a>
      </div>
      <div v-if="isToken" class="flex items-center gap-10px">
        <el-checkbox
          v-model="conditions_wallet.hide_sold"
          class="[&&]:mr-0"
          :false-value="0"
          :true-value="1"
          @change="onConditionChange('hide_sold')"
        >
          {{ $t('hide_sell') }}
        </el-checkbox>
        <el-checkbox
          v-model="conditions_wallet.hide_small"
          :false-value="0"
          :true-value="1"
          class="text-14px"
          @change="onConditionChange('hide_small')"
        >
          {{ $t('hideSmallAssets1') + '<1USD' }}
        </el-checkbox>
        <BlackList
          v-if="isSelfAddress"
          :chain="chain"
          :address="address"
          @addWhite="refreshTokenList"
        />
      </div>
      <div v-else-if="isTrend">
        <el-checkbox
          v-model="trendQuery.hideNative"
          :false-value="0"
          :true-value="1"
        >
          {{ $t('hideNative') }}
        </el-checkbox>
      </div>
    </div>
    <div ref="listArea" class="mb-[35px]">
      <div
        v-infinite-scroll="onLoad"
        :infinite-scroll-delay="200"
        :infinite-scroll-disabled="tableData.loading || tableData.finished || tableData.error"
        :infinite-scroll-immediate="false"
        class="relative min-h-500px"
        infinite-scroll-distance="300"
      >
        <TokenList
          v-if="isToken"
          :conditions="conditions_wallet"
          :handleSortChange="handleSortChange"
          :loading="tableData.loading"
          :tableData="filterTableList"
          :isSelfAddress="isSelfAddress"
          :address="address"
          @hideToken="refreshTokenList"
        />
        <TrendList
          v-else-if="isTrend"
          ref="trendList"
          :handleSortChange="handleSortChange"
          :tableData="filterTableList"
          :trendQuery="trendQuery"
          @refreshWhaleTrendList="refreshWhaleTrendList"
        />
        <DeployedTokenList
          v-else
          :conditions="deployedTokenQuery"
          :handleSortChange="handleSortChange"
          :loading="tableData.loading"
          :tableData="filterTableList"
        />
        <div
          :style="{ color: mode === 'light' ? '#666' : '#999' }"
          class="mt-[-2px] mb-[5px] text-[12px] text-center"
        >
          <span v-if="tableData.loading && tableData.pageNO > 1">{{ $t('loading') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TokenList from './tokenList.vue'
import TrendList from './trendList.vue'
import DeployedTokenList from './deployedTokenList.vue'
import BlackList from './blackList.vue'
import { getDeployedTokens, getWhaleTokenList, getWhaleTrendList } from '@/api/wallet'
import {useStorage} from '@vueuse/core'
const $t = getGlobalT()
const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  isSelfAddress: Boolean,
})

const activeTab = ref('trend')
const tableData = ref({
  finished: false,
  error: false,
  loading: false,
  pageNO: 1,
  pageSize: 40,
  total: 0,
  token: [],
  trend: [],
  deployedToken: [],
})
const max_block_number = ref(0)
const max_event_id = ref(0)
const conditions_wallet = useStorage('conditions_wallet', {
  hide_sold: 1,
  hide_small: 1,
  sort: 'last_txn_time',
  sort_dir: 'desc',
})
const trendQuery = ref({
  event_type: '',
  volume_min: 0,
  volume_max: 0,
  hideNative: 1,
  checkAll: false,
  isIndeterminate: true,
  checkedTrend: ['SWAP', 'ADD_LIQUIDITY/REMOVE_LIQUIDITY'],
  sort_dir: 'desc',
  sort: 'block_time',
})
const deployedTokenQuery = ref({
  sort: 'market_cap',
  sort_dir: 'desc',
})

const deployedTokenNum = ref(0)
const listArea = ref(null)
const trendList = ref(null)

const themeStore = useThemeStore()

const mode = computed(() => {
  return themeStore.isDark ? 'dark' : 'light'
})

const tabs = computed(() => {
  const commonTabs = [
    { title: $t('walletActivity'), id: 'trend' },
    { title: $t('holding'), id: 'token' },
  ]
  if (deployedTokenNum.value > 0) {
    commonTabs.push({
      title: `${$t('deployedToken')}(${deployedTokenNum.value})`,
      id: 'deployedToken',
    })
  }
  return commonTabs
})

const isToken = computed(() => activeTab.value === 'token')
const isTrend = computed(() => activeTab.value === 'trend')
const chainAddress = computed(() => [props.chain, props.address])
const filterTableList = computed(() => {
  if (isToken.value) {
    return [...tableData.value.token]
  } else if (isTrend.value) {
    let trendList = tableData.value.trend.filter(
      (i) =>
        (i.is_target && (i.event_type === 'swap_buy' || i.event_type === 'swap_sell')) ||
        !(i.event_type === 'swap_buy' || i.event_type === 'swap_sell')
    )
    if (trendQuery.value.hideNative === 1) {
      trendList = trendList.filter(
        (i) => NATIVE_TOKENS.findIndex((y) => y?.toLowerCase() === i.token?.toLowerCase()) === -1
      )
    }
    return trendList
  } else {
    return [...tableData.value.deployedToken]
  }
})

// Methods
const onConditionChange = (type) => {
  tableData.value.pageNO = 1
  _getWhaleTokenList()
}

const onLoad = () => {
  if (isToken.value) _getWhaleTokenList()
  else if (isTrend.value) _getWhaleTrendList()
  else _getDeployedTokens()
}

const switchTab = (item) => {
  activeTab.value = item.id
  onRouteChange()
}

const handleSortChange = ({ prop, order }) => {
  resetPageNOAndLoading()
  const sort_dir = order?.replace?.('ending', '')
  if (isToken.value) {
    conditions_wallet.value.sort = prop
    conditions_wallet.value.sort_dir = sort_dir
  } else if (isTrend.value) {
    trendQuery.value.sort = prop
    trendQuery.value.sort_dir = sort_dir
  } else {
    deployedTokenQuery.value.sort = prop
    deployedTokenQuery.value.sort_dir = sort_dir
  }
  onLoad()
}

const resetPageNOAndLoading = () => {
  tableData.value.pageNO = 1
  tableData.value.finished = false
  tableData.value.error = false
  tableData.value.loading = true
}

const _getWhaleTokenList = async () => {
  tableData.value.loading = true
  const data = {
    user_address: props.address,
    chain: props.chain,
    pageNO: tableData.value.pageNO,
    pageSize: tableData.value.pageSize,
    sort_dir: conditions_wallet.value.sort_dir,
    sort: conditions_wallet.value.sort,
    is_self: props.isSelfAddress ? 1 : 0,
    ...(conditions_wallet.value.hide_sold === 1 && { hide_sold: 1 }),
    ...(conditions_wallet.value.hide_small === 1 && { hide_small: 1 }),
  }

  try {
    const res = await getWhaleTokenList(data)
    if (data.pageNO === 1) {
      tableData.value.token = []
    }
    const list = Array.isArray(res) ? res : []
    if (list?.length > 0) {
      const a = [...tableData.value.token]
      const b = list.filter((i) => a.every((j) => !(j.token === i.token && j.chain === i.chain)))
      tableData.value.token = [...a, ...b]
    }
    tableData.value.finished = list?.length < tableData.value.pageSize
    if (!tableData.value.finished) {
      tableData.value.pageNO++
    }
  } catch {
    tableData.value.token = []
    tableData.value.error = true
  } finally {
    tableData.value.loading = false
  }
}

const refreshWhaleTrendList = (params) => {
  trendQuery.value = { ...trendQuery.value, ...params }
  tableData.value.pageNO = 1
  max_block_number.value = 0
  max_event_id.value = 0
  _getWhaleTrendList()
}

const getWhaleTrendParams = () => {
  const data = {
    user_address: props.address,
    chain: props.chain,
    pageNO: tableData.value.pageNO,
    pageSize: tableData.value.pageSize,
    max_block_number: max_block_number.value,
    max_event_id: max_event_id.value,
    event_type: '',
    volume_min: 0,
    volume_max: 0,
    block_time_min: trendQuery.value.block_time_min,
    block_time_max: trendQuery.value.block_time_max,
    sort_dir: trendQuery.value.sort_dir,
    sort: trendQuery.value.sort,
    ...(trendQuery.value.volume_min && { volume_min: trendQuery.value.volume_min }),
    ...(trendQuery.value.volume_max && { volume_max: trendQuery.value.volume_max }),
  }

  const trendLen = trendQuery.value.checkedTrend?.length
  if (trendLen > 0 && trendLen <= 5) {
    const event_type = trendQuery.value.checkedTrend
      .filter((i) => i !== 'all')
      .map((i) => i.replace('/', ','))
    data.event_type = event_type.toString()
  }
  return data
}

const _getWhaleTrendList = async () => {
  tableData.value.loading = true
  if (trendQuery.value.volume_min > trendQuery.value.volume_max) {
    store.dispatch('showMessage', {
      type: 'error',
      message: $t('maxGtMin'),
    })
    return
  }

  const params = getWhaleTrendParams()
  try {
    const res = await getWhaleTrendList(params)
    if (params.pageNO === 1) {
      tableData.value.trend = []
    }
    const list = Array.isArray(res) ? res : []
    const arr = list.map((i) => {
      let event_type = i.event_type
      if (i.event_type === 'SWAP') {
        event_type = i.flow_type === 0 ? 'swap_buy' : 'swap_sell'
      } else if (i.event_type === 'TRANSFER') {
        event_type = i.flow_type === 0 ? 'transfer_in' : 'transfer_out'
      }
      return { ...i, event_type }
    })

    if (arr?.length > 0) {
      const a = [...tableData.value.trend]
      const b = arr.filter((i) => a.every((j) => j.tx_hash !== i.tx_hash))
      tableData.value.trend = [...a, ...b]
    }
    tableData.value.finished = list?.length < tableData.value.pageSize
    if (!tableData.value.finished) {
      tableData.value.pageNO++
    }
    max_block_number.value = arr[arr?.length - 1]?.block_number
    max_event_id.value = arr[arr?.length - 1]?.event_id
  } catch (err) {
    tableData.value.trend = []
    tableData.value.error = true
  } finally {
    tableData.value.loading = false
  }
}

const refreshTokenList = () => {
  resetPageNOAndLoading()
  _getWhaleTokenList()
}

const onRouteChange = () => {
  resetPageNOAndLoading()
  if (isToken.value) {
    _getWhaleTokenList()
  } else if (isTrend.value) {
    max_block_number.value = 0
    max_event_id.value = 0
    _getWhaleTrendList()
  } else {
    _getDeployedTokens()
  }
}

const _getDeployedTokens = async () => {
  tableData.value.loading = true
  const params = {
    user_address: props.address,
    user_chain: props.chain,
    ...deployedTokenQuery.value,
  }
  try {
    const res = await getDeployedTokens(params)
    tableData.value.deployedToken = res
  } catch (err) {
    tableData.value.deployedToken = []
    tableData.value.error = true
  } finally {
    tableData.value.loading = false
  }
}

const getDeployedTokenNum = async () => {
  const params = {
    user_address: props.address,
    user_chain: props.chain,
    ...deployedTokenQuery.value,
  }
  try {
    const res = await getDeployedTokens(params)
    deployedTokenNum.value = res?.length || 0
  } catch (err) {
    console.log('error', err)
  }
}

const resetData = () => {
  statistics.value = {}
  tableData.value.token = []
  tableData.value.trend = []
}

// Watchers
watch(chainAddress, () => {
  if (props.address && props.chain) {
    resetPageNOAndLoading()
    onLoad()
    getDeployedTokenNum()
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.address && props.chain) {
    onLoad()
    getDeployedTokenNum()
  }
})
</script>

<style lang="scss" scoped>
</style>
