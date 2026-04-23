<template>
  <div class="w-monitor bg-[--secondary-bg] w-100% h-100% pl-12px pr-6px relative overflow-hidden"
    :class="{ 'pr-10px!': isLeftFixed, 'pl-10px!': isRightFixed }">
    <!-- <div class="w-100% h-40px absolute pointer-events-auto z-999 drag-handle left-0"/> -->
    <Icon name="custom:drag2" class="absolute top-3px left-50% ml--6px text-6px bg-[--dialog-list-hover] drag-handle" />
    <el-tabs v-model="activeName" style="" class="m-tabs" @tab-change="handleClick">
      <el-tab-pane :label="$t('insidersActivity')" :name="0" lazy>
        <template v-if="botStore.evmAddress">
          <div v-if="props.isLarge" v-loading="loading" class="text-12px m-table"
            element-loading-background="transparent">
            <AveTable ref="aveTableRef" :showEmptyText="true" rowKey="id" :data="filterDataSource" :columns="columns" fixed :style="{
              height: props.scrollHeight + 'px',
              // '--el-table-border':'1px solid var(--dialog-list-hover)',
              // '--el-table-bg-color':'transparent'
              // height:'500px',
            }" row-class='cursor-pointer' :rowEventHandlers="{
                onClick: (row: any) => jumpToken(row)
              }">
              <template #header-wallet>
                <span>{{ $t('wallet') }}</span>
              </template>
              <template #cell-wallet="{ row }">
                <UserRemark :key="row._marker.maker_address" :address="row._marker.maker_address" :chain="row.chain"
                  :remark="row.maker_alias || ''" :showIcon="true" :teleported="true"
                  :wallet_logo="row.maker_logo ? { logo: row.maker_logo, vip_logo: 'https://www.iconaves.com/address_portrait/KOL_V.png' } : {}"
                  iconSize="24px" :formatAddress="(address) =>
                      address?.slice(0, 4) + '...' + address?.slice(-4)
                    " @updateRemark="getMonitorList" @click="(e: any) => jumpBalance(row, e)" />
              </template>
              <template #header-type>
                <span>{{ $t('type') }}</span>
              </template>
              <template #cell-type="{ row }">
                <pro-tag :type="row._marker.isBuy ? 'success' : 'danger'"> {{ getTxType(row) }}</pro-tag>
              </template>
              <template #header-amount>
                <span>{{ $t('value') }}</span>
              </template>
              <template #cell-amount="{ row }">
                <span :class="getIsBuy(row) ? `color-[--up-color]` : `color-[--down-color]}`">
                  {{ !toggleMc ? row?._main_Token?.amount + row?._main_Token?.symbol : row?._main_Token.total }}
                </span>
              </template>
              <template #header-mc>
                <span>{{ toggleMc ? $t('price') : $t('mcap') }}</span>
              </template>
              <template #cell-mc="{ row }">
                <span>{{ toggleMc ? row?._target_Token?.price : row?._mc }}</span>
              </template>
              <template #header-time>
                <span>{{ $t('time') }}</span>
              </template>
              <template #cell-time="{ row }">
                <div v-tooltip="formatDate(row?.created_at || row?.time)" class="time" :style="{
                  color:
                    Number(formatTimeFromNow(row?.created_at || row?.time, true)) <= 600
                      ? '#FFA622'
                      : '#12B886',
                }">
                  <template v-if="!(row?.created_at || row?.time)"><span>-</span></template>
                  <TimerCount
                    v-else-if="(row.created_at || row?.time) && Number(formatTimeFromNow(row.created_at || row?.time, true)) < 60"
                    :key="`${row.created_at || row?.time}`"
                    :timestamp="Math.min(+(row.created_at || row?.time), dayjs().unix() - 1)" :end-time="60">
                    <template #default="{ seconds }">
                      <span class="color-#FFA622 text-12px">
                        <template v-if="seconds < 60"> {{ seconds }}s </template>
                        <template v-else>
                          {{ formatTimeFromNow(row.created_at || row?.time) }}
                        </template>
                      </span>
                    </template>
                  </TimerCount>
                  <span v-else class="text-12px">
                    {{ formatTimeFromNow(row.created_at || row?.time) }}
                  </span>
                </div>
              </template>
              <template #header-symbol>
                <span>{{ $t('token') }}</span>
              </template>
              <template #cell-symbol="{ row }">
                <TokenImg :row="{
                  logo_url: row?._target_Token?.logo_url,
                  chain: row.chain,
                  symbol: row?._target_Token?.symbol
                }" token-class="w-16px h-16px [&&]:mr-4px" :showChain="false" />
                <span>{{ row?._target_Token?.symbol }}</span>
                <img v-if="row?.amm == 'pump'" src="https://www.iconaves.com/signals/pump_king.png"
                  style="width:12px;height:12px">
              </template>
              <template #header-operate>
                <span />
              </template>
              <template #cell-operate="{ row }">
                <QuickSwap2 :quickBuyValue="quickBuyValueMap[row.chain]"
                  :row="{ ...row, ...{ target_token: row?.target_address, token0_address: row?.from_address, token1_address: row?.to_address, symbol: row?._target_Token?.symbol } }"
                  classNames="min-w-70px h-24px! w-quickSwap" :enable-batch-swap="true"/>
              </template>
              <template v-if="monitor_count===0" #empty>
                <div v-if="!loading" class="h-full flex flex-col items-center justify-center pt-0px">
                  <img v-if="themeStore.theme==='light'" src="@/assets/images/empty-white.svg" alt="">
                  <img v-else src="@/assets/images/empty-black.svg" alt="">
                  <span class="mt-10px">
                    {{ $t('emptyNoData') }}
                  </span>
                  <el-button class="mt-10px" type="primary" size="small" @click="activeName=1">{{ $t('emptyButtonText') }}</el-button>
                </div>
              </template>
            </AveTable>
          </div>
          <div v-else v-loading="loading" class="text-12px m-table pt-14px" element-loading-background="transparent">
            <AveTable ref="aveTableRef" rowKey="id" fixed :data="filterDataSource" :columns="columns" :headerHeight="54"  :showEmptyText="true"
              :rowHeight="70" headerClass="bg-transparent" :style="{
                height: props.scrollHeight + 'px',
                // height:'500px',
                '--el-table-border': '1px solid transparent'
              }" row-class='cursor-pointer group' :rowEventHandlers="{
                onClick: (row: any) => jumpToken(row),
                onMouseenter:()=>isHoverTable=true,
                onMouseleave:()=>isHoverTable=false
              }">
              <template #header-wallet>
                <div class="flex flex-col w-100% gap-14px"> 
                  <div class="flex-between w-100%">
                    <div class="flex-start gap-8px">
                      <!-- <FilterType v-model="txType" :options="txTypeList" />
                      <Icon ref="audioButtonRef" :name="audioSettings.audio.monitor ? 'custom:ad' : 'custom:admute'"
                        class="cursor-pointer text-16px color-[--secondary-text]" /> -->
                      <pro-tag size="small" class="cursor-pointer w-55px" @click="toggleMc = !toggleMc">{{
                        !toggleMc ?'U/Pri':'C/MC' }}
                        <Icon name="lsicon:switch-filled" class="ml-4px text-12px" />
                      </pro-tag>
                    </div>
                    <div class="flex-end gap-8px">
                      <div v-show="isHoverTable" class="flex items-center color-#FFA622 text-12px">
                        <Icon name="custom:stop" />
                        <!-- <span class="ml-3px">{{ $t('paused') }}</span> -->
                      </div>
                      <QuickBatchWallet :chains="selectedChainVals" :boundary="null" />
                      <quickSwapSetCustom2
                        v-model:quickBuyValue="quickBuyValueMap"
                        v-model:customSelected="swapSetSelected"
                        :chain="selectedChainVals"
                        displayType="select"
                        :height="24"
                      />
                      <!-- <QuickBuyInput v-model="quickBuyValue" size="small" /> -->
                    </div>
                  </div>
                  <div class="flex flex-start gap-17px items-center text-[--third-text] font-400 text-12px lh-16px">
                    <span>{{ $t('monitorNum') }}&nbsp;<b class="text-[--main-text]">{{ monitor_count }}</b></span>
                    <span>{{ $t('favTotal') }}&nbsp;<b class="text-[--main-text]">{{ fav_count }}</b></span>
                  </div>
                </div>
              </template>
              <template #cell-wallet="{ row }">
                <div class="flex flex-col w-100% gap-8px">
                  <div class="flex-between">
                    <div class="flex-start gap-4px">
                      <UserRemark :key="row._marker.maker_address" :address="row._marker.maker_address" :chain="row.chain"
                        :remark="row.maker_alias || ''" :showIcon="true" :teleported="true"
                        :wallet_logo="row.maker_logo ? { logo: row.maker_logo, vip_logo: 'https://www.iconaves.com/address_portrait/KOL_V.png' } : {}"
                        iconSize="24px" :formatAddress="(address) =>
                            address?.slice(0, 4) + '...' + address?.slice(-4)
                          " @updateRemark="getMonitorList" @click="(e: any) => jumpBalance(row, e)" />
                      <div class="color-[--third-text]">{{ getTxType(row) }}</div>
                      <template v-if="row.position_type=='3'">
                        <div v-if="(row._profit==='--')||!row._profit"  class="color-[--third-text]"></div>
                        <div v-else :class="row._profit>0 ? `color-[--up-color]` : `color-[--down-color]`">{{ `${Number(row._profit) > 0 ? '+' : '-'}$${formatNumber2(Math.abs(row?._profit || 0) || 0, 2)}` }}</div>
                      </template>
                    </div>
                    <QuickSwap2 :quickBuyValue="quickBuyValueMap[row.chain]"
                      :row="{ ...row, ...{ target_token: row?.target_address, token0_address: row?.from_address, token1_address: row?.to_address, symbol: row?._target_Token?.symbol } }"
                      classNames="min-w-70px h-24px!  hidden! group-hover:block! w-quickSwap" :enable-batch-swap="true"/>
                    <div v-tooltip="formatDate(row?.created_at || row?.time)" class="time"
                      className="group-hover:hidden!" :style="{
                        color:
                          Number(formatTimeFromNow(row?.created_at || row?.time, true)) <= 600
                            ? '#FFA622'
                            : '#12B886',
                      }">
                      <template v-if="!(row?.created_at || row?.time)"><span>-</span></template>
                      <TimerCount
                        v-else-if="(row.created_at || row?.time) && Number(formatTimeFromNow(row.created_at || row?.time, true)) < 60"
                        :key="`${row.created_at || row?.time}`"
                        :timestamp="Math.min(+(row.created_at || row?.time), dayjs().unix() - 1)" :end-time="60">
                        <template #default="{ seconds }">
                          <span class="color-#FFA622 text-12px">
                            <template v-if="seconds < 60"> {{ seconds }}s </template>
                            <template v-else>
                              {{ formatTimeFromNow(row.created_at || row?.time) }}
                            </template>
                          </span>
                        </template>
                      </TimerCount>
                      <span v-else v-tooltip="formatDate(row.created_at || row?.time, 'YYYY-MM-DD HH:mm:ss')"
                        class="text-12px">
                        {{ formatTimeFromNow(row.created_at || row?.time) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-between">
                    <div class="flex-start gap-4px">
                      
                      <span :class="getIsBuy(row) ? `color-[--up-color]` : `color-[--down-color]`">
                        {{ !toggleMc ? row?._main_Token?.amount + row?._main_Token?.symbol : row?._main_Token.total }}
                      </span>
                      <TokenImg :row="{
                        logo_url: row?._target_Token?.logo_url,
                        chain: row.chain,
                          symbol: row?._target_Token?.symbol
                      }" token-class="w-16px h-16px [&&]:mr-4px" :showChain="false" />
                      <span class="color-[--main-text]">{{ format4Str4(row?._target_Token?.symbol) }}</span>
                      <img v-if="row?.amm == 'pump'" src="https://www.iconaves.com/signals/pump_king.png"
                        style="width:12px;height:12px">
                    </div>
                    <div class="flex-end gap-4px">
                      <span class="color-[--third-text]">{{ toggleMc ? $t('price') : $t('mcap') }}</span>
                      <span class="color-[--main-text]">{{ toggleMc ? row?._target_Token?.price : row?._mc }}</span>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="monitor_count===0" #empty>
                <div v-if="!loading" class="h-full flex flex-col items-center justify-center pt-0px">
                  <img v-if="themeStore.theme==='light'" src="@/assets/images/empty-white.svg" alt="">
                  <img v-else src="@/assets/images/empty-black.svg" alt="">
                  <span class="mt-10px">
                    {{ $t('emptyNoData') }}
                  </span>
                  <el-button class="mt-10px" type="primary" size="small" @click="activeName=1">{{ $t('emptyButtonText') }}</el-button>
                </div>
              </template>
            </AveTable>
          </div>
        </template>
        <AveEmpty v-else :style="{ height: `${props.scrollHeight - 50}px` }" class="overflow-hidden">
          <span class="text-12px mt-10px">{{ $t('noBotWalletTip') }}</span>
          <el-button class="mt-10px" @click="botStore.$patch({
            connectVisible: true
          })">
            {{ $t('connectWallet') }}
          </el-button>
        </AveEmpty>
      </el-tab-pane>
      <el-tab-pane :label="$t('manage')" :name="1" lazy>
        <WalletManage v-if="botStore.evmAddress" v-bind="walletManageProps" :isLarge="props.isLarge" :chain='selectedChainStr' />
        <AveEmpty v-else :style="{ height: `${props.scrollHeight - 50}px` }" class="overflow-hidden">
          <span class="text-12px mt-10px color-[--third-text]">{{ $t('noBotWalletTip') }}</span>
          <el-button type="primary" class="mt-10px" @click="botStore.$patch({
            connectVisible: true
          })">
            {{ $t('connectWallet') }}
          </el-button>
        </AveEmpty>
      </el-tab-pane>
      <el-tab-pane disabled>
        <template #label>
          <ChainSelector class="w-55px!" v-model="selectedChain" :show-label="false" wrapper-class="w-ChainSelector" popper-class="monitor-chain-selector-popper" :multiple="true" :teleported="true"/>
        </template>
      </el-tab-pane>
      <el-tab-pane disabled>
        <template #label>
          <div class="cursor-move w-100% h-100% drag-handle" />
        </template>
      </el-tab-pane>
      <el-tab-pane disabled>
        <template #label>
          <div class="m-op flex-end gap-8px w-100% h-100%">
            <template v-if="activeName === 0">
              <el-button v-if="(activeName === 0) && botStore.evmAddress" :ref="(ref) => addButtonRef = ref" size="small"
                style="height: 20px;color:var(--d-E0E0E0-l-333);--el-button-border-color:var(--third-text);--el-button-hover-border-color:var(--third-text)" class="dialog-button" :dark="isDark">
                <!-- <Icon name="ic:baseline-person-add-alt-1" class="text-12px  mr-5px" /> -->
                {{ $t('add') }}
              </el-button>
              <FilterType v-model="txType" v-model:minVol="minVol" :options="txTypeList"/>
              <Icon ref="audioButtonRef" :name="audioSettings.audio.monitor ? 'custom:ad' : 'custom:admute'"
                class="cursor-pointer color-[--secondary-text]" />
              <!-- <el-switch
                v-model="hasRing"
                class="[&&]:[--el-switch-on-color:--primary-color]"
                size="small"
                /> -->
              <pro-tag v-if="$props.isLarge" size="small" class="cursor-pointer w-55px" @click="toggleMc = !toggleMc">{{
                !toggleMc ?'U/Pri':'C/MC' }}
                <Icon name="lsicon:switch-filled" class="ml-4px text-12px" />
              </pro-tag>
            </template>
            <!-- <QuickBuyInput v-if="(activeName === 0) && isLarge" v-model="quickBuyValue" size="small" /> -->
            <quickSwapSetCustom2
              v-if="(activeName === 0) && isLarge"
              v-model:quickBuyValue="quickBuyValueMap"
              v-model:customSelected="swapSetSelected"
              :chain="selectedChainVals"
              displayType="select"
              :height="24"
            />
            <Icon class="text-14px color-[--secondary-text] hover:color-[--main-text] cursor-pointer"
              name="custom:pump-setting" @click.stop.prevent="audioSettings.active = 'notice'" />
            <Icon name="custom:close" class="text-14px shrink-0 cursor-pointer color-[--main-text]"
              @click.self="visible = false" />
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
    <AudioPopover v-if="audioButtonRef" :buttonRef="audioButtonRef" type="monitor" />
    <AddFavAddressPop v-if="addButtonRef" ref="addFavAddressPopRef" :buttonRef="addButtonRef"
      @onConfirm="handleConfirmAdd" />
  </div>
