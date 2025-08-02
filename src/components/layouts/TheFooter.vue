<template>
  <footer class="h-32px bg-[--d-222-l-F2F2F2]  w-full px-12px py-16px footer fixed bottom-0 z-9999">
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
        <span class="color-[--d-999-l-666]">{{ showPrice.symbol }}</span>
        <span :class="`color-${showPrice.color}`">{{'$'+formatDec(showPrice?.current_price_usd || 0, 2)}}</span>
      </NuxtLink>
       <el-popover popper-style="padding: 12px;min-width: 132px" width="132" placement="top" :teleported="false">
        <template #reference>
          <Icon name="custom:set-up" class="text-12px ml-2px color-#666" />
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
            <span class="color-[--d-999-l-666]">{{ item.symbol }}</span>
            <span :class="`color-${item.color}`">{{'$'+formatDec(item?.current_price_usd || 0, 2)}}</span>
          </NuxtLink>
        </div>
      </el-popover>
      <div class="flex items-center gap-4px color-[--d-999-l-666] mx-12px cursor-pointer hover:color-inherit">
        <Icon name="custom:pump-icon"/>
        {{ $t('pump1') }}
      </div>
      <el-badge :is-dot="(!!botStore.evmAddress)&&isDoted2" class="mr-12px">
        <div
          id="monitor"
          class="flex items-center color-[--d-999-l-666] gap-4px cursor-pointer hover:color-inherit "
          @click="visible=!visible"
        >
          <Icon
            name="mingcute:wallet-fill"
          />
          {{ $t('walletMonitor') }}
        </div>
      </el-badge>
      <el-badge v-if="!route.path.includes('smart')" :is-dot="isDoted">
        <div
          class="flex items-center color-[--d-999-l-666] gap-4px cursor-pointer hover:color-inherit"
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
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
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
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000] flex items-center gap-2px">
      <a target="_blank" href="https://cloud.ave.ai">API</a>
      </li>
      <el-popover popper-style="padding: 12px;min-width: 107px" width="107" placement="top" :teleported="false">
      <template #reference>
          <Icon name="custom:set-up" class="text-12px ml-2px color-#666" />
      </template>
      <ul class="flex items-start justify-center flex-col text-12px gap-16px font-500">
        <!-- <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
          <a class="hover:decoration-underline" target="_blank" href="https://eco.ave.ai">{{ $t('ecosystem') }}</a>
        </li> -->
        <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
          <a
            class="hover:decoration-underline" target="_blank" :href="lang?.includes?.('zh')
              ? 'https://doc.ave.ai/cn/mian-ze-shen-ming'
              : 'https://doc.ave.ai/disclaimers'
            ">
            {{ $t('disclaimers') }}
          </a>
        </li>
        <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
          <a target="_blank" class="hover:decoration-underline" href="/privacy.html">{{ $t('privacyPolicy') }}</a>
        </li>
        
      </ul>
      </el-popover>
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000] mr-8px">
        <a
          target="_blank" :href="lang?.includes?.('zh') ? 'https://x.com/aveai_info' : 'https://x.com/AveaiGlobal'"
          class="flex-center">
          <Icon name="bi:twitter-x" class="text-16px" />
        </a>
      </li>
      <li class="color-[--d-999-l-666] hover:color-#3F80F7 mr-8px">
        <a
          target="_blank" :href="lang?.includes?.('zh') ? 'https://x.com/aveai_info' : 'https://x.com/AveaiGlobal'"
          class="flex-center">
          <Icon name="lineicons:telegram-original" class="text-19px" />
        </a>
      </li>
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a href="mailto:avebusiness100@ave.ai" class="flex-center">
          <Icon name="material-symbols:mail" class="text-20px" />
        </a>
      </li>
    </ul>
    <audio ref='audioElement' controls :src='ring' style='display: none'/>
    <Batch @refresh="()=>{}"/>
  </footer>
</template>

<script setup lang='ts'>
import ring from '@/assets/audio/ring.wav'
import { cloneDeep, throttle  } from 'lodash-es'
import { formatDec } from '~/utils/formatNumber'
import { getTokensPrice } from '@/api/token'
import { upColor, downColor } from '@/utils/constants'
const {visible,hasRing} = storeToRefs(useMonitorStore())
const signalStore = useSignalStore()
const globalStore = useGlobalStore()
const botStore = useBotStore()

const audioElement=ref<HTMLAudioElement|null>(null)
const { lang } = storeToRefs(globalStore)
const { token } = storeToRefs(useTokenStore())
const route = useRoute()
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
  color: string
  current_price_usd: number
  id: string
  hidden?: boolean
}>>([])
onMounted(() => {
  // Add any initialization logic if needed
  initPage()
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
        color: i.price_change >= 0 ? upColor[0] : downColor[0],
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
        item.color = newItem?.price_change>=0?upColor[0]:downColor[0]
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
watch(() => wsStore.wsResult[WSEventType.SIGNALSV2_PUBLIC_MONITOR], () => {
  if (!signalStore.signalVisible) {
    isDoted.value = true
  }
})
watch(visible, val => {
  // console.log('visible', val)
  if (val) {
    isDoted2.value = false
  }
})

watch(() => wsStore.wsResult[WSEventType.MONITOR], () => {
  // console.log('wsStore.wsResult[WSEventType.MONITOR]', wsStore.wsResult[WSEventType.MONITOR])
  throttle(() => {
    if(hasRing.value&&botStore.evmAddress){
      audioElement.value?.play()
    }
  },1000)()
  if (!visible.value) {
    isDoted2.value = true
  }
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
