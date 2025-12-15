<template>
  <div>
    <el-table
      ref="table_ref"
      :key="tableIndex"
      :data="tableData"
      fit
      style="width: 100%"
      cell-class-name="color-[--secondary-text]"
      row-class-name="cursor-pointer"
      header-row-class-name="text-12px"
      @row-click="jumpTokenDetail"
    >
      <template #empty>
        <AveEmpty v-if="!loading && tableData.length === 0" class="[pt-40px]" />
        <span v-else />
      </template>
      <TokenColumn
        :column-props="{
          label: $t('walletToken'),
          width: '250',
          fixed: 'left',
        }"
        headerSlot
      >
        <template #header>
          <el-popover
            v-model:visible="filterForm.token.visible"
            :width="320"
            trigger="click"
            popper-style="--el-text-color-primary:--third-text"
          >
            <template #reference>
              <div class="flex items-center">
                <span>{{ $t('walletToken') }}</span>
                <Icon
                  name="custom:filter"
                  class="cursor-pointer text-10px ml-3px"
                  :class="
                    props.trendQuery.token
                      ? 'color-[--primary-color]'
                      : 'color-[--third-text] hover:color-[--secondary-text]'
                  "
                />
              </div>
            </template>
            <template #default>
              <div class="text-14px font-400 mb-8px">
                {{ $t('tokenAddress') }}
              </div>
              <el-input v-model="filterForm.token.value" clearable />
              <div class="mt-10px flex">
                <el-button
                  class="h-30px m-l-auto min-w-70px flex-1"
                  type="primary"
                  @click="confirmToken"
                  >{{ $t('confirm') }}
                </el-button>
              </div>
            </template>
          </el-popover>
        </template>
      </TokenColumn>
      <el-table-column :label="$t('time')">
        <template #header>
          <span>{{ $t('time') }}</span>
          <el-popover
            v-model:visible="filterForm.time.visible"
            :width="430"
            trigger="click"
            popper-style="--el-text-color-primary:--third-text"
          >
            <template #reference>
              <Icon
                name="custom:filter"
                class="cursor-pointer text-10px ml-3px"
                :class="
                  props.trendQuery.block_time_min && props.trendQuery.block_time_max
                    ? 'color-[--primary-color]'
                    : 'color-[--third-text] hover:color-[--secondary-text]'
                "
                @click.stop
              />
            </template>
            <template #default>
              <div class="filter-box" :class="mode">
                <div class="text-14px font-400">
                  {{ $t('filterByDate') }}
                </div>
                <div class="flex text-12px mt-10px">
                  <span style="flex: 1.2">{{ $t('startTime') }}</span>
                  <span class="flex-1">{{ $t('endTime2') }}</span>
                </div>
                <el-date-picker
                  v-model="filterForm.time.value"
                  class="mt-5px w-full [--el-font-size-base:12px]"
                  type="datetimerange"
                  range-separator="To"
                  start-placeholder="yyyy/mm/dd hh:mm"
                  end-placeholder="yyyy/mm/dd hh:mm"
                  format="YYYY-MM-DD HH:mm"
                  value-format="X"
                  prefix-icon="Calendar"
                  :teleported="false"
                />
                <div class="flex mt-20px">
                  <div class="flex items-center cursor-pointer">
                    <span>{{ $t('sort') }}</span>
                    <div class="flex flex-col items-center justify-center ml-5px">
                      <i
                        :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer ${
                          filterForm.time.sort_dir === 'asc'
                            ? 'border-b-[--main-text]'
                            : 'border-b-[--third-text]'
                        }
                          `"
                        @click.stop="localSortChange('block_time', 'asc')"
                      />
                      <i
                        :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer ${
                          filterForm.time.sort_dir === 'desc'
                            ? 'border-t-[--main-text]'
                            : 'border-t-[--third-text]'
                        }
                            `"
                        @click.stop="localSortChange('block_time', 'desc')"
                      />
                    </div>
                  </div>
                  <el-button class="h-30px m-l-auto min-w-70px" @click.stop="resetTime">
                    {{ $t('reset') }}
                  </el-button>
                  <el-button
                    type="primary"
                    class="h-30px m-l-auto min-w-70px"
                    @click.stop="confirmTime"
                  >
                    {{ $t('confirm') }}
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
        </template>
        <template #default="{ row }">
          <span class="color-[--third-text]">
            {{ formatDate(row.block_time, 'YYYY-MM-DD HH:mm:ss') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('type')">
        <template #header>
          <span>{{ $t('type') }}</span>
          <el-popover
            v-model:visible="filterForm.type.visible"
            placement="bottom"
            :width="207"
            trigger="click"
          >
            <template #reference>
              <Icon
                name="custom:filter"
                class="cursor-pointer text-10px ml-3px"
                :class="!trendQuery.checkAll ? 'color-[--primary-color]' : 'color-[--third-text]'"
              />
            </template>
            <template #default>
              <div>
                <el-checkbox
                  v-model="filterForm.type.checkAll"
                  :indeterminate="filterForm.type.isIndeterminate"
                  @change="handleCheckAllChange"
                >
                  {{ $t('all') }}
                </el-checkbox>
                <el-checkbox-group
                  v-model="filterForm.type.checkedTrend"
                  class="flex flex-col"
                  @change="handleCheckedChange"
                >
                  <el-checkbox
                    v-for="(item, $index) in trendTypeList"
                    :key="$index"
                    :label="item.name"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="mt-20px flex justify-between">
                <el-button
                  size="default"
                  class="h-30px flex-1"
                  @click.stop="filterForm.type.visible = false"
                >
                  {{ $t('cancel') }}
                </el-button>
                <el-button
                  size="default"
                  type="primary"
                  class="h-30px flex-1"
                  @click.stop="confirmTypeFilter"
                >
                  {{ $t('confirm') }}
                </el-button>
              </div>
            </template>
          </el-popover>
        </template>
        <template #default="{ row }">
          <span
            :style="{
              color: filterType(row?.event_type)?.color == 'green' ? upColor : downColor,
            }"
          >
            {{ filterType(row?.event_type)?.name }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="right" :label="$t('price')">
        <template #default="{ row }">
          <span class="color-[--third-text]">
            ${{ row?.token_price_u > 0 ? formatNumber(row?.token_price_u || 0, 2) : 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('amount')">
        <template #header>
          <el-popover
            v-model:visible="filterForm.amount.visible"
            :width="300"
            trigger="click"
            popper-style="--el-text-color-primary:--third-text"
          >
            <template #reference>
              <div class="flex items-center justify-end">
                <span>{{ $t('amount') }}</span>
                <Icon
                  name="custom:filter"
                  class="cursor-pointer text-10px ml-3px"
                  :class="
                    props.trendQuery.amount_min && props.trendQuery.amount_max
                      ? 'color-[--primary-color]'
                      : 'color-[--third-text] hover:color-[--secondary-text]'
                  "
                />
              </div>
            </template>
            <template #default>
              <div class="text-14px font-400 mb-8px">
                {{ $t('amount') }}
              </div>
              <div class="flex items-center mt-10px">
                <el-input
                  v-model.trim.number="filterForm.amount.amount_min"
                  :placeholder="$t('minor')"
                  clearable
                />
                <span class="ml-10px mr-10px">~</span>
                <el-input
                  v-model.trim.number="filterForm.amount.amount_max"
                  :placeholder="$t('max1')"
                  clearable
                />
              </div>
              <div class="mt-10px flex">
                <el-button class="h-30px m-l-auto min-w-70px flex-1" @click="resetAmount"
                  >{{ $t('reset') }}
                </el-button>
                <el-button
                  class="h-30px m-l-auto min-w-70px flex-1"
                  type="primary"
                  @click="confirmAmount"
                  >{{ $t('confirm') }}
                </el-button>
              </div>
            </template>
          </el-popover>
        </template>
        <template #default="{ row }">
          <div
            v-if="row?.event_type === 'ADD_LIQUIDITY' || row?.event_type === 'REMOVE_LIQUIDITY'"
            class="flex flex-col items-end justify-end"
          >
            <span class="text-10px max-w-100px whitespace-nowrap text-ellipsis overflow-hidden">
              {{ row?.amount > 0 ? formatNumber(row?.amount || 0, 2) : 0 }}
              <span class="color-#959A9F">{{ row?.symbol }}</span>
            </span>
            <span class="text-10px max-w-100px whitespace-nowrap text-ellipsis overflow-hidden">
              {{ row?.amount > 0 ? formatNumber(row?.token1_amount || 0, 2) : 0 }}
              <span class="color-#959A9F">{{ row?.token1_symbol }}</span>
            </span>
          </div>
          <span v-else>
            {{ row?.amount > 0 ? formatNumber(row?.amount || 0, 2) : 0 }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('gas')">
        <template #default="{ row }">
          <span v-if="row?.gas > 0"> ${{ formatNumber(row?.gas || 0, 2) }} </span>
          <span v-else class="color-#959A9F">--</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('value')">
        <template #header>
          <span>{{ $t('value') }}</span>
          <el-popover
            v-model:visible="filterForm.price.visible"
            placement="bottom"
            :width="300"
            trigger="click"
          >
            <template #reference>
              <Icon
                name="custom:filter"
                class="cursor-pointer text-10px ml-3px"
                :class="
                  trendQuery.volume_min && trendQuery.volume_max
                    ? 'color-[--primary-color]'
                    : 'color-[--third-text]'
                "
              />
            </template>
            <template #default>
              <span class="text-12px font-400">{{ $t('value') }}($)</span>
              <div class="flex items-center mt-10px">
                <el-input
                  v-model.trim.number="filterForm.price.volume_min"
                  :placeholder="$t('minor')"
                  clearable
                />
                <span class="ml-10px mr-10px">~</span>
                <el-input
                  v-model.trim.number="filterForm.price.volume_max"
                  :placeholder="$t('max1')"
                  clearable
                />
              </div>
              <div class="mt-10px flex">
                <el-button class="h-30px m-l-auto min-w-70px flex-1" @click="resetPrice"
                  >{{ $t('reset') }}
                </el-button>
                <el-button
                  class="h-30px m-l-auto min-w-70px flex-1"
                  type="primary"
                  @click="confirmPrice"
                  >{{ $t('confirm') }}
                </el-button>
              </div>
            </template>
          </el-popover>
        </template>
        <template #default="{ row }">
          ${{ row?.volume > 0 ? formatNumber(row?.volume || 0, 2) : 0 }}
        </template>
      </el-table-column>
      <el-table-column align="right" label="TXN">
        <template #default="{ row }">
          <a class="ml-5 a-gray font-16" href="javascript:;">
            <Icon
              name="custom:browser"
              class="text-16px color-[--third-text] cursor-pointer"
              @click.stop.self="goLink(row)"
            />
          </a>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import AveEmpty from '@/components/aveEmpty.vue'
import TokenColumn from '@/components/tokenColumn.vue'
const props = defineProps({
  trendQuery: {
    type: Object,
    default: () => ({}),
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  tableIndex: {
    type: Number,
    default: 0,
  },
  handleSortChange: {
    type: Function,
    default: () => {},
  },
  handleSort: {
    type: Function,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pageNO: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['refreshWhaleTrendList'])
const $t = getGlobalT()
const filterForm = ref({
  type: {
    visible: false,
    checkAll: false,
    checkedTrend: [],
    isIndeterminate: false,
  },
  price: {
    visible: false,
    volume_min: '',
    volume_max: '',
  },
  time: {
    visible: false,
    value: [],
    sort_dir: props.trendQuery.sort_dir,
    sort: props.trendQuery.sort,
  },
  token: {
    visible: false,
    value: '',
  },
  amount: {
    visible: false,
    amount_min: '',
    amount_max: '',
  },
})

const themeStore = useThemeStore()

const mode = computed(() => {
  return themeStore.isDark ? 'dark' : 'light'
})

const trendTypeList = computed(() => [
  { id: 'SWAP', name: $t('swap_buy') + '/' + $t('swap_sell') },
  {
    id: 'ADD_LIQUIDITY/REMOVE_LIQUIDITY',
    name: $t('ADD_LIQUIDITY') + '/' + $t('REMOVE_LIQUIDITY'),
  },
  { id: 'TRANSFER', name: $t('wallet_detail_transfer_in_out') },
  { id: 'BURN', name: $t('BURN') },
  { id: 'MINT', name: $t('mint1') },
])

// Initialize form values
onMounted(() => {
  filterForm.value.type.checkedTrend = props.trendQuery.checkedTrend
  filterForm.value.type.checkAll = props.trendQuery.checkAll
  filterForm.value.type.isIndeterminate = props.trendQuery.isIndeterminate
})

// Methods
function filterType(type) {
  const o = {
    swap_buy: {
      name: $t('swap_buy'),
      color: 'green',
    },
    swap_sell: {
      name: $t('swap_sell'),
      color: 'red',
    },
    AUTHORITY: {
      name: $t('AUTHORITY'),
      color: 'red',
    },
    ADD_LIQUIDITY: {
      name: $t('ADD_LIQUIDITY'),
      color: 'green',
    },
    NEW_COIN: {
      name: $t('NEW_COIN'),
      color: 'green',
    },
    MINT: {
      name: $t('MINT'),
      color: 'green',
    },
    FREEZE: {
      name: $t('FREEZE'),
      color: 'red',
    },
    transfer_in: {
      name: $t('transfer_in'),
      color: 'green',
    },
    transfer_out: {
      name: $t('transfer_out'),
      color: 'red',
    },
    BURN: {
      name: $t('BURN'),
      color: 'red',
    },
    NEW_PAIR: {
      name: $t('NEW_PAIR'),
      color: 'red',
    },
    THAW: {
      name: $t('THAW'),
      color: 'green',
    },
    BALANCE_CHANGE: {
      name: $t('BALANCE_CHANGE'),
      color: 'red',
    },
    REMOVE_LIQUIDITY: {
      name: $t('REMOVE_LIQUIDITY'),
      color: 'red',
    },
  }
  return o[type]
}

function goLink(row) {
  window.open(formatExplorerUrl(row.chain, row.tx_hash, 'tx'))
}
const tokenDetailSStore = useTokenDetailsStore()
const route = useRoute()

function jumpTokenDetail(row) {
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: row.token + '-' + row.chain,
      symbol: row.symbol,
      logo_url: row.logo_url,
      chain: row.chain,
      address: row.token,
      remark: '',
    },
    pairInfo: {
      target_token: row.token,
      token0_address: row.token,
      token0_symbol: row.symbol,
      token1_symbol: row.token1_symbol,
      pairAddress: '',
    },
    user_address:
      route.params.userAddress ||
      useBotStore().getWalletAddress(row.chain) ||
      useWalletStore().address,
  })
}

function handleCheckAllChange(val) {
  filterForm.value.type.checkedTrend = val ? trendTypeList.value?.map((i) => i.id) : []
  filterForm.value.type.isIndeterminate = false
}

function handleCheckedChange(val) {
  const checkedCount = val.length
  const checkAll = checkedCount === trendTypeList.value.length
  const isIndeterminate = checkedCount > 0 && checkedCount < trendTypeList.value.length
  filterForm.value.type.checkAll = checkAll
  filterForm.value.type.isIndeterminate = isIndeterminate
}

function resetTime() {
  filterForm.value.time.value = []
  filterForm.value.time.sort_dir = 'desc'
  filterForm.value.time.sort = 'block_time'
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    block_time_min: 0,
    block_time_max: 0,
    sort_dir: 'desc',
    sort: 'block_time',
  })
  filterForm.value.time.visible = false
}

function parentSetTime({ block_time_min, block_time_max } = {}) {
  filterForm.value.time.value = [block_time_min, block_time_max]
  confirmTime()
}

function confirmTime() {
  const [block_time_min, block_time_max] = filterForm.value.time.value || []
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    block_time_min,
    block_time_max,
    sort_dir: filterForm.value.time.sort_dir,
    sort: filterForm.value.time.sort,
  })
  filterForm.value.time.visible = false
}

function confirmTypeFilter() {
  const { checkAll, checkedTrend } = filterForm.value.type
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    checkAll,
    checkedTrend,
  })
  filterForm.value.type.visible = false
}

function resetPrice() {
  filterForm.value.price.volume_min = ''
  filterForm.value.price.volume_max = ''
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    volume_min: '',
    volume_max: '',
  })
  filterForm.value.price.visible = false
}

function confirmPrice() {
  const { volume_max, volume_min } = filterForm.value.price
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    volume_max,
    volume_min,
  })
  filterForm.value.price.visible = false
}

function localSortChange(sort, sort_dir) {
  filterForm.value.time.sort = sort
  filterForm.value.time.sort_dir = sort_dir
}

function confirmToken() {
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    token: filterForm.value.token.value,
  })
  filterForm.value.token.visible = false
}
function resetAmount() {
  filterForm.value.amount.amount_min = ''
  filterForm.value.amount.amount_max = ''
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    amount_min: '',
    amount_max: '',
  })
  filterForm.value.amount.visible = false
}

function confirmAmount() {
  const { amount_max, amount_min } = filterForm.value.amount
  emit('refreshWhaleTrendList', {
    ...props.trendQuery,
    amount_max,
    amount_min,
  })
  filterForm.value.amount.visible = false
}
</script>
<style lang="scss" scoped></style>