</template>

<script setup lang="ts">
import WalletManage from './walletManage.vue'
import { throttle, debounce } from 'lodash-es'
import { useStorage, useDebounceFn } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import { getHistoryMonitor, batchPauseMonitor, addAttention2, getFavCount as _getFavCount } from '~/api/attention'
import FilterType from './components/filterType.vue'
import quickSwapSetCustom2 from '~/components/quickSwap/quickSwapSetCustom2.vue'
import type { AveTable } from '#components'
import type { BotChain, BotSettingKey } from '~/utils/types'
import dayjs from 'dayjs'

const { t } = useI18n()

const { hasRing, monitorList2: dataSourceCache, visible, activeName, txType, minVol, isLeftFixed, isRightFixed } = storeToRefs(useMonitorStore())
const { updateNum2, updateNum3, updateNum13, currentAddress } = storeToRefs(useFollowStore())
const { isDark, audioSettings } = storeToRefs(useGlobalStore())

const props = defineProps({
  scrollHeight: {
    type: Number,
    default: 0
  },
  isLarge: {
    type: Boolean,
    default: false
  }
})

// ==================== 响应式状态定义 ====================
const dataSource = ref<any[]>([])
const loading = ref(false)
const firstActivated = ref(true)
const addButtonRef = ref<HTMLElement | null>(null)
const audioButtonRef = ref<HTMLElement | null>(null)
const toggleMc = ref(false)
const addFavAddressPopRef = ref<any>(null)
const isHoverTable = ref(false)
const fav_count = ref(0)
const monitor_count = ref(0)

