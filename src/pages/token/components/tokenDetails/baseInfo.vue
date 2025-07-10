<script setup lang="ts">
import {
  getTokenDetailsList,
  type GetTokenDetailsListResponse,
  getTokenStatistics,
  type GetTokenStatisticsResponse
} from '~/api/token'
import {filterLanguage} from '~/pages/token/components/kLine/utils'
import dayjs from 'dayjs'
import {addAttention, deleteAttention} from '~/api/attention'
import ExcludeError from './excludeError.vue'
import {addSign} from '@/utils'
import List from './list.vue'
import BigNumber from 'bignumber.js'

const tokenDetailStore = useTokenDetailsStore()
const themeStore = useThemeStore()
const botStore = useBotStore()
const {t} = useI18n()
const listQuery = shallowRef({
  pageNO: 1,
  max_block_number: 0,
  max_event_id: 0,
  pageSize: 40,
  event_type: ''
})
const checkedTrend = ref(['SWAP', 'ADD_LIQUIDITY/REMOVE_LIQUIDITY'])
const trendList = shallowRef<GetTokenDetailsListResponse[]>([])
const filteredTrendList = computed(() => {
  return trendList.value.filter(
    i =>
      (i.is_target && (i.event_type == 'swap_buy' || i.event_type == 'swap_sell')) ||
      !(i.event_type == 'swap_buy' || i.event_type == 'swap_sell')
  ).filter(i => NATIVE_TOKENS.findIndex(y => y?.toLowerCase() == i.token?.toLowerCase()) == -1)

})
const listStatus = ref({
  loading: false,
  finished: false,
  error: false,
})
const statistics = ref<GetTokenStatisticsResponse & { progress: any }>({} as any)
const isAttention = computed(() => statistics.value.is_wallet_address_fav === 1)
const editable = ref(false)
const languageKey = computed(() => {
  return filterLanguage(useLocaleStore().locale)
})

defineExpose({
  init
})

function init() {
  trendList.value.length = 0
  editable.value = false
  statistics.value = {} as any
  _getTokenStatistics()
  resetListStatus()
}

function resetListStatus() {
  listQuery.value.pageNO = 1
  listQuery.value.max_block_number = 0
  listQuery.value.max_event_id = 0
  listQuery.value.event_type = ''
  listStatus.value.finished = false
  listStatus.value.error = false
  _getTokenDetailsList()
}

function _getTokenStatistics() {
  const {chain, address} = tokenDetailStore.tokenInfo!
  const data = {
    user_address: tokenDetailStore.user_address,
    self_address: botStore.evmAddress,
    token: address,
    chain
  }
  getTokenStatistics(data)
    .then(res => {
      const progress = Number(res.history_max_balance_amount) > 0
        ? Math.min(new BigNumber(res?.balance_amount)
          .dividedBy(new BigNumber(res?.history_max_balance_amount))
          .multipliedBy(100).toNumber(), 100)
        : 0
      statistics.value = {
        ...(res || {}),
        progress
      }
    })
}

function _getTokenDetailsList() {
  listStatus.value.loading = true
  const {chain, address} = tokenDetailStore.tokenInfo!
  const data = {
    user_address: tokenDetailStore.user_address,
    token: address,
    chain,
    ...listQuery.value
  }
  if (checkedTrend.value.length === 0) {
    data.event_type = ''
  } else if (checkedTrend.value.length > 0 && checkedTrend.value.length <= 5) {
    let event_type = checkedTrend.value?.filter?.(i => i !== 'all')
    event_type = event_type?.map(i => i.replace('/', ','))
    data.event_type = event_type?.toString()
  }
  getTokenDetailsList(data)
    .then(res => {
      const list = Array.isArray(res) ? res : []
      const arr = list.map(i => {
        let event_type = i.event_type
        if (i.event_type === 'SWAP' && i.flow_type == 0) {
          event_type = 'swap_buy'
        }
        if (i.event_type === 'SWAP' && i.flow_type == 1) {
          event_type = 'swap_sell'
        }
        if (i.event_type === 'TRANSFER' && i.flow_type == 0) {
          event_type = 'transfer_in'
        }
        if (i.event_type === 'TRANSFER' && i.flow_type == 1) {
          event_type = 'transfer_out'
        }
        return {
          ...i,
          event_type: event_type
        }
      })
      if (listQuery.value.pageNO === 1) {
        trendList.value = arr
      } else {
        trendList.value = trendList.value.concat(arr)
      }
      listStatus.value.finished = list.length < listQuery.value.pageSize
      if (!listStatus.value.finished) {
        listQuery.value.pageNO++
      }
      listQuery.value.max_block_number = arr[arr?.length - 1]?.block_number
      listQuery.value.max_event_id = arr[arr?.length - 1]?.event_id
    }).finally(() => {
    listStatus.value.loading = false
  })
}

// function updateRemark({remark}) {

// }

