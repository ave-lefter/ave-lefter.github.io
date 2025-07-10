<template>
  <form class="swap-container" action="" @submit.prevent.stop="onSubmit">
    <div class="card-container mt-10px">
      <div class="flex items-center">
        <SelectSwapToken v-model:token="swapStore.token1" :tokens="swapStore.swapTokens" :chain="swapStore.chain" @update:token="handleSelectToken1"/>
        <span style="flex: 1"/>
        <div class="s-text" v-html="`${ $t('balance1') }: ${ formatNumber(swapStore.token1?.balance || 0) }`"/>
        <button v-if="swapStore.activeTab === 1" class="max-btn" type="button" @click.stop="handlePercentChange(100)">{{ $t('max') }}</button>
      </div>
      <div class="flex justify-between items-center mt-10px">
        <el-input v-if="(swapStore.activeTab === 0)" v-model="toAmount" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:right"  :readonly="isOnlyGetAmountsOut" @update:model-value="value => {toAmount = value?.replace?.(/\-|[^\d.]/g, '');watchToAmount()}" @focus="percentStepRef?.handleClick(0, true)" />
        <el-input v-if="(swapStore.activeTab === 1)" v-model="fromAmount" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:right"  @update:model-value="value => {fromAmount = value?.replace?.(/\-|[^\d.]/g, '');watchFromAmount()}" @focus="percentStepRef?.handleClick(0, true)" />
      </div>
    </div>
    <div class="card-container bottom mt-10px">
      <div class="flex items-center">
        <SelectSwapToken v-model:token="swapStore.token2" :tokens="swapStore.swapTokens" :chain="swapStore.chain" @update:token="handleSelectToken2"/>
        <span style="flex: 1"/>
        <div class="s-text" v-html="`${ $t('balance1') }: ${ formatNumber(swapStore.token2.balance || 0) }`"/>
        <button v-if="swapStore.activeTab === 0" class="max-btn" type="button" @click.stop="handlePercentChange(100)">{{ $t('max') }}</button>
      </div>
      <div class="flex justify-between items-center mt-10px">
        <el-input v-if="(swapStore.activeTab === 1)" v-model="toAmount" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:right" :readonly="isOnlyGetAmountsOut" @update:model-value="value => {toAmount = value?.replace?.(/\-|[^\d.]/g, '');watchToAmount()}" @focus="percentStepRef?.handleClick(0, true)" />
        <el-input v-if="(swapStore.activeTab === 0)" v-model="fromAmount" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:right" @update:model-value="value => {fromAmount = value?.replace?.(/\-|[^\d.]/g, '');watchFromAmount()}" @focus="percentStepRef?.handleClick(0, true)" />
      </div>
    </div>
    <PercentStep ref="percentStepInf" :activeColor="swapStore.activeTab === 0 ? upColor[0]: downColor[0]" @change="handlePercentChange"/>
    <template v-if="!walletStore.address">
      <el-button
        native-type="button"
        class="submit-btn"
        color="#286DFF"
        @click.stop="useBotStore().changeConnectVisible(true, 1)">{{ $t('pConnectWallet') }}</el-button>
    </template>
    <template v-else-if="walletStore.address && !walletStore.provider">
      <el-button
        native-type="button"
        class="submit-btn"
        disabled
        color="#555555"
        >{{ $t('watchWalletNotSwap') }}</el-button>
    </template>
    <template v-else-if="!supportChain()">
      <el-button
        native-type="button"
        class="submit-btn"
        disabled
        color="#555555"
      >
        {{ checkSupportChainMessage() }}
      </el-button>
    </template>
    <el-button
      v-else-if="!isApprove"
      class="submit-btn"
      :color="swapButtonColor"
      native-type="submit"
      :loading="loadingApprove || loadingSwap || loadingAllowance"
      :disabled="Number(swapStore.fromToken.balance) < Number(fromAmount)"
      >{{ Number(swapStore.fromToken.balance) === 0 || Number(swapStore.fromToken.balance) < Number(fromAmount) || walletStore.address === '' ? (priceImpactV &&priceImpactV?.gt?.(0.4) ? $t('priceImpactTooHigh') : (checkAmountMessage() || $t('approve'))) : $t('approve') }}</el-button
    >
    <el-button
      v-else
      class="submit-btn"
      :loading="loadingSwap || quoteLoading || loadingAllowance"
      :color="swapButtonColor"
      :disabled="(priceImpactV && priceImpactV?.gt?.(0.4)) || !checkAmount() || !fromAmount || !toAmount"
      native-type="submit"
    >
      <span v-if="Number(swapStore.fromToken.balance) === 0 || Number(swapStore.fromToken.balance) < Number(fromAmount) || walletStore.address === '' || ((swapStore.isERC314 || swapStore.isFourMeme || swapStore.isFlap || swapStore.isSunPump > 0) && swapStore.token2.address !== NATIVE_TOKEN) || ((swapStore.isPump || swapStore.isMoonshot) && swapStore.token2.address !== 'So11111111111111111111111111111111111111112') ">
        {{ checkAmountMessage() }}
      </span>
      <span v-else-if="priceImpactV && priceImpactV?.gt?.(0.4)">
        {{ $t('priceImpactTooHigh') }}
      </span>
      <template v-else>
        <span>{{ (priceImpactV && priceImpactV?.gt?.(0.1)) ? (swapStore.activeTab === 0 ? $t('buyAnyway') : $t('sellAnyway')) : (swapStore.activeTab === 0 ? $t('buy') : $t('sell'))}} {{ swapStore.token1?.symbol || '' }}</span
        ><span v-if="taxStr" style="font-size: 12px" v-html="taxStr"/>
      </template>
    </el-button>
    <ul class="swap-label">
      <li class="slippage-container">
        <span>{{ $t('slippage') }}</span>
        <Icon name="material-symbols:help-outline" @click.stop="alertTips($t('slippage'), $t('minimumReceivedTips'))" />
        <span style="flex: 1"/>
        <SlippageSet v-if="chain === 'solana'" v-model:slippage="solanaSlippage" :canSetAuto="false"/>
        <SlippageSet v-else-if="chain === 'sui'" v-model:slippage="suiTonSlippage" :canSetAuto="false"/>
        <SlippageSet v-else v-model:slippage="customSlippage" :autoSlippage="autoSlippageValue"/>
      </li>
      <li v-show="(fromAmount && toAmount)">
        <div class="swap-label_item-left">
          <span>{{ $t('estimatedAveragePrice') }}</span>
        </div>
        <div style="display: flex; align-items: center">
          <span>${{ getAvgPrice() }}</span>
        </div>
      </li>
      <li v-show="(fromAmount && toAmount)">
        <div class="swap-label_item-left">
          <span>{{ $t('priceImpact') }}</span>
          <i
            class="iconfont icon-changjianwentixiangguanwenti"
            @click.stop="alertTips($t('priceImpact'), $t('priceImpactTips'))"
          />
        </div>
        <div :style="{color: priceImpactColor }">{{ priceImpact }}{{ (priceImpactV &&priceImpactV?.gt?.(0.05)) ? `(${$t('excessivePriceImpact')})` : '' }}</div>
      </li>
      <li v-show="(fromAmount && toAmount)">
        <div class="swap-label_item-left">
          <span>{{ $t('tokenRoute') }}</span>
          <i
            class="iconfont icon-changjianwentixiangguanwenti"
            @click.stop="alertTips($t('tokenRoute'), $t('tokenRouteTips'))"
          />
        </div>
        <div v-if="chain === 'solana' || chain === 'sui'">
          <template v-for="(i, k) in [swapStore.fromToken, swapStore.toToken]" :key="k">
            <img v-if="k !== 0" style="width: 0.3rem; margin: 0.02rem 0.1rem 0" src="@/assets/images/arrow-right.svg" alt="" srcset="">
            <span v-if="i.symbol">{{ i.symbol }}</span>
          </template>
        </div>
        <div v-else-if="swapQuoteInfo?.toWrapper === 1 || swapQuoteInfo?.toWrapper === 2">
          <template v-for="(i, k) in swapRouterPath" :key="k">
            <img v-if="k !== 0" style="width: 15px; margin: 1px 5px 0" src="@/assets/images/arrow-right.svg" alt="" srcset="">
            <span v-if="i.symbol">{{ i.symbol }}</span>
          </template>
        </div>
        <div v-else class="path-list clickable" @click.stop.prevent="(!swapStore.isFourMeme && !swapStore.isSunPump) && (dialogListRouterVisible = true)">
          <template v-for="(i, k) in swapRouterPath" :key="k">
            <span v-if="i.symbol">{{ i.symbol }}</span>
            <div v-if="i.nextAmm && i.nextAmm !== 'unknown'" class="path-amm">
              <img class="icon-amm-logo rounded" :src="`${configStore.token_logo_url}swap/${i.nextAmm}.jpeg`" alt="" srcset="" onerror="this.src='/icon-default.png'">
              <img style="width: 15px; margin: 1px 5px 0" src="@/assets/images/arrow-right.svg" alt="" srcset="">
            </div>
          </template>
          <i v-if="listRouter.length>0" class="select-token iconfont icon-collapse-down"/>
        </div>
      </li>
      <li v-if="chain !== 'solana' && chain !=='tron' && chain !=='sui' && Number(estimatedFee) > 0">
        <div class="swap-label_item-left">{{ $t('estimatedGas') }}</div>
        <div>≈ ${{ estimatedFee }}</div>
      </li>
    </ul>
  </form>
    <SelectRouter
      v-model:visible="dialogListRouterVisible"
      :listRouter="listRouter"
      :isAmount="isAmount"
      :selectedRouterIndex="selectedRouterIndex"
      @getSelectedRouter="getSelectedRouter"
    />
    <ConfirmSwap
      v-model:visible="dialogVisibleSwap"
      :swapInfo="swapInfo"
      :swapQuoteInfo="swapQuoteInfo"
      :slippage="chain==='solana' ? solanaSlippage : ((chain === 'ton' || chain === 'sui') ? suiTonSlippage : slippage)"
      :loading="loadingConfirmSwap"
      :chain="chain"
      :nativePrice="nativePrice"
      :gasPrice="gasPrice"
      :activeShow="activeShow"
      @submit="submitSwap"
    />
</template>

