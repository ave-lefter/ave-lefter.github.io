<template>
  <button v-show="botStore.isSupportChains?.includes(chain)" class="one-click-btn clickable" :class="{ 'active': visible }" @keyup.prevent @keydown.enter.prevent @click.stop="visible = !visible">
    <Icon name="ion:flash" />
    <span class="ml-5px">{{ $t('oneClick') }}</span>
  </button>
  <Teleport to="body">
    <div v-show="botStore.isSupportChains?.includes(chain) && visible && isMounted" class="fixed-one-click flex flex-col" :style="fixedOneClickStyle">
      <template v-if="botStore.isSupportChains?.includes(chain) && visible">
        <div class="flex-between">
          <div class="flex-start">
            <!-- <span>{{ $t('oneClick') }}</span> -->
            <Icon :key="isEnableHotkey" v-tooltip="isEnableHotkey ? $t('hotkeyTips') : $t('hotkeyTips1')" class="text-14px color-[--secondary-text] clickable" :class="{ 'color-[--primary-color]!': isEnableHotkey }" name="ri:keyboard-box-fill" @click.stop="isEnableHotkey = !isEnableHotkey" @mousedown.stop />
            <Icon :key="isEnablePnL" v-tooltip="isEnablePnL ? $t('enablePnLTips2') : $t('enablePnLTips1')" name="bx:bxs-bar-chart-alt-2" class="text-14px color-[--secondary-text] clickable ml-5px" :class="{ 'color-[--primary-color]!': isEnablePnL }" @mousedown.stop @click.stop="isEnablePnL = !isEnablePnL" />
            <Icon :key="isEnableShowsReflected" v-tooltip="isEnableShowsReflected ? $t('disableShowsReflected') : $t('enableShowsReflected')" name="ph:approximate-equals-bold" class="text-14px color-[--secondary-text] clickable ml-5px" :class="{ 'color-[--primary-color]!': isEnableShowsReflected }" @mousedown.stop @click.stop="isEnableShowsReflected = !isEnableShowsReflected" />
            <Icon v-if="!isEdit" name="fe:edit" class="text-14px color-[--secondary-text] clickable ml-5px" @click.stop="isEdit=true" @mousedown.stop />
            <Icon v-else name="ic:baseline-check" class="text-14px color-[--secondary-text] clickable ml-5px" @click.stop="isEdit=false" @mousedown.stop />
          </div>
          <SlippageSetMarket class="mr-10px ml-auto" :chain="chain" @mousedown.stop />
          <Icon
            class="text-14px clickable color-[--main-text] clickable" name="ri:close-large-fill"
            @click.stop="visible = false" @mousedown.stop />
        </div>
        <el-divider class="b-t-color-[--dialog-divider]! mt-10px! mb-5px!" />
        <div class="content flex-1 flex flex-col">
          <div class="flex-between mt-10px">
            <span>{{ $t('buy') }}</span>
            <div class="tabs-1 ml-5px mr-auto">
              <button
                v-for="item in BotSettingsArr" :key="item.value"
                :class="{ 'active': item.value === botSettings?.[chain]?.buy?.selected }" type="button" @mousedown.stop
                @click.stop="botSettings[chain]!.buy!.selected = item.value">{{ item.label }}</button>
            </div>
            <span v-if="isEnableShowsReflected && Number(estimateBuyAmount) > 0" class="mr-5px">≈{{ formatNumber(estimateBuyAmount, 3) }} {{ tokenStore.swap.token?.symbol || tokenStore.token?.symbol || '' }}</span>
            <span class="color-[--secondary-text]">{{ $t('balance1') }}: {{ formatNumber(tokenStore.swap.native?.balance || 0)
              }}&nbsp;{{ getChainInfo(chain)?.main_name }}</span>
            <RefreshBalance class="color-[--secondary-text]" :type="0" @mousedown.stop />
          </div>
          <div v-if="!isEdit" class="mt-10px tabs flex-1 flex-wrap" @mousedown.stop>
            <el-button
              v-for="(item, $index) in buyValueList"
              :key="$index" class="one-click-button green clickable" :class="{ 'active': isCanKeySwap && isEnableHotkey }" :style="{height: isShow8 ? 'calc(50% - 4px)' : '100%'}" :loading="loadingSwapBuy[$index]"
              :disabled="loadingSwapBuy[$index]" @click.stop.prevent="submitBotSwap(item, 'buy', $index)" @mousedown.stop @mouseover.stop="hoverBuyAmount = item" @mouseleave.stop="hoverBuyAmount = ''"
            >{{ !loadingSwapBuy[$index] ? item : '' }}</el-button>
          </div>
          <ul v-else class="mt-10px tabs flex-1 flex-wrap" @mousedown.stop>
            <li v-for="(item, index) in buyValueList" :key="index" class="w-[calc((100%-30px)/4)]"  :style="{height: isShow8 ? 'calc(50% - 4px)' : '100%'}">
              <el-input
                v-model="botSettings![chain]!.buy![botSettings?.[chain]?.buy.selected || 's1'].buyValueList[index]"
                class="input-number h-full"
                inputmode="decimal"
                placeholder="0.0"
                @input="(value) => handleBuyValue(value, index)"
                @blur="handleBlurBuyValue(index)"
              />
            </li>
          </ul>
          <BottomSetting activeTab="buy" :gasPrice="tokenStore.gasPrice" @mousedown.stop />
          <el-divider class="b-t-color-[--dialog-divider]! mt-10px! mb-5px!" />
          <div class="flex-between mt-10px">
            <span>{{ $t('sell') }}</span>
            <div class="tabs-1 ml-5px mr-auto">
              <button
                v-for="item in BotSettingsArr" :key="item.value"
                :class="{ 'active': item.value === botSettings?.[chain]?.sell?.selected }" type="button" @mousedown.stop
                @click.stop="botSettings[chain]!.sell!.selected = item.value">{{ item.label }}</button>
            </div>
            <span v-if="isEnableShowsReflected && Number(estimateSellAmount) > 0" class="mr-5px">≈{{ formatNumber(estimateSellAmount, 3) }} {{ getChainInfo(chain)?.main_name || '' }}</span>
            <span class="color-[--secondary-text]">{{ $t('balance1') }}: {{ formatNumber(tokenStore.swap.token?.balance || 0)
              }}&nbsp;{{ tokenStore.token?.symbol || '' }}</span>
            <RefreshBalance class="color-[--secondary-text]" :type="1" @mousedown.stop />
          </div>
          <div v-if="!isEdit" class="mt-10px tabs flex-1 flex-wrap">
            <el-button
              v-for="(item, $index) in sellPerList"
              :key="$index" class="one-click-button red clickable" :class="{ 'active': isCanKeySwap && isEnableHotkey }" :loading="loadingSwapSell[$index]" :style="{height: isShow8 ? 'calc(50% - 4px)' : '100%'}"
              :disabled="loadingSwapSell[$index]" @click.stop.prevent="handleSellAmount(item, $index)" @mousedown.stop @mouseover.stop="hoverSellAmount = item" @mouseleave.stop="hoverSellAmount = ''"
            >{{ !loadingSwapSell[$index] ? item + '%' : '' }}</el-button>
          </div>
          <ul v-else class="mt-10px tabs flex-1 flex-wrap" @mousedown.stop>
            <li v-for="(item, index) in buyValueList" :key="index" class="w-[calc((100%-30px)/4)]"  :style="{height: isShow8 ? 'calc(50% - 4px)' : '100%'}">
              <el-input
                v-model="botSettings[chain].sell[botSettings?.[chain]?.sell.selected || 's1'].sellPerList[index]"
                class="input-number h-full"
                inputmode="decimal"
                placeholder="0"
                @input="(value) => handlePer(value, index)"
              >
                <template #suffix>
                  <span class="color-text-1">%</span>
                </template>
              </el-input>
            </li>
          </ul>

          <BottomSetting activeTab="sell" :gasPrice="tokenStore.gasPrice" @mousedown.stop>
            <button v-if="!isCanSellInits" class="bg-[--border] color-[--third-text] border-none px-5px py-2px text-11px ml-auto rd-2px cursor-not-allowed" disabled>{{ $t('sellInits') }}</button>
            <button v-else class="bg-[#F6465D1A] color-[--down-color] border-none px-5px py-2px text-11px ml-auto clickable rd-2px flex items-center flex-nowrap " @click.stop="sellInits">
              <i v-if="loadingSwapSell[20]" class="el-icon is-loading mr-2px">
                <Loading />
              </i>
              <span>{{ $t('sellInits') }}</span>
            </button>
          </BottomSetting>
        </div>

        <Holding v-show="isEnablePnL" v-model:walletTokenInfo="walletTokenInfo" isForceShow class="b-t-solid b-t-1px b-color-[--dialog-divider] mt-10px rd-0! pb-0! mb-0! gap-8px bg-transparent!" />
        <!-- 拖拽放大手柄：下、右、上、左、四角斜向 -->
        <div class="resize-handle resize-handle-b" @mousedown.stop="e => onResizeMouseDown(e, 'b')"/>
        <div class="resize-handle resize-handle-r" @mousedown.stop="e => onResizeMouseDown(e, 'r')"/>
        <div class="resize-handle resize-handle-t" @mousedown.stop="e => onResizeMouseDown(e, 't')"/>
        <div class="resize-handle resize-handle-l" @mousedown.stop="e => onResizeMouseDown(e, 'l')"/>
        <div class="resize-handle resize-handle-tl" @mousedown.stop="e => onResizeMouseDown(e, 'tl')"/>
        <div class="resize-handle resize-handle-tr" @mousedown.stop="e => onResizeMouseDown(e, 'tr')"/>
        <div class="resize-handle resize-handle-bl" @mousedown.stop="e => onResizeMouseDown(e, 'bl')"/>
        <div class="resize-handle resize-handle-br" @mousedown.stop="e => onResizeMouseDown(e, 'br')"/>
      </template>
    </div>
  </Teleport>

