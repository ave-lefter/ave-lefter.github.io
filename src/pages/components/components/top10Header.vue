<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'holders_top10_ratio' : '',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'holders_top10_ratio') {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})

const popoverVisible = shallowRef(false)
const openTimeList = shallowRef([
  { text: '< 10%', value: '10' },
  { text: '< 30%', value: '30' },
  { text: '< 50%', value: '50' },
])
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['holders_top10_ratio_min', ''], ['holders_top10_ratio_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [
      `${{ 0: 'holders_top10_ratio_min', 1: 'holders_top10_ratio_max' }[idx]}` as string,
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
    {{ $t('top10') }}
    <!-- <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" /> -->
    <RangePopover
      v-model="popoverVisible"
      :width="225"
      :title="$t('top10Positions')"
      :list="openTimeList"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
