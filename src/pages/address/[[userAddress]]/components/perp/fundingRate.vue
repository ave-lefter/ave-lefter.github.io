<script setup lang="ts">
import { SuffixIcon } from '#components'
import dayjs from 'dayjs'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const { t } = useI18n()
const searchParams = ref({
  filterTypeList:'SETTLE_FUNDING_FEE',
  filterContractIdList:'ALL',
  filterStartCreatedTimeInclusive:'',
  filterEndCreatedTimeExclusive:''
})
const typeDict = computed(()=>{
    const contractMap =  perpStore.metadata?.contractList?.reduce?.((prev,cur)=>{
      prev[cur.contractId] = cur.contractName
      return prev
    },{} as Record<string,string>) || {}
      contractMap.ALL = t('all')
      return contractMap
})
const typeOptions = computed(()=>{
  const contractList =  perpStore.metadata?.contractList?.map?.(item=>{
    return {
      label:item.contractName,
      value:item.contractId
    }
  })
  return [{
    label:t('all'),
    value:'ALL'
  }].concat(contractList || [])
})
const list = [
  {
    'id': '682913270562031572',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'type': 'SETTLE_FUNDING_FEE',
    'deltaOpenSize': '0',
    'deltaOpenValue': '0',
    'deltaOpenFee': '0',
    'deltaFundingFee': '-0.005301',
    'beforeOpenSize': '0.001',
    'beforeOpenValue': '106.422900',
    'beforeOpenFee': '-0.040440',
    'beforeFundingFee': '-0.015851',
    'fillCloseSize': '',
    'fillCloseValue': '',
    'fillCloseFee': '',
    'fillOpenSize': '',
    'fillOpenValue': '',
    'fillOpenFee': '',
    'fillPrice': '',
    'liquidateFee': '',
    'realizePnl': '',
    'isLiquidate': false,
    'isDeleverage': false,
    'fundingTime': '1762819200000',
    'fundingRate': '0.00005000',
    'fundingIndexPrice': '106006.378880724',
    'fundingOraclePrice': '106010.0895143114030361175537109375',
    'fundingPositionSize': '0.001',
    'orderId': '0',
    'orderFillTransactionId': '0',
    'collateralTransactionId': '682913270562030548',
    'forceTradeId': '0',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '43833758',
    'censorTime': '1762819200205',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '44036974',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762819658475',
    'createdTime': '1762819200205',
    'updatedTime': '1762819670143'
  },
  {
    'id': '682852870562777044',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'type': 'SETTLE_FUNDING_FEE',
    'deltaOpenSize': '0',
    'deltaOpenValue': '0',
    'deltaOpenFee': '0',
    'deltaFundingFee': '-0.005289',
    'beforeOpenSize': '0.001',
    'beforeOpenValue': '106.422900',
    'beforeOpenFee': '-0.040440',
    'beforeFundingFee': '-0.010562',
    'fillCloseSize': '',
    'fillCloseValue': '',
    'fillCloseFee': '',
    'fillOpenSize': '',
    'fillOpenValue': '',
    'fillOpenFee': '',
    'fillPrice': '',
    'liquidateFee': '',
    'realizePnl': '',
    'isLiquidate': false,
    'isDeleverage': false,
    'fundingTime': '1762804800000',
    'fundingRate': '0.00005000',
    'fundingIndexPrice': '105815.678578784',
    'fundingOraclePrice': '105793.96956600248813629150390625',
    'fundingPositionSize': '0.001',
    'orderId': '0',
    'orderFillTransactionId': '0',
    'collateralTransactionId': '682852870562776020',
    'forceTradeId': '0',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '43780322',
    'censorTime': '1762804800204',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '43983538',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762805401982',
    'createdTime': '1762804800204',
    'updatedTime': '1762805412032'
  },
  {
    'id': '682792472090249172',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'type': 'SETTLE_FUNDING_FEE',
    'deltaOpenSize': '0',
    'deltaOpenValue': '0',
    'deltaOpenFee': '0',
    'deltaFundingFee': '-0.005253',
    'beforeOpenSize': '0.001',
    'beforeOpenValue': '106.422900',
    'beforeOpenFee': '-0.040440',
    'beforeFundingFee': '-0.005309',
    'fillCloseSize': '',
    'fillCloseValue': '',
    'fillCloseFee': '',
    'fillOpenSize': '',
    'fillOpenValue': '',
    'fillOpenFee': '',
    'fillPrice': '',
    'liquidateFee': '',
    'realizePnl': '',
    'isLiquidate': false,
    'isDeleverage': false,
    'fundingTime': '1762790400000',
    'fundingRate': '0.00005000',
    'fundingIndexPrice': '105073.673452809',
    'fundingOraclePrice': '105046.823439188301563262939453125',
    'fundingPositionSize': '0.001',
    'orderId': '0',
    'orderFillTransactionId': '0',
    'collateralTransactionId': '682792472090248148',
    'forceTradeId': '0',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '43711279',
    'censorTime': '1762790400204',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '43914495',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762790710503',
    'createdTime': '1762790400204',
    'updatedTime': '1762790722930'
  },
  {
    'id': '682732075563878356',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'type': 'SETTLE_FUNDING_FEE',
    'deltaOpenSize': '0',
    'deltaOpenValue': '0',
    'deltaOpenFee': '0',
    'deltaFundingFee': '-0.005309',
    'beforeOpenSize': '0.001',
    'beforeOpenValue': '106.422900',
    'beforeOpenFee': '-0.040440',
    'beforeFundingFee': '0',
    'fillCloseSize': '',
    'fillCloseValue': '',
    'fillCloseFee': '',
    'fillOpenSize': '',
    'fillOpenValue': '',
    'fillOpenFee': '',
    'fillPrice': '',
    'liquidateFee': '',
    'realizePnl': '',
    'isLiquidate': false,
    'isDeleverage': false,
    'fundingTime': '1762776000000',
    'fundingRate': '0.00005000',
    'fundingIndexPrice': '106176.649234653',
    'fundingOraclePrice': '106176.505000330507755279541015625',
    'fundingPositionSize': '0.001',
    'orderId': '0',
    'orderFillTransactionId': '0',
    'collateralTransactionId': '682732075563877332',
    'forceTradeId': '0',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '43601637',
    'censorTime': '1762776000203',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '43804853',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762776574291',
    'createdTime': '1762776000203',
    'updatedTime': '1762776587443'
  }
]
const disabledStartDate = (date:Date)=>{
    if(searchParams.value.filterEndCreatedTimeExclusive){
    return dayjs(date).isAfter(dayjs(Number(searchParams.value.filterEndCreatedTimeExclusive)*1000)) 
    }
    return false
}
const disabledEndDate = (date:Date)=>{
  if(searchParams.value.filterStartCreatedTimeInclusive){
    return dayjs(date).isBefore(dayjs(Number(searchParams.value.filterStartCreatedTimeInclusive)*1000))
  }
  return false
}
</script>

