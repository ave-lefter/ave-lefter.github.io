<template>
  <div class="relative bg-[--secondary-bg] p-12px">
    <UserAssert />
    <el-divider style="--el-border-color: var(--main-divider);margin: 16px 0;" />
    <LeverageSet />
  </div>
</template>

<script lang="ts" setup>
import { usePerpStore } from '~/stores/perp'
import UserAssert from './userAssert.vue'
import LeverageSet from './leverageSet.vue'
const perpStore = usePerpStore()

</script>

<style lang="scss" scoped></style>
