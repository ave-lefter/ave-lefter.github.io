<template>
  <div ref="myPosition">
    <div class="flex items-center px-12px mb-12px">
      <div class="flex items-center whitespace-nowrap overflow-x-auto scrollbar-hide bg-[--main-input-button-bg] p-2px rd-4px gap-4px mr-auto">
        <button
          v-for="item in (smartChains as Array<{ chain: BotChain }>)" :key="item.chain"
          :class="`shrink-0 text-12px lh-16px text-center px-4px py-4px rd-4px flex items-center border-none clickable color-[--main-text1] ${activeChain === item.chain ? 'bg-[--tab-active-bg]' : 'bg-transparent op-50'}`" @click.stop="activeChain = item.chain">
          <img class="w-16px h-16px rd-50% mr-4px" :src="`${configStore?.token_logo_url}chain/${item.chain}.png`" alt="" srcset="">
          <span>{{ getChainInfo(item.chain).name }}</span>
        </button>
      </div>
      <!-- <div class="flex items-center ml-auto">
        <el-checkbox v-model="onlyCurrentToken" :label="$t('currentToken')" size="small" style="font-size: 12px;color:var(--d-666-l-333)" />
      </div> -->
      <el-popover
        placement="bottom-end"
        width="auto"
        trigger="click"
        persistent
        popper-style="min-width: 100px"
      >
        <template #reference>
          <div class="bg-[--main-list-hover] flex items-center justify-center h-24px w-24px ml-5px rd-4px cursor-pointer">
            <Icon
              name="custom:filter"
              class="text-10px clickable hover:color-[--main-text1]"
              :class="isFilter ? 'color-[--main-text1]' : 'color-[--third-text]'"
            />
          </div>
        </template>
        <template #default>
          <div class="flex flex-col">
            <el-checkbox
              v-model="conditions_wallet.hide_risk"
              class="[&&]:mr-0"
              size="small" :true-value="1" :false-value="0"
            >
              {{ $t('hideRiskTokenShort') }}
            </el-checkbox>
            <el-checkbox
              v-model="conditions_wallet.hide_noswap"
              :false-value="0"
              :true-value="1"
              size="small"
              class="[&&]:mr-0"
            >
              {{ $t('hideNoSwap') }}
            </el-checkbox>
            <el-checkbox
              v-model="conditions_wallet.hide_sold"
              size="small"
              class="[&&]:mr-0"
              :false-value="0"
              :true-value="1"
            >
              {{ $t('hide_sell') }}
            </el-checkbox>
            <el-checkbox
              v-model="conditions_wallet.hide_small"
              size="small"
              :false-value="0"
              :true-value="1"
            >
              {{ $t('hideSmallAssets1') + '<1USD' }}
            </el-checkbox>
          </div>
        </template>
      </el-popover>
      <SelectWallet v-if="botStore.evmAddress" ref="selectWallet" contentClass="ml-8px!" :chain="(activeChain as BotChain)" :boundary="boundary" />
      <el-input
        v-if="botStore.evmAddress"
        v-model.trim="quickSellValue"
        size="small"
        class="ml-8px"
        style="
            --el-input-text-color: var(--main-text1);
            border-radius: 4px;
            width: 100px;
          "
        placeholder="0"
        type="text"
        @input="(value) => {
          const cleaned = value.replace(/\-|[^\d.]/g, '')
          const num = parseFloat(cleaned)
          if (num > 100) {
            quickSellValue = '100'
          } else {
            quickSellValue = cleaned
          }
        }"
        @blur="handleBlurSellValue"
        @keydown.enter="e => e?.target?.blur()"
        >
        <template #prefix>
          <Icon name="mynaui:lightning-solid" class="color-[--down-color]" />
          <span class="color-[--down-color]">{{ t('sell') }}</span>
        </template>
        <template #suffix>
          <span>%</span>
        </template>
      </el-input>
      <Setting v-if="botStore.evmAddress" :chain="activeChain" swapType="sell" class="ml-8px" />
      <SlippageSetMarket v-if="botStore.evmAddress" class="mx-5px" :chain="activeChain" />
      <BlackList
        class="bg-[--main-list-hover] flex items-center justify-center h-24px w-24px ml-5px rd-4px cursor-pointer"
        iconClass="text-12px text-[--third-text]"
        v-tooltip="t('BlackList')"
        :userIds="userIds"
        @addWhite="()=>{}"
      />
    </div>
    <TopPnl :chain="activeChain" :userAddress="address || ''" />
    <TokenList
      :conditions="conditions_wallet"
      :handleSortChange="handleSortChange"
      :loading="tableData.loading"
      :tableData="tableData.token || []"
      :address="address"
      :swapValue="quickSellValue"
      :swapSetSelected="botSettingStore.botSettings?.[activeChain]?.sell?.selected || ''"
      :creatorAddress="_evmAddress || ''"
      @hideToken="refreshTokenList"
    />
  </div>
