import {useStorage, useThrottleFn, useWindowSize} from '@vueuse/core'
// import type {GetmonitorV2ListResponse} from '~/api/monitor'
import { defaultPaginationParams } from '@/utils/constants'
export const useMonitorStore = defineStore('monitor', () => {
  const visible = useStorage('monitorVisible', false)
  const monitorBoundingRect = useStorage('monitorBoundingRect', {
    width: 360,
    height: 500,
    x: 100,
    y: 100
  })
  const {width: winWidth, height: winHeight} = useWindowSize()
  const isLeftFixed = useStorage('isMonitorLeft', false)
  const isRightFixed = useStorage('isMonitorRight', false)
  const fixedWidth = useStorage('monitorFixedWidth', 310)
  const hasRing=useStorage('hasRing', false)
  const monitorList1=shallowRef([] as any[])
  const monitorList2=shallowRef([] as any[])
  const activeName=ref(0)
  const translateStyle = shallowRef(0)
  const onDrag = useThrottleFn((x: number) => {
    if (x <= 0) {
      translateStyle.value = 12
    } else {
      translateStyle.value =
          x + monitorBoundingRect.value.width >= winWidth.value ? -12 : 0
    }
  }, 100, false, true)
  function onDragStop(x: number, y: number) {
    console.log('onDragStop', x, y)
    monitorBoundingRect.value.x = x
    monitorBoundingRect.value.y = y
    isLeftFixed.value = x <= 0
    if (x > 0) {
      isRightFixed.value = x + monitorBoundingRect.value.width >= winWidth.value
    }
    setTimeout(() => {
      translateStyle.value = 0
    })
  }

  function onResizing(width: number, height: number) {
    monitorBoundingRect.value.width = width
    monitorBoundingRect.value.height = height
  }

  function onLeftDragStop(x: number, y: number) {
    isLeftFixed.value = Math.abs(x) < 1
    if (!isLeftFixed.value) {
      monitorBoundingRect.value.x = x
      monitorBoundingRect.value.y = y
    }
  }

  function onRightDragStop(x: number, y: number) {
    console.log('onRightDragStop', x, y)
    isRightFixed.value = Math.abs(x) < 1
    const _x = winWidth.value - fixedWidth.value + x
    if (!isRightFixed.value) {
      // monitorBoundingRect.value.x = _x
      monitorBoundingRect.value.x = x
      monitorBoundingRect.value.y = y
    }
  }

  function onFixedResizing(width: number) {
    fixedWidth.value = width
  }
  const user_chain=shallowRef('AllChains')
  const txType=shallowRef([0,1])
  const selectGroupId = shallowRef(0)
  const paginationParams= ref({...defaultPaginationParams,pageSize: 50})
  // token: 筛选 token
  // history_count：筛选信号数，对应值2, 5, 15
  // 市值：mc_curr，市值过滤，
  // 市值方向：mc_curr_sign， 默认 > 大于号，可选 <
  const filterParams = useStorage('monitorParams', {
    token: '',
    history_count: undefined as undefined | number,
    mc_curr: undefined as undefined | number,
    mc_curr_sign: '<'
  })

  const listStatus = ref({
    loading: false,
    finished: false,
    error: false
  })

  const pageParams = shallowRef({
    pageNO: 1,
    pageSize: 20,
  })
  // const signalStore = useSignalStore()

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
    monitorBoundingRect,
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
    selectGroupId,
    filterParams,
    listStatus,
    pageParams,
    monitorList1,
    user_chain,
    monitorList2,
    activeName,
    hasRing,
    placement,
    paginationParams,
    txType
  }
})
