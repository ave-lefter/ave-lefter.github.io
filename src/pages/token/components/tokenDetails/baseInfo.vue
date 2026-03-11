<script setup lang="ts">
import {
  getTokenDetailsList,
  type GetTokenDetailsListResponse,
  getTokenStatistics,
  type GetTokenStatisticsResponse
} from '~/api/token'
import { filterLanguage } from '~/pages/token/components/kLine/utils'
import TradeDialog from '@/pages/copy-trade/components/tradeDialog.vue'
import dayjs from 'dayjs'
import {addAttention, deleteAttention,addAttention2} from '~/api/attention'
import ExcludeError from './excludeError.vue'
import {addSign} from '@/utils'
import List from './list.vue'
import BigNumber from 'bignumber.js'
const tokenStore = useTokenStore()
const tokenDetailStore = useTokenDetailsStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const globalStore = useGlobalStore()
const router = useRouter()
const {t} = useI18n()
const route = useRoute()
const listQuery = shallowRef({
  pageNO: 1,
  max_block_number: 0,
  max_event_id: 0,
  pageSize: 40,
  event_type: ''
})
const attentionTriggerRef=ref()
const checkedTrend = ref(['SWAP', 'ADD_LIQUIDITY/REMOVE_LIQUIDITY'])
const trendList = shallowRef<GetTokenDetailsListResponse[]>([])
const filteredTrendList = computed(() => {
  const {address} = getAddressAndChainFromId(route.params.id as string)
  return trendList.value.filter(
    i =>
      (i.is_target && (i.event_type == 'swap_buy' || i.event_type == 'swap_sell')) ||
      !(i.event_type == 'swap_buy' || i.event_type == 'swap_sell')
  ).filter(el=>{
    const nativeTokens = NATIVE_TOKENS.map(native => native.toLowerCase())
    // 当前查看的是主币的持币详情
    const isNativeTokenDetail = tokenDetailStore.tokenInfo ? nativeTokens.includes(tokenDetailStore.tokenInfo.address.toLowerCase()) :false
    //  当前列表项中是主币
    const isMainToken = NATIVE_TOKENS.includes(el.token.toLowerCase())
    return (isNativeTokenDetail && isMainToken) || (!isNativeTokenDetail && !isMainToken)
  })

})
const walletAddress = computed(() => botStore.evmAddress || walletStore.address)
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

// 右键点击事件处理
function handleClick(e: MouseEvent, row: any) {
  e.preventDefault()
  const rightClickAction = globalStore.audioSettings?.wallet?.clickAction
  // rightClickAction: 0 不打开, 1 新tab打开
  const url = `/address/${row.user_address}/${row.tokenInfo.chain}`
  if (rightClickAction === 1) {
    window.open(url, '_blank')
  } else{
    window.open(url, '_self')
  }
}