</template>

<script setup lang='ts'>
import { useLocalStorage, useThrottleFn, useEventBus } from '@vueuse/core'
import { getWhaleTokenList } from '~/api/wallet'
import TokenList from './tokenList.vue'
import SelectWallet from '@/pages/token/components/belowChartTable/selectWallet.vue'
import Setting from './setting.vue'
import SlippageSetMarket from '~/pages/token/components/right/botSwap/slippageSetMarket.vue'
import TopPnl from '../mySwap/topPnl.vue'
import { getBalances } from '~/api/bot'
import type { IAssetResponse, IPriceV2Response } from '~/api/types/ws'
import BigNumber from 'bignumber.js'
import { BusEventType } from '~/utils/constants'
import type { SwapCompletedEventPayload } from '~/utils/types'
import BlackList from '~/components/header/positions/blackList.vue'
// import { getUserBalance } from '~/api/swap'

const swapCompletedEvent = useEventBus<SwapCompletedEventPayload>(BusEventType.SWAP_COMPLETED)
swapCompletedEvent.on(({ fromToken, toToken, chain }) => {
  console.log('Swap completed:', { fromToken, toToken, chain })
  if (fromToken && chain) {
    getTokenBalance(fromToken, chain)
    setTimeout(() => {
      getTokenBalance(fromToken, chain)
    }, 5000)
  }
  if (toToken && chain) {
    getTokenBalance(toToken, chain)
    setTimeout(() => {
      getTokenBalance(toToken, chain)
    }, 5000)
  }
})


const activeChain = ref<BotChain>('bsc')
const walletStore = useWalletStore()
const botStore = useBotStore()
const tokenStore = useTokenStore()
const configStore = useConfigStore()
const botSettingStore = useBotSettingStore()
const wsStore = useWSStore()
const priceV2Store = usePriceV2Store()
const { t } = useI18n()

const selectWallet = useTemplateRef<typeof SelectWallet>('selectWallet')

const boundary = useTemplateRef('myPosition')
// const onlyCurrentToken = useSessionStorage('token_position_only_current_token', false)
const quickSellValue = useLocalStorage<number|string>('token_quick_sell_value', '100')

const conditions_wallet = useLocalStorage('token_conditions_position', {
  hide_sold: 0,
  hide_small: 1,
  hide_risk: 1,
  hide_noswap: 1,
  sort: 'last_txn_time',
  sort_dir: 'desc',
})

const tableData = ref({
  finished: false,
  error: false,
  loading: false,
  pageNO: 1,
  pageSize: 40,
  total: 0,
  token: [] as Awaited<ReturnType<typeof getWhaleTokenList>>
})

const isFilter = computed(() => {
  return conditions_wallet.value.hide_risk === 1 || conditions_wallet.value.hide_noswap === 1 || conditions_wallet.value.hide_sold === 1 || conditions_wallet.value.hide_small === 1
})

const _evmAddress = computed(() => {
  return selectWallet.value?.evmAddress || botStore.evmAddress
})

const address = computed(() => {
  if (botStore.evmAddress) {
    const evmAddress = selectWallet.value?.evmAddress || botStore.evmAddress
    return botStore.walletList?.find?.(i => i.evmAddress === evmAddress)?.addresses?.find(i => i.chain === activeChain.value)?.address || ''
  } else if (walletStore.address && (walletStore.chain === activeChain.value || (isEvmChain(walletStore.chain) && isEvmChain(activeChain.value)))) {
    return walletStore.address || ''
  }
  return ''
})

const userIds = computed(() => {
  if (address.value) {
    return [address.value + '-' + activeChain.value]
  }
  return []
})


