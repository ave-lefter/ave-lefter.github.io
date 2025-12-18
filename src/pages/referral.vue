<template>
  <div class="referral dark flex-1">
    <div class="container">
      <div class="referral-top">
        <div class="left">
          <div :style="{ fontSize: localeStore.locale?.includes?.('zh-') ? '72px' : '50px' }">
            {{ $t('referralS1') }}
          </div>
          <div
            :style="{ fontSize: localeStore.locale?.includes?.('zh-') ? '30px' : '20px' }"
            v-html="$t('referralS2')"
          />
          <!-- 最高可获得<span>60%</span>返佣 -->
        </div>
        <div class="right">
          <div class="right-top">
            <table>
              <thead>
                <tr>
                  <th>{{ $t('yourLevel') }}</th>
                  <th>{{ $t('yourRebateRate') }}</th>
                  <!-- <th>{{ $t('yourChannelRebateRate') }}</th> -->
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    class="font-700 color-#FFC94E pt-10px"
                    :style="{ fontSize: referralInfo?.refCode ? '24px' : '14px' }"
                  >
                    {{
                      referralInfo?.refCode
                        ? referralInfo?.vip || $t('ordinary')
                        : $t('viewAfterLogin')
                    }}
                  </td>
                  <td
                    class="font-700 color-#FFF pt-10px"
                    :style="{ fontSize: referralInfo?.refCode ? '24px' : '14px' }"
                  >
                    {{
                      referralInfo?.refCode
                        ? Math.round((referralInfo?.refRatio || 0) / 100) + '%'
                        : $t('viewAfterLogin')
                    }}
                  </td>
                  <!-- <td>{{ referralInfo?.channelRefRatio ? Math.round((referralInfo?.channelRefRatio || 0) / 100) + '%' : '--' }}</td> -->
                </tr>
              </tbody>
            </table>
            <img
              class="right-top-img"
              height="180"
              width="180"
              src="~@/assets/images/referral/vip.png"
              alt=""
            >
          </div>
          <div class="right-bottom">
            <div class="right-bottom-li">
              <span style="margin-right: auto">{{ $t('referralLink') }}</span>
              <span>{{ refCode ? shareLink : '--' }}</span>
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
            <div class="right-bottom-li" style="margin-top: 24px">
              <span style="margin-right: auto">{{ $t('referralCode') }}</span>
              <span>{{ refCode || '--' }}</span>
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
            <button class="right-bottom-btn clickable" @click.stop="invite">
              {{
                !(botStore.evmAddress && botStore.accessToken) && !walletStore.address
                  ? $t('loginNow')
                  : $t('invite')
              }}
            </button>
          </div>
        </div>
      </div>
      <div class="text-center text-60px font-700 mt-80px color-#FFF">
        Ave.ai {{ $t('partnership') }}
      </div>
      <div class="flex justify-between mt-60px">
        <div class="note-li">
          <div class="note-li_title flex items-center">
            <img
              class="mr-10px"
              height="60"
              width="60"
              src="@/assets/images/referral/d.svg"
              alt=""
              srcset=""
            >
            <span>{{ $t('maximumRebate') }}</span>
          </div>
          <ul class="note-li_content">
            <li>{{ $t('referralS11') }}</li>
            <li>{{ $t('referralS12') }}</li>
            <li>{{ $t('referralS13') }}</li>
          </ul>
        </div>
        <div class="note-li">
          <div class="note-li_title flex items-center">
            <img
              class="mr-10px"
              height="60"
              width="60"
              src="@/assets/images/referral/p.svg"
              alt=""
              srcset=""
            >
            <span>{{ $t('referralTitle') }}</span>
          </div>
          <ul class="note-li_content">
            <li>{{ $t('referralS21') }}</li>
            <li>{{ $t('referralS22') }}</li>
          </ul>
        </div>
      </div>
      <div class="flex-center mt-60px">
        <button class="apply-btn clickable" @click.stop="apply">{{ $t('apply') }}</button>
      </div>
      <div class="section-title mt-80px">
        <img width="28" height="28" src="@/assets/images/referral/data.svg" alt="" srcset="" >
        <span>{{ $t('dataOverview') }}</span>
      </div>
      <ul class="data-list">
        <li class="data-card">
          <div>
            <div class="data-card_label">{{ $t('withdrawable') }}</div>
            <div class="text-20px lh-26px">
              ${{ formatNumber(referralInfo?.totalWithdrawableAmount || 0) }}
            </div>
            <div class="data-card_label mt-24px">{{ $t('withdrawn') }}</div>
            <div class="text-20px lh-26px">
              ${{
                formatNumber(
                  (referralInfo?.totalIncomeAmount || 0) -
                    (referralInfo?.totalWithdrawableAmount || 0)
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
            <div class="data-card_label">{{ $t('totalRebateAmount') }}</div>
            <div class="text-20px lh-26px">
              $ {{ formatNumber(referralInfo?.totalIncomeAmount || 0) }}
            </div>
            <div v-show="(referralInfo?.channelRefRatio || 0) > 0" class="data-card_label mt-24px">
              {{ $t('totalChannelRebate') }}
            </div>
            <div v-show="(referralInfo?.channelRefRatio || 0) > 0" class="text-20px lh-26px">
              $ {{ formatNumber(referralInfo?.channelReferralIncomeAmount || 0) }}
            </div>
          </div>
        </li>
        <li class="data-card">
          <div>
            <div class="data-card_label">{{ $t('totalInvitees') }}</div>
            <div class="text-20px lh-26px">{{ invitees || 0 }}</div>
            <div class="data-card_label mt-24px">{{ $t('swapInvitees24H') }}</div>
            <div class="text-20px lh-26px">{{ referralInfo?.swapInvitees24H || 0 }}</div>
          </div>
        </li>
      </ul>

      <div class="section-title mt-60px">
        <img width="28" height="28" src="@/assets/images/referral/f.svg" alt="" srcset="" >
        <span>{{ $t('friends') }}</span>
      </div>
      <el-table
        :data="inviteeList"
        row-class-name="[--el-table-border:1px_solid_#1F242A]"
        :header-row-style="{ fontSize: '12px' }"
        style="width: 100%"
        class="table-list"
      >
        <el-table-column :width="550" prop="time" :label="$t('registerTime')">
          <template #default="{ row }">
            {{ formatDate(row.bindRefTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('friendName')">
          <template #default="{ row }">
            {{ row?.username }}
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
      <div class="section-title mt-60px">
        <img width="28" height="28" src="@/assets/images/referral/w.svg" alt="" srcset="" >
        <span>{{ $t('withdrawingList') }}</span
        ><span
          v-if="referralInfo?.startTime || referralInfo?.endTime"
          style="font-size: 14px; font-weight: 400; color: #999; margin-left: 5px"
          >({{ $t('statisticalPeriod') }}:
          {{ referralInfo.startTime ? formatDate(referralInfo.startTime, 'YYYY.MM.DD') : '' }}-{{
            referralInfo.endTime ? formatDate(referralInfo.endTime, 'YYYY.MM.DD') : ''
          }})</span
        >
      </div>
      <el-table
        :data="withdrawableListPage"
        row-class-name="[--el-table-border:1px_solid_#1F242A]"
        :header-row-style="{ fontSize: '12px' }"
        style="width: 100%"
        class="table-list"
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
        <el-table-column prop="name" :label="$t('amount')">
          <template #default="{ row }">
            <div style="line-height: 1">
              {{ formatNumber(formatAmount(row.value || 0, row.decimals || 0)) }} {{ row.symbol }}
            </div>
            <div
              style="
                font-size: 12px;
                color: #999;
                line-height: 1;
                margin-top: 3px;
                font-weight: 400;
              "
            >
              ≈${{
                formatNumber(
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
      <div class="section-title mt-60px">
        <img width="28" height="28" src="@/assets/images/referral/wd.svg" alt="" srcset="" >
        <span>{{ $t('withdrawalRecord') }}</span>
      </div>
      <el-table
        :data="withdrawRecordListPage"
        row-class-name="[--el-table-border:1px_solid_#1F242A]"
        :header-row-style="{ fontSize: '12px' }"
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
            <div
              v-for="(j, k) in row.list || []"
              :key="k"
              style="line-height: 24px; height: 24px; width: 24px"
              class="token-box position-relative t-l"
            >
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
              <span class="ml-5"> {{ j.tokenSymbol }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('amount')">
          <template #default="{ row }">
            <div v-for="(j, k) in row.list || []" :key="k" style="line-height: 24px" class="t-l">
              {{ formatNumber(formatAmount(j.withdrawValue || 0, j.tokenDecimals || 0)) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" :label="$t('withdrawalStatus')" align="left">
          <template #default="{ row }">
            <div v-for="(j, k) in row.list || []" :key="k" style="line-height: 24px" class="t-l">
              <span
                class="clickable color-#959A9F"
                :style="{ color: ['generated', 'pending']?.includes(j.status) ? '#ffffff' : '' }"
                @click.stop="goLink(j)"
                >{{ formatStatus(j.status) }}</span
              >
              <!-- <van-icon v-if="j.errorLog" class="ml-5 clickable" style="color: #aaa;" name="warning-o" @click.stop="$messageBox.alert(j.errorLog)" /> -->
            </div>
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
              <span style="margin-top: 1px">{{ formatStatus(row.status) }}</span>
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
      <el-dialog
        v-model="dialogShare"
        class="dialog-rebate"
        :title="$t('inviteFriends')"
        width="460"
        append-to-body
      >
        <div class="content">
          <div v-if="dialogShare" class="share-card-rebate">
            <img
              v-if="localeStore.locale.includes('zh-')"
              class="share-bg-img"
              width="400"
              src="@/assets/images/refer-bg/rebate-cn.png"
              alt=""
              srcset=""
            >
            <img
              v-else
              class="share-bg-img"
              src="@/assets/images/refer-bg/rebate-en.png"
              width="400"
              alt=""
              srcset=""
            >
            <img class="img-qr" :src="qrCodeUrl" width="100" alt="" >
          </div>
          <div
            class="flex items-center justify-between mt-24pxpx text-12px"
            style="width: 300px; color: #999"
          >
            <div class="flex-col flex-center clickable" @click.stop="downloadSharePoster">
              <img src="@/assets/images/share/download.svg" height="48" alt="" srcset="" >
              <span class="mt-8px">{{ $t('download') }}</span>
            </div>
            <div v-copy="shareLink" class="flex-col flex-center clickable">
              <img src="@/assets/images/share/copy.svg" height="48" alt="" srcset="" >
              <span class="mt-8px">{{ $t('copy') }}</span>
            </div>
            <div class="flex-col flex-center clickable" @click.stop="jumpX()">
              <img src="@/assets/images/share/twitter.svg" height="48" alt="" srcset="" >
              <span class="mt-8px">Twitter</span>
            </div>
            <div class="flex-col flex-center clickable" @click.stop="jumpTg()">
              <img src="@/assets/images/share/tg.svg" height="48" alt="" srcset="" >
              <span class="mt-8px">Telegram</span>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog v-model="dialogConnect" class="dialog-rebate" width="460" append-to-body>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getReferralInfo as getReferralInfoApi,
  getInviteeList as getInviteeListApi,
  createWithdrawIncomeOrder as createWithdrawIncomeOrderApi,
  getWithdrawRecordList as getWithdrawRecordListApi,
} from '~/api/referral'
import { formatExplorerUrl } from '~/utils'
import BigNumber from 'bignumber.js'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

// 类型定义
interface ReferralInfo {
  refCode?: string
  vip?: string
  refRatio?: number
  channelRefRatio?: number
  totalWithdrawableAmount?: number
  totalIncomeAmount?: number
  channelReferralIncomeAmount?: number
  invitees1?: number
  invitees2?: number
  invitees3?: number
  swapInvitees24H?: number
  canWithdraw?: boolean
  withdrawableList?: WithdrawableItem[]
  startTime?: string
  endTime?: string
}

interface InviteeItem {
  level: number
  guid: string
  bindRefTime: number
  username: string
  vip?: string
}

interface WithdrawableItem {
  chain: string
  symbol: string
  logoUrl?: string
  value: string
  decimals: number
  price?: number
  canWithdraw: boolean
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
  txHash?: string
  errorLog?: string
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
})
const inviteeList = ref<InviteeItem[]>([])
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

// Store
const botStore = useBotStore()
const globalStore = useGlobalStore()
const { t } = useI18n()
const localeStore = useLocaleStore()
const walletStore = useWalletStore()

// 计算属性
const refCode = computed(() => {
  return referralInfo.value.refCode || ''
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

// 方法
const init = () => {
  if (botStore.accessToken) {
    getReferralInfo()
    getInviteeList()
    getWithdrawRecordList()
  } else {
    referralInfo.value = {
      refCode: '',
      withdrawableList: [],
    }
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
    const data = { pageNo: currentPage.value - 1, pageSize: pageSize.value }
    const res = await getInviteeListApi(data)
    inviteeList.value = Array.isArray(res?.userItems) ? res.userItems : []
    total.value = res?.totalUserCount || 0
  } catch (error) {
    console.error('获取邀请列表失败:', error)
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
  background-image: url('@/assets/images/referral/bg.jpg');
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
    background-color: #222222;
    border-radius: 8px;
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: bottom right;
    &:nth-child(1) {
      background-image: url(@/assets/images/referral/data-bg-1.svg);
    }
    &:nth-child(2) {
      background-image: url(@/assets/images/referral/data-bg-2.svg);
    }
    &:nth-child(3) {
      background-image: url(@/assets/images/referral/data-bg-3.svg);
    }

    & + .data-card {
      margin-left: 30px;
    }

    > :first-child {
      flex: 1;
    }
    flex: 1;
    .data-card_label {
      color: #999999;
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
:deep {
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
</style>
