<template>
  <div class="w-follow bg-[--d-222-l-F2F2F2]  flex-1 w-100%" style="height: calc(100vh - 92px);">
   <div class="flex flex-col bg-[--secondary-bg] h-100% py-12px w-100%">
     <ul class="w-tabs pl-16px">
       <li v-for="item in tabData" :key="item.path" :class="{active:route.path === item.path}"><NuxtLink :to="item.path">{{item.label}}</NuxtLink></li>
     </ul>
     <NuxtPage/>
   </div>
 </div>
</template>

<script setup lang="ts">
const route=useRoute()
const { t } = useI18n()
const defaultPath=ref('/follow/token')
console.log('router',route)
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
    if(to.path === '/follow') {
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
    color:var(--d-666-l-999);
    background-color:var(--d-1A1A1A-l-F2F2F2);
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    >a{
      padding: 0 16px;
    }
    &.active{
      color: #f5f5f5;
      background-color:var(--d-333-l-0A0B0C);
    }
  }
}
</style>
