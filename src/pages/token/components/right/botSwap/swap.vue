<template>
  <div>
    <template v-if="activeTab === 'buy'">
      <el-input v-model="amountNative" placeholder="0.0" size="large"  :clearable="false" class="input-number mt-10px" input-style="text-align:left"  @update:model-value="value => {amountNative = value?.replace?.(/\-|[^\d.]/g, '');watchAmount('buy')}">
        <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ $t('amount') }}</span>
        </template>
        <template #append>
          <!-- <img :src="tokenStore.swap.native?.logo_url || `${configStore.token_logo_url}token_icon/${chain}/${getChainInfo(chain || '').wmain_wrapper || ''}.png`" class="rd-50%" height="20"  alt="" srcset="" > -->
          <el-dropdown :persistent="false" placement="bottom" trigger="click"
            @visible-change="visible => show = visible">
            <div class="inline-flex items-center clickable">
              <img :src="`${configStore.token_logo_url}${tokenStore.swap.payToken?.logo_url}`" class="rd-50%" height="20"  alt="" srcset="" >
              <Icon v-if="swapBaseTokens?.length > 1" class="arrow-up" :class="{ active: show === true }" name="solar:alt-arrow-down-bold" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in (botSwapStore?.botSwapBaseTokens?.[chain || ''] || [])?.filter(item => item?.address !== tokenStore.swap.payToken?.address)" :key="item.address" @click.stop="tokenStore.swap.payToken = item;$emit('getTokenBalance');amountNative='';amountNativeOut=''">
                  <img :src="`${configStore.token_logo_url}${item.logo_url}`" class="rd-50% mr-8px" height="16"  alt="" srcset="" >
                  <span class="text-12px font-400">{{ item?.symbol }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-input>

      <div class="tabs mt-1px">
        <button v-for="(item, index) in tabs1" :key="index" class="tab-item" type="button"  @click.stop="handleAmount(item, 'buy')">
          <!-- <img class="mr-5px" :src="`${configStore.token_logo_url}${tokenStore.swap.payToken?.logo_url}`" style="border-radius: 50%;" height="14"  alt="" srcset="" > -->
          <span v-if="!editMode">{{ item.name||'&nbsp;' }}</span>
          <el-input
v-else-if="tabs1Ref[index]" v-model="tabs1Ref[index].value"
            style="--el-input-inner-height:24px;--el-input-bg-color:transparent;--el-input-border-color:transparent;--el-input-hover-border-color:transparent;--el-input-focus-border-color:transparent"
            class="text-center w-full h-full"
size="small"
            @blur="tabs1Ref[index].value = tabs1Ref[index].value?.replace?.(/\-|[^\d.]/g, '')"
           />
        </button>
        <button class="tab-item h-30px basis-[26px]! grow-0! shrink-0!" type="button" @click="handleEdit(tabs1Ref, 'buy')">
          <Icon :name="editMode ? 'custom:select' : 'custom:remark'"/>
        </button>
      </div>
      <div class="flex items-center mt-10px text-12px">
        <!-- <Icon name="ri:wallet-fill" class="color-[--third-text] text-14px ml-auto" />
        <span class="text-12px color-[--third-text] mx-3px">{{ botSwapStore.botSwapSelectedWallets?.length }}</span>
        <div class="color-[--third-text]" :class="{ 'clickable': botSwapStore.botSwapSelectedWallets?.length <= 1 }" @click.stop="handleMax(tokenStore.swap.payToken?.balance || 0, 'buy')">{{ $t('balance1') }}: <span>{{ formatNumber(totalSelectWalletBalance || 0) }}</span> {{ tokenStore.swap.payToken?.symbol || '' }}
        </div>
        <RefreshBalance class="color-[--third-text]" :type="0" isPayToken isBatch /> -->
        <AutoSellSet v-if="activeTab === 'buy' && swapType==='market' && chain !=='ton'" class="w-full">
          <span class="color-[--third-text]">≈{{  formatNumber(amountNativeOut || 0) }} {{ tokenInfo?.symbol }}</span>
        </AutoSellSet>
      </div>
    </template>
    <template v-else-if="activeTab === 'sell'">
      <el-input v-if="botSwapStore.botSwapSelectedWallets?.length > 1"  v-model="amountSellTokenPercent" :clearable="false" class="input-number mt-10px" size="large"  input-style="text-align:left"  placeholder="0" @update:model-value="value => {amountSellTokenPercent = value?.replace?.(/\-|[^\d.]/g, '');watchAmount('sell')}">
        <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ tokenInfo?.symbol }}</span>
        </template>
        <template #append>
          <span class="text-12px color-[--main-text]">%</span>
        </template>
      </el-input>
      <el-input v-else v-model="amountToken" :clearable="false" class="input-number mt-10px" size="large"  input-style="text-align:left"  placeholder="0.0" @update:model-value="value => {amountToken = value?.replace?.(/\-|[^\d.]/g, '');watchAmount('sell')}">
        <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ $t('amount') }}</span>
        </template>
        <template #append>
           <span class="text-12px color-[--main-text]">{{ tokenInfo?.symbol  }}</span>
        </template>
      </el-input>
      <div class="tabs mt-1px">
        <!-- <button v-for="(item, index) in tabs2" :key="index" class="tab-item" type="button" @click.stop="handleAmount(item, 'sell')">
          <span>{{ item.name }}</span>
        </button> -->
          <button v-for="(item, index) in tabs2" :key="index" class="tab-item" type="button"  @click.stop="handleAmount(item, 'sell')">
          <!-- <img class="mr-5px" :src="`${configStore.token_logo_url}${tokenStore.swap.payToken?.logo_url}`" style="border-radius: 50%;" height="14"  alt="" srcset="" > -->
          <span v-if="!editMode2">{{ item.name==='0%'?'&nbsp;':item.name }}</span>
          <el-input
            v-else-if="tabs2Ref[index]" v-model="tabs2Ref[index].value"
            style="--el-input-inner-height:24px;--el-input-bg-color:transparent;--el-input-border-color:transparent;--el-input-hover-border-color:transparent;--el-input-focus-border-color:transparent"
            class="text-center w-full h-full"
