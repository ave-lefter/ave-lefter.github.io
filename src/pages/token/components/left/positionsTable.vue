<script setup lang="ts">
import THead from './tHead.vue'
import {getUserBalance, type GetUserBalanceResponse} from '~/api/swap'
import type {IAssetResponse, IPriceV2Response} from '~/api/types/ws'
import {bot_createSolTx, bot_createSwapEvmTx, bot_getTokenBalance} from '~/api/bot'
import {ElNotification} from 'element-plus'
import {formatBotGasTips} from '~/utils/bot'
import BigNumber from 'bignumber.js'
import {useDebounceFn, useThrottleFn} from '@vueuse/core'
import {useWalletStore} from "~/stores/wallet";

const {t} = useI18n()
const wsStore = useWSStore()
const botSettingStore = useBotSettingStore()
const botStore = useBotStore()
const botSwapStore = useBotSwap()
const priceV2Store = usePriceV2Store()
const tokenStore = useTokenStore()
watch(() => wsStore.wsResult[WSEventType.PRICEV2], (val: IPriceV2Response) => {
  const idToPriceMap: { [key: string]: IPriceV2Response['prices'][0] } = {}
  val.prices.forEach((item) => {
    idToPriceMap[item.token + '-' + item.chain] = item
  })
  listData.value = listData.value.map(el => {
    const current = idToPriceMap[el.index]
    if (current && current.uprice > 0) {
      const noProfit = el.total_profit === '--' || Number(el.total_profit) === 0
      const balance_usd = new BigNumber(el.balance || 0).times(current.uprice || 0)
      if (!noProfit) {
        const total_purchase_usd = new BigNumber(el.balance_usd || 0).minus(el.total_profit || 0)
        const total_profit = balance_usd.minus(total_purchase_usd)
        const total_profit_ratio = new BigNumber(current.uprice || 0)
          .minus(el.average_purchase_price_usd || 0).div(el.average_purchase_price_usd)
        if (total_profit_ratio.toNumber() < -1 || Number(el.average_purchase_price_usd) < 0) {
          return el
        } else {
          return {
            ...el,
            current_price_usd: current.uprice,
            balance_usd: balance_usd.toNumber(),
            total_profit: total_profit.toFixed(),
            total_profit_ratio: total_profit_ratio.toFixed()
          }
        }
      } else {
        return {
          ...el,
          current_price_usd: current.uprice,
          balance_usd: balance_usd.toNumber()
        }
      }
    }
    return el
  })
  triggerRef(listData)
})
watch(() => wsStore.wsResult[WSEventType.ASSET], (val: IAssetResponse) => {
  // 处理 token 交易
  if (val.swap) {
    const token = ((val.swap.token === 'So11111111111111111111111111111111111111112')
      || (val.swap.token === NATIVE_TOKEN))
      ? NATIVE_TOKEN : val.swap.token
    const chain = val.swap.chain
    const type = val.swap.type
    if (token && chain) {
      const index = listData.value.findIndex(i => i.token === token && i.chain === chain)
      // 买入信号
      const isBuy = type === '0'
      const isMainToken = token === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
      const prevBalance = listData.value[index].balance
      if (index > -1) {
        if (isBuy) {
          if (isMainToken) {
            getTokenBalance(token, chain)
          } else {
            listData.value[index].balance = Number(prevBalance) + Number(val.swap.amount)
            triggerRef(listData)
          }
        } else {
          if (isMainToken) {
            getTokenBalance(token, chain)
            //   卖出所有直接删除数据
          } else if (Number(prevBalance) === Number(val.swap.amount)) {
            listData.value.splice(index, 1)
            triggerRef(listData)
          } else {
            listData.value[index].balance = Number(prevBalance) - Number(val.swap.amount)
            triggerRef(listData)
          }
        }
      }
    }
    //   处理转账
  } else if (val.transfer) {
    const chain = val.transfer.chain
    const token = val.transfer.token
    const type = val.transfer.type
    if (token && chain) {
      const index = listData.value.findIndex(i => i.token === token && i.chain === chain)
      const isBuy = type === '0'
      if (index > -1) {
        const indexObj = listData.value[index]
        const balance = Number(indexObj.balance)
        const price = indexObj.current_price_usd
        const newBalance = new BigNumber(balance).plus(isBuy ? val.transfer.amount : -val.transfer?.amount)
        const newBalanceUsd = newBalance.multipliedBy(price)
        indexObj.balance = newBalance.toString()
        indexObj.balance_usd = newBalanceUsd.toNumber()
        triggerRef(listData)
      }
    }
  }
})
const getTokenBalance = useThrottleFn(function (token: string, chain: string) {
  const walletAddress = botStore.getWalletAddress(chain)
  if (walletAddress) {
    bot_getTokenBalance({
      chain,
      walletAddress,
      tokens: [token]
    }).then(tokens => {
      listData.value = listData.value.map(item => {
        if (item.token === token && item.chain === chain) {
          return {
            ...item,
            balance: tokens[0].balance,
            balance_usd: new BigNumber(tokens[0].balance || 0)
              .times(item.current_price_usd || 0).toNumber()
          }
        }
        return {...item}
      })
    })
  }

}, 1000, false, true)

