<template>
  <div class="items-center inline-flex">
    <!-- Button 类型展示 -->
    <div
      v-if="isQuickSupported && settingsButtonVisible1 && displayType === 'button'"
      class="mr-8px flex justify-end items-center text-12px">
      <div
        class="flex items-center justify-between p-1px rounded-4px text-12px bg-[--main-input-button-bg] px-2px py-2px"
        :style="{ height: componentHeight + 'px' }">

        <button
          v-for="item in BotSettingsArr"
          :id="item.value"
          :key="item.value"
          :ref="setBtnRef"
          class="cursor-pointer border-none font-400 rounded-4px min-w-24px py-5px px-5px text-center"
          :class="`${item.value === props.customSelected?'color-[--main-text1] bg-[--tab-active-bg]':'color-[--secondary-text] bg-transparent'}`"
          type="button"
          @click.stop="handlePresetChange(item.value)"
          @mouseenter="showPopover(item.value)"
          @mouseleave="visible = false"

        >
          {{ item.label }}
        </button>
      </div>
    </div>
    <!-- Select 类型展示 -->
    <el-select
      v-else-if="isQuickSupported && settingsButtonVisible1 && displayType === 'select'"
      ref="selectRef"
      v-model="customSelectedLocal"
      class="mr-8px quick-swap-select"
      size="small"
      :suffix-icon="CaretBottom"
      popper-class="new-popover"
      :style="{ '--component-height': componentHeight + 'px' }"
      @visible-change="handleSelectVisibleChange"
      @change="handlePresetChange"
      @mouseenter="handleSelectHover"
      @mouseleave="handleSelectLeave"
    >
      <el-option
        v-for="item in BotSettingsArr"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- 用于下拉选项的独立 popover -->
    <el-popover
      v-model:visible="optionPopoverVisible"
      popper-class="new-popover"
      :virtual-ref="optionPopoverRef"
      virtual-triggering
      trigger="click"
      placement="right-start"
      popper-style="min-width: auto; width: auto;"
      :persistent="false"
      :teleported="true"
      :show-after="0"
      :hide-after="0"
    >
      <div class="text-12px flex gap-16px">
        <ul v-for="chainItem in chainList" :key="chainItem" class="min-w-120px">
          <li class="mb-4px flex-start">
            <span class="mr-4px color-[--third-text] font-500">{{ getChainLabel(chainItem) }}</span>
          </li>
          <li class="mb-4px flex-start">
            <Icon name="custom:slippage" class="color-[--third-text] ml-0 mr-6px cursor-pointer min-w-16px"/>
            <span class="mr-4px color-[--third-text]">{{ $t('slippage') }}</span>
            <span v-if="botSettingStore.botSettings?.[chainItem]?.buy?.[optionSelected]?.slippage !== 'auto'">
              {{ botSettingStore.botSettings?.[chainItem]?.buy?.[optionSelected]?.slippage }}%
            </span>
            <span v-else>{{ $t('auto') }}</span>
          </li>
          <li v-if="isEvmChain(chainItem)" class="mt-4px mb-4px flex-start">
            <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="color-[--third-text] ml-0 mr-3px cursor-pointer min-w-18px"/>
            <span class="mr-5px color-[--third-text]">{{ $t('estimatedGas') }}</span>
            <span>${{ getOptionEstimatedGas(chainItem) }}</span>
          </li>
          <li v-if="chainItem === 'solana'" class="mt-4px mb-4px flex-start">
            <Icon name="custom:gas" class="color-[--third-text] mr-3px cursor-pointer ml-0 min-w-18px"/>
            <span class="mr-5px color-[--third-text] whitespace-nowrap block">{{ $t('priorityFee') }}</span>
            <span class="whitespace-nowrap">{{ getOptionPriorityFee(chainItem) }} SOL</span>
          </li>
          <li class="mt-4px mb-4px flex-start">
            <Icon :name="`custom:half-${globalStore.mode}`" class="text-18px color-[--third-text] ml-0 mr-3px cursor-pointer min-w-18px"/>
            <span class="mr-5px color-[--third-text] whitespace-nowrap">{{ $t('autoSellHalf') }}</span>
            <span>{{ botSettingStore.autoSellConfigs?.autoSell ? $t('on') : $t('off') }}</span>
          </li>
          <li class="mt-4px flex-start">
            <Icon name="custom:mev" class="text-14px color-[--third-text] ml-0 mt--2px mr-3px cursor-pointer min-w-18px"/>
            <span class="mr-5px color-[--third-text]">{{ $t('mev') }}</span>
            <span>{{ botSettingStore.botSettings?.[chainItem]?.buy?.[optionSelected]?.mev ? $t('on') : $t('off') }}</span>
          </li>
        </ul>
      </div>
    </el-popover>
    <!-- 多链金额输入下拉框 -->
    <el-popover
      v-if="chainList.length > 1"
      v-model:visible="amountDropdownVisible"
      popper-class="new-popover amount-dropdown-popover"
      placement="bottom-start"
      :offset="0"
      :show-arrow="false"
      popper-style="padding: 4px;"
      :persistent="false"
      :teleported="true"
      trigger="click"
      @hide="handleAmountDropdownHide"
    >
      <template #reference>
        <div
          ref="amountInputRef"
          class="quick-buy-input quick-buy-display"
          :style="{ '--component-height': componentHeight + 'px' }"
        >
          <div class="el-input__wrapper">
            <span class="el-input__prefix">
              <img
                v-if="sortedChainList.length > 0"
                class="rounded-full w-14px h-14px"
                :src="`${configStore.token_logo_url}chain/${sortedChainList[0]}.png`"
                alt=""
                onerror="this.src='/icon-default.png'"
              >
            </span>
            <input
              class="el-input__inner"
              :value="getFirstChainValue()"
              readonly
              placeholder="0"
            >
          </div>
        </div>
      </template>
      <div class="text-12px flex flex-col gap-4px" style="width: 100%;">
        <template v-for="chainItem in sortedChainList" :key="chainItem">
          <el-input
            :model-value="chainAmountMap[chainItem] || ''"
            class="chain-amount-input"
            placeholder="0"
            type="text"
            size="small"
            :style="{ '--component-height': componentHeight + 'px' }"
            @update:model-value="(value: string | number) => {
              chainAmountMap[chainItem] = formatInputValue(value)
            }"
            @blur="handleChainAmountBlur(chainItem)"
            @keydown.enter="(e: any) => {
              handleChainAmountBlur(chainItem)
              e?.target?.blur()
            }"
            @click.stop
          >
            <template #prefix>
              <img
                class="rounded-full w-14px h-14px mr-0px!"
                :src="`${configStore.token_logo_url}chain/${chainItem}.png`"
                alt=""
                onerror="this.src='/icon-default.png'"
              >
            </template>
          </el-input>
        </template>
      </div>
    </el-popover>
    <!-- 单链模式：真实输入框 -->
    <el-input
      v-else
      ref="amountInputRef"
      v-model="quickBuyValue1"
      class="quick-buy-input"
      placeholder="0"
      type="text"
      :style="{ '--component-height': componentHeight + 'px' }"
      @blur="handleBlurBuyValue(quickBuyValue1)"
      @keydown.enter="(e: any) => e?.target?.blur()"
      >
      <template #prefix>
        <img
          v-if="chainList.length > 0"
          class="rounded-full w-14px h-14px mr-4px!"
          :src="`${configStore.token_logo_url}chain/${chainList[0]}.png`"
          alt=""
          onerror="this.src='/icon-default.png'"
          srcset=""
        >
      </template>
    </el-input>
    <el-popover
      v-model:visible="visible"
      popper-class="new-popover"
      :virtual-ref="currentBtnRef"
      virtual-triggering
      trigger="contextmenu"
      placement="bottom"
      popper-style="min-width: auto; width: auto;"
      :persistent="false"
    >
      <div class="text-12px flex gap-16px">
        <ul v-for="chainItem in chainList" :key="chainItem" class="min-w-120px">
          <li class="mb-4px flex-start">
            <span class="mr-4px color-[--third-text] font-500">{{ getChainLabel(chainItem) }}</span>
          </li>
          <li class="mb-4px flex-start">
            <Icon name="custom:slippage" class="color-[--third-text] ml-0 mr-6px cursor-pointer min-w-16px"/>
            <span class="mr-4px color-[--third-text]">{{ $t('slippage') }}</span>
            <span v-if="botSettingStore.botSettings?.[chainItem]?.buy?.[selected]?.slippage !== 'auto'">
              {{ botSettingStore.botSettings?.[chainItem]?.buy?.[selected]?.slippage }}%
            </span>
            <span v-else>{{ $t('auto') }}</span>
          </li>
          <li v-if="isEvmChain(chainItem)" class="mt-4px mb-4px flex-start">
            <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="color-[--third-text] ml-0 mr-3px cursor-pointer min-w-18px"/>
            <span class="mr-5px color-[--third-text]">{{ $t('estimatedGas') }}</span>
            <span>${{ getEstimatedGas(chainItem) }}</span>
          </li>
          <li v-if="chainItem === 'solana'" class="mt-4px mb-4px flex-start">
            <Icon name="custom:gas" class="color-[--third-text] mr-3px cursor-pointer ml-0 min-w-18px"/>
            <span class="mr-5px color-[--third-text] whitespace-nowrap block">{{ $t('priorityFee') }}</span>
            <span class="whitespace-nowrap">{{ getChainPriorityFee(chainItem) }} SOL</span>
          </li>
          <li class="mt-4px mb-4px flex-start">
            <Icon :name="`custom:half-${globalStore.mode}`" class="text-18px color-[--third-text] ml-0 mr-3px cursor-pointer min-w-18px"/>
            <span class="mr-5px color-[--third-text] whitespace-nowrap">{{ $t('autoSellHalf') }}</span>
            <span>{{ botSettingStore.autoSellConfigs?.autoSell ? $t('on') : $t('off') }}</span>
          </li>
          <li class="mt-4px flex-start">
            <Icon name="custom:mev" class="text-14px color-[--third-text] ml-0 mt--2px mr-3px cursor-pointer min-w-18px"/>
            <span class="mr-5px color-[--third-text]">{{ $t('mev') }}</span>
            <span>{{ botSettingStore.botSettings?.[chainItem]?.buy?.[selected]?.mev ? $t('on') : $t('off') }}</span>
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import { nextTick } from 'vue'
import BigNumber from 'bignumber.js'
import SlippageSet from '~/pages/token/components/right/botSwap/slippageSet.vue'
import {formatBotGasTips} from '@/utils/bot'
import {isEvmChain, getRpcProvider} from '@/utils'
import type { BotChain, BotSettingKey } from '~/utils/types'
import { CaretBottom } from '@element-plus/icons-vue'
import { SupportMonitorChain } from '@/utils/constants'

