<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
  activeInterval: string
}>()
const prefix = computed(() => `makers_${props.activeInterval}`)
function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir?prefix.value:'',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === prefix.value) {
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
  { text: '> 300', value: '300' },
  { text: '> 500', value: '500' },
  { text: '> 1000', value: '1000' },
])
const isFilterHighlight = shallowRef(false)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm([prefix.value + '_min', ''], [prefix.value + '_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: prefix.value + '_min', 1: prefix.value + '_max' }[idx]}` as string, el || '']
  }) as [string, string][]
  props.setFilterForm(..._params)
  isFilterHighlight.value = true
  popoverVisible.value = false
}

function getHoldersColor(row) {
  return row[prefix.value] >= 1000 ? 'color-#FFA622' : ''
}

function getDetailColor(row, isBuyer) {
  const holders = row[prefix.value]
  if (holders < 1000) return ''
  return isBuyer ? 'color-#12B886' : 'color-#F6465D'
}
</script>
<template>
  <el-table-column :width="getTextWidth($t('markers'), 50) + 80" align="right">
    <template #header>
      <div class="flex items-center justify-end gap-3px">
        <span
          class="lh-16px rounded-2px px-2px text-12px bg-[--d-333-l-999] color-[--d-CCC-l-F5F5F5]"
          >{{ activeInterval }}</span
        >{{ $t('markers') }}
        <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
        <RangePopover
          v-model="popoverVisible"
          :width="225"
          :title="$t('nMarkers', { n: activeInterval })"
          :list="openTimeList"
          :selectRangeIndex="0"
          :isFilterHighlight="isFilterHighlight"
          @confirm="confirm"
        />
      </div>
    </template>
    <template #default="{ row }">
      <div :class="getHoldersColor(row)">
        {{ row[prefix] > 0 ? formatNumber(row[prefix] || 0, 0) : 0 }}
      </div>
      <div class="color-[--d-666-l-999] text-12px">
        <span :class="getDetailColor(row, true)">
          {{ formatNumber(row[`buyers_${activeInterval}`]||0) }}
        </span>/
        <span :class="getDetailColor(row, false)">
          {{ formatNumber(row[`sellers_${activeInterval}`]||0) }}
        </span>
      </div>
    </template>
  </el-table-column>
</template>
