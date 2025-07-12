<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  activeInterval:string
}>()
const prefix = computed(()=>`price_change_${props.activeInterval.toLowerCase()}`)
function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: prefix.value,
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === prefix.value) {
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
      <div class="flex items-center justify-end gap-3px">
        <span class="lh-16px rounded-2px px-2px text-12px bg-[--d-333-l-999] color-[--d-CCC-l-F5F5F5]">{{ activeInterval}}</span>%
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
      </div>
    </template>
    <template #default="{ row }">
      <span
        class="block overflow-hidden text-ellipsis whitespace-nowrap max-w-100px"
        :class="getColorClass(row[prefix])"
      >
        {{ Number(row[prefix]) > 0 ? "+" : ""
        }}{{ formatNumber(row[prefix] || 0, 1) }}%
      </span>
    </template>
  </el-table-column>
</template>
