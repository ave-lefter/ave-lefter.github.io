
<template>
  <el-dropdown trigger="click">
    <Icon
      id="custom-filter"
      name="custom:filter"
      class="text-12px cursor-pointer"
    />
  <template #dropdown>
      <checkbox-group v-model="modelValue" :options="props.options"/>
  </template>
</el-dropdown>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Array as () => (number | string)[],
    default: () => []
  },
  options: {
    type: Array as () => { label: string, value: number | string }[],
    default: () => []
  }
})
const modelValue = computed({
  get: () => props.modelValue,
  set: (val: (number | string)[]) => emit('update:modelValue', val)
})
const emit = defineEmits<{
  (e: 'update:modelValue', val: (number | string)[]): void
}>()
</script>

<style scoped lang="scss">
</style>
