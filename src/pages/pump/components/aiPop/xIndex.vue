<template>
  <div class="w-308px bg-[--main-input-button-bg] px-12px py-12px">
    <component :is="Content" :score="score" :summary="summary" />
  </div>
</template>

<script setup lang='ts'>
import Content from './content.vue'

const props = defineProps({
  score: {
    type: Number,
    default: 1
  },
  summary: {
    type: String,
    default:'',
  }
})
</script>

<style>

</style>
