<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: any[]): void
}>()

const globalStore = useGlobalStore()
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
// setup时获取
const setupFilter = globalStore.rankConditions[globalStore.rankActiveTab]?.filter
const isFilterHighlight = shallowRef(!!setupFilter?.smart_money_buy_count_24h_min || !!setupFilter?.smart_money_buy_count_24h_max || !!setupFilter?.smart_money_sell_count_24h_min || !!setupFilter?.smart_money_sell_count_24h_max)

const themeStore = useThemeStore()
const buyRange = ref([setupFilter?.smart_money_buy_count_24h_min || '', setupFilter?.smart_money_buy_count_24h_max || ''])
const sellRange = ref([setupFilter?.smart_money_sell_count_24h_min || '', setupFilter?.smart_money_sell_count_24h_max || ''])

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
          :class="isFilterHighlight ? 'color-[--d-999-l-666]' : ''"
        />
      </template>
      <template #default>
        <div class="color-[--d-999-l-666] text-12px lh-12px">
          {{ $t('smarterBuyTxns') }}
        </div>
        <div class="flex items-center mt-8px mb-20px">
          <el-input
            v-model.trim.number="buyRange[0]"
            clearable
            type="text"
            :placeholder="$t('min3')"
            @input="(value) => (buyRange[0] = value.replace(/\-|[^\d.]/g, ''))"
          />
          <span class="ml-10px mr-10px">~</span>
          <el-input
            v-model.trim.number="buyRange[1]"
            clearable
            type="text"
            :placeholder="$t('max')"
            @input="(value) => (buyRange[1] = value.replace(/\-|[^\d.]/g, ''))"
          />
        </div>
        <div class="color-[--d-999-l-666] text-12px lh-12px">
          {{ $t('smarterSellTxns') }}
        </div>
        <div class="flex items-center mt-8px">
          <el-input
            v-model.trim.number="sellRange[0]"
            clearable
            type="text"
            :placeholder="$t('min3')"
            @input="(value) => (sellRange[0] = value.replace(/\-|[^\d.]/g, ''))"
          />
          <span class="ml-10px mr-10px">~</span>
          <el-input
            v-model.trim.number="sellRange[1]"
            clearable
            type="text"
            :placeholder="$t('max')"
            @input="(value) => (sellRange[1] = value.replace(/\-|[^\d.]/g, ''))"
          />
        </div>
        <div class="mt-20px flex">
          <el-button
            class="h-30px flex-1 m-l-auto"
            :color="themeStore.isDark ? '#333' : '#F2F2F2'"
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