<script setup lang='ts'>
import SelectSwapToken from './selectSwapToken.vue'
import SlippageSet from './slippageSet.vue'
import SelectRouter from './selectRouter.vue'
import ConfirmSwap from './confirmSwap.vue'
import { formatNumber } from '@/utils/formatNumber'
import BigNumber from 'bignumber.js'
import { allowance, quoteBestRouterV2, quoteSunPump, quoteFourMeme, quoteERC314, ERC314Swap, sunPumpSwap, fourMemeSwap, swapV2, getNativeTokenPrice, approve, getSuiQuote, buildSuiTx } from '~/api/swap'
import { MIN_BALANCE, SwapContracts } from '@/utils/wallet/utils/constants'
import { useSwapStore } from '~/stores/swap'
import { ElMessageBox } from '#imports'
import { handleError, getGasPrice } from '@/utils/wallet/utils'
import { getTokensPrice } from '~/api/token'
import PercentStep from './percentStep.vue'
import { useLocalStorage, useCountdown } from '@vueuse/core'
import { recordTransaction, updateTransaction } from '~/api/tracking'
import { sui_signAndExecuteTransactionBlock } from '@/utils/wallet/sui'
import { getSolanaSwapQuoteTransaction, sendSolanaSwapTransaction } from '@/utils/wallet/solana'


const { t } = useI18n()
const configStore = useConfigStore()

const initSlippage = '2'
const swapStore = useSwapStore()
const tokenStore = useTokenStore()
const walletStore = useWalletStore()
const loadingAllowance = ref(false)
const quoteLoading = ref(false)
const isAmount = ref(false)
const chain = computed(() => swapStore.chain)
const loadingSwap = ref(false)
const loadingApprove = ref(false)
const autoSlippageValue = ref(initSlippage)
const customSlippage = useLocalStorage('swapSlippage', 'auto')
const solanaSlippage = useLocalStorage('solanaSlippage', '9')
const suiTonSlippage = useLocalStorage('suiTonSlippage', '2')
const isCannotSellAll = ref(false)
const isTax = ref(false)
const isTaxHigh = ref(false)
const percentStepRef = useTemplateRef('percentStepInf')
const listRouter = ref<{
  path: Array<{
    symbol: string
    nextAmm: string
  }>
  amount?: number | string
  priceImpact?: number | string
}[]>([])
const dialogListRouterVisible = ref(false)

const priceImpactSolana = ref(0)
const priceImpactSui = ref(0)
const priceImpactTon = ref(0)
const swapTokenPrice = ref([0, 0])
const loadingConfirmSwap = ref(false)

const swapInfo = ref<{
  fromToken: {
    symbol: string
    decimals: number
    address: string
    logo_url?: string
  }
  toToken: {
    symbol: string
    decimals: number
    address: string
    logo_url?: string
  }
  gasValue?: string | number
  swapRouterPath?: {symbol: string, nextAmm: string}[] | undefined
  isAmountOut: boolean
  fromAmount?: string
  fromTokenAmount?: string
  toTokenAmount?: string
  toAmount?: string
  transaction?: string
}>({
  fromToken: {
    symbol: '',
    decimals: 18,
    address: '',
    logo_url: '',
  },
  toToken: {
    symbol: '',
    decimals: 18,
    address: '',
    logo_url: '',
  },
  gasValue: '0' as string | number | undefined,
  swapRouterPath: [] as {symbol: string, nextAmm: string}[] | undefined,
  isAmountOut: false,
})

const suiQuoteResponse: any = {}
const solanaQuoteResponse: any = {}

const gasPrice = ref('0')
const nativePrice = ref<number | string>('0')
const estimatedFee = computed(() => {
  const gasValue = swapInfo.value.gasValue
  if (!gasValue) {
    return '0'
  }
  const _gasPrice = gasPrice.value
  const _nativePrice = nativePrice.value
  return formatNumber((new BigNumber(gasValue.toString())).times(_nativePrice).times(_gasPrice).div(String(10 ** 18)).toFixed() || '0', 2)
})

const swapSubmitInfo = ref<any>({})

const slippage = computed(() => {
  if (customSlippage.value === 'auto') {
    return autoSlippageValue.value
  } else {
    return customSlippage.value
  }
})


const isApprove = computed(() => {
  const chains = ['solana', 'ton', 'sui']
  if (chains.includes(swapStore.chain) || swapStore.fromToken.address === NATIVE_TOKEN) {
    return true
  }
  if (!swapStore.allowance) {
    return false
  }
  const decimals = swapStore.fromToken.decimals || 0
  return parseUnits((new BigNumber(fromAmount.value || 0)).toFixed(Number(decimals) || 0), decimals).lte(swapStore.allowance)
})

const priceImpactV = computed(() => {
  if (!(Number(fromAmount.value) || Number(toAmount.value))) {
    return ''
  }
  const chain = swapStore.chain
  if (chain === 'solana') {
    return new BigNumber(priceImpactSolana.value || 0)
  }
  if (chain === 'sui') {
    return new BigNumber(priceImpactSui.value || 0)
  }
  const routerPath = swapQuoteInfo.value.routerPath
  const fromToken = routerPath?.length > 0 ? routerPath?.[0] : null
  const toToken = routerPath?.length > 0 ? routerPath?.[routerPath.length - 1] : null
  if (fromToken && toToken) {
    const fromPrice = swapQuoteInfo.value.from_price || 0
    const toPrice = swapQuoteInfo.value.to_price || 0
    const fromAmount = formatUnits(fromToken.amount, fromToken.decimals)
    const toAmount = formatUnits(toToken.amount, toToken.decimals)
    return ((new BigNumber(fromAmount).times(fromPrice)).div((new BigNumber(toAmount).times(toPrice)))).minus(1).abs()
  }
  return ''
})
const priceImpact = computed(() => {
  return priceImpactV.value ? formatNumber(priceImpactV.value.times(100).toFixed(), 2) + '%' : ''
})
const priceImpactColor = computed(() => {
  if (priceImpactV.value === '') {
    return ''
  }
  if (priceImpactV.value?.gt?.(0.4)) {
    return '#F81111'
  } else if (priceImpactV.value?.gt?.(0.1)) {
    return '#F7933F'
  } else if (priceImpactV.value?.gt?.(0.05)) {
    return '#f8be46'
  } else {
    return ''
  }
})

const swapButtonColor = computed(() => {
  if (!walletStore.address || !walletStore.provider) {
    return '#999'
  }
  if (priceImpactV.value !== '') {
    if (priceImpactV.value?.gt?.(0.4)) {
      return '#999'
    } else if (priceImpactV.value?.gt?.(0.1)) {
      return '#F7933F'
    }
  }

  if (swapStore.activeTab === 0) {
    return upColor[0]
  }
  if (swapStore.activeTab === 1) {
    return downColor[0]
  }
  return '#558BED'
})

const taxStr = computed(() => {
  const tax = swapQuoteInfo.value?.totalTax || ((swapQuoteInfo.value?.total_sell_tax || 0) + (swapQuoteInfo.value?.total_buy_tax || 0))
  if (tax > 0) {
    return `(${t('tax')}: ${formatNumber(tax, 1)}%)`
  }
  if (swapStore.activeTab === 0 && (swapStore.baseTokenExtra?.buy_tax || 0 )> 0) {
    return `(${t('tax')}: ${formatNumber(swapStore.baseTokenExtra?.buy_tax || 0, 1)}%)`
  }
  if (swapStore.activeTab === 1 && (swapStore.baseTokenExtra?.sell_tax || 0) > 0) {
    return `(${t('tax')}: ${formatNumber(swapStore.baseTokenExtra?.sell_tax || 0, 1)}%)`
  }
  return ''
})


const swapRouterPath = shallowRef<{symbol: string, nextAmm: string}[]>([])
const swapQuoteInfo = ref<{
  totalTax?: number
  total_sell_tax?: number
  total_buy_tax?: number
  routerPath?: any
  from_price?: number
  to_price?: number
  quoteResult?: any
  fromAmount: string
  toAmount?: string
  fromToken: {
    symbol: string
    decimals: number
    amount: string
    address: string
  }
  toToken: {
    symbol: string
    decimals: number
    amount: string
    address: string
  }
  isAmountOut: boolean
  isFourMeme?: boolean
  isSunPump?: number
  isERC314?: boolean
  toWrapper?: number
}>({
  fromToken: {
    symbol: '',
    decimals: 18,
    amount: '',
    address: '',
  },
  toToken: {
    symbol: '',
    decimals: 18,
    amount: '',
    address: '',
  },
  fromAmount: '',
  isAmountOut: false,
  isSunPump: 0
})

const swapPathList = ref<{
  routerPath: any
  from_cannot_sell_all?: number
  to_cannot_sell_all?: number
  totalTax?: number
  total_sell_tax: number
  total_buy_tax: number
  from_price: number
  to_price: number
  pair_path?: any
  priceImpact?: number | string
}[]>([])
const route = useRoute()
watch(() => route.params.id, () => {
  fromAmount.value = ''
  toAmount.value = ''
})


const selectedRouterIndex = ref(0)
const fromAmount = ref('')
const toAmount = ref('')
const activeShow = ref(0)
const dialogVisibleSwap = ref(false)

const isOnlyGetAmountsOut = computed(() => {
  const ammList = ['viridian', 'aerodrome', 'flapswap']
  const isFourMemeOnlyGetAmountsOut = tokenStore?.pairs?.[0]?.amm && ['fourmeme', 'fourmemev2']?.includes(tokenStore?.pairs?.[0]?.amm)
  const isOneWaySwap = tokenStore?.pairs?.[0]?.amm && ammList.includes(tokenStore?.pairs?.[0]?.amm)
  return swapStore.chain === 'ton' || swapStore.chain === 'sui' || isOneWaySwap || isFourMemeOnlyGetAmountsOut || false
})

const countdownSeconds = 15
const { reset, start } = useCountdown(countdownSeconds, {
  immediate: true,
  onComplete: () => {
    onCountDownFinish()
  }
})

function resetCountdown() {
  reset(15)
  start()
}

function onCountDownFinish() {
  if (swapStore.swapType !== 2 || swapStore.token1.address === swapStore.token2.address) {
    return
  }
  if (loadingConfirmSwap.value || loadingApprove.value || document.visibilityState === 'hidden') {
    resetCountdown()
    return
  }
  if (isAmount.value) {
    watchFromAmount()
  } else {
    watchToAmount()
  }
  resetCountdown()
}
function countDownFinishReset() {
  resetCountdown()
  if (dialogVisibleSwap.value && isApprove.value && !loadingConfirmSwap.value) {
    getSwapTx(false)
  }
}


function handleSelectToken1() {
  swapRouterPath.value = []
  swapQuoteInfo.value.totalTax = 0
  swapQuoteInfo.value.total_sell_tax = 0
  swapQuoteInfo.value.total_buy_tax = 0
  autoSlippageValue.value = initSlippage
  selectedRouterIndex.value = 0
  fromAmount.value = ''
  toAmount.value = ''
  // if (swapStore.activeTab === 1) {
  //   getAllowance()
  // }
  swapStore.getToken1Info()
  swapStore.getBaseToken(handleSelectToken2, handleTaxSlippage)
}
function handleSelectToken2() {
  swapRouterPath.value = []
  swapQuoteInfo.value.totalTax = 0
  swapQuoteInfo.value.total_sell_tax = 0
  swapQuoteInfo.value.total_buy_tax = 0
  autoSlippageValue.value = initSlippage
  selectedRouterIndex.value = 0
  fromAmount.value = ''
  toAmount.value = ''
  // if (swapStore.activeTab === 0) {
  //   getAllowance()
  // }
  swapStore.getToken2Info()
}

