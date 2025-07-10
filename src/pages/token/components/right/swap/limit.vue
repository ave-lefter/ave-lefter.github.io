<template>
  <form class="swap-container" action="" @submit.prevent.stop="onLimitSubmit">
    <div class="card-container mt-10px">
      <div class="flex items-center">
        <SelectSwapToken v-model:token="swapStore.token1" :tokens="swapStore.swapTokens" :chain="swapStore.chain" @update:token="handleSelectLimitToken1"/>
        <span style="flex: 1"/>
        <div class="s-text" v-html="`${ $t('balance1') }: ${ formatNumber(swapStore.token1?.balance || 0) }`"/>
         <button v-if="swapStore.activeTab === 1" class="max-btn" type="button" @click.stop="handlePercentChange(100)">{{ $t('max') }}</button>
      </div>
      <div class="flex justify-between items-center mt-10px">
        <el-input v-model="limitAmount1" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:right"  @update:model-value="value => {limitAmount1 = value?.replace?.(/\-|[^\d.]/g, '');watchLimitAmount1()}" @focus="percentStepRef?.handleClick(0, true)" />
      </div>
    </div>
    <div class="card-container bottom mt-10px">
      <div class="flex items-center">
        <SelectSwapToken v-model:token="swapStore.token2" :tokens="swapStore.swapTokens" :chain="swapStore.chain" @update:token="handleSelectLimitToken2"/>
        <span style="flex: 1"/>
        <div class="s-text" v-html="`${$t('balance1')}: ${formatNumber(swapStore.token2?.balance || 0)}`"/>
        <button v-if="swapStore.activeTab === 0" class="max-btn" type="button" @click.stop="handlePercentChange(100)">{{
          $t('max') }}</button>
      </div>
      <div class="flex justify-between items-center mt-10px">
        <el-input v-model="limitAmount2" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:right"  @update:model-value="value => {limitAmount2 = value?.replace?.(/\-|[^\d.]/g, '');watchLimitAmount2()}" @focus="percentStepRef?.handleClick(0, true)" />
      </div>
    </div>
    <PercentStep ref="percentStepInf" :activeColor="swapStore.activeTab === 0 ? upColor[0]: downColor[0]" @change="handlePercentChange"/>
    <div v-if="swapStore.swapType === 1" class="limit-price-label mb-5px">{{ $t('triggerPrice') }}({{ swapStore.token1.symbol || '' }})</div>
    <div v-if="swapStore.swapType === 1" class="card-container flex justify-between items-center rd-6px! py-0!">
      <button class="limit-price-icon" type="button" :disabled="!triggerPrice" @click.stop="minusTriggerPrice">
        <el-icon><Minus /></el-icon>
      </button>
      <span class="text-14px color-[--d-666-l-999]">$</span>
      <el-input v-model="triggerPrice" placeholder="0.0"  size="large" clearable class="input-number" input-style="text-align:center"  @update:model-value="value => {triggerPrice = value?.replace?.(/\-|[^\d.]/g, '')}" />
      <button class="limit-price-icon" type="button" :disabled="!triggerPrice" @click.stop="addTriggerPrice">
        <el-icon><Plus /></el-icon>
      </button>
    </div>
    <template v-if="swapStore.chain === 'solana' && swapStore.swapType === 0">
      <div class="limit-price-label mt-10px mb-5px">{{ $t('delegatePrice') }}({{ swapStore.token1.symbol || '' }})</div>
      <div class="card-container flex justify-between items-center rd-6px! py-0!" style="margin-bottom: 10px;">
        <button class="limit-price-icon" type="button" :disabled="!limitSolanaPriceU" @click.stop="minusLimitSolanaPrice">
          <el-icon><Minus /></el-icon>
        </button>
        <span class="text-14px color-[--d-666-l-999]">$</span>
        <el-input v-model="limitSolanaPriceU" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:center"  @update:model-value="value => {limitSolanaPriceU = value?.replace?.(/\-|[^\d.]/g, '');watchLimitSolanaPrice()}" />
        <button class="limit-price-icon" type="button" :disabled="!limitSolanaPriceU" @click.stop="addLimitSolanaPrice">
           <el-icon><Plus /></el-icon>
        </button>
      </div>
    </template>
    <template v-else>
      <div class="limit-price-label mt-10px mb-5px">{{ $t('delegatePrice') }}({{ swapStore.token1.symbol || '' }})</div>
      <div class="card-container flex justify-between items-center rd-6px! py-0!" style="margin-bottom: 10px;">
        <button class="limit-price-icon" type="button" :disabled="!limitPrice" @click.stop="minusLimitPrice">
           <el-icon><Minus /></el-icon>
        </button>
        <span class="text-14px color-[--d-666-l-999]">$</span>
        <el-input v-model="limitPrice" placeholder="0.0" size="large" clearable class="input-number" input-style="text-align:center"  @update:model-value="value => {limitPrice = value?.replace?.(/\-|[^\d.]/g, '');watchLimitPrice()}" />
        <button class="limit-price-icon" type="button" :disabled="!limitPrice" @click.stop="addLimitPrice">
          <el-icon><Plus /></el-icon>
        </button>
      </div>
    </template>

    <el-button v-if="!walletStore.address" native-type="button" class="submit-btn" color="#286DFF" @click.stop="useBotStore().changeConnectVisible(true, 1)">{{ $t('pConnectWallet') }}</el-button>
    <el-button v-else-if="walletStore.address && !walletStore.provider" native-type="button" class="submit-btn" disabled color="#555555">{{ $t('watchWalletNotSwap') }}</el-button>
    <el-button v-else-if="!supportChainLimit()" native-type="button" class="submit-btn" disabled block color="#555555">{{ checkSupportChainLimitMessage() }}</el-button>
    <el-button
      v-else-if="!isLimitApprove || loadingLimitAllowance"
      class="submit-btn" block :color="limitButtonColor"
      native-type="submit"
      :loading-text="loadingLimitAllowance ? $t('checkingAllowance') : (quoteLimitLoading ? $t('quoting') : loadingLimitApprove ? $t('approve') : '')"
      :disabled="!checkLimitAmount()" :loading="loadingLimitApprove || loadingLimit || loadingLimitAllowance">{{
        checkLimitAmountMessage() || $t('approve') }}</el-button>
    <el-button
      v-else
      class="submit-btn" block :loading="loadingLimit || limitQuoteLoading"
      :loading-text="limitQuoteLoading ? $t('quoting') : (loadingLimit ? (swapStore.activeTab === 0 ? $t('buying') : $t('selling')) : $t('quoting'))"
      :color="limitButtonColor"
      :disabled="!checkLimitAmount() || !limitAmount1 || !limitAmount2 || loadingLimitAllowance" native-type="submit">
      {{ checkLimitAmountMessage() || ((swapStore.activeTab === 0 ? $t('buy') : $t('sell')) + ' ' + (swapStore.token1?.symbol || '')) }}
    </el-button>
    <ul class="swap-label mt-10px">
      <li v-if="chain !== 'solana'" class="slippage-container">
        <span>{{ $t('slippage') }}</span>
        <Icon name="material-symbols:help-outline" @click.stop="alertTips($t('slippage'), $t('minimumReceivedTips'))" />
        <span style="flex: 1"/>
        <SlippageSet v-model:slippage="limitSlippage" :canSetAuto="false"/>
      </li>
      <li v-if="swapStore.swapType === 0 || swapStore.swapType === 1">
        <div class="swap-label_item-left">
          <span>{{ $t('limitExpiredTime') }}</span>
        </div>
        <SolanaLimitExpired v-if="swapStore.swapType === 0 && chain === 'solana'" v-model:expiredTime="solanaLimitExpiredTime"/>
        <div v-else style="display: flex; align-items: center;">
          {{ LimitExpiredDays }} {{ $t('days1') }}
        </div>
      </li>
    </ul>
  </form>
  <div v-show="swapStore.swapType !== 2" class="mt-10px">
    <div class="tabs-1">
      <button v-for="(item, index) in tabs1" :key="index" class="tab-item" :class="{ active: item.value === tabActive1 }" type="button" @click.stop="tabActive1 = item.value">{{ item.name }}</button>
    </div>
    <LimitTxItem v-show="tabActive1 === 'limit'" class="mt-5px" :tableList="filterLimitOrders" @refresh="refreshLimit"/>
  </div>
  <ConfirmLimit
    v-model:visible="dialogVisibleLimit"
    :limitInfo="limitInfo"
    :loading="loadingConfirmLimit"
    :chain="walletStore.chain"
    :limitGasU="limitGasU"
    :activeShow="activeShow"
    @submit="_submitLimitOrder"
  />
