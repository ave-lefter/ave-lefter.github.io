<script setup lang="ts">
import {
  getSignalV2List,
  type GetSignalV2ListResponse,
  type IActionItem,
  type IActionV3Item,
  type ISignalFilter
} from '~/api/signal'
import {useStorage, useThrottleFn, useWindowSize} from '@vueuse/core'
import QuickSwapButton from '~/components/quickSwap/quickSwapButton.vue'

const localeStore = useLocaleStore()
const props = defineProps<{
  activeChain: string
  quickBuyValue: string
}>()
const listData = shallowRef<GetSignalV2ListResponse[]>([])
const filterSignalList = computed(() => {
  return listData.value.filter(filterCallback)
})
const listStatus = ref({
  loading: false,
  finished: false,
  error: false
})
const pageParams = shallowRef({
  pageNO: 1,
  pageSize: 20,
})

const tempQueryParams = shallowRef<ISignalFilter>({})
defineExpose({
  fetchSignalList: (queryParams?: ISignalFilter) => {
    if (queryParams) {
      tempQueryParams.value = queryParams
    }
    resetAndGet()
  },
  setSelectId: (val: undefined) => {
    selectId.value = val
  },
  updateListData(callback: (p: GetSignalV2ListResponse<IActionItem | IActionV3Item>[]) => GetSignalV2ListResponse<IActionItem | IActionV3Item>[]) {
    listData.value = callback(listData.value)
  }
})
watch(() => props.activeChain, () => {
  resetAndGet()
})

async function fetchSignalList() {
  if (listStatus.value.loading || listStatus.value.finished) {
    return
  }
  try {
    listStatus.value.loading = true
    const res = await getSignalV2List({
      ...tempQueryParams.value,
      ...pageParams.value,
      fold: false,
      chain: props.activeChain
    })
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
  } catch (e) {
    console.log(e, 'error')
    listStatus.value.error = true
    listData.value = []
  } finally {
    listStatus.value.loading = false
  }
}

const localStore = useLocaleStore()
watch(() => localStore.locale, () => {
  resetAndGet()
})

function resetAndGet() {
  listData.value = []
  pageParams.value.pageNO = 1
  listStatus.value.finished = false
  listStatus.value.error = false
  fetchSignalList()
}

let hideTimer: number | NodeJS.Timeout
const buttonRef = ref<null | HTMLElement>(null)
const currentSignal = shallowRef<GetSignalV2ListResponse>({})

const popVisible = shallowRef(false)

function showPopover(e: MouseEvent, item: GetSignalV2ListResponse) {
  buttonRef.value = e.currentTarget as HTMLElement | null
  currentSignal.value = item
  popVisible.value = true
}

function hidePopover() {
  buttonRef.value = null
  popVisible.value = false
}

function scheduleHide() {
  hideTimer = setTimeout(() => {
    hidePopover()
  }, 500)
}

function cancelHide() {
  clearTimeout(hideTimer)
}

const isShowDate = ref(true)
const {height} = useWindowSize()
const scrollbar = useTemplateRef('scrollbar')

const onScroll = useThrottleFn(({scrollTop}: { scrollTop: number }) => {
  if (scrollbar.value) {
    const scrollElement = scrollbar.value.wrapRef
    if (scrollElement && scrollElement.scrollHeight - scrollTop - (height.value - 226) < 30) {
      fetchSignalList()
    }
  }
}, 100, true, false)

const signalAudio = useTemplateRef('signalAudio')
const wsStore = useWSStore()
const shouldAlert = useStorage('shouldAlert', '1')
watch(() => wsStore.wsResult[WSEventType.SIGNALSV2_PUBLIC_MONITOR], ({msg: _signalData}: {
  msg: GetSignalV2ListResponse
}) => {
  listData.value.unshift(_signalData)
  if (shouldAlert.value === '1' && signalAudio.value && filterCallback(_signalData)) {
    signalAudio.value.currentTime = 0
    signalAudio.value.play()
  }
})

function filterCallback(el: GetSignalV2ListResponse) {
  const {token, history_count, mc_curr} = tempQueryParams.value
  const tokenMatched = !token || el.token === token
  const countMatched = el.history_count > (history_count || 0)
  const mcMatched = !mc_curr || Number(el.mc_cur) < mc_curr
  return tokenMatched && countMatched && mcMatched
}

