<template>
  <div class="w-address flex-1 w-100% h-[calc(100%-76px)] flex flex-col" :class="{ 'mt-12px': currentAddress }">
    <ul v-if="currentAddress" class="w-operate">
      <li v-if="evmAddress" class="flex items-center gap-2px">
          <el-checkbox v-model="isMonitor" :label="t('onlyPush')"  style="color:var(--d-999-l-666);z-index: 0" class="[--el-checkbox-checked-text-color:var(--d-F5F5F5-l-333)]! [&&]:[--el-checkbox-input-border:1px_solid_var(--d-666-l-999)]" size="large"/>
          <span class="text-[var(--d-999-l-666)] text-14px" :class="{'text-[var(--d-F5F5F5-l-333)]!':isMonitor}">{{ `${monitorNum}/50` }}</span>
      </li>
      <li class="btn">
        <span @click="followStore.showBatchAddressDetails=true">{{ $t('bulkProcess') }}</span>
      </li>
      <li>
        <el-radio-group v-model="conditions.time_interval" size="small" :fill="isDark?'#111':'#fff'" :text-color="isDark?'#F5F5F5':'#333'" @change="()=>{}">
          <el-radio-button label="7D" :value="'7d'" />
          <el-radio-button label="1M" :value="'30d'" />
        </el-radio-group>
      </li>
    </ul>
    <div v-if="currentAddress" class="m-header flex-between px-16px items-start">
      <pro-groups v-if="!isMonitor" v-model="conditions.group" :options="addressGroups" @onConfirm="handleConfirmEdit" @onDelete="handleDelGroup" @onAdd="handleAddGroup" @onChangeIndex="handleChangeIndex"/>
      <!-- <div v-else/> -->
    </div>
    <div class="m-table w-100% mt-12px flex-1 overflow-hidden">
      <el-table
      ref="tableRef" v-loading="loading" class='' :data="filterDataSource" table-layout="fixed" row-class-name="group" height="calc(100% - 72px)"
      :default-sort="defaultSort" @sort-change="handleSortChange" @row-click="tableRowClick">
        <template #empty>
          <div v-if="!loading && followStore.currentAddress" class="flex flex-col items-center justify-center py-30px">
            <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg">
            <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg">
            <span>{{ t('emptyNoData') }}</span>
          </div>
          <AveEmpty
            v-else-if="!followStore.currentAddress"
            :style="{height:`100%`}"
            class="overflow-hidden"
          >
            <span class="text-12px mt-10px">{{ $t('noWalletTip') }}</span>
            <el-button
              class="mt-10px"
              type="primary"
              @click="botStore.$patch({
              connectVisible: true
            })"
            >
              {{ $t('connectWallet') }}
            </el-button>
          </AveEmpty>
          <span v-else />
        </template>
        <el-table-column :label="$t('wallet2')" width="210" fixed="left">
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
                class="text-10px cursor-pointer ml-4px mt--2px"
                @click.stop.prevent="handleFilterQuery()"
              />
            <el-popover
              v-else
              v-model:visible="visible"
              placement="bottom-start"
              popper-class="chains-table-filter"
              title=""
              :width="320"
              trigger="click"
            >
              <template #reference>
                 <Icon
                  id="custom-filter"
                  name="custom:filter"
                  class="text-10px cursor-pointer ml-4px mt--2px"
                  @click.stop.prevent="handleFilterQuery()"
                />
              </template>
              <template #default>
                <div class="filter-box" :class="mode">
                  <div>{{ $t('attentionSearch') }}</div>
                  <div class="flex mt-10px">
                    <el-input
                      v-model.trim="searchKeyword"
                      size="large"
                      :placeholder="$t('attentionSearch')"
                      clearable
                      @clear="handleFilterQuery()"
                    />
                  </div>
                  <div class="mt-20px flex">
                    <el-button
                      class="flex-1 [&&]:[--el-color-black:#333] bg-[var(--d-333-l-F2F2F2)]"
                      :color="isDark?'#333':'#F2F2F2'"
                      style="height: 32px; min-width: 70px; --el-button-font-weight: 400"
                      @click.stop="searchKeyword='';visible=false"
                    >
                      {{ $t('cancel') }}
                    </el-button>
                    <el-button
                      class="flex-1"
                      size="default"
                      type="primary"
                      color="#3F80F7"
                      style="height: 32px; min-width: 70px; --el-button-font-weight: 400"
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
              <span v-if="$index < 9" class="text-10px" style="opacity: 0">0</span>
              <span class="text-10px mr-5px font-400 text-[--d-666-l-999]">
                #{{ (pageData.page - 1) * pageData.pageSize + $index + 1 }}
              </span>
              <!-- <a href class="mr-5px a-gray fav_address" v-if="row.is_wallet_address_fav == 1" @click.stop.prevent="handleDeleteAttention(row)">
                    <i class="attention iconfont icon-fav1 active font-12"></i> -->
              <Icon
                 v-if="!isMonitor"
                name="custom:attention"
                :class="`cursor-pointer mr-8px ${row.is_wallet_address_fav == 1
                      ?'color-#f45469'
                      :'color-[--d-666-l-696E7C]'} text-12px hover:color-#f45469`"
                @click.self.stop="handleDeleteAttention(row)"
              />
               <UserAvatar :key="`${row.user_address}-${row.user_chain}`" class="mr-10px" :wallet_logo="row.wallet_logo" :address="row.user_address" :chain="row.user_chain" iconSize="32px" />
              <div class="flex flex-col justify-between h-32px">
                <UserRemark :key="`${row.user_address}-${row.user_chain}`"  :remark="row.remark" :address="row.user_address" :chain="row.user_chain" addressClass="token-symbol ellipsis py-0px! text-14px lh-none" addressStyle="max-width: 85px" :iconEditColor="isDark?'#666':'#999'"  iconEditSize="10px" showAddressTitle :formatAddress="(address) =>address?.slice(0, 4) + '...' + address?.slice(-4)"/>
                <div class="font_10 color-icon flex-start mt_4" style="line-height: 1">
                  <Icon
                    v-copy="row.user_address"
                    name="bxs:copy"
                    class="text-10px cursor-pointer color-[--d-666-l-999]"
                    @click.stop.prevent
                  />
                  <div v-if="row?.extra?.length > 0" class="media-list flex-start">
                    <template v-for="(item, index) in row?.extra" :key="index">
                      <div
                        v-if="item?.tip"
                        class="ml-5"
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
                          >
                        </span>
                      </div>
                    </template>
                  </div>
                  <template v-if="row?.signal_arr?.length > 0">
                    <div
                      v-for="(i, index) in row.signal_arr"
                      :key="index"
                      class="flex"
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
                          <img class="token-icon-signal-tag" src="/icon-default.png" >
                        </template>
                        <template #placeholder>
                          <img class="token-icon-signal-tag" src="/icon-default.png" >
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
        :label="conditions.time_interval === '7d' ? $t('7dPnL') : $t('30dPnL')"
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
              <span v-if="row?.total_profit_ratio > 0" :class="`color-${upColor[0]}`">
                {{ formatNumber2(row?.total_profit_ratio * 100 || 0,2) }}%
              </span>
              <span v-else-if="row?.total_profit_ratio < 0" :class="`color-${downColor[0]}`">
                {{ formatNumber2(row?.total_profit_ratio * 100 || 0,2) }}%
              </span>
              <span v-else class="color-text-zero">0</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- 30dWinRate -->
      <el-table-column
        align="right"
        :label="conditions.time_interval === '7d' ? $t('7dWinRate') : $t('30dWinRate')"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="total_win_ratio"
        min-width="100px"
      >
        <template #default="{ row }">
          <div :class="!row?.total_win_ratio ? 'color-text-zero' : ''">
            <span v-if="row?.total_win_ratio > 0" :class="`color-${upColor[0]}`">
              {{ formatNumber2(row?.total_win_ratio || 0, 2) }}%
            </span>
            <span v-else-if="row?.total_win_ratio < 0" :class="`color-${downColor[0]}`">
              {{ formatNumber2(row?.total_win_ratio || 0, 2) }}%
            </span>
            <span v-else class="color-text-zero">0</span>
          </div>
        </template>
      </el-table-column>

      <!-- 30dVolume -->
      <el-table-column
        align="right"
        :label="conditions.time_interval === '7d' ? $t('7dVolume') : $t('30dVolume')"
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
        :label="conditions.time_interval === '7d' ? $t('7dTrades') : $t('30dTrades')"
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
<!-- last_tx_time -->
      <el-table-column
        align="right" width="130">
        <template #header>
          <div class="flex items-center flex-end">
            <div
              class="flex flex-end cursor-pointer"
              style="cursor: pointer"
              @click="handleSort(conditions,'','last_tx_time')"
            >
              <span class="filter-title">{{ $t('lastTxsTime1') }}</span>
              <div class="sort-container">
                <i
                  :class="['sort-caret ascending',(conditions.sort_dir === 'asc'&&conditions.sort==='last_tx_time') ? 'active' : '']"
                  @click.stop="handleSort(conditions,'asc','last_tx_time')" />
                <i
                  :class="['sort-caret descending',(conditions.sort_dir === 'desc'&&conditions.sort==='last_tx_time') ? 'active' : '']"
                  @click.stop="handleSort(conditions,'desc','last_tx_time')" />
              </div>
            </div>
            <el-popover
              v-model:visible="visible2"
              placement="bottom"
              popper-class="chains-table-filter"
              title=""
              :width="220"
              trigger="click"
              >
              <template #reference>
                <Icon
                    name="custom:filter" class="text-10px inline-block mt--2px"  :style="{
                    color: (conditions?.last_trade_time) ? 'var(--d-F5F5F5-l-333)' : ''
                }" @click.stop.prevent/>
              </template>
              <template #default>
                <div class="filter-box" :class="mode">
                  <div class="text-12px font-500 text-[--d-999-l-666] mb-8px">{{ $t('lastTxsTime1') }}</div>
                  <ul class="flex flex-col font-500 text-12px text-var(--d-E9E9E9-l-333) gap-8px">
                    <li
                      v-for="(item, index) in openTimeList"  :key="index" class="flex-center hover:border-[--d-F5F5F5-l-333] cursor-pointer border-[var(--d-333-l-F2F2F2)] border-solid border h-32px border-rd-4px" :class="[filterForm.last_trade_time == item.value?'bg-[--d-333-l-F2F2F2] ':'']" @click.stop.prevent="filterForm.last_trade_time = item.value"
                    >
                      <span>{{ item.text }}</span>
                      <!-- <div class="flex-1"/> -->
                      <!-- <Icon v-if="filterForm.last_trade_time == item.value" name="material-symbols:check" class="text-12px"/> -->
                    </li>
                  </ul>
                  <div class="mt-11px flex-between gap-4px">
                    <!-- <div
                      class="flex items-center clickable"
                      style="cursor: pointer"
                      @click="handleSort(filterForm)"
                    >
                      <span class="filter-title">{{ $t('sort') }}</span>
                      <div class="sort-container">
                        <i
                          :class="['sort-caret ascending',filterForm.sort_dir === 'asc' ? 'active' : '']"
                          @click.stop="handleSort(filterForm, 'asc')" />
                        <i
                          :class="['sort-caret descending',filterForm.sort_dir === 'desc' ? 'active' : '']"
                          @click.stop="handleSort(filterForm, 'desc')" />
                      </div>
                    </div> -->
                    <el-button
                      style="
                        height: 30px;
                        --el-button-font-weight: 400;
                        flex:1;
                        color: #999;
                      "
                      :color="mode !== 'dark' ? '#f2f2f2' : '#333333'"
                      @click.stop="attentionHandleReset(filterForm)"
                    >
                      {{ $t('reset') }}
                    </el-button>
                    <el-button
                      type="primary"
                      style="height: 30px; --el-button-font-weight: 400; flex:1;"
                      @click.stop="handleFilterConfirm(filterForm)"
                    >
                      {{ $t('confirm') }}
                    </el-button>
                  </div>
                </div>
              </template>
            </el-popover>
          </div>
        </template>
        <template #default="{ row,$index}">
          <div
            :style="{
              color:
                Number(formatTimeFromNow(row?.last_tx_time, true)) <= 600
                  ? '#FFA622'
                  : 'var(--custom-text-2-color)'
            }"
          >
             <span v-if="!row?.last_tx_time" class="color-text-zero">-</span>
            <TimerCount
               v-else-if="
                Number(formatTimeFromNow(row?.last_tx_time, true)) < 60
              "
              :key="`${row.last_tx_time}${$index}`"
              :timestamp="row.last_tx_time"
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
      <!-- addrGroup -->
      <el-table-column v-if="!isMonitor" :label="t('addrGroup')" align="right" width="160px">
        <template #default="{ row }">
          <el-select v-model="row.group_id" class="[&&]:[--el-text-color-regular:var(--d-222-l-333)] [&&]:[--el-select-width:100px]" popper-class="w-193px" filterable @click.stop @change="(val) => getRowGroupChange(val, row)">
            <el-option :key="0" :value="0" :label="$t('defaultGroup')"/>
            <el-option v-for="item in addressGroups" :key="item.group_id" :label="item.name" :value="item.group_id" />
          </el-select>
        </template>
      </el-table-column>
       <el-table-column :label="t('push')" align="right" :width="!isMonitor ? 150 : 180" fixed="right">
        <template #default="{ row ,$index}">
          <div class="flex flex-row-reverse  items-center" @click.stop>
            <a
              class="flex items-center color-[var(--d-F5F5F5-l-333)]"
              :href="`https://t.me/AveSniperBot?start=fs-${row.user_chain}-${row.user_address}`" target="_blank">
              <Icon name="custom:documentary-wallet" class="text-16px mr-2px" />
              {{ t('copyTrade') }}
            </a>
            <!-- 监控 -->
             <div v-if="isMonitor" class="color-[var(--d-F5F5F5-l-333)] mr-12px cursor-pointer flex-start" @click.stop.prevent="handleDeleteMonitor(row)">
               <Icon  name="bx:bxs-trash-alt" class="text-13px mr-5px mb-1px"/>
               {{ t('delete') }}
             </div>
            <div
              v-if="row?.user_chain === 'solana' || row?.user_chain === 'bsc'"
              class="flex items-center mr-12px cursor-pointer color-[var(--d-999-l-666)] group-hover:color-[var(--d-F5F5F5-l-333)]" @click="handleMonitor(row,$index)">
              <Icon v-if="!isMonitor ? (row?.is_monitored === 1 ):(row?.is_pause === 0 )" name="custom:monitor2-icon" class="text-12px mr-5px" :class="[(!isMonitor ? (row?.is_monitored === 1 ):(row?.is_pause === 0 ))&&'color-[var(--d-F5F5F5-l-333)]']"/>
              <Icon v-else name="custom:monitor-icon" class="text-15px mr-2px mb-1px"/>
              <span
                class="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-[100px] transition-all duration-500 ease-in-out">
                {{ (!isMonitor ? (row?.is_monitored === 1 ):(row?.is_pause === 0 ))? t('pause') : t('enable') }}
              </span>
            </div>
            <div class="flex items-center mr-12px color-[var(--d-666-l-CCC)] cursor-not-allowed" v-else>
              <Icon name="custom:monitor-icon" class="text-15px mr-2px mb-1px" />
            </div>
          </div>
        </template>
      </el-table-column>
      </el-table>
      <el-pagination
        v-if="(pageData.total > 50) && shouldRenderChild"
        v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize" class="h-72px flex justify-end items-center"
        layout="prev, pager, next, ->" :total="pageData.total" :page-sizes="[10, 20, 30, 40, 50, 60]" @change="getTableList"/>
    </div>
     <el-tooltip
      ref="tooltipRef1"
      :visible="toolTipTagVisible"
      :content="toolTipTagContent"
      placement="top"
      :popper-class="mode"
      effect="customized"
      :virtual-ref="buttonTagRef || undefined"
      virtual-triggering
    />
  </div>
