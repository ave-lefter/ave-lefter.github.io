<script setup lang="ts">
import dayjs from 'dayjs'
import { getOpenTimeList } from './hotColumusService'
import RangePopover from './rangePopover.vue'

const { t } = useI18n()
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
}>()

const popoverVisible = shallowRef(false)
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'created_at') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'created_at' : '',
    sort_dir: sort_dir,
  })
}
const openTimeList = computed(() => getOpenTimeList(t('all')))

const isFilterHighlight = shallowRef(false)

function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['created_at_max', ''], ['created_at_min', ''])
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
      `${{ 0: 'created_at_max', 1: 'created_at_min' }[idx]}` as string,
      el ? dayjs().unix() - Number(el) * 3600 : '',
    ]
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}
</script>
<template>
  <div class="flex items-center gap-2px">
    <div
      class="cursor-pointer"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
    >
      <span>{{ $t('poolPair') }}</span
      >/<span>{{ $t('openTime') }}</span>
    </div>
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    <RangePopover
      v-model="popoverVisible"
      :width="300"
      :title="$t('openTime')"
      :list="openTimeList"
      :selectRangeIndex="1"
      :isFilterHighlight="isFilterHighlight"
      append="h"
      @confirm="confirm"
    />
  </div>
</template>
