<template>
  <el-dialog
    v-model="visible"
    width="780"
    height="590"
    :show-close="false"
    class="search-dialog"
    header-class="p-0!"
    @opened="openDialog"

  >
    <el-input
      ref="inputSearch"
      v-model.trim="query"
      class="search-input px-20px "
      :placeholder="$t('enterAddress/token')"
      clearable
      autofocus
      @keydown.enter="tokenSearch"
    >
      <template #prefix>
        <Icon
          class="text-20px text-[var(--d-666-l-999)]"
          name="custom:search"
        />
      </template>
      <template #suffix>
        <Icon v-if="query" name="pajamas:clear" class="color-[--d-666-l-999] text-12px hover:opacity-70% cursor-pointer" @click="query=''"/>
      </template>
    </el-input>

    <div
      v-if="query === '' && historyList?.length > 0"
      class="search-history-container mt-24px px-20px"
    >
      <div class="header-title flex items-center justify-between">
        <span class="color-[--d-666-l-999] text-12px">{{
          $t('searchHistory')
        }}</span>
        <Icon
          class="text-14px text-[--d-666-l-999] cursor-pointer"
          name="ic:baseline-delete"
          @click.stop="confirm"
        />
      </div>
      <div class="search-history mt-10px">
        <button
          v-for="(item, index) in historyList"
          :key="index"
          class="history-tag"
          @click.stop="query=item;isHistory=true;tokenSearch()"
        >
          {{ formatLength(item) }}
        </button>
      </div>
    </div>
    <div class="tabs mt-20px px-20px">
      <button
        v-for="item in tabs"
        :key="item.id"
        class="tab-button clickable-btn px-0 mr-24px"
        :class="{ active: tabActive === item.id }"
        @click="tabActive = item.id"
      >
        {{ item.name }}
      </button>
    </div>
    <div class="search-content">
      <template v-if="query === ''">
        <SearchTable
          v-if="tabActive === 'token'"
          :tokens="hotTokenList.slice(0, 200) || []"
          :loading="loading"
          @close="visible = false"
        />
        <WalletTable v-else :tokens="smartTop10List || []" :loading="loading"  @close="visible = false" />
      </template>
      <WalletTable
        v-else-if="tabActive === 'wallet'"
        :tokens="searchResult?.wallet_list || []"
        :loading="loading"
        @close="visible = false"
      />
      <SearchTable
        v-else
        :tokens="searchResult?.token_list?.slice?.(0, 200) || []"
        :loading="loading"
        @close="visible = false"
      />
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import SearchTable from './searchTable.vue'
import WalletTable from './walletTable.vue'
import { _getSmartTop10, _tokenSearchV3 } from '@/api/hot'
import type {SearchWalletInfo, SearchInfo } from '@/api/types/search'
import { useDebounceFn, useLocalStorage } from '@vueuse/core'
import { ElMessageBox, type ElInput } from 'element-plus'
import { ProvideType } from '~/utils/constants'
import { getHotTokens, type GetHotTokensResponse } from '@/api/token'
import type {IPriceV2Response} from '~/api/types/ws'
const { hotList } = storeToRefs(useGlobalStore())

const { modelValue } = defineProps({
  modelValue: Boolean,
})
const $emit = defineEmits(['update:modelValue'])
const i18n = useI18n()
const themeStore = useThemeStore()
const visible = computed({
  get() {
    return modelValue
  },
  set(value) {
    $emit('update:modelValue', value)
  },
})
const tabActive = shallowRef('token')
const inputSearch = useTemplateRef<HTMLElement | null>('inputSearch')
const tabs = computed(() => {
  return [
    { id: 'token', name: i18n.t('popularSearches') },
    { id: 'wallet', name: i18n.t('wallet') },
  ]
})
const hotTokens = inject<{
  value: Ref<GetHotTokensResponse[]>;
  setVal: (val: GetHotTokensResponse[]) => void
}>(ProvideType.HOT_TOKENS)
const hotTokenList = computed(() => {
  if (hotTokens) {
    return hotTokens.value.value
  }
  return []
})
const wsStore = useWSStore()
const priceV2Store = usePriceV2Store()
onMounted(() => {
  getSmartTop10()
})

