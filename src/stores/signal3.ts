import {useStorage, useThrottleFn, useWindowSize} from '@vueuse/core'
export const usePositionStore = defineStore('position', () => {
  const visible = useStorage('positionVisible', false)
  const positionBoundingRect = useStorage('positionBoundingRect', {
    width: 360,
    height: 500,
    x: 100,
    y: 100
  })
  const {width: winWidth, height: winHeight} = useWindowSize()
  const isLeftFixed = useStorage('isPositionLeft', false)
  const isRightFixed = useStorage('isPositionRight', false)
  const fixedWidth = useStorage('positionFixedWidth', 300)
  const translateStyle = shallowRef(0)
  const onDrag = useThrottleFn((x: number) => {
    if (x <= 0) {
      translateStyle.value = 12
    } else {
      translateStyle.value =
          x + positionBoundingRect.value.width >= winWidth.value ? -12 : 0
    }
  }, 100, false, true)
  function onDragStop(x: number, y: number) {
    console.log('onDragStop', x, y)
    positionBoundingRect.value.x = x
    positionBoundingRect.value.y = y
    isLeftFixed.value = x <= 0
    if (x > 0) {
      isRightFixed.value = x + positionBoundingRect.value.width >= winWidth.value
    }
    setTimeout(() => {
      translateStyle.value = 0
    })
  }

  function onResizing(width: number, height: number) {
    positionBoundingRect.value.width = width
    positionBoundingRect.value.height = height
  }

  function onLeftDragStop(x: number, y: number) {
    isLeftFixed.value = Math.abs(x) < 1
    if (!isLeftFixed.value) {
      positionBoundingRect.value.x = x
      positionBoundingRect.value.y = y
    }
  }

  function onRightDragStop(x: number, y: number) {
    console.log('onRightDragStop', x, y)
    isRightFixed.value = Math.abs(x) < 1
    const _x = winWidth.value - fixedWidth.value + x
    if (!isRightFixed.value) {
      // positionBoundingRect.value.x = _x
      positionBoundingRect.value.x = x
      positionBoundingRect.value.y = y
    }
  }

  function onFixedResizing(width: number) {
    fixedWidth.value = width
  }

  const placement=computed(()=>{
    if(!isLeftFixed.value&&!isRightFixed.value){
      return 'center'
    }else if(isLeftFixed.value){
      return 'left'
    } else if(isRightFixed.value){
      return 'right'
    } else {
      return 'center'
    }
  })

  return {
    visible,
    positionBoundingRect,
    isLeftFixed,
    isRightFixed,
    fixedWidth,
    winHeight,
    winWidth,
    onDragStop,
    onLeftDragStop,
    onRightDragStop,
    onResizing,
    onFixedResizing,
    onDrag,
    translateStyle,
    placement,
  }
})
