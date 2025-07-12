<template>
  <el-table-column :label="$t('price')" align="right" width="130">
    <template #header>
      <div class="flex items-center justify-end gap-3px">
        <span>{{ $t('price') }}</span>
        <HeadSort :default-sort="defaultSort" @sort-change="sortChange" />
      </div>
    </template>
    <template #default="{ row }">
      <!-- v-animation-trigger-table:animation-bg="row.current_price_usd" -->
      <span :class="!row.current_price_usd ? 'color-#848E9C' : ''">
        ${{ formatNumber(row.current_price_usd, 3) }}
      </span>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import HeadSort from '~/components/headSort.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'current_price_usd') {
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
    sort: 'current_price_usd',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
</script>

<style lang="scss" scoped></style>
