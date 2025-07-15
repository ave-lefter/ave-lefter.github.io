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

function getMarketCapColor(row) {
  if (!row?.market_cap) return 'color-#848E9C'

  const marketCap = row.market_cap
  const tokenAge = getTokenAge(row?.created_at)

  // 币龄小于1天且市值大于100万，或币龄小于7天且市值大于1000万
  if ((tokenAge < 86400 && marketCap > 1000000) || (tokenAge < 604800 && marketCap > 10000000)) {
    return 'color-#FFA622' // 黄色
  }
}

function getTokenAge(listingTime: number) {
  if (!listingTime) return Infinity
  const listingDate = new Date(listingTime)
  const now = new Date()
  return Math.floor((now.valueOf() - listingDate.valueOf()) / 1000)
}
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
  <el-table-column :label="$t('mCap') + '/' + $t('price')" align="right" width="140">
    <template #header>
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
    <template #default="{ row }">
      <div :class="getMarketCapColor(row)">${{ formatNumber(row.market_cap || 0, 1) }}</div>
    </template>
  </el-table-column>
</template>
