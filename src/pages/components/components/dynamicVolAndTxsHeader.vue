<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  activeInterval: string
  setFilterForm(...args: [string, string][]): void
}>()

const globalStore = useGlobalStore()
const lowerCaseInterval = computed(() => props.activeInterval)
const volPrefix = computed(() => `volume_u_${lowerCaseInterval.value}`)
const txsPrefix = computed(() => `tx_${lowerCaseInterval.value}_count`)

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? volPrefix.value : '',
    sort_dir: sort_dir,
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === volPrefix.value) {
    return props.sortConditions.sort_dir
  }
  return ''
})
function txsSortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? txsPrefix.value : '',
    sort_dir: sort_dir,
  })
}
const txsDefaultSort = computed(() => {
  if (props.sortConditions.sort === txsPrefix.value) {
    return props.sortConditions.sort_dir
  }
  return ''
})

const volVisible = shallowRef(false)
const txsVisible = shallowRef(false)
const volOptions = shallowRef([
  { text: '> 50K', value: '50000' },
  { text: '> 100K', value: '100000' },
  { text: '> 500K', value: '500000' },
])
const txsOptions = shallowRef([
  { text: '> 300', value: '300' },
  { text: '> 500', value: '500' },
  { text: '> 1000', value: '1000' },
])
const isFilterHighlight = shallowRef(!!globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.[volPrefix.value + '_min'] || !!globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.[volPrefix.value + '_max'])
const isTxsHighlight = shallowRef(!!globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.[txsPrefix.value + '_min'] || !!globalStore.rankConditions[globalStore.rankActiveTab]?.filter?.[txsPrefix.value + '_max'])
const { t } = useI18n()

function volConfirm(params?: [string, string]) {
  confirm(`${volPrefix.value}_min`, `${volPrefix.value}_max`, params, (isHighlight: boolean) => {
    isFilterHighlight.value = isHighlight
    volVisible.value = false
  })
}

function txsConfirm(params?: [string, string]) {
  confirm(`${txsPrefix.value}_min`, `${txsPrefix.value}_max`, params, (isHighlight: boolean) => {
    isTxsHighlight.value = isHighlight
    txsVisible.value = false
  })
}
function confirm(
  startKey: string,
  endKey: string,
  params?: [string, string],
  callback?: (p: boolean) => void
) {
  if (!params || !params.some((el) => !!el)) {
    props.setFilterForm([startKey, ''], [endKey, ''])
    if (callback) {
      callback(false)
    }
    return
  }
  if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return
  }
  const _params = params.map((el, idx) => {
    return [`${{ 0: startKey, 1: endKey }[idx]}` as string, el || '']
  }) as [string, string][]
  props.setFilterForm(..._params)
  if (callback) {
    callback(true)
  }
}
</script>
<template>
  <div class="flex items-center justify-end gap-2px">
    <div
      class="cursor-pointer flex items-center gap-3px"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
    >
      <span
        class="lh-16px rounded-2px px-2px text-12px bg-[--d-333-l-FFF] color-[--d-CCC-l-333]"
        >{{ activeInterval }}</span
      >
      Vol
    </div>
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    <RangePopover
      v-model="volVisible"
      :sort-key="volPrefix"
      :width="225"
      :title="$t('nVolume', { n: activeInterval }) + '($)'"
      :list="volOptions"
      :selectRangeIndex="0"
      :isFilterHighlight="isFilterHighlight"
      @confirm="volConfirm"
    />
    <span
      class="cursor-pointer"
      @click="txsSortChange({ asc: '', desc: 'asc', '': 'desc' }[txsDefaultSort] || '')"
      >/Txns</span>
    <HeadSort :defaultSort="txsDefaultSort" @sort-change="txsSortChange" />
    <RangePopover
      v-model="txsVisible"
      :sort-key="txsPrefix"
      :width="225"
      :title="$t('nTxAddress', { n: activeInterval })"
      :list="txsOptions"
      :selectRangeIndex="0"
      :isFilterHighlight="isTxsHighlight"
      @confirm="txsConfirm"
    />
  </div>
</template>
