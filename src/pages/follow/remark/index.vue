<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { formatNumber2 } from '~/utils/formatNumber'
import { getRemarksDetail } from '~/api/fav'
import { deleteAttention, updateWhaleRemark, addAttention, favUsersAddMonitor, favUsersPauseMonitor } from '~/api/attention'

const botStore = useBotStore()
const walletStore = useWalletStore()
const router = useRouter()
const { t } = useI18n()

const remarkValue = ref('')
const visibleShow = ref(false)
const coords = ref({ x: 0, y: 0 })
const virtualRef = ref({
  getBoundingClientRect: () => ({
    width: 0,
    height: 0,
    top: coords.value.y,
    left: coords.value.x,
    bottom: coords.value.y,
    right: coords.value.x,
  }),
  get clientWidth() {
    return 0
  },
  get clientHeight() {
    return 0
  },
})
const rowData = ref<any>({})

const loading = ref(false)
const pageData = ref({
  total: 10,
  page: 1,
  pageSize: 20
})
const tableList = ref<any[]>([])
const { mode } = storeToRefs(useGlobalStore())

const addressValue = computed(() => {
  return botStore.evmAddress || walletStore.address
})

watch(() => walletStore.walletSignature[walletStore.address], (newValue) => {
  if (newValue) {
    getList()
  }
})


watch(() => botStore.evmAddress, (newVal) => {
  if (newVal) {
    getList()
  } else {
    tableList.value = []
  }
})

watch(() => walletStore.address, (newVal) => {
  if (newVal) {
    getList()
  } else {
    tableList.value = []
  }
})

const handleMonitor = async (row: any) => {
  if (!botStore.evmAddress) return ElMessage.warning(t('noBotWalletTip'))
  if (row.is_wallet_address_fav === 0) return ElMessage.warning(t('monitorError'))
  if (row?.is_monitored === 0) {
    await favUsersAddMonitor({
      address: row.user_address,
      app: 0,
      buy: 1,
      chain: row.user_chain,
      sell: 1,
      telegram: 0,
      user_address: addressValue.value,
      website: 1
    })
  } else {
    await favUsersPauseMonitor({
      address: row.address,
      uid: row.id
    })
  }
  ElMessage.success(t('success'))
  getList()
}


const handleRemarkShow = (row: any, event: any) => {
  const rect = event.currentTarget.getBoundingClientRect()
  coords.value = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  }
  visibleShow.value = true
  rowData.value = row
  remarkValue.value = row.remark || ''
}

// 备注
const handleRemarkGroup = async (row: any) => {
  // if (!remarkValue.value.trim()) return ElMessage.error(t('enterRemark'))
  if (remarkValue.value.length > 50) return ElMessage.error(t('remarkError'))
  await updateWhaleRemark({
    remark: remarkValue.value,
    user_address: row.user_address,
    user_chain: row.user_chain,
    self_address: addressValue.value,
  })
  ElMessage.success(t('success'))
  visibleShow.value = false
  getList()
}

const tableRowClick = (row: any) => {
  router.push(`/address/${row.user_address}-${row.user_chain}`)
}

// 处理表格排序
const handleSortChange = ({ prop, order }: any) => {
  if (prop) {
    if (order === 'ascending') {
      tableList.value = tableList.value.toSorted((a, b) => a[prop] - b[prop])
    } else if (order === 'descending') {
      tableList.value = tableList.value.toSorted((a, b) => b[prop] - a[prop])
    }
  }
}

// 取消收藏
const collect = async (row: any) => {
  if (walletStore.address && !walletStore.walletSignature[walletStore.address]) {
    await walletStore.signMessageForFavorite()
  }
  loading.value = true
  const api = row.is_wallet_address_fav === 1 ? deleteAttention : addAttention
  api({
    address: addressValue.value,
    user_address: row.user_address,
    user_chain: row.user_chain
  }).then(() => {
    ElMessage.success(row.is_wallet_address_fav === 1 ? t('attention1Canceled') : t('attention1Success'))
    getList()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    loading.value = false
  })
}

// 获取列表
const getList = async () => {
  const res: any = await getRemarksDetail({
    address: addressValue.value,
    pageNO: pageData.value.page,
    pageSize: pageData.value.pageSize,
    time_interval: '7d',
    sort_dir: 'desc'
  })
  const tableData =
    (res.data &&
      res.data?.map((i: any) => ({
        ...i,
        total_txs: safeBigNumber(i.total_sold).plus(safeBigNumber(i.total_purchase)).toString(),
        total_txs_usd: safeBigNumber(i.total_sold_usd).plus(safeBigNumber(i.total_purchase_usd)).toString(),
      }))) ||
    []
  tableList.value = tableData
}

function safeBigNumber(value: any) {
  try {
    // 尝试将值转换为 BigNumber
    const result = new BigNumber(value)
    // 如果结果是 NaN，返回 0
    if (!result.isFinite()) {
      return new BigNumber(0)
    }
    return result
  } catch (error: any) {
    console.log(error)
    // 如果发生错误，返回 0
    return new BigNumber(0)
  }
}