</template>

<script setup lang='ts'>
import { formatNumber } from '@/utils/formatNumber'
import { getChainInfo, isEvmChain, formatUnits } from '@/utils'
import { useLocalStorage, useEventListener } from '@vueuse/core'
import { ElNotification } from 'element-plus'
import BigNumber from 'bignumber.js'
import { NATIVE_TOKEN } from '@/utils/constants'
import { formatBotGasTips, hasCreateTxError, getCreateTxErrorMsg, handleBotError } from '@/utils/bot'
import { useBotSwap } from '~/composables/botSwap'
import { bot_createSolTx, bot_createSwapEvmTx, bot_createSwapTonTx } from '@/api/bot'
import RefreshBalance from './refreshBalance.vue'
import SlippageSetMarket from './slippageSetMarket.vue'
import type { BotChain, BotSettingKey } from '~/utils/types'
import { recordTxV2, updateTxV2 } from '~/api/tracking'
import Holding from './holding.vue'
import BottomSetting from './bottomSetting.vue'
import { useTransactionPrompt } from '@/composables/useTransactionPrompt'
import type { WalletTokenInfo } from '~/api/types/token'
import { Loading } from '@element-plus/icons-vue'
import ConfirmSellAll from './confirmSellAll.vue'

const botStore = useBotStore()
const tokenStore = useTokenStore()
const botSettingStore = useBotSettingStore()
const botSwapStore = useBotSwapStore()
const { botSettings } = storeToRefs(botSettingStore)
const wsStore = useWSStore()
const route = useRoute()
const { t } = useI18n()
const { executing } = useTransactionPrompt()
const loadingSwapBuy = ref([false, false, false, false, false])
const loadingSwapSell = ref([false, false, false, false, false])

