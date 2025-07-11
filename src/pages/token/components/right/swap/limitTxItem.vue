<template>
  <ul>
    <li
      v-for="(item, index) in tableList"
      :key="index"
      class="tx-li-item clickable"
      @click.stop="goLink(item)"
    >
      <template v-if="item.chain !== 'solana'">
        <div class="flex items-center">
          <span
            class="label"
            :style="{ 'min-width': localeStore.locale === 'en' ? '30px' : '20px' }"
          >
            {{ $t('from') }}
          </span>
          <div v-if="item.from_token" class="token-container">
            <div class="icon-token-container mr-5px">
              <el-image
                class="icon-token"
                :src="getSymbolDefaultIcon({logo_url: item.from_token_logo_url, symbol: item.from_token_symbol, chain: item.chain || walletStore.chain})"
                lazy
              />
              <img
                v-if="item?.chain"
                class="icon-chain"
                :src="`${ConfigStore.token_logo_url}chain/${item?.chain}.png`"
                alt=""
                srcset=""
              >
            </div>
            <span
              class="mr-5px"
              v-html="formatNumber(formatUnits(item.from_amount, item.from_token_decimals))"
            />
            <span>{{ item.from_token_symbol || '' }}</span>
          </div>
          <span style="flex: 1"/>
          <span class="mr-5px text-12px label">
            {{ $t('price') }}({{
              item.target_token === item.from_token
                ? item?.from_token_symbol || ''
                : item?.to_token_symbol || ''
            }})
          </span>
          <div v-if="item.target_token" class="token-container">
            <span
              v-html="
                `$${item.target_limit_price ? formatNumber(item.target_limit_price) : '--'}`
              "
            />
          </div>
        </div>
        <div class="flex items-center mt-5px">
          <span
            class="label"
            :style="{ 'min-width': localeStore.locale === 'en' ? '30px' : '20px' }"
          >
            {{ $t('to') }}
          </span>
          <div v-if="item.to_token" class="token-container">
            <div class="icon-token-container mr-5px">
              <el-image
                class="icon-token"
                :src="getSymbolDefaultIcon({logo_url: item.to_token_logo_url, symbol: item.to_token_symbol, chain: item.chain || walletStore.chain})"
                lazy
              />
              <img
                v-if="item?.chain"
                class="icon-chain"
                :src="`${ConfigStore.token_logo_url}chain/${item?.chain}.png`"
                alt=""
                srcset=""
              >
            </div>
            <span
              class="mr-5px"
              v-html="formatNumber(formatUnits(item.to_amount, item.to_token_decimals))"
            />
            <span>{{ item?.to_token_symbol || '' }}</span>
            <!-- <span class="label">(${{ item.to_price_usd ? formatNumber(item.to_price_usd) : '--' }})</span> -->
          </div>
        </div>
        <div class="flex items-center justify-between mt-5px">
          <div class="label mr-20px flex items-center">
            <span>{{ formatDate(item.created_at) }}</span>
            <span
              v-if="
                (item.status === 0 || item.status === -1) &&
                Date.now() < item.created_at * 1000 + LimitExpiredTime
              "
            >
              ({{
                $t('expiresInTime', {
                  t: dayjs(item.created_at * 1000 + LimitExpiredTime).fromNow()
                })
              }})
            </span>
          </div>
          <!-- <span class="mr-20px text-12px">{{ $f.formatDate(item.created_at) }}</span> -->
          <span
            v-if="item.status === 1 || item.status === 2"
            class="status-txt"
            :style="{ color: formatStatusColor(item) }"
          >
            {{ formatStatus(item) }}
          </span>
          <template v-else>
            <span style="flex: 1"/>
            <span
              v-if="
                item.status !== 0 ||
                ((item.status === 0 || item.status === -1) &&
                  item.created_at * 1000 + LimitExpiredTime < Date.now())
              "
              class="status-txt"
              :style="{ color: formatStatusColor(item) }"
            >
              {{ formatStatus(item) }}
            </span>
            <el-button
              v-if="
                item.from_token === NATIVE_TOKEN ||
                ((item.status === 0 || item.status === -1) &&
                  item.created_at * 1000 + LimitExpiredTime > Date.now())
              "
              class="btn-s"
              plain
              hairline
              type="primary"
              size="small"
              :loading="loading"
              :loading-text="$t('revoke')"
              loading-size="0.28rem"
              @click.stop="confirmCancel(item)"
            >
              {{ $t('revoke') }}
            </el-button>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="flex items-center">
          <span
            class="label"
            :style="{ 'min-width': localeStore.locale === 'en' ? '30px' : '20px' }"
          >
            {{ $t('from') }}
          </span>
          <div v-if="item.from_token" class="token-container">
            <div class="icon-token-container mr-5px">
              <el-image
                class="icon-token"
                :src="getSymbolDefaultIcon({logo_url: item.from_token_logo_url, symbol: item.from_token_symbol, chain: item.chain || walletStore.chain})"
                lazy
              />
              <img
                v-if="item?.chain"
                class="icon-chain"
                :src="`${ConfigStore.token_logo_url}chain/${item?.chain}.png`"
                alt=""
                srcset=""
              >
            </div>
            <span
              class="mr-5px"
              v-html="formatNumber(formatUnits(item.from_amount, item.from_token_decimals))"
            />
            <span>{{ item.from_token_symbol || '' }}</span>
            <!-- <span class="label">(${{ item.from_price_usd ? formatNumber(item.from_price_usd) : '--' }})</span> -->
          </div>
          <span style="flex: 1"/>
          <VLoading v-if="item.state === 'Sending'" class="text-16px" />
          <template v-else>
            <span class="label" :style="{color: formatSolanaStatusColor(item)}">{{ formatSolanaStatus(item) }}</span>
            <el-button v-if="(item.chain === 'solana' && item.state === 'Pending')" class="btn-s" plain hairline type="primary" size="small" :loading="loadingSolana[item.orderKey]" :loading-text="$t('revoke')" loading-size="14px"  @click.stop="confirmCancel(item)">{{ $t('revoke') }}</el-button>
          </template>
        </div>
        <div class="flex items-center mt-5px">
          <span
            class="label"
            :style="{ 'min-width': localeStore.locale === 'en' ? '30px' : '20px' }"
          >
            {{ $t('to') }}
          </span>
          <div v-if="item.to_token" class="token-container">
            <div class="icon-token-container mr-5px">
              <el-image
                class="icon-token"
                :src="getSymbolDefaultIcon({logo_url: item.to_token_logo_url, symbol: item.to_token_symbol, chain: item.chain || walletStore.chain})"
                lazy
              />
              <img
                v-if="item?.chain"
                class="icon-chain"
                :src="`${ConfigStore.token_logo_url}chain/${item?.chain}.png`"
                alt=""
                srcset=""
              >
            </div>
            <span
              class="mr-5px"
              v-html="formatNumber(formatUnits(item.to_amount, item.to_token_decimals))"
            />
            <span>{{ item?.to_token_symbol || '' }}</span>
            <!-- <span class="label">(${{ item.to_price_usd ? formatNumber(item.to_price_usd) : '--' }})</span> -->
          </div>
        </div>
        <div class="flex justify-between mt-10px" >
          <span class="label mr-20px">{{ $t('delegatePrice') }}({{ solanaPriceSymbol(item) }})</span>
          <div class="token-container flex items-end flex-col" style="align-items: end">
            <span class="text-12px" style="text-align: right;">${{ solanaPriceU(item) }}</span>
            <span class="color-666 text-12px" style="text-align: right;">({{ solanaPrice(item) }})</span>
          </div>
        </div>
        <div class="flex items-center justify-between mt-10px">
          <span class="mr-20px label">{{ $t('amount1') }}</span>
          <div v-if="solanaTarget(item)" class="color-#999 text-12px" style="text-align: right;">
            <span>{{ formatNumber(formatUnits(item.from_amount_used || 0, item.from_token_decimals)) }}/{{ formatNumber(formatUnits(item.from_amount || 0, item.from_token_decimals))}} {{ item.from_token_symbol }}</span><span class="label">({{ formatNumber(item.percent || 0)}}%)</span>
          </div>
          <div v-else class="color-#999 text-12px">
            <span>{{ formatNumber(formatUnits(item.to_amount_used || 0, item.to_token_decimals)) }}/{{ formatNumber(formatUnits(item.to_amount || 0, item.to_token_decimals))}} {{ item.to_token_symbol }}</span><span class="label">({{ formatNumber(item.percent || 0)}}%)</span>
          </div>
        </div>
        <div v-if="item.expiredAt !== undefined"  class="flex items-center justify-between mt-10px">
          <span class="mr-20px label">{{ $t('expiredTime') }}</span>
          <span class="color-#999 text-12px">{{item.expiredAt ? formatDate(item.expiredAt) : $t('never') }}</span>
        </div>
      </template>
    </li>

    <el-empty
      v-if="!tableList || tableList?.length === 0"
      :image-size="100"
      :image="themeStore.theme==='light'? imageEmptyWhite : imageEmptyBlack"
    />
  </ul>
