<script setup lang="ts">
import BigNumber from 'bignumber.js'
import { usePerpStore } from '~/stores/perp'
import { useThemeStore } from '~/stores/theme'
import { createOrder } from '~/api/perp/utils'
import type { PerpOrderParams } from '~/api/perp/typs'
import type { Position } from '~/stores/perp/type'

const visible = defineModel<boolean>('visible')
const props = defineProps<{
  row: Position | null
}>()
const perpStore = usePerpStore()
const themeStore = useThemeStore()
const { t } = useI18n()
const size = ref<string | number | undefined>(undefined)
const tempData = reactive<{
  tpPercent?: number
  tpPercent1?: number
  slPercent?: number
  slPercent1?: number
  sizePercent?: number
}>({
  tpPercent: undefined,
  tpPercent1: undefined,
  slPercent: undefined,
  slPercent1: undefined,
  sizePercent: undefined,
})
const tpForm = reactive<{
  triggerPrice?: number | string
  triggerPriceType: 'LAST_PRICE' | 'INDEX_PRICE'
  price?: number | string
  type: 'TAKE_PROFIT_MARKET' | 'TAKE_PROFIT_LIMIT'
}>({
  triggerPrice: undefined,
  triggerPriceType: 'LAST_PRICE',
  price: undefined,
  type: 'TAKE_PROFIT_MARKET',
})
const slForm = reactive<{
  triggerPrice?: number | string
  triggerPriceType: 'LAST_PRICE' | 'INDEX_PRICE'
  price?: number | string
  type: 'STOP_MARKET' | 'STOP_LIMIT'
}>({
  triggerPrice: undefined,
  triggerPriceType: 'LAST_PRICE',
  price: undefined,
  type: 'STOP_MARKET',
})

watch(visible, (val) => {
  if (val) {
    size.value = undefined
    tempData.tpPercent = undefined
    tempData.tpPercent1 = undefined
    tempData.slPercent = undefined
    tempData.slPercent1 = undefined
    tempData.sizePercent = undefined
    tpForm.triggerPrice = undefined
    slForm.triggerPrice = undefined
    tpForm.price = undefined
    slForm.price = undefined
  }
})

const isLong = computed(() => {
  return props.row?.openSize && new BigNumber(props.row?.openSize || '0').gt(0)
})

const typeDict = computed(() => {
  const contractMap =
    perpStore.metadata?.contractList?.reduce?.(
      (prev, cur) => {
        prev[cur.contractId] = cur.contractName
        return prev
      },
      {} as Record<string, string>
    ) || {}
  contractMap.ALL = t('all')
  return contractMap
})

const pricePrecision = computed(() => {
  return getPricePrecision(props.row?.contractId || '')
})

const quantityPrecision = computed(() => {
  return getQuantityPrecision(props.row?.contractId || '')
})

const maxLeverage = computed(() => {
  return getLeverageFromContractId(props.row?.contractId || '') || 1
})

const lastPrice = computed(() => {
  return CoreCalculator.getSymbolModel(props.row?.contractId || '')?.lastPrice || '0'
})

const openPrice = computed(() => {
  return new BigNumber(props.row?.openValue || 0).div(props.row?.openSize || 0)
})

const tpMsg = computed(() => {
  if (BigNumber(size.value || 0).lte(0) || BigNumber(tpForm.triggerPrice || 0).lte(0)) {
    return ''
  }

  const price = tpForm.type?.includes('LIMIT') ? slForm.price : lastPrice.value
  if (!price) {
    return ''
  }

  const profit = BigNumber(tpForm.triggerPrice || 0).minus(price).times(size.value || 0).abs().dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toFixed()
  if (BigNumber(tpForm.triggerPrice || 0).gte(price) && isLong.value || BigNumber(tpForm.triggerPrice || 0).lte(price) && !isLong.value) {
    return t('expectedProfitUSD', {n : profit})
  } else {
    return t('expectedLossUSD', {n : profit})
  }
})

