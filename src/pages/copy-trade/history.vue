<template>
  <div class="w-full bg-[--main-bg]">
    <div class="py-19px px-16px flex-start gap-48px">
      <NuxtLink
        :to="`/copy-trade?tab=copyTrade`"
        class="flex-start no-underline items-center color-[--main-text]"
      >
        <Icon name="majesticons:arrow-left-line" class="mr-12px"></Icon>
        <span class="text-14px">{{ $t('historyCopyTrade') }}</span>
      </NuxtLink>
    </div>
    <div
      v-infinite-scroll="onLoad"
      :infinite-scroll-delay="200"
      :infinite-scroll-disabled="tableData.loading || tableData.finished || tableData.error"
      :infinite-scroll-immediate="true"
      class="relative min-h-500px bg-[--secondary-bg]"
      infinite-scroll-distance="300"
    >
      <el-table
        ref="tableRef"
        :data="tableData.list"
        :header-cell-style="{ fontSize: '12px' }"
        fit
        :style="{ height: `${scrollbarHeight}` }"
      >
        <template #empty>
          <div v-if="!loading && tableData?.list?.length == 0" class="table-empty">
            <AveEmpty />
          </div>
          <span v-else />
        </template>
        <el-table-column
          :label="$t('address')"
          align="left"
          width="225"
          fixed="left"
          prop="token_profit_rate"
          :min-width="110"
        >
          <template #default="{ row }">
            <div class="flex-start">
              <UserAvatar
                class="mr-10px"
                iconSize="24px"
                iconChainSize="14px"
                :wallet_logo="{ url: row?.followAddress, logo: row?.followIconUrl }"
                :address="row.followAddress"
              />
              <UserRemark
                addressClass="token-symbol ellipsis color-[--main-text]"
                addressStyle="max-width: 70px"
                showAddressTitle
                :address="row.followAddress"
                :chain="row.chain"
                :remark="row.remark || row.followName"
                :wallet_logo="{ url: row?.followAddress, logo: row?.followIconUrl }"
                :formatAddress="(a) => '*' + a?.slice(-5)"
                @updateRemark="({ remark }) => (row.remark = remark)"
              />
              <Icon
                v-copy="row.followAddress"
                name="bxs:copy"
                class="text-12px cursor-pointer color-[--third-text] ml-5px"
                @click.stop.prevent
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('totalPnL')" align="right" prop="token_profit_rate" :min-width="110">
          <template #default="{ row }">
            <div>
              <div :class="!row?.totalProfit ? 'color-text-3' : ''">
              <ave-data-number :value="row?.totalProfit" :signVisible="true">
                {{ formatNumber(Math.abs(row?.totalProfit ?? 0), 2) }}
              </ave-data-number>
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
        <el-table-column :label="$t('unrealizedProfit')" align="right" prop="token_profit_rate" :min-width="110">
          <template #default="{ row }">
            <div>
              <div :class="!row?.profitUnrealized ? 'color-text-3' : ''">
              <ave-data-number :value="row?.profitUnrealized" :signVisible="true">
                {{ formatNumber(Math.abs(row?.profitUnrealized ?? 0), 2) }}
              </ave-data-number>
              </div>
              <!-- <div class="text-12px">
                <span v-if="row?.profitUnrealizedRatio > 0" class="color-[--up-color]">
                  {{ formatNumber(row?.profitUnrealizedRatio || 0) }}%
                </span>
                <span v-else-if="row?.profitUnrealizedRatio < 0" class="color-[--down-color]">
                  {{ formatNumber(row?.profitUnrealizedRatio || 0) }}%
                </span>
                <span v-else class="color-[--third-text]">0</span>
              </div> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('realizedProfit')" align="right" prop="token_profit_rate" :min-width="110">
          <template #default="{ row }">
            <div>
              <div :class="!row?.profitRealized ? 'color-text-3' : ''">
                <ave-data-number :value="row?.profitRealized" :signVisible="true">
                  {{ formatNumber(Math.abs(row?.profitRealized ?? 0), 2) }}
                </ave-data-number>
              </div>
              <!-- <div class="text-12px">
                <span v-if="row?.profitRealizedRatio > 0" class="color-[--up-color]">
                  {{ formatNumber(row?.profitRealizedRatio || 0) }}%
                </span>
                <span v-else-if="row?.profitRealizedRatio < 0" class="color-[--down-color]">
                  {{ formatNumber(row?.profitRealizedRatio || 0) }}%
                </span>
                <span v-else class="color-[--third-text]">0</span>
              </div> -->
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column :label="$t('positionsValue')" align="right" prop="token_profit_rate" :min-width="110">
          <template #default="{ row }">
            <div :class="!row?.holdingUsd ? 'color-text-3' : ''">
              ${{ row?.holdingUsd > 0 ? formatNumber(row?.holdingUsd || 0, 2) : 0 }}
            </div>
          </template>
        </el-table-column> -->

        <el-table-column :label="$t('time')" align="right" :min-width="110">
          <template #default="{ row }">
            <div>
              <span class="text-12px color-[--third-text]">
                {{ formatDate(row?.createTime, 'YYYY-MM-DD HH:mm') }}
              </span>
              ~
              <span class="text-12px color-[--third-text]">
                {{ formatDate(row?.finishTime, 'YYYY-MM-DD HH:mm') }}
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
        <span v-if="tableData.loading && tableData.pageNo > 1">{{ $t('loading') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { _getFollowHistory, type CopyObj } from '@/api/copyTrade'
const botStore = useBotStore()
const walletStore = useWalletStore()
const { t } = useI18n()
const router = useRouter()
const { height } = useWindowSize()
// const tableData = ref<CopyObj[]>([])
const tableData = ref<{
  finished: boolean
  error: boolean
  loading: boolean
  pageNo: number
  pageSize: number
  total: number
  list: CopyObj[]
}>({
  finished: false,
  error: false,
  loading: false,
  pageNo: 0,
  pageSize: 20,
  total: 0,
  list: [],
})
const loading = computed(() => {
  return tableData.value.loading
})

const scrollbarHeight = computed(() => {
  return useGlobalStore().tokenHistoryVisible ? 'calc(100vh - 182px)' : 'calc(100vh - 150px)'
})
const currentAddress = computed(() =>  botStore?.evmAddress || walletStore?.address ||'')
watch(() => currentAddress.value, (val) => {
  reset()
  if (val) {
    getFollowHistory()
  }
 })

onMounted(() => {
  tableData.value.pageNo = 0
  // getFollowHistory()
})
function onLoad() {
  getFollowHistory()
}
function getFollowHistory() {
  if (botStore?.evmAddress) {
    tableData.value.loading = true
    const data = {
      pageSize: tableData.value.pageSize,
      pageNo: tableData.value.pageNo,
      evmAddress: botStore?.evmAddress,
    }
    _getFollowHistory(data)
      .then((res) => {
        if (tableData.value.pageNo === 0) {
          tableData.value.list = []
        }
        const list = Array.isArray(res) ? res : []
        if (list?.length > 0) {
          const a = [...tableData.value.list]
          const b = list.filter((i) => a.every((j) => !(j.id === i.id)))
          tableData.value.list = [...a, ...b]
        }
        tableData.value.finished = list?.length < tableData.value.pageSize
        if (!tableData.value.finished) {
          tableData.value.pageNo++
        }
      })
      .catch(() => {
        tableData.value.list = []
        tableData.value.error = true
      })
      .finally(() => {
        tableData.value.loading = false
      })
  } else {
    reset()
  }
}
function reset() {
  tableData.value = {
    finished: false,
    error: false,
    loading: false,
    pageNo: 0,
    pageSize: 20,
    total: 0,
    list: [],
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-table-fixed-column--left) {
  .cell {
    display: flex;
    align-items: center;
  }
}
::v-deep(.el-table) {
  .el-table__body {
    tr:hover {
      .hover-dot {
        border-bottom: 1px dotted var(--secondary-text);
      }
    }
    .cell {
      padding-right: 19px;
      color: var(--secondary-text);
    }
  }
}
.table-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: calc(100vh - 260px);
}
.ellipsis {
  max-width: 100%;
}

a.trade {
  background: #3f80f71a;
  padding: 1px 7px;
  border-radius: 2px;
  font-size: 12px;
  color: var(--main-text);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 4px;
  }
}
</style>
