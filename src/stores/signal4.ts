import { createPanelDraggableState } from '~/composables/usePanelDraggableStore'

export const useFavTokenStore = defineStore('favToken', () => {
  // Use the generic draggable state composable
  const draggableState = createPanelDraggableState({
    prefix: 'favToken',
    defaultFixedWidth: 280
  })

  return {
    ...draggableState,
    visible: draggableState.visible,
    favTokenBoundingRect: draggableState.boundingRect
  }
})
