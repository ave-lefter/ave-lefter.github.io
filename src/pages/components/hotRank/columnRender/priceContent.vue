<template>
  <el-table-column
    :label="$t('price')"
    align="right"
    width="130"
  >
    <template #header>
      <span>{{ $t('price') }}</span>
    </template>
    <template #default="{ row }">
      <!-- v-animation-trigger-table:animation-bg="row.current_price_usd" -->
      <span
        :class="!row.current_price_usd ? 'color-#848E9C' : ''"
      >
        ${{ formatNumber(row.current_price_usd, 3) }}
      </span>
    </template>
  </el-table-column>


  
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
</style>