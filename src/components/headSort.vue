<template>
  <span class="flex flex-col items-center justify-center" @click="handleSort('')">
    <Icon
      name="custom:sort-up"
      class="text-4px mb-1px cursor-pointer"
      :class="sortOrder==='ascending' ? 'color-[--d-F5F5F5-l-333]' : 'color-[--d-666-l-999]'"
      @click.self.stop="handleSort('ascending')"
    />
    <Icon
      name="custom:sort-up"
       class="text-4px mb-1px rotate-180 cursor-pointer"
      :class="sortOrder==='descending' ? 'color-[--d-F5F5F5-l-333]' : 'color-[--d-666-l-999]'"
      @click.self.stop="handleSort('descending')"
    />
  </span>
</template>

<script setup>
const props = defineProps({
  defaultSort: {
    type: String,
    default: '',
    validator: (value) => ['ascending', 'descending', ''].includes(value),
  },
})

const emit = defineEmits(['sort-change'])

const sortOrder = ref(props.defaultSort)

watch(
  () => props.defaultSort,
  (val) => {
    if (!val) {
      sortOrder.value = ''
    }
  }
)

const handleSort = (sort) => {
  if (sort) {
    if (sortOrder.value === sort) {
      sortOrder.value = ''
    } else {
      sortOrder.value = sort
    }
  } else {
    if (!sortOrder.value) {
      sortOrder.value = 'ascending'
    } else if (sortOrder.value === 'ascending') {
      sortOrder.value = 'descending'
    } else {
      sortOrder.value = ''
    }
  }
  emit('sort-change', sortOrder.value)
}
</script>

<style>
:root {
  --head-sort-color: #333;
}

.dark {
  --head-sort-color: #fff;
}
</style>

<style scoped>
</style>
