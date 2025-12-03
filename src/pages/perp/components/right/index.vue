<template>
  <el-scrollbar class="bg-[--secondary-bg]" height="calc(100vh - 96px)">
    <div class="relative p-12px" style="min-height: calc(100vh - 96px)">
      <UserAssert />
      <template v-if="perpStore.isConnectLogin">
        <el-divider style="--el-border-color: var(--main-divider);margin: 16px 0;" />
        <LeverageSet />
        <Swap />
      </template>
    </div>
  </el-scrollbar>

</template>

<script lang="ts" setup>
import UserAssert from './userAssert.vue'
import LeverageSet from './leverageSet.vue'
import Swap from './swap.vue'
import { usePerpStore } from '~/stores/perp'
const perpStore = usePerpStore()


</script>

<style lang="scss" scoped></style>
