<script lang="ts" setup>
defineProps<{
  row: any
}>()
</script>
<template>
  <span>
    {{
      row.insider_balance_ratio_cur > 0 && row.insider_balance_ratio_cur < 0.1
        ? '<0.1'
        : formatNumber(row.insider_balance_ratio_cur || 0, 1)
    }}%
  </span>
</template>