function getAllowance() {
  const chain = swapStore.chain
  if (chain === 'solana') {
    swapStore.allowance = MAX_UINT_AMOUNT
    return
  }
  if (chain && chain === swapStore.fromToken.chain && swapStore.fromToken.address) {
    let spender = swapStore.isFourMeme ? swapQuoteInfo.value?.quoteResult?.tokenManager : getSwapContract(chain)
    const sunPumpRouter = ['', 'TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw', 'TZFs5ch1R1C4mmjwrrmZqeqbUgGpxY1yWB'][swapStore.isSunPump]
    spender = sunPumpRouter ? sunPumpRouter : spender
    loadingAllowance.value = true
    allowance(swapStore.fromToken.address, spender).then(res => {
      swapStore.allowance = res.toString()
      console.log('swapStore.allowance', swapStore.allowance)
    }).finally(() => {
      loadingAllowance.value = false
    })
  }
}

function handlePercentChange(val: number | string, noChange=false) {
  if (noChange) {
    return
  }
  const p = Number(val) / 100
  let _fromAmount = swapStore.fromToken.balance || 0
  if (p) {
    const decimals = swapStore.fromToken.decimals || 0
    if (swapStore.fromToken?.address === NATIVE_TOKEN || swapStore.fromToken?.address === 'So11111111111111111111111111111111111111112') {
      const chain = swapStore.fromToken.chain
      const min = MIN_BALANCE[chain] || 0.01
      if (new BigNumber(_fromAmount).lt(min)) {
        ElMessageBox.alert(t('balanceNotEnough', {n: min, s: swapStore.fromToken.symbol}), t('tips'))
        return
      }
      _fromAmount = new BigNumber(_fromAmount).minus(min).times(p).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
    } else {
      _fromAmount = new BigNumber(_fromAmount).times(p).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
    }

    if (Number(_fromAmount) === 0) {
      _fromAmount = ''
    }
  } else {
    _fromAmount = ''
  }
  if (fromAmount.value !== _fromAmount) {
    fromAmount.value = Number(_fromAmount) < 0 ? '0' : _fromAmount
    watchFromAmount()
  }
}

function watchFromAmount() {
  if (quoteLoading.value && !isAmount.value) {
    return
  }
  const val = fromAmount.value
  const n = Number(val)
  if (val === '' || val === '.') {
    fromAmount.value = ''
    toAmount.value = ''
    quoteLoading.value = false
  } else if (n === 0 && Number(toAmount.value) !== 0) {
    toAmount.value = '0'
    quoteLoading.value = false
  } else if (n) {
    isAmount.value = true
    toAmount.value = ''
    getQuoteInfo()
  }
}

function watchToAmount() {
  if (quoteLoading.value && !isAmount.value) {
    return
  }
  const val = toAmount.value
  const n = Number(val)
  if (val === '' || val === '.') {
    fromAmount.value = ''
    toAmount.value = ''
    quoteLoading.value = false
  } else if (n === 0 && Number(fromAmount.value) !== 0) {
    fromAmount.value = '0'
    quoteLoading.value = false
  } else if (n) {
    isAmount.value = false
    fromAmount.value = ''
    getQuoteInfo(false)
  }
}

let Timer: null | ReturnType<typeof setTimeout> = null
function getQuoteInfo(isAmount = true) {
  if (!supportChain()) {
    return
  }
  if (!(Number(fromAmount.value) || Number(toAmount.value))) {
    quoteLoading.value = false
    return
  }
  if (swapStore.token1.address === swapStore.token2.address) {
    // this.$toast({
    //   position: 'top',
    //   message: this.$t('twoIdenticalTokens')
    // })
    return
  }
  if (Timer) {
    clearTimeout(Timer)
    Timer = null
  }
  Timer = setTimeout(() => {
    dealGetQuoteInfo(isAmount, walletStore.chain || '')
  }, 500)
}

