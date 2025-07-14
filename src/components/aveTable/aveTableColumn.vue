<script lang="ts" setup>
defineProps<{
  title?: string
  minWidth: number
}>()

defineSlots<{
  default(props: { row:any; column:any; rowIndex:number; columnIndex:number }): any
  header(props: { column:any }): any
}>()
</script>

<template>
  <slot />
</template>
