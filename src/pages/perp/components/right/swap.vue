<template>
  <el-tabs v-model="swapType" class="select-tabs mt-5px mb-12px">
    <el-tab-pane v-for="(item, index) in types" :key="index" :label="item.name" :name="item.value"/>
  </el-tabs>
  <div class="text-12px color-[--third-text] mb-12px text-right">{{ $t('availableBalance') }}: {{ formatNumber(availableBalance, 4) }} USD</div>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" @submit.prevent>
    <el-form-item v-if="swapType === 'LIMIT'" label="" prop="price" style="margin-bottom: 15px;">
      <el-input v-model="form.price" :placeholder="$t('price')" size="large"  clearable class="input-number" input-style="text-align:left"  @update:model-value="value => watchPrice(value)">
        <template #append>
          <div class="inline-flex items-center">
            <span class="text-14px color-[--main-text]">USD</span>
            <div class="h-8px w-1px b-l-[--third-text] b-l-1px b-l-solid mx-5px" />
            <button type="button" class="text-14px color-[--up-color] border-none bg-transparent clickable p-0" @click.stop="form.price = (perpStore.perp?.lastPrice || '0')">中间价</button>
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="amount">
      <el-input v-model="form.amount" :placeholder="isValue ? $t('value1') :  $t('amount')" size="large"  clearable class="input-number" input-style="text-align:left" @input="percent = 0"  @update:model-value="value => watchAmount(value)">
        <!-- <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ isValue ? $t('value1') :  $t('amount') }}</span>
        </template> -->
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
    </el-form-item>
    <div class="mt-20px px-3px w-full">
      <el-slider
        v-model="percent"
        :min="0"
        :max="100"
        :step="1"
        :marks="{
          0: '0%',
          25: '25%',
          50: '50%',
          75: '75%',
          100: '100%',
        }"
        :format-tooltip="value => `${value}%`"
        class="mb-30px [&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] [&&]:[--el-slider-runway-bg-color:--icon-color] slider-box"
        @input="value => sliderInput(value as number)"
      />
    </div>
    <el-form-item style="margin-bottom: 0">
      <el-checkbox v-model="isChecked" class="checkbox-sm" :label="$t('stopLimit')" />
      <template v-if="isChecked">
        <div class="flex items-center gap-10px mt-8px mb-16px w-full">
          <!-- 止盈 -->
          <el-input
            v-model="tpForm.triggerPrice"
            :controls="false"
            align="left"
            class="flex-1 input-number"
            :placeholder="t('TP')"
            size="large"
            clearable
            @update:model-value="value => watchPrice(value)"
          >
            <template #suffix>
              <span class="text-12px color-[--main-text] pr-5px font-400">{{ t('latestPrice') }}</span>
              <!-- <el-dropdown trigger="click">
                <span class="flex items-center gap-4px cursor-pointer text-12px">
                  <span>{{
                    tpForm.triggerPriceType === 'LAST_PRICE' ? t('latestPrice') : t('indexPrice')
                  }}</span>
                  <SuffixIcon />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="[--el-font-size-base:12px]">
                    <el-dropdown-item @click="tpForm.triggerPriceType = 'LAST_PRICE'">{{
                      t('latestPrice')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="tpForm.triggerPriceType = 'INDEX_PRICE'">{{
                      t('indexPrice')
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown> -->
            </template>
          </el-input>
          <!-- <el-input-number
            v-model.number="tempData.tpPercent"
            :controls="false"
            align="left"
            class="w-50px text-12px"
            :placeholder="t('RIO')"
          >
            <template #suffix> % </template>
          </el-input-number> -->
        </div>
        <!-- <div class="mb-30px px-3px w-full">
          <el-slider
            v-model="tempData.tpPercent"
            :min="0"
            :max="200"
            :step="1"
            :marks="{
              0: '0%',
              50: '50%',
              100: '100%',
              150: '150%',
              200: '200%',
            }"
            class=" [&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white]"
          />
        </div> -->

        <div class="flex items-center gap-10px mt-8px mb-16px w-full">
          <!-- 止损 -->
          <el-input
            v-model="slForm.triggerPrice"
            :controls="false"
             class="flex-1 input-number"
            align="left"
            size="large"
            :placeholder="t('SL')"
            @update:model-value="value => watchPrice(value)"
          >
            <template #suffix>
              <span class="text-12px color-[--main-text] pr-5px font-400">{{ t('latestPrice') }}</span>
              <!-- <el-dropdown trigger="click">
                <span class="flex items-center gap-4px cursor-pointer text-12px">
                  <span>{{
                    slForm.triggerPriceType === 'LAST_PRICE' ? t('latestPrice') : t('indexPrice')
                  }}</span>
                  <SuffixIcon />
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="[--el-font-size-base:12px]">
                    <el-dropdown-item @click="slForm.triggerPriceType = 'LAST_PRICE'">{{
                      t('latestPrice')
                    }}</el-dropdown-item>
                    <el-dropdown-item @click="slForm.triggerPriceType = 'INDEX_PRICE'">{{
                      t('indexPrice')
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown> -->
            </template>
          </el-input>
          <!-- <el-input-number
            v-model.number="tempData.slPercent"
            :controls="false"
            align="left"
            class="w-100px text-12px"
            :placeholder="t('RIO')"
          >
            <template #suffix> % </template>
          </el-input-number> -->
        </div>
        <!-- <div class="mb-30px px-3px w-full">
          <el-slider
            v-model="tempData.slPercent"
            :min="0"
            :max="200"
            :step="1"
            :marks="{
              0: '0%',
              50: '50%',
              100: '100%',
              150: '150%',
              200: '200%',
            }"
            class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--white]"
          />
        </div> -->
      </template>
    </el-form-item>

    <el-form-item>
      <el-checkbox v-model="form.reduceOnly" class="checkbox-sm" :label="$t('onlyReduce')" />
    </el-form-item>

    <el-form-item>
      <div class="w-full flex item-center">
        <el-button
          class="flex-1 color-[--white]! min-h-48px rd-6px!"
          color="var(--up-color)"
          native-type="button"
          size="large"
          @click.stop="_createPerpOrder('BUY')"
        >
          {{ $t('buy') }}/{{ $t('long') }}
        </el-button>
        <el-button
          class="flex-1 color-[--white]! min-h-48px rd-6px!"
          color="var(--down-color)"
          native-type="button"
          size="large"
          @click.stop="_createPerpOrder('SELL')"
        >
          {{ $t('sell') }}/{{ $t('short') }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>


  <div class="flex items-center justify-between text-12px font-400 mt-8px color-[--main-text]">
    <div class="text-left">
      <div class="color-[--third-text] mb-5px"> {{ $t('buy') }}: </div>
      <div class="font-500"> ≈ {{ form.reduceOnly ? '0' :formatNumber(form.amount, 4) }} {{ perpStore.unit?.coinName || '' }}</div>
    </div>
    <div class="text-right">
      <div class="color-[--third-text] mb-5px"> {{ $t('sell') }}: </div>
      <div class="font-500"> ≈ {{ form.reduceOnly ? '0' : formatNumber(amountSell, 4) }} {{ perpStore.unit?.coinName || '' }}</div>
    </div>
  </div>
  <el-divider style="--el-border-color: var(--main-divider);margin: 16px 0;" />
  <ul class="text-12px color-[--third-text]">
    <li class="flex items-center">
      <span class="mr-auto">{{ $t('margin') }}</span>
      <span class="color-[--up-color]">{{ form.reduceOnly ? '-' : formatNumber(perpMargin.buy, 2) }} USD</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ form.reduceOnly ? '-' : formatNumber(perpMargin.sell, 2) }}  USD</span>
    </li>
    <li class="flex items-center mt-8px">
      <span class="mr-auto">Max: </span>
      <span class="color-[--up-color]">{{ form.reduceOnly ? '-' : formatNumber(maxAmountBuy, 4) }} {{  perpStore.unit?.coinName || ''  }}</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ form.reduceOnly ? '-' : formatNumber(maxAmountSell, 4) }}  {{  perpStore.unit?.coinName || ''  }}</span>
    </li>
    <li v-if="!form.reduceOnly" class="flex items-center mt-8px">
      <span class="mr-auto">预估强平价</span>
      <span class="color-[--up-color]">{{ formatNumber(liquidatePriceBuy, 4) }} USD</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ formatNumber(liquidatePriceSell, 4) }} USD</span>
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
import type { FormInstance } from 'element-plus'
import type { PerpOrderParams } from '~/api/perp/typs'

