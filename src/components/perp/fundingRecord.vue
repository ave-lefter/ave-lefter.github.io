<script setup lang="ts">
import { SuffixIcon } from '#components'
import dayjs from 'dayjs'
import { getAllOrdersPage } from '~/api/perp'
import { getPerpStatus } from './utils'

const { t } = useI18n()
const listData = shallowRef<any[]>([])
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const offsetData = ref('')
const typeDict = computed(() => ({
  ORDER_TYPE_NORMAL_DEPOSIT: {
    value: 'ORDER_TYPE_NORMAL_DEPOSIT',
    label: t('normalDeposit'),
  },
  ORDER_TYPE_CROSS_DEPOSIT: {
    value: 'ORDER_TYPE_CROSS_DEPOSIT',
    label: t('crossDeposit'),
  },
  ORDER_TYPE_NORMAL_WITHDRAW: {
    value: 'ORDER_TYPE_NORMAL_WITHDRAW',
    label: t('normalWithdraw'),
  },
  ORDER_TYPE_CROSS_WITHDRAW: {
    value: 'ORDER_TYPE_CROSS_WITHDRAW',
    label: t('crossWithdraw'),
  },
  ORDER_TYPE_FAST_WITHDRAW: {
    value: 'ORDER_TYPE_FAST_WITHDRAW',
    label: t('fastWithdraw'),
  },
  ORDER_TYPE_TRANSFER_OUT: {
    value: 'ORDER_TYPE_TRANSFER_OUT',
    label: t('internalWithdraw'),
  },
  ORDER_TYPE_TRANSFER_IN: {
    value: 'ORDER_TYPE_TRANSFER_IN',
    label: t('internalDeposit'),
  },
}))
const searchParams = ref({
  typeList: 'ALL',
  startTime: dayjs().subtract(7, 'd').startOf('day').unix(),
  endTime: dayjs().endOf('day').unix(),
})
const typeOptions = computed(() =>
  [{ label: t('all'), value: 'ALL' }].concat(Object.values(typeDict.value))
)
const statusDict = {
  6: t('success2'),
}
function jumpToTx(chainId: string, txId: string) {
  const chainInfo = getChainInfo(chainId, true)
  window.open(formatExplorerUrl(chainInfo?.net_name, txId, 'tx'), '_blank')
}
function counterpartyAccount(sender: string, receiver: string) {
  if (sender === '0' && receiver === '0') return '--'
  return sender || receiver
}
const disabledStartDate = (date: Date) => {
  if (searchParams.value.endTime) {
    return dayjs(date).isAfter(dayjs(Number(searchParams.value.endTime) * 1000))
  }
  return false
}
const disabledEndDate = (date: Date) => {
  if (searchParams.value.startTime) {
    return dayjs(date).isBefore(dayjs(Number(searchParams.value.startTime) * 1000))
  }
  return false
}

const getList = async () => {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  const params = Object.create(null)
  Object.keys(searchParams.value).forEach((key: string) => {
    const val = searchParams.value[key] as any
    if (val) {
      if (val !== 'ALL') {
        params[key] = val
      }
    }
  })
  if (offsetData.value) {
    params.offsetData = offsetData.value
  }
  try {
    listStatus.value.loading = true
    const res = await getAllOrdersPage(params)
    let list = res.dataList || []
    if (offsetData.value) {
      list = listData.value.concat(list)
    }
    if (!res.nextPageOffsetData) {
      listStatus.value.finished = true
    }
    offsetData.value = res.nextPageOffsetData
    listData.value = list
  } catch (error) {
    listStatus.value.error = true
    ElMessage.error(error.message)
    console.error(error)
  } finally {
    listStatus.value.loading = false
  }
}

getList()

const reset = () => {
  offsetData.value = ''
  listData.value = []
  listStatus.value.finished = false
  listStatus.value.error = false
  listStatus.value.loading = false
  getList()
}
</script>

<template>
  <div class="flex items-center justify-end gap-8px mb-16px">
    <el-select
      v-model="searchParams.typeList"
      size="small"
      class="[&&]:[--el-select-width:110px]"
      popper-class="[--el-font-size-base:12px]"
      :suffix-icon="SuffixIcon"
      @change="reset"
    >
      <template #prefix>
        <span>{{ t('type') }}</span>
      </template>
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="flex items-center gap-4px text-12px">
      <el-date-picker
        v-model="searchParams.startTime"
        size="small"
        :disabled-date="disabledStartDate"
        class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
        range-separator="To"
        format="YYYY-MM-DD"
        :placeholder="t('startTime')"
        value-format="X"
        :teleported="false"
        :clearable="false"
        @change="reset"
      />
      {{ $t('to') }}
      <el-date-picker
        v-model="searchParams.endTime"
        size="small"
        :disabled-date="disabledEndDate"
        class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
        range-separator="To"
        format="YYYY-MM-DD"
        :placeholder="t('endTime2')"
        value-format="X"
        :teleported="false"
        :clearable="false"
        @change="reset"
      />
    </div>
  </div>
  <div
    v-infinite-scroll="getList"
    class="relative min-h-400px bg-[--secondary-bg]"
    :infinite-scroll-delay="200"
    :infinite-scroll-disabled="listStatus.loading || listStatus.finished || listStatus.error"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="300"
  >
    <el-table
      :data="listData"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--main-text] text-12px"
    >
      <template #empty>
        <AveEmpty v-if="!listStatus.loading && listData?.length === 0" class="pt-[40px]">
          <span class="text-12px">{{ $t('emptyNoData') }}</span>
        </AveEmpty>
        <span v-else />
      </template>
      <el-table-column :label="t('tradeTime')" prop="time">
        <template #default="{ row }">
          {{ dayjs(row.time * 1000).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('type')" prop="recordType">
        <template #default="{ row }">
          {{ typeDict[row.type as keyof typeof typeDict]?.label }}
        </template>
      </el-table-column>
      <el-table-column :label="t('status')" prop="status">
        <template #default="{ row }">
          <span
            :class="
              getPerpStatus(row.type, row.status, false) !== 'Failed'
                ? 'color-[--up-color]'
                : 'color-[--down-color]'
            "
          >
            {{ getPerpStatus(row.type, row.status) || t('failed') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('amount')" prop="amount">
        <template #default="{ row }">
          {{ formatNumber(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('tokenName')" prop="coin" />
      <el-table-column :label="t('fee')" prop="fee">
        <template #default="{ row }">
          <template v-if="row.fee || row.fee === 0">${{ formatNumber(row.fee) }}</template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column :label="t('chain')" prop="chain" />
      <el-table-column :label="t('counterpartyAccount')" prop="transferSenderAccountId">
        <template #default="{ row }">
          {{ counterpartyAccount(row.transferSenderAccountId, row.transferReceiverAccountId) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('tradeId')" prop="txId">
        <template #default="{ row }">
          <div v-if="row.txId" class="flex items-center gap-4px">
            {{ row.txId.slice(0, 4) + '...' + row.txId.slice(-4)
            }}<Icon
              name="custom:share1"
              class="color-[--third-text] hover:color-[--main-text] cursor-pointer"
              @click="jumpToTx(row.chainId, row.txId)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
</template>
