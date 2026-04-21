<template>
  <div class="holderInfo">
    <LineContent/>
    <div class="px-12px mb-10px flex justify-between">
      <div
        class="flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide tab-width w-100%"
      >
      <template v-for="item in tabs"
      :key="item.value">
        <a
          v-if="holdersTooltip(t)[item.type]"
          v-tooltip="holdersTooltip(t)[item.type]"
            href="javascript:;"
            :class="`decoration-none shrink-0 text-12px lh-16px text-center px-12px py-4px rounded-4px
            ${
              activeTab === item.value
                ? 'bg-[--tab-active-bg] color-[--main-text1]!'
                : 'color-[--third-text]'
            }`"
            @click="setActiveTab(item.value as typeof activeTab)"
          >
            {{ item.label }}
          </a>
          <a
            v-else
            href="javascript:;"
            :class="`decoration-none shrink-0 text-12px lh-16px text-center px-12px py-4px rounded-4px
            ${
              activeTab === item.value
                ? 'bg-[--tab-active-bg] color-[--main-text1]!'
                : 'color-[--third-text]'
            }`"
            @click="setActiveTab(item.value as typeof activeTab)"
          >
            {{ item.label }}
          </a>
      </template>
      </div>
    </div>
    <div v-if="aggregateStats?.top100Ratio > 0 ||aggregateStats?.top100PurchaseAvg > 0 ||  aggregateStats?.top100SellAvg > 0" class="flex-start px-12px mb-12px text-12px">
      <div>
        <span class="color-[--third-text]">Top100:</span>
        <span class="ml-4px">{{ formatNumber(aggregateStats?.top100Ratio * 100 || 0, 2) }}%</span>
      </div>
      <div class="ml-16px">
        <div class="inline-flex items-center clickable" @click.stop="isMC = !isMC">
          <span class="color-[--third-text]">{{ !isMC ? $t('top100PurchaseAvg') : $t('top100PurchaseAvgMC') }}</span>
          <Icon name="custom:exchange-horizontal" class="ml-4px color-[--third-text] text-10px"/>
          <span class="color-[--third-text] text-10px">:</span>
        </div>
        <span v-if="!isMC" class="ml-4px">${{ formatNumber(aggregateStats?.top100PurchaseAvg || 0, 2) }}</span>
        <span v-else class="ml-4px">${{   Number(aggregateStats?.top100PurchaseAvg) === 0
                ? '-'
                : formatNumber(Number(aggregateStats?.top100PurchaseAvg) * Number(circulation) || 0, 2) }}</span>
        <span v-if="Number(price) >0" class="ml-4px" :class="Number(aggregateStats?.top100PurchaseAvg) < Number(price) ? 'color-[--up-color]': 'color-[--down-color]'">({{ aggregateStats?.top100PurchaseAvg >0? formatNumber((Number(price) - Number(aggregateStats?.top100PurchaseAvg))/Number(aggregateStats?.top100PurchaseAvg) *100 || 0, 2)+'%' : 0 }})</span>
      </div>
      <div class="ml-16px">
        <div class="inline-flex items-center clickable" @click.stop="isMC = !isMC">
          <span class="color-[--third-text]">{{ !isMC ? $t('top100SellAvg') : $t('top100SellAvgMC') }}</span>
          <Icon name="custom:exchange-horizontal" class="ml-4px color-[--third-text] text-10px"/>
          <span class="color-[--third-text] text-10px">:</span>
        </div>
        <span v-if="!isMC" class="ml-4px">${{ formatNumber(aggregateStats?.top100SellAvg || 0, 2) }}</span>
        <span v-else class="ml-4px">${{   Number(aggregateStats?.top100SellAvg) === 0
              ? '-'
              : formatNumber(Number(aggregateStats?.top100SellAvg) * Number(circulation) || 0, 2) }}</span>
        <span v-if="Number(price) >0" class="ml-4px" :class="Number(aggregateStats?.top100SellAvg) < Number(price) ? 'color-[--up-color]': 'color-[--down-color]'">({{aggregateStats?.top100SellAvg >0? formatNumber((Number(price) - Number(aggregateStats?.top100SellAvg))/Number(aggregateStats?.top100SellAvg) *100 || 0, 2)+'%' : 0 }})</span>
      </div>
    </div>
    <ul v-show="!['all']?.includes?.(activeTab)" class="section-4">
      <li>
        <div>{{ $t('balance1') }}</div>
        <div
          :class="!Number(aggregateStats?.balance || 0) ? 'color-text-2' : ''"
        >
          ${{ formatNumber((aggregateStats?.balance || 0) * (price || 0), 2) }}
        </div>
      </li>
      <li>
        <div>{{ $t('amount') }}/{{ $t('largestPosition') }}</div>
        <div>
          <span
            :class="!Number(aggregateStats?.balance || 0) ? 'color-text-2' : ''"
          >
            {{ formatNumber(aggregateStats?.balance || 0, 2) }}
          </span>
          <span class="color-text-2">/</span>
          <span
            :class="
              !Number(aggregateStats?.largestPosition || 0)
                ? 'color-text-2'
                : ''
            "
          >
            {{ formatNumber(aggregateStats?.largestPosition || 0, 2) }}
          </span>
        </div>
        <div class="line-bar">
          <span
            :style="{
              width:
                ((aggregateStats?.balance || 0) * 100) /
                  (aggregateStats?.largestPosition || 1) +
                '%',
            }"
          />
        </div>
      </li>
      <li>
        <div>{{ $t('buy') }}/{{ $t('sell') }}</div>
        <div>
          <span
            :class="
              !Number(aggregateStats?.buy || 0)
                ? 'color-text-2'
                : 'color-#12B886'
            "
          >
            ${{ formatNumber(aggregateStats?.buy || 0, 2) }}
          </span>
          <span class="color-text-2">/</span>
          <span
            :class="
              !Number(aggregateStats?.sell || 0)
                ? 'color-text-2'
                : 'color-#F6465D'
            "
          >
            ${{ formatNumber(aggregateStats?.sell || 0, 2) }}
          </span>
        </div>
      </li>
      <li>
        <div class="flex items-center justify-center">{{ $t('soldAll') }}/{{ $t('all') }}<Icon v-tooltip="$t('soldAllTips')" name="material-symbols:help-outline" class="ml-4px"/></div>
        <div v-if="activeTab == '-100'">
          <span
            :class="!Number(globalStore.headFollowsNum.soldAll || 0) ? 'color-text-2' : ''"
          >
            {{ formatNumber(globalStore.headFollowsNum.soldAll || 0, 2) }}
          </span>
          <span class="color-text-2">/</span>
          <span
            :class="!Number(globalStore.headFollowsNum?.all || 0) ? 'color-text-2' : ''"
          >
            {{ formatNumber(globalStore.headFollowsNum?.all || 0, 2) }}
          </span>
        </div>

        <div v-else>
          <span
            :class="!Number(aggregateStats?.soldAll || 0) ? 'color-text-2' : ''"
          >
            {{ formatNumber(aggregateStats?.soldAll || 0, 2) }}
          </span>
          <span class="color-text-2">/</span>
          <span
            :class="!Number(aggregateStats?.all || 0) ? 'color-text-2' : ''"
          >
            {{ formatNumber(aggregateStats?.all || 0, 2) }}
          </span>
        </div>

      </li>
      <li>
        <div>{{ $t('unrealizedProfit') }}</div>
        <div
          :class="
            !Number(totalProfit || 0)
              ? 'color-text-2'
              : Number(totalProfit || 0) > 0
              ? 'color-#12B886'
              : 'color-#F6465D'
          "
        >
          {{
            !Number(totalProfit || 0)
              ? ''
              : Number(totalProfit || 0) > 0
              ? '+'
              : '-'
          }}${{ formatNumber(totalProfit || 0, 2)?.replace('-', '') }}
        </div>
      </li>
    </ul>

    <!-- <el-row :gutter="30">
      <el-col
        :span="show_bubble && ['solana', 'bsc']?.includes(chain) ? 12 : 24"
      > -->
        <!-- <div class="relative"> -->
          <List
            ref="holdersRef"
            :tableList="holderList"
            :loading="loadingHolders"
            :tabActive="activeTab"
            :searchOriginKeyword="searchOriginKeyword"
            :searchOriginType="searchOriginType"
            @handleSortChange="handleSortChange"
            @filterAddress="filterAddress"
            @filterOriginAddress="filterOriginAddress"
            @reLoad="reLoad"
          />
          <!-- <el-tooltip
            v-if="['solana', 'bsc']?.includes(chain) && !show_bubble"
            placement="top"

            :content="
              (show_bubble ? $t('Collapse') : $t('Expand')) + ' Bubble map'
            "
          >
            <a
              v-if="['solana', 'bsc']?.includes(chain)"
              class="bubble"
              href=""
              @click.stop.prevent="show_bubble = true"
            >
              <Icon name="custom:bubble" class="color-[--d-696E7C-l-fff] icon-bubble" />
            </a>
          </el-tooltip> -->
        <!-- </div> -->
      <!-- </el-col>
      <el-col
        :span="show_bubble && ['solana', 'bsc']?.includes(chain) ? 12 : 0"
      >
        <div class="relative">
          <el-tooltip
            placement="top"
            :content="
              (show_bubble ? $t('Collapse') : $t('Expand')) + ' Bubble map'
            "
          >
            <a
              class="bubble-arrow"
              href=""
              @click.stop.prevent="show_bubble = false"
            >
              <Icon name="material-symbols:keyboard-double-arrow-right-rounded" class="color-[--d-696E7C-l-fff]" />
            </a>
          </el-tooltip>
          <iframe
            style="
              width: 100%;
              height: 100%;
              border: none;
              height: 700px;
              min-height: 500px;
              max-height: 700px;
            "
            :src="`https://app.insightx.network/bubblemaps/${
              chain == 'bsc' ? 56 : chain
            }/${tokenAddress}`"
            allow="clipboard-write"
          />
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>

<script setup lang="ts">
import { filterLanguage } from '~/pages/token/components/kLine/utils'
import BigNumber from 'bignumber.js'
import {
  _getTop100range,
  _getHoldersList,
  searchAddressHolder,
  type AggregateStats,
  type HolderStat,
} from '@/api/holders'
import { useEventBus, useLocalStorage,useStorage } from '@vueuse/core'
import List from './list.vue'
import LineContent from './lineContent.vue'
const holderListSortObj = useLocalStorage('holderListSortObj', {
  all: {
    sort_by: '',
    order: '',
  },
  buy: {
    sort_by: 'bought_usd',
    order: 'desc',
  },
  sell: {
    sort_by: 'sold_usd',
    order: 'desc',
  },
  buy24h: {
    sort_by: '',
    order: '',
  },
  sell24h: {
    sort_by: '',
    order: '',
  },
})
const { price, totalHolders, circulation} = storeToRefs(useTokenStore())
const {token} = storeToRefs(useTokenStore())
const route = useRoute()
const botStore = useBotStore()
const walletStore = useWalletStore()
const { t } = useI18n()

const props = defineProps({
  currentActiveTab: {
    type: String,
    default: ''
  }
})

let holdersTimer: ReturnType<typeof setTimeout> | null = null

function startHoldersTimer() {
  stopHoldersTimer()
  if (searchKeyword.value) return
  if (route.name !== 'token-id') { stopHoldersTimer(); return }
  if (props.currentActiveTab !== 'Holders') { stopHoldersTimer(); return }
  holdersTimer = setTimeout(() => {
    if (searchKeyword.value) { stopHoldersTimer(); return }
    if (route.name !== 'token-id') { stopHoldersTimer(); return }
    if (props.currentActiveTab !== 'Holders') { stopHoldersTimer(); return }
    getHoldersList(holderListSortObj.value[activeTab.value])
  }, 5000)
}

function stopHoldersTimer() {
  if (holdersTimer) {
    clearTimeout(holdersTimer)
    holdersTimer = null
  }
}

watch(() => props.currentActiveTab, (val) => {
  if (val === 'Holders') {
    getHoldersList(holderListSortObj.value[activeTab.value])
  } else {
    stopHoldersTimer()
  }
})

onUnmounted(() => {
  stopHoldersTimer()
})
const activeTab = shallowRef<'all' | 'buy' |'sell' | 'buy24h' | 'sell24h' | '-100'>('all')
const globalStore = useGlobalStore()

// keyword: input value in the popover; searchKeyword: active search flag/value
const searchKeyword = shallowRef('')
const loadingHolders = shallowRef(false)

const holderListObj = ref<Record<string, HolderStat[]>>({})
const filterListObj = ref<Record<string, HolderStat[]>>({})
const aggregateStatsObj = ref<Record<string, AggregateStats>>({})
const selfAddress = computed(() => botStore.evmAddress || walletStore.address)

  // const show_bubble = shallowRef(false)
const searchOriginKeyword = shallowRef('')
const searchOriginType = shallowRef('')
const isMC = useStorage('holders_isMC', false)
const holdersRef = useTemplateRef('holdersRef')
const tabs = computed(() => {
  const arr: Array<{ label: string; value: string }> = []
  if (Array.isArray(totalHolders.value)) {
    totalHolders.value.forEach((i) => {
      const num = i.total_address || 0
      if (num > 0) {
        arr.push({
          ...i,
          label: i?.[filterLanguage(useLocaleStore().locale)] + `(${num})`,
          value: i.type,
        })
      }
    })
  }
  const followedNum = globalStore.headFollowsNum.all  - globalStore.headFollowsNum.soldAll
  return [
    {
      label: t('all'),
      value: 'all',
    },
    {
      label: t('followed')+`(${Number.isNaN(followedNum)?'0':followedNum})`,
      value: '-100',
    },
    // {
    //   label: t('topGainer'),
    //   value: 'sell',
    // },
    // {
    //   label: t('topLoser'),
    //   value: 'buy',
    // },
    {
      label: t('24hBuyers'),
      value: 'buy24h',
    },
    {
      label: t('24hSellers'),
      value: 'sell24h',
    },
    ...arr,
  ]
})
const id = computed(() => route.params.id as string)
const holderList = computed(() => {
  // Switch data source based on searchKeyword: align with legacy behavior
  const baseList = searchKeyword.value
    ? (filterListObj?.value?.[activeTab.value] || [])
    : (holderListObj?.value?.[activeTab.value] || [])

  if (searchOriginKeyword.value) {
    if (searchOriginType.value == 'sol') {
      return baseList?.filter(i => i.sol_first_transfer_in_from == searchOriginKeyword.value) || []
    } else {
      return baseList?.filter(i => i.token_first_transfer_in_from == searchOriginKeyword.value) || []
    }
  }
  return baseList || []
})

const aggregateStats = computed(
  () => aggregateStatsObj?.value?.[activeTab.value] || {}
)
const totalProfit = computed(() => {

  return holderList.value
    ?.reduce((p, row) => {
      const amount = Math.max((row?.bought || 0) - (row?.sold || 0), 0)
      const c = new BigNumber((price.value || 0) - (row?.avg_purchase_price || 0)).times(amount)
      return c.plus(p)
    }, new BigNumber('0'))
    ?.toFixed(0)
})

const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || '',
  }
})
// const tokenAddress= computed(()=>{
//   return addressAndChain.value?.address
// })
const chain= computed(()=>{
  return addressAndChain.value?.chain
})
watch(
  () => id.value,
  (newId) => {
    if (newId) {
      getHoldersList()
    }
  },
  {
    // immediate: true,
  }
)
watch(activeTab, (val) => {
  stopHoldersTimer()
  reLoad(val)
})

function reLoad(val=activeTab.value) {
  console.log('reLoad', val)
  if (val === 'buy' || val === 'sell') {
    const prop = val === 'buy' ? 'ascending' : 'descending'
    holdersRef?.value?.sort('total_profit', prop)
  } else if (val === 'buy24h' || val === 'sell24h') {
    const prop = val === 'buy24h' ? 'bought_usd' : 'sold_usd'
    holdersRef?.value?.sort(prop, 'descending')
  } else if(val === '-100' && !selfAddress.value) {
    // 没有登录不调用已关注接口
    resetFollowedData()
  } else {
    const sort = holderListSortObj?.value[val] || {}
    if (sort.sort_by && sort.order) {
      holdersRef?.value?.sort(sort.sort_by, sort.order + 'ending')
    } else {
      holdersRef?.value?.clearSort()
      getHoldersList()
    }
  }
}

// onMounted(() => {
//   //getHoldersList()
// })
onMounted(() => {
  if(activeTab.value === '-100' && !selfAddress.value) {
     // 没有登录不调用已关注接口
     resetFollowedData()
    return
  }
  getHoldersList()
})
function resetFollowedData() {
  holderListObj.value['-100'] = []
  aggregateStatsObj.value['-100'] = {}
}
function setActiveTab(val: typeof activeTab.value) {
  activeTab.value = val
}
function getHoldersList(sortObj?: { sort_by: string; order: string }) {
  let tag_type: string = ''
  if (
    !['all', 'buy', 'sell', 'buy24h', 'sell24h'].some(
      (i) => activeTab.value === i
    )
  ) {
    tag_type = activeTab.value
  }
  const sort = {
    sort_by: sortObj?.sort_by,
    order: sortObj?.order,
  }
  if (!sort.sort_by) {
    if (activeTab.value === 'buy') {
      sort.order = 'asc'
      sort.sort_by = 'total_profit'
    } else if (activeTab.value === 'sell') {
      sort.order = 'desc'
      sort.sort_by = 'total_profit'
    } else if (activeTab.value === 'buy24h') {
      sort.order = 'desc'
      sort.sort_by = 'bought_usd'
    } else if (activeTab.value === 'sell24h') {
      sort.order = 'desc'
      sort.sort_by = 'sold_usd'
    }
  }
  const params = {
    token_id: id.value,
    tag_type: tag_type,
    self_address:  selfAddress.value,
    ...sort,
    recent:
      activeTab.value === 'buy24h' || activeTab.value === 'sell24h'
        ? 1
        : undefined,
  }
  holderListSortObj.value[activeTab.value] = sort as {
    sort_by: string
    order: string
  }
  if (searchKeyword.value) {
    return
  }
  loadingHolders.value = true
  _getHoldersList(params)
    .then((res) => {
      holderListObj.value[activeTab.value] = res?.holderStats || []
      aggregateStatsObj.value[activeTab.value] = res?.aggregateStats || {}
      console.log('holderListObj', res)
    })
    .catch(() => {
      holderListObj.value[activeTab.value] = []
    })
    .finally(() => {
      loadingHolders.value = false
      startHoldersTimer()
    })
}
function handleSortChange(obj: { prop: string; order: string }) {
  getHoldersList({ sort_by: obj?.prop, order: obj?.order?.replace('ending', '') })
}
function filterOriginAddress(row:{ address: string, type: string }) {
  if (searchOriginKeyword.value) {
    searchOriginKeyword.value = ''
    searchOriginType.value = ''
  } else {
    searchOriginKeyword.value = row.address || ''
    searchOriginType.value = row.type || ''
  }
}
function filterAddress(val: string) {
  // Align with legacy: when there is a search keyword, use dedicated search API
  stopHoldersTimer()
  searchKeyword.value = val || ''
  if (!searchKeyword.value) {
    getHoldersList()
    return
  }
  let tag_type: string | undefined = undefined
  if (!['all', 'buy', 'sell', 'buy24h', 'sell24h'].some(i => activeTab.value === i)) {
    tag_type = activeTab.value
  }
  const params = {
    token_id: id.value,
    self_address: selfAddress.value,
    keyword: searchKeyword.value,
    tag_type,
  }
  loadingHolders.value = true
  searchAddressHolder(params)
    .then((res) => {
      filterListObj.value[activeTab.value] = Array.isArray(res) ? res : []
    })
    .catch(() => {
      filterListObj.value[activeTab.value] = []
    })
    .finally(() => {
      loadingHolders.value = false
    })
}
</script>
<style lang="scss" scoped>
.section-4 {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: #15171C;
  background: var(--a-btn-bg-1-color);
  border-radius: 4px;
  padding: 10px 30px;
  li {
    // flex: 1;
    text-align: center;
    > :first-child {
      font-size: 12px;
      color: var(--secondary-text);
      letter-spacing: 0;
      font-weight: 400;
    }
    > :nth-child(2) {
      font-size: 13px;
      color: var(--a-text-1-color);
      letter-spacing: 0;
      line-height: 18px;
      font-weight: 400;
      margin-top: 5px;
    }
    .color-text-2 {
      color: var(--secondary-text);
    }
    .color-\#12B886 {
      color: #12b886;
    }
    .color-\#F6465D {
      color: #f6465d;
    }
  }
}
.bubble {
  height: 30px;
  display: flex;
  align-items: center;
  padding: 8px 5px;
  border-radius: 4px 0px 0px 4px;
  background: var(--d-2D3037-l-999);
  position: absolute;
  right: 0px;
  top: 4px;
  z-index: 2;
  transition: all 0.2s;
  &:hover {
    opacity: 0.8;
    padding: 8px 8px;
  }
  i {
    color: var(--d-696E7C-l-fff);
  }
}
.bubble-arrow {
  height: 36px;
  border-radius: 4px 0px 0px 4px;
  background: var(--d-2D3037-l-999);
  padding: 10px 3px;
  position: absolute;
  left: -17px;
  top: 0px;
  z-index: 2;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  &:hover {
    left: -23px;
    opacity: 0.8;
    padding: 10px 6px;
  }
  i {
    font-size: 10px;
    color: var(--d-696E7C-l-fff);
  }
}
:deep(.el-dropdown-menu__item) {
  font-size: 12px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu) {
  background-color: var(--custom-bg-1-color);
  // border: 1px solid var(--d-33353D-l-f5f5f5);
}

// :deep(.el-table) {
//   // --el-table-tr-bg-color: #0A0B0D;
//   // --el-table-bg-color: #0A0B0D;
//   --el-table-header-bg-color: var(--d-17191C-l-F2F2F2);
//   --el-fill-color-lighter: #0A0B0D;
//   --el-table-header-text-color: var(--d-999-l-666);
//   // --el-table-border-color: var(--d-33353D-l-f5f5f5);
//   --el-table-row-hover-bg-color: var(--d-333333-l-eaecef);
//   // background: var(--d-111-l-FFF);
//   --el-bg-color: var(--d-111-l-FFF);
//   // --el-table-border: 0.5px solid var(--d-33353D-l-f5f5f5);
//   font-size: 13px;

//   th {
//     padding: 6px 0;
//     border-bottom: none !important;
//     height: 32px;

//     &.el-table__cell.is-leaf {
//       border-bottom: none;
//     }

//     .cell {
//       font-weight: 400;
//       font-size: 12px;
//     }
//   }
// }
</style>
