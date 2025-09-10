<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: [string, string][]): void
  isVolUSDT: boolean
}>()
const emit = defineEmits<{
  (e: 'update:isVolUSDT', value: boolean): void
}>()
const globalStore = useGlobalStore()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'tvl') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'tvl' : '',
    sort_dir: sort_dir,
  })
}

const popoverVisible = shallowRef(false)
const openTimeList = shallowRef([
  { text: '> $100K', value: '100000' },
  { text: '> $300K', value: '300000' },
  { text: '> $1M', value: '1000000' },
])
const isFilterHighlight = shallowRef(!!globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.tvl_min || !!globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.tvl_max)
const { t } = useI18n()
function confirm(params?: [string, string]) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm(['tvl_min', ''], ['tvl_max', ''])
    isFilterHighlight.value = false
    popoverVisible.value = false
    return
  }
  if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: 'tvl_min', 1: 'tvl_max' }[idx]}` as string, el || '']
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
      >{{ $t('liquidity1') }}/{{ $t('initial') }}</span
    >
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    <Icon
      name="custom:price"
      :class="`${isVolUSDT ? 'color-[--third-text]' : 'color-[--secondary-text]'} cursor-pointer`"
      @click.self="emit('update:isVolUSDT',!isVolUSDT)"
    />
    <RangePopover
      v-model="popoverVisible"
      sortKey="tvl"
      :width="225"
      :title="`${$t('liquidity1')}($)`"
      :list="openTimeList"
      :selectRangeIndex="0"
      :isFilterHighlight="isFilterHighlight"
      @confirm="confirm"
    />
  </div>
</template>