async function dealGetQuoteInfo(isAmount: boolean, chain: string) {
  if ((fromAmount.value || toAmount.value) && swapStore.fromToken.address && swapStore.toToken.address && chain === swapStore.fromToken.chain) {
    const fromDecimals = swapStore.fromToken.decimals
    const toDecimals = swapStore.toToken.decimals
    if (chain === 'sui') {
      quoteSui(isAmount, chain)
      return
    }
    if (chain === 'solana') {
      quoteSolana(isAmount, chain)
      return
    }
    if (chain === 'bsc') {
      const isPumpCanSwap = !((swapStore.isFourMeme || swapStore.isFlap) && swapStore.token2.address !== NATIVE_TOKEN && swapStore.token2.chain === 'bsc')
      if (!isPumpCanSwap) {
        return
      }
    }
    if (chain === 'tron') {
      const isPumpCanSwap = !(swapStore.isSunPump > 0 && swapStore.token2.address !== NATIVE_TOKEN && swapStore.token2.chain === 'tron')
      if (!isPumpCanSwap) {
        return
      }
    }
    quoteLoading.value = true
    const params = {
      from_token: swapStore.fromToken.address,
      to_token: swapStore.toToken.address,
      amountIn: isAmount ? parseUnits(
          (new BigNumber(fromAmount.value || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || 0,
          fromDecimals
        )
        .toFixed(0) : '0',
      amountOut: !isAmount ? parseUnits(
          new BigNumber(toAmount.value || 0).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${toDecimals}})?`))?.[0] || 0,
          toDecimals
        )
        .toFixed(0) : '0'
    }

    if (swapStore.isFourMeme) {
      try {
        const res = await quoteFourMeme(params, chain)
        if (isAmount) {
          toAmount.value = formatUnits(res?.amountOut || '0', swapStore.toToken?.decimals)
        } else {
          fromAmount.value = formatUnits(res?.amountIn || '0', swapStore.fromToken?.decimals)
        }
        swapRouterPath.value = [
          {
            symbol: swapStore.fromToken?.symbol,
            nextAmm: 'fourmeme'
          },
          {
            symbol: swapStore.toToken?.symbol,
            nextAmm: ''
          }
        ]
        swapQuoteInfo.value.fromAmount = parseUnits(fromAmount.value, swapStore.fromToken?.decimals).toFixed(0)
        swapQuoteInfo.value.toAmount = parseUnits(toAmount.value, swapStore.toToken?.decimals).toFixed(0)
        swapQuoteInfo.value.fromToken = {...swapStore.fromToken, amount: swapQuoteInfo.value.fromAmount}
        swapQuoteInfo.value.toToken = {...swapStore.toToken, amount: swapQuoteInfo.value.toAmount}
        swapQuoteInfo.value.quoteResult = {...res}
        swapQuoteInfo.value.isAmountOut = !isAmount
        swapQuoteInfo.value.isFourMeme = true
        getAllowance()
        const [token1Id, token2Id] = [swapStore.fromToken?.address + '-' + swapStore.fromToken?.chain, swapStore.toToken?.address + '-' + swapStore.toToken?.chain]
        getTokensPrice([token1Id, token2Id]).then(async res => {
          swapQuoteInfo.value.from_price = res?.[0]?.current_price_usd || 0
          swapQuoteInfo.value.to_price = res?.[1]?.current_price_usd || 0
          swapQuoteInfo.value.isFourMeme = true
        })
        quoteLoading.value = false
      } catch (err) {
        quoteLoading.value = false
        handleError(err)
      }
      return
    }

    if (chain === 'tron' && swapStore.isSunPump > 0) {
      try {
        const res = await quoteSunPump({...params, isSunPump: swapStore.isSunPump}, chain)
        if (isAmount) {
          toAmount.value = formatUnits(res?.amountOut || '0', swapStore.toToken?.decimals)
        } else {
          fromAmount.value = formatUnits(res?.amountIn || '0', swapStore.fromToken?.decimals)
        }
        swapRouterPath.value = [
          {
            symbol: swapStore.fromToken?.symbol,
            nextAmm: 'sunpump'
          },
          {
            symbol: swapStore.toToken?.symbol,
            nextAmm: ''
          }
        ]
        swapQuoteInfo.value.fromAmount = parseUnits(fromAmount.value, swapStore.fromToken?.decimals).toFixed(0)
        swapQuoteInfo.value.toAmount = parseUnits(toAmount.value, swapStore.toToken?.decimals).toFixed(0)
        swapQuoteInfo.value.fromToken = {...swapStore.fromToken, amount: swapQuoteInfo.value.fromAmount}
        swapQuoteInfo.value.toToken = {...swapStore.toToken, amount: swapQuoteInfo.value.toAmount}
        swapQuoteInfo.value.quoteResult = {...res}
        swapQuoteInfo.value.isAmountOut = !isAmount
        swapQuoteInfo.value.isSunPump = swapStore.isSunPump
        getAllowance()
        const [token1Id, token2Id] = [swapStore.fromToken?.address + '-' + swapStore.fromToken?.chain, swapStore.toToken?.address + '-' + swapStore.toToken?.chain]
        getTokensPrice([token1Id, token2Id]).then(async res => {
          swapQuoteInfo.value.from_price = res?.[0]?.current_price_usd || 0
          swapQuoteInfo.value.to_price = res?.[1]?.current_price_usd || 0
          swapQuoteInfo.value.isSunPump = swapStore.isSunPump
        })
        quoteLoading.value = false
      } catch (err) {
        quoteLoading.value = false
        handleError(err)
      }
      return
    }

    const pairs = swapStore.baseToken?.pairs
    if (pairs?.[0]?.target_token === pairs?.[0]?.pair && pairs?.[0]?.pair) {
      const res = await quoteERC314(params, chain)
      console.log('res', res)
      if (res) {
        if (isAmount) {
          toAmount.value = formatUnits(res || '0', swapStore.toToken?.decimals)
        } else {
          fromAmount.value = formatUnits(res || '0', swapStore.fromToken?.decimals)
        }
        swapStore.isERC314 = true
        swapRouterPath.value = [
          {
            symbol: swapStore.fromToken?.symbol,
            nextAmm: pairs?.[0]?.amm
          },
          {
            symbol: swapStore.toToken?.symbol,
            nextAmm: ''
          }
        ]
        swapQuoteInfo.value.fromAmount = parseUnits(fromAmount.value, swapStore.fromToken?.decimals).toFixed(0)
        swapQuoteInfo.value.toAmount = parseUnits(toAmount.value, swapStore.toToken?.decimals).toFixed(0)
        swapQuoteInfo.value.fromToken = {...swapStore.fromToken, amount: swapQuoteInfo.value.fromAmount}
        swapQuoteInfo.value.toToken = {...swapStore.toToken, amount: swapQuoteInfo.value.toAmount}
        const [token1Id, token2Id] = [swapStore.fromToken?.address + '-' + swapStore.fromToken?.chain, swapStore.toToken?.address + '-' + swapStore.toToken?.chain]
        getTokensPrice([token1Id, token2Id]).then(async res => {
          swapQuoteInfo.value.from_price = res?.[0]?.current_price_usd || 0
          swapQuoteInfo.value.to_price = res?.[1]?.current_price_usd || 0
          swapQuoteInfo.value.isERC314 = true
        })
        quoteLoading.value = false
        return
      }
    }
    let wrapper = ''
    if (chain === 'core' && (pairs?.length || 0) > 0) {
      const pair = pairs?.find?.(i => {
        const tokens = [i.token0_address, i.token1_address]
        return tokens.includes(params.from_token) || tokens.includes(params.to_token)
      }) || pairs?.[0]
      const amm = pair?.amm || ''
      const wrapperObj: Record<string, string> = {
        shadowswap: '0x191e94fa59739e188dce837f7f6978d84727ad01'
      }
      wrapper = wrapperObj?.[amm] || '0x40375c92d9faf44d2f9db9bd9ba41a3317a2404f'
      console.log('wrapper', wrapper)
    }
    swapStore.isERC314 = false
    quoteBestRouterV2(params, wrapper, chain).then(_swapPathList => {
      console.log('_swapPathList', _swapPathList)
      swapPathList.value = _swapPathList as typeof swapPathList.value
      selectedRouter(_swapPathList as typeof swapPathList.value)
      getSwapGas()
    }).catch(err => {
      console.log('quote err', err)
      handleError(err)
      if (isAmount) {
        toAmount.value = ''
      } else {
        fromAmount.value = ''
      }
    }).finally(() => {
     setTimeout(() => {
        quoteLoading.value = false
        countDownFinishReset()
      }, 800)
    })
  }
}

async function quoteSui(isAmount: boolean, chain: string) {
  if (chain === 'sui') {
    const fromDecimals = swapStore.fromToken.decimals || swapStore.fromToken?.decimal
    const toDecimals = swapStore.toToken.decimals || swapStore.toToken?.decimal
    const a = swapStore.fromToken.address === NATIVE_TOKEN ? (new BigNumber(fromAmount.value || 0)).times('0.997') : (new BigNumber(fromAmount.value || 0))
    const tokenIn = swapStore.fromToken.address === NATIVE_TOKEN ? '0x2::sui::SUI' : swapStore.fromToken.address
    const params = {
      tokenIn: tokenIn,
      tokenOut: swapStore.toToken.address,
      amountIn: parseUnits(
          a.toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || 0,
          fromDecimals
        ).toFixed(0),
       slippage: new BigNumber(suiTonSlippage.value).div(100).toNumber(),
    }
    quoteLoading.value = true
    return getSuiQuote(params).then(res => {
      console.log('suiQuoteResponse', res)
      if (res.returnAmount && res.returnAmountWithDecimal || res.amount_out) {
        suiQuoteResponse.value = res
        console.log('amountIn', res.routeInfo)
        // if (res.routeInfo?.isExactOut) {
        //   this.fromAmount = res.routeInfo?.amountOut?.amount?.toFixed() || '0'
        // } else {
        //   this.toAmount = res.routeInfo?.amountOut?.amount?.toFixed() || '0'
        // }
        if (isAmount) {
          // this.toAmount = utils.formatUnits(res.amountOut || '0', toDecimals || this.toToken?.decimals)
          toAmount.value = res?.returnAmount || formatUnits(res?.amount_out || '0', res?.to_token?.decimals || toDecimals || swapStore.toToken?.decimals)
        }
        console.log('amountOut', toAmount.value)
        quoteSwapTokenPrice()
      } else {
        handleError('can not get quote')
      }
      getSwapTx(false)
      quoteLoading.value = false
      // this.quoteSolanaPreParams = {}
      return res
    }).catch(err => {
      console.log(err)
      handleError(err?.error || err)
      return Promise.resolve('')
    }).finally(() => {
      setTimeout(() => {
        quoteLoading.value = false
        countDownFinishReset()
      }, 800)
    })
  }
}

let quoteSolanaPreParams: Record<string, any> = {}


function quoteSolana(isAmount: boolean, chain: string) {
  if (chain === 'solana') {
    const isPumpCanSwap = !((swapStore.isPump || swapStore.isMoonshot) && swapStore.token2.address !== 'So11111111111111111111111111111111111111112' && swapStore.token2.chain === 'solana')
    if (!isPumpCanSwap) {
      return
    }
    const fromDecimals = swapStore.fromToken.decimals
    const toDecimals = swapStore.toToken.decimals
    const params: Record<string, any> = {
      inputMint: swapStore.fromToken.address,
      inputDecimals: fromDecimals,
      inputMintSymbol: swapStore.fromToken.symbol,
      inputMintName: swapStore.fromToken.symbol,
      inputAmount: fromAmount.value || 0,
      outputMint: swapStore.toToken.address,
      outputDecimals: toDecimals,
      outputMintSymbol: swapStore.toToken.symbol,
      outputMintName: swapStore.toToken.symbol,
      amount: isAmount ? parseUnits(
          (new BigNumber(fromAmount.value || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || 0,
          fromDecimals
        ).toFixed(0) :  parseUnits(
          (new BigNumber(toAmount.value || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${toDecimals}})?`))?.[0] || 0,
          toDecimals
        ).toFixed(0),
      // 可选
      slippageBps: new BigNumber(solanaSlippage.value).times(100).toFixed(0),
      swapMode: isAmount ? 'ExactIn' : 'ExactOut',
      slippage: solanaSlippage.value || 9,
      // dexes
      // excludeDexes
      // onlyDirectRoutes
      // asLegacyTransaction
      // platformFeeBps
      // maxAccounts
      isPump: swapStore.isPump,
      isMoonshot: swapStore.isMoonshot
    }
    const isSame = quoteSolanaPreParams.amount && Object.keys(quoteSolanaPreParams).every((k) => {
      return params[k] === quoteSolanaPreParams[k]
    })
    if (isSame) {
      // this.quoteLoading = false
      return
    } else {
      quoteSolanaPreParams = {...params}
      setTimeout(() => {
        quoteSolanaPreParams = {}
      }, 15000)
    }
    quoteLoading.value = true
    return getSolanaSwapQuoteTransaction(params).then((res: { routeInfo: { amountOut: { amount: number } }; transaction: any; outAmount: any; inAmount: any }) => {
      console.log('solanaQuoteResponse', res)
      if (res.routeInfo && res.transaction) {
        solanaQuoteResponse.value = res
        console.log('amountOut', res.routeInfo?.amountOut?.amount?.toFixed() || '0')
        toAmount.value = res.routeInfo?.amountOut?.amount?.toFixed() || '0'
        quoteSwapTokenPrice()
      } else {
        if (isAmount) {
          if (res.outAmount) {
            solanaQuoteResponse.value = res
            toAmount.value =  formatUnits(res.outAmount || '0', toDecimals || swapStore.toToken?.decimals)
            quoteSwapTokenPrice()
          } else {
            handleError('can not get quote')
          }
        } else {
          if (res.inAmount) {
            solanaQuoteResponse.value = res
            fromAmount.value =  formatUnits(res.inAmount || '0',fromDecimals || swapStore.fromToken?.decimals)
            quoteSwapTokenPrice()
          } else {
            handleError('can not get quote')
          }
        }
      }
      // this.solanaSwapBaseTokenPrice = this.baseToken?.token?.current_price_usd
      getSwapTx(false)
      return res
    }).catch((err: { error: any }) => {
      console.log(err)
      handleError(err?.error || err)
      return Promise.resolve('')
    }).finally(() => {
      setTimeout(() => {
        quoteLoading.value = false
        quoteSolanaPreParams = {}
        countDownFinishReset()
      }, 800)
    })
  }
}

function  quoteSwapTokenPrice() {
  const chain = swapStore.fromToken.chain
  const token1Id = swapStore.fromToken.address + '-' + chain
  const token2Id = swapStore.toToken.address + '-' + chain
  if (sessionStorage.swap_tokenPrice === token1Id + '-' + token2Id) {
    swapTokenPrice.value = [0, 0]
    if (chain === 'solana') {
      priceImpactSolana.value = 0
    } else if (chain === 'ton') {
      priceImpactTon.value = 0
    } else if (chain === 'sui') {
      priceImpactSui.value = 0
    }
  } else {
    sessionStorage.swap_tokenPrice = token1Id + '-' + token2Id
  }
  return getTokensPrice([token1Id, token2Id]).then(async res => {
    const price1 = res?.[0]?.current_price_usd || 0
    const price2 = res?.[1]?.current_price_usd || 0
    swapTokenPrice.value = [price1, price2]
    const fromAmountD = fromAmount.value || 0
    const toAmountD = toAmount.value || 0
    const _priceImpactSolana = Math.abs(Number(fromAmountD) * price1 / (Number(toAmountD) * price2) - 1)
    if (chain === 'solana') {
      priceImpactSolana.value = _priceImpactSolana
    } else if (chain === 'ton') {
      priceImpactTon.value = _priceImpactSolana
    } else if (chain === 'sui') {
      priceImpactSui.value = _priceImpactSolana
    }
  })
}

function checkAmount() {
  if (!walletStore.provider) {
    return true
  }
  const fromTokenBalance = swapStore.fromToken.balance || 0
  const isPump = ((swapStore.isPump || swapStore.isMoonshot) && swapStore.token2.address !== 'So11111111111111111111111111111111111111112')
  const isBscPump = (swapStore.isFourMeme || swapStore.isFlap) && swapStore.token2.address !== NATIVE_TOKEN
  const isTronPump = swapStore.isSunPump > 0 && swapStore.token2.address !== NATIVE_TOKEN
  return !(
    Number(fromTokenBalance) === 0 ||
    Number(fromTokenBalance) < Number(fromAmount.value) ||
    !walletStore.provider ||
    String(fromAmount.value) === '0' || swapStore.token1.address === swapStore.token2.address || isPump || isBscPump || isTronPump
  )
}

