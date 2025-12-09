<script setup lang="ts">
import TimeLine from './timeLine.vue'
import { useEventBus, useWindowSize } from '@vueuse/core'
import {
  getActiveAddressRank,
  type GetSignalV2ListResponse,
  getSignalV3List,
  getTopSignal,
  type IActionItem,
  type IActionV3Item,
  type ITopSignal,
} from '~/api/signal'
import SignalLeftList from './signalLeftList.vue'
import SignalRightList from './signalRightList.vue'
import SignalTopList from './signalTopList.vue'

const dialogValues = ref<{
  visible: boolean
  loading: boolean
  type: 'topList' | 'activeList'
  pageNO: number
  pageSize: number
  topList: ITopSignal[]
  activeList: {
    user_address: string
    pnl: number
    rank: number
    win_rate: string
    wallet_logo: string
  }[]
  has_more: boolean
  tag: number[]
}>({
  visible: false,
  loading: false,
  topList: [],
  activeList: [],
  type: 'topList',
  pageNO: 1,
  pageSize: 100,
  has_more: true,
  tag: [30],
})
const showResetBtn = defineModel<boolean>('showResetBtn')
const props = defineProps<{
  activeChain: string
  quickBuyValue: string
  filterParams: any
}>()
const { height } = useWindowSize()
const globalStore = useGlobalStore()

// const shouldAlert = useStorage('shouldAlert', '1')
const signalLeftList = useTemplateRef<InstanceType<typeof SignalLeftList>>('signalLeftList')
const signalRightList = useTemplateRef<InstanceType<typeof SignalRightList>>('signalRightList')

const scrollbarHeight = computed(() => {
  const tokenHistoryHeight = globalStore.tokenHistoryVisible ? 32 : 0
  return height.value - 226 - tokenHistoryHeight
})

onMounted(() => {
  initWs()
  updateLeftList()
})

function updateLeftList() {
  if (signalLeftList.value) {
    signalLeftList.value.fetchSignalList(props.filterParams)
  }
}

watch(
  () => props.filterParams,
  () => {
    updateLeftList()
  }
)

const wsStore = useWSStore()
watch(
  () => props.activeChain,
  () => {
    initWs()
  }
)

function initWs() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['signalsv2_public_monitor', props.activeChain],
    id: 1,
  })

  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['signalsv2_public_monitor', props.activeChain],
    id: 1,
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
      wallet_address: botStore.getWalletAddress(props.activeChain),
    })
    const addressMap: Record<string, GetSignalV2ListResponse> = {}
    ;(res || []).forEach((item) => {
      if (!addressMap[item.token + item.chain]) {
        addressMap[item.token + item.chain] = item
      }
    })
    if (signalRightList.value) {
      signalRightList.value.updateListData((listData) =>
        updateDataCallback(
          listData,
          addressMap,
          showResetBtn.value ? [] : ['actions', 'self_wallet_info']
        )
      )
    }
    if (signalLeftList.value) {
      signalLeftList.value.updateListData((listData) => updateDataCallback(listData, addressMap))
    }
  } catch (e) {
    console.log('=>(signalList.vue:106) e', e)
  }
}

