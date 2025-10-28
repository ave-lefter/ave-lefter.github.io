import { ref, onMounted, onUnmounted } from 'vue'

export function useNow(interval = 1000) {
  const now = ref(Date.now())
  let timer: number

  onMounted(() => {
    timer = window.setInterval(() => {
      now.value = Date.now()
    }, interval)
  })

    onUnmounted(() => {
        if (timer) {
            clearInterval(timer)
        }
  })

  return now
}
