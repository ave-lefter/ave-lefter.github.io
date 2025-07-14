<template>
  <div v-if="modelValue" class="bg-[--d-111-l-FFF] rounded-2px text-14px pt-12px flex flex-col overflow-hidden" :style="{ height: `${klineHeight || 200}px` }">
    <!-- 标题栏 -->
    <div class="flex items-center px-12px gap-20px mb-12px">
      <div class="flex items-center gap-4px">
        <span class="text-lg color-[--d-E9E9E9-l-222]">{{ t('trades') }}</span>
        <Icon v-show="isPausedTxs" name="custom:stop" class="text-lg" />
      </div>
      <div class="flex-1" />
      <div class="flex items-center gap-8px">
        <button
          v-if="botStore?.userInfo?.name"
          class="me-btn flex items-center gap-4px"
          :class="{ 'active': isMeActive }"
          @click="toggleClickMe"
        >
          <Icon name="i-tdesign:user-filled" class="text-md" />
          <span>{{ t('me') }}</span>
        </button>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="px-12px mb-10px">
      <div
        ref="tabsContainer"
        class="flex items-center gap-8px whitespace-nowrap overflow-x-auto scrollbar-hide"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.value"
          :class="[
            'shrink-0 text-12px px-12px py-4px rounded-4px border-none cursor-pointer',
            activeTab === tab.value
              ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333]'
              : 'bg-transparent color-[--d-999-l-666]'
          ]"
          @click="setActiveTab(tab.value, index)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 表格 -->
    <div class="px-12px">
      <div v-loading="listStatus.loadingTxs" class="text-12px">
        <!-- 表格头部 -->
        <div class="grid grid-cols-4 gap-8px py-8px border-b-1px border-b-solid border-b-[rgba(255,255,255,.03)] text-12px color-[--d-999-l-666]">
          <div class="text-left flex items-center gap-2px">
            {{ tableView.isAmount ? t('amountB') : t('swapPrice') }}
            <Icon
              name="i-f7:money-dollar-circle-fill"
              :class="`${tableView.isAmount ? 'color-[--d-666-l-999]' : 'color-[--d-999-l-666]'} text-md cursor-pointer`"
              @click="tableView.isAmount = !tableView.isAmount"
            />
          </div>
          <div class="text-center">
            <div class="flex items-center justify-center gap-2px">
              <span>{{ t('amountU') }}</span>
              <Icon
                name="i-f7:money-dollar-circle-fill"
                :class="`${tableView.isVolUSDT ? 'color-[--d-666-l-999]' : 'color-[--d-999-l-666]'} cursor-pointer text-md`"
                @click="tableView.isVolUSDT = !tableView.isVolUSDT"
              />
            </div>
          </div>
          <div class="text-center">{{ t('makers') }}</div>
          <div class="text-right">{{ t('time') }}</div>
        </div>

        <!-- 表格内容 -->
        <el-scrollbar
          style="margin-right: -12px;padding-right: 12px;"
          :height="`${(klineHeight ?? 200) - 120}px`"
        >
          <div
            v-for="(row, index) in filterTableList"
            :key="index"
            class="grid grid-cols-4 gap-8px py-2 hover:bg-[rgba(255,255,255,.02)] cursor-pointer"
            @mouseenter="isPausedTxs = true"
            @mouseleave="isPausedTxs = false"
            @click="onRowClick({ rowData: row} as any)"
          >
            <!-- Amount -->
            <div class="text-left">
              <div class="color-[--d-E9E9E9-l-222]">
                <template v-if="tableView.isAmount">
                  {{ formatNumber(getAmount(row), 2) }}
                </template>
                <template v-else>
                  {{ formatNumber(getPrice(row), 2) }}
                </template>
              </div>
            </div>

            <!-- Price -->
            <div class="text-center">
              <div :class="getRowColor(row)" class="font-medium">
                <template v-if="tableView.isVolUSDT">
                  ${{ formatNumber(getAmount(row, true, true), 2) }}
                </template>
                <template v-else>
                  {{ formatNumber(getAmount(row, true, false), 2) }}
                  <span class="color-[--d-999-l-666]">
                    {{ getChainInfo(row.chain)?.main_name }}
                  </span>
                </template>
              </div>
            </div>

            <!-- Trader -->
            <div class="text-center">
              <div class="flex items-center justify-center gap-4px">
                <template v-if="['solana', 'bsc'].includes(row.chain) && row.senderProfile">
                  <Icon
                    v-if="hasNewAccount(row)"
                    v-tooltip.raw="`<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`" name="custom:new-account"
                    class="mr-3px shrink-0"/>
                  <Icon
                    v-if="hasClearedAccount(row)" v-tooltip.raw="`<span style='color: #EB2B4B'>${$t('sellAl')}</span>`"
                    name="custom:cleared-account" class="mr-3px shrink-0"/>
                  <Icon
                    v-if="bigWallet(row)" v-tooltip.raw="`<span style='color: #C5842B'>${$t('whales')}</span>`"
                    name="custom:big" class="mr-3px shrink-0"/>
                </template>
                <SignalTags
                  tagClass="mr-3px"
                  :tags="(row.newTags||[]).map((el: any)=> tagStore.matchTag(el.type))"
                  :walletAddress="row.wallet_address" :chain="row.chain"
                />
                <UserRemark
                  :remark="row.remark"
                  :address="row.wallet_address"
                  :show-address="!(row?.newTags?.length > 1)"
                  :chain="row.chain"
                  :wallet_logo="row.wallet_logo"
                  class="color-[--d-E9E9E9-l-222]"
                  :mouseoverAddress="e => openMarkerTooltip(row, e)"
                  :canEdit="false"
                  @update-remark="updateRemark"
                />
              </div>
            </div>

            <!-- Time -->
            <div class="text-right">
              <div class="color-[--d-999-l-666]">
                <TimerCount
                  v-if="row.time && Number(formatTimeFromNow(row.time, true)) < 60"
                  :key="row.time"
                  :timestamp="row.time"
                  :end-time="60"
                >
                  <template #default="{seconds}">
                    <span>
                      <template v-if="seconds < 60">
                        {{ seconds }}{{ t('ss') }}
                      </template>
                      <template v-else>
                        {{ formatTimeFromNow(row.time) }}
                      </template>
                    </span>
                  </template>
                </TimerCount>
                <span v-else>
                  {{ formatTimeFromNow(row.time) }}
                </span>
              </div>
            </div>
          </div>
          <template v-if="filterTableList.length === 0 && !listStatus.loadingTxs">
            <div
              class="h-full flex flex-col items-center justify-center "
              :style="{ height: `${(klineHeight ?? 200) - 120}px` }"
            >
              <img src="@/assets/images/empty-black.svg" alt="">
            </div>
          </template>
        </el-scrollbar>
      </div>
    </div>

    <!-- MarkerTooltip -->
    <MarkerTooltip
      :virtual-ref="makerTooltip"
      :currentRow="currentRow"
      :addressAndChain="addressAndChain"
      v-model="markerTooltipVisible"
    >
      <template v-if="currentRow.senderProfile">
        <Icon
          v-if="hasNewAccount(currentRow)"
          v-tooltip.raw="`<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`"
          name="custom:new-account"
          class="mr-3px"
        />
        <Icon
          v-if="hasClearedAccount(currentRow)"
          v-tooltip.raw="`<span style='color: #EB2B4B'>${$t('sellAl')}</span>`"
          name="custom:cleared-account"
          class="mr-3px"
        />
        <Icon
          v-if="bigWallet(currentRow)"
          v-tooltip.raw="`<span style='color: #C5842B'>${$t('whales')}</span>`"
          name="custom:big"
          class="mr-3px"
        />
      </template>
      <SignalTags
        tagClass="mr-3px"
        :tags="currentRow.newTags"
        :walletAddress="currentRow.wallet_address"
        :chain="currentRow.chain"
      />
    </MarkerTooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch, onMounted, onUnmounted, triggerRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useTokenStore } from '~/stores/token'
