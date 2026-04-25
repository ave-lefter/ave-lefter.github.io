import { useStorage } from '@vueuse/core'
import { createPanelDraggableState } from '~/composables/usePanelDraggableStore'

export const useTwitterTrackerStore = defineStore('tracker', () => {
  // Use the generic draggable state composable
  const draggableState = createPanelDraggableState({
    prefix: 'tracker',
    defaultFixedWidth: 438
  })

  const isPaused = shallowRef(false)
  const query = useStorage('twitterQuery', {
    types: [1, 2, 3, 4, 5, 6],
    token_keyword: ''
  })
  const unReader = ref(0)
  const loading = ref(false)
  const finished = ref(false)
  const list = ref([])
  const cursor = ref(null)

  const showFooter = ref(false)
  const loading2 = ref(false)
  const finished2 = ref(false)
  return {
    ...draggableState,
    visible: draggableState.visible,
    trackerBoundingRect: draggableState.boundingRect,
    isPaused,
    query,
    unReader,
    loading,
    list,
    cursor,
    finished,
    showFooter,
    loading2,
    finished2
  }
})
