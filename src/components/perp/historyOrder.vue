<script setup lang="ts">
import dayjs from 'dayjs'
import { getHistoryOrderFillTransactionPage, getHistoryOrderPage } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const walletStore = useWalletStore()
const perpStore = usePerpStore()
const route = useRoute()
const { t } = useI18n()
const props = defineProps<{
  searchParams: any
}>()
const listData = shallowRef([])
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const offsetData = ref('')
const detailVisible = ref(false)
const detailData = ref({
  title: '',
  list: [],
})
const triggerPriceTypeMap = {
  LAST_PRICE: t('latestPrice'),
  TAKE_PROFIT_LIMIT: t('takeProfitLimit'),
}
const statusMap = {
  CANCELED: t('cancelled1'),
  FILLED: t('completed'),
}
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

const getList = async () => {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  const params = {
    filterStatusList: 'FILLED,CANCELED',
    ...props.searchParams,
  }
  if (offsetData.value) {
    params.offsetData = offsetData.value
  }
  try {
    listStatus.value.loading = true
    const res = await getHistoryOrderPage(params)
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

const showDetail = async (row: any) => {
  detailVisible.value = true
  detailData.value.title =
    typeDict.value[row.contractId] + '-' + (row.side === 'BUY' ? t('buy') : t('sell'))
  const res = await getHistoryOrderFillTransactionPage({
    size: 10,
    filterOrderIdList: row.id,
  })
  detailData.value.list = res.dataList
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
      <el-table-column :label="t('tradeVolume')" prop="contractSize">
        <template #default="{ row }">
          {{ formatNumber(row.cumMatchSize, 3) }}/{{ formatNumber(row.l2Size, 3) }}
        </template>
      </el-table-column>
      <el-table-column :minWidth="100" align="right" :label="t('price')" prop="fillPrice">
        <template #default="{ row }">
          {{
            row.type?.includes?.('MARKET')
              ? t('market')
              : formatNumber(row.price, {
                  limit: 20,
                  decimals: 10,
                })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('triggerPrice')" prop="triggerPrice">
        <template #default="{ row }">
          <template v-if="!row.type?.includes?.('STOP') && !row.type?.includes?.('TAKE_PROFIT')">
            --
          </template>
          <template v-else>
            <template v-if="row.side === 'BUY'">
              {{ row.type?.includes?.('TAKE_PROFIT') ? '≤' : '≥' }}
            </template>
            <template v-else>
              {{ row.type?.includes?.('TAKE_PROFIT') ? '≥' : '≤' }}
            </template>
            {{ formatNumber(row.triggerPrice, 10) }}
            {{ triggerPriceTypeMap[row.triggerPriceType as keyof typeof triggerPriceTypeMap] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column :min-width="80" align="right" :label="t('tradeType')" prop="side">
        <template #default="{ row }">
          <span :class="row.side === 'BUY' ? 'color-[--up-color]' : 'color-[--down-color]'">{{
            row.side === 'BUY' ? t('buy') : t('sell')
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :min-width="80" align="right" :label="t('orderType')" prop="orderType">
        <template #default="{ row }">
          <!-- <template v-if="row.type==='TAKE_PROFIT_LIMIT'">
           {{ t('takeProfitLimit') }}
          </template> -->
          <template v-if="row.type.includes('TAKE_PROFIT')">
            {{ t('takeProfit') }}
             </template>
             <template v-else-if="row.type.includes('STOP')">
            {{ t('stopLoss') }}
             </template>
             <template v-else>
              {{ row.type?.includes?.('MARKET') ? t('market') : ''
          }}{{ row.type?.includes?.('LIMIT') ? t('limit') : '' }}
             </template>
        </template>
      </el-table-column>
      <el-table-column :min-width="80" align="right" :label="t('filledType')" prop="tradeType2">
        <template #default="{ row }">
          {{ t('trades') }}
        </template>
      </el-table-column>
      <el-table-column :min-width="80" align="right" :label="t('status')" prop="status">
        <template #default="{ row }">
          {{ statusMap[row.status as keyof typeof statusMap] }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderId')" prop="orderId">
        <template #default="{ row }">
          <div class="flex items-center justify-end gap-4px">
            {{ row.id }}<Icon v-copy="row.id" name="bxs:copy" class="color-[#5A5E64]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('orderTime')" prop="createdTime">
        <template #default="{ row }">
          {{ dayjs(Number(row.createdTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :min-width="80" align="right" :label="t('onlyReduce')" prop="reduceOnly">
        <template #default="{ row }">
          {{ row.reduceOnly ? t('yes') : t('no') }}
        </template>
      </el-table-column>
      <el-table-column v-if="route.name !=='perp-id'" align="right" :label="t('executionStrategy')" prop="reduceOnly">
        <template #default="{ row }">
          <div class="flex items-center justify-end gap-4px">
            {{ row.type?.includes?.('MARKET') ? t('immediateOrCancel') : t('validityPeriod2') }}
            <el-popover :width="200">
              <template #reference>
                <Icon name="custom:info" />
              </template>
              <span class="text-12px">
                {{
                  row.type?.includes?.('MARKET') ? t('immediateOrCancel2') : t('validityPeriod3')
                }}
              </span>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column :min-width="80" align="right" :label="t('operation')">
        <template #default="{ row }">
          <el-button
            style="--el-button-active-border-color: transparent"
            size="small"
            @click="showDetail(row)"
            >{{ t('detail') }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-[2px] mb-[5px] py-[10px] text-[12px] text-center color-[--third-text]">
      <span v-if="listStatus.loading && offsetData">{{ t('loading') }}</span>
    </div>
  </div>
  <el-dialog v-model="detailVisible" :title="detailData.title" width="700" append-to-body>
    <el-table
      fit
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--main-text] text-12px"
      :data="detailData.list"
    >
      <el-table-column :label="t('filledQty')">
        <template #default="{ row }">
          {{
            formatNumber(row.fillSize, {
              limit: 20,
              decimals: 10,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column :label="t('filledPrice')">
        <template #default="{ row }">
          {{
            formatNumber(row.fillPrice, {
              limit: 20,
              decimals: 10,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column :label="t('role')">
        <template #default="{ row }">
          {{ row.isMaker ? t('maker') : t('taker') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('fee')">
        <template #default="{ row }">
          {{
            formatNumber(row.fillFee, {
              limit: 20,
            })
          }}
        </template>
      </el-table-column>
      <el-table-column :label="t('tradeNo')" min-width="150" >
        <template #default="{ row }">
          <div class="flex items-center justify-start gap-4px">
            {{ row.orderId.slice(0, 4) }}...{{ row.orderId.slice(-4) }}
            <Icon v-copy="row.orderId" name="bxs:copy" class="color-[#5A5E64]" />
          </div>
        </template>
      </el-table-column>
      <el-table-column :width="150" :label="t('tradeTime')">
        <template #default="{ row }">
          {{ dayjs(Number(row.createdTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
