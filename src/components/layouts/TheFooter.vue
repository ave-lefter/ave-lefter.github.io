<template>
  <footer class="h-32px bg-[--main-list-hover]  w-full px-12px py-16px footer fixed bottom-0 z-33">
    <div class="left relative">
      <NuxtLink
        v-if="showPrice"
        class="flex items-center gap-5px mr-4px"
        :to="`/token/${showPrice.id}`"
      >
        <TokenImg
        :row="{
          logo_url: showPrice.logo_url,
          chain: ''
        }" token-class="w-16px h-16px [&&]:mr-0" />
        <span class="color-[--secondary-text]">{{ showPrice.symbol }}</span>
        <span :class="`${showPrice.isUp ? 'color-[--up-color]' : 'color-[--down-color]'}`">{{'$'+formatDec(showPrice?.current_price_usd || 0, 2)}}</span>
      </NuxtLink>
       <el-popover popper-style="padding: 12px;min-width: 132px" width="132" placement="top" :teleported="false">
        <template #reference>
          <Icon name="custom:set-up" class="text-12px ml-2px color-[--main-text]" />
        </template>
        <div class="flex items-start justify-center flex-col text-12px gap-16px">
          <NuxtLink
            v-for="(item) in showPrice2" :key="item.symbol || item.logo_url"
            class="flex items-center gap-5px h-16px"
            style="display: flex;"
            :to="`/token/${item.id}`"
          >
            <TokenImg
            class="flex"
            :row="{
              logo_url: item.logo_url,
              chain: ''
            }" token-class="w-16px h-16px [&&]:mr-0" />
            <span class="color-[--secondary-text]">{{ item.symbol }}</span>
            <span :class="`${item.isUp ? 'color-[--up-color]' : 'color-[--down-color]'}`">{{'$'+formatDec(item?.current_price_usd || 0, 2)}}</span>
          </NuxtLink>
        </div>
      </el-popover>
      <div class="flex items-center gap-4px mx-12px cursor-pointer hover:color-[--main-text]" :class="dragPumpStore.visible?'color-[--main-text]':'color-[--secondary-text]'" @click="dragPumpStore.visible=!dragPumpStore.visible">
        <Icon name="custom:pump-icon"/>
        {{ $t('pump1') }}
      </div>
      <div class="flex items-center mr-12px gap-4px cursor-pointer hover:color-[--main-text]" :class="globalStore.pnlTrackerVisible?'color-[--main-text]':'color-[--secondary-text]'" @click="globalStore.pnlTrackerVisible=!globalStore.pnlTrackerVisible">
        <Icon name="custom:chart" class="text-12px" />
        {{ $t('PnlTracker') }}
      </div>
      <el-badge :is-dot="(!!botStore.evmAddress)&&isDoted2" class="mr-12px">
        <div
          id="monitor"
          class="flex items-center gap-4px cursor-pointer hover:color-[--main-text]"
          :class="visible?'color-[--main-text]':'color-[--secondary-text]'" 
          @click="visible=!visible"
        >
          <Icon
            name="mingcute:wallet-fill"
          />
          {{ $t('walletMonitor') }}
        </div>
      </el-badge>
      <el-badge :is-dot="isDoted">
        <div
          class="flex items-center gap-4px cursor-pointer hover:color-[--main-text]"
          :class="signalStore.signalVisible?'color-[--main-text]':'color-[--secondary-text]'" 
          @click="signalStore.signalVisible=!signalStore.signalVisible"
        >
          <Icon
            name="ri:signal-tower-fill"
          />
          {{ $t('signal') }}
        </div>
      </el-badge>
    </div>
    <ul class="right">
      <li class="color-[--secondary-text] hover:color-[--main-text]">
        <a target="_blank" href="https://www.tradingview.com/" class="flex-center">
          <Icon name="simple-icons:tradingview" class="text-18px mr-2px" />TradingView
          <!-- <img v-if="isDark" src="@/assets/images/tradingView-dark.svg" alt="" height="12" />
          <img v-else src="@/assets/images/tradingView-light.svg" alt="" height="12" /> -->
        </a>
      </li>
      <li>
      <a target="_blank" href="https://gopluslabs.io">
        <img src="@/assets/images/goPlus-logo.png" alt="" height="25" lazy >
      </a>
      </li>
      <li>
      <a target="_blank" class="flex-center" href="https://www.btok.com">
        <img src="@/assets/images/btok-logo.png" alt="" height="16" lazy >
      </a>
      </li>
      <li class="color-[--secondary-text] hover:color-[--main-text] flex items-center gap-2px">
      <a target="_blank" href="https://cloud.ave.ai">API</a>
      </li>
      <el-popover popper-style="padding: 12px;min-width: 50px;width:auto"  placement="top" :teleported="false">
      <template #reference>
          <Icon name="custom:set-up" class="text-12px ml-2px color-[--main-text]" />
      </template>
      <ul class="flex items-start justify-center flex-col text-12px gap-16px font-500">
        <!-- <li class="color-[--d-999-l-666] hover:color-[--main-text]">
          <a class="hover:decoration-underline" target="_blank" href="https://eco.ave.ai">{{ $t('ecosystem') }}</a>
        </li> -->
        <li class="color-[--secondary-text] hover:color-[--main-text]">
          <a
            class="hover:decoration-underline" target="_blank" :href="lang?.includes?.('zh')
              ? 'https://doc.ave.ai/cn/mian-ze-shen-ming'
              : 'https://doc.ave.ai/disclaimers'
            ">
            {{ $t('disclaimers') }}
          </a>
        </li>
        <li class="color-[--secondary-text] hover:color-[--main-text]">
          <a target="_blank" class="hover:decoration-underline" href="/privacy.html">{{ $t('privacyPolicy') }}</a>
        </li>

      </ul>
      </el-popover>
      <li class="color-[--secondary-text] hover:color-[--main-text] mr-8px">
        <a
          target="_blank" :href="lang?.includes?.('zh') ? 'https://x.com/aveai_info' : 'https://x.com/AveaiGlobal'"
          class="flex-center">
          <Icon name="bi:twitter-x" class="text-16px" />
        </a>
      </li>
      <li class="color-[--secondary-text] hover:color-[--primary-color] mr-8px">
        <a
          target="_blank" :href="lang?.includes?.('zh') ? 'https://t.me/ave_community_cn' : 'https://t.me/aveai_english'"
          class="flex-center">
          <Icon name="lineicons:telegram-original" class="text-19px" />
        </a>
      </li>
      <li class="color-[--secondary-text] hover:color-[--main-text]">
        <a href="mailto:avebusiness100@ave.ai" class="flex-center">
          <Icon name="material-symbols:mail" class="text-20px" />
        </a>
      </li>
    </ul>
    <audio ref='audioElement' controls :src='audioUrl' style='display: none'/>
    <Batch @refresh="()=>{}"/>
  </footer>
