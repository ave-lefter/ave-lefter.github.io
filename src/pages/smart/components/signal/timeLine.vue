<script setup lang="ts">
import dogCoinImg from 'assets/images/dogcoin.png'
import {getTimeline, type Gold, type ITimeline} from '~/api/signal'
import {useWindowSize} from '@vueuse/core'

const emit = defineEmits(['updateFilterToken'])
const timelineRef = ref()
const dogRef = ref()
const popoverRef = ref()
const hideTimer = shallowRef<number>()
const dogline = ref({
  visible: false,
  data: [] as Gold[]
})
const timeline = ref({
  visible: false,
  data: {} as ITimeline
})
const hotList = shallowRef<ITimeline[]>([])
const props = defineProps<{
  activeChain: string
}>()

onMounted(() => {
  fetchTimeline()
})
watch(() => props.activeChain, () => {
  fetchTimeline()
})

const wsStore = useWSStore()
watch(() => wsStore.wsResult[WSEventType.GOLD_SIGNAL], (val) => {
  const {golds = [], ...rest} = val.msg
  hotList.value.shift()
  hotList.value.push(rest)
  setGolds(golds, hotList.value)
})

const {width} = useWindowSize()
const startIndex = computed(()=>{
  let _start = 0
  if (width.value < 1920) {
    _start = -hotList.value.length * 0.8
  }
  return _start
})
async function fetchTimeline() {
  const res = await getTimeline(props.activeChain)
  const data = res || []
  const golds: Gold[] = []
  data.forEach(el => {
    golds.push(...(el.golds || []))
    el.golds = []
  })
  setGolds(golds, data)
  hotList.value = data
}

function setGolds(golds: Gold[] = [], data: ITimeline[]) {
  const sortedGolds = golds.toSorted((a, b) => {
    return Number(b.mc) - Number(a.mc)
  })
  const map: Record<string, any> = {}
  sortedGolds.forEach(gold => {
    if (!map[gold.token]) {
      map[gold.token] = gold
    }
  })
  Object.values(map).forEach(gold => {
    for (let idx = 0; idx < data.length; idx++) {
      const target = gold.first_signal_time
      const source = data[idx].time
      const sourceRight = data[idx + 1]?.time
      if (target > source && target < sourceRight) {
        data[idx].golds =
          data[idx].golds
            ? data[idx].golds.concat(gold)
            : [gold]
        break
      }
    }
  })
}

function showLinePop(e: MouseEvent, current: ITimeline) {
  timelineRef.value = e.currentTarget
  timeline.value.visible = true
  timeline.value.data = current
}

function hideLinePop() {
  timelineRef.value = null
  timeline.value.visible = false
}

function showDogPop(e: MouseEvent, current: Gold[]) {
  cancelHide()
  dogRef.value = e.currentTarget
  dogline.value.visible = true
  dogline.value.data = current
}

function hideDogPop() {
  dogRef.value = null
  dogline.value.visible = false
}

function scheduleHide() {
  hideTimer.value = window.setTimeout(() => {
    hideDogPop()
  }, 500)
}

function cancelHide() {
  clearTimeout(hideTimer.value)
}

function getLevel(value: number) {
  if (value < 20000000) {
    return ''
  } else if (value < 35000000) {
    return 'bg-#286DFF opacity-20'
  } else if (value < 45000000) {
    return 'bg-#286DFF opacity-50'
  } else {
    return 'bg-#286DFF'
  }
}
</script>

