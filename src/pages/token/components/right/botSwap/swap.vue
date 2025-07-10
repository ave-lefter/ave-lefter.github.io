<template>
  <div>
    <template v-if="activeTab === 'buy'">
      <el-input v-model="amountNative" placeholder="0.0" size="large"  clearable class="input-number mt-10px" input-style="text-align:right"  @update:model-value="value => {amountNative = value?.replace?.(/\-|[^\d.]/g, '');watchAmount('buy')}">
        <template #prepend>
          <span class="text-12px color-[--d-999-l-666]">{{ $t('amount') }}</span>
        </template>
        <template #append>
          <img :src="tokenStore.swap.native?.logo_url || `${configStore.token_logo_url}token_icon/${chain}/${getChainInfo(chain || '').wmain_wrapper || ''}.png`" class="rd-50%" height="20"  alt="" srcset="" >
        </template>
      </el-input>
      <div class="flex items-center mt-10px text-12px" >
        <span class="color-[--d-F5F5F5-l-333]">≈{{  formatNumber(amountNativeOut || 0) }} {{ tokenInfo?.symbol }}</span>
        <div class="clickable ml-auto color-[--d-666-l-999]" @click.stop="handleMax(tokenStore.swap.native?.balance || 0, 'buy')">{{ $t('balance1') }}: <span>{{ formatNumber(tokenStore.swap.native?.balance || 0) }}</span> {{ getChainInfo(tokenInfo?.chain || '')?.main_name }}
        </div>
        <RefreshBalance class="color-[--d-666-l-999]" :type="0"/>
      </div>
      <div class="tabs mt-10px">
        <button v-for="(item, index) in tabs1" :key="index" class="tab-item" type="button"  @click.stop="handleAmount(item, 'buy')">
          <img class="mr-5px" :src="tokenStore.swap.native?.logo_url || `${configStore.token_logo_url}token_icon/${chain}/${getChainInfo(chain || '').wmain_wrapper || ''}.png`" style="border-radius: 50%;" height="14"  alt="" srcset="" >
          <span>{{ item.name }}</span>
        </button>
      </div>
    </template>
    <template v-else-if="activeTab === 'sell'">
      <el-input v-model="amountToken" clearable class="input-number mt-10px" size="large"  input-style="text-align:right"  placeholder="0.0" @update:model-value="value => {amountToken = value?.replace?.(/\-|[^\d.]/g, '');watchAmount('sell')}">
        <template #prepend>
          <span class="text-12px color-[--d-999-l-666]">{{ $t('amount') }}</span>
        </template>
        <template #append>
           <span class="text-12px color-[--d-F5F5F5-l-333]">{{ tokenInfo?.symbol  }}</span>
        </template>
      </el-input>
      <div class="flex items-center mt-10px text-12px">
        <span class="color-[--d-F5F5F5-l-333]">≈{{ formatNumber(amountTokenOut || 0) }} {{ getChainInfo(chain || '')?.main_name }}</span>
        <span class="clickable ml-auto color-[--d-666-l-999]" @click.stop="handleMax(tokenStore.swap.token?.balance || 0, 'sell')">{{ $t('balance1') }}: <span >{{ formatNumber(tokenStore.swap.token?.balance || 0) }}</span> {{ tokenInfo?.symbol }}</span>
        <RefreshBalance class="color-[--d-666-l-999]" :type="1"/>
      </div>
      <div class="tabs mt-10px">
        <button v-for="(item, index) in tabs2" :key="index" class="tab-item" type="button" @click.stop="handleAmount(item, 'sell')">
          <span>{{ item.name }}</span>
        </button>
      </div>
    </template>
    <template v-if="swapType === 'limit'">
      <el-input v-model="priceLimit" placeholder="0.0" size="large"  clearable class="input-number mt-10px" input-style="text-align:right" @update:model-value="value => priceLimit = value?.replace?.(/\-|[^\d.]/g, '')">
        <template #prepend>
          <span class="text-12px color-[--d-999-l-666]">{{ isPriceLimit ? $t('price') : 'MC' }}</span>
          <Icon name="iconamoon:synchronize-fill" class="clickable ml-5px text-12px color-[--d-F5F5F5-l-333]" @click.stop="isPriceLimit = !isPriceLimit"/>
        </template>
        <template #append>
          <span class="text-12px color-[--d-F5F5F5-l-333]">$</span>
        </template>
      </el-input>
      <div class="slider-swap" :class="activeTab">
        <div class="slider-swap_left">
          <el-slider :model-value="priceLimitRange1" :show-tooltip="false" :show-input-controls="false" :min="-100" :max="100" @input="onSliderInput" />
          <div class="slider-swap_left-mark">
            <span v-for="(item, index) in [-100, -50, 0, 50, 100]" :key="index" class="clickable" @click.stop="priceLimitRange1=item">{{item}}%</span>
          </div>
        </div>
        <el-input v-model.number="priceLimitRange" placeholder="0" class="input-number max-w-70px ml-15px text-14px!" @update:model-value="value => priceLimit = value?.replace?.(/\-|[^\d.]/g, '')">
          <template #prefix>
            <div class="w-10px" />
          </template>
          <template #suffix>
            <div class="text-14px color-#959A9F pr-5px">%</div>
          </template>
        </el-input>
      </div>
    </template>

    <template v-if="isSupportSwap">
      <el-button v-if="!isApprove" :color="swapButtonColor" class="submit-btn" native-type="button" :loading="loadingApprove || loadingSwap || loadingAllowance" :disabled="Number(fromToken.balance) < Number(fromAmount)" @click.stop="approve">{{ Number(fromToken.balance) === 0 || Number(fromToken.balance) < Number(fromAmount) ? (checkAmountMessage() || $t('approve')) : $t('approve') }}</el-button>

      <el-button
        v-else-if="activeTab === 'buy' && (Number(fromToken.balance) === 0 || Number(fromToken.balance) < Number(fromAmount))"
        class="submit-btn"
        :color="swapButtonColor"
        native-type="button"
        @click.stop="botTopUp(chain)"
      >
        {{ $t('lowBalanceToUP') }}
      </el-button>
      <el-button
        v-else
        class="submit-btn"
        block
        :loading="loadingSwap || quoteLoading || loadingAllowance"
        :loading-text="loadingSwap ? (activeTab === 'buy' ? $t('buying') : $t('selling')) : $t('quoting')"
        :color="swapButtonColor"
        :disabled="!checkAmount() || !fromAmount || !toAmount"
        native-type="button"
        @click.stop="submitBotSwap"
      >
        {{ checkAmountMessage() || (activeTab === 'buy' ? $t('buy') : $t('sell')) }}
      </el-button>
      <div class="mt-10px flex items-center text-11px color-[--d-F5F5F5-l-333]">
        <template v-if="botSettings[chain || ''] && isCanMev">
          <span class=" color-[--d-666-l-999] mr-4px cursor-pointer">{{ $t('mev') }}</span>
          <el-switch
            v-if="chain === 'solana'"
            v-model="botSettings.solana![botSettings.solana!.selected as 's1' | 's2' | 's3']!.mev"
            style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px;"
            size="small"
            :before-change="solanaMevBeforeChange"
          />
          <el-switch
            v-else-if="isEvmChain(chain || '')"
            v-model="botSettings[chain as string]![botSettings[chain as string]!.selected as 's1' | 's2' | 's3'].mev"
            style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px"
            size="small"
          />
        </template>
        <Icon v-tooltip="$t('slippage')" name="custom:slippage" class="text-12px color-[--d-666-l-999] ml-auto mr-4px cursor-pointer" />
        <span v-if="botSettings?.[chain || '']?.[selected]?.slippage !== 'auto'">{{ botSettings?.[chain || '']?.[selected]?.slippage }}%</span>
        <span v-else>{{ $t('auto') }}</span>
        <template v-if="isEvmChain(chain || '')">
          <Icon v-tooltip="$t('estimatedGas')" name="custom:gas" class="text-12px color-[--d-666-l-999] ml-auto mr-4px cursor-pointer" />
          <span>${{ getEstimatedGas() }}</span>
        </template>
        <template v-if="chain === 'solana'">
          <Icon v-tooltip="$t('priorityFee')" name="custom:gas" class="text-12px color-[--d-666-l-999] ml-auto mr-4px cursor-pointer" />
          <span>{{ botPriorityFee }} SOL</span>
        </template>
        <template v-if="activeTab === 'buy' && swapType === 'market' && botSettings?.[chain || '']">
          <span class="mr-4px ml-auto color-[--d-666-l-999]">{{ $t('autoSellHalf') }}</span>
          <el-switch
            v-model="botSettings[chain as string]![botSettings[chain as string]!.selected as 's1' | 's2' | 's3'].autoSell"
            size="small"
            style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px;"
          />
        </template>
      </div>
      <!-- <ul class="swap-label">
        <li v-if="activeTab === 'buy' && swapType === 'market' && botSettings?.[chain || '']" class="slippage-container">
          <span class="mr-auto color-[--d-666-l-999]">{{ $t('autoSellHalf') }}</span>
          <el-switch
            v-model="botSettings[chain as string]![botSettings[chain as string]!.selected as 's1' | 's2' | 's3'].autoSell"
            size="small"
            style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px;"
          />
        </li>
        <li v-if="chain === 'solana'" class="slippage-container">
          <span class="mr-auto color-[--d-666-l-999]">{{ $t('priorityFee') }}</span>
          <span>{{ botPriorityFee }} SOL</span>
        </li>
        <li v-else-if="isEvmChain(chain || '')" class="slippage-container">
          <span class="mr-auto color-[--d-666-l-999]">{{ $t('extraGas') }}</span>
          <span>{{ botPriorityFee }} GWEI</span>
        </li>
        <li v-show="isEvmChain(chain || '') && (fromAmount && toAmount) && Number(getEstimatedGas())">
          <div class="mr-auto color-[--d-666-l-999]">
            {{ $t('estimatedGas') }}
          </div>
          <div>
            ${{ getEstimatedGas() }}
          </div>
        </li>
        <li class="slippage-container">
          <span class="mr-auto color-[--d-666-l-999]">{{ $t('slippage') }}</span>
          <span v-if="botSettings?.[chain || '']?.[selected]?.slippage !== 'auto'">{{ botSettings?.[chain || '']?.[selected]?.slippage }}%</span>
          <span v-else>{{ $t('auto') }}</span>
        </li>
        <li v-if="botSettings[chain || ''] && isCanMev" class="slippage-container">
          <span class="mr-auto color-[--d-666-l-999]">{{ $t('protection') }}</span>
          <el-switch
            v-if="chain === 'solana'"
            v-model="botSettings.solana![botSettings.solana!.selected as 's1' | 's2' | 's3']!.mev"
            style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px;"
            size="small"
            :before-change="solanaMevBeforeChange"
          />
          <el-switch
            v-else-if="isEvmChain(chain || '')"
            v-model="botSettings[chain as string]![botSettings[chain as string]!.selected as 's1' | 's2' | 's3'].mev"
            style="--el-switch-on-color: #3c6cf6;zoom: 0.9;height: 14px"
            size="small"
          />
        </li>
      </ul> -->
    </template>

    <div v-else-if="!botStore?.userInfo?.evmAddress" class="connect-wallet-btn">
      <el-button
        class="btn-login"
        :color="activeTab === 'buy' ? '#12B886' : '#F6465D'"
        native-type="button"
        @click.stop="botStore.changeConnectVisible(true)"
      >
        {{ $t('login') }}
      </el-button>
      <!-- <el-button
        class="btn-connect"
        :class="activeTab === 'buy' ? 'buy' : 'sell'"
        :color="activeTab === 'buy' ? '#12B886' : '#F6465D'"
        native-type="button"
        @click.stop=""
      >
        {{ $t('connectWallet1') }}
      </el-button> -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NATIVE_TOKEN, MIN_BALANCE } from '@/utils/constants'
