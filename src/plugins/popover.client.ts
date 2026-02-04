// plugins/popover.client.ts

import { h, render, ref, shallowRef, nextTick, type App } from 'vue'
import ElPopover from 'element-plus/es/components/popover'

export default defineNuxtPlugin((nuxtApp) => {
  let mounted = false
  const visible = ref(false)
  const content = shallowRef<unknown>(null)
  const triggerRef = shallowRef<HTMLElement | null>(null)
  const popoverProps = shallowRef<Record<string, any>>({})

  let container: HTMLDivElement | null = null
  let vnode: ReturnType<typeof h> | null = null

  function mountPopover(app: App) {
    if (mounted) return

    const PopoverWrapper = {
      setup() {
        return () =>
          h(
            ElPopover,
            {
              visible: visible.value,
              'onUpdate:visible': (v: boolean) => (visible.value = v),
              virtualRef: triggerRef.value,
              virtualTriggering: true,
              trigger: popoverProps.value.trigger || 'click',
              ...popoverProps.value
            },
            {
              default: () => {
                const val = content.value
                if (!val) return '—'
                if (typeof val === 'string') return val
                if (typeof val === 'function') return val(h)
                if ((val as any)?.__v_isVNode) return val
                if (typeof val === 'object' && (val as any).is) {
                  return h((val as any).is, (val as any).props || {})
                }
                return h(val as any)
              }
            }
          )
      }
    }

    container = document.createElement('div')
    document.body.appendChild(container)

    vnode = h(PopoverWrapper)
    vnode.appContext = app._context
    render(vnode, container)

    mounted = true
  }

  const popover = {
    show({ content: c, target, props = {} }: {
      content: any,
      target: HTMLElement,
      props?: Record<string, any>
    }) {
      if (!target) {
        console.error('Target element is required for popover')
        return
      }

      triggerRef.value = target
      content.value = c
      popoverProps.value = {
        trigger: 'click',
        ...props
      }

      nextTick(() => {
        if (!triggerRef.value || !triggerRef.value.parentNode) {
          console.error('Invalid trigger element')
          return
        }

        mountPopover(nuxtApp.vueApp)

        if (popoverProps.value.trigger === 'manual') {
          visible.value = true
        }
      })
    },

    hide() {
      visible.value = false
      nextTick(() => {
        this.destroy()
      })
    },
    destroy() {
      if (vnode && container) {
        render(null, container)
      }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      mounted = false
      container = null
      vnode = null
    },
  }

  return {
    provide: {
      popover
    }
  }
})
