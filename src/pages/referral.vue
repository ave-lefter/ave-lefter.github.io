<template>
  <div class="referral dark flex-1 color-#FFF">
    <div class="container">
      <div v-if="referralInfo?.refCode" class="flex items-center justify-between">
        <div>
          <div class="flex items-center">
            <img :src="generateAvatarIcon(walletName)" class="w-60px h-60px rd-50% mr-19px" alt="" srcset="">
            <div class="text-16px">
              <div class="color-#fff font-500 flex items-center">
                <span>{{ walletName }}</span>
                <div class="h-20px px-10px text-10px flex items-center rd-2px ml-10px" style="background: linear-gradient(76.98deg, #2BAEEA 3.79%, #2561F6 102.2%);">{{ referralInfo?.refCode ? referralInfo?.vip?.toUpperCase() || $t('ordinary') : $t('viewAfterLogin') }}</div>
              </div>
              <div class="text-14px color-#697F95 mt-8px">{{ botStore.userInfo?.name }}</div>
            </div>
          </div>
          <div class="bg-#FFFFFF0D p-20px font-400 rd-8px mt-20px min-w-450px" style="border: 1px solid #FFFFFF17;">
            <div class="text-14px color-#697F95 flex">
              <span class="mr-auto">{{ $t('referralLink') }}</span>
              <span class="color-#fff ml-10px">{{ refCode ? shareLink : '--' }}</span>
              <img
                v-if="refCode"
                v-copy="shareLink"
                class="clickable"
                style="margin-left: 8px"
                height="14"
                width="14"
                src="~@/assets/images/referral/copy.svg"
                alt=""
                srcset=""
              >
            </div>
            <div class="text-14px color-#697F95 mt-20px flex">
              <span class="mr-auto">{{ $t('referralCode') }}</span>
              <span class="color-#fff ml-10px">{{ refCode || '--' }}</span>
              <img
                v-if="refCode"
                v-copy="refCode"
                class="clickable"
                style="margin-left: 8px"
                height="14"
                width="14"
                src="~@/assets/images/referral/copy.svg"
                alt=""
                srcset=""
              >
            </div>
          </div>

          <template v-if="getNextVip(referralInfo?.vip || '')">
            <template v-if="getNextVip(referralInfo?.vip || '') === 'SVIP'">
              <div class="mt-20px text-12px color-#697F95">{{ $t('SVIPApplyTips') }} <span class="color-#27BDFD underline clickable" @click.stop="show4=true">{{ $t('applySvip') }}</span></div>
            </template>
            <template v-else>
              <div class="mt-20px text-14px color-#2BB1EA">{{ $t('upgradeTips') }} {{ getNextVip(referralInfo?.vip || '') }}</div>
              <div class="flex items-center color-#697F95 text-14px mt-16px">
                <span class="mr-auto">{{ $t('invitees1') }}</span>
                <span class="color-#fff">{{ referralInfo?.totalInvitees || 0 }}</span><span>/{{ (referralInfo?.nextLevelInvitees || 0) }}</span>
              </div>
            </template>
          </template>
        </div>
        <VIP :referralInfo="referralInfo" :vip="referralInfo?.vip" />
      </div>
      <div v-else class="flex items-center justify-between">
        <div>
          <div :class="localeStore.locale?.includes('zh') ? 'text-48px' : 'text-27px op-70'">{{ $t('inviteYourFriends') }}</div>
          <div class="font-700 mt-20px mb-40px" :class="localeStore.locale?.includes('zh') ? 'text-56px' : 'text-46px'" v-html="$t('shareAndEarn')"/>
          <el-button size="large" color="#298AF0" class="min-h-50px min-w-250px rd-25px" @click.stop="invite">
            <img class="mr-5px h-25px" src="../assets/images/referral/gift.svg" alt="" srcset="">
            <span class="text-18px font-600">{{ $t('loginForInvite') }}</span>
          </el-button>
        </div>
        <img class="h-350px" src="../assets/images/referral/bg-3.png" alt="" srcset="">
      </div>

      <div class="text-24px mb-20px mt-100px">{{ $t('inviteActivity') }}</div>
      <div class="flex items-center gap-30px">
        <div class="flex justify-between items-center p-28px pr-10px rd-8px min-w-380px h-180px relative bg-1">
          <div class="pr-101px">
            <div class="text-27px font-600 mb-10px">{{ $t('inviteFriends') }}</div>
            <div class="text-14px font-400">{{ $t('inviteYourFriendsToRegister') }}</div>
            <button class="text-14px font-400 clickable min-w-120px min-h-34px rd-17px border-none color-btn-lg mt-20px flex items-center justify-center color-#fff" @click.stop="invite">{{ $t('joinNow') }}</button>
          </div>
          <img class="w-113px h-113px absolute right-10px top-50% translate-y--50%" src="../assets/images/referral/bg-4-1-1.png">
        </div>
        <div class="flex justify-between items-center p-28px pr-10px rd-8px min-w-380px h-180px relative bg-2">
          <div class="pr-101px">
            <div class="text-27px font-600 mb-10px">{{ $t('SVIPApply') }}</div>
            <div class="text-14px font-400">{{ $t('highestCommission') }}</div>
            <button class="text-14px font-400 clickable min-w-120px min-h-34px rd-17px border-none color-btn-lg-2 mt-20px flex items-center justify-center color-#fff" @click.stop="svipApplyShow=true">{{ $t('applyForActivation') }}</button>
          </div>
          <img class="w-113px h-113px absolute right-10px top-50% translate-y--50%" src="../assets/images/referral/bg-4-1-2.png">
        </div>
        <div class="flex justify-between items-center p-28px pr-10px rd-8px min-w-380px h-180px relative bg-3">
          <div class="pr-101px">
            <div class="text-27px font-600 mb-10px">Ave.ai {{ $t('partnership') }}</div>
            <div class="text-14px font-400">{{ $t('ecologicalEmpowerment') }}</div>
            <button class="text-14px font-400 clickable min-w-120px min-h-34px rd-17px border-none color-btn-lg-3 mt-20px flex items-center justify-center color-#fff" @click.stop="apply">{{ $t('learnMore') }}</button>
          </div>
          <img class="w-115px h-115px absolute right-10px top-50% translate-y--50%" src="../assets/images/referral/bg-4-1-3.png">
        </div>
      </div>

      <template v-if="referralInfo?.refCode">
        <div class="section-title mt-80px">
          <!-- <img width="28" height="28" src="@/assets/images/referral/data.svg" alt="" srcset="" > -->
          <span>{{ $t('dataOverview') }}</span>
        </div>
        <ul class="data-list">
          <li class="data-card">
            <div>
              <div class="data-card_label">{{ $t('withdrawable1') }}</div>
              <div class="text-20px lh-26px">
                ${{ formatNumber(referralInfo?.totalWithdrawableIncome || referralInfo?.totalWithdrawableAmount || 0) }}
              </div>
              <div class="data-card_label mt-24px">{{ $t('withdrawn1') }}</div>
              <div class="text-20px lh-26px">
                ${{
                  formatNumber(
                    (referralInfo?.totalIncomeAmount || 0)
                  )
                }}
              </div>
            </div>
            <!-- <button class="w-btn clickable" v-if="referralInfo?.canWithdraw" >提现</button> -->
            <el-button
              v-if="referralInfo?.canWithdraw"
              :loading="loading"
              type="primary"
              size="large"
              @click.stop="createWithdrawIncomeOrder"
              >{{ $t('withdraw') }}</el-button
            >
          </li>
          <li class="data-card">
            <div>
              <div class="flex">
                <div>
                  <div class="data-card_label">{{ $t('botWalletRef') }}</div>
                  <div class="text-20px lh-26px">
                    $ {{ formatNumber(referralInfo?.botSwapTotalIncome || 0) }}
                  </div>
                </div>

                <!-- <div v-show="(referralInfo?.botChannelRefRatio || referralInfo?.channelRefRatio || 0) > 0" class="data-card_label mt-24px">
                  {{ $t('totalChannelRebate') }}
                </div>
                <div v-show="(referralInfo?.botChannelRefRatio || referralInfo?.channelRefRatio || 0) > 0" class="text-20px lh-26px">
                  $ {{ formatNumber(referralInfo?.botSwapChannelIncome || referralInfo?.channelReferralIncomeAmount || 0) }}
                </div> -->
              </div>
              <div class="flex mt-24px justify-between">
                <div>
                  <div class="data-card_label">{{ $t('chainWalletRef') }}</div>
                  <div class="text-20px lh-26px">
                    $ {{ formatNumber(referralInfo?.chainSwapTotalIncome || 0) }}
                  </div>
                </div>
                <div>
                  <div class="data-card_label">{{ $t('perpetualRef') }}</div>
                  <div class="text-20px lh-26px">
                    $ {{ formatNumber(referralInfo?.perpTotalIncome || 0) }}
                  </div>
                </div>
              </div>

            </div>
          </li>
          <li class="data-card">
            <div>
              <div class="data-card_label">{{ $t('totalInvitees') }}</div>
              <div class="text-20px lh-26px">{{ referralInfo?.totalInvitees || 0 }}</div>
              <div class="data-card_label mt-24px">{{ $t('swapInvitees24H') }}</div>
              <div class="text-20px lh-26px">{{ referralInfo?.swapInvitees24H || 0 }}</div>
            </div>
          </li>
        </ul>
        <div class="section-title mt-80px">
          <span>{{ $t('tieredCommission') }}</span>
          <!-- <Icon v-tooltip="{
            content: $t('tieredCommissionTips'),
            props: {
              'popper-class': 'max-w-200px',
            }
          }" name="line-md:question-circle" color="#697F95" class="ml-5px text-18px clickable" /> -->
        </div>
        <ul class="flex items-center justify-between gap-30px">
          <li class="bg-#FFFFFF0D p-24px rd-4px mt-8px flex-1">
            <div class="text-16px font-500 color-#fff mb-16px">L1 {{ $t('commissionStatistics') }}</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('invitees1') }}</div>
                <div class="text-14px color-#fff">{{ levelsReferralInfo?.l1?.invited || 0 }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('chainCommission') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.l1?.refFee || 0, 2) }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('perpCommission') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.l1?.perpRefFee || 0, 2) }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('totalChainSwapValue') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.l1?.swapValue || 0, 2) }}</div>
              </div>
            </div>
          </li>
          <li class="bg-#FFFFFF0D p-24px rd-4px mt-8px flex-1">
            <div class="text-16px font-500 color-#fff mb-16px">L2 {{ $t('commissionStatistics') }}</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('invitees1') }}</div>
                <div class="text-14px color-#fff">{{ levelsReferralInfo?.l2?.invited || 0 }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('chainCommission') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.l2?.refFee || 0, 2) }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('perpCommission') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.l2?.perpRefFee || 0, 2) }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('totalChainSwapValue') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.l2?.swapValue || 0, 2) }}</div>
              </div>
            </div>
          </li>
          <!-- <li class="bg-#FFFFFF0D p-24px rd-4px mt-8px flex-1">
            <div class="text-16px font-500 color-#fff mb-16px">{{ $t('other') }} {{ $t('commissionStatistics') }}</div>
            <div class="flex items-center justify-between">
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('invitees1') }}</div>
                <div class="text-14px color-#fff">{{ levelsReferralInfo?.other?.invited || 0 }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('commissionValue') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.other?.refFee || 0, 2) }}</div>
              </div>
              <div>
                <div class="color-#697F95 text-14px mb-8px">{{ $t('totalSwapValue') }}</div>
                <div class="text-14px color-#fff">${{ formatNumber2(levelsReferralInfo?.other?.swapValue || 0, 2) }}</div>
              </div>
            </div>
          </li> -->
        </ul>
        <div class="section-title mt-80px">
          <!-- <img width="28" height="28" src="@/assets/images/referral/data.svg" alt="" srcset="" > -->
          <span>{{ $t('myRecord') }}</span>
        </div>
        <div class="mt-20px relative">
          <div class="tabs mb-20px">
            <button v-for="item in tabs" :key="item.value" class="tab-item" :class="{ active: activeTab === item.value }" @click.stop="activeTab = item.value">{{ item.label }}</button>
          </div>
          <div v-if="activeTab === 1">
            <div v-if="referralInfo?.startTime || referralInfo?.endTime" class="text-right text-12px color-#697F95 absolute right-0 top-5px">({{ $t('statisticalPeriod') }}:
            {{ referralInfo.startTime ? formatDate(referralInfo.startTime, 'YYYY.MM.DD') : '' }}-{{
              referralInfo.endTime ? formatDate(referralInfo.endTime, 'YYYY.MM.DD') : ''
            }})</div>
            <el-table
              :data="withdrawableListPage"
              row-class-name="[--el-table-border:1px_solid_#1F242A]"
              :header-row-style="{ fontSize: '12px', color: '#697F95' }"
              style="width: 100%"
              class="table-list mt-0!"
            >
              <el-table-column prop="time" :label="$t('swapToken')">
                <template #default="{ row }">
                  <div class="flex-start items-center">
                    <div class="token-box position-relative">
                      <img
                        class="icon-logo"
                        :src="`${globalConfig.token_logo_url}${row.logoUrl}`"
                        alt=""
                        :onerror="`this.src='${getSymbolDefaultIcon(row.chain, row.symbol)}'`"
                      >
                      <img
                        class="icon-chain"
                        :src="`${globalConfig.token_logo_url}chain/${row.chain}.png`"
                        alt=""
                        srcset=""
                      >
                    </div>
                    <span class="ml-5px">{{ row.symbol }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="source" :label="$t('source')">
                <template #default="{ row }">
                  {{ formatRewardType(row.rewardType) }}
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('amount')">
                <template #default="{ row }">
                  <div style="line-height: 1">
                    {{ formatNumber(formatAmount(row.amount || row.value || 0, row.decimals || 0)) }} {{ row.symbol }}
                  </div>
                  <div
                    style="
                      font-size: 12px;
                      color: #697F95;
                      line-height: 1;
                      margin-top: 3px;
                      font-weight: 400;
                    "
                  >
                    ≈${{
                      formatNumber(row.amountUSD ||
                        Number(formatAmount(row.value || 0, row.decimals || 0)) * Number(row.price || 0)
                      )
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="level" :label="$t('status')" align="right">
                <template #default="{ row }">
                  <span :style="{ color: row.canWithdraw ? '#ffffff' : '#666' }">{{
                    row.canWithdraw ? $t('canWithdraw') : $t('nonWithdrawable')
                  }}</span>
                </template>
              </el-table-column>
              <template #empty>
                <div class="flex items-center justify-center flex-col pt-20px">
                  <img src="@/assets/images/empty-black.svg" alt="" >
                  {{ $t('emptyNoData') }}
                </div>
              </template>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage1"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="withdrawableList?.length || 0"
                @current-change="handleCurrentChange1"
              />
            </div>
          </div>
          <div v-else-if="activeTab === 2">
            <el-table
              :data="inviteeList"
              row-class-name="[--el-table-border:1px_solid_#1F242A]"
              :header-row-style="{ fontSize: '12px', color: '#697F95' }"
              style="width: 100%"
              class="table-list"
              @sort-change="handleInviteeSortChange"
            >
              <el-table-column prop="bindRefTime" :label="$t('registerTime')" sortable="custom">
                <template #default="{ row }">
                  {{ formatDate(row.bindRefTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="username" :label="$t('friendName')">
                <template #default="{ row }">
                  {{ row?.username }}
                </template>
              </el-table-column>
              <el-table-column prop="remark" :label="$t('remark')">
                <template #default="{ row }">
                  <div class="flex items-center">
                    <div v-if="editingRemarkGuid !== row.guid">{{ row?.remark || '--' }}</div>
                    <form v-else class="flex items-center gap-5px" @submit.prevent="confirmEditRemark(row)" >
                      <el-input v-model="editingRemarkValue" size="small" :placeholder="t('remark')" maxlength="16" />
                      <el-button native-type="submit" size="small" type="primary" :loading="editingRemarkLoading">{{ $t('save') }}</el-button>
                      <el-button native-type="button" size="small" class="ml-0!" @click.stop="cancelEditRemark">{{ $t('cancel') }}</el-button>
                    </form>
                    <Icon
                      v-if="editingRemarkGuid !== row.guid"
                      name="custom:editor"
                      class="ml-8px clickable text-12px color-#697F95"
                      @click.stop="startEditRemark(row)"
                    />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('commission')">
                <template #default="{ row }">
                  ${{ formatNumber(new BigNumber(row?.refFee || '0').plus(new BigNumber(row?.perpRefFee || '0')).toFixed(), 2) }}
                </template>
              </el-table-column>
                <el-table-column prop="lastSwap" :label="$t('lastSwap')" sortable="custom">
                <template #default="{ row }">
                  {{ row?.lastSwap ? formatDate(row.lastSwap) : '--' }}
                </template>
              </el-table-column>
              <el-table-column prop="level" :label="$t('vipLevel')" align="right">
                <template #default="{ row }">
                  {{ row?.vip || $t('ordinary') }}
                </template>
              </el-table-column>
              <template #empty>
                <div class="flex items-center justify-center flex-col pt-20px">
                  <img src="@/assets/images/empty-black.svg" alt="" >
                  {{ $t('emptyNoData') }}
                </div>
              </template>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                mode="dark"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total || 0"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
          <div v-else-if="activeTab === 3">
            <el-table
              :data="withdrawRecordListPage"
              row-class-name="[--el-table-border:1px_solid_#1F242A]"
              :header-row-style="{ fontSize: '12px', color: '#697F95' }"
              style="width: 100%"
              class="table-list"
            >
              <el-table-column prop="time" :label="$t('date')">
                <template #default="{ row }">
                  {{ formatDate(row.createTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('token')">
                <template #default="{ row }">
                  <template v-for="(j, k) in row.list || []" :key="k">
                    <div v-if="j.rewardType !== 'chain_swap,perp_swap'"
                      style="line-height: 24px; height: 24px; width: 24px"
                      class="token-box position-relative t-l">
                      <img
                        class="icon-logo"
                        style="height: 24px; width: 24px"
                        :src="`${globalConfig.token_logo_url}${j.tokenLogoUrl}`"
                        alt=""
                        :onerror="`this.src='${getSymbolDefaultIcon(j.chain, j.tokenSymbol)}'`"
                      >
                      <img
                        class="icon-chain"
                        :src="`${globalConfig.token_logo_url}chain/${j.chain}.png`"
                        alt=""
                        srcset=""
                      >
                      <span class="ml-5px"> {{ j.tokenSymbol }}</span>
                    </div>
                    <template v-else>
                      <div v-if="Number(j.withdrawAveswapValue || 0)" style="line-height: 24px; height: 24px; width: 24px"
                      class="token-box position-relative t-l">
                        <img
                          class="icon-logo"
                          style="height: 24px; width: 24px"
                          :src="`${globalConfig.token_logo_url}${j.tokenLogoUrl}`"
                          alt=""
                          :onerror="`this.src='${getSymbolDefaultIcon(j.chain, j.tokenSymbol)}'`"
                        >
                        <img
                          class="icon-chain"
                          :src="`${globalConfig.token_logo_url}chain/${j.chain}.png`"
                          alt=""
                          srcset=""
                        >
                        <span class="ml-5px"> {{ j.tokenSymbol }}</span>
                      </div>
                      <div v-if="Number(j.withdrawPerpValue || 0)" style="line-height: 24px; height: 24px; width: 24px"
                      class="token-box position-relative t-l">
                        <img
                          class="icon-logo"
                          style="height: 24px; width: 24px"
                          :src="`${globalConfig.token_logo_url}${j.tokenLogoUrl}`"
                          alt=""
                          :onerror="`this.src='${getSymbolDefaultIcon(j.chain, j.tokenSymbol)}'`"
                        >
                        <img
                          class="icon-chain"
                          :src="`${globalConfig.token_logo_url}chain/${j.chain}.png`"
                          alt=""
                          srcset=""
                        >
                        <span class="ml-5px"> {{ j.tokenSymbol }}</span>
                      </div>
                    </template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('amount')">
                <template #default="{ row }">
                  <!-- <div v-for="(j, k) in row.list || []" :key="k" style="line-height: 24px" class="t-l">
                    {{ formatNumber(formatAmount(j.withdrawValue || 0, j.tokenDecimals || 0)) }}
                  </div> -->
                  <template v-for="(j, k) in row.list || []" :key="k">
                    <div v-if="j.rewardType !== 'chain_swap,perp_swap'" style="line-height: 24px" class="t-l">
                      {{ formatNumber(formatAmount(j.withdrawValue || 0, j.tokenDecimals || 0)) }}
                    </div>
                    <template v-else>
                      <div v-if="Number(j.withdrawAveswapValue || 0)" class="t-l lh-24px">
                        {{ formatNumber(formatAmount(j.withdrawAveswapValue || 0, j.tokenDecimals || 0)) }}
                      </div>
                      <div v-if="Number(j.withdrawPerpValue || 0)" class="t-l lh-24px">
                        {{ formatNumber(formatAmount(j.withdrawPerpValue || 0, j.tokenDecimals || 0)) }}
                      </div>
                    </template>

                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="rewardType" :label="$t('source')">
                <template #default="{ row }">
                  <template v-for="(j, k) in row.list || []" :key="k">
                    <div v-if="j.rewardType !== 'chain_swap,perp_swap'" style="line-height: 24px" class="t-l">
                      {{ formatRewardType(j.rewardType) }}
                    </div>
                    <template v-else>
                      <div v-if="Number(j.withdrawAveswapValue || 0)" class="t-l lh-24px">
                        {{ formatRewardType('chain_swap') }}
                      </div>
                      <div v-if="Number(j.withdrawPerpValue || 0)" class="t-l lh-24px">
                        {{ formatRewardType('perp_swap') }}
                      </div>
                    </template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="level" :label="$t('withdrawalStatus')" align="left">
                <template #default="{ row }">
                  <template v-for="(j, k) in row.list || []" :key="k" >
                    <div v-if="j.rewardType !== 'chain_swap,perp_swap'" style="line-height: 24px" class="t-l">
                      <span
                        class="clickable"
                        :style="{ color: formatStatusColor(j.status) }"
                        @click.stop="goLink(j)"
                        >{{ formatStatus(j.status) }}</span
                      >
                    </div>
                    <template v-else>
                      <div  v-if="Number(j.withdrawAveswapValue || 0)" style="line-height: 24px" class="t-l">
                        <span
                          class="clickable"
                          :style="{ color: formatStatusColor(j.status) }"
                          @click.stop="goLink(j)"
                          >{{ formatStatus(j.status) }}</span
                        >
                      </div>
                      <div v-if="Number(j.withdrawPerpValue || 0)"  style="line-height: 24px" class="t-l">
                        <span
                          class="clickable"
                          :style="{ color: formatStatusColor(j.status) }"
                          @click.stop="goLink(j)"
                          >{{ formatStatus(j.status) }}</span
                        >
                      </div>
                    </template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column
                prop="level"
                :label="$t('totalStatus')"
                align="center"
                :width="localeStore.locale.includes('zh') ? 100 : 120"
              >
                <template #default="{ row }">
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    "
                  >
                    <img
                      v-show="row.status === 'inprogress'"
                      height="16"
                      width="16"
                      src="@/assets/images/referral/pending.svg"
                      alt=""
                      srcset=""
                    >
                    <img
                      v-show="row.status === 'finished'"
                      height="16"
                      width="16"
                      src="@/assets/images/referral/finished.svg"
                      alt=""
                      srcset=""
                    >
                    <span style="margin-top: 1px" :style="{ color: formatStatusColor(row.status) }">{{ formatStatus(row.status) }}</span>
                  </div>
                </template>
              </el-table-column>
              <template #empty>
                <div class="flex items-center justify-center flex-col pt-20px">
                  <img src="@/assets/images/empty-black.svg" alt="" >
                  {{ $t('emptyNoData') }}
                </div>
              </template>
            </el-table>
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage2"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="withdrawRecordList?.length || 0"
                @current-change="handleCurrentChange2"
              />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
  <el-dialog
    v-model="dialogShare"
    class="dialog-rebate dark"
    title=""
    width="800"
    destroy-on-close
    append-to-body
  >
      <div class="flex items-center justify-between pt-20px pb-30px">
        <div>
          <div class="text-18px">{{ $t('inviteYourFriends') }}</div>
          <div class="text-33px font-700 mt-20px mb-40px" v-html="$t('shareAndEarn')"/>
          <div class="bg-#FFFFFF0D p-20px font-400 rd-8px mt-50px min-w-450px" style="border: 1px solid #FFFFFF17;">
            <div class="text-14px color-#697F95 flex">
              <span class="mr-auto">{{ $t('referralLink') }}</span>
              <span class="color-#fff ml-10px">{{ refCode ? shareLink : '--' }}</span>
              <img
                v-if="refCode"
                v-copy="shareLink"
                class="clickable"
                style="margin-left: 8px"
                height="14"
                width="14"
                src="~@/assets/images/referral/copy.svg"
                alt=""
                srcset=""
              >
            </div>
            <div class="text-14px color-#697F95 mt-20px flex">
              <span class="mr-auto">{{ $t('referralCode') }}</span>
              <span class="color-#fff ml-10px">{{ refCode || '--' }}</span>
              <img
                v-if="refCode"
                v-copy="refCode"
                class="clickable"
                style="margin-left: 8px"
                height="14"
                width="14"
                src="~@/assets/images/referral/copy.svg"
                alt=""
                srcset=""
              >
            </div>
          </div>
        </div>
        <img class="h-200px" src="../assets/images/referral/bg-3.png" alt="" srcset="">
      </div>
  </el-dialog>
  <el-dialog
    v-model="svipApplyShow"
    class="dialog-rebate"
    title=""
    width="700"
    destroy-on-close
    append-to-body
  >
    <div class="dialog-content color-#fff px-15px pt-20px pb-40px">
      <div class="text-center text-27px font-600 color-#E0A252">{{ $t('SVIPApply') }}</div>
      <div class="text-center">
        <img class="w-200px" src="../assets/images/referral/v.png" alt="" srcset="">
      </div>
      <div class="text-14px color-#fff lh-28px text-center mb-25px">
          {{ $t('applyingToBecomeSVIP') }}<br>
          <div class="color-#E0A252">{{ $t('pleaseContactEmail') }}: <button v-copy="`andy@ave.ai`" href="mailto:andy@ave.ai" class="clickable bg-transparent border-none color-#E0A252" >andy@ave.ai</button><br>
          Telegram: <a href="https://t.me/AndyMong917" target="_blank" class="clickable" >https://t.me/AndyMong917</a></div>
          {{ $t('lookForwardToWorkingWithYou') }}
      </div>
      <div class="flex items-center justify-center">
        <el-button class="max-h-40px min-w-350px" color="#E0A252" block round @click.stop="svipApplyShow=false">{{ $t('IGetIt') }}</el-button>
      </div>

    </div>
  </el-dialog>
  <el-dialog v-model="dialogConnect" class="dialog-rebate" width="460" append-to-body destroy-on-close>
    <template #header>
      <div class="flex-start">
        <img width="24" height="24" src="@/assets/images/referral/n.svg" alt="" srcset="" >
        <span style="margin-left: 8px; font-size: 24px; color: #f5f5f5">{{
          $t('inviteCodeUpdate')
        }}</span>
      </div>
    </template>
    <div style="border-top: 1px solid #333; width: calc(100% + 80px); margin-left: -40px" />
    <div
      style="
        font-size: 16px;
        font-weight: 400;
        color: #ffffff;
        line-height: 24px;
        padding-top: 20px;
      "
      v-html="$t('chainWalletNotRefer')"
    />
    <el-button
      style="width: 100%; margin-top: 40px"
      block
      :loading="loading"
      type="primary"
      size="large"
      @click.stop="dialogConnect = false"
      >{{ $t('getIt') }}</el-button
    >
  </el-dialog>
</template>

<script setup lang="ts">
import {
  getReferralInfo as getReferralInfoApi,
  getInviteeList as getInviteeListApi,
  createWithdrawIncomeOrder as createWithdrawIncomeOrderApi,
  getWithdrawRecordList as getWithdrawRecordListApi,
  getLevelsReferralInfo,
  setInviteeRemark as setInviteeRemarkApi,
} from '~/api/referral'
import { formatExplorerUrl } from '~/utils'
import BigNumber from 'bignumber.js'
import QRCode from 'qrcode'
import VIP from '../components/vip.vue'

// 类型定义
interface ReferralInfo {
  username: string
  canWithdraw: boolean
  vip: '' | 'vip1' | 'vip2' | 'vip3' | 'svip'
  minWithdraw: string
  refCode: string
  startTime: string
  endTime: string
  totalIncomeAmount: string
  swapInvitees24H: number
  totalInvitees: number
  totalWithdrawableIncome: string
  botChannelRefRatio: number
  botRefRatio: number
  chainRefRatio: number
  botSwapReferralIncome: string
  botSwapChannelIncome: string
  botSwapTotalIncome: string
  chainSwapTotalIncome: string
  nextLevelInvitees: number
  perpRefRatio: number
  perpTotalIncome: string
  withdrawableList?: WithdrawableItem[]
}

interface InviteeItem {
  level: number
  guid: string
  bindRefTime: number
  username: string
  vip?: string
  remark?: string
  lastSwap?: number
  refFee?: string
  perpRefFee?: string
}

interface WithdrawableItem {
  chain: string
  walletAddress: string
  address: string
  symbol: string
  name: string
  decimals: number
  logoUrl: string
  amount: string
  amountUSD: string
  price: string
  canWithdraw: boolean
  rewardType: 'bot_swap' | 'chain_swap' | 'chain_perp'
}

interface WithdrawRecordItem {
  id: number
  createTime: string
  status: WithdrawStatus
  guid: string
  batchId: string
  chain: string
  withdrawAddress: string
  tokenAddress: string
  tokenSymbol: string
  tokenDecimals: number
  tokenLogoUrl: string
  withdrawValue: string
  withdrawAveswapValue: string
  withdrawPerpValue: string
  txHash?: string
  errorLog?: string
  rewardType: 'bot_swap' | 'chain_swap' | 'chain_perp'
}

interface WithdrawRecord {
  batchId: string
  createTime: string
  status: WithdrawStatus
  list: WithdrawRecordItem[]
}

type WithdrawStatus =
  | 'finished'
  | 'inprogress'
  | 'generated'
  | 'error'
  | 'confirmed'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'timeout_error'

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const referralInfo = ref<ReferralInfo>({
  refCode: '',
  withdrawableList: [],
} as any)
const inviteeList = ref<InviteeItem[]>([])
// invitee 列表排序参数（server side）
const inviteeSortBy = ref<'invite' | 'swap' | ''>('swap')
const inviteeSortOrder = ref<'asc' | 'desc' | ''>('desc')
// 编辑备注状态
const editingRemarkGuid = ref<string | null>(null)
const editingRemarkValue = ref<string>('')
const editingRemarkLoading = ref(false)
const currentPage1 = ref(1)
const total = ref(0)
const withdrawRecordList = ref<WithdrawRecord[]>([])
const currentPage2 = ref(1)
const loading = ref(false)
const dialogShare = ref(false)
const shareImgCanvas = ref<HTMLCanvasElement | null>(null)
const qrCodeUrl = ref('')
const currentPage3 = ref(1)
const dialogConnect = ref(false)

const show4 = ref(false)
const svipApplyShow = ref(false)

// Store
const botStore = useBotStore()
const globalStore = useGlobalStore()
const { t } = useI18n()
const localeStore = useLocaleStore()
const walletStore = useWalletStore()

const activeTab = ref(1)

const tabs = computed(() => {
  return [
    {
      label: t('pendingRebate'),
      value: 1,
    },
    {
      label: t('invitedUser'),
      value: 2,
    },
    {
      label: t('withdrawalRecord'),
      value: 3,
    },
  ]
})

// 计算属性
const refCode = computed(() => {
  return referralInfo.value.refCode || ''
})

const walletName = computed(() => {
  return referralInfo.value?.username || ''
})

const invitees = computed(() => {
  return (
    (referralInfo.value?.invitees1 || 0) +
    (referralInfo.value?.invitees2 || 0) +
    (referralInfo.value?.invitees3 || 0)
  )
})

const globalConfig = computed(() => ({
  token_logo_url: globalStore.token_logo_url,
}))

const shareLink = computed(() => {
  const inviterUrl = 'https://share.ave.ai'
  const lang = globalStore.lang?.includes('zh') ? 'zh-cn' : 'en'
  return inviterUrl + `?lang=${lang}&code=${refCode.value}`
})

// 移除未使用的计算属性

const withdrawableList = computed(() => {
  return referralInfo.value?.withdrawableList || []
})

const withdrawableListPage = computed(() => {
  return withdrawableList.value?.slice?.(
    (currentPage1.value - 1) * pageSize.value,
    currentPage1.value * pageSize.value
  )
})

const withdrawRecordListPage = computed(() => {
  return withdrawRecordList.value?.slice?.(
    (currentPage2.value - 1) * pageSize.value,
    currentPage2.value * pageSize.value
  )
})

const levelsReferralInfo = ref<Awaited<ReturnType<typeof getLevelsReferralInfo>> | null>(null)
function _getLevelsReferralInfo() {
  getLevelsReferralInfo().then(res => {
    levelsReferralInfo.value = res
  })
}

// 方法
const init = () => {
  if (botStore.accessToken) {
    getReferralInfo()
    getInviteeList()
    getWithdrawRecordList()
    _getLevelsReferralInfo()
  } else {
    referralInfo.value = {
      refCode: '',
      withdrawableList: [],
    } as any
    total.value = 0
    currentPage.value = 1
    currentPage1.value = 1
    currentPage2.value = 1
    currentPage3.value = 1
    inviteeList.value = []
    withdrawRecordList.value = []
  }
}

const getReferralInfo = async () => {
  try {
    const res = await getReferralInfoApi()
    if (!referralInfo.value.refCode) {
      referralInfo.value = res
    } else {
      referralInfo.value = { ...res, refCode: referralInfo.value.refCode }
    }
  } catch (error) {
    console.error('获取推荐信息失败:', error)
  }
}

const getInviteeList = async () => {
  try {
    const data: any = { pageNo: currentPage.value - 1, pageSize: pageSize.value }
    if (inviteeSortBy.value) {
      data.sortBy = inviteeSortBy.value
      if (inviteeSortOrder.value) data.sortOrder = inviteeSortOrder.value
    }
    const res = await getInviteeListApi(data)
    inviteeList.value = Array.isArray(res?.userItems) ? res.userItems : []
    total.value = res?.totalUserCount || 0
  } catch (error) {
    console.error('获取邀请列表失败:', error)
  }
}

// 处理表格排序（bindRefTime -> invite, lastSwap -> swap）
function handleInviteeSortChange({ prop, order }: { prop: string; order: string }) {
  if (!prop) return
  if (prop === 'bindRefTime') {
    inviteeSortBy.value = 'invite'
  } else if (prop === 'lastSwap') {
    inviteeSortBy.value = 'swap'
  } else {
    inviteeSortBy.value = ''
  }
  inviteeSortOrder.value = order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''
  currentPage.value = 1
  getInviteeList()
}

function startEditRemark(row: InviteeItem) {
  editingRemarkGuid.value = row.guid
  editingRemarkValue.value = (row.remark || '').slice(0, 16)
}

function cancelEditRemark() {
  editingRemarkGuid.value = null
  editingRemarkValue.value = ''
}

async function confirmEditRemark(row: InviteeItem) {
  if (!editingRemarkGuid.value) return
  // 长度校验
  if ((editingRemarkValue.value || '').length > 16) {
    ElMessage.error(t('remarkMaxLength') || '备注长度不能超过16')
    return
  }
  editingRemarkLoading.value = true
  try {
    await setInviteeRemarkApi(row.guid, editingRemarkValue.value || '')
    // 更新本地数据
    const idx = inviteeList.value.findIndex(i => i.guid === row.guid)
    if (idx !== -1) {
      inviteeList.value[idx] = { ...inviteeList.value[idx], remark: editingRemarkValue.value }
    }
    ElMessage.success(t('saveSuccess'))
    cancelEditRemark()
  } catch (err: any) {
    const msg = err?.data?.message || err?.message || '保存失败'
    ElMessage.error(msg)
  } finally {
    editingRemarkLoading.value = false
  }
}

const getWithdrawRecordList = async () => {
  try {
    const res = await getWithdrawRecordListApi()
    withdrawRecordList.value = res
  } catch (error) {
    console.error('获取提现记录失败:', error)
  }
}

const handleCurrentChange = (page: number) => {
  console.log(`current page: ${page}`)
  currentPage.value = page
  getInviteeList()
}

const handleCurrentChange1 = (page: number) => {
  currentPage1.value = page
}

const handleCurrentChange2 = (page: number) => {
  currentPage2.value = page
}

// 移除未使用的函数

const formatAmount = (amount: string | number, decimals: number) => {
  return new BigNumber(amount).div(10 ** decimals).toFixed()
}

const formatStatus = (status: WithdrawStatus) => {
  const statusObj: Record<WithdrawStatus, string> = {
    finished: t('finished'),
    inprogress: t('inprogress'),
    generated: t('generated'),
    error: t('error'),
    confirmed: t('confirmed1'),
    pending: t('pending1'),
    approved: t('approved'),
    rejected: t('rejected'),
    timeout_error: t('timeout_error'),
  }
  return statusObj?.[status] || status || ''
}

  function formatStatusColor(status: string) : string {
    if (status === 'error' || status === 'timeout_error' || status === 'rejected') {
      return '#F63030'
    }
    if (status === 'confirmed') {
      return '#2BB1EA'
    }
    if (status === 'finished') {
      return 'var(--up-color)'
    }
    return ['generated', 'pending', 'inprogress']?.includes(status) ? '#697F95' : ''
  }

function getNextVip(vip: string) {
  const vipObj: {
    [key: string]: string
  } = {
    vip1: 'VIP2',
    vip2: 'VIP3',
    vip3: 'SVIP'
  }
  if (vip === '') {
    return 'VIP1'
  }
  return vipObj?.[vip] || ''
}

function formatRewardType(type: 'bot_swap' | 'chain_swap' | 'chain_perp' | 'perp_swap') : string {
  const typeObj = {
    bot_swap: t('botWallet'),
    chain_swap: t('chainWallet3'),
    chain_perp: t('chainPerp'),
    perp_swap: t('chainPerp'),
    'chain_swap,perp_swap': t('chainWallet3') + '/' + t('chainPerp'),
  } as const
  return typeObj?.[type] || type || ''
}

const createWithdrawIncomeOrder = async () => {
  loading.value = true
  try {
    await createWithdrawIncomeOrderApi()
    ElMessage.success(t('createWithdrawIncomeOrder'))
  } catch (err: any) {
    let msg = typeof err === 'string' ? err : err?.data?.message || err?.message || err?.msg
    const msgs: Record<string, string> = {
      'No more than one claims is allowed per day, please try again the next day':
        '每天最多提现1次, 请次日再试',
      'There are already orders being withdrawn': '已有提现中的订单',
      'No items found for withdrawal': '未找到可提现的项目',
      'withdraw wallet insufficient funds, please contact the administrator':
        '提现钱包余额不足, 请联系管理员',
      'amount less than or equal to transaction fee': '金额小于或等于交易费',
    }
    if (globalStore.lang === 'zh-cn') {
      msg = msgs?.[msg] || msg
    }
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}

const invite = () => {
  if (!(botStore.evmAddress && botStore.accessToken)) {
    if (!walletStore.address) {
      botStore.changeConnectVisible(true)
      return
    } else {
      dialogConnect.value = true
    }
    return
  }
  dialogShare.value = true
  setTimeout(() => {
    const inviterUrl = 'https://share.ave.ai'
    const lang = globalStore.lang?.includes('zh') ? 'zh-cn' : 'en'
    const refCodeParams = refCode.value ? `&code=${refCode.value}` : ''
    const shareLink = inviterUrl + `?lang=${lang}${refCodeParams}`
    getQRCode(shareLink)
  }, 100)
}

const getQRCode = async (shareUrl: string) => {
  try {
    const url = await QRCode.toDataURL(shareUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
    })
    qrCodeUrl.value = url
    setTimeout(() => {
      getShareImg()
    }, 100)
  } catch (error) {
    console.error('生成二维码失败:', error)
  }
}

const getShareImg = async () => {
  const postersDom = document.querySelector('.share-card-rebate')
  if (postersDom) {
    try {
      const m = await import('html2canvas')
      const html2canvas = m.default || m
      const canvas = await html2canvas(postersDom as HTMLElement, {
        backgroundColor: null,
        scale: 3,
        allowTaint: true,
        useCORS: true,
        scrollY: 0,
        scrollX: 0,
        height: postersDom.clientHeight - 1,
      })
      shareImgCanvas.value = canvas
      return canvas
    } catch (error) {
      console.error('生成分享图片失败:', error)
    }
  }
}

const downloadSharePoster = async () => {
  const postersDom = document.querySelector('.share-card-rebate')
  if (postersDom) {
    try {
      const m = await import('html2canvas')
      const html2canvas = m.default || m
      const canvas = await html2canvas(postersDom as HTMLElement, {
        backgroundColor: null,
        scale: 3,
        allowTaint: true,
        useCORS: true,
        scrollY: 0,
        scrollX: 0,
      })
      const dataURL = canvas.toDataURL('image/png')
      downloadFile(dataURL, `ave-invite-${Date.now()}.png`)
    } catch (error) {
      console.error('下载分享海报失败:', error)
    }
  }
}

const downloadFile = (blob: string | Blob, filename: string) => {
  let url = ''
  if (typeof blob === 'string') {
    url = blob
  } else {
    url = URL.createObjectURL(blob)
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const apply = () => {
  const lang = globalStore.lang === 'zh-cn' || globalStore.lang === 'zh-tw' ? 'zh-cn' : 'en'
  window.open(`https://eco.ave.ai?lang=${lang}`)
}

const goLink = (item: any) => {
  if (!item.txHash) {
    return
  }
  window.open(formatExplorerUrl(item.chain, item.txHash, 'tx'))
}

// 监听用户信息变化
watch(
  () => botStore.evmAddress,
  () => {
    init()
  }
)

// 组件挂载时初始化
onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.referral {
  background-color: #0a0b0d;
  background-image: url('@/assets/images/referral/bg.png');
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: top left;
  padding: 60px 0;
  .container {
    width: 1200px;
    margin: 0 auto;
  }
}
.referral-top {
  padding-bottom: 80px;
  font-size: 14px;
  color: #999;
  display: flex;
  justify-content: space-between;
  .left {
    max-width: 40%;
    text-align: center;
    > :first-child {
      font-size: 72px;
      font-weight: 600;
      text-align: center;
      color: #fff;
      line-height: 100px;
    }
    > :last-child {
      font-size: 30px;
      font-weight: 400;
      margin-top: 30px;
      color: #fff;
      letter-spacing: 4px;
      span {
        font-size: 50px;
        font-style: italic;
        font-weight: 900;
        color: #fbbc04;
      }
    }
  }

  .right {
    flex: 1;
    background-color: #000000;
    border-radius: 8px;
    margin-left: 120px;
    .right-top {
      position: relative;
      width: 100%;
      background-color: #3f80f71a;
      padding: 30px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    table {
      position: relative;
      z-index: 2;
      width: 95%;
      border-collapse: collapse;
      color: #fff;
      th,
      td {
        text-align: left;
        width: 30%;
      }
      th {
        font-size: 14px;
        font-weight: 500;
        // line-height: 21px;
        color: #ffffff80;
      }
    }
    .right-top-img {
      position: absolute;
      z-index: 1;
      right: -55px;
      top: -60px;
    }

    .right-bottom {
      color: #999;
      font-weight: 500;
      padding: 30px 20px;
      .right-bottom-li {
        display: flex;
        align-items: center;
        > :nth-child(2) {
          color: #fff;
        }
      }
      .right-bottom-btn {
        margin-top: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        background-color: #3f80f7;
        border-radius: 8px;
        height: 48px;
        color: #fff;
        outline: none;
        border: none;
        font-weight: 700;
      }
    }
  }
}

.note-li {
  flex: 1;
  color: #fff;
  .note-li_title {
    font-size: 24px;
    font-weight: 700;
    line-height: 36px;
  }
  .note-li_content {
    margin-top: 17px;
    font-size: 18px;
    font-weight: 400;
    line-height: 36px;
    list-style: disc;
    list-style-position: inside;
    padding-left: 80px;
    > li {
      list-style: disc;
      list-style-position: inside;
    }
  }
}

.apply-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #3f80f7;
  border-radius: 8px;
  height: 48px;
  color: #fff;
  outline: none;
  border: none;
  min-width: 320px;
  font-weight: 700;
}

.section-title {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  > img {
    margin-right: 10px;
  }
}

.data-list {
  margin-top: 15px;
  display: flex;
  color: #fff;
  .data-card {
    padding: 22px 20px;
    display: flex;
    justify-content: space-between;
    background-color: #FFFFFF12;
    border-radius: 8px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: bottom right;
    // &:nth-child(1) {
    //   background-image: url(@/assets/images/referral/data-bg-1.svg);
    // }
    // &:nth-child(2) {
    //   background-image: url(@/assets/images/referral/data-bg-2.svg);
    // }
    // &:nth-child(3) {
    //   background-image: url(@/assets/images/referral/data-bg-3.svg);
    // }

    & + .data-card {
      margin-left: 30px;
    }

    > :first-child {
      flex: 1;
    }
    flex: 1;
    .data-card_label {
      color: #697F95;
      font-size: 14px;
      line-height: 21px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .w-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ffffff;
      border-radius: 8px;
      height: 40px;
      color: #333333;
      outline: none;
      border: none;
      font-weight: 700;
      min-width: 100px;
    }
  }
}

.table-list {
  margin-top: 15px;
  --el-table-tr-bg-color: #0a0b0d;
  --el-table-bg-color: #0a0b0d;
  --el-table-text-color: #f5f5f5;
  --el-table-header-bg-color: #15171c;
  --el-fill-color-lighter: #0a0b0d;
  --el-table-header-text-color: #999999;
  --el-table-border-color: #33353d;
  --el-table-row-hover-bg-color: #1e2024;
  background: #0a0b0d;
  --el-bg-color: #0a0b0d;
  :deep() {
    tbody {
      .el-table__cell {
        padding: 20px 0;
      }
    }
  }
}
.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
  --el-text-color-regular: #666666;
  --el-text-color-primary: #666666;
  --el-color-primary: #ffffff;
  --el-fill-color-blank: transparent;
  --d-222-l-F2F2F2: transparent;
  --d-111-l-FFF: transparent;
  :deep(.el-pagination) {
    margin-top: 0;
    border-top: 1px solid transparent;
    background-color: transparent;
    --el-text-color-regular: #5A5E64;
    --el-pagination-button-color: #5A5E64;
    --el-pagination-bg-color: transparent;
  }
}

.token-box {
  height: 32px;
  width: 32px;
  position: relative;
  display: flex;
  align-items: center;
  .icon-logo {
    height: 32px;
    width: 32px;
    border-radius: 50%;
  }
  .icon-chain {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    position: absolute;
    right: -2px;
    bottom: 0px;
  }
}

.t-l + .t-l {
  margin-top: 5px;
}
:deep() {
  .el-table.el-table thead .el-table__cell {
    height: 40px;
  }
}
.dialog-rebate.el-dialog {
  --el-dialog-padding-primary: 30px;
  --el-bg-color: #222222;
  padding: 30px 40px;
  .el-dialog__header {
    padding-bottom: 20px;
  }
  .el-dialog__title {
    font-size: 24px;
  }
  .el-dialog__close {
    font-size: 28px;
  }
  .el-dialog__headerbtn {
    top: 20px;
    right: 26px;
    --el-color-info: var(--a-text-1-color);
    font-weight: bolder;
  }

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // padding-bottom: 25px;
    padding: 25px;
    padding-top: 0px;
    padding-bottom: 0px;
    .share-card-rebate {
      position: relative;
      overflow: hidden;
      width: 400px;
      height: 420px;
      padding: 16px;
      padding-top: 30px;
      background: #333;
      z-index: 1;
      // border-radius: 8px;
      color: #fff;
      .share-bg-img {
        width: 401px;
        position: absolute;
        // inset: 0;
        top: -1px;
        right: -1px;
        height: 101%;
        z-index: -1;
      }
      .img-qr {
        position: absolute;
        right: 146px;
        bottom: 150px;
      }
    }
  }
}
.bg-1 {
  background: url(../assets/images/referral/bg-4-1.png);background-size: 100% auto; background-position: center center;
}
.bg-2 {
  background: url(../assets/images/referral/bg-4-2.png);background-size: 100% auto; background-position: center center;
}
.bg-3 {
  background: url(../assets/images/referral/bg-4-3.png);background-size: 100% auto; background-position: center center;
}
.color-btn-lg {
  background: linear-gradient(90deg, #2BB1EA 0%, #2561F6 100%);
}
.color-btn-lg-2 {
  background: linear-gradient(90deg, #E0A252 0%, #E6BA28 100%);
}
.color-btn-lg-3 {
  background: linear-gradient(90deg, #2BB1EA 0%, #2561F6 100%);
}

.tabs {
  display: flex;
  align-items: center;
  .tab-item {
    color: #697F95;
    font-size: 16px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    & + .tab-item {
      margin-left: 60px;
    }
    &.active {
      position: relative;
      color: #2BB1EA;
      &::after {
        content: '';
        display: block;
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 15px;
        height: 3px;
        border-radius: 1px;
        background-color: #2BB1EA;
      }
    }
  }
}

</style>

<style lang="scss">
.el-dialog.dialog-rebate {
  --el-bg-color: #16181D;
  .el-dialog__body {
    --el-text-color-regular: #F5F5F5;
  }
}

</style>