function resetHolderList(walletAddress: string | undefined) {
  [5000, 1000, 15000].forEach(interval => {
    setTimeout(() => {
      resetStatus()
      if (walletAddress) {
        _getUserBalance()
      } else {
        listData.value = []
      }
    }, interval)
  })
}

function resetStatus() {
  listStatus.value.pageNo = 1
  listStatus.value.finished = false
}

const walletStore = useWalletStore()

const userIds = computed(() => {
  if (botStore.userInfo) {
    return botStore.userInfo.addresses.map(({address, chain}) => address + '-' + chain)
  } else if (walletStore.address) {
    return [walletStore.address + '-' + walletStore.chain]
  }
  return []
})

watch(() => userIds.value, () => {
  tableFilter.value.user_ids = userIds.value
})

const tableFilter = ref({
  hide_risk: 1,
  hide_small: 0,
  user_ids: userIds.value
})
const loadingSwap = ref<{ [key: string]: boolean }>({})
const props = defineProps({
  height: {
    type: [Number, String],
    default: 370
  }
})
const scrollbarHeight = computed(() => {
  return Number(props.height) - 110
})
const scrollContainerRef = useTemplateRef('scrollContainerRef')
const getDataOnResize = useDebounceFn(() => {
  const {value} = scrollContainerRef
  if (value && value.scrollHeight <= value.clientHeight && !listStatus.value.finished) {
    _getUserBalance()
  }
}, 200)
watch(scrollbarHeight, getDataOnResize)
const sort = shallowRef({
  sortBy: undefined,
  activeSort: 0
})
const map: { [key: number]: string } = {
  '-1': 'asc',
  1: 'desc'
}
const backendSort = computed(() => {
  const backActiveSort = map[sort.value.activeSort]
  return {
    sort_dir: backActiveSort,
    sort: sort.value.sortBy
  }
})
const columns = computed(() => {
  return [{
    label: `${t('token')}/${t('balance1')}`,
    value: 'balance_usd',
    flex: 'flex-[1.5]',
    sort: true
  }, {
    label: t('profit2'),
    value: 'total_profit',
    flex: 'flex-1 justify-end',
    sort: true
  }, {
    label: '',
    value: '',
    flex: 'flex-1 justify-end',
    sort: false
  }]
})
const listStatus = shallowRef({
  finished: false,
  loading: false,
  pageNo: 1,
  pageSize: 10
})
const listData = shallowRef<(GetUserBalanceResponse & { index: string })[]>([])

onMounted(() => {
  _getUserBalance()
})
watch(() => [
  backendSort.value,
  tableFilter.value.hide_risk,
  tableFilter.value.hide_small,
  botStore.evmAddress,
  () => walletStore.address,
  () => walletStore.walletSignature[walletStore.address]
], () => {
  resetStatus()
  _getUserBalance()
})

async function _getUserBalance() {
  try {
    listStatus.value.loading = true
    const pageNo = listStatus.value.pageNo
    const res = await getUserBalance({
      pageNO: listStatus.value.pageNo,
      pageSize: listStatus.value.pageSize,
      ...tableFilter.value,
      ...backendSort.value,
    })
    if (Array.isArray(res?.data) && res.data.length > 0) {
      if (pageNo === 1) {
        listData.value = res.data.map(i => ({
          ...i,
          index: i.token === NATIVE_TOKEN
            ? getChainInfo(i.chain)?.wmain_wrapper + '-' + i.chain
            : `${i.token}-${i.chain}`,
        }))
      } else {
        const list = res.data
          .filter(i => listData.value.every(j => j.index !== `${i.token}-${i.chain}`))
          .map(i => ({
            ...i,
            index: i.token === NATIVE_TOKEN
              ? getChainInfo(i.chain)?.wmain_wrapper + '-' + i.chain
              : `${i.token}-${i.chain}`
          }))
        listData.value = listData.value.concat(list)
      }
      listStatus.value.finished = res.data.length < listStatus.value.pageSize
      if (!listStatus.value.finished) {
        listStatus.value.pageNo++
      }
    } else {
      if (listStatus.value.pageNo === 1) {
        listData.value = []
      }
    }
    priceV2Store.setMultiPriceParams('positions', listData.value.map(el => el.token + '-' + el.chain))
    priceV2Store.sendPriceWs()
  } catch (e) {
    console.log('=>(favoriteTable.vue:106) (e)', (e))
  } finally {
    listStatus.value.loading = false
    triggerRef(listStatus)
  }
}

