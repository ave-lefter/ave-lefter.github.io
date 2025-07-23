<script setup lang="ts">
defineProps<{
  row: any
}>()

function getColor(score:number) {
  if (score > 60) {
    return '#1CC982'
  } else if (score > 30) {
    return '#4AD49B'
  } else {
    return '#77DFB4'
  }
}
</script>
<template>
  <div v-if="row.progress <= 100" class="flex flex-1 flex-col items-end">
    {{ formatNumber(row.progress || 0, 1) }}%
    <el-progress
      class="mt-5px w-50px"
      :percentage="row?.progress"
      :stroke-width="4"
      :color="getColor(row.progress)"
      :show-text="false"
    />
  </div>
</template>