</template>

<script setup lang='tsx'>
import ring from '@/assets/audio/ring.wav'
import { cloneDeep, first, throttle  } from 'lodash-es'
import { formatDec } from '~/utils/formatNumber'
import { getTokensPrice } from '@/api/token'
import { upColor, downColor } from '@/utils/constants'
import type { GetSignalV2ListResponse } from '~/api/signal'
import UserAvatar from '../userAvatar.vue'
import type { IMonitorWsResponse } from '~/api/types/ws'
import bellImg from '@/assets/images/bell.svg'
import { TokenImg } from '#components'

const {t} = useI18n()
const {visible,hasRing} = storeToRefs(useMonitorStore())
const signalStore = useSignalStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()
const dragPumpStore = usePumpStore()

const audioElement=ref<HTMLAudioElement|null>(null)
const { lang } = storeToRefs(globalStore)
const { token } = storeToRefs(useTokenStore())
const route = useRoute()
const isEn = computed(()=>{
  return lang.value === 'en'
})
const addressAndChain = computed(() => {
  const id = route.params.id as string
  if (id) {
    return getAddressAndChainFromId(id)
  }
  return {
    address: token.value?.token || '',
    chain: token.value?.chain || '',
  }
})
const ids = [
  '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c-bsc',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth',
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc',
  'So11111111111111111111111111111111111111112-solana',
]
const data = ref<Array<{
  symbol: string
  logo_url: string
  isUp: boolean
  current_price_usd: number
  id: string
  hidden?: boolean
}>>([])
onMounted(() => {
  // Add any initialization logic if needed
  initPage()
  wsStore.send({
    'jsonrpc': '2.0',
    method: 'subscribe',
    'params': [
      'signalsv2_public_monitor',
      'solana'
    ],
    'id': 1
  })
})
const initPage = () => {
  // Initialize the page or perform any setup tasks
  getTokensPrice(ids).then((res) => {
    //WETH BTCB SOL
    const newVal = res.map((i, index) => {
      const symbol = {WETH: 'ETH', BTCB: 'BTC', WBNB: 'BNB', SOL: 'SOL'}[i.symbol as string] || i.symbol
      return {
        ...i,
        symbol,
        logo_url: i.logo_url,
        hidden: false,
        isUp: i.price_change >= 0,
        id: ids[index]
      }
    })
    data.value[0] = newVal.filter(i => i.symbol === 'BTC')[0]
    data.value[1] = newVal.filter(i => i.symbol === 'ETH')[0]
    data.value[2] = newVal.filter(i => i.symbol === 'BNB')[0]
    data.value[3] = newVal.filter(i => i.symbol === 'SOL')[0]
  })
}
const newData = computed(() => {
  return data.value.map((item, idx) => {
    if (idx === 2) {
      return { ...item, hidden: addressAndChain.value.chain !== 'bsc' }
    }
    if (idx === 3) {
      return { ...item, hidden: addressAndChain.value.chain === 'bsc' }
    }
    return item
  })
})