let Timer1: ReturnType<typeof setTimeout> | null = null
function getSwapGas() {
  if (Timer1) {
    clearTimeout(Timer1)
    Timer1 = null
  }
  Timer1 = setTimeout(() => {
    if (!checkAmount() || !isApprove.value || !walletStore.address || loadingSwap.value) {
      return
    }
    if ((swapQuoteInfo.value?.isSunPump || 0) > 0) {
      sunPumpSwap(swapQuoteInfo.value as any, slippage.value).then(async (res: any) => {
        swapSubmitInfo.value = {...res, isSunPump: swapQuoteInfo.value?.isSunPump}
        swapInfo.value = res.swapInfo
        swapInfo.value.gasValue = res.gasValue
        swapInfo.value.swapRouterPath = swapRouterPath.value
      }).catch((err: any) => {
        handleError(err)
      })
    } else if (swapQuoteInfo.value?.isFourMeme) {
      fourMemeSwap(swapQuoteInfo.value as any, slippage.value).then(async (res: any) => {
        swapSubmitInfo.value = {...res, isFourMeme: true}
        swapInfo.value = res.swapInfo
        swapInfo.value.gasValue = res.gasValue
        swapInfo.value.swapRouterPath = swapRouterPath.value
      }).catch((err: any) => {
        handleError(err)
      })
    } else if (swapQuoteInfo.value?.isERC314) {
      ERC314Swap(swapQuoteInfo.value as any).then(async (res) => {
        swapSubmitInfo.value = {...res, isERC314: true}
        swapInfo.value = res.swapInfo
        swapInfo.value.gasValue = res.gasValue
        swapInfo.value.swapRouterPath = swapRouterPath.value
      }).catch(err => {
        handleError(err)
      })
    } else if (swapQuoteInfo.value?.routerPath?.length > 0) {
      swapV2(swapQuoteInfo.value as any, slippage.value).then(async (res) => {
        swapSubmitInfo.value = res
        swapInfo.value = res.swapInfo as any
        swapInfo.value.gasValue = res.gasValue
        swapInfo.value.swapRouterPath = swapRouterPath.value
      }).catch(err => {
        handleError(err)
      })
      _getNativeTokenPrice()
      _getGasPrice()
    }
  }, 3000)
}

function _getNativeTokenPrice() {
  const chain1 = swapStore.token1.chain
  const chain2 = swapStore.token2.chain
  const chain = walletStore.chain
  if (!(chain && chain === chain1 && chain === chain2)) {
    return
  }
  getNativeTokenPrice(chain).then((res) => {
    nativePrice.value = res
  })
}
function _getGasPrice() {
  const chain = walletStore.chain
  if (chain === 'solana') {
    return
  }
  const chain1 = swapStore.token1.chain
  const chain2 = swapStore.token2.chain
  if (!chain || chain1 !== chain2 || chain !== chain1) {
    return
  }
  getGasPrice(chain).then(res => {
    gasPrice.value = res?.toString() || '0'
  }).catch(err => {
    console.log(err)
    gasPrice.value = '0'
  })
}

function selectedRouter(_swapPathList = swapPathList.value) {
  const routerInfo = _swapPathList[selectedRouterIndex.value]
  const res = _swapPathList[selectedRouterIndex.value].routerPath
  const _isAmount = isAmount.value
  const fromDecimals = swapStore.fromToken.decimals
  const toDecimals = swapStore.toToken.decimals
  let isCurReq = false
  if (_isAmount) {
    const amountIn = parseUnits(
        (new BigNumber(fromAmount.value || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromDecimals}})?`))?.[0] || '0',
        fromDecimals
      )
      .toFixed(0)

    const amountInRes = res[0]?.amount || 0
    isCurReq = amountIn === amountInRes
  } else {
    const amountOut = parseUnits(
        new BigNumber(toAmount.value || 0).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${toDecimals}})?`))?.[0] || '0',
        toDecimals
      )
      .toFixed(0)
    const amountOutRes = res[res.length - 1]?.amount || 0
    isCurReq = amountOut === amountOutRes
  }
  if (!isCurReq) {
    return
  }
  if (routerInfo.from_cannot_sell_all === 1) {
    const balance = new BigNumber(parseUnits(String(swapStore.fromToken.balance), swapStore.fromToken?.decimals).toFixed(0))
    const fromTokenAmount = new BigNumber(routerInfo?.routerPath[0].amount)
    isCannotSellAll.value = balance.gt(0) && fromTokenAmount.div(balance).gt(0.99999)
  } else {
    isCannotSellAll.value = false
  }
  isTax.value = (routerInfo?.totalTax || 0) > 0 || (routerInfo?.total_sell_tax || 0) > 0 || (routerInfo?.total_buy_tax || 0) > 0
  const priceImpact = _getPriceImpact(routerInfo)
  if (isTax.value || priceImpact.gt(0.5)) {
    isTaxHigh.value = (routerInfo?.total_sell_tax || 0) + (routerInfo?.total_buy_tax || 0) + 1 > 49.99
    const tax = routerInfo.totalTax || ((routerInfo.total_sell_tax || 0) + (routerInfo.total_buy_tax || 0))
    const priceI = Number(priceImpact)
    if (customSlippage.value === 'auto') {
      let slippage = tax + priceI + ((tax > 5 || priceI > 5) ? 2.5 : 2)
      slippage = Math.max(Math.min(slippage, 49.99), 0.5)
      autoSlippageValue.value = String(Number(slippage.toFixed(2)))
    }

  } else {
    isTaxHigh.value = false
    if (customSlippage.value === 'auto') {
      autoSlippageValue.value = initSlippage
    }
  }

  swapQuoteInfo.value = routerInfo as any
  swapRouterPath.value = res.map((i: { symbol: any }, k: string | number)=> {
    return {
      symbol: i.symbol,
      nextAmm: routerInfo?.pair_path?.[k]?.amm || ''
    }
  })
  listRouter.value = swapPathList.value.map(res => {
    let outAmount: number | string = 0
    let amount: number | string = 0
    if (isAmount.value) {
      const outToken = res.routerPath[res.routerPath.length - 1]
      outAmount = formatUnits(outToken.amount || '0', outToken?.decimals || swapStore.toToken?.decimals)
    } else {
      const inToken = res.routerPath[0]
      amount = formatUnits(inToken.amount || '0', inToken?.decimals || swapStore.fromToken.decimals)
    }
    const m = res.routerPath.map((i: { symbol: any }, k: string | number) => {
      return {
        symbol: i.symbol,
        nextAmm: res?.pair_path?.[k]?.amm || '',
      }
    })
    return {path: m, amount: isAmount.value? outAmount : amount, priceImpact: res.priceImpact}
  })
  if (isAmount.value) {
    const outToken = res[res.length - 1]
    toAmount.value = formatUnits(outToken.amount || '0', outToken?.decimals || swapStore.toToken?.decimals)
  } else {
    const inToken = res[0]
    fromAmount.value = formatUnits(inToken.amount || '0', inToken?.decimals || swapStore.fromToken?.decimals)
  }
  // const tax = routerInfo.totalTax || (routerInfo?.total_sell_tax + routerInfo.total_buy_tax) || 0
  // this.baseTokenPrice = new BigNumber(toAmount.value).div(fromAmount.value).times(100 - tax).div(100).toFixed()
  if (isCurReq) {
    setTimeout(() => {
      quoteLoading.value = false
      countDownFinishReset()
    }, 800)
  }
}

function supportChain() {
  const chain = walletStore.chain
  const swapChains = (Object.keys(SwapContracts)).concat(['solana', 'sui'])
  const c1 = swapStore.token1.chain
  const c2 = swapStore.token2.chain
  if (c1 && !swapChains?.includes?.(c1)) {
    return false
  }
  if (c2 && !swapChains?.includes?.(c2)) {
    return false
  }
  if (!chain) {
    return false
  }
  if (chain && !swapChains?.includes?.(chain)) {
    return false
  }

  if (chain !== c1 || chain !== c2) {
    return false
  }
  return true
}

function handleTaxSlippage() {
  if (swapStore.activeTab === 1) {
    if (Number(autoSlippageValue.value) > (Number(swapStore.baseTokenExtra?.sell_tax) + 1)) {
      return
    }
    const slippage = Math.max(Math.min((Number(swapStore.baseTokenExtra?.sell_tax) + 1), 49.99), 0.5)
    autoSlippageValue.value = String(Number(slippage.toFixed(2)))
  } else {
    if (Number(autoSlippageValue.value) > (Number(swapStore.baseTokenExtra?.buy_tax) + 1)) {
      return
    }
    const slippage = Math.max(Math.min((Number(swapStore.baseTokenExtra?.buy_tax) + 1), 49.99), 0.5)
    autoSlippageValue.value = String(Number(slippage.toFixed(2)))
  }
}

function _getPriceImpact(swapQuoteInfo: { routerPath: any; from_price: number; to_price: number }) {
  if (!(Number(fromAmount.value) || Number(toAmount.value))) {
    return new BigNumber(0)
  }
  const routerPath = swapQuoteInfo.routerPath
  const fromToken = routerPath?.length > 0 ? routerPath?.[0] : null
  const toToken = routerPath?.length > 0 ? routerPath?.[routerPath.length - 1] : null
  if (fromToken && toToken) {
    const fromPrice = swapQuoteInfo.from_price
    const toPrice = swapQuoteInfo.to_price
    const fromAmount = formatUnits(fromToken.amount, fromToken.decimals)
    const toAmount = formatUnits(toToken.amount, toToken.decimals)
    return ((new BigNumber(fromAmount).times(fromPrice)).div((new BigNumber(toAmount).times(toPrice)))).minus(1).abs().times(100)
  }
  return new BigNumber(0)
}

function checkSupportChainMessage() {
  const chain = walletStore.chain
  const swapChains = (Object.keys(SwapContracts)).concat(['solana', 'sui'])
  const chainInfo = getChainInfo(chain)
  const chainName = chainInfo?.name || ''
  const c1 = swapStore.token1.chain
  const c2 = swapStore.token2.chain
  const c1Name = getChainInfo(c1)?.name
  const c2Name = getChainInfo(c2)?.name
  if (c1 && !swapChains?.includes?.(c1)) {
    return t('noSupportChain', {chain: c1Name})
  }
  if (c2 && !swapChains?.includes?.(c2)) {
    return t('noSupportChain', {chain: c2Name})
  }
  // if (this.$store.state.currentAccount?.startsWith?.('T')) {
  //   return this.$t('noSupportChain', {chain: 'TRON'})
  // }
  if (chain && !swapChains?.includes?.(chain)) {
    return t('noSupportChain', {chain: chainName})
  }
  if ((chain !== c1 && c1) || (chain !== c2 && c2)) {
    return t('chainNotSame1')
  }
  if (c1 !== c2) {
    return t('tokenNoSameChain')
  }
}

function jumpAveSniperBot () {
  let params =''
  if (swapStore.activeTab === 0) {
    params = `solana-${swapStore.token1.address}-ref_aveai`
  } else {
    params = `solana-${swapStore.token1.address}-ref_aveai`
  }
  window.open(`https://t.me/AveSniperBot?start=${params}`)
}