size="small"
            @blur="tabs2Ref[index].value = Number(tabs2Ref[index].value?.replace?.(/\-|[^\d.]/g, ''))<=1?tabs2Ref[index].value?.replace?.(/\-|[^\d.]/g, ''):'1'"
            :formatter="formatter"
            :parser="parser"
           >  <template #suffix>%</template></el-input>
        </button>
        <button class="tab-item h-30px basis-[26px]! grow-0! shrink-0!" type="button" @click="handleEdit2(tabs2Ref, 'sell')">
          <Icon :name="editMode2 ? 'custom:select' : 'custom:remark'"/>
        </button>
      </div>
      <div class="flex items-center mt-10px text-12px">
        <div class="color-[--main-text] flex items-center"><span>≈{{ formatNumber(amountTokenOut || 0) }}</span>
          <el-dropdown placement="bottom" trigger="click" @visible-change="visible => show = visible">
            <div class="inline-flex items-center clickable text-12px ml-4px">
              <span>{{ tokenStore.swap.payToken?.symbol || getChainInfo(chain || '')?.main_name }}</span>
              <Icon v-if="swapBaseTokens?.length > 1" class="arrow-up" :class="{ active: show === true }" name="solar:alt-arrow-down-bold" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in (botSwapStore?.botSwapBaseTokens?.[chain || ''] || [])?.filter(item => item?.address !== tokenStore.swap.payToken?.address)" :key="item?.address" @click.stop="tokenStore.swap.payToken = item;$emit('getTokenBalance');amountToken='';amountTokenOut='';amountSellTokenPercent = ''">
                  <img :src="`${configStore.token_logo_url}${item.logo_url}`" class="rd-50% mr-8px" height="16"  alt="" srcset="" >
                  <span class="text-12px font-400">{{ item?.symbol }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- <Icon name="ri:wallet-fill" class="color-[--third-text] text-14px ml-auto" />
        <span class="text-12px color-[--third-text] mx-3px">{{ botSwapStore.botSwapSelectedWallets?.length }}</span>
        <span class="color-[--third-text]" :class="{ 'clickable': botSwapStore.botSwapSelectedWallets?.length <= 1 }" @click.stop="handleMax(tokenStore.swap.token?.balance || 0, 'sell')">{{ $t('balance1') }}: <span >{{ formatNumber(totalSelectWalletBalance1 || 0) }}</span> {{ tokenInfo?.symbol }}</span>
        <RefreshBalance class="color-[--third-text]" :type="1" isPayToken isBatch /> -->
      </div>
    </template>
    <template v-if="swapType === 'limit'">
      <el-input v-model="priceLimit" placeholder="0.0" size="large"  :clearable="false" class="input-number mt-10px" input-style="text-align:left" @update:model-value="value => priceLimit = value?.replace?.(/\-|[^\d.]/g, '')">
        <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ isPriceLimit ? $t('price') : 'MC' }}</span>
          <Icon name="iconamoon:synchronize-fill" class="clickable ml-5px text-12px color-[--main-text]" @click.stop="isPriceLimit = !isPriceLimit"/>
        </template>
        <template #append>
          <span class="text-12px color-[--main-text]">$</span>
        </template>
      </el-input>
      <div class="slider-swap" :class="activeTab">
        <div class="slider-swap_left">
          <el-slider :model-value="priceLimitRange1" :show-tooltip="false" :show-input-controls="false" :min="-100" :max="100" @input="(val) => onSliderInput(val as number)" />
          <div class="slider-swap_left-mark">
            <span v-for="(item, index) in [-100, -50, 0, 50, 100]" :key="index" class="clickable" @click.stop="priceLimitRange=item">{{item}}%</span>
          </div>
        </div>
        <el-input v-model="priceLimitRange" placeholder="0" class="input-number max-w-70px ml-15px text-14px!" @update:model-value="value => priceLimitRange = value?.replace?.(/\-|[^\d.]/g, '')">
          <template #prefix>
            <div class="w-10px" />
          </template>
          <template #suffix>
            <div class="text-14px color-[--third-text] pr-5px">%</div>
          </template>
        </el-input>
      </div>
    </template>
    <template v-if="isSupportSwap">
      <el-button v-if="!isApprove" :color="swapButtonColor" class="submit-btn" native-type="button" :loading="loadingApprove || loadingSwap || loadingAllowance" :disabled="Number(fromToken.balance) < Number(fromAmount)" @click.stop="approve">{{ Number(fromToken.balance) === 0 || Number(fromToken.balance) < Number(fromAmount) ? (checkAmountMessage() || $t('approve')) : $t('approve') }}</el-button>

      <el-button
        v-else-if="activeTab === 'buy' && (Number(fromToken?.balance) === 0 || Number(fromToken?.balance) < Number(fromAmount))"
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
      <template v-if="checkAmountMessage()">
            {{ checkAmountMessage() }}
          </template>
        <template v-else-if="!isBuyTab">
          {{ checkAmountMessage() || (isBuyTab ? $t('buy') : ($t('sell') + (Number(amountTokenOut || 0) > 0 ? `≈ ${ formatNumber(amountTokenOut || 0) } ${tokenStore.swap.payToken?.symbol || getChainInfo(chain || '')?.main_name }` : ''))) }}
        </template>
            <div v-else class="flex items-center gap-4px">

            {{$t('buy') }}
            <span>|</span>
            <img :src="`${configStore.token_logo_url}${tokenStore.swap.payToken?.logo_url}`" class="rd-50%" height="12"  alt="" srcset="" >
            <span>{{ submitAmount }}
              <template v-if="!isUsdcUsdt">
                (${{submitAmountUsd}})
              </template>
            </span>
            <span>|</span>
            <span>{{formatNumber(amountNativeOut || 0)}}
            </span>
          </div>
      </el-button>
      <BottomSetting :activeTab="activeTab" :swapType="swapType" :gasPrice="gasPrice" />
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
    <div v-else class="text-14px color-[--secondary-text] text-center mt-16px bg-[--icon-color] lh-40px rounded-6px">
{{ $t('useChainWallet') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NATIVE_TOKEN, MIN_BALANCE } from '@/utils/constants'
import BigNumber from 'bignumber.js'
import { debounce } from 'lodash-es'
import { getAddressAndChainFromId, isEvmChain, getRpcProvider, formatUnits } from '@/utils'
import { ElMessageBox } from 'element-plus'
import { useBotSwap } from '~/composables/botSwap'
import { useTransactionPrompt } from '@/composables/useTransactionPrompt'
import { bot_createSolTx, bot_createSwapEvmTx, bot_createSolLimitTx, bot_createEvmLimitTx, bot_createSwapTonTx, bot_createTonLimitSwap, getAutoSlippage } from '@/api/bot'
import RefreshBalance from './refreshBalance.vue'
import { formatDec, formatNumber } from '@/utils/formatNumber'
import { useEventBus } from '@vueuse/core'
import AutoSellSet from './autoSellSet.vue'
import type { BotChain } from '~/utils/types'
import { recordTxV2, updateTxV2 } from '~/api/tracking'
import BottomSetting from './bottomSetting.vue'
import delayedNotify from '~/utils/notify'
import { formatBotError, hasCreateTxError, getCreateTxErrorMsg } from '~/utils/bot'



const ElNotification = (arg: any) => delayedNotify({...arg, duration: 2500})

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

const tabs1Ref = ref(props.tabs1)
const tabs2Ref = ref(props.tabs2)
const emit = defineEmits(['getTokenBalance', 'update:botSettings'])

const { t } = useI18n()
const { executing } = useTransactionPrompt()

const show = ref(false)

// 响应式状态
const amountToken = ref('')
const amountNative = ref('')
const amountTokenOut = ref('')
const amountNativeOut = ref('')
const amountSellTokenPercent = ref('')
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
const priceLimitRange = ref<undefined | number | string>(undefined)

const priceLimitRange1 = computed(() => {
  return Number(priceLimitRange.value) > 100 ? 100 : (Number(priceLimitRange.value) || undefined)
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
let isPriceLimit_move = false
// 保存事件总线监听器停止函数
const priceLimitMoveOff = useEventBus<string>('priceLimit_move').on((price) => {
  if (props.swapType !== 'limit' || isPriceLimit_move) return
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

watch(()=>props.tabs1, (val) => {
  tabs1Ref.value = val
})
watch(()=>props.tabs2, (val) => {
  tabs2Ref.value = val
})

// 保存事件总线监听器停止函数
const klineDataReadyOff = useEventBus('klineDataReady').on(() => {
  if (props.swapType !== 'limit') return
  updateStorePriceLimit()
})

onUnmounted(() => {
  // 清理事件总线监听器
  if (priceLimitMoveOff) {
    priceLimitMoveOff()
  }
  if (klineDataReadyOff) {
    klineDataReadyOff()
  }
})

function updateStorePriceLimit() {
  if (isLineChange) return
  isPriceLimit_move = true
  if(!isPriceLimit.value) {
    useEventBus<number>('priceLimit').emit(Number(formatDec(new BigNumber(priceLimit.value).div(tokenStore.circulation || 1).toFixed(), 4)))
  } else {
    useEventBus<number>('priceLimit').emit(Number(priceLimit.value))
  }
  nextTick(() => {
    isPriceLimit_move = false
  })
}


const route = useRoute()

const tokenStore = useTokenStore()
const botStore = useBotStore()
const botSwapStore = useBotSwapStore()
const botSettingStore = useBotSettingStore()
const wsStore = useWSStore()
const configStore = useConfigStore()

const {gasPrice} = storeToRefs(tokenStore)

// const { botSettings } = storeToRefs(botSettingStore)


const { getTokensPrice, allowance, getAllowance, loadingAllowance, bot_approve, updateBalanceFromWs } = useBotSwap()

// 计算属性
const tokenInfo = computed(() => tokenStore.token)
const chain = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  return (routeParams?.chain || tokenInfo.value?.chain) as BotChain
})

const walletAddress = computed(() => {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenInfo.value?.chain

  return botStore?.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
})

const fromToken = computed(() => {
  return props.activeTab === 'buy' ? tokenStore.swap.payToken : tokenStore.swap.token
})

const fromAmount = computed(() => {
  return props.activeTab === 'buy' ? amountNative.value : amountToken.value
})

const toAmount = computed(() => {
  return props.activeTab === 'buy' ? amountNativeOut.value : amountTokenOut.value
})

function getAddressFromChain(chain: BotChain, addresses: typeof botStore.walletList[number]['addresses']) {
  return addresses?.find?.(i => i?.chain === chain)
}

function getAddressFromChainBalance(chain: BotChain, addresses: typeof botStore.walletList[number]['addresses'], token?: string) {
  if (BotNativeTokens?.includes(token || '') || !token) {
    return getAddressFromChain(chain, addresses)?.balance || 0
  }
  return getAddressFromChain(chain, addresses)?.tokenBalances?.[token]?.balance || 0
}

const swapBaseTokens = computed(() => {
  return (botSwapStore?.botSwapBaseTokens?.[chain.value || ''] || [])?.filter(item => item?.address !== tokenStore.swap.payToken?.address)
})

const totalSelectWalletBalance = computed(() => {
  const chain = getChain()
  const addresses = [...botSwapStore.botSwapSelectedWallets, (botStore.evmAddress || '')]
  // 去重 并去除 undefined 空字符
  const uniqueAddresses = Array.from(new Set(addresses?.filter(Boolean)))
  let balance = '0'
  const token = tokenStore.swap.payToken
  botStore.walletList?.forEach(i => {
    if (uniqueAddresses.includes(i.evmAddress)) {
      balance = new BigNumber(balance).plus(getAddressFromChainBalance(chain, i?.addresses, token?.address) || 0).toFixed()
    }
  })
  return balance
})

const totalSelectWalletBalance1 = computed(() => {
  const chain = getChain()
  const addresses = [...botSwapStore.botSwapSelectedWallets, (botStore.evmAddress || '')]
  // 去重 并去除 undefined 空字符
  const uniqueAddresses = Array.from(new Set(addresses?.filter(Boolean)))
  let balance = '0'
  const token = tokenStore.swap?.token
  botStore.walletList?.forEach(i => {
    if (uniqueAddresses.includes(i.evmAddress)) {
      balance = new BigNumber(balance).plus(getAddressFromChainBalance(chain, i?.addresses, token?.address) || 0).toFixed()
    }
  })
  return balance
})


const swapButtonColor= computed(() => {
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
  return true
  // const routeParams = getAddressAndChainFromId(route.params.id as string)
  // const chain = routeParams?.chain || tokenInfo.value?.chain || ''
  // if (['solana', 'ton'].includes(chain)) return true
  // if (fromToken.value?.address === NATIVE_TOKEN) return true

  // const decimals = fromToken.value?.decimals || 18
  // const fromAmountBN = new BigNumber(props.activeTab === 'buy' ? amountNative.value || 0 : amountToken.value || 0 )
  // const parsedAmount = new BigNumber(fromAmountBN.toFixed(decimals)).times(10 ** decimals)
  // return parsedAmount.lte(allowance.value)
})

const submitAmount = computed(()=>{
  return formatNumber(amountNative.value,{limit:20})
})

const submitAmountUsd = computed(()=>{
  if(!amountNative.value) return '0'
  const result =  new BigNumber(amountNative.value).times(tokenStore.swap.payToken?.price || '0')
  return formatNumber(result.toString())
})

const isUsdcUsdt = computed(()=>{
  return tokenStore.swap.payToken?.symbol?.toUpperCase?.() === 'USDC' || tokenStore.swap.payToken?.symbol?.toUpperCase?.() === 'USDT'
})


// 方法
const handleMax = (balance: string | number, type: 'buy' | 'sell') => {
  if (botSwapStore.botSwapSelectedWallets?.length > 1) return
  const min = MIN_BALANCE[chain.value as 'bsc' | 'solana' | 'base' | 'eth'] || 0.01
  const decimals = fromToken.value?.decimals || 18
  const fromAmount = balance || 0
  const nativeTokens = ['sol', 'ton', NATIVE_TOKEN]
  if (type === 'buy') {
    if (nativeTokens.includes(fromToken.value?.address || '')) {
      if (new BigNumber(balance).lt(min)) {
        ElMessageBox.alert(t('balanceNotEnough', {n: min, s: fromToken.value?.symbol}), t('tips'), {
          confirmButtonText: t('okay')
        })
        return
      }
      amountNative.value = new BigNumber(fromAmount)?.minus(min).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
    } else {
      amountNative.value = new BigNumber(fromAmount).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
    }
  } else {
    amountToken.value =  new BigNumber(fromAmount).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
  }
  watchAmount2(type)
}

function handleAmount(item: { name: string; value: string }, type: 'buy' | 'sell') {
  console.log('handleAmount',item, type)
  if(editMode.value) return
  if(editMode2.value) return
  if (type === 'buy') {
    amountNative.value = item.value
  } else if (type === 'sell') {
    const p = item.value
    let a = tokenStore.swap.token?.balance || 0
    if (botSwapStore.botSwapSelectedWallets?.length > 1) {
      amountSellTokenPercent.value = new BigNumber(p).times(100).toFixed(0)
      a = totalSelectWalletBalance1.value
    }
    if (p) {
      const decimals = tokenStore.swap.payToken?.decimals || 0
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

function setAmountToken() {
  const p = amountSellTokenPercent.value
  let a = tokenStore.swap.token?.balance || 0
  if (botSwapStore.botSwapSelectedWallets?.length > 1) {
    a = totalSelectWalletBalance1.value
  }
  if (p) {
    const decimals = tokenStore.swap.payToken?.decimals || 0
    a = new BigNumber(a).times(p).div(100).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || 0
    if (Number(a) === 0) {
      a = ''
    }
  } else {
    a = ''
  }
  amountToken.value = String(Number(a) < 0 ? 0 : a)
}

const watchAmount = debounce((type: 'buy' | 'sell') => {
  watchAmount2(type)
}, 10)

function watchAmount2(type: 'buy' | 'sell', isGetPrice = true) {
  if (botSwapStore.botSwapSelectedWallets?.length > 1 && type === 'sell') {
    setAmountToken()
  }
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
  const nativePrice = botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.payToken.price || tokenStore.swap.native.price || 0


  const payToken = tokenStore.swap.payToken

  const payTokenPrice = (BotNativeTokens?.includes(payToken?.address || '') ? nativePrice : tokenStore.swap.payToken.price) || 0

  let price: number = tokenStore.price || tokenStore.swap.token?.price || 0
  if (props.swapType === 'limit') {
    const p = isPriceLimit.value ? priceLimit.value : new BigNumber(priceLimit.value).div(tokenStore.circulation || 1).toFixed()
    price = Number(formatDec(p || tokenStore.price || tokenStore.swap.token?.price || 0, 4))
  }

  const fromPrice = isBuy ? payTokenPrice : price
  const toPrice = isBuy ? price : payTokenPrice
  const res = Number(fromAmount) * (fromPrice || 0) / (toPrice || 1)
  if (res) {
    if (type === 'buy') {
      amountNativeOut.value = String(res) || '0'
    } else {
      amountTokenOut.value = String(res) || '0'
    }
    const fromToken = type === 'buy' ? tokenStore.swap.payToken : tokenStore.swap.token
    const toToken = type === 'buy' ? tokenStore.swap.token : tokenStore.swap.payToken
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
    if (tokenStore.swap.payToken.price && tokenStore.swap.token.price) {
      resolve([{ current_price_usd: tokenStore.swap.token.price }, { current_price_usd: tokenStore.swap.payToken.price }])
    }
    getTokensPriceFun(resolve, reject)
  })
}

function getChain() {
  const routeParams = getAddressAndChainFromId(route.params.id as string)
  const chain = routeParams?.chain || tokenInfo.value?.chain || ''
  return chain as BotChain
}

function getPromptMainEvmAddress() {
  return botStore.evmAddress || botSwapStore.botSwapSelectedWallets?.[0] || ''
}

function getPromptChainAddress(chain: BotChain) {
  const evmAddress = getPromptMainEvmAddress()
  const wallet = botStore.walletList?.find?.(item => item.evmAddress === evmAddress)
  const chainAddress = wallet?.addresses?.find?.(item => item?.chain === chain)?.address
  return chainAddress || botStore.userInfo?.addresses?.find?.(item => item?.chain === chain)?.address || ''
}

function isSameAddress(a?: string, b?: string, chain?: BotChain) {
  if (!a || !b) return false
  if (chain && isEvmChain(chain)) {
    return a.toLowerCase() === b.toLowerCase()
  }
  return a === b
}

const isSupportSwap = computed(() => {
  const chain = getChain()
  return botStore.accessToken && botStore?.isSupportChains?.includes?.(chain)
})

const isBuyTab = computed(() => {
  return props.activeTab === 'buy'
})

const _getAllowance = () => {
  const toToken = isBuyTab.value ? tokenStore.swap.token : tokenStore.swap.payToken
  return getAllowance(fromToken.value?.address || '', toToken?.address || '')
}

const approve = async () => {
  loadingApprove.value = true
  bot_approve({
    batchId: Date.now().toString(),
    chain: chain.value || '',
    inTokenAddress: fromToken.value?.address || '',
    outTokenAddress: (isBuyTab.value ? tokenStore.swap.token.address : tokenStore.swap.payToken.address) || '',
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
    handleBotError(error || 'approve error', ElNotification)
    loadingApprove.value = false
  })
}

function checkAmount() {
  const fromTokenBalance = fromToken.value?.balance || 0
  const isBatchSell = botSwapStore.botSwapSelectedWallets.length > 1 && props.activeTab === 'sell'
  return !(
    ((Number(fromTokenBalance) < Number(fromAmount.value) && !isBatchSell) || (isBatchSell && Number(amountSellTokenPercent.value || 0) > 100)) ||
    String(fromAmount.value) === '0' || tokenStore.swap.token?.address === tokenStore.swap.payToken?.address || new BigNumber(fromAmount.value || 0).lte(0) ||
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
  const fromTokenBalance = fromToken.value?.balance || 0
  if (botSwapStore.botSwapSelectedWallets.length > 1 && props.activeTab === 'sell' ) {
    if (Number(amountSellTokenPercent.value || 0) > 100) {
      return t('insufficientBalance')
    }
  } else if  (Number(fromTokenBalance) < Number(fromAmount.value)) {
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
  const promptCreatorAddress = getPromptChainAddress(chain)
  const promptAvatarAddress = promptCreatorAddress || getPromptMainEvmAddress()
  const promptFromToken = isBuy ? tokenStore.swap.payToken : tokenStore.swap.token
  const promptToToken = isBuy ? tokenStore.swap.token : tokenStore.swap.payToken
  let promptStartTime = 0
  let promptTimer: ReturnType<typeof setInterval> | null = null
  let promptAutoCloseTimer: ReturnType<typeof setTimeout> | null = null
  let promptDone = false
  const clearPromptTimer = () => {
    if (promptTimer) {
      clearInterval(promptTimer)
      promptTimer = null
    }
  }
  const clearPromptAutoCloseTimer = () => {
    if (promptAutoCloseTimer) {
      clearTimeout(promptAutoCloseTimer)
      promptAutoCloseTimer = null
    }
  }
  promptStartTime = Date.now()
  const promptHandle = executing({
    avatarAddress: promptAvatarAddress,
    avatarChain: chain,
  })
  const finishPromptFail = () => {
    if (promptDone) return
    promptDone = true
    clearPromptTimer()
    clearPromptAutoCloseTimer()
    promptHandle.close()
  }
  const finishPromptSuccess = (txInfo1: any) => {
    if (promptDone) return
    promptDone = true
    clearPromptTimer()
    clearPromptAutoCloseTimer()
    const elapsedSec = (Date.now() - promptStartTime) / 1000
    const fromAmountDisplay = txInfo1?.fromAmount ? formatUnits(txInfo1.fromAmount, promptFromToken?.decimals || 0) : fromAmount.value
    const toAmountDisplay = txInfo1?.outputAmount ? formatUnits(txInfo1.outputAmount, promptToToken?.decimals || 0) : toAmount.value
    promptHandle.success({
      chain: chain,
      txHash: txInfo1?.txHash || txInfo1?.hash || '',
      elapsedSec,
      isBuy,
      fromSymbol: promptFromToken?.symbol || '',
      fromAmount: fromAmountDisplay,
      toSymbol: promptToToken?.symbol || '',
      toAmount: toAmountDisplay,
      avatarAddress: promptAvatarAddress,
      avatarChain: chain,
    })
  }
  promptTimer = setInterval(() => {
    promptHandle.update(Date.now() - promptStartTime)
  }, 100)
  promptAutoCloseTimer = setTimeout(() => {
    if (promptDone) return
    clearPromptTimer()
    promptHandle.close()
    promptAutoCloseTimer = null
  }, 120000)
  const chainMainToken: Record<string, string> = {
    solana: 'sol',
    ton: 'TON',
  }
  const native = tokenStore.swap.payToken?.address || chainMainToken?.[chain] || NATIVE_TOKEN
  // const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address || ''
  const isBatchSell = botSwapStore.botSwapSelectedWallets.length > 1 && props.activeTab === 'sell'
  if (chain === 'solana' || chain === 'ton') {
    // let mev = this.botSettings?.solana?.mev
    const selected = botSettingStore?.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore?.botSettings?.[chain]?.selected || 's1'
    const botSettings = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.[selected]
    const mev = botSettings?.mev

    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    const botPriorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
    // let min = this.botProtection ? '2000000' : '1500000'
    // botPriorityFee = botPriorityFee.lt(min) ? min : botPriorityFee.toFixed(0)
    const ft = isBuy ? tokenStore.swap.payToken : tokenStore.swap.token
    const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.payToken
    const slippage = botSettings?.slippage || 9
    const batchId = Date.now().toString()
    const swapList = (botSwapStore?.botSwapSelectedWallets || [])?.map((i, k) => {
      const addr = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses?.find?.(k => k?.chain === chain)?.address
      const addresses = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses || []
      const balance = getAddressFromChainBalance(chain, addresses, isBuy ? native : (ft?.address || '')) || 0
      const inAmount = isBatchSell ? new BigNumber(balance || 0).times(amountSellTokenPercent.value || 0).div(100).times(10 ** (ft?.decimals || 0)).toFixed(0) : new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0)
      return {
        batchId: batchId + String(k),
        creatorAddress: addr || '',
        inAmount: inAmount,
      }
    })?.filter?.(i => Number(i?.inAmount) > 0 && i?.creatorAddress) || []

    const data = {
      // batchId: Date.now().toString(),
      swapList: swapList,
      inTokenAddress: isBuy ? native : (ft?.address || ''),
      outTokenAddress: isBuy ? (tt?.address || '') : native,
      swapType: (isBuy ? 1 : 2) as 1 | 2,
      isPrivate: mev || false,
      priorityFee: botPriorityFee, // botPriorityFee
      autoSell: isBuy ? botSettingStore.autoSellConfig_autoSell || false : false,
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto',
      autoSellConfig: isBuy ? botSettingStore?.selectedAutoSellConfig : [],
      autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellPriorityFee: botPriorityFee,
      // ...slippageObj.value,
    }
    const bot_createTx = {
      solana: bot_createSolTx,
      ton: bot_createSwapTonTx
    }
    bot_createTx[chain](data).then(res => {
      if (res) {
        // const chain = 'solana'
        const isError = res?.every?.((i: { errorLog: string }) => i?.errorLog)
        res?.forEach?.((txInfo: any) => {
          const isPromptTx = !promptCreatorAddress || isSameAddress(txInfo?.creatorAddress, promptCreatorAddress, chain)
          const walletName = botStore.walletList?.find?.(j => j?.addresses?.find?.(k => k?.chain === chain)?.address === txInfo?.creatorAddress?.toLowerCase?.())?.name || ''
          let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
            // this.$store.state.bot.historyUpdate++
            // tokenStore.placeOrderUpdate++
            // ElNotification({ type: 'success', message: walletName + ' ' + t('transactionsSubmitted') })
            // if (!['myBotHistory', 'myBotPosition']?.includes(this.$store.state.tabActive)) {
            //   this.$store.state.tabActive = 'myBotHistory'
            // }
            loadingSwap.value = false
            amountToken.value = ''
            amountSellTokenPercent.value = ''
            amountNative.value = ''
            amountTokenOut.value = ''
            amountNativeOut.value = ''
            // this.dialogVisibleSwap = false
          }, 500)
          if (txInfo?.errorLog) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            handleBotError(walletName + ' ' + txInfo?.errorLog, ElNotification)
            if (isPromptTx) {
              finishPromptFail()
            }
            if (isError) {
              loadingSwap.value = false
              return
            }
          }

          const recordTxUrlObj = {
            solana: '/botapi/swap/createSolTx',
            ton: '/botapi/swap/createSwapTonTx',
          }

          recordTxV2({
            txInfo,
            chain: chain,
            destination: recordTxUrlObj?.[chain] || '/botapi/swap/createSwapEvmTx' ,
            type: 10
          })
          const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
            const _batchId = subscribeResult.batchId
            const txInfo1 = subscribeResult?.txList?.[0]
            if (_batchId?.includes(batchId) && isSameAddress(txInfo.creatorAddress, txInfo1?.walletAddress, chain)) {
              if (Timer) {
                clearTimeout(Timer)
                Timer = null
              }
              tokenStore.placeOrderSuccess++
               if (txInfo1?.success) {
                updateTxV2({...txInfo1, chain: subscribeResult?.chain}, txInfo?.id || '')
                if (isPromptTx) {
                  finishPromptSuccess(txInfo1)
                }
              } else {
                const msg = formatBotError(txInfo1?.failMessage) || 'swap error'
                handleBotError(txInfo1?.walletName + ' ' + msg, ElNotification)
                if (isPromptTx) {
                  finishPromptFail()
                }
              }
              unwatch()
              loadingSwap.value = false
            }
          })
        })
      } else {
        finishPromptFail()
        loadingSwap.value = false
      }
    }).catch(err => {
      handleBotError(err || 'swap error', ElNotification)
      finishPromptFail()
      loadingSwap.value = false
    })
  } else if (isEvmChain(chain)) {
    const selected = botSettingStore.botSettings?.[chain as BotChain]?.[props.activeTab]?.selected || 's1'
    const botSettings = botSettingStore.botSettings?.[chain as BotChain]?.[props.activeTab]?.[selected]
    const mev = botSettings?.mev
    const slippage = botSettings?.slippage || 9
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const gasPrice = settings?.customFee == '0' ? '0' : (settings?.customFee || gasTips?.[settings?.level || 0] || '3')
    const gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    const ft = isBuy ? tokenStore.swap.payToken : tokenStore.swap.token
    const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.payToken
    const batchId = Date.now().toString()
    console.log('-----botSwapSelectedWallets-----', botSwapStore?.botSwapSelectedWallets)
    const swapList = (botSwapStore?.botSwapSelectedWallets || [])?.map((i, k) => {
      const addr = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses?.find?.(k => k?.chain === chain)?.address
      const addresses = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses || []
      const balance = getAddressFromChainBalance(chain, addresses, isBuy ? native : (ft?.address || '')) || 0
      const inAmount = isBatchSell ? new BigNumber(balance || 0).times(amountSellTokenPercent.value || 0).div(100).times(10 ** (ft?.decimals || 0)).toFixed(0) : new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0)
      return {
        batchId: batchId + String(k), // batchId + k,
        creatorAddress: addr || '',
        inAmount: inAmount,
      }
    })?.filter?.(i => Number(i?.inAmount) > 0 && i?.creatorAddress) || []
    const data = {
      // batchId: Date.now().toString(),
      chain: chain,
      swapList: swapList,
      inTokenAddress: isBuy ? native : (ft?.address || ''),
      outTokenAddress: isBuy ? (tt?.address || '') : native,
      swapType: (isBuy ? 1 : 2) as 1 | 2,
      contractType: 0 as 0 | 1,
      isPrivate: mev || false,
      gasTip: gasTip,
      autoSell: isBuy ? botSettingStore.autoSellConfig_autoSell || false : false,
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto',
      autoSellConfig: isBuy ? botSettingStore?.selectedAutoSellConfig : [],
      autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellPriorityFee: gasTip,
      // ...slippageObj.value,
    }
    // await Promise.all(swapList.map(i => {
    //   return checkApproveAndApprove({
    //     token: ft.address,
    //     chain: chain,
    //     owner: i.creatorAddress
    //   })
    // })).catch(() => {
    //   loadingSwap.value = false
    // })
    // return console.log('bot_createTx[chain]',data)
    // await checkApproveAndApprove({
    //   inToken: data.inTokenAddress,
    //   outToken: data.outTokenAddress,
    //   chain: chain,
    //   owner: walletAddress
    // }).catch(() => {
    //   loadingSwap.value = false
    // })
    bot_createSwapEvmTx(data).then(res => {
      if (res) {
        const isError = res?.every?.((i: any) => hasCreateTxError(i))
        res?.forEach?.((txInfo: any) => {
          const isPromptTx = !promptCreatorAddress || isSameAddress(txInfo?.creatorAddress, promptCreatorAddress, chain)
          const walletName = botStore.walletList?.find?.(j => j?.evmAddress?.toLowerCase?.() === txInfo?.creatorAddress?.toLowerCase?.())?.name || ''
          let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
            // tokenStore.placeOrderUpdate++
            // ElNotification({ type: 'success', message: walletName + ' ' + t('transactionsSubmitted') })
            loadingSwap.value = false
            amountNative.value = ''
            amountNativeOut.value = ''
            amountToken.value = ''
            amountSellTokenPercent.value = ''
            amountTokenOut.value = ''
            // this.dialogVisibleSwap = false
          }, 500)
          if (hasCreateTxError(txInfo)) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            handleBotError(walletName + ' ' + getCreateTxErrorMsg(txInfo), ElNotification)
            if (isPromptTx) {
              finishPromptFail()
            }
            if (isError) {
              loadingSwap.value = false
              return
            }
          }
          recordTxV2({
            txInfo,
            chain: chain,
            destination: '/botapi/swap/createSwapEvmTx' ,
            type: 10
          })
          const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
            const _batchId = subscribeResult.batchId
            const txInfo1 = subscribeResult?.txList?.[0]
            console.log('txInfo1', txInfo1)
            console.log('txInfo', txInfo, _batchId?.includes?.(batchId) && txInfo.creatorAddress === txInfo1?.walletAddress)
            if (_batchId?.includes?.(batchId) && isSameAddress(txInfo.creatorAddress, txInfo1?.walletAddress, chain)) {
              if (Timer) {
                clearTimeout(Timer)
                Timer = null
              }
              tokenStore.placeOrderSuccess++
              if (txInfo1?.success) {
                updateTxV2({...txInfo1, chain: subscribeResult?.chain}, txInfo?.id || '')
                updateBalanceFromWs({
                  chain: data.chain,
                  inTokenAddress: data.inTokenAddress,
                  outTokenAddress: data.outTokenAddress,
                  ...txInfo1
                })
                if (isPromptTx) {
                  finishPromptSuccess(txInfo1)
                }
              } else {
                const msg = formatBotError(txInfo1?.failMessage) || 'swap error'
                handleBotError(txInfo1?.walletName + ' ' + msg, ElNotification)
                if (isPromptTx) {
                  finishPromptFail()
                }
              }
              unwatch()
              loadingSwap.value = false
            }
          })
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error', ElNotification)
      finishPromptFail()
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
  const native = tokenStore.swap.payToken?.address || chainMainToken?.[chain] || NATIVE_TOKEN
  const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address || ''
  const isBatchSell = botSwapStore.botSwapSelectedWallets.length > 1 && props.activeTab === 'sell'
  if (chain === 'solana' || chain === 'ton') {
    // let mev = this.botSettings?.solana?.mev
    const selected = botSettingStore?.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore.botSettings?.[chain]?.selected || 's1'
    const botSettings = botSettingStore.botSettings?.[chain]?.[selected]
    const mev = botSettings?.mev

    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
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
    const ft = isBuy ? tokenStore.swap.payToken : tokenStore.swap.token
    // const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.native
    const slippage = botSettingStore.botSettings?.[chain]?.[botSettingStore.botSettings?.[chain]?.selected]?.slippage || 9
    const batchId = Date.now().toString()
    const swapList = (botSwapStore?.botSwapSelectedWallets || [])?.map((i, k) => {
      const addr = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses?.find?.(k => k?.chain === chain)?.address
      const addresses = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses || []
      const balance = getAddressFromChainBalance(chain, addresses, isBuy ? native : (ft?.address || '')) || 0
      const inAmount = isBatchSell ? new BigNumber(balance || 0).times(amountSellTokenPercent.value || 0).div(100).times(10 ** (ft?.decimals || 0)).toFixed(0) : new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0)
      return {
        batchId: batchId + String(k), // batchId + k,
        creatorAddress: addr || '',
        inAmount: inAmount,
      }
    })?.filter?.(i => Number(i?.inAmount) > 0 && i?.creatorAddress) || []
    const data = {
      // batchId: Date.now().toString(),
      swapList: swapList,
      tokenAddress: tokenStore.swap.token?.address || tokenStore.token?.token || '',
      baseTokenAddress: native,
      swapType: (isBuy ? 5 : 6) as 5 | 6, //5:Buy limit 6:Sell limit
      isPrivate: mev || false,
      priceLimit: p,
      autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      priorityFee: botPriorityFee, // botPriorityFee
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto'
    }

    const bot_createLimitTx = {
      solana: bot_createSolLimitTx,
      ton: bot_createTonLimitSwap
    }
    bot_createLimitTx[chain](data).then(res => {
      if (res) {
        const isError = res?.every?.((i: { errorLog: string }) => i?.errorLog)
        res?.forEach?.((txInfo: any) => {
          console.log('txInfo', txInfo, botStore.walletList)
          const walletName = botStore.walletList?.find?.(j => j?.addresses?.find?.(k => k?.chain === chain)?.address === txInfo?.creatorAddress)?.name || ''
          console.log('walletName', walletName)
          let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
            // this.$store.state.bot.limitHistoryUpdate++
            tokenStore.placeOrderUpdate++
            if (txInfo?.creatorAddress?.toLowerCase() === walletAddress) {
              priceLimit.value = ''
            }
            ElNotification({ type: 'success', message: walletName + ' ' + t('limitSubmitted') })
            //  if (!['myBotPosition', 'botLimitOrder']?.includes(this.$store.state.tabActive)) {
            //   this.$store.state.tabActive = 'botLimitOrder'
            // }
            loadingSwap.value = false
            amountToken.value = ''
            amountSellTokenPercent.value = ''
            amountNative.value = ''
            amountTokenOut.value = ''
            amountNativeOut.value = ''
            // this.dialogVisibleSwap = false
            // if (this.$store.state.tabActive === 'botLimitOrder') {
            //   this.$store.state.bot.orderTabActive = 'my'
            // }
          }, 500)
          if (txInfo?.errorLog) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            handleBotError(walletName + ' ' + txInfo?.errorLog, ElNotification)
            if (isError) {
              loadingSwap.value = false
              return
            }
          }

          const recordTxUrlObj = {
            solana: '/botapi/swap/createSolLimitTx',
            ton: '/botapi/swap/createTonLimitSwap',
          }

          recordTxV2({
            txInfo,
            chain: chain,
            destination: recordTxUrlObj?.[chain] || '/botapi/swap/createEvmLimitTx',
            type: 20
          })
          const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
            const _batchId = subscribeResult.batchId
            const txInfo1 = subscribeResult?.txList?.[0]
            if (_batchId?.includes(batchId) && txInfo.creatorAddress === txInfo1?.walletAddress) {
              if (Timer) {
                clearTimeout(Timer)
                Timer = null
              }
              tokenStore.placeOrderSuccess++
              if (txInfo1?.success) {
                ElNotification({ type: 'success', message: txInfo1?.walletName + ' ' + t('tradeSuccess') })
                updateTxV2({...txInfo1, chain: subscribeResult?.chain}, txInfo?.id || '')
              } else {
                const msg = formatBotError(txInfo1?.failMessage) || 'swap error'
                handleBotError(txInfo1?.walletName + ' ' + msg, ElNotification)
              }
              unwatch()
              loadingSwap.value = false
            }
          })
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error', ElNotification)
      loadingSwap.value = false
    })
  } else if (isEvmChain(chain)) {
    const selected = botSettingStore?.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore.botSettings?.[chain]?.selected || 's1'
    const botSettings = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.[selected]
    const mev = botSettings?.mev
    const slippage = botSettings?.slippage || 9
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSettings?.gas[0] : botSettings?.gas[1]
    const gasPrice = (settings?.customFee || gasTips?.[settings?.level as 0 | 1 | 2] || '3')
    const gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    const ft = isBuy ? tokenStore.swap.payToken : tokenStore.swap.token
    const tt = isBuy ? tokenStore.swap.token : tokenStore.swap.payToken
    const p = isPriceLimit.value ? priceLimit.value : formatDec(new BigNumber(priceLimit.value || 0).div(tokenStore.circulation || 1).toFixed(), 4)
    const batchId = Date.now().toString()
    const swapList = (botSwapStore?.botSwapSelectedWallets || [])?.map((i, k) => {
      const addr = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses?.find?.(k => k?.chain === chain)?.address
      const addresses = botStore.walletList?.find?.(j => j.evmAddress === i)?.addresses || []
      const balance = getAddressFromChainBalance(chain, addresses, isBuy ? native : (ft?.address || '')) || 0
      const inAmount = isBatchSell ? new BigNumber(balance || 0).times(amountSellTokenPercent.value || 0).div(100).times(10 ** (ft?.decimals || 0)).toFixed(0) : new BigNumber(amount || 0).times(10 ** (ft?.decimals || 0)).toFixed(0)
      return {
        batchId: batchId + String(k), // batchId + k,
        creatorAddress: addr || '',
        inAmount: inAmount,
      }
    })?.filter?.(i => Number(i?.inAmount) > 0 && i?.creatorAddress) || []
    const data = {
      // batchId: Date.now().toString(),
      chain: chain,
      swapList: swapList,
      inTokenAddress: isBuy ? native : (ft?.address || ''),
      outTokenAddress: isBuy ? (tt?.address || '') : native,
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
        const isError = res?.every?.((i: any) => hasCreateTxError(i))
        res?.forEach?.((txInfo: any) => {
          const walletName = botStore.walletList?.find?.(j => j?.addresses?.find?.(k => k?.chain === chain)?.address === txInfo?.creatorAddress?.toLowerCase?.())?.name || ''
          let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          tokenStore.placeOrderUpdate++
          if (txInfo?.creatorAddress?.toLowerCase() === walletAddress) {
            priceLimit.value = ''
          }
          ElNotification({ type: 'success', message: walletName + ' ' + t('limitSubmitted') })
          loadingSwap.value = false
          amountToken.value = ''
          amountSellTokenPercent.value = ''
          amountNative.value = ''
          amountTokenOut.value = ''
          amountNativeOut.value = ''
        }, 500)
        if (hasCreateTxError(txInfo)) {
          if (Timer) {
            clearTimeout(Timer)
            Timer = null
          }
          handleBotError(walletName + ' ' + getCreateTxErrorMsg(txInfo), ElNotification)
          if (isError) {
            loadingSwap.value = false
            return
          }
        }
        recordTxV2({
          txInfo,
          chain: chain,
          destination: '/botapi/swap/createEvmLimitTx',
          type: 20
        })
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const _batchId = subscribeResult.batchId
            const txInfo1 = subscribeResult?.txList?.[0]
            if (_batchId?.includes(batchId) && txInfo.creatorAddress === txInfo1?.walletAddress) {
              if (Timer) {
                clearTimeout(Timer)
                Timer = null
              }
              tokenStore.placeOrderSuccess++
              if (txInfo1?.success) {
                ElNotification({ type: 'success', message: txInfo1?.walletName + ' ' + t('tradeSuccess') })
                updateTxV2({...txInfo1, chain: subscribeResult?.chain}, txInfo?.id || '')
              } else {
                const msg = formatBotError(txInfo1?.failMessage) || 'swap error'
                handleBotError(txInfo1?.walletName + ' ' + msg, ElNotification)
              }
              unwatch()
              loadingSwap.value = false
            }
          })
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error', ElNotification)
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

