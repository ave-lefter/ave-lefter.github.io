<template>
  <div v-if="modelValue"
    class="w-orderBook bg-[--d-0B0D12-l-F6F9FF] relative rounded-2px text-14px pt-12px flex flex-col overflow-hidden"
    :style="{ height: `${(klineHeight || 200)}px`,'will-change': 'height' }">
    <!-- 111: {{   !(
    !modelValue
    || listStatus.loadingTxs
    || listStatus.loadingTxs1
    || isLoading
    || listStatus.finished
    || filterTableList.length === 0
) }}
    loadingTxs:{{listStatus.loadingTxs}}
    loadingTxs1:{{listStatus.loadingTxs1}}
    finished:{{listStatus.finished}}
    filterTableList.length:{{filterTableList.length}}
    <div>{{ klineHeight+activeTab+(isMeActive?1:0) }}</div> -->
    <!-- 筛选标签 -->
    <div class="mx-12px pb-12px flex items-center justify-between lh-none">
      <div class="text-[--main-text1] font-500 text-13px lh-16px flex gap-4px"><span>{{ t('orderBook') }}</span> <Icon class="text-13px mt-2px origin-center-center transition-transform duration-0.3s ease clickable" :class="isExpand?'rotate-0':'rotate-180'"  name= "material-symbols:keyboard-arrow-up"  @click="isExpand = !isExpand"/></div>
      <div class="flex gap-8px h-14px text-12px color-[--third-text] items-center">
        <Icon v-if="isPausedTxs1" name="custom:stop" class="text-14px color-[#FFA622]" />
        <div class="me-btn shrink-0 flex items-center gap-4px sticky right-0 cursor-pointer"
          :class="{ 'active': activeTab==='-100' }" @click="toggleClickFollowed" v-tooltip="t('onlyFollowed')">
          <!-- <Icon name="custom:filter2" class="text-12px"/> -->
          <span>{{ t('followed') }}</span>
        </div>
        <div class="me-btn shrink-0 flex items-center gap-4px sticky right-0 cursor-pointer"
          :class="{ 'active': activeTab==='25' }" @click="toggleClickDEV"  v-tooltip="t('OnlyDev')">
          <!-- <Icon name="i-tdesign:user-filled" class="text-md" /> -->
          <!-- <Icon name="custom:filter2" class="text-12px"/> -->
          <span>{{ t('dev4') }}</span>
        </div>
        <div class="me-btn shrink-0 flex items-center gap-4px sticky right-0 cursor-pointer"
          :class="{ 'active': isMeActive }" @click="toggleClickMe" v-tooltip="t('OnlyYou')">
          <!-- <Icon name="custom:user" class="text-12px" /> -->
          <span>{{ t('you') }}</span>
        </div>
        <span v-tooltip="$t(globalStore.isClickKlineFilter?'clickChartHideFilter':'clickChartFilter')" class="flex items-center justify-center cursor-pointer" :class="globalStore.isClickKlineFilter?'color-[--primary-color]':'text-[--third-text] hover:text-[--d-E0E0E0-l-333]'" @click="globalStore.isClickKlineFilter=!globalStore.isClickKlineFilter"><Icon name="custom:chart2" /></span>
        <Icon name="custom:filter2" class="cursor-pointer" :class="isFilterActive?'color-[--primary-color]':'color-[--third-text] hover:color-[--d-E0E0E0-l-333]'" @click.self="filterDialogVisible=true"/>
      </div>
    </div>
    <transition name="collapse">
      <div v-show="isExpand" class="content mx-12px pb-12px flex">
        <div ref="tabsContainer"
          class="flex items-center gap-x-8px whitespace-nowrap overflow-x-auto scrollbar-hide border-1px border-solid b-[--main-divider1] rounded-4px">
          <div v-for="(tab, index) in tabs" :key="tab.value"
            :class="[
              'shrink-0 text-12px px-8px py-4px rounded-4px border-none cursor-pointer lh-16px font-500',
              ((activeTab === tab.value) || ((activeTab === '-100' || activeTab === '25') && tab.value==='all'))
                ? 'color-[--main-text1] bg-[--main-divider1]'
                : 'color-[--third-text]'
            ]" @click="setActiveTab(tab.value, index)">
            {{ tab.label }}
          </div>
        </div>
      </div>
    </transition>

    <!-- 表格 -->
    <div class="px-0px">
      <div v-if="tableFilter.timestamp.length&&tableFilter.timestamp[0]&&tableFilter.timestamp[1]" class="flex gap-8px justify-center mb-12px">
        <DateFilterCard v-model:timestamp="tableFilter.timestamp" @update:timestamp="dialogFilter.timestamp=[];filterSubmit()" class="bg-[transparent]! h-16px! mb-0px! w-244px! justify-end!"/>
        <el-switch v-model="globalStore.isClickKlineFilter" size="small" class="h-16px!" v-tooltip="!globalStore.isClickKlineFilter?t('enabledClickKlineFilter'):t('disabledClickKlineFilter')"/>
      </div>
      <template v-if="tableFilter.markerAddress">
        <div
          v-if="tableLoading"
          class="lh-20px text-12px py-0px bg-[transparent] text-center mb-12px font-400">
          {{ $t('loading') }}
        </div>
        <template v-else>
          <div class="lh-20px text-12px py-0px bg-[transparent] text-center mb-12px flex justify-center text-[--main-text1] font-400">
            <div
              v-html="$t('filterTip', {
              address: `<span>&nbsp;${tableFilter.markerAddress.slice(0, 4)}...${tableFilter.markerAddress.slice(-4)}&nbsp;</span>`,
              count: `<span  class='color-#3F80F7'>&nbsp;${filterTableList[0]?.count || 0}&nbsp;</span>`
            })" />
            <span class='color-#3F80F7 decoration-underline cursor-pointer ml-2px' @click.stop="resetMakerAddress">
              {{ $t('reset') }}
            </span>
          </div>
        </template>
      </template>
      <div v-loading="tableLoading" class="text-12px">
        <!-- 表格头部 -->
        <div
          class="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)] items-center gap-15px mb-12px text-12px color-[--third-text] px-12px">
          <div class="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-15px">
            <div class="text-left text-nowrap min-w-0">
              <div class="flex items-center justify-start gap-2px clickable group" @click="globalStore.isUSDT = !globalStore.isUSDT">
                <span>{{ t('amountU').slice(0, 3) }}</span>
                <img v-if="!globalStore.isUSDT" :src="`${token_logo_url}chain/${token?.chain}.png`" class="mt-1px border-rd-[50%]" height="12" alt=""></img>
                <!-- <Icon v-if="globalStore.isUSDT" name="custom:price2" class="color-[--third-text] text-10px"/> -->
                <Icon v-else name="custom:price2" class="color-[--third-text] text-12px group-hover:color-[--d-E0E0E0-l-333]"/>
              </div>
            </div>
            <div class="flex items-center justify-start gap-2px text-nowrap min-w-0 clickable group" @click="tableView.isAmount = !tableView.isAmount">
              {{ tableView.isAmount ? t('swapPrice') : t('MC') }}
              <Icon name="custom:exchange-horizontal" class="color-[--third-text] text-10px group-hover:color-[--d-E0E0E0-l-333]"/>
              <!-- <div class="p-0 px-2px border-none hover:bg-[transparent] h-auto"
                @click="tableView.isAmount = !tableView.isAmount">
                <svg v-if="tableView.isAmount" width="10" height="10" viewBox="0 0 10 10" fill="none"
                  xmlns="http://www.w3.org/2000/svg" class="color-[--third-text]">
                  <path
                    d="M5 0C2.23884 0 0 2.23884 0 5C0 7.76116 2.23884 10 5 10C7.76116 10 10 7.76116 10 5C10 2.23884 7.76116 0 5 0ZM5.24889 7.42411L5.25112 7.7779C5.25112 7.82701 5.21094 7.8683 5.16183 7.8683H4.84486C4.79576 7.8683 4.75558 7.82812 4.75558 7.77902V7.42857C3.76451 7.35491 3.29799 6.79017 3.24777 6.17634C3.24331 6.12388 3.2846 6.07924 3.33706 6.07924H3.85268C3.89621 6.07924 3.93415 6.11049 3.94085 6.1529C3.99777 6.5067 4.27344 6.7712 4.76785 6.83705V5.24442L4.49219 5.17411C3.90848 5.0346 3.35268 4.67076 3.35268 3.9163C3.35268 3.10268 3.97098 2.66518 4.76116 2.58817V2.21986C4.76116 2.17076 4.80134 2.13058 4.85045 2.13058H5.16406C5.21317 2.13058 5.25334 2.17076 5.25334 2.21986V2.58482C6.01786 2.66183 6.59152 3.10826 6.65848 3.80357C6.66406 3.85603 6.62276 3.90179 6.56919 3.90179H6.06808C6.02343 3.90179 5.98549 3.8683 5.97991 3.82478C5.93527 3.49888 5.67411 3.23326 5.24889 3.17522V4.6741L5.53237 4.73996C6.25558 4.91852 6.74777 5.26451 6.74777 6.03907C6.74777 6.87947 6.12277 7.34822 5.24889 7.42411ZM4.04688 3.86496C4.04688 4.14843 4.2221 4.36831 4.59933 4.50446C4.65179 4.52567 4.70424 4.54241 4.76674 4.56026V3.17634C4.35491 3.2288 4.04688 3.45982 4.04688 3.86496ZM5.34709 5.37388C5.31585 5.36718 5.2846 5.35938 5.24889 5.34933V6.84152C5.72433 6.79911 6.05246 6.53795 6.05246 6.10044C6.05246 5.75782 5.875 5.53459 5.34709 5.37388Z"
                    fill="currentColor" />
                </svg>
                <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="color-[--third-text]">
                  <path
                    d="M9.02589 2.99465C9.33125 3.60428 9.5 4.2861 9.5 5.00802C9.5 7.48663 7.48304 9.5 5 9.5C2.51696 9.5 0.5 7.48663 0.5 5.00802C0.5 2.52941 2.50893 0.516043 5 0.516043V5.31283L9.02589 2.99465ZM5.64286 0.5V4.14171L8.69643 2.38503C7.99732 1.39037 6.90446 0.684492 5.64286 0.5Z"
                    fill="currentColor" />
                </svg>
              </div> -->
            </div>
          </div>
          <div class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] items-center gap-15px">
            <div class="text-left min-w-0">{{ t('makers') }}</div>
            <div class="min-w-0 text-right cursor-pointer flex items-center justify-end">
              <span @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')">{{ t('time') }}</span>
              <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
            </div>
          </div>
        </div>

        <!-- 表格内容 -->
        <AveEmpty v-if="isEmpty" class="pt-40px">
          <span class="color-[--third-text] text-12px mb-20px mt-4px">{{ t('emptyNoData') }}</span>
        </AveEmpty>
        <!-- :key="klineHeight+activeTab+(isMeActive?1:0)" -->
        <div v-else ref="scroller" :key="klineHeight+activeTab+updateNum"
          style="margin-right: -12px;padding-right: 12px;overscroll-behavior-y: contain" class="scrollbar-hide overflow-y-auto"
          :style="{ height: `${(klineHeight ?? 200) - (isExpand? 104:66)}px`,'will-change': 'height' }"  @mouseenter="isPausedTxs = true"
          @mouseleave="isPausedTxs = false">
          <div :style="{
            height: `${totalSize}px`,
            width: '100%',
            position: 'relative'
          }">
            <div v-for="virtualRow in virtualItems" :key="String(virtualRow.key)" :style="{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`
            }">
              <div :ref="(el) => virtualizer.measureElement(el)"  :data-index="virtualRow.index" class="lh-20px w-full">
                <div
                  class="px-12px grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)] items-center gap-15px h-28px hover:bg-[rgba(255,255,255,.02)] relative z-10 overflow-hidden cursor-pointer mt-1px first:mt-0"
                  :class="{ 'bg-[--tooltip1]': virtualRow.index % 2 === 1 }" @click="onRowClick({ rowData: getItem(virtualRow) } as any)">
                  <div class="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] items-center gap-15px relative h-28px px-2px">
                    <!-- 整行渐变背景 -->
                    <!-- <div class="absolute inset-0 pointer-events-none w-[calc(100%+12px)] ml--12px"
                      :style="{ backgroundColor: getFullRowGradient(getItem(virtualRow)), transform: `scaleX(${getAmountBarWidthPercent(getItem(virtualRow))})`, transformOrigin: 'left' }" /> -->
                    <div class="w-[calc(100%+12px)] ml--12px inset-0 pointer-events-none absolute">
                      <div :class="`absolute h-full  ${getGradient(getItem(virtualRow))} opacity-15`"
                      :style="`width:${Math.min(getAmount(getItem(virtualRow), true, true) / (addressAndChain.chain === 'solana' ? 10 : 20), 100)}%`" />
                    </div>
                    <!-- Amount -->
                    <div class="text-left text-nowrap min-w-0">
                      <div class="font-medium truncate color-[--secondary-text]">
                        <template v-if="globalStore.isUSDT">
                          <span>
                            ${{ formatFixedDecimals(getAmount(getItem(virtualRow), true, true), 2) }}
                          </span>
                        </template>
                        <template v-else>
                          <span>
                            {{ formatFixedDecimals(getAmount(getItem(virtualRow), true, false), 3) }}
                            <!-- <span class="color-[--third-text] hidden sm:inline">
                                {{ getChainInfo(getItem(virtualRow).chain)?.main_name }}
                              </span> -->
                          </span>
                        </template>
                      </div>
                    </div>
                    <!-- Price -->
                    <div class="text-left text-nowrap min-w-0 overflow-visible">
                      <div :class="getRowColor(getItem(virtualRow))">
                        <template v-if="tableView.isAmount">
                          <span>
                            ${{ formatNumber(getTransactionPrice(getItem(virtualRow), true), { decimals: 3 }) }}
                          </span>
                        </template>
                        <template v-else>
                          <span>
                            ${{ formatNumber2(getMcPrice(getItem(virtualRow)), 1) }}
                          </span>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)] items-center gap-15px h-28px">


                    <!-- Trader -->
                    <div class="text-left overflow-hidden min-w-0">
                      <div class="flex items-center justify-start min-w-0">

                        <UserRemark :remark="getItem(virtualRow).remark" :address="getItem(virtualRow).wallet_address"
                          :show-address="true" :chain="getItem(virtualRow).chain" :wallet_logo="getItem(virtualRow).wallet_logo"
                          :addressClass="`inline-block truncate max-w-full ${markerTooltipVisible && currentRow.wallet_address === getItem(virtualRow).wallet_address ? 'bg-#12B88633' : ''
                            }`"
                          :format-address="(address: string) => windowWidth < 480 ? address?.slice(-3) : '*' + address?.slice(-4)"
                          class="color-[--secondary-text] truncate min-w-0 !text-12px"
                          :mouseoverAddress="e => openMarkerTooltip(getItem(virtualRow), e)" :canEdit="false"
                          @update-remark="updateRemark" />
                        <div v-if="getItem(virtualRow).count && getItem(virtualRow).count > 1"
                          class="color-[--secondary-text] !text-12px ml-2px whitespace-nowrap">
                          ({{ getItem(virtualRow).count }})
                        </div>
                        <template v-if="windowWidth >= 480 && ['solana', 'bsc'].includes(getItem(virtualRow).chain) && getItem(virtualRow).senderProfile">
                          <Icon v-if="hasNewAccount(getItem(virtualRow)) && (!(getItem(virtualRow).newTags || []).map((i: any) => i.type).includes('47'))"
                            v-tooltip="{ content: `<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
                            name="custom:new-account" class="w-10px h-10px ml-2px shrink-0 icon-hover hidden sm:block" />
                          <Icon v-if="hasClearedAccount(getItem(virtualRow)) && (!(getItem(virtualRow).newTags || []).map((i: any) => i.type).includes('46'))"
                            v-tooltip="{ content: `<span style='color: #EB2B4B'>${$t('sellAl')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
                            name="custom:cleared-account"
                            class="w-10px h-10px ml-2px shrink-0 icon-hover hidden sm:block" />
                          <Icon v-if="bigWallet(getItem(virtualRow))"
                            v-tooltip="{ content: `<span style='color: #ccc'>${$t('whales')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
                            name="custom:big" class="w-10px h-10px ml-2px shrink-0 icon-hover hidden sm:block" />
                        </template>
                        <SignalTags v-if="windowWidth >= 480" tagClass="mr-2px text-10px" tagHeight="10" class="ml-2px"
                          :tags="(getItem(virtualRow).newTags || []).map((el: any) => tagStore.matchTag(el.type) || el)"
                          :walletAddress="getItem(virtualRow).wallet_address" :chain="getItem(virtualRow).chain" />
                      </div>
                    </div>
                    <!-- Time -->
                    <el-tooltip placement="right" :show-arrow="false" :persistent="false"
                      :content="formatDate(getItem(virtualRow)?.time, 'YYYY-MM-DD HH:mm:ss')">
                      <div class="text-right min-w-0 hover:decoration-underline hover:decoration-[--third-text]">
                        <div class="color-[--third-text]">
                          <TimerCount v-if="getItem(virtualRow).time && Number(formatTimeFromNow(getItem(virtualRow).time, true)) < 60"
                            :key="`${getItem(virtualRow).time}${virtualRow.index}`" :timestamp="getItem(virtualRow).time" :end-time="60">
                            <template #default="{ seconds }">
                              <span class="color-[--third-text]">
                                <template v-if="seconds < 60">
                                  {{ seconds }}s
                                </template>
                                <template v-else>
                                  {{ formatTimeFromNow(getItem(virtualRow).time) }}
                                </template>
                              </span>
                            </template>
                          </TimerCount>
                          <span v-else class="color-[--third-text]">
                            {{ formatTimeFromNow(getItem(virtualRow).time) }}
                          </span>
                        </div>
                      </div>
                      <!-- <template #default>
                        </template>
                        <template #content>
                          {{}}
                        </template> -->
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <template v-if="filterTableList.length === 0 && !listStatus.loadingTxs">
          <div class="h-full flex flex-col items-center justify-center "
            :style="{ height: `${(klineHeight ?? 200) - 105}px` }">
            <img src="@/assets/images/empty-black.svg" alt="">
          </div>
        </template> -->
      </div>
    </div>
    <!-- status：仅在有暂停状态（hover 或 升序排序）时展示底部条，避免未暂停时仍显示黑条 -->
    <!-- <div
      v-show="isPausedTxs1"
      class="z-10 absolute bottom-0 h-28px w-100% flex items-center justify-center bg-[--main-input-button-bg] color-[#FFA622]">
      <div class="flex items-center gap-x-7px">
        <Icon name="custom:stop" class="text-14px" />
        <span class="text-xs">{{ t('paused') }}</span>
      </div>
    </div> -->
    <!-- MarkerTooltip -->
    <MarkerTooltip v-model="markerTooltipVisible" :virtual-ref="makerTooltip" :currentRow="currentRow"
      :addressAndChain="addressAndChain">
      <div class="flex">
        <template v-if="currentRow.senderProfile">
          <Icon v-if="hasNewAccount(currentRow) && (!(currentRow.newTags||[]).map((i:any)=>i.type).includes('47'))"
            v-tooltip="{ content: `<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`, props: { 'raw-content': true, 'popper-class': 'orderbook-icon-tooltip' } }"
            name="custom:new-account" class="icon-hover w-15px h-15px text-15px mr-3px" />
          <Icon v-if="hasClearedAccount(currentRow) && (!(currentRow.newTags||[]).map((i:any)=>i.type).includes('46'))"
            v-tooltip="{ content: `<span style='color: #EB2B4B'>${$t('sellAl')}</span>`, props: { 'raw-content': true, 'popper-class': 'orderbook-icon-tooltip' } }"
            name="custom:cleared-account" class="icon-hover w-15px h-15px text-15px mr-3px" />
          <Icon v-if="bigWallet(currentRow)"
            v-tooltip="{ content: `<span style='color: #C5842B'>${$t('whales')}</span>`, props: { 'raw-content': true, 'popper-class': 'orderbook-icon-tooltip' } }"
            name="custom:big" class="icon-hover w-15px h-15px text-15px mr-3px" />
        </template>
        <SignalTags tagClass="mr-3px" :tags="(currentRow.newTags || []).map((el: any) => tagStore.matchTag(el.type) || el)" :walletAddress="currentRow.wallet_address"
          :chain="currentRow.chain" />
      </div>
    </MarkerTooltip>
    <el-dialog v-if="filterDialogVisible" v-model="filterDialogVisible" :width="440" :title="$t('txFilter')" class="w-orderBookDialog" destroy-on-close>
      <div class="mx--16px h-1px bg-[--border] mb-20px"/>
      <div class="mb-12px mt-20px">
        <label>
          {{ $t('filterTime') }}
        </label>
      </div>
      <div class="flex items-center gap-20px">
        <el-date-picker
          v-model="dialogFilter.timestamp[0]"
          :disabled-date="disabledStartDate"
          class="[--el-font-size-base:12px]"
          type="datetime"
          range-separator="To"
          start-placeholder="yyyy/mm/dd hh:mm:ss"
          end-placeholder="yyyy/mm/dd hh:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="X"
          prefix-icon="Calendar"
          :teleported="false"
          :placeholder="t('startTime')"
        />
        <span class="color-[--third-text]">~</span>
        <el-date-picker
          v-model="dialogFilter.timestamp[1]"
          :disabled-date="disabledEndDate"
          class="[--el-font-size-base:12px]"
          type="datetime"
          range-separator="To"
          start-placeholder="yyyy/mm/dd hh:mm:ss"
          end-placeholder="yyyy/mm/dd hh:mm:ss"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="X"
          prefix-icon="Calendar"
          :teleported="false"
          :placeholder="t('endTime1')"
        />
      </div>
          <div class="mb-12px mt-20px">
        <label>
          {{ $t('volume') }}($)
        </label>
      </div>
      <div class="flex items-center mb-12px">
        <el-button
          v-for="(item,idx) in volColumns"
          :key="idx"
          plain
          size="default"
          class="flex-1 h-30px font-400 b-[--border] bg-[--main-input-button-bg] color-[--main-text1]"
          @click.stop="dialogFilter.minVol=item.key;dialogFilter.maxVol=''"
        >
          {{ item.value }}
        </el-button>
      </div>
      <div class="flex items-center gap-20px">
        <el-input
          v-model.trim.number="dialogFilter.minVol"
          type="text"
          class="text-12px"
          :placeholder="$t('minor')"
          style="--el-input-border-color:var(--border);"
          @blur="onVolBlur(0)"
          @input="(value) => (dialogFilter.minVol = value.replace(/\-|[^\d.]/g, ''))"
        >
          <template #suffix>$</template>
        </el-input>
        <span class="color-[--third-text]">~</span>
        <el-input
          v-model.trim.number="dialogFilter.maxVol"

          type="text"
           class="text-12px"
           :placeholder="$t('max1')"
           style="--el-input-border-color:var(--border)"
          @blur="onVolBlur(1)"
          @input="(value) => (dialogFilter.maxVol = value.replace(/\-|[^\d.]/g, ''))"
        >
          <template #suffix>$</template>
        </el-input>
      </div>
      <div class="mb-12px mt-20px">
        <label for="markerAddress">
          {{ $t('filterWallet2') }}
        </label>
      </div>
      <div class="flex gap-12px">
        <el-input id="markerAddress" v-model="dialogFilter.markerAddress"  class="text-12px" :placeholder="$t('markerAddress')"></el-input>
        <el-button
          plain
          size="default"
          class="flex-1 h-32px font-400 color-[--main-text1]"
          @click.stop="toggleClickMe();filterDialogVisible = false"
        >
          {{ $t('filterWallet') }}
        </el-button>
      </div>

      <div class="mt-20px flex gap-8px">
        <el-button
          class="h-30px flex-1 color-[--main-text1]"
          @click="resetDialogFilter"
        >
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" class="h-30px flex-1 color-[--main-text1]" @click="confirmDialogFilter">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch, onMounted, onUnmounted, triggerRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useTokenStore } from '~/stores/token'
import { useWSStore } from '~/stores/ws'
import { getAddressAndChainFromId, formatTimeFromNow, uuid, getChainInfo } from '~/utils'
import { getSimpleTxs,type GetPairLiqResponse, type IGetSimpleTxsResponse, } from '~/api/token'
import { useRoute } from 'vue-router'
import { filterLanguage } from '~/pages/token/components/kLine/utils'
import { WSEventType } from '~/utils/constants'
import { useThrottleFn,useIntersectionObserver, useInfiniteScroll, useLocalStorage } from '@vueuse/core'
import { UseVirtualList } from '@vueuse/components'
import { useVirtualizer } from '@tanstack/vue-virtual'
import UserRemark from '~/components/userRemark.vue'
import MarkerTooltip from '../belowChartTable/transactions/markerTooltip.vue'
import type { RowEventHandlerParams } from 'element-plus'
import type { SimpleWSTx } from '../kLine/types'
import BigNumber from 'bignumber.js'
import DateFilterCard from '../dateFilterCard.vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
const tokenStore = useTokenStore()
const themeStore = useThemeStore()

