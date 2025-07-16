import {useStorage, useThrottleFn, useWindowSize} from '@vueuse/core'
import type {GetSignalV2ListResponse} from '~/api/signal'

export const useSignalStore = defineStore('signalStore', () => {
  const signalVisible = useStorage('signalVisible', false)
  const signalBoundingRect = useStorage('signalBoundingRect', {
    width: 360,
    height: 500,
    x: 100,
    y: 100
  })
  // const isLeftFixed = computed(() => {
  //   return signalBoundingRect.value.x <= 0
  // })
  const {width: winWidth, height: winHeight} = useWindowSize()
  const isLeftFixed = useStorage('isSignalLeft', false)
  const isRightFixed = useStorage('isSignalRight', false)
  const fixedWidth = useStorage('signalFixedWidth', 360)
  // watch(() => [winWidth.value, signalBoundingRect.value.width, signalBoundingRect.value.x], () => {
  //   if (!isRightFixed.value) {
  //     const {width, x} = signalBoundingRect.value
  //     isRightFixed.value = x + width >= winWidth.value
  //   } else {
  //     isRightFixed.value = signalBoundingRect.value.x + fixedWidth.value >= winWidth.value
  //   }
  // })

  const translateStyle = shallowRef(0)
  const onDrag = useThrottleFn((x: number) => {
    if (x <= 0) {
      translateStyle.value = 12
    } else {
      translateStyle.value =
          x + signalBoundingRect.value.width >= winWidth.value ? -12 : 0
    }
  }, 100, false, true)
  function onDragStop(x: number, y: number) {
    signalBoundingRect.value.x = x
    signalBoundingRect.value.y = y
    isLeftFixed.value = x <= 0
    if (x > 0) {
      isRightFixed.value = x + signalBoundingRect.value.width >= winWidth.value
    }
    setTimeout(() => {
      translateStyle.value = 0
    })
  }

  function onResizing(width: number, height: number) {
    signalBoundingRect.value.width = width
    signalBoundingRect.value.height = height
  }

  function onLeftDragStop(x: number, y: number) {
    isLeftFixed.value = Math.abs(x) < 1
    if (!isLeftFixed.value) {
      signalBoundingRect.value.x = x
      signalBoundingRect.value.y = y
    }
  }

  function onRightDragStop(x: number, y: number) {
    console.log('onRightDragStop', x, y)
    isRightFixed.value = Math.abs(x) < 1
    const _x = winWidth.value - fixedWidth.value + x
    if (!isRightFixed.value) {
      // signalBoundingRect.value.x = _x
      signalBoundingRect.value.x = x
      signalBoundingRect.value.y = y
    }
  }

  function onFixedResizing(width: number) {
    fixedWidth.value = width
  }

  const activeChain = shallowRef('solana')

  // token: 筛选 token
  // history_count：筛选信号数，对应值2, 5, 15
  // 市值：mc_curr，市值过滤，
  // 市值方向：mc_curr_sign， 默认 > 大于号，可选 <
  const filterParams = useStorage('signalParams', {
    token: '',
    history_count: undefined as undefined | number,
    mc_curr: undefined as undefined | number,
    mc_curr_sign: '<'
  })

  const signalList = shallowRef<GetSignalV2ListResponse[]>([])
  const listStatus = ref({
    loading: false,
    finished: false,
    error: false
  })

  const pageParams = shallowRef({
    pageNO: 1,
    pageSize: 20,
  })

  function updateList() {
    triggerRef(signalList)
  }

  return {
    signalVisible,
    signalBoundingRect,
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
    activeChain,
    filterParams,
    signalList,
    listStatus,
    pageParams,
    updateList
  }
})
