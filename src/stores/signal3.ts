import { createPanelDraggableState } from '~/composables/usePanelDraggableStore'

export const usePositionStore = defineStore('position', () => {
  // Use the generic draggable state composable
  const draggableState = createPanelDraggableState({
    prefix: 'position',
    defaultFixedWidth: 300
  })

  return {
    ...draggableState,
    visible: draggableState.visible,
    positionBoundingRect: draggableState.boundingRect
  }
})
