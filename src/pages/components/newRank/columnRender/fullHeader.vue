<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'second_half_elapsed_time') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'second_half_elapsed_time' : '',
    sort_dir: sort_dir,
  })
}
</script>
<template>
  <div class="flex items-center gap-2px">
    <div
      class="cursor-pointer flex gap-2px items-center"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
    >
      <img src="@/assets/images/market/2-2.png" width="20" alt="">{{ 
      $t('runTime2') }}
    </div>
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
  </div>
</template>
