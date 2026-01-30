<script setup lang="ts">
import {
  getSignalActions,
  getSignalKline,
  getSignalV2List,
  type GetSignalV2ListResponse,
  getSignalV3List,
  type IActionItem,
  type IActionV3Item,
} from '~/api/signal'
import { useThrottleFn } from '@vueuse/core'
import SignalRightItem from '~/pages/smart/components/signal/signalRightItem.vue'

const filterToken = shallowRef('')
const props = defineProps<{
  activeChain: string
  quickBuyValue: string
  scrollbarHeight: number
}>()
const listData = shallowRef<GetSignalV2ListResponse<IActionItem | IActionV3Item>[]>([])
const signalKlineData = shallowRef({})
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const pageParams = shallowRef({
  pageNO: 1,
  pageSize: 20,
})
const actionDialogVisible = ref(false)
const currentActions = shallowRef<IActionV3Item[]>([])
const localeStore = useLocaleStore()
const tokenDetailSStore = useTokenDetailsStore()
const currentActionToken = ref('')

const scrollbar = useTemplateRef('scrollbar')

const onScroll = useThrottleFn(
  ({ scrollTop }: { scrollTop: number }) => {
    if (scrollbar.value) {
      const scrollElement = scrollbar.value.wrapRef
      if (scrollElement && scrollElement.scrollHeight - scrollTop - props.scrollbarHeight < 30) {
        fetchSignalList()
      }
    }
  },
  100,
  true,
  false
)

watch(
  () => [props.activeChain, filterToken.value],
  () => {
    listData.value = []
    pageParams.value.pageNO = 1
    listStatus.value.finished = false
    listStatus.value.loading = false
    listStatus.value.error = false
    fetchSignalList()
  }
)
const wsStore = useWSStore()
watch(
  () => wsStore.wsResult[WSEventType.SIGNALSV2_PUBLIC_MONITOR],
  ({ msg: _signalData }: { msg: GetSignalV2ListResponse }) => {
    const index = listData.value.findIndex(
      (el) => el.token === _signalData.token && el.chain === _signalData.chain
    )
    const filterTokenFlag = !filterToken.value || filterToken.value === _signalData.token
    if (index === -1 && filterTokenFlag) {
      listData.value.unshift(_signalData)
    } else if (filterTokenFlag) {
      listData.value.splice(index, 1)
      listData.value.unshift(_signalData)
    }

    _getSignalKline([_signalData.token])
  }
)

const botStore = useBotStore()

function getListApi(): Promise<GetSignalV2ListResponse<IActionItem | IActionV3Item>[]> {
  return filterToken.value
    ? getSignalV2List({
        ...pageParams.value,
        chain: props.activeChain,
        fold: false,
        token: filterToken.value,
      })
    : getSignalV3List({
        ...pageParams.value,
        chain: props.activeChain,
        wallet_address: botStore.getWalletAddress(props.activeChain),
      })
}

async function fetchSignalList() {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  try {
    listStatus.value.loading = true
    const res = await getListApi()
    if (pageParams.value.pageNO === 1) {
      listData.value = res || []
    } else {
      listData.value = listData.value.concat(res || [])
    }
    const finished = res?.length < pageParams.value.pageSize
    listStatus.value.finished = finished
    if (!finished) {
      pageParams.value.pageNO++
    }

    const tokens = Array.from(new Set((res || []).map((el) => el.token)))
    _getSignalKline(tokens)
  } catch (e) {
    console.log(e, 'error')
    listStatus.value.error = true
    listData.value = []
  } finally {
    listStatus.value.loading = false
  }
}

onMounted(() => {
  fetchSignalList()
  document.addEventListener('click', openActionDialog)
})

onUnmounted(() => {
  document.removeEventListener('click', openActionDialog)
})

const openActionDialog = async (e: MouseEvent) => {
  if (e.target && 'id' in e.target && e?.target.id === 'tooltipMark') {
    const time = e.target.dataset.time
    const token = e.target.dataset.token
    currentActionToken.value = token
    actionDialogVisible.value = true
    const res = await getSignalActions({
      time,
      token,
      chain: props.activeChain,
    })
    currentActions.value = res
  }
}

defineExpose({
  setToken: (val: string) => {
    filterToken.value = val
  },
  updateListData(
    callback: (
      p: GetSignalV2ListResponse<IActionItem | IActionV3Item>[]
    ) => GetSignalV2ListResponse<IActionItem | IActionV3Item>[]
  ) {
    listData.value = callback(listData.value)
  },
  setScrollTop(scrollTop: number) {
    if (scrollbar.value) {
      scrollbar.value.scrollTo({
        top: scrollTop,
        behavior: 'smooth',
      })
    }
  },
})

const emit = defineEmits(['setResetBtn'])

function filter(token: string) {
  filterToken.value = token
  emit('setResetBtn', !!token)
}

const currentSignal = shallowRef<GetSignalV2ListResponse<IActionItem | IActionV3Item>>({})
const visible = shallowRef(false)

function openDrawer(item: GetSignalV2ListResponse<IActionItem | IActionV3Item>) {
  visible.value = true
  currentSignal.value = item
}

