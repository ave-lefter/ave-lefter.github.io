// composables/useMemorySentinel.ts
export const useMemorySentinel = (configs: {
  maxMB?: number
  maxRatio?: number
} = {}) => {
  if (process.server) return

  // 合并默认配置：1000MB 或 80% 比例
  const { maxMB = 1000, maxRatio = 0.8 } = configs
  const isDirty = useState('is_memory_dirty', () => false)

  const check = () => {
    const memory = (window.performance as any)?.memory
    if (!memory) return

    const usedMB = memory.usedJSHeapSize / 1024 / 1024
    const ratio = memory.usedJSHeapSize / memory.jsHeapSizeLimit

    // 触发条件：超过数值 OR 超过比例
    const isOverLimit = usedMB > maxMB || ratio > maxRatio
    // 预警逻辑：达到阈值的 70% 标记为脏环境
    const isWarning = usedMB > maxMB * 0.7 || ratio > maxRatio * 0.7

    if (isOverLimit) {
      console.warn(`【熔断】内存过载: ${usedMB.toFixed(2)}MB / ${(ratio * 100).toFixed(1)}%`)
      window.location.reload()
    } else if (isWarning) {
      isDirty.value = true
    }
  }

  const observer = new ReportingObserver((reports) => {
    for (const report of reports) {
      if (report.type === 'intervention') {
        isDirty.value = true
        window.location.reload()
      }
    }
  }, { types: ['intervention'], buffered: true })

  let timer: any
  onMounted(() => {
    observer.observe()
    timer = setInterval(check, 3000)
  })

  onUnmounted(() => {
    clearInterval(timer)
    observer.disconnect()
  })

  return { isDirty }
}
