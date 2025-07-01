<script setup lang="ts">
import {
  getTokenDetailLine,
  getTokenDetailMarks,
  type GetTokenDetailMarksResponse,
  type GetTokenDetailsLineResponse
} from '~/api/token'
import LineChart from './lineChart.vue'
import BaseInfo from './baseInfo.vue'

const tokenDetailsStore = useTokenDetailsStore()
const symbol = computed(() => {
  const {pairInfo} = tokenDetailsStore
  if (pairInfo) {
    const targetIs0 = pairInfo.target_token === pairInfo.token0_address
    const targetToken = targetIs0
      ? pairInfo.token0_symbol
      : pairInfo.token1_symbol
    const sourceToken = targetIs0
      ? pairInfo.token1_symbol
      : pairInfo.token0_symbol
    return {
      source: sourceToken,
      target: targetToken
    }
  }
  return {
    source: '',
    target: ''
  }
})
const visible = computed({
  get: () => tokenDetailsStore.drawerVisible,
  set: (value) => {
    tokenDetailsStore.$patch({drawerVisible: value})
  }
})
const timeList = computed(() => [
  {name: '4H', id: 14400},
  {name: '1D', id: 86400},
  {name: '7D', id: 604800},
  {name: '30D', id: 2592000}
])
const activeTime = shallowRef<number>(86400)

function switchTimeTab(item: number) {
  activeTime.value = item
  init()
}

type  TMark = (GetTokenDetailMarksResponse & { count?: number; coordY?: number; })
const loadingLineChart = ref(false)
const lineChartList = shallowRef<GetTokenDetailsLineResponse[]>([])
const marks = shallowRef<TMark[]>([])
const loadingMark = ref(false)

const baseRef = useTemplateRef('baseRef')
watch(() => tokenDetailsStore.drawerVisible, val => {
  if (val) {
    activeTime.value = 86400
    init()
    setTimeout(() => {
      if (baseRef.value) {
        baseRef.value.init()
      }
    }, 20)
  }
})

async function init() {
  marks.value = []
  lineChartList.value = []
  await _getTokenDetailLine()
  loadingMark.value = false
  const getMarksQueue = ['SWAP', 'T_Trading', 'TRANSFER', 'LIQUIDITY', 'BURN'].map(
    el => _getTokenDetailMarks(el)
  )
  Promise.all(getMarksQueue)
    .then(res => {
      const result = res?.slice()
      let swap = res[0]
      const trade = res[1]?.filter(i => i?.has_t == true)
      if (swap?.length > 0 && trade?.length > 0) {
        swap = swap?.filter(y => trade?.find(m => m.time !== y.time))
      }
      result[0] = swap
      result[1] = trade
      const list: TMark[] = result?.flat() || []
      const obj: { [key: string]: number } = {}
      list?.forEach(i => {
        const find = lineChartList.value?.find(y => i.time == y.time)
        const count = (obj[i.time] || 0) + 1
        obj[i.time] = count
        i.count = count
        i.coordY = find?.close
      })
      marks.value = list
      console.log('----------marks-----', marks.value)
    }).finally(() => {
    loadingMark.value = false
  })
}

function _getTokenDetailLine() {
  const data = {
    from: parseInt(String(Date.now() / 1000)) - activeTime.value,
    to: parseInt(String(Date.now() / 1000)),
    interval: switchTime(activeTime.value)
  }
  loadingLineChart.value = true
  return getTokenDetailLine(tokenDetailsStore.tokenInfo!.id, data)
    .then(res => {
      lineChartList.value = res || []
    })
    .catch((e) => {
      console.log('=>(index.vue:61) e', e)
    })
    .finally(() => {
      loadingLineChart.value = false
    })
}

function switchTime(time: number) {
  const obj = {
    14400: 60,
    86400: 5 * 60,
    604800: 60 * 60,
    2592000: 4 * 60 * 60
  }
  return obj[time as keyof typeof obj]
}

async function _getTokenDetailMarks(type: string) {
  const data = {
    from: parseInt(String(Date.now() / 1000)) - activeTime.value,
    to: parseInt(String(Date.now() / 1000)),
    interval: switchTime(activeTime.value),
    event_type: type,
    user_address: tokenDetailsStore.user_address
  }
  return getTokenDetailMarks(tokenDetailsStore.tokenInfo!.id, data)
    .then(res => {
      let list = Array.isArray(res) ? res : []
      list = list?.filter(i => Object.keys(i)?.length > 1)
      return list?.map(i => ({
        ...i,
        type: i.has_t ? 'T_Trading' : Object.keys(i)?.[1] || ''
      }))
    })
    .catch((e) => {
      console.log('=>(index.vue:93) e', e)
      return []
    })
}
</script>

<template>
  <el-drawer
    v-model="visible"
    append-to-body
    :with-header="false"
    size="480"
    style="--el-drawer-bg-color:transparent"
  >
    <div
      class="absolute left-0 right-0 top-0 bottom-0 z-3012 bg-[--d-222-l-FFF] rounded-tl-10px rounded-bl-10px flex flex-col"
    >
      <div
        class="flex-1 max-w-480px overflow-y-auto overflow-x-hidden"
      >
        <div class="py-24px px-20px min-h-full">
          <div class="justify-between flex">
            <div class="flex items-center">
              <TokenImg
                :row="{
                logo_url:tokenDetailsStore.tokenInfo?.logo_url,
                chain:tokenDetailsStore.tokenInfo?.chain
              }"
              />
              <span class="text-14px ml-4px mr-4px">{{ symbol.target }}</span>
              <span class="text-12px color-[--d-999-l-666] mr-8px">/ {{ symbol.source }}</span>
              <Icon
                v-copy="tokenDetailsStore.tokenInfo?.address" name="bxs:copy"
                class="cursor-pointer text-10px color-[--d-666-l-999]"
              />
            </div>
            <div
              class="flex items-center border-solid border-0.5px color-#999 border-[--d-333-l-F2F2F2] rounded-4px"
            >
              <span
                v-for="(item, index) in timeList"
                :key="index"
                :class="`px-14px py-4px text-12px hover:opacity-80 cursor-pointer ${item.id===activeTime? 'color-[--d-F5F5F5-l-333] bg-[--d-333-l-F2F2F2]':''}`"
                @click="switchTimeTab(item.id)"
              >
                {{ item.name }}
              </span>
            </div>
          </div>

          <div
            class="relative h-200px mb-22px"
          >
            <LineChart
              v-loading="loadingLineChart"
              element-loading-background="transparent"
              :active-time="activeTime"
              :marks="marks"
              :show-series="[true,true]"
              :data-list="lineChartList"
            />
          </div>

          <BaseInfo ref="baseRef"/>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">

</style>
