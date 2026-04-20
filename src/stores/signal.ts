import type {GetSignalV2ListResponse} from '~/api/signal'
import { createPanelDraggableState } from '~/composables/usePanelDraggableStore'
import {useStorage} from '@vueuse/core'
export const useSignalStore = defineStore('signalStore', () => {
  const route = useRoute()
  const shouldHide = computed(()=>{
    return route.path.includes('/smart')
  })

  // Use the generic draggable state composable
  const draggableState = createPanelDraggableState({
    prefix: 'signal',
    defaultFixedWidth: 360
  })

  const activeChain = shallowRef('bsc')

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
    ...draggableState,
    signalVisible: draggableState.visible,
    signalBoundingRect: draggableState.boundingRect,
    activeChain,
    filterParams,
    signalList,
    listStatus,
    pageParams,
    updateList,
    shouldHide
  }
})
