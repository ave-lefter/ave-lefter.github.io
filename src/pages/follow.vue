<template>
  <div class="w-follow bg-[--d-222-l-F2F2F2]  flex-1 w-100%" :style="{height}">
   <div class="flex flex-col bg-[--secondary-bg] h-100% py-12px w-100%">
     <ul class="w-tabs pl-16px">
       <li v-for="item in tabData" :key="item.path" :class="{active:route.path === item.path}"><NuxtLink :to="item.path">{{item.label}}</NuxtLink></li>
     </ul>
     <NuxtPage/>
   </div>
       <!-- 编辑 -->
    <TradeDialog v-model="copyTradeVisible" />
 </div>
</template>

<script setup lang="ts">
import TradeDialog from './copy-trade/components/tradeDialog.vue'
const route=useRoute()
const { t } = useI18n()
const defaultPath=ref('/follow/token')
const globalStore = useGlobalStore()
const { getFollowingInfo, getFollowingAddress } = useCopyTradeStore()
const height = computed(()=>{
  // return 'calc(100vh - 92px)'
  return globalStore.tokenHistoryVisible ? 'calc(100vh - 125px)':'calc(100vh - 92px)'
})
const { copyTradeVisible } = storeToRefs(useCopyTradeStore())
const tabData=computed(()=>[
  {
    label:t('customToken'),
    path:'/follow/token'
  },
  {
    label:t('watchAddress'),
    path:'/follow/addr'
  },
  {
    label:t('remarkLib'),
    path:'/follow/remark'
  }
])
watch(
  () => route.path,
  (newPath, oldPath) => {
    console.log('===================', newPath)
    if (newPath === '/follow/addr' || newPath === '/follow/remark') {
        getFollowingInfo()
        getFollowingAddress()
      }
  }
)
onMounted(() => {
  if (route.path === '/follow/addr' || route.path === '/follow/remark') {
    getFollowingInfo()
    getFollowingAddress()
  }
})
definePageMeta({
  layout: 'default',
   key: (route) => {
    return (route.name as string)
  },
transition: {
    name: 'follow',
  },
  keepalive: true,
  middleware: defineNuxtRouteMiddleware((to) => {
    if (to.path === '/follow'){
      return navigateTo(defaultPath.value, { replace: true })
    }else{
      defaultPath.value=to.fullPath
    }
  })
})
</script>
<style lang="scss" scoped>
ul.w-tabs{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  // font-weight: 500;
  font-size: 14px;
  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  >li{
    display: flex;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    color:var(--third-text);
    background-color:var(--main-input-button-bg);
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    >a{
      padding: 0 16px;
    }
    &.active{
      color: var(--white);
      background-color:#3F80F7;
    }
  }
}
</style>
