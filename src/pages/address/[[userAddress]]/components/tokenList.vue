<template>
  <div>
    <el-table
      :key="tableIndex"
      ref="table_ref"
      :data="tableData"
      :default-sort="{
        prop: conditions.sort,
        order: conditions.sort_dir ? conditions.sort_dir + 'ending' : null,
      }"
      fit
      style="width: 100%"
      header-row-class-name="text-12px sticky top-0 z-10 font-500"
      cell-class-name="color-[--secondary-text]"
      row-class-name="cursor-pointer"
      @row-click="jumpBalance"
      @sort-change="handleSortChange"
    >
      <template #empty>
        <AveEmpty v-if="!loading && tableData.length===0" class="pt-[40px]"/>
        <span v-else/>
      </template>
      <TokenColumn
        :column-props="{
          label: $t('walletToken')+'/'+$t('recentlyTrade'),
          width: '180',
          fixed: 'left',
          sortable: 'custom',
          sortOrders: ['descending', 'ascending', null],
          prop: 'last_txn_time',
        }"
      >
        <template v-if="isSelfAddress && (walletStore.walletName!=='WatchWallet')" #default="{ row }">
          <Icon
            name="bx:bxs-hide"
            class="absolute top-0 left-0 hidden bxs-hide cursor-pointer color-[--secondary-text]"
            @click.self.stop="hideToken(row)"
          />
        </template>
      </TokenColumn>
      <el-table-column
        :label="$t('total_profit')"
        :sort-orders="['descending', 'ascending', null]"
        align="right"
        prop="total_profit"
        sortable="custom"
      >
        <template #default="{ row }">
          <span v-if="row?.total_profit > 0" class="color-[--up-color]">
            ${{ formatNumber(row?.total_profit || 0, 2) }}
          </span>
          <span v-else-if="row?.total_profit == 0">$0</span>
          <span v-else-if="row?.total_profit == '--'">--</span>
          <span v-else class="color-[--down-color]">
            {{ '-$' + formatNumber(Math.abs(row?.total_profit) || 0, 2) }}
          </span>
          <span class="block lh-17px color-[--third-text]">
            <template v-if="row?.total_profit_ratio == 0">0</template>
            <template v-else-if="row?.total_profit_ratio == '--'">--</template>
            <template v-else>
              <span :style="{ color: row?.total_profit_ratio > 0 ? 'color-[--up-color]' : 'color-[--down-color]' }">
                {{ formatNumber(row?.total_profit_ratio * 100 || 0, 2) }}%
              </span>
            </template>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('total_unrealized_profit')"
        :sort-orders="['descending', 'ascending', null]"
        align="right"
        prop="unrealized_profit"
        sortable="custom"
      >
        <template #default="{ row }">
          <div v-if="row?.unrealized_profit == 0 && row.balance_amount == 0" class="color-[--down-color] text-12px">
            {{$t('sellAl')}}
          </div>
          <div v-else>
            <span v-if="row?.unrealized_profit > 0" class="color-[--up-color]">
              ${{ formatNumber(row?.unrealized_profit || 0, 2) }}
            </span>
            <span v-else-if="row?.unrealized_profit == 0">$0</span>
            <span v-else-if="row?.unrealized_profit == '--'">--</span>
            <span v-else class="color-[--down-color]">
              {{ '-$' + formatNumber(Math.abs(row?.unrealized_profit) || 0, 2) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('balance1')"
        :sort-orders="['descending', 'ascending', null]"
        align="right"
        prop="balance_usd"
        sortable="custom"
      >
        <template #header>
          <span class="inline-flex items-center" >
            {{ $t('balance1') }}
            <Icon
              name="custom:price"
              :class="`${injecteIsVolUSDT ? 'color-[--third-text]' : 'color-[--secondary-text]'} cursor-pointer ml-3px`"
              @click.stop.prevent="injecteIsVolUSDT=!injecteIsVolUSDT"
            />
          </span>
        </template>
        <template #default="{ row }">
          <div v-if="row.balance_amount == 0 && row.total_sold > 0" class="color-[--down-color] text-12px">{{$t('sellAl')}}</div>
          <div v-else>
            <span v-if="row?.balance_usd == 0">0</span>
            <span v-else-if="row?.balance_usd == '--'">--</span>
            <span v-else class="flex justify-end">
              <template v-if="!injecteIsVolUSDT">
                {{
                  row?.main_token_price == 0
                    ? 0
                    : formatNumber(row?.balance_usd / row?.main_token_price || 0, 2)
                }}
                <span class="text-12px color-[--d-999-l-666] ml-3px">{{ row?.main_token_symbol }}</span>
              </template>
              <template v-else>
                {{ '$' + formatNumber(row?.balance_usd || 0, 2) }}
              </template>
            </span>
            <span
                class="block text-12px lh-17px color-[--third-text]"
            >
              <template v-if="row?.balance_amount == 0">0</template>
              <template v-else-if="row?.balance_amount == '--'">--</template>
              <template v-else>
                {{ formatNumber(row?.balance_amount || 0, 2) }}
              </template>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wallet_detail_total_buy_avg')" align="right">
        <template #default="{ row }">
          <span v-if="row?.total_purchase_usd == 0">0</span>
          <span v-else-if="row?.total_purchase_usd == '--'">--</span>
          <span v-else>
            {{ '$' + formatNumber(row?.total_purchase_usd || 0, 2) }}
          </span>
          <span
              class="block text-12px lh-17px color-[--third-text]"
          >
            <template v-if="row?.average_purchase_price_usd == 0">0</template>
            <template v-else-if="row?.average_purchase_price_usd == '--'">--</template>
            <template v-else>
              {{ '$' + formatNumber(row?.average_purchase_price_usd || 0, 2) }}
            </template>
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('wallet_detail_total_sell_avg')" align="right">
        <template #default="{ row }">
          <span v-if="row?.total_sold_usd == 0">0</span>
          <span v-else-if="row?.total_sold_usd == '--'">--</span>
          <span v-else>
            {{ '$' + formatNumber(row?.total_sold_usd || 0, 2) }}
          </span>
          <span
              class="block text-12px lh-17px color-[--third-text]"
          >
            <template v-if="row?.average_sold_price_usd == 0">0</template>
            <template v-else-if="row?.average_sold_price_usd == '--'">--</template>
            <template v-else>
              {{ '$' + formatNumber(row?.average_sold_price_usd || 0, 2) }}
            </template>
          </span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('wallet_detail_transfer_in_out')" align="right">
        <template #default="{ row }">
          <template v-if="row?.total_transfer_in_amount == 0">0</template>
          <template v-else-if="row?.total_transfer_in_amount == '--'">--</template>
          <span v-else class="color-[--up-color]">
            {{ formatNumber(row?.total_transfer_in_amount || 0, 2) }}
          </span>
          <span
              class="block lh-17px color-[--third-text]"
          >
            <template v-if="row?.total_transfer_out_amount == 0">0</template>
            <template v-else-if="row?.total_transfer_out_amount == '--'">--</template>
            <span v-else class="color-[--down-color]">
              {{ formatNumber(row?.total_transfer_out_amount || 0, 2) }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('wallet_detail_tx_count')" align="right">
        <template #default="{ row }">
          <template v-if="row?.total_purchase == 0">0</template>
          <template v-else-if="row?.total_purchase == '--'">--</template>
          <span v-else class="color-[--up-color]">
            {{ formatNumber(row?.total_purchase || 0, 2) }}
          </span>
          <span class="color-[--secondary-text]">/</span>
          <template v-if="row?.total_sold == 0">0</template>
          <template v-else-if="row?.total_sold == '--'">--</template>
          <span v-else class="color-[--down-color]">
            {{ formatNumber(row?.total_sold || 0, 2) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('share')" align="right">
        <template #default="{ row }">
          <Share :statistics="row" :type="'topHolder'" :address="row.token" :chain="row.chain" />
        </template>
      </el-table-column>
    </el-table>
    <HideTokenDialog
      v-model="hideTokenVisible"
      :row="currentHideToken"
      :self_address="address"
      @hideToken="()=>{}"
    />
  </div>
</template>

<script setup lang="ts">
// import { formatNumber2, formatNumberS } from '@/utils/formatNumber'
import HideTokenDialog from './hideTokenDialog.vue'
import TokenColumn from '@/components/tokenColumn.vue'
import AveEmpty from '@/components/aveEmpty.vue'
import Share from '@/components/share.vue'
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  tableIndex: {
    type: Number,
    default: 0,
  },
  handleSortChange: {
    type: Function,
    default: () => {},
  },
  conditions: {
    type: Object,
    default: () => {},
  },
  handleSort: {
    type: Function,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pageNO: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  isSelfAddress: Boolean,
  address: String,
})

const _emit = defineEmits(['hideToken'])
const hideTokenVisible = ref(false)
const currentHideToken = ref({})
const injecteIsVolUSDT = inject<Ref<boolean>>('isVolUSDT')
const themeStore = useThemeStore()
const walletStore = useWalletStore()
const tokenDetailSStore = useTokenDetailsStore()
const route = useRoute()
function jumpBalance(row) {
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
    user_address: route.params.userAddress as string || useBotStore().getWalletAddress(row.chain) || useWalletStore().address,
  })
}

function hideToken(row) {
  hideTokenVisible.value = true
  currentHideToken.value = row
}
</script>

<style lang="scss" scoped>
.hover-row {
  .bxs-hide {
    display: block;
  }
}
</style>
