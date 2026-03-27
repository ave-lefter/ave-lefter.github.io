<script setup lang="ts">
import THead from './tHead.vue'
import {getUserBalance, type GetUserBalanceResponse } from '~/api/swap'
import type {IAssetResponse, IPriceV2Response} from '~/api/types/ws'
import {bot_createSolTx, bot_createSwapEvmTx, bot_createSwapTonTx, bot_getTokenBalance,getBalances} from '~/api/bot'
import {ElNotification} from 'element-plus'
import {formatBotGasTips, hasCreateTxError, getCreateTxErrorMsg, handleBotError} from '~/utils/bot'
import BigNumber from 'bignumber.js'
import {useDebounceFn, useLocalStorage, useThrottleFn} from '@vueuse/core'
import {useWalletStore} from '~/stores/wallet'
import type { BotChain, BotSettingKey } from '~/utils/types'
import { recordTxV2, updateTxV2 } from '~/api/tracking'
import dayjs from 'dayjs'
import BlackList from  '~/components/header/positions/blackList.vue'
import HideTokenDialog from '~/pages/address/[[userAddress]]/components/hideTokenDialog.vue'
import { getTokensPrice } from '@/api/token'
const {updateHolderNum}= storeToRefs(useUserStore())
const {t} = useI18n()
const wsStore = useWSStore()
const botSettingStore = useBotSettingStore()
const botStore = useBotStore()
const botSwapStore = useBotSwap()
const priceV2Store = usePriceV2Store()
const walletStore = useWalletStore()
const tokenStore = useTokenStore()
const {hide_risk, hide_small} = storeToRefs(useGlobalStore())
const {currentAddress} = storeToRefs(useFollowStore())
const selectedChains = useLocalStorage<string[]>('positionsSelectedChains', [])
const AmountU = useLocalStorage<boolean>('positionsAmountU', true)
const { mode, token_logo_url, isDark } = storeToRefs(useGlobalStore())

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

watch(()=>updateHolderNum.value, () => {
  resetStatus()
  getDataOnResize()
})
// onMounted(()=>{
//   setTimeout(()=>{
//     wsStore.wsResult[WSEventType.ASSET] = {
//     'client_address': '0xb42db0711f6c04d5c55951ef2b075fbe3ec7c4d0',
//     'event': 'asset',
//     'swap': {
//         'type': '0',
//         'chain': 'bsc',
//         'token': '0x55d398326f99059ff775485246999027b3197955',
//         'token_name': 'USDT',
//         'logo_url': 'token_icon/bsc/0x55d398326f99059ff775485246999027b3197955_1743508127.png',
//         'time': 1752885447,
//         'rule_id': 2,
//         'amount': '0.72224',
//         'amm': 'cakev2',
//         'eth_price': '-0.001',
//         'price': '1'
//     }
// }
//   },10000)


//   setTimeout(()=>{
//     wsStore.wsResult[WSEventType.ASSET] = {
//     'client_address': '0xb42db0711f6c04d5c55951ef2b075fbe3ec7c4d0',
//     'event': 'asset',
//     'swap': {
//         'type': '0',
//         'chain': 'bsc',
//         'token': '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
//         'token_name': 'WBNB',
//         'logo_url': 'token_icon/bsc/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
//         'time': 1752885963,
//         'rule_id': 2,
//         'amount': '0.0019823',
//         'amm': 'cakev2',
//         'eth_price': '-0.002',
//         'price': '728.58285'
//     }
// }
//   },20000)
// })

