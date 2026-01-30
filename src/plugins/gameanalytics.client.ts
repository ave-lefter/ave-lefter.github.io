declare global {
  interface Window {
    GameAnalytics?: any
  }
}

export default defineNuxtPlugin(() => {
  new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = '/GameAnalytics.min.js'
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  }).then(() => {
    // 初始化 GameAnalytics（确保 `GameAnalytics` 全局已存在）
    if (typeof window !== 'undefined' && window.GameAnalytics) {
      const GA = window.GameAnalytics

      // GameAnalytics.configureBuild('1.0.0');
      GA('setEnabledInfoLog', false)
      GA('initialize', 'f0c5b7066f930031fd7fc70f9fafc376', '1fa8b7bf923a2eaf5274ab7a79bd8a90ec170299')

      // 可选：追踪一个事件
      // GameAnalytics.addDesignEvent('app:launch')
    }
  })
})