const botStore = useBotStore()
const configStore = useConfigStore()
const botSwapStore = useBotSwapStore()
const botSettingStore = useBotSettingStore()
const tokenStore = useTokenStore()
const walletStore = useWalletStore()
const emit = defineEmits(['update:quickBuyValue', 'update:customSelected'])
const props = withDefaults(defineProps<{
  chain: BotChain | BotChain[]
  quickBuyValue?: string | Record<BotChain, string>
  showQuickAmount?: boolean
  settingsButtonVisible?:boolean
  quickTextVisible?:boolean
  customSelected?: BotSettingKey
  displayType?: 'button' | 'select'
  height?: number | string
}>(), {
  quickBuyValue: '0.01',
  settingsButtonVisible:true,
  quickTextVisible:true,
  customSelected: 's1',
  displayType: 'button',
  height: 28
})
const globalStore = useGlobalStore()

// 统一将 chain 转换为数组
const chainList = computed(() => {
  return Array.isArray(props.chain) ? props.chain : [props.chain]
})

// 按照 SupportMonitorChain 的顺序排序当前选中的链
const sortedChainList = computed(() => {
  // 创建 SupportMonitorChain 的索引映射
  const orderMap = new Map<string, number>()
  SupportMonitorChain.forEach((chain, index) => {
    orderMap.set(chain, index)
  })
  
  // 对 chainList 进行排序
  return [...chainList.value].sort((a, b) => {
    const orderA = orderMap.get(a) ?? Number.MAX_SAFE_INTEGER
    const orderB = orderMap.get(b) ?? Number.MAX_SAFE_INTEGER
    return orderA - orderB
  })
})

