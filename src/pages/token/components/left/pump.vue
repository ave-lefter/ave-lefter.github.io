<script setup lang="ts">
import {type GetHomePumpListResponse, homePumpList} from '~/api/token'
import THead from './tHead.vue'
import {formatNumber} from '~/utils/formatNumber'
import TokenImg from '~/components/tokenImg.vue'
import dayjs from 'dayjs'
import type {IPumpResponse} from '~/api/types/ws'
import {useThrottleFn} from '@vueuse/core'
import {formatTimeFromNow} from '~/utils'

const {t} = useI18n()
const botStore = useBotStore()
const wsStore = useWSStore()
// const localeStore = useLocaleStore()
const documentVisible = inject<Ref<boolean>>('documentVisible')
// const tokenStore = useTokenStore()
defineProps({
  finalHeight: {
    type: Number,
    required: true
  }
})
const sort = ref({
  sortBy: undefined,
  activeSort: 0
})
const isVolUSDT = ref(true)
const tabList = computed(()=>{
  return [{
    label: t('new1'),
    value: 'pump_in_new',
    progressVisible: true
  }, {
    label: t('soon'),
    value: 'pump_in_almost',
    progressVisible: true
  }, {
    label: t('graduated'),
    value: 'pump_out_new',
    progressVisible: false
  },
    //   {
    //   label: t('HotMigrated'),
    //   value: 'pump_out_hot',
    //   progressVisible: false
    // }
  ]
})
const activeTab = ref('pump_in_new')
const isPaused = ref(false)
const cachedList = shallowRef<any[]>([])
const progressVisible = computed(() => {
  return tabList.value.find(el => el.value === activeTab.value)?.progressVisible
})
const query = ref({
  pageNO: 1,
  pageSize: 20
})
const listStatus = ref({
  // finished: false,
  loading: false,
  // error: false
})
const listData = shallowRef<GetHomePumpListResponse[]>([])
const sortedListData = computed(() => {
  const {activeSort, sortBy} = sort.value
  if (activeSort === 0 || !sortBy) {
    return listData.value
  }
  return listData.value.toSorted((a, b) => {
    return (Number((b[sortBy!] || 0)) - Number((a[sortBy!] || 0))) * activeSort
  }).slice(0, 50)
})
const timer = ref<NodeJS.Timeout | number>()
const columns = computed(() => {
  const progressVisible = activeTab.value === 'pump_in_almost'
  return [{
    label: `${t('token')}${progressVisible ? `/${t('progress')}` : ''}`,
    value: 'progress',
    flex: 'flex-1',
    sort: progressVisible
  }, {
    label: '',
    value: 'current_price_usd',
    flex: 'w-92px justify-end',
    sort: false
  }, {
    label: t('mCap'),
    value: 'market_cap',
    flex: 'w-70px justify-end',
    sort: true
  }]
})

onMounted(() => {
  _getHomePumpList()
})

watch(() => botStore.evmAddress, () => {
  if (botStore.evmAddress) {
    wsStore.send({
      jsonrpc: '2.0',
      method: 'unsubscribe',
      params: ['pumpstate'],
      id: 1
    })

    wsStore.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: ['pumpstate', 'solana'],
      id: 1
    })
  }
}, {
  immediate: true
})

const activeTabToState = {
  pump_in_new: 'new',
  pump_in_almost: 'soon',
  pump_out_new: 'graduated'
} as Record<string, string>
watch(() => wsStore.wsResult[WSEventType.PUMPSTATE], (val) => {
  if (Array.isArray(val.msgs)) {
    const needPushArr = (val.msgs as IPumpResponse[]).filter(el =>
      el.state === activeTabToState[activeTab.value]).map(el => {
      return {
        ...el.pair,
        created_at: Math.min(el.time * 1000, Date.now())
      }
    })
    cachedList.value.push(...needPushArr)
    if (!isPaused.value) {
      updatePumpList()
    }
  }
})

const updatePumpList = useThrottleFn(() => {
  listData.value.unshift(...cachedList.value)
  cachedList.value.length = 0
  triggerRef(listData)
}, 200)

onActivated(() => {
  poll()
})
onDeactivated(() => {
  clearTimeout(timer.value)
})

watch(documentVisible, val => {
  if (!val) {
    clearTimeout(timer.value)
  } else {
    poll()
    pollPumpList()
  }
})

const tabsContainer = ref<HTMLElement | null>(null)
function setActiveTab(tab: any,index:number) {
  activeTab.value = tab
  resetListStatus()
  _getHomePumpList()
  scrollTabToCenter(tabsContainer,index)
  clearTimeout(timer.value)
  poll()
}

function sortChange() {
  resetListStatus()
  _getHomePumpList()
}

function resetListStatus() {
  // query.value.pageNO = 1
  cachedList.value.length = 0
  // listStatus.value.finished = false
  // listStatus.value.error = false
}

async function _getHomePumpList() {
  try {
    listStatus.value.loading = true
    const res = await homePumpList({
      chain: 'solana',
      category: activeTab.value,
      ...query.value,
      sort: sort.value.sortBy,
      sort_dir: ({
        1: 'desc',
        '-1': 'asc'
      })[sort.value.activeSort]
    })
    // const {pageNO} = query.value
    if (Array.isArray(res?.data)) {
      // if (pageNO === 1) {
        listData.value = res?.data
      // } else {
      //   listData.value = listData.value.concat(res?.data)
      // }
      // listStatus.value.finished = res?.data.length < query.value.pageSize
      // if (!listStatus.value.finished) {
      //   query.value.pageNO++
      // }
    }
  } catch (e) {
    console.log('=>(pump.vue:28) e', e)
  } finally {
    listStatus.value.loading = false
  }
}

