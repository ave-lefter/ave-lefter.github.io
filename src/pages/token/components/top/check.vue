<template>
  <el-drawer
    v-model="visible"
    append-to-body
    :with-header="false"
    :size="480"
    class="draw-right"
  >
    <div class="check-container bg-[--dialog-bg] color-[--main-text]">
      <div class="flex items-center justify-between text-20px p-20px sticky top-0 bg-[--dialog-bg] z-1">
        <div v-if="checkResult?.ai_report" class="flex-start">
          <img src="@/assets/images/AI.svg" alt="" :width="20" class="mr-5px">{{ $t('AI') }}
        </div>
        <span v-else>{{ $t('check2') }}</span>
        <Icon name="ri:close-large-fill" class="clickable" @click.stop="visible = false" />
      </div>
      <div class="check-content">
        <el-row v-if="showResult" :gutter="20">
          <el-col :span="24">
            <div class="flex-center width_100">
              <div>
                <div class="audit-progress relative">
                  <div
                    v-if="checkResult?.is_safu_contract"
                    class="danbao-bg-absolute"
                  >
                    <div class="danbao-bg">
                      <div>
                        <span>{{ $t('SAFU') }}</span>
                        <span>
                          {{
                            checkResult?.is_safu_contract == 1
                              ? 'PinkSale'
                              : checkResult?.is_safu_contract
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <arc-progress
                    :progress="progress"
                    :width="140"
                    :height="80"
                    :thickness="7"
                    :big="false"
                    class="arc-progress"
                    fontSize="24px"
                    :textHeight="40"
                  />
                  <a
                    v-if="checkResult?.audit_pass_by"
                    class="audit-bg-absolute"
                    :href="checkResult?.audit_link"
                    target="_blank"
                  >
                    <div class="audit-bg">
                      <div>
                        <span>{{ $t('audited') }}</span>
                        <span>{{ checkResult?.audit_pass_by }}</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div v-if="checkResult?.ai_report" class="risk-statics">
              <div class="item1">
                <img
                  v-if="riskAIList?.filter(i=> Number(i?.risk_level) == -3)?.length >0"
                  :height="16"
                  src="@/assets/images/risk-gaoliang.svg"
                >
                <img v-else :height="16" src="@/assets/images/risk.svg" >
                <span class="num">{{ riskAIList?.filter(i=> Number(i?.risk_level) == -3)?.length || 0 }}</span>
              </div>
              <div class="item1">
                <img
                  v-if="riskAIList.filter(i=>Number(i?.risk_level) == -2)?.length >0"
                  src="@/assets/images/yichang1-gaoliang.svg"
                  :height="16"
                >
                <img v-else :height="16" src="@/assets/images/yichang1.svg" >
                <span class="num">{{ riskAIList.filter(i=>Number(i?.risk_level) == -2)?.length }}</span>
              </div>
              <div class="item1">
                <img
                  v-if="riskAIList.filter(i=> Number(i?.risk_level) !== -1)?.length >0"
                  :height="16"
                  src="@/assets/images/zhuyi1-gaoliang.svg"
                >
                <img v-else :height="16" src="@/assets/images/zhuyi1.svg" >
                <span class="num">{{ riskAIList.filter(i=> Number(i?.risk_level) == -1)?.length }}</span>
              </div>
            </div>
            <div v-else class="risk-statics">
              <div class="item1">
                <img
                  v-if="statistics_risk"
                  :height="16"
                  src="@/assets/images/risk-gaoliang.svg"
                >
                <img v-else :height="16" src="@/assets/images/risk.svg" >

                <span class="num">{{ statistics_risk || 0 }}</span>
              </div>
              <div class="item1">
                <img
                  v-if="statistics_warning"
                  src="@/assets/images/yichang1-gaoliang.svg"
                  :height="16"
                >
                <img v-else :height="16" src="@/assets/images/yichang1.svg" >
                <span class="num">{{ statistics_warning }}</span>
              </div>
              <div class="item1">
                <img
                  v-if="statistics_unknown"
                  :height="16"
                  src="@/assets/images/zhuyi1-gaoliang.svg"
                >
                <img v-else :height="16" src="@/assets/images/zhuyi1.svg" >
                <span class="num">{{ statistics_unknown }}</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="!checkResult?.ai_report" :span="24">
            <div class="card card1">
              <ul>
                <template
                  v-for="(item, index) in (showRiskList || checkResult?.chain === 'solana' ? riskList : riskList?.slice(0, 2))"
                  :key="index"
                >
                  <li
                    v-if="item[0] === 0.6"
                    class="card-list-item flex-start hover"
                  >
                      <div
                        v-tooltip="t('notSurePermissionRemovalRemovesRisk')"
                        class="inline-flex items-center color-[currentColor]"
                      >
                        <img
                          :src="getAssetsImagesUrl(riskStatus[item[0]])"
                          width="12px"
                          alt=""
                        >
                        <span class="color-[--secondary-text] ml-5px">{{ item[1] }}</span>
                      </div>
                  </li>
                  <li
                    v-else
                    class="card-list-item flex-start"
                    :class="`${riskStatus[item[0]]}`"
                  >
                    <!-- <svg
                      class="icon-svg"
                      style="cursor: default"
                      aria-hidden="true"
                    >
                      <use :xlink:href="`#icon-${riskStatus[item[0]]}`" />
                    </svg> -->
                    <img
                      :src="getAssetsImagesUrl(riskStatus[item[0]])"
                      width="12px"
                      alt=""
                    >
                    <span :class="item[0] > 1 ? 'color-[--main-text] ml-5px' : 'color-[--secondary-text] ml-5px'">{{ item[1] }}</span>
                  </li>
                </template>
              </ul>
              <a
                v-if="riskList.length > 2 && checkResult?.chain !== 'solana'"
                class="block text-center"
                href=""
                style="font-size: 12px; text-decoration: none"
                @click.stop.prevent="showRiskList = !showRiskList"
              >
                <Icon
                  class="text-24px color-[--third-text]"
                  :name="
                    showRiskList
                      ? 'material-symbols:keyboard-arrow-up'
                      : 'material-symbols:keyboard-arrow-down'
                  "
                />
              </a>
              <div v-if="risk_remark" class="remark">
                {{ t('remark') }}: {{ risk_remark }}
              </div>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="card basic">
              <div
                class="flex items-start justify-between"
              >
                <ul
                  class="flex-1 pr-15px border-r border-[#97979733]"
                >
                  <li
                    class="card-list-item cursor-pointer"
                    @click.stop="
                      buy_tax_list_show = !buy_tax_list_show;
                      sell_tax_list_show = !sell_tax_list_show
                    "
                  >
                    <span>{{ $t('buyTax') }}</span>
                    <span class="flex items-center" :class="{ danger: (checkResult?.buy_tax ?? 0) > 0 }">
                      {{ formatNumber(checkResult?.buy_tax || 0, 2) }}%
                      <template
                        v-if="
                          Number(checkResult?.tm_buy_tax_for_lp) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_burn) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_fund) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_holders) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_lp_holders) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_team) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_inviter) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_other) > 0
                        "
                      >
                        <!-- <svg class="icon-svg shui-icon" aria-hidden="true" v-if="buy_tax_list_show">
                          <use xlink:href="#icon-zhankai"></use>
                        </svg>
                        <svg class="icon-svg shui-icon" aria-hidden="true" v-else>
                          <use xlink:href="#icon-shouqi1"></use>
                        </svg> -->
                        <Icon
                          class="text-20px color-[--secondary-text]"
                          :name="
                            buy_tax_list_show
                              ? 'material-symbols:keyboard-arrow-up'
                              : 'material-symbols:keyboard-arrow-down'
                          "
                        />
                      </template>
                    </span>
                  </li>
                  <Transition>
                    <li
                      v-if="buy_tax_list_show && (Number(checkResult?.tm_buy_tax_for_lp) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_burn) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_fund) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_holders) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_lp_holders) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_team) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_inviter) > 0 ||
                          Number(checkResult?.tm_buy_tax_for_other) > 0)" class="py-5px">
                      <ul class="ml-15px">
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_lp) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_lp') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_lp || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_burn) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_burn') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_burn || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_fund) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_fund') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_fund || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_holders) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_holders') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_holders || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="
                            Number(checkResult?.tm_buy_tax_for_lp_holders) > 0
                          "
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_lp_holders') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_lp_holders || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_team) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_team') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_team || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_inviter) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_inviter') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_inviter || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_buy_tax_for_other) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_buy_tax_for_other') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_buy_tax_for_other || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                      </ul>
                    </li>
                  </Transition>
                </ul>
                <ul style="flex: 1">
                  <li
                    class="card-list-item cursor-pointer"
                    @click.stop="
                      buy_tax_list_show = !buy_tax_list_show;
                      sell_tax_list_show = !sell_tax_list_show
                    "
                  >
                    <span>{{ $t('sellTax') }}</span>
                    <span class="flex items-center" :class="{ danger: checkResult?.sell_tax ?? 0 > 0 }">
                      {{ formatNumber(checkResult?.sell_tax || 0, 2) }}%
                      <template
                        v-if="
                          Number(checkResult?.tm_sell_tax_for_lp) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_burn) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_fund) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_holders) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_lp_holders) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_team) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_inviter) > 0 ||
                          Number(checkResult?.tm_sell_tax_for_other) > 0
                        "
                      >
                        <Icon
                          class="text-20px color-[--secondary-text]"
                          :name="
                            sell_tax_list_show
                              ? 'material-symbols:keyboard-arrow-up'
                              : 'material-symbols:keyboard-arrow-down'
                          "
                        />
                      </template>
                    </span>
                  </li>
                  <Transition>
                    <li
                        v-if="sell_tax_list_show && (Number(checkResult?.tm_sell_tax_for_lp) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_burn) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_fund) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_holders) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_lp_holders) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_team) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_inviter) > 0 ||
                        Number(checkResult?.tm_sell_tax_for_other) > 0)" class="py-5px">
                      <ul class="indent">
                        <li
                          v-if="Number(checkResult?.tm_sell_tax_for_lp) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_lp') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_lp || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_sell_tax_for_burn) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_burn') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_burn || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_sell_tax_for_fund) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_fund') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_fund || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="
                            Number(checkResult?.tm_sell_tax_for_holders) > 0
                          "
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_holders') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_holders || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="
                            Number(checkResult?.tm_sell_tax_for_lp_holders) > 0
                          "
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_lp_holders') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_lp_holders || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="Number(checkResult?.tm_sell_tax_for_team) > 0"
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_team') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_team || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="
                            Number(checkResult?.tm_sell_tax_for_inviter) > 0
                          "
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_inviter') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_inviter || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                        <li
                          v-if="
                            Number(checkResult?.tm_sell_tax_for_other || 0) > 0
                          "
                          class="card-list-item in"
                        >
                          <span>{{ $t('tm_sell_tax_for_other') }}</span>
                          <span class="gray">
                            {{
                              formatNumber(
                                checkResult?.tm_sell_tax_for_other || 0,
                                2
                              )
                            }}%
                          </span>
                        </li>
                      </ul>
                    </li>
                  </Transition>
                </ul>
              </div>
              <div v-if="Number(checkResult?.buy_gas || 0) >= 0.1 || checkResult?.buy_max_amount_per_tx || Number(checkResult?.sell_gas || 0) >= 0.1 || checkResult?.sell_max_amount_per_tx" class="flex justify-between mt-10px">
                <ul
                  class="flex-1 mr-5px pr-5px border-r border-[#97979733]"
                >
                  <li v-if="Number(checkResult?.buy_gas) >= 0.1" class="card-list-item in">
                    <span>{{ $t('buy_gas') }}</span>
                    <span
                      :style="{ color: filterGas(Number(checkResult?.buy_gas || 0), checkResult?.chain || '') }"
                    >
                      ${{ formatNumber(checkResult?.buy_gas || 0, 2) }}
                    </span>
                  </li>
                  <li v-if="checkResult?.buy_max_amount_per_tx" class="card-list-item in">
                    <span>{{ $t('buyMaxAmount') }}</span>
                    <span class="danger">
                      {{ formatNumber(checkResult?.buy_max_amount_per_tx || 0, 0) }}
                    </span>
                  </li>
                </ul>
                <ul style="flex: 1">
                  <li v-if="Number(checkResult?.sell_gas || 0) >= 0.1" class="card-list-item in">
                    <span>{{ $t('sell_gas') }}</span>
                    <span
                      :style="{
                        color: filterGas(Number(checkResult?.sell_gas || 0), checkResult?.chain || '')
                      }"
                    >
                      ${{ formatNumber(checkResult?.sell_gas || 0, 2) }}
                    </span>
                  </li>
                  <li v-if="checkResult?.sell_max_amount_per_tx" class="card-list-item in">
                    <span>{{ $t('sellMaxAmount') }}</span>
                    <span class="danger">
                      {{ formatNumber(checkResult?.sell_max_amount_per_tx || 0, 0) }}
                    </span>
                  </li>
                </ul>
              </div>
              <ul
                v-if="
                  Number(checkResult?.approve_gas || 0) >= 0.1 ||
                  checkResult?.tm_max_hold_amount_per_wallet ||
                  checkResult?.tm_bonus_token_name ||
                  checkResult?.tm_bonus_token_for_lp_holders ||
                  checkResult?.market_wallet ||
                  checkResult?.team_wallet ||
                  checkResult?.tm_kill_block_after_open ||
                  checkResult?.tm_start_trade_at_block ||
                  checkResult?.mechanism_intro
                "
                class="mt-10px"
              >
                <li v-if="Number(checkResult?.approve_gas || 0) >= 0.1" class="card-list-item cursor">
                  <span >{{ $t('approve_gas') }}</span>
                  <span
                    :style="{
                      color: filterGas(Number(checkResult?.approve_gas || 0), checkResult?.chain || '')
                    }"
                  >
                    ${{ formatNumber(checkResult?.approve_gas || 0, 2) }}
                  </span>
                </li>
                <li v-if="checkResult?.tm_max_hold_amount_per_wallet" class="card-list-item">
                  <span >{{ $t('tm_max_hold_amount_per_wallet') }}</span>
                  <span class="danger">
                    {{ formatNumber(checkResult.tm_max_hold_amount_per_wallet, 0) }}
                  </span>
                </li>
                <li v-if="checkResult?.tm_bonus_token_name" class="card-list-item">
                  <span >{{ $t('tm_bonus_token_name') }}</span>
                  <a
                    :href="formatExplorerUrl(checkResult?.chain || '', checkResult?.tm_bonus_token_for_holders || '')"
                    target="_blank"
                  >
                    {{ checkResult.tm_bonus_token_name }}
                  </a>
                </li>
                <li v-if="checkResult?.tm_bonus_token_for_lp_holders" class="card-list-item">
                  <span>{{ $t('tm_bonus_token_name_for_lp') }}</span>
                  <div class="flex items-center">
                    <a
                      :href="formatExplorerUrl(checkResult.chain || '', checkResult.tm_bonus_token_for_lp_holders || '', 'address')"
                      target="_blank"
                    >
                      {{
                        checkResult?.tm_bonus_token_name_for_lp ||
                        (checkResult?.tm_bonus_token_for_lp_holders || '').replace(
                          new RegExp('(^.{6})(.+)(.{4}$)'),
                          '$1...$3'
                        )
                      }}
                    </a>
                  </div>
                </li>
                <li v-if="checkResult?.market_wallet" class="card-list-item">
                  <span>{{ $t('fundWallet') }}</span>
                  <div class="flex items-center">
                    <a
                      :href="formatExplorerUrl(checkResult?.chain || '', checkResult?.market_wallet || '', 'address')"
                      target="_blank"
                    >
                      {{
                        (checkResult.market_wallet || '').replace(
                          new RegExp('(^.{6})(.+)(.{4}$)'),
                          '$1...$3'
                        )
                      }}
                    </a>
                    <Icon
                      v-copy="checkResult.market_wallet || ''"
                      name="bxs:copy"
                      class="text-12px ml-2px clickable color-#999"
                      @click.stop.prevent
                    />
                  </div>
                </li>
                <li v-if="checkResult?.team_wallet" class="card-list-item">
                  <span >{{ $t('teamWallet') }}</span>
                  <div>
                    <a
                      :href="formatExplorerUrl(checkResult.chain || '', checkResult.team_wallet || '', 'address')"
                      target="_blank"
                    >
                      {{
                        (checkResult.team_wallet || '').replace(
                          new RegExp('(^.{6})(.+)(.{4}$)'),
                          '$1...$3'
                        )
                      }}
                    </a>
                    <Icon
                      v-copy="checkResult.team_wallet || ''"
                      name="bxs:copy"
                      class="text-12px ml-2px clickable color-#999"
                      @click.stop.prevent
                    />
                  </div>
                </li>
                <li v-if="checkResult?.tm_kill_block_after_open" class="card-list-item">
                  <span >{{ $t('tm_kill_block_after_open') }}</span>
                  <span>{{ formatNumber(checkResult.tm_kill_block_after_open, 0) }}</span>
                </li>
                <li v-if="checkResult?.tm_start_trade_at_block" class="card-list-item">
                  <span >{{ $t('tm_start_trade_at_block') }}</span>
                  <span>{{ formatNumber(checkResult.tm_start_trade_at_block, 0) }}</span>
                </li>
                <li v-if="checkResult?.mechanism_intro" class="card-list-item">
                  <span  style="word-break: keep-all">{{ $t('mechanism_intro') }}</span>
                  <span class="" v-html="checkResult?.mechanism_intro?.replace?.(/\n/g, '<br/>')"/>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col v-if="checkResult?.ai_report" :span="24">
            <AI :obj="checkResult?.ai_report" :riskList="riskAIList"/>
          </el-col>
          <el-col :span="24">
            <div class="text-14px mt-10px">
              {{ list?.[0]?.name }}({{ formatNumber(checkResult?.holders || 0)}})
            </div>
            <div class="card card1">
              <div class="flex-s">
                <span class="label">{{ $t('totalSupply1') }}</span>
                <span class="range-text">{{
                  formatNumber(checkResult?.total || 0)
                }}</span>
              </div>
              <div class="flex-s flex items-center">
                <span class="label">{{ $t('top10Holder') }}</span>
                <span style="flex: 1" />
                <span class="range-text">{{ formatNumber(range * 100, 1) }}%</span>
                <div class="range">
                  <span
                    class="range-bar"
                    :style="{ width: formatNumber(range * 100) + '%' }"
                  />
                </div>
              </div>
              <ul class="mt-10px">
                <template
                  v-for="(item, index) in checkResult?.token_holders_rank || []"
                  :key="index"
                >
                  <li
                    class="card-list-item holder-item"
                    :class="{
                      'bg-warning': Number(item?.analysis_show_warning) === 1,
                    }"
                  >
                    <a
                      class="flex items-center justify-items-start"
                      :href="
                        formatExplorerUrl(
                          checkResult?.chain || '',
                          item.address || '',
                          'address'
                        )
                      "
                      target="_blank"
                    >
                      <span>{{ index + 1 }}.</span>
                      <el-tag
                        v-if="Number(item?.analysis_show_creator) === 1"
                        type="primary"
                        round
                        size="small"
                        class="mr-3px"
                      >
                        {{ $t('contractCreator') }}
                      </el-tag>
                      <Icon
                        v-if="item.lock || /lock|null/gi.test(item.mark || '')"
                        class="text-14px"
                        color="#B3920E"
                        name="material-symbols-light:lock"
                      />
                      <!-- <svg
                        v-if="item.is_lp === 1"
                        class="iconfont icon-LP"
                        aria-hidden="true"
                        style="width: 12px; height: 12px; vertical-align: middle"
                      >
                        <use xlink:href="#icon-LP"></use>
                      </svg> -->
                      <img
                        v-if="item.is_lp === 1"
                        src="@/assets/images/LP.svg"
                        :width="12"
                        alt=""
                      >
                      <!-- <i
                        v-if="item?.is_contract  && item?.is_contract === 1"
                        class="iconfont icon-contract"
                        style="vertical-align: middle"
                      /> -->
                      <img
                        v-if="item?.is_contract && item?.is_contract === 1"
                        src="@/assets/images/contact.svg"
                        :width="12"
                        alt=""
                      >
                      <template v-if="!item.mark">
                        {{
                          (item.address || '').slice(0, 2) +
                          '...' +
                          (item.address || '').slice(-4)
                        }}
                      </template>
                      <template v-else>{{ item.mark }}</template>
                      <template
                        v-if="
                          item.lock &&
                          item.lock.length > 0 &&
                          item.lock.every(
                            (i) => (i?.unlockDate ?? 0) * 1000 <= Date.now()
                          )
                        "
                      >
                        <br >
                        {{ $t('unlocked') }}
                      </template>
                    </a>
                    <div class="flex items-center">
                      <span>{{ formatNumber(item.quantity || 0, 2) }}</span>
                      <span v-if="checkResult?.total && item?.quantity" class="color-[--third-text]">
                        ({{
                          formatNumber(
                            Number(item?.quantity) * 100 /
                              Number(checkResult?.total) || 0,
                            2
                          )
                        }}%)
                      </span>
                    </div>
                  </li>
                  <table
                    v-if="item.lock && item.lock.length > 0"
                    class="table-lock"
                  >
                    <thead>
                      <tr>
                        <th>{{ $t('amount') }}</th>
                        <th>{{ $t('lockDate') }}</th>
                        <th>{{ $t('unlockDateStart') }}</th>
                        <th>{{ $t('unlockDateEnd') }}</th>
                      </tr>
                    </thead>
                    <tr v-for="(item1, $index) in item.lock" :key="$index">
                      <td>{{ formatNumber(item1?.amount || 0, 2) }}</td>
                      <td v-if="item1?.lockDate">
                        {{ formatDate(item1?.lockDate, 'YYYY-MM-DD') }}
                      </td>
                      <td v-if="item1?.unlockDate">
                        {{ formatDate(item1?.unlockDate, 'YYYY-MM-DD') }}
                      </td>
                      <td v-if="item1?.vesting_end || item1?.unlockDate">
                        {{
                          formatDate(
                            item1?.vesting_end || item1?.unlockDate || 0,
                            'YYYY-MM-DD'
                          )
                        }}
                      </td>
                    </tr>
                  </table>
                </template>
              </ul>
              <div v-if="holder_remark" class="remark">
                {{ $t('remark') }}: {{ holder_remark }}
              </div>
            </div>
            <div class="text-14px">
              {{ list?.[1]?.name }}({{
                formatNumber(checkResult?.pair_holders || 0)
              }})
            </div>
            <div class="card card1">
              <div class="flex-s">
                <span class="label">{{ $t('totalSupply1') }}</span>
                <span class="range-text">{{
                  formatNumber(checkResult?.pair_total || 0)
                }}</span>
              </div>
              <div class="flex-s flex items-center">
                <span class="label mr-auto">{{ $t('LPLocked') }}</span>
                <span class="range-text">{{
                  formatNumber(rangePair * 100, 1)
                }}%</span>
                <div class="range">
                  <span
                    class="range-bar"
                    :style="{ width: formatNumber(rangePair * 100) + '%' }"
                  />
                </div>
              </div>
              <ul class="mt-10px">
                <template
                  v-for="(item, index) in checkResult?.pair_holders_rank || []"
                  :key="index"
                >
                  <li
                    class="card-list-item holder-item"
                    :class="{
                      'bg-warning': Number(item?.analysis_show_warning) === 1,
                    }"
                  >
                    <a
                      :href="
                        formatExplorerUrl(
                          checkResult?.chain || '',
                          item?.address || '',
                          'address'
                        )
                      "
                      target="_blank"
                      style="display: flex; align-items: center"
                    >
                      <span>{{ index + 1 }}.</span>
                      <el-tag
                        v-if="Number(item?.analysis_show_creator) === 1"
                        type="info"
                        round
                        size="small"
                        class="mr-3px"
                        effect="plain"
                      >
                        {{ $t('contractCreator') }}
                      </el-tag>
                      <template v-if="formatLock(item)">
                        <img
                          v-if="
                            (item?.lock?.length ?? 0) > 0 &&
                            item?.lock?.every?.(
                              (i) => (i.unlockDate ?? 0) * 1000 <= Date.now()
                            )
                          "
                          style="height: 15px"
                          src="@/assets/images/unlock.png"
                          alt=""
                          srcset=""
                        >
                        <!-- <van-icon v-else color="#B3920E" name="lock" /> -->
                        <Icon
                          v-else
                          class="text-14px"
                          color="#B3920E"
                          name="material-symbols-light:lock"
                        />
                      </template>
                      <!-- <i v-if="item?.is_contract === 1" class="iconfont icon-contract"></i> -->
                      <img
                        v-if="item?.is_contract && item?.is_contract === 1"
                        src="@/assets/images/contact.svg"
                        :width="12"
                        alt=""
                      >
                      <template v-if="!item?.mark">
                        {{
                          (item?.address || '').slice(0, 2) +
                          '...' +
                          (item?.address || '').slice(-4)
                        }}
                      </template>
                      <template v-else>{{ item?.mark }}</template>
                    </a>
                    <div class="flex items-center">
                      <span>{{ formatNumber(item?.quantity || 0) }}</span>
                      <span
                        v-if="
                          (checkResult?.pair_total && item?.quantity) ||
                          item?.percent
                        "
                        class="color-[--third-text]"
                      >
                        ({{
                          item.percent && Number(item?.percent)
                            ? formatNumber(Number(item?.percent || 0) * 100, 2)
                            : formatNumber(
                                Number(item.quantity) * 100 /
                                  Number(checkResult?.pair_total) || 0,
                                2
                              )
                        }}%)
                      </span>
                    </div>
                  </li>
                  <table
                    v-if="item?.lock && item?.lock?.length > 0"
                    class="table-lock"
                  >
                    <thead>
                      <tr>
                        <th>{{ $t('amount') }}</th>
                        <th>{{ $t('lockDate') }}</th>
                        <th>{{ $t('unlockDateStart') }}</th>
                        <th>{{ $t('unlockDateEnd') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item1, index1) in item.lock"
                        :key="index1"
                        :style="{
                          color:
                            item1.unlockDate ?? 0 * 1000 <= Date.now()
                              ? '#FF9F00'
                              : '',
                        }"
                      >
                        <td>{{ formatNumber(item1.amount || 0) }}</td>
                        <td v-if="item1.lockDate">
                          {{ formatDate(item1.lockDate, 'YYYY-MM-DD') }}
                        </td>
                        <td v-if="item1.unlockDate">
                          {{ formatDate(item1.unlockDate, 'YYYY-MM-DD') }}
                        </td>
                        <td v-if="item1.vesting_end || item1.unlockDate">
                          {{
                            formatDate(
                              item1.vesting_end || item1.unlockDate || 0,
                              'YYYY-MM-DD'
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </ul>
              <ul class="risk-addition">
                <li
                  v-if="
                    Number(checkResult?.analysis_creator_gt_5percent || 0) > 5
                  "
                  class="warning"
                >
                  {{ $t('analysis_creator_gt_5percent') }}({{
                    formatNumber(
                      checkResult?.analysis_creator_gt_5percent || 0,
                      2
                    )
                  }}%)
                </li>
                <li
                  v-if="checkResult?.analysis_scam_wallet === '1'"
                  class="warning"
                >
                  {{ $t('analysis_scam_wallet') }}
                </li>
                <li
                  v-if="
                    Number(checkResult?.analysis_lp_creator_gt_5percent || 0) >
                    5
                  "
                  class="warning"
                >
                  {{ $t('analysis_lp_creator_gt_5percent') }}({{
                    formatNumber(
                      checkResult?.analysis_lp_creator_gt_5percent || 0,
                      2
                    )
                  }}%)
                </li>
                <li
                  v-if="checkResult?.analysis_big_wallet === '1'"
                  class="warning"
                >
                  {{ $t('analysis_big_wallet') }}
                </li>
                <li
                  v-if="
                    checkResult?.analysis_lp_locked_or_burned_gt_15days &&
                    Number(
                      checkResult?.analysis_lp_locked_or_burned_gt_15days
                    ) < 50
                  "
                  class="warning"
                >
                  {{ $t('analysis_lp_locked_or_burned_gt_15days') }} ({{
                    formatNumber(
                      checkResult?.analysis_lp_locked_or_burned_gt_15days || 0,
                      2
                    )
                  }}%)
                </li>
                <li
                  v-if="
                    checkResult?.analysis_lp_current_adequate &&
                    checkResult?.analysis_lp_current_adequate == '0'
                  "
                  class="warning"
                >
                  {{ $t('analysis_lp_current_adequate') }}
                </li>
                <li
                  v-if="
                    checkResult?.big_lp_without_any_lock &&
                    checkResult?.big_lp_without_any_lock == 1
                  "
                  class="warning"
                >
                  {{ $t('big_lp_without_any_lock') }}
                </li>
              </ul>
              <div v-if="lp_remark" class="remark">
                {{ $t('remark') }}: {{ lp_remark }}
              </div>
            </div>
            <div v-if="list?.[2]" class="text-12px">
              {{ list?.[2]?.name }}({{
                formatNumber(checkResult?.owner_txs?.length || 0)
              }})
            </div>
            <div v-if="list?.[2]" class="card card1">
              <div
                v-for="(item1, index1) in checkResult?.owner_txs"
                :key="index1"
                class="ownerTxs"
                @click="jump(item1)"
              >
                <div class="top">
                  <span class="ellipsis">
                    {{ item1?.method_name }}
                    <span class="color-777e90">
                      (
                      <!-- <i class="iconfont icon-heyue color-777e90"></i> -->
                      <img src="@/assets/images/合约.svg" :width="12" alt="" >
                      {{
                        item1?.method_code?.slice(0, 4) +
                        '...' +
                        item1?.method_code?.slice(-4)
                      }})
                    </span>
                  </span>
                  <span class="color-777e90 date">
                    {{
                      String(item1?.timestamp)?.length > 10
                        ? formatDate(
                            (item1?.timestamp ?? 0) / 1000 || 0,
                            'YYYY-MM-DD'
                          )
                        : formatDate(item1?.timestamp || 0, 'YYYY-MM-DD')
                    }}
                  </span>
                </div>
                <div v-if="(item1?.params?.length ?? 0) > 0" class="bottom">
                  <div
                    v-for="(i, $index) in item1?.params"
                    :key="$index"
                    class="flex-start"
                  >
                    <span class="color-777e90 van-ellipsis"
                      >{{ i?.name }}：</span
                    >
                    <template v-if="i?.type == 'address'">
                      <span
                        v-if="i?.value == useFollowStore().currentAddress || i?.value == userAddress"
                        class="color-777e90"
                        style="color: #f6465d"
                      >
                        {{
                          i?.value?.slice(0, 8) + '...' + i?.value?.slice(-4)
                        }}
                        ({{ $t('myWallet') }})
                      </span>
                      <span
                        v-else-if="i?.is_trader_addr == 1"
                        class="color-777e90 flex"
                        style="color: #ff9f00"
                      >
                        {{
                          i?.value?.slice(0, 8) + '...' + i?.value?.slice(-4)
                        }}
                        <el-tooltip
                          effect="customized"
                          :content="$t('latestTrader')"
                          placement="top"
                        >
                          <!-- <el-icon style="color: #ff9f00"><Avatar /></el-icon> -->
                          <Icon
                            class="text-14px"
                            color="#ff9f00"
                            name="ep:avatar"
                          />
                        </el-tooltip>
                      </span>
                      <span v-else class="color-777e90">
                        {{
                          i?.value?.slice(0, 8) + '...' + i?.value?.slice(-4)
                        }}
                      </span>
                    </template>
                    <span v-else-if="i?.type == 'uint256'" class="color-777e90">
                      {{ formatNumber(i?.value || 0) }}
                    </span>
                    <div
                      v-else-if="i?.type == 'address[]'"
                      class="color-777e90"
                    >
                      <strong>[</strong>
                      <span
                        v-for="(m, index) in i?.value?.slice(0, 3)"
                        :key="index"
                        class="block ml_10"
                      >
                        '{{ m?.slice(0, 4) + '...' + m?.slice(-4) }}'
                      </span>
                      <span v-if="i?.value?.length > 3" class="block ml_10">
                        //{{ $t('totalTxs', { n: i?.value?.length }) }}
                      </span>
                      <strong>]</strong>
                    </div>
                    <span v-else class="color-777e90">{{ i?.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col v-if="checkResult?.holder_analysis" :span="24">
            <div class="card card1 simulate">
              <span class="text-14px">{{ $t('simulate') }}</span>
              <table class="rd-4px">
                <tbody>
                  <tr>
                    <td>
                      <span class="block color-[--third-text]">{{
                        $t('simulateHolders')
                      }}</span>
                      <span class="block">
                        {{
                          formatNumber(
                            checkResult?.holder_analysis?.simulate_holders || 0
                          )
                        }}
                      </span>
                    </td>
                    <td>
                      <span class="block color-[--third-text]">{{
                        $t('sellSuccessful')
                      }}</span>
                      <span class="block">
                        {{
                          formatNumber(
                            checkResult?.holder_analysis?.sell_successful || 0
                          )
                        }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="block color-[--third-text]"
                        :class="{
                          failedBg:
                            (checkResult?.holder_analysis?.sell_failure ?? 0) >
                            0,
                        }"
                      >
                        {{ $t('sellFailure') }}
                      </span>
                      <span
                        class="block"
                        :class="{
                          failedColor:
                            (checkResult?.holder_analysis?.sell_failure ?? 0) >
                            0,
                        }"
                      >
                        {{
                          formatNumber(
                            checkResult?.holder_analysis?.sell_failure || 0
                          )
                        }}
                      </span>
                    </td>
                    <td>
                      <span
                        class="block color-[--third-text]"
                        :class="{
                          balanceBg:
                            (checkResult?.holder_analysis
                              ?.balance_disappeared ?? 0) > 0,
                        }"
                      >
                        {{ $t('balanceDisappeared') }}
                      </span>
                      <span class="block">
                        {{
                          formatNumber(
                            checkResult?.holder_analysis?.balance_disappeared ||
                              0
                          )
                        }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span class="color-[--third-text]">{{ $t('sellSlippage') }}</span>
                    </td>
                    <td colspan="3" class="tl">
                      <span
                        :class="{ avgBg: checkResult?.avg_tax_too_high == 1 }"
                      >
                        <span class="color-[--third-text]">{{ $t('averageTax') }}</span>
                        &nbsp;{{
                          formatNumber(
                            checkResult?.holder_analysis?.average_tax || 0
                          )
                        }}%
                      </span>
                      <div
                        v-for="(item, $index) in checkResult?.holder_analysis
                          ?.tax_distribution"
                        :key="$index"
                        class="flex-start"
                      >
                        <span>
                          <span class="color-[--third-text]">{{ $t('slippage1') }}</span>
                          &nbsp;{{ formatNumber(item?.tax) }}%
                        </span>
                        <span>
                          <span class="color-[--third-text]">{{
                            $t('addressCount')
                          }}</span>
                          &nbsp;{{ item?.count }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <ul class="risk-addition">
                <li
                  v-for="(item, index) in riskSimulateList"
                  :key="index"
                  :class="{ warning: item[0] == 1, danger: item[0] == 2 }"
                >
                  {{ item[1] }}
                </li>
              </ul>
            </div>
          </el-col>
          <el-col>
            <div class="card card1">
              <h3 class="text-14px">{{ $t('communityTrust') }}</h3>
              <div class="community-container mt-20px">
                <div class="thumbs-container" @click.stop="voteSupport">
                  <Icon
                    name="garden:thumbs-up-fill-12"
                    :style="{
                      color:
                        (checkResult?.my_vote ?? 0) > 0 ? '#12B886' : 'var(--secondary-text)',
                    }"
                  />
                  <span class="thumbs-label">
                    {{ $t('support') }}({{ checkResult?.vote_support }})
                  </span>
                </div>
                <div class="range-container">
                  <div class="range">
                    <span
                      class="left"
                      :style="{
                        width:
                          formatNumber(
                            formatVoteP(checkResult)?.[0] * 100 || 0
                          ) + '%',
                      }"
                    >
                      {{
                        formatNumber(formatVote(checkResult)[0] * 100 || 0, 1)
                      }}%
                    </span>
                    <span
                      class="right"
                      :style="{
                        width:
                          formatNumber(formatVoteP(checkResult)[1] * 100 || 0) +
                          '%',
                      }"
                    >
                      {{
                        formatNumber(formatVote(checkResult)[1] * 100 || 0, 1)
                      }}%
                    </span>
                  </div>
                  <div class="range-label">
                    ({{ formatVote(checkResult)[2] }} {{ $t('votes') }})
                  </div>
                </div>
                <div class="thumbs-container" @click.stop="voteAgainst">
                  <!-- <i
                  class="iconfont icon-fandui icon-thumbs"
                  :style="{ color: checkResult.my_vote < 0 ? '#F6465D' : '#e1e1e1' }"
                ></i> -->
                  <Icon name="garden:thumbs-down-fill-12" :style="{ color: (checkResult?.my_vote ?? 0) < 0 ? '#F6465D' : 'var(--secondary-text)'}"
                  />
                  <span class="thumbs-label">
                    {{ $t('against') }}({{ checkResult?.vote_against || 0 }})
                  </span>
                </div>
              </div>
              <div class="remark" style="padding-top: 0.2rem">
                {{ $t('remark') }}: {{ $t('checkRemark') }}
              </div>
            </div>
          </el-col>
        </el-row>
        <el-empty
          v-else
          :image="themeStore.theme === 'light' ? emptyWhite : emptyDark"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import emptyWhite from '@/assets/images/empty-white.svg'
import emptyDark from '@/assets/images/empty-black.svg'

import {
  _voteSupport,
  _voteAgainst,
  _getVote,
  type Check,
  type PairHoldersRank,
  type OwnerTxs,
} from '@/api/check'
import { formatNumber } from '@/utils/formatNumber'
import { filterGas, formatExplorerUrl, formatDate } from '@/utils/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import AI from './ai.vue'
const tokenStore = useTokenStore()
const botStore = useBotStore()
const walletStore = useWalletStore()

const { checkResult, showResult, hasLpLock , progress} = storeToRefs(useCheckStore())
const checkStore  = useCheckStore()
const { t } = useI18n()
const themeStore = useThemeStore()
const route = useRoute()
const { modelValue } = defineProps({
  modelValue: Boolean,
})
const $emit = defineEmits(['update:modelValue'])
const showRiskList = shallowRef(false)
const buy_tax_list_show = shallowRef(true)
const sell_tax_list_show = shallowRef(true)
// const activeTab = shallowRef(1)

const riskStatus: Record<number, string> = {
  0: 'normal1',
  0.5: 'normal1',
  0.6: 'unknownRisk1',
  1: 'warning1',
  2: 'danger1',
}
const loadingVote = shallowRef(false)

const list = computed(() => {
  return [
    { name: t('holders1'), id: 1 },
    { name: t('poolInfo'), id: 2 },
    ...(checkResult?.value?.owner_txs?.length ?? 0 > 0
      ? [{ name: t('ownerTxs'), id: 3 }]
      : []),
  ]
})

const visible = computed({
  get() {
    return modelValue
  },
  set(value) {
    $emit('update:modelValue', value)
  },
})
const riskAIList = computed(() => {
  let list = checkResult.value?.ai_report?.risk || []
  list = list?.map((i: any) => ({
    ...i,
    risk_level: i.risk_removed == 1 ? '1' : i?.risk_level,
  }))
  return list
})
const hasNoAdmin = computed(() => {
  return (
    !(
      checkResult?.value?.owner &&
      !(
        checkResult?.value?.owner?.startsWith('0x00000') ||
        checkResult?.value?.owner?.startsWith('T9yD14Nj9j7x') ||
        checkResult?.value?.owner_type === 'Contract'
      )
    ) &&
    (checkResult?.value?.can_take_back_ownership == undefined ||
      checkResult?.value?.can_take_back_ownership === '0') &&
    (checkResult?.value?.hidden_owner == undefined ||
      checkResult?.value?.hidden_owner !== '1') &&
    checkResult?.value?.owner !== ''
  )
})
const riskList = computed(() => {
  if (checkResult?.value) {
    return formatRisk(checkResult.value) || []
  }
  return []
})
const ave_remarks = computed(() => {
  if (checkResult?.value?.ave_remarks) {
    return JSON.parse(checkResult?.value?.ave_remarks)
  }
  return {}
})
const lp_remark = computed(() => {
  return ave_remarks?.value.lp_remark || ''
})

const holder_remark = computed(() => {
  return ave_remarks?.value.holder_remark || ''
})

// const tx_liq_remark = computed(() => {
//   return ave_remarks?.value.tx_liq_remark || ''
// })

const risk_remark = computed(() => {
  return ave_remarks?.value.risk_remark || ''
})
const holdersPieData = computed(() => {
  const list = checkResult?.value?.token_holders_rank || []
  const q = list.reduce((p, c) => {
    return p + Number(c.quantity)
  }, 0)
  const p = q / Number(checkResult?.value?.total)
  return [
    {
      name: 'tokenHolders',
      value: p,
    },
    {
      name: 'default',
      value: 1 - p,
    },
  ]
})
const range = computed(() => {
  return holdersPieData?.value?.[0]?.value || 0
})
const pairHoldersPieData = computed(() => {
  const list = checkResult?.value?.pair_holders_rank || []
  const q = list.reduce((p, c) => {
    let s = 0
    if (formatLock(c)) {
      s =
        Number(c?.percent) ||
        Number(c?.quantity) / (checkResult?.value?.pair_total ?? 1)
    }
    return p + s
  }, 0)
  // let p = q / this.checkResult.pair_total
  const p = q
  return [
    {
      name: 'pairHolders',
      value: p,
    },
    {
      name: 'default',
      value: 1 - p,
    },
  ]
})
const rangePair = computed(() => {
  return pairHoldersPieData?.value?.[0]?.value || 0
})
const riskSimulateList = computed(() => {
  const a = []
  if (
    (checkResult?.value?.holder_analysis?.sell_failure ?? 0) > 0 &&
    checkResult?.value?.some_users_are_blocked == 1
  ) {
    a.push([2, t('some_users_are_blocked')])
  }
  if (
    (checkResult?.value?.holder_analysis?.balance_disappeared ?? 0) > 0 &&
    checkResult?.value?.some_users_balance_are_tampered == 1
  ) {
    a.push([1, t('some_users_balance_are_tampered')])
  }
  return a
})
const statistics_risk = computed(() => {
  let num = riskList?.value?.filter((i) => i[0] == 2)?.length || 0
  if (riskSimulateList?.value) {
    riskSimulateList?.value?.forEach((item) => {
      if (item[0] == 2) {
        num = num + 1
      }
    })
  }

  return checkResult?.value?.audit_pass_by ? 0 : num
})

const noteList = computed(() => {
  return formatNote(checkResult?.value ?? undefined) || []
})
const statistics_unknown = computed(() => {
  let num = noteList.value.length
  if (
    Number(checkResult?.value?.sell_gas) >= 0.1 &&
    filterGas(
      Number(checkResult?.value?.sell_gas),
      checkResult?.value?.chain
    ) === '#f81111'
  ) {
    num = num + 1
  }
  if (
    Number(checkResult?.value?.buy_gas) >= 0.1 &&
    filterGas(
      Number(checkResult?.value?.buy_gas),
      checkResult?.value?.chain
    ) === '#f81111'
  ) {
    num = num + 1
  }
  if (
    Number(checkResult?.value?.approve_gas) >= 0.1 &&
    filterGas(
      Number(checkResult?.value?.approve_gas),
      checkResult?.value?.chain
    ) === '#f81111'
  ) {
    num = num + 1
  }
  num = num + riskList?.value?.filter((i) => i[0] == 0.6)?.length
  return checkResult?.value?.audit_pass_by ? 0 : num
})
const statistics_warning = computed(() => {
  let num = 0
  if (Number(checkResult?.value?.analysis_creator_gt_5percent || 0) > 5) {
    num = num + 1
  }
  if (checkResult?.value?.analysis_scam_wallet === '1') {
    num = num + 1
  }
  if (Number(checkResult?.value?.analysis_lp_creator_gt_5percent || 0) > 5) {
    num = num + 1
  }
  if (checkResult?.value?.analysis_big_wallet === '1') {
    num = num + 1
  }
  if (
    checkResult?.value?.analysis_lp_locked_or_burned_gt_15days &&
    Number(checkResult?.value?.analysis_lp_locked_or_burned_gt_15days) < 50
  ) {
    num = num + 1
  }
  if (
    checkResult?.value?.analysis_lp_current_adequate &&
    checkResult?.value?.analysis_lp_current_adequate == '0'
  ) {
    num = num + 1
  }
  if (
    checkResult?.value?.big_lp_without_any_lock &&
    checkResult?.value?.big_lp_without_any_lock == 1
  ) {
    num = num + 1
  }
  num = num + riskList?.value?.filter((i) => i[0] == 1)?.length
  if (riskSimulateList?.value) {
    riskSimulateList?.value?.forEach((item) => {
      if (item[0] == 1) {
        num = num + 1
      }
    })
  }
  return checkResult?.value?.audit_pass_by ? 0 : num
})
const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenStore.token?.chain || ''
  return chain
})
const userAddress = computed(() => {
  if(botStore.evmAddress){
  const obj =  botStore.userInfo?.addresses?.find(i=> i.chain ==chain.value)
    if (obj) {
      return obj.address
    } else {
      return botStore?.evmAddress
    }
  } else {
    return  walletStore?.address || ''
  }
})
watch(statistics_risk, (val) => {
  checkStore.statistics_risk_store =  val
})
watch(statistics_warning, (val) => {
  checkStore.statistics_warning_store =  val
})
watch(statistics_unknown, (val) => {
  checkStore.statistics_unknown_store =  val
})
watch(()=>visible.value, (val) => {
  if (val) {
    getVote()
  }
})