// 解析 quickBuyValue，兼容字符串和对象类型
function parseQuickBuyValue(): Record<BotChain, string> {
  const map: Record<BotChain, string> = {} as Record<BotChain, string>
  
  if (typeof props.quickBuyValue === 'string') {
    // 字符串类型：所有链使用相同的值
    chainList.value.forEach(chain => {
      map[chain] = props.quickBuyValue || '0.01'
    })
  } else if (typeof props.quickBuyValue === 'object' && props.quickBuyValue !== null) {
    // 对象类型：每个链有独立的值
    chainList.value.forEach(chain => {
      map[chain] = (props.quickBuyValue as Record<BotChain, string>)[chain] || '0.01'
    })
  } else {
    // 默认值
    chainList.value.forEach(chain => {
      map[chain] = '0.01'
    })
  }
  
  return map
}

const gasPriceObj: Record<string, number> = reactive({})

const gasPrice = computed(() => {
  const firstChain = chainList.value[0]
  return firstChain ? (gasPriceObj?.[firstChain] || 0) : 0
})

// 计算统一的高度值（转换为 px 单位）
const componentHeight = computed(() => {
  const h = typeof props.height === 'number' ? props.height : parseInt(props.height, 10)
  return isNaN(h) ? 28 : h
})

const visible = ref(false)
const selected = ref<BotSettingKey>('s1')
const btnRefs = ref<Record<string, HTMLElement | null>>({})
const currentBtnRef = ref<HTMLElement | null>(null)
const selectRef = ref<any>(null)
const amountInputRef = ref<any>(null)

