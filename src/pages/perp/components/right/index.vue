<template>
  <div class="relative bg-[--secondary-bg] p-12px">
    <UserAssert />
    <el-divider style="--el-border-color: var(--main-divider);margin: 16px 0;" />
    <LeverageSet />
    <Swap />
  </div>
</template>

<script lang="ts" setup>
import UserAssert from './userAssert.vue'
import LeverageSet from './leverageSet.vue'
import Swap from './swap.vue'


</script>

<style lang="scss" scoped></style>
