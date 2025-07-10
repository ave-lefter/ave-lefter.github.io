<template>
  <div class="w-address mt-12px flex-1">
    <div v-if="currentAddress" class="m-header flex-between px-12px items-start">
      <pro-groups v-model="conditions.group" :options="addressGroups" @onConfirm="handleConfirmEdit" @onDelete="handleDelGroup" @onAdd="handleAddGroup"/>
      <ul class="w-operate">
        <li>
           <el-checkbox v-model="conditions.isMonitor" :label="t('monitorList')" size="small" style="font-size: 12px;color:var(--d-666-l-333);z-index: 0" />
        </li>
        <li class="btn">
          <span @click="followStore.showBatchAddressDetails=true">{{ $t('bulkProcess') }}</span>
        </li>
        <li>
          <el-radio-group v-model="conditions.activeTab" class="m-radio-group" size="small" :fill="isDark?'#333':'#666'" :text-color="isDark?'#F5F5F5':'#FFF'" @change="()=>{}">
            <el-radio-button label="7D" :value="'7d'" />
            <el-radio-button label="1M" :value="'30d'" />
          </el-radio-group>
        </li>
      </ul>
    </div>
    <div claas="m-table">
      <el-table class='mt-12px' v-loading="loading" :data="dataSource" fixed  @sort-change="handleSortChange"
      @row-click="tableRowClick">
        <template #empty>
          <div v-if="!loading" class="flex flex-col items-center justify-center py-30px">
            <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
            <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
            <span>{{ t('emptyNoData') }}</span>
          </div>
          <span v-else />
        </template>
        <el-table-column :label="$t('wallet2')" width="200" fixed="left">
          <template #header>
            <span class="text-10px" style="opacity: 0">0</span>
            <span>{{ $t('wallet2') }}</span>
              <Icon
                v-if="conditions.keyword"
                id="custom-filter"
                name="custom:filter"
                   :style="{
                  color: conditions.keyword ? 'var(--d-F5F5F5-l-333)' : 'var(--custom-font-8-color)'
                }"
                class="text-10px cursor-pointer ml-2px"
                @click.stop.prevent="handleFilterQuery()"
              />
            <el-popover
              v-else
              placement="bottom-start"
              popper-class="chains-table-filter"
              title=""
              :width="320"
              trigger="click"
              v-model:visible="visible"
            >
              <template #reference>
                 <Icon
                  id="custom-filter"
                  name="custom:filter"
                  class="text-10px cursor-pointer ml-2px"
                  @click.stop.prevent="handleFilterQuery()"
                />
              </template>
              <template #default>
                <div class="filter-box" :class="mode">
                  <div>{{ $t('attentionSearch') }}</div>
                  <div class="flex mt-10px">
                    <el-input
                      v-model.trim="searchKeyword"
                      :placeholder="$t('attentionSearch')"
                      clearable
                      @clear="handleFilterQuery()"
                    ></el-input>
                  </div>
                  <div class="mt-20px flex">
                    <el-button
                      class="flex-1"
                      size="default"
                      :color="mode !== 'dark' ? '#222222' : '#f5f5f5'"
                      style="height: 30px; min-width: 70px; --el-button-font-weight: 400"
                      @click.stop="searchKeyword='';visible=false"
                    >
                      {{ $t('cancel') }}
                    </el-button>
                    <el-button
                      class="flex-1"
                      size="default"
                      color="#3F80F7"
                      style="height: 30px; min-width: 70px; --el-button-font-weight: 400"
                      @click.stop="handleFilterQuery(searchKeyword)"
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
              <span class="text-10px mr-5px" style="color: #696e7c">
                #{{ (pageData.page - 1) * pageData.pageSize + $index + 1 }}
              </span>
              <!-- <a href class="mr-5px a-gray fav_address" v-if="row.is_wallet_address_fav == 1" @click.stop.prevent="handleDeleteAttention(row)">
                    <i class="attention iconfont icon-fav1 active font-12"></i> -->
              <Icon
                name="custom:attention"
                :class="`cursor-pointer mr-8px ${row.is_wallet_address_fav == 1
                      ?'color-#f45469'
                      :'color-[&#45;&#45;d-666-l-696E7C]'} text-12px hover:color-#f45469`"
                @click.self.stop="handleDeleteAttention(row)"
              />
              <UserAvatar class="mr-10px" :wallet_logo="row.wallet_logo" :address="row.user_address" :chain="row.user_chain" iconSize="24px"></UserAvatar>
              <div>
                <UserRemark :remark="row.remark" :address="row.user_address" :chain="row.user_chain" addressClass="token-symbol ellipsis" addressStyle="max-width: 95px" iconEditColor="#999" iconEditSize="10px" showAddressTitle @updateRemark="({remark}) => row.remark = remark" :formatAddress="
                  (address) =>
                    address?.slice(0, 4) + '...' + address?.slice(-4)
              "> </UserRemark>
                <div class="font_10 color-icon flex-start mt_4" style="line-height: 1">
                  <i class="iconfont icon-copy text-12px fav-icon-color" @click.stop v-copy="row.user_address"></i>
                  <div class="media-list flex-start" v-if="row?.extra?.length > 0">
                    <template v-for="(item, index) in row?.extra" :key="index">
                      <div
                        class="ml-5"
                        v-if="item?.tip"
                        @mouseover.stop="
                          e => {
                            buttonTagRef = e.currentTarget
                            toolTipTagVisible = true
                            toolTipTagContent = $t(item?.tip)
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
                  <template v-if="row?.signal_arr?.length > 0">
                    <div
                      class="flex"
                      v-for="(i, index) in row.signal_arr"
                      :key="index"
                      @mouseover.stop="
                        e => {
                          buttonTagRef = e.currentTarget
                          toolTipTagVisible = true
                          toolTipTagContent = getTagTooltip(i)
                        }
                      "
                      @mouseleave.stop="e => (toolTipTagVisible = false)"
                    >
                      <el-image class="token-icon-signal-tag" :src="formatIconTag(i.tag)" lazy>
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
                            i.color == `color-${upColor[0]}`
                              ? upColor[7]
                              : downColor[7]
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
        <el-table-column
          align="right"
          :label="$t('nativeBalance')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="main_token_balance_amount"
          min-width="100px"
        >
          <template #default="{ row }">
            <div style="padding: 0 5px">
              <div v-if="row?.main_token_balance_amount > 0" :class="!row?.main_token_balance_amount ? 'color-text-zero' : ''">
                {{ formatNumber2(row?.main_token_balance_amount || 0, 2) }}&nbsp;{{row.main_token_symbol}}
              </div>
              <div v-else class="color-text-zero">
                0
              </div>
            </div>
          </template>
        </el-table-column>

          <!-- total balance -->
      <el-table-column
        align="right"
        :label="$t('walletTotalBalance')"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="total_balance"
        min-width="100px"
      >
        <template #default="{ row }">
          <div style="padding: 0 5px">
            <div v-if="row?.total_balance > 0" :class="!row?.total_balance ? 'color-text-zero' : ''">
              ${{formatNumber2(row?.total_balance || 0, 1)}}
            </div>
            <div v-else class="color-text-zero">
              $0
            </div>
          </div>
        </template>
      </el-table-column>
        <!-- 30dPnL -->
      <el-table-column
        align="right"
        :label="conditions.activeTab === '7d' ? $t('7dPnL') : $t('30dPnL')"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="total_profit"
        min-width="100px"
      >
        <template #default="{ row }">
          <div style="padding: 0 5px">
            <div v-if="row?.total_profit !== 0" :class="row?.total_profit == 0 ? 'color-text-zero' : ''">
              {{row?.total_profit && row?.total_profit < 0 ? '-':''}}${{formatNumber2(Math.abs(row?.total_profit) || 0, 0)}}
            </div>
            <div class="text-12px">
              <span :class="`color-${upColor[0]}`" v-if="row?.total_profit_ratio > 0">
                {{ formatNumber2(row?.total_profit_ratio * 100 || 0,2) }}%
              </span>
              <span :class="`color-${downColor[0]}`" v-else-if="row?.total_profit_ratio < 0">
                {{ formatNumber2(row?.total_profit_ratio * 100 || 0,2) }}%
              </span>
              <span class="color-text-zero" v-else>0</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 30dWinRate -->
      <el-table-column
        align="right"
        :label="conditions.activeTab === '7d' ? $t('7dWinRate') : $t('30dWinRate')"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="total_win_ratio"
        min-width="100px"
      >
        <template #default="{ row }">
          <div :class="!row?.total_win_ratio ? 'color-text-zero' : ''">
            <span :class="`color-${upColor[0]}`" v-if="row?.total_win_ratio > 0">
              {{ formatNumber2(row?.total_win_ratio || 0, 2) }}%
            </span>
            <span :class="`color-${downColor[0]}`" v-else-if="row?.total_win_ratio < 0">
              {{ formatNumber2(row?.total_win_ratio || 0, 2) }}%
            </span>
            <span class="color-text-zero" v-else>0</span>
          </div>
        </template>
      </el-table-column>

      <!-- 30dVolume -->
      <el-table-column
        align="right"
        :label="conditions.activeTab === '7d' ? $t('7dVolume') : $t('30dVolume')"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="tx_volume"
        min-width="130px"
      >
        <template #default="{ row }">
          <div style="padding: 0 5px">
            <div v-if="Number(row?.total_txs_usd) > 0" :class="!row?.total_txs_usd ? 'color-text-zero' : ''">
              ${{
                row?.total_txs_usd > 0 ? formatNumber2(row?.total_txs_usd || 0, 2, 4, 10 ** 4) : 0
              }}
            </div>
            <div v-else class="color-text-zero">$0</div>
            <div class="text-12px color-text-zero">
              <span :class="row?.total_purchase_usd > 0 ? `color-${upColor[0]}` : 'color-text-zero'">
                ${{ formatNumber2(row?.total_purchase_usd || 0, 2, 4, 10 ** 4) }}
              </span>
              <span>/</span>
              <span :class="row?.total_sold_usd > 0 ? `color-${downColor[0]}` : 'color-text-zero'">${{ formatNumber2(row?.total_sold_usd || 0, 2, 4, 10 ** 4) }}
              </span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 30dTrades -->
      <el-table-column
        align="right"
        :label="conditions.activeTab === '7d' ? $t('7dTrades') : $t('30dTrades')"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="tx_count"
        min-width="100px"
      >
        <template #default="{ row }">
          <div style="padding: 0 5px">
            <div v-if="row?.total_txs > 0" :class="!row?.total_txs ? 'color-text-zero' : ''">
              {{
                row?.total_txs > 0 ? formatNumber2(row.total_txs || 0, 2, 4, 10 ** 4) : 0
              }}
            </div>
            <div v-else class="color-text-zero">0</div>
            <div class="text-12px color-text-zero">
              <span :class="row?.total_purchase > 0 ? `color-${upColor[0]}` : 'color-text-zero'">
                {{ formatNumber2(row?.total_purchase || 0, 2, 4, 10 ** 4) }}
              </span>
              <span>/</span>
              <span :class="row?.total_sold > 0 ? `color-${downColor[0]}` : 'color-text-zero'">
                {{ formatNumber2(row?.total_sold || 0, 2, 4, 10 ** 4) }}
              </span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="right" width="120"  sortable="custom"
        :sort-orders="['descending', 'ascending', null]" prop="last_tx_time">
        <template #header>
          <span>{{ $t('lastTxsTime1') }}</span>
          <el-popover
            placement="bottom"
            popper-class="chains-table-filter"
            title=""
            :width="300"
            trigger="click"
            v-model:visible="visible2"
          >
            <template #reference>
              <Icon name="custom:filter" class="text-10px ml-2px"  :style="{
                  color: (conditions?.last_trade_time || conditions.sort === 'last_tx_time') ? 'var(--d-F5F5F5-l-333)' : ''
              }" @click.stop.prevent/>
            </template>
            <template #default>
              <div class="filter-box" :class="mode">
                <div class="text-12px font-500 text-[--d-FFF-l-333]">{{ $t('lastTxsTime1') }}</div>
               <ul class="flex flex-col font-500 text-14px text-#666666">
                  <li v-for="(item, index) in openTimeList"  class="flex-between py-11.5px hover:bg-[--d-2A2A2A-l-F2F2F2] cursor-pointer" :key="index"  @click.stop.prevent="
                        filterForm.last_trade_time = item.value"
                   >
                    <span :class="[filterForm.last_trade_time == item.value?'text-[--d-F5F5F5-l-333]':'']">{{ item.text }}</span>
                    <div class="flex-1"/>
                    <Icon v-if="filterForm.last_trade_time == item.value" name="material-symbols:check" class="text-12px"/>
                  </li>
                </ul>
                <div class="mt-11px flex-between">
                  <div
                    class="flex items-center clickable"
                    style="cursor: pointer"
                    @click="handleSort(filterForm)"
                  >
                    <span class="filter-title">{{ $t('sort') }}</span>
                    <div class="sort-container">
                      <i :class="['sort-caret ascending',filterForm.sort_dir === 'asc' ? 'active' : '']"
                        @click.stop="handleSort(filterForm, 'asc')" />
                      <i :class="['sort-caret descending',filterForm.sort_dir === 'desc' ? 'active' : '']"
                        @click.stop="handleSort(filterForm, 'desc')" />
                      <!-- <i name="material-symbols:arrow-drop-down"  :class="filterForm.sort_dir === 'desc' ? 'active' : ''"
                        @click.stop="handleSort(filterForm, 'desc')"/> -->
                      <!-- <svg
                        class="icon-svg"
                        aria-hidden="true"
                        :class="filterForm.sort_dir === 'asc' ? 'active' : ''"
                        @click.stop="handleSort(filterForm, 'asc')"
                      >
                        <use xlink:href="#icon-sort-up"></use>
                      </svg>
                      <svg
                        class="icon-svg"
                        aria-hidden="true"
                        :class="filterForm.sort_dir === 'desc' ? 'active' : ''"
                        @click.stop="handleSort(filterForm, 'desc')"
                      >
                        <use xlink:href="#icon-sort-down"></use>
                      </svg> -->
                    </div>
                  </div>
                  <el-button
                    size="default"
                    style="
                      height: 30px;
                      min-width: 70px;
                      --el-button-font-weight: 400;
                      margin-left: auto;
                    "
                    :color="mode !== 'dark' ? '#f2f2f2' : '#333333'"
                    @click.stop="attentionHandleReset(filterForm)"
                  >
                    {{ $t('reset') }}
                  </el-button>
                  <el-button
                    size="default"
                    :color="mode !== 'dark' ? '#222222' : '#f5f5f5'"
                    style="height: 30px; min-width: 70px; --el-button-font-weight: 400"
                    @click.stop="handleFilterConfirm(filterForm)"
                  >
                    {{ $t('confirm') }}
                  </el-button>
                </div>
              </div>
            </template>
          </el-popover>
        </template>
        <template #default="{ row }">
          <div
            :style="{
              color:
                formatTimeFromNow(row?.last_tx_time, true) <= 600
                  ? '#FFA622'
                  : 'var(--custom-text-2-color)'
            }"
          >
             <span v-if="!row?.last_tx_time">-</span>
            <TimerCount
               v-else-if="
                formatTimeFromNow(row?.last_tx_time, true) < 60
              "
              :timestamp="(60 - formatTimeFromNow(row?.last_tx_time, true)) * 1000"
              style="--van-count-down-text-color: currentColor"
              :key="`${row.last_tx_time}${$Index}`"
              :end-time="60"
            >
              <template #default="{ seconds }">
                <span class="color-#FFA622">
                  <template v-if="seconds < 60">
                    {{ seconds }}s
                  </template>
                  <template v-else>
                    {{ formatTimeFromNow(row.last_tx_time) }}
                  </template>
                </span>
              </template>
            </TimerCount>
            <div v-else>
              {{ formatTimeFromNow(row.last_tx_time) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('addrGroup')" align="right" width="120">
        <template #default="{ row }">
          <el-select v-model="row.group_id" @click.stop @change="(val) => getRowGroupChange(val, row)">
            <el-option :key="0" :value="0" :label="$t('defaultGroup')"/>
            <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" />
          </el-select>
        </template>
      </el-table-column>
       <el-table-column :label="t('push')" align="right" width="120">
        <template #default="{ row }">
          <div @click.stop>
            <!-- <div>
              <Icon name="material-symbols-light:notifications-rounded"/> 
              <span>{{ $t('pauseMonitor') }}{{ $t('enableMonitor') }}</span>
            </div> -->
            <a class="decoration-none flex-end gap-4px" style="text-decoration: none;" :href="`https://t.me/AveSniperBot?start=fs-${row.user_chain}-${row.user_address}`"  target="_blank">
                <Icon name="mingcute:wallet-fill" class="text-12px"/> 
                <span>{{ $t('copyTrade') }}</span>
            </a>
          </div>
        </template>
      </el-table-column>
      </el-table>
      <el-pagination class="mt-20px" v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
      layout="prev, pager, next, ->" :total="pageData.total" :page-sizes="[10, 20, 30, 40, 50, 60]" />
    </div>
  </div>

</template>

<script setup lang="ts">
// import Monitor from '@/components/monitor/index.vue'
import ProGroups from '../components/proGroups.vue'
import BigNumber from 'bignumber.js'
import { defaultPaginationParams, downColor, upColor } from '@/utils/constants'
import {
  getSymbolDefaultIcon,
  getChainDefaultIcon,
  formatExplorerUrl,
  formatDate,
  formatIconSwap,
  isJSON,
  formatIconTag,
  getAddressAndChainFromId,
  getTagTooltip,
} from '@/utils/index'
import { throttle, update } from 'lodash-es'
import { getFavoriteList2, getAttentionPageList, getUserFavoriteGroups2, changeFavoriteGroupName2 ,addFavoriteGroup2,removeFavoriteGroup2 ,moveFavoriteGroup2,deleteAttention} from '~/api/attention'
import { watchOnce } from '@vueuse/core'
const { mode, lang, isDark } = storeToRefs(useGlobalStore())
const followStore = useFollowStore()
const { currentAddress} = storeToRefs(useFollowStore())
const $router = useRouter()
const { t } = useI18n()
const { addressGroups } = storeToRefs(useFollowStore())
// const addressGroups = ref([{ "group_id": 3763, "name": "base", "show_index": -1 }, { "group_id": 37632, "name": "base1", "show_index": 0 }, { "group_id": 37631, "name": "base2", "show_index": 1 }])
const visible = ref(false)  
const visible2 = ref(false)  
const searchKeyword= ref('')
const buttonTagRef = ref(null)
const toolTipTagVisible = ref(false)
const toolTipTagContent = ref('')

const conditions = reactive({
  group: 0,
  activeTab: '7d',
  isMonitor: false,
  user_chain: 'AllChains',
  sort: '',
  sort_dir: '',
  keyword: '',
  last_tx_time_max: '',
  last_tx_time_min: '',
  last_trade_time: ''
})
const pageData = ref({
  total: 10,
  page: 1,
  pageSize: 10
})
const openTimeList =computed(() => [
  { text:  t('all'), value: '' },
  { text: '≤10min', value: String(10 * 60) },
  { text: '≤30min', value: String(30 * 60) },
  { text: '≤1H', value: String(60 * 60) },
  { text: '≤6H', value: String(60 * 6 * 60) },
  { text: '≤12H', value: String(60 * 12 * 60) },
  { text: '≤24H', value: String(60 * 24 * 60) },
  { text: '≤7D', value: String(60 * 24 * 7 * 60) },
  { text: '≤14D', value: String(60 * 24 * 14 * 60) },
  { text: '≤30D', value: String(60 * 24 * 30 * 60) }
])
const filterForm = ref({
  visible: false,
  type: 'last_trade_time',
  last_trade_time: conditions?.last_trade_time || '',
  sort_dir: conditions?.sort === 'last_trade_time' ? conditions?.sort_dir || null : null
})
const loading = ref(false)
const dataSource = ref([])
onMounted(async () => {
  init()
})
function init() {
  getUserFavoriteGroups()
  getTableList()
}
watch(() => currentAddress.value, (val) => {
  if(!val) return
  getTableList()
})

watch([() => conditions, () => pageData.value.page], (val) => {
   getTableList()
},{deep: true})
async function getUserFavoriteGroups() {
  // let data=[]
  // try {
  //  const res =await getUserFavoriteGroups2()
  // }catch (e) {
  //   console.log('=>(favoriteTable.vue:19) e', e)
  // }
}
function handleConfirmEdit(currentEditGroup: number, remark:string) {
  changeFavoriteGroupName2(remark, currentEditGroup).then(() => {
    ElMessage.success(t('success'))
    followStore.getUserFavoriteGroups2()
  }).catch((e) => {
     ElMessage.error(String(e))
  })
}
function handleAddGroup(name:string) {
   addFavoriteGroup2(name).then(() => {
    ElMessage.success(t('success'))
    followStore.getUserFavoriteGroups2()
  }).catch((e) => {
     ElMessage.error(String(e))
  })
}
function handleDelGroup(groupId: number) {
  // visible.value = false
  // 处理删除逻辑
  console.log('删除分组')
  ElMessageBox.confirm(t('removeFavGroupTips2'), t('tips'), {
    confirmButtonText: t('confirm'),
    cancelButtonText: t('cancel'),
    dangerouslyUseHTMLString: true,
    customClass: '',
  }).then(()=>{
    removeFavoriteGroup2(groupId).then(() => {
      ElMessage.success(t('success'))
      followStore.getUserFavoriteGroups2()
    }).catch((e) => {
       ElMessage.error(String(e))
    })
  })
}

const getTableList = throttle(function() {
   loading.value = true
  const max = Math.floor(new Date().getTime() / 1000)
  const min = safeBigNumber(max).minus(safeBigNumber(filterForm.value.last_trade_time)).toString()
  const last_trade_time= filterForm.value.last_trade_time ?{
    last_tx_time_max: max + 3600,
     last_tx_time_min: min
  }:{}
  getAttentionPageList({...conditions, pageNO: pageData.value.page, pageSize: pageData.value.pageSize, ...last_trade_time}).then((res) => {
    console.log('=>(favoriteTable.vue:64) res', res)
    dataSource.value = ( res.data || []).
    map((i:any) => {
      return {
        ...i,
        group_id:conditions.group,
        total_txs: safeBigNumber(i.total_sold).plus(safeBigNumber(i.total_purchase)).toString(),
        total_txs_usd: safeBigNumber(i.total_sold_usd).plus(safeBigNumber(i.total_purchase_usd)).toString()
      }
    })
    pageData.value.total = res.total || 10
    pageData.value.page = res.pageNO || 1
    pageData.value.pageSize = res.pageSize || 10
  }).finally(() => { 
    loading.value = false
  })
}, 500)

// Add missing tableRowClick method
function tableRowClick(row: { user_address: string; user_chain: string }) {
  // $router.push({
  //   name: 'Balance',
  //   params: { userAddress: row.wallet_address, chain: row.chain },
  // })

  $router.push({
    path: `/address/${row.user_address}/${row.user_chain}`,
  })
}
 function safeBigNumber(value) {
  try {
    // 尝试将值转换为 BigNumber
    const result = new BigNumber(value)

    // 如果结果是 NaN，返回 0
    if (!result.isFinite()) {
      return new BigNumber(0)
    }
    return result
  } catch{
    // 如果发生错误，返回 0
    return new BigNumber(0)
  }
}

function handleFilterQuery(keyword: string = '') {
  visible.value = false
  conditions.keyword = keyword
  searchKeyword.value = keyword
  // getTableList()
}

function handleDeleteAttention(item) {
  deleteAttention({address: currentAddress.value, user_chain: item.chain,user_address: item.user_address}).then(() => {
    ElMessage.success(t('success'))
    getTableList()
  }).catch((e) => {
    ElMessage.error(String(e))
  })
}
const getRowGroupChange = async (val: number, row: any) => {
  await moveFavoriteGroup2({user_chain:row.user_chain, user_address:row.user_address, group:val})
  getTableList()
}

function  handleFilterConfirm(data) {
  console.log('-------attentionHandleFilterConfirm--------', data)
  if (data.last_trade_time) {
    conditions.last_trade_time = data.last_trade_time
  }
  conditions.sort = 'last_tx_time'
  conditions.sort_dir = data.sort_dir || ''
  visible2.value = false
  // this.getAttentionList()
}
 function attentionHandleReset(data) {
  console.log('-------attentionHandleReset--------', data)
  conditions.sort_dir = ''
  conditions.sort = ''
  conditions.last_trade_time = ''
  filterForm.value.last_trade_time = ''
  visible2.value = false
  // this.getAttentionList()
}

function handleSort(val, dir='') {
    console.log('handleSort', val, dir)
      // let filterFormObj = this.filterFormObj[this.activeChain]
      // if (val.type === 'profit_percent_num') {
      //   let profit_obj = filterFormObj?.['profit_percent_num']?.profit_obj
      //   for (let i in profit_obj) {
      //     profit_obj[i].sort_dir = ''
      //   }
      // }
    if (!dir) {
      let sortList = ['desc', 'asc', null]
      if (!val.sort_dir) {
        val.sort_dir = sortList[0]
      } else {
        val.sort_dir = sortList[sortList.indexOf(val.sort_dir) + 1]
      }
      return
    }
    if (val.sort_dir === dir) {
      val.sort_dir = null
    } else {
      val.sort_dir = dir
    }
    // console.log('filterFormObj111', filterFormObj)
}
 function handleSortChange(data) {
  console.log('-------HandleSortChange--------', data)
  if (data.order === null) {
    conditions.sort_dir = ''
    conditions.sort = ''
  } else {
    conditions.sort = data.prop
    if (data.order === 'ascending') {
      conditions.sort_dir = 'asc'
    } else {
      conditions.sort_dir = 'desc'
    }
  }
}
</script>

<style scoped lang="scss">
.el-table{
  font-size: 12px;
}
.w-operate{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 12px;
  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  li.btn {
    display: flex;
    padding: 0 8px;
    height: 24px;
    line-height: 24px;
    cursor: pointer;
    background-color: var(--d-222-l-F2F2F2);
    justify-content: center;
    align-items: center;
    color: var(--d-999-l-666);
    border-radius: 4px;

    &.active {
      color: #f5f5f5;
      background-color: var(--d-333-l-0A0B0C);
    }
  }
}
.color-text-zero {
  color: var(--custom-text-2-color);
}
.fav-icon-color {
  color: var(--a-text-3-color);
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
  /* padding: 80px 0; */
  /* min-height: calc(100vh - 200px); */
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
  color: var(--custom-text-1-color);
  .filter-title {
    font-size: 12px;
    color: var(--a-text-2-color);
  }

  // :deep() .el-input__wrapper {
  //   .el-input__inner{
  //     color: var(--custom-font-1-color);
  //   }
  // }
  :deep() .el-slider__runway {
    --el-slider-button-size: 14px;
    .el-slider__marks {
      .el-slider__marks-text:nth-child(2) {
        transform: translateX(0) !important;
        right: -6px !important;
        left: auto !important;
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

/* .red {
  color: v-bind('$store.getters.downColor[7]');
}
.green {
  color: v-bind('$store.getters.upColor[7]');
} */

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
  /* background: var(--custom-primary-lighter-13-color); */
  padding: 5px 7px;
  border-radius: 6px;
  font-size: 14px;
  color: var(--custom-font-1-color);
  font-family: D-DIN-PRO;
  font-weight: 500;
  white-space: nowrap;
  .svg {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
  &.disabled:hover{
    opacity: 1;
    cursor: not-allowed;
  }
}

.icon-token-container {
  position: relative;
  margin-right: 8px;
  display: flex;
  .token-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
  .icon-chain {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    position: absolute;
    right: -3px;
    bottom: -1px;
    margin: 0;
  }
}
:deep(.el-pagination) {
  justify-content: center;

  button {
    border: 1px solid var(--d-333-l-00008);
    border-radius: 50%;
  }

  ul {
    margin: 0 16px;
  }
}

:deep(.el-pager li.is-active) {
  background: #3F80F7;
  color: #fff;
}

:deep(.el-pager li) {
  border-radius: 6px;
}

:deep() thead{
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  tr{
    th{
      padding-top: 12x;
      padding-bottom: 12px;
    }
  }
  }
.sort-container{
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  height: 14px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  .sort-caret {
    width: 0;
    height: 0;
    border: solid 5px transparent;
    position: absolute;
    left: 7px;
    &.ascending {
      border-bottom-color: var(--el-text-color-placeholder);
      top: -5px;
      &.active {
        border-bottom-color: var(--d-F5F5F5-l-333);
      }
    }
    &.descending {
      border-top-color: var(--el-text-color-placeholder);
      bottom: -3px;
      &.active {
        border-top-color: var(--d-F5F5F5-l-333);
      }
    }
  }
}
</style>
