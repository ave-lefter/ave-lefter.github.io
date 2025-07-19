<template>
  <div v-if="modelValue" class="bg-[--d-111-l-FFF] relative rounded-2px text-14px pt-12px flex flex-col overflow-hidden" :style="{ height: `${klineHeight || 200}px` }">
    <!-- 筛选标签 -->
    <div class="mx-12px pb-8px flex border-b-1px border-b-solid border-b-[#f2f2f2] dark:border-b-[#222]">
      <div
        ref="tabsContainer"
        class="flex-1 flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide"
      >
        <button
          v-for="(tab, index) in tabs"
          :key="tab.value"
          :class="[
            'shrink-0 text-12px px-12px py-4px rounded-4px border-none cursor-pointer',
            activeTab === tab.value
              ? 'bg-[--d-222-l-F2F2F2] color-[--d-F5F5F5-l-333] dark:color-#ccc'
              : 'bg-transparent color-[--d-666-l-999]'
          ]"
          @click="setActiveTab(tab.value, index)"
        >
          {{ tab.label }}
        </button>
      </div>
      <button
        v-if="botStore?.userInfo?.name"
        class="me-btn shrink-0 flex items-center gap-4px sticky right-0 "
        :class="{ 'active': isMeActive }"
        @click="toggleClickMe"
      >
        <Icon name="i-tdesign:user-filled" class="text-md" />
        <span>{{ t('me') }}</span>
      </button>
    </div>

    <!-- 表格 -->
    <div class="px-12px">
      <div v-loading="listStatus.loadingTxs" class="text-12px">
        <!-- 表格头部 -->
        <div class="grid grid-cols-[1fr_1fr_62px_30px] gap-20px mt-8px mb-4px text-12px color-[--d-666-l-999]">
          <div class="text-left flex items-center gap-2px text-nowrap">
            {{ tableView.isAmount ? t('swapPrice') : t('MC') }}
            
            <el-button
              class="p-0 px-2px border-none hover:bg-[transparent] h-auto"
              @click="tableView.isAmount = !tableView.isAmount"
            >
              <svg v-if="tableView.isAmount" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="color-[--d-666-l-999]">
                <path d="M5 0C2.23884 0 0 2.23884 0 5C0 7.76116 2.23884 10 5 10C7.76116 10 10 7.76116 10 5C10 2.23884 7.76116 0 5 0ZM5.24889 7.42411L5.25112 7.7779C5.25112 7.82701 5.21094 7.8683 5.16183 7.8683H4.84486C4.79576 7.8683 4.75558 7.82812 4.75558 7.77902V7.42857C3.76451 7.35491 3.29799 6.79017 3.24777 6.17634C3.24331 6.12388 3.2846 6.07924 3.33706 6.07924H3.85268C3.89621 6.07924 3.93415 6.11049 3.94085 6.1529C3.99777 6.5067 4.27344 6.7712 4.76785 6.83705V5.24442L4.49219 5.17411C3.90848 5.0346 3.35268 4.67076 3.35268 3.9163C3.35268 3.10268 3.97098 2.66518 4.76116 2.58817V2.21986C4.76116 2.17076 4.80134 2.13058 4.85045 2.13058H5.16406C5.21317 2.13058 5.25334 2.17076 5.25334 2.21986V2.58482C6.01786 2.66183 6.59152 3.10826 6.65848 3.80357C6.66406 3.85603 6.62276 3.90179 6.56919 3.90179H6.06808C6.02343 3.90179 5.98549 3.8683 5.97991 3.82478C5.93527 3.49888 5.67411 3.23326 5.24889 3.17522V4.6741L5.53237 4.73996C6.25558 4.91852 6.74777 5.26451 6.74777 6.03907C6.74777 6.87947 6.12277 7.34822 5.24889 7.42411ZM4.04688 3.86496C4.04688 4.14843 4.2221 4.36831 4.59933 4.50446C4.65179 4.52567 4.70424 4.54241 4.76674 4.56026V3.17634C4.35491 3.2288 4.04688 3.45982 4.04688 3.86496ZM5.34709 5.37388C5.31585 5.36718 5.2846 5.35938 5.24889 5.34933V6.84152C5.72433 6.79911 6.05246 6.53795 6.05246 6.10044C6.05246 5.75782 5.875 5.53459 5.34709 5.37388Z" fill="currentColor"/>
              </svg>
              <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="color-[--d-666-l-999]">
                <path d="M9.02589 2.99465C9.33125 3.60428 9.5 4.2861 9.5 5.00802C9.5 7.48663 7.48304 9.5 5 9.5C2.51696 9.5 0.5 7.48663 0.5 5.00802C0.5 2.52941 2.50893 0.516043 5 0.516043V5.31283L9.02589 2.99465ZM5.64286 0.5V4.14171L8.69643 2.38503C7.99732 1.39037 6.90446 0.684492 5.64286 0.5Z" fill="currentColor"/>
              </svg>
            </el-button>
            
          </div>
          <div class="text-right text-nowrap">
            <div class="flex items-center justify-end gap-2px">
              <span>{{ t('amountU').slice(0,3) }}</span>
              <el-button
                class="p-0 px-2px border-none hover:bg-[transparent] h-auto"
                @click="tableView.isVolUSDT = !tableView.isVolUSDT"
              >
                <svg v-if="tableView.isVolUSDT" width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="color-[--d-666-l-999]">
                  <path d="M5 0C2.23884 0 0 2.23884 0 5C0 7.76116 2.23884 10 5 10C7.76116 10 10 7.76116 10 5C10 2.23884 7.76116 0 5 0ZM5.24889 7.42411L5.25112 7.7779C5.25112 7.82701 5.21094 7.8683 5.16183 7.8683H4.84486C4.79576 7.8683 4.75558 7.82812 4.75558 7.77902V7.42857C3.76451 7.35491 3.29799 6.79017 3.24777 6.17634C3.24331 6.12388 3.2846 6.07924 3.33706 6.07924H3.85268C3.89621 6.07924 3.93415 6.11049 3.94085 6.1529C3.99777 6.5067 4.27344 6.7712 4.76785 6.83705V5.24442L4.49219 5.17411C3.90848 5.0346 3.35268 4.67076 3.35268 3.9163C3.35268 3.10268 3.97098 2.66518 4.76116 2.58817V2.21986C4.76116 2.17076 4.80134 2.13058 4.85045 2.13058H5.16406C5.21317 2.13058 5.25334 2.17076 5.25334 2.21986V2.58482C6.01786 2.66183 6.59152 3.10826 6.65848 3.80357C6.66406 3.85603 6.62276 3.90179 6.56919 3.90179H6.06808C6.02343 3.90179 5.98549 3.8683 5.97991 3.82478C5.93527 3.49888 5.67411 3.23326 5.24889 3.17522V4.6741L5.53237 4.73996C6.25558 4.91852 6.74777 5.26451 6.74777 6.03907C6.74777 6.87947 6.12277 7.34822 5.24889 7.42411ZM4.04688 3.86496C4.04688 4.14843 4.2221 4.36831 4.59933 4.50446C4.65179 4.52567 4.70424 4.54241 4.76674 4.56026V3.17634C4.35491 3.2288 4.04688 3.45982 4.04688 3.86496ZM5.34709 5.37388C5.31585 5.36718 5.2846 5.35938 5.24889 5.34933V6.84152C5.72433 6.79911 6.05246 6.53795 6.05246 6.10044C6.05246 5.75782 5.875 5.53459 5.34709 5.37388Z" fill="currentColor"/>
                </svg>
                <svg v-else width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" class="color-[--d-666-l-999]">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 0C7.757 0 10 2.243 10 5C10 7.757 7.757 10 5 10C2.243 10 0 7.757 0 5C0 2.243 2.243 0 5 0ZM5.1 3C4.78 3 4.484 3.114 4.256 3.342L3.342 4.256C3.114 4.484 3 4.78 3 5.1C2.9953 5.41628 3.11864 5.72103 3.342 5.945L4.256 6.858C4.484 7.087 4.78 7.2 5.1 7.2C5.41434 7.19485 5.71531 7.07268 5.945 6.858L6.858 5.945C7.087 5.717 7.201 5.42 7.201 5.1C7.201 4.781 7.087 4.484 6.858 4.256L5.945 3.342C5.717 3.114 5.42 3 5.1 3ZM5.1 3.64C5.23799 3.64449 5.369 3.70176 5.466 3.8L6.379 4.712C6.48602 4.80272 6.54509 4.93783 6.539 5.078C6.53426 5.21564 6.477 5.34624 6.379 5.443L5.465 6.356C5.26 6.539 4.918 6.539 4.735 6.356L3.822 5.443C3.708 5.352 3.662 5.215 3.662 5.078C3.66649 4.94001 3.72376 4.80901 3.822 4.712L4.735 3.8C4.82551 3.69326 4.96018 3.63423 5.1 3.64Z" fill="currentColor"/>
                </svg>
              </el-button>
            </div>
          </div>
          <div class="text-right">{{ t('makers') }}</div>
          <div class="text-right">{{ t('time') }}</div>
        </div>

        <!-- 表格内容 -->
        <el-scrollbar
          style="margin-right: -12px;padding-right: 12px;"
          :height="`${(klineHeight ?? 200) - 75}px`"
        >
          <div
            v-for="(row, index) in filterTableList"
            :key="index"
            class="grid grid-cols-[1fr_1fr_62px_30px] gap-20px py-4px hover:bg-[rgba(255,255,255,.02)] cursor-pointer"
            @mouseenter="isPausedTxs = true"
            @mouseleave="isPausedTxs = false"
            @click="onRowClick({ rowData: row} as any)"
          >
            <!-- Amount -->
            <div class="text-left text-nowrap">
              <div class="color-[--d-999-l-666]">
                <template v-if="tableView.isAmount">
                  ${{ formatNumber(getTransactionPrice(row, true), { decimals: 3 }) }}
                </template>
                <template v-else>
                  ${{ formatNumber(getMcPrice(row), { decimals:2 }) }}
                </template>
              </div>
            </div>

            <!-- Price -->
            <div class="text-right text-nowrap color-[--d-999-l-666]">
              <div :class="getRowColor(row)" class="font-medium">    
                <template v-if="tableView.isVolUSDT">
                  <!-- USDT 2位小数 -->
                  ${{ formatFixedDecimals(getAmount(row, true, true), 2) }}
                </template>
                <template v-else>
                  <!-- 纯纯的保留 3 位小数 -->
                  ${{ formatFixedDecimals(getAmount(row, true, false), 3) }}
                  <span class="color-[--d-999-l-666]">
                    {{ getChainInfo(row.chain)?.main_name }}
                  </span>
                </template>              
              </div>
            </div>

            <!-- Trader -->
            <div class="text-right">
              <div class="flex items-center justify-end">
                <template v-if="['solana', 'bsc'].includes(row.chain) && row.senderProfile">
                  <Icon
                    v-if="hasNewAccount(row)"
                    v-tooltip="{ content: `<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
                    name="custom:new-account"
                    class="w-12px h-12px mr-2px  shrink-0 icon-hover"/>
                  <Icon
                    v-if="hasClearedAccount(row)"
                    v-tooltip="{ content: `<span style='color: #EB2B4B'>${$t('sellAl')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
                    name="custom:cleared-account" class="w-12px h-12px mr-2px  shrink-0 icon-hover"/>
                  <Icon
                    v-if="bigWallet(row)"
                    v-tooltip="{ content: `<span style='color: #ccc'>${$t('whales')}</span>`, props: { 'raw-content': true, 'popper-class': 'signal-tags-tooltip' } }"
                    name="custom:big" class="w-12px h-12px mr-2px  shrink-0 icon-hover"/>
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
                  :format-address="(address: string) => '*' + address?.slice(-4)"
                  class="color-[--d-999-l-666]"
                  :mouseoverAddress="e => openMarkerTooltip(row, e)"
                  :canEdit="false"
                  @update-remark="updateRemark"
                />
              </div>
            </div>

            <!-- Time -->
            <div class="text-right">
              <div class="color-[--d-666-l-999]">
                <TimerCount
                  v-if="row.time && Number(formatTimeFromNow(row.time, true)) < 60"
                  :key="`${row.time}${index}`" 
                  :timestamp="row.time" 
                  :end-time="60"
                >
                  <template #default="{ seconds }">
                    <span class="color-[--d-666-l-999]">
                      <template v-if="seconds < 60">
                        {{ seconds }}s
                      </template>
                      <template v-else>
                        {{ formatTimeFromNow(row.time) }}
                      </template>
                    </span>
                  </template>
                </TimerCount>
                <span v-else class="color-[--d-666-l-999]">
                  {{ formatTimeFromNow(row.time) }}
                </span>
              </div>
            </div>
          </div>
          <template v-if="filterTableList.length === 0 && !listStatus.loadingTxs">
            <div
              class="h-full flex flex-col items-center justify-center "
              :style="{ height: `${(klineHeight ?? 200) - 105}px` }"
            >
              <img src="@/assets/images/empty-black.svg" alt="">
            </div>
          </template>
        </el-scrollbar>
      </div>
    </div>
    <!-- status -->
    <div
      class="absolute bottom-0 h-24px w-100% flex justify-center color-[#FFA622]"
      :class="isPausedTxs? 'bg-[#F2F2F2] dark:bg-[#1A1A1A]': ''"
    >
        

      <div 
        v-show="isPausedTxs"
        class="flex items-center gap-4px"
      >
        <Icon name="custom:stop" class="text-lg" />
        <span class="text-xs">{{ t('paused') }}</span>
      </div>
    </div>
    <!-- MarkerTooltip -->
    <MarkerTooltip
      v-model="markerTooltipVisible"
      :virtual-ref="makerTooltip"
      :currentRow="currentRow"
      :addressAndChain="addressAndChain"
    >
      <template v-if="currentRow.senderProfile">
        <Icon
          v-if="hasNewAccount(currentRow)"
          v-tooltip="{ content: `<span style='color: #85E12F'>${$t('newTokenAccount')}</span>`, props: { 'raw-content': true, 'popper-class': 'orderbook-icon-tooltip' } }"
          name="custom:new-account"
          class="icon-hover"
        />
        <Icon
          v-if="hasClearedAccount(currentRow)"
          v-tooltip="{ content: `<span style='color: #EB2B4B'>${$t('sellAl')}</span>`, props: { 'raw-content': true, 'popper-class': 'orderbook-icon-tooltip' } }"
          name="custom:cleared-account"
          class="icon-hover"
        />
        <Icon
          v-if="bigWallet(currentRow)"
          v-tooltip="{ content: `<span style='color: #C5842B'>${$t('whales')}</span>`, props: { 'raw-content': true, 'popper-class': 'orderbook-icon-tooltip' } }"
          name="custom:big"
          class="icon-hover"
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
import { ElScrollbar, type RowEventHandlerParams } from 'element-plus'
const tokenStore = useTokenStore()

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
const { totalHolders, pairAddress, pair, token, } = storeToRefs(useTokenStore())

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
  // {
  //   label: t('buy3'),
  //   value: 'buy'
  // },
  // {
  //   label: t('sell3'),
  //   value: 'sell'
  // },
  // {
  //   label: t('liquidity2'),
  //   value: 'liquidity'
  // },
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

    realAddress.value = getAddressAndChainFromId(getTokenTxsParams.token_id).address

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


