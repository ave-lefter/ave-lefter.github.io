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
      <el-badge :is-dot="isDoted" class="mr-12px">
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
      <div
        class="flex items-center gap-4px cursor-pointer hover:color-[--main-text]"
        :class="trackerStore.visible?'color-[--main-text]':'color-[--secondary-text]'"
        @click="trackerStore.visible=!trackerStore.visible"
      >
        <div class="flex items-center justify-center w-14px h-14px bg-[--main-bg] rounded-full">
          <Icon
          name="custom:twitter"
        />
        </div>
        Tracker
      </div>
    </div>
    <ul class="right">
      <li class="color-[--secondary-text] hover:color-[--main-text]">
        <a target="_blank" href="https://cloud.tencent.com/" class="flex-center">
          <Icon name="custom:tencent-cloud" class="text-14px  mr-2px hover:color-[#0052D9]" />
          <!-- <img v-if="isDark" src="@/assets/images/tradingView-dark.svg" alt="" height="12" />
          <img v-else src="@/assets/images/tradingView-light.svg" alt="" height="12" /> -->
        </a>
      </li>
      <li class="color-[--secondary-text] hover:color-[--main-text]">
        <a target="_blank" href="https://www.tradingview.com/" class="flex-center">
          <Icon name="simple-icons:tradingview" class="text-18px mr-2px" />TradingView
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
    <QuickSwap v-if="quickSwapRow" classNames='msgBuy hidden!' :row="quickSwapRow" :quickBuyValue="quickBuyValue" @jump="AfterHandleBotBuy(quickSwapRow)"/>
  </footer>
</template>

<script setup lang="tsx">
import { cloneDeep, first, throttle  } from 'lodash-es'
import { formatDec } from '~/utils/formatNumber'
import { getTokensPrice } from '@/api/token'
import type { GetSignalV2ListResponse } from '~/api/signal'
import UserAvatar from '../userAvatar.vue'
import type { IMonitorWsResponse } from '~/api/types/ws'
import bellImg from '@/assets/images/bell.svg'
import bellImg3 from '@/assets/images/bell3.svg'
import { TokenImg,QuickSwap } from '#components'
// import QuickSwap from '../quickSwapTsx.vue'

const {t} = useI18n()
const {visible, hasRing} = storeToRefs(useMonitorStore())
const signalStore = useSignalStore()
const trackerStore = useTrackerStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()
const dragPumpStore = usePumpStore()
const configStore = useConfigStore()
const audioElement=ref<HTMLAudioElement|null>(null)
const { lang } = storeToRefs(globalStore)
const { token } = storeToRefs(useTokenStore())
const route = useRoute()
const isEn = computed(()=>{
  return lang.value === 'en'
})

// 获取pump配置
const pumpConfig = computed(() => dragPumpStore.pumpConfig)

// 平台选项 - 根据选中的链动态显示对应的平台
const platformOptions = computed(() => {
  const platforms: Array<{ label: string; value: string; icon: string }> = []
  // 只遍历选中的链
  pumpConfig.value.forEach((chain: any) => {
      chain.platforms.forEach((platform: any) => {
        // 去重
        if (!platforms.find((p) => p.value === platform.platform)) {
          platforms.push({
            label: platform.platform_show,
            value: platform.platform,
            icon: platform.platform_icon,
          })
        }
      })
  })
  return platforms
})

