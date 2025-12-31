<script setup lang="ts">
import { SuffixIcon } from '#components'
import dayjs from 'dayjs'
import { BigNumber } from 'tronweb'
import { getPositionTransactionPage, type PositionTransactionPageResponse } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const { t } = useI18n()
const listData = shallowRef<PositionTransactionPageResponse[]>([])
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const offsetData = ref('')
const searchParams = ref({
  filterTypeList: 'SETTLE_FUNDING_FEE',
  filterContractIdList: 'ALL',
  filterStartCreatedTimeInclusive: dayjs().subtract(7, 'd').startOf('day').unix(),
  filterEndCreatedTimeExclusive: dayjs().endOf('day').unix(),
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
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
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
  if (offsetData.value) {
    params.offsetData = offsetData.value
  }
  try {
    listStatus.value.loading = true
    const res = await getPositionTransactionPage(params)
    let list = res.dataList || []
    if (offsetData.value) {
      list = listData.value.concat(list)
    }
    if (!res.nextPageOffsetData) {
      listStatus.value.finished = true
    }
    offsetData.value = res.nextPageOffsetData
    listData.value = list
  } catch (error) {
    listStatus.value.error = true
    console.error(error)
  } finally {
    listStatus.value.loading = false
  }
}

getList()

const reset = () => {
  offsetData.value = ''
  listData.value = []
  listStatus.value.finished = false
  listStatus.value.error = false
  listStatus.value.loading = false
  getList()
}
</script>

<template>
  <div class="flex items-center justify-end gap-8px mb-16px">
    <el-select
      v-model="searchParams.filterContractIdList"
      size="small"
      class="[&&]:[--el-select-width:110px]"
      popper-class="[--el-font-size-base:12px]"
      :suffix-icon="SuffixIcon"
      @change="reset"
    >
      <template #prefix>
        <span>{{ t('perp') }}</span>
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
        :clearable="false"
        @change="reset"
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
        :clearable="false"
        @change="reset"
      />
    </div>
  </div>
  <div
    v-infinite-scroll="getList"
    class="relative min-h-400px bg-[--secondary-bg]"
    :infinite-scroll-delay="200"
    :infinite-scroll-disabled="listStatus.loading || listStatus.finished || listStatus.error"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="300"
  >
    <el-table
      :data="listData"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--main-text] text-12px"
    >
      <template #empty>
        <AveEmpty v-if="!listStatus.loading && listData?.length === 0" class="pt-[40px]">
          <span class="text-12px">{{ $t('emptyNoData') }}</span>
        </AveEmpty>
        <span v-else />
      </template>
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
        <template #default="{ row }">
          {{ formatNumber(Math.abs(row.fundingRate) * 100) }}%
        </template>
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
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
</template>
