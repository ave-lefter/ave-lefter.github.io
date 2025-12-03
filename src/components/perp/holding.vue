<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { getAccountDeleverageLight } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'
import { usePerpWsPrivateStore } from '~/stores/perp/wsPrivate'
import { usePerpWsPubStore } from '~/stores/perp/wsPub'
import StopProfitLoss from './stopProfitLoss.vue'
import StopTable from './stopTable.vue'
import ClosePosition from './closePosition.vue'
import { WSPerpEventType } from '~/utils/constants'

const props = defineProps<{
  searchParams?: any
}>()
let timer: { id: number | null } = { id: null }
const { t } = useI18n()
const perpStore = usePerpStore()
const wsPrivateStore = usePerpWsPrivateStore()
const wsPublicStore = usePerpWsPubStore()
const contractLevelMap = shallowRef<{
  [key: string]: number
}>({})
const stopProfitLossVisible = ref(false)
const stopProfitLossRow = ref<any>(null)
const stopTableVisible = ref(false)
const closePositionVisible = ref(false)

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

const filterListData = computed(() => {
  const result = perpStore.position?.filter((i) => {
    if (
      (props?.searchParams?.filterContractIdList &&
        i.contractId === props?.searchParams?.filterContractIdList) ||
      !props.searchParams?.filterContractIdList
    ) {
      return i
    }
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
        const profitWithFee =
          el.openValue > 0
            ? new BigNumber(updateData.oraclePrice)
                .multipliedBy(new BigNumber(el.openSize).abs())
                .minus(new BigNumber(el.openValue).abs())
            : new BigNumber(el.openValue)
                .abs()
                .minus(
                  new BigNumber(updateData.oraclePrice).multipliedBy(
                    new BigNumber(el.openSize).abs()
                  )
                )
        el.unrealizedPnl = profitWithFee
          .minus(new BigNumber(el.openFee).abs())
          .minus(new BigNumber(el.fundingFee).abs())
          .toString()
        el.unrealizedPnlRate = new BigNumber(el.unrealizedPnl)
          .div(new BigNumber(el.openValue).abs())
          .multipliedBy(1000)
          .toString()
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
  const isLong = row.openValue > 0
  perpStore.order = perpStore.order.map((el) => {
    // 止盈
    const isProfit = el.type.includes('PROFIT')
    let triggerSign = ''
    if (isLong) {
      triggerSign = isProfit ? '≥' : '≤'
    } else {
      triggerSign = isProfit ? '≤' : '≥'
    }
    return {
      ...el,
      // 做多
      triggerSign,
    }
  })
}
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
  <div class="relative min-h-400px bg-[--secondary-bg]">
    <el-table
      fit
      :data="filterListData"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--main-text] text-12px"
    >
      <template #empty>
        <AveEmpty v-if="perpStore.position?.length === 0" class="pt-[40px]" />
        <span v-else />
      </template>
      <el-table-column :label="t('perp')" prop="perp">
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
      <el-table-column :width="100" align="right" :label="t('amount')" prop="openSize">
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
                decimals: getPricePrecision(row.contractId)
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
              decimals: getPricePrecision(row.contractId)
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
            })
          }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('estimatedLiquidationPrice')" prop="liquidatePrice">
        <template #default="{ row }">
          {{
            formatNumber(CoreCalculator.getCreateOrderLiquidatePrice({
              contractId: row.contractId,
              orderPrice: new BigNumber(row.openValue).div(row.openSize).toString(),
              orderSize: row.openSize,
              orderSide: row.openSize > 0 ? 'BUY' : 'SELL',
            }).toFixed() || row.liquidatePrice, {
              limit: 20,
              decimals: getPricePrecision(row.contractId),
            })
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
      <el-table-column :width="150" align="right" :label="t('takeProfitStopLoss')" prop="takeProfitStopLoss">
        <template #default="{ row }">
          <el-button
            v-if="perpStore.order.length > 0"
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
      <el-table-column :width="150" align="right" :label="t('closePosition')" prop="closePosition">
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
    v-model:orderList="perpStore.order"
    v-model:visible="stopTableVisible"
    @add="addStop"
  />
  <ClosePosition
    v-model:visible="closePositionVisible"
    :token="typeDict[stopProfitLossRow?.contractId] || ''"
    :row="stopProfitLossRow || {}"
  />
</template>
