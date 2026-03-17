<script setup lang="ts">
import Holding from '@/components/perp/holding.vue'
import ClosePositionDialog from './closePositionDialog.vue'
import { usePerpStore } from '@/stores/perp'
import { useStorage, useLocalStorage } from '@vueuse/core'

const { contractId, isCancelOrder, position ,order } = storeToRefs(usePerpStore())
const walletStore = useWalletStore()
const { t } = useI18n()
const perpStore = usePerpStore()
const dialogVisible= shallowRef(false)
const tabs = computed<Array<{ label: string; value: keyof typeof componentsMap }>>(() => {
  return [
    { label: t('positions')+ (filterListData.value?.length > 0 ? `(${filterListData.value?.length})` : ''), value: 'holding' },
    { label: t('currentOrder') + (order.value?.length > 0 ? `(${order.value?.length})` : ''), value: 'currentOrder' },
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
type ComponentKey = keyof typeof componentsMap
const selectedCurrentObject = useLocalStorage<Record<ComponentKey, boolean>>(
  'perp-selected-current-object',
  Object.fromEntries(
    Object.keys(componentsMap).map(key => [key, true])
  ) as Record<ComponentKey, boolean>
)
const selectTab = ref<keyof typeof componentsMap>('holding')
const searchParams = useStorage(
  'perp-kline-searchParams',
  Object.keys(componentsMap).reduce(
    (prev, cur) => {
      prev[cur] = {
        filterContractIdList: contractId.value,
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

const filterListData = computed(() => {
  const _searchParams = filteredSearchParams(selectTab.value)
  const result = perpStore.position?.filter((i) => {
    return (_searchParams?.filterContractIdList && i.contractId === _searchParams?.filterContractIdList) ||!_searchParams?.filterContractIdList
  })
  return result || []
})

const isCurrent = computed(()=>{
  return !!selectedCurrentObject.value?.[selectTab.value]
})
watch(
  () => isCurrent.value,
  (val) => {
    if (val) {
      searchParams.value[selectTab.value].filterContractIdList = contractId.value
    } else {
      searchParams.value[selectTab.value].filterContractIdList = 'ALL'
    }
  }
)
watch(
  () => contractId.value,
  (val) => {
    if (isCurrent.value) {
      searchParams.value[selectTab.value].filterContractIdList = val
    } else {
      searchParams.value[selectTab.value].filterContractIdList = 'ALL'
    }
  }
)
watch(
  () => selectTab.value,
  (val) => {
    if (isCurrent.value) {
      searchParams.value[val].filterContractIdList = contractId.value
    } else {
      searchParams.value[val].filterContractIdList = 'ALL'
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
          class="text-12px  lh-24px color-[--third-text] cursor-pointer border-b-2px border-b-solid border-transparent block mr-24px pb-10px"
          :class="{ '[&&]:color-[--main-text] [&&]:border-[--main-text]': tab.value === selectTab }"
          @click="selectTab = tab.value"
          >{{ tab.label }}</span
        >
      </div>
      <div class="flex items-center justify-end gap-12px">
        <el-checkbox v-model="selectedCurrentObject[selectTab]" class="checkbox-sm" :label="$t('showCurrentContract')" />
        <el-button v-if="selectTab == 'holding'" class="close-position"   :disabled="position?.length == 0" @click.stop.prevent="dialogVisible = true">{{ $t('closePositionAll') }}</el-button>
        <el-button
          v-else-if="selectTab == 'currentOrder'"
          class="close-position"
          :disabled="perpStore.order?.length == 0"
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
    <close-position-dialog v-model="dialogVisible" :positions="filterListData" />
  </div>
</template>
<style lang="scss" scoped>
.close-position {
  height: 24px;
  font-size: 12px;
}
</style>
