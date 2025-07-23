<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'last_trade_at') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'last_trade_at' : '',
    sort_dir: sort_dir,
  })
}
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    <span
      class="cursor-pointer"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
    >
      {{ $t('lastTxsTime1') }}
    </span>
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
  </div>
</template>