const botStore = useBotStore()
const themeStore = useThemeStore()
const wsStore = useWSStore()
const aveTableRef = ref<InstanceType<typeof AveTable> | null>(null)

import { SupportMonitorChain } from '@/utils/constants'

// ==================== 链选择管理 ====================
interface ChainOption {
  label: string
  value: string
  id: string
}

const selectedChain = useStorage<ChainOption[]>('monitorSelectedChain', [
  { label: 'SOL', value: 'solana', id: 'solana' },
  { label: 'BSC', value: '56', id: 'bsc' },
  { label: 'ETH', value: '1', id: 'eth' }
])

const selectedChainVals = computed<BotChain[]>(() => {
  return selectedChain.value.map(i => getChainInfo(i.value, true)?.net_name).filter(Boolean) as BotChain[]
})

const selectedChainStr = computed(() => {
  const chains = selectedChainVals.value
  
  if (chains.length === 0) return 'AllChains'
  
  const selectedChainIds = selectedChain.value.map(i => i.id)
  
  const isAllSelected = SupportMonitorChain.length > 0 && 
                       selectedChainIds.length >= SupportMonitorChain.length &&
                       SupportMonitorChain.every(chain => selectedChainIds.includes(chain))
  
  return isAllSelected ? 'AllChains' : chains.join(',')
})