</template>

<script setup lang='ts'>
import SelectSwapToken from './selectSwapToken.vue'
import PercentStep from './percentStep.vue'
import SlippageSet from './slippageSet.vue'
import SolanaLimitExpired from './solanaLimitExpired.vue'
import ConfirmLimit from './confirmLimit.vue'
import LimitTxItem from './limitTxItem.vue'
import { useLocalStorage } from '@vueuse/core'
import { LimitContracts, LimitContractsFee, LimitExpiredDays  } from '~/utils/wallet/utils/constants'
import { allowance, approve, getTokensPriceInfo } from '~/api/swap'
import { createSolanaLimitOrderTx, getLimitOrder, quoteLimit, quoteLimitSolana, submitLimitOrder } from '~/api/swap/limit'
import { getTokensPrice } from '~/api/token'
import { recordTransaction } from '~/api/tracking'
import { getSolanaLimitOrder, getSolanaLimitOrderHistory } from '~/api/swap/solana'
import { Minus, Plus } from '@element-plus/icons-vue'
import BigNumber from 'bignumber.js'


const swapStore = useSwapStore()
const walletStore = useWalletStore()
const percentStepRef = useTemplateRef('percentStepInf')
const chain = computed(() => swapStore.chain)
const { t } = useI18n()
const limitSlippage = useLocalStorage('limitSlippage', '10')
const limitAmount1 = ref<number | string>('')
const limitAmount2 = ref<number | string>('')
const loadingLimitAllowance = ref(false)
const limitAllowance = ref('0')
const limitSolanaError = ref('')
const limitSolanaPrice = ref<number | string>(0)
const limitQuoteLoading = ref(false)
const limitSolanaPriceU = ref<number | string>(0)
const limitPrice = ref<number | string>('')
const limitGasU = ref<string>('')
const triggerPrice = ref<number | string>('')
const quoteLimitLoading = ref(false)
const loadingLimit = ref(false)
const loadingLimitApprove = ref(false)
const solanaLimitExpiredTime = ref<null | number>(null)
const dialogVisibleLimit = ref(false)
const loadingConfirmLimit = ref(false)
const activeShow = ref<0 | 1 | 2 | 3>(0)
const limitOrders = ref<any>([])
const loadingGetLimitOrder = ref(false)

const isCurrentToken = ref(false)

const tabActive1 = ref('limit')
const tabs1 = computed(() => {
  return [
    // {
    //   name: this.$t('historyExchange'),
    //   value: 'swap'
    // },
    {
      name:t('historyLimitOrder'),
      value: 'limit'
    },
    // {
    //   name: this.$t('liquidityHistory'),
    //   value: 'liquidity'
    // }
  ]
})

const filterLimitOrders = computed(() => {
  if (isCurrentToken.value) {
    const targetToken = swapStore.token1.address
    return limitOrders.value?.filter((i: { target_token: string }) => i.target_token === targetToken)
  }
  return limitOrders.value
})

