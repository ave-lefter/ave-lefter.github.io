<template>
  <button v-show="botStore.isSupportChains?.includes(chain)" class="one-click-btn clickable" :class="{ 'active': visible }" @keyup.prevent @keydown.enter.prevent @click.stop="visible = !visible">
    <Icon name="ion:flash" />
    <span class="ml-5px">{{ $t('oneClick') }}</span>
  </button>
  <Teleport to="body">
    <div v-show="botStore.isSupportChains?.includes(chain) && visible" class="fixed-one-click">
      <template v-if="botStore.isSupportChains?.includes(chain) && visible">
        <div class="flex-between">
          <div class="flex-start">
            <!-- <span>{{ $t('oneClick') }}</span> -->
            <Icon :key="isEnableHotkey" v-tooltip="isEnableHotkey ? $t('hotkeyTips') : $t('hotkeyTips1')" class="text-14px color-[--secondary-text] clickable" :class="{ 'color-[--primary-color]!': isEnableHotkey }" name="ri:keyboard-box-fill" @click.stop="isEnableHotkey = !isEnableHotkey" @mousedown.stop />
            <Icon :key="isEnablePnL" v-tooltip="isEnablePnL ? $t('enablePnLTips2') : $t('enablePnLTips1')" name="bx:bxs-bar-chart-alt-2" class="text-14px color-[--secondary-text] clickable ml-5px" :class="{ 'color-[--primary-color]!': isEnablePnL }" @mousedown.stop @click.stop="isEnablePnL = !isEnablePnL" />
            <Icon :key="isEnableShowsReflected" v-tooltip="isEnableShowsReflected ? $t('disableShowsReflected') : $t('enableShowsReflected')" name="ph:approximate-equals-bold" class="text-14px color-[--secondary-text] clickable ml-5px" :class="{ 'color-[--primary-color]!': isEnableShowsReflected }" @mousedown.stop @click.stop="isEnableShowsReflected = !isEnableShowsReflected" />
            <!-- <div class="tabs-1 ml-5px">
              <button
                v-for="item in BotSettingsArr" :key="item.value"
                :class="{ 'active': item.value === botSettings?.[chain]?.selected }" type="button" @mousedown.stop
                @click.stop="botSettings[chain]!.selected = item.value">{{ item.label }}</button>
            </div> -->
            <!-- <SlippageSetMarket class="ml-5px" :chain="chain" @mousedown.stop /> -->
          </div>
          <SlippageSetMarket class="mr-10px ml-auto" :chain="chain" @mousedown.stop />
          <Icon
            class="text-14px clickable color-[--main-text] clickable" name="ri:close-large-fill"
            @click.stop="visible = false" @mousedown.stop />
        </div>
        <el-divider class="b-t-color-[--dialog-divider]! mt-10px! mb-5px!" />
        <div class="content">
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
          <div class="mt-10px tabs">
            <el-button
              v-for="(item, $index) in botSettings?.[chain]?.buy![botSettings?.[chain]?.buy?.selected || 's1']?.buyValueList"
              :key="$index" class="one-click-button green clickable" :class="{ 'active': isCanKeySwap && isEnableHotkey }" :loading="loadingSwapBuy[$index]"
              :disabled="loadingSwapBuy[$index]" @click.stop.prevent="submitBotSwap(item, 'buy', $index)" @mousedown.stop @mouseover.stop="hoverBuyAmount = item" @mouseleave.stop="hoverBuyAmount = ''">{{
                !loadingSwapBuy[$index] ? item : '' }}</el-button>
          </div>
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
          <div class="mt-10px tabs">
            <el-button
              v-for="(item, $index) in botSettings?.[chain]?.sell![botSettings?.[chain]?.sell?.selected || 's1']?.sellPerList"
              :key="$index" class="one-click-button red clickable" :class="{ 'active': isCanKeySwap && isEnableHotkey }" :loading="loadingSwapSell[$index]"
              :disabled="loadingSwapSell[$index]" @click.stop.prevent="handleSellAmount(item, $index)" @mousedown.stop @mouseover.stop="hoverSellAmount = item" @mouseleave.stop="hoverSellAmount = ''">{{
                !loadingSwapSell[$index] ? item + '%' : ''
              }}</el-button>
          </div>
          <BottomSetting activeTab="sell" :gasPrice="tokenStore.gasPrice" @mousedown.stop />
        </div>

        <Holding v-show="isEnablePnL" isForceShow class="b-t-solid b-t-1px b-color-[--dialog-divider] mt-10px rd-0! pb-0! mb-0! gap-8px bg-transparent!" />
      </template>
    </div>
  </Teleport>

</template>

<script setup lang='ts'>
import { formatNumber } from '@/utils/formatNumber'
import { getChainInfo, isEvmChain } from '@/utils'
import { useLocalStorage, useEventListener } from '@vueuse/core'
import { ElNotification } from 'element-plus'
import BigNumber from 'bignumber.js'
import { NATIVE_TOKEN } from '@/utils/constants'
import { formatBotGasTips } from '@/utils/bot'
import { useBotSwap } from '~/composables/botSwap'
import { bot_createSolTx, bot_createSwapEvmTx, bot_createSwapTonTx } from '@/api/bot'
import RefreshBalance from './refreshBalance.vue'
import SlippageSetMarket from './slippageSetMarket.vue'
import type { BotChain, BotSettingKey } from '~/utils/types'
import { recordTxV2, updateTxV2 } from '~/api/tracking'
import Holding from './holding.vue'
import BottomSetting from './bottomSetting.vue'

