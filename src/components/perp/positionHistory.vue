<script setup lang="ts">
import dayjs from 'dayjs'
import { getPositionTermPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'
import BigNumber from 'bignumber.js'
import Share from "./share.vue";
// import { PositionFactory, SymbolEntity } from '~/utils/perp/domain'
// import type { IContract } from '~/utils/perp/types'

const walletStore = useWalletStore()
const props = defineProps<{
  searchParams: any
}>()
const { t } = useI18n()
const perpStore = usePerpStore()
const listData = shallowRef([])
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const offsetData = ref('')

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

// const positionTermsList = computed(() => {
//   const symbolsList =
//     (perpStore.metadata?.contractList || [])?.map((c) => SymbolEntity.fromRaw(c as IContract)) || []
//   const positionList = PositionFactory.createPositionsFromRaw(perpStore.position || [], symbolsList)
//   return PositionFactory.createPositionTermsFromRaw(listData.value, positionList, symbolsList)
// })
const isPartialClose = (row: any) => {
  return Math.abs(row.cumOpenSize) !== Math.abs(row.cumCloseSize)
}
const getPnl = (row: any) => {
  const openValue =
    perpStore.position.find((el) => el.contractId === row.contractId)?.openValue || 0
  const base = new BigNumber(0).minus(row.cumOpenValue).minus(row.cumCloseValue)
  if (isPartialClose(row)) {
    return base.plus(openValue)
  }
  return base
}

const getPnlRatio = (row: any) => {
  const pnl = getPnl(row)
  if (!row.currentLeverage) return new BigNumber(0)
  {
    const openValue =
      perpStore.position.find((el) => el.contractId === row.contractId)?.openValue || 0
    const closedOpenValue = isPartialClose(row)
      ? new BigNumber(row.cumOpenValue).abs().minus(new BigNumber(openValue).abs())
      : new BigNumber(row.cumOpenValue).abs()
    if (closedOpenValue.isZero()) return new BigNumber(0)
    return pnl.dividedBy(closedOpenValue).multipliedBy(100).multipliedBy(row.currentLeverage)
  }
}

const getList = async () => {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  const params = {
    ...props.searchParams,
  }
  if (offsetData.value) {
    params.offsetData = offsetData.value
  }
  try {
    listStatus.value.loading = true
    const res = await getPositionTermPage(params)
    let list = res.dataList?.filter?.((el) => Math.abs(el.cumCloseSize) > 0) || []
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

if (walletStore.address) {
  getList()
}

const getUnRealizedPnl = (row: any) => {
  const oraclePrice =
    perpStore.contractList?.find((i) => i.contractId === row.contractId)?.oraclePrice || 0
  return BigNumber(row.openSize).multipliedBy(oraclePrice).minus(row.openValue).toString()
}

const getUnRealizedPnlRatio = (row: any) => {
  const pnl = getUnRealizedPnl(row)
  return BigNumber(pnl)
    .dividedBy(BigNumber(row.openValue).abs())
    .multipliedBy(100)
    .multipliedBy(row.leverage)
    .toString()
}
watch(
  () => [props.searchParams, walletStore.address],
  () => {
    // reset
    offsetData.value = ''
    listData.value = []
    listStatus.value.finished = false
    listStatus.value.error = false
    listStatus.value.loading = false
    getList()
  }
)
</script>

<template>
  <div
    v-infinite-scroll="getList"
    class="relative min-h-400px bg-[--secondary-bg]"
    :infinite-scroll-delay="200"
    :infinite-scroll-disabled="listStatus.loading || listStatus.finished || listStatus.error"
    :infinite-scroll-immediate="false"
    :infinite-scroll-distance="300"
  >
    <el-table
      fit
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
      <el-table-column :label="t('markets1')" prop="contractId">
        <template #default="{ row }">
          <span class="text-14px">{{ typeDict[row.contractId] }}</span>
          <div class="text-10px lh-14px" :class="getColorClass(row.cumOpenSize)">
            {{ row.cumOpenSize > 0 ? t('long') : t('short') }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('Qty')" prop="contractSize">
        <template #default="{ row }">
          {{ Math.abs(+formatNumber(row.cumOpenSize) || 0) }}
          {{ typeDict[row.contractId].replace('USD', '') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('closeSize')">
        <template #default="{ row }">
          {{ Math.abs(+formatNumber(row.cumCloseSize) || 0) }}
          {{ typeDict[row.contractId].replace('USD', '') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('status')">
        <template #default="{ row }">
          {{ isPartialClose(row) ? t('partialClose') : t('closed') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('openAvgPrice')">
        <template #default="{ row }">
          {{
            formatNumber(row.cumOpenValue / row.cumOpenSize, {
              limit: 20,
              decimals: 2,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('avgPrice2')">
        <template #default="{ row }">
          {{
            formatNumber(row.cumCloseValue / row.cumCloseSize, {
              limit: 20,
              decimals: 2,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('unrealizedPnl')">
        <template #default="{ row }">
          <template v-if="isPartialClose(row)">
            <div class="lh-18px" :class="getColorClass(getUnRealizedPnl(row))">
              {{ formatNumber(getUnRealizedPnl(row), 2) }}
            </div>
            <div class="lh-18px" :class="getColorClass(getUnRealizedPnlRatio(row))">
              {{
                formatNumber(getUnRealizedPnlRatio(row), {
                  limit: 20,
                  decimals: 2,
                })
              }}%
            </div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('pnl')">
        <template #default="{ row }">
          <div class="lh-18px" :class="getColorClass(getPnl(row).toString())">
            {{ formatNumber(getPnl(row).toString()) }}
          </div>
          <div class="lh-18px flex items-center justify-end gap-4px" :class="getColorClass(getPnlRatio(row).toString())">
            {{
              formatNumber(getPnlRatio(row).toString(), {
                limit: 20,
                decimals: 2,
              })
            }}%
             <Share
                :statistics="{
                  leverage: getLeverageFromContractId(row.contractId) || row.maxLeverage,
                  openValue: row.cumOpenValue,
                  entryPrice: formatNumber(row.cumOpenValue / row.cumOpenSize, {
                    decimals: 2,
                    limit: 20,
                  }),
                  unrealizedPnl: getPnl(row).toString(),
                  unrealizedPnlRate: getPnlRatio(row).toString(),
                  name: typeDict[row.contractId]?.replace?.('USD', ''),
                  logo_url: perpStore.contractList.find((item) => item.contractId === row.contractId)?.baseCoinIcon,
                  closePrice: formatNumber(row.cumCloseValue / row.cumCloseSize, {
                    decimals: 2,
                    limit: 20,
                  }),
                }"
              />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('termCount')">
        <template #default="{ row }">
          {{
            isPartialClose(row)
              ? '--'
              : formatCountdown(
                  0,
                  false,
                  dayjs(+row.updatedTime).diff(dayjs(+row.createdTime), 's')
                )
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('openTime2')">
        <template #default="{ row }">
          {{ dayjs(+row.createdTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('lastCloseTime')">
        <template #default="{ row }">
          {{ dayjs(+row.updatedTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
</template>
