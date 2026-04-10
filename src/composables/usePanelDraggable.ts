import { useWindowSize } from '@vueuse/core'
import type { Ref } from 'vue'

export interface PanelPlacementConfig {
  center: {
    className: string
    initialWidth: number
    initialHeight: number
    x: number
    y: number
    minWidth: number
    minHeight: number
    parent: boolean
    handles: string[]
    dragHandle: string
    z: number
  }
  left: {
    className: string
    style?: string
    axis: 'x'
    x: number
    minWidth: number
    maxWidth: number
    initialWidth: number
    initialHeight: number
    parent: boolean
    handles: string[]
    dragHandle: string
  }
  right: {
    className: string
    axis: 'x'
    x: number
    y: number
    minWidth: number
    maxWidth: number
    initialWidth: number
    initialHeight: number
    parent: boolean
    handles: string[]
    dragHandle: string
  }
}

export interface PanelBoundingRect {
  width: number
  height: number
  x: number
  y: number
}

export interface UsePanelDraggableOptions {
  placement: Ref<'center' | 'left' | 'right'>
  boundingRect: Ref<PanelBoundingRect>
  fixedWidth: number
  winHeight: number
  visible: Ref<boolean>
  isLeftFixed: Ref<boolean>
  isRightFixed: Ref<boolean>
  onLeftDragStop: (x: number, y: number) => void
  onRightDragStop: (x: number, y: number) => void
  onDragStop: (x: number, y: number) => void
  onFixedResizing: (w: number) => void
  onResizing: (w: number, h: number) => void
  onDrag: (x: number) => void
  loadComponent: () => Promise<any>
  panelKey: 'monitor' | 'position' | 'signal' | 'favToken' | 'pump' | 'twitter'
  scrollHeightCenterOffset?: number
  scrollHeightSideOffset?: number
  isLargeWidthThreshold?: number
  maxWidth?: number
  minWidth?: number
}

export function usePanelDraggable(options: UsePanelDraggableOptions) {
  const { t } = useI18n()
  const dragStore = useDragStore()
  const { width: winWidth } = useWindowSize()

  const lazyComponent = shallowRef<Component | null>(null)
  const shouldRenderChild = shallowRef(true)
  const key = ref(0)

  // Load component lazily
  const loadComponent = async () => {
    try {
      const componentModule = await options.loadComponent()
      lazyComponent.value = componentModule.default || componentModule
    } catch (error) {
      console.error('Failed to load component', error)
      throw error
    }
  }

  // Reload component when placement changes
  const reload = () => {
    key.value++
  }

  const reCreateChild = () => {
    shouldRenderChild.value = false
    nextTick(() => {
      shouldRenderChild.value = true
    })
  }

  // Watch placement changes
  watch(() => options.placement.value, () => {
    reload()
    reCreateChild()
  })

  // Auto load component on mount or visibility change
  onMounted(() => {
    if (options.visible.value) {
      loadComponent()
    } else {
      setTimeout(() => {
        loadComponent()
      }, 3000)
    }
  })

  watch(() => options.visible.value, () => {
    if (options.visible.value) {
      loadComponent()
    }
  })

  // Compute props for Draggable component
  const draggableProps = computed(() => {
    const placement = options.placement.value
    let data: any = {
      handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
      dragHandle: '.drag-handle'
    }

    if (placement === 'center') {
      data = {
        className: 'top-0 left-0 fixed',
        initialWidth: options.boundingRect.value.width,
        initialHeight: options.boundingRect.value.height,
        x: options.boundingRect.value.x,
        y: options.boundingRect.value.y,
        minWidth: 360,
        minHeight: 160,
        parent: true,
        handles: ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'],
        dragHandle: '.drag-handle',
        z: 1
      }
    } else if (placement === 'left') {
      data = {
        className: '[&&]:relative shrink-0 left fixed! top-61px',
        style: `left:${dragStore.leftWidth[getPanelKey()] || 0}px`,
        axis: 'x',
        x: 0,
        minWidth: options.minWidth || 388,
        maxWidth: options.maxWidth || 388,
        initialWidth: options.fixedWidth,
        initialHeight: options.winHeight - 95,
        parent: true,
        handles: ['mr'],
        dragHandle: '.drag-handle'
      }
    } else if (placement === 'right') {
      data = {
        className: '[&&]:relative shrink-0 right fixed! top-61px left-0',
        axis: 'x',
        x: dragStore.rightWidth[getPanelKey()] || 0,
        y: 0,
        minWidth: options.minWidth || 388,
        maxWidth: options.maxWidth || 388,
        initialWidth: options.fixedWidth,
        initialHeight: options.winHeight - 95,
        parent: true,
        handles: ['ml'],
        dragHandle: '.drag-handle'
      }
    }

    return data
  })

  // Compute props for child component
  const childProps = computed(() => {
    const placement = options.placement.value
    const centerOffset = options.scrollHeightCenterOffset || 0
    const sideOffset = options.scrollHeightSideOffset || 0

    if (placement === 'center') {
      return {
        class: 'border-1px border-solid border-[--d-1A1A1A-l-F2F2F2] shadow-[0_5px_10px_0_var(--d-FFFFFF14-l-00000014)]',
        scrollHeight: options.boundingRect.value.height - centerOffset,
        isLarge: options.boundingRect.value.width > (options.isLargeWidthThreshold || 720)
      }
    } else {
      return {
        scrollHeight: options.winHeight - sideOffset
      }
    }
  })

  // Get panel key for dragStore
  const getPanelKey = (): keyof typeof dragStore.leftWidth => {
    return options.panelKey
  }

  // Event handlers
  const handleDragStop = (x: number, y: number) => {
    if ((Math.abs(x) < 1 || x + options.boundingRect.value.width >= winWidth.value) && dragStore.fixedCount >= 3) {
      ElMessage.warning(t('popTips'))
      return
    }

    const placement = options.placement.value
    if (placement === 'left') {
      options.onLeftDragStop(x, y)
    } else if (placement === 'right') {
      options.onRightDragStop(x, y)
    } else {
      options.onDragStop(x, y)
    }
  }

  const handleResizing = (w: number, h: number) => {
    const placement = options.placement.value
    if (placement === 'center') {
      options.onResizing(w, h)
    } else {
      options.onFixedResizing(w)
    }
  }

  const handleDrag = (x: number) => {
    const placement = options.placement.value
    if (placement === 'center') {
      options.onDrag(x)
    }
  }

  return {
    // State
    lazyComponent,
    shouldRenderChild,
    key,

    // Methods
    loadComponent,
    reload,
    reCreateChild,

    // Computed props
    draggableProps,
    childProps,

    // Event handlers
    handleDragStop,
    handleResizing,
    handleDrag
  }
}
