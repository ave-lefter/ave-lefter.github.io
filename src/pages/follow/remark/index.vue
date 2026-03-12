<script setup lang="ts">
import { SupportCopyTradeChain } from '@/utils/constants'
import { ref, onMounted, watch, computed } from 'vue'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import { formatNumber2 } from '~/utils/formatNumber'
import { getRemarksDetail } from '~/api/fav'
// import { deleteAttention, updateWhaleRemark, addAttention, addAddressMonitor, favUsersPauseMonitor } from '~/api/attention'
import { deleteAttention, updateWhaleRemark, addAttentionNew, addAddressMonitor, favUsersPauseMonitor } from '~/api/attention'
const globalStore = useGlobalStore()
const { updateNum3 } = storeToRefs(useFollowStore())
const botStore = useBotStore()
const walletStore = useWalletStore()
const router = useRouter()
const { t } = useI18n()
const { isDark, mode } = storeToRefs(useGlobalStore())
const $refs = ref({
  buttonRefs: {} as Record<number, any>
})
// const followStore=useFollowStore()
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
  total: 0,
  page: 1,
  pageSize: 50
})
const tableList = ref<any[]>([])
const { activeCopyAddress, copyTradeVisible, form, copyOrder } = storeToRefs(useCopyTradeStore())
const addressValue = computed(() => {
  return botStore.evmAddress || walletStore.address
})

watch(() => walletStore.walletSignature[walletStore.address], (newValue) => {
  if (newValue) {
    getList()
  }
})

