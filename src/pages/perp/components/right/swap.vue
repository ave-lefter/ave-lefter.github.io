<template>
  <el-tabs v-model="swapType" class="select-tabs mt-5px mb-12px">
    <el-tab-pane v-for="(item, index) in types" :key="index" :label="item.name" :name="item.value"/>
  </el-tabs>
  <div class="text-12px color-[--secondary-text] mb-12px text-right">{{ $t('availableBalance') }}: {{ formatNumber(availableBalance, 4) }} USD</div>
  <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" @submit.prevent>
    <el-form-item v-if="swapType === 'LIMIT'" label="" prop="price" style="margin-bottom: 15px;">
      <el-input-number
        v-model="form.price"
        :placeholder="$t('price')"
        :precision="(pricePrecision < 0 ? 0 : pricePrecision)"
        :step="(pricePrecision < 0 ? 10 ** -pricePrecision : 1)"
        :step-strictly="pricePrecision < 0"
        size="large"
        clearable
        class="[&&]:w-full"
        :controls="false"
        align="left"
        @update:model-value="value => watchPrice(value || '0')"
      >
        <template #suffix>
          <div class="inline-flex items-center">
            <span class="text-14px color-[--main-text]">USD</span>
            <div class="h-8px w-1px b-l-[--third-text] b-l-1px b-l-solid mx-5px" />
            <button type="button" class="text-14px color-[--up-color] border-none bg-transparent clickable p-0" @click.stop="setMidPrice">{{ $t('midPrice') }}</button>
          </div>
        </template>
      </el-input-number>
    </el-form-item>
    <el-form-item label="" prop="amount">
      <div v-if="percent > 0" class="absolute z-4 bg-[--main-input-button-bg] top-50% translate-y--50% left-1px pl-15px pointer-events-none">{{ percent }}%</div>
      <el-input-number
        v-model="form.amount"
        :placeholder="isValue ? $t('value1') :  $t('amount')"
        :precision="isValue ? 2 : (quantityPrecision < 0 ? 0 : quantityPrecision)"
        :step="isValue ? 1 : (quantityPrecision < 0 ? 10 ** -quantityPrecision : 1)"
        :step-strictly="quantityPrecision < 0"
        class="[&&]:w-full"
        :controls="false"
        size="large"
        clearable
        align="left"
        :max="maxAmount"
        @input="percent = 0"
        @focus="percent = 0"
        @change="value => watchAmount(String(value || '0'))">
      >
        <!-- <template #prepend>
          <span class="text-12px color-[--secondary-text]">{{ isValue ? $t('value1') :  $t('amount') }}</span>
        </template> -->
        <template #suffix>
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
      </el-input-number>
    </el-form-item>
    <div class="mt-20px px-3px w-full">
      <el-slider
        v-model="percent"
        v-slider-active
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
    <div v-if="percent > 0" class="flex items-center justify-between text-12px font-400 mt-8px color-[--main-text] mb-8px">
      <div class="text-left">
        <div class="color-[--third-text] mb-5px"> {{ $t('buy') }}: </div>
        <div class="font-500"> ≈ {{ formatNumber(percentBuy, { decimals: 4, limit: 8}) }} {{ perpStore.unit?.coinName || '' }}</div>
      </div>
      <div class="text-right">
        <div class="color-[--third-text] mb-5px"> {{ $t('sell') }}: </div>
        <div class="font-500"> ≈ {{ formatNumber(percentSell, { decimals: 4, limit: 8}) }} {{ perpStore.unit?.coinName || '' }}</div>
      </div>
    </div>
    <el-form-item style="margin-bottom: 0">
      <el-checkbox v-model="isChecked" class="checkbox-sm" :label="$t('stopLimit')" />
      <template v-if="isChecked">
        <div class="flex items-center gap-10px mt-8px mb-8px w-full">
          <!-- 止盈 -->
          <el-input-number
            v-model="tpForm.triggerPrice"
            :controls="false"
            align="left"
            :precision="pricePrecision"
            class="flex-1 input-number"
            :placeholder="t('TP')"
            size="large"
            clearable
            @update:model-value="value => tpPriceChange(value)"
          >
            <!-- <template #suffix>
              <el-dropdown trigger="click">
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
              </el-dropdown>
            </template> -->
          </el-input-number>
          <!-- <el-input-number
            v-model.number="tempData.tpPercent"
            :precision="0"
            :controls="false"
            align="left"
            size="large"
            class="w-80px! text-12px"
            :placeholder="t('RIO')"
            @update:model-value="val => tpPercentChange(val as number, 1)"
          >
            <template #suffix> % </template>
          </el-input-number> -->
        </div>
        <!-- <div class="mb-30px px-3px w-full">
          <el-slider
            v-model="tempData.tpPercent1"
            v-slider-active
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
            class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] [&&]:[--el-slider-runway-bg-color:--icon-color] slider-box"
            @change="val => tpPercentChange(val as number)"
          />
        </div> -->
        <el-alert v-if="tpMsg" style="--el-alert-title-font-size:12px;--el-alert-padding:5px 10px;margin: 0" :title="tpMsg" type="success"  :closable="false" />

        <div class="flex items-center gap-10px mt-8px mb-8px w-full">
          <!-- 止损 -->
          <el-input-number
            v-model="slForm.triggerPrice"
            :controls="false"
            :precision="pricePrecision"
             class="flex-1 input-number"
            align="left"
            size="large"
            :placeholder="t('SL')"
            @update:model-value="value => slPriceChange(value)"
          >
            <!-- <template #suffix>
              <el-dropdown trigger="click">
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
              </el-dropdown>
            </template> -->
          </el-input-number>
          <!-- <el-input-number
            v-model.number="tempData.slPercent"
            :controls="false"
            :precision="0"
            align="left"
            class="w-80px! text-12px"
            size="large"
            :placeholder="t('RIO')"
            @update:model-value="val => slPercentChange(val as number, 1)"
          >
            <template #suffix> % </template>
          </el-input-number> -->
        </div>
        <!-- <div class="mb-30px px-3px w-full">
          <el-slider
            v-model="tempData.slPercent1"
            v-slider-active
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
            class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] [&&]:[--el-slider-runway-bg-color:--icon-color] slider-box"
            @change="val => slPercentChange(val as number)"
          />
        </div> -->
        <el-alert v-if="slMsg" style="--el-alert-title-font-size:12px;--el-alert-padding:5px 10px;margin:0" :title="slMsg" type="error"  :closable="false" />
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
          :disabled="BigNumber(getSize()).lte(0)"
          @click.stop="_createPerpOrder('BUY')"
        >
          {{ $t('buy') }}/{{ $t('long') }}
        </el-button>
        <el-button
          class="flex-1 color-[--white]! min-h-48px rd-6px!"
          color="var(--down-color)"
          native-type="button"
          size="large"
          :disabled="BigNumber(getSize(1)).lte(0)"
          @click.stop="_createPerpOrder('SELL')"
        >
          {{ $t('sell') }}/{{ $t('short') }}
        </el-button>
      </div>
    </el-form-item>
  </el-form>



  <el-divider style="--el-border-color: var(--main-divider);margin: 16px 0;" />
  <ul class="text-12px color-[--third-text]">
    <li class="flex items-center">
      <span class="mr-auto">{{ $t('margin') }}</span>
      <span class="color-[--up-color]">{{ !form.reduceOnly && BigNumber(getSize()).gt(0) ?  formatNumber(perpMargin.buy, 4)  : '-'}} USD</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ !form.reduceOnly && BigNumber(getSize(1)).gt(0) ?  formatNumber(perpMargin.sell, 4)  : '-' }}  USD</span>
    </li>
    <li class="flex items-center mt-8px">
      <span class="mr-auto">Max: </span>
      <span class="color-[--up-color]">{{ formatNumber(maxAmountBuy, { decimals: 4, limit: 8}) }} {{  perpStore.unit?.coinName || ''  }}</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ formatNumber(maxAmountSell, { decimals: 4, limit: 8}) }}  {{  perpStore.unit?.coinName || ''  }}</span>
    </li>
    <li v-if="!form.reduceOnly" class="flex items-center mt-8px">
      <span class="mr-auto">{{ $t('estimatedLiquidationPrice') }}</span>
      <span class="color-[--up-color]">{{ BigNumber(getSize()).gt(0) && BigNumber(liquidatePriceBuy).gt(0) ? formatNumber(liquidatePriceBuy, pricePrecision) : '-' }} USD</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ BigNumber(getSize(1)).gt(0) && BigNumber(liquidatePriceSell).gt(0) ? formatNumber(liquidatePriceSell, { decimals: pricePrecision, limit: 8}) : '-' }} USD</span>
    </li>
    <li class="flex items-center mt-8px">
      <span class="mr-auto">{{ $t('fee') }}</span>
      <span class="color-[--up-color]">{{ $t('taker') }} {{ formatNumber(feeRate.takerFeeRate) }}%</span><span class="color-[--icon-color] mx-2px">/</span><span class="color-[--down-color]">{{ $t('maker') }} {{ formatNumber(feeRate.makerFeeRate) }}%</span>
    </li>
  </ul>

