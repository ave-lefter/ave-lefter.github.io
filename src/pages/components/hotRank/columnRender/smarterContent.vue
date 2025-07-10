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

function shouldShowContent(row) {
  return (
    row.smart_money_buy_volume_24h > 0 ||
    row.smart_money_sell_volume_24h > 0 ||
    row.smart_money_buy_count_24h > 0 ||
    row.smart_money_sell_count_24h > 0
  )
}
</script>

<template>
  <el-table-column
    :key="$t('smarter1')"
    :label="$t('smarter1')"
    align="right"
    width="90"
  >
    <template #header>
      <div class="flex items-center gap-3px">
        {{ $t("smarter1") }}
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
      </div>
    </template>
    <template #default="{ row }">
      <div
        v-if="shouldShowContent(row)"
        class="flex justify-end gap-2px color-[--d-666-l-999]"
      >
        <span :class="row.smart_money_buy_count_24h > 0 ? 'color-#12B886' : ''">
          {{
            formatNumber(row.smart_money_buy_count_24h || 0, {
              decimals: 0,
              limit: 20,
            })
          }} </span
        ><span class="color-[--d-333-l-F5F5F5]">/</span>
        <span
          :class="row.smart_money_sell_count_24h > 0 ? 'color-#F6465D' : ''"
        >
          {{
            formatNumber(row.smart_money_sell_count_24h || 0, {
              decimals: 0,
              limit: 20,
            })
          }}
        </span>
      </div>
      <div v-else class="color-[--d-666-l-999]">-</div>
    </template>
  </el-table-column>
</template>
