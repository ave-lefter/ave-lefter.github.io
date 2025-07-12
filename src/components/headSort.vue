<template>
  <span class="caret-wrapper" @click="handleSort('')">
    <i
class="sort-caret ascending" :class="sortOrder === 'ascending' ? 'active' : ''"
       @click.stop="handleSort('ascending')"/>
    <i
class="sort-caret descending" :class="sortOrder === 'descending' ? 'active' : ''"
       @click.stop="handleSort('descending')"/>
  </span>
</template>

<script setup>
const props = defineProps({
  defaultSort: {
    type: String,
    default: '',
    validator: (value) => ['ascending', 'descending', ''].includes(value)
  }
})

const emit = defineEmits(['sort-change'])

const sortOrder = ref(props.defaultSort)

watch(()=>props.defaultSort,(val)=>{
  if(!val){
    sortOrder.value = ''
  }
})

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
.caret-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  overflow: initial;
  position: relative;
  width: 9px;


  .sort-caret {
    width: 0;
    height: 0;
    border: solid 4px transparent;
    position: absolute;
    font-size: 14px;
    left: 1px;
  }

  .sort-caret.ascending {
    border-bottom-color: #a8abb2;
    top: -2px;
  }

  .sort-caret.descending {
    border-top-color: #a8abb2;
    bottom: -3px;
  }

  .sort-caret.ascending.active {
    border-bottom-color: var(--head-sort-color);
  }

  .sort-caret.descending.active {
    border-top-color: var(--head-sort-color);
  }
}
</style>
