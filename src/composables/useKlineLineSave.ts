import localforage from 'localforage'

const STORAGE_ROOT_KEY = 'tv_charts_storage'
const MAX_STORAGE_COUNT = 100

export function useKlineLineSave(getKey?: () => string, prefix = 'tv_lineTool') {

  async function getFullStorage() {
    const data = await localforage.getItem<Record<string, any>>(STORAGE_ROOT_KEY)
    return data || {}
  }

  function loadKlineLine(widget: any) {
    const subKey = prefix + (getKey ? getKey() : 'default')
    getFullStorage().then((allStates) => {
      const savedState = allStates[subKey]
      if (savedState && widget) {
        try {
          widget.load?.(savedState)
          console.log(`[TV-Storage] 加载成功: ${subKey}`)
        } catch (e) {
          console.error('[TV-Storage] 加载失败:', e)
        }
      }
    })
  }

  function saveKlineState(widget: any) {
    widget?.subscribe?.('onAutoSaveNeeded', () => {
      if (!widget) return

      widget.save(async (chartObj: any) => {
        const subKey = prefix + (getKey ? getKey() : 'default')
        try {
          // --- 判定逻辑：检查是否存在“除 Volume 以外”的有效内容 ---
          let hasValuableContent = false

          chartObj.charts.forEach((chart: any) => {
            chart.panes.forEach((pane: any) => {
              pane.sources.forEach((source: any) => {
                console.log('source type:', source.type)
                // 1. 判定划线
                if (source.type?.includes('LineTool')) {
                  hasValuableContent = true
                }
                // 2. 判定非 Volume 指标
                if (new RegExp('study', 'i').test(source.type) && !new RegExp('volume', 'i').test(source.type)) {
                  hasValuableContent = true
                }
              })
            })
          })

          const allStates = await getFullStorage()

          // --- 准入检查 ---
          if (!hasValuableContent) {
            // 如果原本存过，但现在变“干净”了，则从大对象中移除该 Key
            if (allStates[subKey]) {
              delete allStates[subKey]
              await localforage.setItem(STORAGE_ROOT_KEY, allStates)
              console.log(`[TV-Storage] 无有效内容，已清理记录: ${subKey}`)
            }
            return
          }

          // 3. 完整保存（不进行任何过滤，保持原始 chartObj 结构）
          allStates[subKey] = {
            ...chartObj,
            _lastModified: Date.now()
          }

          // 4. LRU 自动清理过期记录
          const keys = Object.keys(allStates)
          if (keys.length > MAX_STORAGE_COUNT) {
            const oldestKey = keys.reduce((a, b) =>
              (allStates[a]._lastModified || 0) < (allStates[b]._lastModified || 0) ? a : b
            )
            delete allStates[oldestKey]
          }

          await localforage.setItem(STORAGE_ROOT_KEY, allStates)
          console.log(`[TV-Storage] 成功存入有效配置: ${subKey}`)
        } catch (err) {
          console.error('[TV-Storage] 保存异常:', err)
        }
      })
    })
  }

  const clearAllCharts = () => localforage.removeItem(STORAGE_ROOT_KEY)

  return { loadKlineLine, saveKlineState, clearAllCharts }
}
