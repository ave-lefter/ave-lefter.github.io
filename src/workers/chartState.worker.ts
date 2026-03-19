import * as Comlink from 'comlink'
import localforage from 'localforage'
import { cloneDeep } from 'lodash-es'

let currentStorageKey = 'tv_charts_storage'
const MAX_STORAGE_COUNT = 100

const chartStorageService = {
  /**
   * 动态设置存储的 Root Key
   */
  async setStorageKey(rootKey: string = 'tv_charts_storage') {
    currentStorageKey = rootKey
  },

  async getFullStorage() {
    const data = await localforage.getItem<Record<string, any>>(currentStorageKey)
    return data || {}
  },

  async removeChart(subKey: string) {
    const allStates = await this.getFullStorage()
    if (allStates[subKey]) {
      delete allStates[subKey]
      await localforage.setItem(currentStorageKey, allStates)
      return true
    }
    return false
  },

  async clearAll() {
    return localforage.removeItem(currentStorageKey)
  },

  async saveChart(subKey: string, chartObj: any) {
    console.log('Saving chart for subKey:', subKey, chartObj)
    let hasValuableContent = false
    const chartObj1 = cloneDeep(chartObj)
    let allStudies: Array<string> = []

    // 1. 扫描原始数据，提取指标名称并检查是否有画图工具 (LineTool)
    chartObj1.charts.forEach((chart: any) => {
      chart.panes.forEach((pane: any) => {
        pane.sources.forEach((source: any) => {
          if (source.type?.includes('LineTool')) {
            hasValuableContent = true
          }
          const isStudy = /study/i.test(source.type || '')
          if (isStudy && source.metaInfo?.name) {
            allStudies.push(source.metaInfo?.name || '')
          }
        })
      })
    })

    // 2. 过滤掉所有 study 指标（保留 Volume），并删除过滤后为空的 pane
    chartObj.charts.forEach((chart: any) => {
      chart.panes = chart.panes.filter((pane: any) => {
        pane.sources = pane.sources.filter((source: any) => {
          const type = source.type || ''
          return !/study/i.test(type) || /volume/i.test(type)
        })
        return pane.sources.length > 0
      })
    })

    const allStates = await this.getFullStorage()

    // 过滤掉 Volume（TV 内置，不需要手动 createStudy，避免重复）
    const filteredStudies = allStudies.filter(s => s !== 'Volume')

    // 3. 准入检查：如果没有 LineTool 内容，则执行清理逻辑
    if (!hasValuableContent) {
      if (allStates[subKey]) {
        delete allStates[subKey]
        allStates.allStudies = Array.from(new Set(filteredStudies))
        await localforage.setItem(currentStorageKey, allStates)
        return { status: 'cleaned' }
      }
      allStates.allStudies = Array.from(new Set(filteredStudies))
      await localforage.setItem(currentStorageKey, allStates)
      return { status: 'ignored' }
    }

    // 4. 正常保存逻辑
    allStates[subKey] = { ...chartObj, _lastModified: Date.now() }
    allStates.allStudies = Array.from(new Set(filteredStudies))

    // LRU 清理：超过最大数量时删除最早修改的项目（排除 allStudies 字段）
    const keys = Object.keys(allStates).filter(k => k !== 'allStudies')
    if (keys.length > MAX_STORAGE_COUNT) {
      const oldestKey = keys.reduce((a, b) =>
        (allStates[a]._lastModified || 0) < (allStates[b]._lastModified || 0) ? a : b
      )
      delete allStates[oldestKey]
    }

    await localforage.setItem(currentStorageKey, allStates)
    return { status: 'saved' }
  }
}

Comlink.expose(chartStorageService)