const MAKER_SUPPORT_CHAINS = ['solana', 'bsc']

// 扩展的交易数据类型
type ExtendedTxResponse = (IGetSimpleTxsResponse | SimpleWSTx) & {
  count?: number
  senderProfile?: any
  wallet_tag?: string[]
  topN?: string
  remark?: string
}

const props = defineProps<{
  modelValue: boolean
  klineHeight?: number
}>()

const klineDateFilter = inject<Ref<string[]>>(ProvideType.KLINE_DATE_FILTER)
defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const {lang} = storeToRefs(useGlobalStore())
const { t } = useI18n()
const route = useRoute()
const { totalHolders, pairAddress, pair, token, } = storeToRefs(useTokenStore())

const walletStore = useWalletStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()
const wsStore = useWSStore()
const tagStore = useTagStore()
const tokenDetailSStore = useTokenDetailsStore()

const { mode, token_logo_url, isDark } = storeToRefs(useGlobalStore())
// 状态管理
const tabsContainer = ref<HTMLElement | null>(null)
const activeTab = shallowRef('all')

const isExpand = shallowRef(true)
const isPausedTxs = shallowRef(false)
const isPausedTxs1 = computed(() => {
  return isPausedTxs.value ||(sortConditions.value.sort_dir ==='asc')  || tokenDetailSStore.drawerVisible|| markerTooltipVisible.value
})
const markerTooltipVisible = shallowRef(false)
// const isMeActive = ref(false)
const listStatus = ref({
  loadingTxs: false,
   // 切换token
  loadingTxs1: false,
  finished: false,
  page_token:'',
  pageSize:100
})
const updateNum=shallowRef(0)
// 虚拟列表相关 refs
const scroller = ref(null)
const sentinel = ref(null)
const tokenTxs = shallowRef<ExtendedTxResponse[]>([])
const wsPairCache = shallowRef<ExtendedTxResponse[]>([])