import BigNumber from 'bignumber.js'
import { debounce } from 'lodash-es'
import { getAddressAndChainFromId, isEvmChain, getRpcProvider } from '@/utils'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useBotSwap } from '~/composables/botSwap'
import { bot_createSolTx, bot_createSwapEvmTx, bot_createSolLimitTx, bot_createEvmLimitTx } from '@/api/bot'
import RefreshBalance from './refreshBalance.vue'
import { formatDec, formatNumber } from '@/utils/formatNumber'
import { useEventBus } from '@vueuse/core'

interface Token {
  address?: string
  chain?: string
  symbol?: string
  balance?: string
  decimals?: number
  price?: number
  logo_url?: string
  amount?: string
}


const props = defineProps<{
  activeTab: 'buy' | 'sell'
  swapType: 'market' | 'limit'
  tabs1: Array<{ name: string; value: string }>
  tabs2: Array<{ name: string; value: string }>
}>()

const emit = defineEmits(['getTokenBalance', 'update:botSettings'])

const { t } = useI18n()

// 响应式状态
const amountToken = ref('')
const amountNative = ref('')
const amountTokenOut = ref('')
const amountNativeOut = ref('')
const quoteLoading = ref(false)
const loadingSwap = ref(false)
const loadingApprove = ref(false)
const swapQuoteInfo = reactive({
  routerPath: [],
  fromAmount: '',
  toAmount: '',
  fromToken: {} as Token,
  toToken: {} as Token,
  from_price: 0,
  to_price: 0
})
// 限价单
const isPriceLimit = ref(true)
const priceLimit = ref('')
const priceLimitRange = ref<undefined | number>(undefined)