// 右键点击事件处理
function handleContextMenu(e: MouseEvent, row: any) {
  e.preventDefault()
  const rightClickAction = globalStore.audioSettings?.wallet?.rightClickAction
  // rightClickAction: 0 不打开, 1 新tab打开
  if (rightClickAction === 1) {
    const url = `/address/${row.user_address}/${row.tokenInfo.chain}`
    window.open(url, '_blank')
  }
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
    self_address: walletAddress.value,
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
      let unrealized_profit_ratio = 0
      if (Number(res?.total_profit || 0) > 0) {
        unrealized_profit_ratio = Number(res?.unrealized_profit || 0) / Number(res?.total_profit || 0) * 100
      }
      let balance_amount_ratio = 0
      if (Number(res?.balance_amount || 0) > 0) {
        balance_amount_ratio = Number(res?.balance_amount || 0) / Number(res?.total_purchase_amount || 0) * 100
      }
      let mcap_buy = 0
      if (Number(res?.average_purchase_price_usd || 0) > 0) {
        mcap_buy = new BigNumber(res.average_purchase_price_usd || 0)?.times(tokenStore?.circulation || 0)?.decimalPlaces(2)?.toNumber()
      }
      let mcap_sold = 0
      if (Number(res?.average_sold_price_usd || 0) > 0) {
        mcap_sold = new BigNumber(res.average_sold_price_usd || 0)?.times(tokenStore?.circulation || 0)?.decimalPlaces(2)?.toNumber()
      }
      statistics.value = {
        ...(res || {}),
        progress,
        unrealized_profit_ratio,
        balance_amount_ratio,
        mcap_buy,
        mcap_sold
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
      console.log(res,'res')
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
const collect = async () => {
  if(!useFollowStore().currentAddress){
    useBotStore().changeConnectVisible(true)
  }
  if (useWalletStore().address && !useWalletStore().walletSignature[useWalletStore().address]) {
    await useWalletStore().signMessageForFavorite()
  }
  if(statistics.value.is_wallet_address_fav !== 1){
    useFollowStore().confirmAttention(attentionTriggerRef.value,tokenDetailStore.tokenInfo!.chain, (form) => {
      console.log('confirmAttention', form)
      return addAttention2({
        address: useFollowStore().currentAddress,
        user_address: tokenDetailStore.user_address,
        user_chain: tokenDetailStore.tokenInfo!.chain,
        group: form.group,
        is_monitored: form.is_monitored,
      }).then((res) => {
        globalStore.getFollowsNum()
        // getList()
        _getTokenStatistics()
        return Promise.resolve(res)
      }).catch((err) => {
        return Promise.reject(err)
      })
    })
    return
  }
  // loading.value = true
  deleteAttention({
    address: useFollowStore().currentAddress,
    user_address: tokenDetailStore.user_address,
    user_chain: tokenDetailStore.tokenInfo!.chain
  }).then(() => {
    globalStore.getFollowsNum()
    ElMessage.success( t('attention1Canceled'))
    // getList()
     _getTokenStatistics()
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    // loading.value = false
  })
}

const { activeCopyAddress, copyTradeVisible, form, copyOrder } = storeToRefs(useCopyTradeStore())
const { getFollowingInfo, getFollowingAddress } = useCopyTradeStore()

const id = computed(() => route.params.id as string)
const chain = computed(() => {
  // const { chain } = getAddressAndChainFromId(id.value, 0)
    const { chain } = tokenDetailStore.tokenInfo!
  return chain
})

const address = computed(() => {
  // const { address } = getAddressAndChainFromId(id.value, 0)
  const { address } = tokenDetailStore.tokenInfo!
  return address
})

onMounted(() => {
  if (!botStore.evmAddress && !walletStore.address) return
    getFollowingInfo()
    getFollowingAddress()
})
function judgeIsCopyTrade() {
  const supportAddress = activeCopyAddress.value?.[chain.value] || []
  return supportAddress?.some(i => i?.toLowerCase() === tokenDetailStore.user_address?.toLowerCase())
}
function getCopyTradeId() {
  const order = copyOrder.value?.copyList?.find(i=> i?.followAddress?.toLowerCase() === tokenDetailStore.user_address?.toLowerCase() && i.chain == chain.value)
  return order?.id || ''
}

function jumpCopyTrade() {
  const id = getCopyTradeId()
  const currentUser = botStore?.userInfo?.addresses?.find?.((el) => chain.value == el.chain)
  if (id && currentUser?.address) {
    const routeData = router.resolve({
      name: 'copy-trade-wallet',
      params: {
        userAddress: tokenDetailStore.user_address,
        chain: chain.value,
      },
      query: {
        followAddress: tokenDetailStore.user_address,
        creatorAddress: currentUser?.address,
        id: id
      }
    })
    window.open(routeData.href, '_blank')
  } else {
    const url =`https://t.me/AveSniperBot?start=fs-${chain.value}-${tokenDetailStore.user_address}`
    window.open(url, '_blank')
  }
}
function copyTrade() {
  if (botStore.evmAddress) {
    copyTradeVisible.value = true
    form.value.followAddress = tokenDetailStore.user_address
    form.value.chain = chain.value
  } else {
    const url =`https://t.me/AveSniperBot?start=fs-${chain.value}-${tokenDetailStore.user_address}`
    window.open(url, '_blank')
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
        <div class="ml-6px color-[--main-text]">
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
            <Icon
              ref="attentionTriggerRef" name="custom:attention"
              :class="statistics.is_wallet_address_fav === 1 ? 'color-[#F45469]' : 'color-[--third-text]'" class="h-16px w-16px clickable shrink-0" @click.stop.prevent="collect()" />
            <div v-if="statistics.newTags?.length > 0" class="ml-6px">
              <el-tooltip
                placement="top"
                :persistent="false"
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
            <span
              class="text-12px color-[--secondary-text]"
              @click.stop="handleClick($event, tokenDetailStore)"
              @contextmenu.stop="handleContextMenu($event, tokenDetailStore)"
            >{{
                tokenDetailStore.user_address.slice(0, 4)
              }}...{{ tokenDetailStore.user_address.slice(-4) }}</span>
            <Icon
              v-copy="tokenDetailStore.user_address"
              name="bxs:copy"
              class="cursor-pointer color-[--third-text] text-10px"
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
        :target="globalStore.audioSettings?.wallet?.clickAction == 1  ? '_blank' : '_self'"
        :to="`/address/${tokenDetailStore.user_address}/${tokenDetailStore.tokenInfo!.chain}`" class="py-7px px-8px bg-[--border] rounded-4px color-[--main-text] text-12px"
        @click.stop="tokenDetailStore.drawerVisible = false"
      >
        {{ $t('walletDetail') }}
      </NuxtLink>
    </div>
    <div class="flex items-center mb-20px">
      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('total_profit') }}</span>
        <div
          class="flex text-14px lh-20px items-center"
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
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('unrealizedProfit') }}</span>
        <div class="flex text-14px lh-20px items-center color-[--main-text]"
        >
          <ave-data-number :value="statistics?.unrealized_profit" :signVisible="true">
            {{ formatNumber(Math.abs( Number(statistics?.unrealized_profit ?? 0)), 2) }}
          </ave-data-number>

            <!-- <ave-data-number v-if="statistics?.unrealized_profit_ratio" :value="statistics?.unrealized_profit_ratio" :signVisible="false">
            ({{ formatNumber(Math.abs( Number(statistics?.unrealized_profit_ratio ?? 0)), 2) }}%)
            </ave-data-number> -->
            &nbsp;
            <span
              v-if="statistics?.unrealized_profit_ratio > 0"
              class="text-[var(--up-color)]"
            >
              (+{{ formatNumber(Math.abs( Number(statistics?.unrealized_profit_ratio ?? 0)), 2) }}%)
            </span>
            <span
              v-else-if="statistics?.unrealized_profit_ratio < 0"
              class="text-[var(--down-color)]"
            >
              (-{{ formatNumber(Math.abs( Number(statistics?.unrealized_profit_ratio ?? 0)), 2) }}%)
            </span>
        </div>
      </div>
    </div>

    <div class="flex items-center mb-20px">
      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('currentPosition') }}</span>
        <div class="flex text-14px lh-20px items-center color-[--main-text]"
        >
          <ExcludeError
            :model-value="statistics.balance_usd">
            ${{ formatNumber(statistics.balance_usd, 2) }}
          </ExcludeError>
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('position1') }}%({{ formatNumber(statistics.balance_amount || 0, 2) }} / {{ formatNumber(statistics.total_purchase_amount || 0, 2) }})</span>
        <div class="flex text-14px lh-20px items-center color-[--up-color]"
        >
          <span class="mr-8px">{{ formatNumber(statistics?.balance_amount_ratio || 0, 2) }}%</span>
          <el-progress
            :percentage="statistics?.balance_amount_ratio"
            :stroke-width="4"
            color="#1CC982"
            :show-text="false"
            style="width: 90px"
          />
        </div>
      </div>
    </div>

    <div class="flex items-center mb-20px">
      <!-- <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('positionTime') }}</span>
        <div class="flex text-14px lh-20px items-center color-[--main-text]"
        >
          <template v-if="Number(statistics?.balance_amount || 0) > 0">
            <template v-if="statistics?.first_purchase_time > 0 ">
              {{ formatTimeFromNow(statistics?.first_purchase_time || 0, false, true) }}
            </template>
            <span v-else class="color-[--third-text]">
                --
            </span>
          </template>
          <template v-else-if="statistics?.last_sold_time - statistics?.first_purchase_time">
              {{ formatTime( Number(statistics?.last_sold_time - statistics?.first_purchase_time)) }}
          </template>
          <span class="color-[--third-text]">
              --
          </span>
        </div>
      </div> -->
      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('totalBuy') }}</span>
        <div class="flex text-14px lh-20px items-center color-[--third-text]"
        >
          <ExcludeError :model-value="statistics.total_purchase_usd">
            <span class="color-#12B886">
              ${{
                formatNumber(statistics.total_purchase_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--third-text]">/</span>
          <ExcludeError :model-value="statistics.total_purchase">
            <span class="color-[--third-text]">{{ formatNumber(statistics.total_purchase, 2) }} Txs</span>
          </ExcludeError>
        </div>
        <ExcludeError :model-value="statistics.total_purchase_amount">
          <span class="color-[--secondary-text] text-12px">{{ formatNumber(statistics.total_purchase_amount, 2) }}</span>
        </ExcludeError>
      </div>
      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('averageMarketBuySell') }}</span>
        <div
          class="flex text-14px lh-20px items-center"
          :class="getColorClass(statistics.total_profit)"
        >
          <ExcludeError :model-value="statistics.average_purchase_price_usd">
            <span class="color-#12B886">
              ${{ formatNumber(statistics.mcap_buy, {decimals: 2, l: 4, limit: 3}) }}
            </span>
          </ExcludeError>
          <span class="color-[--secondary-text]">/</span>
          <ExcludeError :model-value="statistics.average_sold_price_usd">
            <span class="color-#F6465D">
              ${{ formatNumber(statistics.mcap_sold, {decimals: 2, l: 4, limit: 3}) }}
            </span>
          </ExcludeError>
        </div>
      </div>
    </div>


    <div class="flex items-center mb-20px">
      <!-- <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('wallet_detail_transfer_in_out') }}</span>
        <div class="flex text-16px lh-24px items-center color-[--secondary-text]"
        >
          <ExcludeError :model-value="statistics.total_transfer_in_usd">
            <span class="color-#12B886">
              ${{
                formatNumber(statistics.total_transfer_in_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--secondary-text]">/</span>
          <ExcludeError :model-value="statistics.total_transfer_out_usd">
            <span class="color-#F6465D">${{ formatNumber(statistics.total_transfer_out_usd, 2) }}</span>
          </ExcludeError>
        </div>
      </div> -->
      <!-- <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('totalBuy') }}</span>
        <div class="flex text-14px lh-20px items-center color-[--third-text]"
        >
          <ExcludeError :model-value="statistics.total_purchase_usd">
            <span class="color-#12B886">
              ${{
                formatNumber(statistics.total_purchase_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--third-text]">/</span>
          <ExcludeError :model-value="statistics.total_purchase">
            <span class="color-#12B886">{{ formatNumber(statistics.total_purchase, 2) }} Txs</span>
          </ExcludeError>
        </div>
        <ExcludeError :model-value="statistics.total_purchase_amount">
          <span class="color-[--secondary-text] text-12px">{{ formatNumber(statistics.total_purchase_amount, 2) }}</span>
        </ExcludeError>
      </div> -->

      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('totalSell') }}</span>
        <div class="flex text-14px lh-20px items-center color-[--third-text]"
        >
          <ExcludeError :model-value="statistics.total_sold_usd">
            <span class="color-#F6465D">
              ${{
                formatNumber(statistics.total_sold_usd, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--third-text]">/</span>
          <ExcludeError :model-value="statistics.total_sold">
            <span class="color-[--third-text]">{{ formatNumber(statistics.total_sold, 2) }} Txs</span>
          </ExcludeError>
        </div>
        <ExcludeError :model-value="statistics.total_sold_amount">
          <span class="color-[--secondary-text] text-12px">{{ formatNumber(statistics.total_sold_amount, 2) }}</span>
        </ExcludeError>
      </div>
    </div>
    <!-- <div class="flex items-center mb-20px">
      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('wallet_detail_buy_sell_avg') }}</span>
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
          <span class="color-[--secondary-text]">/</span>
          <ExcludeError :model-value="statistics.average_sold_price_usd">
            <span class="color-#F6465D">${{ formatNumber(statistics.average_sold_price_usd, 2) }}</span>
          </ExcludeError>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <span class="color-[--secondary-text] text-12px lh-16px mb-4px">{{ $t('wallet_detail_tx_count') }}</span>
        <div class="flex text-16px lh-24px items-center color-[--secondary-text]"
        >
          <ExcludeError :model-value="statistics.total_purchase">
            <span class="color-#12B886">
              {{
                formatNumber(statistics.total_purchase, 2)
              }}
            </span>
          </ExcludeError>
          <span class="color-[--secondary-text]">/</span>
          <ExcludeError :model-value="statistics.total_sold">
            <span class="color-#F6465D">{{ formatNumber(statistics.total_sold, 2) }}</span>
          </ExcludeError>
        </div>
      </div>
    </div> -->
    <!-- <a href="" class="bg-[#3F80F7] rounded-8px p-15px w-full block  hover:opacity-80 mt-24px text-center text-14px mb-40px">{{ $t('copyCompleted') }}</a> -->

    <a v-if="judgeIsCopyTrade()" href="" class="flex items-center justify-center bg-[#3F80F7] !color-white rounded-8px p-15px w-full block  hover:opacity-80 mt-24px text-center text-14px mb-40px" @click.stop.prevent="jumpCopyTrade">
      <!-- <Icon  name="custom:wallet-fill" class="text-14px mr-4px" /> -->
        {{ $t('copiedTrade') }}
    </a>
    <a
      v-else
      class="flex items-center justify-center bg-[#3F80F7] rounded-8px p-15px w-full block !color-white hover:opacity-80 mt-24px text-center text-14px mb-40px"
      href=""
      target="_blank"
      @click.stop.prevent="copyTrade"
      >
      <!-- <Icon  v-if="botStore.evmAddress && SupportCopyTradeChain?.includes?.(chain)"  name="custom:wallet-fill" class="text-14px mr-4px" />
      <img class="mr-4px" v-else src="@/assets/images/tg1.png" alt="" :width="14"> -->
      {{ t('copyCompleted') }}
    </a>
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
        class="mt-20px text-14px text-center color-[--secondary-text]">
        {{ $t('loading') }}
      </div>
    </div>
    <!-- 编辑 -->
    <TradeDialog v-model="copyTradeVisible" />
  </div>
</template>

<style scoped lang="scss">

</style>
