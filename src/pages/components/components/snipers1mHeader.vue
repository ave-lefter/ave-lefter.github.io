<script setup lang="ts">
import { RangePopover } from './index'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'rusher_tx_count') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'rusher_tx_count' : '',
    sort_dir: sort_dir,
  })
}

const popoverVisible = shallowRef(false)
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['rusher_tx_count_min', ''], ['rusher_tx_count_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: 'rusher_tx_count_min', 1: 'rusher_tx_count_max' }[idx]}` as string, el || '']
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    <span
      class="cursor-pointer"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
    >
      {{ $t('snipers_1m') }}
    </span>
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    <RangePopover
      v-model="popoverVisible"
      sortKey="rusher_tx_count"
      :width="225"
      :title="$t('snipers_1m')"
      :list="[]"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
