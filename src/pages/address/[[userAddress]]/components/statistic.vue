<template>
  <div class="p-5 flex justify-between mr-5 flex-1 rounded-2 bg-[--d-15171C-l-F8F8F8]">
    <div>
      <div class="flex gap-6 mb-5">
        <UserAvatar
          :key="statistics?.wallet_logo?.logo"
          :wallet_logo="{
            ...(statistics.wallet_logo || {}),
            ...(address === botStore?.evmAddress ? { name: userInfo?.name } : {}),
          }"
          :address="address"
          :chain="chain"
          iconSize="60px"
        />
        <div>
          <div class="flex items-start mb-1.5">
            <UserRemark
              :key="address"
              class="gap-1.5 text-6 leading-7.5 text-[var(--a-text-5-color)]"
              :address="address"
              :remark="defaultRemark"
              :chain="chain"
              :wallet_logo="statistics.wallet_logo"
              iconEditSize="16px"
              :maxRemarkLength="15"
              @updateRemark="onGetWalletBasicInfo"
            />
            <a
              v-if="statistics.x_url"
              class="flex items-center justify-center ml-6 gap-1 px-2 py-1 h-6 rounded text-3 cursor-pointer text-[var(--d-fff-l-18181B)] bg-gradient-to-r from-[rgba(18,184,134,0.1)] to-[rgba(139,79,221,0.1)]"
              :href="statistics.x_url"
              target="_blank"
            >
              <img v-if="isDark" :width="16" src="@/assets/images/connect-x-dark.png" alt="" />
              <img v-else :width="16" src="@/assets/images//connect-x-light.png" alt="" />
              {{ formatNumber(statistics.x_followers || 0, 2) }}
            </a>
            <a
              v-else-if="isSelfAddress"
              class="flex items-center justify-center ml-6 gap-1 px-2 py-1 h-6 rounded text-3 cursor-pointer text-[var(--d-fff-l-18181B)] bg-gradient-to-r from-[rgba(18,184,134,0.1)] to-[rgba(139,79,221,0.1)]"
              @click="_bindTwitter"
            >
              <Icon
                name="custom:twitterx"
                class="text-3 text-[var(--d-fff-l-18181B)]"/>
              {{ $t('connect') }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <div v-copy="address" class="statistic-address flex gap-2.5 cursor-pointer">
              <div
                class="statistic-address-copy flex items-center justify-center px-2 py-1.75 h-6 rounded text-3 gap-1 text-[--d-666-l-959A9F] bg-[--d-222-l-F2F2F2]"
              >
                {{ addressText }}
                <Icon name="bxs:copy" class="text-2.5 clickable text-[--d-666-l-959A9F]" />
              </div>
            </div>
            <div
              class="flex items-center gap-1 px-2 py-0 h-6 rounded text-3 text-[--d-666-l-959A9F] bg-[--d-222-l-F2F2F2]"
            >
              <Icon name="custom:cake" class="text5 text-[--d-666-l-959A9F]" />
              <span>{{ wallet_age?.value }}</span>
              <span>{{ wallet_age?.unit }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2 items-center mb-5 text-6 leading-7.5 font-bold">
        <strong class="text-6 leading-7.5 text-[var(--d-fff-l-333)]">
          {{ uSymbol }}{{ total_balance }} {{ main_token_symbol }}
        </strong>

        <el-switch v-model="currencyStandard" inactive-value="U" :active-value="chain">
          <template #active-action>
            <ChainToken :chain="chain" :width="16" />
          </template>
          <template #inactive-action>
            <span
              class="flex w-full h-full items-center justify-center text-2.5 rounded-full text-[var(--d-fff-l-333)] bg-[var(--d-666-l-fff)]"
              >$</span
            >
          </template>
        </el-switch>
      </div>
      <p class="m-0 mb-2 leading-5 text-3.5 text-[var(--d-666-l-959A9F)]">
        {{ $t('totalPnL2') }}（{{ intervalText }}）
        <Number :value="statistics.profit" :signVisible="isUSDT">
          {{ formatNumber(Math.abs((statistics.profit ?? 0) / main_token_price), 2) }}
          {{ main_token_symbol }}
        </Number>
        <Number :value="statistics.profit_ratio">
          {{ formatNumber(Math.abs((statistics?.profit_ratio ?? 0) * 100), 1) }}%
        </Number>
      </p>
      <p class="m-0 mb-2 leading-5 text-3.5 text-[var(--d-666-l-959A9F)]">
        {{ $t('winRate2') }}（{{ intervalText }}）
        <Number :value="statistics.win_rate">
          {{ formatNumber(Math.abs(statistics.win_rate ?? 0), 1) }}%
        </Number>
      </p>
    </div>
    <div class="flex flex-col justify-between flex-shrink-0">
      <div class="flex justify-end items-center h-15 gap-2 mb-5">
        <a
          v-if="statistics.is_wallet_address_fav === 1"
          class="w-25 px-0 box-border flex items-center justify-center gap-1 py-2.75 px-4.5 bg-[--d-222-l-FFF] text-3 leading-4 cursor-pointer rounded text-[var(--d-666-l-999)] hover:opacity-100 hover:bg-[rgba(246,70,93,0.1)]"
          @click="_deleteAttention"
        >
          <Icon name="custom:accountcheck" class="text-3.5" />
          <span>{{ $t('followed') }}</span>
          <span class="hidden text-[#f6465d]">{{ $t('cancelFollowed') }}</span>
        </a>
        <a
          v-else
          class="flex items-center justify-center gap-1 py-2.75 px-4.5 bg-[--d-222-l-FFF] text-3 leading-4 cursor-pointer rounded text-[var(--d-fff-l-333)]"
          @click="_addAttention"
        >
          <Icon name="custom:accountplus" class="text-4" />
          {{ $t('follow') }}
        </a>
        <a
          class="flex items-center justify-center gap-1 py-2.75 px-4.5 bg-[--d-222-l-FFF] text-3 leading-4 cursor-pointer rounded text-[var(--d-fff-l-333)]"
          @click="shareComponent && shareComponent.openDialog()"
        >
          <Share ref="shareComponent" type="walletDetailTop" :statistics="statistics" :address="address" :chain="chain" />
          {{ $t('share') }}
        </a>
      </div>
      <div>
        <div class="statistic-pnl mb-5 text-4 leading-8 text-right" />
        <AveEmpty v-if="pnl.dataset.source.length <= 0" style="height: 80px" :showText="false" />
        <AveCharts
          v-else
          ref="profit"
          :containerStyle="{
            height: '80px',
            minWidth: '280px',
          }"
          :xAxis="pnl.xAxis"
          :series="pnl.series"
          :dataset="pnl.dataset"
          :tooltip="pnl.tooltip"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//组件
import AveCharts from '@/components/charts/aveCharts.vue'
import dayjs from 'dayjs'
import { getBalanceAnalysis, getWalletBasicInfo, bindTwitter } from '@/api/wallet'

import UserRemark from '@/components/userRemark.vue'
import UserAvatar from '@/components/userAvatar.vue'
import Share from '@/components/share.vue'
import AveEmpty from '@/components/aveEmpty.vue'

import ChainToken from '@/components/chainToken.vue'
import Number from '../components/Number.vue'
import { verifyLogin, formatRemark } from '@/utils'
import { addAttention, deleteAttention } from '~/api/attention'

const props = defineProps({
  chain: {
    type: String,
    default: '',
  },
  address: {
    type: String,
    default: '',
  },
  interval: {
    type: String,
    default: '',
  },
  isSelfAddress: Boolean,
  intervalText: {
    type: String,
    default: '',
  },
})

const $t = getGlobalT()

const { address, chain, interval, intervalText } = toRefs(props)
const botStore = useBotStore()
const themeStore = useThemeStore()
const shareComponent = useTemplateRef<InstanceType<typeof Share>>('shareComponent')

const { userInfo } = storeToRefs(useBotStore())

interface Statistics {
  wallet_logo?: any
  remark?: string
  x_name?: string
  x_url?: string
  x_followers?: number
  is_wallet_address_fav?: number
  total_profit_ratio?: number
  total_profit?: number | string
  total_win_rate?: number | string
  win_rate?: number
  profit?: number
  profit_ratio?: number
  wallet_age?: number | string
  [key: string]: any
}

const statistics = ref<Statistics>({ wallet_logo: {} })

const remark = ref({
  value: '',
  isEdit: false,
  loading: false,
})

const currentAccount = ''
const balanceAnalysis = ref({ profit: [], total_balance_without_risk: undefined })
const currencyStandard = ref('U')
//   ...mapState([
//     "token_user",
//     "currentAccount",
//     "mode",
//     "globalConfig",
//     "bot",
//   ]),
//   ...mapGetters(["language"]),

const pnl = computed(() => {
  const { profit = [] } = balanceAnalysis.value
  const xData = []
  profit.forEach((el) => {
    xData.push(el.time)
    el.negative = el.value < 0
    el.absValue = Math.abs(el.value)
  })
  console.log('pnl', xData)
  return {
    xAxis: {
      data: xData,
    },
    dataset: {
      source: profit,
      dimensions: ['time', 'absValue'],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        z: 0, // 层级（权重）
        lineStyle: {
          type: 'solid', // 将虚线改为实线
          width: 10, // 设置背景的宽度
          color: 'rgb(179, 179, 179,0.3)',
        },
      },
      padding: 8,
      backgroundColor: isDark.value ? 'rgba(0,0,0,.8)' : '#fff',
      borderWidth: 0,
      formatter: (params: { data: any }[]) => {
        const tooltipData =
          (params[0].data as {
            value: number
            absValue: number
            time: string
            negative?: boolean
          }) || {}
        let color,
          sign = ''
        if (tooltipData.value > 0) {
          color = '#12B886'
          sign = '+'
        } else if (tooltipData.value < 0) {
          color = '#F6465D'
          sign = '-'
        }
        return `<div style="font-size: 12px;">
             <div>
                 <span style="color:${color}">${sign}${uSymbol.value}${formatNumber(
                   tooltipData?.absValue / main_token_price.value,
                   1
                 )}${main_token_symbol.value}</span>
             </div>
             <div>
                  ${dayjs(tooltipData.time).format('MM/DD')}
             </div>
         </div>`
      },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 10,
        barMinHeight: 2,
        itemStyle: {
          color: (params) => {
            if (Math.abs(params.value?.value) > 0) {
              return params.value?.negative ? '#F6465D' : '#12B886'
            }
            return isDark.value ? '#999' : '#E5E5E5'
          },
        },
      },
    ],
  }
})

