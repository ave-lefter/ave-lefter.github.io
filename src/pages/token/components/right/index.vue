<template>
  <div v-show="globalStore.showRight">
    <div class="flex flex-col h-[calc(100vh-94px)] v-scroller-container">
      <!-- <div class="p-15px bg-[--secondary-bg]">
          <PriceTabs v-model="tabActive" :tabs="tabs" />
          <template v-for="item in tabs" :key="item.id">
            <VolumeStats
              v-if="tabActive === item.id"
              :tabActive="item.id"
              :tabActiveName="item.name"
            />
          </template>
        </div> -->
      <PriceTabs v-model="tabActive" :tabs="tabs" />
      <!-- <div class="flex items-center justify-around color-[--main-text] p-15px bg-[--secondary-bg] mt-4px">
        <div class="text-center">
          <div class="text-14px mb-5px">${{ formatNumber(token?.open_price || 0, 3) }}</div>
          <div class="text-12px color-[--third-text]">{{ $t('openPrice') }}</div>
        </div>
        <div class="text-center">
          <div class="text-14px mb-5px">{{ tokenStore.circulation?.gt?.(0) ? (formatNumber(((tokenStore?.tokenInfoExtra?.amount_24 || 0) / Number(tokenStore?.circulation.toFixed())) * 100 || 0, 2) + '%') : '-' }}</div>
          <div class="text-12px color-[--third-text]">{{ $t('24Exchange') }}</div>
        </div>
        <div class="text-center">
          <div class="text-14px mb-5px">-</div>
          <div class="text-12px color-[--third-text]">DEV</div>
        </div>
      </div> -->
      <div class="p-15px bg-[--secondary-bg] mt-.5px">
        <!-- <BotSwap /> -->
        <component :is="SwapCom" :key="walletStore.address ? 'Swap' : 'BotSwap'" />
      </div>
      <div class="p-15px pb-5px bg-[--secondary-bg] mt-1px">
        <!-- <div
            class="flex justify-between border-b-1px border-b-solid border-b-[--main-divider] pb-8px mb-8px text-12px"
          >
            <span class="text-12px color-[--main-text]">{{ $t('totalPair') }}</span>
            {{ formatNumber(tokenStore.token?.main_pair_tvl || 0, 1) }}
          </div> -->
        <Pairs @openFilterModal="openFilterModal" />
      </div>
      <Info :tagsRatio="tagsRatio" @getTagsRatio="_getTagsRatio"/>
      <SimilarTokens :tokens="similarTokenList" />
      <Overview class="px-15px pb-10px pr-0 bg-[--secondary-bg]" />
      <div class="bg-[--secondary-bg] flex-1" />
    </div>

    <el-dialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      :title="searchAmm"
      width="480"
      destroy-on-close
    >
      <Pairs :search="searchAmm" :isInModal="true" />
      <template #footer>
        <el-button
          type="primary"
          block
          class="w-full h-[48px]"
          size="large"
          @click="dialogVisible = false"
          >{{ $t('confirm') }}</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import PriceTabs from './priceTabs.vue'
// import VolumeStats from './volumeStats.vue'
import Pairs from './pairs.vue'
import Overview from './overview.vue'
import BotSwap from './botSwap/index.vue'
import Swap from './swap/index.vue'
import Info from './info/index.vue'
import SimilarTokens from './similarTokens.vue'
import { getTagsRatio, getSimilarTokens } from '~/api/token'
// const Swap = defineAsyncComponent(() => import('./swap/index.vue'))

const dialogVisible = shallowRef(false)
const globalStore = useGlobalStore()
const searchAmm = shallowRef('')
const walletStore = useWalletStore()
const tokenStore = useTokenStore()

const SwapCom = computed(() => {
  if (walletStore.address) {
    return Swap
  } else {
    return BotSwap
  }
})
const tabs: { id: '5m' | '1h' | '4h' | '24h'; name: string }[] = [
  { id: '5m', name: '5M' },
  { id: '1h', name: '1H' },
  { id: '4h', name: '4H' },
  { id: '24h', name: '24H' },
]
const tabActive = useLocalStorage('token_tab_active', '24h') as RemovableRef<
  '5m' | '1h' | '4h' | '24h'
>

const openFilterModal = (search: string) => {
  console.log('openFilterModal', search)
  dialogVisible.value = true
  searchAmm.value = search
}