// const autoSlippageObj = reactive<Record<string, number>>({})

// function getAutoSlippageParams() {
//   const routeParams = getAddressAndChainFromId(route.params.id as string)
//   const isBuy = props.activeTab === 'buy'
//   const chain = getChain()
//   const token = routeParams?.address || tokenStore.swap.token?.address || tokenStore.token?.token || ''
//   const selected = botSettingStore?.botSettings?.[chain]?.[props.activeTab]?.selected || botSettingStore?.botSettings?.[chain]?.selected || 's1'
//   const botSettings = botSettingStore.botSettings?.[chain]?.[props.activeTab]?.[selected]
//   const mev = botSettings?.mev
//   const query = {
//     chain: chain,
//     token: token,
//     mev: mev,
//     isBuy
//   }
//   return query
// }

// const autoSlippage = computed(() => {
//   const query = getAutoSlippageParams()
//   const key = query.chain + '-' + query.token + '-' + query.mev + '-' + query.isBuy
//   return autoSlippageObj[key]
// })

// const slippageObj = computed(() => {
//   const chain = getChain()
//   const slippage = botSettingStore.botSettings?.[chain]?.[botSettingStore.botSettings?.[chain]?.selected]?.slippage || 9
//   if (autoSlippage.value && slippage === 'auto') {
//     return {
//       slippage: autoSlippage.value,
//       autoSlippage: false
//     }
//   }
//   return {
//     slippage: slippage !== 'auto' ? Number(new BigNumber(slippage).times(100).toFixed(0)) : 900,
//     autoSlippage: slippage === 'auto'
//   }
// })