const limitInfo = ref({
  chain: '',
  orderType: 0,
  triggerPrice: 0 as number | string,
  fromToken: {
    address: '',
    chain: '',
    balance: 0,
    symbol: '',
    price: 0
  },
  toToken: {
    address: '',
    chain: '',
    balance: 0,
    symbol: '',
    price: 0
  },
  targetTokenInfo: {
    address: '',
    chain: '',
    balance: 0,
    symbol: '',
    price: 0
  },
  fromAmount: '' as string | number,
  toAmount: '' as string | number,
  targetToken: '',
  targetLimitPrice: '' as string | number,
  activeTab: swapStore.activeTab,
  minReturn: '0' as string | number,
  slippage: limitSlippage.value || '10'
})

const isLimitApprove = computed(() => {
  const chains = ['solana', 'ton', 'sui']
  if (chains.includes(swapStore.chain) || swapStore.fromToken.address === NATIVE_TOKEN) {
    return true
  }
  if (!limitAllowance.value) {
    return false
  }
  const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  const decimals = limitFromToken.decimals || 0
  const limitFromAmount = swapStore.activeTab === 0 ? limitAmount2.value : limitAmount1.value
  return parseUnits((new BigNumber(limitFromAmount || 0)).toFixed(decimals), decimals).lte(limitAllowance.value)
})

const limitButtonColor = computed(() => {
  if (!walletStore.address || !walletStore.provider) {
    return '#999'
  }
  if (swapStore.activeTab === 0) {
    return upColor[0]
  }
  if (swapStore.activeTab === 1) {
    return downColor[0]
  }
  return '#558BED'
})


function alertTips(title: string, message: string) {
  ElMessageBox
    .alert(message, title, {
      confirmButtonText: t('getIt'),
    })
    .then(() => {
      // on close
    })
}

function handleSelectLimitToken1() {
  limitAmount1.value = ''
  limitAmount2.value = ''
  percentStepRef.value?.handleClick?.(0)
  // this.$refs?.percentStep1?.handleClick(0)
  if (swapStore.activeTab === 1) {
    getLimitAllowance()
  }
  swapStore.getToken1Info()
  swapStore.getBaseToken()
  if (chain.value === 'solana') {
    _quoteLimitSolana()
  }
}

function handleSelectLimitToken2() {
  limitAmount1.value = ''
  limitAmount2.value = ''
  percentStepRef.value?.handleClick?.(0)
  swapStore.getToken2Info()
  if (swapStore.activeTab === 0) {
    getLimitAllowance()
  }
  if (chain.value === 'solana') {
    _quoteLimitSolana()
  }
}

function  getLimitAllowance() {
  const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  if (walletStore.chain && walletStore.chain === limitFromToken.chain && limitFromToken.address) {
    const chain = limitFromToken.chain || walletStore.chain
    if (chain === 'solana') {
      return
    }
    const limitContract = LimitContracts[chain]
    loadingLimitAllowance.value = true
    allowance(limitFromToken.address, limitContract).then(res => {
      limitAllowance.value = res.toString()
    }).finally(() => {
      loadingLimitAllowance.value = false
    })
  }
}

function _quoteLimitSolana() {
  if (!swapStore.token1?.address || !swapStore.token2?.address || chain.value !== 'solana' || swapStore.swapType !== 0) {
    return
  }
  const params = {
    from_token: swapStore.token1?.address,
    to_token: swapStore.token2?.address,
    amountIn: parseUnits('1', swapStore.token1?.decimals).toFixed(0),
  }
  limitSolanaError.value = ''
  quoteLimitSolana(params).then(res => {
    // console.log('quoteLimitSolana', res)
    const outAmount = formatUnits(res?.outAmount || 0, swapStore.token2?.decimals)
    limitSolanaPrice.value = outAmount
    quoteLimitTokenPrice().then(res => {
      console.log('res', res)
      // this.limitSolanaPriceU = res[0]
    })
    limitSolanaError.value = ''
  }).catch(err => {
    console.log('err', err)
    limitSolanaPrice.value = 0
    limitSolanaError.value = '1'
  })
}

function quoteLimitTokenPrice() {
  const chain = swapStore.token1.chain
  const token1Id = swapStore.token1.address + '-' + chain
  const token2Id = swapStore.token2.address + '-' + chain
  return getTokensPrice([token1Id, token2Id]).then(async res => {
    swapStore.token1.price = res?.[0]?.current_price_usd || 0
    swapStore.token2.price = res?.[1]?.current_price_usd || 0
    return [swapStore.token1.price, swapStore.token2.price]
  })
}

function minusLimitPrice() {
  if (limitPrice.value && new BigNumber(limitPrice.value).gt('0')) {
    // let decimals = this.limitToken1.decimals
    limitPrice.value = formatDec(new BigNumber(limitPrice.value).times(0.99).toFixed())
    watchLimitPrice()
  }
}
function addLimitPrice() {
  if (limitPrice.value && new BigNumber(limitPrice.value).gt('0')) {
    // let decimals = this.limitToken1.decimals
    limitPrice.value = formatDec(new BigNumber(limitPrice.value).times(1.01).toFixed())
    watchLimitPrice()
  }
}
function minusTriggerPrice() {
  if (triggerPrice.value && new BigNumber(triggerPrice.value).gt('0')) {
    triggerPrice.value = formatDec(new BigNumber(triggerPrice.value).times(0.99).toFixed())
  }
}

function addTriggerPrice() {
  if (limitPrice.value && new BigNumber(triggerPrice.value).gt('0')) {
    triggerPrice.value = formatDec(new BigNumber(triggerPrice.value).times(1.01).toFixed())
  }
}

function minusLimitSolanaPrice() {
  if (limitSolanaPriceU.value && new BigNumber(limitSolanaPriceU.value).gt('0')) {
    // let decimals = this.limitToken1.decimals
    limitSolanaPriceU.value = formatDec(new BigNumber(limitSolanaPriceU.value).times(0.99).toFixed())
    watchLimitSolanaPrice()
  }
}