</template>

<script setup lang="ts">
import ProGroups from '../components/proGroups.vue'
import BigNumber from 'bignumber.js'
import { downColor, upColor } from '@/utils/constants'
import {
  formatIconTag, getTagTooltip
} from '@/utils/index'
import { throttle } from 'lodash-es'
import { getAttentionPageList, changeFavoriteGroupName2, addFavoriteGroup2, removeFavoriteGroup2, moveFavoriteGroup2, deleteAttention ,changeIndexFavoriteGroup2 ,monitorAddresses,addAddressMonitor,favUsersResumeMonitor,favUsersPauseMonitor,deleteMonitor} from '~/api/attention'
import type { TableInstance } from 'element-plus'

const { mode, isDark } = storeToRefs(useGlobalStore())
const followStore = useFollowStore()
const $router = useRouter()
const { t } = useI18n()
const botStore = useBotStore()
const {evmAddress} = storeToRefs(useBotStore())
const { addressGroups ,currentAddress,updateNum1,updateNum2,updateNum3,addressConditions,addressConditions2} = storeToRefs(useFollowStore())
// const addressGroups = ref([{ "group_id": 3763, "name": "base", "show_index": -1 }, { "group_id": 37632, "name": "base1", "show_index": 0 }, { "group_id": 37631, "name": "base2", "show_index": 1 }])
const visible = ref(false)
const visible2 = ref(false)
const searchKeyword= ref('')
const buttonTagRef = ref<HTMLElement | undefined>(undefined)
const toolTipTagVisible = ref(false)
const toolTipTagContent = ref('')
const addButtonRef = ref()
const tableRef = ref<TableInstance | null>(null)
const isMonitor=ref(false)
const conditions=computed(() => {
  return isMonitor.value?addressConditions2.value:addressConditions.value
})

