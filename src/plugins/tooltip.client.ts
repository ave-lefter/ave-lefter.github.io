// src/plugins/tooltip.client.ts
import { h, render, ref, shallowRef, nextTick, type App } from 'vue'
import ElTooltip from 'element-plus/es/components/tooltip'
import 'element-plus/es/components/tooltip/style/index'

// 定义类型
export interface TooltipContentComponent {
  is: any
  props?: Record<string, any>
}

export type TooltipContent =
  | string
  | (() => any)
  | TooltipContentComponent
  | any // fallback, e.g., VNode or h()

export interface TooltipOptions {
  content: TooltipContent
  target: HTMLElement
  props?: Record<string, any>
}

export interface TooltipInstance {
  show: (options: TooltipOptions) => void
  hide: () => void
  destroy: () => void
  getId: () => string // 新增：获取实例ID
}

export interface Measurable {
  getBoundingClientRect: () => DOMRect
}

// 工厂函数：创建新的tooltip实例，增加id参数
function createTooltipInstance(appContext: App['_context'], id: string): TooltipInstance {
  let mounted = false
  const visible = ref(false)
  const content = shallowRef<TooltipContent | null>(null)
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const tooltipProps = shallowRef<Record<string, any>>({})
  let container: HTMLDivElement | null = null
  let vnode: ReturnType<typeof h> | null = null

  function mountTooltip() {
    if (mounted) return

    const TooltipWrapper = {
      setup() {
        return () =>
          h(
            ElTooltip,
            {
              visible: visible.value,
              virtualRef: triggerRef.value as Measurable | undefined,
              virtualTriggering: true,
              ...tooltipProps.value,
              persistent: false,
              'data-tooltip-id': id // 添加ID标识用于调试
            },
            {
              content: () => {
                const val = content.value
                if (!val) return '—'
                if (typeof val === 'string') {
                  if (
                    tooltipProps.value['raw-content'] ||
                    tooltipProps.value['rawContent']
                  ) {
                    return h('div', { innerHTML: val })
                  }
                  return val
                }
                if (typeof val === 'function') return val(h)
                if (typeof val === 'object' && val.is) {
                  const Component = val.is
                  const props = val.props || {}
                  return h(Component, props)
                }
                return h(val)
              },
            }
          )
      },
    }

    container = document.createElement('div')
    container.className = `tooltip-instance tooltip-instance-${id}` // 包含ID的类名
    document.body.appendChild(container)

    vnode = h(TooltipWrapper)
    vnode.appContext = appContext
    render(vnode, container)

    mounted = true
  }

  const tooltip: TooltipInstance = {
    show({ content: c, target, props = {} }) {
      if (!target) {
        console.error(`[Tooltip ${id}] Target element is required`)
        return
      }

      triggerRef.value = target
      content.value = c
      tooltipProps.value = props

      nextTick(() => {
        if (!triggerRef.value || !triggerRef.value.parentNode) {
          console.error(`[Tooltip ${id}] Invalid trigger element`)
          return
        }
        mountTooltip()
        visible.value = true
      })
    },
    hide() {
      visible.value = false
    },
    destroy() {
      if (vnode && container) {
        render(null, container)
      }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      console.log(`[Tooltip ${id}] Instance destroyed`)
      mounted = false
      container = null
      vnode = null
    },
    getId() { // 新增：返回实例ID
      return id
    }
  }

  return tooltip
}

// 新增：单例管理类
class TooltipManager {
  private instances = new Map<string, TooltipInstance>()
  private appContext: App['_context']

  constructor(appContext: App['_context']) {
    this.appContext = appContext
  }

  // 根据ID获取或创建单例
  getInstance(id: string): TooltipInstance {
    if (!this.instances.has(id)) {
      const instance = createTooltipInstance(this.appContext, id)
      this.instances.set(id, instance)
    }
    return this.instances.get(id)!
  }

  // 销毁指定ID的实例
  destroyInstance(id: string) {
    const instance = this.instances.get(id)
    if (instance) {
      instance.destroy()
      this.instances.delete(id)
    }
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  // 创建管理器实例
  const tooltipManager = new TooltipManager(nuxtApp.vueApp._context)

  // 创建默认单例实例（ID为'default'）
  const defaultTooltip = tooltipManager.getInstance('default')

  // 修改createTooltip方法，接受id参数
  const createTooltip = (id: string): TooltipInstance => {
    // 验证ID有效性
    if (!id || typeof id !== 'string') {
      console.error('Tooltip ID must be a non-empty string')
      // 生成随机ID作为备选
      const fallbackId = `tooltip-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      console.warn(`Using fallback ID: ${fallbackId}`)
      return tooltipManager.getInstance(fallbackId)
    }
    return tooltipManager.getInstance(id)
  }

  // 新增：销毁指定ID实例的方法
  const destroyTooltip = (id: string) => {
    tooltipManager.destroyInstance(id)
  }

  // 挂载到全局
  return {
    provide: {
      tooltip: defaultTooltip,       // 默认单例
      createTooltip,                 // 创建/获取指定ID的单例
      destroyTooltip                 // 销毁指定ID的单例
    },
  }
})
