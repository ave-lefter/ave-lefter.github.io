<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <el-table :data="[1,2,3,4,5,6,6,7,8,9,10]" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--secondary-text]" row-class-name="cursor-pointer">
      <el-table-column :minWidth="140" :label="t('perp')" prop="perp" />
      <el-table-column :minWidth="70" :label="t('orderSize')" prop="orderSize" />
      <el-table-column :minWidth="169" :label="t('contractValue')" prop="contractValue" />
      <el-table-column :minWidth="138" :label="t('entryPrice')" prop="entryPrice" />
      <el-table-column :minWidth="138" :label="t('oraclePrice')" prop="oraclePrice" />
      <el-table-column :minWidth="151" :label="t('estimatedLiquidationPrice')" prop="estimatedLiquidationPrice" />
      <el-table-column :minWidth="198" :label="t('unrealizedPnl')" prop="unrealizedPnl" />
      <el-table-column :minWidth="170" :label="t('fundingFee')" prop="fundingFee" />
      <el-table-column :minWidth="194" :label="t('takeProfitStopLoss')" prop="takeProfitStopLoss" />
      <el-table-column :label="t('closePosition')" prop="closePosition" />
    </el-table>
</template>