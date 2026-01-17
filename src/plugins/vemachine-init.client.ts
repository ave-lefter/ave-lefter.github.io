export default defineNuxtPlugin({
  name: 'vemachine-init',
  enforce: 'pre',

  async setup() {
    if (!import.meta.client) return

    await loadScript('/vemachine.js') // 替换为实际 URL

    await nextTick()

    const vemachine = window?.vemachine

    if (!vemachine) {
      console.warn('[vemachine] not loaded')
      return
    }

    if (typeof vemachine.generateToken !== 'function') {
      console.warn('[vemachine] generateToken is not a function')
      return
    }

    try {
      await vemachine.generateToken()
      console.log('[vemachine] token generated')
    } catch (err) {
      console.error('[vemachine] failed to generate token', err)
    }
  }
})

async function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = (err) => reject(err)
    document.head.appendChild(script)
  })
}
