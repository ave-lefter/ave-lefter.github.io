// plugins/tradingview.client.ts
export default defineNuxtPlugin(() => {
  const id = 'tradingview-widget-script'
  if (!document.getElementById(id)) {
    const d = (JSON.parse(localStorage.globalConfig || '{}').token_logo_url || 'https://www.iconaves.com/')
    const script = document.createElement('script')
    script.id = id
    script.src = d + 'charting_library-29.4.0/charting_library/charting_library.standalone.js'
    script.async = true
    script.onload = () => {
      // 脚本加载完，可以发事件通知或挂状态变量
      window.dispatchEvent(new Event('tradingview:ready'))
    }
    document.head.appendChild(script)
  }
})
