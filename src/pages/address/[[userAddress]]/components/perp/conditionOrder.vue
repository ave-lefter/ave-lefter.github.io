<script setup lang="ts">
import dayjs from 'dayjs'
import { getActiveOrderPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const {t} = useI18n()
const props = defineProps<{
    searchParams:any
}>()
const listData = shallowRef([{
  'id': '684372574938858452',
  'userId': '682587604402569474',
  'accountId': '682587604448707540',
  'coinId': '1000',
  'contractId': '10000001',
  'side': 'BUY',
  'price': '20.0',
  'size': '0.002',
  'clientOrderId': '8022515641823158',
  'type': 'TAKE_PROFIT_LIMIT',
  'timeInForce': 'GOOD_TIL_CANCEL',
  'reduceOnly': false,
  'triggerPrice': '10.0',
  'triggerPriceType': 'LAST_PRICE',
  'expireTime': '1764981534135',
  'sourceKey': '',
  'isPositionTpsl': false,
  'isLiquidate': false,
  'isDeleverage': false,
  'openTpslParentOrderId': '0',
  'isSetOpenTp': true,
  'openTp': {
    'side': 'SELL',
    'price': '0.0',
    'size': '0.002',
    'clientOrderId': '9130369913597811',
    'triggerPrice': '100000.0',
    'triggerPriceType': 'LAST_PRICE',
    'expireTime': '1764981534260',
    'l2Nonce': '2171935104',
    'l2Value': '0.000200',
    'l2Size': '0.002',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765759134260',
    'l2Signature': {
      'r': '0x0607f991a961991a8449fd31b95cbda7bb622e2ec8b95fe0fdac0b5d03a4c6c9',
      's': '0x07e5f02d45521633d17354079327e4584fd62a1c8b330b4a91004e04e5637dfa',
      'v': ''
    }
  },
  'isSetOpenSl': true,
  'openSl': {
    'side': 'SELL',
    'price': '0.0',
    'size': '0.002',
    'clientOrderId': '13652289201793122',
    'triggerPrice': '9.0',
    'triggerPriceType': 'LAST_PRICE',
    'expireTime': '1764981534367',
    'l2Nonce': '1174832092',
    'l2Value': '0.000200',
    'l2Size': '0.002',
    'l2LimitFee': '1.000000',
    'l2ExpireTime': '1765759134367',
    'l2Signature': {
      'r': '0x004d8a1462bf7273fd7c87ad18228e58512dc01be3f14c1a55db64a9cf2855da',
      's': '0x00a2e67abd1d0f57989487e0de75ad552d690543cad9f38ca70bc3083b370143',
      'v': ''
    }
  },
  'isWithoutMatch': false,
  'withoutMatchFillSize': '0',
  'withoutMatchFillValue': '0',
  'withoutMatchPeerAccountId': '0',
  'withoutMatchPeerOrderId': '0',
  'maxLeverage': '10',
  'takerFeeRate': '0.00038',
  'makerFeeRate': '0.00012',
  'liquidateFeeRate': '0.01',
  'marketLimitPrice': '0',
  'marketLimitValue': '0',
  'l2Nonce': '873895161',
  'l2Value': '0.040000',
  'l2Size': '0.002',
  'l2LimitFee': '1.000000',
  'l2ExpireTime': '1765759134135',
  'l2Signature': {
    'r': '0x03e10ab4afbc07ac85f3d74af92653b2709602dfa28d63ce5783ef3fa5eeecb5',
    's': '0x02387bda586cb3ce32babb166f38a4a3fdc097b0d93cb46bbefdb7e3466f5f14',
    'v': ''
  },
  'extraType': '',
  'extraDataJson': '{"requestId":"1762741223090.SZOhWT","moid":"6k10jwJ41dOlyZqmcxUc"}',
  'status': 'UNTRIGGERED',
  'matchSequenceId': '0',
  'triggerTime': '0',
  'triggerPriceTime': '0',
  'triggerPriceValue': '0',
  'cancelReason': 'UNKNOWN_ORDER_CANCEL_REASON',
  'cumFillSize': '0',
  'cumFillValue': '0',
  'cumFillFee': '0',
  'maxFillPrice': '0',
  'minFillPrice': '0',
  'cumLiquidateFee': '0',
  'cumRealizePnl': '0',
  'cumMatchSize': '0',
  'cumMatchValue': '0',
  'cumMatchFee': '0',
  'cumFailSize': '0',
  'cumFailValue': '0',
  'cumFailFee': '0',
  'cumApprovedSize': '0',
  'cumApprovedValue': '0',
  'cumApprovedFee': '0',
  'createdTime': '1763167136893',
  'updatedTime': '1763167136893'
}])
const triggerPriceTypeMap = {
    LAST_PRICE:t('latestPrice'),
    TAKE_PROFIT_LIMIT:t('takeProfitLimit')
}
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
  <el-table fit :data="listData" header-row-class-name="text-12px sticky top-0 z-10 font-500" cell-class-name="color-[--main-text] text-12px" row-class-name="cursor-pointer">
      <el-table-column :width="150" :label="t('perp')" prop="contractId" >
        <template #default="{ row }">
          <span class="text-14px">{{ typeDict[row.contractId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('orderSize')" prop="size">
        <template #default="{ row }">
         {{ formatNumber(row.size)}} {{ typeDict[row.contractId].replace('USD','') }}
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
      <el-table-column align="right" :label="t('triggerPrice')" prop="triggerPrice" >
        <template #default="{ row }">
            ≤{{ formatNumber(row.triggerPrice,1) }} {{ triggerPriceTypeMap[row.triggerPriceType as keyof typeof triggerPriceTypeMap] }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType')" prop="tradeType" >
        <template #default="{ row }"> 
          <span :class="row.side === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{ row.side === 'BUY' ? t('buy') : t('sell') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderType')" prop="orderType" >
        <template #default="{ row }"> 
          {{ triggerPriceTypeMap[row.type as keyof typeof triggerPriceTypeMap] }}
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
      <el-table-column align="right" :label="t('orderId')" prop="id" >
        <template #default="{row}">
            <div class="flex items-center justify-end gap-4px">
              {{ row.id }}
              <Icon v-copy="row.id" name="bxs:copy" class="color-[#5A5E64]"/>
            </div>
        </template>
      </el-table-column>
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
         <el-button size="small">{{ t('cancel') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
</template>