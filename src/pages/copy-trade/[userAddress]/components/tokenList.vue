<template>
  <div>
    <el-table
      ref="table_ref"
      :data="tableData"
      fit
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--secondary-text]"
      row-class-name="cursor-pointer"
      @row-click="jumpBalance"
    >
      <template #empty>
        <AveEmpty v-if="!loading && tableData.length === 0" class="pt-[40px]" />
        <span v-else />
      </template>
      <el-table-column :label="$t('type')" fixed="left" v-if="type === 'success' || type === 'failed'">
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
                  @click.stop="cancel"
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
          <span v-if="row.swapType ==7" class="bg-[#12B8861A] color-[--up-color] px-4px rounded-2px ml-5px text-10px"
            >{{ $t('buy') }}</span
          >
          <span v-else class="bg-[#F6465D1A] color-[--down-color] px-4px rounded-2px ml-5px text-10px">{{ $t('sell') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('token')" align="left">
        <template #default="{ row }">
          <NuxtLink
            class="px-10px flex items-center h-50px cursor-pointer"
            :to="`/token/${row.token}-${row.chain}`"
          >
            <div class="flex items-center flex-1">
              <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false">
                <template #default>
                  <TokenImg class="mr-8px" :row="row" />
                </template>
                <template #content>
                  <TokenImg
                    :row="row"
                    chain-class="hidden"
                    token-class="w-240px h-240px [&&]:mr-0 rounded-16px"
                  />
                </template>
              </el-tooltip>
              <div class="flex flex-col items-start">
                <span class="text-12px flex items-center">
                  {{ row.symbol }}
                  <img
                    v-if="row.issue_platform"
                    v-tooltip="row.issue_platform"
                    class="ml-5px w-10px h-10px rounded-full"
                    :src="formatIconTag(row.issue_platform)"
                    alt=""
                  />
                </span>
              </div>
            </div>
          </NuxtLink>
        </template>
      </el-table-column>
      <el-table-column :label="$t('totalPnL')" align="right" prop="token_profit_rate" :min-width="110" v-if="type === 'token'">
        <template #default="{ row }">
          <div>
            <div :class="!row?.totalProfit ? 'color-text-3' : ''">
              ${{ row?.totalProfit > 0 ? formatNumber(row?.totalProfit || 0, 2) : 0 }}
            </div>
            <div class="text-12px">
              <span v-if="row?.totalProfitRatio > 0" class="color-[--up-color]">
                {{ formatNumber(row?.totalProfitRatio || 0,2) }}%
              </span>
              <span v-else-if="row?.totalProfitRatio < 0" class="color-[--down-color]">
                {{ formatNumber(row?.totalProfitRatio || 0,2) }}%
              </span>
              <span v-else class="color-[--third-text]">0</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('positionsValue')" align="right" :min-width="110" v-if="type === 'success' || type === 'token'">
        <template #default="{ row }">
          <div :class="!row?.value ? 'color-text-3' : ''">
            ${{ row?.value > 0 ? formatNumber(row?.value || 0, 2) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('price')" align="right" v-if="type === 'success' || type === 'token'">
        <template #default="{ row }">
          <div :class="!row?.price ? 'color-text-3' : ''">
            ${{ row?.price > 0 ? formatNumber(row?.price || row?.price || 0 ) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('amount')" align="right">
        <template #default="{ row }">
          <div :class="!row?.amount ? 'color-text-3' : ''">
            {{ row?.amount > 0 ? formatNumber(row?.amount || 0, 2) : 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('time')" align="right" :min-width="110">
        <template #default="{ row }">
          {{ Number(row?.lastSwap) >0? formatDate(row?.lastSwap || 0, 'YYYY-MM-DD HH:mm') : '--' }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('reasonFailure')" align="right" v-if="type === 'failed'">
        <template #default="{ row }">
          <span class="color-[--down-color] text-12px">{{ row.errorLog }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('chain')" align="right">
        <template #default="{ row }">
          <div class="flex-end">
            <ChainToken :chain="row.chain" :width="16" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import AveEmpty from '@/components/aveEmpty.vue'
import { formatExplorerUrl } from '@/utils/index'
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },

  address: String,
})
const { tableData, loading, type, address } = toRefs(props)
const emit = defineEmits(['search'])
defineExpose({ reset })
const { t } = useI18n()
const hideTokenVisible = ref(false)
const currentHideToken = ref({})
const injecteIsVolUSDT = shallowRef(false)
const tokenDetailSStore = useTokenDetailsStore()
const route = useRoute()
function jumpBalance(row) {
  if (type.value == 'token') {
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
        token1_symbol: '',
        pairAddress: '',
      },
      user_address:
        (route.params.userAddress as string) ||
        useBotStore().getWalletAddress(row.chain) ||
        useWalletStore().address,
    })
  } else {
    const url = formatExplorerUrl(row?.chain as string, row?.followHash as string || row?.txHash as string, 'tx')
    window.open(url)
  }
}
const trendQuery = ref({
  checkAll: true,
})

const filterForm = ref({
  type: {
    visible: false,
    checkAll: false,
    checkedTrend: [],
    isIndeterminate: false,
  },
})
const trendTypeList = computed(() => [
  { id: 'buy', name: '买入' },
  { id: 'sell', name: '卖出' },
])
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

function confirmTypeFilter() {
  emit('search', { type: filterForm.value.type.checkAll? 'all': filterForm.value.type.checkedTrend })
  filterForm.value.type.visible = false
}
function reset() {
  filterForm.value.type.checkAll = true
  filterForm.value.type.checkedTrend = ['buy', 'sell']
  filterForm.value.type.isIndeterminate = true
}
function cancel() {
  reset()
  confirmTypeFilter()
}
const ERROR_MAP: Array<{ match: string; text: string }> = [
  { match: 'insufficient gas', text: t('copyErrorLog2') },
  { match: 'insufficient funds', text: t('copyErrorLog3') },
  { match: 'token high risk', text: t('copyErrorLog4') },
  { match: 'liquidity below', text: t('copyErrorLog5') },
  { match: 'small in amount', text: t('copyErrorLog6') },
  { match: 'slippage', text: t('copyErrorLog7') },
  { match: 'simulate err', text: t('copyErrorLog8') },
]

function mapTradeErrorMessage(errorLog?: string) {
  if (!errorLog) return t('copyErrorLog1')
  const msg = errorLog.toLowerCase()
  const found = ERROR_MAP.find(item => msg.includes(item.match))
  return found?.text ?? t('copyErrorLog1')
}
</script>

<style lang="scss" scoped>
.hover-row {
  .bxs-hide {
    display: block;
  }
}
</style>