// 用于下拉选项的 popover
const optionPopoverVisible = ref(false)
const optionPopoverRef = ref<HTMLElement | null>(null)
const optionSelected = ref<BotSettingKey>('s1')
let optionPopoverHideTimer: ReturnType<typeof setTimeout> | null = null

// 多链金额输入下拉框
const amountDropdownVisible = ref(false)
const chainAmountMap = ref<Record<BotChain, string>>({} as Record<BotChain, string>)

// 从 props 解析并初始化 chainAmountMap
function syncFromProps() {
  const map: Record<BotChain, string> = {} as Record<BotChain, string>
  
  if (typeof props.quickBuyValue === 'string') {
    // 字符串类型：所有链使用相同的值
    chainList.value.forEach(chain => {
      map[chain] = props.quickBuyValue || '0.01'
    })
  } else if (typeof props.quickBuyValue === 'object' && props.quickBuyValue !== null) {
    // 对象类型：每个链有独立的值
    chainList.value.forEach(chain => {
      map[chain] = (props.quickBuyValue as Record<BotChain, string>)[chain] || '0.01'
    })
  } else {
    // 默认值
    chainList.value.forEach(chain => {
      map[chain] = '0.01'
    })
  }
  
  chainAmountMap.value = map
}

// 监听链列表变化，完全重新初始化
watch(() => chainList.value, (newChains, oldChains) => {
  if (!oldChains || JSON.stringify(newChains) !== JSON.stringify(oldChains)) {
    syncFromProps()
  }
}, { immediate: true })

// 监听预设值变化，重新同步
watch(() => props.customSelected, () => {
  syncFromProps()
})

