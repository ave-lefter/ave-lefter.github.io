<template>
  <el-dialog v-model="show" width="446px">
    <template #header>
      <template v-if="activeShow === 1">
        <span v-if="limitInfo.orderType === 0">{{ limitInfo.activeTab === 0 ? $t('limitBuy') : $t('limitSell')  }}</span>
        <span v-if="limitInfo.orderType === 1">{{ limitInfo.activeTab === 0 ? $t('stopLimitBuy') : $t('stopLimitSell')  }}</span>
      </template>
      <span v-else-if="activeShow === 2" >
        {{ $t('waitForConfirming') }}
      </span>
      <span v-else-if="activeShow === 3" >
        <!-- {{ $t('tradeSuccess') }} -->
        {{ $t('tradeConfirmed') }}
      </span>
    </template>
    <template v-if="activeShow == 1">
      <ul class="swap-info">
        <li v-if="limitInfo.orderType === 1" class="swap-info_item">
          <div class="swap-info_item-label">{{ $t('limitEffective') }}</div>
          <div class="swap-info_item-value" v-html="$t('triggerPriceEffective', {symbol: limitInfo.activeTab === 1 ? (limitInfo?.fromToken?.symbol || '') : (limitInfo?.toToken?.symbol || ''), price: formatNumber(limitInfo?.triggerPrice || 0)})"/>
        </li>
        <template v-if="limitInfo.activeTab === 0">
          <li class="swap-info_item" >
            <div class="swap-info_item-label">{{ $t('limitBuy') }}</div>
            <div class="swap-info_item-value">
              <img class="icon-token" :src="formatLogo(limitInfo.toToken)" alt="" height="20">
              <span v-html="formatNumber(limitInfo.toAmount || 0)"/>
              <span class="ml-5px">{{ (limitInfo?.toToken?.symbol || '') }}</span>
            </div>
          </li>
          <li class="swap-info_item" >
            <div class="swap-info_item-label">{{ $t('limitPrice') }}({{limitInfo.activeTab === 1 ? (limitInfo?.fromToken?.symbol || '') : (limitInfo?.toToken?.symbol || '')}})</div>
            <div class="swap-info_item-value">
              <span v-html="`$${ formatNumber(limitInfo.targetLimitPrice || 0) }`"/>
              <span style="color: var(--custom-primary-color);">({{ $t('auto-submitWhenPriceBuy') }})</span>
            </div>
          </li>
          <li class="swap-info_item" >
            <div class="swap-info_item-label">{{ $t('expectedPayment') }}</div>
            <div class="swap-info_item-value">
              <img class="icon-token" :src="formatLogo(limitInfo.fromToken)" alt="" height="20">
              <span v-html="formatNumber(limitInfo.fromAmount || 0)"/>
              <span class="ml-5px">{{ (limitInfo?.fromToken?.symbol || '') }}</span>
            </div>
          </li>
        </template>
        <template v-if="limitInfo.activeTab === 1">
          <li class="swap-info_item" >
            <div class="swap-info_item-label">{{ $t('limitSell') }}</div>
            <div class="swap-info_item-value">
              <img class="icon-token" :src="formatLogo(limitInfo.fromToken)" alt="" height="20">
              <span v-html="formatNumber(limitInfo.fromAmount || 0)"/>
              <span class="ml-5">{{ (limitInfo?.fromToken?.symbol || '') }}</span>
            </div>
          </li>
          <li class="swap-info_item" >
            <div class="swap-info_item-label">{{ $t('limitPrice') }}({{limitInfo.activeTab === 1 ? (limitInfo?.fromToken?.symbol || '') : (limitInfo?.toToken?.symbol || '')}})</div>
            <div class="swap-info_item-value">
              <span v-html="`$${ formatNumber(limitInfo.targetLimitPrice || 0) }`"/>
              <span style="color: var(--custom-primary-color);">({{ $t('auto-submitWhenPriceSell') }})</span>
            </div>
          </li>
          <li class="swap-info_item" >
            <div class="swap-info_item-label">{{ $t('expectedReceivable') }}</div>
            <div class="swap-info_item-value">
              <img class="icon-token" :src="formatLogo(limitInfo.toToken)" alt="" height="20">
              <span v-html="formatNumber(limitInfo.toAmount || 0)"/>
              <span class="ml-5">{{ (limitInfo?.toToken?.symbol || '') }}</span>
            </div>
          </li>
        </template>
        <li v-if="chain !== 'solana'" class="swap-info_item" >
          <div class="swap-info_item-label">{{ $t('estimateGas') }}</div>
          <div class="swap-info_item-value" style="text-align: right;" v-html="$t('estimateGasTips', {n: formatNumber(limitGasU ?? 1, 1)})"/>
        </li>
        <template v-if="chain !== 'solana'">
          <li class="swap-info_item tips warning">* {{ $t('limitFeeTip') }}</li>
          <li class="swap-info_item tips warning">* {{ $t('limitTokenTips') }}</li>
          <li v-if="limitInfo?.fromToken?.address === NATIVE_TOKEN" class="swap-info_item tips warning">
            {{ $t('limitTips1') }}
          </li>
          <li v-else class="swap-info_item tips warning">
            {{ $t('limitTips2') }}
          </li>
        </template>
      </ul>
      <div class="footer" :style="{'padding-bottom': chain !== 'solana' ? '10px' : '0'}">
        <el-button
          class="swap-button w-full"
          type="primary"
          size="large"
          :loading="loading"
          :loading-text="$t('confirming')"
          block
          @click.stop="emit('submit')"
        >
          {{ $t('confirm') }}
        </el-button>
      </div>
    </template>
    <template v-else-if="activeShow == 2">
      <div class="swap-info center">
        <el-icon :size="110" color="#747782" style="animation: rotating 2s linear infinite normal">
          <Refresh />
        </el-icon>
        <span class="mt-20">{{ $t('plsConfirmWallet') }}</span>
      </div>
    </template>
    <template v-else-if="activeShow == 3">
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
    <!-- <template v-else-if="activeShow==4">
      <div class="swap-info center">
          <i class="iconfont icon-icon_cancle font-110"></i>
          <span class="mt-20">{{ $t('tradeFail') }}</span>
      </div>
    </template> -->
  </el-dialog>
