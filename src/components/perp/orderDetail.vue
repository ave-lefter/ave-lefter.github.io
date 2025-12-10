<script setup lang="ts">
import dayjs from 'dayjs'
import { getHistoryOrderFillTransactionPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const { t } = useI18n()
const props = defineProps<{
  searchParams: any
}>()
const listData = shallowRef([])
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
    const res = await getHistoryOrderFillTransactionPage(params)
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

watch(
  () => props.searchParams,
  () => {
    // reset
    offsetData.value = ''
    listData.value = []
    listStatus.value.finished = false
    listStatus.value.error = false
    listStatus.value.loading = false
    getList()
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
      fit
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
      <el-table-column :label="t('perp')" prop="contractId">
        <template #default="{ row }">
          <span class="text-14px">{{ typeDict[row.contractId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('orderSize')" prop="fillSize">
        <template #default="{ row }">
          {{ formatNumber(row.fillSize) }} {{ typeDict[row.contractId].replace('USD', '') }}
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('swapPrice')" prop="fillPrice">
        <template #default="{ row }">
          {{
            formatNumber(row.fillPrice, {
              decimals: 2,
              limit: 20,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('role')" prop="direction" />
      <el-table-column align="right" :label="t('fee')" prop="fillFee">
        <template #default="{ row }">
          {{
            formatNumber(row.fillFee, {
              decimals: 3,
              limit: 20,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType')" prop="orderSide">
        <template #default="{ row }">
          <span :class="row.orderSide === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{
            row.side === 'BUY' ? t('buy') : t('sell')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType2')" prop="tradeType2">
        <template #default="{ row }">
          {{ t('trades') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeNo')" prop="matchFillId">
        <template #default="{ row }">
          <div class="flex items-center justify-end gap-4px">
            {{ row.matchFillId.slice(0, 4) }}...{{ row.matchFillId.slice(-4)
            }}<Icon v-copy="row.matchFillId" name="bxs:copy" class="color-[#5A5E64]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeTime')" prop="matchTime">
        <template #default="{ row }">
          {{ dayjs(Number(row.matchTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
</template>
