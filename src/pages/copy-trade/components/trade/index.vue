<template>
  <div class="w-full">
    <el-table
      ref="tableRef"
      :key="tableIndex"
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
        label="钱包"
        align="left"
        width="225"
        fixed="left"
        prop="token_profit_rate"
        :min-width="110"
      >
        <template #default="{ row }"> {{ row.wallet_address }} </template>
      </el-table-column>

      <el-table-column label="任务" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> 22 </template>
      </el-table-column>
      <el-table-column label="链" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> {{ row.chain }} </template>
      </el-table-column>
      <el-table-column label="总买入" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> 22 </template>
      </el-table-column>

      <el-table-column label="总卖出" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> 22 </template>
      </el-table-column>
      <el-table-column label="买/卖" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> 22 </template>
      </el-table-column>

      <el-table-column label="已实现利润" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> 22 </template>
      </el-table-column>

      <el-table-column label="最近交易时间" align="right" prop="token_profit_rate" :min-width="110">
        <template #default="{ row }"> 22 </template>
      </el-table-column>

      <el-table-column align="right" :min-width="110" fixed="right">
        <template #header>
          <span class="mr-7px">{{ $t('operation') }}</span>
        </template>
        <template #default="{ row }">
          <div class="flex-end" @click.stop>
            <a
              class="trade"
              href=""
              @click.stop.prevent="copyTradeVisible = true"
            >
              <img src="@/assets/images/tg1.png" alt="" :width="12" />
              {{ $t('copyTrade') }}
            </a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <TradeDialog v-model="copyTradeVisible" />
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import type { KolObj } from '@/api/types/kol'
import TradeDialog from '../tradeDialog.vue'
const { copyTradeVisible } = storeToRefs(useCopyTradeStore())
const props = defineProps({
  tableData: {
    type: Array,
    default: () => {
      return []
    },
  },
  tableIndex: {
    type: Number,
    default: 0,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
const { tableData, tableIndex, loading } = toRefs(props)
const { t } = useI18n()
const router = useRouter()

const { height } = useWindowSize()
const scrollbarHeight = computed(() => {
  return useGlobalStore().tokenHistoryVisible ? 'calc(100vh - 182px)' : 'calc(100vh - 150px)'
})
function tableRowClick(row: KolObj) {
  const routeData = router.resolve({
    name: 'copy-trade-wallet',
    params: {
      userAddress: row.wallet_address,
      chain: row.chain,
    },
  })
  console.log('-----routeData----',routeData,row.wallet_address,row.chain)
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
  min-height: calc(100vh - 200px);
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
