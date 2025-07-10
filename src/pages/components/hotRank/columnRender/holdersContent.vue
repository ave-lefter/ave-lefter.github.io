<script setup lang="ts">
const props = defineProps<{
  filterForm: any;
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  setFilterForm(): void;
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'holders') {
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
    sort: 'holders',
    sort_dir: sort_dir.replace('ending', ''),
  })
}

function getColorClass(row) {
  const holders = row.holders || 0
  const tokenAge = getTokenAge(row.created_at)

  if (
    (holders > 1000 && tokenAge < 86400) ||
    (holders > 10000 && tokenAge < 604800)
  ) {
    return 'color-#FFA622'
  }
}
function getTokenAge(listingTime: number) {
  if (!listingTime) return Infinity
  const listingDate = new Date(listingTime)
  const now = new Date()
  return Math.floor((now.valueOf() - listingDate.valueOf()) / 1000)
}
</script>

<template>
  <el-table-column
    :label="$t('holders')"
    align="right"
    :width="getTextWidth($t('holders'), 50) + 40"
  >
    <template #header>
      <div class="flex items-center gap-3px">
        {{ $t("holders") }}
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
      </div>
    </template>
    <template #default="{ row }">
      <div :class="getColorClass(row)">
        {{ formatNumber(row.holders || 0,{
            decimals:0,
            limit:20
        }) }}
      </div>
    </template>
  </el-table-column>
</template>