// 监听 quickBuyValue prop 变化，只在弹框关闭时同步
watch(() => props.quickBuyValue, (newValue, oldValue) => {
  // 如果弹框是打开的，不同步（避免覆盖用户正在编辑的值）
  if (amountDropdownVisible.value) {
    return
  }
  
  // 深度比较，如果内容相同也跳过
  if (typeof newValue === 'object' && typeof oldValue === 'object' && newValue !== null && oldValue !== null) {
    if (JSON.stringify(newValue) === JSON.stringify(oldValue)) {
      return
    }
  }
  
  syncFromProps()
}, { deep: true })

const isWallet = computed(() => {
  return (walletStore.provider && walletStore.address && !botStore.evmAddress)
})
const isQuickSupported = computed(()=>{
  return chainList.value.length > 0 && 
         chainList.value.some(chain => botStore.isSupportChains.includes(chain)) && 
         !isWallet.value
})

const settingsButtonVisible1 = computed(() => {
  return props.settingsButtonVisible && !isWallet.value
})

// 获取链的显示名称
function getChainLabel(chain: BotChain) {
  const labels: Record<BotChain, string> = {
    eth: 'ETH',
    base: 'Base',
    bsc: 'BSC',
    solana: 'Solana',
    xlayer: 'XLayer',
    ton: 'TON'
  }
  return labels[chain] || chain
}

// 处理预设变更 - 批量设置所有链
function handlePresetChange(value: BotSettingKey) {
  // 更新所有链的预设
  chainList.value.forEach(chain => {
    if (botStore.isSupportChains.includes(chain) && botSettingStore.botSettings[chain]) {
      if (!botSettingStore.botSettings[chain].buy) {
        botSettingStore.botSettings[chain].buy = {
          selected: 's1',
          s1: botSettingStore.botSettings[chain].s1,
          s2: botSettingStore.botSettings[chain].s2,
          s3: botSettingStore.botSettings[chain].s3
        }
      }
      botSettingStore.botSettings[chain].buy!.selected = value
    }
  })
  
  // 触发事件通知父组件
  emit('update:customSelected', value)
}

// 通用的 priority fee 计算函数
function calculatePriorityFee(chain: BotChain, settingKey: BotSettingKey) {
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const botSettings = botSettingStore.botSettings?.[chain]?.buy?.[settingKey]
  const mev = botSettings?.mev

  const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
}

const botPriorityFee = computed(() => {
  const firstChain = chainList.value[0]
  return firstChain ? calculatePriorityFee(firstChain, selected.value) : ''
})

function getChainPriorityFee(chain: BotChain) {
  return calculatePriorityFee(chain, selected.value)
}

// 获取第一个链的值（用于多链模式显示）- 使用排序后的第一个链
function getFirstChainValue() {
  if (sortedChainList.value.length > 0) {
    const firstChain = sortedChainList.value[0]
    return chainAmountMap.value[firstChain] || 
           (typeof props.quickBuyValue === 'object' 
             ? (props.quickBuyValue as Record<BotChain, string>)[firstChain] 
             : '0.01') ||
           '0.01'
  }
  return '0.01'
}

// 格式化输入值：只允许数字和小数点，防止多个小数点
function formatInputValue(value: string | number | undefined): string {
  const strValue = String(value ?? '')
  const filtered = strValue.replace(/\-|[^\d.]/g, '')
  const parts = filtered.split('.')
  return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : filtered
}

// 格式化金额（保留指定小数位）
function formatAmount(value: string, decimals = 4): string {
  const v1 = new BigNumber(value || 0)?.toFixed?.().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
  
  if (value === '') return ''
  if (Number(v1) === 0) return '0'
  return v1
}

// 构建完整的 quickBuyValue 对象（保留所有原有链）
function buildQuickBuyValueObject(): Record<BotChain, string> {
  if (typeof props.quickBuyValue === 'object' && props.quickBuyValue !== null) {
    // 基于 props 复制所有原有的键
    const newValue = { ...(props.quickBuyValue as Record<BotChain, string>) }
    // 更新 chainList 中的链
    chainList.value.forEach(c => {
      newValue[c] = chainAmountMap.value[c] || '0.01'
    })
    return newValue
  } else {
    // 如果 props 不是对象，只包含 chainList 中的链
    const newValue = {} as Record<BotChain, string>
    chainList.value.forEach(c => {
      newValue[c] = chainAmountMap.value[c] || '0.01'
    })
    return newValue
  }
}

