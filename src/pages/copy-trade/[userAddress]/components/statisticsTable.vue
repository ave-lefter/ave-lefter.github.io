<template>
  <div>
    <div class="flex justify-between mb-10px mt-20px">
      <div class="flex items-center gap-24px">
        <a
          v-for="(item, index) in tabs"
          :key="index"
          :class="`text-14px mb-12px cursor-pointer flex items-center decoration-none lh-20px text-center  bg-[--main-input-button-bg] rounded-4px px-12px py-8px ${activeTab === item.id ? 'color-[--main-text] bg-[--primary-color]' : 'color-[--secondary-text]'}`"
          @click.stop.prevent="switchTab(item)"
        >
          {{ item.title }}
        </a>
      </div>
      <div v-if="activeTab === 'token'">
        <el-checkbox
          v-model="hasBalance"
          :false-value="0"
          :true-value="1"
          class="color-[--third-text]"
        >
          {{ $t('showPositions') }}
        </el-checkbox>
      </div>
    </div>
    <div
      v-infinite-scroll="onLoad"
      :infinite-scroll-delay="200"
      :infinite-scroll-disabled="tableData.loading || tableData.finished || tableData.error"
      :infinite-scroll-immediate="false"
      class="relative min-h-500px bg-[--secondary-bg]"
      infinite-scroll-distance="300"
    >
      <TokenList
        ref="tokenList_ref"
        :loading="tableData.loading"
        :tableData="filterTableList"
        :address="address"
        :type="activeTab"
        @search="search"
      />
      <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
        <span v-if="tableData.loading && tableData.pageNo > 1">{{ $t('loading') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js'
import TokenList from './tokenList.vue'
import { _getFollowTokens, _getSuccessFollowTxs, _getFailFollowTxs, _getFailFollowTxs } from '~/api/copyTrade'
const { copyObj } = storeToRefs(useCopyTradeStore())
const $t = getGlobalT()
const props = defineProps({
  chain: {
    type: String,
    default: 'bsc',
  },
  address: {
    type: String,
    default: '',
  },
  followAddress: {
    type: String,
    default: '',
  },
  orderId: {
    type: Number,
    default: 0,
  },
})
const activeTab = ref('token')
const tokenList_ref = ref<InstanceType<typeof TokenList> | null>(null)
// Interface {
//   {

//     finished: boolean,
//     error: boolean,
//     loading: boolean,
//     pageNo: number,
//     pageSize: number,
//     total: number,
//     tokenList: string[],
//     successList: string[],
//     failedList: string[],
// }

const tableData = ref({
  finished: false,
  error: false,
  loading: false,
  pageNo: 0,
  pageSize: 20,
  total: 0,
  tokenList: [],
  successList: [],
  failedList: []
})
const swapType =shallowRef('all')
const hasBalance = shallowRef(0)
const tabs = computed(() => {
  const commonTabs = [
    { title: $t('copyToken'), id: 'token' },
    { title: $t('copyCompleted'), id: 'success' },
    { title: $t('copyFailed'), id: 'failed' },
    { title: $t('invalidTransactions'), id: 'invalid' },
  ]
  return commonTabs
})

const chainAddress = computed(() => [props.chain, props.address])
const filterTableList = computed(() => {
  if (activeTab.value == 'token') {
    let tmp =[...tableData.value.tokenList]
    if (hasBalance.value) {
        tmp = [...tableData.value.tokenList]?.filter((i) => i?.amount > 0)
    }
    tmp.sort((a,b)=>(b.lastSwap || 0) - (a.lastSwap || 0))
    return tmp
  } else if (activeTab.value == 'success') {
    return [...tableData.value.successList]
  } else {
    return [...tableData.value.failedList]
  }
})

const switchTab = (item) => {
  if(activeTab.value == item.id) {
    return
  }
  activeTab.value = item.id
  swapType.value = 'all'
  tokenList_ref.value?.reset()
  resetPageNOAndLoading()
  if (activeTab.value == 'token') {
    getFollowTokens()
  } else if (activeTab.value == 'success') {
    getSuccessFollowTxs()
  } else if(activeTab.value == 'invalid') {
    getFailFollowTxs()
  } else {
    getFailFollowTxs()
  }
}

function onLoad() {
  if (activeTab.value == 'token') {
    getFollowTokens()
  } else if (activeTab.value == 'success') {
    getSuccessFollowTxs()
  } else if(activeTab.value == 'invalid') {
    getFailFollowTxs()
  } else {
    getFailFollowTxs()
  }
}
function search({ type }: { type: string }) {
  resetPageNOAndLoading()
  swapType.value = type
  if (activeTab.value == 'success') {
    getSuccessFollowTxs()
  } else {
    getFailFollowTxs()
  }
}
const getFollowTokens = async () => {
  if (!props.orderId) {
    return
  }
  tableData.value.loading = true

  const data = {
    walletAddress: props.address,
    followAddress: props.followAddress,
    chain: props.chain,
    period: 'all',
    sortBy: 'lastSwap',
    sortOrder: 'desc',
  }
  try {
    const res = await _getFollowTokens(data)
    tableData.value.tokenList = res?.map(i => ({
      ...i,
      chain: props.chain,
      value: i.holdingValue || 0,
      amount: i.holdingAmount || 0,
      price: i?.currentPriceUsd || 0,
    }))
  } catch {
    tableData.value.tokenList = []
  } finally {
    tableData.value.loading = false
  }
}

function getSuccessFollowTxs() {
  if (!props.orderId) {
    return
  }
  tableData.value.loading = false
  const data = {
    walletAddress: props.address,
    chain: props.chain,
    id: Number(props.orderId),
    swapType: swapType.value || 'all',
    pageSize: tableData.value.pageSize,
    pageNo: tableData.value.pageNo,
  }
  _getSuccessFollowTxs(data)
    .then((res) => {
      if (tableData.value.pageNo === 0) {
        tableData.value.successList = []
      }
      const list = Array.isArray(res) ? res?.map(i => ({
        ...i,
        amount: new BigNumber(i.amount || 0).div(10 ** i?.decimals),
        lastSwap:
          i?.time !== '1970-01-01T00:00:00Z' && i?.lastSwap !== '0001-01-01T00:00:00Z'
        ? (new Date(i?.time).getTime() / 1000)?.toFixed(0)
        : '0',
      })) : []
      if (list?.length > 0) {
        const a = [...tableData.value.successList]
        const b = list.filter((i) => a.every((j) => !(j.id === i.id && j.chain === i.chain)))
        tableData.value.successList = [...a, ...b]
      }
      tableData.value.finished = list?.length < tableData.value.pageSize
      if (!tableData.value.finished) {
        tableData.value.pageNo++
      }
    })
    .catch(() => {
      tableData.value.successList = []
      tableData.value.error = true
    })
    .finally(() => {
      tableData.value.loading = false
    })
}

function getFailFollowTxs() {
  if (!props.orderId) {
    return
  }
  tableData.value.loading = false
  const data = {
    walletAddress: props.address,
    chain: props.chain,
    id: Number(props.orderId),
    swapType: swapType.value || 'all',
    pageSize: tableData.value.pageSize,
    pageNo: tableData.value.pageNo,
  }
  _getFailFollowTxs(data)
    .then((res) => {
      if (tableData.value.pageNo === 0) {
        tableData.value.failedList = []
      }
      const list = Array.isArray(res) ? res?.map(i => ({
        ...i,
        amount: new BigNumber(i.amount || 0).div(10 ** i?.decimals),
          lastSwap:
          i?.time !== '1970-01-01T00:00:00Z' && i?.lastSwap !== '0001-01-01T00:00:00Z'
        ? (new Date(i?.time).getTime() / 1000)?.toFixed(0)
        : '0',
      })) : []
      if (list?.length > 0) {
        const a = [...tableData.value.failedList]
        const b = list.filter((i) => a.every((j) => !(j.token === i.token && j.chain === i.chain)))
        tableData.value.failedList = [...a, ...b]
      }
      tableData.value.finished = list?.length < tableData.value.pageSize
      if (!tableData.value.finished) {
        tableData.value.pageNo++
      }
    })
    .catch(() => {
      tableData.value.failedList = []
      tableData.value.error = true
    })
    .finally(() => {
      tableData.value.loading = false
    })
}
const resetPageNOAndLoading = () => {
  tableData.value.pageNo = 0
  tableData.value.finished = false
  tableData.value.error = false
  tableData.value.loading = true
}

// Watchers
watch(chainAddress, () => {
  if (props.address && props.chain) {
    swapType.value = 'all'
    tokenList_ref.value?.reset()
    resetPageNOAndLoading()
    console.log('-----111------')
    onLoad()
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.address && props.chain) {
    onLoad()
  }
})
</script>

<style lang="scss" scoped></style>