const defaultSort=computed(() => {
  return { prop: conditions.value?.sort||'', order: conditions.value?.sort_dir==='desc'?'descending':'ascending' }
}) as Ref<{ prop: string, order: 'descending' | 'ascending' }>

const shouldRenderChild = shallowRef(true)

const reCreateChild = () => {
  shouldRenderChild.value = false
  // 确保 DOM更新
  nextTick(() => {
    shouldRenderChild.value = true
  })
}
const monitorNum=ref(0)

const pageData1 = ref({
  total: 10,
  page: 1,
  pageSize: 50
})
const pageData2 = ref({
  total: 10,
  page: 1,
  pageSize: 50
})

const pageData=computed(() => {
  return isMonitor.value?pageData2.value:pageData1.value
})

const openTimeList =computed(() => [
  { text:  t('all'), value: '' },
  { text: '≤10min', value: String(10 * 60) },
  { text: '≤30min', value: String(30 * 60) },
  { text: '≤1H', value: String(60 * 60) },
  // { text: '≤6H', value: String(60 * 6 * 60) },
  { text: '≤12H', value: String(60 * 12 * 60) },
  { text: '≤24H', value: String(60 * 24 * 60) },
  { text: '≤7D', value: String(60 * 24 * 7 * 60) },
  // { text: '≤14D', value: String(60 * 24 * 14 * 60) },
  { text: '≤30D', value: String(60 * 24 * 30 * 60) }
])
type FilterFormType = {
  type: string
  last_trade_time: string
  sort_dir: string|null
}

