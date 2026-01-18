<script setup lang="ts">
import TableDateFilter from './tableDateFilter.vue'
import VolFilter from './volFilter.vue'
import MakersFilter from './makersFilter.vue'
import MarkerTooltip from './markerTooltip.vue'
import UserTxsFilterHead from './userTxsFilterHead.vue'
import type { RowEventHandlerParams } from 'element-plus'
import { deleteAttention, addAttention2 } from '~/api/attention'
import {filterLanguage} from '~/pages/token/components/kLine/utils'
import {
  getPairLiq,
  type GetPairLiqResponse,
  type IGetTokenTxsResponse,
  type IGetSimpleTxsResponse,
  getTokenTxs,
  getSimpleTxs,
  type Profile
} from '~/api/token'
import {formatDate, formatTimeFromNow, getAddressAndChainFromId, getChainInfo, uuid} from '~/utils'

import {useThrottleFn} from '@vueuse/core'

import IconUnknown from '@/assets/images/icon-unknown.png'
import type {AveTable} from '#components'
import type { SimpleWSTx } from '../../kLine/types'
import BigNumber from 'bignumber.js'
import DateFilterCard from '../../dateFilterCard.vue'
// import type { content } from 'html2canvas/dist/types/css/property-descriptors/content'
const globalStore = useGlobalStore()
const klineDateFilter = inject<Ref<string[]>>(ProvideType.KLINE_DATE_FILTER)
// 订单簿状态 - 通过 provide/inject 与父组件通信
const orderBookVisible = inject<Ref<boolean>>('orderBookVisible', ref(false))
const $refs = ref({
  buttonRefs: {} as Record<number, any>
})

// const MAKER_SUPPORT_CHAINS = ['solana', 'bsc']
const { t } = useI18n()
const {totalHolders, pairAddress, token, pair, commonHeight} = storeToRefs(useTokenStore())
const tokenDetailSStore = useTokenDetailsStore()
const botStore = useBotStore()
const wsStore = useWSStore()
const tagStore = useTagStore()
const route = useRoute()
const aveTableRef = ref<InstanceType<typeof AveTable> | null>(null)
const firstActivated = ref(true)
const followStore = useFollowStore()
const themeStore = useThemeStore()
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
      // console.log(i.type)
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
  {
    label: t('followed')+ `(${(globalStore.headFollowsNum.all)})`,
    value: '-100'
  },
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
const txsContainer = useTemplateRef('txs-container')
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
const tokenTxs = shallowRef<IGetSimpleTxsResponse[]>([])
const wsPairCache = shallowRef<IGetSimpleTxsResponse[]>([])
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
  let tableList: ((IGetSimpleTxsResponse | GetPairLiqResponse) & { count?: number })[] = []
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
  // isVolUSDT: true
})
const tableFilterVisible = ref({
  timestamp: false,
  amountU: false,
  markers: false
})
const makerTooltip = ref()
const markerTooltipVisible = shallowRef(false)
const currentRow = shallowRef<IGetSimpleTxsResponse & { senderProfile: Profile, maker_bal?: number }>({} as any)
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