const priceLimitRange1 = computed(() => {
  return Number(priceLimitRange.value) > 100 ? 100 : priceLimitRange.value
})

function onSliderInput(val: number) {
  priceLimitRange.value = val
}

watch(priceLimitRange, (val) => {
  if (props.swapType !== 'limit') return
  if (!Number.isNaN(Number(val))) {
    priceLimit.value = formatDec(new BigNumber(tokenStore.price || 0).times(isPriceLimit.value ? 1 : tokenStore.circulation).times(1 + ((Number(val) || 0) / 100)).toFixed(), 4)
  }
})

let isLineChange = false
useEventBus<string>('priceLimit_move').on((price) => {
  if (props.swapType !== 'limit') return
  if (!Number.isNaN(Number(price))) {
    isLineChange = true
    priceLimitRange.value = Number(new BigNumber(price || 0).minus(tokenStore.price || 0).div(tokenStore.price || 0).times(100).toFixed(0))
    nextTick(() => {
      isLineChange = false
    })
  }
})

watch(priceLimit, () => {
  if (props.swapType !== 'limit') return
  watchAmount(props.activeTab)
  updateStorePriceLimit()
})

watch(() => props.swapType, (val) => {
  if (val !== 'limit') {
    useEventBus<number>('priceLimit').emit(0)
  } else {
    initPriceLimit()
    updateStorePriceLimit()
  }
})

watch(isPriceLimit, (val) => {
  if (props.swapType !== 'limit') return
  if (!Number.isNaN(Number(priceLimit.value))) {
    if (!val) {
      priceLimit.value = formatDec(new BigNumber(priceLimit.value || 0).times(tokenStore.circulation).toFixed(), 4)
    } else {
      priceLimit.value = formatDec(new BigNumber(priceLimit.value || 0).div(tokenStore.circulation || 1).toFixed(), 4)
    }
  }
})

useEventBus('klineDataReady').on(() => {
  if (props.swapType !== 'limit') return
  updateStorePriceLimit()
})

function updateStorePriceLimit() {
  if (isLineChange) return
  if(!isPriceLimit.value) {
    useEventBus<number>('priceLimit').emit(Number(formatDec(new BigNumber(priceLimit.value).div(tokenStore.circulation || 1).toFixed(), 4)))
  } else {
    useEventBus<number>('priceLimit').emit(Number(priceLimit.value))
  }
}

const gasPrice = ref(0)

const route = useRoute()

const tokenStore = useTokenStore()
const botStore = useBotStore()
const botSwapStore = useBotSwapStore()
const botSettingStore = useBotSettingStore()
const wsStore = useWSStore()
const configStore = useConfigStore()

const { botSettings } = storeToRefs(botSettingStore)


const { getTokensPrice, allowance, getAllowance, loadingAllowance, checkApproveAndApprove, bot_approve } = useBotSwap()

// 计算属性
const tokenInfo = computed(() => tokenStore.token)
const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  return routeParams?.chain || tokenInfo.value?.chain
})

const walletAddress = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenInfo.value?.chain

  return botStore?.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
})

const fromToken = computed(() => {
  return props.activeTab === 'buy' ? tokenStore.swap.native : tokenStore.swap.token
})

const fromAmount = computed(() => {
  return props.activeTab === 'buy' ? amountNative.value : amountToken.value
})

const toAmount = computed(() => {
  return props.activeTab === 'buy' ? amountNativeOut.value : amountTokenOut.value
})

const isCanMev = computed(() => {
  const chain = getChain()
  const { gasTip1List } = formatBotGasTips(botSwapStore?.gasTip, chain)
  return gasTip1List?.length > 1
})