const filterForm = ref({
  type: 'last_trade_time',
  last_trade_time: conditions.value?.last_trade_time || '',
  sort_dir: conditions.value?.sort === 'last_trade_time' ? conditions?.value?.sort_dir || null : null
} as FilterFormType)
const loading = ref(false)
const dataSource = ref([] as Array<any>)
const dataSource2 = ref([] as Array<any>)


const filterDataSource=computed(() => {
  return isMonitor.value?dataSource2.value:dataSource.value
})

onMounted(async () => {
  init()
  getMonitorNum()
})

function init() {
  pageData.value.total = 10
  pageData.value.page = 1
  pageData.value.pageSize = 50
  getTableList()
}

watch(() => currentAddress.value, (val) => {
  if(!val) {
    dataSource.value=[]
    dataSource2.value=[]
  }else{
    init()
  }
})
watch([() => conditions.value, ()=>updateNum2.value+updateNum3.value,()=>isMonitor.value], (value, oldValue) => {
  init()
  if(value[2]!==oldValue[2]){
    nextTick(()=>{
      tableRef.value?.clearSort()
      tableRef.value?.sort(defaultSort.value?.prop, defaultSort.value?.order)
    })
  }
},{deep: true})

function handleDeleteMonitor(row:any){
  deleteMonitor({
    uid: row.id,
    address: row.user_address
  }).then(() => {
    ElMessage.success(t('success'))
    updateNum1.value++
    init()
  })
}


