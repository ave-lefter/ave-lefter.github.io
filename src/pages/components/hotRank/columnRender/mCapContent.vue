<script setup lang="ts">
const props = defineProps<{
  filterForm: any;
  sortConditions: { sort: string; sort_dir: string };
  setSortConditions(params: { sort: string; sort_dir: string }): void;
  setFilterForm(): void;
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

function getMarketCapColor(row) {
  if (!row?.market_cap) return 'color-#848E9C'

  const marketCap = row.market_cap
  const tokenAge = getTokenAge(row?.created_at)

  // 币龄小于1天且市值大于100万，或币龄小于7天且市值大于1000万
  if (
    (tokenAge < 86400 && marketCap > 1000000) ||
    (tokenAge < 604800 && marketCap > 10000000)
  ) {
    return 'color-#FFA622' // 黄色
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
    :label="$t('mCap') + '/' + $t('price')"
    align="right"
    width="140"
  >
    <template #header>
      {{ $t("mCap") }}
      <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    </template>
    <template #default="{ row }">
      <div :class="getMarketCapColor(row)">
        ${{ formatNumber(row.market_cap || 0,1) }}
      </div>
    </template>
  </el-table-column>
</template>
