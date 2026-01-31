export default defineNuxtPlugin(() => {
  if (typeof performance === 'undefined') return

  setInterval(() => {
    performance.clearMeasures()
  }, 5000)
})
