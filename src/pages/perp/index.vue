<script setup lang='ts'>
// 未匹配的路由跳转到首页
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    return navigateTo('/perp/BTCUSD', { replace: true })
  })
})
</script>