const handleMonitor = throttle((row:any,index:number=0) => {
  console.log('handleMonitor', row, index)
  if (!evmAddress.value) return ElMessage.warning(t('noBotWalletTip'))
  if(isMonitor.value||(!isMonitor.value&&(row.is_monitored === 1))) {
    const {id,user_address} = row
    // 取消监控
    const req=row.is_pause === 1?favUsersResumeMonitor:favUsersPauseMonitor
    req({
      uid: id,
      address:user_address
    }).then(() => {
      if(isMonitor.value){
        dataSource2.value[index].is_pause = row.is_pause===0?1:0
      }else{
        dataSource.value[index].is_monitored = row.is_monitored===0?1:0
      }
      // dataSource.value[index].is_pause = row.is_pause===0?1:0
      getTableList()
      updateNum1.value++
      ElMessage.success(t('success'))
    }).catch((e) => { ElMessage.error(String(e)) })
    return
  }else{
    const {user_address,user_chain} = row
    addAddressMonitor({
      address: user_address,
      chain: user_chain,
      user_address: evmAddress.value,
    }).then(() => {
      dataSource.value[index].is_monitored = row.is_monitored===0?1:0
      getTableList()
      ElMessage.success(t('success'))
      getMonitorNum()
      updateNum1.value++
    }).catch((e) => {
        ElMessage.error(String(e))
    })
  }
},1000)