const showPrice = computed(() => {
  if(addressAndChain.value.chain === 'bsc'){
    return data.value[2]
  } else if(addressAndChain.value.chain === 'solana'){
    return data.value[3]
  } else if(addressAndChain.value.chain === 'eth' || addressAndChain.value.chain === 'base'){
    return data.value[1]
  } else {
    return data.value[3]
  }
})

const showPrice2 = computed(() => {
  const val=cloneDeep(data.value)
  if(addressAndChain.value.chain === 'bsc'){
    val.splice(2, 1)
    return val
  } else if(addressAndChain.value.chain === 'solana'){
    val.splice(3, 1)
    return val
  } else if(addressAndChain.value.chain === 'eth' || addressAndChain.value.chain === 'base'){
    val.splice(1, 1)
    return val
  } else {
    val.splice(3, 1)
    return val
  }
})

watch(()=>globalStore.footerTokensPrice, (newVal) => {
  // console.log('globalStore.footerTokensPrice', newVal)
  if(data.value.length){
    for (let index = 0; index < data.value.length; index++) {
      const item = data.value[index]
      const newItem = newVal.filter(i => i.id === ids[index])?.[0]
      if(newItem){
        item.current_price_usd = newItem?.current_price_usd || item.current_price_usd
        item.isUp = newItem?.price_change>=0
      }
    }
  }
})

const wsStore = useWSStore()
const isDoted = shallowRef(!signalStore.signalVisible)
const isDoted2 = shallowRef(!visible.value)
// 点击信号广场，悬浮窗打开状态，小红点消失
watch(() => signalStore.signalVisible, val => {
  if (val) {
    isDoted.value = false
  }
})

watch(() => wsStore.wsResult[WSEventType.SIGNALSV2_PUBLIC_MONITOR], ({msg}:{msg:GetSignalV2ListResponse}) => {
  if (!signalStore.signalVisible) {
    isDoted.value = true
  }
  if(globalStore.audioSettings.notice.signal){
    signalToast(msg)
  }
})