function addLimitSolanaPrice() {
  if (limitSolanaPriceU.value && new BigNumber(limitSolanaPriceU.value).gt('0')) {
    // let decimals = this.limitToken1.decimals
    limitSolanaPriceU.value = formatDec(new BigNumber(limitSolanaPriceU.value).times(1.01).toFixed())
    watchLimitSolanaPrice()
  }
}

function handlePercentChange(val: number | string, noChange: boolean = false) {
  if (noChange) {
    return
  }
  const p = Number(val) / 100
  const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  let limitFromAmount = limitFromToken.balance || 0
  if (p) {
    const decimals = limitFromToken.decimals || 18
    // .match(new RegExp(`[0-9]*(\\.[0-9]{0,${this.limitToToken.decimals}})?`))[0]
    if (limitFromToken?.address === NATIVE_TOKEN) {
      const chain = limitFromToken.chain
      const min = MIN_BALANCE[chain] || 0.01
      limitFromAmount = new BigNumber(limitFromAmount).minus(min).times(p).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || 0
    } else {
      limitFromAmount = new BigNumber(limitFromAmount).times(p).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || 0
    }

    if (Number(limitFromAmount) === 0) {
      limitFromAmount = ''
    }
  } else {
    limitFromAmount = ''
  }
  if (swapStore.activeTab === 0) {
    if (limitAmount2.value !== limitFromAmount) {
      limitAmount2.value = Number(limitFromAmount) < 0 ? '0' : limitFromAmount
      watchLimitAmount2()
    }
  } else {
    if (limitAmount1.value !== limitFromAmount) {
      limitAmount1.value = Number(limitFromAmount) < 0 ? '0' : limitFromAmount
      watchLimitAmount1()
    }
  }
}

let Timer4: null | ReturnType<typeof setTimeout> = null
function watchLimitAmount1() {
  if (limitQuoteLoading.value) {
    return
  }
  if (Timer4) {
    clearTimeout(Timer4)
    Timer4 = null
  }
  Timer4 = setTimeout(() => {
    const val = limitAmount1.value
    const n = Number(val)
    if (val === '' || val === '.') {
      limitAmount1.value = ''
      limitAmount2.value = ''
    } else if (n === 0 && Number(limitAmount2.value) !== 0) {
      limitAmount2.value = 0
    } else if (n) {
      limitAmount2.value = ''
      // this.isAmount = false
      watchLimitPrice()
    }
  }, 500)
}

let Timer5: null | ReturnType<typeof setTimeout> = null
function watchLimitAmount2() {
  if (limitQuoteLoading.value) {
    return
  }
  if (Timer5) {
    clearTimeout(Timer5)
    Timer5 = null
  }
  Timer5 = setTimeout(() => {
    const val = limitAmount2.value
    const n = Number(val)
    if (val === '' || val === '.') {
      limitAmount1.value = ''
      limitAmount2.value = ''
    } else if (n === 0 && Number(limitAmount1.value) !== 0) {
      limitAmount1.value = 0
    } else if (n) {
      limitAmount1.value = ''
      // this.isAmount = false
      watchLimitPrice()
    }
  }, 500)
}

function watchLimitPrice() {
  if (swapStore.chain === 'solana') {
    watchLimitSolanaPrice()
    return
  }
  if (!supportChainLimit()) {
    return
  }
  if (!Number(limitPrice.value) || (!Number(limitAmount1.value) && !Number(limitAmount2.value)) || swapStore.token1.address === swapStore.token2.address || !walletStore.provider) {
    if (swapStore.token1.address === swapStore.token2.address) {
      ElNotification({ type: 'error', message: t('twoIdenticalTokens') })
    }
    return
  }
  if (Timer6) {
    clearTimeout(Timer6)
    Timer6 = null
  }
  Timer6 = setTimeout(() => {
    const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
    const limitToToken = swapStore.activeTab === 1 ? swapStore.token2 : swapStore.token1
    const amountIn = parseUnits((swapStore.activeTab === 0 ? limitAmount2.value : limitAmount1.value) || '0', limitFromToken.decimals).toFixed(0)
    const amountOut = parseUnits((swapStore.activeTab === 1 ? limitAmount2.value : limitAmount1.value) || '0', limitToToken.decimals).toFixed(0)
    const from_token = limitFromToken.address
    const to_token = limitToToken.address
    const data = {from_token, to_token, amountIn, amountOut}
    limitQuoteLoading.value = true
    quoteLimit(data).then(res => {
      if (res.toWrapper === 1 || res.toWrapper === 2) {
        limitQuoteLoading.value = false
        return
      }
      limitGasU.value = res.gasU
      const t1 = res?.routerPath?.find?.((i: { address: string }) => i.address === swapStore.token1.address)
      const t2 = res?.routerPath?.find?.((i: { address: string }) => i.address === swapStore.token2.address)
      swapStore.token1.price = t1.price
      swapStore.token2.price = t2.price
      if ((new BigNumber(t1?.amount || 0)).lte(0) || (new BigNumber(t2?.amount || 0)).lte(0)) {
        ElMessageBox.alert(t('limitOrderAmount'), t('tips'), {
          // if you want to disable its autofocus
          // autofocus: false,
          confirmButtonText:  t('okay'),
        })
        return
      }
      if (limitPrice.value && limitAmount1.value && limitAmount2.value) {
        if (swapStore.activeTab === 0) {
          limitAmount1.value = new BigNumber(formatUnits(t1.amount, t1.decimals)).times(t1.price || 0).div(limitPrice.value || 1).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${swapStore.token1.decimals}})?`))?.[0] || ''
        } else {
          limitAmount2.value = new BigNumber(formatUnits(t2.amount, t2.decimals)).times(limitPrice.value || 0).div(t1.price || 1).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${swapStore.token2.decimals}})?`))?.[0] || ''
        }
      } else if (limitPrice.value && limitAmount1.value) {
        limitAmount2.value = new BigNumber(formatUnits(t2.amount, t2.decimals)).times(limitPrice.value || 0).div(t1.price || 1).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${swapStore.token2.decimals}})?`))?.[0] || ''
      } else if (limitPrice.value && limitAmount2.value) {
        limitAmount1.value = new BigNumber(formatUnits(t1.amount, t1.decimals)).times(t1.price || 0).div(limitPrice.value || 1).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${swapStore.token1.decimals}})?`))?.[0] || ''
      }
      // let slippage = new BigNumber(limitSlippage.value || 0)
      // slippage = new BigNumber(1).minus(slippage.div(100))

      // const limitToAmount = swapStore.activeTab === 0 ? limitAmount1.value : limitAmount2.value
      // let limitToToken = swapStore.activeTab === 0 ? swap.token1 : this.limitToken2
      // limitMinReturn.value = (new BigNumber(limitToAmount || 0).times(slippage)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${limitToToken.decimals}})?`))[0]
    }).catch((err: any) => {
      handleError(err)
    }).finally(() => {
      limitQuoteLoading.value = false
    })
  }, 500)

  // if (limitPrice.value && this.limitToken2.price && limitAmount1.value) {
  //   limitAmount2.value = new BigNumber(limitAmount1.value).times(limitPrice.value || 0).div(this.limitToken2.price || 1).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${this.limitToken2.decimals}})?`))[0]
  // } else if (limitPrice.value && this.limitToken2.price && limitAmount2.value) {
  //   limitAmount1.value = new BigNumber(limitAmount2.value).times(this.limitToken2.price || 0).div(limitPrice.value || 1).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${swap.token1.decimals}})?`))[0]
  // }

  // let targetTokenAmount = limitAmount1.value
  // let p = new BigNumber('100').div(limitPrice.value).div(targetTokenAmount)
  // let slippage = swapStore.activeTab === 1 ? (this.baseTokenExtra?.sell_tax || 0) : (this.baseTokenExtra?.buy_tax || 0)
  // let s = new BigNumber(slippage).plus(20).plus(p)
  // slippage = s.gte(50) ? new BigNumber(49) : s

}