const { t } = useI18n()
const perpStore = usePerpStore()
const swapType = shallowRef<'LIMIT' | 'MARKET'>('MARKET')
const types = computed(() => {
  return [
    { value: 'LIMIT', name: t('limit') },
    { value: 'MARKET', name: t('market') },
  ] as const
})

const { createPerpOrder } = usePerp()

const form = reactive({
  price: '',
  amount: '',
  reduceOnly: false
})

const formRef = useTemplateRef<FormInstance>('formRef')

const rules = computed(() => ({
  price: [
    { validator: (rule: any, value: string, callback: (error?: Error) => void) => {
      if ((!value || value && new BigNumber(value).lte(0))) {
        callback(new Error('请输入您的委托价格'))
      } else {
        callback()
      }
    }, trigger: 'change' },
  ],
  amount: [
    { validator: (rule: any, value: string, callback: (error?: Error) => void) => {
      if ((!value || value && new BigNumber(value).lte(0))) {
        callback(new Error(isValue.value ? '请输入您的委托价值' : '请输入您的委托数量'))
      } else {
        callback()
      }
    }, trigger: 'change' },
  ],
}))
const show = ref(false)

const percent = ref(0)
const isChecked = ref(false)
const tempData = ref({
  tpPercent: undefined,
  slPercent: undefined,
  sizePercent: undefined,
})

