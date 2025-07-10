<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
}>()
function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: 'market_cap',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'market_cap') {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})
</script>

<template>
  <el-table-column label="24h%" width="90" align="right">
    <template #header>
      24h%<HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    </template>
    <template #default="{ row }">
      <span
        class="block overflow-hidden text-ellipsis whitespace-nowrap max-w-100px"
        :class="getColorClass(row.price_change_24h)"
      >
        {{ Number(row.price_change_24h) > 0 ? "+" : ""
        }}{{ formatNumber(row.price_change_24h || 0, 1) }}%
      </span>
    </template>
  </el-table-column>
</template>