<template>
  <div class="flex gap-16px items-center">
    <div class="flex items-center text-12px" style="color:var(--d-999-l-222);">
      <span class="mr-8px">{{ $t('normal') }}</span>
      <div class="flex items-center gap-2px">
        <div
          v-for="(el,idx) in 4" :key="idx" class="w-8px h-8px rounded-2px bg-[--d-333-l-999]"
          :class="({
              1:'bg-#286DFF opacity-20',
              2:'bg-#286DFF opacity-50',
              3:'bg-#286DFF'
            })[idx]"/>
      </div>
      <span class="ml-8px">{{ $t('hot') }}</span>
    </div>
    <div class="justify-between flex gap-2px">
      <div
        v-for="(el) in hotList.slice(startIndex)"
        :key="el.time"
        class="relative w-6px h-6px"
      >
        <i
          class="block w-full h-full bg-[--d-333-l-999]"
          :class="getLevel(Number(el.volume))"
          @mouseenter.stop="showLinePop($event,el)"
          @mouseleave.stop="hideLinePop"
        />
        <span
          v-if="el.golds?.length>0"
          class="absolute top--26px left-50% ml--10px w-20px h-20px border-2px border-solid rounded-full bg-cover"
          :class="({
            gold:'border-#FFD700',
            silver:'border-#E0E0E0',
            bronze:'border-#C77B30'
          })[el.golds?.[0]?.type]"
          :style="{
            backgroundImage:`url(${el.golds?.[0]?.logo
            ? getSymbolDefaultIcon({
              logo_url:el.golds?.[0]?.logo,
              chain:el.golds?.[0]?.chain,
              symbol:el.golds?.[0]?.symbol
            })
            :dogCoinImg})`
          }"
          @mouseenter.stop="showDogPop($event,el.golds||[])"
          @mouseleave.stop="scheduleHide"
        />
      </div>
    </div>
  </div>
  <el-popover
    ref="squarePopVisible"
    :width="153"
    :visible="timeline.visible"
    :virtual-ref="timelineRef"
    virtual-triggering
    append-to-body
  >
    <div class="text-12px">
      {{ formatDate(timeline.data.time || 0, 'MM-DD HH:mm') }}
    </div>
    <div class="text-12px">
      {{ $t('volume') }}：${{ formatNumber(timeline.data.volume) }}
    </div>
  </el-popover>
  <el-popover
    ref="popoverRef"
    :width="390"
    :visible="dogline.visible"
    :virtual-ref="dogRef"
    virtual-triggering
    append-to-body
  >
    <div
      class="w-full table text-12px"
      @mouseenter="cancelHide"
      @mouseleave="hideDogPop"
    >
      <div class="w-full table-row color-[--d-666-l-999] mb-6px">
        <div class="table-cell">{{ $t('FirstAlert') }}</div>
        <div class="table-cell">{{ $t('Token') }}</div>
        <div class="table-cell text-right">{{ $t('MC') }}</div>
      </div>
      <div
        v-for="el in dogline.data"
        :key="el.token"
        class="w-full table-row cursor-pointer"
        @click="emit('updateFilterToken',el.token)"
      >
        <div class="py-5px table-cell vertical-mid">
          <div class="flex items-center gap-4px">
            <img
              width="16"
              height="16"
              class="border-2px border-solid rounded-full"
              :class="({
                gold:'border-#FFD700',
                silver:'border-#E0E0E0',
                bronze:'border-#C77B30'
              })[el.type]"
              :src="
                   el.logo
                   ? getSymbolDefaultIcon({
                    logo_url:el.logo,
                    chain:el.chain,
                    symbol:el.symbol
                   })
                   : dogCoinImg"
              alt=""
            >
            {{
              el.first_signal_time
                ? formatDate(el.first_signal_time, 'MM-DD HH:mm:ss')
                : '--'
            }}
          </div>
        </div>
        <div class="py-5px table-cell vertical-mid">
          <div class="flex items-center gap-4px">
            <TokenImg
              token-class="w-16px h-16px"
              chain-class="w-8px h-8px"
              :row="{
                  chain:el.chain,
                  logo_url:el.logo,
                  symbol:el.symbol
                }"
            />
            {{ el.symbol }}
            <span style="color:#12B886">+{{ formatNumber(Number(el.price_change) * 100, 0) }}%</span>
          </div>
        </div>
        <div class="py-5px table-cell vertical-mid text-right">
          ${{ formatNumber(el.mc, 1) }}
        </div>
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang="scss">
</style>
