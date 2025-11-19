<script setup lang="ts">
import dayjs from 'dayjs'
import { usePerpStore } from '~/stores/perp'

const { t } = useI18n()
const perpStore = usePerpStore()
const listData = shallowRef([
  {
    id: '683841759574230996',
    userId: '682587604402569474',
    accountId: '682587604448707540',
    coinId: '1000',
    contractId: '10000001',
    type: 'SELL_POSITION',
    deltaOpenSize: '-0.001',
    deltaOpenValue: '-102.091900',
    deltaOpenFee: '0.038794',
    deltaFundingFee: '0.000000',
    beforeOpenSize: '0.001',
    beforeOpenValue: '102.091900',
    beforeOpenFee: '-0.038794',
    beforeFundingFee: '-0.015429',
    fillCloseSize: '-0.001',
    fillCloseValue: '-102.481900',
    fillCloseFee: '-0.038943',
    fillOpenSize: '0.000',
    fillOpenValue: '0.000000',
    fillOpenFee: '0.000000',
    fillPrice: '102481.9',
    liquidateFee: '0',
    realizePnl: '0.351057',
    isLiquidate: false,
    isDeleverage: false,
    fundingTime: '0',
    fundingRate: '',
    fundingIndexPrice: '',
    fundingOraclePrice: '',
    fundingPositionSize: '',
    orderId: '683841759515509716',
    orderFillTransactionId: '683841759540675540',
    collateralTransactionId: '683841759574229972',
    forceTradeId: '0',
    extraType: '',
    extraDataJson: '',
    censorStatus: 'L2_APPROVED',
    censorTxId: '45164200',
    censorTime: '1763040580644',
    censorFailCode: '',
    censorFailReason: '',
    l2TxId: '45367416',
    l2RejectTime: '0',
    l2RejectCode: '',
    l2RejectReason: '',
    l2ApprovedTime: '1763040988044',
    createdTime: '1763040580644',
    updatedTime: '1763040991067',
  },
  {
    id: '683129801447311316',
    userId: '682587604402569474',
    accountId: '682587604448707540',
    coinId: '1000',
    contractId: '10000064',
    type: 'BUY_POSITION',
    deltaOpenSize: '0.10',
    deltaOpenValue: '99.958000',
    deltaOpenFee: '0.037984',
    deltaFundingFee: '0.000000',
    beforeOpenSize: '-0.10',
    beforeOpenValue: '-99.958000',
    beforeOpenFee: '-0.037984',
    beforeFundingFee: '-0.006524',
    fillCloseSize: '0.10',
    fillCloseValue: '97.964000',
    fillCloseFee: '-0.037226',
    fillOpenSize: '0.00',
    fillOpenValue: '0.000000',
    fillOpenFee: '0.000000',
    fillPrice: '979.64',
    liquidateFee: '0',
    realizePnl: '1.956774',
    isLiquidate: false,
    isDeleverage: false,
    fundingTime: '0',
    fundingRate: '',
    fundingIndexPrice: '',
    fundingOraclePrice: '',
    fundingPositionSize: '',
    orderId: '683129801388590036',
    orderFillTransactionId: '683129801413755860',
    collateralTransactionId: '683129801447310292',
    forceTradeId: '0',
    extraType: '',
    extraDataJson: '',
    censorStatus: 'L2_APPROVED',
    censorTxId: '44185362',
    censorTime: '1762870836598',
    censorFailCode: '',
    censorFailReason: '',
    l2TxId: '44388578',
    l2RejectTime: '0',
    l2RejectCode: '',
    l2RejectReason: '',
    l2ApprovedTime: '1762871292851',
    createdTime: '1762870836598',
    updatedTime: '1762871300249',
  },
  {
    id: '683115476586334164',
    userId: '682587604402569474',
    accountId: '682587604448707540',
    coinId: '1000',
    contractId: '10000001',
    type: 'SELL_POSITION',
    deltaOpenSize: '-0.001',
    deltaOpenValue: '-106.422900',
    deltaOpenFee: '0.040440',
    deltaFundingFee: '0.000000',
    beforeOpenSize: '0.001',
    beforeOpenValue: '106.422900',
    beforeOpenFee: '-0.040440',
    beforeFundingFee: '-0.035249',
    fillCloseSize: '-0.001',
    fillCloseValue: '-104.300000',
    fillCloseFee: '-0.039634',
    fillOpenSize: '0.000',
    fillOpenValue: '0.000000',
    fillOpenFee: '0.000000',
    fillPrice: '104300.0',
    liquidateFee: '0',
    realizePnl: '-2.162534',
    isLiquidate: false,
    isDeleverage: false,
    fundingTime: '0',
    fundingRate: '',
    fundingIndexPrice: '',
    fundingOraclePrice: '',
    fundingPositionSize: '',
    orderId: '682672000304416724',
    orderFillTransactionId: '683115476477281236',
    collateralTransactionId: '683115476586333140',
    forceTradeId: '0',
    extraType: '',
    extraDataJson: '',
    censorStatus: 'L2_APPROVED',
    censorTxId: '44162453',
    censorTime: '1762867421285',
    censorFailCode: '',
    censorFailReason: '',
    l2TxId: '44365669',
    l2RejectTime: '0',
    l2RejectCode: '',
    l2RejectReason: '',
    l2ApprovedTime: '1762867847282',
    createdTime: '1762867421285',
    updatedTime: '1762867854612',
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
  if (row.beforeOpenValue > 0) {
    return formatNumber(
      Math.abs(row.fillCloseValue) -
        Math.abs(row.beforeOpenValue) -
        Math.abs(row.fillCloseFee) -
        Math.abs(row.beforeOpenFee)
    )
  }
  return formatNumber(
    Math.abs(row.beforeOpenValue) -
      Math.abs(row.fillCloseValue) -
      Math.abs(row.fillCloseFee) -
      Math.abs(row.beforeOpenFee)
  )
}
</script>

<template>
  <el-table
    fit
    :data="listData"
    header-row-class-name="text-12px sticky top-0 z-10 font-500"
    cell-class-name="color-[--main-text] text-12px"
    row-class-name="cursor-pointer"
  >
    <el-table-column :width="150" :label="t('perp')" prop="contractId">
      <template #default="{ row }">
        <span class="text-14px">{{ typeDict[row.contractId] }}</span>
      </template>
    </el-table-column>
    <el-table-column :width="120" align="right" :label="t('orderSize')">
      <template #default="{ row }">
        {{ formatNumber(row.beforeOpenSize) }} {{ typeDict[row.contractId].replace('USD', '') }}
      </template>
    </el-table-column>
    <el-table-column :width="150" align="right" :label="t('entryPrice')">
      <template #default="{ row }">
        {{
          formatNumber(row.beforeOpenValue / row.beforeOpenSize, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column :width="150" align="right" :label="t('exitPrice')">
      <template #default="{ row }">
        {{
          formatNumber(row.fillPrice, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column :width="80" align="right" :label="t('tradeType')" prop="side">
      <template #default="{ row }">
        <span :class="row.type.includes('BUY') ? 'color-[--up-color]' : 'color-[--down-color]'">{{
          row.type.includes('BUY') ? t('sell') : t('buy')
        }}</span>
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('closePnl')" prop="closePnl">
      <template #default="{ row }">
        <div class="flex items-center justify-end gap-4px">
          <span :class="getColorClass(getPnl(row))">
            {{ addSign(+getPnl(row)) }}{{ Math.abs(+getPnl(row)) }}
          </span>
          <el-popover :width="200">
            <template #reference>
              <Icon name="custom:info" />
            </template>
            <div>
              <div class="color-[--main-text] font-bold mb-8px">
                {{ t('closePnlDetail') }}
              </div>
              <div class="flex items-center justify-between text-12px mb-16px">
                <span class="color-[--third-text]">{{ t('closeValue') }}</span>
                <span>{{ formatNumber(Math.abs(row.fillCloseValue), { limit: 20 }) }}</span>
              </div>
              <div class="flex items-center justify-between text-12px mb-16px">
                <span class="color-[--third-text]">{{ t('openValue') }}</span>
                <span>{{ formatNumber(Math.abs(row.beforeOpenValue), { limit: 20 }) }}</span>
              </div>
              <div class="flex items-center justify-between text-12px mb-16px">
                <span class="color-[--third-text]">{{ t('fee') }}</span>
                <span>{{
                  formatNumber(Math.abs(row.fillCloseFee) + Math.abs(row.beforeOpenFee), {
                    limit: 20,
                  })
                }}</span>
              </div>
              <div class="flex items-center justify-between text-12px mb-16px">
                <span class="color-[--third-text]">{{ t('fundingFee') }}</span>
                <span>{{ formatNumber(row.deltaFundingFee, { limit: 20 }) }}</span>
              </div>
              <div class="flex flex-col text-12px mb-16px gap-4px">
                <span class="color-[--third-text]">{{ t('long2') }}</span>
                <span>{{ t('longPnl') }}</span>
              </div>
              <div class="flex flex-col text-12px">
                <span class="color-[--third-text]">{{ t('short2') }}</span>
                <span>{{ t('shortPnl') }}</span>
              </div>
            </div>
          </el-popover>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('openFee')" prop="openFee">
      <template #default="{ row }">
        {{ formatNumber(Math.abs(row.beforeOpenFee), { limit: 20 }) }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('closeFee')" prop="closeFee">
      <template #default="{ row }">
        {{ formatNumber(Math.abs(row.fillCloseFee), { limit: 20 }) }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('fundingFee')" prop="fundingFee">
      <template #default="{ row }">
        {{ formatNumber(Math.abs(row.deltaFundingFee), { limit: 20 }) }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('exitType')" prop="exitType">
      {{ t('trades') }}
    </el-table-column>
    <el-table-column align="right" :label="t('tradeTime')" prop="fundingTime">
      <template #default="{ row }">
        {{ dayjs(+row.censorTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
  </el-table>
</template>