// ==================== 快速买入金额管理 ====================
type MonitorChainType = typeof SupportMonitorChain[number]

const getDefaultQuickBuyValueMap = (): Record<MonitorChainType, string> => {
  const defaultMap = {} as Record<MonitorChainType, string>
  SupportMonitorChain.forEach(chain => {
    defaultMap[chain as MonitorChainType] = '0.01'
  })
  return defaultMap
}

const initQuickBuyValueMap = (): Record<MonitorChainType, string> => {
  const cached = localStorage.getItem('quickBuyValueMap')
  const defaultMap = getDefaultQuickBuyValueMap()
  
  if (cached) {
    try {
      const parsed = JSON.parse(cached)
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return { ...defaultMap, ...parsed }
      }
    } catch (e) {
      console.error('Failed to parse quickBuyValueMap from localStorage', e)
    }
  }
  
  localStorage.setItem('quickBuyValueMap', JSON.stringify(defaultMap))
  return defaultMap
}

const quickBuyValueMap = ref<Record<MonitorChainType, string>>(initQuickBuyValueMap())

// ✅ 优化1：使用防抖减少 localStorage 写入频率（从每次变为500ms）
const debouncedSaveQuickBuyValue = debounce((value: Record<MonitorChainType, string>) => {
  try {
    localStorage.setItem('quickBuyValueMap', JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save quickBuyValueMap', e)
  }
}, 500)

watch(
  quickBuyValueMap,
  (newValue) => {
    debouncedSaveQuickBuyValue(newValue)
  },
  { deep: true }
)

// ==================== 预设值管理 ====================
const getChainStorageKey = (chains: BotChain[]): string => {
  const chainStr = chains.sort().join('_')
  return `monitorSwapSetSelected_${chainStr}`
}

const swapSetSelected = ref<BotSettingKey>('s1')

watch(selectedChainVals, (newChains) => {
  try {
    const key = getChainStorageKey(newChains)
    const saved = localStorage.getItem(key)
    swapSetSelected.value = (saved as BotSettingKey) || 's1'
  } catch (e) {
    console.error('Failed to load swap preset', e)
  }
}, { immediate: true })

watch(swapSetSelected, (newValue) => {
  try {
    const key = getChainStorageKey(selectedChainVals.value)
    localStorage.setItem(key, newValue)
  } catch (e) {
    console.error('Failed to save swap preset', e)
  }
})

// ==================== 计算属性 ====================
const txTypeList = computed(() => [
  { label: t('onlyBuy'), value: 0 },
  { label: t('onlySell'), value: 1 },
])

const walletManageProps = computed(() => ({
  scrollHeight: props.scrollHeight,
}))

// ✅ 优化2：缓存过滤结果，避免重复遍历
const filterDataSource = computed(() => {
  if (!minVol.value) return dataSource.value
  
  return dataSource.value.filter((item: any) => {
    return item?._main_Token?.totalNumber && (Number(item._main_Token.totalNumber) >= minVol.value)
  })
})

const columns = computed(() => {
  return props.isLarge ? [
    { title: t('wallet'), dataKey: 'wallet', key: 'wallet', align: 'left', minWidth: 125 },
    { title: t('type'), dataKey: 'type', key: 'type', minWidth: 110, align: 'right' },
    { title: t('value'), dataKey: 'amount', key: 'amount', align: 'right', minWidth: 80 },
    { title: t('token'), dataKey: 'symbol', key: 'symbol', align: 'right', minWidth: 150 },
    { title: t('mcap'), dataKey: 'mc', key: 'mc', align: 'right', minWidth: 70 },
    { title: t('time'), dataKey: 'time', key: 'time', align: 'right', minWidth: 40 },
    { title: '', dataKey: 'operate', key: 'operate', align: 'right', minWidth: 100 }
  ] : [
    { title: t('wallet'), dataKey: 'wallet', key: 'wallet', align: 'left', minWidth: 240 }
  ]
})

// ==================== 性能优化：缓存机制 ====================

/**
 * ✅ 优化3：使用 Set 替代 O(n²) 去重
 * 将时间复杂度从 O(n*m) 降低到 O(n+m)
 */
const existingIdsCache = computed(() => {
  const ids = new Set<string>()
  const data = dataSourceCache.value
  for (let i = 0; i < data.length; i++) {
    if (data[i]?.id) {
      ids.add(data[i].id)
    }
  }
  return ids
})

/**
 * ✅ 优化4：JSON.parse 缓存
 * 限制缓存大小防止内存泄漏
 */
interface ParsedMsgCache {
  id: string
  data: any
  timestamp: number
}

const parsedMsgCache = new Map<string, { data: any; timestamp: number }>()
const PARSED_CACHE_MAX_SIZE = 500
const PARSED_CACHE_TTL = 5 * 60 * 1000 // 5分钟过期

function getCachedParsedMsg(id: string, msgContent: string): any {
  const cached = parsedMsgCache.get(id)
  
  if (cached) {
    // 检查是否过期
    if (Date.now() - cached.timestamp < PARSED_CACHE_TTL) {
      return cached.data
    } else {
      // 过期则删除
      parsedMsgCache.delete(id)
    }
  }
  
  try {
    const parsed = JSON.parse(msgContent)
    
    // 设置缓存
    parsedMsgCache.set(id, { data: parsed, timestamp: Date.now() })
    
    // 限制缓存大小
    if (parsedMsgCache.size > PARSED_CACHE_MAX_SIZE) {
      const oldestKey = parsedMsgCache.keys().next().value
      parsedMsgCache.delete(oldestKey)
    }
    
    return parsed
  } catch (e) {
    console.error('Failed to parse msg_content:', e)
    return null
  }
}

/**
 * ✅ 优化5：BigNumber 计算结果缓存
 */
interface BigNumberCalcResult {
  total: string
  totalNumber: string
}

const bigNumberCalcCache = new Map<string, BigNumberCalcResult>()
const BIG_NUMBER_CACHE_MAX_SIZE = 300

function getCachedBigNumberCalc(item: any, isBuy: boolean): BigNumberCalcResult {
  const cacheKey = `${item.id}_${isBuy ? 'buy' : 'sell'}`
  const cached = bigNumberCalcCache.get(cacheKey)
  
  if (cached) {
    return cached
  }
  
  try {
    const amount = item[isBuy ? 'from_amount' : 'to_amount'] || 0
    const price = item[isBuy ? 'from_price_usd' : 'to_price_usd'] || 0
    const bnAmount = new BigNumber(amount)
    const bnPrice = new BigNumber(price)
    const product = bnAmount.times(bnPrice)
    
    const result: BigNumberCalcResult = {
      total: '$' + formatNumber2(product.toFixed(0) || 0, 2, 4, 4),
      totalNumber: product.toFixed(0) || 0
    }
    
    // 限制缓存大小
    if (bigNumberCalcCache.size > BIG_NUMBER_CACHE_MAX_SIZE) {
      const oldestKey = bigNumberCalcCache.keys().next().value
      bigNumberCalcCache.delete(oldestKey)
    }
    
    bigNumberCalcCache.set(cacheKey, result)
    return result
  } catch (e) {
    console.error('BigNumber calculation error:', e)
    return { total: '$0', totalNumber: '0' }
  }
}

// ==================== 数据处理函数 ====================

function getIsBuy(item: { position_type?: string | number; tx_type?: string | number }): boolean {
  if (item.position_type !== undefined) {
    return item.position_type === 0 || item.position_type === 1
  }
  return item.tx_type === 0
}

function getTxType(item: { position_type?: string | number; tx_type?: string | number }): string {
  if (item.position_type !== undefined) {
    const types = [t('createPosition'), t('addPosition'), t('reducePosition'), t('closePosition')]
    return types?.[Number(item.position_type)] || ''
  }
  const types = [t('buy'), t('sell')]
  return types?.[Number(item.tx_type)] || ''
}

/**
 * ✅ 优化6：格式化交易信息（使用缓存）
 */
interface FormattedTxInfo {
  _marker: {
    maker_address: string
    maker_alias?: string
    maker_logo?: string
    maker_tags?: any[]
    isBuy: boolean
  }
  _profit: string | number
  _profit_ratio: string | number
  _mc: string
  _type: string
  _rise: boolean
  _main_Token: {
    amount: string
    price: string
    symbol: string
    total: string
    totalNumber: string
    address: string
    tags: any[]
    signals: any[]
  }
  _target_Token: {
    amount: string
    price: string
    total: string
    symbol: string
    address: string
    tags: any[]
    signals: any[]
    logo_url?: string
  }
  [key: string]: any
}

 // const {
  // from_address = '',
  // from_symbol = '',
  // from_logo = '',
  // from_amount = '',
  // from_price_usd = '',
  // from_tags = [{ "label": "", "icon": "" }], // token的标签, 只有当时target token才会有
  // from_signals = [{ "label": "", "icon": "" }], // token 信号, 只有当时target token才会有

  // to_address = '',
  // to_symbol = '',
  // to_logo = '',
  // to_amount = '',
  // to_price_usd = '',
  // to_tags = [{ "label": "", "icon": "" }], // token的标签, 只有当时target token才会有
  // to_signals = [{ "label": "", "icon": "" }], // token 信号, 只有当时target token才会有

  // target_address = '',
  // position_type,// 0-建仓，1-加仓，2-减仓，3-清仓。注意 该字段可能没有时，就只显示 tx_type
  // tx_type, // 0-买入，1-卖出
  // maker_address = "", // 交易用户地址
  // maker_alias = "", // 用户地址的别名, 找 @Ethan 问表
  // maker_logo = "", // 用户的图像
  // maker_tags = [{ "key": "", "label": "", "icon": "" }], // 用户地址标签 @Ethan kol
  // avg_price_usd = '', // 平均成本价，用usd计价
  // pnl_ratio = '', // pnl 百分比
  // pnl_usd = '', // pnl 值
  // position_usd = '', // 当前持仓金额,
  // target_mcap='', // 主币市值，
  // } = item
function formateTxInfo(item: any): FormattedTxInfo {
  const isBuy = getIsBuy(item)
  
  // 使用缓存的 BigNumber 计算结果
  const calcResult = getCachedBigNumberCalc(item, isBuy)
  
  return {
    ...item,
    _marker: {
      maker_address: item?.maker_address || item?.wallet_address,
      maker_alias: item?.maker_alias,
      maker_logo: item?.maker_logo,
      maker_tags: item?.maker_tags,
      isBuy
    },
    _profit: item?.pnl_usd == '--' ? '--' : item?.pnl_usd,
    _profit_ratio: item?.pnl_usd == '--' ? '--' : item?.pnl_ratio,
    _mc: Number(item?.target_mcap) 
      ? ('$' + formatNumberS(item?.target_mcap || 0, { decimals: 0, limit: 3 }))
      : '--',
    _type: getTxType(item),
    _rise: item?.pnl_usd == '--' ? true : item?.pnl_usd >= 0,
    _main_Token: {
      amount: formatNumber2(item[isBuy ? 'from_amount' : 'to_amount'] || 0, 1),
      price: '$' + formatNumber2(item[isBuy ? 'from_price_usd' : 'to_price_usd'] || 0),
      symbol: item[isBuy ? 'from_symbol' : 'to_symbol'],
      total: calcResult.total,
      totalNumber: calcResult.totalNumber,
      address: item[isBuy ? 'from_address' : 'to_address'],
      tags: item[isBuy ? 'from_tags' : 'to_tags'],
      signals: item[isBuy ? 'from_signals' : 'to_signals'],
    },
    _target_Token: {
      amount: formatNumber2(item[!isBuy ? 'from_amount' : 'to_amount'] || 0, 1),
      price: '$' + formatNumber2(item[!isBuy ? 'from_price_usd' : 'to_price_usd'] || 0),
      total: '',
      symbol: item[!isBuy ? 'from_symbol' : 'to_symbol'],
      address: item[!isBuy ? 'from_address' : 'to_address'],
      tags: item[!isBuy ? 'from_tags' : 'to_tags'],
      signals: item[!isBuy ? 'from_signals' : 'to_signals'],
      logo_url: item[!isBuy ? 'from_logo' : 'to_logo'],
    }
  }
}

/**
 * ✅ 优化7：WebSocket 数据合并（使用 Set 去重）
 * 性能提升：O(n*m) → O(n+m)
 */
function mergeDataSource(msg: any[]): void {
  if (!msg?.length) return
  
  const existingIds = existingIdsCache.value
  const newData: any[] = []
  
  // 单次遍历，O(n) 复杂度
  for (let i = 0; i < msg.length; i++) {
    const item = msg[i]
    if (!existingIds.has(item.id)) {
      newData.push({
        ...item,
        ...formateTxInfo(item)
      })
    }
  }
  
  if (!newData.length) return
  
  // 合并并限制数据量
  const combined = [...newData, ...dataSourceCache.value]
  if (combined.length > 200) {
    combined.length = 100  // 直接截断，比 splice 快
  }
  
  // 直接赋值，避免 splice 的性能开销
  dataSourceCache.value = combined
}

/**
 * ✅ 优化8：使用 requestAnimationFrame 批量更新视图
 * 减少不必要的 DOM 操作
 */
let updateFrameId: number | null = null

const updateDateSource = throttle(function () {
  if (!visible.value || activeName.value !== 0) return
  
  // 取消之前的帧更新请求
  if (updateFrameId !== null) {
    cancelAnimationFrame(updateFrameId)
  }
  
  // 在下一帧更新，批量处理
  updateFrameId = requestAnimationFrame(() => {
    dataSource.value = dataSourceCache.value  // 直接赋值
    updateFrameId = null
  })
}, 500, { leading: true, trailing: true })

// ==================== API 调用函数 ====================

const refreshMonitorList = useDebounceFn(() => {
  const monitor_type: Array<'sell' | 'buy'> = []
  if (txType.value.includes(0)) monitor_type.push('buy')
  if (txType.value.includes(1)) monitor_type.push('sell')
  
  batchPauseMonitor(monitor_type, selectedChain.value.map(i => i.id).join(','))
    .then(() => getMonitorList())
    .catch(err => console.error('Failed to refresh monitor list:', err))
}, 500)

function getMonitorList(): void {
  if (!botStore.evmAddress) return
  
  loading.value = true
  let filtered_type = ''
  
  if (txType.value.length !== txTypeList.value.length) {
    filtered_type = txType.value.join(',')
  }
  
  getHistoryMonitor({
    chain: selectedChain.value.map(i => i.id).join(','),
    amt_u_min: String(minVol.value) || '',
    filtered_type
  })
    .then((res) => {
      let result = res || res?.data || []
      const list: any[] = []
      const seenIds = new Set<string>()
      
      result = Array.isArray(result) ? result : []
      
      // ✅ 使用缓存的 JSON.parse
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        const parsed = getCachedParsedMsg(item.id, item.msg_content)
        
        if (!parsed || seenIds.has(parsed.id)) continue
        
        list.push({
          ...parsed,
          ...formateTxInfo(parsed)
        })
        seenIds.add(parsed.id)
      }
      
      dataSourceCache.value = list.filter(i => txType.value.includes(i.tx_type))
      updateDateSource()
    })
    .catch((err) => {
      console.error('Failed to get monitor list:', err)
    })
    .finally(() => {
      loading.value = false
    })
}