</template>
<script setup lang="ts">
import { cancelLimitOrder, cancelSolanaLimitOrderTx, cancelSolanaLimitOrderTxV1} from '@/api/swap/limit'
import { NATIVE_TOKEN } from '@/utils/constants'
import { LimitExpiredTime } from '@/utils/wallet/utils/constants'
import BigNumber from 'bignumber.js'
import imageEmptyWhite from '@/assets/images/empty-white.svg'
import imageEmptyBlack from '@/assets/images/empty-black.svg'
import dayjs from '@/utils/day'

defineProps({
  tableList: {
    type: Array as PropType<Array<any>>,
    default: () => []
  }
})

const emit = defineEmits(['refresh'])
const walletStore = useWalletStore()
const localeStore = useLocaleStore()
const ConfigStore = useConfigStore()
const themeStore = useThemeStore()
const swapStore = useSwapStore()
const { t } = useI18n()

const loadingSolana = ref<Record<string, boolean>>({})

const loading = ref(false)

function goLink(item: {
  chain: string
  status: number
  executed_tx_hash: string
  openTx: string
  closeTx: string
  state: string
  orderKey: string
}) {
  if (item.chain === 'solana') {
    if (item?.state === 'Sending') {
      return
    }
    const txId = item?.closeTx || item?.openTx
    if (!txId) {
      return
    }
    window.open(formatExplorerUrl('solana', txId, 'tx'))

  } else if (item.status === 2) {
    console.log(item)
    window.open(formatExplorerUrl(item.chain, item.executed_tx_hash, 'tx'))
  }
}
function confirmCancel(item: { chain: string }) {
  const msg = item?.chain === 'solana' ? t('cancelOrderConfirmingSolana') : t('confirmCancelMessage')
  ElMessageBox.confirm(msg, t('cancelOrderConfirming'), {
      confirmButtonText: t('confirm'),
      cancelButtonText: t('cancel'),
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          done()
          instance.confirmButtonLoading = true
          // instance.confirmButtonText = 'Loading...'
          if (item.chain === 'solana') {
            cancelSolanaLimitOrder(item, () => {
              instance.confirmButtonLoading = false
            })
          } else {
            _cancelLimitOrder(item)
          }
        } else {
          done()
        }
      },
    })
    .then(() => {
      // this.cancelLimitOrder(item)
      // on close
    })
}

