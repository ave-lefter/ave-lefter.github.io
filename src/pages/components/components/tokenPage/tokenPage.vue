<script setup lang="ts">
import Kline from '~/pages/token/components/kLine/index.vue'
import TokenInfo from './tokenInfo.vue'
import TokenTop from './tokenTop.vue'

</script>
<template>
  <div class="sticky left-0 flex w-100vw box-border h-360px border-1px border-solid border-[--d-566275-l-8CA0C3]">
    <div class="flex-1">
        <TokenTop/>
        <Kline isRank/>
    </div>
    <TokenInfo/>
  </div>
</template>