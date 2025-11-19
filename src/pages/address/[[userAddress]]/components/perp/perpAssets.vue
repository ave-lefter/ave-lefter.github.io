<script setup lang="ts">
import BalancePnl from './balancePnl.vue'
import Overview from './overview.vue'
import PerpTable from './perpTable.vue'


</script>

<template>
  <div class="pb-32px">
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