const defaultRemark = computed(() => {
  // const result =
  //   (userInfo?.address === address ? token_user?.remark : statistics?.remark) || statistics.x_name

  return statistics.value.remark //result
})

const isDark = computed(() => {
  return themeStore.isDark
})

const addressText = computed(() => {
  return address.value.slice(0, 4) + '...' + address.value.slice(-4)
})

const selfAddress = computed(() => {
  return botStore?.evmAddress || currentAccount
})

const wallet_age = computed(() => {
  const $t = getGlobalT()
  const wallet_age = statistics.value.wallet_age
  return ['--', '0'].includes(wallet_age)
    ? { value: '--' }
    : getDuring(wallet_age ? wallet_age * 1000 : undefined, $t)
})

const total_balance = computed(() => {
  const formatMap: Record<string, number> = {
    solana: 2,
    bsc: 4,
  }
  const { total_balance_without_risk } = balanceAnalysis.value

  return formatNumber((total_balance_without_risk ?? 0) / main_token_price.value, {
    decimals: formatMap[chain.value],
    limit: 20,
  })
})

const isUSDT = computed(() => {
  return currencyStandard.value == 'U'
})

const main_token_price = computed(() => {
  return isUSDT.value ? 1 : balanceAnalysis.value.main_token_price
})

const uSymbol = computed(() => {
  return isUSDT.value ? '$' : ''
})