</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'
import BigNumber from 'bignumber.js'
import type { FormInstance } from 'element-plus'
import type { PerpOrderParams } from '~/api/perp/types'
import { calculateMargin } from '~/utils/perp'

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

const form = reactive<{
  price?: number
  amount?: number
  reduceOnly: boolean
}>({
  price: undefined,
  amount: undefined,
  reduceOnly: false
})

const formRef = useTemplateRef<FormInstance>('formRef')

const rules = computed(() => ({
  price: [
    { validator: (rule: any, value: number, callback: (error?: Error) => void) => {
      if ((!value || value && new BigNumber(value).lte(0))) {
        callback(new Error(t('plsEnterPrice')))
      } else {
        callback()
      }
    }, trigger: 'change' },
  ],
  amount: [
    { validator: (rule: any, value: string, callback: (error?: Error) => void) => {
      if ((!value || value && new BigNumber(value).lte(0)) && Number(percent.value) === 0) {
        callback(new Error(isValue.value ? t('plsEnterOrderValue') : t('plsEnterOrderAmount')))
      } else {
        callback()
      }
    }, trigger: 'change' },
  ],
}))
const show = ref(false)

const percent = ref(0)
const isChecked = ref(false)
const tempData = reactive({
  tpPercent: 0,
  tpPercent1: 0,
  slPercent: 0,
  slPercent1: 0,
  sizePercent: 0,
})