const botStore = useBotStore()
const tokenStore = useTokenStore()
const botSettingStore = useBotSettingStore()
const botSwapStore = useBotSwapStore()
const { botSettings } = storeToRefs(botSettingStore)
const wsStore = useWSStore()
const route = useRoute()
const { t } = useI18n()
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

const hoverBuyAmount = ref('')

const hoverSellAmount = ref('')


const estimateBuyAmount = computed(() => {
  return new BigNumber(hoverBuyAmount.value || 0).times(nativePrice.value).div(tokenPrice.value).toFixed()
})

const estimateSellAmount = computed(() => {
  return new BigNumber(hoverSellAmount.value || 0).times(tokenPrice.value).div(nativePrice.value).toFixed()
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
              ElNotification({ type: 'success', message: t('tradeSuccess') })
              const txInfo = subscribeResult?.txList?.[0]
              updateTxV2({...txInfo, chain: subscribeResult?.chain}, batchIdObj?.[_batchId] || '')
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
            }
            unwatch()
            if (isBuy) {
              loadingSwapBuy.value[index] = false
            } else {
              loadingSwapSell.value[index] = false
            }
            setTimeout(() => {
              getTokenBalance()
            }, 1000)
          }
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
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
    const gasPrice = !settings?.customFee ? '0' : (settings?.customFee || gasTips?.[settings?.level] || '3')
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
        const txInfo: any = res?.[0] || {}
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
              ElNotification({ type: 'success', message: t('tradeSuccess') })
              unwatch()
              setTimeout(() => {
                getTokenBalance()
              }, 1000)
              const txInfo = subscribeResult?.txList?.[0]
              updateTxV2({...txInfo, chain: subscribeResult?.chain}, batchIdObj?.[_batchId] || '')
              updateBalanceFromWs({
                chain: data.chain,
                inTokenAddress: data.inTokenAddress,
                outTokenAddress: data.outTokenAddress,
                ...txInfo
              })
            } else {
              handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
              unwatch()
            }
            if (isBuy) {
              loadingSwapBuy.value[index] = false
            } else {
              loadingSwapSell.value[index] = false
            }
          }
        })
      }
    }).catch(err => {
      handleBotError(err || 'swap error')
      if (isBuy) {
        loadingSwapBuy.value[index] = false
      } else {
        loadingSwapSell.value[index] = false
      }
    })
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

function enableDragScroll() {
  const label = document.querySelector('.fixed-one-click') as HTMLElement
  if (!label) return

  // 1. 从本地存储读取历史位置 (Persistence)
  const savedPos = localStorage.getItem('fixed-one-click-position')
  const initialOffset = savedPos ? JSON.parse(savedPos) : { x: 0, y: 0 }

  // 2. 初始化坐标状态
  let currentX = initialOffset.x
  let currentY = initialOffset.y
  let startX = 0, startY = 0
  let isDragging = false
  let rafId: number

  // 初始化样式
  label.setAttribute('tabindex', '0')
  Object.assign(label.style, {
    position: 'fixed',
    cursor: 'grab',
    zIndex: 'auto',
    outline: 'none',
    willChange: 'transform',
    // 关键：初始化时立即应用保存的位置
    transform: `translate3d(${currentX}px, ${currentY}px, 0)`
  })

  const mask = document.createElement('div')
  Object.assign(mask.style, {
    position: 'fixed', inset: '0', zIndex: '3013',
    cursor: 'grabbing', display: 'none', background: 'transparent'
  })
  document.body.appendChild(mask)

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

    // 3. 存储相对于初始位置的偏移量，而不是 getBoundingClientRect 的绝对值
    // 这样可以避免在不同分辨率屏幕切换时位置错乱
    localStorage.setItem('fixed-one-click-position', JSON.stringify({
      x: currentX,
      y: currentY
    }))
  }

  label.onmousedown = (e) => {
    isDragging = true
    // 计算点击点相对于当前元素偏移位置的差值
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
    currentX = e.clientX - startX
    currentY = e.clientY - startY
  }

  label.onblur = mouseupEvent
  window.addEventListener('mousemove', mousemoveEvent)
  window.addEventListener('mouseup', mouseupEvent)
}

function disableDragScroll() {
  // 移除事件
  const label = document.querySelector('.fixed-one-click') as HTMLElement
  if (!label) {
    return
  }
  label.onmousedown = null
  window.removeEventListener('mousemove', mouseupEvent as EventListener)
  mouseupEvent = null
  window.removeEventListener('mousemove', mousemoveEvent as EventListener)
  mousemoveEvent = null
}

onMounted(() => {
  enableDragScroll()
  addSpaceKeyDownEvent()
})

onBeforeUnmount(() => {
  disableDragScroll()
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
  padding: 12px;
  top: 210px;
  left: 350px;

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
        height: 32px;
        padding: 3px 8px;
        margin: 0;
        // margin-right: 8px;
        flex: 1;
        text-align: center;
        background: transparent;
        position: relative;

        // &:last-child {
        //   margin-right: 0;
        // }

        &.active:after {
          content: '';
          position: absolute;
          top: calc(100% + 5px);
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
</style>