function onSubmit() {
  try {
    if (!walletStore.provider) {
      handleWalletAddress()
      return
    }
    if (!supportChain()) {
      return
    }
    const chain = walletStore.chain
    const chain1 = swapStore.token1.chain || swapStore.token2.chain || chain
    if (chain !== chain1) {
      ElMessageBox.alert(t('plsSwitchChain', { chain }), t('tips'), {
        confirmButtonText: t('confirm'),
      })
      return
    }

    if (swapStore.swapType === 2) {
      activeShow.value = 1
      if (!isApprove.value) {
        _approve()
      } else {
        getSwapTx()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function _approve() {
  loadingApprove.value = true
  let spender = swapStore.isFourMeme ? swapQuoteInfo.value?.quoteResult?.tokenManager : getSwapContract(chain.value)
  const sunPumpRouter = ['', 'TTfvyrAz86hbZk5iDpKD78pqLGgi8C7AAw', 'TZFs5ch1R1C4mmjwrrmZqeqbUgGpxY1yWB'][swapStore.isSunPump]
  spender = sunPumpRouter ? sunPumpRouter : spender
  approve(swapStore.fromToken.address, spender).then(res => {
    return res.wait()
  })
  .then((res) => {
    console.log(res)
    getAllowance()
  })
  .catch((err) => {
    handleError(err)
  })
  .finally(() => {
    loadingApprove.value = false
  })
}

function checkAmountMessage() {
  const fromTokenBalance = swapStore.fromToken.balance || 0
  const isPump = ((swapStore.isPump || swapStore.isMoonshot) && swapStore.token2.address !== 'So11111111111111111111111111111111111111112')
  const isBscPump = (swapStore.isFourMeme || swapStore.isFlap) && swapStore.token2.address !== NATIVE_TOKEN
  const isTronPump = swapStore.isSunPump > 0 && swapStore.token2.address !== NATIVE_TOKEN
  const walletAddress = walletStore.address
  if (!walletAddress) {
    return t('pConnectWallet')
  } else if (walletAddress && !walletStore.provider) {
    return t('observeAddressNotSwap')
  } else if (swapStore.isERC314 && swapStore.token2.address !== NATIVE_TOKEN || isPump || isBscPump || isTronPump) {
    return t('ERC314Tips')
  } else if (Number(fromTokenBalance) === 0 || Number(fromTokenBalance) < Number(fromAmount.value) || !walletAddress) {
    return t('insufficientBalance')
  } else if (String(fromAmount.value) === '0') {
    return t('AmountCannotBeZero')
  }
}

function getSwapTx(isOpenSwap = true) {
  if (Timer1) {
    clearTimeout(Timer1)
    Timer1 = null
  }
  if(!checkAmount()) {
    ElMessageBox.alert(checkAmountMessage(), t('tips'), {
      confirmButtonText:  t('okay'),
    })
    return
  }
  if (swapStore.chain === 'sui') {
    const dex = suiQuoteResponse?.routes?.[0]?.hops?.[0]?.pool?.type
    console.log('dex', dex)
    const _swapRouterPath = [swapStore.fromToken, swapStore.toToken].map((i, k)=> {
      return {
        symbol: i.symbol,
        nextAmm: k === 0 ? (dex|| '') : ''
      }
    })
    swapInfo.value = {
      swapRouterPath: _swapRouterPath,
      fromAmount: fromAmount.value,
      toAmount: toAmount.value,
      fromToken: swapStore.fromToken,
      toToken: swapStore.toToken,
      isAmountOut: false
    }
    if (isOpenSwap) {
      dialogVisibleSwap.value = true
    }
    swapRouterPath.value = _swapRouterPath
  } else if (swapStore.chain === 'solana') {
    const _swapRouterPath = [swapStore.fromToken, swapStore.toToken].map((i)=> {
      return {
        symbol: i.symbol,
        nextAmm: ''
      }
    })
    swapInfo.value = {
      swapRouterPath: _swapRouterPath,
      fromAmount: fromAmount.value,
      toAmount: toAmount.value,
      fromToken: swapStore.fromToken,
      toToken: swapStore.toToken,
      isAmountOut: false
    }
    if (isOpenSwap) {
      dialogVisibleSwap.value = true
    }
  } else if ((swapQuoteInfo.value?.isSunPump || 0) > 0) {
    loadingSwap.value = true
    sunPumpSwap(swapQuoteInfo.value as any, slippage.value).then(async (res) => {
      swapSubmitInfo.value = {...res, isSunPump: swapQuoteInfo.value?.isSunPump}
      swapInfo.value = res.swapInfo
      swapInfo.value.gasValue = res.gasValue
      swapInfo.value.swapRouterPath = swapRouterPath.value
      loadingSwap.value = false
      if (isOpenSwap) {
        dialogVisibleSwap.value = true
      }
    }).catch(err => {
      loadingSwap.value = false
      handleError(err)
    })
    _getNativeTokenPrice()
    _getGasPrice()
  } else if (swapQuoteInfo.value?.isFourMeme) {
    loadingSwap.value = true
    fourMemeSwap(swapQuoteInfo.value as any, slippage.value).then(async (res) => {
      swapSubmitInfo.value = {...res, isFourMeme: true}
      swapInfo.value = res?.swapInfo as typeof swapInfo.value
      swapInfo.value.gasValue = res?.gasValue || '0'
      swapInfo.value.swapRouterPath = swapRouterPath.value
      loadingSwap.value = false
      if (isOpenSwap) {
        dialogVisibleSwap.value = true
      }
    }).catch(err => {
      loadingSwap.value = false
      handleError(err)
    })
    _getNativeTokenPrice()
    _getGasPrice()
  } else if (swapQuoteInfo.value?.isERC314) {
    loadingSwap.value = true
    ERC314Swap(swapQuoteInfo.value).then(async (res) => {
      swapSubmitInfo.value = {...res, isERC314: true}
      swapInfo.value = res.swapInfo
      swapInfo.value.gasValue = res.gasValue
      swapInfo.value.swapRouterPath = swapRouterPath.value
      loadingSwap.value = false
      if (isOpenSwap) {
        dialogVisibleSwap.value = true
      }
    }).catch(err => {
      loadingSwap.value = false
      handleError(err)
    })
    _getNativeTokenPrice()
    _getGasPrice()
  } else if (swapQuoteInfo.value?.routerPath?.length > 0) {
    loadingSwap.value = true
    swapV2(swapQuoteInfo.value as any, slippage.value).then(async (res) => {
      swapSubmitInfo.value = res
      swapInfo.value = {...res.swapInfo,fromToken: {...res.swapInfo.fromToken, ...swapStore.fromToken}, toToken: {...res.swapInfo.fromToken, ...swapStore.toToken},
        fromAmount: fromAmount.value,
        toAmount: toAmount.value,
        isAmountOut: res.swapInfo.isAmountOut || false
      }
      swapInfo.value.gasValue = res.gasValue
      swapInfo.value.swapRouterPath = swapRouterPath.value
      loadingSwap.value = false
      if (isOpenSwap) {
        dialogVisibleSwap.value = true
      }
    }).catch(err => {
      loadingSwap.value = false
      handleError(err)
    })
    _getNativeTokenPrice()
    _getGasPrice()
  }
}

function handleWalletAddress() {
  if (!walletStore.provider) {
    ElMessageBox.alert(t('browserWalletNotDetected'), t('tips'), {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: t('confirm'),
    })
  }
}
function alertTips(title: string, message: string) {
  ElMessageBox
    .alert(message, title, {
      confirmButtonText: t('getIt'),
    })
    .then(() => {
      // on close
    })
}

function getAvgPrice() {
  if (!fromAmount.value || !toAmount.value) {
    return '--'
  }
  let _fromAmount: string | BigNumber = fromAmount.value
  let _toAmount: string | BigNumber = toAmount.value
  if (isTax.value) {
    let tax = swapQuoteInfo.value?.totalTax || ((swapQuoteInfo.value?.total_sell_tax || 0) + (swapQuoteInfo.value?.total_buy_tax || 0))
    tax = Math.min(49, tax)
    if (!swapQuoteInfo.value?.isAmountOut) {
      _toAmount = new BigNumber(_toAmount).times(100 - tax).div(100)
    } else {
      _fromAmount = new BigNumber(_fromAmount).times(100 + tax).div(100)
    }
  }
  const isPrice = ['solana', 'sui'].includes(chain.value)
  const fromPrice = isPrice ? swapTokenPrice.value[0] : swapQuoteInfo.value.from_price
  const toPrice = isPrice ? swapTokenPrice.value[1] :  swapQuoteInfo.value.to_price
  if (!fromPrice || !toPrice) {
    return '--'
  }
  // 买入时，S 是目标代币，预估价格:
  // Ps' = (Sb/Ss) / (Ps/Pb)  * Ps， Ps 是旧的卖出代币价格

  // 卖出时，B是目标代币， 预估价格:
  // Pb' = (Ss/Sb) / (Pb/Ps) * Pb， Pb 是旧的买入代币价格

  // Pb - 兑换前，买入代币的价格
  // Ps - 对话前，卖出代币的价格
  // Ss - 兑换后，卖出代币的兑换数量
  // Sb - 兑换后，买入代币的兑换数量

  // Ps' 新的卖出代币价格
  // Pb' 新的买入代币价格
  if (swapStore.activeTab === 0) {
    return formatNumber((Number(fromAmount.value || 0) / Number(toAmount.value)) / (toPrice / fromPrice) * toPrice)
  } else if (swapStore.activeTab === 1) {
    return formatNumber((Number(toAmount.value || 0) / Number(fromAmount.value)) / (fromPrice / toPrice) * fromPrice)
  }
}

function getSelectedRouter (index: number) {
  dialogListRouterVisible.value = false
  selectedRouterIndex.value = index
  selectedRouter()
}

// 提交交易
async function submitSwap(_swapSubmitInfo = swapSubmitInfo.value) {
  try {
    if (chain.value === 'solana') {
      submitSolanaSwap()
      return
    }
    if (chain.value === 'sui') {
      submitSuiSwap()
      return
    }
    loadingConfirmSwap.value = true
    loadingSwap.value = true
    console.log('swapSubmitInfo', swapSubmitInfo)
    const swapCallStaticResult = await _swapSubmitInfo.swapCallStatic()
    console.log('swapCallStaticResult', swapCallStaticResult.toString())
    const _swapInfo = _swapSubmitInfo.swapInfo
    const isSwap = !((_swapInfo.fromToken.isWrapper && _swapInfo.toToken.isETH) || (_swapInfo.toToken.isWrapper && _swapInfo.fromToken.isETH))
    const txInfo = {
      from_address: _swapInfo.fromToken.address,
      from_symbol: _swapInfo.fromToken.symbol,
      from_amount: Number(formatUnits(_swapInfo.fromTokenAmount || 0, _swapInfo.fromToken.decimals)),
      to_address: _swapInfo.toToken.address,
      to_symbol: _swapInfo.toToken.symbol,
      to_amount: Number(formatUnits(_swapInfo.toTokenAmount || 0, _swapInfo.toToken.decimals)),
      chain: chain.value,
      transaction: '',
      wallet_address: walletStore.address,
    }
    // let tx = {}
    activeShow.value = 2
    swapSubmitInfo.value.swap().then((res: { hash: any; wait: () => any }) => {
      console.log('---confirm transaction---', res)
      swapInfo.value.transaction = res.hash
      // 记录交易
      recordTransaction({
        chain: chain.value,
        destination: 'wallet rpc',
        type: 10,
        tx_hash: res.hash,
        status: 1,
        wallet: walletStore.address,
        out_token: txInfo.to_address,
        out_amount:  Number(formatUnits(_swapInfo.toTokenAmount || 0, _swapInfo.toToken.decimals)),
        in_token: txInfo.from_address,
        in_amount: Number(formatUnits(_swapInfo.fromTokenAmount || 0, _swapInfo.fromToken.decimals))
      })
      // if (isSwap) {
      //   txInfo.transaction = res.hash
      //   tx = {
      //     time: Math.floor(Date.now() / 1000),
      //     id: txInfo.transaction,
      //     chain: chain.value,
      //     transaction: res.hash,
      //     from_address: txInfo.from_address,
      //     from_price_eth: 0,
      //     from_price_usd: '',
      //     from_symbol: swapInfo.fromToken.symbol,
      //     from_amount: Number(formatUnits(swapInfo.fromTokenAmount || 0, swapInfo.fromToken.decimals)),
      //     to_address: txInfo.to_address,
      //     to_price_eth: 0,
      //     to_price_usd: '',
      //     to_symbol: swapInfo.toToken.symbol,
      //     to_amount: Number(formatUnits(swapInfo.toTokenAmount || 0, swapInfo.toToken.decimals)),
      //     is_merged: 0,
      //     isERC314: swapSubmitInfo.value?.isERC314 || false,
      //     isFourMeme: swapSubmitInfo.value?.isFourMeme || false,
      //     isSunPump: swapSubmitInfo.value?.isSunPump || 0,
      //     wallet_address: walletStore.address,
      //     from_address_logo_url: swapStore.fromToken?.logo_url,
      //     to_address_logo_url: swapStore.toToken?.logo_url,
      //   }
      //   this.initTxs.unshift(tx)
      // }
      loadingSwap.value = false
      loadingConfirmSwap.value = false

      fromAmount.value = ''
      toAmount.value = ''
      percentStepRef.value?.handleClick?.(0)
      // this.dialogVisibleSwap = false
      activeShow.value = 3
      return res.wait()
    }).then((res: { hash: string, to: string }) => {
      console.log('----transaction---', res)
      updateTransaction({
        chain: chain.value,
        tx_hash: res.hash,
        status: 100,
        to: res?.to?.toLowerCase?.() || '',
      })
      selectedRouterIndex.value = 0
      swapPathList.value = []
      setTimeout(() => {
        swapStore.getTokenDetails()
        swapStore.getUserTokenList()
        getAllowance()
        if (swapStore.token1.chain === 'tron' || swapStore.token2.chain === 'tron') {
          setTimeout(() => {
            swapStore.getTokenDetails()
          }, 3000)
        }
      }, 1000)
      if (isSwap) {
        // console.log('this.initTxs', this.initTxs)
        // this.initTxs.forEach(item => {
        //   if (item.transaction === res.transactionHash) {
        //     item.is_merged = 1
        //     item.time = parseInt(Date.now() / 1000)
        //     if (item?.isERC314 || item?.isFourMeme || item?.isSunPump > 0) {
        //       this.ERC314SwapTxs = [item, ...this.ERC314SwapTxs?.slice?.()?.filter?.(i => i.transaction !== res.transactionHash)]
        //     }
        //   }
        // })
        // if (!swapSubmitInfo?.isERC314 && !swapSubmitInfo?.isFourMeme && !swapSubmitInfo?.isSunPump) {
        //   this.getUserAllTxs(tx)
        // }
      }
      return res
    }).catch((err: any) => {
      activeShow.value = 1
      console.log('swap err', err)
      resetCountdown()
      loadingSwap.value = false
      loadingConfirmSwap.value = false
      if (isSwap) {
        // this.getUserAllTxs()
      }
      handleError(err, 'swap')
    })
  } catch (err) {
    console.log('swap err', err)
    loadingSwap.value = false
    loadingConfirmSwap.value = false
    handleError(err, 'swap')
  }
}

async function submitSolanaSwap() {
  try {
    activeShow.value = 1
    loadingConfirmSwap.value = true
    loadingSwap.value = true
    // const price1 = swapStore.baseToken?.token?.current_price_usd || 0
    // const isRetryQuote = solanaSwapBaseTokenPrice ? new BigNumber(price1).minus(this.solanaSwapBaseTokenPrice).times(100).div(this.solanaSwapBaseTokenPrice).abs().gt(this.solanaSlippage) : true
    // console.log('price', price1, this.solanaSwapBaseTokenPrice, isRetryQuote)
    // if (isRetryQuote) {
    //   await this.quoteSolana(this.isAmount, 'solana')
    // }
    const _swapInfo = swapInfo.value
    const txInfo = {
      from_address: _swapInfo.fromToken.address,
      from_symbol: _swapInfo.fromToken.symbol,
      from_amount: Number(formatUnits(_swapInfo.fromTokenAmount || 0, _swapInfo.fromToken.decimals)),
      to_address: _swapInfo.toToken.address,
      to_symbol: _swapInfo.toToken.symbol,
      to_amount: Number(formatUnits(_swapInfo.toTokenAmount || 0, _swapInfo.toToken.decimals)),
      chain: walletStore.chain,
      transaction: '',
      wallet_address: walletStore.address,
    }
    // let tx = {}
    setTimeout(() => {
      if (!dialogVisibleSwap.value) {
        loadingSwap.value = false
        loadingConfirmSwap.value = false
      }
    }, 6000)
    // const isSwap = true
    sendSolanaSwapTransaction(solanaQuoteResponse.value).then((res: { hash: string | undefined; wait: () => any }) => {
      console.log('---confirm transaction---', res)
      swapInfo.value.transaction = res.hash
      recordTransaction({
        chain: 'solana',
        destination: localStorage.solanaProtection === 'true' ? 'v1/blxrsol/sendSolTx' : '/ave_nodes/rpc/solana/sendFastSwapTx',
        type: 10,
        tx_hash: res.hash,
        status: 1,
        wallet: walletStore.address,
        out_token: txInfo.to_address,
        out_amount: _swapInfo.toAmount,
        in_token: txInfo.from_address,
        in_amount: _swapInfo.fromAmount
      })
      // if (isSwap) {
      //   txInfo.transaction = res.hash
      //   tx = {
      //     time: parseInt(Date.now() / 1000),
      //     id: txInfo.transaction,
      //     chain: this.netId,
      //     transaction: res.hash,
      //     from_address: txInfo.from_address,
      //     from_price_eth: 0,
      //     from_price_usd: '',
      //     from_symbol: swapInfo.fromToken.symbol,
      //     from_amount: swapInfo.fromAmount,
      //     to_address: txInfo.to_address,
      //     to_price_eth: 0,
      //     to_price_usd: '',
      //     to_symbol: swapInfo.toToken.symbol,
      //     to_amount: swapInfo.toAmount,
      //     is_merged: 0,
      //     wallet_address: this.$store.state.currentAccount || '',
      //     from_address_logo_url: swapInfo.fromToken.logo_url,
      //     to_address_logo_url: swapInfo.toToken.logo_url,
      //   }
      //   this.solanaTxs.unshift(tx)
      //   this.solanaTxs = this.solanaTxs?.slice?.(0, 500)
      // }
      loadingSwap.value = false
      loadingConfirmSwap.value = false

      fromAmount.value = ''
      toAmount.value = ''
      // this.$refs?.percentStep?.handleClick?.(0)
      percentStepRef.value?.handleClick?.(0)
      activeShow.value = 3
      return res.wait()
    }).then((res: { transaction: { signatures: any[] }; blockTime: any; transactionHash: any }) => {
      console.log('----transaction---', res)
      if (res) {
        updateTransaction({
          chain: 'solana',
          tx_hash: res?.transaction?.signatures[0],
          status: 100
        })
        // const [fromAmount, toAmount] = getTransactionTokenChange(res, _swapInfo.fromToken.address, _swapInfo.toToken.address)
        swapStore.getTokenDetails()
        swapStore.getUserTokenList()
        // if (isSwap) {
        //   this.solanaTxs = this.solanaTxs.slice().map(item => {
        //     const i = {...item}
        //     if (item.transaction === res?.transaction?.signatures[0]) {
        //       i.is_merged = 1
        //       i.time = res?.blockTime
        //       if (fromAmount && Number(fromAmount) > 0) {
        //         i.from_amount = fromAmount
        //       }
        //       if (toAmount && Number(toAmount) > 0) {
        //         i.to_amount = toAmount
        //       }
        //     }
        //     return i
        //   })
        //   // this.getUserAllTxs(tx)
        // }
        // this.getGasBalance()
      } else {
        // if (isSwap) {
        //   this.solanaTxs = this.solanaTxs.filter(i => i.transaction !== res.transactionHash)
        // }
      }
      return res
    }).catch((err: any) => {
      if ((err || err?.message) === 'Timeout') {
        ElNotification({ type: 'error', message: t('timeout_error') })
      } else if ((err || err?.message) === 'Swap fail') {
        ElNotification({ type: 'error', message: t('swapFail') })
      } else {
        handleError(err, 'solana')
      }
      // this.solanaSwapBaseTokenPrice = 0
      resetCountdown()
      loadingSwap.value = false
      loadingConfirmSwap.value = false
    })
  } catch (err) {
    // this.solanaSwapBaseTokenPrice = 0
    loadingSwap.value = false
    loadingConfirmSwap.value = false
    handleError(err, 'solana')
  }
}

async function submitSuiSwap() {
  try {
    loadingConfirmSwap.value = true
    loadingSwap.value = true
    // let price1 = this.baseToken?.token?.current_price_usd || 0
    // let isRetryQuote = this.tonSwapBaseTokenPrice ? new BigNumber(price1).minus(this.tonSwapBaseTokenPrice).times(100).div(this.tonSwapBaseTokenPrice).abs().gt(this.tonSlippage) : true
    // console.log('price', price1, this.solanaSwapBaseTokenPrice, isRetryQuote)
    // if (isRetryQuote) {
    //   await this.quoteTon(this.isAmount, 'ton')
    // }
    activeShow.value = 2
    const _swapInfo = swapInfo.value
    const txInfo = {
      from_address: _swapInfo.fromToken.address,
      from_symbol: _swapInfo.fromToken.symbol,
      from_amount: _swapInfo?.fromAmount,
      from_decimals: _swapInfo?.fromToken.decimals,
      to_address: _swapInfo.toToken.address,
      to_symbol: _swapInfo.toToken.symbol,
      to_amount: _swapInfo?.toAmount,
      to_decimals: _swapInfo?.toToken.decimals,
      chain: 'sui',
      transaction: '',
      wallet_address: walletStore.address,
    }
    console.log('txInfo', txInfo)
    // let tx = {}
    setTimeout(() => {
      if (!dialogVisibleSwap.value) {
        loadingSwap.value = false
        loadingConfirmSwap.value = false
      }
    }, 6000)
    const isSwap = true
    buildSuiTx({
      quoteResponse: suiQuoteResponse.value,
      slippage: new BigNumber(suiTonSlippage.value).div(100).toNumber(), // this.tonSlippage
    }).then((res: { tx: any }) => {
      console.log('res', res)
      // if (this.sui_address) {
      //   return this.sui_signAndExecuteTransactionBlock(res?.tx)
      // } else {
      //   return getWallets().get()[0].features['sui:signAndExecuteTransactionBlock'].signAndExecuteTransactionBlock({
      //     transactionBlock: res?.tx,
      //     chain: `sui:mainnet`,
      //     account: this.$store.state.suiWalletAccount
      //   })
      // }
      // return Promise.resolve({
      //   digest: '5qPGGU3F7xrJ7ACH7CVoRAdP5Ng7e8js8dLofvEhDVbU'
      // })
      return sui_signAndExecuteTransactionBlock(res?.tx || res)
    }).then(res => {
      console.log('sui_signAndExecuteTransactionBlock', res)
      if (!res?.digest) {
        return Promise.reject('Swap fail')
      } else {
        swapInfo.value.transaction = res.digest
        if (isSwap) {
          txInfo.transaction = res.digest
          recordTransaction({
            chain: 'sui',
            destination: 'wallet rpc',
            type: 10,
            tx_hash: res.digest,
            status: 1,
            wallet: walletStore.address,
            out_token: txInfo.to_address,
            out_amount: swapInfo.value.toAmount,
            in_token: txInfo.from_address,
            in_amount: swapInfo.value.fromAmount
          })
          // tx = {
          //   time: Math.floor(Date.now() / 1000),
          //   id: txInfo.transaction,
          //   chain: 'sui',
          //   transaction: res.digest,
          //   from_address: txInfo.from_address,
          //   from_price_eth: 0,
          //   from_price_usd: swapTokenPrice.value[0] || 0,
          //   from_symbol: swapInfo.value.fromToken.symbol,
          //   from_amount: swapInfo.value.fromAmount,
          //   to_address: txInfo.to_address,
          //   to_price_eth: 0,
          //   to_price_usd: swapTokenPrice.value[1] || 0,
          //   to_symbol: swapInfo.value.toToken.symbol,
          //   to_amount: swapInfo.value.toAmount,
          //   is_merged: 0,
          //   wallet_address: walletStore.address || '',
          //   from_address_logo_url: swapInfo.value.fromToken.logo_url,
          //   to_address_logo_url: swapInfo.value.toToken.logo_url,
          // }
          // this.suiTxs.unshift(tx)
          // this.suiTxs = this.suiTxs?.slice?.(0, 500)
        }
        loadingSwap.value = false
        loadingConfirmSwap.value = false

        fromAmount.value = ''
        toAmount.value = ''
        // this.$refs?.percentStep?.handleClick?.(0)
        percentStepRef.value?.handleClick?.(0)
        // dialogVisibleSwap.value = false
        activeShow.value = 3
        return res.wait()
      }
    }).then(res => {
      console.log('res', res)
      if (res.digest) {
        updateTransaction({
          chain: 'sui',
          tx_hash: res?.digest,
          status: 100
        })
        ElNotification({ type: 'success', message: t('tradeSuccess') })
        swapStore.getTokenDetails()
        swapStore.getUserTokenList()
        // const amountChange = sui_getBalanceChanges({ txInfo, balanceChanges: res?.balanceChanges || [] })
        if (isSwap) {
          // this.suiTxs = this.suiTxs.slice().map(item => {
          //   let i = {...item}
          //   if (item.transaction === res?.digest) {
          //     i.is_merged = 1
          //     i.time = res?.timestampMs || Date.now()
          //     i.event_id = res?.event_id
          //     i = {...i, ...amountChange}
          //   }
          //   return i
          // })
        } else {
          updateTransaction({
            chain: 'sui',
            tx_hash: res?.digest,
            status: -100
          })
          ElNotification({ type: 'error', message: t('tradeFail') }) // this.$n({ type: 'danger', message: this.$t('tradeFail') })
            if (isSwap) {
              // this.suiTxs = this.suiTxs.filter(i => i.transaction !== res.hash)
            }
          }
          return res
        }
    }).catch(err => {
      // if (/'Timeout'/i.test(err || err?.message || '')) {
      //   this.suiTxs = this.suiTxs.map(i => {
      //     if (i.transaction === txInfo.transaction) {
      //       return {
      //         ...i,
      //         status: 'timeout'
      //       }
      //     }
      //     return {...i}
      //   })
      // } else {
      //   this.suiTxs = this.suiTxs?.filter?.(i => i.transaction !== txInfo.transaction) || []
      // }
      activeShow.value = 1
      loadingSwap.value = false
      loadingConfirmSwap.value = false
      handleError(err, 'solana')
      resetCountdown()
    })
  } catch (err) {
    // this.tonSwapBaseTokenPrice = 0
    activeShow.value = 1
    loadingSwap.value = false
    loadingConfirmSwap.value = false
    handleError(err, 'solana')
  }
}

watch([() => swapStore.fromToken.address, () => walletStore.address], () => {
  if (swapStore.fromToken.address) {
    getAllowance()
  }
})

watch([() => swapStore.fromToken.address, () => swapStore.toToken.address], () => {
  fromAmount.value = ''
  toAmount.value = ''
  selectedRouterIndex.value = 0
  resetCountdown()
})


</script>


<style lang="scss" scoped>
.swap-container {
  .tabs {
    display: flex;
    align-items: center;
    padding: 1px;
    font-size: 12px;
    .tab-item {
      border: 1px solid var(--d-333-l-F5F5F5);
      display: flex;
      padding: 7px 0;
      justify-content: center;
      align-items: center;
      flex: 1;
      border-radius: 4px;
      background: transparent;
      cursor: pointer;
      color: var(--d-999-l-666);
      & + .tab-item {
        margin-left: 10px;
      }
      &.active {
        border-color: transparent;
        &.tab-0 {
          background: rgba($color: #12B886, $alpha: 0.1);
          color: #12B886;
        }
        &.tab-1 {
          background: rgba($color: #F6465D, $alpha: 0.1);
          color: #F6465D;
        }
        &.tab-liquidity {
          background: rgba($color: #3F80F7, $alpha: 0.1);
          color: var(--primary-color);
        }
      }
      &:disabled {
        opacity: 0.4;
      }
      .iconfont {
        margin-right: 3px;
      }
    }
  }

  .select-tabs {
    :deep() {
      --el-border-color-light: var(--d-333-l-F5F5F5);
      .el-tabs__item {
        font-size: 12px;
        padding: 0 10px;
        --el-text-color-primary: var(--d-999-l-666);
        &.is-active {
          color: var(--d-F5F5F5-l-333);
        }
        &:hover {
          color: var(--d-F5F5F5-l-333);
          cursor: pointer;
        }
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__active-bar {
        height: 2px;
        background-color: var(--d-F5F5F5-l-333);
      }
      .el-tabs__nav-wrap::after {
        height: 0.5px;
      }
    }
  }

  .card-container {
    border: 1px solid var(--d-333-l-F5F5F5);
    border-radius: 6px 6px 0 0;
    padding: 5px 8px;
    &.bottom {
      border-radius: 0 0 6px 6px;
    }
    .s-text {
      font-size: 12px;
      color: #999;
      letter-spacing: 0;
      font-weight: 400;
    }
  }
  .max-btn {
    font-size: 12px;
    color: var(--primary-color);
    letter-spacing: 0;
    font-weight: 400;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 2px 0 2px 6px;
    &:active {
      opacity: 0.5;
    }
  }
  .input-number {
    flex: 1;
    --el-border-color: transparent;
    --el-input-focus-border-color: transparent;
    --el-input-hover-border-color: transparent;
    --el-input-bg-color: transparent;
    :deep(.el-input__wrapper) {
      padding: 0;
    }
  }
  .submit-btn {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    --el-color-black: #F5F5F5;
  }
  .slippage-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: var(--d-999-l-666);
    letter-spacing: 0;
    font-weight: 400;
    margin-top: 10px;
    .iconfont {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .swap-label {
    font-size: 12px;
    color: var(--d-999-l-666);
    letter-spacing: 0;
    font-weight: 400;
    li {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      & + li {
        margin-top: 4px;
      }
      > :nth-child(2) {
        // color: #333333;
        color: var(--d-F5F5F5-l-333);
      }
    }
    .swap-label_item-left {
      display: flex;
      align-items: center;
      .icon-changjianwentixiangguanwenti {
        color: #999999;
        font-size: 14px;
        margin-left: 5px;
      }
    }
  }
  .path-list {
    display: flex;
    justify-content: center;
    align-items: center;
    &.flex-start{
      justify-content: flex-start;
    }
    flex-wrap: wrap;
  }
  .path-amm {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .icon-amm-logo {
    width: 12px;
  }
  .select-token {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
    &:active {
      opacity: 0.5;
    }
    &.iconfont {
      color: #999999;
      font-size: 10px;
      margin-left: 3px;
    }
  }

  .limit-price-label {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    font-weight: 400;
  }

  .limit-price-icon {
    cursor: pointer;
    font-size: 16px;
    background-color: transparent;
    margin: 0;
    padding: 0 5px;
    border: none;
    // color: #333;
    color: var(--d-F5F5F5-l-333);
    &:disabled {
      color: #999;
    }
    &:active {
      color: #999;
    }
  }
  .input-price {
    --van-cell-vertical-padding: 0;
    --van-cell-horizontal-padding: 5px;
    --van-cell-background-color: transparent;
    --van-cell-font-size: 14px;
    --van-field-input-text-color: var(--d-F5F5F5-l-333);
    :deep() .van-field__control {
      padding: 0 5px;
    }
  }
  .tabs-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1px;
    font-size: 12px;
    color: #999;
    letter-spacing: 0;
    font-weight: 500;
    .tab-item {
      padding: 8px 0;
      text-align: center;
      // flex: 1;
      background: transparent;
      border: none;
      cursor: pointer;
      &.active {
        color: var(--d-F5F5F5-l-333);
      }
    }
  }
}
</style>