const smartChains = computed(() => {
  if (!botStore?.evmAddress && !walletStore.address) {
    return []
  }
  if (botStore.evmAddress) {
    const botChains = botStore.userInfo?.addresses?.filter?.((el) =>
      SupportFullDataChain.includes(el.chain)
    )
    if (botChains && botChains.length > 0) {
      return botChains
    }
  }

  if (walletStore.address && walletStore.chain) {
    if (isEvmChain(walletStore.chain)) {
      return SupportFullDataChain
        .filter((el) => isEvmChain(el))
        .map((el) => {
          return {
            chain: el,
          }
        }) as Array<{ chain: BotChain }>
    } else if (walletStore.chain === 'solana') {
      return [{ chain: 'solana' }]
    } else if (walletStore.chain === 'ton') {
      return [{ chain: 'ton' }]
    }
  }
  return [
    {
      chain: tokenStore?.token?.chain || '',
    }
  ]
})

const resetPageNOAndLoading = () => {
  tableData.value.pageNO = 1
  tableData.value.finished = false
  tableData.value.error = false
  tableData.value.loading = true
}

const handleSortChange = ({ prop, order }) => {
  resetPageNOAndLoading()
  const sort_dir = order?.replace?.('ending', '')
  conditions_wallet.value.sort = prop
  conditions_wallet.value.sort_dir = sort_dir
  _getTokenList()
}

const refreshTokenList = () => {
  resetPageNOAndLoading()
  _getTokenList()
}

const _getTokenList = async () => {
  if (!botStore?.evmAddress && !walletStore.address) {
    tableData.value.token = []
    tableData.value.loading = false
    return
  }
  tableData.value.loading = true
  const evmAddress = selectWallet.value?.evmAddress
  if (evmAddress) {
    const addresses = botStore.walletList?.find?.(i => i.evmAddress === evmAddress)?.addresses || []
    if (addresses?.every?.(i => i.chain !== activeChain.value)) {
      tableData.value.token = []
      tableData.value.loading = false
      return
    }
  } else if (walletStore.address && walletStore.chain && walletStore.chain !== activeChain.value && !isEvmChain(walletStore.chain)) {
    tableData.value.token = []
    tableData.value.loading = false
    return
  }
  let address = ''
  if (evmAddress) {
    const addresses = botStore.walletList?.find?.(i => i.evmAddress === evmAddress)?.addresses || []
    address = addresses?.find?.(i => i.chain === activeChain.value)?.address || ''
  } else if (walletStore.address) {
    address = walletStore.address || ''
  }
  if (!address) {
    tableData.value.token = []
    tableData.value.loading = false
    return
  }
  const data = {
    user_address: address,
    chain: activeChain.value,
    // user_ids: [address + '-' + activeChain.value],
    pageNO: tableData.value.pageNO,
    pageSize: tableData.value.pageSize,
    sort_dir: (conditions_wallet.value.sort_dir && conditions_wallet.value.sort) ? conditions_wallet.value.sort_dir : 'desc',
    sort: (conditions_wallet.value.sort_dir && conditions_wallet.value.sort) ? conditions_wallet.value.sort : 'last_txn_time',
    is_self: 1 as const,
    ...(conditions_wallet.value.hide_sold === 1 && { hide_sold: 1 }),
    ...(conditions_wallet.value.hide_small === 1 && { hide_small: 1 }),
    ...(conditions_wallet.value.hide_risk === 1 && { hide_risk: 1 }),
    ...(conditions_wallet.value.hide_noswap === 1 && { hide_noswap: 1 }),
  }
  try {
    const res = (await getWhaleTokenList(data))
    if (data.pageNO === 1) {
      tableData.value.token = []
    }
    console.log('getUserBalance', res)
    const list = (Array.isArray(res) ? res : [])?.map?.(item => {
      const item1 = { ...item }
      if (item.token === NATIVE_TOKEN) {
        item1.symbol = getChainInfo(item.chain)?.main_name || item.symbol
      }
      return item1
    })
    if (list?.length > 0) {
      const a = [...tableData.value.token]
      const b = list.filter((i) => a.every((j) => !(j.token === i.token && j.chain === i.chain)))
      tableData.value.token = [...a, ...b]
    }
    tableData.value.finished = list?.length < tableData.value.pageSize
    if (!tableData.value.finished) {
      tableData.value.pageNO++
    }
  } catch {
    tableData.value.token = []
    tableData.value.error = true
  } finally {
    tableData.value.loading = false
  }
}

