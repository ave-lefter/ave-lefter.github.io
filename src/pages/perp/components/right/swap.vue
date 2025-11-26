<template>
  <el-tabs v-model="swapType" class="select-tabs mt-5px">
    <el-tab-pane v-for="(item, index) in types" :key="index" :label="item.name" :name="item.value"/>
  </el-tabs>
  <el-form :model="form" label-width="auto">
    <el-form-item label="" prop="amount">
      <el-input v-model="form.amount" placeholder="0.0" size="large"  clearable class="input-number mt-12px" input-style="text-align:right" @input="percent = 0"  @update:model-value="value => watchAmount(value)">
        <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ isValue ? $t('value1') :  $t('amount') }}</span>
        </template>
        <template #append>
          <el-dropdown placement="bottom" trigger="click" @visible-change="visible => show = visible">
            <div class="inline-flex items-center clickable">
              <span>{{  perpStore.unit?.coinName || ''  }}</span>
              <Icon class="arrow-up" :class="{ active: show === true }" name="solar:alt-arrow-down-bold" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="item in (perpStore.unitList || [])" :key="item?.coinId" @click.stop="switchPerpCoin(item)">
                  <span class="text-12px font-400">{{ item?.coinName || '' }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-input>
      <div class="mt-16px px-3px w-full">
        <el-slider
          v-model="percent"
          :min="0"
          :max="100"
          :step="1"
          :marks="{
            0: '',
            25: '',
            50: '',
            75: '',
            100: '',
          }"
          :format-tooltip="value => `${value}%`"
          class="[&&]:[--el-slider-button-size:8px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] [&&]:[--el-slider-runway-bg-color:--icon-color] slider-box"
          @input="value => sliderInput(value as number)"
        />
      </div>
    </el-form-item>
    <el-form-item>
      <div class="w-full flex item-center">
        <el-button
          class="flex-1 color-[--white]! min-h-48px rd-6px!"
          color="var(--up-color)"
          native-type="button"
          size="large"
          @click.stop="buy"
        >
          {{ $t('buy') }}/{{ $t('long') }}
        </el-button>
        <el-button
          class="flex-1 color-[--white]! min-h-48px rd-6px!"
          color="var(--down-color)"
          native-type="button"
          size="large"
          @click.stop="sell"
        >
          {{ $t('sell') }}/{{ $t('short') }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>


  <div class="flex items-center justify-between text-12px font-400 mt-8px color-[--main-text]">
    <div class="text-left">
      <div class="color-[--third-text] mb-5px"> {{ $t('buy') }}: </div>
      <div class="font-500"> ≈ {{ formatNumber(form.amount, 4) }} {{ perpStore.unit?.coinName || '' }}</div>
    </div>
    <div class="text-right">
      <div class="color-[--third-text] mb-5px"> {{ $t('sell') }}: </div>
      <div class="font-500"> ≈ {{ formatNumber(form.amount, 4) }} {{ perpStore.unit?.coinName || '' }}</div>
    </div>
  </div>
  <el-divider style="--el-border-color: var(--main-divider);margin: 16px 0;" />
  <ul class="text-12px color-[--third-text]">
    <li class="flex items-center">
      <span class="mr-auto">{{ $t('margin') }}</span>
      <span class="color-[--main-text]">{{ formatNumber(perpMargin, 4) }} USD</span>
    </li>
    <li class="flex items-center mt-8px">
      <span class="mr-auto">Max: </span>
      <span class="color-[--up-color]">{{ formatNumber(maxAmount, 4) }} USD</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ formatNumber(maxAmount, 4) }}  USD</span>
    </li>
    <li class="flex items-center mt-8px">
      <span class="mr-auto">预估强平价</span>
      <span class="color-[--up-color]">0.000 USD</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">0.000 USD</span>
    </li>
    <li class="flex items-center mt-8px">
      <span class="mr-auto">手续费</span>
      <span class="color-[--up-color]">接单 {{ formatNumber(feeRate.takerFeeRate) }}%</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">挂单 {{ formatNumber(feeRate.makerFeeRate) }}%</span>
    </li>
  </ul>

</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'
import BigNumber from 'bignumber.js'

const { t } = useI18n()
const perpStore = usePerpStore()
const swapType = shallowRef<'LIMIT' | 'MARKET'>('LIMIT')
const types = computed(() => {
  return [
    { value: 'LIMIT', name: t('limit') },
    { value: 'MARKET', name: t('market') },

  ] as const
})