const botStore = useBotStore()
const smartTop10List = shallowRef<Array<SearchWalletInfo>>([])
const loading = shallowRef(false)
function getSmartTop10() {
  const data = {
    chain: 'solana',
    self_address: botStore.evmAddress ? botStore.evmAddress : undefined,
  }
  _getSmartTop10(data)
    .then((res) => {
      smartTop10List.value = Array.isArray(res) ? res : []
    })
    .catch()
    .finally(() => {})
}
const query = shallowRef('')
const searchResult = shallowRef<SearchInfo | null>(null)
function tokenSearch() {
  if(!query.value)
  return
  const data = {
    query: query.value,
    self_address: botStore.evmAddress ? botStore.evmAddress : undefined,
  }
  setHistoryList(query.value)
  loading.value = true
  _tokenSearchV3(data)
    .then((res) => {
      searchResult.value = {
        ...res,
        token_list: res?.token_list?.map?.((i) => {
          return {
            ...i,
            id: i.token + '-' + i.chain,
          }
        }),
        wallet_list:  res?.wallet_list?.map?.((i) => {
          return {
            ...i,
            total_profit_rate: i.total_profit_ratio || 0
          }
        }),
      }
      const isWallet = res?.wallet_list?.length > 0
      if (res?.token_list?.length > 0 && !isWallet) {
        tabActive.value = 'token'
      } else if (isWallet && !res?.token_list?.length) {
        tabActive.value = 'wallet'
      } else if (!isWallet && !res?.token_list?.length) {
        tabActive.value = 'token'
      } else {
        tabActive.value = 'token'
      }
    })
    .catch((error) => {
      searchResult.value = {
        token_list: [],
        wallet_list: [],
      }
      console.log(error.response)
    })
    .finally(() => {
      loading.value = false
      isHistory = false
    })
}
const debouncedFetch = useDebounceFn(tokenSearch, 500)
let isHistory = false
watch(query, (newval) => {
  if (isHistory) {
    return
  }
  if (newval) {
    debouncedFetch()
  }
})

watch(visible, (val) => {
  if (val) {
    query.value = ''
  }
})
onMounted(() => {
  if (hotList?.value?.length == 0) {
    _getHotTokens()
  }
})
function openDialog() {
  inputSearch.value?.focus()
}
function formatLength(item: string) {
  if (item.length <= 10) {
    return item
  }
  return item.slice(0, 4) + '...' + item.slice(-4)
}

const historyList = useLocalStorage<string[]>('searchHistoryList', [])
function setHistoryList(history: string) {
  historyList.value.unshift(history)
  historyList.value = Array.from(new Set(historyList.value))
  if (historyList.value.length >= 10) {
    historyList.value = historyList.value.slice(0, 10)
  }
}
function confirm() {
  ElMessageBox.confirm(i18n.t('whetherToClearHistory'), i18n.t('tips'), {
    confirmButtonText: i18n.t('confirm'),
    cancelButtonText: i18n.t('cancel'),
    customClass: themeStore.theme,
  })
    .then(() => {
      historyList.value = []
    })
    .catch(() => {
      // on cancel
    })
}

watch(() => wsStore.wsResult[WSEventType.PRICEV2], (val: IPriceV2Response) => {
  const idToPriceMap: { [key: string]: IPriceV2Response['prices'][0] } = {}
  val.prices.forEach((item) => {
    idToPriceMap[item.token + '-' + item.chain] = item
  })
  hotList.value = hotList.value.map(el => {
    const current = idToPriceMap[el.token + '-' + el.chain]
    if (current) {
      return {
        ...el,
        current_price_usd: current.uprice,
        price_change: current.price_change
      }
    }
    return el
  })
  if (hotTokens) {
    hotTokens.setVal(hotList.value)
  }
})
async function _getHotTokens() {
  try {
    const res = await getHotTokens()
    hotList.value = res || []
    if (hotTokens) {
      hotTokens.setVal(hotList.value)
    }
    priceV2Store.setMultiPriceParams('trending', hotList.value.map(el => el.token + '-' + el.chain))
    priceV2Store.sendPriceWs()
  } catch (e) {
    console.log('=>(trending.vue:15) e', e)

  }
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  align-items: center;
  .tab-button {
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    font-size: 14px;
    color: var(--d-666-l-999);
    &.active {
      color: var(--d-F5F5F5-l-333);
    }
  }
}
.search-history-container {
}
.search-history {
  display: flex;
  flex-wrap: wrap;
}
.history-tag {
  min-width: 60px;
  background: var(--d-333-l-F2F2F2);
  color: #848e9c;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 10px;
  padding: 7px 9px;
  border: none;
  color: var(--d-F5F5F5-l-333);
  font-size: 12px;
  cursor: pointer;
  & + .history-tag {
    margin-left: 0;
  }
}
</style>