const contractId = computed(() => {
  return perpStore.perp?.contractId || ''
})

const pricePrecision = computed(() => {
  return getPricePrecision(contractId.value || '')
})

const quantityPrecision = computed(() => {
  return getQuantityPrecision(contractId.value || '')
})

const maxLeverage = computed(() => {
  return getLeverageFromContractId(contractId.value || '') || 1
})

const lastPrice = computed(() => {
  return CoreCalculator.getSymbolModel(contractId.value || '')?.lastPrice || '0'
})

const isContractChange = ref(false)
watch(() => perpStore.perp?.contractId || '', (contractId) => {
  if (contractId) {
    isContractChange.value = true
    resetForm()
    form.price = Number(CoreCalculator.getSymbolModel(contractId || '')?.oraclePrice || '0')
    setTimeout(() => {
      form.price = Number(perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice || '0')
      isContractChange.value = false
    }, 300)
  }
})

watch(maxLeverage, () => {
  resetForm()
})

watch(swapType, () => {
  tpForm.triggerPrice = undefined
  slForm.triggerPrice = undefined
  tempData.tpPercent = 0
  tempData.tpPercent1 = 0
  tempData.slPercent = 0
  tempData.slPercent1 = 0
})

function resetForm() {
  // form.price = ''
  // form.amount = ''
  if (formRef.value) {
    form.amount = undefined
    formRef.value.clearValidate('amount')
  }
  percent.value = 0
  tempData.tpPercent = 0
  tempData.tpPercent1 = 0
  tempData.slPercent = 0
  tempData.slPercent1 = 0
  tempData.sizePercent = 0
  tpForm.triggerPrice = undefined
  slForm.triggerPrice = undefined
}


