<template>
  <el-dialog v-model="show" width="446px">
    <template #header>
      <span v-if="activeShow === 1">{{ $t('swap') }}</span>
      <span v-else-if="activeShow === 2">
        {{ $t('waitForConfirming') }}
      </span>
      <span v-else-if="activeShow === 3">
        {{ $t('tradeSubmitted') }}
      </span>
    </template>
    <template v-if="activeShow == 1">
      <ul class="swap-info">
        <li class="swap-info_item header">
          <div class="header-li">
            <div class="header-li_left">
              <span class="color-#80838B mr-15px">{{ $t('sell') }}</span>
              <img
                class="icon-token"
                :src="getSymbolDefaultIcon({
                  symbol: swapInfo.fromToken.symbol || '',
                  logo_url: swapInfo.fromToken.logo_url || '',
                  chain: swapInfo.fromToken.chain || props.chain || ''
                })"
                alt=""
                onerror="this.src='/icon-default.png'"
                height="20"
              >
              <span style="font-size: 14px;">{{ swapInfo.fromToken.symbol }}</span>
            </div>
            <div class="header-li_right" v-html="formatNumber(swapInfo?.fromAmount || formatUnits(swapInfo.fromTokenAmount || 0, swapInfo.fromToken.decimals)) || '0'"/>
          </div>
          <div class="header-li mt-34px">
            <div class="header-li_left">
              <span class="color-80838B mr-15px">{{ $t('buy') }}</span>
              <img
                class="icon-token"
                :src="getSymbolDefaultIcon({
                  symbol: swapInfo.toToken.symbol || '',
                  logo_url: swapInfo.toToken.logo_url || '',
                  chain: swapInfo.toToken.chain || props.chain || ''
                })"
                alt=""
                onerror="this.src='/icon-default.png'"
                height="20"
              >
              <span style="font-size: 14px;">{{ swapInfo.toToken.symbol }}</span>
            </div>
            <div class="header-li_right" v-html="formatNumber(swapInfo?.toAmount || formatUnits(swapInfo.toTokenAmount || 0, swapInfo.toToken.decimals)) || '0'"/>
          </div>
        </li>
        <li class="swap-info_item">
          <div class="swap-info_item-label">{{ $t('price') }}</div>
          <div class="swap-info_item-value">
            <div class="p-item" v-html="`1 ${ swapInfo.fromToken.symbol } = ${getPrice(swapInfo?.fromAmount || formatUnits(swapInfo.fromTokenAmount || 0, swapInfo.fromToken.decimals), swapInfo?.toAmount || formatUnits(swapInfo.toTokenAmount || 0, swapInfo.toToken.decimals))} ${ swapInfo.toToken.symbol }`"/>
            <div class="p-item" v-html="`1 ${ swapInfo.toToken.symbol } = ${getPrice(swapInfo?.toAmount || formatUnits(swapInfo.toTokenAmount || 0, swapInfo.toToken.decimals), swapInfo?.fromAmount || formatUnits(swapInfo.fromTokenAmount || 0, swapInfo.fromToken.decimals))} ${ swapInfo.fromToken.symbol }`"/>
          </div>
        </li>
        <!-- <li class="swap-info_item" v-if="priceUpdated">
          <div class="price-change flex-between">
            <span class="color-80838B font-14">{{ $t('priceUpdated') }}</span>
            <el-button class="swap-button" block type="primary" size="large" @click="accept">
              {{ $t('accept') }}
            </el-button>
          </div>
        </li> -->
        <li
          v-if="
            !(
              (swapInfo.fromToken.isWrapper && swapInfo.toToken.isETH) ||
              (swapInfo.toToken.isWrapper && swapInfo.fromToken.isETH)
            )
          "
          class="swap-info_item"
        >
          <div class="swap-info_item-label">{{ $t('slippage') }}</div>
          <div class="swap-info_item-value">{{ slippage }}%</div>
        </li>
        <li v-if="swapInfo.gasValue && chain !== 'tron' && chain !== 'solana'" class="swap-info_item">
          <div class="swap-info_item-label">{{ $t('estimatedGas') }}</div>
          <div class="swap-info_item-value">≈ ${{ getEstimatedFee(swapInfo.gasValue) }}</div>
        </li>
        <template
          v-if="
            !(
              (swapInfo.fromToken.isWrapper && swapInfo.toToken.isETH) ||
              (swapInfo.toToken.isWrapper && swapInfo.fromToken.isETH)
            )
          "
        >
          <li v-if="!swapInfo.isAmountOut" class="swap-info_item">
            <div class="swap-info_item-label">{{ $t('minimumReceived') }}</div>
            <div class="swap-info_item-value">
              {{ minReceived }} {{ swapInfo?.toToken?.symbol }}
            </div>
          </li>
          <li v-else class="swap-info_item">
            <div class="swap-info_item-label">{{ $t('maximumReceived') }}</div>
            <div class="swap-info_item-value">{{ maxSold }} {{ swapInfo?.fromToken?.symbol }}</div>
          </li>
        </template>
        <li class="swap-info_item">
          <div class="swap-info_item-label">{{ $t('tokenRoute') }}</div>
          <div
            v-if="
              !(
                (swapInfo.fromToken.isWrapper && swapInfo.toToken.isETH) ||
                (swapInfo.toToken.isWrapper && swapInfo.fromToken.isETH)
              )
            "
            class="swap-info_item-value path-list"
          >
            <template v-for="(i, k) in swapRouterPath" :key="k">
              <span v-if="i.symbol">{{ i.symbol }}</span>
              <div class="path-amm">
                <el-image
                  v-if="i.nextAmm && i.nextAmm !== 'unknown'"
                  :src="formatIconSwap(i.nextAmm)"
                  style="width: 14px; height: 14px; border-radius: 10px; margin-bottom: 3px"
                >
                  <template #error>
                    <img
                      style="width: 14px; border-radius: 10px"
                      src="/icon-default.png"
                    >
                  </template>
                  <template #placeholder>
                    <img
                      style="width: 14px; border-radius: 10px"
                      src="/icon-default.png"
                    >
                  </template>
                </el-image>
                <img
                  v-if="k !== swapRouterPath.length - 1"
                  style="width: 15px; margin: 0 5px 0"
                  src="@/assets/images/arrow-right.svg"
                  alt=""
                  srcset=""
                >
              </div>
            </template>
          </div>
          <div v-else>
            <template v-for="(i, k) in swapRouterPath" :key="k">
              <img
                v-if="k !== 0"
                style="width: 15px; margin: 0 5px 0"
                src="@/assets/images/arrow-right.svg"
                alt=""
                srcset=""
              >
              <span v-if="i.symbol">{{ i.symbol }}</span>
            </template>
          </div>
        </li>
        <li v-if="swapInfo?.transaction" class="swap-info_item">
          <div class="swap-info_item-label">{{ $t('txHash') }}</div>
          <div class="swap-info_item-value">
            <a :href="formatExplorerUrl(chain, swapInfo.transaction, 'tx')" target="_blank">
              {{ swapInfo?.transaction?.slice(0, 6) + '...' + swapInfo?.transaction?.slice(-6) }}
            </a>
            <Icon
              v-copy="swapInfo?.transaction"
              name="bxs:copy"
              class="clickable ml-5px"
            />
          </div>
        </li>
      </ul>
      <div class="footer">
        <el-button
          class="swap-button w-full"
          type="primary"
          size="large"
          :loading="loading"
          :loading-text="$t('confirming')"
          block
          :disabled="priceUpdated"
          @click.stop="submitSwap"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
    <template v-else-if="activeShow === 2">
      <div class="swap-info center">
        <el-icon :size="110" color="#747782" style="animation: rotating 2s linear infinite normal">
          <Refresh />
        </el-icon>
        <span class="mt-20px">{{ $t('plsConfirmWallet') }}</span>
      </div>
    </template>
    <template v-else-if="activeShow === 3">
      <div class="swap-info center">
        <Icon name="lineicons:arrow-up-circle" class="text-110px" />
        <span class="mt-20px">{{ $t('plsViewBlockChainExplorer') }}</span>
      </div>
      <div class="footer">
        <el-button class="swap-button w-full" type="primary" size="large" block @click.stop="goLink">
          {{ $t('viewTransition') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { formatNumber } from '@/utils/formatNumber'
import { Refresh } from '@element-plus/icons-vue'
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  swapInfo: {
    type: Object,
    default: () => ({})
  },
  slippage: {
    type: String,
    default: '2'
  },
  loading: {
    type: Boolean,
    default: false
  },
  chain: {
    type: String,
    default: ''
  },
  nativePrice: {
    type: [Number, String] as PropType<number | string>,
    default: 0
  },
  gasPrice: {
    type: String,
    default: '0'
  },
  activeShow: {
    type: Number,
    default: 0
  },
  swapQuoteInfo: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const priceUpdated = ref(false)
const show = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})
const minReceived = computed(() => {
  const decimals = props.swapInfo?.toToken?.decimals || 0
  const toAmount = props.swapInfo?.toAmount
  if (toAmount) {
    return formatNumber((new BigNumber(toAmount || 0)).times(100 - Number(props.slippage)).div(100).toFixed())
  }
  return formatNumber(formatUnits((new BigNumber(props.swapInfo?.toTokenAmount || 0)).times(100 - Number(props.slippage)).div(100).toFixed(0), decimals))
})
const maxSold = computed(() => {
  const decimals = props.swapInfo?.fromToken?.decimals || 0
  const fromAmount = props.swapInfo?.fromAmount
  if (fromAmount) {
    return formatNumber((new BigNumber(fromAmount || 0)).times(100 + Number(props.slippage)).div(100).toFixed())
  }
  return formatNumber(formatUnits((new BigNumber(props.swapInfo?.fromTokenAmount || 0)).times(100 + Number(props.slippage)).div(100).toFixed(0), decimals))
})
const swapRouterPath = computed(() => {
  return props.swapInfo?.swapRouterPath || []
})
watch(() => props.visible, (val) => {
  if (val) {
    priceUpdated.value = false
  }
})

