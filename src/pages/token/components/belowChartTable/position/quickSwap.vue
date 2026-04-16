<template>
  <div>
    <template v-if="buttonType === 0">
      <el-button
        :disabled="!Number(swapValue)"
        :loading="loadingSwap || loadingWalletSwap"
        :color="buttonBg"
        class="flex items-center [&&]:px-8px [&&]:py-5px [&&]:h-auto"
        :class="classNames"
        :style="styles"
        @click.stop.prevent="submitBotSwap"
      >
        <Icon v-if="!(loadingSwap || loadingWalletSwap)" :style="{ 'font-size': size }"
          class="mr-4px"
          name="mynaui:lightning-solid"
        />
        <span>{{ Number(swapValue) ? (swapValue || 0) : $t(props.swapType === 'buy' ? 'buy' : 'sell') }}</span>
        <template v-if="props.swapType === 'buy'">
          <span v-if="mainNameVisible && Number(swapValue)" class="ml-5px" >{{ getChainInfo(row.chain)?.main_name || '' }}</span>
        </template>
        <span v-else>%</span>
      </el-button>
      <el-dialog
        v-if="visible" v-model="visible" :title="props.swapType === 'buy' ? $t('buy') : $t('sell')"
        width="400px" :append-to="appendTo" destroy-on-close
      >
        <template #header>
          <span class="text-20px">{{ props.swapType === 'buy' ? $t('buy') : $t('sell') }}</span>
        </template>
        <div class="min-h-60px py-10px">
          <div class="text-16px">
            {{ message }}
          </div>
          <div class="flex mt-10px">
            <el-checkbox
              v-model="noReminderQuickBuy"
              class="[&&]:[--el-checkbox-text-color:--d-999-l-666]"
              :label="$t('noAlert')"
              size="large"
            />
          </div>
        </div>
        <template #footer>
          <el-button
            type="primary"
            class="w-full"
            size="large"
            @click.stop="beforeSubmitSwap"
          >{{ $t('confirm1') }}
          </el-button>
        </template>
      </el-dialog>
    </template>
    <el-button
      v-else
      :loading="loadingSwap || loadingWalletSwap"
      :color="buttonBg"
      class="flex items-center [&&]:px-4px"
      :class="classNames"
      :style="styles"
      @click.stop.prevent="submitBotSwap"
    >
      <Icon
        v-show="!loadingSwap"
        class="mr-4px text-12px"
        name="mynaui:lightning-solid"
      />
      <span>{{ Number(swapValue) ? (swapValue || 0) : $t(props.swapType === 'buy' ? 'buy' : 'sell') }}</span>
      <template v-if="props.swapType === 'buy'">
        <span v-if="mainNameVisible && Number(swapValue)" class="ml-5px" >{{ getChainInfo(row.chain)?.main_name || '' }}</span>
      </template>
      <span v-else>%</span>
    </el-button>
  </div>


</template>
<script setup lang="ts">
import BigNumber from 'bignumber.js'
import {ElNotification} from 'element-plus'
import {useStorage} from '@vueuse/core'
import {bot_createSolTx, bot_createSwapEvmTx, bot_createSwapTonTx, bot_getTokenBalance, getBalances} from '~/api/bot'
import { formatBotGasTips, hasCreateTxError, getCreateTxErrorMsg, handleBotError } from '~/utils/bot'
import type { BotChain, BotSettingKey } from '~/utils/types'
import useWalletSwap from '~/components/quickSwap/wallet'
import { recordTxV2, updateTxV2 } from '~/api/tracking'
const { walletSwap, loadingWalletSwap } = useWalletSwap()

const {t} = useI18n()
const props = withDefaults(defineProps<{
  swapType?: 'sell' | 'buy'
  swapValue: string | number
  swapSetSelected?: 's1' | 's2' | 's3'
  row: {
    chain: BotChain
    symbol?: string
    target_token?: string
    token?: string
    token0_address?: string
    token1_symbol?: string
    [key: string]: any
  }
  appendTo?: string
  mainNameVisible?: boolean
  classNames?: string,
  size?: string
  buttonType?: number
  creatorAddress?: string
}>(), {
  appendTo: '#__nuxt',
  classNames: '',
  size: '14px',
  buttonType: 0,
  swapSetSelected: undefined,
  swapType: 'sell',
  creatorAddress: ''
})
const botStore = useBotStore()
const loadingSwap = shallowRef(false)
const visible = shallowRef(false)
const message = shallowRef('')
const noReminderQuickBuy = useStorage('noReminderQuickSell', false)
const emit = defineEmits(['submitSwap','jump'])
const amountValue = ref('')

