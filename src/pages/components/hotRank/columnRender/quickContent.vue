<script setup lang="ts">
defineProps<{
  quickBuyValue: string
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
      <div class="flex justify-end">
        <QuickSwapButton
          buttonBg="#12B886"
          :quickBuyValue="quickBuyValue"
          :row="row"
          styles="--el-color-black: #FFF;--el-button-disabled-text-color: #FFF;"
          class-names="text-14px w-59px h-28px"
        >
          <Icon class="mr-4px" name="mynaui:lightning-solid" />
          {{ $t('buy') }}
        </QuickSwapButton>
      </div>
    </template>
  </el-table-column>
</template>
