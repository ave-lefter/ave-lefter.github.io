<script setup lang="ts">
import Holding from '@/components/perp/holding.vue'
import ClosePositionDialog from './closePositionDialog.vue'
import { usePerpStore } from '@/stores/perp'
import { useStorage } from '@vueuse/core'

const { contractId, isCancelOrder, position ,order } = storeToRefs(usePerpStore())
const walletStore = useWalletStore()
const { t } = useI18n()
const perpStore = usePerpStore()
const dialogVisible= shallowRef(false)
const tabs = computed<Array<{ label: string; value: keyof typeof componentsMap }>>(() => {
  return [
    { label: t('holding')+`(${positionLength.value})`, value: 'holding' },
    { label: t('currentOrder') + `(${orderListLength.value})`, value: 'currentOrder' },
    // { label: t('conditionOrder'), value: 'conditionOrder' },
    { label: t('orderDetail'), value: 'orderDetail' },
    { label: t('historyOrder'), value: 'historyOrder' },
    { label: t('closePnl'), value: 'closePnl' },
    { label: t('positionHistory'), value: 'positionHistory' },
  ]
})
const componentsMap = {
  holding: Holding,
  currentOrder: defineAsyncComponent(() => import('@/components/perp/currentOrder.vue')),
  conditionOrder: defineAsyncComponent(() => import('@/components/perp/conditionOrder.vue')),
  orderDetail: defineAsyncComponent(() => import('@/components/perp/orderDetail.vue')),
  historyOrder: defineAsyncComponent(() => import('@/components/perp/historyOrder.vue')),
  closePnl: defineAsyncComponent(() => import('@/components/perp/closePnl.vue')),
  positionHistory: defineAsyncComponent(() => import('@/components/perp/positionHistory.vue')),
} as const
const selectTab = ref<keyof typeof componentsMap>('holding')
const isAll = shallowRef(true)
const searchParams = useStorage(
  'perp-kline-searchParams',
  Object.keys(componentsMap).reduce(
    (prev, cur) => {
      prev[cur] = {
        filterContractIdList: 'ALL',
      }
      return prev
    },
    {} as Record<
      string,
      {
        filterContractIdList: string
      }
    >
  )
)
const filteredSearchParams = (key: keyof typeof searchParams.value) => {
  const params = { ...searchParams.value[key] }
  if (params.filterContractIdList === 'ALL') {
    Reflect.deleteProperty(params, 'filterContractIdList')
  }
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (!params[key as 'filterContractIdList']) {
        Reflect.deleteProperty(params, key)
      }
    }
  }
  return params
}
const positionLength = computed(() => {
  const result = position?.value?.filter(i => {
    if (!isAll.value) {
      if (i.contractId == contractId.value) {
        return i
      }
    } else {
      return i
    }
  })
  return result?.length
})
const orderListLength = computed(() => {
  const result = order?.value?.filter(i => {
    if (!isAll.value) {
      if (i.contractId == contractId.value) {
        return i
      }
    } else {
      return i
    }
  })
  return result?.length
})
watch(
  () => isAll.value,
  (val) => {
    if (val) {
      searchParams.value[selectTab.value].filterContractIdList = 'ALL'
    } else {
      searchParams.value[selectTab.value].filterContractIdList = contractId.value
    }
  }
)

</script>

<template>
  <div class="pt-12px bg-[--secondary-bg]">
    <div class="flex items-center justify-between mb-16px px-14px">
      <div class="flex items-center">
        <span
          v-for="tab in tabs"
          :key="tab.value"
          class="text-12px px-8px lh-24px color-[--third-text] cursor-pointer rounded-4px"
          :class="{ '[&&]:color-[--main-text] bg-[--tab-active-bg]': tab.value === selectTab }"
          @click="selectTab = tab.value"
          >{{ tab.label }}</span
        >
      </div>
      <div class="flex items-center justify-end gap-12px">
        <el-checkbox v-model="isAll" class="checkbox-sm" :label="$t('showAllPositions')" />
        <el-button v-if="selectTab == 'holding'" class="close-position"   :disabled="position?.length == 0" @click.stop.prevent="dialogVisible = true">{{ $t('closePositionAll') }}</el-button>
        <el-button
          v-else-if="selectTab == 'currentOrder'"
          class="close-position"
          :disabled="perpStore.orderList?.length == 0"
          @click.stop.prevent="isCancelOrder = true"
          >{{ $t('cancelAll') }}</el-button
        >
        <el-button
          v-else-if="walletStore.address && walletStore.chain"
          class="close-position"
          @click.stop="
            $router.push(`/address/${walletStore.address}/${walletStore.chain}?t=${selectTab}`)
          "
          >{{ $t('viewAll') }}</el-button
        >
      </div>
    </div>
    <component :is="componentsMap[selectTab]" :searchParams="filteredSearchParams(selectTab)" />
    <close-position-dialog v-model="dialogVisible" />
  </div>
</template>
<style lang="scss" scoped>
.close-position {
  height: 24px;
  font-size: 12px;
}
</style>