function getMcPrice(row: IGetTokenTxsResponse) {

  // 获取total总数
  const total = tokenStore.circulation

  // 根据买/卖方向获取对应的USD价格（成交价）
  let currentPriceUsd = 0
  const tokenAddress = realAddress.value || addressAndChain.value.address

  if (row.from_address && tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()) {
    // 卖出：使用 from_price_usd
    currentPriceUsd = Number(row.from_price_usd) || 0
  } else if (row.to_address && tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()) {
    // 买入：使用 to_price_usd
    currentPriceUsd = Number(row.to_price_usd) || 0
  } else {
    // 如果无法判断方向，使用默认价格
    currentPriceUsd = Number(row.to_price_usd) || Number(row.from_price_usd) || 0
  }

  // 如果价格为0，记录警告
  if (currentPriceUsd === 0) {
    console.warn('⚠️ MC计算失败 - 价格为0:', {
      from_price_usd: row.from_price_usd,
      to_price_usd: row.to_price_usd,
      from_address: row.from_address,
      to_address: row.to_address,
      tokenAddress,
      isBuy: isBuy(row),
      transaction: row.transaction
    })
  }

  // 计算市值 = 成交价USD × 总数
  const marketCap = currentPriceUsd * total

  return marketCap
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

// 新增：固定小数位格式化方法
function formatFixedDecimals(value: number, decimals: number): string {
  if (isNaN(value) || value === 0) return '0.00'
  
  // 使用 toFixed 确保固定小数位数
  const fixed = value.toFixed(decimals)
  
  // 移除末尾的零（但保留至少一位小数）
  const trimmed = fixed.replace(/\.?0+$/, '')
  
  // 如果没有小数点，根据需要添加
  if (decimals > 0 && !trimmed.includes('.')) {
    return trimmed + '.00'
  }
  
  return trimmed
}

// 新增函数：获取成交价格
function getTransactionPrice(row: IGetTokenTxsResponse, isVolUSDT = false) {
  // 使用 realAddress 确保地址匹配的准确性
  const tokenAddress = realAddress.value || addressAndChain.value.address

  // 添加数据有效性检查
  if (!tokenAddress || !row) {
    console.warn('🚨 getTransactionPrice: 缺少必要参数', { tokenAddress, row })
    return 0
  }

  if (row.from_address &&
      tokenAddress.toLowerCase?.() === row.from_address?.toLowerCase?.()) {
    // 卖出：使用 from_price_usd 或 from_price_eth
    return Number(isVolUSDT ? row.from_price_usd : row.from_price_eth) || 0
  }

  if (row.to_address &&
      tokenAddress.toLowerCase?.() === row.to_address?.toLowerCase?.()) {
    // 买入：使用 to_price_usd 或 to_price_eth
    return Number(isVolUSDT ? row.to_price_usd : row.to_price_eth) || 0
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
    // console.log('📊 更新订单薄数据:', newTxs.length, '条新记录')
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
  background: transparent;
  color: var(--d-999-l-666);
  display: flex;
  align-items: center;
  border: none;
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 4px;

  &.active {
    color: #3F80F7;
  }
}
</style>