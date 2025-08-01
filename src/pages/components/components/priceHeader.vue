<template>
  <div class="flex items-center justify-end gap-3px">
    <span
      class="cursor-pointer"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
      >{{ $t('price') }}</span
    >
    <HeadSort :default-sort="defaultSort" @sort-change="sortChange" />
  </div>
</template>

<script lang="ts" setup>
import HeadSort from '~/components/headSort.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'current_price_usd') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'current_price_usd' : '',
    sort_dir: sort_dir,
  })
}
</script>

<style lang="scss" scoped></style>