// let Timer_getAutoSlippage: any = null
// function _getAutoSlippage() {
//   const query = getAutoSlippageParams()
//   getAutoSlippage(query).then(res => {
//     if (res) {
//       console.log('getAutoSlippage', res)
//       const key = query.chain + '-' + query.token + '-' + query.mev + '-' + query.isBuy
//       autoSlippageObj[key] = res
//     }
//   }).finally(() => {
//     if (Timer_getAutoSlippage) {
//       clearTimeout(Timer_getAutoSlippage)
//       Timer_getAutoSlippage = null
//     }
//     Timer_getAutoSlippage = setTimeout(() => {
//       _getAutoSlippage()
//     }, 50000)
//   })
// }


watch(() => tokenStore.token?.token || '', (val) => {
  if (val) {
    getGasPrice()
    // if (props.activeTab === 'sell') {
    //   _getAllowance()
    // }
    amountToken.value = ''
    amountSellTokenPercent.value = ''
    amountNative.value = ''
    amountTokenOut.value = ''
    amountNativeOut.value = ''
    watchAmount2(props.activeTab)
  }
})

// watch(() => tokenStore.swap.payToken?.address, (val) => {
//   if (val) {
//     _getAllowance()
//   }
// })

// watch(walletAddress, (val) => {
//   if (val && props.activeTab === 'sell') {
//     _getAllowance()
//   }
// })

