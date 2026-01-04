<script setup lang="ts">
import dayjs from 'dayjs'
import { cancelOrderById } from '~/api/perp'
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()
const themeStore = useThemeStore()
const orderList = defineModel<any[]>('orderList')
const emit = defineEmits(['add'])
const visible = defineModel<boolean>('visible')
const { t } = useI18n()
const triggerPriceTypeMap = {
  LAST_PRICE: t('latestPrice'),
  TAKE_PROFIT_LIMIT: t('takeProfitLimit'),
  LIMIT: t('limit'),
  MARKET: t('market'),
  STOP_LIMIT: t('stop_limit'),
  STOP_MARKET: t('stop_market'),
  TAKE_PROFIT_MARKET: t('takeProfitMarket'),
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

const cancelOrder = async (id?: string) => {
  ElMessageBox.confirm(t('botCancelOrder'), t('cancelOrder'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  }).then(async () => {
    const ids = id ? [id] : orderList?.value?.map?.((item) => item.id) || []
    await cancelOrderById(ids)
    ElMessage.success(t('cancelledOrderSuccessfully'))
    orderList.value = orderList.value?.filter?.((item) => !ids.includes(item.id)) || []
  })
}
</script>

<template>
  <el-dialog v-model="visible" append-to-body :title="t('stopLimit')" width="800px">
    <el-table
      :data="orderList?.toSorted((a,b)=> (b?.createdTime || 0) - (a?.createdTime || 0))"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--main-text] text-12px"
      fit
    >
      <el-table-column width="50" :label="t('No')" type="index"/>
      <el-table-column align="right" :label="t('orderType')" prop="orderType">
        <template #default="{ row }">
          <span v-if="row.type.includes('STOP')" class="color-[--down-color]">
            {{ $t('stopLoss') }}
          </span>
          <span v-else-if="row.type.includes('PROFIT')" class="color-[--up-color]">
            {{ $t('takeProfit') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column  align="right" :label="t('orderSize')" prop="size">
        <template #default="{ row }">
          {{ formatNumber(row.size, 10) }} {{ typeDict[row.contractId].replace('USD', '') }}
        </template>
      </el-table-column>
      <el-table-column min-width="150" align="right" :label="t('triggerPrice')" prop="triggerPrice">
        <template #default="{ row }">
          {{ row.triggerSign
          }}{{
            formatNumber(row.triggerPrice, {
              limit: 20,
              decimals: 10,
            })
          }}
          {{ triggerPriceTypeMap[row.triggerPriceType as keyof typeof triggerPriceTypeMap] }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="t('price')" prop="price">
        <template #default="{ row }">
          {{
            row.type.includes('LIMIT')
              ? formatNumber(row.price, {
                  decimals: 10,
                  limit: 20,
                })
              : t('market')
          }}
        </template>
      </el-table-column>
      <el-table-column min-width="150"  align="right" :label="t('orderTime')" prop="createdTime">
        <template #default="{ row }">
          {{ dayjs(Number(row.createdTime)).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column :width="100" align="right" :label="t('action')" prop="operate">
        <template #default="{ row }">
          <Icon
            name="custom:delete"
            class="w-14px h-14px color-[--third-text] cursor-pointer"
            @click="cancelOrder(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-20px flex justify-end">
      <el-button
        class="m-l-auto [&&]:w-88px"
        :color="themeStore.isDark ? '#333' : '#F2F2F2'"
        @click="emit('add')"
      >
        {{ $t('add') }}
      </el-button>
      <el-button type="primary" class="m-l-auto [&&]:w-88px" @click="cancelOrder()">
        {{ $t('cancelAll') }}
      </el-button>
    </div>
  </el-dialog>
</template>
