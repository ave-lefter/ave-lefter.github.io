<script setup lang="ts">
import dayjs from 'dayjs'
import { getActiveOrderPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const {t} = useI18n()
const props = defineProps<{
    searchParams:any
}>()
const listData = shallowRef([])
const typeDict = computed(()=>{
    const contractMap =  perpStore.metadata?.contractList?.reduce?.((prev,cur)=>{
      prev[cur.contractId] = cur.contractName
      return prev
    },{} as Record<string,string>) || {}
      contractMap.ALL = t('all')
      return contractMap
})

const getList = async ()=>{
  const res = await getActiveOrderPage({
    filterStatusList:'CANCELING,OPEN,PENDING',
    ...props.searchParams
  })
  listData.value = res.dataList
}

getList()
</script>

<template>
  <el-table :data="listData" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--main-text] text-12px" row-class-name="cursor-pointer">
      <el-table-column :label="t('perp')" prop="contractId" >
        <template #default="{ row }">
          <span class="text-14px">{{ typeDict[row.contractId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('delegatePrice')" prop="price">
        <template #default="{ row }">
         {{ formatNumber(row.price,{
            decimals:2,
            limit:20
         }) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeVolume')" prop="contractSize" >
        <template #default="{ row }">
          {{ formatNumber(row.cumMatchSize,3) }}/{{ formatNumber(row.l2Size,3) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType')" prop="tradeType" >
        <template #default="{ row }"> 
          <span :class="row.side === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{ row.side === 'BUY' ? t('buy') : t('sell') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('takeProfitStopLoss')" prop="takeProfitStopLoss" >
        <template #default="{ row }">
         <span class="color-[--up-color]">{{ formatNumber(row.openTp.triggerPrice,{
            limit:20,
            decimals:1
         }) }}</span><span class="color-[--icon-color] mx-4px">/</span><span class="color-[--down-color]">
            {{ formatNumber(row.openSl.triggerPrice,{
            limit:20,
            decimals:1
         }) }}
         </span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderId')" prop="id" />
      <el-table-column align="right" :label="t('orderTime')" prop="createdTime" >
        <template #default="{ row }"> 
         {{ dayjs(Number(row.createdTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('validityPeriod')" prop="l2ExpireTime" >
        <template #default="{ row }"> 
         {{ dayjs(Number(row.l2ExpireTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('operate')" prop="operate" >
        <template #default="{ row }"> 
         <el-button>{{ t('cancel') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>