// 用 IntersectionObserver 监听 sentinel。
// 特别重要：把 root 指定为虚拟列表的滚动容器 scroller.value
// useIntersectionObserver(
//   sentinel,
//   ([{ isIntersecting }]) => {
//     console.log('isIntersecting', isIntersecting,listStatus.value,filterTableList.value.length)
//     if (
//       !props.modelValue
//       || !isIntersecting
//       || listStatus.value.loadingTxs
//       || listStatus.value.loadingTxs1
//       || listStatus.value.finished
//       || filterTableList.value.length === 0
//     ) return
//     _getTokenTxs()
//   },
//   {
//     root: scroller, // 注意传 ref（@vueuse/core 会处理）
//     threshold: 0,
//     rootMargin: '0px 0px 120px 0px',
//   }
// )

const tableFilter = ref({
  markerAddress: '',
  tag_type: 'all',
  minVol:'',
  maxVol:'',
  timestamp:[] as string[]
})
const txCount = shallowRef<{ [key: string]: number }>({})
const makerTooltip = ref()
const currentRow = shallowRef<ExtendedTxResponse>({} as any)

// 表格视图状态
const tableView = ref({
  // isVolUSDT: true,
  isAmount: false,
})

// 只在交易历史接口更新之后更新，防止 route 地址更新导致列表数据更新异常
const realAddress = shallowRef(getAddressAndChainFromId(route.params.id as string).address)
const filterDialogVisible = shallowRef(false)
const minVol = useLocalStorage<string>('txMinVol','')
const maxVol = useLocalStorage<string>('txMaxVol','')
const defaultDialogFilter = {
  markerAddress: '' as string,
  minVol:'' as string,
  maxVol:'' as string,
  timestamp:[] as string[]
}
const dialogFilter = ref(cloneDeep(defaultDialogFilter))
const ignoreWs = computed(() => {
  return !['all'].includes(activeTab.value)
})

