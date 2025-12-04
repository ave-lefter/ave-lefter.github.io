import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'




export const useCopyTradeStore = defineStore('copyTrade', () => {
  const copyTradeVisible = shallowRef(true)

  return {
    copyTradeVisible,
  }
})