const getTokenBalance = useThrottleFn(function (token: string, chain: string) {
  let creatorAddress = ''
  if (botStore.evmAddress) {
    const evmAddress = selectWallet.value?.evmAddress || botStore.evmAddress
    creatorAddress = botStore.walletList?.find?.(i => i.evmAddress === evmAddress)?.addresses?.find(i => i.chain === activeChain.value)?.address || ''
  }
  if (!creatorAddress && walletStore.address && walletStore.chain === chain && isEvmChain(walletStore.chain)) {
    creatorAddress = walletStore.address
  }
  if (creatorAddress) {
    getBalances({
      chain,
      creatorAddress,
      tokens: [token],
      showZero: true
    }).then(res => {
      nextTick(() => {
        const index = tableData.value.token.findIndex(i => i.token === token && i.chain === chain)
        if(!res?.tokens||!res?.tokens?.length){
          if(index>-1){
            tableData.value.token.splice(index, 1)
          }
        }else if(res.chain === chain && res.creatorAddress === creatorAddress){
          const tokens = res.tokens.filter(i => i.token === token)
          const newToken=tokens?.[0]||{}
          console.log('newToken',newToken)
          if (tokens.length > 0) {
            const balance_usd = new BigNumber(newToken?.balance || 0).times(newToken?.price || 0)
            if(balance_usd.lt(0.000000001) && (![NATIVE_TOKEN,'sol','TON'].includes(newToken.token))){
              if(index>-1){
                tableData.value.token.splice(index, 1)
              }
              return
            }
            if(balance_usd.lt(1)&&conditions_wallet.value.hide_small === 1){
              return
            }
            if((newToken.risk_score > 55 || newToken.risk_level < 0) && conditions_wallet.value.hide_risk === 1){
              return
            }
            if(index>-1){
              // tableData.value.token[index].balance = new BigNumber(newToken?.balance || 0).toNumber()
              tableData.value.token[index].balance_amount = new BigNumber(newToken?.balance || 0).toFixed()
              tableData.value.token[index].balance_usd = new BigNumber(newToken?.balance || 0).times(newToken?.price || 0).toFixed()
              tableData.value.token[index].current_price_usd = String(newToken?.price || '0')

              tableData.value.token[index].total_profit = Number(newToken?.pnl?.totalProfit||0)?.toFixed(6)||'--'
              tableData.value.token[index].total_profit_ratio =Number(newToken?.pnl?.totalProfitRatio||0)?.toFixed(6)||'--'
              tableData.value.token[index].unrealized_profit = newToken?.pnl?.unrealizedProfit || '0'
              tableData.value.token[index].realized_profit = newToken?.pnl?.realizedProfit || '0'
              tableData.value.token[index].average_net_purchase_price = newToken?.pnl?.averageNetPurchasePrice || '0'
              tableData.value.token[index].net_purchase_amount = newToken?.pnl?.netPurchaseAmount || '0'
              tableData.value.token[index].total_purchase_amount = newToken?.pnl?.netPurchaseAmount || '0'
              tableData.value.token[index].total_purchase_usd = newToken?.pnl?.netPurchaseAmount ? new BigNumber(newToken?.pnl?.netPurchaseAmount || 0).times(newToken?.pnl?.averageNetPurchasePrice || 0).toFixed(2) : '0'
              tableData.value.token[index].total_sold_amount = newToken?.pnl?.sellAmount || '0'
              tableData.value.token[index].total_sold_usd = newToken?.pnl?.sellValue || '0'
              tableData.value.token[index].last_txn_time=newToken?.pnl?.lastUpdateTime?new Date(newToken?.pnl?.lastUpdateTime+'').getTime().toString().slice(0, -3):new Date().getTime().toString().slice(0, -3)
            }else{
              const data={
                index: newToken?.token === NATIVE_TOKEN
              ? getChainInfo(res.chain)?.wmain_wrapper + '-' + res.chain
              : `${newToken?.token}-${res.chain}`,
                address: creatorAddress,
                chain: res?.chain,
                token: newToken?.token,
                symbol: newToken?.symbol,
                logo_url: newToken?.logoUrl,
                balance_amount: new BigNumber(newToken?.balance || 0).toNumber(),
                balance: new BigNumber(newToken?.balance || 0).toNumber(),
                balance_usd: new BigNumber(newToken?.balance || 0)
                  .times(newToken?.price || 0).toNumber(),
                total_profit:  Number(newToken?.pnl?.totalProfit||0)?.toFixed(6)||'--',
                total_profit_ratio:Number(newToken?.pnl?.totalProfitRatio||0)?.toFixed(6)||'--',
                unrealized_profit: newToken?.pnl?.unrealizedProfit || '0',
                realized_profit: newToken?.pnl?.realizedProfit || '0',
                average_net_purchase_price: newToken?.pnl?.averageNetPurchasePrice || '0',
                net_purchase_amount: newToken?.pnl?.netPurchaseAmount || '0',
                average_purchase_price_usd: new BigNumber(newToken?.pnl?.averageNetPurchasePrice||0).toString(),
                current_price_usd: Number(newToken?.price||0),
                price_change: 0,
                decimals: Number(newToken?.decimals||0),
                risk_level: Number(newToken?.risk_level||0),
                risk_score: Number(newToken?.risk_score||0),
                last_txn_time:newToken?.pnl?.lastUpdateTime?new Date(newToken?.pnl?.lastUpdateTime+'').getTime().toString().slice(0, -3):new Date().getTime().toString().slice(0, -3),
                unrealized_profit_ratio: Number(newToken?.pnl?.unrealizedProfitRatio || 0)?.toFixed(6) || '--',
                total_purchase_amount: newToken?.pnl?.netPurchaseAmount || '0',
                total_purchase_usd: newToken?.pnl?.netPurchaseAmount ? new BigNumber(newToken?.pnl?.netPurchaseAmount || 0).times(newToken?.pnl?.averageNetPurchasePrice || 0).toFixed(2) : '0',
                total_sold_amount: newToken?.pnl?.sellAmount || '0',
                total_sold_usd: newToken?.pnl?.sellValue || '0',
              }
              console.log('newToken',data,newToken)
              if (tableData.value.token[0]?.token === NATIVE_TOKEN) {
                // 插入到第二个位置
                tableData.value.token.splice(1, 0, data)
              } else {
                tableData.value.token.unshift(data)
              }
            }
          }
        }
        priceV2Store.setMultiPriceParams('positions', tableData.value.token.map(el => el.token + '-' + el.chain))
        priceV2Store.sendPriceWs()
      })
    })
  }
}, 0, false, true)

