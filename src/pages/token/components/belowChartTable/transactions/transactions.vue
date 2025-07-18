<script setup lang="ts">
import TableDateFilter from './tableDateFilter.vue'
import VolFilter from './volFilter.vue'
import MakersFilter from './makersFilter.vue'
import MarkerTooltip from './markerTooltip.vue'
import UserTxsFilterHead from './userTxsFilterHead.vue'
import type { RowEventHandlerParams } from 'element-plus'

import {filterLanguage} from '~/pages/token/components/kLine/utils'
import {
  getPairLiq,
  type GetPairLiqResponse,
  type IGetTokenTxsResponse,
  getTokenTxs,
  type Profile
} from '~/api/token'
import {formatDate, formatTimeFromNow, getAddressAndChainFromId, getChainInfo, uuid} from '~/utils'

import {useThrottleFn} from '@vueuse/core'

import IconUnknown from '@/assets/images/icon-unknown.png'
import type {AveTable} from '#components'
import type { content } from 'html2canvas/dist/types/css/property-descriptors/content'

const MAKER_SUPPORT_CHAINS = ['solana', 'bsc']
const { t } = useI18n()
const {totalHolders, pairAddress, token, pair, commonHeight} = storeToRefs(useTokenStore())
const tokenDetailSStore = useTokenDetailsStore()
const botStore = useBotStore()
const wsStore = useWSStore()
const tagStore = useTagStore()
const route = useRoute()
const aveTableRef = ref<InstanceType<typeof AveTable> | null>(null)
const firstActivated = ref(true)
onActivated(() => {
  if (!firstActivated.value && aveTableRef.value) {
    aveTableRef.value.scrollToTop(0)
  }
  firstActivated.value = false
})

const finalHeight = computed(() => Math.max(500, commonHeight.value - 250))
// 只在交易历史接口更新之后更新，防止 route 地址更新导致列表数据更新异常
const realAddress = shallowRef(getAddressAndChainFromId(route.params.id as string).address)
const tabs = computed(() => {
  const arr: Array<{ label: string, value: string }> = []
  if (Array.isArray(totalHolders.value)) {
    totalHolders.value.forEach(i => {
      const num = i.total_address!
      if (num > 0) {
        arr.push({
          ...i,
          label: i?.[filterLanguage(useLocaleStore().locale)] + `(${num})`,
          value: i.type
        })
      }
    })
  }
  return [{
    label: t('all'),
    value: 'all'
  },
  {
    label: t('buy3'),
    value: 'buy'
  },
  {
    label: t('sell3'),
    value: 'sell'
  },
  // {
  //   label: t('followed'),
  //   value: '-100'
  // },
  {
    label: t('liquidity2'),
    value: 'liquidity'
  }, ...arr]
})
const activeTab = shallowRef('all')
const ignoreWs = computed(() => {
  return !['all', 'buy', 'sell'].includes(activeTab.value)
})
const isHoverTable = shallowRef(false)

const isLiquidity = computed(() => activeTab.value === 'liquidity')
const columns = computed(() => {
  const visible = token.value?.chain === 'solana' && !isLiquidity.value
  return [{ key: 'time', dataKey: 'time', title: t('time'), minWidth: 80 },
  { key: 'type', dataKey: 'type', title: t('type'), minWidth: 80 },
  { key: 'swapPrice', dataKey: 'swapPrice', title: t('swapPrice'), minWidth: 100 },
    {key: 'amountB', dataKey: 'amountB', title: t('amountB'), minWidth: 120},
  {
    key: 'amountU', dataKey: 'amountU', title: t('amountU'), align: 'right', class: 'relative',
    minWidth: 120
  },
    {key: 'makers', dataKey: 'makers', title: t('makers'), align: 'right', minWidth: 220},
  {
    key: 'SOLBalance',
    dataKey: 'SOLBalance',
    title: t('makers') + ' SOL',
    align: 'right',
    hidden: !visible,
    minWidth: 86
  },
  { key: 'DEX', dataKey: 'DEX', title: 'DEX/TXN', align: 'right', minWidth: 70 }]
    .filter(el => !el.hidden)
})
const listStatus = ref({
  loadingTxs: false,
  loadingLiq: false
})
const tokenTxs = shallowRef<IGetTokenTxsResponse[]>([])
const wsPairCache = shallowRef<IGetTokenTxsResponse[]>([])
const pairLiq = shallowRef<GetPairLiqResponse[]>([])
const wsLiqCache = shallowRef<GetPairLiqResponse[]>([])

