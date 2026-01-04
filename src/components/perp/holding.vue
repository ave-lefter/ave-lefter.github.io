<script setup>
import BigNumber from 'bignumber.js'
import { getAccountDeleverageLight } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'
import { usePerpWsPubStore } from '~/stores/perp/wsPub'
import StopProfitLoss from './stopProfitLoss.vue'
import StopTable from './stopTable.vue'
import ClosePosition from './closePosition.vue'
import { WSPerpEventType } from '~/utils/constants'
import { getLeverageFromContractId } from '~/utils/perp'

const props = defineProps({
  searchParams: {
    type: Object,
    default: () => ({}),
  },
})
let timer = { id: null }
const { t } = useI18n()
const perpStore = usePerpStore()
const wsPublicStore = usePerpWsPubStore()
const contractLevelMap = shallowRef({})
const stopProfitLossVisible = ref(false)
const stopProfitLossRow = ref(null)
const stopTableVisible = ref(false)
const closePositionVisible = ref(false)

const typeDict = computed(() => {
  const contractMap =
    perpStore.metadata?.contractList?.reduce?.((prev, cur) => {
      prev[cur.contractId] = cur.contractName
      return prev
    }, {}) || {}
  contractMap.ALL = t('all')
  return contractMap
})

const filterListData = computed(() => {
  const result = perpStore.position?.filter((i) => {
    return (props?.searchParams?.filterContractIdList && i.contractId === props?.searchParams?.filterContractIdList) || !props.searchParams?.filterContractIdList
  })
  return result || []
})

watch(
  () => wsPublicStore.wsResult[WSPerpEventType.TICKER_ALL_1S],
  (val) => {
    perpStore.position.forEach((el) => {
      const updateData = val.data?.find?.((item) => item.contractId === el.contractId)
      if (updateData) {
        el.oraclePrice = updateData.oraclePrice
        // const profitWithFee = BigNumber(0)
        //   .minus(el.openValue)
        //   .plus(BigNumber(el.openSize).multipliedBy(el.oraclePrice))
        // el.unrealizedPnl = profitWithFee.toString()
        const price = updateData?.lastPrice || updateData?.oraclePrice || '0'
        const profit = Number(el?.openSize) >= 0
          ? new BigNumber(price).times(new BigNumber(el?.openSize || 0).abs()).minus(new BigNumber(el.openValue).abs())
          : new BigNumber(el.openValue || 0).abs().minus(new BigNumber(price).times(new BigNumber(el.openSize).abs()))
        el.unrealizedPnl = profit.dp(2, BigNumber.ROUND_FLOOR).toString()
        // el.unrealizedPnlRate = new BigNumber(el.unrealizedPnl)
        //   .div(new BigNumber(el.openValue).abs())
        //   .multipliedBy(1000)
        //   .toString()
        el.unrealizedPnlRate = getPositionUnrealizedPnl(el.contractId)?.unrealizedPnlRoe
      }
    })
  }
)
watch(
  () => perpStore.totalAssets?.accountList,
  (val) => {
    if (val) {
      const positionAssetList = val?.[0]?.positionAssetList || []
      perpStore.position.forEach((el) => {
        const positionAsset = positionAssetList.find((item) => item.contractId === el.contractId)
        if (positionAsset) {
          el.maxLeverage = positionAsset.maxLeverage
          el.liquidatePrice = positionAsset.liquidatePrice
        }
      })
    }
  },
  { immediate: true }
)

const getContractLevelMap = async () => {
  const res = await getAccountDeleverageLight()
  contractLevelMap.value = res?.positionContractIdToLightNumberMap || {}
}

// getContractLevelMap()

const showStopProfitLoss = (row) => {
  stopProfitLossRow.value = row
  stopProfitLossVisible.value = true
}
const stopTable = (row) => {
  stopProfitLossRow.value = row
  stopTableVisible.value = true
  // const isLong = row.openValue > 0
  // perpStore.order = perpStore.order
  //   .filter((el) => {
  //     return (
  //       el.contractId === row.contractId &&
  //       ['TAKE_PROFIT_LIMIT', 'STOP_LIMIT', 'TAKE_PROFIT_MARKET', 'STOP_MARKET'].includes(el.type)
  //     )
  //   })
  //   .map((el) => {
  //     // 止盈
  //     const isProfit = el.type.includes('PROFIT')
  //     let triggerSign = ''
  //     if (isLong) {
  //       triggerSign = isProfit ? '≥' : '≤'
  //     } else {
  //       triggerSign = isProfit ? '≤' : '≥'
  //     }
  //     return {
  //       ...el,
  //       // 做多
  //       triggerSign,
  //     }
  //   })
}

const orderList = computed(() => {
  if (!stopProfitLossRow.value?.contractId) {
    return []
  }
  return (perpStore.order?.filter?.((i) => i.contractId === stopProfitLossRow.value?.contractId && ['TAKE_PROFIT_LIMIT', 'STOP_LIMIT', 'TAKE_PROFIT_MARKET', 'STOP_MARKET'].includes(i.type)) || [])
})
const closePosition = (row, operation) => {
  closePositionVisible.value = true
  stopProfitLossRow.value = {
    ...row,
    operation,
  }
}

const addStop = () => {
  stopTableVisible.value = false
  stopProfitLossVisible.value = true
}

onMounted(() => {
  wsPublicStore.send({
    type: 'unsubscribe',
    channel: 'ticker.all.1s',
  })
  setTimeout(() => {
    wsPublicStore.send({
      type: 'subscribe',
      channel: 'ticker.all.1s',
    })
  }, 500)
  getContractLevelMap()
  timer = requestTimeout(5000, () => {
    getContractLevelMap()
  })
})