const slMsg = computed(() => {
  if (BigNumber(size.value || 0).lte(0) || BigNumber(slForm.triggerPrice || 0).lte(0)) {
    return ''
  }

  const price = slForm.type?.includes('LIMIT') ? slForm.price : lastPrice.value
  if (!price) {
    return ''
  }

  const profit = BigNumber(slForm.triggerPrice || 0).minus(price).times(size.value || 0).abs().dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toFixed()
  if (BigNumber(slForm.triggerPrice || 0).lt(price) && isLong.value || BigNumber(slForm.triggerPrice || 0).gt(price) && !isLong.value) {
    return t('expectedLossUSD', {n : profit})
  } else {
    return t('expectedProfitUSD', {n : profit})
  }
})

const tpPercentChange = (val: number, type = 0) => {
  if (type === 1) {
    tempData.tpPercent1 = Math.min(Math.max(val, 0), 200)
  } else {
    tempData.tpPercent = val
  }
  if (isLong.value) {
    tpForm.triggerPrice = new BigNumber(val || 0).div(100).div(maxLeverage.value).plus(1).times(openPrice.value).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
  } else {
    tpForm.triggerPrice = new BigNumber(val || 0).negated().div(100).div(maxLeverage.value).plus(1).times(openPrice.value).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
  }
}

function tpPriceChange(val: number | string) {
  if (isLong.value) {
    tempData.tpPercent = new BigNumber(val || 0).minus(openPrice.value).div(openPrice.value).times(maxLeverage.value).times(100).dp(0, BigNumber.ROUND_FLOOR).toNumber()
  } else {
    tempData.tpPercent = new BigNumber(val || 0).minus(openPrice.value).negated().div(openPrice.value).times(maxLeverage.value).times(100).dp(0, BigNumber.ROUND_FLOOR).toNumber()
  }

  tempData.tpPercent1 = Math.min(Math.max(tempData.tpPercent, 0), 200)
}

const slPercentChange = (val: number, type = 0) => {
  if (type === 1) {
    tempData.slPercent1 = Math.min(Math.max(val, 0), 200)
  } else {
    tempData.slPercent = val
  }
  if (isLong.value) {
    slForm.triggerPrice = new BigNumber(val || 0).negated().div(100).div(maxLeverage.value).plus(1).times(openPrice.value).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
  } else {
    slForm.triggerPrice = new BigNumber(val || 0).div(100).div(maxLeverage.value).plus(1).times(openPrice.value).dp(pricePrecision.value, BigNumber.ROUND_FLOOR).toNumber()
  }
}

function slPriceChange(val: number) {
  if (isLong.value) {
    tempData.slPercent = new BigNumber(val || 0).minus(openPrice.value).negated().div(openPrice.value).times(maxLeverage.value).times(100).dp(0, BigNumber.ROUND_FLOOR).toNumber()
  } else {
    tempData.slPercent = new BigNumber(val || 0).minus(openPrice.value).div(openPrice.value).times(maxLeverage.value).times(100).dp(0, BigNumber.ROUND_FLOOR).toNumber()
  }

  tempData.slPercent1 = Math.min(Math.max(tempData.slPercent, 0), 200)
}


const sizePercentChange = (val: number) => {
  size.value = new BigNumber(val || 0).div(100).times(new BigNumber(props.row?.openSize || '0').abs()).dp(quantityPrecision.value, BigNumber.ROUND_FLOOR).toNumber()
}

function sizeChange(val: number) {
  tempData.sizePercent = new BigNumber(val || 0).times(100).div(new BigNumber(props.row?.openSize || '0').abs()).dp(0, BigNumber.ROUND_FLOOR).toNumber()
}

const loading = ref(false)
const disabled = computed(() => {
  return !size.value || !(tpForm.triggerPrice || slForm.triggerPrice) || (tpForm.type?.includes('LIMIT') && !tpForm.price) || (slForm.type?.includes('LIMIT') && !slForm.price)
})
function _createOrder() {
  loading.value = true
  return Promise.all([
    _createTpOrder(),
    _createSlOrder()
  ]).then(([tpRes, slRes]) => {
    if (tpRes && slRes) {
      visible.value = false
    }
  }).finally(() => {
    loading.value = false
  })
}