watch(() => klineDateFilter?.value, (val) => {
  if (val && !orderBookVisible.value) {
    tableFilter.value.timestamp = val
    _getTokenTxs()
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

watch(() => followStore.currentAddress, () => {
  if (activeTab.value === '-100') {
    _getTokenTxs()
  }
})

watch(orderBookVisible,(val,oldVal)=>{
  if(oldVal && !val){
    resetCache()
    tableFilter.value.markerAddress = ''
    _getTokenTxs()
  }
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
  const { timestamp, markerAddress } = tableFilter.value
  const [startTime, endTime] = timestamp || []
  if(startTime && data.tx.time < Number(startTime)){
    return
  }
  if(endTime && data.tx.time > Number(endTime)){
    return
  }
  if(markerAddress && wallet_address !== markerAddress){
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

watch(() => wsStore.wsResult[WSEventType.SIMPLE_TX], data => {
  if (!data || listStatus.value.loadingTxs || ignoreWs.value) {
    return
  }
  const simpleWSTx = data.msg as SimpleWSTx
  const {maker, target} = simpleWSTx
  // 不是当前币种的数据
  if (target !== realAddress.value) {
    return
  }
  // 先把加减池子过滤掉
  if(!['buy','sell'].includes(simpleWSTx.direction)) {
    return
  }
  const { timestamp, markerAddress } = tableFilter.value
  const [startTime, endTime] = timestamp || []
  if(startTime && simpleWSTx.time < Number(startTime)){
    return
  }
  if(endTime && simpleWSTx.time > Number(endTime)){
    return
  }
  if(markerAddress && maker !== markerAddress){
    return
  }
  txCount.value[maker] = (txCount.value[maker] || 0) + 1
  const { topN, wallet_tag } = getWalletTag(data.msg)
  const newTags = getSimpleTxTags(simpleWSTx.tag)
  const item = {
    ...simpleWSTx,
    topN, wallet_tag,
    count: txCount.value[maker],
    time: Math.min(Math.floor(Date.now() / 1000), simpleWSTx.time),
    uuid: uuid(),
    wallet_address: maker,
    transaction: simpleWSTx.txhash,
    senderProfile: {
      solTotalHolding: simpleWSTx.maker_eth
    },
    newTags
  }
  console.log('交易推送item',maker, item.maker_type)
  wsPairCache.value.unshift(item as any)
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
  tokenTxs.value = tokenTxs.value.slice(0,1000)
  wsPairCache.value.length = 0
  triggerRef(tokenTxs)
}, 100)

const updateLiqList = useThrottleFn(() => {
  pairLiq.value.unshift(...wsLiqCache.value)
  wsLiqCache.value.length = 0
  triggerRef(pairLiq)
}, 100)

function onTimestampConfirm(timestamp: string[] = []) {
  tableFilterVisible.value.timestamp = false
  tableFilter.value.timestamp = timestamp
  _getTokenTxs()
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

function transferTxs(row: IGetSimpleTxsResponse) {
  const newTags = row.maker_type
  return {
    ...row,
    isSimple: true,
    chain:addressAndChain.value.chain,
    id:row.page_token,
    // amm:row.amm,
    wallet_address:row.maker,
    newTags:
  }
}


async function _getTokenTxs() {
  try {
    listStatus.value.loadingTxs = true
    const { tag_type } = tableFilter.value
    const getPairTxsParams = {
      token_id: route.params.id as string,
      tag_type,
      maker: tableFilter.value.markerAddress,
      time_min:tableFilter.value.timestamp[0],
      time_max:tableFilter.value.timestamp[1]
    }
    if (tag_type === '-100' && !followStore.currentAddress) {
      tokenTxs.value = []
      listStatus.value.loadingTxs = false
      return
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
    console.log('_getTokenTxs res1', res)
    await getSimpleTxs(pairAddress.value + '-' + addressAndChain.value.chain,getPairTxsParams)
    // const res = await getSimpleTxs(pairAddress.value + '-' + addressAndChain.value.chain,getPairTxsParams)
    // console.log('=>(transactions.vue:62) res', res)
    // realAddress.value = getAddressAndChainFromId(getPairTxsParams.token_id).address
    // tokenTxs.value = (res || []).reverse().map(val => {
    //   txCount.value[val.maker] = (txCount.value[val.maker] || 0) + 1
    //   const { wallet_tag, topN } = getWalletTag(val)
    //   return {
    //     ...val,
    //     wallet_tag,
    //     topN,
    //     count: txCount.value[val.maker],
    //     senderProfile: JSON.parse(val.profile || '{}'),
    //     uuid: uuid()
    //   }
    // }).reverse()
  } catch (e) {
    tokenTxs.value = []
    console.log('=>(transactions.vue:62) e', e)
  } finally {
    listStatus.value.loadingTxs = false
  }
}

function getSimpleTxTags(tag?:string) {
  if(tag){
    const wallet_tag = tag.split(',')
    const tagsMap = {
      MEVBot:{
        type:'8'
      }
    }
    return wallet_tag.map(el => tagsMap[el]).filter(el=> !!el)
  }
}

function getWalletTag(val: IGetSimpleTxsResponse) {
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

function isBuy(row: GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx) {
  if ('direction' in row && 'target' in row) {
    return row.direction === 'buy'
  }
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

function getRowColor(row: GetPairLiqResponse | IGetSimpleTxsResponse) {
  if ('type' in row) {
    if (row.type === 'addLiquidity') {
      return 'color-#65C4ED'
    } else if (row.type === 'removeLiquidity' || row.type === 'CollectFee') {
      return 'color-#EF6DE2'
    }
  }
  return isBuy(row) ? 'color-#12B886' : 'color-#FF646D'
}

function getPrice(row: GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx, isShowToken = false) {
  // route.params。id 同步更改，而接口异步请求，此时更新该值变成了 0
  const tokenAddress = realAddress.value
  if ('direction' in row && 'target' in row) {
    return row.price_u
  }
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

function getAmount(row: GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx, needPrice = false, isVolUSDT = false) {
  if ('direction' in row && 'target' in row) {
    return Number(row.target_amt || 0) * (
        needPrice ? Number(isVolUSDT ? row.price_u : row.price_m)
          : 1
      )
  }
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

function hasNewAccount(row: (GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx) & { senderProfile?: Profile }) {
  if ('direction' in row && 'target' in row) {
    return row.direction === 'buy' && new BigNumber(row.maker_bal).eq(row.target_amt)
  }
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

function hasClearedAccount(row: (GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx) & { senderProfile?: Profile }) {
  if ('direction' in row && 'target' in row) {
    return row.direction === 'sell' && new BigNumber(row.maker_bal).eq(0)
  }
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

function bigWallet(row: (GetPairLiqResponse | IGetSimpleTxsResponse | SimpleWSTx) & { senderProfile?: Profile }) {
  if ('maker_eth' in row) {
    return Number(row.maker_eth || 0) >= 50
  }
  if (row?.newTags?.some?.(i => i.type === '8')) {
    return false
  }
  return Number(row.senderProfile?.solTotalHolding) > 50
}

function getGradient(row: IGetSimpleTxsResponse) {
  const str = `${useThemeStore().isDark}-${isBuy(row)}`
  const map = {
    'true-true': 'bg-[linear-gradient(270deg,#111_0%,#12654C_70%,#12B886_100%)]',
    'true-false': 'bg-[linear-gradient(270deg,#111_0%,#7F2A36_70%,#F6465D_100%)]',
    'false-false': 'bg-[linear-gradient(270deg,#FFF_0%,#88DBC3_70%,#12B886_100%)]',
    'false-true': 'bg-[linear-gradient(270deg,#FFF_0%,#FBA2AE_70%,#F6465D_100%)]',
  } as { [key: string]: string }
  return map[str]
}

function openMarkerTooltip(row: IGetSimpleTxsResponse & { senderProfile: Profile }, e: MouseEvent) {
  if (row && SupportFullDataChain.includes(row.chain)) {
    makerTooltip.value = e.currentTarget
    if (currentRow.value?.wallet_address === row.wallet_address) {
      return
    }
    currentRow.value = row
  }
}

function goBrowser(row: IGetSimpleTxsResponse) {
  window.open(
    formatExplorerUrl(row.chain, row.transaction, 'tx')
  )
}

const tabsContainer = ref<HTMLElement | null>(null)
function setActiveTab(val: string,index:number) {
  activeTab.value = val
  // if (val === '-100' && !followStore.currentAddress) {
  //   return
  // }
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

const collect = async (row: any,index:number) => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }
  console.log('collect',row,index)
  if(row.is_wallet_address_fav !== 1){
    useFollowStore().confirmAttention($refs.value.buttonRefs[index],row.chain, (form) => {
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: row.wallet_address,
        user_chain: row.chain,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then((res) => {
        // getList()
        globalStore.getFollowsNum()
        filterTableList.value.forEach((item: any) => {
          if (item.wallet_address === row.wallet_address) {
            item['is_wallet_address_fav'] = 1
          }
        })
        triggerRef(tokenTxs)
        return Promise.resolve(res)
      }).catch((err) => {
        return Promise.reject(err)
      })
    })
    return
  }
  // loading.value = true
  deleteAttention({
    address: useFollowStore().currentAddress,
    user_address: row.wallet_address,
    user_chain: row.chain
  }).then(() => {
    globalStore.getFollowsNum()
    ElMessage.success( t('attention1Canceled'))
    // getList()
    filterTableList.value.forEach((item: any) => {
      if (item.wallet_address === row.wallet_address) {
        item['is_wallet_address_fav'] = 0
      }
    })
    triggerRef(tokenTxs)
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    // loading.value = false
  })
}
</script>

<template>
  <div ref="txs-container" class="transactions">
    <div class="px-12px mb-10px flex justify-between">
      <div
        ref="tabsContainer"
        class="flex items-center whitespace-nowrap w-[80%] overflow-x-auto scrollbar-hide"
      >
      <template v-for="(item,index) in tabs" :key="item.value">
        <a
          v-if="holdersTooltip(t)[item.type]"
          v-tooltip="holdersTooltip(t)[item.type]"
          href="javascript:;"
          :class="`decoration-none shrink-0 text-12px lh-16px text-center px-12px py-4px rounded-4px
         ${activeTab === item.value ? 'bg-[--border] color-[--main-text]' : 'color-[--third-text]'}`" @click="setActiveTab(item.value,index)">
          {{ item.label }}
        </a>
        <a
          v-else
          href="javascript:;"
          :class="`decoration-none shrink-0 text-12px lh-16px text-center px-12px py-4px rounded-4px
         ${activeTab === item.value ? 'bg-[--border] color-[--main-text]' : 'color-[--third-text]'}`" @click="setActiveTab(item.value,index)">
          {{ item.label }}
        </a>
      </template>
      </div>
      <div class="flex items-center gap-12px">
        <div v-show="isPausedTxs" class="flex items-center color-#FFA622 text-12px">
          <Icon name="custom:stop" />
          <span class="ml-3px">{{ $t('paused') }}</span>
        </div>
        <span v-tooltip="$t(globalStore.isClickKlineFilter?'clickChartHideFilter':'clickChartFilter')" class="flex items-center justify-center w-12px h-12px rounded-2px color-[--reverse-color] text-10px cursor-pointer" :class="globalStore.isClickKlineFilter?'bg-[--primary-color]':'bg-[--third-text] hover:bg-[--secondary-text]'" @click="globalStore.isClickKlineFilter=!globalStore.isClickKlineFilter"><Icon name="custom:chart"/></span>
      </div>
    </div>
    <DateFilterCard v-if="tableFilter.timestamp.length&&tableFilter.timestamp[0]&&tableFilter.timestamp[1]" v-model:timestamp="tableFilter.timestamp" @update:timestamp="_getTokenTxs"/>
    <template v-if="tableFilter.markerAddress">
      <div
        v-if="listStatus.loadingTxs || listStatus.loadingLiq"
        class="lh-20px text-13px py-6px bg-#3F80F71A text-center mb-12px">
        {{ $t('loading') }}
      </div>
      <template v-else>
        <div class="lh-20px text-13px py-6px bg-#3F80F71A text-center mb-12px flex justify-center text-[--third-text]">
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
        <template  #empty>
          <div v-if="!(listStatus.loadingTxs || listStatus.loadingLiq)" class="h-full flex flex-col items-center justify-center pt-100px">
            <img v-if="themeStore.theme==='light'" src="@/assets/images/empty-white.svg" alt="">
            <img v-else src="@/assets/images/empty-black.svg" alt="">
            <span
              class="mt-10px color-[--third-text]"
            >
              {{ t('emptyNoData') }}
            </span>
          </div>
          <span v-else/>
        </template>
        <template #header-time>
          <div class="flex items-center gap-2px">
            <span>{{ $t('time') }}</span>
            <Icon
              :name="`${tableView.isShowDate ? 'custom:calendar' : 'custom:countdown'}`"
              class="color-[--third-text] cursor-pointer" @click.self="tableView.isShowDate = !tableView.isShowDate" />
            <TableDateFilter
              v-model:visible="tableFilterVisible.timestamp" :modelValue="tableFilter.timestamp" :boundary="txsContainer || undefined"
              @confirm="onTimestampConfirm" />
          </div>
        </template>
        <template #cell-time="{ row,rowIndex }">
          <TimerCount
            v-if="!tableView.isShowDate && row.time && Number(formatTimeFromNow(row.time, true)) < 60"
            :key="`${row.time}${rowIndex}`" :timestamp="row.time" :end-time="60">
            <template #default="{ seconds }">
              <span class="color-[--secondary-text]">
                <template v-if="seconds < 60">
                  {{ seconds }}s
                </template>
                <template v-else>
                  {{ formatTimeFromNow(row.time) }}
                </template>
              </span>
            </template>
          </TimerCount>
          <span v-else class="color-[--secondary-text]">
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
              <template v-else-if="row.type == 'CreatePair'">
                {{ $t('CreatePair') }}
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
              <span class="color-[--secondary-text]">
                {{ row.token0_symbol }}
              </span>
            </div>
            <div :class="getRowColor(row)">
              {{ formatNumber(row.amount1 || 0) }}
              <span class="color-[--secondary-text]">
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
              :class="`${globalStore.isUSDT ? 'color-[--third-text]' : 'color-[--primary-color]'} cursor-pointer`"
              @click.self="globalStore.isUSDT = !globalStore.isUSDT" />
            <VolFilter
              v-model:visible="tableFilterVisible.amountU" :modelValue="tableFilter.amountU"
              @confirm="confirmVolFilter" />
          </div>
        </template>
        <template #cell-amountU="{ row }">
          <div
            v-if="row.type === undefined" :class="`absolute h-full ${getGradient(row)} opacity-15`"
            :style="`width:${Math.min(getAmount(row, true, true) / (addressAndChain.chain === 'solana' ? 10 : 20), 100)}%`" />
          <div v-if="row.type === undefined" :class="`${getRowColor(row)} w-full h-full flex items-center justify-end`">
            <template v-if="globalStore.isUSDT">
              ${{ formatNumber(getAmount(row, true, true), 2) }}
            </template>
            <template v-else>
              {{ formatNumber(getAmount(row, true, false), 3) }}
              <span class="color-[--secondary-text]">
                &nbsp;{{ getChainInfo(row.chain)?.main_name }}
              </span>
            </template>
          </div>
          <div v-else :class="getRowColor(row)">
            <template v-if="globalStore.isUSDT">
              ${{ formatNumber(row.amount0 * row.token0_price_usd + row.amount1 * row.token1_price_usd, 2) }}
            </template>
            <template v-else>
              {{ formatNumber(row.amount0 * row.token0_price_eth + row.amount1 * row.token1_price_eth, 2) }}
              <span class="color-[--secondary-text]">
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
        <template #cell-makers="{ row , rowIndex}">
          <template v-if="['solana', 'bsc'].includes(row.chain)  && (row.senderProfile || row.maker_bal)">
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
              v-if="bigWallet(row)"
              v-tooltip="{ content: `<span style='color: #ccc'>${$t('whales')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
              name="custom:big" class="mr-3px shrink-0"/>
          </template>
          <SignalTags
            tagClass="mr-3px" :tags="(row.newTags||[]).map((el: any)=>tagStore.matchTag(el.type)||el)"
                      :walletAddress="row.wallet_address" :chain="row.chain"/>
          <div :key="row.wallet_address" class="flex items-center gap-4px">
            <UserRemark
              :remark="row.remark"
              :address="row.wallet_address"
              :addressClass="markerTooltipVisible && currentRow.wallet_address===row.wallet_address?'bg-#12B88633':''"
              :maxRemarkLength="8"
              :chain="row.chain"
              :wallet_logo="row.wallet_logo" class="color-[--secondary-text]"
              :mouseoverAddress="e => openMarkerTooltip(row, e)"
            >
              <div v-if="row.count && row.count > 1">
                ({{ row.count }})
              </div>
            </UserRemark>
            <Icon
              :ref="(el: any) => $refs.buttonRefs[rowIndex] = el" name="custom:attention"
              :class="row.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[--third-text]'" class="h-16px w-16px clickable shrink-0" @click.stop.prevent="collect(row,rowIndex)" />
            <Icon
              name="custom:filter"
              :class="`${tableFilter.markerAddress ? 'color-[--secondary-text]' : 'color-[--third-text]'} cursor-pointer text-10px shrink-0`"
              @click.self.stop="setMakerAddress(row.wallet_address)" />
          </div>
        </template>
        <template #cell-SOLBalance="{ row }">
          <span v-if="row.senderProfile" class="color-[--secondary-text]">
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
              name="custom:browser" class="text-16px color-[--third-text] cursor-pointer"
              @click.stop.self="goBrowser(row)" />
          </div>
        </template>
      </AveTable>
      <MarkerTooltip
        v-model="markerTooltipVisible" :virtual-ref="makerTooltip" :currentRow="currentRow"
        :addressAndChain="addressAndChain"
      >
        <template v-if="['solana', 'bsc'].includes(currentRow.chain) && (currentRow.senderProfile || currentRow.maker_bal)">
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

<style scoped lang="scss">
:deep(.el-table-v2__header-cell){
  padding: 0 12px;
}
:deep(.el-table-v2__row-cell){
  padding: 0 12px;
}
</style>