const tpForm = reactive<{
  triggerPrice?: string | number
  triggerPriceType: string
  type: string
}>({
  triggerPrice: undefined,
  triggerPriceType: 'LAST_PRICE',
  type: 'TAKE_PROFIT_MARKET',
})
const slForm = reactive<{
  triggerPrice?: string | number
  triggerPriceType: string
  type: string
}>({
  triggerPrice: undefined,
  triggerPriceType: 'LAST_PRICE',
  type: 'STOP_MARKET',
})
const perpMargin = computed(() => {
  const contractId = perpStore.perp?.contractId || ''
  // const orderPrice = perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice || '0'
  // const { takerFeeRate, makerFeeRate } = getFeeRate(perpStore.perp?.contractId || '')
  return {
    buy: calculateMargin({
      contractId: contractId,
      size: Number(getSize() || '0'),
      side: 'BUY',
      price: swapType.value === 'LIMIT' ? Number(form.price || 0) : 0,
      isMarketOrder: swapType.value !== 'LIMIT',
      oraclePrice: Number(perpStore.perp?.oraclePrice || '0'),
    }).toFixed(),
    sell: calculateMargin({
      contractId: contractId,
      size: Number(getSize(1) || '0'),
      side: 'SELL',
      price: swapType.value === 'LIMIT' ? Number(form.price || 0) : 0,
      isMarketOrder: swapType.value !== 'LIMIT',
      oraclePrice: Number(perpStore.perp?.oraclePrice || '0'),
    }).toFixed(),
  }
})

const availableBalance = computed(() => {
  return calculateAvailableBalance(perpStore.perp?.contractId || '').toString() || '0'
})

const feeRate = computed(() => {
  const { takerFeeRate, makerFeeRate } =  getFeeRate(perpStore.perp?.contractId || '')
  return { takerFeeRate: BigNumber(takerFeeRate).times(100).toFixed(), makerFeeRate: BigNumber(makerFeeRate).times(100).toFixed() }
})

const maxAmountBuy = computed(() => {
  let price = (swapType.value === 'LIMIT' ? form.price :  (perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice)) || '0'
  if (!isValue.value) {
    price = '1'
  }
  // return CoreCalculator.getMaxCreateOrderSize({
  //   contractId: perpStore.perp?.contractId || '',
  //   orderPrice: (swapType.value === 'LIMIT' ? form.price : perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice )|| '0',
  //   orderSide: 'BUY',
  //   reduceOnly: form.reduceOnly
  // }).times(price).toFixed()
  const oraclePrice = Number((swapType.value === 'LIMIT' ? form.price :  (perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice)) || 0)
  return calculateMaxSize({
    contractId: perpStore.perp?.contractId || '',
    type: swapType.value,
    side: 'BUY',
    price: oraclePrice,
    reduceOnly: form.reduceOnly
  }).times(price).toFixed()
})

const maxAmountSell = computed(() => {
  let price = (swapType.value === 'LIMIT' ? form.price :  (perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice)) || '0'
  if (!isValue.value) {
    price = '1'
  }
  // return CoreCalculator.getMaxCreateOrderSize({
  //   contractId: perpStore.perp?.contractId || '',
  //   orderPrice: (swapType.value === 'LIMIT' ? form.price : perpStore.perp?.lastPrice || perpStore.perp?.oraclePrice )|| '0',
  //   orderSide: 'SELL',
  //   reduceOnly: form.reduceOnly
  // }).times(price).toFixed()
  const oraclePrice =  Number((swapType.value === 'LIMIT' ? form.price :  (perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice)) || 0)
  return calculateMaxSize({
    contractId: perpStore.perp?.contractId || '',
    type: swapType.value,
    side: 'SELL',
    price: oraclePrice,
    reduceOnly: form.reduceOnly
  }).times(price).toFixed()
})

