<template>
  <div class="flex bg-[--d-000-l-F6F6F6] gap-1px flex min-w-0 w-full" style="min-height: calc(100vh - 92px);">
    <div class="flex-1 min-w-0">
      <Top/>
      <div class="flex gap-1px">
        <div class="hide-scrollbar">
          <el-scrollbar :height="scrollbarHeight">
            <Left class="w-292px flex flex-col flex-shrink-0"/>
          </el-scrollbar>
        </div>
        <div class="flex-1 hide-scrollbar min-w-0 relative">
          <div
            v-show="globalStore.showLeft"
            :class="`absolute bg-[--d-333-l-DDD] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left--14px hover:w-30px hover:left--34px hover:h-36px transition-all rounded-tl-4px rounded-bl-4px`"
            @click="globalStore.$patch({showLeft:false})"
          >
            <Icon name="material-symbols:arrow-back-ios-new-rounded" :class="`color-[--d-FFF-l-222] text-12px`"/>
          </div>
          <div
            v-show="!globalStore.showLeft"
            :class="`absolute bg-[--d-333-l-DDD] w-10px h-32px z-1 cursor-pointer flex items-center justify-center left-0 hover:w-30px hover:h-36px transition-all rounded-tr-4px rounded-br-4px`"
            @click="globalStore.$patch({showLeft:true})"
          >
            <Icon name="material-symbols:arrow-forward-ios" :class="`color-[--d-FFF-l-222] text-12px`"/>
          </div>
          <el-scrollbar :height="scrollbarHeight">
            <KLine />
            <BelowChartTable class="min-h-300px rounded-4px bg-[--d-000-l-F6F6F6]"/>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <TokenRight class="w-334px flex-shrink-0" />
  </div>
</template>

<script setup lang='ts'>
import { getTokenInfo, getTokenInfoExtra } from '~/api/token'
import { useTokenStore } from '~/stores/token'
import Top from './components/top/index.vue'
import TokenRight from './components/right/index.vue'
import {Left} from './components/left'
import {BelowChartTable} from './components/belowChartTable'
import KLine from '~/pages/token/components/kLine/index.vue'
import  { getAiSummary } from '@/api/token'

definePageMeta({
  name: 'token-id',
  key: (route) => {
    return (route.name as string)
  },
})
const route = useRoute()
const localeStore  = useLocaleStore()
const tagStore = useTagStore()
const tokenStore = useTokenStore()
const scrollbarHeight = computed(() => {
  if (tokenStore.isShowWaring) {
    return 'calc(100vh - 198px)'
  }
  return 'calc(100vh - 158px)'
})
const globalStore = useGlobalStore()
const botStore = useBotStore()
const addresses = computed(() => {
  const result = botStore.userInfo?.addresses
  if (Array.isArray(result)) {
    return Array.from(new Set(result.map(el => el.address)))
  }
  return []
})
const wsStore = useWSStore()

const aiSummary = shallowRef({summary:'', headline:''})

 function _getAiSummary() {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
  getAiSummary(id)
    .then((res) => {
      aiSummary.value = res ?? { summary: '', headline: '' }
    })
    .catch((err: any) => {
      console.log(err)
    })
    .finally(() => {})
}

onMounted(() => {
  _getAiSummary()
})
watch([() => route.params.id, () => localeStore.locale],
  () => {
    _getAiSummary()
  }
)
//顶层提供aisummary数据，给子组件top和right使用
provide('aiSummary', aiSummary)

const documentVisible = shallowRef(true)
provide('documentVisible', documentVisible)

watch(() => addresses.value, () => {
  if (addresses.value?.length) {
    subBalanceChange()
  }
}, {
  immediate: true
})

function subBalanceChange() {
  wsStore.send({
    jsonrpc: '2.0',
    method: 'unsubscribe',
    params: [
      'asset'
    ],
    id: 1
  })
  wsStore.send({
    jsonrpc: '2.0',
    method: 'subscribe',
    params: ['asset', addresses.value],
    id: 1,
  })
}

function _getTokenInfo() {
  const id = route.params.id as string
  getTokenInfo(id).then(res => {
    tokenStore.tokenInfo = res
    tokenStore.pairAddress = res?.pairs?.[0].pair || ''
  })
}

function _getTokenInfoExtra() {
  const id = route.params.id as string
  getTokenInfoExtra(id).then(res => {
    tokenStore.tokenInfoExtra = res
  })
}

function init() {
  tokenStore.tokenPrice = 0
  _getTokenInfo()
  _getTokenInfoExtra()
  // wsStore.onmessageTxUpdateToken()
  tokenStore._getTotalHolders()
  tagStore.getTagArr()
}

watch(() => route.params.id, () => {
  init()
})

function visibilitychangeFn() {
  console.log(`页面是否隐藏: ${document.hidden}`)
  documentVisible.value = (!document.hidden || document.visibilityState === 'visible')
}

onBeforeMount(() => {
  init()
  document.addEventListener('visibilitychange', visibilitychangeFn)
})

onBeforeRouteLeave(() => {
  // tokenStore.reset()
  wsStore.getWSInstance()?.offMessage(['tx_update_token', 'kline', 'price'])
  document.removeEventListener('visibilitychange', visibilitychangeFn)
})
</script>

<style>

</style>
