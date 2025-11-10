<script setup lang="ts">
const {t} = useI18n()
const selectButton = ref(1)
const buttons = computed(()=>{
  return [
    {label:t('accountBalance'),value:1},
    {label:t('pnl'),value:2},
  ]
})
const changeSelectButton = (value:number)=>{
  selectButton.value = value
}
</script>

<template>
  <div class="px-16px py-24px w-480px bg-[--secondary-bg] flex-1">
    <div class="flex justify-between">
      <div class="flex items-center p-4px bg-[--main-input-button-bg]">
        <span v-for="el in buttons" :key="el.value" class="text-12px px-8px lh-24px color-[--third-text] cursor-pointer" :class="{'[&&]:color-[--main-text] bg-[--tab-active-bg]':el.value === selectButton}" @click="changeSelectButton(el.value)">{{ el.label }}</span>
      </div>
    </div>
  </div>
</template>