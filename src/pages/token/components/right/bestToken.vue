<template>
    <div class="flex items-center py-11px px-8px text-12px justify-between bg-[--dialog-bg] rounded-4px mb-12px">
        {{ $t('devBestToken') }}
        <div class="flex items-center color-[--third-text]">
          <TokenImg class="mr-4px" :row="{
            logo_url:tokenStore.tokenInfo?.token?.logo_url || '',
            symbol:tokenStore.tokenInfo?.token?.symbol || '',
            chain:tokenStore.tokenInfo?.token?.chain || ''
          }"/>
          <span class="font-500 text-16px color-[--main-text]">{{ tokenStore.tokenInfo?.token?.symbol }}</span>
          (ATH MC <span class="color-[--main-text]">$480.4M</span>)
        </div>
    </div>
</template>
<script setup>
    const tokenStore = useTokenStore()
</script>