function setPausedStatus(val: boolean) {
  isPaused.value = val
  if (val) {
    clearTimeout(timer.value)
  } else {
    poll()
  }
}

function poll() {
  timer.value = setTimeout(async () => {
    try {
      await pollPumpList()
    } finally {
      poll()
    }
  }, 5000)
}

async function pollPumpList() {
  const res = await homePumpList({
    chain: 'solana',
    category: activeTab.value,
    pageNO: 1,
    pageSize: query.value.pageSize,
    sort: sort.value.sortBy,
    sort_dir: ({
      1: 'asc',
      '-1': 'desc'
    })[sort.value.activeSort]
  })
  const map = {} as Record<string, any>
  if (Array.isArray(res?.data)) {
    res.data.forEach(el => {
      map[getUUid(el)] = el
    })
    let tempList = listData.value.map((el) => {
      if (map[getUUid(el)]) {
        return map[getUUid(el)]
      }
      return el
    })
    // 需要过滤 100% 进度
    if (activeTab.value === 'pump_in_almost') {
      tempList = tempList.filter(el => el.progress < 100)
    }
    listData.value = tempList
    triggerRef(listData)
  }
}

function getUUid(el: GetHomePumpListResponse) {
  return el.target_token + el.pair + el.chain
}

function getTargetToken(row: GetHomePumpListResponse) {
  if (row.target_token === row.token0_address) {
    return {logo: row.token0_logo_url, symbol: row.token0_symbol}
  }
  return {logo: row.token1_logo_url, symbol: row.token1_symbol}
}
</script>

<template>
  <div v-loading="listStatus.loading && query.pageNO===1">
    <div
      ref="tabsContainer"
      class="mt-8px mx-12px flex items-center justify-between whitespace-nowrap scrollbar-hide overflow-x-auto overflow-y-hidden">
      <div class="flex items-center gap-10px">
          <span
            v-for="(item,index) in tabList"
            :key="index"
            :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-999-l-666] px-4px py-2px rounded-4px cursor-pointer ${
              activeTab===item.value?'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]' : ''}`"
            @click="setActiveTab(item.value,index)"
          >
        {{ item.label }}
        </span>
      </div>
      <div v-show="isPaused" class="flex items-center color-#FFA622 text-12px">
        <Icon name="custom:stop"/>
        <span class="ml-3px">{{ $t('paused') }}</span>
      </div>
    </div>
    <THead
      v-model:sort="sort"
      :columns="columns"
      @update:sort="sortChange"
    >
    <template #current_price_usd>
      {{ t('amountU') }}
      <Icon
        name="custom:price"
        :class="`ml-2px mr-2px cursor-pointer text-10px ${isVolUSDT?'color-[--d-666-l-999]' : 'color-[--d-999-l-666]'}`"
        @click.stop.self="isVolUSDT=!isVolUSDT"
      />
      /{{ t('Txs') }}
    </template>
    </THead>
    <el-scrollbar
      :height="Math.max(500,finalHeight-130)"
      class="[&&]:h-auto"
    >
      <NuxtLink
        v-for="(row,$index) in sortedListData"
        :key="$index"
        class="px-10px flex items-center h-50px cursor-pointer hover:bg-[--d-1A1A1A-l-F2F2F2] text-12px"
        :to="`/token/${row.target_token}-${row.chain}`"
        @mouseenter="setPausedStatus(true)"
        @mouseleave="setPausedStatus(false)"
      >
        <div class="flex-[2] flex items-center">
          <TokenImg
            :row="{
            chain:row.chain,
            logo_url:getTargetToken(row).logo,
            symbol:getTargetToken(row).symbol,
          }"
          />
          <div class="ml-6px">
            <div
              class="flex items-center color-[--d-F5F5F5-l-333] max-w-80px overflow-hidden whitespace-nowrap">
              {{ getTargetToken(row).symbol }}
            </div>
            <div class="mt-2px color-[--d-999-l-666] text-10px">
              <TimerCount
                v-if="row.created_at && Number(formatTimeFromNow(dayjs(row.created_at).unix(),true)) < 60"
                :key="dayjs(row.created_at).unix()"
                :timestamp="dayjs(row.created_at).unix()"
                :end-time="60"
              >
                <template #default="{seconds}">
              <span class="color-[--d-999-l-666]">
                <template v-if="seconds<60">
                  {{ seconds }}s
                </template>
                <template v-else>
                  {{ formatTimeFromNow(dayjs(row.created_at).unix()) }}
                </template>
              </span>
                </template>
              </TimerCount>
              <span v-else class="color-[--d-999-l-666]">
                {{ formatTimeFromNow(dayjs(row.created_at).unix()) }}
              </span>
              <span
                v-if="progressVisible"
                class="color-[--d-999-l-666] ml-6px"
              >
              {{ formatNumber(row.progress, 1) }}%
              </span>
            </div>
          </div>
        </div>
        <div class="w-92px flex-col flex items-end">
          <span class="color-[--d-999-l-666]">{{ isVolUSDT ? '$' : '' }}{{
              isVolUSDT ? formatNumber(row.volume_u_24h, 2) : formatNumber(row.volume_u_24h / row.current_price_usd, 2)
            }}</span>
          <span class="color-[--d-666-l-999]">{{ formatNumber(row.tx_24h_count) }}</span>
        </div>
        <div class="w-70px flex-col flex items-end">
          <span class="color-[--d-F5F5F5-l-333]">${{ formatNumber(row.market_cap, 2) }}</span>
          <span :class="getColorClass(row.price_change_24h)">{{ addSign(Number(row.price_change_24h)) }}{{
              formatNumber(Math.abs(Number(row.price_change_24h)), 1)
            }}%</span>
        </div>
      </NuxtLink>
    </el-scrollbar>
  </div>
</template>

<style scoped>

</style>