const self_address = computed(() => {
  if (addressAndChain.value.chain !== 'solana') {
    return botStore.evmAddress || walletStore.address
  } else {
    return botStore.getWalletAddress('solana') || walletStore.address
  }
})

const tabs = computed(() => {
  const arr: Array<{ label: string, value: string }> = []
  if (Array.isArray(totalHolders.value)) {
    totalHolders.value.forEach(i => {
      const num = i.total_address
      if(i.type !== '25') {
        if (num > 0) {
          arr.push({
            ...i,
            label: i?.[filterLanguage(useLocaleStore().locale)] + (i.type !== '31' ? `(${num})` : ''),
            value: i.type
          })
        }
      }
    })
  }
  return [{
    label: t('all'),
    value: 'all'
  },
  // {
  //   label: t('buy3'),
  //   value: 'buy'
  // },
  // {
  //   label: t('sell3'),
  //   value: 'sell'
  // },
  // {
  //   label: t('liquidity2'),
  //   value: 'liquidity'
  // },
  ...arr]
})

const isFilterActive = computed(()=>{
  return tableFilter.value.markerAddress || tableFilter.value.minVol || tableFilter.value.maxVol || tableFilter.value.timestamp.length
})

const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || ''
  }
})

const defaultSort = computed(() => {
  if (sortConditions.value.sort === 'time') {
    return sortConditions.value.sort_dir
  }
  return ''
})

const sortConditions= ref({
  sort: '',
  sort_dir: '',
})

function sortChange(sort_dir: string) {
  sortConditions.value={
    sort: sort_dir ? 'time' : '',
    sort_dir: sort_dir,
  }
  console.log('sortConditions.value', sort_dir)
  // if(sort_dir==='desc') return
  filterSubmit()
}

const {reset ,isLoading} = useInfiniteScroll(scroller, ()=>{
  console.log('infiniteScroll')
  // emits('endReached')
  // if (
  //   !props.modelValue
  //   || listStatus.value.loadingTxs
  //   || listStatus.value.loadingTxs1
  //   || listStatus.value.finished
  //   || filterTableList.value.length === 0
  // ) return
  _getTokenTxs()
}, { distance: 20 ,canLoadMore:()=>!(
    !props.modelValue
    || listStatus.value.loadingTxs
    || listStatus.value.loadingTxs1
    || listStatus.value.finished
    || isLoading.value
    || filterTableList.value.length === 0
  ) })

async function filterSubmit() {
  console.log('filterSubmit',dialogFilter.value,tableFilter.value)
  listStatus.value.page_token = ''
  listStatus.value.loadingTxs = false
  listStatus.value.finished = false
  wsPairCache.value = []
  tableFilter.value.minVol = dialogFilter.value.minVol
  tableFilter.value.maxVol = dialogFilter.value.maxVol
  minVol.value = dialogFilter.value.minVol
  maxVol.value = dialogFilter.value.maxVol
  // tokenTxs.value=[]
  // reCreateChild()
  getTokenTxs()
  // reCreateChild()
  // getTokenTxs()
}

const volColumns = [
  {
    key:'500',
    value:'>500',
  },
  {
    key:'1000',
    value:'>1000',
  },
  {
    key:'5000',
    value:'>5000',
  },
]

function onVolBlur(index: number) {
  const min = Number(dialogFilter.value.minVol)
  const max = Number(dialogFilter.value.maxVol)
  console.log('onVolBlur',min,max)

  const isMaxLessThanMin =(min&&max)? (max <= min):false
  if ((index === 0 && isMaxLessThanMin) || min === 0) {
    dialogFilter.value.minVol = ''
  } else if ((index === 1 && isMaxLessThanMin) || max === 0) {
    dialogFilter.value.maxVol = ''
  }
}


const tableLoading = computed(() => listStatus.value.loadingTxs1 )


const isMeActive = computed(()=>{
  return tableFilter.value.markerAddress&&(tableFilter.value.markerAddress === self_address.value)
})

const filterTableListMap = {
  all: () => [...tokenTxs.value].toSorted((a, b) => sortConditions.value.sort_dir ==='asc' ? a.time - b.time : b.time - a.time),
  buy: () => tokenTxs.value.filter(el => isBuy((el))).toSorted((a, b) => sortConditions.value.sort_dir ==='asc' ? a.time - b.time : b.time - a.time),
  sell: () => tokenTxs.value.filter(el => !isBuy(el)).toSorted((a, b) => sortConditions.value.sort_dir ==='asc' ? a.time - b.time : b.time - a.time)
}