const quickBuyValue1 = computed({
  get() {
    // 单链模式，直接返回 props
    return typeof props.quickBuyValue === 'string' 
      ? props.quickBuyValue 
      : '0.01'
  },
  set(value) {
    // 单链模式，直接 emit 字符串
    emit('update:quickBuyValue', value)
  }
})

// 多链模式下，更新 chainAmountMap 并 emit 的辅助函数
function updateChainAmountAndEmit(chain: BotChain, value: string) {
  const filtered = String(value || '').replace(/\-|[^\d.]/g, '')
  chainAmountMap.value[chain] = filtered
  
  // 基于 props.quickBuyValue 构建新对象，保留所有原有的链
  let newValue: Record<BotChain, string>
  
  if (typeof props.quickBuyValue === 'object' && props.quickBuyValue !== null) {
    // 保留所有原有的键
    newValue = { ...(props.quickBuyValue as Record<BotChain, string>) }
    // 更新当前链
    newValue[chain] = chainAmountMap.value[chain] || '0.01'
  } else {
    // 如果 props 不是对象，只包含当前链
    newValue = {} as Record<BotChain, string>
    newValue[chain] = chainAmountMap.value[chain] || '0.01'
  }
  
  emit('update:quickBuyValue', newValue)
}

const customSelectedLocal = computed({
  get() {
    return props.customSelected
  },
  set(value) {
    emit('update:customSelected', value)
  }
})
function handleBlurBuyValue(value: string) {
  const decimals = 4
  const v = value
  const v1 = new BigNumber(v || 0)?.toFixed?.().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0] || ''
  if (String(v) !== String(v1)) {
    if (v === '') {
      quickBuyValue1.value = ''
    } else if (Number(v1) === 0) {
      quickBuyValue1.value = '0'
    } else {
      quickBuyValue1.value = v1
    }
  }
}

function setBtnRef(el: Element | ComponentPublicInstance | null) {
  if (el && 'id' in el && el.id) {
    btnRefs.value[el.id] = el as HTMLElement
  }
}

// 处理金额输入框点击（多链模式下由 trigger="click" 自动处理）
function handleAmountInputClick() {
  if (chainList.value.length > 1) {
    syncFromProps()
  }
}

// 处理弹框关闭 - 统一 emit 所有链的值
function handleAmountDropdownHide() {
  if (chainList.value.length > 1) {
    // 格式化所有链的值
    chainList.value.forEach(chain => {
      chainAmountMap.value[chain] = formatAmount(chainAmountMap.value[chain])
    })
    
    // 构建完整对象并 emit
    emit('update:quickBuyValue', buildQuickBuyValueObject())
  }
}

// 处理单个链的金额失焦（只格式化，不 emit）
function handleChainAmountBlur(chain: BotChain) {
  chainAmountMap.value[chain] = formatAmount(chainAmountMap.value[chain])
}

function showPopover(item: BotSettingKey) {
  selected.value = item
  currentBtnRef.value = btnRefs.value[item] || null
  visible.value = true
  // 获取所有链的 Gas 价格
  chainList.value.forEach(chain => {
    if (isEvmChain(chain)) {
      getGasPrice(chain)
    }
  })
}

function handleSelectVisibleChange(visible: boolean) {
  if (visible && customSelectedLocal.value) {
    selected.value = customSelectedLocal.value
    // 获取所有链的 Gas 价格
    chainList.value.forEach(chain => {
      if (isEvmChain(chain)) {
        getGasPrice(chain)
      }
    })
    // 当下拉框展开时，监听选项的 hover 事件
    nextTick(() => {
      attachOptionHoverListeners()
    })
  } else {
    // 下拉框关闭时，隐藏选项 popover 并清除定时器
    optionPopoverVisible.value = false
    if (optionPopoverHideTimer) {
      clearTimeout(optionPopoverHideTimer)
      optionPopoverHideTimer = null
    }
  }
}