function getFavCount(): void {
  _getFavCount({ self_address: currentAddress.value })
    .then((res) => {
      fav_count.value = res?.fav_count || 0
      monitor_count.value = res?.monitor_count || 0
    })
    .catch(err => console.error('Failed to get fav count:', err))
}

function init(): void {
  getMonitorList()
  getFavCount()
}

// ==================== 事件处理函数 ====================

function handleClick(name: number | string): void {
  if (name === 1) {
    updateDateSource()
  }
}

function handleConfirmAdd(formData?: any, resetFields?: () => void, stopLoading?: () => void): void {
  addAttention2({
    address: botStore.evmAddress,
    user_chain: formData?.user_chain?.id,
    user_address: formData?.address,
    remark: formData?.remark,
    group: formData?.group_id,
    is_monitored: 0
  })
    .then(() => {
      resetFields?.()
      stopLoading?.()
      addFavAddressPopRef.value?.close?.()
      updateNum3.value++
    })
    .catch((err) => {
      console.error('Failed to add attention:', err)
    })
}

function jumpBalance(row: any, e: Event): void {
  e.stopPropagation()
  const chain = row?.chain || 'eth'
  const address = row?._marker?.maker_address || row?.wallet_address
  if (address) {
    navigateTo(`/address/${address}/${chain}`)
  }
}