const main_token_symbol = computed(() => {
  return isUSDT.value ? '' : balanceAnalysis.value.main_token_symbol
})

const chainAddress = computed(() => {
  return [chain.value, address.value]
})

watch(
  () => props.interval,
  (newVal: any) => {
    if (newVal) {
      onGetBalanceAnalysis()
    }
  },
  { immediate: true } // Remove if causing loops
)

watch(
  () => props.address,
  (newVal: any) => {
    if (newVal) {
      onGetWalletBasicInfo()
      onGetBalanceAnalysis()
    }
  },
  { immediate: true } // Remove if causing loops
)

onMounted(() => {
  onGetWalletBasicInfo()
  onGetBalanceAnalysis()
})

async function onGetWalletBasicInfo() {
  const params = {
    user_address: address.value,
    self_address: selfAddress.value,
    user_chain: chain.value,
  }
  const res = await getWalletBasicInfo(params)
  console.log(res, 'res=>')
  statistics.value = {
    ...statistics.value,
    ...(res || {}),
  }
  remark.value = res.remark || userInfo?.name
}

function _deleteAttention() {
  if (!verifyLogin()) {
    return
  }
  deleteAttention({
    user_chain: chain.value,
    user_address: address.value,
    address: botStore.getWalletAddress(chain.value)!,
  })
    .then(() => {
      ElMessage.success($t('attention1Canceled'))
      statistics.value.is_wallet_address_fav = 0
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}

async function _addAttention() {
  if (!verifyLogin()) {
    return
  }
  addAttention({
    user_chain: chain.value,
    user_address: address.value,
    address: botStore.getWalletAddress(chain.value)!,
  })
    .then(() => {
      ElMessage.success($t('attention1Success'))
      statistics.value.is_wallet_address_fav = 1
    })
    .catch((err) => {
      ElMessage.error(err)
    })
}
async function onGetBalanceAnalysis() {
  const params = {
    user_address: address.value,
    user_chain: chain.value,
    interval: interval.value,
  }
  const res = await getBalanceAnalysis(params)
  balanceAnalysis.value = res
}

async function _bindTwitter() {
  if (!verifyLogin()) {
    return
  }
  // let signature = ''
  // if (address.value && !botStore.evmAddress) {
  //   signature = await signTwitterConfirm()
  // }
  const data = {
    user_address: address.value,
    user_chain: chain.value,
    origin: window.location.href,
  }
  if (botStore.accessToken) {
    data.authorization = botStore.accessToken
  }
  // if (signature) {
  //   data.signature = signature
  // }
  // loadingBind = true
  bindTwitter(data)
    .then((res) => {
      const ave_param = res?.ave_param
      const host = 'https://api.agacve.com'
      const redirect_uri = encodeURIComponent(
        `${host}/v2api/walletinfo/v2/bind_x_callback?user_chain=${data.user_chain}&ave_param=${ave_param}&user_address=${data.user_address}`
      )

      const url = `https://x.com/i/oauth2/authorize?response_type=code&client_id=UTdHQm9Ta2twLWtlWFBEd1hpenA6MTpjaQ&scope=tweet.read users.read follows.read list.read like.read&state=random_state&code_challenge=challenge&code_challenge_method=plain&redirect_uri=${redirect_uri}`
      window.open(url)
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      // loadingBind = false
    })
}

function getDuring(time, $t) {
  if (!time) return { value: '--', unit: '' } // Prevent infinite l
  const minutes = Math.abs(dayjs().diff(time, 'minute', true))
  // 单位换算表
  const thresholds = [
    { unit: $t('min2'), limit: 60, value: minutes },
    { unit: $t('hours'), limit: 60, value: minutes / 60 },
    { unit: $t('days2'), limit: Infinity, value: minutes / (60 * 24) },
  ]
  const { value, unit } = thresholds.find((t) => t.value < t.limit) || {}
  return { value: parseInt(value), unit }
}

function mergeStatistics(data) {
  const d = {
    ...statistics.value,
    ...data,
  }
  statistics.value = d
}
defineExpose({
  mergeStatistics,
})
</script>
