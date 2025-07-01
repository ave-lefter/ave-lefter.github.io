<script setup lang="ts">
import TimeLine from './timeLine.vue'
import {useStorage} from '@vueuse/core'
import Filter from './filter.vue'
import {
  type GetSignalV2ListResponse,
  getSignalV3List,
  getTopSignal,
  type IActionItem, type IActionV3Item,
  type ITopSignal
} from '~/api/signal'
import SignalLeftList from './signalLeftList.vue'
import SignalRightList from './signalRightList.vue'

const props = defineProps<{
  activeChain: string
}>()
const localeStore = useLocaleStore()
// token: 筛选 token
// history_count：筛选信号数，对应值2, 5, 15
// 市值：mc_curr，市值过滤，
// 市值方向：mc_curr_sign， 默认 > 大于号，可选 <
const defaultFilterParams = {
  token: '',
  history_count: undefined as undefined | number,
  mc_curr: undefined as undefined | number,
  mc_curr_sign: '<'
}
const filterParams = useStorage('signalParams', {
  ...defaultFilterParams
})
const shouldAlert = useStorage('shouldAlert', '1')
const showResetBtn = shallowRef(false)
const quickBuyValue = useStorage('quickBuyValue', '0.01')
const dialogValues = ref<{
  visible: boolean
  loading: boolean
  list: ITopSignal[]
}>({
  visible: false,
  loading: false,
  list: []
})

async function setDialogVisible() {
  dialogValues.value.visible = true
  dialogValues.value.loading = true
  try {
    const res = await getTopSignal()
    dialogValues.value.list = res || []
  } finally {
    dialogValues.value.loading = false
  }
}

const signalLeftList = useTemplateRef<InstanceType<typeof SignalLeftList>>('signalLeftList')
const signalRightList = useTemplateRef<InstanceType<typeof SignalRightList>>('signalRightList')

const signalStore = useSignalStore()
onMounted(() => {
  initWs()
  updateLeftList()
  signalStore.signalVisible = false
})

function onReset() {
  filterParams.value = {...defaultFilterParams}
  if (signalLeftList.value) {
    signalLeftList.value.fetchSignalList()
  }
}

function onConfirm(_filterParams: typeof defaultFilterParams) {
  filterParams.value = {..._filterParams}
  updateLeftList()
}

function updateLeftList() {
  if (signalLeftList.value) {
    signalLeftList.value.fetchSignalList(filterParams.value)
  }
}

const wsStore = useWSStore()

function initWs() {
  wsStore.send({
    'jsonrpc': '2.0',
    method: 'unsubscribe',
    'params': [
      'signalsv2_public_monitor',
      props.activeChain
    ],
    'id': 1
  })

  wsStore.send({
    'jsonrpc': '2.0',
    method: 'subscribe',
    'params': [
      'signalsv2_public_monitor',
      props.activeChain
    ],
    'id': 1
  })
}

function setFilterToken(token: string) {
  if (signalRightList.value) {
    signalRightList.value.setToken(token)
  }
  if (signalLeftList.value && !token) {
    signalLeftList.value.setSelectId(undefined)
  }
  showResetBtn.value = !!token
}

function setResetBtn(val: boolean) {
  showResetBtn.value = val
  if (!val && signalLeftList.value) {
    signalLeftList.value.setSelectId(undefined)
  }
}

let timer: number

function initTimer() {
  let lastFetchSignalTime = 0
  const callback = () => {
    if (Date.now() - lastFetchSignalTime >= 5000) {
      updateListData()
      lastFetchSignalTime = Date.now()
    }
    timer = requestAnimationFrame(callback)
  }
  timer = requestAnimationFrame(callback)
}

const botStore = useBotStore()

/**
 * 作为推送接口使用，只更新数据
 */
