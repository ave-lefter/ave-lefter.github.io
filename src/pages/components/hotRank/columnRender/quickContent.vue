<script setup lang="ts">
defineProps<{
  row: any
}>()

const globalStore = useGlobalStore()
</script>
<template>
  <div class="flex justify-end">
    <QuickSwapButton
      buttonBg="#12B886"
      :quickBuyValue="globalStore.rankCommon.quickBuyValue"
      :row="row"
      styles="--el-color-black: #FFF;--el-button-disabled-text-color: #FFF;"
      class-names="text-14px w-59px h-28px"
    >
      <Icon class="mr-4px" name="mynaui:lightning-solid" />
      {{ $t('buy') }}
    </QuickSwapButton>
  </div>
</template>
