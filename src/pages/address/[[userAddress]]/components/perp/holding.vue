<script setup lang="ts">
import { usePerpStore } from '~/stores/perp'

const { t } = useI18n()
const perpStore = usePerpStore()
const listData = shallowRef()
const typeDict = computed(()=>{
    return perpStore.metadata?.contractList?.reduce?.((prev,cur)=>{
      prev[cur.contractId] = cur.contractName
      return prev
    },{} as Record<string,string>) || {}
})
</script>

<template>
  <el-table :data="listData" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--secondary-text]" row-class-name="cursor-pointer">
      <el-table-column :label="t('perp')" prop="perp" />
      <el-table-column :label="t('orderSize')" prop="orderSize">
        <template #default="{ row }">
          {{ formatNumber(Math.abs(row.cumOpenSize)) }}{{ typeDict[row.contractId]?.replace?.('USD','') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('contractValue')" prop="cumOpenValue" >
        <template #default="{ row }">
          {{ formatNumber(Math.abs(row.cumOpenValue)) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('entryPrice')" prop="cumOpenValue">
        <template #default="{ row }">
          {{ formatNumber(Math.abs(row.cumOpenValue*row.currentLeverage)) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('oraclePrice')" prop="oraclePrice" />
      <el-table-column :label="t('estimatedLiquidationPrice')" prop="estimatedLiquidationPrice" />
      <el-table-column :label="t('unrealizedPnl')" prop="unrealizedPnl" />
      <el-table-column :label="t('fundingFee')" prop="fundingFee" />
      <el-table-column :label="t('takeProfitStopLoss')" prop="takeProfitStopLoss" />
      <el-table-column :label="t('closePosition')" prop="closePosition" />
    </el-table>
</template>