async function updateListData() {
  try {
    const res = await getSignalV3List({
      pageNO: 1,
      pageSize: 20,
      chain: props.activeChain,
      wallet_address: botStore.getWalletAddress(props.activeChain)
    })
    const addressMap: Record<string, GetSignalV2ListResponse> = {}
    ;(res || []).forEach((item) => {
      if (!addressMap[item.token + item.chain]) {
        addressMap[item.token + item.chain] = item
      }
    })
    if (signalRightList.value) {
      signalRightList.value.updateListData(listData => updateDataCallback(listData, addressMap, ['actions', 'self_wallet_info']))
    }
    if (signalLeftList.value) {
      signalLeftList.value.updateListData(listData => updateDataCallback(listData, addressMap))
    }
  } catch (e) {
    console.log('=>(signalList.vue:106) e', e)
  }
}

function updateDataCallback(
  listData: GetSignalV2ListResponse<IActionItem | IActionV3Item>[],
  addressMap: Record<string, GetSignalV2ListResponse>,
  extraKeys?: ['actions', 'self_wallet_info']
) {
  return listData.map(item => {
    const updateKeys = ['mc_cur', 'holders_cur', 'top10_ratio', 'dev_ratio', 'insider_ratio', 'max_price_change', ...(extraKeys || [])] as const
    const matchedNewData = addressMap[item.token + item.chain]
    if (matchedNewData) {
      const result = {} as Record<string, GetSignalV2ListResponse>
      updateKeys.forEach(updateKey => {
        result[updateKey] = matchedNewData[updateKey] as any
      })
      return {
        ...item,
        ...result
      }
    }
    return item
  })
}

onMounted(() => {
  initTimer()
})
onUnmounted(() => {
  cancelAnimationFrame(timer)
})
</script>

