<script setup lang="ts">
defineProps<{
  row: any
}>()
function getColorClass(row) {
  const holders = row.holders || 0
  const tokenAge = getTokenAge(row.created_at)

  if ((holders > 1000 && tokenAge < 86400) || (holders > 10000 && tokenAge < 604800)) {
    return 'color-#FFA622'
  }
}
function getTokenAge(listingTime: number) {
  if (!listingTime) return Infinity
  const listingDate = new Date(listingTime)
  const now = new Date()
  return Math.floor((now.valueOf() - listingDate.valueOf()) / 1000)
}
</script>

<template>
  <div :class="getColorClass(row)">
    {{
      formatNumber(row.holders || 0, {
        decimals: 0,
        limit: 20,
      })
    }}
  </div>
</template>
