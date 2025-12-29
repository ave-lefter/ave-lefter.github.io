<template>
  <el-dialog
    v-model="visible"
    width="400px"
    class="dialog-box dialog-max dialog-remind dialog"
    append-to-body
    @close="visible = false"
  >
    <template #header>
      <div class="flex-start items-center">
        <span class="text-20px font-500 cursor-pointer">{{ $t('adjustLeverage') }}</span>
      </div>
    </template>
    <div class="content">
      <div>
        <span class="text-14px font-700 font-bold">{{ perp?.contractName }}</span>
        <span class="color-[--secondary-text] ml-8px">{{ $t('currentLeverage') }}:{{ defaultLeverage }}X</span>
      </div>
      <Step v-model="leverage" class="mt-19px" :max="max" @change="change"/>
      <div class="mt-20px mb-30px px-3px w-full">
        <el-slider
          v-model="leverage"
          v-slider-active
          :min="min"
          :max="max"
          :step="1"
          :marks="marks"
          :format-tooltip="(value)=> value+'X'"
          class="[&&]:[--el-slider-button-size:16px] [--el-color-white:--icon-color] [&&]:[--el-slider-height:2px] [&&]:[--el-slider-button-wrapper-offset:-17px] [&&]:h-auto [&&]:[w-auto] [--el-border-color-light:var(--dialog-divider)] [&&]:[--el-slider-main-bg-color:--main-text] slider-box"
          @input="change"
        />
      </div>
     <div class="text-14px flex-between mt-48px">
      <span class="color-[--third-text]">{{ $t('positionMargin') }}</span>
      <span>{{ formatNumber(defaultMargin, { decimals: 4, limit: 10}) }}&nbsp;USD</span>
     </div>
     <div class="text-14px flex-between mt-24px">
      <span class="color-[--third-text]">{{ $t('maxPositionCurrentLeverage') }}</span>
      <span>{{ Number(maxOpenQuantityWithLever) > 10**12 ? "∞": formatNumber(maxOpenQuantityWithLever, { decimals: 0, limit: 10})+'&nbsp;USD' }}</span>
     </div>
      <div class="text-12px color-[--yellow] flex-between mt-24px">
        *{{ $t('adjustLeverageTip1') }}
      </div>
      <div v-if="!BigNumber(_compareDefaultMargin || 0)?.isZero() && leverage" class="text-12px  mt-24px color-[--yellow] flex-start items-start">
        <el-icon style="vertical-align: middle" class="text-14px mr-5px">
          <Warning />
        </el-icon>
        <div class="mb-10px">
          <span v-if="BigNumber(_compareDefaultMargin).lte(0) || BigNumber(_compareDefaultMargin).abs().lte(availableBalance)" class="block" :class="_compareDefaultMargin > 0? 'color-[--down-color]':'color-[--up-color]'">
            {{ _compareDefaultMargin > 0 ? $t('adjustLeverageTip4', {num:formatNumber(Math.abs(_compareDefaultMargin), { decimals: 4, limit: 10})}): $t('adjustLeverageTip5', {num:formatNumber(Math.abs(_compareDefaultMargin), { decimals: 4, limit: 10})}) }}
          </span>
          <span v-else>
          {{ $t('adjustLeverageTip3') }}
          </span>
        </div>
        <div v-if="!isCanEditLeverage" lass="text-12px  mt-24px color-[--yellow]">{{ $t('adjustLeverageTip2', {name:perp?.contractName}) }}</div>
      </div>
      <div class="text-center mt-30px flex-between">
        <el-button class="flex-1" style="height: 48px" @click.stop.prevent="visible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button class="flex-1" style="height: 48px" type="primary" :disabled="!isCanEditLeverage" :loading="loading" @click.stop.prevent="submit">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { usePerpStore } from '~/stores/perp'
import Step from './step.vue'
// import { getLeverageFromContractId } from '@/utils/perp'
import { updateLeverageSetting } from '@/api/perp'
import { ElMessage } from 'element-plus'
import { usePerpWsPrivateStore } from '~/stores/perp/wsPrivate'
import { Warning } from '@element-plus/icons-vue'
import BigNumber from 'bignumber.js'
const props = defineProps({
  modelValue: Boolean,
})
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
const visible = computed({
  get: () => props.modelValue ?? false,
  set: (val) => emit('update:modelValue', val),
})
// const { prepBalance } = usePerp()
const { position, metadata, perp, contractId, userInfo } = storeToRefs(usePerpStore())
const perpStore = usePerpStore()
const { getOnboardSite } = usePerpStore()
const { t } = useI18n()
const wsPrivateStore = usePerpWsPrivateStore()
const leverage = shallowRef(1)
const segments = 5
const currentOrderList= ref([])
const loading = shallowRef(false)
const currentMargin = shallowRef('0')
const compareDefaultMargin= shallowRef(0)
const defaultMargin = computed(() => {
  if (defaultLeverage.value) {
    return getMargin(defaultLeverage.value)
  }
  return '0'
})
const defaultLeverageNum = computed(() => {
  const data = {
    // accountId: userInfo.value?.id,
    contractId: contractId.value,
    orderSide: 'BUY',
    inputLever: String(leverage.value)
  }
  const num = CoreCalculator.getRiskLimitTierMaxOpenQuantityWithLever(data)
  const result = num.times(perp?.value?.oraclePrice || 0).toFixed()
  return result
})
const max = computed(() => {
  return Number(perp.value?.displayMaxLeverage || 0)
})
const min = computed(() => {
  return Number(perp.value?.displayMinLeverage || 0)
})
const defaultLeverage = computed(() => {
  return getLeverageFromContractId(contractId.value)
})
const availableBalance = computed(() => {
  return calculateAvailableBalance(perpStore.perp?.contractId || '').toString() || '0'
})

