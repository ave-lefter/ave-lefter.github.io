import Copy from './copy'
import Tooltip from './tooltip'
import { ClickOutside as vClickOutside } from 'element-plus'
export default defineNuxtPlugin(nuxtApp => {
  // 创建一个自定义指令 v-focus
  nuxtApp.vueApp.directive('copy', Copy)
  nuxtApp.vueApp.directive('tooltip', Tooltip)
  nuxtApp.vueApp.directive('click-outside', vClickOutside)
})
