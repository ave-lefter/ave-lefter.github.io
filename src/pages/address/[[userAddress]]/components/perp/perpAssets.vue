<script setup lang="ts">
import BalancePnl from './balancePnl.vue'
import Overview from './overview.vue'
import PerpTable from './perpTable.vue'


</script>

<template>
  <div>
    <div class="flex gap-8px mb-40px px-16px">
      <Overview/>
      <BalancePnl/>
    </div>
    <PerpTable/>
  </div>
</template>

<style lang="scss" scoped></style>