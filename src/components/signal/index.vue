<script setup lang="ts">
import {useStorage, useThrottleFn} from '@vueuse/core'
import {getSignalV2List, type GetSignalV2ListResponse, type IActionItem} from '~/api/signal'
import SlippageSet from '~/pages/token/components/right/botSwap/slippageSet.vue'
import Filter from '~/components/signal/filter.vue'
import SelectIcon from '~/components/signal/selectIcon.vue'
import QuickBuyInput from '~/components/signal/quickBuyInput.vue'
import SmallSignalList from '~/components/signal/smallSignalList.vue'
import MiddleSignalList from '~/components/signal/middleSignalList.vue'
import LargeSignalList from '~/components/signal/largeSignalList.vue'

const props = defineProps<{
  containerWidth: number
  scrollHeight: number
}>()
const globalStore = useGlobalStore()
const configStore = useConfigStore()
const botSettingStore = useBotSettingStore()
const localeStore = useLocaleStore()
const chainOptions = shallowRef(['solana', 'bsc'])
function setActiveChain(chain: string) {
  signalStore.activeChain = chain
  resetAndGet()
}

const sortParams = shallowRef({
  sortBy: undefined,
  activeSort: 0
})

const audioUrl = computed(()=>{
  return audioNameToResource[globalStore.audioSettings.audio.signal as keyof typeof audioNameToResource]
  || audioNameToResource.Bar
})
const filterSignalList = computed(() => {
  const {sortBy, activeSort} = sortParams.value
  return signalStore.signalList.filter(filterCallback).toSorted((a, b) => {
    if (sortBy) {
      return (Number((b[sortBy] || 0)) - Number((a[sortBy] || 0))) * activeSort
    }
    return 0
  })
})

function filterCallback(el: GetSignalV2ListResponse) {
  const {token, history_count, mc_curr} = signalStore.filterParams
  const tokenMatched = !token || el.token === token
  const countMatched = el.history_count > (history_count || 0)
  const mcMatched = !mc_curr || Number(el.mc_cur) < mc_curr
  return tokenMatched && countMatched && mcMatched
}

function resetFilterParams() {
  signalStore.$patch({
    filterParams: {
      token: '',
      history_count: undefined,
      mc_curr: undefined,
      mc_curr_sign: '<'
    }
  })
  resetAndGet()
}

function resetAndGet() {
  signalStore.$patch({
    listStatus: {
      finished: false,
      error: false,
      loading: true
    },
    pageParams: {
      pageNO: 1,
      pageSize: 20
    },
    signalList: []
  })
  fetchSignalList()
}

// const shouldAlert = useStorage('shouldAlert', '1')
const quickBuyValue = useStorage('quickBuyValue', '0.01')
const signalStore = useSignalStore()
const isSmallScreen = computed(() => {
  return props.containerWidth <= 320
})
const isMiddleScreen = computed(() => {
  return props.containerWidth <= 759 && props.containerWidth > 320
})
const isLargeScreen = computed(() => {
  return props.containerWidth >= 760
})
onMounted(() => {
  console.log('signal mounted')
  if (signalStore.pageParams.pageNO === 1) {
    fetchSignalList()
  }
  initTimer()
  initWs()
})
let timer: number
watch(() => signalStore.activeChain, () => {
  signalStore.signalList = []
  signalStore.pageParams.pageNO = 1
  fetchSignalList()
  initWs()
})

const wsStore = useWSStore()

function initWs() {
  wsStore.send({
    'jsonrpc': '2.0',
    method: 'unsubscribe',
    'params': [
      'signalsv2_public_monitor',
      signalStore.activeChain
    ],
    'id': 1
  })

  wsStore.send({
    'jsonrpc': '2.0',
    method: 'subscribe',
    'params': [
      'signalsv2_public_monitor',
      signalStore.activeChain
    ],
    'id': 1
  })
}

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

onUnmounted(() => {
  cancelAnimationFrame(timer)
})

const signalAudio = useTemplateRef('signalAudio')
watch(() => wsStore.wsResult[WSEventType.SIGNALSV2_PUBLIC_MONITOR], ({msg: _signalData}: {
  msg: GetSignalV2ListResponse
}) => {
  if (globalStore.audioSettings.audio.signal && signalAudio.value && filterCallback(_signalData)) {
    signalAudio.value.currentTime = 0
    signalAudio.value.play()
  }
  const matchIndex = signalStore.signalList.findIndex((p) =>
    p.token === _signalData.token && p.chain === _signalData.chain
  )
  if (matchIndex !== -1) {
    signalStore.signalList.splice(matchIndex, 1)
    signalStore.signalList.unshift(_signalData)
  } else if (_signalData.history_count === 1) {
    signalStore.signalList.unshift(_signalData)
  }
  signalStore.updateList()
})