const maxOpenQuantityWithLever = computed(() => {
  const symbolModel = CoreCalculator.getSymbolModel(perpStore.perp?.contractId || '')
  // 获取预言机价格，并在其基础上增加0.1%的溢价
  const oraclePrice = new BigNumber(symbolModel?.oraclePrice || 0).times(1.001)

  // 如果市场价格为零，则返回零（表示无法计算）
  if (oraclePrice.isZero()) {
    return new BigNumber(0)
  }
  const riskTierList = symbolModel?.riskTierList || []
  // 根据杠杆获取风险限额档位的最大可开仓值
  const contractRisk = CoreCalculator.getRiskTierModel(String(leverage.value), riskTierList)
  // const riskMaxValue = new BigNumber(contractRisk?.positionValueUpperBound || 0)
  return (contractRisk?.positionValueUpperBound || 0).toString()
})

const marks = computed(() => {
  const obj: Record<number, string> = {}
  const interval = (max.value - min.value) / segments
  for (let i = 0; i <= segments; i++) {
    // 保证刻度值为整数或需要的小数位数
    const pos = + Math.floor(min.value + i * interval)
    obj[pos] = String(pos +'X')
  }
  return obj
})
watch(visible, (val) => {
  if (val) {
    leverage.value = Number(defaultLeverage.value || 0)
  }
})
// watch(
//   () => wsPrivateStore.wsResult,
//   (val) => {
//     currentOrderList.value = val['trade-event']?.content?.data?.order?.filter(i => i.status !== 'CANCELED' && i.contractId == contractId.value) || []

//   },
//   { immediate: true, deep: true }
// )
const isCanEditLeverage = computed(() => {
  return !perpStore.order?.some(i => i.contractId === contractId.value && i.status !== 'CANCELED')
})
function getMargin(leverage: string) {
  // const list = position?.value?.filter((i) => i.contractId == contractId.value) || []
  // const num = list.reduce((acc, cur) => acc + Number(cur?.openSize), 0)
  // const data = {
  //   contractId: contractId.value,
  //   orderSide: 'BUY',
  //   orderPrice: perp?.value?.lastPrice || '',
  //   orderSize: String(num),
  //   leverage: leverage
  // }
  // const result = CoreCalculator.getCreateOrderCost(data)?.toString()

  // calculateMargin({
  //     contractId: contractId,
  //     size: Number(getSize() || '0'),
  //     side: 'BUY',
  //     price: swapType.value === 'LIMIT' ? Number(form.price || 0) : 0,
  //     isMarketOrder: swapType.value !== 'LIMIT',
  //     oraclePrice: Number(perpStore.perp?.oraclePrice || '0'),
  //   }).toFixed(),

  // const result = calculateMargin({
  //   contractId: contractId.value,
  //   side: 'BUY',
  //   price: 0,
  //   size: num,
  //   leverage,
  //   oraclePrice: Number(perp?.value?.oraclePrice || 0),
  // }).toFixed()

  return getPositionInitialMarginRequirement(contractId.value, perp?.value?.oraclePrice || '0', leverage).toFixed()
}

const _currentMargin = computed(() => {
  if (leverage.value) {
    return getMargin(String(leverage.value))
  } else {
    return '0'
  }
})

const _compareDefaultMargin = computed(() => {
  if (leverage.value) {
    return Number(_currentMargin.value) - Number(defaultMargin.value)
  } else {
    return 0
  }
})
function change(val: number | number[]) {
  if (val) {
    currentMargin.value = getMargin(String(val))
    compareDefaultMargin.value = Number(currentMargin.value) - Number(defaultMargin.value)
  } else {
    currentMargin.value = '0'
    compareDefaultMargin.value= 0
  }
}
function submit() {
  if (!userInfo.value?.id) {
    ElMessage.error(t('connectWalletFirst'))
  }
  const data = {
    contractId: contractId.value,
    leverage: String(leverage.value)
  }
  loading.value = true
  updateLeverageSetting(data).then(() => {
    ElMessage.success(t('success'))
    getOnboardSite()
    visible.value = false
  }).catch(err => {
    ElMessage.error(err?.message)
  }).finally(() => {
    loading.value = false
  })
}

</script>

<style lang="scss" scoped>
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
