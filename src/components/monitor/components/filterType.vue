
<template>
<el-dropdown trigger="click" popper-class="w-filterType">
    <Icon
      id="custom-filter"
      name="custom:filter"
      class="text-12px cursor-pointer color-[--secondary-text]"
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

<style lang="scss">
.w-filterType{
  --el-font-weight-primary:400;
  --el-checkbox-height: 34px;
  padding: 2px 12px !important;
  .el-checkbox{
    margin-right: 0px;
    color:var(--third-text);
  }
  .el-checkbox__input.is-checked + .el-checkbox__label{
    color:var(--main-text);
  }
}
</style>