function signalToast(val:GetSignalV2ListResponse) {
  const actionsCount = val.actions.length
  const actionsVol = val.actions.reduce((acc, curr) => acc + Number(curr.quote_token_amount), 0)
  const firstAction = val.actions[0]
  const msg = ElMessage({
    icon:<img src={bellImg} alt="" class="w-16px h-16px"/>,
    placement:globalStore.audioSettings.notice.position as any,
    message:()=>(
      <div 
        class='inline-flex items-center gap-4px text-12px cursor-pointer'
        onClick={()=>{
        navigateTo(`/token/${val.token}-${val.chain}`)
        }}
      >
         {actionsCount === 1 && <UserAvatar 
            wallet_logo={{logo:firstAction?.wallet_logo,name:firstAction?.wallet_alias}}
            address={firstAction.wallet_address}
            chain={val.chain}
            iconSize='16px'
        />}
        <span>{actionsCount}{t('signalUnit')}{t(val.tag.replace('_buy',''))}</span>{t('justNow')}<span class='color-[--up-color] ml--4px'>{t('buy')}{isEn.value ? ' ':''}{
            formatNumber(actionsVol,1)
          }{
            firstAction.quote_token_symbol.toUpperCase() === 'USDC'
              ? 'U' 
              : firstAction.quote_token_symbol
          }</span>{t('of')}
        <TokenImg row={{logo_url:val.logo,chain:'',symbol:val.symbol}} token-class="w-16px h-16px" />
        {val.symbol} 
      </div>
    )
  })
  messageQueue.add(msg)
}

watch(visible, val => {
  // console.log('visible', val)
  if (val) {
    isDoted2.value = false
  }
})

watch(() => wsStore.wsResult[WSEventType.MONITOR], (val) => {
  // console.log('wsStore.wsResult[WSEventType.MONITOR]', wsStore.wsResult[WSEventType.MONITOR])
  throttle(() => {
    if(globalStore.audioSettings.audio.monitor&&botStore.evmAddress){
      audioElement.value?.play()
    }
  },1000)()
  if (!visible.value) {
    isDoted2.value = true
  }
  if(globalStore.audioSettings.notice.monitor){
    monitorToast(val)
  }
})

function monitorToast(val:IMonitorWsResponse[]) {
  val.forEach(item => {
    const msg = ElMessage({
      icon:<img src={bellImg} alt="" class="w-16px h-16px"/>,
      placement:globalStore.audioSettings.notice.position as any,
      message:()=>(
        <div 
          class='inline-flex items-center gap-4px text-12px cursor-pointer'
          onClick={()=>{
            navigateTo(`/token/${getIsBuy(item)?item.to_address:item.from_address}-${item.chain}`)
          }}
        >
          <UserAvatar 
              wallet_logo={{logo:item.maker_logo,name:item.maker_alias}}
              address={item.maker_address}
              chain={item.chain}
              iconSize='16px'
          />
          <span>{item.maker_alias || (item.maker_address.slice(0,4)+'...'+item.maker_address.slice(-4))}</span>
          <span>{t('justNow')}<span class={getIsBuy(item)?'color-[--up-color]':'color-[--down-color]'}>{
            getIsBuy(item)?t('buy'):t('sell')
            }{isEn.value ? ' ':''}{
              formatNumber(getIsBuy(item)?item.from_amount:item.to_amount,1)
            }{
              getIsBuy(item)?item.from_symbol:item.to_symbol
            }</span>{t('of')}</span>
          <TokenImg row={{logo_url:getIsBuy(item)?item.to_logo:item.from_logo,chain:'',symbol:getIsBuy(item)?item.to_symbol:item.from_symbol}} token-class="w-16px h-16px" />
          {getIsBuy(item)?item.to_symbol:item.from_symbol}
        </div>
      )
    })
    messageQueue.add(msg)
  })
}
function getIsBuy(item: { position_type?: string | number; tx_type?: string | number }) {
  // console.log('item', item)
  if (item.position_type !== undefined) {
    return item.position_type === 0 || item.position_type === 1
  } else {
    return item.tx_type === 0
  }
}

const audioUrl = computed(()=>{
  return audioNameToResource[globalStore.audioSettings.audio.monitor as keyof typeof audioNameToResource]
  || audioNameToResource.Coin
})
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0px;
  justify-content: space-around;

  .left {
    flex: auto;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .right {
    flex: auto;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
