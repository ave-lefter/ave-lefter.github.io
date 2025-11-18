<script setup lang="ts">
import dayjs from 'dayjs'
import { getActiveOrderPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const {t} = useI18n()
const props = defineProps<{
    searchParams:any
}>()
const listData = shallowRef([
  {
    'id': '683841759540675540',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'orderId': '683841759515509716',
    'orderSide': 'SELL',
    'fillSize': '0.001',
    'fillValue': '102.4819',
    'fillFee': '0.038943',
    'fillPrice': '102481.9',
    'liquidateFee': '0',
    'realizePnl': '0.351057',
    'direction': 'TAKER',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'isWithoutMatch': false,
    'matchSequenceId': '1399469195',
    'matchIndex': 0,
    'matchTime': '1763040580637',
    'matchAccountId': '676267549901455887',
    'matchOrderId': '683841754004193807',
    'matchFillId': 'ebd34abe-7a16-4d8a-a68f-c90f01304895',
    'positionTransactionId': '683841759574230996',
    'collateralTransactionId': '683841759574229972',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '45164200',
    'censorTime': '1763040580644',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '45367416',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1763040988044',
    'createdTime': '1763040580640',
    'updatedTime': '1763040991067'
  },
  {
    'id': '683680821361509332',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'orderId': '683680821340537812',
    'orderSide': 'BUY',
    'fillSize': '0.001',
    'fillValue': '102.0919',
    'fillFee': '0.038794',
    'fillPrice': '102091.9',
    'liquidateFee': '0',
    'realizePnl': '-0.038794',
    'direction': 'TAKER',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'isWithoutMatch': false,
    'matchSequenceId': '1394606217',
    'matchIndex': 0,
    'matchTime': '1763002209985',
    'matchAccountId': '628545873982259909',
    'matchOrderId': '683680812406670277',
    'matchFillId': 'c9ecef29-e729-4a9a-8fa9-2364ec080722',
    'positionTransactionId': '683680821395064788',
    'collateralTransactionId': '683680821395063764',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '44920082',
    'censorTime': '1763002209991',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '45123298',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1763002634900',
    'createdTime': '1763002209988',
    'updatedTime': '1763002638330'
  },
  {
    'id': '683129801413755860',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000064',
    'orderId': '683129801388590036',
    'orderSide': 'BUY',
    'fillSize': '0.10',
    'fillValue': '97.9640',
    'fillFee': '0.037226',
    'fillPrice': '979.64',
    'liquidateFee': '0',
    'realizePnl': '1.956774',
    'direction': 'TAKER',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'isWithoutMatch': false,
    'matchSequenceId': '662152746',
    'matchIndex': 0,
    'matchTime': '1762870836592',
    'matchAccountId': '675514161744052762',
    'matchOrderId': '683129797290754586',
    'matchFillId': 'c7cc4264-4e38-42c9-8b47-385a55f2a0a8',
    'positionTransactionId': '683129801447311316',
    'collateralTransactionId': '683129801447310292',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '44185362',
    'censorTime': '1762870836598',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '44388578',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762871292851',
    'createdTime': '1762870836595',
    'updatedTime': '1762871300249'
  },
  {
    'id': '683115476477281236',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'orderId': '682672000304416724',
    'orderSide': 'SELL',
    'fillSize': '0.001',
    'fillValue': '104.3000',
    'fillFee': '0.039634',
    'fillPrice': '104300.0',
    'liquidateFee': '0',
    'realizePnl': '-2.162534',
    'direction': 'TAKER',
    'isPositionTpsl': true,
    'isLiquidate': false,
    'isDeleverage': false,
    'isWithoutMatch': false,
    'matchSequenceId': '1377748628',
    'matchIndex': 0,
    'matchTime': '1762867421260',
    'matchAccountId': '678666744641881065',
    'matchOrderId': '683107038674289641',
    'matchFillId': '34ce5be5-fab1-4fad-a5da-213ff12880ca',
    'positionTransactionId': '683115476586334164',
    'collateralTransactionId': '683115476586333140',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '44162453',
    'censorTime': '1762867421285',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '44365669',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762867847282',
    'createdTime': '1762867421264',
    'updatedTime': '1762867854612'
  },
  {
    'id': '682938107108000724',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000064',
    'orderId': '682938107087029204',
    'orderSide': 'SELL',
    'fillSize': '0.10',
    'fillValue': '99.9580',
    'fillFee': '0.037984',
    'fillPrice': '999.58',
    'liquidateFee': '0',
    'realizePnl': '-0.037984',
    'direction': 'TAKER',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'isWithoutMatch': false,
    'matchSequenceId': '659740772',
    'matchIndex': 0,
    'matchTime': '1762825133108',
    'matchAccountId': '675514161744052762',
    'matchOrderId': '682938106122338842',
    'matchFillId': '010b8583-7af5-4a6b-844e-7c0c6b719e7e',
    'positionTransactionId': '682938107279968212',
    'collateralTransactionId': '682938107279967188',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '43874966',
    'censorTime': '1762825133144',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '44078182',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762825586591',
    'createdTime': '1762825133111',
    'updatedTime': '1762825594590'
  },
  {
    'id': '682672000233112532',
    'userId': '682587604402569474',
    'accountId': '682587604448707540',
    'coinId': '1000',
    'contractId': '10000001',
    'orderId': '682672000207946708',
    'orderSide': 'BUY',
    'fillSize': '0.001',
    'fillValue': '106.4229',
    'fillFee': '0.040440',
    'fillPrice': '106422.9',
    'liquidateFee': '0',
    'realizePnl': '-0.040440',
    'direction': 'TAKER',
    'isPositionTpsl': false,
    'isLiquidate': false,
    'isDeleverage': false,
    'isWithoutMatch': false,
    'matchSequenceId': '1364526406',
    'matchIndex': 0,
    'matchTime': '1762761688285',
    'matchAccountId': '663502232615911976',
    'matchOrderId': '682671972450042408',
    'matchFillId': '7f2bdddf-048b-4766-ba4c-1f8fb9ca7f45',
    'positionTransactionId': '682672000262473684',
    'collateralTransactionId': '682672000262472660',
    'extraType': '',
    'extraDataJson': '',
    'censorStatus': 'L2_APPROVED',
    'censorTxId': '43509697',
    'censorTime': '1762761688291',
    'censorFailCode': '',
    'censorFailReason': '',
    'l2TxId': '43712913',
    'l2RejectTime': '0',
    'l2RejectCode': '',
    'l2RejectReason': '',
    'l2ApprovedTime': '1762762146335',
    'createdTime': '1762761688288',
    'updatedTime': '1762762157481'
  }
])
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
      <el-table-column :width="100" align="right" :label="t('orderSize')" prop="fillSize">
        <template #default="{ row }">
         {{ formatNumber(row.fillSize)}} {{ typeDict[row.contractId].replace('USD','') }}
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('swapPrice')" prop="fillPrice">
        <template #default="{ row }">
         {{ formatNumber(row.fillPrice,{
            decimals:2,
            limit:20
         }) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('role')" prop="direction" />
      <el-table-column align="right" :label="t('fee')" prop="fillFee">
        <template #default="{row}">
            {{ formatNumber(row.fillFee,{
                 decimals:3,
                 limit:20
            }) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType')" prop="orderSide" >
        <template #default="{ row }"> 
          <span :class="row.orderSide === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{ row.side === 'BUY' ? t('buy') : t('sell') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeType2')" prop="tradeType2" >
        <template #default="{ row }"> 
          {{ t('trades') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeNo')" prop="matchFillId" >
        <template #default="{row}">
            <div class="flex items-center justify-end gap-4px">
                {{ row.matchFillId.slice(0,4) }}...{{ row.matchFillId.slice(-4) }}<Icon v-copy="row.matchFillId" name="bxs:copy" class="color-[#5A5E64]"/>
            </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('tradeTime')" prop="matchTime">
        <template #default="{row}">
            {{ dayjs(Number(row.matchTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
    </el-table-column>
    </el-table>
</template>