<script setup lang="ts">
import { useElementSize, useStorage } from '@vueuse/core'
import BigNumber from 'bignumber.js'
import type { ElScrollbar } from 'element-plus'
import { getUserBalance, type GetUserBalanceResponse } from '~/api/swap'
import type { IAssetResponse, IPriceV2Response } from '~/api/types/ws'

const route = useRoute()
const wsStore = useWSStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()
const walletStore = useWalletStore()
const activeTab = useStorage<0|1>('topColTab',1)
const scrollbar = useTemplateRef<InstanceType<typeof ElScrollbar>>('scrollbar')
const scrollbarLeft = ref(0)
const scrollContent = useTemplateRef<HTMLElement>('scrollContent')
const {width:scrollContentWidth} = useElementSize(scrollContent)
// 持仓数据
const positionList = shallowRef<(GetUserBalanceResponse&{id:string})[]>([])

const isLastVisitTab = computed(()=>{
  return activeTab.value === 1
})

const arrowVisible = computed(()=>{
  const aWidth = Array.from(scrollContent.value?.children || []).reduce((acc,item)=>acc + item.getBoundingClientRect().width,0)
  const gapWidth = Math.max((listData.value.length - 1) * 18,0)
  return scrollContentWidth.value  < aWidth + gapWidth
})

const isEvmChainWallet = computed(() => {
  return getChainInfo(walletStore.chain)?.vm_type === 'evm'
})

const userIds = computed(() => {
  if (botStore.userInfo) {
    return botStore.userInfo.addresses.map(({address, chain}) => address + '-' + chain)
  } else {
     if (walletStore.address && isEvmChainWallet.value && (walletStore.walletName!=='WatchWallet')) {
      return [walletStore.address + '-' + 'bsc', walletStore.address + '-' + 'base', walletStore.address + '-' + 'eth']
    }
    else {
      return [walletStore.address + '-' + walletStore.chain]
    }
  }
})

const listData = computed(()=>{
  return {
    0: positionList.value,
    1:globalStore.lastVisitTokens
  }[activeTab.value]
})

watch(activeTab,()=>{
  // 如果当前 tab 为持仓则调用持仓接口
  if(activeTab.value === 0){
    _getUserBalance()
  }
},{immediate:true})

watch(()=>[botStore.evmAddress,walletStore.address,walletStore.walletSignature[walletStore.address]],()=>{
  _getUserBalance()
})

function _getUserBalance() {
  if(userIds.value[0] === '-'){
    return
  }
  getUserBalance({
    hide_risk:globalStore.hide_risk,
    hide_small:globalStore.hide_small,
    user_ids:userIds.value,
    pageSize:20
  }).then(res=>{
    positionList.value = (res.data || []).map(el=>{
      return {
        ...el,
        id:el.token === NATIVE_TOKEN
          ? getChainInfo(el.chain)?.wmain_wrapper + '-' + el.chain
          : `${el.token}-${el.chain}`,
      }
    })
  })
}

function closeOtherPages() {
  globalStore.lastVisitTokens.length = 0
}

function scrollX(scrollValue:number) {
  if(scrollbar.value){
    scrollbar.value.setScrollLeft(scrollbarLeft.value + scrollValue)
  }
}

function onScroll({scrollLeft}:{ scrollLeft: number }) {
  scrollbarLeft.value = scrollLeft
}

function onDelete(id:string) {
  globalStore.lastVisitTokens = globalStore.lastVisitTokens.filter(item => item.id !== id)
}

const priceChangeCallbacks = {
  0:balancePriceChange,
  1:lastTokensPriceChange
}
watch(
  () => wsStore.wsResult[WSEventType.PRICEV2],
  (val: IPriceV2Response) => {
  const callback = priceChangeCallbacks[activeTab.value]
   if(callback){
    callback(val)
   }
  }
)
watch(() => wsStore.wsResult[WSEventType.ASSET], (val: IAssetResponse) => {
  if(isLastVisitTab.value){
    return
  }
  // 处理 token 交易
  if (val.swap) {
    const token = ((val.swap.token === 'So11111111111111111111111111111111111111112')
      || (val.swap.token === NATIVE_TOKEN))
      ? NATIVE_TOKEN : val.swap.token
    const chain = val.swap.chain
    if (token && chain) {
      setTimeout(()=>{
        _getUserBalance()
      },5000)
    }
    //   处理转账
  } else if (val.transfer) {
    const chain = val.transfer.chain
    const token = val.transfer.token
    const type = val.transfer.type
    if (token && chain) {
      const index = positionList.value.findIndex(i => i.token === token && i.chain === chain)
      const isBuy = type === '0'
      if (index > -1) {
        const indexObj = positionList.value[index]
        const balance = Number(indexObj.balance)
        const price = indexObj.current_price_usd
        const newBalance = new BigNumber(balance).plus(isBuy ? val.transfer.amount : -val.transfer?.amount)
        const newBalanceUsd = newBalance.multipliedBy(price)
        indexObj.balance = newBalance.toString()
        indexObj.balance_usd = newBalanceUsd.toNumber()
        triggerRef(positionList)
      } else {
        setTimeout(()=>{
          _getUserBalance()
        },5000)
      }
    }
  }
})
function lastTokensPriceChange(val:IPriceV2Response) {
  globalStore.lastVisitTokens = globalStore.lastVisitTokens.map((i) => {
      const item = val.prices.find((j) => {
        return i.id === j.token +'-'+j.chain
      })
      if (item) {
        return {
          ...i,
          price: item.uprice,
          price_change: Number(item.price_change),
        }
      }
      return i
    })
}

