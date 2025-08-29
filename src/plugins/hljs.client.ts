import hljs from 'highlight.js/lib/core'
import hljsDefineSolidity from 'highlightjs-solidity'

// 注册语言
hljsDefineSolidity(hljs)

export default defineNuxtPlugin(() => {
  return {
    provide: {
      hljs,
    },
  }
})
