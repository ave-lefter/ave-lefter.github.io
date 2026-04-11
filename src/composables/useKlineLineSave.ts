import * as Comlink from 'comlink'
// @ts-ignore
import ChartWorker from '@/workers/chartState.worker?worker'

// 单例模式：确保全局只有一个 Worker 进程和 saveQueue
const workerInstance = new ChartWorker()
const chartApi = Comlink.wrap<any>(workerInstance)

export function useKlineLineSave(getKey: () => string, rootKey: string = 'tv_charts_storage') {

  async function syncKey() {
    await chartApi.setStorageKey(rootKey)
  }

  async function addStudy(allStudies: Array<any>, chart: any) {
    const currentStudies = chart.getAllStudies()
    const storageNames = allStudies.map(s => s.name)

    // 1. 移除多余指标
    currentStudies.forEach((cs: any) => {
      if (cs.name !== 'Volume' && !storageNames.includes(cs.name)) {
        chart.removeEntity(cs.id)
      }
    })

    // 2. 顺序恢复指标（含自定义参数 inputs 和 样式 styles/overrides）
    for (const s of allStudies) {
      const exists = currentStudies.some((cs: any) => cs.name === s.name)
      if (!exists) {
        try {
          // 参数 4 是 inputs, 参数 5 是 overrides (包含扁平化的 styles)
          await chart.createStudy(s.name, false, false, s.inputs, s.styles)
        } catch (e) {
          console.error(`[Chart-Storage] 恢复指标 ${s.name} 失败:`, e)
        }
      }
    }
  }

  async function loadKlineLine(widget: any) {
    if (!widget) return
    await syncKey()

    const subKey = getKey ? getKey() : 'default'
    const allStates: any = await chartApi.getFullStorage()

    // 加载画图布局
    if (allStates[subKey] && widget.load) {
      widget.load(allStates[subKey])
    }

    // 加载全局指标
    const allStudies: Array<any> = allStates['allStudies'] || []
    const activeChart = widget.activeChart?.()

    if (allStudies.length > 0 && activeChart) {
      // 延迟 500-800ms 避开 TV 内部加载冲突
      const delay = allStates[subKey] ? 800 : 0
      setTimeout(() => {
        addStudy(allStudies, activeChart)
      }, delay)
    }
  }

  function saveKlineState(widget: any) {
    widget?.subscribe?.('onAutoSaveNeeded', () => {
      widget.save(async (chartObj: any) => {
        await syncKey()
        const subKey = getKey ? getKey() : 'default'
        const result = await chartApi.saveChart(subKey, chartObj)
        console.log(`[Chart-Storage] ${result.status}: ${subKey}`)
      })
    })
  }

  return {
    loadKlineLine,
    saveKlineState,
    removeCurrentChart: async () => {
      await syncKey()
      return chartApi.removeChart(getKey())
    },
    clearAllCharts: async () => {
      await syncKey()
      return chartApi.clearAll()
    }
  }
}
