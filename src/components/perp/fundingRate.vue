<script setup lang="ts">
import { SuffixIcon } from '#components'
import dayjs from 'dayjs'
import { BigNumber } from 'tronweb'
import { getPositionTransactionPage, type PositionTransactionPageResponse } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const { t } = useI18n()
const listData = shallowRef<PositionTransactionPageResponse[]>([])
const searchParams = ref({
  size: 10,
  filterTypeList: 'SETTLE_FUNDING_FEE',
  filterContractIdList: 'ALL',
  filterStartCreatedTimeInclusive: '',
  filterEndCreatedTimeExclusive: '',
})
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
const typeOptions = computed(() => {
  const contractList = perpStore.metadata?.contractList?.map?.((item) => {
    return {
      label: item.contractName,
      value: item.contractId,
    }
  })
  return [
    {
      label: t('all'),
      value: 'ALL',
    },
  ].concat(contractList || [])
})
const disabledStartDate = (date: Date) => {
  if (searchParams.value.filterEndCreatedTimeExclusive) {
    return dayjs(date).isAfter(
      dayjs(Number(searchParams.value.filterEndCreatedTimeExclusive) * 1000)
    )
  }
  return false
}
const disabledEndDate = (date: Date) => {
  if (searchParams.value.filterStartCreatedTimeInclusive) {
    return dayjs(date).isBefore(
      dayjs(Number(searchParams.value.filterStartCreatedTimeInclusive) * 1000)
    )
  }
  return false
}

const getList = async () => {
  const params = Object.create(null)
  Object.keys(searchParams.value).forEach((key: string) => {
    const val = searchParams.value[key] as any
    if (val) {
      if (['filterStartCreatedTimeInclusive', 'filterEndCreatedTimeExclusive'].includes(key)) {
        params[key] = val * 1000
      } else if (val !== 'ALL') {
        params[key] = val
      }
    }
  })
  const res = await getPositionTransactionPage({
    ...params,
    size: 10,
  })
  listData.value = res.dataList || []
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="flex items-center justify-end gap-8px mb-16px">
    <el-select
      v-model="searchParams.filterContractIdList"
      size="small"
      class="[&&]:[--el-select-width:110px]"
      popper-class="[--el-font-size-base:12px]"
      :suffix-icon="SuffixIcon"
      @change="getList"
    >
      <template #prefix>
        <span>{{ t('type') }}</span>
      </template>
      <el-option
        v-for="item in typeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
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
        @change="getList"
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
        @change="getList"
      />
    </div>
  </div>
  <el-table
    :data="listData"
    header-row-class-name="text-12px sticky top-0 z-10 font-500"
    cell-class-name="color-[--main-text] text-12px"
  >
    <el-table-column :label="t('tradeTime')" prop="fundingTime">
      <template #default="{ row }">
        {{ dayjs(+row.fundingTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('perp')" prop="contractId">
      <template #default="{ row }">
        {{ typeDict[row.contractId] }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('direction')" prop="direction">
      <template #default="{ row }">
        <span
          :class="row.fundingPositionSize > 0 ? 'color-[--up-color]' : 'color-[--down-color]'"
          >{{ row.fundingPositionSize > 0 ? t('long') : t('short') }}</span
        >
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('contractSize')" prop="contractSize">
      <template #default="{ row }">
        {{ formatNumber(new BigNumber(row.fundingPositionSize).abs().toString())
        }}{{ typeDict[row.contractId]?.replace?.('USD', '') }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('fundingFee')" prop="deltaFundingFee">
      <template #default="{ row }">
        {{ formatNumber(new BigNumber(row.deltaFundingFee).abs().toString()) }}USD
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('fundingRate')" prop="fundingRate">
      <template #default="{ row }"> {{ formatNumber(Math.abs(row.fundingRate) * 100) }}% </template>
    </el-table-column>
    <el-table-column align="right" :label="t('oraclePrice')" prop="fundingOraclePrice">
      <template #default="{ row }">
        {{
          formatNumber(row.fundingOraclePrice, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('indexPrice')" prop="fundingIndexPrice">
      <template #default="{ row }">
        {{
          formatNumber(row.fundingIndexPrice, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
  </el-table>
</template>
