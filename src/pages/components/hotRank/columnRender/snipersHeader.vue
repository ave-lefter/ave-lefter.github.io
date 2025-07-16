<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'sniper_tx_count') {
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
    sort: sort_dir ? 'sniper_tx_count' : '',
    sort_dir: sort_dir.replace('ending', ''),
  })
}

const popoverVisible = shallowRef(false)
const openTimeList = shallowRef([
  { text: '< 10', value: '10' },
  { text: '< 50', value: '50' },
  { text: '< 100', value: '100' },
])
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['sniper_tx_count_min', ''], ['sniper_tx_count_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: 'sniper_tx_count_min', 1: 'sniper_tx_count_max' }[idx]}` as string, el || '']
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    {{ $t('snipers') }}
    <!-- <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" /> -->
    <RangePopover
      v-model="popoverVisible"
      :width="225"
      :title="$t('snipers')"
      :list="openTimeList"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
