<script setup lang="ts">
import Holding from '@/components/perp/holding.vue'
import { usePerpStore } from '@/stores/perp'
import { useStorage } from '@vueuse/core'
const { contractId, isCancelOrder } = storeToRefs(usePerpStore())
const walletStore = useWalletStore()
const { t } = useI18n()
const perpStore = usePerpStore()
const tabs = computed(() => {
  return [
    { label: t('holding'), value: 'holding' },
    { label: t('currentOrder'), value: 'currentOrder' },
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
}
const selectTab = ref('holding')
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
    delete params.filterContractIdList
  }
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (!params[key]) {
        delete params[key]
      }
    }
  }
  return params
}
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
const getList = async () => {}
</script>

<template>
  <div class="px-16px pt-12px">
    <div class="flex items-center justify-between mb-16px">
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
        <el-checkbox class="checkbox-sm" v-model="isAll" label="显示所有合约" />
        <el-button class="close-position" v-if="selectTab == 'holding'">全部平仓</el-button>
        <el-button
          class="close-position"
          v-else-if="selectTab == 'currentOrder'"
          :disabled="perpStore.orderList?.length == 0"
          @click.stop.prevent="isCancelOrder = true"
          >全部取消</el-button
        >
        <el-button
          class="close-position"
          v-else="selectTab == 'currentOrder'"
          @click.stop="
            $router.push(`/address/${walletStore.address}/${walletStore.chain}?t=${selectTab}`)
          "
          >查看全部</el-button
        >
      </div>
    </div>
    <component :is="componentsMap[selectTab]" :searchParams="filteredSearchParams(selectTab)" />
  </div>
</template>
<style lang="scss" scoped>
.close-position {
  height: 24px;
  font-size: 12px;
}
</style>
