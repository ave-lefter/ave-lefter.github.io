<script setup lang="ts">
import BigNumber from 'bignumber.js'
import {ElNotification} from 'element-plus'
import {useStorage} from '@vueuse/core'
import {bot_createSolTx, bot_createSwapEvmTx, bot_getTokenBalance} from '~/api/bot'
import { formatBotGasTips } from '~/utils/bot'
import type { Size } from '~/api/types/pump'
import { getSwapSize } from '@/utils/index'

const {t} = useI18n()
const props = withDefaults(defineProps<{
  quickBuyValue: string
  row: {
    chain: string
    symbol?: string
    target_token?: string
    token0_address?: string
    token1_symbol?: string
    [key: string]: any
  }
  appendTo?: string
  buttonBg?: string,
  mainNameVisible?: boolean
  classNames?: string,
  size?: Size
}>(), {
  appendTo: '#__nuxt',
  buttonBg: 'rgba(18, 184, 134, 0.15)',
  classNames: '',
  size: 'medium'
})
const botStore = useBotStore()
const loadingSwap = shallowRef(false)
const visible = shallowRef(false)
const message = shallowRef('')
const noReminderQuickBuy = useStorage('noReminderQuickBuy', false)
const emit = defineEmits(['submitSwap'])

function submitBotSwap() {
  emit('submitSwap')
  if (!verifyLogin()) {
    return
  }
  if (loadingSwap.value) {
    return
  }
  if (new BigNumber(props.quickBuyValue || 0).lte(0)) {
    ElNotification({title: 'Error', type: 'error', message: t('amountMustG0')})
    return
  }
  const {row} = props
  message.value = t('quickBuyMsg', {
    a: props.quickBuyValue,
    m: getChainInfo(props.row.chain)?.main_name || '',
    s: row.symbol || (row.target_token == row.token0_address ? row.token0_symbol : row.token1_symbol)
  })
  if (noReminderQuickBuy.value) {
    beforeSubmitSwap()
  } else {
    visible.value = true
  }
}

const nativeToken = shallowRef()
const botSettingStore = useBotSettingStore()

async function beforeSubmitSwap() {
  visible.value = false
  const {chain} = props.row
  loadingSwap.value = true
  await getTokenBalance(chain)
  const fromToken = nativeToken.value
  const amount = (new BigNumber(props.quickBuyValue || 0)).toFixed()
    .match(new RegExp(`[0-9]*(\\.[0-9]{0,${fromToken?.decimals || 18}})?`))?.[0]
  if ((Number(amount) || 0) <= 0) {
    ElNotification({title: 'Error', type: 'error', message: t('amountTooSmall')})
    loadingSwap.value = false
    return
  }
  if (new BigNumber(amount || 0).gt(fromToken?.balance || 0)) {
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
  const selected = botSettings?.[chain]?.selected as 's1' | 's2' | 's3'
  const currentBotSetting = botSettings?.[chain]?.[selected]
  if (isSolana && currentBotSetting?.mev) {
    if (!await botStore.getBundleAvailable()) {
      loadingSwap.value = false
      return
    }
  }
  const {gasTip1List, gasTip2List} = formatBotGasTips(useBotSwapStore().gasTip, 'solana')
  const gasTips = currentBotSetting?.mev ? gasTip1List : gasTip2List
  const settings = currentBotSetting?.mev ? currentBotSetting?.gas[0] : currentBotSetting?.gas?.[1]
  let data: any = {}
  if (isSolana) {
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (currentBotSetting?.mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    data.priorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
  } else {
    const gasPrice = Number(settings?.customFee) === 0 ? '0' : (settings?.customFee || gasTips?.[settings?.level as number] || '3')
    data.gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    data.contractType = 0
    data.chain = chain
  }
  const native = getNativeToken(chain)
  const slippage = currentBotSetting?.slippage || '9'
  const creatorAddress = botStore.getWalletAddress(chain)
  if (!creatorAddress) {
    return
  }
  data = {
    ...data,
    batchId: Date.now().toString(),
    swapList: [{
      creatorAddress,
      inAmount: new BigNumber(amount || 0)
        .times(10 ** nativeToken.value.decimals || 0).toFixed(0)
    }],
    inTokenAddress: native,
    outTokenAddress: props.row.token || props.row.target_token,
    swapType: 1,
    isPrivate: currentBotSetting?.mev || false,
    slippage: slippage !== 'auto'
      ? Number(new BigNumber(slippage || '9').times(100).toFixed(0)) : 900,
    autoSell: currentBotSetting?.autoSell || false
  }
  const tx = isSolana ? bot_createSolTx(data) : bot_createSwapEvmTx(data)
  tx.then(res => handleTxSuccess(res, data.batchId))
    .catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value = false
    })
}

const tokenStore = useTokenStore()
const wsStore = useWSStore()

function handleTxSuccess(res: any, _batchId: string) {
  if (res) {
    let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
      ElNotification({type: 'success', message: t('transactionsSubmitted')})
      tokenStore.placeOrderUpdate++
      loadingSwap.value = false
    }, 500)
    const unwatch = watch(() => wsStore.wsResult.tgbot, (subscribeResult) => {
      const batchId = subscribeResult.batchId
      if (batchId === _batchId) {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        tokenStore.placeOrderSuccess++
        if (subscribeResult?.txList?.[0]?.success) {
          ElNotification({type: 'success', message: t('tradeSuccess')})
          unwatch()
        } else {
          handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
          unwatch()
        }
        loadingSwap.value = false
      }
    })
  }
}

async function getTokenBalance(chain: string) {
  const walletAddress = botStore.getWalletAddress(chain)
  if (!walletAddress) return
  const res = await bot_getTokenBalance({
    chain,
    tokens: [getNativeToken(chain)],
    walletAddress
  })
  const token = res?.[0] || {}
  nativeToken.value = {
    ...token,
    symbol: getChainInfo(chain)?.main_name,
    chain,
    address: token.token || token.address,
    decimals: token.decimals || token.decimal
  }
}
</script>

<template>
  <el-button
    :disabled="!Number(quickBuyValue)"
    :loading="loadingSwap"
    :color="buttonBg"
    class="flex items-center [&&]:px-12px"
    :class="classNames"
    style="--el-button-hover-bg-color:rgba(18, 184, 134, 0.3);--el-color-black: #12B886; --el-button-border-color: transparent; --el-button-hover-border-color: transparent;--el-button-disabled-text-color: #12B886;--el-button-disabled-border-color: transparent;--el-button-disabled-bg-color: #12B8861A;"
    :style="{ 'font-size': getSwapSize(size as Size).text }"
    @click="submitBotSwap"
  >
    <Icon
    :style="{ 'font-size': getSwapSize(size as Size).flash }"
      class="mr-4px"
      name="mynaui:lightning-solid"
    />
    {{ quickBuyValue || 0 }}
    <span v-if="mainNameVisible" class="ml-5px" >{{ getChainInfo(row.chain)?.main_name || '' }}</span>
  </el-button>
  <el-dialog
    v-if="visible" v-model="visible" :title="$t('buy')"
    width="400px" :append-to="appendTo"
  >
    <template #header>
      <span class="text-20px">{{ $t('buy') }}</span>
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

<style scoped lang="scss">

</style>
