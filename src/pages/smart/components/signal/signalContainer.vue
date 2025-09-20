<script setup lang="ts">
import TimeLine from './timeLine.vue'
import {useEventBus, useStorage, useWindowSize} from '@vueuse/core'
import Filter from './filter.vue'
import {
  type GetSignalV2ListResponse,
  getSignalV3List,
  type IActionItem, type IActionV3Item,
  type ITopSignal,
} from '~/api/signal'
import SignalLeftList from './signalLeftList.vue'
import SignalRightList from './signalRightList.vue'
import SignalTopList from './signalTopList.vue'

const emit = defineEmits(['close'])
const props = defineProps<{
  activeChain: string
  quickBuyValue: string
  dialogValues: {
    visible: boolean
    loading: boolean
    list:ITopSignal[]
  }
}>()
const {height} = useWindowSize()
const globalStore = useGlobalStore()
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
// const shouldAlert = useStorage('shouldAlert', '1')
const showResetBtn = shallowRef(false)
const signalLeftList = useTemplateRef<InstanceType<typeof SignalLeftList>>('signalLeftList')
const signalRightList = useTemplateRef<InstanceType<typeof SignalRightList>>('signalRightList')
const audioVisible = ref(false)

const scrollbarHeight = computed(()=>{
  const tokenHistoryHeight = globalStore.tokenHistoryVisible ? 32 : 0
  return height.value - 226 - tokenHistoryHeight
})

onMounted(() => {
  initWs()
  updateLeftList()
})

function onReset() {
  filterParams.value = {...defaultFilterParams}
  if (signalLeftList.value) {
    signalLeftList.value.fetchSignalList({})
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
watch(() => props.activeChain, () => {
  initWs()
})

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
      signalRightList.value.updateListData(listData => updateDataCallback(listData, addressMap, showResetBtn.value ? [] : ['actions', 'self_wallet_info']))
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
  extraKeys?: [] | ['actions', 'self_wallet_info']
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

const topListRef = useTemplateRef<InstanceType<typeof SignalTopList>>('topListRef')
const scrollTopEvent = useEventBus(BusEventType.SCROLL_TO_TOP)
scrollTopEvent.on(scrollToTop)
onUnmounted(()=>{
  scrollTopEvent.off(scrollToTop)
})
function scrollToTop() {
  if(topListRef.value){
    topListRef.value.setScrollTop(0)
  }
  if(signalLeftList.value){
    signalLeftList.value.setScrollTop(0)
  }
  if(signalRightList.value){
    signalRightList.value.setScrollTop(0)
  }
}
</script>

<template>
  <div class="flex justify-between p-16px pt-23px">
    <div class="flex items-center">
      <Filter
        :filter-params="filterParams"
        @onReset="onReset"
        @onConfirm="onConfirm"
      />
      <el-popover v-model:visible="audioVisible" trigger="click" popper-class="el-select__popper">
        <template #reference>
          <div class="flex items-center text-12px ml-20px color-[--main-text] cursor-pointer">
            <Icon :name="globalStore.audioSettings.audio.signal?'custom:ad':'custom:admute'" class="text-16px mr-4px color-[--secondary-text]" />
            {{ $t('NewSignalAlert') }}
          </div>
        </template>
        <template #default>
            <ul class="el-scrollbar__view el-select-dropdown__list [&&]:m--12px">
              <li v-for="item in audioList" :key="item" class="el-select-dropdown__item hover:bg-[--border]" :class="{'bg-[--border]': globalStore.audioSettings.audio.signal === item}" @click="globalStore.audioSettings.audio.signal=item;audioVisible=false;">
                <span class="text-12px">{{item || $t('close')}}</span>
              </li>
            </ul>
          </template>
      </el-popover>
      <div class="flex items-center text-12px ml-20px color-[--main-text]">
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
          TG {{ $t('Subscription') }}
        </a>
        <a
          v-else
          href="https://t.me/AveSignalMonitorCN"
          target="_blank"
          class="underline ml-1">
          TG{{ $t('Subscription') }}
        </a>
      </div>
      <div
        v-show="showResetBtn"
        class="flex items-center text-12px gap-2px cursor-pointer ml-20px color-[--main-text]"
        @click="setFilterToken('')"
      >
        <Icon name="custom:reset" class="text-14px"/>
        {{ $t('reset') }}
      </div>
    </div>
    <TimeLine
      :activeChain="activeChain"
      @updateFilterToken="setFilterToken"
    />
  </div>
  <div class="flex pt-4px bg-[--main-bg]">
    <SignalTopList
    ref="topListRef"
    :dialogValues="dialogValues"
    @close="emit('close')"
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

<style scoped lang="scss">

</style>