const tableFilter = ref<{
  timestamp: string[];
  amountU: string[];
  markerAddress: string;
  tag_type: string;
}>({
  timestamp: [],
  amountU: [],
  markerAddress: '',
  tag_type: ''
})

const filterTableListMap = {
  all: () => [...tokenTxs.value, ...pairLiq.value].toSorted((a, b) => b.time - a.time),
  liquidity: () => pairLiq.value,
  buy: () => tokenTxs.value.filter(el => isBuy((el))),
  sell: () => tokenTxs.value.filter(el => !isBuy(el))
}
// 纯前端筛选
const filterTableList = computed(() => {
  let tableList: ((IGetTokenTxsResponse | GetPairLiqResponse) & { count?: number })[] = []
  if (activeTab.value in filterTableListMap) {
    tableList = filterTableListMap[activeTab.value as keyof typeof filterTableListMap]()
  } else {
    tableList = tokenTxs.value
  }
  const { timestamp, amountU, markerAddress } = tableFilter.value
  const [startTime, endTime] = timestamp || []
  const [startVol, endVol] = amountU || []
  if (startTime) {
    tableList = tableList.filter(el => el.time >= Number(startTime))
  }
  if (endTime) {
    tableList = tableList.filter(el => el.time <= Number(endTime))
  }
  if (markerAddress) {
    tableList = tableList.filter(el => el.wallet_address === markerAddress)
  }
  if (startVol) {
    tableList = tableList.filter(el => {
      if ('type' in el) {
        // 计算流动性的交易额
        const vol = el.amount0 * el.token0_price_usd + el.amount1 * el.token1_price_usd
        return vol >= Number(startVol)
      } else {
        return getAmount(el, true, true) >= Number(startVol)
      }
    })
  }
  if (endVol) {
    tableList = tableList.filter(el => {
      if ('type' in el) {
        // 计算流动性的交易额
        const vol = el.amount0 * el.token0_price_usd + el.amount1 * el.token1_price_usd
        return vol <= Number(endVol)
      } else {
        return getAmount(el, true, true) <= Number(endVol)
      }
    })
  }
  return tableList
})

const txCount = shallowRef<{ [key: string]: number }>({})
const tableView = ref({
  isShowDate: false,
  // isSwapPriceUSDT: true, 不常用，先删除
  isVolUSDT: true
})
const tableFilterVisible = ref({
  timestamp: false,
  amountU: false,
  markers: false
})
const makerTooltip = ref()
const markerTooltipVisible = shallowRef(false)
const currentRow = shallowRef<IGetTokenTxsResponse & { senderProfile: Profile }>({} as any)
const isPausedTxs = computed(() => {
  return isHoverTable.value
    || tokenDetailSStore.drawerVisible
    || markerTooltipVisible.value
})

const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || ''
  }
})
watch(() => pairAddress.value, (pair, oldPair) => {
  if (pairAddress.value) {
    _getPairLiq()
    subscribeLiq(pair, oldPair)
  }
}, {
  immediate: true
})

watch(() => route.params.id, val => {
  if (val) {
    resetCache()
    tableFilter.value.markerAddress = ''
    _getTokenTxs()
  }
}, {
  immediate: true
})

useVisibilityChange(() => {
  resetCache()
  _getTokenTxs()
  _getPairLiq()
})

//
// const txsBounding = useElementBounding(aveTableRef)
// const mouseInsideTxs = useThrottleFn((event: MouseEvent) => {
//   // 获取鼠标位置
//   const mouseX = event.clientX
//   const mouseY = event.clientY
//
//   // 判断鼠标是否在元素边界内并且鼠标不在视口外
//   isPausedTxs.value = (
//     mouseX >= txsBounding.left.value &&
//     mouseX <= txsBounding.right.value &&
//     mouseY >= txsBounding.top.value &&
//     mouseY <= txsBounding.bottom.value
//   ) && (
//     mouseX >= 0 &&
//     mouseX <= window.innerWidth &&
//     mouseY >= 0 &&
//     mouseY <= window.innerHeight
//   )
// }, 100, true, false)

