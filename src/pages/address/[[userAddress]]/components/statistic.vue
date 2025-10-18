<template>
  <div class="p-5 flex justify-between mr-5 flex-1 rounded-2 bg-[--secondary-bg]">
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
          <div class="flex items-center mb-1.5">
            <UserRemark
              :key="address"
              class="gap-1.5 text-6 leading-7.5 text-[--main-text]"
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
              class="flex items-center justify-center ml-6 gap-1 px-2 py-1 h-6 rounded text-3 cursor-pointer text-[--main-text] bg-gradient-to-r from-[rgba(18,184,134,0.2)] to-[rgba(139,79,221,0.2)]"
              :href="statistics.x_url"
              target="_blank"
            >
              <img v-if="isDark" :width="16" src="@/assets/images/connect-x-dark.png" alt="" >
              <img v-else :width="16" src="@/assets/images//connect-x-light.png" alt="" >
              {{ formatNumber(statistics.x_followers || 0, 2) }}
            </a>
            <a
              v-else-if="isSelfAddress"
              class="flex items-center justify-center ml-6 gap-1 px-2 py-1 h-6 rounded text-3 cursor-pointer text-[--main-text] bg-gradient-to-r from-[rgba(18,184,134,0.2)] to-[rgba(139,79,221,0.2)]"
              @click="_bindTwitter"
            >
              <Icon
                name="custom:twitterx"
                class="text-3 text-[--main-text]"/>
              {{ $t('connect') }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <div class="statistic-address flex gap-2.5 cursor-pointer" @click="addressClick">
              <div
                class="statistic-address-copy flex items-center justify-center px-2 py-1.75 h-6 rounded text-3 gap-1 text-[--third-text] bg-[--main-input-button-bg]"
              >
                {{ addressText }}
                <Icon v-copy="address" name="bxs:copy" class="text-2.5 clickable text-[--third-text]" />
              </div>
            </div>
            <div
              class="flex items-center gap-1 px-2 py-0 h-6 rounded text-3 text-[--third-text] bg-[--main-input-button-bg]"
            >
              <Icon name="custom:cake" class="text5 text-[--third-text]" />
              <span>{{ wallet_age?.value }}</span>
              <span>{{ wallet_age?.unit || '' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2 items-center mb-5 text-6 leading-7.5 font-bold">
        <strong class="text-6 leading-7.5 text-[--main-text]">
          {{ uSymbol }}{{ total_balance }} {{ main_token_symbol }}
        </strong>
        <el-switch
          :model-value="globalStore.isUSDT"
          class="custom-switch"
          :inactive-value="true"
          :active-value="false"
          @update:model-value="globalStore.isUSDT=!globalStore.isUSDT"
        >
          <template #active-action>
            <ChainToken :chain="chain" :width="16" />
          </template>
          <template #inactive-action>
            <span
              class="flex w-full h-full items-center justify-center text-2.5 rounded-full text-[--main-text] bg-[--icon-color]"
              >$</span
            >
          </template>
        </el-switch>
      </div>
      <p class="m-0 mb-2 leading-5 text-3.5 text-[--secondary-text]">
        {{ $t('totalPnL2') }}（{{ intervalText }}）
        <AveNumber :value="statistics.profit" :signVisible="globalStore.isUSDT">
          {{ formatNumber(Math.abs((statistics.profit ?? 0) / main_token_price), 2) }}
          {{ main_token_symbol }}
        </AveNumber>
        <AveNumber :value="statistics.profit_ratio" class="ml-1">
          {{ formatNumber(Math.abs((statistics?.profit_ratio ?? 0) * 100), 1) }}%
        </AveNumber>
      </p>
      <p class="m-0 mb-2 leading-5 text-3.5 text-[--secondary-text]">
        {{ $t('winRate2') }}（{{ intervalText }}）
        <AveNumber :value="statistics.win_rate">
          {{ formatNumber(Math.abs(statistics.win_rate ?? 0), 1) }}%
        </AveNumber>
      </p>
    </div>
    <div class="flex flex-col justify-between flex-shrink-0">
      <div class="flex justify-end items-center h-15 gap-2 mb-5">
        <a
          v-if="statistics.is_wallet_address_fav === 1"
          class="w-25 px-0 box-border flex items-center justify-center gap-1 py-2.75 px-4.5 bg-[--main-input-button-bg] text-3 leading-4 cursor-pointer rounded text-[--third-text] "
          @click="_deleteAttention"
        >
          <Icon name="custom:followed" class="text-3.5" />
          <span>{{ $t('followed') }}</span>
          <span class="hidden text-[--down-color]">{{ $t('cancelFollowed') }}</span>
        </a>
        <a
          v-else
          class="flex items-center justify-center gap-1 py-2.75 px-4.5 bg-[--primary-color] text-3 leading-4 cursor-pointer rounded text-[--white]"
          @click="_addAttention"
        >
          <Icon name="custom:follow" class="text-4" />
          {{ $t('follow') }}
        </a>
        <a
          class="flex items-center justify-center gap-1 py-2.75 px-4.5 bg-[--primary-color] text-3 leading-4 cursor-pointer rounded text-[--white]"
          @click="shareComponent && shareComponent.openDialog()"
        >
          <Share ref="shareComponent" type="walletDetailTop" :statistics="statistics" :address="address" :chain="chain" classString="!color-[--white] [&&]:ml-0" />
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
import AveNumber from '../components/Number.vue'
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

const { t } = useI18n()

const { address, chain, interval, intervalText } = toRefs(props)
const globalStore = useGlobalStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
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

// Ensure all required fields from GetTokenStatisticsResponse are present with default values
// If GetTokenStatisticsResponse is exported from an API types file, import it here:

const statistics = ref<Statistics>({
  wallet_logo: {},
  x_logo: '',
  chain: '',
  newTags: [],
  balance_amount: 0,
  // Add all other required fields from GetTokenStatisticsResponse with sensible defaults
  // Example:
  // fieldName: defaultValue,
  // ...
})

const remark = ref({
  value: '',
  isEdit: false,
  loading: false,
})

const balanceAnalysis = ref<Awaited<ReturnType<typeof getBalanceAnalysis>>>({ profit: [], total_balance_without_risk: undefined })

const pnl = computed(() => {
  const profit: Array<{
    time: string
    value: string
    negative?: boolean
    absValue?: number
  }> = balanceAnalysis.value.profit || []
  const xData: any[] = []
  profit.forEach((el) => {
    xData.push(el.time)
    el.negative = Number(el.value) < 0
    el.absValue = Math.abs(Number(el.value))
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
          color = getCssVariable('--up-color')
          sign = '+'
        } else if (tooltipData.value < 0) {
          color = getCssVariable('--down-color')
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
          color: (params: { value: { value: number; negative: any } }) => {
            if (Math.abs(params.value?.value) > 0) {
              return params.value?.negative ? getCssVariable('--down-color') : getCssVariable('--up-color')
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
  return botStore?.evmAddress || walletStore?.address || ''
})

const wallet_age = computed(() => {
  const _wallet_age = (statistics.value?.wallet_age || '') as string
  return ['--', '0'].includes(_wallet_age)
    ? { value: '--', unit: '' }
    : getDuring(_wallet_age ? ((Number(_wallet_age) || 0) * 1000) : undefined)
})

// const injecteIsVolUSDT = inject<Ref<boolean>>('isVolUSDT')

const total_balance = computed(() => {
  const formatMap: Record<string, number> = {
    solana: 2,
    bsc: 4,
    eth: 4,
    base: 4,
  }
  const { total_balance_without_risk } = balanceAnalysis.value

  return formatNumber((Number(total_balance_without_risk) || 0) / Number(main_token_price.value), {
    decimals: globalStore.isUSDT ? 4 : formatMap[chain.value],
    limit: 20,
  })
})

const main_token_price = computed(() => {
  return globalStore.isUSDT ? 1 : Number((balanceAnalysis.value.main_token_price || 0))
})

const uSymbol = computed(() => {
  return globalStore.isUSDT ? '$' : ''
})

const main_token_symbol = computed(() => {
  return globalStore.isUSDT ? '' : balanceAnalysis.value.main_token_symbol
})

watch(
  () => props.interval,
  (newVal: any) => {
    if (newVal) {
      onGetBalanceAnalysis()
    }
  }
)

watch(
  () => props.address,
  (newVal: any) => {
    if (newVal) {
      onGetWalletBasicInfo()
      onGetBalanceAnalysis()
    }
  }
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
  remark.value = res.remark || userInfo.value?.name
}

function _deleteAttention() {
  if (!verifyLogin()) {
    return
  }
  deleteAttention({
    user_chain: chain.value,
    user_address: address.value,
    address: botStore.userInfo?.evmAddress || walletStore.address,
  })
    .then(() => {
      ElMessage.success(t('attention1Canceled'))
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
    address: botStore.userInfo?.evmAddress || walletStore.address,
  })
    .then(() => {
      ElMessage.success(t('attention1Success'))
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
  getBalanceAnalysis(params).then((res) => {
    balanceAnalysis.value = res
  })

}

async function _bindTwitter() {
  if (!verifyLogin()) {
    return
  }
  // let signature = ''
  // if (address.value && !botStore.evmAddress) {
  //   signature = await signTwitterConfirm()
  // }
  const signature = await walletStore.signMessageForFavorite()
  const data: {
    user_address: string
    user_chain: string
    origin: string
    signature?: string
    authorization?: string
  } = {
    user_address: address.value,
    user_chain: chain.value,
    origin: window.location.href,
  }
  if (botStore.accessToken) {
    data.authorization = botStore.accessToken
  }
  if (signature) {
    data.signature = signature
  }
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

function getDuring(time?: number) {
  if (!time) return { value: '--', unit: '' } // Prevent infinite l
  const minutes = Math.abs(dayjs().diff(time, 'minute', true))
  // 单位换算表
  const thresholds = [
    { unit: t('min2'), limit: 60, value: minutes },
    { unit: t('hours'), limit: 60, value: minutes / 60 },
    { unit: t('days2'), limit: Infinity, value: minutes / (60 * 24) },
  ]
  const { value, unit } = thresholds.find((t) => t.value < t.limit) || {}
  return { value: parseInt(String(value)), unit }
}

function mergeStatistics(data: any) {
  const d = {
    ...statistics.value,
    ...data,
  }
  statistics.value = d
}
defineExpose({
  mergeStatistics,
})

function addressClick() {
  window.open(formatExplorerUrl(chain.value, address.value, 'address'))
}
</script>
<style scoped>
.custom-switch {
  --el-switch-off-color: var(--main-input-button-bg);
  --el-switch-on-color: var(--icon-color);
}

::v-deep .el-switch__action {
  background-color: transparent;
}
::v-deep .max-w-42px{
  max-width: 200px !important;
}
</style>
