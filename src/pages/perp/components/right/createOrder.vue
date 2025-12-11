<template>
  <div class="absolute top-20px left-20px flex items-center text-20px font-700">
    <div :class="orderParams.side === 'BUY' ? 'bg-[--up-color]' : 'bg-[--down-color]'" class="text-12px p-2px rd-2px font-400 mr-5px color-[--white]">{{ orderParams.side === 'BUY' ? t('buy1') : t('sell1') }}</div>
    <div>{{ contractName || '' }}</div>
    <div class="text-16px color-[--third-text] ml-2px">{{ maxLeverage }}X</div>
  </div>
  <ul class="mt-30px text-14px color-[--main-text]">
    <li class="flex items-center justify-between">
      <span class="color-[--third-text]">{{ $t('price') }}</span>
      <span>{{ orderParams.type?.includes('LIMIT') ? formatNumber(orderParams.price, 10) : orderTypes[orderParams.type] }}</span>
    </li>
    <li class="flex items-center justify-between mt-16px">
      <span class="color-[--third-text]">{{ $t('amount') }}</span>
      <span>{{ orderParams.size }}</span>
    </li>
    <li class="flex items-center justify-between mt-16px">
      <span class="color-[--third-text]">{{ $t('margin') }}</span>
      <span>{{ formatNumber(createOrderCost, 4) }} USD</span>
    </li>
    <li class="flex items-center justify-between mt-16px">
      <span class="color-[--third-text]">{{ $t('onlyReduce') }}</span>
      <span>{{ orderParams.reduceOnly ? t('yes') : t('no') }}</span>
    </li>
    <li v-if="orderParams?.isSetOpenTp && orderParams?.openTp?.triggerPrice" class="flex items-center justify-between mt-16px">
      <span class="color-[--third-text]">{{ $t('TPPrice') }}</span>
      <span class="color-[--up-color]"> &gt;= {{ formatNumber(orderParams?.openTp?.triggerPrice || 0, 10) }} USD</span>
    </li>
    <li v-if="orderParams?.isSetOpenSl && orderParams?.openSl?.triggerPrice" class="flex items-center justify-between mt-16px">
      <span class="color-[--third-text]">{{ $t('SLPrice') }}</span>
      <span class="color-[--down-color]"> &lt;= {{ formatNumber(orderParams?.openSl?.triggerPrice || 0, 10) }} USD</span>
    </li>
    <li class="flex items-center justify-between mt-16px">
      <el-button size="large" class="flex-1 min-h-48px rd-8px!" @click.stop.prevent="$emit('cancel')">{{ $t('cancel') }}</el-button>
      <el-button size="large" type="primary" class="flex-1 min-h-48px rd-8px!" :loading="loading" @click.stop.prevent="_createOrder">{{ $t('confirm') }}</el-button>
    </li>
  </ul>
</template>

<script setup lang='ts'>
import { createOrder } from '~/api/perp/utils'
import type { PerpOrderParams } from '~/api/perp/types'
import { usePerpStore } from '~/stores/perp'
const { t } = useI18n()

const props = defineProps({
  getVisible: {
    type: Function as PropType<() => Ref<boolean>>,
    default: () => {
      return ref(false)
    }
  },
  orderParams: {
    type: Object as PropType<PerpOrderParams>,
    default: () => {
      return {}
    }
  }
})

const emit = defineEmits(['success', 'cancel'])

const perpStore = usePerpStore()


const orderTypes: ComputedRef<Record<PerpOrderParams['type'], string>> = computed(() => {
  return {
    MARKET: t('market'),
    LIMIT: t('limit'),
    STOP_MARKET: t('stop_market'),
    STOP_LIMIT: t('stop_limit'),
    TAKE_PROFIT_MARKET: t('takeProfitMarket'),
    TAKE_PROFIT_LIMIT: t('takeProfitLimit'),
  }
})

const contractName = computed(() => {
  const contractId = props.orderParams.contractId || ''
  const contractList = perpStore.contractList || []
  const contractInfo = contractList.find(i => i.contractId === contractId)
  return contractInfo?.contractName
})

const maxLeverage = computed(() => {
  const contractId = props.orderParams.contractId || ''
  return getLeverageFromContractId(contractId)
})

const createOrderCost = computed(() => {
  const contractId = props.orderParams.contractId || ''
  const orderPrice = props.orderParams.price || '0'
  const orderSize = props.orderParams.size
  const orderSide = props.orderParams.side
  return CoreCalculator.getCreateOrderCost({
    contractId: contractId,
    orderPrice: orderPrice,
    orderSize: orderSize || '0',
    orderSide: orderSide
  }).toFixed()
})

const loading = ref(false)
function _createOrder() {
  console.log('createOrder', props.orderParams)
  loading.value = true
  createOrder(props.orderParams).then(res => {
    emit('success', res)
    ElNotification({ type: 'success', message:  t('orderSubmitted') })
  }).catch((err) => {
    ElNotification({ type: 'error', message: err?.message })
  }).finally(() => {
    loading.value = false
  })
}

</script>

<style>

</style>