function attachOptionHoverListeners() {
  // 查找 el-select 的下拉弹窗
  const popper = document.querySelector('.el-select-dropdown')
  if (!popper) return

  // 获取所有选项
  const options = popper.querySelectorAll('.el-select-dropdown__item')
  
  options.forEach((option, index) => {
    const item = BotSettingsArr[index]
    if (!item) return

    // 移除旧的事件监听器（如果存在）
    option.removeEventListener('mouseenter', handleOptionMouseEnter)
    option.removeEventListener('mouseleave', handleOptionMouseLeave)
    
    // 存储选项值到 DOM 元素上
    ;(option as any).__botSettingKey = item.value
    
    // 添加新的事件监听器
    option.addEventListener('mouseenter', handleOptionMouseEnter)
    option.addEventListener('mouseleave', handleOptionMouseLeave)
  })
}

function handleOptionMouseEnter(this: HTMLElement) {
  const itemValue = (this as any).__botSettingKey as BotSettingKey
  if (!itemValue) return
  
  // 清除之前的隐藏定时器
  if (optionPopoverHideTimer) {
    clearTimeout(optionPopoverHideTimer)
    optionPopoverHideTimer = null
  }
  
  optionSelected.value = itemValue
  optionPopoverRef.value = this
  // 立即显示，无延迟
  optionPopoverVisible.value = true
}

function handleOptionMouseLeave() {
  // 增加延迟到 200ms，给快速切换更多时间
  optionPopoverHideTimer = setTimeout(() => {
    optionPopoverVisible.value = false
    optionPopoverHideTimer = null
  }, 200)
}

function handleSelectHover() {
  // hover select 框时显示当前选中项的 popover
  const selectEl = selectRef.value?.$el
  if (selectEl && customSelectedLocal.value) {
    selected.value = customSelectedLocal.value
    currentBtnRef.value = selectEl as HTMLElement
    visible.value = true
    // 获取所有链的 Gas 价格
    chainList.value.forEach(chain => {
      if (isEvmChain(chain)) {
        getGasPrice(chain)
      }
    })
  }
}

function handleSelectLeave() {
  // 延迟隐藏，避免与下拉菜单的交互冲突
  setTimeout(() => {
    visible.value = false
  }, 100)
}

function getGasPrice(chain: BotChain) {
  if (!isEvmChain(chain) || gasPriceObj[chain]) {
    return
  }

  getRpcProvider(chain)?.getFeeData().then(res => {
    if (res) {
      gasPriceObj[chain] = new BigNumber(res.gasPrice || 0).toNumber()
    }
  })
}

