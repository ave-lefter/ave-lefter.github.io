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
        :class="!row.current_price_usd ? 'color-text-3' : ''"
      >
        ${{ $f.formatNumber2(row.current_price_usd, 3) }}
      </span>
    </template>
  </el-table-column>


  
</template>

<script>
export default {
  name: "priceContent"
}
</script>

<style lang="scss" scoped>
.color-text-3 {
  color: var(--a-text-3-color);
}
</style>