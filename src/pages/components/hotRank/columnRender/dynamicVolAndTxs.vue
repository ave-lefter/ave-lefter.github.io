<script setup lang="ts">
import RangePopover from './rangePopover.vue'

const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  activeInterval: string
  setFilterForm(...args: [string, string][]): void
}>()
const lowerCaseInterval = computed(()=>props.activeInterval)
const volPrefix = computed(() => `volume_u_${lowerCaseInterval.value}`)
const buyPrefix = computed(() => `buy_volume_u_${lowerCaseInterval.value}`)
const sellPrefix = computed(() => `sell_volume_u_${lowerCaseInterval.value}`)
const txsPrefix = computed(() => `tx_${lowerCaseInterval.value}_count`)
const buyTxsPre = computed(() => `buys_tx_${lowerCaseInterval.value}_count`)
const sellTxsPre = computed(() => `sells_tx_${lowerCaseInterval.value}_count`)
function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir?volPrefix.value:'',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const defaultSort = computed(() => {
  if (props.sortConditions.sort === volPrefix.value) {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})
function txsSortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir?txsPrefix.value:'',
    sort_dir: sort_dir.replace('ending', ''),
  })
}
const txsDefaultSort = computed(() => {
  if (props.sortConditions.sort === txsPrefix.value) {
    return (
      {
        asc: 'ascending',
        desc: 'descending',
      }[props.sortConditions.sort_dir] || ''
    )
  }
  return ''
})

function formatColor(val, activeInterval = lowerCaseInterval.value) {
  // 如果没有值，返回灰色
  if (!val) return 'color-[--d-666-l-999]'

  if (activeInterval === '24h') {
    if (val >= 10000000) return 'color-#FFA622' // 黄色: >= 10M
    if (val >= 1000000) return 'color-[--d-CCC-l-333]' // 白色: >= 1M
    return 'color-[--d-666-l-999]' // 灰色: < 1M
  }

  // 其他时间区间的逻辑保持不变
  if (activeInterval === '1m') {
    if (val > 6945) return 'color-#FFA622'
  }
  if (activeInterval === '5m') {
    if (val > 34722) return 'color-#FFA622'
  }
  if (activeInterval === '15m') {
    if (val > 104167) return 'color-#FFA622'
  }
  if (activeInterval === '1h') {
    if (val > 416667) return 'color-#FFA622'
  }
  if (activeInterval === '4h') {
    if (val > 1666667) return 'color-#FFA622'
  }

  return 'color-[--d-666-l-999]'
}

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
const isFilterHighlight = shallowRef(false)
const isTxsHighlight = shallowRef(false)
const { t } = useI18n()

function volConfirm(params?: [string, string]) {
  confirm(`${volPrefix.value}_min`, `${volPrefix.value}_max`, params, () => {
    isFilterHighlight.value = false
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
  if (params[1] && params[0] && params[1] < params[0]) {
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
  <el-table-column v-if="activeInterval" :width="getTextWidth($t('vol')+$t('txns'))+120" align="right">
    <template #header>
      <div class="flex items-center justify-end gap-2px">
        <span
          class="lh-16px rounded-2px px-2px text-12px bg-[--d-333-l-999] color-[--d-CCC-l-F5F5F5]"
          >{{ activeInterval }}</span
        >
        {{ $t('vol')
        }}<HeadSort :defaultSort="defaultSort" @sort-change="sortChange" /><RangePopover
          v-model="volVisible"
          :width="225"
          :title="$t('nVolume', { n: activeInterval }) + '($)'"
          :list="volOptions"
          :selectRangeIndex="0"
          :isFilterHighlight="isFilterHighlight"
          @confirm="volConfirm"
        />/{{ $t('txns') }}<HeadSort :defaultSort="txsDefaultSort" @sort-change="txsSortChange" />
        <RangePopover
          v-model="txsVisible"
          :width="225"
          :title="$t('nTxAddress', { n: activeInterval })"
          :list="txsOptions"
          :selectRangeIndex="0"
          :isFilterHighlight="isTxsHighlight"
          @confirm="txsConfirm"
        />
      </div>
    </template>
    <template #default="{ row }">
      <div
        class="flex justify-end lh-18px mb-2px decorate decoration-dotted color-[--d-CCC-l-333]"
        :class="formatColor(row[volPrefix])"
      >
        <el-popover :width="240">
          <template #reference>
            ${{ formatNumber(row[volPrefix] || 0, 1) }}
          </template>
          <template #default>
            <div class="flex justify-between color-[--d-666-l-999] text-12px lh-16px mb-8px">
              <span>{{ activeInterval }} {{ $t('vol') }}</span>
              <span>{{ $t('vol') }} {{ $t('buy') }}</span>
              <span>{{ $t('vol') }} {{ $t('sell') }}</span>
            </div>
            <div class="py-8px mx--12px px-12px bg-[--d-1A1A1A-l-F2F2F2] mb-16px">
              <div class="flex justify-between color-[--d-666-l-999] text-12px lh-16px mb-4px">
                <span class="color-[--d-CCC-l-333]">${{ formatNumber(row[volPrefix], 2) }}</span>
                <span class="color-#12B886">${{ formatNumber(row[buyPrefix], 2) }}</span>
                <span class="color-#F6465D">${{ formatNumber(row[sellPrefix], 2) }}</span>
              </div>
              <div class="flex gap-2px">
                <div
                  class="h-4px rounded-2px bg-#12B886"
                  :style="`width:${((row[buyPrefix] / row[volPrefix]) * 100).toFixed(1)}%`"
                />
                <div
                  class="h-4px rounded-2px bg-#F6465D"
                  :style="`width:${((row[sellPrefix] / row[volPrefix]) * 100).toFixed(1)}%`"
                />
              </div>
            </div>
            <div class="flex justify-between color-[--d-666-l-999] text-12px lh-16px mb-8px">
              <span>{{ $t('txns') }}</span>
              <span>{{ $t('txns') }} {{ $t('buy') }}</span>
              <span>{{ $t('txns') }} {{ $t('sell') }}</span>
            </div>
            <div class="py-8px mx--12px px-12px bg-[--d-1A1A1A-l-F2F2F2]">
              <div class="flex justify-between color-[--d-666-l-999] text-12px lh-16px mb-4px">
                <span class="color-[--d-CCC-l-333]">{{ formatNumber(row[txsPrefix], 2) }}</span>
                <span class="color-#12B886">{{ formatNumber(row[buyTxsPre], 2) }}</span>
                <span class="color-#F6465D">{{ formatNumber(row[sellTxsPre], 2) }}</span>
              </div>
              <div class="flex gap-2px">
                <div
                  class="h-4px rounded-2px bg-#12B886"
                  :style="`width:${((row[buyTxsPre] / row[txsPrefix]) * 100).toFixed(1)}%`"
                />
                <div
                  class="h-4px rounded-2px bg-#F6465D"
                  :style="`width:${((row[sellTxsPre] / row[txsPrefix]) * 100).toFixed(1)}%`"
                />
              </div>
            </div>
          </template>
        </el-popover>
      </div>

      <div class="flex justify-end color-[--d-666-l-999] text-12px lh-16px">
        {{
          row[txsPrefix] > 0
            ? formatNumber(row[txsPrefix], 0)
            : 0
        }}
      </div>
    </template>
  </el-table-column>
</template>
<style scoped lang="scss">
.hover-row {
  overflow: hidden;
  .decorate {
    text-decoration-line: underline;
  }
}
</style>
