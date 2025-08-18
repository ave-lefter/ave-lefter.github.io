<script setup lang="ts">
import Kline from '~/pages/token/components/kLine/index.vue'
import TokenInfo from './tokenInfo.vue'
import TokenTop from './tokenTop.vue'

</script>
<template>
  <div class="flex w-full h-360px">
    <div class="flex-1">
        <TokenTop/>
        <Kline/>
    </div>
    <TokenInfo/>
  </div>
</template>