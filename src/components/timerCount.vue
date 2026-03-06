<template>
  <slot v-bind="timerContext">
    <span>{{ timerContext.formatted }}</span>
  </slot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

interface TimerContext {
  seconds: number
  formatted: string
  formattedData: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

type TimerMode = 'auto' | 'count-up' | 'count-down'

const props = withDefaults(defineProps<{
  mode?: TimerMode        // 计时模式
  autoStart?: boolean     // 是否自动开始
  startTime?: number      // 正计时起始偏移（秒）
  timestamp?: number      // 目标时间戳（秒）
  endTime?: number        // 结束目标（秒，正计时有效）
  format?: string | ((totalSeconds: number) => string)
}>(), {
  mode: 'auto',
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

// 状态变量
const isRunning = ref(false)
const elapsedTimeMs = ref(0)
const isCountdownMode = ref(false)
let rafId: ReturnType<typeof requestAnimationFrame> | null = null
let startTimestamp = 0 // 系统基准时间戳
let lastSecond = -1

// 辅助函数
const currentTimeMs = () => Date.now()
const pad = (n: number) => n.toString().padStart(2, '0')

/**
 * 核心初始化逻辑：计算初始时间并确定计时方向
 */
function initTimer() {
  const now = currentTimeMs()

  // 1. 确定方向
  if (props.mode === 'count-down') {
    isCountdownMode.value = true
  } else if (props.mode === 'count-up') {
    isCountdownMode.value = false
  } else {
    // auto 模式逻辑
    isCountdownMode.value = !!(props.timestamp && props.timestamp * 1000 > now)
  }

  // 2. 设置初始毫秒数（负值强制归零）
  if (isCountdownMode.value) {
    const target = (props.timestamp || 0) * 1000
    elapsedTimeMs.value = Math.max(0, target - now)
  } else {
    if (props.timestamp !== undefined) {
      // 若提供 timestamp 且为正计时，计算已过去多久
      elapsedTimeMs.value = Math.max(0, now - props.timestamp * 1000)
    } else {
      // 否则使用普通的 startTime
      elapsedTimeMs.value = Math.max(0, props.startTime * 1000)
    }
  }
}

/**
 * 获取分解后的时间数据
 */
function getTimeData(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return { days, hours, minutes, seconds }
}

/**
 * 计算属性：暴露给插槽的对象
 */
const timerContext = computed<TimerContext>(() => {
  const totalSeconds = Math.floor(elapsedTimeMs.value / 1000)
  const data = getTimeData(totalSeconds)

  let formatted = ''
  if (typeof props.format === 'function') {
    formatted = props.format(totalSeconds)
  } else {
    const map: Record<string, string | number> = {
      'DD': pad(data.days), 'D': data.days,
      'HH': pad(data.hours), 'H': data.hours,
      'mm': pad(data.minutes), 'm': data.minutes,
      'ss': pad(data.seconds), 's': data.seconds,
    }
    formatted = props.format.replace(/DD|D|HH|H|mm|m|ss|s/g, (m) => String(map[m]))
  }

  return {
    seconds: totalSeconds,
    formatted,
    formattedData: data
  }
})

/**
 * 开始/继续计时
 */
function start() {
  if (isRunning.value) return

  // 重新校准基准点，确保暂停后继续的准确性
  if (isCountdownMode.value) {
    // 倒计时基准点即为目标时间
    // 逻辑在 update 中通过 props.timestamp 处理
  } else {
    // 正计时基准点 = 当前系统时间 - 已流逝的时间
    startTimestamp = currentTimeMs() - elapsedTimeMs.value
  }

  isRunning.value = true

  const update = () => {
    if (!isRunning.value) return

    const now = currentTimeMs()

    if (isCountdownMode.value) {
      const target = (props.timestamp || 0) * 1000
      const diff = target - now
      if (diff <= 0) {
        elapsedTimeMs.value = 0
        handleEnd()
        return
      }
      elapsedTimeMs.value = diff
    } else {
      const diff = now - startTimestamp
      if (props.endTime !== undefined && diff >= props.endTime * 1000) {
        elapsedTimeMs.value = props.endTime * 1000
        handleEnd()
        return
      }
      elapsedTimeMs.value = diff
    }

    // 秒级触发 update 事件
    const currentSec = Math.floor(elapsedTimeMs.value / 1000)
    if (currentSec !== lastSecond) {
      lastSecond = currentSec
      emit('update:seconds', currentSec)
    }

    rafId = requestAnimationFrame(update)
  }

  rafId = requestAnimationFrame(update)
}

function handleEnd() {
  stop()
  emit('update:seconds', Math.floor(elapsedTimeMs.value / 1000))
  emit('done')
}

function stop() {
  isRunning.value = false
  if (rafId) cancelAnimationFrame(rafId)
}

function reset() {
  stop()
  initTimer()
  lastSecond = -1
  emit('update:seconds', Math.floor(elapsedTimeMs.value / 1000))
  if (props.autoStart) start()
}

// 监听配置变化
watch(() => [props.timestamp, props.mode, props.startTime], () => {
  reset()
})

onMounted(() => {
  initTimer()
  if (props.autoStart) start()
})

onUnmounted(stop)

// 暴露 API 给父组件
defineExpose({ start, stop, reset, isRunning })
</script>