function jumpToken({ e, rowData }: { e: Event; rowData: any }): void {
  e.stopPropagation()
  const addr = rowData?._target_Token?.address + '-' + rowData.chain
  navigateTo(`/token/${addr}`, { replace: true })
}

// ==================== 生命周期钩子 ====================

onMounted(() => {
  nextTick(() => {
    // 初始化逻辑
  })
  init()
})

useVisibilityChange(() => {
  botStore.bot_subscribe()
  if (visible.value && activeName.value === 0) {
    updateDateSource()
  }
})

// ✅ 优化9：组件卸载时清理缓存，防止内存泄漏
onBeforeUnmount(() => {
  parsedMsgCache.clear()
  bigNumberCalcCache.clear()
  if (updateFrameId !== null) {
    cancelAnimationFrame(updateFrameId)
  }
  debouncedSaveQuickBuyValue.cancel()
})

// ==================== Watchers ====================

watch(() => wsStore.wsResult[WSEventType.MONITOR], (val) => {
  if (loading.value) return
  mergeDataSource(val)
  if (visible.value && activeName.value === 0 && !isHoverTable.value) {
    updateDateSource()
  }
})

watch(isHoverTable, (val) => {
  if (val) {
    nextTick(() => updateDateSource())
  }
})

watch(() => updateNum2.value + updateNum3.value + updateNum13.value, (val) => {
  if (val) {
    if (!monitor_count.value) {
      getMonitorList()
    }
    getFavCount()
  }
})