watch(() => wsStore.wsResult[WSEventType.PRICEV2], (val: IPriceV2Response) => {
  const idToPriceMap: { [key: string]: IPriceV2Response['prices'][0] } = {}
  val.prices.forEach((item) => {
    idToPriceMap[item.token + '-' + item.chain] = item
  })

  tableData.value.token = tableData.value.token.map(el => {
    const current = idToPriceMap[el.token + '-' + el.chain]
    if (current && current.uprice > 0) {
      const noProfit = el.total_profit === '--' || Number(el.total_profit) === 0
      const price = new BigNumber(current.uprice || 0)
      const balance_usd = new BigNumber(el.balance_amount || 0).times(current.uprice || 0)

      if (!noProfit) {
        const avgNetPurchasePrice = BigNumber(el.average_net_purchase_price || el.average_purchase_price_usd || 0)
        const netPurchaseAmount = Number(el.net_purchase_amount || el.balance_amount || 0)
        const balance_amount = Number((el.balance_amount || 0))
        if (!balance_amount && !netPurchaseAmount) return el
        const actualAmount = BigNumber.max(netPurchaseAmount, balance_amount)
        const unrealized_profit = price.minus(avgNetPurchasePrice).times(actualAmount)

        const realized_profit = BigNumber(el.realized_profit || 0)

        const total_profit = unrealized_profit.plus(Number((realized_profit || 0)))
        const buyVol = BigNumber(netPurchaseAmount || 0).times(price).toFixed()
        let unrealized_profit_ratio = BigNumber(el.unrealized_profit_ratio || 0)
        unrealized_profit_ratio = BigNumber(unrealized_profit).div(buyVol)

        let total_profit_ratio = BigNumber(Number(el.total_profit_ratio) || 0)
        if (buyVol) {
          total_profit_ratio = BigNumber(total_profit).div(buyVol)
        }

        // 边界检查：如果利润率小于 -100% 或均价异常，保持原样或按业务逻辑处理
        if (total_profit_ratio.toNumber() < -1 || avgNetPurchasePrice.lt(0)) {
          return el
        } else {
          return {
            ...el,
            current_price_usd: current.uprice,
            balance_usd: balance_usd.toNumber(),
            // 更新利润值
            total_profit: total_profit.toFixed(6),
            unrealized_profit: unrealized_profit.toFixed(6),
            realized_profit: realized_profit.toFixed(6),
            // 更新利润率：确保字段名与模板/子组件绑定一致
            // 如果子组件使用 total_profit_ratio 显示总利润率，unrealized_profit_ratio 显示未实现利润率
            total_profit_ratio: total_profit_ratio.toFixed(6),
            unrealized_profit_ratio: unrealized_profit_ratio.toFixed(6)
          }
        }
      } else {
        // 无利润数据时，仅更新价格和市值
        return {
          ...el,
          current_price_usd: current.uprice,
          balance_usd: balance_usd.toNumber()
        }
      }
    }
    return el
  })
})

