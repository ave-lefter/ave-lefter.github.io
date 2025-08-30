<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: any[]): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'smart_money_tx_count_24h') {
    return props.sortConditions.sort_dir
  }
  return ''
})

function sortChange(sort_dir: string) {
  props.setSortConditions({
    sort: sort_dir ? 'smart_money_tx_count_24h' : '',
    sort_dir: sort_dir,
  })
}

const popoverVisible = shallowRef(false)
const isFilterHighlight = shallowRef(false)
const themeStore = useThemeStore()
const buyRange = ref(['', ''])
const sellRange = ref(['', ''])

const { t } = useI18n()
function confirm(params1?: [string, string], params2?: [string, string]) {
  const params1Arr = getParamsArr(
    'smart_money_buy_count_24h_min',
    'smart_money_buy_count_24h_max',
    params1
  )
  if (!params1Arr) return
  const params2Arr = getParamsArr(
    'smart_money_sell_count_24h_min',
    'smart_money_sell_count_24h_max',
    params2
  )
  if (!params2Arr) return
  isFilterHighlight.value = params1Arr.some((el) => !!el[1]) || params2Arr.some((el) => !!el[1])
  props.setFilterForm(...params1Arr, ...params2Arr)
  popoverVisible.value = false
}
function getParamsArr(startKey: string, endKey: string, params?: [string, string]) {
  if (!params) {
    return [
      [startKey, ''],
      [endKey, ''],
    ]
  } else if (params[1] && params[0] && Number(params[1]) < Number(params[0])) {
    ElMessage.error(t('maxGtMin'))
    return false
  } else {
    return params.map((el, idx) => {
      return [`${{ 0: startKey, 1: endKey }[idx]}` as string, el || '']
    }) as [string, string][]
  }
}

function reset() {
  buyRange.value = ['', '']
  sellRange.value = ['', '']
  confirm()
}
</script>
<template>
  <div class="flex items-center justify-end gap-3px">
    <span
      class="cursor-pointer"
      @click="sortChange({ asc: '', desc: 'asc', '': 'desc' }[defaultSort] || '')"
      >{{ $t('smarter1') }}</span
    >
    <HeadSort :defaultSort="defaultSort" @sort-change="sortChange" />
    <el-popover
      v-model:visible="popoverVisible"
      placement="bottom"
      title=""
      :width="225"
      trigger="click"
    >
      <template #reference>
        <Icon
          name="custom:filter"
          class="text-10px cursor-pointer"
          :class="isFilterHighlight ? 'color-[--secondary-text]' : ''"
        />
      </template>
      <template #default>
        <div class="color-[--secondary-text] text-12px lh-12px">
          {{ $t('smarterBuyTxns') }}
        </div>
        <div class="flex items-center mt-8px mb-20px [--el-font-size-base:12px]">
          <el-input
            v-model.trim.number="buyRange[0]"
            clearable
            type="text"
            :placeholder="$t('min3')"
             style="--el-input-border-color:var(--border)"
            @input="(value) => (buyRange[0] = value.replace(/\-|[^\d.]/g, ''))"
          />
          <span class="ml-10px mr-10px">~</span>
          <el-input
            v-model.trim.number="buyRange[1]"
            clearable
            type="text"
            :placeholder="$t('max')"
             style="--el-input-border-color:var(--border)"
            @input="(value) => (buyRange[1] = value.replace(/\-|[^\d.]/g, ''))"
          />
        </div>
        <div class="color-[--d-999-l-666] text-12px lh-12px">
          {{ $t('smarterSellTxns') }}
        </div>
        <div class="flex items-center mt-8px [--el-font-size-base:12px]">
          <el-input
            v-model.trim.number="sellRange[0]"
            clearable
            type="text"
            :placeholder="$t('min3')"
             style="--el-input-border-color:var(--border)"
            @input="(value) => (sellRange[0] = value.replace(/\-|[^\d.]/g, ''))"
          />
          <span class="ml-10px mr-10px">~</span>
          <el-input
            v-model.trim.number="sellRange[1]"
            clearable
            type="text"
            :placeholder="$t('max')"
             style="--el-input-border-color:var(--border)"
            @input="(value) => (sellRange[1] = value.replace(/\-|[^\d.]/g, ''))"
          />
        </div>
        <div class="mt-20px flex">
          <el-button
            class="h-30px flex-1 m-l-auto"
            @click="reset"
          >
            {{ $t('reset') }}
          </el-button>
          <el-button
            type="primary"
            class="h-30px flex-1 m-l-auto"
            @click="confirm(buyRange, sellRange)"
          >
            {{ $t('confirm') }}
          </el-button>
        </div></template
      >
    </el-popover>
  </div>
</template>
