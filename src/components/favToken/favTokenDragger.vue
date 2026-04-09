<template>
  <Draggable
    :class="{ 'left-drag': favTokenStore.isLeftFixed, 'right-drag': favTokenStore.isRightFixed }"
    :shouldRenderChild="shouldRenderChild"
    v-bind="draggableProps"
    @on-drag-stop="handleDragStop"
    @on-resizing="handleResizing"
    @on-drag="handleDrag"
  >
    <component :is="lazyComponent" v-bind="childProps" />
  </Draggable>
</template>

<script setup lang="ts">
import { usePanelDraggable } from '~/composables/usePanelDraggable'

const favTokenStore = useFavTokenStore()
const { placement } = storeToRefs(favTokenStore)
const { lang } = storeToRefs(useGlobalStore())

// Use the generic composable
const {
  lazyComponent,
  shouldRenderChild,
  draggableProps,
  childProps,
  handleDragStop,
  handleResizing,
  handleDrag
} = usePanelDraggable({
  placement,
  boundingRect: computed(() => favTokenStore.favTokenBoundingRect),
  fixedWidth: favTokenStore.fixedWidth,
  winHeight: favTokenStore.winHeight,
  lang,
  visible: computed(() => favTokenStore.visible),
  isLeftFixed: computed(() => favTokenStore.isLeftFixed),
  isRightFixed: computed(() => favTokenStore.isRightFixed),
  onLeftDragStop: favTokenStore.onLeftDragStop.bind(favTokenStore),
  onRightDragStop: favTokenStore.onRightDragStop.bind(favTokenStore),
  onDragStop: favTokenStore.onDragStop.bind(favTokenStore),
  onFixedResizing: favTokenStore.onFixedResizing.bind(favTokenStore),
  onResizing: favTokenStore.onResizing.bind(favTokenStore),
  onDrag: favTokenStore.onDrag.bind(favTokenStore),
  loadComponent: () => import('./index.vue'),
  panelKey: 'favToken',
  scrollHeightCenterOffset: 15,
  isLargeWidthThreshold: 720
})
</script>