<template>
  <TimeLine
    :activeChain="activeChain"
    @updateFilterToken="setFilterToken"
  />
  <div class="pt-24px pb-10px px-10px flex justify-between">
    <div class="flex items-center">
      <Filter
        :filter-params="filterParams"
        @onReset="onReset"
        @onConfirm="onConfirm"
      />
      <div class="flex items-center text-12px ml-20px color-[--d-F5F5F5-l-333]">
        {{ $t('NewSignalAlert') }}
        <el-switch
          v-model="shouldAlert"
          class="ml-8px"
          active-value="1"
          inactive-value="0"
        />
      </div>
      <div
        v-show="showResetBtn"
        class="flex items-center text-12px gap-2px cursor-pointer ml-5px color-[--d-F5F5F5-l-333]"
        @click="setFilterToken('')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 0C2.6862 0 0 2.6862 0 6C0 9.3138 2.6862 12 6 12C9.3138 12 12 9.3138 12 6C12 2.6862 9.3138 0 6 0ZM6 8.85C4.911 8.85 3.93306 8.24345 3.44766 7.26665C3.33666 7.04405 3.42779 6.77397 3.65039 6.66357C3.87419 6.55257 4.14365 6.64386 4.25405 6.86646C4.58585 7.53486 5.2548 7.95 6 7.95C7.0752 7.95 7.95 7.0752 7.95 6C7.95 4.9248 7.0752 4.05 6 4.05C5.56006 4.05 5.14707 4.20011 4.81494 4.45722C4.6823 4.5599 4.766 4.7502 4.93374 4.7502C5.18214 4.7502 5.38374 4.9518 5.38374 5.2002C5.38374 5.4486 5.18214 5.6502 4.93374 5.6502H3.6C3.3516 5.6502 3.15 5.4486 3.15 5.2002V3.86704C3.15 3.61864 3.3516 3.41704 3.6 3.41704C3.8484 3.41704 4.05 3.61864 4.05 3.86704C4.05 3.88931 4.0767 3.90093 4.09324 3.88602C4.60544 3.42457 5.27946 3.15 6 3.15C7.5714 3.15 8.85 4.4286 8.85 6C8.85 7.5714 7.5714 8.85 6 8.85Z"
            fill="#999999"/>
        </svg>
        {{ $t('reset') }}
      </div>
      <div class="flex items-center text-12px ml-20px color-[--d-F5F5F5-l-333]">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="7" fill="#349EFF"/>
          <path
            d="M6.0594 9.56109L6.165 7.96635L9.06051 5.3572C9.18895 5.24065 9.03435 5.18405 8.86453 5.28584L5.29021 7.54394L3.74422 7.05398C3.41267 6.95979 3.40886 6.72979 3.81986 6.56402L9.84088 4.24123C10.1161 4.11684 10.3801 4.30902 10.2745 4.73119L9.24913 9.56085C9.1773 9.90406 8.97013 9.98683 8.68353 9.82867L7.12256 8.67512L6.3724 9.40245C6.28559 9.48926 6.214 9.56085 6.0594 9.56085V9.56109Z"
            fill="white"/>
        </svg>
        <a
          v-if="!['zh-cn','zh-tw'].includes(localeStore.locale)"
          href="https://t.me/AveSignalMonitor"
          target="_blank"
          class="ml-1 underline">
          {{ $t('EnSubscription') }}
        </a>
        <a
            v-else
          href="https://t.me/AveSignalMonitorCN"
          target="_blank"
            class="underline ml-1">
          {{ $t('CnSubscription') }}
        </a>
      </div>
    </div>
    <div class="flex items-center">
      <span
          class="transition-all transition-duration-300 px-8px py-6px  rounded-4px bg-#FFA6221A text-12px color-#FFA622 cursor-pointer hover:bg-#FFA622 hover:color-#333"
          @click="setDialogVisible"
      >{{
          $t('SignalTopList')
        }}</span>
      <QuickSwapSet
          v-model:quickBuyValue="quickBuyValue"
          :chain="activeChain"
          style="margin-left: 20px;"
          :showQuickAmount="false"
      />
    </div>
  </div>
  <div class="flex pt-4px bg-[--d-222-l-F2F2F2]">
    <SignalLeftList
      ref="signalLeftList"
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
      @setToken="setFilterToken"
    />
    <SignalRightList
      ref="signalRightList"
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
      @setResetBtn="setResetBtn"
    />
  </div>
  <el-dialog
      v-model="dialogValues.visible"
      :title="$t('SignalTopList')"
      append-to-body
      width="540px"
      :class="`[--el-message-close-size:24px]`"
  >
    <el-table :data="dialogValues.list" :height="400">
      <el-table-column
          type="index"
          :label="$t('ranking')"
          label-class-name="text-12px color-[--d-666-l-999]"
      >
        <template #default="{$index}">
          <img v-if="$index+1===1" src="@/assets/images/111.svg">
          <img v-else-if="$index+1===2" src="@/assets/images/222.svg">
          <img v-else-if="$index+1===3" src="@/assets/images/333.svg">
          <div v-else class="text-12px color-[--d-666-l-999] text-center">{{ $index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('token')"
          label-class-name="text-12px color-[--d-666-l-999]"
      >
        <template #default="{row}">
          <div
            class="flex items-center text-12px gap-8px cursor-pointer"
            @click="navigateTo(`/token/${row.token}-${row.chain}`)"
          >
            <TokenImg
                chain-class="hidden"
                :row="{
                     chain:row.chain,
                     symbol:row.symbol,
                     logo_url:row.logo_url,
                  }"
            />
            <span class="shrink-0 whitespace-nowrap text-ellipsis overflow-hidden max-w-80px">{{ row.symbol }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          width="80"
          :label="$t('firstSignal')"
          label-class-name="text-12px color-[--d-666-l-999]"
      >
        <template #default="{row}">
          <span class="color-[--d-FFF-l-222] text-12px">{{ formatDate(row.first_signal_time, 'HH:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="110"
          :label="$t('firstMarketCap')"
          label-class-name="text-12px color-[--d-666-l-999]"
      >
        <template #default="{row}">
          <span class="color-[--d-FFF-l-222] text-12px"> ${{ formatNumber(row.first_signal_mc, 2) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          width="130"
          align="right"
          :label="$t('MaximumIncrease')"
          label-class-name="text-12px color-[--d-666-l-999]"
      >
        <template #default="{row}">
          <div class="text-20px text-right color-#12B886">{{ parseInt(row.max_price_change) }}x</div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
