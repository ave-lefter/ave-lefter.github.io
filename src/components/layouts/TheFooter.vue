<template>
  <footer class="h-32px bg-[--d-222-l-F2F2F2]  w-full px-12px py-16px footer fixed bottom-0 z-2">
    <div class="left gap-12px">
      <NuxtLink
        v-for="item in newData" :key="item.symbol || item.logo_url"
        class="color-[--d-999-l-666]  flex items-center gap-5px"
        :to="`/token/${item.id}`"
      >
        <template v-if="!item?.hidden">
          <TokenImg
          :row="{
            logo_url: item.logo_url,
            chain: ''
          }" token-class="w-16px h-16px [&&]:mr-0" />
          <span>{{ item.symbol }}</span>
          <span :class="`color-${item.color}`">{{'$'+formatDec(item?.current_price_usd || 0, 2)}}</span>
        </template>
      </NuxtLink>
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
    <!-- <div
      id="monitor"
      class="flex items-center color-[--d-999-l-666] gap-4px cursor-pointer hover:color-inherit"
      @click="monitorVisible=!monitorVisible"
    >
      <Icon
        name="mingcute:wallet-fill"
      />
      {{ $t('walletMonitor') }}
    </div> -->
    <ul class="right">
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a class="border-left" target="_blank" href="https://eco.ave.ai">{{ $t('ecosystem') }}</a>
      </li>
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a target="_blank" href="https://cloud.ave.ai">API</a>
      </li>
      <li class="bg-[--d-999-l-666] w-1px h-8px" />
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a
          class="border-left" target="_blank" :href="lang?.includes?.('zh')
            ? 'https://doc.ave.ai/cn/mian-ze-shen-ming'
            : 'https://doc.ave.ai/disclaimers'
          ">
          {{ $t('disclaimers') }}
        </a>
      </li>
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a target="_blank" href="/privacy.html">{{ $t('privacyPolicy') }}</a>
      </li>
      <li class="bg-[--d-999-l-666] w-1px h-8px" />
      <li class="color-[--d-999-l-666]">
        <span class="partners">{{ $t('partners') }}</span>
      </li>
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a target="_blank" href="https://www.tradingview.com/" class="flex-center">
          <Icon name="simple-icons:tradingview" class="text-18px mr-2px" />TradingView
          <!-- <img v-if="isDark" src="@/assets/images/tradingView-dark.svg" alt="" height="12" />
          <img v-else src="@/assets/images/tradingView-light.svg" alt="" height="12" /> -->
        </a>
      </li>
      <li class="bg-[--d-999-l-666] w-1px h-8px" />
      <li class="color-[--d-999-l-666] hover:color-[--d-FFF-l-000]">
        <a
          target="_blank" :href="lang?.includes?.('zh') ? 'https://x.com/aveai_info' : 'https://x.com/AveaiGlobal'"
          class="flex-center">
          <Icon name="bi:twitter-x" class="text-16px" />
        </a>
      </li>
      <li class="color-[--d-999-l-666] hover:color-#3F80F7">
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
    <Monitor/>
    <Batch @refresh="()=>{}"/>
  </footer>
</template>

<script setup lang='ts'>
import { formatDec } from '~/utils/formatNumber'
import { getTokensPrice } from '@/api/token'
import { upColor, downColor } from '@/utils/constants'
const {monitorVisible} = storeToRefs(useFollowStore())
const signalStore = useSignalStore()
const globalStore = useGlobalStore()
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
    console.log('getTokensPrice',res)
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
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
