import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useTradingNetwork(wsv2Store: any) {
  const latency = ref(0)
  const offset = ref(0)
  const status = ref<'stable' | 'unstable'>('stable')
  const connected = ref(false)

  let heartbeatTimer: any = null
  let id = 1

  const samples: { rtt: number; offset: number }[] = []
  const jitterBuffer: number[] = []

  let lastHeartbeatTime = 0
  let lastInterval = 5000

  // ---------------- interval ----------------
  function getInterval() {
    if (latency.value > 300) return 1000
    if (latency.value > 150) return 3000
    return 5000
  }

  function startHeartbeat() {
    stopHeartbeat()

    heartbeatTimer = setInterval(() => {
      wsv2Store.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'subscribe',
          params: ['heartbeat', { client_ts: Date.now() }],
          id: id++,
        })
      )
    }, getInterval())
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // ---------------- heartbeat ----------------
  function handleHeartbeat(val: any) {
    if (!val?.server_ts || !val?.client_ts) return

    const now = Date.now()

    const rtt = now - val.client_ts
    if (rtt > 2000) return // 防异常

    const oneWay = rtt / 2

    latency.value = Math.floor(oneWay)

    // 更新时间
    lastHeartbeatTime = now
    connected.value = true

    const off = val.server_ts - (val.client_ts + oneWay)

    samples.push({ rtt, offset: off })
    if (samples.length > 10) samples.shift()

    const best = samples.reduce((a, b) => (a.rtt < b.rtt ? a : b))

    offset.value = Math.floor(best.offset)

    // jitter
    jitterBuffer.push(oneWay)
    if (jitterBuffer.length > 6) jitterBuffer.shift()

    const avg = jitterBuffer.reduce((a, b) => a + b, 0) / jitterBuffer.length

    const variance = jitterBuffer.reduce((s, x) => s + (x - avg) ** 2, 0) / jitterBuffer.length

    const threshold = latency.value < 100 ? 20 : 50
    status.value = variance < threshold ? 'stable' : 'unstable'

    restartHeartbeatIfNeeded()
  }

  // ---------------- reconnect safety ----------------
  setInterval(() => {
    if (Date.now() - lastHeartbeatTime > 15000) {
      connected.value = false
    }
  }, 3000)

  // ---------------- adaptive ----------------
  function restartHeartbeatIfNeeded() {
    const next = getInterval()

    if (next !== lastInterval) {
      lastInterval = next
      startHeartbeat()
    }
  }

  const level = computed(() => {
    if (!connected.value) return 'disconnected'
    if (latency.value < 300) return 'stable'
    if (latency.value < 500) return 'unstable'
    if (status.value === 'unstable') return 'unstable'
    return 'unstable'
  })

  const label = computed(() => {
    switch (level.value) {
      case 'stable':
        return 'Stable'
      case 'unstable':
        return 'Unstable'
      default:
        return 'Disconnected'
    }
  })

  const fps = ref(0)
  let rafId: ReturnType<typeof requestAnimationFrame> | null = null
  let frameCount = 0
  let lastTime = performance.now()

  function loop() {
    frameCount++

    const now = performance.now()
    const delta = now - lastTime

    if (delta >= 1000) {
      fps.value = Math.round((frameCount * 1000) / delta)
      frameCount = 0
      lastTime = now
    }

    rafId = requestAnimationFrame(loop)
  }

  watch(
    () => wsv2Store.wsResult?.[WSEventV2Type.HEARTBEAT],
    (val) => {
      if (val) handleHeartbeat(val)
    },
    { deep: true }
  )
  onMounted(() => {
    startHeartbeat()
    loop()
  })

  onUnmounted(() => {
    stopHeartbeat()
    if (rafId) cancelAnimationFrame(rafId)
  })

  return {
    latency,
    offset,
    status,
    connected,
    level,
    label,
    handleHeartbeat,
    fps,
  }
}