const getIconByPlatform = (platform: string) => {
  const icon =  platformOptions.value.find((p:any) => p.value === platform)?.icon.replace('/signals/', 'signals/') || ''
  return `${configStore.token_logo_url}${icon}`
}
console.log('platformOptions',platformOptions.value)

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
  symbol: string,
  logo_url: string,
  isUp: boolean,
  current_price_usd: number,
  id: string,
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
  wsStore.send({
    'jsonrpc': '2.0',
    method: 'subscribe',
    'params': [
      'pump_migrated',
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

// 监听pump事件
watch(() => wsStore.wsResult[WSEventType.PUMP_MIGRATED], (msg:GetSignalV2ListResponse) => {
  console.log('wsStore.wsResult[WSEventType.PUMP_MIGRATED]', JSON.parse(JSON.stringify(msg)))
  if(globalStore.audioSettings.notice.pumpNotice){
    const pumpChains = globalStore.audioSettings.notice.pumpChains
    const pumpPlatforms = globalStore.audioSettings.notice.pumpPlatforms
    if(pumpChains.includes(msg.chain) && pumpPlatforms.includes(msg.pair.platform_id)){
      setTimeout(() => { pumpToast(msg) }, 1000)
    }
  }
})

// 监听pump事件并弹窗
function pumpToast(val:GetSignalV2ListResponse) {
  const getSymbol = ()=>{
    if(val.pair.target_token == val.pair.token0_address){
      return val.pair.token0_symbol
    }
    return val.pair.token1_symbol
  }
  const msg = ElMessage({
    icon: <img src={bellImg3} alt="" class="w-16px h-16px" />,
    duration: (globalStore.audioSettings.notice.time||0) * 1000,
    placement: globalStore.audioSettings.notice.position as any,
    message: () => (
      <div
        class='inline-flex items-center gap-4px text-12px cursor-pointer'
        onClick={() => {
          navigateTo(`/token/${val.pair.target_token}-${val.chain}`)
        }}
      >
        <div class='flex items-center gap-4px relative'>
          <TokenImg row={{ logo_url: val.pair.logo_url, chain: val.chain, symbol: getSymbol() }} token-class="w-28px h-28px" chainClass='hidden' />
          <img
            src={getIconByPlatform(val.pair.platform_id)}
            alt=""
            class="w-13px h-13px absolute right-0 bottom-0"
          />
        </div>
        <div class='ml-4px'>
          <div class='text-14px'>{getSymbol()} {t('pumpCompleted')}</div>
          <div class='text-12px color-[--secondary-text] mt-2px'>
            {t('innerDiskTime')} { val.time - val.pair.publish_at <= 0  || !val.pair.publish_at ? ' - ' : formatTime( val.time - val.pair.publish_at)}，
            {t('holders')} {val.pair.holders} ，
            {t('mCap')} {formatNumber(val.pair.market_cap || 0, 2)}
          </div>
        </div>
      </div>
    )
  })
  messageQueue.add(msg)
}


function signalToast(val:GetSignalV2ListResponse) {
  const actionsCount = val.actions.length
  const actionsVol = val.actions.reduce((acc, curr) => acc + Number(curr.quote_token_amount), 0)
  const firstAction = val.actions[0]
  const msg = ElMessage({
    icon: <img src={bellImg} alt="" class="w-16px h-16px"/>,
    placement: globalStore.audioSettings.notice.position as any,
    duration: (globalStore.audioSettings.notice.time||0) * 1000,
    message: ()=>(
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

const quickSwapRow=shallowRef<GetSignalV2ListResponse|null>(null)
// const quickSwapRef=ref<HTMLAudioElement|null>(null)
const quickBuyValue=shallowRef('')

const handleBotBuy=(e:MouseEvent,item:any) => {
  e?.stopPropagation?.()
  e?.preventDefault?.()
  quickSwapRow.value={...item,...{target_token:item?.target_address,token0_address:item?.from_address,token1_address:item?.to_address,symbol:getIsBuy(item)?item.to_symbol:item.from_symbol}}
  quickBuyValue.value=(globalStore.audioSettings.notice as any)[`quickBuyValue_${item.chain}`]||'0.01'
  // quickSwapRef.value?.click()
  const dom =document.querySelector('.msgBuy')
  if(dom){
    const event = new Event('click');
    setTimeout(() => {
      if(quickSwapRow.value){
        dom.dispatchEvent(event);
      }
    },500)
    // dom.click()
  }
}
const router = useRouter()
function AfterHandleBotBuy(item:any) {
  if(globalStore.audioSettings.notice.quickBuyAction===0){
    navigateTo(`/token/${getIsBuy(item)?item.to_address:item.from_address}-${item.chain}`)
  }else if(globalStore.audioSettings.notice.quickBuyAction===1){
    const url = router.resolve({
      name: 'token-id',
      params: { id: item.target_token + '-' + item.chain },
    }).href
    window.open(url, '_blank')
  }
}

function monitorToast(val:IMonitorWsResponse[]) {
  val.forEach(item => {
    const msg = ElMessage({
      icon:<div></div>,
      showClose:true,
      placement:globalStore.audioSettings.notice.position as any,
      customClass:`w-320px p-[15px_8px] border-transparent rounded-[8px] monitorToast ${globalStore.audioSettings.notice.monitorBorder&&(globalStore.audioSettings.notice.monitorShow===1)&&`${getIsBuy(item)?'border-[--up-color]!':'border-[--down-color]!'}`} ${(globalStore.audioSettings.notice.monitorShow===0)&&`border-[--dialog-tab-active-bg]!`} ${(globalStore.audioSettings.notice.monitorShow===1)&&globalStore.audioSettings.notice.quickBuy&&'monitorToast2'}`,
      message:()=>(
        <div
          class='inline-flex items-center gap-4px text-12px cursor-pointer w-full'
          onClick={()=>{
            navigateTo(`/token/${getIsBuy(item)?item.to_address:item.from_address}-${item.chain}`)
          }}
        >
        {globalStore.audioSettings.notice.monitorShow===0?(<div class='inline-flex items-center gap-4px'>
            <UserAvatar
                wallet_logo={{logo:item.maker_logo,name:item.maker_alias}}
                address={item.maker_address}
                chain={item.chain}
                iconSize='16px'
            />
            <span class='ellipsis max-w-80px'>{item.maker_alias || (item.maker_address.slice(0,4)+'...'+item.maker_address.slice(-4))}</span>
            <span>
              {getIsBuy(item)?t('buy'):t('sell')}&nbsp;
              <span class={getIsBuy(item)?'color-[--up-color]':'color-[--down-color]'}>
                {formatNumber(getIsBuy(item)?item.from_amount:item.to_amount,1)}
                <span class='ellipsis'>{getIsBuy(item)?item.from_symbol:item.to_symbol}</span>
              </span>
            </span>
            <TokenImg row={{logo_url:getIsBuy(item)?item.to_logo:item.from_logo,chain:'',symbol:getIsBuy(item)?item.to_symbol:item.from_symbol}} token-class="w-16px h-16px" />
            <span class='ellipsis'>{getIsBuy(item)?item.to_symbol:item.from_symbol}</span>
          </div>):(<div class='flex gap-8px items-center w-full'>
            <TokenImg row={{logo_url:getIsBuy(item)?item.to_logo:item.from_logo,chain:'',symbol:getIsBuy(item)?item.to_symbol:item.from_symbol}} token-class="w-40px h-40px" />
            <div class="flex h-40px items-start justify-between flex-col gap-4px">
              <div class="flex items-center">
                {globalStore.audioSettings.notice.monitorTh[0]&&<UserAvatar
                  wallet_logo={{logo:item.maker_logo,name:item.maker_alias}}
                  address={item.maker_address}
                  chain={item.chain}
                  iconSize='16px'
                  class="mr-4px"
                />}
                {/* <span v-if="audioSettings.notice.monitorTh[1]">Zoe&nbsp;</span> */}
                {globalStore.audioSettings.notice.monitorTh[1]&&<span class='ellipsis max-w-80px'>{item.maker_alias || (item.maker_address.slice(0,4)+'...'+item.maker_address.slice(-4))}&nbsp;</span>}
                {/* {globalStore.audioSettings.notice.monitorTh[3]&&<span>{t('justNow')}</span>} */}
                <span><span class={getIsBuy(item)?'color-[--up-color]':'color-[--down-color]'}>&nbsp;{
                  getIsBuy(item)?t('buy'):t('sell')
                  }&nbsp;</span></span>
                  <span class='ellipsis'>{getIsBuy(item)?item.to_symbol:item.from_symbol}</span>
              </div>
              <div class="flex items-center">
                <TokenImg row={{logo_url:!getIsBuy(item)?item.to_logo:item.from_logo,chain:'',symbol:!getIsBuy(item)?item.to_symbol:item.from_symbol}} token-class="w-16px h-16px mr-4px" />
                <span>
                  <span class={getIsBuy(item)?'color-[--up-color]':'color-[--down-color]'}>{isEn.value ? ' ':''}{
                    formatNumber(getIsBuy(item)?item.from_amount:item.to_amount,1)
                  }
                  <span class='ellipsis'>{getIsBuy(item)?item.from_symbol:item.to_symbol}</span>
                  </span>
                  {globalStore.audioSettings.notice.monitorTh[2]&&<span >&nbsp;{t('bugMC',{n:Number(item?.target_mcap)?('$'+formatNumberS(item?.target_mcap || 0,{
                    decimals:0,
                    limit:3
                  })):'--'})} </span>}
                </span>
              </div>
            </div>
            {globalStore.audioSettings.notice.quickBuy&&<div class='quickBuyBtn flex items-center h-[24px] bg-#12B8861A text-#12B886 rounded-[4px] font-normal text-[14px] leading-[16px] px-8px clickable' onClick={(e:any)=>handleBotBuy(e,item)}>
              {(globalStore.audioSettings.notice as any)[`quickBuyValue_${item.chain}`]}&nbsp;{ getChainInfo(item.chain)?.main_name || '' }
            </div>}
          </div>)}
        </div>
      ),
      // duration: 0,
      duration: (globalStore.audioSettings.notice.time||0) * 1000,
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
<style lang="scss">
.monitorToast2{
  .el-icon.el-message__closeBtn{
    position: relative;
    top: -20px;
    right: 0;
  }
  .quickBuyBtn{
    position: absolute;
    top: 33px;
    right: 10px;
  }
}
.monitorToast{
  .el-icon.el-message__icon{
    display: none;
  }
}
</style>