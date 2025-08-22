<script setup lang="ts">
defineProps<{
  row: any
}>()

const globalStore = useGlobalStore()
</script>
<template>
  <div class="flex justify-end">
    <QuickSwapButton
      buttonBg="var(--up-color)"
      :quickBuyValue="globalStore.rankCommon.quickBuyValue"
      :row="row"
      styles="--el-color-black: var(--main-text);--el-button-disabled-text-color: var(--main-text);"
      class-names="text-14px w-59px h-28px"
    >
      <template #default="{loading}">
        <Icon v-if="!loading" class="mr-4px" name="mynaui:lightning-solid" />
        {{ $t('buy') }}
      </template>
    </QuickSwapButton>
  </div>
</template>