onUnmounted(() => {
  if (timer.id) {
    cancelAnimationFrame(timer.id)
  }
})
</script>

<template>
  <div class="relative">
    <el-table
      fit
      :data="filterListData"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--main-text] text-12px"
    >
      <template #empty>
        <AveEmpty v-if="perpStore.position?.length === 0" class="pt-[40px]">
          <span class="text-12px">{{ $t('emptyNoData') }}</span>
        </AveEmpty>
        <span v-else />
      </template>
      <el-table-column :label="t('markets1')" prop="perp">
        <template #default="{ row }">
          <div class="flex items-center text-14px lh-18px color-[--main-text] gap-4px mb-4px">
            {{ typeDict[row.contractId] }}
            <div
              v-if="typeof contractLevelMap[row.contractId] === 'number'"
              v-tooltip="t('autoDeleverageTips')"
              class="flex items-center gap-2px [&>span]:bg-[#3b3b3b] data-[active=on]:[&>span:nth-child(1)]:bg-[#08BA4E] data-[active=on]:[&>span:nth-child(2)]:bg-[#409F4B] data-[active=on]:[&>span:nth-child(3)]:bg-[#7F8147] data-[active=on]:[&>span:nth-child(4)]:bg-[#B36844] data-[active=on]:[&>span:nth-child(5)]:bg-[#F1493F]"
            >
              <span
                v-for="i in 5"
                :key="i"
                class="w-2px h-10px"
                :data-active="contractLevelMap[row.contractId] > i ? 'on' : 'off'"
              />
            </div>
          </div>
          <div class="text-10px lh-14px" :class="getColorClass(row.openValue)">
            {{ row.openValue > 0 ? t('long') : t('short') }}
            {{ getLeverageFromContractId(row.contractId) || row.maxLeverage }}x
          </div>
        </template>
      </el-table-column>
      <el-table-column :width="100" :label="t('Qty')" prop="openSize">
        <template #default="{ row }">
          {{ formatNumber(row.openSize.replace('-', '')) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('contractValue')" prop="openValue">
        <template #default="{ row }">
          {{
            formatNumber(
              row.oraclePrice
                ? new BigNumber(row.openSize)
                    .multipliedBy(row.oraclePrice)
                    .toString()
                    .replace('-', '')
                : row.openValue.replace('-', ''),
              {
                limit: 20,
                decimals: 4,
              }
            )
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('entryPrice')" prop="entryPrice">
        <template #default="{ row }">
          {{
            formatNumber(new BigNumber(row.openValue).div(row.openSize).toString(), {
              limit: 20,
              decimals: getPricePrecision(row.contractId),
              decimalsHasZero: true
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('oraclePrice')" prop="oraclePrice">
        <template #default="{ row }">
          {{
            formatNumber(row.oraclePrice, {
              limit: 20,
              decimals: getPricePrecision(row.contractId),
              decimalsHasZero: true
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('estimatedLiquidationPrice')" prop="liquidatePrice">
        <template #default="{ row }">
          {{
            formatNumber(
              getPositionLiqPrice(row.contractId) || row.liquidatePrice,
              {
                limit: 20,
                decimals: getPricePrecision(row.contractId),
                decimalsHasZero: true
              }
            )
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('unrealizedPnl')" prop="unrealizedPnl">
        <template #default="{ row }">
          <div class="text-12px lh-18px flex flex-col gap-4px">
            <span :class="getColorClass(row.unrealizedPnl)"
              >{{ addSign(row.unrealizedPnl)
              }}{{ formatNumber(Math.abs(row.unrealizedPnl), 2) }}</span
            >
            <span :class="getColorClass(row.unrealizedPnlRate)"
              >({{ addSign(row.unrealizedPnlRate)
              }}{{ formatNumber(Math.abs(row.unrealizedPnlRate), 2) }}%)</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('fundingFee')" prop="fundingFee">
        <template #default="{ row }">
          {{ formatNumber(row.fundingFee, getPricePrecision(row.contractId)) }}
        </template>
      </el-table-column>
      <el-table-column
        :width="150"
        align="right"
        :label="t('takeProfitStopLoss')"
        prop="takeProfitStopLoss"
      >
        <template #default="{ row }">
          <el-button
            v-if="perpStore.order?.some?.((el) => el?.contractId === row?.contractId)"
            size="small"
            style="--el-button-active-border-color: transparent"
            @click="stopTable(row)"
          >
            {{ $t('detail') }}
          </el-button>
          <el-button
            size="small"
            style="--el-button-active-border-color: transparent"
            @click="showStopProfitLoss(row)"
          >
            + {{ $t('add') }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :width="150" align="right" :label="t('operation')" prop="closePosition">
        <template #default="{ row }">
          <el-button
            size="small"
            style="--el-button-active-border-color: transparent"
            @click="closePosition(row, 'limit')"
          >
            {{ $t('limit') }}
          </el-button>
          <el-button
            size="small"
            style="--el-button-active-border-color: transparent"
            @click="closePosition(row, 'market')"
          >
            {{ $t('market') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <StopProfitLoss v-model:visible="stopProfitLossVisible" :row="stopProfitLossRow" />
  <StopTable
    v-model:visible="stopTableVisible"
    :orderList="orderList"
    @add="addStop"
  />
  <ClosePosition
    v-model:visible="closePositionVisible"
    :token="typeDict[stopProfitLossRow?.contractId] || ''"
    :row="stopProfitLossRow || {}"
  />
</template>
