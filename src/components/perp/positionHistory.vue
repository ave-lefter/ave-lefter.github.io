<script setup lang="ts">
import dayjs from 'dayjs'
import { usePerpStore } from '~/stores/perp'

const { t } = useI18n()
const perpStore = usePerpStore()
const listData = shallowRef([
  {
    userId: '682587604402569474',
    accountId: '682587604448707540',
    coinId: '1000',
    contractId: '10000001',
    termCount: 2,
    cumOpenSize: '0.001',
    cumOpenValue: '102.091900',
    cumOpenFee: '-0.038794',
    cumCloseSize: '-0.001',
    cumCloseValue: '-102.481900',
    cumCloseFee: '-0.038943',
    cumFundingFee: '-0.015429',
    cumLiquidateFee: '0',
    createdTime: '1763002209996',
    updatedTime: '1763040580648',
    currentLeverage: '10',
  },
  {
    userId: '682587604402569474',
    accountId: '682587604448707540',
    coinId: '1000',
    contractId: '10000064',
    termCount: 1,
    cumOpenSize: '-0.10',
    cumOpenValue: '-99.958000',
    cumOpenFee: '-0.037984',
    cumCloseSize: '0.10',
    cumCloseValue: '97.964000',
    cumCloseFee: '-0.037226',
    cumFundingFee: '-0.006524',
    cumLiquidateFee: '0',
    createdTime: '1762825133152',
    updatedTime: '1762870836603',
    currentLeverage: '10',
  },
])

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

const getPnl = (row: any) => {
  return row.cumOpenSize > 0
    ? Math.abs(row.cumCloseValue) - Math.abs(row.cumOpenValue)
    : Math.abs(row.cumOpenValue) - Math.abs(row.cumCloseValue)
}
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
        <div :class="getColorClass(row.cumOpenSize)">
          {{ row.cumOpenSize > 0 ? t('long') : t('short') }}
        </div>
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('contractSize')" prop="contractSize">
      <template #default="{ row }">
        {{ Math.abs(+formatNumber(row.cumOpenSize)) }}
        {{ typeDict[row.contractId].replace('USD', '') }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('closeSize')">
      <template #default="{ row }">
        {{ Math.abs(+formatNumber(row.cumCloseSize)) }}
        {{ typeDict[row.contractId].replace('USD', '') }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('status')">
      <template #default="{ row }">
        {{ Math.abs(row.cumOpenSize) === Math.abs(row.cumCloseSize) ? t('closed') : t('open') }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('openAvgPrice')">
      <template #default="{ row }">
        {{
          formatNumber(row.cumOpenValue / row.cumOpenSize, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('avgPrice2')">
      <template #default="{ row }">
        {{
          formatNumber(row.cumCloseValue / row.cumCloseSize, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('unrealizedPnl')">
      <template #default="{ row }"> -- </template>
    </el-table-column>
    <el-table-column align="right" :label="t('pnl')">
      <template #default="{ row }">
        <div :class="getColorClass(getPnl(row))">{{ formatNumber(getPnl(row)) }}</div>
        <div :class="getColorClass(getPnl(row))">
          {{
            formatNumber((getPnl(row) / Math.abs(row.cumOpenValue)) * 100, {
              limit: 20,
              decimals: 2,
            })
          }}%
        </div>
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('termCount')">
      <template #default="{ row }">
        {{ formatTime(dayjs(+row.updatedTime).diff(dayjs(+row.createdTime), 's')) }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('openTime2')">
      <template #default="{ row }">
        {{ dayjs(+row.createdTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('lastCloseTime')">
      <template #default="{ row }">
        {{ dayjs(+row.updatedTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
  </el-table>
</template>
