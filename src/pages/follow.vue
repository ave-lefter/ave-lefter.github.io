<template>
   <div class="w-follow bg-[--d-000-l-F6F6F6] pt-4px w-100%" style="height: calc(100vh - 92px);">
    <div class="flex flex-col bg-[--d-111-l-FFF] h-100% py-12px">
      <ul class="w-tabs pl-12px">
        <li v-for="item in tabData" :key="item.path" :class="{active:route.path === item.path}"><NuxtLink :to="item.path">{{item.label}}</NuxtLink></li>
        <!-- <li :class="{active:route.path === '/follow/token'}"><NuxtLink to="/follow/token">token</NuxtLink></li>
        <li :class="{active:route.path === '/follow/token'}"><NuxtLink to="/follow/addr">address</NuxtLink></li>
        <li :class="{active:route.path === '/follow/token'}"><NuxtLink to="/follow/remark">remark</NuxtLink></li> -->
      </ul>
       <NuxtPage/>
    </div>
   </div>
</template>

<script setup lang="ts">
const route=useRoute()
const { t } = useI18n()
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
  keepalive: false,
  middleware: defineNuxtRouteMiddleware((to) => {
    if(to.path === '/follow') {
      return navigateTo('/follow/token', { replace: true })
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
  font-weight: 500;
  font-size: 14px;
  /* border-bottom: 1px solid var(--d-222-l-EEE); */
  li{
    display: flex;
    padding: 0 12px;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    background-color:var(--d-1A1A1A-l-F2F2F2);
    justify-content: center;
    align-items: center;
    color: #666;
    border-radius: 4px;
    &.active{
      color: #f5f5f5;
      background-color:var(--d-333-l-0A0B0C);
    }
  }
}
</style>
