<!--
 * @Date: 2025-07-26 10:17:33
 * @LastEditors: Lewis
 * @FilePath: /ave_web/src/pages/components/components/devContent.vue
 * @Description: In User Settings Edit
-->
<script setup lang="ts">
defineProps<{
  row: any
}>()
</script>
<template>
  <span
    :class="
      Number(row?.dev_balance_ratio_cur || 0) < 0.1
        ? 'color-[--secondary-text]'
        : row?.dev_balance_ratio_cur > 10
          ? 'color-[--yellow]'
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
