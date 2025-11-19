<script setup lang="ts">
import { usePerpStore } from '~/stores/perp'
import { usePerpWsPrivateStore } from '~/stores/perp/wsPrivate'
import { usePerpWsPubStore } from '~/stores/perp/wsPub'

const { t } = useI18n()
const perpStore = usePerpStore()
const wsPrivateStore = usePerpWsPrivateStore()
const wsPublicStore = usePerpWsPubStore()
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

watch(
  () => wsPrivateStore.wsResult,
  (val) => {
    listData.value = val['trade-event']?.content?.data?.position || []
  },
  { immediate: true }
)
watch(
  () => wsPublicStore.wsResult[WSPerpEventType.TICKER_ALL_1S],
  (val) => {
    listData.value.forEach((el) => {
      console.log('el', el)
      const updateData = val.data?.find?.((item) => item.contractId === el.contractId)
      if (updateData) {
        el.oraclePrice = updateData.oraclePrice
        el.unrealizedPnl =
          updateData.oraclePrice * el.openSize -
          el.openValue -
          Math.abs(+el.openFee) -
          Math.abs(+el.fundingFee)
        el.unrealizedPnlRate = (el.unrealizedPnl / el.openValue) * 1000
      }
    })
  }
)
watch(
  () => perpStore.totalAssets?.accountList,
  (val) => {
    const positionAssetList = val?.[0]?.positionAssetList || []
    listData.value.forEach((el) => {
      const positionAsset = positionAssetList.find((item) => item.contractId === el.contractId)
      if (positionAsset) {
        el.maxLeverage = positionAsset.maxLeverage
        el.liquidatePrice = positionAsset.liquidatePrice
      }
    })
  },
  { immediate: true }
)

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
})
</script>

<template>
  <el-table
    fit
    :data="listData"
    header-row-class-name="text-12px sticky top-0 z-10 font-500"
    cell-class-name="color-[--main-text] text-12px"
  >
    <el-table-column :label="t('perp')" prop="perp">
      <template #default="{ row }">
        <div class="flex items-center text-14px lh-18px color-[--main-text] gap-4px mb-4px">
          {{ typeDict[row.contractId] }}
          <div class="flex items-center gap-2px">
            <span v-for="i in 5" :key="i" class="w-2px bg-[--up-color] h-10px" />
          </div>
        </div>
        <div class="text-10px lh-14px" :class="getColorClass(row.openValue)">
          {{ row.openValue > 0 ? t('long') : t('short') }} {{ row.maxLeverage }}x
        </div>
      </template>
    </el-table-column>
    <el-table-column :width="100" align="right" :label="t('amount')" prop="openSize">
      <template #default="{ row }">
        {{ formatNumber(Math.abs(row.openSize)) }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('contractValue')" prop="openValue">
      <template #default="{ row }">
        {{
          formatNumber(row.oraclePrice ? row.openSize * row.oraclePrice : row.openValue, {
            limit: 20,
            decimals: 2,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('entryPrice')" prop="entryPrice">
      <template #default="{ row }">
        {{
          formatNumber(row.openValue / row.openSize, {
            limit: 20,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('oraclePrice')" prop="oraclePrice">
      <template #default="{ row }">
        {{
          formatNumber(row.oraclePrice, {
            limit: 20,
            decimals: 1,
          })
        }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('estimatedLiquidationPrice')" prop="liquidatePrice">
      <template #default="{ row }">
        {{
          formatNumber(row.liquidatePrice, {
            limit: 20,
            decimals: 1,
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
        {{ formatNumber(row.fundingFee, 2) }}
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('takeProfitStopLoss')" prop="takeProfitStopLoss">
      <template #default="{ row }">
        <template v-if="row.openTp || row.openSl">
          <span class="color-[--up-color]">{{
            formatNumber(row.openTp.triggerPrice, {
              limit: 20,
              decimals: 1,
            })
          }}</span
          ><span class="color-[--icon-color] mx-4px">/</span
          ><span class="color-[--down-color]">
            {{
              formatNumber(row.openSl.triggerPrice, {
                limit: 20,
                decimals: 1,
              })
            }}
          </span>
        </template>
        <el-button size="small" v-else> + {{ $t('add') }} </el-button>
      </template>
    </el-table-column>
    <el-table-column align="right" :label="t('closePosition')" prop="closePosition">
      <template #default="{ row }">
        <el-button size="small">
          {{ $t('limit') }}
        </el-button>
        <el-button size="small">
          {{ $t('market') }}
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