const selected = computed(() => {
  const chain = getChain()
  if (!botStore.isSupportChains.includes(chain)) {
    return '' as 's1' | 's2' | 's3'
  }
  return botSettingStore?.botSettings?.[chain]?.selected as 's1' | 's2' | 's3'
})

const botPriorityFee = computed(() => {
  const chain = getChain()
  if (!botStore.isSupportChains.includes(chain)) {
    return ''
  }
  const selected = botSettingStore?.botSettings?.[chain]?.selected as 's1' | 's2' | 's3'
  const botSettings = botSettingStore.botSettings?.[chain]?.[selected]
  const mev = botSettings?.mev
  const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
  const gasTips = mev ? gasTip1List : gasTip2List
  const gasIndex = mev ? 0 : 1
  const settings = botSettings?.gas[gasIndex]
  const priorityFee = settings?.customFee || gasTips?.[settings?.level as number]
  return priorityFee
})


const   swapButtonColor= computed(() => {
  if (!isSupportSwap.value) {
    return '#999'
  }
  if (props.activeTab === 'buy') {
    return '#12B886'
  }
  if (props.activeTab === 'sell') {
    return '#F6465D'
  }
  return '#3F80F7'
})

const isApprove = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenInfo.value?.chain || ''
  if (['solana', 'ton'].includes(chain)) return true
  if (fromToken.value?.address === NATIVE_TOKEN) return true

  const decimals = fromToken.value.decimals || 18
  const fromAmountBN = new BigNumber(amountNative.value || 0)
  const parsedAmount = new BigNumber(fromAmountBN.toFixed(decimals)).times(10 ** decimals)
  return parsedAmount.lte(allowance.value)
})


// 方法
const handleMax = (balance: string | number, type: 'buy' | 'sell') => {
  const min = MIN_BALANCE[chain.value as 'bsc' | 'solana' | 'base' | 'eth'] || 0.01
  const decimals = fromToken.value.decimals || 18
  const fromAmount = balance || 0
  if (type === 'buy') {
    if (new BigNumber(balance).lt(min)) {
      ElMessageBox.alert(t('balanceNotEnough', {n: min, s: fromToken.value.symbol}), t('tips'), {
        confirmButtonText: t('okay')
      })
      return
    }
    amountNative.value = new BigNumber(fromAmount)?.minus(min).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
  } else {
    amountToken.value =  new BigNumber(fromAmount).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
  }
  watchAmount2(type)
}

function handleAmount(item: { name: string; value: string }, type: 'buy' | 'sell') {
  if (type === 'buy') {
    amountNative.value = item.value
  } else if (type === 'sell') {
    const p = item.value
    let a = tokenStore.swap.token.balance || 0
    if (p) {
      const decimals = tokenStore.swap.native.decimals || 0
      a = new BigNumber(a).times(p).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || 0
      if (Number(a) === 0) {
        a = ''
      }
    } else {
      a = ''
    }
    amountToken.value = String(Number(a) < 0 ? 0 : a)
  }
  watchAmount2(type)
}

const watchAmount = debounce((type: 'buy' | 'sell') => {
  watchAmount2(type)
}, 10)

function watchAmount2(type: 'buy' | 'sell', isGetPrice = true) {
  let val = amountToken.value
  if (type === 'buy') {
    val = amountNative.value
  }
  const n = Number(val)
  if (type === 'buy') {
    if (val === '' || val === '.') {
      quoteLoading.value = false
      amountNativeOut.value = ''
    } else if (n === 0 && Number(amountNativeOut.value) !== 0) {
      amountNativeOut.value = '0'
      quoteLoading.value = false
    } else if (n) {
      amountNativeOut.value = ''
      quoteBot(tokenInfo.value?.chain || '', 'buy', isGetPrice)
    }
  } else if (type === 'sell') {
    if (val === '' || val === '.') {
      quoteLoading.value = false
      amountTokenOut.value = ''
    } else if (n === 0 && Number(amountTokenOut.value) !== 0) {
      amountTokenOut.value = '0'
      quoteLoading.value = false
    } else if (n) {
      amountTokenOut.value = ''
      quoteBot(tokenInfo.value?.chain || '', 'sell', isGetPrice)
    }
  }
}

async function quoteBot(chain: string, type = props.activeTab, isGetPrice = true) {
  const isBuy = type === 'buy'
  const fromAmount = isBuy ? amountNative.value : amountToken.value
  quoteLoading.value = true
  if (isGetPrice) {
    await _getTokensPrice()
  }
  const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0

  let price: number = tokenStore.price || tokenStore.swap.token?.price || 0
  if (props.swapType === 'limit') {
    const p = isPriceLimit.value ? priceLimit.value : new BigNumber(priceLimit.value).div(tokenStore.circulation || 1).toFixed()
    price = Number(formatDec(p || tokenStore.price || tokenStore.swap.token?.price || 0, 4))
  }

  const fromPrice = isBuy ? (nativePrice || tokenStore.swap.native?.price) : price
  const toPrice = isBuy ? price : (nativePrice || tokenStore.swap.native?.price || 0)
  const res = Number(fromAmount) * (fromPrice || 0) / (toPrice || 1)
  if (res) {
    if (type === 'buy') {
      amountNativeOut.value = String(res) || '0'
    } else {
      amountTokenOut.value = String(res) || '0'
    }
    const fromToken = type === 'buy' ? tokenStore.swap.native : tokenStore.swap.token
    const toToken = type === 'buy' ? tokenStore.swap.token : tokenStore.swap.native
    const fromAmount = type === 'buy' ? amountNative.value : amountToken.value
    const toAmount = type === 'buy' ? amountNativeOut.value : amountTokenOut.value
    swapQuoteInfo.fromAmount = fromAmount
    swapQuoteInfo.toAmount = toAmount
    swapQuoteInfo.fromToken = {...fromToken, amount: fromAmount || ''}
    swapQuoteInfo.toToken = {...toToken, amount: toAmount || ''}
    swapQuoteInfo.from_price = fromPrice || 0
    swapQuoteInfo.to_price = toPrice || 0
    quoteLoading.value = false
    return
  }
}