watch(() => perpStore.perp?.contractId || '', (contractId) => {
  if (contractId) {
    form.price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || ''
    form.amount = ''
    tempData.value = {
      tpPercent: undefined,
      slPercent: undefined,
      sizePercent: undefined,
    }
    formRef.value?.resetFields()
  }
})
const tpForm = reactive({
  triggerPrice: undefined,
  triggerPriceType: 'LAST_PRICE',
  type: 'TAKE_PROFIT_MARKET',
})
const slForm = reactive({
  triggerPrice: undefined,
  triggerPriceType: 'LAST_PRICE',
  type: 'STOP_MARKET',
})
const perpMargin = computed(() => {
  const contractId = perpStore.perp?.contractId || ''
  const orderSize = getSize() || '0'
  const orderPrice = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
  return {
    buy: CoreCalculator.getCreateOrderCost({
      contractId: contractId,
      orderPrice: orderPrice,
      orderSize: orderSize || '0',
      orderSide: 'BUY'
    }).toFixed(),
    sell: CoreCalculator.getCreateOrderCost({
      contractId: contractId,
      orderPrice: orderPrice,
      orderSize: orderSize || '0',
      orderSide: 'SELL'
    }).toFixed(),
  }
})

const availableBalance = computed(() => {
  return CoreCalculator.calculateAvailableBalance(perpStore.perp?.contractId || '') || '0'
})

const feeRate = computed(() => {
  const { takerFeeRate, makerFeeRate } =  getFeeRate(perpStore.perp?.contractId || '')
  return { takerFeeRate: BigNumber(takerFeeRate).times(100).toFixed(), makerFeeRate: BigNumber(makerFeeRate).times(100).toFixed() }
})