const getTokenBalance = useThrottleFn(function (token: string, chain: string) {
  const creatorAddress = botStore.getWalletAddress(chain)
  if (creatorAddress) {
    getBalances({
      chain,
      creatorAddress,
      tokens: [token],
      showZero: false
    }).then(res => {
      const index = listData.value.findIndex(i => i.token === token && i.chain === chain)
      if(!res?.tokens||!res?.tokens?.length){
        if(index>-1){
          console.log('index',index,token,chain)
          listData.value.splice(index, 1);
        }
      }else if(res.chain === chain && res.creatorAddress === creatorAddress){
        const tokens = res.tokens.filter(i => i.token === token)
        const newToken=tokens?.[0]||{}
        if (tokens.length > 0) {
          if(index>-1){
            listData.value[index].balance = new BigNumber(newToken?.balance || 0).toNumber()
            listData.value[index].balance_usd = new BigNumber(newToken?.balance || 0)
              .times(newToken?.price || 0).toNumber()
            listData.value[index].current_price_usd = Number(newToken?.price||0)
            listData.value[index].total_profit = Number(newToken?.pnl?.totalProfit||0)?.toFixed(6)||'--'
            listData.value[index].total_profit_ratio =Number(newToken?.pnl?.totalProfitRatio||0)?.toFixed(6)||'--'
            listData.value[index].last_txn_time=newToken?.pnl?.lastUpdateTime?new Date(newToken?.pnl?.lastUpdateTime+'').getTime().toString().slice(0, -3):new Date().getTime().toString().slice(0, -3)
            nextTick(() => {
              triggerRef(listData)
            })
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
              balance: new BigNumber(newToken?.balance || 0).toNumber(),
              balance_usd: new BigNumber(newToken?.balance || 0)
                .times(newToken?.price || 0).toNumber(),
              total_profit:  Number(newToken?.pnl?.totalProfit||0)?.toFixed(6)||'--',
              total_profit_ratio:Number(newToken?.pnl?.totalProfitRatio||0)?.toFixed(6)||'--',
              average_purchase_price_usd: new BigNumber(newToken?.pnl?.averageNetPurchasePrice||0).toString(),
              current_price_usd: Number(newToken?.price||0),
              price_change: 0,
              decimals: Number(newToken?.decimals||0),
              risk_level: Number(newToken?.risk_level||0),
              risk_score: Number(newToken?.risk_score||0),
              last_txn_time:newToken?.pnl?.lastUpdateTime?new Date(newToken?.pnl?.lastUpdateTime+'').getTime().toString().slice(0, -3):new Date().getTime().toString().slice(0, -3)
            }

            console.log('newToken',data,newToken)
            listData.value.unshift(data)
            nextTick(() => {
              triggerRef(listData)
            })
          }
        }
        console.log('listData.value',listData.value)
      }
      // listData.value = listData.value.map(item => {
      //   if (item.token === token && item.chain === chain) {
      //     return {
      //       ...item,
      //       balance: tokens[0].balance,
      //       balance_usd: new BigNumber(tokens[0].balance || 0)
      //         .times(item.current_price_usd || 0).toNumber()
      //     }
      //   }
      //   return {...item}
      // })
    })
  }
}, 0, false, true)

watch(() => wsStore.wsResult[WSEventType.ASSET], (val: IAssetResponse) => {
  // getTokenBalance('','bsc')
  // 处理 token 交易
  if (val.swap) {
    const token = ((val.swap.token === 'So11111111111111111111111111111111111111112')
      || (val.swap.token === NATIVE_TOKEN))
      ? NATIVE_TOKEN : val.swap.token
    const chain = val.swap.chain
    if (token && chain) {
      setTimeout(()=>{
        resetStatus()
        getDataOnResize()
      },5000)
    }
    //   处理转账
  } else if (val.transfer) {
    console.log('val.transfer',val)
    const chain = val.transfer.chain
    const token = val.transfer.token
    const type = val.transfer.type
    if( ["bsc", "eth", "base", "xlayer", "solana","polygon", "arbitrum", "optimism", "monad"].includes(chain)){
      getTokenBalance(token,chain)
    }else{
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
          if(!isBuy){
            console.log('indexObj.balance',newBalance.toString())
            if(Number(indexObj.balance)<=0){
              listData.value.splice(index, 1);
            }
          }
          triggerRef(listData)
        } else {
          setTimeout(()=>{
            resetStatus()
            getDataOnResize()
          },5000)
        }
      }
    }
  }
})



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

