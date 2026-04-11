/*
 * @Date: 2026-04-10 10:03:37
 * @LastEditors: Lewis
 * @FilePath: /ave_web/src/composables/usePanelDraggableStore.ts
 * @Description: In User Settings Edit
 */
import { useStorage, useThrottleFn, useWindowSize } from '@vueuse/core'
import type { Ref, ShallowRef } from 'vue'

export interface PanelDraggableState {
  visible: Ref<boolean>
  boundingRect: Ref<{ width: number; height: number; x: number; y: number }>
  isLeftFixed: Ref<boolean>
  isRightFixed: Ref<boolean>
  fixedWidth: Ref<number>
  winHeight: Ref<number>
  winWidth: Ref<number>
  translateStyle: ShallowRef<number>
  placement: Ref<'center' | 'left' | 'right'>
  onDragStop: (x: number, y: number) => void
  onLeftDragStop: (x: number, y: number) => void
  onRightDragStop: (x: number, y: number) => void
  onResizing: (width: number, height: number) => void
  onFixedResizing: (width: number) => void
  onDrag: (x: number) => void
}

export interface UsePanelDraggableStoreOptions {
  /** Store 名称前缀，用于 storage key */
  prefix: string
  /** 默认宽度 */
  defaultWidth?: number
  /** 默认高度 */
  defaultHeight?: number
  /** 默认 x 位置 */
  defaultX?: number
  /** 默认 y 位置 */
  defaultY?: number
  /** 默认固定宽度 */
  defaultFixedWidth?: number
  /** 是否默认可见 */
  defaultVisible?: boolean
}

/**
 * 创建面板拖拽状态的通用 composable
 * 用于 signal、monitor、position、favToken 等 store
 */
export function createPanelDraggableState(options: UsePanelDraggableStoreOptions): PanelDraggableState {
  const {
    prefix,
    defaultWidth = 360,
    defaultHeight = 500,
    defaultX = 100,
    defaultY = 100,
    defaultFixedWidth = 360,
    defaultVisible = false
  } = options

  const visible = useStorage(`${prefix}Visible`, defaultVisible)
  const boundingRect = useStorage(`${prefix}BoundingRect`, {
    width: defaultWidth,
    height: defaultHeight,
    x: defaultX,
    y: defaultY
  })

  const { width: winWidth, height: winHeight } = useWindowSize()
  const isLeftFixed = useStorage(`is${capitalize(prefix)}Left`, false)
  const isRightFixed = useStorage(`is${capitalize(prefix)}Right`, false)
  const fixedWidth = useStorage(`${prefix}FixedWidth`, defaultFixedWidth)

  const translateStyle = shallowRef(0)
  const onDrag = useThrottleFn((x: number) => {
    if (x <= 0) {
      translateStyle.value = 12
    } else {
      translateStyle.value =
        x + boundingRect.value.width >= winWidth.value ? -12 : 0
    }
  }, 100, false, true)

  function onDragStop(x: number, y: number) {
    boundingRect.value.x = x
    boundingRect.value.y = y
    isLeftFixed.value = x <= 0
    if (x > 0) {
      isRightFixed.value = x + boundingRect.value.width >= winWidth.value
    }
    setTimeout(() => {
      translateStyle.value = 0
    })
  }

  function onResizing(width: number, height: number) {
    boundingRect.value.width = width
    boundingRect.value.height = height
  }

  function onLeftDragStop(x: number, y: number) {
    const nearLeft = x <= 12
    
    // 计算左侧模式下能拖到的最大距离，容差 80px
    // 当 x 接近这个最大值时，说明用户已经把面板拖到了最右边
    const maxDraggableX = winWidth.value - boundingRect.value.width - 80
    const nearRight = x >= maxDraggableX || x + boundingRect.value.width >= winWidth.value - 12
    
    if (nearLeft) {
      // 吸附到左侧
      isLeftFixed.value = true
      isRightFixed.value = false
      return
    }
    
    // 不吸附左侧，更新坐标
    boundingRect.value.x = x
    boundingRect.value.y = y
    
    if (nearRight) {
      // 吸附到右侧
      isRightFixed.value = true
      isLeftFixed.value = false
    } else {
      // 自由状态
      isRightFixed.value = false
      isLeftFixed.value = false
    }
  }

  function onRightDragStop(x: number, y: number) {
    const nearRight = x + boundingRect.value.width >= winWidth.value - 12
    
    // 计算右侧模式下能拖到的最小距离，容差 80px
    // 当 x 接近这个最小值时，说明用户已经把面板拖到了最左边
    const minDraggableX = 80
    const nearLeft = x <= 12 || x <= minDraggableX
    
    if (nearRight) {
      // 吸附到右侧
      isRightFixed.value = true
      isLeftFixed.value = false
      return
    }
    
    // 不吸附右侧，更新坐标
    boundingRect.value.x = x
    boundingRect.value.y = y
    
    if (nearLeft) {
      // 吸附到左侧
      isLeftFixed.value = true
      isRightFixed.value = false
    } else {
      // 自由状态
      isLeftFixed.value = false
      isRightFixed.value = false
    }
  }

  function onFixedResizing(width: number) {
    fixedWidth.value = width
  }

  const placement = computed(() => {
    if (!isLeftFixed.value && !isRightFixed.value) {
      return 'center'
    } else if (isLeftFixed.value) {
      return 'left'
    } else if (isRightFixed.value) {
      return 'right'
    } else {
      return 'center'
    }
  })

  return {
    visible,
    boundingRect,
    isLeftFixed,
    isRightFixed,
    fixedWidth,
    winHeight,
    winWidth,
    translateStyle,
    placement,
    onDragStop,
    onLeftDragStop,
    onRightDragStop,
    onResizing,
    onFixedResizing,
    onDrag
  }
}

/**
 * 首字母大写辅助函数
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