const maxAmount = computed(() => {
  return BigNumber.max(maxAmountBuy.value || '0', maxAmountSell.value || '0').toNumber()
})


const liquidatePriceBuy = computed(() => {
  const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice )|| 0)
  const orderSize = getSize() || '0'
  // return CoreCalculator.getCreateOrderLiquidatePrice({
  //   contractId: perpStore.perp?.contractId || '',
  //   orderPrice: price,
  //   orderSide: 'BUY',
  //   orderSize
  // }).toFixed()
  return calculateLiqPrice({
    contractId: perpStore.perp?.contractId || '',
    side: 'BUY',
    price: Number(price) || 0,
    size: Number(orderSize || '0')
  })
})

const liquidatePriceSell = computed(() => {
  const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice )|| 0)
  const orderSize = getSize(1) || '0'
  // return CoreCalculator.getCreateOrderLiquidatePrice({
  //   contractId: perpStore.perp?.contractId || '',
  //   orderPrice: price,
  //   orderSide: 'SELL',
  //   orderSize
  // }).toFixed()
  return calculateLiqPrice({
    contractId: perpStore.perp?.contractId || '',
    side: 'SELL',
    price: Number(price) || 0,
    size: Number(orderSize || '0')
  })
})

function sliderInput(percent: number) {
  // const _amount = new BigNumber(maxAmountBuy.value || '0')
  // const a = BigNumber(percent).times(_amount || '0').div(100).toFixed()
  // form.amount = formatMinSize(a)
  form.amount = undefined
  if (formRef.value) {
    // formRef.value.resetFields()
    formRef.value.clearValidate('amount')
  }
}

const isValue = computed(() => {
  return perpStore.unit?.coinId === perpStore.perp?.quoteCoinId
})


function watchPrice(value: string | number) {
  if (!isContractChange.value) {
    form.price = Number(formatMinSize(String(value) || '0', true))
  }
}
function watchAmount(value: string) {
  const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice )|| 0)
  if (isValue.value) {
    let _amount = BigNumber(value).div(price).toFixed()
    _amount = formatMinSize(_amount, false)
    form.amount = BigNumber(_amount).times(price).dp(2, BigNumber.ROUND_FLOOR).toNumber()
  }
}

function formatMinSize(value: string, _isValue = isValue.value, roundingMode?: BigNumber.RoundingMode) {
  const _amount = value?.replace?.(/-|[^\d.]/g, '')
  if (_amount === '') {
    return ''
  }
  if (/^0\.0*$/.test(_amount) || _amount === '0') {
    return _amount
  }
  // 格式化 最小单位
  const { tickSize, stepSize } = CoreCalculator.getSymbolModel(perpStore.perp?.contractId || '') || {}
  if (_isValue) {
    if (new BigNumber(_amount).lt(tickSize || '0')) {
      return  tickSize ||'0'
    }
    return toTick(_amount, tickSize || '0', roundingMode)
  } else {
    if (new BigNumber(_amount).lt(stepSize || '0')) {
      return  stepSize ||'0'
    }
    return toTick(_amount, stepSize || '0', roundingMode)
  }
}

function switchPerpCoin(item: typeof perpStore.unit) {
  perpStore.unit = item
  if (form.amount) {
    const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice) || 0)
    const _isValue = perpStore.unit?.coinId === perpStore.perp?.quoteCoinId
    if (_isValue) {
      let _amount = form.amount || '0'
      _amount = formatMinSize(String(_amount), false)
      form.amount = BigNumber(_amount).times(price).dp(2, BigNumber.ROUND_FLOOR).toNumber()
    } else {
      const _amount = BigNumber(form.amount).div(price).toFixed()
      form.amount = Number(formatMinSize(_amount, _isValue))
    }
  }
}

