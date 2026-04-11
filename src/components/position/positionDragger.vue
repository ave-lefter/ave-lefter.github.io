<template>
  <Draggable
    :class="{ 'left-drag': positionStore.isLeftFixed, 'right-drag': positionStore.isRightFixed }"
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

const positionStore = usePositionStore()
const { placement } = storeToRefs(positionStore)
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
  boundingRect: computed(() => positionStore.positionBoundingRect),
  fixedWidth: computed(() => positionStore.fixedWidth),
  winHeight: positionStore.winHeight,
  visible: computed(() => positionStore.visible),
  isLeftFixed: computed(() => positionStore.isLeftFixed),
  isRightFixed: computed(() => positionStore.isRightFixed),
  onLeftDragStop: positionStore.onLeftDragStop.bind(positionStore),
  onRightDragStop: positionStore.onRightDragStop.bind(positionStore),
  onDragStop: positionStore.onDragStop.bind(positionStore),
  onFixedResizing: positionStore.onFixedResizing.bind(positionStore),
  onResizing: positionStore.onResizing.bind(positionStore),
  onDrag: positionStore.onDrag.bind(positionStore),
  loadComponent: () => import('./index.vue'),
  panelKey: 'position',
  scrollHeightCenterOffset: 15,
  scrollHeightSideOffset: 90,
  isLargeWidthThreshold: 720,
  minWidth: lang.value.indexOf('zh') > -1 ? 290 : 300,
  maxWidth: 388,
})
</script>
