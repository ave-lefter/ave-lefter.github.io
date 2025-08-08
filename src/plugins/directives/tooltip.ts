import type { Directive, DirectiveBinding } from 'vue'
import type { ElTooltipProps } from 'element-plus'

interface HTMLElementDirective extends HTMLElement {
  __tooltipHandlers?: {
    onMouseEnter: (e: MouseEvent) => void
    onMouseLeave: (e: MouseEvent) => void
    showTooltip: () => void
  }
  __lastTooltipValue?: TooltipValue
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

function resolveTooltip(el: HTMLElementDirective): TooltipController | undefined {
  const { $tooltip } = useNuxtApp()
  const instance = (el as any).__vueParentComponent?.proxy
  return $tooltip || instance?.$tooltip || (el as any).__app?.config?.globalProperties?.$tooltip
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
    const tooltip = resolveTooltip(el)
    if (!tooltip) {
      console.warn('Tooltip instance not found')
      return
    }

    if (el.__tooltipHandlers) return // 避免重复绑定

    const raw = binding.modifiers?.raw ?? false
    const value = binding.value

    el.__tooltipHandlers = {
      showTooltip: () => {
        let content: any = value
        let props: Partial<ElTooltipProps> & {
          'raw-content'?: boolean
          'popper-class'?: string
        } = {}

        if (isTooltipConfig(binding.value)) {
          content = (value as any)?.content
          props = (value as any)?.props || {}
        }

        if (raw) {
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
      },
      onMouseEnter: (e: MouseEvent) => {
        e.stopPropagation()
        el?.__tooltipHandlers?.showTooltip?.()
      },
      onMouseLeave: (e: MouseEvent) => {
        e.stopPropagation()
        tooltip.hide()
      }
    }
    el.onmouseenter = el.__tooltipHandlers.onMouseEnter
    el.onmouseleave = el.__tooltipHandlers.onMouseLeave
    el.__lastTooltipValue = binding.value
  },

  updated(el, binding) {
    const tooltip = resolveTooltip(el)
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
        },
        onMouseEnter: (e: MouseEvent) => {
          e.stopPropagation()
          el?.__tooltipHandlers?.showTooltip?.()
        },
        onMouseLeave: (e: MouseEvent) => {
          e.stopPropagation()
          tooltip.hide()
        }
      }
      el.onmouseenter = el.__tooltipHandlers.onMouseEnter
      el.onmouseleave = el.__tooltipHandlers.onMouseLeave
    }
  },

  unmounted(el) {
    const tooltip = resolveTooltip(el)
    if (tooltip) {
      tooltip.hide()
    }
    const { onMouseEnter, onMouseLeave } = el.__tooltipHandlers || {}
    if (onMouseEnter) el.removeEventListener('mouseenter', onMouseEnter)
    if (onMouseLeave) el.removeEventListener('mouseleave', onMouseLeave)

    delete el.__tooltipHandlers
    delete el.__lastTooltipValue
  },
}

export default tooltipDirective