function resetCache() {
  txCount.value = {}
  wsPairCache.value.length = 0
  wsLiqCache.value.length = 0
}

watch(() => wsStore.wsResult[WSEventType.TX], data => {
  if (!data || listStatus.value.loadingTxs || ignoreWs.value) {
    return
  }
  const {wallet_address, from_address, to_address} = data.tx
  // 不是当前币种的数据
  if (from_address !== realAddress.value && to_address !== realAddress.value) {
    return
  }
  txCount.value[wallet_address] = (txCount.value[wallet_address] || 0) + 1
  const { topN, wallet_tag } = getWalletTag(data.tx)
  const item = {
    ...data.tx,
    topN, wallet_tag,
    senderProfile: JSON.parse(data.tx.profile || '{}'),
    count: txCount.value[wallet_address],
    time: Math.min(Math.floor(Date.now() / 1000), data.tx.time),
    uuid: uuid()
  }
  wsPairCache.value.unshift(item)
  if (!isPausedTxs.value) {
    updatePairTxs()
  }
})
watch(() => wsStore.wsResult[WSEventType.LIQ], data => {
  if (!data || listStatus.value.loadingLiq || !['all', 'liquidity'].includes(activeTab.value)) {
    return
  }
  // const { wallet_address } = data.liq
  // txCount.value[wallet_address] = (txCount.value[wallet_address] || 0) + 1
  wsLiqCache.value.unshift({
    ...data.liq,
    uuid: uuid()
    // count: txCount.value[wallet_address]
  })
  if (!isPausedTxs.value) {
    updateLiqList()
  }
  if (pairLiq.value.length > 300) {
    pairLiq.value.pop()
  }
})

function subscribeLiq(pair: string, oldPair?: string) {
  if (oldPair) {
    wsStore.send({
      jsonrpc: '2.0',
      params: ['liq', oldPair],
      id: 1,
      method: 'unsubscribe'
    })
  }

  setTimeout(() => {
    wsStore.send({
      jsonrpc: '2.0',
      params: ['liq', pair],
      id: 1,
      method: 'subscribe'
    })
  }, 20)
}

const updatePairTxs = useThrottleFn(() => {
  tokenTxs.value.unshift(...wsPairCache.value)
  wsPairCache.value.length = 0
  triggerRef(tokenTxs)
}, 500)

const updateLiqList = useThrottleFn(() => {
  pairLiq.value.unshift(...wsLiqCache.value)
  wsLiqCache.value.length = 0
  triggerRef(pairLiq)
}, 500)

function onTimestampConfirm(timestamp: string[] = []) {
  tableFilterVisible.value.timestamp = false
  tableFilter.value.timestamp = timestamp
}

function confirmVolFilter(amountU: string[] = []) {
  tableFilterVisible.value.amountU = false
  tableFilter.value.amountU = amountU
}

function confirmMakersFilter(markerAddress = '') {
  txCount.value = {}
  tableFilterVisible.value.markers = false
  tableFilter.value.markerAddress = markerAddress
  _getTokenTxs()
}

async function _getTokenTxs() {
  try {
    listStatus.value.loadingTxs = true
    const { tag_type } = tableFilter.value
    const getPairTxsParams = {
      token_id: route.params.id as string,
      tag_type,
      maker: tableFilter.value.markerAddress
    }
    const res = await getTokenTxs(getPairTxsParams)
    realAddress.value = getAddressAndChainFromId(getPairTxsParams.token_id).address
    tokenTxs.value = (res || []).reverse().map(val => {
      txCount.value[val.wallet_address] = (txCount.value[val.wallet_address] || 0) + 1
      const { wallet_tag, topN } = getWalletTag(val)
      return {
        ...val,
        wallet_tag,
        topN,
        count: txCount.value[val.wallet_address],
        senderProfile: JSON.parse(val.profile || '{}'),
        uuid: uuid()
      }
    }).reverse()
  } catch (e) {
    tokenTxs.value = []
    console.log('=>(transactions.vue:62) e', e)
  } finally {
    listStatus.value.loadingTxs = false
  }
}