const canDrag = shallowRef(false)
const {width: winWidth} = useWindowSize()
const widthConfig = [304, 404]
const width = useStorage('signalLefWid', winWidth.value < 1920 ? widthConfig[0] : widthConfig[1])

function drag(e: MouseEvent) {
  let dx = e.clientX
  canDrag.value = true
  document.onmousemove = e => {
    if (!canDrag.value) {
      return
    }
    const {clientX} = e

    const _width = clientX < dx
      ? width.value - (dx - clientX)
      : width.value + clientX - dx
    if (_width >= widthConfig[0] && _width <= widthConfig[1]) {
      width.value = _width
    }
    dx = clientX
  }
  document.onmouseup = () => {
    canDrag.value = false
    document.onmousemove = null
    document.onmouseup = null
  }
  return false
}

const selectId = shallowRef()
const emit = defineEmits(['setToken'])

function selectSignal(id: number, token: string) {
  if(selectId.value === id){
    selectId.value = undefined
    emit('setToken', '')
  } else {
    selectId.value = id
    emit('setToken', token)
  }
}

const tokenDetailSStore = useTokenDetailsStore()

function openTokenDetail(el: IActionItem) {
  tokenDetailSStore.$patch({
    drawerVisible: true,
    tokenInfo: {
      id: currentSignal.value.token + '-' + props.activeChain,
      symbol: currentSignal.value.symbol,
      logo_url: currentSignal.value.logo,
      chain: props.activeChain,
      address: currentSignal.value.token,
      remark: ''
    },
    pairInfo: {
      target_token: currentSignal.value.token,
      token0_address: el.quote_token_address,
      token0_symbol: el.quote_token_symbol,
      token1_symbol: currentSignal.value.symbol,
      pairAddress: ''
    },
    user_address: el.wallet_address
  })
}
</script>

