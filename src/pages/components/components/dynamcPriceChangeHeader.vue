<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  activeInterval: string
}>()

const prefix = computed(() => {
  if (props.activeInterval === '24h') {
    return 'm_price_change_24h'
  }
  return `price_change_${props.activeInterval}`
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? prefix.value : '',
    sort_dir: sort_dir,
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === prefix.value) {
    return props.sortConditions.sort_dir
  }
  return ''
})
</script>

<template>
  <div class="flex items-center justify-end gap-3px">
    <div
      class="cursor-pointer flex items-center gap-3px"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
    >
      <span
        class="lh-16px rounded-2px px-2px text-12px bg-[--border] color-[--secondary-text]"
        >{{ activeInterval }}</span
      >%
    </div>
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
  </div>
</template>