onMounted(() => {
  getVote()
})
watch(()=>useFollowStore().currentAddress, () => {
  getVote()
})
function formatRisk(checkResult?: Check) {
  if (!showResult || !checkResult?.risk_score) {
    return []
  }
  const a = []
  const o: Record<string | number, string> = {
    '-1': t('noLookLike'),
    0: t('checkFailed'),
    1: t('isHoneypot'),
  }
  let risk1 = 0
  if (checkResult.is_honeypot === 0) {
    risk1 = 1
  } else if (checkResult.is_honeypot === 1) {
    risk1 = 2
  } else {
    risk1 = 0
  }
  if (checkResult.is_honeypot !== undefined) {
    a.push([risk1, o[checkResult.is_honeypot as keyof typeof o]])
  }
  const risk2 = checkResult.has_code === 0 ? 2 : 0
  const risk2Msg =
    checkResult.has_code === 0 ? t('open-source') : t('openSource')
  if (checkResult.has_code !== undefined && checkResult?.chain !== 'solana') {
    a.push([risk2, risk2Msg])
  }

  const risk3 = checkResult.owner_change_balance === '1' ? 2 : 0
  const risk3Msg =
    checkResult.owner_change_balance === '1'
      ? t('ownerChangeBalance')
      : t('ownerNoChangeBalance')
  if (checkResult.owner_change_balance !== undefined) {
    a.push([risk3, risk3Msg])
  }
  let risk4 = checkResult.is_proxy === '1' ? 2 : 0
  let risk4Msg = checkResult.is_proxy === '1' ? t('isProxy') : t('isNotProxy')
  if (risk4 === 2 && hasNoAdmin) {
    if (checkResult.has_owner_removed_risk === 1) {
      risk4 = 0.5
      risk4Msg = t('hasNoAuth') + t('isProxyNoAuth')
    } else {
      risk4 = 0.6
    }
  }
  if (checkResult.is_proxy !== undefined) {
    a.push([risk4, risk4Msg])
  }
  let risk5 = checkResult?.slippage_modifiable === 1 ? 1 : 0
  let risk5Msg =
    checkResult.slippage_modifiable === 1
      ? t('slippageModifiable')
      : t('noSlippageModifiable')
  if (risk5 === 1 && hasNoAdmin) {
    if (checkResult.has_owner_removed_risk === 1) {
      risk5 = 0.5
      risk5Msg = t('hasNoAuth') + t('noSlippageModifiable')
    } else {
      risk5 = 0.6
    }
  }
  if (checkResult.slippage_modifiable !== undefined) {
    a.push([risk5, risk5Msg])
  }
  let risk6 = checkResult.has_white_method === 1 ? 1 : 0
  let risk6Msg =
    checkResult.has_white_method === 1 ? t('whitelist') : t('noWhitelist')
  if (risk6 > 0 && hasNoAdmin) {
    if (checkResult.has_owner_removed_risk === 1) {
      risk6 = 0.5
      risk6Msg = t('hasNoAuth') + t('whitelistNoAuth')
    } else {
      risk6 = 0.6
    }
  }
  if (checkResult.has_white_method !== undefined) {
    a.push([risk6, risk6Msg])
  }
  let risk7 = checkResult.has_black_method === 1 ? 1 : 0
  let risk7Msg =
    checkResult.has_black_method === 1 ? t('blacklist') : t('noBlacklist')
  if (risk7 > 0 && hasNoAdmin) {
    if (checkResult.has_owner_removed_risk === 1) {
      risk7 = 0.5
      risk7Msg = t('hasNoAuth') + t('blacklistNoAuth')
    } else {
      risk7 = 0.6
    }
  }
  if (checkResult.has_black_method !== undefined) {
    a.push([risk7, risk7Msg])
  }
  if (checkResult.owner !== '' && checkResult.owner !== '-') {
    const risk8 = !hasNoAdmin.value ? 1 : 0
    const risk8Msg = !hasNoAdmin.value
      ? t('dropContractAuth')
      : t('dropContractAuth1')
    // if (hasNoAdmin && !checkResult.has_owner_removed_risk) {
    //   risk8 = 0.6
    //   risk8Msg = t('notSureDropContractAuth')
    // }
    if (!checkResult?.audit_pass_by || hasNoAdmin) {
      a.push([risk8, risk8Msg])
    }
  }

  let risk9 = checkResult.has_mint_method === 1 ? 1 : 0
  let risk9Msg =
    checkResult.has_mint_method === 1 ? t('canMint') : t('canNotMint')
  if (risk9 > 0 && hasNoAdmin) {
    if (checkResult.has_owner_removed_risk === 1) {
      risk9 = 0.5
      risk9Msg = t('hasNoAuth') + t('canNotMint')
    } else {
      risk9 = 0.6
    }
  }
  if (checkResult.has_mint_method !== undefined) {
    a.push([risk9, risk9Msg])
  }
  const risk10 = !hasLpLock ? 1 : 0
  const risk10Msg = !hasLpLock ? t('hasNoLpLock') : t('hasLpLock')
  if (checkResult.hasLpLock !== undefined) {
    a.push([risk10, risk10Msg])
  }
  const risk11 = checkResult.can_take_back_ownership === '1' ? 1 : 0
  const risk11Msg =
    checkResult.can_take_back_ownership === '1'
      ? t('canTakeBackOwnership')
      : t('canNotTakeBackOwnership')
  if (checkResult.can_take_back_ownership !== undefined) {
    a.push([risk11, risk11Msg])
  }
  const risk13 = checkResult.trading_cooldown === '1' ? 1 : 0
  const risk13Msg =
    checkResult.trading_cooldown === '1'
      ? t('tradingCoolDown')
      : t('noTradingCoolDown')
  if (checkResult.trading_cooldown !== undefined) {
    a.push([risk13, risk13Msg])
  }
  if (checkResult.hidden_owner === '1') {
    a.push([2, t('hasHiddenOwner')])
  }
  if (checkResult.other_potential_risks) {
    a.push([1, checkResult.other_potential_risks])
  }

  if (checkResult.note) {
    a.push([1, checkResult.note])
  }

  if (checkResult.external_call === '1') {
    a.push([2, t('externalCall')])
  }

  if (checkResult.is_safu_contract) {
    a.push([0, t('isSafuContract')])
  }
  if (checkResult?.is_recidivist >= 1) {
    a.push([2, t('isRecidivist')])
  }
  if (checkResult?.has_malicious_code == 1) {
    a.push([2, t('has_malicious_code')])
  }
  if (checkResult?.has_sell_max_limit == 1) {
    // if (checkResult?.has_owner_removed_risk !==1) {
    a.push([0.6, t('has_sell_max_limit')])
    // }
  }

  if (checkResult?.can_remove_liqudity === 1) {
    a.push([2, t('can_remove_liqudity')])
  }

  if (
    checkResult?.liquidity_provider &&
    !Number(checkResult?.pair_lock_percent) &&
    !(
      checkResult?.liquidity_provider?.startsWith?.('0x00000') ||
      checkResult?.liquidity_provider?.startsWith?.('T9yD14Nj9j7x')
    )
  ) {
    a.push([1, t('liquidity_provider')])
  }
  if (checkResult?.chain == 'solana') {
    if (checkResult?.has_top10_holder_amount_over_30 === 1) {
      a.push([2, t('has_top10_holder_amount_over_30')])
    }
    if (checkResult?.has_top10_holder_amount_over_30 === 0) {
      a.push([0, t('has_top10_holder_amount_lt_30')])
    }
    if (checkResult?.has_not_burned_lp === 1) {
      a.push([1, t('has_not_burned_lp')])
    }
    if (checkResult?.has_not_burned_lp === 0) {
      a.push([0, t('has_burned_lp')])
    }
  }
  if (checkResult.is_low_liquidity === 1) {
    a.push([1, t('is_low_liquidity')])
  }
  const b = a.sort((a, b) => b[0] - a[0])
  return b
}