<template>
  <div class="flex items-center justify-end gap-8px mb-16px">
    <el-select v-model="searchParams.filterContractIdList" size="small" class="[&&]:[--el-select-width:110px]" popper-class="[--el-font-size-base:12px]" :suffix-icon="SuffixIcon">
      <template #prefix>
        <span>{{ t('type') }}</span>
      </template>
      <el-option v-for="item in typeOptions" :key="item.value"  :label="item.label" :value="item.value"/>
    </el-select>
    <div class="flex items-center gap-4px text-12px">
        <el-date-picker
          v-model="searchParams.filterStartCreatedTimeInclusive"
          size="small"
          :disabled-date="disabledStartDate"
          class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
          range-separator="To"
          format="YYYY-MM-DD"
          :placeholder="t('startTime')"
          value-format="X"
          :teleported="false"
        />
        {{ $t('to') }}
        <el-date-picker
          v-model="searchParams.filterEndCreatedTimeExclusive"
          size="small"
          :disabled-date="disabledEndDate"
          class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
          range-separator="To"
          format="YYYY-MM-DD"
          :placeholder="t('endTime1')"
          value-format="X"
          :teleported="false"
        />
      </div>
  </div>
  <el-table :data="list" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--main-text] text-12px" row-class-name="cursor-pointer">
      <el-table-column :label="t('tradeTime')" prop="fundingTime" >
        <template #default="{ row }">
          {{ dayjs(+row.fundingTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('perp')" prop="contractId" >
        <template #default="{ row }">
          {{ typeDict[row.contractId] }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('direction')" prop="direction">
        <template #default="{ row }">
          <span :class="row.fundingPositionSize > 0 ? 'color-[--up-color]' : 'color-[--down-color]'">{{row.fundingPositionSize > 0 ? t('long') : t('short')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('contractSize')" prop="contractSize" >
        <template #default="{ row }">
          {{ formatNumber(row.fundingPositionSize) }}{{ typeDict[row.contractId]?.replace?.('USD','') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('fundingFee')" prop="deltaFundingFee" >
        <template #default="{ row }"> 
          {{ formatNumber(row.deltaFundingFee) }}USD
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('fundingRate')" prop="fundingRate" >
        <template #default="{ row }">
         {{ row.fundingRate * 100 }}%
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('oraclePrice')" prop="fundingOraclePrice" >
        <template #default="{ row }"> 
          {{ formatNumber(row.fundingOraclePrice,{
            limit:20,
            decimals:2
          }) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('indexPrice')" prop="fundingIndexPrice" >
        <template #default="{ row }"> 
          {{ formatNumber(row.fundingIndexPrice,{
            limit:20,
            decimals:2
          }) }}
        </template>
      </el-table-column>
    </el-table>
</template>