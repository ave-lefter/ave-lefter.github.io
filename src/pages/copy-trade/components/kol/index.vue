<template>
    <div class="w-full">
      <el-table
        ref="tableRef"
        :key="tableIndex"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="{ fontSize: '12px' }"
        fit
        :style="{height:`${scrollbarHeight}`}"
        :default-sort="{
          prop: conditions.sort,
          order: conditions.sort_dir ? conditions.sort_dir + 'ending' : null
        }"
        @row-click="tableRowClick"
        @sort-change="handleSortChange"
      >
        <template #empty>
          <div v-if="!loading && tableData?.length ==0" class="table-empty">
            <AveEmpty />
          </div>
          <span v-else />
        </template>
        <el-table-column
        width="225"
        fixed="left"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="last_trade_time"
        >
          <template #header>
            <span class="text-10px" style="opacity: 0">0</span>
            <span>{{ $t('wallet2')+'/'+ $t('lastTxsTime1') }}</span>
            <el-popover
              v-if="activeTab === 'kol'"
              v-model:visible="filterForm['keyword'].visible"
              placement="bottom"
              popper-class="chains-table-filter"
              title=""
              :width="220"
              trigger="click"
            >
              <template #reference>
                <Icon
                    id="custom-search"
                    name="custom:search"
                    class="text-12px w-12px h-12px cursor-pointer ml-3px"
                    @click.stop.prevent
                  />
              </template>
              <template #default>
                <div class="text-14px text-[var(--main-text)]">{{$t('searchKol')}}</div>
                <el-input v-model="filterForm['keyword'].keyword" class="mt-8px" :placeholder="$t('searchKolPlaceholder')" clearable />
                <div class="mt-12px flex items-center justify-center">
                    <el-button
                      class="flex-1 reset"
                      size="default"
                      style="
                        height: 30px;
                        min-width: 70px;
                        --el-button-font-weight: 400;
                      "
                      @click.stop="handleReset(filterForm['keyword'])"
                    >
                      {{ $t('cancel') }}
                    </el-button>
                    <el-button
                      class="confirm flex-1"
                      size="default"
                      :color="mode !== 'dark' ? '#222222' : '#f5f5f5'"
                      @click.stop="handleFilterConfirm(filterForm['keyword'])"
                    >
                      {{ $t('confirm') }}
                    </el-button>
                  </div>
              </template>
            </el-popover>
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
                      color: isActiveFilter('last_trade_time') ? 'var(--third-text)' : ''
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
                      class="flex-1 reset"
                      size="default"
                      style="
                        height: 30px;
                        min-width: 70px;
                        --el-button-font-weight: 400;
                      "
                      @click.stop="handleReset(filterForm['last_trade_time'])"
                    >
                      {{ $t('reset') }}
                    </el-button>
                    <el-button
                      class="confirm flex-1"
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
              <span v-if="$index < 9" style="opacity: 0" class="text-10px">0</span>
              <span class="text-10px color-[--third-text]">
                #{{ (pageNO - 1) * pageSize + $index + 1 }}
              </span>
              <Icon
                v-if="shouldRenderChild"
                :ref="(el: any) => $refs.buttonRefs[$index] = el" name="custom:attention"
                :class="row.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[--third-text]'" class="text-14px clickable shrink-0 mr-5px ml-8px" @click.stop.prevent="collect(row,$index)" />

              <UserAvatar class="mr-10px" iconSize="32px" iconChainSize="14px" :wallet_logo="{...(row?.wallet_logo || {}), url: row?.wallet_logo?.url || row?.twitter_url, logo: row?.wallet_logo?.logo || row?.avatar_url}" :address="row.wallet_address" />
              <div>
                <div class="flex-start">
                  <UserRemark addressClass="token-symbol ellipsis" addressStyle="max-width: 70px" showAddressTitle :address="row.wallet_address" :chain="row.chain" :remark="row.remark || row.nickname" :wallet_logo="row.wallet_logo" :formatAddress="a=> '*' + a?.slice(-5)" @updateRemark="({remark}) => row.remark = remark"/>
                  <img  v-if="activeTab === 'kol'" style="width: 12px; height: 12px; margin-left: 8px;" src="@/assets/images/x.png" alt="" srcset="" @click.stop="goLink1(row?.wallet_logo?.url)">
                </div>
                <div class="text-10px color-icon flex-start mt-4px color-[--third-text]" style="line-height: 1">
                  <div
                    class="mr-5px"
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
                  {{ row.wallet_address.slice(0, 4) }}...{{ row.wallet_address.slice(-4) }}
                  <Icon
                    v-copy="row.wallet_address"
                    name="bxs:copy"
                    class="text-12px cursor-pointer color-[--third-text] ml-5px"
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
                          <img
                            :src="require(`@/assets/images/${item.img}.png`)"
                            :alt="item.img"
                            width="10"
                          >
                        </span>
                      </div>
                    </template>
                  </div>
                  <template v-if="row.signal_arr?.length > 0">
                    <div
                      v-for="(i, index) in row.signal_arr"
                      :key="index"
                      class="flex"
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
        <el-table-column
          align="right"
          label="Pnl"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="total_profit"
          min-width="100px"
        >
        <template #header>
          <span class="bg-[--tab-active-bg] color-[--main-text] rounded-2px px-2px mr-2px text-12px">{{ activeInterval }}</span>
          <span>Pnl</span>
        </template>
          <template #default="{ row }">
            <div>
              <div :class="!row?.total_profit ? 'color-text-3' : ''">
                ${{ row?.total_profit > 0 ? formatNumber(row?.total_profit || 0, 0) : 0 }}
              </div>
              <div class="text-12px">
                <span v-if="row?.total_profit_rate > 0" class="green">
                  {{ formatNumber(row?.total_profit_rate * 100 || 0) }}%
                </span>
                <span v-else-if="row?.total_profit_rate < 0" class="red">
                  {{ formatNumber(row?.total_profit_rate * 100 || 0) }}%
                </span>
                <span v-else class="color-[--third-text]">0</span>
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
          :min-width="110"
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
          :label="$t('volume4')"
          :min-width="150"
        >
        <template #header>
          <div class="flex-end pr-7px">
            <div
              class="flex-end cursor-pointer select-none"
              @click.stop="switchSort('total_volume')"
            >
              {{ $t('vol') }}
              <div class="flex flex-col items-center justify-center ml-5px">
                <i
                  class="w-0 h-0 border-solid border-5px border-transparent cursor-pointer"
                  :class="conditions.sort == 'total_volume' &&  conditions.sort_dir == 'asc' ? 'border-b-[--main-text]' : 'border-b-[--third-text]'"
                  @click.stop="switchSort('total_volume', -1)"
                />
                <i
                  class="w-0 h-0 border-solid border-5px border-transparent mt-2px cursor-pointer"
                  :class="conditions.sort == 'total_volume' &&  conditions.sort_dir == 'desc' ? 'border-t-[--main-text]' : 'border-t-[--third-text]'"
                  @click.stop="switchSort('total_volume', 1)"
                />
              </div>
            </div>
            <span class="ml-3px mr-3px">/</span>
            <div
              class="flex-end cursor-pointer select-none"
              @click.stop="switchSort('total_trades')"
            >
              {{ $t('Txs') }}
              <div class="flex flex-col items-center justify-center ml-5px">
                <i
                  class="w-0 h-0 border-solid border-5px border-transparent cursor-pointer"
                  :class="conditions.sort == 'total_trades' &&  conditions.sort_dir == 'asc' ? 'border-b-[--main-text]' : 'border-b-[--third-text]'"
                  @click.stop="switchSort('total_trades', -1)"
                />
                <i
                  class="w-0 h-0 border-solid border-5px border-transparent mt-2px cursor-pointer"
                  :class="conditions.sort == 'total_trades' &&  conditions.sort_dir == 'desc' ? 'border-t-[--main-text]' : 'border-t-[--third-text]'"
                  @click.stop="switchSort('total_trades', 1)"
                />
              </div>
            </div>
          </div>
        </template>
          <template #default="{ row ,$index}">
            <div
              :ref="(el: any) => $refs.currentBtnRef[$index] = el"
              class="flex-end"
              @mouseenter="showPopover(row, $index)"
              @mouseleave="showPop = false"
             >
             <div class="cursor-pointer">
              <div  class="hover-dot" :class="!row?.total_volume ? 'color-[--third-text]' : ''">
                ${{
                  row?.total_volume > 0 ? formatNumber(row?.total_volume || 0, 2) : 0
                }}
              </div>
              <span class="hover-dot text-12px" :class="!row?.total_trades ? 'color-[--third-text]' : 'color-[--secondary-text]'">
                {{
                  row?.total_trades > 0 ? formatNumber(row?.total_trades || 0, 2) : 0
                }}
              </span>
             </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          :label="$t('score')"
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="rank_score"
          :min-width="110"
        >
        <template #header>
          <span class="bg-[--tab-active-bg] color-[--main-text] rounded-2px px-2px mr-2px text-12px">{{ activeInterval }}</span>
          <span>{{ $t('score') }}</span>
        </template>
        <template #default="{ row }">
            {{row.rank_score?.toFixed(2) ?? 0}}
          </template>
        </el-table-column>

        <el-table-column align="right" :min-width="200">
          <template #header>
            <span class="bg-[--tab-active-bg] color-[--main-text] rounded-2px px-2px mr-2px text-12px">{{ activeInterval }}</span>
            <span>{{ $t('profit4') }}</span>
            <el-popover
              v-model:visible="filterForm['profit_percent_num'].visible"
              placement="bottom"
              popper-class="chains-table-filter"
              title=""
              :width="220"
              trigger="click"
              teleported
            >
              <template #reference>
                <Icon
                    id="custom-filter"
                    name="custom:filter"
                    class="text-10px cursor-pointer  ml-3px mr-7px"
                    :style="{
                      color: isActiveFilter('profit_percent_num') ? 'var(--secondary-text)' : ''
                    }"
                  />
              </template>
              <template #default>
                <div class="filter-box" :class="mode">
                  <el-scrollbar
                    :max-height="filterHeight"
                    :always="false"
                    view-style="overflow-x: hidden"
                  >
                    <div

                      v-for="(item, key) in filterForm['profit_percent_num'].profit_obj"
                      :key="key"
                      class="mb-16px"
                    >
                      <template v-if="item.color == 'green'">
                        <div class="filter-title flex-start">
                          {{ item?.name }}
                          <div
                            class="flex clickable"
                            style="cursor: pointer"
                            @click="handleSort(filterForm['profit_percent_num'].profit_obj[key])"
                          >
                          <div class="flex flex-col items-center justify-center ml-5px">
                            <i
                              class="w-0 h-0 border-solid border-5px border-transparent cursor-pointer "
                              :class="
                                  filterForm['profit_percent_num'].profit_obj[key].sort_dir === 'asc'
                                    ? 'border-b-[--main-text]' : 'border-b-[--third-text]'
                                "
                                @click.stop="
                                  handleSort(filterForm['profit_percent_num'].profit_obj[key], 'asc')
                                "
                            />
                            <i
                              class="w-0 h-0 border-solid border-5px border-transparent mt-2px cursor-pointer"
                              :class="
                                  filterForm['profit_percent_num'].profit_obj[key].sort_dir === 'desc'
                                    ? 'border-t-[--main-text]' : 'border-t-[--third-text]'
                                "
                                @click.stop="
                                  handleSort(filterForm['profit_percent_num'].profit_obj[key], 'desc')
                                "
                            />
                          </div>
                          </div>
                        </div>
                        <div class="flex mt-10px">
                          <el-input
                            v-model.trim.number="
                              filterForm['profit_percent_num'].profit_obj[key].range[0]
                            "
                            :placeholder="$t('minor')"
                            clearable
                          />
                          <span class="ml-10px mr-10px">~</span>
                          <el-input
                            v-model.trim.number="
                              filterForm['profit_percent_num'].profit_obj[key].range[1]
                            "
                            :placeholder="$t('max1')"
                            clearable
                          />
                        </div>
                      </template>
                    </div>
                    <div class="mt-20px flex justify-center">
                      <el-button
                        class="flex-1 reset"
                        size="default"
                        style="
                          height: 30px;
                          min-width: 70px;
                          --el-button-font-weight: 400;
                        "
                        @click.stop="handleReset(filterForm['profit_percent_num'])"
                      >
                        {{ $t('reset') }}
                      </el-button>
                      <el-button
                        class="confirm flex-1"
                        size="default"
                        :color="mode !== 'dark' ? '#222222' : '#f5f5f5'"
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
            <div class="flex-end">
              <div class="mr-40px">
                <div class="flex-end">
                  <span class="text-12px mr-4px color-[--secondary-text]">
                    {{ filterForm['profit_percent_num'].profit_obj.profit_above_900_percent_num.name }}
                  </span>
                  <span
                    class="color-text-3 bg-smart"
                    :class="row?.profit_above_900_percent_num > 0 ? `bg-${filterForm['profit_percent_num'].profit_obj.profit_above_900_percent_num.color}-1` : 'bg-gray-1'"
                  >
                    {{ formatNumber(row?.profit_above_900_percent_num || 0, 2) }}
                  </span>
                </div>
                <div class="mt-10px flex-end">
                  <span class="text-12px mr-4px color-[--secondary-text]">
                    {{ filterForm['profit_percent_num'].profit_obj.profit_300_900_percent_num.name }}
                  </span>
                  <span
                    class="color-text-3 bg-smart"
                    :class="row?.profit_300_900_percent_num > 0 ? `bg-${filterForm['profit_percent_num'].profit_obj.profit_300_900_percent_num.color}-1` : 'bg-gray-1'"
                  >
                    {{ formatNumber(row?.profit_300_900_percent_num || 0, 2) }}
                  </span>
                </div>
              </div>
              <div>
                <div class="flex-end">
                  <span class="text-12px mr-4px color-[--secondary-text]">
                    {{ filterForm['profit_percent_num'].profit_obj.profit_100_300_percent_num.name }}
                  </span>
                  <span
                    class="color-text-3 bg-smart"
                    :class="row?.profit_100_300_percent_num > 0 ? `bg-${filterForm['profit_percent_num'].profit_obj.profit_100_300_percent_num.color}-1` : 'bg-gray-1'"
                  >
                    {{ formatNumber(row?.profit_100_300_percent_num || 0, 2) }}
                  </span>
                </div>
                <div class="mt-10px flex-end">
                  <span class="text-12px mr-4px color-[--secondary-text]">
                    {{ filterForm['profit_percent_num'].profit_obj.profit_10_100_percent_num.name }}
                  </span>
                  <span
                    class="color-text-3 bg-smart"
                    :class="row?.profit_10_100_percent_num > 0 ? `bg-${filterForm['profit_percent_num'].profit_obj.profit_10_100_percent_num.color}-1` : 'bg-gray-1'"
                  >
                    {{ formatNumber(row?.profit_10_100_percent_num || 0, 2) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="right" :min-width="250">
          <template #header>
            <span class="mr-10px">{{ $t('smartTop3') }}</span>
          </template>
          <template #default="{ row }">
            <div style="" class="flex-end">
              <div
                v-for="(item, index) in row?.tag_items"
                :key="index"
                class="ml-10px flex flex-col items-center min-w-60px"

                @click.stop.prevent="goLink(item, row.chain)"
              >
                <el-image
                    v-tooltip="item.symbol"
                    class="token-icon h-24px w-24px items-center cursor-pointer rounded-100%"
                    :src="getSymbolDefaultIcon({ ...item,chain: row.chain })"
                    preview-teleported
                  >
                    <template #error>
                      <img
                        class="token-icon h-24px w-24px text-16px color-#fff"
                        :src="getChainDefaultIcon(row.chain, item.symbol)"
                      >
                    </template>
                    <template #placeholder>
                      <img
                        class="token-icon h-24px w-24px text-16px color-#fff"
                        :src="getChainDefaultIcon(row.chain, item.symbol)"
                      >
                    </template>
                  </el-image>

                <div class="text-12px">
                  <span v-if="item?.volume > 0" class="green">
                    ${{ formatNumber(item?.volume || 0, 2, 4, 10 ** 4) }}
                  </span>
                  <span v-else-if="item?.volume < 0" class="red">
                    ${{ formatNumber(item?.volume || 0, 2, 4, 10 ** 4) }}
                  </span>
                  <span v-else class="color-[--third-text]">0</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" :min-width="230">
          <template #header>
            <span class="bg-[--tab-active-bg] color-[--main-text] rounded-2px px-2px mr-2px text-12px">{{ activeInterval }}</span>
            <span class="mr-7px">{{ $t('loss') }}</span>
          </template>
          <template #default="{ row }">
            <div class="flex-end" style="align-items: baseline;">
              <div class="mr-40px flex-end">
                <span class="text-12px mr-4px color-[--secondary-text]">
                  {{ filterForm['profit_percent_num_lt'].profit_obj.profit_neg10_10_percent_num.name }}
                </span>
                <span
                  class="color-text-3 bg-smart"
                  :class="row?.profit_neg10_10_percent_num > 0 ? `bg-${filterForm['profit_percent_num_lt'].profit_obj.profit_neg10_10_percent_num.color}-1` : 'bg-gray-1'"
                >
                  {{ formatNumber(row?.profit_neg10_10_percent_num || 0, 2) }}
                </span>
              </div>
              <div>
                <div class="flex-end">
                  <span class="text-12px mr-4px color-[--secondary-text]">
                    {{ filterForm['profit_percent_num_lt'].profit_obj.profit_neg50_neg10_percent_num.name }}
                  </span>
                  <span
                    class="color-text-3 bg-smart"
                    :class="row?.profit_neg50_neg10_percent_num > 0 ? `bg-${filterForm['profit_percent_num_lt'].profit_obj.profit_neg50_neg10_percent_num.color}-1` : 'bg-gray-1'"
                  >
                    {{ formatNumber(row?.profit_neg50_neg10_percent_num || 0, 2) }}
                  </span>
                </div>
                <div class="mt-10px flex-end">
                  <span class="text-12px mr-4px color-[--secondary-text]">
                    {{ filterForm['profit_percent_num_lt'].profit_obj.profit_neg100_neg50_percent_num.name }}
                  </span>
                  <span
                    class="color-text-3 bg-smart"
                    :class="row?.profit_neg100_neg50_percent_num > 0 ? `bg-${filterForm['profit_percent_num_lt'].profit_obj.profit_neg100_neg50_percent_num.color}-1` : 'bg-gray-1'"
                  >
                    {{ formatNumber(row?.profit_neg100_neg50_percent_num || 0, 2) }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="right" :min-width="110" fixed="right">
          <template #header>
            <span class="mr-7px">{{ $t('operation') }}</span>
          </template>
          <template #default="{ row }">
            <div class="flex-end" @click.stop>
              <a class="trade" :href="`https://t.me/AveSniperBot?start=fs-${row.chain}-${row.wallet_address}`"  target="_blank">
                <img src="@/assets/images/tg1.png" alt="" :width="12">
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
      />
    <el-popover
      v-model:visible="showPop"
      :virtual-ref="$refs.currentBtnRef[currentIndex]"
      virtual-triggering
      trigger="contextmenu"
      placement="right"
      popper-class="text-center"
      :width="300"
      :popper-style="{ padding: 0 , 'border-radius': '8px'}"
    >
      <div>
        <div class="flex items-center justify-between text-12px px-12px py-12px">
          <span class="color-[var(--third-text)] flex-1 text-left">{{ $t('24Volume') }}</span>
          <span class="color-[var(--third-text)] flex-1">{{ $t('buy3') }}</span>
          <span class="color-[var(--third-text)] flex-1 text-right">{{ $t('sell3') }}</span>
        </div>
        <div class="px-12px py-6px">
          <div class="flex items-center justify-between text-14px">
            <span class="color-[var(--secondary-text)] flex-1 text-left">
                ${{ formatNumber(currentRow?.total_volume || 0, 2) }}
            </span>
            <span class="color-#12B886 flex-1" >
              ${{ formatNumber(currentRow?.total_purchase || 0, 2) }}
            </span>
            <span class="color-#F6465D flex-1 text-right">
              ${{ formatNumber(currentRow?.total_sold || 0, 2) }}
            </span>
          </div>
          <div class="flex mb-4px">
            <span
              class="bg-#12B886 h-4px rounded-2px"
              :style="{
              width:
                currentRow && currentRow.total_volume > 0
                ? (currentRow.total_purchase / currentRow.total_volume * 100).toFixed(2) + '%'
                : '0%' }"
                />
            <span class="flex-1 bg-#F6465D h-4px rounded-2px ml-2px" />
          </div>
        </div>
        <div class="flex items-center justify-between text-12px px-12px py-12px">
          <span class="color-[var(--third-text)] flex-1 text-left">{{ $t('24TxAddress') }}</span>
          <span class="color-[var(--third-text)] flex-1">{{ $t('buy3') }}</span>
          <span class="color-[var(--third-text)] flex-1 text-right">{{ $t('sell3') }}</span>
        </div>
        <div class="px-12px py-6px">
          <div class="flex items-center justify-between text-14px">
            <span class="color-[var(--secondary-text)] flex-1 text-left">
                {{ formatNumber(currentRow?.total_trades || 0,2) }}
            </span>
            <span class="color-#12B886 flex-1">
              {{ formatNumber(currentRow?.buy_trades || 0,2) }}
            </span>
            <span class="color-#F6465D flex-1 text-right">
              {{ formatNumber(currentRow?.sell_trades || 0,2) }}
            </span>
          </div>
          <div class="flex  mb-4px">
            <span
              class="bg-#12B886 h-4px rounded-2px"
              :style="{
              width:
                currentRow && currentRow.total_trades > 0
                ? (currentRow.buy_trades / currentRow.total_trades * 100).toFixed(2) + '%'
                : '0%' }"
              />
          <span class="flex-1 bg-#F6465D h-4px rounded-2px ml-2px" />
          </div>
        </div>
      </div>
    </el-popover>
    </div>
  </template>

<script setup lang="ts">
import { upColor, downColor} from '@/utils/constants'
import { useEventBus, useWindowSize } from '@vueuse/core'
import { deleteAttention, addAttention2 } from '~/api/attention'
import type { KolObj } from '@/api/types/kol'
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
    filterForm: {
      type: Object,
      default: () => {
        return {

        }
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
    activeInterval: {
      type: String,
      default: '30D'
    },
})
const {activeTab,tableData,tableIndex, handleSortChange, conditions, pageNO, pageSize,isActiveFilter, handleFilterConfirm, handleSort, handleReset, filterForm, loading,openTimeList,activeInterval }= toRefs(props)
const { t } = useI18n()
const router = useRouter()
const buttonTagRef = ref<HTMLElement | null>(null)
const toolTipTagVisible = shallowRef(false)
const toolTipTagContent = shallowRef('')

const { height } = useWindowSize()
const wHeight = height
const { mode } = useGlobalStore()
const shouldRenderChild = shallowRef(true)

const $refs = ref({
  buttonRefs: {} as Record<number, any>,
  currentBtnRef: {} as Record<number, any>,
})
const filterHeight = computed(() => wHeight.value - 200)
const scrollbarHeight = computed(()=>{
  return useGlobalStore().tokenHistoryVisible ? 'calc(100vh - 182px)' : 'calc(100vh - 150px)'
})


function goLink1 (url: string) {
  if (url) {
    window.open(url)
  }
}
function goLink(row: {address: string}, chain: string) {
  const routeData = router.resolve({
    path: `/token/${row.address}-${chain}`
  })
  window.open(routeData.href, '_blank')
}
const reCreateChild = () => {
  shouldRenderChild.value = false
  // 确保 DOM更新
  nextTick(() => {
    shouldRenderChild.value = true
  })
}
const collect = async (row: any,index:number) => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }
  if(row.is_wallet_address_fav !== 1){
    useFollowStore().confirmAttention($refs.value.buttonRefs[index],row.chain, (form) => {
      console.log('confirmAttention', form)
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: row.wallet_address,
        user_chain: row.chain,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then((res) => {
        (tableData.value as Array<any>)[index].is_wallet_address_fav = 1
        reCreateChild()
        return Promise.resolve(res)
      }).catch((err) => {
        return Promise.reject(err)
      }).finally(() => {
      })
    })
    return
  }
  // loading.value = true
  deleteAttention({
    address: useFollowStore().currentAddress,
    user_address: row.wallet_address,
    user_chain: row.chain
  }).then(() => {
    ElMessage.success(t('attention1Canceled'));
    (tableData.value as Array<any>)[index].is_wallet_address_fav = 0
    reCreateChild()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
  })
}
function tableRowClick(row:KolObj) {
  const routeData = router.resolve({
    path: `/address/${row.wallet_address}/${row.chain}`
  })
  window.open(routeData.href, '_blank')
}
const emit = defineEmits(['handleSortChange'])
type SortValue = 0 | -1 | 1
const activeSort = shallowRef<SortValue>(0)
const sortBy = shallowRef<string>('')