function getSize(type = 0) {
  if (isValue.value) {
    const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice) || 0)
    if (percent.value > 0) {
      // let max = type === 1 ? (maxAmountSell.value || '0') : (maxAmountBuy.value || '0')
      // max = BigNumber(max).div(price).toFixed()
      const oraclePrice =  Number((swapType.value === 'LIMIT' ? form.price :  (perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice)) || 0)
      const max = calculateMaxSize({
        contractId: perpStore.perp?.contractId || '',
        type: swapType.value,
        side: type === 1 ? 'SELL' : 'BUY',
        price: oraclePrice,
        reduceOnly: form.reduceOnly
      }).toString()
      return calculateSizeFromRatio({
        maxQty: max,
        ratio: percent.value,
        stepSize: perpStore.perp?.stepSize || '0'
      })
    }
    return formatDec(BigNumber(form.amount || '0').div(price).times(10 ** quantityPrecision.value).dp(0).div(10 ** quantityPrecision.value).toFixed(), 4)
  } else {
    if (percent.value > 0) {
      return calculateSizeFromRatio({
        maxQty: type === 1 ? (maxAmountSell.value || '0') : (maxAmountBuy.value || '0'),
        ratio: percent.value,
        stepSize: perpStore.perp?.stepSize || '0'
      })
    }
    return form.amount || '0'
  }
}

function setMidPrice() {
  const ticker = perpStore.tickers?.find(i => i.contractId === perpStore?.contractId)
  const bid1 =  ticker?.bestBidPrice || 0
  const ask1 = ticker?.bestAskPrice || 0
  return form.price = BigNumber(bid1).plus(ask1).dividedBy(2).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
}

const percentBuy = computed(() => {
  if (isValue.value) {
    const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice) || 0)
    return BigNumber(getSize()).times(price || '0').toFixed()
  }
  return getSize()
})

const percentSell = computed(() => {
  if (isValue.value) {
    const price = Number((swapType.value === 'LIMIT' ? form.price : perpStore.perp?.oraclePrice || perpStore.perp?.lastPrice) || 0)
    return BigNumber(getSize(1)).times(price || '0').toFixed()
  }
  return getSize(1)
})

const tpMsg = computed(() => {
  if (BigNumber(getSize() || 0).lte(0) || BigNumber(tpForm.triggerPrice || 0).lte(0)) {
    return ''
  }

  const price = swapType.value === 'LIMIT' ? form.price : lastPrice.value
  if (!price) {
    return ''
  }

  // const curPosition = perpStore?.position?.find((i) => i.contractId === perpStore.perp?.contractId)
  // let curSize = BigNumber(curPosition?.openSize || 0)
  if (BigNumber(tpForm.triggerPrice || 0).gt(price)) {
    const size = BigNumber(getSize() || 0)
    const profit = BigNumber(tpForm.triggerPrice || 0).minus(price).times(size).abs().dp(2).toFixed()
    return t('longExpectedProfitUSD', {n : profit})
  } else {
    // curSize = BigNumber(curPosition?.openSize || 0).times(-1)
    const size = BigNumber(getSize(1) || 0)
    const profit = BigNumber(tpForm.triggerPrice || 0).minus(price).times(size).abs().dp(2).toFixed()
    return t('shortExpectedProfitUSD', {n : profit})
  }
})

const slMsg = computed(() => {
  if (BigNumber(getSize() || 0).lte(0) || BigNumber(slForm.triggerPrice || 0).lte(0)) {
    return ''
  }

  const price = swapType.value === 'LIMIT' ? form.price : lastPrice.value
  if (!price) {
    return ''
  }

  // const curPosition = perpStore?.position?.find((i) => i.contractId === perpStore.perp?.contractId)
  // let curSize = BigNumber(curPosition?.openSize || 0)
  if (BigNumber(slForm.triggerPrice || 0).lt(price)) {
    const size = BigNumber(getSize() || 0)
    const profit = BigNumber(slForm.triggerPrice || 0).minus(price).times(size).abs().dp(2).toFixed()
    return t('longExpectedLossUSD', {n : profit})
  } else {
    // curSize = BigNumber(curPosition?.openSize || 0).times(-1)
    const size = BigNumber(getSize(1) || 0)
    const profit = BigNumber(slForm.triggerPrice || 0).minus(price).times(size).abs().dp(2).toFixed()
    return t('shortExpectedLossUSD', {n : profit})
  }
})