function handleConfirmEdit(currentEditGroup: number, remark:string) {
  changeFavoriteGroupName2(remark, currentEditGroup).then(() => {
    ElMessage.success(t('success'))
    followStore.getUserFavoriteGroups2()
  }).catch((e) => {
     ElMessage.error(String(e))
  })
}
function handleAddGroup(name:string) {
   if(followStore.addressGroups.map(i=>i.name).includes(name)){
    ElMessage.error(t('groupExistT'))
  }else{
    addFavoriteGroup2(name).then(() => {
     ElMessage.success(t('success'))
     followStore.getUserFavoriteGroups2()
   }).catch((e) => {
      ElMessage.error(String(e))
   })
  }
}

function handleChangeIndex(groupIds: number[]) {
  // visible.value = false
  // 处理修改排序逻辑
  console.log('修改分组排序', groupIds)
  changeIndexFavoriteGroup2(groupIds).then(() => {
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
      if(conditions.value.group==groupId){
        conditions.value.group=0
      }
    }).catch((e) => {
       ElMessage.error(String(e))
    })
  })
}
function getMonitorNum() {
  if(!botStore.evmAddress) return
  monitorAddresses(conditions).then((res) => {
    monitorNum.value = res.total
  })
}
const getTableList = throttle(function() {
  console.log('getTableList')
  loading.value = true
  const max = Math.floor(new Date().getTime() / 1000)
  const min = safeBigNumber(max).minus(safeBigNumber(filterForm.value.last_trade_time)).toString()
  const last_trade_time= filterForm.value.last_trade_time ?{
    last_tx_time_max: max + 3600,
     last_tx_time_min: min
  }:{}
  const req=isMonitor.value?monitorAddresses: getAttentionPageList
  // monitorAddresses({...conditions, pageNO: pageData.value.page, pageSize: pageData.value.pageSize, ...last_trade_time}).then((res) => {
  //   console.log('monitorAddresses res', res)
  // })
  req({...conditions.value, pageNO: pageData.value.page, pageSize: pageData.value.pageSize, ...last_trade_time}).then((res) => {
    console.log('getAttentionPageList res',isMonitor.value, res)
    const tableData =isMonitor.value?dataSource2:dataSource
    tableData.value = ( res.data || []).
    map((i:any) => {
      return {
        ...i,
        group_id:conditions.value.group,
        total_txs: safeBigNumber(i.total_sold).plus(safeBigNumber(i.total_purchase)).toString(),
        total_txs_usd: safeBigNumber(i.total_sold_usd).plus(safeBigNumber(i.total_purchase_usd)).toString()
      }
    })
    pageData.value.total = res.total || 0
    pageData.value.page = res.pageNO || 1
    pageData.value.pageSize = res.pageSize || 50
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
 function safeBigNumber(value:string|number) {
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
  conditions.value.keyword = keyword
  searchKeyword.value = keyword
}

function handleDeleteAttention(item:any) {
  deleteAttention({address: currentAddress.value, user_chain: item.user_chain,user_address: item.user_address}).then(() => {
    ElMessage.success(t('success'))
    getTableList()
    updateNum1.value++
  }).catch((e) => {
    ElMessage.error(String(e))
  })
}
const getRowGroupChange = async (val: number, row: any) => {
  await moveFavoriteGroup2({user_chain:row.user_chain, user_address:row.user_address, group:val})
  updateNum1.value++
  getTableList()
}

function  handleFilterConfirm(data: FilterFormType) {
  if (data.last_trade_time) {
    conditions.value.last_trade_time = data.last_trade_time
  }
  // conditions.value.sort = 'last_tx_time'
  // conditions.value.sort_dir = data.sort_dir || ''
  visible2.value = false
  // const sortOrder = {
  //   'desc': 'descending',
  //   'asc': 'ascending'
  // }[data.sort_dir || ''] || null
  // tableRef.value?.sort('last_tx_time', sortOrder as string)
}
 function attentionHandleReset(data:FilterFormType) {
  console.log('-------attentionHandleReset--------', data)
  conditions.value.last_trade_time = ''
  filterForm.value.last_trade_time = ''
  visible2.value = false
  // tableRef.value?.clearSort()
}

function handleSort(val:any, dir='',sort:string) {
    tableRef.value?.clearSort()
    if (!dir) {
      const sortList = ['desc', 'asc', null]
      if (!val.sort_dir) {
        val.sort_dir = sortList[0]
      } else {
        val.sort_dir = sortList[sortList.indexOf(val.sort_dir) + 1]
      }
      if(sort){
        val.sort=sort
      }
      return
    }
    if (val.sort_dir === dir) {
      val.sort_dir = null
    } else {
      val.sort_dir = dir
    }
    if(sort){
      val.sort=sort
    }
    // console.log('filterFormObj111', filterFormObj)
}
 function handleSortChange(data: {prop: string, order: string|null}) {
  console.log('-------HandleSortChange--------', data)
  if (data.order === null) {
    conditions.value.sort_dir = ''
    conditions.value.sort = ''
  } else {
    conditions.value.sort = data.prop
    if (data.order === 'ascending') {
      conditions.value.sort_dir = 'asc'
    } else {
      conditions.value.sort_dir = 'desc'
    }
  }
  if (data.prop === 'last_tx_time') {
    filterForm.value.sort_dir = conditions.value.sort_dir
  }
}
function openFavPop() {
  followStore.confirmAttention(addButtonRef.value,(form)=>{
    console.log('confirmAttention', form)
    return Promise.resolve()
  })
}
</script>

<style scoped lang="scss">
:deep().el-radio-group{
  padding: 2px;
  background: var(--d-222-l-F2F2F2);
  border-radius: 4px;
  .el-radio-button__inner{
    background: var(--d-222-l-F2F2F2);
    border: none;
    color: var(--d-666-l-999);
    font-weight: 500;
  }
}
.el-table{
  font-size: 12px;
}
.w-operate{
  position: absolute;
  top: 13px;
  right: 0;
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 12px;
  padding-right: 16px;
  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  li :deep() .el-checkbox__input{
    margin-top: 2px;
  }
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
  color: #666;
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
  :deep() .el-input {
    --el-input-border-color: #444444;
    --el-input-placeholder-color: var(--d-666-l-999);
    --el-text-color-placeholder: #999;
    --el-input-bg-color: var(--d-333-l-F2F2F2)
  }
  :deep() .el-button {
    --el-border:none;
  }
  :deep() .el-input__wrapper {
    border: none;
    border-radius: 6px;
    box-shadow: none;

    &:hover {
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
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
  height: 10px;
  width: 24px;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  .sort-caret {
    width: 0;
    height: 0;
    border: solid 4px transparent;
    position: absolute;
    left: 7px;
    &.ascending {
      border-bottom-color: var(--d-666-l-999);
      top: -5px;
      &.active {
        border-bottom-color: var(--d-F5F5F5-l-333);
      }
    }
    &.descending {
      border-top-color:  var(--d-666-l-999);
      bottom: -3px;
      &.active {
        border-top-color: var(--d-F5F5F5-l-333);
      }
    }
  }
}
:deep() .el-table.el-table thead .el-table__cell{
  height: 40px;
}
:deep() .el-table .cell{
  line-height: 22px;
}
:deep() .el-table .el-table__cell{
  &:first-child>.cell{
    padding-left: 16px;
  }
  &:last-child>.cell{
    padding-right: 16px;
  }
}
:deep() .el-table{
  --el-table-text-color: var(--d-CCC-l-333);
  .caret-wrapper{
    height: 10px;
    .sort-caret{
      border-width: 4px;
    }
  }
}
</style>