function _createTpOrder() {
  const row = props.row
  if (tpForm.triggerPrice && BigNumber(size.value || '0').gt(0)) {
    const data: PerpOrderParams = {
      type: tpForm.type,
      size: String(size.value || '0'),
      triggerPrice: tpForm.triggerPrice.toString() || '0',
      price: String(tpForm.price || '0'),
      side: 'SELL',
      contractId: row?.contractId || '',
      reduceOnly: true,
      isPositionTpsl: true,
      isSetOpenTp: false,
      isSetOpenSl: false
    }
    return createOrder(data).then(res => {
      console.log('createTpOrder result', res)
      ElNotification({ type: 'success', message:  '设置止盈订单成功' })
      return Promise.resolve(res)
    }).catch((err) => {
      ElNotification({ type: 'error', message: err?.message })
      return Promise.resolve(false)
    })
  }
  return Promise.resolve(true)
}

function _createSlOrder() {
  const row = props.row
  if (slForm.triggerPrice && BigNumber(size.value || '0').gt(0)) {
    const data: PerpOrderParams = {
      type: slForm.type,
      size: String(size.value || '0'),
      triggerPrice: slForm.triggerPrice.toString() || '0',
      price: String(slForm.price || '0'),
      side: 'SELL',
      contractId: row?.contractId || '',
      reduceOnly: true,
      isPositionTpsl: true,
      isSetOpenTp: false,
      isSetOpenSl: false
    }
    return createOrder(data).then(res => {
      console.log('createSlOrder result', res)
      ElNotification({ type: 'success', message:  '设置止损订单成功' })
      return Promise.resolve(res)
    }).catch((err) => {
      ElNotification({ type: 'error', message: err?.message })
      return Promise.resolve(false)
    })
  }
  return Promise.resolve(true)
}

</script>

