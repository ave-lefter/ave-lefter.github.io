import * as Comlink from 'comlink'
import localforage from 'localforage'
import { cloneDeep } from 'lodash-es'

let currentStorageKey = 'tv_charts_storage'
const MAX_STORAGE_COUNT = 100
let saveQueue: Promise<any> = Promise.resolve()

/**
 * 递归扁平化对象，生成 TV 识别的路径 (如 {plot:{color:1}} -> {"styles.plot.color":1})
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  if (!obj) return {}
  return Object.keys(obj).reduce((acc: any, k: string) => {
    const pre = prefix.length ? prefix + '.' : ''
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k]) && Object.keys(obj[k]).length > 0) {
      Object.assign(acc, flattenObject(obj[k], pre + k))
    } else {
      acc[pre + k] = obj[k]
    }
    return acc
  }, {})
}

const chartStorageService = {
  async setStorageKey(rootKey: string = 'tv_charts_storage') {
    currentStorageKey = rootKey
  },

  async getFullStorage() {
    const data = await localforage.getItem<Record<string, any>>(currentStorageKey)
    return data || {}
  },

  async saveChart(subKey: string, chartObj: any) {
    return (saveQueue = saveQueue.then(() => this._executeSave(subKey, chartObj)))
  },

  async _executeSave(subKey: string, chartObj: any) {
    let hasValuableContent = false
    const chartObjClone = cloneDeep(chartObj)
    let allStudiesConfigs: Array<any> = []

    chartObjClone.charts.forEach((chart: any) => {
      chart.panes.forEach((pane: any) => {
        pane.sources.forEach((source: any) => {
          if (source.type?.includes('LineTool')) hasValuableContent = true

          const isStudy = /study/i.test(source.type || '')
          const isVolume = /volume/i.test(source.type || '')

          if (isStudy && !isVolume && source.metaInfo) {
            const state = source.state || {}
            // 【核心修复】: 必须带上 "styles" 前缀，createStudy 才能识别 overrides 路径
            const flattenedStyles = flattenObject(state.styles, 'styles')

            // 额外捕获精度等属性
            if (state.precision !== undefined) {
              flattenedStyles['precision'] = state.precision
            }

            allStudiesConfigs.push({
              name: source.metaInfo.name,
              inputs: state.inputs,
              styles: flattenedStyles
            })
          }
        })
      })
    })

    const uniqueStudies = Array.from(
      new Map(allStudiesConfigs.map(s => [JSON.stringify(s), s])).values()
    )
    const allStates = await this.getFullStorage()

    if (!hasValuableContent) {
      if (allStates[subKey]) delete allStates[subKey]
      allStates.allStudies = uniqueStudies
      await localforage.setItem(currentStorageKey, allStates)
      return { status: 'cleaned' }
    }

    // 瘦身：保留画图工具，移除指标
    chartObj.charts.forEach((chart: any) => {
      chart.panes.forEach((pane: any) => {
        pane.sources = pane.sources.filter((s: any) =>
          !/study/i.test(s.type || '') || /volume/i.test(s.type || '')
        )
      })
    })

    allStates[subKey] = { ...chartObj, _lastModified: Date.now() }
    allStates.allStudies = uniqueStudies

    const keys = Object.keys(allStates).filter(k => k !== 'allStudies')
    if (keys.length > MAX_STORAGE_COUNT) {
      const oldestKey = keys.reduce((a, b) =>
        (allStates[a]._lastModified || 0) < (allStates[b]._lastModified || 0) ? a : b
      )
      delete allStates[oldestKey]
    }

    await localforage.setItem(currentStorageKey, allStates)
    return { status: 'saved' }
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
  }
}

Comlink.expose(chartStorageService)