function balancePriceChange(val:IPriceV2Response) {
  const idToPriceMap: { [key: string]: IPriceV2Response['prices'][0] } = {}
  val.prices.forEach((item) => {
    idToPriceMap[item.token + '-' + item.chain] = item
  })
  positionList.value = positionList.value.map(el=>{
    const current = idToPriceMap[el.id]
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
}
</script>

<template>
  <div class="h-32px bg-[--secondary-bg] flex items-center">
    <div class="pl-16px pr-8px flex items-center gap-8px text-[--icon-color]">
      <Icon :key="0" v-tooltip="$t('positions')" name="custom:position" class="cursor-pointer hover:color-[--secondary-text]" :class="activeTab===0?'text-[--secondary-text]':''" @click="activeTab=0"/>
      <Icon :key="1" v-tooltip="$t('history')" name="custom:history-fill" class="cursor-pointer hover:color-[--secondary-text]" :class="activeTab===1?'text-[--secondary-text]':''" @click="activeTab=1"/>
    </div>
    <div v-if="arrowVisible" class="w-24px h-32px flex items-center justify-center cursor-pointer text-[--secondary-text] hover:text-[--main-text]" @click="scrollX(-200)">
      <Icon name="material-symbols:arrow-back-ios-new-rounded"/>
    </div>    
    <el-scrollbar ref="scrollbar" class="flex-1" @scroll="onScroll">
      <div ref="scrollContent" class="flex items-center gap-18px whitespace-nowrap h-32px text-12px color-[--third-text]">
        <NuxtLink v-for="item in listData" :key="item.id" class="h-full flex items-center gap-4px hover:color-[--main-text] group" :class="item.id===route.params.id?'border-b-solid border-b-[--secondary-text] [&&]:color-[--main-text]':''" :to="`/token/${item.id}`" @click="scrollbar && scrollbar.setScrollLeft(0)">
          <TokenImg :row="{logo_url:item.logo_url,symbol:item.symbol,chain:getAddressAndChainFromId(item.id)?.chain}" :tokenClass="'w-16px h-16px'" chainClass="w-8px h-8px"/>
          {{ item.symbol }}

          <template v-if="'circulation' in item">
            ${{ formatNumber(new BigNumber(item.price).times(new BigNumber(item.circulation)).toFixed(),2) }}
          </template>
          <template v-else>
            ${{ formatNumber(Number(item.balance_usd),2) }}
          </template>

          <template v-if="'total_profit_ratio' in item">
            <span :class="getColorClass(Number(item.total_profit_ratio))">{{+item.total_profit_ratio>0?'+':''}}{{ formatNumber(Number(+item.total_profit_ratio*100),2) }}%</span>
          </template>
          <template v-else>
            <span :class="getColorClass(Number(item.price_change))">{{+item.price_change>0?'+':''}}{{ formatNumber(Number(item.price_change),2) }}%</span>
          </template>
          <Icon v-if="isLastVisitTab" name="custom:close" class="cursor-pointer text-16px hidden group-hover:block" @click.self.stop.prevent="onDelete(item.id)"/>
        </NuxtLink>
      </div>
    </el-scrollbar>
    <div v-if="arrowVisible" class="w-24px h-32px flex items-center justify-center cursor-pointer text-[--secondary-text] hover:text-[--main-text]" @click="scrollX(200)">
      <Icon name="material-symbols:arrow-forward-ios"/>
    </div>
    <div
v-show="listData.length >= 1 && isLastVisitTab"
class="p-8px h-32px flex items-center color-[--secondary-text] hover:color-[--main-text] gap-4px whitespace-nowrap text-12px cursor-pointer"
    @click="closeOtherPages"
    >
      <Icon name="line-md:close"/>
      {{ $t('closeAll') }}
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-scrollbar__bar.is-horizontal){
  display: none;
}
</style>