function _cancelLimitOrder(item: { chain: string; from_token?: string; from_amount?: string; to_token?: string; to_min_amount?: string; salt?: string; id?: string; order_id?: string; orderKey?: string; version?: any }) {
  if (item.chain === 'solana') {
    cancelSolanaLimitOrder(item)
    return
  }
  const data = {
    fromToken: item.from_token || '',
    fromAmount: item.from_amount || '0',
    toToken: item.to_token || '',
    minReturn: item.to_min_amount || '0',
    salt: item.salt || '0',
    id: item.id || '',
    order_id: item.order_id || ''
  }
  loading.value = true
  cancelLimitOrder(data)
    .then((res: any) => {
      console.log(res)
      ElMessage.success(t('cancelledOrderSuccessfully'))
      emit('refresh', item)
    })
    .catch((err: any) => {
      handleError(err)
    })
    .finally(() => {
      loading.value = false
    })
}

function cancelSolanaLimitOrder(item: any, fun?: () => void) {
  loadingSolana.value[item.orderKey] = true
  const cancelFun = item?.version === 'v1' ? cancelSolanaLimitOrderTxV1 : cancelSolanaLimitOrderTx
  return cancelFun(item.orderKey).then((res: { wait: () => any }) => {
    console.log(res)
    if (fun) {
      fun()
    }
    return res.wait()
  }).then((res: any) => {
    console.log(res)
    refreshTokenBalance(item)
    setTimeout(() => {
      emit('refresh', item, loadingSolana.value)
    }, 3000)
  }).catch((err: any) => {
    handleError(err, 'solana')
    loadingSolana.value[item.orderKey] = false
  }).finally(() => {
    // this.loading = false
  })
}

