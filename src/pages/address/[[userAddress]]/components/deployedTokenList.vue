<template>
  <div class="mt-16px">
    <el-table
      ref="table_ref"
      :data="tableData"
      :default-sort="{
        prop: conditions.sort,
        order: conditions.sort_dir ? conditions.sort_dir + 'ending' : null,
      }"
      fit
      style="width: 100%"
      header-row-class-name="text-12px"
      row-class-name="cursor-pointer color-[--secondary-text]"
      @row-click="onRowClick"
      @sort-change="handleSortChange"
    >
      <template #empty>
        <AveEmpty v-if="!loading" class="table-empty" />
      </template>
      <TokenColumn
        :column-props="{
          label: $t('walletToken'),
          width: '250',
          fixed: 'left',
        }"
      />
      <el-table-column
        :width="200"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        :label="$t('time')"
        prop="created_at"
      >
        <template #default="{ row }">
          <span v-tooltip="dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')">{{
            formatTimeFromNow(dayjs(row.created_at).unix())
          }}</span>
        </template>
      </el-table-column>
      <el-table-column :width="80" align="right" :label="$t('migrated1')">
        <template #default="{ row }">
          <img v-if="row.migrated" src="@/assets/images/select-box-circle-line.svg" alt="" >
          <img v-else src="@/assets/images/close-circle-line.svg" alt="" >
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        :label="$t('walletMarketCap')"
        prop="market_cap"
      >
        <template #default="{ row }"> ${{ formatNumber(row.market_cap, 2) }}</template>
      </el-table-column>
      <el-table-column
        align="right"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        :label="$t('allTimeHigh')"
        prop="all_time_high"
      >
        <template #default="{ row }"> ${{ formatNumber(row.all_time_high, 2) }}</template>
      </el-table-column>
      <el-table-column align="right" :label="$t('holders')">
        <template #default="{ row }">
          {{ formatNumber(row.holders || 0, 2) }}
        </template>
      </el-table-column>
      <el-table-column align="right" :label="$t('volumeOneHour')">
        <template #default="{ row }">
          {{ formatNumber(row.volume_u_1h || 0, 2) }}
        </template>
      </el-table-column>
      <!-- <TotalProfitColumn :label="$t('profit3')" />
      <el-table-column :label="$t('Bonding Curve Progress')">
        <template #default="{ row }">
          <template v-if="!row.progress || row.progress === '--'"> -- </template>
          <el-progress
            v-else
            :percentage="Number(row.progress)"
            :text-inside="true"
            :stroke-width="14"
            color="#FFA622"
          />
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script setup lang="ts">
import AveEmpty from '@/components/aveEmpty.vue'
import TokenColumn from '@/components/tokenColumn.vue'

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  loading: Boolean,
  handleSortChange: {
    type: Function,
    default: () => {},
  },
  conditions: {
    type: Object,
    default: () => ({}),
  },
})

const tokenDetailSStore = useTokenDetailsStore()
const route = useRoute()

function onRowClick(row) {
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: row.token + '-' + row.chain,
      symbol: row.symbol,
      logo_url: row.logo_url,
      chain: row.chain,
      address: row.token,
      remark: '',
    },
    pairInfo: {
      target_token: row.token,
      token0_address: row.token,
      token0_symbol: row.symbol,
      token1_symbol: '',
      pairAddress: '',
    },
    user_address: route.params.userAddress as string,
  })
}
</script>

<style scoped lang="scss">
:deep(.el-progress-bar__outer) {
  background-color: var(--el-border-color-lighter);
}
.table-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 0;
  min-height: calc(100vh - 750px);
}
</style>
