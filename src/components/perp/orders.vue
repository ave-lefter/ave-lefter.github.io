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
const selectTab = ref(route.query.t && route.query.t !== 'holding' ? route.query.t : 'currentOrder')
const searchParams = ref(
  Object.keys(componentsMap).reduce(
    (prev, cur) => {
      prev[cur] = {
        filterContractIdList: 'ALL',
        filterStartCreatedTimeInclusive: dayjs().subtract(7, 'd').startOf('day').unix(),
        filterEndCreatedTimeExclusive: dayjs().endOf('day').unix(),
      }
      return prev
    },
    {} as Record<
      string,
      {
        filterContractIdList: string
        filterStartCreatedTimeInclusive: number
        filterEndCreatedTimeExclusive: number
      }
    >
  )
)
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
const filteredSearchParams = (key: keyof typeof searchParams.value) => {
  const params = { ...searchParams.value[key] }
  if (params.filterContractIdList === 'ALL') {
    delete params.filterContractIdList
  }
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (!params[key]) {
        delete params[key]
      } else if (
        ['filterStartCreatedTimeInclusive', 'filterEndCreatedTimeExclusive'].includes(key)
      ) {
        params[key] = params[key] * 1000
      }
    }
  }
  return params
}
</script>

<template>
  <div>
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
          v-model="searchParams[selectTab].filterContractIdList"
          size="small"
          class="[&&]:[--el-select-width:110px]"
          popper-class="[--el-font-size-base:12px]"
          :suffix-icon="SuffixIcon"
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
            v-model="searchParams[selectTab].filterStartCreatedTimeInclusive"
            size="small"
            :disabled-date="disabledStartDate"
            class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
            range-separator="To"
            format="YYYY-MM-DD"
            :placeholder="t('startTime')"
            value-format="X"
            :clearable="false"
            :teleported="false"
          />
          {{ $t('to') }}
          <el-date-picker
            v-model="searchParams[selectTab].filterEndCreatedTimeExclusive"
            size="small"
            :disabled-date="disabledEndDate"
            class="[--el-font-size-base:12px] [&&]:[--el-date-editor-width:120px]"
            range-separator="To"
            format="YYYY-MM-DD"
            :placeholder="t('endTime1')"
            value-format="X"
            :clearable="false"
            :teleported="false"
          />
        </div>
      </div>
    </div>
    <component :is="componentsMap[selectTab]" :searchParams="filteredSearchParams(selectTab)" />
  </div>
</template>