const filterTableList = computed(() => {
  let tableList = [...tokenTxs.value]
  if (activeTab.value in filterTableListMap) {
    tableList = filterTableListMap[activeTab.value as keyof typeof filterTableListMap]()
  } else {
    tableList = tokenTxs.value
  }

  // Maker 地址筛选
  if (tableFilter.value.markerAddress) {
    tableList = tableList.filter(item =>
      item.wallet_address.toLowerCase() === tableFilter.value.markerAddress.toLowerCase()
    )
  }

  // 时间筛选
  const [startTime, endTime] = tableFilter.value.timestamp
  if (startTime) {
    tableList = tableList.filter(item => item.time >= Number(startTime))
  }
  if (endTime) {
    tableList = tableList.filter(item => item.time <= Number(endTime))
  }
  // 交易额筛选
  const { minVol, maxVol } = tableFilter.value
  if (minVol) {
    tableList = tableList.filter(item => getAmount(item, true, true) >= Number(minVol))
  }
  if (maxVol) {
    tableList = tableList.filter(item => getAmount(item, true, true) <= Number(maxVol))
  }

  return tableList
})

const shouldRenderChild = shallowRef(true)

const reCreateChild = () => {
  shouldRenderChild.value = false
  // 确保 DOM更新
  nextTick(() => {
    shouldRenderChild.value = true
  })
}

// :key="klineHeight" ref="scroller" :list="filterTableList" :options="{itemHeight:24}" style="margin-right: -12px;padding-right: 12px;overscroll-behavior-y: contain" class="scrollbar-hide" :height="`${(klineHeight ?? 200) - 110}px`"
const virtualizer = useVirtualizer(
  computed(() => ({
    count: filterTableList.value.length,
    getScrollElement: () => scroller.value,
    estimateSize: () => 28,
    overscan: 5,
    gap: 0
  }))
)
const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())
const isEmpty = computed(() => filterTableList.value.length === 0 && !listStatus.value.loadingTxs && !listStatus.value.loadingTxs1)

const getItem = (virtualRow:any) => {
  return filterTableList.value[virtualRow.index] || {}
}

watch(()=> filterTableList.value,()=>{
  nextTick(() => {
    reset()
  })
})

watch(() => klineDateFilter?.value, (val) => {
  if (val && props.modelValue) {
    tableFilter.value.timestamp = val
    dialogFilter.value.timestamp = val
    filterSubmit()
  }
})

// 监听 pairAddress 变化（token切换）
watch(() => pairAddress.value, () => {
  if (pairAddress.value && props.modelValue) {
    console.log('🔄 Token切换，清空订单薄数据')
    listStatus.value.loadingTxs1 = true
    resetCache()
    // 立即清空旧数据，避免显示错误的数据
    tokenTxs.value = []
    wsPairCache.value = []
    txCount.value = {}
    activeTab.value = 'all'
    tableFilter.value.markerAddress = ''
    tableFilter.value.tag_type = 'all'

    // 重新获取数据
    filterSubmit()
    subscribeToTxs()
  }
})

// 监听 modelValue 变化（orderBook 打开/关闭）
watch(() => props.modelValue, (isOpen) => {
  console.log('🔄 订单薄状态变化:', isOpen ? '打开' : '关闭')
  if (isOpen && pairAddress.value) {
    // orderBook 打开时，清空旧数据并获取新数据
    listStatus.value.loadingTxs1 = true
    dialogFilter.value.minVol = minVol.value
    dialogFilter.value.maxVol = maxVol.value
    resetCache()
    filterSubmit()
    subscribeToTxs()

  } else if (!isOpen) {
    // orderBook 关闭时，取消订阅并清空数据
    unsubscribeFromTxs()
    resetCache()
  }
})

function resetCache() {
  tokenTxs.value = []
  wsPairCache.value = []
  txCount.value = {}
  listStatus.value.page_token = ''
  listStatus.value.finished = false
  listStatus.value.loadingTxs = false
}

// WebSocket 订阅
function subscribeToTxs() {
  const liqParams = {
    jsonrpc: '2.0',
    params: ['tx', pairAddress.value],
    id: 1
  }
  wsStore.send({
    ...liqParams,
    method: 'unsubscribe'
  })
  wsStore.send({
    ...liqParams,
    method: 'subscribe'
  })
}

// WebSocket 取消订阅
function unsubscribeFromTxs() {
  const liqParams = {
    jsonrpc: '2.0',
    params: ['tx', pairAddress.value],
    id: 1
  }
  wsStore.send({
    ...liqParams,
    method: 'unsubscribe'
  })
}

function transferTxsData(row: IGetSimpleTxsResponse) {
  const { wallet_tag, topN } = getWalletTag(row)
  const maker_types = (row.maker_type||'').split(',')
  let lang1='en' as 'tw'|'cn'|'vi'|'tr'|'ru'|'pt'|'ko'|'ja'|'es'|'en'
  if (lang.value === 'zh-tw') {
    lang1 = 'tw' // 繁体中文
  } else if (lang.value === 'zh-cn') {
    lang1 = 'cn' // 简体中文
  }
  const newTags=tagStore.tagArr.filter(item => maker_types.includes(item.type)).map(i=>{
    return {
      type: i.type,
      tag_desc: i?.[lang1],
      icon: i.icon,
      color: i.color,
      extra_info: i.extra_info,
      nick_name: i.nick_name
    }
  })
  return {
    ...row,
    wallet_tag,
    topN,
    senderProfile: JSON.parse(row?.profile || '{}'),
    uuid: uuid(),
    newTags,
    isSimple: true,
    chain:addressAndChain.value.chain,
    id:row.page_token,
    // amm:row.amm,
    transaction:row.txhash,
    wallet_address:row.maker,
  }
}

function resetTx() {
  if(!listStatus.value.page_token){
    tokenTxs.value = []
    listStatus.value.page_token = ''
    txCount.value = {}
    wsPairCache.value = []
  }
}

const getTokenTxs = useThrottleFn(_getTokenTxs, 500)

async function _getTokenTxs() {
  console.log('getTokenTxs',tableFilter.value)
  try {
    if (!props.modelValue || !pairAddress.value || listStatus.value.loadingTxs) return
    listStatus.value.loadingTxs = true
    const { tag_type } = tableFilter.value
    const getPairTxsParams = {
      token_id: route.params.id as string,
      tag_type:!['buy', 'sell'].includes(tag_type) ? tag_type : '',
      direction:['buy', 'sell'].includes(tag_type) ? tag_type : '',
      sender: tableFilter.value.markerAddress,
      target_price_u_min: tableFilter.value.minVol,
      target_price_u_max: tableFilter.value.maxVol,
      time_min: tableFilter.value.timestamp[0],
      time_max: tableFilter.value.timestamp[1],
      page_token: listStatus.value.page_token,
      //TODO: 增加排序参数
      sort_dir:sortConditions.value.sort_dir
    }

    const res = await getSimpleTxs(tokenStore.pairAddress + '-' + addressAndChain.value.chain, getPairTxsParams)
    const data=res||[]
    realAddress.value = getAddressAndChainFromId(getPairTxsParams.token_id).address
    const page_token= data[data.length - 1]?.page_token || ''
    txCount.value={}
    if (Array.isArray(data) && data?.length > 0) {
      if(!listStatus.value.page_token) {
        tokenTxs.value = data.reverse().map(val => {
          txCount.value[val.maker] = (txCount.value[val.maker] || 0) + 1
          return {
            ...transferTxsData(val),
            count: txCount.value[val.maker]
          }
        }).reverse()
      }else{
        tokenTxs.value = [...tokenTxs.value].concat(data.filter?.(i => tokenTxs.value?.every?.(j => j.txhash !== i.txhash))
            ?.map(i => transferTxsData(i))).reverse().map(val => {
          txCount.value[val.maker] = (txCount.value[val.maker] || 0) + 1
          return {
            ...val,
            count: txCount.value[val.maker]
          }
        }).reverse()
      }
      if (!listStatus.value.finished) {
        listStatus.value.page_token = page_token
      }
      if(sortConditions.value.sort_dir ==='asc'){
        tokenTxs.value =[...tokenTxs.value].toSorted((a, b) => a.time - b.time)
      }else{
        tokenTxs.value =[...tokenTxs.value].toSorted((a, b) => b.time - a.time)
      }
    }else{
      if(!listStatus.value.page_token) {
        tokenTxs.value = []
      }
      listStatus.value.finished = true
    }
  } catch {
    resetTx()
  } finally {
    listStatus.value.loadingTxs1 = false
    listStatus.value.loadingTxs = false
    updateNum.value++
  }
}

