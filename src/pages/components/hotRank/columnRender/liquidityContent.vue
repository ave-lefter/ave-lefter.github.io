<script setup lang="ts">
const props = defineProps<{
  filterForm: any;
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  setFilterForm(): void;
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'tvl') {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: 'tvl',
    sort_dir: sort_dir.replace('ending', ''),
  })
}

const isVolUSDT = shallowRef(false)
function getTarget(row, key: 'symbol' | 'value' | 'init') {
  const isZero = row.target_token === row.token0_address
  return {
    symbol: () => (isZero ? row.token1_symbol : row.token0_symbol),
    value: () => (isZero ? row.reserve1 : row.reserve0),
    init: () => (isZero ? row.init_reserve1 : row.init_reserve0),
  }[key]()
}
</script>

<template>
  <el-table-column
    :label="$t('liquidity1') + '/' + $t('initial')"
    align="right"
    width="140"
  >
    <template #header>
      <div class="flex items-center gap-3px">
        {{ $t("liquidity1") }}/{{ $t("initial") }}
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
        <Icon
          name="custom:price"
          :class="`${isVolUSDT ? 'color-[--d-666-l-999]' : 'color-[--d-999-l-666]'} cursor-pointer`"
          @click.self="isVolUSDT = !isVolUSDT"
        />
      </div>
    </template>
    <template #default="{ row }">
      <template v-if="isVolUSDT">
        <div class="lh-18px mb-2px" :class="row.tvl_ratio < 0 ? 'color-#F6465D' : ''">
          ${{ formatNumber(row.tvl || 0) }}
        </div>
        <div class="lh-16px color-[--d-666-l-999] text-12px">${{ formatNumber(row.init_tvl || 0) }}</div>
      </template>
      <template v-else>
        <div class="lh-18px mb-2px" :class="row.tvl_ratio < 0 ? 'color-#F6465D' : ''">
          {{ formatNumber(getTarget(row, "value"))
          }}{{ getTarget(row, "symbol") }}
        </div>
        <div class="lh-16px color-[--d-666-l-999] text-12px">
          {{ formatNumber(getTarget(row, "init"))
          }}{{ getTarget(row, "symbol") }}
        </div>
      </template>
    </template>
  </el-table-column>
</template>
