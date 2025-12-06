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
        <span class="text-20px font-500 cursor-pointer">{{ t('marketPriceClosePosition') }}</span>
      </div>
    </template>
    <div class="content">
      <ul>
        <li v-for="(item, $index) in position" :key="$index" class="mb-15px">
          <div>
            <span class="bg-[--up-color] rounded-4px px-2px text-10px">{{ $t('buy1') }}</span>
            <span class="ml-5px text-14px color-[--third-text]">
              {{ typeDict[item.contractId] }}</span
            >
            <span class="ml-5px color-[--secondary-text] text-12px">
              {{ getLeverageFromContractId(item.contractId) }}X</span
            >
          </div>
          <div class="flex-between mt-5px">
            <span class="color-[--secondary-text] text-12px">{{ $t('amount') }}</span>
            <span class="color-[--third-text] text-12px">{{
              formatNumber(item.openSize.replace('-', ''))
            }}</span>
          </div>
        </li>
      </ul>

      <el-alert
        type="warning"
        :title="$t('closePositionTip')"
        :closable="false"
        show-icon
        :style="{
          backgroundColor: '#FFA6221A',
          color: '#FFA622',
          border: 'none',
          fontSize: '12px',
        }"
      />
      <div class="text-center mt-30px flex-between">
        <el-button class="flex-1" style="height: 48px" @click.stop.prevent="visible = false">
          {{ $t('cancel') }}
        </el-button>
        <el-button class="flex-1" style="height: 48px" type="primary" :loading="loading" @click.stop.prevent="submit">
          {{ $t('confirm') }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { usePerpStore } from '~/stores/perp'
import { createOrder } from '~/api/perp/utils'
import type { Position } from '~/stores/perp/type'
import type { PerpOrderParams } from '~/api/perp/typs'
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
const { position, metadata } = storeToRefs(usePerpStore())
const { t } = useI18n()
const typeDict = computed(() => {
  const contractMap =
    metadata.value?.contractList?.reduce?.(
      (prev, cur) => {
        prev[cur.contractId] = cur.contractName
        return prev
      },
      {} as Record<string, string>
    ) || {}
  contractMap.ALL = t('all')
  return contractMap
})

const loading = ref(false)

function _createOrder(position: Position) {
  const symbol = typeDict.value[position.contractId] + ' ' + getLeverageFromContractId(position.contractId) + 'X '
  const data: PerpOrderParams = {
    type: 'MARKET',
    size: BigNumber(position.openSize || '0').abs().toFixed(),
    price: String('0'),
    side:  BigNumber(position?.openSize || '0').gte(0) ? 'SELL' : 'BUY',
    contractId: position?.contractId || '',
    reduceOnly: false,
    isPositionTpsl: false,
    isSetOpenTp: false,
    isSetOpenSl: false
  }
  return createOrder(data).then(async res => {
    console.log('createTpOrder result', res)
    ElNotification({ type: 'success', message: symbol + t('closePositionSubmitted') })
    return res
  }).catch(async (err) => {
    ElNotification({ type: 'error', message: err?.message })
    return ''
  })
}

function submit() {
  loading.value = true
  Promise.all(position.value.map(item => _createOrder(item))).then((res) => {
    if (res?.every(i => i)) {
      visible.value = false
    }
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style lang="scss" scoped></style>