function attention() {
  if (!verifyLogin()) {
    return
  }
  const {chain, address} = tokenDetailStore.tokenInfo!
  const data = {
    user_address: tokenDetailStore.user_address,
    user_chain: chain,
    address
  }
  if (isAttention.value) {
    deleteAttention(data)
      .then(() => {
        ElMessage.success(t('attention1Canceled'))
        statistics.value.is_wallet_address_fav = 0
      })
  } else {
    addAttention(data)
      .then(() => {
        ElMessage.success(t('attention1Success'))
        statistics.value.is_wallet_address_fav = 1
      })
  }
}
</script>

<template>
  <div>
    <div
      class="flex justify-between items-center mb-20px"
    >
      <div class="flex items-center">
        <UserAvatar
          v-if="statistics.wallet_logo"
          :wallet_logo="statistics.wallet_logo"
          :chain="tokenDetailStore.tokenInfo!.chain"
          :address="tokenDetailStore.user_address"
          iconSize="36px"
          iconChainSize="14px"
          class="rounded-full"
        />
        <div class="ml-6px color-[--d-F5F5F5-l-333]">
          <div class="flex items-center gap-6px mb-3px">
            <UserRemark
              showAddressTitle
              :remark="statistics.remark"
              :address="tokenDetailStore.user_address"
              :chain="tokenDetailStore.tokenInfo!.chain"
              :wallet_logo="statistics.wallet_logo"
              address-class="max-w-95px whitespace-nowrap text-ellipsis overflow-x-hidden text-14px"
              :formatAddress="(address: string) => address.slice(0, 4) + '...' + address.slice(-4)"
            />
            <div v-if="statistics.newTags?.length > 0" class="ml-6px">
              <el-tooltip
                placement="top"
              >
                <template #default>
                  <div
                    v-if="statistics.newTags?.length > 0"
                    class="w-fit flex items-center"
                  >
                    <template v-for="(i, index) in statistics.newTags" :key="index">
                      <img
                        v-if="(i.type?.includes('TOP') && i.type?.slice(3) < 25) || Number(i.type)"
                        class="mr-8px w-12px h-12px"
                        :src="formatNewTags(i.icon)"
                        alt=""
                        height="12"
                        width="12"
                      >
                    </template>
                  </div>
                </template>
                <template #content>
                  <div>
                    <template v-for="(i, index) in statistics.newTags" :key="index">
                      <span
                        v-if="(i.type?.includes('TOP') && i.type?.slice(3) < 25) || Number(i.type)"
                        class="mr-3px text-12px"
                        :style="{
                          color: i.color
                        }"
                      >
                        [{{ i?.[languageKey] }}]
                      </span>
                      <div
                        v-if="i.extra_info?.length > 0 && i.type == '9'"
                        class="color-#f2ad41 mt-5px"
                      >
                        <template v-for="(lock, $index) in i?.extra_info" :key="$index">
                          <span class="block mt-5px">
                            {{ $t('lockAmount') }}:
                            {{ formatNumber(lock.amount, 2) }}
                          </span>
                          <span class="block mt-5px">
                            {{ $t('lockDate') }}:
                            {{ dayjs(lock.lockDate).format('YYYY-MM-DD') }}
                          </span>
                          <span class="block mt-5px">
                            {{ $t('unlockDate') }}:
                            {{ dayjs(lock.unlockDate).format('YYYY-MM-DD') }}
                          </span>
                        </template>
                      </div>
                    </template>
                  </div>
                </template>
              </el-tooltip>
            </div>
          </div>
          <div class="flex items-center gap-6px">
            <span class="text-12px color-[--d-999-l-959A9F]">{{
                tokenDetailStore.user_address.slice(0, 4)
              }}...{{ tokenDetailStore.user_address.slice(-4) }}</span>
            <Icon
              v-copy="tokenDetailStore.user_address"
              name="bxs:copy"
              class="cursor-pointer color-[--d-666-l-696E7C] text-10px"
            />
            <!--<Icon-->
            <!--  name="custom:attention"-->
            <!--  :class="`cursor-pointer ${isAttention-->
            <!--      ?'color-#f45469'-->
            <!--      :'color-[&#45;&#45;d-666-l-696E7C]'} text-10px hover:color-#f45469`"-->
            <!--  @click.self.stop="attention"-->
            <!--/>-->
          </div>
        </div>
      </div>
      <NuxtLink
        v-if="$route.path.indexOf('/address/') == -1"
        :to="`/address/${tokenDetailStore.user_address}/${tokenDetailStore.tokenInfo!.chain}`" class="py-7px px-8px bg-[--d-333-l-F2F2F2] rounded-4px color-[--d-F5F5F5-l-333] text-12px"
      >
        {{ $t('walletDetail') }}
      </NuxtLink>
    </div>
    <div class="flex items-center mb-20px">
      <div class="flex-1 flex flex-col">
        <span class="color-[--d-666-l-999] text-12px lh-16px mb-4px">{{ $t('total_profit') }}</span>
        <div
          class="flex text-16px lh-24px items-center"
          :class="getColorClass(statistics.total_profit)"
        >
          <ExcludeError :model-value="statistics.total_profit">
            {{ addSign(Number(statistics.total_profit)) }}${{
              formatNumber(Math.abs(Number(statistics.total_profit)), 2)
            }}
          </ExcludeError>
          (<ExcludeError :model-value="statistics.total_profit_ratio">{{
              addSign(Number(statistics.total_profit_ratio))
            }}{{
              formatNumber(Math.abs(Number(statistics.total_profit_ratio) * 100), 2)
            }}%
          </ExcludeError>)
          <Share
            :address="tokenDetailStore.user_address"
            :chain="tokenDetailStore.tokenInfo!.chain"
            :statistics="statistics"
          />
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <span class="color-[--d-666-l-999] text-12px lh-16px mb-4px">{{ $t('walletTotalBalance') }}</span>
        <div class="flex text-16px lh-24px items-center color-[--d-F5F5F5-l-333]"
        >
          <ExcludeError
            :model-value="statistics.balance_amount">
            {{ formatNumber(statistics.balance_amount, 2) }}(${{
              formatNumber(statistics.balance_usd, 2)
            }})
          </ExcludeError>
        </div>
      </div>
    </div>
    <div class="flex items-center mb-20px">
      <div class="flex-1 flex flex-col">
        <span class="color-[--d-666-l-999] text-12px lh-16px mb-4px">{{ $t('wallet_detail_transfer_in_out') }}</span>
        <div class="flex text-16px lh-24px items-center color-#959a9f"
        >
          <ExcludeError :model-value="statistics.total_transfer_in_usd">
            <span class="color-#12B886">
              ${{
                formatNumber(statistics.total_transfer_in_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--d-999-l-666]">/</span>
          <ExcludeError :model-value="statistics.total_transfer_out_usd">
            <span class="color-#F6465D">${{ formatNumber(statistics.total_transfer_out_usd, 2) }}</span>
          </ExcludeError>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <span class="color-[--d-666-l-999] text-12px lh-16px mb-4px">{{ $t('wallet_detail_total_buy_sell') }}</span>
        <div class="flex text-16px lh-24px items-center color-#959a9f"
        >
          <ExcludeError :model-value="statistics.total_purchase_usd">
            <span class="color-#12B886">
              ${{
                formatNumber(statistics.total_purchase_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--d-999-l-666]">/</span>
          <ExcludeError :model-value="statistics.total_sold_usd">
            <span class="color-#F6465D">${{ formatNumber(statistics.total_sold_usd, 2) }}</span>
          </ExcludeError>
        </div>
      </div>
    </div>
    <div class="flex items-center mb-20px">
      <div class="flex-1 flex flex-col">
        <span class="color-[--d-666-l-999] text-12px lh-16px mb-4px">{{ $t('wallet_detail_buy_sell_avg') }}</span>
        <div
          class="flex text-16px lh-24px items-center"
          :class="getColorClass(statistics.total_profit)"
        >
          <ExcludeError :model-value="statistics.average_purchase_price_usd">
            <span class="color-#12B886">
              ${{
                formatNumber(statistics.average_purchase_price_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--d-999-l-666]">/</span>
          <ExcludeError :model-value="statistics.average_sold_price_usd">
            <span class="color-#F6465D">${{ formatNumber(statistics.average_sold_price_usd, 2) }}</span>
          </ExcludeError>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <span class="color-[--d-666-l-999] text-12px lh-16px mb-4px">{{ $t('wallet_detail_tx_count') }}</span>
        <div class="flex text-16px lh-24px items-center color-#959a9f"
        >
          <ExcludeError :model-value="statistics.total_purchase">
            <span class="color-#12B886">
              {{
                formatNumber(statistics.total_purchase, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--d-999-l-666]">/</span>
          <ExcludeError :model-value="statistics.total_sold">
            <span class="color-#F6465D">{{ formatNumber(statistics.total_sold, 2) }}</span>
          </ExcludeError>
        </div>
      </div>
    </div>
    <div
      v-infinite-scroll="_getTokenDetailsList"
      :infinite-scroll-disabled="listStatus.loading || listStatus.finished || listStatus.error"
      infinite-scroll-distance="300"
      :infinite-scroll-delay="10"
      :infinite-scroll-immediate="false"
    >
      <List
        v-model="checkedTrend"
        v-loading="listStatus.loading&&listQuery.pageNO===1&&filteredTrendList.length===0"
        :tableList="filteredTrendList"
        :loading="listStatus.loading"
        element-loading-background="transparent"
        @update:modelValue="resetListStatus"
      />
      <div
        v-if="listStatus.loading&&listQuery.pageNO!==1"
        class="mt-20px text-14px text-center color-[--d-999-l-666]">
        {{ $t('loading') }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
