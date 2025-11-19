<script setup lang="ts">
import dayjs from 'dayjs'
import { getPositionTransactionPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const { t } = useI18n()
const props = defineProps<{
  searchParams: any
}>()
const perpStore = usePerpStore()
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

const getList = async () => {
  const res = await getPositionTransactionPage({
    ...props.searchParams,
    size: 10,
    filterCloseOnly: true,
  })
  listData.value = res.dataList
}

getList()
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