watch(() => updateNum3.value, () => {
  getList()
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
  if (row?.is_monitored === 0) {
    if (row.is_wallet_address_fav === 0) return ElMessage.warning(t('monitorError'))
    await addAddressMonitor({
      address: row.user_address,
      app: 0,
      buy: 1,
      chain: row.user_chain,
      sell: 1,
      telegram: 0,
      user_address: addressValue.value,
      website: 1
    }).then(() => {
      ElMessage.success(t('openMonitorSuccess'))
      getList()
    }).catch((e) => {
      ElMessage.error(String(e))
    })
  } else {
    await favUsersPauseMonitor({
      address: row.user_address,
      uid: row.id
    }).then(() => {
      ElMessage.success(t('cancelMonitorSuccess'))
      getList()
    })
  }
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

function tableRowClick(row: { user_address: string; user_chain: string }) {
  const clickAction = globalStore.audioSettings?.wallet?.clickAction
  // rightClickAction: 0 不打开, 1 新tab打开
  const routeData = router.resolve({
    path: `/address/${row.user_address}/${row.user_chain}`,
  })
  if (clickAction === 1) {
    window.open(routeData.href, '_blank')
  } else {
    window.open(routeData.href, '_self')
  }
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
  // if(row.is_wallet_address_fav !== 1){
  //   followStore.confirmAttention($refs.value.buttonRefs[index],(form)=>{
  //     console.log('confirmAttention', form)
  //     return Promise.resolve()
  //   })
  //   return
  // }
  loading.value = true
  const api = row.is_wallet_address_fav === 1 ? deleteAttention : addAttentionNew
  api({
    address: addressValue.value,
    user_address: row.user_address,
    user_chain: row.user_chain
  }).then(() => {
    ElMessage.success(row.is_wallet_address_fav === 1 ? t('attention1Canceled') : t('attention1Success'))
    getList()
  }).catch((err) => {
    ElMessage.error(String(err))
  }).finally(() => {
    loading.value = false
  })
}

// 获取列表
const getList = async () => {
  loading.value = true
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
  pageData.value.total = res.total
  tableList.value = tableData
  loading.value = false
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
function judgeIsCopyTrade(row: {user_chain: string, user_address: string}) {
  const supportAddress = activeCopyAddress.value?.[row.user_chain] || []
  return supportAddress?.some(i => i?.toLowerCase() === row.user_address?.toLowerCase())
}
function getCopyTradeId(row: {user_chain: string, user_address: string}) {
  const order = copyOrder.value?.copyList?.find(i=> i?.followAddress?.toLowerCase() === row.user_address?.toLowerCase() && i.chain == row.user_chain)
  return order?.id || ''
}

function jumpCopyTrade(row: {user_chain: string, user_address: string}) {
  const id = getCopyTradeId(row)
  const currentUser = botStore?.userInfo?.addresses?.find?.((el) => row?.user_chain == el.chain)
  if (id && currentUser?.address) {
    console.log('----currentUser--------',currentUser)
    const routeData = router.resolve({
      name: 'copy-trade-wallet',
      params: {
        userAddress: row.user_address,
        chain: row.user_chain,
      },
      query: {
        followAddress: row.user_address,
        creatorAddress: currentUser?.address,
        id: id
      }
    })
    window.open(routeData.href, '_blank')
  } else {
    const url =`https://t.me/AveSniperBot?start=fs-${row.user_chain}-${row.user_address}`
    window.open(url, '_blank')
  }
}
function copyTrade(row:  {user_chain: string, user_address: string}) {
  if (botStore.evmAddress) {
    copyTradeVisible.value = true
    form.value.followAddress = row.user_address
    form.value.chain = row.user_chain
  } else {
    const url =`https://t.me/AveSniperBot?start=fs-${row.user_chain}-${row.user_address}`
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="flex-1 h-[calc(100%-76px)] flex flex-col">
    <el-table
v-loading="loading" class="mt-12px" :height="pageData.total > 50 ? 'calc(100% - 84px)' : '100%'"
      row-class-name="group" :data="tableList" fit @sort-change="handleSortChange" @row-click="tableRowClick">
      <template #empty>
        <div v-if="botStore.evmAddress || walletStore.address">
          <div v-if="!loading" class="flex flex-col items-center justify-center py-30px">
            <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
            <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
            <span>{{ t('emptyNoData') }}</span>
          </div>
          <span v-else />
        </div>
        <AveEmpty v-else>
          <span class="text-12px mt-10px">{{ $t('noWalletTip') }}</span>
          <el-button type="primary" class="mt-10px" @click="botStore.$patch({connectVisible: true})">
            {{ $t('connectWallet') }}
          </el-button>
        </AveEmpty>
      </template>
      <el-table-column :label="t('address')" min-width="160">
        <template #default="{ row, $index }">
          <div class="flex items-center">
            <span class="text-[--third-text] text-10px mr-5px">
              #{{ (pageData.page - 1) * pageData.pageSize + $index + 1 }}
            </span>
            <Icon
:key="`${row.user_address}-${row.user_chain}`" :ref="(el: any) => $refs.buttonRefs[$index] = el"
              name="custom:attention"
              :class="row.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[--icon-color]'"
              class="color-[--icon-color] text-12px clickable shrink-0"
              @click.stop.prevent="collect(row)" />
            <UserAvatar
:key="`${row.user_address}-${row.user_chain}`" class="mx-8px" :wallet_logo="row.wallet_logo"
              :address="row.user_address" :chain="row.user_chain" iconSize="32px" />
            <div>
              <div class="flex items-center">
                <UserRemark
:key="`${row.user_address}-${row.user_chain}`" :remark="row.remark"
                  :address="row.user_address" :chain="row.user_chain"
                  addressClass="token-symbol ellipsis py-0px! text-14px lh-none color-[--main-text]" addressStyle="max-width: 85px"
                 :iconEditColor="isDark?'#7C8BA2':'#9FA6B5'" iconEditSize="10px" showAddressTitle
                  :formatAddress="(address) => address?.slice(0, 4) + '...' + address?.slice(-4)" />
              </div>
              <div class="flex items-center mt-6px">
                <Icon
v-copy="row?.user_address" name="bxs:copy" class="clickable text-[--third-text] w-12px h-12px"
                  @click.stop.prevent />
                <Icon name="custom:sun-icon" class="text-12px w-12px h-12px mx-5px" />
                <Icon name="custom:wallet-icon" class="text-12px w-12px h-12px" />
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('noteTime')" align="right">
        <template #default="{ row }">
          <el-tooltip placement="right" :content="dayjs(row.create_time).format('YYYY-MM-DD HH:mm:ss')" :persistent="false">
            <div class="text-[--secondary-text]">
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
            <a v-if="judgeIsCopyTrade(row)" href="" class="flex items-center color-[--secondary-text] trade" @click.stop.prevent="jumpCopyTrade(row)">
              <Icon  name="custom:wallet-fill" class="text-12px mr-4px" />
                {{ $t('copiedTrade') }}
            </a>
            <a
              v-else
              class="flex items-center color-[--secondary-text] trade"
              href=""
              target="_blank"
              @click.stop.prevent="copyTrade(row)"
              >
              <Icon  v-if="botStore.evmAddress && SupportCopyTradeChain?.includes?.(row.user_chain)"  name="custom:wallet-fill" class="text-12px mr-4px" />
              <img class="mr-4px" v-else src="@/assets/images/tg1.png" alt="" :width="12">
              {{ t('copyTrade') }}
            </a>
            <div
              v-if="SupportMonitorChain.includes(row?.user_chain)"
              class="flex items-center mr-12px cursor-pointer" @click="handleMonitor(row)">
              <Icon v-if="row?.is_monitored === 1" name="custom:monitor2-icon" class="text-12px mr-2px  mb--1px color-#3F80F7"/>
              <Icon v-else name="custom:monitor-icon" class="text-12px mr-2px mb-1px color-[var(--d-CCC-l-666)]"/>
              <span
                class="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out color-[--secondary-text]">
                {{ (row?.is_monitored === 1) ? t('pause') : t('enable') }}
              </span>
            </div>
            <div v-else class="flex items-center mr-12px color-[var(--d-666-l-CCC)] cursor-not-allowed">
              <Icon name="custom:monitor-icon" class="text-12px mr-2px mb-1px" />
            </div>
            <!-- 监控 -->
            <!-- <div class="flex items-center mr-12px cursor-pointer color-[#666] group-hover:color-[var(--d-F2F2F2-l-333)]"
              @click="handleMonitor(row)" v-if="row?.user_chain === 'solana' || row?.user_chain === 'bsc'">
              <Icon name="custom:monitor-icon" class="text-16px mr-2px" :class="[(row?.is_monitored === 1)&&'color-[var(--d-FFF-l-333)]']"/>
              <span
                class="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out">
                {{ row?.is_monitored === 1 ? t('pauseMonitor') : t('openMonitor') }}
              </span>
            </div>
            <div class="flex items-center mr-12px color-[#666] cursor-not-allowed" v-else>
              <Icon name="custom:monitor-icon" class="text-16px mr-2px " />
            </div> -->
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
v-if="pageData.total > 1" v-model:current-page="pageData.page"
      v-model:page-size="pageData.pageSize" class="h-72px flex justify-end items-center" layout="prev, pager, next, ->"
      :total="pageData.total" :page-sizes="[10, 20, 30, 40, 50, 60]" hide-on-single-page @change="getList" />

    <el-popover :visible="visibleShow" :virtual-ref="virtualRef" virtual-triggering trigger="click" :width="250">
      <div>
        <div>{{ t('editRemark') }}</div>
        <el-input
v-model="remarkValue"  maxlength="20" show-word-limit :placeholder="t('enterRemark')"
          class="mt-8px w-100%" />
        <div class="flex items-center justify-between mt-12px gap-12px">
          <div
class="flex-1 text-center cursor-pointer text-14px color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2] px-12px py-8px rounded-4px"
            @click="visibleShow = false">
            {{ t('cancel') }}
          </div>
          <div
class="flex-1 text-center cursor-pointer text-14px color-[#F5F5F5] bg-[#3F80F7] px-12px py-8px rounded-4px"
            @click="handleRemarkGroup(rowData)">
            {{ t('confirm') }}
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table.el-table thead .el-table__cell) {
  height: 40px;
  font-size: 12px !important;
}

:deep(.el-table .cell) {
  padding: 0 16px;
}

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

:deep() .el-table.el-table thead .el-table__cell {
  height: 40px;
}

 :deep() .el-table .el-table__cell {
   padding: 14px 0;
 }

:deep() .el-table {
  --el-table-text-color: var(--secondary-text);
}
</style>