function formatNote(checkResult?: Check) {
  const a = []
  if (checkResult?.is_anti_whale === '1') {
    a.push(t('isAntiWhale'))
  }
  if (checkResult?.anti_whale_modifiable === '1') {
    a.push(t('antiWhaleModifiable'))
  }
  if (checkResult?.cannot_sell_all === '1') {
    a.push(t('cannotSellAll'))
  }
  if (
    (checkResult?.wallet_count_24h_buy &&
      (checkResult?.wallet_count_24h_buy || 0) < 10) ||
    (checkResult?.wallet_count_24h_sell &&
      (checkResult?.wallet_count_24h_sell || 0) < 10)
  ) {
    a.push(t('txNoActive'))
  }
  if (
    (checkResult?.wallet_count_24h_sell &&
      (checkResult?.wallet_count_24h_buy || 0) /
        checkResult?.wallet_count_24h_sell >
        8) ||
    (!checkResult?.wallet_count_24h_sell && checkResult?.wallet_count_24h_buy)
  ) {
    a.push(t('highBuyLowSell'))
  }
  if (
    checkResult?.vol_24h_top100 &&
    Number(checkResult?.vol_24h_top10 || 0) / checkResult?.vol_24h_top100 > 0.75
  ) {
    a.push(t('volumeConcentrated'))
  }
  const vote_support = checkResult?.vote_support || 0
  const vote_against = checkResult?.vote_against || 0
  if (
    vote_support + vote_against > 30 &&
    vote_against / (vote_against + vote_support) > 0.7
  ) {
    a.push(t('lowCommunityScore'))
  }

  if (checkResult?.personal_slippage_modifiable === '1') {
    a.push(t('personalSlippageModifiable'))
  }

  if (checkResult?.selfdestruct === '1') {
    a.push(t('selfdeStruct'))
  }
  return a
}
//获取assets下的图片
function getAssetsImagesUrl(id: string) {
  // 使用 import.meta.glob 引入所有图片
  const imageMap = import.meta.glob('@/assets/images/check-*.svg', {
    eager: true,
    import: 'default',
  }) as Record<string, string>
  // 根据 ID 找到图片路径
  const imageUrl =
    Object.entries(imageMap).find(([key]) =>
      key.endsWith(`check-${id}.svg`)
    )?.[1] || ''
  return imageUrl
}
function formatLock(item?: PairHoldersRank | null) {
  return item?.lock || /lock|null|(black hole)/gi.test(item?.mark || '')
}
function jump(item?: OwnerTxs) {
  if (item?.tx_hash) {
    window.location = formatExplorerUrl(
      checkResult?.value?.chain || '',
      item?.tx_hash || '',
      'tx'
    )
  }
}