const maxAmountBuy = computed(() => {
  let price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
  if (!isValue.value) {
    price = '1'
  }
  return CoreCalculator.getMaxCreateOrderSize({
    contractId: perpStore.perp?.contractId || '',
    orderPrice: perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0',
    orderSide: 'BUY',
    reduceOnly: form.reduceOnly
  }).times(price).toFixed()
})

const maxAmountSell = computed(() => {
  let price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
  if (!isValue.value) {
    price = '1'
  }
  return CoreCalculator.getMaxCreateOrderSize({
    contractId: perpStore.perp?.contractId || '',
    orderPrice: perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0',
    orderSide: 'SELL',
    reduceOnly: form.reduceOnly
  }).times(price).toFixed()
})


const amountSell = computed(() => {
  return formatMinSize(new BigNumber(maxAmountSell.value || '0').div(new BigNumber(maxAmountBuy.value || '0')).times(form.amount || '0').toFixed(), isValue.value)
})

const liquidatePriceBuy = computed(() => {
  const price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
  const orderSize = getSize() || '0'
  return CoreCalculator.getCreateOrderLiquidatePrice({
    contractId: perpStore.perp?.contractId || '',
    orderPrice: price,
    orderSide: 'BUY',
    orderSize
  }).toFixed()
})

const liquidatePriceSell = computed(() => {
  const price = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
  const orderSize = getSize() || '0'
  return CoreCalculator.getCreateOrderLiquidatePrice({
    contractId: perpStore.perp?.contractId || '',
    orderPrice: price,
    orderSide: 'SELL',
    orderSize
  }).toFixed()
})

function sliderInput(percent: number) {
  const _amount = new BigNumber(maxAmountBuy.value || '0')
  const a = BigNumber(percent).times(_amount || '0').div(100).toFixed()
  form.amount = formatMinSize(a)
}

const isValue = computed(() => {
  return perpStore.unit?.coinId === perpStore.perp?.quoteCoinId
})


function watchPrice(value: string) {
  form.price = formatMinSize(value, true)
}
function watchAmount(value: string) {
  let _value = formatMinSize(value)
  const _maxAmount = BigNumber.max(maxAmountBuy.value || '0', maxAmountSell.value || '0').toFixed()
  if (new BigNumber(_value).gt(_maxAmount)) {
    _value = _maxAmount || '0'
  }
  form.amount = _value
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

function _createPerpOrder(side: string) {
  formRef.value?.validate((valid: boolean) => {
    // isValid.value = false
    if (valid) {
      const data: PerpOrderParams = {
        type: swapType.value,
        size: getSize(),
        price: form.price || '0',
        side: side,
        contractId: perpStore.perp?.contractId || '',
        reduceOnly: form.reduceOnly,
        isPositionTpsl: false,
        isSetOpenTp: false,
        isSetOpenSl: false
      }
      if (tpForm.triggerPrice) {
        data.isSetOpenTp = true
        data.openTp = {
          ...tpForm,
          triggerPrice: new BigNumber(tpForm.triggerPrice || '0').toFixed(),
          price: form.price || '0',
          size: getSize(),
          side: 'SELL'
        }
      }
      if (slForm.triggerPrice) {
        data.isSetOpenSl = true
        data.openSl = {
          ...slForm,
          triggerPrice: new BigNumber(slForm.triggerPrice || '0').toFixed(),
          price: form.price || '0',
          size: getSize(),
          side: 'SELL'
        }
      }
      createPerpOrder(data).then(res => {
        if (res) {
          formRef.value?.resetFields()
        }
      })
    }
  })
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
  font-size: 14px;
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
    padding: 1px 0 1px 12px;
  }
}

.slider-box :deep() {
  .el-slider__marks-text {
    margin-top: 10px;
  }
  .el-slider__marks-stop {
    width: 8px;
    height: 8px;
    top: -3px;
  }
  .el-slider__stop {
    --el-slider-height: 8px;
    // --el-slider-stop-bg-color: var(--icon-color);
    transform: translateX(-50%) translateY(-50%);
    top: 50%;
  }
}

</style>