// async function getTokenTxs() {
//   try {
//     listStatus.value.loadingTxs = true
//     const { tag_type } = tableFilter.value
//     const getTokenTxsParams = {
//       token_id: route.params.id as string,
//       tag_type,
//       maker: tableFilter.value.markerAddress,
//       time_min:tableFilter.value.timestamp?.[0],
//       time_max:tableFilter.value.timestamp?.[1]
//     }
//     const res = await getTokenTxs(getTokenTxsParams)

//     realAddress.value = getAddressAndChainFromId(getTokenTxsParams.token_id).address

//     tokenTxs.value = (res || []).reverse().map(val => {
//       txCount.value[val.wallet_address] = (txCount.value[val.wallet_address] || 0) + 1
//       const { wallet_tag, topN } = getWalletTag(val)
//       return {
//         ...val,
//         wallet_tag,
//         topN,
//         count: txCount.value[val.wallet_address],
//         senderProfile: JSON.parse(val.profile || '{}'),
//         uuid: uuid()
//       }
//     }).reverse()
//   } catch (e) {
//     // 只有在没有现有数据时才清空，避免网络错误导致数据丢失
//     // if (tokenTxs.value.length === 0) {
//       tokenTxs.value = []
//     // }
//     console.log('🚨 订单薄数据获取失败:', e)
//   } finally {
//     listStatus.value.loadingTxs = false
//   }
// }

function getWalletTag(val: IGetSimpleTxsResponse) {
  const wallet_tagStr = val.wallet_tag_v2 || ''
  let topN = ''
  let wallet_tag: string[] = []
  if (wallet_tagStr.length > 0) {
    wallet_tag = wallet_tagStr.split(',')
    wallet_tag.forEach((i: string, index: number) => {
      const isTopN = new RegExp('^top.*$', 'gi').test(i)
      if (isTopN) {
        topN = i
        wallet_tag.splice(index, 1)
      }
    })
  }
  return {
    topN,
    wallet_tag
  }
}

function isBuy(row: IGetSimpleTxsResponse | SimpleWSTx) {
  const tokenAddress = realAddress.value || addressAndChain.value.address

  if (!tokenAddress || !row) {
    console.warn('🚨 isBuy: 缺少必要参数', { tokenAddress, row })
    return false
  }

  if ('direction' in row && 'target' in row) {
    return row.direction === 'buy'
  }
  if ('from_address' in row) {
    if (
      row.from_address &&
      realAddress.value.toLowerCase?.() === row.from_address?.toLowerCase?.()
    ) {
      return false
    }
  }

  if ('to_address' in row) {
    if (
      row.to_address &&
      realAddress.value.toLowerCase?.() === row.to_address.toLowerCase?.()
    ) {
      return true
    }
  }
}

function getRowColor(row: IGetSimpleTxsResponse) {
  if ('type' in row) {
    if (row.type === 'addLiquidity') {
      return 'color-#65C4ED'
    } else if (row.type === 'removeLiquidity' || row.type === 'CollectFee') {
      return 'color-#EF6DE2'
    }
  }
  return isBuy(row) ? 'color-#12B886' : 'color-#F6465D'
}


function getMcPrice(row: IGetSimpleTxsResponse | SimpleWSTx) {

  // 获取total总数
  const total = tokenStore.circulation

  // 根据买/卖方向获取对应的USD价格（成交价）
  let currentPriceUsd = 0
  const tokenAddress = realAddress.value || addressAndChain.value.address
  if ('isSimple' in row && row.isSimple && 'target_price_u' in row) {
    currentPriceUsd = Number(row?.target_price_u)
  }else if ('direction' in row && 'target' in row) {
    currentPriceUsd = Number(row.price_u)
  } else {
    if (row.from_address && tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()) {
      // 卖出：使用 from_price_usd
      currentPriceUsd = Number(row.from_price_usd) || 0
    } else if (row.to_address && tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()) {
      // 买入：使用 to_price_usd
      currentPriceUsd = Number(row.to_price_usd) || 0
    } else {
      // 如果无法判断方向，使用默认价格
      currentPriceUsd = Number(row.to_price_usd) || Number(row.from_price_usd) || 0
    }
    // 如果价格为0，记录警告
    if (currentPriceUsd === 0) {
      console.warn('⚠️ MC计算失败 - 价格为0:', {
        from_price_usd: row.from_price_usd,
        to_price_usd: row.to_price_usd,
        from_address: row.from_address,
        to_address: row.to_address,
        tokenAddress,
        isBuy: isBuy(row),
        transaction: row.transaction
      })
    }
  }


  // 计算市值 = 成交价USD × 总数
  const marketCap = currentPriceUsd * total?.toNumber()

  return marketCap
}
function getAmount(row: GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx, needPrice = false, isVolUSDT = false) {
  // 使用 realAddress 确保地址匹配的准确性
  const tokenAddress = realAddress.value || addressAndChain.value.address

  // 添加数据有效性检查
  if (!tokenAddress || !row) {
    console.warn('🚨 getAmount: 缺少必要参数', { tokenAddress, row })
    return 0
  }
  if ('direction' in row && 'target' in row) {
    return Number(row.target_amt || 0) * (
        needPrice ? Number(isVolUSDT ? row.price_u || row.target_price_u : row.price_m||row.target_price_m)
          : 1
      )
  }

  if ('from_address' in row) {
    if (
      row.from_address &&
      realAddress.value.toLowerCase?.() === row.from_address?.toLowerCase?.()
    ) {
      return row.from_amount * (
        needPrice ? Number(isVolUSDT ? row.from_price_usd : row.from_price_eth)
          : 1
      )
    }
  }

  if ('to_address' in row) {
    if (
      row.to_address &&
      realAddress.value.toLowerCase?.() === row.to_address.toLowerCase?.()
    ) {
      return row.to_amount * (
        needPrice ? Number(isVolUSDT ? row.to_price_usd : row.to_price_eth)
          : 1
      )
    }
  }
  return 0
}

// 整行渐变背景（优化版本）
function getFullRowGradient(row: ExtendedTxResponse) {
  const str = `${themeStore.isDark}-${isBuy(row)}`
  // const map: Record<string, string> = {
  //   'true-true': 'bg-[linear-gradient(270deg,transparent_0%,#12654C_40%,#12B886_100%)]',
  //   'true-false': 'bg-[linear-gradient(270deg,transparent_0%,#7F2A36_40%,#F6465D_100%)]',
  //   'false-false': 'bg-[linear-gradient(270deg,transparent_0%,#88DBC3_40%,#12B886_100%)]',
  //   'false-true': 'bg-[linear-gradient(270deg,transparent_0%,#FBA2AE_40%,#F6465D_100%)]',
  // }
  const map: Record<string, string> = {
    'true-true': 'rgba(18, 184, 134, 0.10)',
    'true-false': 'rgba(246, 70, 93, 0.10)',
    'false-false': 'rgba(18, 184, 134, 0.10)',
    'false-true': 'rgba(246, 70, 93, 0.10)',
  }
  return map[str] || map['true-true']
}

function getAmountBarWidthPercent(row: ExtendedTxResponse) {
  const vol = getAmount(row, true, true)
  const width = Math.min(vol / (addressAndChain.value.chain === 'solana' ? 10 : 20), 100) / 100
  return width.toFixed(3)
}


// 新增：固定小数位格式化方法
function formatFixedDecimals(value: number, decimals: number): string {
  if (isNaN(value) || value === 0) return '0.00'

  // 使用 toFixed 确保固定小数位数
  const fixed = value.toFixed(decimals)

  // 移除末尾的零（但保留至少一位小数）
  const trimmed = fixed.replace(/\.?0+$/, '')

  // 如果没有小数点，根据需要添加
  if (decimals > 0 && !trimmed.includes('.')) {
    return trimmed + '.00'
  }

  return trimmed
}

const windowWidth = ref(window.innerWidth)
const updateWidth = () => {
  windowWidth.value = window.innerWidth
}