const buttonBg = computed(() => {
  if (props.swapType === 'buy') {
    return 'rgba(18, 184, 134, 0.15)'
  }
  return 'rgb(246, 70, 93, 0.15)'
})
const styles = computed(() => {
  if (props.swapType === 'buy') {
    return '--el-button-hover-bg-color:rgba(18, 184, 134, 0.3);--el-color-black: #12B886; --el-button-border-color: transparent; --el-button-hover-border-color: transparent;--el-button-disabled-text-color: #12B886;--el-button-disabled-border-color: transparent;--el-button-disabled-bg-color: #12B8861A;' + 'font-size:' + props.size
  }
  return '--el-button-hover-bg-color:rgb(246, 70, 93, 0.3);--el-color-black: #f6465d; --el-color-white:#f6465d; --el-button-border-color: transparent; --el-button-hover-border-color: transparent;--el-button-disabled-text-color: #f6465d;--el-button-disabled-border-color: transparent;--el-button-disabled-bg-color: #f6465d1A;' + 'font-size:' + props.size
})

const _fromToken = ref({
  token: '',
  decimals: 18,
  symbol: '',
  balance_amount: '0',
  balance_usd: '0',
  current_price_usd: '0'
})

async function submitBotSwap() {
  // return console.log('submitBotSwap')
  emit('submitSwap')
  if (!verifyLogin()) {
    return
  }
  if (loadingSwap.value) {
    return
  }
  if (props.buttonType === 1 && new BigNumber(props.swapValue || 0).lte(0)) {
    ElMessage({ type: 'error', plain: true, message: t('buyAmountMustG0'), duration: 1000 })
    return
  }
  if (new BigNumber(props.swapValue || 0).lte(0)) {
    ElNotification({title: 'Error', type: 'error', message: t('amountMustG0')})
    return
  }
  const {row} = props
  const chain = row.chain
  const native = {
    token: NATIVE_TOKEN,
    decimals: getChainInfo(row.chain)?.decimals || 18,
    symbol: getChainInfo(row.chain)?.main_name || '',
    balance_amount: 0
  }
  const fromToken = props.swapType === 'buy' ? native : props.row


  const creatorAddress = botStore.walletList?.find(item => item.evmAddress === props.creatorAddress)?.addresses?.find(item => item.chain === chain)?.address || botStore.getWalletAddress(chain) || ''
  const balance = await getBalance(fromToken.token || '', row.chain, creatorAddress)
  fromToken.balance_amount = balance

  let amount = (new BigNumber(props.swapValue || 0)).toFixed()
    .match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromToken?.decimals || 18}})?`))?.[0]
  if (props.swapType === 'sell') {
    amount = (new BigNumber(props.swapValue || 0)).times(fromToken?.balance_amount || 0).div(100).toFixed().match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromToken?.decimals || 18}})?`))?.[0]
  }
  message.value = props.swapType === 'sell' ? t('quickSellMsg', {
    a: amount,
    m: getChainInfo(props.row.chain)?.main_name || '',
    s: row.symbol
  }) : t('quickBuyMsg', {
    a: amount,
    m: getChainInfo(props.row.chain)?.main_name || '',
    s: row.symbol
  })
  amountValue.value = amount || ''
  _fromToken.value = fromToken
  if (noReminderQuickBuy.value || props.buttonType === 1) {
    beforeSubmitSwap()
  } else {
    visible.value = true
  }
}

// const nativeToken = shallowRef()
const botSettingStore = useBotSettingStore()
const walletStore = useWalletStore()

async function beforeWalletSwap(amount: string) {
  // const amount = (new BigNumber(props.swapValue || 0)).toFixed()
  walletSwap(amount, props.row as any)
}

async function beforeSubmitSwap() {
  const amount = amountValue.value || '0'
  if (walletStore.provider && walletStore.address && !botStore.evmAddress) {
    beforeWalletSwap(amount)
    return
  }
  const fromToken = _fromToken.value
  visible.value = false
  loadingSwap.value = true
  if ((Number(amount) || 0) <= 0) {
    ElNotification({title: 'Error', type: 'error', message: t('amountTooSmall')})
    loadingSwap.value = false
    return
  }
  if (new BigNumber(amount || 0).gt(fromToken?.balance_amount || 0) && fromToken?.balance_amount !== undefined) {
    ElNotification({title: 'Error', type: 'error', message: t('insufficientBalance')})
    loadingSwap.value = false
    return
  }
  submitSwap(amount!)
}

