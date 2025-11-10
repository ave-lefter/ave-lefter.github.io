<script setup lang="ts">
const {t} = useI18n()
const selectButton = ref(1)
const selectType = ref('1W')
const buttons = computed(()=>{
  return [
    {label:t('accountBalance'),value:1},
    {label:t('pnl'),value:2},
  ]
})
const typeList = computed(()=>{
  return [
    {label:'1W',value:'1W'},
    {label:'1M',value:'1M'},
    {label:'3M',value:'3M'},
    {label:'6M',value:'6M'},
    {label:'1Y',value:'1Y'},
  ]
})
const changeSelectButton = (value:number)=>{
  selectButton.value = value
}
const changeSelectType = (value:string)=>{
  selectType.value = value
}
</script>

<template>
  <div class="px-16px py-24px w-480px bg-[--secondary-bg] flex-1">
    <div class="flex justify-between">
      <div class="flex items-center p-4px bg-[--main-input-button-bg]">
        <span v-for="el in buttons" :key="el.value" class="text-12px px-8px lh-24px color-[--third-text] cursor-pointer" :class="{'[&&]:color-[--main-text] bg-[--tab-active-bg]':el.value === selectButton}" @click="changeSelectButton(el.value)">{{ el.label }}</span>
      </div>
      <div class="flex items-center p-4px bg-[--main-input-button-bg]">
        <span v-for="el in typeList" :key="el.value" class="text-12px px-8px lh-24px color-[--third-text] cursor-pointer" :class="{'[&&]:color-[--main-text] bg-[--tab-active-bg]':el.value === selectType}" @click="changeSelectType(el.value)">{{ el.label }}</span>
      </div>
    </div>
  </div>
</template>