function getPrice(from: string, to: string) {
  if (!from || !to || isNaN(Number(from)) || isNaN(Number(to))) {
    return '0'
  }
  return formatNumber(new BigNumber(to).div(from).toFixed()) || '0'
}

function getEstimatedFee(gasValue: string) {
  if (!gasValue) {
    return '0'
  }
  return (
    Number(
      new BigNumber(gasValue.toString())
        .times(props.nativePrice)
        .times(props.gasPrice)
        .div(String(10 ** 18))
        .toFixed(2)
    ) || '0'
  )
}

function submitSwap() {
  emit('submit')
}

function goLink() {
  show.value = false
  const url = formatExplorerUrl(props.chain, props.swapInfo.transaction, 'tx')
  window.open(url)
}


</script>

<style lang="scss" scoped>
.swap-title {
  font-size: 16px;
  color: #eaecef;
  font-weight: 400;
  margin-bottom: 25px;
  text-align: center;
}
.swap-info {
  border-radius: 10px;
  font-size: 14px;
  color: #80838b;
  font-weight: 400;
  &.center {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 20px 0 40px;
  }
  .swap-info_item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    & + .swap-info_item {
      margin-top: 15px;
    }
    font-size: 12px;
    color: var(--custom-text-1-color);
    font-weight: 400;
    .swap-info_item-label {
      font-size: 12px;
      color: #80838b;
    }
    .swap-info_item-value {
      // color: #000;
      text-align: right;
      .p-item + .p-item {
        margin-top: 10px;
      }
    }
    &.header {
      flex-direction: column;
      align-items: center;
      .header-li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .header-li_left {
          display: flex;
          align-items: center;
        }
        .header-li_right {
          font-size: 14px;
        }
      }
      .swap-info_item-value {
        display: flex;
        align-items: center;
      }
      .icon-token {
        height: 24px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
    &.bottom-line {
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(135, 143, 188, 0.3);
    }
  }
}

