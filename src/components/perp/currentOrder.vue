<script setup lang="ts">
import dayjs from 'dayjs'
import { cancelOrderById, getActiveOrderPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'
import { Warning } from '@element-plus/icons-vue'
import { usePerpWsPrivateStore } from '~/stores/perp/wsPrivate'
const { mode } = storeToRefs(useGlobalStore())
const perpStore = usePerpStore()
const { t } = useI18n()
const props = defineProps<{
  searchParams: any
}>()
const wsPrivateStore = usePerpWsPrivateStore()
const { isCancelOrder } = storeToRefs(usePerpStore())
const listData = shallowRef()
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const offsetData = ref('')
const typeDict = computed(() => {
  const contractMap =
    perpStore.metadata?.contractList?.reduce?.(
      (prev, cur) => {
        prev[cur.contractId] = cur.contractName
        return prev
      },
      {} as Record<string, string>
    ) || {}
  contractMap.ALL = t('all')
  return contractMap
})

const getList = async () => {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  const params = {
    filterStatusList: 'CANCELING,OPEN,PENDING',
    ...props.searchParams,
  }
  if (offsetData.value) {
    params.offsetData = offsetData.value
  }
  try {
    listStatus.value.loading = true
    const res = await getActiveOrderPage(params)
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
    console.error(error)
  } finally {
    listStatus.value.loading = false
  }
}
getList()
const cancelOrder = async (orderIds: string[]) => {
  await cancelOrderById(orderIds)
  getList()
  ElMessage.success(t('cancelledOrderSuccessfully'))
}
watch(
  () => props.searchParams,
  () => {
    offsetData.value = ''
    listData.value = []
    listStatus.value.finished = false
    listStatus.value.error = false
    listStatus.value.loading = false
    getList()
  }
)
// watch(
//   () => wsPrivateStore.wsResult,
//   (val) => {
//     listData.value = val['trade-event']?.content?.data?.order?.filter(i=> i.status !=='CANCELED') || []
//     perpStore.orderList = listData.value
//   },
//   { immediate: true, deep: true }
// )
watch(
  () => isCancelOrder.value,
  (val) => {
    if (val) {
      ElMessageBox.confirm('确认是否取消所有委托订单?', '取消全部委托', {
        type: 'warning',
        icon: markRaw(Warning),
        confirmButtonText: t('confirm'),
        cancelButtonText: t('cancel'),
        customClass: `${mode.value} delete_confirm`,
      })
        .then(() => {
          const ids = listData.value?.map((i) => i.id)
          cancelOrderById(ids)
            .then(() => {
              ElMessage.success(t('cancelledOrderSuccessfully'))
              getList()
            })
            .finally(() => {
              isCancelOrder.value = false
            })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
)
</script>

<template>
  <div
    class="relative min-h-400px bg-[--secondary-bg]"
    v-infinite-scroll="getList"
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
        <AveEmpty v-if="!listStatus.loading && listData?.length === 0" class="pt-[40px]" />
        <span v-else />
      </template>
      <el-table-column :label="t('perp')" prop="contractId">
        <template #default="{ row }">
          <span class="text-14px">{{ typeDict[row.contractId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('delegatePrice')" prop="price">
        <template #default="{ row }">
          {{
            formatNumber(row.price, {
              decimals: 2,
              limit: 20,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column :width="150" align="right" :label="t('tradeVolume')" prop="contractSize">
        <template #default="{ row }">
          {{ formatNumber(row.cumMatchSize, 3) }}/{{ formatNumber(row.l2Size, 3) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType')" prop="tradeType">
        <template #default="{ row }">
          <span :class="row.side === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{
            row.side === 'BUY' ? t('buy') : t('sell')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('takeProfitStopLoss')" prop="takeProfitStopLoss">
        <template #default="{ row }">
          <span class="color-[--up-color]" v-if="row.openTp.triggerPrice">{{
            formatNumber(row.openTp.triggerPrice, {
              limit: 20,
              decimals: 1,
            })
          }}</span
          ><span v-else>--</span><span class="color-[--icon-color] mx-4px">/</span
          ><span class="color-[--down-color]" v-if="row.openSl.triggerPrice">
            {{
              formatNumber(row.openSl.triggerPrice, {
                limit: 20,
                decimals: 1,
              })
            }}
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderId')" prop="id">
        <template #default="{ row }">
          <div class="flex items-center justify-end gap-4px">
            {{ row.id }}<Icon v-copy="row.id" name="bxs:copy" class="color-[#5A5E64]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderTime')" prop="createdTime">
        <template #default="{ row }">
          {{ dayjs(Number(row.createdTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('validityPeriod')" prop="l2ExpireTime">
        <template #default="{ row }">
          {{ dayjs(Number(row.l2ExpireTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('operate')" prop="operate">
        <template #default="{ row }">
          <el-button
            size="small"
            style="--el-button-active-border-color: transparent"
            @click="cancelOrder([row.id])"
            >{{ t('cancel') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
</template>
