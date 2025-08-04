<template>
  <div v-if="dataSource.length" class="w-100% h-20px flex items-center">
    <div v-for="(item, index) in dataSource" :key="index" class="flex items-center justify-center">
      <div class="w-20px h-20px border-rd-[50%] border-1px flex items-center justify-center font-500 text-12px color-#999 bg-[--d-222-l-F2F2F2] mr-8px" :class="{'bg-#3F80F7! color-#FFF!':active===index+1}">{{ index+1 }}</div>
      <div class="font-400 text-14px color-[--d-666-l-999] font-Inter" :class="{'color-[--d-F5F5F5-l-333]':active===index+1}">{{ item }}</div>
      <div v-if="index !== dataSource.length-1" class="flex items-center justify-center w-52px">
        <Icon name="material-symbols:chevron-right-rounded" class="text-18px mr--5px color-[--d-666-l-999]"/>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  active: number | string
  dataSource: string[]
}>()
</script>
