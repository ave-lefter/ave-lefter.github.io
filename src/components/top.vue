<template>
  <div class="z-2 cursor-pointer fixed right-28px bottom-60px w-40px h-40px rounded-full bg-#566275 flex items-center justify-center" @click="emit('click')">
    <Icon name="custom:up" class="text-12px" @click.self="emit('click')"/>
  </div>
</template>

<script setup>
const emit = defineEmits(['click'])
</script>

<style scoped>

</style>