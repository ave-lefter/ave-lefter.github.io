<script setup lang="ts">
import {RangePopover} from './index'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

// function sortChange(sort_dir: string) {
//   props.setSortConditions({
//     sort: sort_dir ? 'dev_balance_ratio_cur' : '',
//     sort_dir: sort_dir,
//   })
// }
// const defaultSort = computed(() => {
//   if (props.sortConditions.sort === 'dev_balance_ratio_cur') {
//     return props.sortConditions.sort_dir
//   }
//   return ''
// })
const popoverVisible = shallowRef(false)
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()

function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['dev_balance_ratio_cur_min', ''], ['dev_balance_ratio_cur_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && Number(params[1]) > 100) {
    ElMessage.error(t('maxGt100'))
    return
  }
  if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [
      `${{ 0: 'dev_balance_ratio_cur_min', 1: 'dev_balance_ratio_cur_max' }[idx]}` as string,
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
    <span class="cursor-pointer">DEV%</span>
    <!-- <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" /> -->
    <RangePopover
      v-model="popoverVisible"
      :width="225"
      :title="$t('devPosition')+'%'"
      :list="[]"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