function getActiveClass(
  activeSort1: SortValue,
  sortBy1: string,
  direction: string
) {
  const isEqual = activeSort.value === activeSort1 && sortBy.value === sortBy1
  if (direction === 'descending') {
    return isEqual ? 'border-t-[--main-text]' : 'border-t-[--third-text]'
  }
  return isEqual ? 'border-b-[--main-text]' : 'border-b-[--third-text]'
}
function switchSort(sortBy1: string, activeSort1?: SortValue) {
  if (sortBy.value !== sortBy1) {
    sortBy.value = sortBy1
    activeSort.value = 1
    return
  }
  if (activeSort1) {
    activeSort.value = activeSort1
  } else {
    activeSort.value++
  }
  if (activeSort.value > 1) {
    activeSort.value = -1
  }
  console.log('sortBy1', sortBy1, activeSort)
  let order = null
  if (activeSort.value == 1) {
    order = 'descending'
  }
  if (activeSort.value == -1) {
    order = 'ascending'
  }

  emit('handleSortChange', { prop: sortBy.value, order: order})
}
const currentIndex= shallowRef(0)
const currentRow = ref<KolObj | null>(null)
const showPop= shallowRef(false)
function showPopover(row: KolObj,$index: number) {
  showPop.value = true
  currentIndex.value = $index
  currentRow.value = row
}
const tableRef = useTemplateRef('tableRef')
const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
scrollTopEvent.on(scrollToTop)
onUnmounted(()=>{
  scrollTopEvent.off(scrollToTop)
})
function scrollToTop() {
  if (tableRef.value) {
    tableRef.value.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-table-fixed-column--left){
  .cell{
    display: flex;
    align-items: center;
  }
}
// .table-container{
//   height: calc(100vh - 150px);

// }
::v-deep(.el-table) {
    .el-table__body {
      tr:hover {
        .hover-dot{
          border-bottom: 1px dotted var(--secondary-text)
        }
      }
      .cell {
        padding-right: 19px;
        color: var(--secondary-text);
      }
    }
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
    color: var(--main-text);
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
  color: #F6465D;
}
.green {
  color: #12B886;
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
  padding: 0px 3px;
  display: inline-block;
  font-size:12px;
  min-width: 16px;
  text-align: center;
  height: 16px;
  line-height: 16px;
  &.bg-red-1 {
    background: #eb2b4b;
    color: #F5F5F5;
  }
  &.bg-green-1 {
    background: #12976F;
    color: #F5F5F5;
  }
  &.bg-gray-1 {
    background: var(--tab-active-bg);
    color: var(--third-text);
  }
  &.bg-yellow-1 {
    color: #F5F5F5;
    background: #ffa622;
  }
}
a.trade {
  background:  #3F80F71A;
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
      color: var(--main-text);
      letter-spacing: 0;
      line-height: 16px;
      font-weight: 400;
      border: 1px solid var(--border);
      padding: 8px 15px;
      text-align: center;
      margin-bottom: 10px;
      border-radius: 4px;
      &.active {
        border: 1px solid #3F80F7;

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
.reset {
  background-color: var(--border);
  color: var (--main-text);
  border-color: var(--border);
}
.hover-dot{
  &:hover {
    border-bottom: 1px dotted var(--secondary-text)
  }
}
:deep().el-input.el-input {
  --el-input-bg-color: var(--border);
  --el-input-border-color: var(--border);
  --el-input-border-radius: 4px;
  color: var(--main-text);
  .el-checkbox__inner{
      border-color: var(--border);
    }
  .el-input__wrapper {
    background: transparent;
    &:hover {
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
    &.is-focus {
      border-color: #3F80F7; /* 蓝色 */
      box-shadow: 0 0 0 1px #3F80F7 inset;
    }
    .el-input__suffix{
      color: var(--third-text)
    }
    .el-input__inner{
      color: var(--main-text);
      &::placeholder {
        color: var(--third-text);
      }
    }
  }
}
</style>