function formatVote(checkResult: Check | null) {
  // vote_support 赞同票
  // vote_against 反对票

  let { vote_support = 0, vote_against = 0 } = checkResult ?? {}
  vote_support = vote_support || 0
  vote_against = vote_against || 0
  if (vote_support === 0 && vote_against === 0) {
    return [0, 0, 0]
  }
  const total = vote_support + vote_against
  return [vote_support / total || 0, vote_against / total, total || 0]
}
function formatVoteP(checkResult: Check | null) {
  // vote_support 赞同票
  // vote_against 反对票
  let { vote_support = 0, vote_against = 0 } = checkResult ?? {}
  vote_support = vote_support || 0
  vote_against = vote_against || 0
  if (vote_support === 0 && vote_against === 0) {
    return [0.5, 0.5, 0]
  }
  const total = vote_support + vote_against
  return [vote_support / total || 0, vote_against / total, total || 0]
}

function voteSupport() {
  if(!useFollowStore().currentAddress){
        useBotStore().changeConnectVisible(true)
  }
  if (checkResult?.value?.my_vote !== 0) {
    ElMessage.error(t('voted'))
    return
  }
  const support = () => {
    const tokenId = route.params.id as string
    loadingVote.value = true
    _voteSupport(tokenId, userAddress.value)
      .then(() => {
        if (checkResult?.value?.my_vote === 0) {
          ElMessage.success(t('voteSuccess'))
        } else{
          ElMessage.success(t('success'))
        }
        getVote()
      })
      .catch((err) => {
        ElMessage.error(err.message || err)
      })
      .finally(() => {
        loadingVote.value = false
      })
  }
  ElMessageBox.confirm(t('voteTips'), {
    confirmButtonText: t('confirm1'),
    cancelButtonText: t('cancel'),
    type: 'warning',
  })
    .then(() => {
      support()
    })
    .catch(() => {})
}
function voteAgainst() {
      if(!useFollowStore().currentAddress){
        useBotStore().changeConnectVisible(true)
      }
      if (checkResult?.value?.my_vote !== 0) {
        ElMessage.error(t('voted'))
        return
      }

      const against = () => {
        const tokenId = route.params.id as string
        loadingVote.value = true
        _voteAgainst(tokenId, userAddress.value)
          .then(() => {
            if (checkResult?.value?.my_vote === 0) {
              ElMessage.success(t('voteSuccess'))
            } else{
              ElMessage.success(t('success'))
            }
            getVote()
          })
          .catch(err => {
            ElMessage.error(err.message || err)
          })
          .finally(() => {
            loadingVote.value = false
          })
      }
      ElMessageBox.confirm(t('voteTips'), {
        confirmButtonText: t('confirm1'),
        cancelButtonText: t('cancel'),
        type: 'warning',
      })
        .then(() => {
          against()
        })
        .catch(() => {})
    }
