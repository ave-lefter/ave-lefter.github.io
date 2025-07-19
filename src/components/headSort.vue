<template>
  <span class="flex flex-col items-center justify-center" @click="handleSort('')">
    <Icon
      name="custom:sort-up"
      class="text-4px cursor-pointer"
      :class="sortOrder==='asc' ? 'color-[--d-F5F5F5-l-333]' : 'color-[--d-666-l-999]'"
      @click.self.stop="handleSort('asc')"
    />
    <Icon
      name="custom:sort-up"
       class="text-4px mt-1px rotate-180 cursor-pointer"
      :class="sortOrder==='desc' ? 'color-[--d-F5F5F5-l-333]' : 'color-[--d-666-l-999]'"
      @click.self.stop="handleSort('desc')"
    />
  </span>
</template>

<script setup>
const props = defineProps({
  defaultSort: {
    type: String,
    default: '',
    validator: (value) => ['asc', 'desc', ''].includes(value),
  },
})

const emit = defineEmits(['sort-change'])

const sortOrder = ref(props.defaultSort)

watch(
  () => props.defaultSort,
  (val) => {
    if (!val) {
      sortOrder.value = ''
    } else if(props.defaultSort !==sortOrder.value){
      sortOrder.value = props.defaultSort
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
      sortOrder.value = 'asc'
    } else if (sortOrder.value === 'asc') {
      sortOrder.value = 'desc'
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