function updateDataCallback(
  listData: GetSignalV2ListResponse<IActionItem | IActionV3Item>[],
  addressMap: Record<string, GetSignalV2ListResponse>,
  extraKeys?: [] | ['actions', 'self_wallet_info']
) {
  return listData.map((item) => {
    const updateKeys = [
      'mc_cur',
      'holders_cur',
      'top10_ratio',
      'dev_ratio',
      'insider_ratio',
      'max_price_change',
      ...(extraKeys || []),
    ] as const
    const matchedNewData = addressMap[item.token + item.chain]
    if (matchedNewData) {
      const result = {} as Record<string, GetSignalV2ListResponse>
      updateKeys.forEach((updateKey) => {
        result[updateKey] = matchedNewData[updateKey] as any
      })
      return {
        ...item,
        ...result,
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

const topListRef = useTemplateRef<InstanceType<typeof SignalTopList>>('topListRef')
const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
scrollTopEvent.on(scrollToTop)
onUnmounted(() => {
  scrollTopEvent.off(scrollToTop)
})
function scrollToTop() {
  if (topListRef.value) {
    topListRef.value.setScrollTop(0)
  }
  if (signalLeftList.value) {
    signalLeftList.value.setScrollTop(0)
  }
  if (signalRightList.value) {
    signalRightList.value.setScrollTop(0)
  }
}

async function setDialogVisible(type: 'topList' | 'activeList') {
  dialogValues.value.type = type
  dialogValues.value.visible = true
  dialogValues.value.pageNO = 1
  const isTopList = type === 'topList'
  if (isTopList) {
    getTopListData()
  } else {
    getActiveListData()
  }
}

async function getTopListData() {
  if (dialogValues.value.visible && dialogValues.value.topList.length === 0) {
    dialogValues.value.loading = true
    try {
      const res = await getTopSignal()
      dialogValues.value.topList = res || []
    } finally {
      dialogValues.value.loading = false
    }
  }
}

async function getActiveListData() {
  dialogValues.value.loading = true
  try {
    const res = await getActiveAddressRank({
      pageNO: dialogValues.value.pageNO,
      pageSize: dialogValues.value.pageSize,
      chain: props.activeChain,
      tag: dialogValues.value.tag.join(','),
    })
    dialogValues.value.has_more = res.has_more
    dialogValues.value.activeList =
      dialogValues.value.pageNO === 1 ? res.items : [...dialogValues.value.activeList, ...res.items]
    if (res.has_more) {
      dialogValues.value.pageNO++
    }
  } finally {
    dialogValues.value.loading = false
  }
}

function initPoll() {
  return requestTimeout(1000 * 60 * 5, async () => {
    if (dialogValues.value.loading) {
      return
    }
    const res = await getActiveAddressRank({
      pageNO: 1,
      pageSize: dialogValues.value.activeList.length,
      chain: props.activeChain,
      tag: dialogValues.value.tag.join(','),
    })
    dialogValues.value.activeList = res.items || []
  })
}

let rafResult = initPoll()

onUnmounted(() => {
  cancelAnimationFrame(rafResult.id!)
})

defineExpose({
  setFilterToken,
})

watch(
  () => [dialogValues.value.tag, props.activeChain],
  () => {
    cancelAnimationFrame(rafResult.id!)
    dialogValues.value.pageNO = 1
    dialogValues.value.activeList = []
    dialogValues.value.has_more = true
    getActiveListData()
    rafResult = initPoll()
  }
)
</script>

<template>
  <div class="flex justify-between p-16px pt-23px">
    <TimeLine :activeChain="activeChain" @updateFilterToken="setFilterToken" />
    <div class="flex items-center gap-16px">
      <span
        class="transition-all transition-duration-300 px-8px py-6px rounded-4px bg-#FFA6221A text-12px color-#FFA622 cursor-pointer hover:bg-#FFA622 hover:color-#333"
        @click="setDialogVisible('topList')"
      >
        {{ $t('SignalTopList') }}
      </span>
      <span
        class="transition-all transition-duration-300 px-8px py-6px rounded-4px bg-#FFA6221A text-12px color-#FFA622 cursor-pointer hover:bg-#FFA622 hover:color-#333"
        @click="setDialogVisible('activeList')"
      >
        {{ $t('top24hAddress') }}
      </span>
    </div>
  </div>
  <div class="flex pt-4px bg-[--main-bg]">
    <SignalTopList
      ref="topListRef"
      v-model:tag="dialogValues.tag"
      :dialogValues="dialogValues"
      :activeChain="activeChain"
      @close="dialogValues.visible = false"
      @loadMore="getActiveListData"
    />
    <SignalLeftList
      ref="signalLeftList"
      :scrollbarHeight="scrollbarHeight"
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
      @setToken="setFilterToken"
    />
    <SignalRightList
      ref="signalRightList"
      :scrollbarHeight="scrollbarHeight"
      :activeChain="activeChain"
      :quickBuyValue="quickBuyValue"
      @setResetBtn="setResetBtn"
    />
  </div>
</template>

<style scoped lang="scss"></style>
