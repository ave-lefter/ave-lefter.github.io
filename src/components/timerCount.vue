<template>
  <slot v-bind="timerContext">
    <span>{{ timerContext.formatted }}</span>
  </slot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface TimerContext {
  seconds: number
  formatted: string
  formattedData: {
    hours: number
    minutes: number
    seconds: number
    days: number
  }
}

const props = withDefaults(defineProps<{
  autoStart?: boolean
  startTime?: number
  timestamp?: number
  endTime?: number
  format?: string | ((totalSeconds: number) => string)
}>(), {
  autoStart: true,
  startTime: 0,
  timestamp: undefined,
  endTime: undefined,
  format: 'HH:mm:ss',
})

const emit = defineEmits<{
  (e: 'update:seconds', seconds: number): void
  (e: 'done'): void
}>()

// 是否为倒计时模式
const isCountdown = ref(false)
const countdownTargetMs = ref(0)

const now = Math.floor(Date.now() / 1000) * 1000
const currentTimeMs = () => Math.floor(Date.now() / 1000) * 1000

// 如果 timestamp 存在并且是将来的时间，则进入倒计时
if (props.timestamp !== undefined && props.timestamp * 1000 >= now) {
  isCountdown.value = true
  countdownTargetMs.value = props.timestamp * 1000
}

const startTimeMs = computed(() => {
  if (isCountdown.value) {
    return Math.max(0, countdownTargetMs.value - currentTimeMs())
  } else if (props.timestamp !== undefined) {
    return currentTimeMs() - props.timestamp * 1000
  }
  return (props.startTime ?? 0) * 1000
})

const endTimeMs = props.endTime !== undefined ? props.endTime * 1000 : undefined

const elapsedTimeMs = ref(startTimeMs.value)
const startTimestamp = ref(0)
const isRunning = ref(false)
let rafId: ReturnType<typeof requestAnimationFrame> | null = null
let lastSecond = -1

function pad(n: number, width = 2): string {
  return n.toString().padStart(width, '0')
}

function formatWithTemplate(ms: number, template: string): string {
  const totalSeconds = Math.floor(ms / 1000)

  const { days, hours, minutes, seconds } = getTimeDataFromSec(totalSeconds)

  const replaceMap: Record<string, string | number> = {
    'DD': pad(days),
    'D': days,
    'HH': pad(hours),
    'H': hours,
    'mm': pad(minutes),
    'm': minutes,
    'ss': pad(seconds),
    's': seconds,
  }

  return template.replace(/DD|D|HH|H|mm|m|ss|s/g, (match) => String(replaceMap[match]))
}

function getTimeDataFromSec(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds - days * 86400) / 3600)
  const r1 = totalSeconds - days * 86400 - hours * 3600
  const minutes = Math.floor(r1 / 60)
  const seconds = Math.floor(r1 - minutes * 60)

  return {
    days,
    hours,
    minutes,
    seconds
  }
}

const timerContext = computed<TimerContext>(() => {
  const ms = elapsedTimeMs.value
  const totalSeconds = Math.floor(ms / 1000)

  const { days, hours, minutes, seconds } = getTimeDataFromSec(totalSeconds)

  let formatted = ''
  if (typeof props.format === 'function') {
    formatted = props.format(totalSeconds)
  } else {
    formatted = formatWithTemplate(ms, props.format)
  }

  return {
    seconds: totalSeconds,
    formatted,
    formattedData: {
      days,
      hours,
      minutes,
      seconds
    }
  }
})

function start() {
  if (isRunning.value) return

  isRunning.value = true
  if (isCountdown.value) {
    elapsedTimeMs.value = countdownTargetMs.value - currentTimeMs()
  } else {
    elapsedTimeMs.value = startTimeMs.value
  }
  startTimestamp.value = currentTimeMs() - elapsedTimeMs.value
  lastSecond = timerContext.value.seconds

  const update = () => {
    if (!isRunning.value) return

    const now = currentTimeMs()
    if (isCountdown.value) {
      const remaining = countdownTargetMs.value - now
      if (remaining <= 0) {
        elapsedTimeMs.value = 0
        emit('update:seconds', 0)
        emit('done')
        stop()
        return
      }
      elapsedTimeMs.value = remaining
    } else {
      elapsedTimeMs.value = now - startTimestamp.value
      if (endTimeMs !== undefined && elapsedTimeMs.value >= endTimeMs) {
        elapsedTimeMs.value = endTimeMs
        emit('update:seconds', timerContext.value.seconds)
        stop()
        return
      }
    }

    const currentSecond = timerContext.value.seconds
    if (currentSecond !== lastSecond) {
      lastSecond = currentSecond
      emit('update:seconds', currentSecond)
    }

    rafId = requestAnimationFrame(update)
  }

  update()
}

function stop() {
  isRunning.value = false
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function reset() {
  stop()
  elapsedTimeMs.value = startTimeMs.value
  lastSecond = -1
  emit('update:seconds', timerContext.value.seconds)
}

defineExpose({ start, stop, reset })

onMounted(() => {
  if (props.autoStart) start()
})

onUnmounted(stop)
</script>