</template>

<script lang="ts" setup>
import { NATIVE_TOKEN } from '@/utils/constants'
import { Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  limitInfo: {
    type: Object as any,
    default: () => {}
  },
  loading: {
    type: Boolean,
    default: false
  },
  chain: {
    type: String,
    default: ''
  },
  limitGasU: {
    type: String,
    default: ''
  },
  activeShow: {
    type: Number as PropType<0 | 1 | 2 | 3>,
    default: 0
  },
})

const emit = defineEmits(['update:visible', 'submit'])

const show = computed({
  get() {
    return props.visible
  },
  set(value) {
    emit('update:visible', value)
  }
})

function formatLogo(token: any) {
  if (token.logoURI && !token?.logoURI?.includes('empty-token')) {
    return token.logoURI
  }
  return getSymbolDefaultIcon({
    symbol: token?.symbol,
    chain: token?.chain,
    logo_url: token?.logo_url
  })
}

function goLink() {
  window.open(formatExplorerUrl(props.chain, props.limitInfo.transaction, 'tx'))
}

</script>

<style lang="scss" scoped>
.swap-info {
  border-radius: 10px;
  font-size: 14px;
  color: #333333;
  font-weight: 400;
  padding-top: 10px;
  .swap-info_item {
    font-size: 12px;
    color: #999999;
    letter-spacing: 0;
    font-weight: 400;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    & + .swap-info_item {
      margin-top: 15px;
    }
    &.tips {
      + .tips {
        margin-top: 5px;
      }
      line-height: 1.2;
      &.danger {
        color: #F81111;
      }
      &.warning {
        color: #f8be46;
      }
    }
    .swap-info_item-value {
      flex-wrap: wrap;
      flex: 1;
      font-size: 14px;
      color: var(--d-F5F5F5-l-333);
      letter-spacing: 0;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}


.switch-box {
  margin: 10px 0;
  text-align: center;
  .switch-icon {
    font-size: 14px;
    font-weight: bolder;
    color: var(--primary-color);
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
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
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
.icon-token {
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
}
.ml-5 {
  margin-left: 5px;
}
</style>