onMounted(() => {
  if (!botStore.evmAddress && !walletStore.address) return
  getList()
})
</script>

<template>
  <div>
    <el-table class='mt-12px' height="calc(100vh - 210px)" v-loading="loading" row-class-name="group" :data="tableList" fit
      @sort-change="handleSortChange" @row-click="tableRowClick">
      <template #empty>
        <div v-if="!loading" class="flex flex-col items-center justify-center py-30px">
          <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
          <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
          <span>{{ t('emptyNoData') }}</span>
        </div>
        <span v-else />
      </template>
      <el-table-column :label="t('address')" min-width="160" show-overflow-tooltip>
        <template #default="{ row, $index }">
          <div class="flex items-center">
            <span class="text-[#848E9C] text-12px mr-5px">
              #{{ (pageData.page - 1) * pageData.pageSize + $index + 1 }}
            </span>
            <Icon name="custom:attention" :class="row.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[#999]'"
              class="color-var(--d-999-l-666) h-16px w-16px clickable shrink-0" @click.stop.prevent="collect(row)" />
            <UserAvatar class="mx-8px" :wallet_logo="row.wallet_logo" :address="row.user_address"
              :chain="row.user_chain" iconSize="24px"></UserAvatar>
            <div class="ml-5px">
              <div class="flex items-center">
                <span class="text-14px max-w-[95px] truncate">{{ row.remark }}</span>
                <!-- 备注 -->
                <div ref="buttonRef" @click.stop.prevent='handleRemarkShow(row, $event)'>
                  <Icon class="text-[--d-666-l-999] w-12px h-12px ml-4px" name="custom:remark" />
                </div>
              </div>
              <div class="flex items-center mt-2px">
                <Icon @click.stop.prevent v-copy="row?.user_address" name="bxs:copy"
                  class="clickable text-[--d-666-l-999]" />
                <Icon name="custom:sun-icon" class="text-12px mx-5px" />
                <Icon name="custom:wallet-icon" class="text-12px" />
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('noteTime')" align="right">
        <template #default="{ row }">
          <el-tooltip placement="right" :content="dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss')">
            <div class="text-[#666]">
              {{ formatTimeFromNow(row?.create_time) }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column :label="t('tokenBalance')" align="right">
        <template #default="{ row }">
          <div>
            <div v-if="row?.main_token_balance_amount > 0">
              {{ formatNumber2(row?.main_token_balance_amount || 0, 2) }}&nbsp;{{ row.main_token_symbol }}
            </div>
            <div v-else class="text-[#666]">
              0
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('walletTotalBalance')" align="right">
        <template #default="{ row }">
          <div>
            <div v-if="row?.total_balance > 0">
              ${{ formatNumber2(row?.total_balance || 0, 1) }}
            </div>
            <div v-else class="text-[#666]">
              $0
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="t('pushTitle')" align="right">
        <template #default="{ row }">
          <div class="flex flex-row-reverse" @click.stop>
            <a class="flex items-center"
              :href="`https://t.me/AveSniperBot?start=fs-${row.user_chain}-${row.user_address}`" target="_blank">
              <Icon name="custom:documentary-wallet" class="text-16px mr-2px" />
              {{ t('documentation') }}
            </a>
            <!-- 监控 -->
            <div class="flex items-center mr-12px cursor-pointer color-[#666] group-hover:color-[var(--d-F2F2F2-l-333)]"
              @click="handleMonitor(row)" v-if="row?.user_chain === 'solana' || row?.user_chain === 'bsc'">
              <Icon name="custom:monitor-icon" class="text-16px mr-2px" />
              <span
                class="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out">
                {{ row?.is_monitored === 1 ? t('pause') : t('openMonitor') }}
              </span>
            </div>
            <div class="flex items-center mr-12px color-[#666] cursor-not-allowed" v-else>
              <Icon name="custom:monitor-icon" class="text-16px mr-2px " />
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="mt-15px" v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
      layout="prev, pager, next, ->" :total="pageData.total" :page-sizes="[10, 20, 30, 40, 50, 60]" />

    <el-popover :visible="visibleShow" :virtual-ref="virtualRef" virtual-triggering trigger="click" :width="250">
      <div>
        <div>{{ t('editRemark') }}</div>
        <el-input v-model="remarkValue" maxlength="50" show-word-limit :placeholder="t('enterRemark')"
          class="mt-8px w-200px" />
        <div class="flex items-center justify-between mt-12px gap-12px">
          <div @click="visibleShow = false"
            class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[--d-333-l-0A0B0C] px-12px py-8px rounded-4px">
            {{ t('cancel') }}
          </div>
          <div @click="handleRemarkGroup(rowData)"
            class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px">
            {{ t('confirm') }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination) {
  justify-content: center;

  button {
    border: 1px solid var(--d-333-l-00008);
    border-radius: 50%;
  }

  ul {
    margin: 0 16px;
  }
}

:deep(.el-pager li.is-active) {
  background: #3F80F7;
  color: #fff;
}

:deep(.el-pager li) {
  border-radius: 6px;
}
</style>
