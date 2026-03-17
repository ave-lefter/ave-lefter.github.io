<template>
  <div class="">
    <div class="px-16px py-16px pb-8px flex justify-between items-center">
      <el-input
        ref="inputSearch"
        v-model.trim="query"
        class="search-input px-20px mr-10px flex-1"
        :placeholder="$t('search')"
        autofocus
        size="large"
        @input="onSearchInput"
      >
        <template #prefix>
          <Icon class="text-12px text-[--third-text]" name="custom:search" />
        </template>
        <template #suffix>
          <Icon
            v-if="query"
            name="pajamas:clear"
            class="color-[--third-text] text-12px hover:opacity-70% cursor-pointer mr-20px"
            @click="onClearQuery"
          />
        </template>
      </el-input>
      <ul class="flex gap-8px">
        <li
          v-for="item in categoryList"
          :key="item.key"
          class="ml-8px cursor-pointer text-12px transition-all"
          :class="activeCategory === item.category ? 'text-[--main-text] underline' : 'text-[--third-text] hover:opacity-80'"
          @click="onCategoryClick(item.category)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>

    <SearchTable
      :tokens="contractList"
      :loading="loading"
      @sortChange="sortChange"
      @close="emit('close')"
      @loadMore="onLoadMore"
    />
  </div>
</template>

<script lang="ts" setup>
import SearchTable from './searchTable.vue'
import type { PerpInfo } from '@/api/types/perp'
import { _getContractCategorys, _getContractList } from '@/api/perp'
import { useDebounceFn } from '@vueuse/core'

function normalizeContract(item: any): PerpInfo {
  return {
    contractId: item.contract_id ?? item.contractId,
    contractName: item.contract_name ?? item.contractName,
    priceChange: item.price_change ?? item.priceChange,
    priceChangePercent: item.price_change_percent ?? item.priceChangePercent,
    trades: item.trades,
    size: item.size,
    value: item.value,
    high: item.high,
    low: item.low,
    open: item.open,
    close: item.close,
    highTime: item.high_time ?? item.highTime,
    lowTime: item.low_time ?? item.lowTime,
    startTime: item.start_time ?? item.startTime,
    endTime: item.end_time ?? item.endTime,
    lastPrice: item.last_price ?? item.lastPrice,
    indexPrice: item.index_price ?? item.indexPrice,
    oraclePrice: item.oracle_price ?? item.oraclePrice,
    openInterest: item.open_interest ?? item.openInterest,
    fundingRate: item.funding_rate ?? item.fundingRate,
    fundingTime: item.funding_time ?? item.fundingTime,
    nextFundingTime: item.next_funding_time ?? item.nextFundingTime,
    bestAskPrice: item.best_ask_price ?? item.bestAskPrice,
    bestBidPrice: item.best_bid_price ?? item.bestBidPrice,
    displayMaxLeverage: item.display_max_leverage ?? item.displayMaxLeverage,
    fundingInterestRate: item.funding_interest_rate ?? item.fundingInterestRate,
    baseCoin: item.base_coin_name ?? item.baseCoin,
    quoteCoin: item.quote_coin_name ?? item.quoteCoin,
    baseCoinId: item.base_coin_id ?? item.baseCoinId,
    quoteCoinId: item.quote_coin_id ?? item.quoteCoinId,
    displayDigitMerge: item.display_digit_merge ?? item.displayDigitMerge,
    baseCoinIcon: item.base_coin_icon_url ?? item.baseCoinIcon,
    quoteCoinIcon: item.quote_coin_icon_url ?? item.quoteCoinIcon,
  } as PerpInfo
}

const emit = defineEmits(['close'])
const { locale } = useI18n()

const query = ref('')
const sortBy = ref<string>('')
type SortValue = 0 | -1 | 1
const activeSort = shallowRef<SortValue>(0)

const categoryList = ref<{ category: string; name: string }[]>([])
const activeCategory = ref('all')
const contractList = ref<PerpInfo[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const pageSize = 20

const sortDir = computed(() => {
  if (activeSort.value === 0) return ''
  return activeSort.value === 1 ? 'desc' : 'asc'
})

async function fetchCategoryList() {
  try {
    const res = await _getContractCategorys(locale.value)
    if (res?.sub_categories) {
      categoryList.value = res.sub_categories
    }
  } catch (error) {
    console.error('fetchCategoryList error:', error)
  }
}

async function fetchContractList(isLoadMore = false) {
  if (loading.value) return
  if (!isLoadMore) {
    page.value = 0
    contractList.value = []
    hasMore.value = true
  }
  if (!hasMore.value && isLoadMore) return

  loading.value = true
  try {
    const res = await _getContractList(
      activeCategory.value,
      query.value,
      pageSize,
      page.value,
      sortBy.value,
      sortDir.value
    )
    if (res?.contracts) {
      const normalized = res.contracts.map(normalizeContract)
      if (isLoadMore) {
        contractList.value.push(...normalized)
      } else {
        contractList.value = normalized
      }
      hasMore.value = res.contracts.length === pageSize
      page.value = res.page_token;
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('fetchContractList error:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  fetchContractList(false)
}, 300)

function onSearchInput() {
  debouncedSearch()
}

function onClearQuery() {
  query.value = ''
  fetchContractList(false)
}

function onCategoryClick(category: string) {
  debugger;
  if (activeCategory.value === category) return
  activeCategory.value = category
  fetchContractList(false)
}

function onLoadMore() {
  fetchContractList(true)
}

function sortChange({ prop, order }: { prop: string; order: 0 | -1 | 1 }) {
  sortBy.value = prop
  activeSort.value = order
  fetchContractList(false)
}

onMounted(() => {
  fetchCategoryList()
  fetchContractList(false)
})

watch(() => locale.value, () => {
  fetchCategoryList()
})
</script>

<style lang="scss" scoped>
.search-input {
  background: var(--border);
  padding: 0;
  border-radius: 4px;
  :deep().el-input__wrapper {
    border-bottom: 1px solid var(--border);
    .el-input__inner::placeholder {
      color: var(--third-text);
    }
  }
}
</style>