async function submitSwap(amount: string) {
  const {chain} = props.row
  const isSolana = chain === 'solana'
  const {botSettings} = botSettingStore
  const selected = props.swapSetSelected || botSettings?.[chain]?.[props.swapType]?.selected as BotSettingKey
  const currentBotSetting = botSettings?.[chain]?.[props.swapType]?.[selected]
  // if (isSolana && currentBotSetting?.mev) {
  //   if (!await botStore.getBundleAvailable()) {
  //     loadingSwap.value = false
  //     return
  //   }
  // }
  const {gasTip1List, gasTip2List} = formatBotGasTips(useBotSwapStore().gasTip, chain)
  const gasTips = currentBotSetting?.mev ? gasTip1List : gasTip2List
  const settings = currentBotSetting?.mev ? currentBotSetting?.gas[0] : currentBotSetting?.gas?.[1]
  let data: any = {}
  if (isSolana) {
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (currentBotSetting?.mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    data.priorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
  } else if (chain !== 'ton') {
    const gasPrice = settings?.customFee == '0' ? '0' : (settings?.customFee || gasTips?.[settings?.level as number] || '3')
    data.gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    data.contractType = 0
    data.chain = chain
  }
  const native = {
    token: getNativeToken(chain),
    decimals: getChainInfo(chain)?.decimals || 18,
    symbol: getChainInfo(chain)?.main_name || ''
  }
  const fromToken = props.swapType === 'buy' ? native : props.row
  const toToken =  props.swapType === 'sell' ? native : props.row

  const slippage = currentBotSetting?.slippage || '9'
  const creatorAddress = botStore.walletList?.find(item => item.evmAddress === props.creatorAddress)?.addresses?.find(item => item.chain === chain)?.address || botStore.getWalletAddress(chain) || ''
  if (!creatorAddress) {
    return
  }
  const batchId = Date.now().toString()
  data = {
    ...data,
    swapList: [{
      batchId,
      creatorAddress,
      inAmount: new BigNumber(amount || 0)
        .times(10 ** fromToken.decimals || 0).toFixed(0)
    }],
    inTokenAddress: fromToken.token,
    outTokenAddress: toToken.token,
    swapType: props.swapType === 'buy' ? 1 : 2,
    isPrivate: currentBotSetting?.mev || false,
    slippage: slippage !== 'auto'
      ? Number(new BigNumber(slippage || '9').times(100).toFixed(0)) : 900,
    autoSell: botSettingStore.autoSellConfig_autoSell || false,
    autoSellConfig: botSettingStore?.selectedAutoSellConfig,
    autoGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
    autoSellGas: (settings?.customFee ? 0 : ((settings?.level || 0) + 1)) as 0 | 1 | 2 | 3, // 0 ->不使用， 1 -> Low, 2 -> AVG, 3 -> High
    autoSellPriorityFee: isSolana ? data.priorityFee : data.gasTip
  }

  let tx = bot_createSwapEvmTx
  if (isSolana) {
    tx = bot_createSolTx as any
  } else if (chain === 'ton') {
    tx = bot_createSwapTonTx
  }
  tx(data).then(res => handleTxSuccess(res, batchId))
    .catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value = false
    })
}

const tokenStore = useTokenStore()
const wsStore = useWSStore()
function handleTxSuccess(res: any, _batchId: string) {
  if (res) {
    const chain = props.row.chain
    const txInfo: any = res?.[0] || {}
    if (hasCreateTxError(txInfo)) {
      handleBotError(getCreateTxErrorMsg(txInfo))
      loadingSwap.value = false
      return
    }
    let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
      // ElNotification({type: 'success', message: t('transactionsSubmitted')})
      // tokenStore.placeOrderUpdate++
      loadingSwap.value = false
    }, 500)
    const recordTxUrlObj = {
      solana: '/botapi/swap/createSolTx',
      ton: '/botapi/swap/createSwapTonTx',
    }

    recordTxV2({
      txInfo,
      chain: chain,
      destination: recordTxUrlObj?.[chain as 'solana' | 'ton'] || '/botapi/swap/createSwapEvmTx' ,
      type: 10
    })

    const batchIdObj = {
      [txInfo?.batchId]: txInfo?.id
    }
    const unwatch = watch(() => wsStore.wsResult.tgbot, (subscribeResult) => {
      const batchId = subscribeResult.batchId
      if (batchId === _batchId) {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }

        if (subscribeResult?.txList?.[0]?.success) {
          ElNotification({ type: 'success', message: t('tradeSuccess') })
          tokenStore.placeOrderSuccess++
          emit('jump')
          const txInfo = subscribeResult?.txList?.[0]
          updateTxV2({...txInfo, chain: subscribeResult?.chain}, batchIdObj?.[batchId] || '')
        } else {
          handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
        }
        unwatch()
        loadingSwap.value = false
      }
    })
  }
}

async function getBalance(token: string, chain: BotChain, address: string) {
  if (!address) return Promise.resolve('0')
  return getBalances({
    chain,
    creatorAddress: address,
    tokens: [token],
    showZero: true
  }).then(async res => {
    if (res?.tokens?.length) {
      return res?.tokens?.find((item) => item.token === token)?.balance || '0'
    }
    return '0'
  }).catch(() => '0')

}

</script>

<style scoped lang="scss">

</style>