.switch-box {
  margin: 10px 0;
  text-align: center;
  .switch-icon {
    font-size: 14px;
    font-weight: bolder;
    color: var(--van-color-primary);
    padding: 8px;
    border-radius: 50%;
    background: #dde6f7;
  }
}

.footer {
  display: flex;
  margin-top: 35px;
  justify-content: center;
  padding-bottom: 10px;
  .submit-button {
    background-color: #545aea33;
    border: 1px solid #545aea33;
    border-radius: 10px;
    width: 100%;
    color: #eaecef;
    &:hover {
      opacity: 0.8;
    }
  }
}
.icon-copy {
  margin-left: 5px;
  &:active {
    opacity: 0.5;
  }
}
.path-list {
  display: flex;
  justify-content: center;
  align-items: center;
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
.swap-button.el-button--default {
  background-color: var(--custom-primary-color);
  border: 1px solid var(--custom-primary-color);
  border-radius: 10px;
  color: #eaecef;
  &:hover {
    background-color: #545aea33;
    border: 1px solid #545aea33;
  }
  &.is-disabled {
    background-color: #545aea33;
    border: 1px solid #545aea33;
    &:hover {
      background-color: #545aea33;
      border: 1px solid #545aea33;
    }
  }
}
.price-change {
  background: #212847;
  border-radius: 10px;
  padding: 15px;
  width: 100%;
}
</style>