watch(() => wsStore.wsResult[WSEventType.ASSET], (val: IAssetResponse) => {
  // getTokenBalance('','bsc')
  // 处理 token 交易
  if (val.swap) {
    const token = ((val.swap.token === 'So11111111111111111111111111111111111111112')
      || (val.swap.token === NATIVE_TOKEN))
      ? NATIVE_TOKEN : val.swap.token
    const chain = val.swap.chain
    if (token && chain) {
      if(['bsc', 'eth', 'base', 'xlayer', 'solana','polygon', 'arbitrum', 'optimism', 'monad'].includes(chain)){
        getTokenBalance(token,chain)
        setTimeout(()=>{
          getTokenBalance(token,chain)
          setTimeout(() => {
            refreshTokenList()
          }, 1000)
        },3000)
      }
    }
    //   处理转账
  } else if (val.transfer) {
    console.log('val.transfer',val)
    const chain = val.transfer.chain
    const token = val.transfer.token
    if( ['bsc', 'eth', 'base', 'xlayer', 'solana','polygon', 'arbitrum', 'optimism', 'monad'].includes(chain)){
      getTokenBalance(token,chain)
      if(['solana'].includes(chain)){
        setTimeout(()=>{
          getTokenBalance(token,chain)
        },3000)
      }
      setTimeout(() => {
        refreshTokenList()
      }, 4000)
    }
  }
})

const blacklistEvent = useEventBus(BusEventType.TOKEN_BLACKLIST_CHANGE)
blacklistEvent.on(({ token, chain, action }) => {
  console.log('Token blacklist changed:', { token, chain, action })
  if (chain === activeChain.value) {
    refreshTokenList()
  }
})

function init() {
  const evmAddress = selectWallet.value?.evmAddress
  if (evmAddress) {
    const addresses = botStore.walletList?.find?.(i => i.evmAddress === evmAddress)?.addresses || []
    activeChain.value = addresses?.find(i => tokenStore?.token?.chain === i.chain && SupportFullDataChain.includes(i.chain))?.chain || addresses[0]?.chain || 'bsc'
  } else if (walletStore.address && walletStore.chain) {
    activeChain.value = walletStore.chain
  }
  refreshTokenList()
}

watch(
  () => [selectWallet.value?.evmAddress, walletStore.address, walletStore.chain, tokenStore.token?.chain, activeChain.value, conditions_wallet.value.hide_risk, conditions_wallet.value.hide_noswap, conditions_wallet.value.hide_sold, conditions_wallet.value.hide_small, () => tokenStore.placeOrderSuccess],
  () => {
    refreshTokenList()
  }
)


function handleBlurSellValue() {
  const decimals = 4
  let v1 = new BigNumber(quickSellValue.value || 0)
    .toFixed()
    .match(new RegExp(`[0-9]*(\\.[0-9]{0,${decimals || 18}})?`))?.[0]

  if (v1 && Number(v1) > 100) {
    v1 = '100'
  }

  if (String(quickSellValue.value) !== String(v1)) {
    if (quickSellValue.value === '') {
      quickSellValue.value = ''
    } else if (Number(v1) === 0) {
      quickSellValue.value = '0'
    } else {
      quickSellValue.value = v1 || '0'
    }
  }
}

onBeforeMount(() => {
  init()
})

</script>

<style>

</style>