const getTokensPriceFun = debounce(function (resolve, reject) {
  getTokensPrice().then(resolve, reject)
}, 500)

function _getTokensPrice() {
  return new Promise((resolve, reject) => {
    if (tokenStore.swap.native.price && tokenStore.swap.token.price) {
      resolve([{ current_price_usd: tokenStore.swap.token.price }, { current_price_usd: tokenStore.swap.native.price }])
    }
    getTokensPriceFun(resolve, reject)
  })
}

function getChain() {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenInfo.value?.chain || ''
  return chain
}

const isSupportSwap = computed(() => {
  const chain = getChain()
  return botStore.accessToken && botStore?.isSupportChains?.includes?.(chain)
})

const _getAllowance = () => getAllowance(fromToken.value.address || '')

const approve = async () => {
  loadingApprove.value = true
  bot_approve({
    batchId: Date.now().toString(),
    chain: chain.value || '',
    tokenAddress: fromToken.value.address || '',
    creatorAddress: [walletAddress.value || ''],
  }).then(res => {
    if (res) {
      let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
        ElNotification({ type: 'success', message: t('approveSubmitted') })
      }, 500)
      res.wait().then(() => {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        ElNotification({ type: 'success', message: t('approveSuccess') })
        setTimeout(() => {
          _getAllowance()
        }, 1000)
        loadingApprove.value = false
      })
    }
  }).catch((error) => {
    handleBotError(error || 'approve error')
    loadingApprove.value = false
  })
}

function checkAmount() {
  const fromTokenBalance = fromToken.value.balance || 0
  return !(
    Number(fromTokenBalance) < Number(fromAmount.value) ||
    String(fromAmount.value) === '0' || tokenStore.swap.token.address === tokenStore.swap.native.address || new BigNumber(fromAmount.value || 0).lte(0) ||
    (new BigNumber(priceLimit.value || 0).lte(0) && props.swapType === 'limit')
  )
}

function checkAmountMessage() {
  if (!isApprove.value || loadingAllowance.value) {
    return t('checkingAllowance')
  } else if (quoteLoading.value) {
    return t('quoting')
  } else if (loadingApprove.value) {
    return t('approve')
  }
  const fromTokenBalance = fromToken.value.balance || 0
  if (Number(fromTokenBalance) < Number(fromAmount.value)) {
    return t('insufficientBalance')
  } else if (String(fromAmount.value) === '0') {
    return t('AmountCannotBeZero')
  }
}