watch(txType, () => {
  refreshMonitorList()
})

watch(selectedChain, (val, oldVal) => {
  if (JSON.stringify(val) === JSON.stringify(oldVal)) return
  refreshMonitorList()
})

watch(visible, (val) => {
  if (!val) return
  if (activeName.value === 0) {
    updateDateSource()
    nextTick(() => {
      if (!firstActivated.value && aveTableRef.value) {
        aveTableRef.value.scrollToTop(0)
      }
      firstActivated.value = false
    })
  }
})

watch(() => botStore.evmAddress, (val) => {
  if (!val) {
    dataSource.value = []
  } else {
    init()
  }
})
</script>

<style scoped lang="scss">
.m-table {
  :deep() .el-table.el-table-v2 {
    --el-table-header-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-bg-color: transparent;

    /* .el-table-v2__table{
      --el-table-border:1px solid;
    } */
    .el-virtual-scrollbar {
      display: none;
    }
  }
}

.m-tabs {
  :deep() .el-tabs__header {
    --el-border-color-light: var(--dialog-list-hover);
    --el-color-primary: var(--d-E0E0E0-l-333);
    --el-text-color-primary: var(--third-text);
  }

  --el-tabs-header-height:44px;

  :deep() .el-tabs__item {
    font-weight: 400;

    &:hover {
      color: var(--third-text);

      &.is-active {
        color: var(--d-E0E0E0-l-333);
      }
    }

    &.is-disabled {
      cursor: pointer;
    }
  }

  :deep() .el-tabs__header {
    margin-bottom: 0;
  }

  :deep() .el-tabs__nav-wrap::after,
  :deep() .el-tabs__active-bar {
    height: 1px;
  }

  :deep() .el-tabs__nav.is-top {
    width: 100%;

    .el-tabs__item {
      padding: 0 12px;

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(6) {
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: auto;
      }

      &:nth-child(5) {
        flex: 1;
        padding: 0;
      }

      &:nth-child(4),
      &:last-child {
        padding: 0;
        justify-content: flex-start;
        color: inherit;
      }
    }
  }
}

:deep() .el-button--small {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

:deep() .w-quickSwap .m-text {
  margin-top: -2px;
}
:deep() .w-ChainSelector .el-select__wrapper{
  background-color: transparent;
  &.is-focused{
    box-shadow: none;
  }
  .el-select__prefix{
    img{
      width: 16px;
      height: 16px;
    }
  }
  .el-select__suffix{
    .el-select__icon{
      width: 12px;
      height: 12px;
    }
  }
  .el-select__selection{
    display: none;
  }
}
</style>
<style lang="scss">
.monitor-chain-selector-popper{
  width: 130px;
}
</style>