const tpPercentChange = (val: number, type = 0) => {
  if (type === 1) {
    tempData.tpPercent1 = Math.min(Math.max(val, 0), 200)
  } else {
    tempData.tpPercent = val
  }
  const price = swapType.value === 'LIMIT' ? form.price : lastPrice.value
  tpForm.triggerPrice = new BigNumber(val || 0).div(100).div(maxLeverage.value).plus(1).times(price).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
}

function tpPriceChange(val?: number | string) {
  if (!val) {
    tempData.tpPercent = 0
    tempData.tpPercent1 = 0
    return
  }
  const price = (swapType.value === 'LIMIT' ? form.price : lastPrice.value) || 0
  tempData.tpPercent = new BigNumber(val || 0).minus(price).div(price).times(maxLeverage.value).times(100).dp(0, BigNumber.ROUND_FLOOR).toNumber()
  tempData.tpPercent1 = Math.min(Math.max(tempData.tpPercent, 0), 200)
}

const slPercentChange = (val: number, type = 0) => {
  if (type === 1) {
    tempData.slPercent1 = Math.min(Math.max(-val, 0), 200)
  } else {
    tempData.slPercent = -val
  }
  const price = swapType.value === 'LIMIT' ? form.price : lastPrice.value
  slForm.triggerPrice = new BigNumber(val || 0).negated().div(100).div(maxLeverage.value).plus(1).times(price).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
}

function slPriceChange(val?: number) {
  if (!val) {
    tempData.slPercent = 0
    tempData.slPercent1 = 0
    return
  }
  const price = (swapType.value === 'LIMIT' ? form.price : lastPrice.value) || 0
  tempData.slPercent = new BigNumber(val || 0).minus(price).div(price).times(maxLeverage.value).times(100).dp(0, BigNumber.ROUND_FLOOR).toNumber()
  tempData.slPercent1 = Math.min(Math.max(-tempData.slPercent, 0), 200)
}

function _createPerpOrder(side: string) {
  formRef.value?.validate((valid: boolean) => {
    // isValid.value = false
    if (valid) {
      const data: PerpOrderParams = {
        type: swapType.value,
        size: String(getSize(side === 'BUY' ? 0 : 1)),
        price: String(form.price || '0'),
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
          triggerPrice: new BigNumber(tpForm?.triggerPrice || '0').toFixed(),
          price: '0',
          size: String(getSize(side === 'BUY' ? 0 : 1)),
          side: side === 'BUY' ? 'SELL' : 'BUY'
        }
      }
      if (slForm.triggerPrice) {
        data.isSetOpenSl = true
        data.openSl = {
          ...slForm,
          triggerPrice: new BigNumber(slForm?.triggerPrice || '0').toFixed(),
          price: '0',
          size: String(getSize(side === 'BUY' ? 0 : 1)),
          side: side === 'BUY' ? 'SELL' : 'BUY'
        }
      }
      const curPosition = perpStore?.position?.find((i) => i.contractId === perpStore.perp?.contractId)

      if (data.reduceOnly && !(data.reduceOnly && curPosition && curPosition.openSize && (data.side === 'BUY' && BigNumber(curPosition.openSize).lt(0) || data.side === 'SELL' && BigNumber(curPosition.openSize).gt(0)) && BigNumber(data.size || 0).lt(BigNumber(curPosition.openSize).abs()))) {
        ElMessage({
          message: t('orderSizeError'),
          type: 'error'
        })
        return
      }
      createPerpOrder(data).then(res => {
        if (res) {
          resetForm()
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
