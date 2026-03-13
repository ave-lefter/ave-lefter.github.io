<template>
  <div class="holder-list">
    <BatchRemark ref="proPopoverRef" v-model="batchRemarkData" :button-ref="addButtonRef || {}" width="248":title="$t('top20Remarked')" @onConfirm="handleAddGroup" @beforeEnter="beforeEnterBatchRemark"/>
    <el-table
      ref="holderListRef"
      v-loading="loading && !tableList.length"
      :data="tableList"
      fit
      scrollbar-always-on
      :height="tableHeight"
      style="width: 100%;"
      @sort-change="handleSortChange"
      @row-click="tableRowClick"
    >
      <template #empty>
        <div
          v-if="!loading"
          class="flex flex-col items-center justify-center py-30px"
        >
          <img v-if="mode === 'light'" src="@/assets/images/empty-white.svg" >
          <img v-if="mode === 'dark'" src="@/assets/images/empty-black.svg" >
          <span>{{ t('emptyNoData') }}</span>
        </div>
        <span v-else />
      </template>

      <el-table-column
        :label="'#' + $t('holder')"
        align="left"
        :min-width="300"
        fixed="left"
      >
        <template #header>
          <div class="flex items-center">
            <span>{{ $t('wallet2') }}</span>
            <!-- <i
              v-if="searchKeyword"
              class="iconfont icon-fitter1 text-10px ml-3px clickable"
              :style="{
                color: searchKeyword
                  ? 'var(--a-btn-bg-2-color)'
                  : 'var(--custom-font-8-color)',
              }"
              @click.stop.prevent="handleFilterQuery('')"
            /> -->
            <Icon v-if="searchKeyword" name="custom:filter" class="color-[--primary-color] cursor-pointer text-10px" @click.stop.prevent="handleFilterQuery('')" />
            <el-popover
              v-else
              v-model:visible="visible"
              placement="bottom-start"
              title=""
              :width="350"
              trigger="click"
            >
              <template #reference>
                <div><Icon name="custom:filter" class="color-[--d-666-l-999] cursor-pointer text-10px" /></div>
              </template>
              <template #default>
                <div>
                  <div class="flex mt-10px">
                    <el-input
                      v-model.trim="keyword"
                      :placeholder="$t('searchWallet')"

                    />
                  </div>
                  <div class="mt-20px">
                    <el-button
                      class="w-full"
                      size="default"
                      :color="
                        !themeStore.isDark ? '#222222' : '#f5f5f5'
                      "
                      style="
                        height: 30px;
                        min-width: 70px;
                        --el-button-font-weight: 400;
                      "
                      @click.stop="handleFilterQuery(keyword)"
                    >
                      {{ $t('confirm') }}
                    </el-button>
                  </div>
                </div>
              </template>
            </el-popover>

            <el-tooltip
              v-if="isAttention && !tableList.length"
              :content="$t('noFollowedWalletPurchases')"
              effect="light"
              :persistent="false"
            >
              <Icon name="mdi:information" class="color-[--d-666-l-999] cursor-pointer text-14px ml-4px"/>
            </el-tooltip>
          <Icon v-if="['buy24h','all','30',30].indexOf(tabActive)>-1" name="fe:edit" class="text-14px clickable" ref="addButtonRef"/>
          </div>
        </template>
        <template #default="{ row, $index }">
          <div class="flex items-baseline ">
            <div class="flex-start">
              <span class="color-[--third-text] w-24px inline-block">{{ $index +1 < 10? "0" : '' }}{{ $index + 1 }}</span>
              <Icon
                :ref="(el: any) => $refs.buttonRefs[$index] = el" name="custom:attention"
                :class="row.is_wallet_address_fav === 1 ? 'color-#F45469' : 'color-[--icon-color]'" class="h-16px w-16px clickable shrink-0 mt-4px" @click.stop.prevent="collect(row,$index)" />
            </div>
            <div class="relative ml-2px">
              <div class="flex-start">
                <UserAvatar
                  :wallet_logo="row.wallet_logo"
                  :chain="row.chain"
                  :address="row.user_address"
                  iconSize="18px"
                  iconChainSize="10px"
                  class="rounded-full"
                />
                <div
                  style="position: relative; padding: 0 4px 0; line-height: 1"
                >
                  <UserRemark
                    :key="row.holder"
                    addressClass="token-symbol ellipsis"
                    addressStyle="max-width: 80px;display: inline-block"
                    :remark="row.remark"
                    :address="row.holder"
                    :chain="row.chain"
                    iconEditColor="var(--third-text)"
                    iconEditSize="12px"
                    :wallet_logo="row.wallet_logo"
                    showAddressTitle
                    :formatAddress="
                      (address) =>
                        address?.slice(0, 4) + '...' + address?.slice(-4)
                    "
                  >
                    <div class="text-[--third-text]">
                      (
                      <span
                        :style="{
                          color: !row?.total_bought
                            ? 'var(--third-text)'
                            : '#12B886',
                        }"
                        class="text-[--third-text]"
                      >
                        {{ formatNumber(row?.total_bought || 0, 2) }}
                      </span>
                      /
                      <span
                        :style="{
                          color: !row?.total_sold
                            ? 'var(--third-text)'
                            : '#F6465D',
                        }"
                      >
                        {{ formatNumber(row?.total_sold || 0, 2) }}
                      </span>
                      )
                    </div>
                  </UserRemark>
                </div>
                <SignalTags
                :tags="row.new_tags"
                :walletAddress="row.holder"
                :chain="row.chain"/>
              </div>
              <div class="line-bar">
                <span
                  v-if="Number(row?.max_balance) > 0"
                  :style="{
                    width:
                      ((row?.balance || 0) * 100) / (row?.max_balance || 0) +
                      '%',
                  }"
                />
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="`${getChainInfo(addressAndChain?.chain)?.main_name} ${$t('bal')}`"
        align="right"
        min-width="80"
      >
        <template #default="{ row }">
          <span
            :style="{
              color: !row?.main_coin_balance ? 'var(--third-text)' : '',
            }"
          >
            {{ formatNumber(row?.main_coin_balance || 0, 2) }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        v-if="Number(tabActive) === 39"
        :label="'TOP3 ' + $t('blueChips')"
        align="right"
        min-width="120"
      >
        <template #default="{ row }">
          <div
            class="blue-chips-list"
            style="flex-direction: row-reverse; justify-content: flex-start"
            @mouseover.stop="(e) => openTooltip(row, e)"
          >
            <div
              v-for="(item, index) in row?.blueWhaleStats || []"
              :key="item.tokenAddress"
              class="blue-chips-item"
            >
              <img
                v-if="index === 0"
                class="level"
                src="@/assets/images/blue/top1.svg"
              />
              <img
                v-else-if="index === 1"
                class="level"
                src="@/assets/images/blue/top2.svg"
              />
              <img
                v-else-if="index === 2"
                class="level"
                src="@/assets/images/blue/top3.svg"
              />
              <img
                class="logo"
                height="16"
                width="16"
                :src="$f.formatIcon({ logo_url: item.logoUrl }, item.symbol)"
                :onerror="`this.src=${$f.formatDefaultIcon(
                  { logo_url: item.logoUrl },
                  item.symbol
                )}`"
              />
            </div>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        :label="$t('ratio') + globalStore.isUSDT ? $t('bal') : $t('amount')"
        align="right"
        :width="getTextWidth((globalStore.isUSDT? $t('bal') : $t('amount')) +'/'+ $t('ratio'))+ 100"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="balance"
      >
        <template #header>
          <div style="display: inline-flex; align-items: center">
            <span>{{ $t('ratio')}}/{{ globalStore.isUSDT ? $t('bal') : $t('amount') }}</span>
            <Icon v-show="globalStore.isUSDT" name="custom:dollar" class="color-[--third-text] clickable text-12px ml-3px"  @click.stop="globalStore.isUSDT = false" />
            <Icon v-show="!globalStore.isUSDT" name="custom:amount" class="color-[--third-text] clickable text-12px ml-3px" @click.stop="globalStore.isUSDT = true" />
          </div>
        </template>
        <template #default="{ row }">
          <template v-if="row.balance === -1">
            <span class="text-12px" style="color: #f6465d">{{
              $t('soldAll')
            }}</span>
          </template>
          <template v-else>
            <div
              style="line-height: 1.3"

              :style="{
                color: !row?.balance_ratio
                  ? 'var(--third-text)'
                  : '',
              }"
            >
              {{ formatNumber((row?.balance_ratio || 0) * 100, 1) }}%
            </div>
            <div
              v-if="globalStore.isUSDT"
              class="text-12px color-[--third-text]"
              style="line-height: 1.3"
            >
              {{ '$' + formatNumber(row?.balance_usd || 0, 1) }}
            </div>
            <div
              v-else
              class="text-12px color-[--third-text]"
              style="line-height: 1.3"
            >
              {{ formatNumber(row?.balance || 0, 1) }}
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        class-name="bg-12B8861A"
        :label="$t('totalPnL')"
        align="right"
        :width="getTextWidth($t('totalPnL'))+ 70"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="total_profit"
      >
        <template #default="{ row }">
          <div
            :style="{
              color: !formatProfit(row, price)
                ? 'var(--third-text)'
                : formatProfit(row, price) > 0
                ? '#12B886'
                : '#F6465D',
            }"
            style="line-height: 1.3"
          >
            {{
              formatProfit(row, price) > 0
                ? '+'
                : !!formatProfit(row, price)
                ? '-'
                : ''
            }}${{
              formatNumber(
                (formatProfit(row, price) || 0) *
                  (formatProfit(row, price) > 0 ? 1 : -1),
                1
              )
            }}
          </div>
          <div
            class="text-12px"
            :style="{
              color: !row?.total_profit_ratio
                ? 'var(--third-text)'
                : row?.total_profit_ratio > 0
                ? '#12B886'
                : '#F6465D',
            }"
            style="line-height: 1.3"
          >
            {{ row?.total_profit_ratio > 0 ? '+' : ''
            }}{{ formatNumber((row?.total_profit_ratio || 0) * 100, 1) }}%
          </div>
        </template>
      </el-table-column>

      <el-table-column
        class-name="bg-12B8861A"
        :label="$t('realized')"
        align="right"
        min-width="120"
        :width="getTextWidth($t('realized'))+ 70"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="realized_profit"
      >
        <template #default="{ row }">
          <span
            :style="{
              color: !row?.realized_profit
                ? 'var(--third-text)'
                : row?.realized_profit > 0
                ? '#12B886'
                : '#F6465D',
            }"
          >
            {{
              row?.realized_profit > 0
                ? '+'
                : !!row?.realized_profit
                ? '-'
                : ''
            }}${{
              formatNumber(
                (row?.realized_profit || 0) *
                  (row?.realized_profit > 0 ? 1 : -1),
                1
              )
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="bg-12B8861A"
        :label="$t('unrealized')"
        align="right"
        :width="getTextWidth($t('unrealized'))+ 70"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="unrealized_profit"
      >
        <template #default="{ row }">
          <span
            :style="{
              color: !formatUnrealizedProfit(row, price)
                ? 'var(--third-text)'
                : formatUnrealizedProfit(row, price) > 0
                ? '#12B886'
                : '#F6465D',
            }"
          >
            {{
              formatUnrealizedProfit(row, price) > 0
                ? '+'
                : !!formatUnrealizedProfit(row, price)
                ? '-'
                : ''
            }}${{
              formatNumber(
                (formatUnrealizedProfit(row, price) || 0) *
                  (formatUnrealizedProfit(row, price) > 0 ? 1 : -1),
                1
              )
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        class-name="bg-12B8861A"
        :label="$t('bought1')"
        align="right"
        min-width="100"
        :width="getTextWidth($t('bought1'))+ 70"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="bought_usd"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.bought_usd ? 'var(--third-text)' : '#12B886',
            }"
          >
            ${{ formatNumber(row?.bought_usd || 0, 1) }}
          </div>
          <div class="text-12px" style="line-height: 1.3">
            <span
              :style="{
                color: !row?.bought
                  ? 'var(--third-text)'
                  : 'var(--third-text)',
              }"
            >
              {{ formatNumber(row?.bought || 0, 1) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="bg-12B8861A"
        :label="$t('sold1')"
        align="right"
        :width="getTextWidth($t('sold1'))+ 70"
        sortable="custom"
        :sort-orders="['descending', 'ascending', null]"
        prop="sold_usd"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.sold_usd ? 'var(--third-text)' : '#F6465D',
            }"
          >
            ${{ formatNumber(row?.sold_usd || 0, 2) }}
          </div>
          <div class="text-12px" style="line-height: 1.3">
            <span
              :style="{
                color: !row?.sold
                  ? 'var(--third-text)'
                  : 'var(--third-text)',
              }"
            >
              {{ formatNumber(row?.sold || 0, 1) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="bg-12B8861A"
        :label="$t('avgBuySell')"
        :width="getTextWidth($t('avgBuySell'))+ 70"
        align="right"
        min-width="120"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.avg_purchase_price
                ? 'var(--third-text)'
                : 'var(--third-text)',
            }"
          >
            ${{ formatNumber(row?.avg_purchase_price || 0, 2) }}
          </div>
          <div
            class="text-12px"
            style="line-height: 1.3"
            :style="{
              color: !row?.avg_sale_price
                ? 'var(--third-text)'
                : 'var(--third-text)',
            }"
          >
            ${{ formatNumber(row?.avg_sale_price || 0, 2) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        class-name="bg-286DFF1A"
        :label="
          getChainInfo(addressAndChain.chain)?.main_name +
          $t('origin') +
          '/' +
          $t('time')
        "
        :width="getTextWidth(getChainInfo(addressAndChain.chain)?.main_name +
          $t('origin') +
          '/' +
          $t('time'))+ 70"
        align="right"
        min-width="150"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.sol_first_transfer_in_from
                ? 'var(--third-text)'
                : '',
            }"
          >
            <a
              v-if="row?.sol_first_transfer_in_from"
              class="address"
              href=""
              @click.stop.prevent="
              tableRowClick({holder:row.sol_first_transfer_in_from,remark:row?.sol_first_transfer_in_from_remark})
              "
            >
              <UserRemark
                :key="row.sol_first_transfer_in_from"
                addressClass="token-symbol ellipsis"
                addressStyle="max-width: 80px;display: inline-block;"
                :remark="row.sol_first_transfer_in_from_remark"
                :address="row.sol_first_transfer_in_from"
                :chain="row.chain"
                iconEditColor="var(--third-text)"
                iconEditSize="12px"
                showAddressTitle
                :formatAddress="
                  (address) =>
                    address?.slice(0, 4) + '...' + address?.slice(-4)
                "
              />
            </a>

            <span v-else>-</span>
            <Icon
              v-if="row?.sol_first_transfer_in_from"
              name="custom:filter"
              class="color-[--third-text] cursor-pointer text-10px ml-3px"
              :style="{
                color:
                  searchOriginKeyword && searchOriginType == 'sol'
                    ? 'var(--main-text)'
                    : '',
              }"
              @click.stop.prevent="
                filterOriginAddress(row?.sol_first_transfer_in_from, 'sol')
              "
            />
          </div>
          <div
            class="text-12px"
            style="line-height: 1.3"
            :style="{
              color: !row?.sol_first_transfer_in_time
                ? 'var(--third-text)'
                : 'var(--third-text',
            }"
          >
            {{
              row.sol_first_transfer_in_time
                ? formatDate(
                    row.sol_first_transfer_in_time,
                    'YYYY-MM-DD HH:mm:ss'
                  )
                : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="bg-286DFF1A"
        :label="token?.symbol + $t('origin') + '/' + $t('time')"
        align="right"
        min-width="150"
        :width="getTextWidth(token?.symbol + $t('origin') + '/' + $t('time'))+ 70"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.token_first_transfer_in_from
                ? 'var(--third-text)'
                : '',
            }"
          >
            <a
              v-if="row?.token_first_transfer_in_from"
              class="address"
              href=""
              @click.stop.prevent="
                tableRowClick({holder:row.token_first_transfer_in_from,remark:row?.token_first_transfer_in_from_remark})
              "
            >
              <UserRemark
                :key="row.token_first_transfer_in_from"
                addressClass="token-symbol ellipsis"
                addressStyle="max-width: 80px;display: inline-block;"
                :remark="row.token_first_transfer_in_from_remark"
                :address="row.token_first_transfer_in_from"
                :chain="row.chain"
                iconEditColor="var(--third-text)"
                iconEditSize="12px"
                showAddressTitle
                :formatAddress="
                  (address) =>
                    address?.slice(0, 4) + '...' + address?.slice(-4)
                "
              />
            </a>
            <span v-else>-</span>
            <Icon
              v-if="row?.token_first_transfer_in_from"
              name="custom:filter"
              class="color-[--third-text] cursor-pointer text-10px ml-3px"
              :style="{
                color:
                  searchOriginKeyword && searchOriginType == 'other'
                    ? 'var(--d-F5F5F5-l-222)'
                    : '',
              }"
              @click.stop.prevent="
                filterOriginAddress(row?.token_first_transfer_in_from, 'other')
              "
            />
          </div>
          <div
            class="text-12px"
            style="line-height: 1.3"
            :style="{
              color: !row?.token_first_transfer_in_time
                ? 'var(--third-text)'
                : 'var(--third-text)',
            }"
          >
            {{
              row.token_first_transfer_in_time
                ? formatDate(
                    row.token_first_transfer_in_time,
                    'YYYY-MM-DD HH:mm:ss'
                  )
                : '-'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="bg-286DFF1A"
        :label="$t('TFInOut')"
        align="right"
        :width="getTextWidth($t('TFInOut'))+ 70"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.transfer_in ? 'var(--third-text)' : '#12B886',
            }"
          >
            +{{ formatNumber(row?.transfer_in || 0, 1) }}
          </div>
          <div
            class="text-12px"
            style="line-height: 1.3"
            :style="{
              color: !row?.transfer_out
                ? 'var(--third-text)'
                : '#F6465D',
            }"
          >
            -{{ formatNumber(row?.transfer_out || 0, 1) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        class-name="bg-F6465D1A"
        :label="$t('maxTx')"
        align="right"
        min-width="100"
        :width="getTextWidth($t('maxTx'))+ 70"
      >
        <template #default="{ row }">
          <div
            style="line-height: 1.3"
            :style="{
              color: !row?.max_single_purchase_usd
                ? 'var(--third-text)'
                : '#12B886',
            }"
          >
            ${{ formatNumber(row?.max_single_purchase_usd || 0, 1) }}
          </div>
          <div
            class="text-12px"
            style="line-height: 1.3"
            :style="{
              color: !row?.max_single_sold_usd
                ? 'var(--third-text)'
                : '#F6465D',
            }"
          >
            ${{ formatNumber(row?.max_single_sold_usd || 0, 1) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        class-name="bg-F6465D1A"
        :label="$t('lastTx')"
        :width="getTextWidth($t('lastTx'))+ 70"
        align="right"
      >
        <template #default="{ row }">
          <!-- <van-count-down
            v-if="
              row?.last_txn_time &&
              formatTimeFromNow(
                new Date(row.last_txn_time).getTime() / 1000,
                true
              ) < 60
            "
            :key="row?.last_txn_time"
            :time="
              60 * 1000 - (Date.now() - new Date(row.last_txn_time).getTime())
            "
            style="
              --van-count-down-text-color: var(--third-text);
              --van-count-down-line-height: 1;
              --van-count-down-font-size: 13px;
            "
            :millisecond="false"
          >
            <template #default="{ total }">
              <template v-if="total > 0">
                {{ Math.floor((60 * 1000 - total) / 1000) }} {{ $t('ss') }}
              </template>
              <template v-else>
                {{ dayjs(new Date(row.last_txn_time).getTime()).fromNow() }}
              </template>
            </template>
          </van-count-down> -->
          <span v-tooltip="formatDate(row.last_txn_time, 'YYYY-MM-DD HH:mm:ss')" class="text-[--third-text]">
            {{
              row.last_txn_time
                ? dayjs(new Date(row.last_txn_time).getTime()).fromNow()
                : ''
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-tooltip
      ref="tooltipRef"
      v-model:visible="toolTipVisible"
      placement="right"
      :popper-class="$store.state.mode"
      effect="customized"
      :virtual-ref="buttonRef"
      virtual-triggering
      trigger="hover"
      raw-content
    >
      <template #content>
        <div class="blue-tooltip-content">
          <div class="blue-tooltip-title">TOP3 {{ $t('blueChips') }}</div>
          <table>
            <thead>
              <tr>
                <th>{{ $t('token') }}</th>
                <th>{{ $t('ratio') }}</th>
                <th>{{ $t('vol/amount') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in currentRow?.blueWhaleStats || []"
                :key="item.tokenAddress"
              >
                <td>
                  <div class="flex-start">
                    <div class="blue-chips-item" style="margin-top: -5px">
                      <img
                        v-if="index === 0"
                        class="level"
                        src="@/assets/images/blue/top1.svg"
                      />
                      <img
                        v-else-if="index === 1"
                        class="level"
                        src="@/assets/images/blue/top2.svg"
                      />
                      <img
                        v-else-if="index === 2"
                        class="level"
                        src="@/assets/images/blue/top3.svg"
                      />
                      <img
                        style="border-radius: 50%"
                        height="24"
                        width="24"
                        :src="
                          $f.formatIcon({ logo_url: item.logoUrl }, item.symbol)
                        "
                        :onerror="`this.src=${$f.formatDefaultIcon(
                          { logo_url: item.logoUrl },
                          item.symbol
                        )}`"
                      />
                    </div>
                    <span class="ml-3 text-12px">{{ item.symbol }}</span>
                    <i
                      v-copy="item.tokenAddress"
                      style="color: var(--third-text)"
                      class="iconfont icon-copy text-12px ml-3"
                    />
                  </div>
                </td>
                <td>
                  <div
                    class="relative"
                    style="
                      display: inline-flex;
                      flex-direction: column;
                      align-items: flex-end;
                    "
                  >
                    <div
                      class="text-12px"
                      style="line-height: 1.3"
                      :style="{
                        color: !item?.balanceRatio
                          ? 'var(--third-text)'
                          : 'var(--a-text-1-color)',
                      }"
                    >
                      {{
                        $f.formatNumberS((item?.balanceRatio || 0) * 100, 1)
                      }}%
                    </div>
                    <div
                      class="line-bar"
                      :style="{
                        background:
                          $store.state.mode === 'dark' ? '#666' : '#ccc',
                      }"
                    >
                      <span
                        v-if="Number(item?.balanceRatio) > 0"
                        :style="{
                          width: (item?.balanceRatio || 0) * 100 + '%',
                        }"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    :style="{
                      color: !item?.balance_usd
                        ? 'var(--third-text)'
                        : 'var(--a-text-1-color)',
                    }"
                  >
                    ${{ $f.formatNumberS(item?.balance_usd || 0, 2) }}
                  </div>
                  <div
                    :style="{
                      color: !item?.balance_usd
                        ? 'var(--third-text)'
                        : 'var(--a-text-2-color)',
                    }"
                  >
                    {{ $f.formatNumberS(item?.balance || 0, 2) }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex-center mt-10">
            <img
              v-if="$store.state.mode === 'dark'"
              src="@/assets/images/aveai-logo.svg"
              height="14"
              alt=""
              srcset=""
            />
            <img
              v-else
              src="@/assets/images/aveai-logg-w.svg"
              height="14"
              alt=""
              srcset=""
            />
          </div>
        </div>
      </template>
    </el-tooltip> -->
  </div>
</template>

<script setup lang="ts">
import { deleteAttention, addAttention2 } from '~/api/attention'
import BigNumber from 'bignumber.js'
import { getChainInfo, formatDate, getAddressAndChainFromId, getTextWidth } from '@/utils/index'
import BatchRemark from '../batchRemark.vue'
import dayjs from 'dayjs'
const tokenStore = useTokenStore()
const props = defineProps({
  modelValue: Boolean,
  tableList: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  tabActive: {
    type: [String, Number],
    default: 'all',
  },
  searchOriginKeyword: {
    type: String,
    default: '',
  },
  searchOriginType: {
    type: String,
    default: '',
  },
  isAttention: {
    type: Boolean,
    default: false,
  }
})
const $emit = defineEmits(['filterAddress', 'handleSortChange', 'filterOriginAddress','reLoad'])
defineExpose({ sort,clearSort })
const { tableList, loading } = toRefs(props)
const { mode } = storeToRefs(useGlobalStore())
const { token, price,pair } = storeToRefs(useTokenStore())
const tokenDetailSStore = useTokenDetailsStore()
const $refs = ref({
  buttonRefs: {} as Record<number, any>
})
const { t } = useI18n()
const globalStore = useGlobalStore()
const themeStore = useThemeStore()
const route = useRoute()
// const isShowBalance = shallowRef(true)
const visible = shallowRef(false)
const searchKeyword = shallowRef('')
const keyword = shallowRef('')
const holderListRef = useTemplateRef('holderListRef')

// 批量备注
const addButtonRef = ref()
const proPopoverRef = ref()
const batchRemarkData=ref({
  list:[],
  symbol:token.value?.symbol
} as {
  list:any[],
  symbol:string
})
const beforeEnterBatchRemark=() => {
  const list = [...tableList.value]
  batchRemarkData.value.symbol =token.value?.symbol ||''
  batchRemarkData.value.list = list.slice(0, 20).map((item: any) => {
    return {
      total_profit:Math.trunc(item?.total_profit)||0,
      user_address:item?.holder,
      user_chain:item?.chain,
      address: useFollowStore().currentAddress,
    }
  })||[]
  console.log('beforeEnterBatchRemark', batchRemarkData.value.list )
}

const handleAddGroup=async () => {
  $emit('reLoad')
  proPopoverRef.value?.close?.()
}

const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || '',
  }
})
const tableHeight = computed(() => {
  return Math.max(tokenStore.commonHeight-265, 450)
})
function tableRowClick(rowData: {holder: string, remark: string,chain:string,txHash:string}) {
  if (!token.value) {
    return
  }
  if(!SupportFullDataChain.includes(token.value.chain)){
    return
  }
  const { symbol, logo_url, chain, token: _token } = token.value
  const { target_token, token0_address, token0_symbol, token1_symbol, pair: pairAddress } = pair.value!
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: route.params.id! as string,
      symbol,
      logo_url,
      chain,
      address: _token,
      remark: rowData.remark!,
    },
    pairInfo: {
      target_token,
      token0_address,
      token0_symbol,
      token1_symbol,
      pairAddress
    },
    user_address: rowData.holder
  })
}

const collect = async (row: any,index:number) => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }
  console.log('collect',row,index)
  if(row.is_wallet_address_fav !== 1 && !props.isAttention){
    useFollowStore().confirmAttention($refs.value.buttonRefs[index],row.chain, (form) => {
      console.log('confirmAttention', form)
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: row.holder,
        user_chain: row.chain,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then((res) => {
        globalStore.getFollowsNum();
        (tableList.value as Array<any>)[index].is_wallet_address_fav = 1
        // getList()
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
    user_address: row.holder,
    user_chain: row.chain
  }).then(() => {
    globalStore.getFollowsNum()
    ElMessage.success(t('attention1Canceled'));
    (tableList.value as Array<any>)[index].is_wallet_address_fav = 0
      // console.log('------deleteAttention---------', tableList.value[index])
      // if (props.isAttention) {
      //   (tableList.value as Array<any>)[index].value?.splice(index, 1)
      // }
    // getList()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
  })
}


function formatUnrealizedProfit(
  row: {
    unrealized_profit: number, bought?: number, sold?: number, avg_purchase_price?: number
},
  price = 0
) {
  // const amount = Math.max((row?.bought || 0) - (row?.sold || 0), 0)
  // return  new BigNumber(price - (row?.avg_purchase_price || 0))
  //   .times(amount)
  //   .toNumber()
  return row?.unrealized_profit || 0
}
function formatProfit(row: {
  unrealized_profit: number, bought?: number, sold?: number, avg_purchase_price?: number, realized_profit?: number
}, price = 0) {
  return (row?.unrealized_profit || 0) + (row?.realized_profit || 0)
}

function handleFilterQuery(k: string) {
  visible.value = false
  $emit('filterAddress', k)
  keyword.value = k || ''
  searchKeyword.value = k || ''
}
// function goLink() { }
function handleSortChange(obj:{prop: string, order:string }) {
  $emit('handleSortChange', obj)
}

function filterOriginAddress(address: string, type: string) {
  $emit('filterOriginAddress', { address, type })
}
function sort(prop: string, order: string) {
  holderListRef?.value?.sort(prop, order)
}
function clearSort() {
  holderListRef?.value?.clearSort()
}
</script>
<style lang="scss" scoped>
  :deep(.el-table) {
    font-size: 12px;
    .caret-wrapper{
      margin-right: -7px;
      margin-left: -3px;
    }
    td {
      &.bg-12B8861A {
        background: var(--d-0C111C-l-E9F0FF);
      }
      &.bg-286DFF1A {
        background: var(--d-0A1514-l-E7F8F3);
      }
      &.bg-F6465D1A {
        background: var(--d-180F12-l-FEECEF);
      }
    }
  }
  .line-bar {
    width: 100px;
    height: 3px;
    display: flex;
    background: var(--main-divider);
    border-radius: 1.5px;
    margin-top: 4px;
    > span {
      height: 3px;
      border-radius: 1.5px;
      background: var(--secondary-text);
    }
  }
</style>