function getWalletTag(val: IGetTokenTxsResponse) {
  const wallet_tagStr = val.wallet_tag_v2 || ''
  let topN = ''
  let wallet_tag: string[] = []
  if (wallet_tagStr.length > 0) {
    wallet_tag = wallet_tagStr.split(',')
    wallet_tag.forEach((i: string, index: number) => {
      const isTopN = new RegExp('^top.*$', 'gi').test(i)
      if (isTopN) {
        topN = i
        wallet_tag.splice(index, 1)
      }
    })
  }
  return {
    topN,
    wallet_tag
  }
}

async function _getPairLiq() {
  try {
    listStatus.value.loadingLiq = true
    const res = await getPairLiq(pairAddress.value + '-' + addressAndChain.value.chain)
    pairLiq.value = (res || []).reverse().map(val => {
      // txCount.value[val.wallet_address] = (txCount.value[val.wallet_address] || 0) + 1
      return {
        ...val,
        uuid: uuid()
        // count: txCount.value[val.wallet_address],
      }
    }).reverse()
  } catch (e) {
    console.log('=>(transactions.vue:155) e', e)
  } finally {
    listStatus.value.loadingLiq = false
  }
}

function isBuy(row: GetPairLiqResponse | IGetTokenTxsResponse) {
  if ('from_address' in row) {
    if (
      row.from_address &&
      realAddress.value.toLowerCase?.() === row.from_address?.toLowerCase?.()
    ) {
      return false
    }
  }

  if ('to_address' in row) {
    if (
      row.to_address &&
      realAddress.value.toLowerCase?.() === row.to_address.toLowerCase?.()
    ) {
      return true
    }
  }
}

function getRowColor(row: GetPairLiqResponse | IGetTokenTxsResponse) {
  if ('type' in row) {
    if (row.type === 'addLiquidity') {
      return 'color-#65C4ED'
    } else if (row.type === 'removeLiquidity' || row.type === 'CollectFee') {
      return 'color-#EF6DE2'
    }
  }
  return isBuy(row) ? 'color-#12B886' : 'color-#FF646D'
}

function getPrice(row: GetPairLiqResponse | IGetTokenTxsResponse, isShowToken = false) {
  // route.params。id 同步更改，而接口异步请求，此时更新该值变成了 0
  const tokenAddress = realAddress.value
  if ('from_address' in row) {
    if (
      row.from_address &&
      tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()
    ) {
      return isShowToken ? row.from_price_eth : row.from_price_usd
    }
  }

  if ('to_address' in row) {
    if (
      row.to_address &&
      tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()
    ) {
      return isShowToken ? row.to_price_eth : row.to_price_usd
    }
  }

  if ('token0_address' in row) {
    let price = 0
    if (tokenAddress === row.token0_address) {
      price = row.token0_price_usd || 0
    } else {
      price = row.token1_price_usd || 0
    }
    return price
  }
  return 0
}

function getAmount(row: GetPairLiqResponse | IGetTokenTxsResponse, needPrice = false, isVolUSDT = false) {
  if ('from_address' in row) {
    if (
      row.from_address &&
      realAddress.value.toLowerCase?.() === row.from_address?.toLowerCase?.()
    ) {
      return row.from_amount * (
        needPrice ? Number(isVolUSDT ? row.from_price_usd : row.from_price_eth)
          : 1
      )
    }
  }

  if ('to_address' in row) {
    if (
      row.to_address &&
      realAddress.value.toLowerCase?.() === row.to_address.toLowerCase?.()
    ) {
      return row.to_amount * (
        needPrice ? Number(isVolUSDT ? row.to_price_usd : row.to_price_eth)
          : 1
      )
    }
  }
  return 0
}