async function submitBotSwap() {
  if (new BigNumber(fromAmount.value || 0).lte(0)) {
    ElNotification({title: 'Error', type: 'error', message: t('amountMustG0')})
    return
  }
  const amount = (new BigNumber(fromAmount.value || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromToken.value?.decimals || 18}})?`))?.[0]
  if ((Number(amount) || 0) <= 0) {
    ElNotification({title: 'Error', type: 'error', message: t('amountTooSmall')})
    return
  }
  if (props.swapType === 'limit') {
    submitBotLimit()
    return
  }
  loadingSwap.value = true
  const isBuy = props.activeTab === 'buy'
  const chain = getChain()
  const chainMainToken: Record<string, string> = {
    solana: 'sol',
    ton: 'TON',
  }
  const native = chainMainToken?.[chain] || NATIVE_TOKEN
  const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address || ''
  if (chain === 'solana') {
    // let mev = this.botSettings?.solana?.mev
    const selected = botSettingStore?.botSettings?.solana?.selected as 's1' | 's2' | 's3'
    const botSettings = botSettingStore.botSettings?.solana?.[selected]
    const mev = botSettings?.mev

    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, 'solana')
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    const botPriorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
    // let min = this.botProtection ? '2000000' : '1500000'
    // botPriorityFee = botPriorityFee.lt(min) ? min : botPriorityFee.toFixed(0)
    const ft = isBuy ? tokenStore.swap.native : tokenStore.swap.token
    const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.native
    const slippage = botSettingStore.botSettings?.solana?.[botSettingStore.botSettings?.solana?.selected as 's1' | 's2' | 's3']?.slippage || 9
    const data = {
      batchId: Date.now().toString(),
      swapList: [{
        creatorAddress: walletAddress,
        inAmount: new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0),
      }],
      inTokenAddress: isBuy ? native : (ft.address || ''),
      outTokenAddress: isBuy ? (tt.address || '') : native,
      swapType: (isBuy ? 1 : 2) as 1 | 2,
      isPrivate: mev || false,
      priorityFee: botPriorityFee, // botPriorityFee
      autoSell: isBuy ? botSettings?.autoSell || false : false,
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto'
    }

    bot_createSolTx(data).then(res => {
      if (res) {
        let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          // this.$store.state.bot.historyUpdate++
          tokenStore.placeOrderUpdate++
          ElNotification({ type: 'success', message: t('transactionsSubmitted') })
          // if (!['myBotHistory', 'myBotPosition']?.includes(this.$store.state.tabActive)) {
          //   this.$store.state.tabActive = 'myBotHistory'
          // }
          loadingSwap.value = false
          amountToken.value = ''
          amountNative.value = ''
          amountTokenOut.value = ''
          amountNativeOut.value = ''
          // this.dialogVisibleSwap = false
        }, 500)
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const batchId = subscribeResult.batchId
          if (batchId === data.batchId) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            tokenStore.placeOrderSuccess++
            if (subscribeResult?.txList?.[0]?.success) {
              ElNotification({ type: 'success', message: t('tradeSuccess') })
              unwatch()
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              unwatch()
              loadingSwap.value = false
            }
          }
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value = false
    })
  } else if (isEvmChain(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.[botSettingStore.botSettings?.[chain]?.selected as 's1' | 's2' | 's3']
    const mev = botSettings?.mev
    const slippage = botSettings?.slippage || 9
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const gasPrice = !settings?.customFee ? '0' : (settings?.customFee || gasTips?.[settings?.level] || '3')
    const gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    const ft = isBuy ? tokenStore.swap.native : tokenStore.swap.token
    const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.native
    const data = {
      batchId: Date.now().toString(),
      chain: chain,
      swapList: [{
        creatorAddress: walletAddress,
        inAmount: new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0),
      }],
      inTokenAddress: isBuy ? native : (ft.address || ''),
      outTokenAddress: isBuy ? (tt.address || '') : native,
      swapType: (isBuy ? 1 : 2) as 1 | 2,
      contractType: 0 as 0 | 1,
      isPrivate: mev || false,
      gasTip: gasTip,
      autoSell: isBuy ? botSettings?.autoSell || false : false,
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto'
    }
    if (!isBuy) {
      await checkApproveAndApprove({
        token: ft.address,
        chain: chain,
        owner: walletAddress
      }).catch(() => {
        loadingSwap.value = false
      })
    }
    bot_createSwapEvmTx(data).then(res => {
      if (res) {
        let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          tokenStore.placeOrderUpdate++
          ElNotification({ type: 'success', message: t('transactionsSubmitted') })
          loadingSwap.value = false
          amountNative.value = ''
          amountNativeOut.value = ''
          amountToken.value = ''
          amountTokenOut.value = ''
          // this.dialogVisibleSwap = false
        }, 500)
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const batchId = subscribeResult.batchId
          if (batchId === data.batchId) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            tokenStore.placeOrderSuccess++
            if (subscribeResult?.txList?.[0]?.success) {
              ElNotification({ type: 'success', message: t('tradeSuccess') })
              unwatch()
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              unwatch()
              loadingSwap.value = false
            }
          }
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value = false
    })
  }
}

function submitBotLimit() {
  if (new BigNumber(fromAmount.value || 0).lte(0)) {
    ElNotification({title: 'Error', type: 'error', message: t('amountMustG0')})
    return
  }
  const amount = (new BigNumber(fromAmount.value || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromToken.value?.decimals || 18}})?`))?.[0]
  if ((Number(amount) || 0) <= 0) {
    ElNotification({title: 'Error', type: 'error', message: t('amountTooSmall')})
    return
  }
  loadingSwap.value = true
  const isBuy = props.activeTab === 'buy'
  const chain = getChain()
  const chainMainToken: Record<string, string> = {
    solana: 'sol',
    ton: 'TON',
  }
  const native = chainMainToken?.[chain] || NATIVE_TOKEN
  const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address || ''
  if (chain === 'solana') {
    // let mev = this.botSettings?.solana?.mev
    const selected = botSettingStore?.botSettings?.solana?.selected as 's1' | 's2' | 's3'
    const botSettings = botSettingStore.botSettings?.solana?.[selected]
    const mev = botSettings?.mev

    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, 'solana')
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    const botPriorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
    const p = isPriceLimit.value ? priceLimit.value : formatDec(new BigNumber(priceLimit.value || 0).div(tokenStore.circulation || 1).toFixed(), 4)
    // let min = this.botProtection ? '2000000' : '1500000'
    // botPriorityFee = botPriorityFee.lt(min) ? min : botPriorityFee.toFixed(0)
    const ft = isBuy ? tokenStore.swap.native : tokenStore.swap.token
    // const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.native
    const slippage = botSettingStore.botSettings?.solana?.[botSettingStore.botSettings?.solana?.selected as 's1' | 's2' | 's3']?.slippage || 9
    const data = {
      batchId: Date.now().toString(),
      swapList: [{
        creatorAddress: walletAddress,
        inAmount: new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0),
      }],
      tokenAddress: tokenStore.swap.token.address || tokenStore.token?.token || '',
      swapType: (isBuy ? 5 : 6) as 5 | 6, //5:Buy limit 6:Sell limit
      isPrivate: mev || false,
      priceLimit: p,
      autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      priorityFee: botPriorityFee, // botPriorityFee
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto'
    }
    bot_createSolLimitTx(data).then(res => {
      if (res) {
        let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          // this.$store.state.bot.limitHistoryUpdate++
          tokenStore.placeOrderUpdate++
          ElNotification({ type: 'success', message: t('limitSubmitted') })
          //  if (!['myBotPosition', 'botLimitOrder']?.includes(this.$store.state.tabActive)) {
          //   this.$store.state.tabActive = 'botLimitOrder'
          // }
          loadingSwap.value = false
          amountToken.value = ''
          amountNative.value = ''
          amountTokenOut.value = ''
          amountNativeOut.value = ''
          // this.dialogVisibleSwap = false
          // if (this.$store.state.tabActive === 'botLimitOrder') {
          //   this.$store.state.bot.orderTabActive = 'my'
          // }
        }, 500)
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const batchId = subscribeResult.batchId
          if (batchId === data.batchId) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            tokenStore.placeOrderSuccess++
            if (subscribeResult?.txList?.[0]?.success) {
              ElNotification({ type: 'success', message: t('tradeSuccess') })
              unwatch()
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              unwatch()
              loadingSwap.value = false
            }
          }
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value = false
    })
  } else if (isEvmChain(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.[botSettingStore.botSettings?.[chain]?.selected as 's1' | 's2' | 's3']
    const mev = botSettings?.mev
    const slippage = botSettings?.slippage || 9
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const gasPrice = (settings?.customFee || gasTips?.[settings?.level as 0 | 1 | 2] || '3')
    const gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    const ft = isBuy ? tokenStore.swap.native : tokenStore.swap.token
    const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.native
    const p = isPriceLimit.value ? priceLimit.value : formatDec(new BigNumber(priceLimit.value || 0).div(tokenStore.circulation || 1).toFixed(), 4)
    const data = {
      batchId: Date.now().toString(),
      chain: chain,
      swapList: [{
        creatorAddress: walletAddress,
        inAmount: new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0),
      }],
      inTokenAddress: isBuy ? native : (ft.address || ''),
      outTokenAddress: isBuy ? (tt.address || '') : native,
      swapType: (isBuy ? 5 : 6) as 5 | 6,
      swapPrice: p,
      contractType: 0 as 0 | 1,
      isPrivate: mev || false,
      gasTip: gasTip,
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto'
    }
    bot_createEvmLimitTx(data).then(res => {
      if (res) {
        let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          tokenStore.placeOrderUpdate++
          ElNotification({ type: 'success', message: t('limitSubmitted') })
          loadingSwap.value = false
          amountToken.value = ''
          amountNative.value = ''
          amountTokenOut.value = ''
          amountNativeOut.value = ''
        }, 500)
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const batchId = subscribeResult.batchId
          if (batchId === data.batchId) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            tokenStore.placeOrderSuccess++
            if (subscribeResult?.txList?.[0]?.success) {
              ElNotification({ type: 'success', message: t('tradeSuccess') })
              unwatch()
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              unwatch()
              loadingSwap.value = false
            }
          }
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value = false
    })
  }
}