<template>
  <div class="flex">
    <el-scrollbar
      ref="scrollbar"
      :style="`width:${width}px`"
      :height="height-226"
      @scroll="onScroll"
    >
      <AveEmpty
        v-if="!filterSignalList.length&&!listStatus.loading"
        class="pt-100px"
      />
      <div
        class="flex flex-col gap-4px ml-4px"
      >
        <div
          v-for="({
          history_count,
          tag,
          action_count,
          signal_time,
          symbol,
          chain,
          logo,
          token,
          issue_platform,
          token_create_time,
          top10_ratio,
          insider_ratio,
          dev_ratio,
          max_price_change,
          first_signal_time,
          mc,
          mc_cur,
          headline,
          id
        },index) in filterSignalList"
          :key="index"
          class="p-12px  bg-[--d-111-l-FFF] border-[--d-111-l-FFF] hover:bg-[--d-222-l-F2F2F2] cursor-pointer transition-colors"
          :class="selectId===id?'bg-[--d-222-l-F2F2F2]':''"
          @click="selectSignal(id,token)"
        >
          <div class="mb-22px flex justify-between">
            <div class="flex items-center gap-8px">
              <div
                  class="flex items-center gap-4px relative ml--20px p-6px h-26px color-#FFF lh-14px rounded-rt-3px rounded-rb-3px bg-#333"
              >
                <span
                  class="absolute bottom--4px left--4px w-0 h-0 border-t-solid border-t-4px border-t-transparent border-r-4px border-r-solid border-r-transparent border-l-4px border-l-solid border-l-#333 transform-scale-x-[-1] transform-scale-y-[-1]"
                />
                <Icon name="custom:alert"/>
                {{ history_count }}
              </div>
              <div
                class="flex items-center gap-4px px-8px py-6px rounded-4px h-26px text-12px lh-12px color-#12B886 bg-#12B8861A"
                @mouseenter.stop="showPopover($event,filterSignalList[index])"
                @mouseleave.stop="scheduleHide"
              >
                <img class="w-14px h-14px rounded-full" :src="formatIconTag(tag)" alt="">
                {{ action_count }}{{ $t('smart_money_trade') }}{{ $t(tag) }}
              </div>
            </div>
            <div
              v-tooltip="formatDate(signal_time, 'MM/DD HH:mm:ss')"
              class="flex items-center gap-4px color-[--d-666-l-999] hover:color-[--d-F5F5F5-l-333] cursor-pointer"
            >
              <Icon
                name="custom:clock"
                class="text-14px"
              />
              <TimerCount
                v-if="signal_time && Number(formatTimeFromNow(signal_time, true)) < 60"
                :key="signal_time" :timestamp="signal_time" :end-time="60">
                <template #default="{ seconds }">
                  <div v-if="seconds < 60" class="color-#FFA622 text-12px">
                    {{ seconds }}s
                  </div>
                  <div v-else class="text-12px">
                    {{ formatTimeFromNow(signal_time) }}
                  </div>
                </template>
              </TimerCount>
              <div v-else class="text-12px flex">
                {{ formatTimeFromNow(signal_time) }}
              </div>
            </div>
          </div>
          <div class="flex justify-between mb-18px">
            <div class="flex items-center gap-8px">
              <div
                @click.stop="navigateTo(`/token/${token}-${chain}`)"
              >
                <TokenImg
                  token-class="w-36px h-36px"
                  chain-class="w-14px h-14px"
                  :row="{
                   symbol,
                   chain,
                   logo_url:logo
                  }"
                />
              </div>
              <div>
                <div class="mb-4px flex items-center gap-4px color-[--d-666-l-999]">
                  <span
                    class="text-16px font-500 color-[--d-F5F5F5-l-333]"
                    @click.stop="navigateTo(`/token/${token}-${chain}`)"
                  >{{ symbol }}</span>
                  <a
                    class="text-10px flex items-center justify-center"
                    :href="`https://x.com/search?q=($${symbol} OR ${token})&src=typed_query&f=live`"
                    target="_blank"
                    @click.stop
                  >
                    <Icon
                      name="hugeicons:search-01"
                    />
                  </a>
                  <img
                    v-if="issue_platform"
                    v-tooltip="issue_platform"
                    :src="formatIconTag(issue_platform)"
                    width="10"
                    height="10"
                    class="rounded-full"
                    alt=""
                  >
                </div>
                <div class="flex items-center gap-4px">
                  <div v-tooltip="formatDate(token_create_time,'MM/DD HH:mm:ss')">
                    <TimerCount
                      v-if="token_create_time && Number(formatTimeFromNow(token_create_time, true)) < 60"
                      :key="token_create_time" :timestamp="token_create_time" :end-time="60">
                      <template #default="{ seconds }">
                    <span v-if="seconds < 60" class="color-#FFA622 text-12px">
                      {{ seconds }}s
                    </span>
                        <span v-else class="color-[--d-666-l-999] text-12px">
                      {{ formatTimeFromNow(token_create_time) }}
                    </span>
                      </template>
                    </TimerCount>
                    <div v-else class="color-[--d-666-l-999] text-12px">
                      {{ formatTimeFromNow(token_create_time) }}
                    </div>
                  </div>
                  <span
                    v-copy="token"
                    class="text-12px cursor-pointer color-[--d-666-l-999]">{{
                      token.slice(0, 4)
                    }}...{{ token.slice(-4) }}</span>
                  <Icon v-copy="token" name="bxs:copy" class="cursor-pointer text-12px color-[--d-666-l-999]"/>
                  <div
                    v-if="Number(top10_ratio) > 0"
                    class="text-10px flex items-center gap-2px color-[--d-666-l-999]"
                    :class="{
                    'color-#F6465D':Number(top10_ratio) > 30
                }"
                  >
                    <Icon
                      class="text-11px"
                      name="custom:top"
                    />
                    {{ formatNumber(top10_ratio || 0, 1) }}%
                  </div>
                  <!--  <div-->
                  <!--    v-if="Number(insider_ratio) > 0"-->
                  <!--    class="text-10px flex items-center gap-2px color-[&#45;&#45;d-999-l-666]"-->
                  <!--    :class="{-->
                  <!--    'color-#F6465D':Number(insider_ratio) > 30-->
                  <!--}"-->
                  <!--  >-->
                  <!--    <Icon-->
                  <!--      class="text-11px"-->
                  <!--      name="custom:insiders"-->
                  <!--    />-->
                  <!--    {{ formatNumber(insider_ratio || 0, 1) }}%-->
                  <!--  </div>-->
                  <!--  <div-->
                  <!--    v-if="Number(dev_ratio) > 0.01"-->
                  <!--    class="text-10px flex items-center gap-2px color-[&#45;&#45;d-999-l-666]"-->
                  <!--  >-->
                  <!--    <img-->
                  <!--      src="@/assets/images/dev.png" alt=""-->
                  <!--      class="w-11px h-11px">-->
                  <!--    {{ formatNumber(dev_ratio || 0, 1) }}%-->
                  <!--  </div>-->
                </div>
              </div>
            </div>
            <div>
              <div class="color-[--d-999-l-666] mb-8px text-12px text-right">
                {{ $t('MaximumIncrease') }}
              </div>
              <div
                class="py-4px px-8px min-w-67px text-center rounded-tl-2 rounded-br-[10px] text-[24px] leading-[24px] text-white font-500 bg-#12B886"
              >
                {{ Number(max_price_change) < 1 ? '<1' : Math.ceil(Number(max_price_change)) + 'X' }}
              </div>
            </div>
          </div>
          <div class="flex justify-between items-end text-12px lh-16px">
            <div class="flex flex-col gap-8px">
              <div class="flex-1 flex">
                <div class="color-[--d-666-l-999] w-80px">{{ $t('CurrentAlert') }}</div>
                <div class="color-[--d-999-l-666]">
                  {{
                    first_signal_time
                      ? formatDate(first_signal_time, 'MM/DD HH:mm:ss')
                      : '--'
                  }}
                </div>
              </div>
              <div class="flex-1 flex">
                <div class="color-[--d-666-l-999] w-80px">
                  {{ $t('CurrentMC') }}
                </div>
                <div class="flex items-center gap-4px color-[--d-F5F5F5-l-333]">
              <span
                :class="{
                'color-#12B886':Number(mc_cur)>Number(mc),
                'color-#F6465D':Number(mc_cur)<Number(mc),
              }">${{ formatNumber(mc_cur, 1) }}</span>
                  <img
                    v-if="Number(mc_cur)>Number(mc)"
                    src="@/assets/images/increase.svg"
                    alt=""
                  >
                  <img
                    v-else-if="Number(mc_cur)<Number(mc)"
                    src="@/assets/images/decrease.svg"
                    alt=""
                  >
                </div>
              </div>
            </div>
            <!--<el-row-->
            <!--  class="flex-1"-->
            <!--&gt;-->
            <!--  <el-col :span="9">-->
            <!--    <div class="color-[&#45;&#45;d-666-l-999]">{{ $t('CurrentAlert') }}</div>-->
            <!--    <div class="color-[&#45;&#45;d-F5F5F5-l-333]">-->
            <!--      {{-->
            <!--        first_signal_time-->
            <!--          ? formatDate(first_signal_time, 'YYYY/MM/DD HH:mm:ss')-->
            <!--          : '&#45;&#45;'-->
            <!--      }}-->
            <!--    </div>-->
            <!--  </el-col>-->
            <!--  <el-col-->
            <!--    :span="11"-->
            <!--    class="[&&]:flex items-center"-->
            <!--  >-->
            <!--    <div>-->
            <!--      <div class="color-[&#45;&#45;d-666-l-999]">-->
            <!--        {{ $t('AlertMC') }}-->
            <!--      </div>-->
            <!--      <div class="flex items-center color-[&#45;&#45;d-F5F5F5-l-333]">-->
            <!--        ${{ formatNumber(mc, 1) }}-->
            <!--        <Icon-->
            <!--          name="material-symbols:arrow-right-alt"-->
            <!--          class="mx-12px color-#999"-->
            <!--        />-->
            <!--      </div>-->
            <!--    </div>-->
            <!--    <div>-->
            <!--      <div class="color-[&#45;&#45;d-666-l-999]">-->
            <!--        {{ $t('CurrentMC') }}-->
            <!--      </div>-->
            <!--      <div class="flex items-center gap-4px color-[&#45;&#45;d-F5F5F5-l-333]">-->
            <!--  <span-->
            <!--    :class="{-->
            <!--    'color-#12B886':Number(mc_cur)>Number(mc),-->
            <!--    'color-#F6465D':Number(mc_cur)<Number(mc),-->
            <!--  }">${{ formatNumber(mc_cur, 1) }}</span>-->
            <!--        <img-->
            <!--          v-if="Number(mc_cur)>Number(mc)"-->
            <!--          src="@/assets/images/increase.svg"-->
            <!--          alt=""-->
            <!--        >-->
            <!--        <img-->
            <!--          v-else-if="Number(mc_cur)<Number(mc)"-->
            <!--          src="@/assets/images/decrease.svg"-->
            <!--          alt=""-->
            <!--        >-->
            <!--      </div>-->
            <!--    </div>-->
            <!--  </el-col>-->
            <!--  &lt;!&ndash;<el-col :span="4">&ndash;&gt;-->
            <!--  &lt;!&ndash;  <div class="color-[&#45;&#45;d-666-l-999]">&ndash;&gt;-->
            <!--  &lt;!&ndash;    {{ $t('holders') }}&ndash;&gt;-->
            <!--  &lt;!&ndash;  </div>&ndash;&gt;-->
            <!--  &lt;!&ndash;  <div class="color-[&#45;&#45;d-F5F5F5-l-333]">&ndash;&gt;-->
            <!--  &lt;!&ndash;    {{ formatNumber(holders_cur) }}&ndash;&gt;-->
            <!--  &lt;!&ndash;  </div>&ndash;&gt;-->
            <!--  &lt;!&ndash;</el-col>&ndash;&gt;-->
            <!--</el-row>-->
            <QuickSwapButton
              :quick-buy-value="quickBuyValue"
              :row="filterSignalList[index]"
              classNames="min-w-70px"
              mainNameVisible
            />
          </div>
          <div 
            v-if="headline"
            class="flex items-center gap-8px mt-12px"
            v-tooltip="headline"
           >
            <Icon name="custom:ai" class="shrink-0"/>
            <div class="color-[--d-F5F5F5-l-333] text-12px whitespace-nowrap overflow-hidden text-ellipsis">
              {{ headline }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="listStatus.loading" class="flex py-10px justify-center text-12px text-[#959a9f]">{{
          $t('loading')
        }}
      </div>
    </el-scrollbar>
    <div
      class="mt-8px cursor-col-resize bg-[--d-333-l-F2F2F2] gap-1px hover:bg-[--d-666-l-CCC] flex flex-col items-center justify-center w-6px"
      @mousedown.stop.prevent="drag"
    >
      <span v-for="i in 3" :key="i" class="bg-#444 w-2px h-2px rounded-full"/>
    </div>
  </div>
  <!--  actions -->
  <el-popover
    :width="390"
    :offset="8"
    :virtual-ref="buttonRef"
    :visible="popVisible"
    popper-class="[--el-bg-color-overlay:--d-1A1A1A-l-FFF] max-h-200px"
    virtual-triggering
    append-to-body
  >
    <div
      @mouseenter="cancelHide"
      @mouseleave="hidePopover"
    >
      <div class="flex color-[--d-666-l-999] text-12px mb-8px">
        <div class="flex-[3]">
          {{ $t('wallet') }}
        </div>
        <div class="flex-[4]">
          {{ $t('operate') }}
        </div>
        <div class="flex-[2] flex items-center justify-end gap-4px">
          {{ $t('time') }}
          <Icon
            :name="`${isShowDate ? 'custom:calendar' : 'custom:countdown'}`"
            class="color-[--d-666-l-999] cursor-pointer" @click.self="isShowDate = !isShowDate"
          />
        </div>
      </div>
      <div class="flex flex-col gap-12px">
        <div
          v-for="({
          wallet_alias,
          wallet_address,
          quote_token_amount,
          quote_token_symbol,
          quote_token_volume,
          action_time
        },idx) in currentSignal.actions"
          :key="idx"
          class="flex color-[--d-999-l-666] text-12px lh-14px cursor-pointer"
          @click="openTokenDetail(currentSignal.actions[idx])"
        >
          <div class="flex-[3] flex items-center">
            <span class="w-10px h-10px rounded-full bg-#37B270 mr-4px"/>
            <span class="color-[--d-F5F5F5-l-333] whitespace-nowrap overflow-hidden text-ellipsis max-w-60px">{{
                wallet_alias || $t('wallet')
              }}</span>
            <span class="color-[--d-999-l-666]">(*{{ wallet_address.slice(-4) }})</span>
          </div>
          <div class="flex-[4] color-#12B886">
            {{ $t('buy') }}{{ localeStore.locale === 'en' ? ' ' : '' }}{{ formatNumber(quote_token_amount, 2) }} {{
              quote_token_symbol
            }}<span class="color-[--d-999-l-666]">(${{ formatNumber(quote_token_volume, 0) }})</span>
          </div>
          <div class="flex-[2] flex justify-end">
            <template v-if="isShowDate">
              {{ formatDate(action_time * 1000, 'MM/DD HH:mm:ss') }}
            </template>
            <template v-else>
              {{ formatTimeFromNow(action_time) }}
            </template>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
  <audio
    ref="signalAudio" controls style="display: none"
    src="/signal.mp3"
  />
</template>

<style scoped lang="scss">

</style>
