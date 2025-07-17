<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'holders') {
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
    sort: sort_dir ? 'holders' : '',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const popoverVisible = shallowRef(false)
const openTimeList = shallowRef([
  { text: '< 100', value: '100' },
  { text: '< 1000', value: '1000' },
  { text: '< 10000', value: '10000' },
])
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['holder_min', ''], ['holder_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: 'holder_min', 1: 'holder_max' }[idx]}` as string, el || '']
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    {{ $t('holders') }}
    <RangePopover
      v-model="popoverVisible"
      :width="225"
      :title="$t('holders')"
      :list="openTimeList"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
