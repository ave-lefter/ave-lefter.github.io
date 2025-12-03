<script setup lang="ts">
import { usePerpStore } from '~/stores/perp'
import BalancePnl from './balancePnl.vue'
import Overview from './overview.vue'
import PerpTable from './perpTable.vue'
import WithdrawAlert from './withdrawAlert.vue'
const perpStore = usePerpStore()

</script>

<template>
  <div :key="Number(perpStore.isLogin)" class="pb-32px">
    <WithdrawAlert/>
    <div class="flex gap-8px mb-28px px-16px">
      <Overview/>
      <BalancePnl/>
    </div>
    <div class="px-16px">
      <PerpTable/>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