function getVote() {
  if (!(visible.value && useFollowStore().currentAddress)) return
  const tokenId = route.params.id as string
  _getVote(tokenId, userAddress.value).then(res => {
    console.log('--------_getVote-----',res)
      Object.keys(res).forEach(i => {
        if (checkResult.value) {
            checkResult.value[i as keyof Check] = res[i]
        }
      })
      console.log('-------checkResult---',checkResult)
  })
}
// const checkResult1 = computed(() => {
//   console.log('checkResult',checkResult.value)
//   return checkResult.value
// })
</script>

<style lang="scss" scoped>
.check-container {
  .check-content {
    border-radius: 2px;
    padding: 20px 15px;
  }
}
.check-note {
  background: rgba(255, 169, 77, 0.05);
  border: 0.5px solid rgba(255, 187, 25, 0.32);
  border-radius: 4px;
  font-size: 14px;
  color: #eaecef;
  font-weight: 500;
  padding: 20px;
  .icon-alert {
    font-size: 20px;
    color: #faad14;
    font-weight: normal;
    margin-right: 10px;
  }
  .check-note_h {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    color: #eaecef;
    font-weight: 700;
  }
  .check-note_c {
    line-height: 20px;
    font-size: 12px;
  }
}

.icon-net-connect {
  font-size: 20px;
}

