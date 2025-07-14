<script setup lang="ts">
defineProps<{
  quickBuyValue: string;
}>()
</script>
<template>
  <el-table-column
    :key="$t('quick')"
    :label="$t('quick')"
    :min-width="getTextWidth(quickBuyValue, 20) + 70"
    align="right"
    fixed="right"
  >
    <template #default="{ row }">
      <QuickSwapButton
        buttonBg="#12B886"
        :quickBuyValue="quickBuyValue"
        :row="row"
        styles="--el-color-black: #fff"
      >
        <Icon class="mr-4px" name="mynaui:lightning-solid" />
        {{ $t("buy") }}
      </QuickSwapButton>
    </template>
  </el-table-column>
</template>
