<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'market_cap' : '',
    sort_dir: sort_dir,
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'market_cap') {
    return props.sortConditions.sort_dir
  }
  return ''
})
const popoverVisible = shallowRef(false)
const openTimeList = shallowRef([
  { text: '> $100K', value: '100000' },
  { text: '> $300K', value: '300000' },
  { text: '> $1M', value: '1000000' },
])
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['marketcap_min', ''], ['marketcap_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: 'marketcap_min', 1: 'marketcap_max' }[idx]}` as string, el || '']
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
      >{{ $t('mCap') }}</span
    >
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    <RangePopover
      v-model="popoverVisible"
      :width="225"
      :title="`${$t('mCap')}($)`"
      :list="openTimeList"
      :selectRangeIndex="0"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