async function _getSignalKline(tokens: string[], duration = 4 * 60) {
  try {
    const res =
      (await getSignalKline({
        duration,
        chain: props.activeChain,
        tokens: tokens.slice(0, 12),
      })) || []
    const result = Object.create(null)
    res.forEach((el) => {
      result[el.t] = el
    })
    signalKlineData.value = {
      ...signalKlineData.value,
      ...result,
    }
    if (tokens.length > 12) {
      _getSignalKline(tokens.slice(12), duration)
    }
  } catch (error) {
    console.log(error, 'error')
  }
}

function openTokenDetail(el: IActionV3Item) {
  const item = listData.value.find((el) => el.token === currentActionToken.value)
  if (!item) return
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: item.token + '-' + props.activeChain,
      symbol: item.symbol,
      logo_url: item.logo,
      chain: props.activeChain,
      address: item.token,
      remark: '',
    },
    pairInfo: {
      target_token: item.token,
      token0_address: el.quote_token_address,
      token0_symbol: el.quote_token_symbol,
      token1_symbol: item.symbol,
      pairAddress: '',
    },
    user_address: el.wallet_address,
  })
}
</script>

<template>
  <el-scrollbar ref="scrollbar" class="flex-1" :height="scrollbarHeight" @scroll="onScroll">
    <div class="flex flex-wrap gap-2px">
      <SignalRightItem
        v-for="(item, index) in listData"
        :key="index"
        :signalKlineData="signalKlineData"
        :class="item.actions.length > 3 ? 'border-#3F80F7' : 'hover:border-#3F80F7'"
        class="border-1px border-solid border-[--main-divider] transition-colors transition-.3s"
        :item="item"
        :filterToken="filterToken"
        :filter="filter"
        :activeChain="activeChain"
        :quickBuyValue="quickBuyValue"
        @openDrawer="openDrawer"
        @updateSignalKline="_getSignalKline"
      />
    </div>
    <div
      v-if="listStatus.loading"
      class="flex py-10px justify-center text-12px text-[--third-text]"
    >
      {{ $t('loading') }}
    </div>
  </el-scrollbar>
  <el-drawer v-model="visible" append-to-body :size="480">
    <template #header>
      <span class="color-[--main-text] text-20px">{{ $t('SignalDetail') }}</span>
    </template>
    <template #default>
      <SignalRightItem
        class="bg-transparent w-auto rounded-none px-20px py-0"
        :item="currentSignal"
        :active-chain="activeChain"
        :footer="false"
        is-wallet-all
      />
    </template>
  </el-drawer>
  <el-dialog v-model="actionDialogVisible" :title="$t('smartMoneyAddress')" width="540px" destroy-on-close>
    <div class="flex color-[--third-text] text-12px mb-8px mt-16px">
      <div class="flex-[2]">
        {{ $t('wallet') }}
      </div>
      <div class="w-100px text-right">
        {{ $t('operate') }}
      </div>
      <div v-if="!filterToken" class="flex-1 text-right">
        {{ $t('balance1') }}
      </div>
      <div class="flex-1 text-right">
        {{ $t('time') }}
      </div>
    </div>
    <div class="flex-1">
      <div
        v-for="(
          {
            wallet_alias,
            wallet_address,
            quote_token_amount,
            quote_token_symbol,
            quote_token_volume,
            action_time,
            token_balance_usd,
            wallet_logo,
          },
          $index
        ) in currentActions"
        :key="$index"
        class="flex color-[--secondary-text] text-12px h-40px items-center cursor-pointer"
        @click="openTokenDetail(currentActions[$index])"
      >
        <div class="flex-[2] flex items-center">
          <UserRemark
            :key="wallet_address"
            :address="wallet_address"
            :chain="activeChain"
            :remark="wallet_alias || ''"
            :showIcon="true"
            :teleported="true"
            :wallet_logo="{ logo: wallet_logo, name: wallet_alias, url: '' }"
            iconSize="24px"
            avatar-class="mr-8px"
            :formatAddress="(address) => `${address.slice(0, 4)}...${address.slice(-4)}`"
            :showAddress="false"
          >
            <template #default>
              <!-- <span
                class="color-[--secondary-text] whitespace-nowrap overflow-hidden text-ellipsis max-w-50px"
                >{{ remark || $t('wallet') }}</span
              > -->
              <span class="color-[--main-text]"
                >{{ wallet_address.slice(0, 4) }}...{{ wallet_address.slice(-4) }}</span
              >
              <Icon
                v-copy="wallet_address"
                name="bxs:copy"
                class="ml-4px color-[--third-text]"
                @click.stop.prevent
              />
            </template>
          </UserRemark>
        </div>
        <div class="w-100px text-right color-#12B886">
          {{ $t('buy') }}{{ localeStore.locale === 'en' ? ' ' : ''
          }}<span
            v-tooltip="'$' + formatNumber(quote_token_volume, 2)"
            class="decoration-underline decoration-dotted underline-offset-2px"
          >
            {{ formatNumber(quote_token_amount, 2) }}
            {{ quote_token_symbol.toUpperCase() === 'USDC' ? 'U' : quote_token_symbol }}
          </span>
        </div>
        <div v-if="!filterToken" class="flex-1 text-right">
          <span v-if="!token_balance_usd || Number(token_balance_usd) === 0" class="color-#F6465D">
            {{ $t('soldAll') }}
          </span>
          <template v-else> ${{ formatNumber(token_balance_usd, 2) }} </template>
        </div>
        <div class="flex-1 text-right">
          <span v-tooltip="formatDate(action_time * 1000, 'MM/DD HH:mm:ss')">{{
            formatTimeFromNow(action_time)
          }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="scss"></style>
