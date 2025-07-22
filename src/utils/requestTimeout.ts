 /**
   * Schedules a function to run after a specified delay, using `requestAnimationFrame`.
   *
   * @param callback The function to execute after the delay.
   * @param delay The time, in milliseconds, to wait before executing the callback. Defaults to 0.
   * @returns A `TimeoutHandle` object that can be used to cancel the timeout.
   */
  function requestTimeout(callback: () => void, delay = 0) {
    const start = performance.now()
    const handle = { id: 0 }
  
    const loop = () => {
      const current = performance.now()
      if (current - start >= delay) {
        callback()
      }
      else {
        handle.id = requestAnimationFrame(loop)
      }
    }
  
    handle.id = requestAnimationFrame(loop)
    return handle
  }

  function cancelTimeout(handle:{id:number}){
    cancelAnimationFrame(handle.id)
  }

  export {
    requestTimeout,
    cancelTimeout
  }