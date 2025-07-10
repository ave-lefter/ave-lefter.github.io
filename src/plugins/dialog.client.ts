import { h, render, ref, shallowRef, nextTick, type App } from 'vue'
import ElDialog from 'element-plus/es/components/dialog'
import type { DialogProps } from 'element-plus'

export default defineNuxtPlugin((nuxtApp) => {
  let mounted = false
  const visible = ref(false)

  const content = shallowRef<unknown>(null)
  const component = shallowRef<any>(null)
  const componentProps = ref<Record<string, any>>({})

  const dialogProps = shallowRef<Partial<DialogProps> & { class?: string }>({})

  let container: HTMLDivElement | null = null

  function mountDialog(app: App) {
    if (mounted) return

    const DialogWrapper = {
      setup() {
        return () =>
          h(
            ElDialog,
            {
              modelValue: visible.value,
              'onUpdate:modelValue': (v: boolean) => (visible.value = v),
              ...dialogProps.value
            },
            {
              default: () => {
                if (component.value) {
                  return h(component.value, componentProps.value)
                }

                const val = content.value
                if (!val) return '—'
                if (typeof val === 'string') return val
                if (typeof val === 'function') return val(h)
                if ((val as any)?.__v_isVNode) return val
                return h(val as any)
              }
            }
          )
      }
    }

    container = document.createElement('div')
    document.body.appendChild(container)

    const vnode = h(DialogWrapper)
    vnode.appContext = app._context
    render(vnode, container)

    mounted = true
  }

  const dialog = {
    show({
      content: c,
      props = {}
    }: {
      content: any
      props?: Partial<DialogProps> & { class?: string }
    }) {
      // 如果是 { is, props } 格式，分离组件和 props
      if (c && typeof c === 'object' && 'is' in c) {
        component.value = c.is
        componentProps.value = { ...(c.props || {}) }
        content.value = null
      } else {
        content.value = c
        component.value = null
        componentProps.value = {}
      }

      dialogProps.value = props

      nextTick(() => {
        mountDialog(nuxtApp.vueApp)
        visible.value = true
      })
    },

    hide() {
      visible.value = false
    },

    updateContentProps(props: Record<string, any>) {
      componentProps.value = {
        ...componentProps.value,
        ...props
      }
    }
  }

  return {
    provide: {
      dialog
    }
  }
})
