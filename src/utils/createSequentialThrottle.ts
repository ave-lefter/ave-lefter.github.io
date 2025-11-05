/**
 * 顺序节流包装器 - 不取消中间调用，确保每次调用最终都会按顺序执行
 */
type ThrottledFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>

function createSequentialThrottle<T extends (...args: any[]) => any>(
  func: T,
  minInterval: number = 1000
): ThrottledFunction<T> {
  let lastCallTime = 0
  let queue: Array<{
    args: Parameters<T>
    resolve: (value: ReturnType<T>) => void
    reject: (reason?: any) => void
  }> = []
  let isProcessing = false

  async function processQueue(this: any): Promise<void> {
    if (isProcessing || queue.length === 0) return

    isProcessing = true

    while (queue.length > 0) {
      const currentTime = Date.now()
      const timeSinceLastCall = currentTime - lastCallTime

      if (timeSinceLastCall < minInterval) {
        const delay = minInterval - timeSinceLastCall
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      const { args, resolve, reject } = queue.shift()!
      lastCallTime = Date.now()

      try {
        const result = func.apply(this, args)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    isProcessing = false
  }

  return function(this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      queue.push({ args, resolve, reject })
      processQueue.call(this)
    })
  }
}

export { createSequentialThrottle, type ThrottledFunction }