const isEvmChainWallet = computed(() => {
  return getChainInfo(walletStore.chain)?.vm_type === 'evm'
})
const userIds = computed(() => {
  if(!selectedChains.value.length){
    console.log('selectedChains.value.length',botStore.evmAddress)
    selectedChains.value = botStore.evmAddress ? ['bsc', 'solana'] : ['bsc', 'base', 'eth']
  }
  // const selectedChains = botStore.evmAddress ? ['bsc', 'solana'] : ['bsc', 'base', 'eth']
  if (botStore.userInfo) {
    return botStore.userInfo.addresses.filter(({chain})=> selectedChains.value.includes(chain)).map(({address, chain}) => address + '-' + chain)
  } else {
    if (walletStore.address && isEvmChainWallet.value && (walletStore.walletName!=='WatchWallet')) {
      return selectedChains.value.map(i => walletStore.address + '-' + i)
    }
    else {
      return [walletStore.address + '-' + walletStore.chain]
    }
  }
})

watch(() => userIds.value, (old,val) => {
  if(JSON.stringify(old) === JSON.stringify(val)) return
  tableFilter.value.user_ids = userIds.value
})

const tableFilter = ref({
  hide_risk,
  hide_small,
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
    // getMainTokenPrice()
  }
}, 200)
watch(scrollbarHeight, getDataOnResize)
const sort = shallowRef({
  sortBy: undefined,
  activeSort: 0
})
const map: { [key: number]: string } = {
  '-1': 'asc',
  0:'',
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
    label: ``,
    value: 'last_txn_time',
    flex: 'flex-[1.3]',
    sort: true
  }, {
    label: '',
    value: 'balance_usd',
    flex: 'flex-1 justify-end',
    sort: true
  }, {
    label: '',
    value: '',
    flex: 'flex-[0.8] justify-end',
    sort: false
  }]
})
const listStatus = shallowRef({
  finished: false,
  loading: false,
  pageNo: 1,
  pageSize: 50
})
const listData = shallowRef<(GetUserBalanceResponse & { index: string })[]>([])

const filterListData = computed(() => {
  const sort=backendSort.value.sort||'last_txn_time'
  const sort_dir=backendSort.value.sort_dir||'desc'
  // console.log('filterListData',sort,sort_dir,listData.value)
  return [...listData.value.filter(i => i.token===NATIVE_TOKEN).toSorted((a, b) => a.symbol.localeCompare(b.symbol)),...listData.value.filter(i => i.token!==NATIVE_TOKEN).toSorted((a, b) => sort_dir ==='asc' ? a?.[sort] - b?.[sort] : b?.[sort] - a?.[sort])]
})

let timer: ReturnType<typeof setTimeout> | null = null;

const checkCondition = () => {
  if (botStore.userInfo || walletStore.address) {
    // 1. 清除可能存在的定时器（防止重复）
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    _getUserBalance()
    // getMainTokenPrice()
    return // 结束本次执行，不再设置定时器
  }
  // 只有在不满足条件时，才设置下一次定时器
  timer = setTimeout(checkCondition, 1000)
}



onMounted(() => {
 checkCondition()
})
onUnmounted(() => {
  if(timer){
    timer = null
    clearTimeout(timer)
  }
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
  // getMainTokenPrice()
})

const mainTokenPrices = ref({} as any)

function getMainTokenPrice() {
  const ids=selectedChains.value.map(i=>'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'+'-'+i)
  getTokensPrice(ids).then(res => {
    console.log('getTokensPrice',res)
    if(res&&!res.length) return
    selectedChains.value.forEach((chain,index) => {
      mainTokenPrices.value[chain]=res[index].current_price_usd
    })
    console.log('mainTokenPrices.value',mainTokenPrices.value)
  })
}