async function handleSellAmount(row: GetUserBalanceResponse & { index: string }) {
  if (!verifyLogin()) {
    return
  }
  if (!row.token) {
    return
  }
  const walletAddress = botStore.getWalletAddress(row.chain)
  if (!walletAddress) {
    return
  }
  try {
    loadingSwap.value[row.index] = true
    const tokens = await bot_getTokenBalance({
      chain: row.chain,
      tokens: [row.token],
      walletAddress
    })
    const t = tokens[0]
    if (t) {
      row.balance = t.balance || 0
      row.balance_usd = new BigNumber(t.balance || 0).times(row.current_price_usd || 0).toNumber()
      row.decimals = t.decimals || row.decimals
    }
    const balance = t.balance || 0
    if (!balance) {
      ElNotification(({title: 'Error', type: 'error', message: t('insufficientBalance')}))
      return
    }
    await botSwapStore.checkApproveAndApprove({
      chain: row.chain,
      token: row.token,
      owner: walletAddress
    })
    beforeSubmitSwap(balance, row)
  } finally {
    loadingSwap.value[row.index] = false
  }
}

function beforeSubmitSwap(balance: number, row: GetUserBalanceResponse & { index: string }) {
  if (!verifyLogin()) {
    return
  }
  if (new BigNumber(balance || 0).lte(0)) {
    ElNotification({title: 'Error', type: 'error', message: t('amountMustG0')})
    return
  }
  const amount = (new BigNumber(balance || 0)).toFixed()
    .match(new RegExp(`[0-9]*(\\.[0-9]{0,${row.decimals || 18}})?`))?.[0]
  if ((Number(amount) || 0) <= 0) {
    ElNotification({title: 'Error', type: 'error', message: t('amountTooSmall')})
    return
  }
  loadingSwap.value[row.index] = true
  submitSwap(balance, row)
}

async function submitSwap(balance: number, row: GetUserBalanceResponse & { index: string }) {
  const isSolana = row.chain === 'solana'
  const {botSettings} = botSettingStore
  const selected = botSettings?.[row.chain]?.selected as 's1' | 's2' | 's3'
  const currentBotSetting = botSettings?.[row.chain]?.[selected]
  if (isSolana && currentBotSetting?.mev) {
    if (!await botStore.getBundleAvailable()) {
      loadingSwap.value[row.index] = false
      return
    }
  }
  const {gasTip1List, gasTip2List} = formatBotGasTips(useBotSwapStore().gasTip, 'solana')
  const gasTips = currentBotSetting?.mev ? gasTip1List : gasTip2List
  const settings = currentBotSetting?.mev ? currentBotSetting?.gas[0] : currentBotSetting?.gas?.[1]
  let data: any = {}
  if (isSolana) {
    let priorityFee = settings?.customFee || gasTips?.[settings?.level as number] || '0.002'
    if (currentBotSetting?.mev && new BigNumber(priorityFee).lt('0.002')) {
      priorityFee = '0.002'
    }
    data.priorityFee = new BigNumber(priorityFee).times(10 ** 9).toFixed(0)
  } else {
    const gasPrice = Number(settings?.customFee) === 0 ? '0' : (settings?.customFee || gasTips?.[settings?.level as number] || '3')
    data.gasTip = Number(new BigNumber(gasPrice).times(10 ** 9).toFixed(0))
    data.contractType = 0
    data.chain = row.chain
  }
  const chainMainToken = {
    solana: 'sol',
    ton: 'TON',
  } as {
    [key: string]: string
  }
  const native = chainMainToken[row.chain] || NATIVE_TOKEN
  const slippage = currentBotSetting?.slippage || '9'
  const creatorAddress = botStore.getWalletAddress(row.chain)
  if (!creatorAddress) {
    return
  }
  data = {
    ...data,
    batchId: Date.now().toString(),
    swapList: [{
      creatorAddress,
      inAmount: new BigNumber(balance || 0)
        .times(10 ** row.decimals || 0).toFixed(0)
    }],
    inTokenAddress: row.token,
    outTokenAddress: native,
    swapType: 2,
    isPrivate: currentBotSetting?.mev || false,
    slippage: slippage !== 'auto'
      ? Number(new BigNumber(slippage || '9').times(100).toFixed(0)) : 900
  }
  const tx = isSolana ? bot_createSolTx(data) : bot_createSwapEvmTx(data)
  tx.then(res => handleTxSuccess(res, data.batchId, row.index))
    .catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value[row.index] = false
    })
}

