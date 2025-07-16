<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
  activeChain: string
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'insider_balance_ratio_cur') {
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
    sort: sort_dir ? 'insider_balance_ratio_cur' : '',
    sort_dir: sort_dir.replace('ending', ''),
  })
}

const popoverVisible = shallowRef(false)
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(
      ['insider_balance_ratio_cur_min', ''],
      ['insider_balance_ratio_cur_max', '']
    )
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [
      `${{ 0: 'insider_balance_ratio_cur_min', 1: 'insider_balance_ratio_cur_max' }[idx]}` as string,
      el || '',
    ]
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    {{ $t('insiders') }}%
    <!-- <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" /> -->
    <RangePopover
      v-model="popoverVisible"
      :width="225"
      :title="$t('insidersPosition1')"
      :list="[]"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
