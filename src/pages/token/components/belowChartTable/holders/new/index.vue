<template>
  <div class="holderInfo">
    <div class="px-12px mb-10px flex justify-between">
      <div
        class="flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide tab-width w-100%"
      >
        <a
          v-for="item in tabs"
          :key="item.value"
          href="javascript:;"
          :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-666-l-999] px-12px py-4px rounded-4px
         ${
           activeTab === item.value
             ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]'
             : ''
         }`"
          @click="setActiveTab(item.value as typeof activeTab.value)"
        >
          {{ item.label }}
        </a>
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
        <div>{{ $t('soldAll') }}/{{ $t('all') }}</div>
        <div>
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
        <div>{{ $t('totalPnL') }}</div>
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
            @filterOriginAddress="filterOriginAddress"
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
  type AggregateStats,
  type HolderStat,
} from '@/api/holders'
import { useLocalStorage } from '@vueuse/core'
import List from './list.vue'
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
const { price, totalHolders} = storeToRefs(useTokenStore())
const route = useRoute()
const botStore = useBotStore()
const { t } = useI18n()
const activeTab = shallowRef<'all' | 'buy' |'sell' | 'buy24h' | 'sell24h'>('all')

const searchKeyword = shallowRef('')
const loadingHolders = shallowRef(false)

const holderListObj = ref<Record<string, HolderStat[]>>({})
const aggregateStatsObj = ref<Record<string, AggregateStats>>({})

  // const show_bubble = shallowRef(false)

const searchOriginKeyword = shallowRef('')
const searchOriginType = shallowRef('')
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
  return [
    {
      label: t('all'),
      value: 'all',
    },
    {
      label: t('topGainer'),
      value: 'sell',
    },
    {
      label: t('topLoser'),
      value: 'buy',
    },
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
  // if (this.searchKeyword) {
  //   return this.filterList || []
  // }
  const list = holderListObj?.value?.[activeTab.value] || []
  // list = list?.map(i => {
  //   if (
  //     this.$store.state.token_user?.remark &&
  //     i.holder === this.$store.state.token_user?.address
  //   ) {
  //     i.remark = this.$store.state.token_user?.remark
  //   }
  //   return i
  // })
  if (searchOriginKeyword.value) {
    if (searchOriginType.value == 'sol') {
      return list?.filter(i => i.sol_first_transfer_in_from == searchOriginKeyword.value) || []
    } else {
      return list?.filter(i => i.token_first_transfer_in_from == searchOriginKeyword.value) || []
    }
  }
  return list || []
})

const aggregateStats = computed(
  () => aggregateStatsObj?.value?.[activeTab.value] || {}
)
const totalProfit = computed(() => {
  return holderList.value
    ?.reduce((p, row) => {
      const amount = Math.max((row?.bought || 0) - (row?.sold || 0), 0)
      const c = new BigNumber(
        price?.value || 0 - (row?.avg_purchase_price || 0)
      ).times(amount)
      return c.plus(p)
    }, new BigNumber('0'))
    ?.toFixed(0)
})
// const addressAndChain = computed(() => {
//   const id = route.params.id as string
//   if (id) {
//     return getAddressAndChainFromId(id)
//   }
//   return {
//     address: token.value?.token || '',
//     chain: token.value?.chain || '',
//   }
// })
// const tokenAddress= computed(()=>{
//   return addressAndChain.value?.address
// })
// const chain= computed(()=>{
//   return addressAndChain.value?.chain
// })
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
  // if (searchKeyword) {
  //   this.filterAddress(this.searchKeyword)
  // }
  if (val === 'buy' || val === 'sell') {
    const prop = val === 'buy' ? 'ascending' : 'descending'
    holdersRef?.value?.sort('total_profit', prop)
  } else if (val === 'buy24h' || val === 'sell24h') {
    const prop = val === 'buy24h' ? 'bought_usd' : 'sold_usd'
    holdersRef?.value?.sort(prop, 'descending')
  } else {
    const sort = holderListSortObj?.value[val] || {}
    if (sort.sort_by && sort.order) {
      holdersRef?.value?.sort(sort.sort_by, sort.order + 'ending')
    } else {
      holdersRef?.value?.clearSort()
      getHoldersList()
    }
  }
})
onMounted(() => {
  getHoldersList()
})
onActivated(() => {
  getHoldersList()
})
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
    self_address: botStore.evmAddress,
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
    })
    .catch(() => {
      holderListObj.value[activeTab.value] = []
    })
    .finally(() => {
      loadingHolders.value = false
    })
}
function handleSortChange(obj: { prop: string; order: string }) {
  getHoldersList({ sort_by: obj.prop, order: obj.order?.replace('ending', '') })
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
      color: #959a9f;
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
      color: #959a9f;
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