function getGasPrice() {
  const chain = getChain()
  if (!isEvmChain(chain)) {
    return
  }
  getRpcProvider(chain)?.getFeeData().then(res => {
    if (res) {
      gasPrice.value = new BigNumber(res.gasPrice || 0).toNumber()
    }
  })
}

function getEstimatedGas() {
  const chain = getChain()
  if (isEvmChain(chain) && botStore?.isSupportChains?.includes(chain)) {
    // let botSettings = this.botSettings?.[this.chain]?.[] || {}
    const botSettings = botSettingStore.botSettings?.[chain]?.[botSettingStore.botSettings?.[chain]?.selected as 's1' | 's2' | 's3']
    const mev = botSettings?.mev
    const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const extraGasPrice = settings?.customFee || gasTips?.[settings?.level as number] || '3'
    const gasLimit = botSwapStore.gasTip?.find?.(i => i.chain === chain && i.mev === !!mev)?.gasLimit || 200000
    return formatNumber(new BigNumber(gasPrice.value).plus(new BigNumber(extraGasPrice).times(String(10 ** 9))).times(gasLimit).times(nativePrice).div(String(10 ** 18)).toFixed(), 2)
  }
  return 0
}

function solanaMevBeforeChange() {
  const botSettings = botSettingStore.botSettings?.solana?.[botSettingStore.botSettings?.solana?.selected as 's1' | 's2' | 's3']
  if (!botSettings?.mev && !botStore.bundleAvailable) {
    ElMessage({ type: 'warning', message: t('mevPending') })
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
}

watch(() => tokenStore.token?.token || '', (val) => {
  if (val) {
    getGasPrice()
    if (props.activeTab === 'sell') {
      _getAllowance()
    }
    amountToken.value = ''
    amountNative.value = ''
    amountTokenOut.value = ''
    amountNativeOut.value = ''
    watchAmount2(props.activeTab)
  }
})

watch(walletAddress, (val) => {
  if (val && props.activeTab === 'sell') {
    _getAllowance()
  }
})

watch(() => props.activeTab, (val) => {
  amountToken.value = ''
  amountNative.value = ''
  amountTokenOut.value = ''
  amountNativeOut.value = ''
  if (val === 'sell') {
    _getAllowance()
  }
})

watch(() => tokenStore.price, (val) => {
  if (val) {
    watchAmount2(props.activeTab, false)
  }
})

function botTopUp(chain?: string) {
  useEventBus<string>('botTopUp').emit(chain)
}

const now = Date.now()
let Timer: null | ReturnType<typeof setTimeout> = null
function initPriceLimit() {
  if (props.swapType === 'market') {
    if (Date.now() - now > 5000) {
      return
    }
    if (!tokenStore.price) {
      if (Timer) {
        clearTimeout(Timer)
        Timer = null
      }
      Timer = setTimeout(initPriceLimit, 1000)
      return
    }
  } else {
    if (!tokenStore.price) {
      if (Timer) {
        clearTimeout(Timer)
        Timer = null
      }
      Timer = setTimeout(initPriceLimit, 1000)
      return
    }
  }
  priceLimitRange.value = undefined
  priceLimit.value = formatDec(new BigNumber(tokenStore.token?.current_price_usd || 0).times(isPriceLimit.value ? 1 : tokenStore.circulation).toFixed(), 4)
}

watch(() => tokenStore.token?.token, () => {
  initPriceLimit()
})

watch(() => tokenStore.placeOrderSuccess, () => {
  setTimeout(() => {
    emit('getTokenBalance')
  }, 1000)
})

// 生命周期钩子
onMounted(() => {
  initPriceLimit()
  getGasPrice()
  if (props.activeTab === 'sell') {
    _getAllowance()
  }
})

</script>
<style lang="scss" scoped>
  .tabs {
    // border: 1px solid var(--custom-br-1-color);
    // border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px;
    .tab-item {
      border: 1px solid transparent;
      display: flex;
      padding: 7px 0;
      justify-content: center;
      align-items: center;
      flex: 1;
      border-radius: 4px;
      background: var(--d-222-l-F2F2F2);
      cursor: pointer;
      color: var(--d-999-l-666);
      & + .tab-item {
        margin-left: 10px;
      }
      &.active {
        border-color: transparent;
        &.tab-buy {
          background: rgba($color: #12B886, $alpha: 1);
          color: #FFF;
        }
        &.tab-sell {
          background: rgba($color: #F6465D, $alpha: 1);
          color: #FFF;
        }
      }
      &:disabled {
        opacity: 0.4;
      }
      .iconfont {
        font-size: 12px;
        margin-right: 3px;
        line-height: 1;
      }
      &:hover {
        background: var(--d-333-l-DDD);
        color: var(--d-F5F5F5-l-333);
      }
      &:active {
        opacity: 0.5;
      }
    }
  }
  .select-box {
    position: relative;
    .btn-set {
      color: var(--custom-text-2-color);
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-40%);
      &:hover {
        color: var(--custom-text-1-color);
      }
    }
  }
  .select-tabs {
    :deep() {
      --el-border-color-light: var(--custom-br-1-color);
      .el-tabs__item {
        font-size: 12px;
        padding: 0 10px;
        --el-text-color-primary: var(--custom-text-tab-color);
        &.is-active {
          color: var(--custom-text-1-color);
        }
        &:hover {
          color: var(--custom-text-1-color);
          cursor: pointer;
        }
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__active-bar {
        height: 2px;
        background-color: var(--custom-text-1-color);
      }
      .el-tabs__nav-wrap::after {
        height: 0.5px;
      }
    }
  }
  .input-number {
    --el-fill-color-light: var(--d-222-l-F2F2F2);
    --el-input-bg-color: var(--d-222-l-F2F2F2);
    --el-input-border-color: transparent;
    --el-input-focus-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-bg-color: transparent;
    font-size: 18px;
    font-weight: 500;
    :deep() .el-input-group__append, .el-input-group__prepend {
      padding: 0 10px;
    }
    :deep() .el-input-group__prepend {
      --el-fill-color-light: var(--d-333-l-DDD);
      min-width: 70px;
      padding: 0 12px;
    }
    :deep() .el-input__wrapper {
      padding: 1px 0;
    }
  }

  .submit-btn {
    height: 40px;
    border-radius: 6px;
    margin-top: 20px;
    width: 100%;
    // --el-button-text-color: var(--d-F5F5F5-l-333) !important;
    // --el-button-hover-text-color: var(--d-F5F5F5-l-333) !important;
    --el-color-black: #F5F5F5;
  }

  .slippage-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 11px;
    // color: #696E7C;
    color: var(--custom-text-2-1-color);
    letter-spacing: 0;
    font-weight: 400;
    margin-top: 10px;
    .iconfont {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .swap-label {
    font-size: 11px;
    color: #696E7C;
    letter-spacing: 0;
    font-weight: 400;
    li {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      & + li {
        margin-top: 8px;
      }
      > :nth-child(2) {
        // color: #333333;
        color: var(--d-F5F5F5-l-333);
      }
    }
    .swap-label_item-left {
      display: flex;
      align-items: center;
      color: var(--d-666-l-999);
    }
  }
  .connect-wallet-btn {
    margin-top: 20px;
    display: flex;
    .btn-login,
    .btn-connect {
      --el-button-text-color: #fff !important;
      --el-button-hover-text-color: #fff !important;
      flex: 1;
      height: 40px;
      border-radius: 4px;
    }
    .btn-connect {
      margin-left: 8px;
      &.buy {
        background: rgb(18, 184, 134, 0.1) !important;
        border-color: rgb(18, 184, 134, 0.1) !important;
        color: #12B886 !important;
      }
      &.sell {
        background: rgb(246, 70, 93, 0.1) !important;
        border-color: rgb(246, 70, 93, 0.1) !important;
        color: #F6465D !important;
      }
    }
  }

  .balance-btn {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
    cursor: pointer;
    &:active {
      opacity: 0.5;
    }
    &:hover {
      opacity: 0.9;
    }
  }
  .slider-swap {
    display: flex;
    align-items: center;
    padding: 0 0 0 5px;
    // background: var(--a-btn-bg-1-color);
    margin-top: 13px;
    border-radius: 4px;
    --el-font-size-base: 12px;
    &.buy {
      --a-slider-runway-bg-color: rgb(18, 184, 134, 0.1);
      --a-slider-bg-color: #12B886;
    }
    &.sell {
      --a-slider-runway-bg-color: rgb(246, 70, 93, 0.1);
      --a-slider-bg-color: #F6465D;
    }
    :deep() .el-slider {
      --el-slider-runway-bg-color: var(--a-slider-runway-bg-color);
      --el-slider-main-bg-color: var(--a-slider-bg-color);
      height: auto;
      align-items: flex-start;
      .el-slider__button {
        background-color: var(--d-0A0B0C-l-F5F5F5);
      }
      .el-slider__marks-stop {
        display: none;
      }
      .el-slider__marks-text {
        font-size: 12px;
        color: #959A9F;
        &:nth-child(1) {
          transform: translateX(-25%);
        }
        &:last-child {
          transform: translateX(-75%);
        }
      }
      .el-slider__runway {
        --el-slider-button-size: 12px;
        &.show-input {
          margin-right: 15px;
        }
      }
      .el-slider__input {
        width: 70px;
        margin-top: -3px;
        // .el-input-number__decrease, .el-input-number__increase {
        //   display: none;
        // }
      }
    }
    .slider-swap_left {
      flex: 1;
      .slider-swap_left-mark {
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #959A9F;
        // margin-top: 5px;
        margin: 8px -5px 0 -5px;
        > span {
          flex: 1;
          text-align: center;
          &:first-child, &:nth-child(2) {
            text-align: left;
          }
          &:last-child, &:nth-child(4) {
            text-align: right;
          }
        }
      }
    }
  }
</style>