function handleTxSuccess(res: any, _batchId: string, tokenId: string) {
  if (res) {
    let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
      ElNotification({type: 'success', message: t('transactionsSubmitted')})
      tokenStore.placeOrderUpdate++
      loadingSwap.value[tokenId] = false
    }, 500)
    const unwatch = watch(() => wsStore.wsResult.tgbot, (subscribeResult) => {
      const batchId = subscribeResult.batchId
      if (batchId === _batchId) {
        if (Timer) {
          clearTimeout(Timer)
          Timer = null
        }
        tokenStore.placeOrderSuccess++
        if (subscribeResult?.txList?.[0]?.success) {
          ElNotification({type: 'success', message: t('tradeSuccess')})
          unwatch()
        } else {
          handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
          unwatch()
        }
        loadingSwap.value[tokenId] = false
      }
    })
  }
}
</script>

<template>
  <div v-loading="listStatus.loading && listStatus.pageNo===1">
    <div class="flex justify-between items-center mt-10px pr-15px">
      <el-checkbox
        v-model="tableFilter['hide_risk']"
        class="ml-12px"
        :style="{
          marginRight:0
        }"
        size="small" :true-value="1" :false-value="0"
      >
        {{ $t('hideRiskTokenShort') }}
      </el-checkbox>
      <el-checkbox
        v-model="tableFilter['hide_small']"
        size="small" :true-value="1" :false-value="0"
      >
        {{ $t('hideSmallAssets1') + '<1USD' }}
      </el-checkbox>
      <NetSelect
        v-if="botStore.evmAddress"
        v-model:userIds="tableFilter.user_ids"
        @update:user-ids="resetStatus();_getUserBalance()"
      />
    </div>
    <t-head
      v-model:sort="sort"
      :columns="columns"
    />
    <el-scrollbar
      :height="scrollbarHeight"
    >
      <div
        ref="scrollContainerRef"
        v-infinite-scroll="_getUserBalance"
        :infinite-scroll-disabled="listStatus.finished|| listStatus.loading"
        infinite-scroll-distance="200"
        :infinite-scroll-delay="10"
        :infinite-scroll-immediate="false"
      >
        <div class="pr-10px pb-20px">
          <NuxtLink
            v-for="(row,$index) in listData" :key="$index"
            class="text-12px flex justify-between pl-10px py-10px cursor-pointer hover:bg-[var(--d-1A1A1A-l-F2F2F2)]"
            :to="`/token/${row.index}`"
          >
            <div class="flex-[1.5] flex items-center">
              <TokenImg
                :row="row"
              />
              <div class="ml-6px">
                <div class="flex">
                  <span class="color-[var(--d-F5F5F5-l-333)]">{{ row.symbol }}</span>
                  <Icon
                    v-if="row.risk_score > 55 || row.risk_level < 0"
                    name="custom:danger"
                    class="font-14 ml-2px color-#F72121"/>
                </div>
                <div class="mt-2px color-[var(--d-999-l-666)]">
                  <template v-if="row.balance === 0">$0</template>
                  <template v-else-if="row.balance === '--'">--</template>
                  <template v-else>
                    {{ formatNumber(row.balance, 2) }}({{
                      '$' + formatNumber(row.balance_usd ||
                        0, 2)
                    }})
                  </template>
                </div>
              </div>
            </div>
            <div class="flex-1 flex flex-col items-end">
              <div :class="getColorClass(row.total_profit)">
                <template v-if="Number(row.total_profit) === 0">0</template>
                <template v-else-if="row.total_profit === '--'">--</template>
                <template v-else>
                  {{ Number(row.total_profit) > 0 ? '$' : '-$' }}{{
                    formatNumber(Math.abs(Number(row.total_profit)), 2)
                  }}
                </template>
              </div>
              <div :class="getColorClass(row.total_profit_ratio)">
                <template v-if="Number(row.total_profit_ratio) === 0">0</template>
                <template v-else-if="row.total_profit_ratio === '--'">--</template>
                <template v-else>
                  {{
                    Number(row.total_profit_ratio) > 0 ? '+' : '-'
                  }}{{ formatNumber(Math.abs(Number(row.total_profit_ratio) * 100), 2) }}%
                </template>
              </div>
            </div>
            <div class="flex-1 flex justify-end">
              <el-button
                v-if="botStore.evmAddress && row.token!=='0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'"
                size="small"
                :loading="loadingSwap[row.index]"
                class="[--el-border:0] [&&]:[--el-button-bg-color:--d-222-l-F2F2F2] [&&]:font-normal"
                style="padding:4px"
                @click.stop.prevent="handleSellAmount(row)"
              >
                {{ $t('closePosition') }}
              </el-button>
              <span v-else class="color-[var(--d-EAECEF-l-333)]">--</span>
            </div>
          </NuxtLink>
          <AveEmpty
            v-if="listData.length===0&&!listStatus.loading"
          />
        </div>
        <div
          v-if="listStatus.loading&&listStatus.pageNo!==1"
          class="color-#959a9f text-12px text-center"
        >
          {{ $t('loading') }}
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>

</style>