async function _getUserBalance() {
  try {
    console.log('_getUserBalance',backendSort.value)
    listStatus.value.loading = true
    const pageNo = listStatus.value.pageNo
    const res = await getUserBalance({
      pageNO: listStatus.value.pageNo,
      pageSize: listStatus.value.pageSize,
      ...tableFilter.value,
      sort_dir: (backendSort.value.sort_dir&&backendSort.value.sort)?backendSort.value.sort_dir:'desc',
      sort: (backendSort.value.sort_dir&&backendSort.value.sort)?backendSort.value.sort:'last_txn_time',
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
          .filter(i => listData.value.every(j => j.index !== (i.token === NATIVE_TOKEN
              ? getChainInfo(i.chain)?.wmain_wrapper + '-' + i.chain
              : `${i.token}-${i.chain}`)))
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
    // const chainMainToken = {
    //   solana: 'sol',
    //   ton: 'TON',
    // } as {
    //   [key: string]: string
    // }
    // const native = chainMainToken[row.chain] || NATIVE_TOKEN
    // await botSwapStore.checkApproveAndApprove({
    //   chain: row.chain,
    //   inToken: row.token,
    //   outToken: native,
    //   owner: walletAddress
    // })
    beforeSubmitSwap(balance, row)
  } finally {
    loadingSwap.value[row.index] = false
  }
}

function beforeSubmitSwap(balance: number | string, row: GetUserBalanceResponse & { index: string }) {
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
  const selected = botSettings?.[row.chain as BotChain]?.sell?.selected
  const currentBotSetting = botSettings?.[row.chain as BotChain]?.sell?.[selected as BotSettingKey]
  // if (isSolana && currentBotSetting?.mev) {
  //   if (!await botStore.getBundleAvailable()) {
  //     loadingSwap.value[row.index] = false
  //     return
  //   }
  // }
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
    const gasPrice = settings?.customFee == '0' ? '0' : (settings?.customFee || gasTips?.[settings?.level as number] || '3')
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
  const batchId = Date.now().toString()
  data = {
    ...data,
    swapList: [{
      batchId,
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
  let tx = bot_createSwapEvmTx
  if (isSolana) {
    tx = bot_createSolTx as any
  } else if (row.chain === 'ton') {
    tx = bot_createSwapTonTx
  }
  tx(data).then(res => handleTxSuccess(res, batchId, row.index, row))
    .catch(err => {
      handleBotError(err || 'swap error')
      loadingSwap.value[row.index] = false
    })
}

function handleTxSuccess(res: any, _batchId: string, tokenId: string, row: GetUserBalanceResponse) {
  if (res) {
    const chain = row?.chain || ''
    const txInfo: any = res?.[0] || {}
    if (hasCreateTxError(txInfo)) {
      handleBotError(getCreateTxErrorMsg(txInfo))
      loadingSwap.value[tokenId] = false
      return
    }
    let Timer: null | ReturnType<typeof setTimeout> = setTimeout(() => {
      // ElNotification({type: 'success', message: t('transactionsSubmitted')})
      tokenStore.placeOrderUpdate++
      loadingSwap.value[tokenId] = false
    }, 500)

    const recordTxUrlObj = {
      solana: '/botapi/swap/createSolTx',
      ton: '/botapi/swap/createSwapTonTx',
    }

    recordTxV2({
      txInfo,
      chain: chain,
      destination: recordTxUrlObj?.[chain as 'solana' | 'ton'] || '/botapi/swap/createSwapEvmTx' ,
      type: 10
    })

    const batchIdObj = {
      [txInfo?.batchId]: txInfo?.id
    }
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
          const txInfo = subscribeResult?.txList?.[0]
          updateTxV2({...txInfo, chain: subscribeResult?.chain}, batchIdObj?.[batchId] || '')
        } else {
          handleBotError(subscribeResult?.txList?.[0]?.failMessage || 'swap error')
        }
        unwatch()
        loadingSwap.value[tokenId] = false
      }
    })
  }
}
const self_address = computed(() => {
  if (currentHideToken.value?.chain !== 'solana') {
    return botStore.evmAddress || walletStore.address
  } else {
    return botStore.getWalletAddress('solana') || walletStore.address
  }
})
const hideTokenVisible = ref(false)
const currentHideToken = ref({} as any)
function hideToken(row:any) {
  hideTokenVisible.value = true
  currentHideToken.value = row
}
</script>

<template>
  <div>
    <HideTokenDialog
      v-model="hideTokenVisible"
      :row="currentHideToken"
      :self_address="self_address"
      @hideToken="()=>{}"
    />
    <NetSelect
      v-if="botStore.evmAddress||(walletStore.address && isEvmChainWallet && (walletStore.walletName!=='WatchWallet'))"
      class="absolute top--34px"
      :style="{left:(Number(getTextWidth(t('position2')).toFixed(0))+12+16)+'px'}"
      v-model:userIds="tableFilter.user_ids"
      @update:user-ids="resetStatus();_getUserBalance();"
    />
    <BlackList
      class="absolute top--30px right-40px"
      v-tooltip="t('BlackList')"
      :userIds="tableFilter.user_ids"
      @addWhite="()=>{}"
    />
    <div v-loading="listStatus.loading && listStatus.pageNo===1">
      <div class="flex items-center mt-10px pr-15px gap-[12px]">
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
      </div>
      <t-head
        v-model:sort="sort"
        :columns="columns"
        class="pr-20px!"
      >
        <template #last_txn_time>
           <div>
            <span>{{ t('token') }}</span>
            <span>/</span>
            <span :class="(sort.sortBy === 'last_txn_time') && sort.activeSort ? 'color-[--main-text]' : ''">{{ t('lastTx') }}</span>
           </div>
        </template>
        <template #balance_usd>
          <div class="flex flex-center gap-4px">
            <Icon :name="`custom:${!AmountU ? 'amount2' : 'price2'}`"  :class="`color-[--third-text] cursor-pointer text-10px`"
                @click.self.stop="AmountU = !AmountU" />
            <div>
              <span :class="(sort.sortBy === 'balance_usd')&& sort.activeSort ? 'color-[--main-text]' : ''">{{ t('bal') }}</span>
              <span>/</span>
              <span>{{ t('profit2') }}</span>
            </div>
          </div>
        </template>
      </t-head>
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
          <div class="pb-20px pr-20px">
            <NuxtLink
              v-for="(row,$index) in filterListData" :key="$index"
              class="text-12px flex justify-between pl-10px py-7px cursor-pointer hover:bg-[--dialog-bg] group"
              :to="`/token/${row.index}`"
            >
              <div class="flex-[1.3] flex items-center relative min-w-0">
                <el-tooltip popper-class="tooltip-pd-0" placement="bottom-start" :show-arrow="false" :persistent="false">
                  <template #default>
                    <TokenImg :row="row"/>
                  </template>
                  <template #content>
                    <TokenImg :row="row" chain-class="hidden" token-class="w-240px h-240px [&&]:mr-0 rounded-16px" />
                  </template>
                </el-tooltip>
                <div class="ml-6px w-[calc(100%-30px)]">
                  <!-- {{ $index }} -->
                  <div class="flex flex-row items-end">
                    <span class="color-[var(--main-text1)] font-400 text-13px lh-16px ellipsis" :style="{maxWidth:(row.risk_score > 55 || row.risk_level < 0)?'calc(100% - 14.6px)':'100%'}">{{ row.symbol }}</span>
                    <Icon
                      v-if="row.risk_score > 55 || row.risk_level < 0"
                      name="custom:danger"
                      class="font-14 ml-2px color-#F72121"/>
                  </div>
                  <div v-if="row.token!==NATIVE_TOKEN" class="mt-2px color-[--third-text1] text-11px lh-14px">
                    <!-- <template v-if="row.balance === 0">$0</template>
                    <template v-else-if="row.balance === '--'">--</template>
                    <template v-else>
                      {{ formatNumber(row.balance, 2) }}({{
                        '$' + formatNumber(row.balance_usd ||
                          0, 2)
                      }})
                    </template> -->
                    <template v-if="!(row?.last_txn_time)||('--'===row?.last_txn_time)"><span>--</span></template>
                    <TimerCount
                      v-else-if="(row.last_txn_time) && Number(formatTimeFromNow(row.last_txn_time, true)) < 60"
                      :key="`${row.index}`"
                      :timestamp="Math.min(+(row.last_txn_time), dayjs().unix() - 1)" :end-time="60">
                      <template #default="{ seconds }">
                          <span class="color-#FFA622 text-11px">
                              <template v-if="seconds < 60"> {{ seconds }}s </template>
                              <template v-else>
                                  {{ formatTimeFromNow(row.last_txn_time) }}
                              </template>
                          </span>
                      </template>
                    </TimerCount>
                    <span v-else class="text-11px">
                        {{ formatTimeFromNow(row.last_txn_time) }}
                    </span>
                  </div>
                </div>
                <div v-if="(walletStore.walletName!=='WatchWallet')&&(row.token!==NATIVE_TOKEN)" class="bg-[--d-000-l-FFF] absolute top-0 left-0 z-auto flex flex-center w-12px h-12px invisible group-hover:visible">
                  <Icon 
                    v-tooltip="$t('BlackListToken')"
                    name="custom:key-invisible"
                    class="cursor-pointer color-[--third-text1] text-8px hover:color-[--down-color]!"
                    @click.self.stop.prevent="hideToken(row)"
                  />
                </div>
              </div>
              <div class="flex-1 flex flex-col items-end" :class="row.token===NATIVE_TOKEN&&'flex-row! items-center! justify-end'">
                <div class="text-[--main-text1] font-400 text-13px lh-16px flex items-center gap-2px">
                  <template v-if="row.balance === 0">$0</template>
                  <template v-else-if="row.balance === '--'">--</template>
                  <template v-else>
                    <img v-if="!AmountU&&(row?.token===NATIVE_TOKEN)" :src="`${token_logo_url}chain/${row?.chain}.png`" class="border-rd-[50%] text-12px lh-12px" height="12" alt=""></img>
                    <!-- {{!AmountU? (formatNumber(Number(row?.balance_usd || 0) / Number(mainTokenPrices[row?.chain] || 1), 2)): '$' + formatNumber(row.balance_usd ||0, 2)}} -->
                    {{!AmountU? formatNumber(row.balance, 2): '$' + formatNumber(row.balance_usd ||0, 2)}}
                  </template>
                </div>
                <div v-if="row.token!==NATIVE_TOKEN" class="mt-2px text-11px lh-14px"  :class="getColorClass(row.total_profit)">
                  <template v-if="Number(row.total_profit) === 0">0</template>
                  <template v-else-if="row.total_profit === '--'">--</template>
                  <template v-else>
                    {{ Number(row.total_profit) > 0 ? '+$' : '-$' }}{{
                      formatNumber(Math.abs(Number(row.total_profit)), 2)
                    }}
                  </template>
                </div>
             
              </div>
              <div class="flex-[0.8] flex justify-end">
                <el-button
                  v-if="botStore.evmAddress && row.token!=='0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'"
                  size="small"
                  :loading="loadingSwap[row.index]"
                  class="[--el-border:0] [&&]:[--el-button-bg-color:--d-222-l-F2F2F2] [&&]:font-normal"
                  style="padding:4px"
                  @click.stop.prevent="handleSellAmount(row)"
                >
                  {{ $t('sellAl') }}
                </el-button>
                <span v-else class="color-[var(--d-EAECEF-l-333)]">--</span>
              </div>
            </NuxtLink>
            <AveEmpty v-if="listData.length===0&&!listStatus.loading"
              class="m-[0_auto] pl-30px"
              :style="{paddingTop:Math.max((scrollbarHeight-90)/2,0)+'px'}"
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
  </div>
</template>

<style scoped>

</style>