function hasNewAccount(row: (GetPairLiqResponse | IGetTokenTxsResponse) & { senderProfile?: Profile }) {
  if (row?.newTags?.some?.(i => i?.type === '8')) {
    return false
  }
  if (
    realAddress.value.toLowerCase?.() === row.senderProfile?.token0Address?.toLowerCase?.()
  ) {
    return row.senderProfile?.token0HasNewAccount
  } else {
    return row.senderProfile?.token1HasNewAccount
  }
}

function hasClearedAccount(row: (GetPairLiqResponse | IGetTokenTxsResponse) & { senderProfile?: Profile }) {
  if (isBuy(row) || row.newTags?.some?.(i => i?.type === '8')) {
    return false
  }
  if (
    realAddress.value.toLowerCase?.() === row.senderProfile?.token0Address?.toLowerCase?.()
  ) {
    return row.senderProfile?.token0HasClearedAccount
  } else {
    return row.senderProfile?.token1HasClearedAccount
  }
}

function bigWallet(row: (GetPairLiqResponse | IGetTokenTxsResponse) & { senderProfile?: Profile }) {
  if (row?.newTags?.some?.(i => i.type === '8')) {
    return false
  }
  return Number(row.senderProfile?.solTotalHolding) > 50
}

function getGradient(row: IGetTokenTxsResponse) {
  const str = `${useThemeStore().isDark}-${isBuy(row)}`
  const map = {
    'true-true': 'bg-[linear-gradient(270deg,#111_0%,#12654C_70%,#12B886_100%)]',
    'true-false': 'bg-[linear-gradient(270deg,#111_0%,#7F2A36_70%,#F6465D_100%)]',
    'false-false': 'bg-[linear-gradient(270deg,#FFF_0%,#88DBC3_70%,#12B886_100%)]',
    'false-true': 'bg-[linear-gradient(270deg,#FFF_0%,#FBA2AE_70%,#F6465D_100%)]',
  } as { [key: string]: string }
  return map[str]
}

function openMarkerTooltip(row: IGetTokenTxsResponse & { senderProfile: Profile }, e: MouseEvent) {
  if (row && MAKER_SUPPORT_CHAINS.includes(row.chain)) {
    makerTooltip.value = e.currentTarget
    if (currentRow.value?.wallet_address === row.wallet_address) {
      return
    }
    currentRow.value = row
  }
}

function goBrowser(row: IGetTokenTxsResponse) {
  window.open(
    formatExplorerUrl(row.chain, row.transaction, 'tx')
  )
}

const tabsContainer = ref<HTMLElement | null>(null)
function setActiveTab(val: string,index:number) {
  activeTab.value = val
  if (val === '-100' && !botStore.evmAddress) {
    throw new Error('')
  }
  txCount.value = {}
  tableFilter.value.tag_type = val
  if (val !== 'liquidity') {
    _getTokenTxs()
  } else {
    _getPairLiq()
  }
  scrollTabToCenter(tabsContainer,index)
}

function setMakerAddress(address: string) {
  txCount.value = {}
  tableFilter.value.markerAddress = tableFilter.value.markerAddress ? '' : address
  _getTokenTxs()
}

function onRowClick({ rowData }: RowEventHandlerParams) {
  if (!token.value) {
    return
  }
  if (SupportFullDataChain.includes(token.value.chain)) {
    const { symbol, logo_url, chain, token: _token } = token.value
    const { target_token, token0_address, token0_symbol, token1_symbol, pair: pairAddress } = pair.value!
    tokenDetailSStore.$patch({
      drawerVisible: true,
      tokenInfo: {
        id: route.params.id! as string,
        symbol,
        logo_url,
        chain,
        address: _token,
        remark: rowData.remark!,
      },
      pairInfo: {
        target_token,
        token0_address,
        token0_symbol,
        token1_symbol,
        pairAddress
      },
      user_address: rowData.wallet_address
    })
  } else {
    window.open(formatExplorerUrl(token.value.chain, rowData.transaction, 'tx'))
  }

}

function resetMakerAddress() {
  txCount.value = {}
  tableFilter.value.markerAddress = ''
  _getTokenTxs()
}
</script>

