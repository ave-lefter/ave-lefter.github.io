<template>
  <div
    v-if="userAddress && chain && SupportFullDataChain.includes(chain)"
    ref="scrollRef"
    className="flex flex-col w-full p-[20px] pt-[16px] bg-[--main-bg] pb-0 overflow-y-auto"
    style="max-height: calc(100vh - 92px)"
  >
    <div class="flex-between mb-16px">
      <div class="flex gap-6">
        <UserAvatar
          :key="statistics?.wallet_logo?.logo"
          :wallet_logo="{
            ...(statistics.wallet_logo || {}),
            ...(userAddress === botStore?.evmAddress ? { name: botStore.userInfo?.name } : {}),
          }"
          :address="userAddress"
          :chain="chain"
          iconSize="60px"
        />
        <div>
          <div class="flex items-center mb-1.5">
            <UserRemark
              :key="userAddress"
              class="gap-1.5 text-6 leading-7.5 text-[--main-text]"
              :address="userAddress"
              :remark="statistics.remark"
              :chain="chain"
              :wallet_logo="statistics.wallet_logo"
              iconEditSize="16px"
              :maxRemarkLength="15"
              @updateRemark="_getWalletInfo"
            />
            <a
              v-if="statistics.x_url"
              class="flex items-center justify-center ml-6 gap-1 px-2 py-1 h-6 rounded text-3 cursor-pointer text-[--main-text] bg-gradient-to-r from-[rgba(18,184,134,0.2)] to-[rgba(139,79,221,0.2)]"
              :href="statistics.x_url"
              target="_blank"
            >
              <img
                v-if="themeStore.isDark"
                :width="16"
                src="@/assets/images/connect-x-dark.png"
                alt=""
              >
              <img v-else :width="16" src="@/assets/images//connect-x-light.png" alt="" >
              {{ formatNumber(statistics.x_followers || 0, 2) }}
            </a>
            <a
              v-else-if="isSelfAddress"
              class="flex items-center justify-center ml-6 gap-1 px-2 py-1 h-6 rounded text-3 cursor-pointer text-[--main-text] bg-gradient-to-r from-[rgba(18,184,134,0.2)] to-[rgba(139,79,221,0.2)]"
              @click="_bindTwitter"
            >
              <Icon name="custom:twitterx" class="text-3 text-[--main-text]" />
              {{ $t('connect') }}
            </a>
          </div>
          <div class="flex items-center gap-2">
            <div class="statistic-address flex gap-2.5 cursor-pointer" @click="addressClick">
              <div
                class="statistic-address-copy flex items-center justify-center px-2 py-1.75 h-6 rounded text-3 gap-1 text-[--third-text] bg-[--main-input-button-bg]"
              >
                {{ userAddress.slice(0, 4) + '...' + userAddress.slice(-4) }}
                <Icon
                  v-copy="userAddress"
                  name="bxs:copy"
                  class="text-2.5 clickable text-[--third-text]"
                />
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
      <div class="flex items-stretch">
        <div class="p-1 rounded-1 bg-[--main-input-button-bg] mr-2">
          <button
            v-for="(item, index) in options"
            :key="index"
            class="lh-16px py-2px px-8px border-none cursor-pointer rounded-2px text-12px"
            :class="
              interval === item.id
                ? 'bg-[--secondary-bg] color-[--main-text]'
                : 'bg-transparent color-[--third-text]'
            "
            @click.stop="interval = item.id"
          >
            {{ item.name }}
          </button>
        </div>
        <el-select
          :style="{ width: '120px' }"
          :suffix-icon="SuffixIcon"
          :model-value="chain"
          @update:model-value="updateModelChain"
        >
          <template #prefix>
            <ChainToken :chain="chain" :width="16" />
          </template>
          <el-option
            v-for="{ chain: _chain } in smartChains"
            :key="_chain"
            :label="getChainInfo(_chain)?.name"
            :value="_chain"
          >
            <div class="flex-start" style="gap: 4px">
              <ChainToken :chain="_chain" :width="16" />
              {{ getChainInfo(_chain)?.name }}
            </div>
          </el-option>
        </el-select>
        <div class="flex items-stretch gap-2 ml-4">
          <a
            v-if="statistics.is_wallet_address_fav === 1"
            class="w-25 px-0 box-border flex items-center justify-center gap-1 px-4.5 bg-[--main-input-button-bg] text-3 leading-4 cursor-pointer rounded text-[--third-text]"
            @click="_deleteAttention"
          >
            <Icon name="custom:followed" class="text-3.5" />
            <span>{{ $t('followed') }}</span>
            <span class="hidden text-[--down-color]">{{ $t('cancelFollowed') }}</span>
          </a>
          <a
            v-else
            class="flex items-center justify-center gap-1 px-4.5 bg-[--primary-color] text-3 leading-4 cursor-pointer rounded text-[--white]"
            @click="_addAttention"
          >
            <Icon name="custom:follow" class="text-4" />
            {{ $t('follow') }}
          </a>
          <!-- <a
            class="flex items-center justify-center gap-1 px-4.5 bg-[--primary-color] text-3 leading-4 cursor-pointer rounded text-[--white]"
            @click="shareComponent && shareComponent.openDialog()"
          >
            <Share
              ref="shareComponent"
              type="walletDetailTop"
              :statistics="{...statistics,...txAnalysis}"
              :address="userAddress"
              :chain="chain"
              classString="!color-[--white] [&&]:ml-0"
            />
            {{ $t('share') }}
          </a> -->
        </div>
      </div>
    </div>

    <div class="flex mb-24px gap-8px">
      <TotalAssets
        class="flex-1 bg-[--secondary-bg] p-16px"
        :address="userAddress"
        :chain="chain"
        :intervalText="intervalText"
        :interval="interval"
        :txAnalysis="txAnalysis"
      />
      <PnlCalendar
        class="w-448px bg-[--secondary-bg] p-16px"
        :userAddress="userAddress"
        :userChain="chain"
      />
      <Profit
        class="flex-1 bg-[--secondary-bg] p-16px"
        :address="userAddress"
        :chain="chain"
        :interval="interval"
        :intervalText="intervalText"
        @update:txAnalysis="txAnalysis = $event"
      />
      <Likes
        class="flex-1 bg-[--secondary-bg] p-16px"
        :address="userAddress"
        :chain="chain"
        :interval="interval"
      />
    </div>
    <ActivityCharts :interval="interval" :address="userAddress" :chain="chain" />
    <StatisticsTable
      ref="statisticsTable"
      :address="userAddress"
      :chain="chain"
      :isSelfAddress="isSelfAddress"
    />
  </div>

  <div
    v-else-if="userAddress && chain"
    ref="scrollRef"
    class="flex flex-col w-full h-full bg-[--secondary-bg] items-center pb-0"
  >
    <PageOther :address="userAddress" :chain="chain" />
  </div>
  <PageBlank v-else />
