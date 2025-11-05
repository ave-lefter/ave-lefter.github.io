<template>
  <Icon v-if="type === 2" name="iconamoon:profile" class="color-#009EF7" />
  <Icon v-else-if="type === 3" name="custom:x-community" class="color-#009EF7" />
  <Icon v-else-if="type === 1" name="custom:x-tweet" class="color-#009EF7" />
</template>

<script setup lang='ts'>
defineProps({
  type: {
    type: Number as PropType<0 | 1 | 2 | 3>,
    default: 0
  }
})


</script>

<style>

</style>