const visible = useLocalStorage('oneClickVisible', false)

const isCanKeySwap = ref(false)
const isEnableHotkey = useLocalStorage('isEnableHotkey', false)

const isEnablePnL = useLocalStorage('isEnablePnL', true)
const isEnableShowsReflected = useLocalStorage('isEnableShowsReflected', false)

const { getTokenBalance, updateBalanceFromWs } = useBotSwap()

const chain = computed(() => {
  return (getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain) as BotChain
})


function getChain() {
  return ((getAddressAndChainFromId(route.params?.id as string)?.chain || tokenStore.token?.chain) || '') as BotChain
}

const nativePrice = computed(() => {
  const chain = getChain()
  return botSwapStore.mainTokensPrice?.find(item => item.chain === chain && item.token === getChainInfo(chain)?.wmain_wrapper)?.current_price_usd || tokenStore.swap.native.price || 0
})

const tokenPrice = computed(() => {
  return tokenStore.price || tokenStore.swap.token?.price || 0
})

const walletTokenInfo = ref<WalletTokenInfo | null>(null)

const isCanSellInits = computed(() => {
  if (!walletTokenInfo.value) return false
  const hasPosition = new BigNumber(Number(tokenStore.swap.token?.balance) || Number(walletTokenInfo.value?.balance_amount) || 0).gt(0)
  // 买入成本 > 卖出收益
  // const isUnrealizedProfitGt0 = new BigNumber(walletTokenInfo.value?.unrealized_profit || 0).gt(0)
  const buyCost = new BigNumber(Number(walletTokenInfo.value?.total_purchase_usd) || 0).minus(new BigNumber(Number(walletTokenInfo.value?.total_sold_usd) || 0))
  return hasPosition && buyCost.gt(0.001)
})

function sellInits() {
  if (!botStore.userInfo?.evmAddress || !botStore.accessToken) {
    botStore.changeConnectVisible(true)
    return
  }
  if (isCanSellInits.value) {
    const fromToken = tokenStore.swap.token
    const holding = new BigNumber(fromToken?.balance || Number(walletTokenInfo.value?.balance_amount) || 0)
    const buyCost = new BigNumber(Number(walletTokenInfo.value?.total_purchase_usd) || 0).minus(new BigNumber(Number(walletTokenInfo.value?.total_sold_usd) || 0))
    const price = tokenPrice.value
    let sellAmount = buyCost.div(price)
    if (sellAmount.gt(holding)) {
      sellAmount = holding
      const { $dialog } = useNuxtApp()
      $dialog.show({
        content: {
          is: ConfirmSellAll,
          props: {
            'onSuccess': () => {
              $dialog.hide()
              submitBotSwap(sellAmount.toFixed(), 'sell', 20)
            },
            'onCancel': () => {
              $dialog.hide()
            },
          }
        },
        props: {
          width: '420px',
          class: 'perp-dialog',
          title: t('soldAll'),
          'onOpened': () => {
            console.log('open')
          },
          'onClosed': () => {
            console.log('close')
          }
        }
      })
      return
    }

    submitBotSwap(sellAmount.toFixed(), 'sell', 20)
  }
}

const hoverBuyAmount = ref('')

const hoverSellAmount = ref('')


const estimateBuyAmount = computed(() => {
  return new BigNumber(hoverBuyAmount.value || 0).times(nativePrice.value).div(tokenPrice.value).toFixed()
})

const estimateSellAmount = computed(() => {
  return new BigNumber(hoverSellAmount.value || 0).times(tokenStore.swap.token?.balance || 0).times(tokenPrice.value).div(nativePrice.value).div(100).toFixed()
})


function addSpaceKeyDownEvent() {
  useEventListener(document, 'keydown', (e) => {
    if (e.code === 'Space') {
      isCanKeySwap.value = true
    }
  })
  useEventListener(document, 'keyup', (e) => {
    if (e.code === 'Space') {
      isCanKeySwap.value = false
    }
  })
  useEventListener(document, 'keydown', e => {
    if (isCanKeySwap.value && isEnableHotkey.value) {
      const index = ['q', 'w', 'e', 'r'].indexOf(e.key)
      if (index >= 0) {
        const botSettings = botSettingStore.botSettings?.[chain.value]?.buy
        const selected = botSettings?.selected || 's1'
        const buyValue = botSettings?.[selected]?.buyValueList[index]
        submitBotSwap(buyValue || '', 'buy', index)
      }
      const index2 = ['a', 's', 'd', 'f'].indexOf(e.key)
      if (index2 >= 0) {
        const botSettings = botSettingStore.botSettings?.[chain.value]?.sell
        const selected = botSettings?.selected || 's1'
        const sellPer = botSettings?.[selected]?.sellPerList[index2]
        // const tokenBalance = tokenStore.swap.token.balance || 0
        // const sellAmount = BigNumber(tokenBalance).times(sellPer || 0).div(100).toFixed()
        // submitBotSwap(sellAmount || '', 'sell', index2)
        handleSellAmount(sellPer || '', index2)
      }
    }
  })
}



