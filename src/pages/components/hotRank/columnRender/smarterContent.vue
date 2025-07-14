<script setup lang="ts">
const props = defineProps<{
  sortConditions: { sort: string; sort_dir: string }
  setSortConditions(params: { sort: string; sort_dir: string }): void
  setFilterForm(...args: any[]): void
}>()
const defaultSort = computed(() => {
  if (props.sortConditions.sort === 'smart_money_tx_count_24h') {
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
    sort: sort_dir?'smart_money_tx_count_24h':'',
    sort_dir: sort_dir.replace('ending', ''),
  })
}

function shouldShowContent(row) {
  return (
    row.smart_money_buy_volume_24h > 0 ||
    row.smart_money_sell_volume_24h > 0 ||
    row.smart_money_buy_count_24h > 0 ||
    row.smart_money_sell_count_24h > 0
  )
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
  props.setFilterForm(...params1Arr,...params2Arr)
  popoverVisible.value=false
}
function getParamsArr(startKey: string, endKey: string, params?: [string, string]) {
  if (!params) {
    return [
      [startKey, ''],
      [endKey, ''],
    ]
  } else if (params[1] && params[0] && params[1] < params[0]) {
    ElMessage.error(t('maxGtMin'))
    return false
  } else {
    return params.map((el, idx) => {
      return [`${{ 0: startKey, 1: endKey }[idx]}` as string, el || '']
    }) as [string, string][]
  }
}
</script>

<template>
  <el-table-column :key="$t('smarter1')" :label="$t('smarter1')" align="right" width="110">
    <template #header>
      <div class="flex items-center justify-end gap-3px">
        {{ $t('smarter1') }}
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
                @click="buyRange=['',''];sellRange=['',''];confirm()"
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
    <template #default="{ row }">
      <div v-if="shouldShowContent(row)" class="flex justify-end gap-2px color-[--d-666-l-999]">
        <span :class="row.smart_money_buy_count_24h > 0 ? 'color-#12B886' : ''">
          {{
            formatNumber(row.smart_money_buy_count_24h || 0, {
              decimals: 0,
              limit: 20,
            })
          }} </span
        ><span class="color-[--d-333-l-F5F5F5]">/</span>
        <span :class="row.smart_money_sell_count_24h > 0 ? 'color-#F6465D' : ''">
          {{
            formatNumber(row.smart_money_sell_count_24h || 0, {
              decimals: 0,
              limit: 20,
            })
          }}
        </span>
      </div>
      <div v-else class="color-[--d-666-l-999]">-</div>
    </template>
  </el-table-column>
</template>
