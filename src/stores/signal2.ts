import {useStorage} from '@vueuse/core'
import { defaultPaginationParams } from '@/utils/constants'
import { createPanelDraggableState } from '~/composables/usePanelDraggableStore'

export const useMonitorStore = defineStore('monitor', () => {
  // Use the generic draggable state composable
  const draggableState = createPanelDraggableState({
    prefix: 'monitor',
    defaultFixedWidth: 310
  })

  const hasRing = useStorage('hasRing', false)
  const monitorList1 = shallowRef([] as any[])
  const monitorList2 = shallowRef([] as any[])
  const activeName = ref(0)
  const user_chain = shallowRef('AllChains')
  const txType = useStorage('monitorTxType', [0, 1])
  const minVol=useStorage('monitorMinVol', 0)
  const selectGroupId = shallowRef(0)
  const paginationParams = ref({...defaultPaginationParams, pageSize: 50})

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

  return {
    ...draggableState,
    visible: draggableState.visible,
    monitorBoundingRect: draggableState.boundingRect,
    hasRing,
    monitorList1,
    monitorList2,
    activeName,
    user_chain,
    txType,
    selectGroupId,
    paginationParams,
    filterParams,
    listStatus,
    pageParams,
    minVol
  }
})