async function submitBotSwap(amount1: string | number, type: 'buy' | 'sell', index = 0) {
  if (!botStore.userInfo?.evmAddress || !botStore.accessToken) {
    botStore.changeConnectVisible(true)
    return
  }
  const isBuy = type == 'buy' ? true : false
  if (isBuy) {
    if (loadingSwapBuy.value?.some(i => i)) {
      return
    }
  } else {
    if (loadingSwapSell.value?.some(i => i)) {
      return
    }
  }
  if (new BigNumber(amount1 || 0).lte(0)) {
    ElNotification({ title: 'Error', type: 'error', message: t('amountMustG0') })
    return
  }
  const fromToken = isBuy ? tokenStore.swap.native : tokenStore.swap.token
  const toToken = isBuy ? tokenStore.swap.token : tokenStore.swap.native
  const amount = (new BigNumber(amount1 || 0)).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromToken?.decimals || 18}})?`))?.[0] || ''
  if ((Number(amount) || 0) <= 0) {
    ElNotification({ title: 'Error', type: 'error', message: t('amountTooSmall') })
    return
  }
  if (new BigNumber(amount || 0).gt(fromToken?.balance || 0)) {
    ElNotification({ title: 'Error', type: 'error', message: t('insufficientBalance') })
    return
  }
  if (isBuy) {
    loadingSwapBuy.value[index] = true
  } else {
    loadingSwapSell.value[index] = true
  }
  const chain = getChain()
  const promptCreatorAddress = botStore.getWalletAddress?.(chain) || botStore.evmAddress || ''
  const promptStartTime = Date.now()
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
  const promptHandle = executing({
    avatarAddress: promptCreatorAddress,
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
    const fromAmountDisplay = txInfo1?.fromAmount ? formatUnits(txInfo1.fromAmount, fromToken?.decimals || 0) : amount
    const toAmountDisplay = txInfo1?.outputAmount ? formatUnits(txInfo1.outputAmount, toToken?.decimals || 0) : ''
    promptHandle.success({
      chain: chain,
      txHash: txInfo1?.txHash || txInfo1?.hash || '',
      elapsedSec,
      isBuy,
      fromSymbol: fromToken?.symbol || '',
      fromAmount: fromAmountDisplay,
      toSymbol: toToken?.symbol || '',
      toAmount: toAmountDisplay,
      avatarAddress: promptCreatorAddress,
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
  const native = chainMainToken?.[chain] || NATIVE_TOKEN
  const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
  if (chain === 'solana' || chain === 'ton') {
    const botSettings = botSettingStore.botSettings?.[chain]?.[type]
    const selected = botSettings?.selected as BotSettingKey
    const botSetting = botSettings?.[selected]
    const mev = botSetting?.mev
    const slippage = botSetting?.slippage || '9'
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSetting?.gas[0] : botSetting?.gas[1]
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    const botPriorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
    const batchId = Date.now().toString()
    const data = {
      swapList: [{
        batchId,
        creatorAddress: walletAddress || '',
        inAmount: new BigNumber(amount || 0).times(10 ** (fromToken?.decimals || 0)).toFixed(0),
      }],
      inTokenAddress: (isBuy ? native : fromToken.address) || '',
      outTokenAddress: (isBuy ? toToken.address : native) || '',
      swapType: (isBuy ? 1 : 2) as 1 | 2,
      isPrivate: mev || false,
      priorityFee: botPriorityFee, // botPriorityFee
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage || '9').times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto',
      autoSell: isBuy ? botSettingStore.autoSellConfig_autoSell || false : false,
      autoSellConfig: botSettingStore?.selectedAutoSellConfig,
      autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellPriorityFee: botPriorityFee
    }
    const bot_createTx = {
      solana: bot_createSolTx,
      ton: bot_createSwapTonTx
    }
    bot_createTx[chain](data).then(res => {
      if (res) {
        let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          // this.$store.state.bot.historyUpdate++
          // ElNotification({ type: 'success', message: t('transactionsSubmitted') })
          // if (!['myBotHistory', 'myBotPosition']?.includes(this.$store.state.tabActive)) {
          //   this.$store.state.tabActive = 'myBotHistory'
          // }
          if (isBuy) {
            loadingSwapBuy.value[index] = false
          } else {
            loadingSwapSell.value[index] = false
          }
        }, 500)
        const txInfo: any = res?.[0] || {}
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
        const batchIdObj = {
          [txInfo?.batchId]: txInfo?.id
        }
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const _batchId = subscribeResult.batchId
          if (_batchId === batchId) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            tokenStore.placeOrderSuccess++
            if (subscribeResult?.txList?.[0]?.success) {
              const txInfo = subscribeResult?.txList?.[0]
              updateTxV2({...txInfo, chain: subscribeResult?.chain}, batchIdObj?.[_batchId] || '')
              const _amount = isBuy ? new BigNumber(txInfo?.outAmount || 0).shiftedBy(-1 * (txInfo?.outDecimals || txInfo?.outTokenDecimals || 0)).toFixed() : new BigNumber(txInfo?.inAmount || 0).shiftedBy(-1 * (txInfo?.inDecimals || txInfo?.inTokenDecimals || 0)).toFixed()
              updateWalletTokenInfo(_amount, isBuy)
              finishPromptSuccess(txInfo)
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              finishPromptFail()
            }
            unwatch()
            if (isBuy) {
              loadingSwapBuy.value[index] = false
            } else {
              loadingSwapSell.value[index] = false
            }
          }
          setTimeout(() => {
            getTokenBalance()
          }, 1000)
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      finishPromptFail()
      if (isBuy) {
        loadingSwapBuy.value[index] = false
      } else {
        loadingSwapSell.value[index] = false
      }
    })
  } else if (isEvmChain(chain)) {
    const botSettings = botSettingStore.botSettings?.[chain]?.[type]
    const selected = botSettings?.selected as BotSettingKey
    const botSetting = botSettings?.[selected]
    const mev = botSetting?.mev
    const slippage = botSetting?.slippage || '9'
    const { gasTip1List, gasTip2List } = formatBotGasTips(botSwapStore.gasTip, chain)
    const gasTips = mev ? gasTip1List : gasTip2List
    const settings = mev ? botSetting?.gas[0] : botSetting?.gas[1]
    const gasPrice = settings?.customFee == '0' ? '0' : (settings?.customFee || gasTips?.[settings?.level || 0] || '3')
    const gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    const batchId = Date.now().toString()
    const data = {
      chain: chain,
      swapList: [{
        batchId,
        creatorAddress: walletAddress || '',
        inAmount: new BigNumber(amount || 0).times(10 ** (fromToken?.decimals || 0)).toFixed(0),
      }],
      inTokenAddress: (isBuy ? native : fromToken.address) || '',
      outTokenAddress: (isBuy ? toToken.address : native) || '',
      swapType: (isBuy ? 1 : 2) as 1 | 2,
      contractType: 0 as 0 | 1,
      isPrivate: mev || false,
      gasTip: gasTip,
      preApprove: true,
      slippage: slippage !== 'auto' ? Number(new BigNumber(slippage || '9').times(100).toFixed(0)) : 900,
      autoSlippage: slippage === 'auto',
      autoSell: isBuy ? botSettingStore.autoSellConfig_autoSell || false : false,
      autoSellConfig: botSettingStore?.selectedAutoSellConfig,
      autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
      autoSellPriorityFee: gasTip
    }
    bot_createSwapEvmTx(data).then(res => {
      if (res) {
        const txInfo: any = res?.[0] || {}
        if (hasCreateTxError(txInfo)) {
          const walletName = botStore.walletList?.find?.(j => j?.evmAddress?.toLowerCase?.() === txInfo?.creatorAddress?.toLowerCase?.())?.name || ''
          handleBotError(walletName ? walletName + ' ' + getCreateTxErrorMsg(txInfo) : getCreateTxErrorMsg(txInfo))
          finishPromptFail()
          if (isBuy) {
            loadingSwapBuy.value[index] = false
          } else {
            loadingSwapSell.value[index] = false
          }
          return
        }
        let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
          // this.$store.state.bot.historyUpdate++
          // ElNotification({ type: 'success', message: t('transactionsSubmitted') })
          // if (!['myBotHistory', 'myBotPosition']?.includes(this.$store.state.tabActive)) {
          //   this.$store.state.tabActive = 'myBotHistory'
          // }
          if (isBuy) {
            loadingSwapBuy.value[index] = false
          } else {
            loadingSwapSell.value[index] = false
          }
          // this.dialogVisibleSwap = false
        }, 500)
        recordTxV2({
          txInfo,
          chain: chain,
          destination: '/botapi/swap/createSwapEvmTx',
          type: 10
        })
        const batchIdObj = {
          [txInfo?.batchId]: txInfo?.id
        }
        const unwatch = watch(() => wsStore?.wsResult.tgbot, (subscribeResult) => {
          const _batchId = subscribeResult.batchId
           console.log('subscribeResult', subscribeResult, batchId, _batchId)
          if (_batchId === batchId) {
            if (Timer) {
              clearTimeout(Timer)
              Timer = null
            }
            tokenStore.placeOrderSuccess++
            if (subscribeResult?.txList?.[0]?.success) {
              unwatch()
              const txInfo = subscribeResult?.txList?.[0]
              updateTxV2({...txInfo, chain: subscribeResult?.chain}, batchIdObj?.[_batchId] || '')
              const _amount = isBuy ? new BigNumber(txInfo?.outAmount || txInfo?.outputAmount || 0).shiftedBy(-1 * (toToken?.decimals || 0)).toFixed() : amount
              updateWalletTokenInfo(_amount, isBuy)
              updateBalanceFromWs({
                chain: data.chain,
                inTokenAddress: data.inTokenAddress,
                outTokenAddress: data.outTokenAddress,
                ...txInfo
              })
              finishPromptSuccess(txInfo)
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              unwatch()
              finishPromptFail()
            }
            if (isBuy) {
              loadingSwapBuy.value[index] = false
            } else {
              loadingSwapSell.value[index] = false
            }
          }
          setTimeout(() => {
            getTokenBalance()
          }, 1000)
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      finishPromptFail()
      if (isBuy) {
        loadingSwapBuy.value[index] = false
      } else {
        loadingSwapSell.value[index] = false
      }
    })
  }
}

function updateWalletTokenInfo(amount: string, isBuy: boolean) {
  if (walletTokenInfo.value === null) {
    walletTokenInfo.value = {
      balance_amount: '0',
      balance_usd: '0',
      total_purchase_usd: '0',
      total_sold_usd: '0',
      total_profit: '0',
      total_profit_ratio: '0'
    } as any
  }
  console.log('updateWalletTokenInfo', amount, isBuy, walletTokenInfo.value)
  if (isBuy) {
    walletTokenInfo.value = {
      ...walletTokenInfo.value,
      balance_amount: new BigNumber(Number(walletTokenInfo.value?.balance_amount) || 0).plus(amount || 0).toFixed(),
      total_purchase_usd: new BigNumber(Number(walletTokenInfo.value?.total_purchase_usd) || 0).plus(new BigNumber(amount || 0).times(tokenPrice.value)).toFixed(),
    }
  } else {
    let balance_amount = new BigNumber(Number(tokenStore.swap?.token?.balance) || Number(walletTokenInfo.value?.balance_amount) || 0).minus(amount || 0)
    if (balance_amount.lt(0)) {
      balance_amount = new BigNumber(0)
    }
    walletTokenInfo.value = {
      ...walletTokenInfo.value,
      balance_amount: balance_amount.toFixed(),
      total_sold_usd: new BigNumber(Number(walletTokenInfo.value?.total_sold_usd) || 0).plus(new BigNumber(amount || 0).times(tokenPrice.value)).toFixed()
    }
  }
}

async function handleSellAmount(item: string, index: number) {
  if (!botStore.userInfo?.evmAddress || !botStore.accessToken) {
    botStore.changeConnectVisible(true)
    return
  }
  const p = new BigNumber(item).div(100).toFixed()
  const token = tokenStore.swap.token
  let amount: string | number = token.balance || 0
  if (p) {
    const decimals = token.decimals || 0
    amount = new BigNumber(amount).times(p).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals}})?`))?.[0] || ''
    if (Number(amount) === 0) {
      amount = ''
    }
  } else {
    amount = ''
  }
  amount = Number(amount) < 0 ? 0 : amount
  if (loadingSwapSell.value?.some(i => i)) {
    return
  }
  // const chain = getChain()
  // const chainMainToken: Record<string, string> = {
  //   solana: 'sol',
  //   ton: 'TON',
  // }
  // const native = chainMainToken?.[chain] || NATIVE_TOKEN
  // const walletAddress = botStore.userInfo?.addresses?.find?.(i => i?.chain === chain)?.address
  // loadingSwapSell.value[index] = true
  // await checkApproveAndApprove({
  //   inToken: token.address,
  //   outToken: native,
  //   chain: chain,
  //   owner: walletAddress
  // }).finally(() => {
  //   loadingSwapSell.value[index] = false
  // })
  submitBotSwap(amount, 'sell', index)
}