<template>
  <div class="transactions">
    <div class="px-12px mb-10px flex justify-between">
      <div
        ref="tabsContainer"
        class="flex items-center whitespace-nowrap w-[80%] overflow-x-auto scrollbar-hide"
      >
        <a
          v-for="(item,index) in tabs" :key="item.value" href="javascript:;" :class="`decoration-none shrink-0 text-12px lh-16px text-center color-[--d-666-l-999] px-12px py-4px rounded-4px
         ${activeTab === item.value ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]' : ''}`"
          @click="setActiveTab(item.value,index)">
          {{ item.label }}
        </a>
      </div>
      <div v-show="isPausedTxs" class="flex items-center color-#FFA622 text-12px">
        <Icon name="custom:stop" />
        <span class="ml-3px">{{ $t('paused') }}</span>
      </div>
    </div>
    <template v-if="tableFilter.markerAddress">
      <div
        v-if="listStatus.loadingTxs || listStatus.loadingLiq"
        class="lh-20px text-13px py-6px bg-#3F80F71A text-center mb-12px">
        {{ $t('loading') }}
      </div>
      <template v-else>
        <div class="lh-20px text-13px py-6px bg-#3F80F71A text-center mb-12px flex justify-center">
          <div
            v-html="$t('filterTip', {
            address: `<span class='color-#3F80F7'>&nbsp;${tableFilter.markerAddress.slice(0, 4)}...${tableFilter.markerAddress.slice(-4)}&nbsp;</span>`,
            count: `<span>&nbsp;${filterTableList[0]?.count || 0}&nbsp;</span>`
          })" />
          <span class='color-#3F80F7 decoration-underline cursor-pointer ml-2px' @click.stop="resetMakerAddress">
            {{ $t('filterCancel') }}
          </span>
        </div>
        <UserTxsFilterHead
          :makerAddress="tableFilter.markerAddress" :isLiquidity="isLiquidity" :pairLiq="pairLiq"
          :isBuy="isBuy" :getAmount="getAmount" :getPrice="getPrice" :chain="addressAndChain.chain"
          :tagType="tableFilter.tag_type"
          :tokenTxs="tokenTxs"
        />
      </template>
    </template>
    <div
      v-loading="listStatus.loadingTxs || listStatus.loadingLiq" class="text-12px"
      element-loading-background="transparent">
      <AveTable
        ref="aveTableRef"
        rowKey="uuid"
        fixed :data="filterTableList"
        :columns="columns"
        :style="{
          height:`${finalHeight}px`
        }"
        row-class='cursor-pointer'
        :rowEventHandlers="{
        onMouseenter:()=>isHoverTable=true,
        onMouseleave:()=>isHoverTable=false,
        onClick: onRowClick
      }">
        <template #header-time>
          <div class="flex items-center gap-2px">
            <span>{{ $t('time') }}</span>
            <Icon
              :name="`${tableView.isShowDate ? 'custom:calendar' : 'custom:countdown'}`"
              class="color-[--d-666-l-999] cursor-pointer" @click.self="tableView.isShowDate = !tableView.isShowDate" />
            <TableDateFilter
              v-model:visible="tableFilterVisible.timestamp" :modelValue="tableFilter.timestamp"
              @confirm="onTimestampConfirm" />
          </div>
        </template>
        <template #cell-time="{ row,rowIndex }">
          <TimerCount
            v-if="!tableView.isShowDate && row.time && Number(formatTimeFromNow(row.time, true)) < 60"
            :key="`${row.time}${rowIndex}`" :timestamp="row.time" :end-time="60">
            <template #default="{ seconds }">
              <span class="color-[--d-999-l-666]">
                <template v-if="seconds < 60">
                  {{ seconds }}s
                </template>
                <template v-else>
                  {{ formatTimeFromNow(row.time) }}
                </template>
              </span>
            </template>
          </TimerCount>
          <span v-else class="color-[--d-999-l-666]">
            {{
              tableView.isShowDate
                ? formatDate(row.time, 'HH:mm:ss')
                : formatTimeFromNow(row.time)
            }}
          </span>
        </template>
        <template #cell-type="{ row }">
          <div :class="getRowColor(row)">
            <span v-if="row.type !== undefined">
              <template v-if="row.type == 'removeLiquidity'">
                {{ $t('removeLiq') }}
              </template>
              <template v-else-if="row.type == 'addLiquidity'">
                {{ $t('addLiq') }}
              </template>
              <template v-else-if="row.type == 'CollectFee'">
                {{ $t('CollectFee') }}
              </template>
              <template v-else>
                {{ row.type }}
              </template>
            </span>
            <span v-else-if="isBuy(row)">{{ $t('buy') }}</span>
            <span v-else>{{ $t('sell') }}</span>
          </div>
        </template>
        <template #header-swapPrice>
          <div class="flex items-center gap-2px">
            <span>{{ $t('swapPrice') }}</span>
            <!--<Icon-->
            <!--  :name="`${tableView.isSwapPriceUSDT?'custom:u':'custom:b'}`"-->
            <!--  class="color-[&#45;&#45;d-666-l-999] cursor-pointer"-->
            <!--  @click.self="tableView.isSwapPriceUSDT=!tableView.isSwapPriceUSDT"-->
            <!--/>-->
          </div>
        </template>
        <template #cell-swapPrice="{ row }">
          <template v-if="row.type !== undefined">- -</template>
          <div v-else :class="getRowColor(row)">
            <!--<template v-if="tableView.isSwapPriceUSDT">-->
            ${{ formatNumber(getPrice(row), 4) }}
            <!--</template>-->
            <!--<template v-else>-->
            <!--  {{ formatNumber(getPrice(row, true), 4) }}-->
            <!--  <span class="color-[&#45;&#45;d-999-l-666]">{{ getChainInfo(row.chain)?.main_name }}</span>-->
            <!--</template>-->
          </div>
        </template>
        <template #cell-amountB="{ row }">
          <span v-if="row.type === undefined" :class="getRowColor(row)">
            {{ formatNumber(getAmount(row), 2) }}
          </span>
          <div v-else>
            <div :class="getRowColor(row)">
              {{ formatNumber(row.amount0 || 0) }}
              <span class="color-[--d-999-l-666]">
                {{ row.token0_symbol }}
              </span>
            </div>
            <div :class="getRowColor(row)">
              {{ formatNumber(row.amount1 || 0) }}
              <span class="color-[--d-999-l-666]">
                {{ row.token1_symbol }}
              </span>
            </div>
          </div>
        </template>
        <template #header-amountU>
          <div class="flex items-center gap-2px">
            <span>{{ $t('amountU') }}</span>
            <Icon
              name="custom:price"
              :class="`${tableView.isVolUSDT ? 'color-[--d-666-l-999]' : 'color-[--d-999-l-666]'} cursor-pointer`"
              @click.self="tableView.isVolUSDT = !tableView.isVolUSDT" />
            <VolFilter
              v-model:visible="tableFilterVisible.amountU" :modelValue="tableFilter.amountU"
              @confirm="confirmVolFilter" />
          </div>
        </template>
        <template #cell-amountU="{ row }">
          <div
            v-if="row.type === undefined" :class="`absolute h-full ${getGradient(row)} opacity-15`"
            :style="`width:${Math.min(getAmount(row, true, true) / 20, 100)}%`" />
          <div v-if="row.type === undefined" :class="`${getRowColor(row)} w-full h-full flex items-center justify-end`">
            <template v-if="tableView.isVolUSDT">
              ${{ formatNumber(getAmount(row, true, true), 2) }}
            </template>
            <template v-else>
              ${{ formatNumber(getAmount(row, true, false), 3) }}
              <span class="color-[--d-999-l-666]">
                &nbsp;{{ getChainInfo(row.chain)?.main_name }}
              </span>
            </template>
          </div>
          <div v-else :class="getRowColor(row)">
            <template v-if="tableView.isVolUSDT">
              ${{ formatNumber(row.amount0 * row.token0_price_usd + row.amount1 * row.token1_price_usd, 2) }}
            </template>
            <template v-else>
              {{ formatNumber(row.amount0 * row.token0_price_eth + row.amount1 * row.token1_price_eth, 2) }}
              <span class="color-[--d-999-l-666]">
                {{ getChainInfo(row.chain)?.main_name }}
              </span>
            </template>
          </div>
        </template>
        <template #header-makers>
          <span class="mr-2px">{{ $t('makers') }}</span>
          <MakersFilter
            v-model:visible="tableFilterVisible.markers" :modelValue="tableFilter.markerAddress"
            :chain="addressAndChain.chain" @confirm="confirmMakersFilter" />
        </template>
        <template #cell-makers="{ row }">
          <template v-if="['solana', 'bsc'].includes(row.chain) && row.senderProfile">
            <Icon
              v-if="hasNewAccount(row)"
              v-tooltip="{ content: `<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' }}"
              name="custom:new-account"
              class="mr-3px shrink-0"/>
            <Icon
              v-if="hasClearedAccount(row)" 
              v-tooltip="{ content: `<span style='color: #EB2B4B'>${$t('sellAl')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
              name="custom:cleared-account" class="mr-3px shrink-0"/>
            <Icon
              v-tooltip="{ content: `<span style='color: #ccc'>${$t('whales')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
              name="custom:big" class="mr-3px shrink-0"/>
          </template>
          <SignalTags
            tagClass="mr-3px" :tags="(row.newTags||[]).map((el: any)=>tagStore.matchTag(el.type))"
                      :walletAddress="row.wallet_address" :chain="row.chain"/>
          <div :key="row.wallet_address" class="flex items-center gap-4px">
            <UserRemark
              :remark="row.remark"
              :address="row.wallet_address"
              :maxRemarkLength="8"
              :chain="row.chain"
              :wallet_logo="row.wallet_logo" class="color-[--d-999-l-666]"
              :mouseoverAddress="e => openMarkerTooltip(row, e)"
            >
              <div v-if="row.count && row.count > 1">
                ({{ row.count }})
              </div>
            </UserRemark>
            <Icon
              name="custom:filter"
              :class="`${tableFilter.markerAddress ? 'color-[--d-999-l-666]' : 'color-[--d-666-l-999]'} cursor-pointer text-10px shrink-0`"
              @click.self.stop="setMakerAddress(row.wallet_address)" />
          </div>
        </template>
        <template #cell-SOLBalance="{ row }">
          <span v-if="row.senderProfile" class="color-[--d-999-l-666]">
            {{ formatNumber(row.senderProfile?.solTotalHolding || 0, 2) }}
          </span>
        </template>
        <template #cell-DEX="{ row }">
          <div class="flex justify-end gap-8px">
            <img
              v-if="row.amm === 'unknown'" v-tooltip="getSwapInfo(row.chain, row.amm)?.show_name"
              class="w-16px h-16px cursor-pointer rounded-full" :src="IconUnknown" alt="">
            <img
              v-else
              v-tooltip="getSwapInfo(row.chain, row.amm)?.show_name"
              class="w-16px h-16px cursor-pointer rounded-full"
              :src="formatIconSwap(row.amm)" alt="" @click.stop.self="goBrowser(row)">
            <Icon
              name="custom:browser" class="text-16px color-[--d-666-l-999] cursor-pointer"
              @click.stop.self="goBrowser(row)" />
          </div>
        </template>
      </AveTable>
      <MarkerTooltip
        :virtual-ref="makerTooltip" :currentRow="currentRow" :addressAndChain="addressAndChain"
        v-model="markerTooltipVisible"
      >
        <template v-if="['solana', 'bsc'].includes(currentRow.chain) && currentRow.senderProfile">
          <Icon
            v-if="hasNewAccount(currentRow)"
            v-tooltip.raw="`<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`" name="custom:new-account"
            class="mr-3px" />
          <Icon
            v-if="hasClearedAccount(currentRow)"
            v-tooltip.raw="`<span style='color: #EB2B4B'>${$t('sellAl')}</span>`" name="custom:cleared-account"
            class="mr-3px" />
          <Icon
            v-if="bigWallet(currentRow)" v-tooltip.raw="`<span style='color: #C5842B'>${$t('whales')}</span>`"
            name="custom:big" />
        </template>
        <SignalTags
          tagClass="mr-3px" :tags="currentRow.newTags" :walletAddress="currentRow.wallet_address"
          :chain="currentRow.chain" />
      </MarkerTooltip>
    </div>
  </div>
</template>

<style></style>
