<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>
<template>
  <span
    :class="
      Number(row?.dev_balance_ratio_cur || 0) < 0.1
        ? 'color-[--d-666-l-999]'
        : row?.dev_balance_ratio_cur > 10
          ? 'color-#FFA622'
          : ''
    "
  >
    {{
      row?.dev_balance_ratio_cur > 0 && row?.dev_balance_ratio_cur < 0.1
        ? '<0.1'
        : formatNumber(row?.dev_balance_ratio_cur || 0, 1)
    }}%
  </span>
</template>
