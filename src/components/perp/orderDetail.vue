<script setup lang="ts">
import dayjs from 'dayjs'
import { getHistoryOrderFillTransactionPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const { t } = useI18n()
const props = defineProps<{
  searchParams: any
}>()
const listData = shallowRef()
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
  const res = await getHistoryOrderFillTransactionPage({
    filterStatusList: 'CANCELING,OPEN,PENDING',
    ...props.searchParams,
  })
  listData.value = res.dataList
}

getList()

watch(
  () => props.searchParams,
  () => {
    getList()
  }
)
</script>

<template>
  <el-table
    fit
    :data="listData"
    header-row-class-name="text-12px sticky top-0 z-10 font-500"
    cell-class-name="color-[--main-text] text-12px"
  >
    <el-table-column :width="150" :label="t('perp')" prop="contractId">
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
</template>
