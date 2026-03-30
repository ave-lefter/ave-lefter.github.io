<script setup lang="ts">
const props = defineProps({
  columns: {
    type: Array<{ label: string, value: string, flex: string, sort: boolean,currentMode?: string }>,
    default: () => []
  },
  sort: {
    type: Object,
    default: () => ({})
  },
  toggleMode: {
    type: Function,
    default: () => {}
  }
})
const emit = defineEmits(['update:sort'])
const slots = useSlots()
function getActiveClass(activeSort: number, sortBy: string, direction: string) {
  const isEqual = props.sort.activeSort === activeSort && props.sort.sortBy === sortBy
  if (direction === 't') {
    return isEqual
      ? 'border-t-[--main-text]'
      : 'border-t-[--third-text]'
  }
  return isEqual
    ? 'border-b-[--main-text]'
    : 'border-b-[--third-text]'
}

const statusTo = {
  0: 1,
  1: -1,
  '-1': 0
}

function switchSort(sortBy: string, activeSort?: number) {
  const sort = {...props.sort}
  if (!activeSort) {
    if (sort.sortBy !== sortBy) {
      sort.activeSort = 1
    } else {
      sort.activeSort = statusTo[sort.activeSort as 0 | 1 | '-1']
    }
  } else {
    sort.activeSort = activeSort
  }
  sort.sortBy = sortBy
  console.log('sortBy',sort, sortBy, activeSort)
  emit('update:sort', sort)
}
</script>

<template>
  <div
    class="flex justify-between items-center px-12px py-8px text-12px h-32px color-[--third-text]"
  >
    <div
      v-for="(column, i) in columns"
      :key="i"
      :class="`flex items-center cursor-pointer ${column.flex}`"
      @click.stop="switchSort(column.value)">
      <template v-if="column.label">
        <template v-if="!column.currentMode">
          {{ column.label }}
        </template>
        <template v-else>
          <div v-for="(c, i) in column.label.split(`{currentMode}`)" class="flex items-center" :key="i">
            <span v-if="i===0" @click.stop="toggleMode(column.currentMode)">{{ c }}</span> 
            <span v-else>{{ c }}</span> 
            <Icon name="custom:arrow-switch" class="text-16px" v-if="i === 0" @click.stop="toggleMode(column.currentMode)" />
          </div>
        </template>
      </template>
      <slot v-else :name="column.value"/>
      <div v-if="column.sort" class="flex flex-col items-center justify-center ml-5px">
        <i
          :class="`w-0 h-0 border-solid border-4px border-transparent cursor-pointer
            ${getActiveClass(-1,column.value,'b') }
            `"
          @click.stop="switchSort(column.value, -1)"
        />
        <i
          :class="`w-0 h-0 border-solid border-4px border-transparent mt-3px cursor-pointer
            ${getActiveClass(1,column.value,'t') }
            `"
          @click.stop="switchSort(column.value, 1)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
