<script setup lang="ts">
import BigNumber from 'bignumber.js'
import type { PerpOrderParams } from '~/api/perp/types'
import { createOrder } from '~/api/perp/utils'
import type { Position } from '~/stores/perp/type'
const props = defineProps<{
  row: Position & { operation: 'market' | 'limit' }
  token?: string
}>()
const themeStore = useThemeStore()
const visible = defineModel<boolean>('visible')
const { t } = useI18n()
const formData = reactive<{
  closePrice?: string | number
  closeSize?: string | number
}>({
  closePrice: undefined,
  closeSize: undefined,
})

watch(visible, (val) => {
  if (val) {
    formData.closePrice = lastPrice.value
    formData.closeSize = BigNumber(openSize.value || '0').abs().times(new BigNumber(10).pow(quantityPrecision.value)).dp(0, BigNumber.ROUND_FLOOR).div(new BigNumber(10).pow(quantityPrecision.value)).toNumber()
    closePercent.value = 100
  }
})
const closePercent = ref(0)
const isLimit = computed(() => {
  return props.row.operation === 'limit'
})
const title = computed(() => {
  return isLimit.value ? t('limitClose') : t('marketClose')
})

const pricePrecision = computed(() => {
  return getPricePrecision(props.row.contractId || '')
})

const quantityPrecision = computed(() => {
  return getQuantityPrecision(props.row.contractId || '')
})

const symbolModel = computed(() => {
  return CoreCalculator.getSymbolModel(props.row.contractId)
})

const maxLeverage = computed(() => {
  return getLeverageFromContractId(props.row.contractId) || '1'
})

const openSize = computed(() => {
  return props.row.openSize || '0'
})

const lastPrice = computed(() => {
  return symbolModel.value?.lastPrice || '0'
})

function sizeChange(val: number) {
  closePercent.value = new BigNumber(val || 0).times(100).div(new BigNumber(props.row?.openSize || '0').abs()).dp(0, BigNumber.ROUND_FLOOR).toNumber()
}

const closeSizePercentChange = (val: number) => {
  formData.closeSize = new BigNumber(val || 0).div(100).times(new BigNumber(props.row?.openSize || '0').abs()).dp(quantityPrecision.value, BigNumber.ROUND_FLOOR).toNumber()
}

const unrealizedPnl = computed(() => {
  const cur = props.row
  const price = (isLimit.value ? formData.closePrice : lastPrice.value) || '0'
  if (!cur || new BigNumber(price).isZero()) return '0'
  const profit = Number(cur?.openSize) >= 0
    ? new BigNumber(price).times(new BigNumber(cur?.openSize || 0).abs()).minus(new BigNumber(cur.openValue).abs())
    : new BigNumber(cur.openValue || 0).abs().minus(new BigNumber(price).times(new BigNumber(cur.openSize).abs()))
  return profit.dp(2, BigNumber.ROUND_FLOOR)
})

const loading = ref(false)
const disabled = computed(() => {
  return new BigNumber(formData.closeSize || 0).isZero() || (isLimit.value && new BigNumber(formData.closePrice || 0).isZero())
})
function _createOrder() {
  const row = props.row
  if (formData.closePrice && BigNumber(formData.closeSize || '0').gt(0)) {
    const data: PerpOrderParams = {
      type: isLimit.value ? 'LIMIT' : 'MARKET',
      size: String(formData.closeSize || '0'),
      price: String(formData.closePrice || '0'),
      side:  BigNumber(row?.openSize || '0').gte(0) ? 'SELL' : 'BUY',
      contractId: row?.contractId || '',
      reduceOnly: true,
      isPositionTpsl: false,
      isSetOpenTp: false,
      isSetOpenSl: false
    }
    loading.value = true
    createOrder(data).then(res => {
      console.log('createTpOrder result', res)
      ElNotification({ type: 'success', message: isLimit.value ? t('limitPriceClosePosition') : t('closePositionSubmitted') })
      visible.value = false
    }).catch((err) => {
      ElNotification({ type: 'error', message: err?.message })
    }).finally(() => {
      loading.value = false
    })
  }
}

</script>

<template>
  <el-dialog v-model="visible" append-to-body :title="title" width="450px">
    <div class="flex items-center font-bold h-21px mb-16px">
      {{ props.token }} · {{ t('all2')
      }}<span class="ml-4px font-normal" :class="getColorClass(props.row.openValue)">
        {{ BigNumber(props.row.openValue || 0).gt(0) ? t('long') : t('short') }} · {{ maxLeverage }}X
      </span>
    </div>
    <div class="flex items-center justify-between mb-16px">
      <span class="color-[--third-text]">{{ t('latestPrice') }}</span>
      <span class="color-[--main-text]"
        >{{
          formatNumber(lastPrice, {
            limit: 20,
            decimals: pricePrecision,
          })
        }}
        USD</span
      >
    </div>
    <template v-if="isLimit">
      <div class="color-[--third-text] mb-8px">
        {{ t('closePrice') }}
      </div>
      <el-input-number  v-model="formData.closePrice" :precision="pricePrecision" align="left" :controls="false" :min="0" class="mb-16px w-full!">
        <template #suffix>
          <span class="color-[--third-text] mx-4px">|</span>
          <span class="color-[--up-color] clickable" @click.stop="formData.closePrice = lastPrice">{{ t('midPrice') }}</span>
        </template>
      </el-input-number>
    </template>
    <div class="color-[--third-text] justify-between mb-8px">
      {{ t('closeSize') }}
    </div>
    <el-input-number v-model="formData.closeSize" :precision="quantityPrecision < 0 ? 0 : quantityPrecision" :step="quantityPrecision < 0 ? 10 ** -quantityPrecision : 1" :step-strictly="quantityPrecision < 0" align="left" :controls="false" class="mb-12px w-full!" :max="Math.abs(Number(row?.openSize || '0'))" @change="(val) => sizeChange(val as number)" />
    <el-slider
      v-model="closePercent"
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
      class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] ml-4px [&&]:w-406px"
      @input="val => closeSizePercentChange(val as number)"
    />
    <div class="color-[--third-text] flex justify-between mt-38px mb-8px">
      {{ t('profit1') }}
      <span :class="BigNumber(unrealizedPnl).gte(0) ? 'color-[--up-color]' : 'color-[--down-color]'">{{ unrealizedPnl }} USD</span>
    </div>
    <div class="flex mt-20px text-16px">
      <el-button class="h-30px flex-1 m-l-auto" :color="themeStore.isDark ? '#333' : '#F2F2F2'" @click.stop="visible=false">
        {{ $t('cancel') }}
      </el-button>
      <el-button type="primary" class="h-30px flex-1 m-l-auto" :disabled="disabled" :loading="loading" @click.stop="_createOrder">
        {{ $t('confirm') }}
      </el-button>
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
