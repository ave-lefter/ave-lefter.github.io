<script setup lang="ts">
import Transactions from './transactions/transactions.vue'
import OrdersTab from './orders/index.vue'
import DevTokens from './devTokens/index.vue'
import OneClick from '../right/botSwap/oneClick.vue'
import OrderBookButton from '../right/botSwap/orderBookButton.vue'
import Bubble from './holders/new/bubble.vue'
import { useBotStore } from '@/stores/bot'



// 订单簿状态 - 通过 provide/inject 与父组件通信
const orderBookVisible = inject<Ref<boolean>>('orderBookVisible', ref(false))
const { globalConfig } = storeToRefs(useConfigStore())
const route = useRoute()
const tokenStore = useTokenStore()
const botStore = useBotStore()
const { t } = useI18n()
const globalStore = useGlobalStore()
const {token, tokenInfoExtra ,pairAddress,commonHeight} = storeToRefs(useTokenStore())
const activeTab = shallowRef<keyof typeof components | 'Orders'>('Transactions')
const components = {
  Transactions,
  Holders: defineAsyncComponent(() => import('./holders/index.vue')),
  LP: defineAsyncComponent(() => import('./lp/index.vue')),
  Attention: defineAsyncComponent(() => import('./attention/index.vue')),
  Orders: defineAsyncComponent(() => import('./orders/index.vue')),
  MySwap: defineAsyncComponent(() => import('./mySwap/index.vue')),
  DevTokens: defineAsyncComponent(() => import('./devTokens/index.vue')),
}
const tabs = computed(() => {
  return [
  { name: t('transactions'), component: 'Transactions' as const },
  { name: t('holders'), component: 'Holders' as const },
  { name: 'LP', component: 'LP' as const },
  { name: t('attention1') +`(${globalStore.headFollowsNum.all})`, component: 'Attention' as const },
  { name: t('orders'), component: 'Orders' as const },
  { name: t('mySwap'), component: 'MySwap' as const },
  {name:t('devTokens'), component: 'DevTokens' as const},
  ]
})
const id = computed(() => {
  return route.params?.id as string
})
watch(id, () => {
  globalStore.getFollowsNum()
})
watch(() => useFollowStore().currentAddress, (val) => {
  if (val) {
    globalStore.getFollowsNum()
  } else {
    globalStore.headFollowsNum = {
      all: 0,
      subAll: 0
    }
  }
})

watch(
  () => tokenStore.placeOrderUpdate,
  () => {
    if (activeTab.value !== 'Orders') {
      activeTab.value = 'Orders'
    }
  }
)

watch(
  () => tokenStore.placeOrderSuccess,
  () => {
    if (activeTab.value !== 'MySwap') {
      activeTab.value = 'MySwap'
    }
  }
)

// 保存订单薄打开前的标签状态
const previousTab = ref<keyof typeof components>('Transactions')

// 监听 orderBook 显示状态变化
watch(
  () => orderBookVisible.value,
  (isVisible) => {
    // console.log('🔄 订单薄状态变化:', isVisible ? '打开' : '关闭')
    if (isVisible) {
      // 当 orderBook 打开时，保存当前标签并切换到其他标签
      if (activeTab.value === 'Transactions') {
        previousTab.value = 'Transactions'
        activeTab.value = 'Holders'
      } else if (activeTab.value === 'Orders') {
        previousTab.value = 'Orders'
        activeTab.value = 'Holders'
      }
    } else {
      // 当 orderBook 关闭时，恢复到之前的标签（默认为 Transactions）
      activeTab.value = previousTab.value || 'Transactions'
      // console.log('🔄 恢复到标签:', activeTab.value)
    }
  },
  { immediate: true }
)

const tabsList = computed(() => {
  return tabs.value.filter(item => {
    if (item.component === 'Orders' && !botStore?.userInfo?.evmAddress) {
      return false
    }
    // 当 orderBook 显示时，隐藏 Transactions tab
    if (item.component === 'Transactions' && orderBookVisible.value) {
      return false
    }
    return true
  })
})