let Timer6: null | ReturnType<typeof setTimeout> = null
function watchLimitSolanaPrice() {
  if (!Number(limitSolanaPriceU.value) || (!Number(limitAmount1.value) && !Number(limitAmount2.value)) || swapStore.token1.address === swapStore.token2.address || !walletStore.provider) {
    if (swapStore.token1.address === swapStore.token2.address) {
      ElNotification({ type: 'error', message: t('twoIdenticalTokens') })
    }
    return
  }
  if (Timer6) {
    clearTimeout(Timer6)
    Timer6 = null
  }
  Timer6 = setTimeout(() => {
    if (limitAmount1.value) {
      limitAmount2.value = new BigNumber(limitAmount1.value || 0).times(limitSolanaPriceU.value).div(swapStore.token2?.price || 1).toFixed(swapStore.token2.decimals)
    } else if (limitAmount2.value) {
      limitAmount1.value = new BigNumber(limitAmount2.value).times(swapStore.token2?.price || 0).div(limitSolanaPriceU.value).toFixed(swapStore.token1.decimals)
    }
  }, 500)
}



function supportChainLimit() {
  const chain = walletStore.chain
  const c1 = swapStore.token1.chain
  const c2 = swapStore.token2.chain
  const limitChains = Object.keys(LimitContracts).concat('solana')
  if (c1 && !limitChains?.includes?.(c1)) {
    return false
  }
  if (c2 && !limitChains?.includes?.(c2)) {
    return false
  }
  if (!chain) {
    return false
  }
  if (walletStore.address?.startsWith?.('T')) {
    return false
  }
  if (chain && !limitChains?.includes?.(chain)) {
    return false
  }
  if (chain !== c1 || chain !== c2) {
    return false
  }
  return true
}

function checkSupportChainLimitMessage() {
  const chain = walletStore.chain
  const limitChains = Object.keys(LimitContracts).concat('solana')
  const chainName = getChainInfo(chain).name
  const c1 = swapStore.token1.chain
  const c2 = swapStore.token2.chain
  if (c1 && !limitChains?.includes?.(c1)) {
    return t('noSupportChain', {chain: getChainInfo(c1)?.name})
  }
  if (c2 && !limitChains?.includes?.(c2)) {
    return t('noSupportChain', {chain: getChainInfo(c2)?.name})
  }
  if (!chain) {
    return t('noSupportChain', {chain: chainName})
  }
  if (walletStore.address?.startsWith?.('T')) {
    return t('noSupportChain', {chain: 'TRON'})
  }
  if (chain && !limitChains?.includes?.(chain)) {
    return t('noSupportChain', {chain: chainName})
  }
  if ((chain !== c1 && c1) || (chain !== c2 && c2)) {
    return t('chainNotSame1')
  }
  if (c1 !== c2) {
    return t('tokenNoSameChain')
  }
  return ''
}