const wsv2Store = useV2WSStore()
const route = useRoute()
const { token, pair } = storeToRefs(tokenStore)
const tagsRatio = ref<{
  address_binding_ratio: number
  bundle_ratio: number
  dev_age_seconds: number
  dev_first_transfer_in_from_label: string
  dev_ratio: number
  kol_count: number
  kol_ratio: number,
  max_dev_ratio: number
  rat_ratio: number
  sniper_balance_ratio_cur: number
  top10_ratio: number
  smart_wallet_count: number
  smart_wallet_ratio: number
}>({
  address_binding_ratio: 0,
  bundle_ratio: 0,
  dev_age_seconds: 0,
  dev_first_transfer_in_from_label: '',
  dev_ratio: 0,
  kol_count: 0,
  kol_ratio: 0,
  max_dev_ratio: 0,
  rat_ratio: 0,
  sniper_balance_ratio_cur: 0,
  top10_ratio: 0,
  smart_wallet_count: 0,
  smart_wallet_ratio: 0
})
const id = computed(() => route.params.id as string)
const chain = computed(() => {
  const { chain } = getAddressAndChainFromId(id.value, 0)
  return chain
})
const address = computed(() => {
  const { address } = getAddressAndChainFromId(id.value, 0)
  return address
})
watch(
  () => route.params.id,
  () => {
    if (route.params.id) {
      _getTagsRatio()
      _getSimilarToken()
    }
  }
)
watch(
  () => wsv2Store.wsResult[WSEventV2Type.SUB_TOKEN_KLINE_EXTRA],
  (val) => {
    if (!Array.isArray(val) || !val.length) return
    const result = val[0]
    if (result.token_address == address.value) {
      mergeStatistics(result)
    }
  }
)
onMounted(() => {
  _getTagsRatio()
  _getSimilarToken()
})
async function _getTagsRatio(isTrue?:boolean) {
  const res = await getTagsRatio(id.value)
  tagsRatio.value = res || {}
  if (!isTrue) {
    subscribeTokenKlineExtra()
  }
}
function subscribeTokenKlineExtra() {
  wsv2Store.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: ['sub_token_kline_extra'],
    id: 1,
  })
  setTimeout(() => {
    wsv2Store.send({
      jsonrpc: '2.0',
      method: 'subscribe',
      params: [
        'sub_token_kline_extra',
        {
          ch: chain.value,
          tk: address.value,
        },
      ],
      id: 1,
    })
  }, 500)
}
function mergeStatistics(source: any) {
  if (source?.progress != null && pair.value) {
    pair.value.progress = Number(source.progress)
  }
  if (source?.holder_count != null && token.value) {
    token.value.holders = source.holder_count
  }

  if (source?.top10_ratio != null) {
    tagsRatio.value.top10_ratio = source.top10_ratio
  }
  if (source?.dev_ratio != null) {
    tagsRatio.value.dev_ratio = source.dev_ratio
  }
  if (source?.max_dev_ratio != null) {
    tagsRatio.value.max_dev_ratio = source.max_dev_ratio
  }
  if (source?.first_transfer_in_from_label != null) {
    tagsRatio.value.dev_first_transfer_in_from_label = source.first_transfer_in_from_label
  }
  if (source?.age_seconds != null) {
    tagsRatio.value.dev_age_seconds = source.age_seconds
  }
  if (source?.sniper_ratio != null) {
    tagsRatio.value.sniper_balance_ratio_cur = source.sniper_ratio
  }
  if (source?.rat_ratio != null) {
    tagsRatio.value.rat_ratio = source.rat_ratio
  }
  if (source?.address_binding_ratio != null) {
    tagsRatio.value.address_binding_ratio = source.address_binding_ratio
  }
  if (source?.kol_count != null) {
    tagsRatio.value.kol_count = source.kol_count
  }
  if (source?.kol_ratio != null) {
    tagsRatio.value.kol_ratio = source.kol_ratio
  }
  if (source?.smart_wallet_count != null) {
    tagsRatio.value.smart_wallet_count = source.smart_wallet_count
  }
  if (source?.smart_wallet_ratio != null) {
    tagsRatio.value.smart_wallet_ratio = source.smart_wallet_ratio
  }
}
const similarTokenList = ref([])
async function _getSimilarToken() {
  const res = await getSimilarTokens(id.value)
  similarTokenList.value = res.tokens || []
}
</script>
