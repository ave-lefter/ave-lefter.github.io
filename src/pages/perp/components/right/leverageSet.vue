<template>
  <div class="flex items-center gap-16px color-[--main-text] text-12px font-500 text-center">
    <div class="flex-1 h-24px flex items-center justify-center bg-[--main-input-button-bg] border-none rd-4px">全仓模式</div>
    <button class="flex-1 color-[--main-text] h-24px flex items-center justify-center bg-[--main-input-button-bg] border-none rd-4px relative clickable">
      <span>{{ maxLeverage }}x</span>
      <Icon name="radix-icons:triangle-down" class="text-16px absolute right-10px top-50% translate-y--50% color-[--main-text]" />
    </button>
  </div>
</template>

<script setup lang='ts'>
import { usePerpStore } from '~/stores/perp'

const perpStore = usePerpStore()

const maxLeverage = computed(() => {
  const contractId = perpStore.perp?.contractId || ''
  return getLeverageFromContractId(contractId)
})

</script>

<style>

</style>
