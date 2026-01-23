import type { Directive, DirectiveBinding } from 'vue'
import type { ElTooltipProps } from 'element-plus'

interface HTMLElementDirective extends HTMLElement {
  __tooltipHandlers?: {
    onMouseEnter: (e: MouseEvent) => void
    onMouseLeave: (e: MouseEvent) => void
    showTooltip: () => void
  }
  __tooltipContext?: {
    binding: DirectiveBinding<TooltipValue>
  }
  __lastTooltipValue?: TooltipValue
  visible?: boolean
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

    if (el.__tooltipHandlers) return

    // 2. 存储当前 binding 到上下文，方便 updated 时动态读取最新值而不需要重新绑定事件
    el.__tooltipContext = { binding }

    el.__tooltipHandlers = {
      showTooltip: () => {
        const { value, modifiers } = el.__tooltipContext!.binding
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
    el.onmouseenter = el.__tooltipHandlers.onMouseEnter
    el.onmouseleave = el.__tooltipHandlers.onMouseLeave
    el.__lastTooltipValue = binding.value
  },

  updated(el, binding) {
    const tooltip = resolveTooltip(el, binding.arg)
    if (!tooltip) return
    // 只有值变了才更新 tooltip
    if (binding.value !== el.__lastTooltipValue) {
      el.__lastTooltipValue = binding.value

      let content: any = binding.value

     el.__tooltipHandlers = {
        showTooltip: () => {
          let props: Partial<ElTooltipProps> & {
            'raw-content'?: boolean
            'popper-class'?: string
          } = {}

          if (isTooltipConfig(binding.value)) {
            content = binding.value.content
            props = binding.value.props || {}
          }

          if (binding.modifiers?.raw) {
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
      el.onmouseenter = el.__tooltipHandlers.onMouseEnter
      el.onmouseleave = el.__tooltipHandlers.onMouseLeave
    }
  },

  unmounted(el, binding) {
    // 卸载时确保隐藏当前实例
    const tooltip = resolveTooltip(el, binding.arg)
    if (tooltip && el.visible) {
      tooltip.hide()
    }

    const { onMouseEnter, onMouseLeave } = el.__tooltipHandlers || {}
    if (onMouseEnter) el?.removeEventListener?.('mouseenter', onMouseEnter)
    if (onMouseLeave) el?.removeEventListener?.('mouseleave', onMouseLeave)
    el.onmouseenter = null
    el.onmouseleave = null

    delete el.__tooltipHandlers
    delete el.__tooltipContext
    delete el.__lastTooltipValue
  },
}

export default tooltipDirective