function checkLimitAmount() {
  if (chain.value === 'solana' && limitSolanaError.value) {
    return false
  }
  const fromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  const fromTokenBalance = fromToken.balance || 0
  const limitFromAmount = swapStore.activeTab === 0 ? limitAmount2.value : limitAmount1.value
  return !(
    Number(fromTokenBalance) === 0 ||
    Number(fromTokenBalance) < Number(limitFromAmount) ||
    !walletStore.provider ||
    String(limitFromAmount) === '0' || swapStore.token1.address === swapStore.token2.address
  )
}
function checkLimitAmountMessage() {
  if (chain.value === 'solana' && limitSolanaError.value) {
    return t('noSToken')
  }
  const fromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  const fromTokenBalance = fromToken.balance || 0
  const limitFromAmount = swapStore.activeTab === 0 ? limitAmount2.value : limitAmount1.value
  if (!walletStore.address) {
    return t('pConnectWallet')
  } else if (walletStore.address && !walletStore.provider) {
    return t('observeAddressNotSwap')
  } else if (Number(fromTokenBalance === 0 || Number(fromTokenBalance) < Number(limitFromAmount) || !walletStore.provider)) {
    return t('insufficientBalance')
  } else if (String(limitFromAmount) === '0') {
    return t('AmountCannotBeZero')
  } else {
    return ''
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

function onLimitSubmit() {
  try {
    if (!walletStore.provider) {
      handleWalletAddress()
      return
    }
    if (!supportChainLimit()) {
      return
    }
    const chain = walletStore.chain
    const chain1 = swapStore.token1.chain || swapStore.token2.chain || chain
    if (chain !== chain1) {
      ElMessageBox.alert(t('plsSwitchChain', { chain }), t('tips'))
      return
    }
    if (swapStore.swapType === 0 || swapStore.swapType === 1) {
      if (!isLimitApprove.value) {
        approveLimit()
      } else {
        openConfirmLimit()
      }
    }
  } catch (error) {
    console.log(error)
  }
}

async function approveLimit() {
  if (!supportChainLimit()) {
    return
  }
  loadingLimitApprove.value = true
  const chain = swapStore.token1.chain || walletStore.chain || ''
  const limitContract = LimitContracts[chain]
  const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  approve(limitFromToken.address, limitContract).then(res => {
    return res.wait()
  })
  .then((res) => {
    console.log(res)
    getLimitAllowance()
  })
  .catch((err) => {
    handleError(err)
  })
  .finally(() => {
    loadingLimitApprove.value = false
  })
}

function openConfirmLimit() {
  const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  const limitToToken = swapStore.activeTab === 0 ? swapStore.token1 : swapStore.token2
  const limitFromAmount = swapStore.activeTab === 0 ? limitAmount2.value : limitAmount1.value
  const limitToAmount = swapStore.activeTab === 0 ? limitAmount1.value : limitAmount2.value
  const decimals = swapStore.activeTab === 0 ? swapStore.token1.decimals : swapStore.token2.decimals
  let slippage = new BigNumber(limitSlippage.value || 0)
  slippage = new BigNumber(1).minus(slippage.div(100))
  let fee = new BigNumber(LimitContractsFee[limitFromToken.chain || walletStore.chain] || 0).times(5)
  fee = fee.gte(3) ? (fee.gte(50) ? new BigNumber(50) : fee) : new BigNumber(3)
  const u = new BigNumber(limitFromAmount).times(limitFromToken?.price || 0).gte(fee.times(0.999))
  if (!u) {
    ElMessageBox.alert(t('minimumTransactionAmount', {n: fee.toFixed()}), t('tips'), {
      confirmButtonText: t('okay')
    })
    return
  }

  const chain = swapStore.token1.chain || walletStore.chain
  limitInfo.value = {
    chain: chain,
    orderType: swapStore.swapType,
    fromToken: limitFromToken as any,
    toToken: limitToToken as any,
    fromAmount: limitFromAmount,
    toAmount: limitToAmount,
    targetToken: swapStore.token1.address,
    targetTokenInfo: swapStore.token1 as any,
    targetLimitPrice: chain === 'solana' ? limitSolanaPriceU.value : limitPrice.value,
    triggerPrice: triggerPrice.value,
    activeTab: swapStore.activeTab,
    minReturn: (new BigNumber(limitToAmount || 0).times(slippage)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || '0',
    slippage: limitSlippage.value
  }
  activeShow.value = 1
  if (chain === 'solana') {
    loadingLimit.value = true
    getTokensPrice([limitInfo.value.targetToken + '-' + chain]).then(res => {
      const price = res?.[0]?.current_price_usd || limitInfo.value?.targetTokenInfo?.price || swapStore.baseToken?.token.current_price_usd || 0
      if (swapStore.activeTab === 0) {
        if (new BigNumber(price).lt(limitInfo.value?.targetLimitPrice || '0')) {
          ElMessageBox.alert(t('limitPriceTips', {p1: formatNumber(limitInfo.value?.targetLimitPrice), p2: formatNumber(price) }), t('tips'), {
            confirmButtonText: t('okay'),
          })
          return
        }
      }
      if (swapStore.activeTab === 1) {
        if (new BigNumber(price).gt(limitInfo.value?.targetLimitPrice || '0')) {
          ElMessageBox.alert(t('limitPriceTips1', {p1: formatNumber(limitInfo.value?.targetLimitPrice), p2: formatNumber(price) }), t('tips'), {
            confirmButtonText: t('okay'),
          })
          return
        }
      }
      dialogVisibleLimit.value = true
      loadingLimit.value = false
    }).catch(() => {
      dialogVisibleLimit.value = true
      loadingLimit.value = false
    }).finally(() => {
      loadingLimit.value = false
    })
  } else {
    dialogVisibleLimit.value = true
  }
}

function _submitLimitOrder() {
  if (!supportChainLimit()) {
    return
  }
  // let targetTokenAmount = this.limitAmount1
  // let p = new BigNumber('100').div(this.limitPrice).div(targetTokenAmount)
  // let slippage = this.activeTab === 1 ? (this.baseTokenExtra?.sell_tax || 0) : (this.baseTokenExtra?.buy_tax || 0)
  // let s = new BigNumber(slippage).plus(20).plus(p)
  // slippage = s.gte(50) ? new BigNumber(49) : s
  let slippage = new BigNumber(limitSlippage.value || 0)
  slippage = new BigNumber(1).minus(slippage.div(100))

  const maker = walletStore.address
  console.log('maker', maker)

  const limitFromToken = swapStore.activeTab === 0 ? swapStore.token2 : swapStore.token1
  const limitToToken = swapStore.activeTab === 0 ? swapStore.token1 : swapStore.token2
  const limitFromAmount = swapStore.activeTab === 0 ? limitAmount2.value : limitAmount1.value
  const limitToAmount = swapStore.activeTab === 0 ? limitAmount1.value : limitAmount2.value

  const fromToken = limitFromToken.address
  const fromAmount = parseUnits((new BigNumber(limitFromAmount || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${limitFromToken.decimals}})?`))?.[0] || 0, limitFromToken.decimals).toFixed(0)
  const toToken = limitToToken.address
  const toAmount = parseUnits((new BigNumber(limitToAmount || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${limitToToken.decimals}})?`))?.[0] || 0, limitToToken.decimals).toFixed(0)
  const minReturn = parseUnits((new BigNumber(limitToAmount || 0).times(slippage)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${limitToToken.decimals}})?`))?.[0] || 0, limitToToken.decimals).toFixed(0)
  const targetToken = swapStore.token1.address
  const targetLimitPrice = limitPrice.value
  loadingConfirmLimit.value = true
  const orderType = swapStore.swapType
  const _triggerPrice = triggerPrice.value
  const currentPrice = swapStore.baseToken?.token?.current_price_usd ? formatDec(swapStore.baseToken.token.current_price_usd) : ''
  if (swapStore.chain === 'solana') {
    const expiredAt = solanaLimitExpiredTime.value ? Number(Math.floor(Date.now() / 1000) + Math.floor(solanaLimitExpiredTime.value)) : null
    let orderPubkey = ''
    createSolanaLimitOrderTx({fromToken, fromAmount, toToken, toAmount, expiredAt}).then(res => {
      const result = res.result
      orderPubkey = result.order
      console.log('result', result)
      return res.send()
    }).then(res => {
      console.log(res)
      const order = {
        from_token: fromToken,
        from_token_symbol: limitFromToken?.symbol,
        from_token_decimals: limitFromToken?.decimals,
        to_token: toToken,
        to_token_symbol: limitToToken?.symbol,
        to_token_decimals: limitToToken?.decimals,
        from_amount: Number(fromAmount) || 0,
        to_amount:  Number(toAmount) || 0,
        id: orderPubkey,
        orderKey: orderPubkey,
        chain: 'solana',
        created_at: 0,
        state: 'Sending',
        from_amount_used: '0',
        percent: '0',
        expiredAt: expiredAt,
        from_token_logo_url: limitFromToken.logo_url,
        to_token_logo_url: limitToToken.logo_url,
      }
      recordTransaction({
        chain: 'solana',
        destination: 'wallet rpc',
        type: 20,
        order_id: 'jupiter_' + orderPubkey,
        status: 1,
        wallet: walletStore.address,
        out_token: toToken,
        out_amount:  order.to_amount,
        in_token: fromToken,
        in_amount: order.from_amount
      })
      limitOrders.value = [order, ...limitOrders.value]
      loadingConfirmLimit.value = false
      dialogVisibleLimit.value = false
      return res.wait()
    }).then(() => {
      _getLimitOrder(orderPubkey)
      limitAmount1.value = ''
      limitAmount2.value = ''
      if (limitFromToken.address === swapStore.token1.address) {
        swapStore.getToken1Info()
      } else if (limitFromToken.address === swapStore.token2.address) {
        swapStore.getToken2Info()
      }
    }).catch(err => {
      limitOrders.value = limitOrders.value.filter((i: { orderKey: string }) => i.orderKey !== orderPubkey)
      handleError(err, 'solana')
    }).finally(() => {
      loadingConfirmLimit.value = false
      dialogVisibleLimit.value = false
    })
    return
  }
  submitLimitOrder(maker, fromToken, fromAmount, toToken, minReturn, toAmount, targetToken, targetLimitPrice, orderType, triggerPrice.value, currentPrice).then(() => {
    ElMessage.success(t('submitOrdersSuccess'))
    _getLimitOrder()
    limitAmount1.value = ''
    limitAmount2.value = ''
    dialogVisibleLimit.value = false
    if (limitFromToken.address === NATIVE_TOKEN) {
      if (limitFromToken.address === swapStore.token1.address) {
        swapStore.getToken1Info()
      } else if (limitFromToken.address === swapStore.token2.address) {
        swapStore.getToken2Info()
      }
    }
  }).catch((err: any) => {
    handleError(err)
  }).finally(() => {
    loadingConfirmLimit.value = false
  })
}

function _getLimitOrder(orderKey?: string | undefined, type?: undefined) {
  if (walletStore.chain) {
    const chain = walletStore.chain
    if (chain === 'solana') {
      _getSolanaLimitOrder(orderKey as string, type)
      return
    }
    loadingGetLimitOrder.value = true
    getLimitOrder({chain}).then(res => {
      limitOrders.value = res
    }).finally(() => {
      setTimeout(() => {
        loadingGetLimitOrder.value = false
      }, 800)
    })
  }
}


let Timer7: null | ReturnType<typeof setTimeout> = null
let getSolanaLimitOrderTime = 0
function _getSolanaLimitOrder(orderKey: string, type = 1) {
  if (walletStore.chain === 'solana') {
    loadingGetLimitOrder.value = true
    return Promise.all([
      getSolanaLimitOrder({wallet: walletStore.address}),
      getSolanaLimitOrderHistory({wallet: walletStore.address, take: 100}),
    ]).then(async res => {
      const ids1 = res?.[0]?.map?.(i => ([i?.inputMint + '-solana', i?.outputMint + '-solana'])) || []
      const ids2 = res?.[1]?.map?.(i => ([i?.inputMint + '-solana', i?.outputMint + '-solana'])) || []
      // eslint-disable-next-line no-unsafe-optional-chaining
      const ids = Array.from(new Set([...ids1?.flat?.(), ...ids2?.flat()]))
      const prices = await getTokensPriceInfo(ids).catch(async err => {
        console.log(err)
        return {}
      })
      const _limitOrders = res?.[0]?.map?.((i: any) => {
        // let j = i.account
        const fromDecimals =  prices[i.inputMint + '-solana']?.decimal
        const toDecimals = prices[i.outputMint + '-solana']?.decimal
        return {
          ...i,
          from_token: i.inputMint,
          from_token_symbol: prices[i.inputMint + '-solana']?.symbol,
          from_token_decimals: prices[i.inputMint + '-solana']?.decimal,
          from_token_price: prices[i.inputMint + '-solana']?.current_price_usd,
          to_token: i.outputMint,
          to_token_symbol: prices[i.outputMint + '-solana']?.symbol,
          to_token_decimals: prices[i.outputMint + '-solana']?.decimal,
          to_token_price: prices[i.outputMint + '-solana']?.current_price_usd,
          from_amount: new BigNumber(i.makingAmount || 0)?.times?.(10 ** fromDecimals)?.toFixed(0) || 0,
          to_amount: new BigNumber(i.takingAmount || 0)?.times?.(10 ** toDecimals)?.toFixed(0) || 0,
          chain: 'solana',
          from_amount_used: new BigNumber(i.makingAmount || 0).minus(i.remainingMakingAmount)?.times?.(10 ** fromDecimals).toFixed(0),
          to_amount_used: new BigNumber(i.takingAmount || 0).minus(i.remainingTakingAmount)?.times(10 ** toDecimals).toFixed(0),
          percent: new BigNumber(i.makingAmount || 0).minus(i.remainingMakingAmount).div(i.makingAmount).times(100).toFixed(),
          from_token_logo_url: prices[i.inputMint + '-solana']?.logo_url,
          to_token_logo_url: prices[i.outputMint + '-solana']?.logo_url,
          id: i.orderKey,
          state: 'Pending'
        }
      })
      const limitOrderHistory = res?.[1]?.map?.(i => {
        const fromDecimals =  prices[i.inputMint + '-solana']?.decimal
        const toDecimals = prices[i.outputMint + '-solana']?.decimal
        return {
          ...i,
          from_token: i.inputMint,
          from_token_symbol: prices[i.inputMint + '-solana']?.symbol,
          from_token_decimals: prices[i.inputMint + '-solana']?.decimal,
          from_token_price: prices[i.inputMint + '-solana']?.current_price_usd,
          to_token: i.outputMint,
          to_token_symbol: prices[i.outputMint + '-solana']?.symbol,
          to_token_decimals: prices[i.outputMint + '-solana']?.decimal,
          to_token_price: prices[i.outputMint + '-solana']?.current_price_usd,
          from_amount: new BigNumber(i.makingAmount || 0)?.times?.(10 ** fromDecimals)?.toFixed(0) || 0,
          to_amount: new BigNumber(i.takingAmount || 0)?.times?.(10 ** toDecimals)?.toFixed(0) || 0,
          chain: 'solana',
          from_amount_used: new BigNumber(i.makingAmount || 0).minus(i.remainingMakingAmount)?.times?.(10 ** fromDecimals).toFixed(0),
          to_amount_used: new BigNumber(i.takingAmount || 0).minus(i.remainingTakingAmount)?.times(10 ** toDecimals).toFixed(0),
          percent: new BigNumber(i.makingAmount || 0).minus(i.remainingMakingAmount).div(i.makingAmount).times(100).toFixed(),
          from_token_logo_url: prices[i.inputMint + '-solana']?.logo_url,
          to_token_logo_url: prices[i.outputMint + '-solana']?.logo_url,
          id: i.orderKey,
          state: i.status
        }
      })
      const limitOrderList = [..._limitOrders, ...limitOrderHistory]
      const isGetOrder = limitOrderList?.some(i => i.orderKey === orderKey)
      const isGetOrderCancel = limitOrderList?.some(i => i.orderKey === orderKey && i.state === 'Cancelled')
      if (orderKey && getSolanaLimitOrderTime <= 30 && ((type !== 0 && !isGetOrder) || (type === 0 && !isGetOrderCancel))) {
        if (Timer7) {
          clearTimeout(Timer7)
          Timer7 = null
        }
        return new Promise((resolve) => {
          Timer7 = setTimeout(() => {
            getSolanaLimitOrderTime += 5
            _getSolanaLimitOrder?.(orderKey, type)?.then(res => {
              resolve(res)
            })
          }, 5000)
        })
      } else {
        loadingGetLimitOrder.value = false
        limitOrders.value = limitOrderList?.filter?.(i => !(i.orderKey === orderKey && i.state === 'Pending' && type === 0))
        getSolanaLimitOrderTime = 0
        return limitOrderList
      }
    }).catch((e) => {
      console.warn(e)
      getSolanaLimitOrderTime = 0
      loadingGetLimitOrder.value = false
    })
  }
}

function refreshLimit(item: { chain: string; publicKey: string; from_token: string }, loading?: any) {
  if (item.chain === 'solana') {
    _getSolanaLimitOrder?.(item.publicKey, 0)?.then(() => {
      if (loading) {
        loading[item.publicKey] = false
      }
    })
  } else {
    _getLimitOrder()
  }
}

watch(() => swapStore.fromToken.address, () => {
  if (swapStore.fromToken.address) {
    limitAmount1.value = ''
    limitAmount2.value = ''
    getLimitAllowance()
  }
})

watch(() => walletStore.address, () => {
  if (walletStore.address) {
    getLimitAllowance()
    _getLimitOrder()
  }
})

onMounted(() => {
  getLimitAllowance()
  _getLimitOrder()
  if (chain.value !== 'solana') {
    limitPrice.value = swapStore.baseToken?.token?.current_price_usd ? formatDec(swapStore.baseToken.token.current_price_usd) : ''
    triggerPrice.value = swapStore.baseToken?.token?.current_price_usd ? formatDec(swapStore.baseToken.token.current_price_usd) : ''
  } else {
    limitSolanaPriceU.value = swapStore.baseToken?.token?.current_price_usd ? formatNumber(swapStore.baseToken.token.current_price_usd) : ''
  }
  _quoteLimitSolana()
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
    display: flex;
    align-items: center;
    color: var(--d-F5F5F5-l-333);
    &:disabled {
      color: #999;
      cursor: not-allowed;
      opacity: 0.5;
    }
    &:active:not(:disabled) {
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
</style>