</template>
<script setup>
import dayjs from 'dayjs'
import StatisticsTable from './statisticsTable.vue'
import ActivityCharts from './activityCharts.vue'
import PageBlank from './pageBlank.vue'
import PageOther from './pageOther.vue'
import TotalAssets from './totalAssets.vue'
import PnlCalendar from './pnlCalendar.vue'
import Profit from './profit.vue'
import Likes from './likes.vue'
import { getChainInfo } from '@/utils'
import { useEventBus, useStorage } from '@vueuse/core'
import SuffixIcon from '~/components/suffixIcon.vue'
import { bindTwitter, getWalletBasicInfo } from '~/api/wallet'
import { addAttention, deleteAttention } from '~/api/attention'

const themeStore = useThemeStore()

const isVolUSDT = ref(true)
provide('isVolUSDT', isVolUSDT)

const interval = ref('7D')
const scrollRef = useTemplateRef('scrollRef')
const route = useRoute()
const botStore = useBotStore()
const walletStore = useWalletStore()
const txAnalysis = ref({})

const cachedChain = useStorage('cachedChain', 'solana', sessionStorage)
// const shareComponent = useTemplateRef('shareComponent')
const chain = computed(() => {
  if (route.params.chain) {
    return route.params.chain
  }
  if (botStore?.userInfo?.evmAddress) {
    return cachedChain.value
  }
  return walletStore.chain || ''
})
const userAddress = computed(() => {
  if (route.params.userAddress) {
    return route.params.userAddress
  }
  if (botStore?.userInfo?.evmAddress) {
    return botStore.getWalletAddress(cachedChain.value)
  }
  return walletStore.address || ''
})
const { t } = useI18n()
const statistics = ref({})
const remark = ref({
  value: '',
  isEdit: false,
  loading: false,
})
const options = [
  {
    name: `24${t('H')}`,
    id: '24H',
  },
  {
    name: `7${t('D')}`,
    id: '7D',
  },
  {
    name: `30${t('D')}`,
    id: '30D',
  },
]

