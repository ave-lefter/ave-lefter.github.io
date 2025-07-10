import type { DirectiveBinding } from 'vue'
import { ElMessage as Message, ElNotification as Notify } from 'element-plus'
import { getGlobalT } from '@/utils/i18nBridge'

type DirectiveHTMLElement = HTMLElement & {
  handler: (e: Event) => void
  $value: any
}

const copyDirective = {
  mounted(el: DirectiveHTMLElement, binding: DirectiveBinding) {
    // 为 DOM 元素存储绑定的值
    const { value, arg } = binding
    el.$value = value
    const $t = getGlobalT()
    // 事件处理函数
    el.handler = (e) => {
      e.stopPropagation()
      if (el.$value === undefined || el.$value === null) {
        // 如果没有值，显示警告消息
        Message({
          type: 'warning',
          message: $t('noData'),
          plain: true,
        })
        return
      }

      // 创建一个隐藏的 textarea 元素，用于存放要复制的内容
      const textarea = document.createElement('textarea')
      textarea.readOnly = true  // 防止触发 iOS 下的键盘
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px' // 将 textarea 移出视野
      textarea.value = el.$value  // 将要复制的值赋给 textarea
      document.body.appendChild(textarea)  // 将 textarea 插入页面

      // 选中并复制 textarea 的内容
      textarea.select()
      const result = document.execCommand('Copy')

      // 根据复制结果显示不同的消息
      if (result) {
        if (arg) {
          Notify({
            type: 'success',
            message: h('div', { style: 'color:#67c23a' }, [
              h('span', null, $t('copySuccess')),
              h('p', { style: { 'font-size': '12px', color: '#67c23a', 'margin-top': '5px' } }, $t('copyTip', { address: arg }))
            ]),
            // center: false,
            // plain: true,
            duration: 1000,
          })
        } else {
          Message({
            type: 'success',
            message: $t('copySuccess'),
            plain: true,
            duration: 1000,
          })
        }

        // 更改图标的状态
        if (el?.classList?.contains?.('i-bxs:copy')) {
          el.classList.add('color-#3F80F7')
          el.classList.add('i-custom:checked')
          el.classList.remove('i-bxs:copy')
          setTimeout(() => {
            if (el?.classList) {
              el.classList.remove('i-custom:checked')
              el.classList.remove('color-#3F80F7')
              el.classList.add('i-bxs:copy')
            }
          }, 1000)
        }
      }

      // 移除临时创建的 textarea
      document.body.removeChild(textarea)
    }

    // 给元素绑定点击事件
    el.addEventListener('click', el.handler)
  },

  updated(el: DirectiveHTMLElement, binding: DirectiveBinding) {
    // 当指令的值更新时，更新 $value
    el.$value = binding.value
  },

  unmounted(el: DirectiveHTMLElement) {
    // 解除指令时，移除事件监听器
    el.removeEventListener('click', el.handler)
  },
}

export default copyDirective
