<template>
    <div>
      <el-table
        ref="table_ref"
        :data="tableData"
        :key="tableIndex"
        fit
        stripe
        style="width: 100%"
        class="table-container"
        v-loading="loading"
        @row-click="tableRowClick"
        @sort-change="handleSortChange"
        :default-sort="{
          prop: conditions.sort,
          order: conditions.sort_dir ? conditions.sort_dir + 'ending' : null
        }"
      >
        <template #empty>
          <div v-if="!loading" class="table-empty">
            <!-- <span>{{ $t('emptyNoData') }}</span> -->
            <AveEmpty />
          </div>
          <span v-else />
        </template>
        <el-table-column
        width="220"
        fixed="left"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="total_profit"
        >
          <template #header>
            <span class="text-10px" style="opacity: 0">0</span>
            <span>{{ $t('wallet2')+'/'+ $t('lastTxsTime1') }}</span>
            <el-popover
              v-model:visible="filterForm['last_trade_time'].visible"
              placement="bottom"
              popper-class="chains-table-filter"
              title=""
              :width="220"
              trigger="click"
            >
              <template #reference>
                <Icon
                    id="custom-filter"
                    name="custom:filter"
                    class="text-10px cursor-pointer  ml-3px"
                    :style="{
                      color: isActiveFilter('last_trade_time') ? 'var(--d-F5F5F5-l-333)' : ''
                    }"
                    @click.stop.prevent
                  />
              </template>
              <template #default>
                <div class="filter-box" :class="mode">
                  <div class="filter-title">{{ $t('lastTxsTime1') }}</div>
                  <div class="flex mt-10px">
                    <ul class="openTime">
                      <li v-for="(item, index) in openTimeList" :key="index">
                        <a
                          href=""
                          :class="filterForm['last_trade_time'].last_trade_time == item.value ? 'active': ''"
                          @click.stop.prevent="
                            filterForm['last_trade_time'].last_trade_time = item.value
                          "
                        >
                          {{ item.text }}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="mt-20px flex items-center justify-center">
                    <el-button
                      size="default"
                      style="
                        height: 30px;
                        min-width: 70px;
                        --el-button-font-weight: 400;
                      "
                      :color="mode !== 'dark' ? '#f2f2f2' : '#333333'"
                      @click.stop="handleReset(filterForm['last_trade_time'])"
                    >
                      {{ $t('reset') }}
                    </el-button>
                    <el-button
                      class="confirm"
                      size="default"
                      :color="mode !== 'dark' ? '#222222' : '#f5f5f5'"
                      @click.stop="handleFilterConfirm(filterForm['last_trade_time'])"
                    >
                      {{ $t('confirm') }}
                    </el-button>
                  </div>
                </div>
              </template>
            </el-popover>
          </template>
          <template #default="{ row, $index }">
            <div
              class="token-info table-item_d"
              style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
            >
              <span class="text-10px" v-if="$index < 9" style="opacity: 0">0</span>
              <span class="text-10px" style="color: #696e7c">
                #{{ (pageNO - 1) * pageSize + $index + 1 }}
              </span>
              <a href="" class="ml-4 mr-8 a-gray fav_address" v-if="row.is_wallet_address_fav == 1" @click.stop.prevent="deleteAttention(row)">
                    <i class="attention iconfont icon-fav1 active font-12"></i>
                    

                  </a>
              <a href class="ml-4 mr-8 a-gray fav_address"  v-else @click.stop.prevent="openAttention(row,$index)">
                <i class="attention iconfont icon-fav1 font-12"></i>
              </a>
              <UserAvatar class="mr-10" iconSize="32px" iconChainSize="14px" :wallet_logo="{...(row?.wallet_logo || {}), url: row?.wallet_logo?.url || row?.twitter_url, logo: row?.wallet_logo?.logo || row?.avatar_url}" :address="row.wallet_address"></UserAvatar>
              <div>
                <div class="flex-start">
                  <UserRemark addressClass="token-symbol ellipsis" addressStyle="max-width: 70px" showAddressTitle :address="row.wallet_address" :chain="row.chain" :remark="row.remark || row.nickname" :wallet_logo="row.wallet_logo" :formatAddress="a=> '*' + a?.slice(-5)" @updateRemark="({remark}) => row.remark = remark"></UserRemark>
                  <img  v-if="activeTab === 'kol'" style="width: 10px; height: 10px; margin-left: 8px;" src="@/assets/images/x.png" alt="" srcset="" @click.stop="goLink1(row?.wallet_logo?.url)">
                </div>
                <div class="font_10 color-icon flex-start mt_4" style="line-height: 1">
                  {{ row.wallet_address.slice(0, 4) }}...{{ row.wallet_address.slice(-4) }}
                  <i class="iconfont icon-copy ml-5 text-12px" @click.stop v-copy="row.wallet_address"></i>
                  <div class="media-list flex-start" v-if="row?.extra?.length > 0">
                    <template v-for="(item, index) in row?.extra" :key="index">
                      <div
                        class="ml-5"
                        v-if="item?.tip"
                        @mouseover.stop="
                          e => {
                            buttonTagRef = e.currentTarget
                            toolTipTagVisible = true
                            toolTipTagContent = this.$t(item?.tip)
                          }
                        "
                        @mouseleave.stop="e => (toolTipTagVisible = false)"
                      >
                        <span class="media-item">
                          <!-- <i class="iconfont icon-QQ text-12px"></i>
                             -->
                          <img
                            :src="require(`@/assets/images/${item.img}.png`)"
                            :alt="item.img"
                            width="10"
                          />
                        </span>
                      </div>
                    </template>
                  </div>
                  <template v-if="row.signal_arr?.length > 0">
                    <div
                      class="flex"
                      v-for="(i, index) in row.signal_arr"
                      :key="index"
                      @mouseover.stop="
                        e => {
                          buttonTagRef = e.currentTarget
                          toolTipTagVisible = true
                          toolTipTagContent = $f.getTagTooltip(i)
                        }
                      "
                      @mouseleave.stop="e => (toolTipTagVisible = false)"
                    >
                      <el-image class="token-icon-signal-tag" :src="$f.formatIconTag(i.tag)" lazy>
                        <template #error>
                          <img class="token-icon-signal-tag" src="/icon-default.png" />
                        </template>
                        <template #placeholder>
                          <img class="token-icon-signal-tag" src="/icon-default.png" />
                        </template>
                      </el-image>
                      <span
                        class="ml-2"
                        :style="{
                          color:
                            i.color == 'green'
                              ? upColor[0]
                              : downColor[0]
                        }"
                      >
                        <template v-if="i.tag">{{ $t(i.tag) }}</template>
                      </span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="right" width="100">
          <template #header>
            <span>{{ $t('lastTxsTime1') }}</span>
          </template>
          <template #default="{ row }">
            <div
              :style="{
                color:formatTimeFromNow(row?.last_trade_time, true) <= 600
                    ? '#FFA622'
                    : 'var(--custom-text-2-color)'
              }"
            >
              <template v-if="!row?.last_trade_time">-</template>
              <template v-else-if="formatTimeFromNow(row?.last_trade_time, true) >= 60">
                {{ formatTimeFromNow(row?.last_trade_time) }}
              </template>
              <TimerCount
                v-else-if="row?.last_trade_time && Number(formatTimeFromNow(row?.last_trade_time, true) ) < 60"
                :key="`${row.last_trade_time}`"
                :timestamp="row.last_trade_time"
                :end-time="60"
              >
                <template #default="{ seconds }">
                  <span class="color-#FFA622">
                    <template v-if="seconds < 60">
                      {{ seconds }}s
                    </template>
                    <template v-else>
                      {{ formatTimeFromNow(row.last_trade_time) }}
                    </template>
                  </span>
                </template>
              </TimerCount>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          label="Pnl"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="total_profit"
          min-width="100px"
        >
          <template #default="{ row }">
            <div style="padding: 0 5px">
              <div :class="!row?.total_profit ? 'color-text-3' : ''">
                ${{ row?.total_profit > 0 ? formatNumber(row?.total_profit || 0, 0) : 0 }}
              </div>
              <div class="text-12px">
                <span class="green" v-if="row?.total_profit_rate > 0">
                  {{ formatNumber(row?.total_profit_rate * 100 || 0) }}%
                </span>
                <span class="red" v-else-if="row?.total_profit_rate < 0">
                  {{ formatNumber(row?.total_profit_rate * 100 || 0) }}%
                </span>
                <span class="color-text-3" v-else>0</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          :label="$t('volume4')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="total_volume"
          min-width="150px"
        >
          <template #default="{ row }">
            <div style="padding: 0 5px">
              <div :class="!row?.total_volume ? 'color-text-3' : ''">
                ${{
                  row?.total_volume > 0 ? formatNumber(row?.total_volume || 0, 2, 4, 10 ** 4) : 0
                }}
              </div>
              <div class="text-12px color-text-3">
                <span :class="row?.total_purchase > 0 ? 'green' : ''">
                  ${{ formatNumber(row?.total_purchase || 0, 2, 4, 10 ** 4) }}
                </span>
                <span>/</span>
                <span class="red" :class="row?.total_sold > 0 ? 'red' : ''">
                  ${{ formatNumber(row?.total_sold || 0, 2, 4, 10 ** 4) }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          :label="$t('txns')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="total_trades"
          min-width="100px"
        >
          <template #default="{ row }">
            <div style="padding: 0 5px">
              <div :class="!row?.total_trades ? 'color-text-3' : ''">
                {{
                  row?.total_trades > 0 ? formatNumber(row?.total_trades || 0, 2, 4, 10 ** 4) : 0
                }}
              </div>
              <div class="text-12px color-text-3">
                <span :class="row?.buy_trades > 0 ? 'green' : ''">
                  {{ formatNumber(row?.buy_trades || 0, 2, 4, 10 ** 4) }}
                </span>
                <span>/</span>
                <span class="red" :class="row?.sell_trades > 0 ? 'red' : ''">
                  {{ formatNumber(row?.sell_trades || 0, 2, 4, 10 ** 4) }}
                </span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('winRate')"
          align="right"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="token_profit_rate"
        >
          <template #default="{ row }">
            <div :class="!row?.token_profit_rate ? 'color-text-3' : ''">
              <span v-if="row?.token_profit_rate > 0" class="green">
                {{ formatNumber(row?.token_profit_rate * 100 || 0, 2) }}%
              </span>
              <span v-else-if="row?.token_profit_rate < 0" class="red">
                {{ formatNumber(row?.token_profit_rate * 100 || 0, 2) }}%
              </span>
              <span v-else class="color-text-3">0</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="right"
          :label="$t('score')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="rank_score"
          min-width="80px"
        >
        <template #default="{ row }">
            {{row.rank_score?.toFixed(2) ?? 0}}
          </template>
        </el-table-column>

        <el-table-column align="right" min-width="400px">
          <template #header>
            <span>{{ $t('30dTokenDistribution') }}</span>
            <el-popover
              placement="bottom"
              popper-class="chains-table-filter"
              title=""
              :width="350"
              trigger="hover"
              v-model:visible="filterForm['profit_percent_num'].visible"
              teleported
            >
              <template #reference>
                <i
                  class="iconfont icon-guolv1 text-10px ml-3"
                  :style="{
                    color: isActiveFilter('profit_percent_num') ? 'var(--custom-primary-color)' : ''
                  }"
                ></i>
              </template>
              <template #default>
                <div class="filter-box" :class="mode">
                  <el-scrollbar
                    :max-height="filterHeight"
                    :always="false"
                    view-style="overflow-x: hidden"
                  >
                    <div
                      class="mb_40"
                      v-for="(item, key, index) in filterForm['profit_percent_num'].profit_obj"
                      :key="index"
                    >
                      <template v-if="item.color == 'green'">
                        <div class="filter-title flex-start">
                          {{ item?.name }}
                          <div
                            class="flex clickable"
                            style="cursor: pointer"
                            @click="handleSort(filterForm['profit_percent_num'].profit_obj[key])"
                          >
                            <div class="chain-icon-sort-container">
                              <svg
                                class="icon-svg"
                                aria-hidden="true"
                                :class="
                                  filterForm['profit_percent_num'].profit_obj[key].sort_dir === 'asc'
                                    ? 'active'
                                    : ''
                                "
                                @click.stop="
                                  handleSort(filterForm['profit_percent_num'].profit_obj[key], 'asc')
                                "
                              >
                                <use xlink:href="#icon-sort-up"></use>
                              </svg>
                              <svg
                                class="icon-svg"
                                aria-hidden="true"
                                :class="
                                  filterForm['profit_percent_num'].profit_obj[key].sort_dir === 'desc'
                                    ? 'active'
                                    : ''
                                "
                                @click.stop="
                                  handleSort(filterForm['profit_percent_num'].profit_obj[key], 'desc')
                                "
                              >
                                <use xlink:href="#icon-sort-down"></use>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div class="flex mt-10">
                          <el-input
                            v-model.trim.number="
                              filterForm['profit_percent_num'].profit_obj[key].range[0]
                            "
                            :placeholder="$t('minor')"
                            clearable
                          ></el-input>
                          <span class="ml-10 mr-10">~</span>
                          <el-input
                            v-model.trim.number="
                              filterForm['profit_percent_num'].profit_obj[key].range[1]
                            "
                            :placeholder="$t('max1')"
                            clearable
                          ></el-input>
                        </div>
                        <!-- <div class="mt-10 mb-20" style="padding: 0 10px">
                          <el-slider
                            :style="{ '--el-slider-main-bg-color': 'var(--a-slider-bg-color)' }"
                            v-model="filterForm['profit_percent_num'].profit_obj[key].range"
                            range
                            :min="0"
                            size="small"
                            :max="filterForm['profit_percent_num'].profit_obj[key].defaultRange[1]"
                            :marks="{
                              0: '0',
                              [filterForm['profit_percent_num'].profit_obj[key].defaultRange[1]]:
                                formatNumber(
                                  [filterForm['profit_percent_num'].profit_obj[key].defaultRange[1]],
                                  0,
                                  4,
                                  10 ** 4
                                )
                            }"
                          />
                        </div> -->
                      </template>
                    </div>
                    <div class="mt-60 flex-end">
                      <el-button
                        size="default"
                        style="
                          height: 30px;
                          min-width: 70px;
                          margin-left: auto;
                          --el-button-font-weight: 400;
                        "
                        :color="mode !== 'dark' ? '#f2f2f2' : '#333333'"
                        @click.stop="handleReset(filterForm['profit_percent_num'])"
                      >
                        {{ $t('reset') }}
                      </el-button>
                      <el-button
                        size="default"
                        :color="mode !== 'dark' ? '#222222' : '#f5f5f5'"
                        style="height: 30px; min-width: 70px; --el-button-font-weight: 400"
                        @click.stop="handleFilterConfirm(filterForm['profit_percent_num'])"
                      >
                        {{ $t('confirm') }}
                      </el-button>
                    </div>
                  </el-scrollbar>
                </div>
              </template>
            </el-popover>
          </template>
          <template #default="{ row }">
            <div style="padding: 0 5px 0 20px" class="flex-between">
              <div
                v-for="(item, key) in filterForm['profit_percent_num'].profit_obj"
                :key="key"
              >
                <span
                  class="color-text-3 bg-smart"
                  :class="row?.[key] > 0 ? `bg-${item.color}-1` : 'bg-gray-1'"
                >
                  {{ formatNumber(row?.[key] || 0, 2) }}
                </span>
                <div class="text-12px mt_2 color-999">
                  {{ item.name }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" min-width="250px">
          <template #header>
            <span>{{ $t('smartTop3') }}</span>
          </template>
          <template #default="{ row }">
            <div style="" class="flex-end">
              <div
                class="ml-10"
                v-for="(item, index) in row?.tag_items"
                :key="index"
                @click.stop.prevent="goLink(item, row.chain)"
                style="width: 80px"
              >
                <span class="ellipsis block">{{ item.symbol }}</span>
                <div class="text-12px">
                  <span class="green" v-if="item?.volume > 0">
                    ${{ formatNumber(item?.volume || 0, 2, 4, 10 ** 4) }}
                  </span>
                  <span class="red" v-else-if="item?.volume < 0">
                    ${{ formatNumber(item?.volume || 0, 2, 4, 10 ** 4) }}
                  </span>
                  <span class="color-text-3" v-else>0</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" width="150">
          <template #header>
            <span>{{ $t('operation') }}</span>
          </template>
          <template #default="{ row }">
            <div class="flex-end" @click.stop>
              <a class="trade" :href="`https://t.me/AveSniperBot?start=fs-${row.chain}-${row.wallet_address}`"  target="_blank">
                <svg class="svg" aria-hidden="true">
                  <use xlink:href="#icon-telegram"></use>
                </svg>
                {{ $t('copyTrade') }}
              </a>
            </div>

          </template>
        </el-table-column>
      </el-table>
      <el-tooltip
        v-if="toolTipTagContent"
        ref="tooltipRef1"
        :visible="toolTipTagVisible"
        :content="toolTipTagContent"
        placement="top"
        :popper-class="mode"
        effect="customized"
        :virtual-ref="buttonTagRef"
        virtual-triggering
      ></el-tooltip>

      <!-- <DialogJSX v-model:visible="attentionVisible1" @confirm="data=>addAttention(currentAttentionRow.walletAddress||currentAttentionRow.wallet_address,currentAttentionRow.chain,data)" :dialogProps="attentionDialogProps.dialogProps" :columns="attentionDialogProps.columns" :formProps="attentionDialogProps.formProps" :dataSource="{address:currentAttentionRow.wallet_address,is_monitored:disabledMonitor?0:1,group:0,monitoredTypes:['buy','sell'],sendType:['website'],user_chain:{value:currentAttentionRow.chain},remark:currentAttentionRow.remark}" @change="(data)=>attentionFormData=data"></DialogJSX> -->
    </div>
  </template>

<script setup lang="ts">
import { upColor, downColor} from '@/utils/constants.ts'
import { useWindowSize } from '@vueuse/core'
const props = defineProps({
    activeTab: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableIndex: {
      type: Number,
      default: 0
    },
    tableRowClick: {
      type: Function,
      default: () => {}
    },
    handleSortChange: {
      type: Function,
      default: () => {}
    },
    conditions: {
      type: Object,
      default: () => {
        return {}
      }
    },
    pageNO: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    isActiveFilter: {
      type: Function,
      default: () => {
        return false
      }
    },
    handleFilterConfirm: {
      type: Function,
      default: () => {}
    },
    handleSort: {
      type: Function,
      default: () => {}
    },
    handleReset: {
      type: Function,
      default: () => {}
    },
    searchChainSwap: {
      type: Function,
      default: () => {}
    },
    filterForm: {
      type: Object,
      default: () => {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    openTimeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    filterSwapList: {
      type: Array,
      default: () => {
        return []
      }
    },
    activeInterval: {
      type: String,
      default: '30D'
    },
})
const {activeTab,searchKeyword,tableData,tableIndex, tableRowClick, handleSortChange, conditions, pageNO, pageSize,isActiveFilter, handleFilterConfirm, handleSort, handleReset, searchChainSwap, filterForm, loading,openTimeList, filterSwapList,activeInterval }= toRefs(props)

const buttonTagRef = ref<HTMLElement | null>(null)
const toolTipTagVisible = shallowRef(false)
const toolTipTagContent = shallowRef('')
const visible = shallowRef(false)
const keyword = shallowRef('')
const editable= ref(tableData?.value?.map(() => false))
const remark = shallowRef('')
const currentAttentionRow = ref({})
const currentAttentionIndex = shallowRef(0)
const attentionFormData = ref({
    is_monitored: 1
})
const { height } = useWindowSize()
const wHeight = height
const { lang, mode} = useGlobalStore()
const attentionVisible1 = shallowRef(false)
const disabledMonitor = computed(() => {
    return true
})
const filterHeight = computed(() => wHeight.value - 200)
const attentionDialogProps = computed(() => {
   return ''
 })


function updateWhaleRemark() { }
function goLink1() { }
function goLink() { }
function deleteAttention() { }
function openAttention() { }
function addAttention() { }





</script>

<style lang="scss" scoped>
.table-container{
  min-height: calc(100vh - 100px)
}
a.a-gray{
  color: var(--a-bg-6-color) !important;
  .attention {
    &.active {
      color: var(--custom-fav-address-color);
    }
  }
}
.icon-token-container {
  margin-right: 4px;
}
.plus {
  font-size: 20px;
  line-height: 20px;
  display: block;
  height: 20px;
  margin-right: 10px;
}
// .trade {
//   display: flex;
//   align-items: center;
//   justify-content: flex-end;
//   a {
//     background: var(--custom-btn-bg-color);
//     padding: 5px 7px;
//     border-radius: 6px;
//     display: flex;
//     align-items: center;
//     font-size: 14px;
//     color: var(--custom-text-1-color);
//     .icon-svg {
//       // font-size: 12px;
//       // height: 12px;
//       // width: 12px;
//       margin-right: 3px;
//     }
//     &:hover {
//       opacity: 0.5;
//     }
//   }
// }
.progress {
  margin-left: 3px;
  :deep().el-progress__text {
    min-width: 12px;
  }
  .icon-suo1 {
    width: 8px;
    height: 8px;
  }
}
.icon-svg1 {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
.token-info {
  display: flex;
  align-items: center;
  .token-symbol {
    // white-space: nowrap;
    // overflow: hidden;
    // text-overflow: ellipsis;
    font-size: 13px;
    margin-right: 3px;
  }
  .icon-collect {
    font-size: 12px;
    color: var(--a-bg-6-color);
    cursor: pointer;
    margin-right: 5px;
    &.collected {
      color: #ffbb19;
    }
  }
  .token-network {
    border: 1px solid #878fbc;
    border-radius: 10px;
    font-size: 12px;
    color: #878fbc;
    padding: 2px 5px;
    margin-left: 9px;
  }
  .token-icon {
    border-radius: 50%;
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
.icon-svg {
  font-size: 20px;
  cursor: pointer;
  color: var(--custom-primary-color);
  border-radius: 100%;
  width: 20px;
  vertical-align: middle;
  &.icon-huoyan {
    width: 12px;
    font-size: 12px;
  }
  &.icon-new {
    font-size: 12px;
  }
  &.icon-xiala {
    width: 8px;
    height: 8px;
    margin-left: 5px;
  }
}

.icon-shaixuan {
  &:hover {
    cursor: pointer;
    color: var(--custom-primary-color);
  }
}

.filter-box {
  color: var(--d-E9E9E9-l-222);
  .filter-title {
    font-size: 12px;
    color: var(--d-999-l-666);
    font-weight: 500;
  }

  // :deep() .el-input__wrapper {
  //   .el-input__inner{
  //     color: var(--custom-font-1-color);
  //   }
  // }
  .chain-icon-sort-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    .icon-svg {
      font-size: 10px;
      padding: 0;
      cursor: pointer;
      color: var(--a-text-2-color);
      width: 12px;
      height: 10px;
      & + .icon-svg {
        margin-top: 1px;
      }
      &.active {
        color: var(--custom-primary-color);
      }
    }
  }
  .icon-filter-sort {
    font-size: 12px;
    opacity: 0.3;
    &.active {
      opacity: 1;
    }
    &:hover:not(.active) {
      opacity: 0.6;
    }
    cursor: pointer;
  }
}

.red {
  color: '#F6465D';
}
.green {
  color: '#12B886';
}

.popper-gold {
  .title {
    color: var(--a-text-2-color);
  }
  ul {
    li {
      a {
        color: var(--custom-text-1-color);
        padding: 6px 15px;
        display: flex;
        .icon-bianzu,
        .icon-dexs1 {
          color: var(--a-text-1-color);
        }
        &.disabled {
          color: var(--a-text-2-color);
          &:hover {
            cursor: not-allowed;
          }
        }
        &:hover {
          opacity: 1;
          text-decoration: none;
          background: var(--custom-btn-2-color);
        }
      }
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 15px 0;
  }
  .tag-left {
    margin-left: 3px;
    width: 12px;
    height: 12px;
  }
  .tag-left2 {
    margin-left: 3px;
    width: 19px;
    height: 17px;
  }
}
.ellipsis {
  max-width: 100%;
}

.bg-smart {
  border-radius: 4px;
  padding: 2px 7px;
  display: inline-block;
  &.bg-red-1 {
    background: #eb2b4b;
    color: #fff;
  }
  &.bg-green-1 {
    background: #37b270;
    color: #fff;
  }
  &.bg-gray-1 {
    background: rgb(153, 153, 153, 0.1);
  }
  &.bg-yellow-1 {
    color: #fff;
    background: #ffa622;
  }
}
a.trade {
  background: var(--custom-primary-lighter-13-color);
  padding: 5px 7px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--custom-font-1-color);
   white-space: nowrap;
  .svg {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}

.icon-copy {
  color: #999999;
}
ul.openTime {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-direction: column;
  li {
    a {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--d-E9E9E9-l-222);
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
      border: 1px solid var(--d-333-l-F5F5F5);
      padding: 8px 15px;
      text-align: center;
      margin-bottom: 10px;
      border-radius: 4px;
      &.active {
        border: 1px solid var(--d-F5F5F5-l-333);
        background: var(--d-333-l-F5F5F5);

      }
    }
  }
}
.confirm{
  height: 30px;
  min-width: 70px;
  --el-button-font-weight: 400;
  background-color:#3F80F7;
  border-color: #3F80F7;
  color:#fff;
}
</style>
