<script setup lang="ts">
import { SuffixIcon } from '#components'
import dayjs from 'dayjs'
import { usePerpStore } from '~/stores/perp'
const route = useRoute()
const { t } = useI18n()
const perpStore = usePerpStore()
const tabs = ref([
  { label: t('currentOrder'), value: 'currentOrder' },
  { label: t('conditionOrder'), value: 'conditionOrder' },
  { label: t('orderDetail'), value: 'orderDetail' },
  { label: t('historyOrder'), value: 'historyOrder' },
  { label: t('closePnl'), value: 'closePnl' },
  { label: t('positionHistory'), value: 'positionHistory' },
])
const componentsMap = {
  currentOrder: defineAsyncComponent(() => import('./currentOrder.vue')),
  conditionOrder: defineAsyncComponent(() => import('./conditionOrder.vue')),
  orderDetail: defineAsyncComponent(() => import('./orderDetail.vue')),
  historyOrder: defineAsyncComponent(() => import('./historyOrder.vue')),
  closePnl: defineAsyncComponent(() => import('./closePnl.vue')),
  positionHistory: defineAsyncComponent(() => import('./positionHistory.vue')),
}
const selectTab = ref(route.query.t && route.query.t !=='holding'? route.query.t : 'currentOrder')
const searchParams = ref({
  size: 10,
  filterContractIdList: 'ALL',
  filterStartCreatedTimeInclusive: '',
  filterEndCreatedTimeExclusive: '',
})
const typeOptions = computed(() => {
  const contractList = perpStore.metadata?.contractList?.map?.((item) => {
    return {
      label: item.contractName,
      value: item.contractId,
    }
  })
  return [
    {
      label: t('all'),
      value: 'ALL',
    },
  ].concat(contractList || [])
})

const disabledStartDate = (date: Date) => {
  if (searchParams.value.filterEndCreatedTimeExclusive) {
    return dayjs(date).isAfter(
      dayjs(Number(searchParams.value.filterEndCreatedTimeExclusive) * 1000)
    )
  }
  return false
}
const disabledEndDate = (date: Date) => {
  if (searchParams.value.filterStartCreatedTimeInclusive) {
    return dayjs(date).isBefore(
      dayjs(Number(searchParams.value.filterStartCreatedTimeInclusive) * 1000)
    )
  }
  return false
}

const getList = async () => {}
</script>

<template>
  <div class="px-16px">
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
      <div class="flex items-center justify-end gap-8px">
        <el-select
          v-model="searchParams.filterContractIdList"
          size="small"
          class="[&&]:[--el-select-width:110px]"
          popper-class="[--el-font-size-base:12px]"
          :suffix-icon="SuffixIcon"
          @change="getList"
        >
          <template #prefix>
            <span>{{ t('type') }}</span>
          </template>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <div class="flex items-center gap-4px text-12px">
          <el-date-picker
            v-model="searchParams.filterStartCreatedTimeInclusive"
            size="small"
            :disabled-date="disabledStartDate"
            class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
            range-separator="To"
            format="YYYY-MM-DD"
            :placeholder="t('startTime')"
            value-format="X"
            :teleported="false"
            @change="getList"
          />
          {{ $t('to') }}
          <el-date-picker
            v-model="searchParams.filterEndCreatedTimeExclusive"
            size="small"
            :disabled-date="disabledEndDate"
            class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
            range-separator="To"
            format="YYYY-MM-DD"
            :placeholder="t('endTime1')"
            value-format="X"
            :teleported="false"
            @change="getList"
          />
        </div>
      </div>
    </div>
    <component :is="componentsMap[selectTab]" :searchParams="searchParams" />
  </div>
</template>
