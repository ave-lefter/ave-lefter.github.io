<script setup lang="ts">
const props = defineProps<{
  activeInterval: string
  row: any
}>()
const prefix = computed(() => `makers_${props.activeInterval}`)
function getHoldersColor(row) {
  return row[prefix.value] >= 1000 ? 'color-#FFA622' : ''
}

function getDetailColor(row, isBuyer) {
  const holders = row[prefix.value]
  if (holders < 1000) return ''
  return isBuyer ? 'color-#12B886' : 'color-#F6465D'
}
</script>
<template>
  <div>
    <div :class="getHoldersColor(row)">
      {{ row[prefix] > 0 ? formatNumber(row[prefix] || 0, 0) : 0 }}
    </div>
    <div class="color-[--d-666-l-999] text-12px">
      <span :class="getDetailColor(row, true)">
        {{ formatNumber(row[`buyers_${activeInterval}`] || 0,1) }} </span
      >/
      <span :class="getDetailColor(row, false)">
        {{ formatNumber(row[`sellers_${activeInterval}`] || 0,1) }}
      </span>
    </div>
  </div>
</template>
