import {useStorage, useThrottleFn, useWindowSize} from '@vueuse/core'

export const useTrackerStore = defineStore('tracker', () => {
    const visible = useStorage('trackerVisible', false)
    const boundingRect = useStorage('TrackerBoundingRect', {
        width: 360,
        height: 500,
        x: 100,
        y: 100
      })

    const {width: winWidth, height: winHeight} = useWindowSize()
    const isLeftFixed = useStorage('isTrackerLeft', false)
    const isRightFixed = useStorage('isTrackerRight', false)
    const fixedWidth = useStorage('trackerFixedWidth', 360)
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
        console.log('onDragStop', x, y)
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
        isLeftFixed.value = Math.abs(x) < 1
        if (!isLeftFixed.value) {
          boundingRect.value.x = x
          boundingRect.value.y = y
        }
      }
    
      function onRightDragStop(x: number, y: number) {
        console.log('onRightDragStop', x, y)
        isRightFixed.value = Math.abs(x) < 1
        const _x = winWidth.value - fixedWidth.value + x
        if (!isRightFixed.value) {
          // boundingRect.value.x = _x
          boundingRect.value.x = x
          boundingRect.value.y = y
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
        boundingRect,
        isLeftFixed,
        isRightFixed,
        fixedWidth,
        winWidth,
        winHeight,
        onDrag,
        onDragStop,
        onResizing,
        onLeftDragStop,
        onRightDragStop,
        onFixedResizing,
        placement,
        translateStyle,
    }
})