const isSelfAddress = computed(() => {
  return (
    userAddress.value === botStore.getWalletAddress(chain.value) ||
    walletStore.address === userAddress.value
  )
})
const intervalText = computed(() => {
  return options.find((item) => interval.value === item.id)?.name
})
const smartChains = computed(() => {
  // 如果是自己的钱包地址且为 bot 钱包那么展示所有的链，链钱包后面再改
  if (botStore.evmAddress && isSelfAddress.value) {
    const botChains = botStore.userInfo?.addresses?.filter?.((el) =>
      SupportFullDataChain.includes(el.chain)
    )
    console.log('botChains', botChains)
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }
  // 如果是看的是别人的 evm 链的钱包，则展示所有 evm 链，因为 evm 链的地址是通用的
  if (route.params.chain && isEvmChain(route.params.chain)) {
    return botStore.isSupportChains
      .filter((el) => el !== 'solana')
      .map((el) => {
        return {
          chain: el,
        }
      })
  }
  return [
    {
      chain: chain.value,
    },
  ]
})
const selfAddress = computed(() => {
  return botStore?.evmAddress || walletStore?.address || ''
})

const getDuring = (time) => {
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
const wallet_age = computed(() => {
  const _wallet_age = statistics.value?.wallet_age || ''
  return ['--', '0'].includes(_wallet_age)
    ? { value: '--', unit: '' }
    : getDuring(_wallet_age ? (Number(_wallet_age) || 0) * 1000 : undefined)
})

const router = useRouter()
watch(
  () => botStore.getWalletAddress('solana'),
  (address, old) => {
    if (!old && address) {
      router.replace('/address/' + address + '/solana')
    }
  }
)
const scrollToTop = () => {
  scrollRef.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
scrollTopEvent.on(scrollToTop)

const updateModelChain = (val) => {
  let address = botStore.getWalletAddress(val)
  if (!route.params.chain) {
    cachedChain.value = val
  } else if (!isSelfAddress.value) {
    address = route.params.userAddress
  }
  navigateTo(`/address/${address}/${val}`)
}

const _getWalletInfo = async () => {
  const params = {
    user_address: userAddress.value,
    self_address: selfAddress.value,
    user_chain: chain.value,
  }
  const res = await getWalletBasicInfo(params)
  statistics.value = {
    ...statistics.value,
    ...(res || {}),
  }
  remark.value = res.remark || botStore.userInfo?.name
}

const _bindTwitter = async () => {
  if (!verifyLogin()) {
    return
  }
  const signature = await walletStore.signMessageForFavorite()
  const data = {
    user_address: userAddress.value,
    user_chain: chain.value,
    origin: window.location.href,
  }
  if (botStore.accessToken) {
    data.authorization = botStore.accessToken
  }
  if (signature) {
    data.signature = signature
  }
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
}

const addressClick = () => {
  window.open(formatExplorerUrl(chain.value, userAddress.value, 'address'))
}

const _deleteAttention = () => {
  if (!verifyLogin()) {
    return
  }
  deleteAttention({
    user_chain: chain.value,
    user_address: userAddress.value,
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

const _addAttention = async () => {
  if (!verifyLogin()) {
    return
  }
  addAttention({
    user_chain: chain.value,
    user_address: userAddress.value,
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

onUnmounted(() => {
  scrollTopEvent.off(scrollToTop)
})

_getWalletInfo()

watch(
  () => [interval.value, userAddress.value, chain.value, selfAddress.value],
  () => {
    _getWalletInfo()
  }
)
</script>

<style scoped lang="scss">
.m-radio-group {
  :deep()
    .el-radio-button
    .el-radio-button__original-radio:not(:disabled)
    + .el-radio-button__inner {
    border-color: var(--d-333-l-666);
  }
}
:deep(.el-scrollbar__bar.is-vertical) {
  display: none;
}
</style>