const { createPerpOrder } = usePerp()

const form = reactive({
  amount: '',
  reduceOnly: false,

})
const show = ref(false)

const percent = ref(0)

const perpMargin = computed(() => {
  const contractId = perpStore.perp?.contractId || ''
  return getMarginFromContractId({ contractId: contractId, size: form.amount || '0' })
})

const feeRate = computed(() => {
  const { takerFeeRate, makerFeeRate } =  getFeeRate(perpStore.perp?.contractId || '')
  return { takerFeeRate: BigNumber(takerFeeRate).times(100).toFixed(), makerFeeRate: BigNumber(makerFeeRate).times(100).toFixed() }
})

const maxAmount = computed(() => {
  const accountId = perpStore.userInfo?.id || ''
  const _amount = perpStore.collateral?.find(item => item.accountId === accountId)?.amount
  return _amount || '0'
})

function sliderInput(percent: number) {
  const accountId = perpStore.userInfo?.id || ''
  const _amount = perpStore.collateral?.find(item => item.accountId === accountId)?.amount
  if (isValue.value) {
    const a = BigNumber(percent).times(_amount || '0').div(100).toFixed()
    form.amount = formatMinSize(a)
  } else {
    const price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
    const a = BigNumber(percent).times(_amount || '0').div(100).div(price).toFixed()
    form.amount = formatMinSize(a)
  }
}

const isValue = computed(() => {
  return perpStore.unit?.coinId === perpStore.perp?.quoteCoinId
})

function watchAmount(value: string) {
  form.amount = formatMinSize(value)
}

function formatMinSize(value: string, _isValue = isValue.value) {
  const _amount = value?.replace?.(/-|[^\d.]/g, '')
  if (_amount === '') {
    return ''
  }
  if (/^0\.0*$/.test(_amount) || _amount === '0') {
    return _amount
  }
  // 格式化 最小单位
  const { tickSize, stepSize } = perpStore.perp || {}
  if (_isValue) {
    if (new BigNumber(_amount).lt(tickSize || '0')) {
      return  tickSize ||'0'
    }
    return toTick(_amount, tickSize || '0')
  } else {
    if (new BigNumber(_amount).lt(stepSize || '0')) {
      return  stepSize ||'0'
    }
    return toTick(_amount, stepSize || '0')
  }
}

function switchPerpCoin(item: typeof perpStore.unit) {
  perpStore.unit = item
  if (form.amount) {
    const price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
    const _isValue = perpStore.unit?.coinId === perpStore.perp?.quoteCoinId
    if (_isValue) {
      const _amount = BigNumber(price).times(form.amount).toFixed()
      form.amount = formatMinSize(_amount, _isValue)
    } else {
      const _amount = BigNumber(form.amount).div(price).toFixed()
      form.amount = formatMinSize(_amount, _isValue)
    }
  }
}

function getSize() {
  if (isValue.value) {
    const price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
    return formatDec(BigNumber(form.amount).div(price).toFixed(), 4)
  } else {
    return form.amount
  }
}

function buy() {
  // createPerpOrder, createOrderDialogTitle
  createPerpOrder({
    type: swapType.value,
    size: getSize(),
    price: perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0',
    side: 'BUY',
    contractId: perpStore.perp?.contractId || '',
    reduceOnly: form.reduceOnly,
    isPositionTpsl: false,
    isSetOpenTp: false,
    isSetOpenSl: false
  })

}

function sell() {

}

</script>

<style lang="scss" scoped>
.select-tabs {
  :deep() {
    --el-border-color-light: var(--icon-color);
    .el-tabs__item {
      font-size: 14px;
      font-weight: 400;
      padding: 0 10px;
      --el-text-color-primary: var(--third-text);
      cursor: pointer;
      &.is-active {
        color: var(--main-text);
      }
      &:hover:not(.is-active) {
        color: var(--third-text);
      }
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__active-bar {
      height: 2px;
      background-color: var(--main-text);
    }
    .el-tabs__nav-wrap::after {
      height: 0.5px;
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
    --el-fill-color-light: var(--border);
    min-width: 70px;
    padding: 0 12px;
  }
  :deep() .el-input__wrapper {
    padding: 1px 0;
  }
}

.slider-box :deep() {
  .el-slider__stop {
    --el-slider-height: 8px;
    // --el-slider-stop-bg-color: var(--icon-color);
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
  }
}

</style>
