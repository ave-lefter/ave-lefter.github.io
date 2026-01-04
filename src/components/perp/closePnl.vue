<script setup lang="ts">
import dayjs from 'dayjs'
import { getPositionTransactionPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const walletStore = useWalletStore()
const { t } = useI18n()
const props = defineProps<{
  searchParams: any
}>()
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

const getPnl = (row: any) => {
  return formatNumber(row.realizePnl - row.deltaOpenFee)
  // if (row.beforeOpenValue > 0) {
  //   return formatNumber(
  //     Math.abs(row.fillCloseValue) -
  //       Math.abs(row.beforeOpenValue) -
  //       Math.abs(row.fillCloseFee) -
  //       Math.abs(row.beforeOpenFee)
  //   )
  // }
  // return formatNumber(
  //   Math.abs(row.beforeOpenValue) -
  //     Math.abs(row.fillCloseValue) -
  //     Math.abs(row.fillCloseFee) -
  //     Math.abs(row.beforeOpenFee)
  // )
}

const getList = async () => {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  const params = {
    filterCloseOnly: true,
    ...props.searchParams,
  }
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

if (walletStore.address) {
  getList()
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
      <el-table-column :min-width="80" align="right" :label="t('tradeType')" prop="side">
        <template #default="{ row }">
          <span :class="row.type.includes('BUY') ? 'color-[--up-color]' : 'color-[--down-color]'">{{
            row.type.includes('BUY') ? t('buy') : t('sell')
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
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
</template>