let mousemoveEvent: ((e: MouseEvent) => void) | null = null
let mouseupEvent: (() => void) | null = null
let maskElement: HTMLDivElement | null = null // 存为全局引用以便清理

const isMounted = ref(false)
// 拖拽放大相关
const minHeight = 327
const maxHeight = 800
const minWidth = 360
const maxWidth = 900
const defaultHeight = 327
const defaultWidth = 360
const dialogHeight = ref<number>(Number(localStorage.getItem('fixed-one-click-height')) || defaultHeight)
const dialogWidth = ref<number>(Number(localStorage.getItem('fixed-one-click-width')) || defaultWidth)
const fixedOneClickStyle = computed(() => ({
  height: dialogHeight.value + 'px',
  width: dialogWidth.value + 'px',
}))

const isShow8 = computed(() => {
  return dialogHeight.value >= 420
})

const buyValueList = computed(() => {
  const chain = getChain()
  const botSettings = botSettingStore.botSettings
  const _buyValueList = botSettings?.[chain]?.buy![botSettings?.[chain]?.buy?.selected || 's1']?.buyValueList
  return isShow8.value ? _buyValueList : _buyValueList?.slice(0, 4) || []
})

const sellPerList = computed(() => {
  const chain = getChain()
  const botSettings = botSettingStore.botSettings
  const _sellPerList = botSettings?.[chain]?.sell![botSettings?.[chain]?.sell?.selected || 's1']?.sellPerList
  return isShow8.value ? _sellPerList : _sellPerList?.slice(0, 4) || []
})