// 新增函数：获取成交价格
function getTransactionPrice(row: IGetSimpleTxsResponse | SimpleWSTx, isVolUSDT = false) {
  // 使用 realAddress 确保地址匹配的准确性
  const tokenAddress = realAddress.value || addressAndChain.value.address

  // 添加数据有效性检查
  if (!tokenAddress || !row) {
    console.warn('🚨 getTransactionPrice: 缺少必要参数', { tokenAddress, row })
    return 0
  }


  if ('direction' in row && 'target' in row) {
    return Number(isVolUSDT ? row.price_u || row.target_price_u : row.price_m||row.target_price_m) || 0
  }

  if (row.from_address &&
    tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()) {
    // 卖出：使用 from_price_usd 或 from_price_eth
    return Number(isVolUSDT ? row.from_price_usd : row.from_price_eth) || 0
  }

  if (row.to_address &&
    tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()) {
    // 买入：使用 to_price_usd 或 to_price_eth
    return Number(isVolUSDT ? row.to_price_usd : row.to_price_eth) || 0
  }

  return 0
}


function setActiveTab(val: string, index: number) {
  console.log('🔄 切换订单薄标签:', val)
  if(activeTab.value===val){
    return
  }
  resetData(val)
  // isMeActive.value = false
  // tableFilter.value.markerAddress = ''
  filterSubmit()

  // 滚动到 tab 中心位置
  if (tabsContainer.value) {
    const container = tabsContainer.value
    const tab = container.children[index] as HTMLElement
    if (tab) {
      // 获取容器的可视区域宽度
      const containerWidth = container.clientWidth

      // 获取 tab 的位置和宽度
      const tabRect = tab.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // 计算 tab 相对于容器的位置
      const tabRelativeLeft = tabRect.left - containerRect.left + container.scrollLeft
      const tabWidth = tabRect.width

      // 计算 tab 的中心点
      const tabCenter = tabRelativeLeft + (tabWidth / 2)

      // 计算目标滚动位置（让 tab 中心对齐到容器中心）
      const targetScrollLeft = tabCenter - (containerWidth / 2)

      // 限制滚动范围
      const maxScrollLeft = container.scrollWidth - containerWidth
      const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft))

      container.scrollTo({
        left: finalScrollLeft,
        behavior: 'smooth'
      })
    }
  }
}

function toggleClickMe() {
  if (!verifyLogin()) {
    return
  }
  console.log('🔄 切换"我的交易"筛选')
  if (isMeActive.value) {
    tableFilter.value.markerAddress = ''
    dialogFilter.value.markerAddress = ''
  } else {
    const walletAddress = self_address.value
    tableFilter.value.markerAddress = walletAddress
    dialogFilter.value.markerAddress = walletAddress
  }
  wsPairCache.value.length = 0  // 清空缓存
  if(activeTab.value==='-100'){
    resetData('all')
  }else{
    resetData(activeTab.value)
  }
  filterSubmit()
}
function toggleClickFollowed() {
  if (!verifyLogin()) {
    return
  }
  console.log('🔄 切换"已关注"筛选')
  if (isMeActive.value) {
    tableFilter.value.markerAddress = ''
    dialogFilter.value.markerAddress = ''
  }
  if(activeTab.value==='-100'){
    resetData('all')
  }else{
    resetData('-100')
  }
  filterSubmit()
}

function toggleClickDEV() {
  console.log('🔄 切换"dev"筛选')
  // if (isDEVActive.value) {
  //   tableFilter.value.markerAddress = ''
  //   dialogFilter.value.markerAddress = ''
  // }
  if(activeTab.value==='25'){
    resetData('all')
  }else{
    resetData('25')
  }
  filterSubmit()
}

function resetData(val:string) {
  activeTab.value = val
  txCount.value = {}
  wsPairCache.value.length = 0  // 清空缓存
  tableFilter.value.tag_type = val
}


function onRowClick({ rowData }: RowEventHandlerParams) {

  if (!token.value) {
    return
  }
  if (SupportFullDataChain.includes(token.value.chain)) {
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
      user_address: rowData.wallet_address
    })
  } else {
    window.open(formatExplorerUrl(token.value.chain, rowData.transaction, 'tx'))
  }

}

function updateRemark() {
  // 更新备注后的回调
}

function openMarkerTooltip(row: ExtendedTxResponse, e: MouseEvent) {
  if (row && SupportFullDataChain.includes(row.chain)) {
    makerTooltip.value = e.currentTarget
    console.log(row)
    if (currentRow.value?.wallet_address === row.wallet_address) {
      return
    }
    currentRow.value = row
  }
}



function hasNewAccount(row: ExtendedTxResponse) {
  if ('direction' in row && 'target' in row) {
    return row.direction === 'buy' && new BigNumber(row.maker_bal).eq(row.target_amt)
  }
  if (row?.newTags?.some?.(i => i?.type === '8')) {
    return false
  }
  if (
    addressAndChain.value.address.toLowerCase?.() === row.senderProfile?.token0Address?.toLowerCase?.()
  ) {
    return row.senderProfile?.token0HasNewAccount
  } else {
    return row.senderProfile?.token1HasNewAccount
  }
}

function hasClearedAccount(row: ExtendedTxResponse) {
  if ('direction' in row && 'target' in row) {
    return row.direction === 'sell' && new BigNumber(row.maker_bal).eq(0)
  }
  if (isBuy(row) || row.newTags?.some?.(i => i?.type === '8')) {
    return false
  }
  if (
    addressAndChain.value.address.toLowerCase?.() === row.senderProfile?.token0Address?.toLowerCase?.()
  ) {
    return row.senderProfile?.token0HasClearedAccount
  } else {
    return row.senderProfile?.token1HasClearedAccount
  }
}

function bigWallet(row: ExtendedTxResponse) {
  if ('maker_eth' in row) {
    return Number(row.maker_eth || 0) >= 50
  }
  if (row?.newTags?.some?.(i => i.type === '8')) {
    return false
  }
  return Number(row.senderProfile?.solTotalHolding) > 50
}

// WebSocket 相关功能
onMounted(async() => {
  // onTxsLiqMessage()
  // 如果组件挂载时 orderBook 已经打开，则获取数据
  if (props.modelValue && pairAddress.value) {
    dialogFilter.value.minVol = minVol.value
    dialogFilter.value.maxVol = maxVol.value
    filterSubmit()
    subscribeToTxs()
  }
  window.addEventListener('resize', updateWidth)
})

// 保存 watch 监听器的 unwatch 函数，用于组件卸载时清理
let watchTxUnwatch: (() => void) | null = null
let watchSimpleTxUnwatch: (() => void) | null = null

onUnmounted(() => {
  // 清理 watch 监听器，防止内存泄漏
  watchTxUnwatch?.()
  watchSimpleTxUnwatch?.()
  watchTxUnwatch = null
  watchSimpleTxUnwatch = null

  wsStore.getWSInstance()?.offMessage('tx_history')
  if (pairAddress.value) {
    unsubscribeFromTxs()
  }
  window.removeEventListener('resize', updateWidth)
})

watchTxUnwatch = watch(() => wsStore.wsResult[WSEventType.TX], data => {
  if (!data || listStatus.value.loadingTxs || ignoreWs.value) {
    return
  }
  const { wallet_address, from_address, to_address } = data.tx
  // 不是当前币种的数据
  if (from_address !== realAddress.value && to_address !== realAddress.value) {
    return
  }
  const { timestamp, markerAddress } = tableFilter.value
  const [startTime, endTime] = timestamp || []
  if(startTime && data.tx.time < Number(startTime)){
    return
  }
  if(endTime && data.tx.time > Number(endTime)){
    return
  }
  if(markerAddress && wallet_address !== markerAddress){
    return
  }
  const existingTx = wsPairCache.value.find(tx =>
  (('transaction' in tx && tx.transaction === data.tx.transaction &&
    tx.wallet_address === wallet_address))
  )
  if (existingTx) {
    return
  }
  txCount.value[wallet_address] = (txCount.value[wallet_address] || 0) + 1
  const { topN, wallet_tag } = getWalletTag(data.tx)
  const item = {
    ...data.tx,
    topN, wallet_tag,
    senderProfile: JSON.parse(data.tx.profile || '{}'),
    count: txCount.value[wallet_address],
    time: Math.min(Math.floor(Date.now() / 1000), data.tx.time),
    uuid: uuid()
  }
  wsPairCache.value.unshift(item)
  if (!isPausedTxs1.value) {
    updatetokenTxs()
  }
})

