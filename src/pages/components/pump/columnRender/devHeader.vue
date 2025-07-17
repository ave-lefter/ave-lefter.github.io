<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'dev_balance_ratio_cur' : '',
    sort_dir: sort_dir,
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'dev_balance_ratio_cur') {
    return props.sortConditions.sort_dir
  }
  return ''
})
const popoverVisible = shallowRef(false)
const isFilterHighlight = shallowRef(false)
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    <span
      class="cursor-pointer"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
      >{{ $t('mCap') }}</span
    >
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
  </div>
</template>