<template>
  <div class="w-full">
    <div class="pb-16px pt-4px px-16px flex-start gap-48px">
      <div>
        <span class="text-12px color-[--secondary-text]">{{ $t('totalPnL') }}</span>
        <span class="ml-16px text-18px" :class="Number(copyOrder?.totalProfitRatioAll)>0 ? 'color-[--up-color]':'color-[--down-color]' ">${{ formatNumber(copyOrder?.totalProfitAll || 0, 2) }}({{ formatNumber(copyOrder?.totalProfitRatioAll || 0, 2)  }}%)
        </span>
      </div>
      <div>
        <span class="text-12px color-[--secondary-text]">{{ $t('realizedProfit') }}</span>
        <span class="ml-16px text-18px" :class="Number(copyOrder?.profitRealizedRatioAll)>0 ? 'color-[--up-color]':'color-[--down-color]' ">${{ formatNumber(copyOrder?.profitRealizedAll || 0, 2) }}({{ formatNumber(copyOrder?.profitRealizedRatioAll || 0, 2)  }}%)
        </span>
      </div>
      <div>
        <span class="text-12px color-[--secondary-text]">{{ $t('unrealizedProfit') }}</span>
        <span class="ml-16px text-18px" :class="Number(copyOrder?.profitUnrealizedRatioAll)>0 ? 'color-[--up-color]':'color-[--down-color]' ">${{ formatNumber(copyOrder?.profitUnrealizedAll || 0, 2) }}({{ formatNumber(copyOrder?.profitUnrealizedRatioAll || 0, 2)  }}%)
        </span>
      </div>
    </div>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :header-cell-style="{ fontSize: '12px' }"
      fit
      :style="{ height: `${scrollbarHeight}` }"
      @row-click="tableRowClick"
    >
      <template #empty>
        <div v-if="!loading && tableData?.length == 0" class="table-empty">
          <AveEmpty />
        </div>
        <span v-else />
      </template>
      <el-table-column
        :label="$t('wallet')"
        align="left"
        width="225"
        fixed="left"
        prop="token_profit_rate"
        :min-width="80"
      >
        <template #default="{ row }">
          <Icon name="custom:wallet-fill" class="text-14px color-[--main-text]" />
          <span class="ml-4px color-[--main-text]">{{ 'Wallet' + row?.creatorAddress?.slice(-4) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('task')" align="right" prop="token_profit_rate" :min-width="200">
        <template #default="{ row }">
          <div class="flex-end">
          <UserAvatar class="mr-10px" iconSize="24px" iconChainSize="14px" :wallet_logo="{url: row?.followAddress, logo: row?.followIconUrl}" :address="row.followAddress" />
            <UserRemark addressClass="token-symbol ellipsis color-[--main-text]" addressStyle="max-width: 70px" showAddressTitle :address="row.followAddress" :chain="row.chain" :remark="row.remark || row.followName" :wallet_logo="{url: row?.followAddress, logo: row?.followIconUrl}" :formatAddress="a=> '*' + a?.slice(-5)" @updateRemark="({remark}) => row.remark = remark"/>
            <Icon
              v-copy="row.followAddress"
              name="bxs:copy"
              class="text-12px cursor-pointer color-[--third-text] ml-5px"
              @click.stop.prevent
            />
            <span v-if="row.status =='watching'" class="bg-[#12B8861A] color-[--up-color] px-4px rounded-2px ml-5px text-10px">{{ $t('status-watching') }}</span>
            <span v-else-if="row.status =='pause'" class="bg-[#FFA6221A] color-[--yellow] px-4px rounded-2px ml-5px text-10px">{{ $t('status-paused') }}</span>
            <span v-else-if="row.status =='cancelled'" class="bg-[#6666661a] color-[--third-text] px-4px rounded-2px ml-5px text-10px">{{ $t('cancelled1') }}</span>
            <span v-else class="bg-[#e500001a] color-[--down-color] px-4px rounded-2px ml-5px text-10px">{{ $t('status-error') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('chain')" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> {{ getChainInfo(row?.chain)?.name }} </template>
      </el-table-column>
      <el-table-column :label="$t('unrealizedProfit')" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }">
          <span :class="Number(row?.profitUnrealized)>0 ? 'color-[--up-color]':'color-[--down-color]' ">
            ${{ formatNumber(row?.profitUnrealized || 0, 2) }}
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('realizedProfit')" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }">
          <span :class="Number(row?.profitRealized)>0 ? 'color-[--up-color]':'color-[--down-color]' ">
            ${{ formatNumber(row?.profitRealized || 0, 2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('winTokenTotal')" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }">
          <div class="">
            <span class="color-[--up-color]">{{ formatNumber(row?.winToken || 0, 2) }}</span>
            /
            <span class="color-[--secondary-text]">{{ formatNumber(row?.totalTokenCount || 0, 2) }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column :label="$t('positionsValue')" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }">${{ formatNumber(row?.holdingUsd || 0, 2) }}</template>
      </el-table-column>

      <el-table-column :label="$t('lastSwapTime')" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }">
          {{ row?.lastSwap >0? formatDate(row?.lastSwap, 'YYYY-MM-DD HH:mm') : '--' }}
        </template>
      </el-table-column>

      <el-table-column align="right" :min-width="250" fixed="right">
        <template #header>
          <span class="mr-7px">{{ $t('operation') }}</span>
        </template>
        <template #default="{ row }">
          <div class="flex-end" @click.stop>
            <Operate  :id="row.id" :chain="row.chain" :status="row.status" @updataRow= "(status)=>{ row.status= status}"/>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { type CopyObj } from '@/api/copyTrade'
import TradeDialog from '../tradeDialog.vue'
import Operate from '../operate.vue'
const { copyTradeVisible, copyObj, copyOrderLoading, copyOrder  } = storeToRefs(useCopyTradeStore())

const { t } = useI18n()
const router = useRouter()
const { height } = useWindowSize()
const tableData = computed(() => {
  return copyOrder.value?.copyList  || []
})
const loading = computed(() => {
  return copyOrderLoading.value
})
const scrollbarHeight = computed(() => {
  return useGlobalStore().tokenHistoryVisible ? 'calc(100vh - 182px - 80px)' : 'calc(100vh - 150px -80px)'
})
function tableRowClick(row: CopyObj) {
  copyObj.value = row
  const routeData = router.resolve({
    name: 'copy-trade-wallet',
    params: {
      userAddress: row.followAddress,
      chain: row.chain,
    },
    query: {
      followAddress: row.followAddress,
      creatorAddress: row.creatorAddress,
      id: row.id
    }
  })
  window.open(routeData.href, '_blank')
}
</script>

<style lang="scss" scoped>
:deep(.el-table-fixed-column--left) {
  .cell {
    display: flex;
    align-items: center;
  }
}
::v-deep(.el-table) {
  .el-table__body {
    tr:hover {
      .hover-dot {
        border-bottom: 1px dotted var(--secondary-text);
      }
    }
    .cell {
      padding-right: 19px;
      color: var(--secondary-text);
    }
  }
}
.table-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: calc(100vh - 300px);
}
.ellipsis {
  max-width: 100%;
}

a.trade {
  background: #3f80f71a;
  padding: 1px 7px;
  border-radius: 2px;
  font-size: 12px;
  color: var(--main-text);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    margin-right: 4px;
  }
}
</style>