watchSimpleTxUnwatch = watch(() => wsStore.wsResult[WSEventType.SIMPLE_TX], data => {
  if (!data || listStatus.value.loadingTxs || ignoreWs.value) {
    return
  }
  const simpleWSTx = data.msg as SimpleWSTx
  const { maker, target } = simpleWSTx
  // 不是当前币种的数据
  if (target !== realAddress.value) {
    return
  }
  const { timestamp, markerAddress } = tableFilter.value
  const [startTime, endTime] = timestamp || []
  if(startTime && simpleWSTx.time < Number(startTime)){
    return
  }
  if(endTime && simpleWSTx.time > Number(endTime)){
    return
  }
  if(markerAddress && maker !== markerAddress){
    return
  }
  txCount.value[maker] = (txCount.value[maker] || 0) + 1
  const { topN, wallet_tag } = getWalletTag(data.msg)
  const item = {
    ...simpleWSTx,
    topN, wallet_tag,
    count: txCount.value[maker],
    time: Math.min(Math.floor(Date.now() / 1000), simpleWSTx.time),
    uuid: uuid(),
    wallet_address: maker,
    transaction: simpleWSTx.txhash,
    senderProfile: {
      solTotalHolding: simpleWSTx.maker_eth
    }
  }
  wsPairCache.value.unshift(item as any)
  if (!isPausedTxs1.value) {
    updatetokenTxs()
  }
})
// function onTxsLiqMessage() {
//   wsStore.getWSInstance()?.onmessage(e => {
//     const msg = getWSMessage(e)
//     if (!msg || !props.modelValue) {
//       return  // 只有当 orderBook 打开时才处理消息
//     }

//     const {event, data} = msg
//     if (event == WSEventType.TX && !listStatus.value.loadingTxs) {
//       const {wallet_address, from_address, to_address} = data.tx

//       // 检查是否是当前币种的数据
//       if (from_address !== realAddress.value && to_address !== realAddress.value) {
//         return
//       }

//       // 检查是否已存在相同的交易（防重复）
//       const existingTx = wsPairCache.value.find(tx =>
//         tx.transaction === data.tx.transaction &&
//         tx.wallet_address === wallet_address
//       )
//       if (existingTx) {
//         console.log('🔄 跳过重复交易:', data.tx.transaction)
//         return
//       }

//       txCount.value[wallet_address] = (txCount.value[wallet_address] || 0) + 1
//       const {topN, wallet_tag} = getWalletTag(data.tx)
//       const item = {
//         ...data.tx,
//         topN, wallet_tag,
//         senderProfile: JSON.parse(data.tx.profile || '{}'),
//         count: txCount.value[wallet_address],
//         time: Math.min(Math.floor(Date.now() / 1000), data.tx.time),
//         uuid: uuid()
//       }
//       wsPairCache.value.unshift(item)

//       if (!isPausedTxs.value) {
//         updatetokenTxs()
//       }
//     }
//   }, 'tx_history')
// }

const updatetokenTxs = useThrottleFn(() => {
  if (wsPairCache.value.length === 0) return

  const newTxs = wsPairCache.value.filter(newTx =>
    !tokenTxs.value.some(existingTx =>
    ('transaction' in existingTx && 'transaction' in newTx && existingTx.transaction === newTx.transaction &&
      existingTx.wallet_address === newTx.wallet_address)
    )
  )

  if (newTxs.length > 0) {
    tokenTxs.value.unshift(...newTxs)

    // 限制数据量，保持性能
    if (tokenTxs.value.length > 1500) {
      tokenTxs.value = tokenTxs.value.slice(0, 1500)
      listStatus.value.page_token = tokenTxs.value[tokenTxs.value.length - 1]?.page_token||''
    }
  }
  wsPairCache.value.length = 0
  triggerRef(tokenTxs)
}, 500)

function confirmDialogFilter() {
  console.log('confirmDialogFilter')
  Object.keys(dialogFilter.value).forEach((key)=>{
    tableFilter.value[key as keyof typeof dialogFilter.value] =
    dialogFilter.value[key as keyof typeof dialogFilter.value]
  })
  if(!dialogFilter.value.markerAddress){
    activeTab.value = 'all'
    tableFilter.value.tag_type = 'all'
  }

  filterSubmit()
  filterDialogVisible.value = false
}

function resetMakerAddress() {
  dialogFilter.value.markerAddress = ''
  tableFilter.value.markerAddress = ''
  resetData(activeTab.value)
  filterSubmit()
}

function resetDialogFilter() {
  minVol.value=''
  maxVol.value=''
  dialogFilter.value = {
    markerAddress: '' as string,
    minVol,
    maxVol,
    timestamp:[] as string[]
  }
  console.log('resetDialogFilter',dialogFilter.value)
  confirmDialogFilter()
}

const disabledStartDate = (date:Date)=>{
  if(dialogFilter.value.timestamp[1]){
    return dayjs(date).isAfter(dayjs((Number(dialogFilter.value.timestamp[1])*1000)))
  }
  return false
}
const disabledEndDate = (date:Date)=>{
  if(dialogFilter.value.timestamp[0]){
    const filterTime0 = dayjs((Number(dialogFilter.value.timestamp[0])*1000))
    return dayjs(date).isBefore(filterTime0) && !dayjs(date).isSame(filterTime0, 'day')
  }
  return false
}
const disabledSave = computed(()=>{
  if(dialogFilter.value.timestamp[1] && dialogFilter.value.timestamp[0]){
    return dialogFilter.value.timestamp[1] < dialogFilter.value.timestamp[0]
  }
  return false
})

function getGradient(row: IGetSimpleTxsResponse) {
  // const str = `true-${isBuy(row)}`
  const str = `${useThemeStore().isDark}-${isBuy(row)}`
  const map = {
    'true-true': 'bg-[linear-gradient(90deg,#111_0%,#12654C_70%,#12B886_100%)]',
    'true-false': 'bg-[linear-gradient(90deg,#111_0%,#7F2A36_70%,#F6465D_100%)]',
    'false-false': 'bg-[linear-gradient(90deg,#F6F9FF_0%,#F6465D_100%)]',
    'false-true': 'bg-[linear-gradient(90deg,#F6F9FF_0%,#12B886_100%)]',
  } as { [key: string]: string }
  return map[str]
}

</script>

<style lang="scss" scoped>
.me-btn {
  background: transparent;
  // color: var(--d-E0E0E0-l-333);
  display: flex;
  align-items: center;
  border: none;
  padding: 2px 0px;

  &.active {
    color: var(--main-text1);
  }
}



/* 响应式表格布局 */
@media (max-width: 479px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(40px, 0.8fr) minmax(100px, 3.5fr) minmax(60px, 1.5fr) minmax(30px, 0.7fr);
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(45px, 0.8fr) minmax(100px, 3.2fr) minmax(80px, 1.8fr) minmax(35px, 0.7fr);
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(50px, 1fr) minmax(100px, 3fr) minmax(80px, 2fr) minmax(40px, 0.8fr);
  }
}

@media (min-width: 1200px) {
  .grid.grid-cols-\[minmax\(50px\,1fr\)_minmax\(100px\,3fr\)_minmax\(80px\,2fr\)_minmax\(40px\,0\.8fr\)\] {
    grid-template-columns: minmax(60px, 1.2fr) minmax(120px, 3fr) minmax(100px, 2.5fr) minmax(45px, 1fr);
  }
}

.grid {
  transition: grid-template-columns 0.3s ease;
  contain: layout style;
  will-change: grid-template-columns;
}

.relative.overflow-hidden.cursor-pointer {
  contain: layout;
  will-change: auto;
}

.text-nowrap {
  contain: layout;
}

@media (hover: none) and (max-width: 768px) {
  .relative.overflow-hidden.cursor-pointer {
    min-height: 44px;
  }

  .text-right .flex.items-center.justify-end {
    flex-wrap: wrap;
    gap: 2px;
  }
}

@media (max-width: 479px) {
  .text-12px {
    font-size: 11px;
  }

  .gap-20px {
    gap: 8px;
  }

  .py-4px {
    padding-top: 2px;
    padding-bottom: 2px;
  }
}

@media (min-width: 480px) and (max-width: 767px) {
  .truncate.min-w-0 {
    max-width: 60px;
  }

  .w-12px.h-12px {
    width: 11px;
    height: 11px;
  }
}
.collapse-enter-from {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.collapse-enter-to {
  max-height: 50px; /* 预估最大高度，需根据内容调整 */
  opacity: 1;
  padding-bottom: 13px;
}
.collapse-enter-active {
  transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
}

/* 离开阶段 */
.collapse-leave-from {
  max-height: 50px;
  opacity: 1;
  padding-bottom: 13px;
}
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.collapse-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
}
:deep() .w-orderBookDialog.el-dialog{
   .el-dialog__header .el-dialog__title{
    color:var(--main-text1)
  }
  .el-dialog__body{
    color:var(--main-text1)
  }
}
</style>
