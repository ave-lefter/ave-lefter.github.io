<script setup lang="ts">
import { SuffixIcon } from '#components'
import dayjs from 'dayjs'

const { t } = useI18n()
const typeDict = computed(()=>({
  ORDER_TYPE_NORMAL_DEPOSIT:{
    value:'ORDER_TYPE_NORMAL_DEPOSIT',
    label:t('normalDeposit')
  },
  ORDER_TYPE_CROSS_DEPOSIT:{
    value:'ORDER_TYPE_CROSS_DEPOSIT',
    label:t('crossDeposit')
  },
  ORDER_TYPE_NORMAL_WITHDRAW:{
    value:'ORDER_TYPE_NORMAL_WITHDRAW',
    label:t('normalWithdraw')
  },
  ORDER_TYPE_CROSS_WITHDRAW:{
    value:'ORDER_TYPE_CROSS_WITHDRAW',
    label:t('crossWithdraw')
  },
  ORDER_TYPE_FAST_WITHDRAW:{
    value:'ORDER_TYPE_FAST_WITHDRAW',
    label:t('fastWithdraw')
  },
  ORDER_TYPE_INTERNAL_WITHDRAW:{
    value:'ORDER_TYPE_INTERNAL_WITHDRAW',
    label:t('internalWithdraw')
  },
  ORDER_TYPE_INTERNAL_DEPOSIT:{
    value:'ORDER_TYPE_INTERNAL_DEPOSIT',
    label:t('internalDeposit')
  }
}))
const searchParams = ref({
  typeList:'ALL',
  startTime:'',
  endTime:''
})
const typeOptions = computed(()=>[{label:t('all'),value:'ALL'}].concat(Object.values(typeDict.value)))
const statusDict = {
  6:t('success2'),
}
const list = [
  {
    'orderId': '1172415724396740608',
    'time': '1762754491',
    'type': 'ORDER_TYPE_CROSS_DEPOSIT',
    'status': 6,
    'amount': '21.543289060371890153',
    'fee': '',
    'txId': '0xb05e9e5e7c8354b3cb5e40a4387c16d14bc8d45538dd062a7fb64c3417398c51',
    'chain': 'BNB Chain',
    'address': '0x59A2a187C5B09fE0F1D5eC0dDB7adf7d1228F1aa',
    'coin': 'USDT',
    'chainId': '56',
    'transferSenderAccountId': '0',
    'transferReceiverAccountId': '0'
  }
]
function jumpToTx(chainId:string,txId:string){
  const chainInfo = getChainInfo(chainId,true)
  window.open(formatExplorerUrl(chainInfo?.net_name,txId,'tx'),'_blank')
}
function counterpartyAccount(sender:string,receiver:string) {
  if(sender === '0' && receiver === '0') return '--'
  return sender || receiver
}
const disabledStartDate = (date:Date)=>{
    if(searchParams.value.endTime){
    return dayjs(date).isAfter(dayjs(Number(searchParams.value.endTime)*1000)) 
    }
    return false
}
const disabledEndDate = (date:Date)=>{
  if(searchParams.value.startTime){
    return dayjs(date).isBefore(dayjs(Number(searchParams.value.startTime)*1000))
  }
  return false
}
</script>

<template>
  <div class="flex items-center justify-end gap-8px mb-16px">
    <el-select v-model="searchParams.typeList" size="small" class="[&&]:[--el-select-width:110px]" popper-class="[--el-font-size-base:12px]" :suffix-icon="SuffixIcon">
      <template #prefix>
        <span>{{ t('type') }}</span>
      </template>
      <el-option v-for="item in typeOptions" :key="item.value"  :label="item.label" :value="item.value"/>
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
        />
      </div>
  </div>
  <el-table :data="list" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--main-text] text-12px" row-class-name="cursor-pointer">
      <el-table-column :label="t('tradeTime')" prop="time" >
        <template #default="{ row }">
          {{ dayjs(row.time*1000).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('recordType')" prop="recordType" >
        <template #default="{ row }">
          {{ typeDict[row.type as keyof typeof typeDict]?.label }}
        </template>
      </el-table-column>
      <el-table-column :label="t('status')" prop="status">
        <template #default="{ row }">
          <span :class="row.status === 6 ? 'color-[--up-color]' : 'color-[--down-color]'">
            {{ statusDict[row.status as keyof typeof statusDict] || t('failed') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('amount')" prop="amount" >
        <template #default="{ row }">
          {{ formatNumber(row.amount) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('tokenName')" prop="coin" />
      <el-table-column :label="t('fee')" prop="fee" >
        <template #default="{ row }">
          <template v-if="row.fee || row.fee===0">${{ formatNumber(row.fee) }}</template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column :label="t('chain')" prop="chain" />
      <el-table-column :label="t('counterpartyAccount')" prop="transferSenderAccountId" >
        <template #default="{ row }"> 
          {{counterpartyAccount(row.transferSenderAccountId,row.transferReceiverAccountId)}}
        </template>
        </el-table-column>
      <el-table-column :label="t('tradeId')" prop="txId" >
        <template #default="{ row }">
          <div class="flex items-center gap-4px">
            {{row.txId.slice(0,4)+'...' + row.txId.slice(-4)}}<Icon name="custom:share1" class="color-[--third-text] hover:color-[--main-text]" @click="jumpToTx(row.chainId,row.txId)"/>
          </div>
        </template>
      </el-table-column>
    </el-table>
</template>