import type { Directive, DirectiveBinding } from 'vue'
import type { ElTooltipProps } from 'element-plus'

interface HTMLElementDirective extends HTMLElement {
  __tooltipHandlers?: {
    onMouseEnter: null | ((e: MouseEvent) => void)
    onMouseLeave: null | ((e: MouseEvent) => void)
    showTooltip: (() => void) | null
  } | null
  __tooltipContext?: {
    binding: DirectiveBinding<TooltipValue> | null
  } | null
  __lastTooltipValue?: TooltipValue | null
  visible?: boolean
  _tooltipInstance?: TooltipController | null
}

type TooltipValue =
  | string
  | {
    content:
      | string
      | ((h: typeof import('vue').h) => any)
      | { is: any; props?: Record<string, any> }
      | any
    props?: Partial<ElTooltipProps> & {
      'raw-content'?: boolean
      'popper-class'?: string
    }
  }

interface TooltipController {
  show: (options: {
    content: any
    target: HTMLElementDirective
    props?: Partial<ElTooltipProps> & {
      ['raw-content']?: boolean
      ['popper-class']?: string
    }
  }) => void
  hide: () => void
}

/**
 * 修改点：根据指令参数绑定对应的 Tooltip 实例
 */
function resolveTooltip(el: HTMLElementDirective, arg?: string): TooltipController | undefined {
  const { $tooltip, $createTooltip } = useNuxtApp()

  // 如果使用了 v-tooltip:customId，则通过 $createTooltip(id) 获取或创建指定实例
  if (arg && typeof $createTooltip === 'function') {
    return $createTooltip(arg)
  }

  // 否则返回默认单例
  return ($tooltip as TooltipController)
}

function isTooltipConfig(val: unknown): val is { content: any; props?: any } {
  return typeof val === 'object' &&
    val !== null &&
    !('render' in val) &&
    !('setup' in val) &&
    !('is' in val) &&
    typeof val !== 'function'
}

const tooltipDirective: Directive<HTMLElementDirective, TooltipValue> = {
  mounted(el, binding: DirectiveBinding<TooltipValue>) {
    // 1. 获取指定实例
    const tooltip = resolveTooltip(el, binding.arg)
    if (!tooltip) {
      console.warn('[Tooltip Directive] Instance not found')
      return
    }
    el._tooltipInstance = tooltip // 缓存实例

    if (el.__tooltipHandlers) return

    // 2. 存储当前 binding 到上下文，方便 updated 时动态读取最新值而不需要重新绑定事件
    el.__tooltipContext = { binding }

    el.__tooltipHandlers = {
      showTooltip: () => {
        const { value, modifiers } = el.__tooltipContext!.binding as DirectiveBinding
        let content: any = value
        let props: Partial<ElTooltipProps> & {
          'raw-content'?: boolean
          'popper-class'?: string
        } = {}

        if (isTooltipConfig(value)) {
          content = value.content
          props = value.props || {}
        }

        // 处理修饰符 v-tooltip.raw
        if (modifiers?.raw) {
          props['raw-content'] = true
        }

        tooltip.show({
          content,
          target: el,
          props: {
            placement: 'top',
            'popper-class': props['popper-class'] ?? '',
            ...props,
          },
        })
        el.visible = true
      },
      onMouseEnter: (e: MouseEvent) => {
        e.stopPropagation()
        el?.__tooltipHandlers?.showTooltip?.()
      },
      onMouseLeave: (e: MouseEvent) => {
        e.stopPropagation()
        tooltip.hide()
        el.visible = false
      }
    }
    if (el.__tooltipHandlers.onMouseEnter && el.__tooltipHandlers.onMouseLeave) {
      el.addEventListener('mouseenter', el.__tooltipHandlers.onMouseEnter)
      el.addEventListener('mouseleave', el.__tooltipHandlers.onMouseLeave)
    }
    el.__lastTooltipValue = binding.value
  },

  updated(el, binding) {
    const tooltip = resolveTooltip(el, binding.arg)
    if (!tooltip) return
    // 只有值变了才更新 tooltip
    if (binding.value !== el.__lastTooltipValue) {
      if (el.__tooltipContext) {
        el.__tooltipContext.binding = binding
      }
    }
  },

  unmounted(el, binding) {
    // 卸载时确保隐藏当前实例
    // const tooltip = resolveTooltip(el, binding.arg)
    // unmounted 中
    if (el._tooltipInstance) {
      el._tooltipInstance.hide()
      el._tooltipInstance = null // 清理引用
    }

     // 2. 移除标准监听器 (核心步骤)
    if (el.__tooltipHandlers) {
      const { onMouseEnter, onMouseLeave } = el.__tooltipHandlers
      if (onMouseEnter) el.removeEventListener('mouseenter', onMouseEnter)
      if (onMouseLeave) el.removeEventListener('mouseleave', onMouseLeave)
    }
    if (el.__tooltipHandlers) {
      el.__tooltipHandlers.onMouseEnter = null
      el.__tooltipHandlers.onMouseLeave = null
      el.__tooltipHandlers.showTooltip = null
    }

    if (el.__tooltipContext) {
      el.__tooltipContext.binding = null
    }

    if (el.__lastTooltipValue) {
      el.__lastTooltipValue = null
    }
    el.__tooltipContext = null
    el.__tooltipHandlers = null
    el.__lastTooltipValue = null

    delete el.__tooltipHandlers
    delete el.__tooltipContext
    delete el.__lastTooltipValue
  },
}

export default tooltipDirective