.check-input {
  width: 100%;
  margin: 30px auto 0;
  text-align: center;
}

.submit-button-container:deep(.el-form-item__content) {
  display: block;
  text-align: center;
}
.submit-button {
  width: 100%;
  border-radius: 4px;
}

.title {
  font-size: 18px;
  color: #878fbc;
  letter-spacing: 0;
  line-height: 18px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 30px;
  img {
    width: 24px;
    margin-right: 5px;
  }
}
.form-container {
  padding: 0 15px;
  :deep(.van-field) {
    box-shadow: 0 2px 4px 0 rgba(221, 221, 221, 0.52);
    border-radius: 10px;
    .label {
      // min-width: 3em;
      width: auto;
    }
  }
  .submit-button {
    border-radius: 10px;
    margin-top: 20px;
  }
}

.card {
  // background: rgba($color: #d8d8d8, $alpha: 0.13);
  // border-radius: 4px;
  background: #191e2d;
  border-radius: 10px;
  margin: 0 0 10px 0;
  padding: 10px 10px;
  &.basic {
    background: var(--dialog-list-hover);
    // border: 1px solid var(--d-282e35-l-e5e5e5);
    border-radius: 4px;
    // .card-list-item > :nth-child(1) {
    //   color: #848e9c;
    // }
  }
  &.card1 {
    padding: 0;
    background: transparent;
  }
  .remark {
    font-size: 12px;
    color: #3f80f7;
    letter-spacing: 0;
    font-weight: 400;
    margin-top: 10px;
    line-height: 1.5;
  }
}
.card-h {
  font-size: 15px;
  color: #eaecef;
  font-weight: 500;
  letter-spacing: 0;
  margin: 0 0 15px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.h-2 {
    font-size: 12px;
    font-weight: 400;
    margin: 0;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-s {
  display: flex;
  justify-content: space-between;
  padding: 10px 0 0;
  color: var(--main-text);
  // align-items: center;
  font-size: 12px;
  .label {
    margin-right: 10px;
    font-weight: 400;
    color: var(--third-text);
  }
  .value {
    font-weight: 500;
  }
  .range-text {
    font-size: 12px;
    margin-right: 5px;
    color: var(--secondary-text);
  }
  .range {
    width: 35%;
    background: var(--d-1F242A-l-F5F5F5);
    border-radius: 4px;
    display: flex;
    .range-bar {
      background-color: #3f80f7;
      color: #eaecef;
      border-radius: 4px 0 0 4px;
      font-size: 12px;
      height: 6px;
    }
  }
}
.card-list-item {
  font-size: 12px;
  // color: var(--custom-font-5-color);
  letter-spacing: 0;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-top: 10px;
  & + .card-list-item {
    margin-top: 10px;
  }

  &.basic-content {
    margin-top: 5px;
  }
  &.in {
    & + .in {
      margin-top: 10px;
    }
  }
  &.bg-warning {
    span,
    a {
      color: #f8be46;
    }
  }

  &.holder-item {
    color: var(--secondary-text);
    > :nth-child(1) {
      color: var(--third-text);
    }
  }
  > :nth-child(1) {
    color: var(--secondary-text);
  }
  > :nth-child(2) {
    text-align: left;
    margin-left: 5px;
  }
  > .danger {
    color: #f81111;
  }
  > .warning {
    color: #f8be46;
  }

  &.danger {
    color: #f81111;
  }
  &.warning {
    color: #f8be46;
  }
  // & + .card-list-item {
  //   margin-top: 15px;
  // }
  .icon-svg {
    font-size: 20px;
    width: 12px;
    height: 12px;
    vertical-align: middle;
  }
  &.flex-start {
    justify-content: flex-start;
    align-items: center;
    .risk-message {
      flex: 1;
      text-align: left;
      margin-left: 2px;
    }
  }
}
.arc-progress {
  margin: 0px 0 0px;
}
.ellipsis {
  max-width: 60vw;
  display: inline-block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.select-chain {
  :deep(.van-dropdown-menu__bar) {
    height: auto;
    box-shadow: none;
    .van-dropdown-menu__title {
      padding-left: 0;
      padding-right: 5px;
      margin-right: 10px;
    }
  }
}
.btn-copy {
  margin-left: 5px;
}

.feedback-tips {
  font-size: 14px;
  color: #eaecef;
  padding: 30px 30px 20px 30px;
  line-height: 1.5;
  text-align: center;
  a {
    text-decoration: underline;
  }
}
.technical-support {
  font-size: 12px;
  color: #848e9c;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 30px 0px 30px;
  cursor: pointer;
  img {
    width: 60px;
    margin: 15px 0 5px 0;
  }
}
.line-through {
  text-decoration: line-through;
  text-decoration-color: currentColor;
}
.check-title {
  font-size: 14px;
  color: #eaecef;
  font-weight: 500;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .icon-svg {
    font-size: 20px;
    margin-right: 5px;
  }
}

.share-container {
  text-align: right;
  margin-bottom: 7px;
  .share-button {
    border: 1px solid rgba(151, 151, 151, 0.2);
    padding: 5px 20px;
    border-radius: 20px;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    color: #3f80f7;
    font-weight: 500;
    cursor: pointer;
    background-color: transparent;
    &:hover,
    &:active {
      opacity: 0.6;
    }
    .icon-fenxiang {
      margin-right: 5px;
      font-size: 18px;
    }
  }
}
.icon-lock {
  font-size: 18px;
  margin-right: 5px;
}
.waiting-check-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  > img {
    width: 15%;
    min-width: 200px;
  }
  > span {
    margin-top: 20px;
    color: #848e9c;
  }
  .check-title {
    position: absolute;
    left: 0;
    top: 0;
  }
}
.table-lock {
  color: var(--secondary-text);
  background: var(--dialog-list-hover);
  border-radius: 4px;
  width: 100%;
  font-size: 12px;
  padding: 5px;
  margin: 5px 0;
  td,
  th {
    text-align: left;
    color: var(--third-text);
    &:nth-child(2),
    &:nth-child(3),
    &:nth-child(4) {
      text-align: right;
    }
  }
}
.community-container {
  display: flex;
  align-items: flex-start;
  .thumbs-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
  }
  .icon-thumbs {
    display: inline-flex;
    font-size: 24px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    background-color: #131722;
    width: 44px;
    height: 44px;
    &.down {
      transform: rotateZ(180deg);
      background-color: #fafafa;
    }
    &:active {
      opacity: 0.5;
    }
  }

  .thumbs-label {
    font-size: 12px;
    color: var(--secondary-text);
    line-height: 20px;
    font-weight: 400;
    margin-top: 5px;
  }
}
.range-container {
  // padding-top: 15px;
  flex: 1;
  margin: 0 15px;
  text-align: center;
  .range {
    font-size: 12px;
    color: #eaecef;
    font-weight: 400;
    display: flex;
    .left {
      text-align: left;
      background: #12b886;
      border-radius: 7px 0 0 7px;
      height: 14px;
      line-height: 14px;
      clip-path: polygon(100% 0, calc(100% - 3px) 100%, 0 100%, 0 0);
      padding: 0 5px;
      min-width: 40px;
      max-width: calc(100% - 40px);
    }
    .right {
      background: #f6465d;
      height: 14px;
      line-height: 14px;
      border-radius: 0 7px 7px 0;
      padding: 0 5px;
      text-align: right;
      clip-path: polygon(3px 0, 0 100%, 100% 100%, 100% 0);
      min-width: 40px;
      max-width: calc(100% - 40px);
    }
  }

  .range-label {
    font-size: 11px;
    color: #3f80f7;
    font-weight: 400;
    margin-top: 10px;
  }
}
.icon-contract {
  font-size: 12px;
  margin-right: 2px;
}
.check-alert {
  font-size: 12px;
  color: #ffbb19;
  letter-spacing: 0;
  font-weight: 400;
  padding: 10px 0;
  align-items: baseline;
  display: flex;
  .icon-info {
    font-size: 14px;
    margin-right: 3px;
  }
}
.indent {
  margin-left: 15px;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.1s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.audit-progress {
  position: relative;
  .danbao-bg-absolute {
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -63px;
    margin-top: 9px;
    text-decoration: none;
    .danbao-bg {
      transform: rotate(-30deg);
      background: url('../../../../assets/images/danbao-bg.svg') no-repeat
        center;
      background-size: cover;
      zoom: 0.5;
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 80px;
        height: 90px;
        span {
          display: block;
          &:nth-child(1) {
            font-size: 11px;
            color: #3f80f7;
          }
          &:nth-child(2) {
            font-size: 10px;
            color: #3f80f7;
          }
        }
      }
    }
  }
  .audit-bg-absolute {
    position: absolute;
    top: 0;
    right: 50%;
    margin-right: -73px;
    margin-top: 9px;
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
    .audit-bg {
      transform: rotate(-30deg);
      background: url('../../../../assets/images/audit-bg.svg') no-repeat center;
      background-size: cover;
      zoom: 0.5;
      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 130px;
        height: 80px;
        span {
          display: block;
          &:nth-child(1) {
            font-size: 11px;
            color: #3f80f7;
          }
          &:nth-child(2) {
            font-size: 10px;
            color: #3f80f7;
          }
        }
      }
    }
  }
}
.risk-addition {
  margin-top: 10px;
  li {
    font-size: 12px;
    margin-bottom: 10px;
    &.danger {
      color: #f6465d;
    }
    &.warning {
      color: #ff9e04;
    }
  }
}
.risk-statics {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: 10px;
  .item1 {
    display: flex;
    align-items: center;
    &:nth-child(1),
    &:nth-child(2) {
      margin-right: 24px;
    }
    .icon-svg {
      height: 16px;
      width: 16px;
    }
    span {
      &.text {
        font-size: 12px;
        color: #848e9c;
        letter-spacing: 0;
        font-weight: 400;
        margin-left: 4px;
      }
      &.num {
        font-size: 16px;
        color: var(--secondary-text);
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 500;
        margin-left: 5px;
      }
    }
  }
}
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  a {
    font-size: 12px;
    color: #999;
    text-decoration: none;
    text-align: center;
    padding: 4px 0;
    display: inline-block;
    &:hover {
      color: var(--main-text);
    }
    &.active {
      color: var(--main-text);
      border-bottom: 2px solid #3f80f7;
    }
  }
}
.gray {
  background: transparent;
}
.simulate {
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    color: var(--main-text);
    background-color: var(--d-333-l-F2F2F2);
    letter-spacing: 0;
    font-weight: 400;
    text-align: center;
    margin-top: 10px;
    tr {
      td {
        // border: 1px solid rgba(71, 77, 87, 0.3);
        padding: 5px 5px;
        &.tl {
          text-align: left;
          padding-left: 5px;
        }
        span {
          line-height: 1.5;
        }
        .mt-5 {
          margin-top: 5px;
        }
        .color-999 {
          color: #848e9c;
        }
        .avgBg {
          background: #ff9f00;
          color: #eaecef;
          padding: 0px 5px;
          .color-999 {
            color: #fff;
          }
        }
        .failedBg {
          background: #ff9f00;
          color: #eaecef;
        }
        .failedColor {
          color: #ff9f00;
        }
        .balanceBg {
          background: #999999;
          color: #eaecef;
        }
        .color-F6465D {
          color: #f6465d;
        }
        .flex-start {
          display: flex;
          span {
            flex: 1;
          }
        }
      }
    }
  }
  ul.risk-addition {
    margin-top: 15px;
    padding: 0;
  }
}
.ownerTxs {
  font-size: 14px;
  color: #fff;
  letter-spacing: 0;
  font-weight: 400;
  margin-top: 10px;
  i {
    font-size: 12px;
    color: #cccccc;
    vertical-align: middle;
  }
  .color-999999 {
    color: #999999;
  }
  .color-777e90 {
    color: #848e9c;
    font-size: 12px;
  }
  .top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .date {
      width: 100px;
      text-align: right;
    }
    .ellipsis {
      max-width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .bottom {
    padding: 5px 10px;
    background: #1d2030;
    border-radius: 4px;
    margin-top: 5px;
    .flex-start {
      display: flex;
      align-items: baseline;
      justify-content: flex-start;
    }
  }
}
</style>
