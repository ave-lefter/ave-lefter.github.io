<script setup lang='ts'>
// 未匹配的路由跳转到首页
definePageMeta({
  middleware: defineNuxtRouteMiddleware(() => {
    return navigateTo('/perp/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599-eth', { replace: true })
  })
})
</script>