/**
 * 作为推送接口使用，只更新数据
 */
async function updateListData() {
  try {
    const res = await getSignalV2List({
      chain: signalStore.activeChain,
      pageNO: 1,
      pageSize: 50,
      fold: true
    })
    const addressMap: Record<string, GetSignalV2ListResponse> = {}
    ;(res || []).forEach((item) => {
      if (!addressMap[item.token + item.chain]) {
        addressMap[item.token + item.chain] = item
      }
    })
    signalStore.signalList = signalStore.signalList.map(item => {
      const updateKeys = ['mc_cur', 'holders_cur', 'top10_ratio', 'dev_ratio', 'insider_ratio', 'max_price_change','price_change_24h'] as const
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
  } catch (e) {
    console.log('=>(signalList.vue:106) e', e)
  }
}

const scrollbar = useTemplateRef('scrollbar')

const onScroll = useThrottleFn(({scrollTop}: { scrollTop: number }) => {
  if (scrollbar.value) {
    const scrollElement = scrollbar.value.wrapRef
    if (scrollElement && scrollElement.scrollHeight - scrollTop - props.scrollHeight < 30) {
      endReached('bottom')
    }
  }
}, 100, true, false)

function endReached(direction: 'top' | 'bottom' | 'left' | 'right') {
  if (signalStore.listStatus.finished || signalStore.listStatus.loading) {
    return
  }
  if (direction === 'bottom') {
    fetchSignalList()
  }
}
async function fetchSignalList() {
  try {
    signalStore.listStatus.loading = true
    const res = await getSignalV2List({
      ...signalStore.pageParams,
      chain: signalStore.activeChain,
      fold: true,
      ...signalStore.filterParams
    })
    if (signalStore.pageParams.pageNO === 1) {
      signalStore.signalList = res || []
    } else {
      signalStore.signalList = signalStore.signalList.concat(res || [])
    }
    const finished = res?.length < signalStore.pageParams.pageSize
    signalStore.listStatus.finished = finished
    if (!finished) {
      signalStore.pageParams.pageNO++
    }
  } catch (e) {
    console.log('=>(index.vue:224) e', e)
    signalStore.listStatus.error = true
    signalStore.signalList.length = 0
  } finally {
    signalStore.listStatus.loading = false
  }
}

let hideTimer: number | NodeJS.Timeout
const buttonRef = ref<null | HTMLElement>(null)
const currentActions = shallowRef<IActionItem[]>([])

const popVisible = shallowRef(false)

function showPopover(e: MouseEvent, actions: IActionItem[]) {
  cancelHide()
  buttonRef.value = e.currentTarget as HTMLElement | null
  currentActions.value = actions || []
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

// const isShowDate = ref(true)

</script>

<template>
  <div
      class="bg-[--secondary-bg] p-12px pt-0 relative shrink-0 signal h-full"
  >
    <Icon
        name="custom:drag2"
        class="absolute top-3px left-50% ml--6px text-6px bg-[--icon-color]"
    />
    <div
        class="flex items-center py-10.5px justify-between mb-16px border-b-solid border-b-1px border-b-[--main-divider] cursor-move">
      <span class="color-[--main-text] text-14px">{{ $t('signal') }}</span>
      <div class="flex items-center gap-12px">
        <Filter
          v-if="isLargeScreen"
          :filter-params="signalStore.filterParams"
          @onConfirm="val=>{signalStore.filterParams={...val};resetAndGet();}"
          @onReset="resetFilterParams"
        />
        <el-select
          size="small"
          placeholder=""
          :suffix-icon="SelectIcon"
          @change="setActiveChain"
        >
          <template #prefix>
            <el-image
              class="flex items-center rounded-full w-12px h-12px"
              :src="`${configStore.token_logo_url}chain/${signalStore.activeChain}.png`"
            />
            <span class="text-12px color-[--main-text]">
              {{ signalStore.activeChain.slice(0, 3).toUpperCase() }}
            </span>
          </template>
          <el-option
            v-for="net_name in chainOptions"
            :key="net_name"
            :value="net_name"
            class="[&&]:text-12px flex items-center [&&]:h-26px [&&]:lh-26px"
          >
            <el-image
              class="flex items-center rounded-full w-12px h-12px mr-4px"
              :src="`${configStore.token_logo_url}chain/${net_name}.png`"
            />
            {{ net_name.slice(0, 3).toUpperCase() }}
          </el-option>
        </el-select>
        <QuickBuyInput
          v-if="isLargeScreen"
          v-model="quickBuyValue"
          size="small"
          class="[--el-border-color:transparent] shrink-0"
        />
        <SlippageSet
          id="drag-settings"
          :showQuickAmount="false"
          :chain="signalStore.activeChain"
          :setting="botSettingStore?.botSettings[signalStore.activeChain]"
        />
        <Icon
          name="custom:close"
          class="text-14px shrink-0 cursor-pointer color-[--main-text]"
          @click.self="signalStore.signalVisible=false"
        />
      </div>
    </div>
    <div id="drag-disabled">
      <div
        v-if="!isLargeScreen"
        class="flex items-center justify-between mb-18px"
      >
        <Filter
          :filter-params="signalStore.filterParams"
          @onConfirm="val=>{signalStore.filterParams={...val};resetAndGet();}"
          @onReset="resetFilterParams"
        />
        <AutoSellSetting class="ml-auto h-22px!" :chain="(signalStore.activeChain as BotChain)" />
        <QuickBuyInput
          v-model="quickBuyValue"
          size="small"
          class="[--el-border-color:transparent]"
        />
      </div>
      <el-scrollbar
          v-if="!isLargeScreen"
        ref="scrollbar"
        style="margin-right: -12px;padding-right: 12px;"
        :height="scrollHeight"
          @scroll="onScroll"
      >
        <SmallSignalList
          v-if="isSmallScreen"
          :signalList="filterSignalList"
          :quickBuyValue="quickBuyValue"
        />
        <MiddleSignalList
          v-else-if="isMiddleScreen"
          :quickBuyValue="quickBuyValue"
          :signalList="filterSignalList"
          :showPop="showPopover"
          :hidePop="scheduleHide"
        />
        <AveEmpty v-if="signalStore.signalList.length===0&&!signalStore.listStatus.loading" class="pt-10px"/>
        <div
          v-if="signalStore.listStatus.loading"
          class="flex justify-center text-12px text-[--third-text]"
        >
          {{ $t('loading') }}
        </div>
      </el-scrollbar>
      <LargeSignalList
        v-else
        v-model="sortParams"
        :loading="signalStore.listStatus.loading"
        :quickBuyValue="quickBuyValue"
        :signalList="filterSignalList"
        :showPop="showPopover"
        :hidePop="scheduleHide"
        :height="signalStore.signalBoundingRect.height-100"
        @endReached="endReached"
      />
    </div>
    <audio
      ref="signalAudio" controls style="display: none"
      :src="audioUrl"
      :volume="+globalStore.audioSettings.audio.volume/100 || 0.5"
    />

    <!--  actions -->
    <el-popover
      :width="320"
      :virtual-ref="buttonRef"
      :visible="popVisible"
      popper-class="[--el-bg-color-overlay:--main-divider] max-h-200px [&&]:[--el-popover-padding:0] overflow-y-auto"
      virtual-triggering
      append-to-body
    >
      <div
        class="p-12px"
        @mouseenter="cancelHide"
        @mouseleave="hidePopover"
      >
        <div class="flex color-[--third-text] text-12px mb-8px">
          <div class="flex-1">
            {{ $t('wallet') }}
          </div>
          <div class="flex-1">
            {{ $t('operate') }}
          </div>
          <div class="w-40px flex items-center justify-end gap-4px">
            {{ $t('time') }}
            <!-- <Icon
              :name="`${isShowDate ? 'custom:calendar' : 'custom:countdown'}`"
              class="color-[--d-666-l-999] cursor-pointer" @click.self="isShowDate = !isShowDate"
            /> -->
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
        },idx) in currentActions"
            :key="idx"
            class="flex color-[--secondary-text] text-12px lh-14px"
          >
            <div class="flex-1 flex items-center">
              <span class="w-10px h-10px rounded-full bg-[--signal-green] mr-4px"/>
              <span class="color-[--main-text] whitespace-nowrap overflow-hidden text-ellipsis max-w-50px">{{
                  wallet_alias || $t('wallet')
                }}</span>
              <span>(*{{ wallet_address.slice(-4) }})</span>
            </div>
            <div class="flex-1 color-[--up-color]">
              {{ $t('buy') }}{{ localeStore.locale === 'en' ? ' ' : '' }}{{ formatNumber(quote_token_amount, 2) }} {{
                quote_token_symbol
              }}<span>(${{ formatNumber(quote_token_volume, 0) }})</span>
            </div>
            <div class="w-40px flex justify-end">
              <!-- <template v-if="isShowDate">
                {{ formatDate(action_time * 1000, 'MM/DD HH:mm:ss') }}
              </template>
              <template v-else>
                {{ dayjs(action_time * 1000).fromNow() }}
              </template> -->
              {{ formatTimeFromNow(action_time) }}
            </div>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
:deep{
  .signal {
    .el-select {
      --el-select-width: 60px;
    }

    .el-select--small .el-select__wrapper {
      gap: 1px;
      min-height: 20px;
      line-height: 14px;
    }
  }
}
</style>