// 拖拽放大事件，direction: 'b'下, 'r'右, 't'上, 'l'左, 'tl'左上, 'tr'右上, 'bl'左下, 'br'右下
function onResizeMouseDown(e: MouseEvent, direction: 'b'|'r'|'t'|'l'|'tl'|'tr'|'bl'|'br') {
  e.preventDefault()

  const startY = e.clientY
  const startX = e.clientX
  const startHeight = dialogHeight.value
  const startWidth = dialogWidth.value
  const el = document.querySelector('.fixed-one-click') as HTMLElement
  const startTop = parseInt(el?.style.top || '210', 10)
  const startLeft = parseInt(el?.style.left || '350', 10)

  // 1. 用于 rAF 节流的变量
  let rafId: number | null = null

  function onMouseMove(ev: MouseEvent) {
    // 如果已经在等待下一帧，则不再触发
    if (rafId) return

    rafId = requestAnimationFrame(() => {
      rafId = null // 执行后重置

      if (document.getElementById('tv_chart_container')) {
        document.getElementById('tv_chart_container')!.style.pointerEvents = 'none'
      }

      const deltaX = ev.clientX - startX
      const deltaY = ev.clientY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newTop = startTop
      let newLeft = startLeft

      // --- 计算逻辑 ---
      if (direction.includes('r')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX))
      }
      if (direction.includes('l')) {
        newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth - deltaX))
        // 修正：只有当宽度未达到极限时才允许移动坐标，或者使用计算后的 width 反推 left
        newLeft = startLeft + (startWidth - newWidth)
      }
      if (direction.includes('b')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY))
      }
      if (direction.includes('t')) {
        newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight - deltaY))
        newTop = startTop + (startHeight - newHeight)
      }

      // --- 统一更新 DOM 和 状态 ---
      if (newWidth !== dialogWidth.value) {
        dialogWidth.value = newWidth
        if (direction.includes('l') && el) el.style.left = `${newLeft}px`
      }
      if (newHeight !== dialogHeight.value) {
        dialogHeight.value = newHeight
        if (direction.includes('t') && el) el.style.top = `${newTop}px`
      }
    })
  }

  function onMouseUp() {
    // 2. 清理：取消可能存在的未执行任务
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    if (document.getElementById('tv_chart_container')) {
      document.getElementById('tv_chart_container')!.style.pointerEvents = 'auto'
    }

    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    localStorage.setItem('fixed-one-click-height', String(dialogHeight.value))
    localStorage.setItem('fixed-one-click-width', String(dialogWidth.value))
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function enableDragScroll() {
  const label = document.querySelector('.fixed-one-click') as HTMLElement
  if (!label) return

  const savedPos = localStorage.getItem('fixed-one-click-position')
  const initialOffset = savedPos ? JSON.parse(savedPos) : { x: 0, y: 0 }

  let currentX = initialOffset.x
  let currentY = initialOffset.y
  let startX = 0, startY = 0
  let isDragging = false
  let rafId: number

  // 1. 立即初始化位置，避免跳动
  Object.assign(label.style, {
    position: 'fixed',
    cursor: 'grab',
    zIndex: '33',
    outline: 'none',
    willChange: 'transform',
    transform: `translate3d(${currentX}px, ${currentY}px, 0)`
  })
  label.setAttribute('tabindex', '0')

  // 2. 遮罩层管理（单例防止重复创建）
  if (!maskElement) {
    maskElement = document.createElement('div')
    Object.assign(maskElement.style, {
      position: 'fixed', inset: '0', zIndex: '9998',
      cursor: 'grabbing', display: 'none', background: 'transparent'
    })
    document.body.appendChild(maskElement)
  }
  const mask = maskElement

  const updateUI = () => {
    if (!isDragging) return
    label.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
    rafId = requestAnimationFrame(updateUI)
  }

  mouseupEvent = () => {
    if (!isDragging) return
    isDragging = false
    cancelAnimationFrame(rafId)
    mask.style.display = 'none'
    label.style.cursor = 'grab'
    localStorage.setItem('fixed-one-click-position', JSON.stringify({ x: currentX, y: currentY }))
  }

  label.onmousedown = (e) => {
    // 只允许在非resize-handle区域拖动
    const target = e.target as HTMLElement
    if (target.closest('.resize-handle')) return
    isDragging = true
    startX = e.clientX - currentX
    startY = e.clientY - currentY

    mask.style.display = 'block'
    label.style.cursor = 'grabbing'
    label.focus()

    rafId = requestAnimationFrame(updateUI)
    e.preventDefault()
  }

  mousemoveEvent = (e: MouseEvent) => {
    if (!isDragging) return

    const nextX = e.clientX - startX
    const nextY = e.clientY - startY

    // 3. 改进边界算法：使用 offsetLeft/Top（无视 transform）
    // 视口宽高 - 元素自身宽高 - 元素初始位置 = 可移动的最大范围
    const rect = label.getBoundingClientRect()
    const width = rect.width
    const height = rect.height

    // 计算相对于窗口的初始偏移（不含 transform）
    const origLeft = label.offsetLeft
    const origTop = label.offsetTop

    const minX = -origLeft
    const maxX = window.innerWidth - origLeft - width
    const minY = -origTop
    const maxY = window.innerHeight - origTop - height

    currentX = Math.max(minX, Math.min(nextX, maxX))
    currentY = Math.max(minY, Math.min(nextY, maxY))
  }

  label.onblur = mouseupEvent
  window.addEventListener('mousemove', mousemoveEvent)
  window.addEventListener('mouseup', mouseupEvent)
}

function disableDragScroll() {
  const label = document.querySelector('.fixed-one-click') as HTMLElement
  if (label) {
    label.onmousedown = null
    label.onblur = null
  }
  // 修正：移除正确的事件监听器
  if (mousemoveEvent) window.removeEventListener('mousemove', mousemoveEvent)
  if (mouseupEvent) window.removeEventListener('mouseup', mouseupEvent)

  mousemoveEvent = null
  mouseupEvent = null

  if (maskElement) {
    maskElement.remove()
    maskElement = null
  }
}

const isEdit = ref(false)

watch(visible, (val) => {
  if (!val) {
    isEdit.value = false
    // localStorage.removeItem('fixed-one-click-height')
    // localStorage.removeItem('fixed-one-click-width')
    // localStorage.removeItem('fixed-one-click-position')
  }
})

function handleBuyValue(value: string, index: number) {
  const v = value.replace(/-|[^\d.]/g, '')
  const chain = getChain()
  const botSetting = botSettingStore.botSettings?.[chain]
  const selected = botSetting?.buy?.selected || 's1'
  botSetting!.buy![selected].buyValueList[index] = v
}

function handleBlurBuyValue(index: number) {
  const chain = getChain()
  const botSetting = botSettingStore.botSettings?.[chain]
  // 限制合法性，可添加逻辑
  const decimals = 4
  const selected = botSetting?.buy?.selected || 's1'
  const v = botSetting?.buy?.[selected]?.buyValueList?.[index]
  const v1 = new BigNumber(v || 0)
    .toFixed()
    ?.match?.(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0]
  if (String(v) !== String(v1) && botSetting?.buy) {
    if (Number(v1) === 0) {
      botSetting.buy[selected].buyValueList[index] = '0'
    } else {
      botSetting.buy[selected].buyValueList[index] = v1 || '0'
    }
  }
}

function handlePer(value: string, index: number) {
  let v = value.replace(/-|[^\d.]/g, '')
  if (Number(v) > 100) {
    v = '100'
  } else if (Number(v) < 0) {
    v = '0'
  }
  const chain = getChain()
  const botSetting = botSettingStore.botSettings?.[chain]
  const selected = botSetting?.sell?.selected || 's1'
  if (botSetting?.sell) {
    botSetting.sell[selected].sellPerList[index] = v || '0'
  }
}


onMounted(() => {
  enableDragScroll()
  addSpaceKeyDownEvent()
  nextTick(() => {
    isMounted.value = true
  })
})

onBeforeUnmount(() => {
  disableDragScroll()
  isMounted.value = false
})

</script>

<style lang="scss" scoped>
.flex-between {
  --uno: flex items-center justify-between;
}

.flex-start {
  --uno: flex items-center;
}

.one-click-btn {
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


.fixed-one-click {
  position: fixed;
  z-index: 3;
  color: var(--main-text);
  font-size: 12px;
  background: var(--dialog-bg);
  border-radius: 8px;
  min-width: 360px;
  min-height: 327px;
  max-width: 900px;
  max-height: 800px;
  padding: 12px;
  top: 210px;
  left: 350px;
  // box-sizing: border-box;
  // overflow: hidden;
  border: 1px solid var(--border);
  /* 四个方向的resize-handle */
  .resize-handle {
    position: absolute;
    z-index: 10000;
    background: transparent;
    user-select: none;
  }
  .resize-handle-b {
    left: 0;
    bottom: -6px;
    width: 100%;
    height: 12px;
    cursor: row-resize;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    // &::after {
    //   content: '';
    //   display: block;
    //   width: 36px;
    //   height: 4px;
    //   margin-bottom: 3px;
    //   border-radius: 2px;
    //   background: #bfc8e2;
    //   opacity: 0.5;
    // }
  }
  .resize-handle-r {
    top: 0;
    right: -6px;
    width: 12px;
    height: 100%;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    // &::after {
    //   content: '';
    //   display: block;
    //   width: 4px;
    //   height: 36px;
    //   margin-right: 3px;
    //   border-radius: 2px;
    //   background: #bfc8e2;
    //   opacity: 0.5;
    // }
  }
  .resize-handle-t {
    left: 0;
    top: -6px;
    width: 100%;
    height: 12px;
    cursor: row-resize;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    // &::after {
    //   content: '';
    //   display: block;
    //   width: 36px;
    //   height: 4px;
    //   margin-top: 3px;
    //   border-radius: 2px;
    //   background: #bfc8e2;
    //   opacity: 0.5;
    // }
  }
  .resize-handle-l {
    top: 0;
    left: -6px;
    width: 12px;
    height: 100%;
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    // &::after {
    //   content: '';
    //   display: block;
    //   width: 4px;
    //   height: 36px;
    //   margin-left: 3px;
    //   border-radius: 2px;
    //   background: #bfc8e2;
    //   opacity: 0.5;
    // }
  }
  /* 四角斜向缩放手柄样式 */
  .resize-handle-tl, .resize-handle-tr, .resize-handle-bl, .resize-handle-br {
    width: 16px;
    height: 16px;
    position: absolute;
    z-index: 10001;
    background: transparent;
    user-select: none;
    // &::after {
    //   content: '';
    //   display: block;
    //   width: 12px;
    //   height: 12px;
    //   border-radius: 3px;
    //   background: #bfc8e2;
    //   opacity: 0.7;
    //   border: 2px solid transparent;
    // }
  }
  .resize-handle-tl {
    top: -4px;
    left: -4px;
    cursor: nwse-resize;
  }
  .resize-handle-tr {
    top: -4px;
    right: -4px;
    cursor: nesw-resize;
  }
  .resize-handle-bl {
    bottom: -4px;
    left: -4px;
    cursor: nesw-resize;
  }
  .resize-handle-br {
    bottom: -4px;
    right: -4px;
    cursor: nwse-resize;
  }
}

.icon-shezhi {
  color: #696E7C;
  font-size: 12px;
}

.content {
  .tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .one-click-button {
      font-size: 14px;
      min-width: 48px;
      /* 高度由内联style动态控制 */
      padding: 3px 8px;
      margin: 0;
      // margin-right: 8px;
      // flex: 1;
      width: calc((100% - 24px) / 4);
      text-align: center;
      background: transparent;
      position: relative;

      // &:last-child {
      //   margin-right: 0;
      // }

      &.active:nth-child(-n+4):after {
        content: '';
        position: absolute;
        bottom: calc(100% + 5px);
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--dialog-list-hover);
        min-width: 20px;
        padding: 3px 0;
        color: var(--main-text);
        font-size: 14px;
        border-radius: 4px;
      }

      &.green {
        color: #12b886;
        border: 1px solid #12b886;
        &.active {
          position: relative;
          z-index: 3100;
          &:nth-child(1)::after {
            content: 'Q';
          }
          &:nth-child(2)::after {
            content: 'W';
          }
          &:nth-child(3)::after {
            content: 'E';
          }
          &:nth-child(4)::after {
            content: 'R';
          }
        }
      }

      &.red {
        color: #ff646d;
        border: 1px solid #ff646d;
        &.active {
          position: relative;
          z-index: 3100;
          &:nth-child(1)::after {
            content: 'A';
          }
          &:nth-child(2)::after {
            content: 'S';
          }
          &:nth-child(3)::after {
            content: 'D';
          }
          &:nth-child(4)::after {
            content: 'F';
          }
        }
      }
    }
  }
  .tabs-1 {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // background: var(--a-btn-bg-3-color);
    padding: 1px;
    border-radius: 4px;
    font-size: 12px;

    button {
      border: none;
      color: var(--secondary-text);
      letter-spacing: 0;
      font-weight: 400;
      cursor: pointer;
      border-radius: 4px;
      background: transparent;
      min-width: 24px;
      padding: 3px 3px;
      text-align: center;

      &.active {
        // color: var(--custom-font-4-color);
        color: var(--main-text);
        background: var(--border);
      }
    }
  }
}

.input-number {
  flex: 1;
  background: var(--border);
  --el-input-bg-color: var(--border);
  --el-input-border-color: var(--border);
  border-radius: 4px;
  :deep().el-input__inner {
    text-align: center;
    color: var(--main-text);
    height: 100%;
  }
}


</style>