<template>
  <el-dialog v-model="visible" append-to-body :title="t('takeProfitStopLoss2')" width="500px">
    <div class="overflow-y-auto scrollbar-hide mx--16px px-16px">
      <div class="mb-19px flex items-center gap-8px text-14px font-bold color-[--main-text]">
        {{ typeDict[props.row?.contractId || ''] }}
        <div :class="getColorClass(props.row?.openValue || '0')">
          {{ BigNumber(props.row?.openValue || 0).gt(0) ? t('long') : t('short') }} {{ maxLeverage }}X
        </div>
      </div>
      <div class="flex items-center mb-10px">
        <div class="flex-1 flex flex-col gap-4px color-[--main-text]">
          <label class="color-[--third-text]">{{ t('entryPrice') }}</label>
          {{
            formatNumber(openPrice.toString(), {
              limit: 6,
              decimals: pricePrecision,
            })
          }}
        </div>
        <div class="flex-1 flex flex-col gap-4px color-[--main-text]">
          <label class="color-[--third-text]">{{ t('latestPrice') }}</label>
          {{
            formatNumber(lastPrice, {
              limit: 20,
              decimals: pricePrecision,
            })
          }}
        </div>
      </div>
      <div class="mb-24px text-12px color-[--yellow]">
        {{ t('stopTips') }}
      </div>
      <div>
        <el-dropdown trigger="click">
          <span class="flex items-center gap-4px cursor-pointer">
            <span>{{
              tpForm.type === 'TAKE_PROFIT_MARKET' ? t('marketStop') : t('limitStop')
            }}</span>
            <SuffixIcon />
          </span>
          <template #dropdown>
            <el-dropdown-menu class="[--el-font-size-base:12px]">
              <el-dropdown-item @click="tpForm.type = 'TAKE_PROFIT_MARKET'">{{
                t('marketStop')
              }}</el-dropdown-item>
              <el-dropdown-item @click="tpForm.type = 'TAKE_PROFIT_LIMIT'">{{
                t('limitStop')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="flex items-center gap-10px mt-8px mb-16px">
          <!-- 止盈 -->
          <el-input-number
            v-model="tpForm.triggerPrice"
            :precision="pricePrecision"
            :controls="false"
            align="left"
            class="flex-1"
            :placeholder="t('triggerPrice')"
            :min="isLong ? Number(lastPrice) : undefined"
            :max="!isLong ? Number(lastPrice) : undefined"
            @change="(val) => tpPriceChange(val as number)"
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
          <el-input-number
            v-model.number="tempData.tpPercent"
            :precision="0"
            :controls="false"
            align="left"
            class="w-100px text-12px"
            :placeholder="t('RIO')"
            @update:model-value="val => tpPercentChange(val as number, 1)"
          >
            <template #suffix> % </template>
          </el-input-number>
        </div>
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
          class="mb-30px [&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] ml-4px [&&]:w-456px"
           @change="val => tpPercentChange(val as number)"
        />
        <el-input-number
          v-if="tpForm.type === 'TAKE_PROFIT_LIMIT'"
          v-model.number="tpForm.price"
          :controls="false"
          align="left"
          class="text-12px [&&]:w-full"
          :placeholder="t('price')"
        />
        <el-alert v-if="tpMsg" style="--el-alert-title-font-size:12px;--el-alert-padding:5px 10px;margin: 10px 0" :title="tpMsg" type="success"  :closable="false" />

        <!-- 止损 -->
        <el-dropdown trigger="click">
          <span class="mt-16px flex items-center gap-4px cursor-pointer">
            <span>{{ slForm.type === 'STOP_MARKET' ? t('marketStop2') : t('limitStop2') }}</span>
            <SuffixIcon />
          </span>
          <template #dropdown>
            <el-dropdown-menu class="[--el-font-size-base:12px]">
              <el-dropdown-item @click="slForm.type = 'STOP_MARKET'">{{
                t('marketStop2')
              }}</el-dropdown-item>
              <el-dropdown-item @click="slForm.type = 'STOP_LIMIT'">{{
                t('limitStop2')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="flex items-center gap-10px mt-8px mb-16px">
          <!-- 止损 -->
          <el-input-number
            v-model="slForm.triggerPrice"
            :controls="false"
            align="left"
            class="flex-1"
            :placeholder="t('triggerPrice')"
            :min="!isLong ? Number(lastPrice) : undefined"
            :max="isLong ? Number(lastPrice) : undefined"
            @change="(val) => slPriceChange(val as number)"
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
          <el-input-number
            v-model.number="tempData.slPercent"
            :controls="false"
            align="left"
            class="w-100px text-12px"
            :placeholder="t('RIO')"
            @update:model-value="val => slPercentChange(val as number, 1)"
          >
          <template #prefix><span class="color-[--main-text]">{{ BigNumber(tempData?.slPercent || 0).gt(0) ? '-' : '' }}</span></template>
            <template #suffix> % </template>
          </el-input-number>
        </div>
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
          class="mb-30px [&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] ml-4px [&&]:w-456px"
         @change="val => slPercentChange(val as number)"
        />
        <el-input-number
          v-if="slForm.type === 'STOP_LIMIT'"
          v-model.number="slForm.price"
          :controls="false"
          align="left"
          class="text-12px [&&]:w-full"
          :placeholder="t('price')"
        />
        <el-alert v-if="slMsg" style="--el-alert-title-font-size:12px;--el-alert-padding:5px 10px;margin: 10px 0" :title="slMsg" type="error"  :closable="false" />

        <!-- 委托数量 -->
        <div class="mt-16px mb-16px">
          <el-input-number
            v-model.number="size"
            :precision="quantityPrecision"
            class="[&&]:w-full"
            :controls="false"
            align="left"
            :placeholder="t('orderSize')"
            :max="Math.abs(Number(row?.openSize || '0'))"
            @change="(val) => sizeChange(val as number)"
          />
        </div>
        <el-slider
          v-model="tempData.sizePercent"
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
          class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] ml-4px [&&]:w-456px"
          @change="val => sizePercentChange(val as number)"
        />
        <div class="mt-53px flex items-center justify-between">
          <span class="color-[--third-text]">{{ t('contractSize') }}</span>
          <span
            >{{ Math.abs(Number(props.row?.openSize || '0'))
            }} {{ typeDict[props.row?.contractId || ''].replace('USD', '') }}</span
          >
        </div>
        <div class="mt-16px mb-40px flex items-center justify-between">
          <span class="color-[--third-text]">{{ t('orderSize') }}</span>
          <span>{{ size }} {{ typeDict[props.row?.contractId || ''].replace('USD', '') }}</span>
        </div>
        <div class="flex">
          <el-button class="h-30px flex-1 m-l-auto" :color="themeStore.isDark ? '#333' : '#F2F2F2'">
            {{ $t('reset') }}
          </el-button>
          <el-button type="primary" class="h-30px flex-1 m-l-auto" :disabled="disabled" :loading="loading" @click="_createOrder">
            {{ $t('confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
:deep(.el-slider__marks-text) {
  margin-top: 10px;
}
:deep(.el-slider__marks-stop) {
  width: 8px;
  height: 8px;
  top: -3px;
}
</style>