const Component = computed(() => {
  return activeTab.value === 'Orders' ? OrdersTab : components[activeTab.value]
})
const holders= computed(()=>{
  return token?.value?.holders || 0
})
const pairHolders= computed(()=>{
  return tokenInfoExtra?.value?.pair_holders || 0
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
const isInsiderOrSniperSupported= computed(()=>{
  const chain = addressAndChain.value.chain
  const chainsSupport =
    globalConfig.value?.chains_support_data_analysis_insider_sniper
  return chainsSupport?.includes(chain) || false

})

const comProps = computed(() => {
  return {
    LP: {
      token: token.value,
      pairAddress: pairAddress.value,
      height:commonHeight.value
    },
    Transactions: {},
    Holders: {},
    Attention: {},
    Orders: {},
    MySwap: {},
  }[activeTab.value] || {}
})
onMounted(() => {
  globalStore.getFollowsNum()
})

watch(()=>!tokenStore.devTokenNum && activeTab.value === 'DevTokens',(val)=>{
  if(val){
    activeTab.value = 'Transactions'
  }
})
</script>

<template>
  <div class="bg-[--secondary-bg] rounded-2px text-14px pt-12px flex-1">
    <div class="flex items-center px-12px gap-20px border-b-1px border-b-solid border-b-[--main-divider] mb-12px">
      <a
        v-for="(item) in tabsList" :key="item.component" href="javascript:;"
         :class="`flex items-center decoration-none text-12px lh-20px text-center ${activeTab === item.component ? 'color-[--main-text] b-b-[--main-text] font-500' : 'b-b-transparent color-[--third-text]'}`"
        @click="activeTab = item.component">
        <div v-if="item.component == 'Orders'" class="w-1px h-20px bg-[var(--custom-br-1-color)] mr-20px mb-8px"/>
        <div
          :class="`b-b-solid b-b-2px pb-8px flex-start ${activeTab === item.component ? ' b-b-[--main-text]' : 'b-b-transparent'}`">
          <strong v-if="item.component !== 'DevTokens' || tokenStore.devTokenNum">{{ item.name }}</strong>
          <span v-if="item.component === 'Orders'">({{ tokenStore.registrationNum }})</span>
          <span v-if="item.component === 'LP'" class="flex-start">
            ({{ pairHolders }})
             <Icon v-if="pairHolders" color="#B3920E" name="material-symbols:lock" />
          </span>
          <span v-if="item.component === 'DevTokens' && tokenStore.devTokenNum">({{ tokenStore.devTokenNum }})</span>
          <span v-if="item.component == 'Holders' && holders">
            ({{ token?.holders ? formatNumber(token?.holders || 0, {limit: 10}) : '' }})
              <template v-if="isInsiderOrSniperSupported && (tokenInfoExtra?.insiders_balance_ratio_cur??0) > 0.01">
                <Icon name="custom:insiders" class="text-12px align-middle" :class="(tokenInfoExtra?.insiders_balance_ratio_cur??0) > 0.3? '#AC3EEC': ''" />
                <template v-if="(tokenInfoExtra?.insiders_balance_ratio_cur ??0) * 100 >1">
                  {{ formatNumber((tokenInfoExtra?.insiders_balance_ratio_cur??0) * 100, 2) + '%' }}
                </template>
                <template v-else>
                  {{ '&lt;1%' }}
                </template>
              </template>
          </span>
        </div>
      </a>
      <div class="flex-1" />
      <OrderBookButton v-model="orderBookVisible" />
      <OneClick />
      <Bubble />
    </div>
    <OrdersTab v-show="activeTab === 'Orders'" :currentActiveTab="activeTab"/>
    <DevTokens v-show="activeTab === 'DevTokens'" :currentActiveTab="activeTab" />
    <KeepAlive v-show="activeTab !== 'Orders' && activeTab !== 'DevTokens'">
      <component :is="Component" v-bind="comProps" :currentActiveTab="activeTab" />
    </KeepAlive>
  </div>
</template>

<style>
.light {
  --custom-br-1-color: #f5f5f5;
}

.dark {
  --custom-br-1-color: #33353D;
}
</style>