// 通用的 estimated gas 计算函数
function calculateEstimatedGas(chain: BotChain, settingKey: BotSettingKey) {
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.buy?.[settingKey]
    const mev = botSettings?.mev
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const {gasTip1List, gasTip2List} = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    const currentGasPrice = gasPriceObj[chain] || 0
    return formatNumber(new BigNumber(currentGasPrice).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}

function getEstimatedGas(chain: BotChain) {
  return calculateEstimatedGas(chain, selected.value)
}

function getOptionEstimatedGas(chain: BotChain) {
  return calculateEstimatedGas(chain, optionSelected.value)
}

function getOptionPriorityFee(chain: BotChain) {
  return calculatePriorityFee(chain, optionSelected.value)
}

</script>

<style scoped lang="scss">
.quick-swap-select {
  width:50px;
  :deep(.el-select__wrapper) {
    width:50px;
    background-color: var(--main-input-button-bg);
    border-radius: 4px;
    height: var(--component-height, 28px);
    min-height: var(--component-height, 28px);
    padding: 2px 8px !important;
    box-shadow: none;
    box-sizing: border-box;
    
    &:hover {
      box-shadow: none;
      padding: 2px 8px !important;
    }
    
    &.is-focused {
      box-shadow: none;
      padding: 2px 8px !important;
    }
    
    .el-select__selected-item {
      font-size: 12px;
      color: var(--main-text1);
    }
    
    .el-select__suffix {
      margin-left: 0 !important;
      padding: 0 !important;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 12px;
      height: 12px;
      
      .el-select__icon {
        width: 12px;
        height: 12px;
        color: var(--secondary-text);
        margin: 0 !important;
        display: block;
        transform-origin: center center;
      }
    }
  }
  
  :deep(.el-select__input) {
    font-size: 12px;
  }
}

.quick-buy-input {
  :deep(.el-input__wrapper) {
    --el-input-text-color: var(--main-text1);
    background-color: var(--main-input-button-bg);
    border-radius: 4px;
    width: 65px;
    height: var(--component-height, 28px);
    min-height: var(--component-height, 28px);
    padding: 2px 8px;
    font-size: 12px;
    box-shadow: none;
    
    &.is-focus {
      box-shadow: none;
    }
    
    .el-input__prefix {
      margin-right: 4px;
      
      img {
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
    }
    
    .el-input__inner {
      font-size: 12px;
      height: calc(var(--component-height, 28px) - 4px);
      line-height: calc(var(--component-height, 28px) - 4px);
    }
  }
}

// 多链模式的伪输入框样式
.quick-buy-display {
  width: 65px;
  cursor: pointer;
  user-select: none;
  
  .el-input__wrapper {
    --el-input-text-color: var(--main-text1);
    background-color: var(--main-input-button-bg);
    border-radius: 4px;
    width: 65px;
    height: var(--component-height, 28px);
    min-height: var(--component-height, 28px);
    padding: 2px 8px;
    font-size: 12px;
    box-shadow: none;
    cursor: pointer;
    
    .el-input__prefix {
      margin-right: 4px;
      display: flex;
      align-items: center;
      
      img {
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
    }
    
    .el-input__inner {
      font-size: 12px;
      height: calc(var(--component-height, 28px) - 4px);
      line-height: calc(var(--component-height, 28px) - 4px);
      cursor: pointer;
      background: transparent;
      border: none;
      outline: none;
      color: var(--main-text1);
    }
  }
  
  &:hover {
    .el-input__wrapper {
      background-color: var(--main-input-button-bg-hover, var(--main-input-button-bg));
    }
  }
}

// 下拉框中链金额输入框样式（与单链输入框保持一致）
.chain-amount-input {
  width: 100%;
  
  :deep(.el-input__wrapper) {
    --el-input-text-color: var(--main-text1);
    background-color: var(--main-input-button-bg);
    border-radius: 4px;
    height: calc(var(--component-height, 28px) - 0px);
    min-height: calc(var(--component-height, 28px) - 0px);
    padding: 0px 8px;
    font-size: 12px;
    box-shadow: none;
    
    &.is-focus {
      box-shadow: none;
    }
    
    &:hover {
      box-shadow: none;
    }
    
    .el-input__prefix {
      margin-right: 4px;
      display: flex;
      align-items: center;
      
      img {
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
    }
    
    .el-input__inner {
      font-size: 12px;
      height: 24px;
      line-height: 24px;
    }
  }
}
</style>

<style lang="scss">
// 多链金额下拉框 popover 样式（全局样式，因为 popper 是 teleported 的）
.amount-dropdown-popover {
  background-color: var(--secondary-bg, #1a1d21) !important;
  border: 1px solid var(--dialog-list-hover, #2a2d35) !important;
  border-radius: 4px !important;
  padding: 4px !important;
  width: 82px !important;
  min-width: 82px !important;
  max-width: 82px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
  margin-top: -29px !important;  // 向上偏移，使第一个输入框与触发元素重合
  margin-left: -5px !important;
  .el-popper__arrow {
    display: none;
  }
}
</style>