watch(() => props.activeTab, (val) => {
  amountToken.value = ''
  amountSellTokenPercent.value = ''
  amountNative.value = ''
  amountTokenOut.value = ''
  amountNativeOut.value = ''
  // if (val === 'sell') {
  //   _getAllowance()
  // }
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

const editMode = ref(false)
const editMode2 = ref(false)
function handleEdit(value: Ref<Array<{value: string}>>,type: string) {
  editMode.value = !editMode.value
  const botSetting = (botSettingStore?.botSettings?.[chain.value]?.buy || {}) as typeof botSettingStore.botSettings.solana
  botSettingStore.botSettings[chain.value][type][botSetting?.selected || 's1'].buyValueList = value.map(el=>el.value)
}

function handleEdit2(value: Ref<Array<{value: string}>>,type: string) {
  console.log('handleEdit2',value,type)
  editMode2.value = !editMode2.value
  const botSetting = (botSettingStore?.botSettings?.[chain.value]?.sell || {}) as typeof botSettingStore.botSettings.solana
  botSettingStore.botSettings[chain.value][type][botSetting?.selected || 's1'].sellPerList = value.map(el=>el.value *100)
}

// Formatter: 0-1 转换为百分比显示（带%）
const formatter = (value: string | number): string => {
  console.log('formatter', value)
  if (!value && value !== 0) {
    return ''
  }
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(numValue)) {
    return ''
  }
  return `${Math.round(numValue * 100)}`
}

const parser = (value: string) => {
  console.log('parser', value)
  if (!value) {
    return ''
  }
  const cleanValue = value.trim()
  const numValue = parseFloat(cleanValue)
  
  if (isNaN(numValue)) {
    return ''
  }

  return `${numValue/100}`
}
// 使用 defineExpose 暴露方法
defineExpose({
  handleMax,
  totalSelectWalletBalance,
  totalSelectWalletBalance1
});
// 生命周期钩子
onMounted(() => {
  initPriceLimit()
  getGasPrice()
  // _getAutoSlippage()
  // if (props.activeTab === 'sell') {
  //   _getAllowance()
  // }
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
      // padding: 7px 0;
      line-height: 26px;
      justify-content: center;
      align-items: center;
      flex: 1;
      border-radius: 4px;
      background: var(--main-input-button-bg);
      cursor: pointer;
      color: var(--secondary-text);
      & + .tab-item {
        margin-left: 1px;
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
        background: var(--border);
        color: var(--main-text);
      }
      &:active {
        opacity: 0.5;
      }
    }
  }
  .input-number {
    --el-fill-color-light: var(--main-input-button-bg);
    --el-input-bg-color: var(--main-input-button-bg);
    --el-input-border-color: transparent;
    --el-input-focus-border-color: transparent;
    --el-input-hover-border-color: transparent;
    // --el-input-bg-color: transparent;
    font-size: 18px;
    font-weight: 500;
    :deep() .el-input-group__append, .el-input-group__prepend {
      padding: 0 10px;
    }
    :deep() .el-input-group__prepend {
      // --el-fill-color-light: var(--border);
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
    // --el-button-text-color: var(--main-text) !important;
    // --el-button-hover-text-color: var(--main-text) !important;
    --el-color-black: #F5F5F5;
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
        color: var(--main-text);
      }
    }
    .swap-label_item-left {
      display: flex;
      align-items: center;
      color: var(--third-text);
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
        color: var(--secondary-text);
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
        color: var(--third-text);
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

  .arrow-up {
    font-size: 16px;
    transition: all 0.2s linear;
    color: var(--secondary-text);
    &.active {
      transform: rotate(180deg);
    }
  }
</style>
