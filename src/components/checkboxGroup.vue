<template>
   <el-checkbox
      v-if="props.options.length&&props.all"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      :disabled="checkAll"
      @change="handleCheckAllChange"

    >
      {{ $t('all') }}
    </el-checkbox>
    <el-checkbox-group
      v-model="modelValue"  
      :class="[!props.inline?'flex flex-col':'flex flex-row']"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox v-for="city in props.options" :key="city.value" :label="city.label" :value="city.value">
        {{ city.label }}
      </el-checkbox>
    </el-checkbox-group>
</template>
<script setup lang="ts">
import type {CheckboxValueType} from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Array as () => (number | string)[],
    default: () => []
  },
  options: {
    type: Array as () => { label: string, value: number | string }[],
    default: () => []
  },
  inline: {
    type: Boolean,
    default: false
  },
  all: {
    type: Boolean,
    default: true
  }
})
const modelValue = computed({
  get: () => props.modelValue,
  set: (val: (number | string)[]) => emit('update:modelValue', val)
})
const emit = defineEmits<{
  (e: 'update:modelValue', val: (number | string)[]): void
}>()
const checkAll = ref(false)
const isIndeterminate = ref(true)
const handleCheckAllChange = (val: CheckboxValueType) => {
  modelValue.value = val ? props.options.map(i => i.value) : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  if(!props.all) return
  console.log('handleCheckedCitiesChange',value)
  const checkedCount = value.length
  checkAll.value = checkedCount === props.options.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < props.options.length
}
</script>

<style scoped lang="scss">
</style>