function refreshTokenBalance(item: { chain: string; from_token: string }) {
  if (!(item.chain === 'solana' || item.from_token === NATIVE_TOKEN)) {
    return
  }
  swapStore.getTokenDetails()
}

function formatStatus(item: { status: number; created_at: number }) {
  if (
    (item.status === 0 || item.status === -1) &&
    item.created_at * 1000 + LimitExpiredTime < Date.now()
  ) {
    return t('expired1')
  }
  const status = item.status
  const statusObj: Record<number, string> = {
    0: '',
    1: t('cancelled'),
    2: t('completed'),
    3: t('unknownError1'),
    7: t('unknownError1'),
    4: t('notEnoughBalance'),
    5: t('insufficientSlippage1'),
    8: t('insufficientSlippage1'),
    6: t('transferFailed'),
    // nonce 错误
    10: t('fail1'),
    // 上链失败
    11: t('fail1'),
    // 签名错误
    12: t('fail1'),
    13: t('fail1'),
    // '-1': t('triggerPriceNotReached')
    '-1': ''
  }
  return statusObj[status] ?? status
}

function formatStatusColor(item: { status: number; created_at: number }) {
  if ((item.status === 0 || item.status === -1) && (item.created_at * 1000 + LimitExpiredTime) < Date.now()) {
    return '#999999'
  }
  const status = item.status
  if (status === 1 || status === 10 || status === 11 || status === 12) {
    return '#999999'
  } else if (status === 2) {
    return '#12B886'
  } else if (status === 0) {
    return '#286DFF'
  } else {
    return '#FF0000'
  }
}

