import {useStorage, useThrottleFn, useWindowSize} from '@vueuse/core'
export const useFavTokenStore = defineStore('favToken', () => {
  const visible = useStorage('favTokenVisible', false)
  const favTokenBoundingRect = useStorage('favTokenBoundingRect', {
    width: 360,
    height: 500,
    x: 100,
    y: 100
  })
  const {width: winWidth, height: winHeight} = useWindowSize()
  const isLeftFixed = useStorage('isFavTokenLeft', false)
  const isRightFixed = useStorage('isFavTokenRight', false)
  const fixedWidth = useStorage('favTokenFixedWidth', 280)
  const translateStyle = shallowRef(0)
  const onDrag = useThrottleFn((x: number) => {
    if (x <= 0) {
      translateStyle.value = 12
    } else {
      translateStyle.value =
          x + favTokenBoundingRect.value.width >= winWidth.value ? -12 : 0
    }
    console.log('onDrag', translateStyle.value)
  }, 100, false, true)
  function onDragStop(x: number, y: number) {
    console.log('onDragStop', x, y)
    favTokenBoundingRect.value.x = x
    favTokenBoundingRect.value.y = y
    isLeftFixed.value = x <= 0
    if (x > 0) {
      isRightFixed.value = x + favTokenBoundingRect.value.width >= winWidth.value
    }
    setTimeout(() => {
      translateStyle.value = 0
    })
  }

  function onResizing(width: number, height: number) {
    favTokenBoundingRect.value.width = width
    favTokenBoundingRect.value.height = height
  }

  function onLeftDragStop(x: number, y: number) {
    isLeftFixed.value = Math.abs(x) < 1
    if (!isLeftFixed.value) {
      favTokenBoundingRect.value.x = x
      favTokenBoundingRect.value.y = y
    }
  }

  function onRightDragStop(x: number, y: number) {
    console.log('onRightDragStop', x, y)
    isRightFixed.value = Math.abs(x) < 1
    const _x = winWidth.value - fixedWidth.value + x
    if (!isRightFixed.value) {
      // favTokenBoundingRect.value.x = _x
      favTokenBoundingRect.value.x = x
      favTokenBoundingRect.value.y = y
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
    favTokenBoundingRect,
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
