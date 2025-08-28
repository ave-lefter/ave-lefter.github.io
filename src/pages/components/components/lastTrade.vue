<script setup lang="ts">
import dayjs from 'dayjs'

const props = defineProps<{
  row: any
}>()

const last_trade_at_unix = computed(() => {
  return dayjs(props.row.last_trade_at).unix()
})
function getColor() {
  if (Number(formatTimeFromNow(last_trade_at_unix.value || 0, true)) <= 600) {
    return 'color-[--yellow]'
  }
  return 'color-[--secondary-text]'
}
</script>
<template>
  <div v-tooltip="formatDate(last_trade_at_unix,'YYYY-MM-DD HH:mm:ss')" :class="getColor()">
    <template v-if="!row.last_trade_at"> - </template>
    <template v-else-if="Number(formatTimeFromNow(last_trade_at_unix, true)) >= 60">
      {{ formatTimeFromNow(last_trade_at_unix) }}
    </template>
    <TimerCount v-else :key="last_trade_at_unix" :timestamp="last_trade_at_unix" :end-time="60">
      <template #default="{ seconds }">
        <span>
          <template v-if="seconds < 60"> {{ seconds }}s </template>
          <template v-else>
            {{  formatTimeFromNow(last_trade_at_unix) }}
          </template>
        </span>
      </template>
    </TimerCount>
  </div>
</template>