function solanaTarget(item: { from_token: string; to_token: string }) {
  const tokens = ['So11111111111111111111111111111111111111112', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB']
  const i = tokens.indexOf(item.from_token)
  const j = tokens.indexOf(item.to_token)
  return i <= j
}

function solanaPriceSymbol(item: { from_token_symbol: string; to_token_symbol: string; from_token: string; to_token: string }) {
  if (solanaTarget(item)) {
    return item?.from_token_symbol || ''
  } else {
    return item?.to_token_symbol || ''
  }
}

function solanaPriceU(item: { to_amount?: any; from_token_decimals?: any; to_token_decimals?: any; to_token_price?: any; from_amount?: any; from_token_price?: any; from_token: string, to_token: string }) {
  if (solanaTarget(item)) {
    return formatNumber(new BigNumber(item.to_amount).times(10 ** (item?.from_token_decimals - item?.to_token_decimals)).times(item?.to_token_price || 0).div(item.from_amount).toFixed())
  } else {
    return formatNumber(new BigNumber(item.from_amount).times(10 ** (item?.to_token_decimals - item?.from_token_decimals)).times(item?.from_token_price || 0).div(item.to_amount).toFixed())
  }
}

function solanaPrice(item: { to_amount: number; from_token_decimals?: any; to_token_decimals?: any; from_amount?: any; to_token_symbol?: any; from_token_symbol?: any; from_token: string; to_token: string }) {
  if (solanaTarget(item)) {
    return formatNumber(item.to_amount * (10 ** (item?.from_token_decimals - item?.to_token_decimals)) / item.from_amount) + ' ' + (item?.to_token_symbol || '') + ' per ' + (item?.from_token_symbol || '')
  } else {
    return formatNumber(item.from_amount * (10 ** (item?.to_token_decimals - item?.from_token_decimals)) / item.to_amount) + ' ' + (item?.from_token_symbol || '') + ' per ' + (item?.to_token_symbol || '')
  }
}

function formatSolanaStatus(item: { state: string; expiredAt: null }) {
  // let stateList = ['Pending', 'Completed', 'Cancelled', 'Expired', 'Failed']
  if (item?.state === 'Pending' && item?.expiredAt !== null && Date.now() > Number(item?.expiredAt || 0) * 1000) {
    return t('expired1')
  }
  const state = item.state
  const statusObj: { [key: string]: string } = {
    Pending: '',
    Completed: t('completed'),
    Cancelled: t('cancelled'),
  }
  return statusObj[state] ?? state
}

function formatSolanaStatusColor(item: { state: string; expiredAt: null }) {
  // let stateList = ['Pending', 'Completed', 'Cancelled', 'Expired', 'Failed']
  if (item?.state === 'Pending' && item?.expiredAt !== null && Date.now() > Number(item?.expiredAt || 0) * 1000) {
    return '#999999'
  }
  const state = item.state
  const statusObj: { [key: string]: string } = {
    Pending: '',
    Completed: '#12B886',
    Cancelled: '#999999',
  }
  return statusObj[state] ?? '#286DFF'
}

// function _getSolanaLimitOrderTradeHistory(item, index) {
//   if (item.state === 'Completed' && !item?.orders?.length) {
//     return getSolanaLimitOrderTradeHistory({wallet: walletStore.address}).then(res => {
//       const orders = res?.filter(i => i.order.id === item.id)
//       if (orders?.length > 0) {
//         item = {...item, orders}

//         this.tableList?.splice?.(index, 1, item)
//       }
//       return Promise.resolve(item)
//     })
//   } else {
//     return Promise.resolve(item)
//   }
// }

</script>
<style lang="scss" scoped>
.tx-li-item {
  padding: 5px 0;
  // background-color: #fff;
  text-align: left;
  font-size: 12px;
  color: #999;
  letter-spacing: 0;
  font-weight: 400;
  &:not(:last-child) {
    border-bottom: 1px solid var(--d-333-l-F5F5F5);
  }
  .label {
    font-size: 12px;
    color: var(--d-999-l-666);
    letter-spacing: 0;
    font-weight: 400;
    min-width: 20px;
    margin-right: 5px;
  }
  &:first-child {
    padding-top: 0;
  }
}

.token-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-token-container {
  display: inline-block;
  position: relative;
  .icon-network {
    font-size: 12px;
    position: absolute;
    bottom: 1px;
    right: -4px;
    border-radius: 50%;
    border: 1px solid #fff;
  }
}

.btn-s {
  min-width: 50px;
  height: 22px;
  margin-left: 5px;
  --van-black: transparent;
  --el-button-plain-background-color: transparent;
}
.status-txt {
  font-size: 12px;
  // color: #999999;
  letter-spacing: 0;
  font-weight: 400;
}

.icon-token-container {
  display: inline-block;
  font-size: 15px;
  margin-right: 5px;
  position: relative;
  .icon-token {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .icon-chain {
    width: 12px;
    // font-size: 14px;
    position: absolute;
    bottom: 0px;
    right: -3px;
    border-radius: 50%;
    border: 1px solid var(--d-333-l-F5F5F5);
  }
}


</style>
