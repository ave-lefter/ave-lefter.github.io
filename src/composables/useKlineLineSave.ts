import * as Comlink from 'comlink'
// @ts-ignore
import ChartWorker from '@/workers/chartState.worker?worker'

const workerInstance = new ChartWorker()
const chartApi = Comlink.wrap<any>(workerInstance)

export function useKlineLineSave(getKey: () => string, rootKey: string = 'tv_charts_storage') {

  /**
   * 内部同步当前的 Storage Key 到 Worker
   */
  async function syncKey() {
    await chartApi.setStorageKey(rootKey)
  }

  async function loadKlineLine(widget: any) {
    await syncKey()
    const subKey = getKey ? getKey() : 'default'

    const allStates: any = await chartApi.getFullStorage()

    // 加载画图工具数据
    if (allStates[subKey] && widget) {
      widget.load?.(allStates[subKey])
    }

    // 加载指标
    let allStudies: Array<string> = allStates['allStudies'] || []
    if (allStudies.length > 0 && widget?.activeChart?.()) {
      // 如果有画图工具数据，延迟加载指标以防渲染冲突
      const delay = allStates[subKey] ? 500 : 0
      setTimeout(() => {
        addStudy(allStudies, widget?.activeChart?.())
      }, delay)
    }
  }

  function addStudy(allStudies: Array<string>, chart: any) {
    const currentStudies = chart.getAllStudies()
    // 过滤掉已经在图表上的指标，避免重复创建
    const newStudies = allStudies?.filter(s => !currentStudies.some((cs: any) => cs.name === s))
    const removeStudies: Array<{name: string; id: string}> = currentStudies?.filter((cs: any) => !allStudies.includes(cs.name) && cs.name !== 'Volume')
    // 先移除不需要的指标
    removeStudies.forEach(study => {
      if (!study.name.includes('Volume')) {
        chart.removeEntity(study.id)
      }
    })
    newStudies.forEach(s => {
      chart.createStudy(s, false, false)
    })
  }

  function saveKlineState(widget: any) {
    widget?.subscribe?.('onAutoSaveNeeded', () => {
      widget?.save(async (chartObj: any) => {
        await syncKey()
        const subKey = getKey ? getKey() : 'default'
        const result = await chartApi.saveChart(subKey, chartObj)
        console.log(`[Chart-Storage] ${result.status}: ${subKey} (Root: ${rootKey})`)
      })
    })
  }

  async function removeCurrentChart() {
    await syncKey()
    const subKey = getKey ? getKey() : 'default'
    const success = await chartApi.removeChart(subKey)
    if (success) console.log(`[Chart-Storage] 已删除: ${subKey} @ ${rootKey}`)
  }

  return {
    loadKlineLine,
    saveKlineState,
    removeCurrentChart,
    clearAllCharts: async () => {
      await syncKey()
      return chartApi.clearAll()
    }
  }
}
