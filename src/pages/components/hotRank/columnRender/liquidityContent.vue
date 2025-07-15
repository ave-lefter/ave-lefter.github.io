<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  setFilterForm(...args: [string, string][]): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'tvl') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort:sort_dir? 'tvl':'',
    sort_dir: sort_dir,
  })
}

const isVolUSDT = shallowRef(true)
function getTarget(row, key: 'symbol' | 'value' | 'init') {
  const isZero = row.target_token === row.token0_address
  return {
    symbol: () => (isZero ? row.token1_symbol : row.token0_symbol),
    value: () => (isZero ? row.reserve1 : row.reserve0),
    init: () => (isZero ? row.init_reserve1 : row.init_reserve0),
  }[key]()
}

const popoverVisible = shallowRef(false)
const openTimeList = shallowRef([
  { text: '> $100K', value: '100000' },
  { text: '> $300K', value: '300000' },
  { text: '> $1M', value: '1000000' },
])
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['tvl_min', ''], ['tvl_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value=false
    return
  }
  if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [
      `${{ 0: 'tvl_min', 1: 'tvl_max' }[idx]}` as string,
      el||'',
    ]
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value=false
}
</script>

<template>
  <el-table-column
    :label="$t('liquidity1') + '/' + $t('initial')"
    align="right"
    width="160"
  >
    <template #header>
      <div class="flex items-center justify-end gap-3px">
        <span class="cursor-pointer" @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')">{{ $t("liquidity1") }}/{{ $t("initial") }}</span>
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
        <Icon
          name="custom:price"
          :class="`${isVolUSDT ? 'color-[--d-666-l-999]' : 'color-[--d-999-l-666]'} cursor-pointer`"
          @click.self="isVolUSDT = !isVolUSDT"
        />
        <RangePopover
          v-model="popoverVisible"
          :width="225"
          :title="`${$t('liquidity1')}($)`"
          :list="openTimeList"
          :selectRangeIndex="0"
          :isFilterHighlight="isFilterHighlight"
          @confirm="confirm"
        />
      </div>
    </template>
    <template #default="{ row }">
      <template v-if="isVolUSDT">
        <div class="lh-18px mb-2px">
          ${{ formatNumber(row.tvl || 0,1) }}
        </div>
        <div class="lh-16px color-[--d-666-l-999] text-12px">${{ formatNumber(row.init_tvl || 0,1) }}</div>
      </template>
      <template v-else>
        <div class="lh-18px mb-2px">
          {{ formatNumber(getTarget(row, "value"),1)
          }} {{ getTarget(row, "symbol") }}
        </div>
        <div class="lh-16px color-[--d-666-l-999] text-12px">
          {{ formatNumber(getTarget(row, "init"),1)
          }} {{ getTarget(row, "symbol") }}
        </div>
      </template>
    </template>
  </el-table-column>
</template>