import { useWSStore } from '~/stores/ws'
import { getTokenTxs, type IGetTokenTxsResponse } from '~/api/token'
import { getAddressAndChainFromId, formatTimeFromNow, getWSMessage, uuid } from '~/utils'
import { useRoute } from 'vue-router'
import { filterLanguage } from '~/pages/token/components/kLine/utils'
import { WSEventType } from '~/utils/constants'
import { useThrottleFn } from '@vueuse/core'
import UserRemark from '~/components/userRemark.vue'
import MarkerTooltip from '../belowChartTable/transactions/markerTooltip.vue'
import TimerCount from '~/components/timerCount.vue'
import { ElScrollbar, type RowEventHandlerParams } from 'element-plus'

const MAKER_SUPPORT_CHAINS = ['solana', 'bsc']

// 扩展的交易数据类型
type ExtendedTxResponse = IGetTokenTxsResponse & {
  count?: number
  senderProfile?: any
  wallet_tag?: string[]
  topN?: string
  remark?: string
}

const props = defineProps<{
  modelValue: boolean
  klineHeight?: number
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { t } = useI18n()
const route = useRoute()
const { totalHolders, pairAddress, pair, token } = storeToRefs(useTokenStore())

const botStore = useBotStore()
const wsStore = useWSStore()
const tagStore = useTagStore()
const tokenDetailSStore = useTokenDetailsStore()

// 状态管理
const tabsContainer = ref<HTMLElement | null>(null)
const activeTab = shallowRef('all')
const isPausedTxs = shallowRef(false)
const markerTooltipVisible = shallowRef(false)
const isMeActive = ref(false)
const listStatus = ref({
  loadingTxs: false
})

const tokenTxs = shallowRef<ExtendedTxResponse[]>([])
const wsPairCache = shallowRef<ExtendedTxResponse[]>([])
const tableFilter = ref({
  markerAddress: '',
  tag_type: 'all'
})
const txCount = shallowRef<{ [key: string]: number }>({})
const makerTooltip = ref()
const currentRow = shallowRef<ExtendedTxResponse>({} as any)

// 表格视图状态
const tableView = ref({
  isVolUSDT: true,
  isAmount: true,
})

// 只在交易历史接口更新之后更新，防止 route 地址更新导致列表数据更新异常
const realAddress = shallowRef(getAddressAndChainFromId(route.params.id as string).address)

const tabs = computed(() => {
  const arr: Array<{ label: string, value: string }> = []
  if (Array.isArray(totalHolders.value)) {
    totalHolders.value.forEach(i => {
      const num = i.total_address
      if (num > 0) {
        arr.push({
          ...i,
          label: i?.[filterLanguage(useLocaleStore().locale)] + (i.type !== '31' ? `(${num})` : ''),
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
    label: 'Smarter',
    value: 'smarter'
  },
  ...arr]
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

const filterTableListMap = {
  all: () => [...tokenTxs.value].toSorted((a, b) => b.time - a.time),
  buy: () => tokenTxs.value.filter(el => isBuy((el))),
  sell: () => tokenTxs.value.filter(el => !isBuy(el))
}

const filterTableList = computed(() => {
  let tableList = [...tokenTxs.value]
  if (activeTab.value in filterTableListMap) {
    tableList = filterTableListMap[activeTab.value as keyof typeof filterTableListMap]()
  } else {
    tableList = tokenTxs.value
  }

  // Maker 地址筛选
  if (tableFilter.value.markerAddress) {
    tableList = tableList.filter(item =>
      item.wallet_address.toLowerCase() === tableFilter.value.markerAddress.toLowerCase()
    )
  }

  return tableList
})

// 监听 pairAddress 变化（token切换）
watch(() => pairAddress.value, () => {
  if (pairAddress.value && props.modelValue) {
    console.log('🔄 Token切换，清空订单薄数据')
    // 立即清空旧数据，避免显示错误的数据
    tokenTxs.value = []
    wsPairCache.value = []
    txCount.value = {}
    activeTab.value = 'all'
    tableFilter.value.markerAddress = ''
    tableFilter.value.tag_type = 'all'

    // 重新获取数据
    _getTokenTxs()
    subscribeToTxs()
  }
})

// 监听 modelValue 变化（orderBook 打开/关闭）
watch(() => props.modelValue, (isOpen) => {
  console.log('🔄 订单薄状态变化:', isOpen ? '打开' : '关闭')
  if (isOpen && pairAddress.value) {
    // orderBook 打开时，清空旧数据并获取新数据
    tokenTxs.value = []
    wsPairCache.value = []
    txCount.value = {}
    _getTokenTxs()
    subscribeToTxs()
  } else if (!isOpen) {
    // orderBook 关闭时，取消订阅并清空数据
    unsubscribeFromTxs()
    tokenTxs.value = []
    wsPairCache.value = []
    txCount.value = {}
  }
})

// 移除重复的WebSocket监听器，统一使用onTxsLiqMessage处理
// watch(() => wsStore.wsResult[WSEventType.TX], data => {
//   // 这个监听器与onTxsLiqMessage重复，已移除
// })

// WebSocket 订阅
function subscribeToTxs() {
  const liqParams = {
    jsonrpc: '2.0',
    params: ['tx', pairAddress.value],
    id: 1
  }
  wsStore.send({
    ...liqParams,
    method: 'unsubscribe'
  })
  wsStore.send({
    ...liqParams,
    method: 'subscribe'
  })
}

// WebSocket 取消订阅
function unsubscribeFromTxs() {
  const liqParams = {
    jsonrpc: '2.0',
    params: ['tx', pairAddress.value],
    id: 1
  }
  wsStore.send({
    ...liqParams,
    method: 'unsubscribe'
  })
}

async function _getTokenTxs() {
  try {
    listStatus.value.loadingTxs = true
    const { tag_type } = tableFilter.value
    const getTokenTxsParams = {
      token_id: route.params.id as string,
      tag_type,
      maker: tableFilter.value.markerAddress
    }
    const res = await getTokenTxs(getTokenTxsParams)

    // 更新realAddress，确保后续计算使用正确的地址
    realAddress.value = getAddressAndChainFromId(getTokenTxsParams.token_id).address
    console.log('📊 获取订单薄数据成功:', res?.length || 0, '条记录, realAddress:', realAddress.value)

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
    // 只有在没有现有数据时才清空，避免网络错误导致数据丢失
    if (tokenTxs.value.length === 0) {
      tokenTxs.value = []
    }
    console.log('🚨 订单薄数据获取失败:', e)
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

function isBuy(row: IGetTokenTxsResponse) {
  // 使用realAddress确保准确性，添加数据验证
  const tokenAddress = realAddress.value || addressAndChain.value.address

  if (!tokenAddress || !row) {
    console.warn('🚨 isBuy: 缺少必要参数', { tokenAddress, row })
    return false
  }

  if (row.from_address &&
      tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()) {
    return false  // 卖出
  }
  if (row.to_address &&
      tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()) {
    return true   // 买入
  }
  return false
}

function getRowColor(row: IGetTokenTxsResponse) {
  return isBuy(row) ? 'color-#12B886' : 'color-#FF646D'
}


function getPrice(row: IGetTokenTxsResponse, isShowToken = false) {
  // 使用 realAddress 而不是 addressAndChain.value.address，避免路由变化导致的计算错误
  const tokenAddress = realAddress.value || addressAndChain.value.address

  // 添加数据有效性检查
  if (!tokenAddress || !row) {
    console.warn('🚨 getPrice: 缺少必要参数', { tokenAddress, row })
    return 0
  }

  if ('from_address' in row) {
    if (
      row.from_address &&
      tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()
    ) {
      const price = isShowToken ? row.from_price_eth : row.from_price_usd
      return Number(price) || 0
    }
  }

  if ('to_address' in row) {
    if (
      row.to_address &&
      tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()
    ) {
      const price = isShowToken ? row.to_price_eth : row.to_price_usd
      return Number(price) || 0
    }
  }

  return 0
}
function getAmount(row: IGetTokenTxsResponse, needPrice = false, isVolUSDT = false) {
  // 使用 realAddress 确保地址匹配的准确性
  const tokenAddress = realAddress.value || addressAndChain.value.address

  // 添加数据有效性检查
  if (!tokenAddress || !row) {
    console.warn('🚨 getAmount: 缺少必要参数', { tokenAddress, row })
    return 0
  }

  if (row.from_address &&
      tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()) {
    const amount = Number(row.from_amount) || 0
    const price = needPrice ? Number(isVolUSDT ? row.from_price_usd : row.from_price_eth) || 0 : 1
    return amount * price
  }

  if (row.to_address &&
      tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()) {
    const amount = Number(row.to_amount) || 0
    const price = needPrice ? Number(isVolUSDT ? row.to_price_usd : row.to_price_eth) || 0 : 1
    return amount * price
  }

  return 0
}


function setActiveTab(val: string, index: number) {
  console.log('🔄 切换订单薄标签:', val)
  activeTab.value = val
  txCount.value = {}
  wsPairCache.value.length = 0  // 清空缓存
  tableFilter.value.tag_type = val
  _getTokenTxs()

  // 滚动到 tab 中心位置
  if (tabsContainer.value) {
    const container = tabsContainer.value
    const tab = container.children[index] as HTMLElement
    if (tab) {
      // 获取容器的可视区域宽度
      const containerWidth = container.clientWidth

      // 获取 tab 的位置和宽度
      const tabRect = tab.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      // 计算 tab 相对于容器的位置
      const tabRelativeLeft = tabRect.left - containerRect.left + container.scrollLeft
      const tabWidth = tabRect.width

      // 计算 tab 的中心点
      const tabCenter = tabRelativeLeft + (tabWidth / 2)

      // 计算目标滚动位置（让 tab 中心对齐到容器中心）
      const targetScrollLeft = tabCenter - (containerWidth / 2)

      // 限制滚动范围
      const maxScrollLeft = container.scrollWidth - containerWidth
      const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft))

      container.scrollTo({
        left: finalScrollLeft,
        behavior: 'smooth'
      })
    }
  }
}

function toggleClickMe() {
  console.log('🔄 切换"我的交易"筛选')
  if (isMeActive.value) {
    isMeActive.value = false
    tableFilter.value.markerAddress = ''
  } else {
    isMeActive.value = true
    tableFilter.value.markerAddress = botStore.getWalletAddress(addressAndChain.value.chain)!
  }
  wsPairCache.value.length = 0  // 清空缓存
  _getTokenTxs()
}


function onRowClick({rowData}: RowEventHandlerParams) {

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

function updateRemark() {
  // 更新备注后的回调
}

function openMarkerTooltip(row: ExtendedTxResponse, e: MouseEvent) {
  if (row && MAKER_SUPPORT_CHAINS.includes(row.chain)) {
    makerTooltip.value = e.currentTarget
    console.log(row)
    if (currentRow.value?.wallet_address === row.wallet_address) {
      return
    }
    currentRow.value = row
  }
}



function hasNewAccount(row: ExtendedTxResponse) {
  if (row?.newTags?.some?.(i => i?.type === '8')) {
    return false
  }
  if (
    addressAndChain.value.address.toLowerCase?.() === row.senderProfile?.token0Address?.toLowerCase?.()
  ) {
    return row.senderProfile?.token0HasNewAccount
  } else {
    return row.senderProfile?.token1HasNewAccount
  }
}

function hasClearedAccount(row: ExtendedTxResponse) {
  if (isBuy(row) || row.newTags?.some?.(i => i?.type === '8')) {
    return false
  }
  if (
    addressAndChain.value.address.toLowerCase?.() === row.senderProfile?.token0Address?.toLowerCase?.()
  ) {
    return row.senderProfile?.token0HasClearedAccount
  } else {
    return row.senderProfile?.token1HasClearedAccount
  }
}

function bigWallet(row: ExtendedTxResponse) {
  if (row?.newTags?.some?.(i => i.type === '8')) {
    return false
  }
  return Number(row.senderProfile?.solTotalHolding) > 50
}

// WebSocket 相关功能
onMounted(() => {
  onTxsLiqMessage()
  // 如果组件挂载时 orderBook 已经打开，则获取数据
  if (props.modelValue && pairAddress.value) {
    _getTokenTxs()
    subscribeToTxs()
  }
})

onUnmounted(() => {
  wsStore.getWSInstance()?.offMessage('tx_history')
  // 组件卸载时取消订阅
  if (pairAddress.value) {
    unsubscribeFromTxs()
  }
})

function onTxsLiqMessage() {
  wsStore.getWSInstance()?.onmessage(e => {
    const msg = getWSMessage(e)
    if (!msg || !props.modelValue) {
      return  // 只有当 orderBook 打开时才处理消息
    }

    const {event, data} = msg
    if (event == WSEventType.TX && !listStatus.value.loadingTxs) {
      const {wallet_address, from_address, to_address} = data.tx

      // 检查是否是当前币种的数据
      if (from_address !== realAddress.value && to_address !== realAddress.value) {
        return
      }

      // 检查是否已存在相同的交易（防重复）
      const existingTx = wsPairCache.value.find(tx =>
        tx.transaction === data.tx.transaction &&
        tx.wallet_address === wallet_address
      )
      if (existingTx) {
        console.log('🔄 跳过重复交易:', data.tx.transaction)
        return
      }

      txCount.value[wallet_address] = (txCount.value[wallet_address] || 0) + 1
      const {topN, wallet_tag} = getWalletTag(data.tx)
      const item = {
        ...data.tx,
        topN, wallet_tag,
        senderProfile: JSON.parse(data.tx.profile || '{}'),
        count: txCount.value[wallet_address],
        time: Math.min(Math.floor(Date.now() / 1000), data.tx.time),
        uuid: uuid()
      }

      console.log('📊 新增订单薄交易:', item.transaction)
      wsPairCache.value.unshift(item)

      if (!isPausedTxs.value) {
        updatetokenTxs()
      }
    }
  }, 'tx_history')
}

const updatetokenTxs = useThrottleFn(() => {
  if (wsPairCache.value.length === 0) return

  // 去重处理：检查新数据是否已存在于tokenTxs中
  const newTxs = wsPairCache.value.filter(newTx =>
    !tokenTxs.value.some(existingTx =>
      existingTx.transaction === newTx.transaction &&
      existingTx.wallet_address === newTx.wallet_address
    )
  )

  if (newTxs.length > 0) {
    console.log('📊 更新订单薄数据:', newTxs.length, '条新记录')
    tokenTxs.value.unshift(...newTxs)

    // 限制数据量，保持性能
    if (tokenTxs.value.length > 1000) {
      tokenTxs.value = tokenTxs.value.slice(0, 1000)
    }
  }

  wsPairCache.value.length = 0
  triggerRef(tokenTxs)
}, 500)

</script>

<style lang="scss" scoped>
.me-btn {
  color: var(--primary-color);
  background: rgba($color: #3F80F7, $alpha: 0.1);
  display: flex;
  align-items: center;
  border: none;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;

  &.active {
    background: var(--primary-color);
    color: #fff;
  }
}
</style>
